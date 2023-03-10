import {browser} from '$app/environment'
import {writable} from 'svelte/store'
import type {Card, Stamp} from "./@types";


const myCard: Card = {
    holder: '',
    count: 0,
    stamps: []
}


export const cardStore = () => {
    const internalStore = writable<Card>(myCard)
    if (!browser) {  // todo: handle SSR case
        return internalStore
    }

    // load card from local storage
    const storedCard = loadCardFromStorage('ec')
    if (storedCard != null) {
        console.log('loaded card from local storage')
        internalStore.set(storedCard)
    }

    function addStamp(): boolean {
        let status = false

        internalStore.update( (self: Card) => {
            if (checkIfDateIsToday(self.stamps[self.stamps.length - 1]?.date)) {
                status = false
                return self
            }

            const newStamp: Stamp = { stampNumber: self.count + 1, date: new Date() }

            self.count += 1
            self.stamps.push(newStamp)
            localStorage.setItem('ec', JSON.stringify(self))

            status = true
            return self
        })

        return status
    }

    function loadCard(): boolean {
        // todo: handle page load
    }

    return {
        subscribe: internalStore.subscribe,
        set: internalStore.set,
        update: internalStore.update,
        addStamp: addStamp,
    }
}


export function loadCardFromStorage(key: string): Card | null {
    const storedCard = localStorage.getItem(key)
    if (!storedCard) return null

    let parsedCard
    try {
        parsedCard = JSON.parse(storedCard)
    } catch (error) {
        // invalid cookie
        console.log(error)
        return null
    }

    const stamps = []
    for (const stamp of parsedCard.stamps) {
        stamps.push({
            stampNumber: stamp.stampNumber,
            date: new Date(stamp.date)
        })
    }
    parsedCard.stamps = stamps
    return parsedCard
}


function checkIfDateIsToday(date: Date | undefined): boolean {
    if (!date) return false

    const now = new Date()

    if (now.getFullYear() !== date.getFullYear()) return false
    if (now.getMonth() !== date.getMonth()) return false
    if (now.getDate() !== date.getDate()) return false

    if (now.getMinutes() !== date.getMinutes()) return false // TODO: remove, for testing only

    return true
}
