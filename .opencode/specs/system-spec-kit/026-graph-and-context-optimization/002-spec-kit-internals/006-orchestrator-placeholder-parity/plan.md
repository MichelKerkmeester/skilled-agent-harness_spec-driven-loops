---
title: "Implementation Plan: Orchestrator vs shell placeholder-detection parity [template:level_2/plan.md]"
description: "Aligns the canonical Node orchestrator and the legacy shell placeholder rule onto one detection contract: catch YOUR_VALUE_HERE plus NEEDS_CLARIFICATION (underscore + space), exclude fenced/backtick-escaped markers, never flag mustache in spec docs. Rebuilds the mcp_server dist."
trigger_phrases:
  - "placeholder parity plan"
  - "validatePlaceholders fence exclusion"
  - "check-placeholders mustache removal plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/006-orchestrator-placeholder-parity"
    last_updated_at: "2026-05-29T12:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented orchestrator + shell parity and rebuilt dist"
    next_safe_action: "Run validate.sh --strict on this packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/006-orchestrator-placeholder-parity"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Orchestrator vs Shell Placeholder-Detection Parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server) + Bash (validate rules) |
| **Framework** | Node ESM, tsc --build |
| **Storage** | None |
| **Testing** | validate.sh --strict on the packet; standalone awk/grep parity check |

### Overview
The orchestrator's `validatePlaceholders` gains the space-variant marker plus fenced-code and inline-backtick exclusions, matching the awk/grep behavior the shell rule already has. The shell rule drops its mustache pattern and broadens NEEDS_CLARIFICATION to cover both underscore and space, making it a strict superset-parity with the canonical orchestrator. The mcp_server dist is rebuilt so the compiled validator reflects the source change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (validate.sh --strict PASSED)
- [x] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-path validation: orchestrator (canonical, compiled JS) is the active path; the shell rule is the no-orchestrator fallback. Parity means both paths apply one detection contract.

### Key Components
- **`validatePlaceholders` (orchestrator.ts)**: line-by-line scan with a single marker regex, fence toggle, and backtick-escape guard.
- **`check-placeholders.sh` run_check**: awk fence-strip + grep marker patterns with backtick grep -v exclusions.

### Data Flow
`validate.sh` -> `run_node_orchestrator` -> compiled `orchestrator.js` -> `validatePlaceholders` scans the docs from `docsForLevel`. Fallback path runs the shell rule with identical detection semantics.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a fix to a validator rule; placeholder detection is shared policy across the orchestrator and shell paths.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `orchestrator.ts validatePlaceholders` | Canonical placeholder detector (active path) | update: add space variant + fence/backtick exclusions | grep the space-variant marker in `dist/lib/validation/orchestrator.js` |
| `check-placeholders.sh` | Fallback placeholder detector | update: remove mustache, broaden NEEDS_CLARIFICATION | standalone awk/grep parity test on a fixture |
| `validate.sh run_node_orchestrator` | Selects orchestrator vs fallback | unchanged | reads dist when present (confirmed) |
| spec docs scanned via `docsForLevel` | Inputs | unchanged | scope of scanned docs untouched |

Required inventories:
- Same-class producers: `rg -n 'NEEDS_CLARIFICATION|NEEDS CLARIFICATION|YOUR_VALUE_HERE' .opencode/skills/system-spec-kit/mcp_server/lib .opencode/skills/system-spec-kit/scripts/rules`.
- Consumers of changed symbols: `rg -n 'validatePlaceholders|PLACEHOLDER_FILLED' .opencode/skills/system-spec-kit`.
- Matrix axes: marker variant (underscore/space) x location (plain line / fenced / inline-backtick) x mustache present.
- Algorithm invariant: a marker is flagged iff it matches the marker regex AND the line is not inside a fenced block AND the match is not immediately preceded by a backtick. Mustache is never a marker.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read orchestrator.ts, check-placeholders.sh, package.json build script
- [x] Confirm validate.sh prefers compiled dist orchestrator
- [x] Development environment ready

### Phase 2: Core Implementation
- [x] Add space variant + fence/backtick exclusions to orchestrator.ts
- [x] Remove mustache pattern, broaden NEEDS_CLARIFICATION in check-placeholders.sh
- [x] Rebuild mcp_server dist (`npm run build`)

### Phase 3: Verification
- [x] Standalone awk/grep parity test (matches lines 1-2 only on fixture)
- [x] Confirm dist contains the space-variant regex + fence/backtick logic
- [x] validate.sh --strict on the packet PASSED
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | awk fence-strip + grep marker exclusions | bash fixture (/tmp) |
| Integration | orchestrator placeholder rule on real spec docs | validate.sh --strict |
| Manual | dist regex inspection | grep on dist orchestrator.js |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript / tsc --build | Internal | Green | Stale dist; validator would not pick up the fix |
| validate.sh orchestrator path | Internal | Green | Fallback shell rule would run instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New false positives or false negatives surfaced on real spec docs.
- **Procedure**: `git revert` the orchestrator.ts and check-placeholders.sh changes, then rerun `npm run build`.
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
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Low | 1 hour |
| Verification | Low | 0.5 hour |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (validator rule only)
- [ ] Feature flag configured (N/A)
- [ ] Monitoring alerts set (N/A)

### Rollback Procedure
1. `git revert` the two source commits.
2. Rerun `npm run build` to regenerate the prior dist.
3. Run `validate.sh --strict` on a known-good packet to smoke test.
4. No stakeholder notification needed (internal tooling).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
