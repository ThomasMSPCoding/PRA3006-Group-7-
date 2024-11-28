//function showinfo(bodyPart) {
  //  let info = "Information about" + bodyPart;
    //alert(info+"\n\nRead More");
    
//}

document.addEventListener("DOMContentLoaded", () => {
    // Select all <area> elements
    const areas = document.querySelectorAll("map[name='image-map'] area");

    // Create an info box
    const infoBox = document.createElement("div");
    infoBox.style.position = "absolute";
    infoBox.style.padding = "10px";
    infoBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    infoBox.style.border = "1px solid #ccc";
    infoBox.style.borderRadius = "5px";
    infoBox.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    infoBox.style.display = "none"; // Hidden by default
    infoBox.style.zIndex = "1000";
    document.body.appendChild(infoBox);

    // Add event listeners to areas
    areas.forEach((area) => {
        area.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent navigation

            // Get the data-info attribute
            const info = area.getAttribute("data-info");

            if (info) {
                // Get the mouse position
                const mouseX = event.pageX;
                const mouseY = event.pageY;

                // Position the info box near the click
                infoBox.style.left = `${mouseX + 10}px`;
                infoBox.style.top = `${mouseY + 10}px`;

                // Set the content and display the box
                infoBox.textContent = info;
                infoBox.style.display = "block";
            }
        });
    });

    // Hide the info box when clicking outside
    document.addEventListener("click", (event) => {
        if (!event.target.closest("area")) {
            infoBox.style.display = "none";
        }
    });
});