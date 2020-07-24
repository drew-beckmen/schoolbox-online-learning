class Recommendation {
    constructor(data) {
        this.id = data.id 
        this.title = data.attributes.title 
        this.link = data.attributes.link 
        this.creator = data.attributes.creator 
    }

    static listAll() {
        fetch(baseURL + "recommendations")
        .then(response => response.json())
        .then(obj => {
            obj.data.forEach(rec => {
                let newRec = new Recommendation(rec)
                newRec.render()
            }) 
        })
    }

    render() {
        const singleCourse = document.createElement("div")
        singleCourse.style = "border-radius: 15px 30px; background-color: #549ad6"
        singleCourse.id = this.id 
        singleCourse.className = "list-recs"
        singleCourse.innerHTML = `
        <h3>📖${this.title}</h3> 
        <h5>Taught By: ${this.creator}</h5>
        <a href=${this.link} style="color:navy" target="_blank">See More Info</a>`

        //only allow this action if a user id logged in 
        if (!!user_id) {
            singleCourse.addEventListener("click", () => {
                document.getElementById("new-course").click() 
                setTimeout(() => {
                    document.getElementById("new-course-form").children[1].value = this.title
                    document.getElementById("new-course-form").children[4].value = `Created and taught by ${this.creator}`
                    
                }, 100)
            })
        }
        main.append(singleCourse)
    }
}

Recommendation.all = [];