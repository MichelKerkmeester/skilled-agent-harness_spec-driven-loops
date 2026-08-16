---
title: "Skills Library"
description: "Catalog and front door to 11 top-level skill identities across four catalog families, with routing guidance and creation workflow."
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
| **Families** | Four prefix families: `cli-*` (1), `mcp-*` (2), `sk-*` (5), `system-*` (3) |
| **Catalog** | A family-by-family table below that links every skill's own README |

---

## 2. OVERVIEW

Eleven top-level skill identities live under `.opencode/skills/`, each a self-contained folder with runtime instructions (`SKILL.md`), a README, graph metadata and domain references. They stay out of context until needed: the advisor scores a request, returns a ranked list, and the agent loads only the match. This library catalogs every skill by family, links each one's README and explains how routing picks the match, so the right skill loads focused guidance instead of wasting context on the wrong one.

New skills are discovered automatically from a valid `SKILL.md` frontmatter plus `graph-metadata.json`; no manual registration step exists.

---

## 3. CATALOG

Each skill name links to its own README. One-line descriptions reflect current behavior.

### cli-*: Cross-AI CLI Dispatch

| Skill | What it does |
|---|---|
| [`cli-external-orchestration`](cli-external-orchestration/README.md) | Parent hub for external CLI dispatch, holding no per-mode logic: routes by `workflowMode` to `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, and `cli-pi` |

### mcp-*: External Tool Surfaces

| Skill | What it does |
|---|---|
| [`mcp-tooling`](mcp-tooling/README.md) | Parent hub of MCP bridges and transports: browser debugging (`mcp-chrome-devtools`), ClickUp tasks (`mcp-click-up`), Obsidian notes (`mcp-obsidian`), Figma design (`mcp-figma`), AI-browser orchestration (`mcp-aside-devtools`), plus read-only design references (`mcp-mobbin`, `mcp-refero`) |
| [`mcp-code-mode`](mcp-code-mode/README.md) | MCP orchestration via TypeScript execution: use Code Mode for ALL external MCP tool calls — ~98% context reduction, type-safe |

### sk-*: Code, Docs, Git and Prompts

| Skill | What it does |
|---|---|
| [`sk-code`](sk-code/README.md) | Unified two-axis code skill: two WORKFLOW modes (`sk-code-quality`, `sk-code-review`) plus read-only SURFACE evidence packets (`sk-code-webflow`, `sk-code-opencode`), each carrying implement/debug/verify workflow and verification gates |
| [`sk-doc`](sk-doc/README.md) | Documentation and component-authoring parent hub: workflow packets for skills, hubs, READMEs/install-guides, agents, commands, catalogs and playbooks, plus deterministic validation and DQI scoring |
| [`sk-git`](sk-git/README.md) | Git workflow in one skill: numbered worktrees, Conventional Commits, PRs, merge/rebase and finish |
| [`sk-design`](sk-design/README.md) | Distinctive, intentional UI design across the full surface: visual direction, color, typography, layout, spacing, hierarchy, tokens, animation and accessibility — grounded against real design systems, then handed to sk-code to build |
| [`sk-prompt`](sk-prompt/README.md) | Prompt engineering parent hub: routes by `workflowMode` to `prompt-improve` (7-framework, DEPTH-thinking, CLEAR-scored prompt enhancement) and `prompt-models` (read-only per-model prompt-craft profiles) — packets housed at `sk-prompt-improve/` and `sk-prompt-models/` |

### system-*: Deep Loops and the Runtime Foundation

| Skill | What it does |
|---|---|
| [`system-deep-loop`](system-deep-loop/README.md) | Routes research, review, AI Council, improvement, and named-standard alignment modes through registry-selected packets over nested `runtime/` infrastructure |
| [`system-skill-advisor`](system-skill-advisor/README.md) | Routes non-trivial requests to matching skills through standalone MCP metadata and stable advisor tool ids, with the daemon-backed `skill-advisor` CLI as fallback |
| [`system-spec-kit`](system-spec-kit/README.md) | Unified spec-folder workflow plus context preservation: Levels 1-3+, strict validation, and Spec Kit Memory — required for file modifications |

### Runtime Plugin Skills

Outside this tree, runtimes may contribute their own skills. Pi, for example, loads `pi-subagents` (subagent delegation) from its plugin packages under `.pi/npm/node_modules/`.

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
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "commit my changes" --threshold 0.8
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

Yes. The advisor returns a ranked list. A review task might load `sk-code`'s code-review mode as the primary standard and its router-selected surface evidence as a secondary layer when findings need surface-specific detail. The calling agent decides which sections apply.

**Q: What is the difference between skill-local scripts and the shared advisor scripts?**

Skill-local scripts live in a skill's own `scripts/` directory and handle domain-specific automation. The shared advisor scripts live under `system-skill-advisor/mcp-server/scripts/` and handle routing, graph compilation, benchmarking and regression.

**Q: Why does the advisor cap confidence at 0.95?**

The cap leaves room for judgment on edge cases. A 0.95 score means high confidence, not certainty. A heuristic scorer claiming absolute certainty would be misleading.

**Q: How do I know which family a skill belongs to?**

The family is the prefix before the first hyphen: `cli-*`, `mcp-*`, `sk-*` or `system-*`. Each family has its own subsection in the catalog above, and every skill's README states its purpose in its first sentence.

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
| [`sk-prompt/sk-prompt-models/README.md`](sk-prompt/sk-prompt-models/README.md) | Per-model prompt-craft profiles for small-model dispatch |
