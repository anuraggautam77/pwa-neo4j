const connection = require('../dbconnection');
const driver = connection().getInstance();
const queries = require('../cypherqueries/queries');
//const jsonData = require('./data');
//const citiesData = require('./citiesdata');
const request = require('request');
const async = require('async');
const prettyjson = require('prettyjson');

const isDebugLocal = false;


UsersModel = {
    createDeviceLocRelation: function () {
        // console.log(driver);
    },
    regsiterUser: function (objdata, callback) {

        obj = objdata.data;
        if (obj.type === 'withZip') {
            var query = `MERGE ( user:User{ _id :'${obj.deviceid}', lat:${obj.cur_lat}, lang:${obj.cur_lng} })  MERGE( zeo:Mastergeo {
 zip:${obj.zip}}) MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`;
            console.log(query);
            driver.cypher({'query': query}, function (err, results) {
                if (err)
                    throw err;
                console.log(results);
                callback(results);
            });


        } else {
            console.log("withoutzip");

            var query = `MERGE ( user:User{ _id :'${obj.deviceid}',lat:${obj.cur_lat},lang:${obj.cur_lng} })
                              MERGE( zeo:Mastergeo)  MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`;
            console.log(query);
            driver.cypher({'query': query}, function (err, results) {
                if (err)
                    throw err;
                console.log(results);
                callback(results);
            });
        }

    },
    getAllMruLocation: function (req, callback) {

        if (isDebugLocal) {
            // callback(citiesData);

        } else {
            console.log(queries.GET_ALL_MRUS);
            driver.cypher({query: queries.GET_ALL_MRUS}, function (err, results) {
                if (err)
                    throw err;
                callback(results);
            });
        }
    },
    citiesDetails: function (req, callback) {

        if (isDebugLocal) {
            // callback(citiesData);

        } else {

            var query = `match cities =(n:MasterCity)-[:IS_PRIMARY_CITY]-(:CityType) unwind nodes(cities) as city optional match (user:User)-[]-(zip:Mastergeo)-[]-(c:MasterCity) where ID(c)=ID(city) with count(distinct user) as primaryCount,city optional match (user:User)-[]-(zip:Mastergeo)-[]-(c:MasterCity)-[:IS_CITY_OF]-(p:MasterCity) where ID(p)=ID(city) with count(distinct user) as secondaryCount,primaryCount,city return city,secondaryCount+primaryCount as userCount order by userCount desc`;
            // query = 'match (c:MasterCity)-[:IS_PRIMARY_CITY]-(p:CityType) return c';
            console.log(query);
            driver.cypher({
                query: query
            }, function (err, results) {
                if (err)
                    throw err;
                callback(results);
            });
        }
    },
    getSecondLevelCities: function (citiid, callback) {

        if (!isDebugLocal) {
            //   var query = `Match (c:MasterCity) where ID(c)=${citiid} Match (c)-[:IS_CITY_OF]-(city:MasterCity) return city`;
            var query = `match(user:User)-[]-(zip:Mastergeo)-[]->(mc:MasterCity) where ID(mc)=${citiid} return mc.cityName as cityname, ID(mc) as cityid, mc.lat as latitude, mc.lang as longitude,count(distinct user) as userCount UNION match(user:User)-[]-(zip:Mastergeo)-[]-(c:MasterCity)-[:IS_CITY_OF]-(p:MasterCity) where ID(p)=${citiid} return c.cityName as cityname, ID(c) as cityid, c.lat as latitude, c.lang as longitude,count(distinct user) as userCount order by userCount desc`;
            console.log("Second>>>>>>>>>");
            console.log(query);
            console.log("Second>>>>>>>>>");


            driver.cypher({
                query: query
            }, function (err, results) {
                if (err)
                    throw err;
                callback(results);
            });

        } else {
            //isDebugLocal
        }


    },
    nearByLoc: function (req, callback) {

        var locflag = 'popularLocation';
        if (isDebugLocal) {
            // callback(jsonData);
        } else {

            if (req.locid === "nearByLocation") {
                locflag = 'nearbyLocation'
            }
            //'${req.todaydate}'
            var query = `match (user:User)-[]-(zip:Mastergeo)-[r]-(c:MasterCity) where ((ID(c)=${req.locid} and r.type='${locflag}') or (ID(c)=${req.locid} and r.type="primaryLocation")) and  distance(point({longitude:c.lang,latitude:c.lat}),point({longitude:zip.lang,latitude:zip.lat}))  < 159999 optional match (zip)-[mr:IS_AT|:IS_EXPECTED_AT]-(mru:MRU) where mr.date >= '${req.todaydate}' return mru.mru_id as mruid, type(mr) as relation,ID(c), c.cityName as cityname, zip.lat as latitude, zip.lang as longitude, zip.zip as zip, ID(c) as cityid, count(distinct user) as userCount order by userCount desc limit 100`;


            console.log("Location >>>>>>>>>");
            console.log(query);
            console.log("Location>>>>>>>>>");


            driver.cypher({
                query: query
            }, function (err, results) {
                if (err)
                    throw err;
                callback(results);

            });
        }

        // Match (user:User)-[:REGISTERED_MRU|:REGISTERED_PRO]-(zip:Mastergeo)-[:BELONGS_TO]-(city:MasterCity{cityName:"Indianapolis"}) return city.cityName, count(user) as userCount, zip.lat, zip.lang 

    },
    saveMruDetails: function (data, callback) {

        var query = `MATCH (zip:Mastergeo {zip:${data.zipcode}}) 
                    MERGE (mru:MRU {mru_id:'${data.mruID}'}) 
                    MERGE (zip) <- [:${data.relationTo} {date:'${data.startDate}'}] - (mru)`;
        console.log(query);

        driver.cypher({query: query}, (err, results) => {
            if (err)
                throw err;

            var innerQuery = `MATCH (user:User)-[r:IS_REGISTERED_MRU]-(:Mastergeo{zip:${data.zipcode} }) return user`;

            driver.cypher({query: innerQuery}, (err, userdetails) => {
                console.log(prettyjson.render(userdetails));
            });

            if (data.relationTo === "IS_AT" || data.relationTo === "IS_EXPECTED_AT") {
                var obj = {};
                if (data.relationTo === "IS_EXPECTED_AT") {
                    obj.infotext = `${data.mruID} is expected to placed at your registered Location ${data.zipcode} on  (${data.startDate})`;
                } else {
                    obj.infotext = ` ${data.mruID} is currently at your registered Location ${data.zipcode}  (${data.startDate})`;
                }
                obj.title = "MRU is nearby you";
                //    this.postToSubscriber(obj);
            }
            callback(results);
        });
    },
    postToSubscriber: function (obj, users, callback) {








        var token = 'ehZUOxw7zGg:APA91bHx6_NYfO63ezdwlGyj6EGl8A60jv3ekPs3L6ZaR1DdiPimZgmI5rdl0h96CX_ryN78gU3fSCJmfP5SwI6Zji2ovJrryVE6qYAT1Jly4syFCZ7lmnOSV5TJBLXVlJ15E0N5U7ZM';
        request({
            url: 'https://fcm.googleapis.com/fcm/send',
            method: 'POST',
            headers: {
                'Content-Type': ' application/json',
                'Authorization': 'key=AIzaSyDwbkJd-lz_OLS8Vb62wU3kv55wV500MA8'
            },
            body: JSON.stringify(
                    {
                        "notification": {
                            "title": obj.title,
                            "body": obj.infotext,
                            "icon": "https://donotifyme.herokuapp.com/img/icons/64.png",
                            "click_action": "https://donotifyme.herokuapp.com",
                            // "image": 'https://donotifyme.herokuapp.com/img/promoimages/' + message.selectedimg,
                            //  "showbanner": message.pbanner
                        },
                        "to": token
                    }
            )
        }, function (error, response, body) {
            if (error) {
                console.error(error, response, body);
            } else {
                console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
            }
        })
    }



}

module.exports = UsersModel;


