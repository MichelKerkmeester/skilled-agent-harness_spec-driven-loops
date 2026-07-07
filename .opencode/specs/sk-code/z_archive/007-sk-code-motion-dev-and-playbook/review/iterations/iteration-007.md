# Iteration 007 — Adversarial Final Pass

## METADATA
- Iteration: 7 / 7
- Date: 2026-05-05
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimensions: adversarial Hunter/Skeptic/Referee final pass
- Cross-cutting: independent verification of prior P0/P1 findings

## HUNTER FINDINGS (new issues missed by prior iterations)
- No new P0/P1/P2 findings. The underexplored description/schema pass found parent and all three child `description.json` files using the same key shape (`specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, `memoryNameHistory`), and their descriptions match the declared phase scopes.
- No new router-doc inconsistency beyond F-001. `intent_classification.md:43`, `resource_loading.md:39-51`, and `phase_lifecycle.md:49-51` consistently describe `MOTION_DEV` as a peer resource category loaded after WEBFLOW/OPENCODE/UNKNOWN surface detection. The remaining contradiction is still the already-recorded bare Motion marker in surface detection.
- No contradiction found between `references/motion_dev/integration_patterns.md:67-81` and `references/webflow/implementation/animation_workflows.md:185-208`. They split ownership correctly: generic Motion install/import patterns live in `motion_dev/`, while Webflow CDN timing, `window.Motion`, and Designer initialization stay authoritative in Webflow docs.
- No new graph-metadata miss for the sk-code skill. `.opencode/skills/sk-code/graph-metadata.json` includes `motion_dev` in `domains`, `intent_signals`, `derived.trigger_phrases`, `derived.key_topics`, `derived.source_docs`, `derived.entities`, `derived.key_files`, and `derived.peer_resource_categories`.

## SKEPTIC REVIEW (challenge of prior findings)
| Prior Finding ID | Iteration | Original Severity | Verdict | Notes |
|---|---|---|---|---|
| F-001 | iter-001 | P1 | KEEP | Live evidence still matches: `.opencode/skills/sk-code/SKILL.md:67`, `references/router/code_surface_detection.md:40`, and `README.md:21` classify bare `from "motion"`/`motion.dev` as WEBFLOW markers, while `SKILL.md:117` and `intent_classification.md:43` say MOTION_DEV is only a resource intent after surface selection. P1 is appropriate because it can misroute non-Webflow Motion work but has an UNKNOWN fallback/remediation path. |
| F-002 | iter-002 | P1 | KEEP | Live evidence still matches: `animate_and_timelines.md:31`, `:50`, `:139` and `quick_start.md:82`, `:109` cite `https://motion.dev/docs/timeline`. Official Motion navigation and sequence docs route timeline/sequence behavior through `https://motion.dev/docs/animate`, not a standalone timeline page. P1 remains correct because this is citation/API-source drift in canonical reference docs. |
| F-003 | iter-002 | P1 | AMEND | Factually correct, but superseded by F-005. `layout_transition.js:11` still uses `window.MotionPlus?.animateLayout || window.Motion?.animateLayout`; official Motion layout docs state `animateLayout` is Motion+ early access, installed via `motion-plus`, imported from `motion-plus/animate-layout` as `unstable_animateLayout as animateLayout`, and only later moves to `"motion"`. Count this once as the active F-005 P0, not as a separate active P1. |
| F-004 | iter-003 | P0 | KEEP | Live staged evidence still matches: `git diff --cached --numstat -- .opencode/skills/sk-code/references/webflow` reports `1 1` for all 11 Webflow pointer files, and the required three-file stat sample is `3 insertions(+), 3 deletions(-)`. Severity is P0 under the iteration charter's binary no-clobber rule. Caveat: semantically the deletion appears to normalize a pointer path, so remediation may either make the diff additive-only or explicitly change the acceptance rule. |
| F-005 | iter-004 | P0 | KEEP | Live evidence still matches: `layout_transition.js:11` probes undocumented globals/main-package paths. Official Motion layout docs require Motion+ install and `import { unstable_animateLayout as animateLayout } from "motion-plus/animate-layout"` for current usage. P0 is appropriate because the file is presented as a runnable snippet and the review rule classifies undocumented Motion API paths as blockers. |
| F-006 | iter-004 | P1 | KEEP | Live evidence still matches: `es_module_bootstrap.js:3` claims to match the repo dynamic-import testimonial pattern, but `es_module_bootstrap.js:7-12` uses a top-level static CDN import and `:27` runs transform motion without a reduced-motion branch. P1 is correct; the snippet is less dangerous than F-005 because its imports are documented, but it violates the stated local pattern and accessibility standard. |
| F-007 | iter-005 | P1 | KEEP | Live evidence still matches: parent `spec.md:59` says `Status | In Progress`, `spec.md:124-126` marks all child phases Draft, and `spec.md:148-151` still lists resolved questions as open despite complete graph metadata and frontmatter. P1 is appropriate because resume readers get contradictory state. |
| F-008 | iter-005 | P1 | KEEP | Live evidence still matches across all child specs: `001-playbook/spec.md:16-29`, `002-motion-dev/spec.md:16-30`, and `003-cross-ref-metadata-sync/spec.md:16-33` retain initialization actions and `completion_pct: 0` while implementation summaries report completion. P1 is appropriate for stale continuity across resume-ladder docs. |
| F-009 | iter-005 | P1 | KEEP | Live evidence still matches: `002-motion-dev/implementation-summary.md:77` still says eight runnable JavaScript snippets while F-005 and F-006 remain active. P1 remains correct until snippet fixes land or the summary records the active exceptions. |
| F-010 | iter-006 | P1 | KEEP | Live evidence still matches: `manual_testing_playbook.md:81` lists intact subfolders as `references/{router,opencode,webflow,universal}/` and `assets/{opencode,webflow,universal}/`, omitting the new `motion_dev` peer category, while the same playbook references Motion coverage at `manual_testing_playbook.md:57` and `:240`. P1 is appropriate because the setup gate can pass with the new category missing. |

## REFEREE VERDICT
**Verdict**: FAIL
**Outstanding P0 count**: 2
**Outstanding P1 count**: 7
**Outstanding P2 count**: 4
**Recommended action**: block

Commit is blocked by two active P0s: F-004 Webflow no-clobber gate failure and F-005 undocumented `animateLayout` runnable snippet API path. The active P1 set is also non-trivial: router misclassification, stale timeline citations, ES module bootstrap mismatch, stale continuity, Packet 2 runnable-snippet claims, and root playbook preconditions.

## INDEPENDENT VERIFICATION (3 prior findings spot-checked)
- F-004: VERIFIED — `git diff --cached --numstat -- .opencode/skills/sk-code/references/webflow` still reports `1 1` for all 11 changed Webflow pointer files; the required sample files still show deletions as well as insertions.
- F-002: VERIFIED — `animate_and_timelines.md:31`, `:50`, `:139`, `quick_start.md:82`, and `:109` still cite `https://motion.dev/docs/timeline`; official Motion docs show sequence/timeline behavior under `https://motion.dev/docs/animate`.
- F-010: VERIFIED — `manual_testing_playbook.md:81` omits `motion_dev` from the global intact-subfolder precondition while `manual_testing_playbook.md:57` and `:240` make Motion scenarios/resources part of the playbook.

## SUMMARY OF FINAL FINDING SET
After iter-7 challenges:
- P0: 2 findings
- P1: 7 findings
- P2: 4 findings
