<script lang="ts">
  import {tick} from 'svelte';
  import {scale,slide,fly} from 'svelte/transition';
  let rotate = false;
  let final = false;
  let adjust = false;
  const allOptions = ['🍣', '🐟', '🦀', '🍕', '🥗', '🦞', '🦪', '🦐', '🦑', '🌶️']
  let options = ['🍣', '🐟', '🦀', '🍕', '🥗', '🦞', '🦪', '🦐', '🦑', '🌶️'];
  //['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  let disabled = false;

  $: n = options.length;
  $: selection = getRandomInt(1,n);
  $: if(selection) {
    reset();
  }
  $: if(n) {
    reset();
  }

  const turns = 5.25;

  function spinWheel() {
    rotate = true;
    disabled = true;
    setTimeout(()=>{adjust=true;},500);
    setTimeout(()=>{disabled=false; final=true;},1000);
  }
  function reset() {
    rotate = false;
    final = false;
    adjust = false;
  }
  function getRandomInt(min: number, max: number): number { 
	  return Math.floor(Math.random() * (max - min + 1)) + min;
  }
</script>

<main>
  <section class="grid justify-items-center relative mt-8">
    {#key options}
    <ul class:rotate class="rotate-{selection}-{n} background-{n}"
      in:scale={{start:1.1, opacity:1}}
    >
      {#each options as option,i}
        <li 
          class="position-{i+1}-{n}"
          class:text-6xl={n < 5}
          class:text-5xl={n >= 5 && n < 8}
          class:text-4xl={n>=8}
          on:click={()=>{
            if (!(rotate&&!final) && n>=3){
              options = [...options.slice(0,i), ...options.slice(i+1)];
            }
          }}
        >
          <span class:adjust>{option}</span>
        </li>
      {/each}
    </ul>
    {/key}
    {#if final}
    <div 
      class="absolute wheel-center p-2"          
      class:text-6xl={n < 5}
      class:text-5xl={n >= 5 && n < 8}
      class:text-4xl={n>=8}
      transition:scale
    >
      {options[selection-1]}
    </div>
    {/if}
    <div class="absolute arrow-head">
    </div>
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
          selection = getRandomInt(1,n);
          await tick();
          setTimeout(spinWheel,250)
        }}
      >
        Spin the wheel
      </button>
    </div>
    {#if final}
      <div class="p-4 flex gap-4 items-center justify-center" in:slide={{delay: 400}}>
        <div class="text-6xl">
          {options[selection-1]}
        </div>
        <div
          in:fly={{delay: 800, x: -50}}
        >
          Text
        </div>
      </div>
    {/if}

    <button class="btn" on:click={()=>{options=allOptions.slice(0,n-1)}}>
      -
    </button>
    <button class="btn" on:click={()=>{options=allOptions.slice(0,n+1)}}>
      +
    </button>
  </section>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    width: 99vw;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ul { 
		list-style: none;
		position: relative;
		transform-origin: center;
		width: var(--spinner-width);
		aspect-ratio: 1/1;
		display: grid;
		place-items: center;
		box-sizing: border-box;
		border-radius: 50%;
    border: 4px solid saddlebrown;
	}
	
	.rotate{
		animation: rotate var(--spin-time) ease-in-out forwards;
	}
	.adjust{
		transform: rotate(calc(0turn - var(--rotate-angle)));
	}
	
	li {
		display: grid; place-items: center; position: absolute; aspect-ratio: 1/1; padding: 0.25em;
		box-sizing: border-box; 
		border-radius: 50%;
	}


  @keyframes rotate {
		100% {
			transform: rotate(calc(4turn + var(--rotate-angle)));
		}
	}

  .wheel-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid black;
    background: #eeeeeeff;
    animation-name: blinkingBG;
    animation-duration: 0.3s;
    animation-iteration-count: 5;
    animation-timing-function: ease-in-out;

  }

  .arrow-head {
    width: 0; 
    height: 0; 
    border-left:  calc(var(--spinner-radius) / 20) solid  transparent;
    border-right: calc(var(--spinner-radius) / 20) solid transparent;
    border-top:   calc(var(--spinner-radius) / 10) solid #555;
    top: calc(var(--spinner-radius) / -10 + 0.25rem);
  }

  @keyframes blinkingBG {
    0% {
      background-color: red;
      transform: translate(-50%, -50%) scale(1.05);
    }
    25% {
      background-color: yellow;
      transform: translate(-50%, -50%) scale(0.95) rotate(5deg);
    }
    50% {
      background-color: green;
      transform: translate(-50%, -50%) scale(1.05);
    }
    75% {
      background-color: blue;
      transform: translate(-50%, -50%) scale(0.95) rotate(-5deg);
    }
    100% {
      background-color: violet;
      transform: translate(-50%, -50%) scale(1.05);
    }
  }
</style>
