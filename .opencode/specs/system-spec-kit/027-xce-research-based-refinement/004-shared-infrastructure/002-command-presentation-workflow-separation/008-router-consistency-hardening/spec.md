---
title: "Feature Specification: Router Consistency Hardening [template:examples/level_1/spec.md]"
description: "Qualify the bare/mixed MCP tool names left in 7 command routers' allowed-tools, and correct the sk-doc command_template §11 router standard so it accurately describes the two router variants."
trigger_phrases:
  - "router consistency hardening"
  - "qualify allowed-tools mcp names"
  - "command template router standard accuracy"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/008-router-consistency-hardening"
    last_updated_at: "2026-06-12T14:15:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Committed 0c6c2bf897; render re-test 4/4 PASS under --command"
    next_safe_action: "None; phase complete"
---
# Feature Specification: Router Consistency Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-12 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A deeper audit of the command tree after the presentation/router split found two consistency defects. First, commit `493b3c822f` (#44) decided the canonical `allowed-tools` form is the fully-qualified `mcp__<server>__<tool>` prefix and applied it to `resume.md` + `search.md`, but seven routers still carry the same bare or mixed MCP names it fixed. Second, the sk-doc `command_template.md` §11 router standard claims all five split families use an identical six-section shape and own `_auto.yaml`/`_confirm.yaml`, which is false: `memory` and `doctor` have no workflow YAML and use different section vocabularies.

### Purpose
Finish the #44 normalization across every router and make the command standard accurately describe the two router variants, so the documented standard matches shipped reality and future commands inherit the correct convention.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Qualify the bare/mixed MCP names in 7 routers' `allowed-tools` frontmatter (4 deep + 3 speckit) to the `mcp__<server>__<tool>` form, matching the `opencode.json` namespace and the #44 decision.
- Correct `command_template.md` §11 to distinguish workflow-backed families (speckit, create, deep) from direct-router families (memory, doctor), and document the `mcp__` `allowed-tools` rule.

### Out of Scope
- Changing any router body prose, routing semantics, or tool behavior (frontmatter-only; behavior-preserving). Bare tool IDs in instruction prose are intentional and stay.
- Re-numbering or re-titling existing routers' section headers to a single convention (cosmetic, much larger; the families' adapted shapes are now documented as acceptable).
- Splitting `agent_router.md` / `prompt.md` (never in the 011 scope).
- The deep Lane-command frontmatter nit (`skill:` vs `allowed-tools` on the two `deep-improvement` commands) — deferred.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/ask-ai-council.md` | Modify | Qualify 4 bare MCP names in `allowed-tools` |
| `.opencode/commands/deep/start-context-loop.md` | Modify | Qualify 4 bare MCP names |
| `.opencode/commands/deep/start-research-loop.md` | Modify | Qualify 4 bare MCP names |
| `.opencode/commands/deep/start-review-loop.md` | Modify | Qualify 4 bare MCP names |
| `.opencode/commands/speckit/complete.md` | Modify | Qualify bare `memory_context` |
| `.opencode/commands/speckit/implement.md` | Modify | Qualify bare `memory_context`, `memory_search` |
| `.opencode/commands/speckit/plan.md` | Modify | Qualify bare `memory_context`, `memory_search` |
| `.opencode/skills/sk-doc/assets/command_template.md` | Modify | §11 accuracy: two variants + `mcp__` rule |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No router `allowed-tools` carries a bare (unqualified) MCP tool name | A scan of every router's `allowed-tools` line finds zero `memory_*`/`code_graph_*`/`checkpoint_*`/`task_*` token not prefixed with `mcp__` |
| REQ-002 | The change is frontmatter-only and behavior-preserving | Router body prose (bare tool IDs in instructions) is unchanged; only the `allowed-tools` line differs per router |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The command standard matches reality | `command_template.md` §11 states only workflow-backed families own `_auto`/`_confirm` YAML, names the memory/doctor direct-router exception, and documents the `mcp__<server>__<tool>` `allowed-tools` rule |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The bare-name scan across all 26 routers is clean; reference integrity stays 24/24 with zero orphans.
- **SC-002**: `validate.sh --strict` on this phase folder passes (0 errors / 0 warnings).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode accepts the `mcp__<server>__<tool>` form | If it rejected it, qualifying would break tool authorization | Verified: `opencode.json` documents the `mcp__<server>__*` namespace; shipped qualified routers (save/search/resume/manage/learn/doctor) prove it works |
| Risk | A qualification typo breaks a server/tool name | Tool silently unavailable | Map is fixed (`mcp__mk_spec_memory__*`, `mcp__mk_code_index__*`); post-edit bare-name scan + per-name diff |
| Risk | Touching body prose changes behavior | Routing regression | Frontmatter-only edits; prose bare IDs left intact by design |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The functional-vs-cosmetic uncertainty on bare names was resolved by the `opencode.json` namespace evidence and the already-shipped qualified routers; qualifying is the safe, decided direction.

<!-- /ANCHOR:questions -->
