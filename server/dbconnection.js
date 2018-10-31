const neo4j = require('neo4j');
//const  dbConfig = {url: 'localhost:7474/', username: 'neo4j', pass: 'demo', host: 'http:'};
 const dbConfig = {url:process.env.URL+'/', username: process.env.USER_NAME, pass:  process.env.PASSWORD, host: 'http:'};
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
