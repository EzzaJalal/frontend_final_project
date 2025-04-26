import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";

import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining";
import DeleteTraining from "./DeleteTraining";
import { Training } from "../types";
import { getTrainingsData } from "../services/TrainingService";
import ConsecutiveSnackbars from "./SnackBar";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function TrainingList() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [snackMessage, setSnackMessage] = useState<string | null>(null);
    const gridRef = useRef<AgGridReact>(null);

    const fetchData = useCallback(async () => {
        try {
            const data = await getTrainingsData();
            setTrainings(data || []);
        } catch (error) {
            console.error("Error fetching trainings:", error);
            setSnackMessage("Failed to load trainings.");
            setTrainings([]);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const resetData = async () => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset",
                { method: "POST" }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const text = await response.text();
            if (text === "DB reset done") {
                setSnackMessage("DB reset done");
                await fetchData();
            } else {
                throw new Error("Unexpected response text");
            }
        } catch (error) {
            console.error("Error resetting data:", error);
            setSnackMessage("Failed to reset data.");
        }
    };

    const deleteTraining = useCallback(async (id: number) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/trainings/${id}`,
                { method: "DELETE" }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            setSnackMessage("Training deleted successfully");
            await fetchData();
        } catch (error) {
            console.error("Error deleting training:", error);
            setSnackMessage("Failed to delete training.");
        }
    }, [fetchData]);

    const saveTraining = async (
        training: { date: string; duration: number; activity: string; customer: string },
        isEdit: boolean = false
    ) => {
        try {
            const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/trainings`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date: dayjs(training.date).toISOString(),
                        duration: training.duration,
                        activity: training.activity,
                        customer: `${import.meta.env.VITE_API_URL}/customers/${training.customer}`,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            setSnackMessage(isEdit ? "Training edited successfully" : "Training added successfully");
            await fetchData();
        } catch (error) {
            console.error("Error saving training:", error);
            setSnackMessage("Failed to add training.");
        }
    };

    const exportToCSV = useCallback(() => {
        gridRef.current!.api.exportDataAsCsv({
            fileName: "trainings.csv",
            columnKeys: ["date", "duration", "activity", "customer"],
        });
    }, []);

    const [columnDefs] = useState<ColDef<Training>[]>([
        {
            headerName: "Date",
            field: "date",
            // Format date as dd.mm.yyyy hh:mm
            valueFormatter: (params) =>
                params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : "N/A",
            sortable: true,
            filter: true,
            flex: 1.5,
        },
        {
            headerName: "Duration",
            field: "duration",
            sortable: true,
            filter: true,
            flex: 1,
        },
        {
            headerName: "Activity",
            field: "activity",
            sortable: true,
            filter: true,
            flex: 1,
        },
        {
            headerName: "Customer",
            field: "customer",
            valueFormatter: (params) => {
                if (typeof params.value === "string") return "N/A";
                return params.value ? `${params.value.firstname} ${params.value.lastname}` : "N/A";
            },
            sortable: true,
            filter: true,
            flex: 1,
        },
        {
            headerName: "Actions",
            flex: 0.75,
            cellStyle: { textAlign: "center" },
            cellRenderer: (row: ICellRendererParams<Training>) => (
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                    <EditTraining
                        training={{
                            id: row.data?.id ?? 0,
                            date: row.data?.date ?? "",
                            duration: row.data?.duration ?? 0,
                            activity: row.data?.activity ?? "",
                            customer: row.data?.customer ?? "",
                            _links: {
                                customer: row.data?._links?.customer ?? { href: "" },
                                training: row.data?._links?.training ?? { href: "" },
                            },
                        }}
                        saveTraining={saveTraining}
                    >
                        <EditIcon className="action-icon edit" />
                    </EditTraining>
                    <DeleteTraining
                        training={{
                            id: row.data?.id ?? 0,
                            date: row.data?.date ?? "",
                            duration: row.data?.duration ?? 0,
                            activity: row.data?.activity ?? "",
                            customer: row.data?.customer ?? "",
                            _links: row.data?._links ?? { training: { href: "" } },
                        }}
                        deleteTraining={() => deleteTraining(row.data?.id ?? 0)}
                    >
                        <DeleteIcon className="action-icon delete" />
                    </DeleteTraining>
                </div>
            ),
            sortable: false,
            filter: false,
        }
    ]);

    return (
        <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                }}
            >
                <AddTraining saveTraining={saveTraining} />
                <Button variant="outlined" color="success" onClick={exportToCSV} className="primary">
                    Export to CSV
                </Button>
                <Button variant="outlined" onClick={resetData} className="secondary">
                    Reset Data
                </Button>
            </div>
            <AgGridReact
                ref={gridRef}
                rowData={trainings}
                columnDefs={columnDefs}
                pagination={true}
                paginationAutoPageSize
            />
            <ConsecutiveSnackbars
                snackMessage={snackMessage}
                setSnackMessage={setSnackMessage}
            />
        </div>
    );
}
