<template>
	<div class="hello">
		<p>{{user.name}} {{user.email}}</p>
	</div>
</template>

<script>
	export default {

		name: 'hello',
		data() {
			return {
				user: {}
			}
		},
		created() {
			this.$http.get(`http://localhost:3000/detail/${this.$route.params.id}`).then((res) => {
				this.user = res.body;
			});
		},
	}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1,
	h2 {
		font-weight: normal;
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
		color: #42b983;
	}
</style>