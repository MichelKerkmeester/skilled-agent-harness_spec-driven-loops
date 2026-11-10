---
title: "Review Report: routing parity CI"
description: "Five-iteration deep review of the parity CI change; 1 P1 and 9 P2 findings, every one confirmed by a command and fixed in the same branch."
---
# Review Report: Routing Parity CI

## 1. Executive Summary

- **Verdict:** CONDITIONAL at synthesis, from the registry's one active P1. Every finding below is fixed in the same branch, so the remediated state carries no open P0, P1 or P2.
- **hasAdvisories:** false
- **Active findings at synthesis:** P0 0, P1 1, P2 9
- **Scope:** commit f34b01bf0a, which wires the local-vs-native divergence ratchet and the widened holdout independence check into the golden-prompt-gate job, plus the files those tests read: the approved-divergence ledger, the ledger capture script, the native projection, the skill-graph indexer, the age haircut and the Python scorer.
- **Executor:** cli-pi, `deepseek-v4.1-flash` on the DevPass route at reasoning effort max, all five iterations.
- Every finding was confirmed by the orchestrator with a command (section 3) before it was fixed.

## 2. Planning Trigger

`/speckit:plan` is not required: every finding was fixed in commits 20912694f1 and the packet's closing commit, inside the same packet.

Planning Packet:

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [],
  "remediationWorkstreams": [
    "capture and replay regime alignment (R1-P2-001, R2-P2-001, R4-P2-002)",
    "holdout declaration integrity (R1-P2-002, R1-P2-003, R2-P2-002)",
    "ratchet self-checks (R4-P2-001, R4-P2-003)",
    "packet closure (R3-P1-001, R3-P2-001)"
  ],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": ["test-isolation", "instance-only", "skill-release-metadata", "closure-evidence"],
  "affectedSurfacesSeed": [
    "tests/parity/local-native-divergence-ratchet.vitest.ts",
    "tests/parity/holdout-independent.vitest.ts",
    "tests/parity/fixtures/local-native-approved-divergences.json",
    "scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs",
    ".skilled/skills/system-skill-advisor/SKILL.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Paths are relative to `.skilled/skills/system-skill-advisor/runtime/` unless they start with `.skilled/` or `specs/`.

| ID | Sev | Title | Confirmed by | Fix |
|----|-----|-------|--------------|-----|
| R1-P2-001 | P2 | Capture and replay score the ledger under different clock and graph regimes | `node scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs --summary` on a clean checkout: 9 rows added and rr-iter3-061 changed | The capture indexes a fresh graph and pins the clock before it imports the scorer; the same command now reports no row added, resolved or changed |
| R1-P2-002 | P2 | The declaration scan proves references are declared, never that declarations are true | `grep -c labeled-prompts tests/scorer/ambiguity-slice.vitest.ts` prints 0 while the surface declares labeled, and the gate passed | New test "backs every declaration with a file that reads it": every consumer reads a surface corpus, every surface corpus has a reader, every exemption still names a corpus |
| R1-P2-003 | P2 | allowedOverlap is keyed by source type, so one reason licenses every corpus of a surface | `grep -n "allowedOverlap\[sourceType\]" tests/parity/holdout-independent.vitest.ts` shows a source-type-only check | Each allowance names the corpora it arrives through (`via`); overlap is checked per source type and corpus, and a stale `via` entry fails |
| R2-P2-001 | P2 | The capture evaluates more than the data literal it slices | `grep -n "lastIndexOf(']')" scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | The slice is bounded by the array's own `\n];` closing line |
| R2-P2-002 | P2 | The runtime scan follows a symlinked directory outside its root | `ls -l lib/shared` shows `embeddings -> ../../../../system-spec-kit/shared/embeddings`, and the scan used `statSync(path).isDirectory()` | The scan reads directory entries and never follows a symbolic link |
| R3-P1-001 | P1 | The change touches the advisor skill but ships no version bump or changelog | `grep -n "^version:" .skilled/skills/system-skill-advisor/SKILL.md` printed 0.15.3.0 after the build commit | system-skill-advisor bumped to 0.15.4.0 with a changelog entry |
| R3-P2-001 | P2 | The packet's evidence artifact is still the template | `implementation-summary.md` held template placeholders after the build commit | The ledger, Tests table and verification are written in `implementation-summary.md` |
| R4-P2-001 | P2 | The fresh-graph regime is arranged but never asserted | `grep -n "FRESH_DB_DIR" tests/parity/local-native-divergence-ratchet.vitest.ts` showed declaration, assignment and cleanup only | Indexing fails on an empty graph, and a test asserts the scorers read the fresh directory |
| R4-P2-002 | P2 | The pinned instant came from the growing ledger, so one new approval re-pinned every entry | The pin was `max(approvedAt)` | The ledger records `scoringInstant`, written by the capture; the ratchet replays it and checks no approval is dated after it |
| R4-P2-003 | P2 | SPECKIT_PARITY_REQUIRE_PYTHON=0 could not deliver a python-less run | With the variable set and no python3 on PATH the ratchet failed 2 of 7 | The suite is skipped in that case: 9 skipped, exit 0 |

## 4. Remediation Workstreams

1. Packet closure: R3-P1-001, R3-P2-001.
2. Capture and replay regime alignment: R1-P2-001, R2-P2-001, R4-P2-002.
3. Holdout declaration integrity: R1-P2-002, R1-P2-003, R2-P2-002.
4. Ratchet self-checks: R4-P2-001, R4-P2-003.

All four are done.

## 5. Spec Seed

- None. The fixes stay inside the packet's frozen decisions: no scorer, floor or ledger entry changed. The ledger gained only the top-level `scoringInstant`.

## 6. Plan Seed

- None.

## 7. Traceability Status

- `spec_code`: pass. R1, R3, R5 and R8 trace to the three files the spec names. The fixes add the ledger capture script and the ledger's top-level field, recorded as a deviation in `implementation-summary.md`.
- `checklist_evidence`: fail at synthesis (R3-P2-001), pass after the closing commit fills the ledger and Tests table.
- `AC_COVERAGE`: exempt (Level 1).

## 8. Deferred Items

- None.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Directions: correctness, security, traceability, maintainability, then a final correctness pass. All four dimensions covered.
- Remaining frontier: none inside the declared scope.

## Search Ledger

*No search-depth state captured (legacy v1 record)*

## 9. Audit Appendix

- **Convergence:** stop policy max-iterations; all 5 iterations ran; stop reason maxIterationsReached. Iteration 5 found nothing new (ratio 0).
- **Coverage:** 4 of 4 dimensions; all 12 scope files reviewed.
- **Executor:** cli-pi `deepseek-v4.1-flash` (DevPass), reasoning effort max. No usage limit was hit, so the cline-pass fallback was not used.
- **Workflow deviations:** the single-executor loop was driven by a scratch script that runs the YAML's per-iteration steps (lock refresh, graph convergence telemetry, prompt render, cli-pi dispatch through `buildLineageCommand`, `verify-iteration.cjs`, claim adjudication, reducer, graph upsert). It did not append graph-convergence or iteration-start rows, as the earlier single-executor run in this repository did not, because the stop policy makes convergence telemetry only.
- **Adversarial self-check:** the one P1 was confirmed with a command; no finding was dropped or downgraded.
- **Sources:** `iterations/iteration-001.md` to `iteration-005.md`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `driver-log.txt`.

### Core Protocols

`spec_code` pass; `checklist_evidence` pass after closure.

### Overlay Protocols

All four overlay protocols not applicable: no agent, feature catalog or playbook entry describes these gates.
