import * as React from "react";
import chordfingers from "./chord-fingers.json";
type Chord = {
	CHORD_ROOT: string;
	CHORD_TYPE: string;
	CHORD_STRUCTURE: string;
	FINGER_POSITIONS: string;
	NOTE_NAMES: string;
};
type State = {
	fingers: number[];
	chord?: Chord;
	chordroot?: string;
	chordtype?: string;
	chordselect?: string;
	octave: number;
};
export class Chord2Arpeggio extends React.Component<{}, State> {
	state: State = {
		fingers: [0, 0, 0, 0, 0, 0],
		chordroot: "chordrootblank",
		chordtype: "chordtypeblank",
		chordselect: "chordselectblank",
		octave: -1,
	};
	reset = (fingers: number[]): void => {
		this.setState({
			fingers: fingers,
			chord: undefined,
			chordroot: "chordrootblank",
			chordtype: "chordtypeblank",
			chordselect: "chordselectblank",
		});
	};
	onFingerChange = (e: React.FormEvent<HTMLInputElement>): void =>
		this.onFingerChangeNumbers(e.currentTarget.value.split(",").map((e) => +e));
	onFingerChangeNumbers = (finger: number[]): void => {
		let fingers = this.state.fingers;
		fingers[finger[1]] = finger[0];
		this.setState({ fingers: fingers });
		this.findChord(this.state.fingers);
	};
	fingers = (chord: Chord): number[] => {
		let closed: boolean[] = chord.FINGER_POSITIONS.split(",").map(
				(e) => e === "x"
			),
			noteNames: string[] = chord.NOTE_NAMES.split(","),
			fingerChart: number[] = [0, 0, 0, 0, 0, 0],
			note: number = 0;
		for (let i: number = 0; i < 6; i++) {
			fingerChart[i] = closed[i]
				? 0
				: ((notes[noteNames[note++]] - standardTuning[i] + 1073741820) % //Adding a really high positive multiple of 12 to guarantee a positive number
						12) +
				  1;
		}
		return fingerChart;
	};
	findChord = (fingers: number[]): void => {
		let fingerString = fingers.join(),
			chord = chordfingers.find((e) => this.fingers(e).join() === fingerString);
		this.setState({
			chord: chord,
			chordroot: chord?.CHORD_ROOT ?? "chordrootblank",
			chordtype: chord?.CHORD_TYPE ?? "chordtypeblank",
			chordselect:
				chord != undefined ? this.chordSelect(chord) : "chordselectblank",
		});
	};
	famiStudio = (chord: Chord, octave: number): number[] => {
		let result: number[] = [],
			fingers = this.fingers(chord),
			transpose: number = octave * 12 - notes[chord.CHORD_ROOT] - 1;
		for (let i: number = 0; i < 6; i++)
			if (fingers[i] > 0)
				result = [...result, +fingers[i] + standardTuning[i] + transpose];
		return result;
	};
	onChordRootChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		this.setState({
			fingers: [0, 0, 0, 0, 0, 0],
			chord: undefined,
			chordroot: event.currentTarget.value,
			chordtype: "chordtypeblank",
			chordselect: "chordselectblank",
		});
	};
	onChordTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		this.setState({
			fingers: [0, 0, 0, 0, 0, 0],
			chord: undefined,
			chordtype: event.currentTarget.value,
			chordselect: "chordselectblank",
		});
	};
	onChordSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		if (
			event.currentTarget.value != undefined &&
			event.currentTarget.value != "chordselectblank"
		) {
			let chord = chordfingers.find(
				(e) =>
					e.CHORD_ROOT === this.state.chordroot &&
					e.CHORD_TYPE === this.state.chordtype &&
					event.currentTarget.value === this.chordSelect(e)
			);
			if (chord != undefined) {
				this.setState({
					chord: chord,
					chordroot: chord.CHORD_ROOT,
					chordtype: chord.CHORD_TYPE,
					chordselect: event.currentTarget.value,
					fingers: this.fingers(chord),
				});
			}
		}
	};
	chordSelect = (chord: Chord): string =>
		this.fingers(chord)
			.map((e) => (e == 0 ? "x" : e - 1))
			.join(",") +
		" - " +
		chord.NOTE_NAMES +
		" - " +
		chord.CHORD_STRUCTURE;
	onOctaveChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({
			octave: isNaN(+event.currentTarget.value)
				? -1
				: +event.currentTarget.value,
		});
	};
	render() {
		return (
			<div
				id="Chord2ArpeggioParent"
				style={{
					display: "flex",
					flexFlow: "column wrap",
					justifyContent: "flex-start",
					alignItems: "flex-start",
				}}
			>
				<div id="shape" style={{ flex: "flex-shrink" }}>
					<form>
						<table>
							<tbody>
								<tr>
									<th />
									<th scope="col">E</th>
									<th scope="col">A</th>
									<th scope="col">D</th>
									<th scope="col">G</th>
									<th scope="col">B</th>
									<th scope="col">E</th>
								</tr>
								{[...Array(13).keys()].map((fret) => {
									return (
										<tr key={fret}>
											<th scope="row" style={{ textAlign: "right" }}>
												<button
													type="button"
													onClick={() => {
														this.reset([fret, fret, fret, fret, fret, fret]);
													}}
												>
													{fretNames[fret]}
												</button>
											</th>
											{[...Array(6).keys()].map((stringNumber) => {
												return (
													<td
														key={`${fret},${stringNumber}`}
														onClick={() => {
															this.onFingerChangeNumbers([
																+fret,
																+stringNumber,
															]);
														}}
													>
														<input
															type="radio"
															id={`${fret},${stringNumber}`}
															name={`${fret},${stringNumber}`}
															value={`${fret},${stringNumber}`}
															checked={this.state.fingers[stringNumber] == fret}
															onChange={this.onFingerChange}
														/>
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</form>
				</div>
				<div id="column2" style={{ flex: "flex-grow" }}>
					<div id="dropdowns">
						<select
							name="chordroot"
							id="chordroot"
							value={this.state.chordroot}
							onChange={this.onChordRootChange}
						>
							<option id="chordrootblank" value="chordrootblank">
								Root
							</option>
							{Object.keys(notes).map((chordroot) => {
								return (
									<option key={chordroot} id={chordroot} value={chordroot}>
										{chordroot}
									</option>
								);
							})}
						</select>
						{this.state.chordroot != undefined &&
							this.state.chordroot != "chordrootblank" && (
								<select
									name="chordtype"
									id="chordtype"
									value={this.state.chordtype}
									onChange={this.onChordTypeChange}
								>
									<option id="chordtypeblank" value="chordtypeblank">
										Type
									</option>
									{[
										...new Set(
											chordfingers
												.filter((e) => e.CHORD_ROOT === this.state.chordroot)
												.map((e) => e.CHORD_TYPE)
										),
									]
										.sort(
											new Intl.Collator("en", {
												numeric: true,
												sensitivity: "accent",
											}).compare
										)
										.map((chordtype) => {
											return (
												<option
													key={"chordtype" + chordtype}
													id={"chordtype" + chordtype}
													value={chordtype}
												>
													{chordtype}
												</option>
											);
										})}
								</select>
							)}
						{this.state.chordroot != undefined &&
							this.state.chordroot != "chordrootblank" &&
							this.state.chordtype != undefined &&
							this.state.chordtype != "chordtypeblank" && (
								<select
									name="chordselect"
									id="chordselect"
									value={this.state.chordselect}
									onChange={this.onChordSelectChange}
								>
									<option id="chordselectblank" value="chordselectblank">
										Select Chord
									</option>
									{[
										...new Set(
											chordfingers
												.filter(
													(e) =>
														e.CHORD_ROOT === this.state.chordroot &&
														e.CHORD_TYPE === this.state.chordtype
												)
												.map((chord) => this.chordSelect(chord))
										),
									]
										.sort(
											new Intl.Collator("en", {
												numeric: true,
												sensitivity: "accent",
											}).compare
										)
										.map((chord) => {
											return (
												<option key={chord} id={chord} value={chord}>
													{chord}
												</option>
											);
										})}
								</select>
							)}
					</div>
					<div id="output">
						{this.state.chord != undefined && (
							<div>
								Octave:{" "}
								<input
									type="number"
									id="octave"
									value={this.state.octave}
									onChange={this.onOctaveChange}
								/>
								<br />
								<a href="https://famistudio.org/" target="_blank">
									FamiStudio
								</a>{" "}
								arpeggio numbers for {this.state.chordroot}
								{this.state.chordtype}:{" "}
								<input
									type="text"
									value={this.famiStudio(
										this.state.chord,
										this.state.octave
									).join(",")}
									onClick={() => {
										navigator.clipboard.writeText(
											this.famiStudio(
												this.state.chord as Chord,
												this.state.octave
											).join(",")
										);
									}}
									readOnly
									disabled
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
const fretNames: string[] = [
	"Closed",
	"Open",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
];
const standardTuning: number[] = [0, 5, 10, 15, 19, 24]; // Every Amateur Does Get Better Eventually
const notes: { [name: string]: number } = {
	E: 0,
	F: 1,
	"F#": 2,
	Gb: 2,
	G: 3,
	"G#": 4,
	Ab: 4,
	A: 5,
	"A#": 6,
	Bb: 6,
	B: 7,
	Cb: 7,
	C: 8,
	"C#": 9,
	Db: 9,
	D: 10,
	"D#": 11,
	Eb: 11,
};
export default Chord2Arpeggio;
