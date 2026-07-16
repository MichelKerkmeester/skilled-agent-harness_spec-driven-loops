---
title: "Implementation Plan: Phase 6: live-verification-capture (mcp-mobbin)"
description: "Supersede the mcp-mobbin one-tool baseline with the 2026-07-16 live three-tool inventory, resolve the deep-mode conflict from the fixture schema, and rebuild the flow-research guidance on search_flows."
trigger_phrases:
  - "mobbin discovery flip plan"
  - "mobbin fixture plan"
  - "mobbin live verification plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Plan executed; all phases complete"
    next_safe_action: "Operator handoff for OAuth items"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-mobbin"
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
| **Language/Stack** | Markdown documentation + bash (script hints) |
| **Framework** | sk-doc skill packet conventions (SKILL.md, references, feature catalog, examples, playbook) |
| **Storage** | None (JSON fixture file as static evidence) |
| **Testing** | `package_skill.py --check --strict`, `bash -n`, targeted greps, `validate.sh --strict` |

### Overview
This is the largest of the three transport flips because the fixture does not just confirm a prediction - it contradicts standing doctrine. The work reclassifies the one-tool completeness boundary as a dated historical baseline, installs the live three-tool inventory with fixture schemas, resolves the `deep` conflict, rebuilds flow research on the real `search_flows` tool, and sweeps every mirror (catalog leaves, examples, playbook scenarios, scripts) so no doc still forbids a tool that exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [evidence: spec.md sections 2-3, 25-row files table]
- [x] Success criteria measurable [evidence: spec.md SC-001 to SC-003, each a command with an expected result]
- [x] Dependencies identified [evidence: fixture present, `capturedAt: 2026-07-16T13:49:06.285Z`, 3/3 names in `discoveredCallableNames`]

### Definition of Done
- [x] All acceptance criteria met [evidence: tasks.md T001-T012 all checked with per-task evidence]
- [x] Tests passing [evidence: `package_skill.py --check --strict` printed "Result: PASS"]
- [x] Docs updated (spec/plan/tasks) [evidence: this packet's four docs plus checklist.md authored at Level 2]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first documentation with an explicit supersession record: the historical documented baseline stays visible (dated), the live inventory replaces it as the operating contract, and the boundary rules re-anchor on the fixture instead of the old record.

### Key Components
- **Fixture** (`references/discovery-fixture-2026-07-16.json`): `list_tools`/`search_tools`/`tool_info` payloads, 3 `discoveredCallableNames`, full declared schemas for all three tools.
- **Supersession statement**: "live discovery 2026-07-16 supersedes the one-public-tool baseline" appears wherever the old boundary lived.
- **Mode resolution**: `mode?: "deep" | "standard" | "fast"` on `search_screens`, from the fixture schema.
- **Ordering contract**: `search_flows` returns `screens[].position`; returned ordering is fact, interpolation is labeled inference.

### Data Flow
Probe output (fixture JSON) feeds doc claims; doc claims cite the fixture path; future discovery runs compare against the fixture three-tool baseline and reopen claims on drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md (banner, surface table, workflows, rules, quick ref, version) | Runtime contract | update | grep shows three-tool + resolved-deep wording with fixture citations |
| references/tool-surface.md | The tool contract authority | update | Section 1 rebuilt on fixture schemas; open questions 1/3/4/10 resolved |
| references/mcp-wiring.md + troubleshooting.md | Naming rule + drift taxonomy | update | CONFIRMED table; drift rows diff against the fixture |
| README.md + INSTALL_GUIDE.md + mcp-servers/mobbin-mcp/README.md | Consumer-facing mirrors | update | Three tools + pre-auth discovery stated |
| feature_catalog root + flows/screens/apps/elements leaves | Capability inventory | update | Areas table adds Sections row; flows leaf rebuilt on search_flows |
| examples (README + 3 walkthroughs) | Worked invocations | update | Confirmed names; flow example calls `mobbin.mobbin_search_flows` |
| playbook root + DISCOVER-001 + FLOWS-001 + SCREENS-001 | Grading contracts | update | Fixture-baseline re-confirmation; no grading on retired rules |
| scripts/doctor.sh + install.sh | Hardcoded INFERRED hints (grep-confirmed) | update | `bash -n` passes; hints state the confirmed baseline |
| assets/utcp-mobbin-manual.md | Post-registration checklist | update | Discovery + schema items `[x]` with fixture evidence |
| changelog/v1.0.0.0.md + v1.1.0.0.md | Immutable release history | unchanged | Historical records keep original wording |

Required inventories:
- Same-class producers: `rg -n "INFERRED|single-tool|one documented|deep|search_flows" .opencode/skills/mcp-tooling/mcp-mobbin` drove the flip set (22 files).
- Consumers of changed symbols: catalog count summary and playbook index re-checked after the leaf rebuilds.
- Matrix axes: file kind (contract/reference/mirror/example/playbook/script/asset/history) crossed with claim kind (inventory, naming, deep mode, output shape, pre-auth boundary).
- Algorithm invariant: not a parser/security fix; the invariant is "no doc forbids a live-listed tool, and no doc asserts a field the declared schema lacks".
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Fixture read end to end; 3 registry names, full schemas, and the deep-mode enum extracted [evidence: fixture lines 8-13 and `tool_info_first`]
- [x] Stale-claim grep inventory built [evidence: 22 files carrying INFERRED, one-tool, or open-deep wording]

### Phase 2: Core Implementation
- [x] SKILL.md and tool-surface.md rebuilt on the three-tool contract [evidence: tasks.md T003-T004]
- [x] Consumer mirrors, catalog leaves, examples, and playbook scenarios flipped [evidence: tasks.md T005-T010]
- [x] Scripts updated, version 1.1.1.0 + changelog authored [evidence: tasks.md T011]

### Phase 3: Verification
- [x] `package_skill.py --check --strict` PASS [evidence: "Skill is valid!", warnings only]
- [x] `bash -n` on both scripts, residual sweeps clean [evidence: tasks.md T012]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet layout, frontmatter, links | `package_skill.py --check --strict` |
| Syntax | doctor.sh and install.sh after hint edits | `bash -n` |
| Content | No residual INFERRED/one-tool/open-deep claims | `rg` sweeps pinned in checklist.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `references/discovery-fixture-2026-07-16.json` | Internal (probe output) | Green | No live inventory; phase impossible |
| `mcp-code-mode/references/naming_convention.md` | Internal | Green | TS-surface convention could be misstated |
| `package_skill.py` | Internal tooling | Green | No structural gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future discovery run contradicts the fixture (tool count, names, or schema drift), or the first authenticated call contradicts the declared output schema.
- **Procedure**: `git revert` the packet commits for this phase (docs and script hints only); save a fresh dated fixture; re-run the flip sweep against the new baseline.
<!-- /ANCHOR:rollback -->
