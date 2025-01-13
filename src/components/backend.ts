export async function fetchWeatherDetails(lat: number, long: number): Promise<any> {
  const urlParams = new URLSearchParams({
    lat: lat.toString(),
    long: long.toString()
  });

  const response = await fetch(`${process.env.REACT_APP_API_URL}/get-weather-details?` + urlParams.toString());

  if (response.status === 200) {
    return response.json();
  }

  throw new Error("Error in fetching weather details");
}
