---
title: "Feature Specification: Archive-First Spec Renumbering, Global Spec-Drift Research, and Gated Memory-DB Teardown"
description: "Phase parent coordinating archive-first renumbering across five spec-kit tracks, a global spec-drift research sweep, and a gated memory-database teardown, sequenced so numbering and research finish before any destructive deletion"
trigger_phrases:
  - "000-migration-from-soa-and-cleanup"
  - "phase parent"
  - "archive-first renumbering"
  - "spec folder renumbering cleanup"
  - "gated memory database teardown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase parent spec with seven phases"
    next_safe_action: "Plan phase 001 speckit renumber"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "000-migration-from-soa-and-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Full renumber of 029-068 or minimal gap-012 fix only?"
      - "Does sk-doc alignment wait for migration merge to skilled/v4?"
      - "Source material for reconstructing sk-design packets 001-008?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Archive-First Spec Renumbering, Global Spec-Drift Research, and Gated Memory-DB Teardown

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/000-migration-from-soa-and-cleanup |
| **Predecessor** | None identified — first cross-track renumbering-and-teardown coordinator packet in this repo; the concurrent `sk-doc/017-hyphen-naming-convention` effort is an analogous but separate program this packet's phase 004 coordinates against, not a direct lineage predecessor |
| **Successor** | None pre-scoped (each numbering phase and the teardown phase may spawn independent follow-on packets under their own tracks; this parent stays numbered 000 as a temporary coordinator, an accepted exception to the archive-first numbering convention it enforces on others) |
| **Handoff Criteria** | All five numbering/reconstruction phases (001-005) are RESOLVED — completed OR intentionally operator-skipped (002/004 skipped 2026-07-16) — AND the phase 006 spec-drift research sweep converges with findings triaged, before phase 007's gated destructive teardown is authorized to run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five spec-kit tracks — `system-speckit`, `system-deep-loop`, `system-code-graph`, `sk-doc`, and `sk-design` — have active packet numbering that collides with or sits below their own `z_archive/` ceilings, plus assorted untracked stub/duplicate directories left behind by prior partial migrations (verified: `system-speckit` active packets `001-016` sit below archive ceiling `025`, with four of them — `002`, `003`, `004`, `007` — already shadowed by untracked, 0-file duplicate copies at `026-029`; `system-deep-loop`'s archive has a gap at `012` between `011` and `013`, and its active range `029-068` is internally discontinuous; `system-code-graph` carries two untracked, near-empty stub directories, `007-code-graph-buildout` and `009-advisor-codegraph-shared-features`, both below archive ceiling `024`; `sk-design`'s active range has a duplicate `003` folder and packets `001-008` exist only as untracked scratch/review artifacts, never as real numbered spec packets). Left unaddressed, this numbering drift makes archive-first traversal, `graph-metadata.json` derivation, and cross-packet linking unreliable, and it blocks a separately-needed memory-database teardown from being run safely, since a destructive DB operation must not execute while the spec tree it indexes is still mid-drift.

### Purpose
Sequence the fix so cleanup happens before anything destructive: renumber and reconstruct the five tracks' active packets to sit cleanly above their respective archive ceilings (phases 001-005), run a global spec-drift research sweep once the tree is stable (phase 006), and only then execute a gated, human-confirmed teardown of the memory database, its vector store, and its eval database (phase 007). This packet intentionally stays numbered `000` as a temporary coordinator — an accepted, explicit exception to the archive-first numbering convention it exists to enforce on the five tracks below it.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Numbering and reconstruction phases (001-005) run FIRST, in any order relative to each other** — each is an independently executable child scoped to exactly one track:
  - `system-speckit`: renumber active packets `001-016` to sit above archive ceiling `025`, reconciling the untracked `026-029` duplicate directories discovered during verification.
  - `system-deep-loop`: resolve the archive gap at `012` and decide (decision-gated) whether the active range `029-068` gets a full contiguous renumber or a minimal gap-only fix; flagged high-blast because active numbers are already referenced elsewhere in the repo.
  - `system-code-graph`: remove the two untracked, near-empty stub directories (`007-code-graph-buildout`, `009-advisor-codegraph-shared-features`) that sit below archive ceiling `024`.
  - `sk-doc`: coordinate and verify alignment with the LIVE concurrent sk-doc migration rather than performing an independent renumber; deferred until that migration's state is confirmed.
  - `sk-design`: reconstruct packets `001-008` as real numbered spec packets (today only untracked scratch/review artifacts exist), resolve the duplicate `003` folder collision, and clean the vendored/scratch content under `external/` and `review/` — landing on a clean `001-009` range alongside the existing `009-sk-design-claude-parity`.
- **Global spec-drift research (phase 006) runs SECOND**, only after all five numbering/reconstruction phases are complete: a 30-iteration divergent, 3-executor deep-research sweep across the whole spec tree for residual drift the numbering phases did not catch.
- **Gated memory-database teardown (phase 007) runs LAST**, only after phase 006 converges: destructive removal of the memory database, its vector store, and its eval database, gated behind explicit human confirmation.
- Root purpose and child phase manifest for this decomposition; per-phase implementation detail lives in each child folder.

### Out of Scope
- Detailed per-phase implementation plans, target number assignments, and file-by-file `git mv` manifests (live in each child's `plan.md`/`tasks.md`).
- Any renumbering of tracks not named in the Phase Documentation Map (`cli-external-orchestration`, `sk-code`, `sk-git`, `sk-prompt`, `system-skill-advisor`, `ai-systems`, `anobel.com`, `barter`, `mcp-tooling`, `z_future` are all untouched by this packet).
- Performing the sk-doc renumber itself (owned entirely by the concurrent sk-doc migration; phase 004 only coordinates/verifies).
- Any deletion of the memory database, vectors, or eval database ahead of phase 007's gate, or without the numbering/research phases having completed first.

### Files to Change
Summary of aggregate file scope; per-phase detail lives in each child's `plan.md`. Exact target paths and number assignments are decided inside each phase, not pre-committed here.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|--------------|
| `.opencode/specs/system-speckit/{001-016}-*/` (and untracked `026-029` duplicates) | Move | 001 | Renumber above archive ceiling `025`; reconcile duplicate untracked copies |
| `.opencode/specs/system-deep-loop/z_archive/012-*/` (gap) and active `029-068` range | Move | 002 | Resolve archive gap `012`; apply the decision-gated full-vs-minimal active renumber |
| `.opencode/specs/system-code-graph/{007-code-graph-buildout,009-advisor-codegraph-shared-features}/` | Delete | 003 | Remove 2 untracked stub directories below archive ceiling `024` |
| `.opencode/specs/sk-doc/**` (read-only verification) | Verify | 004 | Confirm alignment with the live concurrent sk-doc migration; no direct writes expected |
| `.opencode/specs/sk-design/{001-008}-*/`, `003-*` collision, `external/`, `review/` scratch | Create/Move/Delete | 005 | Reconstruct 001-008 as real packets, resolve the `003` collision, clean scratch/vendored content |
| Research findings (no spec-tree mutation beyond the phase's own folder) | Create | 006 | 30-iteration global spec-drift research sweep, 3 executors |
| `.opencode/skills/system-spec-kit/mcp_server/database/{context-index.sqlite,speckit-eval.db*,vectors/}` | Delete | 007 | Gated destructive teardown of memory DB, vectors, and eval DB (LAST) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-system-speckit-renumber/ | Renumber active `001-016` above archive ceiling `025`; reconcile the untracked `026-029` duplicate directories found during verification | Complete (a0991d173a) |
| 2 | 002-system-deep-loop-renumber/ | Resolve the archive gap at `012` (between archived `011` and `013`) plus the active-range discontinuity across `029-068`; decision-gated and high-blast because active numbers are already referenced elsewhere in the repo | Skipped (operator 2026-07-16) |
| 3 | 003-system-code-graph-cleanup/ | Remove the 2 untracked, near-empty stub directories (`007-code-graph-buildout`, `009-advisor-codegraph-shared-features`) sitting below archive ceiling `024` | Complete |
| 4 | 004-sk-doc-alignment/ | Coordinate and verify alignment with the LIVE concurrent sk-doc migration rather than an independent renumber; deferred pending that migration's state | Skipped (operator 2026-07-16) |
| 5 | 005-sk-design-reconstruct/ | Reconstruct packets `001-008` as real numbered spec packets, resolve the duplicate `003` folder collision, and clean scratch/vendored `external/` and `review/` content, landing on a clean `001-009` range | Complete (3eba33b020) |
| 6 | 006-global-spec-drift-deep-research/ | 30-iteration divergent, 3-executor deep-research sweep across the whole spec tree for residual drift, run after phases 001-005 are resolved (complete or operator-skipped) | Running |
| 7 | 007-memory-db-teardown/ | Gated, human-confirmed destructive teardown of the memory database, vector store, and eval database — runs LAST, only after phase 006 converges | Gated (destructive; needs fresh operator yes) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phases 001-005 (numbering and reconstruction) are independently executable in any relative order, and ALL five MUST be RESOLVED (completed or intentionally operator-skipped) before phase 006 begins; 002/004 were operator-skipped 2026-07-16
- Phase 006 (research) MUST converge before phase 007 (teardown) is authorized
- Phase 007 is destructive and MUST NOT begin until phases 001-005 are resolved AND phase 006 has converged — no exceptions
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-system-speckit-renumber | 006-global-spec-drift-deep-research | Active packets `001-016` renumbered above `025`; no duplicate/untracked directories remain in the track | `validate.sh --recursive --strict` on `system-speckit`; `git status --porcelain` clean for the track |
| 002-system-deep-loop-renumber | 006-global-spec-drift-deep-research | Archive gap `012` resolved; the full-vs-minimal active-renumber decision executed per the accepted decision record | `validate.sh --recursive --strict` on `system-deep-loop`; no orphaned cross-references to pre-renumber packet numbers |
| 003-system-code-graph-cleanup | 006-global-spec-drift-deep-research | Both untracked stub directories removed; no remaining active packets sit below archive ceiling `024` | `validate.sh --recursive --strict` on `system-code-graph`; `git status --porcelain` clean |
| 004-sk-doc-alignment | 006-global-spec-drift-deep-research | Concurrent sk-doc migration state confirmed and reconciled (merged or explicitly deferred with a recorded reason); no numbering conflict left open | Manual verification against the live sk-doc migration branch/worktree state |
| 005-sk-design-reconstruct | 006-global-spec-drift-deep-research | Packets `001-009` exist as real, validated spec packets with no duplicate numbering; scratch/vendored content cleaned or explicitly relocated | `validate.sh --recursive --strict` on `sk-design`; `git status --porcelain` clean |
| 006-global-spec-drift-deep-research | 007-memory-db-teardown | 30-iteration sweep converges; findings triaged and either remediated or explicitly deferred with a recorded reason | Research convergence report reviewed and accepted |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does `002-system-deep-loop-renumber` do a full contiguous renumber of all active packets (`029-068`, with internal gaps at `034`, `036-037`, `039-051`, `053`, `055-058`, `060-062`) or only the minimal fix of the archive gap at `012` — the full option is higher-blast because active packet numbers like `065` and `067` are already referenced in memory continuity, skill routing, and cross-packet links?
- What is the trigger condition for `004-sk-doc-alignment` to leave "deferred" status — does it wait for the LIVE concurrent sk-doc migration (`sk-doc/017-hyphen-naming-convention`, tracked in continuity memory against worktree branch `sk-doc/0042-017-authoring`) to merge to `skilled/v4`, or can it proceed once that migration's numbering scheme is merely confirmed stable?
- For `005-sk-design-reconstruct`, what is the source material for reconstructing packets `001-008` given git history shows no prior deletions under `sk-design/` — is this fresh authoring from the untracked review/research scratch content already on disk (session-audit logs, seat outputs, vendored `external/` reference repos), or recovery from an out-of-tree source?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
