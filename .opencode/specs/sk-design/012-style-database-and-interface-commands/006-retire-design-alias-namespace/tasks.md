---
title: "Tasks: retire the /design:* alias namespace"
description: "Per-surface tasks to re-key the checker + three registries to /interface:*, delete commands/design/, and prove the surface checker exits 0 with green tests."
trigger_phrases:
  - "retire design aliases tasks"
  - "interface rekey tasks"
  - "command dedup tasks"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace"
    last_updated_at: "2026-07-21T04:58:59Z"
    last_updated_by: "review-remediation"
    recent_action: "Tasks executed and shipped in commit 9a42aedae4; metadata reconciled to complete."
    next_safe_action: "None — packet complete and verified."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: retire the /design:* alias namespace

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence. IDs `T001+`. The executable contract is the surface checker (`design-command-surface-check.mjs` exit 0) plus the two test files green. Comment hygiene: no spec/packet/phase/REQ ids in code comments.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 (REQ-004/REQ-005) Re-key `command-metadata.json`: set each record's `command` per the rename map, delete `canonicalCommand` + `compatibilityAliases`, and rewrite every order-sensitive cross-reference token (`examples[].invocation`, `next[]`, `handoff.nextOptions[].command`, `discriminator.*`, `pipeline.*`) while preserving array element order. Leave the `design-mcp-open-design` transport token unchanged.
- [x] T002 (REQ-005) Re-key `hub-router.json` (delete `commandSurface.compatibilityAliases`; keep `canonicalNamespace` + `canonicalByMode`) and `mode-registry.json` (re-key each mode `command` to its `/interface:*` primary, delete `compatibilityAliases`, keep the transport mode `command:null`, update the description prose).

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 (REQ-001/REQ-005) Re-key `design-command-surface-check.mjs`: `REQUIRED_FIELDS` (drop the two alias fields), `COMMANDS` (five `/interface:*` tokens), `CANONICAL_COMMAND_BY_MODE`→`COMMAND_BY_MODE`, `readWrapperRoster`→`["interface"]`, remove `compatibilityAliasCount` and the canonical projection, and simplify `collectRosterReconciliationDrift`, `validateMetadata`, `validateTaskProjections`, `commandSetForModes`, and `formatTextReport` to the primary namespace.
- [x] T004 (REQ-003) Delete the `.opencode/commands/design/` tree — the 5 alias wrappers (`audit`, `foundations`, `interface`, `md-generator`, `motion`) and the 15 `design-*` assets.
- [x] T005 (REQ-002) Update `design-command-surface-check.test.mjs` (assets root → `commands/interface/assets/`; sibling-set + mutation fixtures → `/interface:*`) and `interface-command-contract.test.mjs` (drop `legacy`/`legacyAction`/`compatibilityAliases`; remove the "legacy thin aliases" test).
- [x] T006 (REQ-006) Reconcile the dangling `/design:*` alias prose in the ungated docs (`SKILL.md`, `README.md`, `feature-catalog/**`, `styles/manual-testing-playbook.md`) and add a changelog entry recording the retirement; leave historical changelog entries untouched.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 (REQ-001/REQ-002) Run the executable contract: `node design-command-surface-check.mjs` exits 0 (drift=0) AND `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` is green (15 tests).
- [x] T008 (REQ-003/REQ-004) Confirm `rg -n '/design:'` finds no command token in the checker or the three registries, `.opencode/commands/design/` is absent, and the five `commands/interface/` wrappers + 15 assets are present and unchanged; then `validate.sh --strict` on this phase = 0 errors.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks `[x]` with evidence; the surface checker exits 0; the two test files are green (15); no residual `/design:` command token; `commands/design/` deleted and `commands/interface/` intact; `validate.sh --strict` = 0 errors.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Decision source: parent `../spec.md` PHASE DOCUMENTATION MAP + the frozen operator decision recorded in this phase's `spec.md`.
- Predecessor: `../005-review-remediation/` (the review remediation that preceded this surface dedup).
- Executable authority: `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` and its two test files.

<!-- /ANCHOR:cross-refs -->
