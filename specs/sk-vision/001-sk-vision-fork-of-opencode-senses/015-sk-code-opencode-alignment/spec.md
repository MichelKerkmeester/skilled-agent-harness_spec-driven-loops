---
title: "Feature Specification: sk-vision adapter code alignment"
description: "Bring the sk-vision Pi, OpenCode, and MCP adapter code up to the sk-code-opencode JavaScript/TypeScript standard: component headers, JSDoc, and inline WHY comments."
trigger_phrases:
  - "sk-vision code alignment"
  - "sk-vision adapter jsdoc"
  - "sk-vision inline comments"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-opencode-alignment"
    last_updated_at: "2026-08-17T12:49:01.000Z"
    last_updated_by: "claude"
    recent_action: "Added component headers, JSDoc, and inline comments to the three sk-vision adapters."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-opencode-alignment/spec.md"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-015-sk-code-opencode-alignment"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision adapter code alignment

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `014-cursor-devin-mcp-adapters` |
| **Successor** | N/A |
| **Handoff Criteria** | The three adapters carry component headers, JSDoc on functions, and inline WHY comments per the sk-code-opencode standard; build/test/typecheck stay green; comments are hygiene-clean; changes committed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

`013` and `014` restructured the adapters and added the MCP transport, but the adapter code itself was ported/authored functionally and did not meet the `sk-code-opencode` documentation standard. This phase closes that gap.

**Scope Boundary**: the three sk-vision adapter entrypoints — `hooks/pi/sk-vision.ts`, `hooks/opencode/sk-vision.ts`, `vision-runtime/src/mcp/server.ts`. Do not change behavior, the 13 tool contracts, or the upstream `vision-runtime/src` core (fork) beyond the MCP server file.

**Dependencies**:
- The `sk-code-opencode` JavaScript/TypeScript quality standard (JSDoc §5, module organization) is the alignment authority.
- The `mk-*.js` fleet plugins are the house-style exemplar (component banner + numbered section dividers).

**Deliverables**:
- Documented adapter code with no behavior change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-vision adapter code was sparse on documentation: `vision-runtime/src/mcp/server.ts` had 2 comment lines across 82, `hooks/pi/sk-vision.ts` 11 across 489. It carried no component header, no section structure, and no JSDoc on its functions — below the `sk-code-opencode` standard, which requires JSDoc on functions plus the house component/section headers and inline WHY comments.

### Purpose
Bring the three adapters up to the standard so a future reader can follow the host glue without reverse-engineering it, without changing any behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a component banner and numbered section dividers to each of the three adapters.
- Add JSDoc to the exported and helper functions, and inline WHY comments where logic is non-obvious.
- Keep every comment hygiene-clean (durable WHY only; no spec paths, packet ids, or issue ids).

### Out of Scope
- Any behavior change, tool-contract change, or new feature.
- The upstream `vision-runtime/src` core files other than the MCP server.
- The sk-code alignment-drift guards (routing/RESOURCE_MAP), which this comment pass does not touch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts` | Update | Banner, 5 sections, JSDoc on 6 functions, inline comments |
| `.opencode/skills/sk-vision/hooks/opencode/sk-vision.ts` | Update | Banner, sections, JSDoc on the plugin entry |
| `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts` | Update | Banner, sections, JSDoc on helpers + the registration loop |

### Verification evidence

- Comment density rose from 11 → 104 (`hooks/pi`), 9 → 30 (`hooks/opencode`), 2 → 42 (`mcp/server`).
- `bun run build` succeeds; `bun test` = 9 pass / 0 fail; `bun run typecheck` exits 0.
- No ephemeral labels (spec paths, packet/ADR/REQ/CHK ids) appear in the added comments.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No behavior change | `bun test` stays green (9/0); no non-comment diff in the tool logic |
| REQ-002 | Types still valid | `bun run typecheck` exits 0 |
| REQ-003 | Comments hygiene-clean | no spec paths / packet / ADR / REQ / CHK ids in the added comments |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | JSDoc on functions | exported + helper functions carry JSDoc with param/return descriptions |
| REQ-P2 | House headers + sections | each adapter has a component banner and numbered section dividers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Pi adapter documented. Evidence: `hooks/pi/sk-vision.ts` banner + 5 sections + JSDoc on 6 functions; 104 comment lines.
- [x] OpenCode adapter documented. Evidence: `hooks/opencode/sk-vision.ts` banner + sections + plugin JSDoc; 30 comment lines.
- [x] MCP server documented. Evidence: `vision-runtime/src/mcp/server.ts` banner + sections + helper JSDoc; 42 comment lines.
- [x] No behavior change. Evidence: `bun test` → 9 pass / 0 fail.
- [x] Types valid. Evidence: `bun run typecheck` exits 0.
- [x] Comments hygiene-clean. Evidence: `grep` for ephemeral labels found none.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A comment edit changes behavior | Silent regression | Comments only; `bun test` + `typecheck` re-run green |
| Risk | Comment embeds an ephemeral label | Pre-commit hygiene gate blocks the commit | `grep` sweep confirms none |
| Dependency | sk-code-opencode JS/TS standard | Defines the target | JSDoc §5 + house exemplar followed |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Which code does the alignment cover? **A**: The three sk-vision adapter entrypoints; the upstream `vision-runtime/src` core fork is out of scope.
- **Q**: Banner + sections, or JSDoc only? **A**: Both — the JSDoc standard plus the `mk-*.js` house style (component banner + numbered sections).

### Open Questions
- None.
<!-- /ANCHOR:questions -->
