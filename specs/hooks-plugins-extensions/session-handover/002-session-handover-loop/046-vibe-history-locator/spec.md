---
title: "Feature Specification: Vibe sender history lookup at claim"
description: "A claim prints a History Lookup section only for a Claude Code or Codex sender, because the locator mint finds no transcript for a Vibe session. This phase teaches the mint to find a Vibe session folder and the working folder it records, so a Vibe receiver can read its sender's earlier turns."
trigger_phrases:
  - "vibe history locator"
  - "vibe history lookup at claim"
  - "vibe handover locator"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Vibe sender history lookup at claim

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/413-vibe-history-locator` |
| **Parent Spec** | ../spec.md |
| **Phase** | 46 of 46 |
| **Predecessor** | 045-vibe-automatic-handover |
| **Successor** | None |
| **Handoff Criteria** | A claim of a note a Vibe session wrote prints the History Lookup section, and the command it prints answers with the sender's turns |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 46** of the session handover loop. Phase 045 gave Vibe the automatic tier. The history lookup packet (`session-handover/001-history-lookup-handover-integration`) moved the lookup offer to claim time, and its mint resolves only Claude Code and Codex senders.

**Scope Boundary**: the Vibe branch of the handover locator mint in `lib/relaunch-core.cjs`, its tests and the docs that name which senders get a locator. The lookup CLI already reads Vibe sessions and stays as it is.

**Dependencies**:
- The history lookup packet's phase 007 on main, which put the recorded-folder check into the mint
- `MISTRAL_API_KEY` and `vibe` for one live hop

**Deliverables**:
- A Vibe branch in `mintHandoverLocator`
- Unit tests beside the Codex claim tests
- One live Vibe hop whose receiver redeems the printed lookup
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Vibe receiver claims its note with no History Lookup section, so it cannot read the sender's earlier turns when the note leaves a detail out. `mintHandoverLocator` picks the transcript with `runtime === 'claude'` or `runtime === 'codex'` and returns null for every other runtime. The lookup CLI already resolves a Vibe store root and the Vibe reader is marked ready, so only the mint is missing.

### Purpose
A claim of a note a Vibe sender wrote prints the History Lookup section, and the printed command answers with the sender's turns.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ VIBE_HOME=<tmp> node -e "<mint and section for runtime vibe, session vibe-sess-1, meta.json working_directory = this checkout>"
mint vibe: null
section vibe: null
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve a Vibe sender's session folder: `$VIBE_HOME/logs/session/unified/<session_id>`, or `~/.vibe/...` when `VIBE_HOME` is unset, the same path the lookup CLI builds
- Read the working folder a Vibe session records in its `meta.json`, so the mint's same-checkout check applies to Vibe
- Add claim tests for a Vibe sender: the section prints, another checkout gets none, and the printed command redeems
- Update the docs that say only Claude Code and Codex senders get a locator

### Out of Scope
- The lookup CLI and the Vibe reader - both already handle Vibe
- A locator for a hand-typed `/speckit-handoff` - Vibe exports no session id to tools, so that note names a `uuidgen` id with no session folder and the mint returns null as before

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | Vibe session folder and recorded working folder in the mint |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modify | Vibe claim tests |
| `.skilled/hooks/session-handover/README.md` and the handover docs that list locator senders | Modify | Vibe senders get a locator |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A claim of a note with `runtime: vibe`, whose session folder records a working folder in the receiver's checkout, prints `## History Lookup` naming the sender's session id. |
| REQ-002 | The command that claim prints, run from the receiver's checkout, exits 0 and answers with the sender's turns. |
| REQ-003 | A Vibe session folder that is missing, has no readable `meta.json` or records a folder in another checkout gives no section and writes no hook state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The handover suite, the history lookup entry tests and `tsc` keep their counts, plus the new tests. |
| REQ-005 | One live Vibe hop through `skilled-loop vibe` prints the section at claim, and its receiver redeems it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The same probe as Measured Behavior prints a locator for the mint and a section for the claim.
- **SC-002**: The new Vibe claim tests pass beside the Claude Code and Codex ones.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The lookup CLI builds the Vibe store path from `VIBE_HOME` or the home folder | High: a different path string gives a handle the CLI rejects | Build the path the same way and prove it with a test that redeems the printed command |
| Risk | Vibe changes where `meta.json` records the folder | Low | Fail closed: no recorded folder means no locator, never a wrong one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: The mint never throws into a claim: every Vibe failure returns null and the claim prints its note as before.
- **NFR-R02**: The mint reads only `meta.json` in the sender's session folder, never the journal.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a session id with characters outside `[A-Za-z0-9._-]` gives no locator, so no path is built from it.
- Maximum input: a long Vibe session with many journal segments costs one `meta.json` read.
- Failure path: a `meta.json` that is not JSON, or names no working folder, gives no locator.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function branch and tests |
| Risk | 8/25 | The handle must match the CLI's path exactly |
| Research | 4/20 | The Vibe meta.json shape is measured |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which `meta.json` field names the working folder? Decision: `environment.working_directory`, read from a live session on 2026-11-15. The same file also has `origin_directory`, which held the same path there. The mint reads `environment.working_directory` and falls back to `origin_directory`.
<!-- /ANCHOR:questions -->

---
