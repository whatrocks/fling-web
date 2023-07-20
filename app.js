"use strict";

document.addEventListener("DOMContentLoaded", renderApp);

function renderApp() {
  const button = document.getElementById("search_button");
  const input = document.getElementById("search_input");
  button.addEventListener(
    "click",
    searchFling.bind(null, button, input, flings)
  );
  const form = document.getElementById("search_form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("search_input");
    searchFling(button, input, flings);
  });

  // get existing query
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.username) {
    const input = document.getElementById("search_input");
    input.innerText = params.username;
    input.value = params.username;
    searchFling(button, input, flings);
  }
}

function searchFling(button, input, flings) {
  // to set new query
  const newParams = new URLSearchParams();

  button.innerText = "Loading";
  // NOTE: This timeout is just to show loading indicator
  const username = input.value ? input.value : "whatrocks";
  newParams.set("username", username);
  window.history.replaceState({}, "", `${location.pathname}?${newParams}`);

  const url = `https://searchcaster.xyz/api/search?regex=%E2%8C%86&username=${username}`;

  flings.innerHTML = "";
  fetchSomething(url, (res) => {
    if (res === "error!") {
      flings.innerText = "Error while fetching flings!";
    } else {
      if (res.casts.length === 0) {
        flings.innerText = "No flings found!";
        return;
      }
      for (let cast of res.casts) {
        if (cast.body.data.text[0] !== "⌆") {
          continue;
        }
        const castBox = document.createElement("div");
        castBox.classList.add("rounded-md", "p-4", "bg-gray-100", "m-2");
        const castDate = document.createElement("p");
        castDate.classList.add("font-semibold");
        castDate.innerText = new Date(cast.body.publishedAt).toDateString();
        castBox.appendChild(castDate);
        flings.appendChild(castBox);
        // get the children with the same username
        let flingContents = ``;
        const castContent = document.createElement("p");
        castBox.appendChild(castContent);
        castContent.innerText = "Loading...";
        fetchSomething(
          `https://searchcaster.xyz/api/search?merkleRoot=${cast.merkleRoot}`,
          (res) => {
            if (res === "error!") {
              castContent.innerText = "Error fetching children casts!";
            } else {
              for (let childCast of res.casts) {
                // get the children with the same username
                if (childCast.body.username === username) {
                  flingContents = `${childCast.body.data.text}\n${flingContents}`;
                }
              }
              castContent.innerText = flingContents;
              //   castBox.appendChild(castContent);
            }
          }
        );
      }
    }
    button.innerText = "Search";
  });
}

function fetchSomething(apiUrl, cb) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      const status = xmlhttp.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        const results = JSON.parse(xmlhttp.responseText);
        cb(results);
      } else {
        cb("error!");
      }
    }
  };
  xmlhttp.open("GET", apiUrl);
  xmlhttp.onerror = (err) => cb(err);
  xmlhttp.send();
}
