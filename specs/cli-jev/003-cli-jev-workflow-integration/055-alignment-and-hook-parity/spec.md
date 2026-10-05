---
title: "Feature Specification: Phase 55: alignment-and-hook-parity"
description: "The kept Jev code, its docs and its env switches had drifted from each other, and the injection screen ran on Claude Code only while other hooks were unevenly wired with no recorded reason. This phase aligns code and docs, and gives every hook an adapter on each runtime that can carry it or a recorded reason where none can."
trigger_phrases:
  - "jev alignment and hook parity"
  - "injection screen runtime parity"
  - "cross runtime hook parity"
  - "live sync hook parity"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 55: alignment-and-hook-parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 55 of 56 |
| **Predecessor** | 054-classifier-module-names |
| **Successor** | 056-codex-dispatch-and-checklist |
| **Handoff Criteria** | Every hook is covered on each runtime or carries a verified reason, docs and env surfaces match the code, and every suite passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 55** of the cli-jev workflow integration packet. After phase 54 the operator asked for three things: code aligned with sk-code-opencode, every README and env surface true to current reality with the switches, `.env.example` and `/doctor:env` in step, and perfect cross-runtime parity for every hook.

**Scope Boundary**: The four kept Jev features, their docs and switches, the hook hub, its registry and the runtime adapters. No feature changes what it measures.

**Dependencies**:
- Phase 54, which gave the kept code its `classifier-` names
- The installed Cursor, Codex, Devin, OpenCode and Pi CLIs, read for each runtime's fetch tool and hook payload

**Deliverables**:
- One shared injection screen library and adapters for Devin, OpenCode, Pi and Hermes beside the Claude Code one
- `git-live-follow` and `git-primary-reconcile` wired on Cursor and Devin, and `git-live-follow` on Hermes
- A true reason for every runtime a hook still skips, in the registry, the coverage matrix and the rationale
- Docs and env surfaces brought to the code

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`ENV-REFERENCE.md` named the files that read each Jev switch before phase 54 moved them, and several READMEs described retired or moved code. The injection screen ran on Claude Code only, the live-sync hooks skipped Cursor and Devin, and the registry gave "No Pi counterpart is registered" for hooks Pi does run. The coverage matrix also contradicted the registry in several cells.

### Purpose
A reader of any hook doc, env file or registry entry learns what really runs on each runtime, and each hook runs everywhere a runtime can carry it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Injection screen adapters for Devin, OpenCode, Pi and Hermes over one shared library
- Cursor and Devin bindings for `git-live-follow` and `git-primary-reconcile`, with a background mode for Cursor's command builder
- Hermes' session-start guards gaining `git-live-follow`
- Registry Pi entries corrected to name the extension that runs each hook, or a true reason
- The coverage matrix, rationale, injection contract, hook READMEs, env references and skill READMEs

### Out of Scope
- An injection screen on Cursor: its `Fetch` hook payload carries no page text
- An injection screen on Codex: its only web tool is hosted, so no fetched page reaches a local hook
- The Fable sub-agent guard beyond Claude Code: it guards Claude Code's own Agent-tool semantics
- Changelogs - they record history

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/classifier-injection-screen/**` | Create and modify | Shared library, Devin and Pi adapters, tests |
| `.opencode/plugins/classifier-injection-screen.js` | Create | OpenCode adapter and its test |
| `.hermes/plugins/repo-guards/**` | Modify | `web_extract` bridge and the live-follow guard |
| `runtime-mirrors/hook-registry.json`, `sync-hook-registrations.cjs` | Modify | New bindings, Pi entries, Cursor background mode |
| `.cursor/hooks.json`, `.devin/hooks.v1.json`, runtime mirrors | Regenerate | From the registry |
| Hook, skill and env docs | Modify | Match the code |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every runtime whose fetch tool result reaches a hook runs the injection screen with the same advisory text |
| REQ-002 | Every hook in the registry is bound on each runtime that can carry it, or carries a reason checked against code or a live probe |
| REQ-003 | Every suite passes, and the registration and mirror syncs pass their checks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The coverage matrix, rationale and injection contract agree with the registry and the files on disk |
| REQ-005 | Every Jev switch's Source cell, `.env.example` and `hook-flags.env.example` name the code that reads it, and `/doctor:env` still parses the reference |
| REQ-006 | New and changed code passes the sk-code-opencode alignment verifier |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A page carrying injection text flags through the real Devin payload shape, and a clean page stays silent.
- **SC-002**: No coverage cell reads "No Pi counterpart is registered" or contradicts the registry.
- **SC-003**: Every suite passes at or above its baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A runtime names its fetch tool differently from its docs | The adapter never fires | Read each runtime's real payload: a live probe or its own recorded sessions |
| Risk | An adapter writes to stdout where the host expects a hook envelope | A broken hook output | Every adapter writes one envelope or nothing, and the OpenCode plugin never writes |
| Risk | A detached session-start command holds the session | Slow session start | Background commands send output to `/dev/null` and detach |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The screen keeps its existing call and time budget on every runtime.

### Security
- **NFR-S01**: No adapter reads or forwards a credential. Jev keeps its stored credential.
- **NFR-S02**: A fetched heading never enters the advisory.

### Reliability
- **NFR-R01**: Every adapter fails open and leaves the fetch result untouched on any error.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A fetch result with no text, or in a shape no extractor knows, screens nothing.

### Error Scenarios
- Jev not ready, the feature switch off or the hook kill switch off: no advisory, exit 0.

### State Transitions
- The OpenCode plugin drains each session's advisories once and keeps its buffer bounded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Five runtimes, about 40 files |
| Risk | 9/25 | Live hook wiring on four runtimes |
| Research | 8/20 | Payload shapes read from installed CLIs |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
