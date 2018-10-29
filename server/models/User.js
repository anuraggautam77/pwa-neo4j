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
 zeo:Mastergeo {zip:${obj.zip},lat:${obj.zip_lat},lang:${obj.zip_lng},created_at: TIMESTAMP() }) MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`;

                if (zipcount.length > 0) {
                    query = `MERGE ( user:User{ _id :'${obj.deviceid}', lat:${obj.cur_lat}, lang:${obj.cur_lng},created_at: TIMESTAMP() })  MERGE( zeo:Mastergeo {
 zip:${obj.zip}}) MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`;
                }

                driver.cypher({'query': query}, (err, results) => {
                    if (err)
                        throw err;
                    callback(results);
                    if (zipcount.length === 0) {
                        this.mapLocationtoCity(obj.zip);
                    }
                });
            });

        } else {

            var query = `MERGE ( user:User{ _id :'${obj.deviceid}',lat:${obj.cur_lat},lang:${obj.cur_lng} })
                              MERGE( zeo:Mastergeo)  MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`;
            driver.cypher({'query': query}, function (err, results) {
                if (err)
                    throw err;
                callback(results);
            });
        }

    },
    getAllMruLocation: function (req, callback) {

        driver.cypher({query: queries.GET_ALL_MRUS}, function (err, results) {
            if (err)
                throw err;
            callback(results);
        });

    },
    registerUserAtPrimary: function (req, callback) {
        var query = `match (user:User)-[r:IS_REGISTERED_MRU]-(zip:Mastergeo)-[]-(city:MasterCity) return  count(distinct user) as mruCount`;
        driver.cypher({query: query}, function (err, results) {
            if (err){
               console.log(err)
            }else{
                callback(results); 
            }
        });
    },
    registerUserAtSecondary: function (id, callback) {
        var query = `optional match (user:User)-[:IS_REGISTERED_MRU]-(zip:Mastergeo)-[]-(c:MasterCity) where ID(c)=${id} with count(distinct user) as primaryCount optional match (user:User)-[:IS_REGISTERED_MRU]-(zip:Mastergeo)-[]-(c:MasterCity)-[:IS_CITY_OF]-(p:MasterCity) where ID(p)=${id} with count(distinct user) as secondaryCount,primaryCount return secondaryCount+primaryCount as mruCount`;
        driver.cypher({query: query}, function (err, results) {
            if (err){
               console.log(err)
            }else{
                callback(results); 
            }
        });
    },
    registerUserAtThirdLevel: function (req, callback) {
        var query = `optional match (user:User)-[:IS_REGISTERED_MRU]-(zip:Mastergeo)-[]-(c:MasterCity) where ID(c)=${req.locid} with count(distinct user) as primaryCount optional match (user:User)-[:IS_REGISTERED_MRU]-(zip:Mastergeo)-[]-(c:MasterCity)-[:IS_CITY_OF]-(p:MasterCity) where ID(p)=${req.locid} with count(distinct user) as secondaryCount,primaryCount return secondaryCount+primaryCount as mruCount`;

        driver.cypher({query: query}, function (err, results) {
            if (err){
               console.log(err)
            }else{
                callback(results); 
            }
               
           
        });
    },
    citiesDetails: function (req, callback) {

        var query = `match cities =(n:MasterCity)-[:IS_PRIMARY_CITY]-(:CityType) unwind nodes(cities) as city optional match (user:User)-[]-(zip:Mastergeo)-[]-(c:MasterCity) where ID(c)=ID(city) with count(distinct user) as primaryCount,city optional match (user:User)-[]-(zip:Mastergeo)-[]-(c:MasterCity)-[:IS_CITY_OF]-(p:MasterCity) where ID(p)=ID(city) with count(distinct user) as secondaryCount,primaryCount,city return city,secondaryCount+primaryCount as userCount order by userCount desc`;
        driver.cypher({
            query: query
        }, function (err, results) {
            if (err)
                throw err;
            callback(results);
        });

    },
    allprimaryCities: function (req,callback) {

        var query = `match cities =(n:MasterCity)-[:IS_PRIMARY_CITY]-(:CityType) unwind nodes(cities) as city optional match (user:User)-[]-(zip:Mastergeo)-[pr]-(c:MasterCity) where (ID(c)=ID(city) and pr.distance < 160934) with count(distinct user) as primaryCount,city optional match (user:User)-[]-(zip:Mastergeo)-[sr]-(c:MasterCity)-[:IS_CITY_OF]-(p:MasterCity) where (ID(p)=ID(city)  and sr.distance > 160934) with count(distinct user) as secondaryCount,primaryCount,city return city,secondaryCount+primaryCount as userCount order by userCount desc`;
        driver.cypher({
            query: query
        }, function (err, results) {
            if (err){
               console.log(err)
            }else{
                callback(results); 
            }
        });
    },
    getSecondLevelCities: function (citiid, callback) {


        var query = `match(user:User)-[]-(zip:Mastergeo)-[]->(mc:MasterCity) where ID(mc)=${citiid} return mc.cityName as cityname, ID(mc) as cityid, mc.lat as latitude, mc.lang as longitude,count(distinct user) as userCount UNION match(user:User)-[]-(zip:Mastergeo)-[]-(c:MasterCity)-[:IS_CITY_OF]-(p:MasterCity) where ID(p)=${citiid} return c.cityName as cityname, ID(c) as cityid, c.lat as latitude, c.lang as longitude,count(distinct user) as userCount order by userCount desc`;

        driver.cypher({
            query: query
        }, function (err, results) {
            if (err)
                throw err;
            callback(results);
        });
    },
    
    
    allzipCode:function(req, callback){

        var locflag = 'popularLocation';

        if (req.criteria === "nearByLocation") {
            locflag = 'nearbyLocation';
        }
        //'${req.todaydate}'
        var query = `match (user:User)-[]-(zip:Mastergeo)-[r]-(c:MasterCity) where (ID(c)=${req.locid} and r.type='${locflag}') or (ID(c)=${req.locid} and r.type="primaryLocation") and r.distance < 160934 optional match (zip)-[mr:IS_AT|:IS_EXPECTED_AT]-(mru:MRU)  where not mr.status='completed'  return mru.mru_id as mruid,mr.status, type(mr) as relation,mr.date as mrudate,ID(c), c.cityName as cityname,zip.locationName as locName,  zip.lat as latitude, zip.lang as longitude, zip.zip as zip, ID(c) as cityid, count(distinct user) as userCount order by userCount desc`;

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


   
    },
    
    
    nearByLoc: function (req, callback) {


        var locflag = 'popularLocation';

        if (req.criteria === "nearByLocation") {
            locflag = 'nearbyLocation';
        }
        //'${req.todaydate}'
        var query = `match (user:User)-[]-(zip:Mastergeo)-[r]-(c:MasterCity) where (ID(c)=${req.locid} and r.type='${locflag}') or (ID(c)=${req.locid} and r.type="primaryLocation") optional match (zip)-[mr:IS_AT|:IS_EXPECTED_AT]-(mru:MRU)  where not mr.status='completed'  return mru.mru_id as mruid,mr.status, type(mr) as relation,mr.date as mrudate,ID(c), c.cityName as cityname,zip.locationName as locName,  zip.lat as latitude, zip.lang as longitude, zip.zip as zip, ID(c) as cityid, count(distinct user) as userCount order by userCount desc`;
    console.log(query);
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


    },
    saveMruDetails: function (data, callback) {
        var query = '';
        if (data.relationTo === 'WAS_AT') {
            query = `MERGE (zip:Mastergeo {zip:${data.zipcode}})  MERGE (mru:MRU {mru_id:'${data.mruID}'}) 
             MERGE (zip) <- [:WAS_AT {date:'${data.startDate}',status:'completed'}] - (mru)
             with zip,mru MATCH (zip) <- [prevRel:${data.mruprevRelation} {date:'${data.prevdate}'}] - (mru) SET prevRel.status='completed'`;
        } else {
            query = `MERGE (zip:Mastergeo {zip:${data.zipcode}}) 
                     MERGE (mru:MRU {mru_id:'${data.mruID}'}) 
                     MERGE (zip) <- [:${data.relationTo} {date:'${data.startDate}',status:'progress'}] - (mru)`;
        }

        driver.cypher({query: query}, (err, results) => {
            if (err)
                throw err;
            var obj = {};
            if (data.relationTo === "IS_EXPECTED_AT") {
                obj.title = "MRU is nearby you";
                obj.infotext = `${data.mruID} is expected to placed at your registered Location ${data.zipcode} on  (${data.startDate})`;
            } else if (data.relationTo === "IS_AT") {
                obj.infotext = `${data.mruID} is currently at your registered Location ${data.zipcode}  (${data.startDate})`;
                obj.title = "MRU is nearby you";
            } else {
                obj.infotext = `${data.mruID} will be ending service at your registered location ${data.zipcode} by today end of day `;
                obj.title = "MRU service ending Today EOD!";
                callback({showRecommended: true, data: data});
            }
            this.postToSubscriber(obj, data, callback);

        });
    },
    postToSubscriber: function (obj, data, callback) {
        var tokencount = 0, count = 0;

        var query = `match (user:User)-[:IS_REGISTERED_MRU]->(zip:Mastergeo{zip:${data.zipcode}}) return user`;
        driver.cypher({query: query}, (err, userdetails) => {
            async.each(userdetails, (tokendetail) => {
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
                                                    "icon": "https://graph-pwa.herokuapp.com/img/icons/Icon-57.png",
                                                    "click_action": "https://graph-pwa.herokuapp.com",
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
                                            // callback({message: "Message send to >>" + count + ' Devices', });
                                            console.log("/////////////////////");
                                            console.log("Message send to >>" + count + ' Devices');
                                            console.log("/////////////////////");
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });
        });

    },
    mapLocationtoCity: function (zipId) {
        var primaryCount = 0;
        var popularCityCount = 0;
        var nearbyCityCountSuccess = 0;
        driver.cypher({
            query: `match (geo:Mastergeo{zip:${zipId}}) where not (geo)-[]-(:MasterCity) return geo`
        }, (err, results) => {
            async.each(results, (result, callbackfirst) => {
                var geo = result.geo;
                driver.cypher({
                    query: `WITH point({longitude: ${geo.properties.lang}, latitude: ${geo.properties.lat} }) AS currentPoint match (pCity:MasterCity)-[:IS_PRIMARY_CITY]-(:CityType) with currentPoint,pCity,point({longitude:pCity.lang,latitude:pCity.lat}) as locationPoints with locationPoints,pCity,distance(currentPoint,locationPoints) as dist where dist < 80467 return pCity,dist order by dist limit 1`
                }, (err, pCities) => {
                    if (typeof pCities !== 'undefined' && pCities.length > 0) {
                        pCity = pCities[0];
                        driver.cypher({
                            query: `MATCH (loc:Mastergeo) where ID(loc)=${geo._id} MATCH (pc:MasterCity) where ID(pc)=${pCity.pCity._id} MERGE (loc)-[:IS_CITY_OF{type:"primaryLocation",distance:toFloat(${pCity.dist})}]->(pc)`,
                        }, (err, re1) => {
                            if (err) {
                                //      //  console.log('Has some error in pCity is' + pCity.pCity._id + ' error is' + err + ' loc is ' + geo._id);
                            } else {
                                //  console.log('total primaryCount is ' + primaryCount++);
                                //primaryCount = primaryCount + 1;
                            }
                        });
                    } else {
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
                                        //  console.log('Has some error in nearSCity is' + nearSCity.pCity._id + ' error is' + err + ' zip is ' + geo.properties.zip);
                                    } else {
                                        // console.log('total nearbyCityCount success is ' + nearbyCityCountSuccess++)

                                    }
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
                                        // console.log('Has some error in popularSCity is' + popularSCity.pCity._id + '  error is' + err + ' zip is ' + geo.properties.zip);
                                    } else {
                                        // console.log('total popularCityCount is ' + popularCityCount++)
                                    }
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


