"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Alert,
    Box,
    Button,
    Container,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import Campaign from "../../../../../backend/campaign";
import web3 from "../../../../../backend/web3";

export default function RequestNew() {
    const { campaign } = useParams();

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const [descriptionLabel, setDescriptionLabel] = useState("Description");
    const [descriptionHelperText, setDescriptionHelperText] = useState("");

    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState(false);
    const [amountLabel, setAmountLabel] = useState("Amount");
    const [amountHelperText, setAmountHelperText] = useState("");

    const [recipient, setRecipient] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleChange = async e => {
        const { name, value } = e.target;

        if (name == "description") {
            setError("");
            setDescription(value);
            setDescriptionError(false);
            setDescriptionLabel("Description");
            setDescriptionHelperText("");
        }
        if (name == "amount") {
            setError("");
            setAmount(value);
            setAmountError(false);
            setAmountLabel("Amount");
            setAmountHelperText("");
        }
        if (name == "recipient") setRecipient(value);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const _campaign = Campaign(campaign);

        if (!description.trim()) {
            setDescriptionError(true);
            setDescriptionLabel("Error");
            setDescriptionHelperText("Must have a description!");
            return;
        }
        if (!amount) {
            setAmountError(true);
            setAmountLabel("Error");
            setAmountHelperText("Must have an amount!");
            return;
        }
        const summary = await _campaign.methods.getSummary().call();
        if (web3.utils.toWei(amount, 'ether') > Number(summary[1])) {
            setError("Amount cannot be greater than campaign balance.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const accounts = await web3.eth.getAccounts();

            await _campaign.methods.createRequest(
                description,
                web3.utils.toWei(amount, 'ether'),
                recipient
            ).send({
                from: accounts[0]
            });

            router.push(`/campaigns/${campaign}/requests`);
        } catch (err) {
            console.log(err);
            setError(err.message);
        }

        setLoading(false);
        setError("");
    };

    return (
        <Container maxWidth='xl'>
            <Box
                component='form'
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: 'start'
                }}>
                <Typography
                    variant='h5'
                    sx={{
                        mb: 2,
                        fontWeight: 'bold'
                    }}>Create New Request</Typography>
                {/* DESCRIPTION FIELD */}
                <TextField
                    error={descriptionError}
                    helperText={descriptionHelperText}
                    label={descriptionLabel}
                    multiline
                    maxRows={3}
                    name='description'
                    onChange={handleChange}
                    sx={{ mb: 3, width: 500 }}
                    value={description}
                />
                {/* AMOUNT FIELD */}
                <TextField
                    error={amountError}
                    helperText={amountHelperText}
                    label={amountLabel}
                    name='amount'
                    onChange={handleChange}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment
                                position='end'>
                                        ETH
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ mb: 3, width: 500 }}
                    type='number'
                    value={amount}
                />
                {/* RECIPIENT FIELD */}
                <TextField
                    label='Recipient'
                    onChange={handleChange}
                    sx={{ mb: 3, width: 500 }}
                    name='recipient'
                    value={recipient}
                />
                {/* ERROR MESSAGE */}
                {error && (
                    <Alert
                        severity='error'
                        sx={{ mb: 3, width: "fit-content" }}
                        variant='filled'>
                        {error}
                    </Alert>
                )}
                {/* SUBMIT BUTTON */}
                <Button
                    color='primary'
                    loading={loading}
                    loadingPosition="center"
                    onClick={handleSubmit}
                    sx={{ mb: 3, width: 'fit-content' }}
                    type='submit'
                    variant='contained'>
                    Create Request
                </Button>
            </Box>
        </Container>
    );
}
