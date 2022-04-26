<script lang="ts">
  import {tick} from 'svelte';
  import {scale} from 'svelte/transition';
  let rotate = false;
  let final = false;
  let adjust = false;
  let options = ['1', '2', '3', '4'];
  let disabled = false;
  $: n = options.length;

  const turns = 5.25;

  function spinWheel() {
    rotate = true;
    disabled = true;
    setTimeout(()=>{adjust=true;},1000);
    setTimeout(()=>{disabled=false; final=true;},4000);
  }
</script>

<main>
  <section class="grid justify-items-center relative">
    <ul class:rotate>
      {#each options as option}
        <li class:adjust>{option}</li>
      {/each}
    </ul>
    {#if final}
    <div class="absolute wheel-center p-2" transition:scale>
      Hello
    </div>
    {/if}
  </section>
  <section class="grid m-4">
    <div>
      <button 
        class="btn btn-primary"
        class:disabled
        {disabled}
        on:click={async ()=>{
          if (!rotate){
            spinWheel();
            return
          }
          rotate = false;
          final = false;
          adjust = false;
          await tick();
          setTimeout(spinWheel,500)
        }}
      >
        Spin the wheel
      </button>
    </div>
  </section>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    width: 100vw;
    box-sizing: border-box;
    min-height: 100vh;
  }
  ul { 
		list-style: none;
		position: relative;
		transform-origin: center;
		width: max(80vh, 80vh);
		aspect-ratio: 1/1;
		display: grid;
		place-items: center;
		background: conic-gradient(
			hsla(0, 100%, 50%, 0.5) 45deg,
			hsla(63, 100%, 50%, 0.5) 45deg,
			hsla(63, 100%, 50%, 0.5) 135deg,
			hsla(127, 100%, 50%, 0.5) 135deg,
			hsla(127, 100%, 50%, 0.5) 225deg,
			hsla(191, 100%, 50%, 0.5) 225deg,
			hsla(191, 100%, 50%, 0.5) 315deg,
			hsla(0, 100%, 50%, 0.5) 315deg
		);
		box-sizing: border-box;
		border-radius: 50%;
    border: 1px solid black;
	}
	
	.rotate{
		animation: rotate 4s ease-in-out forwards;
	}
	.adjust{
		transform: rotate(-.25turn);
	}
	
	li {
		width: 30px; height: 30px; display: grid; place-items: center; position: absolute;
		box-sizing: border-box; 
		border-radius: 50%;
	}
  li:nth-child(1) {
		right: 0.5em;
	}
	li:nth-child(2) {
		bottom: 0.5em;
	}
	li:nth-child(3) {
		left: 0.5em;
	}
	li:nth-child(4) {
		top: 0.5em;
	}

  @keyframes rotate {
		100% {
			transform: rotate(4.25turn);
		}
	}

  .wheel-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 1px solid black;
    box-sizing: border-box;
  }
</style>
