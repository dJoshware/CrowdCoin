import React from "react";
import Link from "next/link";
import {
    Box,
    Button,
    Container,
    Typography,
} from "@mui/material";
import RequestTable from "../../../../components/RequestTable";

export default async function RequestPage({ params }) {
    const { campaign } = await params;

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
                <RequestTable campaign={campaign} />
            </Box>
        </Container>
    );
}
