#Matt Black
# Reads in N vectors - returns NxN correlation matrix

from scipy.stats import spearmanr
import numpy as np


def correlationMatrix(*args):
    n = len(args)
    mat = np.zeros(shape=(n,n))

    print(mat)

    for i in range(0, n):
        for j in range(i, n):
            if i == j:
                mat[i][j] = 1.0
            else:
                mat[i][j] = (args[i], args[j])


    #fill in rest of matrix by symmetry
    for j in range(0, n):
        for i in range(j+1, n):
            mat[i][j] = mat[j][i]

    return mat


def correlate(x, y):
    return spearmanr(x,y)[2]
