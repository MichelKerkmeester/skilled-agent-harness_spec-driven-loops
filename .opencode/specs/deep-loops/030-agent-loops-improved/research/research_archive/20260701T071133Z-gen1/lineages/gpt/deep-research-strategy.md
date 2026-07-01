# Deep Research Strategy

## Research Topic

Find upgrade, fix, and expansion recommendations to perfect the `deep-loops/030-agent-loops-improved` packet across all 8 phases and its own review tooling, including fan-out, salvage, merge, convergence math, deep-review, and deep-research lineage behavior.

## Known Context

- Operator supplied known leads: comment-hygiene violations in `deep_review_auto.yaml` and `deep_research_auto.yaml`; phase-parent documentation maps stuck at Draft; stale `completion_pct: 0` continuity; conditional codex/glm review lineages not reconciled after 007 fan-out hardening; unresolved GLM P1-007 graph metadata key-file omissions; abandoned native review lineage lock; orphaned pre-migration report; weak-evidence phases; empty complete-status scaffolds; missing ADR records; possible convergence threading and lineage timeout risks.
- `resource-map.md` was not present in the lineage artifact directory at init; skipping lineage-local coverage gate.

## Key Questions

1. Which packet documentation states still claim Complete while evidence, checklist, metadata, or continuity contradicts them?
2. Which review/research lineage artifacts are stale, abandoned, unreconciled, or misleading after later fixes?
3. Which runtime scripts or workflow YAMLs contain bugs or brittle contracts affecting fan-out, salvage, merge, convergence, or timeout behavior?
4. Which phase packets need stronger evidence, tests, ADR/checklist records, or documentation-map updates before completion can be trusted?
5. What safety, observability, and loop-system hardening upgrades would most reduce future drift?

## Answered Questions

- Packet documentation drift is confirmed: top-level 002-007 Complete claims conflict with phase-parent Draft child maps; 008 continuity now claims completion while the top-level map still says In Progress.
- Complete folders still contain live template scaffolds and `completion_pct: 0` continuity in sampled `001`, `004/001`, `005/001`, and `007` child surfaces.
- Review lineage reconciliation drift is confirmed: 007 fan-out-hardening claims fixes shipped, while codex/glm registries still show the corresponding P1/P2 findings active; native has an expired lock with an old packet id.
- Runtime/YAML bugs are confirmed: both research/review YAMLs retain ephemeral F-010-B5 markers; research fan-out omits `--convergence-threshold`; review YAML still writes `{ISO_8601_NOW}` session ids; per-lineage timeout hard-caps at 4 hours.
- Weak evidence is confirmed in `008/003`, `006/005`, and `006/006`; root and phase-008 graph metadata omit current implementation surfaces.
- ADR/checklist governance gaps are confirmed: only one `decision-record.md` and zero `checklist.md` files exist under a packet containing multiple Complete Level 2/3 ADR-style phases.
- Preventive hardening targets identified: scaffold-complete drift, phase-map sync, status/completion_pct consistency, key-file coverage, review-finding adjudication, comment-hygiene lint, and fan-out YAML/timeout contract tests.
- Final gap sweep found additional ephemeral markers at `deep_review_auto.yaml:988` and `deep_research_auto.yaml:1099`, no grep-visible threshold/timeout tests, and further 002 stale scaffold examples.

## What Worked

- Direct phase-map reads exposed cross-packet status drift with low ambiguity.
- Sampling plan/tasks/summary files exposed a validator-worthy stale-template pattern.
- Cross-reading shipped 007 docs against review registries exposed a missing post-remediation adjudication step.
- Comparing review vs research fan-out commands found the missing research convergence-threshold argument.
- Comparing implementation summaries to tasks exposed claim/evidence drift.
- Glob checks gave definitive file-presence evidence for missing decision/checklist artifacts.
- Reading current validators identified narrow prevention hooks instead of broad process advice.
- Narrow gap sweeps confirmed the finding taxonomy is stable after iteration 8.

## What Failed

- Broad grep across all markdown produced too many stale continuity hits to triage in one iteration.
- Manual enumeration of every stale scaffold would be error-prone; a scripted validator/backfill pass is needed.
- No adjudication ledger was found explaining which pre-fix review findings were validated resolved.
- No single test fixture appears to tie deep command YAML fan-out arguments to runner prompt output.
- Graph metadata does not explain why selected key files were chosen, so stale metadata root cause remains uncertain.
- It is unclear whether embedded ADR text in `spec.md` was intentionally accepted as a substitute for separate `decision-record.md`; no exception is documented in the packet.
- The validator registry was not traced end-to-end; exact implementation home for each proposed rule remains a follow-up design choice.
- Full stale-scaffold enumeration remains too broad for manual review; recommended remediation is a packet-wide detector/backfill.

## Exhausted Approaches

- None yet.

## Ruled-Out Directions

- Do not classify phase 008 as wholly unrepaired; its parent spec now names fan-out key files and claims completion, but the top-level map remains inconsistent.
- Do not treat `implementation-summary.md` presence alone as proof of completion; at least one present summary still contains template text.
- Do not merge the old-path `skilled-agent-orchestration/123-agent-loops-improved` GLM report as current state; treat it as historical unless explicitly archived/tombstoned.
- Do not treat `fanout-run.cjs` as wholly unable to thread convergence; it can include the threshold when provided, but research YAML fails to pass it.
- Do not treat blocked test attempts as equivalent to green test evidence.
- Do not assume the single `decision-record.md` covers all ADR phases; it is scoped only to convergence-profile unification.
- Do not rely on evidence-marker lint to catch durable YAML finding-id comments; its scope is evidence markers, not comment hygiene.
- Do not continue broad grep searches without a new question; iterations 9-11 produced no new information.

## Active Risks

- Research must not write outside this detached lineage artifact directory.
- Findings must remain recommendations only; no implementation fixes during research.

## Non-Goals

- Do not modify packet source, workflow code, review lineages, or spec documents outside the `gpt` lineage artifact directory.
- Do not mark any external checklist or packet complete.

## Stop Conditions

- Stop at legal convergence when new information drops below `0.01` and quality gates pass, or at `maxIterations=35`, whichever comes first.
- Stop early only if all key questions have evidence-backed answers and source diversity is sufficient.

## Next Focus

Synthesis.
