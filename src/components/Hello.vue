<template>
  <div class="hello">
    <a @click="invisible">Voir les invisibles</a>

    <form>
      <input type="text" placeholder="name" v-model="newUser.name">
      <input type="text" placeholder="email" v-model="newUser.email">
      <input type="checkbox" id="test6" checked="checked" v-model="newUser.enable "><label for="test6">Est-il visible ?</label>
      <button @click="add " type="button ">Créer</button>
    </form>
    <!--<div v-for="user in users ">
      <p>{{user.name}}</p>
      <a>{{user.email}}</a>
      <a @click="remove(user.id) ">Supprimer</a>
    </div>-->
    <ul class="collection " v-for="user in users ">
      <li class="collection-item ">
        {{user.name}}
      </li>
      <li class="collection-item ">{{user.email}}</li>
      <a href="#! " class="secondary-content " @click="remove(user.id)
        "><i class="material-icons ">delete</i></a>
        <router-link class="secondary-content " :to="{name: 'Detail', params :{ id: user.id}} ">Voir le détail</router-link>

    </ul>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data() {
      return {
        users: [],
        newUser: {
          name: '',
          email: '',
          enable: null
        }
      }
    },
    methods: {
      add() {
        this.$http.post('http://localhost:3000/newUser', this.newUser).then((res) => {
          this.users = res.body;
          this.newUser = {
            name: '',
            email: '',
            enable: null
          };
        });
      },
      remove(id) {
        this.$http.get(`http://localhost:3000/remove/${id}`).then((res) => {
          this.users = res.body;
        });
      },
      invisible() {
        this.$http.get('http://localhost:3000/invisible').then((res) => {
          this.users = res.body;
        });
      }
    },
    created() {
      this.$http.get('http://localhost:3000/').then((res) => {
        this.users = res.body;
      });
    }
  }

</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  
  .hello {
    width: 800px;
    margin: auto;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  .collection {
    text-align: left;
  }
  
  a {
    color: #42b983;
    padding: 10px 20px;
  }
  
  .collection .collection-item {
    border-bottom: 0px;
  }
</style>