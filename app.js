var Pokemon = [];

function pasteList() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("input_poke_text").value = text;
    });
}

function submitPokeList() {
    const input_poke_text = document.getElementById("input_poke_text").value;
    const raw_input = input_poke_text.startsWith("********") ? input_poke_text.substring(input_poke_text.indexOf('\n') + 1) : input_poke_text;

    if (!raw_input.startsWith("Normale Pokemon")) {
        alert("Bitte nur die Pokemonliste eingeben! (1 zu 1 aus dem Discord kopieren)");
        return
    }

    const raw_poke = raw_input.substring(raw_input.indexOf(":") + 2);
    const raw_normal_poke = raw_poke.substring(0, raw_poke.indexOf("Shiny Pokemon") - 1);
    const raw_shiny_poke = raw_poke.substring(raw_poke.indexOf(":") + 2);

    const list_poke = extractPokemon(raw_normal_poke);
    const list_poke_num = extractPokemonNum(raw_normal_poke);
    const list_shiny_poke = extractPokemon(raw_shiny_poke);
    const list_shiny_num = extractPokemonNum(raw_shiny_poke);

    for (var i = 0; i < list_shiny_poke.length; i++) {
        const element = list_shiny_num[i];
        const poke_name = list_shiny_poke[i];
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${element}`)
            .then(response => response.json())
            .then(data => {
                Pokemon.push({
                    id: data.id,
                    name: poke_name,
                    types: data.types,
                    sprite: data.sprites.front_shiny,
                    shiny: true
                })
                //addPokemonToList(data.id, list_shiny_poke[i], data.types, data.sprites.front_shiny, true)
                //viewPokemonList(list_shiny_poke[i], data.types, data.sprites.front_shiny, true)
            });
        }

    for (var i = 0; i < list_poke_num.length; i++) {
        const element = list_poke_num[i];
        const poke_name = list_poke[i];

        fetch(`https://pokeapi.co/api/v2/pokemon/${element}`)
            .then(response => response.json())
            .then(data => {
                Pokemon.push({
                    id: data.id,
                    name: poke_name,
                    types: data.types,
                    sprite: data.sprites.front_default,
                    shiny: false
                })
                console.log(i)
                if (Pokemon.length == list_poke_num.length + list_shiny_num.length) {
                    console.log(Pokemon.length)
                    Pokemon.sort((a, b) => a.id - b.id)
                    //Pokemon.sort((a, b) => b.shiny - a.shiny)  -  UNCOMMAND if shiny on top of list
                    viewPokemonList(Pokemon)
                }
                //addPokemonToList(data.id, list_poke[i], data.types, data.sprites.front_default, false)
                //viewPokemonList(list_poke[i], data.types, data.sprites.front_default, false)
            });
        }
}

///////////////////////////////////////
// functions to get the pokemon list //

function extractPokemon(list) {
    var array = list.split(",");
    var list = [];
    for (let index = 0; index < array.length; index++) {
        const element = array[index].substring(array[index].indexOf("-") + 1);
        list.push(element.trim())
    }
    return list;
}

function extractPokemonNum(list) {
    var array = list.split(",");
    var list = [];
    for (let index = 0; index < array.length; index++) {
        const element = array[index].substring(0, array[index].indexOf("-")).replace("#", "");
        list.push(element.trim())
    }
    return list;
}

//////////////////////////////////
// functions to create elements //

function viewPokemonList(Pokemon) {
    const div = document.getElementById('show_pokemon_list');
    console.log(Pokemon)

    for (let i = 0; i < Pokemon.length; i++) {
        const element = Pokemon[i];

        let shiny = element.shiny;
        
        var template = `
        <div class="pokemon_container${shiny ? " shiny" : ""}">
            <div class="triangle${shiny ? " triangle-shiny" : ""}">
                <div class="pokemon_image_container pokemon_item">
                    <img src="${element.sprite}" alt="pokemon_image">
                </div>
            </div>
            <div class="informations${shiny ? " shiny" : ""}">
                <h2 class="pokemon_name pokemon_item${shiny ? " shiny" : ""}">${element.id} ${element.name}</h2>
                ${element.types.map(type => getTypeDiv(type)).join("")}
            </div>
        </div>`;
    
        div.innerHTML += template;
    }
}

//add function viewPokemonCompact

function getTypeDiv(type) {
    const type_img = `/img/${type.type.name}.png`
    
    return `<img class="pokemon_type pokemon_item" src="${type_img}"></img>`;
}

//********fishiinc********
//Normale Pokemon (10):
//#2 - Bisaknosp, #21 - Habitak, #27 - Sandan, #63 - Abra, #99 - Kingler, #104 - Tragosso, #135 - Blitza, #138 - Amonitas, #149 - Dragoran, #195 - Morlord
//Shiny Pokemon (2):
//#5 - Glutexo, #123 - Sichlor