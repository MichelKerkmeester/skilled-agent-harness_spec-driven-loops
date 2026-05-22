---
title: "Verification Checklist: 118/006 — Collateral /doctor + Playbook Update"
description: "P0/P1/P2 verification checklist for the 4-file collateral cutover swapping MCP tool refs for deep-loop-runtime script invocations."
trigger_phrases:
  - "phase 006 checklist"
  - "doctor collateral checklist"
  - "playbook collateral checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded checklist.md"
    next_safe_action: "Mark items [x] post-implementation"
    blockers:
      - "phase 005 must complete first"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180061180061180061180061180061180061180061180061180061180060003"
      session_id: "118-006-checklist-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: 118/006 — Collateral /doctor + Playbook Update

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 005 (YAML workflow update) is merged on main
  - **Evidence**: `git log --oneline | grep '005-yaml-workflow-update'` returns the merge commit
- [ ] CHK-002 [P0] All 4 phase-003 scripts exist at `.opencode/skills/deep-loop-runtime/scripts/*.cjs`
  - **Evidence**: `ls .opencode/skills/deep-loop-runtime/scripts/*.cjs` returns 4 files
- [ ] CHK-003 [P0] `--health-check` JSON stdout shape verified against legacy MCP tool response fixture
  - **Evidence**: diff between fixture and live script output is empty for the response-shape keys

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Zero `mcp__mk_spec_memory__deep_loop_graph_` references remain in any of the 4 collateral files
  - **Evidence**: `grep -c 'mcp__mk_spec_memory__deep_loop_graph_'` returns 0 on each file
- [ ] CHK-011 [P0] `_routes.yaml` parses cleanly after edit
  - **Evidence**: `yq eval '.' .opencode/commands/doctor/_routes.yaml` exits 0 with no parse errors
- [ ] CHK-012 [P0] Frontmatter on the 3 edited .md files parses cleanly
  - **Evidence**: `python3 -c "import yaml,sys; yaml.safe_load(open(p).read().split('---')[1])"` succeeds for each
- [ ] CHK-013 [P1] All script citations use the canonical form `node .opencode/skills/deep-loop-runtime/scripts/<X>.cjs --health-check`
  - **Evidence**: `grep -E 'deep-loop-runtime/scripts/[a-z-]+\.cjs --health-check'` returns consistent matches; no `./` vs absolute drift
- [ ] CHK-014 [P1] `_routes.yaml` mutation-class annotations remain accurate for each updated deep-loop route
  - **Evidence**: each affected route tagged `read-only`/`add-only`/`mutates` consistent with its action

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Manual `/doctor deep-loop` health-check invocation succeeds
  - **Evidence**: command exits 0 with JSON stdout matching legacy response shape
- [ ] CHK-021 [P0] Playbook scenario 009 dispatch line + assertion line are internally consistent
  - **Evidence**: visual review confirms script-path dispatch + JSON-shape assertion line up
- [ ] CHK-022 [P1] No collateral file outside the 4 scope-locked paths was modified
  - **Evidence**: `git diff --stat` shows exactly 4 files changed (the spec-folder scaffolds excluded)
- [ ] CHK-023 [P1] JSON shape of script output is identical to legacy MCP tool response shape (per phase 003 contract)
  - **Evidence**: diff between phase-003 response fixture and live `--health-check` stdout is empty for keys

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding (4 collateral edits) has a finding class: `cross-consumer` (citation swap touches downstream consumers of the legacy tool surface)
  - **Evidence**: each of the 4 file edits is classified in implementation-summary.md
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: `grep -RIl 'mcp__mk_spec_memory__deep_loop_graph_' .` returns exactly the 4 scope-locked files pre-edit and zero files post-edit
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed citations (every file that dispatched the legacy tool IDs)
  - **Evidence**: phase 005 (workflow YAMLs) confirmed clean; phase 007 (tests) confirmed clean post-implementation
- [ ] CHK-FIX-004 [P0] No security/path/parser/redaction surface is touched (citation swap is not a security fix)
  - **Evidence**: diff review — no path manipulation, no input parsing, no auth surface in the 4 files
- [ ] CHK-FIX-005 [P1] Matrix axes listed: {file × call-site × mutation-class} for `_routes.yaml`; 4 rows total
  - **Evidence**: tasks T006-T009 enumerate each row before implementation
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable — collateral edits do not read process-wide state
  - **Evidence**: N/A documented
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA, not a moving branch-relative range
  - **Evidence**: phase commit SHA recorded in implementation-summary.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Script paths are repo-relative; no absolute paths to user home or arbitrary disk locations
  - **Evidence**: all citations start with `.opencode/skills/deep-loop-runtime/scripts/`
- [ ] CHK-031 [P1] No new secrets, tokens, or credentials introduced in any of the 4 collateral files
  - **Evidence**: diff review — no `.env`, no API keys, no tokens

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md` / `plan.md` / `tasks.md` describe the same 4 files and the same canonical script form
  - **Evidence**: all three docs name the 4 files identically and use the canonical citation form
- [ ] CHK-041 [P1] No stale narrative in the 4 collateral files describing the old MCP tool dispatch path as the current path
  - **Evidence**: visual review — historical mentions (if any) are clearly past-tense
- [ ] CHK-042 [P2] 118 phase-parent `spec.md` PHASE DOCUMENTATION MAP row for 006 updated to "Complete" after this phase lands
  - **Evidence**: phase parent spec.md row reads `Complete` for 006

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files created outside `scratch/`
  - **Evidence**: `git status --porcelain` clean outside the 4 collateral files and this spec folder
- [ ] CHK-051 [P1] Spec folder `validate.sh --strict` exits 0
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook --strict` exit code 0

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
**Verified By**: pending

<!-- /ANCHOR:summary -->
