const characterList = document.getElementById("characters-list");
const loadingIndicator = document.getElementById("loader");
const main = document.getElementById("content");

let page = 1;
let globalJsonRes;
let checked = false;

const fetchData = async () => {
    const sidebar = document.getElementById("sidebar");
    
    console.log("Styles applying...");
    loadingIndicator.style.display = "flex";
    main.style.display = "none";
    sidebar.classList.add("unchecked");
    sidebar.classList.remove("checked");
    characterList.innerHTML = ``;
    genButtons();
    
    console.log("Fetching...")
    fetch(`https://swapi.dev/api/people/?page=${page}`).then(res => res.json().then(jsonRes => {
        loadingIndicator.style.display = "none";
        main.style.display = "block";
        sidebar.classList.add("checked");
        sidebar.classList.remove("unchecked");
        globalJsonRes = jsonRes;

        if (window.screen.width < 640) {
            console.log("Applying mobile styles...")
            mobile();
            console.log("Mobile done")
        }
        console.log("Styles done");
        
        for (let i = 0; i < 10; i++) {
            let curCar = jsonRes.results[i];
            
            const card = document.createElement("div");
            card.classList.add("character-card");
            
            const name = document.createElement("h2");
            name.textContent = curCar.name;
            
            card.appendChild(name);
            
            characterList.appendChild(card);
            console.log(`Person ${i} is done`);
        }
        
        console.log("Fetching is done")
    }));
}

const next = () => {
    if (globalJsonRes.next != null) {
        page += 1;
        updateURL();
        fetchData();
    }
}

const previous = () => {
    if (globalJsonRes.previous != null) {
        page -= 1;
        updateURL();
        fetchData();
    }
}

function updateURL() {
    const params = new URLSearchParams();
    params.set('page', page);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('page')) {
        page = parseInt(params.get('page'));
    }
}

const genButtons = () => {
    const buttons = document.getElementById("page-buttons-parent");
    buttons.innerHTML = ``

    const nextButton = document.createElement("div");
    nextButton.onclick = next;
    nextButton.classList.add("page-buttons");
    nextButton.classList.add("right")
    nextButton.innerHTML = `Next page<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-6 h-6 text-inherit mr-0 ml-5 max-[600px]:ml-2.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15.17 6a30.23 30.23 0 0 1 5.62 5.406c.14.174.21.384.21.594m-5.83 6a30.232 30.232 0 0 0 5.62-5.406A.949.949 0 0 0 21 12m0 0H3"></path></svg>`;
    
    const previousButton = document.createElement("div");
    previousButton.onclick = previous;
    previousButton.classList.add("page-buttons");
    previousButton.classList.add("left")
    previousButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6 text-inherit mr-5 max-[600px]:w-7 max-[600px]:h-7 max-[600px]:mr-2.5 max-[450px]:w-5 max-[450px]:h-5"><path d="M8.83 6a30.23 30.23 0 0 0-5.62 5.406A.949.949 0 0 0 3 12m5.83 6a30.233 30.233 0 0 1-5.62-5.406A.949.949 0 0 1 3 12m0 0h18"></path></svg>Previous page`;
    
    fetch(`https://swapi.dev/api/people/?page=${page}`).then(res => res.json().then(jsonRes => {
        if (parseInt((parseInt(jsonRes.count) + 10) / 10) == page) {
            nextButton.style.visibility = "hidden"
            previousButton.style.visibility = "visible"
        }
        if (page == 1) {
            nextButton.style.visibility = "visible"
            previousButton.style.visibility = "hidden"
        }
    }))
    
    buttons.appendChild(previousButton);
    buttons.appendChild(nextButton);
    main.appendChild(buttons);
}

const genSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.add("unchecked")
    sidebar.classList.remove("checked")

    fetch(`https://swapi.dev/api/people/`).then(res => res.json().then(jsonRes => {
        globalJsonRes = jsonRes;

        for (let i = 1; i <= (parseInt(jsonRes.count) + 10) / 10; i++) {
            const child = document.createElement("div");
            child.classList.add("click");
            child.innerText = `Page ${i}`;
            child.onclick = () => {
                page = i;
                fetchData()
                updateURL()
            } 

            sidebar.appendChild(child)
        }
    }));
}

const mobile = () => {
    const sidebar = document.getElementById("sidebar");
    checked = !checked;

    if (checked == true) {
        sidebar.classList.add("checked")
        sidebar.classList.remove("unchecked")
    } else {
        sidebar.classList.remove("checked")
        sidebar.classList.add("unchecked")
    }
}

const init = () => {
    genSidebar();
    applyURLParams();
    fetchData();
}

window.onload = init;