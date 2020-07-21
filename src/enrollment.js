
class Enrollment {
    constructor(id, data, relationships) {
        this.id = id 
        this.link = data.link 
        this.user_id = data.user_id
        this.course_id = data.course_id
        this.lessons = relationships.lessons.data 
        Enrollment.all.push(this);
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


    async individualCoursePage() {
        main.innerHTML = ""
        const currentCourse = Enrollment.all.find(e => e.id === this.id)
        const currentLessonIds = currentCourse.lessons.map(lesson => lesson.id) 
        let {title, description, platform_id} = await Course.fetchById(currentCourse.course_id)
        let {name} = await Platform.fetchById(platform_id)
    
        //Need to format the individual course show page: 
        const h1 = document.createElement("h1")
        h1.innerText = `${title}: ${description}`
        const h3 = document.createElement("h3")
        h3.innerText = `Your are enrolled on: ${name}` 
        const listLessons = document.createElement("div")
        listLessons.className = "lessons"
    
        listLessons.innerHTML = `<h3><strong>Lessons:</strong></h3>`
        const ol = document.createElement("ol")
        for (let itm of currentLessonIds) {
            let {name, description, notes} = await Lesson.fetchById(itm)
            const li = document.createElement("li")
            li.innerText = `${name}: ${description}, Notes: ${notes}`
            ol.append(li)
        }
        listLessons.append(ol)
        main.append(h1, h3, listLessons)
    }
}
Enrollment.all = [];