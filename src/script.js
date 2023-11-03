const btnSearch = document.querySelector("[data-btn-search]")
btnSearch.addEventListener("click",() =>{
    const searchString = document.querySelector("[data-txt-search]").value    
       let searchedRestaurants =  restaurantData.filter((rst) => rst.name.toLowerCase().includes(searchString.toLowerCase()))
       displayRestaurant(searchedRestaurants)    
})

let categoryFilter = document.getElementById("categoryFilter")
categoryFilter.addEventListener('change',() => {
    let selectedValue = categoryFilter.value
    if(selectedValue === "select") return
    let filter = restaurantData.filter(x => x.category.toLowerCase().includes(selectedValue.toLowerCase()))
    displayRestaurant(filter)
})

let sortRating = document.getElementById("sortRating")
sortRating.addEventListener('click', () => { 
    GetSortedArray()  
    // console.log(restaurantData.sort((a,b)=> 
    //     (a.rating < b.rating) ? 1 : (a.rating > b.rating) ? -1 : 0
    // ))
})

const favoriteRestaurant = JSON.parse(localStorage.getItem("favRestaurant")) || []

const section = document.getElementById("rst-section")  
const displayRestaurant = (data) => {
    return (section.innerHTML = data.map((x) => {
        let {id,img,name,category,rating,address,favorite} = x
        let search = favoriteRestaurant.find((x) => x.id === id)
        let favclass =  search !== undefined ? "bi bi-heart-fill" : "bi bi-heart" 
        return `
        <div class="rst-card">
        <img src="${img}" class="rst-img" alt="" onclick="alert('hello')">
        <div class="details">
            <div class="name-fav">
                <h3 class="rst-name">${name}</h3>               
                <i id="${id}" onclick="addToFavorite(${id})" class="${favclass}" style="c"></i>
            </div>
            <div class="cat-rating">
                <p class="category">${category}</p>
                <h4 class="rst-rating"><i class="bi bi-star-fill"></i><span>${rating}</span></h4>
            </div>
            <p><i  class="bi bi-geo-alt"></i><span>${address}</span></p>
        </div>
    </div>
        `
    }).join(""))
}

displayRestaurant(restaurantData)

let addToFavorite = (id) => {
    let selectedItem = id
    let search = favoriteRestaurant.find((x) => x.id === selectedItem.id)
    if(search === undefined){
        let favElement = document.getElementById(selectedItem.id)
        favElement.classList.remove("bi-heart")
        favElement.classList.add("bi-heart-fill")
        favoriteRestaurant.push({
            id : selectedItem.id,
            favorite: "bi-heart-fill"
        })
    }
    localStorage.setItem("favRestaurant",JSON.stringify(favoriteRestaurant))
}

let GetSortedArray = () =>{
    let sortedArray = restaurantData
    for(let i=0;i<sortedArray.length-1;i++){ 
        for(let j=0; j< sortedArray.length-i-1;j++){  
            // i=0 j=6 when 1st iteration completes smallest value pushe at the end!
            // 4.2 1.9 4.3 3.0 5.0 2.9
            // 4.2 4.3 1.9 3.0 5.0 2.9
            // 4.2 4.3 3.0 1.9 5.0 2.9
            // 4.2 4.3 3.0 5.0 1.9 2.9
            // 4.2 4.3 3.0 5.0 2.9 1.9           
            if(sortedArray[j].rating < sortedArray[j+1].rating){
                let temp = sortedArray[j+1]
                sortedArray[j+1] = sortedArray[j]
                sortedArray[j] = temp               
            }
        }
    }
    displayRestaurant(sortedArray)
}

let rstPerPage = 5
let numberOfrst = restaurantData.length  
let numberOfPages = numberOfrst / rstPerPage
let AddPagination = () => {
    let paginationDiv = document.querySelector("#pagination")
    let pages = `<a href="#"><i onclick="previousPage()"class="bi bi-arrow-left"></i></a>`
    let classActive
    for(let i=1; i <= numberOfPages; i++){
        classActive = i=== 1? "active" : ""
        pages += `<a  class="${classActive}" id = "${i}"onclick="loadNextPage(${i})">${i}</a>`
    }   
    pages += `<a href="#"><i onclick="nextPage()" class="bi bi-arrow-right"></i></a>`
    paginationDiv.innerHTML = pages
    let rstPageData = restaurantData.slice(0,rstPerPage)
    console.log(rstPageData)
    displayRestaurant(rstPageData)
}

AddPagination()

let loadNextPage = (pageNum) => {    
    let inActive = document.getElementsByClassName('active')[0]
    inActive.classList.remove("active")
    let activePage = document.getElementById(pageNum)
    activePage.classList.add("active")
    let end = pageNum * rstPerPage
    let start = end - rstPerPage
    let rstPageData = restaurantData.slice(start,end)
    displayRestaurant(rstPageData)
}

let previousPage = () => {
    let currentPageNum = 0
    currentPageNum = document.getElementsByClassName("active")[0].text
    console.log(currentPageNum)
    let previouspageNum = currentPageNum - 1 
    if(previouspageNum <=0 ) return
    else
    loadNextPage(previouspageNum)
}

let nextPage = () => {
    let previousPageNum = 0
    previousPageNum = document.getElementsByClassName("active")[0].text
    let nextPageNum = parseInt(previousPageNum) + 1
    console.log(nextPageNum)
    if (nextPageNum > numberOfPages) return
    else 
    loadNextPage(nextPageNum)
}