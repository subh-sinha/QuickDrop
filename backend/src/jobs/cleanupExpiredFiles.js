import cron from "node-cron";
import File from "../models/file.model.js";
import { cloudinary } from "../utils/fileUpload.js";

/**
 * Task to clean up expired files from both Cloudinary and MongoDB
 */
export const cleanupExpiredFiles = async () => {
  try {
    const now = new Date();
    // Query MongoDB for all documents where expiresAt <= current date/time
    const expiredFiles = await File.find({ expiresAt: { $lte: now } });

    if (!expiredFiles || expiredFiles.length === 0) {
      return;
    }

    console.log(`[Cleanup Job] Found ${expiredFiles.length} expired file(s) to remove.`);

    for (const file of expiredFiles) {
      try {
        const resourceType = file.resourceType || "raw";
        
        // 1. Delete file from Cloudinary storage
        const destroyResult = await cloudinary.uploader.destroy(file.publicId, {
          resource_type: resourceType,
        });

        console.log(`[Cleanup Job] Cloudinary destroy result for ${file.publicId}:`, destroyResult);

        // 2. Only delete MongoDB record if Cloudinary deletion succeeded ('ok' or 'not found')
        if (destroyResult.result === "ok" || destroyResult.result === "not found") {
          await File.deleteOne({ _id: file._id });
          console.log(
            `[Cleanup Job] Successfully removed expired file "${file.originalName}" (Token: ${file.token}, Public ID: ${file.publicId})`
          );
        } else {
          console.warn(
            `[Cleanup Job] Cloudinary deletion returned status "${destroyResult.result}" for token ${file.token}. Skipping MongoDB document deletion so it can retry later.`
          );
        }
      } catch (fileErr) {
        console.error(
          `[Cleanup Job] Failed to delete file with token ${file.token} from Cloudinary:`,
          fileErr.message || fileErr
        );
      }
    }
  } catch (err) {
    console.error("[Cleanup Job] Error running cleanup job:", err.message || err);
  }
};

// Schedule cleanup job to run every minute
cron.schedule("* * * * *", () => {
  cleanupExpiredFiles();
});

console.log("[Cleanup Job] Expired files cleanup scheduler initialized (Interval: Every minute).");
