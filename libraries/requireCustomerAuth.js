const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config/AuthConfig");
import auth from "../libraries/AuthLibrary";

// export const reqCutomerAuth = async (context, cb) =>{
    
//     const token = context.req.cookies['x-access-token'];
    
//     const verify_token = await jwt.verify(token, SECRET_KEY, (err, decoded) => {
//         if(!err){
//             return true;
//         }else{
//             return false;
//         }
//     });

//     if(verify_token !== true){
//         return {
//             redirect:{
//                 destination: '/customer/login',
//                 permanent: false,
//             }
//         }
//     }

//     return cb()
// }


// export const ifCutomer = async (context, cb) =>{
    
//     const customer = "customer";

//     if(customer !== "customer"){
//         return {
//             redirect:{
//                 destination: '/customer/login',
//                 permanent: false,
//             }
//         }
//     }

//     return cb()
// }

export const reqAuth = async (context) =>{
    const token = context.req.cookies['access-token'];
    // const verify_token = await jwt.verify(token, SECRET_KEY, (err, decoded) => {
    //     if(!err){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // });

    if(token !== ''){
        return false;
    }
    return true;
}

export const reqCutomerAuth = async (context) =>{
    const token = context.req.cookies['access-token'];
    const verify_token = await jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(!err){
            return true;
        }else{
            return false;
        }
    });

    if(verify_token !== true){
        return false;
    }
    return true;
}


export const ifCustomer = async (context) =>{
    const usertype = context.req.cookies['user-type'];
    if(usertype !== 'customer'){
        return false;
    }
    return true;
}

export const ifAdmin = async (context) =>{
    const usertype = context.req.cookies['user-type'];
    if(usertype !== 'admin'){
        return false;
    }
    return true;
}

//https://www.youtube.com/watch?v=VP-RCddbjrc
