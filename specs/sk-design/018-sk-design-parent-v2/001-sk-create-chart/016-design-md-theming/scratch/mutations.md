# Mutation proofs

These checks were run against temporary mutations and each target was restored before the next
check. The failure lines below are the observed lines, including the checker family.

| Mutation | Command | Observed failure | Exit |
|---|---|---|---:|
| Malformed provenance hash in `scratch/themed/bar-columns.html` | `node scripts/check-corpus.cjs --extra scratch/themed` | `FAIL [design-md] --extra/bar-columns.html: design-md light provenance is missing or malformed directly under the begin marker; expected path, sha256=<64 hex> and generator=<version>` | 1 |
| Light inline series value changed to `#AAAAAA` | `node scripts/check-corpus.cjs --extra scratch/themed` | `FAIL [design-md] --extra/bar-columns.html: design-md light series[0] reads 2.32:1 on the light ground, below the 3:1 mark gate` | 1 |
| One byte changed in a stock light palette surface | `node scripts/check-corpus.cjs` | `FAIL [palette-block] assets/templates/daily-line.html: the light palette block drifted from the source: --chart-surface is #FAF8F4 and the palette source says #FAF8F5.` | 1 |

The first two scratch mutations were restored to the generator output by applying the original
hash and series value. The stock mutation was restored to `#FAF8F5`; the final static corpus run
is the restoration check.
