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
	chord: Chord | undefined;
};
export class Chord2Arpeggio extends React.Component<{}, State> {
	state = {
		fingers: [0, 0, 0, 0, 0, 0],
		chord: undefined,
	};
	onFingerChange = (e: React.FormEvent<HTMLInputElement>): void => {
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
			.join(",");
		this.setState({
			chord: chordfingers.find((e) => e.FINGER_POSITIONS == fingers),
		});
	};
	render() {
		return (
			<div>
				{/* <div>
                    <input type="text" value={this.state.text} onChange={this.onChange} />
                </div> */}
				<div id="shape">
					<form>
						<table>
							<tr>
								<th style={{ textAlign: "right" }}>
									<input type="reset" />
								</th>
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
											{fretNames[fret]}
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
														onChange={this.onFingerChange}
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
					{this.state.fingers.map((e) => (e == 0 ? "x" : e - 1)).join(",")}
				</div>
				<div>{this.state.chord == undefined ? "undefined" : "DEFINED!!"}</div>
			</div>
		);
	}
}
const fretNames = ["Closed", "Open", "1", "2", "3", "4"];
const stringNumbers = [0, 1, 2, 3, 4, 5];
export default Chord2Arpeggio;
