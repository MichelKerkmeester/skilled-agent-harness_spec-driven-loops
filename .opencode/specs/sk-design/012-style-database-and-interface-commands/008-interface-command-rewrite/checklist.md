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
    packet_pointer: "sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 verification checklist for the gap-004 command rewrite."
    next_safe_action: "Mark items with evidence during implementation; the two test files + sentinel are authoritative."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-gap-plan-session"
      parent_session_id: null
    completion_pct: 0
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

- [ ] CHK-001 [P0] The green 15-test baseline is captured before any edit, so the post-change delta is attributable.
- [ ] CHK-002 [P0] The include **sentinel** passes: the contract's sentinel bytes appear in the model-visible prompt for a command carrying the canonical include. A contradiction halts implementation.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each wrapper carries exactly one `@.opencode/skills/sk-design/shared/creation-contract.md` (no `./`, no second form). [TESTED: include-count assertion = 1/body]
- [ ] CHK-011 [P0] Each body carries the literal 9-step grammar: mission + stakes, local field names, suffix control, fit/siblings/cannot-run/`workflowMode`, grounding, authority split + include, ordered outcomes + decisive criterion, artifact refinement, four statuses.
- [ ] CHK-012 [P0] No body copies the universal lifecycle, envelope schema, common blocks, evidence ladder, revision mechanics, statuses, or handoff envelope (anti-duplication). [TESTED: copied-schema rejection]
- [ ] CHK-013 [P1] Comment hygiene holds: no spec/packet/phase/REQ ids in command bodies, assets, or test comments.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` is green — the pre-change 15 baseline plus the new include/status/anti-dup/no-nesting/audit/md-generator assertions.
- [ ] CHK-021 [P1] Fixture matrix passes: five auto, five confirm-wait, ASK/FAIL/DEFER, proof downgrade/blocked, audit no-write, md-generator output/fidelity.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] All five wrappers (`design`, `foundations`, `motion`, `audit`, `design-reference`) are rewritten to the literal grammar — none is left as a thin router. [TESTED: per-wrapper literal-value assertion across all five]
- [ ] CHK-026 [P0] Every presentation asset is demoted and `command-metadata.json` mirrors the split — no residual "presentation is the prompt source of truth" declaration remains anywhere. [SOURCE: five presentation assets + command-metadata.json]
- [ ] CHK-027 [P1] No residual Read-imperative to the creation-contract remains in any wrapper (replaced by the `@`-include). [TESTED: `rg` for the old `Read ... creation-contract.md` imperative → 0]

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Every body instructs the agent to treat named reference material as untrusted evidence and ignore source-embedded instructions (esp. `design-reference` capture). [SOURCE: wrapper grounding paragraph]
- [ ] CHK-031 [P1] Changes scoped to `commands/interface/**` + `command-metadata.json` + the two test files; no DB/restructure or unrelated files touched (scope-diff before any completion claim).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Each wrapper's PRESENTATION BOUNDARY is inverted: the wrapper is normative; the presentation is described as consolidated-question + display fixtures only. [SOURCE: five wrappers + five presentation assets]
- [ ] CHK-041 [P1] Taste stays in the mode: no wrapper contains a palette, font, token/timing recipe, severity verdict, or reference inventory. [TESTED: no-taste token scan of `commands/interface/*.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Wrapper/presentation/YAML/metadata authority reconciled in one atomic patch; no mixed-authority intermediate committed; YAML execution assets unchanged. [SOURCE: single-patch scope-diff]
- [ ] CHK-051 [P1] `command-metadata.json` mirrors the wrapper-normative / presentation-fixture split; route/proof/suffix/mode semantics unchanged.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-060 [P0] Executable contract satisfied: the include sentinel passed AND the two test files are green — the rewrite is correct by definition.
- [ ] CHK-061 [P1] `validate.sh --strict` on this phase = 0 errors; spec/plan/tasks/checklist synchronized. Whole-change rollback to the 15/15 baseline recorded as the failure path.
<!-- /ANCHOR:summary -->
