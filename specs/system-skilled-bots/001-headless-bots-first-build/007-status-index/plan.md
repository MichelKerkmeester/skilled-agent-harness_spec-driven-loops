---
title: "Implementation Plan: Phase 7: status-index"
description: "Builds a SQLite status index under the state root from the run records, and a bots status command that merges it with launchctl print. Retention, relink and row states are tested with fixtures."
trigger_phrases:
  - "status index plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: status-index

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript run through tsx, as the deep-loop runtime does |
| **Framework** | None. Node built-ins plus one SQLite binding |
| **Storage** | SQLite in WAL mode under the user-level `<state root>/` (research.md §11, §12). Binding per ADR-001, recommended `better-sqlite3`. Run folders live in the resolved Skilled tree under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/` (operator decision) |
| **Testing** | vitest, as the deep-loop runtime tests do (`*.vitest.ts`) |

### Overview
Three new modules under the hub's `runtime/lib/`: the index, the status merge and a `launchctl print` parser. The index is built from run records only, and status reads only the index and launchd. Fixtures prove rebuild parity, the stale flag, every row state and the retention bound.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified. Phases 3 and 6 are complete, checked by their `acceptance-criteria.md` closure lines

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The hub's vitest run over `status-index.vitest.ts` and `status.vitest.ts` exits 0 with no skipped test
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Derived read index.

### Key Components
- **`status-index.ts`**: owns the SQLite file. Opens it with the pragmas, upserts a summary row per run and per needs-you item, writes `builtAt`, rebuilds and applies retention. A rebuild reads the run records under `<state root>/<identity>/records/` and the needs-you items, never the run folders, so it keeps the rows whose run folder is gone. Run folder pruning is limited to the identity's runs folder in the Skilled tree. Without it, status must read run folders, which research.md §12 rules out.
- **`launchctl-print.ts`**: runs `launchctl print gui/<uid>/<label>` and returns state, run count and last exit code. Without it, installed-but-never-run and launchd-failed bots are invisible. `man launchctl` says `print` output is not API, so the parser is best-effort and tolerant. It skips lines it does not know, and when a field does not parse it returns `unknown` for that field. Status then shows the explicit launchd state `unknown` on the row and never guesses `ok` or `launchd-failed`.
- **`status.ts`**: joins index rows with launchd results per label, assigns row states (`ok`, `never-run`, `launchd-failed`, `missing`, `unreadable`, `retired`, `run-folder-gone`, `needs-you`, `expired`, `held` for a bot with an open needs-you item, and `unknown` when the `launchctl print` output does not parse), sets the `needs-reinstall` flag from phase 6's install record, relinks by identity and handles unregister.

### Data Flow
The runner from phase 3 finishes a run and writes its run folder under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/` in the resolved Skilled tree. The runner then writes the generation stamp under the user-level `<state root>/<identity>/` (ADR-004). When a run parks, it writes a needs-you item under `<state root>/<identity>/needs-you/` and bumps the same stamp. The runner, or a rebuild, upserts one summary row into the index and stores the stamp it consumed. `bots status` reads the index, lists the hub labels, calls `launchctl print` per label, checks each last known path for present, missing or unreadable, checks that each run folder path still exists, compares each install record's runner path with its recorded real path, and prints the merged rows with open needs-you items as their own rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This phase adds new modules and fixes no reported finding. The only shared surface it reads is phase 3's run record and phase 6's plists, and it writes neither.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms phases 3 and 6 are closed, settles ADR-001 and ADR-002 and adds the binding. Implementation builds the index, the `launchctl print` parser, the status merge and the CLI verb. Verification runs the fixtures for rebuild parity, staleness, row states and retention.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Index build, rebuild, pragmas, retention, terminal row immutability, `launchctl print` parser on captured output and on truncated or reordered output, which must yield `unknown` | vitest |
| Integration | `bots status` over a temp state root with fixture run records and a stubbed `launchctl` | vitest with a temp `XDG_STATE_HOME` |
| Manual | One real disabled label from phase 6, then `bots status` on the operator's Mac | Terminal |

The rebuild parity test is the key one: build, snapshot the rows, delete the file, rebuild, compare. It fails if status ever depends on state that only lives in the index.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-manual-runner` run records, evidence pointers and the ADR-004 generation stamp | Internal | Red (not built, stamp not yet in phase 3's spec) | Nothing to index. Without the stamp, status cannot flag a stale index |
| `006-launchd-installer` hub-labeled plists in `~/Library/LaunchAgents` | Internal | Red (not built) | Never-run and launchd-failed rows cannot be shown |
| `001-contracts-and-state-root` identity, registered roots and state-root layout | Internal | Red (not built) | The index key is undefined |
| `003-manual-runner` needs-you items and the stamp bump on item writes | Internal | Red (not built) | No needs-you rows, or rows that lag until a rebuild |
| `006-launchd-installer` install record with the resolved runner path and `.skilled` kind | Internal | Red (not built) | No `needs-reinstall` flag |
| `better-sqlite3` ^12.11.1, already a deep-loop runtime dependency | External | Green | Fall back to ADR-001's built-in option |
| `.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs` | Internal | Green (exists) | Relink by identity has no resolver |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `bots status` reports wrong rows, the binding breaks another runtime, or retention deletes a non-terminal row.
- **Procedure**: Revert this phase's commit. Then delete the index file under the state root. Nothing else holds index state, and run records and plists are untouched, so the revert loses nothing a rebuild cannot restore.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001, 003 and 006 closed | Implementation |
| Implementation | Setup, ADR-001 and ADR-002 decided | Verification |
| Verification | Implementation | Phase 008-hub-wiring |
<!-- /ANCHOR:phase-deps -->

---
