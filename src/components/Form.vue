<template>
  <div class="content">
   
   <div class="pokemon-name"># {{ currentPokemon.id }}</div>
   <div class="pokemon-name"> {{ currentPokemon.name }}</div>
   <div class="pokemon-image"><img :src="currentPokemon.image"></div>

   <h3>Type</h3>
   <ul>
     <li v-for="(item, index) in currentPokemon.types" :key="index">
        {{ currentPokemon.types[index] }}
     </li>
   </ul>

  <h3>Evolutions</h3>
   <ul>
     <li v-for="(item, index) in currentPokemon.chain.id" :key="index">
       <a @click="reloadPokemon(currentPokemon.chain.name[index])">
       <div class="pokemon-image-evolution"><img :src=" 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + currentPokemon.chain.id[index] + '.png'"></div>
        <li>{{ currentPokemon.chain.name[index] }} # {{ currentPokemon.chain.id[index] }}</li>
        </a>
     </li>
   </ul>

   <h3>Abilities</h3>
   <ul>
     <li v-for="(item, index) in currentPokemon.abilities" :key="index">
        {{ currentPokemon.abilities[index] }}
     </li>
   </ul>

   <h3>Stats</h3>
   <ul>
     <li class="stats-box">HP: <a>{{ currentPokemon.stats[0] }}</a></li>
     <li class="stats-bar" :style="{ width: currentPokemon.stats[0] + 'px'}" >.</li>
     <li class="stats-box">Attack: <a>{{ currentPokemon.stats[1] }}</a></li>
     <li class="stats-bar" :style="{ width: currentPokemon.stats[1] + 'px'}" >.</li>
     <li class="stats-box">Defense: <a>{{ currentPokemon.stats[2] }}</a></li>
     <li class="stats-bar" :style="{ width: currentPokemon.stats[2] + 'px'}" >.</li>
     <li class="stats-box">Special Attack: <a>{{ currentPokemon.stats[3] }}</a></li>
     <li class="stats-bar" :style="{ width: currentPokemon.stats[3] + 'px'}" >.</li>
     <li class="stats-box">Special Defense: <a>{{ currentPokemon.stats[4] }}</a></li>
     <li class="stats-bar" :style="{ width: currentPokemon.stats[4] + 'px'}" >.</li>
     <li class="stats-box">Spped: <a>{{ currentPokemon.stats[5] }}</a></li>
     <li class="stats-bar" :style="{ width: currentPokemon.stats[5] + 'px'}" >.</li>
   </ul>


  <div class="navigation"><router-link to="/list"><button class="pokemon-button">Back to list</button></router-link></div>
    
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Form',
  props: {
  },
  data: function() {
  return {
    url: {
      pokemon: 'https://pokeapi.co/api/v2/pokemon/',
      species: 'https://pokeapi.co/api/v2/pokemon-species/',
      chain: '',
    },
    currentPokemon: {
      id: '',
      name: '',
      image: '',
      types: [],
      rawChain: '',
      chain: {
        name: [],
        id: [],
      },
      abilities: [],
      stats: [],
    },
    results: '',

  };
},
created (){
  try {
    this.getPokemon(this.$route.params.name, true);
  } catch (error) {
    console.log(error);
  }
},
methods: {
  getPokemon: async function(pkmName, first) {
    try {
      //Read API
      let temp = '';
      temp = (await axios.get(this.url.pokemon + pkmName)).data;
      this.results = temp;
      this.currentPokemon.id = this.results.id;
      this.currentPokemon.name = this.results.name;
      this.currentPokemon.image = this.results.sprites.front_default;
      //Clean types
      this.currentPokemon.types = [];
      //Read types
      for (let i = 0; i < this.results.types.length; i++) {
                this.currentPokemon.types.push(this.results.types[i].type.name);
              }
      //Clean abilities
      this.currentPokemon.abilities = [];
      //Read abilities
      for (let i = 0; i < this.results.abilities.length; i++) {
                this.currentPokemon.abilities.push(this.results.abilities[i].ability.name);
              }
      //Clean stats
      this.currentPokemon.stats = [];
      //Read stats
      for (let i = 0; i < 6; i++) {
                this.currentPokemon.stats.push(this.results.stats[i].base_stat);
              }
      //Get species for evolutions
      if (first) {
        temp = (await axios.get(this.url.species + this.currentPokemon.id)).data;
        this.url.chain = temp.evolution_chain.url;
        this.getChain();
      }     
    } catch (error) {
      console.log(error);
    }
  },

  getChain: async function() {
  try {
    //Read API
    let temp = '';
    temp = (await axios.get(this.url.chain)).data;
    this.currentPokemon.rawChain = temp;
    // Clean chain
    this.currentPokemon.chain.name = [];
    // Evolutions - Level 1
    this.currentPokemon.chain.name.push(this.currentPokemon.rawChain.chain.species.name);
    // Evolutions - Level 2
    if (typeof this.currentPokemon.rawChain.chain.evolves_to !== 'undefined') {
        for (let i = 0; i < this.currentPokemon.rawChain.chain.evolves_to.length; i++) {
            this.currentPokemon.chain.name.push(this.currentPokemon.rawChain.chain.evolves_to[i].species.name);
            // Evolutions - Level 3
            if (this.currentPokemon.rawChain.chain.evolves_to[i].evolves_to !== 'undefined') {
              for (let j = 0; j < this.currentPokemon.rawChain.chain.evolves_to[i].evolves_to.length; j++) {
                this.currentPokemon.chain.name.push(this.currentPokemon.rawChain.chain.evolves_to[i].evolves_to[j].species.name);
              }
            }
        }
    }
    //Get evolutions ID
    for (let i = 0; i < this.currentPokemon.chain.name.length; i++) {
    //Get ID from name
      temp = (await axios.get(this.url.pokemon + this.currentPokemon.chain.name[i])).data;
      this.currentPokemon.chain.id.push(temp.id);
    }     
  } catch (error) {
    console.log(error);
  }
  },

  reloadPokemon: async function(name) {
    try {
      // Read API again for evolution
      this.getPokemon(name, false);
    } catch (error) {
      console.log(error);
    }
  },
},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

li:first-letter {
  text-transform: uppercase;
}

a {
  color: rgb(22, 82, 150);
  font-weight: bold;
  cursor: pointer;
}

.stats-bar {
  background-color: rgb(148,187,233);
  color: rgb(148,187,233);
}

.content {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.19);
  padding: 0 5px;
}

.pokemon-name {
  padding-top: 20px;
  font-size: 26px;
  font-weight: bold;
}

.pokemon-name:first-letter {
  text-transform: uppercase;
}

.pokemon-image {
  margin: 0 auto;
  background: radial-gradient(circle, rgba(238,238,174,1) 35%, rgb(33, 56, 189) 100%);
  border-radius: 25px;
  width: 150px;
  height: 100px;
}

.pokemon-image-evolution {
  margin: 0 auto;
  background: rgb(238,238,174);
  background: radial-gradient(circle, rgba(238,238,174,1) 0%, rgba(148,187,233,1) 100%);
  border-radius: 25px;
  width: 100px;
  height: 90px;
}

.pokemon-button {
  font-family: 'Noto Sans Display', sans-serif;
  background-color: white;
  border-color: rgb(148,187,233);
  border-radius: 5px;
  font-weight: bold;
  color: rgb(148,187,233);
  padding: 3px 5px 3px 5px;
}

.pokemon-button:disabled {
  color: rgb(180, 180, 180);
  border-color: rgb(180, 180, 180);
}

.navigation {
  padding-bottom: 20px;
}

.stats-box{
  display: block;
}
</style>
