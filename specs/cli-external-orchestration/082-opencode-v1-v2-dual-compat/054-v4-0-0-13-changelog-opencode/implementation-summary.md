---
title: "Implementation Summary"
description: "v4.0.0.13's second headline was buried: the OpenCode 1 and 2 work sat below the environment and standards sections, and the page named it in passing. The unreleased changelog now puts it right after In-Session Handover with eight items, repeats its live two-version testing with the release tree's suite counts, and names it in the description, intro, Why This Release, glance list and Upgrade Notes."
trigger_phrases:
  - "v4 0 0 13 changelog opencode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/054-v4-0-0-13-changelog-opencode"
    last_updated_at: "2026-10-22T09:30:00Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Fixed six review P1s over three rounds; a narrow read-only check passed the changed sentences"
    next_safe_action: "Push to main, then confirm the run at that commit"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.13.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-v4-0-0-13-changelog-opencode"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Does the changelog keep test counts: yes, as a recorded deviation, because the operator asked for the testing to be shown"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 054-v4-0-0-13-changelog-opencode |
| **Status** | In Progress |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The release notes now lead with what the release actually changed. v4.0.0.13 makes OpenCode 2 a headline: every plugin, agent, command and the config run on OpenCode 1 and 2 from one source, the two install side by side, and `cli-opencode` dispatches to whichever is present. The unreleased changelog read as though that were a compatibility footnote. It no longer does.

### Phase 54: v4-0-0-13-changelog-opencode

One file changed: `.skilled/changelog/skilled/v4.0.0.13.md`. The OpenCode section moved up to sit right after In-Session Handover, where a reader meets it as the second headline, and it now carries eight H4 items: plugins on both versions, shared agents/commands/config, dispatch follows the installed version, side-by-side install, one default model, version-aware guards, tested live on both versions, and what still differs.

The work is named before the reader reaches the section. The frontmatter description, the intro, Why This Release, the glance list and Upgrade Notes all mention OpenCode 1 and 2. The glance list did not grow to fit it: related bullets were merged, so the list fell from 14 to the template's ceiling of 12 and every topic kept its line. Three OpenCode upgrade notes joined the list - the side-by-side setup, the `OPENCODE_BIN` pin and the shared llmgateway default model. The old "sixteen plugins" now reads 17, which is what `.opencode/plugins/` holds.

The testing item is the one place the file knowingly departs from its template. `sk-create-changelog` drops test counts by default; the operator asked for the testing to be shown, so the item keeps a suite table with counts rerun on the release tree, in four rows: plugins 516, hook node 886 over 30 files, hook vitest 452 and battery unit 51. The dispatch audit count has no row of its own because the tests it covers already sit inside the hook vitest row, and listing it counted those tests twice. `plan.md` and `spec.md` record the deviation with that reason.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modified | Promoted the OpenCode section, named the work in the description, intro, Why This Release, glance list and Upgrade Notes, corrected the plugin count and carried the testing suite table |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 054 and the 053 to 054 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash with thinking max wrote the changes through `cli-pi` on llmgateway, over five one-change briefs: promote the section and give it eight items, name the work around the page while merging the glance list to 12, carry the testing with its suite table, correct the plugin count to 17, and add the three upgrade notes. One brief per change kept each edit reviewable on its own rather than as a rewrite.

A separate read-only DeepSeek session reviewed the file after the writing. Round 1 raised 2 P1s and both were fixed: the `OPENCODE_DB` sentence ran backwards, and the dash-and-bash claim had no record behind it. Round 2 raised 3 P1s and all were fixed: the sk-vision tools gate was unstated, the 872 hook node count was stale against the release tree's 886, and 323 was an audit-time count rather than a count of the tree as it ships, so the sentence now says so.

Round 3 returned FAIL on 1 P1: "block a merge" overstated what the CI does. The workflows do fail their run, but main carries no required check that refuses a merge for them, so the sentence now says the suites "run in CI". Round 3 also raised four P2s, and one more one-change brief fixed all five findings: the dispatch audit row is gone, since its tests already sat inside the hook vitest row and the table now has four rows; `opencode-go` is scoped to OpenCode 1, where it is selectable, rather than left to read as though both versions offered it; the `OPENCODE_DB` migration is described as documented rather than probed; and the two Pi extension suites are named instead of referred to by count.

A narrow read-only DeepSeek check of the changed sentences then returned PASS, with one P2: this phase's own `spec.md` still listed 124 in its suite table. That row was corrected to the same four rows the changelog carries.

The finished file then went through `validate_document.py`, which reported VALID with 0 issues, and `hvr_scan.py`, which reported 0 hard blockers. Luna was not used: the operator moved review to DeepSeek, and every round above ran there.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the existing OpenCode section rather than add a new one | The release's second headline belongs beside In-Session Handover; a second OpenCode section would have split the story and doubled the reading |
| Merge glance bullets to stay at 12 instead of raising the ceiling | The template's ceiling keeps the page skimmable; merging related lines gives OpenCode its own bullet without making every other topic shorter |
| Keep the suite table and record the deviation | The operator asked for the rigorous testing to be shown, and the template's default of dropping counts would have hidden the strongest evidence in the release |
| Rerun every suite count on the release tree | A count copied from an earlier phase describes an older tree, which is how the stale 872 hook node number survived into the first draft |
| Describe 323 as an audit-time count instead of deleting it | The number is true of the review it came from; naming its scope keeps the finding and stops a reader taking it for the shipped file count |
| Record the round 3 verdict as it came back rather than smoothing it | The round failed on 1 P1, and naming that beside the fix and the narrow check that followed is what lets a reader see how the sentence earned its final wording |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` over the changelog | PASS: VALID, 0 issues |
| `hvr_scan.py` over the changelog | PASS: 0 hard blockers |
| Read-only review, round 1 | 2 P1s found and fixed: the `OPENCODE_DB` sentence read backwards; the dash-and-bash claim had no record |
| Read-only review, round 2 | 3 P1s found and fixed: the sk-vision tools gate was unstated; the 872 hook node count was stale; 323 was an audit-time count |
| Read-only review, round 3 | FAIL: 1 P1 - "block a merge" overstated CI, fixed by saying the suites "run in CI"; plus 4 P2s, all fixed in the same brief |
| Narrow read-only check of the changed sentences | PASS, with 1 P2: this phase's `spec.md` still listed 124 in its suite table; the table now matches the changelog's four rows |
| Suite counts rerun on the release tree | PASS: plugins 516, hook node 886 over 30 files, hook vitest 452, battery unit 51 - four rows, with no dispatch audit row because its tests are already inside the hook vitest row |
| Plugin count | PASS: 17 plugin files under `.opencode/plugins/`, matching the changelog's 17 |
| Glance list length | PASS: 12 bullets, the template's ceiling, down from 14 by merging related bullets |
| OpenCode section position and size | PASS: sits right after In-Session Handover with eight H4 items |
| Push and CI | Not run in this phase: T011 and T012 are open for the orchestrator |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CI sentence describes a run, not a merge gate.** The four suites run in CI, and a failing workflow fails its own run. main carries no required check that refuses a merge on those workflows, so "run in CI" must not be read as "blocks a bad merge" - that is the overstatement round 3 caught and this file now keeps on the right side of.
2. **The suite counts are a point-in-time measurement.** They describe the release tree on 2026-10-22. A later code change makes them stale in the same way 872 went stale here, and nothing in the changelog reruns them.
3. **The counts are the template's exception, not its rule.** Another changelog written from the same contract will drop test counts unless its operator asks for them, so this file cannot be used as the shape for the next one.
4. **The Resident Memory section still points at `037-advisor-daemon-memory/002-lighter-advisor-launcher`.** That pointer predates this edit and was out of scope, so it stays as found; it is noted here rather than fixed.
5. **The push and the CI check are not done.** The phase stops at validated content; T011 and T012 track the push to main and the green run at that commit.

### P2s Left as Written

Three P2-level notes from the review rounds stand, each with its reason rather than an open action.

- **The merged glance bullets pair related themes.** The list sits at the template's 12-bullet ceiling by pairing them, and the pairing is the price of giving OpenCode a bullet without lengthening every other topic. Un-merging them would break the ceiling.
- **The review and process sentences stay in the changelog.** They read as more process than a release note usually carries, and they stay because the operator asked for the testing to be shown. The testing item is the visible evidence, and the sentences around it say how it was checked.
- **The spec-folder line's phase labels and the Resident Memory pointer predate this edit.** Both came with the draft, neither was in scope, and changing them would have put an unrelated edit inside a one-file phase.
<!-- /ANCHOR:limitations -->

---
