// Wait for the entire document to load before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Select elements from the DOM
    const modal = document.getElementById('disclaimerModal'); // Modal element for the disclaimer
    const acceptBtn = document.getElementById('acceptDisclaimer'); // Button to close the modal
    const disclaimerLink = document.getElementById('disclaimer-link'); // Link to trigger the modal

    // Exit early if any of the required elements are missing
    if (!modal || !acceptBtn || !disclaimerLink) return;

    /**
     * Displays the disclaimer modal by making it visible and setting opacity to 1.
     */
    const showModal = () => {
        modal.style.visibility = 'visible'; // Makes the modal visible
        modal.style.opacity = '1'; // Ensures the modal is fully opaque
    };

    /**
     * Hides the disclaimer modal by making it invisible and setting opacity to 0.
     */
    const hideModal = () => {
        modal.style.visibility = 'hidden'; // Hides the modal
        modal.style.opacity = '0'; // Ensures the modal is fully transparent
    };

    // Add a click event listener to the "DISCLAIMER" link to show the modal
    disclaimerLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents the default behavior of the link
        showModal(); // Calls the function to display the modal
    });

    // Add a click event listener to the "I Understand" button to hide the modal
    acceptBtn.addEventListener('click', hideModal); // Calls the function to hide the modal
});
