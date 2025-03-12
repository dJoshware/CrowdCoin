// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CampaignFactory { // Contract that deploys instances of Campaign contract
    address[] public deployedCampaigns; // Variable to store all Campaign instance addresses

    // Event to track logs on blockchain
    event CampaignCreated(address indexed manager, address campaign);

    function createCampaign(uint minimum) public {
        // Pass msg.sender to Campaign contructor so the creator of a campaign becomes manager instead of the Factory address
        Campaign newCampaign = new Campaign(minimum, msg.sender); // Must create variable in type <contract-name> (Campaign)
        deployedCampaigns.push(address(newCampaign)); // Then convert the variable type to address to properly store the Campaign address

        emit CampaignCreated(msg.sender, address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager; // Address of contract creator
    uint public minimumContribution; // Minimum contribution in Wei
    uint public contributorCount; // Increment value everytime Campaign gets a new contributor
    Request[] public requests; // Array of our custom requests

    // Records all yes votes, per request, for a user account address
    mapping(address => ContributorData) contributorsData;

    // A struct is similar to a Class in JS or Python
    struct Request { // Only manager can use this
        bool complete; // True if request has been processed/voted on/money already sent
        uint128 approvalCount; // Records all yes votes per request
        uint128 value; // Amount of money that manager wants to send
        address payable recipient; // Address that money will be sent to
        string description; // Describes why the request is being created
    }
    // Struct for contributors and the requests they've approved
    struct ContributorData {
        bool isContributor; // Is this address a contributor?
        mapping(uint => bool) approvals; // Mapping of request index to approval status
    }

    // Events to track logs on blockchain
    event ContributionReceived(address indexed contributor, uint amount);
    event RequestApproved(address indexed contributor, Request request);
    event RequestFinalized(address indexed manager, Request request);
    event RequestCreated(address indexed creator);

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can do this.");
        _;
    }
    // Creator will be person creating new Campaign instance and they can manage their campaign(s)
    constructor(uint minimum, address creator) {
        require(minimum > 0, "Minimum contribution value must be greater than 0.");
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Minimum ETH not met.");
        ContributorData storage data = contributorsData[msg.sender];
        if (!data.isContributor) {
            contributorCount++;
            data.isContributor = true;
        }
        emit ContributionReceived(msg.sender, msg.value);
    }

    function createRequest(string memory description, uint128 value, address payable recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);

        emit RequestCreated(msg.sender);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index]; // Simply setting requests[index] to request for ease of use | Must be of type Request and set to storage to be able to reuse the variable
        ContributorData storage data = contributorsData[msg.sender];

        // "You have not contributed to the campaign."
        require(data.isContributor, "You've not contributed."); // Checks if an address is a contributor
        // "You have already approved this request."
        require(!data.approvals[index], "You've approved this request."); // Checks the request's approvals if the contributor has approved this request | Set to NOT (!) to return false if true

        data.approvals[index] = true; // Sets value of address of voter in Request struct to true
        request.approvalCount++; // Increment number of approvals

        emit RequestApproved(msg.sender, request);
    }

    function finalizeRequest(uint index) public payable restricted {
        require(address(this).balance > msg.value, "Insufficient contract balance.");
        Request storage request = requests[index];
        uint cachedContributorCount = contributorCount; // Caching state variable in memory
        // "There are not enough approvals to complete this request."
        require(request.approvalCount > (cachedContributorCount >> 2), "Not enough approvals."); // Checks if "yes votes" are greater than 50% of contributors
        // "This request has already been completed."
        require(!request.complete, "Request completed already."); // Checks if a request.complete is true | Set to NOT (!) to return false if true

        // Update state before sending Ether; avoids reentrancy risks
        request.complete = true;

        // Sends request.value to request.recipient
        (bool success, ) = request.recipient.call{ value: request.value }("");
        require(success, "Transfer failed.");

        emit RequestFinalized(msg.sender, request);
    }

    function isContributor(address contributor) public view returns (bool) {
        ContributorData storage data = contributorsData[contributor]; // Gets contributor by address
        return data.isContributor;
    }

    function contributorHasApproved(address contributor, uint index) public view returns (bool) {
        ContributorData storage data = contributorsData[contributor]; // Gets contributor by address
        return data.approvals[index]; // Returns true/false if contributor has approved specific request
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    } 

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorCount,
            manager
        );
    }
}
