// DEPLOYS CONTRACT TO SEPOLIA TEST NETWORK

require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');
const provider = new HDWalletProvider(
    process.env.SEED_PHRASE,
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
);
const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();

        console.log('\x1b[32m%s\x1b[0m', "Attempting to deploy from account", accounts[2]);

        const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(compiledFactory.abi)))
            .deploy({ data: compiledFactory.evm.bytecode.object })
            .send({ gas: "10000000", from: accounts[2] });

        console.log('\x1b[32m%s\x1b[0m', `Contract interface (abi): ${JSON.stringify(compiledFactory.abi)}`);
        console.log('\x1b[32m%s\x1b[0m', "Contract deployed to", result.options.address);
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', "Deployment failed:", err);
    } finally {
        provider.engine.stop();
    }
};

deploy();
