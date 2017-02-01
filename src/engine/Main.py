#Matt Black

import CorrelationCoefficient as C
import numpy as np
import VisualizeMatrix as V
import csv
import os


with open(os.path.join(os.path.dirname(__file__), 'data/data.csv'), newline='') as dataFile:
    reader = csv.reader(dataFile)
    for row in reader:
        print(row)

#V.visualize(C.correlationMatrix(x, y, z, r, a, f=C.correlate))



