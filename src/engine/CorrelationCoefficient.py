#Matt Black
# Reads in N vectors - returns NxN correlation matrix

from scipy.stats import linregress
import numpy as np
import pandas as pd
import seaborn as sns

def correlationMatrix(*args):

    f = args[-1]
    args = args[:-1]
    n = len(args)
    mat = np.zeros(shape=(n,n))

    print(mat)

    for i in range(0, n):
        for j in range(i, n):
            if i == j:
                mat[i][j] = 1.0
            else:
                mat[i][j] = f(args[i], args[j])


    #fill in rest of matrix by symmetry
    for j in range(0, n):
        for i in range(j+1, n):
            mat[i][j] = mat[j][i]


    return mat


def pearsonCoeff(x, y):
    return linregress(x,y)[2]
