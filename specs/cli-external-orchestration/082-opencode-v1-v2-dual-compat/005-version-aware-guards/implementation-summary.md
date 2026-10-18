---
title: "Implementation Summary"
description: "The dispatch guards are version-aware. The classifier admits opencode2, each hard rule declares appliesTo, one memoised resolver returns v1, v2 or unknown, and the v2 slash route warns instead of blocking."
trigger_phrases:
  - "version aware guards implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/005-version-aware-guards"
    last_updated_at: "2026-10-18T17:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the packet docs from the scratch ledger"
    next_safe_action: "Delete scratch/backup/ and run the same-class search, then close the phase"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/lib/opencode-version.mjs"
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".skilled/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-version-aware-guards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-version-aware-guards |
| **Status** | Complete |
| **Completed** | 2026-10-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The dispatch guards are version-aware. The classifier admits an `opencode2` executor and its evidence regexes match `opencode2 run`, so an `opencode2` command is no longer passed without a rule check. Each rule in the cli-opencode sidecar declares an `appliesTo` list, and one memoised resolver reports `v1`, `v2` or `unknown` from parsed `--version` output. The rule engine keeps the rules whose `appliesTo` includes the resolved version, keeps both-version rules at their own severity on `unknown`, and the new v2 slash-prompt route warns instead of blocking, so a correct v2 run is no longer refused by a rule it cannot satisfy.

### Phase 5: version-aware-guards

The phase landed a new resolver module and widened the two guard libraries that consume it. The resolver holds a pure parser for the two version shapes, an injectable probe, a named timeout constant and a cache keyed by realpath, size and mtime, and both the async export and a synchronous sibling share that cache. The rule engine calls the synchronous one only for an OpenCode `run` command whose rule list declares `appliesTo`, so the other dispatches never probe.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/lib/opencode-version.mjs` | Create | The memoised version resolver, its parser, its injectable probe and its cache. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | The exact-name membership tests became an `opencode\d*` predicate and the evidence regexes were widened. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | The three `opencode run` regexes were widened, `evaluate` resolves the version when the caller passes none, the rule list is filtered by `appliesTo`, and the v2 slash-prompt check was added. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Modify | `appliesTo` was added to the five rules and the v2 slash-prompt rule was added at `warn`. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | The `opencode2 run` cases for R1 to R8 and the adversarial table. This file runs under Vitest. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | The `appliesTo` filter, the unknown intersection, the v2 slash fixture, the resolver cases and the probe-count case. This file runs under `node --test`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Red first. The new cases were written before the code. The red run recorded 4 of 25 rule-check cases failing (`scratch/red-rule-checks.txt:284-288`), and the audit file failed to load because the resolver module did not exist yet (`scratch/red-audit.txt:9`). The baseline counts were taken before any edit: 91 passed under Vitest with one pre-existing file load failure (`scratch/base-vitest.txt:23`), then 20 rule-check cases, 57 shared hook cases and 7 source-root cases, each with zero failures (`scratch/base-rule-checks.txt:126`, `scratch/base-shared.txt:349`, `scratch/base-source-root.txt:11`).

The resolver, the sidecar, the classifier and the rule engine then landed, and every suite was rerun from the final state. The Vitest run passed 110 tests, the rule-check suite 28, the shared hook suite 57 and the source-root suite 7, each at or above its baseline (`scratch/fix-vitest.txt:23`, `scratch/fix-rulechecks.txt:31`, `scratch/fix-shared.txt:348`, `scratch/fix-source-root.txt:10`). The drift guards passed with exit 0 and 8 non-blocking warnings (`scratch/evidence.md:20`, `scratch/drift-guards.txt:42`). Every `.mjs` in the dispatch library passed `node --check` (`scratch/evidence.md:21`), and `jq empty` accepted the sidecar (`scratch/evidence.md:22`).

The cross-family review returned 4 P1 and 2 P2 findings under a CHANGES REQUESTED verdict (`scratch/review-findings.log:93`). Its two blocking mechanisms were a probe trigger narrower than the classifier's own admission of opencode dispatches and an `OPENCODE_BIN` override that retargeted the probe to a different binary than the command named. The fix round replayed the review's failing inputs against the real installed opencode 1.19.3 and opencode2 2.0.32 binaries. After the fixes, a quoted, a `bash -c` and an `sh -c` wrapped v2 slash run each return only `v2-slash-prompt-route:warn`, an `OPENCODE_BIN=opencode` value beside an `opencode2` command does the same, a v1 slash run still blocks, and a path-qualified binary resolves to `unknown` with both version-specific rules at `warn` (`scratch/replay-review-inputs.txt:1-6`).

The final suite carries three tests the pre-review run did not have, covering the sync resolver on quoted, wrapped and path-qualified executors, the one-probe count across two evaluations, and the `appliesTo` shape guard (`scratch/fix-rulechecks.txt:11-12`, `scratch/fix-rulechecks.txt:27`).

One test edit came from the orchestrator. The enforcement guard needs a fixture pair for every check, and the new `v2-slash-prompt-route` check shipped without one, so the run failed with `checks with no fixture pair: v2-slash-prompt-route` (`scratch/after3-rulechecks.txt:39`). The orchestrator added the fixture pair to `CHECK_FIXTURES`, test data only, and the guard passes in the final run (`scratch/after4-rulechecks.txt:22`, `scratch/evidence.md:39`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Q5 ruling: on `unknown`, both-version rules run at their own severity and version-specific rules run at `warn` | The brief's unknown intersection would drop v1-only rules when a probe fails, which narrows coverage. The ruling keeps the coverage and still blocks nothing the probe cannot prove. L1, plan rows R5 to R8 and the spec risk row were amended to match (`scratch/evidence.md:36`). |
| Q6 ruling: a synchronous resolver for synchronous callers | `resolveOpencodeVersion` is async while `evaluate` and its preflight callers are synchronous. The async export stays for its timeout tests, a `resolveOpencodeVersionSync` shares its cache and probes through a bounded `spawnSync`, and `evaluate` calls it only for an OpenCode `run` command whose rule list declares `appliesTo` (`scratch/evidence.md:37`). |
| NFR-S01 amended: probe the binary the command runs | The resolver probes the bare command name the dispatch runs, and `OPENCODE_BIN` is the probe target only when the command runs `$OPENCODE_BIN` itself. The review showed the unconditional override probed a different binary than the dispatch invoked (`scratch/evidence.md:38`, `scratch/review-findings.log:52`). |
| The v2 slash-prompt rule warns and does not block (L3) | OpenCode 2.0.32 `run` has no `--command` flag, so the v1 error rule can never be satisfied on v2. |
| The cache key is realpath, size and mtime (L2) | Research section 6 and the 006 brief agree on the three-part key, and a size or mtime change triggers a fresh probe. |
| A path-qualified binary resolves to `unknown` with no probe (L4) | Running a binary named in command text before the command is checked is the risk the resolver exists to avoid. |
| A rule without `appliesTo` reads as both versions (L5) | A sidecar that predates the field keeps its v1 behaviour, and the replay confirms the legacy rule still fires on both versions (`scratch/review-findings.log:64`). |
| Orchestrator test edit | The enforcement guard needs a fixture pair for every check. The new `v2-slash-prompt-route` check shipped without one, so the pair was added to `CHECK_FIXTURES` as test data (`scratch/evidence.md:39`). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline counts (T002) | Vitest 91 passed with one pre-existing Pi load failure (`scratch/base-vitest.txt:23`), rule checks 20 pass (`scratch/base-rule-checks.txt:125`) and 0 fail (`scratch/base-rule-checks.txt:126`), shared hooks 57 pass (`scratch/base-shared.txt:348`) and 0 fail (`scratch/base-shared.txt:349`), source root 7 pass (`scratch/base-source-root.txt:10`) and 0 fail (`scratch/base-source-root.txt:11`). |
| Red run (T005) | 4 of 25 rule-check cases failed (`scratch/red-rule-checks.txt:284-288`), and the audit file failed to load because the resolver module did not exist (`scratch/red-audit.txt:9`). |
| Green run of every guard suite (T013) | Vitest 110 passed (`scratch/fix-vitest.txt:23`), rule checks 28 pass (`scratch/fix-rulechecks.txt:31`) and 0 fail (`scratch/fix-rulechecks.txt:32`), shared hooks 57 pass (`scratch/fix-shared.txt:348`) and 0 fail (`scratch/fix-shared.txt:349`), source root 7 pass (`scratch/fix-source-root.txt:10`) and 0 fail (`scratch/fix-source-root.txt:11`). Every count is at or above its baseline. |
| Syntax and sidecar | `node --check` exited 0 on every `.mjs` in the dispatch library (`scratch/evidence.md:21`), and `jq empty` accepted `hard-rules.json` (`scratch/evidence.md:22`). |
| Drift guards | All 4 guards passed with 8 non-blocking warnings (`scratch/drift-guards.txt:42`). |
| Review and fixes | 4 P1 and 2 P2 findings under CHANGES REQUESTED (`scratch/review-findings.log:93`). The replayed inputs behave correctly after the fixes (`scratch/replay-review-inputs.txt:1-6`). |
| REQ-007 v1 parity (round 2) | One corpus of 23 v1 `opencode run` commands was run through the pre-change engine in the main checkout and the changed engine here, with the real opencode 1.19.3 on PATH, and reports 0 verdict differences (`scratch/req007-v1-parity.txt:1`). The corpus is not vacuous: 5 of 5 sample commands fire, hitting all 5 v1 rule ids (`scratch/req007-v1-parity.txt:2`, `scratch/evidence.md:45`). |
| AC-003 waiver (round 2) | Vitest exits 1 on the pre-existing Pi preflight load failure (missing `../../.skilled/hooks/shared/hook-flags.mjs`), identical in the baseline and the final run and also failing on main, so it predates this phase. Every pass count is at or above baseline, so AC-003 is Met with this waiver (`scratch/evidence.md:60`). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing Pi load failure.** `hooks/dispatch/pi/dispatch-preflight-lint.test.ts` cannot find `hook-flags.mjs` and fails to load in both the baseline and the final run with the same error. It also fails on main, so it is not a regression from this phase, but it keeps the Vitest run from reporting a clean exit (`scratch/evidence.md:10`, `scratch/evidence.md:16`). AC-003 records the suite as Met with this failure as its waiver (`scratch/evidence.md:60`).
2. **`no-bare-agent-general` is v1-only.** The rule stays v1-only until a v2 probe shows whether `--agent general` is rejected, so a v2 run keeps a false negative on that advisory rule (`scratch/evidence.md:42`).
3. **The per-fix backups were not taken.** The plan asks for a copy of each file under `scratch/backup/fix-<n>/` before a fix. `scratch/backup/` held only the five pre-change copies, and the directory was deleted in round 2 (`scratch/evidence.md:53`).
4. **REQ-007 parity rests on one corpus.** The round 2 capture compares 23 v1 `opencode run` commands through the pre-change engine in the main checkout and the changed engine here, with the real opencode 1.19.3 on PATH, and reports 0 verdict differences (`scratch/req007-v1-parity.txt:1`). The corpus is not vacuous: 5 of 5 sample commands fire, hitting all 5 v1 rule ids (`scratch/req007-v1-parity.txt:2`). REQ-007 now maps to AC-004, so the earlier mapping gap is closed.
5. **Finding 5 has no recorded disposition.** The evidence ledger does not record whether the review's P2 finding about a transient probe failure being cached as `unknown` was fixed or deferred (`scratch/review-findings.log:55`).
6. **The same-class search and the scoped `git status` check came in round 2.** `scratch/inventories.txt` holds the same-class producer list and the scoped status lines, and it records the phase-start HEAD `867b83b671` with the scoped diff stat (`scratch/inventories.txt:2`, `scratch/inventories.txt:4-15`).
7. **The many-segments edge case is partial.** `dispatch-rule-checks.test.mjs:228` proves one probe across two evaluations of one binary, and no test runs two distinct binaries in one command (`scratch/evidence.md:56`).
<!-- /ANCHOR:limitations -->
