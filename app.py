from flask import Flask, render_template, request, jsonify
import torch
import torch.nn as nn

app = Flask(__name__)


class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 8)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(8, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        s1 = self.relu(self.fc1(x))
        s2 = self.sigmoid(self.fc2(s1))
        return s2

model = NeuralNetwork()
model.load_state_dict(torch.load("model/weights/model_weights.pth"))


@app.route("/")
def main():
    return render_template("index.html")

@app.route("/api/model/predict", methods=['POST'])
def model_predicts():
    data = request.get_json()

    print(data)

    if not data:
        return jsonify({"ERROR BACKEND": "No data provided."}), 400

    sexe_list = {
        "man": 0.0,
        "women": 1.0
    }

    NORM_age_max = 80.0
    NORM_proches_max = 8.0

    try:
        classe = float(data.get("class"))
        classe_val = (classe - 1.0) / 2.0

        sex = float(data.get("sex"))
        sex_val = sexe_list.get(sex, 0.0)

        age = float(data.get("age"))
        age_val = age / NORM_age_max

        proches = float(data.get("people"))
        proches_val = proches / NORM_proches_max

        with torch.no_grad():
            tensor_data = torch.tensor([[classe_val, sex_val, age_val, proches_val]], dtype=torch.float32)
            prediction = model(tensor_data).item() * 100

        return jsonify ({
            "pdt_bnry_val": prediction
        })

    except Exception as e:
        return jsonify({
            "ERROR MODEL PREDICT": str(e) 
        }), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
