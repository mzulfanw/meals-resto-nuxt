export interface Meal {
  id: string
  name: string
  category: string
  area: string
  instructions: string
  thumbnail: string
  tags: string[]
  price: number
  ingredients: string[]
}

export interface CartItem {
  meal: Meal
  quantity: number
  note?: string
}
