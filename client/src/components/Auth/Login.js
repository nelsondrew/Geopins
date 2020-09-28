import React , {useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import Context from '../../context';
import { dark } from "@material-ui/core/styles/createPalette";
import Typography from "@material-ui/core/Typography";
import { ME_QUERY} from '../../graphql/queries';
import {BASE_URL} from '../../client';


const Login = ({ classes }) => {
  const {dispatch} = useContext(Context);

  const onSuccess =async  googleUser => {
    try{
      const idToken= googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL,{
        headers : { authorization : idToken}
      })
      const {you }=await client.request(ME_QUERY);
      //console.log({you});
     
      dispatch({type : "LOGIN_USER",payload : you});
      dispatch({type : "IS_LOGGED_IN" , payload :googleUser.isSignedIn()});
    } catch (err) {
      onFailure(err);
    }
  
  }

  const onFailure = err => {
    console.error("Error Logging in" ,err);
    dispatch({type : "IS_LOGGED_IN" , payload : false});
  }  

  return( <div className ={classes.root}> 
      <Typography
      component="h1"
      variant="h3"
      gutterBottom
      noWrap
      style ={{color: "rgb(66 ,133 ,244)"}}
      >
        WELCOME!
      </Typography>
       <GoogleLogin clientId="1724199313-vt09ukqh2i1s263ir4p94rcobqa84gnn.apps.googleusercontent.com"
       onSuccess={onSuccess} 
       onFailure={onFailure} 
       isSignedIn={true} 
       buttonText="Login with Google"
       theme="dark"  /> </div>)
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
