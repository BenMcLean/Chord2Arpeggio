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
		this.onFingerChangeString(e.currentTarget.value);
	onFingerChangeString = (finger: string): void => {
		let fingers = this.state.fingers;
		fingers[+finger.charAt(1)] = +finger.charAt(0);
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
			chordroot: chord?.CHORD_ROOT ?? "chordrootblank",
			chordtype: chord?.CHORD_TYPE ?? "chordtypeblank",
			chordselect:
				chord != undefined ? this.chordSelect(chord) : "chordselectblank",
		});
	};
	famiStudio = (chord: Chord, octave: number): number[] => {
		let result: number[] = [],
			positions: string[] = chord.FINGER_POSITIONS.split(","),
			keyTranspose: number = keyTransposes[chord.CHORD_ROOT];
		for (let i: number = 0; i < 6; i++) {
			if (!isNaN(+positions[i]))
				result = [
					...result,
					+positions[i] + standardTuning[i] - keyTranspose + octave * 12,
				];
		}
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
					e.CHORD_ROOT == this.state.chordroot &&
					e.CHORD_TYPE == this.state.chordtype &&
					event.currentTarget.value == this.chordSelect(e)
			);
			if (chord != undefined) {
				this.setState({
					chord: chord,
					chordroot: chord.CHORD_ROOT,
					chordtype: chord.CHORD_TYPE,
					chordselect: event.currentTarget.value,
					fingers: chord.FINGER_POSITIONS.split(",").map((e) =>
						e == "x" ? 0 : +e + 1
					) as number[],
				});
			}
		}
	};
	chordSelect = (chord: Chord): string =>
		chord.FINGER_POSITIONS +
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
			<div>
				<div id="shape">
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
													<td
														key={`${fret}${stringNumber}`}
														onClick={() => {
															this.onFingerChangeString(
																`${fret}${stringNumber}`
															);
														}}
													>
														<input
															type="radio"
															id={`${fret}${stringNumber}`}
															name={`string${stringNumber}`}
															value={`${fret}${stringNumber}`}
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
				<div>
					<select
						name="chordroot"
						id="chordroot"
						value={this.state.chordroot}
						onChange={this.onChordRootChange}
					>
						<option id="chordrootblank" value="chordrootblank">
							Root
						</option>
						{Object.keys(keyTransposes).map((chordroot) => {
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
								{chordfingers
									.filter(
										(e) =>
											e.CHORD_ROOT == this.state.chordroot &&
											e.CHORD_TYPE == this.state.chordtype
									)
									.map((chord) => this.chordSelect(chord))
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
				<div>
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
