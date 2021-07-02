/**
 * Testing suite for eth service
 * @author rain
 * @date 01/07/2019-2021 (Sometime between those 2 years ;))
 */

const ethservice = require("./ethservice");

describe ("ETH Service", () => {
    describe("Validate Seed Phrase", () => {
        it ("invalid seed phrase", async () => {
            expect.assertions(1);

            const seed = "fake-seed-phrase";
            const isValid = await ethservice.validateMnemonic(seed);
            expect(isValid).toBe(false);
        })

        it ("valid seed phrase", async () => {
            expect.assertions(1);

            const seed = 
                "theme team harbor execute vacant olympic pyramid ship stamp " +
                "panther young wage upgrade myth lemon welcome install entry " +
                "neglect cube nation novel party base";

            const isValid = await ethservice.validateMnemonic(seed);
            expect(isValid).toBe(true);
        })
    });

    describe("Eth Balance Fetch", () => {
        it ("Valid address, should return balance", async () => {
            expect.assertions(1);

            const seed = 
                "theme team harbor execute vacant olympic pyramid ship stamp " +
                "panther young wage upgrade myth lemon welcome install entry " +
                "neglect cube nation novel party base";

            const address = await ethservice.getEthWallet(seed);
            const response = await ethservice.getEthAddressBalance(address);
            expect(response.balance_usd).toBe("$0");
        })
    })
})