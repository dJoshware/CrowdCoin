"use client";

import React, { useState, useEffect } from "react";
import instance from "../backend/factory";
import CampaignList from '../components/CampaignList';
import { Container } from '@mui/material';

export default function CampaignIndex() {
    const [campaigns, setCampaigns] = useState([]);
    
    const fetchCampaigns = async () => {
        try {
            const campaignList = await instance.methods.getDeployedCampaigns().call();
            setCampaigns(campaignList);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    return (
        <Container maxWidth='xl'>
            <CampaignList campaigns={campaigns} />
        </Container>
    );
}
