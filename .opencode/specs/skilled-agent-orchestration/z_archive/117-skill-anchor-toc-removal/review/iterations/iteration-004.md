OpenAI Codex v0.133.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: medium
reasoning summaries: none
session id: 019e63eb-43a1-7d40-a575-9809e6abcee7
--------
user
Independent code review (READ-ONLY). You may run git/rg/python3/node for inspection only. Do NOT modify any file.

# Task
Audit git commit `1e58d845af` (TOC + `<!-- ANCHOR -->` removal). Find anything broken **by accident**.

This is **Iteration 4 of 10**. Focus: **carve-out integrity + traceability + security**.

# ALREADY KNOWN (do not re-report)
- P1: orphaned numbered-TOC link lists (~8 files).
- P1: readme_template.md:76,293 stale "optional anchors" guidance.
- P2: stale TOC/anchor guidance in validation.md, sk-doc/README.md, skill_asset_template.md, create_folder_readme_{auto,confirm}.yaml, create/README.txt.
Find OTHER issues.

# This iteration — inspect
1. **Carve-out integrity (over-removal check):** the cleanup was supposed to PRESERVE anchors in `.opencode/skills/system-spec-kit/templates/**` and TOCs in `.opencode/skills/sk-doc/scripts/tests/**`. Confirm the commit did NOT touch/strip those:
   - `git show --stat 1e58d845af -- .opencode/skills/system-spec-kit/templates | head` — expect NO template files in the diff.
   - `rg -l '<!-- ANCHOR' .opencode/skills/system-spec-kit/templates --glob '*.md' | wc -l` — expect > 0 (anchors preserved).
   - `rg -l -i 'table of contents' .opencode/skills/sk-doc/scripts/tests` — expect the fixtures still have TOCs.
   Flag if a carve-out was wrongly stripped (that would be a real regression).
2. **Under-removal in scope:** any non-carve-out skill `*.md` that STILL has a `## TABLE OF CONTENTS` heading or a standalone `<!-- ANCHOR:... -->` / `<!-- /ANCHOR:... -->` comment line that should have been removed. (`rg -n '^#{1,6}\s+.*TABLE OF CONTENTS' .opencode/skills --glob '*.md'` minus carve-outs; `rg -n '^\s*<!--\s*/?ANCHOR:[^>]*-->\s*$' .opencode/skills --glob '*.md'` minus carve-outs.)
3. **Traceability — 117 spec packet accuracy:** read `specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/` spec.md + the 4 children's spec/plan/tasks/implementation-summary. Do the documented claims match the actual change set? Specifically flag any claim that is now FALSE given the orphaned-TOC defect (e.g., "zero TOC headings/anchors in scope" or "no content lost" claims that the orphaned numbered-TOC finding contradicts). Note: the spec packet itself is part of the commit.
4. **Security:** scan the 20 non-md changed files (template_rules.json, test_validator.py, 6 create YAMLs, README.txt, 117 packet json/md) for any accidentally introduced secret, absolute private path leak, injection vector, or permission/allowlist change. Low expectation, but verify.

# Carve-outs — do NOT flag as defects
`system-spec-kit/templates/**` anchors (MUST remain); `sk-doc/scripts/tests/**` TOC fixtures (MUST remain); `research/research.md` ToC; Webflow "Table of Contents" in `sk-code`; inline anchor mentions documenting the live spec-kit anchor system.

# Output (stdout only)
1. "## Iteration 4 — Carve-outs + traceability + security": what was inspected/run + results (state the carve-out counts and under-removal counts explicitly).
2. Per finding: `- [P0|P1|P2] <file>:<line> — <claim>` + evidence + why.
3. If none: "No NEW defects found in this dimension/sample."
4. FINAL LINE exactly:
`FINDINGS_JSON: {"iteration":4,"dimension":"traceability","p0":<n>,"p1":<n>,"p2":<n>,"verdict":"PASS|CONDITIONAL|FAIL","summary":"<<=160 chars"}`

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
SKILL ROUTING: sk-code-review + system-spec-kit surfaced. I’ll use the review stance for findings and keep this read-only; system-spec-kit only matters here as the spec packet context, not as a write workflow.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
name: system-spec-kit
description: "Unified spec-folder workflow + context preservation: Levels 1-3+, validation, Spec Kit Memory. Required for file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.4.1.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, mk-spec-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.

## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:

Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
- **Contents**: Markdown files (spec.md, plan.md, tasks.md, and implementation-summary.md when work is complete) plus optional support folders such as `scratch/`, `research/`, or `review/`

Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze, phase

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.
Status: ✅ This requirement applies immediately once file edits are requested.

### Distributed Governance Rule

Any agent writing authored spec folder docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `review-report.md`, `debug-delegation.md`, `resource-map.md` (optional)) MUST use contract-backed templates through `create.sh` or the inline renderer. This is a workflow-required gate, not a runtime hook: run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after authored spec-doc writes and before completion claims, then route continuity updates through /memory:save. Deep-research workflow-owned packet markdown (`research/iterations/*.md`, `research/deep-research-*.md`, and progressive `research/research.md` loop updates) is exempt from that generic per-write rule; `/deep:start-research-loop` must instead run targeted strict validation after every `spec.md` mutation it performs. @deep-research retains exclusive write access for `research/research.md`; @debug retains exclusive write access for `debug-delegation.md`.

- `handover.md` stays in the canonical recovery ladder and is maintained through `/memory:save` handover_state routing using the handover template for initial creation.
- `review-report.md` remains owned by `@deep-review` when deep review workflows synthesize findings.
- `resource-map.md` is a peer cross-cutting template under `.opencode/skills/system-spec-kit/templates/`; it remains optional at any level and gives reviewers a lean file ledger alongside `implementation-summary.md`.

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest `/memory:save` handover maintenance |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest Task-tool debug delegation |

**Rule:** When detected, proactively suggest the appropriate action.

---

## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
- `references/templates/` for level selection, template selection, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows, shared intake, rename procedures, and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/config/` for runtime environment configuration and launcher/lease contracts.
- `references/hooks/` for prompt-time advisor hooks, runtime hook parity, and hook validation playbooks.

### Template and Script Sources of Truth

- Level definitions and template size guidance: level specifications reference
- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
- Use the Level contract for operational templates; `create.sh` and the Level contract resolver share the same template index.
- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
- Script architecture, build outputs, and runtime entrypoints: [scripts/README.md](./scripts/README.md)
- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
- Nested packet changelog workflow: [nested_changelog.md](./references/workflows/nested_changelog.md)

Primary operational scripts:
- `spec/validate.sh`
- `spec/create.sh`
- `spec/archive.sh`
- `spec/check-completion.sh`
- `spec/recommend-level.sh`
- `mcp_server/lib/templates/level-contract-resolver.ts`

CLI exit codes:
- `0`: success.
- `1`: user error such as bad flags or invalid input.
- `2`: validation error.
- `3`: system error such as missing folders, missing manifests, or file I/O failures.

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match   | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, including `/speckit:plan --intake-only` as the standalone intake entry, `/speckit:plan` and `/speckit:complete` smart delegation notes, and the pointer from `/deep:start-research-loop` to `../deep-research/references/spec_check_protocol.md`, and use this file only to point readers to it rather than duplicating the full matrix.

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, de-duplicates with `seen`, and checks `inventory`.
- Pattern 3: Extensible Routing Key - command and intent signals select routing labels without static file inventories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` asks for disambiguation and missing-resource cases return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows/quick_reference.md"

INTENT_SIGNALS = {
    "PLAN": {"weight": 3, "keywords": ["plan", "design", "new spec", "level selection", "option b"]},
    "RESEARCH": {"weight": 3, "keywords": ["investigate", "explore", "analyze", "prior work", "evidence"]},
    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
    "DEBUG": {"weight": 4, "keywords": ["stuck", "error", "not working", "failed", "debug"]},
    "COMPLETE": {"weight": 4, "keywords": ["done", "complete", "finish", "verify", "checklist"]},
    "MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]},
    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
    "PHASE": {"weight": 4, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased", "multi-session"]},
    "RETRIEVAL_TUNING": {"weight": 3, "keywords": ["retrieval", "search tuning", "fusion", "scoring", "pipeline"]},
    "INTAKE": {"weight": 4, "keywords": ["intake", "folder_state", "start_state", "repair-mode", "intake-only"]},
    "HOOKS": {"weight": 4, "keywords": ["hook", "skill advisor hook", "advisor hook", "prompt-time advisor", "advisor_validate"]},
    "LAUNCHER": {"weight": 4, "keywords": ["launcher", "lease", "pid file", "single-writer", "lease_held_by"]},
    "RENAME": {"weight": 3, "keywords": ["rename", "mechanical refactor", "rename pattern", "git mv", "case variants"]},
    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "tenant", "retention", "audit"]},
}

RESOURCE_MAP = {
    "PLAN": [
        "references/templates/template_guide.md",
        "references/workflows/intake_contract.md",
        "references/validation/template_compliance_contract.md",
    ],
    "RESEARCH": [
        "references/workflows/quick_reference.md",
        "references/workflows/worked_examples.md",
        "references/memory/epistemic_vectors.md",
    ],
    "IMPLEMENT": [
        "references/validation/validation_rules.md",
        "references/validation/template_compliance_contract.md",
        "references/templates/template_guide.md",
    ],
    "DEBUG": [
        "references/debugging/troubleshooting.md",
        "references/workflows/quick_reference.md",
        "manual_testing_playbook/manual_testing_playbook.md",
    ],
    "COMPLETE": [
        "references/validation/validation_rules.md",
        "references/workflows/nested_changelog.md",
        "references/workflows/intake_contract.md",
    ],
    "MEMORY": [
        "references/memory/memory_system.md",
        "references/memory/save_workflow.md",
        "references/memory/trigger_config.md",
    ],
    "HANDOVER": [
        "references/workflows/quick_reference.md",
    ],
    "PHASE": [
        "references/structure/phase_definitions.md",
        "references/structure/sub_folder_versioning.md",
        "references/validation/phase_checklists.md",
    ],
    "RETRIEVAL_TUNING": [
        "references/memory/embedder_architecture.md",
        "references/memory/embedding_resilience.md",
        "references/memory/embedder_pluggability.md",
        "references/memory/trigger_config.md",
    ],
    "INTAKE": [
        "references/workflows/intake_contract.md",
        "references/templates/template_guide.md",
        "references/validation/template_compliance_contract.md",
    ],
    "HOOKS": [
        "references/hooks/skill_advisor_hook.md",
        "references/hooks/skill_advisor_hook_validation.md",
        "references/config/hook_system.md",
    ],
    "LAUNCHER": [
        "references/config/launcher_lease.md",
        "references/memory/memory_system.md",

codex
I’m going straight at the carve-outs first because they can falsify the cleanup’s safety boundary quickly. After that I’ll compare the 117 packet’s claims against the actual commit and run a narrow security scan over the non-md changes.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-code-review/references/review_core.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

---

## 1. OVERVIEW

Shared findings-first review doctrine for both single-pass and deep-review workflows.

---

## 2. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly.

---

## 3. EVIDENCE REQUIREMENTS

- Every `P0` and `P1` finding must include a concrete `file:line` citation.
- Evidence must tie the finding to observed code behavior, not just a general concern.
- `P2` findings should still include specific evidence when available, even if impact is advisory.
- If evidence is incomplete, state the assumption and why the risk still matters.

---

## 4. FINDINGS OUTPUT ORDERING

- Present findings before summary or praise sections.
- Order findings by severity first: `P0`, then `P1`, then `P2`.
- Keep ordering stable within a severity bucket by impact and confidence.
- Separate required fixes from optional suggestions so merge decisions stay clear.

---

## 5. BASELINE + SURFACE PRECEDENCE

Apply this skill as the baseline first, then pair it with `sk-code` surface evidence when available:

- Detected code surface -> `sk-code:<surface>`
- Unclear surfaces -> baseline-only plus explicit uncertainty

Precedence rules:

- Baseline security and correctness minimums are always enforced.
- Surface style, process, build, and test conventions override generic baseline guidance.
- Unclear conflicts must be escalated rather than guessed.

---

## 6. BASELINE CHECK FAMILIES

Mandatory baseline families:

- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling.
- Security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, and reliability risks with security impact.

These minimums cannot be relaxed by surface guidance.

---

## 7. FINDING SCHEMA

Each finding should provide:

| Field | Requirement |
| --- | --- |
| `id` | Stable label within the review report, such as `P1-001` |
| `severity` | One of `P0`, `P1`, `P2` |
| `title` | Short, risk-oriented summary |
| `file` | Primary `path:line` location |
| `evidence` | Plain-language explanation tied to observed code |
| `findingClass` | One of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` |
| `scopeProof` | Grep/test/audit evidence that the recommendation covers same-class sites and consumers, or proves the finding is instance-only |
| `affectedSurfaceHints` | Optional string array of producer/consumer surfaces the fix should address; recommended for actionable findings, required for cross-consumer findings. Use free-form short strings, max about 5 entries. Optional for instance-only findings. |
| `recommendation` | Specific, scope-proportional fix or follow-up |

Suggested shape:

```markdown
### P1-001 [P1] Missing authorization check
- File: path/to/file.ts:42
- Evidence: Request handling reaches the write path before role validation.
- Finding class: cross-consumer
- Scope proof: `rg -n "permission guard|write path" path/to` shows the write handler is the only unchecked consumer.
- Affected surface hints: ["request handler", "write path", "permission guard"]
- Recommendation: Enforce the existing permission guard before mutation.
```

---

## 8. RELATED RESOURCES

- [review_ux_single_pass.md](./review_ux_single_pass.md) - Interactive single-pass report flow and next-step prompts.
- [quick_reference.md](./quick_reference.md) - Lightweight index across baseline review references.
- [security_checklist.md](./security_checklist.md) - Security and reliability checks.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, KISS, DRY, and maintainability checks.

---

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-code-review/references/security_checklist.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Security and Reliability Checklist
description: Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.
---

# Security and Reliability Checklist

Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.

---

## 1. OVERVIEW

### Purpose

Help reviewers prioritize exploitability and business impact, not just code style.

### Core Principle

When impact is unclear, prefer conservative classification and state uncertainty explicitly.

---

## 2. INPUT/OUTPUT SAFETY

Check for:
- XSS via unsafe HTML rendering or template interpolation.
- SQL/NoSQL/command injection via string concatenation.
- SSRF through unvalidated user-controlled URLs.
- Path traversal from unchecked path input (`../`).
- Prototype pollution from unsafe object merge operations.

Review prompts:
- "What untrusted input reaches this sink?"
- "Is validation context-aware for this output channel?"

---

## 3. AUTHENTICATION AND AUTHORIZATION

Check for:
- Missing auth guards on newly added entry points.
- Missing ownership/tenant checks for read/write actions.
- Trust in client-supplied role flags or user IDs.
- IDOR patterns where entity IDs are accepted without authorization.
- Weak token/session validation (`exp`, `iss`, `aud`, algorithm checks).

High-impact rule: any missing authz control on data mutation is at least P1 and often P0.

---

## 4. SECRETS AND PRIVACY

Check for:
- Hardcoded credentials, API keys, tokens, private keys.
- Sensitive logs exposing PII or operational secrets.
- Internal stack traces or environment details in user-facing errors.
- Client-side exposure of server-only configuration values.

Quick command ideas:

```bash
rg -n -i "api[_-]?key|secret|token|password|BEGIN .* PRIVATE KEY"
```

---

## 5. RUNTIME RELIABILITY

Check for:
- Missing timeouts/retries for network dependencies.
- Unbounded loops, recursion, or memory growth.
- Blocking I/O on hot request paths.
- Regex patterns vulnerable to catastrophic backtracking (ReDoS).
- Missing idempotency keys for retry-prone write operations.

Review prompt:
- "What fails under load or partial network failure?"

---

## 6. CONCURRENCY AND RACE CONDITIONS

Flag patterns:
- Check-then-act without atomicity.
- Read-modify-write on shared state without lock/transaction.
- File/system operations split into non-atomic checks and actions.
- Counter updates without atomic increment semantics.
- Distributed coordination without lock/lease guarantees.

Examples:

```text
if not exists(key):
    create(key)

value = get(key)
value += 1
set(key, value)
```

Reviewer questions:
- "What happens if two requests hit this path at the same time?"
- "Is this update atomic across all failure modes?"

---

## 7. RATE LIMITING AND ABUSE PREVENTION

Check for:
- Missing rate limits on authentication endpoints (login, signup, password reset).
- Unthrottled API endpoints accepting expensive operations.
- Missing abuse vectors: account enumeration, credential stuffing, brute force.
- Lack of per-user or per-IP request budgets on public-facing routes.

Review prompt:
- "What stops an attacker from calling this endpoint 10,000 times per second?"

---

## 8. CONTENT SECURITY POLICY AND HEADERS

Check for:
- Missing or overly permissive CSP headers (`unsafe-inline`, `unsafe-eval`, wildcard sources).
- Missing security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.
- CORS misconfiguration: wildcard origins, credentials with broad origins.
- Missing `SameSite` attribute on sensitive cookies.

Review prompt:
- "Could an attacker embed, frame, or inject scripts into this page?"

---

## 9. DEPENDENCY AND SUPPLY CHAIN SECURITY

Check for:
- Known vulnerabilities in dependencies (`npm audit`, `pip-audit`, `cargo audit`).
- Unpinned or loosely pinned dependency versions (major version ranges).
- Dependencies with no maintainer activity or known compromises.
- Post-install scripts in untrusted packages.
- Lock file integrity (committed and consistent with manifest).

Review prompt:
- "Are all dependencies pinned, audited, and from trusted sources?"

---

## 10. AUDIT LOGGING AND OBSERVABILITY

Check for:
- Missing audit logs for security-sensitive operations (auth, permission changes, data deletion).
- Insufficient context in logs (who, what, when, from where).
- Logging sensitive data (passwords, tokens, PII) in plain text.
- Missing alerting for anomalous patterns (repeated auth failures, privilege escalation).

Review prompt:
- "If this action were abused, would we know about it from the logs?"

---

## 11. PRIVACY AND DATA HANDLING

Check for:
- PII stored without encryption at rest or purpose limitation.
- Missing data retention policies or deletion mechanisms.
- Cross-border data transfer without adequate safeguards.
- Excessive data collection beyond stated purpose.
- Missing consent mechanisms for user data processing.

Review prompt:
- "Does this code collect, store, or transmit personal data - and is that justified and protected?"

---

## 12. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md) - Findings-first review flow, severity model, and output contract.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, scaling, and maintainability checks.
- [solid_checklist.md](./solid_checklist.md) - Architecture cohesion and coupling checks.
- [removal_plan.md](./removal_plan.md) - Safe deletion and deferred removal planning.

Surface portability: use this baseline with surface-specific controls from `sk-code`.

exec
/bin/zsh -lc "rg -l '<"'!-- ANCHOR'"' .opencode/skills/system-spec-kit/templates --glob '*.md' | wc -l" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -l -i 'table of contents' .opencode/skills/sk-doc/scripts/tests" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/sk-doc/scripts/tests/valid_install_guide.md
.opencode/skills/sk-doc/scripts/tests/valid_readme.md
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md
.opencode/skills/sk-doc/scripts/tests/missing_toc.md
.opencode/skills/sk-doc/scripts/tests/missing_emojis.md

 succeeded in 0ms:
      26

exec
/bin/zsh -lc 'git show --stat 1e58d845af -- .opencode/skills/system-spec-kit/templates | head' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1589ms:
2026-05-26 12:54:01.320 xcodebuild[10431:53780494]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:54:01.451 xcodebuild[10431:53780491] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-fHeqZJ5d' (errno=Operation not permitted)
2026-05-26 12:54:01.860 xcodebuild[10442:53780542]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:54:01.983 xcodebuild[10442:53780541] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.

codex
The template carve-out looks intact so far: 26 markdown files under `system-spec-kit/templates` still contain anchors, and the sk-doc test fixtures still contain TOC text. Git emits macOS cache warnings in this read-only sandbox, but the command itself completes.
exec
/bin/zsh -lc 'rg --files specs/skilled-agent-orchestration/117-skill-anchor-toc-removal' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/description.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/graph-metadata.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/deep-review-config.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/iterations/iteration-4.raw.txt
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/iterations/iteration-001.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/iterations/iteration-2.raw.txt
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/iterations/iteration-002.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/iterations/iteration-003.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/iterations/iteration-3.raw.txt
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/iterations/iteration-1.raw.txt
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/deep-review-state.jsonl
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/prompts/iteration-4.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/prompts/iteration-1.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/prompts/iteration-2.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/prompts/iteration-3.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/changeset-stat.txt
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/deltas/iter-001.jsonl
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/deltas/iter-003.jsonl
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/deltas/iter-002.jsonl
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/deep-review-findings-registry.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/changeset-files.txt
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/review/deep-review-strategy.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/description.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/strip_toc_anchors.py
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/graph-metadata.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/description.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/description.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/graph-metadata.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/graph-metadata.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/description.json
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/graph-metadata.json

exec
/bin/zsh -lc "rg -n '"'^#{1,6}'"\\s+.*TABLE OF CONTENTS' .opencode/skills --glob '*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n '"'^'"\\s*<"'!--'"\\s*/?ANCHOR:["'^>]*-->'"\\s*"'$'"' .opencode/skills --glob '*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/sk-doc/scripts/tests/valid_install_guide.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/valid_readme.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/single_dash_anchors.md:7:## TABLE OF CONTENTS
.opencode/skills/sk-doc/scripts/tests/missing_emojis.md:7:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/examples/README.md:15:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/README.md:14:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/manifest/README.md:13:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/stress_test/README.md:11:## TABLE OF CONTENTS
.opencode/skills/system-spec-kit/templates/changelog/README.md:13:## TABLE OF CONTENTS

 succeeded in 0ms:
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
.opencode/skills/system-spec-kit/templates/README.md:13:<!-- ANCHOR:table-of-contents -->
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
.opencode/skills/system-spec-kit/templates/manifest/README.md:12:<!-- ANCHOR:table-of-contents -->
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
.opencode/skills/system-spec-kit/templates/stress_test/README.md:10:<!-- ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/stress_test/README.md:22:<!-- /ANCHOR:table-of-contents -->
.opencode/skills/system-spec-kit/templates/changelog/README.md:12:<!-- ANCHOR:table-of-contents -->
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
.opencode/skills/system-spec-kit/templates/examples/README.md:14:<!-- ANCHOR:table-of-contents -->
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

exec
/bin/zsh -lc "git show --name-only --format='' 1e58d845af" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1796ms:
2026-05-26 12:54:10.231 xcodebuild[10978:53781424]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:54:10.366 xcodebuild[10978:53781423] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-19xR1KIp' (errno=Operation not permitted)
2026-05-26 12:54:10.780 xcodebuild[11007:53781472]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-05-26 12:54:10.889 xcodebuild[11007:53781471] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
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
.opencode/skills/sk-prompt-models/README.md
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

exec
/bin/zsh -lc "find specs/skilled-agent-orchestration/117-skill-anchor-toc-removal -maxdepth 2 \\( -name spec.md -o -name plan.md -o -name tasks.md -o -name implementation-summary.md \\) -print | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md

exec
/bin/zsh -lc "rg -n '"'^'"\\s*<"'!--'"\\s*/?ANCHOR:["'^>]*-->'"\\s*"'$'"' .opencode/skills --glob '*.md' | rg -v '"'^'"\\.opencode/skills/system-spec-kit/templates/' | rg -v '"'^'"\\.opencode/skills/sk-doc/scripts/tests/' || true" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "rg -n '"'^#{1,6}'"\\s+.*TABLE OF CONTENTS' .opencode/skills --glob '*.md' | rg -v '"'^'"\\.opencode/skills/system-spec-kit/templates/' | rg -v '"'^'"\\.opencode/skills/sk-doc/scripts/tests/' || true" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "git show --name-only --format='' 1e58d845af 2>/dev/null | rg -v '"'^$'"' | rg -v '\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1405ms:
.opencode/commands/create/README.txt
.opencode/commands/create/assets/create_feature_catalog_auto.yaml
.opencode/commands/create/assets/create_feature_catalog_confirm.yaml
.opencode/commands/create/assets/create_folder_readme_auto.yaml
.opencode/commands/create/assets/create_folder_readme_confirm.yaml
.opencode/commands/create/assets/create_testing_playbook_auto.yaml
.opencode/commands/create/assets/create_testing_playbook_confirm.yaml
.opencode/skills/sk-doc/assets/template_rules.json
.opencode/skills/sk-doc/scripts/tests/test_validator.py
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/strip_toc_anchors.py
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/graph-metadata.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/description.json
.opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/graph-metadata.json

codex
Under-removal after excluding the two carve-out zones is clean: 0 remaining `## TABLE OF CONTENTS` headings and 0 standalone `<!-- ANCHOR... -->` lines in `.opencode/skills/**/*.md`. Now I’m checking whether the spec packet overclaims that result despite the already-known orphaned numbered lists.
exec
/bin/zsh -lc "rg -n -i 'zero|0\\b|table of contents|\\bTOC\\b|anchor|content lost|no content|preserve|complete|completed|verification|scope' specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/*/{spec.md,plan.md,tasks.md,implementation-summary.md}" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:2:title: "Feature Specification: Verification & Reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:3:description: "Prove zero TOC/anchor residue in scope, confirm content safety, validate, and reconcile completion metadata across the 117 packet."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:5:  - "toc anchor cleanup verification"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:11:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:12:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:14:    recent_action: "Verified zero residue + content safety across the change set"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:18:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:22:# Feature Specification: Verification & Reconciliation
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:29:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:39:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:43:<!-- ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:47:A large mechanical change set (≈860 files) needs proof that it removed only TOC/anchor scaffolding,
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:51:Run full-coverage residual + content-safety verification, validate changed docs, and reconcile the
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:53:<!-- /ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:57:<!-- ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:58:## 3. SCOPE
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:60:### In Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:61:- Residual greps (TOC headings, standalone anchors) across in-scope files.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:62:- Content-safety: classify every removed diff line; confirm zero non-TOC/anchor/whitespace removals from the bulk pass.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:64:- Independent verification dispatch (CLI-Devin/SWE-1.6).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:67:### Out of Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:68:- Any further content edits beyond fixing defects verification surfaces.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:75:<!-- /ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:79:<!-- ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:82:### P0 - Blockers (MUST complete)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:86:| REQ-001 | Zero residue | 0 TOC headings + 0 standalone anchors in scope |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:87:| REQ-002 | Content safe | 0 unclassified removed lines attributable to the bulk pass |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:90:### P1 - Required (complete OR user-approved deferral)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:95:| REQ-005 | Independent check | CLI-Devin/SWE-1.6 verification attempted; result recorded |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:96:<!-- /ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:100:<!-- ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:105:<!-- /ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:109:<!-- ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:115:| Dependency | Phases 001-003 complete | — | Done |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:116:<!-- /ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:120:<!-- ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md:124:<!-- /ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:2:title: "Feature Specification: Bulk Comment-Anchor Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:3:description: "Remove all standalone ANCHOR / /ANCHOR HTML comment delimiters from in-scope skill markdown, preserving the consumed spec-kit template anchors."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:5:  - "bulk anchor comment removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:6:  - "remove ANCHOR comments from skills"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:11:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:12:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:14:    recent_action: "Removed standalone anchor comments from skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:18:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:22:# Feature Specification: Bulk Comment-Anchor Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:29:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:35:| **Priority** | P0 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:39:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:43:<!-- ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:47:~688 in-scope skill markdown files carry `ANCHOR:name` / `/ANCHOR:name` HTML
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:49:must be preserved where tooling consumes them (the spec-kit spec-folder generation templates).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:52:Delete every standalone anchor-comment line from in-scope files via the shared transform's
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:53:`--anchors` mode, while carving out `system-spec-kit/templates/**` (a consumed generation standard).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:54:<!-- /ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:58:<!-- ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:59:## 3. SCOPE
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:61:### In Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:63:- Whole-line `ANCHOR:...` and `/ANCHOR:...` comments.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:65:### Out of Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:66:- `system-spec-kit/templates/**` (anchors consumed by spec/memory generation + indexing).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:68:- Inline anchor *mentions* inside prose/backticks/code-fences that document the live spec-kit
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:69:  anchor system (these reference, not declare, anchors).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:76:| `.opencode/skills/**/*.md` (~673) | Modify | Delete standalone anchor comments |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:77:<!-- /ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:81:<!-- ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:84:### P0 - Blockers (MUST complete)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:88:| REQ-001 | Standalone anchor comments removed | Zero whole-line `<!-- /?ANCHOR -->` in scope |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:89:| REQ-002 | Carve-out preserved | `system-spec-kit/templates/**` anchors intact |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:90:| REQ-003 | Idempotent | Second run = 0 changes |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:92:### P1 - Required (complete OR user-approved deferral)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:96:| REQ-004 | No tooling breakage | No script/MCP consumes skill-doc anchors (verified) |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:97:<!-- /ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:101:<!-- ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:104:- **SC-001**: Zero standalone anchor-comment lines remain in scope.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:105:- **SC-002**: Spec-kit template anchors (26 files) preserved; live anchor-system docs intact.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:106:<!-- /ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:110:<!-- ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:116:| Risk | Removing anchors documented as consumed | Broken docs | Carve out templates; preserve doc mentions of the spec-kit anchor system |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:118:<!-- /ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:122:<!-- ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/spec.md:126:<!-- /ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:2:title: "Implementation Plan: Bulk Comment-Anchor Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:3:description: "Plan for removing standalone ANCHOR comments from in-scope skill markdown via the shared transform."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:5:  - "anchor comment removal plan"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:13:    recent_action: "Removed standalone anchor comments from skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:17:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:21:# Implementation Plan: Bulk Comment-Anchor Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:28:<!-- ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:36:| **Tool** | `strip_toc_anchors.py --anchors` |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:41:The shared transform's `--anchors` mode deletes any whole-line `ANCHOR:...` /
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:42:`/ANCHOR:...` comment (fence-agnostic, since removing a self-contained comment line from
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:43:an example block is harmless and shows the new pattern). It runs on the same in-scope list as
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:45:anchors (the consumers operate on spec/memory artifacts under `.opencode/specs/`).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:46:<!-- /ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:50:<!-- ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:54:- [x] Confirmed no consumer reads skill-doc anchors
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:58:- [x] Zero standalone anchor comments in scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:59:- [x] Carve-out anchors preserved (26 spec-kit template files)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:61:<!-- /ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:65:<!-- ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:69:Whole-line filter: drop lines matching `^\s*<!--\s*/?ANCHOR:[^>]*-->\s*$`, then normalize blanks.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:72:- `strip_anchors(lines)` — line filter.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:76:read → strip_anchors → collapse → write iff changed.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:77:<!-- /ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:81:<!-- ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:85:- [x] Confirm no anchor consumers in sk-doc/create/skill scripts
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:89:- [x] Run `--anchors` on in-scope list (673 changed); idempotent
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:93:- [x] Confirm remaining mentions are documentation of the live spec-kit anchor system
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:94:<!-- /ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:98:<!-- ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:101:| Test Type | Scope | Tools |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:103:| Residual | Zero standalone anchors | python whole-line scan |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:104:| Glued markers | None inline | `rg '\S<!--.*ANCHOR\|ANCHOR.*-->\S'` |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:105:| Carve-out | Templates intact | `rg -l '<!-- ANCHOR' templates` |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:106:<!-- /ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:110:<!-- ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:117:<!-- /ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:121:<!-- ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:124:- **Trigger**: A consumed anchor removed, or doc rendering broken.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/plan.md:126:<!-- /ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:2:title: "Feature Specification: Bulk TOC Block Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:3:description: "Deterministically remove every ## TABLE OF CONTENTS block from all in-scope skill markdown files, leaving body content and headings intact."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:5:  - "bulk toc removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:6:  - "remove table of contents blocks"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:11:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:12:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:14:    recent_action: "Removed all TOC blocks from in-scope skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:18:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:22:# Feature Specification: Bulk TOC Block Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:29:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:35:| **Priority** | P0 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:39:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:43:<!-- ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:47:384 in-scope skill markdown files carry a `## TABLE OF CONTENTS` block (heading plus a list of anchor links). These add maintenance burden and the user wants them removed.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:50:Remove every TOC block from in-scope files via one idempotent, fence-aware transform, deleting the heading and its link list while preserving all body content and real section headings.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:51:<!-- /ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:55:<!-- ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:56:## 3. SCOPE
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:58:### In Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:60:- The `## TABLE OF CONTENTS` heading + its bullet list + a wrapping `ANCHOR:table-of-contents`.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:62:### Out of Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:63:- `ANCHOR` comments generally (handled in phase 003).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:64:- Example TOCs shown *inside* fenced code blocks (preserved — fence-aware).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:71:| `.opencode/skills/**/*.md` (~384) | Modify | Delete TOC blocks |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:72:| `002-toc-removal/strip_toc_anchors.py` | Create | Shared transform tool |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:73:<!-- /ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:77:<!-- ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:80:### P0 - Blockers (MUST complete)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:84:| REQ-001 | TOC blocks removed | `rg -l -i "table of contents"` in scope → 0 (outside fences) |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:85:| REQ-002 | No body content lost | `git diff` shows only TOC heading/list + wrapper deletions and blank collapses |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:88:### P1 - Required (complete OR user-approved deferral)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:92:| REQ-004 | Independent verification | CLI-Devin/SWE-1.6 sample sweep confirms no collateral edits |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:93:<!-- /ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:97:<!-- ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:100:- **SC-001**: Zero `## TABLE OF CONTENTS` headings remain in scope (outside code fences).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:102:<!-- /ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:106:<!-- ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:111:| Risk | Over-deletion past TOC | Body content lost | Stop at first non-blank/non-bullet/non-anchor line; fence-aware |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:112:| Risk | Example TOC in a code fence | Damaged example | Skip transformations inside fenced code blocks |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:114:<!-- /ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:118:<!-- ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/spec.md:122:<!-- /ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:2:title: "Tasks: Bulk Comment-Anchor Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:3:description: "Task breakdown for bulk comment-anchor removal."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:5:  - "003-anchor-comment-removal tasks"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:13:    recent_action: "Removed standalone anchor comments from skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:17:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:21:# Tasks: Bulk Comment-Anchor Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:28:<!-- ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:34:| `[x]` | Completed |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:37:<!-- /ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:41:<!-- ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:44:- [x] T001 Verify no script consumes skill-doc anchors
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:46:<!-- /ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:50:<!-- ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:53:- [x] T003 Run --anchors (673 files changed)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:55:<!-- /ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:59:<!-- ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:60:## Phase 3: Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:63:- [x] T006 Confirm carve-out + live-anchor-system docs intact
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:64:<!-- /ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:68:<!-- ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:73:- [x] Verification passed
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:74:<!-- /ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:78:<!-- ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/tasks.md:83:<!-- /ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:2:title: "Tasks: Bulk TOC Block Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:3:description: "Task breakdown for bulk toc block removal."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:5:  - "002-toc-removal tasks"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:13:    recent_action: "Removed all TOC blocks from in-scope skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:17:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:21:# Tasks: Bulk TOC Block Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:28:<!-- ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:34:| `[x]` | Completed |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:37:<!-- /ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:41:<!-- ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:44:- [x] T001 Author strip_toc_anchors.py (fence-aware, gated rewrite)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:46:<!-- /ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:50:<!-- ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:53:- [x] T003 Build in-scope file list minus carve-outs
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:54:- [x] T004 Run --toc (362 files changed)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:56:<!-- /ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:60:<!-- ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:61:## Phase 3: Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:65:- [x] T008 Verify zero TOC headings in scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:66:<!-- /ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:70:<!-- ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:75:- [x] Verification passed
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:76:<!-- /ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:80:<!-- ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/tasks.md:85:<!-- /ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:2:title: "Implementation Plan: Verification & Reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:3:description: "Plan for full-coverage residual + content-safety verification and 117 packet metadata reconciliation."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:5:  - "verification reconciliation plan"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:13:    recent_action: "Verified zero residue + content safety across the change set"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:17:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:21:# Implementation Plan: Verification & Reconciliation
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:28:<!-- ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:36:| **Coverage** | All in-scope files + full git diff |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:39:Verify the change set with deterministic, full-coverage checks: zero residue, every removed diff
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:40:line classified as TOC/anchor/whitespace (attributed per file), validator + test suite green, and
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:42:<!-- /ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:46:<!-- ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:50:- [x] Phases 001-003 complete
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:53:- [x] Zero residue; zero unclassified bulk removals
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:57:<!-- /ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:61:<!-- ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:65:Layered verification: residual greps → diff classification → tool validation → independent review → reconcile.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:73:<!-- /ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:77:<!-- ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:81:- [x] 0 TOC headings, 0 standalone anchors in scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:82:- [x] Classify all removed diff lines; 0 unclassified from bulk pass
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:86:- [x] `validate_document.py` on changed READMEs (exit 0)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:94:<!-- /ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:98:<!-- ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:101:| Test Type | Scope | Tools |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:103:| Residual | Zero TOC/anchor | ripgrep |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:107:<!-- /ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:111:<!-- ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:118:<!-- /ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:122:<!-- ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:125:- **Trigger**: Verification finds a defect.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:126:- **Procedure**: Fix the specific file(s); re-run the affected checks; do not broaden scope.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/plan.md:127:<!-- /ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:3:description: "Flip sk-doc TOC standards, strip TOC/anchors from doc templates, and set tocRequired:false so the bulk cleanup in phases 002/003 is durable and not regenerated."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:5:  - "sk-doc toc standards"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:7:  - "strip toc from templates"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:12:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:13:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:15:    recent_action: "Updated standards/templates/config to forbid TOC"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:19:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:30:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:36:| **Priority** | P0 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:40:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:44:<!-- ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:48:The sk-doc standards, doc templates, and `template_rules.json` config currently mandate or allow `## TABLE OF CONTENTS` blocks and treat `ANCHOR` markers as recommended. If the bulk cleanup (phases 002/003) ran without first changing these, cleaned docs would be re-flagged by `validate_document.py` (`missing_toc` is a blocking error for readme/install_guide/playbook) and regenerated docs would reintroduce TOCs.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:51:Change the source of truth FIRST so TOC/anchor removal is durable: set `tocRequired:false` for the three types that require it, strip TOC + anchors from the sk-doc doc templates, and remove the TOC mandate from creation references and the two `create/` command contracts.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:52:<!-- /ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:56:<!-- ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:57:## 3. SCOPE
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:59:### In Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:61:- `sk-doc/references/global/core_standards.md` — TOC policy table + summary → Never for all types.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:62:- Strip TOC blocks + `ANCHOR` markers from the 5 sk-doc doc templates.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:63:- Update `readme_creation.md`, `feature_catalog_creation.md`, `manual_testing_playbook_creation.md`, `workflows.md` prose that mandates TOC/anchors.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:64:- Remove TOC requirement from `.opencode/commands/create/feature-catalog.md` and `.opencode/commands/create/testing-playbook.md`.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:66:### Out of Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:67:- `validate_document.py` logic changes — flipping config flags is sufficient; TOC checks are gated on `tocRequired`.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:68:- `system-spec-kit/templates/**` anchors — carved out (consumed generation standard).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:75:| `.opencode/skills/sk-doc/references/global/core_standards.md` | Modify | TOC policy → Never |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:76:| `.opencode/skills/sk-doc/assets/readme/readme_template.md` | Modify | Strip TOC + anchors |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:77:| `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | Modify | Strip TOC |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:78:| `.opencode/skills/sk-doc/assets/readme/install_guide_template.md` | Modify | Strip TOC |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:79:| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | Modify | Strip TOC |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:80:| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Modify | Strip TOC |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:81:| `.opencode/skills/sk-doc/references/readme_creation.md` | Modify | Remove TOC/anchor mandate |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:82:| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Modify | Remove TOC mandate |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:83:| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Modify | Remove TOC mandate |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:84:| `.opencode/skills/sk-doc/references/global/workflows.md` | Modify | Drop TOC/anchor validation step |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:85:| `.opencode/commands/create/feature-catalog.md` | Modify | Remove TOC requirement |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:86:| `.opencode/commands/create/testing-playbook.md` | Modify | Remove TOC requirement |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:87:<!-- /ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:91:<!-- ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:94:### P0 - Blockers (MUST complete)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:98:| REQ-001 | TOC no longer required by validator | `tocRequired:false` for readme/install_guide/playbook; `validate_document.py` exits 0 on a TOC-less README |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:99:| REQ-002 | Doc templates ship no TOC/anchors | The 5 sk-doc templates contain no `## TABLE OF CONTENTS` and no `ANCHOR` |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:100:| REQ-003 | Standards say "no TOC" | core_standards.md TOC policy is Never across types |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:102:### P1 - Required (complete OR user-approved deferral)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:106:| REQ-004 | Creation refs + command contracts updated | No prose mandates a TOC in readme/feature-catalog/playbook creation refs or the two create commands |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:107:<!-- /ANCHOR:requirements -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:111:<!-- ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:114:- **SC-001**: A README with no TOC passes `validate_document.py` (exit 0).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:115:- **SC-002**: Grep of the 5 templates shows zero TOC headings and zero anchor comments.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:116:<!-- /ANCHOR:success-criteria -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:120:<!-- ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:125:| Risk | Validator has a non-config TOC code path | TOC still enforced | Verified: TOC checks gated on `tocRequired`; confirm via test run |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:127:<!-- /ANCHOR:risks -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:131:<!-- ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/spec.md:135:<!-- /ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:13:    recent_action: "Updated standards/templates/config to forbid TOC"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:17:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:28:<!-- ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:34:| `[x]` | Completed |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:37:<!-- /ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:41:<!-- ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:46:<!-- /ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:50:<!-- ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:54:- [x] T004 Update core_standards TOC policy to Never
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:55:- [x] T005 Strip TOC/anchors from the sk-doc doc templates
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:56:- [x] T006 Remove TOC mandates from creation references + create-command contracts/YAMLs
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:57:<!-- /ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:61:<!-- ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:62:## Phase 3: Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:65:- [x] T008 Confirm TOC-less README passes validate_document.py
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:66:<!-- /ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:70:<!-- ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:75:- [x] Verification passed
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:76:<!-- /ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:80:<!-- ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/tasks.md:85:<!-- /ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:2:title: "Feature Specification: Skill Anchor + TOC Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:3:description: "Remove Table of Contents blocks and HTML comment anchors from all skill docs, and update sk-doc standards/templates/config so they are not reintroduced."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:5:  - "skill anchor toc removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:6:  - "remove table of contents from skills"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:7:  - "remove anchors from skill docs"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:12:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:13:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:15:    recent_action: "All four phases complete; cleanup verified"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:20:      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:23:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:26:      - "Anchor scope: remove both TOC blocks AND ANCHOR comment delimiters"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:27:      - "File scope: comprehensive — references/, assets/, feature_catalog/, manual_testing_playbook/, and root docs"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:28:      - "Execution: deterministic script primary; CLI-Devin/SWE-1.6 for edge cases + verification"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:34:# Feature Specification: Skill Anchor + TOC Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:36:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:43:| **Status** | Complete |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:50:| **Handoff Criteria** | All in-scope skill docs free of TOC blocks + comment anchors; sk-doc standards/templates/config no longer reintroduce them; verification proves zero residue |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:51:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:55:<!-- ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:60:wants removed: `## TABLE OF CONTENTS` blocks (384 in-scope files) and `ANCHOR:name` HTML
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:61:comment delimiters (~688 in-scope files). A naive delete would regress because the sk-doc standards,
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:66:Remove TOC blocks and comment anchors from all in-scope skill markdown, AND flip the source of
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:71:<!-- /ANCHOR:problem -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:75:<!-- ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:76:## 3. SCOPE
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:78:### In Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:81:- `.opencode/commands/create/feature-catalog.md` and `.opencode/commands/create/testing-playbook.md` TOC requirements.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:83:### Out of Scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:84:- `.opencode/skills/system-spec-kit/templates/**` — spec-folder generation templates whose `ANCHOR` markers are a consumed generation standard (carved out, preserved).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:85:- All non-markdown source files (`.py`, `.js`, `.ts`, `.sh`) — anchor-parsing/emitting code is untouched.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:95:| `sk-doc/references/global/core_standards.md` | Modify | 001 | TOC policy → Never for all types |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:96:| `sk-doc/assets/**` templates (5) | Modify | 001 | Strip TOC + anchors from doc templates |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:97:| `sk-doc/references/*creation.md` + `commands/create/*.md` | Modify | 001 | Remove TOC mandate from prose/contracts |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:98:| `.opencode/skills/**/*.md` (~384 TOC, ~688 anchor) | Modify | 002, 003 | Bulk-remove TOC blocks + comment anchors |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:99:<!-- /ANCHOR:scope -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:103:<!-- ANCHOR:phase-map -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:110:| 1 | `001-standards-templates-config/` | Flip standards/templates/config first (regression prevention) | Complete |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:111:| 2 | `002-toc-removal/` | Bulk-remove `## TABLE OF CONTENTS` blocks across in-scope files | Complete |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:112:| 3 | `003-anchor-comment-removal/` | Bulk-remove `ANCHOR` comment delimiters across in-scope files | Complete |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:113:| 4 | `004-verification-reconciliation/` | Prove zero residue, validate, reconcile completion metadata | Complete |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:118:- Phase 001 (standards) MUST complete before 002/003 (bulk edits) to prevent regression
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:119:- Use `/spec_kit:resume specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/[NNN-phase]/` to resume
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:123:| From | To | Criteria | Verification |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:125:| 001 | 002 | `tocRequired:false` set; standards/templates stripped | `validate_document.py` exit 0 on a sample README |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:126:| 002 | 003 | Zero `## TABLE OF CONTENTS` in scope | `rg -l -i "table of contents"` → only carve-outs |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:127:| 003 | 004 | Zero `ANCHOR` in scope | `rg -l -- "<!-- ANCHOR"` → only spec-kit/templates |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:129:<!-- /ANCHOR:phase-map -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:133:<!-- ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:136:- None open. Scope decisions resolved at planning (see frontmatter `answered_questions`).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:137:<!-- /ANCHOR:questions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md:143:- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:2:title: "Implementation Plan: Bulk TOC Block Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:3:description: "Plan for the idempotent fence-aware transform that removes all TOC blocks from in-scope skill markdown."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:5:  - "bulk toc removal plan"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:13:    recent_action: "Removed all TOC blocks from in-scope skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:17:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:21:# Implementation Plan: Bulk TOC Block Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:28:<!-- ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:36:| **Tool** | `strip_toc_anchors.py --toc` |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:37:| **Scope list** | `rg --files .opencode/skills -g '*.md'` minus carve-outs |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:41:A single fence-aware transform removes the `## TABLE OF CONTENTS` heading and its link list
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:42:(plus a wrapping `ANCHOR:table-of-contents`). It stops at the first non-blank/non-bullet/
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:43:non-anchor line so body content and real headings survive. A TOC that sat between two `---` rules
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:45:<!-- /ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:49:<!-- ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:57:- [x] Zero `## TABLE OF CONTENTS` headings in scope (outside fences)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:58:- [x] Idempotent (second run = 0 changes)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:60:<!-- /ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:64:<!-- ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:71:- `strip_toc(lines)` — fence-aware TOC block excision + redundant bounding-rule drop.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:77:<!-- /ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:81:<!-- ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:85:- [x] Author `strip_toc_anchors.py`; test on cli-gemini README, codex playbook, feature catalog, template
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:89:- [x] Run `--toc` on in-scope list (362 files changed)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:95:<!-- /ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:99:<!-- ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:102:| Test Type | Scope | Tools |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:104:| Residual | Zero TOC headings | `rg '^#+ .*TABLE OF CONTENTS'` |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:107:<!-- /ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:111:<!-- ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:118:<!-- /ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:122:<!-- ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/plan.md:127:<!-- /ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:3:description: "Plan for flipping sk-doc TOC config/standards and stripping TOC/anchors from doc templates as the regression-prevention foundation for phases 002/003."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:11:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:12:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:14:    recent_action: "Updated standards/templates/config to forbid TOC"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:18:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:29:<!-- ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:42:Edit the source of truth before any bulk cleanup. The validator gates TOC enforcement on
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:44:touching Python. Then strip TOC blocks + anchors from the five sk-doc doc templates and remove
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:45:TOC-mandate prose from creation references and the two `create/` command contracts.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:46:<!-- /ANCHOR:summary -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:50:<!-- ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:54:- [x] Confirmed which types have `tocRequired:true` (readme L54, install_guide L245, playbook L440)
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:55:- [x] Confirmed validator gates TOC checks on `tocRequired`
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:60:- [ ] Five templates stripped of TOC + anchors
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:62:- [ ] `validate_document.py` exits 0 on a TOC-less README
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:63:<!-- /ANCHOR:quality-gates -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:67:<!-- ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:75:- **template_rules.json**: per-type `tocRequired` flag — the single lever for TOC enforcement.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:76:- **core_standards.md**: human-facing TOC policy table.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:82:3. With `tocRequired:false`, TOC-less docs pass; templates without TOC produce TOC-less docs.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:83:<!-- /ANCHOR:architecture -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:87:<!-- ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:92:- [ ] Update core_standards.md TOC policy table + summary to Never
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:95:- [ ] Strip TOC + anchors from readme_template, readme_code_template, install_guide_template, feature_catalog_template, manual_testing_playbook_template
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:99:- [ ] Remove TOC requirement from create/feature-catalog.md + create/testing-playbook.md
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:101:<!-- /ANCHOR:phases -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:105:<!-- ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:108:| Test Type | Scope | Tools |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:110:| Config | TOC no longer required | `validate_document.py <README>` exit 0 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:111:| Grep | Templates clean | `rg "table of contents\|<!-- ANCHOR"` on the 5 templates |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:112:<!-- /ANCHOR:testing -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:116:<!-- ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:123:<!-- /ANCHOR:dependencies -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:127:<!-- ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/plan.md:132:<!-- /ANCHOR:rollback -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:2:title: "Implementation Summary: Verification & Reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:3:description: "Full-coverage residual + content-safety verification of the TOC/anchor cleanup, plus 117 packet metadata reconciliation."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:5:  - "verification reconciliation summary"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:13:    recent_action: "Verified zero residue and content safety"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:17:    completion_pct: 90
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:21:# Implementation Summary: Verification & Reconciliation
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:28:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:33:| **Spec Folder** | 117-skill-anchor-toc-removal/004-verification-reconciliation |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:34:| **Completed** | 2026-05-26 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:36:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:40:<!-- ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:43:A layered verification of the ≈860-file change set, plus reconciliation of the 117 packet's
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:46:### Verification performed
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:50:| `## TABLE OF CONTENTS` headings in scope | 0 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:51:| Standalone `<!-- /?ANCHOR -->` lines in scope | 0 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:52:| Carve-outs intact | 26 spec-kit template files + 5 sk-doc fixtures preserved |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:54:| Removed-line classification (full diff) | Every removal from the bulk pass is a TOC heading, TOC link, anchor comment, blank, or rule; 0 unclassified attributable to the mechanical pass |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:55:| `validate_document.py` on changed READMEs | Exit 0 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:58:<!-- /ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:62:<!-- ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:65:Layered verification: residual greps, full-diff per-file classification, validator and test-suite runs, an independent Devin dispatch, then strict packet validation.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:66:<!-- /ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:70:<!-- ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:76:| Treat the Devin permission block as non-fatal | Deterministic verification fully covers the content-safety claim |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:77:<!-- /ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:81:<!-- ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:82:## Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:86:| Residual | Pass | 0 TOC headings, 0 standalone anchors in scope |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:87:| Content safety | Pass | 0 unclassified bulk-pass removals |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:90:<!-- /ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:94:<!-- ANCHOR:limitations -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:97:1. Independent CLI-Devin verification was inconclusive due to its non-interactive permission model; the deterministic full-coverage check supersedes it.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:98:<!-- /ANCHOR:limitations -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:2:title: "Implementation Summary: Bulk Comment-Anchor Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:3:description: "Removed standalone ANCHOR comments from 673 in-scope skill markdown files; preserved spec-kit template anchors and live anchor-system documentation."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:5:  - "anchor comment removal summary"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:13:    recent_action: "Removed standalone anchor comments from skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:14:    next_safe_action: "Proceed to phase 004 (verification + reconciliation)"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:17:      - "specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/strip_toc_anchors.py"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:18:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:22:# Implementation Summary: Bulk Comment-Anchor Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:29:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:34:| **Spec Folder** | 117-skill-anchor-toc-removal/003-anchor-comment-removal |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:35:| **Completed** | 2026-05-26 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:37:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:41:<!-- ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:44:The shared transform's `--anchors` mode deleted every standalone `ANCHOR:name` /
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:45:`/ANCHOR:name` comment line from in-scope skill markdown (673 files). The carve-out
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:46:`system-spec-kit/templates/**` (26 files) was preserved because its anchors are consumed by
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:54:| `.opencode/skills/**/*.md` (673) | Modified | Standalone anchor comments removed |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:56:<!-- /ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:60:<!-- ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:63:Ran the shared transform in --anchors mode, preserved the consumed spec-kit template anchors, and fixed the one glued marker the whole-line regex could not reach.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:64:<!-- /ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:68:<!-- ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:73:| Fence-agnostic anchor removal | A self-contained comment line is harmless to drop even inside an example; shows the new pattern |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:74:| Preserve `system-spec-kit/templates/**` | Tooling (strip_templates.py, research extraction, memory indexing) consumes those anchors |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:75:| Keep inline anchor *mentions* | Prose/commands documenting the live spec-kit anchor system reference, not declare, anchors |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:76:<!-- /ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:80:<!-- ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:81:## Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:85:| Residual scan | Pass | 0 standalone anchor-comment lines in scope |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:86:| Carve-out | Pass | 26 spec-kit template files retain anchors |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:88:| Consumer check | Pass | No sk-doc/create/skill script parses skill-doc anchors |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:89:<!-- /ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:93:<!-- ANCHOR:limitations -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:96:1. Documentation of the spec-kit anchor system (grep/sed examples, validation-rule descriptions) is intentionally retained — that system remains live for spec/memory docs.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal/implementation-summary.md:97:<!-- /ANCHOR:limitations -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:2:title: "Tasks: Verification & Reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:3:description: "Task breakdown for verification & reconciliation."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:5:  - "004-verification-reconciliation tasks"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:13:    recent_action: "Verified zero residue + content safety across the change set"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:17:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:21:# Tasks: Verification & Reconciliation
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:28:<!-- ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:34:| `[x]` | Completed |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:37:<!-- /ANCHOR:notation -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:41:<!-- ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:44:- [x] T001 Confirm 0 TOC headings, 0 standalone anchors in scope
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:46:<!-- /ANCHOR:phase-1 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:50:<!-- ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:53:- [x] T003 Classify every removed diff line; 0 unclassified from bulk pass
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:56:<!-- /ANCHOR:phase-2 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:60:<!-- ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:61:## Phase 3: Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:66:<!-- /ANCHOR:phase-3 -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:70:<!-- ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:75:- [x] Verification passed
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:76:<!-- /ANCHOR:completion -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:80:<!-- ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md:85:<!-- /ANCHOR:cross-refs -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:3:description: "Flipped sk-doc TOC config/standards, stripped TOC/anchors from doc templates, and removed TOC mandates from creation references and create-command contracts."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:13:    recent_action: "Flipped TOC config/standards and templates"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:14:    next_safe_action: "Proceed to phase 002 (bulk TOC removal)"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:19:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:30:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:35:| **Spec Folder** | 117-skill-anchor-toc-removal/001-standards-templates-config |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:36:| **Completed** | 2026-05-26 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:38:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:42:<!-- ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:45:Changed the source of truth so TOC/anchor removal is durable. `validate_document.py` gates TOC
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:47:Python change. Doc templates were stripped of TOC blocks; creation references and the `/create`
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:48:command contracts no longer mandate a TOC.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:55:| `sk-doc/references/global/core_standards.md` | Modified | TOC policy → Never for all types |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:56:| `sk-doc/assets/readme/readme_template.md` | Modified | Removed TOC block + guidance row |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:57:| `sk-doc/assets/readme/readme_code_template.md` | Modified | Removed TOC block |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:58:| `sk-doc/assets/readme/install_guide_template.md` | Modified | Removed TOC block + checklist row |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:59:| `sk-doc/assets/feature_catalog/feature_catalog_template.md` | Modified | Removed TOC block + prose/checklist mandates |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:60:| `sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Modified | Removed TOC block + checklist row |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:61:| `sk-doc/assets/skill/skill_readme_template.md` | Modified | Removed TOC block + guidance row |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:62:| `sk-doc/references/{readme,feature_catalog,manual_testing_playbook,benchmark}_creation.md` | Modified | Removed TOC mandates/examples |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:63:| `sk-doc/references/global/workflows.md` | Modified | Dropped TOC/anchor validation step |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:64:| `sk-doc/scripts/tests/test_validator.py` | Modified | Updated 2 cases for no-TOC policy |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:65:| `.opencode/commands/create/**` (8 files) | Modified | Removed TOC generation/validation instructions |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:66:<!-- /ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:70:<!-- ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:74:<!-- /ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:78:<!-- ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:84:| Carve out `system-spec-kit/templates/**` | Their anchors are a consumed spec/memory generation standard |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:85:| Preserve sk-doc/scripts/tests fixtures | They are validator test data; tests updated instead |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:87:<!-- /ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:91:<!-- ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:92:## Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:96:| Validator behavior | Pass | TOC-less README exits 0; TOC no longer required |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:98:| Grep | Pass | No TOC mandate remains in sk-doc templates/standards/create commands |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:99:<!-- /ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:103:<!-- ANCHOR:limitations -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:106:1. `system-spec-kit` SKILL.md retains a ToC policy exception for `research/research.md` (spec-artifact domain, intentionally out of scope).
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:107:2. Webflow web-component references named "Table of Contents" in `sk-code` are unrelated (a web UI feature) and untouched.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/001-standards-templates-config/implementation-summary.md:108:<!-- /ANCHOR:limitations -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:2:title: "Implementation Summary: Bulk TOC Block Removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:3:description: "Removed 362 TOC blocks from in-scope skill markdown via a fence-aware transform; collapsed 96 double-rule artifacts; cleaned 2 fenced examples and 4 obsolete playbook scenarios."
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:5:  - "bulk toc removal summary"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:10:    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:11:    last_updated_at: "2026-05-26T00:00:00Z"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:13:    recent_action: "Removed all TOC blocks from skill markdown"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:14:    next_safe_action: "Proceed to phase 003 (anchor-comment removal)"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:17:      - "specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/strip_toc_anchors.py"
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:18:    completion_pct: 100
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:22:# Implementation Summary: Bulk TOC Block Removal
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:29:<!-- ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:34:| **Spec Folder** | 117-skill-anchor-toc-removal/002-toc-removal |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:35:| **Completed** | 2026-05-26 |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:37:<!-- /ANCHOR:metadata -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:41:<!-- ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:44:A reusable Python transform (`strip_toc_anchors.py`) removed every `## TABLE OF CONTENTS` block
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:45:from in-scope skill markdown. The `--toc` pass changed 362 files; `--collapse-rules` fixed 96
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:46:double-`---` artifacts left where a TOC sat between two horizontal rules. Two fenced-example TOCs
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:53:| `002-toc-removal/strip_toc_anchors.py` | Created | Shared fence-aware transform (`--toc`/`--anchors`/`--collapse-rules`) |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:54:| `.opencode/skills/**/*.md` (362) | Modified | TOC blocks removed |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:56:| `cli-claude-code` + `cli-opencode` playbooks | Modified | 4 scenarios no longer assert generated READMEs contain a TOC |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:57:<!-- /ANCHOR:what-built -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:61:<!-- ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:64:Ran a deterministic Python transform, verified zero residual TOC headings and idempotency, and confirmed sampled changed READMEs pass validate_document.py.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:65:<!-- /ANCHOR:how-delivered -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:69:<!-- ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:74:| Fence-aware TOC removal | Real document TOCs are never fenced; illustrative fenced examples are handled manually |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:77:<!-- /ANCHOR:decisions -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:81:<!-- ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:82:## Verification
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:86:| Residual grep | Pass | 0 `## TABLE OF CONTENTS` headings in scope |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:87:| Idempotency | Pass | Second `--toc` run = 0 changes |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:88:| Doc validity | Pass | Sampled changed READMEs exit 0 under `validate_document.py` |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:89:| Artifact check | Pass | 0 double-`---` artifacts remain |
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:90:<!-- /ANCHOR:verification -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:94:<!-- ANCHOR:limitations -->
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:97:1. TOC anchor *link* lines died with their TOC blocks (intended) — no in-body cross-references used them.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:98:2. Numbered TOC entries in fenced install-guide examples were handled in phase 001 template edits.
specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md:99:<!-- /ANCHOR:limitations -->

exec
/bin/zsh -lc 'git show --unified=0 --no-ext-diff 1e58d845af -- $(git show --name-only --format='"'' 1e58d845af 2>/dev/null | rg -v '"'^$'"' | rg -v '\\.md"'$'"') 2>/dev/null | rg -n -i 'api[_-]?key|secret|token|password|passwd|credential|private key|BEGIN .*PRIVATE|/Users/|/home/|chmod|permission|allowlist|denylist|shell|exec|eval|subprocess|os\\.system|child_process|dangerously|innerHTML|\\"'$'"\\{|\\{\\{|"'!!|write|delete|remove|rm -rf|curl|http://'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'git show --stat --oneline 1e58d845af -- .opencode/skills/system-spec-kit/templates 2>/dev/null | head' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "git show --stat --oneline 1e58d845af 2>/dev/null | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1451ms:
 succeeded in 1605ms:
1e58d845af docs(117): remove TOC blocks + HTML anchor comments from skill docs
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
 .../deep-agent-improvement/scripts/README.md       |  24 ---
 .../deep-agent-improvement/scripts/lib/README.md   |   7 -
 .../deep-agent-improvement/scripts/tests/README.md |  24 ---
 .opencode/skills/deep-ai-council/README.md         |  56 ------
 .../feature_catalog/FEATURE_CATALOG.md             |  15 --
 .../manual_testing_playbook.md                     |  22 ---
 .opencode/skills/deep-ai-council/scripts/README.md |  24 ---
 .../skills/deep-ai-council/scripts/lib/README.md   |  24 ---
 .../skills/deep-ai-council/scripts/tests/README.md |   7 -
 .opencode/skills/deep-loop-runtime/README.md       |  41 ----
 .../skills/deep-loop-runtime/database/README.md    |   7 -
 .../01--executor/01-executor-config.md             |   9 -
 .../01--executor/02-executor-audit.md              |   8 -
 .../01--executor/03-fallback-router.md             |   9 -
 .../02--prompt-rendering/01-prompt-pack.md         |   9 -
 .../03--validation/01-post-dispatch-validate.md    |   8 -
 .../04--state-safety/01-atomic-state.md            |   9 -
 .../04--state-safety/02-jsonl-repair.md            |   9 -
 .../04--state-safety/03-loop-lock.md               |   9 -
 .../04--state-safety/04-permissions-gate.md        |   9 -
 .../05--scoring/01-bayesian-scorer.md              |   9 -
 .../06--coverage-graph/01-coverage-graph-db.md     |   8 -
 .../06--coverage-graph/02-coverage-graph-query.md  |   9 -
 .../03-coverage-graph-signals.md                   |   8 -
 .../01-convergence-script.md                       |   8 -
 .../07--script-entry-points/02-upsert-script.md    |   8 -
 .../07--script-entry-points/03-query-script.md     |   9 -
 .../07--script-entry-points/04-status-script.md    |   8 -
 .../08--council/01-multi-seat-dispatch.md          |   7 -
 .../08--council/02-round-state-jsonl.md            |   7 -
 .../08--council/03-adjudicator-verdict-scoring.md  |   7 -
 .../feature_catalog/08--council/04-cost-guards.md  |   7 -
 .../08--council/05-session-state-hierarchy.md      |   7 -
 .../feature_catalog/feature_catalog.md             |  27 ---
 .opencode/skills/deep-loop-runtime/lib/README.md   |   6 -
 .../skills/deep-loop-runtime/lib/council/README.md |   7 -
 .../deep-loop-runtime/lib/coverage-graph/README.md |   7 -
 .../manual_testing_playbook.md                     |  21 --
 .../skills/deep-loop-runtime/scripts/README.md     |   8 -
 .opencode/skills/deep-loop-runtime/tests/README.md |   8 -
 .../deep-loop-runtime/tests/council/README.md      |   6 -
 .../tests/fixtures/council-value/README.md         |  26 ---
 .../tests/fixtures/council-value/data/README.md    |  26 ---
 .../deep-loop-runtime/tests/helpers/README.md      |   6 -
 .../deep-loop-runtime/tests/integration/README.md  |   6 -
 .../deep-loop-runtime/tests/lifecycle/README.md    |   6 -
 .../skills/deep-loop-runtime/tests/unit/README.md  |   6 -
 .opencode/skills/deep-research/README.md           |  26 ---
 .../feature_catalog/feature_catalog.md             |  10 -
 .../manual_testing_playbook.md                     |  27 ---
 .opencode/skills/deep-research/scripts/README.md   |  24 ---
 .opencode/skills/deep-review/README.md             |  44 -----
 .../deep-review/feature_catalog/feature_catalog.md |  10 -
 .../manual_testing_playbook.md                     |  27 ---
 .opencode/skills/deep-review/scripts/README.md     |  24 ---

 succeeded in 2795ms:
5:    docs(117): remove TOC blocks + HTML anchor comments from skill docs
30:-- [6. EXECUTION MODES](#6--execution-modes)
516:+      "remove table of contents blocks",
525:+      "remove",
593:+        "name": "Purpose Remove",
689:+    "causal_summary": "Remove every TOC block from in-scope files via one idempotent, fence-aware transform, deleting the heading and its link list while preserving all body content and real section headings.",
709:+"""Remove TABLE OF CONTENTS blocks and/or <!-- ANCHOR --> comment lines from markdown.
722:+- Anchor-comment removal deletes any whole-line `<!-- ANCHOR:... -->` / `<!-- /ANCHOR:... -->`.
736:+# TOC heading: H1-H6, optional leading emoji/symbol token, "TABLE OF CONTENTS" | "CONTENTS" | "TOC"
753:+    """Remove TOC blocks (fence-aware). Returns new line list."""
783:+    """Remove all whole-line <!-- ANCHOR --> comment lines (fence-agnostic)."""
802:+    A TOC removed from between two `---` rules leaves exactly this artifact."""
859:+    removed = False
862:+        removed = removed or (len(new) != len(lines))
866:+        removed = removed or (len(new) != len(lines))
870:+        removed = removed or (len(new) != len(lines))
872:+    # Only rewrite (and tidy whitespace left by removals) when something was
873:+    # actually removed — never touch files with no TOC/anchor/rule artifact,
875:+    if not removed:
884:+    ap.add_argument('--toc', action='store_true', help='Remove TABLE OF CONTENTS blocks')
885:+    ap.add_argument('--anchors', action='store_true', help='Remove <!-- ANCHOR --> comment lines')
888:+    ap.add_argument('--dry-run', action='store_true', help='Report files that would change; do not write')
912:+                    f.write(new)
967:+      "remove ANCHOR comments from skills",
977:+      "remove",
984:+      "delete"
1050:+        "name": "Purpose Delete",
1128:+    "causal_summary": "Delete every standalone anchor-comment line from in-scope files via the shared transform's",
1361:+    "causal_summary": "A large mechanical change set (≈860 files) needs proof that it removed only TOC/anchor scaffolding,",
1427:+      "remove table of contents from skills",
1428:+      "remove anchors from skill docs"
1435:+      "remove",
1483:+        "name": "Remove Table",

exec
/bin/zsh -lc "nl -ba specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/spec.md | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal/implementation-summary.md | sed -n '40,100p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	
    41	<!-- ANCHOR:what-built -->
    42	## What Was Built
    43	
    44	A reusable Python transform (`strip_toc_anchors.py`) removed every `## TABLE OF CONTENTS` block
    45	from in-scope skill markdown. The `--toc` pass changed 362 files; `--collapse-rules` fixed 96
    46	double-`---` artifacts left where a TOC sat between two horizontal rules. Two fenced-example TOCs
    47	(in sk-doc templates/references) and four obsolete playbook scenarios were corrected by hand.
    48	
    49	### Files Changed
    50	
    51	| File | Action | Purpose |
    52	|------|--------|---------|
    53	| `002-toc-removal/strip_toc_anchors.py` | Created | Shared fence-aware transform (`--toc`/`--anchors`/`--collapse-rules`) |
    54	| `.opencode/skills/**/*.md` (362) | Modified | TOC blocks removed |
    55	| `sk-doc/assets/skill/skill_readme_template.md`, `sk-doc/references/benchmark_creation.md` | Modified | Fenced-example TOCs removed |
    56	| `cli-claude-code` + `cli-opencode` playbooks | Modified | 4 scenarios no longer assert generated READMEs contain a TOC |
    57	<!-- /ANCHOR:what-built -->
    58	
    59	---
    60	
    61	<!-- ANCHOR:how-delivered -->
    62	## How It Was Delivered
    63	
    64	Ran a deterministic Python transform, verified zero residual TOC headings and idempotency, and confirmed sampled changed READMEs pass validate_document.py.
    65	<!-- /ANCHOR:how-delivered -->
    66	
    67	---
    68	
    69	<!-- ANCHOR:decisions -->
    70	## Key Decisions
    71	
    72	| Decision | Rationale |
    73	|----------|-----------|
    74	| Fence-aware TOC removal | Real document TOCs are never fenced; illustrative fenced examples are handled manually |
    75	| Gated rewrite (only if removed) | Avoids cosmetic-only whitespace churn across the tree |
    76	| Deterministic script over LLM | Mechanical line deletion is more reliable + fully verifiable |
    77	<!-- /ANCHOR:decisions -->
    78	
    79	---
    80	
    81	<!-- ANCHOR:verification -->
    82	## Verification
    83	
    84	| Test Type | Status | Notes |
    85	|-----------|--------|-------|
    86	| Residual grep | Pass | 0 `## TABLE OF CONTENTS` headings in scope |
    87	| Idempotency | Pass | Second `--toc` run = 0 changes |
    88	| Doc validity | Pass | Sampled changed READMEs exit 0 under `validate_document.py` |
    89	| Artifact check | Pass | 0 double-`---` artifacts remain |
    90	<!-- /ANCHOR:verification -->
    91	
    92	---
    93	
    94	<!-- ANCHOR:limitations -->
    95	## Known Limitations
    96	
    97	1. TOC anchor *link* lines died with their TOC blocks (intended) — no in-body cross-references used them.
    98	2. Numbered TOC entries in fenced install-guide examples were handled in phase 001 template edits.
    99	<!-- /ANCHOR:limitations -->

 succeeded in 0ms:
     1	---
     2	title: "Feature Specification: Skill Anchor + TOC Removal"
     3	description: "Remove Table of Contents blocks and HTML comment anchors from all skill docs, and update sk-doc standards/templates/config so they are not reintroduced."
     4	trigger_phrases:
     5	  - "skill anchor toc removal"
     6	  - "remove table of contents from skills"
     7	  - "remove anchors from skill docs"
     8	importance_tier: "important"
     9	contextType: "implementation"
    10	_memory:
    11	  continuity:
    12	    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal"
    13	    last_updated_at: "2026-05-26T00:00:00Z"
    14	    last_updated_by: "claude-opus-4-7"
    15	    recent_action: "All four phases complete; cleanup verified"
    16	    next_safe_action: "Commit the change set (on request)"
    17	    blockers: []
    18	    key_files: []
    19	    session_dedup:
    20	      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
    21	      session_id: "session-117-init"
    22	      parent_session_id: null
    23	    completion_pct: 100
    24	    open_questions: []
    25	    answered_questions:
    26	      - "Anchor scope: remove both TOC blocks AND ANCHOR comment delimiters"
    27	      - "File scope: comprehensive — references/, assets/, feature_catalog/, manual_testing_playbook/, and root docs"
    28	      - "Execution: deterministic script primary; CLI-Devin/SWE-1.6 for edge cases + verification"
    29	---
    30	
    31	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
    32	<!-- SPECKIT_LEVEL: 2 -->
    33	
    34	# Feature Specification: Skill Anchor + TOC Removal
    35	
    36	<!-- ANCHOR:metadata -->
    37	## 1. METADATA
    38	
    39	| Field | Value |
    40	|-------|-------|
    41	| **Level** | 2 (phase parent) |
    42	| **Priority** | P1 |
    43	| **Status** | Complete |
    44	| **Created** | 2026-05-26 |
    45	| **Branch** | `main` |
    46	| **Parent Spec** | `../spec.md` |
    47	| **Parent Packet** | skilled-agent-orchestration |
    48	| **Predecessor** | skilled-agent-orchestration/116-deep-skill-evolution |
    49	| **Successor** | None |
    50	| **Handoff Criteria** | All in-scope skill docs free of TOC blocks + comment anchors; sk-doc standards/templates/config no longer reintroduce them; verification proves zero residue |
    51	<!-- /ANCHOR:metadata -->
    52	
    53	---
    54	
    55	<!-- ANCHOR:problem -->
    56	## 2. PROBLEM & PURPOSE
    57	
    58	### Problem Statement
    59	Skill documentation under `.opencode/skills/` has accumulated navigational scaffolding the user
    60	wants removed: `## TABLE OF CONTENTS` blocks (384 in-scope files) and `ANCHOR:name` HTML
    61	comment delimiters (~688 in-scope files). A naive delete would regress because the sk-doc standards,
    62	templates, and `template_rules.json` config currently mandate/allow these — cleaned docs would be
    63	re-flagged by `validate_document.py` or regenerated with TOCs.
    64	
    65	### Purpose
    66	Remove TOC blocks and comment anchors from all in-scope skill markdown, AND flip the source of
    67	truth (standards + templates + validator config) first so the removal is durable and future
    68	generation stays clean.
    69	
    70	> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and continuity live in the child phase folders listed in the Phase Documentation Map below.
    71	<!-- /ANCHOR:problem -->
    72	
    73	---
    74	
    75	<!-- ANCHOR:scope -->
    76	## 3. SCOPE
    77	
    78	### In Scope
    79	- All markdown under `.opencode/skills/**`: `references/`, `assets/` (incl. sk-doc doc templates), `feature_catalog/`, `manual_testing_playbook/`, and root docs (`README.md`, `ARCHITECTURE.md`, `SKILL.md`, etc.).
    80	- sk-doc standards (`core_standards.md`), creation references, and `template_rules.json` `tocRequired` flags.
    81	- `.opencode/commands/create/feature-catalog.md` and `.opencode/commands/create/testing-playbook.md` TOC requirements.
    82	
    83	### Out of Scope
    84	- `.opencode/skills/system-spec-kit/templates/**` — spec-folder generation templates whose `ANCHOR` markers are a consumed generation standard (carved out, preserved).
    85	- All non-markdown source files (`.py`, `.js`, `.ts`, `.sh`) — anchor-parsing/emitting code is untouched.
    86	- Spec instances/research artifacts under `.opencode/specs/**` and `specs/**` (except this 117 packet).
    87	- The `.opencode/specs/skilled-agent-orchestration/` mirror.
    88	
    89	### Files to Change
    90	Per-phase detail lives in each child's plan.md. Summary:
    91	
    92	| File Path | Change Type | Phase | Description |
    93	|-----------|-------------|-------|-------------|
    94	| `sk-doc/assets/template_rules.json` | Modify | 001 | Flip `tocRequired` false for readme/install_guide/playbook |
    95	| `sk-doc/references/global/core_standards.md` | Modify | 001 | TOC policy → Never for all types |
    96	| `sk-doc/assets/**` templates (5) | Modify | 001 | Strip TOC + anchors from doc templates |
    97	| `sk-doc/references/*creation.md` + `commands/create/*.md` | Modify | 001 | Remove TOC mandate from prose/contracts |
    98	| `.opencode/skills/**/*.md` (~384 TOC, ~688 anchor) | Modify | 002, 003 | Bulk-remove TOC blocks + comment anchors |
    99	<!-- /ANCHOR:scope -->
   100	
   101	---
   102	
   103	<!-- ANCHOR:phase-map -->
   104	## PHASE DOCUMENTATION MAP
   105	
   106	> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.
   107	
   108	| Phase | Folder | Focus | Status |
   109	|-------|--------|-------|--------|
   110	| 1 | `001-standards-templates-config/` | Flip standards/templates/config first (regression prevention) | Complete |
   111	| 2 | `002-toc-removal/` | Bulk-remove `## TABLE OF CONTENTS` blocks across in-scope files | Complete |
   112	| 3 | `003-anchor-comment-removal/` | Bulk-remove `ANCHOR` comment delimiters across in-scope files | Complete |
   113	| 4 | `004-verification-reconciliation/` | Prove zero residue, validate, reconcile completion metadata | Complete |
   114	
   115	### Phase Transition Rules
   116	
   117	- Each phase MUST pass `validate.sh` independently before the next phase begins
   118	- Phase 001 (standards) MUST complete before 002/003 (bulk edits) to prevent regression
   119	- Use `/spec_kit:resume specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/[NNN-phase]/` to resume
   120	
   121	### Phase Handoff Criteria
   122	
   123	| From | To | Criteria | Verification |
   124	|------|-----|----------|--------------|
   125	| 001 | 002 | `tocRequired:false` set; standards/templates stripped | `validate_document.py` exit 0 on a sample README |
   126	| 002 | 003 | Zero `## TABLE OF CONTENTS` in scope | `rg -l -i "table of contents"` → only carve-outs |
   127	| 003 | 004 | Zero `ANCHOR` in scope | `rg -l -- "<!-- ANCHOR"` → only spec-kit/templates |
   128	| 004 | done | All checks green; metadata reconciled | `validate.sh --strict` on packet |
   129	<!-- /ANCHOR:phase-map -->
   130	
   131	---
   132	
   133	<!-- ANCHOR:questions -->
   134	## 4. OPEN QUESTIONS
   135	
   136	- None open. Scope decisions resolved at planning (see frontmatter `answered_questions`).
   137	<!-- /ANCHOR:questions -->
   138	
   139	---
   140	
   141	## RELATED DOCUMENTS
   142	
   143	- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
   144	- **Parent Spec**: See `../spec.md`
   145	- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

 succeeded in 0ms:
     1	---
     2	title: "Implementation Summary: Verification & Reconciliation"
     3	description: "Full-coverage residual + content-safety verification of the TOC/anchor cleanup, plus 117 packet metadata reconciliation."
     4	trigger_phrases:
     5	  - "verification reconciliation summary"
     6	importance_tier: "normal"
     7	contextType: "implementation"
     8	_memory:
     9	  continuity:
    10	    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation"
    11	    last_updated_at: "2026-05-26T00:00:00Z"
    12	    last_updated_by: "claude-opus-4-7"
    13	    recent_action: "Verified zero residue and content safety"
    14	    next_safe_action: "Generate metadata, run validate.sh --strict, finalize parent statuses"
    15	    blockers: []
    16	    key_files: []
    17	    completion_pct: 90
    18	    open_questions: []
    19	    answered_questions: []
    20	---
    21	# Implementation Summary: Verification & Reconciliation
    22	
    23	<!-- SPECKIT_LEVEL: 1 -->
    24	<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
    25	
    26	---
    27	
    28	<!-- ANCHOR:metadata -->
    29	## Metadata
    30	
    31	| Field | Value |
    32	|-------|-------|
    33	| **Spec Folder** | 117-skill-anchor-toc-removal/004-verification-reconciliation |
    34	| **Completed** | 2026-05-26 |
    35	| **Level** | 1 |
    36	<!-- /ANCHOR:metadata -->
    37	
    38	---
    39	
    40	<!-- ANCHOR:what-built -->
    41	## What Was Built
    42	
    43	A layered verification of the ≈860-file change set, plus reconciliation of the 117 packet's
    44	completion metadata.
    45	
    46	### Verification performed
    47	
    48	| Check | Result |
    49	|-------|--------|
    50	| `## TABLE OF CONTENTS` headings in scope | 0 |
    51	| Standalone `<!-- /?ANCHOR -->` lines in scope | 0 |
    52	| Carve-outs intact | 26 spec-kit template files + 5 sk-doc fixtures preserved |
    53	| Non-md files changed | Exactly the intended set (template_rules.json, test_validator.py, 6 create YAMLs, README.txt) |
    54	| Removed-line classification (full diff) | Every removal from the bulk pass is a TOC heading, TOC link, anchor comment, blank, or rule; 0 unclassified attributable to the mechanical pass |
    55	| `validate_document.py` on changed READMEs | Exit 0 |
    56	| sk-doc validator suite | 11/11 |
    57	| CLI-Devin/SWE-1.6 sweep | Dispatched (auth OK); `auto` mode blocked non-interactive `git diff`, so the full-coverage deterministic classification is the authoritative content-safety proof |
    58	<!-- /ANCHOR:what-built -->
    59	
    60	---
    61	
    62	<!-- ANCHOR:how-delivered -->
    63	## How It Was Delivered
    64	
    65	Layered verification: residual greps, full-diff per-file classification, validator and test-suite runs, an independent Devin dispatch, then strict packet validation.
    66	<!-- /ANCHOR:how-delivered -->
    67	
    68	---
    69	
    70	<!-- ANCHOR:decisions -->
    71	## Key Decisions
    72	
    73	| Decision | Rationale |
    74	|----------|-----------|
    75	| Per-file diff classification over a Devin sample | Full coverage of all changed files is stronger proof than an 8-file LLM sweep |
    76	| Treat the Devin permission block as non-fatal | Deterministic verification fully covers the content-safety claim |
    77	<!-- /ANCHOR:decisions -->
    78	
    79	---
    80	
    81	<!-- ANCHOR:verification -->
    82	## Verification
    83	
    84	| Test Type | Status | Notes |
    85	|-----------|--------|-------|
    86	| Residual | Pass | 0 TOC headings, 0 standalone anchors in scope |
    87	| Content safety | Pass | 0 unclassified bulk-pass removals |
    88	| Tooling | Pass | validate_document.py + validator suite green |
    89	| Packet | Pass | `validate.sh --strict` on parent + children (see run log) |
    90	<!-- /ANCHOR:verification -->
    91	
    92	---
    93	
    94	<!-- ANCHOR:limitations -->
    95	## Known Limitations
    96	
    97	1. Independent CLI-Devin verification was inconclusive due to its non-interactive permission model; the deterministic full-coverage check supersedes it.
    98	<!-- /ANCHOR:limitations -->

exec
/bin/zsh -lc "nl -ba specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/tasks.md | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Tasks: Verification & Reconciliation"
     3	description: "Task breakdown for verification & reconciliation."
     4	trigger_phrases:
     5	  - "004-verification-reconciliation tasks"
     6	importance_tier: "normal"
     7	contextType: "implementation"
     8	_memory:
     9	  continuity:
    10	    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation"
    11	    last_updated_at: "2026-05-26T00:00:00Z"
    12	    last_updated_by: "claude-opus-4-7"
    13	    recent_action: "Verified zero residue + content safety across the change set"
    14	    next_safe_action: "Finalize parent statuses and close packet"
    15	    blockers: []
    16	    key_files: []
    17	    completion_pct: 100
    18	    open_questions: []
    19	    answered_questions: []
    20	---
    21	# Tasks: Verification & Reconciliation
    22	
    23	<!-- SPECKIT_LEVEL: 1 -->
    24	<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
    25	
    26	---
    27	
    28	<!-- ANCHOR:notation -->
    29	## Task Notation
    30	
    31	| Prefix | Meaning |
    32	|--------|---------|
    33	| `[ ]` | Pending |
    34	| `[x]` | Completed |
    35	| `[P]` | Parallelizable |
    36	| `[B]` | Blocked |
    37	<!-- /ANCHOR:notation -->
    38	
    39	---
    40	
    41	<!-- ANCHOR:phase-1 -->
    42	## Phase 1: Setup
    43	
    44	- [x] T001 Confirm 0 TOC headings, 0 standalone anchors in scope
    45	- [x] T002 Confirm carve-outs + intended non-md file set
    46	<!-- /ANCHOR:phase-1 -->
    47	
    48	---
    49	
    50	<!-- ANCHOR:phase-2 -->
    51	## Phase 2: Implementation
    52	
    53	- [x] T003 Classify every removed diff line; 0 unclassified from bulk pass
    54	- [x] T004 validate_document.py + validator suite green
    55	- [x] T005 Dispatch CLI-Devin/SWE-1.6 sweep (recorded outcome)
    56	<!-- /ANCHOR:phase-2 -->
    57	
    58	---
    59	
    60	<!-- ANCHOR:phase-3 -->
    61	## Phase 3: Verification
    62	
    63	- [x] T006 Generate description.json + graph-metadata.json
    64	- [x] T007 validate.sh --strict on packet
    65	- [x] T008 Reconcile parent statuses + continuity
    66	<!-- /ANCHOR:phase-3 -->
    67	
    68	---
    69	
    70	<!-- ANCHOR:completion -->
    71	## Completion Criteria
    72	
    73	- [x] All tasks marked `[x]`
    74	- [x] No `[B]` blocked tasks remaining
    75	- [x] Verification passed
    76	<!-- /ANCHOR:completion -->
    77	
    78	---
    79	
    80	<!-- ANCHOR:cross-refs -->
    81	## Cross-References
    82	
    83	- **Specification**: See `spec.md`
    84	- **Plan**: See `plan.md`
    85	<!-- /ANCHOR:cross-refs -->

exec
/bin/zsh -lc "nl -ba specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/spec.md | sed -n '1,110p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Feature Specification: Verification & Reconciliation"
     3	description: "Prove zero TOC/anchor residue in scope, confirm content safety, validate, and reconcile completion metadata across the 117 packet."
     4	trigger_phrases:
     5	  - "toc anchor cleanup verification"
     6	  - "reconcile 117 packet"
     7	importance_tier: "normal"
     8	contextType: "implementation"
     9	_memory:
    10	  continuity:
    11	    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation"
    12	    last_updated_at: "2026-05-26T00:00:00Z"
    13	    last_updated_by: "claude-opus-4-7"
    14	    recent_action: "Verified zero residue + content safety across the change set"
    15	    next_safe_action: "Finalize parent statuses and close packet"
    16	    blockers: []
    17	    key_files: []
    18	    completion_pct: 100
    19	    open_questions: []
    20	    answered_questions: []
    21	---
    22	# Feature Specification: Verification & Reconciliation
    23	
    24	<!-- SPECKIT_LEVEL: 1 -->
    25	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
    26	
    27	---
    28	
    29	<!-- ANCHOR:metadata -->
    30	## 1. METADATA
    31	
    32	| Field | Value |
    33	|-------|-------|
    34	| **Level** | 1 |
    35	| **Priority** | P1 |
    36	| **Status** | In Progress |
    37	| **Created** | 2026-05-26 |
    38	| **Branch** | `main` |
    39	<!-- /ANCHOR:metadata -->
    40	
    41	---
    42	
    43	<!-- ANCHOR:problem -->
    44	## 2. PROBLEM & PURPOSE
    45	
    46	### Problem Statement
    47	A large mechanical change set (≈860 files) needs proof that it removed only TOC/anchor scaffolding,
    48	that standards no longer reintroduce them, and that the test suites stay green.
    49	
    50	### Purpose
    51	Run full-coverage residual + content-safety verification, validate changed docs, and reconcile the
    52	117 packet's completion metadata.
    53	<!-- /ANCHOR:problem -->
    54	
    55	---
    56	
    57	<!-- ANCHOR:scope -->
    58	## 3. SCOPE
    59	
    60	### In Scope
    61	- Residual greps (TOC headings, standalone anchors) across in-scope files.
    62	- Content-safety: classify every removed diff line; confirm zero non-TOC/anchor/whitespace removals from the bulk pass.
    63	- `validate_document.py` on changed READMEs + the validator test suite.
    64	- Independent verification dispatch (CLI-Devin/SWE-1.6).
    65	- `validate.sh --strict` on the 117 packet; metadata + status reconciliation.
    66	
    67	### Out of Scope
    68	- Any further content edits beyond fixing defects verification surfaces.
    69	
    70	### Files to Change
    71	
    72	| File Path | Change Type | Description |
    73	|-----------|-------------|-------------|
    74	| `117-*/**` spec docs + metadata | Modify/Create | Reconcile statuses + generate description/graph-metadata |
    75	<!-- /ANCHOR:scope -->
    76	
    77	---
    78	
    79	<!-- ANCHOR:requirements -->
    80	## 4. REQUIREMENTS
    81	
    82	### P0 - Blockers (MUST complete)
    83	
    84	| ID | Requirement | Acceptance Criteria |
    85	|----|-------------|---------------------|
    86	| REQ-001 | Zero residue | 0 TOC headings + 0 standalone anchors in scope |
    87	| REQ-002 | Content safe | 0 unclassified removed lines attributable to the bulk pass |
    88	| REQ-003 | Tests green | sk-doc validator suite passes (11/11) |
    89	
    90	### P1 - Required (complete OR user-approved deferral)
    91	
    92	| ID | Requirement | Acceptance Criteria |
    93	|----|-------------|---------------------|
    94	| REQ-004 | Packet validates | `validate.sh --strict` passes on parent + children |
    95	| REQ-005 | Independent check | CLI-Devin/SWE-1.6 verification attempted; result recorded |
    96	<!-- /ANCHOR:requirements -->
    97	
    98	---
    99	
   100	<!-- ANCHOR:success-criteria -->
   101	## 5. SUCCESS CRITERIA
   102	
   103	- **SC-001**: All residual + content-safety checks pass.
   104	- **SC-002**: Packet completion metadata reconciled and strict-validated.
   105	<!-- /ANCHOR:success-criteria -->
   106	
   107	---
   108	
   109	<!-- ANCHOR:risks -->
   110	## 6. RISKS & DEPENDENCIES

exec
/bin/zsh -lc "rg -n '"'^'"\\d+\\. \\[.*\\]\\(#.*\\)' .opencode/skills --glob '*.md' | rg -v '"'^'"\\.opencode/skills/system-spec-kit/templates/' | rg -v '"'^'"\\.opencode/skills/sk-doc/scripts/tests/'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/mcp-chrome-devtools/examples/README.md:16:1. [OVERVIEW](#1--overview)
.opencode/skills/mcp-chrome-devtools/examples/README.md:17:2. [PREREQUISITES](#2--prerequisites)
.opencode/skills/mcp-chrome-devtools/examples/README.md:18:3. [AVAILABLE SCRIPTS](#3--available-scripts)
.opencode/skills/mcp-chrome-devtools/examples/README.md:22:4. [COMMON PATTERNS](#4--common-patterns)
.opencode/skills/mcp-chrome-devtools/examples/README.md:23:5. [CUSTOMIZATION TIPS](#5--customization-tips)
.opencode/skills/mcp-chrome-devtools/examples/README.md:24:6. [TROUBLESHOOTING](#6--troubleshooting)
.opencode/skills/mcp-chrome-devtools/examples/README.md:25:7. [SEE ALSO](#7--see-also)
.opencode/skills/mcp-chrome-devtools/examples/README.md:26:8. [CONTRIBUTING](#8--contributing)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:53:0. [AI-First Install Guide](#0-ai-first-install-guide)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:54:1. [Overview](#1-overview)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:55:2. [Prerequisites](#2-prerequisites)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:56:3. [Installation](#3-installation)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:57:4. [Configuration](#4-configuration)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:58:5. [Verification](#5-verification)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:59:6. [Usage](#6-usage)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:60:7. [Features](#7-features)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:61:8. [Examples](#8-examples)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:62:9. [Troubleshooting](#9-troubleshooting)
.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md:63:10. [Resources](#10-resources)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:46:0. [AI-First Install Guide](#0-ai-first-install-guide)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:47:1. [Overview](#1-overview)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:48:2. [Prerequisites](#2-prerequisites)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:49:3. [Installation](#3-installation)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:50:4. [Configuration](#4-configuration)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:51:5. [Verification](#5-verification)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:52:6. [Usage](#6-usage)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:53:7. [Features](#7-features)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:54:8. [Examples](#8-examples)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:55:9. [Troubleshooting](#9-troubleshooting)
.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md:56:10. [Resources](#10-resources)
.opencode/skills/mcp-chrome-devtools/README.md:20:1. [OVERVIEW](#1-overview)
.opencode/skills/mcp-chrome-devtools/README.md:21:2. [QUICK START](#2-quick-start)
.opencode/skills/mcp-chrome-devtools/README.md:22:3. [FEATURES](#3-features)
.opencode/skills/mcp-chrome-devtools/README.md:25:4. [STRUCTURE](#4-structure)
.opencode/skills/mcp-chrome-devtools/README.md:26:5. [CONFIGURATION](#5-configuration)
.opencode/skills/mcp-chrome-devtools/README.md:27:6. [USAGE EXAMPLES](#6-usage-examples)
.opencode/skills/mcp-chrome-devtools/README.md:28:7. [TROUBLESHOOTING](#7-troubleshooting)
.opencode/skills/mcp-chrome-devtools/README.md:29:8. [FAQ](#8-faq)
.opencode/skills/mcp-chrome-devtools/README.md:30:9. [RELATED DOCUMENTS](#9-related-documents)
.opencode/skills/sk-git/README.md:18:1. [OVERVIEW](#1--overview)
.opencode/skills/sk-git/README.md:19:2. [QUICK START](#2--quick-start)
.opencode/skills/sk-git/README.md:20:3. [FEATURES](#3--features)
.opencode/skills/sk-git/README.md:21:4. [STRUCTURE](#4--structure)
.opencode/skills/sk-git/README.md:22:5. [CONFIGURATION](#5--configuration)
.opencode/skills/sk-git/README.md:23:6. [USAGE EXAMPLES](#6--usage-examples)
.opencode/skills/sk-git/README.md:24:7. [TROUBLESHOOTING](#7--troubleshooting)
.opencode/skills/sk-git/README.md:25:8. [FAQ](#8--faq)
.opencode/skills/sk-git/README.md:26:9. [RELATED DOCUMENTS](#9--related-documents)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:143:2. [Infrastructure](#2-infrastructure)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:144:3. [Search Pipeline: Core](#3-search-pipeline-core)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:145:4. [Search Pipeline: Fusion and Scoring](#4-search-pipeline-fusion-and-scoring)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:146:5. [Search Pipeline: Query Intelligence](#5-search-pipeline-query-intelligence)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:147:6. [Graph](#6-graph)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148:7. [Graph: Calibration](#7-graph-calibration)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:149:8. [Cognitive](#8-cognitive)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:150:9. [Feedback and Learning](#9-feedback-and-learning)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:151:10. [Governance and Scope](#10-governance-and-scope)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:152:11. [UX and Response Formatting](#11-ux-and-response-formatting)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:153:12. [Evaluation and Telemetry](#12-evaluation-and-telemetry)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:154:13. [Indexing](#13-indexing)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:155:14. [Reranker](#14-reranker)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:156:15. [Embedding](#15-embedding)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:157:16. [Roadmap Phase Control](#16-roadmap-phase-control)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:158:17. [Deprecated](#17-deprecated)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:159:18. [Quick Start Examples](#18-quick-start-examples)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:42:1. [AI-FIRST INSTALL GUIDE](#1-ai-first-install-guide)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:43:2. [OVERVIEW](#2-overview)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:44:3. [PREREQUISITES](#3-prerequisites)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:45:4. [INSTALLATION](#4-installation)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:46:5. [CONFIGURATION](#5-configuration)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:47:6. [VERIFICATION](#6-verification)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:48:7. [USAGE](#7-usage)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:49:8. [FEATURES](#8-features)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:50:9. [EXAMPLES](#9-examples)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:51:10. [TROUBLESHOOTING](#10-troubleshooting)
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:52:11. [RESOURCES](#11-resources)
.opencode/skills/deep-research/README.md:18:1. [OVERVIEW](#1--overview)
.opencode/skills/deep-research/README.md:19:2. [QUICK START](#2--quick-start)
.opencode/skills/deep-research/README.md:20:3. [FEATURES](#3--features)
.opencode/skills/deep-research/README.md:21:4. [STRUCTURE](#4--structure)
.opencode/skills/deep-research/README.md:22:5. [CONFIGURATION](#5--configuration)
.opencode/skills/deep-research/README.md:23:6. [USAGE EXAMPLES](#6--usage-examples)
.opencode/skills/deep-research/README.md:24:7. [LIFECYCLE MODES](#7--lifecycle-modes)
.opencode/skills/deep-research/README.md:25:8. [RUNTIME PARITY](#8--runtime-parity)
.opencode/skills/deep-research/README.md:26:9. [TROUBLESHOOTING](#9--troubleshooting)
.opencode/skills/deep-research/README.md:27:10. [FAQ](#10--faq)
.opencode/skills/deep-research/README.md:28:11. [RELATED DOCUMENTS](#11--related-documents)

exec
/bin/zsh -lc "git show --unified=80 --no-ext-diff 1e58d845af -- .opencode/skills/sk-doc/assets/template_rules.json .opencode/skills/sk-doc/scripts/tests/test_validator.py .opencode/commands/create/README.txt .opencode/commands/create/assets/create_feature_catalog_auto.yaml .opencode/commands/create/assets/create_feature_catalog_confirm.yaml .opencode/commands/create/assets/create_folder_readme_auto.yaml .opencode/commands/create/assets/create_folder_readme_confirm.yaml .opencode/commands/create/assets/create_testing_playbook_auto.yaml .opencode/commands/create/assets/create_testing_playbook_confirm.yaml 2>/dev/null | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "git show --unified=0 --no-ext-diff 1e58d845af -- .opencode/specs/skilled-agent-orchestration/117-skill-anchor-toc-removal 2>/dev/null | rg '"'^'"\\+' | rg -n -i 'api[_-]?key|secret|token|password|passwd|credential|private key|BEGIN .*PRIVATE|/Users/|/home/|chmod|permission|allowlist|denylist|shell|exec|eval|subprocess|os\\.system|child_process|dangerously|innerHTML|curl|http://' || true" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "git show --unified=0 --no-ext-diff 1e58d845af -- .opencode/commands/create/README.txt .opencode/commands/create/assets/create_feature_catalog_auto.yaml .opencode/commands/create/assets/create_feature_catalog_confirm.yaml .opencode/commands/create/assets/create_folder_readme_auto.yaml .opencode/commands/create/assets/create_folder_readme_confirm.yaml .opencode/commands/create/assets/create_testing_playbook_auto.yaml .opencode/commands/create/assets/create_testing_playbook_confirm.yaml .opencode/skills/sk-doc/assets/template_rules.json .opencode/skills/sk-doc/scripts/tests/test_validator.py 2>/dev/null | rg '"'^'"\\+' | rg -n -i 'api[_-]?key|secret|token|password|passwd|credential|private key|BEGIN .*PRIVATE|/Users/|/home/|chmod|permission|allowlist|denylist|shell|exec|eval|subprocess|os\\.system|child_process|dangerously|innerHTML|curl|http://' || true" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1767ms:
1309:+# TOC heading: H1-H6, optional leading emoji/symbol token, "TABLE OF CONTENTS" | "CONTENTS" | "TOC"
2523:+| Treat the Devin permission block as non-fatal | Deterministic verification fully covers the content-safety claim |
2544:+1. Independent CLI-Devin verification was inconclusive due to its non-interactive permission model; the deterministic full-coverage check supersedes it.
2634:+- [x] CLI-Devin/SWE-1.6 dispatch attempted (auto-mode blocked shell; deterministic check supersedes)
2788:+| Risk | Devin auto-mode blocks shell in non-interactive run | No Devin verdict | Full-coverage deterministic classification supersedes the sample sweep |
3045:+      - "Execution: deterministic script primary; CLI-Devin/SWE-1.6 for edge cases + verification"
3123:+> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

 succeeded in 1773ms:
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

diff --git a/.opencode/commands/create/README.txt b/.opencode/commands/create/README.txt
index ab6d90d44a..b97f0c7f07 100644
--- a/.opencode/commands/create/README.txt
+++ b/.opencode/commands/create/README.txt
@@ -1,118 +1,100 @@
 ---
 title: "Create Commands"
 description: "Slash commands for scaffolding OpenCode components, documentation packages, and changelogs."
 trigger_phrases:
   - "create command"
   - "scaffold component"
   - "create agent"
   - "create skill"
   - "create readme"
   - "create feature catalog"
   - "create testing playbook"
   - "create changelog"
 ---
 
 # Create Commands
 
 > Slash commands for scaffolding OpenCode components, documentation packages, and changelog entries with proper templates and validation.
 
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
 
 The `create` command group scaffolds OpenCode components, documentation packages, and changelog entries. All commands follow a structured YAML workflow and support `:auto` (no approval prompts) and `:confirm` (pause at each step) execution modes.
 
 All shipped `create` commands run Phase 0 (@general agent self-verification).
 
 <!-- /ANCHOR:overview -->
 
 ---
 
 <!-- ANCHOR:purpose -->
 ## 2. PURPOSE
 
 Use this index to understand which `/create:*` command owns a given scaffolding workflow, which argument shape it expects, and which package contract or artifact family it generates.
 
 This document is a routing and reference surface only. Run the command entrypoint itself for execution, setup prompting, and YAML workflow dispatch.
 
 <!-- /ANCHOR:purpose -->
 
 ---
 
 <!-- ANCHOR:commands -->
 ## 3. COMMANDS
 | Command | Invocation | Description |
 |---------|------------|-------------|
 | **agent** | `/create:agent <name> [description] [:auto\|:confirm]` | Create a new OpenCode agent with frontmatter, tool permissions, and behavioral rules |
 | **changelog** | `/create:changelog <spec-folder-or-component> [--bump <major\|minor\|patch\|build>] [:auto\|:confirm]` | Create a changelog entry by detecting recent work, resolving the target component folder, and generating a formatted changelog file |
 | **feature-catalog** | `/create:feature-catalog <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `feature_catalog/` package using the shipped `sk-doc` contract |
 | **folder_readme** | `/create:folder_readme [readme\|install] <target> [flags] [:auto\|:confirm]` | Unified README and install guide creation |
 | **skill** | `/create:skill <name> <operation> [type] [--chained] [:auto\|:confirm]` | Unified skill workflow (full-create, full-update, reference-only, asset-only) |
 | **testing-playbook** | `/create:testing-playbook <skill-name> [create\|update] [--path <dir>] [:auto\|:confirm]` | Create or update a rooted `manual_testing_playbook/` package using the shipped `sk-doc` contract |
 
 ### README Types
 
 The `readme` operation in `/create:folder_readme` accepts a `--type` flag:
 
 | Type | Use Case |
 |------|----------|
 | `project` | Root-level project documentation |
 | `component` | Reusable module or library |
 | `feature` | Specific feature or system |
 | `skill` | AI skill supplementary documentation |
 
 <!-- /ANCHOR:commands -->
 
 ---
 
 <!-- ANCHOR:structure -->
 ## 4. STRUCTURE
 
 ```
 create/
 ├── agent.md              # /create:agent command
 ├── changelog.md          # /create:changelog command
 ├── feature-catalog.md    # /create:feature-catalog command
 ├── folder_readme.md      # /create:folder_readme — unified README + install guide command
 ├── skill.md           # /create:skill command
 ├── testing-playbook.md   # /create:testing-playbook command
 └── assets/               # YAML workflow definitions
     ├── create_agent_auto.yaml
     ├── create_agent_confirm.yaml
     ├── create_changelog_auto.yaml
     ├── create_changelog_confirm.yaml
     ├── create_feature_catalog_auto.yaml
     ├── create_feature_catalog_confirm.yaml
     ├── create_folder_readme_auto.yaml
     ├── create_folder_readme_confirm.yaml
     ├── create_skill_auto.yaml
     ├── create_skill_confirm.yaml
     ├── create_testing_playbook_auto.yaml
     └── create_testing_playbook_confirm.yaml
 ```
 
 <!-- /ANCHOR:structure -->
 
 ---
 
 <!-- ANCHOR:instructions -->
 ## 5. INSTRUCTIONS
diff --git a/.opencode/commands/create/assets/create_feature_catalog_auto.yaml b/.opencode/commands/create/assets/create_feature_catalog_auto.yaml
index 0507a7902d..892442dd7b 100644
--- a/.opencode/commands/create/assets/create_feature_catalog_auto.yaml
+++ b/.opencode/commands/create/assets/create_feature_catalog_auto.yaml
@@ -83,162 +83,161 @@ request_analysis_framework:
       - "source_strategy is present"
       - "execution_mode is :auto"
     stop_conditions:
       - "Any required input missing"
       - "Operation does not match real target existence"
     stop_action: "STOP and correct setup before generation"
 
 input_contract:
   required:
     - create_agent_verified
     - skill_name
     - operation
     - source_strategy
     - execution_mode
   optional:
     - skill_path
     - spec_choice
     - spec_path
     - memory_choice
 
 field_handling:
   skill_name:
     validation: "hyphen-case folder name"
     required: true
   operation:
     validation: "must be one of: create, update"
     required: true
   source_strategy:
     validation: "must be one of: derive-playbook, manual-inventory, hybrid"
     required: true
   execution_mode:
     validation: "must be :auto"
     required: true
 
 documentation_level:
   default: "Level 2 (Verification)"
   required_files:
     - spec.md
     - plan.md
     - tasks.md
     - checklist.md
   note: "Feature catalog package creation typically needs verification because it spans root and per-feature docs"
 
 defaults:
   skill_path: .opencode/skills/
   catalog_dirname: feature_catalog
   execution_mode: :auto
   dqi_hard_minimum: 75
 
 operation_router:
   create:
     requires_existing_catalog: false
     output_scope:
       - feature_catalog/feature_catalog.md
       - feature_catalog/NN--category-name/
       - feature_catalog/NN--category-name/NN-feature-name.md
   update:
     requires_existing_catalog: true
     output_scope:
       - feature_catalog/feature_catalog.md
       - feature_catalog/NN--category-name/
       - feature_catalog/NN--category-name/NN-feature-name.md
 
 reference_sources:
   specific_creation: .opencode/skills/sk-doc/references/feature_catalog_creation.md
   core_standards: .opencode/skills/sk-doc/references/global/core_standards.md
   validation: .opencode/skills/sk-doc/references/global/validation.md
 
 template_sources:
   root_catalog: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md
   feature_file: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md
 
 validation_scripts:
   validate_document: .opencode/skills/sk-doc/scripts/validate_document.py
   extract_structure: .opencode/skills/sk-doc/scripts/extract_structure.py
 
 quality_standards:
   template_first: required
   frontmatter_required: true
   root_requirements:
-    - unnumbered TABLE OF CONTENTS
-    - numbered all-caps H2 sections
+    - numbered all-caps H2 sections (no Table of Contents)
     - section 1 is OVERVIEW
   feature_file_requirements:
     - frontmatter
     - OVERVIEW
     - CURRENT REALITY
     - SOURCE FILES
     - SOURCE METADATA
   current_reality_rule: "Describe shipped behavior, not speculative roadmap content"
   validation_pipeline:
     - "python3 .opencode/skills/sk-doc/scripts/validate_document.py [catalog_root]/feature_catalog.md"
     - "python3 .opencode/skills/sk-doc/scripts/extract_structure.py [catalog_root]/feature_catalog.md"
 
 gate_logic:
   hard:
     H0_write_verified:
       description: "create_agent_verified must be true"
       fail_action: "STOP and return to setup"
     H1_required_fields:
       description: "All required setup fields must be present"
       fail_action: "STOP and collect missing fields"
     H2_existence_semantics:
       description: "create/update must match real catalog existence"
       fail_action: "STOP and reroute or correct target"
     H3_contract_shape:
       description: "Generated package must match rooted feature catalog contract"
       fail_action: "Fix structure before continuing"
     H4_validation_gate:
       description: "Root validation and link/count checks must pass"
       fail_action: "Run fix-and-revalidate loop"
   soft:
     S1_source_strategy:
       description: "Prefer deriving from an existing playbook when present"
       fail_action: "Proceed with logged assumption"

 succeeded in 1752ms:
codex
## Iteration 4 — Carve-outs + traceability + security

Inspected/read-only:
- `git show --stat 1e58d845af -- .opencode/skills/system-spec-kit/templates | head`: no template files shown in the diff.
- `rg -l '<!-- ANCHOR' .opencode/skills/system-spec-kit/templates --glob '*.md' | wc -l`: `26`, so spec-kit template anchors are preserved.
- `rg -l -i 'table of contents' .opencode/skills/sk-doc/scripts/tests`: `5` fixtures still contain TOC text.
- Under-removal scan, excluding carve-outs:
  - `## TABLE OF CONTENTS` headings: `0`
  - standalone `<!-- ANCHOR:... -->` / `<!-- /ANCHOR:... -->` lines: `0`
- Security scan: reviewed the `20` non-md changed files and grep-scanned added diff lines for secrets, private absolute paths, injection sinks, and permission/allowlist changes. No new security issue found.

- [P1] specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:54 — The verification packet claims full content-safety coverage even though the already-known orphaned numbered TOC lists prove TOC residue was left behind. Evidence: line 54 says every bulk-pass removal was classified as TOC/anchor/blank/rule with `0` unclassified; lines 86-87 mark residual/content safety as passing. That conflicts with the known orphaned numbered-TOC defect, because the packet presents the cleanup as fully verified while the change set still contains TOC link lists. This also makes related traceability claims false in `002-toc-removal/implementation-summary.md:44` (“removed every ... TOC block”) and `:97` (“TOC anchor link lines died with their TOC blocks”).

FINDINGS_JSON: {"iteration":4,"dimension":"traceability","p0":0,"p1":1,"p2":0,"verdict":"CONDITIONAL","summary":"Carve-outs and security pass; 117 verification docs falsely claim full TOC cleanup despite known orphaned TOC lists."}
hook: Stop
hook: Stop Completed
tokens used
96,427
## Iteration 4 — Carve-outs + traceability + security

Inspected/read-only:
- `git show --stat 1e58d845af -- .opencode/skills/system-spec-kit/templates | head`: no template files shown in the diff.
- `rg -l '<!-- ANCHOR' .opencode/skills/system-spec-kit/templates --glob '*.md' | wc -l`: `26`, so spec-kit template anchors are preserved.
- `rg -l -i 'table of contents' .opencode/skills/sk-doc/scripts/tests`: `5` fixtures still contain TOC text.
- Under-removal scan, excluding carve-outs:
  - `## TABLE OF CONTENTS` headings: `0`
  - standalone `<!-- ANCHOR:... -->` / `<!-- /ANCHOR:... -->` lines: `0`
- Security scan: reviewed the `20` non-md changed files and grep-scanned added diff lines for secrets, private absolute paths, injection sinks, and permission/allowlist changes. No new security issue found.

- [P1] specs/skilled-agent-orchestration/117-skill-anchor-toc-removal/004-verification-reconciliation/implementation-summary.md:54 — The verification packet claims full content-safety coverage even though the already-known orphaned numbered TOC lists prove TOC residue was left behind. Evidence: line 54 says every bulk-pass removal was classified as TOC/anchor/blank/rule with `0` unclassified; lines 86-87 mark residual/content safety as passing. That conflicts with the known orphaned numbered-TOC defect, because the packet presents the cleanup as fully verified while the change set still contains TOC link lists. This also makes related traceability claims false in `002-toc-removal/implementation-summary.md:44` (“removed every ... TOC block”) and `:97` (“TOC anchor link lines died with their TOC blocks”).

FINDINGS_JSON: {"iteration":4,"dimension":"traceability","p0":0,"p1":1,"p2":0,"verdict":"CONDITIONAL","summary":"Carve-outs and security pass; 117 verification docs falsely claim full TOC cleanup despite known orphaned TOC lists."}
