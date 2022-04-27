<script lang="ts">
  import {tick} from 'svelte';
  import {scale,slide,fly,crossfade,fade} from 'svelte/transition';
  import {flip} from 'svelte/animate';
  const [send, receive] = crossfade({});
  import {icons} from './icons';

  // spinner and button
  let firstSpin = true;
  let rotate = false;
  let final = false;
  let completed = false;
  let adjust = false;
  let disabled = false;

  // new addition
  let selectedIcon = 'sushi';
  let name = ""
  $: addDisabled = (name === "");

  // array
  let uid = 0;
  const initialOptions = [
    { id: uid++,  inPlay: true, icon: '🍣', text: 'Kuro Maguro'},
    { id: uid++,  inPlay: true, icon: '🍕', text: 'd.o.c.'},
    { id: uid++,  inPlay: true, icon: '🥗', text: 'Elemen'},
    { id: uid++,  inPlay: true, icon: '🍔', text: 'Black Tap'},
    { id: uid++,  inPlay: true, icon: icons.tomato, text: 'Hai Di Lao'},
    { id: uid++,  inPlay: false, icon: '🦀', text: 'Crab'},
    { id: uid++,  inPlay: false, icon: '🦪', text: 'Oyster'},
    { id: uid++,  inPlay: false, icon: '🐟', text: 'Fish'},
    { id: uid++,  inPlay: false, icon: '🦞', text: 'Lobster'},
    { id: uid++,  inPlay: false, icon: '🦐', text: 'Prawn'},
    { id: uid++,  inPlay: false, icon: '🦑', text: 'Octopus'},
    { id: uid++,  inPlay: false, icon: '🌶️', text: 'Xiao Long Kan'},
    { id: uid++,  inPlay: false, icon: icons.cook, text: 'Bread Street Kitchen'},
  ];
  let options = initialOptions.map(item=>{
    return {...item}
  });

  $: n = options.filter(t=>t.inPlay).length;
  $: selection = getRandomInt(1,n);
  $: if(selection) {
    resetSpinner();
  }
  $: if(n) {
    resetSpinner(true);
  }

  function spinWheel() {
    firstSpin = false;
    rotate = true;
    disabled = true;
    setTimeout(()=>{adjust=true;},500);
    setTimeout(()=>{disabled=false; final=true;},1000);
    setTimeout(()=>{completed=true;},3500);
  }
  function resetSpinner(resetFirstSpin=false) {
    firstSpin = resetFirstSpin ? true : firstSpin;
    rotate = false;
    final = false;
    adjust = false;
    completed = false;
  }
  function getRandomInt(min: number, max: number): number { 
	  return Math.floor(Math.random() * (max - min + 1)) + min;
  }
</script>

<main>
  <!--Spinner-->
  <section class="grid justify-items-center relative">
    <ul class:rotate class="rotate-{selection}-{n} background-{n}"
      in:scale={{start:1.1, opacity:1}}
    >
      <!--Options-->
      {#each options.filter(t=>t.inPlay) as option,i (option.id)}
        <li 
          class="position-{i+1}-{n}"
          class:text-6xl={n < 5}
          class:text-5xl={n >= 5 && n < 8}
          class:text-4xl={n>=8}
          on:click={()=>{
            if (!(rotate&&!final) && n>=3){
              option.inPlay = false;
            }
          }}
          in:receive={{key: option.id}}
          out:send={{key: option.id}}
          animate:flip
        >
          <span class:adjust>{option.icon}</span>
        </li>
      {/each}
    </ul>
    <!--Center of wheel-->
    {#if firstSpin && !rotate}
      <button 
        class="btn-primary spinner-button absolute wheel-center"
        in:scale
        out:fade
        on:click={async ()=>{
          if (!rotate){
            spinWheel();
            return
          }
          selection = getRandomInt(1,n);
          resetSpinner();
          await tick();
          setTimeout(spinWheel,250)
        }}
      >
        Spin the wheel
      </button>
    {:else if final && !completed}
      <div 
        class="absolute wheel-center winner p-2 bg-yellow-100"          
        class:text-6xl={n < 5}
        class:text-5xl={n >= 5 && n < 8}
        class:text-4xl={n>=8}
        transition:scale
      >
        {options.filter(t=>t.inPlay)[selection-1].icon}
      </div>
    {:else if completed}
          <button 
        class="btn-primary spinner-button absolute wheel-center"
        in:scale
        out:fade
        on:click={async ()=>{
          if (!rotate){
            spinWheel();
            return
          }
          selection = getRandomInt(1,n);
          resetSpinner();
          await tick();
          setTimeout(spinWheel,250)
        }}
      >
        Spin again
      </button>
    {/if}
    <div class="absolute arrow-head">
    </div>
  </section>
  <!--Button and detailed outcome-->
  <section class="grid m-4">
    {#if final}
    <!--Detailed outcome-->
      <div class="flex justify-center" in:slide={{delay: 400}} out:slide>
        <div class="border border-black flex p-4 m-4 items-center justify-center gap-4 bg-yellow-100 font-bold font-serif">
          <div class="text-6xl">
            {options.filter(t=>t.inPlay)[selection-1].icon}
          </div>
          <div
            in:fly={{delay: 800, x: -50}}
          >
            {options.filter(t=>t.inPlay)[selection-1].text}
          </div>
        </div>
      </div>
    {/if}
  </section>
  <!--Extra Options-->
  <section>
  <div class="flex gap-2 flex-wrap m-4 justify-center">
    {#each options.filter(t=>!t.inPlay) as option (option.id)}
      <button 
        class="btn btn-accent btn-sm"
        class:disabled
        {disabled}
        on:click={()=>{
          if (n<=9){
            option.inPlay=true;
          }
        }}
        in:receive={{key: option.id}}
        out:send={{key: option.id}}
        animate:flip
      >
        {option.icon} {option.text}
      </button>
    {/each}
  </div>
  </section>
</main>

<section class="my-4 p-4 bg-gray-300 grid gap-4 justify-center">
  <div class="flex justify-center">
    <button 
      class="btn btn-primary btn-sm"
      class:btn-disabled={addDisabled}
      on:click={()=>{
        options = [...options, {id: uid++, inPlay: n<10, icon: icons[selectedIcon], text: name}];
        name=""
      }}
    >
      Add to {n>=10 ? 'options' : 'wheel'}
    </button>
  </div>
  <div class="flex justify-center">
    <input bind:value={name} type="text" placeholder="Name" class="input input-bordered w-full max-w-xs">
  </div>
  <div class="flex flex-wrap justify-center max-w-md">
    {#each Object.keys(icons) as iconName}
      <div
        class:bg-primary={iconName===selectedIcon}
        class="px-2 py-1 rounded-full cursor-pointer transition-colors duration-500"
        on:click={()=>{selectedIcon=iconName}}
      >
        {icons[iconName]}
      </div>
    {/each}
  </div>
</section>

<!--Reset-->
<div class="flex justify-center pb-4">
  <div>
    <button 
      class="btn btn-sm" 
      on:click={()=>{
        options = initialOptions.map(item=>{
          return {...item}
        });
        resetSpinner(true);
      }}
    >
        Reset
    </button> 
  </div>
</div>
  

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    width: 100vw;
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
    cursor: pointer;
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
    transition-property: none;
    transition-duration: 0s;
    transition-timing-function: none;
  }
  .winner {
    animation-name: blinkingBG;
    animation-duration: 0.3s;
    animation-iteration-count: 5;
    animation-timing-function: ease-in-out;
    border: 1px solid black;
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
