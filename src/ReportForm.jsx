import { useState, useEffect } from "react";
import "./ReportForm.css";

export default function ReportForm() {
  const [submitted, setSubmitted] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    need: "",
    location: "",
    description: "",
    urgency: "Soon",
    reporterName: "",
    contact: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);
    setPhotoPreview("");

    const input = document.getElementById("personPhoto");

    if (input) {
      input.value = "";
    }
  }

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  async function handleSubmit(event) {
  event.preventDefault();

  const requiredFields = [
    { value: form.need, label: "type of help" },
    { value: form.location.trim(), label: "location" },
    { value: form.description.trim(), label: "description" },
  ];

  const emptyFields = requiredFields.filter(
    (field) => !field.value
  );

  if (emptyFields.length > 0) {
    setError(
      `Please fill in the following required fields: ${emptyFields
        .map((field) => field.label)
        .join(", ")}.`
    );
    return;
  }

  if (form.description.trim().length < 10) {
    setError(
      "Please describe the situation in at least 10 characters."
    );
    return;
  }

  setError("");

  try {
    const reportData = new FormData();

    reportData.append("need", form.need);
    reportData.append("location", form.location.trim());
    reportData.append("description", form.description.trim());
    reportData.append("urgency", form.urgency);
    reportData.append("reporterName", form.reporterName.trim());
    reportData.append("contact", form.contact.trim());

    if (photo) {
      reportData.append("personPhoto", photo);
    }

    const response = await fetch(
      "http://localhost:5000/api/reports",
      {
        method: "POST",
        body: reportData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to submit report."
      );
    }

    setSubmitted(true);
  } catch (error) {
    setError(
      error.message ||
        "Could not connect to the Sahaya server. Please try again."
    );
  }
}

  return (
    <section className="report-page">
      <div className="report-card">
        <p className="report-eyebrow">
          SAHAYA · COMMUNITY CARE
        </p>

        <h1>Report Someone in Need</h1>

        <p className="report-intro">
          Your kindness can connect someone with the
          support they deserve. Tell us a little about
          their situation.
        </p>

        {submitted ? (
          <div className="report-success" role="status">
            <h2>Thank you for caring ❤️</h2>

            <p>
  Your report has been submitted successfully.
  Thank you for helping connect someone with care. ❤️
</p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
            >
              Back to form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
          {error && (
  <p className="report-error" role="alert">
    {error}
  </p>
)}
            <label htmlFor="need">
              What help is needed? *
            </label>

            <select
              id="need"
              name="need"
              value={form.need}
              onChange={handleChange}
              required
            >
              <option value="">Select a type of help</option>
              <option value="Food and essentials">
                Food and essentials
              </option>
              <option value="Shelter">
                Shelter or housing
              </option>
              <option value="Medical assistance">
                Medical assistance
              </option>
              <option value="Emotional support">
                Emotional or community support
              </option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="urgency">
              How urgent is the situation? *
            </label>

            <select
              id="urgency"
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              required
            >
              <option value="Immediately">Immediately</option>
              <option value="Soon">Soon</option>
              <option value="Not urgent">Not urgent</option>
            </select>

            <label htmlFor="location">
              General location *
            </label>

            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Area, town or locality"
              required
              maxLength={150}
            />

            <label htmlFor="description">
              Describe the situation *
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain what help may be needed..."
              rows={5}
              required
              minLength={10}
              maxLength={1000}
            />

            <p className="report-note">
              Please do not include identity numbers,
              exact home addresses or unnecessary
              private medical details.
            </p>

            <label htmlFor="reporterName">
              Your name (optional)
            </label>

            <input
              id="reporterName"
              name="reporterName"
              value={form.reporterName}
              onChange={handleChange}
              placeholder="Your name"
              maxLength={100}
            />

            <label htmlFor="contact">
              Your contact details (optional)
            </label>

            <input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Phone number or email"
              maxLength={150}
            />

            {/* Photo upload section */}
            <div className="form-group">
              <label htmlFor="personPhoto">
                Upload a photo or take a picture
              </label>

              <input
                id="personPhoto"
                name="personPhoto"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
              />

              <small>
                Choose an image up to 5 MB.
                Only share a person's photo when appropriate
                and with their permission where possible.
              </small>

              {photoPreview && (
                <div className="photo-preview">
                  <p>Selected photo preview</p>

                  <img
                    src={photoPreview}
                    alt="Selected report photo"
                    className="preview-image"
                  />

                  <button
                    type="button"
                    className="remove-photo-button"
                    onClick={removePhoto}
                  >
                    Remove photo ✕
                  </button>
                </div>
              )}
            </div>

            <button
              className="report-submit"
              type="submit"
            >
              Submit Report →
            </button>

            <p className="report-note">
              This form is a demo and is not monitored.
              For immediate danger, contact local
              emergency services.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}