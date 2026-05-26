OpenAI Codex v0.133.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: medium
reasoning summaries: none
session id: 019e63de-c456-7202-939d-fde16501021b
--------
user
Independent code review (READ-ONLY). You may run git and read files. Do NOT modify any file.

# Task
Audit git commit `1e58d845af` ("docs(117): remove TOC blocks + HTML anchor comments from skill docs") in this repo. The commit removed Table-of-Contents blocks and `<!-- ANCHOR -->` HTML comment delimiters from ~857 skill markdown files plus 20 standards/config/template/command files. Your job: find anything the cleanup broke **by accident**.

This is **Iteration 1 of 10**. Focus dimension: **CORRECTNESS — TOC-removal content safety on high-risk files**.

# What the change was supposed to do
- Remove `## TABLE OF CONTENTS` heading + its `[text](#anchor)` bullet list + a wrapping `<!-- ANCHOR:table-of-contents -->`.
- Remove standalone `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` comment lines.
- Collapse redundant `---` rules / blank lines left behind.
It must NOT have removed or altered prose, real section headings (other than the TOC heading itself), tables, code blocks, non-TOC list items, or frontmatter.

# This iteration — inspect these high-TOC-risk files in the commit
Sample broadly across the removed-TOC files (READMEs, manual_testing_playbook roots, feature_catalog roots). Suggested commands:
- `git show --stat 1e58d845af | head -40`
- `git show 1e58d845af -- .opencode/skills/cli-gemini/README.md .opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md .opencode/skills/deep-research/feature_catalog/feature_catalog.md .opencode/skills/system-skill-advisor/README.md .opencode/skills/deep-loop-runtime/README.md`
- Pick ~10 more removed-TOC files of your choosing from `git show --stat 1e58d845af --name-only` and inspect their diffs.
- For each, confirm every `-` (removed) line is ONLY: a TOC heading, a TOC `[...](#...)` link bullet, an `<!-- ANCHOR -->` comment, a blank line, or a `---` rule. Flag any removed line that is real prose, a non-TOC heading, a table row, code, or a real list item — that is content loss.
- Spot-check that the post-removal file still reads coherently (no orphaned intro like "see the table below" pointing at a deleted TOC; first real section follows the title/tagline cleanly).

# Carve-outs — do NOT flag these
- `system-spec-kit/templates/**` keep `<!-- ANCHOR -->` markers (intentional, tooling-consumed).
- `sk-doc/scripts/tests/**` fixtures keep TOCs (validator test data).
- `research/research.md` ToC allowance; Webflow "Table of Contents" web component in `sk-code`.
- Inline anchor *mentions* in prose/commands (they reference, not declare, anchors).

# Output (to stdout only)
1. A markdown section "## Iteration 1 — Correctness (TOC content safety)" with: files inspected (list), method, and each finding.
2. For each finding: `- [P0|P1|P2] <file>:<line-or-hunk> — <one-line claim>` then an indented evidence line (the offending removed content) and why it is a defect. P0=content/functionality broken; P1=regression risk/inconsistency; P2=polish.
3. If no defects: say "No defects found in this dimension/sample."
4. FINAL LINE, exactly one, machine-parseable:
`FINDINGS_JSON: {"iteration":1,"dimension":"correctness","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`

hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
SKILL ROUTING: advisor surfaced `sk-code` and `sk-doc`; I’m using them lightly because this is a read-only markdown/code-review audit. I’ll inspect the commit diff directly and only report removed lines that are outside the allowed cleanup shape.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-code/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-doc
description: "Markdown and OpenCode component specialist: doc quality, content optimization, component scaffolds, install guides, playbooks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.5.0.0
---

<!-- Keywords: sk-doc, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows, (4) Install guide creation for setup documentation and (5) Feature catalog and manual testing playbook creation for inventory and validation packages.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations.

## 1. WHEN TO USE

### Use Case: Document Quality Management

Enforce markdown structure, optimize content for AI assistants, validate quality through script-assisted AI analysis.

**README Creation** - Use `readme_template.md` + `readme_creation.md` when:
- Creating new README for any folder or project
- User requests "create a README", "add documentation", "write a README"
- Folder needs comprehensive documentation
- Workflow: [readme_creation.md](./references/readme_creation.md) | Template: [readme_template.md](./assets/readme/readme_template.md)

**Skill README Creation** - Use `skill_readme_template.md` when:
- Creating or refreshing `.opencode/skills/[skill-name]/README.md`
- A skill README needs human-facing purpose, quick start, structure, examples, troubleshooting, FAQ or related-resource navigation
- Template: [skill_readme_template.md](./assets/skill/skill_readme_template.md)

**Frontmatter Validation** - Use `frontmatter_templates.md` when:
- Validating YAML frontmatter in any document
- Checking required fields for document types
- Fixing frontmatter syntax errors

**Changelog & Release Notes** - Use `changelog_template.md` when:
- Authoring a global component changelog at `.opencode/changelog/{NN--component}/v{VERSION}.md`
- Composing GitHub release notes that mirror the changelog body
- Choosing between compact (under 10 changes) and expanded (10+ changes or major) formats
- Template: [changelog_template.md](./assets/changelog_template.md). Used by `/create:changelog` (auto + confirm). Nested packet-local changelogs use the spec-kit templates at `.opencode/skills/system-spec-kit/templates/changelog/` instead.

**Validation Workflow** - Apply after Write/Edit operations:
- Auto-correct filename violations (ALL CAPS to lowercase, hyphens to underscores)
- Fix safe violations (separators, H2 case)
- Check critical violations (missing frontmatter, wrong section order)

**Manual Optimization** - Run when:
- README needs optimization for AI assistants
- Creating critical documentation (specs, knowledge, skills)
- Pre-release quality checks
- Generating llms.txt for LLM navigation

### Use Case: OpenCode Component Creation

Create and manage OpenCode components (skills, agents, commands). Each component type has templates and validation with quality standards.

**Component Types:**
- **Skills** (.opencode/skills/) - Knowledge bundles with workflows → [skill_creation.md](./references/skill_creation.md)
- **Agents** (.opencode/agents/) - AI personas with tool permissions → [agent_creation.md](./references/agent_creation.md)
- **Commands** (.opencode/commands/) - Slash commands for user invocation → [command_template.md](./assets/command_template.md)

For larger skills, split deep content into focused reference files and keep concise navigation in `SKILL.md` or `README.md`. When a skill has both cross-cutting standards and document-family guides, prefer `references/global/` for shared rules and the `references/` root for creation-specific workflows.

Start with: [skill_creation.md](./references/skill_creation.md) (Section 9)
Primary templates:
- [skill_md_template.md](./assets/skill/skill_md_template.md)
- [skill_readme_template.md](./assets/skill/skill_readme_template.md)
- [skill_reference_template.md](./assets/skill/skill_reference_template.md)
- [skill_asset_template.md](./assets/skill/skill_asset_template.md)

**Use when**:
- User requests skill creation ("create a skill", "make a new skill")
- User requests agent creation ("create an agent", "make a new agent")
- User requests command creation ("create a command", "add a slash command")
- Scaffolding component structure
- Validating component quality
- Packaging skill for distribution

**Skill Process (6 steps)**: Understanding (examples) → Planning (resources) → Initialization (`init_skill.py`) → Editing (populate) → Packaging (`package_skill.py`) → Iteration (test/improve)

**Agent Process**: Load `agent_creation.md` and `agent_template.md` → Define frontmatter (mode, permissions) → Create sections (workflow, capabilities, anti-patterns) → Validate → Test

**Command Process**: Load `command_template.md` → Define frontmatter (name, description) → Create execution logic → Add to command registry → Test

### Use Case: Flowchart Creation

Create ASCII flowcharts for visualizing workflows, user journeys and decision trees.

For styled HTML visuals (interactive diagrams, dashboard pages, or polished data-table renders), use a dedicated HTML workflow instead of forcing ASCII or markdown flowcharts.

**Use when**:
- Documenting multi-step processes with branching
- Creating decision trees with multiple outcomes
- Showing parallel execution with sync points
- Visualizing approval gates and revision cycles

**See**: [assets/flowcharts/](./assets/flowcharts/)

### Use Case: Install Guide Creation

Create and validate installation documentation for MCP servers, plugins and tools using phase-based templates.

**Use when**:
- Creating documentation for MCP server installation
- Documenting plugin setup procedures
- Standardizing tool installation across platforms
- Need phase-based validation checkpoints

**5-Phase Process**: Overview → Prerequisites → Installation → Configuration → Verification

**See**: [install_guide_creation.md](./references/install_guide_creation.md)

### Use Case: Manual Testing Playbook Creation

Create manual testing playbooks with deterministic scenarios, structured evidence collection, and multi-agent execution planning.

**Manual Testing Playbook** - Use `testing_playbook/manual_testing_playbook_template.md` when:
- Creating manual testing scenarios for a skill
- Standardizing test evidence and verdict criteria
- Setting up multi-agent test execution planning

**Canonical Package**: Root `manual_testing_playbook.md` plus numbered category folders with one per-feature file per feature ID.

**See**:
- [manual_testing_playbook_creation.md](./references/manual_testing_playbook_creation.md)
- [manual_testing_playbook_template.md](./assets/testing_playbook/manual_testing_playbook_template.md)

### Use Case: Feature Catalog Creation

Create feature catalogs with a rooted feature inventory, numbered category sections, and per-feature reference files.

**Feature Catalog** - Use `assets/feature_catalog/feature_catalog_template.md` when:
- Creating a canonical current-state feature inventory for a skill or system
- Linking manual playbooks back to a stable feature reference
- Documenting current behavior with source-file anchors and stable slugs

**Canonical Package**: Root `FEATURE_CATALOG.md` plus numbered category folders with one per-feature file per catalog entry.

**See**:
- [feature_catalog_creation.md](./references/feature_catalog_creation.md)
- [feature_catalog_template.md](./assets/feature_catalog/feature_catalog_template.md)

### Use Case: Benchmark Folder Creation

Create skill-local `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folders that promote curated bake-off results from an originating spec packet into the consuming skill, where operators reading the MCP code can find the headline without leaving the skill tree.

**Benchmark Creation** - Use `benchmark_report_template.md` plus `source_template.md` when:
- An ADR or spec packet has just promoted a non-trivial default change (embedder swap, reranker change, retrieval policy) backed by measured evidence
- The originating spec packet has a stable headline plus replay commands and is worth surfacing inside the consuming skill
- A sibling skill already ships a `mcp_server/benchmarks/` folder and parity matters for operators moving between skills

**Canonical Package**: One `benchmark-<YYYY-MM-DD>/` folder per run, holding `benchmark_report.md` (ten-section curated narrative), `SOURCE.md` (wayfinding pointer back to the spec packet), `results.csv`, `*.jsonl` per-probe data, and optional sidecars (`runtime-measurements.md`, `risk-analysis-*.md`).

**See**:
- [benchmark_creation.md](./references/benchmark_creation.md)
- [benchmark_report_template.md](./assets/benchmark/benchmark_report_template.md)
- [source_template.md](./assets/benchmark/source_template.md)

### When NOT to Use (All Modes)

- Non-markdown files (only `.md` supported)
- Simple typo fixes (use Edit tool directly)
- Internal notes or drafts
- Auto-generated API docs
- Short 2-3 step processes (use bullet points)

---

## 2. SMART ROUTING

> Pattern: see [sk-doc smart-router resilience template](./assets/skill/skill_smart_router.md).

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/global/` for documentation standards, validation rules, optimization guidance, voice rules, and shared execution workflows.
- `references/` root for document-family and component creation guides such as skill creation, agent creation, install guides, feature catalogs, and manual testing playbooks.
- `assets/readme/` for README and install-guide scaffolds; `assets/changelog_template.md`, `assets/frontmatter_templates.md`, and `assets/llmstxt_templates.md` at the assets/ root for cross-cutting templates.
- `assets/skill/` for skill creation templates, including `SKILL.md`, skill README, reference and asset scaffolds; `assets/agent_template.md` and `assets/command_template.md` at the assets/ root for agent and command creation templates.
- `assets/feature_catalog/` and `assets/testing_playbook/` at the assets/ root for feature catalog and manual testing playbook package templates.
- `assets/benchmark/` for skill-local benchmark folder templates (`benchmark_report_template.md`, `source_template.md`).
- `assets/flowcharts/` for reusable ASCII flowchart patterns and diagram examples.

> **Cross-CLI consumption note** (per packets 071/072 stress-test data): when sk-doc is dispatched via an external CLI and the caller consumes the routing-trace output LITERALLY (e.g. attempts to `Read()` cited resource paths), prefer **cli-codex** (gpt-5.5/high/fast) — it scored 66.7% resource-accuracy vs cli-opencode 47.2% on the sk-doc router stress matrix. claude-opus-4.7 tends to hallucinate plausible-sounding paths that don't exist in this skill's filesystem; treat its routing trace as advisory and verify cited paths before reading. See the local router stress-test notes for the full data and hallucination finding.

### Resource Loading Levels

| Level       | When to Load             | Resources                   |
| ----------- | ------------------------ | --------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline    |
| CONDITIONAL | If intent signals match  | Mode-specific docs/templates|
| ON_DEMAND   | Only on explicit request | Extended standards/template |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, checks `inventory`, and suppresses repeats with `seen`.
- Pattern 3: Extensible Routing Key - intent labels route to document families without static inventories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests disambiguation and missing families return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/global/quick_reference.md"

INTENT_SIGNALS = {
    "DOC_QUALITY": {"weight": 4, "keywords": ["dqi", "quality", "validate", "extract_structure"]},
    "OPTIMIZATION": {"weight": 3, "keywords": ["optimize", "llms.txt", "ai context"]},
    "SKILL_CREATION": {"weight": 4, "keywords": ["skill creation", "new skill", "init_skill", "package_skill"]},
    "AGENT_COMMAND": {"weight": 4, "keywords": ["create agent", "create command", "agent template", "command template"]},
    "FLOWCHART": {"weight": 3, "keywords": ["flowchart", "ascii diagram", "decision tree", "swimlane"]},

 succeeded in 0ms:
---
name: sk-code
description: "Multi-stack coding standards and verification. Smart router auto-detects the active surface and loads matching code patterns."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.3.0.0
---

<!-- Keywords: sk-code, code workflows, smart-router, code-surface-detection, webflow, frontend, html, css, javascript, Motion.dev, motion-dev, motion_dev, cross-stack-animation, gsap, lenis, swiper, hls, filepond, opencode, system-code, mcp, typescript, python, shell, jsonc, code-quality, debugging-workflow, verification -->

# Code Workflows - Surface-Aware Smart Router

`sk-code` is the single code-work skill. It first decides which code surface is in front of it, then loads the right implementation, quality, debugging, and verification resources.

**Core principle**: `Code surface detection -> Intent classification -> Surface resources -> Verification evidence`.

---

## 1. WHEN TO USE

> **🎯 Template customization surface.** This is the **only** skill end users should edit when adopting this template repo for their own project. Replace the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's references and assets. Update `STACK_FOLDERS` (§2) + `RESOURCE_MAP` to match. Every other skill (`sk-doc`, `sk-git`, `sk-code-review`, `system-spec-kit`, `system-code-graph`, etc.) is codebase-agnostic and must stay that way to keep upstream pulls clean. See root [README §4 Customizing for Your Stack](../../../README.md#customizing-for-your-stack).

Use this skill when doing code work in either supported surface:

- **WEBFLOW**: Webflow / vanilla frontend work in HTML, CSS, and JavaScript, including Motion.dev runtime usage, GSAP, Lenis, HLS, Swiper, FilePond, CDN/minification, and browser verification.
- **OPENCODE**: OpenCode system work under `.opencode/`, including skills, agents, commands, MCP servers, hooks, scripts, tests, JSON/JSONC config, TypeScript, JavaScript, Python, and Shell.

Also use this skill for cross-stack Motion.dev reference work when the question is about Motion APIs, snippets, integration modes, performance pitfalls, or CSS/Motion/GSAP/WAAPI trade-offs that should live in `references/motion_dev/` or `assets/motion_dev/` rather than inside Webflow-only guidance.

Use it for implementation, code quality, debugging, verification, test failures, build failures, and before any completion claim.

Do **not** use this skill for documentation-only changes (`sk-doc`), git workflow (`sk-git`), pure browser inspection (`mcp-chrome-devtools`), or formal findings-first review output (`sk-code-review` baseline plus this skill's surface evidence).

Documentation-only edits to skill markdown route to `sk-doc`, even when the file lives under `.opencode/skills/`. Examples: updating a `SKILL.md` headline, clarifying a README paragraph, rewriting a description section, or adding a one-line summary at the top of a markdown file. Negative example: "Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary" is `sk-doc`, not `sk-code`, because the requested change is prose-only and does not modify executable behavior or routing logic.

### Phase Overview

| Phase | Purpose | Requirement |
| --- | --- | --- |
| Phase 0: Research | Understand unfamiliar code or risky changes | Optional, but required for complex work |
| Phase 1: Implementation | Write or modify code using surface patterns | Read actual files first |
| Phase 1.5: Code Quality Gate | Apply P0/P1/P2 checks and surface standards | Required before claiming implementation done |
| Phase 2: Debugging | Trace symptom to root cause and fix one cause at a time | Required when tests/runtime fail |
| Phase 3: Verification | Run surface verification commands and record evidence | Required before any done/works claim |

**Iron Law**: no completion claim without fresh verification evidence from the detected surface.

### Review Baseline Contract

`sk-code-review` owns findings format, severity model, and baseline security/quality/test review. `sk-code` owns surface detection and surface-specific standards evidence.

### Cross-Skill Consumption

When called from `/speckit:complete` with an `.opencode/` implementation target (`step_10_development` activity), `sk-code` surfaces the matching authoring checklist plus the `spec_folder_write` recipe AT WRITE-TIME (before the orchestrator's first write), not just at review-time.

| Target Path | Authoring Checklist Surfaced | Recipe |
|---|---|---|
| `.opencode/skills/` | `assets/opencode/checklists/skill_authoring.md` | — |
| `.opencode/agents/` | `assets/opencode/checklists/agent_authoring.md` | — |
| `.opencode/commands/` | `assets/opencode/checklists/command_authoring.md` | — |
| `.opencode/specs/` | `assets/opencode/checklists/spec_folder_authoring.md` | `assets/opencode/recipes/spec_folder_write.md` |
| MCP server source | `assets/opencode/checklists/mcp_server_authoring.md` | — |

Authoring-time load is the contract documented in `system-spec-kit/SKILL.md §16-17 cross-skill routing` and the `cross_skill_authoring_load` block in `/speckit:complete` YAMLs. Review-time `sk-code-review` baseline + `sk-code` router-selected evidence overlay remains unchanged.

---

## 2. SMART ROUTING

### Surface Detection (FIRST)

Detection is context-aware and uses CWD plus changed/target files. **Precedence**: OPENCODE target/CWD wins over WEBFLOW markers (because mixed-marker workspaces are common — `.opencode/` system tools sometimes ship frontend animation libraries internally). When neither matches, fall through to UNKNOWN.

Machine-readable stack folder contract:

```python
STACK_FOLDERS = {
    "WEBFLOW": ["src/2_javascript/", "*.webflow.js"],
    "OPENCODE": [".opencode/skills/", ".opencode/agents/", ".opencode/commands/", ".opencode/specs/"],
    "MOTION_DEV": ["references/motion_dev/", "assets/motion_dev/"],
}
```

```bash
# Use early-return precedence — never let later branches overwrite an earlier match.

# 1. OPENCODE - takes precedence: CWD or any changed/target file under .opencode/
if [[ "$PWD" == */.opencode/* ]] \
   || [[ "$TARGET_FILE" == */.opencode/* ]]; then
  SURFACE="OPENCODE"

# 2. Explicit non-Webflow guard - a prompt can ask for Motion.dev cross-stack
# guidance without making the implementation surface WEBFLOW.
elif printf '%s\n' "${PROMPT_TEXT:-}" | grep -Eiq \
     '(^|[^[:alnum:]])(not webflow|no webflow designer|without webflow|non-webflow|vanilla html/css/js only|vanilla html css js only|stack-agnostic)([^[:alnum:]]|$)'; then
  SURFACE="UNKNOWN"

# 3. WEBFLOW - frontend HTML/CSS/JS and Webflow-specific vanilla animation web
elif [[ -d "src/2_javascript" ]] \
     || ls *.webflow.js 2>/dev/null | head -1 \
     || grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null \
     || grep -lqE "window\.Motion|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
        src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null \
     || [[ -f "wrangler.toml" ]]; then
  SURFACE="WEBFLOW"

# 4. UNKNOWN - not owned by this skill; ask for runtime + verification commands
else
  SURFACE="UNKNOWN"
fi
```

**Why OPENCODE wins precedence**: `.opencode/skills/sk-doc/scripts/preview-server.js` is an OPENCODE system tool that may import vanilla animation libraries (Lenis, GSAP) for its preview UI. A first-match-WEBFLOW pseudocode would route this OPENCODE work to the wrong standards. The target/CWD path is the strongest unambiguous signal of which surface owns the work.

**Supported surfaces**:

- `WEBFLOW`: frontend HTML/CSS/JS, Webflow conventions, vanilla animation libraries, CDN/minification, and browser evidence.
- `OPENCODE`: `.opencode/` system code and config with language sub-detection.
- `UNKNOWN`: ask a short disambiguation question and do not pretend unsupported stacks are covered.

For details: `references/stack_detection.md`.

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect surface from CWD + target files (primary routing key)
    |    +- references/<surface>/  (webflow / opencode)
    |    +- assets/<surface>/      (webflow / opencode)
    |
    +- STEP 1: Detect language sub-key (OPENCODE only) for verification commands
    |
    +- STEP 2: Weighted intent scoring (top-2 when ambiguity delta is small)
    |
    +- Phase 1: Implementation -> per-language style + standards + implementation trio
    +- Phase 2: Debugging       -> debugging refs + universal error recovery
    +- Phase 3: Verification    -> surface-appropriate verification commands + checklist
```

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT RUNNING SURFACE-APPROPRIATE VERIFICATION.

Phase contract details: [`references/phase_detection.md`](./references/phase_detection.md).

### OPENCODE Language Sub-Detection

When surface is `OPENCODE`, detect language from changed/target file extensions first, then weighted keywords:

| Language | Extensions / Signals | Resources |
| --- | --- | --- |
| JAVASCRIPT | `.js`, `.mjs`, `.cjs`, CommonJS, Node, MCP | `references/opencode/javascript/*` |
| TYPESCRIPT | `.ts`, `.tsx`, `.mts`, `.d.ts`, tsconfig, interfaces | `references/opencode/typescript/*` |
| PYTHON | `.py`, pytest, argparse, docstrings | `references/opencode/python/*` |
| SHELL | `.sh`, `.bash`, shebang, pipefail | `references/opencode/shell/*` |
| CONFIG | `.json`, `.jsonc`, schema, descriptor | `references/opencode/config/*` |

Ambiguous multi-language tasks load the top matching language references plus the universal OpenCode checklist.

### Resource Domains

- `references/universal/`: surface-agnostic error recovery, code quality, style, and research guidance.
- `references/`: detection, intent scoring, loading, and lifecycle internals.
- `references/webflow/`, `assets/webflow/`: live Webflow/frontend per-language references under `references/webflow/{javascript,css,html}/*` — JS and CSS each carry `style_guide.md`, `quality_standards.md`, `quick_reference.md`; CSS additionally carries `patterns.md` (Webflow tokens, state machines, focus/form patterns); HTML carries `style_guide.md` only (Webflow Designer manages most HTML). Cross-language rules + enforcement workflow + dev workflow live under `references/webflow/shared/*`. Categorical workflow patterns (implementation, debugging, verification, performance, deployment) and copy-paste templates (`assets/webflow/templates/component_template.{js,css}`) round out the surface. Mirrors the OPENCODE per-language layout so the smart router resolves both surfaces with identical key-derived patterns.
- `references/motion_dev/`, `assets/motion_dev/`: cross-stack Motion.dev API, timeline, scroll/gesture, performance, decision-matrix, integration, install, playbook hook, and snippet resources. Webflow docs link here for generic Motion details while keeping Webflow-CDN and Designer guidance in `references/webflow/`.
- `references/opencode/`, `assets/opencode/`: OpenCode system-code language standards, shared patterns, hooks, alignment automation, and quality checklists.
- `assets/webflow/scripts/`: Webflow build, minification, and runtime verification utilities.
- `assets/scripts/`: Cross-surface helper scripts, including the OpenCode alignment verifier.

### OpenCode Authoring Resources

| Resource | Path | When to load |
|---|---|---|
| skill_authoring | `assets/opencode/checklists/skill_authoring.md` | CONDITIONAL (intent: authoring new skill) |
| agent_authoring | `assets/opencode/checklists/agent_authoring.md` | CONDITIONAL (intent: authoring new agent) |
| command_authoring | `assets/opencode/checklists/command_authoring.md` | CONDITIONAL (intent: authoring new command) |
| mcp_server_authoring | `assets/opencode/checklists/mcp_server_authoring.md` | CONDITIONAL (intent: authoring MCP server) |
| spec_folder_authoring | `assets/opencode/checklists/spec_folder_authoring.md` | CONDITIONAL (intent: spec folder write) |
| spec_folder_write recipe | `assets/opencode/recipes/spec_folder_write.md` | CONDITIONAL (intent: spec folder write) |

### Intent Classification

After surface detection, score task text for intents: `IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `TESTING`, `DEPLOYMENT`, `PERFORMANCE`, `ANIMATION`, `MOTION_DEV`, `FORMS`, `VIDEO`, `API`, `HOOKS`, `CONFIG`, and `LANGUAGE_STANDARDS`.

Top intent always loads. A close second intent also loads when scores are within the ambiguity threshold.

`MOTION_DEV` is a resource intent, not a third code surface. It loads `references/motion_dev/` and `assets/motion_dev/` for cross-stack Motion questions after WEBFLOW/OPENCODE/UNKNOWN surface handling has established where implementation work is happening.

### Verification Commands

| Surface | Required verification evidence |
| --- | --- |
| WEBFLOW | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs`, `node .opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs`, `node .opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs`, plus desktop/mobile browser console clean evidence when runtime behavior changes |
| OPENCODE | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>`, plus targeted language/project tests such as vitest, pytest, shellcheck, JSON validation, or spec validation for changed spec folders |
| UNKNOWN | User-selected verification command set before completion claim |

### Smart Router Pseudocode

Smart Router pseudocode (full implementation): see [`references/smart_routing.md`](./references/smart_routing.md) for the authoritative `INTENT_MODEL`, `RESOURCE_MAP`, load tiers, and surface→intent routing logic.

---

## 3. HOW IT WORKS

### WEBFLOW Workflow

1. Detect frontend/Webflow markers before generic package markers.
2. Load Webflow implementation, debugging, verification, performance, and vendor-specific resources by intent.
3. Verify with build/minification scripts and browser evidence when behavior changes.
4. Update CDN/versioning guidance after JavaScript bundle changes.
5. For Motion API or decision questions, load `references/motion_dev/` as the cross-stack peer reference and keep Webflow-specific CDN guidance in `references/webflow/`.

### OPENCODE Workflow

1. Detect `.opencode/` context from CWD or target files.
2. Detect language from file extension first, then keyword scores.
3. Load shared OpenCode patterns, language standards, quick references, and checklists.
4. Run the alignment verifier and targeted tests before completion claims.
5. Use `sk-code-review` for formal findings-first review; use this skill for standards evidence.

### UNKNOWN Workflow


codex
I’ve loaded the relevant skill guidance. Now I’m pulling the commit’s file list and the named diffs, then I’ll pick additional high-risk roots rather than scanning only the suggested examples.
exec
/bin/zsh -lc 'git show --stat 1e58d845af | head -40' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'git show --name-only --format= 1e58d845af' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'git show --format=short --find-renames=0 -- .opencode/skills/cli-gemini/README.md .opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md .opencode/skills/deep-research/feature_catalog/feature_catalog.md .opencode/skills/system-skill-advisor/README.md .opencode/skills/deep-loop-runtime/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2216ms:
2026-05-26 12:40:24.275 xcodebuild[49397:53674214]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:24.515 xcodebuild[49397:53674210] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-N8aqckkk' (errno=Operation not permitted)
2026-05-26 12:40:25.013 xcodebuild[49418:53674280]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:25.139 xcodebuild[49418:53674277] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
commit 1e58d845af44255e32e071b3d69d1c19e76d4ac6
Author: MichelKerkmeester <82775228+MichelKerkmeester@users.noreply.github.com>

    docs(117): remove TOC blocks + HTML anchor comments from skill docs

diff --git a/.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md b/.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md
index d5eb201e81..c6415cf1d6 100644
--- a/.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md
+++ b/.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md
@@ -29,28 +29,6 @@ Canonical package artifacts:
 
 ---
 
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
-- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
-- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
-- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
-- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
-- [7. CLI INVOCATION (`CX-001..CX-004`)](#7--cli-invocation-cx-001cx-004)
-- [8. SANDBOX MODES (`CX-005..CX-008`)](#8--sandbox-modes-cx-005cx-008)
-- [9. REASONING EFFORT (`CX-009..CX-011`)](#9--reasoning-effort-cx-009cx-011)
-- [10. AGENT ROUTING (`CX-012..CX-015`, `CX-026..CX-027`)](#10--agent-routing-cx-012cx-015-cx-026cx-027)
-- [11. SESSION CONTINUITY (`CX-016..CX-017`)](#11--session-continuity-cx-016cx-017)
-- [12. INTEGRATION PATTERNS (`CX-018..CX-020`)](#12--integration-patterns-cx-018cx-020)
-- [13. PROMPT TEMPLATES (`CX-021..CX-022`)](#13--prompt-templates-cx-021cx-022)
-- [14. BUILT-IN TOOLS (`CX-023..CX-025`)](#14--built-in-tools-cx-023cx-025)
-- [15. CODEX CLOUD (`CX-028`)](#15--codex-cloud-cx-028)
-- [16. AUTOMATED TEST CROSS-REFERENCE](#16--automated-test-cross-reference)
-- [17. FEATURE CATALOG CROSS-REFERENCE INDEX](#17--feature-catalog-cross-reference-index)
-
----
-
 ## 1. OVERVIEW
 
 This playbook provides 28 deterministic scenarios across 9 categories validating the `cli-codex` skill surface. Each feature keeps its global `CX-NNN` ID and links to a dedicated feature file with the full execution contract.
@@ -506,7 +484,6 @@ Desired user-visible outcome: A citation-backed comparison brief the operator ca
 
 > **Feature File:** [CX-026](04--agent-routing/005-research-profile.md)
 
-
 ## 11. SESSION CONTINUITY (`CX-016..CX-017`)
 
 This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.
diff --git a/.opencode/skills/cli-gemini/README.md b/.opencode/skills/cli-gemini/README.md
index 76b545fb19..70d71d97ab 100644
--- a/.opencode/skills/cli-gemini/README.md
+++ b/.opencode/skills/cli-gemini/README.md
@@ -15,27 +15,6 @@ trigger_phrases:
 
 ---
 
-<!-- ANCHOR:table-of-contents -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. QUICK START](#2--quick-start)
-- [3. FEATURES](#3--features)
-  - [3.1 FEATURE HIGHLIGHTS](#31--feature-highlights)
-  - [3.2 FEATURE REFERENCE](#32--feature-reference)
-  - [3.3 CLI COMPARISON](#33--cli-comparison)
-- [4. STRUCTURE](#4--structure)
-- [5. CONFIGURATION](#5--configuration)
-- [6. USAGE EXAMPLES](#6--usage-examples)
-- [7. TROUBLESHOOTING](#7--troubleshooting)
-- [8. FAQ](#8--faq)
-- [9. RELATED DOCUMENTS](#9--related-documents)
-
-<!-- /ANCHOR:table-of-contents -->
-
----
-
-<!-- ANCHOR:overview -->
 ## 1. OVERVIEW
 
 ### What This Skill Does
@@ -68,11 +47,8 @@ Gemini CLI supports one model (gemini-3.1-pro-preview) and provides three built-
 
 Install the `@google/gemini-cli` package via npm. Authentication uses Google OAuth for free tier access, or `GEMINI_API_KEY` and Vertex AI for enterprise use. Node.js 18 or higher is required for npm installation.
 
-<!-- /ANCHOR:overview -->
-
 ---
 
-<!-- ANCHOR:quick-start -->
 ## 2. QUICK START
 
 ### 1. Verify Installation
@@ -100,11 +76,8 @@ gemini "Explain the architecture of this project" -o text 2>&1
 gemini "What's new in React 19? Use Google Search." -o text 2>&1
 ```
 
-<!-- /ANCHOR:quick-start -->
-
 ---
 
-<!-- ANCHOR:features -->
 ## 3. FEATURES
 
 ### 3.1 FEATURE HIGHLIGHTS
@@ -173,11 +146,8 @@ The free tier removes the cost barrier for exploratory use. Google OAuth gives y
 | **Open source** | No | No | No | Yes (Apache 2.0) |
 | **Models** | 3 (Anthropic) | 2 (OpenAI) | 5 (3 providers) | 1 (Google) |
 
-<!-- /ANCHOR:features -->
-
 ---
 
-<!-- ANCHOR:structure -->
 ## 4. STRUCTURE
 
 ```text
@@ -193,11 +163,8 @@ cli-gemini/
     integration_patterns.md             # Cross-AI orchestration workflows
 ```
 
-<!-- /ANCHOR:structure -->
-
 ---
 
-<!-- ANCHOR:configuration -->
 ## 5. CONFIGURATION
 
 ### Authentication
@@ -236,11 +203,8 @@ dist/
 | `GEMINI_API_KEY` | API key authentication | `export GEMINI_API_KEY=key` |
 | `GEMINI_MODEL` | Default model override | `gemini-3.1-pro-preview` |
 
-<!-- /ANCHOR:configuration -->
-
 ---
 
-<!-- ANCHOR:usage-examples -->
 ## 6. USAGE EXAMPLES
 
 ### Web Research with Google Search
@@ -271,11 +235,8 @@ gemini "Generate JSDoc for all exported functions in src/utils/" --yolo -o text
 wait
 ```
 
-<!-- /ANCHOR:usage-examples -->
-
 ---
 
-<!-- ANCHOR:troubleshooting -->
 ## 7. TROUBLESHOOTING
 
 ### Gemini CLI Not Found
@@ -302,11 +263,8 @@ wait
 **Common causes**: Too many files loaded via `@` references.
 **Fix**: Use `.geminiignore` to exclude large directories (node_modules, dist). Specify files explicitly rather than using broad directory references.
 
-<!-- /ANCHOR:troubleshooting -->
-
 ---
 
-<!-- ANCHOR:faq -->
 ## 8. FAQ
 
 ### General
@@ -333,11 +291,8 @@ A: Codex `--search` opens a browsing session where the agent navigates web pages
 **Q: Can I disable built-in tools?**
 A: The tools activate based on prompt content. If you do not mention web search or codebase analysis, the tools do not run. There is no explicit disable flag.
 
-<!-- /ANCHOR:faq -->
-
 ---
 
-<!-- ANCHOR:related-documents -->
 ## 9. RELATED DOCUMENTS
 
 ### Skill Resources
@@ -351,5 +306,3 @@ A: The tools activate based on prompt content. If you do not mention web search
 ### Related Skills
 - [cli-claude-code](../cli-claude-code/): Anthropic Claude Code CLI orchestrator
 - [cli-codex](../cli-codex/): OpenAI Codex CLI orchestrator
-
-<!-- /ANCHOR:related-documents -->
diff --git a/.opencode/skills/deep-loop-runtime/README.md b/.opencode/skills/deep-loop-runtime/README.md
index 06cc799875..939a8a62d6 100644
--- a/.opencode/skills/deep-loop-runtime/README.md
+++ b/.opencode/skills/deep-loop-runtime/README.md
@@ -26,30 +26,6 @@ contextType: "general"
 
 ---
 
-<!-- ANCHOR:toc -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. QUICK START](#2--quick-start)
-- [3. FEATURES](#3--features)
-  - [3.1 EXECUTOR AND PROMPT](#31--executor-and-prompt)
-  - [3.2 STATE SAFETY](#32--state-safety)
-  - [3.3 SCORING AND ROUTING](#33--scoring-and-routing)
-  - [3.4 COVERAGE GRAPH](#34--coverage-graph)
-  - [3.5 COUNCIL PRIMITIVES](#35--council-primitives)
-  - [3.6 SCRIPT ENTRY POINTS](#36--script-entry-points)
-  - [3.7 STORAGE](#37--storage)
-- [4. STRUCTURE](#4--structure)
-- [5. CONFIGURATION](#5--configuration)
-- [6. USAGE EXAMPLES](#6--usage-examples)
-- [7. TROUBLESHOOTING](#7--troubleshooting)
-- [8. FAQ](#8--faq)
-- [9. RELATED DOCUMENTS](#9--related-documents)
-<!-- /ANCHOR:toc -->
-
----
-
-<!-- ANCHOR:overview -->
 ## 1. OVERVIEW
 
 ### What Deep Loop Runtime Does
@@ -89,11 +65,9 @@ The FULL_ISOLATE_NO_MCP consolidation (a user-directive override of an earlier A
 - SQLite available through `better-sqlite3` (installed at the workspace root via `pnpm`).
 - Vitest configured in the consuming workspace (`system-spec-kit/mcp_server/vitest.config.ts` globs this skill's `tests/`).
 - Workflow YAMLs that call this skill use `bash:` blocks. No MCP tool dependency.
-<!-- /ANCHOR:overview -->
 
 ---
 
-<!-- ANCHOR:quick-start -->
 ## 2. QUICK START
 
 ### Invoke from a workflow YAML (the canonical path)
@@ -135,11 +109,9 @@ pnpm vitest run .opencode/skills/deep-loop-runtime/tests
 ```
 
 The `system-spec-kit/mcp_server/vitest.config.ts` glob picks these up alongside the spec-kit suite.
-<!-- /ANCHOR:quick-start -->
 
 ---
 
-<!-- ANCHOR:features -->
 ## 3. FEATURES
 
 This section catalogues the runtime surface. Each subsection lists the modules in that domain, what each module does and which consumer skill relies on it.
@@ -227,11 +199,9 @@ Common argv (`--spec-folder`, `--loop-type review|research`, `--session-id`) plu
 Runtime-owned SQLite database at `database/deep-loop-graph.sqlite`. Schema version 2. Owned exclusively by `lib/coverage-graph/coverage-graph-db.ts` (per the ALWAYS rule in SKILL.md §4 RULES). No other module opens this connection.
 
 The database is session-scoped through node and edge tagging, not through per-session files. One database holds graphs for every active session.
-<!-- /ANCHOR:features -->
 
 ---
 
-<!-- ANCHOR:structure -->
 ## 4. STRUCTURE
 
 ```text
@@ -275,11 +245,9 @@ The database is session-scoped through node and edge tagging, not through per-se
 ```
 
 Total: 79 files, 15,645 lines across runtime + tests + docs.
-<!-- /ANCHOR:structure -->
 
 ---
 
-<!-- ANCHOR:configuration -->
 ## 5. CONFIGURATION
 
 ### Environment variables
@@ -315,11 +283,9 @@ The SQLite schema enforces an allow-list of node kinds. Adding a new kind requir
 ### Where there is no config knob
 
 Atomic-state semantics, loop-lock behavior, permissions-gate checks and Bayesian-scorer weights are not user-configurable through env vars. They are runtime invariants. Changing them requires a new packet with an ADR.
-<!-- /ANCHOR:configuration -->
 
 ---
 
-<!-- ANCHOR:usage-examples -->
 ## 6. USAGE EXAMPLES
 
 ### Workflow YAML call (deep-review convergence check)
@@ -367,11 +333,9 @@ try {
   await releaseLoopLock(lock);
 }
 ```
-<!-- /ANCHOR:usage-examples -->
 
 ---
 
-<!-- ANCHOR:troubleshooting -->
 ## 7. TROUBLESHOOTING
 
 ### Script exits with code 2 (DB error)
@@ -393,11 +357,9 @@ The novelty signal is not dropping. Check `lib/deep-loop/bayesian-scorer.ts` for
 ### Tests fail with "table coverage_nodes not found"
 
 The runtime test runner expects a fresh per-test SQLite database. Confirm the test imports `coverage-graph-db.ts` and calls the init helper before asserting on tables. If running against a real DB by mistake, set `DEEP_LOOP_DB_PATH` to a tmp path in the test setup.
-<!-- /ANCHOR:troubleshooting -->
 
 ---
 
-<!-- ANCHOR:faq -->
 ## 8. FAQ
 
 **Q: Does this skill expose MCP tools?**
@@ -427,11 +389,9 @@ Removed. The only retained test in the old location is `mcp_server/tests/deep-lo
 **Q: Why does the SKILL.md exist alongside this README?**
 
 The SKILL.md is the operational contract loaded by AI agents at routing time (smart routing, rules, runtime architecture). This README is the human-facing introduction. The two are complementary, not duplicative. SKILL.md §1 redirects readers here for layout and history.
-<!-- /ANCHOR:faq -->
 
 ---
 
-<!-- ANCHOR:related -->
 ## 9. RELATED DOCUMENTS
 
 ### Within this skill
@@ -470,4 +430,3 @@ Release history and the consolidation rationale (including the superseded AI Cou
 | [`.opencode/skills/README.md`](../README.md) | Skills library index (deep-loop-runtime listed as peer in the deep-loop-skills family) |
 | [`.opencode/skills/system-spec-kit/README.md`](../system-spec-kit/README.md) | System spec-kit (consumes deep-loop-runtime through cross-package vitest glob) |
 | [`Public/README.md`](../../../README.md) | Project root README (tone anchor for skill READMEs) |
-<!-- /ANCHOR:related -->
diff --git a/.opencode/skills/deep-research/feature_catalog/feature_catalog.md b/.opencode/skills/deep-research/feature_catalog/feature_catalog.md
index 74f584d2bc..44e15ce290 100644
--- a/.opencode/skills/deep-research/feature_catalog/feature_catalog.md
+++ b/.opencode/skills/deep-research/feature_catalog/feature_catalog.md
@@ -9,16 +9,6 @@ This document combines the current feature inventory for the `deep-research` sys
 
 ---
 
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. LOOP LIFECYCLE](#2--loop-lifecycle)
-- [3. STATE MANAGEMENT](#3--state-management)
-- [4. CONVERGENCE](#4--convergence)
-- [5. RESEARCH OUTPUT](#5--research-output)
-
----
-
 ## 1. OVERVIEW
 
 Use this catalog as the canonical inventory for the live `deep-research` feature surface. The numbered sections below group the system by capability area so readers can move from a top-level summary into per-feature reference files without losing the implementation and validation context behind each loop behavior.
diff --git a/.opencode/skills/system-skill-advisor/README.md b/.opencode/skills/system-skill-advisor/README.md
index a468bffa54..fce9c820c8 100644
--- a/.opencode/skills/system-skill-advisor/README.md
+++ b/.opencode/skills/system-skill-advisor/README.md
@@ -18,24 +18,6 @@ trigger_phrases:
 
 ---
 
-<!-- ANCHOR:table-of-contents -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. QUICK START](#2--quick-start)
-- [3. FEATURES](#3--features)
-- [4. STRUCTURE](#4--structure)
-- [5. CONFIGURATION](#5--configuration)
-- [6. USAGE EXAMPLES](#6--usage-examples)
-- [7. TROUBLESHOOTING](#7--troubleshooting)
-- [8. FAQ](#8--faq)
-- [9. RELATED DOCUMENTS](#9--related-documents)
-
-<!-- /ANCHOR:table-of-contents -->
-
----
-
-<!-- ANCHOR:overview -->
 ## 1. OVERVIEW
 
 ### Purpose
@@ -59,11 +41,8 @@ The advisor is the canonical Gate 2 routing surface. Call `advisor_recommend` to
 - **Python compatibility shim**. `skill_advisor.py` keeps scripts and hooks working when the native MCP path is not reachable.
 - **Standalone process boundary**. Runs as its own MCP server so you can stop, restart or roll back routing without touching adjacent runtimes.
 
-<!-- /ANCHOR:overview -->
-
 ---
 
-<!-- ANCHOR:quick-start -->
 ## 2. QUICK START
 
 **Step 1: Check advisor health.**
@@ -101,11 +80,8 @@ npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
 
 Expected result: TypeScript exits `0` and the package builds cleanly.
 
-<!-- /ANCHOR:quick-start -->
-
 ---
 
-<!-- ANCHOR:features -->
 ## 3. FEATURES
 
 ### 3.1 FEATURE HIGHLIGHTS
@@ -128,7 +104,6 @@ Routing is fail-open. When the native MCP path is unreachable the Python `skill_
 | `skill_graph_validate` | Validate the live skill graph for schema drift, broken edges, reciprocal symmetry, dependency cycles. | `mcp_server/handlers/skill-graph/validate.ts` |
 | `skill_graph_propagate_enhances` (internal) | Detect, propose, optionally apply missing inbound `enhances` edges across skills. Trusted-caller gated. | `mcp_server/handlers/skill-graph/propagate-enhances.ts` |
 
-
 ### 3.3 SCORER LANES
 
 | Lane | Live Weight | Role |
@@ -152,11 +127,8 @@ Weights live in `mcp_server/lib/scorer/lane-registry.ts`. Changes require measur
 
 A daemon watches `.opencode/skills/*/SKILL.md` and `graph-metadata.json` files and bumps generation when sources change. The cache invalidates on generation bump.
 
-<!-- /ANCHOR:features -->
-
 ---
 
-<!-- ANCHOR:structure -->
 ## 4. STRUCTURE
 
 ```text
@@ -205,11 +177,8 @@ system-skill-advisor/
 | [references/scoring/advisor_scorer.md](./references/scoring/advisor_scorer.md) | Lane attribution model and fusion rules. |
 | [references/hooks/skill_advisor_hook.md](./references/hooks/skill_advisor_hook.md) | Runtime hook contract for Claude, Codex, Gemini, Devin, OpenCode. |
 
-<!-- /ANCHOR:structure -->
-
 ---
 
-<!-- ANCHOR:configuration -->
 ## 5. CONFIGURATION
 
 | Setting | Default | Purpose |
@@ -236,11 +205,8 @@ The TS shared cascade is text-tuned by design; a `contentType: 'text' \| 'code'`
 
 See [INSTALL_GUIDE.md §12 "Choosing an embedder"](./INSTALL_GUIDE.md#12--choosing-an-embedder) for the cascade tier table, swap workflow, and content-type rationale. See [`embedder_pluggability.md`](../system-spec-kit/references/memory/embedder_pluggability.md) for the canonical shared-embedder narrative covering mk-spec-memory alongside skill-advisor.
 
-<!-- /ANCHOR:configuration -->
-
 ---
 
-<!-- ANCHOR:usage-examples -->
 ## 6. USAGE EXAMPLES
 
 **Pick a skill for a non-trivial prompt**
@@ -279,11 +245,8 @@ Arguments: { "mode": "report", "minConfidence": 0.6 }
 Expected output: candidates.detected[] with proposed inbound enhances edges, confidenceScores, dryRun=true.
 ```
 
-<!-- /ANCHOR:usage-examples -->
-
 ---
 
-<!-- ANCHOR:troubleshooting -->
 ## 7. TROUBLESHOOTING
 
 | What You See | Cause | Fix |
@@ -296,11 +259,8 @@ Expected output: candidates.detected[] with proposed inbound enhances edges, con
 | Recommendations omit a newly-added skill | The advisor reads metadata at every call, but the daemon may not have observed the new file yet. | Call `advisor_rebuild` or wait for the watcher to fire. |
 | Devin hook does not disable with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Devin hook checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first. | Set `MK_SKILL_ADVISOR_HOOK_DISABLED=1` for Devin or set both variables. |
 
-<!-- /ANCHOR:troubleshooting -->
-
 ---
 
-<!-- ANCHOR:faq -->
 ## 8. FAQ
 
 **Q: Why is the advisor a separate MCP server instead of part of `mk-spec-memory`?**
@@ -323,11 +283,8 @@ A: Memory, spec folders, continuity stay in `system-spec-kit`. The advisor depen
 
 A: See [references/hooks/skill_advisor_hook.md](./references/hooks/skill_advisor_hook.md) for the advisor hook contract across Claude, Codex, Gemini, Devin plus the OpenCode plugin.
 
-<!-- /ANCHOR:faq -->
-
 ---
 
-<!-- ANCHOR:related-documents -->
 ## 9. RELATED DOCUMENTS
 
 | Document | Purpose |
@@ -357,5 +314,3 @@ A: See [references/hooks/skill_advisor_hook.md](./references/hooks/skill_advisor
 | [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenario index. |
 | [changelog/v0.2.0.md](./changelog/v0.2.0.md) | v0.2.0 production isolation from system-spec-kit. |
 | [Embedder pluggability narrative](../system-spec-kit/references/memory/embedder_pluggability.md) | Canonical shared-embedder reference used by mk-spec-memory and skill-advisor. |
-
-<!-- /ANCHOR:related-documents -->

 succeeded in 2285ms:
2026-05-26 12:40:24.275 xcodebuild[49398:53674215]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:24.515 xcodebuild[49398:53674212] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-HYYJDv8k' (errno=Operation not permitted)
2026-05-26 12:40:25.013 xcodebuild[49417:53674282]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:25.139 xcodebuild[49417:53674278] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/README.txt
.opencode/commands/create/assets/create_feature_catalog_auto.yaml
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml
.opencode/commands/create/assets/create_folder_readme_auto.yaml
.opencode/commands/create/assets/create_folder_readme_confirm.yaml
.opencode/commands/create/assets/create_testing_playbook_auto.yaml
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml
.opencode/commands/create/feature-catalog.md
.opencode/commands/create/folder_readme.md
.opencode/commands/create/testing-playbook.md
.opencode/skills/README.md
.opencode/skills/cli-claude-code/README.md
.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-codex/README.md
.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-devin/README.md
.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-gemini/README.md
.opencode/skills/cli-gemini/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-opencode/README.md
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-agent-improvement/README.md
.opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md
.opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-agent-improvement/scripts/README.md
.opencode/skills/deep-agent-improvement/scripts/lib/README.md
.opencode/skills/deep-agent-improvement/scripts/tests/README.md
.opencode/skills/deep-ai-council/README.md
.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md
.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-ai-council/scripts/README.md
.opencode/skills/deep-ai-council/scripts/lib/README.md
.opencode/skills/deep-ai-council/scripts/tests/README.md
.opencode/skills/deep-loop-runtime/README.md
.opencode/skills/deep-loop-runtime/database/README.md
.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/01-executor-config.md
.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/02-executor-audit.md
.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/03-fallback-router.md
.opencode/skills/deep-loop-runtime/feature_catalog/02--prompt-rendering/01-prompt-pack.md
.opencode/skills/deep-loop-runtime/feature_catalog/03--validation/01-post-dispatch-validate.md
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/01-atomic-state.md
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/02-jsonl-repair.md
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/03-loop-lock.md
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/04-permissions-gate.md
.opencode/skills/deep-loop-runtime/feature_catalog/05--scoring/01-bayesian-scorer.md
.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/01-coverage-graph-db.md
.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/02-coverage-graph-query.md
.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/03-coverage-graph-signals.md
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/01-convergence-script.md
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/02-upsert-script.md
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/03-query-script.md
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/04-status-script.md
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/01-multi-seat-dispatch.md
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/02-round-state-jsonl.md
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/03-adjudicator-verdict-scoring.md
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/04-cost-guards.md
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/05-session-state-hierarchy.md
.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md
.opencode/skills/deep-loop-runtime/lib/README.md
.opencode/skills/deep-loop-runtime/lib/council/README.md
.opencode/skills/deep-loop-runtime/lib/coverage-graph/README.md
.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-loop-runtime/scripts/README.md
.opencode/skills/deep-loop-runtime/tests/README.md
.opencode/skills/deep-loop-runtime/tests/council/README.md
.opencode/skills/deep-loop-runtime/tests/fixtures/council-value/README.md
.opencode/skills/deep-loop-runtime/tests/fixtures/council-value/data/README.md
.opencode/skills/deep-loop-runtime/tests/helpers/README.md
.opencode/skills/deep-loop-runtime/tests/integration/README.md
.opencode/skills/deep-loop-runtime/tests/lifecycle/README.md
.opencode/skills/deep-loop-runtime/tests/unit/README.md
.opencode/skills/deep-research/README.md
.opencode/skills/deep-research/feature_catalog/feature_catalog.md
.opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-research/scripts/README.md
.opencode/skills/deep-review/README.md
.opencode/skills/deep-review/feature_catalog/feature_catalog.md
.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-review/scripts/README.md
.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md
.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md
.opencode/skills/mcp-chrome-devtools/README.md
.opencode/skills/mcp-chrome-devtools/examples/README.md
.opencode/skills/mcp-chrome-devtools/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
.opencode/skills/mcp-code-mode/README.md
.opencode/skills/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/mcp-code-mode/scripts/README.md
.opencode/skills/sk-code-review/README.md
.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-code/README.md
.opencode/skills/sk-code/SKILL.md
.opencode/skills/sk-code/assets/motion_dev/snippets/README.md
.opencode/skills/sk-code/assets/scripts/README.md
.opencode/skills/sk-code/assets/universal/patterns/README.md
.opencode/skills/sk-code/assets/webflow/integrations/README.md
.opencode/skills/sk-code/assets/webflow/patterns/README.md
.opencode/skills/sk-code/assets/webflow/scripts/README.md
.opencode/skills/sk-code/assets/webflow/templates/README.md
.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-code/references/universal/error_recovery.md
.opencode/skills/sk-doc/README.md
.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
.opencode/skills/sk-doc/assets/benchmark/source_template.md
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
.opencode/skills/sk-doc/assets/readme/install_guide_template.md
.opencode/skills/sk-doc/assets/readme/readme_code_template.md
.opencode/skills/sk-doc/assets/readme/readme_template.md
.opencode/skills/sk-doc/assets/skill/skill_readme_template.md
.opencode/skills/sk-doc/assets/template_rules.json
.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md
.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-doc/references/benchmark_creation.md
.opencode/skills/sk-doc/references/feature_catalog_creation.md
.opencode/skills/sk-doc/references/global/core_standards.md
.opencode/skills/sk-doc/references/global/workflows.md
.opencode/skills/sk-doc/references/install_guide_creation.md
.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md
.opencode/skills/sk-doc/references/readme_creation.md
.opencode/skills/sk-doc/scripts/README.md
.opencode/skills/sk-doc/scripts/tests/test_validator.py
.opencode/skills/sk-git/README.md
.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-prompt-small-model/README.md
.opencode/skills/sk-prompt/README.md
.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-code-graph/ARCHITECTURE.md
.opencode/skills/system-code-graph/INSTALL_GUIDE.md
.opencode/skills/system-code-graph/README.md
.opencode/skills/system-code-graph/SKILL.md
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/02-query-self-heal.md
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/01-code-graph-scan.md
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/02-code-graph-verify.md
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/03-code-graph-status.md
.opencode/skills/system-code-graph/feature_catalog/03--detect-changes/01-detect-changes-preflight.md
.opencode/skills/system-code-graph/feature_catalog/04--context-retrieval/01-code-graph-context.md
.opencode/skills/system-code-graph/feature_catalog/04--context-retrieval/02-context-handler.md
.opencode/skills/system-code-graph/feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md
.opencode/skills/system-code-graph/feature_catalog/05--coverage-graph/02-deep-loop-graph-status.md
.opencode/skills/system-code-graph/feature_catalog/05--coverage-graph/03-deep-loop-graph-upsert.md
.opencode/skills/system-code-graph/feature_catalog/05--coverage-graph/04-deep-loop-graph-convergence.md
.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/01-tool-registrations.md
.opencode/skills/system-code-graph/feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-code-graph/mcp_server/README.md
.opencode/skills/system-code-graph/mcp_server/core/README.md
.opencode/skills/system-code-graph/mcp_server/handlers/README.md
.opencode/skills/system-code-graph/mcp_server/lib/README.md
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md
.opencode/skills/system-code-graph/mcp_server/lib/shared/README.md
.opencode/skills/system-code-graph/mcp_server/lib/utils/README.md
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md
.opencode/skills/system-code-graph/mcp_server/tests/README.md
.opencode/skills/system-code-graph/mcp_server/tests/__fixtures__/README.md
.opencode/skills/system-code-graph/mcp_server/tests/assets/README.md
.opencode/skills/system-code-graph/mcp_server/tests/handlers/README.md
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md
.opencode/skills/system-code-graph/mcp_server/tools/README.md
.opencode/skills/system-code-graph/references/config/database_path_policy.md
.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md
.opencode/skills/system-code-graph/references/runtime/naming_conventions.md
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md
.opencode/skills/system-code-graph/references/runtime/tool_surface.md
.opencode/skills/system-skill-advisor/ARCHITECTURE.md
.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md
.opencode/skills/system-skill-advisor/README.md
.opencode/skills/system-skill-advisor/SKILL.md
.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md
.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/02-lease.md
.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/03-lifecycle.md
.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/04-generation.md
.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/05-trust-state.md
.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/06-rebuild-from-source.md
.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/07-cache-invalidation.md
.opencode/skills/system-skill-advisor/feature_catalog/02--auto-indexing/01-derived-extraction.md
.opencode/skills/system-skill-advisor/feature_catalog/02--auto-indexing/02-sanitizer.md
.opencode/skills/system-skill-advisor/feature_catalog/02--auto-indexing/03-provenance-and-trust-lanes.md
.opencode/skills/system-skill-advisor/feature_catalog/02--auto-indexing/04-sync.md
.opencode/skills/system-skill-advisor/feature_catalog/02--auto-indexing/05-anti-stuffing.md
.opencode/skills/system-skill-advisor/feature_catalog/02--auto-indexing/06-df-idf-corpus.md
.opencode/skills/system-skill-advisor/feature_catalog/03--lifecycle-routing/01-age-haircut.md
.opencode/skills/system-skill-advisor/feature_catalog/03--lifecycle-routing/02-supersession.md
.opencode/skills/system-skill-advisor/feature_catalog/03--lifecycle-routing/03-archive-handling.md
.opencode/skills/system-skill-advisor/feature_catalog/03--lifecycle-routing/04-schema-migration.md
.opencode/skills/system-skill-advisor/feature_catalog/03--lifecycle-routing/05-rollback.md
.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/01-five-lane-fusion.md
.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/02-projection.md
.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/03-ambiguity.md
.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/04-attribution.md
.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/05-ablation.md
.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/06-weights-config.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/02-advisor-status.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/04-compat-entrypoint.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/05-advisor-rebuild.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/06-skill-graph-scan.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/07-skill-graph-query.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/08-skill-graph-status.md
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/09-skill-graph-validate.md
.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/01-claude-hook.md
.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/03-gemini-hook.md
.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/04-codex-hook.md
.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md
.opencode/skills/system-skill-advisor/feature_catalog/08--python-compat/01-cli-shim.md
.opencode/skills/system-skill-advisor/feature_catalog/08--python-compat/02-regression-suite.md
.opencode/skills/system-skill-advisor/feature_catalog/08--python-compat/03-bench-runner.md
.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md
.opencode/skills/system-skill-advisor/hooks/claude/README.md
.opencode/skills/system-skill-advisor/hooks/codex/README.md
.opencode/skills/system-skill-advisor/hooks/codex/lib/README.md
.opencode/skills/system-skill-advisor/hooks/gemini/README.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/002-native-status-transitions.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/006-advisor-status-rebuild-separation.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/001-claude-user-prompt-submit.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/003-gemini-user-prompt-submit.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/004-codex-hook-and-wrapper.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/006-devin-user-prompt-submit.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/03--compat-and-disable/001-python-shim-stdin.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/03--compat-and-disable/002-force-local-force-native.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/03--compat-and-disable/003-global-disable-flag.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/03--compat-and-disable/004-daemon-absent-fallback.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/04--operator-h5/001-degraded-daemon.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/04--operator-h5/002-quarantined-daemon.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/05--auto-update-daemon/001-watcher-narrow-scope.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/05--auto-update-daemon/002-lease-single-writer.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/05--auto-update-daemon/003-daemon-lifecycle-shutdown.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/05--auto-update-daemon/004-generation-publication.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/05--auto-update-daemon/005-rebuild-from-source.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/06--auto-indexing/001-derived-extraction.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/06--auto-indexing/002-sanitizer-boundaries.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/06--auto-indexing/003-provenance-and-trust-lanes.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/06--auto-indexing/004-corpus-df-idf.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/06--auto-indexing/005-anti-stuffing.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/07--lifecycle-routing/001-age-haircut.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/07--lifecycle-routing/002-supersession.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/07--lifecycle-routing/003-archive-handling.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/07--lifecycle-routing/004-schema-migration.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/07--lifecycle-routing/005-rollback-lifecycle.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/001-five-lane-fusion.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/002-projection.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/003-ambiguity.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/004-lane-attribution.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/005-ablation.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/001-stdin-mode.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/002-force-native-force-local.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/003-threshold-flag.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/004-regression-suite.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-skill-advisor/mcp_server/README.md
.opencode/skills/system-skill-advisor/mcp_server/bench/README.md
.opencode/skills/system-skill-advisor/mcp_server/compat/README.md
.opencode/skills/system-skill-advisor/mcp_server/data/README.md
.opencode/skills/system-skill-advisor/mcp_server/database/README.md
.opencode/skills/system-skill-advisor/mcp_server/handlers/README.md
.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/auth/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/compat/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/context/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/derived/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/shared/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/README.md
.opencode/skills/system-skill-advisor/mcp_server/lib/utils/README.md
.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/README.md
.opencode/skills/system-skill-advisor/mcp_server/schemas/README.md
.opencode/skills/system-skill-advisor/mcp_server/scripts/README.md
.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/README.md
.opencode/skills/system-skill-advisor/mcp_server/stress_test/search-quality/README.md
.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/cache/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/compat/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/lifecycle/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-fixtures/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/parity/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/python/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/schemas/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/README.md
.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/README.md
.opencode/skills/system-skill-advisor/mcp_server/tools/README.md
.opencode/skills/system-skill-advisor/references/config/db_path_policy.md
.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md
.opencode/skills/system-skill-advisor/references/graph/propagate_enhances.md
.opencode/skills/system-skill-advisor/references/graph/skill_graph_drift.md
.opencode/skills/system-skill-advisor/references/graph/skill_graph_extraction_plan.md
.opencode/skills/system-skill-advisor/references/graph/skill_graph_query_cookbook.md
.opencode/skills/system-skill-advisor/references/runtime/daemon_lease_contract.md
.opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md
.opencode/skills/system-skill-advisor/references/runtime/legacy_tool_bridge.md
.opencode/skills/system-skill-advisor/references/runtime/standalone_mcp_shape.md
.opencode/skills/system-skill-advisor/references/runtime/tool_ids_reference.md
.opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md
.opencode/skills/system-skill-advisor/references/scoring/lane_weight_tuning.md
.opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md
.opencode/skills/system-spec-kit/ARCHITECTURE.md
.opencode/skills/system-spec-kit/README.md
.opencode/skills/system-spec-kit/SKILL.md
.opencode/skills/system-spec-kit/assets/level_decision_matrix.md
.opencode/skills/system-spec-kit/config/README.md
.opencode/skills/system-spec-kit/constitutional/README.md
.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md
.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md
.opencode/skills/system-spec-kit/feature_catalog/01--retrieval/12-search-api-surface.md
.opencode/skills/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md
.opencode/skills/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md
.opencode/skills/system-spec-kit/feature_catalog/06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md
.opencode/skills/system-spec-kit/feature_catalog/09--evaluation-and-measurement/15-evaluation-api-surface.md
.opencode/skills/system-spec-kit/feature_catalog/10--graph-signal-activation/19-ontology-hooks.md
.opencode/skills/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md
.opencode/skills/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md
.opencode/skills/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md
.opencode/skills/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md
.opencode/skills/system-spec-kit/feature_catalog/12--query-intelligence/12-graph-channel-preservation.md
.opencode/skills/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md
.opencode/skills/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md
.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md
.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md
.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md
.opencode/skills/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/21-eval-runner-cli.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/22-phase-system-knowledge-node.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/23-spec-lifecycle-automation.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/26-core-workflow-infrastructure.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/27-session-extraction-and-enrichment.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/28-spec-folder-detection-and-description.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/30-template-composition-system.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/33-memory-quality-kpi-reporting.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/38-codex-hook-freshness-smoke-check.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/39-spec-folder-literal-naming-create-sh-fallback.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/40-spec-folder-literal-naming-ai-derived-slugs.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/41-debug-delegation-scaffold-generator.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/42-mcp-daemon-rebuild-restart-live-probe.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/43-graph-degraded-stress-cell-isolation.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/44-embedder-list-registry-inventory.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/45-embedder-set-dry-run-and-validation.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/46-embedder-status-and-active-pointer.md
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/47-orphan-mcp-sweeper-and-launchagent-template.md
.opencode/skills/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/09-runtime-config-contract.md
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/10-filter-config-contract.md
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/12-launcher-idle-timeout.md
.opencode/skills/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
.opencode/skills/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md
.opencode/skills/system-spec-kit/feature_catalog/20--remediation-revalidation/03-feedback-driven-revalidation.md
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/03-shadow-scoring-retirement.md
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/05-adaptive-fusion-flag-drift.md
.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
.opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/README.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/150-source-dist-alignment-validation.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/151-module-map-accuracy.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/152-no-symlinks-in-lib-tree.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md
.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md
.opencode/skills/system-spec-kit/mcp_server/README.md
.opencode/skills/system-spec-kit/mcp_server/api/README.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/SOURCE.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/runtime-measurements.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab-rerun/benchmark_report.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/SOURCE.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20/benchmark_report.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-cap-top-k/benchmark_report.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-fp16-rerank/benchmark_report.md
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/benchmark_report.md
.opencode/skills/system-spec-kit/mcp_server/configs/README.md
.opencode/skills/system-spec-kit/mcp_server/core/README.md
.opencode/skills/system-spec-kit/mcp_server/data/README.md
.opencode/skills/system-spec-kit/mcp_server/database/README.md
.opencode/skills/system-spec-kit/mcp_server/database/migrations/README.md
.opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md
.opencode/skills/system-spec-kit/mcp_server/formatters/README.md
.opencode/skills/system-spec-kit/mcp_server/handlers/README.md
.opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/codex/lib/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/devin/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/MODULE_MAP.md
.opencode/skills/system-spec-kit/mcp_server/lib/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/analytics/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/architecture/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/cache/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/cache/scoring/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/causal/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/chunking/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/config/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/context/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/continuity/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/description/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/discovery/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/embedders/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/enrichment/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/errors/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/eval/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/extraction/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/feedback/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/governance/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/interfaces/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/ipc/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/learning/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/memory/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/merge/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/ops/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/providers/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/query/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/rag/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/response/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/routing/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/runtime/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/scoring/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/session/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/templates/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/test-helpers/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/util/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/utils/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/validation/README.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/README.md
.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md
.opencode/skills/system-spec-kit/mcp_server/schemas/README.md
.opencode/skills/system-spec-kit/mcp_server/scripts/README.md
.opencode/skills/system-spec-kit/mcp_server/scripts/tests/README.md
.opencode/skills/system-spec-kit/mcp_server/stress_test/README.md
.opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/README.md
.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/README.md
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md
.opencode/skills/system-spec-kit/mcp_server/stress_test/session/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/__helpers__/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/adversarial/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/advisor-fixtures/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/archive/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/continuity/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/description/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/description/fixtures/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/embedders/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/graph/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/helpers/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/integration/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/lib/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/memory/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/providers/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/search/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/security/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/validation/README.md
.opencode/skills/system-spec-kit/mcp_server/tests/validation/fixtures/README.md
.opencode/skills/system-spec-kit/mcp_server/tools/README.md
.opencode/skills/system-spec-kit/mcp_server/utils/README.md
.opencode/skills/system-spec-kit/references/config/launcher_lease.md
.opencode/skills/system-spec-kit/scripts/README.md
.opencode/skills/system-spec-kit/scripts/config/README.md
.opencode/skills/system-spec-kit/scripts/core/README.md
.opencode/skills/system-spec-kit/scripts/evals/README.md
.opencode/skills/system-spec-kit/scripts/extractors/README.md
.opencode/skills/system-spec-kit/scripts/graph/README.md
.opencode/skills/system-spec-kit/scripts/kpi/README.md
.opencode/skills/system-spec-kit/scripts/lib/README.md
.opencode/skills/system-spec-kit/scripts/loaders/README.md
.opencode/skills/system-spec-kit/scripts/memory/README.md
.opencode/skills/system-spec-kit/scripts/observability/README.md
.opencode/skills/system-spec-kit/scripts/ops/README.md
.opencode/skills/system-spec-kit/scripts/optimizer/README.md
.opencode/skills/system-spec-kit/scripts/renderers/README.md
.opencode/skills/system-spec-kit/scripts/resource-map/README.md
.opencode/skills/system-spec-kit/scripts/rules/README.md
.opencode/skills/system-spec-kit/scripts/setup/README.md
.opencode/skills/system-spec-kit/scripts/spec-folder/README.md
.opencode/skills/system-spec-kit/scripts/spec/README.md
.opencode/skills/system-spec-kit/scripts/templates/README.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/002-valid-level1/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/003-valid-level2/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/003-valid-level2/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/003-valid-level2/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/003-valid-level2/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/003-valid-level2/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/004-valid-level3/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/004-valid-level3/decision-record.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/004-valid-level3/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/004-valid-level3/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/004-valid-level3/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/004-valid-level3/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/005-unfilled-placeholders/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/005-unfilled-placeholders/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/005-unfilled-placeholders/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/006-missing-required-files/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/006-missing-required-files/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/007-valid-anchors/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/007-valid-anchors/memory/context.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/007-valid-anchors/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/007-valid-anchors/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/007-valid-anchors/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/008-invalid-anchors/memory/context.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/008-invalid-anchors/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/008-invalid-anchors/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/008-invalid-anchors/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/010-valid-evidence/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/010-valid-evidence/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/010-valid-evidence/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/010-valid-evidence/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/010-valid-evidence/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/011-anchors-duplicate-ids/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/011-anchors-duplicate-ids/memory/context.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/011-anchors-duplicate-ids/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/011-anchors-duplicate-ids/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/011-anchors-duplicate-ids/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/012-anchors-empty-memory/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/012-anchors-empty-memory/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/012-anchors-empty-memory/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/012-anchors-empty-memory/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/013-anchors-multiple-files/memory/invalid.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/013-anchors-multiple-files/memory/valid.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/013-anchors-multiple-files/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/013-anchors-multiple-files/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/013-anchors-multiple-files/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/014-anchors-nested/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/014-anchors-nested/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/014-anchors-nested/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/014-anchors-nested/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/015-anchors-no-memory/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/015-anchors-no-memory/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/015-anchors-no-memory/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/015-anchors-no-memory/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/016-evidence-all-patterns/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/016-evidence-all-patterns/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/016-evidence-all-patterns/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/016-evidence-all-patterns/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/016-evidence-all-patterns/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/017-evidence-case-variations/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/017-evidence-case-variations/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/017-evidence-case-variations/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/017-evidence-case-variations/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/017-evidence-case-variations/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/018-evidence-checkmark-formats/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/018-evidence-checkmark-formats/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/018-evidence-checkmark-formats/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/018-evidence-checkmark-formats/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/018-evidence-checkmark-formats/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/019-evidence-p2-exempt/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/019-evidence-p2-exempt/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/019-evidence-p2-exempt/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/019-evidence-p2-exempt/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/019-evidence-p2-exempt/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/020-evidence-wrong-suffix/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/020-evidence-wrong-suffix/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/020-evidence-wrong-suffix/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/020-evidence-wrong-suffix/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/020-evidence-wrong-suffix/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/022-level-explicit/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/022-level-explicit/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/022-level-explicit/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/022-level-explicit/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/022-level-explicit/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/023-level-inferred/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/023-level-inferred/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/023-level-inferred/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/023-level-inferred/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/024-level-no-bold/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/024-level-no-bold/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/024-level-no-bold/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/024-level-no-bold/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/025-level-out-of-range/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/025-level-out-of-range/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/025-level-out-of-range/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/025-level-out-of-range/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/026-level-zero/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/026-level-zero/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/026-level-zero/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/026-level-zero/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/027-level2-missing-checklist/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/027-level2-missing-checklist/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/027-level2-missing-checklist/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/028-level3-missing-decision/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/028-level3-missing-decision/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/028-level3-missing-decision/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/028-level3-missing-decision/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/030-missing-decision-sections/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/030-missing-decision-sections/decision-record.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/030-missing-decision-sections/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/030-missing-decision-sections/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/030-missing-decision-sections/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/030-missing-decision-sections/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/031-missing-evidence/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/031-missing-evidence/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/031-missing-evidence/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/031-missing-evidence/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/031-missing-evidence/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/032-missing-plan/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/032-missing-plan/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/033-missing-plan-sections/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/033-missing-plan-sections/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/033-missing-plan-sections/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/033-missing-plan-sections/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/034-missing-spec-sections/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/034-missing-spec-sections/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/034-missing-spec-sections/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/034-missing-spec-sections/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/035-missing-tasks/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/035-missing-tasks/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/036-multiple-placeholders/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/036-multiple-placeholders/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/036-multiple-placeholders/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/037-placeholder-case-variations/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/037-placeholder-case-variations/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/037-placeholder-case-variations/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/038-placeholder-in-codeblock/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/038-placeholder-in-codeblock/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/038-placeholder-in-codeblock/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/038-placeholder-in-codeblock/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/039-placeholder-in-inline-code/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/039-placeholder-in-inline-code/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/039-placeholder-in-inline-code/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/039-placeholder-in-inline-code/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/040-priority-context-reset/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/040-priority-context-reset/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/040-priority-context-reset/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/040-priority-context-reset/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/040-priority-context-reset/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/043-priority-mixed-format/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/043-priority-mixed-format/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/043-priority-mixed-format/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/043-priority-mixed-format/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/043-priority-mixed-format/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/044-priority-p3-invalid/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/044-priority-p3-invalid/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/044-priority-p3-invalid/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/044-priority-p3-invalid/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/044-priority-p3-invalid/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/045-valid-sections/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/045-valid-sections/decision-record.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/045-valid-sections/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/045-valid-sections/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/045-valid-sections/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/045-valid-sections/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/046-with-config/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/046-with-config/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/046-with-config/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/046-with-config/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/046-with-config/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/047-with-extra-files/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/047-with-extra-files/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/047-with-extra-files/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/047-with-extra-files/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/048-with-memory-placeholders/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/048-with-memory-placeholders/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/048-with-memory-placeholders/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/048-with-memory-placeholders/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/049-with-rule-order/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/049-with-rule-order/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/049-with-rule-order/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/049-with-rule-order/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/050-with-scratch/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/050-with-scratch/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/050-with-scratch/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/050-with-scratch/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/051-with-templates/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/051-with-templates/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/051-with-templates/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/051-with-templates/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/054-template-extra-header/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/055-template-missing-header/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/056-template-reordered-header/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/057-template-missing-anchor/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/058-template-reordered-anchor/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/059-checklist-h1-invalid/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/060-checklist-chk-format-invalid/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/061-template-optional-absent/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/decision-record.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/implementation-summary.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/064-link-formats/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/064-link-formats/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/064-link-formats/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/065-evidence-strict-marker/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/065-evidence-strict-marker/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/065-evidence-strict-marker/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/065-evidence-strict-marker/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/066-template-header-drift-mid/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/066-template-header-drift-mid/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/066-template-header-drift-mid/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/067-checklist-uppercase-x/checklist.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/067-checklist-uppercase-x/plan.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/067-checklist-uppercase-x/spec.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/067-checklist-uppercase-x/tasks.md
.opencode/skills/system-spec-kit/scripts/test-fixtures/README.md
.opencode/skills/system-spec-kit/scripts/tests/README.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/checklist.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/checklist.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/decision-record.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/tasks.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/plan.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/spec.md
.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/tasks.md
.opencode/skills/system-spec-kit/scripts/types/README.md
.opencode/skills/system-spec-kit/scripts/utils/README.md
.opencode/skills/system-spec-kit/scripts/validation/README.md
.opencode/skills/system-spec-kit/shared/README.md
.opencode/skills/system-spec-kit/shared/algorithms/README.md
.opencode/skills/system-spec-kit/shared/contracts/README.md
.opencode/skills/system-spec-kit/shared/embeddings/README.md
.opencode/skills/system-spec-kit/shared/embeddings/adapters/README.md
.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md
.opencode/skills/system-spec-kit/shared/lib/README.md
.opencode/skills/system-spec-kit/shared/mcp_server/database/README.md
.opencode/skills/system-spec-kit/shared/parsing/README.md
.opencode/skills/system-spec-kit/shared/predicates/README.md
.opencode/skills/system-spec-kit/shared/ranking/README.md
.opencode/skills/system-spec-kit/shared/scoring/README.md
.opencode/skills/system-spec-kit/shared/utils/README.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/strip_toc_anchors.py
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md

 succeeded in 2419ms:
2026-05-26 12:40:24.275 xcodebuild[49396:53674213]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:24.515 xcodebuild[49396:53674211] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Q1MJwM8x' (errno=Operation not permitted)
2026-05-26 12:40:25.013 xcodebuild[49416:53674281]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:25.139 xcodebuild[49416:53674276] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
commit 1e58d845af44255e32e071b3d69d1c19e76d4ac6
Author: MichelKerkmeester <82775228+MichelKerkmeester@users.noreply.github.com>
Date:   Tue May 26 11:55:15 2026 +0200

    docs(117): remove TOC blocks + HTML anchor comments from skill docs
    
    Apply the 117-skill-anchor-toc-removal pass: strip unnumbered TABLE OF CONTENTS
    blocks and HTML `<!-- ANCHOR -->` comments from skill docs across the corpus, and
    update sk-doc standards/templates/config so they are not reintroduced.
    
    ~860 markdown docs + sk-doc standards/config, plus the 117 spec packet
    (001-standards-templates-config, 002-toc-removal, 003-anchor-comment-removal,
    004-verification-reconciliation).
    
    Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

 .opencode/commands/create/README.txt               |  18 --
 .../create/assets/create_feature_catalog_auto.yaml |   3 +-
 .../assets/create_feature_catalog_confirm.yaml     |   3 +-
 .../create/assets/create_folder_readme_auto.yaml   |  35 +---
 .../assets/create_folder_readme_confirm.yaml       |  38 +---
 .../assets/create_testing_playbook_auto.yaml       |   3 +-
 .../assets/create_testing_playbook_confirm.yaml    |   3 +-
 .opencode/commands/create/feature-catalog.md       |   1 -
 .opencode/commands/create/folder_readme.md         |   8 +-
 .opencode/commands/create/testing-playbook.md      |   1 -
 .opencode/skills/README.md                         |  44 -----
 .opencode/skills/cli-claude-code/README.md         |  46 -----
 .../manual_testing_playbook.md                     |  27 +--
 .opencode/skills/cli-codex/README.md               |  46 -----
 .../manual_testing_playbook.md                     |  23 ---
 .opencode/skills/cli-devin/README.md               |  41 ----
 .../manual_testing_playbook.md                     |  22 ---
 .opencode/skills/cli-gemini/README.md              |  47 -----
 .../manual_testing_playbook.md                     |  20 --
 .opencode/skills/cli-opencode/README.md            |  46 -----
 .../manual_testing_playbook.md                     |  26 +--
 .opencode/skills/deep-agent-improvement/README.md  |  49 -----
 .../feature_catalog/feature_catalog.md             |   9 -
 .../manual_testing_playbook.md                     |  31 ---

exec
/bin/zsh -lc "git show --name-only --format= 1e58d845af | rg '("'^'"\\.opencode/skills/(README|["'^/]+/README|[''^/]+/INSTALL_GUIDE|[''^/]+/ARCHITECTURE)'"\\.md"'$|manual_testing_playbook/manual_testing_playbook'"\\.md"'$|feature_catalog/(FEATURE_CATALOG|feature_catalog)'"\\.md"'$|'"\\.opencode/commands/create/|\\.opencode/skills/sk-doc/assets/)'
" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'git show --format= --unified=0 1e58d845af -- .opencode/skills/README.md .opencode/skills/cli-claude-code/README.md .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md .opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md .opencode/skills/deep-review/feature_catalog/feature_catalog.md .opencode/skills/mcp-code-mode/INSTALL_GUIDE.md .opencode/skills/sk-doc/assets/readme/readme_template.md .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md .opencode/skills/system-code-graph/ARCHITECTURE.md .opencode/commands/create/assets/create_folder_readme_auto.yaml' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1520ms:
2026-05-26 12:40:35.057 xcodebuild[50143:53675487]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:35.174 xcodebuild[50143:53675484] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Fti3CVCa' (errno=Operation not permitted)
2026-05-26 12:40:35.586 xcodebuild[50173:53675539]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:35.707 xcodebuild[50173:53675537] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
diff --git a/.opencode/commands/create/assets/create_folder_readme_auto.yaml b/.opencode/commands/create/assets/create_folder_readme_auto.yaml
index 0a2b6a2e70..099995d24e 100644
--- a/.opencode/commands/create/assets/create_folder_readme_auto.yaml
+++ b/.opencode/commands/create/assets/create_folder_readme_auto.yaml
@@ -14 +14 @@ purpose: Create comprehensive README files and AI-first installation guides with
-action: Generate scannable, well-organized documentation (README or Install Guide) with table of contents
+action: Generate scannable, well-organized documentation (README or Install Guide) with proper structure
@@ -206 +206 @@ workflow_enforcement:
-        enforcement: "MUST use template structure with TOC, section formatting, tables"
+        enforcement: "MUST use template structure with section formatting, tables"
@@ -279 +279 @@ quality_standards:
-      stage_1: "Structural check (title, TOC, sections, separators)"
+      stage_1: "Structural check (title, sections, separators)"
@@ -450 +449,0 @@ readme_template_references:
-  toc_format: "readme_template.md §5.1 (Table of Contents)"
@@ -530 +528,0 @@ readme_workflow:
-      - "TABLE OF CONTENTS (numbered, linked)"
@@ -556 +553,0 @@ readme_workflow:
-    - Generate TABLE OF CONTENTS (numbered, linked to sections)
@@ -565 +561,0 @@ readme_workflow:
-      toc: "Numbered, linked to actual sections"
@@ -580 +576 @@ readme_workflow:
-    - Structure check (title, TOC, sections, separators)
+    - Structure check (title, sections, separators)
@@ -587 +582,0 @@ readme_workflow:
-      - "TABLE OF CONTENTS present and linked"
@@ -747 +741,0 @@ readme_completion_report:
-    - TABLE OF CONTENTS: ✅
@@ -1009 +1002,0 @@ install_guide_workflow:
-    - Create TABLE OF CONTENTS with links
@@ -1031 +1024 @@ install_guide_workflow:
-    - Structure check (all 11 sections, TOC links, ASCII diagram, comparison table)
+    - Structure check (all 11 sections, ASCII diagram, comparison table)
@@ -1043 +1035,0 @@ install_guide_workflow:
-      - "TABLE OF CONTENTS links work"
@@ -1215,15 +1206,0 @@ install_guide_templates:
-    #### TABLE OF CONTENTS
-
-    1. [OVERVIEW](#1--overview)
-    2. [PREREQUISITES](#2--prerequisites)
-    3. [INSTALLATION](#3--installation)
-    4. [CONFIGURATION](#4--configuration)
-    5. [VERIFICATION](#5--verification)
-    6. [USAGE](#6--usage)
-    7. [FEATURES](#7--features)
-    8. [EXAMPLES](#8--examples)
-    9. [TROUBLESHOOTING](#9--troubleshooting)
-    10. [RESOURCES](#10--resources)
-
-    ---
-
@@ -1620 +1596,0 @@ rules:
-  - "Create table of contents with proper anchor links"
@@ -1634 +1609,0 @@ rules:
-  - "Create table of contents with proper anchor links"
diff --git a/.opencode/skills/README.md b/.opencode/skills/README.md
index 69106c3956..7c3f9b2991 100644
--- a/.opencode/skills/README.md
+++ b/.opencode/skills/README.md
@@ -24,18 +23,0 @@ Across this skill tree, `/speckit:resume` is the canonical recovery surface for
-<!-- ANCHOR:table-of-contents -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. QUICK START](#2--quick-start)
-- [3. FEATURES](#3--features)
-- [4. STRUCTURE](#4--structure)
-- [5. CONFIGURATION](#5--configuration)
-- [6. USAGE EXAMPLES](#6--usage-examples)
-- [7. TROUBLESHOOTING](#7--troubleshooting)
-- [8. FAQ](#8--faq)
-- [9. RELATED DOCUMENTS](#9--related-documents)
-
-<!-- /ANCHOR:table-of-contents -->
-
----
-
-<!-- ANCHOR:overview -->
@@ -79,2 +60,0 @@ Adding a skill is intentional. Every new skill goes through `sk-doc`'s scaffoldi
-<!-- /ANCHOR:overview -->
-
@@ -83 +62,0 @@ Adding a skill is intentional. Every new skill goes through `sk-doc`'s scaffoldi
-<!-- ANCHOR:quick-start -->
@@ -124,2 +102,0 @@ Request -> advisor_recommend -> top match + confidence -> load SKILL.md -> follo
-<!-- /ANCHOR:quick-start -->
-
@@ -128 +104,0 @@ Request -> advisor_recommend -> top match + confidence -> load SKILL.md -> follo
-<!-- ANCHOR:features -->
@@ -192,2 +167,0 @@ The skill system covers four distinct workflow domains.
-<!-- /ANCHOR:features -->
-
@@ -196 +169,0 @@ The skill system covers four distinct workflow domains.
-<!-- ANCHOR:structure -->
@@ -274,2 +246,0 @@ For the full system-spec-kit script inventory, see `system-spec-kit/scripts/scri
-<!-- /ANCHOR:structure -->
-
@@ -278 +248,0 @@ For the full system-spec-kit script inventory, see `system-spec-kit/scripts/scri
-<!-- ANCHOR:configuration -->
@@ -333,2 +302,0 @@ advisor_validate({"skillSlug":null})
-<!-- /ANCHOR:configuration -->
-
@@ -337 +304,0 @@ advisor_validate({"skillSlug":null})
-<!-- ANCHOR:usage-examples -->
@@ -404,2 +370,0 @@ python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_b
-<!-- /ANCHOR:usage-examples -->
-
@@ -408 +372,0 @@ python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_b
-<!-- ANCHOR:troubleshooting -->
@@ -470,2 +433,0 @@ python3 -c "import yaml; print('ok')"
-<!-- /ANCHOR:troubleshooting -->
-
@@ -474 +435,0 @@ python3 -c "import yaml; print('ok')"
-<!-- ANCHOR:faq -->
@@ -493,2 +453,0 @@ The cap preserves a margin of uncertainty so the calling AI retains judgment on
-<!-- /ANCHOR:faq -->
-
@@ -497 +455,0 @@ The cap preserves a margin of uncertainty so the calling AI retains judgment on
-<!-- ANCHOR:related-documents -->
@@ -511,2 +468,0 @@ The cap preserves a margin of uncertainty so the calling AI retains judgment on
-
-<!-- /ANCHOR:related-documents -->
diff --git a/.opencode/skills/cli-claude-code/README.md b/.opencode/skills/cli-claude-code/README.md
index 05aff6f243..4623707182 100644
--- a/.opencode/skills/cli-claude-code/README.md
+++ b/.opencode/skills/cli-claude-code/README.md
@@ -18,20 +17,0 @@ trigger_phrases:
-<!-- ANCHOR:table-of-contents -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. QUICK START](#2--quick-start)
-- [3. FEATURES](#3--features)
-  - [3.1 FEATURE HIGHLIGHTS](#31--feature-highlights)
-  - [3.2 FEATURE REFERENCE](#32--feature-reference)
-- [4. STRUCTURE](#4--structure)
-- [5. CONFIGURATION](#5--configuration)
-- [6. USAGE EXAMPLES](#6--usage-examples)
-- [7. TROUBLESHOOTING](#7--troubleshooting)
-- [8. FAQ](#8--faq)
-- [9. RELATED DOCUMENTS](#9--related-documents)
-
-<!-- /ANCHOR:table-of-contents -->
-
----
-
-<!-- ANCHOR:overview -->
@@ -70,2 +49,0 @@ Requirements include the `@anthropic-ai/claude-code` CLI (install via `npm insta
-<!-- /ANCHOR:overview -->
-
@@ -74 +51,0 @@ Requirements include the `@anthropic-ai/claude-code` CLI (install via `npm insta
-<!-- ANCHOR:quick-start -->
@@ -102,2 +78,0 @@ claude -p "Review this module for security issues" --agent review --permission-m
-<!-- /ANCHOR:quick-start -->
-
@@ -106 +80,0 @@ claude -p "Review this module for security issues" --agent review --permission-m
-<!-- ANCHOR:features -->
@@ -171,2 +144,0 @@ The agent system adds specialization on top of these foundations. Nine agents co
-<!-- /ANCHOR:features -->
-
@@ -175 +146,0 @@ The agent system adds specialization on top of these foundations. Nine agents co
-<!-- ANCHOR:structure -->
@@ -191,2 +161,0 @@ cli-claude-code/
-<!-- /ANCHOR:structure -->
-
@@ -195 +163,0 @@ cli-claude-code/
-<!-- ANCHOR:configuration -->
@@ -222,2 +189,0 @@ claude -p "prompt" --model claude-opus-4-6 --output-format text 2>&1
-<!-- /ANCHOR:configuration -->
-
@@ -226 +191,0 @@ claude -p "prompt" --model claude-opus-4-6 --output-format text 2>&1
-<!-- ANCHOR:usage-examples -->
@@ -259,2 +223,0 @@ claude -p "Generate full test coverage for src/utils/" \
-<!-- /ANCHOR:usage-examples -->
-
@@ -263 +225,0 @@ claude -p "Generate full test coverage for src/utils/" \
-<!-- ANCHOR:troubleshooting -->
@@ -290,2 +251,0 @@ claude -p "Generate full test coverage for src/utils/" \
-<!-- /ANCHOR:troubleshooting -->
-
@@ -294 +253,0 @@ claude -p "Generate full test coverage for src/utils/" \
-<!-- ANCHOR:faq -->
@@ -321,2 +279,0 @@ A: Yes. Add markdown files to `.claude/agents/` for Claude Code agent definition
-<!-- /ANCHOR:faq -->
-
@@ -325 +281,0 @@ A: Yes. Add markdown files to `.claude/agents/` for Claude Code agent definition
-<!-- ANCHOR:related-documents -->
@@ -339,2 +294,0 @@ A: Yes. Add markdown files to `.claude/agents/` for Claude Code agent definition
-
-<!-- /ANCHOR:related-documents -->
diff --git a/.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md b/.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
index 774940d6e2..b37566e380 100644
--- a/.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
+++ b/.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
@@ -32,22 +31,0 @@ Canonical package artifacts:
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
-- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
-- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
-- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
-- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
-- [7. CLI INVOCATION (`CO-001..CO-005`)](#7--cli-invocation-co-001co-005)
-- [8. EXTERNAL DISPATCH (`CO-006..CO-008`)](#8--external-dispatch-co-006co-008)
-- [9. MULTI-PROVIDER (`CO-009..CO-012`)](#9--multi-provider-co-009co-012)
-- [10. AGENT ROUTING (`CO-013..CO-017`, `CO-032..CO-034`)](#10--agent-routing-co-013co-017-co-032co-034)
-- [11. SESSION CONTINUITY (`CO-018..CO-020`)](#11--session-continuity-co-018co-020)
-- [12. INTEGRATION PATTERNS (`CO-021..CO-022`)](#12--integration-patterns-co-021co-022)
-- [13. PROMPT TEMPLATES (`CO-023..CO-025`, `CO-035..CO-036`)](#13--prompt-templates-co-023co-025-co-035co-036)
-- [14. PARALLEL DETACHED (`CO-026..CO-028`)](#14--parallel-detached-co-026co-028)
-- [15. CROSS-REPO AND CROSS-SERVER (`CO-029..CO-031`)](#15--cross-repo-and-cross-server-co-029co-031)
-- [16. AUTOMATED TEST CROSS-REFERENCE](#16--automated-test-cross-reference)
-- [17. FEATURE CATALOG CROSS-REFERENCE INDEX](#17--feature-catalog-cross-reference-index)
-
----
-
@@ -441 +419 @@ Verify `--agent write` loads the sk-doc skill, applies the appropriate template
-Prompt summary: As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called Demo Skill. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file and the file contains a TABLE OF CONTENTS plus emoji-prefixed H2 sections.
+Prompt summary: As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called Demo Skill. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file with emoji-prefixed H2 sections and no table of contents.
@@ -443 +421 @@ Prompt summary: As an external-AI conductor wanting a template-driven README for
-Expected signals: Exit 0. Write tool.call for the README path. README file exists with TOC and >= 3 emoji-prefixed H2 headers.
+Expected signals: Exit 0. Write tool.call for the README path. README file exists with >= 3 emoji-prefixed H2 headers and no TOC.
diff --git a/.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md b/.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md
index 5a1b92e8ba..55c25adfff 100644
--- a/.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md
+++ b/.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md
@@ -12,15 +11,0 @@ Canonical inventory of what the `deep-ai-council` planning skill does today, gro
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1-overview)
-- [2. RUNTIME ROUTING AND RENAME](#2-runtime-routing-and-rename)
-- [3. COUNCIL DELIBERATION AND SEAT DIVERSITY](#3-council-deliberation-and-seat-diversity)
-- [4. ARTIFACT PERSISTENCE AND STATE FORMAT](#4-artifact-persistence-and-state-format)
-- [5. CONVERGENCE AND ROLLBACK](#5-convergence-and-rollback)
-- [6. SCOPE BOUNDARIES](#6-scope-boundaries)
-- [7. DEPTH AND FAILURE HANDLING](#7-depth-and-failure-handling)
-- [8. WRITER LIBRARY CONTRACT](#8-writer-library-contract)
-- [9. COUNCIL GRAPH INTEGRATION](#9-council-graph-integration)
-- [10. COUNCIL GRAPH VALUE COMPARISON](#10-council-graph-value-comparison)
-
----
-
diff --git a/.opencode/skills/deep-review/feature_catalog/feature_catalog.md b/.opencode/skills/deep-review/feature_catalog/feature_catalog.md
index 465dd63a2e..3b048bd05f 100644
--- a/.opencode/skills/deep-review/feature_catalog/feature_catalog.md
+++ b/.opencode/skills/deep-review/feature_catalog/feature_catalog.md
@@ -12,10 +11,0 @@ This document combines the current feature inventory for the `deep-review` syste
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. LOOP LIFECYCLE](#2--loop-lifecycle)
-- [3. STATE MANAGEMENT](#3--state-management)
-- [4. REVIEW DIMENSIONS](#4--review-dimensions)
-- [5. SEVERITY SYSTEM](#5--severity-system)
-
----
-
diff --git a/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md b/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
index 8586971fd2..5824f17aac 100644
--- a/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
+++ b/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
@@ -46,2 +45,0 @@ Guide me through each step with the exact commands and configuration needed.
-## Table of Contents
-
diff --git a/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md b/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
index 0e0f9f200c..40406cd6dd 100644
--- a/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
+++ b/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
@@ -18 +18 @@ Templates for creating feature catalogs that combine top-level capability invent
-- **Feature-catalog shaped**: The root file uses frontmatter, an H1 intro paragraph, an unnumbered `TABLE OF CONTENTS`, and numbered all-caps H2 section headers.
+- **Feature-catalog shaped**: The root file uses frontmatter, an H1 intro paragraph, and numbered all-caps H2 section headers.
@@ -99,9 +98,0 @@ This document combines the current feature inventory for the `{SYSTEM_SLUG}` sys
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. {CAT1_HEADING}](#2--{CAT1_ANCHOR})
-- [3. {CAT2_HEADING}](#3--{CAT2_ANCHOR})
-- [4. {CAT3_HEADING}](#4--{CAT3_ANCHOR})
-
----
-
@@ -226 +217 @@ description: "{OVERVIEW_ONE_LINE}"
-- Use numbered all-caps H2 section headers in the root catalog, with `TABLE OF CONTENTS` as the one intentional unnumbered H2.
+- Use numbered all-caps H2 section headers in the root catalog. Do not add a Table of Contents.
@@ -238,2 +229 @@ Structure:
-- [ ] Root catalog has `## TABLE OF CONTENTS`
-- [ ] Root catalog uses numbered all-caps H2 section headers after the TOC
+- [ ] Root catalog uses numbered all-caps H2 section headers (no Table of Contents)
diff --git a/.opencode/skills/sk-doc/assets/readme/readme_template.md b/.opencode/skills/sk-doc/assets/readme/readme_template.md
index 18a86cd882..a614141176 100644
--- a/.opencode/skills/sk-doc/assets/readme/readme_template.md
+++ b/.opencode/skills/sk-doc/assets/readme/readme_template.md
@@ -68 +67,0 @@ Use this profile for OpenCode skills, package roots and project-level READMEs th
-| Table of contents | READMEs longer than 150 lines | Link only top-level sections |
@@ -80 +78,0 @@ Optional HTML anchors help memory and extraction tools find stable sections. Use
-<!-- ANCHOR:overview -->
@@ -85 +82,0 @@ Optional HTML anchors help memory and extraction tools find stable sections. Use
-<!-- /ANCHOR:overview -->
@@ -160,19 +156,0 @@ trigger_phrases:
-<!-- ANCHOR:table-of-contents -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1-overview)
-- [2. QUICK START](#2-quick-start)
-- [3. FEATURES](#3-features)
-- [4. REQUIREMENTS](#4-requirements)
-- [5. STRUCTURE](#5-structure)
-- [6. CONFIGURATION](#6-configuration)
-- [7. USAGE EXAMPLES](#7-usage-examples)
-- [8. TROUBLESHOOTING](#8-troubleshooting)
-- [9. FAQ](#9-faq)
-- [10. RELATED RESOURCES](#10-related-resources)
-
-<!-- /ANCHOR:table-of-contents -->
-
----
-
-<!-- ANCHOR:overview -->
@@ -198 +175,0 @@ trigger_phrases:
-<!-- /ANCHOR:overview -->
@@ -202 +178,0 @@ trigger_phrases:
-<!-- ANCHOR:quick-start -->
@@ -215 +190,0 @@ Expected result: [what success looks like].
-<!-- /ANCHOR:quick-start -->
@@ -219 +193,0 @@ Expected result: [what success looks like].
-<!-- ANCHOR:features -->
@@ -228 +201,0 @@ Expected result: [what success looks like].
-<!-- /ANCHOR:features -->
@@ -232 +204,0 @@ Expected result: [what success looks like].
-<!-- ANCHOR:requirements -->
@@ -239 +210,0 @@ Expected result: [what success looks like].
-<!-- /ANCHOR:requirements -->
@@ -243 +213,0 @@ Expected result: [what success looks like].
-<!-- ANCHOR:structure -->
@@ -256 +225,0 @@ Expected result: [what success looks like].
-<!-- /ANCHOR:structure -->
@@ -260 +228,0 @@ Expected result: [what success looks like].
-<!-- ANCHOR:configuration -->
@@ -267 +234,0 @@ Expected result: [what success looks like].
-<!-- /ANCHOR:configuration -->
@@ -271 +237,0 @@ Expected result: [what success looks like].
-<!-- ANCHOR:usage-examples -->
@@ -280 +245,0 @@ Result: [expected output or behavior].
-<!-- /ANCHOR:usage-examples -->
@@ -284 +248,0 @@ Result: [expected output or behavior].
-<!-- ANCHOR:troubleshooting -->
@@ -291 +254,0 @@ Result: [expected output or behavior].
-<!-- /ANCHOR:troubleshooting -->
@@ -295 +257,0 @@ Result: [expected output or behavior].
-<!-- ANCHOR:faq -->
@@ -302 +263,0 @@ A: [Short answer with a link when useful.]
-<!-- /ANCHOR:faq -->
@@ -306 +266,0 @@ A: [Short answer with a link when useful.]
-<!-- ANCHOR:related-resources -->
@@ -321 +280,0 @@ A: [Short answer with a link when useful.]
-<!-- /ANCHOR:related-resources -->
diff --git a/.opencode/skills/system-code-graph/ARCHITECTURE.md b/.opencode/skills/system-code-graph/ARCHITECTURE.md
index 536b8c8b1a..7fafa68f16 100644
--- a/.opencode/skills/system-code-graph/ARCHITECTURE.md
+++ b/.opencode/skills/system-code-graph/ARCHITECTURE.md
@@ -17,14 +16,0 @@ importance_tier: "important"
-<!-- ANCHOR:table-of-contents -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. PACKAGE TOPOLOGY](#2--package-topology)
-- [3. CANONICAL CONTINUITY FLOWS](#3--canonical-continuity-flows)
-- [4. RUNTIME SUBSYSTEMS](#4--runtime-subsystems)
-- [5. HOOK AND PLUGIN INTEGRATION](#5--hook-and-plugin-integration)
-- [6. ENFORCEMENT AND VERIFICATION](#6--enforcement-and-verification)
-- [7. DECISION RECORDS](#7--decision-records)
-- [8. RELATED](#8--related)
-
-<!-- /ANCHOR:table-of-contents -->
-
@@ -33 +18,0 @@ importance_tier: "important"
-<!-- ANCHOR:overview -->
@@ -93,2 +77,0 @@ Detail per tool lives in `feature_catalog/feature_catalog.md`. Readiness state d
-<!-- /ANCHOR:overview -->
-
@@ -97 +79,0 @@ Detail per tool lives in `feature_catalog/feature_catalog.md`. Readiness state d
-<!-- ANCHOR:topology -->
@@ -128,2 +109,0 @@ Reverse imports are blocked by lint and CI.
-<!-- /ANCHOR:topology -->
-
@@ -132 +111,0 @@ Reverse imports are blocked by lint and CI.
-<!-- ANCHOR:continuity-flows -->
@@ -147,2 +125,0 @@ The code-graph treats its SQLite store as the durable record. Reads are gated by
-<!-- /ANCHOR:continuity-flows -->
-
@@ -151 +127,0 @@ The code-graph treats its SQLite store as the durable record. Reads are gated by
-<!-- ANCHOR:runtime-subsystems -->
@@ -166,2 +141,0 @@ The MCP server is composed of focused subsystems that share the transport layer
-<!-- /ANCHOR:runtime-subsystems -->
-
@@ -170 +143,0 @@ The MCP server is composed of focused subsystems that share the transport layer
-<!-- ANCHOR:hook-integration -->
@@ -175,2 +147,0 @@ The code-graph does not own its own SessionStart hook surface. The hook runtime
-<!-- /ANCHOR:hook-integration -->
-
@@ -179 +149,0 @@ The code-graph does not own its own SessionStart hook surface. The hook runtime
-<!-- ANCHOR:enforcement -->
@@ -188,2 +157,0 @@ Verification runs at two layers.
-<!-- /ANCHOR:enforcement -->
-
@@ -192 +159,0 @@ Verification runs at two layers.
-<!-- ANCHOR:decision-records -->
@@ -203,2 +169,0 @@ Verification runs at two layers.
-<!-- /ANCHOR:decision-records -->
-
@@ -207 +171,0 @@ Verification runs at two layers.
-<!-- ANCHOR:related -->
@@ -218,2 +181,0 @@ Verification runs at two layers.
-
-<!-- /ANCHOR:related -->

 succeeded in 1534ms:
2026-05-26 12:40:35.057 xcodebuild[50144:53675486]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:35.174 xcodebuild[50144:53675485] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-v7hGywJr' (errno=Operation not permitted)
2026-05-26 12:40:35.586 xcodebuild[50174:53675540]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:35.707 xcodebuild[50174:53675538] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/README.txt
.opencode/commands/create/assets/create_feature_catalog_auto.yaml
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml
.opencode/commands/create/assets/create_folder_readme_auto.yaml
.opencode/commands/create/assets/create_folder_readme_confirm.yaml
.opencode/commands/create/assets/create_testing_playbook_auto.yaml
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml
.opencode/commands/create/feature-catalog.md
.opencode/commands/create/folder_readme.md
.opencode/commands/create/testing-playbook.md
.opencode/skills/README.md
.opencode/skills/cli-claude-code/README.md
.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-codex/README.md
.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-devin/README.md
.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-gemini/README.md
.opencode/skills/cli-gemini/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/cli-opencode/README.md
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-agent-improvement/README.md
.opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md
.opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-ai-council/README.md
.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md
.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-loop-runtime/README.md
.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md
.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-research/README.md
.opencode/skills/deep-research/feature_catalog/feature_catalog.md
.opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/deep-review/README.md
.opencode/skills/deep-review/feature_catalog/feature_catalog.md
.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md
.opencode/skills/mcp-chrome-devtools/README.md
.opencode/skills/mcp-chrome-devtools/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
.opencode/skills/mcp-code-mode/README.md
.opencode/skills/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-code-review/README.md
.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-code/README.md
.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-doc/README.md
.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
.opencode/skills/sk-doc/assets/benchmark/source_template.md
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
.opencode/skills/sk-doc/assets/readme/install_guide_template.md
.opencode/skills/sk-doc/assets/readme/readme_code_template.md
.opencode/skills/sk-doc/assets/readme/readme_template.md
.opencode/skills/sk-doc/assets/skill/skill_readme_template.md
.opencode/skills/sk-doc/assets/template_rules.json
.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md
.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-git/README.md
.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/sk-prompt-small-model/README.md
.opencode/skills/sk-prompt/README.md
.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-code-graph/ARCHITECTURE.md
.opencode/skills/system-code-graph/INSTALL_GUIDE.md
.opencode/skills/system-code-graph/README.md
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-skill-advisor/ARCHITECTURE.md
.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md
.opencode/skills/system-skill-advisor/README.md
.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md
.opencode/skills/system-spec-kit/ARCHITECTURE.md
.opencode/skills/system-spec-kit/README.md
.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md

codex
The named README/playbook/catalog diffs look clean so far: removed lines are TOC entries, anchor comments, blank lines, or separators. One thing I’m checking carefully is the standards/template side, because those diffs intentionally changed TOC-generation rules and can look like content loss unless the surrounding command contract changed with them.
exec
/bin/zsh -lc "git show --format= --unified=0 1e58d845af -- .opencode/skills/cli-gemini/README.md .opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md .opencode/skills/deep-research/feature_catalog/feature_catalog.md .opencode/skills/system-skill-advisor/README.md .opencode/skills/deep-loop-runtime/README.md .opencode/skills/README.md .opencode/skills/cli-claude-code/README.md .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md .opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md .opencode/skills/deep-review/feature_catalog/feature_catalog.md .opencode/skills/mcp-code-mode/INSTALL_GUIDE.md .opencode/skills/sk-doc/assets/readme/readme_template.md .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md .opencode/skills/system-code-graph/ARCHITECTURE.md .opencode/commands/create/assets/create_folder_readme_auto.yaml | perl -ne '
  if (/"'^diff --git a'"\\/(.*?) b\\//) { "'$f=$1; next }
  if (/''^@@/) { $h=$_; chomp $h; next }
  next unless /''^-/ && !/''^---/;
  $line=$_; chomp $line; $s=substr($line,1);
  $ok = ($s eq "" || $s =~ /''^'"\\s*"'$/ || $s =~ /''^'"\\s*---\\s*"'$/ || $s =~ /''^##+'"\\s+TABLE OF CONTENTS\\s*"'$/i || $s =~ /''^<!--'"\\s*\\/?ANCHOR:["'^>]+-->'"\\s*"'$/ || $s =~ /''^'"\\s*- \\[["'^'"\\]]+\\]\\(#["'^)]+'"\\)\\s*"'$/ || $s =~ /''^'"\\s{2,}- \\[["'^'"\\]]+\\]\\(#["'^)]+'"\\)\\s*"'$/ || $s =~ /''^'"\\s*\\d+\\. \\[["'^'"\\]]+\\]\\(#["'^)]+'"\\)\\s*"'$/);
  print "$f $h'"\\n  "'$s'"\\n\" unless "'$ok;
'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1514ms:
2026-05-26 12:40:53.789 xcodebuild[51460:53677478]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:53.912 xcodebuild[51460:53677477] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-HnJMPmF3' (errno=Operation not permitted)
2026-05-26 12:40:54.305 xcodebuild[51464:53677507]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:40:54.417 xcodebuild[51464:53677506] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -14 +14 @@ purpose: Create comprehensive README files and AI-first installation guides with
  action: Generate scannable, well-organized documentation (README or Install Guide) with table of contents
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -206 +206 @@ workflow_enforcement:
          enforcement: "MUST use template structure with TOC, section formatting, tables"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -279 +279 @@ quality_standards:
        stage_1: "Structural check (title, TOC, sections, separators)"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -450 +449,0 @@ readme_template_references:
    toc_format: "readme_template.md §5.1 (Table of Contents)"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -530 +528,0 @@ readme_workflow:
        - "TABLE OF CONTENTS (numbered, linked)"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -556 +553,0 @@ readme_workflow:
      - Generate TABLE OF CONTENTS (numbered, linked to sections)
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -565 +561,0 @@ readme_workflow:
        toc: "Numbered, linked to actual sections"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -580 +576 @@ readme_workflow:
      - Structure check (title, TOC, sections, separators)
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -587 +582,0 @@ readme_workflow:
        - "TABLE OF CONTENTS present and linked"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -747 +741,0 @@ readme_completion_report:
      - TABLE OF CONTENTS: ✅
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -1009 +1002,0 @@ install_guide_workflow:
      - Create TABLE OF CONTENTS with links
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -1031 +1024 @@ install_guide_workflow:
      - Structure check (all 11 sections, TOC links, ASCII diagram, comparison table)
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -1043 +1035,0 @@ install_guide_workflow:
        - "TABLE OF CONTENTS links work"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -1215,15 +1206,0 @@ install_guide_templates:
      #### TABLE OF CONTENTS
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -1620 +1596,0 @@ rules:
    - "Create table of contents with proper anchor links"
.opencode/commands/create/assets/create_folder_readme_auto.yaml @@ -1634 +1609,0 @@ rules:
    - "Create table of contents with proper anchor links"
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md @@ -441 +419 @@ Verify `--agent write` loads the sk-doc skill, applies the appropriate template
  Prompt summary: As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called Demo Skill. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file and the file contains a TABLE OF CONTENTS plus emoji-prefixed H2 sections.
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md @@ -443 +421 @@ Prompt summary: As an external-AI conductor wanting a template-driven README for
  Expected signals: Exit 0. Write tool.call for the README path. README file exists with TOC and >= 3 emoji-prefixed H2 headers.
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md @@ -18 +18 @@ Templates for creating feature catalogs that combine top-level capability invent
  - **Feature-catalog shaped**: The root file uses frontmatter, an H1 intro paragraph, an unnumbered `TABLE OF CONTENTS`, and numbered all-caps H2 section headers.
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md @@ -226 +217 @@ description: "{OVERVIEW_ONE_LINE}"
  - Use numbered all-caps H2 section headers in the root catalog, with `TABLE OF CONTENTS` as the one intentional unnumbered H2.
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md @@ -238,2 +229 @@ Structure:
  - [ ] Root catalog has `## TABLE OF CONTENTS`
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md @@ -238,2 +229 @@ Structure:
  - [ ] Root catalog uses numbered all-caps H2 section headers after the TOC
.opencode/skills/sk-doc/assets/readme/readme_template.md @@ -68 +67,0 @@ Use this profile for OpenCode skills, package roots and project-level READMEs th
  | Table of contents | READMEs longer than 150 lines | Link only top-level sections |

exec
/bin/zsh -lc "git show 1e58d845af:.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "git show 1e58d845af:.opencode/skills/sk-doc/assets/readme/readme_template.md | sed -n '55,95p;145,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "git show 1e58d845af:.opencode/commands/create/assets/create_folder_readme_auto.yaml | sed -n '520,590p;1200,1225p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1421ms:
2026-05-26 12:41:01.209 xcodebuild[51682:53677912]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:01.328 xcodebuild[51682:53677909] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-ku17Yi3c' (errno=Operation not permitted)
2026-05-26 12:41:01.707 xcodebuild[51746:53678009]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:01.819 xcodebuild[51746:53678002] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
# MCP Code Mode Installation Guide

Complete installation and configuration guide for the Code Mode MCP server. This enables TypeScript-based orchestration of external MCP tools, giving you unified access to MyService, Figma, ClickUp, GitHub, Chrome DevTools and other MCP servers through a single `call_tool_chain()` interface. It delivers 98.7% context reduction and 60% faster execution compared to individual tool calls, with type-safe invocation and automatic tool discovery.

> **Version:** 2.0.0
> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
> **Package**: `@utcp/code-mode-mcp` | **Dependencies**: Node.js 18+, .utcp_config.json

---

## 0. AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the MCP Code Mode server for TypeScript tool orchestration.

Please help me:
1. Check if I have Node.js 18+ installed
2. Verify I have npx available for running MCP servers
3. Create the required configuration files (.utcp_config.json and .env)
4. Configure Code Mode for my AI environment (I'm using: [Claude Code / OpenCode / VS Code Copilot])
5. Add my first MCP server (e.g., MyService, ClickUp, Figma, GitHub)
6. Verify the installation is working with a test search
7. Test a basic tool call using the correct naming pattern

My preferred MCP servers are: [MyService / ClickUp / Figma / GitHub / Chrome DevTools / other]

Guide me through each step with the exact commands and configuration needed.
```

**What the AI will do:**
- Verify Node.js 18+ is available on your system
- Create `.utcp_config.json` configuration file
- Create `.env` file for API keys and secrets (with proper security)
- Configure Code Mode for your specific AI platform
- Add MCP server definitions for your preferred tools
- Test the four available tools: `call_tool_chain`, `search_tools`, `list_tools`, `tool_info`
- Show you the critical naming convention: `{manual_name}.{manual_name}_{tool_name}`
- Demonstrate progressive tool discovery

**Expected setup time:** 10-15 minutes

---

0. [AI-First Install Guide](#0-ai-first-install-guide)
1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Verification](#5-verification)
6. [Usage](#6-usage)
7. [Features](#7-features)
8. [Examples](#8-examples)
9. [Troubleshooting](#9-troubleshooting)
10. [Resources](#10-resources)

---

## 1. OVERVIEW

Code Mode MCP is a TypeScript execution environment that provides unified access to 159 MCP tools across 6 manuals through progressive disclosure. Instead of exposing all tools to your AI context (causing token exhaustion), Code Mode provides a single execution environment where tools are accessed programmatically and loaded on-demand.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Source Repository

| Property             | Value                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **GitHub**           | [universal-tool-calling-protocol/code-mode](https://github.com/universal-tool-calling-protocol/code-mode) |
| **npm (MCP Server)** | `@utcp/code-mode-mcp`                                                                                     |
| **npm (Library)**    | `@utcp/code-mode`                                                                                         |
| **Stars**            | 1.2k+                                                                                                     |
| **License**          | MPL-2.0                                                                                                   |

> **Note**: This is the official UTCP (Universal Tool Calling Protocol) implementation, not to be confused with other "code mode" projects like `replicate/replicate-mcp-code-mode` (Replicate-specific) or `jx-codes/codemode-mcp` (abandoned).

### Current Configuration

| Manual                | Tools   | Package                                 |
| --------------------- | ------- | --------------------------------------- |
| **github**            | 26      | `@modelcontextprotocol/server-github`   |
| **figma**             | 18      | `figma-developer-mcp`                   |
| **chrome_devtools_1** | 26      | `chrome-devtools-mcp@latest`            |
| **chrome_devtools_2** | 26      | `chrome-devtools-mcp@latest` (parallel) |
| **clickup**           | 21      | `@taazkareem/clickup-mcp-server`        |
| **myservice**           | 42      | `mcp-remote` (SSE)                      |
| **Total**             | **159** | **6 manuals**                           |

 succeeded in 1420ms:
2026-05-26 12:41:01.209 xcodebuild[51683:53677911]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:01.328 xcodebuild[51683:53677910] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-7542RM1F' (errno=Operation not permitted)
2026-05-26 12:41:01.707 xcodebuild[51747:53678008]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:01.819 xcodebuild[51747:53678004] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
| Related Resources | Always when links exist | Grouped skills, documents, commands or external references |

Code-folder READMEs are different. Do not force Quick Start, Features, FAQ or Troubleshooting unless the directory has runnable commands or known reader problems. Use [`readme_code_template.md`](./readme_code_template.md).

---

## 3. SKILL AND PROJECT PROFILE

Use this profile for OpenCode skills, package roots and project-level READMEs that need more than a bare overview.

| Profile Block | Good For | Keep It Short By |
|---|---|---|
| `trigger_phrases` | Search, memory and skill routing | 3-8 concrete phrases |
| Key Statistics | Skill counts, tool counts, version facts | Use one compact table |
| How This Compares | Neighboring skills or tools | Compare only reader-relevant differences |
| Key Features | Current capability inventory | Group related features |
| Requirements | Tooling and runtime needs | Separate required from optional |
| Related Skills | Skill graph navigation | Group by relationship type |
| Related Documents | Operator or developer references | Link stable docs, not packet history |
| FAQ | Repeated questions | 3-6 high-value Q&A pairs |

Optional HTML anchors help memory and extraction tools find stable sections. Use them only around long-lived sections.

```markdown
## 1. OVERVIEW

[Section content]

```

---

## 4. WRITING RULES

Write for scanning first.

- Lead with what the thing does.
- Put the fastest useful path before detailed reference.
- Use tables for options, file lists and comparisons.
- Use fenced code blocks with language tags.
- Test commands before documenting them.
title: "[PROJECT_OR_FEATURE_NAME]"
description: "[One-sentence description]"
trigger_phrases:
  - "[search phrase]"
---

# [PROJECT_OR_FEATURE_NAME]

> [One-sentence purpose statement.]

---

## 1. OVERVIEW

[Explain what this is, who it is for and why it exists.]

### Key Statistics

| Metric | Value |
|---|---|
| Status | [Current state] |
| Version | [Version or release channel] |
| Main audience | [Who uses this] |
| Operating modes | [Mode count or short list] |

### How This Compares

| Capability | This Project | Related Option |
|---|---|---|
| [Capability] | [Current behavior] | [Difference] |


---

## 2. QUICK START


 succeeded in 1404ms:
2026-05-26 12:41:01.212 xcodebuild[51694:53677931]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:01.328 xcodebuild[51694:53677930] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Ecz3bdmO' (errno=Operation not permitted)
2026-05-26 12:41:01.707 xcodebuild[51748:53678007]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:01.819 xcodebuild[51748:53678003] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
    purpose: Choose appropriate template based on type
    activities:
    - Select section structure based on readme_type
    - Adapt sections to specific project needs
    - Plan content for each section
    - Identify which optional sections to include
    core_pattern:
      all_types:
      - "Title + Tagline (one-liner description)"
      - "Numbered sections"
      - "Tables for structured data"
      - "Code blocks with language tags"
      - "Horizontal rules between major sections"
    emoji_guidance:
      note: "Optional emoji prefix suggestions (not required in output)"
      examples:
        overview: "📖"
        quick_start: "🚀"
        structure: "📁"
        features: "⚡"
        configuration: "⚙️"
        usage_examples: "💡"
        troubleshooting: "🛠️"
        faq: "❓"
        related_documents: "📚"
    outputs:
    - template_selected
    - sections_planned
    - content_outline

  step_4_content_generation:
    purpose: Write comprehensive README following selected structure
    activities:
    - Write Title + Tagline (concise, clear value proposition)
    - Write each section
    - Create tables for structured data (features, commands, config)
    - Add code blocks with language tags
    - Create ASCII diagrams for architecture/flow visualization
    - Add horizontal rules between major sections
    - Write to target_path
    quality_requirements:
      title: "Clear, concise value proposition"
      sections: "Section headers - numbered format recommended"
      tables: "For structured data (features, commands, config)"
      code_blocks: "Always specify language"
      diagrams: "ASCII for architecture/flow"
      separators: "Horizontal rules between major sections"
    outputs:
    - readme_file: created
    - sections_count: number
    - tables_count: number
    - code_blocks_count: number

  step_5_validation:
    purpose: Verify README quality and completeness
    activities:
    - Structure check (title, sections, separators)
    - Content check (code blocks, tables, no placeholders, valid links)
    - Completeness check (Quick Start, Troubleshooting, FAQ for component/skill)
    - DQI check if script available
    validation_checklist:
      structure:
      - "Title + one-liner tagline present"
      - "All sections numbered"
      - "Horizontal rules between sections"
      content:
      - "All code blocks have language tags"
      - "Tables are properly formatted"
      - "No placeholder text remaining"
      - "Links are valid"
      completeness:

    ## AI-FIRST INSTALL GUIDE

    [AI-First section from template above]

    ---

    ## 1. OVERVIEW

    [2-3 paragraphs explaining what the project is and why to use it]

    ### Key Features

    - **[Feature 1]**: [Description]
    - **[Feature 2]**: [Description]
    - **[Feature 3]**: [Description]

    ### Architecture Overview

    ```
    [ASCII diagram showing how components connect]
    ```

    ### How It Compares

    | Feature | [This Project] | [Alternative 1] | [Alternative 2] |

exec
/bin/zsh -lc "git show 1e58d845af:.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md | nl -ba | sed -n '38,62p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1164ms:
2026-05-26 12:41:12.660 xcodebuild[52511:53679256]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:12.761 xcodebuild[52511:53679255] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-IeHJEnOm' (errno=Operation not permitted)
2026-05-26 12:41:13.067 xcodebuild[52539:53679293]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:13.163 xcodebuild[52539:53679292] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
    38	- Test the four available tools: `call_tool_chain`, `search_tools`, `list_tools`, `tool_info`
    39	- Show you the critical naming convention: `{manual_name}.{manual_name}_{tool_name}`
    40	- Demonstrate progressive tool discovery
    41	
    42	**Expected setup time:** 10-15 minutes
    43	
    44	---
    45	
    46	0. [AI-First Install Guide](#0-ai-first-install-guide)
    47	1. [Overview](#1-overview)
    48	2. [Prerequisites](#2-prerequisites)
    49	3. [Installation](#3-installation)
    50	4. [Configuration](#4-configuration)
    51	5. [Verification](#5-verification)
    52	6. [Usage](#6-usage)
    53	7. [Features](#7-features)
    54	8. [Examples](#8-examples)
    55	9. [Troubleshooting](#9-troubleshooting)
    56	10. [Resources](#10-resources)
    57	
    58	---
    59	
    60	## 1. OVERVIEW
    61	
    62	Code Mode MCP is a TypeScript execution environment that provides unified access to 159 MCP tools across 6 manuals through progressive disclosure. Instead of exposing all tools to your AI context (causing token exhaustion), Code Mode provides a single execution environment where tools are accessed programmatically and loaded on-demand.

exec
/bin/zsh -lc "git grep -n -i 'table of contents\\|## Table of Contents\\|## TABLE OF CONTENTS' 1e58d845af -- .opencode/skills .opencode/commands/create | head -80" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "git grep -n '"'^0'"\\. \\[AI-First Install Guide\\](#0-ai-first-install-guide)' 1e58d845af -- .opencode/skills" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "git grep -n '"'^1'"\\. \\[Overview\\](#1-overview)' 1e58d845af -- .opencode/skills | head -80" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1533ms:
2026-05-26 12:41:20.858 xcodebuild[52781:53679745]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:20.967 xcodebuild[52781:53679740] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Aoxl9VCa' (errno=Operation not permitted)
2026-05-26 12:41:21.343 xcodebuild[52825:53679818]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:21.454 xcodebuild[52825:53679816] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
1e58d845af:.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:53:0. [AI-First Install Guide](#0-ai-first-install-guide)
1e58d845af:.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:46:0. [AI-First Install Guide](#0-ai-first-install-guide)

 succeeded in 1519ms:
2026-05-26 12:41:20.858 xcodebuild[52783:53679748]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:20.967 xcodebuild[52783:53679743] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-aDarLvzt' (errno=Operation not permitted)
2026-05-26 12:41:21.343 xcodebuild[52826:53679819]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:21.454 xcodebuild[52826:53679815] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
1e58d845af:.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:54:1. [Overview](#1-overview)
1e58d845af:.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:47:1. [Overview](#1-overview)

 succeeded in 1552ms:
2026-05-26 12:41:20.858 xcodebuild[52782:53679744]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:20.967 xcodebuild[52782:53679739] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-enljNc4A' (errno=Operation not permitted)
2026-05-26 12:41:21.343 xcodebuild[52827:53679817]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:21.454 xcodebuild[52827:53679814] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
1e58d845af:.opencode/commands/create/assets/create_feature_catalog_auto.yaml:163:    - numbered all-caps H2 sections (no Table of Contents)
1e58d845af:.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:177:    - numbered all-caps H2 sections (no Table of Contents)
1e58d845af:.opencode/commands/create/assets/create_testing_playbook_auto.yaml:165:    - numbered all-caps H2 sections (no Table of Contents)
1e58d845af:.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:179:    - numbered all-caps H2 sections (no Table of Contents)
1e58d845af:.opencode/commands/create/folder_readme.md:471:├─ MUST NOT include a Table of Contents or <!-- ANCHOR --> comments
1e58d845af:.opencode/commands/create/folder_readme.md:477:├─ MUST confirm no Table of Contents was added
1e58d845af:.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:482:Verify `--agent write` writes a sk-doc template-driven README to a temp path with at least 3 emoji-prefixed H2 headers and no table of contents.
1e58d845af:.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:486:Prompt: As an external-AI conductor wanting a template-driven README for a small skill, dispatch `claude -p --agent write` to generate `/tmp/cc-025-readme/README.md` for a fictional skill. Verify the file is written, has at least 3 emoji-prefixed H2 headers, and contains no table of contents. Return a verdict naming the file path and the H2 emoji count.
1e58d845af:.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:488:Expected signals: Dispatch exits 0. README file exists at the requested path. README contains no table of contents section. H2 headers include emojis (per sk-doc template enforcement).
1e58d845af:.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:419:Prompt summary: As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called Demo Skill. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file with emoji-prefixed H2 sections and no table of contents.
1e58d845af:.opencode/skills/deep-review/changelog/v1.9.0.0.md:43:The root playbook claimed 32 scenarios across 6 categories but actually carried 45 files across 8 categories. The two stress-test categories (command-flow stress tests CP-052 through CP-057 and the review-depth v2 rollout DRV-058 through DRV-063) had no body sections and were not listed in the index. The rewrite adds section 15 and section 16 with per-scenario summaries, updates the table of contents and the section 14 index, and corrects the overview count. Filename collisions in the convergence-and-recovery directory (where files 015 and 021 through 023 collided with files in sibling directories under the same numbers but mapping to different DRV IDs) were renamed to match their DRV IDs (030, 032 through 034). Fourteen cross-references in other files that pointed to the old filenames were patched in the same commit.
1e58d845af:.opencode/skills/sk-code/assets/webflow/integrations/lenis_patterns.js:15: * - Table of contents: scroll to anchor with offset
1e58d845af:.opencode/skills/sk-code/references/webflow/implementation/observer_patterns.md:144:- Scroll-based active states (Table of Contents, navigation highlighting)
1e58d845af:.opencode/skills/sk-code/references/webflow/implementation/third_party_integrations.md:200:- Table of Contents smooth scrolling: `src/javascript/cms/table_of_content.js:363`
1e58d845af:.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:217:- Use numbered all-caps H2 section headers in the root catalog. Do not add a Table of Contents.
1e58d845af:.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:229:- [ ] Root catalog uses numbered all-caps H2 section headers (no Table of Contents)
1e58d845af:.opencode/skills/sk-doc/assets/skill/skill_md_template.md:59:- ✅ No table of contents (forbidden in SKILL.md)
1e58d845af:.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1078:□ No table of contents (forbidden in SKILL.md)
1e58d845af:.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1128:| **TOC**               | Forbidden in SKILL.md      | ❌ No table of contents                                                                             |
1e58d845af:.opencode/skills/sk-doc/assets/template_rules.json:562:    "tocHeader": "## TABLE OF CONTENTS",
1e58d845af:.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:482:- [ ] Main playbook has frontmatter and H1 intro (no Table of Contents)
1e58d845af:.opencode/skills/sk-doc/references/feature_catalog_creation.md:25:- no Table of Contents and no `<!-- ANCHOR -->` navigation comments
1e58d845af:.opencode/skills/sk-doc/references/global/core_standards.md:80:- ❌ **NEVER** add a Table of Contents to any document type. Tables of Contents and `<!-- ANCHOR -->` navigation comments are not used in skill documentation.
1e58d845af:.opencode/skills/sk-doc/references/global/validation.md:116:- ✅ `no_toc` - No table of contents section
1e58d845af:.opencode/skills/sk-doc/references/readme_creation.md:188:**Table of Contents**: Do not add a Table of Contents. READMEs rely on their numbered H2 heading hierarchy for navigation; no TOC block and no `<!-- ANCHOR -->` navigation comments are used.
1e58d845af:.opencode/skills/sk-doc/references/readme_creation.md:315:- [ ] No Table of Contents and no `<!-- ANCHOR -->` navigation comments
1e58d845af:.opencode/skills/sk-doc/scripts/extract_structure.py:673:    ('no_toc', 'No table of contents', lambda fm, h, c: not any('TABLE OF CONTENTS' in heading['text'].upper() or 'TOC' == heading['text'].upper() for heading in h)),
1e58d845af:.opencode/skills/sk-doc/scripts/extract_structure.py:682:    ('has_toc', 'Has TABLE OF CONTENTS section', lambda fm, h, c: any('TABLE OF CONTENTS' in heading['text'].upper() or heading['text'].upper() == 'TOC' for heading in h)),
1e58d845af:.opencode/skills/sk-doc/scripts/extract_structure.py:683:    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2 and 'TABLE OF CONTENTS' not in heading['text'].upper()) if any(heading['level'] == 2 for heading in h) else True),
1e58d845af:.opencode/skills/sk-doc/scripts/tests/missing_emojis.md:7:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/sk-doc/scripts/tests/missing_toc.md:3:> README missing TABLE OF CONTENTS section (blocking error)
1e58d845af:.opencode/skills/sk-doc/scripts/tests/missing_toc.md:9:This README is missing the TABLE OF CONTENTS section.
1e58d845af:.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:7:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/sk-doc/scripts/tests/valid_install_guide.md:7:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/sk-doc/scripts/tests/valid_readme.md:7:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/sk-doc/scripts/tests/valid_readme.md:17:- Has TABLE OF CONTENTS section
1e58d845af:.opencode/skills/sk-doc/scripts/validate_document.py:233:    """Validate TABLE OF CONTENTS section."""
1e58d845af:.opencode/skills/sk-doc/scripts/validate_document.py:240:    # Pattern: ## [optional emoji] TABLE OF CONTENTS
1e58d845af:.opencode/skills/sk-doc/scripts/validate_document.py:242:        r'## (?:[^\w\s]\s+)?TABLE OF CONTENTS\s*\n(.*?)(?=\n---|\n## |\Z)',
1e58d845af:.opencode/skills/sk-doc/scripts/validate_document.py:251:            'message': 'Missing TABLE OF CONTENTS section',
1e58d845af:.opencode/skills/sk-doc/scripts/validate_document.py:252:            'fix_hint': 'Add "## TABLE OF CONTENTS" section with linked entries'
1e58d845af:.opencode/skills/sk-git/changelog/CHANGELOG.md:50:- Removed table of contents from README.md (forbidden by sk-doc standards)
1e58d845af:.opencode/skills/system-spec-kit/SKILL.md:455:19. **Enforce ToC policy from validation rules** - Only `research/research.md` may include a Table of Contents section; remove ToC headings from standard spec artifacts
1e58d845af:.opencode/skills/system-spec-kit/mcp_server/.github/hooks/README.md:16:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:134:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:421:      /recovery scenarios|diagnostic commands|table of contents|placeholder|auto-truncated/.test(normalized),
1e58d845af:.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:435:const HARD_DROP_WRAPPER_CUES = /\b(conversation transcript|generic recovery hints|tool telemetry|table of contents|raw tool|repository state|assistant:|user:|tool:|recovery scenarios|diagnostic commands)\b/u;
1e58d845af:.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1070:  if (/\brecovery scenarios|diagnostic commands|table of contents\b/.test(normalizedText)) {
1e58d845af:.opencode/skills/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:262:        "label": "table of contents wrapper",
1e58d845af:.opencode/skills/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:266:        "chunk": "Table of contents continue session, project state snapshot, overview, detailed changes, decisions, conversation, recovery hints, memory metadata. The chunk exists only to help a human scan a long legacy memory file and carries almost no semantic retrieval value by itself."
1e58d845af:.opencode/skills/system-spec-kit/references/templates/template_guide.md:726:11. **Apply ToC policy consistently** - Only `research/research.md` may include a Table of Contents section; keep standard spec artifacts ToC-free
1e58d845af:.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts:240:  { pattern: /^(to promote a memory|epistemic state captured at session start|table of contents)\b/i, label: 'template instructional heading' },
1e58d845af:.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:11:# Description: Enforces that Table of Contents sections appear only in research/research.md.
1e58d845af:.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:37:    local toc_heading_pattern='^[[:space:]]*#{1,6}[[:space:]]*([0-9]+[.)][[:space:]]+)?(table of contents|toc)[[:space:]]*$'
1e58d845af:.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:63:        RULE_REMEDIATION="Remove '## TABLE OF CONTENTS' / '## TOC' sections from spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, and debug-delegation.md. Only research/research.md may include a TOC."
1e58d845af:.opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh:573:            echo "Add or update the Table of Contents using the spec-kit TOC format with anchor links."
1e58d845af:.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json:3:  "sessionSummary": "Phase 1 foundation work focused on two narrow repairs that improve memory quality without widening the remediation packet into unrelated metadata or reviewer behavior. The first repair aligned the OVERVIEW anchor identity so the table of contents, the HTML anchor, and the internal comment marker all point to the same destination. The second repair extracted a shared truncation helper so long session summaries stop at a clean word boundary and carry the canonical Unicode ellipsis instead of drifting between punctuation styles. The fixture describes a realistic verification pass where the helper was reused by the observation summary path, the OVERVIEW owner adopted the same contract, the compiled CLI replay was exercised with explicit JSON input, and the temporary replay artifacts were removed immediately after the check so the packet memory store stayed clean for the real documentation workflow.",
1e58d845af:.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:28:    "## Table of Contents",
1e58d845af:.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:28:    "## Table of Contents",
1e58d845af:.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:28:    "## Table of Contents",
1e58d845af:.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:28:    "## Table of Contents",
1e58d845af:.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:28:    "## Table of Contents",
1e58d845af:.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:141:          '## TABLE OF CONTENTS',
1e58d845af:.opencode/skills/system-spec-kit/scripts/utils/slug-utils.ts:32:  /^table of contents\b/i,
1e58d845af:.opencode/skills/system-spec-kit/templates/README.md:14:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/system-spec-kit/templates/README.md:17:  - [TABLE OF CONTENTS](#table-of-contents)
1e58d845af:.opencode/skills/system-spec-kit/templates/changelog/README.md:13:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/system-spec-kit/templates/examples/README.md:15:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/system-spec-kit/templates/manifest/README.md:13:## TABLE OF CONTENTS
1e58d845af:.opencode/skills/system-spec-kit/templates/stress_test/README.md:11:## TABLE OF CONTENTS

exec
/bin/zsh -lc "git show --format= --unified=0 1e58d845af -- .opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md .opencode/skills/mcp-code-mode/INSTALL_GUIDE.md && printf '\\nPOST mcp-chrome lines:\\n' && git show 1e58d845af:.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md | nl -ba | sed -n '45,68p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2443ms:
2026-05-26 12:41:25.680 xcodebuild[53015:53680188]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:25.778 xcodebuild[53015:53680187] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-7oKyuy0x' (errno=Operation not permitted)
2026-05-26 12:41:26.082 xcodebuild[53017:53680197]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:26.186 xcodebuild[53017:53680196] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
diff --git a/.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md b/.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md
index cc34074754..c74de20152 100644
--- a/.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md
+++ b/.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md
@@ -53,2 +52,0 @@ Not working? Go to [Troubleshooting](#9-troubleshooting).
-## Table of Contents
-
diff --git a/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md b/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
index 8586971fd2..5824f17aac 100644
--- a/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
+++ b/.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
@@ -46,2 +45,0 @@ Guide me through each step with the exact commands and configuration needed.
-## Table of Contents
-

POST mcp-chrome lines:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-MnqWPxHT' (errno=Operation not permitted)
2026-05-26 12:41:26.915 xcodebuild[53081:53680342]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:27.034 xcodebuild[53081:53680341] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-RsqkqKh3' (errno=Operation not permitted)
2026-05-26 12:41:27.353 xcodebuild[53238:53680527]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:27.452 xcodebuild[53238:53680526] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
    45	2. Version output appears: CLI is working
    46	3. In Claude Code, ask: "Take a screenshot of example.com"
    47	4. Screenshot captured: full system is working
    48	
    49	Not working? Go to [Troubleshooting](#9-troubleshooting).
    50	
    51	---
    52	
    53	0. [AI-First Install Guide](#0-ai-first-install-guide)
    54	1. [Overview](#1-overview)
    55	2. [Prerequisites](#2-prerequisites)
    56	3. [Installation](#3-installation)
    57	4. [Configuration](#4-configuration)
    58	5. [Verification](#5-verification)
    59	6. [Usage](#6-usage)
    60	7. [Features](#7-features)
    61	8. [Examples](#8-examples)
    62	9. [Troubleshooting](#9-troubleshooting)
    63	10. [Resources](#10-resources)
    64	
    65	---
    66	
    67	## 1. OVERVIEW
    68	

exec
/bin/zsh -lc 'for f in $(git show --name-only --format= 1e58d845af | rg '"'INSTALL_GUIDE\\.md"'$'"'); do echo \"--- "'$f"; git show "1e58d845af:$f" | nl -ba | sed -n '"'40,70p' | rg '"'^'"\\s*[0-9]+\\s+(## Table of Contents|[0-9]+\\. \\[)'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 7178ms:
2026-05-26 12:41:32.084 xcodebuild[53564:53681076]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:32.189 xcodebuild[53564:53681075] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-X6aeDr1i' (errno=Operation not permitted)
2026-05-26 12:41:32.503 xcodebuild[53626:53681189]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:32.602 xcodebuild[53626:53681185] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
--- .opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-vCKLYzMa' (errno=Operation not permitted)
2026-05-26 12:41:33.315 xcodebuild[53682:53681360]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:33.413 xcodebuild[53682:53681359] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-NVp8g6Cj' (errno=Operation not permitted)
2026-05-26 12:41:33.718 xcodebuild[53684:53681379]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:33.813 xcodebuild[53684:53681373] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
    53	0. [AI-First Install Guide](#0-ai-first-install-guide)
    54	1. [Overview](#1-overview)
    55	2. [Prerequisites](#2-prerequisites)
    56	3. [Installation](#3-installation)
    57	4. [Configuration](#4-configuration)
    58	5. [Verification](#5-verification)
    59	6. [Usage](#6-usage)
    60	7. [Features](#7-features)
    61	8. [Examples](#8-examples)
    62	9. [Troubleshooting](#9-troubleshooting)
    63	10. [Resources](#10-resources)
--- .opencode/skills/mcp-code-mode/INSTALL_GUIDE.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-oeXQWLDz' (errno=Operation not permitted)
2026-05-26 12:41:34.507 xcodebuild[53730:53681441]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:34.600 xcodebuild[53730:53681440] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Or2DKU6k' (errno=Operation not permitted)
2026-05-26 12:41:34.906 xcodebuild[53732:53681450]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:35.004 xcodebuild[53732:53681449] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
    46	0. [AI-First Install Guide](#0-ai-first-install-guide)
    47	1. [Overview](#1-overview)
    48	2. [Prerequisites](#2-prerequisites)
    49	3. [Installation](#3-installation)
    50	4. [Configuration](#4-configuration)
    51	5. [Verification](#5-verification)
    52	6. [Usage](#6-usage)
    53	7. [Features](#7-features)
    54	8. [Examples](#8-examples)
    55	9. [Troubleshooting](#9-troubleshooting)
    56	10. [Resources](#10-resources)
--- .opencode/skills/system-code-graph/INSTALL_GUIDE.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-9FGSicic' (errno=Operation not permitted)
2026-05-26 12:41:35.698 xcodebuild[53774:53681533]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:35.795 xcodebuild[53774:53681532] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-x52otRkr' (errno=Operation not permitted)
2026-05-26 12:41:36.097 xcodebuild[53776:53681542]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:36.198 xcodebuild[53776:53681541] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
--- .opencode/skills/system-skill-advisor/INSTALL_GUIDE.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-3E8VleFu' (errno=Operation not permitted)
2026-05-26 12:41:36.901 xcodebuild[53825:53681617]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:36.998 xcodebuild[53825:53681616] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-DL1b1shT' (errno=Operation not permitted)
2026-05-26 12:41:37.301 xcodebuild[53827:53681626]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:37.396 xcodebuild[53827:53681625] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
--- .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-thcV0tZU' (errno=Operation not permitted)
2026-05-26 12:41:38.087 xcodebuild[53862:53681686]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:38.183 xcodebuild[53862:53681685] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-XMEBjynE' (errno=Operation not permitted)
2026-05-26 12:41:38.499 xcodebuild[53865:53681707]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:38.597 xcodebuild[53865:53681705] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
    42	1. [AI-FIRST INSTALL GUIDE](#1-ai-first-install-guide)
    43	2. [OVERVIEW](#2-overview)
    44	3. [PREREQUISITES](#3-prerequisites)
    45	4. [INSTALLATION](#4-installation)
    46	5. [CONFIGURATION](#5-configuration)
    47	6. [VERIFICATION](#6-verification)
    48	7. [USAGE](#7-usage)
    49	8. [FEATURES](#8-features)
    50	9. [EXAMPLES](#9-examples)
    51	10. [TROUBLESHOOTING](#10-troubleshooting)
    52	11. [RESOURCES](#11-resources)

exec
/bin/zsh -lc "git show --format= --unified=0 1e58d845af -- .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md | sed -n '1,80p' && git show 1e58d845af:.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md | nl -ba | sed -n '34,58p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2449ms:
2026-05-26 12:41:42.517 xcodebuild[54069:53682021] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-CDz8r0WB' (errno=Operation not permitted)
2026-05-26 12:41:42.817 xcodebuild[54083:53682048]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:42.916 xcodebuild[54083:53682047] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
diff --git a/.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md b/.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md
index f01ee17c5f..4198c27cc4 100644
--- a/.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md
+++ b/.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md
@@ -42,2 +41,0 @@ Your AI assistant will:
-## TABLE OF CONTENTS
-
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Q3PvV2E7' (errno=Operation not permitted)
2026-05-26 12:41:43.607 xcodebuild[54104:53682093]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:43.706 xcodebuild[54104:53682092] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-vB9DEWYb' (errno=Operation not permitted)
2026-05-26 12:41:44.022 xcodebuild[54144:53682143]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:44.117 xcodebuild[54144:53682142] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
    34	- Configure the MCP server for your AI platform
    35	- Test semantic search with a sample query
    36	- Troubleshoot native module issues if needed
    37	
    38	**Expected setup time:** 3-5 minutes (clean install), 2-5 minutes (recovery)
    39	
    40	---
    41	
    42	1. [AI-FIRST INSTALL GUIDE](#1-ai-first-install-guide)
    43	2. [OVERVIEW](#2-overview)
    44	3. [PREREQUISITES](#3-prerequisites)
    45	4. [INSTALLATION](#4-installation)
    46	5. [CONFIGURATION](#5-configuration)
    47	6. [VERIFICATION](#6-verification)
    48	7. [USAGE](#7-usage)
    49	8. [FEATURES](#8-features)
    50	9. [EXAMPLES](#9-examples)
    51	10. [TROUBLESHOOTING](#10-troubleshooting)
    52	11. [RESOURCES](#11-resources)
    53	
    54	---
    55	
    56	## 2. OVERVIEW
    57	
    58	Spec Kit Memory is an MCP (Model Context Protocol) server that gives AI assistants semantic memory and context retrieval. It indexes markdown documentation and conversation memories to surface relevant information during AI interactions.

exec
/bin/zsh -lc "git show --format= --unified=0 1e58d845af | perl -ne 'if (/"'^diff --git a'"\\/(.*?) b\\//){"'$f=$1} if (/''^@@/){$h=$_; chomp $h} if (/''^-##'"\\s+TABLE OF CONTENTS|-##\\s+Table of Contents/i){print \""'$f $h $_"}'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1432ms:
2026-05-26 12:41:49.222 xcodebuild[54773:53683144]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:49.329 xcodebuild[54773:53683143] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-0WDzHYmB' (errno=Operation not permitted)
2026-05-26 12:41:49.694 xcodebuild[54775:53683165]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:41:49.810 xcodebuild[54775:53683164] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/README.txt @@ -21,18 +20,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/README.md @@ -24,18 +23,0 @@ Across this skill tree, `/speckit:resume` is the canonical recovery surface for -## TABLE OF CONTENTS
.opencode/skills/cli-claude-code/README.md @@ -18,20 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md @@ -29,21 +28,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/cli-codex/README.md @@ -18,22 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md @@ -32,22 +31,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/cli-devin/README.md @@ -18,22 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md @@ -32,22 +31,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/cli-gemini/README.md @@ -18,21 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/cli-gemini/manual_testing_playbook/manual_testing_playbook.md @@ -29,19 +28,0 @@ The numeric gap at `05` is intentional. cli-gemini has no first-class session-co -## TABLE OF CONTENTS
.opencode/skills/cli-opencode/README.md @@ -18,20 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md @@ -32,22 +31,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/deep-agent-improvement/README.md @@ -19,23 +18,0 @@ Improve an agent the way you ship code: change a copy, measure it, and promote o -## TABLE OF CONTENTS
.opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md @@ -12,9 +11,0 @@ This document combines the current feature inventory for the `deep-agent-improve -## TABLE OF CONTENTS
.opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md @@ -27,20 +25,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/deep-agent-improvement/scripts/lib/README.md @@ -10,7 +9,0 @@ CommonJS helpers shared by sibling deep-agent-improvement CLI scripts. -## TABLE OF CONTENTS
.opencode/skills/deep-ai-council/README.md @@ -19,22 +18,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md @@ -12,15 +11,0 @@ Canonical inventory of what the `deep-ai-council` planning skill does today, gro -## TABLE OF CONTENTS
.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md @@ -24,22 +23,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/deep-ai-council/scripts/tests/README.md @@ -8,7 +7,0 @@ description: "Integration + parity vitests for deep-ai-council orchestration: or -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/README.md @@ -29,24 +28,0 @@ contextType: "general" -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/database/README.md @@ -8,7 +7,0 @@ description: "Persistent SQLite state for deep-loop execution history and conver -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/01-executor-config.md @@ -8,7 +7,0 @@ description: "Parses and normalizes per-iteration executor configuration for nat -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/02-executor-audit.md @@ -8,7 +7,0 @@ description: "Records executor provenance and guards recursive external-CLI disp -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/03-fallback-router.md @@ -8,7 +7,0 @@ description: "Resolves the fallback route when a model exhausts its quota pool. -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/02--prompt-rendering/01-prompt-pack.md @@ -8,7 +7,0 @@ description: "Renders prompt-pack templates with checked placeholder variables." -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/03--validation/01-post-dispatch-validate.md @@ -8,7 +7,0 @@ description: "Validates iteration artifacts after dispatch: checks iteration fil -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/01-atomic-state.md @@ -8,7 +7,0 @@ description: "Writes JSON state files through temp-file, fsync, rename, and clea -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/02-jsonl-repair.md @@ -8,7 +7,0 @@ description: "Repairs corrupted JSONL tails and appends valid records without pr -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/03-loop-lock.md @@ -8,7 +7,0 @@ description: "Provides a single-writer lock with stale-lock detection, heartbeat -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/04-permissions-gate.md @@ -8,7 +7,0 @@ description: "Evaluates pre-dispatch tool calls against packet-local, repo-wide, -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/05--scoring/01-bayesian-scorer.md @@ -8,7 +7,0 @@ description: "Two primitives: computeScore returns a Bayesian success probabilit -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/01-coverage-graph-db.md @@ -8,7 +7,0 @@ description: "Owns the SQLite schema, namespace scoping, node and edge mutations -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/02-coverage-graph-query.md @@ -8,7 +7,0 @@ description: "Builds coverage-gap, contradiction, provenance-chain, unverified-c -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/03-coverage-graph-signals.md @@ -8,7 +7,0 @@ description: "Computes convergence signals, node centrality signals, snapshots, -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/01-convergence-script.md @@ -8,7 +7,0 @@ description: "Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decis -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/02-upsert-script.md @@ -8,7 +7,0 @@ description: "Stores coverage graph nodes and edges from JSON arrays or iteratio -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/03-query-script.md @@ -8,7 +7,0 @@ description: "Reads session-scoped coverage graph views through a direct JSON st -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/04-status-script.md @@ -8,7 +7,0 @@ description: "Reports session-scoped coverage graph health, counts, schema versi -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/01-multi-seat-dispatch.md @@ -8,7 +7,0 @@ description: "Runs seat executors in parallel for one council round; preserves s -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/02-round-state-jsonl.md @@ -8,7 +7,0 @@ description: "Appends per-round JSONL records with a lock-file single-writer gua -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/03-adjudicator-verdict-scoring.md @@ -8,7 +7,0 @@ description: "Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-0 -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/04-cost-guards.md @@ -8,7 +7,0 @@ description: "Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/08--council/05-session-state-hierarchy.md @@ -8,7 +7,0 @@ description: "Creates and validates the ADR-002 session->topic->round state shap -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md @@ -16,14 +15,0 @@ This document combines the current feature inventory for the `deep-loop-runtime` -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/lib/README.md @@ -8,6 +7,0 @@ description: "Domain logic library consumed by scripts and tests across three su -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/lib/council/README.md @@ -8,7 +7,0 @@ description: "Multi-seat dispatch, adjudicator-verdict stability, and cost guard -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/lib/coverage-graph/README.md @@ -8,7 +7,0 @@ description: "Schema, queries, and Bayesian signals for deep-loop convergence de -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md @@ -26,20 +25,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/scripts/README.md @@ -8,8 +7,0 @@ description: "CLI entry points for deep-loop runtime operations: convergence det -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/README.md @@ -8,8 +7,0 @@ description: "Test harnesses for deep-loop-runtime primitives. Grouped by librar -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/council/README.md @@ -8,6 +7,0 @@ description: "Unit tests for the lib/council durability primitives consumed by d -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/fixtures/council-value/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/fixtures/council-value/data/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/helpers/README.md @@ -8,6 +7,0 @@ description: "Shared test-fixture utilities reused across deep-loop-runtime test -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/integration/README.md @@ -8,6 +7,0 @@ description: "Script-invocation and review-depth fixture tests exercising the de -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/lifecycle/README.md @@ -8,6 +7,0 @@ description: "Database open/close + writer-lock lifecycle verification for the d -## TABLE OF CONTENTS
.opencode/skills/deep-loop-runtime/tests/unit/README.md @@ -8,6 +7,0 @@ description: "Per-module unit tests for deep-loop-runtime library code (lib/deep -## TABLE OF CONTENTS
.opencode/skills/deep-research/README.md @@ -18,3 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/deep-research/feature_catalog/feature_catalog.md @@ -12,10 +11,0 @@ This document combines the current feature inventory for the `deep-research` sys -## TABLE OF CONTENTS
.opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md @@ -26,19 +24,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/deep-review/README.md @@ -21,18 +20,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/deep-review/feature_catalog/feature_catalog.md @@ -12,10 +11,0 @@ This document combines the current feature inventory for the `deep-review` syste -## TABLE OF CONTENTS
.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md @@ -28,21 +26,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md @@ -53,2 +52,0 @@ Not working? Go to [Troubleshooting](#9-troubleshooting). -## Table of Contents
.opencode/skills/mcp-chrome-devtools/README.md @@ -20,3 +19,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/mcp-chrome-devtools/manual_testing_playbook/manual_testing_playbook.md @@ -25,19 +24,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md @@ -46,2 +45,0 @@ Guide me through each step with the exact commands and configuration needed. -## Table of Contents
.opencode/skills/mcp-code-mode/README.md @@ -18,22 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md @@ -26,20 +25,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/sk-code-review/README.md @@ -23,17 +22,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md @@ -27,19 +26,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/sk-code/README.md @@ -21,17 +20,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md @@ -28,20 +27,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/sk-doc/README.md @@ -23,17 +22,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md @@ -36,19 +35,0 @@ Canonical reference: .opencode/skills/sk-doc/references/benchmark_creation.md -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/benchmark/source_template.md @@ -30,15 +29,0 @@ Creation reference: .opencode/skills/sk-doc/references/benchmark_creation.md -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md @@ -99,9 +98,0 @@ This document combines the current feature inventory for the `{SYSTEM_SLUG}` sys -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/readme/install_guide_template.md @@ -630,16 +628,0 @@ Guide me through each step with the exact commands I need to run. -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/readme/readme_code_template.md @@ -183,15 +182,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/readme/readme_template.md @@ -160,19 +156,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/skill/skill_readme_template.md @@ -104,18 +102,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md @@ -162,15 +161,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md @@ -16,11 +15,0 @@ Source of truth for routing behavior: `.opencode/skills/sk-doc/SKILL.md` §2 Sma -## TABLE OF CONTENTS
.opencode/skills/sk-doc/references/benchmark_creation.md @@ -27,16 +26,0 @@ Standards and workflow guidance for creating skill-local MCP benchmark folders. -## TABLE OF CONTENTS
.opencode/skills/sk-doc/references/benchmark_creation.md @@ -194,13 +165,0 @@ contextType: "reference" -## TABLE OF CONTENTS
.opencode/skills/sk-doc/references/install_guide_creation.md @@ -12,15 +11,0 @@ Standards and workflow for clear, reliable install guides with validation checkp -## TABLE OF CONTENTS
.opencode/skills/sk-doc/references/readme_creation.md @@ -190,13 +190 @@ Numbered subsections appear inside Feature sections (3.1, 3.2 at H3 and 3.1.1, 3 -## TABLE OF CONTENTS
.opencode/skills/sk-git/README.md @@ -18,3 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md @@ -23,19 +22,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/sk-prompt-small-model/README.md @@ -16,17 +15,0 @@ A thin sentinel skill that gives operators one discoverable entry point for smal -## TABLE OF CONTENTS
.opencode/skills/sk-prompt/README.md @@ -19,19 +18,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md @@ -29,20 +28,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/ARCHITECTURE.md @@ -17,14 +16,0 @@ importance_tier: "important" -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/INSTALL_GUIDE.md @@ -21,18 +20,0 @@ This is the canonical bootstrap guide for the standalone System Code Graph MCP s -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/README.md @@ -19,25 +18,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md @@ -20,13 +19,0 @@ This catalog is the current feature inventory for `.opencode/skills/system-code- -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md @@ -17,22 +16,0 @@ This playbook validates the code graph runtime at `.opencode/skills/system-code- -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/README.md @@ -15,15 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/core/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/handlers/README.md @@ -17,18 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/lib/README.md @@ -18,18 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md @@ -18,17 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/lib/shared/README.md @@ -17,17 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/lib/utils/README.md @@ -17,15 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md @@ -15,12 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md @@ -17,16 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/tests/README.md @@ -17,15 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/tests/__fixtures__/README.md @@ -16,15 +15,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/tests/assets/README.md @@ -16,15 +15,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md @@ -17,15 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-code-graph/mcp_server/tools/README.md @@ -16,16 +15,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/ARCHITECTURE.md @@ -17,14 +16,0 @@ importance_tier: "important" -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md @@ -14,22 +13,0 @@ This is the canonical install + setup guide for the standalone Skill Advisor MCP -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/README.md @@ -21,18 +20,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/04-compat-entrypoint.md @@ -15,10 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md @@ -19,17 +18,0 @@ This catalog is the current inventory for the skill advisor. The package source -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md @@ -17,14 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/manual_testing_playbook/05--auto-update-daemon/005-rebuild-from-source.md @@ -17,13 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/manual_testing_playbook/07--lifecycle-routing/004-schema-migration.md @@ -17,13 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md @@ -30,27 +29,0 @@ Canonical package artifacts: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/README.md @@ -14,15 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/bench/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/compat/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/data/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/database/README.md @@ -15,11 +14,0 @@ This folder holds package-local SQLite runtime state for the standalone Skill Ad -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/handlers/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/auth/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/compat/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/context/README.md @@ -15,17 +14,0 @@ Internal library code for reusable skill behavior. -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/derived/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/README.md @@ -15,17 +14,0 @@ Internal library code for reusable skill behavior. -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/README.md @@ -15,17 +14,0 @@ Test code and validation helpers for this skill area. -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/shared/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/README.md @@ -11,10 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/lib/utils/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/README.md @@ -12,8 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/schemas/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/scripts/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/README.md @@ -15,17 +14,0 @@ Operator and maintenance scripts for this skill. -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/stress_test/search-quality/README.md @@ -15,17 +14,0 @@ Stress test code for exercising high-load or adversarial behavior. -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md @@ -12,12 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/cache/README.md @@ -14,10 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/compat/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/lifecycle/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-fixtures/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/parity/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/python/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/schemas/README.md @@ -13,11 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-skill-advisor/mcp_server/tools/README.md @@ -14,11 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/ARCHITECTURE.md @@ -17,14 +16,0 @@ importance_tier: "important" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/README.md @@ -21,25 +20,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/config/README.md @@ -16,11 +15,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/constitutional/README.md @@ -14,14 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/01--retrieval/12-search-api-surface.md @@ -6,5 +5,0 @@ description: "Covers the stable public search barrel that re-exports hybrid sear -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md @@ -13,7 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md @@ -8,7 +7,0 @@ description: "Covers the full constitutional memory path from `/memory:learn` au -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/09--evaluation-and-measurement/15-evaluation-api-surface.md @@ -8,6 +7,0 @@ description: "The evaluation API surface provides a stable public import boundar -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md @@ -6,5 +5,0 @@ description: "Covers the public bootstrap surface that initializes indexing depe -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md @@ -8,6 +7,0 @@ description: "Stable top-level import surface re-exporting evaluation, indexing, -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md @@ -8,6 +7,0 @@ description: "The embeddings and retry API exposes a stable provider-facing surf -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md @@ -8,8 +7,0 @@ description: "Feature catalog code references embed inline traceability comments -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md @@ -8,7 +7,0 @@ description: "Source-dist alignment enforcement validates that every .js file in -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md @@ -8,7 +7,0 @@ description: "MODULE_MAP.md documents internal module ownership, dependency dire -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md @@ -8,7 +7,0 @@ description: "3-layer defense-in-depth system ensuring spec folder documents gen -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md @@ -8,7 +7,0 @@ description: "Checklist completion verifier for spec folders that enforces P0/P1 -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md @@ -8,7 +7,0 @@ description: "Deterministic shell runbooks for listing, inspecting, and drilling -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/21-eval-runner-cli.md @@ -10,7 +9,0 @@ This document captures the implemented behavior, source references, and remediat -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/22-phase-system-knowledge-node.md @@ -8,7 +7,0 @@ description: "Knowledge node and supporting command/script surface for decomposi -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/23-spec-lifecycle-automation.md @@ -8,7 +7,0 @@ description: "Coordinated shell-script lifecycle for recommending spec depth, cr -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md @@ -8,7 +7,0 @@ description: "Validation orchestrator that detects spec level, loads configured -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md @@ -8,7 +7,0 @@ description: "Operator-facing maintenance and migration command surface for norm -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/26-core-workflow-infrastructure.md @@ -8,7 +7,0 @@ description: "Shared workflow modules that load configuration, gate indexing, sc -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/27-session-extraction-and-enrichment.md @@ -8,7 +7,0 @@ description: "Extractor-layer session enrichment for files, diagrams, and activi -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/28-spec-folder-detection-and-description.md @@ -8,7 +7,0 @@ description: "Spec-folder detection, alignment validation, memory-directory setu -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md @@ -8,7 +7,0 @@ description: "Spec-folder prerequisite validation, native module diagnostics and -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/30-template-composition-system.md @@ -8,7 +7,0 @@ description: "Level contract and inline rendering pipeline that generates Spec K -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md @@ -8,7 +7,0 @@ description: "Operator-facing eval runners and policy checks that measure retrie -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/33-memory-quality-kpi-reporting.md @@ -10,7 +9,0 @@ This document captures the implemented behavior, source references, and remediat -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md @@ -13,7 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/38-codex-hook-freshness-smoke-check.md @@ -13,7 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/39-spec-folder-literal-naming-create-sh-fallback.md @@ -8,7 +7,0 @@ description: "create.sh emits PROVIDE-DESCRIPTIVE-SLUG placeholders and one stde -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/40-spec-folder-literal-naming-ai-derived-slugs.md @@ -8,7 +7,0 @@ description: "Workflow YAMLs and SKILL.md rule 20 require AI agents to propose p -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/41-debug-delegation-scaffold-generator.md @@ -8,7 +7,0 @@ description: "scaffold-debug-delegation.sh generates a structured debug-delegati -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/42-mcp-daemon-rebuild-restart-live-probe.md @@ -8,7 +7,0 @@ description: "Canonical four-part contract that proves an MCP TypeScript fix is -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/43-graph-degraded-stress-cell-isolation.md @@ -8,7 +7,0 @@ description: "Deterministic vitest sweep that exercises all four fallbackDecisio -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/44-embedder-list-registry-inventory.md @@ -8,7 +7,0 @@ description: "embedder_list reports every supported embedder with name, dimensio -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/45-embedder-set-dry-run-and-validation.md @@ -8,7 +7,0 @@ description: "embedder_set plans an embedder swap in dry-run mode without starti -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/46-embedder-status-and-active-pointer.md @@ -8,7 +7,0 @@ description: "embedder_status reports the active embedder pointer plus any in-fl -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/47-orphan-mcp-sweeper-and-launchagent-template.md @@ -8,7 +7,0 @@ description: "Dry-run-first operator runbook and scripts for stale MCP helper cl -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md @@ -8,7 +7,0 @@ description: "Always-surface constitutional rule pack that keeps Spec Kit gate b -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md @@ -12,9 +11,0 @@ This document captures the implemented behavior, source references, and validati -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/09-runtime-config-contract.md @@ -10,7 +9,0 @@ This document captures the implemented behavior, source references, and remediat -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/10-filter-config-contract.md @@ -10,7 +9,0 @@ This document captures the implemented behavior, source references, and remediat -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/12-launcher-idle-timeout.md @@ -8,7 +7,0 @@ description: "Shared MCP server idle self-exit knob for mk-spec-memory, mk_skill -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md @@ -8,7 +7,0 @@ description: "Maps the live runtime safety surface for remediation: preflight ch -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md @@ -8,7 +7,0 @@ description: "Documents the confirmed repair path behind `memory_health`, includ -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/20--remediation-revalidation/03-feedback-driven-revalidation.md @@ -8,7 +7,0 @@ description: "Documents the `memory_validate` feedback loop, including confidenc -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md @@ -8,7 +7,0 @@ description: "Current-state reference for compatibility flags and runtime shims -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md @@ -8,7 +7,0 @@ description: "Embedding startup now uses permanent lazy initialization, while th -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/03-shadow-scoring-retirement.md @@ -8,7 +7,0 @@ description: "The shadow-scoring module now preserves read-only comparison helpe -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md @@ -8,7 +7,0 @@ description: "Documents retired scoring-flag behavior and shim layers that remai -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/05-adaptive-fusion-flag-drift.md @@ -8,7 +7,0 @@ description: "`SPECKIT_ADAPTIVE_FUSION` remains a live runtime flag that selects -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md @@ -13,27 +12,0 @@ This document is the current feature inventory for the Spec Kit Memory system. I -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/README.md @@ -11,13 +10,0 @@ audited_post_018: true -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/150-source-dist-alignment-validation.md @@ -8,8 +7,0 @@ description: "This scenario validates the check-source-dist-alignment.ts script -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/151-module-map-accuracy.md @@ -8,8 +7,0 @@ description: "This scenario validates MODULE_MAP.md content accuracy by spot-che -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/152-no-symlinks-in-lib-tree.md @@ -8,8 +7,0 @@ description: "This scenario validates the no-symlinks policy by confirming zero -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md @@ -8,8 +7,0 @@ description: "This scenario validates the structured JSON summary contract for g -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md @@ -8,8 +7,0 @@ description: "This scenario validates the JSON-primary deprecation posture: rout -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md @@ -46,17 +44,0 @@ Canonical source artifacts: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md @@ -145,3 +142,0 @@ the publication guard helpers used by the evaluation dashboard. -## Table of Contents
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md @@ -42,2 +41,0 @@ Your AI assistant will: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/README.md @@ -17,16 +16,0 @@ importance_tier: "important" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/api/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md @@ -19,16 +18,0 @@ contextType: "reference" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/SOURCE.md @@ -19,16 +18,0 @@ contextType: "reference" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md @@ -22,19 +21,0 @@ contextType: "implementation" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/runtime-measurements.md @@ -19,17 +18,0 @@ contextType: "reference" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab-rerun/benchmark_report.md @@ -18,11 +17,0 @@ Quick re-run of the phase 004 benchmark on the same 50-probe fixture, asking whe -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/SOURCE.md @@ -18,17 +17,0 @@ contextType: "reference" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md @@ -19,19 +18,0 @@ contextType: "reference" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20/benchmark_report.md @@ -20,19 +19,0 @@ contextType: "implementation" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-cap-top-k/benchmark_report.md @@ -20,13 +19,0 @@ Same 50-probe fixture as packets 004 / 007. Same harness. Same MPS sidecar. The -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-fp16-rerank/benchmark_report.md @@ -20,13 +19,0 @@ Three orthogonal MPS unblock attempts tested. All three HOLD. This packet docume -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/benchmark_report.md @@ -18,14 +17,0 @@ Same 50-probe fixture, 3 runs × 50 probes, same harness as phase 004 and the 20 -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/configs/README.md @@ -16,15 +15,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/core/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/data/README.md @@ -11,7 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/database/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/database/migrations/README.md @@ -17,16 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/formatters/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/handlers/README.md @@ -11,14 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md @@ -15,15 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md @@ -14,14 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md @@ -5,11 +4,0 @@ -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md @@ -14,10 +13,0 @@ importance_tier: "normal" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/hooks/devin/README.md @@ -5,9 +4,0 @@ -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md @@ -13,8 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/MODULE_MAP.md @@ -17,13 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/README.md @@ -13,15 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/analytics/README.md @@ -11,12 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/architecture/README.md @@ -12,15 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/cache/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/cache/scoring/README.md @@ -13,8 +12,0 @@ This folder is a compatibility boundary. Scoring logic lives in `lib/scoring/`, -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/chunking/README.md @@ -12,15 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/README.md @@ -15,9 +14,0 @@ Memory lifecycle and attention logic for Spec Kit Memory. This folder turns memo -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/config/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/context/README.md @@ -13,15 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/continuity/README.md @@ -14,15 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/description/README.md @@ -11,11 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/discovery/README.md @@ -11,9 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/embedders/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/enrichment/README.md @@ -11,14 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/errors/README.md @@ -14,10 +13,0 @@ Shared error-handling code for the Spec Kit Memory MCP server. This folder conve -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/eval/README.md @@ -16,10 +15,0 @@ trigger_phrases: -## Table of Contents
.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/README.md @@ -11,11 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/extraction/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/feedback/README.md @@ -11,11 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/governance/README.md @@ -11,14 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md @@ -18,12 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/interfaces/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/ipc/README.md @@ -15,13 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/learning/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/memory/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/merge/README.md @@ -11,11 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/ops/README.md @@ -17,10 +16,0 @@ trigger_phrases: -## Table of Contents
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/providers/README.md @@ -12,15 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/query/README.md @@ -11,10 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/rag/README.md @@ -11,10 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/response/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/routing/README.md @@ -11,11 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/runtime/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/scoring/README.md @@ -12,15 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md @@ -16,15 +15,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md @@ -17,10 +16,0 @@ Four-stage retrieval pipeline behind `memory_search`. It turns a query and pipel -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/session/README.md @@ -14,15 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md @@ -15,15 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/README.md @@ -17,10 +16,0 @@ trigger_phrases: -## Table of Contents
.opencode/skills/system-spec-kit/mcp_server/lib/templates/README.md @@ -11,10 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/test-helpers/README.md @@ -11,7 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/util/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/utils/README.md @@ -18,11 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/lib/validation/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md @@ -13,14 +12,0 @@ importance_tier: "normal" -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md @@ -11,9 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/schemas/README.md @@ -14,14 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/scripts/README.md @@ -23,13 +22,0 @@ This directory contains **only** compatibility wrappers that delegate to canonic -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/stress_test/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/README.md @@ -11,10 +10,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/stress_test/memory/README.md @@ -12,10 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md @@ -12,12 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/stress_test/session/README.md @@ -12,10 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/adversarial/README.md @@ -7,11 +6,0 @@ -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/advisor-fixtures/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/description/fixtures/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/embedders/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/lib/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/lib/runtime/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/providers/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/search/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tests/validation/fixtures/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/tools/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/utils/README.md @@ -15,15 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/README.md @@ -13,14 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/config/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/core/README.md @@ -14,15 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/evals/README.md @@ -15,13 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/extractors/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/graph/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/kpi/README.md @@ -15,11 +14,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/lib/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/loaders/README.md @@ -12,13 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/memory/README.md @@ -14,15 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/observability/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/ops/README.md @@ -13,13 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/optimizer/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/renderers/README.md @@ -14,15 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/resource-map/README.md @@ -7,11 +6,0 @@ -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/rules/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/setup/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/spec-folder/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/spec/README.md @@ -13,14 +12,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/templates/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/test-fixtures/README.md @@ -14,12 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/tests/README.md @@ -14,12 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/types/README.md @@ -14,13 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/utils/README.md @@ -14,12 +13,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/scripts/validation/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/README.md @@ -16,17 +15,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/algorithms/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/contracts/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/embeddings/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/embeddings/adapters/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md @@ -18,15 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/lib/README.md @@ -18,15 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/mcp_server/database/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/parsing/README.md @@ -18,15 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/predicates/README.md @@ -18,16 +17,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/ranking/README.md @@ -12,9 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/scoring/README.md @@ -17,15 +16,0 @@ trigger_phrases: -## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/shared/utils/README.md @@ -12,14 +11,0 @@ trigger_phrases: -## TABLE OF CONTENTS

codex
## Iteration 1 — Correctness (TOC content safety)

Files inspected:
- `.opencode/skills/cli-gemini/README.md`
- `.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/deep-research/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-skill-advisor/README.md`
- `.opencode/skills/deep-loop-runtime/README.md`
- `.opencode/skills/README.md`
- `.opencode/skills/cli-claude-code/README.md`
- `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md`
- `.opencode/skills/deep-review/feature_catalog/feature_catalog.md`
- `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md`
- `.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skills/sk-doc/assets/readme/readme_template.md`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md`
- `.opencode/skills/system-code-graph/ARCHITECTURE.md`
- `.opencode/commands/create/assets/create_folder_readme_auto.yaml`

Method:
- Reviewed `git show --stat 1e58d845af`.
- Inspected named high-risk diffs plus additional README/manual-playbook/feature-catalog/install-guide/template diffs.
- Classified removed `-` lines against the allowed removal set.
- Spot-checked post-commit rendered source around removed TOC blocks for orphaned TOC bodies or incoherent transitions.

Findings:

- [P1] `.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:@@ -53,2 +52,0` — The cleanup removed only the TOC heading, leaving the TOC link list behind as an unlabeled block.
  Evidence: removed `## Table of Contents`; post-commit lines 53-63 still contain `0. [AI-First Install Guide]` through `10. [Resources]`. The intended cleanup was heading plus TOC list, so the file still has the navigation block and now reads less coherently.

- [P1] `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:@@ -46,2 +45,0` — The cleanup removed only the TOC heading, leaving the TOC link list behind as an unlabeled block.
  Evidence: removed `## Table of Contents`; post-commit lines 46-56 still contain `0. [AI-First Install Guide]` through `10. [Resources]`. This is incomplete TOC removal and leaves a bare list between separators.

- [P1] `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:@@ -42,2 +41,0` — The cleanup removed only the TOC heading, leaving the TOC link list behind as an unlabeled block.
  Evidence: removed `## TABLE OF CONTENTS`; post-commit lines 42-52 still contain `1. [AI-FIRST INSTALL GUIDE]` through `11. [RESOURCES]`. The TOC body survived without its heading, so the cleanup did not fully remove the TOC block.

FINDINGS_JSON: {"iteration":1,"dimension":"correctness","p0":0,"p1":3,"p2":0,"verdict":"CONDITIONAL","summary":"Three install guides lost only the TOC heading while retaining the TOC link list as orphaned content."}
hook: Stop
hook: Stop Completed
tokens used
94,213
## Iteration 1 — Correctness (TOC content safety)

Files inspected:
- `.opencode/skills/cli-gemini/README.md`
- `.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/deep-research/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-skill-advisor/README.md`
- `.opencode/skills/deep-loop-runtime/README.md`
- `.opencode/skills/README.md`
- `.opencode/skills/cli-claude-code/README.md`
- `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/deep-ai-council/feature_catalog/FEATURE_CATALOG.md`
- `.opencode/skills/deep-review/feature_catalog/feature_catalog.md`
- `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md`
- `.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skills/sk-doc/assets/readme/readme_template.md`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md`
- `.opencode/skills/system-code-graph/ARCHITECTURE.md`
- `.opencode/commands/create/assets/create_folder_readme_auto.yaml`

Method:
- Reviewed `git show --stat 1e58d845af`.
- Inspected named high-risk diffs plus additional README/manual-playbook/feature-catalog/install-guide/template diffs.
- Classified removed `-` lines against the allowed removal set.
- Spot-checked post-commit rendered source around removed TOC blocks for orphaned TOC bodies or incoherent transitions.

Findings:

- [P1] `.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:@@ -53,2 +52,0` — The cleanup removed only the TOC heading, leaving the TOC link list behind as an unlabeled block.
  Evidence: removed `## Table of Contents`; post-commit lines 53-63 still contain `0. [AI-First Install Guide]` through `10. [Resources]`. The intended cleanup was heading plus TOC list, so the file still has the navigation block and now reads less coherently.

- [P1] `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:@@ -46,2 +45,0` — The cleanup removed only the TOC heading, leaving the TOC link list behind as an unlabeled block.
  Evidence: removed `## Table of Contents`; post-commit lines 46-56 still contain `0. [AI-First Install Guide]` through `10. [Resources]`. This is incomplete TOC removal and leaves a bare list between separators.

- [P1] `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:@@ -42,2 +41,0` — The cleanup removed only the TOC heading, leaving the TOC link list behind as an unlabeled block.
  Evidence: removed `## TABLE OF CONTENTS`; post-commit lines 42-52 still contain `1. [AI-FIRST INSTALL GUIDE]` through `11. [RESOURCES]`. The TOC body survived without its heading, so the cleanup did not fully remove the TOC block.

FINDINGS_JSON: {"iteration":1,"dimension":"correctness","p0":0,"p1":3,"p2":0,"verdict":"CONDITIONAL","summary":"Three install guides lost only the TOC heading while retaining the TOC link list as orphaned content."}
