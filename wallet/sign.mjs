import fs from "fs";
import { sha256 } from "ethereum-cryptography/sha256.js";
import {
  hexToBytes,
  bytesToHex,
  utf8ToBytes,
} from "ethereum-cryptography/utils.js";
import { signSync } from "ethereum-cryptography/secp256k1.js";

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log("Usage: node sign.mjs <message>");
  process.exit(1);
}

const [encodedMsg] = args;
const message = Buffer.from(encodedMsg, "base64").toString("utf8");
const trans = JSON.parse(message);

const accounts = JSON.parse(fs.readFileSync("accounts.json", "utf8"));
const sender = accounts.find((account) => account.address === trans.sender);
if (!sender) {
  console.log("Sender not found");
  process.exit(1);
}

const hash = sha256(utf8ToBytes(message));
const signature = signSync(hash, hexToBytes(sender.privateKey), {
  recovered: true,
});

const data = {
  message: trans,
  signature: bytesToHex(signature[0]),
  recovery: signature[1],
};
const dataBase64 = Buffer.from(JSON.stringify(data)).toString("base64");

console.log(`=========== Signed Message ===========`);
console.log(dataBase64);
