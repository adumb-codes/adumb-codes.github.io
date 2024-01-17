const splitText = all_text.split(' ');
let testLength = 25;
let maxSplitPoint = splitText.length-testLength;

const rstlne = 'qagwsxdecfrvzl?;hbunjkimyo,pt. ';
const twof = 'jxmwsdrnlctbzgvqhyuafie,op.k;? ';
const onef = 'vgfcdnlatreoismhupwy.b,xkzjq;? ';

const deleteIndex = 31;
const spaceIndex = 30;

let curIndex = 0;
let curLayout = rstlne;
let testText = 'hello world';
let typedText = 'hello wors';
let ready = true;
let startTime = 0;
let endTime;

$(document).ready(() => {
    resetText();

		// add layouts to dropdown menu and add onChange lambda
    $('#layout-selector')
        .dropdown({
            values: [
                {
                    name: 'RSTLNE',
                    value: 'rstlne',
                    selected: true
                },
                {
                    name     : '2 Finger',
                    value    : '2finger',
                },
                {
                    name     : '1 Finger',
                    value    : '1finger',
                }
            ],
            onChange: function(value, text, $selectedItem) {
                if (value === 'rstlne') {
                    setLayout(rstlne)
                } else if (value === '2finger') {
                    setLayout(twof);
                } else if (value === '1finger') {
                    setLayout(onef)
                }
            }
    });

    $('#restart-icon').popup();
    $('#restart-icon').click(resetText);

    $('#10words').click(function() {
        testLength = 10;
        maxSplitPoint = splitText.length-testLength;
        $('#10words').addClass('active-option');
        $('#25words').removeClass('active-option');
        $('#40words').removeClass('active-option');
        resetText();
    });

    $('#25words').click(function() {
        testLength = 25;
        maxSplitPoint = splitText.length-testLength;
        $('#25words').addClass('active-option');
        $('#10words').removeClass('active-option');
        $('#40words').removeClass('active-option');
        resetText();
    });

    $('#40words').click(function() {
        testLength = 40;
        maxSplitPoint = splitText.length-testLength;
        $('#40words').addClass('active-option');
        $('#10words').removeClass('active-option');
        $('#25words').removeClass('active-option');
        resetText();
    });

		// for each key in the current layout, plus the backspace/delete key
    for(let i = 0; i <= curLayout.length + 1; i++) {
    		// add on-click lambda to each key
        $(`#key-${i}`).click(function() {
            // get key index from html id of visual key element
            let index = parseInt(this.id.split('-')[1])
            // enables backspace / delete feature
            if (index == deleteIndex) {
                // if typedText isn't empty
                if (typedText.length > 0) {
                    // remove 1 character from end of typed text
                    typedText = typedText.substring(0, typedText.length-1)
                }
            } else {
                // if start time was reset, set it to current time
                if (startTime == 0) {
                    startTime = Date.now();
                }
                // add character corresponding to pressed key
                typedText += curLayout[index]
            }
            updateText(evaluateText())
        });
    }
})

$(document).keydown(event => {
    if (!ready) return;
    if (!keyMapping[event.which]) return;
    if (keyMapping[event.which].pressed == true) return;
    keyMapping[event.which].pressed = true
    $(`#key-${keyMapping[event.which].index}`).addClass('active')
    if (event.which == 8) {
        if (typedText.length > 0) {
            typedText = typedText.substring(0, typedText.length-1)
        }
    } else if (event.which == 32) {
        event.preventDefault();
        if (typedText.length > 0) {
            typedText += curLayout[keyMapping[event.which].index]
        }
    } else {
        if (startTime == 0) {
            startTime = Date.now();
        }
        typedText += curLayout[keyMapping[event.which].index]
    }
    let formatText = evaluateText()
    updateText(formatText)
})

$(document).keyup(event => {
    if (!keyMapping[event.which]) return;
    keyMapping[event.which].pressed = false
    $(`#key-${keyMapping[event.which].index}`).removeClass('active')
})

function resetText() {
    const splitPoint = Math.floor(Math.random() * maxSplitPoint)
    testText = splitText.slice(splitPoint, splitPoint+testLength).join(' ');
    typedText = '';
    curIndex = 0;
    ready = true;
    startTime = 0;
    endTime = 0;
    $('#acc').text('--')
    $('#wpm').text('--')
    // let textContent = `<span class="underline untyped-text">${testText[0]}</span><span class="untyped-text">${testText.substring(1)}</span>`
    // $('#text-content').html(textContent)
    let formatText = evaluateText()
    updateText(formatText)
}

function setLayout(layout) {
    curLayout = layout;
    for(let i=0; i<30; i++) {
        $(`#key-${i}`).text(layout[i].toUpperCase())
    }
}

function evaluateText() {
    let formatText = [];
    let testWords = testText.split(' ');
    let typedWords = typedText.split(/\s+/);
    let curState = 'typed';
    let curString = '';
    for(let i=0; i<testWords.length; i++) {
        // curString += ' '
        let curWord = testWords[i];
        if (typedWords[i] == undefined) {
            if (curState !== 'untyped') {
                formatText.push({state: curState, text: curString})
                curString = ''
                curState = 'untyped'
            }
            curString += ' ' + curWord;
            continue;
        }
        curString += ' '
        let j;
        for(j=0; j<curWord.length; j++) {
            if (!typedWords[i][j] && typedWords[i+1] != undefined) {
                if (curState !== 'missed') {
                    formatText.push({state: curState, text: curString})
                    curString = ''
                    curState = 'missed'
                }
                curString += curWord[j]
            } else if (!typedWords[i][j]) {
                if (curState !== 'untyped') {
                    formatText.push({state: curState, text: curString})
                    curString = ''
                    curState = 'untyped'
                }
                curString += curWord[j]
            } else if (curWord[j] == typedWords[i][j]) {
                if (curState !== 'typed') {
                    formatText.push({state: curState, text: curString})
                    curString = ''
                    curState = 'typed'
                }
                curString += curWord[j];
            } else if (curWord[j] != typedWords[i][j]) {
                if (curState !== 'wrong') {
                    formatText.push({state: curState, text: curString})
                    curString = ''
                    curState = 'wrong'
                }
                curString += curWord[j];
            }
        }

        if (typedWords[i].length > curWord.length) {
            for (; j<typedWords[i].length; j++) {
                if (curState !== 'extra') {
                    formatText.push({state: curState, text: curString})
                    curString = ''
                    curState = 'extra'
                }
                curString += typedWords[i][j]
            }
        }
    }
    formatText.push({state: curState, text: curString})

    if ((testWords.length == typedWords.length && testWords[testWords.length-1].length == typedWords[typedWords.length-1].length) || typedWords.length > testWords.length) {
        ready = false;
        endTime = Date.now();
        getStatistics(formatText);
    }
    return formatText;
}

function updateText(formatText) {
    let contentHtml = '';
    for(let i=0; i<formatText.length; i++) {
        if (formatText[i].state === 'typed') {
            contentHtml += `<span class="typed-text">${formatText[i].text}</span>`
        } else if (formatText[i].state === 'missed') {
            contentHtml += `<span class="untyped-text">${formatText[i].text}</span>`
        } else if (formatText[i].state === 'untyped') {
            let cursorPos = 0
            if (typedText[typedText.length-1] == ' ' && formatText[i].text[0] == ' ') {
                contentHtml += `<span class="typed-text">${formatText[i].text[cursorPos]}</span>`
                cursorPos++;
            }
            contentHtml += `<span class="untyped-text underline">${formatText[i].text[cursorPos]}</span>`
            cursorPos++;
            if (formatText[i].text.length > cursorPos) {
                contentHtml += `<span class="untyped-text">${formatText[i].text.substring(cursorPos)}</span>`
            }
        } else if (formatText[i].state === 'wrong') {
            contentHtml += `<span class="wrong-text">${formatText[i].text}</span>`
        } else if (formatText[i].state === 'extra') {
            contentHtml += `<span class="extra-text">${formatText[i].text}</span>`
        }
    }
    $('#text-content').html(contentHtml)
}

function getStatistics(formatText) {
    const totalTime = (endTime - startTime) / 1000
    const wpm = Math.round((typedText.length / 5) / (totalTime / 60))
    let totalWrong = 0;
    for (let i=0; i<formatText.length; i++) {
        if (formatText[i].state === 'missed' || formatText[i].state === 'wrong' || formatText[i].state === 'extra') {
            totalWrong += formatText[i].text.length;
        }
    }
    let acc;
    if (totalWrong > testText.length) {
        acc = 0
    } else {
        acc = Math.round((1 - (totalWrong / testText.length)) * 100)
    }
    $('#acc').text(`${acc}%`)
    $('#wpm').text(wpm)
}