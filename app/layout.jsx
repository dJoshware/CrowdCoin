import React from "react";
import Header from "../components/Header";
import CustomBreadcrumbs from "../components/Breadcrumbs";
import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <head>
                <title>CrowdCoin</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
            </head>
            <body>
                <CssBaseline />
                <Header />
                <CustomBreadcrumbs />
                {children}
            </body>
        </html>
    );
}
