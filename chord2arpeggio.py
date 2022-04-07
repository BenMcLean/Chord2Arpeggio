# -*- coding: utf-8 -*-
"""Chord to Arpeggio
Inputs a chord name and outputs a series of numbers for how many steps from the base note each note is.
"""
import argparse
parser = argparse.ArgumentParser(description='Chord')
parser.add_argument('chord', metavar='N', type=str, nargs='+', help='Name of chord')
chord = parser.parse_args().chord[0]
print('Chord is ' + chord)