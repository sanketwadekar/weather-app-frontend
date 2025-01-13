export async function autoDetectLocation(): Promise<any> {
  const response = await fetch("https://ipinfo.io/?token=2e1baa6ec39d97");

  if (response.status === 200) {
    let data: any = response.json()
    return data;
  }

  throw new Error("Error in fetching location");
}