from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import json
import torch


from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

app = Flask(__name__)
CORS(app)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Sam"

@app.route('http://redkoko.pythonanywhere.com/chat', methods=['POST'])
def chat():

    message = request.json['message']

    sentence = tokenize(message)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                response = random.choice(intent['responses'])
                message = {'answer': response}
                return jsonify(message)
    else:
        error = {'answer': 'I do not understand...'}
        return jsonify(error)

    # mesaage = {"answer": response}
    # return jsonify(mesaage)
if __name__ == '__main__':
    app.run(debug=True)
