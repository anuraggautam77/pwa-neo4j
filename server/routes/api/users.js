const UsersModel = require('../../models/User');

const request = require('request');
//const clusterMaker = require('clusters');
const path = require('path');
//const promoimgages = path.resolve("dist/img/promoimages");
const fs = require('fs');

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
    RE_CLUSTER: "recluster"

};

module.exports = (apiRoutes) => {

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

        request({url: `https://django-pwa.herokuapp.com//pwa/api/clustering/kmeans/getKMeansRandomCentroidClusters/?cityid=${param.cityid}&locfilter=${param.locfilter}&distance=${param.distance}&nclust=${param.nclus}`,
            method: 'GET',
            headers: {
                'Content-Type': ' application/json',
            }

        }, function (error, response, body) {
            //  res.json({data: JSON.parse(json.data.body.data)});
            res.json(response);

        });




    })



    apiRoutes.post(`/${SERVICE_CONST.RE_CLUSTER}`, (req, res) => {
        request({url: `https://django-pwa.herokuapp.com/pwa/api/clustering/kmeans/getKMeansCustomCentroidClusters/`,
            method: 'POST',
            headers: {
                'Content-Type': ' application/json'
            },
            body: JSON.stringify(req.body)

        }, function (error, response, body) {
            res.json(response);
        });
    })

};
