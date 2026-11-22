---
title: "Capability gaps and handoffs"
description: "Bladebro has no HAR export, heap snapshot, performance trace, Lighthouse audit, raw CDP passthrough or cross-origin iframe content, so those requests go to the sibling modes."
trigger_phrases:
  - "capability gaps and handoffs"
  - "bladebro har"
  - "bladebro lighthouse"
  - "bladebro limits"
version: 1.0.0.0
---

# Capability gaps and handoffs

## 1. OVERVIEW

Bladebro has no HAR export, heap snapshot, performance trace, Lighthouse audit, raw CDP passthrough or cross-origin iframe content, so those requests go to the sibling modes.

The packet never claims these from Bladebro. When a task meets one, the agent routes it to the covering mode of the `mcp-browser-use` hub instead of improvising a substitute.

---

## 2. HOW IT WORKS

### Handoff Table

| Gap in Bladebro | Covering mode |
|---|---|
| HAR export | `mcp-chrome-devtools`, through `bdg network har` |
| Heap snapshot or performance trace | `mcp-chrome-devtools` |
| Lighthouse audit | `mcp-chrome-devtools`, MCP `lighthouse_audit` only |
| Raw CDP passthrough | `mcp-chrome-devtools` |
| Cross-origin iframe content | `mcp-chrome-devtools` CDP frame methods, or `mcp-aside-devtools` Playwright frames |
| Deterministic signed-in proof, REPL replay or evidence capture | `mcp-aside-devtools` |

### Edge Cases

Extensions and session video recording are outside the upstream tool surface. Interactive challenges can end a task with a `blocked:` verdict, which is a stop rather than a gap to route around. Switching transport never closes a gap, because the CLI and MCP share the same handlers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | The limits table and the never-claim rule |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/README.md` | Shared | The hand-off summary for the mode |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Reference | Rule set that forbids claiming these capabilities |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md` | Reference | The covering mode's capability inventory |

---

## 4. SOURCE METADATA

- Group: Limits and Safety
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `limits-and-safety/capability-gaps-and-handoffs.md`

Related references:
- [consent-gates-and-blocked-verdicts.md](consent-gates-and-blocked-verdicts.md) - The stop rules that sit beside these gaps
