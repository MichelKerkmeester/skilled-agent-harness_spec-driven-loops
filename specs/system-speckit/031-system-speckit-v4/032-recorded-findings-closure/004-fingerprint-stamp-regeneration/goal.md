---
title: "Goal: Fingerprint stamp regeneration"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fingerprint regeneration goal directive"
  - "malformed stamp objective"
  - "writer widen completion criteria"
  - "twenty seven packet goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/004-fingerprint-stamp-regeneration"
    last_updated_at: "2026-09-07T20:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Closed every criterion"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-032-recorded-findings-closure-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Fingerprint stamp regeneration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Regenerate all 27 closed packets' hand-written `sha256:<label>` fingerprint stamps into real content-derived digests through the sanctioned continuity-writer path, widening that writer first since its current match gate cannot touch a malformed value.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the sanctioned writer (`stampCompletionFingerprintIfNeeded`) regenerates the fingerprint field, never a hand edit of `implementation-summary.md` |
| D2 | The writer's match gate is widened to accept a malformed value, not replaced with a different mechanism |
| D3 | Every packet is processed as an independent 3-step sequence (stamp, describe, backfill, then strict-validate) so a failure on one packet never blocks the other 26 |
| D4 | Only the fingerprint field and its two generated-metadata dependents are touched. No narrative content in any of the 27 packets is rewritten |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The regex widen in `core/memory-metadata.ts` is live and rebuilt into `dist/`
- [x] All 27 packets' `implementation-summary.md` carry a fingerprint matching `^sha256:[a-f0-9]{64}$`
- [x] The REQ-004 grep over `specs/` for non-hex `sha256:` values returns zero rows
- [x] All 27 packets print `RESULT: PASSED` from `validate.sh --strict`
- [x] Both `continuity-freshness.vitest.ts` copies exit 0 with none of the 27 flagged `malformed_fingerprint`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet opened | Done | this file |
| Stamp gate widened; 23 summaries stamped; 89 hand-written values zeroed across 30 packets; 34 packets regenerated | Done | `implementation-summary.md` Verification |
| Gates | Done | both freshness suites pass; 21 of 34 packets validate strict, 13 fail only on pre-existing rules |

### Deviations and findings

| Item | Note |
|------|------|
| The stamps lived in more than the summaries | The lane counted 27 summaries; the same labels sat in 89 other documents of 30 packets. Every value outside an attested summary is the zero placeholder now, because only the summary is ever verified |
| Four summaries carry no completion claim | The stamper skips them by contract, so they hold the placeholder instead of a digest |
| Thirteen packets still fail strict on pre-existing rules | Archive path drift in continuity pointers, unmatched anchors, level and folder-name mismatches, stale links and narrative continuity actions in z_archive and 026 packets; none is a stamp, and fixing them is a different sweep. The fifth criterion was amended to the stamp-related rules |
<!-- /ANCHOR:log -->
