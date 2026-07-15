---
title: "Feature Specification: Import purity and comment-hygiene checker coverage"
description: "Two post-audit hardening fixes from the daemon-reliability sk-doc/sk-code cross-check: mk-code-index-launcher.cjs runs env side effects at require time, and the comment-hygiene checker misses a class of perishable labels."
trigger_phrases:
  - "import purity hardening"
  - "comment hygiene checker coverage"
  - "mk-code-index require side effect"
  - "RC DR phase label gap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/024-import-purity-and-comment-hygiene-coverage"
    last_updated_at: "2026-06-07T19:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded packet and dispatched 2 gpt-5.5 agents for the two fixes"
    next_safe_action: "Verify agent outputs, reconcile docs, commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-024-import-purity-and-comment-hygiene-coverage"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Import purity and comment-hygiene checker coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The post-merge gpt-5.5 cross-check of the daemon-reliability work surfaced two follow-ups. First, `mk-code-index-launcher.cjs` runs env side effects at require time (dotenv loading, stderr writes, and a `process.env` mutation under maintainer mode), because the `require.main === module` guard sits below them and gates only the bridge startup. Any module that imports the launcher's helpers inherits those side effects. Second, the comment-hygiene checker catches `ADR-`, `REQ-`, `CHK-`, and spec-path labels but misses `RC-N`, single-number `DR-N`, hyphen `phase-NNN`, and council `P#-Seat#`, and it only scans full-line comments, so those perishable labels reach the tree.

### Purpose
Make importing the code-index launcher side-effect-free, and close the high-signal pattern gaps in the comment-hygiene checker while scrubbing the daemon-reliability labels that already slipped through.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Defer the code-index launcher's env loading and maintainer-mode mutation so they run only when the file is the process entrypoint.
- A regression test proving `require()` of the launcher does not mutate `process.env` or write stderr.
- Extend the comment-hygiene checker patterns for `RC-N`, single-number `DR-N`, hyphen `phase-NNN`, and `P#-Seat#`, and scan inline trailing comments.
- A self-contained test for the checker covering should-flag and should-pass cases.
- Scrub the daemon-reliability perishable labels these patterns surface, in the launcher, supervision lib, and watchdog test.

### Out of Scope
- A blanket `F\d+` checker pattern - ~92 comment hits are almost all false positives, so F-notation stays review-only.
- Wiring the checker into the git pre-commit hook - it would block concurrent sessions until the repo-wide ~50-label backlog is scrubbed.
- Scrubbing the rest of the repo-wide blast radius - tracked as a follow-on.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Defer env side effects into the entrypoint path; scrub one council label |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-code-index-import-purity.vitest.ts` | Create | Require-purity regression test |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modify | Add RC/DR-single/phase-hyphen/seat patterns; scan inline comments |
| `.opencode/skills/sk-code/scripts/*` | Create | Self-contained checker test |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | Scrub DR/phase labels to durable WHY |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-watchdog.vitest.ts` | Modify | Scrub F-notation label to durable WHY |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Importing the code-index launcher is side-effect-free | `node -e "require('./.opencode/bin/mk-code-index-launcher.cjs')"` prints nothing and the regression test shows `process.env` unchanged across require |
| REQ-002 | Entrypoint behavior is unchanged | Running the launcher as the process entrypoint still loads env and starts the bridge as before; `node --check` passes |
| REQ-003 | Checker catches the missed label classes | A probe with `RC-2`, `DR-005`, `phase-004`, `P1-Seat2`, and an inline `// REQ-3` exits 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Checker preserves allowed classes and the hygiene-ok escape | `CWE-79`, `RFC 2616`, `POSIX`, `V16:`, and a `hygiene-ok` line exit 0 |
| REQ-005 | Daemon-reliability labels scrubbed | The four targeted files return exit 0 from the extended checker |
| REQ-006 | F-notation exclusion is documented, not silently dropped | The checker carries a comment explaining the F-notation exclusion rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Requiring the code-index launcher mutates neither `process.env` nor stderr, and its helper exports still resolve.
- **SC-002**: The extended checker flags every should-flag probe and clears every should-pass probe, and the four scrubbed files pass clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Env-dependent top-level code in the launcher | Deferring env loading could break the entrypoint path | Trace consumers first; move env-dependent entrypoint setup together with the loading |
| Risk | Inline-comment scanning false positives | A naive `//` match flags `//` inside string literals | Use a conservative heuristic and a should-pass test set |
| Risk | New patterns flag unscrubbed repo files | Wiring into pre-commit would block other sessions | Pattern extension only; pre-commit wiring deferred |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The checker runs in well under a second per file, so the PostToolUse path stays responsive.
- **NFR-P02**: Deferring env loading adds no measurable startup cost to the entrypoint path.

### Security
- **NFR-S01**: No new file reads or network access are introduced by either change.
- **NFR-S02**: The maintainer-mode env mutation stays gated to the entrypoint and never runs on import.

### Reliability
- **NFR-R01**: Require-purity is enforced by an automated regression test, not convention.
- **NFR-R02**: The checker stays best-effort and never blocks on its own internal error.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a file with no comments returns clean.
- Maximum length: long comment lines are scanned in full without truncation.
- Invalid format: a binary or unknown-extension file is skipped with exit 2.

### Error Scenarios
- External service failure: not applicable; both changes are local.
- Network timeout: not applicable.
- Concurrent access: parallel agent edits stay on disjoint files, so there is no write conflict.

### State Transitions
- Partial completion: if one agent fails, the other's disjoint change still applies and verifies independently.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 code files, 2 tests, ~150 LOC |
| Risk | 10/25 | Behavior-preserving refactor plus linter regex; no API change |
| Research | 6/20 | Dependency tracing and blast-radius measurement done up front |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding; the F-notation exclusion and deferred pre-commit wiring are resolved decisions recorded in scope.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
