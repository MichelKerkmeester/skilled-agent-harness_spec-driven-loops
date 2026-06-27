# Iteration 3: Traceability

## Focus
Execute the two core cross-reference protocols (`spec_code`, `checklist_evidence`) against the PLANNED scaffold, and validate every concrete reference the spec/plan make: the parent research-seam citations, the external code-surface references, and the resolvability of the `research/research.md` path from the phase folder.

Files: `spec.md` (frontmatter key_files, scope, REQs), `plan.md` (affected surfaces), `checklist.md`, `implementation-summary.md`, `research/research.md` (parent), plus filesystem checks of referenced surfaces.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 5 docs + 4 filesystem reference checks
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.75

## Findings

### P2, Suggestion
- **F002**: Stale path to the prod-mode recall harness. `spec.md:23` (frontmatter `key_files`) lists `.opencode/skills/system-spec-kit/mcp_server/scripts/eval/run-eval-v2.mjs` (singular `eval`), but the file actually lives at `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` (plural `evals`, confirmed by `find`). The basename reference in `plan.md:109` is correct (it cites only `run-eval-v2.mjs`), so the defect is localized to the spec frontmatter pointer. Low blast radius — the file is one directory over — but the planned `measurement-plan.md` is told to name this harness as the prod-at-3 reader, so the pointer should resolve. Recommend `eval` → `evals`.

- **F003**: Forward reference stated in present tense. `spec.md:81` and REQ-003 (`spec.md:115`) tie INV-1 to "the `computeAuthoredDocQuality` wrapper that throws on full-auto" as though the mechanism exists. A repo-wide grep finds `computeAuthoredDocQuality` only in `research/research.md`, the sibling `026-shared-safe-fix-engine/spec.md`, and this spec — never in shipped code. It is a forward reference to sibling A1 / engine work (named dependencies at `plan.md:161-162`), which is legitimate for a governance layer that *orders* future phases. The risk is that the planned `safety-model.md` will codify INV-1 against an unbuilt symbol in present tense. Recommend the governance docs mark `computeAuthoredDocQuality` as planned/owned-by-sibling rather than extant.

- **F004**: `research/research.md` citations are path-unresolvable from the phase folder. All research seams (`spec.md:66,78,81,87,89,91`; `plan.md:87,89,91,125,127`) cite `research/research.md:NNN`, but the file is at the PARENT `005-spec-data-quality/research/research.md`, one directory ABOVE `028-governance-rollout/`. There is no `research/` directory inside the phase folder (confirmed by `ls`). The line numbers are accurate (verified §5=104-118, Tier-D=55-66, novel=83-85, INV=110), so the citations are *semantically* correct but *literally* unresolvable from the phase folder vantage — relevant to CHK-041 ("Doc cross-references resolve to the named sibling folders"). Recommend either a `../research/research.md` relative form or an explicit note that research is program-level (parent `005`).

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `validate.sh` has `legacy_grandfathered` (3 hits) ✓; `validator-registry.json` exists ✓; `run-eval-v2.mjs` path stale (F002); `computeAuthoredDocQuality` not shipped (F003) | No *completion* claim is unsubstantiated — the phase is PLANNED and `implementation-summary.md:58` says "Nothing has shipped yet." Partial is due to two P2 external-pointer issues, not a contradiction between a done-claim and reality. |
| checklist_evidence | pass | hard | `checklist.md` has zero `[x]` marks; summary `0/12 P0, 0/13 P1, 0/1 P2` (`checklist.md:137-139`) | Trivially clean: there are no checked items to substantiate. Honest PLANNED state. No false evidence. |
| feature_catalog_code | n/a | advisory | — | No feature-catalog claim attached to this governance phase. Marked N/A. |
| playbook_capability | n/a | advisory | — | No playbook scenario for this phase. Marked N/A. |

## Assessment
- New findings ratio: 0.75
- Dimensions addressed: traceability
- Novelty justification: Three new P2 reference-accuracy findings (F002 stale path, F003 forward symbol, F004 unresolvable research path), all evidence-backed by filesystem checks. Core protocols executed: `spec_code` = partial (pointer staleness only, no completion contradiction), `checklist_evidence` = pass (no checked items, honest PLANNED state). The standout positive: the scaffold has **no false completion claims** — spec/plan/tasks/checklist/implementation-summary all agree the phase is PLANNED with nothing shipped, which is the cleanest possible traceability posture for an unbuilt phase.

## Ruled Out
- "spec_code fails hard because the deliverables do not exist": Ruled out. spec_code fails when a doc *claims shipped behavior that is absent*. Here every doc declares PLANNED; there is no done-claim to contradict. The protocol records partial only for the two external-pointer P2s.
- "The 18-item NO-GO target is unsupported by research (a traceability fail)": Ruled out as a *new* traceability finding — already captured as F001 (correctness) in Iteration 1. The research tables do enumerate the items; the issue is count-labeling precision, not a missing source.

## Dead Ends
- Auditing the realized cross-references inside `rollout-sequence.md` / `no-go-list.md` etc.: those files do not exist (PLANNED). Their cross-reference resolvability can only be checked post-build.

## Recommended Next Focus
Iteration 4: maintainability — assess doc structure, naming/convention adherence (phase-folder patterns, anchor structure), and whether the scaffold sets the downstream author up to succeed. Then evaluate convergence: 4/4 dimensions covered, core protocols run, no active P0/P1.

Review verdict: PASS
