import React from "react";
import Link from "next/link";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid2,
    Typography,
} from "@mui/material";
import Campaign from "../../../backend/campaign";
import web3 from "../../../backend/web3";
import ContributeForm from '../../../components/ContributeForm';

export default async function CampaignShow({ params }) {
    const { campaign } = await params;

    async function createCampaign() {
        const _campaign = Campaign(campaign);
        const summary = await _campaign.methods.getSummary().call();

        return {
            address: campaign,
            minimumContribution: web3.utils.fromWei(summary[0], 'ether'),
            balance: web3.utils.fromWei(summary[1], 'ether'),
            requests: summary[2],
            contributors: summary[3],
            manager: summary[4]
        };
    }
    const campaignDetails = await createCampaign();

    const detailLabels = {
        address: 'Campaign Address',
        minimumContribution: 'Minimum Contribution (ETH)',
        balance: 'Campaign Balance (ETH)',
        requests: 'Requests',
        contributors: 'Contributors',
        manager: 'Manager'
    }

    return (
        <Container
            maxWidth='xl'
            sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 3,
            }}>
            {/* LEFT SIDE */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                }}>
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bold' }}>
                    Campaign Details
                </Typography>

                <Grid2 container>
                    {Object.entries(campaignDetails)
                    .filter(([key]) => key !== "manager")
                    .map(([key, value]) => (
                        <Grid2 size={6} key={key}>
                            <Card sx={{ my: 2, mr: 2 }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 'bold' }}>{value}</Typography>
                                    <Typography color='text.secondary'>
                                        {detailLabels[key] || key}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>

                <Link href={`/campaigns/${campaignDetails.address}/requests`}>
                    <Button
                        color='primary'
                        variant='contained'>
                        View Requests
                    </Button>
                </Link>
            </Box>
            {/* RIGHT SIDE */}
            <ContributeForm
                address={campaignDetails.address}
            />
        </Container>
    );
}
