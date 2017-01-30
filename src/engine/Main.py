#Matt Black

import CorrelationCoefficient as C
import numpy as np
import VisualizeMatrix as V
import seaborn as sns

np.random.seed(12345678)
x = np.array([1,2,3,4,5])
y = np.array([20,21,22,23,28])
z = np.array([0, -1, 3, 4, 5])
a = np.array([0, -1 , -5, -10, -6])
r = np.random.randn(5)

V.visualize(C.correlationMatrix(x, y, z, r, a, C.pearsonCoeff))

V.visualize(np.corrcoef(np.random.randn(100,100)))



