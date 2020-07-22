const main = document.getElementById("main-content")
const baseURL = "http://localhost:3000/api/v1/"
const allCourses = document.getElementById("all-courses")

allCourses.addEventListener("click", () => {
    main.innerHTML = ""
    const h1 = document.createElement("h1")
    h1.innerText = "Your Courses: Click One to Get Started "
    main.append(h1)
    loadUserCourses(1) //TODO: come back and change this when do user login
})

function addCourses(enrollment_ids) {
    enrollment_ids.forEach(id => addCourse(id))
}

function addCourse(id) {
    fetch(baseURL + `enrollments/${id}`)
    .then(resp => resp.json())
    .then(obj =>{
        let e = new Enrollment(obj.data.id, obj.data.attributes, obj.data.relationships)
        e.render() //add it to the DOM
    })
}

function loadUserCourses(id) {
    fetch(baseURL + `users/${id}`)
    .then(resp => resp.json())
    .then(obj => addCourses(obj.data.relationships.enrollments.data.map(itm => itm.id)))
}


