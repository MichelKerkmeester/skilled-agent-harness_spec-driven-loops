# Iteration 2

## Focus

Angle 2: UNKNOWN-surface path (Q2): what a review does when the surface is UNKNOWN, how much of the baseline remains useful, and how a repository could declare its own surface evidence.

## Actions Taken

- Read the review mode's baseline and detection contract, the shared stack detector, the root UNKNOWN fallback, and the review-core explanation of baseline precedence.
- Searched the review packet and shared code references for a repository-local surface profile or declaration hook.
- Kept this iteration within the current review packet and shared routing sources.

## Findings

1. **DERIVED — The baseline remains useful but narrow.** UNKNOWN keeps the findings-first review doctrine and mandatory security/correctness minimums, and the reviewer must disclose uncertainty. Surface-specific style, process, build, and test conventions are unavailable. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:54] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:59] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:64] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:73] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:83] [SOURCE: .skilled/skills/sk-code/sk-code-review/README.md:178]

2. **OBSERVED — No persistent repository declaration is present in the inspected detector contract.** The review detector returns only SKILLED or UNKNOWN, recognizes .skilled/ paths, and otherwise returns UNKNOWN. The shared detector says unsupported paths remain UNKNOWN until the user clarifies. The root router's fallback asks for the files and verification command, which supports a per-review clarification rather than a saved repository profile. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:225] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:238] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:241] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:25] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:36] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:89] [SOURCE: .skilled/skills/sk-code/ROUTER.md:184] [SOURCE: .skilled/skills/sk-code/ROUTER.md:188]

3. **INFERRED — A small repository-local surface profile could fill that gap.** It could declare ownership markers, the review standards to load, and the verification commands, with references constrained to the resolved repository root. Keep UNKNOWN as the fallback when the profile is absent or ambiguous. This is a proposal, not current behavior. Effort is estimated at M. The main risk is stale or untrusted paths applying the wrong standards. It needs a decision on the profile schema and precedence. The likely touch points are sk-code-review/SKILL.md, shared/references/stack-detection.md, hub-router.json, and ROUTER.md; routing changes need both hub stages. It affects sk-code-skilled evidence packets, the shared @review and @deep-review consumers, and future repository-authored surface evidence. A fixture repository without .skilled/ that declares a profile would confirm the proposal if the profile routes its evidence and missing or invalid declarations still fall back to UNKNOWN. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:225] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:36] [SOURCE: .skilled/skills/sk-code/ROUTER.md:184]

## Questions Answered

- Q2 UNKNOWN-surface path: what does a review do when the surface is UNKNOWN, how much of the baseline stays useful, and how could a repository declare its own surface evidence?

## Questions Remaining

- Q3 through Q10 remain open.

## Next Focus

Angle 3: Q3 Output contract: which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)?
