---
title: "Implementation Summary"
description: "323 spec documents had lost a required frontmatter value that their own template defines literally. A healer restored it across 137 packets and refused 107 documents whose correct value could not be proven from the document itself."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-spec-doc-healer"
    last_updated_at: "2026-09-11T07:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built the healer, applied it repository-wide, measured the result"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
    session_dedup:
      fingerprint: "sha256:202df11e2b9dea9aa0010e9cd88cbfce466725e1db27afd10bbb31016b675d6f"
      session_id: "2026-09-11-spec-doc-healer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-spec-doc-healer |
| **Status** | Complete |
| **Completed** | 2026-09-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

323 spec documents carried a required frontmatter field with no value, nearly always `trigger_phrases` written as an empty inline list. That fails validation and it also empties the retrieval index, because trigger phrases are how a packet gets found. The class had sat untouched because the existing repair tool refuses to author content, and this looked like content.

It is not. Every one of those fields has a literal default defined by the document's own template. The lost value is recoverable, not inventable, and that distinction is the whole packet.

### Phase 1: spec-doc-healer

The healer restores exactly that class and nothing else. For a template-source header it demands stronger evidence still: the document's own anchors must already match the template's anchor set, so naming the template is a finding rather than an assertion. Anything it cannot justify it leaves alone and says why.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/spec/heal-spec-docs.cjs` | Created | The healer, dry run by default |
| 326 spec documents | Modified | Empty required fields restored from template defaults |
| 148 packets' `graph-metadata.json` | Modified | Re-derived, because healing changes what the fingerprint attests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The dry run was built first and used as the census, so the measurement and the fix came from one tool rather than two that could disagree. It predicted 323 healable documents. The apply wrote 326, the difference being three files from the proof packet applied earlier. A prediction matching its outcome is the check worth having before a wide write.

The proof packet came first and ran end to end: a packet failing only on this class was healed, which cleared the frontmatter error and immediately raised a metadata integrity error, because the heal changed the content the fingerprint attests. Running the re-derive cleared that and the packet reached `RESULT: PASSED`. That is why the two tools chain rather than one being a follow-up someone might forget.

The first implementation of the empty-field check missed the case that mattered. It matched a bare key with nothing after it, while the form the scaffold actually leaves behind is an inline `[]`. The healer found nothing until that was fixed, which is a better failure than finding the wrong things.

The effect was measured before and after over the same five tracks rather than claimed. Three failures became two across 32 packets, four of five tracks reaching zero.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restore only literal template defaults | A value the template defines is recoverable. A title or description written for one packet is not, and guessing it would be authoring. |
| Gate the template header on an anchor match | The anchors are evidence the document came from that template. Writing the header without them asserts a provenance that may be false, and would just move the failure to the anchor rule. |
| Refuse loudly, with the missing evidence named | 107 refusals each say what was absent. A silent skip would leave the next person re-deriving the same conclusion. |
| Dry run by default | The census and the fix are the same code path, so the number reported is the number that will be written. |
| Chain the metadata re-derive | Healing invalidates the fingerprint. Leaving that to a separate step would trade one error class for another. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Dry-run prediction against apply | PASS. 323 predicted, 326 written, difference accounted for |
| Proof packet end to end | PASS. `RESULT: FAILED` to `RESULT: PASSED` with no hand editing |
| Refusals hold | PASS. 107 documents unchanged, each with its missing evidence named |
| Metadata re-derive | PASS. 148 packets, `failed=0` |
| Before and after, five tracks | PASS. 3 failures to 2, four of five tracks at zero |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The remaining failures need a person.** 34 documents have no frontmatter block and 73 lack the anchors that would identify a template. There is nothing to restore into and nothing to prove from, so no tool should close that gap.

2. **The measurement covers 32 packets, not 2,826.** Validating every packet takes hours, so the before-and-after is a real like-for-like on five tracks rather than a repository-wide claim.

3. **Zero failures is not reached and was never reachable this way.** The mechanical classes are clear. What is left is authored content on a small number of packets.

4. **The packet-name rule now lives in four places.** This tool, the repair script, the metadata writer and a pre-commit gate each carry their own copy. Nothing forces them to agree, which is the same class of problem that produced eight misreported failures earlier today.
<!-- /ANCHOR:limitations -->

---
