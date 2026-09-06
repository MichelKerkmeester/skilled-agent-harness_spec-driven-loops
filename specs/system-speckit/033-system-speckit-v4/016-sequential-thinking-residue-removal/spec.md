---
title: "Feature Specification: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue"
description: "The doctor command family still probes, reports on, and offers to reinstall the Sequential Thinking MCP server that was decommissioned in commit 7673da6bc24, and specs/sk-doc carries an empty false-start packet directory."
trigger_phrases:
  - "sequential thinking residue removal"
  - "decommissioned server residue"
  - "sequential thinking doctor"
  - "mcp doctor stale server"
  - "spec residue cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 16 of 24 |
| **Predecessor** | `../015-apply-path-and-candidate-filter-fixes/spec.md` |
| **Successor** | `../017-memory-database-decommission/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Commit `7673da6bc24` decommissioned the Sequential Thinking MCP server: it deleted the install guide, deleted the installer script, and unregistered the server from `opencode.json`. It did not touch `.opencode/commands/doctor/`. The doctor family therefore still carried a full server definition for it — a live `npx` probe, a repair action that reinstalls the package, four report table rows, and a config-wiring check that flagged the deliberate absence as a warning. Running `/doctor:mcp install` would have reinstalled a server the repository had decided to remove.

Separately, `specs/sk-doc/` accumulated two pieces of stale state after the `4cbff2d4b6` renumber: an empty `039-create-repo-rules/` directory left behind when the packet moved to `040`, and 17 `children_ids` entries in the track-level `graph-metadata.json` that point at folders which no longer exist.

### Purpose

The doctor tooling stops treating a decommissioned server as installable, and `specs/sk-doc` loses the false-start directory — while the track index is left alone for a documented reason rather than repaired by hand.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Remove every Sequential Thinking definition, probe, repair action and report row from `.opencode/commands/doctor/`.
- Remove the empty `specs/sk-doc/039-create-repo-rules/` directory.
- Reach and record an evidenced decision on the 17 dangling `children_ids` entries in `specs/sk-doc/graph-metadata.json`.

### Out of Scope

- Changelogs, benchmark reports and decision records naming the server — they are historical records, and editing them would falsify what happened.
- `.opencode/scripts/session-cleanup.sh` and `.opencode/scripts/orphan-mcp-sweeper.sh` — they match a process command line to reap an orphan, and the package is still present in the local npx cache, so the orphan they guard against remains possible.
- `.opencode/hooks/mcp-route-guard/` — its token list *suppresses* a routing nudge, so removing the token would enable a nudge for a nonexistent tool and break two test assertions.
- `.opencode/skills/system-deep-loop/deep-ai-council/` — its Depth-1 dependency on the server is real, not incidental, and needs a replacement mechanism rather than a text deletion. Recorded as a finding, not fixed here.
- `AGENTS.md` — excluded by operator instruction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modify | Drop `diagnose_sequential_thinking()`, its dispatch line, the config-wiring array entry and three help-text references |
| `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` | Modify | Drop the server definition, two install-guide pointers, two report rows; retarget the `npx` prerequisite |
| `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml` | Modify | Drop the repair-action block, two install-guide pointers, one report row; repair the invariant sentence |
| `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt` | Modify | Drop four report table rows |
| `specs/sk-doc/039-create-repo-rules/` | Delete | Empty, never-tracked, unreferenced false-start directory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No file under `.opencode/commands/doctor/` invokes `@modelcontextprotocol/server-sequential-thinking` |
| REQ-002 | `mcp-doctor.sh` emits no check, warning or report row for `sequential_thinking` |
| REQ-003 | Both doctor YAML assets parse, and their `servers` / `repair_actions` / `install_guides` maps contain only live servers |
| REQ-004 | The established doctor test surface passes after the change, at or above its captured baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `specs/sk-doc/039-create-repo-rules/` is gone, and confirmed empty and unreferenced before removal |
| REQ-006 | The `specs/sk-doc/graph-metadata.json` decision is recorded with independent verification of both operator claims |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "server-sequential-thinking" .opencode/commands/doctor/` returns no matches.
- **SC-002**: `bash mcp-doctor.sh --json` reports zero `sequential_thinking` checks, and its warning count drops from 3 to 1.
- **SC-003**: `route-validate.sh`, its `--self-test` suite, `check-mcp-mutation-class.sh` and both `bash -n` syntax checks all exit 0.
- **SC-004**: `validate.sh specs/system-speckit/033-system-speckit-v4/016-sequential-thinking-residue-removal --strict` returns `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing executable tooling without a test | A silent break in `/doctor:mcp` | Baseline captured before the edit across five checks; all re-run after |
| Risk | Removing a `--server` name callers still pass | Script error on an unknown name | `should_run` filters by string match, so a retired name is inert; verified by running `--server sequential_thinking` after the change |
| Risk | Repairing the sk-doc track index by hand | Re-rots on the next renumber and contradicts a documented design decision | Decision recorded rather than applied; evidence in §2 of `implementation-summary.md` |
| Dependency | Concurrent session writing under `specs/sk-doc/040-create-repo-rules/` | Working-tree noise not attributable to this packet | Scope confined to `039`; the `040` tree and `.opencode/skills/sk-doc/` left untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `mcp-doctor.sh` no longer spends an `npx` package resolution on a retired server — three checks removed from every full run.
- **NFR-P02**: No new subprocess is introduced by the change.

### Security
- **NFR-S01**: The change removes network-reaching `npx -y` invocations; it adds none.
- **NFR-S02**: `check-mcp-mutation-class.sh` still passes, so no read-only doctor route gained an unguarded mutation.

### Reliability
- **NFR-R01**: `mcp-doctor.sh` exit semantics are unchanged; only the inputs to the warning count differ.
- **NFR-R02**: The false-warning rate for config wiring drops to zero — both remaining "not wired" warnings were for the retired server.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: `--server` with no value still errors before dispatch; unchanged.
- Maximum length: not applicable; the server list is a fixed three-element array.
- Invalid format: `--server sequential_thinking` is now an unrecognized name and runs prerequisites plus config wiring only, exiting 0.

### Error Scenarios
- External service failure: no `npx` registry call remains in the retired path, so a network outage can no longer degrade this check.
- Network timeout: same — the only timeout-prone probe in the removed block is gone.
- Concurrent access: a second session was writing under `specs/sk-doc/` throughout; scope was held to `039` and verified against `git status`.

### State Transitions
- Partial completion: each of the four doctor files is independently valid, so a partial application still parses and runs.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 files modified, 1 directory removed, 93 lines deleted |
| Risk | 12/25 | Executable tooling with an install path, but fully covered by an existing test surface |
| Research | 14/20 | Two operator claims required independent verification; one scope assumption was disproved |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does `deep-ai-council` Depth-1 dispatch need a replacement inline mechanism, or should Depth 1 be retired along with the server it depends on? Raised as a finding; not decided here.
- Should the fleet-wide dangling `children_ids` state (8 of 16 track indexes, 81 entries total) be cleared in one gated `--prune` run? Out of scope for this packet.
<!-- /ANCHOR:questions -->

---
