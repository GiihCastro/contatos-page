document.addEventListener('DOMContentLoaded', () => {
    const contacts = [
        { name: 'Abraão Sena', phone: '(11) 90876-1234', image: '' },
        { name: 'Beatriz Clasen', phone: '(48) 90876-1123', image: '' },
        { name: 'Brenda Mendes', phone: '(21) 90876-8765', image: 'https://img.freepik.com/fotos-premium/uma-mulher-com-cabelos-castanhos-longos-e-uma-camisa-castanha-esta-posando-para-uma-foto_1204450-10499.jpg?semt=ais_hybrid' },
        { name: 'Caio Vinícius', phone: '(71) 90876-2435', image: '' },
        { name: 'Cleiton Souza', phone: '(11) 90876-1209', image: 'https://img.freepik.com/fotos-gratis/close-no-homem-sorrindo-na-natureza_23-2150771113.jpg?semt=ais_hybrid' },
        { name: 'Daniel Duarte', phone: '(82) 90876-5432', image: '' }
    ];

    const avatarColors = {};
    const contactList = document.querySelector('.contact-list');
    const addPopupForm = document.getElementById('add-popup-form');
    const editPopupForm = document.getElementById('edit-popup-form');
    const closeAddPopup = document.getElementById('close-add-popup');
    const closeEditPopup = document.getElementById('close-edit-popup');
    const addContactBtn = document.getElementById('add-contact');
    const newContactForm = document.getElementById('new-contact-form');
    const editContactForm = document.getElementById('edit-contact-form');
    const searchInput = document.getElementById('search');

    let currentContact = null;

    function formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/(\d{2})(\d{5})(\d{4})/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
    }

    function filterContacts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredContacts = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm) ||
            contact.phone.includes(searchTerm)
        );
        displayContacts(groupContactsByInitial(filteredContacts));
    }

    function groupContactsByInitial(contacts) {
        return contacts.reduce((groups, contact) => {
            const initial = contact.name.charAt(0).toUpperCase();
            if (!groups[initial]) groups[initial] = [];
            groups[initial].push(contact);
            return groups;
        }, {});
    }

    function displayContacts(groupedContacts) {
        contactList.innerHTML = '';
        for (const initial in groupedContacts) {
            const contactGroup = document.createElement('div');
            contactGroup.classList.add('contact-group');

            const initialTitle = document.createElement('h2');
            initialTitle.innerText = initial;
            contactGroup.appendChild(initialTitle);

            const ul = document.createElement('ul');
            groupedContacts[initial].forEach(contact => {
                const li = document.createElement('li');
                li.classList.add('contact-item');

                const avatar = document.createElement('div');
                avatar.classList.add('contact-avatar');

                if (contact.image) {
                    const img = document.createElement('img');
                    img.src = contact.image;
                    img.alt = `${contact.name}'s avatar`;
                    img.classList.add('contact-image'); // Classe para estilização
                    avatar.appendChild(img);
                } else {
                    avatar.style.backgroundColor = avatarColors[contact.name] || getRandomColor();
                    avatarColors[contact.name] = avatar.style.backgroundColor;
                    avatar.innerText = initial;
                }

                const contactInfo = document.createElement('div');
                contactInfo.classList.add('contact-info');

                const name = document.createElement('p');
                name.classList.add('contact-name');
                name.innerText = contact.name;

                const phone = document.createElement('p');
                phone.classList.add('contact-phone');
                phone.innerText = contact.phone;

                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'flex-end';

                const editBtn = document.createElement('button');
                editBtn.innerHTML = '<i class="material-icons">edit</i>';
                editBtn.onclick = () => openEditPopup(contact);

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="material-icons">delete</i>';
                deleteBtn.onclick = () => deleteContact(contact);

                buttonContainer.append(editBtn, deleteBtn);
                contactInfo.append(name, phone, buttonContainer);
                li.append(avatar, contactInfo);
                ul.appendChild(li);
            });
            contactGroup.appendChild(ul);
            contactList.appendChild(contactGroup);
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function openAddPopup() {
        addPopupForm.style.display = 'flex';
        newContactForm.reset();
        currentContact = null;
    }

    function closeAddPopupForm() {
        addPopupForm.style.display = 'none';
    }

    function openEditPopup(contact) {
        currentContact = contact;
        document.getElementById('edit-name').value = contact.name;
        document.getElementById('edit-phone').value = contact.phone.replace(/\D/g, ''); 
        document.getElementById('new-image').value = contact.image; 
        editPopupForm.style.display = 'flex';
    }

    function closeEditPopupForm() {
        editPopupForm.style.display = 'none';
    }

    function addOrEditContact(event) {
        event.preventDefault();
        const name = document.getElementById('new-name').value;
        const phone = formatPhoneNumber(document.getElementById('new-phone').value);
        const imageUrl = document.getElementById('new-image').value;

        if (currentContact) {
            currentContact.name = name;
            currentContact.phone = phone;
            currentContact.image = imageUrl;
        } else {
            contacts.push({ name, phone, image: imageUrl });
        }

        displayContacts(groupContactsByInitial(contacts));
        closeAddPopupForm();
    }

    function saveEditedContact(event) {
        event.preventDefault();
        const name = document.getElementById('edit-name').value;
        const phone = formatPhoneNumber(document.getElementById('edit-phone').value);
        const imageUrl = document.getElementById('new-image').value; 

        if (currentContact) {
            currentContact.name = name;
            currentContact.phone = phone;
            currentContact.image = imageUrl; 
        }

        displayContacts(groupContactsByInitial(contacts));
        closeEditPopupForm();
    }

    function deleteContact(contact) {
        const index = contacts.indexOf(contact);
        if (index > -1) {
            contacts.splice(index, 1);
            displayContacts(groupContactsByInitial(contacts));
        }
    }

    addContactBtn.addEventListener('click', openAddPopup);
    closeAddPopup.addEventListener('click', closeAddPopupForm);
    newContactForm.addEventListener('submit', addOrEditContact);
    closeEditPopup.addEventListener('click', closeEditPopupForm);
    editContactForm.addEventListener('submit', saveEditedContact);
    searchInput.addEventListener('input', filterContacts);

    function restrictToNumbers(inputId) {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, ''); 
        });
        input.addEventListener('blur', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }

    restrictToNumbers('new-phone');
    restrictToNumbers('edit-phone');

    displayContacts(groupContactsByInitial(contacts));
});
