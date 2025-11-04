📊 Independence Testing for Multivariate Data

A Comparative Study of Distance Correlation, HSIC, and Rank-Based Tests

📘 Overview

This project explores advanced independence testing methods for multivariate data, focusing on determining whether two sets of variables are statistically related.
Four tests were implemented from scratch — Distance Correlation (DCOR), Hilbert-Schmidt Independence Criterion (HSIC), Sum of Rank Correlations (SRC), and Maxima of Rank Correlations (MRC) — and compared through simulation and real-world applications.

The study combines theory, simulation, and data analysis to determine which methods perform best in low- and high-dimensional settings.
Applications include both prostate cancer data (biomedical context) and customer purchase records (business context).

🎯 Objectives

Implement four independence tests from scratch in R.

Evaluate each method through simulation and real data.

Compare tests based on Type I error, power, parameter sensitivity, and efficiency.

Recommend appropriate tests for different dimensional settings and application domains.

🧮 Methods Implemented
🔹 Distance Correlation (DCOR)

Measures association between multivariate random vectors.

Captures both linear and nonlinear dependencies.

Performs best for low-dimensional data.

🔹 Hilbert-Schmidt Independence Criterion (HSIC)

Kernel-based test using Gaussian kernels.

Excels at detecting complex nonlinear patterns in high-dimensional data.

Sensitive to kernel width parameter (σ²); optimal near the median pairwise distance.

🔹 Sum of Rank Correlations (SRC)

Aggregates Spearman rank correlations across all variable pairs.

Simple and interpretable, but less powerful in complex relationships.

🔹 Maxima of Rank Correlations (MRC)

Focuses on the strongest individual pairwise correlation.

Useful for detecting dominant relationships, though less stable under noise.

⚙️ Simulation Results
Scenario	Best Performing Test	Key Observations
Low-dimensional (dX = dY = 2)	Distance Correlation (DCOR)	Stable Type I ≈ 2%, power ≈ 100%
High-dimensional (dX = dY = 10)	Hilbert-Schmidt Independence Criterion (HSIC)	Excellent error control ≈ 0%, power ≈ 100%
Parameter Sensitivity	HSIC	Requires careful σ² tuning
Computation	DCOR & HSIC	Most efficient and stable

✅ Recommendation

Use DCOR for small, interpretable datasets.

Use HSIC for high-dimensional or nonlinear relationships (e.g., marketing, genomics).

📊 Real Data Applications
🧬 Prostate Cancer Dataset

Testing dependence between biological and demographic variables:


X={lpsa, lcavol, lweight}

Y={age, lbph, lcp}

All four tests (DCOR, HSIC, SRC, MRC) rejected independence, showing strong relationships between cancer indicators and patient characteristics.

🛒 Customer Purchase Data

Analyzed relationships between customer purchase patterns and economic/demographic indicators.

HSIC was the most effective at uncovering nonlinear dependencies.

Offers reliable and computationally efficient insight for business decision-making.

💡 Key Takeaways

DCOR → Best for low-dimensional, interpretable data.

HSIC → Best for complex, high-dimensional relationships.

SRC/MRC → Simpler rank-based options but lower statistical power.

HSIC provides robust, efficient, and scalable independence detection for real-world data.

🧰 Tools & Implementation
Category	Details
Language	R
Key Libraries	stats, Matrix, ggplot2
Approach	Manual implementation of test statistics and permutation tests
Data Sources	1️⃣ Prostate Cancer Dataset (Hastie et al.) 2️⃣ Synthetic Customer Purchase Data
