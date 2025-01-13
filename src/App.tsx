import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Form from "./components/Form";
import Navtabs from "./components/Navtabs";

export type WeatherState = {
	weather: null;
	error: string | null;
	warning: string | null;
	loading: number | null;
	city: string | null;
	state: string | null;
	lat: number | null;
	long: number | null;
};

export const initialAppState = {
	city: null,
	state: null,
	weather: null,
	error: null,
	warning: null,
	loading: null,
	lat: null,
	long: null,
};

function App() {
	const [activeTab, setActiveTab] = useState("results");
	const [globalState, setGlobalState] = useState<WeatherState>({...initialAppState});
	return (
		<>
			<Form
				globalState={globalState}
				setGlobalState={setGlobalState}
				setActiveTab={setActiveTab}
			></Form>
			<Navtabs
				globalState={globalState}
				setGlobalState={setGlobalState}
				setActiveTab={setActiveTab}
				activeTab={activeTab}
			/>
		</>
	);
}

export default App;
