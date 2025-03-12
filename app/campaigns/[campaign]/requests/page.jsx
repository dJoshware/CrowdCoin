import React from "react";
import Link from "next/link";
import {
    Box,
    Button,
    Container,
    Typography,
} from "@mui/material";
import Campaign from '../../../../backend/campaign';
import web3 from "../../../../backend/web3";
import RequestTable from "../../../../components/RequestTable";

export default async function RequestPage({ params }) {
    const { campaign } = await params;

    const _campaign = Campaign(campaign);
    const manager = await _campaign.methods.manager().call();
    // Convert Solidity's BigInt to JS Number for arithmetic
    const requestCount = Number(
        await _campaign.methods.getRequestsCount().call()
    );
    // Get total number of approvers from contract
    const contributorCount = await _campaign.methods.contributorCount().call();
    // Batch call contract function for speed and to reduce RPC load
    const BATCH_SIZE = 10;
    const requests = [];

    for (let i = 0; i < requestCount; i += BATCH_SIZE) {
        const batch = await Promise.all(
            Array.from(
                { length: Math.min(BATCH_SIZE, requestCount - i) },
                (_, index) => _campaign.methods.requests(i + index).call()
            )
        );
        requests.push(...batch);
    }

    return (
        <Container
            maxWidth='xl'
            sx={{
                p: 3,
            }}>
            {/* MAIN CONTAINER */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                {/* CONTAINER FOR TITLE TEXT AND CREATE BUTTON */}
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: "75%",
                    }}>
                    <Typography
                        variant='h5'
                        sx={{
                            fontWeight: "bold",
                        }}>
                        All Requests
                    </Typography>
                    <Link href={`/campaigns/${campaign}/requests/new`}>
                        <Button
                            color='primary'
                            variant='contained'
                            sx={{ my: 3 }}>
                            Create Request
                        </Button>
                    </Link>
                </Box>
                {/* TABLE COMPONENT */}
                <RequestTable
                    contributorCount={Number(contributorCount)}
                    campaign={campaign}
                    manager={manager}
                    requestCount={requestCount}
                    requests={requests}
                />
            </Box>
        </Container>
    );
}
