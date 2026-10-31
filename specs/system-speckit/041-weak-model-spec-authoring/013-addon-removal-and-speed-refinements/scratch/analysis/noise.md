# Noise per metric

Paired difference is refined minus now054 within a round. n_rounds is the paired rounds needed to detect a 10 percent change at 80 percent power, two-sided alpha 0.05: n = ((1.96 + 0.84) * sd_diff / (0.10 * mean_now054))^2.

| step | metric | variant | mean | sd | CV | paired sd (refined-now054) | n_rounds for 10% |
|---|---|---|---|---|---|---|---|
| author | seconds | pre054 | 191.3 | 36.1 | 0.19 | 178.0 |  |
| author | seconds | main-no054 | 276.0 | 79.9 | 0.29 | 178.0 |  |
| author | seconds | now054 | 259.3 | 87.8 | 0.34 | 178.0 |  |
| author | seconds | refined | 276.7 | 92.0 | 0.33 | 178.0 | 370 |
| author | tool_calls | pre054 | 72.0 | 9.8 | 0.14 | 38.0 |  |
| author | tool_calls | main-no054 | 86.7 | 5.8 | 0.07 | 38.0 |  |
| author | tool_calls | now054 | 81.3 | 16.7 | 0.20 | 38.0 |  |
| author | tool_calls | refined | 84.3 | 22.2 | 0.26 | 38.0 | 172 |
| author | validate_calls | pre054 | 4.0 | 1.0 | 0.25 | 6.7 |  |
| author | validate_calls | main-no054 | 5.0 | 1.7 | 0.35 | 6.7 |  |
| author | validate_calls | now054 | 7.3 | 3.8 | 0.52 | 6.7 |  |
| author | validate_calls | refined | 7.0 | 3.6 | 0.52 | 6.7 | 647 |
| author | tok_out | pre054 | 37578.3 | 5892.2 | 0.16 | 28199.6 |  |
| author | tok_out | main-no054 | 47257.0 | 12911.8 | 0.27 | 28199.6 |  |
| author | tok_out | now054 | 55488.7 | 14052.5 | 0.25 | 28199.6 |  |
| author | tok_out | refined | 53148.3 | 15877.0 | 0.30 | 28199.6 | 203 |
| author | tok_in | pre054 | 140998.7 | 19003.2 | 0.13 | 80100.3 |  |
| author | tok_in | main-no054 | 151668.3 | 17749.7 | 0.12 | 80100.3 |  |
| author | tok_in | now054 | 165808.7 | 36498.5 | 0.22 | 80100.3 |  |
| author | tok_in | refined | 167208.7 | 50790.1 | 0.30 | 80100.3 | 183 |
| upkeep | seconds | pre054 | 68.3 | 14.0 | 0.21 | 30.3 |  |
| upkeep | seconds | main-no054 | 90.3 | 39.6 | 0.44 | 30.3 |  |
| upkeep | seconds | now054 | 68.7 | 17.5 | 0.25 | 30.3 |  |
| upkeep | seconds | refined | 69.7 | 17.5 | 0.25 | 30.3 | 153 |
| upkeep | tool_calls | pre054 | 25.7 | 4.9 | 0.19 | 7.0 |  |
| upkeep | tool_calls | main-no054 | 41.7 | 21.5 | 0.52 | 7.0 |  |
| upkeep | tool_calls | now054 | 25.7 | 3.5 | 0.14 | 7.0 |  |
| upkeep | tool_calls | refined | 29.7 | 6.4 | 0.21 | 7.0 | 59 |
| upkeep | validate_calls | pre054 | 3.0 | 0.0 | 0.00 | 3.6 |  |
| upkeep | validate_calls | main-no054 | 2.7 | 1.5 | 0.57 | 3.6 |  |
| upkeep | validate_calls | now054 | 3.7 | 1.2 | 0.31 | 3.6 |  |
| upkeep | validate_calls | refined | 5.7 | 2.5 | 0.44 | 3.6 | 759 |
| upkeep | tok_out | pre054 | 10094.7 | 3464.9 | 0.34 | 4057.3 |  |
| upkeep | tok_out | main-no054 | 14096.3 | 10295.3 | 0.73 | 4057.3 |  |
| upkeep | tok_out | now054 | 11088.3 | 3355.9 | 0.30 | 4057.3 |  |
| upkeep | tok_out | refined | 13133.3 | 1492.7 | 0.11 | 4057.3 | 105 |
| upkeep | tok_in | pre054 | 46935.0 | 21150.2 | 0.45 | 5801.9 |  |
| upkeep | tok_in | main-no054 | 61990.7 | 45016.3 | 0.73 | 5801.9 |  |
| upkeep | tok_in | now054 | 49134.3 | 11062.5 | 0.23 | 5801.9 |  |
| upkeep | tok_in | refined | 49536.3 | 11053.5 | 0.22 | 5801.9 | 11 |
