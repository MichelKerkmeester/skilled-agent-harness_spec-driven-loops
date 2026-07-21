---
title: "Implementation Summary: rewrite the /interface:* command bodies into literal design prompts"
description: "Level 2 implementation summary for the gap-004 command rewrite: planning-only status, the four package facets to reconcile, key decisions, and deferred verification pending implementation."
trigger_phrases:
  - "interface command rewrite summary"
  - "creation-contract include planned summary"
  - "literal interface prompt summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the planning-only Level 2 docs for the gap-004 rewrite."
    next_safe_action: "Implement after plan review: sentinel → tests → atomic wrapper/presentation/metadata rewrite."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/creation-contract.md"
      - ".opencode/skills/sk-design/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-gap-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: rewrite the /interface:* command bodies into literal design prompts

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-interface-command-rewrite |
| **Completed** | N/A — PLANNED |
| **Level** | 2 |
| **Status** | PLANNED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing runtime shipped in this packet. This is a planning-only phase-child: the five Level 2 spec-folder documents define the gap-004 command rewrite — turning the five `/interface:*` thin-router bodies into literal, self-contained design prompts with a single runtime include — ready to be built after plan review. The corrected body cores already exist in the 007 research (§7).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | REQ-001–REQ-007: include, literal value, anti-duplication, taste-in-mode, statuses, atomic reconcile, tests |
| `plan.md` | Created | Architecture (literal-prompt-with-single-include), ownership split, phased rollout, rollback |
| `tasks.md` | Created | T001–T007 sentinel/test-first → atomic rewrite → verify |
| `checklist.md` | Created | CHK-001–061 verification checklist |
| `implementation-summary.md` | Created | This planning summary |

### Files the implementation WILL change (not this session)

- `commands/interface/{design,foundations,motion,audit,design-reference}.md` (five wrappers)
- `commands/interface/assets/interface-*-presentation.txt` (five presentations → fixtures)
- `.opencode/skills/sk-design/command-metadata.json` (mirror the split)
- `.opencode/skills/sk-design/shared/scripts/{interface-command-contract,design-command-surface-check}.test.mjs`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planning only. Authored in the isolated worktree `0093-sk-design-012-gap-research` on branch `sk-design/0093-012-gap-research`, alongside its sibling `007-gap-remediation-research` (the source research). Implementation is sequenced as: capture the 15-test baseline → run the include sentinel → extend the two test files → rewrite the five wrappers and reconcile presentation/metadata in one atomic patch → verify → `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rewrite bodies, keep architecture | The route/intake/proof/handoff architecture is useful; only the literal prompt experience was missing (research §3, §11) |
| One native `@`-include, not a shell compiler or five copies | Native include avoids registry/drift/security machinery and five-source schema drift (research §4, eliminated alternatives) |
| Canonical single include token (`@.opencode/…`, no `./`) | Keeps static tests single-token; `@./…` is path-equivalent but rejected as a second form (research §4) |
| Wrapper normative, presentation → fixtures, atomically | Leaving the presentation normative beside a literal wrapper creates two competing prompt authorities (research §8) |
| Taste stays in the mode | Command-owned recipes/verdicts would become a second taste authority and drift from the mode (research §5, §13) |
| Correctness = two test files + include sentinel | Source inspection does not exercise model-visible prompt delivery; the sentinel is a required implementation gate (research §12, §16) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Deferred — planning-only. The implementation's Definition of Done (plan §2): include sentinel passes; each wrapper has exactly one canonical include, the literal grammar, four statuses, and no command-owned taste; presentation/metadata reconciled atomically; `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` green (baseline 15 + new assertions); `validate.sh --strict` = 0 errors.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The corrected body cores in research §7 are research deliverables, not applied command files; exact line counts and the presentation/YAML edits await implementation.
- The include sentinel cannot be run from spec authoring — it requires a live OpenCode command discovery + prompt-delivery path, which is an implementation-time gate.
- This packet is independent of the DB-build/restructure packets under `015`; it does not depend on and is not blocked by them.
<!-- /ANCHOR:limitations -->
