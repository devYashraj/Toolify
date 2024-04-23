import Navbar from "../components/Navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import { experimentalStyled as styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import {testUser} from '../components/utils'

const contacts = ["Ph No: " + companyPhno, "Address: " + companyAddr, "Email: " + companyEmail];

const articles = [
    {
        question: "What is sintering?",
        answer: "Sintering, by definition, is a process used in manufacturing to compact solid materials. The resulting product is a harder, stronger, more durable mass due to the high heat and pressure applied forcing the atoms of the material into tighter bonds with each other. Most manufacturing processes use a sintering furnace that can provide the necessary temperatures quickly and accurately. At its most effective, sintering materials reduces porousness while enhancing strength. Powder metallurgy is the specific study of the sintering process using powdered metals.",
    },
    {
        question: "What Are Sintering Materials?",
        answer: "The manufacturing of pottery is the most common use for the sintering process, used the world over. It has been utilized for thousands of years in one form or another to strengthen clay materials. Most people, however, are surprised to learn that powder metallurgy has an equally storied history dating back to the ancient Egyptians over 5,000 years ago.In contemporary manufacturing, metal powders have become more refined. As sintering technologies have improved, the actual sintering materials have also improved. The sintering powders used in the metal manufacturing process — stainless steel, aluminum, nickel, copper and titanium alloy — make up the vast majority of powder metals used in additive manufacturing today.",
    },
    {
        question: "Why Would You Sinter Metal?",
        answer: "Powder metallurgy covers a broad range of manufacturing, but what each process shares is the use of sintering powder for metal part fabrication. The benefits of utilizing a furnace or oven — strengthening metal parts through heat and compaction — are core components of additive manufacturing. The sintering process allows us to create components which would decompose otherwise. Because sintering does not require manufacturers to consider solid-liquid phase changes, powder metallurgy is more flexible than conventional manufacturing techniques such as casting, forging and extrusion."
    }
];

const whyus = ["Supreme Quality", "Competitive Price", "Fast Delivery"];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkUser = async () => {
            const res = await testUser();
            setLoggedIn(res);
            setLoading(false);
        };
        checkUser();
    }, []);

   
    const scrollToSection = (id) => {
        if (id !== 'Orders')  {
            const section = document.getElementById(id);
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (<>
        <Navbar scroll={scrollToSection} loggedIn = {loggedIn}/>
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            m: 2,
            my: 10,
        }}>
            <Typography id="Home" variant="h3" sx={{ textAlign: 'center', fontFamily: 'monospace', m: 3 }}>
                Why choose Us?
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 3, md: 12 }}>
                {
                    whyus.map((statement, i) => {
                        return (
                            <Grid key={i} item xs={4} sm={4} md={4}>
                                <Item sx={{
                                    '&:hover': {
                                        '& .MuiSvgIcon-root': {
                                            color: 'green',
                                            transition: 'ease-in'
                                        }
                                    }
                                }}>
                                    {statement === "Supreme Quality" &&
                                        <VerifiedIcon sx={{ fontSize: 200, color: '#2b2d42' }} />}

                                    {statement === "Competitive Price" &&
                                        <MonetizationOnIcon sx={{ fontSize: 200, color: '#2b2d42' }} />}

                                    {statement === "Fast Delivery" &&
                                        <SpeedIcon sx={{ fontSize: 200, color: '#2b2d42' }} />}

                                    <Typography variant="h5" component="h2">
                                        {statement}
                                    </Typography>
                                </Item>
                            </Grid>
                        );
                    })
                }
            </Grid>
            <Typography id="About" variant="h3" sx={{ textAlign: 'center', fontFamily: 'monospace', m: 3, mt: 10 }}>
                About
            </Typography>
            {
                articles.map((item, i) => {
                    return (
                        <Item key={i} className="item">
                            <Typography variant="h4" sx={{ textAlign: 'left', fontFamily: 'monospace' }}>{item.question}</Typography>
                            <article className="sintArticleL">
                                {item.answer}
                            </article>
                        </Item>
                    );
                })
            }
            <Typography id="Contact" variant="h3" sx={{ textAlign: 'center', fontFamily: 'monospace', m: 3, mt: 10 }}>
                Contact
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 3, md: 12 }}>
                {
                    contacts.map((c, i) => (
                        <Grid key={i} item xs={4} sm={4} md={4}>
                            <Item>
                                <Typography variant="h7" component="h3">
                                    {c}
                                </Typography>
                            </Item>
                        </Grid>
                    ))
                }
            </Grid>
        </Box >
        <Footer />
    </>);
}