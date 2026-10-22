---
title: "Tasks: Phase 61: v4-0-0-13-changelog-trim-and-simplify"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v4 0 0 13 changelog trim and simplify tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 61: v4-0-0-13-changelog-trim-and-simplify

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the `sk-create-changelog` contract and the previous changelog, so the section grammar, the glance ceiling, the target voice and the only allowed fact source are known before drafting (`.skilled/skills/sk-doc/sk-create-changelog/`, `.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T002 Scaffold this phase's four docs from the templates, with the level, the priority, the branch, the phase number and the review record fields in place before any writing brief goes out (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Run four DeepSeek v4.1 flash writers in parallel at max thinking, one section draft each, while removing the Resident Memory and MCP Tooling topics and replacing jargon with plain words. The drafts land in `scratch/draft-a.md` to `scratch/draft-d.md` (`.skilled/changelog/skilled/v4.0.0.13.md`, `scratch/draft-a.md`, `scratch/draft-b.md`, `scratch/draft-c.md`, `scratch/draft-d.md`)
- [x] T004 Assemble the four drafts into one file: remove both topics and their four spec-folder line entries, order sections, H4 items and bullets by user impact with the handover leading and OpenCode 2 named first, rewrite the glance list to 11 payoff bullets and settle the file at 2961 words from 3359 (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T009 Apply the operator's mid-task framing rule that OpenCode 2 is expected and recommended while OpenCode 1 is temporary backwards compatibility with no removal date: retitle to 'v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 2', set the trigger phrase to 'opencode 2 plugin support', set the H2 to 'OpenCode 2, With OpenCode 1 Still Supported', name OpenCode 2 first wherever both versions appear in prose, add the `Move to OpenCode 2` upgrade note and reword `Pin OpenCode 1` as a fallback step (`.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run both content validators over the assembled file: `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T006 Run separate read-only DeepSeek reviews of the finished file and fix any finding before the commit. Round 1 (DeepSeek v4.1 flash, max thinking, read-only) returned FAIL with four P1 findings: 'load' against 'run' in the opening, two lost facts (deep-loop logs keep every row on rebuild and five suites now run in CI), the history log narrowed, and 'empty entry' against 'bare null'. A DeepSeek fix pass fixed all four, applied eleven P2s, restored the two facts as the new `Saved State and Test Suites Hold Up` Reliability Fixes item and applied the OpenCode 2 framing rule. Round 2 returned PASS with four P2; the orchestrator fixed three by hand (an added gloss on the surface id, 'iteration config file', and the glance record bullet) and the fourth was the records update. Round 3 (the last review allowed) returned FAIL with one P1: reordering the versions had attached 'its two built-ins included' to OpenCode 1, fixed by hand as '42 on OpenCode 2, its two built-ins included, and 40 on OpenCode 1', plus one P2 on 'a session's sub-agent hand-off count' and the restoration of the config-shape sentence's cause and effect. The remaining two P2s are recorded under Known Limitations in `implementation-summary.md`, not fixed (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [ ] T007 Commit and push to main (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [ ] T008 Confirm CI is green on the pushed commit (`.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, the push and CI tasks included
- [ ] No `[B]` blocked tasks remaining
- [x] Review done: round 1 FAIL with four P1 all fixed, round 2 PASS with four P2, three fixed by hand and the fourth carried by this records update, round 3 FAIL with one P1 and one P2 fixed by hand and two P2s recorded
- [x] Manual verification passed: the two topics are gone with no grep hits, the jargon is replaced, the impact order leads with the handover and names OpenCode 2 first, and the file reads at 2961 words with 11 glance bullets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The changelog as the previous phase left it**: See `../060-v4-0-0-13-changelog-rewrite/implementation-summary.md`
- **The section drafts**: See `scratch/draft-a.md` to `scratch/draft-d.md`
<!-- /ANCHOR:cross-refs -->

---
