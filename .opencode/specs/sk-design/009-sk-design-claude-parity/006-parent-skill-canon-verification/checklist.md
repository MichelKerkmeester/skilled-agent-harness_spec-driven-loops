---
title: "Verification Checklist: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization"
description: "Executed Level 2 verification checklist re-verifying sk-design canon conformance and the procedures/ pattern's formalization decision."
trigger_phrases:
  - "verification"
  - "checklist"
  - "parent-skill canon verification"
  - "sk-design canon re-verification"
importance_tier: "high"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/006-parent-skill-canon-verification"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all Phase 006 checklist rows with fresh evidence."
    next_safe_action: "Continue with Phase 007 sk-design-local procedure-card template alignment."
---
# Verification Checklist: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot start implementation until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 005 documentation-level closure and CONDITIONAL verdict are read and cited before Phase 006 work begins [EVIDENCE: Phase 005 `spec.md` line 47 "Complete / Conditional Release Gate"; `release-report.md` §7 CONDITIONAL verdict.]
  - **Evidence**: Phase 005 `spec.md` Status field reads "Complete / Conditional Release Gate"; `release-report.md` §7 states the CONDITIONAL verdict and confirms Phase 006 does not block on the outstanding live/manual/browser gaps, which remain operator-owned.
- [x] CHK-002 [P0] Current `sk-design` hub files are read before auditing [EVIDENCE: `SKILL.md`, `mode-registry.json`, `hub-router.json` read before checker run.]
  - **Evidence**: `SKILL.md`, `mode-registry.json`, and `hub-router.json` were read before running the checker or citing registry content.
- [x] CHK-003 [P0] Current `sk-doc` canon reference sections are read before auditing [EVIDENCE: `parent_skills_nested_packets.md` §4/§6 read before citing the gap.]
  - **Evidence**: `parent_skills_nested_packets.md` §4 (Three Hubs Extension Matrix, lines 135-143) and §6 (Companion file policy, lines 197-203) were read before citing the canon-doc gap.
- [x] CHK-004 [P0] Logic-sync conflicts between this plan and live `sk-design`/`sk-doc` state are escalated before writing [EVIDENCE: no conflict; live state matched this phase's grounding.]
  - **Evidence**: No conflict found. Live state matched this phase's grounding: checker exit 0, all five modes declare `proceduresPath`, 14 procedure cards inventoried, and §4/§6 still omit `procedures/`/`proceduresPath`.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fresh canon-checker run is captured for this phase [EVIDENCE: `parent-skill-check.cjs .opencode/skills/sk-design` exit 0, 22 PASS, 0 warnings.]
  - **Evidence**: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` exited 0 with 22 PASS rows and the final line `OK: parent-skill-check — all hard invariants passed, 0 warnings`, recorded fresh this phase.
- [x] CHK-011 [P0] `proceduresPath` consistency is confirmed across all five workflow modes [EVIDENCE: `mode-registry.json` declares `proceduresPath` for all five modes; all resolve on disk.]
  - **Evidence**: `mode-registry.json` declares `proceduresPath` for all five modes (`design-interface/procedures`, `design-foundations/procedures`, `design-motion/procedures`, `design-audit/procedures`, `design-md-generator/procedures`); all five directories exist on disk.
- [x] CHK-012 [P1] Procedure-card schema compliance is sampled [EVIDENCE: two sampled cards show all required fields in order.]
  - **Evidence**: Sampled `design-interface/procedures/aesthetic_direction.md` and `shared/procedures/polish_gate_orchestration.md` (one owning-mode card plus the shared bucket); both show Purpose/Owning mode/Source reference/Trigger/Output contract/Proof gate/Privacy rule in the required order from `procedure_card_schema.md`.
- [x] CHK-013 [P1] No implementation edit is planned or performed in `.opencode/skills/sk-design/**` [EVIDENCE: scoped `git status`/`git diff` shows zero changes.]
  - **Evidence**: `spec.md` Files-to-Change table lists only this phase folder's own docs and metadata; scoped `git status`/`git diff` for `.opencode/skills/sk-design`, `.opencode/commands/design`, and `.opencode/skills/sk-doc` shows zero changes from this phase's activity.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation is attempted for Phase 006 [EVIDENCE: `validate.sh --strict` run after metadata regeneration; result recorded in `implementation-summary.md`.]
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/009-sk-design-claude-parity/006-parent-skill-canon-verification --strict` is run after metadata regeneration; final exit code and any residual warning are recorded in `implementation-summary.md`.
- [x] CHK-021 [P0] Canon-doc gap is confirmed by direct read, not assumption [EVIDENCE: §4/§6 text read directly; both omit `procedures/`/`proceduresPath`.]
  - **Evidence**: `parent_skills_nested_packets.md` §4 sk-design row Notes column reads "Transform-verbs example with five mode packets and required hub-router vocabulary" (no `procedures/`/`proceduresPath` mention); §6 Companion file policy lists `README.md`/`SKILL.md`/`changelog/` for packets with no mention of `procedures/`.
- [x] CHK-022 [P1] Rule-of-Three cross-hub check is performed [EVIDENCE: grep under `sk-code` and `deep-loop-workflows` returned no matches.]
  - **Evidence**: `grep -rl "proceduresPath|procedures/"` under `.opencode/skills/sk-code` and `.opencode/skills/deep-loop-workflows` returned no matches; adoption is 1 of 3 documented hubs.
- [x] CHK-023 [P1] Negative control proves this phase touched zero implementation files [EVIDENCE: scoped `git status --short` shows no changes.]
  - **Evidence**: `git status --short` scoped to `.opencode/skills/sk-design`, `.opencode/commands/design`, and `.opencode/skills/sk-doc` shows no file changed by this phase's activity.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P0] ADR-001 is recorded with a clear formalize-vs-local recommendation [EVIDENCE: `decision-record.md` ADR-001 Accepted, 5/5 Five Checks PASS.]
  - **Evidence**: `decision-record.md` ADR-001 Status is Accepted, with Context, Decision, four scored Alternatives Considered, a 5/5 PASS Five Checks Evaluation, and Consequences.
- [x] CHK-006 [P0] Phase 007 handoff criteria are explicit [EVIDENCE: `spec.md` Related Documents and `implementation-summary.md` state sk-design-local.]
  - **Evidence**: `spec.md` Related Documents states Phase 007 must design an sk-design-local procedure-card template (Path B), not a new `sk-doc`-wide template family; `implementation-summary.md` restates the same handoff.
- [x] CHK-007 [P1] Reconsideration trigger for the ADR is named [EVIDENCE: `decision-record.md` names a second-hub-adoption trigger.]
  - **Evidence**: `decision-record.md` Consequences/Risks table names the trigger: revisit the ADR the moment a second hub proposes a comparable companion-directory pattern.
- [x] CHK-008 [P1] Out-of-scope items are stated plainly [EVIDENCE: `spec.md` Out of Scope section names all excluded items.]
  - **Evidence**: `spec.md` Out of Scope section names `.opencode/skills/sk-design/**`/`.opencode/commands/design/**`/`.opencode/skills/sk-doc/**` edits, `parent-skill-check.cjs` changes, procedure-card content edits, Phase 005's live/manual/browser gaps, and the unrelated `013-design-commands-asset-refactor` track as explicitly out of scope.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, private prompts, or unrelated user data are introduced [EVIDENCE: reviewed all Phase 006 docs and command output; none found.]
  - **Evidence**: Review of all Phase 006 docs and captured command output confirms no secrets, private prompts, or unrelated user data.
- [x] CHK-031 [P0] Public/private procedure boundary is described accurately, not altered [EVIDENCE: docs describe the existing `proceduresPath`/`toolSurface` boundary unchanged.]
  - **Evidence**: Docs describe the existing `proceduresPath`/read-only `toolSurface` boundary (four advisory modes forbid Write/Edit/Bash; `design-md-generator` alone mutates) without proposing any change to it.
- [x] CHK-032 [P1] Rollback path preserves unrelated work [EVIDENCE: `plan.md` §7 requires `git diff`/`git status` first.]
  - **Evidence**: `plan.md` §7 Rollback Plan requires `git diff`/`git status` inspection first; this phase makes no implementation edits, so rollback is limited to revising this phase folder's own docs.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/decision-record stay synchronized [EVIDENCE: this pass reconciled checklist/decision-record/implementation-summary with spec/plan/tasks.]
  - **Evidence**: This verification pass reconciled `checklist.md` and `decision-record.md` (ADR-001 Accepted) with the executed-state evidence already recorded in `spec.md`/`plan.md`/`tasks.md`, and created `implementation-summary.md` to match.
- [x] CHK-041 [P1] Docs do not claim implementation completion while Phase 006 execution remains unresolved [EVIDENCE: `spec.md`/`plan.md` Status fields read "Complete", backed by recorded evidence.]
  - **Evidence**: Phase 006 execution occurred; `spec.md`/`plan.md` Status fields now read "Complete" and this checklist/decision-record reconciliation reflects that same executed state — no doc claims completion that isn't backed by the evidence recorded above.
- [x] CHK-042 [P2] Optional handoff notes are recorded once execution completes [EVIDENCE: `implementation-summary.md` records the Phase 007 continuation note.]
  - **Evidence**: `implementation-summary.md` records the Phase 007 continuation note (sk-design-local procedure-card template, Path B).

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Authored docs and generated metadata stay inside the Phase 006 folder [EVIDENCE: file list confirmed inside this phase folder only.]
  - **Evidence**: File list includes `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` — all inside this phase folder.
- [x] CHK-051 [P1] Parent root, sibling phases, `external/**`, `research/**`, and unapproved `.opencode/skills/**`/`.opencode/commands/**` paths are not edited by this task [EVIDENCE: scoped `git status --short` confirms writes limited to this folder.]
  - **Evidence**: Scoped `git status --short` for `.opencode/skills/sk-design`, `.opencode/commands/design`, and this packet's spec tree confirms this phase's own writes are limited to its own folder; sibling phase 005/007-013 dirty state is pre-existing and unrelated to this phase's activity.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-06 — fresh canon-verification execution pass.
**Verified By**: claude-sonnet-5.
**Gate Status**: CLOSED. All P0/P1/P2 items are verified with fresh, phase-owned evidence: `parent-skill-check.cjs` exits 0, `proceduresPath` is consistent across all five modes, the `procedures/` canon-doc gap and Rule-of-Three cross-hub check are confirmed, and ADR-001 is Accepted.

<!-- /ANCHOR:summary -->
