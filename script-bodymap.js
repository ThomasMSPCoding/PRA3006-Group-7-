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
