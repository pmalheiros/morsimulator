// http://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
// https://github.com/isaacs/ini
var fs = require('fs')
  , ini = require('ini')

var config = {};
config.properties = {};

// Development, SystemTest or Productive (default value)
config.properties.projectStage = 'Productive';

try {
  config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
}  catch (e) {
  console.log('Config ini file error: ' + e);
}

// values not read from config file, i.e., environment variable
config.web = {};
config.web.port = process.env.IP || 3000;

// config.twitter = {};
// config.redis = {};
// config.default_stuff =  ['red','green','blue','apple','yellow','orange','politics'];
// config.twitter.user_name = process.env.TWITTER_USER || 'username';
// config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';
// config.redis.uri = process.env.DUOSTACK_DB_REDIS;
// config.redis.host = 'hostname';
// config.redis.port = 6379;

// Sample file
//fs.writeFileSync('./config_modified.ini', ini.stringify(config));

module.exports = config;