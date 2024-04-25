let curMin = -1
let curHour = -1

const MAX_MATCH_NAME_LENGTH = 105;
const MAX_MATCH_NAME_LENGTH_1100 = 70;
const MAX_MATCH_NAME_LENGTH_800 = 52;
const MAX_MATCH_NAME_LENGTH_500 = 42;
const MAX_DESCRIPTION_LENGTH = 142;
const MAX_DESCRIPTION_LENGTH_1100 = 95;
const MAX_DESCRIPTION_LENGTH_800 = 71;
const MAX_DESCRIPTION_LENGTH_500 = 57;

$(document).ready(() => {
    getTime()
    setInterval(getTime, 1000)
});

function getTime() {
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    if (min != curMin) {
        curMin = min;
        curHour = hour;
        updateInfo();
    }
}

function updateInfo() {
    let hourPad = curHour.toString().padStart(2, "0");
    let minPad = curMin.toString().padStart(2, "0");

    let key = hourPad.concat(':', minPad);
    let numGames = scoreLookup[key].length;
    let randGame = scoreLookup[key][Math.floor(Math.random() * numGames)];
    let matchName = [randGame['team1'], 'vs', randGame['team2']].join(' ')
    let article = setArticle(randGame['sport'])
    let description = ['was ', article, ' ', randGame['sport'], ' match on ', randGame['date'], '.'].join('');

    setMatchNameLangth(matchName);
    setDescriptionLength(description);

    $('#match-name').text(matchName);
    $('#match-name').attr('href', randGame['url']);
    $('#article').text(article);
    $('#sport').text(randGame['sport']);
    $('#date').text(randGame['date']);
    $('#score1').text(hourPad);
    $('#score2').text(minPad);
    $('#num-games').text(numGames);
    if (numGames > 1) {
        $('#multiples').text('s');
    } else {
        $('#multiples').text('');
    }
}

function setArticle(word) {
    ch = word.charAt(0);
    if (ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U') return 'an';
    return 'a';
}

function setMatchNameLangth(matchName) {
    let r = document.querySelector(':root');
    let length = matchName.length;

    length_default = (length > MAX_MATCH_NAME_LENGTH) ? length : MAX_MATCH_NAME_LENGTH;
    r.style.setProperty('--match-name-length', length_default);
    
    length_1100 = (length > MAX_MATCH_NAME_LENGTH_1100) ? length : MAX_MATCH_NAME_LENGTH_1100;
    r.style.setProperty('--match-name-length-1100', length_1100);

    length_800 = (length > MAX_MATCH_NAME_LENGTH_800) ? length : MAX_MATCH_NAME_LENGTH_800;
    r.style.setProperty('--match-name-length-800', length_800);

    length_500 = (length > MAX_MATCH_NAME_LENGTH_500) ? length : MAX_MATCH_NAME_LENGTH_500;
    r.style.setProperty('--match-name-length-500', length_500);
}

function setDescriptionLength(description) {
    let r = document.querySelector(':root');
    let length = description.length;

    length_default = (length > MAX_DESCRIPTION_LENGTH) ? length : MAX_DESCRIPTION_LENGTH;
    r.style.setProperty('--description-length', length_default);
    
    length_1100 = (length > MAX_DESCRIPTION_LENGTH_1100) ? length : MAX_DESCRIPTION_LENGTH_1100;
    r.style.setProperty('--description-length-1100', length_1100);

    length_800 = (length > MAX_DESCRIPTION_LENGTH_800) ? length : MAX_DESCRIPTION_LENGTH_800;
    r.style.setProperty('--description-length-800', length_800);

    length_500 = (length > MAX_DESCRIPTION_LENGTH_500) ? length : MAX_DESCRIPTION_LENGTH_500;
    r.style.setProperty('--description-length-500', length_500);
}

function showInfo() {
    let visibility = $('#info').css('visibility');
    if (visibility == 'hidden') {
        $('#info').css('visibility', 'visible');
        $('#info-button').css('color', '#c7c7c7');
    } else if (visibility == 'visible') {
        $('#info').css('visibility', 'hidden');
        $('#info-button').css('color', '#f1f1f1');
    }
}