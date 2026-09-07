---
title: "Feature Specification: Phase 4: fingerprint-stamp-regeneration"
description: "27 closed packets carry a hand-written sha256:<label> in the slot the continuity fingerprint owns, and the writer that is supposed to regenerate it cannot touch a value that is not already valid hex."
trigger_phrases:
  - "fingerprint stamp regeneration"
  - "malformed fingerprint closed packets"
  - "continuity writer regex gate"
  - "generated metadata integrity regeneration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: fingerprint-stamp-regeneration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/004-fingerprint-stamp-regeneration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 16 |
| **Predecessor** | 003-playbook-provenance-lines |
| **Successor** | 005-provenance-title-sweep |
| **Handoff Criteria** | Zero non-hex `sha256:` fingerprint values remain in `specs/`, all 27 touched packets validate strict and both `continuity-freshness` suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Recorded findings closure specification.

**Scope Boundary**: The 27 closed packets whose `implementation-summary.md` carries a hand-written `sha256:<label>` value, plus `runtime/cli/core/memory-metadata.ts`'s `stampCompletionFingerprintIfNeeded` function, which is the only sanctioned writer for this field.

**Dependencies**:
- `runtime/cli/validation/continuity-freshness.ts`'s `malformed_fingerprint` classification (added by child `017-completion-gate-and-catalog-alignment` in the parent research packet), which is how these 27 stamps were made visible in the first place.
- `runtime/cli/dist/spec-folder/generate-description.js` and `runtime/cli/dist/graph/backfill-graph-metadata.js`, the two generators every touched packet must re-run after its fingerprint changes.

**Deliverables**:
- `stampCompletionFingerprintIfNeeded` widened so it can regenerate a malformed `sha256:<label>` value, not only an already-valid hex one.
- All 27 packets' `implementation-summary.md` carrying a real, content-derived sha256 digest instead of a label.
- All 27 packets' `description.json` and `graph-metadata.json` regenerated to match.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
27 closed packets' `implementation-summary.md` carry a human-mnemonic value in the slot `_memory.continuity.session_dedup.fingerprint` reserves for a real sha256 digest, for example `sha256:phase-017-remediation-complete-25-commits` (`specs/system-speckit/026-graph-and-context-optimization/.../022-local-llm-legacy-remediation/implementation-summary.md`, one of 27 confirmed by direct grep against the exact `^[a-f0-9]{64}$` shape). Lane 005 round two's F2-14 found these and confirmed they classify as `malformed_fingerprint` in `continuity-freshness.ts:364-370` rather than the `missing_fingerprint` bucket a truly-never-recorded packet would fall into. Child `017-completion-gate-and-catalog-alignment` in the parent research packet recorded a decision NOT to rewrite them, reasoning that "rewriting closed packets' attestations would alter historical documents" (`confirmed-findings.md` F2-14). This phase reverses that decision: the 27 stamps are regenerated, not left as historical artifacts.

A planning-stage read of the sanctioned writer surfaced a second, previously unrecorded problem: `stampCompletionFingerprintIfNeeded` (`runtime/cli/core/memory-metadata.ts:411`) only touches a `session_dedup.fingerprint` field whose EXISTING value already matches `sha256:[a-f0-9]{64}` - its gating regex, `SESSION_DEDUP_FINGERPRINT_LINE_RE` at line 398, requires the pre-existing value to already be a well-formed 64-character hex digest before it will replace it. Run unmodified against any of the 27 target packets, the function silently no-ops: `if (!SESSION_DEDUP_FINGERPRINT_LINE_RE.test(content)) { return; }` (line 421-423) returns before ever computing a new fingerprint. Regenerating these 27 stamps through the sanctioned writer therefore requires widening that gate first. It cannot be done today by calling the existing function as-is.

### Purpose
Replace all 27 hand-written `sha256:<label>` stamps with real, content-derived digests through the sanctioned continuity-writer path, and widen that writer so it can actually perform the replacement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widening `stampCompletionFingerprintIfNeeded`'s match gate so it recognizes and replaces a malformed `sha256:<label>` value, in addition to the already-valid-hex case it handles today.
- Running the widened writer against each of the 27 packets listed in `tasks.md`'s Phase 2.
- Regenerating each touched packet's `description.json` (via `generate-description.js`) and `graph-metadata.json` (via `backfill-graph-metadata.js`) so `GENERATED_METADATA_INTEGRITY` and `METADATA_DISK_PATH_CONSISTENCY` stay green.
- Confirming each of the 27 packets validates `--strict` clean after regeneration.

### Out of Scope
- Any packet whose fingerprint is the zero placeholder (`sha256:000...0`, 1,890 of 3,247 summaries per F27) or genuinely missing - those are `missing_fingerprint`/`zero_fingerprint` cases, a fact about adoption rather than a malformed value, and are not touched by this phase.
- Any packet whose fingerprint is already well-formed hex (412 of 3,250 per F2-15's re-measurement) - already correct, nothing to regenerate.
- Rewriting the packets' spec.md, plan.md, tasks.md or any narrative content - only the `session_dedup.fingerprint` field and the two generated-metadata files it feeds are touched.
- Changing `continuity-freshness.ts`'s `malformed_fingerprint` classification logic itself - it is working exactly as intended (that is how these 27 were found). This phase makes the classification stop firing for these packets by fixing the data, not by weakening the check.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/cli/core/memory-metadata.ts` | Modify | Widen `stampCompletionFingerprintIfNeeded`'s match gate to also accept a malformed `sha256:<label>` value |
| 27 packets' `implementation-summary.md` (full list in `tasks.md` Phase 2) | Modify | `session_dedup.fingerprint` regenerated to a real content-derived digest |
| 27 packets' `description.json` (same 27 packets) | Modify | Regenerated via `generate-description.js` |
| 27 packets' `graph-metadata.json` (same 27 packets) | Modify | Regenerated via `backfill-graph-metadata.js` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `stampCompletionFingerprintIfNeeded`'s match gate is widened so it recognizes and replaces a malformed `sha256:<label>` value, since the current regex requires the existing value to already be valid hex before it acts. |
| REQ-002 | Each of the 27 packets' `implementation-summary.md` has its `session_dedup.fingerprint` regenerated via the widened writer, holding a real content-derived sha256 digest. |
| REQ-003 | Each of the 27 packets' `description.json` and `graph-metadata.json` are regenerated via `generate-description.js` and `backfill-graph-metadata.js` so `GENERATED_METADATA_INTEGRITY` still passes. |
| REQ-004 | `grep` over `specs/` for `fingerprint: "sha256:...")` values that are not exactly 64 lowercase hex digits (excluding the zero placeholder) returns zero matches. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Each of the 27 touched packets validates `--strict` clean (`RESULT: PASSED`) after regeneration. |
| REQ-006 | Both `continuity-freshness` suites (`runtime/tests/continuity-freshness.vitest.ts`, `runtime/cli/tests/continuity-freshness.vitest.ts`) pass, confirming none of the 27 still classifies as `malformed_fingerprint`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The grep from REQ-004, run over the full `specs/` tree, returns zero rows.
- **SC-002**: 27 of 27 touched packets print `RESULT: PASSED` from `validate.sh --strict`.
- **SC-003**: `npx vitest run continuity-freshness` (both suites) exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widening `SESSION_DEDUP_FINGERPRINT_LINE_RE` to match a malformed value could also start matching content it should not (e.g. a fingerprint field with trailing prose) | Medium: an over-wide regex could corrupt an unrelated field | Widen only the value-shape half of the pattern (accept any non-whitespace run after `sha256:`, not only 64 hex chars) while keeping the line-anchored, 6-space-indented, `fingerprint:` key-prefixed structure exactly as it is today |
| Risk | Rewriting a closed packet's attestation was previously a deliberate non-change (F2-14). Doing it now changes 27 historical documents | Medium: the packets are marked Complete, so an edit to their `implementation-summary.md` touches a document other tooling may treat as immutable | Confirmed this phase's brief explicitly reverses that decision. The mitigation is transparency, not caution: each packet's regeneration is a mechanical field replacement (fingerprint only), not a content rewrite, and is traceable to this phase's commit |
| Dependency | `generate-description.js` and `backfill-graph-metadata.js` must be re-run per packet after the fingerprint changes, or `description.json`'s `lastUpdated` and `graph-metadata.json`'s `derived.last_save_at` will drift from the new `implementation-summary.md` content | High if skipped: `GENERATED_METADATA_INTEGRITY` and `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS` would then fail for the touched packets | Confirmed both scripts exist at `runtime/cli/dist/spec-folder/generate-description.js` and `runtime/cli/dist/graph/backfill-graph-metadata.js`. tasks.md orders the regeneration step immediately after each fingerprint stamp |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regenerating 27 packets' fingerprint plus two generated-metadata files each is a bounded, one-time batch operation. No ongoing performance budget applies.

### Security
- **NFR-S01**: No new write capability beyond what `stampCompletionFingerprintIfNeeded`, `generate-description.js` and `backfill-graph-metadata.js` already have. This phase widens a match condition, not a write scope.

### Reliability
- **NFR-R01**: The widened writer must still no-op (not corrupt) a `session_dedup.fingerprint` field it cannot parse at all, matching today's behavior for genuinely unrecognizable content.
- **NFR-R02**: A packet that fails `--strict` after regeneration blocks that packet's completion, not the other 26 - the batch is processed packet by packet, not as one atomic transaction.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A malformed label containing characters the widened regex must still terminate on correctly (e.g. `sha256:022backfill-2026-05-14` mixes digits and letters right up against the `sha256:` prefix, `sha256:045008validatorspecdocintegrityimplsummary000000000000` is 48 characters of digits and letters with no separators) - both are in the 27-row list and must be matched and replaced.
- A packet whose `implementation-summary.md` has no `session_dedup.fingerprint` line at all: `stampCompletionFingerprintIfNeeded`'s existing `SESSION_DEDUP_FINGERPRINT_LINE_RE.test(content)` guard must still return false for these, unaffected by the widen (none of the 27 target packets are in this state, since all 27 were found via a grep that requires the field to exist).

### Error Scenarios
- A regeneration that changes `implementation-summary.md`'s fingerprint but the subsequent `generate-description.js`/`backfill-graph-metadata.js` run fails or is skipped: the packet is left in a worse state (drifted metadata) than before this phase touched it. tasks.md orders the three steps (stamp, describe, backfill) as one atomic per-packet sequence to prevent this.
- `hasAnyCompletionClaim` (the guard `stampCompletionFingerprintIfNeeded` checks before touching a file) returns false for one of the 27 packets: this would mean the packet is not actually recognized as complete, which is a data-quality finding in its own right and must be reported, not silently skipped.

### State Transitions
- Before: `malformed_fingerprint` warning from `continuity-freshness.ts`. After: either `content_stale`/`dirty_tree` (if the packet has other uncommitted drift) or a clean pass - not a masked warning.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 1 code file plus 27 packets x 3 files (81 generated/content files), all mechanical field regeneration |
| Risk | 12/25 | Touches closed-packet historical documents and a shared writer function. Bounded by the per-packet validate-strict gate |
| Research | 6/20 | The 27-packet list, the malformed-value shapes and the writer's regex gap are already fully characterized by this phase's own planning read |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The writer-regex gap was the one open question this phase's planning read needed to resolve, and it is resolved in the Problem Statement and REQ-001 above.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
