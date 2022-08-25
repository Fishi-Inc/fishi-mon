var Pokemon = [];

function submitPokeList() {
    const show_pokemon_container = document.getElementById("show_pokemon_container")

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

    for (let i = 0; i < list_shiny_poke.length; i++) {
        const element = list_shiny_num[i];
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${element}`)
            .then(response => response.json())
            .then(data => {
                //addPokemonToJSON(list_shiny_poke[i], data.types, data.sprites.front_shiny, true)
                addPokemonToPage(list_shiny_poke[i], data.types, data.sprites.front_shiny, true)
            });
    }

    for (let i = 0; i < list_poke_num.length; i++) {
        const element = list_poke_num[i];
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${element}`)
            .then(response => response.json())
            .then(data => {
                addPokemonToPage(list_poke[i], data.types, data.sprites.front_default, false)
            });
    }


    console.group("informations about input")
    console.log("raw input:\n\n" + input_poke_text)
    console.log("raw input (mod):\n\n" + raw_input)
    console.log("raw_poke (mod):\n\n" + raw_poke)
    console.log("raw_normal_poke:\n\n" + raw_normal_poke)
    console.log("raw_shiny_poke:\n\n" + raw_shiny_poke)
    console.groupEnd()

}

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

function addPokemonToJSON(name, types, sprite, shiny) {
    PokemonJSON.push(name, types, sprite, shiny)
}

function addPokemonToPage(name, types, sprite, shiny) {
    const div = document.getElementById('show_pokemon_container');

    var template = `
    <div class="pokemon_container${shiny ? " shiny" : ""}">
        <div class="triangle${shiny ? " triangle-shiny" : ""}">
            <div class="pokemon_image_container pokemon_item">
                <img src="${sprite}" alt="pokemon_image">
            </div>
        </div>
        <div class="informations${shiny ? " shiny" : ""}">
            <h2 class="pokemon_name pokemon_item${shiny ? " shiny" : ""}">${name}</h2>
            ${types.map(type => getTypeDiv(type)).join("")}
        </div>
    </div>`;

    div.innerHTML += template;
}

function getTypeDiv(type) {
    const type_img = `/img/${type.type.name}.png`
    
    return `<img class="pokemon_type pokemon_item" src="${type_img}"></img>`;
}

//********fishiinc********
//Normale Pokemon (10):
//#2 - Bisaknosp, #21 - Habitak, #27 - Sandan, #63 - Abra, #99 - Kingler, #104 - Tragosso, #135 - Blitza, #138 - Amonitas, #149 - Dragoran, #195 - Morlord
//Shiny Pokemon (2):
//#5 - Glutexo, #123 - Sichlor