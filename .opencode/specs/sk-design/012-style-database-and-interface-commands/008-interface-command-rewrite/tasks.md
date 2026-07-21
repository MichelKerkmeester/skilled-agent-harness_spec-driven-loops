---
title: "Tasks: rewrite the /interface:* command bodies into literal design prompts"
description: "Sentinel + test-first, then atomically rewrite the five wrappers to the 9-step grammar with a single @-include and reconcile presentation/metadata authority, proven by the command test suite green."
trigger_phrases:
  - "interface command rewrite tasks"
  - "creation-contract include tasks"
  - "literal interface prompt tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite"
    last_updated_at: "2026-07-21T12:23:35Z"
    last_updated_by: "implementer"
    recent_action: "Rewrote the five wrappers + include; tests 19/19 green."
    next_safe_action: "Run the live OpenCode include sentinel to close CHK-002."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-008-impl-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: rewrite the /interface:* command bodies into literal design prompts

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence. IDs `T001+`. The executable contract is `interface-command-contract.test.mjs` + `design-command-surface-check.test.mjs` green plus the include sentinel. Comment hygiene: no spec/packet/phase/REQ ids in command bodies, assets, or test comments.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 (REQ-001/REQ-007) Capture the green baseline, then run the isolated include **sentinel**. [TESTED: baseline captured — `node --test` = 15 tests / 15 pass / 0 fail before edits.] **Sentinel DEFERRED** — proving the include's bytes reach the model-visible prompt needs a live OpenCode runtime session (see `implementation-summary.md` Limitations); the mechanism is source-confirmed + statically verified (1 canonical include per wrapper, target present).
- [x] T002 (REQ-007) Extend `interface-command-contract.test.mjs`: exactly-one canonical include per wrapper, all four typed statuses, literal-body (not thin router), audit read-only, md-generator measured-only. [TESTED: 4 new tests added; full suite 19/19 green.]
- [x] T003 (REQ-007) Surface parity validated. [SOURCE: `design-command-surface-check.test.mjs` metadata↔YAML parity stays green (7/7).] **Deviation recorded:** the new wrapper-body assertions were consolidated into `interface-command-contract.test.mjs` (T002) because that is the file that loads wrapper bodies; the surface-check test validates metadata/YAML only and was left unchanged.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 (REQ-002/REQ-003/REQ-004/REQ-005) Rewrote all five wrappers from research §7: literal mission + local intake + suffix control + fit/siblings/cannot-run/`workflowMode` + grounding + authority split + one `@`-include + ordered outcomes + artifact refinement + four statuses; no command-owned taste. [SOURCE: `commands/interface/{design,foundations,motion,audit,design-reference}.md`] [TESTED: literal-body + no-taste + include-count assertions green.]
- [x] T005 (REQ-006) Demoted the five `interface-<mode>-presentation.txt` headers to consolidated-question + display fixtures (inverted the source-of-truth declaration); `command-metadata.json` carries no presentation-authority field so it already mirrors the split and was left unchanged; YAML unchanged. [SOURCE: five presentation assets; `grep` for "source of truth" in `commands/interface/` = 0.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 (REQ-007) Ran `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs`. [TESTED: 19 tests / 19 pass / 0 fail (15 baseline + 4 new).] The live auto/confirm fixture matrix is part of the deferred OpenCode runtime gate (T001).
- [x] T007 (REQ-001/REQ-004/REQ-006) Confirmed exactly one canonical include per wrapper and zero command-owned taste tables (`grep`/boundary tests), presentation boundary inverted in all five, and metadata mirroring the split; `validate.sh --strict` on this packet = 0 errors. [TESTED: include-count = 1×5; residual thin-router/source-of-truth/Read-imperative = 0.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Wrappers rewritten to the literal grammar; exactly one canonical include each; presentation demoted and metadata confirmed mirrored; contract suite 19/19 green; `validate.sh --strict` = 0 errors. **Remaining for full completion:** the live OpenCode include sentinel + fixture matrix (T001), a runtime gate deferred to an OpenCode session.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Design source: `../007-gap-remediation-research/004-commands/research/lineages/sol-high-fast/research.md` (§6 grammar, §7 body cores, §8 authority reconciliation, §9 acceptance matrix, §10 sequence).
- Decision source: parent `../spec.md` PHASE DOCUMENTATION MAP + this phase's `spec.md` FROZEN decision.
- Executable authority: `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` and `design-command-surface-check.test.mjs`.
- Sibling (already shipped): `../006-retire-design-alias-namespace/` retired `/design:*`, so this rewrite operates on an alias-free `/interface:*` surface.
<!-- /ANCHOR:cross-refs -->
