---
title: "Implementation Summary"
description: "The v4.0.0.13 changelog told the release as a handover story and left OpenCode 2 plugin support in its shadow. The rewritten file gives both headlines equal weight, drops from 4149 words to 3359 and speaks in the tighter marketing voice of the v4.0.0.0 changelog, with three read-only review rounds behind it."
trigger_phrases:
  - "v4 0 0 13 changelog rewrite implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite"
    last_updated_at: "2026-10-22T21:56:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Changelog rewrite assembled and polished. Review round 3 returned PASS"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.13.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "060-v4-0-0-13-changelog-rewrite"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Why the default stays llmgateway/deepseek-v4.1-flash: phase 058 owns the model switch and had not landed on main when the rewrite was written"
      - "Does the glance list grow: no, it stays at 12 bullets and the first six alternate handover and OpenCode"
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
| **Spec Folder** | 060-v4-0-0-13-changelog-rewrite |
| **Status** | Complete |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The v4.0.0.13 release notes now open with two headlines of the same size. Before, the title, the description and the opening paragraphs told the release as a handover story and OpenCode 2 plugin support arrived later as a smaller item. The rewritten file leads with both, runs to 3359 words from 4149 and sounds like the v4.0.0.0 changelog the operator pointed at.

### Phase 60: v4-0-0-13-changelog-rewrite

One file changed: `.skilled/changelog/skilled/v4.0.0.13.md`. The title went from "v4.0.0.13, Sessions That Hand Themselves Over" to "v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2", and everything under it was rebuilt to match.

- **Both headlines lead.** The description, the opening paragraphs, Why This Release and the glance order now give the handover and OpenCode 1 and 2 support the same weight, so a reader meets them together rather than meeting one and waiting for the other.
- **In-Session Handover is shorter.** It carries 6 H4 items and 605 words, from 8 items and 805 words. Two round-1 headings, "You Can See Every Hop Afterwards" and "Sub-Agents and Nested Runs Stay Out of the Loop", were merged into the items around them.
- **OpenCode 1 and 2 is shorter.** It carries 6 H4 items and 697 words, from 8 items and 941 words, with the same facts and one idea per paragraph.
- **The glance list holds at 12 bullets.** The first six alternate handover and OpenCode, so the two headlines take turns from the top of the list.
- **Every other section is cut by about a quarter to a third.** That is where most of the 790 words came from, and the suite table stays as it was, because the operator asked to show the testing.
- **The facts did not move.** Every writer worked from the previous changelog and nothing else, so no claim in the rewrite is new. The spec-folder line keeps "phases 032 and 033", which the contract allows on that line, and both versions still name `llmgateway/deepseek-v4.1-flash` as the default.

A deliberate block of detail was dropped for concision, and this file records it rather than leaving it to be rediscovered: the hop-history line tags and fields, the bridge's `session.created` and message-field details, the `--dir` and `--variant` reason, the adversarial-review sentence, the advisor timing numbers at 36 files and 2.2 ms to 0.24 ms with its monotonic clock, the break-lock detail, the excluded package trees, the 8 P1 and 16 P2 split, the Hermes environment-variable note, the env-settings exclusion sentence, the open-note detail behind the "names any note nobody claimed" phrase and the two headings listed above.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modified | Retitled and rewritten to 3359 words, with both headlines leading, both headline sections at six H4 items and the glance list at 12 bullets |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 060 and the 059 to 060 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three DeepSeek v4.1 flash writers ran in parallel at max thinking through cli-pi on llmgateway. One took the top matter, one took the two headline sections and one took the rest of the file. Every writer was told to use only facts already in the previous changelog, which is why the rewrite could cut 790 words without inventing a sentence. The three parts were assembled into one file and given a single polish pass for voice and joins.

Separate read-only DeepSeek sessions then checked the result against the previous changelog. Round 1 failed with 2 P1s and many P2s. The P1s were a title, "Sessions That Never Run Out", that overstated the handover, and an interrupted-hop sentence that had lost its condition. Ten of its P2s were restored into the file, among them the CI suites, "with the model you started it on", the watcher's bound, `opencode-go` still selectable, the rollback line, Homebrew not sitting beside v1, "what it checks has not changed", existing Code Mode installs, the alias reason and the agents, commands and config in the OpenCode glance bullet.

Round 2 failed with 1 P1 and 4 P2s. The P1 was that the live-test and side-by-side claims had attached to agents, commands and config rather than to the 17 plugins and the two versions. Three of its P2s were fixed in that round: the warm-cache qualifier, the `cupt add` docs wording and the skipped archive file.

Round 3 returned PASS with 2 P2s. Both are sentences carried over word for word from the previous glance list, so they are recorded rather than changed.

The orchestrator made one mechanical edit by hand during the review fixes: "Only the 17 plugins showed their effect live" became "All 17 plugins showed their effect live", because "Only" read as a limitation rather than as a count. The spec-folder line also gained one missing comma.

The finished file then went through `validate_document.py`, which reported VALID with 0 issues, and `hvr_scan.py`, which reported 0 hard blockers.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split the rewrite across three parallel writers instead of one | One writer would have serialised a long file behind one context budget, and three parts with clear seams let the assembly and polish passes own the joins |
| Tell every writer to use only facts from the previous changelog | The operator asked for shorter writing, not new reporting, so the fact source had to be fixed before any cutting began |
| Rewrite the title rather than keep the old one | Round 1 caught "Sessions That Never Run Out" claiming more than the handover does, and the new title names both headlines |
| Hold the glance list at 12 bullets and alternate the first six | The contract caps the list, and alternating makes the equal weight visible before a reader reaches either section |
| Keep the suite table | The operator asked to show the testing, so the table stays even though it is the least marketing-shaped part of the file |
| Record the deliberately dropped facts instead of leaving them implicit | A later reader can tell a considered cut from an accidental loss, and can restore any of them without redoing the review |
| Leave the two carried-over glance sentences alone | Both are word for word from the previous changelog, so changing them would have introduced new wording that no writer was briefed on |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` over the changelog | PASS: VALID, 0 issues |
| `hvr_scan.py` over the changelog | PASS: 0 hard blockers |
| Read-only review, round 1 | FAIL: 2 P1s and many P2s. The title overstated the handover and the interrupted-hop sentence had lost its condition. Both P1s fixed and ten P2s restored |
| Read-only review, round 2 | FAIL: 1 P1 and 4 P2s. The live-test and side-by-side claims had attached to agents, commands and config. The P1 fixed and three P2s fixed |
| Read-only review, round 3 | PASS: 2 P2s, both carried over word for word from the previous glance list and recorded |
| Words | PASS: 3359 after, from 4149 before |
| In-Session Handover | PASS: 6 H4 items and 605 words, from 8 items and 805 words |
| OpenCode 1 and 2 | PASS: 6 H4 items and 697 words, from 8 items and 941 words |
| Glance list | PASS: 12 bullets, with the first six alternating handover and OpenCode |
| Default model | PASS: `llmgateway/deepseek-v4.1-flash` is still the stated default, because phase 058 had not landed on main |
| Push and CI | PASS: the rewrite landed as `4b7a026f5c` and CI passed on it and on the index rebuild `5228e8c417` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rewrite cannot outrun its source.** Every sentence traces to the previous changelog, so a fact that file got wrong is still wrong here. The three read-only rounds checked the rewrite against that file, not against the code.
2. **The cuts are editorial judgment.** The dropped facts are recorded, but a reader who valued the advisor timing numbers or the break-lock detail will not find them now, and restoring any of them means either a longer file or another cut elsewhere.
3. **The two carried-over glance sentences stay as they are.** Both are word for word from the previous changelog, so they were recorded rather than changed, and a later pass that wants different wording has to brief it.
4. **The CI scope is what CI covered.** The rewrite landed as `4b7a026f5c` and CI passed on it and on the index rebuild `5228e8c417`. The three read-only rounds checked the words, and the workflows checked the tree those words sit in.

### P2s Left as Written

One round-3 P2 pair and one contract allowance are recorded rather than fixed. The `/doctor:env` glance bullet says "shows and saves each one", and the hop-history glance bullet says it "names any note nobody claimed". Both sentences are carried over word for word from the previous changelog's glance list, so they were kept as written. The spec-folder line keeps "phases 032 and 033", which the contract allows on that line.
<!-- /ANCHOR:limitations -->

---
