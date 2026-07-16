---
title: "Implementation Plan: Renumber system-speckit active packets above the archive ceiling"
description: "Order-preserving git mv of the 16 active system-speckit packets (001-016 -> 026-041), preceded by removal of 4 stale mismatched-slug untracked stubs, followed by self-referential path-token repair and offline metadata regen. Verification uses git status R-checks, scoped grep, and per-packet strict recursive validate.sh error-count deltas."
trigger_phrases:
  - "system-speckit renumber plan"
  - "026-041 git mv map"
  - "packet ref-repair plan"
  - "archive ceiling migration plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored git mv map and ref-repair steps"
    next_safe_action: "Open worktree then run Phase 1 baseline"
    blockers:
      - "Operator approval required before Phase 2's stub rm -rf (see spec.md REQ-001 / open questions)."
    key_files:
      - ".opencode/specs/system-speckit/z_archive/"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-system-speckit-renumber-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "generate-description.js usage confirmed via --help: `<folder-path> <base-path> [--description \"text\"] [--level N]`."
      - "backfill-graph-metadata.js usage confirmed via source header: `<spec-folder> [--dry-run]` for single-packet refresh (the mode this plan uses, not --all)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Renumber system-speckit active packets above the archive ceiling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-folder docs, JSON metadata (`description.json`, `graph-metadata.json`), git, Node.js (`generate-description.js`, `backfill-graph-metadata.js`), bash (`validate.sh`) |
| **Framework** | system-spec-kit spec-folder convention (archive/active number-line invariant) |
| **Storage** | Filesystem tree under `.opencode/specs/system-speckit/**`; no database, no runtime service |
| **Testing** | `bash validate.sh --recursive --strict` per packet; `git status --porcelain` for rename verification; scoped `rg` for ref-repair completeness |

### Overview
Four-stage source-first migration: (1) remove 4 stale untracked stub directories that squat on the target `026-029` number range with mismatched slugs from an abandoned prior attempt, (2) `git mv` the 16 active tracked packets from `001-016` to `026-041` low-target-first so no numeric prefix is ever occupied by two directories at once, (3) repair every self-referential `system-speckit/<old-basename>` path token and `packet_pointer`/`Spec Folder` metadata value found inside the renamed trees (confirmed 100% self-contained — 0 hits outside `.opencode/specs/system-speckit/**`), and (4) regenerate `description.json`/`graph-metadata.json` for all 16 packets from the MAIN tree and verify with strict recursive validation, comparing error counts against a pre-rename baseline.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `ls .opencode/specs/system-speckit/z_archive/` | Contiguous `001-025`, no gaps — confirms archive ceiling = `025`. |
| `git ls-files <026..029 stub dirs>` | 0 tracked files for all four — confirms they are pure untracked scratch, not live packets. |
| Stub slug comparison | `026` slug = `002`'s slug; `027` slug = `003`'s slug; `028` slug = `004`'s slug; `029` slug = `007`'s slug — confirms a non-contiguous, abandoned, wrong-target prior renumber attempt (skipped `005`/`006`, jumped to `007` at `029`). |
| `find <stub dirs> -type f \| wc -l` + `du -sh` | `026`: 470 files/255M; `027`: 1,331 files/26M; `028`: 14 files/408K; `029`: 1 file/0B — two of the four are substantial, not empty placeholders. |
| `git ls-files <each of 001-016>` | Tracked counts: 7, 9583, 4725, 3783, 10, 43, 17, 8, 7, 46, 6, 45, 49, 6, 18, 6 (sum 18,359). Packets `002`/`003`/`004` dominate the repair surface as flagged in the brief. |
| Per-old-basename `grep -rl "system-speckit/<old>"` | `001`:3, `002`:3533, `003`:1038, `004`:2578, `005`:9, `006`:39, `007`:8, `008`:9, `009`:3, `010`:3, `011`:3, `012`:3, `013`:3, `014`:3, `015`:3, `016`:3 files-with-match. |
| Combined-pattern `rg -n "system-speckit/(00[1-9]\|01[0-6])-"` repo-wide | 12,856 matching lines across 7,164 files total. |
| Same combined pattern, files outside `.opencode/specs/system-speckit/**` | **0** — the entire ref-repair surface is self-contained inside the tree being renamed; no cross-track repair is needed. |
| `.../015-base-files-renumbering-name-cleanup/*.md` frontmatter `packet_pointer` | Already reads `skilled-agent-orchestration/z_archive/090-base-files-renumbering-name-cleanup` — pre-existing drift unrelated to this rename, discovered in-flight (see spec.md REQ-008). |
| `node generate-description.js --help` | `Usage: generate-description.js <folder-path> <base-path> [--description "text"] [--level N]`. |
| `backfill-graph-metadata.js` source header | Single-packet mode: `<spec-folder> [--dry-run]`; repo-wide `--all` mode exists but is NOT used here (single-packet refresh only, per instruction). |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Archive ceiling (`025`) and active overlap (`001-016`) confirmed by direct `ls`/`git ls-files`.
- [x] Stub mismatched-slug pattern and untracked status confirmed for all 4 stub directories.
- [x] Ref-repair surface confirmed 100% self-contained (0 external hits).

### Definition of Done
- [ ] 4 stale stub directories removed (post operator approval).
- [ ] 16 active packets renamed `001-016 -> 026-041` via directory-level `git mv`, verified as `R` (rename) in `git status --porcelain`.
- [ ] Self-referential path tokens repaired to zero remaining matches for the qualified old-basename pattern.
- [ ] `description.json`/`graph-metadata.json` regenerated for all 16 packets from the MAIN tree.
- [ ] `validate.sh --recursive --strict` run per packet; summed error count <= pre-rename baseline (delta <= 0).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Order-preserving batch directory rename with post-hoc self-referential reference repair and offline metadata regeneration.

### Key Components
- **Stub removal**: the 4 untracked, mismatched-slug directories at `026-029` — must be cleared before any `git mv` targets those same numeric prefixes.
- **Rename map**: the 16-row `001-016 -> 026-041` map (below), each row keeping the SOURCE packet's own slug, executed in ascending target-number order.
- **Ref repair**: a scoped, qualified-token grep/replace pass confined to `.opencode/specs/system-speckit/**` (confirmed self-contained scope).
- **Metadata regen**: `generate-description.js` (2-arg: folder + repo-root) and `backfill-graph-metadata.js` (single-packet mode), run from the MAIN tree's `dist/` output against worktree paths.
- **Verification**: `validate.sh --recursive --strict` per renamed packet, compared against a captured pre-rename baseline.

### Data Flow
Git tracks each packet's files by content+path; a directory-level `git mv` re-parents all contained tracked files in one operation, which git's diff engine later resolves as per-file renames at commit time (verified via `git status --porcelain` showing `R`, not `D`+`??`). Ref repair then rewrites each moved packet's own internal path tokens (frontmatter `packet_pointer`, `| **Spec Folder** |` rows, and any other qualified `system-speckit/<old-basename>` string) to point at the new location. Metadata regen scripts then read the renamed tree and rewrite `description.json`/`graph-metadata.json` in place. `validate.sh` reads the final state and reports pass/warn/error counts per packet, which are diffed against the pre-rename baseline to satisfy the regression-baseline-and-delta discipline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `026-029` stub directories | Stale, untracked, mismatched-slug leftovers occupying the target number range | Snapshot-decision (operator) then `rm -rf` | `ls` on each reports "No such file or directory" post-removal |
| `001-016` active packet directories | Overlap the archive's own `001-025` number range | `git mv` to `026-041`, source slug preserved | `git status --porcelain` shows `R`; `git ls-files` count matches pre-move baseline |
| Frontmatter `packet_pointer` / `| **Spec Folder** |` rows inside the 16 moved trees | Self-referential pointer to the packet's own old path | Rewrite qualified `system-speckit/<old-basename>` token to the new `026-041` basename | `rg -n "system-speckit/(00[1-9]\|01[0-6])-" .opencode/specs/system-speckit` returns no output |
| `description.json` / `graph-metadata.json` for the 16 moved packets (and phase children) | Checked-in generated metadata, currently keyed to old paths | Regenerate via `generate-description.js` + `backfill-graph-metadata.js` from the MAIN tree | Script exit 0 for all 16; spot-check regenerated JSON contains the new `026-041` path |
| `015-base-files-renumbering-name-cleanup`'s pre-existing stale `packet_pointer` | Points at an unrelated `skilled-agent-orchestration/z_archive/090-...` path (drift predating this rename) | Correct in the same ref-repair pass (REQ-008) or explicitly defer with reason | Frontmatter reviewed and either fixed or deferral documented in `implementation-summary.md` |

Required inventories:
- Same-class producers: `rg -n "system-speckit/(001-cmd-memory-output\|002-graph-and-context-optimization\|003-xce-research-based-refinement\|004-memory-search-intelligence\|005-rust-backend-rewrite-research\|006-spec-gate-enforce-readiness\|007-phased-spec-preference\|008-vitest-invariance-maintenance\|009-cmd-merge-spec-kit-phase\|010-cmd-spec-kit-ux-upgrade\|011-spec-kit-ux-adoptions\|012-spec-kit-coco-sk-code-research\|013-spec-kit-auto-mode-noninteractive-contract\|014-subphase-recatalog-and-archive\|015-base-files-renumbering-name-cleanup\|016-cmd-speckit-family-rename)" .opencode/specs/system-speckit` — run once per packet immediately after that packet's `git mv`, so each row's repair is verified independently before moving to the next.
- Consumers of changed symbols: repo-wide `rg -n "system-speckit/(00[1-9]|01[0-6])-" .` confirmed 0 hits outside `.opencode/specs/system-speckit/**` during planning — downstream execution MUST re-run this exact repo-wide sweep after all 16 renames to confirm no new external reference appeared in the interim (regression-baseline-and-delta discipline: re-check the WHOLE gate, not just the touched tree).
- Matrix axes: (a) stub removal, (b) directory rename, (c) frontmatter/body token repair, (d) generated-metadata regen, (e) strict validation — all 5 axes must be executed per packet before the packet is considered done; a packet renamed but not ref-repaired is NOT complete.
- Algorithm invariant: at every intermediate step, no numeric prefix in `.opencode/specs/system-speckit/` may be occupied by more than one directory, and no active packet may carry a path token or `packet_pointer` value pointing at any location other than its own current path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Open a clean sk-git worktree off `origin/skilled/v4.0.0.0` (per brief's EXECUTION note; do not do this renumber on the shared working tree).
- [ ] Capture baseline: `bash validate.sh <each of the 16 packets> --recursive --strict` error counts (sum), and `git ls-files <each> | wc -l` (sum, expect 18,359) — before any edit.
- [ ] Re-run the repo-wide `rg -n "system-speckit/(00[1-9]|01[0-6])-" .` sweep one more time inside the fresh worktree to reconfirm the 0-external-hits finding still holds (repo state may have drifted since planning).

### Phase 2: Core Implementation
Exact source -> target map (source slug preserved on every row; execute in this ascending-target order so no numeric prefix is ever double-occupied):

| # | Source | Target |
|---|--------|--------|
| 1 | `001-cmd-memory-output` | `026-cmd-memory-output` |
| 2 | `002-graph-and-context-optimization` | `027-graph-and-context-optimization` |
| 3 | `003-xce-research-based-refinement` | `028-xce-research-based-refinement` |
| 4 | `004-memory-search-intelligence` | `029-memory-search-intelligence` |
| 5 | `005-rust-backend-rewrite-research` | `030-rust-backend-rewrite-research` |
| 6 | `006-spec-gate-enforce-readiness` | `031-spec-gate-enforce-readiness` |
| 7 | `007-phased-spec-preference` | `032-phased-spec-preference` |
| 8 | `008-vitest-invariance-maintenance` | `033-vitest-invariance-maintenance` |
| 9 | `009-cmd-merge-spec-kit-phase` | `034-cmd-merge-spec-kit-phase` |
| 10 | `010-cmd-spec-kit-ux-upgrade` | `035-cmd-spec-kit-ux-upgrade` |
| 11 | `011-spec-kit-ux-adoptions` | `036-spec-kit-ux-adoptions` |
| 12 | `012-spec-kit-coco-sk-code-research` | `037-spec-kit-coco-sk-code-research` |
| 13 | `013-spec-kit-auto-mode-noninteractive-contract` | `038-spec-kit-auto-mode-noninteractive-contract` |
| 14 | `014-subphase-recatalog-and-archive` | `039-subphase-recatalog-and-archive` |
| 15 | `015-base-files-renumbering-name-cleanup` | `040-base-files-renumbering-name-cleanup` |
| 16 | `016-cmd-speckit-family-rename` | `041-cmd-speckit-family-rename` |

- [ ] **T-stub**: Per operator's chosen path (spec.md REQ-001) — either snapshot `026-029` to a scratch/backup location, or proceed directly — then `rm -rf` all 4 stub directories. Verify with `ls` (all 4 report "No such file or directory") before touching any of the 16 source packets.
- [ ] **T-rename (x16)**: For each row above, in order: verify `[ -d <source> ]` and `[ ! -e <target> ]`, then `git mv <source> <target>`. Verify immediately with `git status --porcelain -- .opencode/specs/system-speckit/<target>` showing `R  ` entries (not `D`/`??` pairs).
- [ ] **T-ref-repair (x16)**: Immediately after each row's `git mv`, run the per-packet qualified-token grep (see FIX ADDENDUM inventories) and rewrite every hit inside that packet's own tree — frontmatter `packet_pointer`, `| **Spec Folder** |` rows, and any other literal `system-speckit/<old-basename>` string — to the new `026-041` basename. Do this packet-by-packet, not as one giant repo-wide regex pass, to keep the blast radius per step small and independently verifiable.
- [ ] **T-ref-repair-015**: While repairing `015` (row 15), also correct its pre-existing stale `packet_pointer` (`skilled-agent-orchestration/z_archive/090-...`) to its true new location, or explicitly defer with a documented reason in `implementation-summary.md` (REQ-008).

### Phase 3: Verification
- [ ] Run `node <MAIN-tree-dist>/spec-folder/generate-description.js <worktree-packet-path> <worktree-repo-root>` for each of the 16 renamed packets (and any phase children discovered under them).
- [ ] Run `node <MAIN-tree-dist>/graph/backfill-graph-metadata.js <worktree-packet-path>` (single-packet mode, no `--all`) for each of the 16 renamed packets.
- [ ] Re-run the repo-wide `rg -n "system-speckit/(00[1-9]|01[0-6])-" .` sweep; expect 0 matches anywhere.
- [ ] Run `bash validate.sh <each renamed packet> --recursive --strict`; sum the error counts and diff against the Phase 1 baseline — delta must be <= 0.
- [ ] Confirm the packet-number-line invariant: archive max `025` immediately followed by active min `026`, no `001-016` remaining, no gap.
- [ ] Update `implementation-summary.md` (authored during execution, not by this scaffolding pass) with the executed rename map, ref-repair evidence, and validation deltas.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rename integrity | Each of the 16 `git mv` operations | `git status --porcelain` (expect `R`), `git ls-files \| wc -l` (expect count match to baseline) |
| Ref-repair completeness | Self-contained `.opencode/specs/system-speckit/**` tree | `rg -n "system-speckit/(00[1-9]\|01[0-6])-"` (expect 0 matches) |
| Metadata regen | 16 packets' `description.json`/`graph-metadata.json` | `generate-description.js`, `backfill-graph-metadata.js` exit-code + spot-check content |
| Spec validation | Each of the 16 renamed packets, recursively | `bash validate.sh <packet> --recursive --strict`, error-count delta vs. baseline |
| Number-line invariant | Whole `system-speckit/` tree | `ls -d */ \| grep -oE '^[0-9]{3}' \| sort -u` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval for stub handling (REQ-001) | Decision | Pending (open question) | Phase 2 cannot start; ~281M of untracked content must not be deleted without explicit go-ahead. |
| Clean sk-git worktree off `origin/skilled/v4.0.0.0` | Tooling | Available (per brief's EXECUTION note) | Running the rename on the shared working tree risks colliding with other concurrent sessions' edits to `system-speckit/**`. |
| `generate-description.js` / `backfill-graph-metadata.js` in the MAIN tree's `dist/` | Internal script | Available (confirmed via `--help`/source header during planning) | Must fall back to rebuilding `dist/` from source if stale, per prior-lesson note in MEMORY. |
| `validate.sh --recursive --strict` | Internal script | Available (confirmed `--recursive` flag exists) | Verification cannot be claimed complete without it. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any `git mv` row collides with an existing target directory; `validate.sh` error-count delta is positive for any packet; ref-repair leaves any qualified old-basename token unrepaired after the full pass; or the operator has not yet approved stub handling.
- **Procedure**: For renamed packets, `git mv <target> <source>` reverses each row (git history is preserved either direction since these are tracked renames). For ref-repair edits, `git checkout -- <files>` restores the pre-repair content for any packet whose validation regressed. The 4 stub directories are untracked, so if a snapshot was taken before `rm -rf`, restore from that snapshot; if no snapshot was taken and deletion already ran, this step is irreversible — hence REQ-001's hard gate before any deletion.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: worktree + baseline) ──► Phase 2 (stub removal ──► 16x git mv ──► 16x ref repair) ──► Phase 3 (metadata regen ──► final grep ──► validate + delta)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator approval on stub handling | Core Implementation |
| Core Implementation | Setup (baseline + worktree) | Verification |
| Verification | Core Implementation (all 16 rows renamed + repaired) | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 minutes (worktree + baseline capture) |
| Core Implementation | High | 2-4 hours (16 renames dominated by 3 very large packets' ref-repair passes: 002 at 9,583 files, 003 at 4,725, 004 at 3,783) |
| Verification | Medium | 1-2 hours (16x recursive strict validate + final grep + metadata regen) |
| **Total** | | **~3.5-6.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Operator has explicitly approved stub handling (REQ-001) before Phase 2 starts.
- [ ] Baseline validate.sh error counts and tracked-file counts captured for all 16 packets (Phase 1).
- [ ] Execution happens in a dedicated sk-git worktree, not the shared branch.

### Rollback Procedure
1. If mid-rename: `git mv <target> <source>` for each already-moved row, in reverse order.
2. If ref-repair already ran on a row: `git checkout -- <affected files>` for that packet before reversing its rename.
3. Re-run `validate.sh --recursive --strict` on the restored packets to confirm they match the original baseline.
4. If stub removal already ran and a snapshot exists, restore the snapshot; if no snapshot exists, document the loss and escalate rather than silently proceeding.

### Data Reversal
- **Has data migrations?** No — this is a spec-folder filesystem/git-history reorganization, no database or runtime data migration.
- **Reversal procedure**: Git-based rename reversal for the 16 tracked packets (per above); snapshot restoration (if taken) for the 4 untracked stubs.
<!-- /ANCHOR:enhanced-rollback -->
