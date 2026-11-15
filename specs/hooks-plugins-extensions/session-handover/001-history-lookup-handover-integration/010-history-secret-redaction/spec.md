---
title: "Feature Specification: Phase 10: history-secret-redaction"
description: "The history lookup returned a sending session's turns verbatim, so an API key, token, private key, auth header or URL password in the transcript reached the claiming session. This phase redacts secret-shaped values once, at the lookup core's intake, so every reply and every search sees only typed markers."
trigger_phrases:
  - "history secret redaction"
  - "phase 10 history secret redaction"
  - "redact secrets from history lookup"
  - "api keys in transcripts"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: history-secret-redaction

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/421-history-secret-redaction` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-deep-review-p2-remediation |
| **Successor** | None |
| **Handoff Criteria** | No search, browse, load or page reply holds a fixture secret, search cannot match one, and the engine, hooks, readers and handover suites pass at or above their baselines. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the history lookup handover integration. A session that claims a handoff reads the sender's earlier turns through the lookup, so whatever the sender pasted or printed travels with it.

**Scope Boundary**: the replies the history lookup CLI returns. The stored transcript, handoff notes and runtime transcripts are out of scope, by the operator's answer.

**Dependencies**:
- The spec-kit shared secret scrubber, `system-spec-kit/shared/parsing/secret-scrubber.ts`, built to `shared/dist` by the runtime build.

**Deliverables**:
- Intake redaction in the lookup core, its tests and a README note.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lookup core projected adapter entries and returned their text unchanged. A key, token, private key, `Authorization` value or URL password in the sending session's transcript came back in search previews, browse references, loaded turns and pages, and a search on the secret itself found the turn.

### Purpose
A claiming session reads typed markers such as `[REDACTED:github-token]` wherever the sender's transcript held a secret, and the stored transcript stays as it was.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The repro builds one user turn, one tool call and one tool result holding six fixture secrets (Anthropic key, GitHub token, AWS key id, PEM private key, `Authorization: Bearer` header, URL password), then lists which secrets each reply leaks. Run against the build at `fb76921ab8f`, before this phase:

```text
$ node scratch/repro-secret-leak.mjs .skilled/hooks/session-handover/history/dist/core.js
search        leaked: ant,gh,aws,pem
searchSecret  leaked: gh,aws,pem
browse        leaked: ant,gh,aws,pem,auth
load          leaked: ant,gh,aws,pem,auth,url
```

`searchSecret` searched for the AWS key itself and found the turn.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Redact every entry inside `createHistoryLookup` before projection, so search, browse, load and page all read redacted text.
- Reuse the shared secret scrubber for vendor keys, tokens, JWTs, bearer values, private keys and `key=value` credentials.
- Add the shapes the shared scrubber lacks: a URL password, a non-bearer `Authorization` value, and a tool-call argument stored under a credential name.
- Test every operation, search on a secret, a secret across a page edge, paging-turn exclusion and ordinary text.

### Out of Scope
- The stored transcript - the operator asked for replies only, and the lookup never writes.
- Handoff notes and runtime transcripts - outside the operator's answer.
- Adding the two new shapes to the shared scrubber - it also serves the continuity writer, a shared contract this phase does not own. Recorded as a follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/history/lib/core.ts` | Modify | Redact entries at intake, before projection |
| `.skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts` | Create | Four cases over the public lookup |
| `.skilled/hooks/session-handover/history/README.md` | Modify | One bullet in the public projection section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No lookup reply holds a secret from the entries. | The redaction suite's first case passes: search, browse, load, page and the part list hold no fixture tail, and the load reply holds each of the eight markers. |
| REQ-002 | Search cannot match a secret. | Searching for the full AWS key returns `references: []`. |
| REQ-003 | Redaction happens before bounds and paging. | A token that starts 10 units before the 2,000-unit page edge reads back redacted across pages. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Paging-turn exclusion and ordinary text survive. | A paging turn still disappears from browse, a skill slug, a URL port and `Authorization: required` read back byte for byte, and the input entries are unchanged. |
| REQ-005 | The real CLI path redacts. | A CLI run over a stored-locator fixture holding a URL password and a GitHub token prints both markers and neither secret. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The repro reports `leaked: none` for all four replies against the new build.
- **SC-002**: The engine suite passes at 144 (baseline 140), the hooks vitest tree at 501, the session readers at 103 and the handover node:test files at 390, and the engine typecheck and build exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared scrubber's build in `system-spec-kit/shared/dist` | Without it the engine cannot load | The runtime build references `../shared`, and the engine's tsconfig references the runtime, so one build order covers both. `worktree-naming.sh provision` builds it. |
| Risk | A pattern misses a secret shape | High | Redaction is a floor, not a guarantee. The shapes are the operator's named set, and a new shape is one pattern in the shared scrubber. |
| Risk | A pattern redacts ordinary text | Low | Every pattern needs a vendor prefix, a fixed shape or credential context, and the `Authorization` check skips a plain word. A test pins ordinary text byte for byte. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator answered the scope (lookup replies only) and the spec folder (new child 010).
<!-- /ANCHOR:questions -->

---
