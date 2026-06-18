# Context Report: skills index README rewrite (phase 024)

The catalog substrate is sourced directly from the 22 rewritten skill READMEs (their one-line pitches and verified facts), so this report is the orchestrator-built ground truth rather than a fresh deep-context dispatch. The index rewrite runs last so it reflects the children that shipped in phases 001 to 023. The current index has real stale facts to correct.

---

## 1. PURPOSE

`.opencode/skills/README.md` is the catalog and front door to the skills library. A reader lands here to learn what the skills system is, which skill handles their task, and how routing picks one. The rewrite leads with that reader and lays out the 22 skills by family.

## 2. PROBLEM

Without a current index, a reader cannot tell which of two dozen skills fits their task, or even how many there are. The old index drifted: it counts 21 folders when there are 22, pins per-skill version numbers that age the day they are written, and miscategorizes skills. The fix is a narrative index with a family-organized catalog that links each skill's own README and avoids brittle counts.

## 3. THE LIBRARY (verified: 22 skills, 5 families)

Families confirmed by directory count: cli-* (4), deep-* (6), mcp-* (3), sk-* (6), system-* (3) = 22.

### cli-* (cross-AI CLI dispatch, 4)
- `cli-claude-code`: Dispatch a task to Anthropic's `claude` CLI for deep reasoning, surgical edits or scheduled work.
- `cli-codex`: Dispatch a task to OpenAI's `codex` CLI for sandboxed code generation, web research and parallel work.
- `cli-devin`: Dispatch a task to Cognition's `devin` CLI for autonomous coding, with optional local-to-cloud handoff.
- `cli-opencode`: Dispatch a task into OpenCode's full project runtime in one shot from any external AI assistant.

### deep-* (autonomous loops and the shared runtime, 6)
- `deep-ai-council`: Put multiple reasoning lenses on a plan, let them disagree honestly and converge only when they earn it.
- `deep-context`: Map the existing code you can reuse, connect and follow before you write a single line.
- `deep-improvement`: Score a packet-local agent candidate across five dimensions before you ship it.
- `deep-loop-runtime`: The shared foundation every deep loop rides, a runtime library rather than a loop you invoke directly.
- `deep-research`: Run an autonomous research loop that stores findings on disk and dispatches a fresh agent per iteration.
- `deep-review`: Run an autonomous review loop that audits one dimension per pass with fresh context and classifies findings.

### mcp-* (external tool surfaces, 3)
- `mcp-chrome-devtools`: Drive a real browser from your agent or terminal, with a fast CLI and an MCP fallback.
- `mcp-click-up`: Manage ClickUp tasks from your agent or terminal.
- `mcp-code-mode`: Execute TypeScript with direct access to every external MCP tool registered in `.utcp_config.json`.

### sk-* (code, docs, git, prompts, 6)
- `sk-code`: The single code-work skill that detects your surface, loads your standards and verifies before claiming done.
- `sk-code-review`: Stack-agnostic findings-first code review that classifies each finding by severity.
- `sk-doc`: Document quality that starts with structure, with a deterministic script that extracts and scores.
- `sk-git`: Move from a clean workspace to a merged PR, with worktree setup, Conventional Commits and branch discipline.
- `sk-prompt`: Turn a vague ask into a structured prompt, auto-selected from seven frameworks.
- `sk-prompt-small-model`: Before you dispatch any small model, read that model's prompt-craft profile here.

### system-* (the runtime foundation, 3)
- `system-code-graph`: The structural half of code intelligence. Answer what depends on what, and refuse on a stale graph.
- `system-skill-advisor`: Pick the right skill for any prompt with a calibrated score, and refuse on a stale index.
- `system-spec-kit`: Documentation and memory for AI-assisted development. Every file change gets a spec folder.

## 4. ROUTING (preserve)

Gate 2 routing runs before any non-trivial task. The native advisor (`mk_skill_advisor`, `advisor_recommend`) scores the request and returns prompt-safe recommendations. Confidence at or above 0.8 with uncertainty at or below 0.35 means the skill is invoked. A Python shim (`skill_advisor.py`) is the fallback when the native path is unreachable. New skills are discovered through `graph-metadata.json` plus a valid SKILL.md frontmatter (name and description required, trigger_phrases strengthen routing).

## 5. WHAT TO PRESERVE FROM THE CURRENT INDEX

- The three ways to use the library: route via Gate 2, open a SKILL.md directly, run skill-local scripts.
- The skill-creation path through sk-doc scaffolding.
- The recommended skill folder layout (SKILL.md, graph-metadata.json, references/, assets/, scripts/).
- Links to the root README and the key skill READMEs.

## 6. STALE FACTS TO FIX

1. Count: the index says 21 skill folders. There are 22. Prefer describing families over pinning a total that drifts.
2. system-code-graph is mischaracterized as semantic search via vector embeddings and listed under MCP integrations. It is the structural code-intelligence skill in the system-* family. The README rewrite corrected this; the index must match.
3. Per-skill version numbers (cli-claude-code 1.1.1, system-spec-kit 2.2.27.0, and so on) are stale and drift-prone. Drop them in favor of one-line descriptions.
4. The structure tree lists system-code-graph twice and references a non-existent "positional-scoring fallback" skill. Use the real 22-folder set.
5. Brittle Key Statistics counts (folders, families, script-bearing folders, tool counts) drift. Replace with the family catalog and prose.

## 7. STYLE

Narrative house voice: a one-line pitch, an AT A GLANCE table as section 1, a problem-first OVERVIEW, a family-organized CATALOG that links each skill README, a routing section, a how-to-use and how-to-create section, troubleshooting, FAQ and related documents. No em dashes, no double-hyphen separators, no semicolons, no Oxford-comma lists, no banned words. Drop brittle counts and per-skill version pins.
