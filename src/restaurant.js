function getRestaurant() {
  return  fetch("src/data.json")
        .then(rsp => rsp.json())
        .then(data => data)
}