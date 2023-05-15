class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      inputField: document.querySelector("input"),
      sendButton: document.querySelector(".send__button"),
    };

    this.baseUrl = "http://localhost:5000/chat";
    this.userName = "";
    this.chatName = "Sam";
    this.state = false;
    this.messages = [];
  }

  display() {
    const { openButton, sendButton, inputField } = this.args;

    openButton.addEventListener("click", () => this.toggleState());
    sendButton.addEventListener("click", (listner) => this.checkInput(listner));
    inputField.addEventListener("keyup", (listner) => this.checkInput(listner));
  }

  checkInput(listner) {
    const { inputField } = this.args;
    const { type, key } = listner;
    let value = inputField.value.trim();

    if (!value) return this;

    let message = { name: this.userName, message: value };

    if (type === "click" || key === "Enter") {
      if (!this.userName) {
        this.userName = value;
        message.name = value;

        this.updateChatText(message);
      } else {
        this.updateChatText(message);
        this.onSendButton(message);
      }

      inputField.placeholder = "Write a message...";
      inputField.value = "";
    }
    return this;
  }

  async onSendButton(data) {
    const requestConfig = {
      url: this.baseUrl,
      method: "POST",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };

    await axios(requestConfig)
      .then(({ data }) => {
        const { answer } = data;
        let returnMessage = { name: this.chatName, message: answer };
        this.updateChatText(returnMessage);
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText({
          name: this.chatName,
          message: "Error occured..",
        });
      });

    return this;
  }

  updateChatText(newMessage) {
    this.messages.push(newMessage);
    const { chatBox } = this.args;

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

    const chatmessage = chatBox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;

    return this;
  }
}

new Chatbox().display();
