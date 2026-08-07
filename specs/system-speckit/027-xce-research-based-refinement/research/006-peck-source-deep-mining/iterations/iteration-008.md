# Iteration 008 — Deferred T1 re-evaluation (per-AC ≥90% coverage gate) [HEADLINE]

**Focus:** Given 026 closed + live validate.sh/checklist/deep-review, is the deferred T1 coverage gate now adoptable? Concrete design + packet-shape verdict.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.58.

## Findings (design)
- **[F-008-01]** AC traceability table replacing the single `CHK-020 [P0] All acceptance criteria met` checkbox: `AC-id | classification (Tested/Partially/Manual/Not-covered) | evidence (test @ file:line)` (peck `acceptance-reviewer.md:36-42` vs `templates/manifest/checklist.md.tmpl:69-76`). **ADAPT** · S · low · template-only until validator consumes it.
- **[F-008-02]** `AC_COVERAGE` rule: `covered = Tested+Partially+Manual`; `covered/total ≥ floor(total × SPECKIT_AC_COVERAGE_FLOOR)`, default 0.9 (peck `acceptance-reviewer.md:42` vs `validation_rules.md:424-453` where EVIDENCE_CITED only checks generic tokens). **ADAPT** · M · med (false-block risk on in-flight folders) · blast: validation_rules + registry + CLAUDE.md §2.
- **[F-008-03]** Stage rollout WARNING→ERROR (strict already turns warnings into exit-2) (`acceptance-reviewer.md:79-83` + `validation_rules.md:29-35`). **ADAPT** · S · low-med.
- **[F-008-04]** Explicit `Manual — automation infeasible` escape hatch counts as covered only WITH evidence+rationale (peck `acceptance-reviewer.md:39-42`). **ADAPT** · S · gaming-risk if rationale unreviewed.
- **[F-008-05]** Bind the final AC-coverage verdict to fresh-context `deep-review`, not the implementer (peck dual-reviewer `README.md:28-33` vs `deep-review/SKILL.md:310-367`). **ADAPT** · M · med.
- **[F-008-06]** Per-LEVEL opt-in: default on for L2+ once checklist.md exists; L1 exempt unless opted in (`validation_rules.md:70-75`, `CLAUDE.md:247-252`). **ADAPT** · S · low.
- **[F-008-07]** **ADOPT-AS-PACKET** — T1 should be its OWN packet, not a sub-phase of 006: it still touches checklist template + validation rule/registry + completion verification + deep-review binding = packet-sized blast radius, matching the original "separate future packet" deferral (`peck-teachings-analysis.md:297-301`, `001-peck-teachings-adoption/spec.md:131-133`). **EFFORT M/L · RISK med.**

## Ruled out (reuse, don't rebuild)
- AC syntax: spec-kit already has L1/L2 AC columns + L3 Given/When/Then (`spec.md.tmpl:89-97,526-543,765-772`).
- evidence infra: EVIDENCE_CITED already recognizes [Test:]/[File:]/[Commit:] (`validation_rules.md:424-445`).
- reviewer primitive: deep-review already has fresh context + traceability + PASS/CONDITIONAL/FAIL (`deep-review/SKILL.md:310-367`).

## Verdict contribution
**The deferred T1 is NOW adoptable** — post-026 the validation/checklist/deep-review substrate exists; T1 becomes a STAGED, REUSE-HEAVY packet (AC table + AC_COVERAGE rule + deep-review binding + WARNING→ERROR + per-level opt-in). Recommendation: a **standalone `027/0NN-acceptance-coverage-gate` packet** (NOT folded into the 006 verification-discipline sub-packet). The 006 sub-packet proposal should formally hand T1 off as its own sibling, with the benchmark harness (006) as its test substrate.
