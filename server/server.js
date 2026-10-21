const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Please upload an image."));
    }
  },
});

app.get("/", (req, res) => {
  res.json({
    message: "Sahaya backend is running successfully!",
  });
});

app.post("/api/reports", (req, res, next) => {
  upload.single("personPhoto")(req, res, (err) => {
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

    res.status(201).json({
      message:
        "Report received successfully! Permanent storage is not configured yet.",
      report: {
        need,
        location,
        description,
        urgency,
        reporterName: reporterName || "",
        contact: contact || "",
        photoReceived: Boolean(req.file),
      },
    });
  });
});

app.use((err, req, res, next) => {
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
  console.log(
    `Sahaya backend running at http://localhost:${PORT}`
  );
});