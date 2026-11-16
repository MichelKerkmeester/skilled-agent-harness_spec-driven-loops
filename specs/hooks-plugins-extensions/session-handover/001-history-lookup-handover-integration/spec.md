---
title: "Feature Specification: History lookup inside the in-session handover"
description: "The session history lookup is offered only after a compaction, which the in-session handover prevents. Six phases make the handover offer it, so a receiving session can look up the sending session's earlier turns, and retire the compaction offer."
trigger_phrases:
  - "history lookup handover integration"
  - "look up the sender session after a hop"
  - "history lookup at claim"
  - "deprecate compaction history offer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: History lookup inside the in-session handover

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | None |
| **Parent Packet** | hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Children 1 to 7 are Complete, recursive strict validation reports RESULT: PASSED, and a live Claude Code hop shows the receiver running the lookup against the sender session. Child 8 is a planned wider measurement, added after the parent closed, and it does not reopen the delivered work. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A model can search and load its own earlier turns through the history lookup, but the lookup is offered only after a compaction. The in-session handover starts a fresh session near the context limit so that compaction does not happen, and a receiving session then holds only the four sections of the handoff note. A detail the sender did not write down is lost, and the one tool that could recover it is never offered on that path. Across 173 Claude Code transcripts of this repository, 48 sessions compacted, 25 were offered the lookup and 3 ran it, so the compaction offer is also rarely used where it does appear. Those counts come from a script run on 2026-11-15 over the Claude Code transcript files for this repository under `~/.claude/projects/`: it counted sessions with a compaction boundary, sessions whose hook output carried the lookup section and sessions with a shell call to the lookup CLI. The script was not saved, so the counts are a heuristic to be replaced by the phase 1 measurement.

### Purpose
A session that claims a handoff can look up the sending session's earlier turns from the claim output, and the lookup is no longer offered after a compaction.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure whether a receiving session recovers a detail the handoff note left out, before anything is built.
- Give the handover concern ownership of the history lookup core, with behaviour unchanged.
- Mint a history locator for the sending session when a handoff is claimed. A Claude Code or Codex sender gets one. Phase 3 minted it at `prepare`, and phase 7 dropped that mint on 2026-11-15 at the operator's choice, because the claim overwrote it before anything printed it.
- Offer the lookup in the claim output and add one receiver step to the handoff command.
- Remove the compaction-time mint and offer on every runtime that has one.
- Update the docs, the catalog and the playbooks, and prove the result on a live hop.
- Fix the twelve P2 advisories the deep review left.

### Out of Scope
- Lookups across runtimes. A receiver reads a sender on the same runtime only.
- Lookups further back than the immediate predecessor session.
- Changes to the lookup operations, the reply bound or the search behaviour.
- Cursor, which has no ready session reader.
- Changes to the handoff note's four sections or to the hop trigger.

### Files to Change
This is a phase-level file summary. Each child plan owns the detailed file list.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/` | Create | 001-hop-recall-baseline | Hop versions of the recall scenario pair and their recorded results. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/`, its importers and `runtime/tests/history-*.vitest.ts` | Modify | 002-history-core-relocation | The lookup core under the handover concern's ownership. |
| `.skilled/hooks/session-handover/bin/session-handover.cjs`, `lib/relaunch-core.cjs`, `runtime/hooks/claude/hook-state.ts` | Modify | 003-mint-locator-at-prepare | A locator minted at `prepare` and a second provenance source in the locator schema. |
| `.skilled/hooks/session-handover/bin/session-handover.cjs`, `.skilled/commands/speckit/handoff.md` | Modify | 004-offer-lookup-at-claim | The lookup section in the claim output and one receiver step. |
| `runtime/hooks/claude/compact-inject.ts`, `claude/session-prime.ts`, the Pi, DSH and Devin compaction hooks, `.opencode/plugins/session-history-lookup.js` | Modify and delete | 005-deprecate-compaction-offer | The compaction-time mint and offer removed. |
| Feature catalog, playbook pages, READMEs, changelog | Modify | 006-docs-and-live-hop-proof | Docs that match the new home, and the live hop record. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-hop-recall-baseline/ | Measure on a live hop whether a receiver recovers a detail the note left out. Go or no-go gate for the rest. | Complete |
| 2 | 002-history-core-relocation/ | The handover concern owns the lookup core. Behaviour and test count unchanged. | Complete |
| 3 | 003-mint-locator-at-prepare/ | `prepare` mints and persists a locator for the sending session, failing open. | Complete |
| 4 | 004-offer-lookup-at-claim/ | `claim` re-mints and prints the lookup section, and the receiver steps gain one line. | Complete |
| 5 | 005-deprecate-compaction-offer/ | No runtime mints or offers the lookup after a compaction. | Complete |
| 6 | 006-docs-and-live-hop-proof/ | Docs, catalog and playbooks updated, one live hop recorded, the phase 1 measurement rerun. | Complete |
| 7 | 007-review-remediation/ | The claim mints only for a transcript in the receiver's checkout, the command reads `CLAUDE_CONFIG_DIR`, `prepare` mints nothing, and the docs match the code. | Complete |
| 8 | 008-wider-hop-recall-measurement/ | Rerun the hop-recall measurement on Claude Code, Codex and Vibe, in both arms, with more runs and with real handoffs. Planned, not run. | Draft |
| 9 | 009-deep-review-p2-remediation/ | Fix the deep review's P2 advisories on the engine move, measure the search index memory, and remove the predecessor hard block from `/speckit:complete`. Independent of phase 8. | Complete |
| 10 | 010-history-secret-redaction/ | Redact secret-shaped values (API keys, tokens, private keys, auth headers, URL passwords) from every history lookup reply. The stored transcript stays untouched. | Complete |
| 11 | 011-opencode-pi-handover-parity/ | [Phase 11 scope] | Pending |
| 12 | 012-opencode-model-carry/ | [Phase 12 scope] | Pending |
| 13 | 013-devin-compaction-fallback-budget/ | Keep the Devin post-compaction notice within 4096 bytes with the recovery pointer whole when the history engine is not built, which turned Spec-Kit Check red on main. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-hop-recall-baseline | 002-history-core-relocation | The measurement is recorded and the operator has answered go. | The phase 1 result table and the recorded decision. |
| 002-history-core-relocation | 003-mint-locator-at-prepare | Every importer resolves and the history suites pass with the same test count as before. | `npx vitest run tests/history-*.vitest.ts` from the runtime folder. |
| 003-mint-locator-at-prepare | 004-offer-lookup-at-claim | A prepared handoff leaves a locator whose handle the lookup CLI re-derives. | The phase 3 test that redeems a locator minted at `prepare`. Phase 7 removed that mint and moved the check onto the claim-written locator. |
| 004-offer-lookup-at-claim | 005-deprecate-compaction-offer | A claim prints a lookup command that returns the sender's turns, including after the 30-minute window. | The phase 4 tests and one manual claim. |
| 005-deprecate-compaction-offer | 006-docs-and-live-hop-proof | No compaction path prints the lookup section and the remaining suites pass. | `rg` for the section title in the compaction hooks returns nothing, plus the hook suites. |
| 006-docs-and-live-hop-proof | 007-review-remediation | The deep review reports no P0 or P1 and lists every P2 it found. | `review/review-report.md` section 3. |
| 007-review-remediation | 008-wider-hop-recall-measurement | The lookup ships on main, and the engine build exists at its new path in the hook folder. | `test -f .skilled/hooks/session-handover/history/dist/cli.js && echo built` prints `built`. |
| 008-wider-hop-recall-measurement | 009-deep-review-p2-remediation | None: phase 9 remediates the phase 6 review and does not wait on phase 8's measurement. | Phase 9 started while phase 8 was Draft, by the operator's decision. |
| 009-deep-review-p2-remediation | 010-history-secret-redaction | None: phase 10 is a new operator request and does not depend on phase 9's fixes. | Phase 10 started after phase 9 merged, by the operator's decision. |
| 010-history-secret-redaction | 011-opencode-pi-handover-parity | [Criteria TBD] | [Verification TBD] |
| 011-opencode-pi-handover-parity | 012-opencode-model-carry | [Criteria TBD] | [Verification TBD] |
| 012-opencode-model-carry | 013-devin-compaction-fallback-budget | None: phase 13 fixes a CI failure and does not depend on phase 12. | The compaction test file passes with and without the history engine build. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Answered 2026-11-15: no go threshold is set in advance. The operator decides after seeing the phase 1 numbers, and phase 2 waits for that decision.
- Answered 2026-11-15: split ownership. The source and the build stay in the spec-kit runtime, and the handover concern owns the runnable entry, the printed command, the docs and the wiring.
- Does the purpose line planned for the OpenCode compaction path in `system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers` need a new carrier once phase 5 removes that plugin?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
