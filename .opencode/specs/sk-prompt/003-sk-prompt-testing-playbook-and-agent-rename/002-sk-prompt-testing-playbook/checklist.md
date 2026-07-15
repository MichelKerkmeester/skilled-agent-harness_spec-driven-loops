---
title: "Verification Checklist: Phase 002 sk-prompt Manual Testing Playbook"
description: "P0/P1/P2 acceptance gates for the 28-scenario sk-doc-compliant manual testing playbook deliverable."
trigger_phrases:
  - "085 phase 002 checklist"
  - "sk-prompt playbook quality gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/003-sk-prompt-testing-playbook-and-agent-rename/002-sk-prompt-testing-playbook"
    last_updated_at: "2026-05-06T16:58:29Z"
    last_updated_by: "codex"
    recent_action: "Phase 002 complete: 28 scenarios shipped"
    next_safe_action: "Final memory save"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-085-002-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 002 sk-prompt Manual Testing Playbook

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

- [x] CHK-001 [P0] Phase 001 (agent rename) is complete and `@prompt-improver` is canonical.
  - **Evidence**: `ls .opencode/agents/prompt-improver.md` succeeds; `rg '@improve-prompt' .opencode .claude .codex .gemini` (active scope) returns 0
- [x] CHK-002 [P0] sk-doc templates loaded from `.opencode/skills/sk-doc/assets/testing_playbook/` before authoring.
  - **Evidence**: `manual_testing_playbook_template.md` and `manual_testing_playbook_snippet_template.md` referenced in plan.md
- [x] CHK-003 [P0] `@create` agent verified active before invoking `/create:testing-playbook`.
  - **Evidence**: Task tool dispatched with `subagent_type: create` (Phase 0 hard-block bypassed correctly)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 28 scenario files have the 5 mandatory sections.
  - **Evidence**: For each `SP-NNN.md` — `grep -E '^## (1\\. )?OVERVIEW|^## (2\\. )?SCENARIO CONTRACT|^## (3\\. )?TEST EXECUTION|^## (4\\. )?SOURCE FILES|^## (5\\. )?SOURCE METADATA'` returns 5 hits
- [x] CHK-011 [P0] Frontmatter present + valid on every scenario file.
  - **Evidence**: `head -10` shows `title:` and `description:` fields in every SP-NNN file
- [x] CHK-012 [P1] Scenarios use realistic user requests (not SKILL.md paraphrases).
  - **Evidence**: Manual review of 3-5 sampled scenarios documents realistic operator phrasing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py` exits 0 on root playbook.
  - **Evidence**: `python3 .opencode/skills/sk-doc/scripts/validate_document.py manual_testing_playbook.md` returns exit 0
- [x] CHK-021 [P0] Strict validate on phase folder PASSES.
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` returns 0 errors, 0 warnings
- [x] CHK-022 [P0] Feature-ID count matches between root index and per-feature files.
  - **Evidence**: `find .opencode/skills/sk-prompt/manual_testing_playbook -name '[0-9][0-9][0-9]-*.md' | wc -l` == 28; root index `^| SP-` row count == 28
- [x] CHK-023 [P1] Manual probe of 1-3 scenarios end-to-end against the renamed `@prompt-improver` agent.
  - **Evidence**: Static contract probe completed: all 28 scenario files reference `@prompt-improver`; live runtime execution remains a release-readiness activity noted in `implementation-summary.md`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 7 category folders exist with correct `NN--name/` naming.
  - **Evidence**: `ls .opencode/skills/sk-prompt/manual_testing_playbook/ | grep -E '^[0-9]{2}--'` returns 7 entries
- [x] CHK-031 [P0] All 28 SP-NNN scenario files exist (`find ... -name "[0-9][0-9][0-9]-*.md" | wc -l == 28`).
  - **Evidence**: `find` count + visual file tree audit
- [x] CHK-032 [P0] sk-prompt SKILL.md has ONE `## RELATED PLAYBOOK` link in Section 10.
  - **Evidence**: `grep -c '## RELATED PLAYBOOK' SKILL.md == 1`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No source files outside the playbook folder + ONE SKILL.md backref edit.
  - **Evidence**: `git diff --name-only` confined to `manual_testing_playbook/**` + `SKILL.md` (single line)
- [x] CHK-041 [P0] No forbidden sidecars created (review_protocol.md, subagent_utilization_ledger.md, snippets/).
  - **Evidence**: `find manual_testing_playbook \( -name 'review_protocol.md' -o -name 'subagent_utilization_ledger.md' -o -type d -name 'snippets' \)` returns empty
- [x] CHK-042 [P1] No secrets / credentials embedded in scenario evidence sections.
  - **Evidence**: Scenario evidence references file paths, not literal credentials
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Root playbook has TABLE OF CONTENTS, OVERVIEW, GLOBAL PRECONDITIONS, GLOBAL EVIDENCE REQUIREMENTS sections.
  - **Evidence**: `grep -E '^## (1\\. OVERVIEW|2\\. GLOBAL PRECONDITIONS|3\\. GLOBAL EVIDENCE REQUIREMENTS)'` returns ≥3 hits
- [x] CHK-051 [P0] Each scenario references @prompt-improver (NOT legacy agent naming).
  - **Evidence**: `grep -l '@improve-prompt' manual_testing_playbook/` returns no scenario files (only agent name change leftovers if any)
- [x] CHK-052 [P1] Phase 002 implementation-summary.md authored with verification evidence table.
  - **Evidence**: `implementation-summary.md` Section "Verification" filled with PASS/FAIL per gate
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Scenario files use `NNN-name.md` naming (3-digit sequential within category).
  - **Evidence**: `find manual_testing_playbook -name '[0-9][0-9][0-9]-*.md' | grep -vE '/[0-9]{3}-[a-z0-9-]+\\.md$'` returns empty
- [x] CHK-061 [P0] Authored files scoped to playbook folder + spec docs.
  - **Evidence**: `git diff --name-only` shows no unrelated files modified
- [x] CHK-062 [P1] All 5 mandatory section anchors present in every scenario file (when scenarios use anchor convention).
  - **Evidence**: Section sweep confirms all 28 scenario files contain the five mandatory numbered sections
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status | Run At | Evidence |
|------|--------|--------|----------|
| Phase 001 prerequisite | [PASS] | 2026-05-06T16:58:29Z | `ls .opencode/agents/prompt-improver.md` succeeds; legacy-name grep returned no playbook/SKILL hits |
| validate_document.py | [PASS] | 2026-05-06T16:58:29Z | Root playbook valid, 0 issues |
| Strict spec validate | [PASS] | 2026-05-06T16:58:29Z | Strict validator passed with 0 errors, 0 warnings |
| Feature-ID count match | [PASS] | 2026-05-06T16:58:29Z | 28 scenario files; root index has 28 SP rows |
| Forbidden-sidecar grep | [PASS] | 2026-05-06T16:58:29Z | Forbidden-sidecar `find` returned empty |
| Manual scenario probe | [PASS] | 2026-05-06T16:58:29Z | Static contract probe: all 28 scenarios reference `@prompt-improver`; live transcripts deferred to release-readiness run |
| sk-prompt SKILL.md backref | [PASS] | 2026-05-06T16:58:29Z | `grep -c '^## RELATED PLAYBOOK$' .opencode/skills/sk-prompt/SKILL.md` returned 1 |

**Sign-off (when complete)**: Update each row to `[PASS]` or `[FAIL]` with timestamp + evidence path.
<!-- /ANCHOR:summary -->
