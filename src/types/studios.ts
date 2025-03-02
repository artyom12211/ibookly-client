interface Studio {
    id: string,
    title: string,
    description: string,
    address: string,
    metro: string,
    phone: string,
    price_range: number[],
    total_square:    number,
    shooting_square: number,
    rooms: number,
    height: number,
    telegram_channel: string,
    telegram_contact: string,
    // min_rent_hour: number,
    images_urls: string[]
}

export type {
    Studio
}