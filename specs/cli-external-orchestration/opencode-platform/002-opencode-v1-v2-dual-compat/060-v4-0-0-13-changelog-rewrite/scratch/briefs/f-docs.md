ROLE: Spec-folder record keeper. You edit docs only.

TASK: Rewrite the four docs in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/` (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`) so they describe THIS phase.
- They are currently copies of phase 057's docs (`../057-v4-0-0-13-reliability-fixes/`). Keep their template structure, anchors, frontmatter keys and section headings exactly. Replace every 057-specific value and sentence.
- Edit only those four files.

PHASE FACTS (use only these):
- Phase 60 of 60, Level 1, priority P1, created 2026-10-22. Branch `worktrees/205-v4-0-0-13-changelog-rewrite`. Predecessor `059-cross-cli-map-refresh`, successor None.
- Status: "In Progress" in `spec.md` and `implementation-summary.md`, because the push and CI tasks are still open.
- Trigger phrases: "v4 0 0 13 changelog rewrite" and "phase 60 v4 0 0 13 changelog rewrite".
- Operator request, 2026-10-22: the changelog was mostly about the handover, especially at the start. OpenCode 2 plugin support should be equally important. Write more effectively and concisely, in a more marketing style, like the v4.0.0.0 changelog.
- Scope: `.skilled/changelog/skilled/v4.0.0.13.md` only, plus this phase's docs and the parent's phase-map and handoff rows. Out of scope: any code, any other changelog, and the new default model, which phase 058 is switching. The rewrite keeps `llmgateway/deepseek-v4.1-flash` as the stated default because 058 had not landed on main when this phase was written.
- Before and after:
  - Title before: "v4.0.0.13, Sessions That Hand Themselves Over". After: "v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2".
  - Words 4149 before, 3359 after.
  - In-Session Handover went from 8 to 6 H4 items (805 to 605 words). OpenCode 1 and 2 went from 8 to 6 H4 items (941 to 697 words).
  - The glance list stays at 12 bullets, with the first six alternating handover and OpenCode.
  - The other sections were each cut by about a quarter to a third.
- How it was built:
  - Three DeepSeek v4.1 flash writers ran in parallel at max thinking through cli-pi on llmgateway, one each for the top matter, the two headline sections and the remaining sections. They were assembled into one file, then given one polish pass.
  - Every writer was told to use only facts already in the previous changelog.
- Review, by separate read-only DeepSeek sessions:
  - Round 1: FAIL, with 2 P1s and many P2s. The P1s were the title "Sessions That Never Run Out", which overstated the handover, and an interrupted-hop sentence that had lost its condition.
  - Round 2: FAIL, with 1 P1 and 4 P2s. The P1 was that the live-test and side-by-side claims had attached to agents, commands and config.
  - Round 3: PASS, with 2 P2s.
  - All P1s were fixed. Ten round-1 P2s were restored:
    - the CI suites;
    - "with the model you started it on";
    - the watcher's bound;
    - `opencode-go` still selectable;
    - the rollback line;
    - Homebrew not sitting beside v1;
    - "what it checks has not changed";
    - existing Code Mode installs;
    - the alias reason;
    - the agents, commands and config in the OpenCode glance bullet.
  - Three round-2 P2s were fixed: the warm-cache qualifier, the `cupt add` docs wording and the skipped archive file.
- Facts dropped on purpose for concision, and recorded:
  - the hop-history line tags and fields;
  - the bridge's `session.created` and message-field details;
  - the `--dir`/`--variant` reason;
  - the adversarial-review sentence;
  - the advisor timing numbers (36 files, 2.2 ms to 0.24 ms) and its monotonic clock;
  - the break-lock detail;
  - the excluded package trees;
  - the 8 P1 and 16 P2 split;
  - the Hermes environment-variable note;
  - the env-settings exclusion sentence;
  - the "names any note nobody claimed" open-note detail;
  - the two round-1 H4 headings that were merged ("You Can See Every Hop Afterwards" and "Sub-Agents and Nested Runs Stay Out of the Loop").
- P2s left open:
  - Round 3: the `/doctor:env` glance bullet says "shows and saves each one", and the hop-history glance bullet says it "names any note nobody claimed". Both sentences are carried over word for word from the previous changelog's glance list, so they are recorded rather than changed.
  - The spec-folder line keeps "phases 032 and 033", which the contract allows on that line.
- Deviations:
  - The orchestrator made one mechanical edit by hand: "Only the 17 plugins showed their effect live" became "All 17 plugins showed their effect live", because "Only" read as a limitation.
  - The spec-folder line gained one missing comma.
  - The suite table stays, as in the previous version, because the operator asked to show the testing.
- Validation: `validate_document.py` reports VALID with 0 issues, and `hvr_scan.py` reports 0 hard blockers.
- Tasks:
  - T001 to T009 are done: read the contract and the exemplar, scaffold, three parallel writers, assembly, polish, review rounds 1 to 3 with their fixes, and validators.
  - T010 "Commit and push to main" is open.
  - T011 "Confirm CI green on the pushed commit and the index rebuild after it" is open.
  - The checklist lines "All tasks marked [x]" and "Manual verification passed" stay unticked.

Rules: no Oxford commas, no em dashes, no semicolons in prose. No ids in prose other than the commit and phase names given here. When done, print the four file names.
