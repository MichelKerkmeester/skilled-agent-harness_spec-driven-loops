---
title: "Implementation Plan: sk-vision adapter code alignment"
description: "Add component headers, JSDoc, and inline comments to the three sk-vision adapters per the sk-code-opencode standard, with no behavior change."
trigger_phrases:
  - "sk-vision code alignment plan"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-opencode-alignment/plan.md"
      - ".opencode/skills/sk-vision/hooks/opencode/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-015-sk-code-opencode-alignment"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision adapter code alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript adapters (Pi, OpenCode, MCP) |
| **Framework** | sk-code-opencode JavaScript/TypeScript quality standard |
| **Storage** | In-repo source; no build-output change |
| **Testing** | `bun run build`, `bun test`, `bun run typecheck`, comment-hygiene grep |

### Overview
A documentation-only pass over the three adapter entrypoints: add the house component banner and numbered section dividers, JSDoc on functions, and inline WHY comments — changing no behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Standard identified. Evidence: `sk-code-opencode` JSDoc §5 + the `mk-*.js` house exemplar.
- [x] Scope fixed to the three adapters. Evidence: `spec.md` Scope.

### Definition of Done
- [x] Docs added, behavior unchanged. Evidence: `implementation-summary.md` Verification.
- [x] Build/test/typecheck green. Evidence: `bun test` 9/0, `typecheck` exit 0.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation overlay on existing code: component banner, numbered sections, JSDoc, inline WHY — no logic touched.

### Key Components
- **Pi adapter** — banner + 5 sections (imports, helpers, factory, auto-inspect, lifecycle); JSDoc on 6 functions.
- **OpenCode adapter** — banner + sections; JSDoc on the plugin entry.
- **MCP server** — banner + sections; JSDoc on helpers and the tool-registration loop.

### Data Flow
Unchanged — this phase adds only comments.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pi adapter
- [x] Banner + sections + JSDoc on helpers and the factory + inline comments. Evidence: 104 comment lines in `hooks/pi/sk-vision.ts`.

### Phase 2: OpenCode + MCP adapters
- [x] OpenCode banner + sections + plugin JSDoc. Evidence: 30 comment lines in `hooks/opencode/sk-vision.ts`.
- [x] MCP banner + sections + helper JSDoc + loop comment. Evidence: 42 comment lines in `vision-runtime/src/mcp/server.ts`.

### Phase 3: Verification
- [x] Build/test/typecheck green; hygiene clean. Evidence: `bun test` 9/0, `typecheck` exit 0, no ephemeral labels found.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavior | tool logic unchanged | `bun test` (9/0) |
| Types | JSDoc/comment safety | `bun run typecheck` |
| Build | bundles still emit | `bun run build` |
| Hygiene | no ephemeral labels in comments | `grep` sweep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code-opencode JS/TS standard | Internal | Available | No alignment target |
| mk-*.js house exemplar | Internal | Available | No banner/section reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A comment edit is found to have altered behavior.
- **Procedure**: The change is comments-only across three files; revert those files to their pre-pass state. No behavior, contract, or build output depends on the comments.
<!-- /ANCHOR:rollback -->
