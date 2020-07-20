const ul = document.querySelector("ul#courses")
const baseURL = "http://localhost:3000/api/v1/"

function addCourses(enrollment_ids) {
    enrollment_ids.forEach(id => addCourse(id))
}

function addCourse(id) {
    fetch(baseURL + `enrollments/${id}`)
    .then(resp => resp.json())
    .then(obj => getCourseName(obj.data.attributes.course_id, obj.data.attributes.link))
}

function getCourseName(id, link) {
    fetch(baseURL + `courses/${id}`)
    .then(resp => resp.json())
    .then(obj => {
        const li = document.createElement("li")
        console.log(link)
        const a = document.createElement("a")
        a.href = link
        console.log(a) 
        a.innerText = "Go To Course"
        li.innerText = obj.data.attributes.title + ": " + obj.data.attributes.description
        ul.append(li, a)
    })
}

function loadUserCourses(id) {
    fetch(baseURL + `users/${id}`)
    .then(resp => resp.json())
    .then(obj => addCourses(obj["data"]["relationships"]["enrollments"]["data"].map(itm => itm.id)))
}

loadUserCourses(1)
