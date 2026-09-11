# Skill Advisor Playbook Run: Auto-Update Daemon and Native CLI Tools

**Tester:** Pi (pi harness, `deepseek-v4.1-flash`, reasoning max)
**Date:** 2026-09-11
**Repository:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Branch:** `skilled/v4.0.0.0`
**Packet:** `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/008-verification-and-closeout`
**Assigned scenarios:** 15 (AU-001..AU-005, NC-001..NC-010)

---

## 1. VERDICT SUMMARY

| # | Scenario | ID | Verdict | One-line basis |
|---|----------|----|---------|----------------|
| 1 | Chokidar watcher narrow scope | AU-001 | **PARTIAL** | Unrelated touch delta 0, tracked touch delta exactly +1 — but `freshness` stayed `stale`, not `live`. |
| 2 | Workspace single-writer lease | AU-002 | **PASS** | Concurrent bring-ups under one owner; hard kill + 95 s wait → new daemon reclaimed the lease, `trustState.state: "live"`. |
| 3 | Daemon lifecycle and SIGTERM | AU-003 | **PASS** | SIGTERM exits cleanly; fresh boot restores `skillCount 19`; idle 0.02 exits, 0 disables (parser: `null`). Two log-content signals unverified (no log capture). |
| 4 | Generation-tagged snapshot publication | AU-004 | **FAIL** | Generation +1 and `lastScanAt` advanced, but `trustState` stayed `stale` instead of returning to `live`. |
| 5 | Rebuild from source on corrupt SQLite | AU-005 | **FAIL** | Status diagnoses the corrupt DB and says "run advisor_rebuild", but both `skill_graph_scan` and `advisor_rebuild` fail until the daemon is restarted. |
| 6 | Native `advisor_recommend` happy path | NC-001 | **PASS** | `status: ok`, thresholds exact, top recommendation `system-spec-kit` 0.9426, `freshness: live`, prompt-literal hits 0. |
| 7 | Native `advisor_status` transitions | NC-002 | **PARTIAL** | Live and stale confirmed; absent state surfaces as `trustState.state: "absent"` while top-level `freshness` reads `stale`, not the documented `absent`. |
| 8 | Native `advisor_validate` slice bundle | NC-003 | **FAIL** | Contract fields and `+1/+1/+1` telemetry deltas correct, but parity shows 6 regressions, `unknown_count 13 > targetMax 10`, below the documented Phase 027 baseline. |
| 9 | Ambiguous brief rendering | NC-004 | **PASS** | 35/35 unit tests; broad prompt → `ambiguous: true`, top two both `0.95`; no prompt leak. |
| 10 | Lifecycle redirect metadata | NC-005 | **PASS** | 20/20 lifecycle tests; conditional runtime fixture returned 0 recommendations, so redirect fields observed via tests only. |
| 11 | Advisor status and rebuild separation | NC-006 | **PASS** | Status is diagnostic-only (two calls, generation flat); rebuild `rebuilt:true` 1155→1156; second rebuild `skipped:true / status-live`; `--force true` `reason: "force"`. |
| 12 | Skill graph status | NC-007 | **PASS** | `totalSkills 13`, `totalEdges 51`, `dbStatus: "ready"`, `isHealthy: true`. Scenario file's own evidence block is empty and its numbers are stale (20/81). |
| 13 | Skill graph query | NC-008 | **PASS** | `queryType: "hub_skills"`, exactly 10 rows for `limit: 10`; 89 KB payload. Documented `depth: 0` payload is rejected by the shipped schema (`depth >= 1`); reran with a valid payload. |
| 14 | Skill graph validate | NC-009 | **PASS** | `isValid: true`, `errorCount 0`, `warningCount 19`, categories and severity state readable. |
| 15 | Shadow-delta sink opt-in | NC-010 | **FAIL** | Default-off and hmac digests confirmed, but any in-workspace sink path expressed through `/tmp` is silently rejected by the workspace-root boundary check. |

MCP mapping: the assigned scenarios are the native CLI and daemon categories, but several absorbed rows and prose steps still speak in MCP-tool terms (`advisor_recommend({...})`, "Call `skill_graph_status`", "MCP server reachable", "MCP status call"). Every one of those was run as its CLI equivalent, e.g. `advisor_recommend({...})` → `node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt ... --options '...' --format json`. This is stated again in the per-scenario notes where it applies.

---

## 2. RUN CONTEXT AND METHOD

**Environment at start.** A live daemon served the real repo (launcher 55926 / server 55986), and two sibling agents were running other scenario lanes concurrently (`cli-opencode-deepseek`, `cli-codex-luna`). Live `advisor_status` at 19:56:13Z:

```json
"freshness": "stale", "generation": 1147,
"trustState": {"state": "stale", "reason": "advisor_rebuild", "generation": 1147, "checkedAt": "2026-09-11T19:56:13.228Z"},
"skillCount": 19
```

Live generation moved from 1147 to 1154 within the first minutes of this run because the sibling lanes were touching the shared workspace. Live-workspace numbers below are therefore quoted per call, never as a run-wide constant.

**Isolation.** The mutating scenarios (AU-001..AU-005, NC-002, NC-006, NC-010) were run against a disposable workspace copy of `.opencode/` (skills + bin), not the live repo. The copy was given its own launcher, daemon, socket (`/tmp/system-skill-advisor/<hash>/daemon-ipc.sock`) and database, so no daemon lifecycle action was taken against the shared live daemon. Live-repo reads (`advisor_status`, `advisor_recommend`, `skill_graph_*`, `advisor_validate`, vitest) ran against the live daemon without touching repo files.

**No live-repo mutation observed.** Post-run `git status --porcelain` for `.opencode/skills/system-skill-advisor`, `.opencode/bin`, `specs/system-skill-advisor` shows only pre-existing untracked entries (`mcp_server/`, `playbook-runs/`). Spot-checked live mtimes were unchanged by this run: `sk-doc/SKILL.md` Sep 9 07:59 (same as the pre-run snapshot), `sk-git/SKILL.md` Sep 11 21:10, `system-spec-kit/graph-metadata.json` Sep 5 09:58.

**Caveat that applies to every AU verdict and NC-002.** The daemon behaviours were exercised on a freshly cloned workspace, not the live checkout. Two consequences are visible below: the clone's SQLite/generation artefacts started mid-life, and a clone-side history of watcher events may influence trust-state transitions. Where that matters, the scenario note says so.

**No daemon log capture.** The launcher writes to stderr but detaches its server; no scenario-visible log file was found, so signals phrased as "no stack trace in stderr" or "no prompt text in logs" could not be observed. They are marked unverified rather than passed.

---

## 3. AUTO-UPDATE DAEMON SCENARIOS

### AU-001 Chokidar Watcher Narrow Scope — PARTIAL

Ran against the disposable copy and its own daemon. `advisor_status` was called three times around two touches.

```text
baseline:                      generation 1158  freshness stale  lastScanAt 2026-09-11T20:02:30.210Z
touch .opencode/plugins/system-skill-advisor.js   → generation 1158  freshness stale  lastScanAt 2026-09-11T20:02:30.210Z
touch .opencode/skills/sk-doc/SKILL.md            → generation 1159  freshness stale  lastScanAt 2026-09-11T20:02:59.161Z
unrelated_delta: 0 (expect 0)
tracked_delta:   1 (expect 1)
```

The copy's generation file recorded the cause directly:

```json
{"generation": 1159, "reason": "advisor-server-watcher-reindex", "state": "live", "updatedAt": "2026-09-11T20:02:59.161Z"}
```

Verdict: the narrow-scope geometry is confirmed — an unrelated `.opencode/` file produced no reindex, a tracked `SKILL.md` produced exactly one. The expected signal "`freshness` returns to `live` after the debounce window" failed: `advisor_status` reported `stale` with reason `advisor-server-watcher-reindex`. The same pattern reproduced in AU-004, so it is not a one-off; see cross-cutting finding F2. Unverified: the daemon-log claim (reindex logged only after the tracked touch) — no log capture available.

### AU-002 Workspace Single-Writer Lease — PASS

Two concurrent `advisor_status` calls against the same workspace root:

```text
au002-c1.json => generation 1165 trustState stale lastScanAt 2026-09-11T20:05:51.386Z
au002-c2.json => generation 1165 trustState stale lastScanAt 2026-09-11T20:05:51.386Z
daemon count for ws: 1
```

Identical generation and identical `lastScanAt` under concurrency, with exactly one daemon: no duplicate writer and no double generation advance. Then the crash leg, exactly as the scenario specifies — daemon killed without graceful shutdown:

```text
=== AU-002 step4 hard-kill daemon pid=94733 (no graceful shutdown) ===
ws daemons after kill: 0
=== AU-002 step5 waiting 95s for heartbeat expiry ===
=== AU-002 step6 status after stale heartbeat ===
EXIT=0
"freshness": "live", "generation": 1168,
"trustState": {"state": "live", "reason": null, "generation": 1168, "checkedAt": "2026-09-11T20:08:06.629Z", "lastLiveAt": "2026-09-11T20:08:05.655Z"},
"skillCount": 19
new daemon pid=57915
```

The stale lease was reclaimed after heartbeat expiry and the workspace reported `live`. The scenario's precondition wording says "MCP status call"; not applicable in the CLI era — the call was `node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root <ws> --format json`.

### AU-003 Daemon Lifecycle and SIGTERM — PASS

Pre-shutdown capture, SIGTERM, fresh boot:

```text
pre:  generation 1161 skillCount 19 freshness stale trustState stale
ws daemon PID=84005
=== SIGTERM ===
daemon exited after SIGTERM
=== fresh boot via advisor_status ===
post: generation 1163 skillCount 19 freshness stale trustState stale advisor-server-startup-scan
new ws daemon PID=90774
```

No stack trace was observed on the console across shutdown or the restart sequence, but stderr was not captured from the detached daemon, so that specific signal is unverified. Skill count was identical after restart and generation was higher (1163 ≥ 1161), which is what the scenario requires.

Idle-timeout leg, with `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` in the isolated process environment:

```text
idle=0.02 run → EXIT=0, status ok
launcher+daemon exited after idle window (expected for 0.02)

idle=0 run (disabled expected) → EXIT=0
launcher+daemon STILL ALIVE after 8s idle (consistent with disabled)
```

To make "0 disables" decisive rather than merely consistent with the 30-minute default, the shipped parser was called directly:

```text
0.02 -> 1200 ms
0 -> null (null = disabled)
empty -> 1800000 ms (default)
abc -> 1800000 ms (fallback)
```

Fractional values are accepted and `0` disables the monitor, as documented. Discoverability also checks out: `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` appears in `.env.example:87`, `runtime/lib/ipc/README.md:37` and `feature-catalog/daemon-and-freshness/lifecycle.md:26`.

### AU-004 Generation-Tagged Snapshot Publication — FAIL

```text
baseline:     generation 1160 live lastScanAt 2026-09-11T20:03:56.772Z
after touch:  generation 1161 stale lastScanAt 2026-09-11T20:04:29.577Z
              trustState {"state": "stale", "reason": "advisor-server-watcher-reindex", "generation": 1161, ...}
generation_delta: 1 (expect 1)
lastScanAt_advanced: True
```

Generation advanced by exactly one and `lastScanAt` advanced — but `trustState.state` did not return to `live`, which the scenario lists as an expected signal. The recommend leg:

```json
"freshness": "live", "recommendations": [{"skillId": "sk-git", "confidence": 0.9204}],
"cache": {"hit": false, "sourceSignaturePresent": true}
```

`cache.generation` is not surfaced by the shipped handler, so the scenario's conditional cache check is not applicable; the recommendation itself did reflect the touched skill. The state contradiction is the failing signal — and note the recommend call reported `freshness: live` while a `status` call seconds earlier had reported `stale`, which is itself an inconsistency. See F2.

### AU-005 Rebuild From Source on Corrupt SQLite — FAIL

The copy's `skill-graph.sqlite` was replaced with 7 bytes (`printf 'corrupt' > ...`), with a 380,928-byte backup taken first. Status diagnosed it:

```json
"freshness": "stale",
"trustState": {"state": "live", "reason": null, "generation": 1168, ...},
"errors": ["advisor_status skill graph integrity check failed (file is not a database); run advisor_rebuild"]
```

Then the scenario's own recovery step failed:

```text
skill_graph_scan --trusted → EXIT=1
{"status":"error","data":{"progress":[{"step":"advisor_status_before","generation":1168,"ok":true},
 {"step":"skill_graph_scan","ok":false},{"step":"advisor_status_after","generation":1168,"ok":true}],
 "generationBefore":1168,"generationAfter":1168,
 "scan":{"status":"error","error":"Skill graph scan failed: database disk image is malformed"}}}

advisor_rebuild --trusted → EXIT=1
{"status":"error","error":"database disk image is malformed","exitCode":1}
```

The recovery path only worked after the daemon was restarted:

```text
status with fresh daemon → EXIT=0, generation 1170, stale
advisor_rebuild --trusted → {"rebuilt": true, "skipped": false, "reason": "stale",
 "freshnessAfter": "live", "generationBefore": 1170, "generationAfter": 1171,
 "skillCount": 19, "indexedNodes": 13, "indexedEdges": 52}
advisor_recommend → status ok, sk-git 0.9056
```

So rebuild-from-source exists and works, but the in-band repair loop the scenario (and the status error text) prescribe does not: with the daemon holding the corrupt file, the command the error tells the operator to run fails with the same malformed-database error. `skill_graph_scan --trusted --workspace-root <ws>` was also rejected outright with `Unknown parameter(s): workspaceRoot` (exit 64) — the scan handler accepts only `skillsRoot`, so the scenario's `--workspace-root` form is wrong for that command; I reran it without the flag from the workspace directory.

---

## 4. NATIVE CLI TOOL SCENARIOS

### NC-001 Native advisor_recommend Happy Path — PASS

The absorbed legacy row is an MCP call (`advisor_recommend({...})`); mapped to the CLI front door.

```json
"workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
"effectiveThresholds": {"confidenceThreshold": 0.8, "uncertaintyThreshold": 0.35, "confidenceOnly": false},
"recommendations": [{"skillId": "system-spec-kit", "score": 0.786146, "confidence": 0.9426,
                     "dominantLane": "explicit_author", "status": "active"}],
"freshness": "live", "ambiguous": false
```

Prompt-safety check on the same call: `grep -c "save this conversation"` over the response = `0`. Lane breakdown contains only `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly`. Every expected signal matched.

### NC-002 Native advisor_status Transitions — PARTIAL

Live check (real repo): all documented fields present.

```json
"freshness": "live", "generation": 1154,
"trustState": {"state": "live", "reason": null, "generation": 1154, ...},
"lastGenerationBump": "2026-09-11T19:57:45.549Z", "lastScanAt": "2026-09-11T19:57:45.549Z",
"skillCount": 19, "laneWeights": {...}
```

`skillCount 19` matches the 19 `graph-metadata.json` files found under `.opencode/skills` (counted directly), so the nonzero-integer signal holds.

Stale check (copy, after touching a copied `graph-metadata.json`):

```text
freshness: stale  generation: 1172
trustState: {"state": "stale", "reason": "advisor-server-watcher-reindex", "generation": 1172, ...}
```

Absent check (copy, SQLite and JSON fallback moved aside, called twice):

```text
call 1: freshness: stale  trustState: {"state": "absent", "reason": "advisor-server-startup-scan", "generation": 1178, ...}  errors: None
call 2: freshness: stale  trustState: {"state": "absent", "reason": "advisor-server-startup-scan", "generation": 1178, ...}  errors: None
```

The absent state is surfaced, but through `trustState.state`, while the top-level `freshness` field reads `stale`. The scenario expects `freshness: "absent"`, so that documented signal is not met as written. Because the copy had no daemon watching its removed artefacts, this check may differ from a live absent transition; it is reported as observed.

### NC-003 Native advisor_validate Slice Bundle — FAIL

Baseline call (`{"confirmHeavyRun":true,"skillSlug":null}`), exit 0, 8.1 s:

```json
"thresholdSemantics": {"aggregateValidation": {"fullCorpusTop1": 0.75, "holdoutTop1": 0.725,
  "perSkillTop1": 0.7, "unknownCountTargetMax": 10},
 "runtimeRouting": {"confidenceThreshold": 0.8, "uncertaintyThreshold": 0.35, "confidenceOnly": false}},
"overallAccuracy": 0.7897,
"full_corpus_top1": {"percentage": 0.7897, "passed": true, "threshold": 0.75, "count": {"passed": 154, "total": 195}},
"unknown_count": {"value": 13, "targetMax": 10, "passed": false},
"holdout_top1": {"percentage": 0.75, "passed": true, "threshold": 0.725, "count": {"passed": 30, "total": 40}},
"parity": {"explicit_skill_top1_regression": {"passed": false,
  "regressions": ["rr-iter2-020", "rr-iter3-092", "rr-iter3-097", "rr-iter3-099", "rr-hub6-204", "rr-hub6-207"]},
 "ambiguity_slice_stable": {"passed": true, "top2Within005": true}, "derived_lane_attribution_complete": true},
"latency.regression_suite_status": {"p0PassRate": 1, "failedCount": 11, "commandBridgeFalsePositiveRate": 0,
  "cacheHitP95Ms": 4.859, "uncachedP95Ms": 9.949}
```

Focused call (`skillSlug: "system-spec-kit"` plus three outcome events), exit 0:

```json
"recordedThisRun": 3,
"scope": {"kind": "skill", "skillSlug": "system-spec-kit"},
"totals": {"accepted": 73, "corrected": 1, "ignored": 25}     // baseline was 72 / 0 / 24 → +1/+1/+1
```

Every contract field and both telemetry behaviours are correct. The failing signals are the documented baseline conditions: the scenario states 80.5% full corpus, 77.5% holdout, UNKNOWN ≤ 10 and zero Python-parity regressions. Observed 78.97%, 75.0%, UNKNOWN 13 and six regressions. The listed failure mode "Python parity fails" therefore fires. Attribution note: this run cannot tell whether the regressions predate the MCP decommission — the fixtures and corpus may have drifted since the Phase 027 numbers were recorded. It is reported as the scenario documents it: FAIL on the stated expected signals.

### NC-004 Ambiguous Brief Rendering — PASS

Unit tests:

```text
✓ tests/handlers/advisor-recommend.vitest.ts (22 tests) 194ms
✓ tests/legacy/advisor-renderer.vitest.ts (13 tests) 6ms
Test Files  2 passed (2)   Tests  35 passed (35)
```

Broad prompt (legacy MCP row mapped to the CLI call):

```text
status: ok   ambiguous: True   freshness: live
  [0] skillId=sk-code   confidence=0.95
  [1] skillId=sk-prompt confidence=0.95
prompt_literal_present: False
```

Top two sit inside the 0.05 ambiguity window and are surfaced as ambiguity rather than false certainty. This scenario failed in a prior run (2026-07-03, `advisor_unavailable`); from the current final state it genuinely passes.

### NC-005 Lifecycle Redirect Metadata — PASS

```text
✓ tests/lifecycle-derived-metadata.vitest.ts (16 tests) 255ms
✓ tests/compat/redirect-metadata.vitest.ts (4 tests) 2ms
Test Files  2 passed (2)   Tests  20 passed (20)
```

The conditional runtime fixture step ran despite the scenario's "if a runtime fixture is available":

```text
status: ok   freshness: live   recs: 0
raw prompt present: False
```

No superseded entry routed, so `redirectFrom`/`redirectTo` were verified by the lifecycle and redirect-metadata tests rather than by a live response. The sanitizer/prompt-safety signal holds (no prompt literal in the response).

### NC-006 Advisor Status and Rebuild Separation — PASS

Two diagnostic status calls on the copy, after making source metadata newer:

```text
#1 freshness: stale generation: 1155  trustState: {"state": "stale", "reason": "advisor-server-startup-scan", ...} skillCount: 19
#2 freshness: stale generation: 1155  (identical) — no rebuild side effect
```

Explicit rebuild, then status:

```json
"rebuilt": true, "skipped": false, "reason": "stale",
"freshnessBefore": "stale", "freshnessAfter": "live",
"generationBefore": 1155, "generationAfter": 1156, "skillCount": 19
→ status after: freshness live, generation 1156, trustState {"state": "live", "reason": null, "generation": 1156}
```

Live skip and forced rebuild:

```json
{"rebuilt": false, "skipped": true, "reason": "status-live", "generationBefore": 1156, "generationAfter": 1156}
{"rebuilt": true, "skipped": false, "reason": "force",     "generationBefore": 1156, "generationAfter": 1157}
```

All five expected signals matched exactly, including the `reason` strings. This is the strongest end-to-end result in the run: the diagnostic/repair split works from the CLI in the final state.

### NC-007 Skill Graph Status — PASS

```json
"totalSkills": 13, "totalEdges": 51, "dbStatus": "ready",
"lastIndexedAt": "2026-09-11T19:11:49.197Z",
"validation": {"brokenEdgeCount": 0, "weightBandViolations": 2, "unsupportedSchemaVersionCount": 0, "isHealthy": true},
"staleness": {"trackedSkills": 13, "freshSourceFiles": 0, "changedSourceFiles": 13, "missingSourceFiles": 0, ...}
```

Expected signal is field presence (`totalSkills`, `totalEdges`, `dbStatus`) with no handler error — met. Documentation drift recorded: this scenario file's own Evidence block is empty and its PASS line asserts `totalSkills: 20, totalEdges: 81`, which no longer matches the shipped DB (13/51). The `changedSourceFiles: 13` staleness reading also means every tracked skill's source files are newer than the graph.

### NC-008 Skill Graph Query — PASS (with a payload correction)

The scenario documents `depth: 0` in its command payload. The shipped schema rejects that:

```text
node .opencode/bin/skill-advisor.cjs skill_graph_query --json '{"queryType":"hub_skills",...,"depth":0,"limit":10}'
→ EXIT=64
{"status":"error","error":"Invalid arguments for skill_graph_query: skill_graph_query.depth must be >= 1","exitCode":64}
```

Reran with a schema-valid payload (the historical MCP tool call is now the CLI command of the same name):

```text
queryType: hub_skills   minInbound: 1   row_count: 10
ids: ['sk-code', 'cli-external-orchestration', 'system-spec-kit', 'sk-doc', 'sk-git',
      'sk-prompt', 'system-deep-loop', 'mcp-code-mode', 'mcp-tooling', 'sk-design']
BYTES=89028
```

Query-type metadata is present and the row count respects `limit: 10`. Observation worth recording: the "bounded" result is bounded by row count only — one page is 89 KB because each row carries the full node projection.

### NC-009 Skill Graph Validate — PASS

```json
"isValid": true, "errorCount": 0, "warningCount": 19,
"checkedNodes": 13, "checkedEdges": 51, "errors": [],
"warnings": [
  "WEIGHT-BAND: sk-communication siblings sk-doc weight 0.3 outside recommended band [0.4, 0.6]",
  "SYMMETRY: sk-communication has sibling sk-code, but sk-code missing sibling sk-communication",
  "DERIVED-FRESHNESS: cli-external-orchestration derived block has no sanitizer_version (schema v2 requires sanitizeSkillLabel:v1); re-run derived sync",
  ... 16 more DERIVED-FRESHNESS / WEIGHT-BAND / SYMMETRY entries
]
```

Diagnostics are operator-readable, categories and severity state are present, no unhandled exception. The 19 warnings are a real workspace signal (missing `sanitizer_version` across skills, weight-band and symmetry findings), not a scenario failure — but they mean the graph is not warning-clean going into closeout.

### NC-010 Shadow-Delta Sink Opt-In — FAIL

Default-off leg: after a recommend call with both sink variables unset, `runtime/data/` contained only `README.md` and `prompt-policy.default.json` — no `shadow-deltas.jsonl`, no scratch file. The response still carried the response-visible `_shadow` comparison. That half works.

Enabled leg, path under the workspace root exactly as the scenario prescribes:

```text
SPECKIT_ADVISOR_SHADOW_DELTA_PATH=/tmp/sa-pi-deepseek/ws/shadow-deltas.jsonl
node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "build a typescript handler with vitest coverage" ...
→ EXIT=0, freshness live, 3 recommendations, warnings: None, errors: None
→ NO SINK FILE
```

No durable record was written and nothing in the response indicated a problem. Calling the shipped sink module directly with the same environment isolates the cause:

```json
enabled: true
resolve: {"ok":false,"path":"/tmp/sa-pi-deepseek/ws/shadow-deltas.jsonl",
          "error":"SPECKIT_ADVISOR_SHADOW_DELTA_PATH must stay under workspace root: /private/tmp/sa-pi-deepseek/ws"}
write:   {"written":false, "error":"... must stay under workspace root: /private/tmp/sa-pi-deepseek/ws"}
```

The workspace root is canonicalized (`/private/tmp/...`) while the env path is only `resolve()`d (`/tmp/...`), so an in-workspace path expressed through the macOS `/tmp` symlink fails the containment check. Using the canonical form works:

```text
SPECKIT_ADVISOR_SHADOW_DELTA_PATH=/private/tmp/sa-pi-deepseek/ws/shadow-deltas.jsonl
→ records: 3
  field prompt: hmac:928a2a98874b9b099533debc53f7fd0cbdf9598ffa326de699919b81a30427c7  (×3)
raw prompt leaked: False
```

Contract test: `✓ tests/shadow-sink.vitest.ts (3 tests) 5 passed` — the suite does not catch the `/tmp`-alias case. Two defects here: the false rejection of an in-workspace path, and the handler ignoring `recordShadowDelta`'s error result so the refusal is silent.

---

## 5. CROSS-CUTTING FINDINGS

**F1 — Shadow-sink boundary check rejects the documented test path (NC-010).** `/tmp` on macOS is a symlink to `/private/tmp`; the workspace root is canonicalized and the sink path is not, so the boundary check refuses a path that is genuinely inside the workspace. The handler ignores the sink result, so the refusal never reaches the response. Impact: the opt-in sink cannot be enabled from a `/tmp`-rooted workspace without knowing the canonical-path workaround, and failures are invisible.

**F2 — Watcher-triggered reindex leaves `trustState` stale (AU-001, AU-004).** In both scenarios the watcher did the right mechanical thing (generation +1, `lastScanAt` advanced, reason `advisor-server-watcher-reindex`) but `advisor_status` still reported `stale` afterwards. Reproduced directly: the stored `sourceSignature` in `skill-graph-generation.json` (`b917b5ef…`) did not equal a fresh `computeAdvisorSourceSignature` (`92218e23…`) computed from the same workspace. By contrast, an explicit `advisor_rebuild` published a signature that stayed `live` past a 20-second re-check. One plausible contributor is that the source snapshot includes the mutable SQLite artefact (its mtime/size/content hash are hashed into the signature), so any DB write after publication invalidates the signature; this was not root-caused here and needs a dedicated look. Clone-workspace caveat applies: the same asymmetry was not re-verified on the live repo.

**F3 — Corrupt-SQLite repair requires a daemon restart (AU-005).** With the daemon holding a corrupted database: status diagnoses it (`file is not a database; run advisor_rebuild`), `skill_graph_scan --trusted` fails with `database disk image is malformed` and no rebuild, and `advisor_rebuild --trusted` — the command the error message names — fails with the same error. After restarting the daemon, the same status + rebuild pair performs a clean rebuild-from-source (13 nodes, 52 edges, `freshnessAfter: live`). The operator-facing repair instruction is therefore incomplete without "restart the daemon first".

**F4 — NC-003's documented baseline does not hold.** Parity reports six regressions and `unknown_count` is 13 against `targetMax: 10`; full-corpus 0.7897 and holdout 0.75 sit below the stated 0.805/0.775. The slice contract and telemetry behave correctly, so this is a numerics/fixtures question, not a broken surface. Cannot be attributed to the decommission from this run.

**F5 — Scenario-document drift.** Three concrete mismatches between scenario text and shipped behaviour, besides F1/F3:
- NC-008's payload carries `depth: 0`, which the shipped schema rejects (`minimum: 1`).
- `skill_graph_scan` rejects `--workspace-root` (`Unknown parameter(s): workspaceRoot`); it accepts only `skillsRoot`.
- NC-002 expects the absent state in the top-level `freshness` field; the shipped status surfaces it as `trustState.state: "absent"` while `freshness` reads `stale`.

**F6 — Prompt safety holds everywhere it was checked.** Raw prompt literals were absent in every captured response where the prompt text was greppable: NC-001 (count 0), NC-004, NC-005, NC-010 (`prompt` fields are `hmac:` digests only). No prompt leakage was observed in any CLI output during this run.

**What demonstrably did not degrade from the MCP removal (positive evidence).** The recommend happy path, ambiguity rendering, lifecycle tests, status/rebuild separation with all five reason strings, skill-graph status/query/validate, and the validate bundle's contract surface plus outcome telemetry all work through the CLI front door from the final state. The `advisor_validate` telemetry deltas (+1/+1/+1) and the NC-006 rebuild chain are the strongest signals that the CLI front door reproduces what the retired surface used to do.

---

## 6. COVERAGE AND LIMITATIONS

**Run:** 15 of 15 assigned scenarios executed to an observable outcome; none required an interactive runtime, so no scenario was skipped as unrunnable.

**Verdicts:** 9 PASS, 2 PARTIAL, 4 FAIL across the assignment. The four FAILs are AU-004, AU-005, NC-003 and NC-010; the two PARTIALs are AU-001 and NC-002.

**Not verified (named, not silently skipped):**
- Daemon stderr/log content for AU-003 (no log file exposed by the launcher/daemon pair).
- AU-001's daemon-log claim that only the tracked touch produces a reindex event (generation deltas are the evidence used instead).
- Live-repo absent/stale transitions in NC-002; transitions were produced on the disposable copy because producing them live would require mutating the real database.
- Whether NC-003's parity regressions and the F2 trust-state asymmetry reproduce on the live repo; both were observed on, or against, the disposable copy.

**Concurrency note.** Two sibling lanes ran this playbook against the same live repo while this run executed. That is why live generation numbers in this file move between calls; every quoted live number carries its call timestamp. The /tmp workspace isolates every mutating step from both the live daemon and the sibling lanes.

**Artifacts.** Captured raw JSON for the quoted steps is under `/tmp/au00*.json`, `/tmp/nc002-*.json`, `/tmp/nc003-*.json`, `/tmp/nc004-*.json` (none of it repo-tracked), and the disposable workspace remains at `/tmp/sa-pi-deepseek/ws` for re-inspection. All scratch daemons and launchers started by this run were stopped; the live repo's own daemons were left alone.
