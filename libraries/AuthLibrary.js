import Cookies from "cookies-js";
import jwtDecode from "jwt-decode";
import {JWT_TOKEN_EXPIRATION} from "../config/AuthConfig";
import _ from 'lodash'
import {store} from '../store'
import axios from "axios";
//import {isJsonString} from "../helpers/AppHelper";


/**
 * Auth Service
 */
class AuthLibrary {
    constructor() {
        this.user = store.getState().user.user || {};
        //console.log(store.getState());
        //console.log(this.user);
    }

    /**
     *
     * @param token
     */
    // generate = async (token, type) => {
    //     try {
            
    //         // Cookies.set("x-access-token", token, {
    //         //     expires: JWT_TOKEN_EXPIRATION
    //         // });
    //         Cookies.set("access-token", token, {
    //             expires: JWT_TOKEN_EXPIRATION
    //         });
    //         Cookies.set("user-type", type);

    //         let payload = jwtDecode(token);
            
    //         let customerObj = {...payload, token, type};

    //         let response = await axios.get("/user/" + customerObj.id, {
    //             headers: {
    //                 // 'x-access-token': customerObj.token
    //                 'access-token': customerObj.token
    //             }
    //         });
            
    //         return {...customerObj, ...response.data} || null;
    //     } catch (err) {
    //         throw Error("Auth generation is failed.");
    //     }
    // };

    generate = async (token, token_type, type, id) => {
        try {
            if(typeof window !== 'undefined'){
                Cookies.set("access-token", token_type + ' ' + token, {
                    expires: JWT_TOKEN_EXPIRATION
                });
                Cookies.set("user-type", type);
            }
            
            let customerObj = {token, type};
            let response = await axios.get("/user/" + id, {
                headers: {
                    Authorization: token_type + ' ' + token,
                }
            });
            return {...customerObj, ...response.data} || null;
            //return {...customerObj};
        } catch (err) {
            throw Error("Auth generation is failed.");
        }
    };

    /**
     *
     * @returns {Promise<T | null>}
     */
    // reGenerate = async () => {
    //     try {
    //         let response = await axios.get("/api/users/profile/" + this.id(), {
    //             headers: {
    //                 'x-access-token': this.token()
    //             }
    //         });
    //         return {...response.data} || null;
    //     } catch (err) {
    //         throw Error("Auth generation is failed.");
    //     }
    // };

    /**
     *
     * @param callback
     */
    login = (callback) => {
        // redirection...
        if (sessionStorage.getItem("redirectUrl")) {
            return window.location.href = sessionStorage.getItem("redirectUrl");
        }

        if (typeof callback === "function") {
            callback();
        }
    };

    /**
     *
     * @param props
     * @returns {*}
     */
    redirect = (props) => {
        sessionStorage.setItem('redirectUrl', window.location.href);
        return props.history.push('/login');
    };

    /**
     *
     * @param callback
     * @return {*}
     */
    logout = async (callback) => {
        localStorage.clear();
        sessionStorage.clear();
        Cookies.expire("access-token");
        Cookies.expire("user-type");
        this.user = {};

        if (typeof callback === "function") {
            callback();
        }
    };

    /**
     *
     * @return {string | *}
     */
    token = () => {
        return this.user.token || null;
    };

    /**
     *
     * @return {*}
     */
    status = () => {
        return Boolean(this.id());
    };

    /**
     *
     * @return {*}
     */
    // roleName = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return this.user.Role.name || null;
    // };

    /**
     *
     * @return {*}
     */
    // roleSlug = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return this.user.Role.slug || null;
    // };

    /**
     *
     * @returns {{}|any}
     */
    // hasOverriddenPermissions = () => {
    //     if(!_.isEmpty(this.user.permissions)){
    //         return this.user.permissions;
    //     }else{
    //        return {}
    //     }
    //     // if (!_.isEmpty(this.user.permissions) && isJsonString(this.user.permissions)) {
    //     //     return JSON.parse(this.user.permissions);
    //     // } else {
    //     //     return {};
    //     // }
    // };

    /**
     *
     * @returns {null|*}
     */
    // permissions = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return !_.isEmpty(this.hasOverriddenPermissions()) ? this.hasOverriddenPermissions() : this.user.Role.permissions;
    // };

    /**
     *
     * @param module
     * @param method
     * @returns {boolean|*}
     */
    // hasPermission = (module, method) => {
    //     if (this.permissions() && this.permissions()[module] && this.permissions()[module][method]) {
    //         return this.permissions()[module][method];
    //     } else {
    //         return false;
    //     }
    // };

    /**
     *
     * @returns {string|null}
     */
    fullName = () => {
        const fn = this.user.data.firstName? this.user.data.firstName:"";
        const ln = this.user.data.lastName? this.user.data.lastName:"";
        return (fn + ' ' + ln) || "";
    };

    /**
     *
     * @returns {*|null}
     */
    id = () => {
        return this.user.data.id || null;
    };

    /**
     *
     * @returns {null}
     */
    // partnerId = () => {
    //     if (_.isEmpty(this.user.PartnerRelationships)) return null;
    //     if (_.isEmpty(this.user.PartnerRelationships[0].Partner)) return null;
    //     return !_.isEmpty(this.user.PartnerRelationships) ? this.user.PartnerRelationships[0].partnerId : null;
    // };

    /**
     *
     * @returns {null|any}
     */
    // partnerName = () => {
    //     if (_.isEmpty(this.user.PartnerRelationships)) return null;
    //     if (_.isEmpty(this.user.PartnerRelationships[0].Partner)) return null;
    //     return (!_.isEmpty(this.user.PartnerRelationships) && !_.isEmpty(this.user.PartnerRelationships[0].Partner)) ? this.user.PartnerRelationships[0].Partner.name : null;
    // };

    /**
     *
     * @returns {boolean|null|null}
     */
    // isAdmin = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return (this.user.Role.name === 'Administrator') || null;
    // };

    /**
     *
     * @returns {boolean|null|null}
     */
    // isPartner = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return (this.user.Role.name === 'BI. Partner') || null;
    // };

    /**
     *
     * @returns {boolean|null|null}
     */
    // isStaff = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return (this.user.Role.name === 'BI. Staff') || null;
    // };

    /**
     *
     * @returns {boolean|null|null}
     */
    // isAssistant = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return (this.user.Role.name === 'BIP. Assistant') || null;
    // };

    /**
     *
     * @returns {boolean|null|null}
     */
    // isIntern = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return (this.user.Role.name === 'BIP. Intern') || null;
    // };

    /**
     *
     * @returns {boolean|null|null}
     */
    // isInstructor = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return (this.user.Role.name === 'Instructor') || null;
    // };

    /**
     *
     * @returns {boolean|null|null}
     */
    // isStudent = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     return (this.user.Role.name === 'Student') || null;
    // };

    /**
     *
     * @returns {null|boolean}
     */
    // isOtherRole = () => {
    //     if (_.isEmpty(this.user.Role)) return null;
    //     let roles = ["Administrator", "BI. Staff", "BI. Partner", "BIP. Assistant", "BIP. Intern", "Instructor", "Student"];
    //     return !roles.includes(this.user.Role.name);
    // };

    /**
     * +
     * @returns {boolean|null}
     */
    // profileImage = () => {
    //     return this.user.fileName || null;
    // };

    /**
     *
     * @returns {(function())|null}
     */
    // isFirstLogin = () => {
    //     return this.user.isFirstLogin || null;
    // };
    type = () => {
        return this.user.type || null;
    };
}

export default new AuthLibrary();
