"use strict"

document.addEventListener("DOMContentLoaded", renderApp)

function renderApp() {
    const app = document.getElementById("app");
    const node = document.createElement('h2');
    node.innerText = "I am the app!"
    app.appendChild(node)
}