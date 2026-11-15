---
title: "Implementation Plan: Phase 6: docs-and-live-hop-proof"
description: "Rewrite the fifteen non-changelog docs that mention the lookup so each names the in-session handover, add one changelog entry, run one live Claude Code hop under skilled-loop, and rerun the phase 001 measurement with a before and after column."
trigger_phrases:
  - "docs and live hop proof plan"
  - "history lookup docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: docs-and-live-hop-proof

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, Node.js CLI |
| **Framework** | None |
| **Storage** | Handoff notes under `.skilled/skills/.state/session-relaunch/handoffs/` and the hook state file |
| **Testing** | `validate.sh --recursive`, `rg` inventory checks, one live hop under `skilled-loop` |

### Overview
Fifteen Markdown files outside `specs/` mention the lookup, and the ones that say where it is offered place it after a compaction. Two historical changelogs record that offer as it shipped, so they stay as they are. The work rewrites the fifteen, adds one changelog entry, and proves the new home on one live Claude Code hop. The proof is a receiver that copies the printed command from its claim output and reads the sender's turns, recorded beside the phase 001 measurement rerun.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The inventory command in `spec.md` section 2 prints the same seventeen lines
- [ ] `ls .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js` prints the path

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration --recursive --strict --quiet` prints `RESULT: PASSED`
- [ ] The live hop record holds the receiver's `history/cli.js` command and its zero exit
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only change.

### Key Components
- **The inventory command**: `rg -l "History Lookup"` defines the set of docs, so the set is measured rather than remembered.
- **The changelog workflow**: `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` owns the target path and the four-part version, so this phase does not invent either.
- **The live hop**: `prepare` mints the locator, `claim` prints the section, and the receiver runs one printed command.

### Data Flow
`prepare` mints a locator for the sender session and persists it under the checkout root. `claim` re-mints it and prints one bounded `## History Lookup` section with a runnable command. The receiver copies that command, and the CLI re-reads the stored locator, repeats the handle, session, runtime, workspace and freshness gates, and prints one bounded reply. The docs describe that chain at each link, so no page says the chain starts at a compaction.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the seventeen-file inventory from `spec.md` section 2, the history README sections 1, 4 and 11, and the locator schema in `hook-state.ts` lines 285 to 324. Implementation rewrites the fifteen non-changelog docs, adds one changelog entry, and runs one live Claude Code hop under `skilled-loop`. Verification reruns the inventory, the phase 001 measurement and `validate.sh --recursive` on the parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The doc checks are text checks, so each one runs as a command:

```bash
rg -l "History Lookup" --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' --glob '!.skilled/changelog/**' --glob '!.skilled/skills/system-spec-kit/changelog/**' . | wc -l
rg -n "'live' does not match 'delivery'" README.md .skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md
rg -n 'session-relaunch' .skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md
```

The first prints `15`. The second prints one line per file. The third prints at least two lines.

The live proof runs once, on Claude Code, inside `skilled-loop`. The sender prepares a handoff whose note leaves out one detail, the receiver claims it, and the run records whether the receiver ran the lookup and whether it recovered the detail. The record holds the printed command and its exit status.

The measurement rerun repeats the phase 001 hop scenario and reports two fields per arm, `answer` and `lookup_ran`, in one table with a before and an after column.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `rg` for every inventory and text check.
- `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` for the packet gate.
- The compiled lookup CLI at `.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js`, because the printed command runs the compiled helper.
- One live Claude Code session under `skilled-loop` for the hop proof.
- No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a doc states a behavior the merged code does not have, or the live hop shows the receiver cannot reach the sender session. Revert the commit that carries the doc pass, or restore the fifteen files from `HEAD` when the change is uncommitted. No runtime state changes, because the hop writes only gitignored handoff notes and hook state. The changelog entry is one new file and is removed with the same revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sources -->
## 8. SOURCES

Every path, symbol and number above comes from one of these lines.

| Claim | Source |
|---|---|
| The lookup core answers `search`, `browse`, `load` and `page`, and `cli.ts` is the only runnable redemption path | `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:18-27` |
| `lookup-offer.ts` owns the `## History Lookup` section and its 600-character budget, and every producer prints it only after the locator write persisted | `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:25` |
| Search matches identifier parts split on `-`, `.`, `/`, `:` and `_` or a case change, and `live` does not match `delivery` | `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:76-83` |
| The CLI takes `--session`, `--handle` and one operation, and the locator must be less than 30 minutes old | `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:118-133` |
| The history README's related list points at the hook helpers and the session-lifecycle README | `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md:203-208` |
| The locator schema is closed and versioned, with `runtime`, `sessionId`, `workspace`, `locatorKind`, `handle`, `mintedAt` and `provenance` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:285-324` |
| `provenance.source` accepts `precompact` and `post_compaction` today | `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:306` |
| Each runtime declares one locator kind | `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:228-235` |
| `claim` prints the note body, the `complete` line and the optional `Goal packet:` line | `.skilled/hooks/session-handover/bin/session-handover.cjs:692-722` |
| `claimHandoff` moves the note `open -> claimed` under one lock | `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1494-1513` |
| The receiver claims the note, reads its four sections and runs `complete` at the end | `.skilled/commands/speckit/handoff.md:211-227` |
| The receiver claims the note and reads its four sections | `.skilled/hooks/session-handover/README.md:170` |
| The root README says a compaction can carry the section, on six runtimes, at most 16 KiB per reply, with a 30-minute handle | `README.md:536-542` |
| The plugins README row describes `session-history-lookup.js` as a `session.compacted` offer | `.opencode/plugins/README.md:53` |
| The catalog index describes the offer as post-compaction | `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1104-1116` |
| The catalog entry's description says the offer follows a compaction | `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:3` |
| The catalog entry's overview, locator mint, gates and CLI redemption | `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:19-53` |
| The playbook page opens with the post-compaction offer and step 3 asks for a live compaction | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:22-24` and `:72` |
| The recall scenario says the compaction offers the section | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md:18` |
| The recall baseline says no section is offered | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-baseline-conversation.md:18` |
| `SKILL.md` says a compaction may add the section | `.skilled/skills/system-spec-kit/SKILL.md:143` |
| The session-recovery entry says the hook may add the section after a compaction | `.skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md:33` |
| The Claude hook README says a compaction may add the section | `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md:99` |
| The Codex hook README says the section can end a post-compaction context | `.skilled/skills/system-spec-kit/runtime/hooks/codex/README.md:21` |
| The Pi hook README's `session-compact-context.ts` row mints a locator and appends the section | `.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md:47` |
| The Devin hook README's `user-prompt-submit.ts` row prints the section once after a compaction | `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md:39` |
| The DSH hook README's `session-compact-context.mjs` row mints a locator and appends the section | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/README.md:29` |
| The changelog workflow owns the target path and the four-part version | `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:9-11` |
| The newest existing entry is `v4.0.2.1.md` | `.skilled/changelog/skilled/v4.0.2.1.md:1` |
| The census counts `173`, `48`, `25` and `3` | `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/spec.md:67` |
| Phase 001 measures answer correctness and whether the receiver read the sender's transcript | `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/scratch/wave-c/brief-p1.md:45-49` |
| `validate.sh` accepts `--recursive` | `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:70` |
<!-- /ANCHOR:sources -->

---
