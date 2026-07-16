---
title: "Implementation Plan: Resolve system-deep-loop archive gap and active discontinuity (decision-gated)"
description: "Investigation-first plan: verify the exact archive/active number sets, trace both discontinuities to git history evidence, then gate all further action on an explicit operator choice between Option A (minimal, recommended) and Option B (full renumber, not recommended)."
trigger_phrases:
  - "system-deep-loop renumber plan"
  - "archive gap investigation plan"
  - "decision gate git mv"
  - "z_archive 012 root cause"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored plan documenting decision gate"
    next_safe_action: "Await operator Option A/B selection"
    blockers:
      - "Awaiting operator decision: Option A vs Option B (see spec.md Open Questions). No git-mv may run until this is answered."
    key_files:
      - ".opencode/specs/system-deep-loop/z_archive/"
      - ".opencode/specs/system-deep-loop/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the operator select Option A or Option B?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Resolve system-deep-loop archive gap and active discontinuity (decision-gated)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs, JSON metadata (`description.json`, `graph-metadata.json` — not authored by this packet), git history |
| **Framework** | system-spec-kit spec-folder conventions (naming, phase-parent pattern, gate protocol) |
| **Storage** | None — this is a documentation/decision packet, no database or runtime state |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

### Overview
Verify the exact archive and active packet number sets for `system-deep-loop` with `ls`, then use `git log` (rename detection and full-history `--follow`) to trace the archive-012 gap and a sample of the active gaps to specific commits. Present the two options (A: document-only, recommended; B: full active renumber, not recommended) as an explicit decision gate in every doc in this packet. No file outside this packet is touched; no `git mv`/`git rm` runs.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `ls z_archive/` sorted, prefixes extracted | `001`-`011`, `013`-`023` (22 folders) — confirms `012` is the only archive gap. |
| `ls system-deep-loop/` sorted, prefixes extracted | `029, 030, 031, 032, 033, 035, 038, 052, 054, 059, 063, 065, 066, 067, 068` (15 active folders) — confirms the exact active set and its internal gaps. |
| `git log --all --full-history -- '.opencode/specs/system-deep-loop/z_archive/012-deep-improvement-guarded-refine-hardening'` | One commit touches this path: `418edf13d87ff7235e8ccf713d2c8c5faf1afe04`, a full deletion, message explicitly names this folder as part of a documented Lane-D (`/deep:ai-system-improvement`) history scrub. |
| `git log --diff-filter=R --summary --all -- '.opencode/specs/system-deep-loop/z_archive/*'` | Confirms a prior bulk archive renumber (old scheme `010/012/013/020.../044` → new scheme `001/002/003/005.../023`) produced the current `001`-`023` sequence; the old-scheme `027-deep-improvement-guarded-refine-hardening` became new-scheme `012-...`, later deleted per above. |
| `find ... -iname "*<slug>*"` for 5 sampled active-gap slugs | 5/5 resolved to real, currently-active nested locations (e.g. `034-deep-router-agent-rename` → `052-deep-loop-unification/009-...`), all consistent with commit `233ea9564bb` ("regroup flat spec folders into phase-parents"). |
| `git log --diff-filter=R` over the `024`-`028` pre-start gap numbers | No rename hits — origin of this specific gap is UNKNOWN; not further chased per Option A's scope. |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Both options (A and B) have a stated blast radius and recommendation.
- [x] Dependencies identified: operator decision is the sole blocking dependency for any next step.

### Definition of Done
- [x] All four spec-folder docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) present the same decision gate without contradiction.
- [ ] Operator has selected Option A or Option B (tracked as an open question until answered; this packet's own scope ends at presenting the gate).
- [x] No repo file outside this packet's folder was modified.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Investigation-first documentation with an explicit decision gate — no source/runtime changes.

### Key Components
- **Verification step**: `ls` over both `z_archive/` and the active track, producing the authoritative number sets used everywhere in this packet.
- **Root-cause tracing**: `git log` (rename detection + full-history follow) used to explain, not assume, why each gap exists.
- **Decision gate**: Option A (recommended) vs Option B (not recommended), stated identically across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`.

### Data Flow
`ls` produces the raw number sets → `git log` explains the gaps found in those sets → the explained/unexplained split determines what Option A actually has to document → the operator's Option A/B answer determines whether any future execution packet is scoped at all.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the security/path/parser sense — this is a documentation/decision packet with no code change. The table below instead records the surfaces each OPTION would touch if later authorized, for planning transparency.

| Surface | Current Role | Action (this packet) | Action (if Option B later authorized) |
|---------|--------------|--------|--------------|
| `.opencode/specs/system-deep-loop/z_archive/012*` | Deleted (confirmed intentional) | Document finding only | No action — not a candidate for backfill |
| `.opencode/specs/system-deep-loop/029-*` .. `068-*` (15 folders) | Active packets | Document gaps only | `git mv` each to a contiguous `024-*` .. sequence |
| `.opencode/specs/system-deep-loop/graph-metadata.json` (`children_ids`, `derived.last_active_child_id`) | Graph/resume metadata | Flag staleness as a related finding | Would require full regeneration after any renumber |
| Every doc that cross-references an active packet number by path (specs, changelog, memory continuity pointers) | Consumers of the numbering | None | Would need a repo-wide inventory and update pass — explicitly the reason Option B is "not recommended" without its own dedicated packet |

Required inventories (for a future Option B packet only, not this one):
- Same-class producers: `rg -n 'system-deep-loop/0(29|30|31|32|33|35|38|52|54|59|63|65|66|67|68)-' .opencode .claude --glob '*.md' --glob '*.json'`.
- Consumers of changed paths: same pattern, scoped to `_memory.continuity.packet_pointer`, `graph-metadata.json` `children_ids`/`parent_id`, and any `handover.md`/`implementation-summary.md` cross-links.
- Matrix axes: 15 packets × {path rename, doc self-references, cross-doc references, graph-metadata `children_ids`/`parent_id`/`derived`, external pointers in other tracks' memory}.
- Algorithm invariant: not applicable (no algorithm) — the operative invariant for a future Option B packet would be "every reference to an old active number resolves to the same packet under its new number, with zero orphaned or dangling references."
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read templates (`spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `checklist.md.tmpl`) and the Level-2 reference packet's real docs.
- [x] `ls` both `z_archive/` and the active track; extract and sort exact number sets.
- [x] Confirm no active number overlaps any archive number (all active ≥ 29 > 23).

### Phase 2: Root-Cause Investigation
- [x] Trace archive slot `012` via `git log --all --full-history` on the exact former path; identify the deleting commit and read its full message.
- [x] Trace the prior archive bulk-renumber via `git log --diff-filter=R --summary --all` to confirm the `012` gap's provenance (old-scheme `027` → new-scheme `012`, later deleted).
- [x] Sample-trace ≥3 internal active gaps (used 5: `034`, `036`, `037`, `051`, `055`) via slug search + `git log --diff-filter=R`; confirm the phase-parent-regroup explanation.
- [x] Attempt to trace the pre-start gap (`024`-`028`); record as UNKNOWN when no rename evidence is found.
- [x] Note the stale `graph-metadata.json` `children_ids` entries as a related, out-of-scope finding.

### Phase 3: Decision Gate
- [ ] Present Option A (recommended) and Option B (not recommended) to the operator with the evidence above.
- [ ] Record the operator's answer in this packet's `_memory.continuity.answered_questions` (future update, not part of this scaffold).
- [ ] If Option A: this packet's documentation IS the fix — no further execution packet needed unless the operator also wants a note inside `z_archive` itself.
- [ ] If Option B: hand off to a new, separately-scoped implementation packet — do not expand this packet's scope to cover a ~15-packet / ~5,000-file renumber.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/002-system-deep-loop-renumber --strict` |
| Evidence reproducibility | Archive-012 finding | `git log --all --full-history -- '.opencode/specs/system-deep-loop/z_archive/012-deep-improvement-guarded-refine-hardening'` must show commit `418edf13d87ff7235e8ccf713d2c8c5faf1afe04` |
| Evidence reproducibility | Active-gap sample | `git log --diff-filter=R --summary --all -- '.opencode/specs/system-deep-loop/*'` must show the `233ea9564bb` regroup renames |
| Manual | No unauthorized file changes | `git status` shows only this packet's own new files after scaffolding |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator Option A/B decision | External (human) | Pending | All follow-on action stays blocked; this packet's own deliverable (the decision gate) is unaffected |
| Git history availability (`git log --follow`, rename detection) | Internal tool | Available | Would fall back to weaker evidence (directory diffing) if history were shallow/unavailable — not the case here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable in the usual sense — this packet makes no runtime or cross-file changes. If the operator later disputes a factual claim in this spec (e.g. a cited commit SHA), the fix is a doc correction, not a rollback.
- **Procedure**: `git rm -r` this packet's own folder (or `git revert` the commit that added it) fully undoes this packet with zero blast radius, since nothing outside its own folder was touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup/verify) -> Phase 2 (Root-cause investigation) -> Phase 3 (Decision gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup/verify | None | Root-cause investigation |
| Root-cause investigation | Setup/verify | Decision gate |
| Decision gate | Root-cause investigation | Any future execution packet (Option A note or Option B renumber) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup/verify | Low | 15-30 minutes |
| Root-cause investigation | Medium | 1-2 hours |
| Decision gate (presentation only) | Low | 15-30 minutes |
| **Total** | | **~2-3 hours (this packet only; excludes any future Option B execution)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or data migration in this packet.
- [x] `git status` reviewed to confirm only this packet's own new files are affected.
- [x] No `git mv`/`git rm` was run.

### Rollback Procedure
1. `git rm -r` this packet's folder, or `git revert` the commit that introduces it.
2. No secondary rollback needed — no other file was touched.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
