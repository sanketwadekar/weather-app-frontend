import { useEffect, useState } from "react";
import { autoDetectLocation } from "./ipinfo.ts";
import { findLocation } from "./gmaps.ts";
import { fetchWeatherDetails } from "./backend.ts";
import useThrottle from "./useThrottle.ts";
import { initialAppState, WeatherState } from "../App.tsx";

type State = {
	code: string;
	name: string;
};

const stateCodes: Array<State> = [
	{ code: "AL", name: "Alabama" },
	{ code: "AK", name: "Alaska" },
	{ code: "AZ", name: "Arizona" },
	{ code: "AR", name: "Arkansas" },
	{ code: "CA", name: "California" },
	{ code: "CO", name: "Colorado" },
	{ code: "CT", name: "Connecticut" },
	{ code: "DE", name: "Delaware" },
	{ code: "FL", name: "Florida" },
	{ code: "GA", name: "Georgia" },
	{ code: "HI", name: "Hawaii" },
	{ code: "ID", name: "Idaho" },
	{ code: "IL", name: "Illinois" },
	{ code: "IN", name: "Indiana" },
	{ code: "IA", name: "Iowa" },
	{ code: "KS", name: "Kansas" },
	{ code: "KY", name: "Kentucky" },
	{ code: "LA", name: "Louisiana" },
	{ code: "ME", name: "Maine" },
	{ code: "MD", name: "Maryland" },
	{ code: "MA", name: "Massachusetts" },
	{ code: "MI", name: "Michigan" },
	{ code: "MN", name: "Minnesota" },
	{ code: "MS", name: "Mississippi" },
	{ code: "MO", name: "Missouri" },
	{ code: "MT", name: "Montana" },
	{ code: "NE", name: "Nebraska" },
	{ code: "NV", name: "Nevada" },
	{ code: "NH", name: "New Hampshire" },
	{ code: "NJ", name: "New Jersey" },
	{ code: "NM", name: "New Mexico" },
	{ code: "NY", name: "New York" },
	{ code: "NC", name: "North Carolina" },
	{ code: "ND", name: "North Dakota" },
	{ code: "OH", name: "Ohio" },
	{ code: "OK", name: "Oklahoma" },
	{ code: "OR", name: "Oregon" },
	{ code: "PA", name: "Pennsylvania" },
	{ code: "RI", name: "Rhode Island" },
	{ code: "SC", name: "South Carolina" },
	{ code: "SD", name: "South Dakota" },
	{ code: "TN", name: "Tennessee" },
	{ code: "TX", name: "Texas" },
	{ code: "UT", name: "Utah" },
	{ code: "VT", name: "Vermont" },
	{ code: "VA", name: "Virginia" },
	{ code: "WA", name: "Washington" },
	{ code: "WV", name: "West Virginia" },
	{ code: "WI", name: "Wisconsin" },
	{ code: "WY", name: "Wyoming" },
];

export function getStateNameFromCode(code: string) {
	let state: any;
	for (state of stateCodes) {
		if (state.code === code) {
			return state.name;
		}
	}
}

export function getStateCodeFromName(name: string) {
	let state: any;
	for (state of stateCodes) {
		if (state.name === name) {
			return state.code;
		}
	}
}

type AutoCompleteResult = {
	city: string;
	state: string;
};

type Prediction = {
	description: string;
	matched_substrings: {
		length: number;
		offset: number;
	}[];
	place_id: string;
	reference: string;
	structured_formatting: {
		main_text: string;
		main_text_matched_substrings: {
			length: number;
			offset: number;
		}[];
		secondary_text: string;
	};
	terms: {
		offset: number;
		value: string;
	}[];
	types: string[];
};

type PredictionsResponse = {
	predictions: Prediction[];
	status: string;
};

interface ChildComponentProps {
	setActiveTab: (tab: string) => void;
	globalState: WeatherState;
	setGlobalState: (value: WeatherState) => void; // Type for the setState function
}

const Form: React.FC<ChildComponentProps> = ({
	globalState,
	setGlobalState,
	setActiveTab,
}) => {
	const [street, setStreet] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const [state, setState] = useState<string>("");
	const [autoDetect, setAutoDetect] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [autoCompleteResults, setAutoCompleteResults] = useState<
		Array<AutoCompleteResult>
	>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleToggle = () => setIsOpen(!isOpen);

	const handleSelect = (value: string) => {
		setIsOpen(false);
		setState(value);
	};

	async function getAutoCompleteResults(name: string) {
		let response = await fetch(
			`${process.env.REACT_APP_API_URL}/autocomplete?input=${name}`
		);
		if (response.status != 200) {
			return setAutoCompleteResults([]);
		}
		let results: Array<AutoCompleteResult> = [];
		let data: PredictionsResponse = await response.json();
		data["predictions"].forEach((element) => {
			results.push({
				city: element["terms"][0]["value"],
				state: element["terms"][1]["value"],
			});
		});
		console.log(results)
		setAutoCompleteResults(results);
	}

	const handleCityChange = useThrottle((name: string) => {
		getAutoCompleteResults(name);
	}, 300);

	const clearFields = () => {
		setStreet("");
		setCity("");
		setState("");
		setAutoDetect(false);
		setAutoCompleteResults([]);
		setError(false);
	};

	function validateFields(): boolean {
		return (
			!autoDetect &&
			(street.trim().length === 0 ||
				city.trim().length === 0 ||
				state.trim().length === 0 || (stateCodes.find((v)=> {return v.name === state.trim()}) == undefined))
		);
	}

async function handleSubmit() {
		setActiveTab("results");
		try {
			if (validateFields()) {
				setError(true);
				return;
			}
			setGlobalState({ ...globalState, loading: 0 });
			let latitude: number;
			let longitude: number;
			let location: string = "";
			let displayState = state;
			let displayCity = city;
			setGlobalState({ ...globalState, loading: 30 });
			if (autoDetect) {
				let locationDetails = await autoDetectLocation();
				console.log(locationDetails);
				let coords = locationDetails.loc.split(",");
				latitude = parseFloat(coords[0]);
				longitude = parseFloat(coords[1]);
				location =
					locationDetails.city +
					", " +
					locationDetails.region +
					", " +
					locationDetails.country;
				displayState = locationDetails.region;
				displayCity = locationDetails.city;
			} else {
				let locationDetails = await findLocation(
					street,
					city,
					getStateCodeFromName(state)
				);
				console.log(locationDetails);
				latitude = locationDetails.results[0].geometry.location.lat;
				longitude = locationDetails.results[0].geometry.location.lng;
				location = locationDetails.results[0].formatted_address;
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
			setGlobalState({ ...globalState, loading: 50 });
			let weatherDetails = await fetchWeatherDetails(latitude, longitude);
			await new Promise((resolve) => setTimeout(resolve, 100));
			globalState.weather = weatherDetails;
			globalState.city = displayCity;
			globalState.state = displayState;
			globalState.lat = latitude;
			globalState.long = longitude;
			globalState.loading = 100;
			setGlobalState({ ...globalState });
			console.log(weatherDetails);
		} catch (err: any) {
			setGlobalState({ ...globalState, error: err });
		} finally {
			setGlobalState({ ...globalState, loading: null });
		}
	}

	return (
		<div className="container-sm">
			<div
				className="weather-search mt-2 px-2"
				style={{ backgroundColor: "#F2F2F2" }}
			>
				<h4 className="text-center">Weather Search⛅</h4>
				<form
					onSubmit={(e) => e.preventDefault()}
					className=""
					onClick={() => {
						setAutoCompleteResults([]);
					}}
				>
					<div className="">
						<div className="form-group row">
							<div className="col-md-1 col-12"></div>
							<div className="col-md-2 col-12 small">
								Street<span className="text-danger">*</span>
							</div>
							<div className="col">
								<input
									type="text"
									className={`form-control ${
										error && !street.trim().length && "is-invalid"
									}`}
									placeholder=" "
									value={street}
									onChange={(e) => {
										setStreet(e.target.value);
										setError(validateFields());
									}}
									disabled={autoDetect}
								/>
							</div>
							<div className="col-md-1 col-12"></div>
						</div>
						<div className="row">
							<div className="col-md-1 col-12"></div>
							<div className="col-md-2 col-12"></div>
							{error && !street.trim().length && (
								<div className="col text-danger small">
									Please enter a valid street
								</div>
							)}
						</div>
						<div className="dropdown row">
							<div className="col-md-1 col-12"></div>
							<div className="col-md-2 col-12 small">
								City<span className="text-danger">*</span>
							</div>
							<div className="col">
								<input
									type="text"
									className={`form-control ${
										error && !city.trim().length && "is-invalid"
									}`}
									placeholder=""
									value={city}
									onChange={(e) => {
										setCity(e.target.value);
										if (e.target.value.trim().length) {
											handleCityChange(e.target.value);
										} else {
											setAutoCompleteResults([]);
										}
										setError(validateFields());
									}}
									disabled={autoDetect}
								/>
								<ul
									className={`dropdown-menu ${
										autoCompleteResults.length ? "show" : ""
									}`}
									aria-labelledby="dropdownInput"
								>
									{autoCompleteResults.map((s, i) => {
										return (
											<li key={i}>
												<div
													className="dropdown-item"
													onClick={(e) => {
														setAutoCompleteResults([]);
														setCity(s["city"]);

														setState(getStateNameFromCode(s["state"]));
													}}
												>
													{s["city"]}
												</div>
											</li>
										);
									})}
								</ul>
							</div>
							<div className="col-md-1 col-12"></div>
						</div>
						<div className="row">
							<div className="col-md-1 col-12"></div>
							<div className="col-md-2 col-12"></div>
							{error && !city.trim().length && (
								<div className="col small text-danger">
									Please enter a valid city
								</div>
							)}
						</div>
						<div className="row">
							<div className="col-md-1 col-12"></div>
							<div className="col-md-2 col-12 small">
								State<span className="text-danger">*</span>
							</div>
							<div className="col-md-4">
								<input
									list="browsers"
									type="text"
									className="form-control"
									placeholder="Select your state"
									value={state}
									onChange={(e) => {
										setState(e.target.value);
										setError(validateFields());
									}}
									disabled={autoDetect}
								/>
								<datalist id="browsers">
									{stateCodes.map((s, i) => {
										return (
											<option
												value={s["name"]}
												key={i}
												onClick={(e) => {
													handleSelect(s["name"]);
												}}
											/>
										);
									})}
								</datalist>
							</div>
						</div>
					</div>
					<hr className="mx-2"></hr>
					<div className="text-center">
						<span className="mx-1">
							Autodetect Location<span className="text-danger">*</span>
						</span>
						<input
							className="form-check-input mx-1"
							type="checkbox"
							checked={autoDetect}
							onChange={async (e) => {
								if (!autoDetect) {
									let locationDetails: any = await autoDetectLocation();
									let coords = locationDetails.loc.split(",");
									console.log("latitude =", parseFloat(coords[0]));
									console.log("longitude =", parseFloat(coords[1]));
								}
								setAutoDetect(!autoDetect);
							}}
						/>
						<label className="form-check-label">Current Location</label>
					</div>
					<div className="text-center">
						<button
							type="submit"
							className="btn btn-primary mx-2"
							onClick={() => handleSubmit()}
							disabled={validateFields()}
						>
							<i className="bi bi-search"></i>
							Search
						</button>
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => {
								clearFields();
								setGlobalState({ ...initialAppState });
								setActiveTab("results");
							}}
						>
							<i className="bi bi-list-nested"></i>
							Clear
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Form;
