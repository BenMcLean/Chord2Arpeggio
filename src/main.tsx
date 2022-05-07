import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Chord2Arpeggio from "./Chord2Arpeggio";
import { registerSW }  from 'virtual:pwa-register'

registerSW({ immediate: true })

ReactDOM.render(
	<React.StrictMode>
		<Chord2Arpeggio />
	</React.StrictMode>,
	document.getElementById("root")
);
