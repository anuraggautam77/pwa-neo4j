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
    "GET_ALL_MRUS": `match (mru:MRU)-[r]-(zip:Mastergeo) return zip.zip as zipcode, mru.mru_id as mruid, zip.lat as latitude, zip.lang as longitude, type(r) as relation , r.date as atdate`,
    // REGISTER USER

    "REGISTER_USER_WITH_ZIP": `MERGE ( user:User{  _id :$deviceid, lat:$lat, lang:$lng })
                               MERGE( zeo:Mastergeo { zip:$zip, lat:$ziplat, lang:$ziplng})
                               MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`,

    "REGISTER_USER_WITHOUT_ZIP": `MERGE ( user:User{ _id :$deviceid,lat:$lat,lang:$lng })
                                  MERGE( zeo:Mastergeo)
                                  MERGE(user)-[:IS_REGISTERED_MRU]->(zeo)`

};

module.exports = queries;

