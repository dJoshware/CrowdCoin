// CREATES INSTANCE OF CAMPAIGN FACTORY CONTRACT

import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x945eE41784a094B43EBD0cEADa32095FA7760304'
);

export default instance;