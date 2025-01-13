export async function findLocation(street: string, city: string, state: string): Promise<any> {
  const urlParams = new URLSearchParams({
    address: `${street}, ${city}, ${state}`,
    key: `${process.env.REACT_APP_MAPS_API_KEY}`,
  });
  
  const response = await fetch("https://maps.googleapis.com/maps/api/geocode/json?" + urlParams.toString());
  
  let data: any = response.json()
  if (data.status == "ZERO_RESULTS") {
    throw new Error("Please enter a valid address.")
  }
  return data;

  throw new Error("Error in fetching location");
}
