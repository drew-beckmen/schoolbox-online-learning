const main = document.getElementById("main-content")
const baseURL = "http://localhost:3000/api/v1/"
const allCourses = document.getElementById("all-courses")
const exploreCourses = document.getElementById("explore-courses")
const newCourse = document.getElementById("new-course")
let flashcardState = false 
let user_id; 

allCourses.addEventListener("click", () => {
    flashcardState = false 
    main.innerHTML = ""
    const h1 = document.createElement("h1")
    h1.innerText = "Your Courses: Click One to Get Started "
    main.append(h1)
    loadUserCourses(user_id)
})

exploreCourses.addEventListener("click", () => {
    flashcardState = false 
    main.innerHTML = ""
    const h1 = document.createElement("h1")
    h1.innerText = "Top Online Courses of 2020"
    main.append(h1)
    Recommendation.listAll()
})

//Main Login Function:
function login() {
    main.innerHTML = ""
    const loginForm = document.createElement("div")
    loginForm.className = "align-self-center"
    loginForm.id = "login"
    const formContent = document.createElement("form")
    formContent.innerHTML = `
    <label id="login-text">Enter your Name to Login or Sign Up:</label><br>
    <input type=text" placeholder='Name goes here'><br><br>`
    const loginButton = document.createElement("input")
    loginButton.type = "submit"
    loginButton.value = "Start Learning!"

    formContent.addEventListener("submit", async function() {
        event.preventDefault() 
        const name = event.target[0].value 
        let users = await User.findAllUsers()
        const currentUser = User.isValidUser(name, users)
        
        //Find user by name 
        if (!!currentUser) { user_id = currentUser }
        else {
            //Need to create a new User 
            let newUser = await User.postNewUser(name)
            user_id = newUser 
        }
        document.getElementById("all-courses").disabled = false 
        document.getElementById("new-course").disabled = false 
        document.getElementById("all-courses").click()     
        document.getElementsByClassName("navbar-text")[0].innerHTML = ` <button style="background-color:#5f8db6" onclick="location.reload()">Log Out</button>`
        document.getElementsByClassName("navbar navbar-light bg-light")[0].onclick = ""
    })
    formContent.append(loginButton)
    loginForm.append(formContent)
    main.append(loginForm)
}


newCourse.addEventListener("click", function() {
    flashcardState = false 
    fetch(baseURL + "platforms")
    .then(resp => resp.json())
    .then(obj => {
        obj.data.forEach(plat => new Platform(plat))
        Enrollment.createNewCourse() 
    })
})

function addCourses(enrollment_ids) {
    enrollment_ids.forEach(id => addCourse(id))
}

function addCourse(id) {
    fetch(baseURL + `enrollments/${id}`)
    .then(resp => resp.json())
    .then(obj =>{
        let e = new Enrollment(obj.data.id, obj.data.attributes, obj.data.relationships)
        e.render()
    })
}

function loadUserCourses(id) {
    fetch(baseURL + `users/${id}`)
    .then(resp => resp.json())
    .then(obj => addCourses(obj.data.relationships.enrollments.data.map(itm => itm.id)))
}

login() 
