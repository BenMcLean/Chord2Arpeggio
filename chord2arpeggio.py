# -*- coding: utf-8 -*-
"""Chord to Arpeggio
Inputs a chord name and outputs a series of numbers for how many steps from the base note each note is.
"""
import argparse
import csv
parser = argparse.ArgumentParser(description='Chord')
parser.add_argument('chord', metavar='chord', type=str, nargs='+', help='Name of chord')
input = parser.parse_args().chord[0]
with open('chord-fingers.csv', newline='') as csvfile:
    chordreader = csv.DictReader(csvfile, delimiter=';')
    foundchords = next((chord for chord in chordreader if input == chord['CHORD_ROOT'] + chord['CHORD_TYPE']), None)
print(foundchords)
