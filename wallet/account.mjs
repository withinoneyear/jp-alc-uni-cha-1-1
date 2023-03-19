import { writeFileSync } from "fs";
import { utils, getPublicKey } from "ethereum-cryptography/secp256k1.js";

const accounts = Array.from({ length: 3 }, () => {
  const privateKey = utils.randomPrivateKey();
  const publicKey = getPublicKey(privateKey);
  const address = publicKey.slice(-20);
  return {
    privateKey: utils.bytesToHex(privateKey),
    publicKey: utils.bytesToHex(publicKey),
    address: utils.bytesToHex(address),
  };
});

writeFileSync("accounts.json", JSON.stringify(accounts, null, 2));

console.log(`${accounts.length} accounts generated in accounts.json`);

export default accounts;
