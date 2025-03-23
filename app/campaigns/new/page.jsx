"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Alert,
    Box,
    Button,
    Container,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import factory from "../../../backend/factory";
import web3 from "../../../backend/web3";

export default function CampaignNew() {
    const [minimumContribution, setMinimumContribution] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleChange = e => {
        setMinimumContribution(e.target.value);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const accounts = await web3.eth.getAccounts();

            await factory.methods.createCampaign(web3.utils.toWei(minimumContribution, 'ether')).send({
                from: accounts[0],
            });

            router.push("/");   
        } catch (err) {
            console.log(err);
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <Container maxWidth='xl'>
            <Typography
                variant='h4'
                sx={{
                    fontWeight: 'bold'
                }}>
                Create a Campaign
            </Typography>
            <Box component='form'>
                <TextField
                    id='outlined-end-adornment'
                    label='Minimum Contribution'
                    onChange={handleChange}
                    sx={{ my: 3, width: 500 }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position='end'>
                                    ETH
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>
            {error && (
                <Alert
                    severity='error'
                    sx={{ mb: 3, width: "fit-content" }}
                    variant='filled'>
                    {error}
                </Alert>
            )}
            <Button
                color='primary'
                loading={loading}
                loadingPosition="center"
                onClick={handleSubmit}
                type='submit'
                variant='contained'>
                Create
            </Button>
        </Container>
    );
}
