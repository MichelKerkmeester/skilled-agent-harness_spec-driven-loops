---
title: "Implementation Summary: Acceptance Criteria Template as Packet Closure Gate"
description: "What shipped: the gated acceptance-criteria document, the AC_CLOSURE gate with ADR-backed waivers, and the forward-only rollout."
trigger_phrases:
  - "acceptance criteria summary"
  - "ac closure shipped"
  - "closure gate implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/002-acceptance-criteria-template"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Built the acceptance-criteria template, contract entry and closure gate"
    next_safe_action: "Execute the reference sweep and close the remaining criteria"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh"
    session_dedup:
      fingerprint: "sha256:b7578d1c563567bd32f2c99424a0ae4410f3a9c0aa57556e394ca952c4eb6e5c"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-acceptance-criteria-template |
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Acceptance criteria now live in one document per packet, and that document decides whether the packet may be closed. Before this phase they were authored twice inside `spec.md` and traced separately in `checklist.md`, with coverage reported as a non-blocking advisory, so a packet could be marked complete with criteria nobody had met or consciously dropped.

### Acceptance criteria as a closure gate

Every Level 2, 3 and 3+ packet carries `acceptance-criteria.md`. Each row states a criterion in Given/When/Then form, names the evidence that proves it, and carries a status. A packet is closeable when every row is `Met`, `Waived` or `Superseded`. A row may only be waived or superseded by naming an ADR that actually exists in `decision-record.md` — a waiver pointing at nothing fails, because the recorded reasoning is the entire justification for dropping a criterion.

The gate does not disturb work in progress: an unmet row blocks only a packet that claims completion. Packets created before the rollout cutoff stay advisory, so the existing tree is untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `templates/addons/acceptance-criteria.md.tmpl` | Created | The gated document, rendering only at Levels 2, 3 and 3+ |
| `templates/spec-kit-docs.json` | Modified | Document entry, version, section gates, listed for Levels 2/3/3+ |
| `templates/core/spec.md.tmpl` | Modified | Acceptance-criteria column gated to Level 1; user-story criteria redirected |
| `scripts/rules/check-ac-closure.sh` | Created | The closure gate, including waiver verification and the cutoff |
| `scripts/rules/check-ac-coverage.sh` | Modified | Counts criteria from the canonical document, falling back to `spec.md` |
| `scripts/lib/validator-registry.json` | Modified | Registers `AC_CLOSURE` at ERROR severity with its flags |
| `references/validation/validation-rules.md` | Modified | Documents the rule and every failure mode |
| `mcp-server/ENV-REFERENCE.md` | Modified | Registers `SPECKIT_AC_CLOSURE` and `SPECKIT_AC_CLOSURE_CUTOFF` |
| `templates/README.md`, `templates/CONTRACT.md` | Modified | Publish the template in the manifest surfaces |
| `templates/examples/level-2\|3\|3+` | Modified | Worked examples carry the document; their specs drop the column |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Skill README Level contract |
| `README.md` | Modified | Public root README Level contract |
| `AGENTS.md` (`CLAUDE.md`) | Modified | Section 3 documentation-level table |
| `mcp-server/lib/config/spec-doc-paths.ts` | Modified | Adds it to the spec-document set so it is indexed |
| `mcp-server/lib/validation/spec-doc-structure.ts` | Modified | Its anchors are structure-validated like any authored doc |
| `mcp-server/lib/resume/resume-ladder.ts` | Modified | Surfaced on resume |
| `shared/parsing/spec-doc-health.ts` | Modified | Per-level health map realigned with the Level contract |
| `scripts/utils/template-structure.js` | Modified | Doc-to-template mapping, without which its template drift was undetectable |
| `.opencode/commands/speckit/assets/*.yaml` | Modified | Six workflow assets require it at Levels 2, 3 and 3+ |
| Level-contract reference documents | Modified | Seven surfaces describing the per-level document set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The template was verified by rendering it at every level and confirming Level 1 emits nothing while Levels 2, 3 and 3+ emit the document. The rule was verified against a purpose-built fixture covering eight cases, including the two the gate exists to catch: a completion claim carrying an unmet criterion, and a waiver citing an ADR that does not exist. Two real defects surfaced in that run — the table header `| AC-ID |` was being counted as a criterion, which both miscounted totals and produced false failures — and were fixed before integration. End-to-end integration was confirmed through `validate.sh --json`, which shows `AC_CLOSURE` reporting against this packet's own criteria.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `acceptance-criteria.md` is canonical; `spec.md` drops the column above Level 1 | One home per criterion; two homes drift (ADR-001) |
| A waiver must cite an ADR that exists | An unverified waiver turns the gate into theatre (ADR-001) |
| Listed under `optionalAddonDocs`, with `AC_CLOSURE` owning presence | `FILE_EXISTS` has no cutoff awareness and would have failed 2,588 packets (ADR-002) |
| Level 1 keeps its inline criteria | It has no acceptance-criteria document, so removing the column would delete criteria rather than relocate them |
| Unmet rows block only a completion claim | The gate governs closing, not working |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Template level gating | PASS - Level 1 renders 0 lines; Levels 2, 3, 3+ render 53 |
| Closure-rule fixture, 8 cases | PASS - all eight behave as specified after the header-row fix |
| Post-cutoff packet missing the document | PASS - fails with the required-document message |
| Completion claim with an unmet criterion | PASS - fails |
| Waiver citing a missing ADR | PASS - fails |
| Waiver citing a real ADR | PASS - closeable |
| Pre-cutoff packet | PASS - reported advisory, never blocked |
| `spec.md` column gating | PASS - Level 1 keeps the column, Level 3 drops it |
| End-to-end through `validate.sh --json` | PASS - `AC_CLOSURE` reports against this packet |
| Existing packet regression | PASS - `docs 2` still resolves to the three core documents only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Packet age is read from the `Created` row of `spec.md`.** A packet with no readable date is treated as pre-cutoff and stays advisory. This fails open by design: an unreadable date should not manufacture a blocking error.
2. **The Level contract alone does not show the document is mandatory.** It is listed as optional so that `FILE_EXISTS` stays cutoff-blind; the requirement is stated in the Level tables and in `validation-rules.md` instead (ADR-002).
3. **`scripts/spec/upgrade-level.sh` is broken independently of this work.** It resolves `templates/addendum/level2-verify/checklist.md`, a path that no longer exists, so every L1 to L2 upgrade fails and rolls back. Reported, not fixed: it sits outside this packet's scope lock.
<!-- /ANCHOR:limitations -->

---
