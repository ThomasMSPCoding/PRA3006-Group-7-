document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('disclaimerModal');
    const acceptBtn = document.getElementById('acceptDisclaimer');
    const disclaimerLink = document.getElementById('disclaimer-link');

    if (!modal || !acceptBtn || !disclaimerLink) return;

    // Function to show the modal
    const showModal = () => {
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
    };

    // Function to hide the modal
    const hideModal = () => {
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    };

    // Show the modal when the "DISCLAIMER" link is clicked
    disclaimerLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        showModal();
    });

    // Hide the modal when the "I Understand" button is clicked
    acceptBtn.addEventListener('click', hideModal);
});
