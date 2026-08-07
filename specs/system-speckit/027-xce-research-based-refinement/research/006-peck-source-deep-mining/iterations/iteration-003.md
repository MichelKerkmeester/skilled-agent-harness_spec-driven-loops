# Iteration 003 — Numeric weighted severity rubric (score ≥4 blocks)

**Focus:** peck code-reviewer numeric weighted rubric (4-10, ±2 context, ≥4 blocks) vs spec-kit categorical P0/P1/P2 (deep-review + sk-code-review).
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.45.

## Findings
- **[F-003-01]** peck adds an auditable per-finding numeric cutoff "score ≥4 blocks" (`external/peck-master/src/assets/agents/code-reviewer.md:68,132`); spec-kit blocks by categorical verdict (P0→FAIL, P1→CONDITIONAL, P2→advisory) (`.opencode/skills/deep-review/SKILL.md:333,345,347,365`). GAP partial — spec-kit gates deterministically but lacks per-finding numeric calibration. **ADAPT** · M · med · blast: sk-code-review output schema + deep-review report schema only.
- **[F-003-02]** peck weights are mostly a P0/P1/P2 calibration table in disguise: 8-10≈P0 (security/correctness/concurrency), 5-7≈P1 (degraded behavior/false-confidence tests/type risk), 4≈P2/P1 maintainability (`code-reviewer.md:70,87,94` vs `deep-review/SKILL.md:337-339`). **ADAPT** · S · low · docs-only.
- **[F-003-03]** peck's `±2 for context` is the most useful delta — formalizes bounded downgrade/upgrade discretion, which spec-kit lacks (`code-reviewer.md:68` vs `sk-code-review/SKILL.md:370`, `deep-review/SKILL.md:382-383`). GAP real. **ADAPT** · M · med.
- **[F-003-04]** literal adoption OVER-BLOCKS maintainability: dead code / small dup / unnecessary abstraction all score 4 → would FAIL PRs, conflicting with spec-kit P2-advisory semantics (`code-reviewer.md:82-85` vs `deep-review/SKILL.md:339,365`). **SKIP literal cutoff** · high risk.
- **[F-003-05]** spec-kit already has numeric weighting at CONVERGENCE level (severity-weighted ratio), not per-finding (`deep-review/SKILL.md:14,21,460,461`). **ADAPT** an optional numeric `riskScore`, not a mandatory gate · M · med.
- **[F-003-06]** spec-kit validation already uses P0/P1/P2 for completion evidence → a numeric rubric should ANNOTATE not REPLACE P-levels (`references/validation/validation_rules.md:351-353,451-453`). **ADAPT** · S · low · docs-only.

## Ruled out
- read-only findings-first review w/ file:line evidence exists in both.
- categorical security/correctness/simplicity dimensions overlap already.
- "score ≥4 blocks" literal would over-block minor cleanup (conflicts w/ P2 advisory).

## Verdict contribution
Net-new is NOT "numeric severity" broadly (spec-kit has weighted convergence) but a **bounded ±2 context-adjustment aid** + an optional non-gating `riskScore` annotation. **ADAPT (docs/schema only)**; do NOT adopt the literal ≥4 block. Lower priority than 001/002.
