export interface OrderBy {
    sortTitle: string,
    title: string
}

export interface Property {
    id: number,
    kind: string,
    location: string,
    bedrooms: number,
    area: number
}

export interface Offer {
    id: number,
    offered_by: string,
    price: number,
    property: Property
}
