---
title: "Implementation Plan: Phase 4: fingerprint-stamp-regeneration"
description: "Widen stampCompletionFingerprintIfNeeded's match gate, then run it plus the two generators against each of the 27 packets in one atomic per-packet sequence."
trigger_phrases:
  - "fingerprint writer widen plan"
  - "twenty seven packet regeneration"
  - "generated metadata reconciliation plan"
  - "closed packet fingerprint rollback"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: fingerprint-stamp-regeneration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`runtime/cli/core/memory-metadata.ts`, compiled to `dist/`) |
| **Framework** | None. The continuity-writer + generator pipeline (`stampCompletionFingerprintIfNeeded` -> `generate-description.js` -> `backfill-graph-metadata.js`) |
| **Storage** | Spec-folder markdown and JSON files under `specs/` |
| **Testing** | Vitest (`continuity-freshness.vitest.ts`, both copies) plus `validate.sh --strict` per packet |

### Overview
Widen `stampCompletionFingerprintIfNeeded`'s value-match regex so it can replace a malformed `sha256:<label>` stamp, then run the stamp-describe-backfill sequence against each of the 27 target packets one at a time, validating `--strict` after each before moving to the next.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Widen-then-batch: one code change (the regex widen) unblocks a mechanical, per-packet three-step sequence (stamp, describe, backfill) applied 27 times.

### Key Components
- **`stampCompletionFingerprintIfNeeded`** (`core/memory-metadata.ts:411`): the sanctioned writer, widened so `SESSION_DEDUP_FINGERPRINT_LINE_RE` (line 398) accepts any non-whitespace value after `sha256:`, not only 64 hex characters, while keeping the line-anchored `      fingerprint:` structure unchanged.
- **`generate-description.js`**: regenerates `description.json`'s `lastUpdated` and derived fields from the now-changed `implementation-summary.md`.
- **`backfill-graph-metadata.js`**: regenerates `graph-metadata.json`'s `derived.last_save_at` and related fields to match.

### Data Flow
For each of the 27 packets: read `implementation-summary.md` -> call the widened `stampCompletionFingerprintIfNeeded` -> the function recomputes the digest via `buildContinuityFingerprint` against the zero-normalized content and writes it in place -> run `generate-description.js` against the packet -> run `backfill-graph-metadata.js` against the packet -> run `validate.sh --strict` against the packet and confirm `RESULT: PASSED` before moving to the next packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `core/memory-metadata.ts` (`stampCompletionFingerprintIfNeeded`, `SESSION_DEDUP_FINGERPRINT_LINE_RE`) | Sole sanctioned writer for `session_dedup.fingerprint` | Update: widen the value-match half of the regex | A unit-level check that the function now replaces a `sha256:<label>` value it previously skipped |
| `validation/continuity-freshness.ts` (`malformed_fingerprint` classification, line ~364) | Detects a non-hex `sha256:` value | Not a consumer of the widen. Its classification logic is unchanged, only the data it reads changes | `continuity-freshness.vitest.ts` (both copies) |
| 27 packets' `implementation-summary.md` | Hold the malformed stamps | Update: fingerprint field regenerated | Per-packet `validate.sh --strict` |
| 27 packets' `description.json`, `graph-metadata.json` | Generated metadata pair | Update: regenerated via the two generator scripts | `GENERATED_METADATA_INTEGRITY`, `METADATA_DISK_PATH_CONSISTENCY` rules within each packet's `validate.sh --strict` run |
| Every OTHER packet's `implementation-summary.md` (well-formed hex, zero placeholder or missing) | Not carrying a malformed stamp | Not a consumer. Out of scope per spec.md | The REQ-004 grep excludes them by construction (they already match `^[a-f0-9]{64}$` or are the zero placeholder) |

Required inventories:
- Same-class producers: `grep -rlE 'fingerprint:\s*"sha256:[^"]*"' specs --include="implementation-summary.md"` piped through a hex-shape filter confirms exactly 27 files carry a non-hex value. Re-run at the start of implementation to confirm the count has not drifted since planning.
- Consumers of the changed field: `rg -n "session_dedup.fingerprint\|attestationFingerprint" runtime/cli/validation/continuity-freshness.ts runtime/cli/core/memory-metadata.ts` finds the two files that read or write this field. Both are named above.
- Matrix axes: 27 packets x 3 files each (implementation-summary.md, description.json, graph-metadata.json) = 81 files touched, plus 1 code file = 82 total.
- Algorithm invariant: the widened regex must still reject a `session_dedup.fingerprint` line with no `sha256:` prefix at all (an entirely different field shape), and must still preserve the `      fingerprint:` 6-space indentation and optional trailing comment the line-anchor half of the pattern already encodes. Adversarial cases to check before completion: a label containing only digits (`022backfill-2026-05-14`), a label with no separators at all (`045008validatorspecdocintegrityimplsummary000000000000`), and the already-passing well-formed-hex case (must remain matched exactly as before, not double-matched).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Widened `SESSION_DEDUP_FINGERPRINT_LINE_RE` against the adversarial label shapes named in the affected-surfaces invariant | Manual `node -e` regex check against sample strings drawn from the 27-packet list |
| Regression | `malformed_fingerprint` classification stops firing on the 27 packets post-regeneration | `continuity-freshness.vitest.ts` (`runtime/tests/` and `runtime/cli/tests/` copies) |
| Per-packet gate | Full document/metadata consistency for each touched packet | `validate.sh --strict` run individually against each of the 27 packets |
| Fleet check | No non-hex `sha256:` value remains anywhere in `specs/` | The REQ-004 grep, run once at the end over the whole tree, not just the 27 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `runtime/cli/dist/spec-folder/generate-description.js` | Internal | Green | Confirmed present. Without it `description.json` would drift from the new fingerprint |
| `runtime/cli/dist/graph/backfill-graph-metadata.js` | Internal | Green | Confirmed present. Without it `graph-metadata.json` would drift |
| Two `continuity-freshness.vitest.ts` copies | Internal | Green | Confirmed present at `runtime/tests/` and `runtime/cli/tests/` |
| The 27-packet list itself | Internal, time-bound | Yellow | If another process regenerates one of the 27 before this phase runs, the packet drops out of scope naturally (REQ-004's grep would no longer find it). Re-run the discovery grep at the start of implementation rather than trusting this planning-time snapshot |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A packet fails `validate.sh --strict` after regeneration, or the widened regex is found to match content it should not.
- **Procedure**: `git revert` the commit(s) covering the affected packet(s) and, if the regex itself is at fault, the `core/memory-metadata.ts` commit. Because each packet is processed as an independent three-step sequence, a revert can target one packet without touching the other 26.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (re-confirm the 27-packet list, read the regex) ──┐
                                                          ├──► Core (widen the writer, then stamp/describe/backfill each of the 27 packets) ──► Verify (fleet grep + both suites)
Config (draft the widened regex pattern) ────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | 1 hour (re-confirm the 27-packet list, read the writer and its regex) |
| Core Implementation | Medium | 4-5 hours (widen the regex, then run the 3-step sequence 27 times with a strict-validate check after each) |
| Verification | Low | 1 hour (fleet grep plus both suites) |
| **Total** | | **6-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration beyond the fingerprint field itself and its two generated-metadata dependents
- [ ] No feature flag needed
- [ ] Each packet is processed and strict-validated independently, so a partial rollback (some packets regenerated, others not) leaves the tree in a valid state, not a half-migrated one

### Rollback Procedure
1. Stop before regenerating the next packet if the current one fails `validate.sh --strict`.
2. `git revert` the commit(s) for the failing packet.
3. Re-run that packet's `validate.sh --strict` to confirm the revert is clean, then decide whether to retry with a corrected approach or leave it for a follow-up.

### Data Reversal
- **Has data migrations?** No. This is a field-level content regeneration, not a schema migration.
- **Reversal procedure**: `git revert` restores the prior `sha256:<label>` value exactly, since no other content in the touched files is altered.
<!-- /ANCHOR:enhanced-rollback -->

---
