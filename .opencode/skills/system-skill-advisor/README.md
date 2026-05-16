---
title: "Skill Advisor Package"
description: "Native skill routing package for advisor MCP tools, hooks, scoring, validation and Python compatibility."
trigger_phrases:
  - "skill advisor"
  - "advisor_recommend"
  - "gate 2 routing"
  - "skill advisor hook"
---

# Skill Advisor Package

<!-- sk-doc-template: skill_readme -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`system-skill-advisor/` owns native Gate 2 skill routing for Spec Kit. It contains the standalone `mk_skill_advisor` MCP server, scorer, daemon freshness checks, skill graph tools, validation bundle and Python compatibility scripts.

Current state:

- Native MCP tools are the primary runtime surface: four `advisor_*` tools plus five `skill_graph_*` tools (8 public + 1 internal trusted-caller — see [Tool IDs Reference](./references/tool-ids-reference.md) for the public/internal split).
- Python scripts remain a compatibility path for callers that cannot use MCP tools directly.
- Public responses stay prompt-safe and expose skill labels, scores, thresholds and trust metadata.
- Command-backed skills use explicit alias groups where command ids and skill ids are legitimate names for the same capability.
- `lib/skill-graph/` database/query logic is package-local to `system-skill-advisor`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────────╮
│ Skill Advisor                                                  │
╰────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│ MCP callers  │ ───▶ │ handlers/    │ ───▶ │ lib/scorer/      │
│ Hook callers │      │ tools/       │      │ lib/freshness/   │
└──────┬───────┘      └──────┬───────┘      └────────┬─────────┘
       │                     │                       │
       ▼                     ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│ compat/      │      │ schemas/     │      │ daemon + graph   │
│ scripts/     │      │ docs/tests   │      │ metadata         │
└──────────────┘      └──────────────┘      └──────────────────┘

Dependency direction:
handlers → lib → schemas
compat → handlers and lib
scripts call the native package first, then Python fallback when needed
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
system-skill-advisor/
├── README.md
├── INSTALL_GUIDE.md          # Install + Setup (merged 2026-05-15)
├── feature_catalog/          # Current feature inventory
├── manual_testing_playbook/  # Manual scenario package
├── references/               # Package policies and migration references
└── mcp_server/
    ├── bench/                # Latency and scorer measurement helpers
    ├── compat/               # Stable package entrypoints for external callers
    ├── handlers/             # MCP handler implementations
    ├── lib/                  # Scorer, freshness, lifecycle and rendering logic
    ├── schemas/              # Tool and metadata contracts
    ├── scripts/              # Python shim, regression and bench scripts
    ├── tests/                # Vitest and compatibility coverage
    └── tools/                # MCP tool descriptors
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Role |
|---|---|
| `handlers/advisor-recommend.ts` | Scores prompts and returns prompt-safe recommendations. |
| `handlers/advisor-status.ts` | Reports freshness, trust state and generation metadata. |
| `handlers/advisor-rebuild.ts` | Rebuilds the advisor index from source metadata. |
| `handlers/advisor-validate.ts` | Runs corpus, holdout, parity, safety and latency checks. |
| `compat/index.ts` | Stable native compatibility entrypoint. |
| `scripts/skill_advisor.py` | Python shim for runtimes that need CLI output. |
| `lib/scorer/` | Five-lane scoring, ambiguity handling and narrow alias canonicalization. |
| `lib/freshness/` | Freshness, trust and cache state logic. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 5. BOUNDARIES AND FLOW

Boundaries:

- This package owns advisor routing only.
- It may read skill metadata, graph metadata and advisor cache state.
- It must not own code graph indexing or memory retrieval behavior.
- Runtime plugins should import `dist/system-skill-advisor/mcp_server/compat/index.js`, not private compiled handler files.
- Alias handling is internal to scoring and validation; it maps only fixed command/skill id groups and does not rewrite public recommendation ids.

Control flow:

```text
╭────────────────────╮
│ prompt or command  │
╰─────────┬──────────╯
          ▼
┌────────────────────┐
│ MCP tool or shim   │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ schema validation  │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ scorer + freshness │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ prompt-safe brief  │
└────────────────────┘
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `advisor_recommend` | Runtime skill recommendation. |
| `advisor_status` | Freshness and trust inspection. |
| `advisor_rebuild` | Index rebuild after skill metadata changes. |
| `advisor_validate` | Release and regression validation. |
| `skill_graph_scan` | Skill graph metadata indexing. |
| `skill_graph_query` | Skill relationship and subgraph queries. |
| `skill_graph_status` | Skill graph health and count reporting. |
| `skill_graph_validate` | Skill graph integrity validation. |
| `skill_graph_propagate_enhances` | Cross-skill auto-propagation: detect missing inbound `enhances` edges; report/propose/apply modes with composite scoring. |
| `scripts/skill_advisor.py` | CLI compatibility and hook fallback. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
(cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run --reporter=default)
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

| Document | Role |
|---|---|
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Setup, rollback and operator checks. |
| [Feature catalog](./feature_catalog/feature_catalog.md) | Current feature inventory. |
| [Manual testing playbook](./manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenarios. |
| [Hook reference](../../references/hooks/skill-advisor-hook.md) | Runtime hook contract. |

<!-- /ANCHOR:related -->
