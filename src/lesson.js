class Lesson {

    constructor(data) { 
        this.id = data.id 
        this.name = data.attributes.name 
        this.description = data.attributes.description 
        this.notes = data.attributes.notes 
        this.enrollment_id = data.attributes.enrollment_id
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
            document.getElementById("editor").remove()//.style.visibility = "hidden"
            document.getElementsByClassName("ql-toolbar ql-snow")[0].remove()//.style.visibility = "hidden"
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
        
        //Create a button to go back to the course show page
        const backButton = document.createElement("button")
        const lessonsCourse = Enrollment.all.find(course => course.id == this.enrollment_id)
        backButton.className = "btn btn-outline-info btn-lg"
        backButton.innerText = "Back to Course"   
        backButton.id = "course-page"     
        backButton.addEventListener("click", () => {
            lessonsCourse.individualCoursePage()
        }) 

        //Create a button to delete a lesson 
        const deleteLesson = document.createElement("button")
        deleteLesson.className = "btn btn-outline-info btn-lg"
        deleteLesson.innerText = "Delete This Lesson"
        deleteLesson.addEventListener("click", () => {
            this.removeLesson()
        })


        //------------------------------------------------
        lessonNotes.innerText = "Lesson Notes"
        const noteContent = document.createElement("p")
        noteContent.id = "note-content"
        noteContent.innerHTML = this.notes 
        singleLesson.append(lessonTitle, lessonDescription, backButton, deleteLesson, lessonNotes, noteContent)
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

    static postNewLesson(name, description, enrollment_id) {
        fetch(baseURL + "lessons", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                Accept: "application/json"
            },
            body: JSON.stringify({
                name,
                description, 
                notes: "", 
                enrollment_id
            })
        })
        .then(response => response.json())
        .then(obj => {
            let createdLesson = new Lesson(obj.data)
            //need to add it to enrollments list of lessons 
            let currentEnrollmentInstance = Enrollment.all.find(itm => itm.id === enrollment_id)
            currentEnrollmentInstance.lessons.push(createdLesson)
            
            createdLesson.individualLessonPage()
        })
    }

    removeLesson() {
        Lesson.all = Lesson.all.filter(lesson => lesson.id != this.id)
        debugger
        fetch(baseURL + `lessons/${this.id}`, {
            method: "DELETE"
        })
        .then(resp => {
            alert("Lesson Deleted Successfully")
            //need to get rid of the lesson in Enrollment's array
            console.log(this)
            const currentEnrollmentInstance = Enrollment.all.find(itm => itm.id == this.enrollment_id)
            currentEnrollmentInstance.lessons = currentEnrollmentInstance.lessons.filter(lesson => lesson.id !== this.id)
            debugger 
            currentEnrollmentInstance.individualCoursePage()
        })
    }
}
Lesson.all = [];
