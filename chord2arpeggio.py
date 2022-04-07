# -*- coding: utf-8 -*-
"""Guitar Chord to Arpeggio
Inputs a guitar chord name and outputs a series of numbers for how many half steps above the root note each note in the guitar chord is.
Uses chord-fingers.csv from https://archive.ics.uci.edu/ml/datasets/Guitar+Chords+finger+positions
"""
import argparse
import csv
parser = argparse.ArgumentParser(description='Chord')
parser.add_argument('chord', metavar='chord', type=str, nargs='+', help='Name of chord')
input = parser.parse_args().chord[0]
standardtuning = [0,5,10,15,19,24] # Every Amateur Does Get Better Eventually
keytransposes = {'E':0,'F':1,'F#':2,'Gb':2,'G':3,'G#':4,'Ab':4,'A':5,'A#':6,'Bb':6,'B':7,'Cb':7,'C':8,'C#':9,'Db':9,'D':10,'D#':11,'Eb':11}
octavetranspose=-1
with open('chord-fingers.csv', newline='') as csvfile:
    chordreader = csv.DictReader(csvfile, delimiter=';')
    for chord in chordreader:
        if input == chord['CHORD_ROOT'] + chord['CHORD_TYPE']:
            positions = chord['FINGER_POSITIONS'].split(',')
            keytranspose = keytransposes[chord['CHORD_ROOT']]
            result = []
            i = 0
            while i < len(positions):
                if positions[i].isnumeric():
                    result.append(int(positions[i]) + standardtuning[i] + keytranspose + octavetranspose * 12)
                i += 1
            print(result)