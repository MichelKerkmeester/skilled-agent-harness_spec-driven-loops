---
title: "Verification Checklist: Hook Reference Docs Relocation"
description: "Verification evidence for the four-doc relocation, consumer repoints, and the strict packet gate."
trigger_phrases:
  - "hook relocation checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-hook-docs-relocation"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Recorded complete relocation and strict-validation evidence"
    next_safe_action: "No follow-up required; packet verification is complete"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-system-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Hook Reference Docs Relocation

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

Evidence markers use the `[evidence: ...]` bracket form with concrete file, command, or numeric substance so the validator can check mechanically.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Placement matrix records ownership evidence per doc before any move
  - **Evidence**: [evidence: `decision-record.md:65-74` records 4 document rows with behavior, owner-tree evidence, and confirmed destination before the rename wave]
- [x] CHK-002 [P0] Live consumer inventory complete before any move
  - **Evidence**: [evidence: `tasks.md:55-59` enumerates 34 live consumer files found by the pre-move repo-wide `rg` sweep]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] goal-plugin.md at .opencode/hooks/goal/
  - **Evidence**: [evidence: `test -f .opencode/hooks/goal/goal-plugin.md` prints `PASS`]
- [x] CHK-004 [P0] injection-contract.md at .opencode/hooks/
  - **Evidence**: [evidence: `test -f .opencode/hooks/injection-contract.md` prints `PASS`]
- [x] CHK-005 [P0] Both advisor hook docs under system-skill-advisor/hooks/
  - **Evidence**: [evidence: `test -f` prints `PASS` for `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md` and `skill-advisor-hook-validation.md`]
- [x] CHK-006 [P0] Old folder emptied and removed
  - **Evidence**: [evidence: `test ! -e .opencode/skills/system-spec-kit/references/hooks` prints `PASS source folder absent`]
- [x] CHK-007 [P1] Moves used git mv for rename tracking
  - **Evidence**: [evidence: `git diff --cached --name-status` reports `R100` for all 4 source/destination pairs]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Grep sweep proves zero live hits for the old path strings
  - **Evidence**: [evidence: repo-wide `rg -n --hidden` live-content sweep piped to `wc -l` outputs `0`; exclusions cover `.git`, packet/history records, `z_archive`, iterations, review reports, and generated benchmark reports]
- [x] CHK-009 [P0] Moved docs link audit passes
  - **Evidence**: [evidence: moved-doc audit prints `MOVED_DOC_RELATIVE_LINKS=PASS files=4`; `SPECKIT_VALIDATE_LINKS=true validate.sh --strict` exits 0 with `Errors: 0 Warnings: 0`]
- [x] CHK-010 [P0] Strict validation exits 0
  - **Evidence**: [evidence: standard and link-aware strict runs both print `Summary: Errors: 0 Warnings: 0` and `RESULT: PASSED`]
- [x] CHK-011 [P1] system-spec-kit skill itself still validates
  - **Evidence**: [evidence: `generate-leaf-manifest.cjs --check .opencode/skills/system-spec-kit` prints `leaf-manifest.json OK (291e3a7497d6e207769ba6923707f740613325a824997a719c4ffe73abd54d69)`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-012 [P0] AGENTS.md directive-capsule pointer repointed
  - **Evidence**: [evidence: `AGENTS.md:419` points to `.opencode/hooks/injection-contract.md`; advisor pointer at `AGENTS.md:137` names `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md`]
- [x] CHK-013 [P0] No unrelated files changed
  - **Evidence**: [evidence: scoped `git diff --name-status` contains the 34 inventoried consumers, 4 contracted renames, and packet evidence only; unrelated pre-existing worktree changes were not edited]
- [x] CHK-014 [P1] Packet docs reflect final state
  - **Evidence**: [evidence: all `tasks.md` tasks and completion criteria are `[x]`; `spec.md` and `implementation-summary.md` both report Complete]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-015 [P0] No secrets, tokens, or credentials in any packet doc
  - **Evidence**: [evidence: content audit of `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` shows only paths, commands, and prose]
- [x] CHK-016 [P1] No code comments touched by this packet
  - **Evidence**: [evidence: scoped `git diff --name-status` contains Markdown, JSON leaf metadata, and packet metadata only; no adapter, plugin, registration, or source-code file changed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-017 [P0] Spec, plan, tasks, checklist, decision-record, and summary all present
  - **Evidence**: [evidence: `.opencode/specs/system-speckit/032-hook-docs-relocation/` contains all six canonical documents plus generated metadata]
- [x] CHK-018 [P1] Rollback path recorded
  - **Evidence**: [evidence: `plan.md` rollback section names git revert of the move and repoint commit]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-019 [P0] Packet lives under system-speckit with a convention-compliant name
  - **Evidence**: [evidence: packet path `.opencode/specs/system-speckit/032-hook-docs-relocation` matches the ###-short-name pattern]
- [x] CHK-020 [P1] No stray files in the packet beyond docs and metadata
  - **Evidence**: [evidence: packet directory read shows canonical docs plus `description.json` and `graph-metadata.json` only]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **P0**: [x] Complete
- **P1**: [x] Complete
- **Overall**: Complete
<!-- /ANCHOR:summary -->
