const neo4j = require('neo4j');
//const  dbConfig = {url: 'localhost:7474/', username: 'neo4j', pass: 'demo', host: 'http:'};
const dbConfig = {url: '35.198.237.23:4502/', username: 'neo4j', pass: 'neo4j123', host: 'http:'};


/*
 username:  http://35.198.237.23:4502/browser/
 password: neo4j123
 bolt url: bolt://35.196.83.113:8080
 at https://35.196.83.113:4503/browser/
 */



ConnectionEstablish = function () {

    console.log(">>>>>>>>>>>>>>>>>>>>");
    console.log(process.env)


    var dbConnection = null;
    dbConnection = new neo4j.GraphDatabase(`${dbConfig.host}//${dbConfig.username}:${dbConfig.pass}@${dbConfig.url}`);
    var getInstance = function () {
        return  dbConnection;
    };

    return {
        getInstance: getInstance
    };
};

module.exports = ConnectionEstablish;
