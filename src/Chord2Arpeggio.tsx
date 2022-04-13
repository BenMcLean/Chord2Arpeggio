import * as React from "react";
import chordfingers from './../chord-fingers.json'

type State = {
  fingers:number[];
  };
export class Chord2Arpeggio extends React.Component<{}, State> {
        state = {
          fingers:[0,0,0,0,0,0]
        };
    onFingerChange = (e: React.FormEvent<HTMLInputElement>): void => {
      let fingers = this.state.fingers;
      fingers[parseInt(e.currentTarget.value.charAt(1))] = parseInt(e.currentTarget.value.charAt(0));
        this.setState({ fingers: fingers });
    };
    render() { return (
            <div>
                {/* <div>
                    <input type="text" value={this.state.text} onChange={this.onChange} />
                </div> */}
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
                      {stringNumbers.map(fret => { return (
                      <tr key={fret}>
                          <th scope="row" style={{textAlign:"right"}}>{frets[fret]}</th>
                          {stringNumbers.map(stringNumber => {
                              return (<td key={`${fret}${stringNumber}`}><input type="radio" id={`${fret}${stringNumber}`} name={`string${stringNumber}`} value={`${fret}${stringNumber}`} checked={this.state.fingers[stringNumber]==fret} onChange={this.onFingerChange} /></td>);
                              })}
                      </tr>);
                      })}
                    </table>
                  </form>
                </div>
                <div> 
                {
                  this.state.fingers
                // chordfingers.filter(x => x["CHORD_ROOT"] == "E" && x["CHORD_TYPE"] == "m")[0]["FINGER_POSITIONS"]
                }
                </div>     
                </div>     
        )};
}
const frets=["Closed","Open","1","2","3","4"];
const stringNumbers=[0,1,2,3,4,5];
export default Chord2Arpeggio;
