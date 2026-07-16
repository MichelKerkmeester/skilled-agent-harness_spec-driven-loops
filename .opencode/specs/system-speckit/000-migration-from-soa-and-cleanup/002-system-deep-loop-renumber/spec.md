---
title: "Feature Specification: Resolve system-deep-loop archive gap and active discontinuity (decision-gated)"
description: "system-deep-loop's z_archive numbering (001-023) is missing slot 012, and its active packet numbering starts at 029 rather than continuing from 024, leaving internal gaps. This packet investigates both gaps with real repo evidence and presents a decision gate before any git mv is attempted."
trigger_phrases:
  - "system-deep-loop archive gap"
  - "z_archive 012 missing"
  - "deep-loop active packet renumber"
  - "contiguous numbering decision"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Verified archive/active gaps, traced root causes"
    next_safe_action: "Present Option A vs B to operator"
    blockers:
      - "Awaiting operator decision: Option A (document gaps, no active renumber) vs Option B (full active renumber 029->024...). No git-mv may run until this is answered (see spec.md Open Questions)."
    key_files:
      - ".opencode/specs/system-deep-loop/z_archive/"
      - ".opencode/specs/system-deep-loop/graph-metadata.json"
      - ".opencode/specs/system-deep-loop/description.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the operator select Option A (recommended, minimal) or Option B (full active renumber, very-high-blast, not recommended)?"
      - "If Option A: is documenting the archive-012 finding in this packet sufficient, or does the operator want a short standalone note added inside z_archive itself?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Resolve system-deep-loop archive gap and active discontinuity (decision-gated)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` (no dedicated worktree; documentation-only packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`system-deep-loop`'s spec-folder numbering has two separate discontinuities:

1. **Archive gap**: `z_archive/` contains packets `001`-`023` but slot `012` is missing (verified: `ls` lists `001`-`011`, `013`-`023` — 22 folders, no `012`).
2. **Active discontinuity**: active (non-archived) top-level packets are `029, 030, 031, 032, 033, 035, 038, 052, 054, 059, 063, 065, 066, 067, 068` (15 folders, verified via `ls`). Active numbering starts at `029` rather than continuing from the archive's `023`, leaving a pre-start gap (`024`-`028`) plus internal gaps (`034`, `036`-`051` partially, `053`, `055`-`058`, `060`-`062`, `064`).

There is **no overlap** between archive (`≤023`) and active (`≥029`) — the naming convention this repo follows forbids overlap, not gaps, so neither discontinuity is a convention violation on its face. The open question is whether either gap represents a **lost/orphaned packet** that needs recovery, or whether both are inert side-effects of prior, already-completed repo work.

### Purpose

Establish, with verified repo evidence (not assumption), what each gap actually is; present the operator with a clear, decision-gated choice between a minimal documentation-only fix (Option A) and a full active-packet renumber (Option B); and block any `git mv`/`git rm` on that operator decision.

### Investigation Findings (verified 2026-07-16)

**Archive slot 012 — CONFIRMED intentional deletion, not a lost packet.**
`git log --all --full-history -- '.opencode/specs/system-deep-loop/z_archive/012-deep-improvement-guarded-refine-hardening'` shows the folder existed (created by an earlier bulk archive renumber — see below) and was fully deleted in commit `418edf13d87ff7235e8ccf713d2c8c5faf1afe04`, `"refactor(deep-loop): remove the ai-system-improvement (Lane D) mode — history scrub"`. That commit's message explicitly lists this folder as one of two dedicated Lane-D packets deleted in full, as part of scrubbing every remaining reference to the removed `/deep:ai-system-improvement` mode. This is a documented, verified, intentional deletion — **not** a packet that needs to be recovered, backfilled, or renumbered into.

That same investigation also surfaced why the archive was renumbered at all: `git log --diff-filter=R --summary --all` over `z_archive/*` shows a prior bulk rename mapped an older, gappier numbering scheme (`010→001`, `012→002`, `013→003`, `014→004`, `020→005` ... `044→023`) onto the current `001`-`023` sequence. That older-scheme `027-deep-improvement-guarded-refine-hardening` became the current-scheme `012-...` folder, which was then deleted by the Lane-D scrub above. The gap at `012` is a real, but fully explained and closed, historical fact.

**Active gaps — sampled and traced to a documented phase-parent regroup; NOT fully audited.**
`git log` shows commit `233ea9564bb` ("refactor(system-deep-loop): regroup flat spec folders into phase-parents") moved several formerly top-level packets to become phase children nested under other active top-level parents. A sample of the internal active gaps confirms this pattern:

| Former top-level number | Current location on disk |
|---|---|
| `034-deep-router-agent-rename` | `052-deep-loop-unification/009-deep-router-agent-rename` |
| `036-router-replay-surface-slice-sync` | `054-smart-routing-benchmark-program/013-router-replay-surface-slice-sync` |
| `037-scenario-loader-code-surface-sync` | `054-smart-routing-benchmark-program/014-scenario-loader-code-surface-sync` |
| `051-deep-loop-parent-skill-alignment` | `052-deep-loop-unification/010-deep-loop-parent-skill-alignment` |
| `055-deep-loop-divergent-mode` | `030-deep-loop-improved/012-deep-loop-divergent-mode` |

Retired top-level numbers were not reused when their packets were re-nested as phase children — this is the normal, expected effect of the phase-parent pattern this repo already uses (see §3 Phase Parent Mode in the global framework), not data loss.

The pre-active-start gap (`024`-`028`) was **not** traced to any rename or nesting event by this investigation (`git log --diff-filter=R` over those five numbers returned no hits) — its origin is **UNKNOWN**. Per Option A below, this is documented as a tolerated gap rather than further excavated, since the convention forbids overlap, not gaps, and no evidence points to a lost packet at those five numbers.

A related, out-of-scope observation: `.opencode/specs/system-deep-loop/graph-metadata.json`'s `children_ids` array still lists several of the now-nested former top-level paths (e.g. `system-deep-loop/034-deep-router-agent-rename`, `system-deep-loop/051-deep-loop-parent-skill-alignment`) plus one entry, `system-deep-loop/133-runtime-remediation-from-dogfood-findings`, that does not correspond to any folder found anywhere in the repo (**UNKNOWN** — possibly a stale/erroneous entry, possibly a planned-but-not-yet-created child from a different program). This metadata staleness is a separate, pre-existing issue from the numbering-gap decision this packet gates, and is called out in §7 Risks as a related follow-up, not actioned here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verifying the exact archive (`z_archive/001`-`023`) and active (`029`-`068`) number sets on disk.
- Tracing the archive-012 gap and a representative sample of the active gaps to concrete git history evidence.
- Presenting Option A (recommended) and Option B as a decision gate in `spec.md` and `plan.md`.
- Authoring decision-gated acceptance criteria in `checklist.md` that do not presuppose which option the operator picks.

### Out of Scope
- Any `git mv`, `git rm`, or renumbering script execution — this packet is planning/documentation only; execution is a separate, future packet gated on the operator's Option A/B answer.
- Other spec-kit tracks (`skilled-agent-orchestration`, `cli-external-orchestration`, `sk-doc`, etc.) — this packet is scoped to `system-deep-loop` only, per the brief.
- Fixing the stale `graph-metadata.json` `children_ids` array — noted as a related finding, not actioned here.
- Auditing every single active gap number individually — the pre-start gap (`024`-`028`) is documented as UNKNOWN rather than exhaustively traced, consistent with Option A's "tolerate gaps, don't chase every one" posture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| None (this packet) | N/A | This packet authors only its own spec-folder docs. No repo files outside `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber/` are touched. |
| `.opencode/specs/system-deep-loop/z_archive/**` (future, Option A only, if operator wants it) | Modify (docs only) | Optional: add a short historical note documenting the archive-012 deletion, if the operator wants it recorded inside `z_archive` itself rather than only in this packet. |
| `.opencode/specs/system-deep-loop/029-*` through `068-*` (future, Option B only) | Rename (`git mv`) | Only if the operator selects Option B: renumber 15 active packets and every internal cross-reference. Explicitly NOT executed by this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify exact archive and active number sets | `ls` output for both `z_archive/` and the active track, reproduced verbatim in this spec, matches the repo at time of writing. |
| REQ-002 | Investigate archive slot 012 with real evidence | A specific commit SHA and commit message are cited that account for the missing `012` slot; no unverified assumption is presented as fact. |
| REQ-003 | Present a genuine decision gate | Both Option A and Option B are described with their blast radius and a recommendation, and no `git mv`/`git rm` is executed pending the operator's answer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Sample-verify a subset of active gaps | At least 3 internal active-gap numbers are traced to their current on-disk location (or documented as UNKNOWN if untraceable). |
| REQ-005 | Flag the stale graph-metadata.json finding | The `children_ids` staleness and the unexplained `133-runtime-remediation-from-dogfood-findings` entry are recorded as a related, out-of-scope follow-up. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all present the same two-option decision gate with no internal contradiction.
- **SC-002**: The archive-012 finding cites a real commit SHA (`418edf13d87ff7235e8ccf713d2c8c5faf1afe04`) and a real commit message, independently reproducible via `git log --all --full-history -- '.opencode/specs/system-deep-loop/z_archive/012-deep-improvement-guarded-refine-hardening'`.
- **SC-003**: No file outside this packet's own folder is modified, renamed, or deleted by this packet.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Option B (full active renumber) touches ~15 packets and an estimated ~5,000 files plus every cross-reference (docs, `graph-metadata.json` `children_ids`, `derived.last_active_child_id`, any external pointers) | Very high — a single missed reference could silently break resume/graph traversal for an in-flight packet | Do not execute Option B without a dedicated, separately-scoped implementation packet with its own full inventory, dry-run, and rollback plan; this packet only documents the option, it does not authorize it |
| Risk | The pre-start gap (`024`-`028`) origin is UNKNOWN | Low — no evidence of a lost packet, but the gap is unexplained | Documented as UNKNOWN under Option A; can be revisited later if new evidence surfaces (e.g. a stray branch or reflog entry) |
| Risk | `graph-metadata.json` `children_ids` is stale (lists nested-away paths plus one untraceable entry) | Low-medium for graph/resume tooling that trusts `children_ids` verbatim | Out of scope here; flagged as a follow-up for whichever future packet next regenerates `system-deep-loop`'s graph metadata |
| Dependency | Operator decision (Option A vs Option B) | Blocks all follow-on execution work | This packet's sole purpose is to produce a clean, evidence-based decision point; see Open Questions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable — this packet is documentation/decision-gate only, no runtime behavior changes.

### Security
- **NFR-S01**: Not applicable — no secrets, auth, or executable code touched.

### Reliability
- **NFR-R01**: Any future execution packet (if Option B is selected) must preserve `graph-metadata.json` `derived.last_active_child_id` continuity for every renumbered packet, so resume tooling does not lose its place.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero active gaps traceable: if none of the sampled active gaps had resolved to a nested location, Option A's "tolerate gaps" recommendation would still hold, but the write-up would say so plainly rather than implying a pattern that wasn't observed.
- Archive slot found to be a real orphan (counterfactual): if the archive-012 investigation had found no deleting commit, this spec would have to recommend backfill/investigation instead of "documented, closed" — this did not happen, but the plan still names the fallback path for completeness.

### Error Scenarios
- Operator picks Option B: this packet does not proceed to execution — it hands off to a new, separately-scoped implementation packet, since Option B's blast radius exceeds this Level 2 documentation scope.
- Future contributor re-opens this question: the evidence trail (specific commit SHAs, `git log` commands used) is preserved in this spec so the investigation does not need to be redone from scratch.

### State Transitions
- Partial completion: not applicable — this packet has one deliverable (the four spec docs) and no partially-completable runtime state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four markdown files, zero code/runtime changes; the decision itself (if Option B) is high blast radius but that execution is explicitly out of scope here. |
| Risk | 14/25 | Low risk for this packet's own deliverables; the risk being scored is the *decision* this packet gates (Option B's blast radius), not this packet's own edits. |
| Research | 16/20 | Required tracing two independent numbering discontinuities through git history to specific commits rather than asserting cause. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the operator select Option A (recommended, minimal — document gaps, investigate-and-close archive slot 012, no active renumber) or Option B (full active renumber `029→024` ... contiguous, very-high-blast, NOT recommended)?
- If Option A: is documenting the archive-012 finding in this packet sufficient, or does the operator want a short historical note added inside `z_archive` itself?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
