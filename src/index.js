document.addEventListener("DOMContentLoaded",()=>{
 getPups()
 filterPups()
})

function getPups(){
  fetch("http://localhost:3000/pups")
  .then(res => res.json())
  .then(data => renderPup(data))
}

function updateDog(event){
  let id = Number(event.target.id)
  let value;
  let buttonValue = event.target.textContent
  if(buttonValue === "Good Dog!"){
    value = false
  }else{
    value = true
  }

  fetch(`http://localhost:3000/pups/${id}`,{
    method:"PATCH",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body:JSON.stringify({isGoodDog:value})

  })
  .then(res => res.json())
  .then(data => {
    data.isGoodDog? event.target.textContent = "Good Dog!": event.target.textContent = "Bad Dog!"
  })
}

function renderPup(pupArray){
  let dogBar = document.querySelector("#dog-bar")
  let dogInfo = document.querySelector("#dog-info")
  dogBar.innerHTML = ""
  dogInfo.innerHTML = ""
  pupArray.forEach(pup => {
    let spanName = document.createElement("span")
    spanName.innerText = pup.name
    dogBar.appendChild(spanName)

    spanName.addEventListener("click",()=>{
      dogInfo.innerHTML = ""
      let buttonValue;
      pup.isGoodDog? buttonValue="Good Dog!":buttonValue="Bad Dog!"
      let img = document.createElement("img")
      img.src = pup.image
      dogInfo.appendChild(img)
      let h2 = document.createElement("h2")
      h2.innerText = pup.name
      dogInfo.appendChild(h2)
      let button = document.createElement("button")
      button.id = pup.id
      button.innerText = buttonValue
      dogInfo.appendChild(button)  

      button.addEventListener("click",updateDog)
    })
  })
}

function filterPups(){
  let filterBtn = document.querySelector("#good-dog-filter")
  filterBtn.addEventListener("click",(event)=>{
    if(event.target.textContent === "Filter good dogs: OFF"){

      event.target.textContent = "Filter good dogs: ON"

      fetch("http://localhost:3000/pups")
      .then(res => res.json())
      .then(data => {
        let filteredArray = data.filter(pup=>{
          return pup.isGoodDog === true
        })
        return renderPup(filteredArray)
      })
    }else{
      event.target.textContent = "Filter good dogs: OFF"
      return getPups()
    }
  }) 
}