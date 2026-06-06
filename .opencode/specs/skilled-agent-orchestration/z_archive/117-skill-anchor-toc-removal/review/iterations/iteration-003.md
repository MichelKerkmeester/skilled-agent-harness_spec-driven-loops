OpenAI Codex v0.133.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: medium
reasoning summaries: none
session id: 019e63e8-2258-7682-b9b6-e9e75d690a45
--------
user
Independent code review (READ-ONLY). You may run git, read files, run `python3`/`node` for validation only (no writes). Do NOT modify any file.

# Task
Audit git commit `1e58d845af` (TOC + `<!-- ANCHOR -->` removal across skill docs + standards/config/template/command edits). Find anything broken **by accident**.

This is **Iteration 3 of 10**. Focus: **standards/config + `/create` command consistency** (correctness + maintainability).

# ALREADY KNOWN (do not re-report)
- P1: orphaned numbered-TOC link lists in ~8 files (install guides + READMEs).
- P1: `sk-doc/assets/readme/readme_template.md:76,293` still recommends "optional anchors" (stale vs new no-anchor policy).
Look for OTHER issues.

# This iteration — inspect
1. **`sk-doc/assets/template_rules.json`**: confirm `tocRequired:false` is set for `readme`, `install_guide`, `playbook` and that no doc type still has `tocRequired:true`. Confirm the JSON is valid and no unrelated fields were damaged. (`python3 -c "import json;json.load(open('.opencode/skills/sk-doc/assets/template_rules.json'))"`)
2. **`sk-doc/references/global/core_standards.md`**: TOC policy table + summary should say Never for all types; check for any leftover "Allowed"/"optional" TOC statements that contradict the new policy.
3. **`sk-doc/scripts/tests/test_validator.py`**: the 2 edited cases (missing_toc, single_dash_anchors) should now expect exit 0. Run the suite read-only: `python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py` — confirm it PASSES (11/11). Report if it fails.
4. **`/create` command YAMLs** (`create_folder_readme_auto.yaml`, `create_folder_readme_confirm.yaml`, `create_feature_catalog_*`, `create_testing_playbook_*`, `folder_readme.md`, `README.txt`): confirm no instruction still GENERATES or REQUIRES a TOC; confirm the YAMLs are still valid (`python3 -c "import yaml;yaml.safe_load(open(PATH))"` for each); in `create_folder_readme_confirm.yaml` a checkpoint option "B) Show TABLE OF CONTENTS" was removed and "C) Proceed"→"B) Proceed" relabeled — verify the option menu is consistent (no dangling reference to the removed option or to an option letter that no longer exists).
5. **Broader contradiction sweep**: any other doc that still mandates/recommends a TOC or `<!-- ANCHOR -->` while the policy now forbids them (excluding carve-outs).

# Carve-outs — do NOT flag
`system-spec-kit/templates/**` anchors; `sk-doc/scripts/tests/**` TOC fixtures (they SHOULD still have TOCs — that is correct test data); `research/research.md` ToC; Webflow "Table of Contents" in `sk-code`; inline anchor *mentions* documenting the live spec-kit anchor system (grep/sed examples, validation-rule descriptions in system-spec-kit).

# Output (stdout only)
1. "## Iteration 3 — Standards/config + /create consistency": what was inspected/run, results.
2. Per finding: `- [P0|P1|P2] <file>:<line> — <claim>` + evidence + why.
3. If none: "No NEW defects found in this dimension/sample."
4. FINAL LINE exactly:
`FINDINGS_JSON: {"iteration":3,"dimension":"correctness","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`

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
SKILL ROUTING: sk-doc + sk-code-review. I’ll use `sk-doc` for the documentation/template policy checks and `sk-code-review` for findings-first audit discipline; this is read-only, so no spec-folder gate applies.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code-review
description: "Stack-agnostic code-review baseline: findings-first severity, mandatory security/correctness minimums, sk-code evidence."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code-review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-surface, sk-code -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal findings-first review baseline paired with `sk-code` surface standards evidence for the detected code surface.

## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
- A workflow dispatches `@review` for pre-commit or gate validation.
- A user requests security/correctness risk analysis before merge.
- A user wants severity-ranked findings with file:line evidence.

### Keyword Triggers

`review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `request changes`, `findings`, `blocking issues`, `merge readiness`

### Use Cases

1. Review-only pass: findings-first output with no code edits.
2. Gate validation: score + pass/fail recommendation for orchestrated workflows.
3. Focused risk pass: security, concurrency, correctness, or removal-focused review.

### When NOT to Use

- Feature implementation without review intent.
- Pure documentation editing where code behavior is not being assessed.
- Git-only workflow tasks (branching, rebasing, commit hygiene) without code-quality evaluation intent.

---

## 2. SMART ROUTING


### Primary Detection Signal

Review behavior follows a baseline+surface-evidence model:

- Baseline (always): `sk-code-review` findings-first doctrine.
- Surface standards evidence (when available): `sk-code` detected surface resources.
- Unknown surfaces: review against baseline security/correctness only and disclose uncertainty.

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Load `sk-code-review` baseline + `sk-code` surface evidence. The dispatcher / agent assembling the sk-code-review prompt MUST prepend `CODE-REVIEW\n\n` as the first two lines of the rendered prompt before the reviewer LLM sees it. Reference resources stay unchanged.
    +- STEP 1: Score intents (top-2 when ambiguity delta <= 1.0)
    +- Phase 1: Scope and baseline checks
    +- Phase 2: Overlay alignment
    +- Phase 3: Findings-first analysis
    +- Phase 4: Output contract and next action
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies weighted intent scoring.

Knowledge is organized by domain mapping:

```text
references/review_core.md
references/review_ux_single_pass.md
references/*_checklist.md
assets/review/...
```

- `references/review_core.md` for shared doctrine consumed by both `@review` and `@deep-review`.
- `references/review_ux_single_pass.md` for interactive single-pass review behavior.
- `references/` for baseline review flow, severity contracts, and risk checklists.
- `assets/` for optional reusable templates/checklists (if present in this skill).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation, including security/correctness reviews | `references/review_core.md`, `references/review_ux_single_pass.md`, `references/security_checklist.md`, `references/code_quality_checklist.md`, `references/fix-completeness-checklist.md` |
| CONDITIONAL | Intent score indicates need | `references/solid_checklist.md`, `references/code_quality_checklist.md`, `references/removal_plan.md`, `references/test_quality_checklist.md` |
| ON_DEMAND | Explicit deep-dive request | Full mapped reference set |

### Precedence Matrix

| Rule Type | Source of Truth | Behavior |
| --- | --- | --- |
| Security/correctness minimums | `sk-code-review` baseline | Always enforced; never relaxed by surface guidance |
| Surface style/process conventions | `sk-code` detected surface | Surface guidance overrides baseline generic style/process advice |
| Verification/build/test commands | `sk-code` detected surface | Surface commands are authoritative for the detected surface |
| Ambiguous conflicts | Escalation | Ask for clarification; do not guess |

### Unknown Fallback Checklist

If intent/stack detection is unclear, request:

1. Review target scope (full diff, staged files, commit range, or explicit file list).
2. Primary risk class (security, correctness, performance, maintainability).
3. Architecture lens priority (KISS/DRY/SOLID strict or optional).
4. Stack/context (system code, web/frontend, or other/full-stack).
5. Desired output mode (findings-only or findings + gated fix follow-up).

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
# Discover resources recursively across references and assets.
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCES = [
    "references/review_core.md",
    "references/review_ux_single_pass.md",
    "references/security_checklist.md",
    "references/code_quality_checklist.md",
    "references/fix-completeness-checklist.md",
]

INTENT_SIGNALS = {
    "SECURITY": {"weight": 5, "keywords": ["security", "auth", "injection", "vulnerability", "race"]},
    "QUALITY": {"weight": 4, "keywords": ["correctness", "bug", "regression", "performance", "boundary", "contract", "breaking change", "backward compatible", "compatibility"]},
    "KISS": {"weight": 3, "keywords": ["kiss", "simple", "simplicity", "over-engineer", "overengineering"]},
    "DRY": {"weight": 3, "keywords": ["dry", "duplication", "duplicate", "copy-paste", "repeated logic"]},
    "SOLID": {"weight": 3, "keywords": ["solid", "architecture", "design", "coupling", "cohesion", "module", "adapter", "interface", "abstraction", "responsibility", "dependency", "boundary"]},
    "REMOVAL": {"weight": 3, "keywords": ["remove", "dead code", "cleanup", "deprecate"]},
    "TESTING": {"weight": 3, "keywords": ["test", "tests", "testing", "coverage", "assertion", "mock", "stub", "fixture", "test quality", "brittle"]},
}

RESOURCE_MAP = {
    "SECURITY": ["references/security_checklist.md"],
    "QUALITY": ["references/code_quality_checklist.md"],
    "KISS": ["references/code_quality_checklist.md"],
    "DRY": ["references/code_quality_checklist.md"],
    "SOLID": ["references/solid_checklist.md"],
    "REMOVAL": ["references/removal_plan.md"],
    "TESTING": ["references/test_quality_checklist.md"],
}

ON_DEMAND_KEYWORDS = ["deep review", "full review", "all checks", "comprehensive", "flag false positives", "blocking regressions", "list findings", "read-only only", "underrepresented", "scope correctly"]
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm review scope (diff/staged/files/commit range)",
    "Confirm risk priority (security/correctness/performance/maintainability/test quality/contract safety)",
    "Confirm architecture lens (KISS/DRY/SOLID required or optional)",
    "Confirm stack context (system-code/web/full-stack)",
    "Confirm findings-only vs findings+fix follow-up",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "description", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUALITY"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def detect_surface_evidence(task, workspace_files=None, changed_files=None) -> str:
    text = _task_text(task)
    files = " ".join((workspace_files or []) + (changed_files or [])).lower()

    if ".opencode/" in files or "jsonc" in text or "mcp" in text:
        return "sk-code:<surface>"
    if any(term in text for term in ["frontend", "web", "css", "dom", "browser"]) or any(
        marker in files for marker in ["next.config", "vite.config", "package.json", "src/"]
    ):
        return "sk-code:<surface>"
    return "sk-code:<surface>"

def route_review_resources(task, workspace_files=None, changed_files=None):
    inventory = discover_markdown_resources()
    text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)

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

exec
/bin/zsh -lc 'git status --short && git rev-parse --show-toplevel' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 3243ms:
2026-05-26 12:50:30.636 xcodebuild[93820:53753675]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:30.840 xcodebuild[93820:53753674] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-YGStTnop' (errno=Operation not permitted)
2026-05-26 12:50:31.270 xcodebuild[93828:53753702]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:31.389 xcodebuild[93828:53753701] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
?? .opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-s0WkDCqQ' (errno=Operation not permitted)
2026-05-26 12:50:32.430 xcodebuild[94052:53754133]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:32.557 xcodebuild[94052:53754132] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-mxsb1xbx' (errno=Operation not permitted)
2026-05-26 12:50:32.953 xcodebuild[94084:53754208]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:33.062 xcodebuild[94084:53754207] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

codex
I’ve got the review skills loaded. Git is noisy because the read-only sandbox blocks Apple’s temp/cache probes, but the actual repo commands are still returning data, so I’m treating those warnings as environmental noise unless a command exits nonzero.
exec
/bin/zsh -lc "rg --files .opencode | rg 'create_(folder_readme|feature_catalog|testing_playbook)|folder_readme\\.md"'$|README'"\\.txt"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/agents/README.txt
.opencode/commands/create/assets/create_folder_readme_auto.yaml
.opencode/commands/create/assets/create_testing_playbook_auto.yaml
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml
.opencode/commands/create/assets/create_feature_catalog_auto.yaml
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml
.opencode/commands/create/assets/create_folder_readme_confirm.yaml
.opencode/commands/create/folder_readme.md
.opencode/commands/create/README.txt
.opencode/commands/README.txt
.opencode/commands/speckit/README.txt
.opencode/commands/memory/README.txt

exec
/bin/zsh -lc 'git show --stat --name-only --format=fuller 1e58d845af' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "python3 -c \"import json;json.load(open('.opencode/skills/sk-doc/assets/template_rules.json'))\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1718ms:
2026-05-26 12:50:40.375 xcodebuild[94473:53754890]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:40.540 xcodebuild[94473:53754888] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-8kM16ih9' (errno=Operation not permitted)
2026-05-26 12:50:40.984 xcodebuild[94682:53755179]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:41.118 xcodebuild[94682:53755176] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.

 succeeded in 1759ms:
2026-05-26 12:50:40.375 xcodebuild[94472:53754891]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:40.541 xcodebuild[94472:53754889] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-5mV0SZ3m' (errno=Operation not permitted)
2026-05-26 12:50:40.984 xcodebuild[94683:53755180]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:41.118 xcodebuild[94683:53755177] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
commit 1e58d845af44255e32e071b3d69d1c19e76d4ac6
Author:     MichelKerkmeester <82775228+MichelKerkmeester@users.noreply.github.com>
AuthorDate: Tue May 26 11:55:15 2026 +0200
Commit:     MichelKerkmeester <82775228+MichelKerkmeester@users.noreply.github.com>
CommitDate: Tue May 26 11:55:15 2026 +0200

    docs(117): remove TOC blocks + HTML anchor comments from skill docs
    
    Apply the 117-skill-anchor-toc-removal pass: strip unnumbered TABLE OF CONTENTS
    blocks and HTML `<!-- ANCHOR -->` comments from skill docs across the corpus, and
    update sk-doc standards/templates/config so they are not reintroduced.
    
    ~860 markdown docs + sk-doc standards/config, plus the 117 spec packet
    (001-standards-templates-config, 002-toc-removal, 003-anchor-comment-removal,
    004-verification-reconciliation).
    
    Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

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
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/native-recommend-happy-path.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/native-status-transitions.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/native-validate-slices.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/ambiguous-brief-rendering.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/lifecycle-redirect-metadata.md
.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/advisor-status-rebuild-separation.md
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

 succeeded in 2045ms:
2026-05-26 12:50:40.393 xcodebuild[94474:53754907]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:40.553 xcodebuild[94474:53754896] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-7qQQIgtY' (errno=Operation not permitted)
2026-05-26 12:50:40.984 xcodebuild[94681:53755178]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:41.118 xcodebuild[94681:53755175] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
============================================================
DOCUMENTATION VALIDATOR TEST SUITE
============================================================
Validator: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/scripts/validate_document.py
Test files: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/scripts/tests
Test cases: 11
------------------------------------------------------------
  [PASS] ✓ valid_readme.md
  [PASS] ✓ valid_skill.md
  [PASS] ✓ missing_toc.md
  [PASS] ✓ single_dash_anchors.md
  [PASS] ✓ missing_emojis.md
  [PASS] ✓ missing_sections.md
  [PASS] ✓ valid_command.md
  [PASS] ✓ valid_install_guide.md
  [PASS] ✓ command/auto_detect_command.md
  [PASS] ✓ valid_spec.md
  [PASS] ✓ specs/auto_detect_spec.md
------------------------------------------------------------
SUMMARY: 11/11 tests passed

============================================================
ALL TESTS PASSED
============================================================

codex
The requested validator suite passes 11/11, including the two edited cases. Next I’m checking the policy/config text and the `/create` assets directly, because the likely accident here is stale generation language rather than syntax.
exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/assets/template_rules.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "version": "1.2.0",
     3	  "description": "Machine-readable template specifications for automated documentation validation - aligned with all 9 templates",
     4	  "documentTypes": {
     5	    "readme": {
     6	      "description": "README.md files for projects, components, and features",
     7	      "requiredSections": [
     8	        "overview"
     9	      ],
    10	      "recommendedSections": [
    11	        "quick_start",
    12	        "troubleshooting",
    13	        "related"
    14	      ],
    15	      "optionalSections": [
    16	        "structure",
    17	        "features",
    18	        "configuration",
    19	        "usage_examples",
    20	        "faq"
    21	      ],
    22	      "sectionEmojis": {
    23	        "overview": "\ud83d\udcd6",
    24	        "quick_start": "\ud83d\ude80",
    25	        "structure": "\ud83d\udcc1",
    26	        "features": "\u26a1",
    27	        "configuration": "\u2699\ufe0f",
    28	        "usage_examples": "\ud83d\udca1",
    29	        "usage": "\ud83d\udca1",
    30	        "troubleshooting": "\ud83d\udee0\ufe0f",
    31	        "faq": "\u2753",
    32	        "related_documents": "\ud83d\udcda",
    33	        "related_resources": "\ud83d\udd17",
    34	        "related": "\ud83d\udcda",
    35	        "patterns": "\ud83d\udca1",
    36	        "maintenance": "\ud83d\udd04",
    37	        "best_practices": "\ud83c\udf93",
    38	        "complete_template": "\ud83d\udccb",
    39	        "checklist": "\u2705"
    40	      },
    41	      "sectionAliases": {
    42	        "related documents": "related",
    43	        "related resources": "related",
    44	        "related_documents": "related",
    45	        "related_resources": "related",
    46	        "usage examples": "usage_examples",
    47	        "quick start": "quick_start",
    48	        "best practices": "best_practices",
    49	        "best practices summary": "best_practices",
    50	        "complete template": "complete_template",
    51	        "readme checklist": "checklist",
    52	        "readme maintenance": "maintenance"
    53	      },
    54	      "tocRequired": false,
    55	      "tocAnchorFormat": "double_dash",
    56	      "tocUppercaseRequired": true,
    57	      "h2EmojiRequired": false,
    58	      "h2UppercaseRequired": true,
    59	      "firstSectionName": "overview",
    60	      "lastSectionPattern": "related"
    61	    },
    62	    "skill": {
    63	      "description": "SKILL.md files for OpenCode skills",
    64	      "requiredSections": [
    65	        "when_to_use",
    66	        "smart_routing",
    67	        "how_it_works",
    68	        "rules"
    69	      ],
    70	      "recommendedSections": [
    71	        "success_criteria",
    72	        "integration_points",
    73	        "related_resources"
    74	      ],
    75	      "optionalSections": [
    76	        "external_resources"
    77	      ],
    78	      "sectionEmojis": {
    79	        "when_to_use": "\ud83c\udfaf",
    80	        "smart_routing": "\ud83e\udded",
    81	        "how_it_works": "\ud83d\udee0\ufe0f",
    82	        "rules": "\ud83d\udccb",
    83	        "success_criteria": "\ud83c\udfc6",
    84	        "integration_points": "\ud83d\udd0c",
    85	        "external_resources": "\ud83d\udcda",
    86	        "related_resources": "\ud83d\udd17",
    87	        "common_pitfalls": "\u26a0\ufe0f",
    88	        "quality_checklist": "\ud83d\udd0d"
    89	      },
    90	      "sectionAliases": {
    91	        "when to use": "when_to_use",
    92	        "smart routing": "smart_routing",
    93	        "smart_routing_references": "smart_routing",
    94	        "smart_routing_&_references": "smart_routing",
    95	        "smart_routing_and_references": "smart_routing",
    96	        "smart routing & references": "smart_routing",
    97	        "how it works": "how_it_works",
    98	        "success criteria": "success_criteria",
    99	        "integration points": "integration_points",
   100	        "external resources": "external_resources",
   101	        "related resources": "related_resources",
   102	        "common pitfalls": "common_pitfalls",
   103	        "quality checklist": "quality_checklist",
   104	        "quality checklist & quick reference": "quality_checklist"
   105	      },
   106	      "tocRequired": false,
   107	      "h2EmojiRequired": false
   108	    },
   109	    "command": {
   110	      "description": "Command files in .opencode/commands/ folders",
   111	      "requiredSections": [
   112	        "purpose",
   113	        "instructions"
   114	      ],
   115	      "recommendedSections": [
   116	        "contract",
   117	        "examples",
   118	        "notes"
   119	      ],
   120	      "optionalSections": [
   121	        "workflow",
   122	        "reference",
   123	        "related_commands",
   124	        "tool_signatures",
   125	        "routing",
   126	        "docs",
   127	        "input"
   128	      ],
   129	      "sectionEmojis": {
   130	        "purpose": "\ud83c\udfaf",
   131	        "contract": "\ud83d\udcdd",
   132	        "workflow": "\ud83d\udcca",
   133	        "workflow_overview": "\ud83d\udd0d",
   134	        "instructions": "\u26a1",
   135	        "reference": "\ud83d\udccc",
   136	        "examples": "\ud83d\udd0d",
   137	        "example_usage": "\ud83d\udd0d",
   138	        "example_output": "\ud83d\udcca",
   139	        "related_commands": "\ud83d\udd17",
   140	        "related_resources": "\ud83d\udd17",
   141	        "tool_signatures": "\ud83d\udd27",
   142	        "routing": "\ud83d\udd00",
   143	        "argument_routing": "\ud83d\udd00",
   144	        "mode_detection": "\ud83d\udd00",
   145	        "docs": "\ud83d\udcda",
   146	        "full_documentation": "\ud83d\udcda",
   147	        "input": "\ud83d\udccb",
   148	        "user_input": "\ud83d\udccb",
   149	        "notes": "\ud83d\udccc",
   150	        "failure_recovery": "\ud83d\udd27",
   151	        "error_handling": "\u26a0\ufe0f",
   152	        "templates_used": "\ud83d\udcc1",
   153	        "completion_report": "\ud83d\udcca",
   154	        "validation_checklist": "\u2705",
   155	        "best_practices": "\ud83d\udccb",
   156	        "key_behaviors": "\u26a1",
   157	        "context_loading": "\ud83d\udcc1",
   158	        "safety_features": "\ud83d\udee1\ufe0f"
   159	      },
   160	      "sectionAliases": {
   161	        "example usage": "examples",
   162	        "example output": "examples",
   163	        "example_usage": "examples",
   164	        "example_output": "examples",
   165	        "workflow overview": "workflow",
   166	        "related commands": "related_commands",
   167	        "related resources": "related_resources",
   168	        "tool signatures": "tool_signatures",
   169	        "argument routing": "routing",
   170	        "argument dispatch": "routing",
   171	        "mode detection": "routing",
   172	        "mode detection & routing": "routing",
   173	        "full documentation": "docs",
   174	        "user input": "input",
   175	        "failure recovery": "failure_recovery",
   176	        "error handling": "error_handling",
   177	        "templates used": "templates_used",
   178	        "completion report": "completion_report",
   179	        "validation checklist": "validation_checklist",
   180	        "best practices summary": "best_practices",
   181	        "key behaviors": "key_behaviors",
   182	        "context loading": "context_loading",
   183	        "safety features": "safety_features"
   184	      },
   185	      "tocRequired": false,
   186	      "h2EmojiRequired": false,
   187	      "frontmatterRequired": true,
   188	      "frontmatterFields": {
   189	        "required": [
   190	          "description"
   191	        ],
   192	        "recommended": [
   193	          "argument-hint",
   194	          "allowed-tools"
   195	        ],
   196	        "optional": [
   197	          "name",
   198	          "model",
   199	          "version",
   200	          "disable-model-invocation"
   201	        ]
   202	      }
   203	    },
   204	    "install_guide": {
   205	      "description": "Installation guide files for MCP servers, plugins, and tools",
   206	      "requiredSections": [
   207	        "overview",
   208	        "prerequisites",
   209	        "installation",
   210	        "verification"
   211	      ],
   212	      "recommendedSections": [
   213	        "configuration",
   214	        "troubleshooting",
   215	        "related_resources"
   216	      ],
   217	      "optionalSections": [
   218	        "quick_start",
   219	        "upgrade",
   220	        "uninstallation",

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/references/global/core_standards.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: Core Standards - Structure and Validation Rules
     3	description: Filename conventions, document type detection, and structural validation rules for markdown documentation.
     4	---
     5	
     6	# Core Standards - Structure and Validation Rules
     7	
     8	Filename conventions, document type detection, and structural validation rules for markdown documentation.
     9	
    10	---
    11	
    12	## 1. OVERVIEW
    13	
    14	### What Are Core Standards?
    15	
    16	Core standards define the structural foundation for all OpenCode skill documentation. These standards ensure consistency, machine-readability, and quality across all documentation types through enforced conventions.
    17	
    18	**Core Purpose**:
    19	- **Structural validity** - Consistent markdown structure across all document types
    20	- **Type-specific rules** - Tailored requirements for SKILL, Knowledge, Command, Spec, README files
    21	- **Quality gates** - Filename, frontmatter, and heading standards
    22	
    23	> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation.md § Progressive Disclosure](../skill_creation.md#progressive-disclosure).
    24	
    25	This reference provides deep-dive technical guidance on structure validation, document type detection, and quality enforcement.
    26	
    27	---
    28	
    29	## 2. FILENAME CONVENTIONS
    30	
    31	**Rule**: lowercase snake_case for all `.md` files
    32	
    33	**Transformations**:
    34	1. ALL CAPS → lowercase: `README.MD` → `readme.md`
    35	2. Hyphens → underscores: `my-document.md` → `my_document.md`
    36	3. Mixed case → snake_case: `MyDocument.md` → `my_document.md`
    37	4. Spaces → underscores: `my document.md` → `my_document.md`
    38	5. Multiple underscores → single: `my__doc.md` → `my_doc.md`
    39	
    40	**Exceptions** (never modify):
    41	- `README.md` (standard convention)
    42	- `SKILL.md` (in `.opencode/skills/` only)
    43	
    44	---
    45	
    46	## 3. DOCUMENT TYPE DETECTION
    47	
    48	**Priority order** (highest to lowest):
    49	
    50	| Priority | Pattern | Type | Example |
    51	|----------|---------|------|---------|
    52	| 1 | Exact filename | README → readme | `/any/path/README.md` |
    53	| 1 | Exact filename | SKILL → skill | `.opencode/skills/*/SKILL.md` |
    54	| 1 | Exact filename | llms.txt → llmstxt | `/any/path/llms.txt` |
    55	| 2 | Directory path | `.opencode/commands/**/*.md` → command | `.opencode/commands/deploy.md` |
    56	| 2 | Directory path | `knowledge/*.md` → knowledge | `knowledge/api.md` |
    57	| 2 | Directory path | `specs/**/*.md` → spec | `specs/042/spec.md` |
    58	| 3 | Parent directory | `*/specs/*` → spec | `project/specs/plan.md` |
    59	| 4 | Default | `*.md` → generic | Any other `.md` file |
    60	
    61	**Enforcement Levels:**
    62	- **Strict**: No violations allowed, blocks processing
    63	- **Moderate**: Critical violations block, minor issues auto-fixed
    64	- **Loose**: Best-effort validation, non-blocking
    65	- **Flexible**: Minimal validation, user preference respected
    66	
    67	**Enforcement levels by type**:
    68	
    69	| Type | Enforcement | Frontmatter | H1 Subtitle | TOC Policy | Blocks |
    70	|------|-------------|-------------|-------------|------------|--------|
    71	| README | Flexible | None | Optional | ❌ Never | No |
    72	| SKILL | Strict | Required | Required | ❌ Never | Yes |
    73	| llms.txt | Strict | Forbidden | N/A | ❌ Never | Yes |
    74	| Knowledge | Moderate | Forbidden | Required | ❌ Never | Yes |
    75	| Command | Strict | Required | Forbidden | ❌ Never | Yes |
    76	| Spec | Loose | Optional | Optional | ❌ Never | No |
    77	| Generic | Flexible | Optional | Optional | ❌ Never | No |
    78	
    79	**TOC Policy Summary**:
    80	- ❌ **NEVER** add a Table of Contents to any document type. Tables of Contents and `<!-- ANCHOR -->` navigation comments are not used in skill documentation.
    81	
    82	**Manual override**: Use `--type=` flag with validation scripts (e.g., `scripts/quick_validate.py --type=skill document.md`)
    83	
    84	---
    85	
    86	## 4. STRUCTURAL VIOLATIONS
    87	
    88	### Safe Auto-Fixes (Non-Blocking)
    89	
    90	**Applied automatically, logged, execution continues**:
    91	
    92	1. **Filename violations** - Convert to snake_case
    93	2. **H2 case** - Convert to ALL CAPS: `## when to use` → `## WHEN TO USE`
    94	3. **Missing separators** - Add `---` between major H2 sections (not between H3 subsections)
    95	
    96	### Critical Violations (Blocking)
    97	
    98	**Execution stops, manual fix required**:
    99	
   100	**SKILL type**:
   101	- Missing YAML frontmatter
   102	- Missing required fields: `name`, `description`
   103	- H1 missing subtitle
   104	- Missing required sections: WHEN TO USE, HOW IT WORKS, RULES
   105	- Wrong section order
   106	
   107	**Knowledge type**:
   108	- Has YAML frontmatter (should not have)
   109	- H1 missing subtitle
   110	- H2 sections not numbered
   111	- Multiple H1 headers
   112	
   113	**Command type**:
   114	- Missing YAML frontmatter
   115	- Missing required fields: `description`
   116	- H1 has subtitle (should not have)
   117	- Missing required sections: INPUTS, WORKFLOW, OUTPUTS
   118	
   119	**Fix template** (frontmatter):
   120	```yaml
   121	---
   122	name: skill-name
   123	description: Brief description
   124	allowed-tools: Read, Write, Edit
   125	---
   126	```
   127	
   128	**Fix template** (section order for SKILL):
   129	```markdown
   130	## 1. CAPABILITIES OVERVIEW
   131	## 2. SMART ROUTING
   132	## 3. REFERENCES
   133	## 4. WHEN TO USE
   134	## 5. HOW TO USE
   135	## 6. RULES
   136	## 7. SUCCESS CRITERIA
   137	## 8. INTEGRATION POINTS
   138	## 9. ADDITIONAL RESOURCES
   139	## 10. QUICK START
   140	```
   141	
   142	**Note**: Not all sections are required. Minimum required sections: WHEN TO USE, HOW TO USE, RULES.
   143	
   144	---
   145	
   146	## 5. COMMON VIOLATIONS QUICK REFERENCE
   147	
   148	| Violation | Detection | Fix | Auto |
   149	|-----------|-----------|-----|------|
   150	| ALL CAPS filename | `[A-Z]+\.md` | Lowercase | ✅ |
   151	| Hyphenated filename | `-` in filename | Replace with `_` | ✅ |
   152	| Missing frontmatter (SKILL) | No `---` at line 1 | Add YAML block | ❌ Manual |
   153	| H1 no subtitle (SKILL/Knowledge) | Single `#` line | Add ` - Subtitle` (Format: `# Name - Brief Description`) | ❌ Manual |
   154	| Multiple H1 | Count `^#\s` > 1 | Remove extras | ❌ Manual |
   155	| H2 lowercase | `## [a-z]` | ALL CAPS | ✅ |
   156	| Missing separator | No `---` between sections | Insert `---` | ✅ |
   157	| Wrong section order | Sections out of sequence | Reorder | ❌ Manual |
   158	| Skipped heading level | H2 → H4 | Add H3 | ❌ Manual |
   159	| Frontmatter in Knowledge | Knowledge file has `---` | Remove YAML | ❌ Manual |
   160	| No subtitle in Command | Command H1 has ` -` | Remove subtitle | ❌ Manual |
   161	| Missing RULES section | SKILL without `## RULES` | Add section | ❌ Manual |
   162	| Unclosed code fence | ` ``` ` count odd | Close fence | ✅ |
   163	| Invalid frontmatter YAML | Parse error | Fix syntax | ❌ Manual |
   164	
   165	**Validation**: Use `scripts/quick_validate.py --validate-only file.md` or `scripts/extract_structure.py file.md` for structure analysis.
   166	
   167	---
   168	
   169	## 6. DIVIDER USAGE RULES
   170	
   171	### Horizontal Rule Placement
   172	
   173	**CORRECT: Use `---` between major H2 sections**:
   174	```markdown
   175	## 1. SECTION ONE
   176	Content...
   177	
   178	---
   179	
   180	## 2. SECTION TWO
   181	Content...
   182	```
   183	
   184	**INCORRECT: Never use `---` between H3 subsections**:
   185	```markdown
   186	## 3. RULES
   187	
   188	### ✅ ALWAYS
   189	Content...
   190	
   191	---  ❌ WRONG - No divider here
   192	
   193	### ❌ NEVER
   194	Content...
   195	```
   196	
   197	**Correct approach for H3 subsections**:
   198	```markdown
   199	## 3. RULES
   200	
   201	### ✅ ALWAYS
   202	Content...
   203	
   204	### ❌ NEVER
   205	Content...
   206	
   207	### ⚠️ ESCALATE IF
   208	Content...
   209	```
   210	
   211	**Key principle**: Horizontal rules create visual hierarchy between MAJOR sections (H2), not subsections (H3). Use blank lines to separate H3 subsections within the same H2 parent.
   212	
   213	---
   214	
   215	## 7. DOCUMENT TYPE REQUIREMENTS
   216	
   217	### Document Type Standards
   218	
   219	**SKILL.md**:
   220	```yaml
   221	Required frontmatter: name, description, allowed-tools
   222	Required sections: WHEN TO USE, HOW TO USE, RULES
   223	H1 format: "# Name - Subtitle"
   224	Quality target: Production-ready (no critical gaps)
   225	```
   226	
   227	**Knowledge**:
   228	```yaml
   229	Frontmatter: None (forbidden)
   230	H1 format: "# Topic - Subtitle"
   231	H2 format: "## 1. SECTION"
   232	Quality target: Good (minor gaps only)
   233	```
   234	
   235	**Command**:
   236	```yaml
   237	Required frontmatter: description, argument-hint, allowed-tools
   238	Optional frontmatter: name, model, version, disable-model-invocation
   239	Required sections: Purpose, Contract, Instructions, Example Usage
   240	Optional sections: Example Output, Notes, Troubleshooting

exec
/bin/zsh -lc "rg -n -i 'toc|table of contents|anchor|optional|allowed|required|never' .opencode/skills/sk-doc/references/global/core_standards.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
40:**Exceptions** (never modify):
62:- **Strict**: No violations allowed, blocks processing
69:| Type | Enforcement | Frontmatter | H1 Subtitle | TOC Policy | Blocks |
71:| README | Flexible | None | Optional | ❌ Never | No |
72:| SKILL | Strict | Required | Required | ❌ Never | Yes |
73:| llms.txt | Strict | Forbidden | N/A | ❌ Never | Yes |
74:| Knowledge | Moderate | Forbidden | Required | ❌ Never | Yes |
75:| Command | Strict | Required | Forbidden | ❌ Never | Yes |
76:| Spec | Loose | Optional | Optional | ❌ Never | No |
77:| Generic | Flexible | Optional | Optional | ❌ Never | No |
79:**TOC Policy Summary**:
80:- ❌ **NEVER** add a Table of Contents to any document type. Tables of Contents and `<!-- ANCHOR -->` navigation comments are not used in skill documentation.
98:**Execution stops, manual fix required**:
102:- Missing required fields: `name`, `description`
104:- Missing required sections: WHEN TO USE, HOW IT WORKS, RULES
115:- Missing required fields: `description`
117:- Missing required sections: INPUTS, WORKFLOW, OUTPUTS
124:allowed-tools: Read, Write, Edit
142:**Note**: Not all sections are required. Minimum required sections: WHEN TO USE, HOW TO USE, RULES.
184:**INCORRECT: Never use `---` between H3 subsections**:
193:### ❌ NEVER
204:### ❌ NEVER
221:Required frontmatter: name, description, allowed-tools
222:Required sections: WHEN TO USE, HOW TO USE, RULES
237:Required frontmatter: description, argument-hint, allowed-tools
238:Optional frontmatter: name, model, version, disable-model-invocation
239:Required sections: Purpose, Contract, Instructions, Example Usage
240:Optional sections: Example Output, Notes, Troubleshooting
247:# - H1: No decorative emoji, semantic allowed (🚨 for mandatory/blocking)
248:# - H2: No decorative emoji, semantic allowed (🔒 for phases, ✅ ❌ ⚠️ for validation)
250:#   - `### ✅ ALWAYS`, `### ❌ NEVER`, `### ⚠️ ESCALATE IF`
251:#   - `#### ✅ ALWAYS`, `#### ❌ NEVER`, `#### ⚠️ ESCALATE IF`
254:# SEMANTIC emojis allowed:
256:#   🔒 = Locked/Required (required phases)
284:TOC: Never
285:Emojis: Allowed
294:Emojis: Not allowed (plain text only)

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/assets/template_rules.json | sed -n '204,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   204	    "install_guide": {
   205	      "description": "Installation guide files for MCP servers, plugins, and tools",
   206	      "requiredSections": [
   207	        "overview",
   208	        "prerequisites",
   209	        "installation",
   210	        "verification"
   211	      ],
   212	      "recommendedSections": [
   213	        "configuration",
   214	        "troubleshooting",
   215	        "related_resources"
   216	      ],
   217	      "optionalSections": [
   218	        "quick_start",
   219	        "upgrade",
   220	        "uninstallation",
   221	        "advanced_configuration",
   222	        "faq"
   223	      ],
   224	      "sectionEmojis": {
   225	        "overview": "\ud83d\udcd6",
   226	        "quick_start": "\ud83d\ude80",
   227	        "prerequisites": "\ud83d\udccb",
   228	        "installation": "\u2699\ufe0f",
   229	        "configuration": "\ud83d\udd27",
   230	        "verification": "\u2705",
   231	        "troubleshooting": "\ud83d\udee0\ufe0f",
   232	        "upgrade": "\u2b06\ufe0f",
   233	        "uninstallation": "\ud83d\uddd1\ufe0f",
   234	        "advanced_configuration": "\u26a1",
   235	        "faq": "\u2753",
   236	        "related_resources": "\ud83d\udd17",
   237	        "phase_validation": "\ud83d\udd12"
   238	      },
   239	      "sectionAliases": {
   240	        "quick start": "quick_start",
   241	        "advanced configuration": "advanced_configuration",
   242	        "related resources": "related_resources",
   243	        "phase validation": "phase_validation"
   244	      },
   245	      "tocRequired": false,
   246	      "tocAnchorFormat": "double_dash",
   247	      "tocUppercaseRequired": true,
   248	      "h2EmojiRequired": false,
   249	      "h2UppercaseRequired": true,
   250	      "phaseValidationRequired": true
   251	    },
   252	    "reference": {
   253	      "description": "Reference files in skill references/ folders",
   254	      "requiredSections": [
   255	        "overview"
   256	      ],
   257	      "recommendedSections": [
   258	        "related_resources"
   259	      ],
   260	      "optionalSections": [
   261	        "usage",
   262	        "examples",
   263	        "troubleshooting",
   264	        "decision_logic",
   265	        "workflows",
   266	        "patterns"
   267	      ],
   268	      "sectionEmojis": {
   269	        "overview": "\ud83d\udcd6",
   270	        "usage": "\ud83d\udca1",
   271	        "examples": "\ud83d\udcdd",
   272	        "troubleshooting": "\ud83d\udee0\ufe0f",
   273	        "related_resources": "\ud83d\udd17",
   274	        "decision_logic": "\ud83d\udd00",
   275	        "workflows": "\ud83d\udd04",
   276	        "patterns": "\ud83d\udca1",
   277	        "validation": "\u2705",
   278	        "configuration": "\u2699\ufe0f",
   279	        "quick_troubleshooting": "\ud83d\udd27",
   280	        "common_workflow_examples": "\ud83d\udcdd",
   281	        "batch_processing": "\ud83d\udce6",
   282	        "phase_interactions": "\ud83d\udd04",
   283	        "enforcement_workflows": "\ud83d\udee0\ufe0f",
   284	        "validation_integration": "\ud83d\udd17",
   285	        "execution_modes": "\u2699\ufe0f"
   286	      },
   287	      "sectionAliases": {
   288	        "related resources": "related_resources",
   289	        "related_resources": "related_resources",
   290	        "decision logic": "decision_logic",
   291	        "quick troubleshooting": "quick_troubleshooting",
   292	        "common workflow examples": "common_workflow_examples",
   293	        "batch processing": "batch_processing",
   294	        "phase interactions": "phase_interactions",
   295	        "enforcement workflows": "enforcement_workflows",
   296	        "validation integration": "validation_integration",
   297	        "execution modes": "execution_modes",
   298	        "four execution modes": "execution_modes"
   299	      },
   300	      "tocRequired": false,
   301	      "h2EmojiRequired": false
   302	    },
   303	    "asset": {
   304	      "description": "Asset files in skill assets/ folders",
   305	      "requiredSections": [
   306	        "overview"
   307	      ],
   308	      "recommendedSections": [
   309	        "related_resources"
   310	      ],
   311	      "optionalSections": [
   312	        "templates",
   313	        "examples",
   314	        "guidelines",
   315	        "patterns",
   316	        "configuration",
   317	        "checklist"
   318	      ],
   319	      "sectionEmojis": {
   320	        "overview": "\ud83d\udcd6",
   321	        "related_resources": "\ud83d\udd17",
   322	        "templates": "\ud83d\udccb",
   323	        "examples": "\ud83d\udca1",
   324	        "guidelines": "\ud83d\udcdd",
   325	        "patterns": "\ud83d\udd00",
   326	        "configuration": "\u2699\ufe0f",
   327	        "checklist": "\u2705",
   328	        "asset_types": "\ud83c\udfaf",
   329	        "document_structure": "\ud83d\udccb",
   330	        "standard_structure": "\ud83c\udfd7\ufe0f",
   331	        "logic_representation": "\ud83e\udde0",
   332	        "decision_logic": "\ud83d\udd00",
   333	        "workflow_patterns": "\ud83d\udd04",
   334	        "configuration_templates": "\u2699\ufe0f",
   335	        "template_guidelines": "\ud83d\udcdd",
   336	        "asset_checklist": "\u2705",
   337	        "asset_maintenance": "\ud83d\udd04",
   338	        "best_practices": "\ud83c\udf93",
   339	        "naming_reference": "\ud83d\udcda"
   340	      },
   341	      "sectionAliases": {
   342	        "related resources": "related_resources",
   343	        "related_resources": "related_resources",
   344	        "asset types": "asset_types",
   345	        "document structure": "document_structure",
   346	        "standard asset structure": "standard_structure",
   347	        "standard structure": "standard_structure",
   348	        "logic representation patterns": "logic_representation",
   349	        "logic representation": "logic_representation",
   350	        "decision logic examples": "decision_logic",
   351	        "decision logic": "decision_logic",
   352	        "workflow patterns": "workflow_patterns",
   353	        "configuration templates": "configuration_templates",
   354	        "template guidelines": "template_guidelines",
   355	        "asset file checklist": "checklist",
   356	        "asset checklist": "checklist",
   357	        "asset maintenance": "asset_maintenance",
   358	        "best practices summary": "best_practices",
   359	        "asset file naming quick reference": "naming_reference",
   360	        "naming reference": "naming_reference"
   361	      },
   362	      "tocRequired": false,
   363	      "h2EmojiRequired": false
   364	    },
   365	    "changelog": {
   366	      "description": "Component changelog files at .opencode/changelog/{component}/v{VERSION}.md or .opencode/skills/<skill>/changelog/v{VERSION}.md. Files start directly with a summary paragraph; no TOC, no Overview section, no version header. Authoritative format reference: .opencode/skills/sk-doc/assets/changelog_template.md",
   367	      "requiredSections": [],
   368	      "recommendedSections": [
   369	        "upgrade"
   370	      ],
   371	      "optionalSections": [
   372	        "what_changed",
   373	        "files_changed",
   374	        "test_impact",
   375	        "schema_changes",
   376	        "new_features",
   377	        "architecture",
   378	        "documentation",
   379	        "testing",
   380	        "commands",
   381	        "bug_fixes",
   382	        "breaking_changes",
   383	        "security",
   384	        "search",
   385	        "saving_memories"
   386	      ],
   387	      "sectionEmojis": {},
   388	      "sectionAliases": {
   389	        "what changed": "what_changed",
   390	        "files changed": "files_changed",
   391	        "test impact": "test_impact",
   392	        "schema changes": "schema_changes",
   393	        "new features": "new_features",
   394	        "bug fixes": "bug_fixes",
   395	        "breaking changes": "breaking_changes",
   396	        "saving memories": "saving_memories"
   397	      },
   398	      "tocRequired": false,
   399	      "tocAnchorFormat": null,
   400	      "tocUppercaseRequired": false,
   401	      "h2EmojiRequired": false,
   402	      "h2UppercaseRequired": false,
   403	      "firstSectionName": null,
   404	      "lastSectionPattern": null
   405	    },
   406	    "playbook": {
   407	      "description": "Manual testing playbook files for skill validation, including a root directory page and required per-feature snippet tree",
   408	      "requiredSections": [
   409	        "overview",
   410	        "global_preconditions",
   411	        "global_evidence_requirements",
   412	        "deterministic_command_notation"
   413	      ],
   414	      "recommendedSections": [
   415	        "automated_test_cross_reference",
   416	        "feature_catalog_cross_reference"
   417	      ],
   418	      "optionalSections": [
   419	        "coverage_notes"
   420	      ],

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/assets/create_folder_readme_confirm.yaml | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# ─────────────────────────────────────────────────────────────────
     2	# OPENCODE CREATE: UNIFIED DOCUMENTATION WORKFLOW (CONFIRM MODE)
     3	# ─────────────────────────────────────────────────────────────────
     4	# Mode: confirm-only (interactive step-by-step approval)
     5	# Note: This workflow does NOT support :auto mode. All executions
     6	#       require user confirmation at checkpoints for content review.
     7	#
     8	# Supports: README creation and Install Guide creation
     9	# Routing: The setup phase in folder_readme.md determines which
    10	#          operation to execute. See operation_routing below.
    11	#
    12	# Note: Documents should include clear section anchors and concise metadata.
    13	# Use YAML frontmatter (title, description, trigger_phrases) for consistency.
    14	# ─────────────────────────────────────────────────────────────────
    15	role: Expert Documentation Creator using sk-doc skill
    16	purpose: Create comprehensive README files and AI-first installation guides with proper structure and optimization
    17	action: Generate scannable, well-organized documentation (README or Install Guide) with proper structure
    18	
    19	# ─────────────────────────────────────────────────────────────────
    20	# PREREQUISITE: @markdown AGENT VERIFICATION
    21	# ─────────────────────────────────────────────────────────────────
    22	# This workflow REQUIRES the @markdown agent for:
    23	#   - Template-first workflow (loads templates before creating)
    24	#   - DQI scoring (target: 70+ Acceptable)
    25	#   - sk-doc skill integration
    26	#
    27	# PHASE 0 in the command markdown verifies @markdown agent BEFORE
    28	# this YAML workflow loads. If you're executing this workflow,
    29	# @markdown verification has already passed.
    30	#
    31	# To invoke correctly:
    32	#   README:        @markdown /create:folder_readme [path]
    33	#   Install Guide: @markdown /create:folder_readme install [project-name]
    34	# ─────────────────────────────────────────────────────────────────
    35	
    36	# ─────────────────────────────────────────────────────────────────
    37	# OPERATION ROUTING
    38	# ─────────────────────────────────────────────────────────────────
    39	# This YAML handles both README and Install Guide operations.
    40	# The setup phase in folder_readme.md determines which operation
    41	# to execute based on command arguments:
    42	#
    43	#   /create:folder_readme [path]           -> README operation
    44	#   /create:folder_readme install [name]   -> Install Guide operation
    45	#
    46	# Skip to the relevant operation section below:
    47	#   - OPERATION: README        — for folder README creation
    48	#   - OPERATION: INSTALL GUIDE — for installation guide creation
    49	# ─────────────────────────────────────────────────────────────────
    50	
    51	operation_routing:
    52	  readme:
    53	    trigger: "/create:folder_readme [path]"
    54	    description: "Create a folder README with proper structure and AI-optimization"
    55	    skip_to: "OPERATION: README"
    56	  install_guide:
    57	    trigger: "/create:folder_readme install [project-name]"
    58	    description: "Create an AI-first installation guide with multi-platform support"
    59	    skip_to: "OPERATION: INSTALL GUIDE"
    60	
    61	operating_mode:
    62	  workflow: sequential_6_step
    63	  workflow_compliance: MANDATORY
    64	  workflow_execution: interactive
    65	  approvals: step_by_step
    66	  tracking: progressive_task_checklists
    67	  validation: checkpoint_based
    68	  description: |
    69	    Executes the 6-step documentation workflow with approval gates at each checkpoint.
    70	    User confirms, reviews, or modifies at each step before the workflow advances.
    71	
    72	development_philosophy:
    73	  principle: "Question-answering format maximizes AI usefulness"
    74	  approach: "Discover -> Structure -> Generate -> Validate"
    75	  mandate: "Progressive disclosure - Quick Start first, details follow"
    76	
    77	runtime_agent_path_resolution:
    78	  default: .opencode/agent
    79	  claude: .claude/agents
    80	  codex: .codex/agents
    81	  gemini: .gemini/agents
    82	
    83	# ─────────────────────────────────────────────────────────────────
    84	# CONFIDENCE & CLARIFICATION FRAMEWORK
    85	# ─────────────────────────────────────────────────────────────────
    86	confidence_framework:
    87	  thresholds:
    88	    high: { range: "80-100%", action: "Proceed with citable source" }
    89	    medium: { range: "40-79%", action: "Proceed with caution, document assumptions" }
    90	    low: { range: "0-39%", action: "STOP - Ask clarification with A/B/C options" }
    91	
    92	  scoring_weights:
    93	    scope_clarity: 0.30
    94	    content_completeness: 0.25
    95	    structure_adherence: 0.25
    96	    audience_fit: 0.20
    97	
    98	  clarification_format: |
    99	    "I need clarity (confidence: [NN%]). Which approach:
   100	    - A) [option with brief rationale]
   101	    - B) [option with brief rationale]
   102	    - C) [option with brief rationale]"
   103	
   104	  escalation:
   105	    timebox_minutes: 10
   106	    failed_attempts_threshold: 2
   107	    action: "Present options to user with current findings"
   108	
   109	# ─────────────────────────────────────────────────────────────────
   110	# REQUEST ANALYSIS FRAMEWORK
   111	# ─────────────────────────────────────────────────────────────────
   112	request_analysis_framework:
   113	  code_search_note: "Use Code Graph structural queries (code_graph_query) + Grep for concept discovery; verify hits with Read. memory_search is for spec docs/memory, not arbitrary code."
   114	  solution_flow:
   115	  - "Parse carefully: What is ACTUALLY requested?"
   116	  - "Gather Context: Scan directory structure"
   117	  - "Identify Approach: SIMPLEST solution that works"
   118	  - "Validate Choice: Follow patterns, maintainable"
   119	  - "Clarify If Needed: If <80% confidence, ask"
   120	  - "Scope Check: Solving ONLY what was asked?"
   121	  - "Execute: Implement with minimal complexity"
   122	
   123	  pre_change_validation:
   124	    items:
   125	    - "Target path confirmed?"
   126	    - "Document type determined? (README type or Install Guide type prefix)"
   127	    - "Key features/prerequisites identified?"
   128	    - "Structure template selected?"
   129	    - "Confidence >=80%? (if not: ask)"
   130	    stop_conditions: [ "Any item unchecked", "Path not found" ]
   131	    stop_action: "STOP and address before proceeding"
   132	
   133	input_contract:
   134	  required:
   135	  - create_agent_verified
   136	  - operation
   137	  - execution_mode
   138	  optional:
   139	  - target_path
   140	  - project_name
   141	  - readme_type
   142	  - install_guide_type_prefix
   143	  - platforms
   144	  - spec_path
   145	
   146	# ─────────────────────────────────────────────────────────────────
   147	# CHECKPOINT OPTIONS
   148	# ─────────────────────────────────────────────────────────────────
   149	checkpoint_options:
   150	  standard:
   151	  - label: "Approve"
   152	    description: "Approve and continue to next step"
   153	  - label: "Review"
   154	    description: "Show more details"
   155	  - label: "Modify"
   156	    description: "Make changes before proceeding"
   157	
   158	# ─────────────────────────────────────────────────────────────────
   159	# WORKFLOW ENFORCEMENT (CRITICAL)
   160	# ─────────────────────────────────────────────────────────────────
   161	workflow_enforcement:
   162	  mode: strict
   163	  step_order: sequential_mandatory
   164	  skip_allowed: false
   165	
   166	  phase_gate:
   167	    location: "Between Step 2 and Step 3"
   168	    purpose: "Verify content discovery complete before structure selection"
   169	    requirements:
   170	    - "Key features identified (3-5)"
   171	    - "Target audience determined"
   172	    - "Prerequisites/dependencies gathered"
   173	    action_if_failed: "STOP and return to incomplete step"
   174	
   175	  critical_steps:
   176	    step_2_discovery:
   177	      enforcement: "MUST gather project information before writing"
   178	      verification: "Cannot proceed without identified features"
   179	    step_4_generation:
   180	      enforcement: "MUST use template structure with sections, tables"
   181	      verification: "All sections written, no placeholder content"
   182	    step_5_validation:
   183	      enforcement: "MUST verify structure and completeness"
   184	      verification: "DQI score >= 70 before claiming complete"
   185	
   186	gate_logic:
   187	  hard:
   188	    H0_write_verified:
   189	      description: "@markdown verification must have passed in Phase 0"
   190	      fail_action: "STOP and return to the command setup phase"
   191	    H1_operation_resolution:
   192	      description: "The workflow must resolve README vs Install Guide before generation"
   193	      fail_action: "STOP and correct the operation routing"
   194	    H2_required_inputs:
   195	      description: "Required operation-specific inputs must be present"
   196	      fail_action: "STOP and collect missing inputs"
   197	    H3_validation_gate:
   198	      description: "Generated documentation must pass the structural validation path"
   199	      fail_action: "Fix the generated output before continuing"
   200	  soft:
   201	    S1_discovered_context:
   202	      description: "Discovered project context may proceed with logged assumptions"
   203	      fail_action: "Proceed with rationale"
   204	
   205	# ─────────────────────────────────────────────────────────────────
   206	# CIRCUIT BREAKER
   207	# ─────────────────────────────────────────────────────────────────
   208	circuit_breaker:
   209	  consecutive_failure_threshold: 3
   210	  states:
   211	    closed: "Normal operation"
   212	    open: "3+ failures -- pause and report to user"
   213	    half_open: "Test with single retry before resuming"
   214	  on_open:
   215	    action: "Report failures to user with summary"
   216	    suggest: "Review inputs and try again, or escalate"
   217	
   218	# ─────────────────────────────────────────────────────────────────
   219	# INTERACTIVE EXECUTION
   220	# ─────────────────────────────────────────────────────────────────
   221	interactive_execution:
   222	  principle: "Execute workflow steps with user approval at each checkpoint"
   223	  user_feedback_handling:
   224	    approve: "Continue to next step"
   225	    review: "Show detailed output before proceeding"
   226	    modify: "Apply requested changes and re-validate"
   227	    skip: "Mark step as skipped with reason, continue"
   228	
   229	# ─────────────────────────────────────────────────────────────────
   230	# QUALITY STANDARDS
   231	# ─────────────────────────────────────────────────────────────────
   232	quality_standards:
   233	  dqi_minimum: 70
   234	  dqi_enforcement: FLEXIBLE
   235	  validation_pipeline:
   236	    stage_1: "Structural check (title, sections, separators)"
   237	    stage_2: "Content check (code blocks, tables, no placeholders)"
   238	  template_adherence: required
   239	  core_standards_reference: ".opencode/skills/sk-doc/references/global/core_standards.md"
   240	
   241	workflow_overview:
   242	  steps:
   243	  - id: step_1_request_analysis
   244	    purpose: "Normalize inputs and resolve the target operation"
   245	  - id: step_2_content_discovery
   246	    purpose: "Gather README or install-guide source context"
   247	  - id: step_3_structure_selection
   248	    purpose: "Choose the correct template and section contract"
   249	  - id: step_4_content_generation
   250	    purpose: "Generate the document content for the selected operation"
   251	  - id: step_5_validation
   252	    purpose: "Run structure and quality validation"
   253	  - id: step_6_save_context
   254	    purpose: "Persist spec context and emit completion status"
   255	
   256	# ════════════════════════════════════════════════════════════════
   257	# OPERATION: README
   258	# ════════════════════════════════════════════════════════════════
   259	
   260	# ─────────────────────────────────────────────────────────────────

exec
/bin/zsh -lc "python3 -c \"import json; data=json.load(open('.opencode/skills/sk-doc/assets/template_rules.json')); print('documentTypes', sorted(data['documentTypes'])); print('tocRequired', {k:v.get('tocRequired') for k,v in data['documentTypes'].items() if isinstance(v,dict)}); print('true_toc', [k for k,v in data['documentTypes'].items() if isinstance(v,dict) and v.get('tocRequired') is True])\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "for f in .opencode/commands/create/assets/create_folder_readme_auto.yaml .opencode/commands/create/assets/create_folder_readme_confirm.yaml .opencode/commands/create/assets/create_feature_catalog_auto.yaml .opencode/commands/create/assets/create_feature_catalog_confirm.yaml .opencode/commands/create/assets/create_testing_playbook_auto.yaml .opencode/commands/create/assets/create_testing_playbook_confirm.yaml; do python3 -c \"import yaml,sys; yaml.safe_load(open(sys.argv[1])); print(sys.argv[1], 'OK')\" \""'$f" || exit 1; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1662ms:
2026-05-26 12:50:56.761 xcodebuild[95757:53756988]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:56.880 xcodebuild[95757:53756986] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-saeTDES2' (errno=Operation not permitted)
2026-05-26 12:50:57.334 xcodebuild[95801:53757069]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:57.505 xcodebuild[95801:53757066] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
documentTypes ['agent', 'asset', 'changelog', 'command', 'install_guide', 'playbook', 'playbook_feature', 'readme', 'reference', 'skill', 'spec']
tocRequired {'readme': False, 'skill': False, 'command': False, 'install_guide': False, 'reference': False, 'asset': False, 'changelog': False, 'playbook': False, 'spec': False, 'agent': False, 'playbook_feature': False}
true_toc []

 succeeded in 9421ms:
2026-05-26 12:50:56.767 xcodebuild[95758:53756992]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:56.880 xcodebuild[95758:53756991] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-2CaZFRLr' (errno=Operation not permitted)
2026-05-26 12:50:57.334 xcodebuild[95802:53757068]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:57.505 xcodebuild[95802:53757067] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/assets/create_folder_readme_auto.yaml OK
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-ktm4XchQ' (errno=Operation not permitted)
2026-05-26 12:50:58.536 xcodebuild[95842:53757164]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:58.655 xcodebuild[95842:53757163] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-WY7keMvW' (errno=Operation not permitted)
2026-05-26 12:50:58.999 xcodebuild[95844:53757176]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:50:59.117 xcodebuild[95844:53757174] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/assets/create_folder_readme_confirm.yaml OK
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-X3E9qUiB' (errno=Operation not permitted)
2026-05-26 12:51:00.040 xcodebuild[95889:53757282]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:00.168 xcodebuild[95889:53757280] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-j5x42yKX' (errno=Operation not permitted)
2026-05-26 12:51:00.563 xcodebuild[95998:53757488]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:00.686 xcodebuild[95998:53757470] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/assets/create_feature_catalog_auto.yaml OK
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-gmvAb2Jy' (errno=Operation not permitted)
2026-05-26 12:51:01.651 xcodebuild[96187:53757750]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:01.775 xcodebuild[96187:53757749] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-2LEyUyQJ' (errno=Operation not permitted)
2026-05-26 12:51:02.196 xcodebuild[96233:53757799]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:02.323 xcodebuild[96233:53757798] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml OK
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-GeU5U1ic' (errno=Operation not permitted)
2026-05-26 12:51:03.234 xcodebuild[96265:53757861]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:03.352 xcodebuild[96265:53757860] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-gUQehj2w' (errno=Operation not permitted)
2026-05-26 12:51:03.715 xcodebuild[96275:53757899]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:03.819 xcodebuild[96275:53757898] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/assets/create_testing_playbook_auto.yaml OK
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-JfxlQ2NW' (errno=Operation not permitted)
2026-05-26 12:51:04.694 xcodebuild[96324:53757983]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:04.825 xcodebuild[96324:53757982] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-499ixdl6' (errno=Operation not permitted)
2026-05-26 12:51:05.219 xcodebuild[96326:53758000]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:05.332 xcodebuild[96326:53757999] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml OK

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/assets/create_folder_readme_confirm.yaml | sed -n '260,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	# ─────────────────────────────────────────────────────────────────
   261	# README: USER INPUTS (From gate outputs)
   262	# ─────────────────────────────────────────────────────────────────
   263	readme_user_inputs:
   264	  target_path: |
   265	    [TARGET_PATH]
   266	    Where to create README.
   267	    FROM UNIFIED SETUP PHASE (Q0 or command argument).
   268	
   269	  readme_type: |
   270	    [README_TYPE]
   271	    Type: project | component | feature | skill
   272	    FROM UNIFIED SETUP PHASE (Q1).
   273	
   274	  path_verified: |
   275	    [PATH_VERIFIED]
   276	    Whether target path exists.
   277	    FROM UNIFIED SETUP PHASE (automatic verification).
   278	
   279	  existing_readme: |
   280	    [EXISTING_README]
   281	    Whether README.md already exists at path.
   282	    FROM UNIFIED SETUP PHASE (automatic detection).
   283	
   284	# ─────────────────────────────────────────────────────────────────
   285	# README: TYPES
   286	# ─────────────────────────────────────────────────────────────────
   287	readme_types:
   288	  project:
   289	    scope: "Entire project"
   290	    sections:
   291	    # Canonical sections from readme_template.md S13 (omits FAQ for project scope)
   292	    - "OVERVIEW"
   293	    - "QUICK START"
   294	    - "FEATURES"
   295	    - "STRUCTURE"
   296	    - "CONFIGURATION"
   297	    - "USAGE EXAMPLES"
   298	    - "TROUBLESHOOTING"
   299	    - "RELATED DOCUMENTS"
   300	    key_questions:
   301	    - "What is this?"
   302	    - "How do I install it?"
   303	    - "How do I use it?"
   304	    - "How do I contribute?"
   305	
   306	  component:
   307	    scope: "Module or package"
   308	    sections:
   309	    # Full canonical 9-section set from readme_template.md S13
   310	    - "OVERVIEW"
   311	    - "QUICK START"
   312	    - "FEATURES"
   313	    - "STRUCTURE"
   314	    - "CONFIGURATION"
   315	    - "USAGE EXAMPLES"
   316	    - "TROUBLESHOOTING"
   317	    - "FAQ"
   318	    - "RELATED DOCUMENTS"
   319	    key_questions:
   320	    - "What does this component do?"
   321	    - "How do I use the API?"
   322	    - "How do I integrate it?"
   323	
   324	  feature:
   325	    scope: "Specific feature"
   326	    sections:
   327	    # Canonical subset from readme_template.md S13 (omits STRUCTURE, FAQ, RELATED DOCUMENTS)
   328	    - "OVERVIEW"
   329	    - "QUICK START"
   330	    - "FEATURES"
   331	    - "CONFIGURATION"
   332	    - "USAGE EXAMPLES"
   333	    - "TROUBLESHOOTING"
   334	    key_questions:
   335	    - "What does this feature do?"
   336	    - "How do I enable it?"
   337	    - "How do I configure it?"
   338	
   339	  skill:
   340	    scope: "OpenCode skill"
   341	    sections:
   342	    # Full canonical 9-section set from readme_template.md S13
   343	    - "OVERVIEW"
   344	    - "QUICK START"
   345	    - "FEATURES"
   346	    - "STRUCTURE"
   347	    - "CONFIGURATION"
   348	    - "USAGE EXAMPLES"
   349	    - "TROUBLESHOOTING"
   350	    - "FAQ"
   351	    - "RELATED DOCUMENTS"
   352	    key_questions:
   353	    - "When does this skill activate?"
   354	    - "What commands are available?"
   355	    - "What MCP tools does it use?"
   356	
   357	# ─────────────────────────────────────────────────────────────────
   358	# README: AI OPTIMIZATION PRINCIPLES
   359	# ─────────────────────────────────────────────────────────────────
   360	readme_ai_optimization:
   361	  question_answering:
   362	    description: "Structure to answer common questions"
   363	    examples:
   364	    - question: "How do I install?"
   365	      maps_to: "Installation section"
   366	    - question: "How do I configure?"
   367	      maps_to: "Configuration section"
   368	
   369	  scannable_structure:
   370	    description: "Easy to scan and find information"
   371	    techniques:
   372	    - "Clear headings"
   373	    - "Code examples for every feature"
   374	    - "Tables for options"
   375	    - "ASCII diagrams for architecture"
   376	
   377	  progressive_disclosure:
   378	    description: "Quick Start first, details follow"
   379	    order:
   380	    - "Quick Start (get running fast)"
   381	    - "Details (deep configuration)"
   382	    - "Reference (complete API)"
   383	
   384	# ─────────────────────────────────────────────────────────────────
   385	# README: REFERENCE TEMPLATES
   386	# ─────────────────────────────────────────────────────────────────
   387	readme_reference_templates:
   388	  readme_template: .opencode/skills/sk-doc/assets/readme/readme_template.md
   389	  speckit_readme: .opencode/skills/system-spec-kit/README.md
   390	  memory_readme: .opencode/skills/system-spec-kit/README.md
   391	  core_standards: .opencode/skills/sk-doc/references/global/core_standards.md
   392	
   393	# ─────────────────────────────────────────────────────────────────
   394	# README: TEMPLATE EVOLUTION REFERENCES
   395	# ─────────────────────────────────────────────────────────────────
   396	# Points to readme_template.md sections for patterns not embedded here.
   397	# The canonical template is the single source of truth for all README structure.
   398	readme_template_references:
   399	  canonical_structure: "readme_template.md S13 (Complete Template)"
   400	  anchor_rules: "readme_template.md S12 (Anchor Templates)"
   401	  writing_patterns: "readme_template.md S6 (Writing Patterns)"
   402	  style_guide: "readme_template.md S7 (Style Reference)"
   403	  badge_shields: "readme_template.md S8 (Badge Shields)"
   404	  before_after_patterns: "readme_template.md S6.4 (Before/After)"
   405	  architecture_diagrams: "readme_template.md S6.5 (Architecture Diagrams)"
   406	
   407	# ─────────────────────────────────────────────────────────────────
   408	# README: WORKFLOW (6 STEPS WITH CHECKPOINTS)
   409	# ─────────────────────────────────────────────────────────────────
   410	readme_workflow:
   411	  step_1_request_analysis:
   412	    purpose: Determine scope and location (from UNIFIED SETUP PHASE)
   413	    activities:
   414	    - Confirm target_path from UNIFIED SETUP PHASE
   415	    - Confirm readme_type from UNIFIED SETUP PHASE
   416	    - Confirm path_verified from UNIFIED SETUP PHASE
   417	    - Confirm existing_readme handling from UNIFIED SETUP PHASE
   418	    - Validate readme_type is one of: project, component, feature, skill
   419	    type_reference:
   420	      project: "Entire project - overview, installation, configuration, usage"
   421	      component: "Module/package - purpose, API, usage examples, integration"
   422	      feature: "Specific feature - what it does, how it works, configuration"
   423	      skill: "OpenCode skill - triggers, commands, MCP tools, architecture"
   424	    outputs:
   425	    - target_confirmed
   426	    - type_confirmed
   427	    - scope_defined
   428	    checkpoint:
   429	      question: "Create [type] README at [path]. Proceed?"
   430	      options:
   431	      - label: "A) Proceed"
   432	        description: "Create README with these settings"
   433	      - label: "B) Change type"
   434	        description: "Select different README type"
   435	      - label: "C) Change location"
   436	        description: "Use different target path"
   437	
   438	  step_2_content_discovery:
   439	    purpose: Gather project information based on type
   440	    activities:
   441	    - Scan for project metadata
   442	    - Identify main features and capabilities
   443	    - Find existing documentation to reference
   444	    - Check for configuration options
   445	    scan_targets:
   446	      project:
   447	      - "package.json / pyproject.toml for metadata"
   448	      - "Main entry points and configuration files"
   449	      - "Key features and capabilities"
   450	      - "Existing documentation"
   451	      component:
   452	      - "Component purpose and scope"
   453	      - "Exported APIs and interfaces"
   454	      - "Usage examples in codebase"
   455	      - "Dependencies and integration points"
   456	      feature_or_skill:
   457	      - "Feature scope and capabilities"
   458	      - "Commands, triggers, or APIs"
   459	      - "Configuration options"
   460	      - "Architecture if applicable"
   461	    questions:
   462	    - "What are the key aspects to document?"
   463	    - "Main purpose/value proposition?"
   464	    - "Key features (3-5)?"
   465	    - "Target audience?"
   466	    - "Prerequisites/dependencies?"
   467	    prompt_template: |
   468	      +------------------------------------------------------------+
   469	      | "What are the key aspects to document?"                    |
   470	      |                                                            |
   471	      | - Main purpose/value proposition?                          |
   472	      | - Key features (3-5)?                                      |
   473	      | - Target audience?                                         |
   474	      | - Prerequisites/dependencies?                              |
   475	      +------------------------------------------------------------+
   476	    outputs:
   477	    - features_identified
   478	    - metadata_gathered
   479	    - structure_understood
   480	    checkpoint:
   481	      question: "Key features identified. Review?"
   482	      options: checkpoint_options.standard
   483	
   484	  step_3_structure_selection:
   485	    purpose: Choose appropriate template based on type
   486	    activities:
   487	    - Select section structure based on readme_type
   488	    - Adapt sections to specific project needs
   489	    - Plan content for each section
   490	    - Identify which optional sections to include
   491	    core_pattern:
   492	      all_types:
   493	      - "Title + Tagline (one-liner description)"
   494	      - "Numbered sections"
   495	      - "Tables for structured data"
   496	      - "Code blocks with language tags"
   497	      - "Horizontal rules between major sections"
   498	    emoji_guidance:
   499	      note: "Optional emoji prefix suggestions (not required in output)"
   500	      examples:
   501	        overview: "OVERVIEW"
   502	        quick_start: "QUICK START"
   503	        structure: "STRUCTURE"
   504	        features: "FEATURES"
   505	        configuration: "CONFIGURATION"
   506	        usage_examples: "USAGE EXAMPLES"
   507	        troubleshooting: "TROUBLESHOOTING"
   508	        faq: "FAQ"
   509	        related_documents: "RELATED DOCUMENTS"
   510	    outputs:
   511	    - template_selected
   512	    - sections_planned
   513	    - content_outline
   514	    checkpoint:
   515	      question: "Structure selected. Proceed to generation?"
   516	      options: checkpoint_options.standard
   517	
   518	  step_4_content_generation:
   519	    purpose: Write comprehensive README following selected structure
   520	    activities:
   521	    - Write Title + Tagline (concise, clear value proposition)
   522	    - Write each section
   523	    - Create tables for structured data (features, commands, config)
   524	    - Add code blocks with language tags
   525	    - Create ASCII diagrams for architecture/flow visualization
   526	    - Add horizontal rules between major sections
   527	    - Write to target_path
   528	    quality_requirements:
   529	      title: "Clear, concise value proposition"
   530	      sections: "Numbered sections"
   531	      tables: "For structured data (features, commands, config)"
   532	      code_blocks: "Always specify language"
   533	      diagrams: "ASCII for architecture/flow"
   534	      separators: "Horizontal rules between major sections"
   535	    outputs:
   536	    - readme_file: created
   537	    - sections_count: number
   538	    - tables_count: number
   539	    - code_blocks_count: number
   540	    checkpoint:
   541	      question: "README generated. Review?"
   542	      options:
   543	      - label: "A) Show full content"
   544	        description: "Display complete README"
   545	      - label: "B) Proceed"
   546	        description: "Continue to validation"
   547	
   548	  step_5_validation:
   549	    purpose: Verify README quality and completeness
   550	    activities:
   551	    - Structure check (title, sections, separators)
   552	    - Content check (code blocks, tables, no placeholders, valid links)
   553	    - Completeness check (Quick Start, Troubleshooting, FAQ for component/skill)
   554	    - DQI check if script available
   555	    validation_checklist:
   556	      structure:
   557	      - "Title + one-liner tagline present"
   558	      - "All sections numbered"
   559	      - "Horizontal rules between sections"
   560	      content:
   561	      - "All code blocks have language tags"
   562	      - "Tables are properly formatted"
   563	      - "No placeholder text remaining"
   564	      - "Links are valid"
   565	      completeness:
   566	      - "Quick Start section present"
   567	      - "Troubleshooting section present"
   568	      - "FAQ section present (for component/skill)"
   569	    quality_gates:
   570	      dqi_minimum: 70
   571	      dqi_band: "Acceptable"
   572	      enforcement: "Flexible"
   573	    outputs:
   574	    - validation_passed: boolean
   575	    - checklist_results: object
   576	    - dqi_score: number (optional)
   577	    checkpoint:
   578	      question: "Validation complete. README ready?"
   579	      options:
   580	      - label: "Proceed"
   581	        description: "Continue to save context"
   582	      - label: "Fix issues"
   583	        description: "Address validation failures"
   584	      - label: "View summary"
   585	        description: "Show final summary"
   586	
   587	  step_5b_quality_validation:
   588	    purpose: Quality-validate the created README artifact
   589	    agent_availability:
   590	      agent_file: "[runtime_agent_path]/write.md"
   591	      template_contract:
   592	        source: "sk-doc"
   593	        validators: "validate_document.py + extract_structure.py"
   594	        precedence: "Template compliance and DQI quality checks are mandatory before completion."
   595	      rule_reference: "AGENTS.md S3 -- sk-doc template alignment and quality validation"
   596	      condition: "ONLY when this step is actively executing"
   597	      blocking: false
   598	      not_for: "reviewing this workflow prompt or any pre-step activity"
   599	    activities:
   600	    - "Run @markdown quality validation to score the created README file"
   601	    - "Validation checks: structure completeness, content quality, DQI standards"
   602	    - "Score against 100-point rubric (Accuracy 40%, Completeness 35%, Consistency 25%)"
   603	    on_low_score:
   604	      threshold: 70
   605	      action: "Log warnings and suggest improvements; do not block workflow"
   606	    outputs:
   607	    - quality_score: number
   608	    - validation_findings: list
   609	    - improvement_suggestions: list (if score < 70)
   610	    checkpoint:
   611	      question: "Quality validation complete (score: [quality_score]/100). Continue?"
   612	      options:
   613	      - label: "A) Accept and continue"
   614	        description: "Proceed to save context"
   615	      - label: "B) View findings"
   616	        description: "Show detailed review findings"
   617	      - label: "C) Address issues"
   618	        description: "Fix issues before continuing"
   619	
   620	  step_6_save_context:

exec
/bin/zsh -lc "rg -n -i 'table of contents|\\bTOC\\b|<"'!--'"\\s*ANCHOR\\s*-->|anchor|B\\)|C\\)|Proceed|Show TABLE' .opencode/commands/create/assets/create_folder_readme_confirm.yaml .opencode/commands/create/assets/create_folder_readme_auto.yaml .opencode/commands/create/assets/create_feature_catalog_auto.yaml .opencode/commands/create/assets/create_feature_catalog_confirm.yaml .opencode/commands/create/assets/create_testing_playbook_auto.yaml .opencode/commands/create/assets/create_testing_playbook_confirm.yaml .opencode/commands/create/folder_readme.md .opencode/commands/create/README.txt" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/commands/create/assets/create_testing_playbook_auto.yaml:55:    high: { range: "80-100%", action: "Proceed with deterministic defaults" }
.opencode/commands/create/assets/create_testing_playbook_auto.yaml:56:    medium: { range: "40-79%", action: "Proceed with caution and log assumptions" }
.opencode/commands/create/assets/create_testing_playbook_auto.yaml:165:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_testing_playbook_auto.yaml:202:      fail_action: "Proceed with logged assumption"
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:55:    high: { range: "80-100%", action: "Proceed with checkpoint proposal" }
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:56:    medium: { range: "40-79%", action: "Proceed with caution and note assumptions" }
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:91:  proceed:
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:92:    label: "Proceed"
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:179:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:216:      fail_action: "Proceed with logged assumption"
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:221:    proceed: "Advance to the next step"
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:256:        - proceed
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:274:        - proceed
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:305:        - proceed
.opencode/commands/create/assets/create_feature_catalog_auto.yaml:55:    high: { range: "80-100%", action: "Proceed with deterministic defaults" }
.opencode/commands/create/assets/create_feature_catalog_auto.yaml:56:    medium: { range: "40-79%", action: "Proceed with caution and log assumptions" }
.opencode/commands/create/assets/create_feature_catalog_auto.yaml:163:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_feature_catalog_auto.yaml:196:      fail_action: "Proceed with logged assumption"
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:55:    high: { range: "80-100%", action: "Proceed with checkpoint proposal" }
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:56:    medium: { range: "40-79%", action: "Proceed with caution and note assumptions" }
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:91:  proceed:
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:92:    label: "Proceed"
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:177:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:210:      fail_action: "Proceed with logged assumption"
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:215:    proceed: "Advance to the next step"
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:250:        - proceed
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:268:        - proceed
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:297:        - proceed
.opencode/commands/create/assets/create_folder_readme_auto.yaml:9:# Note: Documentation files should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_auto.yaml:93:    high: { range: "80-100%", action: "Proceed with citable source" }
.opencode/commands/create/assets/create_folder_readme_auto.yaml:94:    medium: { range: "40-79%", action: "Proceed with caution, document assumptions" }
.opencode/commands/create/assets/create_folder_readme_auto.yaml:106:    - B) [option with brief rationale]
.opencode/commands/create/assets/create_folder_readme_auto.yaml:107:    - C) [option with brief rationale]"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:137:      stop_action: "STOP and address before proceeding"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:146:      stop_action: "STOP and address before proceeding"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:171:    description: "Make changes before proceeding"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:214:        verification: "Cannot proceed without prerequisites list"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:238:      description: "Discovered project context may proceed with logged assumptions"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:239:      fail_action: "Proceed with rationale"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:447:  anchor_rules: "readme_template.md §12 (Anchor Templates)"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:661:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_auto.yaml:663:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_auto.yaml:665:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:672:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:675:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:680:          <!-- ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:683:          <!-- /ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:691:      benefit: "93% token savings on anchor-based retrieval"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:692:      reference: "See /memory:save Step 3 for full anchor documentation"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1025:    - Command verification (syntax correct, versions accurate, platform-specific)
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1114:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1116:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1117:      # Note: Anchor IDs support prefix matching — 'summary' matches 'summary-049', etc.
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1119:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1126:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1129:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1134:          <!-- ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1137:          <!-- /ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1145:      benefit: "93% token savings on anchor-based retrieval"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1146:      reference: "See /memory:save Step 3 for full anchor documentation"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1594:  - "Self-validate at each step before proceeding"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:12:# Note: Documents should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:88:    high: { range: "80-100%", action: "Proceed with citable source" }
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:89:    medium: { range: "40-79%", action: "Proceed with caution, document assumptions" }
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:101:    - B) [option with brief rationale]
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:102:    - C) [option with brief rationale]"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:131:    stop_action: "STOP and address before proceeding"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:156:    description: "Make changes before proceeding"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:178:      verification: "Cannot proceed without identified features"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:202:      description: "Discovered project context may proceed with logged assumptions"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:203:      fail_action: "Proceed with rationale"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:225:    review: "Show detailed output before proceeding"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:400:  anchor_rules: "readme_template.md S12 (Anchor Templates)"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:429:      question: "Create [type] README at [path]. Proceed?"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:431:      - label: "A) Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:433:      - label: "B) Change type"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:435:      - label: "C) Change location"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:515:      question: "Structure selected. Proceed to generation?"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:545:      - label: "B) Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:580:      - label: "Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:614:        description: "Proceed to save context"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:615:      - label: "B) View findings"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:617:      - label: "C) Address issues"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:661:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:663:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:665:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:672:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:675:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:680:          <!-- ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:683:          <!-- /ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:691:      benefit: "93% token savings on anchor-based retrieval"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:692:      reference: "See /memory:save Step 3 for full anchor documentation"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:772:  - "Proceed without user approval at checkpoints"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:924:# INSTALL GUIDE: QUALITY STANDARDS (operation-specific)
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:961:      question: "Create [type] installation guide for [project]. Output: [output_path]. Platforms: [platforms]. Proceed?"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:963:      - label: "A) Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:965:      - label: "B) Change type prefix"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:967:      - label: "C) Change output location"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1007:      - label: "B) Add more"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1009:      - label: "C) Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1051:      - label: "B) Modify steps"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1053:      - label: "C) Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1082:      - label: "B) Show AI-First section"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1084:      - label: "C) Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1092:    - Command verification (syntax correct, versions accurate, platform-specific)
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1124:      - label: "Proceed"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1158:        description: "Proceed to save context"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1159:      - label: "B) View findings"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1161:      - label: "C) Address issues"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1206:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1208:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1209:      # Note: Anchor IDs support prefix matching -- 'summary' matches 'summary-049', etc.
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1211:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1218:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1221:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1226:          <!-- ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1229:          <!-- /ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1237:      benefit: "93% token savings on anchor-based retrieval"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1238:      reference: "See /memory:save Step 3 for full anchor documentation"
.opencode/commands/create/README.txt:21:<!-- ANCHOR:overview -->
.opencode/commands/create/README.txt:28:<!-- /ANCHOR:overview -->
.opencode/commands/create/README.txt:32:<!-- ANCHOR:purpose -->
.opencode/commands/create/README.txt:39:<!-- /ANCHOR:purpose -->
.opencode/commands/create/README.txt:43:<!-- ANCHOR:commands -->
.opencode/commands/create/README.txt:65:<!-- /ANCHOR:commands -->
.opencode/commands/create/README.txt:69:<!-- ANCHOR:structure -->
.opencode/commands/create/README.txt:95:<!-- /ANCHOR:structure -->
.opencode/commands/create/README.txt:99:<!-- ANCHOR:instructions -->
.opencode/commands/create/README.txt:108:<!-- /ANCHOR:instructions -->
.opencode/commands/create/README.txt:112:<!-- ANCHOR:execution-modes -->
.opencode/commands/create/README.txt:130:<!-- /ANCHOR:execution-modes -->
.opencode/commands/create/README.txt:134:<!-- ANCHOR:usage-examples -->
.opencode/commands/create/README.txt:166:<!-- /ANCHOR:usage-examples -->
.opencode/commands/create/README.txt:170:<!-- ANCHOR:faq -->
.opencode/commands/create/README.txt:185:<!-- /ANCHOR:faq -->
.opencode/commands/create/README.txt:189:<!-- ANCHOR:troubleshooting -->
.opencode/commands/create/README.txt:203:<!-- /ANCHOR:troubleshooting -->
.opencode/commands/create/README.txt:207:<!-- ANCHOR:related-documents -->
.opencode/commands/create/README.txt:220:<!-- /ANCHOR:related-documents -->
.opencode/commands/create/folder_readme.md:46:    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
.opencode/commands/create/folder_readme.md:57:    │   │ To proceed, restart with:                                  │
.opencode/commands/create/folder_readme.md:173:   │ **Before proceeding, please answer:**                          │
.opencode/commands/create/folder_readme.md:177:   │    B) Install Guide - Create/update installation guide         │
.opencode/commands/create/folder_readme.md:187:   │    B) Component - Documentation for a module/package/skill     │
.opencode/commands/create/folder_readme.md:188:   │    C) Feature - Documentation for a specific feature/system     │
.opencode/commands/create/folder_readme.md:198:   │    B) macOS only                                               │
.opencode/commands/create/folder_readme.md:199:   │    C) Linux only                                               │
.opencode/commands/create/folder_readme.md:204:   │    B) INSTALL.md at project root                               │
.opencode/commands/create/folder_readme.md:205:   │    C) docs/INSTALL.md                                          │
.opencode/commands/create/folder_readme.md:213:   │    B) Autonomous - Execute without prompts                     │
.opencode/commands/create/folder_readme.md:218:6. WAIT for user response (DO NOT PROCEED)
.opencode/commands/create/folder_readme.md:246:   │       │   │ **How should we proceed?**                                 │
.opencode/commands/create/folder_readme.md:248:   │       │   │    B) Create backup and overwrite                          │
.opencode/commands/create/folder_readme.md:249:   │       │   │    C) Merge/update existing content                        │
.opencode/commands/create/folder_readme.md:263:⛔ HARD STOP: DO NOT proceed until user explicitly answers
.opencode/commands/create/folder_readme.md:304:│   ├─ YES → Proceed to "1. INSTRUCTIONS" section below
.opencode/commands/create/folder_readme.md:387:- Proceeded without explicit target path or project name
.opencode/commands/create/folder_readme.md:465:└─ MUST NOT proceed without content to document
.opencode/commands/create/folder_readme.md:471:├─ MUST NOT include a Table of Contents or <!-- ANCHOR --> comments
.opencode/commands/create/folder_readme.md:477:├─ MUST confirm no Table of Contents was added

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/README.txt | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Create Commands"
     3	description: "Slash commands for scaffolding OpenCode components, documentation packages, and changelogs."
     4	trigger_phrases:
     5	  - "create command"
     6	  - "scaffold component"
     7	  - "create agent"
     8	  - "create skill"
     9	  - "create readme"
    10	  - "create feature catalog"
    11	  - "create testing playbook"
    12	  - "create changelog"
    13	---
    14	
    15	# Create Commands
    16	
    17	> Slash commands for scaffolding OpenCode components, documentation packages, and changelog entries with proper templates and validation.
    18	
    19	---
    20	
    21	<!-- ANCHOR:overview -->
    22	## 1. OVERVIEW
    23	
    24	The `create` command group scaffolds OpenCode components, documentation packages, and changelog entries. All commands follow a structured YAML workflow and support `:auto` (no approval prompts) and `:confirm` (pause at each step) execution modes.
    25	
    26	All shipped `create` commands run Phase 0 (@general agent self-verification).
    27	
    28	<!-- /ANCHOR:overview -->
    29	
    30	---
    31	
    32	<!-- ANCHOR:purpose -->
    33	## 2. PURPOSE
    34	
    35	Use this index to understand which `/create:*` command owns a given scaffolding workflow, which argument shape it expects, and which package contract or artifact family it generates.
    36	
    37	This document is a routing and reference surface only. Run the command entrypoint itself for execution, setup prompting, and YAML workflow dispatch.
    38	
    39	<!-- /ANCHOR:purpose -->
    40	
    41	---
    42	
    43	<!-- ANCHOR:commands -->
    44	## 3. COMMANDS
    45	| Command | Invocation | Description |
    46	|---------|------------|-------------|
    47	| **agent** | `/create:agent <name> [description] [:auto\|:confirm]` | Create a new OpenCode agent with frontmatter, tool permissions, and behavioral rules |
    48	| **changelog** | `/create:changelog <spec-folder-or-component> [--bump <major\|minor\|patch\|build>] [:auto\|:confirm]` | Create a changelog entry by detecting recent work, resolving the target component folder, and generating a formatted changelog file |
    49	| **feature-catalog** | `/create:feature-catalog <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `feature_catalog/` package using the shipped `sk-doc` contract |
    50	| **folder_readme** | `/create:folder_readme [readme\|install] <target> [flags] [:auto\|:confirm]` | Unified README and install guide creation |
    51	| **skill** | `/create:skill <name> <operation> [type] [--chained] [:auto\|:confirm]` | Unified skill workflow (full-create, full-update, reference-only, asset-only) |
    52	| **testing-playbook** | `/create:testing-playbook <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `manual_testing_playbook/` package using the shipped `sk-doc` contract |
    53	
    54	### README Types
    55	
    56	The `readme` operation in `/create:folder_readme` accepts a `--type` flag:
    57	
    58	| Type | Use Case |
    59	|------|----------|
    60	| `project` | Root-level project documentation |
    61	| `component` | Reusable module or library |
    62	| `feature` | Specific feature or system |
    63	| `skill` | AI skill supplementary documentation |
    64	
    65	<!-- /ANCHOR:commands -->
    66	
    67	---
    68	
    69	<!-- ANCHOR:structure -->
    70	## 4. STRUCTURE
    71	
    72	```
    73	create/
    74	├── agent.md              # /create:agent command
    75	├── changelog.md          # /create:changelog command
    76	├── feature-catalog.md    # /create:feature-catalog command
    77	├── folder_readme.md      # /create:folder_readme — unified README + install guide command
    78	├── skill.md           # /create:skill command
    79	├── testing-playbook.md   # /create:testing-playbook command
    80	└── assets/               # YAML workflow definitions
    81	    ├── create_agent_auto.yaml
    82	    ├── create_agent_confirm.yaml
    83	    ├── create_changelog_auto.yaml
    84	    ├── create_changelog_confirm.yaml
    85	    ├── create_feature_catalog_auto.yaml
    86	    ├── create_feature_catalog_confirm.yaml
    87	    ├── create_folder_readme_auto.yaml
    88	    ├── create_folder_readme_confirm.yaml
    89	    ├── create_skill_auto.yaml
    90	    ├── create_skill_confirm.yaml
    91	    ├── create_testing_playbook_auto.yaml
    92	    └── create_testing_playbook_confirm.yaml
    93	```
    94	
    95	<!-- /ANCHOR:structure -->
    96	
    97	---
    98	
    99	<!-- ANCHOR:instructions -->
   100	## 5. INSTRUCTIONS
   101	
   102	1. Pick the command family that matches the artifact you need.
   103	2. Use the canonical command entrypoint, not a deprecated alias.
   104	3. Supply `:auto` for autonomous execution or `:confirm` for checkpointed execution.
   105	4. For rooted documentation packages, use the package-specific commands instead of composing the files manually.
   106	5. If the command performs file modifications, keep it attached to the active spec workflow.
   107	
   108	<!-- /ANCHOR:instructions -->
   109	
   110	---
   111	
   112	<!-- ANCHOR:execution-modes -->
   113	## 6. EXECUTION MODES
   114	
   115	| Mode | Suffix | Behavior |
   116	|------|--------|----------|
   117	| **Auto** | `:auto` | Execute all steps without approval prompts |
   118	| **Confirm** | `:confirm` | Pause at each step and wait for user approval |
   119	
   120	Each mode loads a separate YAML workflow from `assets/` when that command ships YAML assets:
   121	- Auto: `create_<command>_auto.yaml`
   122	- Confirm: `create_<command>_confirm.yaml`
   123	
   124	The `--chained` flag on `/create:skill` doc-only operations indicates parent workflow handoff.
   125	
   126	The documentation-package commands preserve the live `sk-doc` contracts:
   127	- `/create:feature-catalog` produces `feature_catalog/feature_catalog.md` plus numbered category folders
   128	- `/create:testing-playbook` produces `manual_testing_playbook/manual_testing_playbook.md` plus numbered category folders and no sidecar review/ledger files
   129	
   130	<!-- /ANCHOR:execution-modes -->
   131	
   132	---
   133	
   134	<!-- ANCHOR:usage-examples -->
   135	## 7. USAGE EXAMPLES
   136	
   137	```bash
   138	# Create a new agent in auto mode
   139	/create:agent my-analyzer "Code analysis specialist" :auto
   140	
   141	# Create a README for a specific folder
   142	/create:folder_readme readme .opencode/skills/my-skill --type skill :confirm
   143	
   144	# Create a full skill
   145	/create:skill my-new-skill full-create :auto
   146	
   147	# Create a rooted feature catalog package
   148	/create:feature-catalog system-spec-kit create :confirm
   149	
   150	# Update an existing testing playbook package
   151	/create:testing-playbook system-spec-kit update :auto
   152	
   153	# Add a reference doc to an existing skill
   154	/create:skill my-skill reference-only debugging :confirm
   155	
   156	# Create an install guide for multiple platforms
   157	/create:folder_readme install my-tool --platforms opencode,claude-code :confirm
   158	
   159	# Create a changelog from a completed spec folder
   160	/create:changelog .opencode/specs/01--system-spec-kit/042-memory-upgrade :auto
   161	
   162	# Create a changelog for a specific component
   163	/create:changelog sk-doc --bump minor :confirm
   164	```
   165	
   166	<!-- /ANCHOR:usage-examples -->
   167	
   168	---
   169	
   170	<!-- ANCHOR:faq -->
   171	## 8. FAQ
   172	
   173	**Q: When should I use `create` vs `update` for feature-catalog and testing-playbook commands?**
   174	
   175	A: Use `create` when the package folder does not yet exist under the skill root. Use `update` when the package already exists and you want to add or revise content within it. Running `create` on an existing package will produce a conflict error.
   176	
   177	**Q: What does the `--chained` flag do on `/create:skill`?**
   178	
   179	A: The `--chained` flag signals that the command was dispatched from a parent workflow (for example, a `full-create` that hands off to a doc-only phase). It changes how the command reports completion and does not affect the output files. Remove it when running the command standalone.
   180	
   181	**Q: How does `/create:changelog` determine which version to assign?**
   182	
   183	A: The command reads the most recent changelog entry in the target component folder and auto-increments the BUILD segment. Supply `--bump major`, `--bump minor`, or `--bump patch` to override and bump a higher segment. In `:confirm` mode you can also select the version manually during execution.
   184	
   185	<!-- /ANCHOR:faq -->
   186	
   187	---
   188	
   189	<!-- ANCHOR:troubleshooting -->
   190	## 9. TROUBLESHOOTING
   191	
   192	| Problem | Cause | Fix |
   193	|---------|-------|-----|
   194	| Phase 0 fails | @general agent not available | Verify agent files exist in the runtime path (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, or `.gemini/agents/`) |
   195	| YAML workflow not found | Missing asset file | Check `assets/` contains the matching YAML for operation and mode |
   196	| Skill not found for skill operation | Wrong skill name | Use the exact folder name from `.opencode/skills/` |
   197	| Catalog or playbook update target missing | `update` used before the package exists | Re-run with `create` or point to the correct skill root |
   198	| Playbook scaffolds forbidden sidecar files | Using an outdated package shape | Use `/create:testing-playbook`, which keeps review/orchestration guidance in `manual_testing_playbook.md` |
   199	| `--chained` has no effect | Only meaningful for chained skill doc-only operations | Remove flag when running standalone |
   200	| `changelog` wrong component | File path mapping mismatch | Use `--component` override or select manually in `:confirm` mode |
   201	| `changelog` version conflict | File already exists | Command auto-increments BUILD segment. Specify `--bump` to override |
   202	
   203	<!-- /ANCHOR:troubleshooting -->
   204	
   205	---
   206	
   207	<!-- ANCHOR:related-documents -->
   208	## 10. RELATED DOCUMENTS
   209	
   210	| Document | Purpose |
   211	|----------|---------|
   212	| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
   213	| [sk-doc SKILL.md](../../skills/sk-doc/SKILL.md) | Templates and standards used by create commands |
   214	| [feature_catalog_creation.md](../../skills/sk-doc/references/feature_catalog_creation.md) | Standards for rooted feature catalog packages |
   215	| [manual_testing_playbook_creation.md](../../skills/sk-doc/references/manual_testing_playbook_creation.md) | Standards for rooted testing playbook packages |
   216	| [agent_template.md](../../skills/sk-doc/assets/agent_template.md) | Agent creation template |
   217	| [command_template.md](../../skills/sk-doc/assets/command_template.md) | Command creation template |
   218	| [skill_creation.md](../../skills/sk-doc/references/skill_creation.md) | Skill creation workflow reference |
   219	
   220	<!-- /ANCHOR:related-documents -->

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/folder_readme.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	description: Unified folder README and install guide creation with sk-doc quality standards. Modes :auto, :confirm.
     3	argument-hint: "[readme|install] <target> [--type <project|component|feature|skill>] [--platforms <list>] [--output <path>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
     4	allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
     5	---
     6	
     7	> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
     8	>
     9	> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
    10	>
    11	> **YOUR FIRST ACTION:**
    12	> 1. Run Phase 0: @markdown agent self-verification (below)
    13	> 2. Run Setup Phase: consolidated prompt to gather inputs (including operation detection)
    14	> 3. Determine execution mode from user input (`:auto` or `:confirm`)
    15	> 4. Load the corresponding YAML file from `assets/`:
    16	>    - Auto mode → `create_folder_readme_auto.yaml`
    17	>    - Confirm mode → `create_folder_readme_confirm.yaml`
    18	>    (Both YAMLs contain readme AND install operations — skip to the detected operation section)
    19	> 5. Execute the YAML workflow step by step
    20	>
    21	> The @markdown references below are self-verification checks — not dispatch instructions.
    22	> All content after the Setup Phase is reference context for the YAML workflow.
    23	
    24	---
    25	
    26	# 🚨 PHASE 0: @MARKDOWN AGENT VERIFICATION
    27	
    28	**STATUS: ☐ BLOCKED**
    29	
    30	```
    31	EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):
    32	
    33	SELF-CHECK: Are you operating as the @markdown agent?
    34	│
    35	├─ INDICATORS that you ARE @markdown agent:
    36	│   ├─ You were invoked with "@markdown" prefix
    37	│   ├─ You have template-first workflow capabilities
    38	│   ├─ You load templates BEFORE creating content
    39	│   ├─ You validate template alignment AFTER creating
    40	│
    41	├─ IF YES (all indicators present):
    42	│   └─ create_agent_verified = TRUE → Continue to Setup Phase
    43	│
    44	└─ IF NO or UNCERTAIN:
    45	    │
    46	    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    47	    │
    48	    ├─ DISPLAY to user:
    49	    │   ┌────────────────────────────────────────────────────────────┐
    50	    │   │ ⛔ MARKDOWN AGENT REQUIRED                                      │
    51	    │   │                                                            │
    52	    │   │ This command requires the @markdown agent for:              │
    53	    │   │   • Template-first workflow (loads before creating)          │
    54	    │   │   • DQI scoring (target: 75+ Good)                         │
    55	    │   │   • sk-doc skill integration                               │
    56	    │   │                                                            │
    57	    │   │ To proceed, restart with:                                  │
    58	    │   │   @markdown /create:folder_readme [operation] [target]      │
    59	    │   │                                                            │
    60	    │   │ Reference: [runtime_agent_path]/markdown.md                 │
    61	    │   └────────────────────────────────────────────────────────────┘
    62	    │
    63	    └─ RETURN: STATUS=FAIL ERROR="Markdown agent required"
    64	```
    65	
    66	**Phase Output:**
    67	- `create_agent_verified = ________________`
    68	
    69	---
    70	
    71	# 🔒 UNIFIED SETUP PHASE
    72	
    73	**STATUS: ☐ BLOCKED**
    74	
    75	**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**
    76	
    77	This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.
    78	
    79	**Round-trip optimization:** This workflow requires only 1 user interaction (all questions asked together), with an optional follow-up only if target file already exists.
    80	
    81	### `:auto` Setup Resolution
    82	
    83	Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.
    84	
    85	Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:
    86	
    87	1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `/tmp/create-folder-readme-config.json` (shape: `operation`, `targetPath`, `readmeType`, `projectName`, `platforms`, `outputPath`, `existingFile`, `existingFileAction`, `executionMode: "auto"`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/create/assets/create_folder_readme_auto.yaml`. End §0.
    88	
    89	2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `operation`, `readme_type`, `platforms`, `existing_file_action`. **Ordering rule**: ask `operation` first when ambiguous — branch selection determines whether README or install-guide fields are required.
    90	
    91	3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/create:folder_readme:auto` as the command name. Exit non-zero. Do not load YAML.
    92	
    93	`:confirm` path stays unchanged — see the consolidated setup prompt section below.
    94	
    95	### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)
    96	
    97	The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.
    98	
    99	```yaml
   100	PRE-BOUND SETUP ANSWERS:
   101	  operation: readme  # readme | install
   102	  target_path: .opencode/skills/system-spec-kit  # README branch path
   103	  readme_type: skill  # project | component | feature | skill
   104	  project_name: semantic-search-mcp  # install branch project/tool name
   105	  platforms: all  # all | macos | linux | windows | docker | comma-separated subset
   106	  output_path: install_guides/Tool - semantic-search-mcp.md  # install branch output path
   107	  existing_file: false  # boolean
   108	  existing_file_action: merge  # overwrite | backup-overwrite | merge | cancel
   109	  execution_mode: AUTONOMOUS  # from :auto suffix
   110	```
   111	
   112	Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).
   113	
   114	### Default Resolution Table
   115	
   116	| Field | Required | Resolves Via | Default | Tier-2 Candidate |
   117	|-------|----------|--------------|---------|------------------|
   118	| `operation` | Y | first positional token, flag `--operation`, marker `operation`, or default when remaining argument is path-like | `readme` for path-like target | Y, when operation is absent and target is not path-like |
   119	| `target_path` | Conditional | README branch positional target, marker `target_path` | none | N |
   120	| `readme_type` | Conditional | flag `--type`, marker `readme_type`, or targeted README type choice | none | Y |
   121	| `project_name` | Conditional | install branch positional project name, marker `project_name` | none | N |
   122	| `platforms` | Conditional | flag `--platforms`, marker `platforms`, or targeted platform choice | none | Y |
   123	| `output_path` | Conditional | flag `--output`, marker `output_path`, or recommended install-guide path | `install_guides/[Type] - [Name].md` | N |
   124	| `existing_file` | N | output existence check, marker `existing_file`, or default | `false` | N |
   125	| `existing_file_action` | Conditional | marker `existing_file_action`, inline conflict response, or targeted conflict choice when an existing README/output conflict is detected | none | Y |
   126	| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
   127	
   128	```
   129	EXECUTE THIS SINGLE CONSOLIDATED PROMPT:
   130	
   131	0. DETECT OPERATION from $ARGUMENTS or command invocation:
   132	   ├─ First positional token is "readme" → operation = "readme", remove token from args
   133	   ├─ First positional token is "install" → operation = "install", remove token from args
   134	   ├─ "--operation readme" flag → operation = "readme"
   135	   ├─ "--operation install" flag → operation = "install"
   136	   └─ No operation detected → operation = "ASK" (include Q_OP in prompt)
   137	   NOTE: When no operation is detected and $ARGUMENTS contains a path-like value, default to "readme".
   138	
   139	1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   140	   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q_MODE)
   141	   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q_MODE)
   142	   └─ No suffix → execution_mode = "ASK" (include Q_MODE in prompt)
   143	
   144	── README BRANCH (operation = "readme") ──────────────────────────────
   145	
   146	2R. CHECK if $ARGUMENTS contains target path:
   147	    ├─ IF $ARGUMENTS has path content (ignoring flags) → target_path = $ARGUMENTS, omit Q_R1
   148	    └─ IF $ARGUMENTS is empty → include Q_R1 in prompt
   149	
   150	3R. CHECK if $ARGUMENTS contains --type flag:
   151	    ├─ IF --type flag present → readme_type = [parsed value], omit Q_R2
   152	    └─ IF no --type flag → include Q_R2 in prompt
   153	
   154	── INSTALL BRANCH (operation = "install") ────────────────────────────
   155	
   156	2I. CHECK if $ARGUMENTS contains a project name:
   157	    ├─ IF $ARGUMENTS has content (ignoring flags/suffixes) → project_name = $ARGUMENTS, omit Q_I1
   158	    └─ IF $ARGUMENTS is empty → include Q_I1 in prompt
   159	
   160	3I. CHECK for --platforms flag in $ARGUMENTS:
   161	    ├─ IF --platforms flag present with valid values → platforms = [values], omit Q_I2
   162	    └─ IF no --platforms flag → include Q_I2 in prompt
   163	
   164	4I. Check for existing installation guides:
   165	    $ ls -la ./install_guides/*.md ./INSTALL.md ./docs/INSTALL.md 2>/dev/null
   166	    - Will inform conflict handling in Q_I3 if files exist
   167	
   168	──────────────────────────────────────────────────────────────────────
   169	
   170	5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):
   171	
   172	   ┌────────────────────────────────────────────────────────────────┐
   173	   │ **Before proceeding, please answer:**                          │
   174	   │                                                                │
   175	   │ **Q_OP. Operation** (if not detected from args):               │
   176	   │    A) README - Create/update folder documentation              │
   177	   │    B) Install Guide - Create/update installation guide         │
   178	   │                                                                │
   179	   │ ── README Questions (if operation = readme) ──                 │
   180	   │                                                                │
   181	   │ **Q_R1. Target Path** (if not provided in command):            │
   182	   │    Where should the README be created?                         │
   183	   │    (e.g., .opencode/skills/my-skill, src/components, ./)        │
   184	   │                                                                │
   185	   │ **Q_R2. README Type** (if not provided via --type):            │
   186	   │    A) Project - Main project documentation at root level       │
   187	   │    B) Component - Documentation for a module/package/skill     │
   188	   │    C) Feature - Documentation for a specific feature/system     │
   189	   │    D) Skill - Documentation for an OpenCode skill              │
   190	   │                                                                │
   191	   │ ── Install Guide Questions (if operation = install) ──         │
   192	   │                                                                │
   193	   │ **Q_I1. Project Name** (if not provided in command):           │
   194	   │    What project/tool needs an installation guide?              │
   195	   │                                                                │
   196	   │ **Q_I2. Target Platforms** (required):                         │
   197	   │    A) All platforms (macOS, Linux, Windows, Docker)            │
   198	   │    B) macOS only                                               │
   199	   │    C) Linux only                                               │
   200	   │    D) Custom (specify: macos,linux,windows,docker)             │
   201	   │                                                                │
   202	   │ **Q_I3. Output Location** (required):                          │
   203	   │    A) install_guides/[Type] - [Name].md (Recommended)          │
   204	   │    B) INSTALL.md at project root                               │
   205	   │    C) docs/INSTALL.md                                          │
   206	   │    D) Custom path (specify)                                    │
   207	   │    [If existing file found: E) Overwrite | F) Merge | G) Cancel]│
   208	   │                                                                │
   209	   │ ── Common ──                                                   │
   210	   │                                                                │
   211	   │ **Q_MODE. Execution Mode** (if no :auto/:confirm suffix):        │
   212	   │    A) Interactive - Confirm at each step (Recommended)          │
   213	   │    B) Autonomous - Execute without prompts                     │
   214	   │                                                                │
   215	   │ Reply with answers for applicable questions only.              │
   216	   └────────────────────────────────────────────────────────────────┘
   217	
   218	6. WAIT for user response (DO NOT PROCEED)
   219	
   220	7. Parse response and store ALL results:
   221	   - operation = [readme/install]
   222	
   223	   IF readme:
   224	     - target_path = [from Q_R1 or $ARGUMENTS]
   225	     - readme_type = [A/B/C/D from Q_R2 or --type flag → project/component/feature/skill]
   226	
   227	   IF install:
   228	     - project_name = [from Q_I1 or $ARGUMENTS]
   229	     - platforms = [from Q_I2 or --platforms flag: all/macos/linux/windows/docker]
   230	     - output_path = [derived from Q_I3 choice]
   231	     - existing_file = [yes/no based on check]
   232	     - conflict_resolution = [if existing: overwrite/merge/cancel]
   233	
   234	   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q_MODE]
   235	
   236	8. VERIFY target and check for existing output:
   237	   ├─ README operation:
   238	   │   ├─ Check if target path exists: $ ls -la [target_path] 2>/dev/null
   239	   │   ├─ IF target path does not exist: Create directory: mkdir -p [target_path]
   240	   │   ├─ Check for existing README: $ ls -la [target_path]/README.md 2>/dev/null
   241	   │   └─ IF README.md already exists:
   242	   │       ├─ ASK user (ONLY conditional follow-up):
   243	   │       │   ┌────────────────────────────────────────────────────────────┐
   244	   │       │   │ **README.md already exists at [path].**                    │
   245	   │       │   │                                                            │
   246	   │       │   │ **How should we proceed?**                                 │
   247	   │       │   │    A) Overwrite existing file                               │
   248	   │       │   │    B) Create backup and overwrite                          │
   249	   │       │   │    C) Merge/update existing content                        │
   250	   │       │   │    D) Cancel                                               │
   251	   │       │   └────────────────────────────────────────────────────────────┘
   252	   │       ├─ WAIT for user response
   253	   │       └─ Process based on choice (D = RETURN STATUS=CANCELLED)
   254	   │
   255	   └─ Install operation:
   256	       └─ IF output location has conflict AND conflict_resolution not set:
   257	           └─ Handle inline based on Q_I3 response (E/F/G options)
   258	
   259	9. SET STATUS: ✅ PASSED
   260	

codex
One thing surfaced: the YAML syntax is valid, and `template_rules.json` has no `tocRequired:true`. The interesting residue is not TOC generation; it’s anchor-related text in `/create` surfaces, so I’m narrowing whether those are live requirements or carved-out memory/spec-kit references.
exec
/bin/zsh -lc "nl -ba .opencode/commands/create/assets/create_folder_readme_auto.yaml | sed -n '430,460p;650,705p;1105,1155p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   430	
   431	# ─────────────────────────────────────────────────────────────────
   432	# README: REFERENCE TEMPLATES
   433	# ─────────────────────────────────────────────────────────────────
   434	readme_reference_templates:
   435	  readme_template: .opencode/skills/sk-doc/assets/readme/readme_template.md
   436	  speckit_readme: .opencode/skills/system-spec-kit/README.md
   437	  memory_readme: .opencode/skills/system-spec-kit/README.md
   438	  core_standards: .opencode/skills/sk-doc/references/global/core_standards.md
   439	
   440	# ─────────────────────────────────────────────────────────────────
   441	# README: TEMPLATE EVOLUTION REFERENCES
   442	# ─────────────────────────────────────────────────────────────────
   443	# Points to readme_template.md sections for patterns not embedded here.
   444	# The canonical template is the single source of truth for all README structure.
   445	readme_template_references:
   446	  canonical_structure: "readme_template.md §13 (Complete Template)"
   447	  anchor_rules: "readme_template.md §12 (Anchor Templates)"
   448	  writing_patterns: "readme_template.md §6 (Writing Patterns)"
   449	  style_guide: "readme_template.md §7 (Style Reference)"
   450	  badge_shields: "readme_template.md §8 (Badge Shields)"
   451	  before_after_patterns: "readme_template.md §6.4 (Before/After)"
   452	  architecture_diagrams: "readme_template.md §6.5 (Architecture Diagrams)"
   453	
   454	# ─────────────────────────────────────────────────────────────────
   455	# README: WORKFLOW (6 STEPS WITH CHECKPOINTS)
   456	# ─────────────────────────────────────────────────────────────────
   457	readme_workflow:
   458	  step_1_request_analysis:
   459	    purpose: Determine scope and location (from UNIFIED SETUP PHASE)
   460	    activities:
   650	    # ── SEMANTIC MEMORY INTEGRATION ─────────────────────────────────
   651	    post_save_indexing:
   652	      purpose: "Index the canonical spec document immediately for search availability"
   653	      mcp_tool: memory_save
   654	      invocation: |
   655	        memory_save({
   656	          filePath: "[SPEC_FOLDER]/implementation-summary.md"
   657	        })
   658	      critical_note: "Call semantic memory MCP DIRECTLY - NEVER through Code Mode. The save target is a canonical spec document; standalone memory/*.md files are retired and the runtime rejects them."
   659	      when: "Immediately after implementation-summary.md is written to disk"
   660	
   661	    anchor_requirements:
   662	      enforcement: MANDATORY
   663	      minimum_anchors: 2
   664	      pattern: "[context-type]-[keywords]-[spec-number]"
   665	      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
   666	      case: "UPPERCASE recommended for visibility"
   667	      required_sections:
   668	      - context_type: "general"
   669	        section: "Session summary with README creation outcomes"
   670	        example_id: "GENERAL-SESSION-SUMMARY-{spec#}"
   671	        example: |
   672	          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
   673	          ## Session Summary
   674	          Created [type] README at [path]...
   675	          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
   676	      - context_type: "decision"
   677	        section: "Key decisions made during README creation"
   678	        example_id: "DECISION-README-STRUCTURE-{spec#}"
   679	        example: |
   680	          <!-- ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
   681	          ## Key Decisions
   682	          - Chose structure X because...
   683	          <!-- /ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
   684	      optional_sections:
   685	      - context_type: "implementation"
   686	        section: "Structure and sections chosen"
   687	        example_id: "IMPLEMENTATION-STRUCTURE-{spec#}"
   688	      - context_type: "research"
   689	        section: "Content sources and references"
   690	        example_id: "RESEARCH-SOURCES-{spec#}"
   691	      benefit: "93% token savings on anchor-based retrieval"
   692	      reference: "See /memory:save Step 3 for full anchor documentation"
   693	
   694	    importance_tier:
   695	      assign: normal
   696	      rationale: "README creation is standard documentation task"
   697	      promotion_note: "Use memory_update() to promote to 'important' if README becomes a key reference"
   698	      tier_reference: |
   699	        constitutional: Core project rules (auto-surface always)
   700	        critical: Foundational decisions (high priority in search)
   701	        important: Significant work like implementations
   702	        normal: Standard context like documentation tasks (this workflow)
   703	        temporary: Short-term notes
   704	        deprecated: Outdated but retained
   705	
  1105	      purpose: "Index the canonical spec document immediately for search availability"
  1106	      mcp_tool: memory_save
  1107	      invocation: |
  1108	        memory_save({
  1109	          filePath: "[SPEC_FOLDER]/implementation-summary.md"
  1110	        })
  1111	      critical_note: "Call semantic memory MCP DIRECTLY - NEVER through Code Mode. The save target is a canonical spec document; standalone memory/*.md files are retired and the runtime rejects them."
  1112	      when: "Immediately after implementation-summary.md is written to disk"
  1113	
  1114	    anchor_requirements:
  1115	      enforcement: MANDATORY
  1116	      minimum_anchors: 2
  1117	      # Note: Anchor IDs support prefix matching — 'summary' matches 'summary-049', etc.
  1118	      pattern: "[context-type]-[keywords]-[spec-number]"
  1119	      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
  1120	      case: "UPPERCASE recommended for visibility"
  1121	      required_sections:
  1122	      - context_type: "general"
  1123	        section: "Session summary with installation guide outcomes"
  1124	        example_id: "GENERAL-SESSION-SUMMARY-{spec#}"
  1125	        example: |
  1126	          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
  1127	          ## Session Summary
  1128	          Created [type] guide for [project]...
  1129	          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
  1130	      - context_type: "decision"
  1131	        section: "Key decisions made during guide creation"
  1132	        example_id: "DECISION-PLATFORM-SUPPORT-{spec#}"
  1133	        example: |
  1134	          <!-- ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
  1135	          ## Key Decisions
  1136	          - Platform support choices...
  1137	          <!-- /ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
  1138	      optional_sections:
  1139	      - context_type: "research"
  1140	        section: "Prerequisites discovered"
  1141	        example_id: "RESEARCH-PREREQUISITES-{spec#}"
  1142	      - context_type: "implementation"
  1143	        section: "Common issues documented"
  1144	        example_id: "IMPLEMENTATION-TROUBLESHOOTING-{spec#}"
  1145	      benefit: "93% token savings on anchor-based retrieval"
  1146	      reference: "See /memory:save Step 3 for full anchor documentation"
  1147	
  1148	    importance_tier:
  1149	      assign: important
  1150	      rationale: "Installation guides capture valuable setup knowledge for future reference"
  1151	      promotion_note: "Use memory_update() to promote to 'critical' if this becomes a frequently referenced guide"
  1152	      tier_reference: |
  1153	        constitutional: Core project rules (auto-surface always)
  1154	        critical: Foundational decisions (high priority in search)
  1155	        important: Significant work like installation guides (this workflow)

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/assets/create_folder_readme_confirm.yaml | sed -n '640,705p;1190,1250p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   640	    - implementation_summary: "[SPEC_FOLDER]/implementation-summary.md"
   641	    validation: context_saved
   642	    checkpoint:
   643	      question: "Context saved. README creation complete!"
   644	      options:
   645	      - label: "Done"
   646	        description: "Complete workflow"
   647	      - label: "View summary"
   648	        description: "Show final summary"
   649	
   650	    # -- SEMANTIC MEMORY INTEGRATION -----------------------------------------
   651	    post_save_indexing:
   652	      purpose: "Index the canonical spec document immediately for search availability"
   653	      mcp_tool: memory_save
   654	      invocation: |
   655	        memory_save({
   656	          filePath: "[SPEC_FOLDER]/implementation-summary.md"
   657	        })
   658	      critical_note: "Call semantic memory MCP DIRECTLY - NEVER through Code Mode. The save target is a canonical spec document; standalone memory/*.md files are retired and the runtime rejects them."
   659	      when: "Immediately after implementation-summary.md is written to disk"
   660	
   661	    anchor_requirements:
   662	      enforcement: MANDATORY
   663	      minimum_anchors: 2
   664	      pattern: "[context-type]-[keywords]-[spec-number]"
   665	      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
   666	      case: "UPPERCASE recommended for visibility"
   667	      required_sections:
   668	      - context_type: "general"
   669	        section: "Session summary with README creation outcomes"
   670	        example_id: "GENERAL-SESSION-SUMMARY-{spec#}"
   671	        example: |
   672	          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
   673	          ## Session Summary
   674	          Created [type] README at [path]...
   675	          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
   676	      - context_type: "decision"
   677	        section: "Key decisions made during README creation"
   678	        example_id: "DECISION-README-STRUCTURE-{spec#}"
   679	        example: |
   680	          <!-- ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
   681	          ## Key Decisions
   682	          - Chose structure X because...
   683	          <!-- /ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
   684	      optional_sections:
   685	      - context_type: "implementation"
   686	        section: "Structure and sections chosen"
   687	        example_id: "IMPLEMENTATION-STRUCTURE-{spec#}"
   688	      - context_type: "research"
   689	        section: "Content sources and references"
   690	        example_id: "RESEARCH-SOURCES-{spec#}"
   691	      benefit: "93% token savings on anchor-based retrieval"
   692	      reference: "See /memory:save Step 3 for full anchor documentation"
   693	
   694	    importance_tier:
   695	      assign: normal
   696	      rationale: "README creation is standard documentation task"
   697	      promotion_note: "Use memory_update() to promote to 'important' if README becomes a key reference"
   698	      tier_reference: |
   699	        constitutional: Core project rules (auto-surface always)
   700	        critical: Foundational decisions (high priority in search)
   701	        important: Significant work like implementations
   702	        normal: Standard context like documentation tasks (this workflow)
   703	        temporary: Short-term notes
   704	        deprecated: Outdated but retained
   705	
  1190	      - label: "Done"
  1191	        description: "Complete workflow"
  1192	      - label: "View summary"
  1193	        description: "Show final summary"
  1194	
  1195	    # -- SEMANTIC MEMORY INTEGRATION -----------------------------------------
  1196	    post_save_indexing:
  1197	      purpose: "Index the canonical spec document immediately for search availability"
  1198	      mcp_tool: memory_save
  1199	      invocation: |
  1200	        memory_save({
  1201	          filePath: "[SPEC_FOLDER]/implementation-summary.md"
  1202	        })
  1203	      critical_note: "Call semantic memory MCP DIRECTLY - NEVER through Code Mode. The save target is a canonical spec document; standalone memory/*.md files are retired and the runtime rejects them."
  1204	      when: "Immediately after implementation-summary.md is written to disk"
  1205	
  1206	    anchor_requirements:
  1207	      enforcement: MANDATORY
  1208	      minimum_anchors: 2
  1209	      # Note: Anchor IDs support prefix matching -- 'summary' matches 'summary-049', etc.
  1210	      pattern: "[context-type]-[keywords]-[spec-number]"
  1211	      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
  1212	      case: "UPPERCASE recommended for visibility"
  1213	      required_sections:
  1214	      - context_type: "general"
  1215	        section: "Session summary with installation guide outcomes"
  1216	        example_id: "GENERAL-SESSION-SUMMARY-{spec#}"
  1217	        example: |
  1218	          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
  1219	          ## Session Summary
  1220	          Created [type] guide for [project]...
  1221	          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
  1222	      - context_type: "decision"
  1223	        section: "Key decisions made during guide creation"
  1224	        example_id: "DECISION-PLATFORM-SUPPORT-{spec#}"
  1225	        example: |
  1226	          <!-- ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
  1227	          ## Key Decisions
  1228	          - Platform support choices...
  1229	          <!-- /ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
  1230	      optional_sections:
  1231	      - context_type: "research"
  1232	        section: "Prerequisites discovered"
  1233	        example_id: "RESEARCH-PREREQUISITES-{spec#}"
  1234	      - context_type: "implementation"
  1235	        section: "Common issues documented"
  1236	        example_id: "IMPLEMENTATION-TROUBLESHOOTING-{spec#}"
  1237	      benefit: "93% token savings on anchor-based retrieval"
  1238	      reference: "See /memory:save Step 3 for full anchor documentation"
  1239	
  1240	    importance_tier:
  1241	      assign: important
  1242	      rationale: "Installation guides capture valuable setup knowledge for future reference"
  1243	      promotion_note: "Use memory_update() to promote to 'critical' if this becomes a frequently referenced guide"
  1244	      tier_reference: |
  1245	        constitutional: Core project rules (auto-surface always)
  1246	        critical: Foundational decisions (high priority in search)
  1247	        important: Significant work like installation guides (this workflow)
  1248	        normal: Standard context (default)
  1249	        temporary: Short-term notes
  1250	        deprecated: Outdated but retained

exec
/bin/zsh -lc "rg -n -i 'table of contents|\\bTOC\\b|<"'!--'"\\s*ANCHOR|ANCHOR:|anchor_requirements|minimum_anchors|anchor_rules|optional anchors|clear section anchors' .opencode/skills .opencode/commands/create -g '"'!system-spec-kit/templates/**'"' -g '"'!sk-doc/scripts/tests/**'"' -g '"'!**/research/research.md'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/commands/create/assets/create_folder_readme_auto.yaml:9:# Note: Documentation files should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_auto.yaml:447:  anchor_rules: "readme_template.md §12 (Anchor Templates)"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:661:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_auto.yaml:663:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_auto.yaml:665:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:672:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:675:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:680:          <!-- ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:683:          <!-- /ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1114:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1116:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1119:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1126:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1129:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1134:          <!-- ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1137:          <!-- /ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/assets/create_testing_playbook_auto.yaml:165:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:482:Verify `--agent write` writes a sk-doc template-driven README to a temp path with at least 3 emoji-prefixed H2 headers and no table of contents.
.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:486:Prompt: As an external-AI conductor wanting a template-driven README for a small skill, dispatch `claude -p --agent write` to generate `/tmp/cc-025-readme/README.md` for a fictional skill. Verify the file is written, has at least 3 emoji-prefixed H2 headers, and contains no table of contents. Return a verdict naming the file path and the H2 emoji count.
.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:488:Expected signals: Dispatch exits 0. README file exists at the requested path. README contains no table of contents section. H2 headers include emojis (per sk-doc template enforcement).
.opencode/commands/create/assets/create_agent_confirm.yaml:676:    anchor_requirements:
.opencode/commands/create/assets/create_agent_confirm.yaml:678:      minimum_anchors: 2
.opencode/commands/create/assets/create_agent_confirm.yaml:681:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_agent_confirm.yaml:688:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_agent_confirm.yaml:691:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_agent_confirm.yaml:696:          <!-- ANCHOR:DECISION-AGENT-CONFIG-{spec#} -->
.opencode/commands/create/assets/create_agent_confirm.yaml:700:          <!-- /ANCHOR:DECISION-AGENT-CONFIG-{spec#} -->
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:179:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:177:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/folder_readme.md:471:├─ MUST NOT include a Table of Contents or <!-- ANCHOR --> comments
.opencode/commands/create/folder_readme.md:477:├─ MUST confirm no Table of Contents was added
.opencode/commands/create/assets/create_feature_catalog_auto.yaml:163:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:12:# Note: Documents should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:400:  anchor_rules: "readme_template.md S12 (Anchor Templates)"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:661:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:663:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:665:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:672:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:675:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:680:          <!-- ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:683:          <!-- /ANCHOR:DECISION-README-STRUCTURE-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1206:    anchor_requirements:
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1208:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1211:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1218:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1221:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1226:          <!-- ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1229:          <!-- /ANCHOR:DECISION-PLATFORM-SUPPORT-{spec#} -->
.opencode/commands/create/README.txt:21:<!-- ANCHOR:overview -->
.opencode/commands/create/README.txt:28:<!-- /ANCHOR:overview -->
.opencode/commands/create/README.txt:32:<!-- ANCHOR:purpose -->
.opencode/commands/create/README.txt:39:<!-- /ANCHOR:purpose -->
.opencode/commands/create/README.txt:43:<!-- ANCHOR:commands -->
.opencode/commands/create/README.txt:65:<!-- /ANCHOR:commands -->
.opencode/commands/create/README.txt:69:<!-- ANCHOR:structure -->
.opencode/commands/create/README.txt:95:<!-- /ANCHOR:structure -->
.opencode/commands/create/README.txt:99:<!-- ANCHOR:instructions -->
.opencode/commands/create/README.txt:108:<!-- /ANCHOR:instructions -->
.opencode/commands/create/README.txt:112:<!-- ANCHOR:execution-modes -->
.opencode/commands/create/README.txt:130:<!-- /ANCHOR:execution-modes -->
.opencode/commands/create/README.txt:134:<!-- ANCHOR:usage-examples -->
.opencode/commands/create/README.txt:166:<!-- /ANCHOR:usage-examples -->
.opencode/commands/create/README.txt:170:<!-- ANCHOR:faq -->
.opencode/commands/create/README.txt:185:<!-- /ANCHOR:faq -->
.opencode/commands/create/README.txt:189:<!-- ANCHOR:troubleshooting -->
.opencode/commands/create/README.txt:203:<!-- /ANCHOR:troubleshooting -->
.opencode/commands/create/README.txt:207:<!-- ANCHOR:related-documents -->
.opencode/commands/create/README.txt:220:<!-- /ANCHOR:related-documents -->
.opencode/commands/create/assets/create_agent_auto.yaml:582:    anchor_requirements:
.opencode/commands/create/assets/create_agent_auto.yaml:584:      minimum_anchors: 2
.opencode/commands/create/assets/create_agent_auto.yaml:587:      format: "<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->"
.opencode/commands/create/assets/create_agent_auto.yaml:594:          <!-- ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_agent_auto.yaml:597:          <!-- /ANCHOR:GENERAL-SESSION-SUMMARY-{spec#} -->
.opencode/commands/create/assets/create_agent_auto.yaml:602:          <!-- ANCHOR:DECISION-AGENT-CONFIG-{spec#} -->
.opencode/commands/create/assets/create_agent_auto.yaml:606:          <!-- /ANCHOR:DECISION-AGENT-CONFIG-{spec#} -->
.opencode/skills/deep-review/scripts/reduce-state.cjs:1346:  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
.opencode/skills/deep-review/scripts/reduce-state.cjs:1348:    `<!-- ANCHOR:${anchorId} -->`,
.opencode/skills/deep-review/scripts/reduce-state.cjs:1352:    `<!-- /ANCHOR:${anchorId} -->`,
.opencode/skills/deep-review/scripts/reduce-state.cjs:1492:    '<!-- ANCHOR:overview -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1497:    '<!-- /ANCHOR:overview -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1498:    '<!-- ANCHOR:status -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1514:    '<!-- /ANCHOR:status -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1515:    '<!-- ANCHOR:findings-summary -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1525:    '<!-- /ANCHOR:findings-summary -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1526:    '<!-- ANCHOR:progress -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1533:    '<!-- /ANCHOR:progress -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1534:    '<!-- ANCHOR:dimension-coverage -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1541:    '<!-- /ANCHOR:dimension-coverage -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1542:    '<!-- ANCHOR:blocked-stops -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1564:    '<!-- /ANCHOR:blocked-stops -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1565:    '<!-- ANCHOR:graph-convergence -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1573:    '<!-- /ANCHOR:graph-convergence -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1574:    '<!-- ANCHOR:trend -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1583:    '<!-- /ANCHOR:trend -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1584:    '<!-- ANCHOR:corruption-warnings -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1590:    '<!-- /ANCHOR:corruption-warnings -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1591:    '<!-- ANCHOR:search-debt -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1595:    '<!-- /ANCHOR:search-debt -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1596:    '<!-- ANCHOR:next-focus -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1600:    '<!-- /ANCHOR:next-focus -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1601:    '<!-- ANCHOR:active-risks -->',
.opencode/skills/deep-review/scripts/reduce-state.cjs:1653:    '<!-- /ANCHOR:active-risks -->',
.opencode/skills/sk-git/changelog/CHANGELOG.md:48:- Added missing opening `<!-- ANCHOR:when-to-use -->` marker
.opencode/skills/sk-git/changelog/CHANGELOG.md:50:- Removed table of contents from README.md (forbidden by sk-doc standards)
.opencode/skills/cli-gemini/manual_testing_playbook/03--built-in-tools/004-file-reference-syntax.md:52:If you want extra confidence the `@` resolution actually loaded the file (not just that the model knows the answer), repeat with a second prompt asking Gemini to quote a specific anchor comment such as `<!-- ANCHOR:related-resources -->`. That anchor is too specific to surface without reading the file.
.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-review.md:73:| `.opencode/skills/deep-review/README.md` | User-facing examples, use `ANCHOR:quick-start` |
.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-review.md:74:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Cheat-sheet command contract, use `ANCHOR:commands` |
.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/auto-mode-deep-review-kickoff.md:73:| `.opencode/skills/deep-review/README.md` | User-facing examples, use `ANCHOR:quick-start` and `ANCHOR:configuration` |
.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/auto-mode-deep-review-kickoff.md:74:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Cheat-sheet command contract, use `ANCHOR:commands` and `ANCHOR:state-files` |
.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/parameterized-invocation-max-iterations-convergence.md:73:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Parameter defaults table, use `ANCHOR:commands` |
.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/parameterized-invocation-max-iterations-convergence.md:77:| `.opencode/skills/deep-review/SKILL.md` | Skill-level parameter documentation, use `ANCHOR:how-it-works` |
.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/resume-classification-from-valid-prior-review-state.md:75:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Resume behavior documentation, use `ANCHOR:troubleshooting` |
.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/resume-classification-from-valid-prior-review-state.md:76:| `.opencode/skills/deep-review/SKILL.md` | Phase detection guidance, use `ANCHOR:smart-routing` |
.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/scope-discovery-and-dimension-ordering.md:75:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Dimension table, use `ANCHOR:review-dimensions` |
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:419:Prompt summary: As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called Demo Skill. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file with emoji-prefixed H2 sections and no table of contents.
.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:421:Expected signals: Exit 0. Write tool.call for the README path. README file exists with >= 3 emoji-prefixed H2 headers and no TOC.
.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/invalid-or-contradictory-review-state-halts-for-repair.md:75:| `.opencode/skills/deep-review/SKILL.md` | Phase detection guidance, use `ANCHOR:smart-routing` |
.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/fresh-review-initialization-creates-canonical-state-files.md:77:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | State files table, use `ANCHOR:state-files` |
.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md:78:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Troubleshooting and state files, use `ANCHOR:state-files` and `ANCHOR:troubleshooting` |
.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md:79:| `.opencode/skills/deep-review/SKILL.md` | Rules for state reading, use `ANCHOR:rules` Rule 1 |
.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/malformed-jsonl-lines-are-skipped-with-defaults.md:79:| `.opencode/skills/deep-review/SKILL.md` | Rules for state reading, use `ANCHOR:rules` Rule 1 |
.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/pause-sentinel-halts-between-review-iterations.md:77:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | State files showing pause sentinel location, use `ANCHOR:state-files` |
.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/pause-sentinel-halts-between-review-iterations.md:78:| `.opencode/skills/deep-review/SKILL.md` | Rule-level context, use `ANCHOR:rules` |
.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/jsonl-reconstruction-from-review-iteration-files.md:77:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | State file listing showing iterations/ directory, use `ANCHOR:state-files` |
.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/jsonl-reconstruction-from-review-iteration-files.md:78:| `.opencode/skills/deep-review/SKILL.md` | Rules for externalized state, use `ANCHOR:rules` Rule 3 |
.opencode/skills/deep-review/changelog/v1.9.0.0.md:43:The root playbook claimed 32 scenarios across 6 categories but actually carried 45 files across 8 categories. The two stress-test categories (command-flow stress tests CP-052 through CP-057 and the review-depth v2 rollout DRV-058 through DRV-063) had no body sections and were not listed in the index. The rewrite adds section 15 and section 16 with per-scenario summaries, updates the table of contents and the section 14 index, and corrects the overview count. Filename collisions in the convergence-and-recovery directory (where files 015 and 021 through 023 collided with files in sibling directories under the same numbers but mapping to different DRV IDs) were renamed to match their DRV IDs (030, 032 through 034). Fourteen cross-references in other files that pointed to the old filenames were patched in the same commit.
.opencode/skills/deep-review/changelog/v1.9.0.0.md:95:| `.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md` | Section 15 and Section 16 added with TOC + Section 14 index updates, overview count corrected (32 to 45) |
.opencode/skills/sk-code/assets/opencode/recipes/spec_folder_write.md:52:Verification gate: run `rg -n "ANCHOR:" <folder>` and confirm each doc has the full anchor count.
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/stop-on-max-iterations.md:76:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | User-facing parameter defaults, use `ANCHOR:commands` and `ANCHOR:convergence` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/stop-on-max-iterations.md:77:| `.opencode/skills/deep-review/SKILL.md` | Skill rules and convergence documentation, use `ANCHOR:rules` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/review-quality-guards-block-premature-stop.md:78:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Quality guard summary, use `ANCHOR:quality-guards` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/review-quality-guards-block-premature-stop.md:79:| `.opencode/skills/deep-review/SKILL.md` | Quality guard rules, use `ANCHOR:rules` Rule 12 |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/p0-override-blocks-convergence.md:76:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | P0 override note, use `ANCHOR:convergence` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/p0-override-blocks-convergence.md:77:| `.opencode/skills/deep-review/SKILL.md` | Severity classification and P0 blocking rules, use `ANCHOR:how-it-works` and `ANCHOR:rules` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:29:- Then: `deep-review-findings-registry.json` exposes `blockedStopHistory` entries that preserve the review gate names, `deep-review-dashboard.md` renders `BLOCKED STOPS`, and the `ANCHOR:next-focus` block in `deep-review-strategy.md` contains the blocked-stop recovery strategy.
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:55:4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/review/deep-review-strategy.md`
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:58:`blockedStopHistory` contains reducer-promoted blocked-stop entries with the review gate names. `BLOCKED STOPS` renders each blocked-stop event. `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record.
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:83:| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation, promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/fail-closed-reducer.md:58:7. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {anchor_fixture}/review/deep-review-strategy.md`
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/dimension-coverage-convergence-signal.md:76:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Convergence signal table, use `ANCHOR:convergence` and `ANCHOR:review-dimensions` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/dimension-coverage-convergence-signal.md:77:| `.opencode/skills/deep-review/SKILL.md` | Review dimensions and convergence rules, use `ANCHOR:how-it-works` and `ANCHOR:rules` |
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:123: * `<!-- ANCHOR: name -->` and `<!-- /ANCHOR: name -->`, then verifies that
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:140:  // Match opening anchors: <!-- ANCHOR: name -->
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:141:  const openPattern = /<!--\s*ANCHOR:\s*([\w-]+)\s*-->/g;
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:142:  // Match closing anchors: <!-- /ANCHOR: name -->
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:143:  const closePattern = /<!--\s*\/ANCHOR:\s*([\w-]+)\s*-->/g;
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:520: * Appends <!-- /ANCHOR: name --> at the end of content for unclosed anchors.
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:523:  const openPattern = /<!--\s*ANCHOR:\s*([\w-]+)\s*-->/g;
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:524:  const closePattern = /<!--\s*\/ANCHOR:\s*([\w-]+)\s*-->/g;
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:562:    result += `\n<!-- /ANCHOR: ${name} -->`;
.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/review-report-synthesis-has-all-9-sections.md:73:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Canonical 9-section table, use `ANCHOR:review-report-sections` |
.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/review-report-synthesis-has-all-9-sections.md:77:| `.opencode/skills/deep-review/SKILL.md` | Review report structure and verdict rules, use `ANCHOR:how-it-works` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/composite-review-convergence-stop-behavior.md:73:| `.opencode/skills/deep-review/references/convergence/convergence.md` | Canonical convergence math, use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/composite-review-convergence-stop-behavior.md:76:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Convergence signal summary, use `ANCHOR:convergence` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/composite-review-convergence-stop-behavior.md:77:| `.opencode/skills/deep-review/SKILL.md` | Convergence and rules documentation, use `ANCHOR:rules` and `ANCHOR:how-it-works` |
.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/finding-deduplication-and-registry.md:73:| `.opencode/skills/deep-review/SKILL.md` | Deduplication rules, severity classification, and synthesis contract, use `ANCHOR:how-it-works` and `ANCHOR:rules` |
.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/finding-deduplication-and-registry.md:78:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Active Finding Registry section definition, use `ANCHOR:review-report-sections` |
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:969:              filteredParts.push(`<!-- ANCHOR:${matchingKey} -->\n${extracted[matchingKey]}\n<!-- /ANCHOR:${matchingKey} -->`);
.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/review-verdict-determines-post-review-workflow.md:73:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Canonical verdict table, use `ANCHOR:verdicts` |
.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/review-verdict-determines-post-review-workflow.md:77:| `.opencode/skills/deep-review/SKILL.md` | Verdict definitions and severity classification, use `ANCHOR:how-it-works` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/stuck-recovery-widens-dimension-focus.md:76:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Convergence parameters including stuckThreshold, use `ANCHOR:convergence` |
.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/stuck-recovery-widens-dimension-focus.md:77:| `.opencode/skills/deep-review/SKILL.md` | Rules for dimension focus and exhausted approaches, use `ANCHOR:rules` |
.opencode/skills/system-spec-kit/SKILL.md:455:19. **Enforce ToC policy from validation rules** - Only `research/research.md` may include a Table of Contents section; remove ToC headings from standard spec artifacts
.opencode/skills/system-spec-kit/SKILL.md:468:9. **Add ToC sections to standard spec artifacts** - `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`, and `resource-map.md` must not contain ToC headings
.opencode/skills/sk-code/assets/opencode/checklists/spec_folder_authoring.md:41:- [ ] grep verification: `rg -n "ANCHOR:metadata|ANCHOR:summary|ANCHOR:notation|_memory:|packet_pointer" <path>`.
.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:74:| `.opencode/skills/deep-review/SKILL.md` | Memory save rule (Rule 8), read-only rule (Rule 9), LEAF-only rule (NEVER 1), use `ANCHOR:rules` |
.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:144:- Local dropdown anchor: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`
.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:145:- Local slider anchor: `a_nobel_en_zn/2_javascript/slider/testimonial.js`
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1476:        likely_phase_anchor: likelyPhaseAnchor,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1695:              targetAnchor: targetAnchorId,
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/strategy-next-focus-and-dimension-rotation.md:75:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Convergence signals, use `ANCHOR:convergence` and `ANCHOR:review-dimensions` |
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/cross-reference-verification-detects-misalignment.md:75:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Quality guards, use `ANCHOR:quality-guards` and `ANCHOR:review-dimensions` |
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/review-iteration-writes-findings-jsonl-and-strategy-update.md:75:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Iteration checklist, use `ANCHOR:agent-iteration-checklist` |
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:19:      likely_phase_anchor: 'phase-2',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:48:      targetAnchor: 'what-built',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:61:      likely_phase_anchor: 'phase-2',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:72:      likely_phase_anchor: 'phase-3',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:99:        target_anchor: 'what-built',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:108:        target_anchor: 'next-safe-action',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:133:      metadata: { phase_anchor: 'phase-3' },
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:139:        likely_phase_anchor: 'phase-1',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:153:        likely_phase_anchor: 'phase-2',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:161:        likely_phase_anchor: 'phase-3',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:171:      likely_phase_anchor: 'phase-2',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:176:      likely_phase_anchor: 'phase-3',
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/review-iteration-reads-state-before-review.md:75:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Iteration checklist, use `ANCHOR:agent-iteration-checklist` |
.opencode/skills/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:85:  '<!-- ANCHOR:smart-routing -->',
.opencode/skills/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:104:  '<!-- /ANCHOR:smart-routing -->',
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/review-dashboard-generation-after-iteration.md:76:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | State files table, use `ANCHOR:state-files` |
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/severity-classification-in-jsonl.md:73:| `.opencode/skills/deep-review/SKILL.md` | Rule 11: severity counts mandate, use `ANCHOR:rules` |
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/severity-classification-in-jsonl.md:76:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Convergence signals, use `ANCHOR:convergence` |
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/adversarial-self-check-runs-on-p0-findings.md:73:| `.opencode/skills/deep-review/SKILL.md` | Rule 10: adversarial self-check mandate, use `ANCHOR:rules` |
.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/adversarial-self-check-runs-on-p0-findings.md:74:| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Iteration checklist, use `ANCHOR:agent-iteration-checklist` |
.opencode/skills/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:34:      likely_phase_anchor: 'phase-2',
.opencode/skills/sk-code/references/motion_dev/integration_patterns.md:51:Local anchor: `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` destructures `animate` from `window.Motion || {}` and exits with a warning if it is unavailable.
.opencode/skills/sk-code/references/motion_dev/integration_patterns.md:65:Local anchor: `a_nobel_en_zn/2_javascript/slider/testimonial.js` uses a dynamic import from a pinned CDN ESM URL as a Webflow-friendly fallback, then patches `window.Motion` with `animate`, `inView`, `scroll`, and `motionValue`.
.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md:122:- Local scroll-linked/video anchor: `a_nobel_en_zn/2_javascript/hero/hero_video_scroll.js`
.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md:123:- Local hover/video anchor: `a_nobel_en_zn/2_javascript/video/video_hls_background_play_on_hover.js`
.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:100:    "aliases": ["TOC"],
.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:101:    "script_path": "rules/check-toc-policy.sh",
.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md:603:Expected signals: Generated file exists at `/tmp/cli-codex-playbook-cx021/server.ts`. File contains imports, error handling, comments and a `/healthz` endpoint. Operator records the template's anchor (e.g., `<!-- ANCHOR:code_generation -->` from `prompt_templates.md`). `codex exec` exits 0.
.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:521:      anchor: memory.anchor_id || memory.anchorId,
.opencode/skills/cli-codex/manual_testing_playbook/07--prompt-templates/001-prompt-templates-inventory.md:30:- Expected signals: Generated file exists at `/tmp/cli-codex-playbook-cx021/server.ts`. File contains imports, error handling, comments and a `/healthz` endpoint. Operator records the template's anchor (e.g., `<!-- ANCHOR:code_generation -->` from `prompt_templates.md`). `codex exec` exits 0.
.opencode/skills/cli-codex/manual_testing_playbook/07--prompt-templates/001-prompt-templates-inventory.md:48:| CX-021 | Use prompt_templates.md inventory | Verify a documented template is copy-paste ready and produces a working file | `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator picking a documented template, copy the "Single-File Application" template from assets/prompt_templates.md §2, fill placeholders for a tiny TypeScript health-check HTTP server, and dispatch the resulting prompt verbatim with --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast" against /tmp/cli-codex-playbook-cx021/. Verify Codex exits 0, the generated file matches the template requirements (single complete file, all imports, error handling, comments, /healthz endpoint), and the operator can identify the template line from prompt_templates.md that was used. Return a verdict naming the template anchor (e.g., "§2 Single-File Application") and confirming the generated file works.` | 1. `bash: grep -A 10 "Single-File Application" .opencode/skills/cli-codex/assets/prompt_templates.md > /tmp/cli-codex-cx021-template.txt && grep -nE "<!-- ANCHOR:" .opencode/skills/cli-codex/assets/prompt_templates.md \| head -5 > /tmp/cli-codex-cx021-anchors.txt` -> 2. `bash: rm -rf /tmp/cli-codex-playbook-cx021 && mkdir -p /tmp/cli-codex-playbook-cx021` -> 3. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Create a health-check HTTP server application in TypeScript. Requirements: Express framework, /healthz endpoint that returns {status: 'ok'}, error middleware, minimal request logging, written to /tmp/cli-codex-playbook-cx021/server.ts. Output a single complete file with all imports, error handling, and comments. Start immediately." > /tmp/cli-codex-cx021-stdout.txt 2>&1` -> 4. `bash: ls /tmp/cli-codex-playbook-cx021/server.ts && grep -E "import\|express\|/healthz\|try\|catch\|//" /tmp/cli-codex-playbook-cx021/server.ts > /tmp/cli-codex-cx021-checks.txt` -> 5. `bash: printf 'TEMPLATE ANCHOR: assets/prompt_templates.md §2 Single-File Application (<!-- ANCHOR:code_generation -->)\n' > /tmp/cli-codex-cx021-anchor-evidence.txt` | Step 1: template snippet captured AND anchor list shows `<!-- ANCHOR:code_generation -->`; Step 2: temp dir empty; Step 3: exit 0; Step 4: server.ts exists with imports, express reference, `/healthz` endpoint, try/catch error handling, and at least one `//` comment; Step 5: anchor evidence recorded | Template snippet, anchor list, captured stdout, generated server.ts, checks file, anchor evidence file, dispatched command line, exit code | PASS if Steps 1-5 all succeed, server.ts has all required template elements, AND the anchor evidence is recorded; FAIL if exit non-zero, file missing any required element, or anchor cannot be identified | (1) Re-read `assets/prompt_templates.md` §2 if the template snippet capture is empty; (2) re-run with `2>&1 \| tee` for stderr inline; (3) compile with `npx tsc --noEmit /tmp/cli-codex-playbook-cx021/server.ts` if syntax issues are suspected |
.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts:240:  { pattern: /^(to promote a memory|epistemic state captured at session start|table of contents)\b/i, label: 'template instructional heading' },
.opencode/skills/system-spec-kit/scripts/lib/anchor-generator.ts:170:  const anchorPattern = /<!--\s*ANCHOR:\s*([a-z0-9-]+)\s*-->/gi;
.opencode/skills/system-spec-kit/scripts/lib/anchor-generator.ts:181:    if (/<!--\s*ANCHOR:/i.test(lines[i])) return true;
.opencode/skills/system-spec-kit/scripts/lib/anchor-generator.ts:250:      result.push(`<!-- ANCHOR:${anchorId} -->`);
.opencode/skills/system-spec-kit/scripts/lib/anchor-generator.ts:258:      result.push(`<!-- /ANCHOR:${anchorId} -->`);
.opencode/skills/sk-code/assets/webflow/integrations/lenis_patterns.js:15: * - Table of contents: scroll to anchor with offset
.opencode/skills/sk-code/assets/webflow/integrations/lenis_patterns.js:248: * From table_of_content.js - TOC highlighting with Lenis coordination:
.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:165:  return [...stripFences(content).matchAll(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/gu)].map((match) => match[1]);
.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:237:      const openCount = (stripFences(actual).match(/<!--\s*ANCHOR:/gu) ?? []).length;
.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:238:      const closeCount = (stripFences(actual).match(/<!--\s*\/ANCHOR:/gu) ?? []).length;
.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:516:    const openMatch = line.match(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/);
.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:517:    const closeMatch = line.match(/<!--\s*\/ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/);
.opencode/skills/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:360:    anchor: params.anchor,
.opencode/skills/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:420:      anchor: params.anchor,
.opencode/skills/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:806:    anchor: params.anchors?.[0] ?? null,
.opencode/skills/sk-code/references/webflow/implementation/third_party_integrations.md:200:- Table of Contents smooth scrolling: `src/javascript/cms/table_of_content.js:363`
.opencode/skills/system-spec-kit/mcp_server/lib/validation/preflight.ts:368:      const errorMsg = `Anchor "${anchorId}" is missing closing tag <!-- /ANCHOR:${anchorId} -->`;
.opencode/skills/system-spec-kit/mcp_server/lib/validation/preflight.ts:373:        suggestion: `Add closing tag: <!-- /ANCHOR:${anchorId} --> after the anchor content`,
.opencode/skills/system-spec-kit/scripts/scripts-registry.json:380:      "name": "check-toc-policy",
.opencode/skills/system-spec-kit/scripts/scripts-registry.json:381:      "path": "scripts/rules/check-toc-policy.sh",
.opencode/skills/system-spec-kit/scripts/scripts-registry.json:383:      "description": "TOC_POLICY rule - allows ToC only in research/research.md and rejects ToC in standard spec artifacts",
.opencode/skills/sk-code/references/webflow/implementation/observer_patterns.md:144:- Scroll-based active states (Table of Contents, navigation highlighting)
.opencode/skills/sk-code/references/webflow/implementation/observer_patterns.md:626:When observing multiple elements (e.g., TOC sections), collect unobserve functions:
.opencode/skills/system-spec-kit/scripts/core/memory-metadata.ts:376:  const matches = content.matchAll(/<!--\s*(?:\/)?ANCHOR:\s*([a-zA-Z0-9][a-zA-Z0-9-]*)\s*-->/g);
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:47: *   <!-- ANCHOR: state -->
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:48: *   <!-- /ANCHOR: state -->
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:49: *   <!-- ANCHOR:next-steps -->
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:53:  return content.replace(/<!--\s*\/?ANCHOR:[^>]*-->/gi, '');
.opencode/skills/system-spec-kit/scripts/core/content-cleaner.ts:12:export const WORKFLOW_HTML_COMMENT_RE = /<!--(?!\s*\/?ANCHOR:)[\s\S]*?-->/g;
.opencode/skills/system-spec-kit/scripts/core/content-cleaner.ts:56:  return input.replace(/<!--\s*(\/?ANCHOR:[^>]+?)\s*-->/g, (_match: string, anchor: string) => (
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:745:  const overviewSection = body.match(/##\s+\d+\.\s+OVERVIEW([\s\S]*?)(?:\n##\s+|\n<!--\s*\/ANCHOR:(?:summary|overview)\s*-->|$)/i);
.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:1052:    warnings.push(`Anchor "${anchorId}" is missing closing tag <!-- /ANCHOR:${anchorId} --> - anchor-based content extraction will fail`);
.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts:310:    if (/^<!--\s*\/ANCHOR:/i.test(line.trim())) {
.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts:330:    /<!-- ANCHOR:([a-z0-9-]+) -->\s*\n(?:<a id="([^"]+)"><\/a>\s*\n)?(?:\s*\n)?##\s+(?:\d+\.\s+)?OVERVIEW[\s\S]*?<!-- \/ANCHOR:([a-z0-9-]+) -->/i,
.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts:828:    const redundantSectionIdentityMatches = fileContent.match(/<!-- ANCHOR:[a-z0-9-]+ -->\s*\n<a id="[^"]+"><\/a>\s*\n(?:\s*\n)?##/gi) ?? [];
.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts:996:    // CHECK-D8: overview TOC / comment anchor consistency.
.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts:1013:        message: `OVERVIEW anchor mismatch (toc=${anchorState.tocTarget ?? 'missing'}, comment=${anchorState.comment ?? 'missing'}, closing=${anchorState.closingComment ?? 'missing'})`,
.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts:1014:        fix: 'Keep the OVERVIEW TOC target and comment anchors aligned on "overview"',
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:592:      'Use format: <!-- ANCHOR: anchor_name -->',
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:594:      'End sections with <!-- /ANCHOR: anchor_name -->'
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:21:    `<!-- ANCHOR:${anchorId} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:23:    `<!-- /ANCHOR:${anchorId} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:76:      expect(result.updatedDocument).toContain('<!-- ANCHOR:verification -->\nUnrelated verification text.\n<!-- /ANCHOR:verification -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:105:        'what-built': 'Existing summary.\n<!-- ANCHOR:nested -->\nBad state.\n<!-- /ANCHOR:nested -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:123:          '<!-- ANCHOR:adr-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:126:          '<!-- ANCHOR:adr-001-context -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:130:          '<!-- /ANCHOR:adr-001-context -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:132:          '<!-- ANCHOR:adr-001-decision -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:136:          '<!-- /ANCHOR:adr-001-decision -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:138:          '<!-- ANCHOR:adr-001-consequences -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:142:          '<!-- /ANCHOR:adr-001-consequences -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:143:          '<!-- /ANCHOR:adr-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:165:      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002 -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:167:      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-context -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:168:      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-decision -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:169:      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-consequences -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:170:      expect(result.updatedDocument.trimEnd().endsWith('<!-- keep trailing comment -->\n<!-- /ANCHOR:decisions -->')).toBe(true);
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:176:          '<!-- ANCHOR:adr-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:179:          '<!-- ANCHOR:adr-001-context -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:183:          '<!-- /ANCHOR:adr-001-context -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:185:          '<!-- ANCHOR:adr-001-decision -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:189:          '<!-- /ANCHOR:adr-001-decision -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:191:          '<!-- ANCHOR:adr-001-consequences -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:195:          '<!-- /ANCHOR:adr-001-consequences -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:196:          '<!-- /ANCHOR:adr-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:226:        '<!-- ANCHOR:adr-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:229:        '<!-- ANCHOR:adr-001-context -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:233:        '<!-- /ANCHOR:adr-001-context -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:235:        '<!-- ANCHOR:adr-001-decision -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:239:        '<!-- /ANCHOR:adr-001-decision -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:241:        '<!-- ANCHOR:adr-001-consequences -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:245:        '<!-- /ANCHOR:adr-001-consequences -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:246:        '<!-- /ANCHOR:adr-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:265:      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002 -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:267:      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-decision -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:499:      expect(result.updatedDocument.trimEnd().endsWith('<!-- trailing research comment -->\n<!-- /ANCHOR:findings -->')).toBe(true);
.opencode/skills/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:262:        "label": "table of contents wrapper",
.opencode/skills/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:266:        "chunk": "Table of contents continue session, project state snapshot, overview, detailed changes, decisions, conversation, recovery hints, memory metadata. The chunk exists only to help a human scan a long legacy memory file and carries almost no semantic retrieval value by itself."
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:156:  likely_phase_anchor: string | null;
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:191:  target_anchor: string;
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:218:  target_anchor: string;
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:239:  targetAnchor: string;
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:295:  target_anchor: string;
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:421:      /recovery scenarios|diagnostic commands|table of contents|placeholder|auto-truncated/.test(normalized),
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:435:const HARD_DROP_WRAPPER_CUES = /\b(conversation transcript|generic recovery hints|tool telemetry|table of contents|raw tool|repository state|assistant:|user:|tool:|recovery scenarios|diagnostic commands)\b/u;
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:826:      targetAnchor: validated.target_anchor,
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:844:    target_anchor: entry.targetAnchor,
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:886:    target_anchor: fallbackTarget?.anchorId ?? (typeof raw.target_anchor === 'string' ? raw.target_anchor : ''),
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:922:      target_anchor: target.anchorId,
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1070:  if (/\brecovery scenarios|diagnostic commands|table of contents\b/.test(normalizedText)) {
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1082:  likelyPhaseAnchor: string | null,
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1167:    likely_phase_anchor: context.sessionMeta?.likely_phase_anchor ?? inferLikelyPhaseAnchor(context.existingAnchors),
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1176:    likely_phase_anchor: resolveLikelyPhaseAnchor(chunk, context, normalizedContext),
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1329:    `LIKELY_PHASE_ANCHOR: ${input.context.likely_phase_anchor ?? 'null'}`,
.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:1371:    target_anchor: decision.target.anchorId,
.opencode/skills/deep-loop-runtime/changelog/v1.0.0.0.md:58:| `.opencode/skills/deep-loop-runtime/README.md` | Authored with YAML frontmatter, TOC, OVERVIEW, QUICK START, FEATURES, STRUCTURE, INTEGRATION POINTS, RELATED DOCUMENTS sections per sk-doc README template. |
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:3:# RULE: CHECK-TOC-POLICY
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:11:# Description: Enforces that Table of Contents sections appear only in research/research.md.
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:37:    local toc_heading_pattern='^[[:space:]]*#{1,6}[[:space:]]*([0-9]+[.)][[:space:]]+)?(table of contents|toc)[[:space:]]*$'
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:49:            violations+=("$doc_name: TOC heading found at line $first_line")
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:55:        RULE_MESSAGE="No TOC-restricted spec documents found (skipped)"
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:61:        RULE_MESSAGE="TOC sections are not allowed in ${#violations[@]} non-research spec file(s)"
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:63:        RULE_REMEDIATION="Remove '## TABLE OF CONTENTS' / '## TOC' sections from spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, and debug-delegation.md. Only research/research.md may include a TOC."
.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh:66:        RULE_MESSAGE="TOC policy passed: no TOC headings in non-research spec documents"
.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md:1308:   - url: "https://example.com/page-with-toc"
.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md:1353:| TOC highlight jumps | Wrong section highlighted after click | Instant feedback before IO catches up |
.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md:1443:HYPOTHESIS: ToC scroll position is off by 90px because Lenis's built-in
.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md:1740:    anchor: anchorSelector,
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:97:            anchor_count=$(strip_fenced_blocks "$doc_path" | grep -c '<!-- ANCHOR:' 2>/dev/null || echo "0")
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:122:            if ! printf '%s\n' "$line_text" | grep -Eq '<!--[[:space:]]*ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->'; then
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:125:        done < <(strip_fenced_blocks "$file" | grep -n '<!--[[:space:]]*ANCHOR:' 2>/dev/null || true)
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:130:            if ! printf '%s\n' "$line_text" | grep -Eq '<!--[[:space:]]*/ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->'; then
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:133:        done < <(strip_fenced_blocks "$file" | grep -n '<!--[[:space:]]*/ANCHOR:' 2>/dev/null || true)
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:135:        # Extract opening anchors: <!-- ANCHOR:id --> format: "linenum id"
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:136:        { strip_fenced_blocks "$file" | grep -nE '<!--[[:space:]]*ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->' 2>/dev/null || true; } | \
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:137:            sed -nE 's/^([0-9]+):.*ANCHOR:[[:space:]]*([A-Za-z0-9][A-Za-z0-9_-]*).*/\1 \2/p' > "$tmp_opens"
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:139:        # Extract closing anchors: <!-- /ANCHOR:id -->
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:140:        { strip_fenced_blocks "$file" | grep -nE '<!--[[:space:]]*/ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->' 2>/dev/null || true; } | \
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:141:            sed -nE 's/^([0-9]+):.*\/ANCHOR:[[:space:]]*([A-Za-z0-9][A-Za-z0-9_-]*).*/\1 \2/p' > "$tmp_closes"
.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:274:2. Ensure each <!-- ANCHOR:id --> has matching <!-- /ANCHOR:id -->
.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:482:- [ ] Main playbook has frontmatter and H1 intro (no Table of Contents)
.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:29:            && grep -q "<!-- ANCHOR:phase-map -->" "$folder/spec.md" 2>/dev/null \
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:44:<!-- ANCHOR: overview -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:48:<!-- /ANCHOR: overview -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:50:<!-- ANCHOR: decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:56:<!-- /ANCHOR: decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:58:<!-- ANCHOR: next-steps -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:63:<!-- /ANCHOR: next-steps -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:82:<!-- ANCHOR: overview -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:87:<!-- ANCHOR: details -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:90:<!-- /ANCHOR: details -->
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:138:    const content = '<!-- ANCHOR: test -->\ncontent\n<!-- /ANCHOR: test -->';
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:152:    const content = '<!-- ANCHOR: overview -->\ncontent here';
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:159:    const content = 'content here\n<!-- /ANCHOR: orphan -->';
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:167:      '<!-- ANCHOR: good -->',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:169:      '<!-- /ANCHOR: good -->',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:170:      '<!-- ANCHOR: broken -->',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:326:    const content = '<!-- ANCHOR: test -->\ncontent';
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:328:    expect(fixed).toContain('<!-- /ANCHOR: test -->');
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:332:    const content = '<!-- ANCHOR: test -->\ncontent\n<!-- /ANCHOR: test -->';
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:338:    const content = '<!-- ANCHOR: a -->\ncontent\n<!-- ANCHOR: b -->\nmore';
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:340:    expect(fixed).toContain('<!-- /ANCHOR: a -->');
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:341:    expect(fixed).toContain('<!-- /ANCHOR: b -->');
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:346:      '<!-- ANCHOR: repeated -->',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:348:      '<!-- ANCHOR: repeated -->',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:350:      '<!-- /ANCHOR: repeated -->',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:353:    const closingCount = fixed.match(/<!--\s*\/ANCHOR:\s*repeated\s*-->/g)?.length ?? 0;
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:406:    const content = '<!-- ANCHOR: test -->\nSome content';
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:410:    expect(result.content).toContain('<!-- /ANCHOR: test -->');
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:561:      '<!-- ANCHOR: broken -->',
.opencode/skills/sk-doc/assets/readme/readme_template.md:293:- [ ] Optional anchors wrap only stable sections.
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:217:- Use numbered all-caps H2 section headers in the root catalog. Do not add a Table of Contents.
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:229:- [ ] Root catalog uses numbered all-caps H2 section headers (no Table of Contents)
.opencode/skills/deep-research/scripts/reduce-state.cjs:700:  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
.opencode/skills/deep-research/scripts/reduce-state.cjs:702:    `<!-- ANCHOR:${anchorId} -->`,
.opencode/skills/deep-research/scripts/reduce-state.cjs:706:    `<!-- /ANCHOR:${anchorId} -->`,
.opencode/skills/deep-research/scripts/reduce-state.cjs:785:    '<!-- ANCHOR:overview -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:790:    '<!-- /ANCHOR:overview -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:791:    '<!-- ANCHOR:status -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:804:    '<!-- /ANCHOR:status -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:805:    '<!-- ANCHOR:progress -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:817:    '<!-- /ANCHOR:progress -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:818:    '<!-- ANCHOR:questions -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:824:    '<!-- /ANCHOR:questions -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:825:    '<!-- ANCHOR:uncovered-questions -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:832:    '<!-- /ANCHOR:uncovered-questions -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:833:    '<!-- ANCHOR:trend -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:841:    '<!-- /ANCHOR:trend -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:842:    '<!-- ANCHOR:dead-ends -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:848:    '<!-- /ANCHOR:dead-ends -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:849:    '<!-- ANCHOR:next-focus -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:853:    '<!-- /ANCHOR:next-focus -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:854:    '<!-- ANCHOR:active-risks -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:860:    '<!-- /ANCHOR:active-risks -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:861:    '<!-- ANCHOR:blocked-stops -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:872:    '<!-- /ANCHOR:blocked-stops -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:873:    '<!-- ANCHOR:graph-convergence -->',
.opencode/skills/deep-research/scripts/reduce-state.cjs:881:    '<!-- /ANCHOR:graph-convergence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:83:      sourceAnchor: 'tasks#child-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:84:      targetAnchor: 'decision-record#decision-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:91:      sourceAnchor: 'decision-record#decision-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:92:      targetAnchor: 'implementation-summary#summary-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:99:      sourceAnchor: 'spec#spec-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:100:      targetAnchor: 'plan#plan-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:107:      sourceAnchor: 'plan#plan-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:108:      targetAnchor: 'checklist#checklist-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:115:      sourceAnchor: 'checklist#checklist-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:116:      targetAnchor: 'research#research-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:123:      sourceAnchor: 'research#research-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:124:      targetAnchor: 'spec#spec-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:139:        sourceAnchor: edge.sourceAnchor,
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:140:        targetAnchor: edge.targetAnchor,
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:177:        source_anchor: 'tasks#child-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:178:        target_anchor: 'decision-record#decision-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:186:        source_anchor: 'decision-record#decision-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-causal-graph.vitest.ts:187:        target_anchor: 'implementation-summary#summary-anchor',
.opencode/skills/sk-doc/assets/template_rules.json:366:      "description": "Component changelog files at .opencode/changelog/{component}/v{VERSION}.md or .opencode/skills/<skill>/changelog/v{VERSION}.md. Files start directly with a summary paragraph; no TOC, no Overview section, no version header. Authoritative format reference: .opencode/skills/sk-doc/assets/changelog_template.md",
.opencode/skills/sk-doc/assets/template_rules.json:562:    "tocHeader": "## TABLE OF CONTENTS",
.opencode/skills/sk-doc/assets/template_rules.json:599:      "description": "Convert single-dash TOC anchors to double-dash",
.opencode/skills/sk-doc/assets/template_rules.json:609:      "description": "Convert TOC entry section name to ALL CAPS",
.opencode/skills/deep-research/manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-execution.md:75:| `.opencode/skills/deep-research/README.md` | User-facing execution modes; use `ANCHOR:features` |
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:259:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:262:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:266:<!-- ANCHOR:next-steps -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:268:<!-- /ANCHOR:next-steps -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:279:      const badContent = `<!-- ANCHOR:unclosed -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:288:      const overlappingContent = `<!-- ANCHOR:outer -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:290:<!-- ANCHOR:inner -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:292:<!-- /ANCHOR:outer -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:293:<!-- /ANCHOR:inner -->`;
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:301:      const malformedContent = `<!-- ANCHOR:outer -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:303:<!-- ANCHOR:inner -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:305:<!-- /ANCHOR:outer -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:307:<!-- ANCHOR:tail -->
.opencode/skills/deep-research/manual_testing_playbook/01--entry-points-and-modes/auto-mode-deep-research-kickoff.md:73:| `.opencode/skills/deep-research/README.md` | User-facing examples; use `ANCHOR:quick-start` and `ANCHOR:configuration` |
.opencode/skills/deep-research/manual_testing_playbook/01--entry-points-and-modes/auto-mode-deep-research-kickoff.md:74:| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Cheat-sheet command contract; use `ANCHOR:commands` and `ANCHOR:state-files` |
.opencode/skills/deep-research/manual_testing_playbook/01--entry-points-and-modes/parameterized-invocation-max-iterations-convergence.md:76:| `.opencode/skills/deep-research/references/state/state_format.md` | Config schema; use `ANCHOR:config-file` |
.opencode/skills/sk-doc/README.md:73:For README files, `validate_document.py` checks TOC format, anchor syntax, H2 emojis, and required sections. Exit 0 is required before delivery.
.opencode/skills/sk-doc/README.md:301:|# validate_document.py checks TOC anchors, H2 emojis, required sections
.opencode/skills/sk-doc/README.md:328:Common causes: TOC missing or using single-dash anchor format instead of double-dash (e.g., `#1-overview` instead of `#1--overview`), H2 headers missing emojis, required sections absent, or section numbering is non-sequential.
.opencode/skills/sk-doc/README.md:330:Fix: Read the error output line by line. The most common fix is correcting TOC anchor format to use double dashes. Check that every H2 has the correct emoji from the template, that sections are numbered 1, 2, 3 (not 1, 2.5, 3), and that no required section is absent. Re-run after each correction.
.opencode/skills/sk-doc/README.md:362:A: No. They serve different purposes. `validate_document.py` is a fast format validator for README files specifically. It checks TOC presence, anchor format, H2 emoji rules, and required section presence. It exits 0 or 1. `extract_structure.py` is the full DQI analysis tool. It parses any markdown document type, produces a JSON report with three component scores, a checklist with pass/fail/skip per item, detected violations, and quality band. Use `validate_document.py` as a pre-delivery gate for READMEs and `extract_structure.py` for broader quality analysis and iteration tracking.
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/research-charter-validation.md:48:2. `bash: sed -n '/ANCHOR:non-goals/,/\/ANCHOR:stop-conditions/p' .opencode/skills/deep-research/assets/deep_research_strategy.md`
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/research-charter-validation.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Loop protocol; inspect Step 5a (Validate Research Charter) under `ANCHOR:phase-initialization` |
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/research-charter-validation.md:74:| `.opencode/skills/deep-research/assets/deep_research_strategy.md` | Strategy template; inspect `ANCHOR:non-goals` (section 4) and `ANCHOR:stop-conditions` (section 5) |
.opencode/skills/sk-doc/references/readme_creation.md:188:**Table of Contents**: Do not add a Table of Contents. READMEs rely on their numbered H2 heading hierarchy for navigation; no TOC block and no `<!-- ANCHOR -->` navigation comments are used.
.opencode/skills/sk-doc/references/readme_creation.md:315:- [ ] No Table of Contents and no `<!-- ANCHOR -->` navigation comments
.opencode/skills/sk-doc/assets/skill/skill_asset_template.md:794:- TOC listing all templates
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/invalid-or-contradictory-state-halts-for-repair.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Invalid-state contract; use `ANCHOR:phase-initialization` |
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/invalid-or-contradictory-state-halts-for-repair.md:74:| `.opencode/skills/deep-research/SKILL.md` | Rule-level guardrails; use `ANCHOR:rules` |
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/invalid-or-contradictory-state-halts-for-repair.md:77:| `.opencode/skills/deep-research/README.md` | Troubleshooting boundary; use `ANCHOR:troubleshooting` |
.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/spec.md:72:| REQ-003 | Optional anchors from the template stay allowed | No extra-anchor warning is emitted |
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:36:      likely_phase_anchor: 'phase-2',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:179:      likely_phase_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:225:      target_anchor: 'how-delivered',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:271:      target_anchor: 'how-delivered',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:308:            targetAnchor: 'what-built',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:345:        target_anchor: 'manual-review',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:370:        target_anchor: 'findings',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:579:        likely_phase_anchor: 'phase-1',
.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts:611:      target_anchor: 'what-built',
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/fresh-initialization-creates-canonical-state-files.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Initialization lifecycle; use `ANCHOR:phase-initialization` |
.opencode/skills/sk-doc/references/global/hvr_rules.md:426:| **Structure** | 25% | Heading hierarchy, TOC format, section dividers, two-tier voice, subsection numbering |
.opencode/skills/sk-doc/references/global/hvr_rules.md:445:    - "TOC entries match H2 headings with correct anchors"
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:59:- ✅ No table of contents (forbidden in SKILL.md)
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1078:□ No table of contents (forbidden in SKILL.md)
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1128:| **TOC**               | Forbidden in SKILL.md      | ❌ No table of contents                                                                             |
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/resume-classification-from-valid-prior-state.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Resume contract; use `ANCHOR:phase-initialization` and `Auto-Resume Protocol` |
.opencode/skills/deep-research/manual_testing_playbook/02--initialization-and-state-setup/resume-classification-from-valid-prior-state.md:76:| `.opencode/skills/deep-research/README.md` | User-facing auto-resume claim; use `ANCHOR:features` and `ANCHOR:faq` |
.opencode/skills/sk-doc/references/global/quick_reference.md:18:# Checks: TOC, H2 format, anchors, required sections
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/malformed-jsonl-lines-are-skipped-with-defaults.md:73:| `.opencode/skills/deep-research/references/state/state_format.md` | Fault tolerance and event schema; use `ANCHOR:state-log` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/malformed-jsonl-lines-are-skipped-with-defaults.md:74:| `.opencode/skills/deep-research/references/convergence/convergence.md` | Defensive JSONL reading; use `ANCHOR:signal-definitions` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/malformed-jsonl-lines-are-skipped-with-defaults.md:75:| `.opencode/skills/deep-research/README.md` | Troubleshooting language; use `ANCHOR:troubleshooting` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/jsonl-reconstruction-from-iteration-files.md:73:| `.opencode/skills/deep-research/references/state/state_format.md` | Reconstruction algorithm and event schema; use `ANCHOR:state-log` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/jsonl-reconstruction-from-iteration-files.md:75:| `.opencode/skills/deep-research/README.md` | Troubleshooting and FAQ recovery language; use `ANCHOR:troubleshooting` and `ANCHOR:faq` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/jsonl-reconstruction-from-iteration-files.md:76:| `.opencode/skills/deep-research/references/convergence/convergence.md` | Valid-entry behavior during convergence; use `ANCHOR:signal-definitions` |
.opencode/skills/sk-doc/SKILL.md:407:3. Add a ToC outside README/research surfaces.
.opencode/skills/sk-doc/references/global/core_standards.md:69:| Type | Enforcement | Frontmatter | H1 Subtitle | TOC Policy | Blocks |
.opencode/skills/sk-doc/references/global/core_standards.md:79:**TOC Policy Summary**:
.opencode/skills/sk-doc/references/global/core_standards.md:80:- ❌ **NEVER** add a Table of Contents to any document type. Tables of Contents and `<!-- ANCHOR -->` navigation comments are not used in skill documentation.
.opencode/skills/sk-doc/references/global/core_standards.md:284:TOC: Never
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/pause-sentinel-halts-between-iterations.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Pause sentinel contract; use `ANCHOR:phase-iteration-loop` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/pause-sentinel-halts-between-iterations.md:76:| `.opencode/skills/deep-research/README.md` | User-facing pause FAQ; use `ANCHOR:faq` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/pause-sentinel-halts-between-iterations.md:77:| `.opencode/skills/deep-research/SKILL.md` | Rule-level context; use `ANCHOR:rules` |
.opencode/skills/sk-doc/references/global/validation.md:50:| Missing TOC section | blocking | No |
.opencode/skills/sk-doc/references/global/validation.md:51:| TOC anchor single-dash (should be `#1--`) | blocking | Yes |
.opencode/skills/sk-doc/references/global/validation.md:116:- ✅ `no_toc` - No table of contents section
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Pause-resume flow; use `ANCHOR:phase-iteration-loop` and `ANCHOR:phase-initialization` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md:74:| `.opencode/skills/deep-research/references/state/state_format.md` | Resumed event schema; use `ANCHOR:state-log` |
.opencode/skills/deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md:77:| `.opencode/skills/deep-research/README.md` | User-facing pause and resume language; use `ANCHOR:faq` |
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:148:${removeAnchors.includes('continue-session') ? '' : '<!-- ANCHOR:continue-session -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:154:${removeAnchors.includes('continue-session') ? '' : '<!-- /ANCHOR:continue-session -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:159:${removeAnchors.includes('canonical-docs') ? '' : '<!-- ANCHOR:canonical-docs -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:166:${removeAnchors.includes('canonical-docs') ? '' : '<!-- /ANCHOR:canonical-docs -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:179:${removeAnchors.includes('overview') ? '' : '<!-- ANCHOR:overview -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:185:${removeAnchors.includes('overview') ? '' : '<!-- /ANCHOR:overview -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:190:${removeAnchors.includes('evidence') ? '' : '<!-- ANCHOR:evidence -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:198:${removeAnchors.includes('evidence') ? '' : '<!-- /ANCHOR:evidence -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:221:${removeAnchors.includes('recovery-hints') ? '' : '<!-- ANCHOR:recovery-hints -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:228:${removeAnchors.includes('recovery-hints') ? '' : '<!-- /ANCHOR:recovery-hints -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:233:${removeAnchors.includes('metadata') ? '' : '<!-- ANCHOR:metadata -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:242:${removeAnchors.includes('metadata') ? '' : '<!-- /ANCHOR:metadata -->'}
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1157:      `<!-- ANCHOR:section-${i} -->`
.opencode/skills/sk-doc/scripts/extract_structure.py:673:    ('no_toc', 'No table of contents', lambda fm, h, c: not any('TABLE OF CONTENTS' in heading['text'].upper() or 'TOC' == heading['text'].upper() for heading in h)),
.opencode/skills/sk-doc/scripts/extract_structure.py:682:    ('has_toc', 'Has TABLE OF CONTENTS section', lambda fm, h, c: any('TABLE OF CONTENTS' in heading['text'].upper() or heading['text'].upper() == 'TOC' for heading in h)),
.opencode/skills/sk-doc/scripts/extract_structure.py:683:    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2 and 'TABLE OF CONTENTS' not in heading['text'].upper()) if any(heading['level'] == 2 for heading in h) else True),
.opencode/skills/sk-doc/scripts/tests/valid_install_guide.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/references/feature_catalog_creation.md:25:- no Table of Contents and no `<!-- ANCHOR -->` navigation comments
.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md:18:Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.
.opencode/skills/sk-doc/scripts/tests/test_validator.py:34:        "description": "Valid README with TOC and double-dash anchors"
.opencode/skills/sk-doc/scripts/tests/test_validator.py:48:        "description": "README without a TOC is valid (TOCs are no longer used in skill docs)"
.opencode/skills/sk-doc/scripts/tests/test_validator.py:55:        "description": "TOC anchor format is no longer validated (TOCs are not used; format check is moot)"
.opencode/skills/sk-doc/scripts/tests/valid_readme.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/valid_readme.md:17:- Has TABLE OF CONTENTS section
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:3:> README with single-dash TOC anchors (blocking error)
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:16:This README uses single-dash anchors in the TOC.
.opencode/skills/sk-doc/scripts/tests/missing_emojis.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/missing_toc.md:1:# Test README - Missing TOC
.opencode/skills/sk-doc/scripts/tests/missing_toc.md:3:> README missing TABLE OF CONTENTS section (blocking error)
.opencode/skills/sk-doc/scripts/tests/missing_toc.md:9:This README is missing the TABLE OF CONTENTS section.
.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:178:    `).get() as { id: number; source_anchor: string | null; target_anchor: string | null };
.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:187:      source_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:188:      target_anchor: null,
.opencode/skills/sk-doc/scripts/tests/README.md:15:<!-- ANCHOR:overview -->
.opencode/skills/sk-doc/scripts/tests/README.md:34:<!-- /ANCHOR:overview -->
.opencode/skills/sk-doc/scripts/tests/README.md:38:<!-- ANCHOR:quick-start -->
.opencode/skills/sk-doc/scripts/tests/README.md:57:<!-- /ANCHOR:quick-start -->
.opencode/skills/sk-doc/scripts/tests/README.md:61:<!-- ANCHOR:features -->
.opencode/skills/sk-doc/scripts/tests/README.md:70:<!-- /ANCHOR:features -->
.opencode/skills/sk-doc/scripts/tests/README.md:74:<!-- ANCHOR:structure -->
.opencode/skills/sk-doc/scripts/tests/README.md:85:<!-- /ANCHOR:structure -->
.opencode/skills/sk-doc/scripts/tests/README.md:89:<!-- ANCHOR:configuration -->
.opencode/skills/sk-doc/scripts/tests/README.md:97:<!-- /ANCHOR:configuration -->
.opencode/skills/sk-doc/scripts/tests/README.md:101:<!-- ANCHOR:usage-examples -->
.opencode/skills/sk-doc/scripts/tests/README.md:112:<!-- /ANCHOR:usage-examples -->
.opencode/skills/sk-doc/scripts/tests/README.md:116:<!-- ANCHOR:troubleshooting -->
.opencode/skills/sk-doc/scripts/tests/README.md:124:<!-- /ANCHOR:troubleshooting -->
.opencode/skills/sk-doc/scripts/tests/README.md:128:<!-- ANCHOR:related-documents -->
.opencode/skills/sk-doc/scripts/tests/README.md:137:<!-- /ANCHOR:related-documents -->
.opencode/skills/sk-doc/scripts/validate_document.py:10:consistent formatting with proper TOC, H2 emojis, and section structure.
.opencode/skills/sk-doc/scripts/validate_document.py:229:# 3. TOC VALIDATION
.opencode/skills/sk-doc/scripts/validate_document.py:233:    """Validate TABLE OF CONTENTS section."""
.opencode/skills/sk-doc/scripts/validate_document.py:240:    # Pattern: ## [optional emoji] TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/validate_document.py:242:        r'## (?:[^\w\s]\s+)?TABLE OF CONTENTS\s*\n(.*?)(?=\n---|\n## |\Z)',
.opencode/skills/sk-doc/scripts/validate_document.py:251:            'message': 'Missing TABLE OF CONTENTS section',
.opencode/skills/sk-doc/scripts/validate_document.py:252:            'fix_hint': 'Add "## TABLE OF CONTENTS" section with linked entries'
.opencode/skills/sk-doc/scripts/validate_document.py:269:                'message': f'TOC anchor uses single dash instead of double dash',
.opencode/skills/sk-doc/scripts/validate_document.py:296:                    'message': f'TOC entry not ALL CAPS: "{entry_text}"',
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stop-when-all-key-questions-are-answered.md:73:| `.opencode/skills/deep-research/references/convergence/convergence.md` | Question-coverage hard stop; use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stop-when-all-key-questions-are-answered.md:76:| `.opencode/skills/deep-research/README.md` | Question-coverage framing; use `ANCHOR:usage-examples` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stop-when-all-key-questions-are-answered.md:77:| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Coverage visualization; use `ANCHOR:progress-visualization` |
.opencode/skills/sk-doc/scripts/audit_readmes.py:532:    lines.append("### Batch A: Add missing TOC + Overview")
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:29:- Then: `findings-registry.json` exposes `blockedStopHistory` entries, `deep-research-dashboard.md` renders a `BLOCKED STOPS` section for each entry, and the `ANCHOR:next-focus` block in `deep-research-strategy.md` contains the blocked-stop recovery strategy.
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:55:4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/research/deep-research-strategy.md`
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:58:`blockedStopHistory` contains reducer-promoted blocked-stop entries; `BLOCKED STOPS` renders each blocked-stop event; `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record.
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/blocked-stop-reducer-surfacing.md:83:| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Canonical reducer implementation; promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
.opencode/skills/system-spec-kit/assets/template_mapping.md:251:- Every opening `<!-- ANCHOR:name -->` MUST have a closing `<!-- /ANCHOR:name -->`
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:124:function resolveSeedSource(args: ContextHandlerArgs, anchor: {
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:328:              const anchor: Record<string, unknown> = {
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/ruled-out-directions-in-synthesis.md:49:3. `bash: sed -n '/ANCHOR:ruled-out-directions/,/\/ANCHOR:ruled-out-directions/p' .opencode/skills/deep-research/assets/deep_research_strategy.md`
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/ruled-out-directions-in-synthesis.md:74:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Loop protocol; inspect `ANCHOR:phase-synthesis` for the Eliminated Alternatives consolidation rules (synthesis Step 3) |
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/ruled-out-directions-in-synthesis.md:75:| `.opencode/skills/deep-research/references/state/state_format.md` | State format; inspect `ruledOut` array under `ANCHOR:state-log` (Negative Knowledge subsection) and iteration file requirements under `ANCHOR:iteration-files` |
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/ruled-out-directions-in-synthesis.md:76:| `.opencode/skills/deep-research/assets/deep_research_strategy.md` | Strategy template; inspect `ANCHOR:ruled-out-directions` for section 10 (Ruled Out Directions) |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stop-on-max-iterations.md:73:| `.opencode/skills/deep-research/references/convergence/convergence.md` | Hard-stop ordering; use `ANCHOR:shouldcontinue-algorithm` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stop-on-max-iterations.md:74:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Loop decision order; use `ANCHOR:phase-iteration-loop` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stop-on-max-iterations.md:77:| `.opencode/skills/deep-research/README.md` | Parameter table and examples; use `ANCHOR:configuration` and `ANCHOR:usage-examples` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stop-on-max-iterations.md:78:| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Parameter defaults; use `ANCHOR:commands` |
.opencode/skills/deep-research/references/protocol/spec_check_protocol.md:129:The workflow writes or replaces exactly one machine-owned fence nested under the chosen host anchor:
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:74:| `.opencode/skills/deep-research/SKILL.md` | Supported save path and reference-only features; use `ANCHOR:rules` |
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:75:| `.opencode/skills/deep-research/README.md` | User-facing reference-only notes and FAQ; use `ANCHOR:overview`, `ANCHOR:faq`, and `ANCHOR:related-documents` |
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:77:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Reference-only wave, checkpoint, and direct-mode sections; use `ANCHOR:phase-iteration-loop` and `ANCHOR:wave-orchestration-protocol` |
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:78:| `.opencode/skills/deep-research/references/state/state_format.md` | Reference-only segment model and active events; use `ANCHOR:state-log` |
.opencode/skills/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md:81:| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Reference-only notes; use `Reference-Only Notes` under `ANCHOR:state-files` |
.opencode/skills/system-spec-kit/assets/level_decision_matrix.md:224:- Details: Each `<!-- ANCHOR: id -->` must have matching `<!-- /ANCHOR: id -->`. Unbalanced anchors break semantic indexing of canonical spec docs.
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/strategy-next-focus-and-exhausted-approach-discipline.md:73:| `.opencode/skills/deep-research/references/state/state_format.md` | Strategy file requirements; use `ANCHOR:strategy-file` |
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/strategy-next-focus-and-exhausted-approach-discipline.md:74:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Ideas backlog and recovery focus; use `ANCHOR:phase-iteration-loop` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stuck-recovery-widens-focus-and-continues.md:73:| `.opencode/skills/deep-research/references/convergence/convergence.md` | Stuck recovery protocol; use `ANCHOR:stuck-recovery-protocol` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/stuck-recovery-widens-focus-and-continues.md:74:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Ideas backlog and stuck recovery; use `ANCHOR:phase-iteration-loop` |
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/dashboard-generation-after-iteration.md:48:2. `bash: sed -n '/ANCHOR:dashboard/,/\/ANCHOR:dashboard/p' .opencode/skills/deep-research/references/state/state_format.md`
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/dashboard-generation-after-iteration.md:75:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Loop protocol; inspect Step 4a (Generate Dashboard) under `ANCHOR:phase-iteration-loop` |
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/dashboard-generation-after-iteration.md:76:| `.opencode/skills/deep-research/references/state/state_format.md` | State format; inspect `ANCHOR:dashboard` for content sections, lifecycle, and file protection rules |
.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2974:Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/novelty-justification-in-jsonl.md:73:| `.opencode/skills/deep-research/references/state/state_format.md` | State format; inspect `Novelty Justification` subsection under `ANCHOR:state-log` for field definition and example |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/composite-convergence-stop-behavior.md:73:| `.opencode/skills/deep-research/references/convergence/convergence.md` | Canonical convergence math; use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/composite-convergence-stop-behavior.md:76:| `.opencode/skills/deep-research/README.md` | Feature summary for convergence; use `ANCHOR:features` |
.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/composite-convergence-stop-behavior.md:77:| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Progress visualization and decision tree; use `ANCHOR:convergence-decision-tree` and `ANCHOR:progress-visualization` |
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:26:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:38:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:41:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:51:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:54:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:79:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:82:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:101:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:104:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:111:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:114:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:124:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:127:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:133:<!-- /ANCHOR:questions -->
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Evaluation and write-back checks; use `ANCHOR:phase-iteration-loop` |
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md:74:| `.opencode/skills/deep-research/references/state/state_format.md` | Schema expectations for JSONL and strategy; use `ANCHOR:state-log` and `ANCHOR:strategy-file` |
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:25:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:41:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:44:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:58:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:61:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:82:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:85:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:105:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:108:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:118:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:121:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:132:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:135:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_1/plan.md:144:<!-- /ANCHOR:rollback -->
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/progressive-synthesis-behavior-for-research-md.md:73:| `.opencode/skills/deep-research/README.md` | Progressive synthesis defaults and state-file table; use `ANCHOR:overview` and `ANCHOR:configuration` |
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/progressive-synthesis-behavior-for-research-md.md:74:| `.opencode/skills/deep-research/references/state/state_format.md` | Canonical ownership wording; use `ANCHOR:overview` and `ANCHOR:config-file` |
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/progressive-synthesis-behavior-for-research-md.md:75:| `.opencode/skills/deep-research/SKILL.md` | Rule-level ownership statement; use `ANCHOR:rules` |
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:24:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:37:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:40:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:48:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:51:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:63:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:66:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:77:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:80:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:88:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:91:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/examples/level_1/tasks.md:97:<!-- /ANCHOR:cross-refs -->
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/iteration-reads-state-before-research.md:73:| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Iteration loop order; use `ANCHOR:phase-iteration-loop` |
.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/iteration-reads-state-before-research.md:76:| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Iteration checklist; use `ANCHOR:agent-iteration-checklist` |
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:22:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:32:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:35:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:54:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:57:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:68:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:71:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:81:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:84:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_1/implementation-summary.md:92:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:27:<!-- ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:113:<!-- /ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:116:<!-- ANCHOR:adr-002 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:200:<!-- /ANCHOR:adr-002 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:203:<!-- ANCHOR:adr-003 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:284:<!-- /ANCHOR:adr-003 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:287:<!-- ANCHOR:adr-index -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/decision-record.md:296:<!-- /ANCHOR:adr-index -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:26:<!-- ANCHOR:executive-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:36:<!-- /ANCHOR:executive-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:39:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:53:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:56:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:66:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:69:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:106:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:109:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:134:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:137:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:147:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:150:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:163:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:166:<!-- ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:187:<!-- /ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:190:<!-- ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:210:<!-- /ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:213:<!-- ANCHOR:complexity -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:226:<!-- /ANCHOR:complexity -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:229:<!-- ANCHOR:risk-matrix -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:242:<!-- /ANCHOR:risk-matrix -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:245:<!-- ANCHOR:user-stories -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:274:<!-- /ANCHOR:user-stories -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:277:<!-- ANCHOR:approval-workflow -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:289:<!-- /ANCHOR:approval-workflow -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:292:<!-- ANCHOR:compliance -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:312:<!-- /ANCHOR:compliance -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:315:<!-- ANCHOR:stakeholders -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:328:<!-- /ANCHOR:stakeholders -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:331:<!-- ANCHOR:changelog -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:359:<!-- /ANCHOR:changelog -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:362:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:370:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:373:<!-- ANCHOR:related-docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/spec.md:381:<!-- /ANCHOR:related-docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:25:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:41:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:44:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:67:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:70:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:118:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:121:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:160:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:163:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:174:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:177:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:190:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:193:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:200:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:203:<!-- ANCHOR:l2-phase-deps -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:222:<!-- /ANCHOR:l2-phase-deps -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:225:<!-- ANCHOR:l2-effort -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:239:<!-- /ANCHOR:l2-effort -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:242:<!-- ANCHOR:l2-rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:263:<!-- /ANCHOR:l2-rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:266:<!-- ANCHOR:l3-dep-graph -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:305:<!-- /ANCHOR:l3-dep-graph -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:308:<!-- ANCHOR:l3-critical-path -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:321:<!-- /ANCHOR:l3-critical-path -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:324:<!-- ANCHOR:l3-milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:337:<!-- /ANCHOR:l3-milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:340:<!-- ANCHOR:l3-adr-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:352:<!-- /ANCHOR:l3-adr-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:355:<!-- ANCHOR:l3plus-ai-exec -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:402:<!-- /ANCHOR:l3plus-ai-exec -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:403:<!-- ANCHOR:status-update-timestamp -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:414:<!-- /ANCHOR:status-update-timestamp -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:417:<!-- ANCHOR:l3plus-workstreams -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:454:<!-- /ANCHOR:l3plus-workstreams -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:457:<!-- ANCHOR:l3plus-communication -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/plan.md:481:<!-- /ANCHOR:l3plus-communication -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:25:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:35:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:38:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:51:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:54:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:71:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:74:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:93:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:96:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:115:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:118:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:133:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:136:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:147:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:150:<!-- ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:165:<!-- /ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:168:<!-- ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:183:<!-- /ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:186:<!-- ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:201:<!-- /ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:204:<!-- ANCHOR:l3plus-arch-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:217:<!-- /ANCHOR:l3plus-arch-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:220:<!-- ANCHOR:l3plus-perf-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:231:<!-- /ANCHOR:l3plus-perf-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:234:<!-- ANCHOR:l3plus-deploy-ready -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:245:<!-- /ANCHOR:l3plus-deploy-ready -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:248:<!-- ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:263:<!-- /ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:266:<!-- ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:279:<!-- /ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:282:<!-- ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:294:<!-- /ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:297:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/checklist.md:312:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:24:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:37:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:40:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:53:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:56:<!-- ANCHOR:ai-exec -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:78:<!-- /ANCHOR:ai-exec -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:81:<!-- ANCHOR:workstreams -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:91:<!-- /ANCHOR:workstreams -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:94:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:103:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:106:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:113:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:116:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:134:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:137:<!-- ANCHOR:phase-4 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:161:<!-- /ANCHOR:phase-4 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:164:<!-- ANCHOR:phase-5 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:177:<!-- /ANCHOR:phase-5 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:180:<!-- ANCHOR:phase-6 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:190:<!-- /ANCHOR:phase-6 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:193:<!-- ANCHOR:phase-7 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:227:<!-- /ANCHOR:phase-7 -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:230:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:246:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:249:<!-- ANCHOR:status-log -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:288:<!-- /ANCHOR:status-log -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:291:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/tasks.md:299:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:23:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:37:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:40:<!-- ANCHOR:exec-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:53:<!-- /ANCHOR:exec-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:56:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:89:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:92:<!-- ANCHOR:arch-decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:104:<!-- /ANCHOR:arch-decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:107:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:144:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:147:<!-- ANCHOR:governance -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:171:<!-- /ANCHOR:governance -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:174:<!-- ANCHOR:workstream-perf -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:216:<!-- /ANCHOR:workstream-perf -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:219:<!-- ANCHOR:ai-analysis -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:244:<!-- /ANCHOR:ai-analysis -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:247:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:262:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:265:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:275:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:278:<!-- ANCHOR:risks-realized -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:291:<!-- /ANCHOR:risks-realized -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:318:<!-- ANCHOR:deviations -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:329:<!-- /ANCHOR:deviations -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:332:<!-- ANCHOR:follow-up -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:348:<!-- /ANCHOR:follow-up -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:351:<!-- ANCHOR:handoff -->
.opencode/skills/system-spec-kit/templates/examples/level_3+/implementation-summary.md:364:<!-- /ANCHOR:handoff -->
.opencode/skills/system-spec-kit/templates/examples/README.md:14:<!-- ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/examples/README.md:15:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/examples/README.md:26:<!-- /ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/examples/README.md:30:<!-- ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/examples/README.md:41:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/examples/README.md:45:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/README.md:58:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/README.md:62:<!-- ANCHOR:package-topology -->
.opencode/skills/system-spec-kit/templates/examples/README.md:76:<!-- /ANCHOR:package-topology -->
.opencode/skills/system-spec-kit/templates/examples/README.md:80:<!-- ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/examples/README.md:99:<!-- /ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/examples/README.md:103:<!-- ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/examples/README.md:113:<!-- /ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/examples/README.md:117:<!-- ANCHOR:boundaries-and-flow -->
.opencode/skills/system-spec-kit/templates/examples/README.md:128:<!-- /ANCHOR:boundaries-and-flow -->
.opencode/skills/system-spec-kit/templates/examples/README.md:132:<!-- ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/examples/README.md:143:<!-- /ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/examples/README.md:147:<!-- ANCHOR:related -->
.opencode/skills/system-spec-kit/templates/examples/README.md:156:<!-- /ANCHOR:related -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:26:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:38:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:41:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:51:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:54:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:82:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:85:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:106:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:109:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:117:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:120:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:131:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:134:<!-- ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:151:<!-- /ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:154:<!-- ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:174:<!-- /ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:177:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:184:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:187:<!-- ANCHOR:related-docs -->
.opencode/skills/system-spec-kit/templates/examples/level_2/spec.md:194:<!-- /ANCHOR:related-docs -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:25:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:41:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:44:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:60:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:63:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:86:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:89:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:112:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:115:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:125:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:128:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:140:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:143:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:150:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:153:<!-- ANCHOR:l2-phase-deps -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:170:<!-- /ANCHOR:l2-phase-deps -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:173:<!-- ANCHOR:l2-effort -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:185:<!-- /ANCHOR:l2-effort -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:188:<!-- ANCHOR:l2-rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_2/plan.md:207:<!-- /ANCHOR:l2-rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:24:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:34:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:37:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:48:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:51:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:64:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:67:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:80:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:83:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:94:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:97:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:108:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:111:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:120:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:123:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_2/checklist.md:135:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:23:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:36:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:39:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:48:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:51:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:72:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:75:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:101:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:104:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:115:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:118:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/examples/level_2/tasks.md:125:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:22:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:33:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:36:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:60:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:63:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:75:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:78:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:98:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:101:<!-- ANCHOR:nfr-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:113:<!-- /ANCHOR:nfr-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:116:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:125:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:128:<!-- ANCHOR:deviations -->
.opencode/skills/system-spec-kit/templates/examples/level_2/implementation-summary.md:136:<!-- /ANCHOR:deviations -->
.opencode/skills/system-spec-kit/templates/examples/level_3/decision-record.md:26:<!-- ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/decision-record.md:106:<!-- /ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/decision-record.md:109:<!-- ANCHOR:adr-002 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/decision-record.md:187:<!-- /ANCHOR:adr-002 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/decision-record.md:190:<!-- ANCHOR:adr-003 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/decision-record.md:264:<!-- /ANCHOR:adr-003 -->
.opencode/skills/system-spec-kit/references/validation/validation_rules.md:543:<!-- ANCHOR:decisions -->        ← ERROR: 'context' never closed
.opencode/skills/system-spec-kit/references/validation/validation_rules.md:550:<!-- /ANCHOR:Context -->         ← ERROR: 'context' ≠ 'Context'
.opencode/skills/system-spec-kit/references/validation/validation_rules.md:568:2. Add the matching close tag: `<!-- /ANCHOR:name -->`
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:26:<!-- ANCHOR:executive-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:36:<!-- /ANCHOR:executive-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:39:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:52:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:55:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:65:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:68:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:103:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:106:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:129:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:132:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:141:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:144:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:156:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:159:<!-- ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:179:<!-- /ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:182:<!-- ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:202:<!-- /ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:205:<!-- ANCHOR:risk-matrix -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:217:<!-- /ANCHOR:risk-matrix -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:220:<!-- ANCHOR:user-stories -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:249:<!-- /ANCHOR:user-stories -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:252:<!-- ANCHOR:open-questions -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:260:<!-- /ANCHOR:open-questions -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:263:<!-- ANCHOR:related-docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3/spec.md:271:<!-- /ANCHOR:related-docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:25:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:41:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:44:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:63:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:66:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:123:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:126:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:165:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:168:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:179:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:182:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:194:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:197:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:204:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:207:<!-- ANCHOR:l2-phase-deps -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:226:<!-- /ANCHOR:l2-phase-deps -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:229:<!-- ANCHOR:l2-effort -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:243:<!-- /ANCHOR:l2-effort -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:246:<!-- ANCHOR:l2-rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:266:<!-- /ANCHOR:l2-rollback -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:269:<!-- ANCHOR:l3-dep-graph -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:321:<!-- /ANCHOR:l3-dep-graph -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:324:<!-- ANCHOR:l3-critical-path -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:341:<!-- /ANCHOR:l3-critical-path -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:344:<!-- ANCHOR:l3-milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:356:<!-- /ANCHOR:l3-milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:359:<!-- ANCHOR:l3-adr-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/plan.md:370:<!-- /ANCHOR:l3-adr-summary -->
.opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md:98:Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:24:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:34:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:37:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:48:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:51:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:64:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:67:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:80:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:83:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:94:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:97:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:108:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:111:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:120:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:123:<!-- ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:136:<!-- /ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:139:<!-- ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:152:<!-- /ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:155:<!-- ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:168:<!-- /ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:171:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/checklist.md:184:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/references/validation/path_scoped_rules.md:77:| `ANCHORS_VALID`      | ERROR    | Validate `<!-- ANCHOR:id -->` pairs in generated continuity support artifacts |
.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md:191:## 5. F35: catalog TOC numbering mismatch
.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md:195:`feature_catalog/feature_catalog.md` TOC numbers sections 1-8 sequentially while directory layout uses 01, 02, 03, 04, 06, 07, 08 (gap at 05). Section 5 (SCORER FUSION) in the TOC maps to directory `04--scorer-fusion`, section 6 (MCP SURFACE) maps to `06--mcp-surface`, creating a mismatch.
.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md:206:- Or renumber the TOC to match directory numbers (gap-05 in TOC too), making the TOC look broken.
.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md:222:**Option A (recommended)**: Accept and move on. The gap is invisible from the root catalog (the TOC simply lists 4 features). No operator action would discover the gap unless they `ls` the directory directly.
.opencode/skills/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/30-constitutional-sufficiency-gate-exemption.md:10:Constitutional files under `.opencode/skills/*/constitutional/` are policy text, not evidence-bearing memory records. They encode behavior rules for agents and do not carry primary-evidence sections or `<!-- ANCHOR:* -->` tags. Before this feature shipped, the strict sufficiency gate at `memory-sufficiency.ts:372` rejected them with `INSUFFICIENT_CONTEXT_ABORT` because manual fallback requires `support >= 3` plus `anchors >= 1` when primary evidence is absent.
.opencode/skills/system-spec-kit/scripts/test-fixtures/013-anchors-multiple-files/memory/valid.md:7:<!-- ANCHOR_END: valid -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:23:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:36:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:39:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:51:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:54:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:63:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:66:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:73:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:76:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:92:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:95:<!-- ANCHOR:phase-4 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:119:<!-- /ANCHOR:phase-4 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:122:<!-- ANCHOR:phase-5 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:133:<!-- /ANCHOR:phase-5 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:136:<!-- ANCHOR:phase-6 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:168:<!-- /ANCHOR:phase-6 -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:171:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:184:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:187:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/examples/level_3/tasks.md:195:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:22:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:34:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:37:<!-- ANCHOR:exec-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:43:<!-- /ANCHOR:exec-summary -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:46:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:78:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:81:<!-- ANCHOR:arch-decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:93:<!-- /ANCHOR:arch-decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:96:<!-- ANCHOR:impl-decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:107:<!-- /ANCHOR:impl-decisions -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:110:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:132:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:135:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:147:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:150:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:160:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:163:<!-- ANCHOR:risks-realized -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:174:<!-- /ANCHOR:risks-realized -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:197:<!-- ANCHOR:deviations -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:207:<!-- /ANCHOR:deviations -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:210:<!-- ANCHOR:follow-up -->
.opencode/skills/system-spec-kit/templates/examples/level_3/implementation-summary.md:218:<!-- /ANCHOR:follow-up -->
.opencode/skills/system-spec-kit/templates/README.md:13:<!-- ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/README.md:14:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/README.md:17:  - [TABLE OF CONTENTS](#table-of-contents)
.opencode/skills/system-spec-kit/templates/README.md:28:<!-- /ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/README.md:32:<!-- ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/README.md:43:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/README.md:47:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/README.md:77:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/README.md:81:<!-- ANCHOR:package-topology -->
.opencode/skills/system-spec-kit/templates/README.md:110:<!-- /ANCHOR:package-topology -->
.opencode/skills/system-spec-kit/templates/README.md:114:<!-- ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/README.md:147:<!-- /ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/README.md:151:<!-- ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/README.md:168:<!-- /ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/README.md:172:<!-- ANCHOR:boundaries-flow -->
.opencode/skills/system-spec-kit/templates/README.md:209:<!-- /ANCHOR:boundaries-flow -->
.opencode/skills/system-spec-kit/templates/README.md:213:<!-- ANCHOR:entrypoints -->
.opencode/skills/system-spec-kit/templates/README.md:225:<!-- /ANCHOR:entrypoints -->
.opencode/skills/system-spec-kit/templates/README.md:229:<!-- ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/README.md:242:<!-- /ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/README.md:246:<!-- ANCHOR:related -->
.opencode/skills/system-spec-kit/templates/README.md:257:<!-- /ANCHOR:related -->
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:1583:| v2.0.0  | 2026-02-20 | HVR compliance rewrite, standardized phase_N_complete validation naming, TOC moved after AI-First Install Guide, Quick Reference Card added to Resources |
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:57:  anchor: string;
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:153:        anchor: `${anchor.filePath}:${anchor.startLine}`,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:321:function expandAnchor(anchor: ArtifactRef, mode: QueryMode, remainingMs?: number): ExpansionResult {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:344:      anchor: `${anchor.filePath}:${anchor.startLine} (${anchor.fqName ?? 'unknown'})`,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:364:      section: { anchor: anchor.filePath, nodes, edges },
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:36:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:44:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:48:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:54:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:58:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:65:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:69:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:76:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:80:<!-- ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:90:<!-- /ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:94:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:100:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:104:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:110:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:114:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:119:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:123:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:133:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:179:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:187:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:191:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:197:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:201:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:208:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:212:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:219:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:223:<!-- ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:233:<!-- /ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:237:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:243:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:247:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:253:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:257:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:262:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:266:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:276:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:284:<!-- ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:291:<!-- /ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:295:<!-- ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:302:<!-- /ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:306:<!-- ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:314:<!-- /ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:318:<!-- ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:325:<!-- /ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:329:<!-- ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:336:<!-- /ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:340:<!-- ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:348:<!-- /ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:394:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:402:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:406:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:412:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:416:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:423:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:427:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:434:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:438:<!-- ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:448:<!-- /ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:452:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:458:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:462:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:468:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:472:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:477:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:481:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:491:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:499:<!-- ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:506:<!-- /ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:510:<!-- ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:517:<!-- /ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:521:<!-- ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:529:<!-- /ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:533:<!-- ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:540:<!-- /ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:544:<!-- ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:551:<!-- /ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:555:<!-- ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:563:<!-- /ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:43:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:58:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:62:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:72:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:76:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:91:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:95:<!-- ANCHOR:phase-map -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:116:<!-- /ANCHOR:phase-map -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:120:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:125:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/references/templates/template_guide.md:726:11. **Apply ToC policy consistently** - Only `research/research.md` may include a Table of Contents section; keep standard spec artifacts ToC-free
.opencode/skills/system-spec-kit/references/templates/template_guide.md:742:- [ ] No ToC heading in non-research spec artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`, `resource-map.md`)
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:23:<!-- ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:38:<!-- /ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:42:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:58:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:62:<!-- ANCHOR:file-organization -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:77:<!-- /ANCHOR:file-organization -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:81:<!-- ANCHOR:investigation-report -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:104:<!-- /ANCHOR:investigation-report -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:108:<!-- ANCHOR:executive-overview -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:148:<!-- /ANCHOR:executive-overview -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:152:<!-- ANCHOR:core-architecture -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:216:<!-- /ANCHOR:core-architecture -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:220:<!-- ANCHOR:technical-specifications -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:291:<!-- /ANCHOR:technical-specifications -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:295:<!-- ANCHOR:constraints-limitations -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:323:<!-- /ANCHOR:constraints-limitations -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:327:<!-- ANCHOR:integration-patterns -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:388:<!-- /ANCHOR:integration-patterns -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:392:<!-- ANCHOR:implementation-guide -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:474:<!-- /ANCHOR:implementation-guide -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:478:<!-- ANCHOR:code-examples -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:534:<!-- /ANCHOR:code-examples -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:546:<!-- ANCHOR:testing-debugging -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:603:<!-- /ANCHOR:testing-debugging -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:607:<!-- ANCHOR:performance-optimization -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:651:<!-- /ANCHOR:performance-optimization -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:655:<!-- ANCHOR:security-considerations -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:707:<!-- /ANCHOR:security-considerations -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:711:<!-- ANCHOR:future-proofing-maintenance -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:756:<!-- /ANCHOR:future-proofing-maintenance -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:760:<!-- ANCHOR:api-reference -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:821:<!-- /ANCHOR:api-reference -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:825:<!-- ANCHOR:troubleshooting-guide -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:882:<!-- /ANCHOR:troubleshooting-guide -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:886:<!-- ANCHOR:acknowledgements -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:900:<!-- /ANCHOR:acknowledgements -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:904:<!-- ANCHOR:appendix -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:917:<!-- /ANCHOR:appendix -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:921:<!-- ANCHOR:changelog-updates -->
.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:933:<!-- /ANCHOR:changelog-updates -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:21:<!-- ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:32:<!-- /ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:36:<!-- ANCHOR:handover-summary -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:43:<!-- /ANCHOR:handover-summary -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:47:<!-- ANCHOR:context-transfer -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:65:<!-- /ANCHOR:context-transfer -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:69:<!-- ANCHOR:next-session -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:85:<!-- /ANCHOR:next-session -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:89:<!-- ANCHOR:validation-checklist -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:98:<!-- /ANCHOR:validation-checklist -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:102:<!-- ANCHOR:session-notes -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:106:<!-- /ANCHOR:session-notes -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:110:<!-- ANCHOR:template-instructions -->
.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl:131:<!-- /ANCHOR:template-instructions -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:38:<!-- ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:51:<!-- ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:64:<!-- /ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:68:<!-- ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:74:<!-- /ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:78:<!-- ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:87:<!-- /ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:91:<!-- ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:106:<!-- /ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:110:<!-- ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:122:<!-- /ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:126:<!-- ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:134:<!-- /ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:135:<!-- /ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:183:<!-- ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:196:<!-- ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:209:<!-- /ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:213:<!-- ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:219:<!-- /ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:223:<!-- ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:232:<!-- /ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:236:<!-- ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:251:<!-- /ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:255:<!-- ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:267:<!-- /ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:271:<!-- ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:279:<!-- /ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:280:<!-- /ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/templates/manifest/context-index.md.tmpl:19:<!-- ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/context-index.md.tmpl:27:<!-- /ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/context-index.md.tmpl:31:<!-- ANCHOR:migration-bridge -->
.opencode/skills/system-spec-kit/templates/manifest/context-index.md.tmpl:37:<!-- /ANCHOR:migration-bridge -->
.opencode/skills/system-spec-kit/templates/manifest/context-index.md.tmpl:41:<!-- ANCHOR:author-instructions -->
.opencode/skills/system-spec-kit/templates/manifest/context-index.md.tmpl:49:<!-- /ANCHOR:author-instructions -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:12:<!-- ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:13:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/manifest/README.md:23:<!-- /ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:27:<!-- ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:34:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:38:<!-- ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:49:<!-- /ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:53:<!-- ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:62:<!-- /ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:66:<!-- ANCHOR:boundaries-and-flow -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:95:<!-- /ANCHOR:boundaries-and-flow -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:99:<!-- ANCHOR:entrypoints -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:108:<!-- /ANCHOR:entrypoints -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:112:<!-- ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:124:<!-- /ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:128:<!-- ANCHOR:related -->
.opencode/skills/system-spec-kit/templates/manifest/README.md:136:<!-- /ANCHOR:related -->
.opencode/skills/sk-prompt-small-model/changelog/v0.1.0.0.md:13:The sentinel ships as a thin routing anchor: `SKILL.md` (≤ 200 LOC), `references/pattern-index.md` (≤ 100 LOC), `description.json` + `graph-metadata.json` with `enhances` edges (weight 0.5) to both `cli-devin` and `cli-opencode`, and a sk-doc-aligned `README.md`. No runtime logic, no scripts, no agent-config recipes — every pattern body lives in the owning executor skill. Operators reach the canonical pattern files through one Read of `references/pattern-index.md`.
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:37:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:51:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:55:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:67:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:71:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:83:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:87:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:102:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:106:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:123:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:127:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:135:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:139:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:145:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:149:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:154:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:202:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:216:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:220:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:232:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:236:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:248:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:252:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:267:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:271:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:288:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:292:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:300:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:304:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:310:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:314:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:319:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:326:<!-- ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:341:<!-- /ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:345:<!-- ANCHOR:effort -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:354:<!-- /ANCHOR:effort -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:358:<!-- ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:375:<!-- /ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:423:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:437:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:441:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:453:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:457:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:469:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:473:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:488:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:492:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:509:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:513:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:521:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:525:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:531:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:535:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:540:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:547:<!-- ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:562:<!-- /ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:566:<!-- ANCHOR:effort -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:575:<!-- /ANCHOR:effort -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:579:<!-- ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:596:<!-- /ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:603:<!-- ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:626:<!-- /ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:630:<!-- ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:642:<!-- /ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:646:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:654:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:721:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:735:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:739:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:751:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:755:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:767:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:771:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:786:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:790:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:807:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:811:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:819:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:823:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:829:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:833:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:838:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:845:<!-- ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:860:<!-- /ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:864:<!-- ANCHOR:effort -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:873:<!-- /ANCHOR:effort -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:877:<!-- ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:894:<!-- /ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:901:<!-- ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:924:<!-- /ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:928:<!-- ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:940:<!-- /ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:944:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:952:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:978:<!-- ANCHOR:ai-execution -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:999:<!-- /ANCHOR:ai-execution -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:1003:<!-- ANCHOR:workstreams -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:1025:<!-- /ANCHOR:workstreams -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:1029:<!-- ANCHOR:communication -->
.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:1041:<!-- /ANCHOR:communication -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:37:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:45:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:49:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:74:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:78:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:88:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:92:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:101:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:105:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:114:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:118:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:127:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:174:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:182:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:186:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:211:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:215:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:225:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:229:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:238:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:242:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:251:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:255:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:264:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:311:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:319:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:323:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:348:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:352:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:362:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:366:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:375:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:379:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:388:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:392:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:401:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:448:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:456:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:460:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:485:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:489:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:499:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:503:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:512:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:516:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:525:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:529:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl:538:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:36:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:47:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:51:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:57:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:61:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:68:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:72:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:78:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:82:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:88:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:92:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:97:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:144:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:155:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:159:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:165:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:169:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:176:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:180:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:186:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:190:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:196:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:200:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:205:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:252:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:263:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:267:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:273:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:277:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:284:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:288:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:294:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:298:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:304:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:308:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:313:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:360:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:371:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:375:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:381:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:385:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:392:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:396:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:402:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:406:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:412:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:416:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl:421:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:21:<!-- ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:33:<!-- /ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:37:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:49:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:53:<!-- ANCHOR:readmes -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:59:<!-- /ANCHOR:readmes -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:63:<!-- ANCHOR:documents -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:71:<!-- /ANCHOR:documents -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:75:<!-- ANCHOR:commands -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:83:<!-- /ANCHOR:commands -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:87:<!-- ANCHOR:agents -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:95:<!-- /ANCHOR:agents -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:99:<!-- ANCHOR:skills -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:107:<!-- /ANCHOR:skills -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:111:<!-- ANCHOR:specs -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:119:<!-- /ANCHOR:specs -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:123:<!-- ANCHOR:scripts -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:131:<!-- /ANCHOR:scripts -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:135:<!-- ANCHOR:tests -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:143:<!-- /ANCHOR:tests -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:147:<!-- ANCHOR:config -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:155:<!-- /ANCHOR:config -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:159:<!-- ANCHOR:meta -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:167:<!-- /ANCHOR:meta -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:171:<!-- ANCHOR:author-instructions -->
.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:203:<!-- /ANCHOR:author-instructions -->
.opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:12:// <!-- ANCHOR:id --> ... content ... <!-- /ANCHOR:id -->
.opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:45:  /** 1-based line number of the opening <!-- ANCHOR:id --> tag. */
.opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:47:  /** 1-based line number of the closing <!-- /ANCHOR:id --> tag. */
.opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:58:const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:\s*(\S+)\s*-->/;
.opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:64:const ANCHOR_CLOSE_RE = /<!--\s*\/ANCHOR:\s*(\S+)\s*-->/;
.opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:120:    // (<!-- ANCHOR:x -->...<!-- /ANCHOR:x -->) are captured. The old logic
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:37:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:47:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:51:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:59:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:63:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:80:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:84:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:98:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:102:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:107:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:111:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:118:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:122:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:127:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:175:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:185:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:189:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:197:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:201:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:218:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:222:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:236:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:240:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:245:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:249:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:256:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:260:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:264:<!-- ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:278:<!-- /ANCHOR:nfr -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:282:<!-- ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:298:<!-- /ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:302:<!-- ANCHOR:complexity -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:311:<!-- /ANCHOR:complexity -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:319:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:393:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:403:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:407:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:415:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:419:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:436:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:440:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:454:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:458:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:463:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:467:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:474:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:478:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:550:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:633:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:643:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:647:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:655:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:659:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:676:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:680:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:694:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:698:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:703:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:707:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:714:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:718:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:776:<!-- ANCHOR:approval-workflow -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:785:<!-- /ANCHOR:approval-workflow -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:789:<!-- ANCHOR:compliance-checkpoints -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:800:<!-- /ANCHOR:compliance-checkpoints -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:804:<!-- ANCHOR:stakeholder-matrix -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:811:<!-- /ANCHOR:stakeholder-matrix -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:815:<!-- ANCHOR:change-log -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:820:<!-- /ANCHOR:change-log -->
.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:845:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:22:<!-- ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:33:<!-- /ANCHOR:when-to-use -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:37:<!-- ANCHOR:delegation-metadata -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:42:<!-- /ANCHOR:delegation-metadata -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:44:<!-- ANCHOR:problem-summary -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:58:<!-- /ANCHOR:problem-summary -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:60:<!-- ANCHOR:attempted-fixes -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:75:<!-- /ANCHOR:attempted-fixes -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:77:<!-- ANCHOR:context-for-specialist -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:90:<!-- /ANCHOR:context-for-specialist -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:92:<!-- ANCHOR:recommended-next-steps -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:97:<!-- /ANCHOR:recommended-next-steps -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:99:<!-- ANCHOR:handoff-checklist -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:106:<!-- /ANCHOR:handoff-checklist -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:110:<!-- ANCHOR:template-instructions -->
.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:131:<!-- /ANCHOR:template-instructions -->
.opencode/skills/system-spec-kit/templates/stress_test/README.md:10:<!-- ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/stress_test/README.md:11:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/stress_test/README.md:22:<!-- /ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/references/debugging/troubleshooting.md:193:grep -c "<!-- ANCHOR:" specs/049-*/memory/*.md
.opencode/skills/system-spec-kit/references/debugging/troubleshooting.md:196:grep -o 'ANCHOR:[a-z0-9-]*' specs/049-*/memory/*.md | sed 's/ANCHOR://' | sort -u
.opencode/skills/system-spec-kit/references/debugging/troubleshooting.md:199:find specs -name "*.md" -path "*/memory/*" -exec grep -l "<!-- ANCHOR:" {} \;
.opencode/skills/system-spec-kit/references/debugging/troubleshooting.md:215:grep -q "<!-- ANCHOR:" file.md && echo "Current (supports anchors)" || echo "Legacy (full read only)"
.opencode/skills/system-spec-kit/references/debugging/troubleshooting.md:218:current_count=$(find specs/049-*/memory -name "*.md" -exec grep -l "<!-- ANCHOR:" {} \; | wc -l)
.opencode/skills/system-spec-kit/templates/changelog/README.md:12:<!-- ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:13:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/changelog/README.md:23:<!-- /ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:27:<!-- ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:38:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:42:<!-- ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:52:<!-- /ANCHOR:directory-tree -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:56:<!-- ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:64:<!-- /ANCHOR:key-files -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:68:<!-- ANCHOR:boundaries-and-flow -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:97:<!-- /ANCHOR:boundaries-and-flow -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:101:<!-- ANCHOR:entrypoints -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:110:<!-- /ANCHOR:entrypoints -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:114:<!-- ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:125:<!-- /ANCHOR:validation -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:129:<!-- ANCHOR:related -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:136:<!-- /ANCHOR:related -->
.opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/417-constitutional-sufficiency-gate-exemption.md:11:This scenario validates the 5-line patch to the scan batch loop that OR-s `isConstitutional` into the `useWarnOnly` exemption. Constitutional markdown files are policy text and lack the `<!-- ANCHOR:* -->` tags plus primary-evidence sections that the strict sufficiency gate demands. The exemption lets them pass through warn-only sufficiency mode while keeping the strict gate intact for non-classified content.
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:36:    `<!-- ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:41:    `<!-- /ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:106:    '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:112:    '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:114:    '<!-- ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:122:    '<!-- /ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:128:    '<!-- ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:134:    '<!-- /ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:144:    '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:150:    '<!-- /ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:152:    '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:161:    '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:205:    '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:211:    '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:213:    '<!-- ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:220:    '<!-- /ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:226:    '<!-- ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:233:    '<!-- /ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:235:    '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:241:    '<!-- /ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:243:    '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:252:    '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/references/memory/memory_system.md:532:      anchor: memory.anchorId,
.opencode/skills/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:600:        content: '---\ntitle: Cache Key\n---\n\n## Heading\n- bullet item\n<!-- ANCHOR:test -->',
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:366:> **Tip:** Add `<!-- ANCHOR:name -->` tags to spec documents and continuity-rich packet sections so targeted retrieval can pull only the sections you need.
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:427:grep -r "ANCHOR:.*decision.*auth" .opencode/specs/*/implementation-summary.md .opencode/specs/*/handover.md .opencode/specs/*/spec.md
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:430:grep "<!-- ANCHOR:" <spec-folder>*/*.md
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:433:sed -n '/<!-- ANCHOR:decision-jwt-049 -->/,/<!-- \/ANCHOR:decision-jwt-049 -->/p' file.md
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:458:         │  grep -r "ANCHOR:.*keyword" specs/     │
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:485:grep -r "ANCHOR:.*keyword" .opencode/specs/###-current-spec/*.md .opencode/specs/###-current-spec/**/**/*.md
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:488:grep -r "ANCHOR:.*keyword" <active-spec-folder>/**/*.md
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:491:sed -n '/<!-- ANCHOR:decision-auth-049 -->/,/<!-- \/ANCHOR:decision-auth-049 -->/p' file.md
.opencode/skills/system-spec-kit/references/memory/save_workflow.md:583:| `Missing anchor closing`| Incomplete anchor   | Add `<!-- /ANCHOR:... -->`         |
.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md:70:| `.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh` | Validation rule | Rule script discovered and executed by the orchestrator for table-of-contents policy checks |
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:44:      '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:50:      '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:52:      '<!-- ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:59:      '<!-- /ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:61:      '<!-- ANCHOR:overview -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:67:      '<!-- /ANCHOR:overview -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:69:      '<!-- ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:76:      '<!-- /ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:78:      '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:86:      '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:169:        source_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:170:        target_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:183:          sourceAnchor: 'spec:overview',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:184:          targetAnchor: 'plan:details',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:193:        source_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:194:        target_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:197:        source_anchor: 'spec:overview',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:198:        target_anchor: 'plan:details',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:210:          sourceAnchor: 'spec:7#decision',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:211:          targetAnchor: 'plan:8#follow-up',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:220:        source_anchor: 'spec:7#decision',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:221:        target_anchor: 'plan:8#follow-up',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:224:        source_anchor: 'spec:7#decision',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:225:        target_anchor: 'plan:8#follow-up',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:228:        source_anchor: 'spec:7#decision',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:229:        target_anchor: 'plan:8#follow-up',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:487:        sourceAnchor: 'memory:4#section',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:488:        targetAnchor: 'memory:5#section',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:496:        source_anchor: 'memory:4#section',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:497:        target_anchor: 'memory:5#section',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:510:          sourceAnchor: 'memory:4#section',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:511:          targetAnchor: 'memory:5#section',
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:516:        sourceAnchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:517:        targetAnchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:525:        source_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:526:        target_anchor: null,
.opencode/skills/system-spec-kit/changelog/v2.3.0.10.md:1:This release spec 139 Phase 007 template-policy enforcement documented - Added release coverage for the docs-only policy pass that removed disallowed ToC blocks from targeted standard artifacts and captured validation outcomes. It focuses on making the instructions and release notes easier for non-developers to follow. The goal is to make the workflow easier to follow and easier to trust.
.opencode/skills/system-spec-kit/changelog/v2.3.0.10.md:12:#### Targeted ToC cleanup recorded
.opencode/skills/system-spec-kit/changelog/v2.3.0.10.md:14:People needed clearer guidance about Targeted ToC cleanup recorded. Targeted ToC cleanup recorded: Disallowed ToC sections were removed from scoped standard artifacts in 039, 040, and 041. This matters because the release notes and instructions are easier to read and trust.
.opencode/skills/system-spec-kit/changelog/v2.3.0.10.md:19:People needed clearer guidance about Policy scan passes captured. Policy scan passes captured: Scoped ToC policy scan evidence is recorded as passing. This matters because the release notes and instructions are easier to read and trust.
.opencode/skills/system-spec-kit/changelog/v2.3.0.10.md:34:| `.opencode/specs/03--commands-and-skills/z_archive/013-code-opencode-alignment-hardening/{spec.md,plan.md,tasks.md,checklist.md,decision-record.md,implementation-summary.md}` | ToC sections removed from scoped standard artifacts. |
.opencode/skills/system-spec-kit/changelog/v2.3.0.10.md:35:| `.opencode/specs/03--commands-and-skills/016-code-review-skill/{spec.md,plan.md,tasks.md,checklist.md}` | ToC sections removed from scoped standard artifacts. |
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:62:<!-- ANCHOR:continue-session -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:<!-- /ANCHOR:continue-session -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:70:<!-- ANCHOR:canonical-docs -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:77:<!-- /ANCHOR:canonical-docs -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:86:<!-- ANCHOR:overview -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:96:<!-- ANCHOR:evidence -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:104:<!-- /ANCHOR:evidence -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:116:<!-- ANCHOR:recovery-hints -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:123:<!-- /ANCHOR:recovery-hints -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:125:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:135:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:178:<!-- ANCHOR:continue-session -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:184:<!-- /ANCHOR:continue-session -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:186:<!-- ANCHOR:canonical-docs -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:193:<!-- /ANCHOR:canonical-docs -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:199:<!-- ANCHOR:evidence -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:207:<!-- /ANCHOR:evidence -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:209:<!-- ANCHOR:recovery-hints -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:215:<!-- /ANCHOR:recovery-hints -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:217:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:226:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:244:    `<!-- ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:249:    `<!-- /ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts:18://     "topSignals": ["semantic_match", "anchor:decisions"],
.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts:40:  | `anchor:${string}`;
.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts:154:        const anchorSignal: SignalLabel = `anchor:${label.toLowerCase().replace(/\s+/g, '-')}`;
.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts:204:    if (signal.startsWith('anchor:')) {
.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts:205:      const anchorName = signal.slice('anchor:'.length);
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:63:    `(<!--\\s*ANCHOR:${anchorId}\\s*-->\\n)([\\s\\S]*?)(\\n<!--\\s*\\/ANCHOR:${anchorId}\\s*-->)`,
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:102:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:106:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:115:      targetAnchor: 'what-built',
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:136:<!-- ANCHOR:session-notes -->
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:144:<!-- /ANCHOR:session-notes -->
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:153:      targetAnchor: 'session-notes',
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:392:      '<!-- ANCHOR:metadata -->\n## 1. METADATA',
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:396:      '\n<!-- ANCHOR:problem -->',
.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:397:      '\n<!-- /ANCHOR:metadata -->\n\n<!-- ANCHOR:problem -->',
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:562:          const { source_anchor: _sourceAnchor, target_anchor: _targetAnchor, ...rest } = row;
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:588:        { id: 1, source_id: '1', target_id: '2', source_anchor: null, target_anchor: null },
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:593:          source_anchor: 'alpha-source-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:594:          target_anchor: 'alpha-target-anchor',
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:600:          source_anchor: null,
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:601:          target_anchor: null,
.opencode/skills/system-spec-kit/changelog/v2.2.5.0.md:9:People needed clearer guidance about ~473 anchor tags. Added across 74 README files using <!-- anchor:tag-name -to format, enabling precise memory retrieval via anchor-based content filtering; covers all .opencode/ skill, command, agent, and infrastructure READMEs (Spec 111). This matters because the release notes and instructions are easier to read and trust.
.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/14-result-explainability.md:18:The explainability module extracts active scoring signals from each `PipelineRow`, detecting: `semantic_match`, `lexical_match` (FTS/BM25 channel attribution), `graph_boosted` / `causal_boosted` / `community_boosted` (from `graphContribution`), `session_boosted` (from `sessionBoost`), `feedback_boosted` (learned trigger boost), `validation_quality` (quality score > 0.7), and `anchor:*` labels from anchor metadata.
.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/14-result-explainability.md:25:    "topSignals": ["semantic_match", "anchor:decisions"],
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:55:        '<!-- ANCHOR:summary -->',      // line 2
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:57:        '<!-- /ANCHOR:summary -->',     // line 4
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:72:        '<!-- ANCHOR:DECISION-pipeline-003 -->',  // line 1
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:74:        '<!-- /ANCHOR:DECISION-pipeline-003 -->',  // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:89:        '<!-- ANCHOR:next-steps -->',   // line 1
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:91:        '<!-- /ANCHOR:next-steps -->',  // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:100:        '<!--  ANCHOR:state  -->',      // line 1
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:102:        '<!--  /ANCHOR:state  -->',     // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:114:        '<!-- ANCHOR:decisions -->',    // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:116:        '<!-- /ANCHOR:decisions -->',   // line 5
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:131:        '<!-- ANCHOR:summary -->',      // line 1
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:133:        '<!-- /ANCHOR:summary -->',     // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:134:        '<!-- ANCHOR:decisions -->',    // line 4
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:136:        '<!-- /ANCHOR:decisions -->',   // line 6
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:147:        '<!-- ANCHOR:preflight -->',    // line 1
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:149:        '<!-- /ANCHOR:preflight -->',   // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:151:        '<!-- ANCHOR:state -->',        // line 5
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:153:        '<!-- /ANCHOR:state -->',       // line 7
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:155:        '<!-- ANCHOR:postflight -->',   // line 9
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:157:        '<!-- /ANCHOR:postflight -->',  // line 11
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:172:        '<!-- ANCHOR:DECISION-use-rrF-001 -->',   // line 1
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:174:        '<!-- /ANCHOR:DECISION-use-rrF-001 -->',  // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:175:        '<!-- ANCHOR:ACTION-next-steps-002 -->',  // line 4
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:177:        '<!-- /ANCHOR:ACTION-next-steps-002 -->', // line 6
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:188:        '<!-- ANCHOR:summary -->',                // line 1
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:190:        '<!-- /ANCHOR:summary -->',               // line 3
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:191:        '<!-- ANCHOR:DECISION-arch-001 -->',      // line 4
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:193:        '<!-- /ANCHOR:DECISION-arch-001 -->',     // line 6
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:205:        lines.push(`<!-- ANCHOR:${id} -->`, `content for ${id}`, `<!-- /ANCHOR:${id} -->`);
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:220:        '<!-- ANCHOR:orphan -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:231:        '<!-- /ANCHOR:orphan -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:240:        '<!-- ANCHOR:foo -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:242:        '<!-- /ANCHOR:bar -->',  // bar != foo
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:243:        '<!-- /ANCHOR:foo -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:258:        '<!-- ANCHOR:summary -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:261:        '<!-- /ANCHOR:summary -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:279:    const content = `<!-- ANCHOR:${id} -->\ncontent\n<!-- /ANCHOR:${id} -->`;
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:367:      const content = '<!-- ANCHOR:summary -->\nSome text.\n<!-- /ANCHOR:summary -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:378:        '<!-- ANCHOR:DECISION-use-rrf-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:380:        '<!-- /ANCHOR:DECISION-use-rrf-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:392:      const content = '<!-- ANCHOR:state -->\nstate content\n<!-- /ANCHOR:state -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:414:        '<!-- ANCHOR:summary -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:416:        '<!-- /ANCHOR:summary -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:417:        '<!-- ANCHOR:decisions -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:419:        '<!-- /ANCHOR:decisions -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:432:      const content = '<!-- ANCHOR:preflight -->\ntext\n<!-- /ANCHOR:preflight -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:448:      const withAnchorContent = '<!-- ANCHOR:summary -->\ntext\n<!-- /ANCHOR:summary -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:472:        makeRow({ id: 2, content: '<!-- ANCHOR:x -->\ny\n<!-- /ANCHOR:x -->' }),
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:481:      const withAnchorContent = '<!-- ANCHOR:state -->\ncontent\n<!-- /ANCHOR:state -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:503:        '<!-- ANCHOR:DECISION-arch-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:505:        '<!-- /ANCHOR:DECISION-arch-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:526:      const content = '<!-- ANCHOR:summary -->\ntext\n<!-- /ANCHOR:summary -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:544:    const content = '<!-- ANCHOR:summary -->\ntext\n<!-- /ANCHOR:summary -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:559:      '<!-- ANCHOR:summary -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:562:      '<!-- /ANCHOR:summary -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:570:    const content = '<!-- ANCHOR:state -->\ntext\n<!-- /ANCHOR:state -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:585:      '<!-- ANCHOR:DECISION-arch-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:587:      '<!-- /ANCHOR:DECISION-arch-001 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:601:    const content = '<!-- ANCHOR:state -->\nstate info\n<!-- /ANCHOR:state -->';
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:615:      '<!-- ANCHOR: -->\ncontent\n<!-- /ANCHOR: -->', // empty ID
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:616:      '<!-- ANCHOR -->\ncontent\n<!-- /ANCHOR -->', // no colon
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:617:      '<!--ANCHOR:x-->\ncontent\n<!--/ANCHOR:x-->', // no spaces
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:618:      '<!-- ANCHOR:a -->\ncontent\n<!-- /ANCHOR:b -->', // mismatched
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:619:      '<!-- ANCHOR:unclosed -->\ncontent without closing tag', // unclosed
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:636:      '<!-- ANCHOR:test/path.file#section -->',
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:638:      '<!-- /ANCHOR:test/path.file#section -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:113:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:115:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:417:        content: '<!-- ANCHOR:open -->\nSome content without closing anchor tag. This is long enough.',
.opencode/skills/system-spec-kit/changelog/v2.3.0.13.md:1:This release sprint-140 validator-debt remediation and spec-structure recovery - Cleared error-class validation debt for the 140-hybrid-rag-fusion-refinement Level 3+ folder by restoring required root artifacts, normalizing template-source metadata across root/phase docs, and removing non-research TOC violations. It focuses on making the instructions and release notes easier for non-developers to follow. The goal is to make the workflow easier to follow and easier to trust.
.opencode/skills/system-spec-kit/changelog/v2.3.0.13.md:27:#### Removed TOC sections from non-research root
.opencode/skills/system-spec-kit/changelog/v2.3.0.13.md:29:People needed clearer guidance about Removed TOC sections from non-research root. Removed TOC sections from non-research root docs to satisfy TOC policy. This matters because the release notes and instructions are easier to read and trust.
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:74:    expect(countStructuralSignals({ title: '', specFolder: '', anchor: '' })).toBe(0);
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:86:    expect(countStructuralSignals({ title: null, specFolder: null, anchor: 'D4-DECISION-001' })).toBe(1);
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:100:      anchor: 'D4-001',
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:209:      anchor: 'D4-001',
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:219:      anchor: 'D4-001',
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:229:      anchor: 'D4-001',
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:317:      anchor: 'D4-DECISION-001',
.opencode/skills/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:331:      anchor: 'D4-001',     // 2 signals: specFolder + anchor
.opencode/skills/cli-devin/changelog/v1.0.0.0.md:29:People needed templates and validation scenarios they could reuse. The release ships a SKILL.md mirroring the cli-* family's 8-section contract, a README with the family's 9-section TOC, five references (cli_reference, integration_patterns, agent_delegation, devin_tools, cloud_handoff), two assets (prompt_quality_card, prompt_templates with 6 copy-paste templates), and a 25-scenario manual testing playbook across 9 categories.
.opencode/skills/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:74: * Returns sections between <!-- ANCHOR:id --> and <!-- /ANCHOR:id --> pairs,
.opencode/skills/system-spec-kit/changelog/v1.0.7.0.md:1:This release emoji heading removal + validation alignment - Removed H2/TOC emoji heading usage and aligned documentation with validation rules. It focuses on making the instructions and release notes easier for non-developers to follow. The goal is to make the workflow easier to follow and easier to trust.
.opencode/skills/system-spec-kit/changelog/v1.0.7.0.md:9:People needed clearer guidance about Removed emoji markers from H2 and. Removed emoji markers from H2 and TOC headings to keep heading text ASCII-safe. This matters because the release notes and instructions are easier to read and trust.
.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3002:Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.
.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md:18:- Real user request: `Please validate Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) against SPECKIT_RESULT_EXPLAIN_V1=true and tell me whether the expected signals are present: Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF.`
.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md:21:- Expected signals: Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF
.opencode/skills/system-spec-kit/README.md:428:Templates use ANCHOR markers (`<!-- ANCHOR:section --> ... <!-- /ANCHOR:section -->`) to mark logical sections. Validation checks for required anchors, proper section ordering and template version alignment. The `template_compliance_contract.md` reference defines which anchors are required at each level.
.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:20:        '<!-- ANCHOR:DECISION-pipeline-004 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:22:        '<!-- /ANCHOR:DECISION-pipeline-004 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:33:      '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:39:      '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:41:      '<!-- ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:48:      '<!-- /ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:50:      '<!-- ANCHOR:overview -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:56:      '<!-- /ANCHOR:overview -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:58:      '<!-- ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:66:      '<!-- /ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:68:      '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:74:      '<!-- /ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:76:      '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:84:      '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:123:    `<!-- ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts:127:    `<!-- /ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:171:  const expectedComment = `<!-- ANCHOR:${rule.commentId} -->`;
.opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:191:    if (trimmed === `<!-- /ANCHOR:${commentId} -->`) {
.opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:203:  const opener = `<!-- ANCHOR:${commentId} -->`;
.opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:220:  const matches = content.match(new RegExp(`<!--\\s*\\/ANCHOR:${commentId}\\s*-->`, 'g'));
.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.test.ts:155:  writeFile(dir, 'spec.md', VALID_SPEC + '\n<!-- ANCHOR:test -->\nContent\n');
.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.test.ts:171:  writeFile(dir, 'spec.md', VALID_SPEC + '\n<!-- ANCHOR:test -->\nContent\n<!-- /ANCHOR:test -->\n');
.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:76:    source_anchor: row.source_anchor == null ? null : String(row.source_anchor),
.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:77:    target_anchor: row.target_anchor == null ? null : String(row.target_anchor),
.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:95:  source_anchor: string | null;
.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:96:  target_anchor: string | null;
.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:433:          sourceAnchor: edge.sourceAnchor ?? null,
.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:434:          targetAnchor: edge.targetAnchor ?? null,
.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:47:const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:(\S+)\s*-->/g;
.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:48:const ANCHOR_CLOSE_RE = /<!--\s*\/ANCHOR:(\S+)\s*-->/g;
.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:194:            message: `Unclosed anchor ANCHOR:${name} in ${file}`,
.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:203:            message: `Orphan closing /ANCHOR:${name} in ${file}`,
.opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:64:      warnings.push(`Unclosed anchor: ${anchor} (missing <!-- /ANCHOR:${anchor} -->)`);
.opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:70:      warnings.push(`Orphaned closing anchor: ${anchor} (no matching opening tag)`);
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:61:      '<!-- ANCHOR:intro -->',
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:63:      '<!-- /ANCHOR:intro -->',
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:65:      '<!-- ANCHOR:details -->',
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:67:      '<!-- /ANCHOR:details -->',
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:86:      '<!-- ANCHOR:intro -->',
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:88:      '<!-- /ANCHOR:intro -->',
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:92:      '<!-- ANCHOR:details -->',
.opencode/skills/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:94:      '<!-- /ANCHOR:details -->',
.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement.ts:358:  const smartSection = skillText.match(/<!-- ANCHOR:smart-routing -->([\s\S]*?)<!-- \/ANCHOR:smart-routing -->/);
.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:17:const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/g;
.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:18:const ANCHOR_CLOSE_LINE_RE = /<!--\s*\/ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/;
.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:292:    return content.includes(`<!-- ANCHOR:${anchorId} -->`);
.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:369:    const openMatch = lines[index].match(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/);
.opencode/skills/system-spec-kit/scripts/utils/spec-affinity.ts:81:  hasAnchor: boolean;
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:271:<!-- ANCHOR:delegation-metadata -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:276:<!-- /ANCHOR:delegation-metadata -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:278:<!-- ANCHOR:problem-summary -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:290:${AFFECTED_FILES_BLOCK}<!-- /ANCHOR:problem-summary -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:292:<!-- ANCHOR:attempted-fixes -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:307:<!-- /ANCHOR:attempted-fixes -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:309:<!-- ANCHOR:context-for-specialist -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:322:<!-- /ANCHOR:context-for-specialist -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:324:<!-- ANCHOR:recommended-next-steps -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:329:<!-- /ANCHOR:recommended-next-steps -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:331:<!-- ANCHOR:handoff-checklist -->
.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:339:<!-- /ANCHOR:handoff-checklist -->
.opencode/skills/system-spec-kit/scripts/utils/slug-utils.ts:32:  /^table of contents\b/i,
.opencode/skills/system-spec-kit/scripts/test-fixtures/061-template-optional-absent/spec.md:65:| REQ-003 | Optional anchors from the template stay allowed | No extra-anchor warning is emitted |
.opencode/skills/system-spec-kit/scripts/test-fixtures/054-template-extra-header/spec.md:65:| REQ-003 | Optional anchors from the template stay allowed | No extra-anchor warning is emitted |
.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:124:        r"<!-- ANCHOR:smart-routing -->(.*?)<!-- /ANCHOR:smart-routing -->",
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:57:      content: `${shortDecisionContent('title-anchor')}\n<!-- ANCHOR:decision -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:60:      anchor: 'decision',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:65:      content: `${shortDecisionContent('title-anchor')}\n<!-- ANCHOR:decision -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:67:      anchor: 'decision',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:78:      content: `${shortDecisionContent('spec-anchor')}\n<!-- ANCHOR:decision -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:81:      anchor: 'decision',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:86:      content: `${shortDecisionContent('spec-anchor')}\n<!-- ANCHOR:decision -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:88:      anchor: 'decision',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:102:      anchor: 'implementation',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:110:      anchor: 'implementation',
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:59:    const input = '<!-- ANCHOR: state -->\nSome content.';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:60:    expect(stripAnchors(input)).not.toContain('<!-- ANCHOR: state -->');
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:65:    const input = '<!-- /ANCHOR: state -->\nMore content.';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:66:    expect(stripAnchors(input)).not.toContain('<!-- /ANCHOR: state -->');
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:71:    const input = '<!-- ANCHOR:next-steps -->\nDo a thing.\n<!-- /ANCHOR:next-steps -->';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:78:    const input = '<!-- ANCHOR:no-space -->';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:84:    const input = '<!-- anchor: lower -->';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:94:    const input = '<!-- regular comment -->\n<!-- ANCHOR: foo -->';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:125:    const input = '<!-- ANCHOR: foo -->Body<!-- /ANCHOR: foo -->';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:359:    const input = '<!-- ANCHOR: state -->\nState content.\n<!-- /ANCHOR: state -->';
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:427:      '<!-- ANCHOR: state -->',
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:433:      '<!-- /ANCHOR: state -->',
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:435:      '<!-- ANCHOR: decision -->',
.opencode/skills/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:453:      '<!-- /ANCHOR: decision -->',
.opencode/skills/system-spec-kit/scripts/spec/create.sh:616:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/spec/create.sh:620:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1184:        if grep -q "<!-- ANCHOR:phase-map -->" "$PARENT_SPEC"; then
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1215:                /<!-- ANCHOR:phase-map -->/ {
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1228:                in_phase && /<!-- \/ANCHOR:phase-map -->/ && !inserted_handoff {
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1246:<!-- ANCHOR:phase-map -->
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1274:                printf '%s\n' "<!-- /ANCHOR:phase-map -->"
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1365:            _child_phase_context="<!-- ANCHOR:phase-context -->
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1380:<!-- /ANCHOR:phase-context -->"
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1383:                if (index($_, "<!-- ANCHOR:phase-context -->") == -1) {
.opencode/skills/system-spec-kit/scripts/spec/create.sh:1384:                    s/(<!-- \/ANCHOR:metadata -->)/$ENV{PHASE_CHILD_ROWS} . "\n" . $1 . "\n\n---\n\n" . $ENV{PHASE_CHILD_CONTEXT}/e;
.opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh:570:            echo "Fix memory file anchors: ensure each <!-- anchor:id --> has a matching <!-- /anchor:id -->."
.opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh:572:        TOC_POLICY|TOC)
.opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh:573:            echo "Add or update the Table of Contents using the spec-kit TOC format with anchor links."
.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh:107:    # Uses bracketed TOC links (e.g., [CONTINUE SESSION]); scratch/ is temp.
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:39:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:47:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:51:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:76:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:80:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:90:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:94:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:103:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:107:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:116:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:120:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:129:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:176:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:190:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:194:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:206:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:210:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:222:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:226:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:241:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:245:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:262:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:266:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:274:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:278:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:284:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:288:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:293:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:341:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:351:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:355:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:363:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:367:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:384:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:388:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:402:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:406:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:411:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:415:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:422:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:426:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:431:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:478:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:489:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:493:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:499:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:503:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:510:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:514:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:520:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:524:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:530:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:534:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:539:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:586:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:594:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:598:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:604:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:608:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:615:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:619:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:626:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:630:<!-- ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:640:<!-- /ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:644:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:650:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:654:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:660:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:664:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:669:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:673:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:683:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:730:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:738:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:742:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:767:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:771:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:781:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:785:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:794:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:798:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:807:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:811:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:820:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:867:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:881:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:885:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:897:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:901:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:913:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:917:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:932:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:936:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:953:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:957:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:965:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:969:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:975:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:979:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:984:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:991:<!-- ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1006:<!-- /ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1010:<!-- ANCHOR:effort -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1019:<!-- /ANCHOR:effort -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1023:<!-- ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1040:<!-- /ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1088:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1098:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1102:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1110:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1114:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1131:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1135:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1149:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1153:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1158:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1162:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1169:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1173:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1177:<!-- ANCHOR:nfr -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1191:<!-- /ANCHOR:nfr -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1195:<!-- ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1211:<!-- /ANCHOR:edge-cases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1215:<!-- ANCHOR:complexity -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1224:<!-- /ANCHOR:complexity -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1232:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1279:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1290:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1294:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1300:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1304:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1311:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1315:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1321:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1325:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1331:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1335:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1340:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1387:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1395:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1399:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1405:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1409:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1416:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1420:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1427:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1431:<!-- ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1441:<!-- /ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1445:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1451:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1455:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1461:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1465:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1470:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1474:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1484:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1492:<!-- ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1499:<!-- /ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1503:<!-- ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1510:<!-- /ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1514:<!-- ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1522:<!-- /ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1526:<!-- ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1533:<!-- /ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1537:<!-- ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1544:<!-- /ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1548:<!-- ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1556:<!-- /ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1604:<!-- ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1617:<!-- ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1630:<!-- /ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1634:<!-- ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1640:<!-- /ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1644:<!-- ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1653:<!-- /ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1657:<!-- ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1672:<!-- /ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1676:<!-- ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1688:<!-- /ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1692:<!-- ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1700:<!-- /ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1701:<!-- /ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1748:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1756:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1760:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1785:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1789:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1799:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1803:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1812:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1816:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1825:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1829:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1838:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1885:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1899:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1903:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1915:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1919:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1931:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1935:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1950:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1954:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1971:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1975:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1983:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1987:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1993:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:1997:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2002:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2009:<!-- ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2024:<!-- /ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2028:<!-- ANCHOR:effort -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2037:<!-- /ANCHOR:effort -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2041:<!-- ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2058:<!-- /ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2065:<!-- ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2088:<!-- /ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2092:<!-- ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2104:<!-- /ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2108:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2116:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2209:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2219:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2223:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2231:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2235:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2252:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2256:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2270:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2274:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2279:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2283:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2290:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2294:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2366:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2422:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2433:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2437:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2443:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2447:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2454:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2458:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2464:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2468:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2474:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2478:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2483:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2530:<!-- ANCHOR:protocol -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2538:<!-- /ANCHOR:protocol -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2542:<!-- ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2548:<!-- /ANCHOR:pre-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2552:<!-- ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2559:<!-- /ANCHOR:code-quality -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2563:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2570:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2574:<!-- ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2584:<!-- /ANCHOR:fix-completeness -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2588:<!-- ANCHOR:security -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2594:<!-- /ANCHOR:security -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2598:<!-- ANCHOR:docs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2604:<!-- /ANCHOR:docs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2608:<!-- ANCHOR:file-org -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2613:<!-- /ANCHOR:file-org -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2617:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2627:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2635:<!-- ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2642:<!-- /ANCHOR:arch-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2646:<!-- ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2653:<!-- /ANCHOR:perf-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2657:<!-- ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2665:<!-- /ANCHOR:deploy-ready -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2669:<!-- ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2676:<!-- /ANCHOR:compliance-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2680:<!-- ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2687:<!-- /ANCHOR:docs-verify -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2691:<!-- ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2699:<!-- /ANCHOR:sign-off -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2747:<!-- ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2760:<!-- ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2773:<!-- /ANCHOR:adr-001-context -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2777:<!-- ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2783:<!-- /ANCHOR:adr-001-decision -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2787:<!-- ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2796:<!-- /ANCHOR:adr-001-alternatives -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2800:<!-- ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2815:<!-- /ANCHOR:adr-001-consequences -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2819:<!-- ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2831:<!-- /ANCHOR:adr-001-five-checks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2835:<!-- ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2843:<!-- /ANCHOR:adr-001-impl -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2844:<!-- /ANCHOR:adr-001 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2891:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2899:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2903:<!-- ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2928:<!-- /ANCHOR:what-built -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2932:<!-- ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2942:<!-- /ANCHOR:how-delivered -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2946:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2955:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2959:<!-- ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2968:<!-- /ANCHOR:verification -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2972:<!-- ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:2981:<!-- /ANCHOR:limitations -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3028:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3042:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3046:<!-- ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3058:<!-- /ANCHOR:quality-gates -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3062:<!-- ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3074:<!-- /ANCHOR:architecture -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3078:<!-- ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3093:<!-- /ANCHOR:affected-surfaces -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3097:<!-- ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3114:<!-- /ANCHOR:phases -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3118:<!-- ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3126:<!-- /ANCHOR:testing -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3130:<!-- ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3136:<!-- /ANCHOR:dependencies -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3140:<!-- ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3145:<!-- /ANCHOR:rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3152:<!-- ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3167:<!-- /ANCHOR:phase-deps -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3171:<!-- ANCHOR:effort -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3180:<!-- /ANCHOR:effort -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3184:<!-- ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3201:<!-- /ANCHOR:enhanced-rollback -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3208:<!-- ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3231:<!-- /ANCHOR:dependency-graph -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3235:<!-- ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3247:<!-- /ANCHOR:critical-path -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3251:<!-- ANCHOR:milestones -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3259:<!-- /ANCHOR:milestones -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3285:<!-- ANCHOR:ai-execution -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3306:<!-- /ANCHOR:ai-execution -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3310:<!-- ANCHOR:workstreams -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3332:<!-- /ANCHOR:workstreams -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3336:<!-- ANCHOR:communication -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3348:<!-- /ANCHOR:communication -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3422:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3432:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3436:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3444:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3448:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3465:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3469:<!-- ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3483:<!-- /ANCHOR:requirements -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3487:<!-- ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3492:<!-- /ANCHOR:success-criteria -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3496:<!-- ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3503:<!-- /ANCHOR:risks -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3507:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3565:<!-- ANCHOR:approval-workflow -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3574:<!-- /ANCHOR:approval-workflow -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3578:<!-- ANCHOR:compliance-checkpoints -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3589:<!-- /ANCHOR:compliance-checkpoints -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3593:<!-- ANCHOR:stakeholder-matrix -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3600:<!-- /ANCHOR:stakeholder-matrix -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3604:<!-- ANCHOR:change-log -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3609:<!-- /ANCHOR:change-log -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3634:<!-- /ANCHOR:questions -->"
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3672:<!-- ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3683:<!-- /ANCHOR:notation -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3687:<!-- ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3693:<!-- /ANCHOR:phase-1 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3697:<!-- ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3704:<!-- /ANCHOR:phase-2 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3708:<!-- ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3714:<!-- /ANCHOR:phase-3 -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3718:<!-- ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3724:<!-- /ANCHOR:completion -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3728:<!-- ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3733:<!-- /ANCHOR:cross-refs -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3787:<!-- ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3802:<!-- /ANCHOR:metadata -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3806:<!-- ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3816:<!-- /ANCHOR:problem -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3820:<!-- ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3835:<!-- /ANCHOR:scope -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3839:<!-- ANCHOR:phase-map -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3860:<!-- /ANCHOR:phase-map -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3864:<!-- ANCHOR:questions -->
.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:3869:<!-- /ANCHOR:questions -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:17:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:19:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:21:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:24:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:34:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:42:<!-- ANCHOR:invalid!id@here -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:44:<!-- /ANCHOR:invalid!id@here -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:49:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:51:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:53:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:55:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:369:<!-- ANCHOR:simple -->content<!-- /ANCHOR:simple -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:370:<!-- ANCHOR:with-hyphens -->content<!-- /ANCHOR:with-hyphens -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:371:<!-- ANCHOR:spec-folder/section -->content<!-- /ANCHOR:spec-folder/section -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:372:<!-- ANCHOR:001-numbered -->content<!-- /ANCHOR:001-numbered -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:373:<!-- ANCHOR:CamelCase123 -->content<!-- /ANCHOR:CamelCase123 -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:385:<!-- ANCHOR:unique1 -->First unique<!-- /ANCHOR:unique1 -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:386:<!-- ANCHOR:unique2 -->Second unique<!-- /ANCHOR:unique2 -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:387:<!-- ANCHOR:unique1 -->Duplicate of first<!-- /ANCHOR:unique1 -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:402:<!-- ANCHOR:test-section -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:404:<!-- /ANCHOR:test-section -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:413:<!-- anchor:lowercase -->content<!-- /ANCHOR:lowercase -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:414:<!-- ANCHOR:uppercase -->content<!-- /anchor:uppercase -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:423:<!-- ANCHOR:closed-ok -->This is closed properly<!-- /ANCHOR:closed-ok -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:424:<!-- ANCHOR:never-closed -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:706:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/preflight.vitest.ts:708:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:648:      a.includes('<!-- ANCHOR:')
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts:54:    '<!-- ANCHOR:what-built -->',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts:59:    '<!-- /ANCHOR:what-built -->',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts:106:      targetAnchor: 'what-built',
.opencode/skills/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:48:    content: content ?? '<!-- ANCHOR:state -->\n## State\n\nThis is the current project state with meaningful content describing the architecture and decisions made during implementation.\n<!-- /ANCHOR:state -->',
.opencode/skills/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:74:    content: '<!-- This is a comment -->\n<!-- Another comment -->\n<!-- ANCHOR:foo --><!-- /ANCHOR:foo -->',
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:83:<!-- ANCHOR:overview -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:86:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:87:<!-- ANCHOR:topic -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:90:<!-- /ANCHOR:topic -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:91:<!-- ANCHOR:key-questions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:94:<!-- /ANCHOR:key-questions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:95:<!-- ANCHOR:non-goals -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:98:<!-- /ANCHOR:non-goals -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:99:<!-- ANCHOR:stop-conditions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:102:<!-- /ANCHOR:stop-conditions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:103:<!-- ANCHOR:answered-questions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:106:<!-- /ANCHOR:answered-questions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:108:<!-- ANCHOR:what-worked -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:111:<!-- /ANCHOR:what-worked -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:112:<!-- ANCHOR:what-failed -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:115:<!-- /ANCHOR:what-failed -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:116:<!-- ANCHOR:exhausted-approaches -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:119:<!-- /ANCHOR:exhausted-approaches -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:120:<!-- ANCHOR:ruled-out-directions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:123:<!-- /ANCHOR:ruled-out-directions -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:124:<!-- ANCHOR:next-focus -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:127:<!-- /ANCHOR:next-focus -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:129:<!-- ANCHOR:known-context -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:132:<!-- /ANCHOR:known-context -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:133:<!-- ANCHOR:research-boundaries -->
.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:139:<!-- /ANCHOR:research-boundaries -->
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:220:          '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:226:          '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:228:          '<!-- ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:235:          '<!-- /ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:237:          '<!-- ANCHOR:overview -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:243:          '<!-- /ANCHOR:overview -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:245:          '<!-- ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:253:          '<!-- /ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:255:          '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:261:          '<!-- /ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:263:          '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:271:          '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:323:        `<!-- ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:327:        `<!-- /ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1693:        '<!-- /ANCHOR:phase-3 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1694:        '- [ ] T002 Duplicate routed save behavior.\n<!-- /ANCHOR:phase-3 -->',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1832:                target_anchor: 'what-built',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1889:                target_anchor: 'what-built',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1944:                target_anchor: 'how-delivered',
.opencode/skills/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts:49:    `<!-- ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts:54:    `<!-- /ANCHOR:${anchor.id} -->`,
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:246:        anchor: a,
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:251:        { anchor: 'summary', key: 'summary' },
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:252:        { anchor: 'state', key: 'state-session-123' },
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:253:        { anchor: 'decisions', key: 'decisions-session-456' },
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:254:        { anchor: 'next-steps', key: 'next-steps' },
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:255:        { anchor: 'missing', key: undefined },
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:355:    expect(res.content).toContain('<!-- ANCHOR:summary -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:357:    expect(res.content).toContain('<!-- /ANCHOR:summary -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:368:    expect(res.content).toContain('<!-- ANCHOR:summary-session-1770903150838-003 -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:393:    expect(res.content).toContain('<!-- ANCHOR:summary -->');
.opencode/skills/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:394:    expect(res.content).toContain('<!-- ANCHOR:state-session-123 -->');
.opencode/skills/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:31:      likely_phase_anchor: 'phase-2',
.opencode/skills/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:103:      target_anchor: 'how-delivered',
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:575:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:578:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:580:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:583:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:586:    const openPattern = /<!-- ANCHOR:([a-zA-Z0-9_-]+)/g;
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:587:    const closePattern = /<!-- \/ANCHOR:([a-zA-Z0-9_-]+)/g;
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:618:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:622:<!-- ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:625:<!-- /ANCHOR:decisions -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:657:<!-- /ANCHOR:orphan -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:690:<!-- ANCHOR:outer -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:692:<!-- ANCHOR:inner -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:694:<!-- /ANCHOR:inner -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:695:<!-- /ANCHOR:outer -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:720:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:722:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:724:<!-- ANCHOR:summary -->
.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:726:<!-- /ANCHOR:summary -->
.opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:207:    r => r.why?.topSignals?.some(s => s.startsWith('anchor:'))
.opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:244:    const hasAnchor = signals.some(s => s.startsWith('anchor:'));
.opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:246:      .filter(s => s.startsWith('anchor:'))
.opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:247:      .map(s => s.slice('anchor:'.length));
.opencode/skills/system-spec-kit/scripts/tests/test-utils.js:43:      anchor: null,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:128:const ADR_ANCHOR_RE = /<!--\s*ANCHOR:\s*adr-(\d{3})\s*-->/gi;
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:793:    `<!-- ANCHOR:${args.adrId} -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:800:    `<!-- ANCHOR:${args.adrId}-context -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:804:    `<!-- /ANCHOR:${args.adrId}-context -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:806:    `<!-- ANCHOR:${args.adrId}-decision -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:810:    `<!-- /ANCHOR:${args.adrId}-decision -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:812:    `<!-- ANCHOR:${args.adrId}-consequences -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:816:    `<!-- /ANCHOR:${args.adrId}-consequences -->`,
.opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:817:    `<!-- /ANCHOR:${args.adrId} -->`,
.opencode/skills/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:61:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:38:    '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:43:    '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:45:    '<!-- ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:51:    '<!-- /ANCHOR:canonical-docs -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:53:    '<!-- ANCHOR:overview -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:58:    '<!-- /ANCHOR:overview -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:60:    '<!-- ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:67:    '<!-- /ANCHOR:evidence -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:69:    '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:74:    '<!-- /ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:76:    '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:83:    '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:116:      buildValidMemory().replace('<!-- ANCHOR:canonical-docs -->\n', '')
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:141:          '## TABLE OF CONTENTS',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:183:      '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:206:        buildValidMemory().replace(/<!-- ANCHOR:canonical-docs -->[\s\S]*?<!-- \/ANCHOR:canonical-docs -->/m, '')
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:215:        buildValidMemory().replace(/<!-- ANCHOR:overview -->[\s\S]*?<!-- \/ANCHOR:overview -->/m, '')
.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:224:        buildValidMemory().replace(/<!-- ANCHOR:evidence -->[\s\S]*?<!-- \/ANCHOR:evidence -->/m, '')
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:106:      '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:108:      '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:110:      '<!-- ANCHOR:problem -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:112:      '<!-- /ANCHOR:problem -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:114:      '<!-- ANCHOR:requirements -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:116:      '<!-- /ANCHOR:requirements -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:118:      '<!-- ANCHOR:scope -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:120:      '<!-- /ANCHOR:scope -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:122:      '<!-- ANCHOR:risks -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:124:      '<!-- /ANCHOR:risks -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:126:      '<!-- ANCHOR:questions -->',
.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:128:      '<!-- /ANCHOR:questions -->',
.opencode/skills/system-spec-kit/scripts/tests/test-phase-system.js:169:    const phaseMapCount = countOccurrences(parentSpec, '<!-- ANCHOR:phase-map -->');
.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:141:    '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:146:    '<!-- ANCHOR:project-state-snapshot -->',
.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:151:    '<!-- ANCHOR:decisions -->',
.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:156:    '<!-- ANCHOR:session-history -->',
.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:161:    '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:166:    '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:173:    '<!-- /ANCHOR:metadata -->',
.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/002-decision-provenance-audit-graph-vs-baseline.md:20:> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-028 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.
.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/001-unresolved-disagreement-triage-graph-vs-baseline.md:20:> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-027 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.
.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/006-mid-run-interruption-recovery-graph-vs-baseline.md:20:> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-032 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.
.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/004-stalled-council-blocker-ranking-graph-vs-baseline.md:20:> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-030 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.
.opencode/skills/system-spec-kit/scripts/tests/test-scripts-modules.js:188:    const validContent = '<!-- ANCHOR:test -->content<!-- /ANCHOR:test -->';
.opencode/skills/system-spec-kit/scripts/tests/test-scripts-modules.js:196:    const unclosedContent = '<!-- ANCHOR:test -->content';
.opencode/skills/system-spec-kit/scripts/tests/test-scripts-modules.js:2267:    const validContent = '<!-- ANCHOR:test -->content<!-- /ANCHOR:test -->';
.opencode/skills/system-spec-kit/scripts/tests/test-scripts-modules.js:2276:    const unclosedContent = '<!-- ANCHOR:unclosed -->content without close';
.opencode/skills/system-spec-kit/scripts/tests/test-scripts-modules.js:2285:    const orphanedContent = 'content<!-- /ANCHOR:orphan -->';
.opencode/skills/system-spec-kit/scripts/tests/test-scripts-modules.js:2294:    const multiContent = '<!-- ANCHOR:one -->a<!-- /ANCHOR:one --><!-- ANCHOR:two -->b<!-- /ANCHOR:two -->';
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:91:<!-- ANCHOR:overview -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:94:<!-- /ANCHOR:overview -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:95:<!-- ANCHOR:topic -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:98:<!-- /ANCHOR:topic -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:99:<!-- ANCHOR:key-questions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:104:<!-- /ANCHOR:key-questions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:105:<!-- ANCHOR:non-goals -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:108:<!-- /ANCHOR:non-goals -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:109:<!-- ANCHOR:stop-conditions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:112:<!-- /ANCHOR:stop-conditions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:113:<!-- ANCHOR:answered-questions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:116:<!-- /ANCHOR:answered-questions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:118:<!-- ANCHOR:what-worked -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:121:<!-- /ANCHOR:what-worked -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:122:<!-- ANCHOR:what-failed -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:125:<!-- /ANCHOR:what-failed -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:126:<!-- ANCHOR:exhausted-approaches -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:129:<!-- /ANCHOR:exhausted-approaches -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:130:<!-- ANCHOR:ruled-out-directions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:133:<!-- /ANCHOR:ruled-out-directions -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:134:<!-- ANCHOR:next-focus -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:137:<!-- /ANCHOR:next-focus -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:139:<!-- ANCHOR:known-context -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:142:<!-- /ANCHOR:known-context -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:143:<!-- ANCHOR:research-boundaries -->
.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:146:<!-- /ANCHOR:research-boundaries -->
.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/005-hot-topic-discovery-graph-vs-baseline.md:20:> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-031 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:138:        lines.push(`<!-- ANCHOR:${section.anchorId} -->`);
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:142:        lines.push(`<!-- /ANCHOR:${section.anchorId} -->`);
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:188:    '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:194:    '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:196:    '<!-- ANCHOR:overview -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:202:    '<!-- /ANCHOR:overview -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:204:    '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:211:    '<!-- /ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:213:    '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:222:    '<!-- /ANCHOR:metadata -->',
.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md:20:> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-029 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.
.opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:151:        '<!-- ANCHOR:review-dimensions -->',
.opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:157:        '<!-- /ANCHOR:review-dimensions -->',
.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:311:    const testContent = '<!-- ANCHOR:test -->content<!-- /ANCHOR:test -->';
.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:314:    expect(cleaned).toContain('<!-- ANCHOR:test -->');
.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:315:    expect(cleaned).toContain('<!-- /ANCHOR:test -->');
.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:321:    const badContent = '<!-- ANCHOR:unclosed -->content';
.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:324:    expect(cleaned).toContain('<!-- ANCHOR:unclosed -->');
.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:325:    expect(cleaned).not.toContain('<!-- /ANCHOR:unclosed -->');
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:41:                lines.push(`<!-- ANCHOR:${section.anchorId} -->`);
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:45:                lines.push(`<!-- /ANCHOR:${section.anchorId} -->`);
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:85:        '<!-- ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:91:        '<!-- /ANCHOR:continue-session -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:93:        '<!-- ANCHOR:overview -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:99:        '<!-- /ANCHOR:overview -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:101:        '<!-- ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:108:        '<!-- /ANCHOR:recovery-hints -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:110:        '<!-- ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:119:        '<!-- /ANCHOR:metadata -->',
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:28:    "## Table of Contents",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:33:    "<!-- ANCHOR:overview -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:40:    "<!-- /ANCHOR:overview -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json:3:  "sessionSummary": "Phase 1 foundation work focused on two narrow repairs that improve memory quality without widening the remediation packet into unrelated metadata or reviewer behavior. The first repair aligned the OVERVIEW anchor identity so the table of contents, the HTML anchor, and the internal comment marker all point to the same destination. The second repair extracted a shared truncation helper so long session summaries stop at a clean word boundary and carry the canonical Unicode ellipsis instead of drifting between punctuation styles. The fixture describes a realistic verification pass where the helper was reused by the observation summary path, the OVERVIEW owner adopted the same contract, the compiled CLI replay was exercised with explicit JSON input, and the temporary replay artifacts were removed immediately after the check so the packet memory store stayed clean for the real documentation workflow.",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:28:    "## Table of Contents",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:33:    "<!-- ANCHOR:summary -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:38:    "<!-- /ANCHOR:summary -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:28:    "## Table of Contents",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:33:    "<!-- ANCHOR:overview -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:40:    "<!-- /ANCHOR:overview -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:28:    "## Table of Contents",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:33:    "<!-- ANCHOR:overview -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:38:    "<!-- /ANCHOR:overview -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:28:    "## Table of Contents",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:33:    "<!-- ANCHOR:overview -->",
.opencode/skills/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:40:    "<!-- /ANCHOR:overview -->",
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:133:<!-- ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:134:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:147:<!-- /ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:151:<!-- ANCHOR:headline-overview -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:170:<!-- /ANCHOR:headline-overview -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:174:<!-- ANCHOR:aggregate-results -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:189:<!-- /ANCHOR:aggregate-results -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:193:<!-- ANCHOR:methodology -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:226:<!-- /ANCHOR:methodology -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:230:<!-- ANCHOR:per-candidate-profiles -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:255:<!-- /ANCHOR:per-candidate-profiles -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:259:<!-- ANCHOR:process-notes -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:265:<!-- /ANCHOR:process-notes -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:269:<!-- ANCHOR:findings -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:304:<!-- /ANCHOR:findings -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:308:<!-- ANCHOR:caveats -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:316:<!-- /ANCHOR:caveats -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:320:<!-- ANCHOR:recommendations -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:343:<!-- /ANCHOR:recommendations -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:347:<!-- ANCHOR:reproducibility -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:365:<!-- /ANCHOR:reproducibility -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:369:<!-- ANCHOR:related-resources -->
.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py:378:<!-- /ANCHOR:related-resources -->

exec
/bin/zsh -lc 'git diff 1e58d845af''^ 1e58d845af -- .opencode/commands/create/README.txt .opencode/commands/create/assets/create_folder_readme_auto.yaml .opencode/commands/create/assets/create_folder_readme_confirm.yaml | sed -n '"'1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1305ms:
2026-05-26 12:51:27.426 xcodebuild[97524:53759984]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:27.526 xcodebuild[97524:53759983] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-GpNXCkhz' (errno=Operation not permitted)
2026-05-26 12:51:27.860 xcodebuild[97534:53760023]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:27.968 xcodebuild[97534:53760022] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
diff --git a/.opencode/commands/create/README.txt b/.opencode/commands/create/README.txt
index ab6d90d44a..b97f0c7f07 100644
--- a/.opencode/commands/create/README.txt
+++ b/.opencode/commands/create/README.txt
@@ -18,24 +18,6 @@ trigger_phrases:
 
 ---
 
-<!-- ANCHOR:table-of-contents -->
-## TABLE OF CONTENTS
-
-- [1. OVERVIEW](#1--overview)
-- [2. PURPOSE](#2--purpose)
-- [3. COMMANDS](#3--commands)
-- [4. STRUCTURE](#4--structure)
-- [5. INSTRUCTIONS](#5--instructions)
-- [6. EXECUTION MODES](#6--execution-modes)
-- [7. USAGE EXAMPLES](#7--usage-examples)
-- [8. FAQ](#8--faq)
-- [9. TROUBLESHOOTING](#9--troubleshooting)
-- [10. RELATED DOCUMENTS](#10--related-documents)
-
-<!-- /ANCHOR:table-of-contents -->
-
----
-
 <!-- ANCHOR:overview -->
 ## 1. OVERVIEW
 
diff --git a/.opencode/commands/create/assets/create_folder_readme_auto.yaml b/.opencode/commands/create/assets/create_folder_readme_auto.yaml
index 0a2b6a2e70..099995d24e 100644
--- a/.opencode/commands/create/assets/create_folder_readme_auto.yaml
+++ b/.opencode/commands/create/assets/create_folder_readme_auto.yaml
@@ -11,7 +11,7 @@
 # ─────────────────────────────────────────────────────────────────
 role: Expert Documentation Creator using sk-doc skill
 purpose: Create comprehensive README files and AI-first installation guides with proper structure and AI-optimization
-action: Generate scannable, well-organized documentation (README or Install Guide) with table of contents
+action: Generate scannable, well-organized documentation (README or Install Guide) with proper structure
 
 # ─────────────────────────────────────────────────────────────────
 # PREREQUISITE: @markdown AGENT VERIFICATION
@@ -203,7 +203,7 @@ workflow_enforcement:
         enforcement: "MUST gather project information before writing"
         verification: "Self-validate features are identified and concrete"
       step_4_generation:
-        enforcement: "MUST use template structure with TOC, section formatting, tables"
+        enforcement: "MUST use template structure with section formatting, tables"
         verification: "All sections written, no placeholder content"
       step_5_validation:
         enforcement: "MUST verify structure and completeness"
@@ -276,7 +276,7 @@ quality_standards:
   dqi_enforcement: FLEXIBLE
   validation_pipeline:
     readme:
-      stage_1: "Structural check (title, TOC, sections, separators)"
+      stage_1: "Structural check (title, sections, separators)"
       stage_2: "Content check (code blocks, tables, no placeholders)"
     install_guide:
       stage_1: "Verify all 11 sections present"
@@ -447,7 +447,6 @@ readme_template_references:
   anchor_rules: "readme_template.md §12 (Anchor Templates)"
   writing_patterns: "readme_template.md §6 (Writing Patterns)"
   style_guide: "readme_template.md §7 (Style Reference)"
-  toc_format: "readme_template.md §5.1 (Table of Contents)"
   badge_shields: "readme_template.md §8 (Badge Shields)"
   before_after_patterns: "readme_template.md §6.4 (Before/After)"
   architecture_diagrams: "readme_template.md §6.5 (Architecture Diagrams)"
@@ -527,7 +526,6 @@ readme_workflow:
     core_pattern:
       all_types:
       - "Title + Tagline (one-liner description)"
-      - "TABLE OF CONTENTS (numbered, linked)"
       - "Numbered sections"
       - "Tables for structured data"
       - "Code blocks with language tags"
@@ -553,7 +551,6 @@ readme_workflow:
     purpose: Write comprehensive README following selected structure
     activities:
     - Write Title + Tagline (concise, clear value proposition)
-    - Generate TABLE OF CONTENTS (numbered, linked to sections)
     - Write each section
     - Create tables for structured data (features, commands, config)
     - Add code blocks with language tags
@@ -562,7 +559,6 @@ readme_workflow:
     - Write to target_path
     quality_requirements:
       title: "Clear, concise value proposition"
-      toc: "Numbered, linked to actual sections"
       sections: "Section headers - numbered format recommended"
       tables: "For structured data (features, commands, config)"
       code_blocks: "Always specify language"
@@ -577,14 +573,13 @@ readme_workflow:
   step_5_validation:
     purpose: Verify README quality and completeness
     activities:
-    - Structure check (title, TOC, sections, separators)
+    - Structure check (title, sections, separators)
     - Content check (code blocks, tables, no placeholders, valid links)
     - Completeness check (Quick Start, Troubleshooting, FAQ for component/skill)
     - DQI check if script available
     validation_checklist:
       structure:
       - "Title + one-liner tagline present"
-      - "TABLE OF CONTENTS present and linked"
       - "All sections numbered"
       - "Horizontal rules between sections"
       content:
@@ -744,7 +739,6 @@ readme_completion_report:
 
     Structure:
     - Title + Tagline: ✅
-    - TABLE OF CONTENTS: ✅
     - Sections: [N] numbered
     - Tables: [N]
     - Code blocks: [N]
@@ -1006,7 +1000,6 @@ install_guide_workflow:
     activities:
     - Write AI-First prompt section (copy-paste prompt)
     - Write title and overview with architecture diagram
-    - Create TABLE OF CONTENTS with links
     - Write all 11 sections (9 required + 2 optional)
     - Add platform-specific configuration (Claude Code, OpenCode)
     - Create Quick Reference at end
@@ -1028,7 +1021,7 @@ install_guide_workflow:
     purpose: Verify guide quality and completeness
     activities:
     - AI-First section check (prompt complete, placeholders marked, AI actions listed)
-    - Structure check (all 11 sections, TOC links, ASCII diagram, comparison table)
+    - Structure check (all 11 sections, ASCII diagram, comparison table)
     - Command verification (syntax correct, versions accurate, platform-specific)
     - Completeness check (all platforms covered, 5+ troubleshooting issues, practical examples)
     - DQI check if script available
@@ -1040,7 +1033,6 @@ install_guide_workflow:
       - "Expected setup time is realistic"
       structure:
       - "All 11 sections present (0-10)"
-      - "TABLE OF CONTENTS links work"
       - "ASCII diagram in Overview"
       - "Comparison table included"
       commands:
@@ -1212,21 +1204,6 @@ install_guide_templates:
 
     ---
 
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
     ## 1. OVERVIEW
 
     [2-3 paragraphs explaining what the project is and why to use it]
@@ -1617,7 +1594,6 @@ rules:
   - "Self-validate at each step before proceeding"
   - "Load templates before creating content"
   - "Include Quick Start / AI-First section with clear examples"
-  - "Create table of contents with proper anchor links"
   - "Use section formatting"
   - "Validate structure before claiming complete"
   - "Include troubleshooting section"
@@ -1631,7 +1607,6 @@ rules:
   readme_ALWAYS:
   - "Load readme_template.md before creating content"
   - "Include Quick Start section with clear examples"
-  - "Create table of contents with proper anchor links"
   - "Validate structure before claiming complete"
   readme_NEVER:
   - "Omit troubleshooting section"
diff --git a/.opencode/commands/create/assets/create_folder_readme_confirm.yaml b/.opencode/commands/create/assets/create_folder_readme_confirm.yaml
index 119cc4ece5..afa9e53371 100644
--- a/.opencode/commands/create/assets/create_folder_readme_confirm.yaml
+++ b/.opencode/commands/create/assets/create_folder_readme_confirm.yaml
@@ -14,7 +14,7 @@
 # ─────────────────────────────────────────────────────────────────
 role: Expert Documentation Creator using sk-doc skill
 purpose: Create comprehensive README files and AI-first installation guides with proper structure and optimization
-action: Generate scannable, well-organized documentation (README or Install Guide) with table of contents
+action: Generate scannable, well-organized documentation (README or Install Guide) with proper structure
 
 # ─────────────────────────────────────────────────────────────────
 # PREREQUISITE: @markdown AGENT VERIFICATION
@@ -177,7 +177,7 @@ workflow_enforcement:
       enforcement: "MUST gather project information before writing"
       verification: "Cannot proceed without identified features"
     step_4_generation:
-      enforcement: "MUST use template structure with TOC, sections, tables"
+      enforcement: "MUST use template structure with sections, tables"
       verification: "All sections written, no placeholder content"
     step_5_validation:
       enforcement: "MUST verify structure and completeness"
@@ -233,7 +233,7 @@ quality_standards:
   dqi_minimum: 70
   dqi_enforcement: FLEXIBLE
   validation_pipeline:
-    stage_1: "Structural check (title, TOC, sections, separators)"
+    stage_1: "Structural check (title, sections, separators)"
     stage_2: "Content check (code blocks, tables, no placeholders)"
   template_adherence: required
   core_standards_reference: ".opencode/skills/sk-doc/references/global/core_standards.md"
@@ -400,7 +400,6 @@ readme_template_references:
   anchor_rules: "readme_template.md S12 (Anchor Templates)"
   writing_patterns: "readme_template.md S6 (Writing Patterns)"
   style_guide: "readme_template.md S7 (Style Reference)"
-  toc_format: "readme_template.md S5.1 (Table of Contents)"
   badge_shields: "readme_template.md S8 (Badge Shields)"
   before_after_patterns: "readme_template.md S6.4 (Before/After)"
   architecture_diagrams: "readme_template.md S6.5 (Architecture Diagrams)"
@@ -492,7 +491,6 @@ readme_workflow:
     core_pattern:
       all_types:
       - "Title + Tagline (one-liner description)"
-      - "TABLE OF CONTENTS (numbered, linked)"
       - "Numbered sections"
       - "Tables for structured data"
       - "Code blocks with language tags"
@@ -521,7 +519,6 @@ readme_workflow:
     purpose: Write comprehensive README following selected structure
     activities:
     - Write Title + Tagline (concise, clear value proposition)
-    - Generate TABLE OF CONTENTS (numbered, linked to sections)
     - Write each section
     - Create tables for structured data (features, commands, config)
     - Add code blocks with language tags
@@ -530,7 +527,6 @@ readme_workflow:
     - Write to target_path
     quality_requirements:
       title: "Clear, concise value proposition"
-      toc: "Numbered, linked to actual sections"
       sections: "Numbered sections"
       tables: "For structured data (features, commands, config)"
       code_blocks: "Always specify language"
@@ -546,22 +542,19 @@ readme_workflow:
       options:
       - label: "A) Show full content"
         description: "Display complete README"
-      - label: "B) Show TABLE OF CONTENTS"
-        description: "Display section structure"
-      - label: "C) Proceed"
+      - label: "B) Proceed"
         description: "Continue to validation"
 
   step_5_validation:
     purpose: Verify README quality and completeness
     activities:
-    - Structure check (title, TOC, sections, separators)
+    - Structure check (title, sections, separators)
     - Content check (code blocks, tables, no placeholders, valid links)
     - Completeness check (Quick Start, Troubleshooting, FAQ for component/skill)
     - DQI check if script available

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/assets/readme/readme_template.md | sed -n '60,90p;280,305p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    60	
    61	## 3. SKILL AND PROJECT PROFILE
    62	
    63	Use this profile for OpenCode skills, package roots and project-level READMEs that need more than a bare overview.
    64	
    65	| Profile Block | Good For | Keep It Short By |
    66	|---|---|---|
    67	| `trigger_phrases` | Search, memory and skill routing | 3-8 concrete phrases |
    68	| Key Statistics | Skill counts, tool counts, version facts | Use one compact table |
    69	| How This Compares | Neighboring skills or tools | Compare only reader-relevant differences |
    70	| Key Features | Current capability inventory | Group related features |
    71	| Requirements | Tooling and runtime needs | Separate required from optional |
    72	| Related Skills | Skill graph navigation | Group by relationship type |
    73	| Related Documents | Operator or developer references | Link stable docs, not packet history |
    74	| FAQ | Repeated questions | 3-6 high-value Q&A pairs |
    75	
    76	Optional HTML anchors help memory and extraction tools find stable sections. Use them only around long-lived sections.
    77	
    78	```markdown
    79	## 1. OVERVIEW
    80	
    81	[Section content]
    82	
    83	```
    84	
    85	---
    86	
    87	## 4. WRITING RULES
    88	
    89	Write for scanning first.
    90	
   280	
   281	````
   282	
   283	---
   284	
   285	## 7. VALIDATION CHECKLIST
   286	
   287	- [ ] README type is correct. Code folders use `readme_code_template.md`.
   288	- [ ] Included sections match the audience and task.
   289	- [ ] No empty sections remain.
   290	- [ ] Commands were tested or marked as examples.
   291	- [ ] Links use correct relative paths.
   292	- [ ] Frontmatter is valid if present.
   293	- [ ] Optional anchors wrap only stable sections.
   294	- [ ] HVR passes: no em dashes, semicolons, banned words or setup phrases.
   295	
   296	---
   297	
   298	## 8. RELATED RESOURCES
   299	
   300	- [`readme_code_template.md`](./readme_code_template.md) - Code-folder README scaffold.
   301	- [`readme_creation.md`](../../references/readme_creation.md) - README workflow and quality criteria.
   302	- [`core_standards.md`](../../references/global/core_standards.md) - Markdown formatting rules.
   303	- [`validation.md`](../../references/global/validation.md) - Document validation and DQI scoring.
   304	- [`hvr_rules.md`](../../references/global/hvr_rules.md) - Human Voice Rules.

exec
/bin/zsh -lc "rg -n -i 'anchor templates|section anchors|anchor_rules|optional anchors|must include.*anchor|minimum_anchors|table of contents|tocRequired|toc:|toc_' .opencode/skills/sk-doc .opencode/commands/create -g '"'!sk-doc/scripts/tests/**'"' -g '"'!system-spec-kit/templates/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/commands/create/folder_readme.md:471:├─ MUST NOT include a Table of Contents or <!-- ANCHOR --> comments
.opencode/commands/create/folder_readme.md:477:├─ MUST confirm no Table of Contents was added
.opencode/skills/sk-doc/README.md:273:|#   "violations": ["missing_toc_anchor", "h2_missing_emoji"]
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:12:# Note: Documents should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:400:  anchor_rules: "readme_template.md S12 (Anchor Templates)"
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:663:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:1208:      minimum_anchors: 2
.opencode/commands/create/assets/create_feature_catalog_auto.yaml:163:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_agent_confirm.yaml:678:      minimum_anchors: 2
.opencode/skills/sk-doc/references/readme_creation.md:188:**Table of Contents**: Do not add a Table of Contents. READMEs rely on their numbered H2 heading hierarchy for navigation; no TOC block and no `<!-- ANCHOR -->` navigation comments are used.
.opencode/skills/sk-doc/references/readme_creation.md:315:- [ ] No Table of Contents and no `<!-- ANCHOR -->` navigation comments
.opencode/skills/sk-doc/references/feature_catalog_creation.md:25:- no Table of Contents and no `<!-- ANCHOR -->` navigation comments
.opencode/commands/create/assets/create_agent_auto.yaml:584:      minimum_anchors: 2
.opencode/commands/create/assets/create_testing_playbook_auto.yaml:165:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml:179:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml:177:    - numbered all-caps H2 sections (no Table of Contents)
.opencode/commands/create/assets/create_folder_readme_auto.yaml:9:# Note: Documentation files should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_auto.yaml:447:  anchor_rules: "readme_template.md §12 (Anchor Templates)"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:663:      minimum_anchors: 2
.opencode/commands/create/assets/create_folder_readme_auto.yaml:1116:      minimum_anchors: 2
.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:482:- [ ] Main playbook has frontmatter and H1 intro (no Table of Contents)
.opencode/skills/sk-doc/scripts/validate_document.py:233:    """Validate TABLE OF CONTENTS section."""
.opencode/skills/sk-doc/scripts/validate_document.py:236:    if not doc_type_rules.get('tocRequired', False):
.opencode/skills/sk-doc/scripts/validate_document.py:240:    # Pattern: ## [optional emoji] TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/validate_document.py:241:    toc_match = re.search(
.opencode/skills/sk-doc/scripts/validate_document.py:242:        r'## (?:[^\w\s]\s+)?TABLE OF CONTENTS\s*\n(.*?)(?=\n---|\n## |\Z)',
.opencode/skills/sk-doc/scripts/validate_document.py:247:    if not toc_match:
.opencode/skills/sk-doc/scripts/validate_document.py:251:            'message': 'Missing TABLE OF CONTENTS section',
.opencode/skills/sk-doc/scripts/validate_document.py:252:            'fix_hint': 'Add "## TABLE OF CONTENTS" section with linked entries'
.opencode/skills/sk-doc/scripts/validate_document.py:256:    toc_content = toc_match.group(1)
.opencode/skills/sk-doc/scripts/validate_document.py:258:    for line_num, line in enumerate(toc_content.strip().split('\n'), start=1):
.opencode/skills/sk-doc/scripts/validate_document.py:267:                'type': 'toc_single_dash_anchor',
.opencode/skills/sk-doc/scripts/validate_document.py:294:                    'type': 'toc_not_uppercase',
.opencode/skills/sk-doc/scripts/extract_structure.py:673:    ('no_toc', 'No table of contents', lambda fm, h, c: not any('TABLE OF CONTENTS' in heading['text'].upper() or 'TOC' == heading['text'].upper() for heading in h)),
.opencode/skills/sk-doc/scripts/extract_structure.py:682:    ('has_toc', 'Has TABLE OF CONTENTS section', lambda fm, h, c: any('TABLE OF CONTENTS' in heading['text'].upper() or heading['text'].upper() == 'TOC' for heading in h)),
.opencode/skills/sk-doc/scripts/extract_structure.py:683:    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2 and 'TABLE OF CONTENTS' not in heading['text'].upper()) if any(heading['level'] == 2 for heading in h) else True),
.opencode/skills/sk-doc/references/global/validation.md:116:- ✅ `no_toc` - No table of contents section
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:217:- Use numbered all-caps H2 section headers in the root catalog. Do not add a Table of Contents.
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:229:- [ ] Root catalog uses numbered all-caps H2 section headers (no Table of Contents)
.opencode/skills/sk-doc/assets/readme/readme_template.md:293:- [ ] Optional anchors wrap only stable sections.
.opencode/skills/sk-doc/references/global/core_standards.md:80:- ❌ **NEVER** add a Table of Contents to any document type. Tables of Contents and `<!-- ANCHOR -->` navigation comments are not used in skill documentation.
.opencode/skills/sk-doc/references/global/core_standards.md:284:TOC: Never
.opencode/skills/sk-doc/assets/skill/skill_asset_template.md:583:      require_toc_when: "lines > 100"
.opencode/skills/sk-doc/scripts/tests/valid_install_guide.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/valid_readme.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/valid_readme.md:17:- Has TABLE OF CONTENTS section
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:59:- ✅ No table of contents (forbidden in SKILL.md)
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1078:□ No table of contents (forbidden in SKILL.md)
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1128:| **TOC**               | Forbidden in SKILL.md      | ❌ No table of contents                                                                             |
.opencode/skills/sk-doc/scripts/tests/missing_toc.md:3:> README missing TABLE OF CONTENTS section (blocking error)
.opencode/skills/sk-doc/scripts/tests/missing_toc.md:9:This README is missing the TABLE OF CONTENTS section.
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:17:Should trigger `toc_single_dash_anchor` error.
.opencode/skills/sk-doc/scripts/tests/missing_emojis.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/assets/template_rules.json:54:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:106:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:185:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:245:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:300:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:362:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:398:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:440:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:451:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:527:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:542:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:562:    "tocHeader": "## TABLE OF CONTENTS",
.opencode/skills/sk-doc/assets/template_rules.json:573:        "toc_single_dash_anchor",
.opencode/skills/sk-doc/assets/template_rules.json:574:        "toc_not_uppercase",
.opencode/skills/sk-doc/assets/template_rules.json:585:        "toc_entry_mismatch"

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/assets/create_feature_catalog_auto.yaml | sed -n '150,175p'; nl -ba .opencode/commands/create/assets/create_feature_catalog_confirm.yaml | sed -n '165,190p'; nl -ba .opencode/commands/create/assets/create_testing_playbook_auto.yaml | sed -n '155,175p'; nl -ba .opencode/commands/create/assets/create_testing_playbook_confirm.yaml | sed -n '170,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	
   151	template_sources:
   152	  root_catalog: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
   153	  feature_file: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md
   154	
   155	validation_scripts:
   156	  validate_document: .opencode/skills/sk-doc/scripts/validate_document.py
   157	  extract_structure: .opencode/skills/sk-doc/scripts/extract_structure.py
   158	
   159	quality_standards:
   160	  template_first: required
   161	  frontmatter_required: true
   162	  root_requirements:
   163	    - numbered all-caps H2 sections (no Table of Contents)
   164	    - section 1 is OVERVIEW
   165	  feature_file_requirements:
   166	    - frontmatter
   167	    - OVERVIEW
   168	    - CURRENT REALITY
   169	    - SOURCE FILES
   170	    - SOURCE METADATA
   171	  current_reality_rule: "Describe shipped behavior, not speculative roadmap content"
   172	  validation_pipeline:
   173	    - "python3 .opencode/skills/sk-doc/scripts/validate_document.py [catalog_root]/feature_catalog.md"
   174	    - "python3 .opencode/skills/sk-doc/scripts/extract_structure.py [catalog_root]/feature_catalog.md"
   175	
   165	template_sources:
   166	  root_catalog: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
   167	  feature_file: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md
   168	
   169	validation_scripts:
   170	  validate_document: .opencode/skills/sk-doc/scripts/validate_document.py
   171	  extract_structure: .opencode/skills/sk-doc/scripts/extract_structure.py
   172	
   173	quality_standards:
   174	  template_first: required
   175	  frontmatter_required: true
   176	  root_requirements:
   177	    - numbered all-caps H2 sections (no Table of Contents)
   178	    - section 1 is OVERVIEW
   179	  feature_file_requirements:
   180	    - frontmatter
   181	    - OVERVIEW
   182	    - CURRENT REALITY
   183	    - SOURCE FILES
   184	    - SOURCE METADATA
   185	  current_reality_rule: "Describe shipped behavior, not speculative roadmap content"
   186	  validation_pipeline:
   187	    - "python3 .opencode/skills/sk-doc/scripts/validate_document.py [catalog_root]/feature_catalog.md"
   188	    - "python3 .opencode/skills/sk-doc/scripts/extract_structure.py [catalog_root]/feature_catalog.md"
   189	
   190	gate_logic:
   155	validation_scripts:
   156	  validate_document: .opencode/skills/sk-doc/scripts/validate_document.py
   157	  extract_structure: .opencode/skills/sk-doc/scripts/extract_structure.py
   158	
   159	quality_standards:
   160	  template_first: required
   161	  frontmatter_required: true
   162	  root_requirements:
   163	    - integrated review protocol in root playbook
   164	    - integrated orchestration guidance in root playbook
   165	    - numbered all-caps H2 sections (no Table of Contents)
   166	  feature_file_requirements:
   167	    - frontmatter
   168	    - OVERVIEW
   169	    - SCENARIO CONTRACT
   170	    - TEST EXECUTION
   171	    - SOURCE FILES or REFERENCES
   172	    - SOURCE METADATA
   173	    - divider lines between numbered sections
   174	  forbidden_outputs:
   175	    - review_protocol.md
   170	  validate_document: .opencode/skills/sk-doc/scripts/validate_document.py
   171	  extract_structure: .opencode/skills/sk-doc/scripts/extract_structure.py
   172	
   173	quality_standards:
   174	  template_first: required
   175	  frontmatter_required: true
   176	  root_requirements:
   177	    - integrated review protocol in root playbook
   178	    - integrated orchestration guidance in root playbook
   179	    - numbered all-caps H2 sections (no Table of Contents)
   180	  feature_file_requirements:
   181	    - frontmatter
   182	    - OVERVIEW
   183	    - SCENARIO CONTRACT
   184	    - TEST EXECUTION
   185	    - SOURCE FILES or REFERENCES
   186	    - SOURCE METADATA
   187	    - divider lines between numbered sections
   188	  forbidden_outputs:
   189	    - review_protocol.md
   190	    - subagent_utilization_ledger.md

exec
/bin/zsh -lc 'git diff 1e58d845af''^ 1e58d845af -- .opencode/commands/create/assets/create_feature_catalog_auto.yaml .opencode/commands/create/assets/create_feature_catalog_confirm.yaml .opencode/commands/create/assets/create_testing_playbook_auto.yaml .opencode/commands/create/assets/create_testing_playbook_confirm.yaml .opencode/commands/create/folder_readme.md | sed -n '"'1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1452ms:
2026-05-26 12:51:37.513 xcodebuild[98105:53760961]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:37.623 xcodebuild[98105:53760959] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-y6HB7Z8r' (errno=Operation not permitted)
2026-05-26 12:51:38.009 xcodebuild[98107:53760973]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:51:38.132 xcodebuild[98107:53760971] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
diff --git a/.opencode/commands/create/assets/create_feature_catalog_auto.yaml b/.opencode/commands/create/assets/create_feature_catalog_auto.yaml
index 0507a7902d..892442dd7b 100644
--- a/.opencode/commands/create/assets/create_feature_catalog_auto.yaml
+++ b/.opencode/commands/create/assets/create_feature_catalog_auto.yaml
@@ -160,8 +160,7 @@ quality_standards:
   template_first: required
   frontmatter_required: true
   root_requirements:
-    - unnumbered TABLE OF CONTENTS
-    - numbered all-caps H2 sections
+    - numbered all-caps H2 sections (no Table of Contents)
     - section 1 is OVERVIEW
   feature_file_requirements:
     - frontmatter
diff --git a/.opencode/commands/create/assets/create_feature_catalog_confirm.yaml b/.opencode/commands/create/assets/create_feature_catalog_confirm.yaml
index 27742482e6..5f58b44a8e 100644
--- a/.opencode/commands/create/assets/create_feature_catalog_confirm.yaml
+++ b/.opencode/commands/create/assets/create_feature_catalog_confirm.yaml
@@ -174,8 +174,7 @@ quality_standards:
   template_first: required
   frontmatter_required: true
   root_requirements:
-    - unnumbered TABLE OF CONTENTS
-    - numbered all-caps H2 sections
+    - numbered all-caps H2 sections (no Table of Contents)
     - section 1 is OVERVIEW
   feature_file_requirements:
     - frontmatter
diff --git a/.opencode/commands/create/assets/create_testing_playbook_auto.yaml b/.opencode/commands/create/assets/create_testing_playbook_auto.yaml
index 6c426cb405..560bcc7d0e 100644
--- a/.opencode/commands/create/assets/create_testing_playbook_auto.yaml
+++ b/.opencode/commands/create/assets/create_testing_playbook_auto.yaml
@@ -162,8 +162,7 @@ quality_standards:
   root_requirements:
     - integrated review protocol in root playbook
     - integrated orchestration guidance in root playbook
-    - unnumbered TABLE OF CONTENTS
-    - numbered all-caps H2 sections
+    - numbered all-caps H2 sections (no Table of Contents)
   feature_file_requirements:
     - frontmatter
     - OVERVIEW
diff --git a/.opencode/commands/create/assets/create_testing_playbook_confirm.yaml b/.opencode/commands/create/assets/create_testing_playbook_confirm.yaml
index f56f6ffe05..e8e53c94f8 100644
--- a/.opencode/commands/create/assets/create_testing_playbook_confirm.yaml
+++ b/.opencode/commands/create/assets/create_testing_playbook_confirm.yaml
@@ -176,8 +176,7 @@ quality_standards:
   root_requirements:
     - integrated review protocol in root playbook
     - integrated orchestration guidance in root playbook
-    - unnumbered TABLE OF CONTENTS
-    - numbered all-caps H2 sections
+    - numbered all-caps H2 sections (no Table of Contents)
   feature_file_requirements:
     - frontmatter
     - OVERVIEW
diff --git a/.opencode/commands/create/folder_readme.md b/.opencode/commands/create/folder_readme.md
index 2f777f2bac..8a52426451 100644
--- a/.opencode/commands/create/folder_readme.md
+++ b/.opencode/commands/create/folder_readme.md
@@ -466,15 +466,15 @@ README STEP 2 (Discovery) REQUIREMENTS:
 
 README STEP 4 (Generation) REQUIREMENTS:
 ├─ MUST include title + tagline
-├─ MUST include TABLE OF CONTENTS
 ├─ MUST use numbered sections
 ├─ MUST include tables for structured data
+├─ MUST NOT include a Table of Contents or <!-- ANCHOR --> comments
 └─ MUST NOT leave placeholder content
 
 README STEP 5 (Validation) REQUIREMENTS:
-├─ MUST verify all sections are linked in TOC
 ├─ MUST check no placeholders remain
 ├─ MUST validate horizontal rules present
+├─ MUST confirm no Table of Contents was added
 └─ MUST NOT claim "complete" without structure check
 
 INSTALL GUIDE REQUIREMENTS:
@@ -491,7 +491,7 @@ INSTALL GUIDE REQUIREMENTS:
 
 Create comprehensive documentation following sk-doc quality standards:
 
-- **README operation**: AI-optimized README.md with proper structure, table of contents, and comprehensive documentation following the patterns from SpecKit, Memory System, and Code Environment READMEs.
+- **README operation**: AI-optimized README.md with proper structure and comprehensive documentation following the patterns from SpecKit, Memory System, and Code Environment READMEs.
 - **Install guide operation**: AI-first installation guide with clear prerequisites, step-by-step instructions, copy-paste AI prompt, and thorough troubleshooting.
 
 ---
@@ -622,7 +622,7 @@ After documentation creation completes, suggest relevant next steps:
 
 | Condition               | Suggested Command                  | Reason                         |
 | ----------------------- | ---------------------------------- | ------------------------------ |
-| README created          | Review and verify links work       | Confirm TOC links correctly    |
+| README created          | Review and verify links work       | Confirm internal links resolve |
 | Install guide created   | Test AI-First prompt               | Verify installation works      |
 | Need the other type     | `/create:folder_readme [op] ...`   | Create companion documentation |
 | Create another document | `/create:folder_readme [op] ...`   | Document related component     |

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/scripts/tests/test_validator.py | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env python3
     2	"""
     3	Automated test runner for validate_document.py
     4	
     5	Validates that the documentation validator correctly identifies:
     6	- Valid documents (exit code 0)
     7	- Invalid documents with specific error types (exit code 1)
     8	
     9	Usage:
    10	    python test_validator.py
    11	    python test_validator.py --verbose
    12	
    13	Exit Codes:
    14	    0 - All tests passed
    15	    1 - One or more tests failed
    16	"""
    17	
    18	import json
    19	import subprocess
    20	import sys
    21	from pathlib import Path
    22	from typing import Any, Dict, List, Optional, Tuple
    23	
    24	# ───────────────────────────────────────────────────────────────
    25	# 1. TEST CONFIGURATION
    26	# ───────────────────────────────────────────────────────────────
    27	
    28	TEST_CASES: List[Dict[str, Any]] = [
    29	    {
    30	        "file": "valid_readme.md",
    31	        "doc_type": "readme",
    32	        "expected_exit": 0,
    33	        "expected_errors": [],
    34	        "description": "Valid README with TOC and double-dash anchors"
    35	    },
    36	    {
    37	        "file": "valid_skill.md",
    38	        "doc_type": "skill",
    39	        "expected_exit": 0,
    40	        "expected_errors": [],
    41	        "description": "Valid SKILL.md with all required sections"
    42	    },
    43	    {
    44	        "file": "missing_toc.md",
    45	        "doc_type": "readme",
    46	        "expected_exit": 0,
    47	        "expected_errors": [],
    48	        "description": "README without a TOC is valid (TOCs are no longer used in skill docs)"
    49	    },
    50	    {
    51	        "file": "single_dash_anchors.md",
    52	        "doc_type": "readme",
    53	        "expected_exit": 0,
    54	        "expected_errors": [],
    55	        "description": "TOC anchor format is no longer validated (TOCs are not used; format check is moot)"
    56	    },
    57	    {
    58	        "file": "missing_emojis.md",
    59	        "doc_type": "readme",
    60	        "expected_exit": 0,
    61	        "expected_errors": [],
    62	        "description": "README without H2 emojis (valid - emojis not required)"
    63	    },
    64	    {
    65	        "file": "missing_sections.md",
    66	        "doc_type": "skill",
    67	        "expected_exit": 1,
    68	        "expected_errors": ["missing_required_section"],
    69	        "description": "SKILL.md missing required sections (smart_routing, how_it_works, rules)"
    70	    },
    71	    {
    72	        "file": "valid_command.md",
    73	        "doc_type": "command",
    74	        "expected_exit": 0,
    75	        "expected_errors": [],
    76	        "expected_document_type": "command",
    77	        "description": "Valid command doc using explicit --type command"
    78	    },
    79	    {
    80	        "file": "valid_install_guide.md",
    81	        "doc_type": "install_guide",
    82	        "expected_exit": 0,
    83	        "expected_errors": [],
    84	        "expected_document_type": "install_guide",
    85	        "description": "Valid install guide doc using explicit --type install_guide"
    86	    },
    87	    {
    88	        "file": "command/auto_detect_command.md",
    89	        "doc_type": None,
    90	        "expected_exit": 0,
    91	        "expected_errors": [],
    92	        "expected_document_type": "command",
    93	        "description": "Command doc auto-detects from /command/ path"
    94	    },
    95	    {
    96	        "file": "valid_spec.md",
    97	        "doc_type": "spec",
    98	        "expected_exit": 0,
    99	        "expected_errors": [],
   100	        "expected_document_type": "spec",
   101	        "description": "Valid spec doc using explicit --type spec"
   102	    },
   103	    {
   104	        "file": "specs/auto_detect_spec.md",
   105	        "doc_type": None,
   106	        "expected_exit": 0,
   107	        "expected_errors": [],
   108	        "expected_document_type": "spec",
   109	        "description": "Spec doc auto-detects from /specs/ path"
   110	    }
   111	]
   112	
   113	
   114	# ───────────────────────────────────────────────────────────────
   115	# 2. TEST RUNNER
   116	# ───────────────────────────────────────────────────────────────
   117	
   118	class TestResult:
   119	    """Container for individual test results."""
   120	    
   121	    def __init__(
   122	        self,
   123	        name: str,
   124	        passed: bool,
   125	        message: str,
   126	        details: Optional[Dict[str, Any]] = None,
   127	    ) -> None:
   128	        self.name = name
   129	        self.passed = passed
   130	        self.message = message
   131	        self.details = details or {}
   132	
   133	
   134	def run_validator(
   135	    test_file: Path,
   136	    doc_type: Optional[str],
   137	    validator_path: Path,
   138	) -> Tuple[int, Optional[Dict[str, Any]], Optional[str]]:
   139	    """
   140	    Run the validator on a test file.

exec
/bin/zsh -lc 'rg -n "missing_toc|single_dash_anchors|expected|exit" .opencode/skills/sk-doc/scripts/tests/test_validator.py' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
6:- Valid documents (exit code 0)
7:- Invalid documents with specific error types (exit code 1)
32:        "expected_exit": 0,
33:        "expected_errors": [],
39:        "expected_exit": 0,
40:        "expected_errors": [],
44:        "file": "missing_toc.md",
46:        "expected_exit": 0,
47:        "expected_errors": [],
51:        "file": "single_dash_anchors.md",
53:        "expected_exit": 0,
54:        "expected_errors": [],
60:        "expected_exit": 0,
61:        "expected_errors": [],
67:        "expected_exit": 1,
68:        "expected_errors": ["missing_required_section"],
74:        "expected_exit": 0,
75:        "expected_errors": [],
76:        "expected_document_type": "command",
82:        "expected_exit": 0,
83:        "expected_errors": [],
84:        "expected_document_type": "install_guide",
90:        "expected_exit": 0,
91:        "expected_errors": [],
92:        "expected_document_type": "command",
98:        "expected_exit": 0,
99:        "expected_errors": [],
100:        "expected_document_type": "spec",
106:        "expected_exit": 0,
107:        "expected_errors": [],
108:        "expected_document_type": "spec",
143:        tuple: (exit_code, json_output, error_message)
194:    expected_exit = test_case["expected_exit"]
195:    expected_errors = test_case["expected_errors"]
196:    expected_document_type = test_case.get("expected_document_type")
209:    exit_code, json_output, error_msg = run_validator(test_file, doc_type, validator_path)
211:    # Check exit code
212:    if exit_code != expected_exit:
216:            message=f"Exit code mismatch: expected {expected_exit}, got {exit_code}",
218:                "expected_exit": expected_exit,
219:                "actual_exit": exit_code,
226:    if expected_errors and json_output:
231:        for expected_error in expected_errors:
232:            if expected_error not in found_error_types:
233:                missing_errors.append(expected_error)
239:                message=f"Missing expected error types: {missing_errors}",
241:                    "expected_errors": expected_errors,
249:    if expected_exit == 0 and json_output:
258:                    "unexpected_errors": blocking_errors,
263:    if expected_document_type and json_output:
265:        if actual_document_type != expected_document_type:
269:                message=f"Document type mismatch: expected {expected_document_type}, got {actual_document_type}",
271:                    "expected_document_type": expected_document_type,
300:        sys.exit(2)
343:        sys.exit(1)
348:        sys.exit(0)

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/assets/create_folder_readme_confirm.yaml | sed -n '1,18p;490,550p;760,780p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# ─────────────────────────────────────────────────────────────────
     2	# OPENCODE CREATE: UNIFIED DOCUMENTATION WORKFLOW (CONFIRM MODE)
     3	# ─────────────────────────────────────────────────────────────────
     4	# Mode: confirm-only (interactive step-by-step approval)
     5	# Note: This workflow does NOT support :auto mode. All executions
     6	#       require user confirmation at checkpoints for content review.
     7	#
     8	# Supports: README creation and Install Guide creation
     9	# Routing: The setup phase in folder_readme.md determines which
    10	#          operation to execute. See operation_routing below.
    11	#
    12	# Note: Documents should include clear section anchors and concise metadata.
    13	# Use YAML frontmatter (title, description, trigger_phrases) for consistency.
    14	# ─────────────────────────────────────────────────────────────────
    15	role: Expert Documentation Creator using sk-doc skill
    16	purpose: Create comprehensive README files and AI-first installation guides with proper structure and optimization
    17	action: Generate scannable, well-organized documentation (README or Install Guide) with proper structure
    18	
   490	    - Identify which optional sections to include
   491	    core_pattern:
   492	      all_types:
   493	      - "Title + Tagline (one-liner description)"
   494	      - "Numbered sections"
   495	      - "Tables for structured data"
   496	      - "Code blocks with language tags"
   497	      - "Horizontal rules between major sections"
   498	    emoji_guidance:
   499	      note: "Optional emoji prefix suggestions (not required in output)"
   500	      examples:
   501	        overview: "OVERVIEW"
   502	        quick_start: "QUICK START"
   503	        structure: "STRUCTURE"
   504	        features: "FEATURES"
   505	        configuration: "CONFIGURATION"
   506	        usage_examples: "USAGE EXAMPLES"
   507	        troubleshooting: "TROUBLESHOOTING"
   508	        faq: "FAQ"
   509	        related_documents: "RELATED DOCUMENTS"
   510	    outputs:
   511	    - template_selected
   512	    - sections_planned
   513	    - content_outline
   514	    checkpoint:
   515	      question: "Structure selected. Proceed to generation?"
   516	      options: checkpoint_options.standard
   517	
   518	  step_4_content_generation:
   519	    purpose: Write comprehensive README following selected structure
   520	    activities:
   521	    - Write Title + Tagline (concise, clear value proposition)
   522	    - Write each section
   523	    - Create tables for structured data (features, commands, config)
   524	    - Add code blocks with language tags
   525	    - Create ASCII diagrams for architecture/flow visualization
   526	    - Add horizontal rules between major sections
   527	    - Write to target_path
   528	    quality_requirements:
   529	      title: "Clear, concise value proposition"
   530	      sections: "Numbered sections"
   531	      tables: "For structured data (features, commands, config)"
   532	      code_blocks: "Always specify language"
   533	      diagrams: "ASCII for architecture/flow"
   534	      separators: "Horizontal rules between major sections"
   535	    outputs:
   536	    - readme_file: created
   537	    - sections_count: number
   538	    - tables_count: number
   539	    - code_blocks_count: number
   540	    checkpoint:
   541	      question: "README generated. Review?"
   542	      options:
   543	      - label: "A) Show full content"
   544	        description: "Display complete README"
   545	      - label: "B) Proceed"
   546	        description: "Continue to validation"
   547	
   548	  step_5_validation:
   549	    purpose: Verify README quality and completeness
   550	    activities:
   760	# README: RULES
   761	# ─────────────────────────────────────────────────────────────────
   762	readme_rules:
   763	  ALWAYS:
   764	  - "Load readme_template.md before creating content"
   765	  - "Pause at checkpoints for user approval"
   766	  - "Include Quick Start section with clear examples"
   767	  - "Use numbered H2 sections"
   768	  - "Validate structure before claiming complete"
   769	  NEVER:
   770	  - "Skip validation steps"
   771	  - "Create documents without loading templates first"
   772	  - "Proceed without user approval at checkpoints"
   773	  - "Leave placeholder text in final output"
   774	  - "Omit troubleshooting section"
   775	  - "Create README without user-confirmed path"
   776	
   777	# ════════════════════════════════════════════════════════════════
   778	# OPERATION: INSTALL GUIDE
   779	# ════════════════════════════════════════════════════════════════
   780	

exec
/bin/zsh -lc "nl -ba .opencode/commands/create/assets/create_folder_readme_auto.yaml | sed -n '1,18p;520,590p;1598,1625p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# ─────────────────────────────────────────────────────────────────
     2	# OPENCODE CREATE: UNIFIED DOCUMENTATION WORKFLOW (AUTO MODE)
     3	# ─────────────────────────────────────────────────────────────────
     4	# Mode: autonomous (no user approval gates)
     5	# Operations: README creation | Install Guide creation
     6	# Note: This workflow executes all steps sequentially with
     7	#       continuous self-validation. Pauses only if confidence < 40%.
     8	#
     9	# Note: Documentation files should include clear section anchors and concise metadata.
    10	# Use YAML frontmatter (title, description, trigger_phrases) for consistency.
    11	# ─────────────────────────────────────────────────────────────────
    12	role: Expert Documentation Creator using sk-doc skill
    13	purpose: Create comprehensive README files and AI-first installation guides with proper structure and AI-optimization
    14	action: Generate scannable, well-organized documentation (README or Install Guide) with proper structure
    15	
    16	# ─────────────────────────────────────────────────────────────────
    17	# PREREQUISITE: @markdown AGENT VERIFICATION
    18	# ─────────────────────────────────────────────────────────────────
   520	    purpose: Choose appropriate template based on type
   521	    activities:
   522	    - Select section structure based on readme_type
   523	    - Adapt sections to specific project needs
   524	    - Plan content for each section
   525	    - Identify which optional sections to include
   526	    core_pattern:
   527	      all_types:
   528	      - "Title + Tagline (one-liner description)"
   529	      - "Numbered sections"
   530	      - "Tables for structured data"
   531	      - "Code blocks with language tags"
   532	      - "Horizontal rules between major sections"
   533	    emoji_guidance:
   534	      note: "Optional emoji prefix suggestions (not required in output)"
   535	      examples:
   536	        overview: "📖"
   537	        quick_start: "🚀"
   538	        structure: "📁"
   539	        features: "⚡"
   540	        configuration: "⚙️"
   541	        usage_examples: "💡"
   542	        troubleshooting: "🛠️"
   543	        faq: "❓"
   544	        related_documents: "📚"
   545	    outputs:
   546	    - template_selected
   547	    - sections_planned
   548	    - content_outline
   549	
   550	  step_4_content_generation:
   551	    purpose: Write comprehensive README following selected structure
   552	    activities:
   553	    - Write Title + Tagline (concise, clear value proposition)
   554	    - Write each section
   555	    - Create tables for structured data (features, commands, config)
   556	    - Add code blocks with language tags
   557	    - Create ASCII diagrams for architecture/flow visualization
   558	    - Add horizontal rules between major sections
   559	    - Write to target_path
   560	    quality_requirements:
   561	      title: "Clear, concise value proposition"
   562	      sections: "Section headers - numbered format recommended"
   563	      tables: "For structured data (features, commands, config)"
   564	      code_blocks: "Always specify language"
   565	      diagrams: "ASCII for architecture/flow"
   566	      separators: "Horizontal rules between major sections"
   567	    outputs:
   568	    - readme_file: created
   569	    - sections_count: number
   570	    - tables_count: number
   571	    - code_blocks_count: number
   572	
   573	  step_5_validation:
   574	    purpose: Verify README quality and completeness
   575	    activities:
   576	    - Structure check (title, sections, separators)
   577	    - Content check (code blocks, tables, no placeholders, valid links)
   578	    - Completeness check (Quick Start, Troubleshooting, FAQ for component/skill)
   579	    - DQI check if script available
   580	    validation_checklist:
   581	      structure:
   582	      - "Title + one-liner tagline present"
   583	      - "All sections numbered"
   584	      - "Horizontal rules between sections"
   585	      content:
   586	      - "All code blocks have language tags"
   587	      - "Tables are properly formatted"
   588	      - "No placeholder text remaining"
   589	      - "Links are valid"
   590	      completeness:
  1598	  - "Validate structure before claiming complete"
  1599	  - "Include troubleshooting section"
  1600	  NEVER:
  1601	  - "Prompt user for approval at checkpoints"
  1602	  - "Skip validation steps"
  1603	  - "Create documents without loading templates first"
  1604	  - "Leave placeholder text in final output"
  1605	  - "Create documentation without user-confirmed path/output"
  1606	  # ── README-specific rules ────────────────────────────────────
  1607	  readme_ALWAYS:
  1608	  - "Load readme_template.md before creating content"
  1609	  - "Include Quick Start section with clear examples"
  1610	  - "Validate structure before claiming complete"
  1611	  readme_NEVER:
  1612	  - "Omit troubleshooting section"
  1613	  - "Create README without user-confirmed path"
  1614	  # ── Install-guide-specific rules ─────────────────────────────
  1615	  install_guide_ALWAYS:
  1616	  - include_ai_first_section
  1617	  - include_all_11_sections
  1618	  - provide_quick_install_option
  1619	  - include_verification_commands
  1620	  - add_troubleshooting_section
  1621	  - include_platform_configurations
  1622	  - add_quick_reference_at_end
  1623	  - validate_before_claiming_complete
  1624	  install_guide_NEVER:
  1625	  - skip_ai_first_section

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/assets/skill/skill_asset_template.md | sed -n '570,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   570	
   571	    output:
   572	      format: "json"          # json | yaml | markdown
   573	      verbosity: "normal"     # minimal | normal | verbose
   574	      show_suggestions: true
   575	
   576	  rules:
   577	    frontmatter:
   578	      required_for: ["SKILL.md", "commands"]
   579	      forbidden_for: ["knowledge"]
   580	      optional_for: ["README.md"]
   581	
   582	    sections:
   583	      require_toc_when: "lines > 100"
   584	      numbering: "sequential"  # sequential | hierarchical | none
   585	```
   586	
   587	### Python: Data Structures
   588	
   589	```python
   590	# Classification matrix for document types

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/assets/template_rules.json | sed -n '520,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/README.md | sed -n '250,285p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	        "parallel vs sequential": "parallel_vs_sequential",
   521	        "failure handling": "failure_handling",
   522	        "context handoff format": "context_handoff",
   523	        "context handoff": "context_handoff",
   524	        "escalation protocol": "escalation_protocol",
   525	        "response formats": "response_formats"
   526	      },
   527	      "tocRequired": false,
   528	      "h2EmojiRequired": false,
   529	      "frontmatterRequired": true,
   530	      "frontmatterFields": {
   531	        "required": [
   532	          "name",
   533	          "description",
   534	          "mode",
   535	          "temperature",
   536	          "permission"
   537	        ],
   538	        "optional": []
   539	      }
   540	    },
   541	    "playbook_feature": {
   542	      "tocRequired": false,
   543	      "tocUppercaseRequired": false,
   544	      "h2EmojiRequired": false,
   545	      "h2UppercaseRequired": true,
   546	      "requiredSections": [
   547	        "overview",
   548	        "scenario_contract",
   549	        "test_execution",
   550	        "source_metadata"
   551	      ],
   552	      "sectionAliases": {
   553	        "references": "source_files",
   554	        "source_files": "source_files"
   555	      },
   556	      "description": "Per-feature playbook scenario file under manual_testing_playbook/NN--category/"
   557	    }
   558	  },
   559	  "validationRules": {
   560	    "h2Pattern": "^## (\\d+)\\.\\s+(.+)$",
   561	    "h2WithEmojiPattern": "^## (\\d+)\\.\\s+([^\\w\\s])\\s+(.+)$",
   562	    "tocHeader": "## TABLE OF CONTENTS",
   563	    "tocEntryPattern": "^- \\[(.+?)\\]\\(#(.+?)\\)$",
   564	    "tocAnchorDoubleDashPattern": "^(\\d+)--([a-z_-]+)$",
   565	    "sectionSeparator": "---"
   566	  },
   567	  "severityDefinitions": {
   568	    "blocking": {
   569	      "description": "Errors that must be fixed before document is considered valid",
   570	      "exitCode": 1,
   571	      "errors": [
   572	        "h2_not_uppercase",
   573	        "toc_single_dash_anchor",
   574	        "toc_not_uppercase",
   575	        "missing_toc",
   576	        "missing_required_section"
   577	      ]
   578	    },
   579	    "warning": {
   580	      "description": "Issues that should be addressed but don't block validation",
   581	      "exitCode": 0,
   582	      "errors": [
   583	        "non_sequential_numbering",
   584	        "missing_recommended_section",
   585	        "toc_entry_mismatch"
   586	      ]
   587	    },
   588	    "info": {
   589	      "description": "Informational notes that may indicate style inconsistencies",
   590	      "exitCode": 0,

 succeeded in 0ms:
   250	||| Command | Strict | Required | Must be executable and discoverable |
   251	||| Spec | Loose | Optional | Working docs, avoid blocking on violations |
   252	||| Generic | Flexible | Optional | Best-effort structure enforcement |
   253	
   254	Template enforcement rules are defined in `assets/template_rules.json`. This file governs which checklist items are required, advisory, or skipped per document type. Modify this file to adjust enforcement for custom document types.
   255	
   256	**HVR enforcement** applies to all output from all modes. There is no opt-out. Violations against HVR (banned words, em dashes, semicolons, Oxford commas, passive voice) count against the Style component of the DQI score and appear in the checklist output of `extract_structure.py`.
   257	
   258	---
   259	
   260	## 6. USAGE EXAMPLES
   261	
   262	**Score a document and review recommendations**
   263	
   264	```bash
   265	|# Run extract_structure.py and parse the JSON output
   266	python3 .opencode/skills/sk-doc/scripts/extract_structure.py path/to/document.md
   267	
   268	|# Example output (truncated):
   269	|# {
   270	|#   "dqi": { "total": 82, "band": "good", "components": { "structure": 35, "content": 22, "style": 25 } },
   271	|#   "checklist": { "passed": 9, "failed": 2, "skipped": 1 },
   272	|#   "documentType": "README",
   273	|#   "violations": ["missing_toc_anchor", "h2_missing_emoji"]
   274	|# }
   275	```
   276	
   277	**Scaffold, populate, and package a new skill**
   278	
   279	```bash
   280	|# Step 1: scaffold the directory
   281	python3 .opencode/skills/sk-doc/scripts/init_skill.py my-skill --path .opencode/skill
   282	
   283	|# Step 2: populate SKILL.md and bundled resources using templates
   284	|# assets/skill/skill_md_template.md  →  .opencode/skills/my-skill/SKILL.md
   285	|# assets/skill/skill_reference_template.md  →  references/

exec
/bin/zsh -lc "rg -n -i 'must.*table of contents|required.*table of contents|create table of contents|generate table of contents|include table of contents|require_toc_when|tocRequired\": true|optional anchors|section anchors|anchor_templates|anchor rules|anchor_rules' .opencode/skills/sk-doc .opencode/commands/create -g '"'!sk-doc/scripts/tests/**'"' -g '"'!system-spec-kit/templates/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:12:# Note: Documents should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_confirm.yaml:400:  anchor_rules: "readme_template.md S12 (Anchor Templates)"
.opencode/commands/create/assets/create_folder_readme_auto.yaml:9:# Note: Documentation files should include clear section anchors and concise metadata.
.opencode/commands/create/assets/create_folder_readme_auto.yaml:447:  anchor_rules: "readme_template.md §12 (Anchor Templates)"
.opencode/commands/create/folder_readme.md:471:├─ MUST NOT include a Table of Contents or <!-- ANCHOR --> comments
.opencode/commands/create/folder_readme.md:477:├─ MUST confirm no Table of Contents was added
.opencode/skills/sk-doc/assets/skill/skill_asset_template.md:583:      require_toc_when: "lines > 100"
.opencode/skills/sk-doc/assets/readme/readme_template.md:293:- [ ] Optional anchors wrap only stable sections.

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/assets/skill/skill_asset_template.md | sed -n '540,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   540	
   541	    user_specified:
   542	      action: "Honor user's requested count"
   543	      override: true
   544	```
   545	
   546	---
   547	
   548	## 8. CONFIGURATION TEMPLATES
   549	
   550	**Purpose**: Demonstrate structured data formats for configuration and metadata.
   551	
   552	### YAML: Tool Configuration
   553	
   554	```yaml
   555	tool_configuration:
   556	  name: "document-validator"
   557	  version: "2.1.0"
   558	
   559	  settings:
   560	    validation:
   561	      strictness: "high"  # low | medium | high
   562	      fail_on_warnings: false
   563	      ignore_patterns:
   564	        - "*.draft.md"
   565	        - "temp/**"
   566	
   567	    formatting:
   568	      max_line_length: 100
   569	      heading_style: "atx"    # atx | setext
   570	
   571	    output:
   572	      format: "json"          # json | yaml | markdown
   573	      verbosity: "normal"     # minimal | normal | verbose
   574	      show_suggestions: true
   575	
   576	  rules:
   577	    frontmatter:
   578	      required_for: ["SKILL.md", "commands"]
   579	      forbidden_for: ["knowledge"]
   580	      optional_for: ["README.md"]
   581	
   582	    sections:
   583	      require_toc_when: "lines > 100"
   584	      numbering: "sequential"  # sequential | hierarchical | none
   585	```
   586	
   587	### Python: Data Structures
   588	
   589	```python
   590	# Classification matrix for document types

exec
/bin/zsh -lc "rg -n -i 'require_toc_when|missing_toc_anchor|table of contents|toc anchor|toc_required|tocRequired|anchor comments|ANCHOR -->|section anchors' .opencode/skills/sk-doc -g '"'!scripts/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:482:- [ ] Main playbook has frontmatter and H1 intro (no Table of Contents)
.opencode/skills/sk-doc/README.md:273:|#   "violations": ["missing_toc_anchor", "h2_missing_emoji"]
.opencode/skills/sk-doc/README.md:301:|# validate_document.py checks TOC anchors, H2 emojis, required sections
.opencode/skills/sk-doc/README.md:330:Fix: Read the error output line by line. The most common fix is correcting TOC anchor format to use double dashes. Check that every H2 has the correct emoji from the template, that sections are numbered 1, 2, 3 (not 1, 2.5, 3), and that no required section is absent. Re-run after each correction.
.opencode/skills/sk-doc/assets/template_rules.json:54:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:106:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:185:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:245:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:300:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:362:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:398:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:440:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:451:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:527:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:542:      "tocRequired": false,
.opencode/skills/sk-doc/assets/template_rules.json:562:    "tocHeader": "## TABLE OF CONTENTS",
.opencode/skills/sk-doc/assets/template_rules.json:599:      "description": "Convert single-dash TOC anchors to double-dash",
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:217:- Use numbered all-caps H2 section headers in the root catalog. Do not add a Table of Contents.
.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:229:- [ ] Root catalog uses numbered all-caps H2 section headers (no Table of Contents)
.opencode/skills/sk-doc/references/readme_creation.md:188:**Table of Contents**: Do not add a Table of Contents. READMEs rely on their numbered H2 heading hierarchy for navigation; no TOC block and no `<!-- ANCHOR -->` navigation comments are used.
.opencode/skills/sk-doc/references/readme_creation.md:315:- [ ] No Table of Contents and no `<!-- ANCHOR -->` navigation comments
.opencode/skills/sk-doc/assets/skill/skill_asset_template.md:583:      require_toc_when: "lines > 100"
.opencode/skills/sk-doc/scripts/validate_document.py:233:    """Validate TABLE OF CONTENTS section."""
.opencode/skills/sk-doc/scripts/validate_document.py:236:    if not doc_type_rules.get('tocRequired', False):
.opencode/skills/sk-doc/scripts/validate_document.py:240:    # Pattern: ## [optional emoji] TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/validate_document.py:242:        r'## (?:[^\w\s]\s+)?TABLE OF CONTENTS\s*\n(.*?)(?=\n---|\n## |\Z)',
.opencode/skills/sk-doc/scripts/validate_document.py:251:            'message': 'Missing TABLE OF CONTENTS section',
.opencode/skills/sk-doc/scripts/validate_document.py:252:            'fix_hint': 'Add "## TABLE OF CONTENTS" section with linked entries'
.opencode/skills/sk-doc/scripts/validate_document.py:269:                'message': f'TOC anchor uses single dash instead of double dash',
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:59:- ✅ No table of contents (forbidden in SKILL.md)
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1078:□ No table of contents (forbidden in SKILL.md)
.opencode/skills/sk-doc/assets/skill/skill_md_template.md:1128:| **TOC**               | Forbidden in SKILL.md      | ❌ No table of contents                                                                             |
.opencode/skills/sk-doc/references/feature_catalog_creation.md:25:- no Table of Contents and no `<!-- ANCHOR -->` navigation comments
.opencode/skills/sk-doc/scripts/extract_structure.py:673:    ('no_toc', 'No table of contents', lambda fm, h, c: not any('TABLE OF CONTENTS' in heading['text'].upper() or 'TOC' == heading['text'].upper() for heading in h)),
.opencode/skills/sk-doc/scripts/extract_structure.py:682:    ('has_toc', 'Has TABLE OF CONTENTS section', lambda fm, h, c: any('TABLE OF CONTENTS' in heading['text'].upper() or heading['text'].upper() == 'TOC' for heading in h)),
.opencode/skills/sk-doc/scripts/extract_structure.py:683:    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2 and 'TABLE OF CONTENTS' not in heading['text'].upper()) if any(heading['level'] == 2 for heading in h) else True),
.opencode/skills/sk-doc/references/global/core_standards.md:80:- ❌ **NEVER** add a Table of Contents to any document type. Tables of Contents and `<!-- ANCHOR -->` navigation comments are not used in skill documentation.
.opencode/skills/sk-doc/references/global/validation.md:51:| TOC anchor single-dash (should be `#1--`) | blocking | Yes |
.opencode/skills/sk-doc/references/global/validation.md:116:- ✅ `no_toc` - No table of contents section
.opencode/skills/sk-doc/scripts/tests/test_validator.py:55:        "description": "TOC anchor format is no longer validated (TOCs are not used; format check is moot)"
.opencode/skills/sk-doc/scripts/tests/valid_install_guide.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/missing_emojis.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/missing_toc.md:3:> README missing TABLE OF CONTENTS section (blocking error)
.opencode/skills/sk-doc/scripts/tests/missing_toc.md:9:This README is missing the TABLE OF CONTENTS section.
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:3:> README with single-dash TOC anchors (blocking error)
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/valid_readme.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/valid_readme.md:17:- Has TABLE OF CONTENTS section

exec
/bin/zsh -lc 'git diff 1e58d845af''^ 1e58d845af -- .opencode/skills/sk-doc/assets/skill/skill_asset_template.md .opencode/skills/sk-doc/README.md .opencode/skills/sk-doc/assets/template_rules.json | sed -n '"'1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1533ms:
2026-05-26 12:52:00.372 xcodebuild[99417:53763149]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:52:00.527 xcodebuild[99417:53763148] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-XhMyzKhO' (errno=Operation not permitted)
2026-05-26 12:52:00.990 xcodebuild[99661:53763454]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:52:01.106 xcodebuild[99661:53763453] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
diff --git a/.opencode/skills/sk-doc/README.md b/.opencode/skills/sk-doc/README.md
index a30af4f4fb..71364a47a5 100644
--- a/.opencode/skills/sk-doc/README.md
+++ b/.opencode/skills/sk-doc/README.md
@@ -20,23 +20,6 @@ trigger_phrases:
 
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
-<!-- /ANCHOR:table-of-contents -->
-
----
-
-<!-- ANCHOR:overview -->
 ## 1. OVERVIEW
 
 sk-doc is the central documentation engine for OpenCode projects. It operates in six modes: Document Quality (structure enforcement, DQI scoring, content optimization), Component Creation (skills, agents, and commands with templates and full validation), Flowchart Creation (ASCII diagrams for workflows and decision trees), Install Guide Creation (phase-based setup documentation), Catalog/Playbook Creation (feature catalogs and manual testing playbooks for inventory and validation packages), and Benchmark Folder Creation (curated `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folders that promote bake-off results from a spec packet into the consuming skill).
@@ -64,11 +47,8 @@ The skill runs version 1.6.0.0 with six operating modes. It includes six automat
 - Feature catalogs: Rooted inventory with numbered categories and per-feature files
 - Manual testing playbooks: 9-column scenario tables, deterministic prompts, cross-reference index
 
-<!-- /ANCHOR:overview -->
-
 ---
 
-<!-- ANCHOR:quick-start -->
 ## 2. QUICK START
 
 **Step 1: Invoke the skill.**
@@ -96,11 +76,8 @@ For README files, `validate_document.py` checks TOC format, anchor syntax, H2 em
 python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md
 ```
 
-<!-- /ANCHOR:quick-start -->
-
 ---
 
-<!-- ANCHOR:features -->
 ## 3. FEATURES
 
 ### 3.1 FEATURE HIGHLIGHTS
@@ -197,11 +174,8 @@ Benchmark Folder Creation produces skill-local `mcp_server/benchmarks/benchmark-
 ||| Skill-local benchmark folder creation | Yes | No | No |
 ||| Git workflow orchestration | No | No | Yes |
 
-<!-- /ANCHOR:features -->
-
 ---
 
-<!-- ANCHOR:structure -->
 ## 4. STRUCTURE
 
 ```text
@@ -260,11 +234,8 @@ sk-doc/
     └── audit_readmes.py                             # Batch README audit across directories
 ```
 
-<!-- /ANCHOR:structure -->
-
 ---
 
-<!-- ANCHOR:configuration -->
 ## 5. CONFIGURATION
 
 No configuration is required to use this skill. Document type detection is automatic and drives the enforcement level applied.
@@ -284,11 +255,8 @@ Template enforcement rules are defined in `assets/template_rules.json`. This fil
 
 **HVR enforcement** applies to all output from all modes. There is no opt-out. Violations against HVR (banned words, em dashes, semicolons, Oxford commas, passive voice) count against the Style component of the DQI score and appear in the checklist output of `extract_structure.py`.
 
-<!-- /ANCHOR:configuration -->
-
 ---
 
-<!-- ANCHOR:usage-examples -->
 ## 6. USAGE EXAMPLES
 
 **Score a document and review recommendations**
@@ -339,11 +307,8 @@ python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md
 |# 2 = file read or parse error (check path and input)
 ```
 
-<!-- /ANCHOR:usage-examples -->
-
 ---
 
-<!-- ANCHOR:troubleshooting -->
 ## 7. TROUBLESHOOTING
 
 **DQI score below 60**
@@ -384,11 +349,8 @@ Common causes: Writing that uses prohibited words (robust, seamless, utilize, de
 
 Fix: Read `references/global/hvr_rules.md` for the complete banned word list and prohibited punctuation patterns. Search the document for each violation type using Grep, then rewrite affected sentences. Replace em dashes with commas or parentheses. Replace semicolons with periods or commas. Replace banned words with plain alternatives.
 
-<!-- /ANCHOR:troubleshooting -->
-
 ---
 
-<!-- ANCHOR:faq -->
 ## 8. FAQ
 
 **Q: When should I use sk-doc vs. system-spec-kit?**
@@ -403,11 +365,8 @@ A: No. They serve different purposes. `validate_document.py` is a fast format va
 
 A: A feature catalog documents current behavior. It inventories what a skill or system can do, organized by numbered categories, with source-file anchors and stable slugs. A testing playbook defines how to test that behavior manually. It contains deterministic prompts (exact text to type), expected signals, failure triage steps, and evidence requirements. The two are complementary: the catalog provides the stable capability reference, and the playbook links back to catalog entries via a Cross-Reference Index. Build the catalog first, then use it as the source of truth when writing playbook scenarios.
 
-<!-- /ANCHOR:faq -->
-
 ---
 
-<!-- ANCHOR:related-documents -->
 ## 9. RELATED DOCUMENTS
 
 ||| Resource | Path | Purpose |
@@ -429,5 +388,3 @@ A: A feature catalog documents current behavior. It inventories what a skill or
 ||| sk-git | `.opencode/skills/sk-git/SKILL.md` | Git workflow orchestration |
 ||| CommonMark spec | https://spec.commonmark.org/ | Markdown rendering standard |
 ||| llms.txt spec | https://llmstxt.org/ | LLM navigation format |
-
-<!-- /ANCHOR:related-documents -->
diff --git a/.opencode/skills/sk-doc/assets/template_rules.json b/.opencode/skills/sk-doc/assets/template_rules.json
index c5c4eaed7e..774d93b977 100644
--- a/.opencode/skills/sk-doc/assets/template_rules.json
+++ b/.opencode/skills/sk-doc/assets/template_rules.json
@@ -51,7 +51,7 @@
         "readme checklist": "checklist",
         "readme maintenance": "maintenance"
       },
-      "tocRequired": true,
+      "tocRequired": false,
       "tocAnchorFormat": "double_dash",
       "tocUppercaseRequired": true,
       "h2EmojiRequired": false,
@@ -242,7 +242,7 @@
         "related resources": "related_resources",
         "phase validation": "phase_validation"
       },
-      "tocRequired": true,
+      "tocRequired": false,
       "tocAnchorFormat": "double_dash",
       "tocUppercaseRequired": true,
       "h2EmojiRequired": false,
@@ -437,7 +437,7 @@
         "feature catalog cross reference": "feature_catalog_cross_reference",
         "coverage notes": "coverage_notes"
       },
-      "tocRequired": true,
+      "tocRequired": false,
       "h2EmojiRequired": false,
       "h2UppercaseRequired": true
     },

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/references/global/validation.md | sed -n '40,60p;108,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	**Pre-delivery format checks with blocking errors:**
    41	
    42	```bash
    43	python scripts/validate_document.py document.md
    44	# Exit 0 = valid, Exit 1 = blocking errors, Exit 2 = file error
    45	```
    46	
    47	**Checks:**
    48	| Check | Severity | Auto-Fixable |
    49	|-------|----------|--------------|
    50	| Missing TOC section | blocking | No |
    51	| TOC anchor single-dash (should be `#1--`) | blocking | Yes |
    52	| Missing required section | blocking | No |
    53	| Non-sequential numbering | warning | No |
    54	
    55	**Options:**
    56	- `--json` - Output results as JSON
    57	- `--fix` - Apply auto-fixes for safe issues
    58	- `--fix --dry-run` - Preview fixes without applying
    59	- `--type readme|skill|reference|asset|agent` - Explicit document type
    60	
   108	- ✅ `description_present` - Has description field
   109	- ✅ `description_single_line` - Description is single line (no YAML multiline)
   110	- ✅ `allowed_tools_present` - Has allowed-tools field
   111	- ✅ `allowed_tools_array` - allowed-tools in array format `[Tool1, Tool2]`
   112	- ✅ `has_when_to_use` - Has WHEN TO USE section
   113	- ✅ `has_how_it_works` - Has HOW IT WORKS or HOW TO USE section
   114	- ✅ `has_rules` - Has RULES section
   115	- ✅ `h2_numbered` - H2s have number prefix format
   116	- ✅ `no_toc` - No table of contents section
   117	- ✅ `no_placeholders` - No placeholder markers ([TODO], [PLACEHOLDER], etc.)
   118	- ✅ `code_has_language` - Code blocks have language tags
   119	
   120	**README-Specific Checks**:

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-doc/README.md | sed -n '292,334p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   292	python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/my-skill
   293	
   294	|# Step 5: final DQI check on SKILL.md
   295	python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/my-skill/SKILL.md
   296	```
   297	
   298	**Validate a README before delivery**
   299	
   300	```bash
   301	|# validate_document.py checks TOC anchors, H2 emojis, required sections
   302	python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md
   303	
   304	|# Exit codes:
   305	|# 0 = valid, proceed to delivery
   306	|# 1 = blocking errors (fix and re-run)
   307	|# 2 = file read or parse error (check path and input)
   308	```
   309	
   310	---
   311	
   312	## 7. TROUBLESHOOTING
   313	
   314	**DQI score below 60**
   315	
   316	What you see: `extract_structure.py` returns a `"needs_work"` band with a total score under 60.
   317	
   318	Common causes: Missing required sections, no frontmatter on a SKILL or Command file, very low word count, no code examples, H2 headers missing emoji or numbers, or multiple HVR violations.
   319	
   320	Fix: Review the `checklist` array in the JSON output. Address failed items in priority order: (1) frontmatter and section order, (2) missing required sections, (3) content density (word count, examples, links), (4) style issues (HVR, H2 format, separators). Re-run `extract_structure.py` after each batch of fixes to track progress.
   321	
   322	---
   323	
   324	**`validate_document.py` exits with code 1**
   325	
   326	What you see: The script reports blocking errors and refuses to pass the document.
   327	
   328	Common causes: TOC missing or using single-dash anchor format instead of double-dash (e.g., `#1-overview` instead of `#1--overview`), H2 headers missing emojis, required sections absent, or section numbering is non-sequential.
   329	
   330	Fix: Read the error output line by line. The most common fix is correcting TOC anchor format to use double dashes. Check that every H2 has the correct emoji from the template, that sections are numbered 1, 2, 3 (not 1, 2.5, 3), and that no required section is absent. Re-run after each correction.
   331	
   332	---
   333	
   334	**`package_skill.py` fails**

exec
/bin/zsh -lc 'git diff 1e58d845af''^ 1e58d845af -- .opencode/skills/sk-doc/references/global/validation.md .opencode/skills/sk-doc/README.md | sed -n '"'1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1652ms:
2026-05-26 12:52:11.721 xcodebuild[360:53764402]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:52:11.864 xcodebuild[360:53764401] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-A7fRMIux' (errno=Operation not permitted)
2026-05-26 12:52:12.308 xcodebuild[490:53764542]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:52:12.451 xcodebuild[490:53764540] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
diff --git a/.opencode/skills/sk-doc/README.md b/.opencode/skills/sk-doc/README.md
index a30af4f4fb..71364a47a5 100644
--- a/.opencode/skills/sk-doc/README.md
+++ b/.opencode/skills/sk-doc/README.md
@@ -20,23 +20,6 @@ trigger_phrases:
 
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
-<!-- /ANCHOR:table-of-contents -->
-
----
-
-<!-- ANCHOR:overview -->
 ## 1. OVERVIEW
 
 sk-doc is the central documentation engine for OpenCode projects. It operates in six modes: Document Quality (structure enforcement, DQI scoring, content optimization), Component Creation (skills, agents, and commands with templates and full validation), Flowchart Creation (ASCII diagrams for workflows and decision trees), Install Guide Creation (phase-based setup documentation), Catalog/Playbook Creation (feature catalogs and manual testing playbooks for inventory and validation packages), and Benchmark Folder Creation (curated `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/` folders that promote bake-off results from a spec packet into the consuming skill).
@@ -64,11 +47,8 @@ The skill runs version 1.6.0.0 with six operating modes. It includes six automat
 - Feature catalogs: Rooted inventory with numbered categories and per-feature files
 - Manual testing playbooks: 9-column scenario tables, deterministic prompts, cross-reference index
 
-<!-- /ANCHOR:overview -->
-
 ---
 
-<!-- ANCHOR:quick-start -->
 ## 2. QUICK START
 
 **Step 1: Invoke the skill.**
@@ -96,11 +76,8 @@ For README files, `validate_document.py` checks TOC format, anchor syntax, H2 em
 python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md
 ```
 
-<!-- /ANCHOR:quick-start -->
-
 ---
 
-<!-- ANCHOR:features -->
 ## 3. FEATURES
 
 ### 3.1 FEATURE HIGHLIGHTS
@@ -197,11 +174,8 @@ Benchmark Folder Creation produces skill-local `mcp_server/benchmarks/benchmark-
 ||| Skill-local benchmark folder creation | Yes | No | No |
 ||| Git workflow orchestration | No | No | Yes |
 
-<!-- /ANCHOR:features -->
-
 ---
 
-<!-- ANCHOR:structure -->
 ## 4. STRUCTURE
 
 ```text
@@ -260,11 +234,8 @@ sk-doc/
     └── audit_readmes.py                             # Batch README audit across directories
 ```
 
-<!-- /ANCHOR:structure -->
-
 ---
 
-<!-- ANCHOR:configuration -->
 ## 5. CONFIGURATION
 
 No configuration is required to use this skill. Document type detection is automatic and drives the enforcement level applied.
@@ -284,11 +255,8 @@ Template enforcement rules are defined in `assets/template_rules.json`. This fil
 
 **HVR enforcement** applies to all output from all modes. There is no opt-out. Violations against HVR (banned words, em dashes, semicolons, Oxford commas, passive voice) count against the Style component of the DQI score and appear in the checklist output of `extract_structure.py`.
 
-<!-- /ANCHOR:configuration -->
-
 ---
 
-<!-- ANCHOR:usage-examples -->
 ## 6. USAGE EXAMPLES
 
 **Score a document and review recommendations**
@@ -339,11 +307,8 @@ python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md
 |# 2 = file read or parse error (check path and input)
 ```
 
-<!-- /ANCHOR:usage-examples -->
-
 ---
 
-<!-- ANCHOR:troubleshooting -->
 ## 7. TROUBLESHOOTING
 
 **DQI score below 60**
@@ -384,11 +349,8 @@ Common causes: Writing that uses prohibited words (robust, seamless, utilize, de
 
 Fix: Read `references/global/hvr_rules.md` for the complete banned word list and prohibited punctuation patterns. Search the document for each violation type using Grep, then rewrite affected sentences. Replace em dashes with commas or parentheses. Replace semicolons with periods or commas. Replace banned words with plain alternatives.
 
-<!-- /ANCHOR:troubleshooting -->
-
 ---
 
-<!-- ANCHOR:faq -->
 ## 8. FAQ
 
 **Q: When should I use sk-doc vs. system-spec-kit?**
@@ -403,11 +365,8 @@ A: No. They serve different purposes. `validate_document.py` is a fast format va
 
 A: A feature catalog documents current behavior. It inventories what a skill or system can do, organized by numbered categories, with source-file anchors and stable slugs. A testing playbook defines how to test that behavior manually. It contains deterministic prompts (exact text to type), expected signals, failure triage steps, and evidence requirements. The two are complementary: the catalog provides the stable capability reference, and the playbook links back to catalog entries via a Cross-Reference Index. Build the catalog first, then use it as the source of truth when writing playbook scenarios.
 
-<!-- /ANCHOR:faq -->
-
 ---
 
-<!-- ANCHOR:related-documents -->
 ## 9. RELATED DOCUMENTS
 
 ||| Resource | Path | Purpose |
@@ -429,5 +388,3 @@ A: A feature catalog documents current behavior. It inventories what a skill or
 ||| sk-git | `.opencode/skills/sk-git/SKILL.md` | Git workflow orchestration |
 ||| CommonMark spec | https://spec.commonmark.org/ | Markdown rendering standard |
 ||| llms.txt spec | https://llmstxt.org/ | LLM navigation format |
-
-<!-- /ANCHOR:related-documents -->

codex
## Iteration 3 — Standards/config + /create consistency

Inspected `template_rules.json`, `core_standards.md`, `test_validator.py`, the requested `/create` YAMLs, `folder_readme.md`, `README.txt`, and a broader TOC/anchor contradiction grep across `sk-doc` + `/create` surfaces.

Ran:
- `python3 -c "import json;json.load(open('.opencode/skills/sk-doc/assets/template_rules.json'))"` — PASS
- `python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py` — PASS, `11/11`
- `python3 -c "import yaml;yaml.safe_load(open(PATH))"` for all six requested `/create` YAMLs — PASS
- `template_rules.json` check — `readme`, `install_guide`, and `playbook` all have `tocRequired:false`; no document type has `tocRequired:true`
- `core_standards.md` check — policy table and summary say `Never` for all document types; no contradictory “Allowed” / “optional TOC” statement found there
- `create_folder_readme_confirm.yaml` checkpoint menu — consistent after `B) Show TABLE OF CONTENTS` removal; `B) Proceed` is the only proceed option in that checkpoint

- [P2] `.opencode/skills/sk-doc/references/global/validation.md:50` — stale validation reference still says missing TOC is blocking.
  Evidence: lines 50-51 list `Missing TOC section | blocking` and `TOC anchor single-dash ... | blocking`, while `template_rules.json` has no `tocRequired:true` and `test_validator.py` now expects `missing_toc.md` and `single_dash_anchors.md` to exit 0. Why: this tells maintainers to fix a violation the validator no longer enforces.

- [P2] `.opencode/skills/sk-doc/README.md:301` — README usage docs still claim `validate_document.py` checks TOC anchors.
  Evidence: line 301 says “checks TOC anchors”; lines 328-330 say missing/single-dash TOCs are common blocking causes and recommend correcting TOC anchor format. Why: this contradicts the new no-TOC policy and the passing tests.

- [P2] `.opencode/skills/sk-doc/assets/skill/skill_asset_template.md:583` — config template still recommends conditional TOC requirements.
  Evidence: the YAML example says `require_toc_when: "lines > 100"`. Why: copied template config can reintroduce TOC requirements despite `core_standards.md` saying TOCs are never used.

- [P2] `.opencode/commands/create/assets/create_folder_readme_auto.yaml:9` — auto README workflow still tells generated docs to include section anchors.
  Evidence: line 9 says documentation files “should include clear section anchors”; line 447 still points to `readme_template.md §12 (Anchor Templates)`. Why: `/create:folder_readme` can still steer README generation toward anchors while `folder_readme.md:471` says READMEs must not include `<!-- ANCHOR -->` comments.

- [P2] `.opencode/commands/create/assets/create_folder_readme_confirm.yaml:12` — confirm README workflow has the same stale anchor guidance.
  Evidence: line 12 says docs should include “clear section anchors”; line 400 references `readme_template.md S12 (Anchor Templates)`. Why: confirm mode remains inconsistent with the command entrypoint’s no-anchor requirement.

- [P2] `.opencode/commands/create/README.txt:21` — command index still contains live `<!-- ANCHOR:... -->` blocks.
  Evidence: anchors remain at lines 21, 32, 43, 69, 99, 112, 134, 170, 189, and 207, with matching closing comments. The commit removed only the TOC anchor block from this file. Why: this inspected `/create` doc still carries the anchor pattern the new standards say not to use, outside the listed carve-outs.

FINDINGS_JSON: {"iteration":3,"dimension":"correctness","p0":0,"p1":0,"p2":6,"verdict":"CONDITIONAL","summary":"Config/tests pass; stale TOC/anchor guidance remains in sk-doc validation docs, one template, and /create surfaces."}
hook: Stop
hook: Stop Completed
tokens used
107,582
## Iteration 3 — Standards/config + /create consistency

Inspected `template_rules.json`, `core_standards.md`, `test_validator.py`, the requested `/create` YAMLs, `folder_readme.md`, `README.txt`, and a broader TOC/anchor contradiction grep across `sk-doc` + `/create` surfaces.

Ran:
- `python3 -c "import json;json.load(open('.opencode/skills/sk-doc/assets/template_rules.json'))"` — PASS
- `python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py` — PASS, `11/11`
- `python3 -c "import yaml;yaml.safe_load(open(PATH))"` for all six requested `/create` YAMLs — PASS
- `template_rules.json` check — `readme`, `install_guide`, and `playbook` all have `tocRequired:false`; no document type has `tocRequired:true`
- `core_standards.md` check — policy table and summary say `Never` for all document types; no contradictory “Allowed” / “optional TOC” statement found there
- `create_folder_readme_confirm.yaml` checkpoint menu — consistent after `B) Show TABLE OF CONTENTS` removal; `B) Proceed` is the only proceed option in that checkpoint

- [P2] `.opencode/skills/sk-doc/references/global/validation.md:50` — stale validation reference still says missing TOC is blocking.
  Evidence: lines 50-51 list `Missing TOC section | blocking` and `TOC anchor single-dash ... | blocking`, while `template_rules.json` has no `tocRequired:true` and `test_validator.py` now expects `missing_toc.md` and `single_dash_anchors.md` to exit 0. Why: this tells maintainers to fix a violation the validator no longer enforces.

- [P2] `.opencode/skills/sk-doc/README.md:301` — README usage docs still claim `validate_document.py` checks TOC anchors.
  Evidence: line 301 says “checks TOC anchors”; lines 328-330 say missing/single-dash TOCs are common blocking causes and recommend correcting TOC anchor format. Why: this contradicts the new no-TOC policy and the passing tests.

- [P2] `.opencode/skills/sk-doc/assets/skill/skill_asset_template.md:583` — config template still recommends conditional TOC requirements.
  Evidence: the YAML example says `require_toc_when: "lines > 100"`. Why: copied template config can reintroduce TOC requirements despite `core_standards.md` saying TOCs are never used.

- [P2] `.opencode/commands/create/assets/create_folder_readme_auto.yaml:9` — auto README workflow still tells generated docs to include section anchors.
  Evidence: line 9 says documentation files “should include clear section anchors”; line 447 still points to `readme_template.md §12 (Anchor Templates)`. Why: `/create:folder_readme` can still steer README generation toward anchors while `folder_readme.md:471` says READMEs must not include `<!-- ANCHOR -->` comments.

- [P2] `.opencode/commands/create/assets/create_folder_readme_confirm.yaml:12` — confirm README workflow has the same stale anchor guidance.
  Evidence: line 12 says docs should include “clear section anchors”; line 400 references `readme_template.md S12 (Anchor Templates)`. Why: confirm mode remains inconsistent with the command entrypoint’s no-anchor requirement.

- [P2] `.opencode/commands/create/README.txt:21` — command index still contains live `<!-- ANCHOR:... -->` blocks.
  Evidence: anchors remain at lines 21, 32, 43, 69, 99, 112, 134, 170, 189, and 207, with matching closing comments. The commit removed only the TOC anchor block from this file. Why: this inspected `/create` doc still carries the anchor pattern the new standards say not to use, outside the listed carve-outs.

FINDINGS_JSON: {"iteration":3,"dimension":"correctness","p0":0,"p1":0,"p2":6,"verdict":"CONDITIONAL","summary":"Config/tests pass; stale TOC/anchor guidance remains in sk-doc validation docs, one template, and /create surfaces."}
