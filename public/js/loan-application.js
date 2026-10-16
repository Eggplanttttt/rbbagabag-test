"use strict";
(() => {
    const modal = document.getElementById("loan-application");
    const form = document.getElementById("application-form");
    const warning = document.getElementById("application-warning");
    let warningTimer;
    function clearWarning() {
        clearTimeout(warningTimer);
        warning.hidden = true;
        warning.textContent = "";
    }
    function showWarning(message) {
        clearWarning();
        warning.textContent = message;
        warning.hidden = false;
        warningTimer = setTimeout(clearWarning, 4000);
    }
    const successModal = document.getElementById("application-success");
    document.getElementById("application-success-done").addEventListener("click", () => successModal.close());
    successModal.addEventListener("close", () => {
        document.body.classList.remove("application-open");
        opener?.focus();
    });
    function configurePhoneFields(container) {
        container.querySelectorAll('input[type="tel"]').forEach(input => {
            input.inputMode = "tel";
            input.pattern = "[0-9+\\-]*";
            input.title = "Use digits, plus signs (+), and dashes (-) only.";
        });
    }
    configurePhoneFields(form);
    form.addEventListener("input", event => {
        const input = event.target;
        if (!input.matches('input[type="tel"]')) return;
        const value = input.value;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = value.replace(/[^0-9+\-]/g, "");
        if (["mobile", "alternateMobile", "emergencyPhone"].includes(input.name) || input.dataset.beneficiaryField === "Contact number") {
            const limit = input.value.startsWith("+63") ? 13 : 11;
            let count = 0;
            input.value = [...input.value].filter(character => {
                if (character !== "-") count++;
                return count <= limit;
            }).join("");
        }
        input.setSelectionRange(
            value.slice(0, start).replace(/[^0-9+\-]/g, "").length,
            value.slice(0, end).replace(/[^0-9+\-]/g, "").length
        );
    });
    const clientName = form.elements.clientName;
    clientName.placeholder = "DELA CRUZ, JUAN, SANTOS";
    clientName.autocapitalize = "characters";
    clientName.addEventListener("input", () => {
        const start = clientName.selectionStart;
        const end = clientName.selectionEnd;
        clientName.value = clientName.value.toUpperCase();
        clientName.setSelectionRange(start, end);
    });
    const beneficiaries = document.getElementById("application-beneficiaries");
    const photo = document.getElementById("application-photo");
    const preview = document.getElementById("application-photo-preview");
    let opener;
    let photoUrl;
    let restoredPhoto = null;
    let photoRevision = 0;
    const draftKey = "rbb-loan-application-draft";
    let photoKey;
    try {
        photoKey = sessionStorage.getItem(draftKey + "-photo-key") || crypto.randomUUID();
        sessionStorage.setItem(draftKey + "-photo-key", photoKey);
    } catch { /* The form still works when browser storage is unavailable. */ }
    const photoDatabase = photoKey && "indexedDB" in window ? new Promise(resolve => {
        const request = indexedDB.open("rbb-loan-drafts", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("photos");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
        request.onblocked = () => resolve(null);
    }) : Promise.resolve(null);
    async function storedPhoto(action, file) {
        const db = await photoDatabase;
        if (!db) return null;
        return new Promise(resolve => {
            const transaction = db.transaction("photos", action === "get" ? "readonly" : "readwrite");
            const store = transaction.objectStore("photos");
            const request = action === "get" ? store.get(photoKey) : action === "put" ? store.put(file, photoKey) : store.delete(photoKey);
            transaction.oncomplete = () => resolve(request.result || null);
            transaction.onerror = transaction.onabort = () => resolve(null);
        });
    }
    function saveDraft() {
        if (!modal.open) return;
        const fields = Object.fromEntries(new FormData(form));
        const people = [...beneficiaries.children].map(entry => Object.fromEntries([...entry.querySelectorAll("[data-beneficiary-field]")].map(input => [input.dataset.beneficiaryField, input.value])));
        try { sessionStorage.setItem(draftKey, JSON.stringify({ fields, people, scrollTop: modal.scrollTop })); }
        catch { /* Storage may be disabled or full. */ }
    }
    function resetDraft() {
        photoRevision++;
        try { sessionStorage.removeItem(draftKey); } catch { /* Storage unavailable. */ }
        storedPhoto("delete");
        restoredPhoto = null;
        form.reset();
        photo.setCustomValidity("");
        beneficiaries.replaceChildren();
        addBeneficiary(false);
        if (photoUrl) URL.revokeObjectURL(photoUrl);
        photoUrl = null;
        preview.hidden = true;
        preview.removeAttribute("src");
        clearWarning();
        modal.scrollTop = 0;
    }
    form.addEventListener("input", saveDraft);
    form.addEventListener("change", saveDraft);
    modal.addEventListener("scroll", saveDraft, { passive: true });
    window.addEventListener("pagehide", saveDraft);
    document.querySelectorAll("[data-apply-loan]").forEach(button => {
        button.addEventListener("click", () => {
            opener = button;
            document.getElementById("application-loan-type").value = button.dataset.applyLoan;
            modal.showModal();
            document.body.classList.add("application-open");
            saveDraft();
        });
    });
    modal.querySelectorAll("[data-close-application]").forEach(button => button.addEventListener("click", () => modal.close()));
    modal.addEventListener("close", () => {
        resetDraft();
        if (successModal.open) return;
        document.body.classList.remove("application-open");
        opener?.focus();
    });
    function addBeneficiary(focus) {
        if (beneficiaries.children.length >= 10) return;
        const entry = document.getElementById("beneficiary-template").content.cloneNode(true);
        configurePhoneFields(entry);
        entry.querySelector("button").addEventListener("click", event => {
            event.target.closest(".beneficiary-entry").remove();
            saveDraft();
        });
        beneficiaries.append(entry);
        if (focus) beneficiaries.lastElementChild.querySelector("input").focus();
        if (focus) saveDraft();
    }
    addBeneficiary(false);
    document.getElementById("add-beneficiary").addEventListener("click", () => addBeneficiary(true));
    photo.addEventListener("change", () => {
        photoRevision++;
        restoredPhoto = null;
        storedPhoto("delete");
        if (photoUrl) URL.revokeObjectURL(photoUrl);
        preview.hidden = true;
        preview.removeAttribute("src");
        photo.setCustomValidity("");
        const file = photo.files[0];
        if (!file) return;
        if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
            photo.setCustomValidity("Choose a JPG, PNG or WebP image up to 5 MB.");
            photo.reportValidity();
            return;
        }
        photoUrl = URL.createObjectURL(file);
        preview.src = photoUrl;
        preview.hidden = false;
        storedPhoto("put", file);
    });
    function restoreDraft() {
        let draft;
        try { draft = JSON.parse(sessionStorage.getItem(draftKey)); } catch { return; }
        if (!draft || !draft.fields || !Array.isArray(draft.people)) return;
        opener = [...document.querySelectorAll("[data-apply-loan]")].find(button => button.dataset.applyLoan === draft.fields.loanType);
        if (!opener) return;
        for (const [name, value] of Object.entries(draft.fields)) {
            const input = form.elements.namedItem(name);
            if (input && input.type !== "file" && typeof value === "string") input.value = value;
        }
        beneficiaries.replaceChildren();
        draft.people.slice(0, 10).forEach(person => {
            addBeneficiary(false);
            beneficiaries.lastElementChild.querySelectorAll("[data-beneficiary-field]").forEach(input => {
                input.value = typeof person[input.dataset.beneficiaryField] === "string" ? person[input.dataset.beneficiaryField] : "";
            });
        });
        modal.showModal();
        document.body.classList.add("application-open");
        requestAnimationFrame(() => { modal.scrollTop = Number(draft.scrollTop) || 0; });
        const revision = photoRevision;
        storedPhoto("get").then(file => {
            if (revision !== photoRevision || !modal.open || photo.files.length || !(file instanceof Blob)) return;
            restoredPhoto = file;
            photoUrl = URL.createObjectURL(file);
            preview.src = photoUrl;
            preview.hidden = false;
        });
    }
    restoreDraft();
    let submitting = false;
    modal.addEventListener("cancel", event => {
        if (submitting) event.preventDefault();
    });
    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (submitting) return;
        submitting = true;
        const button = form.querySelector('[type="submit"]');
        clearWarning();
        button.disabled = true;
        modal.querySelectorAll("[data-close-application]").forEach(control => { control.disabled = true; });
        button.textContent = "Saving application…";
        try {
            const data = Object.fromEntries(new FormData(form));
            data.clientName = data.clientName.toUpperCase();
            data.beneficiaries = [...beneficiaries.children].map(entry => Object.fromEntries([...entry.querySelectorAll("[data-beneficiary-field]")].map(input => [input.dataset.beneficiaryField, input.value])));
            const file = photo.files[0] || restoredPhoto;
            data.photo = file ? await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error("Could not read your photo. Please select it again."));
                reader.readAsDataURL(file);
            }) : "";
            const response = await fetch("/loan-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to save your application. Please try again.");
            resetDraft();
            modal.close();
            successModal.showModal();
            document.body.classList.add("application-open");
        } catch (error) {
            showWarning(error.message || "Unable to save your application. Please try again.");
        } finally {
            submitting = false;
            button.disabled = false;
            button.textContent = "Submit application";
            modal.querySelectorAll("[data-close-application]").forEach(control => { control.disabled = false; });
        }
    });
})();
