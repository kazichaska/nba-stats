

var savedTeams = [];

var playerData;


function loadTeamList(teamID, teamName) {
    $("#teams").append('<option value="' + teamID + '">' + teamName + '</option');
}

function storeTeam(teamID, teamName) {
    var nbaTeam = {
        name : "",
        teamId : ""
    };

    nbaTeam.name = teamName;
    nbaTeam.teamId = teamID;
    savedTeams.push(nbaTeam);
    localStorage.setItem('nbaTeams', JSON.stringify(savedTeams));

}

function loadTeams() {

    savedTeams = JSON.parse(localStorage.getItem('nbaTeams'));
    if (!savedTeams) {
        savedTeams = [];
        console.log("Loading Teams from api");
        teamApiData();
    }
    else {
        console.log("Loading Teams from localStorage");
        for (var i = 0; i < savedTeams.length; i++) {
            loadTeamList(savedTeams[i].teamId, savedTeams[i].name);
        }
    }
}
function getCovidData() {

    //var covidApiUrl = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/covid-19-qppza/service/REST-API/incoming_webhook/us_only?min_date=2022-01-01T00:00:00.000Z&max_date=2022-01-01T00:00:00.000Z&state=Alabama&hide_fields=_id, date, country, combined_name, fips, uid";
    //var covidApiUrl = "https://covid-19-data.p.rapidapi.com/country/code?code=canada";
    //var covidApiUrl = "https://covid19-api.com/country?name=canada&format=json";
    var covidApiUrl = "https://data.cdc.gov/resource/9mfq-cb36.json"
    fetch(covidApiUrl)
        .then(async function (response) {
            var data = await response.json();
            console.log(data);
        })
}

//getCovidData();

function dataTest(data) {

    if ((typeof (data) !== "undefined") && (typeof (data) !== null)) {
        return data
    }
    else {
        return "unknown";
    }


}

function playerData() {

    var team = $("#teams option:selected").val();
    //console.log("Team ID : " + team);
    $("#players").empty();
    var playerUrl = "http://data.nba.net/10s/prod/v1/2021/players.json";
    fetch(playerUrl)
        .then(async function (response) {
            playerData = await response.json();
            //console.log(playerData);


            for (var i = 0; i < playerData.league.standard.length; i++) {
                if (parseInt(playerData.league.standard[i].teamId) == parseInt(team)) {
                    $("#players").append('<tr><td>' + playerData.league.standard[i].jersey + '</td>' +
                        '<td>' + playerData.league.standard[i].firstName +
                        ' ' + playerData.league.standard[i].lastName + '</td>' +
                        '<td>' + playerData.league.standard[i].yearsPro + '</td>' +
                        '<td>' + playerData.league.standard[i].heightFeet + "'" +
                        playerData.league.standard[i].heightInches + '</td>' +
                        '<td>' + playerData.league.standard[i].collegeName + '</td></tr>');
                }



            }

            //console.log(players);


        });
}


function teamApiData() {

    // var nbaApi = "http://data.nba.net/10s/prod/v1/today.json"
    var teamUrl = "http://data.nba.net/10s/prod/v2/2021/teams.json"
    fetch(teamUrl)
        .then(async function (response) {
            var teamData = await response.json();
            //console.log(teamData);

            for (var i = 0; i < teamData.league.standard.length; i++) {
                if (teamData.league.standard[i].isNBAFranchise) {
                    loadTeamList(teamData.league.standard[i].teamId, teamData.league.standard[i].fullName);
                    storeTeam(teamData.league.standard[i].teamId, teamData.league.standard[i].fullName);
                }
            }
            
        });
}

//teamApiData();
loadTeams();
$("#teams").change(playerData);


