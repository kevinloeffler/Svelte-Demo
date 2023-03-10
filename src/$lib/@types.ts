export type Stamp = {
    stampNumber: number,
    date: Date,
}

export type Card = {
    holder: string,
    count: number,
    stamps: [Stamp?],
}
