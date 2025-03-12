import React from "react";
import Link from "next/link";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function CampaignList({ campaigns }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
            }}>
            <Typography
                variant='h4'
                gutterBottom
                sx={{ fontWeight: 'bold' }}>
                Campaigns Index
            </Typography>
            <Typography
                variant='h5'
                gutterBottom
                sx={{ fontWeight: 'bold' }}>
                Open Campaigns
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    width: "50%",
                }}>
                {campaigns.map((address, index) => (
                    <Card
                        key={index}
                        sx={{ marginBottom: 2 }}>
                        {/* <CardActionArea> */}
                            <CardContent>
                                <Typography variant='h6'  sx={{ fontWeight: 'bold' }}>{address}</Typography>
                                <Link
                                    href={`/campaigns/${address}`}
                                    passHref
                                    style={{
                                        textDecoration: "none"
                                    }}>
                                    <Typography>
                                        View Campaign
                                    </Typography>
                                </Link>
                            </CardContent>
                        {/* </CardActionArea> */}
                    </Card>
                ))}
            </Box>
            <Link href='/campaigns/new'>
                <Button
                    color='primary'
                    variant='contained'
                    startIcon={<AddCircleIcon />}
                    sx={{ mb: 3 }}>
                    Create Campaign
                </Button>
            </Link>
        </Box>
    );
}
