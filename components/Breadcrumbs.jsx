"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Function to format breadcrumb text
const formatBreadcrumb = segment => {
    return (
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    );
};

export default function CustomBreadcrumbs() {
    const pathname = usePathname(); // Get current path
    const pathSegments = pathname.split("/").filter(Boolean); // Remove empty segments

    return (
        <Container
            maxWidth='xl'
            sx={{ pb: 2 }}>
            <Breadcrumbs
                aria-label='breadcrumb'
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ mb: 2 }}>
                <Link
                    href='/'
                    style={{
                        color: "#212121",
                    }}>
                    Home
                </Link>

                {pathSegments.map((segment, index) => {
                    // Build breadcrumb path dynamically
                    const href = `/${pathSegments
                        .slice(0, index + 1)
                        .join("/")}`;
                    const isLast = index === pathSegments.length - 1;

                    return isLast ? (
                        <Typography
                            key={href}
                            sx={{
                                color: "#000",
                                fontSize: "1.1rem",
                            }}>
                            {formatBreadcrumb(segment)}
                        </Typography>
                    ) : href === "/campaigns" ? (
                        <Link
                            key={href}
                            href='/'
                            style={{
                                color: "#212121",
                            }}>
                            {formatBreadcrumb(segment)}
                        </Link>
                    ) : (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                color: "#212121",
                            }}>
                            {formatBreadcrumb(segment)}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </Container>
    );
}
