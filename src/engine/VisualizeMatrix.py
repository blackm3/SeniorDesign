#VisualizeMatrix.py
#Matt Black
#Takes in correlation matrix and plots it


import seaborn as sns
import matplotlib.pyplot as plt


def visualize(mat):
    print("visualize....")
    print(mat)
    sns.set(style="white")
    # Set up the matplotlib figure
    f, ax = plt.subplots(figsize=(11, 9))

    # Generate a custom diverging colormap
    cmap = sns.diverging_palette(220, 10, as_cmap=True)

    # Draw the heatmap with the mask and correct aspect ratio
    sns.heatmap(mat, cmap=cmap, vmax=1.0,
                square=True,
                linewidths=.5, cbar_kws={"shrink": .5}, ax=ax)

    sns.plt.show()