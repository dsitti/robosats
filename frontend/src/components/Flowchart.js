import { Grid, Button , Typography} from '@mui/material';
import React, { Component, View} from 'react';


class Flowchart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalSteps: 5,
      currentStep: 2,

  }
  }




  render() {
    return (
      <Grid container direction="row" justifyContent={"space-between"} textAlign={"center"} >
        {Array.from(Array(this.state.totalSteps)).map((_, index) => (
          index<=this.state.currentStep ?
            <Grid >
              <Typography color="white" variant="subtitle1" align="center">
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', backgroundColor:'blue', width:25, height:25, borderRadius:12}}>
                  {index}
                </div>
              </Typography>
            </Grid>
          :
            <Grid >
              <Typography color="white" variant="subtitle1" align="center">
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', backgroundColor:'grey', width:25, height:25, borderRadius:12}}>
                  {index}
                </div>
              </Typography>
            </Grid>
        ))}
      </Grid>
    )
  };
}

export default Flowchart;