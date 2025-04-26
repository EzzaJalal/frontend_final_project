import './styles/global.css';
import { AppBar, Toolbar, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import BasicTabs from "./components/BasicTabs";

function App() {
    return (
        <>
            <Container maxWidth="xl" sx={{ paddingTop: "64px" }}>
                <AppBar>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Fitness Station
                        </Typography>
                    </Toolbar>
                </AppBar>
                <CssBaseline />
                <BasicTabs />
                <CssBaseline />
            </Container>
        </>
    );
}

export default App;
