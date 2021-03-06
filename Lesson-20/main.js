var action = document.getElementById('action');
var body = document.getElementsByTagName('body')[0];
var milisecond = 0;
var second = 0;
var minute = 0;
var numberMilisecond = document.getElementById('miliseconds');
var numberSecond = document.getElementById('seconds');
var numberMinute = document.getElementById('minutes');
var buttons = document.getElementsByTagName('button');
var arrOfResults = [];
var blockTimer = document.getElementsByClassName('timer')[0];


function formatNumber() {
    var clock = document.getElementsByTagName('div');
    for (var i = 1; i < clock.length; i++) {
        if (clock[i].innerHTML <= 9) {
            clock[i].innerHTML = '0' + clock[i].innerHTML;
        }
    }
}

function startTimer() {
    var timer = setInterval(function () {
        milisecond++;
        if (action.dataset.status === 'start') {
            clearInterval(timer);
            milisecond = 0;
        }
        numberMilisecond.innerHTML = milisecond;
        numberSecond.innerHTML = second;
        numberMinute.innerHTML = minute;
        formatNumber();
        if (milisecond === 99) {
            second++;
            milisecond = 0;
        }
        if (second === 59) {
            minute++;
            second = 0;
        }
        if (minute === 59) {
            clearInterval(timer);
            endTimer();
        }
        if (action.dataset.status === 'stop') {
            clearInterval(timer);
        }
    }, 10);
}

function endTimer() {
    buttons[0].remove();
    buttons[1].remove();
    blockTimer.classList.add('finish');
} 

function createButtons() {
    if (buttons.length > 1) {
        return;
    }
    for (var i = 0; i <= 1; i++) {
        var createdButtons = document.createElement('button');
        body.appendChild(createdButtons);
    }
    buttons[1].innerHTML = 'Reset';
    buttons[2].innerHTML = 'Save';
}

function resetTimer() {
    action.setAttribute('data-status', 'start');
    action.innerHTML = 'Start';
    milisecond = 0;
    second = 0;
    minute = 0;
    while (buttons.length > 1) {
        buttons[1].remove();
    }
    var results = document.getElementsByTagName('p');
    if (results) {
        while (results.length) {
            results[0].remove();
        }
    }
    numberMilisecond.innerHTML = '00';
    numberSecond.innerHTML = '00';
    numberMinute.innerHTML = '00';
    arrOfResults = [];
    localStorage.clear();
    if (blockTimer.classList.contains('finish')) {
        blockTimer.classList.remove('finish');
        buttons[0].remove();
        var createAction = document.createElement('button');
        body.insertBefore(createAction, blockTimer);
        createAction.innerHTML = 'Start';
        createAction.setAttribute('data-status', 'start');
        action = createAction;
        createAction.addEventListener('click', function(){
            clickOnAction();
        })
    } 
}

function saveResult() {
    var result = document.createElement('p');
    body.appendChild(result);

    result.innerHTML = (arrOfResults.length + 1) + ') ' + numberMinute.innerHTML + ' : ' + numberSecond.innerHTML + ' : ' + numberMilisecond.innerHTML;
    arrOfResults.push(result.innerHTML);
}

function setNumberAfterLoad() {
    var minuteLoad = localStorage.getItem('minute');
    var secondLoad = localStorage.getItem('second');
    var milisecondLoad = localStorage.getItem('milisecond');
    numberMilisecond.innerHTML = milisecondLoad;
    numberSecond.innerHTML = secondLoad;
    numberMinute.innerHTML = minuteLoad;
    minute = minuteLoad;
    second = secondLoad;
    milisecond = milisecondLoad;
    createButtons();
    if (action.dataset.status !== 'finish') {
        formatNumber();
    }
    arrOfResults = JSON.parse(localStorage.getItem('results'));
    if (arrOfResults.length > 0) {
        for (var i = 0; i < arrOfResults.length; i++) {
            var resultAfterLoad = document.createElement('p');
            body.appendChild(resultAfterLoad);
            resultAfterLoad.innerHTML = arrOfResults[i];
        }
    }
}

function clickOnAction() {
    if (action.dataset.status === 'start') {
        createButtons();
    }
    var buttons = document.getElementsByTagName('button');
    var reset = buttons[1];
    var save = buttons[2];
    reset.addEventListener('click', function (event) {
        event.stopImmediatePropagation();
        resetTimer();
    })
    save.addEventListener('click', function (event) {
        event.stopImmediatePropagation();
        saveResult();
    })
    if (action.dataset.status === 'start' || action.dataset.status === 'stop') {
        action.setAttribute('data-status', 'process');
        action.innerHTML = 'Stop';
        startTimer();
        return;
    }
    if (action.dataset.status === 'process') {
        action.setAttribute('data-status', 'stop');
        action.innerHTML = 'Run';
        return;
    }
}

action.addEventListener('click', function (event) {
    clickOnAction();
})

window.addEventListener('unload', function (event) {
    localStorage.setItem('status', action.dataset.status);
    localStorage.setItem('minute', minute);
    localStorage.setItem('second',  second);
    localStorage.setItem('milisecond', milisecond);
    localStorage.setItem('results', JSON.stringify(arrOfResults));
    if (blockTimer.classList.contains('finish')) {
        localStorage.setItem('status', 'finish');
        localStorage.setItem('minute', numberMinute.innerHTML);
        localStorage.setItem('second',  numberSecond.innerHTML);
        localStorage.setItem('milisecond', numberMilisecond.innerHTML);
    }
})

window.addEventListener('load', function (event) {
    var statusLoad = localStorage.getItem('status');
    statusLoad = (statusLoad === null) ? 'start' : statusLoad;
    action.dataset.status = statusLoad;
    switch (statusLoad) {
        case 'start':
            return;
        case 'stop':
            action.innerHTML = 'Run';
            setNumberAfterLoad();
            var buttons = document.getElementsByTagName('button');
            var reset = buttons[1];
            var save = buttons[2];
            reset.addEventListener('click', function (event) {
                event.stopImmediatePropagation();
                resetTimer();
            })
            save.addEventListener('click', function (event) {
                event.stopImmediatePropagation();
                saveResult();
            })
            break;
        case 'process':
            action.innerHTML = 'Stop';
            setNumberAfterLoad();
            startTimer();
            var buttons = document.getElementsByTagName('button');
            var reset = buttons[1];
            var save = buttons[2];
            reset.addEventListener('click', function (event) {
                event.stopImmediatePropagation();
                resetTimer();
            })
            save.addEventListener('click', function (event) {
                event.stopImmediatePropagation();
                saveResult();
            })
            break;
        case 'finish':
            setNumberAfterLoad();
            endTimer();
            var buttons = document.getElementsByTagName('button');
            var reset = buttons[0];
            reset.addEventListener('click', function (event) {
                event.stopImmediatePropagation();
                resetTimer();
            })
    }
}) 