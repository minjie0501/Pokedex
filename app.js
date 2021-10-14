let intervals = [];

const getPokemon = async (input) => {
  try {
    input = input.toString().toLowerCase().replace(" ", "-").replace(".", "");
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    const parsedData = await data.json();
    return parsedData;
  } catch (error) {
    alert("Please enter a correct name or Id");
    console.log(error);
    return;
  }
};

const getPokemonSpecies = async (id) => {
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const parsedData = await data.json();
    return parsedData.evolution_chain.url;
  } catch (error) {
    // console.log(error);
    return;
  }
};

const getPokemonSpeciesId = async (id) => {
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const parsedData = await data.json();
    return parsedData;
  } catch (error) {
    // console.log(error);
    return;
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
      if (parsedData.chain.evolves_to.length > 1) {
        let evolutionHelper = "";
        for (let e = 0; e < parsedData.chain.evolves_to.length; e++) {
          evolutionHelper += parsedData.chain.evolves_to[e].species.name + ":";
        }
        evolution += " " + evolutionHelper;
      } else {
        evolution += ` ${parsedData.chain.evolves_to[0].species.name}`; // TODO: this was outside of the else, now eevve only shows one evolution
      }
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mainGame = async (input) => {
  // for (let i = 0; i < 4; i++) {
  //   document.getElementById(`move${i + 1}`).innerHTML = "X"; //reset moves
  // }
  // let input = document.getElementById("poke-input").value;
  let pokeId = document.getElementById("pokemon-id");
  let pokeImg = document.getElementById("poke-img");
  let pokeName = document.getElementById("poke-name");
  let pokeInfo;
  try {
    pokeInfo = await getPokemon(input);
  } catch (error) {
    console.log("looking for this error", error);
  }
  pokeName.innerHTML = pokeInfo.name;
  pokeId.innerHTML = pokeInfo.id;
  pokeImg.src = pokeInfo.sprites.front_default;
  pokeImg.alt = pokeInfo.name;

  //////////////////////////////////////

  document.getElementById("poke-img").addEventListener("mouseover", () => {
    // let check = checkImage(
    //   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId.innerHTML}.png`,
    //   function () {
    //     return true
    //   },
    //   function () {
    //     return false
    //   } // TODO: find out if img url actually return an img or not
    // );
    //   if (check) {
    //     pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId.innerHTML}.png`;
    //   } else {
    //     console.log('invalid img')
    //   }
    pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId.innerHTML}.png`;
  });

  document.getElementById("poke-img").addEventListener("mouseout", () => {
    // let check = checkImage(
    //   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId.innerHTML}.png`,
    //   function () {
    //     return true
    //   },
    //   function () {
    //     return false
    //   }
    // );
    //   if (check) {
    //     pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId.innerHTML}.png`;
    //   } else {
    //     console.log('invalid img')
    //   }
    pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId.innerHTML}.png`;
  });
  //////////////////////////////////////

  if (pokeInfo.moves.length >= 4) {
    const randomMoves = getRandomNumbers(pokeInfo.moves.length);
    for (let i = 0; i < randomMoves.length; i++) {
      document.getElementById(`move${i + 1}`).innerHTML = pokeInfo.moves[randomMoves[i]].move.name;
    }
  } else {
    for (let i = 0; i < 4; i++) {
      document.getElementById(`move${i + 1}`).innerHTML = "X"; //reset moves
    }
    for (let i = 0; i < pokeInfo.moves.length; i++) {
      document.getElementById(`move${i + 1}`).innerHTML = pokeInfo.moves[i].move.name;
    }
  }

  try {
    const speciesUrl = await getPokemonSpecies(pokeInfo.id);
    let evolution = await getPokemonEvolution(speciesUrl);
    evolution = evolution.split(" ");
    // //TODO: check here if evolution[1] (or any other?) includes a colon; if yes then it has more than one evolution
    let evArr = [];
    let checker = false;
    if (evolution.length > 1) {
      if (evolution[1].includes(":")) {
        evArr = evolution[1].split(":");
        evolution[1] = evArr[1];
        checker = true;
      }
    }

    document.getElementById(`ev`).innerHTML = "";
    for (let j = 0; j < evolution.length; j++) {
      const getId = await getPokemonSpeciesId(evolution[j])
      const picUrl = await getPokemon(getId.id);
      document.getElementById(
        `ev`
      ).innerHTML += `<img class="poke-evo zoom2" id="e-${j}" src="${picUrl.sprites.front_default}" alt="${picUrl.name}"> `;
    }

    for (let k = 0; k < evolution.length; k++) {
      document.getElementById(`e-${k}`).addEventListener("click", () => {
        let n = document.getElementById(`e-${k}`).alt;
        mainGame(n);
      });
    }
    intervals.forEach((interval) => {
      clearInterval(interval);
    });
    if (evArr.length > 1) {
      evArr.pop();
      let count = 0;
      let i = setInterval(async () => {
        if (count < evArr.length) {
          let changePic = await getPokemon(evArr[count]);
          document.getElementById("e-1").src = changePic.sprites.front_default;
          document.getElementById("e-1").alt = changePic.name;
          count++;
        } else {
          count = 0;
          let changePic = await getPokemon(evArr[count]);
          document.getElementById("e-1").src = changePic.sprites.front_default;
          document.getElementById("e-1").alt = changePic.name;
          count++;
        }
        //remove lelemnt array
      }, 1000);
      intervals.push(i);
    }
  } catch (error) {
    document.getElementById(`ev`).innerHTML = "";
    console.log("thsi error", error);
  }
};

document.getElementById("poke-search").addEventListener("click", async () => {
  let input = document.getElementById("poke-input").value;

  mainGame(input);
});

// mainGame(25);

// TODO: 10001 pictures doesnt turn arounc
// TODO: EEVEE has more than one pervious evolution and there is another one that has more than one; 678id 
// TODO: if space in input then replace with dash or if . in input then replace with ""

function checkImage(src, good, bad) {
  var img = new Image();
  img.onload = good;
  img.onerror = bad;
  img.src = src;
}

(async () => {
  await mainGame(25);
})();
