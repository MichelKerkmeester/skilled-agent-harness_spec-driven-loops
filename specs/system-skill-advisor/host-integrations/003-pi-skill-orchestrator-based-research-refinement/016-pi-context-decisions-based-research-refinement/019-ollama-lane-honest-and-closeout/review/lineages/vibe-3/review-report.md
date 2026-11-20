---
title: "Deep Review Report: Phase 019 ollama-lane-honest-and-closeout"
description: "Fan-out lineage vibe-3 review of the phase-019 commit set at HEAD: 10 iterations, 8 active findings, verdict CONDITIONAL."
---

# Deep Review Report

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** (the verdict is not PASS, so the advisory flag does not apply)
- **Active findings: P0 = 0, P1 = 3, P2 = 5** -- these are the counts the verdict used, read from `deep-review-findings-registry.json` after the final reducer pass.
- **Search debt: 0** -- both frontier nodes are answered on all four dimensions.
- **Dimension coverage: 4 of 4** (correctness, security, traceability, maintainability).
- **Stop reason: converged** (`composite_converged`, no blockers).
- **Release readiness: converged** -- no active P0, and the stop reason is `converged` with a CONDITIONAL verdict.

**Self-check outcomes.** The adversarial self-check re-read every active P1 against source and confirmed all three at P1. The Referee changed nothing, so no `claim_adjudication` row was appended and the counts above are unchanged by the self-check.

- `R1-P1-001` confirmed P1: `semantic-shadow.ts:392` calls `embeddingCoverage()` with no argument, and `skill-graph-db.ts:1326` defaults that to `getDb()`, while the sibling recommend-path read at `:1751` documents and uses `getDbReadOnly()`.
- `R6-P1-001` confirmed P1: `implementation-summary.md:3` says 581, `goal.md:47` says 231, and the ten commits add 227 answer rows. No sentence reconciles the three.
- `R9-P1-001` confirmed P1: `.skilled/changelog/skilled/v4.1.0.0.md:222` states the archived 149/193 ablation as the default-weight rationale, while `:231` and `implementation-summary.md:99`, `:113`, `:121` state 156 against 161 on the 196-row corpus.

**Review scope.** Seventeen review-target paths, narrowed to the eight code commits and the ten `docs(specs)` commits named in the operator focus. 119 scope files were bound at init. Ten iterations ran: eight node-dimension passes over frontier nodes F-1-003 (daemon and launcher liveness) and F-1-006 (follow-up fixes and answer routing), then two cross-reference passes after the frontier drained.

**Operator review focus.** Review only what these commits changed, read at HEAD with `git show`: `31ffd18beab`, `1ccbb3283c6` and `dc3979eb451` (background vector refresh, semantic lane coverage gate, launcher liveness, `OLLAMA_*` passthrough, generation counter, status and doctor coverage); `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d` and `0390556ee2b` (test and routing follow-ups); and the ten `docs(specs)` commits `2f5fe41bb9e` to `aaaff7dd9df` that wrote 231 ended-session answers into `decision-record.md` files. Report defects in shipped behavior, not style.

## 2. Planning Trigger

`/speckit:plan` **is required**: three active P1 findings remain, and each needs a code or doc change before the phase can close.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "R1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:392" },
    { "id": "R6-P1-001", "severity": "P1", "dimension": "traceability", "file": "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:3" },
    { "id": "R9-P1-001", "severity": "P1", "dimension": "traceability", "file": ".skilled/changelog/skilled/v4.1.0.0.md:222" },
    { "id": "R1-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1406" },
    { "id": "R2-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".opencode/plugins/tests/system-skill-advisor.test.cjs:1078" },
    { "id": "R7-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1325" },
    { "id": "R7-P2-002", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:124" },
    { "id": "R8-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-handover/pi/session-handover.test.ts:48" }
  ],
  "remediationWorkstreams": [
    "W1: pass the read-only handle into embeddingCoverage on the recommend path (R1-P1-001)",
    "W2: reconcile the three answer counts in the packet docs (R6-P1-001)",
    "W3: correct or annotate the changelog's ablation figure (R9-P1-001)",
    "W4: P2 advisories, separable from the P1 work (R1-P2-001, R2-P2-001, R7-P2-001, R7-P2-002, R8-P2-001)"
  ],
  "specSeed": [
    "Amend the coverage-gate requirement to name the read-only handle the recommend path must pass.",
    "State one answer count for the phase and derive the other figures from it."
  ],
  "planSeed": [
    "Change semantic-shadow.ts:392 to pass getDbReadOnly() into embeddingCoverage and add a test that fails when the read-write handle is used.",
    "Rewrite implementation-summary.md:3 to the count the commits actually add, or state the repo-wide total explicitly.",
    "Rewrite .skilled/changelog/skilled/v4.1.0.0.md:222 to the 156/161 measurement or name the archived packet and mark the figure superseded."
  ],
  "findingClasses": ["correctness", "traceability", "maintainability"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts",
    ".skilled/changelog/skilled/v4.1.0.0.md",
    "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md",
    ".opencode/plugins/tests/system-skill-advisor.test.cjs",
    ".skilled/hooks/session-handover/pi/session-handover.test.ts"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P0 Findings

None.

### P1 Findings

| ID | Severity | Dimension | Title | File:line | Disposition |
|----|----------|-----------|-------|-----------|-------------|
| R1-P1-001 | P1 | correctness | The semantic coverage gate opens the read-write database on the recommend path | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:392` | active |
| R6-P1-001 | P1 | traceability | The packet summary claims 581 recorded answers while the decision and the commits say 231 and 227 | `implementation-summary.md:3` | active |
| R9-P1-001 | P1 | traceability | The changelog states the archived 149/193 ablation as the reason for the shipped default weight | `.skilled/changelog/skilled/v4.1.0.0.md:222` | active |

**R1-P1-001** -- `scoreSemanticShadowLane` calls `embeddingCoverage()` with no argument at `semantic-shadow.ts:392`. `embeddingCoverage` defaults its parameter to `getDb()` at `skill-graph-db.ts:1326`, which opens the database read-write. The sibling recommend-path read `loadSkillEmbeddings` documents the opposite contract at `skill-graph-db.ts:1751` and uses `getDbReadOnly()`. Impact: a scoring call can take a write lock and can lazily create or migrate the database on the prompt path. Fix: pass `getDbReadOnly()` into `embeddingCoverage` and return `[]` when it is null, matching `loadSkillEmbeddings`. Finding class: correctness. Scope proof: inside frontier node F-1-003's scope and the review target. Affected surface hints: the semantic lane, the coverage gate, the single-writer guard.

**R6-P1-001** -- `implementation-summary.md:3` says "581 unrecorded operator answers are recorded or settled", `goal.md:47` D3 says 231, and `git diff 2f5fe41bb9e~1..aaaff7dd9df` adds 227 `### Q` headings and 227 table rows. The repo-wide count of verbatim answers is 118, so 581 matches no count in the tree. Impact: an operator citing the packet description gets a figure that matches nothing. Fix: state the count the commits add, or name what 581 counts. Finding class: traceability. Scope proof: the packet's own docs, cited as context evidence for the review target's `specs/**/decision-record.md` surface. Affected surface hints: the packet description, the goal decision table, the ten commits.

**R9-P1-001** -- `.skilled/changelog/skilled/v4.1.0.0.md:222` says "The ablation scored 149 of 193 with the lane and 150 without", while `:231` of the same file says the real-embedding ablation "scored 156 correct against 161 without it" on the 196-row corpus, and `implementation-summary.md:99`, `:113` and `:121` state 156 against 161 three times. The 149/193 pair is the archived measurement at `specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79`. Commit `5c91b2f3f5d` rewrote the sentence at `:231` and left `:222` untouched. Impact: the section that explains the shipped default quotes a superseded one-row margin. Fix: rewrite `:222` to the 156/161 measurement, or name the archived packet and mark the figure superseded. Finding class: traceability. Scope proof: `.skilled/changelog/skilled/v4.1.0.0.md` is in the review target. Affected surface hints: the shipped changelog, the packet's ablation record, the archived packet.

### P2 Findings

| ID | Severity | Dimension | Title | File:line | Disposition |
|----|----------|-----------|-------|-----------|-------------|
| R1-P2-001 | P2 | maintainability | The coverage gate re-scans every vector blob and the command-bridges file on each scoring call | `skill-graph-db.ts:1406` | active |
| R2-P2-001 | P2 | maintainability | The widened hook assertion accepts variable names the hook does not use | `.opencode/plugins/tests/system-skill-advisor.test.cjs:1078` | active |
| R7-P2-001 | P2 | maintainability | The coverage reader re-implements the vector-table read the embedding loader already owns | `skill-graph-db.ts:1325` | active |
| R7-P2-002 | P2 | maintainability | `incompleteIds` is exported but has no production consumer and mixes two id spaces | `skill-graph-db.ts:124` | active |
| R8-P2-001 | P2 | maintainability | The hand-over test hand-copies the writer path from a constant the module keeps private | `.skilled/hooks/session-handover/pi/session-handover.test.ts:48` | active |

## 4. Remediation Workstreams

**P1 work, in order.**

1. **W1 -- read-only handle on the recommend path (R1-P1-001).** Change `semantic-shadow.ts:392` to pass `getDbReadOnly()` into `embeddingCoverage`, and make `embeddingCoverage` return an incomplete coverage object when the handle is null. Add a test that fails when the read-write handle reaches the scoring path.
2. **W2 -- one answer count (R6-P1-001).** Rewrite `implementation-summary.md:3` to the count the ten commits add, or state explicitly what 581 counts and where it comes from. Reconcile `goal.md:47` D3's 231 with the 227 rows the diff adds.
3. **W3 -- the changelog's ablation figure (R9-P1-001).** Rewrite `.skilled/changelog/skilled/v4.1.0.0.md:222` to the 156/161 measurement, or name the archived packet and mark the figure superseded.

**P2 advisories, separable.**

4. **W4a -- coverage read cost (R1-P2-001).** Cache the coverage result per database generation, or read only the counts the gate needs.
5. **W4b -- hook assertion breadth (R2-P2-001).** Narrow the regex at `.opencode/plugins/tests/system-skill-advisor.test.cjs:1078` to `additionalContext`, the only name the hook passes.
6. **W4c -- duplicated vector reader (R7-P2-001).** Extract one vector-table reader both `embeddingCoverage` and `loadSkillEmbeddings` call.
7. **W4d -- `incompleteIds` (R7-P2-002).** Export it as two arrays, or drop it from the public shape.
8. **W4e -- hand-over writer path (R8-P2-001).** Export `CONTINUITY_WRITER_COMMAND` from `nudge.cjs` and import it in the test.

## 5. Spec Seed

- The coverage-gate requirement should name the read-only handle the recommend path must pass, so the contract at `skill-graph-db.ts:1751` has a requirement behind it.
- The phase's answer-count requirement should state one number and derive the others from it, so a later edit cannot leave three figures in the tree.
- The changelog requirement should say that a superseded measurement is either replaced or explicitly labelled with the packet it came from.

## 6. Plan Seed

- `semantic-shadow.ts:392`: pass `getDbReadOnly()`; add a regression test that asserts the read-write handle is never opened on the scoring path.
- `implementation-summary.md:3` and `goal.md:47`: pick one count, state it, and make the other figure a derived or explicitly scoped number.
- `.skilled/changelog/skilled/v4.1.0.0.md:222`: replace 149/193 with 156/161, or annotate it as the archived 008 measurement.
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:1078`: narrow the accepted variable names to `additionalContext`.
- `skill-graph-db.ts`: extract one vector-table reader; split or drop `incompleteIds`.
- `nudge.cjs`: export `CONTINUITY_WRITER_COMMAND`; import it in `session-handover.test.ts:48`.

## 7. Traceability Status

**Core Protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | `ENV-REFERENCE.md:394-396` against `skill-graph-db.ts:1445` and `ollama.ts:99`; `acceptance-criteria.md:56-68` against the shipped code | none |
| `checklist_evidence` | pass | `acceptance-criteria.md:56-68` read row by row: thirteen rows, every one `Met`, each naming an artifact present at HEAD | none |

**Overlay Protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `skill_agent` | not run | outside this lineage's declared scope | not applicable |
| `agent_cross_runtime` | not run | outside this lineage's declared scope | not applicable |
| `feature_catalog_code` | not run | outside this lineage's declared scope | not applicable |
| `playbook_capability` | not run | outside this lineage's declared scope | not applicable |

**AC_COVERAGE: pass** -- `acceptance-criteria.md` holds thirteen rows, all `Met`, none `Unmet`, `Waived` or `Superseded`.

## 8. Deferred Items

- The four overlay traceability protocols were not run. They sit outside the declared review target and the operator focus, so they are deferred rather than passed.
- The `OLLAMA_*` forwarding was verified by reading the launcher's passthrough list and the adapter default, not by starting a server and observing a child process. A live check would close that gap.
- The ablation numbers were read from the packet and the changelog, not re-measured. Re-running the harness is out of scope for a review.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Selected review directions: F-1-003 (daemon and launcher liveness), F-1-006 (follow-up fixes and answer routing), then the cross-reference fallback
- Remaining frontier: none -- F-1-003 and F-1-006 are both answered on all four dimensions

## 9. Search Ledger

**searchCoverage**

| Bug class | Covered | Ruled out |
|-----------|---------|-----------|
| `doc_code_drift` | yes | yes |
| `count_mismatch` | yes | no |
| `dedup_collision` | yes | yes |
| `duplication_drift` | yes | no |
| `dead_surface` | yes | no |
| `naming_collision` | yes | yes |
| `hand_copied_constant` | yes | no |
| `unguarded_duplication` | yes | yes |
| `template_default` | yes | yes |
| `stale_measurement` | yes | no |
| `undocumented_variable` | yes | yes |
| `documented_default_drift` | yes | yes |
| `passthrough_gap` | yes | yes |

**candidateCoverage**: every required bug class covered; no payable debt.

**searchDebt**: none. Both frontier nodes are answered.

**ruledOutCandidates**: 15 directions were ruled out across the ten iterations, including the heartbeat reaper killing a healthy server, the child getting a different database directory, the generation counter landing beside the wrong database, `.env` exfiltration, malformed `OLLAMA_REQUEST_TIMEOUT_MS`, the status path mutating the database, the bare security-policy removal breaking a route, duplicate answer rows, personal data in answers, the zero fingerprint suppressing a save, the one-commit-per-track rule, the CI vocabulary guard pointing at a missing path, `completion_pct: 0` as a new defect, the decision-record title drifting, and the 149/193 figure being fabricated.

**cleanSearchProof**: the two cross-reference passes (iterations 9 and 10) each recorded a clean or finding-bearing result with file:line evidence, and the env-var surface pass produced no finding rather than a manufactured one.

## 10. Audit Appendix

**Convergence summary.** Ten iterations, stop reason `converged` (`composite_converged`), no blockers. The convergence score reached the stop threshold after the coverage graph was seeded with the four dimension nodes and their `COVERS` edges, which cleared the graph's `uncovered_dimensions` blocker.

**Coverage summary.** Four of four dimensions covered. Frontier nodes F-1-003 and F-1-006 each hold correctness, security, traceability and maintainability evidence.

**Ruled-out claims.** Fifteen, listed in the Search Ledger above.

**Sources reviewed.** `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`, `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/bin/launcher-heartbeat-watchdog.vitest.ts`, `.skilled/bin/launcher-threshold-env.vitest.ts`, `.skilled/hooks/session-handover/pi/session-handover.test.ts`, `.skilled/hooks/session-handover/lib/nudge.cjs`, `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `.skilled/skills/sk-doc/hub-router.json`, `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`, `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs`, `.github/workflows/routing-registry-drift.yml`, `.skilled/changelog/skilled/v4.1.0.0.md`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example`, `INSTALL-SKILLED.md`, the packet's `implementation-summary.md`, `goal.md` and `acceptance-criteria.md`, and the archived `008-semantic-shadow-prove-or-freeze/implementation-summary.md`.

**Cross-reference appendix -- Core Protocols.** `spec_code` pass, `checklist_evidence` pass.

**Cross-reference appendix -- Overlay Protocols.** `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` were not run; they sit outside the declared review target.

Review verdict: CONDITIONAL
