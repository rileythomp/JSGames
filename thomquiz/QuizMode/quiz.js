$(document).ready(function () {

    var category;
    var difficulty;
    var countDown;
    var newBestPercentage = false;
    var newMostCorrect = false;

    // Displays quiz questions
    let buildQuiz = function (questionData) {
        var len = questionData.length
        for (i = 0; i < len; ++i) {
            var question = questionData[i]
            $('#quiz').append('<tr class="quizQuestion" id="'+question.correct_answer+'"><td>'+question.question+'</td><td><input></td><td></td><td></td></tr>')
        }
        return quiz
    }

    // Checks if answer is correct
    let isCorrect = function (correctAnswer, userAnswer) {
        if (correctAnswer == userAnswer || (isNaN(correctAnswer) && correctAnswer.length > 6 && levenshtein(correctAnswer, userAnswer) < 2)) {
            return true
        } else {
            return false
        }
    }

    // Checks if best percentage or most correct record has been beaten, updates records if they have been beaten
    let updateQuizStats = function (categoryId, difficulty, percentage, correct) {
        if (!localStorage.getItem('bestPercentage') || percentage > JSON.parse(localStorage.getItem('bestPercentage')).percentage) {
            var bestPercentageObj = {percentage: percentage, category: getCategory(categoryId), difficulty: difficulty}
            localStorage.setItem('bestPercentage',  JSON.stringify(bestPercentageObj))
            $('#currentScore').css('color', 'green')
            $('#newBestPercentage').show()
            newBestPercentage = true;
        }
        if (!localStorage.getItem('mostCorrect') || correct > JSON.parse(localStorage.getItem('mostCorrect')).correct) {
            var mostCorrectObj = {correct: correct, category: getCategory(categoryId), difficulty: difficulty}
            localStorage.setItem('mostCorrect',  JSON.stringify(mostCorrectObj))
            $('#currentScore').css('color', 'green')
            $('#newMostCorrect').show()
            newMostCorrect = true;
        }
    }

    // Displays score when game is over or when user answers question
    let updateScore = function (fromquizOver) {
        var incorrect = 0
        var total = $('.quizQuestion').length 
        $('.quizQuestion').each(function () {
            if (!$(this).children(':nth-child(3)').find('i').hasClass('fa-check')) {
                if (fromquizOver) {
                    $(this).children(':nth-child(3)').html('<i class="fa fa-times"></i>')
                    $(this).children(':nth-child(4)').html($(this).attr('id'))
                }
                incorrect += 1
            }
        })
        correct = total-incorrect
        var percentage = Math.round(100*correct/total)
        if (fromquizOver) {
            $('#finalScore').html('You answered ' +correct+'/'+total+' correctly, ('+percentage+'%)')
        } else {
            $('#currentScore').html(correct+'/'+total)
        }
        updateQuizStats(category ? category : $('#categorySelected').val(), 
                        difficulty ? difficulty : $('#difficultySelected').val(), percentage, correct)
    }

    // Ends timer and displays game summary
    let quizOver = function () {
        $('#timer, #currentScore').empty()
        $('#giveUp, input').prop('disabled', true)
        clearInterval(countDown)
        countDown = 0
        updateScore(true)
        $('html, body').animate({ scrollTop: $(document).height() }, "slow");
    }

    // Fisher-Yates shuffle from https://bost.ocks.org/mike/shuffle/
    // Used to display questions in different order
    let shuffle = function(array) {
        var m = array.length, t, i;
        while (m) {
          i = Math.floor(Math.random() * m--);
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
        return array;
      }

    // Retrieves quiz questions, starts timer and performs quiz logic
    let quiz = function (numQuestions, category, difficulty) {
        $.getJSON(urlBuilder(numQuestions, category, difficulty, 'any'), function(data) {
            if (!data.response_code) {
                $('#quizBody').prepend(buildQuiz(shuffle(data.results)))
                $('#giveUp').prop('disabled', false).show()
                $('#timer').css({'color': 'black', 'font-weight': 'normal'})
                var time = 12 * numQuestions
                countDown = setInterval(function () {
                    time--;
                    var minutes = Math.floor(time/60)
                    var seconds = ('0' + time%60).slice(-2);
                    $('#timer').html(''+minutes+':'+seconds+'')
                    if (time < 11) {
                        $('#timer').css({'color': 'red', 'font-weight': 'bold'});
                    }
                    if (time <= 0) {
                        $('#incorrectMessage').html('Times up').show()
                        quizOver()
                    }
                }, 1000)
                $('input').on('keyup', function () {
                    var correctAnswer = $(this).closest('tr').attr('id').replace(/\s/g,'').toLowerCase() + " " 
                    var userAnswer = $(this).val().replace(/\s/g,'').toLowerCase() + " "
                    if (isCorrect(correctAnswer, userAnswer)) {
                        $(this).closest('td').next('td').html('<i class="fa fa-check"></i>')
                        updateScore(false)
                    } else if (!$(this).closest('td').next('td').is(':empty')) {
                        $(this).closest('td').next('td').html('')
                        updateScore(false)
                    }
                })
            } else {
                $('#incorrectMessage').html('Error finding questions, please try again.').show()
            }
        }); 
    }

    // Starts quiz after clicking on start quiz
    $('#start').on('click', function () {
        newMostCorrect = false;
        newBestPercentage = false;
        $('#incorrectMessage, #newBestPercentage, #newMostCorrect').hide()
        $('#currentScore').css('color', 'black')
        $('#quiz').find("tr:gt(0)").remove();
        $.each([$('#finalScore'), $('#currentScore'), $('#timer')], function() {
            if (!this.is(':empty')) {
                $(this).html('')
            }
        })
        if (countDown) {
            clearInterval(countDown)
        }
        category = $('#categorySelected').val()
        difficulty = $('#difficultySelected').val()
        if (category != 'any') {
            var url = 'https://opentdb.com/api_count.php?category='+category+''
            $.getJSON(url, function(data) {
                var numAny = data.category_question_count.total_question_count
                var numEasy = data.category_question_count.total_easy_question_count
                var numMedium = data.category_question_count.total_medium_question_count
                var numHard = data.category_question_count.total_hard_question_count
                var numQuestions;
                if (difficulty == 'any' && numAny < 25) {
                    numQuestions =  numAny
                } 
                else if (difficulty == 'easy' && numEasy < 25) {
                    numQuestions = numEasy
                }
                else if (difficulty == 'medium' && numMedium < 25) {
                    numQuestions = numMedium
                }
                else if (difficulty == 'hard' && numHard < 25) {
                    numQuestions = numHard
                } else {
                    numQuestions = 25
                }
                quiz(numQuestions, category, difficulty)  
            });
        } else {
            quiz(25, 'any', difficulty)
        }
    })

    // Ends quiz after clicking give up button
    $('#giveUp').on('click', function () {
        quizOver()
    })

    // Displays timer and score as user moves up and down quiz
    $(window).scroll(function() {
        var scrollPercent = 100 * $(window).scrollTop()/($(document).height() - $(window).height());
        $('#timer, #currentScore').css('top', (scrollPercent*0.90)+"%"  );
        $('#currentScore').css('top', '+=1.5em');
    });

 });

document.getElementById('home').onclick = function () {
    location.href = '../index.html';
};

// Updates stats when player closes or refreshes page
 window.onbeforeunload = function(event) {
    updateTriviaStats(category ? category : $('#categorySelected').val(), 
                      difficulty ? difficulty : $('#difficultySelected').val())
    return null;
};
