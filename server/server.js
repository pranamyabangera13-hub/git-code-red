require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("Missing Supabase environment variables. Check server/.env.");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Used only for private Storage uploads on the backend.
const supabaseStorage = process.env.SUPABASE_SECRET_KEY
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY
    )
  : null;

const PHOTO_BUCKET = "report-photos";

console.log("Supabase URL loaded:", !!process.env.SUPABASE_URL);
console.log("Supabase key loaded:", !!process.env.SUPABASE_KEY);
console.log(
  "Backend project:",
  new URL(process.env.SUPABASE_URL).hostname
);

app.use(cors());
app.use(express.json());

const allowedImageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (allowedImageTypes[file.mimetype]) {
      callback(null, true);
    } else {
      callback(
        new Error("Please upload a JPG, PNG, or WebP image.")
      );
    }
  },
});

app.get("/", (req, res) => {
  res.json({
    message: "Sahaya backend is running successfully!",
  });
});

app.post("/api/reports", (req, res, next) => {
  upload.single("personPhoto")(req, res, async (err) => {
    try {
      if (err) return next(err);

      const {
        need,
        location,
        description,
        urgency,
        reporterName,
        contact,
      } = req.body;

      if (
        !need?.trim() ||
        !location?.trim() ||
        !description?.trim() ||
        description.trim().length < 10
      ) {
        return res.status(400).json({
          message:
            "Please provide the help needed, location, and a description of at least 10 characters.",
        });
      }

      const validNeeds = [
        "Food and essentials",
        "Shelter",
        "Medical assistance",
        "Emotional support",
        "Other",
      ];

      const validUrgencies = [
        "Immediately",
        "Soon",
        "Not urgent",
      ];

      if (
        !validNeeds.includes(need) ||
        !validUrgencies.includes(urgency)
      ) {
        return res.status(400).json({
          message: "Please select valid report options.",
        });
      }

      // Remains null when the report has no photo.
      let photoPath = null;

      // Upload a photo only if one was attached.
      if (req.file) {
        if (!supabaseStorage) {
          return res.status(500).json({
            message:
              "Photo upload is not configured. Check the backend environment settings.",
          });
        }

        const extension = allowedImageTypes[req.file.mimetype];
        const fileName = `${crypto.randomUUID()}.${extension}`;

        const { error: photoError } = await supabaseStorage.storage
          .from(PHOTO_BUCKET)
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (photoError) {
          console.error("Photo upload failed:", photoError.message);

          return res.status(500).json({
            message: "Failed to upload the photo. Please try again.",
          });
        }

        // Save the object path, not a public URL.
        photoPath = fileName;
      }

      const reportToInsert = {
        help_type: need,
        location,
        description,
        urgency,
        reporter_name: reporterName || "",
        reporter_contact: contact || "",
        photo_url: photoPath,
        status: "Pending",
      };

      console.log("Submitting to reports:", {
        ...reportToInsert,
        location: "[hidden]",
        description: "[hidden]",
        reporter_contact: "[hidden]",
      });

      // Keep the working insert exactly as before.
      const { error } = await supabase
        .from("reports")
        .insert([reportToInsert]);

      if (error) {
        console.error("Supabase error:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        // Clean up the uploaded file if saving the report fails.
        if (photoPath && supabaseStorage) {
          const { error: cleanupError } =
            await supabaseStorage.storage
              .from(PHOTO_BUCKET)
              .remove([photoPath]);

          if (cleanupError) {
            console.error(
              "Photo cleanup failed:",
              cleanupError.message
            );
          }
        }

        return res.status(500).json({
          message: error.message || "Failed to save the report.",
        });
      }

      console.log("Report saved successfully.");

      return res.status(201).json({
        message: "Report saved successfully",
      });
    } catch (error) {
      console.error("Unexpected report error:", error.message);

      return res.status(500).json({
        message: "An unexpected error occurred while saving the report.",
      });
    }
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Photo must be smaller than 5 MB."
          : "Photo upload failed.",
    });
  }

  if (err) {
    return res.status(400).json({
      message: err.message || "Something went wrong.",
    });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Sahaya backend running at http://localhost:${PORT}`);
});