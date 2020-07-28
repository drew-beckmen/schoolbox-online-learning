class Enrollment {
    constructor(id, data, relationships) {
        this.id = id 
        this.link = data.link 
        this.user_id = data.user_id
        this.course_id = data.course_id
        this.lessons = relationships.lessons.data 
        Enrollment.all.push(this);
    }

    static createNewCourse() {
        main.innerHTML = ""
        main.innerHTML = `
        <h1>Input a new course. Start learning!</h1>
        <div class="form-group">
        <form id="new-course-form">
            <label>Course Title:</label> <input class="form-control" required="true" type='text'><br>
            <label>Course Description: </label><input required="true" class="form-control" type='text'><br>
            <label>Course Link: </label> <input required="true" class="form-control" type='text'><br>
            <label>Choose an existing platform or enter a new one: </label>
        </form>
        </div>`
        const newForm = document.getElementById("new-course-form")
        const platforms = document.createElement("select")
        platforms.className = "form-control"
        Platform.all.forEach(platform => {
            const option = document.createElement("option")
            option.id = platform.id 
            option.innerText = platform.name 
            platforms.append(option)
        })
        newForm.append(platforms)
        //option to create a new platform. 
        newForm.innerHTML += `
            <br><label>New Platform: </br><input class="form-control" type='text' id='new-platform'><br>
        `
        const submitButton = document.createElement("input")
        submitButton.type = "submit"
        submitButton.className = "form-control"

        newForm.addEventListener("submit", async function() {
            event.preventDefault()
            const courseTitle = event.target[0].value 
            const courseDescription = event.target[1].value 
            const link = event.target[2].value 
            const newPlatform = event.target[4].value 
            let platform_id; 
            let course_id; 
            if (newPlatform.length > 0) {
                let x = await Platform.postNewPlatform(newPlatform)
                platform_id = Platform.all[Platform.all.length - 1].id 
            }
            else {
                platform_id = event.target[3].options[event.target[3].selectedIndex].id;
            }
            course_id = await Course.postNewCourse(courseTitle, courseDescription, platform_id)
            let newEnrollment = await Enrollment.postNewEnrollment(link, user_id, course_id)
            newForm.reset()
            document.getElementById("all-courses").click()
        })

        newForm.append(submitButton)
    }

    static postNewEnrollment(link, user_id, course_id) {
        return fetch(baseURL + "enrollments", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                Accept: "application/json"
            }, 
            body: JSON.stringify({
                link, 
                user_id, 
                course_id  
            })
        })
        .then(resp => resp.json())
        .then(obj => {
            new Enrollment(obj.data.id, obj.data.attributes, obj.data.relationships)
        })
    }

    async render() {
        let {title, description, platform_id} = await Course.fetchById(this.course_id)
        let {name} = await Platform.fetchById(platform_id)
        const course = document.createElement("div")
        course.style = "border-radius: 15px 30px; background-color: #549ad6"
        course.id = this.id
        course.className = "list-courses" 
        const h3 = document.createElement("h3")
        h3.innerText = ` 🏫 Course: ${title}`
        const desc = document.createElement("h5")
        desc.innerText = `Description: ${description}`
        const platform = document.createElement("h5")
        platform.innerText = `Platform: ${name}`
        course.append(h3, desc, platform)
        course.addEventListener("click", () => {
            this.individualCoursePage()
        })

        main.append(course)
    }

    addLesson() {
        main.innerHTML = ""
        main.innerHTML = `
        <h1>What are you learning?</h1>
        <div class="form-group">
        <form id="new-lesson-form">
            <label>Lesson Title:</label> <input class="form-control" type='text'><br>
            <label>Lesson Description: </label><input class="form-control" type='text'><br>
        </form>
        </div>`
        const newForm = document.getElementById("new-lesson-form")
        const submitButton = document.createElement("input")
        submitButton.type = "submit"
        submitButton.value = "Create Lesson"
        submitButton.className = "form-control"

        newForm.addEventListener("submit", () => {
            event.preventDefault()
            const title = event.target[0].value 
            const description = event.target[1].value 
            Lesson.postNewLesson(title, description, this.id) 
        })

        newForm.append(submitButton)
    }


    async individualCoursePage() {
        main.innerHTML = ""
        const currentCourse = Enrollment.all.find(e => e.id === this.id)
        let currentLessonIds = currentCourse.lessons.map(lesson => lesson.id) 
        let {title, description, platform_id} = await Course.fetchById(currentCourse.course_id)
        let {name} = await Platform.fetchById(platform_id)
        // debugger 
        //Need to format the individual course show page: 
        const h1 = document.createElement("h1")
        h1.innerText = `${title}: ${description}`
        const h3 = document.createElement("h3")
        h3.innerText = `Your are enrolled on: ${name}`
        
        //create button to link out to the course page
        const courseLink = document.createElement("a")
        courseLink.className = "btn btn-outline-info btn-lg"
        courseLink.href = `${this.link}`
        courseLink.role = "button"
        courseLink.target = "_blank"
        courseLink.innerText = "Go to Course Page"

        //create button to add lesson to this enrollment: 
        const newLesson = document.createElement("button")
        newLesson.className = "btn btn-outline-info btn-lg"
        newLesson.innerText = "Start a new lesson"

        //create a button to delete this course:
        const deleteCourse = document.createElement("button")
        deleteCourse.className = "btn btn-outline-info btn-lg"
        deleteCourse.innerText = "Delete this course"


        //create a button to see recommended texts:
        const recommendations = document.createElement("button")
        recommendations.className = "btn btn-outline-info btn-lg"
        recommendations.innerText = "Recommended Texts"

        recommendations.addEventListener("click", () => {
            this.displayRecommendedTexts()
        })

        deleteCourse.addEventListener("click", () => {
            this.deleteCourse()
        })

        newLesson.addEventListener("click", () => {
            this.addLesson()
        })

        const lessonHeader = document.createElement("h3")
        lessonHeader.id = "lessons-header"
        lessonHeader.innerHTML = `<strong>Lessons:</strong>`
        
        const listLessons = document.createElement("div")
        listLessons.className = "lessons"
        
        let addLessons = async function() {
            listLessons.innerHTML = ""
            for (let itm of currentLessonIds) {
            //returns instance of Lesson class (gets added to Lesson.all)
            let currentLesson = await Lesson.fetchById(itm) 
            let {name, description, date} = currentLesson 
            const singleLesson = document.createElement("div")
            singleLesson.style = "border-radius: 15px 30px; background-color: #549ad6"
            singleLesson.id = itm 
            singleLesson.innerHTML = `
                <h3>📖${name}</h3> 
                <h5>${description}</h5>
                <h5>Created: ${date}</h5>`

            //create event listener for when you click on a lesson
            singleLesson.addEventListener("click", function() {
                currentLesson.individualLessonPage()
            })
            listLessons.append(singleLesson)
            }
        }
        main.append(h1, h3, courseLink, newLesson, deleteCourse, recommendations, lessonHeader)
        
        //Create checkbox to toggle order of lessons 
        // -----------------------------------------
        const toggle = document.createElement("div")
        toggle.classList.add("custom-control", "custom-switch")
        toggle.id = "toggle-lessons"
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.className = "custom-control-input"
        checkbox.id = "customSwitch1"
        const label = document.createElement("label")
        label.className = "custom-control-label"
        label.setAttribute("for", "customSwitch1")
        label.innerText = "See Lessons by Newest First"
        toggle.append(checkbox, label)

        toggle.addEventListener("change", () => {
            currentLessonIds = currentLessonIds.reverse() 
            addLessons()
        })
        //-----------------------------------------------------------------
        addLessons()
        main.append(toggle, listLessons)
    }


    addBook(data) {
        let {title, authors, description, previewLink} = data.volumeInfo 
        let thumbnail = data.volumeInfo.imageLinks.thumbnail
        const bookDiv = document.createElement("div")
        bookDiv.className = "book-div"
        bookDiv.style = "border-radius: 15px 30px; background-color: #549ad6"

        const image = document.createElement("img")
        image.src = thumbnail
        const bookTitle = document.createElement("h2")
        bookTitle.innerText = title
        const listAuthors = document.createElement("h4")
        listAuthors.innerText = authors 
        const bookDescription = document.createElement("p")
        if (!description) {
            bookDescription.innerText = "No Description Provided"
        }
        else {
            bookDescription.innerText = description
        }    
        image.className = "body-image"
        image.align = "left"
        bookTitle.className = "book-info"
        listAuthors.className = "book-info"
        bookDescription.className = "book-info"

        bookDiv.addEventListener("click", () => {
            window.open(previewLink, '_blank')
        })

        bookDiv.append(image, bookTitle, listAuthors, bookDescription) 
        main.append(bookDiv)
    }


    async displayRecommendedTexts() {
        let {title} = await Course.fetchById(this.course_id)
        const queryTitle = title.replace(/\s/g, '').toLowerCase()
        main.innerHTML = ""
        const h1 = document.createElement("h1")
        h1.innerText = `Recommended Texts for Your Course on ${title}`
        const h3 = document.createElement("h3")
        h3.innerText = "Click on a book to read a preview and purchase!"

        //go back to course page
        const backToCourse = document.createElement("button")
        backToCourse.className = "btn btn-outline-info btn-lg"
        backToCourse.innerText = "Return to Course"

        backToCourse.addEventListener("click", () => {
            this.individualCoursePage()
        })

        main.append(h1, h3, backToCourse)
        
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${queryTitle}&maxResults=10`)
        .then(response => response.json())
        .then(obj => obj.items.forEach(book => this.addBook(book)))
    }



    deleteCourse() {
        //remove the instance from local storage. 
        Enrollment.all = Enrollment.all.filter(e => e.id != this.id)
        fetch(baseURL + `enrollments/${this.id}`, {
            method: "DELETE"
        })
        .then(resp => {
            alert("Course Deleted Successfully")
            document.getElementById("all-courses").click()
        })
    }
}
Enrollment.all = [];