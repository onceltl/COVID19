# -*-coding:utf-8 -*-
import sys
import json
from scipy.optimize import curve_fit
import urllib
import json
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import time

def logistic_function(t, K, P0, r):
    t0 = 0
    exp = np.exp(r * (t - t0))
    return (K * exp * P0) / (K + (exp - 1) * P0)

predict_days = 10
confirm = json.loads(sys.argv[1])

x = np.arange(len(confirm))

popt, pcov = curve_fit(logistic_function, x, confirm,maxfev = 800000)

 
    #近期情况预测
predict_x = list(x) + [x[-1] + i for i in range(1, 1 + predict_days)]
    
predict_x = np.array(predict_x)
predict_y = logistic_function(predict_x, popt[0], popt[1], popt[2])

print(json.dumps(predict_y.tolist()))