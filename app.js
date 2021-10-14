const getPokemon = async (input) => {
  try {
    input = input.toString().toLowerCase()
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    const parsedData = await data.json();
    return parsedData;
  } catch (error) {
    alert('Please enter a correct name or Id')
    console.log(error);
  }
};

const getPokemonSpecies = async (id) => {
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const parsedData = await data.json();
    return parsedData.evolution_chain.url;
  } catch (error) {
    console.log(error);
  }
};

const getPokemonEvolution = async (url) => {
  let evolution = "";
  try {
    const data = await fetch(url);
    const parsedData = await data.json();
    //console.log(parsedData);

    evolution += `${parsedData.chain.species.name}`;
    if (parsedData.chain.evolves_to.length < 1 == false) {
      evolution += ` ${parsedData.chain.evolves_to[0].species.name}`;
      if (parsedData.chain.evolves_to[0].evolves_to.length < 1 == false) {
        // evolution += ` ${parsedData.chain.evolves_to[0].evolves_to[0].species.name}`;
        evolution += ` ${parsedData.chain.evolves_to[0].evolves_to[0].species.name}`;
      }
    }

    return `${evolution}`;
  } catch (error) {
    console.log(error);
  }
};

const getRandomNumbers = (arrLength) => {
  let arr = [];
  while (arr.length < 4) {
    let r = Math.floor(Math.random() * arrLength);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

const mainGame = async (input) => {
  for (let i = 0; i < 4; i++) {
    document.getElementById(`move${i + 1}`).innerHTML = "X"; //reset moves
  }
  // let input = document.getElementById("poke-input").value;
  let pokeId = document.getElementById("pokemon-id");
  let pokeImg = document.getElementById("poke-img");
  let pokeName = document.getElementById("poke-name");
  const pokeInfo = await getPokemon(input);
  pokeName.innerHTML = pokeInfo.name;
  pokeId.innerHTML = pokeInfo.id;
  pokeImg.src = pokeInfo.sprites.front_default;
  pokeImg.alt = pokeInfo.name;

    //////////////////////////////////////
  
    document.getElementById("poke-img").addEventListener("mouseover", () => {
      pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId.innerHTML}.png`
    });
  
    document.getElementById("poke-img").addEventListener("mouseout", () => {
      pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId.innerHTML}.png`
    });
    //////////////////////////////////////

  if (pokeInfo.moves.length >= 4) {
    const randomMoves = getRandomNumbers(pokeInfo.moves.length);
    for (let i = 0; i < randomMoves.length; i++) {
      document.getElementById(`move${i + 1}`).innerHTML = pokeInfo.moves[randomMoves[i]].move.name;
    }
  } else {
    for (let i = 0; i < pokeInfo.moves.length; i++) {
      document.getElementById(`move${i + 1}`).innerHTML = pokeInfo.moves[i].move.name;
    }
  }

  const speciesUrl = await getPokemonSpecies(pokeInfo.id);
  let evolution = await getPokemonEvolution(speciesUrl);
  evolution = evolution.split(" ");
  document.getElementById(`ev`).innerHTML = "";
  for (let j = 0; j < evolution.length; j++) {
    const picUrl = await getPokemon(evolution[j]);
    document.getElementById(`ev`).innerHTML += `<img class="poke-evo zoom2" id="e-${j}" src="${picUrl.sprites.front_default}" alt="${picUrl.name}"> `;
  }

  for (let k = 0; k < evolution.length; k++) {
    document.getElementById(`e-${k}`).addEventListener("click", () => {
      mainGame(evolution[k]);
    });
  }
};

document.getElementById("poke-search").addEventListener("click", async () => {
  let input = document.getElementById("poke-input").value;

  mainGame(input);
});

//3 TODO: check if ditto, id25 and id24 works
// https://pokeapi.co/api/v2/pokemon-species/346
mainGame(25)
