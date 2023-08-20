const express = require("express");
const ethers = require("ethers");
const abiDecoder = require("abi-decoder");
require("dotenv").config();

const ABI = require("./abi/abi.json");

const app = express();

const http = require("http").Server(app);
const cors = require("cors");

const PORT = 4000;

app.use(cors());
app.use(express.json());

let history = [];

const provider = new ethers.WebSocketProvider(process.env.WSSPROVIDER_URI);

const getTxnHash = (topic) => {
  const uint8Array = ethers.toUtf8Bytes(topic);
  const transactionHash = ethers.keccak256(uint8Array);
  return transactionHash;
};

const decode = (dataType, encodedData) => {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const decodedData = abiCoder.decode([dataType], encodedData);
  return decodedData[0].toString();
};

let filter = {
  address: "0x227c385a651d764c04f78243996d817b73aa5586",
  topics: [getTxnHash("Transfer(address,address,uint256)")],
};

// Listen to Transfer event and decoding data
provider.on(filter, (log, event) => {
  const tokenAmount = decode("uint256", log.data);
  const from = decode("address", log.topics[1]);
  const to = decode("address", log.topics[2]);

  const newArr = [
    ...history,
    {
      tokenAmount,
      from,
      to,
    },
  ];

  history = newArr;
});

// Available Routes
app.post("/api/history", (req, res) => {
  const { account } = req.body;

  const historyArr = [];

  historyArr = history.map((e) => {
    if (e.from === account) {
      return {
        status: "sent",
        address: e.to,
        tokenAmount,
      };
    } else {
      return {
        status: "received",
        address: e.from,
        tokenAmount,
      };
    }
  });

  res.json({ historyArr });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
