# -*- coding: utf-8 -*-
"""Chord to Arpeggio
Inputs a chord name and outputs a series of numbers for how many steps above the base note each note is.
"""
import argparse
import csv
parser = argparse.ArgumentParser(description='Chord')
parser.add_argument('chord', metavar='chord', type=str, nargs='+', help='Name of chord')
input = parser.parse_args().chord[0]
standardtuning = [0,5,10,15,19,24] # Every Amateur Does Get Better Eventually
with open('chord-fingers.csv', newline='') as csvfile:
    chordreader = csv.DictReader(csvfile, delimiter=';')
    for chord in chordreader:
        if input == chord['CHORD_ROOT'] + chord['CHORD_TYPE']:
            positions = chord['FINGER_POSITIONS'].split(',')
            result = []
            i = 0
            while i < len(positions):
                if positions[i].isnumeric():
                    result.append(int(positions[i]) + standardtuning[i])
                i += 1
            print(result)