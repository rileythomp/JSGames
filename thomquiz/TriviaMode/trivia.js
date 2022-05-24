$(document).ready(function(){
    
    var category;
    var difficulty;
    var correctAnswer;
    var score = 0;
    var streak = 0;
    var longestStreak = 0;
    var newHighScore = false;
    var newLongestStreak = false;

    // Displays answers
    let setOptions = function (correct, wrong, type) {
        if (type == 'multiple') {
            $($('.option')[Math.floor(Math.random()*4)]).html(correct)
            var len = wrong.length
            for (i = 0; i < len; ++i) {
                $('.option').each(function() {
                    if ($(this).is(':empty')) {
                        $(this).html(wrong[i])
                        return false
                    }
                })
            }
        } else { 
            $('#option2').html('True')
            $('#option3').html('False')
        }
    }

    // Retrieves question data and displays new question
    let newQuestion = function () {
        $('.option, #question').html('')
        category = $('#categorySelected').val()
        difficulty = $('#difficultySelected').val()
        var type = $('#typeSelected').val()
        $.getJSON(urlBuilder(1, category, difficulty, type), function(data) {
            $('#incorrectMessage').hide()
            if (!data.response_code) {
                var questionData = data.results[0]
                $('#question').html(questionData.question)
                correctAnswer = questionData.correct_answer
                setOptions(correctAnswer,questionData.incorrect_answers, questionData.type)
            } else {
                $('#incorrectMessage').html('Error finding a question, please try again.').show()
            }
        });
    }

    // Checks if high score or longest streak record has been beaten, updates records if they have been beaten
    let updateTriviaStats = function (categoryId, difficulty) {
        if (!localStorage.getItem('highScore') || score > JSON.parse(localStorage.getItem('highScore')).score) {
            var highScoreObj = {score: score, category: getCategory(categoryId), difficulty: difficulty}
            localStorage.setItem('highScore', JSON.stringify(highScoreObj))
            $('#scoreTitle').css('color', 'green')
            newHighScore = true;
        }
        if (!localStorage.getItem('longestStreak') || longestStreak > JSON.parse(localStorage.getItem('longestStreak')).streak) {
            var longestStreakObj = {streak: longestStreak, category: getCategory(categoryId), difficulty: difficulty}
            localStorage.setItem('longestStreak', JSON.stringify(longestStreakObj))
            $('#longestStreakTitle').css('color', 'green')
            newLongestStreak = true;
        }
    }

    // Resets streak and display new question after clicking new question 
    $('#newQuestion').on('click', function () {
        streak = 0
        $('#streak').html(streak)
        newQuestion()
    })

    // Updates page after clicking answer
    $('.option').on('click', function () {
        if (streak > longestStreak) {longestStreak = streak}
        if ($(this).html() == correctAnswer) {
            $('#incorrectMessage').hide()
            score += 1;
            streak += 1
            if (streak > longestStreak) {longestStreak = streak}
            updateTriviaStats(category ? category : $('#categorySelected').val(), 
                          difficulty ? difficulty : $('#difficultySelected').val())
            if (newLongestStreak) {$('#newLongestStreakMessage').show()}
            if (newHighScore) {$('#newHighScoreMessage').show()}
            $('#score').html(score)
            $('#streak').html(streak)
            $('#longestStreak').html(longestStreak)
            newQuestion()
        } else {
            $('#incorrectMessage').html('Incorrect, try again!').show()
            streak = 0
            $('#streak').html(streak)
        }
    }) 

    // Resets everything after clicking new game
    $('#newGame').on('click', function () {
        updateTriviaStats(category ? category : $('#categorySelected').val(), 
                          difficulty ? difficulty : $('#difficultySelected').val())
        score = 0
        $('#score').html(score)
        streak = 0
        $('#streak').html(streak)
        longestStreak = 0
        $('#longestStreak').html(longestStreak)
        newLongestStreak = false;
        newHighScore = false;
        $('#longestStreakTitle, #scoreTitle').css('color', 'black')
        $('.option, #category, #difficulty, #question, #incorrectMessage').html('')
        $('#newLongestStreakMessage, #newHighScoreMessage').hide()
        $("#categorySelected, #difficultySelected, #typeSelected").val("any");
    })
    
 });

document.getElementById('home').onclick = function () {
    location.href = '../index.html';
};

// Update stats when player closes page
 window.onbeforeunload = function(event) {
    updateTriviaStats(category ? category : $('#categorySelected').val(), 
                      difficulty ? difficulty : $('#difficultySelected').val())
    return null;
};