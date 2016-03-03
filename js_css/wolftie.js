// JavaScript Document
// start with creating the databases for the app.
// premier table, fixtures, season
// champ table, fixtures, season
// league1 table, fixtures, season
// league2 table, fixtures, season
// conference table, fixtures, season
// timestamp everyday, optional refresh button.
// check timestamp if less than today, update all tables, create a json file on server to pull out league table and fixtures and season.
// on app LOAD and after db creation search for predictions on server.
// test creating a db of bigger than 2 * 1024 * 1024
var db = openDatabase('wolftie_predicts_db', '1.0', 'Wolftie Predicts', 5 * 1024 * 1024);
db.transaction(function (tx) {				
		
		//tx.executeSql('DROP TABLE time_log');
		tx.executeSql('CREATE TABLE IF NOT EXISTS time_log (tid INTEGER, data_time TEXT, PRIMARY KEY(tid))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS premier_leaguetable (Position INTEGER, Team UNIQUE, Played INTEGER, Won INTEGER, Drawn INTEGER, Lost INTEGER, GD INTEGER, Points INTEGER)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS champ_leaguetable (Position INTEGER, Team UNIQUE, Played INTEGER, Won INTEGER, Drawn INTEGER, Lost INTEGER, GD INTEGER, Points INTEGER)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS league1_leaguetable (Position INTEGER, Team UNIQUE, Played INTEGER, Won INTEGER, Drawn INTEGER, Lost INTEGER, GD INTEGER, Points INTEGER)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS league2_leaguetable (Position INTEGER, Team UNIQUE, Played INTEGER, Won INTEGER, Drawn INTEGER, Lost INTEGER, GD INTEGER, Points INTEGER)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS conference_leaguetable (Position INTEGER, Team UNIQUE, Played INTEGER, Won INTEGER, Drawn INTEGER, Lost INTEGER, GD INTEGER, Points INTEGER)');
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS premier_fixtures (Match_Date TEXT, Home_Team TEXT, Away_Team TEXT, Kickoff TEXT, p_h_goals INTEGER, p_a_goals INTEGER, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS champ_fixtures (Match_Date TEXT, Home_Team TEXT, Away_Team TEXT, Kickoff TEXT, p_h_goals INTEGER, p_a_goals INTEGER, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS league1_fixtures (Match_Date TEXT, Home_Team TEXT, Away_Team TEXT, Kickoff TEXT, p_h_goals INTEGER, p_a_goals INTEGER, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS league2_fixtures (Match_Date TEXT, Home_Team TEXT, Away_Team TEXT, Kickoff TEXT, p_h_goals INTEGER, p_a_goals INTEGER, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS conference_fixtures (Match_Date TEXT, Home_Team TEXT, Away_Team TEXT, Kickoff TEXT, p_h_goals INTEGER, p_a_goals INTEGER, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS premier_season2015 (Home_Team TEXT, Away_Team TEXT, Home_Goals INTEGER, Away_Goals INTEGER, Match_Date TEXT, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS champ_season2015 (Home_Team TEXT, Away_Team TEXT, Home_Goals INTEGER, Away_Goals INTEGER, Match_Date TEXT, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS league1_season2015 (Home_Team TEXT, Away_Team TEXT, Home_Goals INTEGER, Away_Goals INTEGER, Match_Date TEXT, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS league2_season2015 (Home_Team TEXT, Away_Team TEXT, Home_Goals INTEGER, Away_Goals INTEGER, Match_Date TEXT, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS conference_season2015 (Home_Team TEXT, Away_Team TEXT, Home_Goals INTEGER, Away_Goals INTEGER, Match_Date TEXT, PRIMARY KEY(Match_Date,Home_Team,Away_Team))');
		
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS predictions (League TEXT, Home_Team TEXT, Away_Team TEXT, Home_Goals INTEGER, Away_Goals INTEGER, Real_Home_Goals INTEGER, Real_Away_Goals INTEGER, Match_Date TEXT)');
		
		//if you need to remove a table, use sql ('show tables like 'tablename') if the result set returns a row then drop table code.
});


db.transaction(function (tx) {	
	tx.executeSql('INSERT INTO time_log (tid,data_time) VALUES (1,"Sat Jul 04 2015 15:27:31 GMT+0100 (GMT Daylight Time)")');
});

//counter to make sure everything has loaded before loading screen ends 
var fixture_counter = 0;
var season_counter = 0;
var table_counter = 0;


function hide_loading_screen(){
	if(fixture_counter == 5 && season_counter== 5 && table_counter== 5){
		$("#ajax_loading_screen").css("display","none");
		//reset counters for user refresh of data
		fixture_counter = 0;
		season_counter = 0;
		table_counter = 0;
		$("#main_loading_screen").html("LOADING DATA");
	}
}



function league_table_json(league){
	$.getJSON("http://api.wolfstudioapps16.co.uk/apps/bet_penguin/mobile_files/json_league_table.php", {league:league})
	.done(function( json ) {
		$("#main_loading_screen").html("LOADING DATA...<br/>"+league+" Table");
		db.transaction(function (tx) {	
			tx.executeSql('DELETE FROM '+league+'_leaguetable');
			});
			db.transaction(function (tx) {	
		$.each(json,function(key,val){
			//console.log(val.Position +" "+ val.Team + " " + val.Played + " " + val.Won + " " + val.Drawn + " " + val.Lost + " " + val.Points);
			//console.log("Success json table for "+league);
			
			tx.executeSql('INSERT INTO '+league+'_leaguetable (Position, Team, Played, Won, Drawn, Lost, GD, Points) VALUES ('+val.Position+', "'+val.Team+'", '+val.Played+', '+val.Won+', '+val.Drawn+', '+val.Lost+', '+val.GD+', '+val.Points+')');
			});
		});
		
		console.log("each league table done "+league);
		table_counter++;
		if(table_counter==5){
			console.log("all tables loaded?");
			hide_loading_screen();
		}
	  })
	.fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}


function fixtures_json(league){
	$.getJSON("http://api.wolfstudioapps16.co.uk/apps/bet_penguin/mobile_files/json_fixtures.php", {league:league})
	.done(function( json ) {
		$("#main_loading_screen").html("LOADING DATA...<br/>"+league+" Table");
		db.transaction(function (tx) {	
			tx.executeSql('DELETE FROM '+league+'_fixtures');
			});
			db.transaction(function (tx) {	
		$.each(json,function(key,val){
			//console.log(val.date +" "+ val.Home_Team + " " + val.Away_Team + " " + val.Kickoff + " " + val.p_h_goals + " " + val.p_a_goals);
			
			tx.executeSql('INSERT INTO '+league+'_fixtures (Match_Date, Home_Team, Away_Team, Kickoff, p_h_goals, p_a_goals) VALUES ("'+val.date+'", "'+val.Home_Team+'", "'+val.Away_Team+'", "'+val.Kickoff+'", '+val.p_h_goals+', '+val.p_a_goals+')');
			});
			console.log("Success json fixtures for "+league+" fix counter: "+fixture_counter);
		fixture_counter++;
		if(fixture_counter==5){
			console.log("all fixtures loaded?");
			//give extra time to get data
			setTimeout(function(){ 
				document.getElementById('fixtures_list_heading').setAttribute("data-leaguename","prem");
				document.getElementById('fixtures_list_heading').innerHTML="PREMIER LEAGUE";
				load_in_data_main('premier');
				hide_loading_screen();
			}, 2000);
		}
		});
		
		
	  })
	.fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

function season_json(league){
	$.getJSON("http://api.wolfstudioapps16.co.uk/apps/bet_penguin/mobile_files/json_season.php", {league:league})
	.done(function( json ) {
		$("#main_loading_screen").html("LOADING DATA...<br/>"+league+" Table");
		db.transaction(function (tx) {	
			tx.executeSql('DELETE FROM '+league+'_season2015');
			});
    	//console.log( "JSON Data: " + json.position);
		db.transaction(function (tx) {	
		$.each(json,function(key,val){
			//console.log(val.Home_Team + " " + val.Home_Goals + " - " + val.Away_Goals + " " + val.Away_Team +" "+val.date);
			
			tx.executeSql('INSERT INTO '+league+'_season2015 (Home_Team, Away_Team, Home_Goals, Away_Goals, Match_Date) VALUES ("'+val.Home_Team+'", "'+val.Away_Team+'", '+val.Home_Goals+', '+val.Away_Goals+', "'+val.date+'")');
			});
		});
		console.log("Success json season for "+league);
		season_counter++;
		if(season_counter==5){
			console.log("all seasons loaded?");
			hide_loading_screen();
		}
		
	  })
	.fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}



function analytics_json(){
	$.getJSON("http://api.wolfstudioapps16.co.uk/apps/bet_penguin/mobile_files/json_analytics.php")
	.done(function( json ) {
		db.transaction(function (tx) {	
			tx.executeSql('DELETE FROM predictions');
			});
    	//console.log( "JSON Data: " + json.position);
		db.transaction(function (tx) {	
		$.each(json,function(key,val){
			//console.log(val.Home_Team + " " + val.Home_Goals + " - " + val.Away_Goals + " " + val.Away_Team +" "+val.date);
			
			tx.executeSql('INSERT INTO predictions (League, Home_Team, Away_Team, Home_Goals, Away_Goals, Real_Home_Goals, Real_Away_Goals, Match_Date) VALUES ("'+val.League+'", "'+val.Home_Team+'", "'+val.Away_Team+'", '+val.Home_Goals+', '+val.Away_Goals+', '+val.Real_Home_Goals+', '+val.Real_Away_Goals+', "'+val.date+'")');
			});
		});
		console.log("Success json analytics");
		
	  })
	.fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}


function check_time_log(){
	
	db.transaction(function (tx) {	
			tx.executeSql('SELECT data_time FROM time_log WHERE tid=1', [], function(tx, results){
			var tabledata = results.rows.item(0);
			data_time = tabledata.data_time;
			var user_time = new Date(data_time); //user time
			var today_time= new Date(); //today
			var gap_time = today_time.getTime()-user_time.getTime();
			if(gap_time>3600000){
				//3600000 milliseconds in one hour
				console.log("data needs refreshing");
				refresh_table_data(today_time,user_time);
				
			}else{
				console.log("data is up to date");
				$("#ajax_loading_screen").css("display","none");
				updated_text_notify(user_time);
				
					//if clicking refresh data menu option then the fixtures page is shown, reset heading to prem
					document.getElementById('fixtures_list_heading').setAttribute("data-leaguename","prem");
					document.getElementById('fixtures_list_heading').innerHTML="PREMIER LEAGUE";
					load_in_data_main('premier');
				
			}
			});
	});
		
}
function refresh_table_data(time,user_time){
	//only run on start of app and on refersh data
	//user_time is for use if offline browser
	if(navigator.onLine==true){
		
		
			var premier_table = league_table_json('premier');
			var champ_table = league_table_json('champ');
			var league1_table = league_table_json('league1');
			var league2_table = league_table_json('league2');
			var conference_table = league_table_json('conference');
		
		
			var premier_fixtures = fixtures_json('premier');
			var champ_fixtures = fixtures_json('champ');
			var league1_fixtures = fixtures_json('league1');
			var league2_fixtures = fixtures_json('league2');
			var conference_fixtures = fixtures_json('conference');
		
		
			var premier_season = season_json('premier');
			var champ_season = season_json('champ');
			var league1_season = season_json('league1');
			var league2_season = season_json('league2');
			var conference_season = season_json('conference');
			
			var predictions = analytics_json();
		
	db.transaction(function (tx) {	
			tx.executeSql('UPDATE time_log SET data_time="'+time.toString()+'" WHERE tid=1');
	});
	updated_text_notify(time);
	}else{
		alert("Could Not Establish Internet Connection");
		updated_text_notify(user_time);
	}

}
