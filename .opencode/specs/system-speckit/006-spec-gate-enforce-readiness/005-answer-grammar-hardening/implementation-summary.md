---
title: "Implementation Summary: Answer-grammar hardening for the spec-gate Gate-3 parser"
description: "Planning stub - not yet implemented. Records the intended answer-grammar hardening for the spec-gate parser."
trigger_phrases:
  - "answer grammar hardening summary"
  - "spec-gate parser summary"
  - "answerParse implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/005-answer-grammar-hardening"
    last_updated_at: "2026-07-11T11:05:58.098Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning stub for answer-grammar hardening"
    next_safe_action: "Implement the parser change in spec-gate-core.mjs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-answer-grammar-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Answer-grammar hardening for the spec-gate Gate-3 parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-answer-grammar-hardening |
| **Status** | Planned - not yet implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Planning stub. Nothing is implemented yet. This phase will tighten the spec-gate answer parser so it stops false-closing the Gate-3 gate, recognizes natural answer forms, and hands the model an actionable deny message. Rewrite this section with real, evidence-backed results after the change lands.

### Planned change

The parser in `spec-gate-core.mjs` will tighten `SKIP_WORD_REGEX` and the standalone-letter-D skip path so only bare "skip"-class answers close the gate, broaden letter recognition to accept natural lead-ins ("option B"), and add a model-audience `GATE_3_DENY_DETAIL` returned from the `evaluateMutation` deny branch. An expanded `answerParse` corpus test is the acceptance gate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (planned) spec-gate-core.mjs | Modify | Tighten skip grammar, broaden letter forms, add model-audience deny detail |
| (planned) spec-gate-core.test.mjs | Modify | Expand the answer corpus and update the golden-loop deny-detail assertion |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Delivery will be verified by `node --test spec-gate-core.test.mjs` (0 false positives / 0 false negatives on the expanded corpus) and `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reword the deny detail only, keep the classify/advise surface on the user-facing question | The deny detail lands in the model context; the classify/advise question is relayed to the user |
| Stay open on ambiguous answers rather than closing | A false-open costs one re-ask; a false-close silences the guard for the whole session |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Parser change implemented | Not started |
| Expanded answer corpus | Not started |
| validate.sh --strict | Not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning stub only.** No code has changed; all results above are planned, not verified.
2. **Cross-question letter ambiguity is partial.** A bare "D" that answers a different question inside the open-gate window cannot be fully disambiguated by a stateless parser; the conservative design keeps standalone-D as skip and stays open otherwise.
<!-- /ANCHOR:limitations -->
