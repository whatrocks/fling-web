"use strict"

document.addEventListener("DOMContentLoaded", renderApp)

function renderApp() {
    const app = document.getElementById("app");
    const flings = document.createElement('div');
    

    const form = document.createElement('form')
    app.appendChild(form)
    const input = document.createElement('input')
    form.appendChild(input);

    const button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.innerText = "search username"
    app.appendChild(button)
    button.addEventListener('click', searchFling.bind(null, button, input, app))
    form.addEventListener('submit', (e) => {
        console.log("hi");
        e.preventDefault();
        searchFling(button, input, flings);
    })
    app.appendChild(flings)
}

function searchFling(button, input, flings) {
    button.innerText = "Loading..."
    // NOTE: This timeout is just to show loading indicator 
    const username = input.value ? input.value : "whatrocks"
    const url = `https://searchcaster.xyz/api/search?text=%E2%8C%86&username=${username}`
    input.value = '';
    setTimeout(() => {
        fetchSomething(url, (res) => {
            console.log("Res: ", res);
            if (res === "error!") {
                console.log("error")
            } else {
                console.log("success!");
                flings.innerHTML = '';
                for (let cast of res.casts) {
                    // get the children with the same username
                    let flingContents = ``;
                    fetchSomething(`https://searchcaster.xyz/api/search?merkleRoot=${cast.merkleRoot}`, (res) => {
                        console.log("Res: ", res);
                        if (res === "error!") {
                            console.log("error")
                        } else {
                            console.log("success!");
                            for (let childCast of res.casts) {
                                // get the children with the same username
                                if (childCast.body.username === username) {
                                    flingContents = `${childCast.body.data.text}\n${flingContents}`;
                                }
                            }
                            // render them
                            // console.log("cast: ", cast);
                            const castBox = document.createElement('div');
                            castBox.classList.add('cast-box');
                            const castDate = document.createElement('p');
                            castDate.innerText = new Date(cast.body.publishedAt).toDateString();
                            const castContent = document.createElement('p');
                            castBox.appendChild(castDate);
                            castContent.innerText = flingContents;
                            castBox.appendChild(castContent);
                            flings.appendChild(castBox);
                        }
                    });
                    
                }
            }
            button.innerText = "search username!"
        })
    }, 1000)
}

function fetchSomething(apiUrl, cb) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            const status = xmlhttp.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                const results = JSON.parse(xmlhttp.responseText)
                cb(results)
            } else {
                cb("error!")
            }
            
        }
    }
    xmlhttp.open("GET", apiUrl)
    xmlhttp.onerror = (err) => cb(err);
    xmlhttp.send();
}