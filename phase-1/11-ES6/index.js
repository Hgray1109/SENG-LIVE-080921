// This current code base is written in mostly pre-ES6 syntax.
// Modernize the code and clean it up by utilizing ES6 Syntax

const pokeContainer = document.getElementById("poke-container");
const pokeForm = document.getElementById("poke-form");
const formDiv = document.getElementById("comments-form");

function renderPokemon(pokemon) {
  const pokeCard = document.createElement("div");
  pokeCard.id = `poke-${pokemon.id}`;
  pokeCard.className = "poke-card";

  const pokeImg = document.createElement("img");
  pokeImg.src = pokemon.img;
  pokeImg.alt = `${pokemon.name} image`;

  const pokeName = document.createElement("h3");
  pokeName.textContent = pokemon.name;

  const pokeLikes = document.createElement("h3");
  pokeLikes.textContent = "Likes: ";

  const likesNum = document.createElement("h5");
  likesNum.className = "like-num";
  likesNum.textContent = pokemon.likes;

  const likeBttn = document.createElement("button");
  likeBttn.className = "like-bttn";
  likeBttn.textContent = "♥";
  likeBttn.addEventListener("click", () => increaseLike(pokemon, likesNum));

  const deleteBttn = document.createElement("button");
  deleteBttn.className = "delete-bttn";
  deleteBttn.textContent = "Delete";
  deleteBttn.addEventListener("click", () => deletePoke(pokeCard, pokemon));

  pokeCard.append(pokeImg, pokeName, pokeLikes, likesNum, likeBttn, deleteBttn);
  pokeContainer.appendChild(pokeCard);
}

function createPokemon(event) {
  event.preventDefault();

  let pokeName = pokeForm.querySelector("#name-input").value;
  let pokeImg = pokeForm.querySelector("#img-input").value;

  if (pokeName && pokeImg) {
    let pokemon = {
      name: pokeName,
      img: pokeImg,
      likes: 0,
    };
    renderPokemon(pokemon);
    castPokemon(pokemon);
    pokeForm.reset();
  } else {
    alert("Please fill out the form!");
  }
}

function increaseLike(pokemon, likesElement) {
  ++pokemon.likes;
  likesElement.textContent = pokemon.likes;

  fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likes: pokemon.likes }),
  });
}

function deletePoke(pokeCard, pokemon) {
  fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
    method: "DELETE",
  })
    .then((resp) => resp.json())
    .then(pokeCard.remove());
}

function init() {
  createCommentForm();
  gottaCatchEmAll();
  pokeForm.addEventListener("submit", createPokemon);
}

init();

function gottaCatchEmAll() {
  fetch("http://localhost:3000/pokemons")
    .then((resp) => resp.json())
    .then((pokemon) => pokemon.forEach(renderPokemon));
}

function castPokemon(pokemon) {
  const configObj = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pokemon),
  };

  fetch("http://localhost:3000/pokemons", configObj);
}

function createCommentForm() {
  const commentForm = document.createElement("form");
  commentForm.id = "comment-form";
  commentForm.addEventListener("submit", createComment);

  const contentInput = document.createElement("input");
  contentInput.type = "text";
  contentInput.id = "content-input";

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.id = "submit";
  submit.value = "Create Comment";

  commentForm.append(contentInput, submit);
  formDiv.appendChild(commentForm);
}

function createComment(e) {
  e.preventDefault();

  const comment = { content: e.target.querySelector("#content-input").value };

  fetch("http://localhost:3000/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  })
    .then((resp) => resp.json())
    .then((data) => console.log(data));
}
