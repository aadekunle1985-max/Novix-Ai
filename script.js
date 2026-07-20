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

function sendMessage() {
    const text = userInput.value.trim();

    if (text === "") return;

    addMessage(text, "user");
    userInput.value = "";

    // Typing indicator
    const typing = document.createElement("div");
    typing.className = "bot-message";
    typing.id = "typing";
    typing.textContent = "🤖 Novix AI is thinking...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        typing.remove();

        addMessage(
            "I'm currently in demo mode. In the next step, I'll connect to Claude AI and answer your questions for real!",
            "bot"
        );
    }, 1200);
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
