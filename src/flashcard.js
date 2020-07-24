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
}

Flashcard.all = [];