---
title: "Implementation Plan: Router Consistency Hardening [template:examples/level_1/plan.md]"
description: "Plan to qualify bare MCP tool names across 7 routers and correct the sk-doc command_template router standard."
trigger_phrases:
  - "router consistency hardening plan"
  - "qualify allowed-tools plan"
  - "command template accuracy plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/008-router-consistency-hardening"
    last_updated_at: "2026-06-12T14:15:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Committed 0c6c2bf897; render re-test 4/4 PASS under --command"
    next_safe_action: "None; phase complete"
---
# Implementation Plan: Router Consistency Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command routers + sk-doc command-standard template |
| **Framework** | OpenCode/Claude slash-command loader; `mcp__<server>__<tool>` MCP namespace |
| **Storage** | `.opencode/commands/<family>/`; `.opencode/skills/sk-doc/assets/` |
| **Testing** | Bare-name scan, reference-integrity audit, `validate.sh --strict` |

### Overview
Two surgical doc-consistency fixes. Finding A: qualify the bare/mixed MCP names in 7 routers' `allowed-tools` to the form #44 already chose. Finding B: correct `command_template.md` §11 so it stops claiming all five families share one shape and one YAML asset set. Behavior-preserving — frontmatter and documentation only.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Canonical tool-naming direction confirmed from #44 commit `493b3c822f` and `opencode.json` namespace.
- [x] Exact 7-router bare-name inventory captured; body-prose bare IDs identified as intentional.

### Definition of Done
- [x] Zero bare MCP names in any router `allowed-tools`.
- [x] `command_template.md` §11 accurately describes the two router variants + the `mcp__` rule.
- [x] `validate.sh --strict` passes on this folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Align every router's MCP `allowed-tools` entries to the documented `mcp__<server>__<tool>` namespace, and document the convention (plus the workflow-backed vs direct-router distinction) in the sk-doc command standard so it is self-reinforcing.

### Key Components
- **Router frontmatter `allowed-tools`**: the authorization surface; qualified names only.
- **Router body prose**: bare tool IDs as human-readable call syntax — left untouched.
- **`command_template.md` §11**: the canonical standard new commands follow.

### Data Flow
The loader registers routers and grants the qualified MCP tools named in `allowed-tools`; body prose instructs the agent using the stable bare tool IDs. The two layers are independent, so qualifying frontmatter does not touch behavior.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the canonical form (`mcp__<server>__<tool>`) and the bare→qualified map.
- [x] Inventory the 7 affected routers and their exact `allowed-tools` lines.

### Phase 2: Core Implementation
- [x] Qualify `allowed-tools` in 4 deep routers + 3 speckit routers (frontmatter-only).
- [x] Rewrite `command_template.md` §11 for the two variants + the `mcp__` rule.

### Phase 3: Verification
- [x] Bare-name scan clean across all routers; reference integrity 24/24.
- [x] `validate.sh --strict` on this folder.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | No bare MCP names in any router `allowed-tools` | per-router `allowed-tools` token scan |
| Static | Router→asset reference integrity unchanged | referenced vs on-disk `_presentation.txt` diff (24/24) |
| Static | Body prose unchanged | per-file diff limited to the `allowed-tools` line |
| Validation | Spec folder shape | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode.json` accepts `mcp__<server>__<tool>` | Internal | Green | If bare were required instead, the fix would invert |
| #44 precedent (`493b3c822f`) | Internal | Green | Establishes the chosen direction |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A qualified tool name fails to resolve under either runtime, or a router loses tool access.
- **Procedure**: Revert the single scoped commit; the changes are confined to 8 files' frontmatter/§11 text with no behavioral coupling.

<!-- /ANCHOR:rollback -->
