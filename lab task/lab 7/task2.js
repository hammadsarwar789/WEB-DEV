/**
 * LAB 7 - TASK 2: Resilient Course Registration Interface (task2.js)
 * Concurrent Fetching with Promise.all, Async/Await & Distinct Error Handling
 */

document.addEventListener("DOMContentLoaded", () => {
    // Endpoints (default to local mock JSON files)
    let coursesUrl = "courses.json";
    let settingsUrl = "settings.json";

    // DOM Elements
    const loadingIndicator = document.getElementById("loadingIndicator");
    const registrationContent = document.getElementById("registrationContent");
    const errorBanner = document.getElementById("errorBanner");
    const errorTitle = document.getElementById("errorTitle");
    const errorDesc = document.getElementById("errorDesc");
    const retryBtn = document.getElementById("retryBtn");

    const statusBanner = document.getElementById("statusBanner");
    const statusText = document.getElementById("statusText");
    const statusBadge = document.getElementById("statusBadge");

    const courseSelect = document.getElementById("courseSelect");
    const coursePreview = document.getElementById("coursePreview");
    const prevTitle = document.getElementById("prevTitle");
    const prevInstructor = document.getElementById("prevInstructor");
    const prevCredits = document.getElementById("prevCredits");
    const prevSeats = document.getElementById("prevSeats");
    const prevDept = document.getElementById("prevDept");

    const studentNameInput = document.getElementById("studentName");
    const studentIdInput = document.getElementById("studentId");
    const submitBtn = document.getElementById("submitBtn");
    const registrationForm = document.getElementById("registrationForm");

    // Simulation Trigger Buttons
    const simNormalBtn = document.getElementById("simNormal");
    const sim404Btn = document.getElementById("sim404");
    const simJsonErrorBtn = document.getElementById("simJsonError");
    const simClosedBtn = document.getElementById("simClosed");

    // In-memory cache for loaded courses
    let loadedCourses = [];

    /**
     * Resilient fetcher helper that checks HTTP status before parsing JSON
     * Differentiates HTTP errors, JSON syntax errors, and network disconnects.
     */
    async function fetchResource(url) {
        let response;
        try {
            response = await fetch(url);
        } catch (networkError) {
            // Distinct error: Network connection dropped / CORS / DNS failure
            throw new Error(`NETWORK_ERROR: Unable to connect to "${url}". Please check your internet connection or server status.`);
        }

        // Distinct error: HTTP Status Codes (404 Not Found, 500 Internal Server Error, etc.)
        if (!response.ok) {
            throw new Error(`HTTP_ERROR_${response.status}: Request to "${url}" failed with HTTP status ${response.status} (${response.statusText || 'Error'}).`);
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonErr) {
            // Distinct error: JSON parsing failure (malformed or corrupt response)
            throw new Error(`JSON_PARSE_ERROR: The response from "${url}" could not be parsed as valid JSON.`);
        }
    }

    /**
     * Concurrently loads both courses.json and settings.json using Promise.all
     */
    async function loadRegistrationData() {
        // UI State: Show Loading Spinner, hide errors & content
        loadingIndicator.style.display = "flex";
        registrationContent.style.display = "none";
        errorBanner.classList.remove("show");

        try {
            // Concurrent execution via Promise.all
            const [coursesData, settingsData] = await Promise.all([
                fetchResource(coursesUrl),
                fetchResource(settingsUrl)
            ]);

            // Validate payload structure
            if (!Array.isArray(coursesData)) {
                throw new Error("SCHEMA_ERROR: 'courses.json' was expected to contain an array of course objects.");
            }

            loadedCourses = coursesData;

            // Populate course select options
            populateCoursesDropdown(loadedCourses);

            // Apply Registration Window Settings
            applySystemSettings(settingsData);

            // UI State: Reveal form content
            loadingIndicator.style.display = "none";
            registrationContent.style.display = "block";

            console.log("Successfully loaded courses and settings:", { coursesData, settingsData });

        } catch (err) {
            // Robust error categorization & visible feedback
            displayErrorFeedback(err);
        }
    }

    /**
     * Categorizes and displays errors in the UI with distinct recovery guidance
     */
    function displayErrorFeedback(err) {
        loadingIndicator.style.display = "none";
        registrationContent.style.display = "none";
        errorBanner.classList.add("show");

        const msg = err.message || "";

        if (msg.startsWith("HTTP_ERROR_404")) {
            errorTitle.textContent = "404 Resource Not Found";
            errorDesc.textContent = "The requested course catalogue or system settings could not be found on the server. Please verify the endpoint path and try again.";
        } else if (msg.startsWith("HTTP_ERROR_500")) {
            errorTitle.textContent = "500 Server Processing Error";
            errorDesc.textContent = "The registration backend encountered an internal exception. Please wait a few moments and try reloading.";
        } else if (msg.startsWith("JSON_PARSE_ERROR")) {
            errorTitle.textContent = "Data Format / JSON Parsing Error";
            errorDesc.textContent = "Received malformed data that could not be parsed as valid JSON. The server response may be corrupted.";
        } else if (msg.startsWith("NETWORK_ERROR")) {
            errorTitle.textContent = "Network Connection Disconnected";
            errorDesc.textContent = "Could not establish a connection to the server. Please ensure you are online and that no firewall is blocking access.";
        } else {
            errorTitle.textContent = "Registration Interface Error";
            errorDesc.textContent = msg || "An unexpected error occurred while initializing course registration.";
        }

        console.error("Course Registration Error Caught:", err);
    }

    /**
     * Populates the course select dropdown using safe DOM elements
     */
    function populateCoursesDropdown(courses) {
        courseSelect.innerHTML = '<option value="">-- Choose a Course to Register --</option>';

        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.id;
            option.textContent = `${course.id} - ${course.title} (${course.credits} Cr)`;
            courseSelect.appendChild(option);
        });

        coursePreview.classList.remove("show");
    }

    /**
     * Checks settings.registrationOpen and updates registration availability
     */
    function applySystemSettings(settings) {
        const isOpen = Boolean(settings && settings.registrationOpen);

        if (isOpen) {
            statusBanner.className = "status-banner open";
            statusText.textContent = settings.systemNotice || "Registration is currently OPEN.";
            statusBadge.className = "badge badge-open";
            statusBadge.textContent = "Portal Active";

            submitBtn.disabled = false;
            submitBtn.textContent = "Confirm Course Registration";
        } else {
            statusBanner.className = "status-banner closed";
            statusText.textContent = settings.systemNotice || "Course registration is CLOSED for this semester.";
            statusBadge.className = "badge badge-closed";
            statusBadge.textContent = "Closed";

            submitBtn.disabled = true;
            submitBtn.textContent = "Registration Window Closed";
        }
    }

    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================

    // Course Selection Details Preview
    courseSelect.addEventListener("change", () => {
        const selectedId = courseSelect.value;
        const course = loadedCourses.find(c => c.id === selectedId);

        if (course) {
            prevTitle.textContent = `${course.id}: ${course.title}`;
            prevInstructor.textContent = course.instructor;
            prevCredits.textContent = `${course.credits} Credit Hours`;
            prevSeats.textContent = `${course.seatsAvailable} Seats Left`;
            prevDept.textContent = course.department;
            coursePreview.classList.add("show");
        } else {
            coursePreview.classList.remove("show");
        }
    });

    // Form Submission
    registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = studentNameInput.value.trim();
        const studentId = studentIdInput.value.trim();
        const courseId = courseSelect.value;

        if (!name || !studentId || !courseId) {
            alert("Please complete all fields before confirming registration.");
            return;
        }

        const selectedCourse = loadedCourses.find(c => c.id === courseId);

        alert(`✓ Registration Success!\nStudent: ${name} (${studentId})\nCourse: ${selectedCourse.title} (${selectedCourse.id})\nStatus: Enrolled.`);

        registrationForm.reset();
        coursePreview.classList.remove("show");
    });

    // Retry Button Handler
    retryBtn.addEventListener("click", () => {
        loadRegistrationData();
    });

    // =========================================================================
    // SIMULATION TESTING CONTROLS (For Verification & Grading)
    // =========================================================================
    function setActiveSimBtn(activeBtn) {
        [simNormalBtn, sim404Btn, simJsonErrorBtn, simClosedBtn].forEach(b => {
            if (b) b.classList.remove("active");
        });
        if (activeBtn) activeBtn.classList.add("active");
    }

    if (simNormalBtn) {
        simNormalBtn.addEventListener("click", () => {
            coursesUrl = "courses.json";
            settingsUrl = "settings.json";
            setActiveSimBtn(simNormalBtn);
            loadRegistrationData();
        });
    }

    if (sim404Btn) {
        sim404Btn.addEventListener("click", () => {
            coursesUrl = "courses-missing-404.json"; // Non-existent URL to trigger 404 HTTP Error
            settingsUrl = "settings.json";
            setActiveSimBtn(sim404Btn);
            loadRegistrationData();
        });
    }

    if (simJsonErrorBtn) {
        simJsonErrorBtn.addEventListener("click", () => {
            coursesUrl = "task2.css"; // Fetching CSS as JSON triggers SyntaxError JSON_PARSE_ERROR
            settingsUrl = "settings.json";
            setActiveSimBtn(simJsonErrorBtn);
            loadRegistrationData();
        });
    }

    if (simClosedBtn) {
        simClosedBtn.addEventListener("click", () => {
            coursesUrl = "courses.json";
            // Mock a closed settings data inline
            setActiveSimBtn(simClosedBtn);
            loadingIndicator.style.display = "flex";
            registrationContent.style.display = "none";
            errorBanner.classList.remove("show");

            setTimeout(async () => {
                const courses = await fetchResource("courses.json");
                populateCoursesDropdown(courses);
                applySystemSettings({
                    registrationOpen: false,
                    semester: "Fall 2026",
                    systemNotice: "Notice: The add/drop deadline has expired. Course registration is now formally CLOSED."
                });
                loadingIndicator.style.display = "none";
                registrationContent.style.display = "block";
            }, 300);
        });
    }

    // Initial load on startup
    loadRegistrationData();
});
