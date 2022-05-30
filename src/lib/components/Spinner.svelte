<script lang="ts">
  import {tick} from 'svelte';
  import {scale,slide,fly,crossfade,fade} from 'svelte/transition';
  import {flip} from 'svelte/animate';
  const [send, receive] = crossfade({fallback: scale});
  import {icons} from '$lib/icons';
  import { options, userDefaultOptions } from '$lib/options/stores';

  const iconsArray = Object.keys(icons);

  let uid = $options.length+1;

  // spinner and button
  let firstSpin = true;
  let rotate = false;
  let final = false;
  let completed = false;
  let adjust = false;
  let disabled = false;

  // new addition
  let selectedIcon = iconsArray[getRandomInt(0,iconsArray.length-1)]
  let name = ""
  $: addDisabled = (name === "");
  $: n = checkOptions($options)
  $: selection = getRandomInt(1,n);
  $: if(selection) {
    resetSpinner();
  }
  $: if(n) {
    resetSpinner(true);
  }
  function checkOptions(options): number {
    if (options.filter(t=>t.inPlay).length >= 2) {
      return options.filter(t=>t.inPlay).length;
    }
    let k = 0;
    while (options.filter(t=>t.inPlay).length < 2){
      options[k].inPlay = true;
      k++;
    }
    return 2;
  }

  function spinWheel() {
    firstSpin = false;
    rotate = true;
    disabled = true;
    setTimeout(()=>{adjust=true;},500);
    setTimeout(()=>{final=true;},1000);
    setTimeout(()=>{disabled=false; completed=true;},3500);
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
      {#each $options.filter(t=>t.inPlay) as option,i (option.id)}
        <li 
          class="position-{i+1}-{n}"
          class:text-6xl={n < 5}
          class:text-5xl={n >= 5 && n < 8}
          class:text-4xl={n>=8}
          on:click={()=>{
            if (!disabled){
              if (n<3){
                const notInPlay = $options.filter(t=>!t.inPlay)
                if (notInPlay.length === 0){
                  return
                }
                notInPlay[getRandomInt(0,notInPlay.length-1)].inPlay = true;
              }
              option.inPlay = false;
            }
          }}
          in:receive={{key: option.id}}
          out:send|local={{key: option.id}}
          animate:flip
        >
          <span title="{option.text}" class:adjust>{option.icon}</span>
        </li>
      {/each}
    </ul>
    <!--Center of wheel-->
    {#if firstSpin && !rotate}
      <button 
        class="btn-primary spinner-button absolute wheel-center"
        in:scale
        out:fade|local
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
        class="absolute wheel-center winner p-2 bg-yellow-200 dark:bg-yellow-400"
        class:text-6xl={n < 5}
        class:text-5xl={n >= 5 && n < 8}
        class:text-4xl={n>=8}
        transition:scale
      >
        {$options.filter(t=>t.inPlay)[selection-1].icon}
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
  <!--Result-->
  <section class="grid m-4">
    {#if final}
    <!--Result-->
      <div class="flex justify-center" in:slide={{delay: 400}} out:slide>
        <div class="border border-black flex p-4 m-4 items-center justify-center gap-4 bg-yellow-200 dark:bg-yellow-400 font-bold font-serif text-black">
          <div class="text-6xl" in:fade={{delay:400}} out:slide>
            {$options.filter(t=>t.inPlay)[selection-1].icon}
          </div>
          <div
            in:fly={{delay: 800, x: -50}} out:slide
          >
            {$options.filter(t=>t.inPlay)[selection-1].text}
          </div>
        </div>
      </div>
    {/if}
  </section>
  <!--Extra Options-->
  <section>
  <div class="flex gap-2 flex-wrap m-4 justify-center max-w-md mx-auto">
    {#each $options.filter(t=>!t.inPlay) as option (option.id)}
      <button 
        class="btn btn-accent btn-sm"
        class:disabled
        {disabled}
        on:click={()=>{
          if (n>9){
            const inPlay = $options.filter(t=>t.inPlay)
            inPlay[getRandomInt(0,inPlay.length-1)].inPlay = false;
          } 
          option.inPlay=true;
        }}
        in:receive={{key: option.id}}
        out:send|local={{key: option.id}}
        animate:flip
      >
        {option.icon} {option.text}
      </button>
    {/each}
  </div>
  </section>
</main>

<section class="p-4 bg-gray-300 dark:bg-gray-700 grid gap-4 justify-center">
  <div class="flex justify-center">
    <button 
      class="btn btn-primary btn-sm"
      class:btn-disabled={addDisabled||disabled}
      on:click={()=>{
        if (n>9){
          const inPlay = $options.filter(t=>t.inPlay)
          inPlay[getRandomInt(0,inPlay.length-1)].inPlay = false;
        } 
        options.update(old=>[...old, {id: uid++, inPlay: true, icon: icons[selectedIcon], text: name}]);
        name="";
        selectedIcon = iconsArray[getRandomInt(0,iconsArray.length-1)];
        window.scrollTo({top: 0, behavior: 'smooth'});
      }}
    >
      Add to wheel
    </button>
  </div>
    <input 
      bind:value={name}
      type="text"
      placeholder="Name"
      class="input input-bordered w-full max-w-xs mx-auto input-primary"
      class:input-error={name===''}
    >
  <div class="flex flex-wrap justify-center max-w-md">
    {#each iconsArray as iconName}
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
<div class="flex justify-center py-4 gap-4">
  <div>
    <button 
      class="btn btn-sm" 
      on:click={()=>{
        options.set($userDefaultOptions.map(item=>{
          return {...item}
        }));
        resetSpinner(true);
        window.scrollTo({top: 0, behavior: 'smooth'});
      }}
    >
        Reset
    </button>
    <a class="btn btn-sm" sveltekit:prefetch href="options">Options</a>
    <a class="btn btn-sm" sveltekit:prefetch href="about">About</a>
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
