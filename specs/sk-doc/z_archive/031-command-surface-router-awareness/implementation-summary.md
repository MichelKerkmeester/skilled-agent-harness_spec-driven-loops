---
title: "Implementation Summary: Command-Surface Root ROUTER.md Awareness Remediation"
description: "Reconstructed implementation summary for the command-surface root ROUTER.md awareness remediation, derived from spec.md, plan.md, tasks.md and git history."
trigger_phrases:
  - "router awareness remediation summary"
  - "root router fleet gate summary"
  - "command surface router awareness closeout"
importance_tier: "high"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Summary: Command-Surface Root `ROUTER.md` Awareness Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-command-surface-router-awareness |
| **Completed** | Not recorded |
| **Level** | 2 |
| **Status** | Complete — all 4 phases shipped (Phase 2 resolved by Phase 1) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet closed the six gaps a deep-research audit found between the shipped root `ROUTER.md` parent-skill standard and the command, CI, doctor and documentation surfaces around it (`spec.md` §2). All four planned phases shipped, with requirements REQ-1 through REQ-5 satisfied by `tasks.md`'s record.

### Phase 1 — CI fleet-gate hardening

`.opencode/skills/*/ROUTER.md` was added to both the `push` and `pull_request` `paths:` blocks of `.github/workflows/routing-registry-drift.yml`, so editing a hub router now triggers the fleet check. `ROUTER.md` was added to `REQUIRED_BY_CLASS[CLASS_HUB]` in `skill-root-metadata-contract.cjs`, and `root-router-contract.cjs`'s `validateRootRouter` was wired into the class-H branch of `ci-skill-root-metadata.cjs`, reusing the frozen RRC codes rather than authoring a parallel validator.

### Phase 2 — Doctor fleet-ROUTER sweep

Resolved by Phase 1 with no new code: the `parent-skill` `/doctor` route already runs the fleet metadata gate without a `--skill` filter, so making that gate ROUTER-aware gave one invocation fleet-wide root `ROUTER.md` coverage across all seven hubs.

### Phase 3 — Documentation citation cleanup

Both `./smart-routing.md` links in `phase-detection.md` were repointed to `../../ROUTER.md`; the `smart-routing.md §N` citations in `sk-code-adapter.md` and `sk-code-known-deviations.md` were rewritten to `sk-code/ROUTER.md`; and the dangling `ANCHOR:smart-routing` references in the two deep-review playbook files were dropped while keeping the file pointer.

### Phase 4 — Template rename

`parent-skill-smart-routing-template.md` was renamed to `parent-skill-root-router-template.md` as a full leaf migration: `sk-doc/leaf-manifest.json` was regenerated, `sk-doc/ROUTER.md`'s leaf path was updated, and the live cross-references across create YAMLs, schema/reference docs and the runtime agent mirrors were updated. Frozen benchmark reports and historical spec docs were left as-is.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/routing-registry-drift.yml` | Modified | Added `.opencode/skills/*/ROUTER.md` to push and pull_request trigger paths |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs` | Modified | Added `ROUTER.md` to `REQUIRED_BY_CLASS[CLASS_HUB]` |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | Wired the root-router contract into the class-H branch |
| `.opencode/skills/sk-code/shared/references/phase-detection.md` | Modified | Repointed two dead legacy links to `../../ROUTER.md` |
| `sk-code-adapter.md`, `sk-code-known-deviations.md` (deep-alignment) | Modified | Rewrote legacy `smart-routing.md` citations to `sk-code/ROUTER.md` |
| Deep-review playbook files (two) | Modified | Dropped the dangling `ANCHOR:smart-routing` reference |
| `parent-skill-smart-routing-template.md` → `parent-skill-root-router-template.md` | Renamed | Removed the last legacy filename residue |
| `sk-doc/leaf-manifest.json`, `sk-doc/ROUTER.md`, live cross-reference surfaces | Modified | Followed the rename through the leaf manifest and cross-references |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`plan.md` routes implementation to deepseek/luna per operator directive, with each phase task self-contained and evidenced from `research/lineages/dsflashgo/research.md`. `tasks.md` records the phases as executed and done: Phase 1 at commit `3520c2bc31`, Phase 3 at commit `e07b5f2ae1`, Phase 4 at commit `b10fed2e4d` (operator chose the full leaf migration), and follow-up FU-1 at commit `fb54a91437`. Phase 2 required no separate delivery because the existing doctor route reuses the Phase 1 gate. `git log --follow` for this folder records a single archive-capture commit; the phase commits above touched files outside the folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix enforcement surfaces before cosmetics | `plan.md` §1 lands the two HIGH CI gaps first so the gate becomes authoritative before any documentation pass |
| Reuse `root-router-contract.cjs` in the class-H branch | The frozen RRC codes are the single contract; a parallel validator would drift |
| Phase 2 needs no new sweep | The parent-skill doctor route already runs the fleet gate fleet-wide, so making that gate ROUTER-aware was sufficient |
| Phase 4 as a full leaf migration | Compiled routing does not key on the leaf path, so a rename plus leaf-manifest and cross-reference updates replaced any compiled-routing rebuild |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet gate over the seven real hubs (`checked=13 passed=13`) | Recorded in `tasks.md` as exit 0 |
| Negative control: hub `ROUTER.md` removed | Recorded as exit 1 with `MISSING_REQUIRED_FILE` + `RRC-001` |
| `grep -c smart-routing.md` across the three Phase 3 files | Recorded as 0; new link target exists on disk |
| `ANCHOR:smart-routing` across both playbook files | Recorded as 0 |
| Leaf-manifest byte-drift `--check`, leaf/derived freshness (13/13), fleet gate exit, agent-mirror-sync gate | Recorded as passing |
| `git log --follow -- <folder>` | Contains only the archive-capture commit; no per-phase evidence recorded inside the folder beyond `tasks.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No implementation narrative was written at the time** The phase outcomes above are reconstructed from `spec.md`, `plan.md`, `tasks.md` and git history; command output was not re-run for this summary.
2. **FU-1 (stale `smart_routing.md` underscore comments)** Recorded in `follow-ups.md` as fixed at commit `fb54a91437`.
3. **FU-2 (two hubs legacy-serving with stale compiled manifests)** Left out of program scope and recorded in `follow-ups.md` as tracked by a separate planning packet.
<!-- /ANCHOR:limitations -->
