---
title: "Implementation Summary"
description: "The doctor tooling no longer probes or reinstalls the decommissioned Sequential Thinking MCP server, an empty false-start spec directory is gone, and the sk-doc track index was deliberately left alone with the reasoning recorded."
trigger_phrases:
  - "decommissioned server summary"
  - "doctor sequential thinking removal"
  - "sk-doc graph metadata decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-decommissioned-server-residue"
    last_updated_at: "2026-08-31T13:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Removed the retired server from four doctor files and deleted the empty 039 dir"
    next_safe_action: "Operator review and commit; nothing was staged or committed"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
      - ".opencode/commands/doctor/assets/doctor-mcp-install.yaml"
      - ".opencode/commands/doctor/assets/doctor-mcp-debug.yaml"
      - ".opencode/commands/doctor/assets/doctor-mcp-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "048-decommissioned-server-residue"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "deep-ai-council Depth-1 dispatch still instructs use of the retired server inline; needs a replacement mechanism, not a deletion."
    answered_questions:
      - "Should specs/sk-doc/graph-metadata.json be repaired? No — evidenced in section 2 below."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 048-decommissioned-server-residue |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Commit `7673da6bc24` decommissioned the Sequential Thinking MCP server everywhere except the one place that could bring it back. `.opencode/commands/doctor/` still carried a complete server definition, and `/doctor:mcp install` would have run `npx -y @modelcontextprotocol/server-sequential-thinking --help` to "pre-cache" a server the repository had already removed. That is no longer possible. Alongside it, an empty false-start spec directory is gone, and a third item was investigated and deliberately not changed.

### The doctor tooling stops offering a retired server

Four coupled layers each named the server, and removing it from three of them would have left the fourth inconsistent. The shell script owned the probe; the install YAML declared it installable; the debug YAML declared how to repair it; the presentation file supplied its report row. All four are now clean.

The defect was live, not cosmetic. Before the change, a full `mcp-doctor.sh --json` run resolved the package over `npx`, then reported two warnings because the server was "not wired" into `opencode.json` and `.claude/mcp.json` — warning the operator about an absence that was the whole point of the decommission. Those two warnings are gone, and the run's total dropped from three warnings to one. The one that remains is an unrelated pre-existing `system-spec-memory` node-version marker.

The package was found already sitting in the local npx cache at `~/.npm/_npx/a5ef1724d9b0391f/node_modules/@modelcontextprotocol/server-sequential-thinking`, which is physical evidence that this tooling had already fetched it at least once.

### The empty 039 directory is gone

`specs/sk-doc/039-create-repo-rules/` was created at 13:23 and vacated by the 14:03 renumber commit `4cbff2d4b6`, which moved the packet to `040`. It held zero entries including hidden ones, appears nowhere in `git log --all`, and is referenced by nothing in the repository. `rmdir` removed it — and because `rmdir` refuses a non-empty directory, its success is itself the proof that the directory was empty.

### The sk-doc track index was left alone, on purpose

This is documented in full in "Key Decisions" below. Both of the operator's claims held up under independent checking, and a third piece of evidence made the decision clear-cut.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modified | Removed `diagnose_sequential_thinking()` (53 lines with its header and separator), its dispatch line, the config-wiring array entry, and three help-text references |
| `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` | Modified | Removed the server definition, two install-guide pointers and two report rows; retargeted the `npx` prerequisite to its real consumer |
| `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml` | Modified | Removed the repair-action block, two install-guide pointers and one report row; repaired the invariant sentence the edit landed on |
| `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt` | Modified | Removed four report table rows |
| `specs/sk-doc/039-create-repo-rules/` | Deleted | Empty, never-tracked, unreferenced false-start directory |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tooling is executable, so the first move was to find out how it is already tested rather than to assume it is not. `.opencode/commands/doctor/scripts/README.md` §7 names `bash -n` syntax checks, and §4 names `route-validate.sh` plus its negative-fixture `--self-test` suite. Two more checks were found beside them: `check-mcp-mutation-class.sh` and three `scripts/tests/*.test.cjs` suites.

All of it was run before touching anything, and the numbers recorded. That baseline caught something worth knowing: `parent-skill-check-root-router.test.cjs` already exits 1 on a clean tree. Without the baseline, that pre-existing failure would have looked like damage from this change.

A live `mcp-doctor.sh --json` run served as the negative control, and it was safe to run because the package was already cached — no fresh download was triggered to produce it.

The edits were applied by verified line number rather than by pattern substitution, with an assertion on every target line's content before deleting it, so a stale offset would abort rather than silently cut the wrong line. Then the entire baseline set was re-run and compared.

| Check | Before | After |
|-------|--------|-------|
| `bash -n` (both scripts) | exit 0 | exit 0 |
| `route-validate.sh` | exit 0, 10 routes, 2 warnings | exit 0, 10 routes, 2 warnings |
| `route-validate.sh --self-test` | exit 0, 6 fixtures rejected | exit 0, 6 fixtures rejected |
| `check-mcp-mutation-class.sh` | exit 0 | exit 0 |
| `parent-skill-check-leaf-manifest.test.cjs` | exit 0 | exit 0 |
| `parent-skill-check-root-router.test.cjs` | exit 1 (pre-existing) | exit 1 (unchanged) |
| `skill-advisor-route-contract.test.cjs` | exit 0 | exit 0 |
| `mcp-doctor.sh --json` | 40 checks, 36 pass, 3 warn | 35 checks, 33 pass, 1 warn |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not repair `specs/sk-doc/graph-metadata.json` | Three independent findings agree. First, the 17 dangling entries are unchanged from `4cbff2d4b6~1`, so they pre-date recent work as claimed. Second, no generator maintains the file: `backfill-graph-metadata.js --spec-folder specs/sk-doc` fails with `target is not a spec folder (missing spec.md)`, because the track root has no `spec.md` and its name does not match the `^\d{3}` packet pattern. Third — and decisive — `check-graph-metadata-child-drift.sh` states in its own header that "a listed entry with no matching folder is left untouched by the writer and is deliberately NOT reported, to avoid flagging drift no refresh would reconcile." The system has already decided this is not a defect. `validate.sh specs/sk-doc --strict` confirms it: `RESULT: PASSED`, 0 errors, 0 warnings. |
| Treat the track index as a fleet-wide matter, not an sk-doc one | sk-doc is not an outlier. Eight of sixteen track indexes carry dangling children — 81 entries in total, with `system-deep-loop` at 24 and `sk-design` at 14 — and fifteen of sixteen are missing on-disk children. Repairing one by hand would create an inconsistency rather than remove one, and it would re-rot at the next renumber. A purpose-built gated path already exists for this: `--prune-report`, review the artifact, then `--prune --prune-confirm <hash>`. That is a fleet operation and its own decision. |
| Retarget the `npx` prerequisite rather than delete it | `prerequisite_matrix` listed `npx` as `required_for: [sequential_thinking]`. Deleting the entry would have dropped a prerequisite that is still genuinely needed — `doctor-mcp-install.yaml:120` uses `npx tsc --build` as the `system-spec-memory` fallback build. The entry now names that real consumer. |
| Repair the debug invariant sentence instead of leaving a fragment | The sentence was already corrupt: it read "against all code-mode, sequential-thinking), cross-reference", with a stray closing parenthesis and a missing list opening. Removing only the server name would have left "against all code-mode)," which is worse. The line was rewritten to name the three live servers, restoring the parenthetical the stray `)` proves was intended. |
| Leave the cleanup scripts and the route guard alone | The cleanup scripts match a process command line to reap an orphan. They cost nothing when no such process exists, and the package is still in the npx cache, so the orphan they guard against is still possible. The route guard is a stronger case: its token list *suppresses* a Code Mode routing nudge, so removing the token would enable a nudge for a tool that does not exist, and would break two assertions in `mcp-route-guard.test.cjs` at lines 102 and 152. Removing either would be a regression, not a cleanup. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n "server-sequential-thinking" .opencode/commands/doctor/` | PASS — 6 matches before, 0 after |
| `rg -ni "sequential" .opencode/commands/doctor/` | PASS — 10 residual matches, all `workflow: sequential*` shape descriptors, semantically unrelated |
| `bash -n` on `mcp-doctor.sh` and `mcp-doctor-lib.sh` | PASS — exit 0 both |
| `route-validate.sh` | PASS — exit 0, 10 routes, 2 warnings, identical to baseline |
| `route-validate.sh --self-test` | PASS — exit 0, all 6 negative fixtures still rejected |
| `check-mcp-mutation-class.sh` | PASS — exit 0, guard clean |
| `scripts/tests/*.test.cjs` | PASS — 0 / 1 / 0 exit codes, identical to baseline |
| `mcp-doctor.sh --json` full run | PASS — 35 checks, 1 warning, 0 sequential entries (was 40 / 3 / 5) |
| `mcp-doctor.sh --server sequential_thinking` | PASS — inert, `status: healthy`, exit 0, no `npx` probe |
| `specs/sk-doc/039-create-repo-rules` removal | PASS — `rmdir` succeeded, path absent, no empty dirs remain under `specs/sk-doc` |
| `validate.sh 048-decommissioned-server-residue --strict` | PASS — see the packet's first `RESULT:` line |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`deep-ai-council` still depends on the retired server at Depth 1.** This contradicts the scope note that the council's "parallel vs sequential" language is only a dispatch concept. It is that in most places, but `references/convergence/depth-dispatch.md:45` states that at Depth 1 the council "must process seats sequentially through `sequential_thinking` MCP inline", with line 188 instructing "Use `sequential_thinking` MCP inline" and line 233 routing "YES (Depth 1) -> sequential_thinking MCP". The documented Depth-1 execution path names a server that exists in no runtime config. Deleting the text would leave Depth 1 with no mechanism, so this needs a design decision and was left untouched.
2. **The fleet-wide track-index staleness is unaddressed.** 81 dangling and roughly 150 missing `children_ids` entries across the tracks, plus a zero-byte `specs/anobel.com/graph-metadata.json` that fails to parse. Out of scope here.
3. **`mcp-doctor.sh` still scans `.vscode/mcp.json`, which does not exist**, and both doctor YAML files still define a "System Code Graph" server that is in no runtime config. Neither is sequential-thinking residue, so neither was touched.
4. **`doctor-mcp-install.yaml` has a pre-existing YAML defect.** The "System Code Graph" block at line 139 lost its own key, so its values silently overwrite `system_skill_advisor`'s — the advisor's real label, entry point and five health checks are clobbered on parse. `doctor-mcp-debug.yaml` has a matching duplicate-key defect in its `repair_actions` block. Both pre-date this work and are outside its scope, but they mean the install workflow currently probes the wrong path for the Skill Advisor.
<!-- /ANCHOR:limitations -->

---
