export async function addFavorite(city: string, state: string) {
	try {
		let response = await fetch(`${process.env.REACT_APP_API_URL}/add-favorite`, {
			method: "POST",
			body: JSON.stringify({city, state}),
			headers: {"Content-Type": "application/json"}
		})
		if (response.status == 201) {
			return response.json();
		}
		return null
	} catch (err) {
		throw new Error("Error in adding a favorite")
	}
}

export async function deleteFavorite(city: string, state: string) {
	try {
		let response = await fetch(`${process.env.REACT_APP_API_URL}/delete-favorite`, {
			method: "POST",
			body: JSON.stringify({city, state}),
			headers: {"Content-Type": "application/json"}
		})
		if (response.status == 200) {
			return response.json();
		}
		return null
	} catch (err) {
		throw new Error("Error in deleting a favorite")
	}
}

export async function getFavorites() {
	try {
		let response = await fetch(`${process.env.REACT_APP_API_URL}/get-favorites`, {
			method: "GET"
		})
		if (response.status == 200) {
			return response.json();
		}
		return null
	} catch (err) {
		throw new Error("Error in fetching favorites")
	}
}

