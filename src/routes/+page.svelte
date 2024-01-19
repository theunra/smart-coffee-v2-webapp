<script>
  const api_url = '/data';

    const GetData = async () => {
        const response = await fetch(`${api_url}`, {
        method : 'GET',
          });
        const data = await response.json();
        console.log(data);
    }
  
</script>

<h1>Welcome to SvelteKitosss</h1>
<p>{api_url}</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={GetData}>get</button>
