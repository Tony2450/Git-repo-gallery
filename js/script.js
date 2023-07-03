// Overview class selector
const overview = document.querySelector(".overview");

// Repo list class selector
const repoList = document.querySelector(".repo-list")

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
const displayRepos = function(repoListJson) {
    repoListJson.forEach(function(repo,index,array){
        let listDiv = document.createElement("li");
        listDiv.classList.add("repo");
        listDiv.innerHTML = `<h3>${repo.name}</h3>`
        repoList.append(listDiv);
    })
}