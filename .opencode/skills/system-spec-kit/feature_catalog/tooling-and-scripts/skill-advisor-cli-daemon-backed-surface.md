---
title: "Daemon-backed skill-advisor CLI surface"
description: "Dual-stack CLI front door over the mk-skill-advisor daemon, with manifest-backed commands, warm-only fallback, and trusted mutation gating."
trigger_phrases:
  - "daemon-backed skill-advisor CLI surface"
  - "skill-advisor cli"
  - "advisor_recommend warm-only cli"
  - "trusted mutation gate"
version: 3.6.0.1
---

# Daemon-backed skill-advisor CLI surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The skill-advisor daemon ships a CLI front door at `node .opencode/bin/skill-advisor.cjs` over the same daemon/IPC transport used by MCP.

The CLI supports Gate 2 recovery and diagnostics when the daemon is warm, while trusted mutations remain gated so prompt-time fallback cannot rebuild or mutate skill graph state by accident.

---

## 2. HOW IT WORKS

The shim performs socket and dist guardrails, then delegates to the TypeScript CLI entrypoint. The manifest describes advisor and skill-graph commands, including read paths such as `advisor_recommend` and maintenance paths that require trusted execution.

Hook and plugin integrations use `--warm-only` so no prompt-time cold spawn occurs. Unavailable daemon reads fail open, while mutation commands fail closed unless explicitly run through a trusted maintenance path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/skill-advisor.cjs` | Script | Stable executable shim for the skill-advisor CLI |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | CLI entrypoint | IPC command execution, output rendering, and warm-only behavior |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts` | CLI manifest | Command definitions and trusted-mutation classification |
| `.opencode/plugins/mk-skill-advisor.js` | Plugin bridge | OpenCode bridge using warm CLI fallback |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | Automated test | CLI/MCP parity coverage |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-job-semantics.vitest.ts` | Automated test | Job and trusted mutation semantics |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-dual-client.vitest.ts` | Automated test | MCP and CLI concurrent client coverage |
| `.opencode/skills/system-skill-advisor/feature_catalog/mcp-surface/skill-advisor-cli.md` | Catalog | Owning system-skill-advisor feature entry |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md`

Related references:
- [spec-memory-cli-daemon-backed-surface.md](spec-memory-cli-daemon-backed-surface.md) - Spec-memory CLI sibling surface
- [code-index-cli-daemon-backed-surface.md](code-index-cli-daemon-backed-surface.md) - Code-index CLI sibling surface
