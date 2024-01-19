import { Box, Typography } from "@mui/material/";
import { redirect } from "next/navigation";
import NexusCardForm from "@/app/components/card-creator/NexusCardForm";

export default async function DashboardHome() {
    return (
        <Box className="flex flex-col w-full h-full gap-4 p-6 bg-gray-800 md:bg-gray-900">
            <Typography variant="h1">Dashboard</Typography>
            <NexusCardForm />
        </Box>
    );
};