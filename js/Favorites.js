import { GitHubUser } from "./GitHubUsers.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        //JSON.parse() usado para trocar dados  
        this.entradas = JSON.parse(localStorage.getItem
        ('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites', JSON.stringify(this.entradas))
    }

    async add(username){
        try{

            const userExists = this.entradas.find(entry => entry.login === username)

            console.log(userExists)

            if(userExists){
                throw new Error('Usuário já cadastrado')
            }

            const user = await GitHubUser.search(username)
            
            if(user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }

            this.entradas = [user, ...this.entradas]
            this.update()
            this.save()

        }catch(error){
            alert(error.message)
        }
    }

    delete(user) {
        // Higher-order functions(funções de altar ordem ) (map, filter, find, reduce)
        const filteredEntradas = this.entradas
            .filter(entry => entry.login !== user.login)
            
        this.entradas = filteredEntradas
        this.update()
        this.save()
    }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        } 
    }

    update(){
        this.removeAllTr()

        this.entradas.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `http://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = window.confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }
           
            this.tbody.append(row)
        })

        
    }

    createRow() {
        const tr = document.createElement('tr')

         tr.innerHTML = `
                <td class="user">
                    <img src="https://github.com/vitordavips.png" alt="imagem usuário">
                    <a href="http://github.com/vitordavips" target="_blank">
                        <p>Vitor Davi</p>
                        <span>vitordavips</span>
                    </a>
                </td>
                <td class="repositories">
                    14
                </td>
                <td class="followers">
                    11
                </td>
                <td>
                    <button class="remove">&times;</button>
                </td>
        `
        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}

