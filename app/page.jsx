import React from "react";
import instance from "../backend/factory";
import CampaignList from '../components/CampaignList';
import { Container } from '@mui/material';

export default async function CampaignIndex() {
    const campaigns = await instance.methods.getDeployedCampaigns().call();

    return (
        <Container maxWidth='xl'>
            <CampaignList campaigns={campaigns} />
        </Container>
    );
}
