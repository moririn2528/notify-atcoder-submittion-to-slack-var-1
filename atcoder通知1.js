var properties = PropertiesService.getScriptProperties();

function postSubmitMessage(json) {
	var slackapp = SlackApp.create(properties.getProperty("SLACK_TOKEN"));
	var channelId = "#test-for-slack-app";
	var message = json["user_id"] + " が問題 " + json["problem_id"] + ", " + json["language"] + " で挑戦！\n";
	message += "結果は " + json["result"] + " だったよ！";
	switch(json["result"]){
		case "AC":
		message += "やったね！";
		break;

		case "IE":
		message += "Atcoder 側の問題の可能性があるね、時間をおいて再提出してみよう";
		break;

		default:
		message += "あきらめず頑張って！";
		break;
	}
	var options = {
	};
	var return_message = slackapp.postMessage(channelId, message, options);

	if(return_message["ok"]){
		Logger.log("postMessage: ok");
	}else{
		Logger.log("postMessage: error: %s",return_message["error"]);
	}
}

function postMessage(message){ 
  var slackapp = SlackApp.create(properties.getProperty("SLACK_TOKEN"));
  var channelId = "@moririn2528";
  var return_message = slackapp.postMessage(channelId, message, {});
}

function get_unixtime_now(){
  var date = new Date();
  var a = date.getTime();
  return Math.floor(a/1000);
}

function load_data_ids(){
  var data_ids_string = properties.getProperty("data_ids");
  Logger.log("load_data_ids \n %s",data_ids_string);
  var data_ids = data_ids_string.split(',');
  data_ids.map(str => parseInt(str, 10));
  return data_ids;
}

function load_users(){
  var users_string = properties.getProperty("users");
  if(!users_string)return [];
  var users = users_string.split(',');
  Logger.log("load_users \n %s",users_string);
  return users;
}

function save_data_ids(data_ids){
	var data_ids_string = data_ids.join(',');
	properties.setProperty("data_ids",data_ids_string);
	Logger.log("save_data_ids \n %s",data_ids_string);
}

function save_users(users){
	var users_string = users.join(',');
	properties.setProperty("users",users_string);
	Logger.log("save_users \n %s",users_string);
}
  
  

function check_submit(){
	const search_during_time = 500 //(s)
	var search_time = get_unixtime_now() - search_during_time;
	var url_string = "https://kenkoooo.com/atcoder/atcoder-api/v3/from/" + String(search_time);
	var response = UrlFetchApp.fetch(url_string);
	var json = JSON.parse(response.getContentText());
	var data_ids = load_data_ids();
	var data_ids_next = [0];
	var data_itr = 1,data_n = data_ids.length, data_max_id = Number(data_ids[0]);
	var users = load_users();

	for(var item of json){
		var id = Number(item["id"]);
		data_ids_next[0]=Math.max(data_ids_next[0],id);
		while(data_itr < data_n && id>data_ids[data_itr])data_itr++;
		if(data_itr < data_n && id==data_ids[data_itr]){
			data_itr++;
		}else if(id<=data_max_id)continue;
		if(!isNaN(item["result"][0]) || item["result"]=="WJ"){
			Logger.log("%d: %s",id,item["result"]);
			data_ids_next.push(id);
			continue;
		}
		for(var user of users){
			if(item["user_id"]==user){
				Logger.log("post Message");
				postSubmitMessage(item);
				break;
			}
		}
	}
	save_data_ids(data_ids_next);
	Logger.log(json);
}