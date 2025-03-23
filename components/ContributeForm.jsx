"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Alert,
    Box,
    Button,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import Campaign from '../backend/campaign';
import web3 from '../backend/web3';

export default function ContributeForm({ address, onContribute }) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [minimumContribution, setMinimumContribution] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const campaign = Campaign(address);
            const minContribution = await campaign.methods.minimumContribution().call();

            setMinimumContribution(minContribution);
        };
        
        fetchData();

        if (amount !== "" && amount < web3.utils.fromWei(minimumContribution, 'ether')) {
            setError("Amount is too low.");
        } else {
            setError("");
        }
    }, [address, amount]);
        
    const handleChange = e => {
        setError("");
        setAmount(e.target.value);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const campaign = Campaign(address);

            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(amount, 'ether')
            });
        } catch (err) {
            console.log(err);
            setError(err.message);
        }

        setLoading(false);
        setAmount("");
        onContribute();
        router.refresh();
    };

    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: "column",
                width: '275px'
            }}>
            <Typography
                variant='h6'
                sx={{ mb: 2, fontWeight: 'bold' }}>
                Contribute to this campaign!
            </Typography>
            <TextField
                type="number"
                value={amount}
                onChange={handleChange}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position='end'>
                                ETH
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ mb: 2 }}
            />
            {error && (
                <Alert
                    severity='error'
                    sx={{ mb: 3 }}
                    variant='filled'>
                    {error}
                </Alert>
            )}
            <Button
                color='primary'
                loading={loading}
                loadingPosition="center"
                onClick={handleSubmit}
                sx={{ mb: 3 }}
                type="submit"
                variant='contained'>
                Contribute
            </Button>
        </Box>
    );
}