"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import { green, grey, yellow } from "@mui/material/colors";
import Campaign from "../backend/campaign";
import web3 from "../backend/web3";

export default function RequestTable(props) {
    // const [loading, setLoading] = useState(false);
    const [loading, setLoading] = useState({});
    const [error, setError] = useState("");

    const [account, setAccount] = useState("");
    const [manager, setManager] = useState("");
    const [requests, setRequests] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const [contributorCount, setContributorCount] = useState(0);
    const [isContributor, setIsContributor] = useState(false);
    const [hasApproved, setHasApproved] = useState({});

    useEffect(() => {
        // const fetchData = async selectedAccount => {
        //     const _campaign = Campaign(props.campaign);
        //     // const accounts = await web3.eth.getAccounts();
        //     const manager = await _campaign.methods.manager().call();
        //     const requestCount = await _campaign.methods.getRequestsCount().call();
        //     const contributorCount = await _campaign.methods.contributorCount().call();
        //     const isContributor = await _campaign.methods.isContributor(selectedAccount).call();

        //     const BATCH_SIZE = 10;
        //     const fetchedRequests = [];
        //     for (let i = 0; i < Number(requestCount); i += BATCH_SIZE) {
        //         const batch = await Promise.all(
        //             Array.from(
        //                 { length: Math.min(BATCH_SIZE, Number(requestCount) - i) },
        //                 (_, index) => _campaign.methods.requests(i + index).call()
        //             )
        //         );
        //         fetchedRequests.push(...batch);
        //     }

        //     const approvals = {};
        //     for (let i = 0; i < fetchedRequests.length; i++) {
        //         approvals[i] = await getHasApproved(selectedAccount, i);
        //     }

        //     setAccount(selectedAccount);
        //     setManager(manager);
        //     setRequests(fetchedRequests);
        //     setRequestCount(Number(requestCount));
        //     setContributorCount(Number(contributorCount));
        //     setIsContributor(isContributor);
        //     setHasApproved(approvals);
        // };

        const initialize = async () => {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                await fetchData(accounts[0]);
            }
        };

        const handleAccountChange = async newAccounts => {
            if (newAccounts.length > 0) {
                await fetchData(newAccounts[0]);
            }
            reloadWindow(true);
        };

        initialize();

        // Listen for MetaMask account change
        window.ethereum?.on("accountsChanged", handleAccountChange);

        // Cleanup event listener on unmount
        return () => {
            window.ethereum?.removeListener("accountsChanged", handleAccountChange);
        };
    }, [props.campaign, account]);

    const fetchData = async selectedAccount => {
        const _campaign = Campaign(props.campaign);
        // const accounts = await web3.eth.getAccounts();
        const manager = await _campaign.methods.manager().call();
        const requestCount = await _campaign.methods.getRequestsCount().call();
        const contributorCount = await _campaign.methods.contributorCount().call();
        const isContributor = await _campaign.methods.isContributor(selectedAccount).call();

        const BATCH_SIZE = 10;
        const fetchedRequests = [];
        for (let i = 0; i < Number(requestCount); i += BATCH_SIZE) {
            const batch = await Promise.all(
                Array.from(
                    { length: Math.min(BATCH_SIZE, Number(requestCount) - i) },
                    (_, index) => _campaign.methods.requests(i + index).call()
                )
            );
            fetchedRequests.push(...batch);
        }

        const approvals = {};
        for (let i = 0; i < fetchedRequests.length; i++) {
            approvals[i] = await getHasApproved(selectedAccount, i);
        }

        setAccount(selectedAccount);
        setManager(manager);
        setRequests(fetchedRequests);
        setRequestCount(Number(requestCount));
        setContributorCount(Number(contributorCount));
        setIsContributor(isContributor);
        setHasApproved(approvals);
    };

    const reloadWindow = shouldReload => {
        if (shouldReload && !window.__hasReloaded__) {
            window.__hasReloaded__ = true;
            window.location.reload();
        }
    };

    const handleSubmit = async index => {
        // setLoading(true);
        setLoading(prev => ({ ...prev, [index]: true }));
        setError("");

        try {
            const _campaign = Campaign(props.campaign);
            if (manager === account) {
                await _campaign.methods.finalizeRequest(index).send({
                    from: account,
                });
                reloadWindow(true);
            } else {
                await _campaign.methods.approveRequest(index).send({
                    from: account,
                });
                reloadWindow(true);
            }
            await fetchData();
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
        // setLoading(false);
        setLoading(prev => ({ ...prev, [index]: false }));
    };

    const getTooltipTitle = request => {
        if (manager === account) {
            if (request.approvalCount < contributorCount / 2) return "Request does not have enough approvals.";
            return "";
        } else {
            if (!isContributor) return "You must be a contributor to do this.";
            return "";
        }
    }

    const getButtonDisability = request => {
        if (manager === account) {
            return request.approvalCount < contributorCount / 2;
        } else {
            return !isContributor;
        }
    }

    const getHasApproved = async (account, index) => {
        const _campaign = Campaign(props.campaign);
        try {
            const _hasApproved = await _campaign.methods.contributorHasApproved(account, index).call();
            return _hasApproved;
        } catch (err) {
            // setError(err.message);
            console.log(err);
            return false;
        }
    }

    return (
        <TableContainer
            component={Paper}
            sx={{ maxWidth: "75%" }}>
            <Table
                stickyHeader
                aria-label='List of campaign requests'>
                <caption>Found {requestCount} requests</caption>
                <TableHead>
                    <TableRow
                        sx={{
                            "& th:not(:last-child)": {
                                borderRight: 1,
                                borderRightColor: "grey.300",
                            },
                        }}>
                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell
                            align='center'
                            sx={{ fontWeight: "bold" }}>
                            Description
                        </TableCell>
                        <TableCell
                            align='center'
                            sx={{ fontWeight: "bold" }}>
                            Amount
                        </TableCell>
                        <TableCell
                            align='center'
                            sx={{ fontWeight: "bold" }}>
                            Recipient
                        </TableCell>
                        <TableCell
                            align='center'
                            sx={{ fontWeight: "bold" }}>
                            Approval Count
                        </TableCell>
                        {manager === account ? (
                            <TableCell
                                align='center'
                                sx={{ fontWeight: "bold" }}>
                                Finalize
                            </TableCell>
                        ) : (
                            <TableCell
                                align='center'
                                sx={{ fontWeight: "bold" }}>
                                Approve
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((request, index) => {
                        return (
                            <TableRow
                                key={index}
                                address={props.campaign}
                                sx={{
                                    "th:not(:last-child), td:not(:last-child)":
                                        {
                                            borderRight: 1,
                                            borderRightColor: "grey.300",
                                        },
                                    opacity: request.complete ? 0.5 : 1,
                                    "th, td": {
                                        backgroundColor: manager !== account && hasApproved[index] ? green[300] : request.complete && manager === account ? yellow[400] : null
                                    }
                                }}>
                                <TableCell
                                    component='th'
                                    scope='row'>
                                    {index + 1}
                                </TableCell>
                                <TableCell align='center'>
                                    {request.description}
                                </TableCell>
                                <TableCell align='center'>
                                    {web3.utils.fromWei(request.value, "ether")}
                                </TableCell>
                                <TableCell align='center'>
                                    {request.recipient}
                                </TableCell>
                                <TableCell align='center'>
                                    {request.approvalCount}/
                                    {contributorCount}
                                </TableCell>
                                {request.complete ? (
                                    <TableCell
                                        align='center'
                                        sx={{ fontWeight: "bold" }}>
                                        REQUEST COMPLETE
                                    </TableCell>
                                ) : (
                                    <TableCell
                                        align='center'
                                        sx={{ fontWeight: "bold" }}>
                                        {hasApproved[index] && manager !== account ? "APPROVED" : (
                                            <Tooltip
                                                arrow
                                                disableHoverListener={getTooltipTitle(request) === ""}
                                                title={getTooltipTitle(request)}
                                                slotProps={{
                                                    popper: {
                                                        modifiers: [
                                                            {
                                                                name: 'offset',
                                                                options: {
                                                                    offset: [0, 5],
                                                                },
                                                            },
                                                        ],
                                                    },
                                                }}>
                                                <span>
                                                    <Button
                                                        disabled={getButtonDisability(request, index)}
                                                        loading={loading[index]}
                                                        loadingPosition='center'
                                                        onClick={() => handleSubmit(index)}
                                                        sx={{
                                                            backgroundColor:
                                                                manager === account
                                                                    ? yellow[600]
                                                                    : green[500],
                                                            color: grey[900],
                                                            fontWeight: "normal"
                                                        }}
                                                        variant='contained'>
                                                        {manager === account
                                                            ? "Finalize"
                                                            : "Approve"}
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
