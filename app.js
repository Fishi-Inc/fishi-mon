var Pokemon = [];
var ListMode = 0;

function pasteList() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("input_poke_text").value = text;
    });
}

function switchListMode() {
    if (ListMode == 0) {
        ListMode = 1;
        document.getElementsByClassName("checkbox")[0].title = "Listenansicht aktivieren";
        if (Pokemon !== undefined && Pokemon.length != 0) viewPokemonListCompact(Pokemon);
    } else {
        ListMode = 0;
        document.getElementsByClassName("checkbox")[0].title = "Kachelansicht aktivieren";
        if (Pokemon !== undefined && Pokemon.length != 0) viewPokemonList(Pokemon);
    }
    return ListMode;
}

function submitPokeList() {
    if (Pokemon !== undefined && Pokemon.length != 0) {
        const div_list = document.getElementById('show_pokemon_list');
        const div_compact = document.getElementById('show_pokemon_compact');
        Pokemon = [];
        div_list.innerHTML = "";
        div_compact.innerHTML = "";
    }

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
                if (Pokemon.length == list_poke_num.length + list_shiny_num.length) {
                    Pokemon.sort((a, b) => a.id - b.id)
                    //Pokemon.sort((a, b) => b.shiny - a.shiny)  -  UNCOMMAND if shiny on top of list
                    if (ListMode == 0) viewPokemonList(Pokemon);
                    else viewPokemonListCompact(Pokemon);
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

    if (list[0] == "") {
        list = [];
    }
    return list;
}

//////////////////////////////////
// functions to create elements //

function viewPokemonList(Pokemon) {
    const div = document.getElementById('show_pokemon_list');
    const div_compact = document.getElementById('show_pokemon_compact');
    
    if (div_compact.innerHTML != "") div_compact.innerHTML = "";

    for (let i = 0; i < Pokemon.length; i++) {
        const element = Pokemon[i];

        let shiny = element.shiny;
        
        var template = `
        <div class="pokemon_container${shiny ? " shiny" : ""}" onclick="showDetails(this)">
            <div class="triangle${shiny ? " triangle-shiny" : ""}">
                <div class="pokemon_image_container pokemon_item">
                    <img src="${element.sprite}" alt="pokemon_image">
                </div>
            </div>
            <div class="informations">
                <div class="pokemon_id_name">
                    <h2 class="pokemon_name pokemon_item${shiny ? " shiny" : ""}" id="pokemon_id">${element.id}</h2>
                    <h2 class="pokemon_name pokemon_item${shiny ? " shiny" : ""}" id="pokemon_name">${element.name}</h2>
                </div>
                ${element.types.map(type => getTypeDiv(type)).join("")}
            </div>
        </div>`;
    
        div.innerHTML += template;
    }
}

function viewPokemonListCompact(Pokemon) {
    const div_list = document.getElementById('show_pokemon_list');
    const div = document.getElementById('show_pokemon_compact');

    if (div_list.innerHTML != "") div_list.innerHTML = "";

    for (let i = 0; i < Pokemon.length; i++) {
        const element = Pokemon[i];

        let shiny = element.shiny;
        
        var template = `
        <div class="pokemon_container_compact${shiny ? " shiny" : ""}" onclick="showDetails(this)">
            <div class="pokemon_image_container">
                <img src="${element.sprite}" alt="pokemon_image">
            </div>
            <div class="informations">
                <h2 class="pokemon_name${shiny ? " shiny" : ""}" id="pokemon_id">${element.id}</h2>
                <h2 class="pokemon_name${shiny ? " shiny" : ""}" id="pokemon_name">${element.name}</h2>
            </div>
        </div>`;
    
        div.innerHTML += template;
        //cut out types because they are too much
        //${element.types.map(type => getTypeDiv(type)).join("")}
    }
}

//add function viewPokemonCompact

function getTypeDiv(type) {
    const type_img = `/img/${type.type.name}.png`
    
    return `<img class="pokemon_type pokemon_item" src="${type_img}"></img>`;
}

///////////////////
// detailed view //

function showDetails(a) {
    const website = document.querySelector('.website');
    const id = a.querySelector('#pokemon_id').innerHTML;
    const name = a.querySelector('#pokemon_name').innerHTML;

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then(response => response.json())
        .then(data => {
            var description;

            for (let i = 0; i < data.flavor_text_entries.length; i++) {
                const element = data.flavor_text_entries[i];
                if (element.language.name == "de" && element.version.name == "alpha-sapphire" && element.flavor_text != "") {
                    description = element.flavor_text;
                    break;
                } else if (element.language.name == "de" && element.version.name == "shield" && element.flavor_text != "") {
                    description = element.flavor_text;
                }
            }

            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => {
                switch (id) {
                    case id < 10:
                        id = "00" + id;
                        break;
                    case id < 100:
                        id = "0" + id;
                        break;
                    default:
                        break;
                }

                var types;

                for (let i = 0; i < Pokemon.length; i++) {
                    const element = Pokemon[i];
                    if (element.id == id) {
                        types = element.types;
                        break;
                    }
                }
            
                template = `
                <div class="cover">
                    <div class="detail_view" id="detailed_view">
                        <div class="detail_title">
                            <p>${name}</p>
                            <p>Nr. ${id}</p>
                        </div>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="pokemon">
                        <p class="detail_desc">${description}</p>
                        <div class="detail_facts">
                            <div>
                                <p class="detail_fact_data">${data.weight / 10}kg</p>
                                <p class="detail_fact_title">Gewicht</p>
                            </div>
                            <div>
                                <p class="detail_fact_data">${data.height / 10}m</p>
                                <p class="detail_fact_title">Gr????e</p>
                            </div>
                            <div>
                                ${types.map(type => getTypeDiv(type)).join("")}
                            </div>
                        </div>
                    </div>
                </div>`
            
                if (document.querySelectorAll(".detail_view")[0]) document.querySelectorAll(".detail_view")[0].remove();
                
                website.innerHTML += template;

                const detail_view = document.getElementById('detailed_view');
                detail_view.style.top = "10vh";
                detail_view.style.left = "clacl(50% - 256px)";

                const cover = document.querySelector('.cover');
                cover.addEventListener('click', function() {
                    cover.remove();
                });
            })
        })
}

//********fishiinc********
//Normale Pokemon (10):
//#2 - Bisaknosp, #21 - Habitak, #27 - Sandan, #63 - Abra, #99 - Kingler, #104 - Tragosso, #135 - Blitza, #138 - Amonitas, #149 - Dragoran, #195 - Morlord
//Shiny Pokemon (2):
//#5 - Glutexo, #123 - Sichlor