"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    const [isContributor, setIsContributor] = useState(false);
    const [hasApproved, setHasApproved] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const _campaign = Campaign(props.campaign);
            const accounts = await web3.eth.getAccounts();
            const manager = await _campaign.methods.manager().call();
            const _isContributor = await _campaign.methods.isContributor(accounts[0]).call();

            setAccount(accounts[0]);
            setManager(manager);
            setIsContributor(_isContributor);
        };
        fetchData();

        // Listen for MetaMask account change
        window.ethereum?.on("accountsChanged", (newAccount) => {
            setAccount(newAccount[0]);
            router.refresh();
        });

        // Cleanup event listener on unmount
        return () => {
            window.ethereum?.removeListener("accountsChanged", () => {});
        };
    }, []);

    useEffect(() => {
        if (!account) return;

        const fetchApprovals = async () => {
            const approvals = {};
            for (let i = 0; i < props.requests.length; i++) {
                approvals[i] = await getHasApproved(account, i);
            }
            setHasApproved(approvals);
        };
        fetchApprovals();
    }, [account]);

    const router = useRouter();

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
            } else {
                await _campaign.methods.approveRequest(index).send({
                    from: account,
                });
            }
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
        // setLoading(false);
        setLoading(prev => ({ ...prev, [index]: true }));

        router.refresh();
    };

    const getTooltipTitle = request => {
        if (manager === account) {
            if (request.approvalCount < props.contributorCount / 2) return "Request does not have enough approvals.";
        }
        if (!isContributor) return "You must be a contributor to do this.";
        return "";
    }

    const getButtonDisability = request => {
        if (manager === account) {
            if (request.approvalCount < props.contributorCount / 2) {
                return true;
            }
        }
        if (!isContributor) {
            return true;
        }
        return false;
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
                <caption>Found {props.requestCount} requests</caption>
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
                    {props.requests.map((request, index) => {
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
                                    {props.contributorCount}
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
                                                        disabled={getButtonDisability(request)}
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
