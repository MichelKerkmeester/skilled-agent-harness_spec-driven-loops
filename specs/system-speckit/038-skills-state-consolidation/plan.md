---
title: "Implementation Plan: skills-root state consolidation"
description: "Rewrite every reference to seven state directories, regenerate the affected build outputs, and replace fifteen ignore rules with a shape that survives the extra directory level."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: skills-root state consolidation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS and ESM Node, plus shell and markdown |
| **Framework** | None. Path constants in four subsystems |
| **Storage** | Machine-local runtime files, outside version control |
| **Testing** | `run-node-tests.mjs`, the markdown link guard, and per-resolver reads |

### Overview

Rewrite every reference from `.opencode/skills/.<name>-state` to `.opencode/skills/.state/<name>`, regenerate the affected build outputs, move the seven tracked READMEs as renames, and replace the fifteen ignore rules with a shape that survives the extra directory level. Existing state is discarded rather than migrated, so no data path is needed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One owning constant per subsystem. Each of the seven directories has exactly one resolver that decides its location; everything else either calls that resolver or is a test fixture and documentation that names the path independently.

### Key Components

- **Seven resolvers**: goal, loop-guard, spec-gate, completion-sentinel, authority, advisor and telemetry. These are the only places the location is decided.
- **Three build outputs**: the advisor server, the spec-kit scripts and the spec-kit MCP server compile sources that carry the path, so they are regenerated rather than edited.
- **`.gitignore`**: previously fifteen rules, seven excluding plus seven re-including a README. The new shape is one exclusion and one negation.

### Data Flow

A subsystem asks its resolver for a state directory, receives a path one level deeper than before, and writes as it always did. Nothing else in the call path changes; the extra segment is invisible above the resolver.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Seven resolvers | Own the state location | Update the constant | Each read or called; all report a `.state/` path |
| Three build outputs | Compile the resolvers | Regenerate | Rebuilt, then scanned: zero old-path references |
| Nineteen tests and fixtures | Assert or construct the path | Update | Full gate green |
| `.gitignore` | Keeps runtime state untracked | Replace the rule block | `git check-ignore` verified in both directions |
| Seven READMEs | Document each state directory | Move, re-point links | Link guard reports zero broken |
| Long-lived daemons | Hold the resolver in memory | Not a consumer to edit; restart required | Observed recreating an old directory; documented |

Required inventories:

- Same-class producers: no other directory under the skills root holds runtime state; the seven are the complete set.
- Consumers of the changed constants: located by a full-tree scan. The wrapped `grep` and `rg` shell functions in this environment returned false zeros, so the inventory was rebuilt in Python before it could be trusted.
- Matrix axes: seven directories by four reference classes (source, build output, test, documentation). Every cell was enumerated before editing.
- Algorithm invariant: a wrong state path never raises. It silently creates a directory, so absence of an error is not evidence; the invariant is checked by scanning for residual references and by watching for a recreated old directory.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the checkboxes and task state.

### Phase 1: Ownership discovery

Establish which code actually decides each location, separating owning constants from tests and prose. Closes when every one of the seven directories has a named owner.

### Phase 2: Rewrite and relocate

Apply the path rewrite across source, tests and docs; move the tracked READMEs as renames; discard the untracked runtime files. Closes when a residual scan returns zero.

### Phase 3: Regenerate and re-point

Rebuild the three affected packages from source, fix the ignore rules, and re-point the relocated READMEs' relative links. Closes when the link guard and both ignore directions pass.

### Phase 4: Verify

Read each resolver, exercise a subsystem end to end, and run the workspace gate. Closes when writes are observed landing under `.state/` and the gate is green.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residual scan | No old path survives anywhere | Full-tree Python scan |
| Resolver read | Each of the seven reports a `.state/` path | Direct require and read |
| Runtime observation | A real write lands in the new location | Advisor invocation, then a directory listing |
| Regression | Nothing else broke | `run-node-tests.mjs` |
| Link integrity | Relocated READMEs resolve | Repository markdown link guard |
| Ignore semantics | Runtime ignored, README tracked | `git check-ignore` in both directions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Three build toolchains | Internal | Green | Build outputs would keep old paths |
| Git ignore semantics | External | Green | Constrains the directory shape; a wrong shape drops the READMEs silently |
| Concurrent sessions | Internal | Yellow | Three active in the same checkout; staging must be explicit |
| Long-lived daemons | Internal | Yellow | Keep writing old paths until restarted |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a subsystem cannot write state, or a stale directory keeps returning after every daemon has restarted.
- **Procedure**: `git checkout -- .gitignore .opencode` restores every tracked file and the old ignore rules; `rm -rf .opencode/skills/.state` removes the new tree. The discarded runtime files were machine-local and regenerate either way, so nothing is unrecoverable.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [e.g., 4-8 hours] |
| Verification | [Low/Med/High] | [e.g., 1-2 hours] |
| **Total** | | **[e.g., 6-12 hours]** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| [Component A] | None | [Output] | B, C |
| [Component B] | A | [Output] | D |
| [Component C] | A | [Output] | D |
| [Component D] | B, C | [Final] | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **[Phase/Task]** - [Duration estimate] - CRITICAL
2. **[Phase/Task]** - [Duration estimate] - CRITICAL
3. **[Phase/Task]** - [Duration estimate] - CRITICAL

**Total Critical Path**: [Sum of durations]

**Parallel Opportunities**:
- [Task A] and [Task B] can run simultaneously
- [Task C] and [Task D] can run after Phase 1
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [Setup Complete] | [All dependencies ready] | [Date/Phase] |
| M2 | [Core Done] | [Main features working] | [Date/Phase] |
| M3 | [Release Ready] | [All tests pass] | [Date/Phase] |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: [Decision Title]

**Status**: [Proposed/Accepted/Deprecated]

**Context**: [What problem we're solving]

**Decision**: [What we decided]

**Consequences**:
- [Positive outcome 1]
- [Negative outcome + mitigation]

**Alternatives Rejected**:
- [Option B]: [Why rejected]

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
