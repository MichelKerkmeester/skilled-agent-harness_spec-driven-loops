---
title: "PI-009 -- Pi-subagents agent parsing and tool surface"
description: "This scenario validates the installed `pi-subagents` project agent mirrors and records the live tool-surface evidence without claiming a new provider-backed turn for `PI-009`."
version: 1.0.0.0
---

# PI-009 -- Pi-subagents agent parsing and tool surface

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-009`.

---

## 1. OVERVIEW

This scenario checks that the 13 generated `.pi/agents/*.md` files are in sync and that the installed community bridge exposes its generic delegation tools without schema errors.

### Why This Matters

Agent mirrors are executable project resources. A filename or count alone is insufficient: the generated frontmatter must satisfy the community package's schema, and the Pi session must load the package without aborting.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the project agent mirror and the `pi-subagents` tool surface.
- Real user request: `Check that the translated project agents are valid for pi-subagents, then list the available delegation tools without modifying files.`
- Prompt: `List your available tools and report whether the pi-subagents delegation tools are present. Do not modify files. If provider credentials are missing, return that exact blocker.`
- Expected execution process: Run the generator drift check -> inspect the 13 project agent files -> run the isolated Pi command -> inspect output for `subagent`, `subagent_wait`, `subagent_supervisor`, and `intercom`, with no schema error.
- Expected signals: Sync check says `13 agents are in sync`; all 13 files exist; the live tool listing contains the four named community tools or the exact provider blocker.
- Desired user-visible outcome: Evidence that agent files parse and the generic bridge is available without assuming each named agent is a top-level tool.
- Pass/fail: PASS for the 13-file sync and any existing captured live tool-list evidence. SKIP a fresh provider-backed re-probe with blocker `provider credentials are absent on this machine`. FAIL on a schema/parse error or missing project files.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the generator check before reading the live tool surface.
2. Count and inspect `.pi/agents/*.md` without writing them.
3. Run Pi with an isolated config directory and `--offline --approve`.
4. Treat the prior captured tool-list evidence and the current re-probe separately.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-009 | Pi-subagents agent parsing and tool surface | Validate project agent mirrors and generic delegation tools | `List your available tools and report whether the pi-subagents delegation tools are present. Do not modify files. If provider credentials are missing, return that exact blocker.` | `node .opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs --check` -> `find .pi/agents -maxdepth 1 -name '*.md' | wc -l` -> `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "list your available tools" </dev/null` | Sync output reports 13; file count is 13; no schema error; tool names appear when the live session reaches tool listing | Captured sync output: `[pi-agent-sync] PASS: 13 agents are in sync.` Prior captured live implementation evidence reports exit `0` with `subagent`, `subagent_wait`, `subagent_supervisor`, and `intercom`. Fresh isolated re-probe output reached `No API key found for the selected model.` with `probe_rc=1` and no agent-schema error. | PASS for current parse/sync and the existing captured live tool-surface evidence. SKIP the fresh provider-backed confirmation with blocker `provider credentials are absent on this machine`. FAIL on any schema or extension-load error. | Inspect the first invalid agent file, rerun the sync checker, and keep community-package behavior distinct from Pi core. |

### Optional Supplemental Checks

- Use the generic `subagent` tool with one harmless named agent only after provider credentials and explicit package trust are available.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Package-trust and provider boundary |
| `../../SKILL.md` | Community-package distinction and install safety |
| `../../references/agent-delegation.md` | Project agent path, schema, and tool-boundary contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/agents/` | 13 generated project agent mirrors |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` | Generator and sync checker |
| `.pi/settings.json` | Installed package list |

---

## 5. SOURCE METADATA

- Group: Agent Bridge
- Playbook ID: PI-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-bridge/pi-subagents-agent-parse.md`
