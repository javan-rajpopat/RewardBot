module.exports = class Slack {
  constructor(code, access_token, scope, user_id, team_id, 
               team_name, channel, channel_id, config_url, url) {
    this.code = code;
    this.access_token = access_token;
    this.scope = scope;
    this.uder_id = user_id;
    this.team_id = team_id;
    this.team_name = team_name;
    this.channel = channel;
    this.channel_id = channel_id;
    this.config_url = config_url;
    this.url = url;
  }
}









