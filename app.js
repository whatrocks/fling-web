"use strict"

document.addEventListener("DOMContentLoaded", renderApp)

function renderApp() {
    const app = document.getElementById("app");
    const node = document.createElement('h2');
    node.innerText = "I am the app!"
    app.appendChild(node)

    const form = document.createElement('form')
    app.appendChild(form)
    const input = document.createElement('input')
    form.appendChild(input);

    const button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-primary')
    button.innerText = "Fetch pokemon!"
    app.appendChild(button)
    button.addEventListener('click', searchPokemon.bind(null, button, input, app))
    form.addEventListener('submit', (e) => {
        console.log("hi");
        e.preventDefault();
        searchPokemon(button, input, app);
    })
}

function searchPokemon(button, input, app) {
    button.innerText = "Loading..."
    // NOTE: This timeout is just to show loading indicator 
    const pokemon = input.value ? input.value : "pikachu"
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    input.value = '';
    setTimeout(() => {
        fetchSomething(url, (res) => {
            console.log("Res: ", res);
            if (res === "error!") {
                console.log("error")
            } else {
                const img = document.createElement('img')
                img.src = res.sprites.front_default
                app.appendChild(img)
            }
            button.innerText = "Fetch pokemon!"
        })
    }, 1000)
}

function fetchSomething(apiUrl, cb) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            const status = xmlhttp.status;
            // console.log("status")
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