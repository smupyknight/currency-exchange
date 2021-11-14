import React from 'react'
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'Header';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(MuiAppBar)(({ theme }) => ({
  [`&.${classes.root}`]: {
    height: '64px !important',
    background: 'rgba(36, 122, 255, 0.2) !important',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    paddingRight: '0 !important',
    '& .MuiToolbar-root': {
      minHeight: '64px !important',
      padding: '0.5rem 1rem',
    }
  },
}));

const Header = () => {
  return (
    <Root className={classes.root} position="fixed">
      <Toolbar>
        <Typography variant="h4" component="h4">Currency Exchange</Typography>
      </Toolbar>
    </Root>
  );
};

export default Header;
