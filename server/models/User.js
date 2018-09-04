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

            var zipPresent = `MATCH (n:Mastergeo{zip:${obj.zip}}) RETURN n`;
            driver.cypher({'query': zipPresent}, (err, zipcount) => {
                var query = `MERGE ( user:User{ _id :'${obj.deviceid}', lat:${obj.cur_lat}, lang:${obj.cur_lng} })  MERGE( 
 zeo:Mastergeo {zip:${obj.zip},lat:${obj.zip_lat},lang:${obj.zip_lng}}) MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`;
                console.log(">>>>>zip present or not>>>>>>>");
                console.log(prettyjson.render(zipcount));
                if (zipcount.length > 0) {
                    query = `MERGE ( user:User{ _id :'${obj.deviceid}', lat:${obj.cur_lat}, lang:${obj.cur_lng} })  MERGE( zeo:Mastergeo {
 zip:${obj.zip}}) MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`;
                }

                driver.cypher({'query': query}, (err, results) => {
                    if (err)
                        throw err;
                    console.log("<<<<<<<<<<<<<<>>>>>>>>>>>>");
                    console.log(prettyjson.render(results));
                    callback(results);
                    if (zipcount.length === 0) {
                        this.mapLocationtoCity(obj.zip);
                    }
                });
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

            if (req.criteria === "nearByLocation") {
                locflag = 'nearbyLocation';
            }
            //'${req.todaydate}'

           var query = `match (user:User)-[]-(zip:Mastergeo)-[r]-(c:MasterCity) where (ID(c)=${req.locid} and r.type='${locflag}') or (ID(c)=${req.locid} and r.type="primaryLocation") optional match (zip)-[mr:IS_AT|:IS_EXPECTED_AT]-(mru:MRU)  where mr.date > "2018-08-30" and not mr.status='completed' return mru.mru_id as mruid, type(mr) as relation,mr.date,ID(c), c.cityName as cityname,zip.locationName as locName,  zip.lat as latitude, zip.lang as longitude, zip.zip as zip, ID(c) as cityid, count(distinct user) as userCount order by userCount desc limit 100`;
            //  var query = `match (user:User)-[]-(zip:Mastergeo)-[r]-(c:MasterCity) where ((ID(c)=${req.locid} and r.type='${locflag}') or (ID(c)=${req.locid} and r.type="primaryLocation")) and  distance(point({longitude:c.lang,latitude:c.lat}),point({longitude:zip.lang,latitude:zip.lat}))  < 159999 optional match (zip)-[mr:IS_AT|:IS_EXPECTED_AT]-(mru:MRU) where mr.date >= '${req.todaydate}' return mru.mru_id as mruid, type(mr) as relation,ID(c), c.cityName as cityname,zip.locationName as locName, zip.lat as latitude, zip.lang as longitude, zip.zip as zip, ID(c) as cityid, count(distinct user) as userCount order by userCount desc limit 100`;


            console.log("Location >>>>>>>>>");
            console.log(query);
            console.log("Location>>>>>>>>>");


            driver.cypher({
                query: query
            }, function (err, results) {
                if (err)
                    throw err;

                results.map((obj) => {
                    obj.show = true;
                });


                callback(results);

            });
        }

        // Match (user:User)-[:REGISTERED_MRU|:REGISTERED_PRO]-(zip:Mastergeo)-[:BELONGS_TO]-(city:MasterCity{cityName:"Indianapolis"}) return city.cityName, count(user) as userCount, zip.lat, zip.lang 

    },
    saveMruDetails: function (data, callback) {

        var query = `MATCH (zip:Mastergeo {zip:${data.zipcode}}) 
                    MERGE (mru:MRU {mru_id:'${data.mruID}'}) 
                    MERGE (zip) <- [:${data.relationTo} {date:'${data.startDate}'}] - (mru)`;


        //  MERGE (mru:MRU {mru_id:'mru_22544'})-[mr:IS_AT]-(z:Mastergeo{zip:22544}) set mr.status= CASE WHEN mr.status='completed' THEN  'progress' WHEN mr.status='progress' THEN  'completed' ELSE 'completed' end


        driver.cypher({query: query}, (err, results) => {
            if (err)
                throw err;


            if (data.relationTo === "IS_AT" || data.relationTo === "IS_EXPECTED_AT") {
                var obj = {};
                if (data.relationTo === "IS_EXPECTED_AT") {
                    obj.infotext = `${data.mruID} is expected to placed at your registered Location ${data.zipcode} on  (${data.startDate})`;
                } else {
                    obj.infotext = `${data.mruID} is currently at your registered Location ${data.zipcode}  (${data.startDate})`;
                }
                obj.title = "MRU is nearby you";
                this.postToSubscriber(obj, data, callback);
            } else {
                callback(results);
            }

        });
    },
    postToSubscriber: function (obj, data, callback) {
        var tokencount = 0, count = 0;

        var query = `match (user:User)-[:IS_REGISTERED_MRU]->(zip:Mastergeo{zip:${data.zipcode}}) return user`;
        driver.cypher({query: query}, (err, userdetails) => {
            async.each(userdetails, (tokendetail) => {
                console.log(JSON.stringify(tokendetail));

                if (tokendetail.hasOwnProperty('user')) {
                    if (tokendetail.user.hasOwnProperty('properties')) {
                        if (tokendetail.user.properties.hasOwnProperty('_id')) {
                            var token = tokendetail.user.properties._id;
                            if (token !== null) {
                                tokencount++;
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
                                                    "icon": "https://donotifyme.herokuapp.com/img/icons/Icon-57.png",
                                                    "click_action": "https://graph-pwa.herokuapp.com",
                                                    // "image": 'https://donotifyme.herokuapp.com/img/promoimages/' + message.selectedimg,
                                                    // "showbanner": message.pbanner
                                                },
                                                "to": token
                                            }
                                    )
                                }, function (error, response, body) {

                                    if (error) {
                                        console.error(error, response, body);
                                    } else if (response.statusCode >= 400) {
                                        console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
                                    } else {
                                        count++;
                                        if (count === tokencount) {
                                            callback("Message send to >>" + count + ' Devices');
                                            console.log("/////////////////////");
                                            console.log("Message send to >>" + count + ' Devices');
                                            console.log("/////////////////////");
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            });
        });



        var token = 'd_FL3jzk1Sw:APA91bHc6WU0kfNb8_dECGVMKzTZdlHzhimu0Qo3DBgnilhKZvjKjCbSmGUZtL32OS2gSs_IuQnjh7DOWS91qlPB-Efcjyn8qXD_JSfOgCnpmxiwqn0EHgGiTWVLJfPXpHKCsy6rK43g';

    },
    mapLocationtoCity: function (zipId) {

        console.log("<<<<<<<<<<<<<<Iinside Map location>>>>>>>>>>>>");
        var primaryCount = 0;
        var popularCityCount = 0;
        var nearbyCityCountSuccess = 0;
        console.log(`match (geo:Mastergeo{zip:${zipId}) where not (geo)-[]-(:MasterCity) return geo`)
        driver.cypher({
            query: `match (geo:Mastergeo{zip:${zipId}}) where not (geo)-[]-(:MasterCity) return geo`
        }, (err, results) => {
            console.log('Length is ' + results.length);
            async.each(results, (result, callbackfirst) => {

                var geo = result.geo;

                console.log(prettyjson.render(result));
                console.log(`WITH point({longitude: ${geo.properties.lang}, latitude: ${geo.properties.lat} }) AS currentPoint match (pCity:MasterCity)-[:IS_PRIMARY_CITY]-(:CityType) with currentPoint,pCity,point({longitude:pCity.lang,latitude:pCity.lat}) as locationPoints with locationPoints,pCity,distance(currentPoint,locationPoints) as dist where dist < 80467 return pCity,dist order by dist limit 1`);

                //00041 
                driver.cypher({
                    query: `WITH point({longitude: ${geo.properties.lang}, latitude: ${geo.properties.lat} }) AS currentPoint match (pCity:MasterCity)-[:IS_PRIMARY_CITY]-(:CityType) with currentPoint,pCity,point({longitude:pCity.lang,latitude:pCity.lat}) as locationPoints with locationPoints,pCity,distance(currentPoint,locationPoints) as dist where dist < 80467 return pCity,dist order by dist limit 1`
                }, (err, pCities) => {
                    if (typeof pCities !== 'undefined' && pCities.length > 0) {
                        console.log('In if block');
                        // console.log('inIFCount is '+inIFCount++)
                        pCity = pCities[0];
                        driver.cypher({
                            query: `MATCH (loc:Mastergeo) where ID(loc)=${geo._id} MATCH (pc:MasterCity) where ID(pc)=${pCity.pCity._id} MERGE (loc)-[:IS_CITY_OF{type:"primaryLocation",distance:toFloat(${pCity.dist})}]->(pc)`,
                        }, (err, re1) => {
                            if (err) {
                                console.log('Has some error in pCity is' + pCity.pCity._id + ' error is' + err + ' loc is ' + geo._id);
                            } else {
                                console.log('total primaryCount is ' + primaryCount++)
                                //primaryCount = primaryCount + 1;
                            }
                        });
                    } else {
                        console.log('In else block');
                        driver.cypher({
                            query: `WITH point({longitude: ${geo.properties.lang}, latitude: ${geo.properties.lat} }) AS currentPoint match (pCity:MasterCity)-[:IS_SECONDARY_CITY]-(:CityType) with currentPoint,pCity,point({longitude:pCity.lang,latitude:pCity.lat}) as locationPoints with locationPoints,pCity,distance(currentPoint,locationPoints) as dist order by dist limit 1 where dist < 160934 return pCity,dist`,
                        }, (err, nearestSCity) => {
                            // console.log('nearestSCity is '+count++ )
                            if (typeof nearestSCity !== 'undefined' && nearestSCity.length > 0) {

                                nearSCity = nearestSCity[0];
                                driver.cypher({
                                    query: `MATCH (z:Mastergeo{zip:${geo.properties.zip}}) MATCH (c:MasterCity) where ID(c)=${nearSCity.pCity._id} MERGE (z)-[:IS_CITY_OF{type:"nearbyLocation",distance:toFloat(${nearSCity.dist})}]->(c)`,
                                }, (err, re1) => {
                                    if (err) {
                                        console.log('Has some error in nearSCity is' + nearSCity.pCity._id + ' error is' + err + ' zip is ' + geo.properties.zip);
                                    } else
                                        console.log('total nearbyCityCount success is ' + nearbyCityCountSuccess++)
                                });

                            }
                        });

                        driver.cypher({
                            query: `WITH point({longitude: ${geo.properties.lang}, latitude: ${geo.properties.lat} }) AS currentPoint match (pCity:MasterCity)-[:IS_SECONDARY_CITY]-(:CityType) with currentPoint,pCity,point({longitude:pCity.lang,latitude:pCity.lat}) as locationPoints with locationPoints,pCity,distance(currentPoint,locationPoints) as dist where dist < 160934 return pCity,dist,pCity.population as pop order by pop desc limit 1`,
                        }, (err, popularCity) => {
                            //console.log('popularCity is '+JSON.stringify(popularCity));
                            if (typeof popularCity !== 'undefined' && popularCity.length > 0) {
                                popularSCity = popularCity[0];
                                driver.cypher({
                                    query: `MATCH (z:Mastergeo{zip:${geo.properties.zip}}) MATCH (c:MasterCity) where ID(c)=${popularSCity.pCity._id} MERGE (z)-[:IS_CITY_OF{type:"popularLocation",distance:toFloat(${popularSCity.dist})}]->(c)`,
                                }, (err, re1) => {
                                    if (err) {
                                        console.log('Has some error in popularSCity is' + popularSCity.pCity._id + '  error is' + err + ' zip is ' + geo.properties.zip);
                                    } else
                                        console.log('total popularCityCount is ' + popularCityCount++)
                                });
                            }
                        });
                    }

                });

            });

        });


    }
}

module.exports = UsersModel;


