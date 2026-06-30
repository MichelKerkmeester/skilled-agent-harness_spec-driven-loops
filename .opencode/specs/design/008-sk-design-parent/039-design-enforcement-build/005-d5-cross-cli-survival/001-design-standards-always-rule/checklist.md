---
title: "Verification Checklist: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)"
description: "P0/P1 verification evidence for the append-only Design Standards Loading rule insertion across the 3 cli-* SKILLs under GLM-5.2 concurrency."
trigger_phrases:
  - "d5-r1 checklist"
  - "design standards loading checklist"
  - "cli design rule verification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/001-design-standards-always-rule"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0/P1/P2 checks; add Fix Completeness section"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r1-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)

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

- [x] CHK-001 [P0] Code-standards anchor located by content in all three targets
  - **Evidence**: `grep -c "Code Standards Loading (surface-aware contract)"` == 1 in cli-codex, cli-opencode, cli-claude-code
- [x] CHK-002 [P0] Baseline `sk-design`-absent precondition captured
  - **Evidence**: `grep -c "sk-design"` == 0 in all three target files before edit
- [x] CHK-003 [P0] Concurrency state recorded
  - **Evidence**: `git status` shows `cli-opencode/SKILL.md` dirty (GLM-5.2 WIP), cli-codex + cli-claude-code clean
- [x] CHK-004 [P1] Exact twin rule text confirmed evergreen before insertion
  - **Evidence**: plan.md §3 rule text reviewed; no spec/packet/phase/ADR/REQ/task/finding token present

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each cli-* SKILL contains a `Design Standards Loading` ALWAYS rule beside its code-standards rule
  - **Evidence**: twin present as item `12` (cli-codex), `13` (cli-opencode), `10` (cli-claude-code), directly after code-standards
- [x] CHK-011 [P0] `grep` confirms `sk-design` now appears in each cli-* dispatch contract (today it does not)
  - **Evidence**: `grep -c "sk-design"` >= 1 in all three files post-edit (was 0)
- [x] CHK-012 [P0] Wording is parallel to the code-standards rule across all three siblings
  - **Evidence**: load `sk-design` (hub) → resolve `workflowMode` via `mode-registry.json` → load mode packet + set register + verify → carry `mcp-open-design` pairing for Open Design work; identical text except leading number
- [x] CHK-013 [P1] Code-standards rule number preserved (twin inserted AFTER it)
  - **Evidence**: code-standards stays `11`/`12`/`9`; `cli-opencode` rule 8 `(see ALWAYS rule 12)` still resolves to code-standards

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Byte-unchanged except the inserted rule + minimal renumber (cli-codex)
  - **Evidence**: `git diff` shows one added block + `12→13`,`13→14` renumber only
- [x] CHK-021 [P0] Byte-unchanged except the inserted rule + minimal renumber (cli-claude-code)
  - **Evidence**: `git diff` shows one added block + `10→11`,`11→12` renumber only
- [x] CHK-022 [P0] Design hunk isolated and byte-unchanged-except-renumber (cli-opencode)
  - **Evidence**: design hunk == one added block + `13→14`,`14→15`,`15→16` renumber; GLM hunks unchanged
- [x] CHK-023 [P1] Each twin is content-adjacent ("beside") to its code-standards rule
  - **Evidence**: twin line == code-standards rule line + 1 in each file

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified: `class-of-bug` — a parity gap shared by all three cli-* dispatch SKILLs, not an instance-only miss
  - **Evidence**: baseline `grep -c "sk-design"` == 0 in cli-codex, cli-claude-code, AND cli-opencode confirmed the gap was class-wide
- [x] CHK-FIX-002 [P0] Same-class producer inventory complete: every cli-* dispatch SKILL in the family enumerated and patched
  - **Evidence**: the cli-* dispatch family is exactly {cli-codex, cli-claude-code, cli-opencode}; all three carry the twin rule post-edit
- [x] CHK-FIX-003 [P1] Consumer integrity preserved for the changed numbering: code-standards cross-reference holds
  - **Evidence**: `cli-opencode` ALWAYS rule 8 `(see ALWAYS rule 12)` still resolves to code-standards; no other `ALWAYS rule N` cross-reference exists

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] GLM-5.2 workstream edits not clobbered
  - **Evidence**: no GLM hunk altered/reverted; `git diff` for cli-opencode contains GLM WIP (`glm-5.2` vision/image-input edit) intact + the isolated design hunk
- [x] CHK-031 [P0] Staging discipline honored — no bulk stage of the dirty file
  - **Evidence**: `cli-opencode/SKILL.md` design hunk staged only via verified isolation (`git apply --cached` of the single design hunk); never `git add .`/directory add
- [x] CHK-032 [P0] HALT respected on anchor drift
  - **Evidence**: anchor matched by content in all three; no missing/duplicated/reworded anchor or unexpected hunk encountered (plan §7 conditions 1–4)

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: inserted rule carries NO ephemeral artifact IDs
  - **Evidence**: `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding"` over the inserted block returns nothing in all three files
- [x] CHK-041 [P1] No other section reflowed or reformatted
  - **Evidence**: frontmatter, headers, NEVER/ESCALATE blocks, References byte-identical to baseline
- [x] CHK-042 [P2] spec.md / plan.md / tasks.md synchronized with final state
  - **Evidence**: status fields set to complete and rule text consistent across packet docs

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Writes scoped to the three cli-* SKILL.md only
  - **Evidence**: no file outside `cli-codex/SKILL.md`, `cli-opencode/SKILL.md`, `cli-claude-code/SKILL.md` modified by this task
- [x] CHK-051 [P1] No temp/scratch artifacts left in the repo
  - **Evidence**: scratchpad-only temp use; repo tree clean of task scratch files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (orchestrator-confirmed grep + git diff evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
