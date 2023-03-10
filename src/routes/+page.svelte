<div class="body">
    <h1>Ehrecharte</h1>

    <p>Local storage: {card.count}</p>
    <button on:click={addStamp}>New Stamp</button>

    {#each card.stamps as stamp}
        <p>{stamp.stampNumber}: {stamp.date}</p>
    {/each}

</div>

<script lang="ts">
    import {onDestroy} from "svelte";
    import {cardStore} from "../$lib/store";
    import type {Card} from "../$lib/@types";

    let card: Card
    const store = cardStore()
    const unsubscribe = store.subscribe(c => card = c)

    function addStamp(): void {
        const stampAdded = store.addStamp()  // store always has the addStamp() method if executed in the browser
        console.log('result (stamp added):', stampAdded)
        // TODO: do something with the result (error msg...)
    }

    onDestroy(unsubscribe)

</script>

<style>

    /* ... */

</style>
