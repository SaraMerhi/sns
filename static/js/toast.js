function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const icon = toast.querySelector('.toast-icon');
    const messageSpan = toast.querySelector('.toast-message');
    
    if (messageSpan) messageSpan.textContent = message;
    
    // Set icon and class based on type
    console.log(type)
    toast.className = 'toast'; // reset
    if (type === 'error' || type === 'danger') {
        toast.classList.add('error');
        if (icon) icon.className = 'fas fa-exclamation-circle toast-icon';
    } else if (type === 'success') {
        toast.classList.add('success');
        if (icon) icon.className = 'fas fa-check-circle toast-icon';
    } else if (type === 'info') {
        toast.classList.add('info');
        if (icon) icon.className = 'fas fa-info-circle toast-icon';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Clear previous timeout if any
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    const flashContainer = document.getElementById('flash-messages-data');
    if (flashContainer) {
        const messages = JSON.parse(flashContainer.textContent);
        messages.forEach(([category, message]) => {
            showToast(message, category);
        });
    }
});
