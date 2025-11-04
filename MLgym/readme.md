📈 Robust Regression Analysis Using M and P Estimators

Course: STAT 527 — Robust Statistical Methods
Author: Dichuan Zheng · Andrew Cao · Team
Date: December 2024

📘 Overview

This project compares two robust regression techniques—the M-estimator and P-estimator—to evaluate how they handle outliers and data contamination that often distort traditional Ordinary Least Squares (OLS) models.
Using a gym activity dataset, where Calories Burned is the response variable, we analyzed how both estimators perform in terms of robustness, accuracy, and overall model fit.

🎯 Objectives

Implement and compare M-estimator and P-estimator regression models.

Evaluate how each method resists the influence of outliers.

Assess model quality through diagnostic plots and fit statistics such as AIC, BIC, and residual behavior.

🧮 Methods
🔹 M-Estimator

Reduces the influence of large residuals through adaptive weighting.

Offers a balance between robustness and efficiency.

Implemented using the rlm() function from the MASS package.

🔹 P-Estimator

Assigns weights to observations based on their reliability.

Provides stronger resistance to extreme outliers.

Implemented using the lmrob() function from the robustbase package.

🧠 Data

Dataset: Gym Activity Records
Response: Calories Burned
Predictors: Age, Gender, Weight, Height, Heart Rate, Session Duration, Workout Type, Fat Percentage, Water Intake, Workout Frequency, Experience Level, and BMI

Both models were trained on the same dataset to ensure a fair comparison.

📊 Results
Metric	M-Estimator	P-Estimator
Residual Std. Error	34.39	34.20
AIC	9939.09	10000.09
BIC	10022.06	10083.06
Adjusted R²	0.9926	0.9927
Outlier Handling	Moderate	Stronger

M-Estimator achieved slightly better model fit (lower AIC/BIC).

P-Estimator identified and down-weighted 157 outliers, providing stronger robustness.

Both models produced similar adjusted R² values, indicating high explanatory power.

🔍 Variable Insights
Variable	Importance	Interpretation
Age	High	Older individuals burn fewer calories.
Gender (Male)	High	Males burn more calories than females.
Session Duration	High	Longer workouts lead to more calories burned.
BMI	Moderate	Slightly increases calories burned.
Other Variables	Low	Minimal influence on energy expenditure.
📈 Diagnostics

Residual Plots: Both models showed centered and symmetric residuals.

QQ Plots: Residuals were approximately normal, confirming a good fit.

Outliers: P-Estimator removed or down-weighted extreme points more aggressively than M-Estimator.

💡 Conclusions

M-Estimator is efficient and provides accurate results when outliers are limited.

P-Estimator is more conservative, better suited for data with substantial contamination.

Both outperform traditional OLS regression in stability and reliability.

✅ Overall, the M-Estimator offered slightly better fit, while the P-Estimator provided stronger protection against outliers.

🧰 Tools & Environment
Category	Tools
Language	R
Libraries	MASS, robustbase, ggplot2
Functions	rlm(), lmrob(), summary(), shapiro.test()
Data Source	Simulated Gym Dataset
