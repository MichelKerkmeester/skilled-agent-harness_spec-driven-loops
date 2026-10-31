# Iteration 003 — swe-03: R2's zero-call slice and the two redaction unit cases as code

- **Wave:** W2 (sibling check performed first)
- **Maps to:** RQ1, RQ3. Questions 23 and 30 (R2's reshaping).
- **Executor:** cli-devin model=swe-2-max (inline, no dispatch)
- **Date:** 2025-12-02

## Focus Area

swe-03 — R2's zero-call slice and the two redaction unit cases as code: the driver path for `maybeVerifyGoal`, the tail-window and goal-core parity arms as functions, the `not_met`/`unclear` mapping, the fixture row schema and native pre-label join, the two redaction unit cases with exact inputs/outputs/test files, and every divergence between 003's docs and BASE's proposed amendments.

## Sibling Check

- Read `lineages/deepseek/iterations/iteration-005.md`: per-survivor failure matrix and kill table; R2 plugin mode is "the only survivor whose failure could alter today's behavior" — confirmed independently below (`blocked` catch at `opencode-goal.js:2378-2386`). Adopted: `stop: fewer than 30 rows` kill and the stub-PATH no-key test pattern.
- Read `lineages/grok/iterations/iteration-005.md`: kills `r2 jev arm not built: no recorded OpenCode or Pi verifier use` and `evidence is the stored goal string` — both directly energized by the state-dir census below.
- Read `lineages/mimo/iterations/iteration-002.md`: 757 `goal_status` attachment records (met false 695 / true 62), 610 with `reason` (p50 830 chars); field names `condition,durationMs,failed,iterations,met,reason,sentinel,tokens,type`. Used for the join design.
- `lineages/mimo/iterations/iteration-003.md` does not exist — its question (any recorded verifier use?) was answered here with a direct state-dir count instead.

## Sources Read

- `.opencode/plugins/opencode-goal.js`: `:36-49` (env/defaults incl. `DEFAULT_MAX_EVIDENCE_CHARS=1200`, verifier timeout 30 s), `:134-136` (`VALID_VERIFIER_MODES`, `VERIFIER_BLOCKING_PATTERN`, `VERIFIER_COMPLETION_PATTERN`), `:179` (`VALID_VERIFIER_VERDICTS`), `:226-234` (`normalizeVerifierMode` silent fallback, `defaultSupervisorVerifierForMode`), `:249-256` (verifier mode + stateDir option plumbing), `:382-389` (`clampText`), `:414-420` (`sanitizeInlineText`), `:463-475` (`redactEvidence`), `:1095-1118` (evidence extraction clamps at capture), `:1404` (`writeGoalAtomic(goal, options)`), `:1921-1960` (`markGoalStatus`), `:2197-2230` (heuristic, five checks), `:2308-2352` (`defaultVerifierResult` → `not_met`, `normalizeVerifierResult`), `:2354-2388` (`runSupervisorVerifier`, timeout→`not_met`, throw→`blocked`), `:2397-2449` (`maybeVerifyGoal` CAS apply), `:3359-3385` (`__test`) [SOURCE: file]
- `.skilled/hooks/goal/lib/goal-core.cjs`: `:39-43` (same `OPENCODE_GOAL_STATE_DIR`/`.state/goal`), `:290-297` (`clampText` port), `:596-620` (`verifyGoalHeuristic`, met/not-met/unclear), `:1590`/`:1611` (`module.exports`) [SOURCE: file]
- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:100-131` (`credential-assignment` at `:124-130`) [SOURCE: file]
- `003-goal-verifier-jev-shadow/{spec.md,plan.md}` in full [SOURCE: files]
- BASE R2 rows (research.md:50,91-95,144-145,298-336) [SOURCE: BASE]
- Main-checkout goal state census: `~…/Public/.skilled/skills/.state/goal/` — 5 records, field names and status counts only [SOURCE: census this session]

## Findings

### Q1 — Driver path: `__test.maybeVerifyGoal` wins; no export needed

**Option A (drive through the existing `__test`):** `__test` already exports `writeGoalAtomic` (:3382), `setGoal` (:3380), `bindGoal` (:3363), `readGoal` (:3378), and `maybeVerifyGoal` (:3377). Per labeled row: `writeGoalAtomic({sessionID, status:'active', objective, lastEvidence: row.rawEvidence, revision:0, …}, {stateDir: mkdtemp})` then `await maybeVerifyGoal(sessionID, {stateDir})` → envelope carries `{verdict, reason, confidence, verifierSource}` (:2319-2328). `maybeVerifyGoal` internally runs `normalizeOptions` (`stateDir` honored at :254-256), `readGoal`, `runSupervisorVerifier` → `options.supervisorVerifier` defaulting to `defaultHeuristicSupervisorVerifier` when mode=`heuristic` (:231-233). ~15 LOC of setup per row; zero new exports; measures the **real** heuristic end-to-end (including the clamp defect, since the heuristic re-sanitizes evidence at :2199). 003's plan already specifies exactly this pattern (plan.md:65, citing `opencode-goal-supervisor.test.cjs:34-44`).

**Option B (add the heuristic to `__test`):** one line adding `defaultHeuristicSupervisorVerifier` to the frozen `__test` object (:3359-3385) — but `opencode-goal-export-contract.test.cjs` exists in `.opencode/plugins/tests/`, so the export surface is contract-pinned: a one-line add is still a frozen-contract touch with an owner. It also tests the function in isolation, skipping the `normalizeVerifierResult`/capture path the slice is meant to measure.

**Verdict: Option A is smaller and touches no contract.** It is already the committed plan. One subtlety verified: the injected-`supervisorVerifier` option (:250, used at :2360) cannot help — you can inject a replacement but cannot *wrap* the real heuristic (it isn't exported), so any delegation would test a copy.

### Q2 — The two zero-call arms as functions, and the vocabulary mapping

**Clamp defect confirmed line-by-line (the reason the tail-window arm exists).** `clampText` appends `'...'` to any text over its limit (:387-388; identical port `goal-core.cjs:295-296`). The heuristic then tests `/\.\.\.$/` on the sanitized evidence and returns "Evidence appears truncated" (:2209-2211; port :606-607). Capture clamps at :1107→:475→:419 with `DEFAULT_MAX_EVIDENCE_CHARS=1200` (:42); the heuristic clamps again at :2199. So **any evidence >1,200 chars after whitespace folding is guaranteed non-`met` in both runtimes** — `not_met` in OpenCode (:2308-2317), `unclear` in goal-core (:606-607), which Pi then nudges on (`goal-context.ts:233-238` per BASE:316).

**Arm functions for the scorer:**

- `runHeuristicArm(row)` — Option-A driver; returns `{verdict, reason, attributedCheck}` where `attributedCheck ∈ {too_short, blocking, truncated, no_signal, off_objective}` is recovered by matching the five reason strings (:2202,:2206,:2210,:2214,:2220) — no copy of `VERIFIER_BLOCKING_PATTERN` needed for *attribution*.
- `runTailWindowArm(row)` — `tail = row.rawEvidence.slice(-1200)` (raw tail, no appended marker), then the same five checks copied (~50 LOC: length<24, `VERIFIER_BLOCKING_PATTERN` copy from :135, genuine-trailing-`...` test, `VERIFIER_COMPLETION_PATTERN` copy from :136, keyword coverage via a small `objectiveKeywords` copy). This is the **missing third arm** (see Q5) — it measures how many `not_met`/`unclear` verdicts are pure clamp artifacts vs. real judgments.
- `runGoalCoreParityArm(row)` — `require('goal-core.cjs').verifyGoalHeuristic({goal:{objective:row.objective}, transcriptText: row.asIngestedEvidence})` (exports at :1590/:1611) → `{met, not-met, unclear}`.

**Vocabulary mapping (the mapping REQ-005 already half-specifies):** OpenCode `{met, not_met, blocked}` (:179; heuristic emits only met/not_met — binary, :2197-2230) vs goal-core `{met, not-met, unclear}` (:601-619). Normalization: `not-met`→`not_met`; `unclear`→`not_met` for the confusion table **but kept as its own report row** — `unclear` is the verdict Pi nudges on, so collapsing it silently would hide exactly the nudge-rate the parity arm exists to measure. `blocked` has no goal-core source — a `blocked`-labeled row scores both heuristics 0 by construction (BASE:308 confirmed again here).

### Q3 — The two redaction unit cases

Both regexes confirmed non-matching by trace (not executed — regex reads only):

| # | Input | Expected after fix | Today | Test file | Smallest change (reported, not made) |
|---|---|---|---|---|---|
| 1 | `TYPESAFE_API_KEY=ts_a1b2c3d4e5f6a1b2c3d4e5f6a1b2` | `TYPESAFE_API_KEY=[secret-redacted]` (plugin) / `[REDACTED:credential-assignment]` (scrubber) | **unchanged** — `\b` before `api` fails: `_` is a word char, `E_API` has no boundary | `secret-scrubber.test.ts` via the public scrub fn; `.opencode/plugins/tests/` copy-of-regex case (redactEvidence isn't in `__test`, so the plugin case embeds a line-cited regex copy per BASE's "regex copies" note) | Both files: `\b` → `(?<![A-Za-z0-9])` (admits `_`-prefixed names, still refuses alphanumeric fusion). Scrubber :128 additionally needs `service` in the prefix set — `(?:api\|access\|auth\|client\|secret\|service)` — because `token` is not a standalone alternative there, unlike the plugin's :474 which already lists bare `token`/`secret` |
| 2 | `SERVICE_TOKEN=tok_z9y8x7w6v5z9y8x7w6v5z9y8` | same marker shape | **unchanged** — same `\b` failure before `TOKEN`; the scrubber also can't reach `token` without a `service` prefix | same files | same two edits |

Caveat worth reporting: a ≥48-char high-entropy *value* can still be caught by the generic-secret patterns (:473 / scrubber's class list), so the unit cases must use values under 48 chars to isolate the assignment-regex gap — `ts_a1b2…` above is 32 chars.

### Q4 — Fixture row schema and the native pre-label join

```json
{"row_id":"r-0001","source":"tx-goal_status|opencode-state|operator-authored",
 "transcript_ref":"<sha256-of-filename>","record_index":8123,
 "objective":"<stored goal text>","rawEvidence":"<last assistant text, unclamped>",
 "asIngestedEvidence":"<post-redactEvidence form>","nativeLabel":"met|not_met|null",
 "nativeReason":"<goal_status.reason>","operatorLabel":"met|not_met|blocked|null",
 "disposition":"prelabeled|needs-adjudication"}
```

The join has **two** record sources, by field names only:

1. **Claude transcripts:** `attachment` records with `attachment.type==="goal_status"` — fields `{condition,durationMs,failed,iterations,met,reason,sentinel,tokens,type}` (mimo-02's census: 757 records, `met` 62 true / 695 false). `met`→`nativeLabel`; `reason`→`nativeReason`; evidence = the last `assistant` record's `text` blocks *before* that attachment's index in the same file (BASE: 753/755 pairable; BASE counted 755 vs mimo-02's 757 — a 2-record census drift worth one line in the report).
2. **OpenCode/Pi state records:** `*.json` under `.skilled/skills/.state/goal/` — carry `status`, `lastVerifierVerdict` (:2423), `lastVerifierReason` (:2424), `lastVerifierConfidence` (:2425), `lastEvidence` (:2427). **Census this session: all 5 records on the main checkout are `lastVerifierVerdict:"not_evaluated"`, `verifierSource:null`, `lastEvidence` length 0** — the OpenCode join currently yields zero usable rows and zero recorded verifier use. This is mimo-03's missing count, answered: D2's gate ("recorded OpenCode or Pi verifier use") stays **closed**; grok-05's kill `r2 jev arm not built: no recorded verifier use` currently fires. Since goal-core shares `OPENCODE_GOAL_STATE_DIR`/`.state/goal` (:39-43), these 5 records are the whole default-dir population for both runtimes.

### Q5 — LOC, test count, and every 003↔BASE divergence

**Divergences found (003 vs BASE's proposed amendments):**

| # | BASE amendment | 003 status |
|---|---|---|
| D-a | R-j: "heuristic, **tail-window** and goal-core parity at zero calls" | **Missing** — plan.md:65-67 has heuristic + parity only. The tail-window arm is the free fix Jev must beat; without it the keep threshold reads Jev-vs-broken-baseline |
| D-b | R-i: rows "carry the raw last assistant text **and** its as-ingested form", pre-labeled from native records | Fixture `{id,objective,evidence,label}` (spec:101) has one `evidence` field of unspecified form; **no pre-label join** — spec:46 has the operator authoring+labeling all 30-50 rows from scratch |
| D-c | R-l: "`show` gains a `verifier_shadow=` field" | Absent — spec:106 edits `goal-plugin.md:53,:70` only, not the `show` fields at :101-103 |
| D-d | R-k: "two unit cases pass first, one for each redaction regex" | Absent — REQ-007 says the operator strips secrets; no unit-case precondition anywhere in spec/plan/tasks |
| D-e | `-s -` stdin state flag (swe-01's defect on 002 plan.md:71) | plan.md:69 says "objective and evidence on stdin" for `jev choice` but never writes `-s -` — same defect class; the transport reads state via `-s text/@file/-` (SKILL.md:155), so as written the call sends no state |
| D-f | stability coefficient source | REQ-006 cites `benchmark-stability.cjs:22-28`; the live calculation sits at :102-108 (swe-01) — line drift, semantics identical |

**Aligned** (no action): REQ-005 normalization, REQ-006 keep rule (0.70× / no-new-false-`met` / asked-`blocked` / ≥0.95 stability), REQ-008 stops, REQ-009 per-call records, REQ-003 gate+skip line, REQ-007 egress announcement, REQ-010/011 shadow+keyless parity, edge-case matrix at :143-152.

**LOC:** scorer `score-verifier-labeled-set.cjs` ~280 (003's 100-150 + tail-window arm ~55 + parity arm ~30 + report/stop logic ~40, attributions ~30); fixture builder `build-verifier-fixture.cjs` ~140 (tx-tail parse ~80, `goal_status` join ~40, emit ~20); tests ~7 cases in `score-verifier-labeled-set.test.cjs` (happy path, `jev` absent, normalization, bad-label exit, **tail-window regression case**: >1200-char completion evidence → heuristic `not_met`/"truncated" while tail-window arm says `met` — the defect's signature) + ~4 in `opencode-goal-supervisor.test.cjs` (keep-only). Redaction unit cases: +12 LOC scrubber test, +15 plugin copy-test — reported to owners, not made.

## Ruled Out

- **Injecting `options.supervisorVerifier` to wrap the real heuristic** — rejected: the real function isn't exported, so an injected "wrapper" can only replace it; you'd be testing your copy (opencode-goal.js:250, :2360).
- **Using OpenCode state records as the evidence source** — disproved this session: all 5 records carry `lastEvidence` length 0 and `not_evaluated`; evidence must come from transcript pairing.
- **Mapping `unclear`→`not_met` silently in all outputs** — rejected: `unclear` is the exact verdict Pi nudges on (goal-context.ts:233-238); collapsing it hides the parity arm's purpose. Kept as its own report row, collapsed only inside the 2-class confusion math per REQ-005.
- **Fixing the regexes in place** — the contract says "reported to the owners, not made"; both changes are one-line diffs documented above.
- **Writing the labeled fixture from OpenCode state alone** — zero `not_evaluated`-free records exist; the slice would produce an empty set (grok-05's second R2 kill).

## New Information

- **mimo-03's question answered in passing**: 5/5 default-dir goal records `not_evaluated`, `lastEvidence` empty — recorded verifier use is **zero**; R2's Jev arm/plugin mode stay unbuilt under every sibling's kill rule. [SOURCE: state-dir census this session]
- **Clamp defect confirmed end-to-end at line level**: capture clamps at :1107/:475/:419 (1200) → `clampText` appends `...` (:387-388) → heuristic reads `...` as truncation (:2209-2211) → `not_met`; identical port in goal-core.cjs:295-296/:606-607 → `unclear` → Pi nudge. The defect is a *self-inflicted* signal, not just a missing tail. [SOURCE: both files]
- **003 misses the tail-window arm** (BASE's designated free-fix baseline) and 4 other enumerated divergences incl. the repeated `-s -` omission. [SOURCE: plan.md:65-69 vs BASE:92,319]
- **The two redaction unit cases have asymmetric minimal fixes**: the plugin needs only the lookbehind (bare `token`/`secret` alternatives already exist at :474); the scrubber additionally needs `service` in its prefix set (:128). [SOURCE: regex traces]
- **`maybeVerifyGoal` CAS discipline** (:2412-2417): result applies only if goalId+status+revision unchanged — a property the shadow mode inherits for free and the zero-call driver gets without fixtures racing. [SOURCE: file]

## Metrics

- **newInfoRatio:** 0.85 — the driver-path verdict, state-dir census, D-a..D-f divergence table, asymmetric regex fixes and the end-to-end defect chain are new; the vocab mapping and exit semantics confirm BASE.
- **Novelty justification:** turns R2's zero-call slice into named functions with an export-free driver, fills mimo-03's unrun census (D2 settled: zero recorded use), and surfaces six concrete doc divergences including the absent tail-window arm.

## Sibling Outbound

- For mimo-03 (if it ever runs): the state-dir census is done — 5 records, all `not_evaluated`, zero `lastEvidence`.
- For deepseek/grok: the redaction minimal-diff table (asymmetric fixes per file) refines the "two regexes fail" finding into the exact owner-facing patch.
