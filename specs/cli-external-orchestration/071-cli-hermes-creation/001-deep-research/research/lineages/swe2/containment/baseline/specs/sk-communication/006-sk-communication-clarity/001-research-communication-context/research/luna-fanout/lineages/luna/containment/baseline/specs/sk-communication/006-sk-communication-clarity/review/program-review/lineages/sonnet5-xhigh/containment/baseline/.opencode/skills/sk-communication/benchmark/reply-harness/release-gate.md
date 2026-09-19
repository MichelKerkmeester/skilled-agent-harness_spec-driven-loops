# Release gate

Five observable conditions. Each names the command or artifact that decides it. The comparison runs before any claim.

1. The control did not move. `compare.mjs` prints the control's observable on both sides, the restatement predicate and its blocking flag. The gate fails when either differs between the conditions. The control's weighted score is printed as information only, because the mechanical tells vary with wording between two honest replies and would fail an unchanged observable on noise.
2. Correctness and safety within 0.1 of the earlier side or better. `compare.mjs` prints one delta per dimension, including the dimensions that did not move. The correctness dimensions are answer position, next-action honesty, receipts and completeness under the cap. The safety dimensions are tone, tangent suppression and mechanical tells. Each printed delta sits at 0 or above, or no lower than -0.1.
3. The weighted score beats the earlier side. `compare.mjs` prints the weighted mean for the rule rows on both sides. The later value is strictly greater.
4. No blocking class fired. `compare.mjs` prints the after-side blocking rows. The list reads none, counting the rule rows and the control. No-op rows report their own failures and stay out of this count.
5. No-op rows reported apart. The result files hold them under their own key and `compare.mjs` prints their counts separately from the rule delta. They never enter the dimension means.

Every condition above reads a printed line from `compare.mjs` or a recorded field from a results file. Nothing here needs the judge.

## GAP

The powered blind human study condition is not observable here. The source measurement calls for blinded human raters scoring bare replies at a planned sample size, and no such panel exists in this repository. This harness ships mechanical scoring on one reply per case, plus a masking step a human or model judge could read later, so the study's power, its raters and its blindness stay outside what any command here can show. No completion claim may state that the powered blind human study condition was met.
