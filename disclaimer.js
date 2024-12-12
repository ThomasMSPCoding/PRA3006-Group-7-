//javascript for disclaimer modal on all pages except interaction page
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('disclaimerModal');
    const acceptBtn = document.getElementById('acceptDisclaimer');
    const disclaimerLink = document.getElementById('disclaimer-link'); 

    // Exit early if any of the required elements are missing
    if (!modal || !acceptBtn || !disclaimerLink) return;

    //Show and Hide Modal functions
    const showModal = () => {
        modal.style.visibility = 'visible';
        modal.style.opacity = '1'; 
    };
    const hideModal = () => {
        modal.style.visibility = 'hidden'; 
        modal.style.opacity = '0'; 
    };

    //Calls Show modal when disclaimer link is clicked
    disclaimerLink.addEventListener('click', () => {
        showModal();
    });

    //Calls hide modal when accept button is clicked
    acceptBtn.addEventListener('click', hideModal);
});
