class Course {
    static fetchById(id) {
        return fetch(baseURL + `courses/${id}`)
        .then(resp => resp.json())
        .then(obj => obj.data.attributes)
    }

    static postNewCourse(title, description, platform_id) {
        return fetch(baseURL + "courses", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                Accept: "application/json"
            }, 
            body: JSON.stringify({
                title, 
                description, 
                platform_id 
            })
        })
        .then(resp => resp.json())
        .then(obj => obj.data.id)
    }
}