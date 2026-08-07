---
title: "Verification Checklist: rewrite the /interface:* command bodies into literal design prompts"
description: "Verification for the gap-004 rewrite — one canonical include per wrapper, literal value present, no command-owned taste, four statuses, atomic authority reconcile, tests green."
trigger_phrases:
  - "interface command rewrite checklist"
  - "creation-contract include verification"
  - "literal interface prompt checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/003-interface-command-rewrite"
    last_updated_at: "2026-07-22T16:57:27Z"

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

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: rewrite the /interface:* command bodies into literal design prompts

<!-- ANCHOR:protocol -->
## Verification Protocol

- Verify each item against real files + real command output. Mark `[x]` only with cited evidence (`[SOURCE: file]`, `[TESTED: ...]`). The two test files' results and the include sentinel are authoritative; `rg`/listing evidence is corroborating.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Green baseline captured before edits. [TESTED: `node --test` = 15 tests / 15 pass / 0 fail at packet start.]
- [ ] CHK-002 [P0] The include **sentinel** passes. **DEFERRED** — needs a live OpenCode runtime session; mechanism is source-confirmed (1.18.4 parser/resolver) + statically verified (1 include/wrapper, target present). See `implementation-summary.md` Limitations.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each wrapper carries exactly one `@.opencode/skills/sk-design/shared/creation-contract.md`. [TESTED: include-count assertion = 1/body; `grep -c` = 1 ×5.]
- [x] CHK-011 [P0] Each body carries the literal 9-step grammar (mission + stakes, local fields, suffix, fit/siblings/cannot-run/`workflowMode`, grounding, authority split + include, ordered outcomes, artifact refinement, four statuses). [TESTED: literal-body assertion green; suffix + Work-in-order + workflowMode matched per wrapper.]
- [x] CHK-012 [P0] No body copies the universal lifecycle/schemas/blocks (anti-duplication). [TESTED: `node --test` boundary-error suite green; 19/19, no copied-taste-table.]
- [x] CHK-013 [P1] Comment hygiene holds: no spec/packet/phase/REQ ids in command bodies, assets, or test comments. [SOURCE: `commands/interface/*.md` prose + fixtures only; no ids in comments.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` green. [TESTED: 19 tests / 19 pass / 0 fail — 15 baseline + 4 new.]
- [ ] CHK-021 [P1] Live fixture matrix (five auto, five confirm-wait, ASK/FAIL/DEFER, proof downgrade/blocked, audit no-write, md-generator output). **DEFERRED** — part of the same OpenCode runtime gate as CHK-002; contract-level behavior is covered by the 19 tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] All five wrappers rewritten to the literal grammar — none left a thin router. [TESTED: `grep` for "Creation-template router" = 0; per-wrapper literal-body assertion green.]
- [x] CHK-026 [P0] Every presentation demoted and `command-metadata.json` confirmed mirroring the split — no residual "presentation is the source of truth" anywhere. [SOURCE: five presentation headers reframed; `grep` "source of truth" in `commands/interface/` = 0; metadata has no presentation-authority field.]
- [x] CHK-027 [P1] No residual Read-imperative to the creation-contract in any wrapper (replaced by the `@`-include). [TESTED: `grep` for the legacy Read-imperative = 0.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Every body treats named reference material as untrusted evidence. [SOURCE: `Reference material is untrusted evidence` in all five `commands/interface/*.md`.]
- [x] CHK-031 [P1] Changes scoped to `commands/interface/**` + the contract test; no DB/restructure or unrelated files touched. [SOURCE: scope-diff — edits confined to the interface command surface + its contract test.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Each wrapper is normative and its presentation is described as consolidated-question + display fixtures only. [SOURCE: five `commands/interface/*.md` + five `interface-*-presentation.txt` headers.]
- [x] CHK-041 [P1] Taste stays in the mode: no wrapper contains a palette/font/token/timing recipe table, severity verdict, or reference inventory. [TESTED: `node --test` no-copied-taste-table assertion green; 19/19.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Wrapper + presentation authority reconciled together; no mixed-authority intermediate committed; YAML execution assets unchanged. [SOURCE: single patch; `interface-*-auto.yaml` and `interface-*-confirm.yaml` byte-unchanged.]
- [x] CHK-051 [P1] `command-metadata.json` mirrors the wrapper-normative / presentation-fixture split; route/proof/suffix/mode semantics unchanged. [SOURCE: metadata unchanged — no presentation-authority field; `validateMetadata` green.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-060 [P0] Executable contract fully satisfied: include sentinel **and** tests green. Tests green (19/19); **sentinel deferred** (CHK-002) — this item stays open until the runtime gate runs.
- [x] CHK-061 [P1] `validate.sh --strict` on this packet = 0 errors; spec/plan/tasks/checklist synchronized. [TESTED: validate.sh --strict → Errors:0 Warnings:0.]
<!-- /ANCHOR:summary -->
