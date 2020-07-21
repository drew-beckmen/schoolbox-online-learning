const main = document.getElementById("main-content")
const baseURL = "http://localhost:3000/api/v1/"

class Enrollment {
    constructor(id, data) {
        this.id = id 
        this.link = data.link 
        this.user_id = data.user_id
        this.course_id = data.course_id
    }

    async render() {
        let {title, description, platform_id} = await Course.fetchById(this.course_id)
        let {name} = await Platform.fetchById(platform_id)
        const course = document.createElement("div")
        const h3 = document.createElement("h3")
        h3.innerText = ` 🏫 Course: ${title}`
        const desc = document.createElement("h5")
        desc.innerText = `Description: ${description}`
        const platform = document.createElement("h5")
        platform.innerText = `Platform: ${name}`
        const btn = document.createElement("button")
        btn.id = this.id 
        btn.innerText = "View Course"
        btn.className = "btn btn-outline-info"
        course.append(h3, desc, platform, btn)
        main.append(course)
    }
}

class Course {
    static fetchById(id) {
        return fetch(baseURL + `courses/${id}`)
        .then(resp => resp.json())
        .then(obj => obj.data.attributes)
    }
}

class Platform {
    static fetchById(id) {
        return fetch(baseURL + `platforms/${id}`)
        .then(resp => resp.json())
        .then(obj => obj.data.attributes)
    }
}



function addCourses(enrollment_ids) {
    enrollment_ids.forEach(id => addCourse(id))
}

function addCourse(id) {
    fetch(baseURL + `enrollments/${id}`)
    .then(resp => resp.json())
    .then(obj =>{
        let e = new Enrollment(obj.data.id, obj.data.attributes)
        e.render() //add it to the DOM
    })
}

function loadUserCourses(id) {
    fetch(baseURL + `users/${id}`)
    .then(resp => resp.json())
    .then(obj => addCourses(obj.data.relationships.enrollments.data.map(itm => itm.id)))
}

loadUserCourses(1)
