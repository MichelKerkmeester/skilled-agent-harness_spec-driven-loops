---
title: Skills Library
description: The catalog and front door to all skills in the repo, organized by family with routing, usage and creation guidance.
trigger_phrases:
  - "skills library"
  - "available skills"
  - "which skill should I use"
  - "skill catalog"
  - "skill routing"
---

# Skills Library

> The right skill loaded at the right time, so your agent does focused work instead of guessing.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Finding which skill handles your task, and understanding how routing picks one |
| **Invoke with** | Gate 2 auto-routing, a direct `Read()` of any `SKILL.md`, or the Python advisor shim |
| **Families** | cli-\*, deep-\*, mcp-\*, sk-\*, system-\* (22 skills total) |
| **Catalog** | Family-organized tables below, each skill linked to its own README |

---

## 2. OVERVIEW

### Why This Library Exists

You have two dozen skills and one prompt. Which skill fits? The wrong pick wastes a session on guidance that does not apply. Without a current index you cannot tell what exists, what each skill owns or how the router decides. This library answers all three.

### What It Is

Each skill is a self-contained package: a `SKILL.md` with runtime instructions, a `README.md` for human orientation, and optional references, assets and scripts. Skills load on demand through Gate 2 routing or through a direct read. They do not sit in memory until you need them. The advisor scores your prompt, returns a recommendation and the runtime loads the matching `SKILL.md`.

---

## 3. CATALOG

### cli-\* (cross-AI CLI dispatch)

| Skill | What it does |
|---|---|
| [cli-claude-code](cli-claude-code/README.md) | Dispatch a task to Anthropic's `claude` CLI for deep reasoning, surgical edits or scheduled work |
| [cli-codex](cli-codex/README.md) | Dispatch a task to OpenAI's `codex` CLI for sandboxed code generation, web research and parallel work |
| [cli-devin](cli-devin/README.md) | Dispatch a task to Cognition's `devin` CLI for autonomous coding, with optional local-to-cloud handoff |
| [cli-opencode](cli-opencode/README.md) | Dispatch a task into OpenCode's full project runtime in one shot from any external AI assistant |

### deep-\* (autonomous loops and the shared runtime)

| Skill | What it does |
|---|---|
| [deep-ai-council](deep-ai-council/README.md) | Put multiple reasoning lenses on a plan, let them disagree honestly and converge only when they earn it |
| [deep-context](deep-context/README.md) | Map the existing code you can reuse, connect and follow before you write a single line |
| [deep-improvement](deep-improvement/README.md) | Score a packet-local agent candidate across five dimensions before you ship it |
| [deep-loop-runtime](deep-loop-runtime/README.md) | The shared foundation every deep loop rides, a runtime library rather than a loop you invoke directly |
| [deep-research](deep-research/README.md) | Run an autonomous research loop that stores findings on disk and dispatches a fresh agent per iteration |
| [deep-review](deep-review/README.md) | Run an autonomous review loop that audits one dimension per pass with fresh context and classifies findings |

### mcp-\* (external tool surfaces)

| Skill | What it does |
|---|---|
| [mcp-chrome-devtools](mcp-chrome-devtools/README.md) | Drive a real browser from your agent or terminal, with a fast CLI and an MCP fallback |
| [mcp-click-up](mcp-click-up/README.md) | Manage ClickUp tasks from your agent or terminal |
| [mcp-code-mode](mcp-code-mode/README.md) | Execute TypeScript with direct access to every external MCP tool registered in `.utcp_config.json` |

### sk-\* (code, docs, git, prompts)

| Skill | What it does |
|---|---|
| [sk-code](sk-code/README.md) | The single code-work skill that detects your surface, loads your standards and verifies before claiming done |
| [sk-code-review](sk-code-review/README.md) | Stack-agnostic findings-first code review that classifies each finding by severity |
| [sk-doc](sk-doc/README.md) | Document quality that starts with structure, with a deterministic script that extracts and scores |
| [sk-git](sk-git/README.md) | Move from a clean workspace to a merged PR, with worktree setup, Conventional Commits and branch discipline |
| [sk-prompt](sk-prompt/README.md) | Turn a vague ask into a structured prompt, auto-selected from seven frameworks |
| [sk-prompt-models](sk-prompt-models/README.md) | Before you dispatch any small model, read that model's prompt-craft profile here |

### system-\* (the runtime foundation)

| Skill | What it does |
|---|---|
| [system-code-graph](system-code-graph/README.md) | The structural half of code intelligence. Answer what depends on what, and refuse on a stale graph |
| [system-skill-advisor](system-skill-advisor/README.md) | Pick the right skill for any prompt with a calibrated score, and refuse on a stale index |
| [system-spec-kit](system-spec-kit/README.md) | Documentation and memory for AI-assisted development. Every file change gets a spec folder |

---

## 4. ROUTING

Gate 2 runs before any non-trivial task. The native advisor (`mk_skill_advisor`, `advisor_recommend`) scores your prompt and returns prompt-safe recommendations. When confidence is at or above 0.8 and uncertainty is at or below 0.35, the skill is invoked automatically.

A Python shim (`skill_advisor.py`) is the fallback when the native path is unreachable:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "your prompt here" --threshold 0.8
```

Expected output: a ranked list of matching skills with confidence scores.

New skills are discovered through `graph-metadata.json` plus a valid `SKILL.md` frontmatter. Name and description are required. Trigger phrases strengthen routing but are not mandatory.

---

## 5. USING A SKILL

Three paths get you into a skill:

**Route via the advisor.** Gate 2 fires automatically on non-trivial prompts. The advisor returns the best match and the runtime loads it.

**Open a SKILL.md directly.** When you know which skill you need, read it:

```
Read(".opencode/skills/sk-git/SKILL.md")
```

**Run skill-local scripts.** Many skills ship scripts under `scripts/`. Check the skill's README for the exact commands and their expected output.

---

## 6. CREATING A SKILL

Start with the `sk-doc` scaffolding. It generates the folder layout and fills in the required frontmatter:

```
.opencode/skills/[skill-name]/
  SKILL.md              # Runtime instructions (required)
  graph-metadata.json   # Discovery metadata (required)
  README.md             # Human orientation
  references/           # Detailed guidance the SKILL.md loads
  assets/               # Templates and static resources
  scripts/              # Validation and utility scripts
```

A valid `SKILL.md` needs `name` and `description` in its frontmatter. Trigger phrases help the advisor route to it. Once the folder exists and the metadata is in place, the next advisor index picks it up.

---

## 7. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Advisor returns no recommendations | Prompt is too short or too generic for the scorer | Add domain keywords and retry |
| Wrong skill loaded | Confidence threshold was met for a sibling skill | Read the correct `SKILL.md` directly, or rephrase the prompt with more specific terms |
| New skill not discovered | Missing `graph-metadata.json` or invalid `SKILL.md` frontmatter | Add the metadata file and verify `name` and `description` exist in the frontmatter |
| Advisor reports a stale index | Skill graph has not been rebuilt since adding or changing skills | Run `mk_skill_advisor_advisor_rebuild` to refresh the graph |

---

## 8. FAQ

**Q: How many skills are there?**

A: 22, organized into five families: cli-\*, deep-\*, mcp-\*, sk-\* and system-\*. The catalog above lists every one.

**Q: What is the difference between system-code-graph and mcp-code-mode?**

A: `system-code-graph` is structural code intelligence. It answers what calls what, what imports what and what breaks when you change something. `mcp-code-mode` executes TypeScript with access to external MCP tools. They solve different problems and live in different families.

**Q: Do I need to load skills manually?**

A: Usually no. Gate 2 routing handles it for non-trivial tasks. You load a skill manually when you want specific guidance the advisor might not route to, or when you are reading documentation rather than executing a task.

**Q: Can I create my own skill?**

A: Yes. Use the `sk-doc` scaffolding to set up the folder, write the `SKILL.md` with the required frontmatter and the advisor will discover it on the next index.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`system-spec-kit/README.md`](system-spec-kit/README.md) | Documentation and memory for every file change |
| [`system-skill-advisor/README.md`](system-skill-advisor/README.md) | How skill routing works under the hood |
| [`sk-doc/README.md`](sk-doc/README.md) | Document quality, scaffolding and the skill creation workflow |
| [`system-code-graph/README.md`](system-code-graph/README.md) | Structural code queries and graph maintenance |
