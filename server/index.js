const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const {
  hexToBytes,
  bytesToHex,
  utf8ToBytes,
} = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");

app.use(cors());
app.use(express.json());

const balances = {
  ed6ea8078bbd4cc6f403b8cfb49a5484c254afd2: 100,
  "5b30338cb9c3d537b5a5bbb92923472751600f87": 50,
  "624b0384b73a4553c47786a480f6e82eed6125cc": 75,
};

function verify(data) {
  const { message, signature, recovery } = data;
  const hash = sha256(utf8ToBytes(JSON.stringify(message)));
  const publicKey = secp.recoverPublicKey(
    hash,
    hexToBytes(signature),
    recovery
  );
  const address = bytesToHex(publicKey.slice(-20));
  return address === message.sender ? message : null;
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction: dataBase64 } = req.body;

  const data = JSON.parse(Buffer.from(dataBase64, "base64").toString("utf8"));
  let trans;

  try {
    trans = verify(data);
    if (!trans) {
      res.status(400).send({ message: "Invalid signature" });
      return;
    }
  } catch (e) {
    res.status(400).send({ message: "Invalid signature", error: e });
    return;
  }

  const { sender, recipient, amount } = trans;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
