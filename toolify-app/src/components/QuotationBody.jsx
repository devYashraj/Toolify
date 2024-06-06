import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'


export default function QuotationBody({ quote, quotation, toolName, orderId, order, flag}) {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const total = quotation.reduce((t, c) => t + (c.price * c.qty), 0);
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const navigate = useNavigate();
    return (
        <React.Fragment>
            <Button disabled={quote} sx={{ marginLeft: 'auto', color: 'green' }} onClick={handleClickOpen('paper')}>View Quotation</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullScreen={fullScreen}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <DialogTitle id="scroll-dialog-title">Quotation for {toolName}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        component={'span'}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            m: 3
                        }}>
                            {quotation.length !== 0 &&
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sr No</TableCell>
                                                <TableCell align="left">Item</TableCell>
                                                <TableCell align="left">Quantity</TableCell>
                                                <TableCell align="left">Price (₹)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {quotation.map((item, i) => (
                                                <TableRow
                                                    key={i}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {i + 1}
                                                    </TableCell>
                                                    <TableCell align="left">{item.itemName}</TableCell>
                                                    <TableCell align="left">
                                                        {item.qty}
                                                    </TableCell>
                                                    <TableCell align="left">{item.price * item.qty + "/-"}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className='bill'>
                                                <TableCell colSpan={3} align="center">Total</TableCell>
                                                <TableCell >{"₹ " + total + " /-"}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                        </Box>
                        <Box sx={{textAlign:'center'}}>
                            {!flag && <Button variant="contained" color='primary'
                                onClick={() => navigate(`../send-po/${orderId}`,{
                                    state:{
                                        address:order.address,
                                        total:total,
                                        toolName:toolName,
                                    }
                                })}
                            >
                                Send Purchase Order
                            </Button>}
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}