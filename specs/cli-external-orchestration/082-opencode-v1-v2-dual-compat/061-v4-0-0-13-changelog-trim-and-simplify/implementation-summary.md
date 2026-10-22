---
title: "Implementation Summary"
description: "The v4.0.0.13 changelog now tells only the story a reader upgrading will act on. Two topics left for later releases are gone, internal jargon reads as plain words, OpenCode 2 is framed as the expected version with OpenCode 1 as temporary backwards compatibility, and every section leads with what the reader gains."
trigger_phrases:
  - "v4 0 0 13 changelog trim and simplify implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/061-v4-0-0-13-changelog-trim-and-simplify"
    last_updated_at: "2026-10-22T23:05:00Z"
    last_updated_by: "spec-record-writer"
    recent_action: "Closed the phase: pushed `3857bfa345` on main and confirmed CI green"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.13.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-061-v4-0-0-13-changelog-trim-and-simplify"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 061-v4-0-0-13-changelog-trim-and-simplify |
| **Status** | Complete |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The v4.0.0.13 changelog now tells only the story a reader upgrading will act on. Two topics that belonged to other releases are gone, the internal jargon reads as plain words, and every section leads with what the reader gains.

### Phase 61: v4-0-0-13-changelog-trim-and-simplify

You get a shorter release note that opens with the two things this release changes for you: a long session can hand itself over, and every plugin, agent and command runs on OpenCode 2, with OpenCode 1 still supported. OpenCode 2 is the version the framework expects and recommends, and OpenCode 1 support is temporary backwards compatibility while users move over, with no removal date. The Resident Memory topic, which covered the local model server's idle unload, orphan reaping, leftover-process counts and separate launcher, and the MCP Tooling topic, which covered ClickUp and Figma's 24 findings and a fresh Code Mode install, no longer appear. The four spec-folder line entries that pointed at `system-skill-advisor/037-advisor-daemon-memory`, `system-speckit/049` phases 032 and 033, and `mcp-tooling/023` and `024` are removed with them.

Words that only made sense inside the project are replaced. Hop became hand-over, reap became clean up, fingerprint became a phrase that says what is checked, provision became install, bridge became adapter and dual export became the plain description of one source that works on both versions. Sections, H4 items and bullets are ordered by user impact, with the handover leading and OpenCode 2 named first wherever both versions appear. The title now reads 'v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 2', the trigger phrase reads 'opencode 2 plugin support', the H2 reads 'OpenCode 2, With OpenCode 1 Still Supported', a new `Move to OpenCode 2` upgrade note leads and `Pin OpenCode 1` reads as a fallback step. The glance list is rewritten to 11 payoff bullets, and the file runs to 2961 words from 3359.

The review rounds tightened the result. Round 1 returned FAIL with four P1 findings: 'load' against 'run' in the opening, two lost facts (the deep-loop log keeps every row on rebuild and five suites now run in CI), the history log narrowed, and 'empty entry' against 'bare null'. All four were fixed, and the two facts came back as the new `Saved State and Test Suites Hold Up` Reliability Fixes item. The same fix pass applied eleven P2s, among them the signals, the symlink and JSON diagnostic wording, the content hash, continuity and auto-compaction terms, the usage signal and end-of-session event, the sk-vision shapes and evidence, the linked-project condition, consistent sk-code surface wording, the goal-before-worktree order and an Environment Settings glance bullet, and it applied the OpenCode 2 framing rule. Round 2 returned PASS with four P2; three were fixed by hand and the fourth was this records update. Round 3, the last review allowed, returned FAIL with one P1: reordering the versions had attached 'its two built-ins included' to OpenCode 1, fixed by hand as '42 on OpenCode 2, its two built-ins included, and 40 on OpenCode 1', plus one P2 on 'a session's sub-agent hand-off count' and the restoration of the config-shape sentence's cause and effect. The two remaining P2s are recorded in Known Limitations, not fixed. One deliberate exception stays: Environment Settings still says `/doctor:env` keeps the Code Mode provider keys hidden, because that is a settings fact, not the removed install topic.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modified | Trimmed, plainly worded, impact-ordered release note at 2961 words with both topics removed, the glance list at 11 bullets, the `Saved State and Test Suites Hold Up` Reliability Fixes item and OpenCode 2 framed as the expected version |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 061 and the 060 to 061 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four DeepSeek v4.1 flash writers drafted one section each in parallel at max thinking, using the previous changelog as the only fact source. One assembly pass joined the drafts, removed both topics and the four spec-folder line entries, applied the plain-word replacements, set the impact order and wrote the 11-bullet glance list. A mid-task operator rule then framed OpenCode 2 as the expected and recommended version, and a DeepSeek fix pass applied it to the title, the trigger phrase, the H2 heading, the prose order, the `Move to OpenCode 2` upgrade note and the `Pin OpenCode 1` fallback step. `validate_document.py` then reported VALID with 0 issues, `hvr_scan.py` reported 0 hard blockers and a grep for the removed topics returned no hits. Three read-only DeepSeek v4.1 flash reviews at max thinking followed. Round 1 returned FAIL with four P1 findings, all fixed by a DeepSeek fix pass that also applied eleven P2s and restored the two lost facts as the `Saved State and Test Suites Hold Up` item. Round 2 returned PASS with four P2; three were fixed by hand and the fourth was this records update. Round 3 returned FAIL with one P1 on the reordered built-ins count, fixed by hand, plus one P2 on `a session's sub-agent hand-off count` and a restored cause-and-effect sentence; the two remaining P2s are recorded in Known Limitations. The push to main and the CI run on that commit are closed: `3857bfa345` is on main, CI was green with 12 of 12, and 12 passed with Trigger Index Rebuild skipped on the index rebuild `d092874cf7`, Spec-Kit Check 39855629894.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop the Resident Memory and MCP Tooling topics entirely | The operator asked for them out on 2026-10-22 because each belongs to its own spec folder, not to this release story |
| Replace jargon rather than explain it | A reader deciding whether to upgrade should not need a glossary, so hop, reap, fingerprint, provision, bridge and dual export each became the everyday word that says the same thing |
| Order by user impact with the handover first | The handover is the main reason to upgrade, so it leads and the smaller fixes follow |
| Frame OpenCode 2 as the expected version and OpenCode 1 as temporary backwards compatibility | The operator added this rule mid-task: OpenCode 2 is what the framework expects and recommends, while OpenCode 1 support exists only while users move over, with no removal date. The title, trigger phrase, H2, prose order and upgrade notes now say so |
| Keep the new default model out | The switch to `deepseek-v4.1-flash-1017` was not on main when this file was written, so the file still names `llmgateway/deepseek-v4.1-flash` |
| Rewrite the glance list to 11 payoff bullets | The old list carried the dropped topics and some internal phrasing, so each remaining topic gets one line stated as a gain |
| Restore the two lost facts as a Reliability Fixes item | Round 1 showed the trim had dropped the deep-loop rebuild behavior and the five suites now in CI, so both returned in `Saved State and Test Suites Hold Up` rather than as scattered lines |
| Keep the Code Mode provider-keys note in Environment Settings | It is a `/doctor:env` settings fact about hidden keys, not part of the removed install topic, so removing it would have cut a fact a reader needs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on `.skilled/changelog/skilled/v4.0.0.13.md` | PASS: VALID with 0 issues |
| `hvr_scan.py` on `.skilled/changelog/skilled/v4.0.0.13.md` | PASS: 0 hard blockers |
| Word count | 2961 words, down from 3359 |
| Glance list | 11 payoff bullets |
| `grep` for the removed Resident Memory and MCP Tooling topics | PASS: no hits |
| Read-only DeepSeek review, round 1 | FAIL: four P1 findings (load against run, two lost facts, narrowed history log, empty entry against bare null), all fixed by the DeepSeek fix pass that also applied eleven P2s |
| Read-only DeepSeek review, round 2 | PASS: four P2 findings, three fixed by hand and the fourth carried by this records update |
| Read-only DeepSeek review, round 3 | FAIL: one P1 (reordered built-ins count attached to OpenCode 1), fixed by hand; one P2 (`a session's sub-agent hand-off count`) fixed together with the restored config-shape cause and effect; two P2s recorded in Known Limitations |
| Push to main and CI green on the commit | PASS: `3857bfa345` on main, CI green: 12 of 12, and 12 passed with Trigger Index Rebuild skipped on the index rebuild `d092874cf7`, Spec-Kit Check 39855629894 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The new default model is not described.** The switch to `deepseek-v4.1-flash-1017` was not on main when this file was written, so the changelog still names `llmgateway/deepseek-v4.1-flash`. A later change to the default model needs its own changelog line.
2. **The title no longer names OpenCode 1.** This is intended by the operator's framing rule that OpenCode 2 is the expected version, but a reader scanning only the title may not learn that OpenCode 1 is still supported until the H2. Recorded as round 3's first remaining P2, not fixed.
3. **The glance linked-project wording is unchanged.** Round 3's second remaining P2 notes that the glance bullet describing the linked-project condition still reads less plainly than the body. Recorded, not fixed.
<!-- /ANCHOR:limitations -->

---
