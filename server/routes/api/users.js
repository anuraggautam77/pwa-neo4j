const UsersModel = require('../../models/User');

const request = require('request');
const path = require('path');
const fs = require('fs');
 
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

const Cryptr = require('cryptr');
let cryptr = new Cryptr('user_id_incrption_decription');

var settings = require('../../config/settings');








const SERVICE_CONST = {
    REGISTER_USER: 'registeruser',
    GET_MRU: "getallmrus",
    NEAR_BY_CURR_LOC: 'nearbyloc',
    ALL_CITIES_DETAILS: 'allcitiesdetails',
    ALL_PRIMARY_CITIES: 'allprimarycities',
    ALL_ZIP_CODES: 'allzipcodes',
    GET_SECOND_LEVEL_CITIES: 'getsecondlevelcities',
    PLACE_MRU_DETAILS: "placemru",
    GET_CLUSTER_DETAIL: "getcluster",
    RE_CLUSTER: "recluster",
    ADMIN_LOGIN: 'adminlogin',
    ADMIN_REGISTER:'register'

};

module.exports = (apiRoutes) => {
    
    
    function tokenVerify(req, res) {

        let token = req.headers['x-access-token'], userid = req.headers['id'];
        obj = {};
        if (token) {
            jwt.verify(token, settings.secret, function (err, decoded) {
                if (decoded === undefined) {
                    obj.status = 403;
                    obj.message = 'No token provided>>';
                } else if (decoded) {//=== cryptr.decrypt(userid)) {
                    // console.log(decoded);
                    if (bcrypt.compareSync(decoded.username, userid)) {
                        //   console.log("valid");
                        obj.status = 200;
                        obj.message = 'valid token>>>>>';
                    }

                } else {
                    obj.status = 403;
                    obj.message = 'Invalid token>>>>>';
                }

            });
        } else {
            obj.status = 403;
            obj.message = 'Invalid token';
        }

        return obj;
    }
    
    apiRoutes.post(`/${SERVICE_CONST.ADMIN_REGISTER}`, function (req, res) {
        
        
        if (!req.body.username || !req.body.password) {
            res.json({success: false, msg: 'Please pass username and password.'});
        } else {

            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    return (err);
                }
                bcrypt.hash(req.body.password, salt, null, function (err, hash) {
                    req.body.password = hash;
                    //  console.log(hash)
                    UsersModel.adminRegis(req.body, function (result) {
                        res.json({data: result});
                    });
                });
            });

        }
    });
    
    
    
    apiRoutes.post('/authvalidate', function (req, res) {
        let objCheck = tokenVerify(req, res);
        res.status(objCheck.status).json({status: objCheck.status, message: objCheck.message});

    });

    
    

    apiRoutes.post(`/${SERVICE_CONST.REGISTER_USER}`, (req, res) => {
        UsersModel.regsiterUser(req.body, (result) => {
            res.json({status: "success"});
        });
    });

    apiRoutes.get(`/${SERVICE_CONST.GET_MRU}`, (req, res) => {
        UsersModel.getAllMruLocation(req, (result) => {
            res.json({status: "success", mapdata: result});
        });
    });

    /**
     *  Get All Primary Cities 
     */

    apiRoutes.get(`/${SERVICE_CONST.ALL_CITIES_DETAILS}`, (req, res) => {

        var getCitiesData = new Promise(function (resolve, reject) {
            UsersModel.citiesDetails(req.body, (citydata) => {
                var finalArray = [];
                citydata.forEach((val, i) => {
                    console.log(val.userCount);
                    var objPerCity = {
                        lat: val.city.properties.lat,
                        lng: val.city.properties.lang,
                        cityID: val.city._id,
                        cityname: val.city.properties.cityName,
                        userCount: val.userCount,
                        show: true,
                        type: "pcity"
                    };

                    finalArray.push(objPerCity);
                });
                resolve(finalArray);
            });
        });

        var getPrimaryCount = new Promise(function (resolve, reject) {
            UsersModel.registerUserAtPrimary(req.body, (count) => {
                resolve(count);
            });
        });

        Promise.all([getCitiesData, getPrimaryCount]).then(function (values) {
            res.json({status: "success", mapdata: values[0], usercount: values[1][0].mruCount});

        });

    });



    apiRoutes.get(`/${SERVICE_CONST.ALL_PRIMARY_CITIES}`, (req, res) => {

        var getCitiesData = new Promise(function (resolve, reject) {
            UsersModel.allprimaryCities(req.body, (citydata) => {
                var finalArray = [];
                citydata.forEach((val, i) => {
                    console.log(val.userCount);
                    var objPerCity = {
                        lat: val.city.properties.lat,
                        lng: val.city.properties.lang,
                        cityID: val.city._id,
                        cityname: val.city.properties.cityName,
                        userCount: val.userCount,
                        show: true,
                        type: "pcity"
                    };

                    finalArray.push(objPerCity);
                });
                resolve(finalArray);
            });
        });

        var getPrimaryCount = new Promise(function (resolve, reject) {
            UsersModel.registerUserAtPrimary(req.body, (count) => {
                resolve(count);
            });
        });

        Promise.all([getCitiesData, getPrimaryCount]).then(function (values) {
            res.json({status: "success", mapdata: values[0], usercount: values[1][0].mruCount});

        });

    });







    apiRoutes.post(`/${SERVICE_CONST.GET_SECOND_LEVEL_CITIES}`, (req, res) => {
        var cityID = req.body.cityID;
        // var latlng = {lat: split[0], lng: split[1],radius:req.body.radius};

        var getsecondaryData = new Promise(function (resolve, reject) {
            UsersModel.getSecondLevelCities(parseInt(cityID), (result) => {
                var finalArray = [];
                result.forEach((val, i) => {
                    var objPerCity = {
                        lat: val.latitude,
                        lng: val.longitude,
                        cityID: val.cityid,
                        cityname: val.cityname,
                        userCount: val.userCount,
                        type: "scity",
                        show: true
                    };
                    finalArray.push(objPerCity);
                });
                resolve(finalArray);

            });
        });

        var userCount = new Promise(function (resolve, reject) {
            UsersModel.registerUserAtSecondary(parseInt(cityID), (count) => {
                resolve(count);
            });
        });

        Promise.all([getsecondaryData, userCount]).then(function (values) {
            res.json({status: "success", mapdata: values[0], usercount: values[1][0].mruCount});

        });

    });


    /**
     * 
     */

    apiRoutes.post(`/${SERVICE_CONST.PLACE_MRU_DETAILS}`, (req, res) => {

        UsersModel.saveMruDetails(req.body.data, (result) => {
            res.json({status: "success", mapdata: result});
        });
    });



    /**
     *  Get All nearby Zips based on Citi ID
     */

    apiRoutes.post(`/${SERVICE_CONST.NEAR_BY_CURR_LOC}`, (req, res) => {

        var nearbyData = new Promise(function (resolve, reject) {
            UsersModel.nearByLoc(req.body, (jsondata) => {
                resolve(jsondata);
            });
        });

        var userCount = new Promise(function (resolve, reject) {
            UsersModel.registerUserAtThirdLevel(req.body, (count) => {
                resolve(count);
            });
        });

        Promise.all([nearbyData, userCount]).then(function (values) {
            var arrCluster = [];
            values[0].map((obj) => {
                obj = {type: "Feature", zipdetail: obj, properties: {}, geometry: {coordinates: [obj.longitude, obj.latitude], type: "Point"}};
                arrCluster.push(obj);
            });
            res.json({status: "success", mapdata: values[0], clusterData: arrCluster, usercount: values[1][0].mruCount});
        });

    });



    apiRoutes.post(`/${SERVICE_CONST.ALL_ZIP_CODES}`, (req, res) => {

        var nearbyData = new Promise(function (resolve, reject) {
            UsersModel.allzipCode(req.body, (jsondata) => {
                resolve(jsondata);
            });
        });

        var userCount = new Promise(function (resolve, reject) {
            UsersModel.registerUserAtThirdLevel(req.body, (count) => {
                resolve(count);
            });
        });

        Promise.all([nearbyData, userCount]).then(function (values) {
            var arrCluster = [];
            values[0].map((obj) => {
                obj = {type: "Feature", zipdetail: obj, properties: {}, geometry: {coordinates: [obj.longitude, obj.latitude], type: "Point"}};
                arrCluster.push(obj);
            });
            res.json({status: "success", mapdata: values[0], clusterData: arrCluster, usercount: values[1][0].mruCount});
        });

    });




    apiRoutes.get(`/${SERVICE_CONST.GET_CLUSTER_DETAIL}/:cityid/:locfilter/:distance/:nclus`, (req, res) => {

        var param = req.params;
        param.locid = param.cityid;

        var nearbyData = new Promise(function (resolve, reject) {
            request({url: `https://django-pwa.herokuapp.com//pwa/api/clustering/kmeans/getKMeansRandomCentroidClusters/?cityid=${param.cityid}&locfilter=${param.locfilter}&distance=${param.distance}&nclust=${param.nclus}`,
                method: 'GET',
                headers: {
                    'Content-Type': ' application/json',
                }

            }, function (error, response, body) {
                resolve(response);
            });
        });

        var userCount = new Promise(function (resolve, reject) {
            UsersModel.registerUserAtThirdLevel(param, (count) => {
                resolve(count);
            });
        });

        Promise.all([nearbyData, userCount]).then(function (values) {

            res.json({status: "success", mapdata: values[0], usercount: values[1][0].mruCount});
        });
    })




    apiRoutes.post(`/${SERVICE_CONST.RE_CLUSTER}`, (req, res) => {

        var param = req.body 
            param.locid = param.cityid

        var nearbyData = new Promise(function (resolve, reject) {
            request({url: `https://django-pwa.herokuapp.com/pwa/api/clustering/kmeans/getKMeansCustomCentroidClusters/`,
                method: 'POST',
                headers: {
                    'Content-Type': ' application/json'
                },
                body: JSON.stringify(req.body)

            }, function (error, response, body) {
                resolve(response);
            });
        });

        var userCount = new Promise(function (resolve, reject) {
            UsersModel.registerUserAtThirdLevel(param, (count) => {
                resolve(count);
            });
        });

        Promise.all([nearbyData, userCount]).then(function (values) {

            res.json({status: "success", mapdata: values[0], usercount: values[1][0].mruCount});
        });
    })


apiRoutes.post(`/${SERVICE_CONST.ADMIN_LOGIN}`, function (req, res) {

        UsersModel.adminLogin(req.body, function (result) {
            if (result.length > 0) {
                bcrypt.compare(req.body.password, result[0].password, function (err, isMatch) {
                    if (err) {
                        res.status(401).send({success: false, msg: err});
                    }
                    if (isMatch) {

                        var token = jwt.sign({username: result[0].username}, settings.secret);

                        bcrypt.genSalt(10, function (err, salt) {
                            if (err) {
                                return (err);
                            }
                            bcrypt.hash(result[0].username, salt, null, function (err, hash) {
                                res.json({success: true, token: token, userid: hash});
                            });
                        });

                    } else {

                        res.status(401).send({success: false, msg: 'Incorrect Password.'});
                    }
                });

            } else {

                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        });
    });




 

};
