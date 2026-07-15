---
title: "Implementation Plan: Doctor Cutover Phase 2 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files/plan]"
description: "Step-by-step plan for hard deleting legacy doctor commands, rewriting playbook and harness invocations, refreshing advisor indices, and validating the final 10 to 3 command state."
trigger_phrases:
  - "013/005 cutover phase plan"
  - "doctor hard cutover plan"
  - "delete legacy doctor commands plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files"
    last_updated_at: "2026-05-11T17:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 2 cutover shipped + verified"
    next_safe_action: "Optional: commit + advisor reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-002-cutover-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Doctor Cutover Phase 2 (Hard Cutover)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase 2 converts the additive Phase 1 rollout into the final production state. The work is intentionally mechanical: delete legacy command entrypoints, rewrite old invocation strings to the new router syntax, refresh advisor indices, and run strict verification. The main design choice is restraint: do not regenerate playbooks, rewrite shipped router files, or preserve aliases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phase 1 static verification, `route-validate.sh`, and `route-validate.sh --self-test` passed.
- 013 parent points at `004-cutover-doctor-router-from-legacy-files` as the active child.
- This Level 2 packet passes strict validation before destructive deletes begin.

### Definition of Done

- Legacy `.opencode` and `.gemini` command files are physically removed.
- Playbook, sandbox, and historical references no longer contain stale `/doctor:<old-name>` invocations.
- Advisor indexing is refreshed after delete and rewrite steps.
- File count gates, grep gate, route validator, shell syntax checks, and strict spec validation all pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```text
Phase 1 final files:
  .opencode/commands/doctor.md
  .opencode/commands/doctor/mcp.md
  .opencode/commands/doctor/update.md
  .opencode/commands/doctor/_routes.yaml
  .opencode/commands/doctor/assets/*.yaml

Phase 2 removes:
  .opencode/commands/doctor/{memory,causal-graph,code-graph,deep-loop,cocoindex,skill-advisor,skill-budget,mcp_debug,mcp_install}.md
  .gemini/commands/doctor/{memory,causal-graph,code-graph,deep-loop,cocoindex,skill-advisor,skill-budget,mcp_debug,mcp_install}.toml

References become:
  /doctor:<target>        -> /doctor <target>
  /doctor:mcp_debug      -> /doctor:mcp debug
  /doctor:mcp_install    -> /doctor:mcp install
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Delete legacy `.opencode` markdown files

Remove exactly 9 old files from `.opencode/commands/doctor/`: `causal-graph.md`, `cocoindex.md`, `code-graph.md`, `deep-loop.md`, `memory.md`, `skill-advisor.md`, `skill-budget.md`, `mcp_debug.md`, `mcp_install.md`. Verify only `mcp.md` and `update.md` remain under that directory.

### Step 2: Delete legacy `.gemini` TOML files

Remove the same 9 names with `.toml` extension under `.gemini/commands/doctor/`. Preserve `mcp.toml` and `update.toml` when present.

### Step 3: Sed pass on 23 manual playbook scenarios

Apply exact substitutions in `.opencode/specs/system-spec-kit/manual_testing_playbook/doctor-commands/*.md`:

- `/doctor:mcp_debug` -> `/doctor:mcp debug`
- `/doctor:mcp_install` -> `/doctor:mcp install`
- `/doctor:memory` -> `/doctor memory`
- `/doctor:causal-graph` -> `/doctor causal-graph`
- `/doctor:code-graph` -> `/doctor code-graph`
- `/doctor:deep-loop` -> `/doctor deep-loop`
- `/doctor:cocoindex` -> `/doctor cocoindex`
- `/doctor:skill-advisor` -> `/doctor skill-advisor`
- `/doctor:skill-budget` -> `/doctor skill-budget`

### Step 4: Sed pass on sandbox wrappers and harness

Apply the same substitutions to `.sh` files under `_sandbox/doctor-commands/`, then run `bash -n` for every shell file.

### Step 5: Cross-reference audit of `doctor_update.yaml`

Audit `.opencode/commands/doctor/assets/doctor_update.yaml` for user-facing legacy invocation strings. If stale invocation examples exist and asset edits are allowed by the active task contract, rewrite only the command text to router form; do not change orchestrator behavior.

### Step 6: Historical-record updates in 013 specs

In the three selected 013 spec docs, update old invocation examples and add one concise `Superseded By` metadata row. Preserve archival requirements and decisions.

### Step 7: Advisor rebuild

Run the advisor rebuild after deletes and sed passes so command-description scoring stops seeing deleted legacy command surfaces.

### Step 8: Context generation

Run canonical context generation for the 002 packet and refresh parent metadata if needed.

### Step 9: Final verification

Run strict validation on 013 parent, 003-skill-advisor-routing-engine-consolidation, and 004-cutover-doctor-router-from-legacy-files; rerun route validation; verify file counts; run the case-insensitive stale invocation grep; run sandbox shell syntax checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command / Method | Expected |
|------|------------------|----------|
| Route manifest | `bash .opencode/commands/doctor/scripts/route-validate.sh` | Exit 0, 7 routes |
| Spec validation | `validate.sh <packet> --strict` | Errors 0, warnings 0 |
| Markdown count | `find .opencode/commands/doctor -maxdepth 1 -type f -name "*.md"` | 2 files |
| Top router count | `find .opencode/commands -maxdepth 1 -name "doctor.md"` | 1 file |
| YAML count | `find .opencode/commands/doctor/assets -name "*.yaml" | wc -l` | 10 |
| Grep gate | case-insensitive stale `/doctor:<old-name>` search | zero non-archival matches |
| Sandbox shell | `bash -n` each `.sh` | all pass |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1 router files must remain untouched and valid.
- `_routes.yaml` remains the canonical route manifest.
- `.claude` auto-sync and `.codex` symlink behavior determine mirror handling.
- macOS sed requires `sed -i ''` when in-place sed is used.
- Advisor rebuild tooling must be available after filesystem changes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback requires restoring deleted legacy command files from git and reversing invocation rewrites. Because hard cutover is the selected strategy, rollback is a contingency only; it is not implemented via shim files or local backups.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Phase 2 depends on 003-skill-advisor-routing-engine-consolidation being validated. It closes the 013 phase parent and has no successor phase planned.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Workstream | Estimate |
|------------|----------|
| Deletes and mirror verification | 10-15 min |
| Playbook and harness substitutions | 15-25 min |
| Historical annotations | 10-15 min |
| Advisor/context refresh | 10-20 min |
| Final validation | 15-25 min |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

No `.bak`, `.old`, `_archive`, or shim files are created. Recovery uses source control, the route validator output, and this packet's inventory report as the audit trail.
<!-- /ANCHOR:enhanced-rollback -->
