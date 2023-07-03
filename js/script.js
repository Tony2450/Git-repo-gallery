// Overview class selector
const overview = document.querySelector(".overview");

// Repo list class selector
const repoList = document.querySelector(".repo-list");

// Repos section class selector
const reposSection = document.querySelector(".repos");

// Repo data class selector
const repoDataSection = document.querySelector(".repo-data")

// Return button class selector
const returnButton = document.querySelector(".view-repos")

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
    let avatar = userJsonData.avatar_url;
    let name = userJsonData.name;
    let bio = userJsonData.bio;
    let location = userJsonData.location;
    let publicRepoCount = userJsonData.public_repos;
    userInfoDiv.innerHTML = `
    <figure>
      <img alt="user avatar" src=${avatar} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Bio:</strong> ${bio}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Number of public repos:</strong> ${publicRepoCount}</p>
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
    const fetchLanguages = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
    const languageData = await fetchLanguages.json();
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
    repoDataDiv.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.clone_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
    repoDataSection.classList.remove("hide");
    repoDataSection.append(repoDataDiv);
    reposSection.classList.add("hide");
    returnButton.classList.remove("hide");
}

// Listen for click event on return button
returnButton.addEventListener("click", function(){
    repoDataSection.classList.add("hide");
    reposSection.classList.remove("hide");
    returnButton.classList.add("hide");
})