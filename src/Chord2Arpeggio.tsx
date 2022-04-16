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
};
export class Chord2Arpeggio extends React.Component<{}, State> {
	state: State = {
		fingers: [0, 0, 0, 0, 0, 0],
	};
	reset = (fingers: number[]): void => {
		this.setState({ fingers: fingers });
		this.findChord();
	};
	onFingerClick = (e: React.FormEvent<HTMLInputElement>): void => {
		let fingers = this.state.fingers;
		fingers[parseInt(e.currentTarget.value.charAt(1))] = parseInt(
			e.currentTarget.value.charAt(0)
		);
		this.setState({ fingers: fingers });
		this.findChord();
	};
	findChord = (): void => {
		let fingers = this.state.fingers
				.map((e) => (e == 0 ? "x" : e - 1))
				.join(","),
			chord = chordfingers.find((e) => e.FINGER_POSITIONS == fingers);
		this.setState({
			chord: chord,
		});
		if (chord != undefined) {
			this.setState({
				chordroot: chord.CHORD_ROOT,
				chordtype: chord.CHORD_TYPE,
			});
		}
	};
	famiStudio = (
		fingers: number[],
		key: string,
		octaveTranspose: number
	): number[] => {
		let result = [0, 0, 0, 0, 0, 0];
		for (let i = 0; i < 6; i++) {
			result[i] =
				fingers[i] +
				standardTuning[i] -
				(key in keyTransposes ? keyTransposes[key] : 0) +
				octaveTranspose * 12;
		}
		return result;
	};
	onChordRootChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		this.setState({ chordroot: event.currentTarget.value });
	};
	onChordTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		this.setState({ chordtype: event.currentTarget.value });
	};
	render() {
		return (
			<div>
				<div id="shape">
					<form>
						<table>
							<tr>
								<th />
								<th scope="col">E</th>
								<th scope="col">A</th>
								<th scope="col">D</th>
								<th scope="col">G</th>
								<th scope="col">B</th>
								<th scope="col">E</th>
							</tr>
							{stringNumbers.map((fret) => {
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
										{stringNumbers.map((stringNumber) => {
											return (
												<td key={`${fret}${stringNumber}`}>
													<input
														type="radio"
														id={`${fret}${stringNumber}`}
														name={`string${stringNumber}`}
														value={`${fret}${stringNumber}`}
														checked={this.state.fingers[stringNumber] == fret}
														onClick={this.onFingerClick}
													/>
												</td>
											);
										})}
									</tr>
								);
							})}
						</table>
					</form>
				</div>
				<div>
					<select
						name="chordroot"
						id="chordroot"
						value={this.state.chordroot}
						onChange={this.onChordRootChange}
					>
						<option id="chordrootblank" value={undefined}>
							Chord Root
						</option>
						{Object.keys(keyTransposes).map((chordroot) => {
							return (
								<option id={chordroot} value={chordroot}>
									{chordroot}
								</option>
							);
						})}
					</select>
					{this.state.chordroot != undefined && (
						<select
							name="chordtype"
							id="chordtype"
							value={this.state.chordtype}
							onChange={this.onChordTypeChange}
						>
							<option id="chordtypeblank" value={undefined}>
								Chord Type
							</option>
							{[
								...new Set(
									chordfingers
										.filter((e) => e.CHORD_ROOT == this.state.chordroot)
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
										<option id={chordtype} value={chordtype}>
											{chordtype}
										</option>
									);
								})}
						</select>
					)}
				</div>
				<div>
					{this.state.fingers.map((e) => (e == 0 ? "x" : e - 1)).join(",")}
				</div>
				<div>
					{this.state.chord == undefined ? (
						"Chord not found."
					) : (
						<input
							type="text"
							value={this.famiStudio(
								this.state.fingers,
								(this.state.chord as Chord).CHORD_ROOT,
								-1
							).join(",")}
							disabled
						/>
					)}
				</div>
			</div>
		);
	}
}
const fretNames: string[] = ["Closed", "Open", "1", "2", "3", "4"];
const stringNumbers: number[] = [0, 1, 2, 3, 4, 5];
const standardTuning: number[] = [0, 5, 10, 15, 19, 24]; // Every Amateur Does Get Better Eventually
const keyTransposes: { [name: string]: number } = {
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
