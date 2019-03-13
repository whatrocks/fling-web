"use strict"

document.addEventListener("DOMContentLoaded", renderApp)

function renderApp() {
    const app = document.getElementById("app");
    const node = document.createElement('h2');
    node.innerText = "I am the app!"
    app.appendChild(node)

    const button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.innerText = "Fetch picture of Oddish!"
    app.appendChild(button)
    button.addEventListener('click', () => {
        button.innerText = "Loading..."
        // NOTE: This timeout is just to show loading indicator 
        setTimeout(() => {
            const url = `https://pokeapi.co/api/v2/pokemon/oddish`
            fetchSomething(url, (res) => {
                const img = document.createElement('img')
                img.src = res.sprites.front_default
                app.appendChild(img)
                button.innerText = "Fetch picture of Oddish!"
            })
        }, 1000)
    })
}

function fetchSomething(apiUrl, cb) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            const results = JSON.parse(xmlhttp.responseText)
            cb(results)
        }
    }
    xmlhttp.open("GET", apiUrl)
    xmlhttp.send();
}