---
title: "Implementation Plan: Phase 6: live-verification-capture (mcp-refero)"
description: "Close the doubled-prefix naming conflict with the 2026-07-16 registry evidence, correct the pre-auth discovery preconditions, and record the fixture schema details across the mcp-refero packet."
trigger_phrases:
  - "refero discovery flip plan"
  - "refero fixture plan"
  - "refero live verification plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Plan executed; all phases complete"
    next_safe_action: "Operator handoff for OAuth items"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-refero/references/discovery-fixture-2026-07-16.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-refero"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: live-verification-capture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc skill packet conventions (SKILL.md, references, playbook) |
| **Storage** | None (JSON fixture file as static evidence) |
| **Testing** | `package_skill.py --check --strict`, targeted greps, `validate.sh --strict` |

### Overview
The 2026-07-16 fixture settles the packet's central hedge. The work greps every doc that hedges the doubled-prefix callable or gates discovery on OAuth, flips each to the registry-observed facts with the fixture cited, records the two fully-shown search-tool schemas, and closes with the packet gate. Scripts stay untouched because they already state the correct forms.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [evidence: spec.md sections 2-3]
- [x] Success criteria measurable [evidence: spec.md SC-001 to SC-003, each a command with an expected result]
- [x] Dependencies identified [evidence: fixture present, `capturedAt: 2026-07-16T13:49:06.282Z`, 8/8 names in `discoveredCallableNames`]

### Definition of Done
- [x] All acceptance criteria met [evidence: tasks.md T001-T008 all checked with per-task evidence]
- [x] Tests passing [evidence: `package_skill.py --check --strict` printed "Result: PASS"]
- [x] Docs updated (spec/plan/tasks) [evidence: this packet's four docs plus checklist.md authored at Level 2]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first documentation: one dated fixture is the single source of truth; the conflict resolution names both the winning evidence and the refuted derivation; runtime discipline (per-session `tool_info`, fail-closed drift) stays in force.

### Key Components
- **Fixture** (`references/discovery-fixture-2026-07-16.json`): raw `list_tools`/`search_tools`/`tool_info` payloads plus 8 `discoveredCallableNames`.
- **Naming presentation**: dotted registry `refero.refero.refero_<tool>` for discovery queries; doubled TS callable `refero.refero_refero_<tool>(...)` for calls (fixture `Access as:` line).
- **Pre-auth boundary**: discovery needs no OAuth; calls do - both stated together wherever either appears.

### Data Flow
Probe output (fixture JSON) feeds doc claims; doc claims cite the fixture path; future discovery runs compare against the fixture and reopen claims on drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md (naming trap, discovery paragraph, quick ref, version) | Runtime contract | update | grep shows fixture-cited resolution |
| README.md + INSTALL_GUIDE.md | Consumer-facing naming and preconditions | update | Pre-auth discovery stated; OAuth kept for calls |
| references/mcp-wiring.md + tool-surface.md | Deep naming rule + open questions | update | Conflict closed; Q1 resolved, Q2 partially resolved |
| mcp-servers/refero-mcp/README.md | Discovery expectation mirror | update | Pre-auth confirmed wording |
| manual_testing_playbook/discovery-setup/discovery-first.md | DISCOVER-001 rationale | update | Closed-conflict wording with fixture path |
| scripts/doctor.sh + install.sh | Already state the doubled prefix | unchanged | grep shows no old assumed names; update-only-if-stale rule |
| changelog/v1.0.0.0.md + v1.1.0.0.md | Immutable release history | unchanged | Historical records keep original wording |

Required inventories:
- Same-class producers: `rg -n "refero_refero|doubled|conflict|pending|unconfirmed" .opencode/skills/mcp-tooling/mcp-refero` drove the flip set (7 files).
- Consumers of changed symbols: examples and playbook cross-references re-checked; they already used the winning form.
- Matrix axes: file kind (contract/consumer/reference/mirror/script/history) crossed with claim kind (registry name, TS callable, pre-auth boundary, schema detail).
- Algorithm invariant: not a parser/security fix; the invariant is "no naming claim without a fixture citation; no OAuth gate on discovery".
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Fixture read end to end; 8 registry names and the `Access as:` line extracted [evidence: fixture lines 8-18]
- [x] Stale-claim grep inventory built [evidence: 7 files with conflict or OAuth-gated-discovery wording]

### Phase 2: Core Implementation
- [x] SKILL.md, README, INSTALL_GUIDE flipped [evidence: tasks.md T003-T005]
- [x] References, server README, playbook flipped [evidence: tasks.md T006-T007]
- [x] Version 1.1.1.0 + changelog authored [evidence: tasks.md T008]

### Phase 3: Verification
- [x] `package_skill.py --check --strict` PASS [evidence: "Skill is valid!", warnings only]
- [x] Residual conflict-wording grep clean outside changelogs [evidence: checklist.md CHK-021]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet layout, frontmatter, links | `package_skill.py --check --strict` |
| Content | No residual open-conflict or OAuth-gated-discovery claims | `rg` sweeps pinned in checklist.md |
| Spec docs | This child's five docs | `validate.sh --strict --no-recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `references/discovery-fixture-2026-07-16.json` | Internal (probe output) | Green | No registry evidence; phase impossible |
| `mcp-code-mode/references/naming_convention.md` | Internal | Green | TS-surface convention could be misstated |
| `package_skill.py` | Internal tooling | Green | No structural gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future discovery run contradicts the fixture (names, tool count, or schema drift).
- **Procedure**: `git revert` the packet commits for this phase (docs only); save a fresh dated fixture; re-run the flip sweep against the new baseline.
<!-- /ANCHOR:rollback -->
