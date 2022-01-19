import React, { Component } from "react";
import { Paper, Button , CircularProgress, ListItemButton, Typography, Grid, Select, MenuItem, FormControl, FormHelperText, List, ListItem, ListItemText, Avatar, RouterLink, ListItemAvatar} from "@mui/material";
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import getFlags from './getFlags'

export default class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: new Array({id:0,}),
      currency: 0,
      type: 1,
      currencies_dict: {"0":"ANY"},
      loading: true,
    };
    this.getCurrencyDict()
    this.getOrderDetails(this.state.type, this.state.currency)
    this.state.currencyCode = this.getCurrencyCode(this.state.currency)
  }

  getOrderDetails(type, currency) {
    fetch('/api/book' + '?currency=' + currency + "&type=" + type)
      .then((response) => response.json())
      .then((data) => console.log(data) &
      this.setState({
        orders: data,
        not_found: data.not_found,
        loading: false,
      }));
  }

  handleRowClick=(e)=>{
    console.log(e)
    this.props.history.push('/order/' + e);
  }

  handleTypeChange=(e)=>{
    this.setState({
        type: e.target.value,
        loading: true,     
    });
    this.getOrderDetails(e.target.value,this.state.currency);
  }
  handleCurrencyChange=(e)=>{
    this.setState({
        currency: e.target.value,
        currencyCode: this.getCurrencyCode(e.target.value),
        loading: true,
    })
    this.getOrderDetails(this.state.type, e.target.value);
  }
  
  getCurrencyDict() {
    fetch('/static/assets/currencies.json')
      .then((response) => response.json())
      .then((data) => 
      this.setState({
        currencies_dict: data
      }));
  }

  getCurrencyCode(val){
    return this.state.currencies_dict[val.toString()]
  }

  // pretty numbers
  pn(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  bookListTable=()=>{
    return (
      <div style={{ height: 475, width: '100%' }}>
      <DataGrid
        rows={
            this.state.orders.map((order) =>
            ({id: order.id,
              avatar: window.location.origin +'/static/assets/avatars/' + order.maker_nick + '.png',
              robosat: order.maker_nick, 
              type: order.type ? "Sell": "Buy",
              amount: parseFloat(parseFloat(order.amount).toFixed(4)),
              currency: this.getCurrencyCode(order.currency),
              payment_method: order.payment_method,
              price: order.price,
              premium: order.premium,
            })
          )}

        columns={[
          // { field: 'id', headerName: 'ID', width: 40 },
          { field: 'robosat', headerName: 'RoboSat', width: 240, 
            renderCell: (params) => {return (
              <ListItemButton style={{ cursor: "pointer" }}>
                <ListItemAvatar>
                  <Avatar alt={params.row.robosat} src={params.row.avatar} />
                </ListItemAvatar>
                <ListItemText primary={params.row.robosat}/>
              </ListItemButton>
            );
          } },
          { field: 'type', headerName: 'Type', width: 60 },
          { field: 'amount', headerName: 'Amount', type: 'number', width: 80 },
          { field: 'currency', headerName: 'Currency', width: 100, 
          renderCell: (params) => {return (
            <div style={{ cursor: "pointer" }}>{params.row.currency + " " + getFlags(params.row.currency)}</div>
          )} },
          { field: 'payment_method', headerName: 'Payment Method', width: 180 },
          { field: 'price', headerName: 'Price', type: 'number', width: 140,
          renderCell: (params) => {return (
            <div style={{ cursor: "pointer" }}>{this.pn(params.row.price) + " " +params.row.currency+ "/BTC" }</div>
          )} },
          { field: 'premium', headerName: 'Premium', type: 'number', width: 100,
            renderCell: (params) => {return (
              <div style={{ cursor: "pointer" }}>{parseFloat(parseFloat(params.row.premium).toFixed(4))+"%" }</div>
            )} },
          ]}

        pageSize={7}
        onRowClick={(params) => this.handleRowClick(params.row.id)} // Whole row is clickable, but the mouse only looks clickly in some places.
        rowsPerPageOptions={[7]}
      />
    </div>
    );
  }

  render() {
      return (
        <Grid className='orderBook' container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography component="h2" variant="h2">
              Order Book
            </Typography>
          </Grid>

          <Grid item xs={6} align="right">
            <FormControl >
              <FormHelperText>
                I want to 
              </FormHelperText>
              <Select
                  label="Select Order Type"
                  required="true" 
                  value={this.state.type} 
                  inputProps={{
                      style: {textAlign:"center"}
                  }}
                  onChange={this.handleTypeChange}
              >   <MenuItem value={2}>ANY</MenuItem>
                  <MenuItem value={1}>BUY</MenuItem>
                  <MenuItem value={0}>SELL</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} align="left">
            <FormControl >
              <FormHelperText>
                And pay with 
              </FormHelperText>
              <Select
                  label="Select Payment Currency"
                  required="true" 
                  value={this.state.currency} 
                  inputProps={{
                      style: {textAlign:"center"}
                  }}
                  onChange={this.handleCurrencyChange}
              >     <MenuItem value={0}>🌍 ANY</MenuItem>
                    {
                      Object.entries(this.state.currencies_dict)
                      .map( ([key, value]) => <MenuItem value={parseInt(key)}>{getFlags(value) + " " + value}</MenuItem> )
                    }
              </Select>
            </FormControl>
          </Grid>
        { this.state.not_found ? "" :
          <Grid item xs={12} align="center">
            <Typography component="h5" variant="h5">
              You are {this.state.type == 0 ? <b> selling </b> : (this.state.type == 1 ? <b> buying </b> :" looking at all ")} BTC for {this.state.currencyCode}
            </Typography>
          </Grid>
          }
          {/* If loading, show circular progressbar */}
          {this.state.loading ?
          <Grid item xs={12} align="center">
            <CircularProgress />
          </Grid> : ""}

        { this.state.not_found ?
          (<Grid item xs={12} align="center">
            <Grid item xs={12} align="center">
              <Typography component="h5" variant="h5">
                No orders found to {this.state.type == 0 ? ' sell ' :' buy ' } BTC for {this.state.currencyCode}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color='primary' to='/make/' component={Link}>Make Order</Button>
            </Grid>
              <Typography component="body1" variant="body1">
                Be the first one to create an order
              </Typography>
          </Grid>)
          : 
          <Grid item xs={12} align="center">
            <Paper elevation={0} style={{width: 910, maxHeight: 500, overflow: 'auto'}}>

                {this.state.loading ? null : this.bookListTable()}

            </Paper>
           </Grid>
          }
          <Grid item xs={12} align="center">
              <Button color="secondary" variant="contained" to="/" component={Link}>
                  Back
              </Button>
          </Grid>
        </Grid>
    );
  };
}