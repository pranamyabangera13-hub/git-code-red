require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
console.log("Supabase URL loaded:", !!process.env.SUPABASE_URL);
console.log("Supabase key loaded:", !!process.env.SUPABASE_KEY);

console.log(
  "Backend project:",
  new URL(process.env.SUPABASE_URL).hostname
);

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

app.post("/api/reports", async(req, res, next) => {
  upload.single("personPhoto")(req, res, async (err) => {
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
    
    console.log("Report status being sent:", "Pending");
    
    console.log("Supabase client role:", "anon (publishable key)");
console.log("Status:", "Pending");
    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          help_type: need,
          location,
          description,
          urgency,
          reporter_name: reporterName || "",
          reporter_contact: contact || "",
          photo_url: null,
          status: "Pending",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        message:error.message || "Failed to save the report.",
      });
    }

    res.status(201).json({
      message: "Report saved successfully!",
      report: data[0],
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