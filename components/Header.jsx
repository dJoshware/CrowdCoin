"use client";

import React from "react";
import Link from "next/link";
import {
    AppBar,
    Button,
    Container,
    Toolbar,
    Typography
} from "@mui/material";

export default function Header() {
    return (
        <Container
            maxWidth='xl'
            sx={{ padding: 3 }}>
            <AppBar
                color='transparent'
                position='sticky'>
                <Toolbar>
                    <Link className='item' href='/' passHref style={{
                        color: 'black',
                        flexGrow: 1,
                        textDecoration: 'none',
                    }}>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold' }}>
                            CrowdCoin
                        </Typography>
                    </Link>
                    <Link href='/campaigns/new'>
                        <Button
                            color='primary'
                            variant='contained'>
                            Create Campaign
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </Container>
    );
}
