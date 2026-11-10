---
title: "Changelog: Phase 11: alignment-fixes [015-quality-agnostic-gate/011-alignment-fixes]"
description: "Chronological changelog for the Phase 11: alignment-fixes phase."
trigger_phrases:
  - "quality agnostic gate alignment fixes changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-27

> Spec folder: `specs/sk-code/015-quality-agnostic-gate/011-alignment-fixes` (Level 2)
> Parent packet: `specs/sk-code/015-quality-agnostic-gate`

### Summary

The alignment audit left routing and documentation faults open, and this phase fixes each one at its cause. A typed `/doctor:ci toggle` now reaches the toggle and not the report, and "run the quality gate and tell me which checks fail" gets a recommendation instead of abstaining. A request to cut CI cost reaches the CI surface, a failing CI pipeline reaches it too, and a git release that names a tag reaches sk-git. A flowchart of CI stages, a heatmap of CI minutes or a blog post about CI costs no longer lands on the CI surface.

### Added

- The advisor anchors sk-git when a release action, such as cutting, tagging, publishing or shipping a release, sits beside a git tag, a pushed or created tag, "tag it" or a version number such as `v2.3.0`. Release notes, a release blog post, a release party or a release announcement are not a release action, and a tag on subscribers or posts is not a git tag. The Python fallback scorer carries the same two patterns.
- sk-git's routing vocabulary gains `git tag` and `tags and publishes`. Neither contains the bare word `release`, so "update skilled to the latest release" keeps its own route.
- The sk-code-ci surface reads CI cost requests through phrases that name CI, Actions or runner minutes, where a pipeline, a run or minutes count only beside a cost word, such as `ci cost`, `ci spend`, `cut ci minutes`, `ci pipeline cheaper` and `github actions bill`.
- CI failures get their own phrases, such as `failing ci`, `ci failure`, `broken ci` and `debug the ci`, so "fix the failing CI pipeline" and "debug the CI pipeline" reach the CI surface.
- The sk-code feature catalog lists the quality gate, the repository quality config, `/doctor:sk-code`, `/doctor:ci` with its switches and the review reach rule.

### Changed

- The fallback scorer lets a typed command marker replace the current match only when it contains it. A specific target such as `/doctor:ci toggle` always contains its bare default, so it wins, while a prompt that types two separate commands keeps the first.
- The read-only classifier counts run, rerun, execute, enable, disable and turning or switching something on or off as write verbs, so a request that asks for work and then a report is no longer held as a question.
- The CI release and deploy aliases now name GitHub Actions or the workflow YAML, so "tag the version and follow the release workflow" no longer routes to the CI surface.
- The root README names the quality checks in the setup battery, and the router sync verifier carries its module header.

### Fixed

- A typed doctor target no longer loses to its bare default on the fallback path.
- A git release request no longer lands on the CI surface through a bare release workflow alias.
- A drawing, a chart or a blog post that mentions a CI pipeline, CI minutes or CI costs no longer lands on the CI surface.

### Verification

- The advisor's Python suite passes, and its tagged-release assertions fail against the previous scorer.
- The whole advisor vitest suite passes, apart from a watcher test that can miss a file event when the host is under load and is being made to poll on macOS.
- A replay of 343 labeled, holdout, ambiguity and doctor prompts shows no top-1 change, and the corpus accuracy is unchanged.
- The route guard, route sync, admission check and intent-signal check pass, and the setup battery reads `STATUS=OK legs=9`.

### Files Changed

| File | Purpose |
|------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Containing-marker match and the tagged-release boost |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` | Wider write verbs |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Tagged-release anchor for sk-git |
| `.skilled/skills/system-skill-advisor/runtime/tests/` | Cases for each scorer fix |
| `.skilled/skills/sk-code/hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `ROUTER.md` | The sk-code-ci vocabulary |
| `.skilled/skills/sk-git/graph-metadata.json` | The git release vocabulary |
| `.skilled/skills/sk-code/feature-catalog/` | Three sections and five entries |
| `README.md`, `verify-router-sync.cjs` | The quality checks and the module header |

### Follow-Ups

- Prompts built around a cost phrase with CI meaning a confidence interval or clinical informatics still match the CI surface. They were judged contrived, not real traffic.
- A prompt that names git, such as a git tag naming guide for a photo library, still reaches sk-git through the existing `git` boost.
- Some release phrasings, such as "cut v4.2.0 and push the tag" or "cut a new release of the package", find no skill or reach sk-doc, because none pairs a release action with a tag in the anchored form.
- A pure report request, such as "report which GitHub Actions workflows are enabled", still holds the read-only floor.
