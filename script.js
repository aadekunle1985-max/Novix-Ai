const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(sender, message) {
    const div = document.createElement("div");
    div.className = sender;
    div.innerHTML = `<strong>${sender === "user" ? "You" : "Novix AI"}:</strong> ${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) return;

    addMessage("user", message);
    userInput.value = "";

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

        if (data.reply) {
            addMessage("bot", data.reply);
        } else {
            addMessage("bot", "No response received.");
        }

    } catch (error) {
        console.error(error);
        addMessage("bot", "Something went wrong.");
    }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
