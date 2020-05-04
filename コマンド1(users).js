function doPost(e) {
	var json = JSON.parse(e.postData.getDataAsString());
	if(json.type == "url_verification"){
		return ContentService.createTextOutput(json.challenge);
	}
	if(json.token!=properties.getProperty("SLACK_VERIFICATION_TOKEN"))return -1;

	try{
		var slackapp = SlackApp.create(properties.getProperty("SLACK_TOKEN"));
		var incoming_message = json.event.text.trim();
		var incoming_message_array = incoming_message.split(/\s+/).filter(element => element[0]!="<");
		var users = load_users();
		var message = "";
		var i,j;
		switch(incoming_message_array[0]){
			case "help":
				message += "add_user (ユーザー名) ...: ユーザー名を登録\n";
				message += "erase_user (ユーザー名) ...: ユーザー名を登録解除\n";
				message += "users: 登録しているユーザー名を表示\n";
				break;

			case "add_user":
				for(i=1;i<incoming_message_array.length;i++){
					message += incoming_message_array[i] + ": ";
					if(users.some(element => element==incoming_message_array[i])){
						message += "すでに登録されています";
					}else{
						users.push(incoming_message_array[i]);
						message += "登録完了";
					}

					message+='\n';
				}
				save_users(users);
				break;

			case "erase_user":
				for(i=1;i<incoming_message_array.length;i++){
					message += incoming_message_array[i] + ": ";
					if(users.some(element => element==incoming_message_array[i])){
						users = users.filter(element => element!=incoming_message_array[i]);
						message += "登録解除完了";
					}else{
						message += "登録されていません";
					}

					message+='\n';
				}
				save_users(users);
				break;
			
			case "users":
				message += "登録ユーザー: " + users.join(', ');
				break;

			
			default:
				break;
		}
		

		slackapp.postMessage(json.event.channel, message, {});
	}catch(error_message){
		postMessage("Error: " + error_message);
	}
	return ContentService.createTextOutput(JSON.stringify(e));
}

function doGet(e){
  doPost(e);
}