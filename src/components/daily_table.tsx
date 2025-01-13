import React from "react";

interface WeatherDetail {
	date: string;
	weatherCodeImage: string;
	weatherCodeDescription: string;
	temperatureMax: number;
	temperatureMin: number;
	windSpeed: number;
}

interface WeatherTableProps {
	weather: {
		daily_details: WeatherDetail[];
	} | null;
	switchToDetails: (index: number) => void;
}

const WeatherTable: React.FC<WeatherTableProps> = ({
	weather,
	switchToDetails
}) => {
	return (
		<table className="table text-start">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Date</th>
					<th scope="col">Status</th>
					<th scope="col">Temp. High (°F)</th>
					<th scope="col">Temp. Low (°F)</th>
					<th scope="col">Wind Speed (mph)</th>
				</tr>
			</thead>
			<tbody>
				{weather?.daily_details.map((detail, index) => (
					<tr key={index}>
						<th scope="row">{index + 1}</th>
						<td
							onClick={() => {
								switchToDetails(index);
							}}
						>
							<span className="btn btn-link">{detail.date}</span>
						</td>
						<td>
							<img
								className="d-inline"
								style={{ width: "2em" }}
								src={`${process.env.REACT_APP_API_URL}${detail.weatherCodeImage}`}
								alt="weather icon"
							/>
							<span>{detail.weatherCodeDescription}</span>
						</td>
						<td>{detail.temperatureMax}</td>
						<td>{detail.temperatureMin}</td>
						<td>{detail.windSpeed}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default WeatherTable;
