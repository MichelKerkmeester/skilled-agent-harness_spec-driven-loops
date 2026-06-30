---
title: "Skills Library"
description: "Catalog and front door to 20 on-demand skills across five families, with routing guidance and creation workflow."
trigger_phrases:
  - "skills library"
  - "available skills"
  - "which skill should I use"
  - "skill catalog"
  - "skill routing"
---

# Skills Library

> Load the right skill for any task, every time, without guessing which folder to open.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Finding the skill that matches your task and understanding how routing picks it |
| **Invoke with** | Gate 2 auto-routing, a direct read of the skill's `SKILL.md`, or keyword triggers like "commit changes" |
| **Families** | Five: `cli-*` (3), `deep-*` (2), `mcp-*` (5), `sk-*` (7), `system-*` (3) |
| **Catalog** | A family-by-family table below that links every skill's own README |

---

## 2. OVERVIEW

### Why This Library Exists

Twenty skills live under `.opencode/skills/`. A reader lands here and faces the same question every time: which one handles this task? The right skill loads focused guidance, a one-page reference and scripts that are proven to work. The wrong skill wastes context on irrelevant instructions. Worse, a reader might not know that a skill for the task exists at all. The library solves that. It catalogs every skill by family, links each one's README and explains how routing picks the match before you open a single file.

### What It Is

Each skill is a self-contained folder with runtime instructions (`SKILL.md`), a README, graph metadata and domain references. Skills load on demand through Gate 2 routing or a direct read. They do not sit in context waiting to be used. The advisor scores your request, returns a ranked list and the agent loads only the match it needs. New skills are discovered automatically through `graph-metadata.json` and a valid `SKILL.md` frontmatter.

---

## 3. CATALOG

Each skill name links to its own README. The one-line descriptions come from the skill's current behavior.

### cli-*: Cross-AI CLI Dispatch

| Skill | What it does |
|---|---|
| [`cli-claude-code`](cli-claude-code/README.md) | Dispatch a task to Anthropic's `claude` CLI for deep reasoning, surgical edits or scheduled work |
| [`cli-opencode`](cli-opencode/README.md) | Dispatch a task to OpenAI's `opencode` CLI for sandboxed code generation, web research and parallel work |
| [`cli-opencode`](cli-opencode/README.md) | Dispatch a task into OpenCode's full project runtime in one shot from any external AI assistant |

### deep-*: Autonomous Loops and the Shared Runtime

| Skill | What it does |
|---|---|
| [`deep-loop-workflows`](deep-loop-workflows/README.md) | The unified deep-loop skill: routes a request to one of five modes (context, research, review, ai-council, improvement) over the shared runtime |
| [`deep-loop-runtime`](deep-loop-runtime/README.md) | The shared foundation every deep loop rides, a runtime library rather than a loop you invoke directly |

### mcp-*: External Tool Surfaces

| Skill | What it does |
|---|---|
| [`mcp-chrome-devtools`](mcp-chrome-devtools/README.md) | Drive a real browser from your agent or terminal, with a fast CLI and an MCP fallback |
| [`mcp-click-up`](mcp-click-up/README.md) | Manage ClickUp tasks from your agent or terminal |
| [`mcp-code-mode`](mcp-code-mode/README.md) | Execute TypeScript with direct access to every external MCP tool registered in `.utcp_config.json` |
| [`mcp-open-design`](mcp-open-design/README.md) | Drive the installed Open Design desktop app from the terminal: read and reuse local design systems and commission gated generation runs, via the `od` CLI and MCP |
| [`mcp-figma`](mcp-figma/README.md) | Drive Figma Desktop from the terminal to read, author, modify, and export designs, tokens, and components, with an optional Figma MCP via Code Mode |

### sk-*: Code, Docs, Git and Prompts

| Skill | What it does |
|---|---|
| [`sk-code`](sk-code/README.md) | The single code-work skill that detects your surface, loads your standards and verifies before claiming done |
| [`sk-code-review`](sk-code-review/README.md) | Stack-agnostic findings-first code review that classifies each finding by severity |
| [`sk-doc`](sk-doc/README.md) | Document quality that starts with structure, with a deterministic script that extracts and scores |
| [`sk-git`](sk-git/README.md) | Move from a clean workspace to a merged PR, with worktree setup, Conventional Commits and branch discipline |
| [`sk-design`](sk-design/README.md) | Set distinctive visual direction (palette, typography, layout, motion) that avoids templated AI defaults, grounding against real design systems (`mcp-open-design`) and shipped-UI references (Mobbin/Refero via Code Mode), then hand the build to sk-code |
| [`sk-prompt`](sk-prompt/README.md) | Turn a vague ask into a structured prompt, auto-selected from seven frameworks |
| [`sk-prompt-models`](sk-prompt-models/README.md) | Before you dispatch any small model, read that model's prompt-craft profile here |

### system-*: The Runtime Foundation

| Skill | What it does |
|---|---|
| [`system-code-graph`](system-code-graph/README.md) | The structural half of code intelligence. Answer what depends on what, and refuse on a stale graph — over MCP or the daemon-backed `code-index` CLI |
| [`system-skill-advisor`](system-skill-advisor/README.md) | Pick the right skill for any prompt with a calibrated score, and refuse on a stale index — over MCP or the daemon-backed `skill-advisor` CLI |
| [`system-spec-kit`](system-spec-kit/README.md) | Documentation and memory for AI-assisted development. Every file change gets a spec folder, and the memory daemon answers over MCP or the `spec-memory` CLI |

---

## 4. ROUTING

Gate 2 runs before any non-trivial task. The native advisor (`mk_skill_advisor`, tool `advisor_recommend`) scores the request and returns prompt-safe recommendations ranked by confidence. Two thresholds gate invocation: confidence at or above 0.8 and uncertainty at or below 0.35. When both pass, the skill must be invoked. When either fails, a general approach is allowed. A Python shim (`skill_advisor.py`) provides a fallback when the native path is unreachable.

New skills are discovered through `graph-metadata.json` plus a valid `SKILL.md` frontmatter. The `name` and `description` fields are required. `trigger_phrases` strengthen routing accuracy without being mandatory.

The loading sequence is always the same: the advisor scores the request, the agent reads the matched `SKILL.md` and the skill's instructions guide the work from there.

---

## 5. USING A SKILL

Three paths reach a skill.

**Route with Gate 2.** The advisor picks the match. You do not need to know which skill to open.

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "commit my changes" --threshold 0.8
# Output: [{"skill":"sk-git","confidence":0.92,"uncertainty":0.08,...}]
```

**Open a SKILL.md directly.** When you know the skill, read its runtime instructions.

```bash
# Read the full runtime surface
Read(".opencode/skills/sk-git/SKILL.md")
```

**Run skill-local scripts.** Many skills ship automation in their `scripts/` directory.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md --type readme
# Exit 0 means valid. Anything else prints the issues found.
```

A typical workflow chains all three: the advisor picks the skill, the agent reads `SKILL.md` for instructions and the skill's scripts execute the domain work.

---

## 6. CREATING A SKILL

New skills start with `sk-doc` scaffolding and follow a fixed folder layout.

```bash
python3 .opencode/skills/sk-doc/scripts/init_skill.py my-new-skill --path .opencode/skills
# Creates the folder with SKILL.md, graph-metadata.json and the references/ assets/ scripts/ skeleton
```

Every skill folder needs:

| Path | Purpose |
|---|---|
| `SKILL.md` | Required entry point with YAML frontmatter, routing logic and runtime instructions |
| `graph-metadata.json` | Relationship metadata that feeds the skill graph and advisor discovery |
| `references/` | Domain guidance loaded on demand during a session |
| `assets/` | Templates and static files |
| `scripts/` | Automation for checks, generation or package validation |

After fleshing out `SKILL.md` and the references, run the packager to validate the structure:

```bash
python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/my-new-skill/
# Validates frontmatter, structure and graph metadata. Exit 0 means the skill is ready for discovery.
```

The advisor picks up the new skill on the next graph scan. No manual registration step is needed.

---

## 7. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Advisor returns an empty list | No skill matched above the threshold, or `SKILL.md` files are missing | Lower the threshold to inspect low-confidence matches: `python3 skill_advisor.py "query" --threshold 0.5`. Verify frontmatter with `head -10 .opencode/skills/*/SKILL.md`. |
| Advisor returns the wrong skill | Overly broad description terms in a skill's frontmatter, or a synonym that pulls unrelated skills | Tighten the `description` in that skill's `SKILL.md`. Add specific `trigger_phrases`. Compare native `advisor_recommend` output with the Python shim's to isolate the mismatch. |
| New skill does not appear in results | Missing or invalid `SKILL.md` frontmatter. The advisor needs at least `name` and `description` | Validate the frontmatter, then run a health check to clear the discovery cache: `python3 skill_advisor.py "test" --health`. |
| Skill script raises `ModuleNotFoundError` | A required Python package is not installed, or the script is run from the wrong directory | Always run scripts from the repository root with the full path. Check dependencies: `python3 -c "import yaml; print('ok')"`. |

---

## 8. FAQ

**Q: Do I register a new skill anywhere?**

No. A valid `SKILL.md` frontmatter and `graph-metadata.json` are enough. The advisor discovers the skill on the next scan.

**Q: Can I use more than one skill in the same task?**

Yes. The advisor returns a ranked list. A review task might load `sk-code-review` as the primary skill and `sk-code` as a secondary when findings need surface-specific evidence. The calling agent decides which sections apply.

**Q: What is the difference between skill-local scripts and the shared advisor scripts?**

Skill-local scripts live in a skill's own `scripts/` directory and handle domain-specific automation. The shared advisor scripts live under `system-skill-advisor/mcp_server/scripts/` and handle routing, graph compilation, benchmarking and regression.

**Q: Why does the advisor cap confidence at 0.95?**

The cap leaves room for judgment on edge cases. A 0.95 score means high confidence, not certainty. A heuristic scorer claiming absolute certainty would be misleading.

**Q: How do I know which family a skill belongs to?**

The family is the prefix before the first hyphen: `cli-*`, `deep-*`, `mcp-*`, `sk-*` or `system-*`. Each family has its own subsection in the catalog above, and every skill's README states its purpose in its first sentence.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [Main Framework README](../../README.md) | Root project overview and framework entry point |
| [`system-skill-advisor/README.md`](system-skill-advisor/README.md) | Native advisor, MCP quick start, compatibility shim and runtime hooks |
| [`system-spec-kit/README.md`](system-spec-kit/README.md) | Spec folder workflow, memory foundation and context preservation |
| [`sk-code/README.md`](sk-code/README.md) | Multi-stack coding standards with surface detection and verification |
| [`sk-git/README.md`](sk-git/README.md) | Git workflow: worktrees, Conventional Commits and PR integration |
| [`sk-doc/README.md`](sk-doc/README.md) | Documentation quality, validation scripts and the DQI score |
| [`sk-prompt/README.md`](sk-prompt/README.md) | Structured prompt engineering across seven frameworks |
| [`sk-prompt-models/README.md`](sk-prompt-models/README.md) | Per-model prompt-craft profiles for small-model dispatch |
