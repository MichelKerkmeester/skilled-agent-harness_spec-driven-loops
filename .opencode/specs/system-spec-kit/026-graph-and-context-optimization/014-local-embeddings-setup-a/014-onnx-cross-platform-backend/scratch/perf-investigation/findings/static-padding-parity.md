# Static Padding Parity Check

This supporting check compares static-padding candidates against `SentenceTransformer("google/embeddinggemma-300m")` on the same 50 chunks.

| Max length | Static flag | Fixed padding | Mean cosine | Min cosine | p05 cosine |
|---:|---:|---:|---:|---:|---:|
| 128 | 1 | True | 0.868655443 | 0.488552541 | 0.767117858 |
| 512 | 1 | True | 0.997692108 | 0.992301106 | 0.993555009 |
| 2048 | 0 | False | 0.997692108 | 0.992301047 | 0.993555009 |

Interpretation: max_length=128 is only viable if truncation still meets the existing mean >= 0.995 and min >= 0.99 parity bar.
