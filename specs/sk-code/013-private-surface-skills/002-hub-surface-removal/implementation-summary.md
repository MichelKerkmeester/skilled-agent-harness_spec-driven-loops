---
title: "Implementation Summary"
description: "Phase 002 in progress: 226 staged deletions and 15 modified files apply T001 to T038 uncommitted in the main checkout, with T039 partial and T040 to T108 still to run."
trigger_phrases:
  - "hub surface removal implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/002-hub-surface-removal"
    last_updated_at: "2026-10-24T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied T001 to T038 uncommitted in the main checkout; T039 partial"
    next_safe_action: "Finish T039 (code-quality-standards.md lines 16, 24, 39, 49, 56), then continue at T040"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/mode-registry.json"
      - ".skilled/skills/sk-code/hub-router.json"
      - ".skilled/skills/sk-code/ROUTER.md"
      - ".skilled/skills/sk-code/SKILL.md"
      - ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-hub-surface-removal"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-hub-surface-removal |
| **Status** | In progress (~35%); all work uncommitted in the main checkout |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase removes the Webflow and Obsidian example surfaces from the shipped `sk-code` hub so it carries only `sk-code-quality`, `sk-code-review` and `sk-code-skilled`. Work so far is in the worktree only: both surface packet folders are staged for deletion (226 files, content stays reachable at `42b41dd286`), and the routing registries, the leaf manifest, `ROUTER.md`, `SKILL.md` and the shared references are edited down to the one shipped surface.

### Phase 2: hub-surface-removal

T001 to T038 are applied and T039 is mid-edit. The stage-one router now declares three modes, one surface axis entry, three router signals and eleven vocabulary classes, and `generate-leaf-manifest.cjs --check` confirms the regenerated manifest matches its source. `ROUTER.md` carries zero `webflow|obsidian` lines while `verify-router-sync.cjs` still prints `router-sync: 5/5 checks passed` against the edited file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-webflow/`, `.skilled/skills/sk-code/sk-code-obsidian/` | Deleted (staged, 226 files) | Both surface packets leave the tracked tree; content stays reachable at `42b41dd286` |
| `.skilled/skills/sk-code/mode-registry.json` | Modified | One-surface `description`, `surfaces: ["sk-code-skilled"]`, three `modes` |
| `.skilled/skills/sk-code/hub-router.json` | Modified | Three-entry `tieBreak` and `routerSignals`; eleven vocabulary classes |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerated | Names no removed packet; `--check` prints `leaf-manifest.json OK` |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Sections 1-11 stripped; whole-file `webflow|obsidian` count 0 |
| `.skilled/skills/sk-code/SKILL.md` | Modified | One-surface identity, routing examples, detection, layout and backend prose |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modified | Contract reduced to SKILLED and UNKNOWN |
| `.skilled/skills/sk-code/shared/README.md` | Modified | Surface pointer rows stripped |
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | Modified | WEBFLOW and OBSIDIAN phase sections deleted; renumbered 1-6 |
| `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md` | Modified | Surface rows and packet pointers stripped |
| `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md` | Modified | Browser matrix deleted; renumbered 1-7 |
| `.skilled/skills/sk-code/shared/references/performance-loading-checklist.md` | Modified | Removed-packet pointer rows deleted |
| `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` | Modified | Surface rows stripped; the kept `WEBFLOW:` tag line survives at :149 |
| `.skilled/skills/sk-code/shared/references/universal/error-recovery.md` | Modified | Removed-packet rows and pointers deleted |
| `.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md` | Modified | Removed-packet pointers deleted; example neutralised |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modified (partial) | ~82, ~118 and ~177 edits applied; five `webflow|obsidian` lines at :16, :24, :39, :49 and :56 still to edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work is delivered task-by-task in the `tasks.md` order, each with its own proof command. T003 recorded the three baselines (`/tmp/phase2-baseline-filtered.txt` 158, `/tmp/phase2-baseline-hidden.txt` 164, `/tmp/phase2-baseline-broad.txt` 1338; the 164 = 158+6 stop rule held). T004 staged the 226 deletions. T014 regenerated the leaf manifest through its generator. Every later task re-greps its file for a zero count, with a positive control against `42b41dd286`.

The phase is not yet delivered: T040 to T108 still cover external consumers, fixtures, generated artifacts, the reviewer pass, the closure greps and the single phase commit. Nothing is committed or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete here and rebuild privately in phase 4 | The surfaces return as gitignored `local-*` symlinks to two external `local-skills/` folders; removal first keeps the tracked tree the authority on what ships |
| Only the named generator writes generated files | `leaf-manifest.json` regenerated by `generate-leaf-manifest.cjs`; hand edits go only into `ROUTER.md` and `graph-metadata.json`'s `causal_summary` |
| Un-renumbered `## 6. SKILLED MAP` kept | `verify-router-sync.cjs` scans from the first MAP heading to `## 7. VERIFICATION COMMANDS`; renumbering would break the projection |
| Four `WEBFLOW:` tag lines in three files stay | They are comment-hygiene tag vocabulary, not the removed surface; `code-style-guide.md`'s kept line now sits at :149 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baselines (T003) | PASS: `/tmp/phase2-baseline-{filtered,hidden,broad}.txt` = 158, 164, 1338; 164 = 158+6 satisfies the stop rule |
| Staged deletions (T004) | PASS: 226 paths at `42b41dd286`, 0 under `git ls-files`, both folders absent on disk |
| Registry proofs (T005-T013) | PASS: all JSON parses; modes, tie-break, router signals and vocabulary classes name no removed surface |
| Leaf manifest (T014) | PASS: `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK` |
| `ROUTER.md` strip (T015-T026) | PASS: whole-file `webflow|obsidian` count 0; `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` |
| Hub document strip (T027-T038) | PASS: every edited file greps 0 (code-style-guide.md keeps its one `WEBFLOW:` tag line at :149) |
| T039 | PARTIAL: `code-quality-standards.md` holds 5 `webflow|obsidian` lines at :16, :24, :39, :49 and :56 |
| D6 kept records (T104) | PASS now: surviving-records diff 0, `z_archive` diff 0 besides the two excluded twins; verified 2026-10-24, re-run at closure |
| `validate.sh --strict` on this folder (T106) | PASS now: `RESULT: PASSED`, Errors 0, Warnings 0; verified 2026-10-24, re-run at closure |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All work is uncommitted.** The 226 staged deletions and 15 modified files live only in the main checkout; AC rows stay `Unmet` until the phase commit lands, and T104/T106 must be re-run at closure.
2. **The worktree is red until pending tasks run.** `check-markdown-links.cjs` exits 1 on dead links into the deleted folders (T057-T060), `typo-flags.test.sh` fails its minify case (T062), `compiled-route-surface-hint.test.cjs` fails on unrewritten fixtures (T068), the README verdict parity and manifest tests fail (T081, T094), `verify-doc-claims.cjs` prints 2/4 (T095), and the Hermes `--check` reports DRIFT/STALE (T093). Each failure is owned by a named pending task, not by a defect in applied work.
3. **The closure greps are not met yet.** T107 currently prints `12` for the control, then 53 files with packet names and 176 `WEBFLOW|OBSIDIAN` token lines against expected `0` then `4`.
4. **T003's broad baseline moved.** The broad count records 1338 against planning's 1322; it is recorded-not-asserted, so the drift carries no action.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:task-log -->
## Task Log

| Task | Result | Key observation |
|------|--------|-----------------|
| T001 | pass | `skilled.trustRepoHooks` prints `true` |
| T002 | pass | phase 001 files on `origin/main` (count 2); packet-001 validator `RESULT: PASSED` |
| T003 | pass | baselines 158 / 164 / 1338; 164 = 158+6 |
| T004 | pass | 226 staged deletions; `git ls-files` count 0 |
| T005-T013 | pass | registries and router JSON clean; 3 modes, 1 surface, 11 vocabulary classes |
| T014 | pass | `leaf-manifest.json OK`; modes quality/review/skilled |
| T015-T026 | pass | `ROUTER.md` `webflow|obsidian` count 0; `router-sync: 5/5 checks passed` |
| T027-T038 | pass | SKILL.md and shared references at count 0; kept `WEBFLOW:` tag line at :149 |
| T039 | partial | 5 `webflow|obsidian` lines remain at :16, :24, :39, :49, :56 |
| T040-T103, T105, T107, T108 | pending | unchecked; per-task state lives in `tasks.md` |
| T104 | pass now | D6 records clean; verified 2026-10-24, re-run at closure |
| T106 | pass now | `RESULT: PASSED`; verified 2026-10-24, re-run at closure |
<!-- /ANCHOR:task-log -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Deviation | Why it stands |
|-----------|---------------|
| `code-quality-standards.md` is half-edited (T039 partial) | The ~82, ~118 and ~177 edits landed; the five earlier-line edits at :16, :24, :39, :49 and :56 were not applied. Expected 0, actual 5; the file resumes first |
| `advisor_recommend` returns no `compiledRoute` | `compiled-route.cjs` answers `{"servingAuthority":"legacy","hubId":"sk-code"}`, a designed sentinel state; targets can't be shown until T100's rebuild and T108's manifest refresh |
| Broad baseline is 1338, not planning's 1322 | The tree moved; the count is recorded-not-asserted by design |
<!-- /ANCHOR:deviations -->
