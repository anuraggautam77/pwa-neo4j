const neo4j = require('neo4j');
const  dbConfig = { url: 'localhost:11001/', username: 'neo4j',  pass: 'demo', host:'http:' };
//const dbConfig = { url: 'hobby-okiekikfepomgbkeidappmbl.dbs.graphenedb.com:24786/',  username: 'neo4j',  pass: 'b.j94lrgVSrvj3.SoEe6GbInYs3bNMz',  host:'https:'};



ConnectionEstablish = function () {
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