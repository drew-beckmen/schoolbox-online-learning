class Lesson {

    constructor(data) { 
        this.id = data.id 
        this.name = data.attributes.name 
        this.description = data.attributes.description 
        this.notes = data.attributes.notes 
        this.flashcards = data.relationships.flashcards.data 
        this.date = data.attributes.created_at.split("T")[0] 
        Lesson.all.push(this);
    }

    static fetchById(id) {
        return fetch(baseURL + `lessons/${id}`)
        .then(resp => resp.json())
        .then(obj => new Lesson(obj.data))
    }

    setNotes(notes) {
        fetch(baseURL + `lessons/${this.id}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json", 
                Accept: "application/json"
            }, 
            body: JSON.stringify({
                notes 
            })
        })
        .then(resp => resp.json())
        .then(obj => {
            this.notes = obj.data.attributes.notes
            alert("Notes Saved Successfully!")
            // debugger 
            document.getElementById("editor").remove()//.style.visibility = "hidden"
            document.getElementsByClassName("ql-toolbar ql-snow")[0].remove()//.style.visibility = "hidden"
            // document.getElementById("save-content").remove()
            document.getElementById("edit-notes").style.visibility = "visible"
            document.getElementById("note-content").innerHTML = obj.data.attributes.notes
        })
    }

    individualLessonPage() {
        //Next Step: Implement Individual Lesson Show Page
        main.innerHTML = ""
        const singleLesson = document.createElement("div")
        singleLesson.id = this.id 
        const lessonTitle = document.createElement("h1")
        lessonTitle.innerText = this.name 
        const lessonDescription = document.createElement("h2")
        lessonDescription.innerHTML = `<em>${this.description}</em>`
        const lessonNotes = document.createElement("h2")
        lessonNotes.innerText = "Lesson Notes"
        const noteContent = document.createElement("p")
        noteContent.id = "note-content"
        noteContent.innerHTML = this.notes 
        singleLesson.append(lessonTitle, lessonDescription, lessonNotes, noteContent)
        main.append(singleLesson)

        //Edit Notes Button to Add Quill.JS to the DOM
        const editNotes = document.createElement("button")
        editNotes.className = "btn btn-outline-info btn-sm"
        editNotes.innerText = "Edit Notes"
        editNotes.id = "edit-notes"
        editNotes.addEventListener("click", () => {
            //-------Add Quill.JS Editor to the DOM------------
            const textEditor = document.createElement("div")
            textEditor.id = "editor"
            main.append(textEditor)
            const editor = document.getElementById("editor")
            const quill = new Quill(editor, {
                placeholder: 'Compose a new note', 
                theme: 'snow'
            })
            //populate with notes you previously took
            if (this.notes.length > 0) quill.root.innerHTML = this.notes
            editNotes.style.visibility = "hidden";  
            //------------------------------------------------
            const saveDelta = document.createElement("button")
            saveDelta.id = "save-content"
            saveDelta.className = "btn btn-outline-info btn-sm"
            saveDelta.innerText = "Save Note"
            //Event Listening for Submitting Notes:
            saveDelta.addEventListener("click", () => {
                const newNotes = quill.root.innerHTML
                this.setNotes(newNotes)
            })
            textEditor.append(saveDelta)
        })
        main.append(editNotes)
    } 
}
Lesson.all = [];
