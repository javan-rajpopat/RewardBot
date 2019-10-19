var Slack = require('./Slack.js');
var axios = require('axios');
var qs = require('querystring')
var maintainance = require('./maintain.js')

module.exports = {

  installation: function(code, repos) {
  
      let d = {
        client_id : "767362224017.791575114325",
        client_secret : "c8d211f1ef7e1146365fde5213bd7056",
        code : code,
        redirect_uri : "https://mixolydian-rhinoceros.glitch.me/"
      }

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }


      axios.post('https://slack.com/api/oauth.access', qs.stringify(d), config)
        .then((res) => {
            if(res.data.access_token){
                let index = maintainance.addToSlackArray(new Slack(code, res.data.access_token, res.data.scope, res.data.user_id, 
                                                       res.data.team_id, res.data.team_name, res.data.incoming_webhook.channel, 
                                                       res.data.incoming_webhook.channel_id, res.data.incoming_webhook.configuration_url,
                                                      res.data.incoming_webhook.url));
                repos.forEach(function(r){
                    maintainance.addToReposSlackDict(r,index);
                })
            }
        }).catch((err) => {
            console.error(err);
        });

    }
  
}