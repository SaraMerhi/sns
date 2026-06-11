(function () {
    function getModal(id) {
        return document.getElementById(id);
    }

    window.openModal = function (id) {
        const modal = getModal(id);
        if (modal) {
            modal.style.display = "block";
        }
    };

    window.closeModal = function (id) {
        const modal = getModal(id);
        if (modal) {
            modal.style.display = "none";
        }
    };

    window.openConfirmModal = function (id, options = {}) {
        const modal = getModal(id);
        if (!modal) {
            return;
        }

        if (options.formAction) {
            const form = modal.querySelector("form");
            if (form) {
                form.action = options.formAction;
            }
        }

        if (options.message) {
            const messageEl = options.messageId
                ? document.getElementById(options.messageId)
                : modal.querySelector("[data-modal-message]");

            if (messageEl) {
                messageEl.textContent = options.message;
            }
        }

        openModal(id);
    };

    document.addEventListener("click", function (event) {
        const closeTrigger = event.target.closest("[data-modal-close]");
        if (closeTrigger) {
            closeModal(closeTrigger.getAttribute("data-modal-close"));
            return;
        }

        const confirmTrigger = event.target.closest("[data-modal-confirm-href]");
        if (confirmTrigger) {
            window.location.href = confirmTrigger.getAttribute("data-modal-confirm-href");
            return;
        }

        if (event.target.classList.contains("modal") && event.target.hasAttribute("data-modal")) {
            closeModal(event.target.id);
        }
    });
})();
