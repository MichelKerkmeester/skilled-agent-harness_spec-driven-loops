---
title: "Tasks: sk-design 012 Program Merge"
description: "The executable task list + authoritative source→target rename map for merging sk-design 012–018 into one multi-phased 012 parent (5 themed phases). Every git-mv is enumerated; parents with diverse children dissolve, tight sub-workstreams (012/007, 015/009) stay nested. Executed phase-by-phase by GPT-5.6-SOL-medium-fast agents; the orchestrator verifies each phase against the tree."
trigger_phrases:
  - "sk-design 012 merge tasks rename map"
  - "source target git-mv map program merge"
  - "sk-design 012 018 move map"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/000-program-merge-design"
    last_updated_at: "2026-07-22T15:35:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the source-target rename map"
    next_safe_action: "Operator signs off the map"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/000-program-merge-design/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-000-merge-design-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: sk-design 012 Program Merge

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done. Each task cites its verification.
- **Executor:** GPT-5.6-SOL-medium-fast agents do the mechanical moves/edits per the map; the orchestrator
  verifies each phase (findings are hypotheses, confirmed against the tree) before the next phase starts.
- **Moves are `git mv` ONLY** (history-preserving). No content merges except the two documented single-child
  "dissolve-flatten" cases; even those move the child's docs verbatim (no prose rewrite).
- **Dissolve vs nest rule:** a source phase-parent whose children are thematically DIVERSE *dissolves* — its
  children become L3 packets under the target theme, and the parent's lean-trio is discarded (fresh metadata
  regenerated for the theme). A source parent whose children are ONE tight sub-workstream *stays nested* as an
  L4 sub-parent.
  - **Dissolve:** `014` (single child), `015` (9 diverse children), `016-hallmark-adoption` (4 children → all
    hallmark, redistributed as L3).
  - **Stay nested (L4):** `012/007-gap-remediation-research` (4-child research unit) and
    `015/009-manual-testing-playbook-and-db-readme` (2-child readme unit).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] **T1.1** Re-verify preconditions: `git status` clean at v4 (`HEAD == origin/skilled/v4.0.0.0`); memory
  daemon stopped (0 `context-server` writers). Abort if dirty or a writer is live.
- [ ] **T1.2** Allocate a worktree number via `sk-git/scripts/worktree-naming.sh create sk-design 012-program-merge origin/skilled/v4.0.0.0`; create the worktree from `origin/skilled/v4.0.0.0`. ALL moves happen here, never in the primary tree.
- [ ] **T1.3** Capture the pre-merge baseline: `git ls-tree -r --name-only origin/skilled/v4.0.0.0 -- .opencode/specs/sk-design/01[2-8]` saved to the packet as `baseline-tree.txt`, for the content-diff gate.
- [ ] **T1.4** Freeze the map below as the single source of truth. Any operator edit to theme names/numbers is applied HERE before Phase 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### The source→target map (authoritative)

All targets are under `.opencode/specs/sk-design/012-<program-slug>/`. The program slug for the umbrella `012`
is decided at execution (proposal: `012-sk-design-program`); `<P>` below = that folder.

#### Phase `<P>/001-research/`  (all research work)

| # | Source (committed v4) | Target |
|---|-----------------------|--------|
| M01 | `012/001-research-style-database` | `<P>/001-research/001-research-style-database` |
| M02 | `012/002-research-design-commands` | `<P>/001-research/002-research-design-commands` |
| M03 | `013-styles-database-rust-opportunities` | `<P>/001-research/003-styles-database-rust-opportunities` |
| M04 | `014-hallmark-design-skill-research/001-research` | `<P>/001-research/004-hallmark-design-skill-research` (014 parent dissolves; single child flattens up) |
| M05 | `012/007-gap-remediation-research` **(+ its 4 children `001-restructure`, `002-naming-manifests`, `003-db-fate`, `004-commands`)** | `<P>/001-research/005-gap-remediation-research/…` (stays nested, L4) |

#### Phase `<P>/002-style-database/`  (the style DB build + evolution)

| # | Source (committed v4) | Target |
|---|-----------------------|--------|
| M06 | `012/003-style-database` | `<P>/002-style-database/001-style-database` |
| M07 | `015/001-foundation` | `<P>/002-style-database/002-foundation` |
| M08 | `015/002-js-capabilities` | `<P>/002-style-database/003-js-capabilities` |
| M09 | `015/003-measured-native` | `<P>/002-style-database/004-measured-native` |
| M10 | `015/004-growth` | `<P>/002-style-database/005-growth` |
| M11 | `015/005-library-restructure` | `<P>/002-style-database/006-library-restructure` |
| M12 | `015/006-persistent-db-activation` | `<P>/002-style-database/007-persistent-db-activation` |
| M13 | `015/007-styles-folder-readmes` | `<P>/002-style-database/008-styles-folder-readmes` |
| M14 | `015/008-styles-readme-create-readme-alignment` | `<P>/002-style-database/009-styles-readme-create-readme-alignment` |
| M15 | `015/009-manual-testing-playbook-and-db-readme` **(+ its 2 children `001-playbook-realign-and-relocate`, `002-database-readme-speckit-alignment`)** | `<P>/002-style-database/010-manual-testing-playbook-and-db-readme/…` (stays nested, L4) |
| — | (`015` parent dissolves after its 9 children move) | — |

#### Phase `<P>/003-interface-commands/`  (the /interface:* commands)

| # | Source (committed v4) | Target |
|---|-----------------------|--------|
| M16 | `012/004-interface-commands` | `<P>/003-interface-commands/001-interface-commands` |
| M17 | `012/006-retire-design-alias-namespace` | `<P>/003-interface-commands/002-retire-design-alias-namespace` |
| M18 | `012/008-interface-command-rewrite` | `<P>/003-interface-commands/003-interface-command-rewrite` |
| M19 | `012/009-interface-command-research-refactor` | `<P>/003-interface-commands/004-interface-command-research-refactor` |
| M20 | `012/010-interface-command-benchmark` | `<P>/003-interface-commands/005-interface-command-benchmark` |

#### Phase `<P>/004-hallmark-design-system/`  (hallmark adoption build)

| # | Source (committed v4) | Target |
|---|-----------------------|--------|
| M21 | `016-hallmark-adoption/001-surgical-fixes` | `<P>/004-hallmark-design-system/001-surgical-fixes` |
| M22 | `016-hallmark-adoption/002-evidence-envelopes` | `<P>/004-hallmark-design-system/002-evidence-envelopes` |
| M23 | `016-hallmark-adoption/003-authored-cards` | `<P>/004-hallmark-design-system/003-authored-cards` |
| M24 | `016-hallmark-adoption/004-brand-first-lane` | `<P>/004-hallmark-design-system/004-brand-first-lane` |
| — | (`016-hallmark-adoption` parent dissolves after its 4 children move) | — |

#### Phase `<P>/005-reviews-and-remediation/`  (reviews + remediation record) — resolves the duplicate 016

| # | Source (committed v4) | Target |
|---|-----------------------|--------|
| M25 | `012/005-review-remediation` | `<P>/005-reviews-and-remediation/001-review-remediation` |
| M26 | `016-session-shipped-work-review` | `<P>/005-reviews-and-remediation/002-session-shipped-work-review` **(duplicate-016 resolved — no folder keeps the bare `016`)** |
| M27 | `017-remediation-program-review` | `<P>/005-reviews-and-remediation/003-remediation-program-review` |
| M28 | `018-post-review-remediation` | `<P>/005-reviews-and-remediation/004-post-review-remediation` |
| M29 | `012/` parent's loose artifact dirs `alignment/` + `review/` (program-level review/alignment lineages, NOT phase children) | `<P>/005-reviews-and-remediation/000-program-review-artifacts/{alignment,review}/` |

### After the moves (same phase, still on the worktree)

- [ ] **T2.1** Execute M01–M29 via `git mv`, **leaves before parents**. Do NOT touch file *content* yet.
- [ ] **T2.2** Reduce the `<P>` umbrella to a lean-trio phase-parent: rewrite its `spec.md` as the program
  **historic-context narrative** (root purpose + the 5-phase map only; no merge/migration narration);
  regenerate `description.json` + `graph-metadata.json`. Remove any non-trio docs the old `012` parent
  carried (`plan.md`/`tasks.md`/`checklist.md` etc. — their content is historical and belongs to children).
- [ ] **T2.3** Metadata regeneration, **children before parents**: for every moved leaf and the two nested
  sub-parents run `generate-description.js <folder> <repo-root> --level N` then
  `backfill-graph-metadata.js --spec-folder <folder>`; then the 5 theme phase-parents (lean-trio); then the
  `<P>` root last. Verify `children_ids` on each parent.
- [ ] **T2.4** Rewrite `packet_pointer` in every moved doc's frontmatter to its new path (grep sweep → 0
  stale pointers).
- [ ] **T2.5** Fix inter-packet cross-references broken by the moves (compute new paths from the map FIRST,
  then rewrite, so no link points at a transient path). Known cross-refs to check: `018`→`017`,
  `012/009`→`012/008`, `012/010`→`012/008`/`012/009`, `015/*` inter-child, `016-adoption`→`014` research.
- [ ] **T2.6** Author `<P>/retrospective.md` — a program retrospective (shipped / planned-but-missed /
  opportunities), each claim citing the source packet's `spec.md`/`implementation-summary` status. This is
  the distinct deliverable the operator asked for ("see what was done… if we missed planned things or if
  there are opportunities"). SOL agent with a structured schema; orchestrator fact-checks citations.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T3.1** `validate.sh --recursive --strict` on the merged `<P>` → Errors:0.
- [ ] **T3.2** Content-diff gate: for every moved doc, diff its new blob vs its pre-merge v4 blob
  (`git show origin/skilled/v4.0.0.0:<old-path>`). ONLY `packet_pointer` / cross-ref-path lines may differ;
  any prose delta FAILS (guards against the daemon-style truncation seen this session).
- [ ] **T3.3** `git log --follow` on a sample of moved files → full history intact (proves `git mv`, not
  copy+delete).
- [ ] **T3.4** Grep sweep → 0 stale `packet_pointer`s, 0 broken relative cross-ref links, bare `016` gone.
- [ ] **T3.5** Confirm the 7 old top-level folders (`013`–`018`, both `016`s) no longer exist; only the one
  multi-phased `<P>` remains.
- [ ] **T3.6** `git rm -r` this `000-program-merge-design` packet (operator decision D2 = delete after merge),
  as the FINAL step, after all gates pass.
- [ ] **T3.7** Commit (conventional, per sk-git) + push to `skilled/v4.0.0.0` (allowlisted) only after
  orchestrator sign-off; reconcile the primary checkout (ALWAYS #15 — never force-sync a dirty primary tree).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All 29 moves executed via `git mv`; 5 themed phases populated; duplicate `016` resolved.
- `validate.sh --recursive --strict` Errors:0; content-diff shows zero lost prose; `git log --follow` intact.
- `<P>` root reads as the program narrative; `retrospective.md` present with per-packet citations.
- `000-program-merge-design` deleted; the 7 old top-level folders gone; pushed to v4; primary tree reconciled.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — REQ-001..010 (the acceptance envelope), target tree, edge cases.
- `decision-record.md` — D1 (full thematic regroup), D2 (delete 000 after merge), D3 (theme names/map).
- `plan.md` — the 5-phase execution flow + rollback (throwaway worktree).
- `checklist.md` — the acceptance gates cross-checked at completion.
- `system-speckit/031-memory-reindex-embed-performance/handover.md` — WHY the daemon must stay stopped for
  the whole merge (it corrupts tracked source docs).
<!-- /ANCHOR:cross-refs -->
