import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { WeatherState } from "../App";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import Meteogram from "./meteogram";
import TemperatureChart from "./arearange";
import WeatherTable from "./daily_table";
import "./animation.css";
import WeatherDetails from "./WeatherDetails";
import FavoritesTable from "./FavoritesComponent";
import { addFavorite, deleteFavorite, getFavorites } from "./favorites";

HighchartsMore(Highcharts);

interface ChildComponentProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	globalState: WeatherState;
	setGlobalState: (value: WeatherState) => void; // Type for the setState function
}

const Navtabs: React.FC<ChildComponentProps> = ({
	activeTab,
	setActiveTab,
	globalState,
	setGlobalState,
}) => {
	return (
		<div className="container mt-4 text-center mx-auto">
			<div
				className="nav nav-pills flex flex-row justify-content-center"
				role="group"
			>
				<button
					className={`nav-link text-center ${
						activeTab === "results" ? "active" : ""
					}`}
					onClick={() => setActiveTab("results")}
				>
					Results
				</button>
				<button
					className={`nav-link text-center ${
						activeTab === "favorites" ? "active" : ""
					}`}
					onClick={() => setActiveTab("favorites")}
				>
					Favorites
				</button>
			</div>
			{globalState.error?.length && (
				<div className="alert alert-danger" role="alert">
					{globalState.error}
				</div>
			)}
			{globalState.warning?.length && (
				<div className="alert alert-warning" role="alert">
					{globalState.warning}
				</div>
			)}
			{globalState.loading !== null && (
				<div className="mt-3 progress w-75 mx-auto">
					<div
						className="progress-bar progress-bar-striped"
						role="progressbar"
						style={{ width: `${globalState.loading}%` }}
					></div>
				</div>
			)}
			{!globalState.loading && (
				<div className="mt-3">
					{activeTab === "results" && globalState.weather && (
						<div>
							<ResultsSection globalState={globalState} />
						</div>
					)}
					{activeTab === "favorites" && (
						<FavoritesTable
							globalState={globalState}
							setGlobalState={setGlobalState}
							setActiveTab={setActiveTab}
						/>
					)}
				</div>
			)}
		</div>
	);
};

interface ResultsSectionProps {
	globalState: any;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ globalState }) => {
	const [isSlideIn, setIsSlideIn] = useState(false);
	const toggleSlide = () => {
		setIsSlideIn(!isSlideIn);
	};

	const [tabIndex, setTabIndex] = useState<number>(0);
	function changeTab(index: number) {
		if (tabIndex == index) return;
		setTabIndex(index);
	}
	const [favoriteAdded, setFavoriteAdded] = useState<boolean>(false);
	const [detailsIndex, setDetailsIndex] = useState<number>(0);

	useEffect(() => {
		(async function () {
			let favorites: any[] = await getFavorites();
			for (let f of favorites) {
				if (f.state == globalState.state && f.city == globalState.city) {
					setFavoriteAdded(true);
					return;
				}
			}
		})();
	}, []);
	return (
		<div className="slide-container">
			<div className={`main-content ${isSlideIn ? "slide-out" : "slide-in"}`}>
				<div>Forecast at {`${globalState.city}, ${globalState.state}`}</div>
				<div className="d-flex flex-row justify-content-end align-items-center">
					<button
						className="btn btn-sm border bg-light"
						onClick={async () => {
							if (favoriteAdded) {
								deleteFavorite(globalState.city, globalState.state);
							} else {
								addFavorite(globalState.city, globalState.state);
							}
							setFavoriteAdded(!favoriteAdded);
						}}
					>
						{favoriteAdded ? (
							<i className="bi bi-star-fill" style={{ color: "#ffe500" }} />
						) : (
							<i className="bi bi-star"></i>
						)}
					</button>
					<span
						className="btn btn-sm btn-link"
						onClick={() => {
							setDetailsIndex(0);
							toggleSlide();
						}}
					>
						Details &gt;
					</span>
				</div>
				<ul className="nav nav-tabs justify-content-end mt-2 small">
					<li className="nav-item">
						<button
							className={`nav-link ${tabIndex === 0 ? "active" : ""}
					`}
							aria-current="page"
							onClick={() => {
								changeTab(0);
							}}
						>
							Day view
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${tabIndex === 1 ? "active" : ""}
						`}
							onClick={() => {
								changeTab(1);
							}}
						>
							Daily temp. chart
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${tabIndex === 2 ? "active" : ""}
						`}
							onClick={() => {
								changeTab(2);
							}}
						>
							Meteogram
						</button>
					</li>
				</ul>
				<div className="overflow-scroll small">
					{tabIndex === 0 && (
						<WeatherTable
							weather={globalState?.weather}
							switchToDetails={(index: number) => {
								setDetailsIndex(index);
								toggleSlide();
							}}
						/>
					)}
					{tabIndex === 1 && (
						<TemperatureChart
							data={globalState.weather?.temperature_range_chart}
						/>
					)}
					{tabIndex === 2 && (
						<Meteogram data={globalState.weather?.hourly_chart} />
					)}
				</div>
			</div>
			<WeatherDetails
				details={globalState.weather?.daily_details[detailsIndex]}
				isSlideIn={isSlideIn}
				onClose={toggleSlide}
				globalState={globalState}
			/>
		</div>
	);
};

export default Navtabs;
