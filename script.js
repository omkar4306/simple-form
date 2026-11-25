const form = document.getElementById("contact-form");
const success = document.getElementById("success");
const counter = document.getElementById("counter");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  message: document.getElementById("message"),
};

// Each validator returns an error message, or "" if the value is fine
const validators = {
  name(value) {
    if (value === "") return "Name is required.";
    if (value.length < 2) return "Name must be at least 2 characters.";
    if (!/^[A-Za-z\s.'-]+$/.test(value)) return "Name can only contain letters and spaces.";
    return "";
  },
  email(value) {
    if (value === "") return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email, e.g. name@example.com.";
    return "";
  },
  phone(value) {
    if (value === "") return "Phone number is required.";
    const digits = value.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
    if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit mobile number.";
    return "";
  },
  message(value) {
    if (value === "") return "Message cannot be empty.";
    if (value.length < 10) return "Message must be at least 10 characters.";
    return "";
  },
};

function validateField(name) {
  const input = fields[name];
  const error = validators[name](input.value.trim());
  const wrapper = input.closest(".field");

  document.getElementById(name + "-error").textContent = error;
  wrapper.classList.toggle("invalid", error !== "");
  wrapper.classList.toggle("valid", error === "");
  return error === "";
}

// Validate when the user leaves a field, and re-check while typing once it's been marked invalid
Object.keys(fields).forEach((name) => {
  fields[name].addEventListener("blur", () => validateField(name));
  fields[name].addEventListener("input", () => {
    if (fields[name].closest(".field").classList.contains("invalid")) validateField(name);
  });
});

// Character counter for the message box
fields.message.addEventListener("input", () => {
  counter.textContent = fields.message.value.length + " / 300";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // validate every field (no short-circuit, so all errors show at once)
  const results = Object.keys(fields).map(validateField);
  const allValid = results.every(Boolean);

  if (!allValid) {
    const firstInvalid = form.querySelector(".invalid input, .invalid textarea");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // No backend in this task, so we just show a success message
  form.hidden = true;
  success.hidden = false;
});

document.getElementById("again").addEventListener("click", () => {
  form.reset();
  counter.textContent = "0 / 300";
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
  form.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  success.hidden = true;
  form.hidden = false;
  fields.name.focus();
});
