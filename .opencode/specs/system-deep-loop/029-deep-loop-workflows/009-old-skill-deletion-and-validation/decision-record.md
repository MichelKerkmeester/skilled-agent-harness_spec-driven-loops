---
title: "Decision Record: Descope CHK-065 byte-identical parity replay"
description: "Why phase 009 descopes the byte-identical phase-001 parity rerun (CHK-065): the captured baseline is pre-merge source hashes at rewritten paths, so a byte-identical replay is unrecoverable; substitute behavioral-parity evidence is accepted instead."
trigger_phrases:
  - "CHK-065"
  - "byte-identical parity"
  - "phase-001 parity replay"
  - "deep-loop-workflows parity descope"
  - "decision record"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Descope CHK-065 byte-identical parity replay

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Descope the byte-identical phase-001 parity rerun

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | Operator (handover-directed), claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

CHK-065 required a full phase-001 parity rerun that is byte-identical for all five deep-loop modes and seven deep commands. The phase-001 baseline at `001-parity-baseline-and-runtime-ownership-adr/baseline/file-hashes.txt` holds 924 SHA-256 hashes, but those hashes are PRE-merge source-file hashes captured at the OLD paths (for instance `deep/ask-ai-council.md`, which the merge renamed to `deep/ai-council.md`, and the `deep_start-*-loop_*.yaml` command assets). The 152 merge intentionally moved, renamed, and path-rewrote the entire deep-loop surface into `deep-loop-runtime` plus `deep-loop-workflows`. Re-hashing the current tree against that baseline therefore reports roughly 924 expected mismatches, none of which signal a regression.

### Constraints

- No artifact-hash baseline was captured. Only pre-merge source hashes exist.
- No old-to-new path-rewrite map was recorded, so the baseline cannot be mechanically re-anchored onto the merged layout.
- The merge is already shipped on the branch, so re-running the original capture against the old layout is not reconstructable.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Descope the byte-identical replay requirement of CHK-065 and accept behavioral-parity evidence in its place.

**How it works**: CHK-065's literal byte-identical criterion is recorded as unrecoverable. Parity is evidenced instead by the 351 passing deep-loop-runtime tests plus the packet-156 wave-2 and wave-3 verifications (registry-to-reality routing, three-way agent mirror parity, and runtime-promotion checks). A true single-executor artifact replay, if ever wanted, is tracked as separate future work that would first capture a fresh artifact baseline against the merged layout.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Descope, accept behavioral parity (chosen)** | Honest about an unrecoverable baseline; leans on strong existing evidence (351 tests plus 156 reviews) | Leaves no byte-level artifact guarantee for the merge | 8/10 |
| Reconstruct a path-rewrite map and re-anchor the baseline | Would restore a file-hash comparison | No rename map exists; reconstruction is error-prone and high-effort for low marginal assurance over the test suite | 4/10 |
| Capture a fresh single-executor artifact baseline now and replay | Produces a real future baseline | Validates the post-merge state against itself, not parity with phase 001; large effort; cleanly separable from 009 | 5/10 |

**Why this one**: The baseline is genuinely unrecoverable as a byte-identical reference, and the merge's correctness is already covered by behavioral evidence that is both broader and more meaningful than a file-hash match.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The 009 sign-off stops asserting a claim it cannot honestly support (a byte-identical replay that is impossible to run).
- Completion evidence points to the strongest available proof of parity (351 runtime tests plus the 156 wave reviews).

**What it costs**:
- No byte-level artifact guarantee survives for the merge. Mitigation: behavioral test coverage plus the three-way mirror-parity check cover the functional surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A silent artifact-level regression escapes the behavioral tests | M | 351 runtime tests plus registry-to-reality and mirror-parity checks; a future single-executor artifact baseline can be added if a gap appears |
| The descope reads as work skipped rather than reasoned | L | This record states the unrecoverability and the accepted substitute evidence |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | CHK-065 is a P0; it must be resolved honestly before 009 can close. |
| 2 | **Beyond Local Maxima?** | PASS | Two reconstruction alternatives were weighed and scored before descoping. |
| 3 | **Sufficient?** | PASS | Behavioral parity evidence covers the functional surface the hash check would have. |
| 4 | **Fits Goal?** | PASS | Keeps the 009 gate sign-off truthful, which is the phase goal. |
| 5 | **Open Horizons?** | PASS | A fresh artifact baseline remains available as future work if a need appears. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `checklist.md` CHK-065 evidence updated to reference this record and the accepted substitute evidence. The box stays unchecked to mark a descoped, not verified, P0.
- No source or runtime change. This is a documentation and sign-off decision.

**How to roll back**: Delete this record and revert the CHK-065 evidence line in `checklist.md` to its prior "not cleanly replayable" wording. No code or data is affected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
