#Matt Black

import CorrelationCoefficient as C
import numpy as np
import pandas as pd
import VisualizeMatrix as V
import csv
import os
import json
import matplotlib.pyplot as plt
from statsmodels.tsa import stattools, arima_model
from scipy.stats import spearmanr
from VisualizeMatrix import visualize

# sample = 256 * np.pi
# x = np.arange(sample)
# y = np.sin(x / 64)
# z = np.sin((x / 64) - np.pi / 2)
# r = (np.random.rand(805) * 2) - 1
# ccf = stattools.ccf(y, z)
#
# print(spearmanr(y, z).correlation)
# print(stattools.adfuller(y))
# print(stattools.adfuller(z))
# print(stattools.adfuller(r))
#
# plt.plot(x, y)
# plt.plot(x, z)
# plt.plot(x, r)
# plt.show()

with open(os.path.join(os.path.dirname(__file__), '..', 'server', 'data.csv'), newline='') as dataFile:
    cols = len(dataFile.readline().split(','))
    use_cols = [i for i in range(cols) if i % 2 != 0]
    data = pd.read_csv(dataFile,
                       usecols=use_cols,
                       header=None,
                       names=[('s' + str(i)) for i in range(int(cols / 2))]).values

    #acf = stattools.acf(data, fft=True, qstat=True, nlags=100)
    matrix = spearmanr(data).correlation
    #visualize(matrix)
    print(json.dumps(matrix.tolist()))

    # model = arima_model.ARIMA(data, order=(5, 1, 0))
    # model_fit = model.fit(disp=0)
    # print(model_fit.summary())
    # # plot residual errors
    # residuals = pd.DataFrame(model_fit.resid)
    # residuals.plot(kind='kde')
    # plt.show()
    # print(residuals.describe())




#V.visualize(C.correlationMatrix(x, y, z, r, a, f=C.correlate))



