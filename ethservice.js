const bip39 = require("bip39");
const {ethers} = require("ethers");
const axios = require("axios");

/**
 * Retrieves the first address of the ETH wallet
 * @param {*} seed valid BIP39 Mnemonic
 * @returns Promise<String> if successful
 */
 const getEthWallet = async seed => {
    try {
        const path = `m/44'/60'/0'/0/0`;
        const wallet = ethers.Wallet.fromMnemonic(seed, path);
        const provider = ethers.getDefaultProvider("rinkeby")

        return await wallet.getAddress();
    } 
    
    catch (error) {
        console.log(error);
    }
}

const getEthAddressBalance = async address => {
    try {
        const url = `https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`;
        const req = await axios.get(url) || "N/A";
        const exchange = await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR");

        // parse from wei to eth
        ["total_received", "total_sent", "balance", "final_balance", "unconfirmed_balance"]
            .forEach(key => {
                req.data[key] = req.data[key] / 1000000000000000000;
                console.log(key, req.data[key]);
            })
        req.data["balance_usd"] = "$" + (exchange.data.USD * req.data["final_balance"]) ;
        return req.data;
    } catch (error) {
        console.log(error);
        return "N/A";
    }
}

/**
 * Validates mnemonic phrase
 * @param {String} phrase
 * @returns Promise<Boolean>
 */
const validateMnemonic = async phrase => {
    return await bip39.validateMnemonic(phrase);
}

module.exports = {
    getEthWallet, 
    getEthAddressBalance,
    validateMnemonic,
}