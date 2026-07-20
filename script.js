const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChat");

function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = type === "user" ? "user-message" : "bot-message";
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();

    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const typing = document.createElement("div");
    typing.className = "bot-message";
    typing.id = "typing";
    typing.textContent = "🤖 Novix AI is thinking...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://novix-ai-3.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        typing.remove();

        addMessage(data.reply || "No response received.", "bot");

    } catch (error) {
        typing.remove();
        addMessage("❌ Error connecting to Novix AI server.", "bot");
        console.error(error);
    }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

newChatBtn.addEventListener("click", () => {
    chatBox.innerHTML = `
        <div class="bot-message">
            👋 Welcome back to <strong>Novix AI</strong>! Start a new conversation.
        </div>
    `;
});
