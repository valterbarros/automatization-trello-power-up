/* global TrelloPowerUp */
import trelloAuth from './auth'

trelloAuth()

var t = TrelloPowerUp.iframe()

document.querySelector('#jsghselection').addEventListener('submit', (event) => {
  event.preventDefault()

  const ghToken = document.querySelector('#js_gh_token').value
  const ghOwner = document.querySelector('#js_gh_owner').value
  const ghRepository = document.querySelector('#js_gh_repository').value

  return t.set('board', 'shared', 'github_user_info', {
    ghToken,
    ghOwner: {
      name: ghOwner,
      repository: ghRepository
    }
  })
  .then(() => {
    t.closePopup()
  })
})

// Like a popup constructor as soon as the pop up rendes on the screen it will be called
t.render(() => {
  t.get('board', 'shared', 'github_user_info').then((githubUserInfo) => {
    const githubToken = githubUserInfo.ghToken

    const reposUrl = `https://api.github.com/user/repos?sort=pushed&per_page=20`

    return fetch(reposUrl, {
      headers: {
        Authorization: `token ${githubToken}`
      }
    })
    .then((reposResponse) => reposResponse.json())
    .then((repos) => {
      repos.forEach((repo) => {
        const option = document.createElement('option');
        option.text = repo.full_name
        option.value = repo.pulls_url

        const repoSelect = document.querySelector('#js_gh_repository')
        repoSelect.add(option)
      })
    })
  })
  .then((result) => {
    console.log(result);
  })

  const ghToken = document.querySelector('#js_gh_token')
  // const ghOwner = document.querySelector('#js_gh_owner')
  const ghRepository = document.querySelector('#js_gh_repository')

  t.get('board', 'shared', 'github_user_info').then((personalGithubData) => {
    console.log(personalGithubData)
    ghToken.value = personalGithubData.ghToken
    // ghOwner.value = personalGithubData.ghOwner.name
    ghRepository.value = personalGithubData.ghOwner.repository
  })
  .then(() => {
    t.sizeTo('#jsghselection').done()
  })
})
