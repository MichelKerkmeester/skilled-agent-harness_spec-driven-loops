# Iteration 3: Traceability — Doctrine vs Shipped Behavior (spec_code)

## Focus
Dimension: traceability. Core protocol `spec_code`: compare normative claims in `create-skill/references/shared/skill-root-metadata-contract.md` against shipped behavior in the contract library, the fleet gate, and the generator. Also `checklist_evidence` (Level 1 folder — no `checklist.md`, advisory/exempt) and a dead-link sweep of the doctrine's §7 related-resources.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 6 (doctrine doc + 5 code files cross-referenced)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.17

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F005**: Exit-code convention for "gate cannot run" is not reconciled across the two sibling fleet gates. `ci-skill-root-metadata.cjs:374-377` returns exit `2` when the skills dir is missing (matching doctrine `skill-root-metadata-contract.md` §5: "Exit 0 ... 2 when the gate cannot run"). `ci-leaf-manifest-freshness.cjs:100-103` returns exit `1` for the same condition (skills dir not found), and its own header (lines 24-27) documents only `0`/`1`. No single doctrine source states the freshness scanner's exit codes or reconciles the two conventions. A consumer that treats `2` as "infra failure, retry" and `1` as "violations" would misclassify a missing-skills-dir freshness run as a content violation. Minor documentation/contract drift; recommend documenting both gates' exit codes in one place and aligning the "cannot run" code.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | doctrine §2 vs live gate JSON (7H/4S, 11/11 pass); doctrine §3 vs REQUIRED_BY_CLASS/FORBIDDEN_BY_CLASS; doctrine §4 vs GENERATED_BY_CLASS; doctrine §6 vs assets/ ls; doctrine §7 vs references/parent-skill ls | All normative claims resolve to shipped behavior. Fleet roster, file matrix, generated-vs-authored split, template inventory, and related-resource links all verified. |
| checklist_evidence | skipped | hard | n/a | Level 1 folder, no checklist.md — advisory/exempt per protocol. |
| feature_catalog_code | partial | advisory | n/a | Not exercised this iteration; deferred to maintainability pass. |
| playbook_capability | partial | advisory | n/a | Not exercised this iteration; deferred. |

## Assessment
- New findings ratio: 0.17 (1 new P2 across 6 files)
- Dimensions addressed: traceability
- Novelty justification: The doctrine is unusually honest against the code — every normative claim (fleet roster, file matrix, generated-vs-authored, template inventory, related-resource links) was verified against shipped behavior and matched. The single finding is a cross-gate exit-code convention gap, not a doctrine-vs-code contradiction.

## Ruled Out
- "Doctrine fleet roster drifted from reality": ruled out — live `ci-skill-root-metadata.cjs --format json` returns H=7 (cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, sk-prompt, system-deep-loop) and S=4 (mcp-code-mode, sk-git, system-skill-advisor, system-spec-kit), matching doctrine §2 exactly.
- "Dead links in doctrine §7": ruled out — `parent-skills-nested-packets.md`, `parent-hub-router-schema.md` (under `references/parent-skill/`), and `validation-and-packaging.md` (under `references/shared/`) all exist.
- "Template inventory drift": ruled out — all eight templates listed in doctrine §6 are present under `assets/parent-skill/` and `assets/skill/`.
- "Overlay set non-empty": ruled out — `OVERLAY_FILES = Object.freeze({})` matches doctrine §5 "the overlay set is currently empty".

## Dead Ends
- Searched for restated-instead-of-linked content between the doctrine and the code headers; the code headers explain WHY (design rationale) while the doctrine explains WHAT (the contract) — complementary, not duplicated.

## Recommended Next Focus
D4 Maintainability — test vacuity/fixture honesty (create-journey-proof, watcher test), dead code, exit-code consistency, and the cross-package test dependency.

Review verdict: PASS
