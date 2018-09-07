/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var queries = {
    /*  
     "GET_PRIMARY_CITIES":`match (c:MasterCity)-[:IS_PRIMARY_CITY]-(p:CityType) return c`,
     "GET_SECONDLEVEL_CITIES":`Match (c:MasterCity) where ID(c)=${citiid} Match (c)-[:IS_SECONDARY_CITY_OF]-(city:MasterCity) return city`,
     "NEAR_BY_LOC":`Match (user:User)-[:IS_REGISTERED_MRU|:IS_REGISTERED_PRO]-(zip:Mastergeo)-[:BELONGS_TO]-(city:MasterCity)  where ID(city) = ${req.locid} return city.cityName as cityname, count(user) as userCount, zip.lat as latitude, zip.lang as longitude, zip.zip as zip`,
     "SAVE_MRU_DETAILS" :`MATCH (zip:Mastergeo {zip:${data.zipcode}}) MERGE (mru:MRU {mru_id:'${data.mruID}'}) CREATE UNIQUE (zip) <- [:${data.relationTo} {date:'${data.startDate}'}] - (mru)`,
     
     */

    // USER Page
    "GET_ALL_MRUS": `match (mru:MRU)-[r{status:'progress'}]-(zip:Mastergeo)  return zip.zip as zipcode, mru.mru_id as mruid, zip.lat as latitude, zip.lang as longitude, type(r) as relation , r.date as atdate, r.status`,
    // REGISTER USER
    "REGISTER_USER_WITH_ZIP": `MERGE ( user:User{  _id :$deviceid, lat:$lat, lang:$lng })
                               MERGE( zeo:Mastergeo { zip:$zip, lat:$ziplat, lang:$ziplng})
                               MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`,
    "REGISTER_USER_WITHOUT_ZIP": `MERGE ( user:User{ _id :$deviceid,lat:$lat,lang:$lng })
                                  MERGE( zeo:Mastergeo)
                                  MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`

};

module.exports = queries;

/*
 *
 
 nearbyloc: match (user:User)-[]-(zip:Mastergeo)-[r]-(c:MasterCity) where (ID(c)=259550 and r.type='popularLocation') or (ID(c)=259550 and r.type="primaryLocation") optional match (zip)-[mr:IS_AT|:IS_EXPECTED_AT]-(mru:MRU)  where not mr.status='completed'  return mru.mru_id as mruid,mr.status, type(mr) as relation,mr.date as mrudate,ID(c), c.cityName as cityname,zip.locationName as locName,  zip.lat as latitude, zip.lang as longitude, zip.zip as zip, ID(c) as cityid, count(distinct user) as userCount order by userCount desc limit 100
 
 USER panel   :match (mru:MRU)-[r{status:'progress'}]-(zip:Mastergeo)  return zip.zip as zipcode, mru.mru_id as mruid, zip.lat as latitude, zip.lang as longitude, type(r) as relation , r.date as atdate, r.status 
 
 On Load of PCities :
 match (user:User)-[r:IS_REGISTERED_MRU]-(zip:Mastergeo)-[]-(city:MasterCity) return  count(user) as mruCount
 
 On Click on SCity:
 match (user:User)-[r:IS_REGISTERED_MRU]-(zip:Mastergeo)-[]-(city:MasterCity)where ID(city)=262346 return  count(user) as mruCount 
 
 On Click on ZIP :
 match (user:User)-[r:IS_REGISTERED_MRU]-(zip:Mastergeo{zip:29591}) return count(user) as mruCount 
 */