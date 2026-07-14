---
title: "Feature Specification: Phase 071 verifier remediation"
description: "Remediate the independent verifier findings for Phase 071 while keeping stack-specific authored content owned by sk-code."
trigger_phrases:
  - "phase 071 remediation"
  - "stack agnostic cleanup verifier"
  - "001-remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation"
    last_updated_at: "2026-05-05T19:53:46Z"
    last_updated_by: "cli-codex"
    recent_action: "Created remediation plan"
    next_safe_action: "Apply V-001 through V-007 fixes and verify gates"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skills/mcp-code-mode/references/workflows.md"
      - ".opencode/skills/cli-opencode/README.md"
      - ".opencode/skills/cli-opencode/references/opencode_tools.md"
    session_dedup:
      fingerprint: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      session_id: "phase-071-001-remediation"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Gate 3 was pre-approved by the user for specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 071 Verifier Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Parent Packet** | `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup` |
| **Child Packet** | `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The independent verifier for Phase 071 found nine remaining issues after the stack-agnostic cleanup. Five are P0 blockers in non-sk-code authored content, one is a P1 semantic mismatch, and three are P2 documentation or scope-handling items.

### Purpose

Close the actionable verifier findings while preserving the rule that sk-code remains the source of truth for stack-specific content and all other skills stay surface-agnostic.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix V-001 through V-007 in the exact affected non-sk-code files and matching advisor dist mirrors.
- Document V-008 and V-009 as accepted out-of-scope or expected-aggregation decisions.
- Add this Level 2 child packet and register it in the parent `children_ids`.
- Run the requested grep, routing, compiler, strict validation, and sk-code untouched gates.

### Out of Scope

- Modifying `.opencode/skills/sk-code/`, because sk-code is the approved owner for stack-specific metadata.
- Modifying changelog files or test fixtures, per user instruction.
- Repairing the `specs/skilled-agent-orchestration` parent metadata validation failure, because V-008 is explicitly outside 071 scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation/*` | Create | Child packet docs and metadata |
| `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/graph-metadata.json` | Modify | Add `001-remediation` to `children_ids` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modify | Replace library-specific canonical asset default with generic placeholder |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Modify | Remove stack-specific explicit routing terms and comments |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | Modify | Replace stack-specific lexical hints with surface-agnostic hints |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify | Replace stack-specific route keywords, comments, and phrases |
| `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/lib/scorer/lanes/explicit.js` | Modify | Mirror explicit lane changes |
| `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/lib/scorer/lanes/lexical.js` | Modify | Mirror lexical lane changes |
| `.opencode/skills/system-spec-kit/scripts/.folder-list.txt` | Modify | Neutralize real-client scan artifact paths |
| `.opencode/skills/system-spec-kit/scripts/.scan-lines.txt` | Modify | Neutralize real-client scan artifact paths |
| `.opencode/skills/mcp-code-mode/references/workflows.md` | Modify | Replace real-client expected log line |
| `.opencode/skills/cli-opencode/README.md` | Modify | Replace local workspace paths with placeholders |
| `.opencode/skills/cli-opencode/references/opencode_tools.md` | Modify | Replace local workspace paths with placeholders |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/002-myservice-list-sites.md` | Modify | Align MyService tool name |
| `.opencode/skills/mcp-chrome-devtools/examples/README.md` | Modify | Remove stale sk-code reference links |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove V-001 library-specific executable default from mcp-coco-index | `settings.py` no longer contains `motion_dev` or `motion.dev`; targeted tests or syntax checks pass |
| REQ-002 | Remove V-002 stack-specific advisor scoring rules | Source and dist mirrors no longer hardcode `webflow`, `WEBFLOW`, or stack-library route boosts outside sk-code |
| REQ-003 | Neutralize V-003 tracked scan artifacts | `.folder-list.txt` and `.scan-lines.txt` no longer contain `anobel` variants |
| REQ-004 | Replace V-004 real-client log text | `workflows.md` no longer contains `nobel` variants |
| REQ-005 | Replace V-005 hardcoded local cli-opencode paths | cli-opencode docs no longer contain `/Users/michelkerkmeester/...` examples |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Align V-006 MyService tool naming | The manual test uses `myservice.myservice_sites_list()` consistently |

### P2 - Documentation and hygiene

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Remove V-007 dead links | mcp-chrome-devtools examples no longer link to missing sk-code reference paths |
| REQ-008 | Document V-008 parent metadata scope | ADR-002 records separate parent-metadata-repair packet scope |
| REQ-009 | Document V-009 compiled graph aggregation | ADR-003 records sk-code-derived compiled graph content as expected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: V-001 through V-007 have concrete file diffs and no remaining matching lines in the edited files.
- **SC-002**: V-008 and V-009 are documented in `decision-record.md` as requested.
- **SC-003**: The 8-prompt routing regression suite returns the expected skill for all eight prompts.
- **SC-004**: Compiler validation and child strict validation pass.
- **SC-005**: `git diff --name-only .opencode/skills/sk-code/` is empty.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Advisor routing could regress after removing explicit stack tokens | P0 if 8-prompt suite fails | Keep generic `frontend` and system-code terms, then run the suite |
| Risk | Broad grep gates may catch generated or vendored false positives | Verification may need documented residuals | Report exact counts and classify out-of-scope/generated hits honestly |
| Dependency | Existing dirty worktree | Could obscure ownership | Only modify allowed paths and preserve existing edits in touched files |
| Dependency | Parent metadata validation failure | Parent strict validation may fail | Document V-008 as out of 071 scope and report parent exit code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Non-sk-code advisor rules remain surface-agnostic and do not encode named product stacks.
- **NFR-M02**: Placeholder paths use `$REPO_ROOT`, `/path/to/repo`, or `<workspace-root>`.

### Reliability

- **NFR-R01**: Dist mirrors remain synchronized with TypeScript source edits for the advisor lanes.
- **NFR-R02**: Verification commands are recorded with pass/fail output rather than inferred.

### Safety

- **NFR-S01**: No sk-code files are modified.
- **NFR-S02**: No changelog or test fixture files are modified.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Generated and Aggregated Content

- Compiled advisor graph content may include sk-code metadata. ADR-003 handles the expected aggregation case.
- Tracked scan artifacts are historical outputs. ADR-001 records the decision to neutralize them in place instead of deleting them.

### Verification Residuals

- Broad recursive grep commands can match vendored package files or checksum strings. Any residuals must be reported with counts and scope notes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple skills plus spec metadata, but all edits are narrow |
| Risk | 16/25 | Advisor scoring changes need regression verification |
| Research | 8/20 | Exact verifier findings provide file and line anchors |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The user pre-approved the parent packet and the child remediation folder.
<!-- /ANCHOR:questions -->
