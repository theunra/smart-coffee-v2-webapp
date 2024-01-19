<script>
  const api_url = 'sites.saveforest.cloud/api';

    const GetData = ()=>{
    fetch(`${api_url}/get_data`, {
        method : 'GET',
      });
    }
  
</script>

<h1>Welcome to SvelteKitosss</h1>
<p>{api_url}</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button onclick="GetData()">get</button>
