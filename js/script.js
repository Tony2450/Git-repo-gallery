// Overview class selector
const overview = document.querySelector(".overview");

// Repo list class selector
const repoList = document.querySelector(".repo-list");

// Repos section class selector
const reposSection = document.querySelector(".repos");

// Repo data class selector
const repoDataSection = document.querySelector(".repo-data");

// Return button class selector
const returnButton = document.querySelector(".view-repos");

// Searchbar class selector
const filterInput = document.querySelector(".filter-repos");

// Github username
const username = "Tony2450";

// Async fetch function to call github API for profile info
const userInfoFetch = async function () {
    const userData = await fetch(`https://api.github.com/users/${username}`);
    const userJsonData = await userData.json();
    console.log(userJsonData);
    displayInfo(userJsonData);
};

userInfoFetch();

// Display fetched user information
const displayInfo = function (userJsonData) {
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user-info");
    userInfoDiv.innerHTML = `
    <figure>
      <img alt="user avatar" src=${userJsonData.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${userJsonData.name}</p>
      <p><strong>Bio:</strong> ${userJsonData.bio}</p>
      <p><strong>Location:</strong> ${userJsonData.location}</p>
      <p><strong>Number of public repos:</strong> ${userJsonData.public_repos}</p>
    </div> `;
    overview.append(userInfoDiv);
    userRepoListFetch();
};

// Async fetch function to call github API for list of repos
const userRepoListFetch = async function () {
    const repoListData = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoListJson = await repoListData.json();
    console.log(repoListJson);
    displayRepos(repoListJson);
};

// Display fetched repo list
const displayRepos = function (repoListJson) {
    filterInput.classList.remove("hide");
    repoListJson.forEach(function (repo, index, array) {
        let listDiv = document.createElement("li");
        listDiv.classList.add("repo");
        listDiv.innerHTML = `<h3>${repo.name}</h3>`
        repoList.append(listDiv);
    })
};

// Listen for click event on unordered list
repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        repoInfoFetch(repoName);
    }
});

// Async function for specific repo info
const repoInfoFetch = async function (repoName) {
    const repoInfoData = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await repoInfoData.json();

    // Get languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    // Make list of languages
    let languages = [];
    for (let language in languageData) {
        languages.push(language);
    };

    displayRepoInfo(repoInfo, languages);
};

// Display specific repo information
const displayRepoInfo = function (repoInfo, languages) {
    repoDataSection.innerHTML = "";
    const repoDataDiv = document.createElement("div");
    repoDataDiv.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.clone_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
        `;
        repoDataSection.append(repoDataDiv);

    repoDataSection.classList.remove("hide");
    reposSection.classList.add("hide");
    filterInput.classList.add("hide");
    returnButton.classList.remove("hide");
}

// Listen for click event on return button
returnButton.addEventListener("click", function(){
    repoDataSection.classList.add("hide");
    reposSection.classList.remove("hide");
    filterInput.classList.remove("hide");
    returnButton.classList.add("hide");
})

// Listen for input in search bar
filterInput.addEventListener("input", function(e){
    const input = e.target.value;
    const repos = document.querySelectorAll(".repo");
    let inputLowerCase = input.toLowerCase();
    for (let repo of repos){
        let repoName = repo.innerText.toLowerCase();
        if (repoName.includes(inputLowerCase) === false){
            repo.classList.add("hide");
        } else {
            repo.classList.remove("hide");
        }
    }
})