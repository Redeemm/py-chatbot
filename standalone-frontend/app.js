class Chatbox {
  constructor(name) {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
    };

    this.chatName = "Sam";
    this.state = false;
    this.messages = [];
  }

  display() {
    const { openButton, chatBox, sendButton } = this.args;

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatbox) {
    this.state = !this.state;

    // show or hides the box
    if (this.state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
  }

  async onSendButton(chatbox) {
    let textField = chatbox.querySelector("input");
    let { value } = textField;

    if (!value) return this;

    let data = { name: "User", message: value };
    this.messages.push(data);

    const requestConfig = {
      url: "https://276a-197-251-176-48.ngrok-free.app/chat",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };

    await axios(requestConfig)
      .then(({ data }) => {
        const { answer } = data;
        let returnMessage = { name: this.chatName, message: answer };
        this.messages.push(returnMessage);
        this.updateChatText(chatbox);
        textField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      });
    return this;
  }

  updateChatText(chatbox) {
    let html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item) {
        const { name, message } = item;

        if (name === "Sam") {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            message +
            "</div>";
        } else {
          html +=
            '<div class="messages__item messages__item--operator">' +
            message +
            "</div>";
        }
      });

    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;
    return this;
  }
}

const chatbox = new Chatbox();
chatbox.display();
