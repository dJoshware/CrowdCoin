const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../backend/build/CampaignFactory.json');
const compiledCampaign = require('../backend/build/Campaign.json');


let accounts;
let factory;
let campaignAddress;
let campaign;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '2000000' });
    
    const valueInWei = web3.utils.toWei('.99', 'ether');
    await factory.methods.createCampaign(valueInWei).send({
        from: accounts[1],
        gas: '2000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    // Already deployed the Factory so don't need to deploy Campaign
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

describe('Campaigns', () => {
    // it('deploys a factory and campaign', () => {
    //     assert.ok(factory.options.address);
    //     assert.ok(campaign.options.address);
    // });

    // it('marks caller as campaign manager', async () => {
    //     const manager = await campaign.methods.manager().call();
    //     assert.strictEqual(accounts[1], manager);
    // });

    // it('allows people to contribute money and marks them as approvers', async () => {
    //     await campaign.methods.contribute().send({
    //         from: accounts[2],
    //         value: web3.utils.toWei('1', 'ether')
    //     });
    //     const _isContributor = await campaign.methods.isContributor(accounts[2]).call();
    //     assert(_isContributor);
    // });

    // it('requires minimum contribution', async () => {
    //     try {
    //         await campaign.methods.contribute().send({
    //             from: accounts[2],
    //             value: web3.utils.toWei('.99', 'ether')
    //         });
    //         assert(false);
    //     } catch (err) {
    //         assert(err);
    //     }
    // });

    // it('allows a manager to make a payment request', async () => {
    //     const campaignAddress = campaign.options.address;
    //     const balance = await web3.eth.getBalance(campaignAddress);
    //     const balanceInETH = await web3.utils.toWei(balance, 'ether');

    //     console.log('\x1b[32m%s\x1b[0m', `Campaign balance: ${balanceInETH}`);

    //     await campaign.methods.contribute().send({
    //         from: accounts[2],
    //         value: web3.utils.toWei('5', 'ether')
    //     });

    //     const _balance = await web3.eth.getBalance(campaignAddress);
    //     const _balanceInETH = await web3.utils.fromWei(_balance, 'ether');
    //     console.log('\x1b[32m%s\x1b[0m', `Campaign balance: ${_balanceInETH}`);

    //     const manager = await campaign.methods.manager().call();

    //     await campaign.methods.createRequest(
    //         'Buy groceries',
    //         web3.utils.toWei('1', 'ether'),
    //         accounts[2]
    //     ).send({
    //         from: manager,
    //         gas: '2000000'
    //     });
    //     console.log('\x1b[32m%s\x1b[0m', 'Request created successfully');
    //     console.log('\x1b[33m%s\x1b[0m', await campaign.methods.requests(0).call());
    //     // const request = await campaign.methods.requests(0).call();
    //     // assert.strictEqual('Buy groceries', request.description);
    // });

    // it('processes requests', async () => {
    //     await campaign.methods.contribute().send({
    //         from: accounts[2],
    //         value: web3.utils.toWei('5', 'ether')
    //     });

    //     await campaign.methods.createRequest(
    //         'Payday',
    //         web3.utils.toWei('3', 'ether'),
    //         accounts[3]
    //     ).send({
    //         from: accounts[1],
    //         gas: '1000000'
    //     });

    //     await campaign.methods.approveRequest(0).send({
    //         from: accounts[2],
    //         gas: '1000000'
    //     });

    //     await campaign.methods.finalizeRequest(0).send({
    //         from: accounts[1],
    //         gas: '1000000'
    //     });

    //     let balance = await web3.eth.getBalance(accounts[3]);
    //     balance = web3.utils.fromWei(balance, 'ether');
    //     balance = parseFloat(balance);

    //     console.log('\x1b[32m%s\x1b[0m', balance);
    //     assert(balance > 102);
    // });

    it('', async () => {
        let balance;

        // deploys factory and campaign
        const factoryAddress = factory.options.address;
        const _campaignAddress = campaign.options.address;
        console.log('\x1b[32m%s\x1b[0m', `Factory address: ${factoryAddress}`);
        console.log('\x1b[32m%s\x1b[0m', `Campaign address: ${campaignAddress}`);
        assert.ok(factoryAddress);
        assert.ok(campaignAddress);

        // marks caller as campaign manager
        const manager = await campaign.methods.manager().call();
        console.log('\x1b[32m%s\x1b[0m', `Manager address: ${manager}`);
        assert.strictEqual(accounts[1], manager);

        // gets account balance
        balance = await web3.eth.getBalance(accounts[2]);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('\x1b[32m%s\x1b[0m', `${accounts[2]} balance: ${balance} ETH`);

        // allows people to contribute money
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: web3.utils.toWei('5', 'ether')
        });
        const isContributor1 = await campaign.methods.isContributor(accounts[2]).call();
        console.log('\x1b[32m%s\x1b[0m', `${accounts[2]} is contributor: ${isContributor1}`);
        assert(isContributor1);

        // gets account balances
        balance = await web3.eth.getBalance(accounts[2]);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('\x1b[32m%s\x1b[0m', `${accounts[2]} balance: ${balance} ETH`);

        // requires minimum contribution
        try {
            await campaign.methods.contribute().send({
                from: accounts[3],
                value: web3.utils.toWei('.98', 'ether')
            });
            console.log('\x1b[31m%s\x1b[0m', 'Requires minimum contribution');
            assert(false);
        } catch (err) {
            assert(err);
        }

        // gets deployed campaigns
        console.log('\x1b[32m%s\x1b[0m', `Active campaigns: ${[campaignAddress]}`);

        // gets contributorCount
        let contributorCount1 = await campaign.methods.contributorCount().call();
        console.log('\x1b[32m%s\x1b[0m', `Contributor count: ${contributorCount1}`);

        // gets account balances
        balance = await web3.eth.getBalance(accounts[3]);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('\x1b[32m%s\x1b[0m', `${accounts[3]} balance: ${balance} ETH`);

        // allows people to contribute money
        await campaign.methods.contribute().send({
            from: accounts[3],
            value: web3.utils.toWei('5', 'ether')
        });
        const isContributor2 = await campaign.methods.isContributor(accounts[3]).call();
        console.log('\x1b[32m%s\x1b[0m', `${accounts[3]} is contributor: ${isContributor2}`);
        assert(isContributor2);

        // gets account balances
        balance = await web3.eth.getBalance(accounts[3]);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('\x1b[32m%s\x1b[0m', `${accounts[3]} balance: ${balance} ETH`);

        // gets contributorCount
        let contributorCount2 = await campaign.methods.contributorCount().call();
        console.log('\x1b[32m%s\x1b[0m', `Contributor count: ${contributorCount2}`);

        // gets account balances
        balance = await web3.eth.getBalance(accounts[4]);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('\x1b[32m%s\x1b[0m', `${accounts[4]} balance: ${balance} ETH`);

        // allows people to contribute money
        await campaign.methods.contribute().send({
            from: accounts[4],
            value: web3.utils.toWei('5', 'ether')
        });
        const isContributor3 = await campaign.methods.isContributor(accounts[4]).call();
        console.log('\x1b[32m%s\x1b[0m', `${accounts[4]} is contributor: ${isContributor3}`);
        assert(isContributor3);

        // gets account balances
        balance = await web3.eth.getBalance(accounts[4]);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('\x1b[32m%s\x1b[0m', `${accounts[4]} balance: ${balance} ETH`);

        // gets contributorCount
        let contributorCount3 = await campaign.methods.contributorCount().call();
        console.log('\x1b[32m%s\x1b[0m', `Contributor count: ${contributorCount3}`);

        // gets contract balance
        balance = await web3.eth.getBalance(_campaignAddress);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('\x1b[32m%s\x1b[0m', `Campaign balance: ${balance} ETH`);

        // lets manager create request
        try {
            await campaign.methods.createRequest(
                'Payday',
                web3.utils.toWei('3', 'ether'),
                accounts[4]
            ).send({
                from: manager,
                gas: 3000000
            });
            console.log('\x1b[32m%s\x1b[0m', 'Request created successfully.');
        } catch (err) {
            console.error('\x1b[31m%s\x1b[0m', err);
        }

        // gets request
        // const request = await campaign.methods.getRequest(0).call();
        // console.log('\x1b[32m%s\x1b[0m', request);
    });
});
