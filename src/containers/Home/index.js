import React, {useEffect, useMemo, useState} from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { useWallet } from "../../context/wallet.context";
import { getExchangeRate } from "../../services/rate.service";

const PREFIX = 'exchange';
const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  cardTop: `${PREFIX}-top`,
  cardBottom: `${PREFIX}-bottom`,
  rate: `${PREFIX}-rate`,
};

const Root = styled('div')(() => ({
  [`&.${classes.root}`]: {
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`& .${classes.card}`]: {
    width: '100%',
    marginBottom: '10px',
  },
  [`& .${classes.cardTop}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
  },
  [`& .${classes.cardBottom}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: '#f2f2f2',
  },
  [`& .${classes.rate}`]: {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translate(-50%, 50%)',
    width: '130px',
    background: '#fff',
    borderColor: '#2E7D32',
  }
}));

const currencies = [
  { label: 'USD', value: 'USD', unit: '$', symbols: 'EUR,GBP'},
  { label: 'EUR', value: 'EUR', unit: '€', symbols: 'USD,GBP'},
  { label: 'GBP', value: 'GBP', unit: '£', symbols: 'USD,EUR'},
];

const Home = () => {
  const { wallet, updateWallet } = useWallet();

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GBP');
  const [withDraw, setWithDraw] = useState('');
  const [deposit, setDeposit] = useState('');
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({});
  const [error, setError] = useState(false);

  const fromUnit = useMemo(() => currencies.find((currency) => currency.value === fromCurrency).unit, [fromCurrency]);
  const toUnit = useMemo(() => currencies.find((currency) => currency.value === toCurrency).unit, [toCurrency]);

  useEffect(() => {
    setWithDraw('0');
    setDeposit('0');
    if (toCurrency !== fromCurrency) {
      const currentCurrency = currencies.find((currency) => currency.value === fromCurrency);
      setLoading(true);
      getExchangeRate(currentCurrency.label, currentCurrency.symbols)
        .then((res) => {
          setRates(res['data']);
          setLoading(false);
        })
        .catch(() => {
          setRates({ [fromCurrency]: 1 });
        });
    } else {
      setRates({ [fromCurrency]: 1 });
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (wallet) {
      if (withDraw > wallet[fromCurrency]) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [withDraw, fromCurrency, wallet]);

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value || 'USD');
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value || 'GBP');
  };

  const handleExchangeClick = () => {
    updateWallet(fromCurrency, toCurrency, +withDraw, +deposit);
    setWithDraw('');
    setDeposit('');
  };

  const handleFromValueChanged = (e) => {
    const value = e.target.value;
    setWithDraw(value);
    setDeposit(`${value * rates[toCurrency]}`);
  };

  const handleToValueChanged = (e) => {
    const value = e.target.value;
    setDeposit(value);
    setWithDraw(`${value / rates[toCurrency]}`);
  };

  return (
    <Root className={classes.root}>
      <Card className={classes.card}>
        <div className={classes.cardTop}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            data-testid="fromCurrency-select"
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
          >
            {
              currencies.map((currency, key) => (
                <MenuItem value={currency.value} key={key}>{currency.label}</MenuItem>
              ))
            }
          </Select>
          <div>
            <Typography>
              Balance:
              {wallet && wallet[fromCurrency].toFixed ? wallet[fromCurrency].toFixed(2) : 0}
              {fromUnit}
            </Typography>
          </div>
          <TextField
            id="standard-basic"
            data-testid="withdraw-field"
            variant="standard"
            value={withDraw}
            onChange={handleFromValueChanged}
            error={error}
            helperText={error && 'Exceeds balance'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span>-</span>
                </InputAdornment>
              )}
            }
            size="small"
          />
          <Chip
            label={loading ? 'Loading...' : `${fromUnit}1 = ${toUnit}${rates[toCurrency]}`}
            variant="outlined"
            className={classes.rate}
          />
        </div>
        <div className={classes.cardBottom}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            data-testid="toCurrency-select"
            value={toCurrency}
            onChange={handleToCurrencyChange}
          >
            {
              currencies.map((currency, key) => (
                <MenuItem value={currency.value} key={key}>{currency.label}</MenuItem>
              ))
            }
          </Select>
          <div>
            <Typography>
              Balance:
              {wallet && wallet[toCurrency].toFixed ? wallet[toCurrency].toFixed(2) : 0}
              {toUnit}
            </Typography>
          </div>
          <TextField
            id="standard-basic"
            data-testid="deposit-field"
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span>+</span>
                </InputAdornment>
              )}
            }
            size="small"
            value={deposit}
            onChange={handleToValueChanged}
          />
        </div>
      </Card>
      <Button
        disabled={fromCurrency === toCurrency || error || !rates[toCurrency]}
        onClick={handleExchangeClick}
        variant="contained"
        data-testid="exchange-button"
      >
        Exchange
      </Button>
    </Root>
  )
};

export default Home;
