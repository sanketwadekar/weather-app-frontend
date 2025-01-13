import { useEffect, useState } from "react";
import { WeatherState } from "../App";
import { getFavorites, deleteFavorite } from "./favorites";
import { findLocation } from "./gmaps";
import { getStateCodeFromName } from "./Form";
import { fetchWeatherDetails } from "./backend";

type CityTableProps = {
	globalState: WeatherState;
	setGlobalState: (state: WeatherState) => void;
	setActiveTab: (state: string) => void;
};

const FavoritesTable: React.FC<CityTableProps> = ({
	globalState,
	setGlobalState,
	setActiveTab,
}) => {
	const [data, setData] = useState<any[] | null>(null);

	useEffect(() => {
		(async function () {
			try {
				let favorites = await getFavorites();
				setData(favorites);
			} catch (error) {
				console.error("Failed to fetch favorites:", error);
			}
		})();
	}, []);

	async function showWeatherDetails(city: string, state: string) {
		try {
			let locationDetails = await findLocation(
				"",
				city,
				getStateCodeFromName(state)
			);
			console.log(locationDetails);
			let latitude = locationDetails.results[0].geometry.location.lat;
			let longitude = locationDetails.results[0].geometry.location.lng;
			setActiveTab("results");
			setGlobalState({ ...globalState, loading: 50 });
			let weatherDetails = await fetchWeatherDetails(latitude, longitude);
			globalState.weather = weatherDetails;
			globalState.city = city;
			globalState.state = state;
			globalState.lat = latitude;
			globalState.long = longitude;
			globalState.loading = null;
			setGlobalState({ ...globalState });
		} catch (err: any) {
			setGlobalState({ ...globalState, error: err });
		}
	}
	return (
		<>
			{data?.length === 0 ? (
				<div className="alert alert-warning" role="alert">
					Sorry! No records found
				</div>
			) : (
				<table className="table text-start">
					<thead>
						<tr>
							<th>#</th>
							<th>City</th>
							<th>State</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{data?.map((item: any, index: number) => (
							<tr key={item.id}>
								<td>{index + 1}</td>
								<td>
									<a
										className=""
										href="#"
										onClick={() => {
											showWeatherDetails(item.city, item.state);
										}}
									>
										{item.city}
									</a>
								</td>
								<td>
									<a
										className=""
										href="#"
										onClick={() => {
											showWeatherDetails(item.city, item.state);
										}}
									>
										{item.state}
									</a>
								</td>
								<td>
									<i
										className="bi bi-trash-fill"
										onClick={() => {
											deleteFavorite(item.city, item.state);
											let newData = data?.filter((s)=> s.city != item.city || s.state != item.state)
											setData([...newData])
										}}
										style={{ cursor: "pointer" }}
									></i>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	);
};

export default FavoritesTable;
