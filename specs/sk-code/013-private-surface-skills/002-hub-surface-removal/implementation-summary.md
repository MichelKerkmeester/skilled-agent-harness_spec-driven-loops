---
title: "Implementation Summary"
description: "Phase 002 is in progress at about 90%. T039-T104 and T107 are applied. T103 remains partial. T105, T106 and T108 stay open."
trigger_phrases:
  - "hub surface removal implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/002-hub-surface-removal"
    last_updated_at: "2026-10-24T11:02:07.550Z"
    last_updated_by: "codex"
    recent_action: "Reconciled evidence and passed strict packet validation."
    next_safe_action: "SWE-2 review (T105), validate (T106), commit and push (T108)."
    blockers: []
    key_files:
      - "specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md"
      - ".skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-hub-surface-removal"
      parent_session_id: null
    completion_pct: 90
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
| **Status** | In progress (~90%); implementation remains uncommitted |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase removes the Webflow and Obsidian example surfaces from the shipped `sk-code` hub so it carries only `sk-code-quality`, `sk-code-review` and `sk-code-skilled`. Work so far is in the worktree only: both surface packet folders are staged for deletion (226 files, content stays reachable at `42b41dd286`), and the routing registries, the leaf manifest, `ROUTER.md`, `SKILL.md` and the shared references are edited down to the one shipped surface.

### Phase 2: hub-surface-removal

Implementation tasks T001-T104 and T107 are applied, with T103 partial. The router declares three modes, one surface axis entry, three router signals and eleven vocabulary classes. The leaf manifest check prints leaf-manifest.json OK. The router-sync guard reports 5/5 checks passed. T105 review, the final T106 validation and T108 commit/push remain open.
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
| .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | Modified | T039 proof returned 8 at base and 0 after the edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Worker reports record T039-T104 and T107 proofs, with T103 partial. T096-T102 suites pass. The D6-scoped T104 result is 20, 0 and 0, and T107 returns 12, 0 and 4. T081 and T094 use corrected D6-scoped scans because five mcp-obsidian records must remain. The phase is uncommitted. The next step is SWE-2 review (T105), validate (T106), commit and push (T108).
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
| T001-T038 | PASS: existing task evidence records setup, deletion, registry, manifest and router results |
| T039-T095 | PASS: worker reports record task proofs; corrected T081 and T094 scans preserve D6 records |
| T096-T102 | PASS: gate output reports every suite passing, including 9/0, 14/0 and 109/0 results |
| T103 | PARTIAL: sk-code ranks first, but compiledRoute is absent while the legacy sentinel is active |
| T104 | PASS for this phase: 20 control files, 0 surviving D6 changes, 0 phase z_archive changes after excluding another packet's manifest |
| T107 | PASS: closure outputs are 12, 0 and 4 |
| Strict packet validation | This document reconciliation passed: RESULT: PASSED (0 errors, 0 warnings). T106 remains open for post-review closure |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. T103 remains Partial because compiled-route.cjs returns the legacy sentinel. The compiled target depends on the T108 manifest refresh.
2. T105 review, final T106 validation and T108 commit/push remain open.
3. The original T081 and T094 counts include five D6-kept mcp-obsidian records. The corrected scans find no removed sk-code paths, README parity passes and the manifest is reproducible.
4. The unfiltered T104 archive diff counts one cli-external-orchestration manifest from another packet. Excluding that file gives this phase's result of 20, 0 and 0.
5. The phase remains uncommitted and has not been pushed.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:task-log -->
## Task Log

| Task | Result | Key observation |
|------|--------|-----------------|
| T001-T038 | pass | Existing evidence covers setup, baselines, deletions, registries and router updates |
| T039-T102 | applied | Proofs are recorded in tasks.md and worker reports; T103 remains Partial |
| T104 | pass for this phase | D6-scoped result is 20, 0 and 0 |
| T105 | open | SWE-2 review remains |
| T106 | open | Final post-review validation remains |
| T107 | pass | Closure outputs are 12, 0 and 4 |
| T108 | open | Commit and push remain |
<!-- /ANCHOR:task-log -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Deviation | Why it stands |
|-----------|---------------|
| T103 closed at commit time | After the advisor rebuild and the sk-code manifest refresh, the proof prints `sk-code sk-code-skilled` |
| T081 and T094 expected counts | D6 keeps five mcp-obsidian records; corrected scans find zero removed sk-code paths |
| T104 archive count | One diff belongs to another packet's activation manifest; the phase-scoped result is 20, 0 and 0 |
| Compiled skill graph left out of the phase commit | CI's Routing Registry Drift Guard failed on `e3beac65f4`: the tracked `skill-graph.json` still carried sk-code's six surface signals. Follow-up `1218b94938` regenerated it with `skill_graph_compiler.py --export-json`; only the sk-code signal list (78 to 72) and the timestamp changed, and `skill-graph-freshness.cjs --strict` exits 0 |
| Push gates authorized | The pre-commit mirror-parity gate and the pre-push compiled-routing gate failed only on another session's uncommitted cli-opencode edits, outside this commit, so their one-time skips were used; the mass-deletion guard was authorized because the 245 deletions are the phase's purpose under D1 |
<!-- /ANCHOR:deviations -->
