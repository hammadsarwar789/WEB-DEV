/**
 * LAB 7 - TASK 1: Workshop Registration with Review List (task1.js)
 * Form Validation, Regular Expressions, Safe DOM Generation & Delegated Events
 */

document.addEventListener("DOMContentLoaded", () => {
    // Regular Expression Patterns
    const WORKSHOP_CODE_REGEX = /^[1-4][A-Z]{2}\d{2}[A-Z]{2}\d{3}$/;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_MIN_LEN = 10;
    const HAS_UPPERCASE = /[A-Z]/;
    const HAS_LOWERCASE = /[a-z]/;
    const HAS_DIGIT = /\d/;
    const HAS_SYMBOL = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const NO_SPACES = /^\S+$/;

    // DOM Form Elements
    const form = document.getElementById("registrationForm");
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const codeInput = document.getElementById("workshopCode");
    const programmeSelect = document.getElementById("programme");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const tagsInput = document.getElementById("topicTags");

    // Review List & Output Elements
    const reviewList = document.getElementById("reviewList");
    const emptyState = document.getElementById("emptyState");
    const reviewCountBadge = document.getElementById("reviewCountBadge");
    const jsonPreviewBox = document.getElementById("jsonPreviewBox");

    // In-memory store for valid registered candidates (EXCLUDING PASSWORDS)
    const registeredSubmissions = [];

    /**
     * Clears previous error states from an input
     */
    function clearError(inputElement, errorElementId) {
        inputElement.classList.remove("is-invalid");
        const errorEl = document.getElementById(errorElementId);
        if (errorEl) errorEl.textContent = "";
    }

    /**
     * Sets error state on an input
     */
    function setError(inputElement, errorElementId, message) {
        inputElement.classList.add("is-invalid");
        const errorEl = document.getElementById(errorElementId);
        if (errorEl) errorEl.textContent = message;
    }

    /**
     * Parses and cleans comma/semicolon-separated tags
     * @param {string} rawString 
     * @returns {string[]} Cleaned non-empty unique tags
     */
    function parseTopicTags(rawString) {
        if (!rawString || typeof rawString !== "string") return [];
        return rawString
            .split(/[,;]+/)
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    }

    /**
     * Validates all form inputs. Returns false if any input is invalid.
     */
    function validateForm() {
        let isValid = true;

        // 1. Full Name Validation
        const fullName = nameInput.value.trim();
        if (fullName.length < 3) {
            setError(nameInput, "nameError", "Full Name must contain at least 3 characters.");
            isValid = false;
        } else {
            clearError(nameInput, "nameError");
        }

        // 2. Email Validation
        const email = emailInput.value.trim();
        if (!EMAIL_REGEX.test(email)) {
            setError(emailInput, "emailError", "Please enter a valid email address (e.g., student@domain.com).");
            isValid = false;
        } else {
            clearError(emailInput, "emailError");
        }

        // 3. Workshop Code Validation (Exact Regex: ^[1-4][A-Z]{2}\d{2}[A-Z]{2}\d{3}$)
        const code = codeInput.value.trim();
        if (!WORKSHOP_CODE_REGEX.test(code)) {
            setError(codeInput, "codeError", "Code must match format: [1-4][2 UPPER][2 DIGITS][2 UPPER][3 DIGITS] (e.g. 1CS24WD101).");
            isValid = false;
        } else {
            clearError(codeInput, "codeError");
        }

        // 4. Programme Selection
        const programme = programmeSelect.value;
        if (!programme || (programme !== "BSCS" && programme !== "BSSE")) {
            setError(programmeSelect, "programmeError", "Please select either BSCS or BSSE.");
            isValid = false;
        } else {
            clearError(programmeSelect, "programmeError");
        }

        // 5. Password Validation (10+ chars, uppercase, lowercase, digit, symbol, no spaces)
        const password = passwordInput.value;
        if (password.length < PASSWORD_MIN_LEN) {
            setError(passwordInput, "passwordError", "Password must be at least 10 characters long.");
            isValid = false;
        } else if (!HAS_UPPERCASE.test(password)) {
            setError(passwordInput, "passwordError", "Password must contain at least one uppercase letter.");
            isValid = false;
        } else if (!HAS_LOWERCASE.test(password)) {
            setError(passwordInput, "passwordError", "Password must contain at least one lowercase letter.");
            isValid = false;
        } else if (!HAS_DIGIT.test(password)) {
            setError(passwordInput, "passwordError", "Password must contain at least one number.");
            isValid = false;
        } else if (!HAS_SYMBOL.test(password)) {
            setError(passwordInput, "passwordError", "Password must contain at least one special symbol (!@#$%^&*...).");
            isValid = false;
        } else if (!NO_SPACES.test(password)) {
            setError(passwordInput, "passwordError", "Password must not contain any spaces.");
            isValid = false;
        } else {
            clearError(passwordInput, "passwordError");
        }

        // 6. Confirm Password Validation
        const confirmPassword = confirmPasswordInput.value;
        if (confirmPassword !== password) {
            setError(confirmPasswordInput, "confirmPasswordError", "Passwords do not match.");
            isValid = false;
        } else if (confirmPassword.length === 0) {
            setError(confirmPasswordInput, "confirmPasswordError", "Please confirm your password.");
            isValid = false;
        } else {
            clearError(confirmPasswordInput, "confirmPasswordError");
        }

        // 7. Topic Tags Validation
        const rawTags = tagsInput.value;
        const cleanedTags = parseTopicTags(rawTags);
        if (cleanedTags.length === 0) {
            setError(tagsInput, "tagsError", "Please provide at least one topic tag (separated by commas or semicolons).");
            isValid = false;
        } else {
            clearError(tagsInput, "tagsError");
        }

        return isValid;
    }

    /**
     * Safe DOM creation for review item (EXCLUDING PASSWORDS)
     * Strictly avoids innerHTML for untrusted user data.
     */
    function createReviewItemElement(record) {
        const li = document.createElement("li");
        li.className = "review-item";
        li.dataset.submissionId = record.id;

        // Header container (Name, Email, Delete Button)
        const headerDiv = document.createElement("div");
        headerDiv.className = "review-item-header";

        const titleDiv = document.createElement("div");
        const nameEl = document.createElement("div");
        nameEl.className = "review-name";
        nameEl.textContent = record.fullName; // Safe textContent

        const emailEl = document.createElement("div");
        emailEl.className = "review-email";
        emailEl.textContent = record.email;

        titleDiv.append(nameEl, emailEl);

        // Delete button for delegated event listener
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn-delete";
        deleteBtn.setAttribute("data-action", "delete-submission");
        deleteBtn.textContent = "Remove ✕";

        headerDiv.append(titleDiv, deleteBtn);

        // Meta details (Programme, Workshop Code, Timestamp)
        const metaDiv = document.createElement("div");
        metaDiv.className = "review-meta";

        const progSpan = document.createElement("span");
        progSpan.textContent = `Programme: ${record.programme}`;

        const codeSpan = document.createElement("span");
        codeSpan.textContent = "Code: ";
        const codeBadge = document.createElement("span");
        codeBadge.className = "code-badge";
        codeBadge.textContent = record.workshopCode;
        codeSpan.appendChild(codeBadge);

        const timeSpan = document.createElement("span");
        timeSpan.textContent = `Submitted: ${record.submittedAt}`;

        metaDiv.append(progSpan, codeSpan, timeSpan);

        // Tags List
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "tags-container";

        record.tags.forEach(tagText => {
            const tagBadge = document.createElement("span");
            tagBadge.className = "tag-badge";
            tagBadge.textContent = `#${tagText}`;
            tagsContainer.appendChild(tagBadge);
        });

        // Assemble item
        li.append(headerDiv, metaDiv, tagsContainer);
        return li;
    }

    /**
     * Updates UI preview payload and count indicator
     */
    function updateReviewUI() {
        reviewCountBadge.textContent = `${registeredSubmissions.length} registered`;
        
        if (registeredSubmissions.length === 0) {
            emptyState.style.display = "block";
            jsonPreviewBox.textContent = "// No submissions yet.";
        } else {
            emptyState.style.display = "none";
            // JSON preview with passwords strictly omitted
            jsonPreviewBox.textContent = JSON.stringify(registeredSubmissions, null, 2);
        }
    }

    // =========================================================================
    // FORM SUBMIT HANDLER
    // =========================================================================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Extract and clean values (Passwords are intentionally EXCLUDED from saved payload)
        const submissionRecord = {
            id: Date.now().toString(),
            fullName: nameInput.value.trim(),
            email: emailInput.value.trim(),
            workshopCode: codeInput.value.trim(),
            programme: programmeSelect.value,
            tags: parseTopicTags(tagsInput.value),
            submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        // Add to in-memory store
        registeredSubmissions.push(submissionRecord);

        // Append safely to DOM review list
        const reviewElement = createReviewItemElement(submissionRecord);
        reviewList.appendChild(reviewElement);

        // Refresh UI summary and JSON preview
        updateReviewUI();

        // Reset form inputs & clear errors
        form.reset();
        clearError(nameInput, "nameError");
        clearError(emailInput, "emailError");
        clearError(codeInput, "codeError");
        clearError(programmeSelect, "programmeError");
        clearError(passwordInput, "passwordError");
        clearError(confirmPasswordInput, "confirmPasswordError");
        clearError(tagsInput, "tagsError");

        nameInput.focus();
    });

    // =========================================================================
    // DELEGATED EVENT HANDLING ON PARENT REVIEW LIST CONTAINER
    // Listens for clicks on any child .btn-delete to remove entry
    // =========================================================================
    reviewList.addEventListener("click", (e) => {
        const deleteButton = e.target.closest('[data-action="delete-submission"]');
        if (!deleteButton) return;

        const reviewItemLi = deleteButton.closest(".review-item");
        if (!reviewItemLi) return;

        const submissionId = reviewItemLi.dataset.submissionId;

        // Remove from DOM
        reviewItemLi.remove();

        // Remove from in-memory array
        const index = registeredSubmissions.findIndex(item => item.id === submissionId);
        if (index !== -1) {
            registeredSubmissions.splice(index, 1);
        }

        // Sync count badge and JSON preview
        updateReviewUI();
    });
});
