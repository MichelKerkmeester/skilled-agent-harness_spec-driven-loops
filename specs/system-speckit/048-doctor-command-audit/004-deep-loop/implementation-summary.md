---
title: "Implementation Summary"
description: "The /doctor:speckit deep-loop target keeps its route and now names the live status, query and convergence scripts, the current runtime script interface and the real packet-local state-log path, while the runtime's non-read-only database access is recorded as a finding."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/004-deep-loop"
    last_updated_at: "2026-10-02T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Closed the deep-loop doctor audit with a fix verdict"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-deep-loop.yaml"
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-speckit-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
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
| **Spec Folder** | 004-deep-loop |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: fix.** `/doctor:speckit deep-loop` keeps its route: its workflow, route entry and presentation text now name the commands and paths that exist on this checkout, while the runtime defects the audit found are recorded rather than changed.

### Phase 4: deep-loop

The audit read the route, the workflow and the presentation in full, probed every named path, script, flag, database and environment variable, and kept the safe run receipts in `scratch/doctor-run.log`. It found the workflow still calling the retired `deep_loop_graph_status`, `deep_loop_graph_query` and `deep_loop_graph_convergence` tool names even though the route declares no MCP tools and the runtime documents those names as direct CLI entrypoints. It found the coverage database absent, the workflow's read-only claim out of step with the scripts' real write behavior, three stale local-contract references, and a state-log command that did not match the routed syntax.

The fix keeps the route and corrects the contract: the graph checks now call `status.cjs`, `query.cjs` and `convergence.cjs`; the upstream contract points at the runtime script interface; the write boundary states that the workflow itself writes only the packet-local state log while the called status and convergence scripts may create a missing coverage database and append observability events; the state-log path and command match the route; and the menu, symptom help and manifest text now include the council graph, with a new Deep-Loop Scope prompt.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` | Modified | Retired graph tool names replaced by the live script calls; stale local contract files replaced by the runtime script interface; the absent `validate_targets` helper name removed; state-log path and command corrected; the write boundary reworded to state the packet-local state log and the called scripts' database initialization and observability appends; the forbidden `doctor-*.yaml` glob fixed |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The deep-loop gate location now points at the active spec folder's scratch directory, the query invocation gains `--limit 50`, and the convergence invocation gains `--iteration` and `--persist-snapshot false` |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | The deep-loop menu, symptom help and manifest row now include the council graph, and the Deep-Loop Scope prompt was added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit ran first: line-numbered source reads, an inventory of every named path and command, and safe probes that stopped before any database open, all kept in `scratch/`. The verdict and the minimal edits were written in `scratch/proposal.md`. The edits were then applied in one batch with the other `/doctor:speckit` targets by GPT-6 Luna through `cli-codex` (max, fast), because those targets share `_routes.yaml`, `speckit.md` and the presentation file. The orchestrator reviewed the diff and ran the post-change gates: `route-validate.sh` exits 0 with 9 routes and 2 warnings; every doctor asset YAML parses; the command catalog mirror reports `STATUS=OK`; the mutation-class guard reports `GUARD PASS`; and the `skill-advisor-route-contract` test passes. The three `parent-skill-check-*.test.cjs` files still fail exactly as they did before the batch because their temporary fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree — a baseline, not a regression. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the route and correct its contract instead of retiring it | The route lists live scripts and passes its own validator; the defect was stale text, not a dead target |
| Replace the retired graph tool names with direct script calls | The route declares `mcp_tools: []`, and the runtime documentation maps those names to `status.cjs`, `query.cjs` and `convergence.cjs` |
| Point the upstream contract at the runtime script interface instead of the absent local files | `spec.md`, `decision-record.md`, `checklist.md` and `deep-loop.md` do not exist in the searched doctor, runtime and packet surfaces |
| Do not add a read-only flag to the runtime scripts | The orchestrator recorded it as a finding because it changes the inspected subsystem, which this phase must not modify |
| State the scripts' real write behavior instead of claiming read-only | Status and convergence append observability events, and the coverage and council getters can initialize storage and schema |
| Record subsystem defects as findings rather than fixing them | The packet's directive keeps changes to the inspected subsystem out of the audit phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 — `OK: route-validate — 9 routes validated, 2 warnings`; `I1` script resolution and `J1` route/presentation parity PASS; `--scope` and `--dir` warnings are informational |
| `python3 yaml.safe_load` on `doctor-deep-loop.yaml` and `_routes.yaml` | `YAML_OK` for both |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK`, exit 0 — every catalog and hub metadata covers the command tree |
| `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | `GUARD PASS`, exit 0 — read-only doctors carry no unguarded mutation or network call |
| `node .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | Pass — fail 0, cancelled 0, skipped 0 |
| `node .skilled/commands/doctor/scripts/tests/parent-skill-check-*.test.cjs` | Fail exactly as the pre-batch baseline — the temporary fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree; not a regression |
| `rg -n 'deep_loop_graph_status\(|deep_loop_graph_query\(|deep_loop_graph_convergence\(' .skilled/commands/doctor` | No matches in the edited deep-loop files; the retired names survive only in `doctor-update.yaml`, outside this target |
| Safe probes in `scratch/doctor-run.log` | Three `INPUT_VALIDATION` exits (code 3) on an invalid loop type, stopping before any database open; council replay `--dry-run` exits 1 on the missing state file; three `NOT RUN` entries record the skipped normal calls and report phase |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/004-deep-loop --strict` | `RESULT: PASSED` — see the run recorded in the goal log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Finding, not fixed: the runtime's database access is not read-only.** Coverage `getDb()` can create the directory, open the database, apply schema and update the schema version; coverage query functions call it; the council getter initializes its database and schema; and status and convergence append observability events. The proposal's `--read-only` flag edit was not applied because it changes the inspected subsystem.
2. **Finding, not fixed: no read-only or dry-run flag exists on `status.cjs`, `query.cjs` or `convergence.cjs`.** The `rg` search returned no matches, so a doctor run cannot promise it leaves no runtime state behind.
3. **The coverage database is absent in this checkout.** `deep-loop-graph.sqlite` was not listed, and no pre-doctor backup file exists. The council database file is present, but its SQLite contents remain unknown because the read-only `sqlite3` probe failed to open it with `Parse error in 3rd command line argument: unable to open database file (14)`. The packet's source folders (`research/iterations`, `review/iterations`, `ai-council`) do not exist and the source-file globs found no matches; these are checkout observations, not proof of a defect in graph contents.
4. **The valid read-only runtime path is unverified.** The CLI probes used an invalid loop type, so each stopped at `INPUT_VALIDATION` before opening a database; the normal status, query and convergence calls were deliberately not run because they would write outside the authorized files.
5. **The interactive report phase was not entered.** It would create another `doctor-deep-loop-state.<timestamp>.json` under scratch, and the audit was authorized to write only its three named artifacts.
6. **The route validator warnings are informational.** `--scope` collides with the skill-advisor target and `--dir` with fable-mode; both are allowed by the validator.
7. **Three doctor script tests fail on fixtures, unchanged by this batch.** The `parent-skill-check-*.test.cjs` files cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree and fail exactly as the pre-batch baseline did.

**Follow-up status.** Items 1, 2 and 4 are resolved by `specs/system-deep-loop/038-review-and-cli-lineage/004-read-only-and-research-bookkeeping`: status, query and convergence take `--read-only`, the database opens are read-only, and read-only probes against the repository database left it byte-identical. Item 7 is resolved by `specs/system-speckit/049-doctor-audit-followups` phase 003. Items 3, 5 and 6 are observations, not defects.
<!-- /ANCHOR:limitations -->

---
