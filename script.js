const API_BASE_URL = "https://gatekeeper-backend.vercel.app/api"; // Base URL for the Flask API

// Initialize or get the last response from localStorage
let lastResponse = localStorage.getItem('lastResponse') || "I am the Gatekeeper. How may I assist you today?";

// Set initial response
document.addEventListener('DOMContentLoaded', () => {
    const responseDiv = document.getElementById('response');
    responseDiv.textContent = lastResponse;
});

// Handle sending a user prompt
async function sendPrompt(event) {
    if (event) event.preventDefault();

    const promptInput = document.getElementById('prompt');
    const responseDiv = document.getElementById('response');
    const sendButton = document.getElementById('sendButton');
    const prompt = promptInput.value.trim();

    if (!prompt) return false;

    promptInput.value = '';
    promptInput.disabled = true;
    sendButton.disabled = true;
    responseDiv.textContent = "Thinking...";

    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: prompt }),
        });

        const data = await response.json();

        if (data.response) {
            lastResponse = data.response;
            localStorage.setItem('lastResponse', lastResponse);
            responseDiv.textContent = lastResponse;
        } else {
            responseDiv.textContent = "Error: Unable to get a response.";
        }
    } catch (error) {
        responseDiv.textContent = "An error occurred while processing your request.";
        console.error("Error:", error);
    } finally {
        promptInput.disabled = false;
        sendButton.disabled = false;
    }

    return false;
}

// Handle password submission
async function checkPassword(event) {
    if (event) event.preventDefault();

    const passwordInput = document.getElementById('password');
    const responseDiv = document.getElementById('response');
    const password = passwordInput.value.trim();

    if (!password) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/verify-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (data.valid) {
            lastResponse = "🎉 Congratulations! You've successfully completed the challenge!";
        } else {
            lastResponse = "❌ Incorrect password. The Gatekeeper stands firm.";
        }

        localStorage.setItem('lastResponse', lastResponse);
        responseDiv.textContent = lastResponse;
    } catch (error) {
        responseDiv.textContent = "An error occurred while verifying the password.";
        console.error("Error:", error);
    } finally {
        passwordInput.value = '';
    }

    return false;
}

// Add event listeners for Enter key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (document.activeElement.id === 'prompt') {
            sendPrompt();
        } else if (document.activeElement.id === 'password') {
            checkPassword();
        }
    }
});
