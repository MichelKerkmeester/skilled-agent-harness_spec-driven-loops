---
title: "Feature Specification: Presentation Asset Format — .md to .txt [template:examples/level_1/spec.md]"
description: "Rename the 24 command presentation assets from .md to .txt so the command loader stops registering them as slash commands, and update every router and generator reference."
trigger_phrases:
  - "presentation asset format"
  - "presentation md slash command pollution"
  - "command assets txt rename"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/007-presentation-asset-format"
    last_updated_at: "2026-06-12T13:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Renamed 24 presentation assets .md to .txt and updated all references"
    next_safe_action: "Validate the packet and scoped-commit"
---
# Feature Specification: Presentation Asset Format — .md to .txt

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-12 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The presentation/router split placed each command's display contract in `.opencode/commands/<family>/assets/<name>_presentation.md`. The command loader discovers every `.md` under `.opencode/commands/` recursively (and `.claude/commands` symlinks to the same tree), so all 24 presentation assets registered as bogus slash commands, polluting the namespace.

### Purpose
Stop the presentation assets from being discovered as commands while keeping them co-located with their command and readable by the router. The in-repo precedent is decisive: workflow assets use `.yaml` and never registered; only the `.md` presentation files did. Renaming to a non-`.md` extension is the minimal, convention-aligned fix.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename all 24 `*_presentation.md` assets to `*_presentation.txt` (content unchanged).
- Update every functional reference in the command routers and the three asset self-references.
- Update the sk-doc generator templates so future scaffolding emits `.txt`.

### Out of Scope
- Changing any display content or routing semantics (behavior-preserving).
- Rewriting historical changelog/spec mentions of the old `.md` paths (left as record).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/*/assets/*_presentation.md` (24) | Rename | To `*_presentation.txt` |
| `.opencode/commands/*/*.md` (routers) | Update | Reference the `.txt` assets |
| `.opencode/skills/sk-doc/assets/command_template.md` | Update | Emit `.txt` presentation references |
| `.opencode/skills/sk-doc/assets/command_presentation_template.md` | Update | Document the `.txt` asset name |
| `.opencode/skills/sk-doc/assets/template_rules.json` | Update | Presentation extension rule |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No presentation `.md` remains under any command assets dir | `find .opencode/commands -path "*/assets/*_presentation.md"` returns nothing |
| REQ-002 | No router references a `.md` presentation asset | `grep -r "_presentation.md" .opencode/commands` returns nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Generators emit `.txt` for new commands | sk-doc command templates reference `_presentation.txt` |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Presentation assets no longer appear in the slash-command list.
- **SC-002**: Each command router resolves and reads its `.txt` presentation contract unchanged.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stale `.md` reference breaks a router's display load | Router can't find its contract | Zero-residual grep gate before commit |
| Risk | New commands re-introduce `.md` assets | Pollution returns | sk-doc generator templates updated to `.txt` |
| Dependency | Command loader keys on `.md` extension | The whole fix relies on non-`.md` being skipped | Proven by existing `.yaml` workflow assets that never registered |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
