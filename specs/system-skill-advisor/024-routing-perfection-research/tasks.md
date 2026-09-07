---
title: "Tasks: Perfect skill routing across the fleet: why an advertised phrase fails to arrive"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Perfect skill routing across the fleet: why an advertised phrase fails to arrive

---

<!-- ANCHOR:notation -->
## Task Notation

`T###` task id, `[P]` may run in parallel with its neighbours, `[x]` done with evidence.

---

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Establish the baseline over the whole declared inventory (439 phrases, generation 698: wrong-hub 19, outranked 18, no-reach 136)
- [x] T002 Prove membership causal on a scratch projection, with a control (`corner radius` nothing → 0.8286 → nothing; `font size` untouched, dead throughout)
- [x] T003 Test whether a generated signal beats a competing incumbent (`decision branch` reached rank 2 behind sk-git 0.9451; it does not)

---

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Promote probe failures to `probe-error` records that fail the run (`ci-router-vocabulary-reach.cjs`)
- [x] T005 Make the advisor path overridable so the failure path can be exercised (`ROUTER_REACH_ADVISOR`)
- [x] T006 Replace the presence predicate with rank; add `outranked` as its own failing kind
- [x] T007 Refuse `--limit` under CI; fail a hub whose router parses to no phrases; record the daemon generation
- [x] T008 Fix `resourceContractVersion` to a number in `sk-design/mode-registry.json` and regenerate the leaf manifest
- [x] T009 [P] Add the command column to the `sk-design` mode table (6c)
- [x] T010 [P] Correct the `sk-design-fundamentals` frontmatter name (3d)
- [x] T011 [P] Add `orderedBundle` and `defer` to `routerPolicy.outcomes` (5g)
- [x] T012 [P] Author the hub changelog entry and the benchmark index with real content, not empty directories (7a, 9b)
- [x] T013 Write the merge generator reusing the reach check's extractor (`generate-router-intent-signals.cjs`)
- [x] T014 Apply it across six hubs and rebuild the advisor (260 phrases added)

---

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Watch the gate fail against an absent advisor (`probe-error=77`, `RESULT: FAILED`, exit 1)
- [x] T016 Confirm `--limit` under CI exits 2 and by-hand sampling still exits 0
- [x] T017 Confirm the generator is idempotent (`--check` after `--write` reports `missing=0`)
- [x] T018 Re-measure the whole inventory (generation 704: wrong-hub 0, outranked 18, no-reach 2)
- [x] T019 Confirm all six hubs pass `parent-skill-check` and the three skipped checks now execute
- [x] T020 Confirm root metadata, derived freshness and leaf-manifest freshness stay 13/13
- [x] T021 Classify the residue and attribute each entry to a cause vocabulary cannot fix

---

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Every acceptance criterion `Met` against observed command output, the residue classified, and no fleet checker regressed. All met; see `acceptance-criteria.md`.

---

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Document | Role |
|----------|------|
| `research/synthesis.md` | The evidence base and the ranked recommendations |
| `research/dispatch-prompt.md` | The angles the research worked |
| `decision-record.md` | Why the scorer stayed out of scope |
| `implementation-summary.md` | What shipped and what it measured |

---

## Verification Checklist

- [x] Baseline captured before any change, at a named generation
- [x] Each gate watched failing before being accepted
- [x] Negative control carried through the causality experiment
- [x] Whole inventory measured, never sampled
- [x] Scoped diff contains no unrelated file and no other session's work

---

## Verification Protocol

Counts come from `ci-router-vocabulary-reach.cjs` run without `--limit`, at a recorded daemon generation. Structural claims come from `parent-skill-check.cjs` per hub. Freshness claims come from the three fleet checkers. A claim with no command behind it is not made.

---

## Pre-Implementation

- [x] Read the synthesis rather than re-deriving it
- [x] Confirmed the working tree held no other session's files in the staged set

---

## Code Quality

- [x] The extractor has one definition, shared by the gate and the generator
- [x] Comments carry the durable why, not task or spec identifiers
- [x] The generator appends and cannot destroy authored content

---

## Testing Checklist

- [x] Failure path exercised, not assumed
- [x] Idempotence verified by a second run
- [x] Control phrase confirmed unmoved by an unrelated rebuild

---

## Fix Completeness

- [x] Root cause fixed at the producer, not patched at the symptom: `resourceContractVersion` corrected in the registry the generator reads, then the manifest regenerated
- [x] The three checks that a wrong type had silently disabled now execute

---

## Security

- [x] No credential, network or user-data surface touched

---

## Documentation

- [x] Hub changelog records what the conversion changed
- [x] Benchmark index states plainly that no run is archived, so an empty tree is not read as a pass

---

## File Organization

- [x] Generator filed beside its sibling generators
- [x] Human-facing artifacts kept outside loadable leaf sets

---

## Verification Summary

439 phrases measured twice. Real failures 173 → 20. Every remaining failure attributed to cross-hub arbitration or to a known separate cause.

---

## L3+: Architecture Verification

- [x] The two-stage contract is now explicit: stage two's declared vocabulary is the source, stage one's list is derived-and-merged
- [x] The invariant is enforced by a check mode rather than by convention

---

## L3+: Performance Verification

- [x] Scan cost measured: roughly 37 minutes for 439 phrases, dominated by per-probe process startup. Recorded so a before-and-after pair is budgeted rather than discovered

---

## L3+: Deployment Readiness

- [x] Rollback is `git revert` plus one advisor rebuild; no migration, no consumer speaking an old contract

---

## L3+: Compliance Verification

- [x] No push performed by this work; commits left local for operator review

---

## L3+: Documentation Verification

- [x] Spec, plan, tasks, acceptance criteria, decision record and implementation summary all authored against observed evidence rather than left as scaffold


<!-- /ANCHOR:cross-refs -->