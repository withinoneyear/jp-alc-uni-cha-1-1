import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signedMsg, setSignedMsg] = useState("");


  const setValue = (setter) => (evt) => {
    setSignedMsg('');
    setter(evt.target.value);
  }

  async function transfer(evt) {
    evt.preventDefault();
    if (!signedMsg) return alert('Please sign the message first');

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        transaction: signedMsg
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  const encodedData = btoa(JSON.stringify({ sender: address, amount: parseInt(sendAmount), recipient }));

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>


      <label>
        Run following command in wallet folder to generate signed data and paste it here:
        <hr />
        <div className="encoded-msg">node sign.mjs {encodedData}</div>
        <input placeholder="Past signed data here" value={signedMsg} onChange={setValue(setSignedMsg)}></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
