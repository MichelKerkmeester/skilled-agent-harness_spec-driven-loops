---
title: "Tasks: Phase 6: docs-and-live-hop-proof"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "docs and live hop proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: docs-and-live-hop-proof

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Two shell variables are used below. Export both before running a Verify command:

~~~bash
export S=specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/006-docs-and-live-hop-proof
export H=.skilled/skills/system-spec-kit/runtime/hooks
~~~
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Record the inventory baseline in the packet (`spec.md`). Verify: `rg -l "History Lookup" --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' . | wc -l` prints 17.
- [ ] T002 [P] Confirm the compiled lookup CLI exists before any doc names it (`runtime/dist/hooks/lib/history/cli.js`). Verify: `ls .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js` prints the path.
- [ ] T003 [P] Confirm the handover suites pass before any doc edit (`session-relaunch/tests/`). Verify: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0.
- [ ] T004 [P] Read the locator schema fields the docs must not contradict (`$H/claude/hook-state.ts`). Verify: `rg -n 'provenance' $H/claude/hook-state.ts` prints the schema line.
- [ ] T005 [P] Read the fragment rule the user-facing text must repeat (`$H/lib/history/README.md`). Verify: `rg -n "live. does not match .delivery" $H/lib/history/README.md` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Rewrite the catalog entry so the locator is minted at `prepare` and the section is printed at `claim` (`.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md`). Verify: `rg -n 'Offers one bounded, read-only history lookup after a compaction' .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` prints nothing.
- [ ] T007 Rewrite the catalog index summary of the same feature (`.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`). Verify: `rg -n 'The compaction hooks mint an opaque locator' .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` prints nothing.
- [ ] T008 Rewrite the one paragraph that places the lookup after a compaction (`.skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md`). Verify: `rg -n 'When a compaction hook minted a fresh locator' .skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md` prints nothing.
- [ ] T009 Rewrite the playbook page as a claim-time scenario with the same gates (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md`). Verify: `rg -n 'Trigger a live compaction' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` prints nothing.
- [ ] T010 Rewrite the recall scenario as a hop where the receiver is offered the lookup (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md`). Verify: `rg -n 'the compaction offers the' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md` prints nothing.
- [ ] T011 Rewrite the recall baseline as a hop with no lookup offered (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-baseline-conversation.md`). Verify: `rg -n 'section is offered' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-baseline-conversation.md` prints nothing.
- [ ] T012 Add the handover producer beside the compaction adapters in sections 1 and 11 (`$H/lib/history/README.md`). Verify: `rg -c 'session-relaunch' $H/lib/history/README.md` prints 2 or more.
- [ ] T013 Document the locator at `prepare` and the section at `claim` (`.skilled/hooks/session-relaunch/README.md`). Verify: `rg -c 'History Lookup' .skilled/hooks/session-relaunch/README.md` prints 1 or more.
- [ ] T014 Add one receiver lookup step to section 5 (`.skilled/commands/speckit/handoff.md`). Verify: `rg -n 'history/cli.js' .skilled/commands/speckit/handoff.md` prints one line.
- [ ] T015 Retitle and rewrite the history section for the hop (`README.md`). Verify: `rg -n 'History after compaction' README.md` prints nothing.
- [ ] T016 Remove the `session-history-lookup.js` offer row (`.opencode/plugins/README.md`). Verify: `rg -n 'session-history-lookup.js' .opencode/plugins/README.md` prints nothing.
- [ ] T017 Add the fragment rule and the `live`/`delivery` example to the three user-facing docs (`README.md`, `$H/lib/history/README.md`, `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md`). Verify: `rg -c "'live' does not match 'delivery'" README.md $H/lib/history/README.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` prints 1 for each of the three files.
- [ ] T018 Drop the shared compaction sentence from the skill doc and the Claude hook README (`.skilled/skills/system-spec-kit/SKILL.md`, `$H/claude/README.md`). Verify: `rg -n 'A compaction may add one bounded' .skilled/skills/system-spec-kit/SKILL.md $H/claude/README.md` prints nothing.
- [ ] T019 Drop the compaction-time lookup sentences from the Codex, Pi, Devin and DSH hook READMEs (`$H/codex/README.md`, `$H/pi/README.md`, `$H/devin/README.md`, `$H/dsh/README.md`). Verify: `rg -n 'After a compaction that context can end with the bounded|It mints a .live_branch_or_session_log. locator|After a compaction it reads the offer marker|It mints a .session_log. locator' $H/codex/README.md $H/pi/README.md $H/devin/README.md $H/dsh/README.md` prints nothing.
- [ ] T020 Add one changelog entry at the next four-part version after `v4.0.2.1` (`.skilled/changelog/skilled/v<next>.md`). Verify: `ls .skilled/changelog/skilled/` lists the new file after `v4.0.2.1.md`.
- [ ] T021 Run one live Claude Code hop under `skilled-loop` and record the sender id, the receiver id, the printed command and its reply (`$S/scratch/live-hop.md`). Verify: `rg -c 'history/cli.js' $S/scratch/live-hop.md` prints 1 or more.
- [ ] T022 Rerun the phase 001 measurement and write the before and after table (`$S/scratch/measurement.md`). Verify: `rg -c 'lookup_ran' $S/scratch/measurement.md` prints 2 or more.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Rerun the inventory without the two historical changelogs (`spec.md`). Verify: `rg -l "History Lookup" --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' --glob '!.skilled/changelog/**' --glob '!.skilled/skills/system-spec-kit/changelog/**' . | wc -l` prints 15.
- [ ] T024 Confirm no doc states the compaction-only offer (`spec.md`). Verify: `rg -n 'Offers one bounded, read-only history lookup after a compaction' --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' .` prints nothing.
- [ ] T025 Confirm the fragment rule in all three user-facing docs (`README.md`, `$H/lib/history/README.md`, `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md`). Verify: `rg -c "'live' does not match 'delivery'" README.md $H/lib/history/README.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` prints 1 for each file.
- [ ] T026 Rerun the handover suites after the doc pass (`session-relaunch/tests/`). Verify: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0.
- [ ] T027 Validate the whole phase tree (`../`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration --recursive --strict --quiet` prints `RESULT: PASSED` for the parent and every child.
- [ ] T028 Validate this packet on its own (`$S`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $S --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The live hop record holds a `history/cli.js` command with the sender's `--session` id and a zero exit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
