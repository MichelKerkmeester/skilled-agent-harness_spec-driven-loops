---
title: "HERMES-023 -- Persona via the agent skill mirror and the plugin binding"
description: "Confirm a Hermes session adopts a shared agent persona when the mirrored `agent-<name>` skill is preloaded and `HERMES_AGENT_PERSONA` names it for the repo plugin, for `HERMES-023`."
version: 1.0.0.0
---

# HERMES-023 -- Persona via the agent skill mirror and the plugin binding

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-023`.

---

## 1. OVERVIEW

Hermes has no flag that loads an agent file and caps a plugin prompt section at 4000 characters, so a persona reaches a session in two parts: `sync-skills-hermes.cjs` mirrors every `.hermes/agents/<name>.md` as the preloadable skill `agent-<name>`, and the `repo-guards` plugin's persona section binds the name given in `HERMES_AGENT_PERSONA` to that preloaded skill.

This scenario starts a session with both parts and asks it to name the persona and quote its first heading.

### Why This Matters

If the binding or the mirror breaks, a dispatch that asked for the code, review or markdown agent runs as a generic assistant and drops that agent's tool scope, gates and output contract. The proof is the session naming the persona and quoting text only the agent file contains.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a Hermes session adopts a shared agent persona when the mirrored `agent-<name>` skill is preloaded and `HERMES_AGENT_PERSONA` names it for the repo plugin.
- Real user request: `Run this on Hermes as our markdown agent and prove it actually took the persona.`
- Prompt: `Your system prompt names a persona to adopt and its full text is a preloaded skill. On one line write PERSONA=<name>, then quote the persona's first H1 heading verbatim. If no persona section exists reply NO_PERSONA.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout begins `PERSONA=markdown` and quotes `# The Markdown Agent: Template-First Markdown Documentation Executor`; stderr carries a `session_id:` line; the agent log shows the three plugin sections each under 4000 characters.
- Evidence: The complete stdout, the exit code, the elapsed seconds, the stderr session id, and the `Session plugin prompt section` lines from `~/.hermes/logs/agent.log`.
- Desired user-visible outcome: a concise verdict naming the persona the session adopted and the evidence behind it.
- Pass/fail: PASS when stdout names the persona and quotes the heading; FAIL when the session answers `NO_PERSONA`, quotes a different heading, or the log shows a section skipped for exceeding its cap; SKIP only when a named environment blocker prevents the dispatch (record it verbatim).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the command sequence below exactly as written, from the repository root. `--ignore-rules` travels with `-s`, because the preload survives the flag.
4. Capture stdout, stderr, exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check

HERMES_AGENT_PERSONA=markdown HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 1 --run-budget 90 -s agent-markdown \
  -q "Your system prompt names a persona to adopt and its full text is a preloaded skill. On one line write PERSONA=<name>, then quote the persona's first H1 heading verbatim. If no persona section exists reply NO_PERSONA." \
  </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
grep "Session plugin prompt section" ~/.hermes/logs/agent.log | tail -3
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-023 | Persona via the agent skill mirror and the plugin binding | Confirm a Hermes session adopts a shared agent persona when the mirrored `agent-<name>` skill is preloaded and `HERMES_AGENT_PERSONA` names it for the repo plugin | `Your system prompt names a persona to adopt and its full text is a preloaded skill. On one line write PERSONA=<name>, then quote the persona's first H1 heading verbatim. If no persona section exists reply NO_PERSONA.` | `sync-skills-hermes.cjs --check`, then the `hermes chat` dispatch in §3 with `HERMES_AGENT_PERSONA=markdown`, `HERMES_ENABLE_PROJECT_PLUGINS=1` and `-s agent-markdown` | Exit `0`; `PERSONA=markdown` and the agent's H1 on stdout; `session_id:` on stderr; three plugin sections under 4000 characters in the log | stdout, exit code, elapsed seconds, session id, the log's section lines | PASS on the persona name and heading; FAIL on `NO_PERSONA`, a different heading, or a skipped section; SKIP only on a named blocker | Harness: the mirror check fails or the plugin does not load. Dependency: provider or plugin allowlist missing. Adapter: the section is skipped for size or the persona is ignored |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 30 s, stdout `PERSONA=markdown` then `# The Markdown Agent: Template-First Markdown Documentation Executor`, session `20260915_070538_9ca14f`; the log shows `repo-guards-session-context` at 303 characters and `repo-guards-persona` at 296. A first attempt that put the whole 22k persona into one section was skipped by Hermes (`exceeded max_chars (22911 > 4000)`) and answered `NO_PERSONA`, which is why the persona travels as a skill.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `agent-routing/persona-via-agent-skill-and-plugin.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [agent-delegation.md](../../references/agent-delegation.md) | The persona surface: agents link, `agent-<name>` skills, plugin binding |
| [SYNC.md](../../../../../../.hermes/SYNC.md) | How the agent copies are generated and what the plugin sections carry |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: HERMES-023
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `agent-routing/persona-via-agent-skill-and-plugin.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
