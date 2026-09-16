import File from "../models/file.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asynchHandler } from "../utils/asyncHandler.js";
import uploadFile, { cloudinary } from "../utils/fileUpload.js";

const generateToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const uploadController = asynchHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded. Please attach a file.");
  }

  // Upload file buffer to Cloudinary
  const fileResult = await uploadFile(req.file.buffer);

  if (!fileResult || !fileResult.secure_url) {
    throw new ApiError(500, "Something went wrong while uploading file to storage.");
  }

  // Generate unique 6-digit token
  let token;
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    token = generateToken();
    const existing = await File.findOne({ token });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes TTL

  const file = await File.create({
    token,
    originalName: req.file.originalname,
    publicId: fileResult.public_id,
    resourceType: fileResult.resource_type || "auto",
    fileUrl: fileResult.secure_url,
    mimeType: req.file.mimetype,
    size: req.file.size,
    expiresAt,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        token: file.token,
        expiresAt: file.expiresAt,
      },
      "File uploaded successfully"
    )
  );
});

const downloadController = asynchHandler(async (req, res) => {
  const { token } = req.params;

  if (!token || token.trim().length !== 6) {
    throw new ApiError(400, "Invalid 6-digit transfer token format");
  }

  const file = await File.findOne({ token: token.trim() });

  if (!file) {
    throw new ApiError(404, "No file found for this transfer code");
  }

  // Enforce expiration check (10 minutes limit)
  if (new Date() > new Date(file.expiresAt)) {
    throw new ApiError(410, "This transfer token has expired");
  }

  let cleanPublicId = file.publicId;
  let fileExtension = file.originalName.includes(".")
    ? file.originalName.split(".").pop().toLowerCase()
    : "";

  if (fileExtension && cleanPublicId.toLowerCase().endsWith(`.${fileExtension}`)) {
    cleanPublicId = cleanPublicId.slice(0, -(fileExtension.length + 1));
  }

  // Build high-speed signed Cloudinary download URL
  let downloadUrl = "";
  try {
    downloadUrl = cloudinary.utils.private_download_url(
      cleanPublicId,
      fileExtension,
      {
        resource_type: file.resourceType || "image",
        type: "upload",
        attachment: true,
      }
    );
  } catch (err) {
    downloadUrl = file.fileUrl;
  }

  // Redirect instead of proxying through this server. This keeps the file on
  // Cloudinary's CDN path and lets the browser stream straight to disk.
  return res.redirect(302, downloadUrl || file.fileUrl);
});

export { uploadController, downloadController };
