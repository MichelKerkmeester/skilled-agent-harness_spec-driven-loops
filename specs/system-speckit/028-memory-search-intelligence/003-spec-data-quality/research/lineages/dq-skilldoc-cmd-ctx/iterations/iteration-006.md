# Iteration 006 — Adversarial verification + convergence

**Focus:** Stress-test the highest-value gaps against the remaining unexamined workflows; confirm no shipped tier already closes them.

## Verification Results

### V1 — F4.1 (triple-copy trigger vocabulary) SURVIVES, and the mechanism to fix it already ships
`rule-canary-sync.yml` is titled "Load-bearing rule wording stays in sync across copies" and "Check that load-bearing rule wording has not drifted," fail-closed in CI. `[SOURCE: rule-canary-sync.yml name + step]` This is the **proven cross-copy drift mechanism** — but a grep proves it does NOT cover the trigger vocabularies: `WORK_INTENT_VERBS`/`FILE_WRITE_TRIGGERS` appear in **no** workflow and **no** git hook. `[SOURCE: grep across .github/workflows + .git/hooks → empty]`
- **Sharpened (reuse-first):** F4.1 becomes "extend the shipped `rule-canary-sync` cross-copy canary pattern to the three trigger vocabularies (CLAUDE.md prose ↔ `gate-3-classifier.ts` ↔ advisor `prompt-policy.json`), with an allow-list for sanctioned divergences (`analyze`)." The gap is the *target set*, not the *mechanism* — strengthens the finding.

### V2 — F3.1 (command-router contract) SURVIVES
No workflow or git hook references `argument-hint` or generalizes `route-validate`. `[SOURCE: grep → empty]` route-validate's 8 assertions remain doctor-only; 27/28 command docs ungated. Confirmed.

### V3 — Context-engineering surface is partially covered; gaps narrowed honestly
`prompt-card-sync.yml` is a "3-layer prompt-knowledge drift guard" over sk-prompt / sk-prompt-models / cli-* (table inlining, Tier-3 escalation drift, registry/profile/_index completeness, per-model discovery reachability). `[SOURCE: prompt-card-sync.yml]` So the **prompt-craft card layer of context-engineering is already gated.** The surgical context-eng gaps narrow to exactly: trigger-vocabulary coherence (F4.1), hook-validation automation (F4.2), and template-placeholder parity (F4.3) — NOT the prompt-craft cards.

## Convergence Decision
- **Stop reason:** all_questions_answered — KQ1–KQ5 resolved with file:line grounding; adversarial pass complete; all findings survived (two sharpened, none overturned).
- **Quality guards:** source diversity PASS (pre-commit hook, 8 CI workflows, advisor skill-graph + prompt-policy, route-validate, gate-3-classifier, DQI scorer, check-links — all independent file:line sources); focus alignment PASS (every finding maps to one of the three named surfaces); no-single-weak-source PASS (every keystone has ≥2 corroborating sources).
- **newInfoRatio:** 0.30 — verification iteration; confirms and sharpens, low net-new.

## Assessment
Ready for synthesis. The program is a three-tier timing topology with an empty scheduled tier as the multiplier, and a surgical per-surface detector payload that no shipped tier covers.
