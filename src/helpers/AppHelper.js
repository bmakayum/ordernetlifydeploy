const { API_URL } = require('../../config/AppConfig');
const { toast } = require('react-toastify') ;
const _ = require("lodash");
const axios = require("axios");
const Cookies = require("cookies-js");

exports.vandorList = [{
    value: '1',
    label: 'In-House',
}, {
    value: '2',
    label: 'Vandor',
}];

/**
 * Get vandor object by id
 *
 * @param id
 * @returns {any}
 */
exports.getVandorById = (id) => {
    let vandorList = this.vandorList.filter(item => item.value === id.toString());
    return vandorList.length > 0 ? vandorList[0] : {};
}

exports.updateOrderTrack = (order_id, track) => {
    let formdata = new FormData();
    formdata.append('track_id', parseInt(track));
    axios
      .post(API_URL+"/order/" + order_id, formdata, {
        headers: {
          Authorization: Cookies.get('access-token'),
          'content-type': 'multipart/form-data'
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        if (response.data) {
            //toast.success(response.data.msg);
            return response.data.msg;
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  exports.reloadPage = () => {
    window.location.reload();
};