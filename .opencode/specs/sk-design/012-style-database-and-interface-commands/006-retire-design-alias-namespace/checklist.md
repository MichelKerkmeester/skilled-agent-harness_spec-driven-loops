---
title: "Verification Checklist: retire the /design:* alias namespace"
description: "Verification for the /design:* retirement — surface checker exit 0, tests green, /design:* gone, /interface:* intact."
trigger_phrases:
  - "retire design aliases checklist"
  - "interface surface verification"
  - "command dedup checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace"
    last_updated_at: "2026-07-20T18:23:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author the retirement checklist"
    next_safe_action: "Implement T001 (re-key the three registries)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: retire the /design:* alias namespace

<!-- ANCHOR:protocol -->
## Verification Protocol

- Verify each item against real files + real command output. Mark `[x]` only with cited evidence (`[SOURCE: file]`, `[TESTED: ...]`). The surface checker exit code and the test-suite result are authoritative; grep/listing evidence is corroborating.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The frozen rename map (5 modes → `/interface:*` primaries) and the delete-vs-preserve boundary are recorded in `spec.md` before editing.
- [ ] CHK-002 [P1] Green baseline captured (checker exit 0; current test suite pass) so the post-change delta is attributable.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Checker re-keyed with no dead references: `REQUIRED_FIELDS` drops the two alias fields, `readWrapperRoster` reads `["interface"]` only, and no code path reads `record.compatibilityAliases`/`record.canonicalCommand` after removal.
- [ ] CHK-011 [P1] Registry cross-reference tokens rewritten via the deterministic 5-key rename map with array element order preserved (no reordered `next`/`handoff`/`pipeline` arrays).
- [ ] CHK-012 [P1] Edits are identifiers/strings/JSON values only — comment hygiene holds (no spec/packet/phase/REQ ids in code comments).

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` exits 0 (STATUS=VALID, drift=0).
- [ ] CHK-021 [P0] `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` is green (15 tests; "legacy thin aliases" test removed).

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] `/design:*` is gone: `rg -n '/design:'` returns no command token in `design-command-surface-check.mjs` or the three registries, and `.opencode/commands/design/` (5 wrappers + 15 assets) is absent.
- [ ] CHK-031 [P0] `/interface:*` is intact: the five `commands/interface/` wrappers (`audit`, `design`, `design-reference`, `foundations`, `motion`) + their 15 assets are present and unmodified.
- [ ] CHK-032 [P1] The `design-mcp-open-design` transport token (`command:null`) is unchanged everywhere.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] No secrets or paths outside the sk-design surface were touched; all edits are scoped to the worktree skill tree + `commands/design|interface/`.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Dangling `/design:*` alias prose reconciled in the ungated docs (`SKILL.md`, `README.md`, `feature-catalog/**`, `styles/manual-testing-playbook.md`); a new changelog entry records the retirement; historical changelog entries are preserved unchanged.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Changes scoped to the checker + its two tests, the three registries, `commands/design/` (deleted), and the ungated docs; no unrelated packets or files touched (scope-diff before any completion claim).

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-070 [P0] Executable contract satisfied: checker exit 0 AND tests green — the refactor is correct by definition.
- [ ] CHK-071 [P1] `validate.sh --strict` on this phase = 0 errors; spec/plan/tasks/checklist synchronized.

<!-- /ANCHOR:summary -->
