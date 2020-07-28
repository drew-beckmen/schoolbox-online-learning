class Flashcard {
    
    constructor(data) {
        this.id = data.id 
        this.term = data.attributes.term 
        this.definition = data.attributes.definition
        this.lesson_id = data.attributes.lesson_id
        Flashcard.all.push(this)
    }

    static fetchById(id) {
        fetch(baseURL + `flashcards/${id}`)
        .then(resp => resp.json())
        .then(obj => { 
            let alreadyExists = Flashcard.all.find(card => card.id == obj.data.id)
            if (!!!alreadyExists) {new Flashcard(obj.data)}
        })
    }

    singleFlashcardEditForm() {
        // Creating Form For Each Flashcard 
        const formDiv = document.createElement("div")
        formDiv.className = "form-group"
        const newForm = document.createElement("form")
        newForm.id = `edit-flashcard-form-${this.id}`
        const termLabel = document.createElement("label")
        termLabel.innerText = "Term"
        const termInput = document.createElement("input")
        termInput.className = "form-control"
        termInput.value = this.term 
        const definitionLabel = document.createElement("label")
        definitionLabel.innerText = "Definition"
        const definitionInput = document.createElement("input")
        definitionInput.className = "form-control"
        definitionInput.value = this.definition 
        const submitButton = document.createElement("input")
        submitButton.type = "submit"
        submitButton.className = "form-control"
        newForm.append(termLabel, termInput, definitionLabel, definitionInput, submitButton)
        formDiv.append(newForm)
        main.append(formDiv)

        newForm.append(submitButton)
        newForm.addEventListener("submit", () => {
            event.preventDefault()
            const term = event.target[0].value 
            const definition = event.target[1].value 
            fetch(baseURL + `flashcards/${this.id}`, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json", 
                    Accept: "application/json"
                }, 
                body: JSON.stringify({
                    term, 
                    definition
                })
            })
            .then(resp => resp.json())
            .then(obj => {
                this.term = obj.data.attributes.term 
                this.definition = obj.data.attributes.definition 
                alert("Flashcard updated successfully")
            })
        })
    }

    static render(lesson_id) {
        //only include flashcards that belong to the current lesson
        const flashcardsToDisplay = Flashcard.all.filter(card => card.lesson_id == lesson_id)
        let currentCardIndex = 0

        const flashcardDiv = document.createElement("div")
        const flipButton = document.createElement("button")
        flipButton.id = "flip-flashcard"
        flipButton.innerText = "Flip"

        const backButton = document.createElement("button")
        backButton.id = "back-flashcard"
        backButton.disabled = true 
        backButton.innerText = "<<"

        const forwardButton = document.createElement("button")
        forwardButton.id = "forward-flashcard"
        if (flashcardsToDisplay.length <= 1 || flashcardsToDisplay.length == currentCardIndex - 1) {forwardButton.disabled = true}
        forwardButton.innerText = ">>"
        
        flipButton.addEventListener("click", () => {
            flashcardDiv.innerText === flashcardsToDisplay[currentCardIndex].term ? flashcardDiv.innerText = flashcardsToDisplay[currentCardIndex].definition : flashcardDiv.innerText = flashcardsToDisplay[currentCardIndex].term
        })

        forwardButton.addEventListener("click", () => {
            currentCardIndex++
            flashcardDiv.innerText = flashcardsToDisplay[currentCardIndex].term 
            backButton.disabled = false 
            if (currentCardIndex === flashcardsToDisplay.length - 1) {forwardButton.disabled = true}
            
        })

        backButton.addEventListener("click", () => {
            currentCardIndex--
            flashcardDiv.innerText = flashcardsToDisplay[currentCardIndex].term 
            forwardButton.disabled = false 
            if (currentCardIndex === 0) {backButton.disabled = true }
        })

        flashcardDiv.className = "flashcard"
        flashcardDiv.innerText = flashcardsToDisplay[currentCardIndex].term 
        main.append(flashcardDiv, backButton, forwardButton, flipButton)
    }

    static postNewFlashcard(lesson_id) {
        main.innerHTML = `
        <h1>Input a new flashcard:</h1>
        <div class="form-group">
        <form id="new-flashcard-form">
            <label>Term:</label> <input required="true" class="form-control" type='text'><br>
            <label>Definition: </label><input required="true" class="form-control" type='text'><br>
        </form>
        </div>`
        const submitButton = document.createElement("input")
        submitButton.type = "submit"
        submitButton.className = "form-control"
        const newForm = document.getElementById("new-flashcard-form")
        newForm.append(submitButton)

        //Allow user to return to lesson page
        const backButton = document.createElement("button")
        backButton.className = "btn btn-outline-info btn-lg"
        backButton.id = "back-to-lesson"
        backButton.innerText = "Return To Lesson Page"
        const currentLesson = Lesson.all.find(lesson => lesson.id === lesson_id)
        
        backButton.addEventListener("click", () => {
            currentLesson.individualLessonPage()
        })

        main.append(backButton)

        newForm.addEventListener("submit", () => {
            event.preventDefault()
            const term = event.target[0].value 
            const definition = event.target[1].value 
            
            //make POST request to save to database
            fetch(baseURL + "flashcards", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    Accept: "application/json"
                }, 
                body: JSON.stringify({
                    term, 
                    definition, 
                    lesson_id 
                })
            })
            .then(response => response.json())
            .then(obj => {
                currentLesson.flashcards.push(new Flashcard(obj.data))
                alert("New Flashcard Created! 🚀")
            })
            newForm.reset() 
        })
    }
    static quizMode(lesson_id) {
        flashcardState = false 
        main.innerHTML = `<h1>Welcome to Quiz Mode! Get Ready to Study!</h1>`
        let numCorrect = 0
        let numIncorrect = 0

        const resultsSection = document.createElement("div")
        resultsSection.id = "quiz-mode-results"
        const correctButton = document.createElement("button")
        correctButton.className = "btn btn-success"
        correctButton.innerText = "Correct ✔️"
        const incorrectButton = document.createElement("button")
        incorrectButton.className = "btn btn-danger"
        incorrectButton.innerText = "Incorrect 💥"
        const correctText = document.createElement("h3")
        correctText.innerHTML = `<br/>Correct: ${numCorrect}`
        const incorrectText = document.createElement("h3")
        incorrectText.innerHTML = `Incorrect: ${numIncorrect}`
        
        resultsSection.append(correctButton, incorrectButton, correctText, incorrectText)
        main.append(resultsSection)
        
        Flashcard.render(lesson_id)
        const forwardButton = document.getElementById("forward-flashcard")
        document.getElementById("back-flashcard").remove()
        forwardButton.style.visibility = "hidden"

        correctButton.addEventListener("click", () => {
            numCorrect++ 
            correctText.innerHTML = `<br/>Correct: ${numCorrect}`
            showResults()
        })

        incorrectButton.addEventListener("click", () => {
            numIncorrect++
            incorrectText.innerHTML = `Incorrect: ${numIncorrect}`
            showResults()
        })

        let showResults = function() {
            if (forwardButton.disabled === true) {
                resultsSection.innerHTML = `<h3>Results: ${Math.round((numCorrect / (numCorrect + numIncorrect)) * 100)}%</h3>`
                const resetButton = document.createElement("button")
                resetButton.innerText = "Reset"
                resetButton.className = "btn btn-warning btn-block"

                //Allow user to return to lesson page
                const backButton = document.createElement("button")
                backButton.className = "btn btn-primary btn-block"
                backButton.id = "back-to-lesson"
                backButton.innerText = "Return To Lesson Page"
                const currentLesson = Lesson.all.find(lesson => lesson.id === lesson_id)
                
                backButton.addEventListener("click", () => {
                    flashcardState = false 
                    currentLesson.individualLessonPage()
                })

                resultsSection.append(resetButton, backButton)
                resetButton.addEventListener("click", () => {
                    Flashcard.quizMode(lesson_id)
                })
            }
            else {
                forwardButton.click()                         
            }
        }
    }

    static testMode(lesson_id) {
        main.innerHTML = `<h1>Welcome to Test Mode! Now is your chance to show off your skills!</h1>
        <h3>The definition will be displayed. It is your responsibility to enter the corresponding term.</h3>` 
        
        let numCorrect = 0
        let numIncorrect = 0
        const resultsSection = document.createElement("div")
        resultsSection.id = "quiz-mode-results"
        const correctText = document.createElement("h3")
        correctText.innerHTML = `Correct: ${numCorrect}`
        const incorrectText = document.createElement("h3")
        incorrectText.innerHTML = `Incorrect: ${numIncorrect}`
        
        resultsSection.append(correctText, incorrectText)
        main.append(resultsSection)

        Flashcard.render(lesson_id)

        const forwardButton = document.getElementById("forward-flashcard")
        document.getElementById("back-flashcard").remove()
        forwardButton.style.visibility = "hidden"
        const flipButton = document.getElementById("flip-flashcard")
        flipButton.style.visibility = "hidden"
        flipButton.click()

        //create the form to enter a term: 
        const termForm = document.createElement("form")

        termForm.innerHTML = `<div id="test-form" class="form-group"><label>Enter the Term:</label><input class="form-control" type=text></div>`
        const submitButton = document.createElement("input")
        submitButton.id = "flashcard-submit"
        submitButton.type = "submit"
        submitButton.className = "form-control"

        termForm.addEventListener("submit", () => {
            event.preventDefault()
            flipButton.click()
            const currentTerm = document.getElementsByClassName("flashcard")[0].innerText
            
            //remove previous wrong answer messages 
            if (termForm.children[0].tagName === "P") {
                termForm.children[0].remove()
            }
            const text = document.createElement("p")
            
            if (currentTerm === event.target[0].value) {
                numCorrect++ 
                text.innerText = "Correct!"
                text.style.color = "green"
                correctText.innerHTML = `Correct: ${numCorrect}`
            }
            else {
                numIncorrect++ 
                //add new wrong answer messages 
                text.innerText = `Your previous answer was incorrect 🚫. Your answer: ${event.target[0].value} vs. Correct Answer: ${currentTerm}`
                text.style.color = "red"
                incorrectText.innerHTML = `Incorrect: ${numIncorrect}`
            }
            termForm.prepend(text)
            termForm.reset()
            testResults() 
        })

        termForm.append(submitButton)
        main.append(termForm)

        let testResults = function() {
            if (forwardButton.disabled === true) {
                resultsSection.innerHTML = `<br><h3>Results: ${Math.round((numCorrect / (numCorrect + numIncorrect)) * 100)}%</h3>`
                const resetButton = document.createElement("button")
                resetButton.innerText = "Reset"
                resetButton.className = "btn btn-warning btn-block"
                document.getElementById("test-form").remove()
                document.getElementById("flashcard-submit").remove()
                
                //Allow user to return to lesson page
                const backButton = document.createElement("button")
                backButton.className = "btn btn-primary btn-block"
                backButton.id = "back-to-lesson"
                backButton.innerText = "Return To Lesson Page"
                const currentLesson = Lesson.all.find(lesson => lesson.id === lesson_id)
                
                backButton.addEventListener("click", () => {
                    flashcardState = false 
                    currentLesson.individualLessonPage()
                })

                resultsSection.append(resetButton, backButton)
                resetButton.addEventListener("click", () => {
                    Flashcard.testMode(lesson_id)
                })
            }
            else {
                forwardButton.click() 
                flipButton.click()                         
            }
        }
    }
}

Flashcard.all = [];