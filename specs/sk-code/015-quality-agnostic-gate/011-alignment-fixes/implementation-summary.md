---
title: "Implementation Summary"
description: "Typed doctor targets now beat their bare defaults, run requests get a recommendation, CI cost requests reach the CI surface, git releases reach sk-git, and four doc gaps are closed."
trigger_phrases:
  - "alignment fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/011-alignment-fixes"
    last_updated_at: "2026-10-27T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the eight lane findings and verified each"
    next_safe_action: "None; the conductor commits the lane"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts"
      - ".skilled/skills/sk-code/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-015-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-alignment-fixes |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A typed `/doctor:ci toggle` now reaches the toggle and not the report, and "run the quality gate and tell me which checks fail" gets a recommendation instead of abstaining. A request to cut CI cost reaches the CI surface, and a git release request reaches sk-git instead.

### Phase 11: alignment-fixes

The Python matcher lets a typed marker replace the current match only when it contains it, so a bare default such as `/doctor:ci` can no longer shadow its sibling, and a prompt with two separate commands keeps the first. The read-only classifier counts run, rerun, execute, enable, disable and turning or switching on or off as write verbs. The sk-code-ci aliases name GitHub Actions for release and deploy work, gain general CI cost phrases in which a pipeline, a run or minutes count only beside a cost word, and gain CI failure and debugging phrases. sk-git gains `git tag` and `tags and publishes`, and the advisor anchors sk-git when a release action sits beside a git tag, a tag push or a version number, never release notes or a release blog post, so both git release prompts the CI aliases used to catch now reach the git skill. The feature catalog now lists the quality gate, its config, both doctors and the review reach rule.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | Containing-marker match and the tagged-release boost |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` | Modified | Wider write verbs |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Tagged-release anchor for sk-git |
| `.skilled/skills/system-skill-advisor/runtime/tests/` (five files) | Modified/Created | The cases that prove the scorer fixes |
| `.skilled/skills/sk-code/hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `ROUTER.md` | Modified | sk-code-ci aliases |
| Compiled sk-code manifest, its archived copy, `skill-graph.json` | Modified | Regenerated from the hub files |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | Module header |
| `.skilled/skills/sk-code/feature-catalog/` | Modified/Created | Three sections and five leaves |
| `README.md` | Modified | Quality leg |
| `.skilled/skills/sk-git/graph-metadata.json` | Modified | Release vocabulary |
| Four component changelogs, their version carriers and Hermes copies | Created/Modified | Release record |
| `../changelog/changelog-015-002-builtin-runner.md` | Created | Phase 002 changelog |
| `../changelog/changelog-015-011-alignment-fixes.md` | Created | This phase's changelog |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first: the Python suite, the corpus accuracy capture, the vitest parity, golden and scorer folders and the route guards. Each code fix was proved by a case that failed before it and passed after it. The advisor runtime was rebuilt before every probe, because the daemon serves `dist/`. The probes ran through the worktree's advisor CLI. The alignment probe runner resolves its root through a link to the main checkout, so a small scratch runner pinned to the worktree replaced it. The setup battery, the link check and the parent check ran last, from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A marker replaces the current match only when it contains it | A specific marker always contains its generic prefix, so the sibling target wins, while two separate commands keep insertion order instead of the longer one winning |
| Pin the TypeScript ordering rather than change it | `keepPassingSkillsAboveDoctorBridges` already picks the longest bridge prefix, so a test guards it and no code moves |
| Ship general CI cost aliases | The probe-fitted set passed 3 of 15 general paraphrases. The general set passes 15 of 15, and the meeting-minutes and cheaper-method phrases stay out. The conductor ruled the remaining captures contrived |
| Bind the CI nouns to a cost word | Bare `ci pipeline`, `ci minutes` and `ci costs` pulled a flowchart, a heatmap and a blog post onto the CI surface. A cost-bound form keeps every cost paraphrase, and CI debugging gets its own failure phrases because it had reached CI only through the bare noun |
| Count a tag only as a git tag or a version | A bare `tags?` let a newsletter, an SEO post or release notes anchor sk-git |
| Anchor a tagged release in the scorer, not in sk-git's phrases | Any sk-git phrase with the word `release` put "update skilled to the latest release" on sk-git, and every phrase without it either missed O03 or caught a docker or slide-deck tag. The explicit lane anchors sk-git only when a release action and a tag appear together |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 tests/python/test_skill_advisor.py` | PASS, `Summary: pass=87, fail=0` (baseline 84 pass, 2 fail) |
| Whole advisor `npx vitest run` | Green in the conductor's run, 152 of 152 files, 1275 passed and 8 skipped. This lane's final run read 1278 passed, 8 skipped and one failure, `daemon-watcher-new-root-ingestion.vitest.ts`, a host FSEvents timing flake under load that passed 5 of 5 twice on main in the conductor's runs |
| Corpus diff over 343 labeled, holdout, ambiguity and doctor prompts | 0 top-1 changes against HEAD |
| Corpus accuracy capture | Unchanged: 154/195, 49/66, 18/24 |
| Advisor probes | P02, P04, P06, C01, C02, C03, C05, C06, C07 route to their sk-code mode. O03 and O05 read sk-git. H01 to H15 and the two CI debugging prompts reach `sk-code-ci`, N01, N02, N04, N05, N06 and N08 stay off it, the flowchart and heatmap prompts read sk-design and the blog post sk-doc, and G01 to G04 and G06 stay off sk-git |
| Tagged-release cases | vitest 12 of 12. The Python assertions fail against HEAD `skill_advisor.py` and pass in the worktree |
| Routing drift suites, intent-signal check, admission | 3 files and 21 tests passed, `RESULT: PASSED`, every hub passes admission |
| `sk-code-setup-check.cjs` | PASS, `STATUS=OK legs=9` |
| `validate_catalog_package.py --package sk-code` | PASS, 0 violations |
| `check-markdown-links.cjs` | PASS, 0 broken |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Contrived prompts built around a cost alias still match it.** N03, N07, N09, N10 and N11 route to `sk-code-ci`. Each uses CI for a confidence interval or clinical informatics in a sentence built around the alias, and the conductor ruled them non-traffic.
2. **A prompt naming git routes to sk-git.** G05 ("a git tag naming guide for the photo library") reads sk-git, and so does the same prompt without `tag`, so the existing `git` token boost decides it, not the new vocabulary.
3. **Some release phrasings still find no skill.** "Cut v4.2.0 and push the tag", "Set up a release process that tags each version", "Follow our release workflow to tag and publish v3" and "Cut a new release of the package" get no recommendation or reach sk-doc, because none pairs a release action with a tag in the anchored form.
4. **A pure report request still abstains.** "Report which GitHub Actions workflows are enabled and show me the CI state" holds the read-only floor, because it names no write verb.
5. **One advisor watcher test is a host timing flake.** `daemon-watcher-new-root-ingestion.vitest.ts` can miss its probe skill when FSEvents runs late under load. In the conductor's runs it passed 5 of 5 twice on main and the whole suite was green, while this lane's runs on the same host failed it, it touches no file this phase changes, and a separate lane is making it poll on macOS.
<!-- /ANCHOR:limitations -->

---
