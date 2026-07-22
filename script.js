const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(sender, text) {
    const message = document.createElement("div");

    message.className = sender === "user"
        ? "user-message"
        : "bot-message";

    message.innerHTML = text.replace(/\n/g, "<br>");

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) return;

    addMessage("user", message);
    userInput.value = "";

    addMessage("bot", "🤖 Thinking...");

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Remove the "Thinking..." message
        chatBox.removeChild(chatBox.lastChild);

        addMessage("bot", data.reply);

    } catch (error) {
        console.error(error);

        chatBox.removeChild(chatBox.lastChild);

        addMessage(
            "bot",
            "❌ Unable to connect to Novix AI."
        );
    }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});