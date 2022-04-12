import * as React from "react";
import chordfingers from './../chord-fingers.json'

type State = {
    text: string;
  };
export class Chord2Arpeggio extends React.Component<{}, State> {
        state = {
            text: "",
        };

    // typing on RIGHT hand side of =
    onChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ text: e.currentTarget.value });
    };
    render() { return (
            <div>
                <div>
                    <input type="text" value={this.state.text} onChange={this.onChange} />
                </div>
                  <div id="shape">
                  <form>
                    <table>
                      <tr>
                        <th style={{textAlign:"right"}}><input type="reset"/></th>
                        <th scope="col">E</th>
                        <th scope="col">A</th>
                        <th scope="col">D</th>
                        <th scope="col">G</th>
                        <th scope="col">B</th>
                        <th scope="col">E</th>
                      </tr>
                      {frets.map(fret => { return (
                        <tr>
                            <th scope="row" style={{textAlign:"right"}}>{fret}</th>
                            {stringNumbers.map(stringNumber => {
                                return (<td><input type="radio" id="{fret}{stringNumber}" name="string{stringNumber}" value="{fret}{stringNumber}"/></td>)
                                })}
                        </tr>)
                        })}
                    </table>
                  </form>
                </div>
                <div> 
                {
                chordfingers.filter(x => x["CHORD_ROOT"] == "E" && x["CHORD_TYPE"] == "m")[0]["FINGER_POSITIONS"]
                }
                </div>     
                </div>     
        )};
}
const frets=["Closed","Open","1","2","3","4"];
const stringNumbers=[1,2,3,4,5,6];
export default Chord2Arpeggio;
