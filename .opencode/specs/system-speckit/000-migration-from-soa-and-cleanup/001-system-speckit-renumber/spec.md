---
title: "Feature Specification: Renumber system-speckit active packets above the archive ceiling"
description: "system-speckit z_archive is contiguous 001-025, but active tracked packets 001-016 overlap that archive range instead of continuing above it. Four untracked, zero-tracked-file stub directories (026-029) already squat on the correct number range with mismatched slugs from an abandoned prior attempt. This packet removes the stale stubs and order-preservingly git-mv's the 16 active packets to 026-041, then repairs the resulting self-referential path tokens."
trigger_phrases:
  - "system-speckit renumber active packets"
  - "system-speckit archive ceiling overlap"
  - "026-029 stub directory removal"
  - "spec-folder renumbering repair"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded renumber spec plan tasks checklist"
    next_safe_action: "Await operator go-ahead then execute Phase 2"
    blockers:
      - "Stub dirs 026-029 hold unrecoverable untracked content; need operator rm approval"
    key_files:
      - ".opencode/specs/system-speckit/z_archive/"
      - ".opencode/specs/system-speckit/001-cmd-memory-output/"
      - ".opencode/specs/system-speckit/026-graph-and-context-optimization/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-system-speckit-renumber-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Snapshot stub dirs before rm, or delete outright on operator confirm?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Renumber system-speckit active packets above the archive ceiling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` (planning only; execution runs in a dedicated sk-git worktree off `origin/skilled/v4.0.0.0`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/specs/system-speckit/z_archive/` is contiguous `001`-`025` (confirmed: 25 sequentially numbered archive folders, no gaps). The convention requires active (non-archive, non-`000`) packets to be numbered starting at archive-max + 1, i.e. `026`. Instead, the 16 active tracked packets are numbered `001-cmd-memory-output` through `016-cmd-speckit-family-rename`, directly overlapping the archive's own number range. Compounding the problem, four directories already occupy the correct `026-029` slots (`026-graph-and-context-optimization`, `027-xce-research-based-refinement`, `028-memory-search-intelligence`, `029-phased-spec-preference`) — but each is confirmed untracked by git (`git ls-files` returns 0 for all four) and each carries the **wrong** slug for its position: `026`'s slug matches active packet `002`'s slug, `027` matches `003`'s, `028` matches `004`'s, and `029` matches `007`'s. This is the signature of a stale, partially-executed prior renumber attempt that renamed a non-contiguous subset (skipping `005`/`006`) and was never completed, committed, or cleaned up. Two of the four stubs are also large (`026`: 470 files / 255M; `027`: 1,331 files / 26M) — they are not empty placeholders, they are substantial untracked working trees left behind.

### Purpose
Remove the four stale, mismatched-slug stub directories and order-preservingly renumber the 16 active packets to `026-041` (each keeping its own current slug, per the exact map in `plan.md`), so that `git ls-files`/`git mv` history is preserved as renames, the packet number line reads archive `001-025` immediately followed by active `026-041` with no overlap and no gap-filler, and every path token that spells the packet's own old location is repaired to match its new location.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the 4 untracked, mismatched-slug stub directories at `026`-`029` (after operator-approved handling of their ~281M of unrecoverable content — see blocker above).
- `git mv` the 16 active tracked packets `001-016` to `026-041`, each keeping its own existing slug (see `plan.md` §4 for the exact 16-row map), executed low target number first so no two directories ever collide on the same numeric prefix mid-sequence.
- Repair every qualified `system-speckit/<old-basename>` path token and every `| **Spec Folder** |` / `packet_pointer` metadata value that resolves to one of the 16 renamed packets, wherever it appears **inside** `.opencode/specs/system-speckit/**` (confirmed self-contained scope; see Requirements).
- Regenerate `description.json` and `graph-metadata.json` for all 16 moved packets (and any of their phase children) via `generate-description.js` + `backfill-graph-metadata.js`, run from the MAIN tree against the worktree's renamed paths.
- Verify with `bash validate.sh --recursive --strict` across the `system-speckit` track and confirm the packet-number-line invariant (archive max `025` < active min `026`).

### Out of Scope
- Renumbering, editing, or otherwise touching any other track (`cli-external-orchestration`, `skilled-agent-orchestration`, `system-code-graph`, etc.) — this packet is `system-speckit` only, per brief.
- Rewriting `z_archive/001-025` — the archive range is already contiguous and correct; it is the ceiling this packet renumbers *above*, not a rename target.
- Reindexing stale `descriptions.json` / memory-search entries beyond what `generate-description.js` + `backfill-graph-metadata.js` naturally refresh for the touched packets — a broader repo-wide reindex is a separate follow-up if one is still needed after this packet.
- Actually executing the `rm -rf` / `git mv` / regen / validate steps — this packet is planning-only; execution is a separate downstream workflow per `plan.md` §"EXECUTION (downstream, not now)".

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/system-speckit/026-graph-and-context-optimization/` | Delete (untracked) | Stale stub; wrong slug for position `026` (belongs to `002`'s content, not `001`'s); 470 files, 255M, 0 tracked. |
| `.opencode/specs/system-speckit/027-xce-research-based-refinement/` | Delete (untracked) | Stale stub; wrong slug for position `027` (belongs to `003`'s content, not `002`'s); 1,331 files, 26M, 0 tracked. |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/` | Delete (untracked) | Stale stub; wrong slug for position `028` (belongs to `004`'s content, not `003`'s); 14 files, 408K, 0 tracked. |
| `.opencode/specs/system-speckit/029-phased-spec-preference/` | Delete (untracked) | Stale stub; wrong slug for position `029` (belongs to `007`'s content, not `004`'s); 1 file, 0B, 0 tracked. |
| `.opencode/specs/system-speckit/001-cmd-memory-output/` -> `026-cmd-memory-output/` | Rename (`git mv`) | 7 tracked files. |
| `.opencode/specs/system-speckit/002-graph-and-context-optimization/` -> `027-graph-and-context-optimization/` | Rename (`git mv`) | 9,583 tracked files — largest repair surface. |
| `.opencode/specs/system-speckit/003-xce-research-based-refinement/` -> `028-xce-research-based-refinement/` | Rename (`git mv`) | 4,725 tracked files — large repair surface. |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/` -> `029-memory-search-intelligence/` | Rename (`git mv`) | 3,783 tracked files — large repair surface. |
| `.opencode/specs/system-speckit/005-rust-backend-rewrite-research/` -> `030-rust-backend-rewrite-research/` | Rename (`git mv`) | 10 tracked files. |
| `.opencode/specs/system-speckit/006-spec-gate-enforce-readiness/` -> `031-spec-gate-enforce-readiness/` | Rename (`git mv`) | 43 tracked files. |
| `.opencode/specs/system-speckit/007-phased-spec-preference/` -> `032-phased-spec-preference/` | Rename (`git mv`) | 17 tracked files. |
| `.opencode/specs/system-speckit/008-vitest-invariance-maintenance/` -> `033-vitest-invariance-maintenance/` | Rename (`git mv`) | 8 tracked files. |
| `.opencode/specs/system-speckit/009-cmd-merge-spec-kit-phase/` -> `034-cmd-merge-spec-kit-phase/` | Rename (`git mv`) | 7 tracked files. |
| `.opencode/specs/system-speckit/010-cmd-spec-kit-ux-upgrade/` -> `035-cmd-spec-kit-ux-upgrade/` | Rename (`git mv`) | 46 tracked files. |
| `.opencode/specs/system-speckit/011-spec-kit-ux-adoptions/` -> `036-spec-kit-ux-adoptions/` | Rename (`git mv`) | 6 tracked files. |
| `.opencode/specs/system-speckit/012-spec-kit-coco-sk-code-research/` -> `037-spec-kit-coco-sk-code-research/` | Rename (`git mv`) | 45 tracked files. |
| `.opencode/specs/system-speckit/013-spec-kit-auto-mode-noninteractive-contract/` -> `038-spec-kit-auto-mode-noninteractive-contract/` | Rename (`git mv`) | 49 tracked files. |
| `.opencode/specs/system-speckit/014-subphase-recatalog-and-archive/` -> `039-subphase-recatalog-and-archive/` | Rename (`git mv`) | 6 tracked files. |
| `.opencode/specs/system-speckit/015-base-files-renumbering-name-cleanup/` -> `040-base-files-renumbering-name-cleanup/` | Rename (`git mv`) | 18 tracked files; already carries a stale `packet_pointer` (`skilled-agent-orchestration/z_archive/090-...`) unrelated to this rename — flagged for repair alongside the rest. |
| `.opencode/specs/system-speckit/016-cmd-speckit-family-rename/` -> `041-cmd-speckit-family-rename/` | Rename (`git mv`) | 6 tracked files. |
| Every `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `implementation-summary.md` / `description.json` / `graph-metadata.json` under the 16 renamed trees that contains its own old `system-speckit/<old-basename>` path token | Modify (ref repair) | ~7,164 files / ~12,856 matching lines total for the combined old-basename pattern (self-contained; 0 hits confirmed outside `.opencode/specs/system-speckit/**`). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resolve the stub-content blocker before deletion | Operator has explicitly approved either (a) direct `rm -rf` of the 4 untracked stub directories, or (b) a snapshot-to-scratch step first, before Phase 2 of `plan.md` executes the removal. |
| REQ-002 | Remove the 4 stale stub directories | `ls .opencode/specs/system-speckit/026-graph-and-context-optimization .opencode/specs/system-speckit/027-xce-research-based-refinement .opencode/specs/system-speckit/028-memory-search-intelligence .opencode/specs/system-speckit/029-phased-spec-preference` all report "No such file or directory" before any of the 16 `git mv` operations run. |
| REQ-003 | Renumber all 16 active packets via `git mv` | `git status --porcelain` shows each moved packet's tracked files as `R ` (renamed), not paired `D`/`??` (delete + untracked-new); `git ls-files .opencode/specs/system-speckit/026-cmd-memory-output` through `.../041-cmd-speckit-family-rename` returns the same total tracked-file count as the pre-move baseline (18,359 files across the 16 packets). |
| REQ-004 | Repair self-referential path tokens | Post-rename, `rg -n "system-speckit/(00[1-9]\|01[0-6])-" .opencode/specs/system-speckit` returns no output (the qualified old-basename token no longer appears anywhere in the tree). |
| REQ-005 | Regenerate packet metadata offline from the MAIN tree | `generate-description.js` and `backfill-graph-metadata.js` run successfully (exit 0) for all 16 renamed packets (and any phase children), producing `description.json`/`graph-metadata.json` that reflect the new `026-041` paths. |
| REQ-006 | Preserve the packet-number-line invariant | `ls -d .opencode/specs/system-speckit/*/ \| grep -oE '^[0-9]{3}' \| sort -u` shows archive max `025` immediately followed by active min `026`, with no `001`-`016` or stray `017`-`025` directory remaining. |
| REQ-007 | Verify with strict recursive validation, no new errors | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <each-renamed-packet> --recursive --strict` error count, summed across all 16, is <= the summed baseline error count captured before the rename (delta <= 0). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Fix pre-existing unrelated metadata drift discovered in-flight | `015-base-files-renumbering-name-cleanup`'s stale `packet_pointer` (currently `skilled-agent-orchestration/z_archive/090-base-files-renumbering-name-cleanup`) is corrected to its true `system-speckit/041-base-files-renumbering-name-cleanup`-style location as part of the same ref-repair pass, or explicitly deferred with a documented reason. |
| REQ-009 | Capture a rename map audit trail | `plan.md` §4 (or an equivalent evidence file) records the exact 16-row source->target map actually executed, for future `git log --follow` traceability. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls -d .opencode/specs/system-speckit/z_archive/*/ | grep -oE '^[0-9]{3}'` (from within `z_archive/`) tops out at `025`, and `ls -d .opencode/specs/system-speckit/*/ | grep -oE '^[0-9]{3}' | sort -n | uniq` for the active tree starts at `026` and runs through `041` with no other prefix in `001-025` or `042+`.
- **SC-002**: `git log --follow --stat -- .opencode/specs/system-speckit/026-cmd-memory-output/spec.md` (and equivalents for the other 15) shows continuous history back through the pre-rename `001-cmd-memory-output/spec.md` path.
- **SC-003**: `rg -n "system-speckit/(00[1-9]|01[0-6])-"` over `.opencode/specs/system-speckit/**` returns zero matches post-repair.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber --strict` passes for this planning packet itself.
- **SC-005**: For each of the 16 renamed packets, `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet-path> --recursive --strict` reports an error count no greater than that same packet's pre-rename baseline (delta <= 0), per the regression-baseline-and-delta discipline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The 4 stub directories hold ~281M of untracked, git-unrecoverable content (`026`: 470 files/255M; `027`: 1,331 files/26M). | High if deleted without review — content is gone for good, no git history to restore from. | REQ-001 hard-blocks deletion on explicit operator approval; plan.md offers a snapshot-first alternative. |
| Risk | `git mv` on a 9,583-file (`002`) or 4,725-file (`003`) directory could be misinterpreted by git as delete+add instead of rename if run in awkward batches. | Medium — would lose `git log --follow` history continuity. | Use directory-level `git mv <old> <new>` (single command per packet, not per-file) so git's rename-detection sees the whole tree move atomically; verify with `git status --porcelain` showing `R` entries before committing. |
| Risk | Ref-repair touches ~7,164 files; a regex-only bulk replace could corrupt frontmatter YAML or unrelated numeric-looking strings that coincidentally match `00N-`/`01N-` patterns. | Medium — could introduce YAML parse errors or wrong renumbers. | Anchor the replacement to the qualified `system-speckit/<old-basename>` token specifically (not bare `00N-`), and re-run `validate.sh --strict` per packet after repair, per REQ-007. |
| Risk | `015-base-files-renumbering-name-cleanup` already carries a stale `packet_pointer` from an unrelated prior track/number (`skilled-agent-orchestration/z_archive/090-...`), showing packet_pointer drift already exists independent of this rename. | Low-Medium — a naive ref-repair pass that only looks for `system-speckit/<old-basename>` could miss packet_pointer values that were already wrong before this packet started. | Grep for literal path-shaped strings broadly (not only the exact expected old value) during ref repair; treat any stale `packet_pointer` found in-flight as REQ-008. |
| Dependency | `generate-description.js` / `backfill-graph-metadata.js` must be run from the MAIN tree (not the worktree) per the operator's established lesson from prior renumber work, since worktree `dist/` can be stale after a restart. | Blocks metadata regen if skipped | `plan.md` Phase 3 explicitly runs both scripts from the MAIN tree's `dist/` output, passing worktree paths as arguments. |
| Dependency | `bash validate.sh --recursive --strict` must be available and correctly detect phase children under the renamed packets (several of the 16 have their own nested phase-child subfolders). | Blocks verification if it silently skips children | Run `--recursive` explicitly (not relying on auto-detection) per REQ-007 and cross-check the reported child count against the pre-rename baseline. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — filesystem rename plus text-token repair, no runtime performance surface.

### Security
- **NFR-S01**: N/A — no auth, no secrets, no external data; purely internal spec-folder path hygiene.

### Reliability
- **NFR-R01**: The renumber must be re-runnable/idempotent at the phase level — if execution halts partway through the 16 `git mv` operations, re-running the remaining rows must not double-move an already-renamed packet (each row checks `[ -d <old> ]` before moving).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A — the 16 source packets and 4 stub targets are fixed, enumerated paths.
- Maximum length: N/A.
- Invalid format: A ref-repair regex that is too broad (e.g. bare `00N-` without the `system-speckit/` qualifier) could match unrelated numeric content inside spec bodies (task IDs, requirement IDs like `REQ-001`) — the repair MUST anchor on the qualified `system-speckit/<old-basename>` token, never on bare digits.

### Error Scenarios
- A renamed packet's own frontmatter `packet_pointer` still points at its pre-rename path after `git mv`: caught by REQ-004's post-rename `rg` sweep, must be zero before validation is claimed passing.
- `validate.sh --recursive --strict` reports a **higher** error count post-rename than the captured baseline for any of the 16 packets: per the Logic-Sync Protocol, HALT and escalate rather than silently accepting the regression.
- One of the 16 `git mv` targets already exists on disk (collision) because a stub wasn't fully removed first: HALT per the Four Laws (Law 4); re-verify Phase 2's stub-removal step completed before retrying the collided row.

### State Transitions
- Partial completion (some of the 16 renamed, some not): each row's target existence check (`[ -d <target> ]`) makes the remaining rows safely re-runnable without re-processing completed ones.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 4 stub deletions + 16 directory renames + ~7,164-file ref-repair surface (dominated by 3 very large packets: 9,583 / 4,725 / 3,783 tracked files each) plus metadata regen for all 16. |
| Risk | 10/25 | No production runtime touched; risk is entirely git-history preservation, untracked-content loss, and metadata-repair correctness — all mitigated by staged verification. |
| Research | 12/20 | Required confirming archive contiguity, stub untracked-status and slug mismatch, and confirming the ref-repair surface is 100% self-contained (verified via repo-wide grep with zero external hits). |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the 4 untracked stub directories be snapshotted to a scratch/backup location before `rm -rf`, given they hold ~281M of unrecoverable content, or is operator confirmation that they are pure abandoned-attempt leftovers sufficient? (See `_memory.continuity.blockers` above — this is the single hard gate before Phase 2 can execute.)
- Is the pre-existing `015-base-files-renumbering-name-cleanup` `packet_pointer` drift (pointing at an unrelated `skilled-agent-orchestration/z_archive/090-...` path) in scope for this packet's ref-repair pass (REQ-008), or should it be tracked as a separate follow-up?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
