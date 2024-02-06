export type Fooditem = {
    id: string,             // code
    name: string,           // generic_name
    brand: string,          // brands
    allergens: string[],    // allergens_hierarchy
    nutriscore: string,     // nutriscore_grade
    img: string,            // selected_images.front.display.es
    fat: number,            // fat_100g
    protein: number,        // proteins_100g
    fiber: number,          // fiber_100g
    carbs: number,          // carbohydrates_100g
    salt: number,           // salt_100g
    surgar: number          // sugars_100g
}

// Function that fetches from OpenFoodFacts API
export async function fetchFoodItemData(code: string): Promise<Fooditem | null> {
    try {
        //Request item using the barcode value
        const response = await fetch('https://world.openfoodfacts.org/api/v2/product/' + code); // Replace with your API endpoint

        // Response management
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Map the returned data
        const data = await response.json();
        const foodItem: Fooditem = {
            id: data.code,
            name: data.product.generic_name,
            brand: data.product.brands,
            allergens: data.product.allergens_hierarchy,
            nutriscore: data.product.nutriscore_grade,
            img: data.product.image_front_url,
            fat: data.product.nutriments.fat_100g,
            protein: data.product.nutriments.proteins_100g,
            fiber: data.product.nutriments.fiber_100g,
            carbs: data.product.nutriments.carbohydrates_100g,
            salt: data.product.nutriments.salt_100g,
            surgar: data.product.nutriments.sugars_100g,
        };

        return foodItem;
    } catch (error) {
        console.error('Error fetching food item data:', error);
        return null;
    }
}