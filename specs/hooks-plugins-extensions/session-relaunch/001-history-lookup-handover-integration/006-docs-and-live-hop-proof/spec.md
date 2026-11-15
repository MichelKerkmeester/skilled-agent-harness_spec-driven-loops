---
title: "Feature Specification: Phase 6: docs-and-live-hop-proof"
description: "Seventeen Markdown files outside specs/ still place the session history lookup after a compaction, which the in-session handover prevents. This phase moves that text to the handover, adds the changelog entry, and proves the result on one live Claude Code hop."
trigger_phrases:
  - "docs and live hop proof"
  - "phase 6 docs and live hop proof"
  - "history lookup at claim docs"
  - "live hop lookup proof"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: docs-and-live-hop-proof

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-deprecate-compaction-offer |
| **Successor** | None |
| **Handoff Criteria** | The packet closes: `validate.sh --recursive` on `../` prints `RESULT: PASSED`, no non-changelog doc states that the lookup is offered only after a compaction, and a live Claude Code hop under `skilled-loop` records the receiver running the lookup against the sender session. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the history-lookup handover packet: the lookup moves out of the compaction path and into the in-session handover, so a receiving session can look up the sender's earlier turns.

**Scope Boundary**: Documentation, one changelog entry, one live hop record and one measurement rerun. No runtime source, test or hook file changes.

**Dependencies**:
- Phases 002 to 005 are merged, so the lookup core sits under the handover concern and no compaction path mints or offers the section.
- The compiled lookup CLI exists at `.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js`.
- One live Claude Code session starts under `skilled-loop` and reaches its handoff threshold.

**Deliverables**:
- The updated docs, listed in section 3.
- One changelog entry under `.skilled/changelog/skilled/`.
- One live hop record that shows the receiver running the lookup against the sender session.
- One table that reports the phase 001 measurement before and after.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Seventeen Markdown files outside `specs/` mention the lookup, and the ones that describe where it is offered all place it after a compaction. After phase 005 no runtime mints or offers it there, so that text would describe a path that no longer exists while the real path, the handover, goes unmentioned. A reader who follows the docs would wait for a compaction that the handover is designed to prevent.

### Purpose
Every doc names the handover as the home of the lookup, and one live hop shows the receiver running it against the sender session.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -l "History Lookup" --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' . | sort
./.opencode/plugins/README.md
./.skilled/changelog/skilled/v4.0.2.0.md
./.skilled/skills/system-spec-kit/changelog/v2.12.37.0.md
./.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md
./.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
./.skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md
./.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md
./.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-baseline-conversation.md
./.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md
./.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md
./.skilled/skills/system-spec-kit/runtime/hooks/codex/README.md
./.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md
./.skilled/skills/system-spec-kit/runtime/hooks/dsh/README.md
./.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md
./.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md
./.skilled/skills/system-spec-kit/SKILL.md
./README.md
$ rg -l "History Lookup" --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' . | wc -l
      17
```

Section 2's Problem Statement quotes the `17` above as its evidence: seventeen Markdown files outside `specs/` mention the lookup today. Two of them are historical changelogs, so fifteen are in scope.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the feature catalog entry so the locator is minted at `prepare` and the section is printed at `claim`.
- Rewrite the playbook page and the recall pair so the scenario is a hop, not a compaction.
- Add the handover producer to the history README and the session-relaunch README.
- Add one receiver step to the handoff command doc and retitle the root README section.
- Update the plugins README row, the catalog index, the session-recovery entry, `SKILL.md` and the five runtime hook READMEs.
- Add one changelog entry under `.skilled/changelog/skilled/`.
- Run one live Claude Code hop under `skilled-loop` and record the receiver's lookup against the sender session.
- Rerun the phase 001 measurement and record the before and after numbers in one table.

### Out of Scope
- Changes to the lookup core, the offer builder or the locator schema - phases 002 to 004 own them.
- Any compaction hook or plugin source - phase 005 owns them.
- The historical entries `.skilled/changelog/skilled/v4.0.2.0.md` and `.skilled/skills/system-spec-kit/changelog/v2.12.37.0.md` - each records what shipped on its date, so rewriting one would falsify a release record.
- New runtime support - Cursor stays gated, as the reader readiness table exported by `.skilled/hooks/shared/session-readers/index.mjs` reports it today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` | Modify | The catalog entry: offer site moves from the compaction to `prepare` and `claim`. |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | The index summary of the same feature. |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md` | Modify | The one paragraph that places the lookup after a compaction. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | Modify | The scenario becomes a claim-time offer with the same gates. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-conversation.md` | Modify | The scenario becomes a hop where the receiver is offered the lookup. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-recall-baseline-conversation.md` | Modify | The baseline becomes a hop with no lookup offered. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` | Modify | Section 1 and section 11 name the handover producer beside the compaction adapters. |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Documents the locator at `prepare` and the section at `claim`. |
| `.skilled/commands/speckit/handoff.md` | Modify | Section 5, Receiving A Handoff, gains one lookup step. |
| `README.md` | Modify | The history section is retitled and rewritten for the hop. |
| `.opencode/plugins/README.md` | Modify | The `session-history-lookup.js` row. |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | The one line that places the lookup after a compaction. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` | Modify | The one line that places the lookup after a compaction. |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/README.md` | Modify | The one line that places the lookup after a compaction. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md` | Modify | The `session-compact-context.ts` row. |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md` | Modify | The `user-prompt-submit.ts` row. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/README.md` | Modify | The `session-compact-context.mjs` row. |
| `.skilled/changelog/skilled/v<next>.md` | Create | One release entry for the moved lookup. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The catalog entry names `prepare` and `claim` as the offer site and stops calling the offer compaction-only (`feature-catalog/context-preservation/compaction-history-lookup.md`) | `rg -n 'Offers one bounded, read-only history lookup after a compaction' <file>` prints nothing, and `rg -n 'claim' <file>` prints at least one line |
| REQ-002 | The playbook page runs the scenario at a claim and no longer asks for a live compaction (`manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md`) | `rg -n 'Trigger a live compaction' <file>` prints nothing, and `rg -n 'claim' <file>` prints at least one line |
| REQ-003 | The history README names the handover producer in section 1 and in section 11 (`runtime/hooks/lib/history/README.md`) | `rg -n 'session-relaunch' <file>` prints at least two lines |
| REQ-004 | The session-relaunch README documents the locator at `prepare` and the section at `claim` (`.skilled/hooks/session-relaunch/README.md`) | `rg -n 'History Lookup' <file>` prints at least one line, and `rg -n 'prepare' <file>` prints at least one line |
| REQ-005 | The handoff command doc gains one receiver step that runs the printed lookup command (`.skilled/commands/speckit/handoff.md`) | `rg -n 'history/cli.js' <file>` prints one line under section 5 |
| REQ-006 | The root README section is retitled and describes the hop instead of the compaction (`README.md`) | `rg -n 'History after compaction' <file>` prints nothing, and `rg -c 'handoff' <file>` prints 9 or more |
| REQ-007 | The plugins README no longer describes `session-history-lookup.js` as an active compaction offer (`.opencode/plugins/README.md`) | `rg -n 'session-history-lookup.js' <file>` prints nothing |
| REQ-008 | Every user-facing doc that describes search states the fragment rule and the `live`/`delivery` example (`README.md`, `runtime/hooks/lib/history/README.md`, `feature-catalog/context-preservation/compaction-history-lookup.md`) | `rg -c "'live' does not match 'delivery'" <each file>` prints 1 for each of the three files |
| REQ-009 | One live Claude Code hop under `skilled-loop` records the receiver running the lookup against the sender session | The record holds a `history/cli.js` command whose `--session` value is the sender's id, and its reply exits 0 |
| REQ-010 | The phase 001 measurement rerun is recorded as one table with a before and an after column | The table names `answer` and `lookup_ran` for both arms, and the after arm names the runtime and model |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | One changelog entry exists at `.skilled/changelog/skilled/v<next>.md`, the next four-part version after `v4.0.2.1` | `ls .skilled/changelog/skilled/` lists the new file, and `rg -c 'History Lookup' <file>` prints 1 or more |
| REQ-012 | The catalog index and the session-recovery entry stop placing the lookup at a compaction (`feature-catalog/feature-catalog.md`, `feature-catalog/retrieval/session-recovery-spec-kit-resume.md`) | `rg -n 'Offers one bounded, read-only history lookup after a compaction\|The compaction hooks mint an opaque locator\|When a compaction hook minted a fresh locator' <each file>` prints nothing |
| REQ-013 | `SKILL.md` and the Claude hook README drop the shared compaction sentence (`SKILL.md`, `runtime/hooks/claude/README.md`) | `rg -n 'A compaction may add one bounded' <each file>` prints nothing |
| REQ-014 | The Codex, Pi, Devin and DSH hook READMEs drop their compaction-time lookup sentences (`runtime/hooks/codex/README.md`, `runtime/hooks/pi/README.md`, `runtime/hooks/devin/README.md`, `runtime/hooks/dsh/README.md`) | `rg -n 'After a compaction that context can end with the bounded\|It mints a .live_branch_or_session_log. locator\|After a compaction it reads the offer marker\|It mints a .session_log. locator' <each file>` prints nothing |
| REQ-015 | The inventory still returns the same fifteen non-changelog files | `rg -l "History Lookup" --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' --glob '!.skilled/changelog/**' --glob '!.skilled/skills/system-spec-kit/changelog/**' . \| wc -l` prints 15 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration --recursive --strict --quiet` prints `RESULT: PASSED` for the parent and every child.
- **SC-002**: The inventory returns fifteen non-changelog files, and no one of them states that the lookup is offered only after a compaction.
- **SC-003**: One live Claude Code hop under `skilled-loop` records a `history/cli.js` command with the sender's `--session` id and a zero exit in the receiver's turns.
- **SC-004**: The before and after table holds the phase 001 numbers beside the rerun numbers.
- **SC-005**: `README.md`, the history README and the catalog entry each carry the fragment rule and the `live`/`delivery` example.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 to 005 merged and built | The docs would describe behavior that does not exist, and the live hop would fail | Run the doc pass after `npm run build` in `.skilled/skills/system-spec-kit/runtime` and after the handover suites pass |
| Dependency | One live Claude Code session under `skilled-loop` reaching its threshold | The proof cannot run on demand | Run `/speckit:handoff` inside the loop to force the hop, and record both session ids |
| Risk | Phase 001's result table does not exist in this checkout | The before column of the rerun table has no numbers | Quote the parent spec's census and record UNKNOWN for the hop arm, as open question 1 says |
| Risk | No file records the command that produced `173`, `48`, `25` and `3` | The rerun cannot reproduce those counts | Record the command this phase uses, as open question 2 says |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where is phase 001's recorded result table? Its `spec.md`, `plan.md` and `tasks.md` are scaffolds in this checkout, so the before column of the rerun table has no numbers. UNKNOWN.
- Which command and which transcript directory produced the counts `173`, `48`, `25` and `3` quoted from `../spec.md:67`? No file records them. UNKNOWN.
<!-- /ANCHOR:questions -->

---
