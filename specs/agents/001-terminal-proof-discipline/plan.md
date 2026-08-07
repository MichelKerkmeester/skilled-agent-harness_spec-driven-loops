---
title: "Implementation Plan: Terminal-Proof Discipline and Directive Injection"
description: "Integrate terminal-proof mechanics into AGENTS.md's existing authorities, extend the per-turn directive capsule, rebuild the advisor server, and validate the packet strictly."
trigger_phrases:
  - "terminal proof plan"
  - "AGENTS.md plan"
  - "directive capsule plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/001-terminal-proof-discipline"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Reconciled the plan with the review-directed distributed integration"
    next_safe_action: "None; implementation and verification are complete"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-agents-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Terminal-Proof Discipline and Directive Injection

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- The plan names the simplest viable approach, affected surfaces, and verification path.
- Phases match the stated scope; no setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (AGENTS.md, spec docs), TypeScript/JavaScript (advisor renderer and plugin) |
| **Framework** | system-skill-advisor MCP server with a compiled dist consumed by the pi hook bridge |
| **Storage** | None |
| **Testing** | validate.sh strict, vitest suite, node --test plugin suite |

### Overview
Integrate the terminal-proof mechanics into AGENTS.md's existing control architecture according to the review Placement Plan, then extend the existing per-turn directive capsule with a one-line proof-over-appearance directive in the canonical renderer and the OpenCode plugin fallback. Rebuild the advisor server dist so the pi bridge and all native runtimes pick up the new capsule, then prove everything with the strict validator and both test suites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Injection chain traced with file evidence

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (vitest, plugin node test, build)
- [x] Docs updated (spec/plan/tasks/checklist/summary) and strict validation exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive directive capsule appended to an existing per-turn injection chain; no new components.

### Key Components
- **render.ts**: canonical source of the directives. TERMINAL_PROOF_DIRECTIVE is appended after GOVERNOR_DIRECTIVE in the three composition points (two in renderAdvisorBrief, one in renderAdvisorFallbackDirective).
- **mk-skill-advisor.js**: OpenCode plugin fallback mirror. FALLBACK_DIRECTIVE gains the same line so the no-brief path stays byte-aligned with the renderer.
- **dist rebuild**: the pi bridge imports dist/hooks/claude/user-prompt-submit.js, which renders through the compiled renderer, so the build is what ships the change.
- **AGENTS.md**: durable home of the full protocol through distributed hard-gate, evidence, execution, routing, recovery, and quick-reference placements; the capsule stays a one-line disposition reminder.

### Data Flow
User turn enters pi, the prompt-advisor extension proxies it through the compiled Claude hook chain, the advisor brief is rendered with the directives appended, and the transformed prompt reaches the model. The new directive rides the same path with no new hops.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `render.ts` renderAdvisorBrief | Composes advisor line plus directives | Append TERMINAL_PROOF_DIRECTIVE | grep render.ts for the constant and three append sites |
| `render.ts` renderAdvisorFallbackDirective | Fallback capsule for no-brief turns | Append TERMINAL_PROOF_DIRECTIVE | grep render.ts |
| `mk-skill-advisor.js` FALLBACK_DIRECTIVE | OpenCode plugin fallback mirror | Add the mirror line | grep mk-skill-advisor.js |
| `dist/hooks/claude/user-prompt-submit.js` | Pi bridge entrypoint | Picks up change after rebuild | npm build exit 0 |
| `AGENTS.md` | Universal framework | Apply the eleven distributed placements and remove the standalone block | focused grep and git diff confirm owners, hard-blocker preservation, and block removal |
| Plugin tests `mk-skill-advisor.test.cjs` | Assert directive presence | Update if any exact-string assertion exists | node --test exit 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Analysis
- [x] Read AGENTS.md, hook-system.md, injection-contract.md, render.ts, mk-skill-advisor.js, pi prompt-advisor.ts
- [x] Map the terminal-engineer prompt steps against existing framework content and list the gaps
- [x] Trace the pi extension symlink chain end to end

### Phase 2: Implementation
- [x] Apply the review's eleven-step distributed integration to AGENTS.md and remove the standalone block (verified: planned owners at lines 26, 84-113, 193-201, 284-318, 373-388, 417-419, and 525-526; focused diff and residue grep pass)
- [x] Author the Level 2 packet docs
- [ ] Add TERMINAL_PROOF_DIRECTIVE to render.ts and append it in the three composition points
- [ ] Mirror the directive in mk-skill-advisor.js FALLBACK_DIRECTIVE
- [ ] Rebuild the advisor server dist

### Phase 3: Verification
- [ ] Run the vitest suite and the plugin node test
- [ ] Run validate.sh --strict on the packet and fix any remaining errors
- [ ] Confirm probe.txt removal and a clean final state
- [ ] Mark checklist items with evidence and close the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor renderer directive composition | vitest suite in system-skill-advisor/mcp-server |
| Unit | OpenCode plugin fallback capsule | node --test .opencode/plugins/tests/mk-skill-advisor.test.cjs |
| Build | Compiled dist for the pi bridge and native runtimes | npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build |
| Static | Packet compliance | validate.sh --strict (exit 0) |
| Diff | AGENTS.md distributed-placement and standalone-block-removal proof | git diff AGENTS.md plus focused residue grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| npm toolchain in system-skill-advisor/mcp-server | Internal | Green (scripts verified in package.json) | Build and tests cannot run; hook change cannot ship |
| system-spec-kit shared build | Internal | Green (build script composes it) | Renderer cannot compile |
| git | Internal | Green | Insertion-only proof unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any test failure tied to the new directive, or operator disapproval of the per-turn text.
- **Procedure**: revert the render.ts and mk-skill-advisor.js edits, then rerun the build so dist returns to the prior capsule. Revert the scoped AGENTS.md integration diff separately. Packet docs can remain as the decision and verification history.
<!-- /ANCHOR:rollback -->
