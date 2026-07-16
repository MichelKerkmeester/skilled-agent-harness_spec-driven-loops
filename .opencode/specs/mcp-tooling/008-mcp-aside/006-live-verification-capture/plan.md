---
title: "Implementation Plan: Phase 6: live-verification-capture (mcp-aside-devtools)"
description: "Flip the mcp-aside-devtools packet from discovery-pending doctrine to the 2026-07-16 fixture facts: dual callable naming, re-confirmed one-tool inventory, fixture helper surface, version 1.1.1.0."
trigger_phrases:
  - "aside discovery flip plan"
  - "aside fixture plan"
  - "aside live verification plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Plan executed; all phases complete"
    next_safe_action: "Operator handoff for live-call items"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery_fixture_2026-07-16.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-aside"
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
| **Language/Stack** | Markdown documentation + bash (doctor.sh hint) |
| **Framework** | sk-doc skill packet conventions (SKILL.md, references, feature catalog, playbook) |
| **Storage** | None (JSON fixture file as static evidence) |
| **Testing** | `package_skill.py --check --strict`, `bash -n`, targeted greps, `validate.sh --strict` |

### Overview
The 2026-07-16 discovery fixture is the ground truth; the work is a doc-truth sweep. Grep the packet for every claim that names the callable or calls discovery pending, flip each to the dual observed facts (dotted registry name vs underscore TS callable) with the fixture cited, refresh the helper-surface description from the fixture, and close with the packet gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [evidence: spec.md sections 2-3]
- [x] Success criteria measurable [evidence: spec.md SC-001 to SC-003, each a command with an expected result]
- [x] Dependencies identified [evidence: fixture present at `references/discovery_fixture_2026-07-16.json`, capturedAt `2026-07-16T13:49:06.278Z`]

### Definition of Done
- [x] All acceptance criteria met [evidence: tasks.md T001-T010 all checked with per-task evidence]
- [x] Tests passing [evidence: `package_skill.py --check --strict` printed "Result: PASS"]
- [x] Docs updated (spec/plan/tasks) [evidence: this packet's four docs plus checklist.md authored at Level 2]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first documentation: one dated fixture file is the single source of truth; every prose claim cites it; runtime discipline (per-session rediscovery, fail-closed drift) stays in force so the fixture never becomes a hardcoded contract.

### Key Components
- **Fixture** (`references/discovery_fixture_2026-07-16.json`): raw `list_tools`/`search_tools`/`tool_info` payloads plus `discoveredCallableNames`.
- **Naming presentation**: every flip states BOTH forms - registry `aside.aside.repl` (what discovery returns verbatim) and TS callable `aside.aside_repl(args)` (the fixture `Access as:` line, matching `mcp-code-mode/references/naming_convention.md`).
- **Drift protocol**: ASD-011 and doctor.sh now diff future discovery output against the fixture baseline.

### Data Flow
Probe output (fixture JSON) feeds doc claims; doc claims cite back to the fixture path; future discovery runs compare against the fixture and reopen claims on drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md (MCP approach, NEVER rules, version) | Runtime contract naming the callable | update | grep shows dual-form presentation with fixture citation |
| README.md + INSTALL_GUIDE.md | Consumer-facing quick start and install steps | update | Step 4 / step 3 quote both forms |
| references/mcp_wiring.md + aside_cli_reference.md | Deep wiring + helper-surface truth | update | Fixture helper list present; "UNKNOWN until confirmed" bullet replaced |
| assets/utcp_aside_manual.md | Post-registration checklist | update | Discovery items `[x]` with `[evidence: fixture]` |
| feature_catalog (root + mcp leaf), playbook (root + ASD-011), mcp-servers/aside-mcp/README.md | Mirrors of the naming claim | update | All mirrors quote the confirmed forms |
| scripts/doctor.sh | Hardcoded old expected name (line 111 only, per grep) | update | `bash -n` passes; hint states both forms |
| changelog/v1.0.0.0.md + v1.1.0.0.md | Immutable release history | unchanged | Historical records keep their original wording |

Required inventories:
- Same-class producers: `rg -n "aside_repl|unconfirmed|discovery.*pending" .opencode/skills/mcp-tooling/mcp-aside-devtools` drove the flip set (12 files).
- Consumers of changed symbols: playbook and catalog cross-references re-checked after the flips.
- Matrix axes: file kind (contract/consumer/mirror/script/history) crossed with claim kind (registry name, TS callable, inventory, helper surface).
- Algorithm invariant: not a parser/security fix; the invariant is "no doc asserts a callable without citing the fixture".
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence intake
- [x] Fixture read end to end; `discoveredCallableNames`, `tool_info_first`, and the `Access as:` line extracted [evidence: fixture lines 8-11]
- [x] `mcp-code-mode/references/naming_convention.md` read to present the TS-surface convention precisely [evidence: naming doc section 1 core pattern]

### Phase 2: Doc flips
- [x] 12 packet files flipped to the dual-form presentation with fixture citations [evidence: tasks.md T002-T008]
- [x] Helper surface refreshed from the fixture in both references [evidence: mcp_wiring.md section 2; aside_cli_reference.md section 3]

### Phase 3: Verification
- [x] `package_skill.py --check --strict` PASS [evidence: "Skill is valid!", warnings only]
- [x] `bash -n scripts/doctor.sh` exit 0 [evidence: T009]
- [x] Residual stale-claim grep clean outside changelogs [evidence: T010]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet layout, frontmatter, links | `package_skill.py --check --strict` |
| Syntax | doctor.sh after the hint edit | `bash -n` |
| Content | No residual discovery-pending claims | `rg` sweeps pinned in checklist.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `references/discovery_fixture_2026-07-16.json` | Internal (probe output) | Green | No ground truth; phase impossible |
| `mcp-code-mode/references/naming_convention.md` | Internal | Green | TS-surface convention could be misstated |
| `package_skill.py` | Internal tooling | Green | No structural gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future discovery run contradicts the fixture (names, inventory, or schema drift).
- **Procedure**: `git revert` the packet commits for this phase (docs only, no runtime coupling); save a fresh dated fixture; re-run the flip sweep against the new baseline.
<!-- /ANCHOR:rollback -->
