// ********************************************************
//                  UI helpers
// ********************************************************

function generateAnswerBox(answer) {
    return "<div class='col-md-12 answer voting-item'>" +
            "<div class='col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span>" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-md-11'>" +
                "<div class='col-md-11 votes'>" +
                    "<div class='col-md-3'>" +
                        "<p class='up-votes'>" + answer.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3'>" +
                        "<p class='down-votes'>" + answer.downVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3 object-id'>" + answer._id + "</div>" +                    
                "</div>" +
                "<div class='col-md-11'>" +
                    "<p>" + answer.text + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}
function generateNextQuestionBox(question) {
    return "<div class='col-md-12 new-question voting-item'>" +
            "<div class='col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span>" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-md-11'>" +
                "<div class='col-md-11 votes'>" +
                    "<div class='col-md-3'>" +
                        "<p class='up-votes'>" + question.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3'>" +
                        "<p class='down-votes'>" + question.downVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3 object-id'>" + question._id + "</div>" + 
                "</div>" +
                "<div class='col-md-11'>" +
                    "<p>" + question.text + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}

function insertAnswer(answer) {
    $('.new-answer').before(generateAnswerBox(answer));
}
function insertFirstOrderedUnreviewedAnswer(answers) {
    for (var i = 0; i < answers.length; i++) {
        if (!hasAnswerAlreadyBeenReviewed(answers[i])) {
            insertAnswer(answers[i]);
            break;
        }
    }
}

function insertQuestion(question) {
    $('.new-question-add').before(generateNextQuestionBox(question));
}
function insertFirstOrderedUnreviewedQuestionCandidate(questions) {
    for (var i = 0; i < questions.length; i++) {
        if (!hasQuestionCandidateAlreadyBeenReviewed(questions[i])) {
            insertQuestion(questions[i]);
            break;
        }
    }
}

function setCurrentQuestion(questionText) {
    $("#currentQuestionText").text(questionText);
}

function countDisplayedAnswers() {
    return $('.answer').length;
}

function answerIsCurrentlyDisplayed(answer) {
    var displayedAnswers = [];
    $('.answer .object-id').each(function () { displayedAnswers.push($(this).text()); });
    if ($.inArray(answer._id, displayedAnswers) >= 0) {
        return true;
    }
    else {
        return false;
    }
}
// this is the wrapper function to consolidate all of 
// the logic to determine if the answer doesn't meet any 
// of the following criteria:
//
// - is currently being reviewed (on the screen)
// - (not implemented yet) was already reviewed (local storage)
// 
function hasAnswerAlreadyBeenReviewed(answer) {
    return answerIsCurrentlyDisplayed(answer) || objectIdIsCached(answer._id);
}

function questionCandidateIsCurrentlyDisplayed(question) {
    var displayedQuestionCandidates = [];
    $('.new-question .object-id').each(function () { displayedQuestionCandidates.push($(this).text()); });
    if ($.inArray(question._id, displayedQuestionCandidates) >= 0) {
        return true;
    }
    else {
        return false;
    }
}
function hasQuestionCandidateAlreadyBeenReviewed(question) {
    return questionCandidateIsCurrentlyDisplayed(question) || objectIdIsCached(question._id);
}

function getAnswerInputText() {
    return $('#newAnswer').val();
}
function clearAnswerInputText() {
    $('#newAnswer').val('');
}
// at the moment, the answers will need to be a minimum 
// of 40 characters. This is subject to change
//
function isSubmittedInputValid(inputText) {
    if (inputText.length < 40) {
        return false;
    }
    else {
        return true;
    }
}
function setAnswerInputError(answerText) {
    $('.new-answer').removeClass('has-success').addClass('has-error');
    $('.new-answer .error-block').text(
        'minimum of 40 characters required (current length: ' + 
        answerText.length + 
        ')');
    $('.new-answer .error-block').show();
}
function clearAnswerInputError() {
    $('.new-answer').removeClass('has-error');
    $('.new-answer .error-block').hide();
}
function setAnswerInputSuccess() {
    clearAnswerInputText();
    $('.new-answer').removeClass('has-error').addClass('has-success');
    $('.new-answer .error-block').text('successfully added answer!');
    $('.new-answer .error-block').show();
}
function clearAnswerInputSuccess() {
    $('.new-answer').removeClass('has-success');
    $('.new-answer .error-block').hide();
}

function getQuestionInputText() {
    return $('#newQuestion').val();
}
function clearQuestionInputText() {
    $('#newQuestion').val('');
}
function setQuestionInputError(questionText) {
    $('.new-question-add').removeClass('has-success').addClass('has-error');
    $('.new-question-add .error-block').text(
        'minimum of 40 characters required (current length: ' + 
        questionText.length + 
        ')');
    $('.new-question-add .error-block').show();
}
function clearQuestionInputError() {
    $('.new-question-add').removeClass('has-error');
    $('.new-question-add .error-block').hide();
}
function setQuestionInputSuccess() {
    clearQuestionInputText();
    $('.new-question-add').removeClass('has-error').addClass('has-success');
    $('.new-question-add .error-block').text('successfully added question!');
    $('.new-question-add .error-block').show();
}
function clearQuestionInputSuccess() {
    $('.new-question-add').removeClass('has-success');
    $('.new-question-add .error-block').hide();
}

function displayedAnswerCount() {
    return $('.answer').length;
}

function answerVoted() {
    var $voteElement = $(this);
    var answerObjectId = $voteElement.parent().next().find('.object-id').text();
    
    $voteElement.addClass('selected');
    
    // up vote handling
    //
    if ($voteElement.hasClass('glyphicon-chevron-up')) {
        upVoteAnswer(answerObjectId, function (answer) {
            var upVotesDisplay = $voteElement.parent().next().find('.up-votes');
            upVotesDisplay.text(parseInt(upVotesDisplay.text()) + 1);
            
            // now we can keep the voted answer here for a short time, but then 
            // we should remove it from the UI to make room for a new unreviewed 
            // answer
            //
            setTimeout(function() {
                // get the answer off of the page
                //
                removeAnswer(answerObjectId);
                // also cache the object id so we don't see
                // this answer again
                //
                cacheObjectId(answerObjectId);
                
                // insert an unreviewed answer if it exists
                //
                getCurrentQuestion(function (question) {
                    insertFirstOrderedUnreviewedAnswer(question.answers);
                });
            }, 500);
        });
    }
    // down vote handling
    //
    else {
        downVoteAnswer(answerObjectId, function (answer) {
            var downVotesDisplay = $voteElement.parent().next().find('.down-votes');
            downVotesDisplay.text(parseInt(downVotesDisplay.text()) + 1);
            
            // now we can keep the voted answer here for a short time, but then 
            // we should remove it from the UI to make room for a new unreviewed 
            // answer
            //
            setTimeout(function() {
                // get the answer off of the page
                //
                removeAnswer(answerObjectId);
                // also cache the object id so we don't see
                // this answer again
                //
                cacheObjectId(answerObjectId);
                
                // insert an unreviewed answer if it exists
                //
                getCurrentQuestion(function (question) {
                    insertFirstOrderedUnreviewedAnswer(question.answers);
                });
            }, 500);
        });
    }
}

function removeAnswer(answerObjectId) {
    $('.answer:contains("' + answerObjectId + '")').remove();
}


// ********************************************************
//                  Web Storage helpers
// ********************************************************

function localStorageIsAvailable() {
    return typeof(Storage) !== "undefined";
}

function objectIdIsCached(objectId) {
    if (localStorageIsAvailable()) {
        if (localStorage.objectIdList === undefined || localStorage.objectIdList === "") {
            // the local storage string doesn't exist, which would mean 
            // that the ObjectId is not cached
            //
            return false;
        }
        else {
            var objectIdList = JSON.parse(localStorage.objectIdList);
            if ($.inArray(objectId, objectIdList) >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function cacheObjectId(objectId) {
    // we don't want to add duplicate ObjectId elements (primarily
    // to keep the bloat and unknown behavior at a minimum), so 
    // we will also first do a check to see if it already exists
    //
    if (localStorageIsAvailable() && !objectIdIsCached(objectId)) {
        var objectIdList = 
            localStorage.objectIdList === undefined || localStorage.objectIdList === "" ? [] : JSON.parse(localStorage.objectIdList);
        objectIdList.push(objectId);
        localStorage.objectIdList = JSON.stringify(objectIdList);
    }
}

function clearCachedObjectIdElements() {
    localStorage.objectIdList = "[]";
}


// ********************************************************
//                  API helpers
// ********************************************************

function getCurrentQuestion(callback) {
    $.getJSON('/questions/', function (question) {
        callback(question);
    });
}

function sortAnswersByUpVotes(answers) {
    if (answers === undefined || answers === null || answers.length === 0) {
        return;
    }
    else {
        answers.sort(function (a, b) {
            if (a.upVotes > b.upVotes) {
                return -1;
            }
            else if (a.upVotes < b.upVotes) {
                return 1;
            }
            return 0;
        });
    }
}
function sortAnswersByDownVotes(answers) {
    if (answers === undefined || answers === null || answers.length === 0) {
        return;
    }
    else {
        answers.sort(function (a, b) {
            if (a.downVotes > b.downVotes) {
                return -1;
            }
            else if (a.downVotes < b.downVotes) {
                return 1;
            }
            return 0;
        });
    }
}

function sortQuestionsByUpVotes(questions) {
    if (questions === undefined || questions === null || questions.length === 0) {
        return;
    }
    else {
        questions.sort(function (a, b) {
            if (a.upVotes > b.upVotes) {
                return -1;
            }
            else if (a.upVotes < b.UpVotes) {
                return 1;
            }
            return 0;
        });
    }
}

function getNextQuestionCandidates(callback) {
    // make an API to get all next question candidates by specifying 
    // zero (0) as the question count, instead of specifying a 
    // positive number to limit the return
    //
    $.getJSON('/questions/next/0/', function (questions) {
        callback(questions);
    });
}

function addAnswer(answerText, callback) {
    $.post(
        '/questions/answers/', 
        { answerText: answerText },
        function (question) {
            callback(question);
        }
    );
}

function addQuestion(questionText, callback) {
    $.post(
        '/questions/next/',
        { questionText: questionText },
        function (question) {
            callback(question);
        }
    );
}

function upVoteAnswer(answerObjectId, callback) {
    $.post(
        '/questions/answers/upvote/' + answerObjectId,
        callback
    );
}

function downVoteAnswer(answerObjectId, callback) {
    $.post(
        '/questions/answers/downvote/' + answerObjectId,
        callback
    );
}


// ********************************************************
//                  initial load
// ********************************************************

function initialLoadActions() {
    populateCurrentQuestion();
    populateNextQuestions();
    
    $('#addAnswer').click(submitAnswer);
    $('#addQuestion').click(submitQuestion);
    $('.question').on('click', '.vote-button', answerVoted);
    
    // do an initial hide on this error
    //
    clearAnswerInputError();
    clearQuestionInputError();
}

function initiateCountdownTimer(secondsToKeepQuestionAlive) {
    var currentSecondsRemaining = secondsToKeepQuestionAlive;
    var minutes;
    var seconds;
   
    var timer =     
        setInterval(function () {
            minutes = parseInt(currentSecondsRemaining / 60, 10);
            seconds = parseInt(currentSecondsRemaining % 60, 10);
            seconds = seconds < 10 ? "0" + seconds : seconds;
            
            $('.countdown-timer').text(minutes + ':' + seconds);
            
            // if there aren't three answers displayed then the 
            // current answer set might not be complete so get the 
            // fresh question and add answers if available
            //
            if (countDisplayedAnswers() < 3) {
                getCurrentQuestion(function (question) {
                    insertFirstOrderedUnreviewedAnswer(question.answers);
                });
            }
            
            currentSecondsRemaining--;
            if (currentSecondsRemaining < 0) {
                // at this point we have come to the end of the 
                // current question and now need to cycle to the 
                // new question and handle other actions that 
                // are appropriate at this time
                //
                clearInterval(timer);
            }
        }, 1000);
}

function populateCurrentQuestion() {
    getCurrentQuestion(function (question) {
        setCurrentQuestion(question.text);
                
        if (question.answers === undefined || question.answers === null || question.answers.length === 0) {
            return;
        }
        // this will add currently three (3) answers to the display 
        // provided that there are three (3) valid answers that can 
        // and should be displayed
        //
        // three (3) answers has been chosen as a good cycling sample 
        // so that the user isn't shown too many for UX. When the user 
        // votes on answers (or [not implemented yet] dismisses answers) 
        // then different answers will show
        //
        else {
            var questionAskedDate = new Date(question.dateAsked);
            var nowDate = new Date();
            // seconds remaining is going to be this pseudocode algorithm
            // seconds-remaining = 7 minutes - (now - askedDate)
            var secondsRemainingForQuestion = (7 * 60) - ((nowDate - questionAskedDate) / 1000);
            
            initiateCountdownTimer(secondsRemainingForQuestion);
            
            sortAnswersByUpVotes(question.answers);
            insertFirstOrderedUnreviewedAnswer(question.answers);
            
            if (question.answers.length > 1) {
                // insert another high up vote answer
                //
                // the logic here is that the previously inserted 
                // answer into the GUI won't get re-inserted due to 
                // the check that it is already been reviewed, moving 
                // onto the next one
                //
                insertFirstOrderedUnreviewedAnswer(question.answers);
                
                // now if there are enough answers, sort the answers 
                // by down votes so that we show an "unpopular" 
                // answer
                //
                if (question.answers.length > 2) {
                    sortAnswersByDownVotes(question.answers);
                    insertFirstOrderedUnreviewedAnswer(question.answers);
                }
            }
        }
    });
}

function populateNextQuestions() {
    getNextQuestionCandidates(function (questions) {
        if (questions === undefined || questions === null || questions.length === 0) {
            return;
        }
        sortQuestionsByUpVotes(questions);
        
        // insert the first next question candidate
        //
        insertFirstOrderedUnreviewedQuestionCandidate(questions);
        if (questions.length > 1) {
            insertFirstOrderedUnreviewedQuestionCandidate(questions);
            if (questions.length > 2) {
                insertFirstOrderedUnreviewedQuestionCandidate(questions);
            }
        }
    });
}

function submitAnswer() {
    var answerText = getAnswerInputText();
    if (isSubmittedInputValid(answerText)) {
        // clear any error if it has it just in case
        //
        clearAnswerInputError();
        
        addAnswer(answerText, function (question) {
            setAnswerInputSuccess();
            setTimeout(clearAnswerInputSuccess, 5000);
        });
    }
    else {
        // answer submitted isn't valid
        //
        // we don't want to clear the input text in case 
        // the user just wants to append to what they 
        // already have
        //
        setAnswerInputError(answerText);
    }
}

function submitQuestion() {
    var questionText = getQuestionInputText();
    if (isSubmittedInputValid(questionText)) {
        clearQuestionInputError();
        
        // add the next candidate question
        //
        addQuestion(questionText, function (question) {
            setQuestionInputSuccess();
            setTimeout(clearQuestionInputSuccess, 5000);
        });
    }
    else {
        setQuestionInputError(questionText);
    }
}

$(function () {
    initialLoadActions();
});