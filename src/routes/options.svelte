<script lang="ts">
  import { options, userDefaultOptions } from '$lib/options/stores';
  import { defaultOptions } from '$lib/options/defaultOptions';

  $: disabled = $options.length <= 2;
</script>

<svelte:head>
  <title>Options</title>
</svelte:head>

<main class="p-4">
  <section class="border-black border mx-auto max-w-xl">
    <div class="grid options-list mx-auto justify-center gap-y-2">
      {#each $options as option,i}
      <div class:bg-gray-300={i%2===1} class:text-black={i%2===1} class="flex justify-center items-center py-2">{option.icon}</div>
      <div class:bg-gray-300={i%2===1} class:text-black={i%2===1} class="items-center py-2 px-2"
        contenteditable="true" bind:innerHTML={option.text}
        spellcheck="false"
      >
      </div>
      <div class:bg-gray-300={i%2===1} class:text-black={i%2===1} class="flex justify-center items-center py-2">
        <button class="btn btn-xs btn-outline btn-circle"
          {disabled}
          class:btn-disabled={disabled}
          on:click={()=>{
            let uid = i+1;
            const newOptions = [...$options.slice(0,i), ...$options.slice(i+1).map(t=>{return {...t, id:uid++}})];
            options.set(newOptions);
          }}
        >
          ❌
        </button>
      </div>
      {/each}
    </div>
  </section>
</main>

<div class="mx-auto flex justify-center gap-4">
  <button 
    class="btn btn-xs"
    on:click={()=>{
      userDefaultOptions.set($options);
    }}
  >
    Set as default
  </button>
  <button 
    class="btn btn-xs"
    on:click={()=>{
      userDefaultOptions.set(defaultOptions);
      options.set(defaultOptions);
    }}
  >
    Reset
  </button>
</div>
<footer class="py-4 max-w-xl mx-auto flex justify-center">
  <a href="/" sveltekit:prefetch class="btn btn-sm btn-primary">
    Back to Spinner
  </a>
</footer>


<style>
  .options-list {
    grid-template-columns: 5ch calc(100% - 10ch - 1px) 5ch;
  }
</style>
