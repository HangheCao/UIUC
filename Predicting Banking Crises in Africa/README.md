🌍 Predicting Banking Crises in Africa

A Machine Learning Approach to Early Warning Systems for Financial Instability

📘 Overview

This project explores the use of machine learning models to predict the likelihood of banking crises in 13 African countries between 1970 and 2018. Using historical macroeconomic indicators — such as inflation, exchange rates, and systemic crisis markers — we aim to identify early warning signals that could help policymakers prevent or mitigate financial instability.

The study compares six models, including both classical statistical and modern ensemble methods, to determine which best captures the dynamics of crisis prediction. Despite their simplicity, Logistic Regression models proved most effective, achieving the highest recall rate and demonstrating that interpretable models can perform robustly in complex economic contexts

Project II Report

.

🎯 Objectives

Forecast the occurrence of banking crises using macroeconomic and financial indicators.

Identify the key drivers (e.g., inflation, systemic crises, lagged financial shocks) behind crisis events.

Evaluate model performance with an emphasis on recall, prioritizing the detection of real crises even at the expense of false positives.

Build a foundation for early warning systems that support proactive financial policy in developing economies.

🧮 Dataset

Source: Africa Economic, Banking, and Systemic Crisis Data (Kaggle)

Collected by: Carmen Reinhart, Harvard Kennedy School

Coverage: 13 African countries, 1970–2018

Observation type: Annual macroeconomic indicators

🔑 Key Variables
Variable	Description
systemic_crisis	Whether a systemic financial crisis occurred
inflation_annual_cpi	Annual inflation rate (CPI)
currency_crises	Presence of a currency crisis
domestic_debt_in_default	Sovereign domestic debt default indicator
exch_usd	Exchange rate relative to USD
banking_crisis	Target variable (“crisis” or “no_crisis”)
*_lag1	Lagged versions of selected features to capture temporal effects
⚙️ Methodology
🧩 Data Preprocessing

Removed extremely imbalanced variables (e.g., domestic debt defaults).

Created lagged variables (banking_crisis_lag1, inflation_crises_lag1, etc.) to reflect past-year effects.

Chronological split (80/20) by country to prevent data leakage.

Applied feature normalization for scale-sensitive models.

Addressed class imbalance using class_weight='balanced' rather than oversampling.

🧠 Models Compared
Model	Key Technique
Logistic Regression	Baseline interpretable classifier
Logistic Regression (ElasticNet)	L1 + L2 regularization for feature selection
Support Vector Classifier (SVC)	Linear kernel, class-weighted
K-Nearest Neighbors (KNN)	Distance-based voting
Gradient Boosting Machine (GBM)	Sequential ensemble with tuned learning rate
Random Forest	Bagging ensemble, feature importance analysis
🧾 Evaluation Metrics

Accuracy

F1 Score

ROC-AUC

Recall (Primary Metric) — chosen to minimize false negatives, as missing a true crisis is far costlier than a false alarm.

📊 Results
Model	Accuracy	Recall	F1	ROC-AUC
Logistic Regression	0.967	0.885	0.868	0.990
Logistic Regression (ElasticNet)	0.958	0.846	0.830	0.988
SVC	0.958	0.769	0.816	0.956
KNN	0.972	0.769	0.870	0.945
Gradient Boosting	0.972	0.769	0.870	0.978
Random Forest	0.963	0.769	0.833	0.991

🏆 Logistic Regression achieved the best recall (88%), showing that simple and interpretable models can outperform more complex algorithms when key economic variables are selected effectively.

🔍 Key Insights

Inflation, systemic crises, and previous-year banking crises are the strongest predictors of future crises.

High inflation and prior systemic instability serve as early warning signals for financial distress.

Model simplicity supports interpretability, making results more actionable for policymakers.

Country-level heterogeneity remains significant — future work may benefit from country-specific modeling.

🚀 Future Work

Add additional predictors such as GDP growth, foreign reserves, and governance quality.

Explore time-series deep learning models (e.g., LSTM, GRU) and Hidden Markov Models to capture temporal patterns.

Incorporate SHAP value analysis for explainable AI and feature attribution.

Evaluate regional transferability — whether a model trained on some countries generalizes to others.

🧰 Tools & Libraries

Python: pandas, numpy, scikit-learn, matplotlib, seaborn

Statistical Techniques: Logistic Regression, ElasticNet, Ensemble Trees

Feature Selection: Recursive Feature Elimination (RFE)

Hyperparameter Tuning: GridSearchCV

📈 Contributors
Name	Role	Contributions
Saniya Abushakimova	Abstract, Data Preprocessing, Logistic Models, Evaluation	
Jaehyung Kim	Introduction, Gradient Boosting, Random Forest, Results	
Andrew Cao	Exploratory Data Analysis, SVC, KNN, Discussion	
📚 Reference

Reinhart, C. M. (Harvard Kennedy School). Global Financial Crisis Data. Source

Kaggle Dataset: Africa Economic, Banking, and Systemic Crisis Data

🏁 Summary

This study demonstrates that macroeconomic instability — particularly inflation and systemic crises — strongly correlates with banking crises.
Simple, well-calibrated models such as Logistic Regression can serve as effective and interpretable early warning systems, providing valuable insights for policymakers seeking to strengthen financial stability in emerging economies.
