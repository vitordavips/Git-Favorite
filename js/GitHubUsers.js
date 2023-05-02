export class GitHubUser{
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`
        // O fetch ele vai procurar no JSON as informações
        return fetch(endpoint)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}