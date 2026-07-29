---
title: "Daemon-backed code-index CLI surface"
trigger_phrases:
  - "daemon-backed code-index CLI surface"
  - "code-index cli"
version: 3.6.0.1
---

# Daemon-backed code-index CLI surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW


The CLI gives hooks, doctor probes, and transport-down recovery a read path when the daemon is already warm. Prompt-time callers use warm-only probing so they do not cold-spawn the daemon.

---

## 2. HOW IT WORKS

The stable shim performs socket and dist-freshness guardrails, then delegates to the TypeScript CLI entrypoint. The manifest defines the allowed code-index command surface, and calls are sent over IPC to the daemon rather than importing code graph internals in-process.

Runtime integrations call read paths with `--warm-only --timeout-ms`. Maintenance operations remain blocked from prompt-time hook fallback, preserving the code graph readiness contract and avoiding surprise scans or destructive applies.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/mk-code-graph.js` | Plugin bridge | OpenCode bridge using CLI/IPC instead of in-process imports |

### Validation And Tests

| File | Type | Role |
|---|---|---|

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/code-index-cli-daemon-backed-surface.md`

Related references:
- [spec-memory-cli-daemon-backed-surface.md](../../feature-catalog/tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md) - Spec-memory CLI sibling surface
- [skill-advisor-cli-daemon-backed-surface.md](../../feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md) - Skill-advisor CLI sibling surface
