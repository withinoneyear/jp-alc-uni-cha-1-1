import fs from "fs";
import { sha256 } from "ethereum-cryptography/sha256.js";
import {
  hexToBytes,
  bytesToHex,
  utf8ToBytes,
} from "ethereum-cryptography/utils.js";
import { recoverPublicKey } from "ethereum-cryptography/secp256k1.js";

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log("Usage: node recover.mjs <message>");
  process.exit(1);
}

const [encodedMsg] = args;
const message = Buffer.from(encodedMsg, "base64").toString("utf8");
const data = JSON.parse(message);

console.log(data);

const hash = sha256(utf8ToBytes(JSON.stringify(data.message)));
const publicKey = recoverPublicKey(
  hash,
  hexToBytes(data.signature),
  data.recovery
);

console.log(bytesToHex(publicKey));
