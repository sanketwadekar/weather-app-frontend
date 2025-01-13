import { WeatherState } from "../App";
import MapComponent from "./MapComponent";

interface WeatherDetailsProps {
	details: {
		date: string;
		weatherCodeDescription: string;
		temperatureMax: string;
		temperatureMin: string;
		apparentTemperature: string;
		sunriseTime: string;
		sunsetTime: string;
		humidity: string;
		windSpeed: string;
		visibility: string;
		cloudCover: string;
	};
	onClose: () => void;
	isSlideIn: any;
	globalState: WeatherState
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({
	details,
	onClose,
	isSlideIn,
	globalState,
}) => {
	let tweetMessage = `The temperature in ${globalState.city}, ${globalState.state} on ${details.date} is ${details.apparentTemperature}°F. The weather conditions are ${details.weatherCodeDescription} %23CSCI571WeatherSearch`;
	return (
		<div className={`new-content ${isSlideIn ? "slide-in" : "slide-out"}`}>
			<div className="">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<button className="btn btn-light" onClick={onClose}>
						&lt; List
					</button>
					<h5 className="text-center m-0">{details.date}</h5>
					<a
						className="btn btn-light p-1 twitter-share-button"
						href={`https://twitter.com/intent/tweet?text=${tweetMessage}`}
						data-size="large"
						target="_blank"
					>
						<i className="bi bi-twitter-x"></i>
					</a>
				</div>

				<table className="table table-striped text-start">
					<tbody>
						<tr>
							<th>Status</th>
							<td>{details.weatherCodeDescription}</td>
						</tr>
						<tr>
							<th>Max Temperature</th>
							<td>{details.temperatureMax}°F</td>
						</tr>
						<tr>
							<th>Min Temperature</th>
							<td>{details.temperatureMin}°F</td>
						</tr>
						<tr>
							<th>Apparent Temperature</th>
							<td>{details.apparentTemperature}°F</td>
						</tr>
						<tr>
							<th>Sun Rise Time</th>
							<td>{details.sunriseTime}</td>
						</tr>
						<tr>
							<th>Sun Set Time</th>
							<td>{details.sunsetTime}</td>
						</tr>
						<tr>
							<th>Humidity</th>
							<td>{details.humidity}%</td>
						</tr>
						<tr>
							<th>Wind Speed</th>
							<td>{details.windSpeed}mph</td>
						</tr>
						<tr>
							<th>Visibility</th>
							<td>{details.visibility}</td>
						</tr>
						<tr>
							<th>Cloud Cover</th>
							<td>{details.cloudCover}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<MapComponent lat={globalState?.lat} long={globalState?.long} />
		</div>
	);
};

export default WeatherDetails;
