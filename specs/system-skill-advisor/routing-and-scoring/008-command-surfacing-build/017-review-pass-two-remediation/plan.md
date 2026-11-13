---
title: "Implementation Plan: Phase 17: review-pass-two-remediation"
description: "Fix the 27 P2 findings of review pass two in nine parallel worker lanes and one coordinator edit, each change test first where a test can fail, and hold every floor equal to its before reading."
trigger_phrases:
  - "review pass two remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: review-pass-two-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript in the advisor runtime, Node ESM and CommonJS scripts, YAML workflows and Markdown docs |
| **Framework** | None. Node.js with the advisor's own build (`npm run build` in `ADV`) |
| **Storage** | None. The routing corpora and the committed baselines are read, never rewritten |
| **Testing** | Vitest in `ADV`, and `node --test` for the doctor scripts, the shared session readers and the OpenCode plugin |

### Overview
Nine worker lanes, WG1 to WG9, each change only the files the report's Planning Packet gives them, plus the three WG1 files the operator's apostrophe decision adds. Each task writes its failing test first where one can fail, then makes the one change it names. The coordinator records the before numbers after phase 016, edits three parent map rows, rebuilds, reruns every suite and probe and requires every floor to equal its before reading.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 016 is committed: `git -c core.fsmonitor=false log -1 --format=%h -- .skilled/commands/create/sk-skill.md` prints a hash and `test -e .skilled/commands/create/skill.md` exits 1
- [ ] `scratch/before.txt` holds every gate reading named in `tasks.md` T001, and `scratch/repro-before.txt` holds the 18 probe outputs
- [ ] No lane's file is dirty: `git -c core.fsmonitor=false status --porcelain -- .skilled .opencode AGENTS.md` prints nothing

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in `ADV` reports 0 failed, `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs`, the reader tests and the plugin test report `fail 0`, and every `FLOOR` and `EVAL` value equals its `before.txt` line
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place fixes in file-disjoint lanes. No new module.

### Key Components
- **`isNoEditRequest` in `command-attach.ts`**: the one place a prompt is normalised and tested for no-edit wording. Without it, four call sites test three spellings of the pattern on an un-normalised prompt.
- **`trustedCheckout` in `command-offer.mjs`**: decides before any spawn whether a run log's checkout is the project root or a marked arena. Without it, a crafted log runs foreign code.
- **`armFor` and `lineFixture` in `run-command-behaviour.mjs`**: exported so a test can hold the arm rule and the replayed fixture. Without the exports, both stay private and untested.
- **The quote-aware launch reader in `hook-wiring-check.cjs`**: splits a hook command into simple commands outside quotes. Without it, a working wrapper reads as a missing hook.

### Data Flow
A prompt reaches `attachCommand`, the scorer's `readOnlyRouteAllowed` and `commandMeaningEligible`, and `isReadOnlyExplainer`, and each asks `isNoEditRequest` once. A finished run log line reaches `backfillRunLog`, which asks `trustedCheckout` before it warms or replays, and passes the line to `promptFor`, which takes the line's `fixture` through `lineFixture`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This plan comes from a review verdict of PASS with advisories, and its findings touch shared policy (the no-edit gate), path handling (the restore) and a trust boundary (the backfill), so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `NO_EDIT_REQUEST` in `ADV/lib/command-attach.ts` | Producer of the no-edit wording | update: widen, add `isNoEditRequest` | `CAG` four wordings plus control, `probe-no-edit.mts` |
| `attachCommand` in the same file | Consumer on the hub path | update: call `isNoEditRequest` | `CAG` |
| `readOnlyRouteAllowed`, `commandMeaningEligible` in `ADV/lib/scorer/fusion.ts` | Consumers on the scorer path | update: call `isNoEditRequest` | `CMA` curly case, `probe-no-edit.mts` scorer lines |
| `isReadOnlyExplainer` in `ADV/lib/scorer/text.ts` | Holds a third copy of the wording | update: call `isNoEditRequest` | `ROE` four cases |
| `advisor-recommend.md`, `command-meaning-matching.md`, `lib/README.md` | Name `NO_EDIT_REQUEST` without listing its wording | unchanged | `rg -n "without making changes" .skilled/skills/system-skill-advisor --glob '*.md'` prints nothing |
| The Python scorer | Has no no-edit copy | not a consumer | `rg -ln "without making changes" .skilled --glob '*.py'` prints nothing |
| `backfillRunLog` in `command-offer.mjs` | Spawns the checkout's CLI and hook | update: `trustedCheckout` first, line to `promptFor` | `COT` untrusted and marked cases, `probe-backfill-trust.mjs` |
| `backfillLog` in `run-command-behaviour.mjs` | Builds the replay prompt | update: `lineFixture` | `BG`, `COT` |
| `statusSnapshot` in `worktree-restore.mjs` | Source of every changed path | update: `-z` parsing | `WRT`, `probe-restore-quoted.mjs` |
| The runner's `statusPaths` and `changedPaths` | Consume the snapshot keys | unchanged API, keys now unquoted | `BG`, `VALL` |
| `runSpawnAttempt` in `subprocess.ts` | Collects capped stderr | update: busy scan on every chunk | `SUBT` |
| `tsString` in `derive-command-bridges.cjs` | Emits every generated string literal | update: escape line breaks | `DCS`, `DERIVE` prints `"changed": []` |
| `runsMarker` in `hook-wiring-check.cjs` | Decides `ok` or `hook-missing` | update: quote-aware reader | `HWT`, `node $DS/hook-wiring-check.cjs --root .` |
| `doctor-symlink-check.yaml` | Maps the hook check's exits | unchanged | `DALL` |
| A10 detail in `agents-md-check.cjs` | Printed only | update: count PASS alone | `CHKT`, `probe-a10-count.sh` |

Required inventories, run at planning:
- Same-class producers: `rg -ln "without making changes" .skilled --glob '!**/node_modules/**' --glob '!**/dist/**'` lists `command-attach.ts` and `scorer/text.ts` as the only code copies, beside two corpora and two doctor MCP docs that are prompts, not patterns.
- Consumers of changed symbols: `rg -n "NO_EDIT_REQUEST|isReadOnlyExplainer" ADV/lib` lists `command-attach.ts:289` and `:329`, `scorer/text.ts:145` and `fusion.ts:20`, `:36`, `:677`, `:709`, `:717`, `:881` and `:1236`. `rg -ln "backfillRunLog" ADV/tests` lists `command-offer.vitest.ts` only. `rg -n "copies as expected" .skilled/commands/doctor` lists only the engine and its test.
- Matrix axes for the no-edit gate: five wordings, straight or curly apostrophe, and four call sites. Rows required: each wording on `attachCommand`, the curly wording on `commandMeaningEligible` and each wording on `isReadOnlyExplainer`.
- Matrix axes for the launch reader: launcher (`node`, `env`, `/usr/bin/env`, `bash`, `sh` or `zsh` with a flag cluster holding `c`), flags before the script, a separator spaced or stuck to a word, and a marker inside a quoted argument.
- Algorithm invariants: `isNoEditRequest` matches every prompt today's pattern matches. `trustedCheckout` runs before the first spawn. A `-z` rename record takes its source path from the next NUL field. The busy carry window is longer than the longest marker. The launch reader calls node wired only when node starts a simple command and its first non-flag argument ends with the marker, and adversarial cases `echo node <marker>`, `echo "x && node <marker>"` and a marker only in a `description` field stay `hook-missing`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup is T001 and T002, both coordinator tasks that record the before numbers and reproductions. Implementation is T003 to T036 in nine parallel worker lanes plus the coordinator's T036. Verification is T037 to T041, run one at a time by the coordinator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each touched test file alone, failing before its change and passing after | `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`, `node --test <file>` |
| Integration | The full advisor suite, the doctor suite, the reader tests, the plugin test, the floors, the deriver check, the mirror check, the route validator and the playbook validator | `VALL`, `DALL`, `VSR`, `VP`, `FLOOR`, `EVAL`, `DERIVE`, `SRM`, `RV`, `PBV` |
| Manual | The 18 planning probes, rerun after the build | `scratch/planning/*`, each run as its first comment line says |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 016 committed | Internal | Yellow until T001 passes | No lane starts, because seven files and the floors move under phase 016 |
| The tsx loader in `.skilled/skills/system-spec-kit/node_modules` | Internal | Green | Four probes cannot load TypeScript sources |
| git with `core.fsmonitor=false` | External | Green | The restore tests and the boundary check cannot run |
| A new package | None | Not needed | Nothing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a floor differs from `before.txt` after T037, a suite fails or the third review pass finds a regression in a lane.
- **Procedure**: revert that lane's commit with `git revert <sha>` and rebuild with `npm run build` in `ADV`. Lanes own disjoint files, so one lane reverts alone. No lane writes data outside the repository.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001, T002) ──► Implementation (WG1 to WG9 in parallel, T036) ──► Verification (T037 to T041)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 016 committed | Every lane |
| Implementation | T001 and T002 | Verification |
| Verification | Every lane and T036 ended | The third review pass |
<!-- /ANCHOR:phase-deps -->

---
