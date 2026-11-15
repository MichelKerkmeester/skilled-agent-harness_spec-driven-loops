# Deep Review Report

- Spec folder: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation`
- Session: `fanout-vibe-1-1794765851303-zrv85l`, generation 1, lineageMode `new`
- Executor: `cli-mistral-vibe` model `deepseek-flash`
- Iterations: 5 of 5 (stopPolicy `max-iterations`)
- Stop reason: `maxIterationsReached`

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- `hasAdvisories`: false (advisories are reported only when the verdict is PASS)
- Active findings: **P0 = 0, P1 = 3, P2 = 10** (13 total, 0 resolved)
- Dimension coverage: 4 / 4 (correctness, traceability, security, maintainability), plus a cross-reference pass
- Review scope: the Vibe runtime work in phases 013-022 and the 2026-11-15 fix set -- the three turn composers, the compaction re-injection tier, the hand-over tier and its `relaunch-core.cjs` core, the goal injection path, the doctor overlay and mirror rows, and the manual-testing runner.
- Operator review focus: Find concrete improvements in the Mistral Vibe runtime work: phases 013-022 and the 2026-11-15 fixes (skilled-loop manual claim flags, Vibe goal fallback and vibeGoalPacket in relaunch-core.cjs, runner --remove-home, overlay and doctor Vibe rows, hardened VIB-HK checks). Open lead: VIB-HK-005, 006 and 007 failed live after the automatic handover tier (e5b8611a4fa) changed turn-start.mjs, turn-end.mjs and compaction-post-tool.mjs; three compaction records were journaled but no Context restored text was injected, while buildCompactionPart on the same journal with a fresh state dir returns it. Find the root cause.

### The open lead is answered

The root cause of the missing `Context restored` text is **R1-P1-001**: `buildCompactionPart` in `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` writes the watermark at `:231` **before** it builds any section, then returns `''` at `:252` when `sections.length === 0`. The `seen` filter at `:220`/`:223` then suppresses every later attempt, so the compaction is consumed permanently with nothing injected. Reproduced directly: the same journal against a fresh state dir yields 1199 characters including `Context restored after a compaction.`; against the consumed state dir it yields 0 characters. `e5b8611a4fa` did not touch `compaction-context.mjs`; it only appended the hand-over part to the three composers.

The VIB-HK-005 half of the lead is **not** explained by that commit: its `turn-start.mjs` diff is three additive hunks and leaves `buildSaveNudgePart` and `composeTurnStart` byte-identical (R5-P2-002). That root cause remains open, narrowed to `capture-core.mjs`, the `decision-capture-ask` `post_tool` hook, and the runner's scratch-project `cwd`.

## 2. Planning Trigger

`/speckit:plan` is **required**: three active P1 findings remain.

```json Planning Packet
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 3,
    "P2": 10,
    "total": 13,
    "ids": [
      "R1-P1-001", "R1-P1-002", "R2-P1-001",
      "R1-P2-001", "R2-P2-001", "R2-P2-002", "R3-P2-001", "R3-P2-002",
      "R4-P2-001", "R4-P2-002", "R4-P2-003", "R5-P2-001", "R5-P2-002"
    ]
  },
  "remediationWorkstreams": [
    {
      "order": 1,
      "name": "Stop the compaction watermark from consuming an injection that never happened",
      "severity": "P1",
      "findings": ["R1-P1-001", "R1-P1-002"],
      "surfaces": [
        ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:231",
        ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:252",
        ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:319"
      ]
    },
    {
      "order": 2,
      "name": "Re-run the three live scenarios after the fix and record the verdicts",
      "severity": "P1",
      "findings": ["R2-P1-001"],
      "surfaces": [
        "022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md:110",
        "022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-005",
        "022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-006",
        "022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-007"
      ]
    },
    {
      "order": 3,
      "name": "Pin the watermark contract with a test and correct the stale headers and docs",
      "severity": "P2",
      "findings": ["R4-P2-002", "R4-P2-001", "R2-P2-001", "R5-P2-001"],
      "surfaces": [
        ".skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs:141",
        ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs:8",
        ".skilled/hooks/goal/README.md:80",
        ".skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1096"
      ]
    },
    {
      "order": 4,
      "name": "Close the remaining payload-validation and framing advisories",
      "severity": "P2",
      "findings": ["R3-P2-001", "R3-P2-002", "R4-P2-003", "R1-P2-001", "R2-P2-002", "R5-P2-002"],
      "surfaces": [
        ".skilled/hooks/session-handover/vibe/handover-parts.mjs:347",
        ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:69",
        ".skilled/hooks/session-handover/vibe/handover-parts.mjs:209",
        ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:115",
        "spec.md:17",
        "spec.md:139"
      ]
    }
  ],
  "specSeed": [
    "Record the compaction watermark contract explicitly: the watermark may advance only when text is returned, and an empty-section result must leave it untouched.",
    "Restate the 022 live-verdict claim against runs that postdate e5b8611a4fa, or mark the three scenarios unverified.",
    "Correct the open-lead text so it no longer attributes the VIB-HK-005 save-nudge failure to turn-start.mjs."
  ],
  "planSeed": [
    "Move the watermark write in buildCompactionPart after the empty-section return, and add a test that a compaction with zero resolvable sections writes no watermark.",
    "Apply the same ordering rule to the post-tool size gate so a detector miss does not record the journal size.",
    "Re-run VIB-HK-005, VIB-HK-006 and VIB-HK-007 against the fixed tree and replace the recorded verdicts.",
    "Update the turn-start.mjs header to name all five parts, the goal README to describe the compaction re-injection, and the feature catalog to list Vibe among the automatic hand-over runtimes."
  ],
  "findingClasses": {
    "correctness": ["R1-P1-001", "R1-P1-002", "R1-P2-001", "R3-P2-001", "R3-P2-002", "R4-P2-003"],
    "traceability": ["R2-P1-001", "R2-P2-001", "R2-P2-002", "R4-P2-002", "R5-P2-001", "R5-P2-002"],
    "maintainability": ["R4-P2-001"],
    "security": []
  },
  "affectedSurfacesSeed": [
    ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs",
    ".skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs",
    ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
    ".skilled/hooks/session-handover/vibe/handover-parts.mjs",
    ".skilled/hooks/goal/README.md",
    ".skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md",
    "022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md",
    "spec.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1

| ID | Title | Dimension | File:line | Finding class | Disposition |
|----|-------|-----------|-----------|---------------|-------------|
| R1-P1-001 | The compaction watermark advances before any text exists, so an empty-section call consumes the compaction permanently | correctness | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:231` | correctness | active -- fix required |
| R1-P1-002 | The post-tool size gate records the journal size even when the detector produced no text, so a mid-turn compaction is consumed before the detector can retry | correctness | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:319` | correctness | active -- fix required |
| R2-P1-001 | Phase 022's live-verdict claim does not cover the code the branch ships: all three VIB-HK-005/006/007 runs finished before `e5b8611a4fa` | traceability | `022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md:110` | traceability | active -- re-run required |

Evidence for R1-P1-001: `compaction-context.mjs:231` writes the watermark, `:252` returns `''` when `sections.length === 0`, and `:220`/`:223` filter on the watermark. Scope proof: the three cited lines are the whole consume path. Affected surface hints: `compaction-context.mjs:199-257`, `compaction-context.test.mjs:92-150`.

Evidence for R1-P1-002: `compaction-context.mjs:319` records the size before the detector result is known. Scope proof: the write and the empty-result branch are adjacent. Affected surface hints: `compaction-context.mjs:296-324`.

Evidence for R2-P1-001: the three recorded runs are stamped 00:47Z, 06:36Z and 12:11Z; the commit is 12:24Z. Scope proof: the timestamps come from each run's `result.json`. Affected surface hints: `022/implementation-summary.md:110`, `022/tasks.md:90-92`.

### P2

| ID | Title | Dimension | File:line | Finding class |
|----|-------|-----------|-----------|---------------|
| R1-P2-001 | The `seen` list is capped at 64 ids, so a long session can re-inject a compaction it already delivered | correctness | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:115` | correctness |
| R2-P2-001 | The goal README still says Vibe has no compaction re-injection and reads only `VIBE_SPEC_FOLDER` | traceability | `.skilled/hooks/goal/README.md:80` | traceability |
| R2-P2-002 | The parent spec records all 22 phases Complete and a push-ready next action | traceability | `spec.md:17` | traceability |
| R3-P2-001 | The hand-over part uses `payload.cwd` and `payload.transcript_path` without a containment check, and `arm` persists the unvalidated cwd | correctness | `.skilled/hooks/session-handover/vibe/handover-parts.mjs:347` | correctness |
| R3-P2-002 | The compaction watermark directory is created under `payload.cwd` with no check that it is inside the checkout | correctness | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:69` | correctness |
| R4-P2-001 | The `turn-start.mjs` header names four parts while `PARTS` holds five | maintainability | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:8` | maintainability |
| R4-P2-002 | The compaction test suite pins the watermark contract for the no-compaction case but not the empty-section case | traceability | `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs:141` | traceability |
| R4-P2-003 | `withdrawOnOperatorPrompt` fires on any non-seed `pre_agent` without checking that a prompt exists | correctness | `.skilled/hooks/session-handover/vibe/handover-parts.mjs:209` | correctness |
| R5-P2-001 | The feature catalog omits Vibe from both hand-over runtime enumerations and has no compaction re-injection entry | traceability | `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1096` | traceability |
| R5-P2-002 | The packet's open-lead text attributes the VIB-HK-005 failure to a commit whose `turn-start.mjs` diff is purely additive | traceability | `spec.md:139` | traceability |

## 4. Remediation Workstreams

1. **P1 -- compaction consume-without-inject (R1-P1-001, R1-P1-002).** Move the watermark write after the empty-section return in `buildCompactionPart`, and apply the same rule to the post-tool size gate. Both defects share one shape: bookkeeping advances before the payload exists.
2. **P1 -- stale live evidence (R2-P1-001).** Re-run VIB-HK-005, VIB-HK-006 and VIB-HK-007 against the fixed tree and replace the recorded verdicts, or mark the three scenarios unverified.
3. **P2 advisories -- documentation and test pinning (R4-P2-002, R4-P2-001, R2-P2-001, R5-P2-001).** Add the missing empty-section test, then correct the three stale documents.
4. **P2 advisories -- payload validation and framing (R3-P2-001, R3-P2-002, R4-P2-003, R1-P2-001, R2-P2-002, R5-P2-002).** Containment checks for the hand-over and watermark paths, a prompt guard on the withdraw, a bounded `seen` list, and the two packet-text corrections.

## 5. Spec Seed

- State the compaction watermark contract: the watermark advances only when text is returned.
- Restate the 022 live-verdict claim against post-`e5b8611a4fa` runs, or mark the three scenarios unverified.
- Correct the open-lead text so it no longer attributes the VIB-HK-005 failure to `turn-start.mjs`.
- Record that Vibe is an automatic hand-over runtime in the feature catalog.

## 6. Plan Seed

- Move the watermark write in `buildCompactionPart` after the empty-section return; add a zero-section test.
- Apply the same ordering rule to the post-tool size gate.
- Re-run the three live scenarios and replace the recorded verdicts.
- Update the `turn-start.mjs` header, the goal README and the feature catalog.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | The 018/022 claims hold for the reader and the F1/F2/F5/F11 fixes, but the 022 live-verdict claim does not cover the shipped composers. | R2-P1-001 |
| `checklist_evidence` | fail | `022/tasks.md:90-92` mark T041-T043 `[x]` on evidence that predates `e5b8611a4fa`. | R2-P1-001 |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `skill_agent` | pass | The session-lifecycle and session-handover READMEs match the code. | R4-P2-001 (header only) |
| `agent_cross_runtime` | notApplicable | No agent profile changed in the 2026-11-15 fixes. | none |
| `feature_catalog_code` | fail | `feature-catalog.md:1096` omits Vibe from both hand-over enumerations; zero hits for `re-inject`, `Context restored` and `watermark` across 1232 lines. | R5-P2-001 |
| `playbook_capability` | partial | The scenarios exist and the runner drives them, but their recorded verdicts are pre-change. | R2-P1-001 |

`AC_COVERAGE`: exempt -- no `acceptance-criteria.md` in the packet.

## 8. Deferred Items

- **VIB-HK-005 root cause.** Not resolved. The commit is exonerated for `turn-start.mjs`; the remaining candidates are `capture-core.mjs`, the `decision-capture-ask` `post_tool` hook, and the runner's scratch-project `cwd`. Confirming it needs a live Vibe run, which this lineage cannot perform.
- **`resource-map.md`.** Absent, so the Resource Map Coverage Gate is skipped.
- **Live re-verification of any finding.** No finding in this review was confirmed by a live run; all are static evidence.

## Dimension Expansion Map

- Selected review directions: correctness (iteration 1), traceability (iteration 2), security (iteration 3), maintainability (iteration 4), cross-reference (iteration 5).
- Completed pivots: none -- each iteration held its assigned dimension.
- Failed pivots: none.
- Audited overrides: none.
- Saturated directions: security (iteration 3) -- every destructive path already carries a named guard, so the pass produced advisories rather than a P1.
- Remaining frontier: none. The iteration cap was reached with all four dimensions and all six cross-reference protocols covered.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

### Convergence Summary

| Iteration | Dimension | New findings | P0 | P1 | P2 | newFindingsRatio |
|-----------|-----------|--------------|----|----|----|------------------|
| 1 | correctness | 3 | 0 | 2 | 1 | 1.0 |
| 2 | traceability | 3 | 0 | 1 | 2 | 1.0 |
| 3 | security | 2 | 0 | 0 | 2 | 1.0 |
| 4 | maintainability | 3 | 0 | 0 | 3 | 1.0 |
| 5 | cross-reference | 2 | 0 | 0 | 2 | 1.0 |

The ratio stayed at 1.0 because every iteration opened a surface no earlier iteration had read. Convergence was therefore not reached on the ratio signal; the loop stopped on `maxIterationsReached`, which is the configured policy.

### Coverage Summary

- Dimensions: 4 / 4 (1.0)
- Cross-reference protocols: 6 / 6 attempted; 2 pass, 1 notApplicable, 2 partial, 1 fail
- Files reviewed: 24 distinct paths across the five iterations

### Ruled-Out Claims

- Reader scope as the live cause -- `vibe.mjs:79-124` seeds from the committed snapshot generation.
- Watermark directory resolution and file-size overflow as the suppression cause.
- The hand-over part suppressing the compaction part -- the compaction part is ordered first.
- F11 and F5 being unimplemented -- both are present in code.
- Command injection through the printed manual claim command, path traversal through `SKILLED_LOOP_ID`, symlink escape through the goal packet, wrong-pid signalling, and secret exposure through the killer environment.
- The `--remove-home` fix being incomplete.
- Part ordering and a consume-without-inject defect in the save nudge as the VIB-HK-005 cause.
- A duplicate between R2-P2-001 and R5-P2-001, and any contradiction among the active findings.

### Sources Reviewed

`.skilled/hooks/session-lifecycle/vibe/{turn-start,turn-end,compaction-post-tool,compaction-context}.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/{relaunch-core,killer,nudge,withdraw}.cjs`, `.skilled/hooks/goal/vibe/goal-inject.mjs`, `.skilled/hooks/goal/lib/goal-slice.cjs`, `.skilled/hooks/goal/README.md`, `.skilled/hooks/decision-capture/lib/capture-core.mjs`, `.skilled/bin/skilled-loop`, `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-save-nudge.md`, `spec.md`, `022/implementation-summary.md`, `022/tasks.md`, `022/scratch/verdicts.md`, and the `e5b8611a4fa` diff.

### Cross-Reference Appendix

**Core Protocols:** `spec_code` (partial), `checklist_evidence` (fail).
**Overlay Protocols:** `skill_agent` (pass), `agent_cross_runtime` (notApplicable), `feature_catalog_code` (fail), `playbook_capability` (partial).

---

Review verdict: CONDITIONAL
