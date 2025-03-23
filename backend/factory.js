// CREATES INSTANCE OF CAMPAIGN FACTORY CONTRACT

import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x29486a20caF307d538904b92560f580a04948D81'
);

export default instance;