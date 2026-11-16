# Deep Review Report: Mistral Vibe runtime packet 004

<!-- MACHINE-OWNED: fan-out synthesis of lineages vibe-1 and vibe-2; registry at deep-review-findings-registry.json -->

## 1. Executive Summary

- **Verdict: CONDITIONAL**
- **hasAdvisories:** false (the verdict is CONDITIONAL, not PASS)
- **Active findings after the adversarial self-check:** P0 0, P1 1, P2 29. The merged registry held P0 0, P1 7, P2 24. Two P1s were the same finding reported by both lineages, and four P1s were downgraded to P2 after re-reading the code (section 3).
- **Scope:** packet `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation`, phases 013 to 022, and the 2026-11-15 fixes. Ten iterations: two `cli-mistral-vibe` lineages on `deepseek-flash` (thinking `max`), five iterations each, stop policy `max-iterations`, all four dimensions.
- **Operator review focus:** Find concrete improvements in the Mistral Vibe runtime work: phases 013-022 and the 2026-11-15 fixes (skilled-loop manual claim flags, Vibe goal fallback and vibeGoalPacket in relaunch-core.cjs, runner --remove-home, overlay and doctor Vibe rows, hardened VIB-HK checks). Open lead: VIB-HK-005, 006 and 007 failed live after the automatic handover tier (e5b8611a4fa) changed turn-start.mjs, turn-end.mjs and compaction-post-tool.mjs; three compaction records were journaled but no Context restored text was injected, while buildCompactionPart on the same journal with a fresh state dir returns it. Find the root cause.
- **Open lead outcome:** the lineages found defects in the compaction detector, but none of them caused the three failures. Synthesis verification traced each failure to the scenario or the runner (section 3, S-1 to S-4). A hand-driven Vibe session on the current code re-injected the goal after `/compact`.

## 2. Planning Trigger

`/speckit:plan` is required: one P1 is active.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 1, "P2": 29 },
  "remediationWorkstreams": [
    "WS1 evidence honesty: correct the phase 022 and parent live-verdict claims, then rerun VIB-HK-005, 006 and 007 on the current code",
    "WS2 scenario robustness: pin the runner's Vibe model, wait for compaction to finish, seed or allow the save-nudge follow-up question, require a tool call after a mid-turn compaction",
    "WS3 compaction detector hardening: watermark and size-gate ordering, seen-list completeness, empty journal directory",
    "WS4 doc drift: goal READMEs, session-lifecycle README, turn-start header, guards-and-hooks status, feature catalogs",
    "WS5 path containment advisories in the compaction and hand-over state paths"
  ],
  "specSeed": "Restore the Vibe hook playbook's live evidence on the shipped code and close the compaction-detector and doc drift the review found",
  "planSeed": "WS1 then WS2 first, since the reruns depend on the scenario fixes; WS3 to WS5 after",
  "findingClasses": ["traceability", "correctness", "maintainability", "security"],
  "affectedSurfacesSeed": [
    ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs",
    ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
    ".skilled/hooks/goal/vibe/README.md",
    ".skilled/hooks/goal/README.md",
    ".skilled/hooks/session-lifecycle/vibe/README.md",
    ".skilled/hooks/session-handover/vibe/handover-parts.mjs",
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/",
    ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs",
    "specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1

| ID | Title | Dimension | File:line | Evidence | Fix | Disposition |
|---|---|---|---|---|---|---|
| R2-P1-001 (merges `--a422b0f9d15d` and `--83b2e98ba3f7`) | The live-verdict claim does not cover the shipped code | traceability | `022-vibe-hook-playbook-and-live-scenarios/implementation-summary.md:110`, parent `spec.md:139` | VIB-HK-005, 006 and 007 last passed at 00:47, 06:36 and 12:11 UTC on 2026-11-15. The automatic tier (`e5b8611a4fa`) reached the branch at 13:41 UTC through `2d4fb4d0f92` and changed `turn-start.mjs`, `turn-end.mjs` and `compaction-post-tool.mjs`. A rerun on the current code at 18:42 to 18:52 local failed all three. The records still read "26 PASS live". | Mark the three rows as pre-change in `scratch/verdicts.md`, the implementation summary and the parent phase map, then rerun them after WS2 | Confirmed by synthesis rerun |

### Downgraded from P1 to P2 by the adversarial self-check

| ID | Title | File:line | Why P2 |
|---|---|---|---|
| R1-P1-001 (merges `--5b32b66c4f09` and `--348907bfd9c2`) | The watermark advances before any text exists | `compaction-context.mjs:231` | An empty restore needs both an empty goal slice and no handoff note, so a retry usually has nothing to inject either. Only a transient read failure loses text. Neither failing run wrote a watermark, so this did not cause them. |
| R1-P1-002--02fa7ff472c2 | The post-tool gate records the size when the detector produced no text | `compaction-context.mjs:319` | Only the size is recorded; the watermark is not, so the next grown journal or the next turn start still finds the compaction. Nothing is consumed. |
| R1-P1-002--adb007ab580f | The post-tool gate watches only `journal/*.jsonl` | `compaction-context.mjs:271` | A rotation changes the summed size, so the detector still runs. A miss needs an exact size collision. |
| R4-P1-001 | The goal adapter README says nothing re-injects the slice after compaction | `.skilled/hooks/goal/vibe/README.md:21` | Confirmed wrong: `compaction-context.mjs:25` imports `renderVibeGoalSlice` and re-injects it. A doc error, so P2. |

### P2 (reported by the lineages, not individually re-verified unless noted)

| ID | Title | File:line |
|---|---|---|
| R1-P2-001--ac2d8f414c3b | `writeWatermark` records only the latest compaction id, so a multi-compaction catch-up can re-inject older ones after a snapshot roll | `compaction-context.mjs:111` |
| R1-P2-001--4e51b4609c93 | The seen list is capped at 64 ids | `compaction-context.mjs:115` |
| R1-P2-002 | `measureJournal` returns null for an empty journal directory, so the binding skips right after a roll | `compaction-context.mjs:274` |
| R3-P2-001--4cabe1421439, R3-P2-002--a2160734b6d7 | The compaction state directory comes from `payload.cwd` with no containment check | `compaction-context.mjs:67`, `:69` |
| R3-P2-003 | The post-tool binding re-reads the session store on every grown-journal tool call inside a 10-second budget | `compaction-context.mjs:314` |
| R3-P2-001--09922ec53397 | The hand-over part trusts `payload.cwd` and `payload.transcript_path` and persists the cwd into the record | `handover-parts.mjs:347` |
| R3-P2-002--26cf29d2e12e | The hand-over state directory falls back to a predictable path under `os.tmpdir()` | `relaunch-core.cjs:291` |
| R4-P2-003--f6d51a8e69ea | `withdrawOnOperatorPrompt` fires on any non-seed `pre_agent` without checking for a prompt | `handover-parts.mjs:209` |
| R4-P2-005 | A comment and a template literal exceed the file's line width | `relaunch-core.cjs:747` |
| R4-P2-001--3e1b6633d712 | The `turn-start.mjs` header names four parts while `PARTS` holds five | `turn-start.mjs:8` |
| R4-P2-002--a0bfc4ef4adc | The tests pin the watermark for the no-compaction case but not the empty-section case | `compaction-context.test.mjs:141` |
| R4-P2-003--8f1aef762f06 | The session-lifecycle README counts six kill switches; the compaction and hand-over parts have none | `session-lifecycle/vibe/README.md:29` |
| R4-P2-004 | That README states the watermark-before-build order as the contract | `session-lifecycle/vibe/README.md:25` |
| R2-P2-001--d5b1ccf53ad4 | The goal README says Vibe has no compaction re-injection and reads only `VIBE_SPEC_FOLDER` | `.skilled/hooks/goal/README.md:80` |
| R4-P2-001--e3447f5b13ad, R4-P2-002--c3535226947a | The `guards-and-hooks.md` status paragraph undercounts `hooks.toml` and overclaims run coverage | `cli-mistral-vibe/references/guards-and-hooks.md:37` |
| R5-P2-001--1704af684955 | The dispatch-mode catalog page omits the hand-over part | `feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md:39` |
| R5-P2-001--dee4b5181343 | The spec-kit feature catalog omits Vibe from the hand-over runtime lists | `system-spec-kit/feature-catalog/feature-catalog.md:1096` |
| R5-P2-002--9e111e07ef17 | Both compaction scenarios require a goal slice, so the empty-slice path has no coverage | `hook-scenarios/turn-start-compaction-reinjection.md:31` |
| R5-P2-002--88730f1859ce | The open lead blamed `turn-start.mjs` for HK-005, but that diff is purely additive (agrees with S-3) | parent `spec.md:139` |
| R2-P2-002--64b3ed5e25dc | The parent records all 22 phases Complete while three 022 rows are pre-change | parent `spec.md:17` |
| R2-P2-002--cd69769ad494 | The playbook carries no per-scenario verdict; the only table lives in a phase scratch folder | `manual-testing-playbook.md:261` |
| R2-P2-001--75c34f8b3f37 | The recorded VIB-HK-006 evidence is from the four-turn version the playbook no longer has | `scratch/live/VIB-HK-006/vibe/checkpoints.tsv:1` |

### Synthesis verification (outside the lineages, confirmed by reruns and a hand-driven session)

| ID | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| S-1 | P2 | VIB-HK-006's compact check passes when compaction starts, so turn 3 is sent mid-compaction and Vibe refuses it | The failed run's screen: `Error: session/turn/enqueue failed: [conflict] Context compaction is already running`. The journal holds the compaction records and nothing after them. | Wait for the compaction to finish before sending turn 3 |
| S-2 | P2 | The runner's Vibe home sets no default model, so today's runs used GLM-5.3 Flash while the evidence records `deepseek-flash` | `.vibe/config.toml` has `allowed_models` but no active model; every banner today read `GLM-5.3 Flash` | Pin `deepseek-flash` in the runner's Vibe home, or record the model each run used |
| S-3 | P2 | VIB-HK-005 fails when the model asks an unscripted follow-up question about the empty scratch project | Screen: `Where does the uploader live?` after the scripted answer | Seed an uploader file in setup, or add an optional question |
| S-4 | P2 | VIB-HK-007 needs a tool call after the mid-turn compaction, and the model made none | The last post-tool size, 210,411 bytes, predates the compaction at sequence 65, and no tool call followed | Make the prompt require a further tool call, then rerun |

A hand-driven session on the current code (`/compact`, then a message) injected `Context restored after a compaction.` with the goal slice and wrote the watermark, so the turn-start re-injection path works when the compaction is allowed to finish.

## 4. Remediation Workstreams

1. **WS1, P1:** correct the evidence claims (R2-P1-001, R2-P2-002--64b3ed5e25dc), then rerun VIB-HK-005, 006 and 007 once WS2 lands.
2. **WS2, P2 and blocking WS1:** S-1 to S-4.
3. **WS3, P2:** R1-P1-001, R1-P1-002 (both), R1-P2-001 (both), R1-P2-002, R4-P2-002--a0bfc4ef4adc.
4. **WS4, P2:** R4-P1-001, R2-P2-001--d5b1ccf53ad4, R4-P2-001 (both), R4-P2-003--8f1aef762f06, R4-P2-004, R4-P2-005, R5-P2-001 (both), R2-P2-002--cd69769ad494.
5. **WS5, P2 advisories:** R3-P2-001 (both), R3-P2-002 (both), R3-P2-003, R4-P2-003--f6d51a8e69ea.

## 5. Spec Seed

- The Vibe hook playbook's live evidence names the model and the commit each run used, and no row predates a change to its hook.
- The compaction scenarios wait for the compaction to finish and cover the empty-slice path.
- The compaction detector records its watermark only once it has text to inject, or documents why not.

## 6. Plan Seed

- Pin the runner's Vibe model and add it to `result.json`.
- Fix the VIB-HK-005, 006 and 007 scenarios, rerun them live and update `scratch/verdicts.md`.
- Decide watermark-after-build against the README contract, then change the code, tests and README together.
- Correct the goal READMEs, the session-lifecycle README, the `turn-start.mjs` header and the two feature catalogs.

## 7. Traceability Status

- **Core protocols:** spec-to-code claims for the shipped hooks hold, except the live-verdict claim (R2-P1-001). Recursive strict validation passed 23/23 before the review.
- **Overlay protocols:** playbook evidence is current for 23 of the 26 phase-022 scenarios plus the hand-run hop. VIB-HK-004 and VIB-HK-008 were rerun on the current code and passed.
- **AC_COVERAGE:** exempt; phase 022 is Level 1 and has no `acceptance-criteria.md`.

## 8. Deferred Items

- The security advisories in WS5 need a threat model for who can supply a hook payload. Vibe builds the payload itself, so all of them are defense in depth.
- Whether the skill advisor's brief is followed in Vibe (the VIB-HK-003 run loaded `vibe:skill-creator` while the brief said `sk-doc`) is not covered by this review.

## Dimension Expansion Map

All four dimensions were covered by both lineages: correctness (R1), traceability (R2), security (R3), maintainability (R4), and a cross-dimension pass (R5). No pivots, overrides or Council artifacts.

## 9. Search Ledger

*No search-depth state captured at the merged root.* Each lineage keeps its own ledger under `lineages/<label>/deep-review-ledger`.

## 10. Audit Appendix

- **Convergence:** stop policy `max-iterations`; both lineages ran 5 of 5 and exited 0 (`orchestration-summary.json`).
- **Coverage:** 2 lineages, 10 iterations, 4 dimensions; 31 merged open findings, 0 resolved.
- **Ruled-out claims:** none of the lineage defects explains the three failed reruns (S-1 to S-4).
- **Sources reviewed:** the lineage iteration files under `lineages/*/iterations/`, `deep-review-findings-registry.json`, `fanout-attribution.md`, and the code and docs cited above.

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| Spec to code | Drift in one claim | R2-P1-001 |
| Strict validation | Passed before review | 23/23 `RESULT: PASSED` |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| Live playbook evidence | Stale for three scenarios | S-1 to S-4, the 18:42 to 18:52 rerun |
| Lineage resource maps | Emitted per lineage | `lineages/*/` |
