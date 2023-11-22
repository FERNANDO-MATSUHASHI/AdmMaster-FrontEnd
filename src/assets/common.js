/* -------------------- Notificação -------------------- */

export async function addNotification(args) {
    const container = document.getElementById('containerNotfication') || createNotificationContainer();

    const newNotification = document.createElement('div');
    newNotification.classList.add('notification', `notification-${Date.now()}`);
    newNotification.style.width = (args.width ?? '290px');
    newNotification.style.height = (args.height ?? '100%');
    newNotification.style.backgroundColor = (args.backgroundColor ?? 'red');
    newNotification.style.color = 'white';

    newNotification.innerHTML = `
        <span>${args.mensagem ?? ''}</span>
    `;

    container.appendChild(newNotification);

    setTimeout(() => {
        container.removeChild(newNotification);

        if (container.childElementCount === 0) {
            document.body.removeChild(container);
        }
    }, args.time ?? 4000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'containerNotfication';
    document.body.appendChild(container);
    return container;
}

/* -------------------- DialogConfirm -------------------- */

export async function dialogConfirm(args={}) {

    const modalContainer = document.createElement('div');
    modalContainer.id = 'containerModal';
    modalContainer.classList.add('modal', 'fade');

    modalContainer.innerHTML = `
        <div class="modal-dialog modal-dialog-centered" role="document" style="color: black;">
            <div class="modal-content" style="width: 500px;">
                <div class="modal-header">
                    <h5 class="modal-title">${(args.header ?? '')}</h5>
                    <button type="button" class="btn-close btn-remover-modal-custom" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${(args.mensagem ?? '')}
                </div>
                <div class="modal-footer">
                    <button type="button" id="bnt-cancelAction" class="btn btn-secondary btn-remover-modal-custom" data-bs-dismiss="modal">${args.cancelAction && args.cancelAction.text ? args.cancelAction.text:'Fechar'}</button>
                    <button type="button" id="bnt-okAction" class="btn btn-primary">${args.okAction && args.okAction.text ? args.okAction.text:'Confirmar'}</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalContainer);

    const bootstrapModal = new bootstrap.Modal(modalContainer);

    bootstrapModal.show();

    modalContainer.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modalContainer);
    });

    /* Evento de Click quando clicar em Confirmar */
    document.querySelector("#bnt-okAction").addEventListener('click', () => {
        if (args.okAction && args.okAction.callback) {
            args.okAction.callback();
        }
        bootstrapModal.hide();
        document.body.removeChild(modalContainer);
    });

    /* Evento de Click quando clicar em cancelar */
    document.querySelector("#bnt-cancelAction").addEventListener('click', () => {
        if (args.cancelAction && args.cancelAction.callback) {
            args.cancelAction.callback();
        }
        bootstrapModal.hide();
        document.body.removeChild(modalContainer);
    });

    return bootstrapModal;
}

/* -------------------- DialogAlert -------------------- */

export async function dialogAlert(args={}) {

    const modalContainer = document.createElement('div');
    modalContainer.id = 'containerDialogAlert';
    modalContainer.classList.add('modal', 'fade');

    modalContainer.innerHTML = `
        <div class="modal-dialog modal-dialog-centered" role="document" style="color: black;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${(args.header ?? '')}</h5>
                    <button type="button" class="btn-close btn-remover-modal-custom" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${(args.mensagem ?? '')}
                </div>
                <div class="modal-footer">
                    <button type="button" id="bnt-cancelAction" class="btn btn-secondary btn-remover-modal-custom" data-bs-dismiss="modal">${args.cancelAction && args.cancelAction.text ? args.cancelAction.text:'Fechar'}</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalContainer);

    const bootstrapModal = new bootstrap.Modal(modalContainer);

    bootstrapModal.show();

    modalContainer.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modalContainer);
    });

    /* Evento de Click quando clicar em cancelar */
    document.querySelector("#bnt-cancelAction").addEventListener('click', () => {
        if (args.cancelAction && args.cancelAction.callback) {
            args.cancelAction.callback();
        }   
        bootstrapModal.hide();
    });

    return bootstrapModal;
}