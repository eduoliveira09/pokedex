<template>
  <div class="content">
    <h3>Welcome to my Pokedex!</h3>
    <p>Please use the list below to learn more about Pokémon. </p>
    <ul>
      <li v-for="(item, index) in results" :key="index">
         <router-link :to="/form/ + item.name">
        <div class="pokemon-item" v-if="(index + 1 + list.offset) <= 898">
          <div class="pokemon-image"><img :src=" 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (index + 1 + list.offset) + '.png'"></div>
          <div class="pokemon-number"># {{ index + 1 + list.offset }}</div>
          <div class="pokemon-name">{{ item.name }}</div>
        </div>
        </router-link>
      </li>
    </ul>

    <div class="navigation"> <button @click="goPrevious()" :disabled="!buttonState.previous" class="pokemon-button">Previous</button> <button @click="goNext()" :disabled="!buttonState.next" class="pokemon-button">Next</button></div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'List',
  props: {
  },
  data: function() {
  return {
    list: {
      url: 'https://pokeapi.co/api/v2/pokemon?limit=',
      urlPrevious: '',
      urlNext: '',
      limit: 20,
      offset: 0,
    },
    buttonState: {
      previous: false,
      next: true,
    },
    results: [],
  };
},
created (){
  try {
    this.list.url  = this.list.url + this.list.limit + '&offset=' + this.list.offset;
    this.getList();
    } catch (error) {
      console.log(error);
    }
},
methods: {
  getList: async function() {
    try {
      // Read API
      let temp = '';
      temp = (await axios.get(this.list.url)).data;
      this.results = temp.results;
      this.list.listPrevious = temp.previous;
      this.list.urlNext = temp.next;
      //Manage pagination button status
      if (this.list.offset <= 0) {
          this.buttonState.previous = false;
          this.buttonState.next = true;
      } else  if (this.list.offset >= 880) {
          this.buttonState.previous = true;
          this.buttonState.next = false;
        } else {
          this.buttonState.previous = true;
          this.buttonState.next = true;
        } 
    } catch (error) {
      console.log(error);
    }
  
  },
  goPrevious: function() {
    try {
      // Prevent fast clicking
      this.buttonState.previous = false;
      this.buttonState.next = false;
      // Update URL and read API again
      this.list.url = this.list.listPrevious;
      this.list.offset -= this.list.limit;
      this.getList();
    } catch (error) {
      console.log(error);
    }
  },
  goNext: function() {
    try {
      // Prevent fast clicking
      this.buttonState.previous = false;
      this.buttonState.next = false;
      // Update URL and read API again
      this.list.url = this.list.urlNext;
      this.list.offset += this.list.limit;
      this.getList();
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
  padding-top: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: rgb(22, 82, 150);
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.content {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.19);
  padding: 0 5px;
}

.pokemon-item {
  margin: 0 auto;
  width: 250px;
  height: 200px;
}

.pokemon-image {
  margin: 0 auto;
  background: radial-gradient(circle, rgba(238,238,174,1) 0%, rgba(148,187,233,1) 100%);
  border-radius: 25px;
  width: 150px;
  height: 100px;
}
.pokemon-number {
  font-weight: bold;
}

.pokemon-name {
  font-weight: bold;
}

.pokemon-name:first-letter {
  text-transform: uppercase
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
</style>
