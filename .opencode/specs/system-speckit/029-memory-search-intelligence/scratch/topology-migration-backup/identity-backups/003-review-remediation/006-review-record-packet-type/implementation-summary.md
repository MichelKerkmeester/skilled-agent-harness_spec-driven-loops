---
title: "Implementation Summary: Marker-Gated Review Packet Type in the Validator"
description: "The outcome of adding a marker-gated review packet type to the feature-spec validator, with the verification that proved it strictly additive two ways and the 009 demonstration that now validates clean at exit 0."
trigger_phrases:
  - "review packet type summary"
  - "review path validator outcome"
  - "additive validator change proof"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-review-remediation/006-review-record-packet-type"
    last_updated_at: "2026-07-06T19:16:40.092Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Closed the packet, review path shipped and proven strictly additive"
    next_safe_action: "Mark the remaining lean deep-review packets as review records"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/utils/template-structure.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Marker-Gated Review Packet Type in the Validator

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-review-record-packet-type |
| **Completed** | 2026-06-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A first-class review packet type for the feature-spec validator. Lean review-record packets carry a spec.md plus `review/review-report.md` and nothing else, and the validator always required the full Level 1 doc set, so every such packet tripped it. Each deep-review packet needed a manual retrofit of stub docs to pass, and the deep-loop-generated 009 packet still failed with several errors despite that work. The fix adds an additive, marker-gated `review` packet type. A spec.md carrying `<!-- SPECKIT_LEVEL: review -->` enters a review path that requires only spec.md and `review/review-report.md` and waives plan, tasks, checklist, implementation-summary, and decision-record. The marker is the sole entry into the path, so every existing Level 1, Level 2, Level 3, and phase folder is byte-unaffected.

The change spans both validator surfaces and the templates. `scripts/spec/validate.sh` teaches `detect_level` the review marker and lists it in the help text. `scripts/utils/template-structure.js` adds the review level, the review template path, and the review allowed-anchors. `templates/manifest/spec-kit-docs.json` adds the review level row, a review-record taxonomy, and the freeform review-report doc entry. `templates/manifest/review.spec.md.tmpl` is a new lean review spec template, a subset of the L1 spec anchors covering metadata, problem, scope, review-summary, and questions. On the production side `mcp_server/lib/templates/level-contract-resolver.ts`, `mcp_server/lib/validation/orchestrator.ts`, and `mcp_server/lib/validation/spec-doc-structure.ts` gain review handling and exclude the freeform review-report from the template-source, frontmatter-continuity, and sufficiency gates. `scripts/rules/check-files.sh` guards its numeric-level comparison so a string level does not crash. The work ships `scripts/tests/review-record-validation.vitest.ts` with four tests plus the `068-review-record-valid` and `069-review-record-missing-report` fixtures. As a demonstration, the 009-dark-flag-validation packet was marked a review record and now validates clean at exit 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/spec/validate.sh` | Modified | `detect_level` recognizes the review marker, help text lists it |
| `scripts/utils/template-structure.js` | Modified | The review level, template path, and allowed anchors |
| `templates/manifest/spec-kit-docs.json` | Modified | The review level row, taxonomy, and freeform report entry |
| `templates/manifest/review.spec.md.tmpl` | Created | The lean review spec template, a subset of the L1 anchors |
| `mcp_server/lib/templates/level-contract-resolver.ts` | Modified | The production resolver gains review handling |
| `mcp_server/lib/validation/orchestrator.ts` | Modified | The orchestrator routes the review path |
| `mcp_server/lib/validation/spec-doc-structure.ts` | Modified | Excludes the freeform report from three gates |
| `scripts/rules/check-files.sh` | Modified | Guards the numeric-level comparison against a string level |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Marker-gated additive path. A single `SPECKIT_LEVEL: review` marker is the only thing that routes a packet onto the review path, so the path is opt-in per packet and the default behavior is unchanged. Both validator surfaces read the same marker, the bash entry point and the compiled TypeScript services, so the result is consistent whether a packet is validated by the shell script or by the production dist. A numeric level still routes to the existing Level 1, Level 2, or Level 3 path verbatim, and only the review marker reaches the new review path, which is what keeps every pre-existing folder byte-unaffected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Gate the review path on a single marker | The marker as the sole entry is what makes the change strictly additive, so no existing folder is ever reclassified |
| Require only spec.md and the review report | Those are the real two docs a review record carries, so requiring more would force the stub-doc retrofit the change removes |
| Exclude the freeform review-report from three gates | The report is freeform output, so the template-source, frontmatter-continuity, and sufficiency gates do not apply to it |
| Guard the numeric comparison rather than special-case it | A string level must pass through the numeric rule without crashing, so a guard is the minimal safe fix |
| Leave 011 and 012 as Level 1 | They are feature packets, not review records, so converting them would misrepresent what they document |
| Demonstrate with the 009 packet | The deep-loop-generated 009 packet was the failing case, so proving it now passes is the strongest demonstration |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Unit | Pass | The four review-record tests cover the valid pass and the missing-report fail |
| Fixture | Pass | `068-review-record-valid` passes and `069-review-record-missing-report` fails as designed |
| Regression | Pass | The existing fixture suites return identical pass and fail results before and after, the pre-existing failures reproduce on a clean baseline |
| Baseline | Pass | A stashed-change rebuild of the dist to HEAD shows an unrelated phase-parent failure identical with and without the change |
| Demonstration | Pass | The 009 packet marked as a review record validates clean at exit 0 |

The change is strictly additive and proven two ways. The existing fixture suites behave identically before and after, and the separate baseline check confirms an unrelated failure is unchanged with and without the change. The new review fixtures behave correctly, the valid case passes and the missing-report case fails. The 011 and 012 packets were intentionally left as Level 1.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The review path is opt-in by marker.** A lean review record without the `SPECKIT_LEVEL: review` marker still validates as a feature packet and fails, by design, because the marker is the sole entry that preserves the additive guarantee.
2. **The remaining lean deep-review packets are not yet converted.** Only the 009 packet was marked as a review record to demonstrate the path, so other lean review packets still carry their retrofitted docs until marked.
3. **The 011 and 012 packets stay Level 1.** They document feature work rather than review records, so they were intentionally left as Level 1 feature packets.
<!-- /ANCHOR:limitations -->
