import React, {useEffect, useState} from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'
import Holiday from "./Holiday";
import {countries} from "./CountryData";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { w3cwebsocket as W3CWebSocket } from "websocket";

function Calender() {
    const [startDate, setStartDate] = useState(new Date());
    const [holidayInfo,setHolidayInfo]=useState([])
    const [nameCountry,setNameCountry]=useState('')
    const handleChange=(date)=>{
        setStartDate(date)
        getHoliday(date)
    }

    const getHoliday=async (date)=>{
        const res=await axios.get(`https://holidays.abstractapi.com/v1/?api_key=8ea818b9b0e24799b5dbf25216fb9e4e&country=${nameCountry||"IN"}&year=${date.$y}&month=${date.$M+1}&day=${date.$D}`)
        setHolidayInfo(res?.data||[])
    }

    useEffect(()=>{
        getHolidayData()

    },[])

    const onCompleted=(value)=>{
        setNameCountry(value?.code)
    }
    const getHolidayData=async()=>{
        const res=await axios.get(`https://holidays.abstractapi.com/v1/?api_key=8ea818b9b0e24799b5dbf25216fb9e4e&country=IN&year=${startDate.getFullYear()}&month=${startDate.getMonth()+1}&day=${startDate.getDate()}`)
        setHolidayInfo(res?.data||[])
    }

    return(
        <>
            <h2 className='headerTitle'>Calender App</h2>
            <div className='mainBox'>
                <span>Select date:</span>
                <div className='datepicker'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                    <DesktopDatePicker
                        label="Date desktop"
                        inputFormat="MM/DD/YYYY"
                        value={startDate}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} size='small' onChange={handleChange}/>}
                    />
                    </LocalizationProvider>

            </div>
                <Autocomplete
                    id="country-select-demo"
                    sx={{ width: 300 }}
                    onChange={(event, value) => onCompleted(value)}
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                alt=""
                            />
                            {option.label} ({option.code})
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose a country"
                            onChange={(e)=>console.log('---',e.target.value)}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                            size="small"
                        />
                        )}
                    />
            </div>
        <Holiday holidayInfo={holidayInfo}/>
        </>
    )
}
export default Calender