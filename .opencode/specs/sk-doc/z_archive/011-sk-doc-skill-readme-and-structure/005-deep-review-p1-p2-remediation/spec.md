---
title: "Feature Specification: deep-review P1+P2 remediation"
description: "Resolve the 7 P1 and 9 P2 findings from the 102 phase-parent deep-review."
trigger_phrases:
  - "102 p1 p2 remediation"
  - "deep-review remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/005-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-11T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-005-deep-review-p1-p2-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: deep-review P1+P2 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Active |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-sk-doc-playbook-markdown-agent-coverage |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 102 phase-parent deep-review (5 iterations, converged at iter 4) returned verdict CONDITIONAL with 0 P0, 7 P1, and 9 P2 findings. None are security or correctness blockers — they are documentation hygiene and structural-consistency gaps. The packet cannot be marked Complete until P1s are resolved.

### Purpose
Close every P1 and P2 finding from the dashboard, document SD-019 cli-codex `@markdown` dispatch as an accepted limitation (resolving the only open question), update all child phase metadata to reflect 5-phase numbering, and add a parent-level Known Issues register.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sync stale status fields across `102/spec.md` and `004/spec.md`.
- Add Phase 1→2 handoff acceptance evidence to `002/checklist.md` CHK-003.
- Update `102/spec.md` 003→004 handoff row with SD-019 dispatch-gap note.
- Mark Phase 4 checklist items with evidence references.
- Fix `002/checklist.md` frontmatter `completion_pct` 0 → 100.
- Add Known Issues register to `102/spec.md` referencing F-001 / F-002 / F-003 plus the new review IDs.
- Cross-reference Phase 3's prior deep-review in `102/spec.md`.
- Update SD-019 scenario frontmatter with `expected_skip_in_non_interactive: true` and rationale.
- Update child specs "N of 3" or "N of 4" → "N of 5" in metadata tables.
- Close `004/implementation-summary.md` open_questions; bump completion_pct → 100; status Active → Complete.

### Out of Scope
- Fixing the underlying cli-codex `@markdown` dispatch behavior (documented as accepted limitation).
- Re-running the deep-review.
- Touching scenario files SD-018 or SD-020 (PASS verdicts stand).
- Any phase 001/002 implementation work; only their metadata and checklist hygiene.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `102/spec.md` | Modify | Phase 2 status; 003→004 handoff note; new Known Issues section; 003 prior-review cross-ref. |
| `001/spec.md` | Modify | "1 of 3" → "1 of 5". |
| `002/spec.md` | Modify | "2 of 3" → "2 of 5". |
| `002/checklist.md` | Modify | CHK-003 handoff evidence; frontmatter completion_pct 0→100. |
| `003/spec.md` | Modify | "3 of 3" → "3 of 5". |
| `004/spec.md` | Modify | Status Draft→Complete; "4 of 4"→"4 of 5". |
| `004/checklist.md` | Modify | Mark all CHK items with evidence references. |
| `004/implementation-summary.md` | Modify | completion_pct 90→100; close open_questions; status Active→Complete. |
| `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/002-markdown-agent-cli-codex.md` | Modify | Frontmatter `expected_skip_in_non_interactive: true` + rationale. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 P1 findings closed. | Each P1 mapped to a closed edit in implementation-summary.md. |
| REQ-002 | All 9 P2 findings closed or marked accepted-defer. | Same evidence trail. |
| REQ-003 | Strict validate passes on 004 AND 005. | `bash validate.sh --strict` exit 0 on both. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | 004 open_questions empty after remediation. | YAML check on 004/implementation-summary.md. |
| REQ-005 | SD-019 scenario marks expected-skip-in-non-interactive. | grep returns 1 hit. |
| REQ-006 | Parent spec has Known Issues section. | grep "## Known Issues" returns 1 hit; F-001/F-002/F-003 referenced. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 0 stale "Draft" status fields remain across the 102 packet for shipped/complete work.
- **SC-002**: Every child phase shows correct "N of 5" numbering.
- **SC-003**: Parent spec's Known Issues section enumerates F-001/F-002/F-003 + new review IDs.
- **SC-004**: SD-019 scenario explicitly marks itself non-interactive-skip with rationale.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-codex sandbox blocks sub-process network | Edits fail if codex tries to reach embeddings | Pass `-c sandbox_workspace_write.network_access=true`. |
| Risk | cli-codex fast-mode default may not apply | Slow dispatch | Pass `-c service_tier="fast"` explicitly. |
| Risk | Linter rewrites cause file-state drift | Atomic edit conflict | Codex re-reads before each edit. |
| Dependency | All 9 paths must exist | Edit fails if path missing | Phase 1 setup verifies via `ls`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Single cli-codex dispatch completes within 10 minutes.
- **NFR-P02**: Strict validate of each touched packet completes within 30 seconds.

### Security
- **NFR-S01**: No secrets, tokens, or credentials introduced.
- **NFR-S02**: No edits to `.codex/config.toml` or runtime agent files.

### Reliability
- **NFR-R01**: Every edit pinned to file:line in implementation-summary.
- **NFR-R02**: Strict validate gates completion claim.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- File hand-edited between scaffold and dispatch: re-read; codex handles.
- Status field already Complete: no-op; idempotent.
- New finding surfaces post-dispatch: out of scope; triggers 006 packet.

### Error Scenarios
- cli-codex returns 1: capture transcript; retry per-file via Claude Edit.
- Strict-validate regression: targeted rollback via git restore.
- SD-019 scenario regression: restore from main; manually add frontmatter field.

### State Transitions
- Draft → Active: scaffold + spec authored.
- Active → Complete: codex dispatch returned exit 0, both strict-validates pass, all findings closed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 9 files; mechanical edits. |
| Risk | 8/25 | Documentation-only. |
| Research | 4/20 | Dashboard already enumerates findings. |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking planning.
<!-- /ANCHOR:questions -->
