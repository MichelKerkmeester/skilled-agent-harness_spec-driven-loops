---
title: "System Skill Advisor"
description: "Operator-facing entry point for the standalone Skill Advisor MCP package envelope and extraction references."
trigger_phrases:
  - "system skill advisor readme"
  - "skill advisor package"
  - "advisor install guide"
  - "advisor database path"
---

# System Skill Advisor

The System Skill Advisor routes non-trivial requests to the right skill. This package is the new first-class home for the advisor envelope created by child 002 of the 015/009 extraction.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT STATE](#2--current-state)
- [3. STRUCTURE](#3--structure)
- [4. DATABASE LOCATION](#4--database-location)
- [5. INSTALLATION](#5--installation)
- [6. RELATED DOCUMENTS](#6--related-documents)

---

## 1. OVERVIEW

ADR-001 selects **Standalone Advisor MCP With Legacy Tool Bridge**. The final server id is `system_skill_advisor`; the public tool ids stay `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`.

Use this README when you need operator orientation for the advisor package, database ownership, migration phase boundaries, or where to find the scaffolded catalog, playbook, and references.

---

## 2. CURRENT STATE

This is an envelope-only scaffold.

| Area | State |
|---|---|
| Package docs | Present |
| `graph-metadata.json` | Present |
| Feature catalog | Initial scaffold only |
| Manual testing playbook | Initial scaffold only |
| `mcp_server/` source | Reserved for child 003 |
| Runtime launcher | Future child 004 work |
| Four-runtime MCP config | Future child 004 work |
| Consumer cutover | Future child 005 work |

Runtime code still lives under `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` until child 003 moves it.

---

## 3. STRUCTURE

```text
system-skill-advisor/
+-- SKILL.md
+-- README.md
+-- ARCHITECTURE.md
+-- INSTALL_GUIDE.md
+-- graph-metadata.json
+-- feature_catalog/
+-- manual_testing_playbook/
+-- references/
`-- mcp_server/
    +-- README.md
    `-- database/
        `-- .gitkeep
```

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime skill instructions and advisor routing policy. |
| `graph-metadata.json` | Skill graph metadata for discovery and routing. |
| `feature_catalog/` | Initial feature inventory. Full population lands in child 003. |
| `manual_testing_playbook/` | Initial manual scenario package. Full population lands in child 003. |
| `references/` | Package-local policies and ADR summaries. |
| `mcp_server/` | Child 003 drop target for source, tests, and database ownership. |

---

## 4. DATABASE LOCATION

The future advisor database lives at:

```text
.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
```

This is the package-local database path required by ADR-001 constraint A. See `references/db-path-policy.md` for the rule and rationale.

---

## 5. INSTALLATION

The real standalone MCP install flow lands in child 004. It will add `.opencode/bin/skill-advisor-launcher.cjs` and wire `system_skill_advisor` into OpenCode, Codex, Claude, and Gemini runtime configs.

Current operator guidance lives in `INSTALL_GUIDE.md`. Treat it as a stub until child 004 ships.

---

## 6. RELATED DOCUMENTS

- `ARCHITECTURE.md`
- `INSTALL_GUIDE.md`
- `references/db-path-policy.md`
- `references/standalone-mcp-shape.md`
- `references/legacy-tool-bridge.md`
- ADR-001: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md`
