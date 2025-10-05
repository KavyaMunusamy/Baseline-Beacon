// Modern JavaScript features
const API_URL = 'https://api.example.com';

// Async/await and fetch
async function fetchData() {
    try {
        const response = await fetch(`${API_URL}/data`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Arrow functions and destructuring
const processUser = ({ name, email, age = 18 }) => {
    return {
        displayName: name?.toUpperCase() ?? 'Unknown',
        contact: email,
        isAdult: age >= 18
    };
};

// Optional chaining and nullish coalescing
const getUserInfo = (user) => {
    return {
        name: user?.profile?.name ?? 'Anonymous',
        avatar: user?.profile?.avatar ?? '/default-avatar.png',
        lastSeen: user?.activity?.lastLogin ?? 'Never'
    };
};

// ES Modules (would be imported)
export { fetchData, processUser };

// Class with private fields
class UserManager {
    #users = new Map();
    #apiKey = 'secret-key';
    
    async addUser(userData) {
        const user = processUser(userData);
        this.#users.set(user.contact, user);
        
        // Top-level await would be used here in a module
        const additionalData = await fetchData();
        return { ...user, ...additionalData };
    }
    
    getUser(email) {
        return this.#users.get(email);
    }
}

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

// Web Components
class CustomButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <button style="padding: 0.5rem 1rem; border: none; border-radius: 4px;">
                <slot></slot>
            </button>
        `;
    }
}

customElements.define('custom-button', CustomButton);

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
}

// Web Share API (not widely supported)
async function shareContent() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Check this out!',
                text: 'Amazing content',
                url: window.location.href
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    }
}

// Dialog functionality
function openDialog() {
    document.getElementById('myDialog').showModal();
}

function closeDialog() {
    document.getElementById('myDialog').close();
}