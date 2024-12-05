document.addEventListener("DOMContentLoaded", () => {
    const areas = document.querySelectorAll("map[name='image-map'] area");

    // Create an info box for hover interaction
    const infoBox = document.createElement("div");
    infoBox.className = "info-box";
    document.body.appendChild(infoBox);

    areas.forEach((area) => {
        area.addEventListener("mouseenter", (event) => {
            const title = area.getAttribute("title");
            if (title) {
                infoBox.textContent = title;
                infoBox.style.display = "block";
                infoBox.style.left = `${event.pageX + 10}px`;
                infoBox.style.top = `${event.pageY + 10}px`;
            }
        });

        area.addEventListener("mousemove", (event) => {
            infoBox.style.left = `${event.pageX + 10}px`;
            infoBox.style.top = `${event.pageY + 10}px`;
        });

        area.addEventListener("mouseleave", () => {
            infoBox.style.display = "none";
        });
    });
});
// JavaScript for Page Bar
const totalIndicators = 13;
const indicators = document.querySelectorAll('.page-indicator');

// Function to update active indicator
function updateActiveIndicator(index) {
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Example: Activate the first indicator by default
let currentIndex = 0; // Example index
updateActiveIndicator(currentIndex);

// JavaScript for Image Switching and Page Bar
const totalImages = 13; // Total number of images
let currentIndex = 0; // Start with the first image

// Get all image elements and page indicators
const images = document.querySelectorAll(".organ-image");
const indicators = document.querySelectorAll(".page-indicator");

// Function to update the displayed image and active indicator
function updateDisplay() {
    // Show only the current image
    images.forEach((img, index) => {
        if (index === currentIndex) {
            img.classList.add("active");
        } else {
            img.classList.remove("active");
        }
    });

    // Highlight the active page indicator
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add("active");
        } else {
            indicator.classList.remove("active");
        }
    });
}

// Function to go to the next image
function nextOrgan() {
    currentIndex = (currentIndex + 1) % totalImages; // Wrap around to the start
    updateDisplay();
}

// Function to go to the previous image
function prevOrgan() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Wrap around to the end
    updateDisplay();
}

// Add event listeners to buttons
document.getElementById("next-button").addEventListener("click", nextOrgan);
document.getElementById("prev-button").addEventListener("click", prevOrgan);

// Initialize display
updateDisplay();
