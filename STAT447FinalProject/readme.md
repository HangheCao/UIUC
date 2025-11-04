💰 Lending Club Loan: Exploratory Data Analysis, Classification, and Prediction

Authors: Yiru Fang · Qiyang Wang · Andrew Cao
Date: December 2024

📘 Overview

This project explores how online lending platforms balance profitability and risk through data-driven credit risk modeling. Using the Lending Club dataset from Kaggle, we analyzed key borrower and loan features to predict loan repayment outcomes and identify factors contributing to loan defaults.

The analysis integrates exploratory data analysis (EDA), feature engineering, and machine learning classification models to uncover patterns behind successful repayments and high-risk loans.

🎯 Objectives

Identify key borrower and loan characteristics influencing repayment success.

Compare multiple machine learning models for loan status prediction.

Address class imbalance between “Fully Paid” and “Charged Off” loans.

Provide data-driven recommendations for risk management and profitability optimization.

🧮 Data Description

Source: Kaggle Lending Club Loan Data

Observations: > 77,000 loan records

Target Variable: loan_status — Fully Paid vs Charged Off

Features: 26 variables including credit grade, loan amount, interest rate, annual income, home ownership, and debt-to-income ratio

Key preprocessing decisions:

Removed redundant or irrelevant features (grade, emp_title, emp_length).

Imputed missing values using median or mean statistics.

Encoded categorical variables via One-Hot Encoding.

Applied MinMaxScaler for normalization (0–1 range).

Handled class imbalance using SMOTE (Synthetic Minority Oversampling Technique).

🧠 Feature Analysis Methods
🔹 Chi-Square Test

Used to identify significant categorical features associated with loan outcomes.

Top significant features: sub_grade_encoded, home_ownership_encoded, verification_status_encoded.

Features with high p-values (e.g. initial_list_status, application_type) were dropped.

🔹 Principal Component Analysis (PCA)

Applied for dimensionality reduction.

95% of variance explained by just two principal components.

Key contributors:

PC1 → annual_inc

PC2 → revol_bal

🔹 Lasso Regularization

Performed feature selection by shrinking irrelevant coefficients to zero.

Optimal regularization constant: C = 0.0048

Retained key features: zip_code, sub_grade_encoded, dti, and annual_inc.

Dropped low-impact variables (e.g., total_acc).

🤖 Machine Learning Models

Four predictive models were trained and evaluated using the selected features:

Model	Accuracy	F1 (Minority)	Key Strength	Limitation
K-Nearest Neighbors (KNN)	77%	0.54	Simple, effective for majority class	Sensitive to imbalance
K-Means (Unsupervised)	40%	0.00	Clustering insights	Failed to separate meaningful clusters
Logistic Regression	81%	0.34	Interpretable coefficients	Weak on minority class
Random Forest	87%	0.64	High accuracy, strong F1 balance	Computationally heavy
🔸 Random Forest (Best Model)

Achieved the highest overall accuracy (87%) and best F1 score (0.64) for the minority class.

Most influential features:

zip_code_encoded

sub_grade_encoded

purpose_encoded

Demonstrated resilience to multicollinearity and feature imbalance.

📊 Key Findings

Loan Grade/Subgrade and Debt-to-Income Ratio (DTI) strongly influence repayment outcomes.

Annual income and revolving balance capture most variance in borrower financial health.

Class imbalance remains a major challenge — oversampling improved minority recall.

Random Forest outperformed other methods, offering accuracy and interpretability.

🚀 Future Improvements

Class Balancing: Try ADASYN or undersampling to further improve minority recall.

Model Enhancement: Hyperparameter tuning for Random Forest (e.g., tree depth, sample splits).

Feature Engineering: Add interactions and normalize numeric ratios for improved sensitivity.

Advanced Models: Explore XGBoost, LightGBM, and Neural Networks for potentially higher accuracy.

Explainability: Integrate SHAP analysis to better interpret feature contributions.

🧰 Tools & Techniques
Category	Tools Used
Language	Python
Libraries	pandas, numpy, matplotlib, seaborn, sklearn, imblearn
Feature Selection	Chi-Square, PCA, Lasso
Modeling	KNN, K-Means, Logistic Regression, Random Forest
Resampling	SMOTE
Scaling	MinMaxScaler

🏁 Summary

This project provides a comprehensive analysis of loan repayment prediction using statistical and machine learning methods.
Through structured data cleaning, feature engineering, and model comparison, we identified the most predictive features and optimal classification approach.

✅ Random Forest emerged as the best-performing model, balancing interpretability and predictive power — offering practical value for risk management in online lending platforms.
