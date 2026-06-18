# Deep Review Report — Packet 069 sk-code Motion.dev + Playbook

## VERDICT
**Status**: FAIL
**Date**: 2026-05-05
**Iterations**: 7 / 7 (fixed-pass)
**Executor**: cli-codex (gpt-5.5, high, fast)

## SUMMARY
This review audited Packet 069 across the parent phase packet, all three child packets, the sk-code router and metadata surfaces, the new `motion_dev/` reference and asset package, Webflow cross-references, manual testing playbook additions, and Motion.dev API/citation claims. The method was a fixed seven-pass review: focused dimensions in iterations 1-5, whole-packet scavenger re-pass in iteration 6, and an adversarial Hunter/Skeptic/Referee pass in iteration 7.

The headline verdict is FAIL. Two active P0 blockers remain: the Webflow no-clobber gate still fails under the configured "any deletion blocks" rule, and the `layout_transition.js` runnable snippet still uses undocumented `animateLayout` global/main-package export paths while official Motion docs require Motion+ package import from `motion-plus/animate-layout`.

Recommended next action: create a remediation phase under Packet 069, fix the two P0s first, then clear the active P1 continuity/router/playbook issues before commit.

## FINDINGS BY SEVERITY

### P0 (Blockers)
- F-004 `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md:187` — Webflow no-clobber proof fails. `git diff --cached --numstat -- .opencode/skills/sk-code/references/webflow` still reports `1 1` for all 11 changed Webflow pointer files; required sample files still include deletions. Remediate with additive-only pointer changes, or explicitly amend the reviewed acceptance rule to allow pointer-path normalization.
- F-005 `.opencode/skills/sk-code/assets/motion_dev/snippets/layout_transition.js:11` — Runnable snippet uses undocumented `window.MotionPlus.animateLayout` / `window.Motion.animateLayout` paths. Official Motion layout docs require Motion+ install and `unstable_animateLayout as animateLayout` from `motion-plus/animate-layout`. Convert to documented module-style Motion+ usage or remove it from runnable snippets.

### P1 (Required)
- F-001 `.opencode/skills/sk-code/SKILL.md:67` — Bare Motion terms still participate in WEBFLOW surface detection, contradicting `MOTION_DEV` as post-surface resource intent. Remove/gate bare `from "motion"` and `motion.dev` surface markers; keep Motion terms in intent classification.
- F-002 `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:31` — Stale `https://motion.dev/docs/timeline` citations remain in `animate_and_timelines.md` and `quick_start.md`. Replace with `https://motion.dev/docs/animate` unless a current standalone timeline page is verified.
- F-006 `.opencode/skills/sk-code/assets/motion_dev/snippets/es_module_bootstrap.js:7` — Snippet claims to match the repo dynamic-import pattern but uses top-level static CDN import and lacks reduced-motion handling for transform motion. Rework to dynamic `import()`/try-catch, export validation, and reduced-motion fallback.
- F-007 `specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/spec.md:59` — Parent spec body still says In Progress, child phases are Draft, and resolved questions remain under Open Questions. Refresh body state to complete/closed.
- F-008 `specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/001-playbook/spec.md:16` — Child planning artifacts retain initialization continuity and `completion_pct: 0` despite completed implementation summaries. Refresh continuity or narrow resume behavior to completed summaries.
- F-009 `specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/002-motion-dev/implementation-summary.md:77` — Packet 2 summary claims eight runnable snippets while F-005/F-006 remain active. Update after fixes or record active exceptions.
- F-010 `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:81` — Global preconditions omit `references/motion_dev/` and `assets/motion_dev/` even though Motion scenarios/resources are now in scope. Add the peer category to setup gates and MR/CB blocker behavior.

### P2 (Suggestions)
- F-011 `.opencode/skills/sk-code/manual_testing_playbook/05--motion-dev-and-animation-regression/001-motion-api-smoke.md:12` — Per-scenario MR/CB files lack local `references/motion_dev/*` links that exist in the source playbook asset.
- F-012 `.opencode/skills/sk-code/assets/motion_dev/snippets/timeline_sequence.js:14` — Snippet catalog has no runnable `stagger()` example despite `stagger` being a MOTION_DEV intent signal.
- F-013 `specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/003-cross-ref-metadata-sync/graph-metadata.json:202` — Packet 3 causal summary describes the pre-implementation problem rather than delivered outcome.
- F-014 `.opencode/skills/sk-code/manual_testing_playbook/05--motion-dev-and-animation-regression/001-motion-api-smoke.md:18` — Seven new MR/CB scenario files omit divider lines between numbered sections required by the sk-doc playbook standard.

## DIMENSION COVERAGE
| Dimension | Iter Coverage | Verdict |
|---|---|---|
| 1. Cross-stack peer-category | 1, 6, 7 | FAIL |
| 2. Citation discipline | 2, 6, 7 | FAIL |
| 3. sk-doc template compliance | 1, 6 | PARTIAL |
| 4. No-clobber discipline | 3, 6, 7 | FAIL |
| 5. Cross-ref correctness | 3, 6, 7 | PARTIAL |
| 6. Spec-doc continuity | 5, 6, 7 | FAIL |
| 7. Snippet runnability + JSDoc | 4, 6, 7 | FAIL |
| 8. Anti-pattern audit | 2, 6 | PARTIAL |
| 9. Skill-router coverage | 4, 6, 7 | FAIL |
| 10. Changelog accuracy | 5, 6 | PASS |

## REMEDIATION PHASE SCOPE RECOMMENDATION
Create `specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/004-deep-review-remediation/`.

Required remediation tasks:
- Fix Webflow no-clobber evidence in `.opencode/skills/sk-code/references/webflow/**/*.md`, or document and approve a pointer-normalization exception.
- Fix `assets/motion_dev/snippets/layout_transition.js` to use documented Motion+ module import, or remove it from runnable snippets.
- Fix `assets/motion_dev/snippets/es_module_bootstrap.js` to match dynamic import/error handling and reduced-motion expectations.
- Move bare Motion markers out of WEBFLOW surface detection and into MOTION_DEV intent/resource loading.
- Replace stale `https://motion.dev/docs/timeline` citations with current animate/sequence docs.
- Refresh parent/child continuity docs and Packet 2 runnable-snippet claims after code fixes.
- Add `motion_dev` to root playbook global preconditions and optionally polish P2 playbook/link/divider issues.

Estimated effort: 1 focused remediation pass plus 1 verification pass.

Suggested executor for remediation: cli-codex GPT-5.5 high, fast.

Verification approach post-remediation:
- Rerun strict validation for parent and all child/remediation spec folders.
- Rerun the Webflow `git diff --cached --numstat` no-clobber proof.
- Recheck Motion docs/API snippets against official docs for `animate`, sequences, `stagger`, and `animateLayout`.
- Run `node --check` over all Motion snippets.
- Re-run targeted `rg` checks for `docs/timeline`, bare Motion surface markers, stale `completion_pct: 0`, and missing `motion_dev` playbook preconditions.

## POSITIVE OBSERVATIONS
- The new `motion_dev/` category is discoverable in sk-code metadata and graph metadata as a peer resource category, not a third surface.
- The child `description.json` files use a consistent schema shape and accurately describe their phase scopes.
- The core Motion reference set is broad and mostly well sourced: quick start, animate/sequences, scroll/inView/gestures, performance, integration, decision matrix, install card, playbook entries, and snippets are all present.
- Changelog accuracy passed: the Packet 069 changelog covers all three child packets and includes lineage.
- The final adversarial pass found no additional P0/P1 beyond the existing active set, which suggests the remaining work is bounded.
