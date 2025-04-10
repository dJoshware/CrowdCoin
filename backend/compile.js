// COMPILES .sol CONTRACT

const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// Gets path of 'build' directory
const buildPath = path.resolve(__dirname, 'build');
// Deletes 'build' directory, if exists
fs.removeSync(buildPath);
// Gets path of 'Campaign.sol' file inside 'contracts' directory
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// Set compiled contracts to variable to use to write to 'build' directory
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];
// console.log(output);

// Ensures directory exists
fs.ensureDirSync(buildPath);
// Loops over contracts in 'output' (Campaign and CampaignFactory)
for (let contract in output) {
    // Writes JSON file to 'build' directory
    fs.outputJSONSync(
        // Path to 'build' directory
        path.resolve(buildPath, contract + '.json'),
        // Contract contents being wrote to JSON file
        output[contract]
    );
}
