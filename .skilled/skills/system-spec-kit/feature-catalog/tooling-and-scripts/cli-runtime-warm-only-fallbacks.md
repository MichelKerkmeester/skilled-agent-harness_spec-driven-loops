---
title: "CLI hook fallbacks and plugin bridges"
description: "Runtime integrations for the 028 CLI program: the Claude prompt hook gates casual prompts first, the CLI it calls owns daemon startup with a bounded cold start and a degraded local answer and the hook fails open without blocking the prompt, and the OpenCode plugins route over CLI/IPC with zero in-process DB imports."
trigger_phrases:
  - "warm-only hook fallback"
  - "cli fallback hooks"
  - "transport-down fail-open"
  - "opencode plugin cli bridge"
version: 3.6.0.1
---

# CLI hook fallbacks and plugin bridges

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A CLI nobody's runtime calls does not close the transport-down incident class, so every 028 CLI workstream shipped paired runtime integrations. Prompt-time hooks for Claude Code and OpenCode gained a shared CLI fallback helper per system: the hook runs the casual-prompt gate first and passes the rest to a CLI that owns daemon startup. On a cold socket the CLI starts the launcher and waits for the daemon within a bounded cold-start window of at most 5 seconds, then falls back to the local Python scorer with a degraded answer when the daemon does not respond in that window. The hook fails open rather than blocking the prompt when its own budget ends first or the CLI fails.

OpenCode gained a plugin route with a CLI fallback in `system-skill-advisor` that leaves the primary bridge path untouched. The bridge uses CLI/IPC transport only — zero in-process database imports, so the dual-writer hazard that forced the earlier revert cannot return.

The `spec-memory` and `code-index` halves of this integration were removed with their servers. `system-skill-advisor` is the only system still behind this contract, and it is the one that powers Gate 2.

---

## 2. HOW IT WORKS

### CLI fallback helpers per system

`skill-advisor-cli-fallback.ts` (system-skill-advisor hooks) runs the CLI with `--no-warm-only --timeout-ms` (warm calls measured 117-198 ms) because the CLI is the only component that starts the daemon. On a cold socket the CLI starts the launcher and waits for the daemon within a bounded cold-start window of at most 5 seconds. If the daemon does not answer in that window `advisor_recommend` answers from the local Python scorer, marked degraded, and the hook shows `Advisor: stale`.

### Hook wiring

The Claude `user-prompt-submit.ts` advisor hook uses the skill-advisor helper and runs the casual-prompt gate first. `/help`, short acknowledgements such as `hello` and prompts below the length threshold return `skipped` with the status line `Advisor: prompt skipped.` and never reach the CLI. If the hook's own budget ends first or the CLI fails the hook fails open: it exits 0 and emits `Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` above the directives block. It never blocks the prompt. The one-shot native bridge (measured 824.8 ms) stays banned from the prompt path.

### Allowlists and guidance

`.opencode/settings.json` allowlists the CLI invocations for OpenCode (the Claude allowlist lives in local-only settings by decision), and `AGENTS.md` carries the transport-down fallback and maintenance-tool policy guidance.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Hook helper | Shared skill-advisor CLI fallback |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Hook adapter | Claude advisor hook with CLI fallback |
| `.skilled/plugins/system-skill-advisor.js` | OpenCode plugin | Advisor plugin with CLI fallback routing |
| `.opencode/settings.json` | Runtime config | OpenCode allowlist for CLI use |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-dual-client.vitest.ts` | Automated test | Dual-client MCP + CLI coverage for the advisor daemon |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/cli-runtime-warm-only-fallbacks.md`
