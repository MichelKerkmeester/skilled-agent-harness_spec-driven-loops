# Deep Review Report - Mistral Vibe runtime lifecycle (lineage `vibe-2`)

- Spec folder: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation`
- Review target type: spec-folder (Level 2 phase parent, 22 child phases)
- Session: `fanout-vibe-2-1794765851303-zrv85l`, generation 1, lineageMode `new`
- Executor: `cli-mistral-vibe`, model `deepseek-flash`
- Iterations: 5 of 5 (`max-iterations` stop policy)
- Stop reason: `maxIterationsReached`
- Verdict: **CONDITIONAL**
- hasAdvisories: true
- Active findings: P0 = 0, P1 = 4, P2 = 14
- Dimension coverage: 4/4 (correctness, security, traceability, maintainability) plus the cross-reference fallback
- Release-readiness state: `in-progress`

---

## 1. Executive Summary

The Mistral Vibe runtime work in phases 013-022 is substantially landed: every one of the four 2026-11-15 fixes named in `decision-record.md:47` is present at the line it claims, the seven dispatch hard rules each have a check, the mode registry, hub router and leaf manifest agree, and the hook surface fails open on every path this lineage read. The review found no P0.

It found four P1s, and they cluster on one mechanism. The compaction re-injection that phase 018 exists to deliver is defeated by the order of two statements in `compaction-context.mjs`: the watermark is committed at `:231` before the detector knows whether it has any text to inject, and the empty return at `:252` leaves that watermark in place. That single ordering explains the operator's own discriminator on the open lead — `buildCompactionPart` on the same journal with a fresh state dir returns the text, because a fresh dir has no watermark to filter the compaction out. A second P1 records that the `post_tool` size gate watches only `journal/*.jsonl`, so a snapshot-only compaction never reaches the detector at all. The remaining two P1s are a stale live-evidence claim in `spec.md:139` and a goal-adapter README that states the opposite of what the code does.

The fourteen P2s are hardening and drift: two state directories derived from caller-supplied paths, a per-call full store read inside a 10-second budget, a reference doc whose Status paragraph undercounts the hook file by seventeen entries, two parts with no kill switch, and a feature catalog that never mentions the hand-over tier.

**The open lead is answered.** VIB-HK-005/006/007 failed live because the detector marks a compaction as handled before it knows it has anything to say. Three compaction records were journaled, the first seam to run wrote the watermark, the goal slice and handoff note were both empty at that moment, and every later call filtered the compaction out by id. The fresh-state-dir control returns the text for exactly that reason.

---

## 2. Planning Trigger

| Field | Value |
|---|---|
| Trigger | `CONDITIONAL` — active P1 remains, no active P0 |
| Recommended command | `/speckit:plan` |
| Blocking workstreams | 2 (WS-1 correctness, WS-2 traceability) |
| Advisory workstreams | 3 (WS-3 security hardening, WS-4 documentation drift, WS-5 coverage) |
| Release readiness | `in-progress` — the loop reached its iteration cap rather than converging |
| Re-run guidance | Re-run `/deep:review` after WS-1 lands; the two correctness P1s are the only findings that change behaviour |

---

## 3. Active Finding Registry

### P0 — Blockers

None.

### P1 — Required

| ID | Class | Location | Title | First / Last |
|---|---|---|---|---|
| R1-P1-001 | correctness | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:231` | The detector commits the watermark before it knows it has any text, so a compaction whose goal slice and handoff note are both empty is marked injected and never retried | 1 / 5 |
| R1-P1-002 | correctness | `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:271` | The `post_tool` size gate watches only `journal/*.jsonl`, so a snapshot-only compaction never reaches the detector | 1 / 1 |
| R2-P1-001 | traceability | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/spec.md:139` | The packet live-evidence claim for VIB-HK-005/006/007 is stale after the automatic handover tier merged, and no artifact records the regression | 2 / 2 |
| R4-P1-001 | maintainability | `.skilled/hooks/goal/vibe/README.md:21` | The goal adapter README states that nothing re-injects the slice after compaction, while the compaction detector calls that adapter on every new compaction | 4 / 4 |

### P2 — Suggestions

| ID | Class | Location | Title |
|---|---|---|---|
| R1-P2-001 | correctness | `compaction-context.mjs:111` | `writeWatermark` records only the latest id in `seen`, so a skipped middle compaction is re-injected later |
| R1-P2-002 | correctness | `compaction-context.mjs:274` | `measureJournal` returns null for an empty journal directory, so the first `post_tool` call always runs the detector |
| R2-P2-001 | traceability | `022/scratch/live/VIB-HK-006/vibe/checkpoints.tsv:1` | The recorded VIB-HK-006 evidence has four turns including `history-offer`; the current scenario has three |
| R2-P2-002 | traceability | `manual-testing-playbook.md:261` | The playbook lists 27 scenarios but carries no verdicts; the only verdict table is in `scratch/verdicts.md` |
| R3-P2-001 | security | `compaction-context.mjs:67` | The compaction state directory is derived from `payload.cwd` with no containment check |
| R3-P2-002 | security | `relaunch-core.cjs:291` | The hand-over state directory falls back to a predictable path under `os.tmpdir()` with no ownership or symlink check |
| R3-P2-003 | security | `compaction-context.mjs:314` | The `post_tool` binding re-reads the whole session store on every grown-journal call inside a 10-second budget |
| R4-P2-001 | maintainability | `guards-and-hooks.md:37` | The Status paragraph describes `.vibe/hooks.toml` as the guard bundle plus one `session_start` entry; the file declares 18 |
| R4-P2-002 | maintainability | `guards-and-hooks.md:37` | The same paragraph claims every section-4 row names the run that proved it; five of seventeen do |
| R4-P2-003 | maintainability | `session-lifecycle/vibe/README.md:29` | The README counts six kill switches; the compaction detector and the hand-over part have none |
| R4-P2-004 | maintainability | `session-lifecycle/vibe/README.md:25` | The README states the watermark-before-build order and the journal-size-only gate as the contract |
| R4-P2-005 | maintainability | `relaunch-core.cjs:747` | The goal-fallback comment is wrapped past the file's own width; `turn-start.mjs:82` is a 148-character literal |
| R5-P2-001 | traceability | `feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md:39` | The catalog lists three composition points and omits the hand-over part; the catalog never mentions hand-over |
| R5-P2-002 | traceability | `hook-scenarios/turn-start-compaction-reinjection.md:31` | Both compaction scenarios require a non-empty goal slice, so the empty-slice path has no coverage |

---

## 4. Remediation Workstreams

### WS-1 — Correctness: make the compaction re-injection survive an empty payload (blocking)

- **Findings:** R1-P1-001, R1-P1-002, R1-P2-001, R1-P2-002
- **Root cause:** `compaction-context.mjs` treats "I have seen this compaction" and "I have injected this compaction" as the same fact, and commits the first before it can establish the second.
- **Change:** build the sections first, return early when they are empty, and only then write the watermark and advance the receipt. Key the watermark on the set of ids actually injected rather than the latest id alone. Widen the `post_tool` size measurement to include the committed snapshot generation, not only `journal/*.jsonl`.
- **Acceptance:** a compaction in a session with no `VIBE_SPEC_FOLDER` and no open handoff note leaves no watermark, and a later call with a packet bound injects the slice for that same compaction.
- **Touches:** `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs`

### WS-2 — Traceability: re-record the live evidence after the hand-over tier (blocking)

- **Findings:** R2-P1-001, R2-P2-001, R2-P2-002
- **Change:** re-run VIB-HK-005/006/007 against the current tree and record the result, or mark the `spec.md:139` claim as pre-handover. Move the verdict table into the playbook so the 27 scenarios and their verdicts live in one place. Re-record VIB-HK-006 at three turns.
- **Acceptance:** `spec.md:139` names a run whose `result.json` timestamp postdates `e5b8611a4fa`, and every one of the 27 playbook scenarios has a verdict row.
- **Touches:** `spec.md`, `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`, `manual-testing-playbook.md`

### WS-3 — Security hardening: bound the state directories (advisory)

- **Findings:** R3-P2-001, R3-P2-002, R3-P2-003
- **Change:** refuse a `payload.cwd` that is not the session's own folder, or fall back to the checkout; create the temp fallback with an exclusive flag and verify ownership; cache the journal measurement per call instead of re-reading the store twice.
- **Touches:** `compaction-context.mjs`, `relaunch-core.cjs`, `nudge.cjs`

### WS-4 — Documentation drift: bring the four docs back to the code (advisory)

- **Findings:** R4-P1-001, R4-P2-001, R4-P2-002, R4-P2-003, R4-P2-004, R4-P2-005, R5-P2-001
- **Change:** state the compaction re-injection in `goal/vibe/README.md` and in the `opencode-goal.js` row; correct the `hooks.toml` inventory and the run-coverage claim in `guards-and-hooks.md:37`; add the two missing part switches or say plainly that there are none; rewrite the two README sentences that codify R1-P1-001 and R1-P1-002; re-wrap the goal-fallback comment; add the hand-over tier to the feature catalog.
- **Note:** R4-P2-004 must land in the same change as WS-1, or the README will contradict the fixed code.
- **Touches:** `.skilled/hooks/goal/vibe/README.md`, `.skilled/hooks/session-lifecycle/vibe/README.md`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md`

### WS-5 — Coverage: add the empty-slice compaction scenario (advisory)

- **Findings:** R5-P2-002
- **Change:** add a VIB-HK scenario that compacts a session with no bound packet and no open note, then binds a packet and asserts the slice arrives for that same compaction. This is the regression test for WS-1.
- **Touches:** `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/`

---

## 5. Spec Seed

- Phase 018's spec should state the injection contract as "a compaction is marked handled only when text was actually injected", not "the detector writes the watermark on a new compaction". The current wording permits the defect.
- Phase 022's live-evidence claim needs a date bound: a PASS row is only evidence for the tree it ran on, and the packet should say which commit each row covers.
- The packet has no `checklist.md` in any of phases 013-022, so the core `checklist_evidence` protocol has no target. Either add checklists or record the exemption in the packet's own docs.

---

## 6. Plan Seed

1. Fix the ordering in `compaction-context.mjs` (WS-1) and add the empty-slice regression test (WS-5) in the same change.
2. Widen the `post_tool` size measurement to the snapshot generation (WS-1).
3. Re-run VIB-HK-005/006/007 and re-record the evidence (WS-2).
4. Land the documentation corrections, with R4-P2-004 in the WS-1 change (WS-4).
5. Take the three hardening items as a separate change (WS-3).

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | Phase 018's promise is implemented at `compaction-context.mjs:243` and defeated on the empty path at `:231` versus `:252`. Phase 022's live claim is stale for VIB-HK-005/006/007. |
| `checklist_evidence` | core | notApplicable | No phase in 013-022 carries a `checklist.md`; evidence lives in `tasks.md` checkboxes. |
| `skill_agent` | overlay | pass | The playbook lists 27 scenarios and `hook-scenarios/` holds 27 files. |
| `agent_cross_runtime` | overlay | pass | `.vibe/agents/` holds 11 profiles and `sync-agents-vibe.cjs` exists at the doctor path. |
| `feature_catalog_code` | overlay | partial | The seven hard rules and the registry rows match; the dispatch-mode page omits the hand-over tier. |
| `playbook_capability` | overlay | partial | 27 scenarios exist, 26 carry a verdict, and neither compaction scenario covers the empty-slice path. |

Dimension coverage: correctness, security, traceability and maintainability each received a full iteration; the cross-reference fallback ran as iteration 5.

---

## 8. Deferred Items

- **Live re-runs of VIB-HK-005/006/007.** They need a keyed Vibe session and a tmux pane, which this lineage cannot provide. The root cause is established from the code and the operator's own fresh-state-dir control; the confirmation run is deferred to WS-2.
- **The `Resource Map Coverage Gate`.** `resource-map.md` is absent from the packet, so the gate is skipped rather than passed.
- **Phases 002 and 003.** The Mistral provider rosters are outside the 013-022 focus and were not reviewed.
- **The `post_tool` strict-blanking behaviour.** No run has shown it, and this lineage did not construct one.
- **The refinement-count mismatch at closeout.** The state log carries 19 distinct finding ids while the registry carries 18, because the reducer collapsed R5-P1-001 into R1-P1-001 as a refinement. The registry is the canonical state and is correct; the closeout's count comparison does not model refinements. Recorded here rather than repaired, because the registry is reducer-owned.

---

## 9. Audit Appendix

### Iterations

| Iteration | Dimension | Findings raised | P0 | P1 | P2 | Verdict |
|---|---|---|---|---|---|---|
| 001 | correctness | 4 | 0 | 2 | 2 | CONDITIONAL |
| 002 | traceability | 3 | 0 | 1 | 2 | CONDITIONAL |
| 003 | security | 3 | 0 | 0 | 3 | CONDITIONAL |
| 004 | maintainability | 6 | 0 | 1 | 5 | CONDITIONAL |
| 005 | cross-reference | 3 | 0 | 1 | 2 | CONDITIONAL |

### Dimension Expansion Map

| Dimension | Iteration | Angles covered | Angles left |
|---|---|---|---|
| correctness | 001 | watermark ordering, both seams, size gate, watermark shape, empty-journal measurement | none |
| traceability | 002 | spec claims, live evidence timestamps, playbook verdicts, scenario turn counts | live re-run (deferred) |
| security | 003 | state-dir containment, temp fallback, per-call store read, session-id pattern, goal-path containment, file modes, fail-open behaviour | none |
| maintainability | 004 | goal README, session-lifecycle README, reference doc Status, kill switches, comment wrap, phase 013 style claims | none |
| cross-reference | 005 | feature catalog, registry/router/manifest alignment, hard-rule coverage, carried P1 re-read, scenario pass criteria | none |

### Search Ledger

| Query | Surface | Result |
|---|---|---|
| `process.env` over the three Vibe composers | `.skilled/hooks/session-lifecycle/vibe/`, `.skilled/hooks/session-handover/vibe/` | Two dependency defaults in `compaction-context.mjs`, none in `compaction-post-tool.mjs`, two in `handover-parts.mjs` |
| `^\[\[hooks\]\]` count | `.vibe/hooks.toml` | 18 entries |
| `VIBE_SESSION_FREE_FLAGS` / `VIBE_SESSION_FREE_SUBCOMMANDS` | `.skilled/hooks/dispatch/lib/` | One definition each in `dispatch-audit.mjs`, imported by `dispatch-rule-checks.mjs` |
| The seven hard-rule names | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | One check per rule at `:739,985,995,1014,1043,1059,1074` |
| `handover\|hand-over` | `.skilled/skills/cli-external-orchestration/feature-catalog/` | No hits |
| `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED` | `.skilled/hooks`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`, `.vibe` | Implemented through `isHookEnabled` and documented in `SKILL.md:197` |
| `length > 120` excluding box-drawing lines | the nine Vibe hook files | Two hits: `turn-start.mjs:82`, `relaunch-core.cjs:747` |
| `git log` over the three doc paths | `goal/vibe/README.md`, `session-lifecycle/vibe/README.md`, `guards-and-hooks.md` | The goal README predates both the compaction work and the hand-over tier; the other two were revised by `e5b8611a4fa` |

### Ruled-Out Directions

- The 2026-11-15 fixes were claimed but not landed — all four are present.
- The doctor's Vibe rows point at missing scripts — all three exist.
- The goal slice renderer is broken — `goal-inject.mjs:30-41` returns the packet's `chat_slice`.
- The hook is not registered — `.vibe/hooks.toml:19-24` registers `turn-start`.
- The playbook and the scenario folder disagree on the scenario count — both are 27.
- The reader cannot see the compaction — `session-readers/vibe.mjs:76-107` seeds from the snapshot generation plus the journal tail.
- The watermark write is denied by the sandbox — the state dir is under `payload.cwd`.
- A session id can traverse the state path — `nudge.cjs:54,745-747` bounds it.
- `VIBE_SPEC_FOLDER` can point the goal slice outside the checkout — `goal-slice.cjs:271-303,443-462` contains it.
- A strict `post_tool` failure can blank the tool result — the entry carries no `strict`.
- The hand-over part can deny a turn — `armHandoverTurnEnd` returns null on every path.
- The line-length convention is violated across the hook surface — the over-width lines are box-drawing rules.
- The plugin table misclassifies a plugin — the 21 rows match the 21 plugin files.
- The session-lifecycle README's part order is wrong — `turn-start.mjs:92-101` matches it.
- The goal adapter README's test command is stale — `goal-vibe.test.mjs` exists.
- The mode registry, hub router and leaf manifest disagree — all three name `cli-mistral-vibe`.
- The catalog's seven-hard-rule claim is stale — each rule has a check.
- The goal fallback is missing from the relaunch core — `vibeGoalPacket` is at `relaunch-core.cjs:1201-1243`.
- The hand-over enable switch is undocumented or unimplemented — `handover-parts.mjs:66-72` routes through the shared resolver.

### Planning Packet

```json
{
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "stopReason": "maxIterationsReached",
  "releaseReadinessState": "in-progress",
  "activeFindings": { "P0": 0, "P1": 4, "P2": 14 },
  "dimensionCoverage": 1.0,
  "dimensions": ["correctness", "security", "traceability", "maintainability", "cross-reference"],
  "workstreams": [
    {
      "id": "WS-1",
      "kind": "blocking",
      "theme": "correctness",
      "findingIds": ["R1-P1-001", "R1-P1-002", "R1-P2-001", "R1-P2-002"],
      "files": [".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs"],
      "acceptance": "A compaction in a session with no bound packet leaves no watermark, and a later call with a packet bound injects the slice for that same compaction."
    },
    {
      "id": "WS-2",
      "kind": "blocking",
      "theme": "traceability",
      "findingIds": ["R2-P1-001", "R2-P2-001", "R2-P2-002"],
      "files": ["spec.md", "022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md", "manual-testing-playbook.md"],
      "acceptance": "spec.md:139 names a run whose result.json postdates e5b8611a4fa, and all 27 playbook scenarios carry a verdict."
    },
    {
      "id": "WS-3",
      "kind": "advisory",
      "theme": "security",
      "findingIds": ["R3-P2-001", "R3-P2-002", "R3-P2-003"],
      "files": ["compaction-context.mjs", "relaunch-core.cjs", "nudge.cjs"],
      "acceptance": "Neither state directory follows a caller-supplied path outside the session folder, and the temp fallback is created exclusively."
    },
    {
      "id": "WS-4",
      "kind": "advisory",
      "theme": "maintainability",
      "findingIds": ["R4-P1-001", "R4-P2-001", "R4-P2-002", "R4-P2-003", "R4-P2-004", "R4-P2-005", "R5-P2-001"],
      "files": [".skilled/hooks/goal/vibe/README.md", ".skilled/hooks/session-lifecycle/vibe/README.md", ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md", ".skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md"],
      "acceptance": "No doc states a behaviour the code does not have, and the hooks.toml inventory matches the file."
    },
    {
      "id": "WS-5",
      "kind": "advisory",
      "theme": "coverage",
      "findingIds": ["R5-P2-002"],
      "files": [".skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/"],
      "acceptance": "A scenario compacts with no bound packet, binds one, and asserts the slice arrives for that same compaction."
    }
  ],
  "openLead": {
    "question": "Why did VIB-HK-005/006/007 fail live after the automatic handover tier, with three compaction records journaled and no Context restored text injected, while buildCompactionPart on the same journal with a fresh state dir returns it?",
    "answer": "compaction-context.mjs:231 writes the watermark before the sections are built at :241-250 and before the empty return at :252. The first seam to run marks the compaction handled even when it has nothing to inject, and the filter at :223 then drops that compaction by id forever. A fresh state dir has no watermark, so the filter passes and the text is built.",
    "evidence": ["compaction-context.mjs:219-225", "compaction-context.mjs:231", "compaction-context.mjs:241-250", "compaction-context.mjs:252"],
    "findingIds": ["R1-P1-001", "R1-P1-002"]
  }
}
```
