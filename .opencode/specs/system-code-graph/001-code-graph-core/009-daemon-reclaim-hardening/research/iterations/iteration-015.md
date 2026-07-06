Reading additional input from stdin...
2026-06-29T10:42:44.113270Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
2026-06-29T10:42:44.113308Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
OpenAI Codex v0.137.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019f12f9-6719-7862-83b3-9b9407318c53
--------
user
You are GPT-5.5 at xhigh reasoning doing an ADVERSARIAL verification pass over a hardening design produced by a different model (GLM-5.2). Be skeptical: your job is to CONFIRM what is right, REFUTE what is wrong, and find GAPS the prior research missed — not to agree. Read the synthesized design at .opencode/specs/system-code-graph/001-code-graph-core/009-daemon-reclaim-hardening/research/research.md and the actual source .opencode/bin/mk-code-index-launcher.cjs and .opencode/bin/launcher-ipc-bridge.cjs (and the child initDb under system-code-graph/mcp_server if useful). Ground every claim in the REAL code (cite function/line). Incident recap: the code-index daemon wedged (PID alive, IPC socket never created, lease file gone, 17MB orphaned WAL) and /mcp reconnect returned -32000.

## Angle: test-harness-and-verdict
Design the deterministic test harness GLM's timed-out iteration could not (CI-friendly, no real daemon): how to fabricate a wedged owner hermetically (write a lease + a live sleeper PID whose argv mimics the daemon + NO socket), how to assert reclaim past MAX_INIT_MS, how to assert a within-grace owner is spared, the foreign-uid case (skip if not runnable as another uid — say so), the PID-reuse case, the two-launcher race (assert exactly one wins the CAS), the oversized-WAL checkpoint case, and the migration-copy case. List concrete test cases with their setup/assert. Then give an overall VERDICT on GLM's design: is it sound, sound-with-fixes (list the must-fix items before implementing), or flawed?

Return ONLY JSON at the end: {"angle":"<angle>","confirms":["GLM rec X is correct because…"],"refutes":[{"target":"GLM rec/claim","problem":"…","evidence":"file:line"}],"gaps":["missed failure mode / angle…"],"new_recommendations":[{"change":"…","where":"file:func","why":"…"}],"verdict":"sound|sound-with-fixes|flawed"}
2026-06-29T10:42:44.384498Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when AuthRequired(AuthRequiredError { www_authenticate_header: "Bearer resource_metadata=\"https://mcp.figma.com/.well-known/oauth-protected-resource\",scope=\"mcp:connect\",authorization_uri=\"https://api.figma.com/.well-known/oauth-authorization-server\"" })
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
I’ll treat this as a read-only adversarial review: no spec-folder write gate applies. I’m going to load the relevant review/code skill guidance, then inspect the research note and launcher code directly so the final JSON is evidence-based rather than vibes.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code
description: "Multi-stack coding standards and verification. Smart router auto-detects the active surface and loads matching code patterns."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.5.0.0
---

<!-- Keywords: sk-code, code workflows, smart-router, code-surface-detection, webflow, frontend, html, css, javascript, Motion.dev, motion-dev, motion_dev, cross-stack-animation, gsap, lenis, swiper, hls, filepond, opencode, system-code, mcp, typescript, python, shell, jsonc, code-quality, debugging-workflow, verification -->

# Code Workflows - Surface-Aware Smart Router

`sk-code` is the single code-work skill. It first decides which code surface is in front of it, then loads the right implementation, quality, debugging, and verification resources.

**Core principle**: `Code surface detection -> Intent classification -> Surface resources -> Verification evidence`.

---

## 1. WHEN TO USE

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
| Phase 1: Implementation | Write or modify code using surface patterns | Read actual files first; apply the Design Restraint Ladder before writing new code. |
| Phase 1.5: Code Quality Gate | Apply P0/P1/P2 checks and surface standards | Required before claiming implementation done |
| Phase 2: Debugging | Trace symptom to root cause and fix one cause at a time | Required when tests/runtime fail |
| Phase 3: Verification | Run surface verification commands and record evidence | Required before any done/works claim |

**Iron Law**: no completion claim without fresh verification evidence from the detected surface.

**Baseline & blast-radius**: before Phase 1, capture the starting gate state (pass/fail counts + the names of failing tests, base commit) so Phase 3 reports the *delta*, not just a green — a green suite says nothing about a path it never ran. Open non-trivial work with a one-phrase blast-radius read ("low-blast, reversible" / "high-blast: touches auth + data") so effort matches stakes.

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

### UNKNOWN_FALLBACK Checklist

Returned when no supported surface matches, when intent confidence is low (`max(intent_scores) < 0.5`), or when the user explicitly asks for stack-agnostic guidance. Ask for the missing routing inputs instead of guessing:

- Confirm the active runtime surface — Webflow/frontend or `.opencode/` system code.
- Confirm the task intent (implementation / debugging / verification / etc.).
- Provide one concrete input, error, or expected output.
- Confirm the verification command set before any completion claim.

Do not load Go / Next.js / React Native / Swift resources — canonical `sk-code` owns only WEBFLOW + OPENCODE + MOTION_DEV. Full fallback logic: `references/smart_routing.md §8`.

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

### Resource Loading Levels

Loading follows the canonical three levels; the finer `ALWAYS / SURFACE / INTENT / LANGUAGE / ON_DEMAND` tiers live in `references/smart_routing.md §3`.

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every sk-code invocation | `references/stack_detection.md`, `references/smart_routing.md`, `references/phase_detection.md`, and the `references/universal/` quality + error-recovery baseline |
| CONDITIONAL | After surface + intent (and OPENCODE language) detection | the detected `references/<surface>/` + `assets/<surface>/` trees, the matching language standards, intent-mapped resources, the authoring checklists below, and `references/motion_dev/` for `MOTION_DEV` intent |
| ON_DEMAND | Only on an explicit deep-dive request | extended checklists and niche references, plus the full `INTENT_MODEL` / `RESOURCE_MAP` in `references/smart_routing.md` |

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

### Verification Rituals

Apply these alongside the commands above, scaled to blast radius:

- **Mutation check / claim-falsifier (after green).** A passing test proves nothing until you have seen it fail for the right reason. After green, break the production code the test guards, confirm that specific test fails, then restore. Distinguish **true-RED** (the assertion fails against correct intent) from **compile-RED** (the suite never compiled or ran — not a satisfying RED). A test that stays green when you break the thing it guards is a vacuous test — a defect, not coverage.

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code-review
description: "Stack-agnostic code-review baseline: findings-first severity, mandatory security/correctness minimums, sk-code evidence."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.5.0.0
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
references/pr_state_dedup.md
assets/*_checklist.md
assets/removal_plan.md
```

- `references/review_core.md` for shared doctrine consumed by both `@review` and `@deep-review`.
- `references/review_ux_single_pass.md` for interactive single-pass review behavior.
- `references/` for shared review doctrine, single-pass UX behavior, and the PR-state dedup spec.
- `assets/` for the review checklists and the removal-plan template (security, code-quality, fix-completeness, SOLID, test-quality, removal).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation, including security/correctness reviews | `references/review_core.md`, `references/review_ux_single_pass.md`, `assets/security_checklist.md`, `assets/code_quality_checklist.md`, `assets/fix-completeness-checklist.md` |
| CONDITIONAL | Intent score indicates need | `assets/solid_checklist.md`, `assets/code_quality_checklist.md`, `assets/removal_plan.md`, `assets/test_quality_checklist.md` |
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
import re
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
# Discover resources recursively across references and assets.
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCES = [
    "references/review_core.md",
    "references/review_ux_single_pass.md",
    "assets/security_checklist.md",
    "assets/code_quality_checklist.md",
    "assets/fix-completeness-checklist.md",
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
    "SECURITY": ["assets/security_checklist.md"],
    "QUALITY": ["assets/code_quality_checklist.md"],
    "KISS": ["assets/code_quality_checklist.md"],
    "DRY": ["assets/code_quality_checklist.md"],
    "SOLID": ["assets/solid_checklist.md"],
    "REMOVAL": ["assets/removal_plan.md"],
    "TESTING": ["assets/test_quality_checklist.md"],
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

def keyword_present(keyword: str, text: str) -> bool:
    """Boundary-aware match: bare substrings misroute ('pr' in 'improve prompt')."""
    return re.search(rf"(?<![a-z0-9]){re.escape(keyword)}(?![a-z0-9])", text) is not None

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword_present(keyword, text):
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

    if ".opencode/" in files or keyword_present("jsonc", text) or keyword_present("mcp", text):
        return "sk-code:<surface>"
    if any(keyword_present(term, text) for term in ["frontend", "web", "css", "dom", "browser"]) or any(
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

codex
Surface is `.opencode/` system code, so I’m using the review baseline plus OpenCode/JavaScript evidence. Next I’m reading the claimed design and the real launcher/bridge code with line numbers; the verdict will cite only things the code actually supports.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-code-graph/001-code-graph-core/009-daemon-reclaim-hardening/research/research.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Research: code-index daemon reclaim hardening (prevent the wedge recurrence)
     2	
     3	**Subject:** Prevent recurrence of the Code Graph daemon wedge — a PID-alive-but-socket-dead daemon the launcher does not reclaim, causing MCP reconnect `-32000`.
     4	**Method:** 10-iteration deep research, executor `zai-coding-plan/glm-5.2 --variant high` (max thinking), COSTAR. Iters 1-9 converged; iter 10 (test-design) timed out but its content is recoverable from the design below.
     5	**Target file:** `.opencode/bin/mk-code-index-launcher.cjs` (+ `launcher-ipc-bridge.cjs`, child `system-code-graph/mcp_server/dist/index.js` `initDb`).
     6	
     7	## Root cause (converged)
     8	
     9	Liveness is **bidimensional** — `processLiveness` proves only `process.kill(pid,0)` (PID exists), and the heartbeat is written by the **launcher**, not gated on the daemon's ability to serve. There is **zero socket-health correlation**. So a wedged daemon (PID alive, 0% CPU, socket never (re)created) classifies as `live-owner` / `held:true`. The inert branch is `maybeBridgeLeaseHolder`'s no-socket path (bridge `L405-408`): when the lease says "held" but the socket FILE is missing, it `report`s instead of respawning. Two compounding axes in the incident: (a) the lease file had also vanished from an empty socket dir, so the heartbeat-reclaim (which needs a lease file with an aging `lastHeartbeatIso`) never had anything to age out; (b) a 17 MB orphaned WAL from the unclean crash.
    10	
    11	**Liveness must be tridimensional: PID-alive AND socket-serving AND heartbeat-fresh.**
    12	
    13	## Converged hardening design
    14	
    15	1. **Reuse the existing probe.** `launcher-ipc-bridge.cjs:probeDaemon({deepProbe:true})` (~L150-236) already connects the UDS + sends a JSON-RPC `initialize`. Wrap it as `probeExistingService(socketPath)` returning `{status, kind}` where `kind ∈ {enoent, econnrefused, timeout, json-rpc-reply}`.
    16	2. **Socket-health gate in classification.** Add a `live-but-dead-socket` state to `classifyOwnerLease` and mirror it in `leaseHeldFromFile` (after the `process.kill(pid,0)` success at `~L602`): if `socketPath` is missing/dead (fast-path `!existsSync`, else N-consecutive deep-probe failures), return `staleReclaimable:true` instead of `held:true`. Extend the reclaimable allowlist (`~L479-484`) — the existing `unlink + O_EXCL` CAS handles it atomically, no CAS change.
    17	3. **No-bridge-socket → respawn, not report.** Change bridge `L405-408` to route a socketless-but-live owner into the existing `respawnAfterDeadSocket → reapOwnerBeforeRespawn` pipeline.
    18	4. **Startup grace window** (so a *starting* daemon isn't killed): `STARTUP_GRACE_MS=30000`, `MAX_INIT_MS=120000` (env-overridable), keyed on a new `childSpawnedAtIso` stamped right after the child PID is known — NOT `startedAtIso` (which precedes the bootstrap-lock wait + first build). `age ≤ grace` → still-starting (report); `grace < age ≤ max` → bounded socket re-poll; `age > max` → respawn (`startup-deadline-exceeded`).
    19	5. **Socket-gated heartbeat.** Refresh `lastHeartbeatIso` only when the socket is actually serving; on probe failure, stop heartbeating so a dead-socket daemon ages out into `stale-heartbeat-reclaim` within 2 min. Ideally move heartbeat ownership into the daemon child (refresh only after its IPC listener echoes).
    20	6. **Crash-surviving PID registry + self-heal on acquire.** Write `.code-graph-daemon-pid.json` (`{daemonPid, launcherPid, socketPath, startedAt, canonicalDbDir}`) right after the child PID is known; unlink only on clean child exit. On acquire, discover the orphan via `reclaimedOrphanPid → that registry → lsof on the WAL`, and reap (SIGTERM→grace→SIGKILL) **only** when `alive AND socket provably dead (N consecutive failures)**, then checkpoint, then spawn.
    21	7. **WAL startup hygiene.** Before spawn: if `code-graph.sqlite-wal` exceeds a threshold (~8 MB) or an orphan was just reaped, run `wal_checkpoint(TRUNCATE)` (no other writer holds it). Set `wal_autocheckpoint=500` (~2 MB, tunable) in `initDb`. Checkpoint before the migration copy so a giant `-wal` is never propagated.
    22	8. **Race + permission safety.** Apply the uid check to the PRIMARY lease (not just `legacyPath`) and to the socket owner — never unlink/bridge/kill a foreign-owned lease. Before any SIGKILL, verify PID identity (cmdline basename + process start-time vs `startedAtIso`) to avoid killing a PID-reuse victim; on mismatch log `pid-reuse-suspected` and abort. Re-stat the lease between classify and unlink (abort if changed). Gate self-heal behind a one-shot `.self-heal-attempted` marker so a failed heal never loops into a kill storm.
    23	9. **One-line diagnostics.** Emit `LAUNCHER_DIAGNOSTIC: reason=<token> ownerPid=<n> socketPath=<p> walHeldBy=<pid|none>` on every failure exit. Tokens: `dead-socket-reclaimed`, `startup-timeout`, `foreign-owner`, `wal-locked-by-orphan`, `bridge-socket-refused`, `pid-reuse-suspected`, `stale-heartbeat-reclaimed`. Replaces manual lsof/ps forensics.
    24	
    25	## Test plan (deterministic wedge simulation)
    26	
    27	- **Wedge → reclaim:** spawn a fake owner that writes the lease + holds a live PID but never opens the socket; past `MAX_INIT_MS`, assert the launcher reclaims (reaps + respawns) and emits `dead-socket-reclaimed`.
    28	- **Still-starting → not killed:** owner within `STARTUP_GRACE_MS` with no socket yet → assert NOT killed (`still-starting`).
    29	- **Foreign-owner → not killed:** lease/socket owned by a different uid → assert no signal, `foreign-owner` diagnostic.
    30	- **PID-reuse → not killed:** live PID whose cmdline/start-time mismatch the lease → `pid-reuse-suspected`, abort.
    31	- **Oversized WAL → checkpointed:** seed an 8MB+ `-wal` with no holder → assert `wal_checkpoint(TRUNCATE)` runs pre-spawn and WAL shrinks.
    32	- **Healthy owner → bridged:** live PID + serving socket → assert bridge, no reclaim.
    33	
    34	## Recommendation
    35	
    36	Implement components **1-3 + 4 + 7** as the P0 core (they directly close the incident class), then **6, 8, 9** as the durability/safety layer, then **5** (heartbeat) as defense-in-depth. The minimal P0 (socket-health gate + reclaim-on-dead-socket past a grace window + startup WAL hygiene + diagnostics) collapses both failure axes from the incident.
    37	
    38	---
    39	
    40	<!-- ANCHOR:sources -->
    41	## Sources
    42	
    43	- Launcher under study: `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/launcher-ipc-bridge.cjs`, and the child `system-code-graph/mcp_server/dist/index.js` (`initDb`).
    44	- source: live incident forensics, 2026-06-29 — orphaned PIDs 37269/37358 at 0% CPU, empty `/tmp/mk-code-index/`, a 17 MB `code-graph.sqlite-wal` with no holder, DB integrity ok; manual recovery via `kill` + `PRAGMA wal_checkpoint(TRUNCATE)` + socket-dir clean.
    45	- source: 10-iteration GLM-5.2 (max thinking) deep research, iterations `iteration-001` through `iteration-010` in this folder; per-angle insights/recommendations in `angles.json`.
    46	<!-- /ANCHOR:sources -->
    47	

 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ╔══════════════════════════════════════════════════════════════════════════╗
     3	// ║ COMPONENT: mk-code-index Launcher                                      ║
     4	// ╠══════════════════════════════════════════════════════════════════════════╣
     5	// ║ PURPOSE: Prepares code-graph state and launches the MCP server child.   ║
     6	// ╚══════════════════════════════════════════════════════════════════════════╝
     7	'use strict';
     8	
     9	const fs = require('fs');
    10	const path = require('path');
    11	const { spawn, spawnSync } = require('child_process');
    12	const { createSessionProxy, createClassifyFrame } = require('./lib/launcher-session-proxy.cjs');
    13	
    14	const root = path.resolve(__dirname, '..', '..');
    15	const opencodeDir = path.join(root, '.opencode');
    16	const BLOCKED_CHILD_ENV_RE = /^(NODE_|npm_|NPM_)/;
    17	const DOTENV_ALLOW_RE = /^(SPECKIT_CODE_GRAPH_|SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN$|MK_CODE_INDEX_)/;
    18	
    19	// Load project-local env overrides BEFORE spawning the MCP child. .env.local wins over
    20	// .env, both are gitignored. Existing process.env wins over file values (do not override).
    21	// Minimal parser — no external dependency.
    22	function loadEnvFile(filePath) {
    23	  if (!fs.existsSync(filePath)) return 0;
    24	  let count = 0;
    25	  const raw = fs.readFileSync(filePath, 'utf8');
    26	  for (const line of raw.split('\n')) {
    27	    const trimmed = line.trim();
    28	    if (!trimmed || trimmed.startsWith('#')) continue;
    29	    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    30	    if (!m) continue;
    31	    const key = m[1];
    32	    let val = m[2];
    33	    // Strip matching outer quotes (single or double)
    34	    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    35	      val = val.slice(1, -1);
    36	    }
    37	    // The minimal parser is line-oriented; embedded \n in a quoted value would
    38	    // already have terminated the line, but defend explicitly.
    39	    if (val.includes('\n') || val.includes('\0')) {
    40	      process.stderr.write(`[mk-code-index-launcher] env value for ${key} contains control chars; skipping\n`);
    41	      continue;
    42	    }
    43	    if (!DOTENV_ALLOW_RE.test(key)) {
    44	      process.stderr.write(`[mk-code-index-launcher] env ${key} from ${path.basename(filePath)} is not allowlisted; skipping\n`);
    45	      continue;
    46	    }
    47	    if (!(key in process.env)) {
    48	      process.env[key] = val;
    49	      count++;
    50	    }
    51	  }
    52	  return count;
    53	}
    54	
    55	function isStrictModeDisabled(value) {
    56	  if (value === undefined || value === null) return false;
    57	  const v = String(value).trim().toLowerCase();
    58	  return v === '0' || v === 'false' || v === 'no' || v === 'off' || v === '';
    59	}
    60	
    61	// Category -> INDEX_* env key. Module-level so the launcher and its tests share one source.
    62	const MAINTAINER_CATEGORY_ENV = {
    63	  skills: 'SPECKIT_CODE_GRAPH_INDEX_SKILLS',
    64	  agents: 'SPECKIT_CODE_GRAPH_INDEX_AGENTS',
    65	  commands: 'SPECKIT_CODE_GRAPH_INDEX_COMMANDS',
    66	  specs: 'SPECKIT_CODE_GRAPH_INDEX_SPECS',
    67	  plugins: 'SPECKIT_CODE_GRAPH_INDEX_PLUGINS',
    68	};
    69	
    70	// Pure resolver for SPECKIT_CODE_GRAPH_MAINTAINER_MODE: "true" forces every category (back-compat),
    71	// "false"/empty/unset forces none, and a comma list forces the recognized subset (unknown names
    72	// dropped). Returns category names; the caller maps them to env keys via MAINTAINER_CATEGORY_ENV.
    73	function resolveMaintainerModeCategories(rawValue) {
    74	  const raw = (rawValue || '').trim().toLowerCase();
    75	  if (raw === 'true') return Object.keys(MAINTAINER_CATEGORY_ENV);
    76	  if (!raw || raw === 'false') return [];
    77	  return raw.split(',').map((c) => c.trim()).filter((c) => Object.hasOwn(MAINTAINER_CATEGORY_ENV, c));
    78	}
    79	
    80	function bootstrapLauncherEnv() {
    81	  for (const fname of ['.env.local', '.env']) {
    82	    const p = path.join(root, fname);
    83	    if (fs.existsSync(p)) {
    84	      const n = loadEnvFile(p);
    85	      if (n > 0) process.stderr.write(`[mk-code-index-launcher] loaded ${n} env(s) from ${fname}\n`);
    86	    }
    87	  }
    88	
    89	  // Maintainer-mode override: SPECKIT_CODE_GRAPH_MAINTAINER_MODE selects which .opencode
    90	  // categories to force-index on this machine, overriding whatever the runtime's MCP config
    91	  // injected. Committed configs ship "false" (end-user safe: only code outside .opencode is
    92	  // graphed); a maintainer opts in locally via .env.local (gitignored). Accepts "true" (all
    93	  // five categories, back-compat) or a comma-separated subset such as "skills,plugins" so a
    94	  // maintainer can index just the .opencode folders that hold code without pulling in the rest.
    95	  // Per-call code_graph_scan args (includeSkills, etc.) still override env. See ENV_REFERENCE.md § GRAPH.
    96	  const maintainerCategories = resolveMaintainerModeCategories(process.env.SPECKIT_CODE_GRAPH_MAINTAINER_MODE);
    97	  for (const cat of maintainerCategories) {
    98	    process.env[MAINTAINER_CATEGORY_ENV[cat]] = 'true';
    99	  }
   100	  if (maintainerCategories.length > 0) {
   101	    process.stderr.write(
   102	      `[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for ${maintainerCategories.join(', ')}\n`
   103	    );
   104	  }
   105	}
   106	
   107	let skillsDir = path.join(opencodeDir, 'skills');
   108	let legacySkillDir = path.join(opencodeDir, 'skill');
   109	let kitDir = path.join(skillsDir, 'system-code-graph');
   110	// DB lives SKILL-LOCAL at mcp_server/database/; SPECKIT_CODE_GRAPH_DB_DIR overrides.
   111	// Former shared location (.opencode/.spec-kit/code-graph/database/) is migrated back on first startup.
   112	let dbDir = path.join(kitDir, 'mcp_server', 'database');
   113	let lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
   114	const PID_FILE_NAME = '.mk-code-index-launcher.json';
   115	const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
   116	let stateFile = path.join(dbDir, PID_FILE_NAME);
   117	
   118	const rel = (p) => path.relative(root, p) || '.';
   119	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
   120	const now = () => new Date().toISOString();
   121	const RESPAWN_REAP_GRACE_MS = 7000;
   122	let childProcess = null;
   123	let ownerLeasePid = null;
   124	let launchStarted = false;
   125	let leaseMetricSink = null;
   126	
   127	const LEASE_METRIC_TRANSITION_CLASS = Object.freeze({
   128	  heldByOther: 'held-by-other',
   129	  bridgedSecondary: 'bridged-secondary',
   130	  staleReclaimed: 'stale-reclaimed',
   131	  respawned: 'respawned',
   132	});
   133	
   134	function log(message) {
   135	  process.stderr.write(`[mk-code-index-launcher] ${message}\n`);
   136	}
   137	
   138	function leaseMetricClassForTransition(transition) {
   139	  if (!Object.hasOwn(LEASE_METRIC_TRANSITION_CLASS, transition)) {
   140	    throw new Error(`Unknown lease metric transition: ${transition}`);
   141	  }
   142	  return LEASE_METRIC_TRANSITION_CLASS[transition];
   143	}
   144	
   145	function leaseMetricCounterName(leaseClass) {
   146	  return `mk_code_index_lease_${leaseClass.replace(/-/g, '_')}_total`;
   147	}
   148	
   149	function emitLeaseMetric(leaseClass, details = {}) {
   150	  if (typeof leaseMetricSink !== 'function') return;
   151	  leaseMetricSink({
   152	    counter: leaseMetricCounterName(leaseClass),
   153	    class: leaseClass,
   154	    count: 1,
   155	    at: now(),
   156	    ...details,
   157	  });
   158	}
   159	
   160	function configureLeaseMetricSinkForTesting(sink) {
   161	  leaseMetricSink = typeof sink === 'function' ? sink : null;
   162	}
   163	
   164	function loadBridgeModule() {
   165	  try {
   166	    return require('./lib/launcher-ipc-bridge.cjs');
   167	  } catch (error) {
   168	    if (error.code !== 'MODULE_NOT_FOUND') throw error;
   169	    return {
   170	      async maybeBridgeLeaseHolder({ leaseResult }) {
   171	        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   172	        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   173	        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
   174	        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   175	        return { action: 'report', reason: 'bridge-module-missing' };
   176	      },
   177	    };
   178	  }
   179	}
   180	
   181	// Code-index replayable / unsafe tool sets for the reconnecting session proxy. Read-only structural
   182	// queries are safe to replay across a backend reattach; a full scan or an apply mutates the graph and
   183	// must NOT be replayed (the client re-drives it on a retryable recycle error). The proxy machinery is
   184	// shared with mk-spec-memory; only this tool set differs.
   185	const CODE_INDEX_REPLAYABLE_TOOL_NAMES = new Set([
   186	  'code_graph_query',
   187	  'code_graph_context',
   188	  'code_graph_status',
   189	  'code_graph_classify_query_intent',
   190	  'detect_changes',
   191	]);
   192	const CODE_INDEX_UNSAFE_TOOL_NAMES = new Set([
   193	  'code_graph_scan',
   194	  'code_graph_apply',
   195	  // code_graph_verify is read-mostly but MUTATES when persistBaseline=true (it persists the gold
   196	  // verification baseline), so it must NOT be replayed across a reconnect — the client re-drives it.
   197	  'code_graph_verify',
   198	]);
   199	const classifyCodeIndexFrame = createClassifyFrame({
   200	  replayableToolNames: CODE_INDEX_REPLAYABLE_TOOL_NAMES,
   201	  unsafeToolNames: CODE_INDEX_UNSAFE_TOOL_NAMES,
   202	});
   203	
   204	// Bridge a secondary client through the reconnecting session proxy so a code-index owner death no
   205	// longer surfaces as a hard "Connection closed" — the proxy reattaches to the respawned backend and
   206	// replays in-flight read queries. Mirrors the mk-spec-memory wiring; the classifier is the only diff.
   207	function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
   208	  const createProxy = options.createProxy ?? createSessionProxy;
   209	  const sessionProxy = createProxy({
   210	    socketPath,
   211	    stdin: options.stdin ?? process.stdin,
   212	    stdout: options.stdout ?? process.stdout,
   213	    log,
   214	    classify: classifyCodeIndexFrame,
   215	  });
   216	  return sessionProxy.start();
   217	}
   218	
   219	function refreshPaths() {
   220	  skillsDir = path.join(opencodeDir, 'skills');
   221	  legacySkillDir = path.join(opencodeDir, 'skill');
   222	  kitDir = path.join(skillsDir, 'system-code-graph');
   223	  dbDir = path.join(kitDir, 'mcp_server', 'database');
   224	  lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
   225	  stateFile = path.join(dbDir, PID_FILE_NAME);
   226	}
   227	
   228	function exists(p) {
   229	  return fs.existsSync(p);
   230	}
   231	
   232	function canonicalizePath(pathValue) {
   233	  const resolvedPath = path.resolve(pathValue);
   234	  try {
   235	    return fs.realpathSync.native(resolvedPath);
   236	  } catch (error) {
   237	    if (error.code === 'ENOENT') return resolvedPath;
   238	    throw error;
   239	  }
   240	}
   241	
   242	function canonicalizeExistingPrefix(pathValue) {
   243	  const resolvedPath = path.resolve(pathValue);
   244	  if (fs.existsSync(resolvedPath)) return fs.realpathSync.native(resolvedPath);
   245	
   246	  const segments = [];
   247	  let current = resolvedPath;
   248	  while (!fs.existsSync(current)) {
   249	    const parent = path.dirname(current);
   250	    if (parent === current) return resolvedPath;
   251	    segments.unshift(path.basename(current));
   252	    current = parent;
   253	  }
   254	  return path.join(fs.realpathSync.native(current), ...segments);
   255	}
   256	
   257	function isWithinBase(basePath, candidatePath) {
   258	  return candidatePath === basePath || candidatePath.startsWith(`${basePath}${path.sep}`);
   259	}
   260	
   261	function isWithinRoot(candidatePath, requireCanonical = false) {
   262	  const canonicalRoot = fs.realpathSync.native(path.resolve(root));
   263	  const normalizedCandidate = canonicalizeExistingPrefix(candidatePath);
   264	  if (!isWithinBase(canonicalRoot, normalizedCandidate)) return false;
   265	  if (!requireCanonical && !fs.existsSync(path.resolve(candidatePath))) return true;
   266	  const candidate = canonicalizePath(candidatePath);
   267	  return isWithinBase(canonicalRoot, candidate);
   268	}
   269	
   270	function assertPathWithinRoot(candidatePath, label, requireCanonical = false) {
   271	  if (!isWithinRoot(candidatePath, requireCanonical)) {
   272	    throw new Error(`${label} must stay within workspace root ${root}: ${candidatePath}`);
   273	  }
   274	}
   275	
   276	function ensureCanonicalDir(dirPath) {
   277	  assertPathWithinRoot(dirPath, 'code graph DB directory');
   278	  fs.mkdirSync(path.resolve(dirPath), { recursive: true, mode: 0o700 });
   279	  assertPathWithinRoot(dirPath, 'code graph DB directory', true);
   280	  return canonicalizePath(dirPath);
   281	}
   282	
   283	function writeState(payload) {
   284	  fs.mkdirSync(dbDir, { recursive: true, mode: 0o700 });
   285	  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
   286	}
   287	
   288	function resolvedDbDir() {
   289	  const candidate = process.env.SPECKIT_CODE_GRAPH_DB_DIR ?? dbDir;
   290	  assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR');
   291	  if (fs.existsSync(candidate)) assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR', true);
   292	  return canonicalizePath(candidate);
   293	}
   294	
   295	function leasePath() {
   296	  return path.join(resolvedDbDir(), PID_FILE_NAME);
   297	}
   298	
   299	function ownerLeasePath() {
   300	  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
   301	}
   302	
   303	function legacyLeasePaths() {
   304	  // After the 2026-05-29 relocation, skill-local (mcp_server/database/) is the PRIMARY path.
   305	  // The legacy probe now covers the former shared `.spec-kit` location plus the pre-rename
   306	  // `skill/` (singular) typo dir, so a launcher still holding an old-location lease is detected.
   307	  return [
   308	    path.join(opencodeDir, '.spec-kit', 'code-graph', 'database', PID_FILE_NAME),
   309	    path.join(opencodeDir, 'skill', 'system-code-graph', 'mcp_server', 'database', PID_FILE_NAME),
   310	  ].map(canonicalizePath);
   311	}
   312	
   313	function readLeaseFile(filePath = leasePath()) {
   314	  try {
   315	    const raw = fs.readFileSync(filePath, 'utf8');
   316	    const parsed = JSON.parse(raw);
   317	    if (typeof parsed.pid === 'number') return parsed;
   318	  } catch {
   319	    // Missing or corrupt lease files are treated as no active lease.
   320	  }
   321	  return null;
   322	}
   323	
   324	function readOwnerLeaseFile(filePath = ownerLeasePath()) {
   325	  try {
   326	    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
   327	    if (
   328	      Number.isInteger(parsed.ownerPid) &&
   329	      Number.isInteger(parsed.ppid) &&
   330	      typeof parsed.executablePath === 'string' &&
   331	      typeof parsed.startedAtIso === 'string' &&
   332	      typeof parsed.lastHeartbeatIso === 'string' &&
   333	      Number.isInteger(parsed.ttlMs) &&
   334	      typeof parsed.canonicalDbDir === 'string'
   335	    ) {
   336	      return parsed;
   337	    }
   338	  } catch {
   339	    // Missing or corrupt owner leases are treated as no active owner.
   340	  }
   341	  return null;
   342	}
   343	
   344	function writeOwnerLeaseFile(lease) {
   345	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
   346	  const tmp = `${currentLeasePath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
   347	  fs.writeFileSync(tmp, `${JSON.stringify(lease, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
   348	  fs.renameSync(tmp, currentLeasePath);
   349	}
   350	
   351	function writeOwnerLeaseFileExclusive(lease) {
   352	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
   353	  let fd;
   354	  try {
   355	    fd = fs.openSync(currentLeasePath, 'wx', 0o600);
   356	    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
   357	    fs.fsyncSync(fd);
   358	    return true;
   359	  } catch (error) {
   360	    if (error.code === 'EEXIST') return false;

exec
/bin/zsh -lc "nl -ba .opencode/bin/launcher-ipc-bridge.cjs | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/bin/launcher-ipc-bridge.cjs: No such file or directory

exec
/bin/zsh -lc "rg -n \"initDb|WAL|wal|checkpoint|lease|MAX_INIT|socket|ipc|owner|stale|migrat|copy|mk-code-index-launcher|launcher-ipc-bridge\" .opencode/skills/system-code-graph .opencode/bin -g '"'!node_modules'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:952:  // states slip through: (a) a deleted-files-only `freshness:'stale', action:'none'`
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:953:  // result, and (b) a FAILED inline selective_reindex (`freshness:'stale',
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:954:  // inlineIndexPerformed:false`). Both returned ok over a stale graph. We now
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:970:  // can be trusted (full_scan, empty, or a stale graph a selective reindex
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1709:    // between the per-depth queries. better-sqlite3 transactions in WAL mode
.opencode/bin/hf-model-server.cjs:51:// concluding the socket is stale. Bounded so a hung peer cannot wedge startup.
.opencode/bin/hf-model-server.cjs:118:  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/hf-model-server.cjs:121:  return path.join(socketDir, SOCKET_FILE_NAME);
.opencode/bin/hf-model-server.cjs:124:function toConnectionOptions(socketPath) {
.opencode/bin/hf-model-server.cjs:125:  if (!socketPath.startsWith('tcp://')) {
.opencode/bin/hf-model-server.cjs:126:    return socketPath;
.opencode/bin/hf-model-server.cjs:128:  const url = new URL(socketPath);
.opencode/bin/hf-model-server.cjs:154:// deterministically testable without opening a socket.
.opencode/bin/hf-model-server.cjs:180:// Perimeter guard: assert the socket directory is owned by the current
.opencode/bin/hf-model-server.cjs:205:      `[hf-model-server] Refusing to reclaim socket "${target}": directory ${dir} is owned by ` +
.opencode/bin/hf-model-server.cjs:211:  // 0o022 == group-write | other-write. A writable-by-others socket dir means another user could
.opencode/bin/hf-model-server.cjs:212:  // have planted the resident socket, so unlinking it is unsafe.
.opencode/bin/hf-model-server.cjs:215:      `[hf-model-server] Refusing to reclaim socket "${target}": directory ${dir} is ` +
.opencode/bin/hf-model-server.cjs:224:// UDS before unlinking it. If a peer accepts the connection the socket is live-resident and we MUST
.opencode/bin/hf-model-server.cjs:226:// re-surface EADDRINUSE instead. ECONNREFUSED/ENOENT means the socket is stale and safe to reclaim.
.opencode/bin/hf-model-server.cjs:227:// Injectable connector keeps this deterministic in tests (no real socket required).
.opencode/bin/hf-model-server.cjs:236:    let socket;
.opencode/bin/hf-model-server.cjs:243:        socket?.destroy();
.opencode/bin/hf-model-server.cjs:250:      socket = connect({ path: target }, () => finish(true));
.opencode/bin/hf-model-server.cjs:252:      // Synchronous connect failure (e.g. ENOENT) => stale.
.opencode/bin/hf-model-server.cjs:256:    if (socket && typeof socket.once === 'function') {
.opencode/bin/hf-model-server.cjs:257:      socket.once('error', () => finish(false));
.opencode/bin/hf-model-server.cjs:258:      if (typeof socket.setTimeout === 'function') {
.opencode/bin/hf-model-server.cjs:259:        socket.setTimeout(timeoutMs, () => finish(false));
.opencode/bin/hf-model-server.cjs:302:    // group/world-writable socket dir keeps its loose perms. Enforce the uid/perm
.opencode/bin/hf-model-server.cjs:315:    // (2) if a live process still answers on the socket, refuse to unlink and re-surface the
.opencode/bin/hf-model-server.cjs:580:  // sockets or filesystem ownership. Production leaves these undefined => real net/fs/process/env.
.opencode/bin/hf-model-server.cjs:935:  server.on('connection', (socket) => {
.opencode/bin/hf-model-server.cjs:936:    activeSockets.add(socket);
.opencode/bin/hf-model-server.cjs:937:    socket.once('close', () => {
.opencode/bin/hf-model-server.cjs:938:      activeSockets.delete(socket);
.opencode/bin/hf-model-server.cjs:951:      socketPath: endpoint,
.opencode/bin/hf-model-server.cjs:962:    for (const socket of activeSockets) {
.opencode/bin/hf-model-server.cjs:963:      socket.destroy();
.opencode/bin/mk-spec-memory-launcher.cjs:37:  releaseRespawnLockFile,
.opencode/bin/mk-spec-memory-launcher.cjs:87:const OWNER_LEASE_FILE_NAME = '.spec-memory-owner.json';
.opencode/bin/mk-spec-memory-launcher.cjs:98:let ownerLeasePid = null;
.opencode/bin/mk-spec-memory-launcher.cjs:99:let leaseStartedAt = null;
.opencode/bin/mk-spec-memory-launcher.cjs:110:let ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-spec-memory-launcher.cjs:111:let ownerLeaseRequired = true;
.opencode/bin/mk-spec-memory-launcher.cjs:120:// bridging to the live owner (or a bounded retry while a maintenance script
.opencode/bin/mk-spec-memory-launcher.cjs:147:// ALSO appends here so an owner-disposal race or daemon flap is attributable after the fact from a
.opencode/bin/mk-spec-memory-launcher.cjs:198:// When enabled the owner spawns the daemon detached and, on its own shutdown, RELEASES the daemon
.opencode/bin/mk-spec-memory-launcher.cjs:200:// not tear the shared backend out from under other sessions. A fresh session that finds the released
.opencode/bin/mk-spec-memory-launcher.cjs:201:// daemon under a stale lease ADOPTS it through the bridge when the recorded child is alive and bridgeable;
.opencode/bin/mk-spec-memory-launcher.cjs:203:// writer either way. Disabling collapses every path below to the prior behavior (daemon tied to the owner,
.opencode/bin/mk-spec-memory-launcher.cjs:204:// killed on shutdown). A released daemon reparents to pid 1, bounded by its idle self-exit, so the orphan
.opencode/bin/mk-spec-memory-launcher.cjs:214:function shouldReleaseDaemonForReelection({ enabled, hasLiveDaemon } = {}) {
.opencode/bin/mk-spec-memory-launcher.cjs:263:    return require('./lib/launcher-ipc-bridge.cjs');
.opencode/bin/mk-spec-memory-launcher.cjs:267:      async maybeBridgeLeaseHolder({ leaseResult }) {
.opencode/bin/mk-spec-memory-launcher.cjs:268:        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-spec-memory-launcher.cjs:269:        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-spec-memory-launcher.cjs:270:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-spec-memory-launcher.cjs:271:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:283:// Bridge a secondary (non-lease-holder) launcher's client stdio to the daemon through
.opencode/bin/mk-spec-memory-launcher.cjs:285:// like the lease holder does — instead of the raw bridge that severs on recycle. Each
.opencode/bin/mk-spec-memory-launcher.cjs:290:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-spec-memory-launcher.cjs:293:    socketPath,
.opencode/bin/mk-spec-memory-launcher.cjs:334:function leasePath() {
.opencode/bin/mk-spec-memory-launcher.cjs:338:function ownerLeasePath() {
.opencode/bin/mk-spec-memory-launcher.cjs:348:function readLeaseFile(filePath = leasePath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:354:    // Missing or corrupt lease files are treated as no active lease.
.opencode/bin/mk-spec-memory-launcher.cjs:359:function readOwnerLeaseFile(filePath = ownerLeasePath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:363:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-spec-memory-launcher.cjs:374:    // Missing or corrupt owner leases are treated as no active owner.
.opencode/bin/mk-spec-memory-launcher.cjs:379:function writeOwnerLeaseFile(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:380:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-spec-memory-launcher.cjs:382:  // fsync the temp file before the atomic rename so the lease contents survive a crash, matching
.opencode/bin/mk-spec-memory-launcher.cjs:383:  // the durability of the exclusive write path; a renamed-but-unsynced lease can resurface empty
.opencode/bin/mk-spec-memory-launcher.cjs:384:  // after power loss and break ownership detection.
.opencode/bin/mk-spec-memory-launcher.cjs:388:    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
.opencode/bin/mk-spec-memory-launcher.cjs:396:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:397:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-spec-memory-launcher.cjs:401:    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
.opencode/bin/mk-spec-memory-launcher.cjs:412:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:414:    ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:444:function classifyOwnerLease(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:445:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:446:  if (liveness === 'dead') return 'stale-pid';
.opencode/bin/mk-spec-memory-launcher.cjs:449:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:450:  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
.opencode/bin/mk-spec-memory-launcher.cjs:454:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/bin/mk-spec-memory-launcher.cjs:455:  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
.opencode/bin/mk-spec-memory-launcher.cjs:457:    return 'stale-heartbeat-reclaim';
.opencode/bin/mk-spec-memory-launcher.cjs:460:  return 'live-owner';
.opencode/bin/mk-spec-memory-launcher.cjs:464:  const currentOwnerLeasePath = ownerLeasePath();
.opencode/bin/mk-spec-memory-launcher.cjs:469:    if (classification === 'live-owner' || classification === 'unknown-eperm') {
.opencode/bin/mk-spec-memory-launcher.cjs:472:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:475:  const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-spec-memory-launcher.cjs:476:  // Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL).
.opencode/bin/mk-spec-memory-launcher.cjs:477:  // This collapses the fresh-acquire and stale-reclaim paths into a single CAS so
.opencode/bin/mk-spec-memory-launcher.cjs:479:  // acquired:false instead of last-writer-wins overwriting the winner's lease.
.opencode/bin/mk-spec-memory-launcher.cjs:487:  if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-spec-memory-launcher.cjs:491:      holder: holder || lease,
.opencode/bin/mk-spec-memory-launcher.cjs:492:      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
.opencode/bin/mk-spec-memory-launcher.cjs:495:  ownerLeasePid = process.pid;
.opencode/bin/mk-spec-memory-launcher.cjs:496:  return { acquired: true, lease, reclaimed: existing };
.opencode/bin/mk-spec-memory-launcher.cjs:499:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-spec-memory-launcher.cjs:500:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:501:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-spec-memory-launcher.cjs:502:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:504:    ...lease,
.opencode/bin/mk-spec-memory-launcher.cjs:509:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-spec-memory-launcher.cjs:510:  ownerLeasePid = nextOwnerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:515:  if (ownerLeaseHeartbeatTimer) {
.opencode/bin/mk-spec-memory-launcher.cjs:516:    clearInterval(ownerLeaseHeartbeatTimer);
.opencode/bin/mk-spec-memory-launcher.cjs:517:    ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-spec-memory-launcher.cjs:521:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:523:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:524:  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
.opencode/bin/mk-spec-memory-launcher.cjs:526:  ownerLeaseHeartbeatTimer = setInterval(() => {
.opencode/bin/mk-spec-memory-launcher.cjs:527:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-spec-memory-launcher.cjs:528:    log('owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership');
.opencode/bin/mk-spec-memory-launcher.cjs:536:  ownerLeaseHeartbeatTimer.unref?.();
.opencode/bin/mk-spec-memory-launcher.cjs:539:function ownsOwnerLeaseFile(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:540:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:541:  return lease?.ownerPid === ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:545:  if (!Number.isInteger(ownerLeasePid)) return;
.opencode/bin/mk-spec-memory-launcher.cjs:547:    const lease = readOwnerLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:548:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-spec-memory-launcher.cjs:549:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-spec-memory-launcher.cjs:550:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:556:    ownerLeasePid = null;
.opencode/bin/mk-spec-memory-launcher.cjs:560:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:562:    const lease = readOwnerLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:563:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-spec-memory-launcher.cjs:564:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:565:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:572:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-spec-memory-launcher.cjs:573:  const lease = readLeaseFile(filePath);
.opencode/bin/mk-spec-memory-launcher.cjs:574:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-spec-memory-launcher.cjs:575:  const startedAt = lease.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-spec-memory-launcher.cjs:576:  // Surface the owner-recorded socket path so the bridge can prefer it over recomputing one that
.opencode/bin/mk-spec-memory-launcher.cjs:577:  // may diverge under a different SPECKIT_IPC_SOCKET_DIR. Null when the lease predates this field.
.opencode/bin/mk-spec-memory-launcher.cjs:578:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-spec-memory-launcher.cjs:580:    process.kill(lease.pid, 0);
.opencode/bin/mk-spec-memory-launcher.cjs:581:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:583:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:584:    // Mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
.opencode/bin/mk-spec-memory-launcher.cjs:585:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:591:  const primary = leaseHeldFromFile(leasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:595:    if (legacyPath === leasePath()) continue;
.opencode/bin/mk-spec-memory-launcher.cjs:596:    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
.opencode/bin/mk-spec-memory-launcher.cjs:597:    if (legacy.held || legacy.staleReclaimable) return legacy;
.opencode/bin/mk-spec-memory-launcher.cjs:603:function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
.opencode/bin/mk-spec-memory-launcher.cjs:604:  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-spec-memory-launcher.cjs:605:  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-spec-memory-launcher.cjs:606:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:609:function writeLeaseHeldJsonRpcError(leaseResult, reason) {
.opencode/bin/mk-spec-memory-launcher.cjs:615:      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
.opencode/bin/mk-spec-memory-launcher.cjs:621:function bridgeReadiness(leaseResult) {
.opencode/bin/mk-spec-memory-launcher.cjs:625:  const storedSocketPath = leaseResult.socketPath;
.opencode/bin/mk-spec-memory-launcher.cjs:631:    return { ready: true, socketPath: storedSocketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:637:  const socketPath = getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
.opencode/bin/mk-spec-memory-launcher.cjs:638:  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
.opencode/bin/mk-spec-memory-launcher.cjs:639:    return { ready: false, reason: 'no-bridge-socket' };
.opencode/bin/mk-spec-memory-launcher.cjs:641:  return { ready: true, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:644:function leaseResultForOwnerLease(ownerLease) {
.opencode/bin/mk-spec-memory-launcher.cjs:646:  if (pidLeaseResult.held && pidLeaseResult.ownerPid === ownerLease.ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:651:    ownerPid: ownerLease.ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:652:    staleReclaimable: false,
.opencode/bin/mk-spec-memory-launcher.cjs:653:    startedAt: ownerLease.startedAtIso,
.opencode/bin/mk-spec-memory-launcher.cjs:655:    socketPath: null,
.opencode/bin/mk-spec-memory-launcher.cjs:663:function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:664:  return mss.modelServerRespawnLockPath(socketPath, { dbDir: resolvedDbDir });
.opencode/bin/mk-spec-memory-launcher.cjs:675:function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:676:  return mss.acquireModelServerRespawnLockFile(socketPath, { dbDir: resolvedDbDir, log, rel });
.opencode/bin/mk-spec-memory-launcher.cjs:682:// successful WAL checkpoint + db.close(). The launcher uses its presence to tell whether a reaped
.opencode/bin/mk-spec-memory-launcher.cjs:710:// clean-shutdown marker is gone (close_db ran its checkpoint + close). Anything else means the
.opencode/bin/mk-spec-memory-launcher.cjs:743:      // may still be alive, so a caller never spawns a second writer onto the same WAL.
.opencode/bin/mk-spec-memory-launcher.cjs:761:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:762:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:764:    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
.opencode/bin/mk-spec-memory-launcher.cjs:767:    return { allowed: true, reason: 'owner-already-dead' };
.opencode/bin/mk-spec-memory-launcher.cjs:770:  // A socket probe cannot distinguish a genuinely-dead daemon from one that merely
.opencode/bin/mk-spec-memory-launcher.cjs:772:  // killing a process that is still ALIVE, require the owner lease to be heartbeat-stale
.opencode/bin/mk-spec-memory-launcher.cjs:773:  // too: a daemon that has refreshed its lease within its TTL is serving clients, not
.opencode/bin/mk-spec-memory-launcher.cjs:774:  // dead, and must never be reaped on a socket-probe-only verdict regardless of cap.
.opencode/bin/mk-spec-memory-launcher.cjs:776:  if (currentOwner?.ownerPid === ownerPid && classifyOwnerLease(currentOwner) === 'live-owner') {
.opencode/bin/mk-spec-memory-launcher.cjs:777:    log(`spec-memory owner pid ${ownerPid} is heartbeat-fresh (live-owner); refusing socket-probe reap (likely cap-refusal, not death)`);
.opencode/bin/mk-spec-memory-launcher.cjs:778:    return { allowed: false, reason: 'owner-heartbeat-fresh' };
.opencode/bin/mk-spec-memory-launcher.cjs:781:  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:782:  signalProcess(ownerPid, 'SIGTERM');
.opencode/bin/mk-spec-memory-launcher.cjs:783:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-spec-memory-launcher.cjs:785:    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-spec-memory-launcher.cjs:786:    signalProcess(ownerPid, 'SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:787:    await waitForPidExit(ownerPid, 1000);
.opencode/bin/mk-spec-memory-launcher.cjs:789:  return { allowed: true, reason: 'owner-reaped' };
.opencode/bin/mk-spec-memory-launcher.cjs:792:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-spec-memory-launcher.cjs:794:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-spec-memory-launcher.cjs:795:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:798:  const ownerPid = leaseResult.ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:799:  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
.opencode/bin/mk-spec-memory-launcher.cjs:800:    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:801:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:802:    return { action: 'report', reason: 'missing-owner-pid', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:805:  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:806:  const childPid = lease?.childPid;
.opencode/bin/mk-spec-memory-launcher.cjs:808:    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:809:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:810:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:821:    log(`confirmed-dead socket but child pid ${childPid} holds a fresh maintenance marker (activeUntil ${new Date(deadSocketMarker.activeUntilMs).toISOString()}); refusing respawn (busy, not dead)`);
.opencode/bin/mk-spec-memory-launcher.cjs:822:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-maintenance-active)');
.opencode/bin/mk-spec-memory-launcher.cjs:823:    return { action: 'report', reason: 'maintenance-active', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:832:      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
.opencode/bin/mk-spec-memory-launcher.cjs:833:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:834:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:838:    if (currentOwner?.ownerPid !== ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:839:      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:840:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:841:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:844:    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:845:    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:846:      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:847:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:848:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:851:    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:852:    if (!ownerReapResult.allowed) {
.opencode/bin/mk-spec-memory-launcher.cjs:853:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:854:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:855:      return { action: 'report', reason: ownerReapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:858:    clearOwnerLeaseFileIfOwner(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:859:    const ownerLease = buildOwnerLease(process.pid);
.opencode/bin/mk-spec-memory-launcher.cjs:860:    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
.opencode/bin/mk-spec-memory-launcher.cjs:862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:863:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:864:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:866:    ownerLeasePid = process.pid;
.opencode/bin/mk-spec-memory-launcher.cjs:870:      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:871:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:872:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:876:    leaseStartedAt = new Date().toISOString();
.opencode/bin/mk-spec-memory-launcher.cjs:879:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:881:    releaseRespawnLockFile(respawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:888:async function bridgeOrReportLeaseHeld(leaseResult) {
.opencode/bin/mk-spec-memory-launcher.cjs:889:  const readiness = bridgeReadiness(leaseResult);
.opencode/bin/mk-spec-memory-launcher.cjs:891:    writeLeaseHeldJsonRpcError(leaseResult, readiness.reason);
.opencode/bin/mk-spec-memory-launcher.cjs:897:    leaseResult,
.opencode/bin/mk-spec-memory-launcher.cjs:903:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-spec-memory-launcher.cjs:908:async function bridgeOrReportLeaseHeldAndExit(leaseResult) {
.opencode/bin/mk-spec-memory-launcher.cjs:909:  const decision = await bridgeOrReportLeaseHeld(leaseResult);
.opencode/bin/mk-spec-memory-launcher.cjs:928:// Pure lease-payload builder (exported for tests). `childPid`, `modelServerPid`, and `socketPath`
.opencode/bin/mk-spec-memory-launcher.cjs:929:// are ADDITIVE fields; existing readers consume only pid/startedAt/ownerPid and ignore the extras.
.opencode/bin/mk-spec-memory-launcher.cjs:930:// `socketPath` records the IPC path this owner actually listens on so a secondary launcher prefers
.opencode/bin/mk-spec-memory-launcher.cjs:932:function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null, socketPath = null) {
.opencode/bin/mk-spec-memory-launcher.cjs:933:  return buildSharedLeaseObject(childPid, startedAt || new Date().toISOString(), modelServerPid, socketPath);
.opencode/bin/mk-spec-memory-launcher.cjs:937:  if (!leaseStartedAt) leaseStartedAt = new Date().toISOString();
.opencode/bin/mk-spec-memory-launcher.cjs:938:  const payload = buildLeaseObject(childPid, leaseStartedAt, modelServerPid, resolveSessionProxySocketPath());
.opencode/bin/mk-spec-memory-launcher.cjs:939:  return writeAtomicJsonFile(leasePath(), payload, 'lease write');
.opencode/bin/mk-spec-memory-launcher.cjs:942:function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:943:  const pidDir = socketPath.startsWith('tcp://') ? resolvedDbDir() : path.dirname(socketPath);
.opencode/bin/mk-spec-memory-launcher.cjs:948:  const socketPath = resolveModelServerSocketPath();
.opencode/bin/mk-spec-memory-launcher.cjs:949:  const pidPath = sharedModelServerPidPath(socketPath);
.opencode/bin/mk-spec-memory-launcher.cjs:967:    ownerLauncher: 'mk-spec-memory',
.opencode/bin/mk-spec-memory-launcher.cjs:968:    socketPath,
.opencode/bin/mk-spec-memory-launcher.cjs:983:  const lease = readLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:984:  return Number.isInteger(lease?.modelServerPid) && lease.modelServerPid > 0 ? lease.modelServerPid : null;
.opencode/bin/mk-spec-memory-launcher.cjs:1003:    const lease = readLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:1004:    if (launcherShutdownInProgress && Number.isInteger(lease?.modelServerPid) && lease.modelServerPid > 0) {
.opencode/bin/mk-spec-memory-launcher.cjs:1006:        hfControl.reapProcessTree(lease.modelServerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:1011:    if (lease && lease.pid === process.pid) fs.unlinkSync(leasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:1156:// Refresh the before-death descendant snapshot from a live process-tree walk. Called periodically by
.opencode/bin/mk-spec-memory-launcher.cjs:1171:// forked-detached sidecar GRANDCHILD; on hard daemon death it re-parents to pid 1, so a fresh walk
.opencode/bin/mk-spec-memory-launcher.cjs:1186:// closures and runtime behavior is unchanged; tests inject fakes to assert lease handling.
.opencode/bin/mk-spec-memory-launcher.cjs:1231:  // Keep the lease held across an in-place recycle. The launcher process stays alive and the
.opencode/bin/mk-spec-memory-launcher.cjs:1232:  // lease is keyed on its (still-live) pid, so the replacement daemon is respawned by the child
.opencode/bin/mk-spec-memory-launcher.cjs:1233:  // exit handler's scheduleRelaunch backoff. Clearing the lease here would open a window — until
.opencode/bin/mk-spec-memory-launcher.cjs:1234:  // relaunch rewrites childPid — where a concurrent launcher reads no lease and passes the
.opencode/bin/mk-spec-memory-launcher.cjs:1285:const BOOTSTRAP_LOCK_OWNER_FILE = 'owner.pid';
.opencode/bin/mk-spec-memory-launcher.cjs:1299:// Reclaim a stale bootstrap lockdir. A lock is reclaimable as soon as its
.opencode/bin/mk-spec-memory-launcher.cjs:1305:function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_STALE_MS) {
.opencode/bin/mk-spec-memory-launcher.cjs:1313:  const ownerPid = readBootstrapLockOwnerPid();
.opencode/bin/mk-spec-memory-launcher.cjs:1314:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-spec-memory-launcher.cjs:1315:  if (!ownerDead && ageMs <= staleMs) {
.opencode/bin/mk-spec-memory-launcher.cjs:1318:  // Atomically CLAIM the stale lockdir via rename before deleting it. Only one
.opencode/bin/mk-spec-memory-launcher.cjs:1323:  const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
.opencode/bin/mk-spec-memory-launcher.cjs:1325:    fs.renameSync(lockDir, staleClaim);
.opencode/bin/mk-spec-memory-launcher.cjs:1326:    fs.rmSync(staleClaim, { recursive: true, force: true });
.opencode/bin/mk-spec-memory-launcher.cjs:1327:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
.opencode/bin/mk-spec-memory-launcher.cjs:1328:    log(`reclaiming stale bootstrap lock ${rel(lockDir)} (${reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:1340:  const staleMs = options.staleMs ?? BOOTSTRAP_LOCK_STALE_MS;
.opencode/bin/mk-spec-memory-launcher.cjs:1356:      if (removeStaleBootstrapLock(staleMs)) {
.opencode/bin/mk-spec-memory-launcher.cjs:1371:  if (ownerLeaseRequired && !ownsOwnerLeaseFile(process.pid)) {
.opencode/bin/mk-spec-memory-launcher.cjs:1372:    log('launchServer skipped: spec-memory owner lease is absent or owned by another launcher');
.opencode/bin/mk-spec-memory-launcher.cjs:1402:    log('owner lease refresh failed after child spawn; launcher pid remains the recorded owner');
.opencode/bin/mk-spec-memory-launcher.cjs:1433:              log('relaunch aborted: launcher shutting down or owning runtime gone; releasing lease and exiting');
.opencode/bin/mk-spec-memory-launcher.cjs:1445:      log(`context-server crash loop detected after ${result.deathsInWindow} deaths; clearing lease and mirroring child exit`);
.opencode/bin/mk-spec-memory-launcher.cjs:1459:// Pure decision for the exit-86 flow (exported for tests). A lease whose
.opencode/bin/mk-spec-memory-launcher.cjs:1460:// owner is THIS launcher is NOT a bridge target: in supervised mode the
.opencode/bin/mk-spec-memory-launcher.cjs:1461:// pid-lease records the launcher's own pid, so after its child exits 86 the
.opencode/bin/mk-spec-memory-launcher.cjs:1462:// lease still reads "held by a live owner" — us. Bridging would deep-probe
.opencode/bin/mk-spec-memory-launcher.cjs:1463:// our own dead socket and route into a self-reap. Only a DIFFERENT live
.opencode/bin/mk-spec-memory-launcher.cjs:1464:// owner is bridgeable; a self-held lease means a non-daemon process (e.g. a
.opencode/bin/mk-spec-memory-launcher.cjs:1466:function decideDbLockHeldAction({ leaseHeld, leaseOwnerPid, selfPid, attempt, maxRetries }) {
.opencode/bin/mk-spec-memory-launcher.cjs:1468:  if (leaseHeld && leaseOwnerPid !== selfPid) return { action: 'bridge' };
.opencode/bin/mk-spec-memory-launcher.cjs:1474:// process holds. Prefer bridging to that owner; when the holder is not a
.opencode/bin/mk-spec-memory-launcher.cjs:1479:  const leaseResult = isLeaseHeld();
.opencode/bin/mk-spec-memory-launcher.cjs:1481:    leaseHeld: leaseResult.held,
.opencode/bin/mk-spec-memory-launcher.cjs:1482:    leaseOwnerPid: leaseResult.ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:1488:    log(`context-server exited: database single-writer lock held; bridging to live owner pid=${leaseResult.ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1489:    await bridgeOrReportLeaseHeldAndExit(leaseResult);
.opencode/bin/mk-spec-memory-launcher.cjs:1507:    { ownerPid: leaseResult.ownerPid ?? 'unknown', startedAt: leaseResult.startedAt ?? new Date().toISOString() },
.opencode/bin/mk-spec-memory-launcher.cjs:1523:  // Re-election release path (on by default): release the detached context-server for a live secondary to adopt
.opencode/bin/mk-spec-memory-launcher.cjs:1524:  // instead of killing it. Reap only the non-adoptable model-server, KEEP the daemon lease (its socket
.opencode/bin/mk-spec-memory-launcher.cjs:1527:  if (shouldReleaseDaemonForReelection({ enabled: daemonReelectionEnabled(), hasLiveDaemon: isChildRunning(childProcess) })) {
.opencode/bin/mk-spec-memory-launcher.cjs:1528:    const releasedModelServer = hfControl.getChild();
.opencode/bin/mk-spec-memory-launcher.cjs:1529:    if (isChildRunning(releasedModelServer)) {
.opencode/bin/mk-spec-memory-launcher.cjs:1530:      hfControl.reapProcessTree(releasedModelServer.pid);
.opencode/bin/mk-spec-memory-launcher.cjs:1531:      releasedModelServer.kill(signal);
.opencode/bin/mk-spec-memory-launcher.cjs:1533:      // so the release path does not leave a wedged sidecar behind on its way out.
.opencode/bin/mk-spec-memory-launcher.cjs:1534:      const exited = await waitForChildExit(releasedModelServer, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-spec-memory-launcher.cjs:1535:      if (!exited && isChildRunning(releasedModelServer)) {
.opencode/bin/mk-spec-memory-launcher.cjs:1536:        releasedModelServer.kill('SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:1539:    log('daemon re-election: releasing context-server for adoption (not killing); dropping ownership lease only');
.opencode/bin/mk-spec-memory-launcher.cjs:1540:    // The process 'exit' handler clears BOTH leases; detach it first so the daemon lease (its socket
.opencode/bin/mk-spec-memory-launcher.cjs:1608:  let staleRespawnLock = null;
.opencode/bin/mk-spec-memory-launcher.cjs:1617:    ownerLeaseRequired = strictSingleWriter;
.opencode/bin/mk-spec-memory-launcher.cjs:1620:      if (legacyLeaseResult.held && legacyLeaseResult.legacyPath && !legacyLeaseResult.staleReclaimable) {
.opencode/bin/mk-spec-memory-launcher.cjs:1631:      const ownerLeaseResult = acquireOwnerLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:1632:      if (!ownerLeaseResult.acquired) {
.opencode/bin/mk-spec-memory-launcher.cjs:1633:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1634:        await bridgeOrReportLeaseHeldAndExit(leaseResultForOwnerLease(ownerLeaseResult.holder));
.opencode/bin/mk-spec-memory-launcher.cjs:1638:      const leaseResult = isLeaseHeld();
.opencode/bin/mk-spec-memory-launcher.cjs:1639:      if (leaseResult.held && !leaseResult.staleReclaimable) {
.opencode/bin/mk-spec-memory-launcher.cjs:1641:        await bridgeOrReportLeaseHeldAndExit(leaseResult);
.opencode/bin/mk-spec-memory-launcher.cjs:1644:      if (leaseResult.staleReclaimable) {
.opencode/bin/mk-spec-memory-launcher.cjs:1645:        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1646:        // A re-election daemon released by a disposing owner (or orphaned by a crashed owner) stays
.opencode/bin/mk-spec-memory-launcher.cjs:1647:        // alive under this stale lease, which records the live daemon as childPid. ADOPT it: if the
.opencode/bin/mk-spec-memory-launcher.cjs:1648:        // daemon is still alive and its recorded socket is bridgeable, bridge to the live socket
.opencode/bin/mk-spec-memory-launcher.cjs:1652:        const staleLease = readLeaseFile(leaseResult.legacyPath || leasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:1653:        const orphanChildPid = staleLease?.childPid;
.opencode/bin/mk-spec-memory-launcher.cjs:1655:          const adoptResult = { ...leaseResult, socketPath: staleLease.socketPath || leaseResult.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:1658:            // A live pid that still owns its socket can be WEDGED: its event loop is starved, so the
.opencode/bin/mk-spec-memory-launcher.cjs:1660:            // request. bridgeReadiness only proves the socket file exists — adopting on that alone
.opencode/bin/mk-spec-memory-launcher.cjs:1663:            // probe the dead-socket decision uses, with its tuned timeout + retry that tolerates a
.opencode/bin/mk-spec-memory-launcher.cjs:1669:              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
.opencode/bin/mk-spec-memory-launcher.cjs:1670:                onRetry: (attempt, total, result) => log(`stale-reclaim adopt probe ${attempt}/${total} not alive (${result.reason}); retrying`),
.opencode/bin/mk-spec-memory-launcher.cjs:1673:              // The probe resolves to a status even on socket failure; a thrown error means the probe
.opencode/bin/mk-spec-memory-launcher.cjs:1679:              log(`stale-reclaim adopting live daemon pid ${orphanChildPid} via bridge instead of reaping`);
.opencode/bin/mk-spec-memory-launcher.cjs:1689:              log(`stale-reclaim adopting busy daemon pid ${orphanChildPid} via bridge: probe failed (${probe.reason}) but a fresh maintenance marker is active (until ${new Date(adoptMarker.activeUntilMs).toISOString()})`);
.opencode/bin/mk-spec-memory-launcher.cjs:1694:            log(`stale-reclaim NOT adopting pid ${orphanChildPid}: liveness probe failed (${probe.reason}); reaping and respawning instead`);
.opencode/bin/mk-spec-memory-launcher.cjs:1697:        // Daemon is dead, unbridgeable, or alive but failing its liveness probe. Reclaiming an existing STALE owner lease is a
.opencode/bin/mk-spec-memory-launcher.cjs:1698:        // non-exclusive write (the owner-lease O_EXCL above only covers the no-prior-lease case), so
.opencode/bin/mk-spec-memory-launcher.cjs:1699:        // two fresh launchers racing a crashed owner could both reach the reap and spawn. Take the
.opencode/bin/mk-spec-memory-launcher.cjs:1700:        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
.opencode/bin/mk-spec-memory-launcher.cjs:1702:        staleRespawnLock = acquireRespawnLockFile();
.opencode/bin/mk-spec-memory-launcher.cjs:1703:        if (!staleRespawnLock.acquired) {
.opencode/bin/mk-spec-memory-launcher.cjs:1704:          log('stale-reclaim deferred: another launcher holds the respawn lock; reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1706:          writeLeaseHeldJsonRpcError(leaseResult, 'respawn-lock-held');
.opencode/bin/mk-spec-memory-launcher.cjs:1713:          // risk a second writer, so if the recorded lease no longer names the orphan we snapshotted,
.opencode/bin/mk-spec-memory-launcher.cjs:1714:          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
.opencode/bin/mk-spec-memory-launcher.cjs:1715:          const recheckLease = readLeaseFile(leaseResult.legacyPath || leasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:1717:            log('stale-reclaim deferred: lease childPid changed after acquiring respawn lock (replacement already present); reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1718:            releaseRespawnLockFile(staleRespawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:1719:            staleRespawnLock = null;
.opencode/bin/mk-spec-memory-launcher.cjs:1721:            writeLeaseHeldJsonRpcError(leaseResult, 'respawn-superseded');
.opencode/bin/mk-spec-memory-launcher.cjs:1726:            // Cannot confirm the released daemon is gone (EPERM, or it outlived SIGKILL); spawning
.opencode/bin/mk-spec-memory-launcher.cjs:1727:            // now would create a second writer, so report the lease as held and let the host
.opencode/bin/mk-spec-memory-launcher.cjs:1729:            log(`stale-reclaim aborted: ${reap.reason} for childPid=${orphanChildPid}; reporting lease held`);
.opencode/bin/mk-spec-memory-launcher.cjs:1730:            releaseRespawnLockFile(staleRespawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:1731:            staleRespawnLock = null;
.opencode/bin/mk-spec-memory-launcher.cjs:1733:            writeLeaseHeldJsonRpcError(leaseResult, reap.reason);
.opencode/bin/mk-spec-memory-launcher.cjs:1739:      log('MK_SPEC_MEMORY_STRICT_SINGLE_WRITER is disabled; skipping lease check');
.opencode/bin/mk-spec-memory-launcher.cjs:1762:      writeLeaseHeldJsonRpcError({ ownerPid: reprobe ? reprobe.pid : 'unknown', startedAt }, 'lease-reprobe-lost');
.opencode/bin/mk-spec-memory-launcher.cjs:1767:    if (staleRespawnLock) {
.opencode/bin/mk-spec-memory-launcher.cjs:1768:      releaseRespawnLockFile(staleRespawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:1769:      staleRespawnLock = null;
.opencode/bin/mk-spec-memory-launcher.cjs:1774:        socketPath: resolveSessionProxySocketPath(),
.opencode/bin/mk-spec-memory-launcher.cjs:1803:    if (staleRespawnLock) {
.opencode/bin/mk-spec-memory-launcher.cjs:1804:      releaseRespawnLockFile(staleRespawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:1805:      staleRespawnLock = null;
.opencode/bin/mk-spec-memory-launcher.cjs:1829:  ownerLeasePath,
.opencode/bin/mk-spec-memory-launcher.cjs:1868:  shouldReleaseDaemonForReelection,
.opencode/bin/code-index.cjs:19:const socketFileName = 'daemon-ipc.sock';
.opencode/bin/code-index.cjs:82:    // Freshness metadata is an optimization; stale detection remains conservative.
.opencode/bin/code-index.cjs:98:    fail('code-index dist entrypoint is stale. Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.');
.opencode/bin/code-index.cjs:107:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/code-index.cjs:108:  if (socketDir.startsWith('tcp://')) return;
.opencode/bin/code-index.cjs:109:  fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/bin/code-index.cjs:110:  const socketPath = path.join(path.resolve(socketDir), socketFileName);
.opencode/bin/code-index.cjs:111:  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
.opencode/bin/code-index.cjs:112:    fail(`code-index socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
.opencode/bin/cli-offline-smoke.cjs:10:const socketFileName = 'daemon-ipc.sock';
.opencode/bin/cli-offline-smoke.cjs:36:  if (exitCode === 69 && /dist entrypoint is (stale|missing)/i.test(stderr)) {
.opencode/bin/cli-offline-smoke.cjs:37:    return 'dist_stale_rebuild_required';
.opencode/bin/cli-offline-smoke.cjs:55:  const socketDir = path.join(sandbox, 'sock');
.opencode/bin/cli-offline-smoke.cjs:61:        SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/bin/cli-offline-smoke.cjs:75:      daemonFree: !fs.existsSync(path.join(socketDir, socketFileName)),
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:24:- `detect_changes` maps unified diffs to affected indexed symbols and refuses stale graph reads.
.opencode/bin/spec-memory.cjs:19:const socketFileName = 'daemon-ipc.sock';
.opencode/bin/spec-memory.cjs:83:    // Freshness metadata is an optimization; stale detection remains conservative.
.opencode/bin/spec-memory.cjs:99:    fail('spec-memory dist entrypoint is stale. Run npm run build --workspace=@spec-kit/mcp-server.');
.opencode/bin/spec-memory.cjs:108:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/spec-memory.cjs:109:  if (socketDir.startsWith('tcp://')) return;
.opencode/bin/spec-memory.cjs:110:  fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/bin/spec-memory.cjs:111:  const socketPath = path.join(path.resolve(socketDir), socketFileName);
.opencode/bin/spec-memory.cjs:112:  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
.opencode/bin/spec-memory.cjs:113:    fail(`spec-memory socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
.opencode/bin/mk-code-index-launcher.cjs:40:      process.stderr.write(`[mk-code-index-launcher] env value for ${key} contains control chars; skipping\n`);
.opencode/bin/mk-code-index-launcher.cjs:44:      process.stderr.write(`[mk-code-index-launcher] env ${key} from ${path.basename(filePath)} is not allowlisted; skipping\n`);
.opencode/bin/mk-code-index-launcher.cjs:85:      if (n > 0) process.stderr.write(`[mk-code-index-launcher] loaded ${n} env(s) from ${fname}\n`);
.opencode/bin/mk-code-index-launcher.cjs:102:      `[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for ${maintainerCategories.join(', ')}\n`
.opencode/bin/mk-code-index-launcher.cjs:111:// Former shared location (.opencode/.spec-kit/code-graph/database/) is migrated back on first startup.
.opencode/bin/mk-code-index-launcher.cjs:113:let lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
.opencode/bin/mk-code-index-launcher.cjs:114:const PID_FILE_NAME = '.mk-code-index-launcher.json';
.opencode/bin/mk-code-index-launcher.cjs:115:const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
.opencode/bin/mk-code-index-launcher.cjs:123:let ownerLeasePid = null;
.opencode/bin/mk-code-index-launcher.cjs:125:let leaseMetricSink = null;
.opencode/bin/mk-code-index-launcher.cjs:130:  staleReclaimed: 'stale-reclaimed',
.opencode/bin/mk-code-index-launcher.cjs:135:  process.stderr.write(`[mk-code-index-launcher] ${message}\n`);
.opencode/bin/mk-code-index-launcher.cjs:138:function leaseMetricClassForTransition(transition) {
.opencode/bin/mk-code-index-launcher.cjs:140:    throw new Error(`Unknown lease metric transition: ${transition}`);
.opencode/bin/mk-code-index-launcher.cjs:145:function leaseMetricCounterName(leaseClass) {
.opencode/bin/mk-code-index-launcher.cjs:146:  return `mk_code_index_lease_${leaseClass.replace(/-/g, '_')}_total`;
.opencode/bin/mk-code-index-launcher.cjs:149:function emitLeaseMetric(leaseClass, details = {}) {
.opencode/bin/mk-code-index-launcher.cjs:150:  if (typeof leaseMetricSink !== 'function') return;
.opencode/bin/mk-code-index-launcher.cjs:151:  leaseMetricSink({
.opencode/bin/mk-code-index-launcher.cjs:152:    counter: leaseMetricCounterName(leaseClass),
.opencode/bin/mk-code-index-launcher.cjs:153:    class: leaseClass,
.opencode/bin/mk-code-index-launcher.cjs:161:  leaseMetricSink = typeof sink === 'function' ? sink : null;
.opencode/bin/mk-code-index-launcher.cjs:166:    return require('./lib/launcher-ipc-bridge.cjs');
.opencode/bin/mk-code-index-launcher.cjs:170:      async maybeBridgeLeaseHolder({ leaseResult }) {
.opencode/bin/mk-code-index-launcher.cjs:171:        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-code-index-launcher.cjs:172:        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-code-index-launcher.cjs:173:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-code-index-launcher.cjs:174:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-code-index-launcher.cjs:204:// Bridge a secondary client through the reconnecting session proxy so a code-index owner death no
.opencode/bin/mk-code-index-launcher.cjs:207:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:210:    socketPath,
.opencode/bin/mk-code-index-launcher.cjs:224:  lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
.opencode/bin/mk-code-index-launcher.cjs:295:function leasePath() {
.opencode/bin/mk-code-index-launcher.cjs:299:function ownerLeasePath() {
.opencode/bin/mk-code-index-launcher.cjs:306:  // `skill/` (singular) typo dir, so a launcher still holding an old-location lease is detected.
.opencode/bin/mk-code-index-launcher.cjs:313:function readLeaseFile(filePath = leasePath()) {
.opencode/bin/mk-code-index-launcher.cjs:319:    // Missing or corrupt lease files are treated as no active lease.
.opencode/bin/mk-code-index-launcher.cjs:324:function readOwnerLeaseFile(filePath = ownerLeasePath()) {
.opencode/bin/mk-code-index-launcher.cjs:328:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-code-index-launcher.cjs:339:    // Missing or corrupt owner leases are treated as no active owner.
.opencode/bin/mk-code-index-launcher.cjs:344:function writeOwnerLeaseFile(lease) {
.opencode/bin/mk-code-index-launcher.cjs:345:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:347:  fs.writeFileSync(tmp, `${JSON.stringify(lease, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
.opencode/bin/mk-code-index-launcher.cjs:351:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-code-index-launcher.cjs:352:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:356:    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
.opencode/bin/mk-code-index-launcher.cjs:367:// The socket path this owner's environment computes. Recording it in the
.opencode/bin/mk-code-index-launcher.cjs:368:// leases lets a secondary under a divergent SPECKIT_IPC_SOCKET_DIR bridge
.opencode/bin/mk-code-index-launcher.cjs:369:// to the REAL socket instead of probing a recomputed wrong one and
.opencode/bin/mk-code-index-launcher.cjs:370:// misreporting a healthy owner as no-bridge-socket.
.opencode/bin/mk-code-index-launcher.cjs:371:function ownerSocketPath() {
.opencode/bin/mk-code-index-launcher.cjs:381:let ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-code-index-launcher.cjs:384:  if (ownerLeaseHeartbeatTimer) {
.opencode/bin/mk-code-index-launcher.cjs:385:    clearInterval(ownerLeaseHeartbeatTimer);
.opencode/bin/mk-code-index-launcher.cjs:386:    ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-code-index-launcher.cjs:390:// Without a periodic refresh, every healthy long-running owner classifies
.opencode/bin/mk-code-index-launcher.cjs:391:// as stale-heartbeat-reclaim about two minutes after spawn, so each later
.opencode/bin/mk-code-index-launcher.cjs:392:// secondary start rewrites the owner lease before rediscovering the live
.opencode/bin/mk-code-index-launcher.cjs:393:// PID lease — churn plus reclaim-race exposure for nothing.
.opencode/bin/mk-code-index-launcher.cjs:394:function startOwnerLeaseHeartbeat(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:396:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:397:  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
.opencode/bin/mk-code-index-launcher.cjs:399:  ownerLeaseHeartbeatTimer = setInterval(() => {
.opencode/bin/mk-code-index-launcher.cjs:400:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-code-index-launcher.cjs:401:    // A failed refresh means a concurrent reclaim superseded this owner;
.opencode/bin/mk-code-index-launcher.cjs:403:    // so stop heartbeating instead of fighting the new owner.
.opencode/bin/mk-code-index-launcher.cjs:404:    log('owner lease heartbeat refresh failed (superseded); stopping heartbeat');
.opencode/bin/mk-code-index-launcher.cjs:407:  ownerLeaseHeartbeatTimer.unref?.();
.opencode/bin/mk-code-index-launcher.cjs:410:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:412:    ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:419:    socketPath: ownerSocketPath(),
.opencode/bin/mk-code-index-launcher.cjs:455:function classifyOwnerLease(lease) {
.opencode/bin/mk-code-index-launcher.cjs:456:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:457:  if (liveness === 'dead') return 'stale-pid';
.opencode/bin/mk-code-index-launcher.cjs:460:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:461:  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
.opencode/bin/mk-code-index-launcher.cjs:465:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/bin/mk-code-index-launcher.cjs:466:  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
.opencode/bin/mk-code-index-launcher.cjs:468:    return 'stale-heartbeat-reclaim';
.opencode/bin/mk-code-index-launcher.cjs:471:  return 'live-owner';
.opencode/bin/mk-code-index-launcher.cjs:475:  const currentOwnerLeasePath = ownerLeasePath();
.opencode/bin/mk-code-index-launcher.cjs:480:    if (classification === 'live-owner' || classification === 'unknown-eperm') {
.opencode/bin/mk-code-index-launcher.cjs:483:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:486:  const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-code-index-launcher.cjs:487:  // Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL).
.opencode/bin/mk-code-index-launcher.cjs:488:  // This collapses the fresh-acquire and stale-reclaim paths into a single CAS so
.opencode/bin/mk-code-index-launcher.cjs:490:  // acquired:false instead of last-writer-wins overwriting the winner's lease.
.opencode/bin/mk-code-index-launcher.cjs:498:  if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-code-index-launcher.cjs:502:      holder: holder || lease,
.opencode/bin/mk-code-index-launcher.cjs:503:      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
.opencode/bin/mk-code-index-launcher.cjs:506:  ownerLeasePid = process.pid;
.opencode/bin/mk-code-index-launcher.cjs:508:    emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
.opencode/bin/mk-code-index-launcher.cjs:509:      ownerPid: existing.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:510:      ownerClassification: classifyOwnerLease(existing),
.opencode/bin/mk-code-index-launcher.cjs:511:      leaseKind: 'owner',
.opencode/bin/mk-code-index-launcher.cjs:514:  return { acquired: true, lease, reclaimed: existing };
.opencode/bin/mk-code-index-launcher.cjs:517:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-code-index-launcher.cjs:518:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:519:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-code-index-launcher.cjs:520:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:522:    ...lease,
.opencode/bin/mk-code-index-launcher.cjs:527:  // the ownership check and the write, do not claim the refresh succeeded.
.opencode/bin/mk-code-index-launcher.cjs:529:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-code-index-launcher.cjs:530:  ownerLeasePid = nextOwnerPid;
.opencode/bin/mk-code-index-launcher.cjs:535:  if (!Number.isInteger(ownerLeasePid)) return;
.opencode/bin/mk-code-index-launcher.cjs:537:    // Re-confirm ownership immediately before unlink so a successor lease written
.opencode/bin/mk-code-index-launcher.cjs:539:    // closing it would require the launcher to share owner-lease.ts's mutation lock.
.opencode/bin/mk-code-index-launcher.cjs:540:    const lease = readOwnerLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:541:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-code-index-launcher.cjs:542:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-code-index-launcher.cjs:543:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-code-index-launcher.cjs:548:    ownerLeasePid = null;
.opencode/bin/mk-code-index-launcher.cjs:552:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:554:    // Re-confirm ownership immediately before unlink (see clearOwnerLeaseFile).
.opencode/bin/mk-code-index-launcher.cjs:555:    const lease = readOwnerLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:556:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-code-index-launcher.cjs:557:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:558:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-code-index-launcher.cjs:575:// A former-location DB is still "owned" if EITHER the launcher PID lease
.opencode/bin/mk-code-index-launcher.cjs:576:// (.mk-code-index-launcher.json) or the owner lease (.code-graph-owner.json) names a live process.
.opencode/bin/mk-code-index-launcher.cjs:578:  return pidLiveAt(path.join(dir, '.mk-code-index-launcher.json'), 'pid')
.opencode/bin/mk-code-index-launcher.cjs:579:      || pidLiveAt(path.join(dir, '.code-graph-owner.json'), 'ownerPid');
.opencode/bin/mk-code-index-launcher.cjs:582:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-code-index-launcher.cjs:583:  const lease = readLeaseFile(filePath);
.opencode/bin/mk-code-index-launcher.cjs:584:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:585:  // Surface the owner-recorded socket path so the bridge prefers it over
.opencode/bin/mk-code-index-launcher.cjs:587:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-code-index-launcher.cjs:588:  // Do not bridge to a LEGACY-location lease unless its lease file is owned by the
.opencode/bin/mk-code-index-launcher.cjs:589:  // current user. A foreign-owned lease in a shared/former path could otherwise point this
.opencode/bin/mk-code-index-launcher.cjs:590:  // client at a spoofed IPC socket.
.opencode/bin/mk-code-index-launcher.cjs:594:        return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:597:      return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:600:  const startedAt = lease.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-code-index-launcher.cjs:602:    process.kill(lease.pid, 0);
.opencode/bin/mk-code-index-launcher.cjs:603:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:605:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:606:    // Mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
.opencode/bin/mk-code-index-launcher.cjs:607:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:613:  const primary = leaseHeldFromFile(leasePath());
.opencode/bin/mk-code-index-launcher.cjs:617:    if (legacyPath === leasePath()) continue;
.opencode/bin/mk-code-index-launcher.cjs:618:    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
.opencode/bin/mk-code-index-launcher.cjs:619:    if (legacy.held || legacy.staleReclaimable) return legacy;
.opencode/bin/mk-code-index-launcher.cjs:625:function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
.opencode/bin/mk-code-index-launcher.cjs:626:  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-code-index-launcher.cjs:627:  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-code-index-launcher.cjs:628:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-code-index-launcher.cjs:640:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:641:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:643:    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
.opencode/bin/mk-code-index-launcher.cjs:646:    return { allowed: true, reason: 'owner-already-dead' };
.opencode/bin/mk-code-index-launcher.cjs:649:  log(`confirmed-dead socket; reaping recorded code-index owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-code-index-launcher.cjs:651:    process.kill(ownerPid, 'SIGTERM');
.opencode/bin/mk-code-index-launcher.cjs:655:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-code-index-launcher.cjs:657:    log(`code-index owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-code-index-launcher.cjs:659:      process.kill(ownerPid, 'SIGKILL');
.opencode/bin/mk-code-index-launcher.cjs:663:    await waitForPidExit(ownerPid, 1000);
.opencode/bin/mk-code-index-launcher.cjs:665:  return { allowed: true, reason: 'owner-reaped' };
.opencode/bin/mk-code-index-launcher.cjs:668:async function respawnAfterDeadSocket(leaseResult, decision, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:670:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-code-index-launcher.cjs:671:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:674:  const ownerPid = options.respawnChildPid;
.opencode/bin/mk-code-index-launcher.cjs:675:  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
.opencode/bin/mk-code-index-launcher.cjs:676:    log('confirmed-dead socket but no recorded code-index child owner pid is available; respawn inert');
.opencode/bin/mk-code-index-launcher.cjs:677:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
.opencode/bin/mk-code-index-launcher.cjs:678:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:685:    if (currentOwner?.ownerPid !== ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:686:      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
.opencode/bin/mk-code-index-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-code-index-launcher.cjs:688:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:691:    const reapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:693:      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:694:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-code-index-launcher.cjs:695:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:698:    clearOwnerLeaseFileIfOwner(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:699:    const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-code-index-launcher.cjs:700:    if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-code-index-launcher.cjs:702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-code-index-launcher.cjs:703:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-code-index-launcher.cjs:704:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:706:    ownerLeasePid = process.pid;
.opencode/bin/mk-code-index-launcher.cjs:711:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:719:async function bridgeOrReportLeaseHeld(leaseResult, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:723:    leaseResult,
.opencode/bin/mk-code-index-launcher.cjs:724:    loggerPrefix: 'mk-code-index-launcher',
.opencode/bin/mk-code-index-launcher.cjs:729:    const respawnResult = await respawnAfterDeadSocket(leaseResult, decision, options);
.opencode/bin/mk-code-index-launcher.cjs:731:      emitLeaseMetric(leaseMetricClassForTransition('respawned'), {
.opencode/bin/mk-code-index-launcher.cjs:732:        ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:734:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:737:      emitLeaseMetric(leaseMetricClassForTransition('heldByOther'), {
.opencode/bin/mk-code-index-launcher.cjs:738:        ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:740:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:746:    leaseMetricClassForTransition(decision?.action === 'bridge' ? 'bridgedSecondary' : 'heldByOther'),
.opencode/bin/mk-code-index-launcher.cjs:748:      ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:750:      socketPath: decision?.socketPath ?? leaseResult.socketPath ?? null,
.opencode/bin/mk-code-index-launcher.cjs:757:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:759:  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: ownerSocketPath() }, null, 2), { mode: 0o600 });
.opencode/bin/mk-code-index-launcher.cjs:765:    const lease = readLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:766:    if (lease && lease.pid === process.pid) fs.unlinkSync(leasePath());
.opencode/bin/mk-code-index-launcher.cjs:871:const BOOTSTRAP_LOCK_OWNER_FILE = 'owner.pid';
.opencode/bin/mk-code-index-launcher.cjs:885:// Reclaim a stale bootstrap lockdir. A lock is reclaimable as soon as its
.opencode/bin/mk-code-index-launcher.cjs:889:// staleMs ago wedges every requireLock respawn for the full wait deadline.
.opencode/bin/mk-code-index-launcher.cjs:890:function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_STALE_MS) {
.opencode/bin/mk-code-index-launcher.cjs:898:  const ownerPid = readBootstrapLockOwnerPid();
.opencode/bin/mk-code-index-launcher.cjs:899:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-code-index-launcher.cjs:900:  if (!ownerDead && ageMs <= staleMs) {
.opencode/bin/mk-code-index-launcher.cjs:903:  // Atomically CLAIM the stale lockdir via rename before deleting it. Only one
.opencode/bin/mk-code-index-launcher.cjs:908:  const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
.opencode/bin/mk-code-index-launcher.cjs:910:    fs.renameSync(lockDir, staleClaim);
.opencode/bin/mk-code-index-launcher.cjs:911:    fs.rmSync(staleClaim, { recursive: true, force: true });
.opencode/bin/mk-code-index-launcher.cjs:912:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
.opencode/bin/mk-code-index-launcher.cjs:913:    log(`reclaiming stale bootstrap lock ${rel(lockDir)} (${reason})`);
.opencode/bin/mk-code-index-launcher.cjs:925:  const staleMs = options.staleMs ?? BOOTSTRAP_LOCK_STALE_MS;
.opencode/bin/mk-code-index-launcher.cjs:944:      if (removeStaleBootstrapLock(staleMs)) {
.opencode/bin/mk-code-index-launcher.cjs:975:      ownerPid: childProcess.pid,
.opencode/bin/mk-code-index-launcher.cjs:980:      log('owner lease refresh to child pid failed; launcher pid remains the recorded owner');
.opencode/bin/mk-code-index-launcher.cjs:987:      // Clear the lease before mirroring the signal; process.on('exit') does not fire on SIGKILL.
.opencode/bin/mk-code-index-launcher.cjs:1043:  // Orphan daemon pid recorded by a reclaimed prior owner lease. A SIGKILL'd
.opencode/bin/mk-code-index-launcher.cjs:1046:  // against the same DB (mirrors the dead-socket respawn reap and the sibling
.opencode/bin/mk-code-index-launcher.cjs:1060:      const ownerLeaseResult = acquireOwnerLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:1061:      if (ownerLeaseResult.acquired
.opencode/bin/mk-code-index-launcher.cjs:1062:          && ownerLeaseResult.reclaimed
.opencode/bin/mk-code-index-launcher.cjs:1063:          && Number.isInteger(ownerLeaseResult.reclaimed.ownerPid)
.opencode/bin/mk-code-index-launcher.cjs:1064:          && ownerLeaseResult.reclaimed.ownerPid > 0
.opencode/bin/mk-code-index-launcher.cjs:1065:          && ownerLeaseResult.reclaimed.ownerPid !== process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:1066:        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:1068:      if (!ownerLeaseResult.acquired) {
.opencode/bin/mk-code-index-launcher.cjs:1069:        // A live owner already holds the single-writer lease. Bridge this
.opencode/bin/mk-code-index-launcher.cjs:1070:        // client's stdio to the owner's IPC socket so additional sessions and
.opencode/bin/mk-code-index-launcher.cjs:1073:        // only when the socket is missing/refused or bridging is disabled.
.opencode/bin/mk-code-index-launcher.cjs:1074:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-code-index-launcher.cjs:1076:          ownerPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1077:          startedAt: ownerLeaseResult.holder.startedAtIso,
.opencode/bin/mk-code-index-launcher.cjs:1078:          socketPath: typeof ownerLeaseResult.holder.socketPath === 'string' ? ownerLeaseResult.holder.socketPath : null,
.opencode/bin/mk-code-index-launcher.cjs:1080:          respawnChildPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1085:      const leaseResult = isLeaseHeld();
.opencode/bin/mk-code-index-launcher.cjs:1086:      if (leaseResult.held && !leaseResult.staleReclaimable) {
.opencode/bin/mk-code-index-launcher.cjs:1088:        await bridgeOrReportLeaseHeld(leaseResult);
.opencode/bin/mk-code-index-launcher.cjs:1091:      if (leaseResult.staleReclaimable) {
.opencode/bin/mk-code-index-launcher.cjs:1092:        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
.opencode/bin/mk-code-index-launcher.cjs:1093:        emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
.opencode/bin/mk-code-index-launcher.cjs:1094:          ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1095:          leaseKind: leaseResult.legacyPath ? 'legacy-pid' : 'pid',
.opencode/bin/mk-code-index-launcher.cjs:1099:      log('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
.opencode/bin/mk-code-index-launcher.cjs:1104:      // Auto-migrate DB from the former shared standalone location back to skill-local.
.opencode/bin/mk-code-index-launcher.cjs:1105:      // The former DB is preserved as a backup (copy, not move).
.opencode/bin/mk-code-index-launcher.cjs:1109:      // !exists(target) guard and both copy — a lagging copier truncate-overwriting the now-LIVE
.opencode/bin/mk-code-index-launcher.cjs:1111:      // only one launcher migrate; the COPYFILE_EXCL + pre-copy re-check below is the belt-and-
.opencode/bin/mk-code-index-launcher.cjs:1113:      // Never auto-seed/migrate into an explicit SPECKIT_CODE_GRAPH_DB_DIR override
.opencode/bin/mk-code-index-launcher.cjs:1114:      //   (the operator chose that target); migrate only into the resolved default.
.opencode/bin/mk-code-index-launcher.cjs:1115:      // Never copy a former DB that a live legacy owner could still be
.opencode/bin/mk-code-index-launcher.cjs:1116:      //   writing — probe BOTH the former PID lease and the former owner lease for liveness first.
.opencode/bin/mk-code-index-launcher.cjs:1117:      //   The former owner lease (.code-graph-owner.json) is intentionally NOT copied forward.
.opencode/bin/mk-code-index-launcher.cjs:1119:      const migrationTarget = resolvedDbDir();
.opencode/bin/mk-code-index-launcher.cjs:1121:          && !exists(path.join(migrationTarget, 'code-graph.sqlite'))
.opencode/bin/mk-code-index-launcher.cjs:1124:        fs.mkdirSync(migrationTarget, { recursive: true, mode: 0o700 });
.opencode/bin/mk-code-index-launcher.cjs:1128:          'code-graph.sqlite-wal',
.opencode/bin/mk-code-index-launcher.cjs:1130:          '.mk-code-index-launcher.json',
.opencode/bin/mk-code-index-launcher.cjs:1132:        // Re-check the sqlite target immediately before copying so a launcher that
.opencode/bin/mk-code-index-launcher.cjs:1133:        // raced past the outer guard (e.g. a concurrent migrator that just finished) does not
.opencode/bin/mk-code-index-launcher.cjs:1134:        // clobber the freshly-migrated DB. EEXIST from COPYFILE_EXCL means another launcher
.opencode/bin/mk-code-index-launcher.cjs:1135:        // already migrated that file -> treat the target as authoritative and stop migrating.
.opencode/bin/mk-code-index-launcher.cjs:1136:        let migrated = false;
.opencode/bin/mk-code-index-launcher.cjs:1137:        if (!exists(path.join(migrationTarget, 'code-graph.sqlite'))) {
.opencode/bin/mk-code-index-launcher.cjs:1141:              const dst = path.join(migrationTarget, file);
.opencode/bin/mk-code-index-launcher.cjs:1143:                // COPYFILE_EXCL makes the copy fail with EEXIST rather than truncate-
.opencode/bin/mk-code-index-launcher.cjs:1145:                fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL);
.opencode/bin/mk-code-index-launcher.cjs:1148:            migrated = true;
.opencode/bin/mk-code-index-launcher.cjs:1149:          } catch (copyError) {
.opencode/bin/mk-code-index-launcher.cjs:1150:            if (copyError.code === 'EEXIST') {
.opencode/bin/mk-code-index-launcher.cjs:1151:              // Another launcher already migrated into this target; the existing target
.opencode/bin/mk-code-index-launcher.cjs:1153:              log('migration skipped: target already present (EEXIST); treating existing target as authoritative');
.opencode/bin/mk-code-index-launcher.cjs:1155:              throw copyError;
.opencode/bin/mk-code-index-launcher.cjs:1159:        if (migrated) {
.opencode/bin/mk-code-index-launcher.cjs:1161:            `[mk-code-index-launcher] migrated DB from ${rel(formerSharedDbDir)} to ${rel(migrationTarget)} (former location preserved)\n`
.opencode/bin/mk-code-index-launcher.cjs:1170:    // Reap the orphan daemon recorded by the reclaimed prior owner lease before
.opencode/bin/mk-code-index-launcher.cjs:1226:  leaseMetricClassForTransition,
.opencode/bin/mk-code-index-launcher.cjs:1227:  leaseMetricCounterName,
.opencode/bin/mk-code-index-launcher.cjs:1232:  ownerLeasePath,
.opencode/bin/README.md:17:`bin/` holds the executable entrypoints that the OpenCode runtime spawns to start each MCP server, plus the daemon-backed CLI shims that reach the same servers from a shell. Three launchers wrap the spec-kit, skill-advisor and code-graph MCP servers; three CLI shims (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) front the same daemons over the IPC socket; one process is the local HuggingFace embedding server that serves `hf-local` vector requests over a Unix domain socket or TCP loopback.
.opencode/bin/README.md:22:- The three CLI shims run the built daemon-backed CLIs (`spec-memory` 39 tools, `code-index` 8 tools, `skill-advisor` 9 tools) against the **same unchanged daemons** the MCP registrations use — a dual-stack surface, not a replacement. Each shim enforces a dist-freshness guard (exit `69` on missing/stale dist, with a per-CLI `*_DEV_ALLOW_STALE=1` override), defaults `SPECKIT_IPC_SOCKET_DIR` to the short `/tmp/<service>` directory, and refuses a socket path over the Darwin `sun_path` limit.
.opencode/bin/README.md:23:- `hf-model-server.cjs` loads a transformers model and answers `/api/health` and `/api/embed` requests. It refuses any non-loopback bind unless the operator sets `HF_EMBED_ALLOW_REMOTE_BIND=1` and supplies `HF_EMBED_AUTH_TOKEN`, and it asserts ownership of the socket directory before listening.
.opencode/bin/README.md:24:- Shared launcher behavior (model-server supervision, stdio-to-socket bridging, sidecar env allowlist) lives in `lib/`. The CLI shims' dist entrypoints reuse `lib/launcher-ipc-bridge.cjs` for socket-path resolution and warm-daemon probes.
.opencode/bin/README.md:25:- Launcher reliability knobs — persistent log, lease-probe reap hardening, the mk-code-index reconnecting proxy, the Stop-hook orphan-sweep fallback, and default-on daemon re-election for mk-spec-memory — are operator-tunable via `SPECKIT_LAUNCHER_LOG`, `SPECKIT_LEASE_PROBE_RETRIES`, `SPECKIT_STOP_HOOK_ORPHAN_SWEEP`, and `SPECKIT_DAEMON_REELECTION`; see the MCP server's [`ENV_REFERENCE.md`](../skills/system-spec-kit/mcp_server/ENV_REFERENCE.md).
.opencode/bin/README.md:62:+-- mk-spec-memory-launcher.cjs    # Launches mk-spec-memory MCP, owns shared hf-model-server lease
.opencode/bin/README.md:64:+-- mk-code-index-launcher.cjs     # Launches mk-code-index MCP, maintainer-mode INDEX_* override
.opencode/bin/README.md:73:+-- worktree-reaper.sh             # Prune merged/clean per-session worktrees + stale socket dirs
.opencode/bin/README.md:85:| `mk-spec-memory-launcher.cjs` | Boots the mk-spec-memory MCP child. Manages the shared hf-model-server lease, respawn locks, and reaping a dead lease child before respawn. |
.opencode/bin/README.md:86:| `mk-skill-advisor-launcher.cjs` | Boots the mk-skill-advisor MCP child. Loads model-server supervision when enabled, enforces a strict single-writer lease, and rebuilds `dist/` from `handlers`, `lib`, `schemas`, `tools` when stale. |
.opencode/bin/README.md:87:| `mk-code-index-launcher.cjs` | Boots the mk-code-index MCP child. Applies the maintainer-mode `INDEX_*` override, migrates the code-graph database back to the skill-local path, and sets `SPECKIT_CODE_GRAPH_DB_DIR` for the child. |
.opencode/bin/README.md:88:| `spec-memory.cjs` | CLI shim for mk-spec-memory. Checks dist freshness (exit `69`; `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` to override), ensures the socket dir, then runs `mcp_server/dist/spec-memory-cli.js` with inherited stdio. |
.opencode/bin/README.md:91:| `hf-model-server.cjs` | Loads a transformers embedding model and serves `/api/health` and `/api/embed`. Enforces the loopback bind perimeter guard, socket-dir ownership, request size limits and inference timeouts. |
.opencode/bin/README.md:93:Lifecycle parity note: `mk-spec-memory-launcher.cjs` is the hardened reference for persistent launcher logging, detached daemon re-election/adoption, and owner-release-on-shutdown. `mk-code-index-launcher.cjs` and `mk-skill-advisor-launcher.cjs` currently stop with their child and rely on fresh-session reload plus bridge/respawn paths instead.
.opencode/bin/README.md:101:| Imports | Launchers require `./lib/model-server-supervision.cjs` and `./lib/launcher-ipc-bridge.cjs`. The model server requires only Node core plus `@huggingface/transformers` loaded at runtime. |
.opencode/bin/README.md:103:| Ownership | This folder owns process bootstrap, lease arbitration and the embedding HTTP surface. MCP request handling, schemas and tools live in each server's own skill directory under `.opencode/skills/`. |
.opencode/bin/README.md:119:│ build dist if artifacts stale            │
.opencode/bin/README.md:124:│ acquire bootstrap + respawn lease        │
.opencode/bin/README.md:129:│ spawn MCP child, bridge stdio to socket  │
.opencode/bin/README.md:146:| `node .opencode/bin/mk-code-index-launcher.cjs` | CLI | Start the mk-code-index MCP server. |
.opencode/bin/README.md:154:| `bash .opencode/bin/worktree-reaper.sh [--dry-run] [--reap-daemons]` | CLI | Prune merged + clean per-session worktrees and stale socket dirs; report orphan daemons (kill only with `--reap-daemons`). |
.opencode/bin/README.md:161:**Exit taxonomy (shared).** `0` success, `1` runtime error, `64` usage/schema error, `69` protocol mismatch or missing/stale dist, `75` retryable daemon error. A `spawnSync` failure in the shim itself also exits `75`.
.opencode/bin/README.md:165:**Dist freshness.** Each shim compares its CLI source mtimes against the built dist entrypoint and exits `69` with a rebuild instruction when stale. Dev overrides: `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`, `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`.
.opencode/bin/README.md:173:`worktree-session.sh` ends the cross-session contention where every runtime shared one working tree on `main` plus one set of MCP databases. A top-level session gets `.worktrees/<runtime>-<slug>` on `work/<runtime>/<slug>`, with `SPEC_KIT_DB_DIR` + `SPECKIT_CODE_GRAPH_DB_DIR` pointed at per-worktree databases and `SPECKIT_IPC_SOCKET_DIR` pointed at a short `~/.spk-wt-sock/<slug>` dir (the daemon's unix socket path would otherwise exceed the platform `sun_path` limit from inside a deep worktree). Shared `node_modules`/`dist` are symlinked from the main checkout, so there is no per-worktree reinstall or rebuild.
.opencode/bin/mk-skill-advisor-launcher.cjs:72:const OWNER_LEASE_FILE_NAME = '.skill-advisor-owner.json';
.opencode/bin/mk-skill-advisor-launcher.cjs:130:let leaseStartedAt = null;
.opencode/bin/mk-skill-advisor-launcher.cjs:131:let ownerLeasePid = null;
.opencode/bin/mk-skill-advisor-launcher.cjs:132:let ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-skill-advisor-launcher.cjs:133:let ownerLeaseRequired = true;
.opencode/bin/mk-skill-advisor-launcher.cjs:143:    return require('./lib/launcher-ipc-bridge.cjs');
.opencode/bin/mk-skill-advisor-launcher.cjs:151:        const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/mk-skill-advisor-launcher.cjs:154:        return path.join(socketDir, 'daemon-ipc.sock');
.opencode/bin/mk-skill-advisor-launcher.cjs:156:      async maybeBridgeLeaseHolder({ leaseResult, legacyReport }) {
.opencode/bin/mk-skill-advisor-launcher.cjs:158:          legacyReport(leaseResult);
.opencode/bin/mk-skill-advisor-launcher.cjs:161:        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-skill-advisor-launcher.cjs:162:        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-skill-advisor-launcher.cjs:163:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:213:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-skill-advisor-launcher.cjs:220:    socketPath,
.opencode/bin/mk-skill-advisor-launcher.cjs:288:function leasePath() {
.opencode/bin/mk-skill-advisor-launcher.cjs:292:function ownerLeasePath() {
.opencode/bin/mk-skill-advisor-launcher.cjs:296:function readLeaseFile(filePath = leasePath()) {
.opencode/bin/mk-skill-advisor-launcher.cjs:301:    // Missing or corrupt launcher lease files are treated as already clear.
.opencode/bin/mk-skill-advisor-launcher.cjs:306:function leaseHeldFromFile(filePath = leasePath(), legacyPath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:307:  const lease = readLeaseFile(filePath);
.opencode/bin/mk-skill-advisor-launcher.cjs:308:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-skill-advisor-launcher.cjs:309:  const startedAt = lease.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-skill-advisor-launcher.cjs:310:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-skill-advisor-launcher.cjs:312:    process.kill(lease.pid, 0);
.opencode/bin/mk-skill-advisor-launcher.cjs:313:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:315:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:316:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:321:function readOwnerLeaseFile(filePath = ownerLeasePath()) {
.opencode/bin/mk-skill-advisor-launcher.cjs:325:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-skill-advisor-launcher.cjs:336:    // Missing or corrupt owner leases are treated as no active owner.
.opencode/bin/mk-skill-advisor-launcher.cjs:341:function writeOwnerLeaseFile(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:342:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-skill-advisor-launcher.cjs:347:    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
.opencode/bin/mk-skill-advisor-launcher.cjs:355:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:356:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-skill-advisor-launcher.cjs:360:    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
.opencode/bin/mk-skill-advisor-launcher.cjs:371:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:373:    ownerPid,
.opencode/bin/mk-skill-advisor-launcher.cjs:423:async function reapOwnerBeforeRespawn(ownerPid, expectedExecutablePath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:424:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:426:    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
.opencode/bin/mk-skill-advisor-launcher.cjs:429:    return { allowed: true, reason: 'owner-already-dead' };
.opencode/bin/mk-skill-advisor-launcher.cjs:432:  // Guard against PID reuse: if the recorded lease carried an executablePath and
.opencode/bin/mk-skill-advisor-launcher.cjs:438:    const actualBasename = readProcessExecutableBasename(ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:440:      log(`skill-advisor reap skipped; pid ${ownerPid} executable '${actualBasename}' != recorded '${expectedBasename}' (pid reused)`);
.opencode/bin/mk-skill-advisor-launcher.cjs:441:      return { allowed: true, reason: 'owner-pid-reused' };
.opencode/bin/mk-skill-advisor-launcher.cjs:445:  log(`confirmed-dead socket; reaping recorded skill-advisor daemon pid ${ownerPid} before respawn`);
.opencode/bin/mk-skill-advisor-launcher.cjs:447:    process.kill(ownerPid, 'SIGTERM');
.opencode/bin/mk-skill-advisor-launcher.cjs:451:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-skill-advisor-launcher.cjs:453:    log(`skill-advisor daemon pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-skill-advisor-launcher.cjs:455:      process.kill(ownerPid, 'SIGKILL');
.opencode/bin/mk-skill-advisor-launcher.cjs:459:    await waitForPidExit(ownerPid, 1000);
.opencode/bin/mk-skill-advisor-launcher.cjs:460:    if (processLiveness(ownerPid) !== 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:461:      return { allowed: false, reason: 'owner-reap-timeout' };
.opencode/bin/mk-skill-advisor-launcher.cjs:464:  return { allowed: true, reason: 'owner-reaped' };
.opencode/bin/mk-skill-advisor-launcher.cjs:487:function classifyOwnerLease(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:488:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:489:  if (liveness === 'dead') return 'stale-pid';
.opencode/bin/mk-skill-advisor-launcher.cjs:492:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:493:  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
.opencode/bin/mk-skill-advisor-launcher.cjs:497:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/bin/mk-skill-advisor-launcher.cjs:498:  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
.opencode/bin/mk-skill-advisor-launcher.cjs:500:    return 'stale-heartbeat-reclaim';
.opencode/bin/mk-skill-advisor-launcher.cjs:503:  return 'live-owner';
.opencode/bin/mk-skill-advisor-launcher.cjs:507:  const currentOwnerLeasePath = ownerLeasePath();
.opencode/bin/mk-skill-advisor-launcher.cjs:512:    if (classification === 'live-owner' || classification === 'unknown-eperm') {
.opencode/bin/mk-skill-advisor-launcher.cjs:515:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:518:  const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-skill-advisor-launcher.cjs:519:  // Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL).
.opencode/bin/mk-skill-advisor-launcher.cjs:520:  // This collapses the fresh-acquire and stale-reclaim paths into a single CAS so
.opencode/bin/mk-skill-advisor-launcher.cjs:522:  // acquired:false instead of last-writer-wins overwriting the winner's lease.
.opencode/bin/mk-skill-advisor-launcher.cjs:530:  if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:534:      holder: holder || lease,
.opencode/bin/mk-skill-advisor-launcher.cjs:535:      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
.opencode/bin/mk-skill-advisor-launcher.cjs:538:  ownerLeasePid = process.pid;
.opencode/bin/mk-skill-advisor-launcher.cjs:539:  return { acquired: true, lease, reclaimed: existing };
.opencode/bin/mk-skill-advisor-launcher.cjs:542:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-skill-advisor-launcher.cjs:543:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:544:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-skill-advisor-launcher.cjs:545:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:547:    ...lease,
.opencode/bin/mk-skill-advisor-launcher.cjs:552:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-skill-advisor-launcher.cjs:553:  ownerLeasePid = nextOwnerPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:558:  if (ownerLeaseHeartbeatTimer) {
.opencode/bin/mk-skill-advisor-launcher.cjs:559:    clearInterval(ownerLeaseHeartbeatTimer);
.opencode/bin/mk-skill-advisor-launcher.cjs:560:    ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-skill-advisor-launcher.cjs:564:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:566:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:567:  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
.opencode/bin/mk-skill-advisor-launcher.cjs:569:  ownerLeaseHeartbeatTimer = setInterval(() => {
.opencode/bin/mk-skill-advisor-launcher.cjs:570:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-skill-advisor-launcher.cjs:571:    log('owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership');
.opencode/bin/mk-skill-advisor-launcher.cjs:577:      // the exact double-ownership this branch exists to prevent.
.opencode/bin/mk-skill-advisor-launcher.cjs:590:  ownerLeaseHeartbeatTimer.unref?.();
.opencode/bin/mk-skill-advisor-launcher.cjs:593:function ownsOwnerLeaseFile(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:594:  const lease = readOwnerLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:595:  return lease?.ownerPid === ownerPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:599:  if (!Number.isInteger(ownerLeasePid)) return;
.opencode/bin/mk-skill-advisor-launcher.cjs:601:    const lease = readOwnerLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:602:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-skill-advisor-launcher.cjs:603:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:604:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-skill-advisor-launcher.cjs:610:    ownerLeasePid = null;
.opencode/bin/mk-skill-advisor-launcher.cjs:614:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:616:    const lease = readOwnerLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:617:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-skill-advisor-launcher.cjs:618:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:619:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-skill-advisor-launcher.cjs:626:function reportLeaseHeld(leaseResult) {
.opencode/bin/mk-skill-advisor-launcher.cjs:627:  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-skill-advisor-launcher.cjs:628:  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-skill-advisor-launcher.cjs:629:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:632:function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
.opencode/bin/mk-skill-advisor-launcher.cjs:633:  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/mk-skill-advisor-launcher.cjs:634:  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-skill-advisor-launcher.cjs:635:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:638:function resolveRespawnTargetPid(leaseResult) {
.opencode/bin/mk-skill-advisor-launcher.cjs:639:  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
.opencode/bin/mk-skill-advisor-launcher.cjs:640:  if (Number.isInteger(lease?.childPid) && lease.childPid > 0) return lease.childPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:641:  return Number.isInteger(leaseResult.ownerPid) && leaseResult.ownerPid > 0 ? leaseResult.ownerPid : null;
.opencode/bin/mk-skill-advisor-launcher.cjs:644:function socketPathUsable(socketPath) {
.opencode/bin/mk-skill-advisor-launcher.cjs:645:  return typeof socketPath === 'string'
.opencode/bin/mk-skill-advisor-launcher.cjs:646:    && socketPath.length > 0
.opencode/bin/mk-skill-advisor-launcher.cjs:647:    && (socketPath.startsWith('tcp://') || fs.existsSync(socketPath));
.opencode/bin/mk-skill-advisor-launcher.cjs:656:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-skill-advisor-launcher.cjs:658:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-skill-advisor-launcher.cjs:659:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:662:  const targetPid = resolveRespawnTargetPid(leaseResult);
.opencode/bin/mk-skill-advisor-launcher.cjs:664:    log('confirmed-dead socket but no recorded skill-advisor daemon pid is available; respawn inert');
.opencode/bin/mk-skill-advisor-launcher.cjs:665:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-daemon-pid)');
.opencode/bin/mk-skill-advisor-launcher.cjs:666:    return { action: 'report', reason: 'missing-daemon-pid', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:672:    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
.opencode/bin/mk-skill-advisor-launcher.cjs:675:      : leaseResult.ownerPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:677:      log('dead-socket respawn skipped; skill-advisor launcher lease changed while waiting for bootstrap lock');
.opencode/bin/mk-skill-advisor-launcher.cjs:678:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-skill-advisor-launcher.cjs:679:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:683:    const expectedExecutablePath = previousOwner?.ownerPid === targetPid ? previousOwner.executablePath : null;
.opencode/bin/mk-skill-advisor-launcher.cjs:686:      log(`dead-socket respawn skipped; ${reapResult.reason} for daemonPid=${targetPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-skill-advisor-launcher.cjs:688:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:691:    if (previousOwner?.ownerPid && previousOwner.ownerPid !== process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:692:      await waitForPidExit(previousOwner.ownerPid, RESPAWN_REAP_GRACE_MS + 1000);
.opencode/bin/mk-skill-advisor-launcher.cjs:693:      if (processLiveness(previousOwner.ownerPid) === 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:694:        clearOwnerLeaseFileIfOwner(previousOwner.ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:702:    const ownerLease = buildOwnerLease(process.pid);
.opencode/bin/mk-skill-advisor-launcher.cjs:703:    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:705:      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:706:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-skill-advisor-launcher.cjs:707:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:709:    ownerLeasePid = process.pid;
.opencode/bin/mk-skill-advisor-launcher.cjs:713:    leaseStartedAt = new Date().toISOString();
.opencode/bin/mk-skill-advisor-launcher.cjs:717:      ? { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath }
.opencode/bin/mk-skill-advisor-launcher.cjs:718:      : { action: 'report', reason: 'launch-skipped', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:726:function leaseResultForOwnerLease(ownerLease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:727:  const launcherLease = leaseHeldFromFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:728:  if (launcherLease.held && launcherLease.ownerPid === ownerLease.ownerPid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:733:    ownerPid: ownerLease.ownerPid,
.opencode/bin/mk-skill-advisor-launcher.cjs:734:    staleReclaimable: false,
.opencode/bin/mk-skill-advisor-launcher.cjs:735:    startedAt: ownerLease.startedAtIso,
.opencode/bin/mk-skill-advisor-launcher.cjs:737:    socketPath: null,
.opencode/bin/mk-skill-advisor-launcher.cjs:741:async function bridgeOrReportLeaseHeld(leaseResult) {
.opencode/bin/mk-skill-advisor-launcher.cjs:745:    leaseResult,
.opencode/bin/mk-skill-advisor-launcher.cjs:752:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-skill-advisor-launcher.cjs:758:  const ownerLeaseResult = acquireOwnerLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:759:  if (!ownerLeaseResult.acquired) {
.opencode/bin/mk-skill-advisor-launcher.cjs:760:    log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:761:    await bridgeOrReportLeaseHeld(leaseResultForOwnerLease(ownerLeaseResult.holder));
.opencode/bin/mk-skill-advisor-launcher.cjs:766:  const launcherLease = leaseHeldFromFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:767:  if (launcherLease.held && !launcherLease.staleReclaimable) {
.opencode/bin/mk-skill-advisor-launcher.cjs:772:  if (launcherLease.staleReclaimable) {
.opencode/bin/mk-skill-advisor-launcher.cjs:773:    log('staleReclaimed: true');
.opencode/bin/mk-skill-advisor-launcher.cjs:774:    const staleLease = readLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:775:    const staleChildPid = Number.isInteger(staleLease?.childPid) && staleLease.childPid > 0
.opencode/bin/mk-skill-advisor-launcher.cjs:776:      ? staleLease.childPid
.opencode/bin/mk-skill-advisor-launcher.cjs:778:    if (staleChildPid && processLiveness(staleChildPid) !== 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:779:      const staleChildLeaseResult = {
.opencode/bin/mk-skill-advisor-launcher.cjs:781:        ownerPid: staleChildPid,
.opencode/bin/mk-skill-advisor-launcher.cjs:782:        staleReclaimable: false,
.opencode/bin/mk-skill-advisor-launcher.cjs:783:        startedAt: staleLease.startedAt ?? new Date(0).toISOString(),
.opencode/bin/mk-skill-advisor-launcher.cjs:785:        socketPath: typeof staleLease.socketPath === 'string' ? staleLease.socketPath : null,
.opencode/bin/mk-skill-advisor-launcher.cjs:787:      if (socketPathUsable(staleChildLeaseResult.socketPath)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:788:        const decision = await bridgeOrReportLeaseHeld(staleChildLeaseResult);
.opencode/bin/mk-skill-advisor-launcher.cjs:792:        if (decision?.reason !== 'no-bridge-socket') {
.opencode/bin/mk-skill-advisor-launcher.cjs:797:      scheduleBootstrapReap(staleChildPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:798:      log(`stale launcher lease recorded live childPid=${staleChildPid}; deferring reap until bootstrap lock is held`);
.opencode/bin/mk-skill-advisor-launcher.cjs:799:    } else if (staleChildPid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:800:      scheduleBootstrapReap(staleChildPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:805:    const daemonLeasePath = path.join(mcpDir, 'dist', 'mcp_server', 'lib', 'daemon', 'lease.js');
.opencode/bin/mk-skill-advisor-launcher.cjs:806:    const leaseModule = require(daemonLeasePath);
.opencode/bin/mk-skill-advisor-launcher.cjs:807:    const leaseResult = leaseModule.isLeaseHeld(root);
.opencode/bin/mk-skill-advisor-launcher.cjs:808:    const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/mk-skill-advisor-launcher.cjs:809:    if (leaseResult.held && !leaseResult.staleReclaimable) {
.opencode/bin/mk-skill-advisor-launcher.cjs:811:      await bridgeOrReportLeaseHeld(leaseResult);
.opencode/bin/mk-skill-advisor-launcher.cjs:814:    if (leaseResult.staleReclaimable) {
.opencode/bin/mk-skill-advisor-launcher.cjs:815:      log(`staleReclaimed: true${legacyMarker ? ' (legacy path)' : ''}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:819:      log(`daemon lease check failed: ${error.message}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:832:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), path.basename(leasePath()));
.opencode/bin/mk-skill-advisor-launcher.cjs:834:  if (!leaseStartedAt) leaseStartedAt = new Date().toISOString();
.opencode/bin/mk-skill-advisor-launcher.cjs:837:    ownerPid: process.pid,
.opencode/bin/mk-skill-advisor-launcher.cjs:838:    startedAt: leaseStartedAt,
.opencode/bin/mk-skill-advisor-launcher.cjs:839:    socketPath: resolveSessionProxySocketPath(),
.opencode/bin/mk-skill-advisor-launcher.cjs:848:    const lease = readLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:849:    if (lease && (lease.pid === process.pid || lease.pid === childProcess?.pid)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:850:      fs.unlinkSync(leasePath());
.opencode/bin/mk-skill-advisor-launcher.cjs:880:function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-skill-advisor-launcher.cjs:881:  const pidDir = socketPath.startsWith('tcp://') ? systemSpecKitDbDir : path.dirname(socketPath);
.opencode/bin/mk-skill-advisor-launcher.cjs:886:  const socketPath = resolveModelServerSocketPath();
.opencode/bin/mk-skill-advisor-launcher.cjs:887:  const pidPath = sharedModelServerPidPath(socketPath);
.opencode/bin/mk-skill-advisor-launcher.cjs:902:    ownerLauncher: 'mk-skill-advisor',
.opencode/bin/mk-skill-advisor-launcher.cjs:903:    socketPath,
.opencode/bin/mk-skill-advisor-launcher.cjs:913:    // Advisor never falls back to its own launcher lease for model-server ownership.
.opencode/bin/mk-skill-advisor-launcher.cjs:1107:const BOOTSTRAP_LOCK_OWNER_FILE = 'owner.pid';
.opencode/bin/mk-skill-advisor-launcher.cjs:1121:function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_STALE_MS) {
.opencode/bin/mk-skill-advisor-launcher.cjs:1133:  // an mtime TTL alone would otherwise wedge every new session for up to staleMs
.opencode/bin/mk-skill-advisor-launcher.cjs:1137:  const ownerPid = readBootstrapLockOwnerPid();
.opencode/bin/mk-skill-advisor-launcher.cjs:1138:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-skill-advisor-launcher.cjs:1139:  if (!ownerDead && ageMs <= staleMs) {
.opencode/bin/mk-skill-advisor-launcher.cjs:1142:  const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
.opencode/bin/mk-skill-advisor-launcher.cjs:1144:    fs.renameSync(lockDir, staleClaim);
.opencode/bin/mk-skill-advisor-launcher.cjs:1145:    fs.rmSync(staleClaim, { recursive: true, force: true });
.opencode/bin/mk-skill-advisor-launcher.cjs:1146:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `${Math.round(ageMs / 1000)}s old`;
.opencode/bin/mk-skill-advisor-launcher.cjs:1147:    log(`reclaimed stale bootstrap lock at ${rel(lockDir)} (${reason})`);
.opencode/bin/mk-skill-advisor-launcher.cjs:1158:  const staleMs = options.staleMs ?? BOOTSTRAP_LOCK_STALE_MS;
.opencode/bin/mk-skill-advisor-launcher.cjs:1174:      if (removeStaleBootstrapLock(staleMs)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:1186:  if (ownerLeaseRequired && !ownsOwnerLeaseFile(process.pid)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:1187:    log('launchServer skipped: skill-advisor owner lease is absent or owned by another launcher');
.opencode/bin/mk-skill-advisor-launcher.cjs:1201:        // Clear lease before signal mirror; process.on('exit') doesn't fire on SIGKILL.
.opencode/bin/mk-skill-advisor-launcher.cjs:1273:    ownerLeaseRequired = strictSingleWriter;
.opencode/bin/mk-skill-advisor-launcher.cjs:1277:      log('MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER is disabled; skipping lease check');
.opencode/bin/mk-skill-advisor-launcher.cjs:1283:        // The bootstrap lock is held through replacement launch, so stale-child cleanup
.opencode/bin/mk-skill-advisor-launcher.cjs:1286:        const reapExecutablePath = reapOwnerLease?.ownerPid === pendingBootstrapReapPid ? reapOwnerLease.executablePath : null;
.opencode/bin/mk-skill-advisor-launcher.cjs:1289:          log(`stale launcher lease reap skipped; ${reapResult.reason} for daemonPid=${pendingBootstrapReapPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:1311:        log('bootstrap reprobe lost owner lease before PID guard write');
.opencode/bin/mk-skill-advisor-launcher.cjs:1380:  ownerLeasePath,
.opencode/bin/cli-offline-smoke.test.cjs:36:  assert.strictEqual(row.daemonFree, true, `${row.name} used a daemon socket`);
.opencode/bin/cli-offline-smoke.test.cjs:45:    const stale = classify(69, 'dist entrypoint is stale. Run a build.', false);
.opencode/bin/cli-offline-smoke.test.cjs:46:    assert.strictEqual(stale.error, 'dist_stale_rebuild_required');
.opencode/bin/cli-offline-smoke.test.cjs:47:    assert.strictEqual(stale.metadata.staleDist, true);
.opencode/bin/cli-offline-smoke.test.cjs:48:    assert.strictEqual(stale.metadata.rebuildRequired, true);
.opencode/bin/cli-offline-smoke.test.cjs:49:    assert.strictEqual(stale.retryable, false);
.opencode/bin/cli-offline-smoke.test.cjs:52:  const advisorStale = advisorBridge.classifyCliStaleDist(69, 'skill-advisor dist entrypoint is stale. Run a build.');
.opencode/bin/cli-offline-smoke.test.cjs:53:  assert.strictEqual(advisorStale.state, 'dist_stale_rebuild_required');
.opencode/bin/skill-advisor.cjs:14:const socketFileName = 'daemon-ipc.sock';
.opencode/bin/skill-advisor.cjs:77:    // Freshness metadata is an optimization; stale detection remains conservative.
.opencode/bin/skill-advisor.cjs:93:    fail('skill-advisor dist entrypoint is stale. Run the skill-advisor TypeScript build.');
.opencode/bin/skill-advisor.cjs:102:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/skill-advisor.cjs:103:  if (socketDir.startsWith('tcp://')) return;
.opencode/bin/skill-advisor.cjs:104:  fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/bin/skill-advisor.cjs:105:  const socketPath = path.join(path.resolve(socketDir), socketFileName);
.opencode/bin/skill-advisor.cjs:106:  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
.opencode/bin/skill-advisor.cjs:107:    fail(`skill-advisor socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
.opencode/bin/worktree-reaper.sh:9:#   - `git worktree prune` (clears stale administrative entries for already-deleted dirs).
.opencode/bin/worktree-reaper.sh:12:#   - REPORT (does not kill) MCP daemons whose recorded lease points at a .worktrees/ dir
.opencode/bin/worktree-reaper.sh:48:log "pruning stale worktree admin entries"
.opencode/bin/worktree-reaper.sh:79:# A worktree daemon writes its lease under <worktree-db-dir>/.mk-spec-memory-launcher.json.
.opencode/bin/worktree-reaper.sh:80:# If that lease names a live childPid but the worktree DB dir is gone, it is orphaned.
.opencode/bin/worktree-reaper.sh:83:# Look at lease files that ever lived under .worktrees/. After worktree removal the file
.opencode/bin/worktree-reaper.sh:100:# Prune short per-session socket dirs (~/.spk-wt-sock/<runtime>-<slug>) whose worktree is gone.
.opencode/bin/worktree-reaper.sh:107:      log "prune stale socket dir (no matching worktree): $sd"
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:69:  // `action === 'full_scan'`. A deleted-files-only `freshness:'stale', action:'none'`
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:71:  // to buildContext() and answered over a stale graph. Gate on freshness and a
.opencode/skills/system-code-graph/graph-metadata.json:27:        "context": "sibling skill after Phase 003 source migration"
.opencode/bin/cli-exit-taxonomy-smoke.cjs:9:// socket dir so no daemon is ever spawned or contacted.
.opencode/bin/cli-exit-taxonomy-smoke.cjs:70:  const socketDir = path.join(sandbox, 'sock');
.opencode/bin/cli-exit-taxonomy-smoke.cjs:76:        SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/bin/cli-exit-taxonomy-smoke.cjs:90:    const daemonFree = !fs.existsSync(path.join(socketDir, 'daemon-ipc.sock'));
.opencode/bin/worktree-session.sh:7:# contend on the single-writer DB lease. An orchestrated child (subagent / dispatched
.opencode/bin/worktree-session.sh:26:# Socket-length workaround: the daemon's unix-domain IPC socket defaults to <db-dir>/
.opencode/bin/worktree-session.sh:27:# daemon-ipc.sock. A worktree DB dir nested deep inside the repo blows past the platform
.opencode/bin/worktree-session.sh:30:# keeping the socket path well under the limit while the DBs stay in the worktree.
.opencode/bin/worktree-session.sh:108:# Short per-session socket dir under $HOME (NOT inside the deep worktree) to stay under the
.opencode/bin/worktree-session.sh:119:  echo "  SPECKIT_IPC_SOCKET_DIR = $SOCK_DIR  (socket path len $(( ${#SOCK_DIR} + 16 )), platform limit ~104)"
.opencode/bin/worktree-session.sh:147:# Per-worktree isolated MCP databases, with a short socket dir to dodge the sun_path limit.
.opencode/bin/worktree-session.sh:154:  log "WARNING: socket path length $SOCK_PATH_LEN may exceed the platform limit (~104); the daemon could fail to listen"
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:28:Please help me:
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:51:System Code Graph is a TypeScript MCP server under `.opencode/skills/system-code-graph/mcp_server/` that registers the `mk-code-index` server identity. The runtime package is published privately as `@spec-kit/system-code-graph` and ships a Node launcher at `.opencode/bin/mk-code-index-launcher.cjs`. The launcher boots the compiled entrypoint at `mcp_server/dist/index.js` after loading `.env.local` overrides, applying the optional maintainer-mode flag, and guarding the database path against external locations.
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:53:The server is runtime-standalone: it does not depend on `mk-spec-memory` being installed or running first. Its database lives at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`. This skill-local path is the canonical location, shared across runtimes via the `.opencode/skills` symlink. A former shared location (`.opencode/.spec-kit/code-graph/database/`) is auto-migrated back to this skill-local location on first launch.
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:63:| Launcher | `.opencode/bin/mk-code-index-launcher.cjs` |
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:96:The launcher is already committed at `.opencode/bin/mk-code-index-launcher.cjs` and does not need a separate install step. Start or refresh the `mk_code_index` MCP server in the active runtime after build.
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:109:      "command": ["node", ".opencode/bin/mk-code-index-launcher.cjs"],
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:130:args = [".opencode/bin/mk-code-index-launcher.cjs"]
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:219:Installs with a database at the former shared location (`.opencode/.spec-kit/code-graph/database/`) are auto-migrated back to the skill-local location (`mcp_server/database/`) on next launch. The former database file is preserved as a backup; the launcher copies (does not move) the SQLite triplet, readiness marker, and launcher state file.
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:250:| `requiredAction: "code_graph_scan"` in tool responses | Graph is stale, missing, or scope-mismatched. | Run `code_graph_scan` with the intended scope. Use `incremental: false` for scope changes. |
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:254:| Config still uses `system_code_graph` namespace | Pre-packet-010 config not updated. | Rename the entry to `mk_code_index`, point at `.opencode/bin/mk-code-index-launcher.cjs`, and use `mcp__mk_code_index__*` for all tool references. |
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:256:| `/doctor:mcp debug --server mk_code_index` fails `root_dist_absent` | Doctor detected stale root-level build output. | Run `/doctor:mcp debug --server mk_code_index --fix`, or run the clean and build commands above manually. |
.opencode/skills/system-code-graph/INSTALL_GUIDE.md:260:Runtime diagnostics are available via the `/doctor code-graph` slash-command surface (read-only Phase A by default). See `.opencode/install_guides/SET-UP - Code Graph.md` for the full diagnostic walkthrough.
.opencode/skills/system-code-graph/SKILL.md:18:This skill ships the structural half: a tree-sitter parser, a SQLite graph, a readiness contract that refuses stale answers, and an MCP surface that other agents can call. Use it whenever the question turns from "what is similar" to "what is connected."
.opencode/skills/system-code-graph/SKILL.md:26:- **Readiness.** Whether the graph reflects current workspace state. Freshness states are `fresh`, `stale`, `empty`, `error` (`absent` is not a freshness state — it is the companion trust-state projection of an `empty` graph). Read paths refuse to answer on non-fresh states.
.opencode/skills/system-code-graph/SKILL.md:81:- `references/runtime/` documents the tool surface, naming conventions, ownership boundary, and launcher lease.
.opencode/skills/system-code-graph/SKILL.md:117:    "READINESS": {"weight": 4, "keywords": ["readiness", "fresh", "stale", "blocked", "empty", "absent", "ensurecodegraphready"]},
.opencode/skills/system-code-graph/SKILL.md:123:    "OWNERSHIP": {"weight": 3, "keywords": ["ownership", "boundary", "spec-kit", "deep-loop", "coverage graph"]},
.opencode/skills/system-code-graph/SKILL.md:124:    "LAUNCHER": {"weight": 3, "keywords": ["launcher", "lease", "pid", "single writer", "lease_held_by"]},
.opencode/skills/system-code-graph/SKILL.md:161:        "references/runtime/ownership_boundary.md",
.opencode/skills/system-code-graph/SKILL.md:164:        "references/runtime/launcher_lease.md",
.opencode/skills/system-code-graph/SKILL.md:176:    "Confirm whether the request is about tool surface, readiness, query, scan/verify, change detection, config, structural, naming, ownership, launcher, features or playbooks",
.opencode/skills/system-code-graph/SKILL.md:287:The surface is dual-stack: every tool above is also callable through the full-parity daemon-backed CLI `node .opencode/bin/code-index.cjs <tool_name> [--json '{...}' | --param value]` against the same daemon (MCP registration unchanged). MCP remains the primary in-session transport today; use the CLI when MCP transport is missing, failed or not reconnecting while the daemon is warm, and for hooks, cron, CI and operator shell diagnostics. Recovery example: `node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 3000 --warm-only`. Flag values are coerced against the tool's input schema. Exit taxonomy: `0` success, `1` runtime, `64` usage/schema (including `detect_changes` `parse_error` on a malformed diff), `69` protocol/dist mismatch or stale dist, `75` retryable daemon error. Blocked-read rendering is preserved: a `status:"blocked"` readiness refusal exits `0` with the `requiredAction` surfaced — an actionable answer, not a failure. Prompt-time callers must pass `--warm-only` (probe-only; exit `75` on a cold daemon); other contexts auto-spawn via `mk-code-index-launcher.cjs`. Because this CLI already has full parity, a later evolution could make it the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan. `--format jsonl` renders one complete JSON payload on one stdout line; it is not streaming JSON Lines. Full cross-daemon CLI behavior, recovery, stale-dist build commands, per-command `--help`, offline smoke, and safety rules live in [`../system-spec-kit/references/cli/daemon_cli_reference.md`](../system-spec-kit/references/cli/daemon_cli_reference.md).
.opencode/skills/system-code-graph/SKILL.md:296:- **Graph not ready (`status` returns `blocked`, `empty`, or `trustState: absent`):** call `code_graph_scan` first, then retry. Never return a stale or empty graph result as if it were authoritative.
.opencode/skills/system-code-graph/SKILL.md:314:Read paths call `ensureCodeGraphReady()` before answering any structural query. The check enforces the false-safe contract: stale, empty, or scope-mismatched graphs return `blocked` with an explicit `requiredAction` rather than empty results. Manual maintenance tools run explicit scans, verification, status checks, and structural tool operations against the same readiness gate.
.opencode/skills/system-code-graph/SKILL.md:326:3. **ALWAYS check readiness before answering structural questions.** `code_graph_status` first; if `readiness !== "fresh"`, return the `blocked` payload from the tool rather than a stale result.
.opencode/skills/system-code-graph/SKILL.md:332:2. **NEVER return a stale, empty, or scope-mismatched graph answer as if it were authoritative.** Read-path tools (`code_graph_query`, `code_graph_context`, `detect_changes`) refuse with `status: "blocked"` instead of false-safe empty results — preserve that contract end-to-end.
.opencode/skills/system-code-graph/SKILL.md:356:- `code_graph_query`, `code_graph_context` and `detect_changes` refuse unsafe stale states instead of returning false-safe answers.
.opencode/skills/system-code-graph/SKILL.md:383:- [`references/readiness/readiness_and_scope_fingerprint.md`](references/readiness/readiness_and_scope_fingerprint.md) — readiness state machine (`fresh`/`stale`/`empty`/`error` freshness, plus the `blocked` read decision and `absent` trust projection) and the scan-scope fingerprint contract.
.opencode/skills/system-code-graph/SKILL.md:387:- [`references/runtime/ownership_boundary.md`](references/runtime/ownership_boundary.md) — what stays in `system-spec-kit` vs `system-code-graph` after extraction.
.opencode/skills/system-code-graph/SKILL.md:388:- [`references/runtime/launcher_lease.md`](references/runtime/launcher_lease.md) — PID-file lease contract for the launcher single-writer path.
.opencode/skills/system-code-graph/SKILL.md:393:- Extraction history: internal migration notes
.opencode/skills/system-code-graph/ARCHITECTURE.md:15:> Current-reality architecture for the `system-code-graph` package. The skill scans source into a SQLite graph, answers structural relationship queries through a standalone MCP server, and refuses to answer on stale state.
.opencode/skills/system-code-graph/ARCHITECTURE.md:21:`system-code-graph` is the standalone structural code intelligence runtime. It parses source files into a SQLite graph, exposes structural relationship queries through a standalone MCP server, and refuses to answer on stale state.
.opencode/skills/system-code-graph/ARCHITECTURE.md:26:- `references/` carries operator primers on readiness, database path policy, and ownership boundaries.
.opencode/skills/system-code-graph/ARCHITECTURE.md:118:**Write path:** `code_graph_scan` walks the workspace via `ignore`-aware globbing, parses changed files through tree-sitter, and persists file, symbol, and edge rows in SQLite under a single transactional writer. Meta fields track `last_scan_at`, `last_persisted_at`, and `last_git_head`.
.opencode/skills/system-code-graph/ARCHITECTURE.md:136:**Readiness contract.** A hard refuse, not a soft degrade. <!-- OR-8-01: GraphFreshness is the four-value enum below; `absent` is the empty-graph trust-state projection, not a freshness state. --> Freshness states are `fresh`, `stale`, `empty`, `error` (`absent` is the empty-graph trust-state projection, not a freshness state). Read paths gate on the state machine and return blocked payloads with required actions; the contract avoids serving incorrect structural answers. Detail per state lives in `references/readiness/code_graph_readiness_check.md`.
.opencode/skills/system-code-graph/ARCHITECTURE.md:164:| ADR-001 | Hook ownership stays with the spec-kit sibling package; code-graph data accessed through a stable boundary import | Accepted |
.opencode/skills/system-code-graph/ARCHITECTURE.md:180:- [references/runtime/ownership_boundary.md](./references/runtime/ownership_boundary.md): Boundary rules for adjacent runtimes
.opencode/bin/lib/launcher-session-proxy.cjs:13:} = require('./launcher-ipc-bridge.cjs');
.opencode/bin/lib/launcher-session-proxy.cjs:49:  'checkpoint_list',
.opencode/bin/lib/launcher-session-proxy.cjs:56:  'checkpoint_restore',
.opencode/bin/lib/launcher-session-proxy.cjs:57:  'checkpoint_delete',
.opencode/bin/lib/launcher-session-proxy.cjs:80:  // A multibyte UTF-8 char (CJK/emoji) can straddle a socket-chunk boundary; the
.opencode/bin/lib/launcher-session-proxy.cjs:216:async function waitForDaemonReady(socketPath, probe, connect, log, options = {}) {
.opencode/bin/lib/launcher-session-proxy.cjs:221:    const result = await probe(socketPath, { connect, deepProbe: true });
.opencode/bin/lib/launcher-session-proxy.cjs:225:    log(`daemon socket not ready (${result.reason}); retrying in ${delayMs}ms`);
.opencode/bin/lib/launcher-session-proxy.cjs:251:function connectSocket(connect, socketPath) {
.opencode/bin/lib/launcher-session-proxy.cjs:253:    let socket;
.opencode/bin/lib/launcher-session-proxy.cjs:255:      socket = connect(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-session-proxy.cjs:262:      socket.off?.('connect', onConnect);
.opencode/bin/lib/launcher-session-proxy.cjs:263:      socket.off?.('error', onError);
.opencode/bin/lib/launcher-session-proxy.cjs:267:      resolve(socket);
.opencode/bin/lib/launcher-session-proxy.cjs:271:      socket.destroy?.();
.opencode/bin/lib/launcher-session-proxy.cjs:275:    socket.once('connect', onConnect);
.opencode/bin/lib/launcher-session-proxy.cjs:276:    socket.once('error', onError);
.opencode/bin/lib/launcher-session-proxy.cjs:280:function internalHandshake(socket, initializeFrame) {
.opencode/bin/lib/launcher-session-proxy.cjs:303:      socket.off?.('data', onData);
.opencode/bin/lib/launcher-session-proxy.cjs:304:      socket.off?.('error', onError);
.opencode/bin/lib/launcher-session-proxy.cjs:305:      socket.off?.('close', onClose);
.opencode/bin/lib/launcher-session-proxy.cjs:340:      reject(new Error('socket closed during internal initialize'));
.opencode/bin/lib/launcher-session-proxy.cjs:343:    socket.on('data', onData);
.opencode/bin/lib/launcher-session-proxy.cjs:344:    socket.once('error', onError);
.opencode/bin/lib/launcher-session-proxy.cjs:345:    socket.once('close', onClose);
.opencode/bin/lib/launcher-session-proxy.cjs:346:    writeFrame(socket, initializeFrame);
.opencode/bin/lib/launcher-session-proxy.cjs:351:  const socketPath = options?.socketPath;
.opencode/bin/lib/launcher-session-proxy.cjs:374:  let socket = null;
.opencode/bin/lib/launcher-session-proxy.cjs:380:  let socketHalfClosed = false;
.opencode/bin/lib/launcher-session-proxy.cjs:386:  let socketDrainWaiting = false;
.opencode/bin/lib/launcher-session-proxy.cjs:390:  const socketWriteQueue = [];
.opencode/bin/lib/launcher-session-proxy.cjs:395:  if (typeof socketPath !== 'string' || socketPath.length === 0) {
.opencode/bin/lib/launcher-session-proxy.cjs:396:    throw new Error('createSessionProxy requires a non-empty socketPath');
.opencode/bin/lib/launcher-session-proxy.cjs:421:    if (!socket) return;
.opencode/bin/lib/launcher-session-proxy.cjs:422:    const oldSocket = socket;
.opencode/bin/lib/launcher-session-proxy.cjs:423:    socket = null;
.opencode/bin/lib/launcher-session-proxy.cjs:424:    socketHalfClosed = false;
.opencode/bin/lib/launcher-session-proxy.cjs:425:    // The backpressure 'drain' wait was bound to this now-discarded socket and its
.opencode/bin/lib/launcher-session-proxy.cjs:426:    // handler short-circuits once the socket is swapped, so it can never reset the
.opencode/bin/lib/launcher-session-proxy.cjs:427:    // flag. Clear it here (and drop the listener) or the next socket's pump stays
.opencode/bin/lib/launcher-session-proxy.cjs:429:    socketDrainWaiting = false;
.opencode/bin/lib/launcher-session-proxy.cjs:439:    if (queuedClientFrames.length > 0 || socketWriteQueue.length > 0 || tracker.pendingRequests.size > 0) return;
.opencode/bin/lib/launcher-session-proxy.cjs:444:    if (!clientEnded || !socket || state !== 'CONNECTED' || socketHalfClosed) return;
.opencode/bin/lib/launcher-session-proxy.cjs:445:    if (socketDrainWaiting || socketWriteQueue.length > 0) return;
.opencode/bin/lib/launcher-session-proxy.cjs:446:    socketHalfClosed = true;
.opencode/bin/lib/launcher-session-proxy.cjs:447:    socket.end?.();
.opencode/bin/lib/launcher-session-proxy.cjs:469:        socket?.pause?.();
.opencode/bin/lib/launcher-session-proxy.cjs:472:          socket?.resume?.();
.opencode/bin/lib/launcher-session-proxy.cjs:538:    if (!socket || state !== 'CONNECTED' || socketDrainWaiting) return;
.opencode/bin/lib/launcher-session-proxy.cjs:539:    while (socketWriteQueue.length > 0 && socket && state === 'CONNECTED') {
.opencode/bin/lib/launcher-session-proxy.cjs:540:      const activeSocket = socket;
.opencode/bin/lib/launcher-session-proxy.cjs:541:      const frame = socketWriteQueue[0];
.opencode/bin/lib/launcher-session-proxy.cjs:543:      socketWriteQueue.shift();
.opencode/bin/lib/launcher-session-proxy.cjs:545:        socketDrainWaiting = true;
.opencode/bin/lib/launcher-session-proxy.cjs:548:          if (activeSocket !== socket) return;
.opencode/bin/lib/launcher-session-proxy.cjs:549:          socketDrainWaiting = false;
.opencode/bin/lib/launcher-session-proxy.cjs:561:    socketWriteQueue.push(frame);
.opencode/bin/lib/launcher-session-proxy.cjs:566:    if (!socket || state !== 'CONNECTED' || pendingKeepaliveId !== null) return;
.opencode/bin/lib/launcher-session-proxy.cjs:588:    if (!socket || state !== 'CONNECTED') {
.opencode/bin/lib/launcher-session-proxy.cjs:596:    while (queuedClientFrames.length > 0 && socket && state === 'CONNECTED') {
.opencode/bin/lib/launcher-session-proxy.cjs:609:      // silently swallowed by the keepalive interceptor in handleBackendFrame,
.opencode/bin/lib/launcher-session-proxy.cjs:618:    if (state !== 'CONNECTED' || !socket) {
.opencode/bin/lib/launcher-session-proxy.cjs:658:      // initialize on the fresh socket. Replaying it here too would deliver a second
.opencode/bin/lib/launcher-session-proxy.cjs:671:    const freshSocket = await connectSocket(connect, socketPath);
.opencode/bin/lib/launcher-session-proxy.cjs:685:      // end the session with a non-retryable error instead of attaching the socket.
.opencode/bin/lib/launcher-session-proxy.cjs:693:    socket = freshSocket;
.opencode/bin/lib/launcher-session-proxy.cjs:694:    socketHalfClosed = false;
.opencode/bin/lib/launcher-session-proxy.cjs:697:    socket.on('data', (chunk) => backendSplitter.push(chunk));
.opencode/bin/lib/launcher-session-proxy.cjs:698:    socket.once('error', (error) => {
.opencode/bin/lib/launcher-session-proxy.cjs:699:      log(`socket proxy error: ${error instanceof Error ? error.message : String(error)}`);
.opencode/bin/lib/launcher-session-proxy.cjs:702:    socket.once('close', () => {
.opencode/bin/lib/launcher-session-proxy.cjs:708:    // answering it on the old socket, leaving initialize pending. internalHandshake just
.opencode/bin/lib/launcher-session-proxy.cjs:731:      const ready = await waitForDaemonReady(socketPath, probe, connect, log, { maxAttempts: 1 });
.opencode/bin/lib/launcher-session-proxy.cjs:774:    log(`backend socket ${reason}; reattaching`);
.opencode/bin/lib/launcher-session-proxy.cjs:819:    const ready = await waitForDaemonReady(socketPath, probe, connect, log, { maxAttempts: maxColdStartAttempts });
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:11://   list against a stale graph would imply false-safe "no impact",
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:80:    || text.includes('stale') || text.includes('empty') || text.includes('code_graph_scan')) {
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:119: *   - 'stale'  → block (a full or selective scan is needed first)
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:263:  // on stale/empty/error state.
.opencode/skills/system-code-graph/README.md:3:description: Structural code intelligence for AI agents: tree-sitter AST graph, false-safe readiness contract and eight MCP tools that answer what code touches without lying on stale state.
.opencode/skills/system-code-graph/README.md:15:> The structural half of code intelligence. Answer what depends on what with a graph that refuses to lie when it goes stale.
.opencode/skills/system-code-graph/README.md:26:| **Produces** | Relationship answers gated by freshness, with a hard refuse on stale state |
.opencode/skills/system-code-graph/README.md:34:Semantic search tells you what code means. It cannot tell you what code touches, which is the question that matters before a refactor: which callers break, which imports lift, which symbols a diff moves. Worse, a structural index that has gone stale and answers anyway is dangerous. An agent acts on a blast-radius set that is missing the caller that breaks. system-code-graph builds the structural graph, answers the connected-code questions and gates every read behind a freshness check that returns an explicit blocked signal rather than a silently-incomplete answer.
.opencode/skills/system-code-graph/README.md:40:Every read-path tool passes through a readiness gate first. A stale or scope-mismatched graph returns `status: "blocked"` with a `requiredAction`, never a silently-empty result. The false-safe guarantee is what makes the toolchain trustworthy during a refactor. system-code-graph is the structural half of code intelligence. It answers "what does this code touch" rather than "what does it mean," and it does not answer at all when the answer might be wrong.
.opencode/skills/system-code-graph/README.md:97:A tree-sitter parser walks your workspace and converts each source file into a graph node. Symbols, calls, imports and definitions become typed edges in a SQLite database. The indexer skips unchanged files by content hash, so incremental scans stay fast. Parser crash cohorts classified as B1/B2 land in a quarantine skip-list, surfaced through `code_graph_status` output under `parserHealth` and `parserSkipList`. Syntax-error partial parses surface parse diagnostics without adding a skip-list row. They do not poison the graph but they do reduce coverage.
.opencode/skills/system-code-graph/README.md:107:The four freshness values are `fresh`, `stale`, `empty` and `error`. `blocked` is not a freshness value. It is the refusal payload the tool returns when freshness is not `fresh`. `absent` is a trust-state projection of an `empty` graph, not a freshness value either. The false-safe guarantee is the defining property: a non-fresh read returns a blocked payload rather than an empty answer, every time. It is a hard refuse, not a soft degrade. You never get a silently-empty array from a stale graph, so you never act on partial structural state.
.opencode/skills/system-code-graph/README.md:117:`detect_changes` takes a unified diff and maps it to the exact affected symbols and files through line-range overlap against the indexed code nodes. It refuses to answer when the graph is not fresh, returning `status: "blocked"` instead of an empty `affectedSymbols[]`. This means you can run impact analysis against incoming patches without worrying about a stale graph hiding a breaking change.
.opencode/skills/system-code-graph/README.md:153:| `status: "blocked"` with `requiredAction: "code_graph_scan"` | The graph is stale, empty or scope-mismatched | Run `code_graph_scan` with the intended scope. Use `incremental: false` for scope changes |
.opencode/skills/system-code-graph/README.md:158:| `code-index.cjs` exits 69 | The CLI dist entrypoint is missing or stale relative to its sources | Run `tsc -p .opencode/skills/system-code-graph/tsconfig.json` (dev loops can set `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`) |
.opencode/skills/system-code-graph/README.md:160:| Plugin bridge reports skipped or fail-open status | The bridge runs prompt-time warm-only and does not cold-spawn missing daemons or sockets | It routes through `.opencode/bin/code-index.cjs` and the launcher IPC bridge; see `mcp_server/plugin_bridges/README.md` |
.opencode/skills/system-code-graph/README.md:169:A: An empty answer from a stale index trains an agent to act on false information. The hard refuse is intentional. A `blocked` payload with a `requiredAction` preserves the contract: no read-path tool returns a silently-empty result, ever. During a refactor, that guarantee is what stops you from landing a change that breaks a caller the stale index missed.
.opencode/skills/system-code-graph/README.md:185:A: Readiness answers whether the graph reflects the current workspace. The four values are `fresh`, `stale`, `empty` and `error`. Trust state answers whether the graph passed its gold-query battery recently. A graph can be `fresh` while `goldVerificationTrust` is `absent` if nobody has verified it since the last structural change. High-stakes queries should check both.
.opencode/skills/system-code-graph/README.md:213:| [`references/runtime/ownership_boundary.md`](./references/runtime/ownership_boundary.md) | Boundary between system-code-graph and system-spec-kit |
.opencode/skills/system-code-graph/README.md:215:| [`references/runtime/launcher_lease.md`](./references/runtime/launcher_lease.md) | Launcher PID-file lease and single-writer behavior |
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:3:description: "Readiness state machine (fresh/stale/blocked/empty/absent), trust state, and scope-fingerprint contract that read-path tools enforce."
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:8:  - "code-graph stale"
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:29:- A `code_graph_*` read returns `blocked`, `stale`, `empty`, `absent`, or `error`.
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:48:Both must be acceptable before verification-gated decisions proceed. A graph can be `fresh` while `goldVerificationTrust` is `absent` or `stale` if it has not been verified since a structural change.
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:54:This table mixes the top-level freshness enum with derived projections for read convenience. The canonical top-level `GraphFreshness` enum (`mcp_server/lib/readiness-contract.ts`) is exactly four values: `fresh`, `stale`, `empty`, `error`. `blocked` is a read-tool refusal payload, not a freshness value; `absent` is a trust-state projection of an `empty` graph, not a freshness value.
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:59:| `stale` | Workspace changed since last scan. Soft-stale: incremental rescan can self-heal. Hard-stale: too many changes, full rescan needed. | Read tools return `blocked` with `requiredAction: "code_graph_scan"`. |
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:73:| `trustState` | `live` / `stale` / `absent` / `unavailable` | Freshness-derived projection from `mcp_server/lib/readiness-contract.ts`. `fresh` maps to `live`, `stale` maps to `stale`, `empty` maps to `absent`, and `error` maps to `unavailable`. | Use with `readiness` to decide whether read-path tools can answer. |
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:74:| `goldVerificationTrust` | `live` / `stale` / `absent` | Gold-query verification freshness from `mcp_server/handlers/status.ts`. `live` means the last verification exists, passed, and is within the trust window; `stale` means the verification is failed, old, or attached to a non-fresh graph; `absent` means no verification record exists. | Run `code_graph_verify` before high-stakes or verification-gated decisions when this is not `live`. |
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:123:code_graph_status         → readiness: "stale" (soft-stale)
.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:132:code_graph_status         → readiness: "stale" + scope fingerprint mismatch
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md:26:- The bridge runs warm-only: missing sockets, cold daemons, stale dist, or timeouts return skipped or fail-open payloads instead of cold-spawning at prompt time.
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md:28:The bridge no longer imports session-resume or vector-index internals. Its runtime path is `mk-code-graph-bridge.mjs` → `.opencode/bin/code-index.cjs` → warm daemon IPC. The session-resume and context-compaction handlers stay in `system-spec-kit`; this bridge contributes code-graph status for plugin payloads without crossing that ownership boundary.
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md:64:│ warmProbe() checks daemon IPC socket     │
.opencode/bin/lib/README.md:3:description: "Shared CommonJS helpers for MCP launcher supervision, stdio-to-socket bridging and sidecar env allowlisting."
.opencode/bin/lib/README.md:6:  - "launcher ipc bridge"
.opencode/bin/lib/README.md:14:`bin/lib/` holds the shared CommonJS helpers that the MCP launchers in `bin/` require. It supervises the lifetime of the hf-model-server, bridges launcher stdio to a running daemon socket, reconnects that bridge transparently across daemon recycles, and constrains the environment passed to the embedding sidecar.
.opencode/bin/lib/README.md:18:- `model-server-supervision.cjs` owns crash-loop guarding, RSS watchdog, respawn-lock liveness, listener re-arm, and reaping the process tree (including the root) when the model server is idle-evicted. The mk-spec-memory launcher also reuses its reap path to take down a still-live released daemon recorded in a stale lease before it respawns, so a fresh session after owner disposal cannot leave two writers on the database.
.opencode/bin/lib/README.md:19:- `launcher-ipc-bridge.cjs` resolves per-service socket paths, probes daemon and model-server health (retrying the lease-holder probe a configurable number of times before reaping a slow-but-alive owner), and bridges stdin/stdout to the live socket so a second launcher hands off to the lease holder. The daemon-backed CLIs in `bin/` (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) also load this module for socket-path resolution and the warm-daemon probe behind `--warm-only`.
.opencode/bin/lib/README.md:38:│ model-server-supervision.cjs │   │ launcher-ipc-bridge.cjs      │
.opencode/bin/lib/README.md:39:│ spawn + watchdog + respawn   │   │ socket resolve + probe + pipe│
.opencode/bin/lib/README.md:60:+-- launcher-ipc-bridge.cjs        # Socket path resolution, health probes, lease-probe retry, stdio bridging
.opencode/bin/lib/README.md:72:| `model-server-supervision.cjs` | Builds the model-server supervisor: process-tree RSS sampling, crash-loop backoff, RSS watchdog, respawn-lock liveness, descendant snapshotting, give-up cooldown, socket-dir ownership and SUN_PATH limit assertions, and reaping the process tree root on idle eviction. |
.opencode/bin/lib/README.md:73:| `launcher-ipc-bridge.cjs` | Resolves the per-service IPC socket path, probes daemon and model-server health over JSON-RPC and HTTP, retries the lease-holder probe (`probeLeaseHolderWithRetries` / `resolveLeaseProbeAttempts`) so a slow-but-alive owner is not false-reaped, and bridges launcher stdio to the socket so a non-owning launcher defers to the lease holder. |
.opencode/bin/lib/README.md:84:| Exports | Each file uses `module.exports`. Launchers in `bin/` import these, and the daemon-backed CLI dist entrypoints require `launcher-ipc-bridge.cjs`; nothing here imports a launcher or a CLI. |
.opencode/bin/lib/README.md:96:│ probe socket via launcher-ipc-bridge     │
.opencode/bin/lib/README.md:129:| `maybeBridgeLeaseHolder` | Function | Bridge launcher stdio to an existing lease holder instead of spawning a duplicate. |
.opencode/bin/lib/README.md:130:| `probeLeaseHolderWithRetries` | Function | Probe the lease holder with bounded retries so a slow-but-alive owner is not false-reaped before a sibling respawns. |
.opencode/bin/lib/README.md:133:| `probeDaemon` / `probeModelServer` | Function | Health-check the MCP daemon socket and the model server endpoint. |
.opencode/bin/lib/README.md:144:node -e "require('./.opencode/bin/lib/launcher-ipc-bridge.cjs')"
.opencode/skills/system-code-graph/package-lock.json:500:        "estree-walker": "^3.0.3",
.opencode/skills/system-code-graph/package-lock.json:1017:    "node_modules/estree-walker": {
.opencode/skills/system-code-graph/package-lock.json:1019:      "resolved": "https://registry.npmjs.org/estree-walker/-/estree-walker-3.0.3.tgz",
.opencode/skills/system-code-graph/package-lock.json:1908:      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
.opencode/skills/system-code-graph/package-lock.json:2023:      "deprecated": "No longer maintained. Please contact the author of the relevant native addon; alternatives are available.",
.opencode/skills/system-code-graph/mcp_server/README.md:27:- `code-index-cli.ts` (with `code-index-cli-manifest.ts`) is the daemon-backed CLI over the same 8 tools, fronted by the `.opencode/bin/code-index.cjs` shim. It coerces flag values against each tool's input schema, preserves blocked-read rendering (a `status:"blocked"` refusal exits `0` as an actionable answer; `detect_changes` `parse_error` exits `64`) and maps errors to the shared `0`/`1`/`64`/`69`/`75` exit taxonomy. `--warm-only` probes the daemon and exits `75` instead of cold-spawning; otherwise a cold daemon is auto-spawned through `mk-code-index-launcher.cjs`.
.opencode/skills/system-code-graph/mcp_server/README.md:30:This package communicates via stdio transport for MCP clients and via the daemon IPC socket for the CLI. MCP clients register the compiled server executable and call code graph tools through the standard MCP lifecycle; the MCP registration is unchanged by the CLI (dual-stack, additive).
.opencode/skills/system-code-graph/mcp_server/README.md:80:+-- lib/                      # Code-graph indexer, DB, lease, seed/context, parser, readiness and startup helpers
.opencode/skills/system-code-graph/mcp_server/README.md:115:+-- lib/                  # Code-graph indexer, DB, lease, seed/context, parser, readiness and startup helpers
.opencode/bin/lib/launcher-ipc-bridge.cjs:13:const SOCKET_FILE_NAME = 'daemon-ipc.sock';
.opencode/bin/lib/launcher-ipc-bridge.cjs:47:// A single transient probe miss must NOT make a sibling reap the lease owner and respawn a second
.opencode/bin/lib/launcher-ipc-bridge.cjs:48:// daemon: a busy owner (e.g. mid-FTS-merge) can momentarily exceed the probe window. Require N
.opencode/bin/lib/launcher-ipc-bridge.cjs:49:// consecutive deep-probe failures before declaring the owner dead. Defaults keep the first probe at
.opencode/bin/lib/launcher-ipc-bridge.cjs:51:// the probe grace ceiling — a genuinely dead socket fails fast, so only a hung daemon pays the retry.
.opencode/bin/lib/launcher-ipc-bridge.cjs:89:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/lib/launcher-ipc-bridge.cjs:92:  return path.join(socketDir, SOCKET_FILE_NAME);
.opencode/bin/lib/launcher-ipc-bridge.cjs:95:function toConnectionOptions(socketPath) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:96:  if (!socketPath.startsWith('tcp://')) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:97:    return socketPath;
.opencode/bin/lib/launcher-ipc-bridge.cjs:99:  const url = new URL(socketPath);
.opencode/bin/lib/launcher-ipc-bridge.cjs:106:function bridgeStdioToSocket(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:110:  const socket = net.createConnection(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-ipc-bridge.cjs:116:    input.unpipe(socket);
.opencode/bin/lib/launcher-ipc-bridge.cjs:117:    socket.unpipe(output);
.opencode/bin/lib/launcher-ipc-bridge.cjs:118:    socket.destroy();
.opencode/bin/lib/launcher-ipc-bridge.cjs:122:  socket.once('connect', () => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:123:    options.onConnect?.(socket);
.opencode/bin/lib/launcher-ipc-bridge.cjs:124:    input.pipe(socket);
.opencode/bin/lib/launcher-ipc-bridge.cjs:125:    socket.pipe(output);
.opencode/bin/lib/launcher-ipc-bridge.cjs:128:  socket.once('error', (error) => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:133:  socket.once('close', () => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:138:    socket.end();
.opencode/bin/lib/launcher-ipc-bridge.cjs:147:  return socket;
.opencode/bin/lib/launcher-ipc-bridge.cjs:150:function probeDaemon(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:154:  // that accepts the connection but never responds). Without it, a bare socket 'connect' counts as alive
.opencode/bin/lib/launcher-ipc-bridge.cjs:171:    let socket;
.opencode/bin/lib/launcher-ipc-bridge.cjs:183:      if (socket) socket.destroy();
.opencode/bin/lib/launcher-ipc-bridge.cjs:188:      socket = connect(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-ipc-bridge.cjs:197:    socket.once('connect', () => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:202:      socket.write(request);
.opencode/bin/lib/launcher-ipc-bridge.cjs:204:    socket.on('data', (chunk) => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:229:    socket.once('error', (error) => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:230:      finish('dead', error instanceof Error ? error.message : 'socket-error');
.opencode/bin/lib/launcher-ipc-bridge.cjs:232:    socket.once('close', () => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:256:function probeModelServer(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:272:    let socket;
.opencode/bin/lib/launcher-ipc-bridge.cjs:283:      if (socket) socket.destroy();
.opencode/bin/lib/launcher-ipc-bridge.cjs:288:      socket = connect(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-ipc-bridge.cjs:297:    socket.once('connect', () => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:298:      socket.write(request);
.opencode/bin/lib/launcher-ipc-bridge.cjs:300:    socket.on('data', (chunk) => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:303:    socket.once('end', () => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:328:    socket.once('error', (error) => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:329:      finish('dead', error instanceof Error ? error.message : 'socket-error');
.opencode/bin/lib/launcher-ipc-bridge.cjs:331:    socket.once('close', () => {
.opencode/bin/lib/launcher-ipc-bridge.cjs:339:// sleep are injectable so the retry decision is unit-testable without real sockets or timers.
.opencode/bin/lib/launcher-ipc-bridge.cjs:340:async function probeLeaseHolderWithRetries(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:355:    result = await probe(socketPath, { timeoutMs, connect, deepProbe: true });
.opencode/bin/lib/launcher-ipc-bridge.cjs:368:    leaseResult,
.opencode/bin/lib/launcher-ipc-bridge.cjs:376:  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
.opencode/bin/lib/launcher-ipc-bridge.cjs:377:  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
.opencode/bin/lib/launcher-ipc-bridge.cjs:378:  const ownerPid = leaseResult.ownerPid;
.opencode/bin/lib/launcher-ipc-bridge.cjs:380:    process.stdout.write(`LEASE_HELD_BY:${ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:385:      legacyReport(leaseResult);
.opencode/bin/lib/launcher-ipc-bridge.cjs:392:  // Prefer the path the lease owner actually recorded over recomputing one from env. Under a
.opencode/bin/lib/launcher-ipc-bridge.cjs:394:  // recomputed path can miss the live socket and false-report 'no-bridge-socket'. Only trust the
.opencode/bin/lib/launcher-ipc-bridge.cjs:396:  // to recomputation for legacy leases that predate socketPath and for the other launchers whose
.opencode/bin/lib/launcher-ipc-bridge.cjs:397:  // leases never carry it.
.opencode/bin/lib/launcher-ipc-bridge.cjs:398:  const storedSocketPath = leaseResult.socketPath;
.opencode/bin/lib/launcher-ipc-bridge.cjs:404:  const socketPath = usableStoredSocketPath ?? getIpcSocketPath(serviceName, { dbDir });
.opencode/bin/lib/launcher-ipc-bridge.cjs:405:  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:406:    writeLeaseHeld(' (no-bridge-socket)');
.opencode/bin/lib/launcher-ipc-bridge.cjs:407:    return { action: 'report', reason: 'no-bridge-socket', socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:410:  // deepProbe: REQUIRE a JSON-RPC reply, not just a socket accept. The reap/bridge decision must
.opencode/bin/lib/launcher-ipc-bridge.cjs:416:  // Require N consecutive failures (not one transient miss) before reaping a sibling's owner.
.opencode/bin/lib/launcher-ipc-bridge.cjs:418:  const probe = await probeLeaseHolderWithRetries(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:423:      `[${loggerPrefix}] lease holder pid=${ownerPid} probe ${attempt}/${total} not alive (${result.reason}); retrying\n`,
.opencode/bin/lib/launcher-ipc-bridge.cjs:427:    process.stderr.write(`[${loggerPrefix}] lease holder pid=${ownerPid} socket=${socketPath} failed ${probeAttempts} consecutive liveness probes: ${probe.reason}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:428:    return { action: 'respawn', reason: probe.reason, socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:431:  process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:434:  // attach) is fully wired before returning. The raw bridge returns a socket, not a
.opencode/bin/lib/launcher-ipc-bridge.cjs:436:  await Promise.resolve(bridgeToSocket(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:441:  return { action: 'bridge', socketPath };
.opencode/skills/system-code-graph/references/config/database_path_policy.md:24:This policy fixes the current runtime location for the code graph's package-local SQLite database and its sidecar files. The database is the code graph's structural index state, so the policy ensures clear ownership boundaries after the ADR-002 extraction.
.opencode/skills/system-code-graph/references/config/database_path_policy.md:30:- Diagnosing stale state from legacy database locations.
.opencode/skills/system-code-graph/references/config/database_path_policy.md:39:- `.opencode/bin/mk-code-index-launcher.cjs` for the standalone-storage guard + skill-local path resolution + migration-back.
.opencode/skills/system-code-graph/references/config/database_path_policy.md:64:code-graph.sqlite-wal
.opencode/skills/system-code-graph/references/config/database_path_policy.md:71:.mk-code-index-launcher.json
.opencode/skills/system-code-graph/references/config/database_path_policy.md:88:Given that, the database is kept SKILL-LOCAL because that is the simpler ownership model:
.opencode/skills/system-code-graph/references/config/database_path_policy.md:91:- `system-spec-kit` keeps memory and spec packet state in its own DB; the ownership boundary is preserved.
.opencode/skills/system-code-graph/references/config/database_path_policy.md:98:a live DB; the `.gitignore` rules and the launcher migration-back handle this. The SQLite file
.opencode/skills/system-code-graph/references/config/database_path_policy.md:115:1. **Pre-extraction → skill-local (packet 013).** `system-spec-kit/mcp_server/database/` → `system-code-graph/mcp_server/database/`. Established skill-local DB ownership per ADR-002.
.opencode/skills/system-code-graph/references/config/database_path_policy.md:116:2. **Skill-local → shared spec-kit data dir (packet 019/020 + cross-runtime consolidation).** `system-code-graph/mcp_server/database/` → `.opencode/.spec-kit/code-graph/database/`. The launcher auto-migrates legacy installs on first startup: the SQLite triplet, readiness marker, and launcher state file are **copied** (not moved) so the prior location is preserved as a backup. Configs that still reference the `system_code_graph` MCP server name should be renamed to `mk_code_index`.
.opencode/skills/system-code-graph/references/config/database_path_policy.md:117:3. **Shared spec-kit data dir → skill-local (2026-05-29 reversal).** `.opencode/.spec-kit/code-graph/database/` → `system-code-graph/mcp_server/database/`. The cross-runtime-sharing rationale for the shared location was incorrect — every runtime already shares the skill via the `.opencode/skills` symlink, so skill-local is itself a single shared instance. The launcher auto-migrates the former shared location back (copy, not move). Reverses ADR-002/004/005.
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:28:const SOCKET_FILE_NAME = 'daemon-ipc.sock';
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:77:  readonly probeDaemon: (socketPath: string, options?: { timeoutMs?: number; deepProbe?: boolean }) => Promise<BridgeProbeResult>;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:78:  readonly toConnectionOptions: (socketPath: string) => string | net.NetConnectOpts;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:165:    const launcherPath = path.join(directOpencodeDir, 'bin', 'mk-code-index-launcher.cjs');
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:166:    const bridgePath = path.join(directOpencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:596:  // A bare apply defaults to rescan routing, which on a soft-stale graph is
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:795:    ?? (text.includes('code_graph_scan') || text.includes('full_scan') || text.includes('selective_reindex') || text.includes('stale') || text.includes('empty') ? 'code_graph_scan' : undefined);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:919:function socketPathTooLong(socketPath: string): boolean {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:920:  if (socketPath.startsWith('tcp://')) return false;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:921:  return process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:924:// `mode: 0o700` only applies when mkdir CREATES the dir. A pre-existing socket dir
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:928:// symlinked socket node — otherwise a fake daemon could inject attacker-controlled
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:930:function assertSocketPerimeter(socketDir: string): void {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:931:  const dirLink = lstatSync(socketDir);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:933:    throw new CliProtocolError(`IPC socket directory is a symlink; refusing to connect: ${socketDir}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:935:  const dirStat = statSync(socketDir);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:938:    throw new CliProtocolError(`IPC socket directory is not owned by the current user (uid ${dirStat.uid} != ${uid}): ${socketDir}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:941:    throw new CliProtocolError(`IPC socket directory is group/world-writable: ${socketDir}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:943:  const socketPath = path.join(socketDir, SOCKET_FILE_NAME);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:946:    nodeLink = lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:953:    throw new CliProtocolError(`IPC socket path is a symlink; refusing to connect: ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:956:    throw new CliProtocolError(`IPC socket is not owned by the current user (uid ${nodeLink.uid} != ${uid}): ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:964:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:965:  if (!socketDir || socketDir.startsWith('tcp://')) return;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:966:  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:967:  assertSocketPerimeter(socketDir);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:984:async function waitForDaemon(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<void> {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:990:    const probe = await bridge.probeDaemon(socketPath, {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1007:    private readonly socket: net.Socket,
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1010:  static connect(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<JsonRpcSocketClient> {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1012:      let socket: net.Socket;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1018:        socket.off?.('connect', onConnect);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1019:        socket.off?.('error', onError);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1021:          socket.destroy?.();
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1025:        resolve(new JsonRpcSocketClient(socket));
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1033:        const connectionOptions = bridge.toConnectionOptions(socketPath);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1034:        socket = typeof connectionOptions === 'string'
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1042:      socket.once('connect', onConnect);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1043:      socket.once('error', onError);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1051:    this.socket.write(`${JSON.stringify(frame)}\n`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1063:        this.socket.off('data', onData);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1064:        this.socket.off('error', onError);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1065:        this.socket.off('close', onClose);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1101:      const onClose = (): void => finish(new CliRetryableError('socket closed before response'));
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1105:      this.socket.on('data', onData);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1106:      this.socket.once('error', onError);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1107:      this.socket.once('close', onClose);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1108:      this.socket.write(`${JSON.stringify(request)}\n`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1113:    this.socket.end();
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1114:    this.socket.destroy();
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1118:async function ensureDaemonReady(socketPath: string, bridge: BridgeModule, paths: RepoPaths, timeoutMs: number, warmOnly: boolean): Promise<void> {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1119:  const initialProbe = await bridge.probeDaemon(socketPath, { timeoutMs: Math.min(timeoutMs, 5000), deepProbe: true });
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1125:  await waitForDaemon(socketPath, bridge, timeoutMs);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1132:  const socketPath = bridge.getIpcSocketPath('mk-code-index', { dbDir: paths.dbDir });
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1133:  if (socketPathTooLong(socketPath)) {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1134:    throw new CliProtocolError(`IPC socket path exceeds the Darwin sun_path limit: ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1137:  await ensureDaemonReady(socketPath, bridge, paths, timeoutMs, warmOnly);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1139:  const client = await JsonRpcSocketClient.connect(socketPath, bridge, timeoutMs);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1251:  // they flush; all sockets and timers are closed or unref'd by here.
.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:49:- **File mtime staleness** - Checks mtime drift on tracked files via `ensureFreshFiles()` (`mcp_server/lib/ensure-ready.ts:421`).
.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:84:- **CG-RP-001: SQLite corruption recovery** - `recoverSqliteCorruption()` in `mcp_server/lib/recovery-procedures.ts:160-198` copies the database triplet to a recovery directory, runs an integrity check, moves the bad copy to quarantine and triggers a full scan.
.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:85:- **CG-RP-002: Partial scan failure recovery** - `recoverPartialScanFailure()` in `mcp_server/lib/recovery-procedures.ts:200-247` runs an integrity check, queries staged files where `file_mtime_ms=0` and decides incremental vs full scan based on the stale count.
.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:110:- **Canonical readiness mapping** - `canonicalReadinessFromFreshness()` in `mcp_server/lib/readiness-contract.ts:73-88` maps `fresh` to `ready`, `stale` to `stale`, `empty` to `missing` and `error` to `missing`.
.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:111:- **Trust state derivation** - `queryTrustStateFromFreshness()` in `mcp_server/lib/readiness-contract.ts:109-124` maps `fresh` to `live`, `stale` to `stale`, `empty` to `absent` and `error` to `unavailable`.
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:17:const BRIDGE_PATH = fileURLToPath(new URL('../../../../bin/lib/launcher-ipc-bridge.cjs', import.meta.url));
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:101:  const staleDist = exitCode === 69 && /dist entrypoint is (stale|missing)/i.test(stderr);
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:102:  if (staleDist) {
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:105:      brief: 'dist stale, rebuild required',
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:106:      error: 'dist_stale_rebuild_required',
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:109:        state: 'dist_stale_rebuild_required',
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:110:        staleDist: true,
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:147:    const socketPath = bridge.getIpcSocketPath(SERVICE_NAME, { dbDir: DB_DIR });
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:148:    if (!socketPath.startsWith('tcp://') && !existsSync(socketPath)) {
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:149:      return { warm: false, reason: 'socket_absent', socketPath };
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:151:    if (process.platform === 'darwin' && !socketPath.startsWith('tcp://') && Buffer.byteLength(socketPath) > 103) {
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:152:      return { warm: false, reason: 'socket_path_too_long', socketPath };
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:154:    const probe = await bridge.probeDaemon(socketPath, {
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:159:      ? { warm: true, reason: probe.reason ?? 'alive', socketPath }
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:160:      : { warm: false, reason: probe.reason ?? probe.status, socketPath };
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:323:      socketPath: probe.socketPath ? '[code-index-socket]' : null,
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:380:            socketPath: '[code-index-socket]',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:72:  staleButValidGraphFiles: number;
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:447:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:485:            staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:524:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:562:            staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:689:  // this, code_graph_status reports stale ("candidate manifest drift") on the
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:777:    staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
.opencode/bin/lib/model-server-supervision.cjs:313:// A scheduled daemon relaunch must be ABORTED when its backoff fires under a dying owner.
.opencode/bin/lib/model-server-supervision.cjs:317:// drop every bridged transport. Crash-recovery and RSS-recycle fire with the owner alive and a
.opencode/bin/lib/model-server-supervision.cjs:447:  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/lib/model-server-supervision.cjs:450:  return path.join(socketDir, HF_MODEL_SERVER_SOCKET_FILE_NAME);
.opencode/bin/lib/model-server-supervision.cjs:459:function assertSunPathLimit(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:460:  if (socketPath.startsWith('tcp://')) return;
.opencode/bin/lib/model-server-supervision.cjs:461:  const byteLength = Buffer.byteLength(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:467:    `hf-model-server socket path exceeds the conservative 104-byte sun_path limit (${byteLength} bytes): ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory.`,
.opencode/bin/lib/model-server-supervision.cjs:471:function assertSocketDirOwnership(socketPath, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:472:  if (socketPath.startsWith('tcp://')) return;
.opencode/bin/lib/model-server-supervision.cjs:475:  const socketDir = path.dirname(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:478:    dirStat = statApi.lstatSync(socketDir);
.opencode/bin/lib/model-server-supervision.cjs:485:      throw codedError('ESOCKETDIRSYMLINK', `Refusing to use symlinked SPECKIT_IPC_SOCKET_DIR for hf-model-server socket: ${socketDir}`);
.opencode/bin/lib/model-server-supervision.cjs:489:      throw codedError('ESOCKETDIRFOREIGN', `Refusing to use hf-model-server socket directory owned by uid ${dirStat.uid}; current uid is ${uid}: ${socketDir}`);
.opencode/bin/lib/model-server-supervision.cjs:494:    const socketStat = statApi.lstatSync(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:495:    if (socketStat.isSymbolicLink()) {
.opencode/bin/lib/model-server-supervision.cjs:496:      throw codedError('ESOCKETSYMLINK', `Refusing to unlink or bind through symlinked hf-model-server socket node: ${socketPath}`);
.opencode/bin/lib/model-server-supervision.cjs:503:function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath(), options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:505:  const lockDirPath = socketPath.startsWith('tcp://')
.opencode/bin/lib/model-server-supervision.cjs:507:    : path.dirname(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:511:function modelServerGiveUpPath(socketPath = resolveModelServerSocketPath(), options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:513:  const giveUpDirPath = socketPath.startsWith('tcp://')
.opencode/bin/lib/model-server-supervision.cjs:515:    : path.dirname(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:519:function writeModelServerGiveUpUntil(socketPath, giveUpUntilMs, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:523:  const giveUpPath = path.join(ensureCanonicalDir(path.dirname(modelServerGiveUpPath(socketPath, options))), HF_MODEL_SERVER_GIVEUP_FILE_NAME);
.opencode/bin/lib/model-server-supervision.cjs:565:  const staleMs = parsePositiveInteger(options.staleMs, RESPAWN_LOCK_STALE_MS);
.opencode/bin/lib/model-server-supervision.cjs:566:  return Math.max(staleMs, giveUpCooldownMs);
.opencode/bin/lib/model-server-supervision.cjs:582:    // Best-effort stale-state cleanup.
.opencode/bin/lib/model-server-supervision.cjs:586:function readModelServerGiveUpUntil(socketPath, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:588:  const giveUpPath = modelServerGiveUpPath(socketPath, options);
.opencode/bin/lib/model-server-supervision.cjs:604:// socket and would reap+respawn the daemon mid-scan (killing the scan). The
.opencode/bin/lib/model-server-supervision.cjs:631:// path so a stale marker can never pin a genuinely dead or wedged daemon.
.opencode/bin/lib/model-server-supervision.cjs:645:  const staleMs = typeof options.staleMs === 'number' ? options.staleMs : RESPAWN_LOCK_STALE_MS;
.opencode/bin/lib/model-server-supervision.cjs:656:  // window, which can exceed RESPAWN_LOCK_STALE_MS. Bound staleness to listener liveness: only let the
.opencode/bin/lib/model-server-supervision.cjs:657:  // wall-clock age expire the lock when the recorded owner is NOT confirmably alive (absent/invalid pid,
.opencode/bin/lib/model-server-supervision.cjs:658:  // or an EPERM-opaque pid we cannot prove is ours). If the owner pid is alive, it still owns the lock —
.opencode/bin/lib/model-server-supervision.cjs:659:  // never reclaim it from under a live owner on age alone.
.opencode/bin/lib/model-server-supervision.cjs:662:  if (Number.isFinite(startedAtMs) && nowMs - startedAtMs > staleMs) return true;
.opencode/bin/lib/model-server-supervision.cjs:708:    // Atomically CLAIM the stale lock via rename before deleting it, then re-open
.opencode/bin/lib/model-server-supervision.cjs:714:    const staleClaim = `${currentLockPath}.stale.${process.pid}.${Date.now()}`;
.opencode/bin/lib/model-server-supervision.cjs:716:      fsApi.renameSync(currentLockPath, staleClaim);
.opencode/bin/lib/model-server-supervision.cjs:722:      fsApi.unlinkSync(staleClaim);
.opencode/bin/lib/model-server-supervision.cjs:729:      logger(`reclaimed stale ${label} lock ${rel(currentLockPath)}`);
.opencode/bin/lib/model-server-supervision.cjs:738:function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath(), options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:740:    modelServerRespawnLockPath(socketPath, options),
.opencode/bin/lib/model-server-supervision.cjs:746:function releaseRespawnLockFile(lock) {
.opencode/bin/lib/model-server-supervision.cjs:759:function buildLeaseObject(childPid = null, startedAt = null, modelServerPid = null, socketPath = null) {
.opencode/bin/lib/model-server-supervision.cjs:763:    ownerPid: process.pid,
.opencode/bin/lib/model-server-supervision.cjs:771:  // Record the owner's actual IPC socket path so a secondary launcher bridges to the path the
.opencode/bin/lib/model-server-supervision.cjs:772:  // owner truly listens on, instead of recomputing one that can diverge under a different
.opencode/bin/lib/model-server-supervision.cjs:773:  // SPECKIT_IPC_SOCKET_DIR (e.g. worktree env). Optional + additive: leases without it fall back
.opencode/bin/lib/model-server-supervision.cjs:775:  if (typeof socketPath === 'string' && socketPath.length > 0) {
.opencode/bin/lib/model-server-supervision.cjs:776:    payload.socketPath = socketPath;
.opencode/bin/lib/model-server-supervision.cjs:790:function unlinkModelServerSocket(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:791:  if (socketPath.startsWith('tcp://')) return;
.opencode/bin/lib/model-server-supervision.cjs:793:    fs.unlinkSync(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:859:    logger(`confirmed-dead hf-embed socket; reaping recorded hf-model-server pid ${childPid} before respawn`);
.opencode/bin/lib/model-server-supervision.cjs:943:        logger(`hf-model-server crash loop detected after ${result.deathsInWindow} deaths; modelServerPid removed from lease`);
.opencode/bin/lib/model-server-supervision.cjs:1011:    const socketPath = resolveSocketPath();
.opencode/bin/lib/model-server-supervision.cjs:1013:      return deps.writeGiveUpUntil(giveUpUntilMs, socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1015:    return writeModelServerGiveUpUntil(socketPath, giveUpUntilMs, { dbDir, log: logger });
.opencode/bin/lib/model-server-supervision.cjs:1018:  function readGiveUpUntil(socketPath = resolveSocketPath()) {
.opencode/bin/lib/model-server-supervision.cjs:1019:    if (typeof deps.readGiveUpUntil === 'function') return deps.readGiveUpUntil(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1020:    return readModelServerGiveUpUntil(socketPath, {
.opencode/bin/lib/model-server-supervision.cjs:1029:  function activeGiveUpCooldown(socketPath = resolveSocketPath()) {
.opencode/bin/lib/model-server-supervision.cjs:1030:    const giveUpUntil = readGiveUpUntil(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1073:  function releaseDemandRespawnLock() {
.opencode/bin/lib/model-server-supervision.cjs:1074:    releaseRespawnLockFile(state.demandRespawnLock);
.opencode/bin/lib/model-server-supervision.cjs:1078:  function acquireDemandRespawnLock(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:1082:    const lock = acquireModelServerRespawnLockFile(socketPath, { dbDir, log: logger });
.opencode/bin/lib/model-server-supervision.cjs:1136:      // so the model-server ROOT process survived idle eviction — the lease was cleared but the resident
.opencode/bin/lib/model-server-supervision.cjs:1139:      // It short-circuits cleanly if the root is already dead / EPERM-opaque, so the lease is still cleared.
.opencode/bin/lib/model-server-supervision.cjs:1143:      // The re-arm can legitimately reject (a sibling reclaimed the socket via the EADDRINUSE
.opencode/bin/lib/model-server-supervision.cjs:1144:      // live-resident guard, or a perimeter assertion tripped). Swallow it here: the interval
.opencode/bin/lib/model-server-supervision.cjs:1165:  function releaseModelServerDemandListenerForSpawn(options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:1174:    if (!options.keepRespawnLock) releaseDemandRespawnLock();
.opencode/bin/lib/model-server-supervision.cjs:1193:      releaseDemandRespawnLock();
.opencode/bin/lib/model-server-supervision.cjs:1197:  async function reapRecordedModelServerBeforeRespawn(socketPath, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:1198:    const lock = options.lock || acquireModelServerRespawnLockFile(socketPath, { dbDir, log: logger });
.opencode/bin/lib/model-server-supervision.cjs:1209:      if (!options.lock) releaseRespawnLockFile(lock);
.opencode/bin/lib/model-server-supervision.cjs:1213:  async function prepareModelServerDemandTarget(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:1214:    if (socketPath.startsWith('tcp://')) {
.opencode/bin/lib/model-server-supervision.cjs:1215:      const lock = acquireDemandRespawnLock(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1219:    assertSunPathLimit(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1221:    assertSocketDirOwnership(socketPath, { statApi, getuid, logger });
.opencode/bin/lib/model-server-supervision.cjs:1222:    fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 });
.opencode/bin/lib/model-server-supervision.cjs:1224:    if (fs.existsSync(socketPath)) {
.opencode/bin/lib/model-server-supervision.cjs:1227:        const probe = await probeModelServer(socketPath, { timeoutMs: 1000 });
.opencode/bin/lib/model-server-supervision.cjs:1236:    // The respawn lock is intentionally held across the bind + idle-listener window (released only on
.opencode/bin/lib/model-server-supervision.cjs:1237:    // demand-driven spawn, shutdown, or listen failure) so a second launcher sharing this socket loses
.opencode/bin/lib/model-server-supervision.cjs:1240:    const lock = acquireDemandRespawnLock(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1243:    if (fs.existsSync(socketPath)) {
.opencode/bin/lib/model-server-supervision.cjs:1244:      reapResult = await reapRecordedModelServerBeforeRespawn(socketPath, { lock });
.opencode/bin/lib/model-server-supervision.cjs:1246:      // No socket file yet — but a sibling launcher may have JUST spawned the server: launch() writes the
.opencode/bin/lib/model-server-supervision.cjs:1248:      // is live while the socket is absent. Respect a live recorded pid so we do not clobber a booting
.opencode/bin/lib/model-server-supervision.cjs:1252:        releaseDemandRespawnLock();
.opencode/bin/lib/model-server-supervision.cjs:1258:      releaseDemandRespawnLock();
.opencode/bin/lib/model-server-supervision.cjs:1264:    unlinkModelServerSocket(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1293:    releaseModelServerDemandListenerForSpawn({ keepRespawnLock: true });
.opencode/bin/lib/model-server-supervision.cjs:1295:    releaseDemandRespawnLock();
.opencode/bin/lib/model-server-supervision.cjs:1298:      // demand server was already torn down above and the respawn lock released, so without re-arming
.opencode/bin/lib/model-server-supervision.cjs:1321:    const socketPath = options.socketPath || resolveSocketPath();
.opencode/bin/lib/model-server-supervision.cjs:1322:    const prepared = options.skipPrepare ? { shouldListen: true } : await prepareModelServerDemandTarget(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1325:      return { started: false, reason: prepared.reason, socketPath, lockPath: prepared.lockPath };
.opencode/bin/lib/model-server-supervision.cjs:1333:          if (error && error.code === 'EADDRINUSE' && !socketPath.startsWith('tcp://') && !reclaimedStaleSocket) {
.opencode/bin/lib/model-server-supervision.cjs:1334:            // Only reclaim a CONFIRMED-STALE socket. If the shared pid still records a live resident,
.opencode/bin/lib/model-server-supervision.cjs:1335:            // a sibling launcher's server bound first — do not unlink its live socket (it serves embeds
.opencode/bin/lib/model-server-supervision.cjs:1340:              reject(new Error(`hf-model-server socket ${socketPath} owned by a live resident (pid ${recordedPid}); not reclaiming`));
.opencode/bin/lib/model-server-supervision.cjs:1347:            // fails the listener closed (rejects → outer catch releases the lock and rethrows).
.opencode/bin/lib/model-server-supervision.cjs:1349:              assertSocketDirOwnership(socketPath, { statApi, getuid, logger });
.opencode/bin/lib/model-server-supervision.cjs:1350:              unlinkModelServerSocket(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1351:              server.listen(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1367:        if (socketPath.startsWith('tcp://')) {
.opencode/bin/lib/model-server-supervision.cjs:1368:          const url = new URL(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1371:          server.listen(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1375:      releaseDemandRespawnLock();
.opencode/bin/lib/model-server-supervision.cjs:1379:    if (!socketPath.startsWith('tcp://')) {
.opencode/bin/lib/model-server-supervision.cjs:1380:      fs.chmodSync(socketPath, 0o600);
.opencode/bin/lib/model-server-supervision.cjs:1383:    state.demandTarget = socketPath;
.opencode/bin/lib/model-server-supervision.cjs:1385:    logger(`hf-model-server lazy demand listener ready at ${socketPath}`);
.opencode/bin/lib/model-server-supervision.cjs:1386:    return { started: true, socketPath };
.opencode/bin/lib/model-server-supervision.cjs:1393:    releaseDemandListenerForSpawn: releaseModelServerDemandListenerForSpawn,
.opencode/bin/lib/model-server-supervision.cjs:1460:  releaseRespawnLockFile,
.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:150:  description: '[L8:Code Graph] Verification-gated apply-mode for code graph recovery. Runs the gold-query battery before and after typed recovery operations, enforces soft-stale self-healing boundaries, writes JSONL audit logs, and rolls back bad applies. Token Budget: 1000.',
.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:158:        description: 'Apply operation to run. Defaults to re-scan routing based on staleness state.',
.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:160:      confirm: { type: 'boolean', description: 'Required for hard-stale recovery; for prune-excludes when any candidate pattern classifies medium-tier; and for every destructive operation (recover-sqlite-corruption, rollback-bad-apply) regardless of staleness. Low-tier prune-excludes additionally requires lowTierOptIn=true.' },
.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:162:      crashRootCauseAddressed: { type: 'boolean', description: 'Required true before repair-nodes triages parser_skip_list candidates. repair-nodes REPORTS stale quarantined files for manual remediation; it does not auto-re-parse them (the skip-list is intentionally not self-healing).' },
.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:176:  description: '[L6:Analysis] Read-only preflight: maps a unified-diff input to the structural symbols it touches via line-range overlap against indexed code_nodes. Refuses to answer when graph readiness is anything other than "fresh" — returns status: "blocked" instead of a false-safe empty affectedSymbols[]. Use BEFORE acting on a diff so callers see hard refuse on stale/empty/error state. Token Budget: 1200.',
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:20:The playbook contains 24 scenarios across 8 groups. It targets the current reality map: read-path checks are bounded and half-auto, full scan/verify/status are operator actions, `detect_changes` is read-only and blocks on stale state, and coverage graph automation is limited to deep-loop command YAML. Group 09 adds post-rename infrastructure probes.
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:37:3. Use disposable workspace copies for file mutation, stale graph, scan and doctor apply scenarios.
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:70:| 002 | query self-heal stale file | [query-self-heal-stale-file.md](./01--read-path-freshness/query-self-heal-stale-file.md) |
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:80:| 005 | code_graph_verify blocked on stale | [code-graph-verify-blocked-on-stale.md](./02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md) |
.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:147:Automated coverage lives in the code_graph runtime tests and build checks. Use this section as the manual-to-automated trace point when recording evidence for release review.
.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:35:Names are stable per layer; do not normalize them across layers unless a packet explicitly migrates every caller.
.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:53:| Launcher file | `mk-code-index-launcher.cjs` | `.opencode/bin/mk-code-index-launcher.cjs` | Filesystem path uses the hyphenated server identity. |
.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:83:- A future migration would need its own packet with build and config redesign scope; it is currently deferred.
.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:93:The code-graph SQLite triplet (`code-graph.sqlite`, `.sqlite-wal`, `.sqlite-shm`), readiness marker (`.code-graph-readiness.json`), and launcher state (`.mk-code-index-launcher.json`) all live in the skill-local data directory:
.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:99:This location is SKILL-LOCAL. The database was briefly consolidated to a shared workspace-root location (`.opencode/.spec-kit/code-graph/`), but that was reversed on 2026-05-29 — every runtime already shares the skill through the `.opencode/skills` symlink, so the skill-local path is already a single shared instance and the separate shared location added no coordination benefit. See [`../config/database_path_policy.md`](../config/database_path_policy.md) for the full migration record and override rules.
.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:106:- [`ownership_boundary.md`](ownership_boundary.md) — what stays in `system-spec-kit` vs `system-code-graph` after extraction.
.opencode/skills/system-code-graph/changelog/v1.0.2.0.md:3:**Release date**: 2026-05-15
.opencode/skills/system-code-graph/changelog/v1.0.2.0.md:68:No migration required. v1.0.0.0 → v1.0.1.0 → v1.0.2.0 is a polish + correctness chain; no API changes. Cross-runtime config consumers should observe the new `SPECKIT_CODE_GRAPH_INDEX_*="false"` defaults — flip via `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` in `.env.local` for maintainer indexing.
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:31: * `unavailable`) because gold verification can only report `live`, `stale`, or
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:193:    return 'stale';
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:198:    return 'stale';
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:202:    return 'stale';
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:206:    return 'stale';
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:306:    const staleButValidGraphFiles = getStaleButValidGraphFilesForStatus();
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:319:    // status reason (no string-mapping that swallows 'error' as 'missing').
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:321:    // like "graph is empty (0 nodes)" or "<N> stale files exceed selective
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:328:      case 'stale':
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:329:        statusReason = 'status probe reports graph is stale';
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:400:            staleButValidGraphFiles,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts:40:import { closeDb, initDb } from '../../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts:83:    initDb(tempDir);
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:3:description: "Owner and PID single-writer leases for the mk-code-index launcher."
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:5:  - "code graph launcher lease"
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:7:  - "lease held by pid"
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:8:  - "stale lease reclaim"
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:16:`mk-code-index-launcher.cjs` uses an owner lease plus a launcher-local PID file to prevent duplicate code-graph MCP daemons from racing the same SQLite store.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:24:The launcher lease is a process-boundary guard. Before bootstrap work begins, strict mode first acquires `.opencode/skills/system-code-graph/mcp_server/database/.code-graph-owner.json`. After bootstrap, the active launcher writes `.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json` and probes any recorded PID with `process.kill(pid, 0)`.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:30:- Changing single-writer or stale-reclaim behavior.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:34:One active owner owns the code-graph SQLite writer path; stale owners can be reclaimed only after liveness and heartbeat checks.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:38:In strict mode, `launcherMain()` calls `acquireOwnerLeaseFile()` before bootstrap. If a live owner or permission-unknown owner already holds the lease, the launcher calls `bridgeOrReportLeaseHeld()` instead of starting a second daemon. That path bridges this client's stdio to the owner-recorded IPC socket when the owner answers the deep liveness probe. It prints `LEASE_HELD_BY:<pid>` and exits only when the holder is not bridgeable, such as disabled bridging, no usable socket, bridge refusal or a respawn path that cannot safely take ownership.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:40:If the socket is confirmed dead after the configured probe attempts, `bridgeOrReportLeaseHeld()` can take the respawn path. Respawn reaps the recorded owner child when allowed, clears that owner lease, acquires a new owner lease, rebuilds if needed, writes the PID lease and launches a replacement daemon. If the owner lease changes while waiting, the owner cannot be reaped, respawn is disabled or another launcher wins the new owner lease, the launcher reports `LEASE_HELD_BY:<pid>` with a reason suffix instead.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:42:Only secondary code-index clients are reconnect-protected by the session proxy. The owner session is directly attached to the spawned daemon, so the code-index launcher has no transparent recycle for the owner itself; a new launcher/session must attach after owner-side failure. This is the intentional asymmetry with the spec-memory launcher.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:48:Both lease files live beside the code-graph SQLite database:
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:51:.opencode/skills/system-code-graph/mcp_server/database/.code-graph-owner.json
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:52:.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:55:The owner lease records the process that owns the single-writer path plus the socket route that secondary launchers should prefer:
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:59:  "ownerPid": 12345,
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:66:  "socketPath": "/path/to/daemon-ipc.sock"
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:70:The PID lease remains intentionally small:
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:76:  "socketPath": "/path/to/daemon-ipc.sock"
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:80:The payloads are coordination hints, not durable session state. They do not store in-flight tool calls, replay queues, respawn logs or per-client attachments. `socketPath` can be missing on legacy PID leases; in that case the bridge helper recomputes the expected socket path and reports `no-bridge-socket` if no usable endpoint exists.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:82:Writes are atomic: the launcher writes a process-specific temporary file, then renames it over the final path. Cleanup only removes a lease when it still matches the current owner process, so a disabled parallel launcher cannot cause an older process to delete a newer owner lease.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:93:MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:102:Stale reclaim handles interrupted owners, especially `SIGKILL` or host crashes that prevent normal cleanup.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:104:1. Launcher reads the owner lease.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:105:2. `classifyOwnerLease()` treats dead PIDs, orphaned owners and expired heartbeats as reclaimable.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:106:3. Live or permission-unknown owners go through `bridgeOrReportLeaseHeld()` instead of a second daemon start.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:107:4. After owner-lease acquisition, the launcher checks the PID lease and any legacy PID leases.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:108:5. A dead PID lease logs `staleReclaimed: true`, bootstrap proceeds and the launcher writes a fresh PID lease after bootstrap succeeds.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:110:If the OS has reused the recorded PID for another live process, the launcher treats the lease as held. Remove lease files manually only after verifying no real `mk-code-index-launcher.cjs` owner is running.
.opencode/skills/system-code-graph/references/runtime/launcher_lease.md:116:- `.opencode/bin/mk-code-index-launcher.cjs` owns the owner and PID lease primitives.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:751:        `[structural-indexer] Aborting walk at ${resolve(workspaceRoot, '..', 'outside-warning')}`,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:763:    expect(payload.data.warnings).toContain('[structural-indexer] Aborting walk at outside-warning');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1049:  it('passes the parser content hash into stale checks during incremental scans', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1676:        staleButValidGraphFiles: number;
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1686:    expect(scanPayload.data.staleButValidGraphFiles).toBe(1);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1709:        staleButValidGraphFiles: number;
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1714:    expect(statusPayload.data.staleButValidGraphFiles).toBe(1);
.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts:26:  staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts:217:        { source: 'constitutional', lastUpdated: null, staleness: 'unknown' },
.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts:218:        { source: 'codeGraph', lastUpdated: null, staleness: 'unknown' },
.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts:219:        { source: 'triggered', lastUpdated: null, staleness: 'unknown' },
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:3:description: "Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing."
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:15:Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing.
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:21:- Objective: Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing.
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:22:- Real user request: `Validate that detect_changes refuses stale graph state and asks for code_graph_scan instead of repairing inline.`
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:23:- Operator prompt: `Validate detect_changes against stale graph state in a disposable workspace. Show that it blocks with scan guidance instead of inline indexing, then return PASS/FAIL with diff and JSON evidence.`
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:25:- Expected signals: The stale call returns `status:"blocked"` and says to run `code_graph_scan`. It must not silently repair via inline indexing.
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:27:- Pass/fail: PASS if stale readiness blocks with scan guidance and no inline indexing occurs. FAIL if detect_changes repairs inline, omits the required action or fails to return a structured blocked payload.
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-no-inline-index.md:42:The stale call returns `status:"blocked"` and says to run `code_graph_scan`. It must not silently repair via inline indexing.
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:3:**Release date**: 2026-05-15
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:11:After v1.0.2.0, system-code-graph still had 1 production `.ts` cross-skill import (handlers/query.ts:14) + 87 stale source-level `.js` artifacts + 29 stale `.d.ts` artifacts + 4 test files importing from system-spec-kit. v1.0.3.0 closes every remaining cross-skill production-`.ts` dependency at the import level and proves it via an actual delete-system-spec-kit smoke test.
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:32:#### 87 stale source-level .js + 29 stale .d.ts deleted
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:42:- Need: 7 test files (`tests/code-graph-indexer`, `tests/graph-payload-validator`, `tests/startup-brief`, `stress_test/code-graph/{walker-dos-caps, w10-degraded-readiness-integration}`) imported cross-skill helpers; 2 files (`tests/crash-recovery`, `tests/p0-a-cross-runtime-tempdir-poisoning`) tested system-spec-kit internals from the wrong skill.
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:60:- Why it matters: future maintainers can re-run the smoke test before any release to verify the isolation contract still holds.
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:67:- 29 stale `.d.ts` files deleted at source level (mirrors the .js cleanup; zero external consumers confirmed via grep).
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:79:| `mcp_server/{handlers,lib,tools}/**/*.{js,d.ts,js.map,d.ts.map}` | Deleted | 116 stale source-level compiled artifacts removed (29 each of .js, .js.map, .d.ts.map + 29 .d.ts). |
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:82:| `mcp_server/stress_test/code-graph/{walker-dos-caps, w10-degraded-readiness-integration}.vitest.ts` | Updated | `vi.mock` for the cross-skill helpers. |
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:91:No migration required. If you maintain a fork:
.opencode/skills/system-code-graph/changelog/v1.0.3.0.md:100:- **Source-level `.d.ts` files were retained where they declare types consumed externally** — none in code-graph after this release (all 29 deleted; audit found 0 consumers), but if a future export needs a `.d.ts` shim it should land in `dist/` via tsc, not at source level.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:20:import { closeDb, initDb, upsertFile } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:36:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:57:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/index.ts:27:} from './lib/ipc/socket-server.js';
.opencode/skills/system-code-graph/mcp_server/index.ts:31:} from './lib/ipc/launcher-idle-timeout.js';
.opencode/skills/system-code-graph/mcp_server/index.ts:35:let ownerLeaseRefreshTimer: ReturnType<typeof setInterval> | null = null;
.opencode/skills/system-code-graph/mcp_server/index.ts:36:let ownerLeaseMismatchShutdownStarted = false;
.opencode/skills/system-code-graph/mcp_server/index.ts:39:  if (!ownerLeaseRefreshTimer) return;
.opencode/skills/system-code-graph/mcp_server/index.ts:40:  clearInterval(ownerLeaseRefreshTimer);
.opencode/skills/system-code-graph/mcp_server/index.ts:41:  ownerLeaseRefreshTimer = null;
.opencode/skills/system-code-graph/mcp_server/index.ts:45:  if (ownerLeaseRefreshTimer) return;
.opencode/skills/system-code-graph/mcp_server/index.ts:46:  ownerLeaseRefreshTimer = setInterval(() => {
.opencode/skills/system-code-graph/mcp_server/index.ts:49:      if (!refreshed && !ownerLeaseMismatchShutdownStarted) {
.opencode/skills/system-code-graph/mcp_server/index.ts:50:        ownerLeaseMismatchShutdownStarted = true;
.opencode/skills/system-code-graph/mcp_server/index.ts:51:        void shutdownCodeIndex('owner lease moved to another process').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/index.ts:55:      console.error(`[owner-lease] heartbeat refresh failed: ${message}`);
.opencode/skills/system-code-graph/mcp_server/index.ts:58:  ownerLeaseRefreshTimer.unref();
.opencode/skills/system-code-graph/mcp_server/index.ts:92:let ipcBridge: IpcSocketServerHandle | null = null;
.opencode/skills/system-code-graph/mcp_server/index.ts:106:    if (ipcBridge) {
.opencode/skills/system-code-graph/mcp_server/index.ts:107:      const bridge = ipcBridge;
.opencode/skills/system-code-graph/mcp_server/index.ts:108:      ipcBridge = null;
.opencode/skills/system-code-graph/mcp_server/index.ts:111:        console.error(`[mk-code-index] ipc-bridge close error: ${message}`);
.opencode/skills/system-code-graph/mcp_server/index.ts:149:  ipcBridge = await startIpcSocketServer({
.opencode/skills/system-code-graph/mcp_server/index.ts:150:    socketPath: resolveIpcSocketPath(DATABASE_DIR),
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:3:This first release establishes `system-code-graph` as a standalone skill that owns structural code intelligence. The package was extracted from `system-spec-kit`, given a clean MCP server identity (`mk-code-index`), fully decoupled from spec-kit's source tree, and wired into every install + diagnostic surface so it can be discovered, installed, and repaired the same way as the other MCP servers. The release covers ten public tools (`code_graph_scan/query/context/status/verify/apply`, `detect_changes`, `code_graph_status/reindex/feedback`) reachable through the `mcp__mk_code_index__*` namespace.
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:8:- Change: the package now ships as `.opencode/skills/system-code-graph/` with a private `@spec-kit/system-code-graph` runtime, a dedicated `.opencode/bin/mk-code-index-launcher.cjs`, and a local SQLite graph at `mcp_server/database/code-graph.sqlite`.
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:17:- Why it matters: graph reads are false-safe — when the index is stale, missing, or scope-mismatched, handlers return blocked payloads with a required next action instead of plausible empty answers.
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:23:- Need: spec-kit and code-graph still shared imports across modules, so the two skills could not be released, refactored, or tested independently.
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:58:| `.opencode/bin/mk-code-index-launcher.cjs` | Added | Node launcher with standalone-storage guard, maintainer-mode toggle, and `.env.local` loading. |
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:69:| `.opencode/commands/doctor/mcp.md` | Updated | Help copy + example invocations for `mk_code_index`. |
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:76:No migration required for new installs. Existing configs that still reference `system_code_graph` should rename the entry to `mk_code_index`, point `command`/`args` at `.opencode/bin/mk-code-index-launcher.cjs`, and use `mcp__mk_code_index__*` for all tool references. See `INSTALL_GUIDE.md` §8 Troubleshooting for the full rename steps.
.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:80:**ERRATUM (2026-05-15):** The §Spec-kit decoupling claim above ("zero `from 'system-spec-kit'` imports remain") was incorrect. A verified audit (packet 037, P0-1) found 46 imports across 23 files: 11 production `.ts` + 3 generated `.d.ts` + 5 test + 4 stress-test files, via `@spec-kit/shared` and relative paths. Full decoupling is a future arc (packet 040). The v1.0.1.0 release corrects the documentation.
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts:24:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts:61:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/references/runtime/tool_surface.md:51:The code-graph database currently has no automatic `VACUUM` or checkpoint policy beyond a rollback-path WAL truncate. Deletions and tombstones accumulate; manual maintenance, such as offline `VACUUM` with the daemon stopped, is the only compaction path today.
.opencode/skills/system-code-graph/references/runtime/tool_surface.md:65:| 7 | `code_graph_apply` | Maintenance | Verification-gated recovery: `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply`. Pre/post battery + JSONL audit log. | Hard-stale recovery and ALL destructive operations (`recover-sqlite-corruption`, `rollback-bad-apply`) require `confirm: true` regardless of staleness. `repair-nodes` requires `crashRootCauseAddressed: true`. | 1000 |
.opencode/skills/system-code-graph/references/runtime/tool_surface.md:99:The same 8-tool surface is also reachable through the daemon-backed CLI shim `.opencode/bin/code-index.cjs` (for example `code-index code_graph_status --format json`). The CLI is an additive dual-stack fallback over the same warm daemon, not a replacement for the MCP registration: `--warm-only` probes the daemon socket without cold-spawning, and exit `75` signals retryable daemon/IPC unavailability.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:19:// The test uses the existing isolation seam: `initDb(tempDir)` swaps the
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:25://   A'. Broad-stale (>50 stale)    -> fallbackDecision.nextTool === 'code_graph_scan'
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:65:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:189:   * Without this, the second test in the suite hits a stale cache entry from
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:207:    // Empty isolated DB: initDb creates the schema but inserts zero rows.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:208:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:227:  // Bucket A' - Broad-stale (> SELECTIVE_REINDEX_THRESHOLD stale tracked files)
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:230:  // Per ensure-ready.ts: when stale.length > SELECTIVE_REINDEX_THRESHOLD,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:236:  it('routes broad-stale graphs to code_graph_scan via fallbackDecision', async () => {
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:237:    const tempDir = mkdtempSync(join(tmpdir(), 'cgq-degraded-broad-stale-'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:241:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:243:    // Seed (threshold + 10) tracked files with stale CONTENT (not just mtime)
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:248:    // Hash-on-mtime-drift-before-stale means mtime-only drift no
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:249:    // longer flips a file to stale. The disk content must differ from the
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:250:    // stored content_hash for the staleness signal to fire.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:264:      // hash -> marks the file stale.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:278:      // the path to flow through ensureFreshFiles -> stale.length >
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:321:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:362:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:18:export const codeIndexLauncherPath = join(worktreeRoot, '.opencode/bin/mk-code-index-launcher.cjs');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:37:  ownerPid: number;
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:49:  socketDir: string;
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:81:  const socketDir = mkdtempSync(join(tmpdir(), 'ci-'));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:87:    SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:99:    socketDir,
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:117:      rmSync(socketDir, { recursive: true, force: true });
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:294:  const lease = readOwnerLease(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:295:  expect(lease).not.toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:296:  expect(lease?.ownerPid).toBeGreaterThan(1);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:297:  expect(lease?.canonicalDbDir).toBe(resolve(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:298:  if (lease) {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:299:    recordRuntimePid(runtimePids, lease.ownerPid, ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:301:  return lease as OwnerLeaseData;
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:305:  expect(existsSync(join(dbDir, '.mk-code-index-launcher.lockdir'))).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:306:  expect(existsSync(join(dbDir, '.code-graph-owner.json.lock'))).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:310:  const lease = assertSingleOwnerLease(dbDir, runtimePids);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:311:  process.kill(lease.ownerPid, 'SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:312:  await waitForPidExit(lease.ownerPid, 7_000);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:313:  if (pidIsLive(lease.ownerPid)) {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:314:    process.kill(lease.ownerPid, 'SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:315:    await waitForPidExit(lease.ownerPid, 1_000);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:317:  return lease;
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:326:  const ownerLease = readOwnerLease(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:327:  if (ownerLease) {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:328:    recordRuntimePid(runtimePids, ownerLease.ownerPid, ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:345:  const parsed = readJsonFile(ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:349:    Number.isInteger(candidate.ownerPid) &&
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:370:function ownerLeasePath(dbDir: string): string {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:371:  return join(dbDir, '.code-graph-owner.json');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:375:  return join(dbDir, '.mk-code-index-launcher.json');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:412:        && /mk-code-index-launcher|system-code-graph\/mcp_server\/dist\/index\.js/.test(line);
.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-multi-file-diff.md:67:7. **Stale graph case:** if you can mark the graph stale (e.g., `code_graph_apply({operation:"rescan", dryRun:true})` while a file is dirty in the worktree), re-invoke detect_changes. Expected: `status:"blocked"`, `requiredAction:"code_graph_scan"`, NO `affectedSymbols` returned (hard refuse per readiness invariant).
.opencode/skills/system-code-graph/changelog/v1.1.0.0.md:1:This release lands the system-code-graph portion of the packets 108 plus 110 auto-review uplift program. Four reusable teachings from the upstream `dzianisv/opencode-plugins` auto-review package now apply to both the skill internals and the `mk-code-graph.js` plugin: async file I/O with a closure-scoped lazy-mkdir guard in the user-facing feedback handler, a 4-tier configuration precedence in the plugin, and awaited config loading at module init. The most load-bearing council ruling for this release is that `ccc-feedback.ts` writes must remain AWAITED rather than fire-and-forget — the MCP error-return contract at lines 64 through 72 depends on the disk write completing before the handler returns its result envelope. Every mechanism cleared a 5-of-5 unanimous deep-ai-council review by `cli-codex gpt-5.5 xhigh fast` before any code shipped.
.opencode/skills/system-code-graph/changelog/v1.1.0.0.md:29:Same shape as `mk-skill-advisor.js` v0.3.0: the 4-tier config is loaded as a `configPromise` at module init, and the plugin factory awaits that promise before option normalization. The council's section 10.2 review flagged the race-prone synchronous path on both plugins; both releases ship the awaited fix together.
.opencode/skills/system-code-graph/changelog/v1.1.0.0.md:35:Both packets ran through a 5-seat deep-ai-council deliberation before any source change. The council returned REQUEST-CHANGES on the first pass with HIGH confidence and reshaped scope on three load-bearing points for this skill. First, `ccc-feedback.ts` writes had to remain awaited to preserve the MCP error-return contract — this is the single most important safeguard in this release. Second, no debug-enable gate was applied to `ccc-feedback.ts` because user-facing feedback persistence must always run. Third, the plugin factory had to await the config promise before normalizing options. Implementation followed via `cli-opencode + deepseek-v4-pro --pure`.
.opencode/skills/system-code-graph/changelog/v1.1.0.0.md:53:| `.opencode/plugins/README.md` | Documents the `mk-code-graph` 4-tier precedence, the `MK_CODE_GRAPH_*` env-var fallbacks, and the JSON config file path. Touched in 45c5a7118 alongside the parallel `mk-skill-advisor.js` changes covered in the system-skill-advisor v0.3.0 release. |
.opencode/skills/system-code-graph/changelog/v1.1.0.0.md:61:This release is backward-compatible for every existing user. Operators who passed configuration via `rawOptions` only continue to work — `rawOptions` still wins at the top of the precedence chain. Operators who used environment variables only continue to work — the `MK_CODE_GRAPH_*` variables are additive. Operators who used neither continue to work — the hardcoded defaults are unchanged from v1.0.3.0. The feedback JSONL file format on disk is unchanged; existing files are appended through the new awaited code path without schema changes. The MCP error-return shape is unchanged; callers that handle the existing error envelope continue to work. Source commits: 65e6f0479, 45c5a7118.
.opencode/skills/system-code-graph/changelog/v1.1.0.0.md:67:No migration required. Pick up the new release and the plugin will discover any pre-existing `~/.config/opencode/plugin/mk-code-graph.json` on first invocation. The feedback handler will start using the async write path on the next MCP feedback call.
.opencode/skills/system-code-graph/changelog/v1.2.0.0.md:1:This release lands the system-code-graph portion of the 028 MCP-to-CLI dual-stack program. The `mk_code_index` daemon gains a second front door: `node .opencode/bin/code-index.cjs` exposes the same eight tools as CLI commands over the same daemon the MCP registration uses, with the registration itself unchanged. The release also repairs the `mk-code-graph.js` OpenCode plugin bridge the right way — the earlier in-process import fix was reverted as a direct-DB dual-writer hazard, and the bridge now routes over CLI/IPC with zero in-process database imports. Warm-only hook fallbacks for Claude Code and Codex complete the pairing: a CLI nobody's runtime calls does not close the transport-down incident class.
.opencode/skills/system-code-graph/changelog/v1.2.0.0.md:11:The CLI generates its command map at runtime from the server's tool definitions, so all eight tools — `code_graph_scan/query/context/status/verify/apply` plus `detect_changes` and the rest of the public surface — are CLI commands with no manifest to drift. `list-tools` enumerates them offline; every other command validates arguments against the existing schemas and speaks JSON-RPC `tools/call` over the IPC socket, auto-spawning the daemon via `mk-code-index-launcher.cjs` when the probe fails and spawning is allowed. Exit taxonomy is shared verbatim with the sibling `spec-memory` and `skill-advisor` CLIs: `0` success, `1` runtime error, `64` usage/schema error, `69` protocol/dist mismatch, `75` retryable daemon error.
.opencode/skills/system-code-graph/changelog/v1.2.0.0.md:25:`--warm-only` (default settable via `SPECKIT_CODE_INDEX_CLI_WARM_ONLY`, with `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME` for the prompt path) probes the socket first and exits `75` instead of cold-spawning. The stable shim refuses a missing or stale dist entrypoint with exit `69` rather than running old code; `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1` is the development override.
.opencode/skills/system-code-graph/changelog/v1.2.0.0.md:37:A shared warm-only helper (`code-index-cli-fallback.ts`) wraps the CLI in a socket probe plus `--warm-only --timeout-ms` invocation for the Claude `session-prime` / `compact-inject` / `session-stop` and Codex `session-start` adapters. No socket means a fail-open return in about a millisecond, and the hook result omits the CLI-backed extras rather than blocking the prompt.
.opencode/skills/system-code-graph/changelog/v1.2.0.0.md:48:| `.opencode/bin/code-index.cjs` | New stable shim: socket-dir defaulting, dist-freshness refusal (exit 69), spawn-failure mapping (exit 75) |
.opencode/skills/system-code-graph/changelog/v1.2.0.0.md:74:No migration required. `node .opencode/bin/code-index.cjs list-tools --format text` answers offline. If the shim refuses with exit `69`, rebuild the dist (`tsc -p .opencode/skills/system-code-graph/tsconfig.json`). Pass `--warm-only` in prompt-time contexts so a cold daemon yields exit `75` instead of a cold spawn. The new env flags are documented in system-spec-kit's `mcp_server/ENV_REFERENCE.md`.
.opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:3:description: "Read-only diff preflight that maps unified-diff hunks to indexed symbols and refuses stale or unverifiable graph state."
.opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:18:`detect_changes` maps unified diff hunks to structural symbols through line-range overlap. Its safety property is refusal: stale, empty, error or failed-verification graphs produce `status:"blocked"` instead of false-safe empty impact.
.opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:40:| `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:1-12` | Handler | states the stale-graph hard-refuse invariant |
.opencode/skills/system-code-graph/feature_catalog/03--detect-changes/detect-changes-preflight.md:41:| `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:241-260` | Handler | checks readiness before diff parsing and blocks stale state |
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1185:    const ownerCapture = captureByFqName.get(method.fqName);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1186:    if (!ownerCapture?.parentName) continue;
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1188:    let parentClassCapture = captureByFqName.get(ownerCapture.parentName);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1427:  function walk(currentDir: string, inheritedGitignores: GitignoreContext[], depth: number): void {
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1451:        const warning = `[structural-indexer] Aborting walk after ${FIND_FILES_MAX_NODES} filesystem nodes at ${currentDir}`;
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1469:        walk(fullPath, activeGitignores, depth + 1);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1484:  walk(rootDir, [], 0);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1506:    // Apply the same file-type allowlist the full walk enforces: an incremental
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1507:    // or stale-file reindex must still match an include glob, so excluded types
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1699:      // If an extends target escapes the workspace root, stop walking and keep
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1844:        // Keep walking upward.
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2132:// edges stay durably stale until each importer is edited for its own reasons,
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2289:        const staleFiles = supportedCandidateFiles.filter((file) => isFileStale(file));
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2290:        const storedSymbolIdsByFile = groupStoredSymbolIdsByFile(querySymbolIdsForFiles(staleFiles));
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2294:        for (const file of staleFiles) {
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:5:  - "ownership boundary"
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:7:  - "coverage graph ownership"
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:16:Boundary map for workflow-state ownership in `system-spec-kit` and structural-index ownership in `system-code-graph`.
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:61:- **Readiness state machine** - Freshness states `fresh`, `stale`, `empty`, `error` and `absent` with transition gates.
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:75:- **Shared SQLite file** - Single-writer scan loop in `system-code-graph`. Readers in both skills coordinate through WAL mode on the same database file.
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:83:The boundary emerged from the code-graph extraction migration. That migration covered the initial split, follow-on hardening, and ownership cleanup work without requiring operators to inspect the original spec folders.
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:85:ADR-001 locked the early decisions: stable tool IDs, database move and sibling imports. ADR-002 superseded the original co-resident-MCP question and moved the code graph to a standalone MCP topology. The migration moved 108 code-graph files. Deep-loop and coverage-graph were explicitly excluded from the move.
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:91:The split reflects two different ownership models:
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:103:There are no current plans to migrate deep-loop or coverage-graph to a standalone package. Roadmap notes:
.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:107:- Any change would need its own ADR, packet and migration plan with explicit before-and-after ownership tables.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:10:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:104:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:207:  it('cg-005 stays read-only when tracked files become stale', async () => {
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:208:    const filePath = join(tempRoot, 'src', 'stale.ts');
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:209:    const node = makeNode(filePath, 'staleProbe', 1, 1);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:210:    seedFile('src/stale.ts', 'export function staleProbe() { return 1; }\n', [node]);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:213:    writeFileSync(filePath, 'export function staleProbe() { return 2; }\n', 'utf-8');
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:221:      freshness: 'stale',
.opencode/skills/system-code-graph/changelog/v1.3.0.0.md:1:This release lands the code-graph portion of the 028 dark-flag graduation arc. Two flags graduated on benchmark evidence (the staleness-repair reverse-dependency degree cap and the bitemporal edge writer) and the closed-vocabulary edge governance was cut. The bitemporal writer is the headline: a pre-graduation validation found it built but unwired, the first wiring was then caught broken by a 10-iteration opus deep review with three P0 defects, and the corrected wiring landed an as-of query surface that finally gives the preserved edge history a production reader. Everything except the degree cap lives behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` (default OFF, byte-identical when off). The degree cap reads only inside the force-parse branch.
.opencode/skills/system-code-graph/changelog/v1.3.0.0.md:9:#### The staleness-repair degree cap defaults to 15
.opencode/skills/system-code-graph/changelog/v1.3.0.0.md:11:BEFORE: the staleness-repair reverse-dependency degree cap defaulted to uncapped (0), so a rename of a high-fan-in dependency reparsed every importer. AFTER: a degree-sweep cost benchmark drove the real scan handler across importer counts 5 to 25 and found rebind cost is linear with no knee (about 0.3 to 0.8ms per importer over a 17ms scan floor), so the default is set to 15 on that evidence. That fully repairs the common-to-moderate refactor at negligible cost while bounding the unmeasured 100-plus-importer tail. The hot-hub cost is recorded: above the cap a high-fan-in rename leaves importer edges stale until each is next edited. This cap reads only inside the force-parse branch, so it is not gated by the bitemporal flag.
.opencode/skills/system-code-graph/changelog/v1.3.0.0.md:81:No migration required. The degree cap applies automatically with a default of 15. To preserve and read edge history, set `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` and pass an `asOf` generation to `code_graph_query` for historical reads. The flag and the degree-cap default are documented in system-spec-kit's `mcp_server/ENV_REFERENCE.md`.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:2:import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:19:const launcherRelativePath = '.opencode/bin/mk-code-index-launcher.cjs';
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:21:  '.opencode/bin/lib/launcher-ipc-bridge.cjs',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:24:const pidFileRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json';
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:25:const ownerLeaseRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-owner.json';
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:31:  emitLeaseMetric: (leaseClass: string, details?: Record<string, unknown>) => void;
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:32:  leaseMetricClassForTransition: (transition: string) => string;
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:33:  leaseMetricCounterName: (leaseClass: string) => string;
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:37:  const root = mkdtempSync(join(tmpdir(), 'mk-code-index-lease-'));
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:42:  copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:46:    copyFileSync(join(repoRoot, relativePath), destination);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:152:    const parsed = JSON.parse(readFileSync(join(root, ownerLeaseRelativePath), 'utf8')) as { ownerPid?: unknown };
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:153:    return typeof parsed.ownerPid === 'number' ? parsed.ownerPid : null;
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:161:  await waitFor(() => readLeasePid(pidFilePath) === pid, 2000, `lease pid ${pid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:195:describe('mk-code-index launcher lease', () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:209:  it('classifies lease metric transitions and emits through a no-op-default sink', () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:210:    expect(launcherModule.leaseMetricClassForTransition('heldByOther')).toBe('held-by-other');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:211:    expect(launcherModule.leaseMetricClassForTransition('bridgedSecondary')).toBe('bridged-secondary');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:212:    expect(launcherModule.leaseMetricClassForTransition('staleReclaimed')).toBe('stale-reclaimed');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:213:    expect(launcherModule.leaseMetricClassForTransition('respawned')).toBe('respawned');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:214:    expect(launcherModule.leaseMetricCounterName('stale-reclaimed')).toBe('mk_code_index_lease_stale_reclaimed_total');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:216:    launcherModule.emitLeaseMetric('held-by-other', { ownerPid: 123 });
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:219:    launcherModule.emitLeaseMetric('bridged-secondary', { ownerPid: 456, reason: 'bridge' });
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:223:      counter: 'mk_code_index_lease_bridged_secondary_total',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:226:      ownerPid: 456,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:232:  it('exits with LEASE_HELD_BY when a live owner exists', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:240:    const ownerPid = readOwnerLeasePid(workspace.root);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:243:    expect(ownerPid).not.toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:244:    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:245:    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${ownerPid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:248:  it('lets exactly one concurrent launcher own the lease', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:253:    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 2000, 'owner lease');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:257:      'one launcher to report lease held',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:260:    const ownerPid = readOwnerLeasePid(workspace.root);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:265:    expect(ownerPid).not.toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:270:  // Live-owner diagnostics include the recorded startedAt value.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:271:  it('reports the lease startedAt value for a live owner', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:296:  // The launcher lease follows the resolved code-graph DB directory.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:300:    const pidFilePath = join(dbDir, '.mk-code-index-launcher.json');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:323:    expect(existsSync(join(outsideDbDir, '.mk-code-index-launcher.json'))).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:336:  // Dead-PID lease files are reclaimable.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:337:  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:343:    await waitFor(() => /^.*staleReclaimed: true\b/m.test(run.stderr), 2000, 'stale reclaim log');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:344:    expect(run.stderr).toMatch(/^.*staleReclaimed: true\b/m);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:350:  // Two concurrent launchers migrating a former-location DB into the same target must
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:352:  // migrates, and the target byte-content stays stable. Fails against the un-fixed code, which
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:353:  // ran the migration before any lock with a plain copyFileSync (no COPYFILE_EXCL) — letting both
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:354:  // launchers copy and a lagging copier overwrite the now-live target.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:355:  it('migrates a former-location DB exactly once under two concurrent launchers', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:359:    // lease there, so formerLocationOwnerLive() is false and migration is allowed). The content
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:360:    // is a fixed, recognizable payload so we can assert byte-stability of the migrated target.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:377:    // Spawn two launchers simultaneously; both will attempt migration in the un-fixed code.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:381:    // Wait for an owner to be recorded and for one launcher to report lease-held (the loser).
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:382:    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 4000, 'owner lease');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:383:    await waitFor(() => existsSync(targetSqlite), 4000, 'migrated target DB');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:391:      'one launcher to settle (lease held)',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:394:    // Snapshot the migrated target, then let everything settle and re-read: a lagging copier in
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:400:    // The migrated DB must equal the seeded source and never change (byte-stability).
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:405:    // Exactly one migration occurred across both launchers. The un-fixed code (no lock gate,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:406:    // no COPYFILE_EXCL) can log this line twice; the fix gates migration on the single
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:408:    const migrationLines = (first.stderr + second.stderr).match(/migrated DB from/g) ?? [];
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:409:    expect(migrationLines).toHaveLength(1);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:411:    // Exactly one launcher owns the lease; the other bridges/reports.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:412:    const ownerPid = readOwnerLeasePid(workspace.root);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:413:    expect(ownerPid).not.toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:416:  it('reclaims a stale-heartbeat owner lease with a live PID', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:419:    const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:420:    const dbDir = dirname(ownerLeasePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:424:      writeFileSync(ownerLeasePath, JSON.stringify({
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:425:        ownerPid: holder.pid,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:435:      await waitFor(() => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(run.stderr), 2000, 'stale-heartbeat owner reclaim log');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:438:      expect(run.stderr).toContain(`ownerLeaseReclaimed: stale-heartbeat-reclaim ownerPid=${holder.pid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:450:  // Two launchers reclaiming the SAME pre-existing stale-heartbeat owner lease at once.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:451:  // Both read the identical stale lease and BOTH enter acquireOwnerLeaseFile's reclaim branch
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:454:  // fresh-create path. This test seeds a stale-heartbeat owner lease owned by a LIVE helper pid
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:455:  // (so classifyOwnerLease returns 'stale-heartbeat-reclaim') and spawns two launchers at once so
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:456:  // both observe the same existing stale lease and both run the reclaim branch concurrently —
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:464:  // lease, and the re-read-before-unlink guard in clearOwnerLeaseFile. The acquire-time
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:470:  // daemon-parent, one bridged-and-waiting); and (2) when both launchers pass the owner-lease gate,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:471:  // the downstream PID-lease write is last-writer-wins, so the recorded PID lease can legitimately
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:474:  // migration-block scenario.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:477:  // both concurrent launchers exercise the stale-heartbeat reclaim branch (new coverage — the
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:479:  // neither launcher errors/crashes in that path, and the seeded stale holder is reclaimed away —
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:480:  // it never remains the recorded owner once both launchers have reclaimed.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:481:  it('exercises the concurrent stale-heartbeat reclaim branch in both launchers without errors', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:486:      const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:487:      const dbDir = dirname(ownerLeasePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:490:        // Seed a stale-heartbeat owner lease owned by a LIVE helper pid so classifyOwnerLease
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:491:        // returns 'stale-heartbeat-reclaim' (live pid + heartbeat older than 2*ttlMs), forcing
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:494:        writeFileSync(ownerLeasePath, JSON.stringify({
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:495:          ownerPid: holder.pid,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:504:        // Spawn both simultaneously so both observe the SAME existing stale lease and both enter
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:509:        // BOTH must observe the stale lease and run the reclaim branch — the precondition that
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:512:          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(first.stderr),
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:514:          `first launcher stale-heartbeat reclaim (round ${round})`,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:517:          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(second.stderr),
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:519:          `second launcher stale-heartbeat reclaim (round ${round})`,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:522:        // The reclaim must actually take effect: the seeded stale holder is gone from the recorded
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:523:        // owner lease (a launcher reclaimed it). Once a launcher has reclaimed, the holder must
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:524:        // never remain the owner. This is deterministically true (the holder lease is stale).
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:528:          `seeded stale holder to be reclaimed out of the owner lease (round ${round})`,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:532:        // either elects an owner or bridges; it must never raise an error.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:534:          /^\[mk-code-index-launcher\] failed:/m.test(run.stderr) || run.child.exitCode === 1;
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:538:        // And the stale holder never re-asserts ownership after the reclaim.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:539:        expect(readOwnerLeasePid(workspace.root), `seeded stale holder must not own the lease (round ${round})`).not.toBe(holder.pid);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:555:  // Clean child exit removes the lease file.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:567:  // SIGQUIT follows the same lease cleanup path.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:579:  // Live legacy launcher lease blocks rolling-start duplicates.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:580:  it('reports LEASE_HELD_BY from the legacy launcher lease path', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:590:      '.mk-code-index-launcher.json',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:637:    expect(second.stderr).toContain('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
.opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:20: * Resolve the project root by walking up from this module's directory until
.opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:25: * walk one level too early. The stray contains only `skill/`, not `specs/`,
.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md:36:`.opencode/bin/code-index.cjs` defaults the socket dir to `/tmp/mk-code-index`, refuses missing or stale dist with exit 69 (`SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1` is the development override), and maps spawn failure to 75. The entrypoint shares the program taxonomy: 0 success, 1 runtime, 64 usage/validation (including JSON-RPC `-32602`), 69 protocol, 75 retryable. `--warm-only` (default via `SPECKIT_CODE_INDEX_CLI_WARM_ONLY`) probes the socket and exits 75 instead of auto-spawning.
.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md:44:| `.opencode/bin/code-index.cjs` | Script | Stable shim: socket-dir defaulting, dist-freshness refusal, spawn-failure mapping |
.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md:54:| `mcp_server/tests/code-index-cli-blocked-read.vitest.ts` | Automated test | Nine stale-readiness cases asserting `status:blocked` plus `requiredAction` |
.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md:56:| `mcp_server/tests/code-index-cli-owner-respawn.vitest.ts` | Automated test | Real owner-lease read and fresh-launcher takeover |
.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md:58:| `mcp_server/tests/code-index-cli-harness.ts` | Test harness | Sandboxed socket/DB environment shared by the suites |
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:2:title: "005 code_graph_verify blocked on stale"
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:3:description: "Prove code_graph_verify refuses stale graph state before executing the gold battery."
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:6:  - "code graph verify blocked on stale"
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:11:# 005 code_graph_verify blocked on stale
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:15:Prove code_graph_verify refuses stale graph state before executing the gold battery.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:21:- Objective: Prove code_graph_verify refuses stale graph state before executing the gold battery.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:22:- Real user request: `Confirm code_graph_verify blocks on stale graph state, then passes through to verification after an explicit rescan.`
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:23:- Operator prompt: `Validate code_graph_verify around stale graph state. Show the blocked payload before rescan and the verification payload after explicit scan, then return PASS/FAIL.`
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:26:- Desired user-visible outcome: A concise verdict explaining whether verify protects against stale input and resumes after scan.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:27:- Pass/fail: PASS if stale verify blocks and post-scan verify returns ok with pass-rate data. FAIL if verify runs on stale state, remains blocked after rescan or omits readiness/pass-rate fields.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md:50:Run with `allowInlineIndex:true` and a single stale file to test the selective repair option.
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:36:export type ApplyStalenessState = 'fresh' | 'soft-stale' | 'hard-stale';
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:47:  staleFiles?: string[];
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:48:  staleFileCount?: number;
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:171:  const staleFileCount = input.staleFileCount ?? input.staleFiles?.length ?? 0;
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:190:  if (staleFileCount > 50) {
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:191:    reasons.push(`${staleFileCount} stale files exceed soft-stale boundary`);
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:205:      state: 'hard-stale',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:222:    input.freshness === 'stale'
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:223:    && staleFileCount <= 50
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:227:      state: 'soft-stale',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:228:      reasons: staleFileCount > 0 ? [`${staleFileCount} stale file(s)`] : ['soft stale readiness action'],
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:235:    state: 'hard-stale',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:236:    reasons: [`unclassified stale state: freshness=${input.freshness ?? 'unknown'}`],
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:405:      // Triage only: report the stale parser_skip_list candidates so an
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:484:  if (classification.state === 'hard-stale' && args.confirm !== true) {
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:487:      reason: 'hard-stale requires confirm=true',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:496:      message: 'Hard-stale recovery requires confirm=true before mutation.',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:526:  // require explicit confirmation REGARDLESS of staleness classification.
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:727:    freshness: input.freshness === 'fresh' || input.freshness === 'stale' || input.freshness === 'empty' || input.freshness === 'error'
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/code-graph-scan.md:19:The reindex writer is bitemporal. When the default-off `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` flag is on, a reindex closes superseded edges by stamping `invalid_at` at the next graph generation instead of deleting them, so prior generations stay readable through the as-of readers. With the flag off the writer keeps its delete-and-replace behavior. The default-off `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` flag enables the staleness-repair reverse-dependency expansion: when a stale file's reindex changes its symbol identity, every importer of that file is pulled back into the parse batch so cross-file edges rebind to the new symbol ids. That expansion is bounded by the `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` degree cap, default 15: a renamed hot dependency whose importer fan-in degree exceeds the cap drops out of the force-parse set and its importers rebind lazily on their next edit. A cap of zero leaves every refactored dependency in, byte-identical to the uncapped path, and the cap reads only inside the force-parse branch, so it has no effect while the force-parse flag is off.
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/code-graph-scan.md:46:| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Library | bitemporal close-and-insert reindex writer that stamps `invalid_at` on superseded edges under the bitemporal-reads flag, plus the governance-vocabulary edge-type `CHECK` migration gated by `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` |
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/ensure-code-graph-ready.md:3:description: "Shared readiness helper that detects empty, stale, full-scan and selective-reindex states and can run bounded selective repair on read paths."
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/ensure-code-graph-ready.md:39:| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:141-225` | Library | detects empty, stale, full-scan and selective-reindex states |
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/ensure-code-graph-ready.md:41:| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:398-421` | Library | runs selective reindex for stale tracked files |
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/ensure-code-graph-ready.md:42:| `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:272-287` | Library | stages persistence so failed writes leave files stale for retry |
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:8:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:6:// drift) flips freshness to stale + full_scan even if individual mtimes
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:17:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:49:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:97:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:140:  it('blocks selective refresh when a HEAD-drift full scan has only a partial stale-file set', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:143:      staleFiles: ['src/changed.ts'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:151:  it('allows selective refresh only for a bounded stale-file full-scan fallback', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:154:      staleFiles: ['src/changed.ts'],
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/query-self-heal.md:32:When stale files exceed the selective threshold or Git HEAD changed, query blocks and tells the operator to run `code_graph_scan`. Use `rg` when readiness crashes or the graph is unavailable.
.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/query-self-heal.md:69:- [../../manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md](../../manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md)
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:24:// The walk below touches no fs APIs, so it is safe under those mocks. An absolute
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:102:  if (freshness === 'stale') return 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:109:  if (freshness === 'stale') return 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:153:  if (args.stats && (args.graphState === 'ready' || args.graphState === 'stale')) {
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:155:      args.graphState === 'ready' ? 'healthy' : 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:159:      `(${describeLastScan(args.stats.lastScanTimestamp)}${args.graphState === 'stale' ? '; first structural read may refresh inline' : ''})`,
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:192:  if (stats && (markerBase.graphState === 'ready' || markerBase.graphState === 'stale')) {
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:195:    if (markerBase.graphFreshness === 'stale') {
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:196:      lines.push(`Freshness: stale - ${markerBase.readiness.reason}`);
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-scan-full.md:24:- Expected execution process: Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy and inspect the returned payload.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-scan-full.md:35:Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy.
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:117:    // 'missing'/'empty' no longer collapse to 'stale' — they map to 'absent'.
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:122:  it('reports stale graph state when freshness detection says stale even with graph counts present', () => {
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:124:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:130:    expect(brief.graphState).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:131:    expect(brief.graphOutline).toContain('Freshness: stale');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:132:    expect(brief.startupSurface).toContain('- Code Graph: stale');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:135:    expect(brief.sharedPayload?.provenance.trustState).toBe('stale');
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/code-graph-status.md:17:`code_graph_status` reports graph health and readiness. It uses a read-only readiness snapshot so status calls do not repair stale state.
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/code-graph-status.md:35:Status can recommend `rg` or `code_graph_scan`. It does not perform either. Treat stale status as an operator prompt, not repair proof.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:56:type DetectorMode = 'stale' | 'missed' | 'bloat';
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:124:  staleFiles: string[];
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:129:  const source = input.mode === 'stale'
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:130:    ? input.staleFiles
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:252:    (['stale', 'missed', 'bloat'] as DetectorMode[]).map(mode => ({ ...fixture, mode }))
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:258:      staleFiles: [path],
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:272:      staleFiles: filesOnDisk,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:280:      staleFiles: filesOnDisk,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:307:      staleFiles: filesOnDisk,
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:4:// The warm-only IPC client must refuse to probe/connect under a socket directory
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:6:// must reject a symlinked socket node — otherwise a pre-planted fake daemon on a
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:17:const SOCKET_FILE_NAME = 'daemon-ipc.sock';
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:33:describe('code-index CLI socket perimeter', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:34:  it('accepts a private directory owned by the current user with no socket node', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:36:    const socketDir = join(root, 'ipc');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:37:    mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:39:    expect(() => __testing.assertSocketPerimeter(socketDir)).not.toThrow();
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:42:  it('rejects a symlinked socket directory', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:52:  it('rejects a group/world-writable socket directory', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:54:    const socketDir = join(root, 'ipc');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:55:    mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:56:    chmodSync(socketDir, 0o777);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:58:    expect(() => __testing.assertSocketPerimeter(socketDir)).toThrow(/group\/world-writable/i);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:61:  it('rejects a symlinked socket node inside an owned directory', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:63:    const socketDir = join(root, 'ipc');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:64:    mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:67:    symlinkSync(decoy, join(socketDir, SOCKET_FILE_NAME));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-socket-perimeter.vitest.ts:69:    expect(() => __testing.assertSocketPerimeter(socketDir)).toThrow(/symlink/i);
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:47:Shared readiness helper that detects empty, stale, full-scan and selective-reindex states and can run bounded selective repair on read paths. Called by query, context and verification surfaces as the read-path gate.
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:67:Half-auto (class: half). Self-heal runs only inside a requested `code_graph_query` call. When stale files exceed the selective threshold or Git HEAD changed, query blocks and tells the operator to run `code_graph_scan`.
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:97:Diagnostic verification gate that runs the persisted gold-query battery against the current graph. Blocks on stale readiness and executes only when fresh.
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:101:Manual (class: manual). Runs as an explicit MCP maintenance call or optional verification inside a full `code_graph_scan`. The handler refuses stale graphs.
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:117:Manual diagnostic (class: manual). Uses a read-only readiness snapshot so status calls do not repair stale state. Does not perform scans, only reports current state.
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:131:Read-only diff preflight that maps unified-diff hunks to indexed symbols through line-range overlap. Refuses stale, empty, error or failed-verification graphs with `status:"blocked"` instead of false-safe empty impact.
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:271:Manual (class: manual). The shim guards stale dist with exit 69 (`SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1` overrides in development) and defaults the socket dir to `/tmp/mk-code-index`. The entrypoint validates argv with `validateToolArgs()` parity plus schema-driven numeric/boolean coercion (unparseable values exit 64; range clamping stays handler-owned), preserves `status:"blocked"` readiness refusals as actionable exit-0 answers with `requiredAction` in JSON and text renderings, auto-spawns over IPC unless `--warm-only` (exit 75 when the backend is unavailable), and maps exits to the shared 0/1/64/69/75 taxonomy.
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts:14:  it('serves MCP and CLI clients through one isolated daemon lease', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts:28:    expect(harness.assertSingleOwnerLease().ownerPid).toBe(warmupLease.ownerPid);
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/code-graph-verify.md:3:description: "Manual gold-query verification tool that blocks on stale readiness and executes the persisted code-graph battery only when fresh."
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/code-graph-verify.md:31:The handler refuses stale graphs. Run `code_graph_scan({ incremental:false })` before verification when blocked.
.opencode/skills/system-code-graph/feature_catalog/02--manual-scan-verify-status/code-graph-verify.md:60:- [../../manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md](../../manual_testing_playbook/02--manual-scan-verify-status/code-graph-verify-blocked-on-stale.md)
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:75: * Maximum stale files before we switch from selective to full reindex.
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:190:// time would require a filesystem walk of the include globs, which the read
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:191:// path deliberately avoids (NFR-P01: no FS walk on the read path). Brand-new
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:193:// which walks the include globs itself.
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:309: * Bounded compare: no filesystem walk happens here — we use the same
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:313: * set (or removes tracked files) flips to stale even when per-file mtimes look
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:316: * they are indexed by the next full `code_graph_scan` (which walks the globs).
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:397:  staleFiles: string[];
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:406:    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'graph is empty (0 nodes)' };
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:421:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:423:      staleFiles: [],
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:441:    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'no tracked files in code_files table' };
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:454:  const { stale } = ensureFreshFiles(existingFiles);
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:458:  // baseline, flip to stale + full_scan even when individual mtimes look fine.
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:461:  if (stale.length === 0) {
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:464:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:466:        staleFiles: [],
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:476:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:478:        staleFiles: [],
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:486:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:488:        staleFiles: [],
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:499:    return { freshness: 'fresh', action: 'none', staleFiles: [], deletedFiles: [], reason: 'all tracked files are up-to-date' };
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:502:  // Too many stale files => full scan is more efficient
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:503:  if (stale.length > SELECTIVE_REINDEX_THRESHOLD) {
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:505:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:507:      staleFiles: stale,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:511:        `${stale.length} stale files exceed selective threshold (${SELECTIVE_REINDEX_THRESHOLD})`,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:518:    freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:520:    staleFiles: stale,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:524:      `${stale.length} file(s) have newer mtime than indexed_at`,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:530:type ReadinessStateForSelectiveRefresh = Pick<ReturnType<typeof detectState>, 'action' | 'staleFiles' | 'reason'>;
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:536:    || reason.includes('stale files exceed selective threshold');
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:546:    && state.staleFiles.length > 0
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:547:    && state.staleFiles.length <= SELECTIVE_REINDEX_THRESHOLD
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:581:        // Best-effort: skip files that fail to persist.  File remains stale
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:611: * mtime so persistence failures leave the file stale for retry.
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:686:      ...(state.action === 'selective_reindex' ? { files: state.staleFiles } : {}),
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:702:  // (evaluateGuardedFullScan) still protects POPULATED/stale graphs from unsafe
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:745:      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS, { specificFiles: state.staleFiles });
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:763:        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:795:        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:806:    // selective_reindex: only re-parse stale files
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:807:    if (state.action === 'selective_reindex' && state.staleFiles.length > 0) {
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:810:      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS, { specificFiles: state.staleFiles });
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:830:        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:846:      files: state.staleFiles,
.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts:23:// Note: ensure-ready.ts maintains its own internal copy of this
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts:36:    // daemon/socket interaction, so this runs fully offline. The dev override
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts:38:    const socketDir = mkdtempSync(join(tmpdir(), 'ci-parity-'));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts:48:            SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts:65:      rmSync(socketDir, { recursive: true, force: true });
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:3:description: "Verify status reads readiness and graph quality without mutating or repairing stale state."
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:15:Verify status reads readiness and graph quality without mutating or repairing stale state.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:21:- Objective: Verify status reads readiness and graph quality without mutating or repairing stale state.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:22:- Real user request: `Inspect code_graph_status around a stale-file fixture and confirm it reports diagnostics without repairing the graph.`
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:23:- Operator prompt: `Inspect code_graph_status around a stale-file fixture. Show readiness and graph-quality diagnostics without repair or scan mutation, then return PASS/FAIL with before-and-after evidence.`
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:24:- Expected execution process: Capture `code_graph_status({})` twice around a stale-file fixture, compare `lastPersistedAt`, readiness and scan counts and confirm no `code_graph_scan` was invoked.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:25:- Expected signals: Status returns diagnostic fields including `freshness`, `readiness`, `canonicalReadiness`, `trustState`, `graphQualitySummary` and, when tombstone auditing is enabled, tombstone retained counts by kind/reason plus recent retained tombstones. It does not repair stale state.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:27:- Pass/fail: PASS if status reports diagnostics without changing persistence or scan evidence and exposes tombstone audit status under the explicit flag. FAIL if it repairs stale state, invokes scan, omits readiness or graph-quality diagnostics, or leaks tombstone state into live graph query results.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:35:1. Capture `code_graph_status({})` twice around a stale-file fixture.
.opencode/skills/system-code-graph/manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md:42:Status returns diagnostic fields including `freshness`, `readiness`, `canonicalReadiness`, `trustState` and `graphQualitySummary`, but does not repair stale state. With tombstone auditing enabled, the status payload also includes retained deletion-lineage counts and recent retained tombstones; with the flag unset, the default path remains compact and audit-free.
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:42:  it('maps "stale" → "stale" (pre-refactor parity)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:43:    expect(canonicalReadinessFromFreshness('stale')).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:65:  it('maps "stale" → "stale" (pre-refactor parity)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:66:    expect(queryTrustStateFromFreshness('stale')).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:87:      'stale',
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:97:    for (const freshness of ['fresh', 'stale', 'empty', 'error'] as const) {
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:128:  it('returns the detectorProvenance envelope when stale (stale graphs still carry provenance)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:130:    expect(buildQueryGraphMetadata(makeReadiness('stale'))).toEqual({
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:138:  // BEFORE the db call to avoid surfacing stale or partial provenance from
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:163:  it('augments the block with canonicalReadiness + trustState fields (stale)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:164:    const block = buildReadinessBlock(makeReadiness('stale'));
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:165:    expect(block.canonicalReadiness).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/readiness-contract.vitest.ts:166:    expect(block.trustState).toBe('stale');
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:3:description: "Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior."
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:15:Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:21:- Objective: Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:22:- Real user request: `Validate that code_graph can repair a single stale tracked file without triggering an unrequested full scan.`
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:23:- Operator prompt: `Validate selective code-graph readiness in a disposable workspace. Show that one stale tracked file repairs without an unrequested full scan and return PASS/FAIL with command evidence and JSON excerpts.`
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:26:- Desired user-visible outcome: A concise verdict explaining whether selective reindex repaired the stale file without broad scan behavior.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:27:- Pass/fail: PASS if the stale file is repaired and no hidden full scan appears. FAIL if the call blocks unexpectedly, performs an unrequested full scan or omits readiness evidence.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md:35:1. Create a disposable copy and run `code_graph_scan({"rootDir":"$WORK","incremental":false})`.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:18:import { closeDb, initDb } from '../../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:149:/** Schema version for migration tracking */
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:795:  context: string = 'code-edge bitemporal migration',
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:797:  const migrate = database.transaction(() => {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:808:  migrate();
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:907:  const copyColumns = [
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:917:  const columnSql = copyColumns.join(', ');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:940:  context: string = 'code-edge governance vocabulary migration',
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:942:  const migrate = database.transaction(() => {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:949:  migrate();
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1020:  ensureCodeEdgeBitemporalSchema(database, 'code-edge bitemporal migration');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1022:    ensureCodeEdgeGovernanceVocabSchema(database, 'code-edge governance vocabulary migration');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027:export function initDb(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1038:    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1063:  if (!db) initDb(DATABASE_DIR);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1064:  // initDb either assigns the singleton database or throws before this return.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1370: * flagging the file as stale until nodes + edges have landed.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1510:        // path, so it owns the old symbol ids and is where a stale edge actually
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1710:  // Hash content on mtime drift before declaring stale. A touch
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1719:/** Batch stale check for a set of file paths */
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1721:  readonly stale: string[];
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1728:    return { stale: [], fresh: [] };
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1740:  const stale: string[] = [];
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1747:      stale.push(filePath);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1751:      stale.push(filePath);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1754:    // Hash on mtime drift before declaring stale. Touch-only
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1756:    // changes flip the file to stale.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1759:      stale.push(filePath);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1765:  return { stale, fresh };
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:57:const softStale = async () => ({ freshness: 'stale', staleFileCount: 1, action: 'selective_reindex' });
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:9:// ('fresh'|'stale'|'empty'|'error') onto:
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:11://      vocabulary ('ready'|'stale'|'missing') used by
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:14://      ('live'|'stale'|'absent'|'unavailable' subset of the 8-state canonical).
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:20:// (live|stale|absent|unavailable) because ensure-ready knows about
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:62: *   'stale' → 'stale'
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:74:    case 'stale':
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:75:      return 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:89: * masquerade as 'stale'.
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:93: *   'stale' → 'stale'
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:99: * subset (live | stale | absent | unavailable) matching the widened
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:109:    case 'stale':
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:110:      return 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:136:  // stale or partial provenance from an unreachable store.
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:166:    case 'stale':
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:173:          freshnessAuthority: 'stale',
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:228: *     (`ready|stale|missing`), aligned with session_bootstrap /
.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:231: *     (`live|stale|absent` subset of the canonical 8-state type).
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts:8:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:7:import { closeDb, initDb, replaceNodes, setCodeGraphScope, upsertFile } from '../../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:83:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:126:  it('cg-006 blocks stale graphs before parsing or attribution can report false-safe empties', async () => {
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:127:    const { filePath } = seedIndexedFile('src/stale.ts', 4);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:131:      diff: makeDiff('src/stale.ts', [1]),
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:140:      freshness: 'stale',
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:2:title: "002 query self-heal stale file"
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:6:  - "query self heal stale file"
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:11:# 002 query self-heal stale file
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:22:- Real user request: `Check that code_graph_query self-heals a single stale file but refuses broad stale state until an explicit scan runs.`
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:23:- Operator prompt: `Validate code_graph_query against single-file and broad stale states in a disposable workspace. Show the self-heal and blocked-scan paths, then return PASS/FAIL with JSON excerpts.`
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:24:- Expected execution process: Run a full scan in a disposable copy, modify one tracked file and call `code_graph_query` for outline, then modify more than 50 tracked files and call `code_graph_query` again.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:25:- Expected signals: Single-file stale state is repaired or answered with readiness metadata. Broad stale state returns a blocked payload with `requiredAction:"code_graph_scan"` or equivalent fallback decision.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:26:- Desired user-visible outcome: A concise verdict distinguishing the allowed self-heal path from the blocked broad-stale path.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:27:- Pass/fail: PASS if single-file stale state self-heals and broad stale state blocks with scan guidance. FAIL if broad state is silently repaired, single-file readiness metadata is missing or the handler crashes.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:35:1. Run a full scan in a disposable copy.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:41:Single-file stale state is repaired or answered with readiness metadata. Broad stale state returns a blocked payload with `requiredAction:"code_graph_scan"` or equivalent fallback decision.
.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md:49:Run the same broad stale fixture through `code_graph_context` to compare blocked envelope parity.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/mcp-json-server-key-rename.md:25:- Expected signals: mcpServers contains mk_code_index key. mk_code_index command is `node` and args includes `.opencode/bin/mk-code-index-launcher.cjs`. Key system_code_graph does NOT exist.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/mcp-json-server-key-rename.md:38:4. Verify `mk_code_index.command` is `node` and args includes `mk-code-index-launcher.cjs`.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/mcp-json-server-key-rename.md:42:mk_code_index key present, system_code_graph absent, command points to node, args points to mk-code-index-launcher.cjs.
.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/code-graph-query-blast-radius.md:79:6. **Readiness refusal:** if you can artificially mark the graph stale (e.g., touch a file mtime), repeat step 1. Expected: `status:"blocked"`, `requiredAction:"code_graph_scan"`, NO affectedFiles returned (hard refuse, not soft degrade per the readiness invariant in architecture.md §6).
.opencode/skills/system-code-graph/manual_testing_playbook/04--context-retrieval/code-graph-context-readiness-block.md:22:- Real user request: `Check that code_graph_context blocks broad stale state and returns readiness metadata instead of omitting graph-safety details.`
.opencode/skills/system-code-graph/manual_testing_playbook/04--context-retrieval/code-graph-context-readiness-block.md:23:- Operator prompt: `Validate code_graph_context against broad stale state in a disposable workspace. Show the blocked payload, graph omission and readiness metadata, then return PASS/FAIL.`
.opencode/skills/system-code-graph/manual_testing_playbook/04--context-retrieval/code-graph-context-readiness-block.md:27:- Pass/fail: PASS if broad stale state blocks with graph omission and readiness metadata. FAIL if context answers stale graph data, omits `requiredAction` or drops readiness/trust fields.
.opencode/skills/system-code-graph/manual_testing_playbook/04--context-retrieval/code-graph-context-readiness-block.md:49:Call with a single stale file and verify selective self-heal mirrors query behavior.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts:4:// Exercises filesystem walker safety caps for large ignores and deep specs.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts:23:  const tempRoot = mkdtempSync(join(tmpdir(), 'walker-dos-'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts:52:describe('walker DoS caps', () => {
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md:25:- Exercises walker caps and doctor apply-mode policy in disposable temp workspaces.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md:44:+-- walker-dos-caps.vitest.ts
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md:61:| `walker-dos-caps.vitest.ts` | Verifies traversal cap behavior under pressure. |
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md:77:large, stale or adversarial fixture
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md:93:| `walker-dos-caps.vitest.ts` | Test file | Traversal cap coverage. |
.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/code-index-cli-fallback-surface.md:11:This scenario validates the 028 CLI fallback for the mk-code-index server. `node .opencode/bin/code-index.cjs` exposes the same 8 tools as the `mcp__mk_code_index__*` registration via a manifest generated from `CODE_GRAPH_TOOL_SCHEMAS`, with the shared exit taxonomy 0/1/64/69/75. The check runs entirely against a sandboxed socket directory plus the shipped sandboxed suites, so host daemons are never contacted.
.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/code-index-cli-fallback-surface.md:52:- `warm-only exit=75` with no daemon spawned and no socket created in the sandbox.
.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/code-index-cli-fallback-surface.md:54:- The blocked-read suite passes its nine stale-readiness cases (`status:blocked` plus `requiredAction`, exit 0).
.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/code-index-cli-fallback-surface.md:82:| `.opencode/bin/code-index.cjs` | Stable shim with dist-freshness and socket guards |
.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/tool-call-shape-validation.md:24:- Expected execution process: Call `code_graph_query` with missing `subject`, call `code_graph_query` with missing `operation`, and call `detect_changes` with missing `diff`. (Notes: `code_graph_verify` has no required `rating` field in the current schema, and `code_graph_apply` deliberately declares no required fields — a bare apply routes to staleness-based re-scan by design — so neither is a valid missing-field target.)
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:5:// WASM grammars. Cursor-based AST walk extracts RawCapture[]
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:147:// itself (Node module resolution) rather than a relative `../../` walk.
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:610:// ── AST walk to RawCapture[] ───────────────────────────────────
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:612:function walkAST(
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:825:        const captures = walkAST(rootNode, language, lines);
.opencode/skills/system-code-graph/mcp_server/lib/index.ts:9:export * from './owner-lease.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:351:    it('returns blocked probes when outline queries report a stale graph', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:356:          reason: 'graph is stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:362:      expect(result.unexpectedErrors).toEqual(['verify-1: graph is stale']);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:370:          reason: 'graph is stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:377:    it('returns blocked when the graph is stale', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:379:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:391:          freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:395:          canonicalReadiness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:396:          trustState: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:614:      // because dist is one level deeper. The fix walks up to the workspace
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:42:    ['one stale file', { freshness: 'stale', action: 'selective_reindex', staleFileCount: 1, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'soft-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:43:    ['fifty stale files', { freshness: 'stale', action: 'selective_reindex', staleFileCount: 50, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'soft-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:44:    ['fifty-one stale files', { freshness: 'stale', staleFileCount: 51, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:45:    ['empty graph', { freshness: 'empty', trustState: 'absent', lastPersistedAt: null }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:46:    ['error graph', { freshness: 'error', trustState: 'unavailable', lastPersistedAt: null }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:47:    ['git head drift', { freshness: 'stale', staleFileCount: 1, gitHeadDrift: true, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:48:    ['schema mismatch', { freshness: 'fresh', schemaVersion: 4, expectedSchemaVersion: 5, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:49:    ['missing persisted timestamp', { freshness: 'fresh', canonicalReadiness: 'ready', trustState: 'live', lastPersistedAt: null }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:50:    ['battery floor failure', { freshness: 'fresh', canonicalReadiness: 'ready', trustState: 'live', lastPersistedAt: '2026-05-08T00:00:00Z', verification: battery(false) }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:51:    ['deleted tracked files only', { freshness: 'stale', action: 'none', staleFileCount: 0, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'soft-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:52:    ['unclassified stale full scan', { freshness: 'stale', action: 'full_scan', staleFileCount: 3, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:69:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:71:        staleFileCount: 1,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:82:  it('hard-stale state aborts without confirmation and mutates with confirmation', async () => {
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/unicode-normalization-fix-from-009.md:26:- Desired user-visible outcome: A concise verdict confirming stale sibling dist output is gone.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:3:description: "Verify the mk-code-index launcher starts cleanly with the [mk-code-index-launcher] prefix on stderr."
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:15:Verify the mk-code-index launcher starts cleanly with the [mk-code-index-launcher] prefix on stderr, reaches stdio readiness, and documents the shared idle-timeout guardrail.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:21:- Objective: Verify the mk-code-index launcher starts cleanly with the [mk-code-index-launcher] prefix on stderr, reaches stdio readiness, and exposes the shared idle-timeout documentation.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:22:- Real user request: `Check that the mk-code-index-launcher.cjs starts without error, prints the [mk-code-index-launcher] prefix on stderr, and documents the idle-timeout guardrail.`
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:24:- Expected execution process: Run `timeout 8 node .opencode/bin/mk-code-index-launcher.cjs </dev/null` and capture stderr. Then grep Code Graph docs for `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:25:- Expected signals: Stderr contains `[mk-code-index-launcher]` prefix. No legacy `[system_code_graph]` or `[system-code-graph]` prefixes. No unhandled exception. Code Graph README or IPC README documents `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:27:- Pass/fail: PASS if launcher starts with [mk-code-index-launcher] prefix, no errors, and idle-timeout docs are discoverable. FAIL if launcher crashes, shows legacy name, fails to print the expected prefix, or omits the idle-timeout guardrail from docs.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:35:1. Run `timeout 8 node .opencode/bin/mk-code-index-launcher.cjs </dev/null 2>&1 | head -10`.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:36:2. Check stderr for `[mk-code-index-launcher]` prefix.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:38:4. Run `rg -n "SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN" .opencode/skills/system-code-graph/README.md .opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md`.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:42:Stderr shows `[mk-code-index-launcher] loaded N env(s) from .env.local` or similar. No legacy name. The grep command finds the shared idle-timeout setting in Code Graph docs.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:50:Check launcher file path in .claude/mcp.json points to mk-code-index-launcher.cjs.
.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/launcher-startup-prefix.md:60:| `../../mcp_server/lib/ipc/launcher-idle-timeout.ts` | Idle-timeout guardrail implementation |
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts:27:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts:73:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/handlers/README.md:37:**Step 1: Confirm the owner.**
.opencode/skills/system-code-graph/mcp_server/tests/handlers/README.md:98:| README appears stale | Source files changed after this README was refreshed | Refresh the structure table and rerun the owning package tests. |
.opencode/skills/system-code-graph/mcp_server/lib/exclude-rule-classifier.ts:102: * no build-time copy of the artifact is required.
.opencode/skills/system-code-graph/mcp_server/lib/README.md:60:+-- structural-indexer.ts       # Workspace walk, parse and persist pipeline
.opencode/skills/system-code-graph/mcp_server/lib/README.md:77:+-- owner-lease.ts              # Single-owner lifecycle lease
.opencode/skills/system-code-graph/mcp_server/lib/README.md:98:+-- ipc/                        # Launcher socket bridge
.opencode/skills/system-code-graph/mcp_server/lib/README.md:148:+-- owner-lease.ts
.opencode/skills/system-code-graph/mcp_server/lib/README.md:165:+-- ipc/
.opencode/skills/system-code-graph/mcp_server/lib/README.md:183:| `close-db-assertion.ts` | Asserts stale DB handles are closed after lifecycle shutdown. |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:201:| `owner-lease.ts` | Acquires, refreshes, classifies and releases the single Code Graph owner lease. |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:204:| `ipc/` | Socket bridge used by launcher-managed secondary clients. |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:213:| Exports | `index.ts` exposes library modules to handlers and startup surfaces, including lifecycle helpers (`owner-lease.ts`, `canonical-db-dir.ts`, `close-db-assertion.ts`). |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:245:| `initDb()` / `getDb()` / `closeDb()` | Functions | Manage the SQLite graph database lifecycle. |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:254:| `acquireOwnerLease()` / `refreshOwnerLease()` / `releaseOwnerLease()` | Functions | Manage the Code Graph single-owner lifecycle lease. |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:255:| `resolveCanonicalDbDir()` | Function | Resolves DB directory identity for owner and DB lifecycle boundaries. |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:283:| [ipc/README.md](./ipc/README.md) | Launcher IPC socket bridge. |
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-blocked-read.vitest.ts:42:      it(`renders ${command.name} stale readiness as blocked ${format}`, async () => {
.opencode/skills/system-code-graph/manual_testing_playbook/08--doctor-code-graph/code-graph-apply-sub-operations.md:18:- Code graph index in any state (apply paths can recover from stale/error states).
.opencode/skills/system-code-graph/manual_testing_playbook/08--doctor-code-graph/code-graph-apply-sub-operations.md:58:   Expected: returns refusal requiring `confirm:true`. Hard-stale recovery is destructive and must be acknowledged.
.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts:13:  initDb: vi.fn(),
.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts:19:  initDb: mocks.initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:12:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:109:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:116:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:126:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:141:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:158:  it('treats stored v1 fingerprints as a scope migration requiring a blocked read', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:159:    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-scope-v1-migration-'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:175:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:185:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:22:  writeFileSync(join(dir, 'code-graph.sqlite-wal'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:59:  it('CG-RP-002 escalates to full scan when stale files exceed the soft boundary', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:64:      staleFileCount: 51,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-idle-timeout.vitest.ts:8:} from '../lib/ipc/launcher-idle-timeout.js';
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:8:  copyFileSync,
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:69:  'code-graph.sqlite-wal',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:106:function copyTriplet(dbDir: string, targetDir: string): number {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:115:    copyFileSync(source, join(targetDir, fileName));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:142:    copyFileSync(source, tripletPath(dbDir, fileName));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:200:  copyTriplet(dbDir, knownGoodDir);
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:216:    copyTriplet(dbDir, recoveryDir);
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:246:    staleFileCount?: number;
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:268:    const staleFileCount = options.staleFileCount ?? stagedFiles.length;
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:269:    const incremental = staleFileCount <= 50 && options.gitHeadDrift !== true && options.schemaOrErrorSignal !== true;
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:316:        db.pragma('wal_checkpoint(TRUNCATE)');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:264:    // the canonical vocabulary alignment (ready/stale/missing) and the
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:265:    // shared trust-state vocabulary (live/stale/absent/unavailable).
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:345:  it('BUG-01: blocks a stale graph with action:none (deleted-files-only) instead of answering ok', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:347:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:364:  it('BUG-01: blocks a stale graph left by a FAILED inline selective_reindex', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:366:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:404:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:552:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:567:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:568:      canonicalReadiness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:569:      trustState: 'stale',
.opencode/skills/system-code-graph/manual_testing_playbook/08--doctor-code-graph/doctor-apply-mode-policy.md:46:Remove scratch/apply artifacts from disposable copy.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:12:import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:60:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:86:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:113:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:146:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:147:      const filePath = join(tempDir, 'stale-valid.ts');
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:14:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:30:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:146:      const upgraded = initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:165:  it('seeds B1 rows from parse_diagnostics during migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:186:      initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:198:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:303:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:338:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:373:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:406:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:438:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:464:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:491:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:529:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:40:  it('classifies fresh, soft-stale, and hard-stale states', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:49:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:51:      staleFileCount: 4,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:53:    }).state).toBe('soft-stale');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:56:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:57:      staleFileCount: 51,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:59:    }).state).toBe('hard-stale');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:66:      status: async () => ({ freshness: 'stale', staleFileCount: 1 }),
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:76:  it('routes soft-stale rescan to incremental scan and commits after post-flight pass', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:85:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:87:        staleFileCount: 2,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:114:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:116:        staleFileCount: 1,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:142:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:144:        staleFileCount: 1,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-ops-hardening.vitest.ts:15:    expect(normalizeStructuralReadiness('stale')).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-ops-hardening.vitest.ts:22:      graphFreshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-ops-hardening.vitest.ts:26:    expect(contract.readiness.canonical).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seed-resolver.vitest.ts:12:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seed-resolver.vitest.ts:27:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:3:description: "Unix-socket IPC bridge and idle-timeout helpers for secondary mk-code-index clients and launcher-managed daemon access."
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:5:  - "code graph ipc"
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:6:  - "mk-code-index socket"
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:7:  - "ipc bridge"
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:20:`lib/ipc/` owns the local IPC socket server used by the launcher bridge. It creates a workspace-contained Unix socket or explicit TCP listener, accepts bounded secondary clients and connects each client to a fresh MCP `Server` over `StdioServerTransport`.
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:24:- `socket-server.ts` owns secondary-client socket bridging.
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:47:index.ts -> lib/ipc/socket-server.ts
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:48:socket-server.ts -> ../utils/workspace-path.ts
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:49:socket-server.ts -> @modelcontextprotocol/sdk
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:57:ipc/
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:59:+-- socket-server.ts          # Multi-client socket bridge and stats
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:70:| `socket-server.ts` | Resolves socket paths, starts the socket server, tracks active secondary clients and exposes bridge stats. |
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:78:| Workspace safety | Non-TCP socket directories must stay within the workspace root. |
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:79:| Socket cleanup | Existing sockets are unlinked only when they are real sockets owned by the current user. |
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:82:| Transport | Each secondary socket gets its own `StdioServerTransport` and MCP server instance. |
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:83:| Database | This folder does not own SQLite state. It may use the DB directory only as a safe default socket location. |
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:91:| `resolveIpcSocketPath` | Function | Resolves the socket path from a DB directory and optional environment override. |
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:93:| `getIpcBridgeStats` | Function | Reports current socket path, secondary client count and message counters. |
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:107:python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md
.opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md:121:| [../../tests/lib/README.md](../../tests/lib/README.md) | Focused tests covering socket hardening. |
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:14:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:78:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:21:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:37:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:51:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:85:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:106:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:131:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts:220:        freshness: { lastScanAt: null, staleness: 'unknown', generation: 0 },
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts:343:    expect(['live', 'stale', 'absent', 'unavailable']).toContain(parsed.data.trustState);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:12://   C. Broad stale (>50 files)→ readiness.action = "full_scan"
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:13://   D. Bounded stale          → readiness.action = "selective_reindex"
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:18:type FreshnessFixture = 'fresh' | 'stale' | 'empty' | 'error';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:61:  initDb: vi.fn(),
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:209:  // ── C. Broad stale → readiness.action = "full_scan" ───────────
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:211:  it('surfaces readiness.action="full_scan" for broad stale (>50 files) (criterion C)', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:213:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:215:      reason: '120 stale files exceed selective threshold (50)',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:221:    expect(readiness.freshness).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:225:  // ── D. Bounded stale → readiness.action = "selective_reindex" ─
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:227:  it('surfaces readiness.action="selective_reindex" for bounded stale (criterion D)', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:229:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:237:    expect(readiness.freshness).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:5:// code-index, skill-advisor). Each service supplies its own socket/db
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:16:const SOCKET_FILE_NAME = 'daemon-ipc.sock';
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:25:  socket_path: string | null;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:33:// every consuming package satisfies it with its own `@modelcontextprotocol/sdk` copy — the three
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:41:  readonly socketPath: string;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:49:  readonly socketPath: string;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:83:// re-append the missing tail. Without ancestor canonicalization, a socket dir that was cleared
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:115:// Allowed roots for the IPC socket directory: the workspace itself plus the system temp dirs.
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:116:// The macOS `sun_path` limit (104 chars) forces deep in-workspace socket paths into a short
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:119:// the project convention (`SPECKIT_IPC_SOCKET_DIR=/tmp/<service>`). The owner check in
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:137:  const socketDir = canonicalizePath(rawSocketDir);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:138:  if (!isWithinAllowedSocketRoot(socketDir)) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:140:      `IPC socket directory must stay within the workspace root or a system temp dir: ${socketDir}`,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:143:  return path.join(socketDir, SOCKET_FILE_NAME);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:146:// Only remove a stale socket at `socketPath` when it is provably ours: the parent dir resolves
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:147:// inside an allowed root, the path is an actual socket, and it is owned by the current uid.
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:148:// Guards against socket-hijack on shared hosts where an attacker plants a non-socket file or a
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:149:// socket they own at the bind path.
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:150:function canUnlinkExistingSocket(socketPath: string): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:153:    parent = fs.realpathSync.native(path.dirname(socketPath));
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:155:    // A racing peer can remove the socket directory between the EADDRINUSE failure and this
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:166:    const stat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:175:    // Same race on the socket node itself: if it is already gone the prior EADDRINUSE was
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:186:    socket_path: activeSocketPath,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:193:async function listenOnce(server: net.Server, socketPath: string): Promise<void> {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:205:    if (socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:206:      const url = new URL(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:210:    server.listen(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:214:// TCP fallback (used when a unix socket path exceeds the sun_path limit) cannot be reclaimed by
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:215:// unlinking a node — a stale TCP port frees itself once the prior owner exits, so retry the bind a
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:219:  socketPath: string,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:223:    log(`[ipc-bridge] tcp socket in use at ${socketPath}; retrying listen in ${delayMs}ms`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:226:      await listenOnce(server, socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:239:// startIpcSocketServer tracks its server/sockets in module globals, so a second start without a
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:240:// dispose would orphan the prior listener (leaking the socket and its clients) and corrupt the
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:244:  for (const socket of activeSockets) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:245:    socket.destroy();
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:262:  const socketPath = options.socketPath.startsWith('tcp://')
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:263:    ? options.socketPath
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:264:    : path.resolve(options.socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:268:  if (!socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:269:    const socketDir = path.dirname(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:270:    fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:271:    // `mode: 0o700` only applies when mkdir CREATES the dir. A pre-existing socket dir
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:275:      const st = fs.statSync(socketDir);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:278:        throw new Error(`IPC socket dir ${socketDir} not owned by current user (uid ${st.uid} != ${uid})`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:281:        throw new Error(`IPC socket dir ${socketDir} is group/world-writable (mode ${(st.mode & 0o777).toString(8)})`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:287:    // Refuse to bind over a symlink planted at the socket path. The EADDRINUSE reclaim branch
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:288:    // fences a stale node via canUnlinkExistingSocket (lstat); the fresh-bind path needs the same
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:292:      const linkStat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:294:        throw new Error(`IPC socket path ${socketPath} is a symlink; refusing to bind`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:302:  const server = net.createServer((socket) => {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:304:      log(`[ipc-bridge] refusing secondary connection: max clients ${maxClients} reached`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:305:      socket.end();
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:306:      socket.destroy();
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:310:    activeSockets.add(socket);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:312:    log('[ipc-bridge] secondary connected pid=?');
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:314:    const originalWrite = socket.write.bind(socket);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:315:    socket.write = ((chunk: unknown, ...args: unknown[]) => {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:319:    }) as typeof socket.write;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:321:    socket.on('data', (chunk) => {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:326:    const transport = new StdioServerTransport(socket, socket);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:327:    activeTransports.set(socket, transport);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:331:      log(`[ipc-bridge] secondary connect error: ${message}`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:332:      socket.destroy();
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:335:    socket.once('close', () => {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:336:      activeSockets.delete(socket);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:337:      activeTransports.delete(socket);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:339:      log('[ipc-bridge] disconnect');
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:341:    socket.once('error', (error) => {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:342:      log(`[ipc-bridge] socket error: ${error.message}`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:347:    await listenOnce(server, socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:353:    if (socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:356:      const listened = await retryTcpListenAfterEaddrInUse(server, socketPath, log);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:358:        log(`[ipc-bridge] tcp socket remained in use at ${socketPath}; secondary bridge disabled`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:360:          socketPath,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:362:            for (const socket of activeSockets) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:363:              socket.destroy();
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:371:      // Unix socket path: only reclaim a stale node that is provably ours (the fence). On a benign
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:374:      if (!canUnlinkExistingSocket(socketPath)) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:378:        fs.unlinkSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:385:      await listenOnce(server, socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:392:    : socketPath;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:393:  if (!socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:394:    // Do not chmod through a symlink. lstat first and only chmod a real socket node so the 0o600
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:396:    const boundStat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:398:      throw new Error(`IPC socket path ${socketPath} is not a bound socket; refusing to chmod`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:400:    fs.chmodSync(socketPath, 0o600);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:404:  log(`[ipc-bridge] socket listening at ${listenedPath}`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:407:    socketPath: listenedPath,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:409:      for (const socket of activeSockets) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:410:        socket.destroy();
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:421:      if (!socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:423:          fs.unlinkSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:24:  ownerPid: number;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:34:  | 'live-owner'
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:35:  | 'stale-pid'
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:36:  | 'stale-heartbeat-reclaim'
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:42:  | { acquired: true; lease: OwnerLeaseData; leasePath: string; reclaimed?: OwnerLeaseData; classification?: OwnerClassification }
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:43:  | { acquired: false; holder: OwnerLeaseData; leasePath: string; classification: OwnerClassification };
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:46:  readonly ownerPid?: number;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:62:const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:91:function ownerLeasePath(canonicalDbDir: string): string {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:95:function ownerLeaseLockPath(canonicalDbDir: string): string {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:110:// a wedged empty/partial lock whose pid is unparseable (so the live-pid stale check cannot apply).
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:111:function ownerLeaseMutationLockAgeMs(lockPath: string, now: number): number | null {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:120:  const lockPath = ownerLeaseLockPath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:133:        // pid, every later EEXIST acquirer reads a null pid, the stale-reclaim guard (which
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:156:          // Identity-checked stale-lock removal. Re-read immediately before unlink; a
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:182:        const ageMs = ownerLeaseMutationLockAgeMs(lockPath, now);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:187:              ownerLeaseMutationLockAgeMs(lockPath, now) === ageMs
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:210:function releaseOwnerLeaseMutationLock(lock: OwnerLeaseMutationLock): void {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:226:  return a.ownerPid === b.ownerPid
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:239:    Number.isInteger(candidate.ownerPid) &&
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:249:function writeOwnerLeaseAtomic(leasePath: string, data: OwnerLeaseData): void {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:250:  const tempPath = makeTempPath(leasePath);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:254:    renameSync(tempPath, leasePath);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:256:      fsyncPath(dirname(leasePath));
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:266:function writeOwnerLeaseExclusive(leasePath: string, data: OwnerLeaseData): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:269:    fd = openSync(leasePath, 'wx', 0o600);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:285:    fsyncPath(dirname(leasePath));
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:314:function isHeartbeatStale(lease: OwnerLeaseData, now: Date = new Date()): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:315:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:316:  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:321:  return ownerLeasePath(resolveCanonicalDbDir(dbDir));
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:327:    const parsed = JSON.parse(readFileSync(ownerLeasePath(canonicalDbDir), 'utf8')) as unknown;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:359:  lease: OwnerLeaseData,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:362:  const liveness = getProcessLiveness(lease.ownerPid, options.processKill);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:363:  if (liveness === 'dead') return 'stale-pid';
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:366:  const actualPpid = (options.readParentPid ?? readProcessParentPid)(lease.ownerPid);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:367:  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:371:  if (isHeartbeatStale(lease, options.now)) {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:372:    return 'stale-heartbeat-reclaim';
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:378:    if (candidateCanonical === lease.canonicalDbDir && candidateResolved !== lease.canonicalDbDir) {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:383:  return 'live-owner';
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:388:  const leasePath = ownerLeasePath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:389:  const existing = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:401:      classification === 'live-owner' ||
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:405:      return { acquired: false, holder: existing, leasePath, classification };
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:409:  const lease: OwnerLeaseData = {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:410:    ownerPid: options.ownerPid ?? process.pid,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:420:    if (writeOwnerLeaseExclusive(leasePath, lease)) {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:421:      return { acquired: true, lease, leasePath };
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:428:          leasePath,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:435:      : { acquired: false, holder: lease, leasePath, classification: 'live-owner' };
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:444:      leasePath,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:451:        : existingClassification ?? 'live-owner',
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:456:    const current = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:461:        leasePath,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:476:        currentClassification === 'live-owner' ||
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:480:        return { acquired: false, holder: current, leasePath, classification: currentClassification };
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:484:    writeOwnerLeaseAtomic(leasePath, lease);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:485:    return { acquired: true, lease, leasePath, reclaimed: current ?? existing, classification: existingClassification };
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:487:    releaseOwnerLeaseMutationLock(lock);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:493:  ownerPid: number,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:495:  patch: Partial<Pick<OwnerLeaseData, 'ownerPid' | 'ppid' | 'executablePath'>> = {},
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:498:  const leasePath = ownerLeasePath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:503:    const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:504:    if (!holder || holder.ownerPid !== ownerPid) return false;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:506:    writeOwnerLeaseAtomic(leasePath, {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:513:    releaseOwnerLeaseMutationLock(lock);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:517:export function releaseOwnerLease(dbDir: string, ownerPid: number): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:519:  const leasePath = ownerLeasePath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:520:  // Release under the same mutation lock as acquire/refresh, and re-read the lease
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:521:  // while holding it. Without the lock, a concurrent reclaim that writes a successor lease
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:522:  // between the read and the unlink would have its lease deleted by path (split-brain).
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:526:    const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:527:    if (!holder || holder.ownerPid !== ownerPid) return false;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:528:    unlinkSync(leasePath);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:531:    releaseOwnerLeaseMutationLock(lock);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:106:    mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:110:      filePath: '/tmp/test-root/stale.ts',
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:131:      const levels: GraphFreshness[] = ['fresh', 'stale', 'empty'];
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:149:        freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:153:        reason: 'stale files',
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:164:      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:165:      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:186:      expect(result.freshness).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:193:    it('reports stale work without indexing when read paths disable inline indexing', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:195:      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:196:      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: ['/tmp/test-root/stale.ts'] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:202:      expect(result.freshness).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:204:      expect(result.files).toEqual(['/tmp/test-root/stale.ts']);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:209:    it('performs selective inline reindex for small stale sets when allowed', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:211:      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:213:        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:214:        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:231:    it('rechecks tracked files on immediate fresh-to-stale transitions', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:233:      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:235:        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] })
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:236:        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:237:        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:259:        expect.objectContaining({ specificFiles: ['/tmp/test-root/stale.ts'] }),
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:263:    it('allows selective inline reindex after git HEAD changes when the stale set is small', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:270:      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:272:        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:273:        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:300:      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/fresh.ts'], stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:309:      expect(result.freshness).toBe('stale');
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:317:    it('refreshes detected stale files when the full scan guard blocks a broad refresh', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:318:      const staleFiles = Array.from({ length: 51 }, (_, index) => `/tmp/test-root/stale-${index}.ts`);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:320:      mocks.getTrackedFilesMock.mockReturnValue(staleFiles);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:322:        .mockReturnValueOnce({ fresh: [], stale: staleFiles })
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:323:        .mockReturnValueOnce({ fresh: staleFiles, stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:336:        expect.objectContaining({ specificFiles: staleFiles }),
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:341:      const staleFiles = Array.from({ length: 51 }, (_, index) => `/tmp/test-root/stale-${index}.ts`);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:343:      mocks.getTrackedFilesMock.mockReturnValue(staleFiles);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:345:        .mockReturnValueOnce({ fresh: [], stale: staleFiles })
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:346:        .mockReturnValueOnce({ fresh: staleFiles, stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:363:    it('refreshes detected stale files when parse diagnostics block a broad refresh', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:364:      const staleFiles = Array.from({ length: 51 }, (_, index) => `/tmp/test-root/stale-${index}.ts`);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:366:      mocks.getTrackedFilesMock.mockReturnValue(staleFiles);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:368:        .mockReturnValueOnce({ fresh: [], stale: staleFiles })
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:369:        .mockReturnValueOnce({ fresh: staleFiles, stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:386:        expect.objectContaining({ specificFiles: staleFiles }),
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:414:      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:415:      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:471:      expect(['fresh', 'stale', 'empty']).toContain(freshness);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:33:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:183:    it('marks a same-mtime file stale when its content hash changes', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:184:      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-hash-stale-'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:186:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:207:          stale: [filePath],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:215:    it('treats missing stored hashes as stale so the next scan can backfill them', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:218:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:234:          stale: [filePath],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:245:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:261:          stale: [],
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:274:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:534:    it('round-trips deterministic v2 fingerprints and rejects v1 fingerprints for migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:645:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:711:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:765:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:786:    // The incremental / stale-file reindex path (specificFiles) must enforce the
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:787:    // same file-type allowlist as the full walk, or an edited markdown file would
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:792:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1259:    it('stops walking cyclic tsconfig extends chains and keeps the local resolver settings', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1367:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:5:// before declaring a file stale. A touch (mtime drift, content unchanged)
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:6:// stays fresh; only a real content change flips the file to stale.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:15:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:36:describe('F-014-C4-01: hash on mtime drift before declaring stale', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:40:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:62:      // Touch-only must NOT be stale. Content hash matches
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:68:      expect(sweep.stale).not.toContain(filePath);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:74:  it('still flags real content changes as stale', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:77:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:97:      // Content hash differs → MUST be stale even though we hash before
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:98:      // declaring stale.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:101:      expect(sweep.stale).toContain(filePath);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:107:  it('treats missing-from-DB as stale (unchanged behavior)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:110:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:5:// The degree-cap default bounds the staleness-repair force-parse fan-out. It is
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:8:// symbol-identity-changing refactor leaves the inbound import edge stale (no
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:16:import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:52:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:131:  it('leaves the importer edge stale when the force-parse flag is off', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:19:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:100:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:115:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:130:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:148:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:171:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:191:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:208:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/README.md:58:| Indexing and persistence | `code-graph-indexer.vitest.ts`, `code-graph-atomic-persistence.vitest.ts` | Symbol IDs, content hashes, stale detection, node and edge writes. |
.opencode/skills/system-code-graph/mcp_server/tests/README.md:65:| Change detection | `detect-changes.test.ts` | Blocked responses on stale or failed readiness and line-range overlap attribution. |
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:92:        freshness: { lastScanAt: null, staleness: 'unknown', generation: 0 },
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:144:      freshness: 'stale',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:173:    // operators routing on them don't have to walk into
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:20:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:84:describe('code edge governance vocabulary migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:92:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:101:  it('applies through initDb when the flag is enabled', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:107:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:140:      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:215:      expect(() => ensureCodeEdgeGovernanceVocabSchema(database, 'test migration'))
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:230:  it('rolls the CHECK migration down and can re-run safely', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:248:      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:255:      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration rerun');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:11:describe('code-index CLI owner lease and respawn locking', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:12:  it('serializes concurrent launcher starts to one owner lease', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:24:    const lease = harness.assertSingleOwnerLease();
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:25:    expect(lease.ownerPid).toBeGreaterThan(1);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:30:    const harness = createCodeIndexHarness('dead-socket-respawn');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:40:    const lease = harness.assertSingleOwnerLease();
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:41:    expect(lease.ownerPid).not.toBe(terminated.ownerPid);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:4:// initDb must set busy_timeout = 5000ms so concurrent writers
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:12:import { closeDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:26:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:37:      // First connection via the singleton initDb
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:38:      const primary = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:60:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:13:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:56:  const rootDir = mkdtempSync(join(tmpdir(), `code-graph-edge-staleness-${label}-`));
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:63:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:133:describe('incremental edge staleness repair', () => {
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:2:// MODULE: IPC socket-dir resolution regression
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:4:// resolveIpcSocketPath must canonicalize the socket dir even when it does not
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:5:// exist yet. A /tmp socket dir cleared on reboot previously stayed literal
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:13:import { resolveIpcSocketPath } from '../lib/ipc/socket-server.js';
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:30:  it('resolves a non-existent /tmp socket dir without throwing (reboot-cleared dir)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:35:    let socketPath = '';
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:37:      socketPath = resolveIpcSocketPath('/unused/db/dir');
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:39:    // Returns <canonicalized missing dir>/<socket file>: keeps the unique leaf and appends a file.
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:40:    expect(socketPath).toContain(leaf);
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:41:    expect(socketPath.length).toBeGreaterThan(missingDir.length);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:10:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:51:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:9:import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:41:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:2:// MODULE: IPC socket-server drift guard
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:6:// package; code-index keeps a LOCAL byte-identical copy because it has
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:8:// node_modules link to it). This guard fails if the local copy drifts
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:23:  '.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts',
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:27:  '.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts',
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:36:describe('IPC socket-server drift guard (code-index local copy vs shared canonical)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:37:  it('keeps the code-index local copy byte-identical to the shared canonical source', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:44:        'code-index lib/ipc/socket-server.ts has drifted from the canonical shared copy at',
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:45:        '.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts.',
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:46:        'Re-sync the two files (the shared copy is the source of truth) so every daemon keeps',
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-drift.vitest.ts:47:        'the same bind/reclaim/serve and stale-socket security contract.',
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:34:  staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:255:    const freshnessLabel = freshness.staleness === 'fresh' || freshness.staleness === 'recent' ? 'live' : freshness.staleness === 'stale' ? 'stale' : 'unavailable';
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:347:    if (!lastScanAt) return { lastScanAt: null, staleness: 'unknown', generation };
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:350:    const staleness = ageMs < 300_000 ? 'fresh' : ageMs < 3_600_000 ? 'recent' : 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:351:    return { lastScanAt, staleness, generation };
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:353:    return { lastScanAt: null, staleness: 'unknown', generation: 0 };
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:864:    // swallowed silently as "unresolved subject"; now surfaces the reason.
.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts:10:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts:18:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:18:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:77:describe('code edge bitemporal schema migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:78:  it('applies through initDb and backfills legacy edges to the current generation', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:84:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:130:      ensureCodeEdgeBitemporalSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:165:      ensureCodeEdgeBitemporalSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:172:      ensureCodeEdgeBitemporalSchema(database, 'test migration rerun');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:190:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:198:  it('fails closed when required migration tables are missing', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:209:      expect(() => ensureCodeEdgeBitemporalSchema(database, 'test migration'))
.opencode/skills/system-code-graph/mcp_server/tests/launcher-maintainer-mode.vitest.ts:6:const launcher = require('../../../../bin/mk-code-index-launcher.cjs') as {
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:43:  graphState: 'ready' | 'stale' | 'empty' | 'missing';
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:119:  } else if (args.graphState === 'stale' && args.graphSummary) {
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:121:      'stale',
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:225:    if (freshness === 'stale') {
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:227:        lines.push('Freshness: stale - graph scope changed; run code_graph_scan with incremental:false.');
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:229:        lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:254:    } else if (freshness === 'stale') {
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:255:      graphState = 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:256:      graphTrustState = trustStateFromGraphState('stale');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:12:  releaseOwnerLease,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:14:} from '../../lib/owner-lease.js';
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:20:  const dir = mkdtempSync(join(tmpdir(), 'cg-owner-lease-'));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:25:function leaseFor(dbDir: string, patch: Partial<OwnerLeaseData> = {}): OwnerLeaseData {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:28:    ownerPid: process.pid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:39:function writeLease(dbDir: string, lease: OwnerLeaseData): void {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:40:  writeFileSync(join(resolveCanonicalDbDir(dbDir), OWNER_LEASE_FILE_NAME), `${JSON.stringify(lease, null, 2)}\n`);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:50:describe('owner lease lifecycle', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:51:  it('acquires, refreshes, and releases only for the matching owner', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:53:    const acquired = acquireOwnerLease(dbDir, { ownerPid: 123, ppid: 1, executablePath: '/bin/node' });
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:56:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(123);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:60:    expect(releaseOwnerLease(dbDir, 999)).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:61:    expect(releaseOwnerLease(dbDir, 123)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:65:  it('refuses a same-effective-DB second owner while the first owner is live', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:73:      classification: 'live-owner',
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:85:      Promise.resolve().then(() => acquireOwnerLease(dbDir, { ownerPid: 101, ppid: 1, ...liveOwner })),
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:86:      Promise.resolve().then(() => acquireOwnerLease(dbDir, { ownerPid: 202, ppid: 1, ...liveOwner })),
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:91:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:92:      (results.find((result) => result.acquired) as { acquired: true; lease: OwnerLeaseData }).lease.ownerPid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:96:  it('treats symlink aliases as the same owner boundary', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:110:      classification: 'live-owner',
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:117:  it('reclaims stale dead-PID leases by overwriting the lease file', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:119:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: 424242, ppid: 1 }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:122:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:133:      classification: 'stale-pid',
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:134:      reclaimed: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:136:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:139:  it('classifies stale-heartbeat live-PID owners as reclaimable', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:142:    const staleOwner = leaseFor(dbDir, {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:147:    expect(classifyOwner(staleOwner, {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:149:      readParentPid: () => staleOwner.ppid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:151:    })).toBe('stale-heartbeat-reclaim');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:154:  it('keeps recent-heartbeat live-PID owners classified as live', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:157:    const healthyOwner = leaseFor(dbDir, {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:166:    })).toBe('live-owner');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:169:  it('keeps refreshed live-PID owners classified as live across multiple TTL windows', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:174:    const ownerPid = 1234;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:175:    const ownerPpid = 5678;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:177:    writeLease(dbDir, leaseFor(dbDir, {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:178:      ownerPid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:179:      ppid: ownerPpid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:186:      expect(refreshOwnerLease(dbDir, ownerPid, now)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:192:        readParentPid: () => ownerPpid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:194:      })).toBe('live-owner');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:198:  it('does not refresh after ownership transfers to another pid', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:203:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: firstOwner }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:204:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: nextOwner }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:207:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(nextOwner);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:211:  it('reclaims stale-heartbeat leases by overwriting the lease file', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:215:      ownerPid: 424242,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:229:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:238:      classification: 'stale-heartbeat-reclaim',
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:239:      reclaimed: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:241:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:244:  it('classifies EPERM owners as unknown and does not reclaim them', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:246:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: 424242, ppid: 1 }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:253:    expect(classifyOwner(leaseFor(dbDir), { processKill })).toBe('unknown-eperm');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:255:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:262:      holder: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:264:    expect(JSON.parse(readFileSync(join(resolveCanonicalDbDir(dbDir), OWNER_LEASE_FILE_NAME), 'utf8')).ownerPid).toBe(424242);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:267:  it('classifies PPID-1 orphans as reclaimable owner evidence', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:269:    const orphan = leaseFor(dbDir, { ownerPid: 424242, ppid: 123 });
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:277:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:285:      reclaimed: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:287:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:290:  it('classifies child-survival after launcher death as orphan, not live owner', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:292:    const childLease = leaseFor(dbDir, {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:293:      ownerPid: 555,
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:3:description: "Focused Vitest coverage for code-graph library hardening, canonical DB paths, owner leases and IPC safety."
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:7:  - "owner lease tests"
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:19:`tests/lib/` contains Vitest files that target library-level safety behavior rather than MCP handler payloads. The coverage is intentionally narrow: canonical database directory resolution, DB close helpers, owner lease behavior and hardening around IPC or external binary paths.
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:24:- Files under test live in `../lib/`, including `canonical-db-dir.ts`, `close-db-assertion.ts` and `owner-lease.ts`.
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:25:- Security hardening coverage exercises `lib/ipc/socket-server.ts` and workspace containment helpers.
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:35:+-- owner-lease.vitest.ts       # Owner lease acquisition and stale-state behavior
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:56:| `owner-lease.vitest.ts` | Single-owner lease behavior and stale owner recovery. |
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:57:| `security-hardening.vitest.ts` | IPC socket containment and Code Graph binary path safety. |
.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md:91:| [../../lib/ipc/README.md](../../lib/ipc/README.md) | IPC socket bridge covered by security hardening tests. |
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:6:import { startIpcSocketServer } from '../../lib/ipc/socket-server.js';
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:25:  it('refuses to unlink an existing non-socket IPC path', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:26:    const rootLocalDir = mkdtempSync(join(process.cwd(), '.opencode', '.tmp-ipc-'));
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:28:    const socketPath = join(rootLocalDir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:29:    writeFileSync(socketPath, 'not a socket', 'utf8');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:33:        socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:39:    ).rejects.toMatchObject({ code: expect.stringMatching(/^(EADDRINUSE|EINVAL)$/) }); // listen() on a non-socket rejects EADDRINUSE on Linux, EINVAL on macOS — either proves the bind was refused, not unlinked
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:41:    expect(existsSync(socketPath)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:45:    'DR-008-01: refuses to bind under a group/world-writable socket dir',
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:47:      const dir = tempRoot('cg-ipc-perms-');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:49:      const socketPath = join(dir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:53:          socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:61:      expect(existsSync(socketPath)).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:2:// MODULE: IPC socket bind TOCTOU race regression
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:4:// Under N-way primary contention a daemon hits EADDRINUSE on a socket
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:5:// path another primary owns, then races to reclaim it. The stale-socket
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:9:// orphan the socket. These tests drive the REAL EADDRINUSE -> reclaim
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:10:// path (a genuine pre-bound UNIX socket), not a regular file, so they do
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:26:} from '../../lib/ipc/socket-server.js';
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:29:const stalePreBinds: net.Server[] = [];
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:34:  // os.tmpdir() resolves inside an allowed socket root on every supported host.
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:40:// Bind a real raw UNIX socket and leave it listening so a subsequent startIpcSocketServer on the
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:42:async function preBindStaleSocket(socketPath: string): Promise<net.Server> {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:44:  stalePreBinds.push(server);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:48:    server.listen(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:55:    { name: 'ipc-toctou-test', version: '0.0.0' },
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:62:async function connect(socketPath: string): Promise<net.Socket> {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:63:  const socket = net.createConnection({ path: socketPath });
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:64:  clients.push(socket);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:66:    socket.once('connect', resolve);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:67:    socket.once('error', reject);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:69:  return socket;
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:72:async function readLine(socket: net.Socket): Promise<string> {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:79:      socket.off('data', onData);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:82:    socket.on('data', onData);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:83:    socket.once('error', reject);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:91:  while (stalePreBinds.length > 0) {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:92:    const server = stalePreBinds.pop();
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:101:describe('IPC socket bind TOCTOU race', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:102:  it('reclaims a real stale UNIX socket on EADDRINUSE and the survivor serves', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:104:    const socketPath = join(dir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:105:    // A genuine pre-bound, same-uid socket node: the fence permits the unlink and the bind reclaims.
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:106:    await preBindStaleSocket(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:109:      socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:115:    const client = await connect(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:121:  it('does NOT abort the bind when the stale socket node vanishes mid-reclaim (ENOENT TOCTOU)', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:123:    const socketPath = join(dir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:125:    await preBindStaleSocket(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:127:    // Simulate the racing peer removing the socket node between the EADDRINUSE failure and the
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:128:    // reclaim lstat: the very next lstatSync of the socket path throws ENOENT. The reclaim path must
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:129:    // treat this as "already gone -> reclaimable" and re-bind, not throw and orphan the socket. The
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:130:    // stale pre-bind stays listening so the bind below hits a REAL EADDRINUSE first (which is what
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:135:      if (!raced && String(target) === socketPath) {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:145:      socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:153:    const client = await connect(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:6:// real fs so canonical-db-dir + the lease writes behave normally.
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:29:const { acquireOwnerLease, refreshOwnerLease } = await import('../../lib/owner-lease.js');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:32:const OWNER_LEASE_LOCK_FILE_NAME = '.code-graph-owner.json.lock';
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:37:  const dir = mkdtempSync(join(tmpdir(), 'cg-owner-lease-mutex-'));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:57:    const ownerPid = 4242;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:59:    // Establish a healthy lease so refreshOwnerLease reaches the holder-write path under the lock.
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:60:    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:77:    expect(() => refreshOwnerLease(dbDir, ownerPid)).toThrow(/ENOSPC|simulated/);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:85:    // acquirer (lockPid === null fails the stale-reclaim guard) -> tryAcquire null forever ->
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:92:    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:97:    const ownerPid = 5151;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:99:    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:110:    // The live-pid stale check cannot clear an unparseable pid; only the OR-3-01 age-guarded
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:112:    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:118:    const ownerPid = 6262;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:120:    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:129:    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(false);
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:2:// MODULE: Code Graph Boundary Contracts (local copy for system-code-graph)
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:5:export type GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:7:export type StructuralReadiness = 'ready' | 'stale' | 'missing';
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:71:  graphState: 'ready' | 'stale' | 'empty' | 'missing';
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:84:  graphState: 'ready' | 'stale' | 'empty' | 'missing';
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:135:  if (graphFreshness === 'stale') return 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:146:    : canonical === 'stale'
.opencode/skills/system-code-graph/mcp_server/lib/shared/code-graph-contracts.ts:151:    : canonical === 'stale'
.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:2:// MODULE: Shared Payload Contract (local copy for system-code-graph)
.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:11:  'live', 'cached', 'stale', 'absent', 'unavailable', 'imported', 'rebuilt', 'rehomed',
.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:24:export const FRESHNESS_AUTHORITY_VALUES = ['live', 'cached', 'stale', 'unknown'] as const;
.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:27:export const ADVISOR_ENVELOPE_FRESHNESS_VALUES = ['live', 'stale', 'absent', 'unavailable'] as const;
.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:30:export const ADVISOR_ENVELOPE_STATUS_VALUES = ['ok', 'skipped', 'stale', 'degraded', 'fail_open'] as const;
.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:158:  graphState: 'ready' | 'stale' | 'empty' | 'missing' | 'error',
.opencode/skills/system-code-graph/mcp_server/lib/shared/shared-payload.ts:162:    case 'stale': return 'stale';
.opencode/skills/system-code-graph/mcp_server/lib/shared/README.md:19:`lib/shared/` contains the small contracts and runtime helpers that must be reused across code-graph handlers, library modules and tools. The folder keeps code-graph ownership local, including payload trust fields, MCP response helpers, path canonicalization, hook-state reads and scan-scope filtering.

codex
One premise correction from the file tree: the bridge source is under `.opencode/bin/lib/launcher-ipc-bridge.cjs`, while the launcher imports it from `./lib/launcher-ipc-bridge.cjs`. I’m reading that actual imported file and the rest of the launcher now.
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '760,1180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   760	  fs.renameSync(tmp, currentLeasePath);
   761	}
   762	
   763	function clearLeaseFile() {
   764	  try {
   765	    const lease = readLeaseFile();
   766	    if (lease && lease.pid === process.pid) fs.unlinkSync(leasePath());
   767	  } catch {
   768	    // Idempotent cleanup.
   769	  }
   770	}
   771	
   772	function clearAllLeaseFiles() {
   773	  clearOwnerLeaseHeartbeat();
   774	  clearLeaseFile();
   775	  clearOwnerLeaseFile();
   776	}
   777	
   778	function run(command, args, options = {}) {
   779	  const result = spawnSync(command, args, {
   780	    cwd: options.cwd || root,
   781	    env: buildChildEnv(),
   782	    encoding: 'utf8',
   783	    stdio: ['ignore', 'pipe', 'pipe'],
   784	  });
   785	
   786	  if (result.stdout) {
   787	    process.stderr.write(result.stdout);
   788	  }
   789	  if (result.stderr) {
   790	    process.stderr.write(result.stderr);
   791	  }
   792	  if (result.error) {
   793	    throw result.error;
   794	  }
   795	  if (result.status !== 0) {
   796	    throw new Error(`${command} ${args.join(' ')} exited ${result.status}`);
   797	  }
   798	}
   799	
   800	function buildChildEnv(extra = {}) {
   801	  const nextEnv = {};
   802	  for (const [key, value] of Object.entries(process.env)) {
   803	    if (BLOCKED_CHILD_ENV_RE.test(key)) continue;
   804	    nextEnv[key] = value;
   805	  }
   806	  return { ...nextEnv, ...extra };
   807	}
   808	
   809	function ensureLayout(actions) {
   810	  if (!exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
   811	    fs.renameSync(legacySkillDir, skillsDir);
   812	    fs.symlinkSync('skills', legacySkillDir, 'dir');
   813	    actions.push('promoted .opencode/skill to .opencode/skills and created compatibility symlink');
   814	    refreshPaths();
   815	    return;
   816	  }
   817	
   818	  if (exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
   819	    const backup = path.join(opencodeDir, `skill_legacy_backup_${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`);
   820	    fs.renameSync(legacySkillDir, backup);
   821	    fs.symlinkSync('skills', legacySkillDir, 'dir');
   822	    actions.push(`moved legacy .opencode/skill to ${rel(backup)} and created compatibility symlink`);
   823	    refreshPaths();
   824	    return;
   825	  }
   826	
   827	  // Compatibility symlink `.opencode/skill -> skills` removed; a prior cleanup cleaned
   828	  // up consumers of the singular path, so the bridge no longer needs to be
   829	  // recreated on every MCP startup. Migration paths above (rename / move-aside)
   830	  // still create the symlink when an actual legacy singular dir is present.
   831	}
   832	
   833	function requiredArtifacts() {
   834	  return [
   835	    path.join(kitDir, 'mcp_server', 'dist', 'index.js'),
   836	  ];
   837	}
   838	
   839	function artifactsReady() {
   840	  return requiredArtifacts().every(exists);
   841	}
   842	
   843	function localTscEntrypoint() {
   844	  return path.join(kitDir, 'node_modules', 'typescript', 'bin', 'tsc');
   845	}
   846	
   847	function buildIfNeeded(actions) {
   848	  if (artifactsReady()) {
   849	    return;
   850	  }
   851	
   852	  if (!exists(kitDir)) {
   853	    throw new Error(`mk-code-index skill (system-code-graph directory) not found at ${rel(kitDir)}`);
   854	  }
   855	
   856	  actions.push('installed dependencies and built @spec-kit/system-code-graph MCP server');
   857	  if (!exists(localTscEntrypoint())) {
   858	    const installCommand = exists(path.join(kitDir, 'package-lock.json')) ? 'ci' : 'install';
   859	    run('npm', [installCommand, '--no-audit', '--no-fund', '--silent'], { cwd: kitDir });
   860	  }
   861	  run(process.execPath, [localTscEntrypoint(), '-p', 'tsconfig.json'], { cwd: kitDir });
   862	
   863	  const missing = requiredArtifacts().filter((artifact) => !exists(artifact));
   864	  if (missing.length > 0) {
   865	    throw new Error(`bootstrap finished but artifacts are still missing: ${missing.map(rel).join(', ')}`);
   866	  }
   867	}
   868	
   869	const BOOTSTRAP_LOCK_STALE_MS = 5 * 60 * 1000; // 5 minutes — fallback for unstamped (legacy) lock dirs
   870	const BOOTSTRAP_LOCK_TIMEOUT_MS = 120000;
   871	const BOOTSTRAP_LOCK_OWNER_FILE = 'owner.pid';
   872	
   873	// Returns the pid recorded inside the lock dir, or null when no readable pid
   874	// stamp exists (legacy lock dirs, or a holder that died before stamping).
   875	function readBootstrapLockOwnerPid() {
   876	  try {
   877	    const raw = fs.readFileSync(path.join(lockDir, BOOTSTRAP_LOCK_OWNER_FILE), 'utf8').trim();
   878	    const pid = Number.parseInt(raw, 10);
   879	    return Number.isInteger(pid) && pid > 0 ? pid : null;
   880	  } catch {
   881	    return null;
   882	  }
   883	}
   884	
   885	// Reclaim a stale bootstrap lockdir. A lock is reclaimable as soon as its
   886	// recorded holder is provably dead; the mtime TTL is only a fallback for lock
   887	// dirs with no readable pid stamp (legacy dirs) or a holder whose liveness
   888	// cannot be determined. Without the dead-holder check, a holder killed less than
   889	// staleMs ago wedges every requireLock respawn for the full wait deadline.
   890	function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_STALE_MS) {
   891	  let ageMs;
   892	  try {
   893	    ageMs = Date.now() - fs.statSync(lockDir).mtimeMs;
   894	  } catch (error) {
   895	    if (error.code === 'ENOENT') return false;
   896	    throw error;
   897	  }
   898	  const ownerPid = readBootstrapLockOwnerPid();
   899	  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
   900	  if (!ownerDead && ageMs <= staleMs) {
   901	    return false;
   902	  }
   903	  // Atomically CLAIM the stale lockdir via rename before deleting it. Only one
   904	  // racer wins the rename; a successor that mkdir's a fresh lockDir after our stat
   905	  // creates a NEW inode that our rename/rmSync cannot touch, so we never delete a
   906	  // live successor lock. A losing racer's rename throws ENOENT and falls through to
   907	  // the outer retry.
   908	  const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
   909	  try {
   910	    fs.renameSync(lockDir, staleClaim);
   911	    fs.rmSync(staleClaim, { recursive: true, force: true });
   912	    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
   913	    log(`reclaiming stale bootstrap lock ${rel(lockDir)} (${reason})`);
   914	    return true;
   915	  } catch (error) {
   916	    if (error.code === 'ENOENT' || error.code === 'ENOTEMPTY') return false;
   917	    throw error;
   918	  }
   919	}
   920	
   921	async function acquireBootstrapLock(options = {}) {
   922	  const requireLock = options.requireLock === true;
   923	  fs.mkdirSync(dbDir, { recursive: true });
   924	  const deadline = Date.now() + (options.timeoutMs ?? BOOTSTRAP_LOCK_TIMEOUT_MS);
   925	  const staleMs = options.staleMs ?? BOOTSTRAP_LOCK_STALE_MS;
   926	  const retrySleepMs = options.retrySleepMs ?? 1000;
   927	  while (true) {
   928	    try {
   929	      fs.mkdirSync(lockDir);
   930	      // Stamp the holder pid so a later launcher can reclaim this lock the
   931	      // instant we die, instead of waiting out the mtime TTL. Best-effort: a
   932	      // failed stamp degrades to the TTL path, never blocks acquisition.
   933	      try {
   934	        fs.writeFileSync(path.join(lockDir, BOOTSTRAP_LOCK_OWNER_FILE), String(process.pid), { mode: 0o600 });
   935	      } catch { /* TTL fallback covers an unstamped lock */ }
   936	      return true;
   937	    } catch (error) {
   938	      if (error.code !== 'EEXIST') {
   939	        throw error;
   940	      }
   941	      if (artifactsReady() && !requireLock) {
   942	        return false;
   943	      }
   944	      if (removeStaleBootstrapLock(staleMs)) {
   945	        continue;
   946	      }
   947	      if (Date.now() > deadline) {
   948	        throw new Error(`bootstrap lock timed out at ${rel(lockDir)}`);
   949	      }
   950	      await sleep(retrySleepMs);
   951	    }
   952	  }
   953	}
   954	
   955	function launchServer() {
   956	  if (launchStarted) {
   957	    log('launchServer skipped: launch already started in this launcher process');
   958	    return false;
   959	  }
   960	  launchStarted = true;
   961	  // Set DB dir for the child process (operator-set env var wins).
   962	  if (!process.env.SPECKIT_CODE_GRAPH_DB_DIR) {
   963	    process.env.SPECKIT_CODE_GRAPH_DB_DIR = resolvedDbDir();
   964	  }
   965	
   966	  const server = path.join(kitDir, 'mcp_server', 'dist', 'index.js');
   967	  childProcess = spawn(process.execPath, [server], {
   968	    cwd: root,
   969	    env: buildChildEnv(),
   970	    stdio: 'inherit',
   971	  });
   972	
   973	  if (typeof childProcess.pid === 'number') {
   974	    const refreshed = refreshOwnerLeaseFile(process.pid, {
   975	      ownerPid: childProcess.pid,
   976	      ppid: process.pid,
   977	      executablePath: process.execPath,
   978	    });
   979	    if (!refreshed) {
   980	      log('owner lease refresh to child pid failed; launcher pid remains the recorded owner');
   981	    }
   982	    startOwnerLeaseHeartbeat(refreshed ? childProcess.pid : process.pid);
   983	  }
   984	
   985	  childProcess.on('exit', (code, signal) => {
   986	    if (signal) {
   987	      // Clear the lease before mirroring the signal; process.on('exit') does not fire on SIGKILL.
   988	      clearAllLeaseFiles();
   989	      // Remove our own handler for this signal first. Without this, the self-sent
   990	      // catchable signal (SIGTERM/SIGINT/SIGHUP/SIGQUIT) re-enters installSignalHandlers'
   991	      // handler, which — for an externally-killed child (childProcess.killed === false) —
   992	      // exits 0, so a supervising runtime misreads abnormal daemon death as a clean
   993	      // shutdown. Removing the handler lets the re-raised signal terminate this process
   994	      // with the signaled status (128 + n). SIGKILL is uncatchable and already mirrors.
   995	      process.removeAllListeners(signal);
   996	      process.kill(process.pid, signal);
   997	      return;
   998	    }
   999	    clearAllLeaseFiles();
  1000	    process.exit(code ?? 0);
  1001	  });
  1002	
  1003	  childProcess.on('error', (error) => {
  1004	    log(error.stack || error.message);
  1005	    process.exit(1);
  1006	  });
  1007	  return true;
  1008	}
  1009	
  1010	function installSignalHandlers() {
  1011	  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
  1012	    process.on(signal, () => {
  1013	      if (childProcess && !childProcess.killed) {
  1014	        childProcess.once('exit', () => {
  1015	          clearLeaseFile();
  1016	          process.exit(128);
  1017	        });
  1018	        childProcess.kill(signal);
  1019	        setTimeout(() => {
  1020	          clearAllLeaseFiles();
  1021	          process.exit(128);
  1022	        }, 5000).unref();
  1023	        return;
  1024	      }
  1025	      clearAllLeaseFiles();
  1026	      process.exit(128);
  1027	    });
  1028	  }
  1029	  process.on('uncaughtException', (err) => {
  1030	    try {
  1031	      clearAllLeaseFiles();
  1032	    } catch {
  1033	      // Preserve default uncaughtException crash behavior.
  1034	    }
  1035	    throw err;
  1036	  });
  1037	}
  1038	
  1039	async function launcherMain() {
  1040	  const started = now();
  1041	  const actions = [];
  1042	  let lockHeld = false;
  1043	  // Orphan daemon pid recorded by a reclaimed prior owner lease. A SIGKILL'd
  1044	  // launcher leaves its non-detached child reparented to init while still holding
  1045	  // the SQLite DB; reap it before spawning a successor so we never run two writers
  1046	  // against the same DB (mirrors the dead-socket respawn reap and the sibling
  1047	  // launchers' adopt-or-reap guards).
  1048	  let reclaimedOrphanPid = null;
  1049	
  1050	  try {
  1051	    installSignalHandlers();
  1052	    // Lease cleanup runs unconditionally regardless of child termination path.
  1053	    process.on('exit', clearAllLeaseFiles);
  1054	    refreshPaths();
  1055	    ensureLayout(actions);
  1056	    refreshPaths();
  1057	
  1058	    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_CODE_INDEX_STRICT_SINGLE_WRITER);
  1059	    if (strictSingleWriter) {
  1060	      const ownerLeaseResult = acquireOwnerLeaseFile();
  1061	      if (ownerLeaseResult.acquired
  1062	          && ownerLeaseResult.reclaimed
  1063	          && Number.isInteger(ownerLeaseResult.reclaimed.ownerPid)
  1064	          && ownerLeaseResult.reclaimed.ownerPid > 0
  1065	          && ownerLeaseResult.reclaimed.ownerPid !== process.pid) {
  1066	        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
  1067	      }
  1068	      if (!ownerLeaseResult.acquired) {
  1069	        // A live owner already holds the single-writer lease. Bridge this
  1070	        // client's stdio to the owner's IPC socket so additional sessions and
  1071	        // MCP reconnects share the one daemon (matches mk-spec-memory-launcher).
  1072	        // maybeBridgeLeaseHolder falls back to a LEASE_HELD_BY diagnostic line
  1073	        // only when the socket is missing/refused or bridging is disabled.
  1074	        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
  1075	        await bridgeOrReportLeaseHeld({
  1076	          ownerPid: ownerLeaseResult.holder.ownerPid,
  1077	          startedAt: ownerLeaseResult.holder.startedAtIso,
  1078	          socketPath: typeof ownerLeaseResult.holder.socketPath === 'string' ? ownerLeaseResult.holder.socketPath : null,
  1079	        }, {
  1080	          respawnChildPid: ownerLeaseResult.holder.ownerPid,
  1081	        });
  1082	        return;
  1083	      }
  1084	
  1085	      const leaseResult = isLeaseHeld();
  1086	      if (leaseResult.held && !leaseResult.staleReclaimable) {
  1087	        clearOwnerLeaseFile();
  1088	        await bridgeOrReportLeaseHeld(leaseResult);
  1089	        return;
  1090	      }
  1091	      if (leaseResult.staleReclaimable) {
  1092	        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
  1093	        emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
  1094	          ownerPid: leaseResult.ownerPid,
  1095	          leaseKind: leaseResult.legacyPath ? 'legacy-pid' : 'pid',
  1096	        });
  1097	      }
  1098	    } else {
  1099	      log('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
  1100	    }
  1101	
  1102	    lockHeld = await acquireBootstrapLock();
  1103	    if (lockHeld) {
  1104	      // Auto-migrate DB from the former shared standalone location back to skill-local.
  1105	      // The former DB is preserved as a backup (copy, not move).
  1106	      // This block now runs ONLY for the single bootstrap-lock winner (lockHeld), AFTER the lock
  1107	      // is held and BEFORE the DB is opened by the spawned child (launchServer, below). Previously
  1108	      // it ran in the main IIFE before any lock, so two concurrent launchers could both pass the
  1109	      // !exists(target) guard and both copy — a lagging copier truncate-overwriting the now-LIVE
  1110	      // target DB out from under the winner's daemon (SQLite corruption). Gating on lockHeld makes
  1111	      // only one launcher migrate; the COPYFILE_EXCL + pre-copy re-check below is the belt-and-
  1112	      // suspenders guarantee that NO launcher ever overwrites an existing (possibly live) target DB.
  1113	      // Never auto-seed/migrate into an explicit SPECKIT_CODE_GRAPH_DB_DIR override
  1114	      //   (the operator chose that target); migrate only into the resolved default.
  1115	      // Never copy a former DB that a live legacy owner could still be
  1116	      //   writing — probe BOTH the former PID lease and the former owner lease for liveness first.
  1117	      //   The former owner lease (.code-graph-owner.json) is intentionally NOT copied forward.
  1118	      const formerSharedDbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
  1119	      const migrationTarget = resolvedDbDir();
  1120	      if (!process.env.SPECKIT_CODE_GRAPH_DB_DIR
  1121	          && !exists(path.join(migrationTarget, 'code-graph.sqlite'))
  1122	          && exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))
  1123	          && !formerLocationOwnerLive(formerSharedDbDir)) {
  1124	        fs.mkdirSync(migrationTarget, { recursive: true, mode: 0o700 });
  1125	        const dbFiles = [
  1126	          'code-graph.sqlite',
  1127	          'code-graph.sqlite-shm',
  1128	          'code-graph.sqlite-wal',
  1129	          '.code-graph-readiness.json',
  1130	          '.mk-code-index-launcher.json',
  1131	        ];
  1132	        // Re-check the sqlite target immediately before copying so a launcher that
  1133	        // raced past the outer guard (e.g. a concurrent migrator that just finished) does not
  1134	        // clobber the freshly-migrated DB. EEXIST from COPYFILE_EXCL means another launcher
  1135	        // already migrated that file -> treat the target as authoritative and stop migrating.
  1136	        let migrated = false;
  1137	        if (!exists(path.join(migrationTarget, 'code-graph.sqlite'))) {
  1138	          try {
  1139	            for (const file of dbFiles) {
  1140	              const src = path.join(formerSharedDbDir, file);
  1141	              const dst = path.join(migrationTarget, file);
  1142	              if (exists(src)) {
  1143	                // COPYFILE_EXCL makes the copy fail with EEXIST rather than truncate-
  1144	                // overwrite an existing (possibly live) target file.
  1145	                fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL);
  1146	              }
  1147	            }
  1148	            migrated = true;
  1149	          } catch (copyError) {
  1150	            if (copyError.code === 'EEXIST') {
  1151	              // Another launcher already migrated into this target; the existing target
  1152	              // is authoritative. Do NOT overwrite it.
  1153	              log('migration skipped: target already present (EEXIST); treating existing target as authoritative');
  1154	            } else {
  1155	              throw copyError;
  1156	            }
  1157	          }
  1158	        }
  1159	        if (migrated) {
  1160	          process.stderr.write(
  1161	            `[mk-code-index-launcher] migrated DB from ${rel(formerSharedDbDir)} to ${rel(migrationTarget)} (former location preserved)\n`
  1162	          );
  1163	        }
  1164	      }
  1165	
  1166	      buildIfNeeded(actions);
  1167	      log(`ready: ${JSON.stringify({ start: started, end: now(), actions, server: rel(path.join(kitDir, 'mcp_server', 'dist', 'index.js')) })}`);
  1168	    }
  1169	
  1170	    // Reap the orphan daemon recorded by the reclaimed prior owner lease before
  1171	    // spawning a successor. The bootstrap lock above serializes this so only the
  1172	    // winning launcher reaps + respawns; a still-live orphan would otherwise keep
  1173	    // writing the SQLite DB alongside the new daemon.
  1174	    if (Number.isInteger(reclaimedOrphanPid) && reclaimedOrphanPid > 0) {
  1175	      const reapResult = await reapOwnerBeforeRespawn(reclaimedOrphanPid);
  1176	      if (!reapResult.allowed) {
  1177	        log(`reclaimed orphan daemon pid ${reclaimedOrphanPid} could not be reaped (${reapResult.reason}); not spawning a second daemon`);
  1178	        process.exit(0);
  1179	      }
  1180	    }

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '360,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   360	    if (error.code === 'EEXIST') return false;
   361	    throw error;
   362	  } finally {
   363	    if (typeof fd === 'number') fs.closeSync(fd);
   364	  }
   365	}
   366	
   367	// The socket path this owner's environment computes. Recording it in the
   368	// leases lets a secondary under a divergent SPECKIT_IPC_SOCKET_DIR bridge
   369	// to the REAL socket instead of probing a recomputed wrong one and
   370	// misreporting a healthy owner as no-bridge-socket.
   371	function ownerSocketPath() {
   372	  try {
   373	    const { getIpcSocketPath } = loadBridgeModule();
   374	    if (typeof getIpcSocketPath !== 'function') return null;
   375	    return getIpcSocketPath('mk-code-index', { dbDir: resolvedDbDir() }) ?? null;
   376	  } catch {
   377	    return null;
   378	  }
   379	}
   380	
   381	let ownerLeaseHeartbeatTimer = null;
   382	
   383	function clearOwnerLeaseHeartbeat() {
   384	  if (ownerLeaseHeartbeatTimer) {
   385	    clearInterval(ownerLeaseHeartbeatTimer);
   386	    ownerLeaseHeartbeatTimer = null;
   387	  }
   388	}
   389	
   390	// Without a periodic refresh, every healthy long-running owner classifies
   391	// as stale-heartbeat-reclaim about two minutes after spawn, so each later
   392	// secondary start rewrites the owner lease before rediscovering the live
   393	// PID lease — churn plus reclaim-race exposure for nothing.
   394	function startOwnerLeaseHeartbeat(ownerPid) {
   395	  clearOwnerLeaseHeartbeat();
   396	  const lease = readOwnerLeaseFile();
   397	  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
   398	  const intervalMs = Math.max(1000, Math.floor(ttlMs / 2));
   399	  ownerLeaseHeartbeatTimer = setInterval(() => {
   400	    if (refreshOwnerLeaseFile(ownerPid)) return;
   401	    // A failed refresh means a concurrent reclaim superseded this owner;
   402	    // this launcher exits with its child rather than supervising relaunches,
   403	    // so stop heartbeating instead of fighting the new owner.
   404	    log('owner lease heartbeat refresh failed (superseded); stopping heartbeat');
   405	    clearOwnerLeaseHeartbeat();
   406	  }, intervalMs);
   407	  ownerLeaseHeartbeatTimer.unref?.();
   408	}
   409	
   410	function buildOwnerLease(ownerPid = process.pid) {
   411	  return {
   412	    ownerPid,
   413	    ppid: process.ppid,
   414	    executablePath: process.execPath,
   415	    startedAtIso: new Date().toISOString(),
   416	    lastHeartbeatIso: new Date().toISOString(),
   417	    ttlMs: 60000,
   418	    canonicalDbDir: resolvedDbDir(),
   419	    socketPath: ownerSocketPath(),
   420	  };
   421	}
   422	
   423	function processLiveness(pid) {
   424	  if (!Number.isInteger(pid) || pid <= 0) return 'dead';
   425	  try {
   426	    process.kill(pid, 0);
   427	    return 'alive';
   428	  } catch (error) {
   429	    if (error.code === 'ESRCH') return 'dead';
   430	    if (error.code === 'EPERM') return 'unknown-eperm';
   431	    return 'alive';
   432	  }
   433	}
   434	
   435	function readParentPid(pid) {
   436	  if (!Number.isInteger(pid) || pid <= 0) return null;
   437	  if (process.platform === 'linux') {
   438	    try {
   439	      const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
   440	      const match = status.match(/^PPid:\s+(\d+)$/m);
   441	      return match ? Number.parseInt(match[1], 10) : null;
   442	    } catch {
   443	      return null;
   444	    }
   445	  }
   446	  const result = spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
   447	    encoding: 'utf8',
   448	    stdio: ['ignore', 'pipe', 'ignore'],
   449	  });
   450	  if (result.status !== 0 || !result.stdout) return null;
   451	  const parsed = Number.parseInt(result.stdout.trim(), 10);
   452	  return Number.isInteger(parsed) ? parsed : null;
   453	}
   454	
   455	function classifyOwnerLease(lease) {
   456	  const liveness = processLiveness(lease.ownerPid);
   457	  if (liveness === 'dead') return 'stale-pid';
   458	  if (liveness === 'unknown-eperm') return 'unknown-eperm';
   459	
   460	  const actualPpid = readParentPid(lease.ownerPid);
   461	  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
   462	    return 'ppid-1-orphan';
   463	  }
   464	
   465	  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
   466	  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
   467	  if (!Number.isFinite(heartbeatMs) || Date.now() - heartbeatMs > ttlMs * 2) {
   468	    return 'stale-heartbeat-reclaim';
   469	  }
   470	
   471	  return 'live-owner';
   472	}
   473	
   474	function acquireOwnerLeaseFile() {
   475	  const currentOwnerLeasePath = ownerLeasePath();
   476	  const existing = readOwnerLeaseFile(currentOwnerLeasePath);
   477	
   478	  if (existing) {
   479	    const classification = classifyOwnerLease(existing);
   480	    if (classification === 'live-owner' || classification === 'unknown-eperm') {
   481	      return { acquired: false, holder: existing, classification };
   482	    }
   483	    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
   484	  }
   485	
   486	  const lease = buildOwnerLease(process.pid);
   487	  // Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL).
   488	  // This collapses the fresh-acquire and stale-reclaim paths into a single CAS so
   489	  // only one racer can win: the loser's exclusive create hits EEXIST and returns
   490	  // acquired:false instead of last-writer-wins overwriting the winner's lease.
   491	  if (existing) {
   492	    try {
   493	      fs.unlinkSync(currentOwnerLeasePath);
   494	    } catch (error) {
   495	      if (error.code !== 'ENOENT') throw error;
   496	    }
   497	  }
   498	  if (!writeOwnerLeaseFileExclusive(lease)) {
   499	    const holder = readOwnerLeaseFile(currentOwnerLeasePath);
   500	    return {
   501	      acquired: false,
   502	      holder: holder || lease,
   503	      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
   504	    };
   505	  }
   506	  ownerLeasePid = process.pid;
   507	  if (existing) {
   508	    emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
   509	      ownerPid: existing.ownerPid,
   510	      ownerClassification: classifyOwnerLease(existing),
   511	      leaseKind: 'owner',
   512	    });
   513	  }
   514	  return { acquired: true, lease, reclaimed: existing };
   515	}
   516	
   517	function refreshOwnerLeaseFile(ownerPid, patch = {}) {
   518	  const lease = readOwnerLeaseFile();
   519	  if (!lease || lease.ownerPid !== ownerPid) return false;
   520	  const nextOwnerPid = patch.ownerPid ?? ownerPid;
   521	  writeOwnerLeaseFile({
   522	    ...lease,
   523	    ...patch,
   524	    lastHeartbeatIso: new Date().toISOString(),
   525	  });
   526	  // Re-read after the atomic write; if a concurrent reclaim superseded us between
   527	  // the ownership check and the write, do not claim the refresh succeeded.
   528	  const reread = readOwnerLeaseFile();
   529	  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
   530	  ownerLeasePid = nextOwnerPid;
   531	  return true;
   532	}
   533	
   534	function clearOwnerLeaseFile() {
   535	  if (!Number.isInteger(ownerLeasePid)) return;
   536	  try {
   537	    // Re-confirm ownership immediately before unlink so a successor lease written
   538	    // after the first read is not deleted by path. A residual sub-syscall window remains; fully
   539	    // closing it would require the launcher to share owner-lease.ts's mutation lock.
   540	    const lease = readOwnerLeaseFile();
   541	    if (lease && lease.ownerPid === ownerLeasePid
   542	        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
   543	      fs.unlinkSync(ownerLeasePath());
   544	    }
   545	  } catch {
   546	    // Idempotent cleanup.
   547	  } finally {
   548	    ownerLeasePid = null;
   549	  }
   550	}
   551	
   552	function clearOwnerLeaseFileIfOwner(ownerPid) {
   553	  try {
   554	    // Re-confirm ownership immediately before unlink (see clearOwnerLeaseFile).
   555	    const lease = readOwnerLeaseFile();
   556	    if (lease && lease.ownerPid === ownerPid
   557	        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
   558	      fs.unlinkSync(ownerLeasePath());
   559	    }
   560	  } catch {
   561	    // Idempotent cleanup.
   562	  }
   563	}
   564	
   565	function pidLiveAt(filePath, pidField) {
   566	  try {
   567	    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
   568	    const pid = parsed[pidField];
   569	    if (!Number.isInteger(pid)) return false;
   570	    try { process.kill(pid, 0); return true; } // live
   571	    catch (error) { return error.code === 'EPERM'; } // EPERM = exists but no perm → treat live; ESRCH = dead
   572	  } catch { return false; } // missing/unreadable → not live
   573	}
   574	
   575	// A former-location DB is still "owned" if EITHER the launcher PID lease
   576	// (.mk-code-index-launcher.json) or the owner lease (.code-graph-owner.json) names a live process.
   577	function formerLocationOwnerLive(dir) {
   578	  return pidLiveAt(path.join(dir, '.mk-code-index-launcher.json'), 'pid')
   579	      || pidLiveAt(path.join(dir, '.code-graph-owner.json'), 'ownerPid');
   580	}
   581	
   582	function leaseHeldFromFile(filePath, legacyPath = null) {
   583	  const lease = readLeaseFile(filePath);
   584	  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   585	  // Surface the owner-recorded socket path so the bridge prefers it over
   586	  // recomputing one that may diverge under a different SPECKIT_IPC_SOCKET_DIR.
   587	  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
   588	  // Do not bridge to a LEGACY-location lease unless its lease file is owned by the
   589	  // current user. A foreign-owned lease in a shared/former path could otherwise point this
   590	  // client at a spoofed IPC socket.
   591	  if (legacyPath && typeof process.getuid === 'function') {
   592	    try {
   593	      if (fs.statSync(filePath).uid !== process.getuid()) {
   594	        return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   595	      }
   596	    } catch {
   597	      return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   598	    }
   599	  }
   600	  const startedAt = lease.startedAt ?? new Date(0).toISOString();
   601	  try {
   602	    process.kill(lease.pid, 0);
   603	    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   604	  } catch (error) {
   605	    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
   606	    // Mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
   607	    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   608	    throw error;
   609	  }
   610	}
   611	
   612	function isLeaseHeld() {
   613	  const primary = leaseHeldFromFile(leasePath());
   614	  if (primary.held) return primary;
   615	
   616	  for (const legacyPath of legacyLeasePaths()) {
   617	    if (legacyPath === leasePath()) continue;
   618	    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
   619	    if (legacy.held || legacy.staleReclaimable) return legacy;
   620	  }
   621	
   622	  return primary;
   623	}
   624	
   625	function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
   626	  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   627	  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   628	  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   629	}
   630	
   631	async function waitForPidExit(pid, timeoutMs) {
   632	  const deadline = Date.now() + timeoutMs;
   633	  while (Date.now() <= deadline) {
   634	    if (processLiveness(pid) === 'dead') return true;
   635	    await sleep(100);
   636	  }
   637	  return processLiveness(pid) === 'dead';
   638	}
   639	
   640	async function reapOwnerBeforeRespawn(ownerPid) {
   641	  const liveness = processLiveness(ownerPid);
   642	  if (liveness === 'unknown-eperm') {
   643	    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
   644	  }
   645	  if (liveness === 'dead') {
   646	    return { allowed: true, reason: 'owner-already-dead' };
   647	  }
   648	
   649	  log(`confirmed-dead socket; reaping recorded code-index owner pid ${ownerPid} before respawn`);
   650	  try {
   651	    process.kill(ownerPid, 'SIGTERM');
   652	  } catch (error) {
   653	    if (error.code !== 'ESRCH') throw error;
   654	  }
   655	  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
   656	  if (!exitedAfterTerm) {
   657	    log(`code-index owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   658	    try {
   659	      process.kill(ownerPid, 'SIGKILL');
   660	    } catch (error) {
   661	      if (error.code !== 'ESRCH') throw error;
   662	    }
   663	    await waitForPidExit(ownerPid, 1000);
   664	  }
   665	  return { allowed: true, reason: 'owner-reaped' };
   666	}
   667	
   668	async function respawnAfterDeadSocket(leaseResult, decision, options = {}) {
   669	  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
   670	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
   671	    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
   672	  }
   673	
   674	  const ownerPid = options.respawnChildPid;
   675	  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
   676	    log('confirmed-dead socket but no recorded code-index child owner pid is available; respawn inert');
   677	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
   678	    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
   679	  }
   680	
   681	  let bootstrapLockHeld = false;
   682	  try {
   683	    bootstrapLockHeld = await acquireBootstrapLock({ requireLock: true });
   684	    const currentOwner = readOwnerLeaseFile();
   685	    if (currentOwner?.ownerPid !== ownerPid) {
   686	      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
   687	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   688	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   689	    }
   690	
   691	    const reapResult = await reapOwnerBeforeRespawn(ownerPid);
   692	    if (!reapResult.allowed) {
   693	      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
   694	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
   695	      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
   696	    }
   697	
   698	    clearOwnerLeaseFileIfOwner(ownerPid);
   699	    const lease = buildOwnerLease(process.pid);
   700	    if (!writeOwnerLeaseFileExclusive(lease)) {
   701	      const holder = readOwnerLeaseFile();
   702	      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
   703	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   704	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   705	    }
   706	    ownerLeasePid = process.pid;
   707	
   708	    buildIfNeeded([]);
   709	    writeLeaseFile();
   710	    launchServer();
   711	    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
   712	  } finally {
   713	    if (bootstrapLockHeld) {
   714	      fs.rmSync(lockDir, { recursive: true, force: true });
   715	    }
   716	  }
   717	}
   718	
   719	async function bridgeOrReportLeaseHeld(leaseResult, options = {}) {
   720	  const { maybeBridgeLeaseHolder } = loadBridgeModule();
   721	  const decision = await maybeBridgeLeaseHolder({
   722	    serviceName: 'mk-code-index',
   723	    leaseResult,
   724	    loggerPrefix: 'mk-code-index-launcher',
   725	    dbDir: resolvedDbDir(),
   726	    bridge: bridgeStdioThroughSessionProxy,
   727	  });
   728	  if (decision && decision.action === 'respawn') {
   729	    const respawnResult = await respawnAfterDeadSocket(leaseResult, decision, options);
   730	    if (respawnResult.action === 'respawn') {
   731	      emitLeaseMetric(leaseMetricClassForTransition('respawned'), {
   732	        ownerPid: leaseResult.ownerPid,
   733	        reason: respawnResult.reason,
   734	        socketPath: respawnResult.socketPath,
   735	      });
   736	    } else {
   737	      emitLeaseMetric(leaseMetricClassForTransition('heldByOther'), {
   738	        ownerPid: leaseResult.ownerPid,
   739	        reason: respawnResult.reason,
   740	        socketPath: respawnResult.socketPath,
   741	      });
   742	    }
   743	    return respawnResult;
   744	  }
   745	  emitLeaseMetric(
   746	    leaseMetricClassForTransition(decision?.action === 'bridge' ? 'bridgedSecondary' : 'heldByOther'),
   747	    {
   748	      ownerPid: leaseResult.ownerPid,
   749	      reason: decision?.reason ?? null,
   750	      socketPath: decision?.socketPath ?? leaseResult.socketPath ?? null,
   751	    },
   752	  );
   753	  return decision;
   754	}
   755	
   756	function writeLeaseFile() {
   757	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
   758	  const tmp = currentLeasePath + '.tmp.' + process.pid;
   759	  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: ownerSocketPath() }, null, 2), { mode: 0o600 });
   760	  fs.renameSync(tmp, currentLeasePath);

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/launcher-ipc-bridge.cjs | sed -n '1,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ COMPONENT: Launcher IPC Bridge                                         ║
     3	// ╠══════════════════════════════════════════════════════════════════════════╣
     4	// ║ PURPOSE: Provides daemon IPC paths, probes, and JSON-RPC helpers.       ║
     5	// ╚══════════════════════════════════════════════════════════════════════════╝
     6	'use strict';
     7	
     8	const fs = require('fs');
     9	const net = require('net');
    10	const path = require('path');
    11	const { StringDecoder } = require('string_decoder');
    12	
    13	const SOCKET_FILE_NAME = 'daemon-ipc.sock';
    14	const DEFAULT_PROBE_TIMEOUT_MS = 5000;
    15	const MAX_PROBE_TIMEOUT_MS = 6999;
    16	const DEFAULT_MODEL_SERVER_LOADING_MAX_MS = 150000;
    17	const JSON_RPC_PROTOCOL_VERSION = '2025-06-18';
    18	const MODEL_SERVER_HEALTH_PATH = '/api/health';
    19	let nextProbeId = 1;
    20	
    21	function parsePositiveInteger(value, fallback) {
    22	  if (value === undefined || value === null || String(value).trim() === '') return fallback;
    23	  const parsed = Number.parseInt(String(value).trim(), 10);
    24	  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    25	}
    26	
    27	function clampProbeTimeoutMs(value) {
    28	  return Math.min(value, MAX_PROBE_TIMEOUT_MS);
    29	}
    30	
    31	function resolveProbeTimeoutMs(options = {}) {
    32	  if (Number.isFinite(options.timeoutMs) && options.timeoutMs > 0) {
    33	    return clampProbeTimeoutMs(options.timeoutMs);
    34	  }
    35	  return clampProbeTimeoutMs(parsePositiveInteger(
    36	    (options.env ?? process.env).SPECKIT_PROBE_TIMEOUT_MS,
    37	    DEFAULT_PROBE_TIMEOUT_MS,
    38	  ));
    39	}
    40	
    41	function parseNonNegativeInteger(value, fallback) {
    42	  if (value === undefined || value === null || String(value).trim() === '') return fallback;
    43	  const parsed = Number.parseInt(String(value).trim(), 10);
    44	  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
    45	}
    46	
    47	// A single transient probe miss must NOT make a sibling reap the lease owner and respawn a second
    48	// daemon: a busy owner (e.g. mid-FTS-merge) can momentarily exceed the probe window. Require N
    49	// consecutive deep-probe failures before declaring the owner dead. Defaults keep the first probe at
    50	// its tuned full timeout and add one short retry plus a small backoff so the worst case stays inside
    51	// the probe grace ceiling — a genuinely dead socket fails fast, so only a hung daemon pays the retry.
    52	function resolveLeaseProbeAttempts(env = process.env) {
    53	  return 1 + parseNonNegativeInteger(env.SPECKIT_LEASE_PROBE_RETRIES, 1);
    54	}
    55	function resolveLeaseProbeRetryTimeoutMs(env = process.env) {
    56	  return clampProbeTimeoutMs(parsePositiveInteger(env.SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS, 1500));
    57	}
    58	function resolveLeaseProbeRetryBackoffMs(env = process.env) {
    59	  return parsePositiveInteger(env.SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS, 250);
    60	}
    61	
    62	function repoRoot() {
    63	  return path.resolve(__dirname, '..', '..', '..');
    64	}
    65	
    66	function defaultDbDirForService(serviceName) {
    67	  const root = repoRoot();
    68	  if (serviceName === 'mk-spec-memory') {
    69	    return path.join(root, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'database');
    70	  }
    71	  if (serviceName === 'mk-code-index') {
    72	    return process.env.SPECKIT_CODE_GRAPH_DB_DIR
    73	      ? path.resolve(process.env.SPECKIT_CODE_GRAPH_DB_DIR)
    74	      : path.join(root, '.opencode', '.spec-kit', 'code-graph', 'database');
    75	  }
    76	  if (serviceName === 'mk-skill-advisor') {
    77	    const advisorOverride = process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    78	    return advisorOverride
    79	      ? path.resolve(advisorOverride)
    80	      : path.join(root, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database');
    81	  }
    82	  throw new Error(`Unknown MCP service name: ${serviceName}`);
    83	}
    84	
    85	function getIpcSocketPath(serviceName, options = {}) {
    86	  if (process.env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
    87	    return process.env.SPECKIT_IPC_SOCKET_DIR;
    88	  }
    89	  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
    90	    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
    91	    : path.resolve(options.dbDir ?? defaultDbDirForService(serviceName));
    92	  return path.join(socketDir, SOCKET_FILE_NAME);
    93	}
    94	
    95	function toConnectionOptions(socketPath) {
    96	  if (!socketPath.startsWith('tcp://')) {
    97	    return socketPath;
    98	  }
    99	  const url = new URL(socketPath);
   100	  return {
   101	    host: url.hostname,
   102	    port: Number.parseInt(url.port, 10),
   103	  };
   104	}
   105	
   106	function bridgeStdioToSocket(socketPath, options = {}) {
   107	  const input = options.stdin ?? process.stdin;
   108	  const output = options.stdout ?? process.stdout;
   109	  const exit = options.exit ?? ((code) => process.exit(code));
   110	  const socket = net.createConnection(toConnectionOptions(socketPath));
   111	  let closed = false;
   112	
   113	  const closeOnce = (code = 0) => {
   114	    if (closed) return;
   115	    closed = true;
   116	    input.unpipe(socket);
   117	    socket.unpipe(output);
   118	    socket.destroy();
   119	    exit(code);
   120	  };
   121	
   122	  socket.once('connect', () => {
   123	    options.onConnect?.(socket);
   124	    input.pipe(socket);
   125	    socket.pipe(output);
   126	  });
   127	
   128	  socket.once('error', (error) => {
   129	    options.onError?.(error);
   130	    closeOnce(0);
   131	  });
   132	
   133	  socket.once('close', () => {
   134	    closeOnce(0);
   135	  });
   136	
   137	  input.once('end', () => {
   138	    socket.end();
   139	  });
   140	  input.once('close', () => {
   141	    closeOnce(0);
   142	  });
   143	  output.once('error', () => {
   144	    closeOnce(0);
   145	  });
   146	
   147	  return socket;
   148	}
   149	
   150	function probeDaemon(socketPath, options = {}) {
   151	  const timeoutMs = resolveProbeTimeoutMs(options);
   152	  const connect = options.connect ?? ((connectionOptions) => net.createConnection(connectionOptions));
   153	  // deepProbe=true REQUIRES a JSON-RPC initialize reply to call the daemon alive (detects a hung daemon
   154	  // that accepts the connection but never responds). Without it, a bare socket 'connect' counts as alive
   155	  // (connect-ok) — only safe for callers that genuinely need connection-liveness, NOT for the reap/bridge
   156	  // decision (which always passes deepProbe:true). See maybeBridgeLeaseHolder.
   157	  const deepProbe = options.deepProbe === true;
   158	  const id = nextProbeId++;
   159	  const request = `${JSON.stringify({
   160	    jsonrpc: '2.0',
   161	    id,
   162	    method: 'initialize',
   163	    params: {
   164	      protocolVersion: JSON_RPC_PROTOCOL_VERSION,
   165	      capabilities: {},
   166	      clientInfo: { name: 'liveness-probe', version: '0' },
   167	    },
   168	  })}\n`;
   169	
   170	  return new Promise((resolve) => {
   171	    let socket;
   172	    let settled = false;
   173	    let buffer = '';
   174	    let timer;
   175	    // Hold a multibyte char split across chunk boundaries until complete, so a probe reply
   176	    // carrying CJK/emoji (e.g. serverInfo strings) is not corrupted to U+FFFD mid-parse.
   177	    const decoder = new StringDecoder('utf8');
   178	
   179	    const finish = (status, reason) => {
   180	      if (settled) return;
   181	      settled = true;
   182	      if (timer) clearTimeout(timer);
   183	      if (socket) socket.destroy();
   184	      resolve({ status, reason });
   185	    };
   186	
   187	    try {
   188	      socket = connect(toConnectionOptions(socketPath));
   189	    } catch (error) {
   190	      finish('dead', error instanceof Error ? error.message : 'connect-threw');
   191	      return;
   192	    }
   193	
   194	    timer = setTimeout(() => finish('dead', 'timeout'), timeoutMs);
   195	    timer.unref?.();
   196	
   197	    socket.once('connect', () => {
   198	      if (!deepProbe) {
   199	        finish('alive', 'connect-ok');
   200	        return;
   201	      }
   202	      socket.write(request);
   203	    });
   204	    socket.on('data', (chunk) => {
   205	      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
   206	      let newlineIndex = buffer.indexOf('\n');
   207	      while (newlineIndex !== -1) {
   208	        const line = buffer.slice(0, newlineIndex).trim();
   209	        buffer = buffer.slice(newlineIndex + 1);
   210	        newlineIndex = buffer.indexOf('\n');
   211	        if (!line) continue;
   212	        try {
   213	          const parsed = JSON.parse(line);
   214	          if (
   215	            parsed &&
   216	            parsed.jsonrpc === '2.0' &&
   217	            parsed.id === id &&
   218	            (Object.prototype.hasOwnProperty.call(parsed, 'result') ||
   219	              Object.prototype.hasOwnProperty.call(parsed, 'error'))
   220	          ) {
   221	            finish('alive', 'json-rpc-reply');
   222	            return;
   223	          }
   224	        } catch {
   225	          // Ignore malformed or unrelated frames; the bounded probe decides liveness.
   226	        }
   227	      }
   228	    });
   229	    socket.once('error', (error) => {
   230	      finish('dead', error instanceof Error ? error.message : 'socket-error');
   231	    });
   232	    socket.once('close', () => {
   233	      finish('dead', 'closed-before-reply');
   234	    });
   235	  });
   236	}
   237	
   238	function parseHttpJsonResponse(buffer) {
   239	  const raw = buffer.toString('utf8');
   240	  const headerEnd = raw.indexOf('\r\n\r\n');
   241	  if (headerEnd === -1) return null;
   242	  const statusLine = raw.slice(0, raw.indexOf('\r\n'));
   243	  const statusMatch = statusLine.match(/^HTTP\/\d(?:\.\d)?\s+(\d+)/);
   244	  if (!statusMatch) return null;
   245	  const statusCode = Number.parseInt(statusMatch[1], 10);
   246	  const bodyRaw = raw.slice(headerEnd + 4).trim();
   247	  let body = null;
   248	  try {
   249	    body = bodyRaw ? JSON.parse(bodyRaw) : null;
   250	  } catch {
   251	    return { statusCode, body: null };
   252	  }
   253	  return { statusCode, body };
   254	}
   255	
   256	function probeModelServer(socketPath, options = {}) {
   257	  const timeoutMs = resolveProbeTimeoutMs(options);
   258	  const loadingMaxMs = Number.isFinite(options.loadingMaxMs) && options.loadingMaxMs > 0
   259	    ? options.loadingMaxMs
   260	    : parsePositiveInteger(
   261	      (options.env ?? process.env).SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS,
   262	      DEFAULT_MODEL_SERVER_LOADING_MAX_MS,
   263	    );
   264	  const nowMs = typeof options.nowMs === 'function' ? options.nowMs : () => Date.now();
   265	  const connect = options.connect ?? ((connectionOptions) => net.createConnection(connectionOptions));
   266	  // Mark this as the launcher's internal liveness probe so a cold-state demand listener can answer
   267	  // without spawning a model server. Genuine embed consumers do not send this header, so their
   268	  // wake-on-demand path is unchanged.
   269	  const request = `GET ${MODEL_SERVER_HEALTH_PATH} HTTP/1.1\r\nHost: localhost\r\nAccept: application/json\r\nX-Speckit-Probe: liveness\r\nConnection: close\r\n\r\n`;
   270	
   271	  return new Promise((resolve) => {
   272	    let socket;
   273	    let settled = false;
   274	    let chunks = [];
   275	    let timer;
   276	
   277	    // Carry the parsed health body so callers (the idle-eviction tick) can read
   278	    // lastSuccessfulEmbedAt / inFlight. The 'alive' branches below pass parsed.body as the 3rd arg.
   279	    const finish = (status, reason, health) => {
   280	      if (settled) return;
   281	      settled = true;
   282	      if (timer) clearTimeout(timer);
   283	      if (socket) socket.destroy();
   284	      resolve({ status, reason, health });
   285	    };
   286	
   287	    try {
   288	      socket = connect(toConnectionOptions(socketPath));
   289	    } catch (error) {
   290	      finish('dead', error instanceof Error ? error.message : 'connect-threw');
   291	      return;
   292	    }
   293	
   294	    timer = setTimeout(() => finish('dead', 'timeout'), timeoutMs);
   295	    timer.unref?.();
   296	
   297	    socket.once('connect', () => {
   298	      socket.write(request);
   299	    });
   300	    socket.on('data', (chunk) => {
   301	      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk ?? '')));
   302	    });
   303	    socket.once('end', () => {
   304	      const parsed = parseHttpJsonResponse(Buffer.concat(chunks));
   305	      const state = parsed && parsed.body && typeof parsed.body === 'object'
   306	        ? parsed.body.state
   307	        : null;
   308	      if (parsed && parsed.statusCode >= 200 && parsed.statusCode < 300 && state === 'ready') {
   309	        finish('alive', `health-${state}`, parsed.body);
   310	        return;
   311	      }
   312	      if (parsed && parsed.statusCode >= 200 && parsed.statusCode < 300 && state === 'loading') {
   313	        const loadStartedAt = parsed.body.loadStartedAt;
   314	        const loadProgressAt = parsed.body.loadProgressAt;
   315	        // The loading budget is per model-load attempt; device fallback re-stamps loadProgressAt.
   316	        const loadingMarker = Number.isFinite(loadProgressAt) && loadProgressAt > 0
   317	          ? loadProgressAt
   318	          : loadStartedAt;
   319	        if (Number.isFinite(loadingMarker) && loadingMarker > 0 && nowMs() - loadingMarker > loadingMaxMs) {
   320	          finish('dead', 'loading-wedged');
   321	          return;
   322	        }
   323	        finish('alive', 'health-loading', parsed.body);
   324	        return;
   325	      }
   326	      finish('dead', state === 'error' ? 'health-error' : 'health-not-ready');
   327	    });
   328	    socket.once('error', (error) => {
   329	      finish('dead', error instanceof Error ? error.message : 'socket-error');
   330	    });
   331	    socket.once('close', () => {
   332	      if (!settled && chunks.length === 0) finish('dead', 'closed-before-reply');
   333	    });
   334	  });
   335	}
   336	
   337	// Run the deep liveness probe up to `attempts` times; any 'alive' short-circuits to a bridge, and
   338	// only an all-failures run returns the final (dead) result so the caller respawns. The probe fn and
   339	// sleep are injectable so the retry decision is unit-testable without real sockets or timers.
   340	async function probeLeaseHolderWithRetries(socketPath, options = {}) {
   341	  const {
   342	    probe = probeDaemon,
   343	    firstTimeoutMs,
   344	    retryTimeoutMs = resolveLeaseProbeRetryTimeoutMs(),
   345	    retryBackoffMs = resolveLeaseProbeRetryBackoffMs(),
   346	    attempts = resolveLeaseProbeAttempts(),
   347	    connect,
   348	    sleepFn = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); }),
   349	    onRetry,
   350	  } = options;
   351	  const totalAttempts = Math.max(1, attempts);
   352	  let result = { status: 'dead', reason: 'no-probe-attempted' };
   353	  for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
   354	    const timeoutMs = attempt === 1 ? firstTimeoutMs : retryTimeoutMs;
   355	    result = await probe(socketPath, { timeoutMs, connect, deepProbe: true });
   356	    if (result.status === 'alive') return result;
   357	    if (attempt < totalAttempts) {
   358	      if (typeof onRetry === 'function') onRetry(attempt, totalAttempts, result);
   359	      await sleepFn(retryBackoffMs);
   360	    }
   361	  }
   362	  return result;
   363	}
   364	
   365	async function maybeBridgeLeaseHolder(options) {
   366	  const {
   367	    serviceName,
   368	    leaseResult,
   369	    loggerPrefix,
   370	    dbDir,
   371	    legacyReport,
   372	    probeTimeoutMs,
   373	    connect,
   374	    bridge,
   375	  } = options;
   376	  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   377	  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   378	  const ownerPid = leaseResult.ownerPid;
   379	  const writeLeaseHeld = (suffix = '') => {
   380	    process.stdout.write(`LEASE_HELD_BY:${ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   381	  };
   382	
   383	  if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1') {
   384	    if (legacyReport) {
   385	      legacyReport(leaseResult);
   386	      return { action: 'report', reason: 'bridge-disabled' };
   387	    }
   388	    writeLeaseHeld();
   389	    return { action: 'report', reason: 'bridge-disabled' };
   390	  }
   391	
   392	  // Prefer the path the lease owner actually recorded over recomputing one from env. Under a
   393	  // divergent SPECKIT_IPC_SOCKET_DIR (e.g. a secondary launcher in a different worktree env), the
   394	  // recomputed path can miss the live socket and false-report 'no-bridge-socket'. Only trust the
   395	  // stored path when it still exists on disk; tcp:// endpoints bypass the existence check. Fall back
   396	  // to recomputation for legacy leases that predate socketPath and for the other launchers whose
   397	  // leases never carry it.
   398	  const storedSocketPath = leaseResult.socketPath;
   399	  const usableStoredSocketPath = typeof storedSocketPath === 'string'
   400	    && storedSocketPath.length > 0
   401	    && (storedSocketPath.startsWith('tcp://') || fs.existsSync(storedSocketPath))
   402	    ? storedSocketPath
   403	    : null;
   404	  const socketPath = usableStoredSocketPath ?? getIpcSocketPath(serviceName, { dbDir });
   405	  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
   406	    writeLeaseHeld(' (no-bridge-socket)');
   407	    return { action: 'report', reason: 'no-bridge-socket', socketPath };
   408	  }
   409	
   410	  // deepProbe: REQUIRE a JSON-RPC reply, not just a socket accept. The reap/bridge decision must
   411	  // detect a HUNG daemon (event loop wedged / deadlocked — it still accepts the UDS connection but
   412	  // never services requests). A connect-ok-only probe would bridge a client to the wedged daemon and
   413	  // hang it forever, never respawning. The raised probe timeout (default 5000ms, < the 7000ms launcher
   414	  // grace) already prevents false-reaping a busy-but-responsive daemon mid-FTS-merge, so deep probing
   415	  // does not regress that.
   416	  // Require N consecutive failures (not one transient miss) before reaping a sibling's owner.
   417	  const probeAttempts = resolveLeaseProbeAttempts();
   418	  const probe = await probeLeaseHolderWithRetries(socketPath, {
   419	    firstTimeoutMs: probeTimeoutMs,
   420	    attempts: probeAttempts,
   421	    connect,
   422	    onRetry: (attempt, total, result) => process.stderr.write(
   423	      `[${loggerPrefix}] lease holder pid=${ownerPid} probe ${attempt}/${total} not alive (${result.reason}); retrying\n`,
   424	    ),
   425	  });
   426	  if (probe.status !== 'alive') {
   427	    process.stderr.write(`[${loggerPrefix}] lease holder pid=${ownerPid} socket=${socketPath} failed ${probeAttempts} consecutive liveness probes: ${probe.reason}\n`);
   428	    return { action: 'respawn', reason: probe.reason, socketPath };
   429	  }
   430	
   431	  process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
   432	  const bridgeToSocket = bridge ?? bridgeStdioToSocket;
   433	  // Await so an injected reconnecting bridge (whose start() resolves after the first
   434	  // attach) is fully wired before returning. The raw bridge returns a socket, not a
   435	  // promise, so Promise.resolve keeps the original fire-and-forget timing for it.
   436	  await Promise.resolve(bridgeToSocket(socketPath, {
   437	    onError: () => {
   438	      writeLeaseHeld(' (bridge-refused)');
   439	    },
   440	  }));
   441	  return { action: 'bridge', socketPath };
   442	}
   443	
   444	module.exports = {
   445	  DEFAULT_MODEL_SERVER_LOADING_MAX_MS,
   446	  bridgeStdioToSocket,
   447	  getIpcSocketPath,
   448	  maybeBridgeLeaseHolder,
   449	  probeDaemon,
   450	  probeLeaseHolderWithRetries,
   451	  probeModelServer,
   452	  resolveLeaseProbeAttempts,
   453	  resolveLeaseProbeRetryBackoffMs,
   454	  resolveLeaseProbeRetryTimeoutMs,
   455	  toConnectionOptions,
   456	};

exec
/bin/zsh -lc "rg --files .opencode/skills/system-code-graph/mcp_server | rg '("'^|/)(index|db|database|owner-lease|socket-server)'"\\.(ts|js)"'$|initDb|database'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/handlers/index.ts
.opencode/skills/system-code-graph/mcp_server/index.ts
.opencode/skills/system-code-graph/mcp_server/lib/index.ts
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts
.opencode/skills/system-code-graph/mcp_server/tools/index.ts

codex
The current code already has part of GLM’s recommendation in the bridge: deep JSON-RPC probing and respawn on failed probe are present. The weak spot I’m checking now is earlier classification and ownership safety: a missing socket still reports, primary lease UID isn’t checked, and stale owner acquisition unlinks before the exclusive create.
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '1180,1320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1180	    }
  1181	
  1182	    writeLeaseFile();
  1183	    const reprobe = readLeaseFile();
  1184	    if (!reprobe || reprobe.pid !== process.pid) {
  1185	      const startedAt = reprobe?.startedAt ?? new Date(0).toISOString();
  1186	      process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'} startedAt=${startedAt}\n`);
  1187	      process.exit(0);
  1188	    }
  1189	    launchServer();
  1190	  } catch (error) {
  1191	    log(`failed: ${JSON.stringify({ start: started, end: now(), actions, error: error.message })}`);
  1192	    log(error.stack || error.message);
  1193	    process.exit(1);
  1194	  } finally {
  1195	    if (lockHeld) {
  1196	      fs.rmSync(lockDir, { recursive: true, force: true });
  1197	    }
  1198	  }
  1199	}
  1200	
  1201	// Run only when invoked directly as the launcher script; stay inert (just export) when required by a
  1202	// test, so the reconnecting-proxy wiring above can be unit-checked without spawning the daemon.
  1203	if (require.main === module) {
  1204	  bootstrapLauncherEnv();
  1205	  void launcherMain();
  1206	}
  1207	
  1208	function configureLauncherPathsForTesting(nextPaths) {
  1209	  if (nextPaths.skillsDir) skillsDir = nextPaths.skillsDir;
  1210	  if (nextPaths.kitDir) kitDir = nextPaths.kitDir;
  1211	  if (nextPaths.dbDir) dbDir = nextPaths.dbDir;
  1212	  if (nextPaths.lockDir) lockDir = nextPaths.lockDir;
  1213	  if (nextPaths.stateFile) stateFile = nextPaths.stateFile;
  1214	}
  1215	
  1216	module.exports = {
  1217	  CODE_INDEX_REPLAYABLE_TOOL_NAMES,
  1218	  CODE_INDEX_UNSAFE_TOOL_NAMES,
  1219	  LEASE_METRIC_TRANSITION_CLASS,
  1220	  classifyCodeIndexFrame,
  1221	  bridgeStdioThroughSessionProxy,
  1222	  MAINTAINER_CATEGORY_ENV,
  1223	  resolveMaintainerModeCategories,
  1224	  configureLeaseMetricSinkForTesting,
  1225	  emitLeaseMetric,
  1226	  leaseMetricClassForTransition,
  1227	  leaseMetricCounterName,
  1228	  acquireBootstrapLock,
  1229	  acquireOwnerLeaseFile,
  1230	  artifactsReady,
  1231	  clearOwnerLeaseFile,
  1232	  ownerLeasePath,
  1233	  readOwnerLeaseFile,
  1234	  reapOwnerBeforeRespawn,
  1235	  removeStaleBootstrapLock,
  1236	  readBootstrapLockOwnerPid,
  1237	  configureLauncherPathsForTesting,
  1238	};

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-code-review/references/review_core.md | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: Review Core Doctrine
     3	description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
     4	trigger_phrases:
     5	  - "findings first severity ordering"
     6	  - "review finding schema"
     7	  - "severity contract for merge decisions"
     8	  - "evidence file line citation"
     9	  - "baseline surface precedence"
    10	  - "baseline check families"
    11	importance_tier: important
    12	contextType: implementation
    13	version: 1.5.0.11
    14	---
    15	
    16	# Review Core Doctrine
    17	
    18	Shared doctrine consumed by both `@review` and `@deep-review`.
    19	
    20	---
    21	
    22	## 1. OVERVIEW
    23	
    24	Shared findings-first review doctrine for both single-pass and deep-review workflows.
    25	
    26	---
    27	
    28	## 2. SEVERITY DEFINITIONS
    29	
    30	| Level | Meaning | Handling |
    31	| --- | --- | --- |
    32	| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
    33	| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
    34	| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |
    35	
    36	Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly.
    37	
    38	### Numeric Severity Calibration
    39	
    40	Numeric scores are advisory context, not the gate. A reviewer may add an optional `riskScore` to a finding and adjust it by `+/-2` for local context such as exploitability, blast radius, user impact, confidence, or proven containment. The merge/block decision remains the severity contract above: `P0` blocks, `P1` requires remediation, and `P2` is advisory. Do not adopt `score>=4` or any numeric threshold as a blocker.
    41	
    42	---
    43	
    44	## 3. EVIDENCE REQUIREMENTS
    45	
    46	- Every `P0` and `P1` finding must include a concrete `file:line` citation.
    47	- Evidence must tie the finding to observed code behavior, not just a general concern.
    48	- `P2` findings should still include specific evidence when available, even if impact is advisory.
    49	- If evidence is incomplete, state the assumption and why the risk still matters.
    50	
    51	---
    52	
    53	## 4. FINDINGS OUTPUT ORDERING
    54	
    55	- Present findings before summary or praise sections.
    56	- Order findings by severity first: `P0`, then `P1`, then `P2`.
    57	- Keep ordering stable within a severity bucket by impact and confidence.
    58	- Separate required fixes from optional suggestions so merge decisions stay clear.
    59	
    60	---
    61	
    62	## 5. BASELINE + SURFACE PRECEDENCE
    63	
    64	Apply this skill as the baseline first, then pair it with `sk-code` surface evidence when available:
    65	
    66	- Detected code surface -> `sk-code:<surface>`
    67	- Unclear surfaces -> baseline-only plus explicit uncertainty
    68	
    69	Precedence rules:
    70	
    71	- Baseline security and correctness minimums are always enforced.
    72	- Surface style, process, build, and test conventions override generic baseline guidance.
    73	- Unclear conflicts must be escalated rather than guessed.
    74	
    75	---
    76	
    77	## 6. BASELINE CHECK FAMILIES
    78	
    79	Mandatory baseline families:
    80	
    81	- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling.
    82	- Security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, and reliability risks with security impact.
    83	
    84	These minimums cannot be relaxed by surface guidance.
    85	
    86	---
    87	
    88	## 7. FINDING SCHEMA
    89	
    90	Each finding should provide:
    91	
    92	| Field | Requirement |
    93	| --- | --- |
    94	| `id` | Stable label within the review report, such as `P1-001` |
    95	| `severity` | One of `P0`, `P1`, `P2` |
    96	| `title` | Short, risk-oriented summary |
    97	| `file` | Primary `path:line` location |
    98	| `evidence` | Plain-language explanation tied to observed code |
    99	| `findingClass` | One of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` |
   100	| `scopeProof` | Grep/test/audit evidence that the recommendation covers same-class sites and consumers, or proves the finding is instance-only |
   101	| `affectedSurfaceHints` | Optional string array of producer/consumer surfaces the fix should address; recommended for actionable findings, required for cross-consumer findings. Use free-form short strings, max about 5 entries. Optional for instance-only findings. |
   102	| `riskScore` | Optional advisory number for relative risk calibration; never gating and never a substitute for `severity` |
   103	| `recommendation` | Specific, scope-proportional fix or follow-up |
   104	
   105	Suggested shape:
   106	
   107	```markdown
   108	### P1-001 [P1] Missing authorization check
   109	- File: path/to/file.ts:42
   110	- Evidence: Request handling reaches the write path before role validation.
   111	- Finding class: cross-consumer
   112	- Scope proof: `rg -n "permission guard|write path" path/to` shows the write handler is the only unchecked consumer.
   113	- Affected surface hints: ["request handler", "write path", "permission guard"]
   114	- riskScore: 6 (advisory only)
   115	- Recommendation: Enforce the existing permission guard before mutation.
   116	```
   117	
   118	---
   119	
   120	## 8. RELATED RESOURCES
   121	
   122	- [review_ux_single_pass.md](./review_ux_single_pass.md) - Interactive single-pass report flow and next-step prompts.
   123	- [quick_reference.md](./quick_reference.md) - Lightweight index across baseline review references.
   124	- [security_checklist.md](../assets/security_checklist.md) - Security and reliability checks.
   125	- [code_quality_checklist.md](../assets/code_quality_checklist.md) - Correctness, KISS, DRY, and maintainability checks.
   126	
   127	---

exec
/bin/zsh -lc "rg -n \"function initDb|initDb\\(|wal_autocheckpoint|journal_mode|wal_checkpoint|checkpoint|migrate|copyFile|sqlite\" .opencode/skills/system-code-graph/mcp_server/index.ts .opencode/skills/system-code-graph/mcp_server/dist/index.js .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/handlers -g '"'!node_modules'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1709:    // between the per-depth queries. better-sqlite3 transactions in WAL mode
.opencode/skills/system-code-graph/mcp_server/lib/close-db-assertion.ts:5:import type Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/README.md:245:| `initDb()` / `getDb()` / `closeDb()` | Functions | Manage the SQLite graph database lifecycle. |
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:6:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:8:  copyFileSync,
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:68:  'code-graph.sqlite',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:69:  'code-graph.sqlite-wal',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:70:  'code-graph.sqlite-shm',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:115:    copyFileSync(source, join(targetDir, fileName));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:142:    copyFileSync(source, tripletPath(dbDir, fileName));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:148:function runIntegrityCheck(sqlitePath: string): string {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:149:  if (!existsSync(sqlitePath)) {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:152:  const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:217:    integrityCheck = runIntegrityCheck(join(recoveryDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:253:  const sqlitePath = tripletPath(dbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:258:    integrityCheck = runIntegrityCheck(sqlitePath);
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:259:    if (existsSync(sqlitePath)) {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:260:      const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:313:    if (restored && existsSync(tripletPath(dbDir, 'code-graph.sqlite'))) {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:314:      const db = new Database(tripletPath(dbDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:316:        db.pragma('wal_checkpoint(TRUNCATE)');
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:37:export type ApplyOperation = 'rescan' | 'prune-excludes' | 'repair-nodes' | 'recover-sqlite-corruption' | 'rollback-bad-apply';
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:108:  'recover-sqlite-corruption',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:335:    case 'recover-sqlite-corruption':
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:6:import type Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:5:// Uses separate code-graph.sqlite alongside the memory index DB.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:10:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:334:    SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_graph_tombstones'
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:690:    SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:797:  const migrate = database.transaction(() => {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:808:  migrate();
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:825:    SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'code_edges'
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:942:  const migrate = database.transaction(() => {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:949:  migrate();
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027:export function initDb(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1031:    dbPath = join(dbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1035:    // BEFORE journal_mode/foreign_keys so any incidental contention during
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1038:    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1063:  if (!db) initDb(DATABASE_DIR);

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-code/references/opencode/javascript/style_guide.md | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: JavaScript Style Guide
     3	description: Formatting standards and naming conventions for JavaScript files in the OpenCode development environment.
     4	trigger_phrases:
     5	  - "opencode javascript style guide"
     6	  - "javascript file header format"
     7	  - "use strict directive"
     8	  - "javascript section organization"
     9	importance_tier: normal
    10	contextType: implementation
    11	version: 3.5.0.12
    12	---
    13	
    14	# JavaScript Style Guide
    15	
    16	Formatting standards and naming conventions for JavaScript files in the OpenCode development environment.
    17	
    18	---
    19	
    20	## 1. OVERVIEW
    21	
    22	### Purpose
    23	
    24	Defines consistent styling rules for JavaScript files to ensure readability, maintainability, and alignment across all OpenCode JavaScript code.
    25	
    26	### When to Use
    27	
    28	- Writing new JavaScript files
    29	- Reviewing JavaScript code for consistency
    30	- Resolving style disagreements in code review
    31	
    32	---
    33	
    34	## 2. FILE HEADER FORMAT
    35	
    36	All JavaScript files MUST begin with a boxed header identifying the module.
    37	For `.mjs` files and OpenCode plugin loader paths, keep the same header style
    38	but follow ESM module syntax instead of CommonJS.
    39	
    40	### Template
    41	
    42	```javascript
    43	// ╔══════════════════════════════════════════════════════════════════════════╗
    44	// ║ [Module Name]                                                             ║
    45	// ╚══════════════════════════════════════════════════════════════════════════╝
    46	```
    47	
    48	### Requirements
    49	
    50	- Box width: 78 characters total
    51	- Module name: Centered or left-aligned within box
    52	- Immediately followed by `'use strict';` directive for `.js/.cjs` files
    53	- `.mjs` and plugin ESM files do not require `'use strict'`
    54	
    55	**Evidence**: `.opencode/skills/system-spec-kit/scripts/utils/logger.ts:1-3`,
    56	`.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts:1-3`
    57	
    58	---
    59	
    60	## 3. USE STRICT DIRECTIVE
    61	
    62	Every `.js` and `.cjs` JavaScript file MUST include the strict mode directive.
    63	Do not add it to `.mjs` files; ES modules are strict by definition and the
    64	alignment verifier intentionally skips `.mjs` strict-mode enforcement.
    65	
    66	```javascript
    67	'use strict';
    68	```
    69	
    70	**Placement**: Immediately after file header, before any other code.
    71	
    72	**Evidence**: `verify_alignment_drift.py` skips `.mjs`; CommonJS-style JS
    73	helpers still use `'use strict'`.
    74	
    75	---
    76	
    77	## 4. SECTION ORGANIZATION
    78	
    79	Large files are organized using numbered section dividers.
    80	
    81	### Section Divider Template
    82	
    83	```javascript
    84	// ─────────────────────────────────────────────────────────────────────────────
    85	// 1. [SECTION NAME]
    86	// ─────────────────────────────────────────────────────────────────────────────
    87	```
    88	
    89	### Standard Section Order
    90	
    91	| Order | Section Name     | Purpose                           |
    92	|-------|------------------|-----------------------------------|
    93	| 1     | IMPORTS/REQUIRES | Module dependencies               |
    94	| 2     | CONSTANTS        | Configuration values, magic numbers |
    95	| 3     | HELPERS          | Internal utility functions        |
    96	| 4     | CORE LOGIC       | Main implementation               |
    97	| 5     | EXPORTS          | Module public interface           |
    98	
    99	**Evidence**: `.opencode/skills/system-spec-kit/scripts/core/config.ts`
   100	
   101	---
   102	
   103	## 5. NAMING CONVENTIONS
   104	
   105	### Function Names
   106	
   107	**Style**: `camelCase`
   108	
   109	```javascript
   110	// CORRECT
   111	function loadConfig(path) { }
   112	function memorySearch(query, options) { }
   113	function validateInput(data) { }
   114	
   115	// INCORRECT
   116	function load_config(path) { }     // snake_case
   117	function LoadConfig(path) { }      // PascalCase
   118	function load-config(path) { }     // kebab-case (invalid syntax)
   119	```
   120	
   121	**Evidence**: MDN Web Docs, Airbnb Style Guide, Node.js core APIs
   122	
   123	### Constant Names
   124	
   125	**Style**: `UPPER_SNAKE_CASE`
   126	
   127	```javascript
   128	// CORRECT
   129	const MAX_RETRIES = 3;
   130	const DEFAULT_TIMEOUT = 5000;
   131	const SQLITE_BUSY_TIMEOUT = 30000;
   132	
   133	// INCORRECT
   134	const maxRetries = 3;       // camelCase
   135	const max_retries = 3;      // snake_case (reserved for variables)
   136	```
   137	
   138	**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/core/config.ts`
   139	
   140	### Class Names
   141	
   142	**Style**: `PascalCase`
   143	
   144	```javascript
   145	// CORRECT
   146	class MemoryError extends Error { }
   147	class ConfigLoader { }
   148	class VectorIndex { }
   149	
   150	// INCORRECT
   151	class memoryError { }       // camelCase
   152	class memory_error { }      // snake_case
   153	```
   154	
   155	**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts`
   156	
   157	### Variable Names
   158	
   159	| Scope        | Style        | Example                          |
   160	|--------------|--------------|----------------------------------|
   161	| Local        | `camelCase`  | `const searchResults = []`       |
   162	| Module-level | `camelCase`  | `const dbPath = '...'`           |
   163	| Parameters   | `camelCase`  | `function search(query, maxResults)` |
   164	
   165	### Boolean Names
   166	
   167	**Style**: `camelCase` with `is`/`has`/`can`/`should` prefix
   168	
   169	```javascript
   170	// CORRECT
   171	const isValid = true;
   172	const hasResults = items.length > 0;
   173	const canProceed = !isBlocked;
   174	const shouldRetry = attempts < MAX_RETRIES;
   175	
   176	// INCORRECT
   177	const is_valid = true;       // snake_case
   178	const valid = true;          // ambiguous
   179	```
   180	

exec
/bin/zsh -lc "nl -ba .opencode/skills/sk-code-review/assets/test_quality_checklist.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: Test Quality Checklist
     3	description: Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.
     4	trigger_phrases:
     5	  - "test quality review checklist"
     6	  - "tests that cannot fail"
     7	  - "test smell detection"
     8	  - "coverage quality assessment"
     9	  - "test pyramid awareness"
    10	importance_tier: normal
    11	contextType: implementation
    12	version: 1.5.0.7
    13	---
    14	
    15	# Test Quality Checklist
    16	
    17	Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.
    18	
    19	---
    20	
    21	## 1. OVERVIEW
    22	
    23	### Purpose
    24	
    25	Provide a systematic pass for test defects that reduce confidence in code correctness or mask regressions.
    26	
    27	### Usage
    28	
    29	Apply when the diff changes tests; check each item against the test diff and flag false-confidence patterns that mask regressions.
    30	
    31	### Core Principle
    32	
    33	Tests that cannot fail are worse than no tests. They create false confidence and hide real defects.
    34	
    35	---
    36	
    37	## 2. COVERAGE QUALITY
    38	
    39	Flag:
    40	- Test functions that execute code paths without any assertions (assertion-free execution).
    41	- Test suites covering only happy-path scenarios with no error or edge case validation.
    42	- Changed behavior that lacks a corresponding test update or addition.
    43	- New public API surface introduced without any test coverage.
    44	- Snapshot or golden-file tests that auto-pass because the baseline was never updated after behavior changes.
    45	
    46	Review prompts:
    47	- "Does every test function contain at least one meaningful assertion?"
    48	- "Are failure modes and boundary conditions tested alongside the happy path?"
    49	- "Do the tests cover the behavior that actually changed in this diff?"
    50	
    51	Severity guidance:
    52	- P0 for assertion-free test functions (silently passing tests that verify nothing).
    53	- P1 for changed behavior with no corresponding test update.
    54	- P2 for missing edge case coverage on low-risk paths.
    55	
    56	---
    57	
    58	## 3. TEST STRUCTURE AND CLARITY
    59	
    60	Flag:
    61	- Test functions missing clear Arrange/Act/Assert separation.
    62	- Test names that do not describe the scenario or expected outcome.
    63	- Magic values in test data without comments explaining their significance.
    64	- Multiple unrelated assertions in a single test function.
    65	- Test setup that obscures the behavior under test.
    66	
    67	Review prompts:
    68	- "Can a reader determine what this test validates from the name alone?"
    69	- "Is the test data traceable to a specific requirement or edge case?"
    70	- "Would a failure message from this test pinpoint the broken behavior?"
    71	
    72	Severity guidance:
    73	- P2 default for structural clarity issues.
    74	- P1 if poor structure makes regression detection unreliable (for example, a multi-assertion test where early failures mask later ones).
    75	
    76	---
    77	
    78	## 4. TEST INDEPENDENCE AND RELIABILITY
    79	
    80	Flag:
    81	- Tests that depend on execution order or results from prior tests.
    82	- Shared mutable state between test functions without proper reset.
    83	- Tests that rely on wall-clock timing, network availability, or filesystem state.
    84	- Missing cleanup or teardown for resources created during test setup.
    85	- Tests that pass in isolation but fail when run with the full suite (or vice versa).
    86	
    87	Review prompts:
    88	- "Can each test run independently in any order and produce the same result?"
    89	- "Does the test rely on external state that could change between runs?"
    90	- "Is shared state properly isolated or reset between test functions?"
    91	
    92	Severity guidance:
    93	- P1 for flaky tests or tests with execution-order dependencies.
    94	- P2 for missing teardown or cleanup that does not yet cause observed failures.
    95	
    96	---
    97	
    98	## 5. TEST SMELL DETECTION
    99	
   100	Flag:
   101	- Tests tightly coupled to implementation details (breaking on safe refactors).
   102	- Over-mocking that replaces the system under test with stubs, testing mock behavior instead of real behavior.
   103	- Conditional logic (if/else, try/catch) inside test functions that creates untested branches.
   104	- Catch blocks inside tests that swallow assertion failures and convert them to passing results.
   105	- Copy-paste duplication across test functions without shared helpers or parameterized tests.
   106	
   107	Review prompts:
   108	- "Would a safe refactor (rename, extract method) break this test without changing behavior?"
   109	- "Is this test verifying real system behavior or just mock wiring?"
   110	- "Does any catch block inside a test risk swallowing an assertion error?"
   111	
   112	Severity guidance:
   113	- P0 for catch blocks that swallow assertion failures (tests that cannot fail).
   114	- P1 for over-mocking that makes the test unable to detect real defects.
   115	- P2 for implementation coupling or copy-paste duplication.
   116	
   117	---
   118	
   119	## 6. TEST PYRAMID AWARENESS
   120	
   121	Flag:
   122	- Unit tests that require database, network, or filesystem access (should be integration tests).
   123	- End-to-end tests for logic that can be validated at the unit level.
   124	- New external service calls or integrations introduced without integration test coverage.
   125	- Test suite dominated by one level (all unit, all E2E) with no balance.
   126	
   127	Review prompts:
   128	- "Is this test at the right level of the test pyramid for what it validates?"
   129	- "Does a new external dependency have at least one integration-level test?"
   130	- "Could this slow integration test be replaced by a faster unit test?"
   131	
   132	Severity guidance:
   133	- P2 default for test-level misplacement.
   134	- P1 when wrong test level creates a confidence gap (for example, unit-testing an integration boundary without any integration test).
   135	
   136	---
   137	
   138	## 7. RELATED RESOURCES
   139	
   140	- [quick_reference.md](../references/quick_reference.md) - Baseline review flow and severity output contract.
   141	- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, performance, KISS, and DRY checks.
   142	- [security_checklist.md](./security_checklist.md) - Security, authz, abuse, and privacy risk checks.
   143	- [solid_checklist.md](./solid_checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture risk prompts.
   144	
   145	Surface portability: pair this baseline with surface-specific test guidance from `sk-code`.

codex
The migration copy is already serialized behind the bootstrap lock and uses `COPYFILE_EXCL`; that supports part of GLM’s safety story. What it does not do is checkpoint before copying, and the current `initDb` only sets WAL mode/busy timeout/foreign keys, so the WAL-size hardening is still missing.
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | sed -n '1000,1085p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1000	  database.exec('CREATE INDEX IF NOT EXISTS idx_parser_skip_list_retry_class ON parser_skip_list(retry_class)');
  1001	
  1002	  const now = new Date().toISOString();
  1003	  database.prepare(`
  1004	    INSERT OR IGNORE INTO parser_skip_list (
  1005	      file_path, error_class, retry_class, error_message, added_at, last_seen_at, attempt_count, source
  1006	    )
  1007	    SELECT
  1008	      file_path,
  1009	      'B1',
  1010	      'fatal',
  1011	      error_message,
  1012	      ?,
  1013	      ?,
  1014	      MAX(1, error_count),
  1015	      'seed'
  1016	    FROM parse_diagnostics
  1017	    WHERE error_message LIKE '%resolved is not a function%'
  1018	  `).run(now, now);
  1019	
  1020	  ensureCodeEdgeBitemporalSchema(database, 'code-edge bitemporal migration');
  1021	  if (codeGraphEdgeGovernanceVocabEnabled()) {
  1022	    ensureCodeEdgeGovernanceVocabSchema(database, 'code-edge governance vocabulary migration');
  1023	  }
  1024	}
  1025	
  1026	/** Initialize (or get) the code graph database */
  1027	export function initDb(dbDir: string): Database.Database {
  1028	  if (db) return db;
  1029	
  1030	  try {
  1031	    dbPath = join(dbDir, 'code-graph.sqlite');
  1032	    db = new Database(dbPath);
  1033	    // Explicit busy_timeout so concurrent writers wait up to 5s
  1034	    // for the writer lock instead of throwing SQLITE_BUSY immediately. Set
  1035	    // BEFORE journal_mode/foreign_keys so any incidental contention during
  1036	    // PRAGMA setup also benefits from the wait.
  1037	    db.pragma('busy_timeout = 5000');
  1038	    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
  1039	    db.pragma('foreign_keys = ON');
  1040	    db.exec(SCHEMA_SQL);
  1041	    ensureSchemaMigrations(db);
  1042	
  1043	    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
  1044	    if (!versionRow) {
  1045	      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
  1046	    } else if (versionRow.version < SCHEMA_VERSION) {
  1047	      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
  1048	    }
  1049	
  1050	    return db;
  1051	  } catch (err) {
  1052	    if (db) {
  1053	      try { db.close(); } catch { /* best effort cleanup for failed init */ }
  1054	    }
  1055	    db = null;
  1056	    dbPath = null;
  1057	    throw err;
  1058	  }
  1059	}
  1060	
  1061	/** Get the current database instance (lazy-initializes if needed) */
  1062	export function getDb(): Database.Database {
  1063	  if (!db) initDb(DATABASE_DIR);
  1064	  // initDb either assigns the singleton database or throws before this return.
  1065	  return db!;
  1066	}
  1067	
  1068	/** Close the database connection */
  1069	export function closeDb(): void {
  1070	  if (db) {
  1071	    db.close();
  1072	    db = null;
  1073	    dbPath = null;
  1074	  }
  1075	}
  1076	
  1077	export function closeDbWithAssertion(): void {
  1078	  const handle = db;
  1079	  closeDb();
  1080	  assertDbHandleClosed(handle);
  1081	}
  1082	
  1083	function getMetadata(key: string): string | null {
  1084	  const d = getDb();
  1085	  const row = d.prepare('SELECT value FROM code_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/package.json | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skills/system-code-graph/mcp_server/package.json: No such file or directory

exec
/bin/zsh -lc "rg -n \"mk-code-index-launcher|launcher-ipc-bridge|maybeBridgeLeaseHolder|probeLeaseHolderWithRetries|acquireOwnerLeaseFile|reapOwnerBeforeRespawn|migration|COPYFILE_EXCL|code-graph.sqlite-wal|wal_checkpoint|owner lease\" .opencode/skills/system-code-graph/mcp_server/tests .opencode/bin -g '*.ts' -g '*.cjs' -g '*.js'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-spec-memory-launcher.cjs:263:    return require('./lib/launcher-ipc-bridge.cjs');
.opencode/bin/mk-spec-memory-launcher.cjs:267:      async maybeBridgeLeaseHolder({ leaseResult }) {
.opencode/bin/mk-spec-memory-launcher.cjs:374:    // Missing or corrupt owner leases are treated as no active owner.
.opencode/bin/mk-spec-memory-launcher.cjs:463:function acquireOwnerLeaseFile() {
.opencode/bin/mk-spec-memory-launcher.cjs:528:    log('owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership');
.opencode/bin/mk-spec-memory-launcher.cjs:761:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:772:  // killing a process that is still ALIVE, require the owner lease to be heartbeat-stale
.opencode/bin/mk-spec-memory-launcher.cjs:839:      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:851:    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:894:  const { maybeBridgeLeaseHolder } = loadBridgeModule();
.opencode/bin/mk-spec-memory-launcher.cjs:895:  const decision = await maybeBridgeLeaseHolder({
.opencode/bin/mk-spec-memory-launcher.cjs:1372:    log('launchServer skipped: spec-memory owner lease is absent or owned by another launcher');
.opencode/bin/mk-spec-memory-launcher.cjs:1402:    log('owner lease refresh failed after child spawn; launcher pid remains the recorded owner');
.opencode/bin/mk-spec-memory-launcher.cjs:1631:      const ownerLeaseResult = acquireOwnerLeaseFile();
.opencode/bin/mk-spec-memory-launcher.cjs:1666:            const { probeLeaseHolderWithRetries } = loadBridgeModule();
.opencode/bin/mk-spec-memory-launcher.cjs:1669:              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
.opencode/bin/mk-spec-memory-launcher.cjs:1697:        // Daemon is dead, unbridgeable, or alive but failing its liveness probe. Reclaiming an existing STALE owner lease is a
.opencode/bin/mk-spec-memory-launcher.cjs:1821:  acquireOwnerLeaseFile,
.opencode/bin/mk-spec-memory-launcher.cjs:1832:  reapOwnerBeforeRespawn,
.opencode/bin/mk-code-index-launcher.cjs:40:      process.stderr.write(`[mk-code-index-launcher] env value for ${key} contains control chars; skipping\n`);
.opencode/bin/mk-code-index-launcher.cjs:44:      process.stderr.write(`[mk-code-index-launcher] env ${key} from ${path.basename(filePath)} is not allowlisted; skipping\n`);
.opencode/bin/mk-code-index-launcher.cjs:85:      if (n > 0) process.stderr.write(`[mk-code-index-launcher] loaded ${n} env(s) from ${fname}\n`);
.opencode/bin/mk-code-index-launcher.cjs:102:      `[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for ${maintainerCategories.join(', ')}\n`
.opencode/bin/mk-code-index-launcher.cjs:113:let lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
.opencode/bin/mk-code-index-launcher.cjs:114:const PID_FILE_NAME = '.mk-code-index-launcher.json';
.opencode/bin/mk-code-index-launcher.cjs:135:  process.stderr.write(`[mk-code-index-launcher] ${message}\n`);
.opencode/bin/mk-code-index-launcher.cjs:166:    return require('./lib/launcher-ipc-bridge.cjs');
.opencode/bin/mk-code-index-launcher.cjs:170:      async maybeBridgeLeaseHolder({ leaseResult }) {
.opencode/bin/mk-code-index-launcher.cjs:224:  lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
.opencode/bin/mk-code-index-launcher.cjs:339:    // Missing or corrupt owner leases are treated as no active owner.
.opencode/bin/mk-code-index-launcher.cjs:392:// secondary start rewrites the owner lease before rediscovering the live
.opencode/bin/mk-code-index-launcher.cjs:404:    log('owner lease heartbeat refresh failed (superseded); stopping heartbeat');
.opencode/bin/mk-code-index-launcher.cjs:474:function acquireOwnerLeaseFile() {
.opencode/bin/mk-code-index-launcher.cjs:576:// (.mk-code-index-launcher.json) or the owner lease (.code-graph-owner.json) names a live process.
.opencode/bin/mk-code-index-launcher.cjs:578:  return pidLiveAt(path.join(dir, '.mk-code-index-launcher.json'), 'pid')
.opencode/bin/mk-code-index-launcher.cjs:640:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:686:      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
.opencode/bin/mk-code-index-launcher.cjs:691:    const reapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-code-index-launcher.cjs:720:  const { maybeBridgeLeaseHolder } = loadBridgeModule();
.opencode/bin/mk-code-index-launcher.cjs:721:  const decision = await maybeBridgeLeaseHolder({
.opencode/bin/mk-code-index-launcher.cjs:724:    loggerPrefix: 'mk-code-index-launcher',
.opencode/bin/mk-code-index-launcher.cjs:980:      log('owner lease refresh to child pid failed; launcher pid remains the recorded owner');
.opencode/bin/mk-code-index-launcher.cjs:1043:  // Orphan daemon pid recorded by a reclaimed prior owner lease. A SIGKILL'd
.opencode/bin/mk-code-index-launcher.cjs:1060:      const ownerLeaseResult = acquireOwnerLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:1072:        // maybeBridgeLeaseHolder falls back to a LEASE_HELD_BY diagnostic line
.opencode/bin/mk-code-index-launcher.cjs:1111:      // only one launcher migrate; the COPYFILE_EXCL + pre-copy re-check below is the belt-and-
.opencode/bin/mk-code-index-launcher.cjs:1116:      //   writing — probe BOTH the former PID lease and the former owner lease for liveness first.
.opencode/bin/mk-code-index-launcher.cjs:1117:      //   The former owner lease (.code-graph-owner.json) is intentionally NOT copied forward.
.opencode/bin/mk-code-index-launcher.cjs:1119:      const migrationTarget = resolvedDbDir();
.opencode/bin/mk-code-index-launcher.cjs:1121:          && !exists(path.join(migrationTarget, 'code-graph.sqlite'))
.opencode/bin/mk-code-index-launcher.cjs:1124:        fs.mkdirSync(migrationTarget, { recursive: true, mode: 0o700 });
.opencode/bin/mk-code-index-launcher.cjs:1128:          'code-graph.sqlite-wal',
.opencode/bin/mk-code-index-launcher.cjs:1130:          '.mk-code-index-launcher.json',
.opencode/bin/mk-code-index-launcher.cjs:1134:        // clobber the freshly-migrated DB. EEXIST from COPYFILE_EXCL means another launcher
.opencode/bin/mk-code-index-launcher.cjs:1137:        if (!exists(path.join(migrationTarget, 'code-graph.sqlite'))) {
.opencode/bin/mk-code-index-launcher.cjs:1141:              const dst = path.join(migrationTarget, file);
.opencode/bin/mk-code-index-launcher.cjs:1143:                // COPYFILE_EXCL makes the copy fail with EEXIST rather than truncate-
.opencode/bin/mk-code-index-launcher.cjs:1145:                fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL);
.opencode/bin/mk-code-index-launcher.cjs:1153:              log('migration skipped: target already present (EEXIST); treating existing target as authoritative');
.opencode/bin/mk-code-index-launcher.cjs:1161:            `[mk-code-index-launcher] migrated DB from ${rel(formerSharedDbDir)} to ${rel(migrationTarget)} (former location preserved)\n`
.opencode/bin/mk-code-index-launcher.cjs:1170:    // Reap the orphan daemon recorded by the reclaimed prior owner lease before
.opencode/bin/mk-code-index-launcher.cjs:1175:      const reapResult = await reapOwnerBeforeRespawn(reclaimedOrphanPid);
.opencode/bin/mk-code-index-launcher.cjs:1229:  acquireOwnerLeaseFile,
.opencode/bin/mk-code-index-launcher.cjs:1234:  reapOwnerBeforeRespawn,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:84:describe('code edge governance vocabulary migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:140:      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:215:      expect(() => ensureCodeEdgeGovernanceVocabSchema(database, 'test migration'))
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:230:  it('rolls the CHECK migration down and can re-run safely', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:248:      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:255:      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration rerun');
.opencode/bin/mk-skill-advisor-launcher.cjs:143:    return require('./lib/launcher-ipc-bridge.cjs');
.opencode/bin/mk-skill-advisor-launcher.cjs:156:      async maybeBridgeLeaseHolder({ leaseResult, legacyReport }) {
.opencode/bin/mk-skill-advisor-launcher.cjs:336:    // Missing or corrupt owner leases are treated as no active owner.
.opencode/bin/mk-skill-advisor-launcher.cjs:423:async function reapOwnerBeforeRespawn(ownerPid, expectedExecutablePath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:506:function acquireOwnerLeaseFile() {
.opencode/bin/mk-skill-advisor-launcher.cjs:571:    log('owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership');
.opencode/bin/mk-skill-advisor-launcher.cjs:684:    const reapResult = await reapOwnerBeforeRespawn(targetPid, expectedExecutablePath);
.opencode/bin/mk-skill-advisor-launcher.cjs:705:      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:742:  const { maybeBridgeLeaseHolder } = loadBridgeModule();
.opencode/bin/mk-skill-advisor-launcher.cjs:743:  const decision = await maybeBridgeLeaseHolder({
.opencode/bin/mk-skill-advisor-launcher.cjs:758:  const ownerLeaseResult = acquireOwnerLeaseFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:1187:    log('launchServer skipped: skill-advisor owner lease is absent or owned by another launcher');
.opencode/bin/mk-skill-advisor-launcher.cjs:1287:        const reapResult = await reapOwnerBeforeRespawn(pendingBootstrapReapPid, reapExecutablePath);
.opencode/bin/mk-skill-advisor-launcher.cjs:1311:        log('bootstrap reprobe lost owner lease before PID guard write');
.opencode/bin/mk-skill-advisor-launcher.cjs:1371:  acquireOwnerLeaseFile,
.opencode/bin/mk-skill-advisor-launcher.cjs:1383:  reapOwnerBeforeRespawn,
.opencode/bin/lib/launcher-session-proxy.cjs:13:} = require('./launcher-ipc-bridge.cjs');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-maintainer-mode.vitest.ts:6:const launcher = require('../../../../bin/mk-code-index-launcher.cjs') as {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:77:describe('code edge bitemporal schema migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:130:      ensureCodeEdgeBitemporalSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:165:      ensureCodeEdgeBitemporalSchema(database, 'test migration');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:172:      ensureCodeEdgeBitemporalSchema(database, 'test migration rerun');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:198:  it('fails closed when required migration tables are missing', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:209:      expect(() => ensureCodeEdgeBitemporalSchema(database, 'test migration'))
.opencode/bin/lib/launcher-ipc-bridge.cjs:156:  // decision (which always passes deepProbe:true). See maybeBridgeLeaseHolder.
.opencode/bin/lib/launcher-ipc-bridge.cjs:340:async function probeLeaseHolderWithRetries(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:365:async function maybeBridgeLeaseHolder(options) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:418:  const probe = await probeLeaseHolderWithRetries(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:448:  maybeBridgeLeaseHolder,
.opencode/bin/lib/launcher-ipc-bridge.cjs:450:  probeLeaseHolderWithRetries,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:19:const launcherRelativePath = '.opencode/bin/mk-code-index-launcher.cjs';
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:21:  '.opencode/bin/lib/launcher-ipc-bridge.cjs',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:24:const pidFileRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json';
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:253:    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 2000, 'owner lease');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:300:    const pidFilePath = join(dbDir, '.mk-code-index-launcher.json');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:323:    expect(existsSync(join(outsideDbDir, '.mk-code-index-launcher.json'))).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:353:  // ran the migration before any lock with a plain copyFileSync (no COPYFILE_EXCL) — letting both
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:359:    // lease there, so formerLocationOwnerLive() is false and migration is allowed). The content
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:377:    // Spawn two launchers simultaneously; both will attempt migration in the un-fixed code.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:382:    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 4000, 'owner lease');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:405:    // Exactly one migration occurred across both launchers. The un-fixed code (no lock gate,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:406:    // no COPYFILE_EXCL) can log this line twice; the fix gates migration on the single
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:408:    const migrationLines = (first.stderr + second.stderr).match(/migrated DB from/g) ?? [];
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:409:    expect(migrationLines).toHaveLength(1);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:416:  it('reclaims a stale-heartbeat owner lease with a live PID', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:450:  // Two launchers reclaiming the SAME pre-existing stale-heartbeat owner lease at once.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:451:  // Both read the identical stale lease and BOTH enter acquireOwnerLeaseFile's reclaim branch
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:454:  // fresh-create path. This test seeds a stale-heartbeat owner lease owned by a LIVE helper pid
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:474:  // migration-block scenario.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:490:        // Seed a stale-heartbeat owner lease owned by a LIVE helper pid so classifyOwnerLease
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:523:        // owner lease (a launcher reclaimed it). Once a launcher has reclaimed, the holder must
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:528:          `seeded stale holder to be reclaimed out of the owner lease (round ${round})`,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:534:          /^\[mk-code-index-launcher\] failed:/m.test(run.stderr) || run.child.exitCode === 1;
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:590:      '.mk-code-index-launcher.json',
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:22:  writeFileSync(join(dir, 'code-graph.sqlite-wal'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:18:export const codeIndexLauncherPath = join(worktreeRoot, '.opencode/bin/mk-code-index-launcher.cjs');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:305:  expect(existsSync(join(dbDir, '.mk-code-index-launcher.lockdir'))).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:375:  return join(dbDir, '.mk-code-index-launcher.json');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:412:        && /mk-code-index-launcher|system-code-graph\/mcp_server\/dist\/index\.js/.test(line);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:50:describe('owner lease lifecycle', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:158:  it('treats stored v1 fingerprints as a scope migration requiring a blocked read', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:159:    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-scope-v1-migration-'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:534:    it('round-trips deterministic v2 fingerprints and rejects v1 fingerprints for migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:165:  it('seeds B1 rows from parse_diagnostics during migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:11:describe('code-index CLI owner lease and respawn locking', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:12:  it('serializes concurrent launcher starts to one owner lease', async () => {

exec
/bin/zsh -lc "rg -n \"process\\.kill|argv|cmdline|starttime|statSync\\(|getuid|uid|chown|foreign|pid reuse|pid-reuse|self-heal|LAUNCHER_DIAGNOSTIC|wal_autocheckpoint|MAX_INIT|STARTUP_GRACE|childSpawnedAt|reclaimedOrphanPid\" .opencode/bin/mk-code-index-launcher.cjs .opencode/bin/lib/launcher-ipc-bridge.cjs .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/tests -g '"'!node_modules'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-code-index-launcher.cjs:426:    process.kill(pid, 0);
.opencode/bin/mk-code-index-launcher.cjs:570:    try { process.kill(pid, 0); return true; } // live
.opencode/bin/mk-code-index-launcher.cjs:589:  // current user. A foreign-owned lease in a shared/former path could otherwise point this
.opencode/bin/mk-code-index-launcher.cjs:591:  if (legacyPath && typeof process.getuid === 'function') {
.opencode/bin/mk-code-index-launcher.cjs:593:      if (fs.statSync(filePath).uid !== process.getuid()) {
.opencode/bin/mk-code-index-launcher.cjs:602:    process.kill(lease.pid, 0);
.opencode/bin/mk-code-index-launcher.cjs:651:    process.kill(ownerPid, 'SIGTERM');
.opencode/bin/mk-code-index-launcher.cjs:659:      process.kill(ownerPid, 'SIGKILL');
.opencode/bin/mk-code-index-launcher.cjs:810:  if (!exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
.opencode/bin/mk-code-index-launcher.cjs:818:  if (exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
.opencode/bin/mk-code-index-launcher.cjs:893:    ageMs = Date.now() - fs.statSync(lockDir).mtimeMs;
.opencode/bin/mk-code-index-launcher.cjs:996:      process.kill(process.pid, signal);
.opencode/bin/mk-code-index-launcher.cjs:1048:  let reclaimedOrphanPid = null;
.opencode/bin/mk-code-index-launcher.cjs:1066:        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:1174:    if (Number.isInteger(reclaimedOrphanPid) && reclaimedOrphanPid > 0) {
.opencode/bin/mk-code-index-launcher.cjs:1175:      const reapResult = await reapOwnerBeforeRespawn(reclaimedOrphanPid);
.opencode/bin/mk-code-index-launcher.cjs:1177:        log(`reclaimed orphan daemon pid ${reclaimedOrphanPid} could not be reaped (${reapResult.reason}); not spawning a second daemon`);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1374:    const stats = statSync(gitignorePath);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1473:          const stat = statSync(fullPath);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1518:      const stat = statSync(workspaceCandidate.originalPath);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1766:      const stats = statSync(workspaceCandidate.originalPath);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1839:        const stats = statSync(workspaceCandidate.originalPath);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:111:      '/workspace/self-heal.sh',
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:119:    recordSuccess('/workspace/self-heal.sh');
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:123:    expect(getSkipListEntry('/workspace/self-heal.sh')).toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:328:    const tempDir = mkdtempSync(join(tmpdir(), 'parser-skip-list-self-heal-'));
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:346:    const first = parser.parse('echo bad', 'bash', undefined, '/workspace/self-heal.sh');
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:348:    expect(dynamicSkipList.getSkipListEntry('/workspace/self-heal.sh')).toMatchObject({
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:354:    const second = parser.parse('echo good', 'bash', undefined, '/workspace/self-heal.sh');
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:358:    expect(dynamicSkipList.getSkipListEntry('/workspace/self-heal.sh')).toBeNull();
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:147:// inside an allowed root, the path is an actual socket, and it is owned by the current uid.
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:166:    const stat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:170:    if (typeof process.getuid === 'function' && stat.uid !== process.getuid()) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:275:      const st = fs.statSync(socketDir);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:276:      const uid = typeof process.getuid === 'function' ? process.getuid() : null;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:277:      if (uid !== null && st.uid !== uid) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:278:        throw new Error(`IPC socket dir ${socketDir} not owned by current user (uid ${st.uid} != ${uid})`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:292:      const linkStat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:373:      // as reclaimable, so we re-bind instead of aborting; a foreign-owned node still refuses.
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:396:    const boundStat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:105:    // A genuine pre-bound, same-uid socket node: the fence permits the unlink and the bind reclaims.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:201:    db.pragma('foreign_keys = OFF');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:203:    db.pragma('foreign_keys = ON');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:242:    db.pragma('foreign_keys = OFF');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:244:    db.pragma('foreign_keys = ON');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-ops-hardening.vitest.ts:20:  it('builds a hardening contract with repair and export/import guidance', () => {
.opencode/skills/system-code-graph/mcp_server/tests/README.md:104:| [../../README.md](../../README.md) | Skill-level overview and operator guide. |
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:60:      expect(Math.trunc(statSync(filePath).mtimeMs)).toBe(Math.trunc(t1.getTime()));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:95:  it('self-heals a pre-existing wedged empty lock (unparseable pid, aged past threshold)', () => {
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:105:    // pid, with an mtime far enough in the past to exceed the conservative self-heal age guard.
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:111:    // self-heal can. With it, the wedged orphan is removed and the refresh acquires cleanly.
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:126:    // so the self-heal must NOT touch it; refresh backs off (returns false) instead of stealing it.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:669:    return Math.trunc(statSync(filePath).mtimeMs);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1035:    // BEFORE journal_mode/foreign_keys so any incidental contention during
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1039:    db.pragma('foreign_keys = ON');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:2309:    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:44:  it.skipIf(typeof process.getuid !== 'function')(
.opencode/skills/system-code-graph/mcp_server/lib/README.md:279:| [../../README.md](../../README.md) | Skill-level overview and operator guide. |
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:67:// binary or a hard crash between openSync and writeFileSync, and is self-healed once.
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:109:// Age (ms) of the lock file, or null if it cannot be stat'd. Used to gate self-healing of
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:113:    return now - statSync(lockPath).mtimeMs;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:294:  processKill: (pid: number, signal: 0) => boolean = process.kill,
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:293:// not self-healing, so nothing here re-parses, clears, or otherwise repairs
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:408:      // self-healing (an incremental scan re-skips quarantined files), so a
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:204:        expect(Math.trunc(statSync(filePath).mtimeMs)).toBe(Math.trunc(fixedTime.getTime()));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:273:    process.kill(entry.pid, 'SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:281:      process.kill(entry.pid, 'SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:311:  process.kill(lease.ownerPid, 'SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:314:    process.kill(lease.ownerPid, 'SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:380:    process.kill(pid, 0);
.opencode/skills/system-code-graph/mcp_server/lib/utils/README.md:85:| [../../../README.md](../../../README.md) | Skill-level overview and operator guide. |

codex
There is already a CLI-style test harness for this launcher, including concurrent migration and stale-heartbeat cases. For the wedge cases, the likely clean path is to extend that harness rather than inventing a separate runner, because it already creates an isolated temp worktree and launches the real `.cjs` entrypoint.
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/package.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "name": "@spec-kit/system-code-graph",
     3	  "version": "1.0.0",
     4	  "private": true,
     5	  "type": "module",
     6	  "scripts": {
     7	    "build": "tsc --build tsconfig.json",
     8	    "typecheck": "tsc --noEmit -p tsconfig.json",
     9	    "clean": "rm -rf dist mcp_server/dist",
    10	    "rebuild": "npm run clean && npm run build",
    11	    "test": "vitest run",
    12	    "test:watch": "vitest"
    13	  },
    14	  "dependencies": {
    15	    "@modelcontextprotocol/sdk": "^1.24.3",
    16	    "better-sqlite3": "^12.6.2",
    17	    "ignore": "^5.3.2",
    18	    "tree-sitter-wasms": "^0.1.13",
    19	    "web-tree-sitter": "^0.24.7",
    20	    "zod": "^4.1.12"
    21	  },
    22	  "devDependencies": {
    23	    "@types/better-sqlite3": "^7.6.13",
    24	    "@types/node": "^25.2.1",
    25	    "typescript": "^5.9.3",
    26	    "vitest": "^4.0.18"
    27	  }
    28	}

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { spawn, type ChildProcess, type ChildProcessWithoutNullStreams } from 'node:child_process';
     2	import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
     3	import { createRequire } from 'node:module';
     4	import { tmpdir } from 'node:os';
     5	import { dirname, join, resolve } from 'node:path';
     6	import { fileURLToPath } from 'node:url';
     7	import { afterEach, describe, expect, it } from 'vitest';
     8	
     9	// These paths are test fixtures coupled to the production launcher layout.
    10	// If a launcher moves, update the fixture path and copied production file together.
    11	
    12	interface LauncherRun {
    13	  child: ChildProcessWithoutNullStreams;
    14	  stdout: string;
    15	  stderr: string;
    16	}
    17	
    18	const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
    19	const launcherRelativePath = '.opencode/bin/mk-code-index-launcher.cjs';
    20	const launcherLibRelativePaths = [
    21	  '.opencode/bin/lib/launcher-ipc-bridge.cjs',
    22	  '.opencode/bin/lib/launcher-session-proxy.cjs',
    23	] as const;
    24	const pidFileRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json';
    25	const ownerLeaseRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-owner.json';
    26	const tempDirs: string[] = [];
    27	const launcherRuns: LauncherRun[] = [];
    28	const require = createRequire(import.meta.url);
    29	const launcherModule = require(join(repoRoot, launcherRelativePath)) as {
    30	  configureLeaseMetricSinkForTesting: (sink: ((payload: Record<string, unknown>) => void) | null) => void;
    31	  emitLeaseMetric: (leaseClass: string, details?: Record<string, unknown>) => void;
    32	  leaseMetricClassForTransition: (transition: string) => string;
    33	  leaseMetricCounterName: (leaseClass: string) => string;
    34	};
    35	
    36	function createWorkspace(options: { ignoreChildSigterm?: boolean } = {}): { root: string; launcherPath: string; pidFilePath: string } {
    37	  const root = mkdtempSync(join(tmpdir(), 'mk-code-index-lease-'));
    38	  tempDirs.push(root);
    39	
    40	  const launcherPath = join(root, launcherRelativePath);
    41	  mkdirSync(dirname(launcherPath), { recursive: true });
    42	  copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);
    43	  for (const relativePath of launcherLibRelativePaths) {
    44	    const destination = join(root, relativePath);
    45	    mkdirSync(dirname(destination), { recursive: true });
    46	    copyFileSync(join(repoRoot, relativePath), destination);
    47	  }
    48	
    49	  const directServer = join(root, '.opencode/skills/system-code-graph/mcp_server/dist/index.js');
    50	  mkdirSync(dirname(directServer), { recursive: true });
    51	  writeFileSync(
    52	    directServer,
    53	    options.ignoreChildSigterm
    54	      ? "process.on('SIGTERM', () => {}); process.on('SIGINT', () => process.exit(0)); setTimeout(() => process.exit(0), 6500); setInterval(() => {}, 1000);\n"
    55	      : "process.on('SIGTERM', () => process.exit(0)); process.on('SIGINT', () => process.exit(0)); setInterval(() => {}, 1000);\n",
    56	    'utf8',
    57	  );
    58	
    59	  return { root, launcherPath, pidFilePath: join(root, pidFileRelativePath) };
    60	}
    61	
    62	function spawnLauncher(launcherPath: string, root: string, env: NodeJS.ProcessEnv = {}): LauncherRun {
    63	  const baseEnv = { ...process.env };
    64	  delete baseEnv.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER;
    65	  delete baseEnv.MK_CODE_INDEX_STRICT_SINGLE_WRITER;
    66	  delete baseEnv.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER;
    67	  delete baseEnv.SPECKIT_CODE_GRAPH_DB_DIR;
    68	
    69	  const run: LauncherRun = {
    70	    child: spawn(process.execPath, [launcherPath], {
    71	      cwd: root,
    72	      env: { ...baseEnv, ...env },
    73	      stdio: ['ignore', 'pipe', 'pipe'],
    74	    }),
    75	    stdout: '',
    76	    stderr: '',
    77	  };
    78	  run.child.stdout.setEncoding('utf8');
    79	  run.child.stderr.setEncoding('utf8');
    80	  run.child.stdout.on('data', (chunk) => {
    81	    run.stdout += chunk;
    82	  });
    83	  run.child.stderr.on('data', (chunk) => {
    84	    run.stderr += chunk;
    85	  });
    86	  launcherRuns.push(run);
    87	  return run;
    88	}
    89	
    90	async function waitFor(predicate: () => boolean, timeoutMs: number, label: string): Promise<void> {
    91	  const deadline = Date.now() + timeoutMs;
    92	  while (Date.now() <= deadline) {
    93	    if (predicate()) return;
    94	    await new Promise((resolve) => setTimeout(resolve, 25));
    95	  }
    96	  throw new Error(`Timed out waiting for ${label}`);
    97	}
    98	
    99	async function waitForExit(
   100	  child: ChildProcess,
   101	  timeoutMs: number,
   102	): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
   103	  if (child.exitCode !== null || child.signalCode !== null) {
   104	    return { code: child.exitCode, signal: child.signalCode };
   105	  }
   106	  return await new Promise((resolve, reject) => {
   107	    const timeout = setTimeout(() => {
   108	      child.off('exit', onExit);
   109	      reject(new Error(`Timed out waiting for pid ${child.pid} to exit`));
   110	    }, timeoutMs);
   111	    const onExit = (code: number | null, signal: NodeJS.Signals | null) => {
   112	      clearTimeout(timeout);
   113	      resolve({ code, signal });
   114	    };
   115	    child.once('exit', onExit);
   116	  });
   117	}
   118	
   119	async function waitForStdoutClose(run: LauncherRun): Promise<void> {
   120	  if (run.child.stdout.closed) return;
   121	  await new Promise<void>((resolve) => {
   122	    run.child.stdout.once('close', () => resolve());
   123	  });
   124	}
   125	
   126	async function terminate(run: LauncherRun): Promise<void> {
   127	  if (run.child.exitCode !== null || run.child.signalCode !== null) return;
   128	  run.child.kill('SIGTERM');
   129	    try {
   130	      await waitForExit(run.child, 1000);
   131	    } catch {
   132	      run.child.kill('SIGKILL');
   133	      try {
   134	        await waitForExit(run.child, 1000);
   135	      } catch {
   136	        // Best-effort teardown; the temp dir cleanup below is authoritative.
   137	      }
   138	    }
   139	  }
   140	
   141	function readLeasePid(pidFilePath: string): number | null {
   142	  try {
   143	    const parsed = JSON.parse(readFileSync(pidFilePath, 'utf8')) as { pid?: unknown };
   144	    return typeof parsed.pid === 'number' ? parsed.pid : null;
   145	  } catch {
   146	    return null;
   147	  }
   148	}
   149	
   150	function readOwnerLeasePid(root: string): number | null {
   151	  try {
   152	    const parsed = JSON.parse(readFileSync(join(root, ownerLeaseRelativePath), 'utf8')) as { ownerPid?: unknown };
   153	    return typeof parsed.ownerPid === 'number' ? parsed.ownerPid : null;
   154	  } catch {
   155	    return null;
   156	  }
   157	}
   158	
   159	async function waitForLeasePid(pidFilePath: string, pid: number | undefined): Promise<void> {
   160	  if (typeof pid !== 'number') throw new Error('launcher pid was not assigned');
   161	  await waitFor(() => readLeasePid(pidFilePath) === pid, 2000, `lease pid ${pid}`);
   162	}
   163	
   164	async function createDeadPid(): Promise<number> {
   165	  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
   166	    stdio: 'ignore',
   167	  });
   168	  await new Promise<void>((resolve, reject) => {
   169	    child.once('spawn', () => resolve());
   170	    child.once('error', reject);
   171	  });
   172	  if (typeof child.pid !== 'number') {
   173	    throw new Error('dead-pid child did not get a pid');
   174	  }
   175	  const pid = child.pid;
   176	  child.kill('SIGTERM');
   177	  await waitForExit(child, 1000);
   178	  return pid;
   179	}
   180	
   181	async function createLivePid(): Promise<ChildProcess> {
   182	  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
   183	    stdio: 'ignore',
   184	  });
   185	  await new Promise<void>((resolve, reject) => {
   186	    child.once('spawn', () => resolve());
   187	    child.once('error', reject);
   188	  });
   189	  if (typeof child.pid !== 'number') {
   190	    throw new Error('live-pid child did not get a pid');
   191	  }
   192	  return child;
   193	}
   194	
   195	describe('mk-code-index launcher lease', () => {
   196	  afterEach(async () => {
   197	    launcherModule.configureLeaseMetricSinkForTesting(null);
   198	    while (launcherRuns.length > 0) {
   199	      const run = launcherRuns.pop();
   200	      if (run) await terminate(run);
   201	    }
   202	    while (tempDirs.length > 0) {
   203	      const dir = tempDirs.pop();
   204	      if (dir) rmSync(dir, { recursive: true, force: true });
   205	    }
   206	  });
   207	
   208	  // Duplicate launcher exits before opening SQLite.
   209	  it('classifies lease metric transitions and emits through a no-op-default sink', () => {
   210	    expect(launcherModule.leaseMetricClassForTransition('heldByOther')).toBe('held-by-other');
   211	    expect(launcherModule.leaseMetricClassForTransition('bridgedSecondary')).toBe('bridged-secondary');
   212	    expect(launcherModule.leaseMetricClassForTransition('staleReclaimed')).toBe('stale-reclaimed');
   213	    expect(launcherModule.leaseMetricClassForTransition('respawned')).toBe('respawned');
   214	    expect(launcherModule.leaseMetricCounterName('stale-reclaimed')).toBe('mk_code_index_lease_stale_reclaimed_total');
   215	
   216	    launcherModule.emitLeaseMetric('held-by-other', { ownerPid: 123 });
   217	    const emitted: Array<Record<string, unknown>> = [];
   218	    launcherModule.configureLeaseMetricSinkForTesting((payload) => emitted.push(payload));
   219	    launcherModule.emitLeaseMetric('bridged-secondary', { ownerPid: 456, reason: 'bridge' });
   220	
   221	    expect(emitted).toHaveLength(1);
   222	    expect(emitted[0]).toMatchObject({
   223	      counter: 'mk_code_index_lease_bridged_secondary_total',
   224	      class: 'bridged-secondary',
   225	      count: 1,
   226	      ownerPid: 456,
   227	      reason: 'bridge',
   228	    });
   229	    expect(typeof emitted[0].at).toBe('string');
   230	  });
   231	
   232	  it('exits with LEASE_HELD_BY when a live owner exists', async () => {
   233	    const workspace = createWorkspace();
   234	    const first = spawnLauncher(workspace.launcherPath, workspace.root);
   235	    await waitForLeasePid(workspace.pidFilePath, first.child.pid);
   236	
   237	    const second = spawnLauncher(workspace.launcherPath, workspace.root);
   238	    await waitForStdoutClose(second);
   239	    const exit = await waitForExit(second.child, 8000);
   240	    const ownerPid = readOwnerLeasePid(workspace.root);

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts | sed -n '240,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	    const ownerPid = readOwnerLeasePid(workspace.root);
   241	
   242	    expect(exit.code).toBe(0);
   243	    expect(ownerPid).not.toBeNull();
   244	    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
   245	    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${ownerPid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
   246	  });
   247	
   248	  it('lets exactly one concurrent launcher own the lease', async () => {
   249	    const workspace = createWorkspace();
   250	    const first = spawnLauncher(workspace.launcherPath, workspace.root);
   251	    const second = spawnLauncher(workspace.launcherPath, workspace.root);
   252	
   253	    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 2000, 'owner lease');
   254	    await waitFor(
   255	      () => first.child.exitCode !== null || second.child.exitCode !== null || first.stdout.includes('LEASE_HELD_BY') || second.stdout.includes('LEASE_HELD_BY'),
   256	      8000,
   257	      'one launcher to report lease held',
   258	    );
   259	
   260	    const ownerPid = readOwnerLeasePid(workspace.root);
   261	    const runs = [first, second];
   262	    const running = runs.filter((run) => run.child.exitCode === null && !run.stdout.includes('LEASE_HELD_BY:'));
   263	    const blocked = runs.filter((run) => run.stdout.includes('LEASE_HELD_BY:'));
   264	
   265	    expect(ownerPid).not.toBeNull();
   266	    expect(running).toHaveLength(1);
   267	    expect(blocked).toHaveLength(1);
   268	  });
   269	
   270	  // Live-owner diagnostics include the recorded startedAt value.
   271	  it('reports the lease startedAt value for a live owner', async () => {
   272	    const workspace = createWorkspace();
   273	    const holder = await createLivePid();
   274	    const startedAt = '2026-05-18T00:00:00.000Z';
   275	
   276	    try {
   277	      mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
   278	      writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: holder.pid, startedAt }));
   279	
   280	      const run = spawnLauncher(workspace.launcherPath, workspace.root);
   281	      await waitForStdoutClose(run);
   282	      const exit = await waitForExit(run.child, 8000);
   283	
   284	      expect(exit.code).toBe(0);
   285	      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt}`);
   286	    } finally {
   287	      holder.kill('SIGTERM');
   288	      try {
   289	        await waitForExit(holder, 1000);
   290	      } catch {
   291	        holder.kill('SIGKILL');
   292	      }
   293	    }
   294	  });
   295	
   296	  // The launcher lease follows the resolved code-graph DB directory.
   297	  it('stores the PID file next to SPECKIT_CODE_GRAPH_DB_DIR when overridden', async () => {
   298	    const workspace = createWorkspace();
   299	    const dbDir = join(workspace.root, 'shared-code-graph-db');
   300	    const pidFilePath = join(dbDir, '.mk-code-index-launcher.json');
   301	
   302	    const run = spawnLauncher(workspace.launcherPath, workspace.root, {
   303	      SPECKIT_CODE_GRAPH_DB_DIR: dbDir,
   304	    });
   305	    await waitForLeasePid(pidFilePath, run.child.pid);
   306	
   307	    expect(existsSync(pidFilePath)).toBe(true);
   308	    expect(existsSync(workspace.pidFilePath)).toBe(false);
   309	  });
   310	
   311	  it('rejects SPECKIT_CODE_GRAPH_DB_DIR outside the workspace', async () => {
   312	    const workspace = createWorkspace();
   313	    const outsideDbDir = mkdtempSync(join(tmpdir(), 'mk-code-index-outside-db-'));
   314	    tempDirs.push(outsideDbDir);
   315	
   316	    const run = spawnLauncher(workspace.launcherPath, workspace.root, {
   317	      SPECKIT_CODE_GRAPH_DB_DIR: outsideDbDir,
   318	    });
   319	    const exit = await waitForExit(run.child, 8000);
   320	
   321	    expect(exit.code).toBe(1);
   322	    expect(run.stderr).toContain('SPECKIT_CODE_GRAPH_DB_DIR must stay within workspace root');
   323	    expect(existsSync(join(outsideDbDir, '.mk-code-index-launcher.json'))).toBe(false);
   324	  });
   325	
   326	  it('does not load NODE_OPTIONS from project dotenv', async () => {
   327	    const workspace = createWorkspace();
   328	    writeFileSync(join(workspace.root, '.env.local'), 'NODE_OPTIONS=--require ./pwn.js\nSPECKIT_CODE_GRAPH_MAINTAINER_MODE=true\n');
   329	
   330	    const run = spawnLauncher(workspace.launcherPath, workspace.root);
   331	    await waitForLeasePid(workspace.pidFilePath, run.child.pid);
   332	
   333	    expect(run.stderr).toContain('env NODE_OPTIONS from .env.local is not allowlisted; skipping');
   334	  });
   335	
   336	  // Dead-PID lease files are reclaimable.
   337	  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
   338	    const workspace = createWorkspace();
   339	    mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
   340	    writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: await createDeadPid(), startedAt: new Date().toISOString() }));
   341	
   342	    const run = spawnLauncher(workspace.launcherPath, workspace.root);
   343	    await waitFor(() => /^.*staleReclaimed: true\b/m.test(run.stderr), 2000, 'stale reclaim log');
   344	    expect(run.stderr).toMatch(/^.*staleReclaimed: true\b/m);
   345	    await waitForLeasePid(workspace.pidFilePath, run.child.pid);
   346	
   347	    expect(readLeasePid(workspace.pidFilePath)).toBe(run.child.pid);
   348	  });
   349	
   350	  // Two concurrent launchers migrating a former-location DB into the same target must
   351	  // never clobber/truncate the live target. Exactly one launcher (the bootstrap-lock winner)
   352	  // migrates, and the target byte-content stays stable. Fails against the un-fixed code, which
   353	  // ran the migration before any lock with a plain copyFileSync (no COPYFILE_EXCL) — letting both
   354	  // launchers copy and a lagging copier overwrite the now-live target.
   355	  it('migrates a former-location DB exactly once under two concurrent launchers', async () => {
   356	    const workspace = createWorkspace();
   357	
   358	    // Seed the former shared standalone DB location with a code-graph.sqlite ONLY (no live PID
   359	    // lease there, so formerLocationOwnerLive() is false and migration is allowed). The content
   360	    // is a fixed, recognizable payload so we can assert byte-stability of the migrated target.
   361	    const formerDbDir = join(
   362	      workspace.root,
   363	      '.opencode',
   364	      '.spec-kit',
   365	      'code-graph',
   366	      'database',
   367	    );
   368	    mkdirSync(formerDbDir, { recursive: true });
   369	    const formerSqlite = join(formerDbDir, 'code-graph.sqlite');
   370	    // Deterministic, non-trivial payload (8 KiB of a fixed byte) so a partial/truncating
   371	    // overwrite would change either the length or the content.
   372	    const seededContent = Buffer.alloc(8 * 1024, 0x5a);
   373	    writeFileSync(formerSqlite, seededContent);
   374	
   375	    const targetSqlite = join(dirname(workspace.pidFilePath), 'code-graph.sqlite');
   376	
   377	    // Spawn two launchers simultaneously; both will attempt migration in the un-fixed code.
   378	    const first = spawnLauncher(workspace.launcherPath, workspace.root);
   379	    const second = spawnLauncher(workspace.launcherPath, workspace.root);
   380	
   381	    // Wait for an owner to be recorded and for one launcher to report lease-held (the loser).
   382	    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 4000, 'owner lease');
   383	    await waitFor(() => existsSync(targetSqlite), 4000, 'migrated target DB');
   384	    await waitFor(
   385	      () =>
   386	        first.child.exitCode !== null ||
   387	        second.child.exitCode !== null ||
   388	        first.stdout.includes('LEASE_HELD_BY') ||
   389	        second.stdout.includes('LEASE_HELD_BY'),
   390	      8000,
   391	      'one launcher to settle (lease held)',
   392	    );
   393	
   394	    // Snapshot the migrated target, then let everything settle and re-read: a lagging copier in
   395	    // the un-fixed code could overwrite/truncate the live target between these two reads.
   396	    const afterFirst = readFileSync(targetSqlite);
   397	    await new Promise((r) => setTimeout(r, 400));
   398	    const afterSettle = readFileSync(targetSqlite);
   399	
   400	    // The migrated DB must equal the seeded source and never change (byte-stability).
   401	    expect(afterFirst.equals(seededContent)).toBe(true);
   402	    expect(afterSettle.equals(seededContent)).toBe(true);
   403	    expect(afterSettle.length).toBe(seededContent.length);
   404	
   405	    // Exactly one migration occurred across both launchers. The un-fixed code (no lock gate,
   406	    // no COPYFILE_EXCL) can log this line twice; the fix gates migration on the single
   407	    // bootstrap-lock winner, so it appears exactly once.
   408	    const migrationLines = (first.stderr + second.stderr).match(/migrated DB from/g) ?? [];
   409	    expect(migrationLines).toHaveLength(1);
   410	
   411	    // Exactly one launcher owns the lease; the other bridges/reports.
   412	    const ownerPid = readOwnerLeasePid(workspace.root);
   413	    expect(ownerPid).not.toBeNull();
   414	  });
   415	
   416	  it('reclaims a stale-heartbeat owner lease with a live PID', async () => {
   417	    const workspace = createWorkspace();
   418	    const holder = await createLivePid();
   419	    const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
   420	    const dbDir = dirname(ownerLeasePath);
   421	
   422	    try {
   423	      mkdirSync(dbDir, { recursive: true });
   424	      writeFileSync(ownerLeasePath, JSON.stringify({
   425	        ownerPid: holder.pid,
   426	        ppid: process.pid,
   427	        executablePath: process.execPath,
   428	        startedAtIso: '2026-05-22T00:00:00.000Z',
   429	        lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
   430	        ttlMs: 10,
   431	        canonicalDbDir: resolve(dbDir),
   432	      }, null, 2));
   433	
   434	      const run = spawnLauncher(workspace.launcherPath, workspace.root);
   435	      await waitFor(() => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(run.stderr), 2000, 'stale-heartbeat owner reclaim log');
   436	      await waitForLeasePid(workspace.pidFilePath, run.child.pid);
   437	
   438	      expect(run.stderr).toContain(`ownerLeaseReclaimed: stale-heartbeat-reclaim ownerPid=${holder.pid}`);
   439	      expect(readOwnerLeasePid(workspace.root)).not.toBe(holder.pid);
   440	    } finally {
   441	      holder.kill('SIGTERM');
   442	      try {
   443	        await waitForExit(holder, 1000);
   444	      } catch {
   445	        holder.kill('SIGKILL');
   446	      }
   447	    }
   448	  });
   449	
   450	  // Two launchers reclaiming the SAME pre-existing stale-heartbeat owner lease at once.
   451	  // Both read the identical stale lease and BOTH enter acquireOwnerLeaseFile's reclaim branch
   452	  // (the acquire-time re-read CAS) — the path the existing concurrent-launcher test
   453	  // never reaches, because it spawns from a FRESH workspace where both take the O_EXCL 'wx'
   454	  // fresh-create path. This test seeds a stale-heartbeat owner lease owned by a LIVE helper pid
   455	  // (so classifyOwnerLease returns 'stale-heartbeat-reclaim') and spawns two launchers at once so
   456	  // both observe the same existing stale lease and both run the reclaim branch concurrently —
   457	  // genuinely new coverage of the concurrent reclaim path.
   458	  //
   459	  // SCOPE / DETERMINISM NOTE (honest): at the launcher-spawn boundary the acquire-time re-read CAS
   460	  // is NOT isolable from naive last-writer-wins, so this test does NOT claim to fail iff the
   461	  // re-read is deleted. Measured against both the patched launcher and a launcher with ONLY the
   462	  // acquire-time re-read removed, the spawned-process outcomes are statistically indistinguishable:
   463	  // single-writer is independently enforced by the bootstrap lock (acquireBootstrapLock), the PID
   464	  // lease, and the re-read-before-unlink guard in clearOwnerLeaseFile. The acquire-time
   465	  // re-read only narrows a sub-syscall window already covered by those guards.
   466	  //
   467	  // Two further measured facts make stronger end-state assertions UNSOUND at this layer, so this
   468	  // test deliberately does NOT assert them: (1) the concurrent reclaim does not reach a clean
   469	  // LEASE_HELD_BY/exit terminal state within seconds — both launchers can stay alive (one
   470	  // daemon-parent, one bridged-and-waiting); and (2) when both launchers pass the owner-lease gate,
   471	  // the downstream PID-lease write is last-writer-wins, so the recorded PID lease can legitimately
   472	  // flip between the two launchers' pids (observed clobber on the patched launcher too). These are
   473	  // launcher-runtime characteristics outside this test's deterministic assertions and the
   474	  // migration-block scenario.
   475	  //
   476	  // What this test asserts is what IS deterministically true and valuable as regression coverage:
   477	  // both concurrent launchers exercise the stale-heartbeat reclaim branch (new coverage — the
   478	  // existing concurrent test uses a FRESH workspace and only hits the O_EXCL fresh-create path),
   479	  // neither launcher errors/crashes in that path, and the seeded stale holder is reclaimed away —
   480	  // it never remains the recorded owner once both launchers have reclaimed.
   481	  it('exercises the concurrent stale-heartbeat reclaim branch in both launchers without errors', async () => {
   482	    const ROUNDS = 5;
   483	    for (let round = 0; round < ROUNDS; round += 1) {
   484	      const workspace = createWorkspace();
   485	      const holder = await createLivePid();
   486	      const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
   487	      const dbDir = dirname(ownerLeasePath);
   488	
   489	      try {
   490	        // Seed a stale-heartbeat owner lease owned by a LIVE helper pid so classifyOwnerLease
   491	        // returns 'stale-heartbeat-reclaim' (live pid + heartbeat older than 2*ttlMs), forcing
   492	        // both launchers down the reclaim branch rather than the fresh-create branch.
   493	        mkdirSync(dbDir, { recursive: true });
   494	        writeFileSync(ownerLeasePath, JSON.stringify({
   495	          ownerPid: holder.pid,
   496	          ppid: process.pid,
   497	          executablePath: process.execPath,
   498	          startedAtIso: '2026-05-22T00:00:00.000Z',
   499	          lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
   500	          ttlMs: 10,
   501	          canonicalDbDir: resolve(dbDir),
   502	        }, null, 2));
   503	
   504	        // Spawn both simultaneously so both observe the SAME existing stale lease and both enter
   505	        // the reclaim re-read CAS.
   506	        const first = spawnLauncher(workspace.launcherPath, workspace.root);
   507	        const second = spawnLauncher(workspace.launcherPath, workspace.root);
   508	
   509	        // BOTH must observe the stale lease and run the reclaim branch — the precondition that
   510	        // gives this test its coverage value (the existing concurrent test never reaches it).
   511	        await waitFor(
   512	          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(first.stderr),
   513	          4000,
   514	          `first launcher stale-heartbeat reclaim (round ${round})`,
   515	        );
   516	        await waitFor(
   517	          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(second.stderr),
   518	          4000,
   519	          `second launcher stale-heartbeat reclaim (round ${round})`,
   520	        );
   521	
   522	        // The reclaim must actually take effect: the seeded stale holder is gone from the recorded
   523	        // owner lease (a launcher reclaimed it). Once a launcher has reclaimed, the holder must
   524	        // never remain the owner. This is deterministically true (the holder lease is stale).
   525	        await waitFor(
   526	          () => readOwnerLeasePid(workspace.root) !== holder.pid,
   527	          4000,
   528	          `seeded stale holder to be reclaimed out of the owner lease (round ${round})`,
   529	        );
   530	
   531	        // Neither launcher crashed in the reclaim path (no failure log / non-1 exit). The reclaim
   532	        // either elects an owner or bridges; it must never raise an error.
   533	        const reclaimErrored = (run: LauncherRun): boolean =>
   534	          /^\[mk-code-index-launcher\] failed:/m.test(run.stderr) || run.child.exitCode === 1;
   535	        expect(reclaimErrored(first), `first launcher must not error in reclaim (round ${round})`).toBe(false);
   536	        expect(reclaimErrored(second), `second launcher must not error in reclaim (round ${round})`).toBe(false);
   537	
   538	        // And the stale holder never re-asserts ownership after the reclaim.
   539	        expect(readOwnerLeasePid(workspace.root), `seeded stale holder must not own the lease (round ${round})`).not.toBe(holder.pid);
   540	      } finally {
   541	        while (launcherRuns.length > 0) {
   542	          const run = launcherRuns.pop();
   543	          if (run) await terminate(run);
   544	        }
   545	        holder.kill('SIGTERM');
   546	        try {
   547	          await waitForExit(holder, 1000);
   548	        } catch {
   549	          holder.kill('SIGKILL');
   550	        }
   551	      }
   552	    }
   553	  });
   554	
   555	  // Clean child exit removes the lease file.
   556	  it('removes the PID file on clean exit', async () => {
   557	    const workspace = createWorkspace();
   558	    const run = spawnLauncher(workspace.launcherPath, workspace.root);
   559	    await waitForLeasePid(workspace.pidFilePath, run.child.pid);
   560	
   561	    run.child.kill('SIGTERM');
   562	    await waitForExit(run.child, 5000);
   563	
   564	    expect(existsSync(workspace.pidFilePath)).toBe(false);
   565	  });
   566	
   567	  // SIGQUIT follows the same lease cleanup path.
   568	  it('removes the PID file on SIGQUIT', async () => {
   569	    const workspace = createWorkspace();
   570	    const run = spawnLauncher(workspace.launcherPath, workspace.root);
   571	    await waitForLeasePid(workspace.pidFilePath, run.child.pid);
   572	
   573	    run.child.kill('SIGQUIT');
   574	    await waitForExit(run.child, 5000);
   575	
   576	    expect(existsSync(workspace.pidFilePath)).toBe(false);
   577	  });
   578	
   579	  // Live legacy launcher lease blocks rolling-start duplicates.
   580	  it('reports LEASE_HELD_BY from the legacy launcher lease path', async () => {
   581	    const workspace = createWorkspace();
   582	    const holder = await createLivePid();
   583	    const startedAt = '2026-05-18T00:00:00.000Z';
   584	    const legacyPath = join(
   585	      workspace.root,
   586	      '.opencode',
   587	      '.spec-kit',
   588	      'code-graph',
   589	      'database',
   590	      '.mk-code-index-launcher.json',
   591	    );
   592	
   593	    try {
   594	      mkdirSync(dirname(legacyPath), { recursive: true });
   595	      writeFileSync(legacyPath, JSON.stringify({ pid: holder.pid, startedAt }));
   596	
   597	      const run = spawnLauncher(workspace.launcherPath, workspace.root);
   598	      await waitForStdoutClose(run);
   599	      const exit = await waitForExit(run.child, 8000);
   600	
   601	      expect(exit.code).toBe(0);
   602	      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt} (legacy path)`);
   603	    } finally {
   604	      holder.kill('SIGTERM');
   605	      try {
   606	        await waitForExit(holder, 1000);
   607	      } catch {
   608	        holder.kill('SIGKILL');
   609	      }
   610	    }
   611	  });
   612	
   613	  // Parent SIGTERM cleanup clears launcher metadata without killing an ignored child.
   614	  it('removes the PID file when the child ignores SIGTERM until launcher cleanup timeout', async () => {
   615	    const workspace = createWorkspace({ ignoreChildSigterm: true });
   616	    const run = spawnLauncher(workspace.launcherPath, workspace.root);
   617	    await waitForLeasePid(workspace.pidFilePath, run.child.pid);
   618	
   619	    run.child.kill('SIGTERM');
   620	    await waitForExit(run.child, 8000);

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts | sed -n '1,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { spawn, execFile, type ChildProcess } from 'node:child_process';
     2	import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
     3	import { dirname, join, resolve } from 'node:path';
     4	import { tmpdir } from 'node:os';
     5	import { promisify } from 'node:util';
     6	import { fileURLToPath } from 'node:url';
     7	import { createRequire } from 'node:module';
     8	
     9	import { afterAll, afterEach, expect } from 'vitest';
    10	
    11	const require = createRequire(import.meta.url);
    12	const execFileAsync = promisify(execFile);
    13	
    14	const testDir = dirname(fileURLToPath(import.meta.url));
    15	export const mcpServerDir = resolve(testDir, '..');
    16	export const worktreeRoot = resolve(mcpServerDir, '../../../..');
    17	export const codeIndexCliPath = join(worktreeRoot, '.opencode/bin/code-index.cjs');
    18	export const codeIndexLauncherPath = join(worktreeRoot, '.opencode/bin/mk-code-index-launcher.cjs');
    19	
    20	type RunOptions = {
    21	  timeoutMs?: number;
    22	};
    23	
    24	type ProcessResult = {
    25	  exitCode: number | null;
    26	  signal: NodeJS.Signals | null;
    27	  stdout: string;
    28	  stderr: string;
    29	};
    30	
    31	type RuntimePid = {
    32	  pid: number;
    33	  source: string;
    34	};
    35	
    36	type OwnerLeaseData = {
    37	  ownerPid: number;
    38	  ppid: number;
    39	  executablePath: string;
    40	  startedAtIso: string;
    41	  lastHeartbeatIso: string;
    42	  ttlMs: number;
    43	  canonicalDbDir: string;
    44	};
    45	
    46	type CodeIndexHarness = {
    47	  id: string;
    48	  rootDir: string;
    49	  socketDir: string;
    50	  dbDir: string;
    51	  env: NodeJS.ProcessEnv;
    52	  runCli: (args: string[], options?: RunOptions) => Promise<ProcessResult>;
    53	  callMcpTool: (name: string, args?: Record<string, unknown>) => Promise<unknown>;
    54	  cleanup: () => Promise<void>;
    55	  assertNoLiveRuntimePids: () => Promise<void>;
    56	  assertSingleOwnerLease: () => OwnerLeaseData;
    57	  assertNoRespawnLock: () => void;
    58	  reapRecordedRuntimePids: () => Promise<void>;
    59	  killOwnerDaemon: () => Promise<OwnerLeaseData>;
    60	  listRuntimeProcesses: () => Promise<string[]>;
    61	};
    62	
    63	const activeHarnesses = new Set<CodeIndexHarness>();
    64	
    65	export function registerCodeIndexCliTeardown(): void {
    66	  afterEach(async () => {
    67	    await cleanupActiveHarnesses();
    68	  });
    69	
    70	  afterAll(async () => {
    71	    await cleanupActiveHarnesses();
    72	  });
    73	}
    74	
    75	export function createCodeIndexHarness(name: string): CodeIndexHarness {
    76	  const parentDir = join(worktreeRoot, '.opencode/.tmp/code-index-cli-hardening');
    77	  mkdirSync(parentDir, { recursive: true });
    78	
    79	  const id = sanitizeName(name);
    80	  const rootDir = mkdtempSync(join(parentDir, `${id}-`));
    81	  const socketDir = mkdtempSync(join(tmpdir(), 'ci-'));
    82	  const dbDir = join(rootDir, 'db');
    83	  mkdirSync(dbDir, { recursive: true });
    84	
    85	  const env: NodeJS.ProcessEnv = {
    86	    ...process.env,
    87	    SPECKIT_IPC_SOCKET_DIR: socketDir,
    88	    SPECKIT_DAEMON_REELECTION: '0',
    89	    SPECKIT_CODE_GRAPH_DB_DIR: dbDir,
    90	    SPECKIT_CODE_GRAPH_DB_PATH: undefined,
    91	  };
    92	
    93	  const trackedChildren = new Set<ChildProcess>();
    94	  const runtimePids = new Map<number, RuntimePid>();
    95	
    96	  const harness: CodeIndexHarness = {
    97	    id,
    98	    rootDir,
    99	    socketDir,
   100	    dbDir,
   101	    env,
   102	    runCli: async (args, options) => {
   103	      const result = await runChild(process.execPath, [codeIndexCliPath, ...args], env, trackedChildren, options);
   104	      recordKnownRuntimePids(dbDir, runtimePids);
   105	      return result;
   106	    },
   107	    callMcpTool: async (name, args = {}) => {
   108	      const result = await callMcpTool(env, name, args);
   109	      recordKnownRuntimePids(dbDir, runtimePids);
   110	      return result;
   111	    },
   112	    cleanup: async () => {
   113	      await killTrackedChildren(trackedChildren);
   114	      await reapRuntimePids(dbDir, runtimePids);
   115	      await assertNoLiveRuntimePids(dbDir, runtimePids);
   116	      rmSync(rootDir, { recursive: true, force: true });
   117	      rmSync(socketDir, { recursive: true, force: true });
   118	      activeHarnesses.delete(harness);
   119	    },
   120	    assertNoLiveRuntimePids: () => assertNoLiveRuntimePids(dbDir, runtimePids),
   121	    assertSingleOwnerLease: () => assertSingleOwnerLease(dbDir, runtimePids),
   122	    assertNoRespawnLock: () => assertNoRespawnLock(dbDir),
   123	    reapRecordedRuntimePids: () => reapRuntimePids(dbDir, runtimePids),
   124	    killOwnerDaemon: async () => killOwnerDaemon(dbDir, runtimePids),
   125	    listRuntimeProcesses: () => listRuntimeProcesses(runtimePids),
   126	  };
   127	
   128	  activeHarnesses.add(harness);
   129	  return harness;
   130	}
   131	
   132	export function parseJsonOutput(result: ProcessResult): unknown {
   133	  const text = result.stdout.trim();
   134	  expect(text.length).toBeGreaterThan(0);
   135	  return JSON.parse(text);
   136	}
   137	
   138	export function expectBlockedRender(value: unknown, expectedRequiredAction = 'code_graph_scan'): void {
   139	  if (typeof value === 'string') {
   140	    // Text format renders the normalized envelope as two fixed lines:
   141	    //   blocked: <reason>
   142	    //   requiredAction: <action>
   143	    expect(value).toMatch(/^blocked: .+$/m);
   144	    expect(value).toMatch(new RegExp(`^requiredAction: ${expectedRequiredAction}$`, 'm'));
   145	    return;
   146	  }
   147	
   148	  expect(value).toBeTypeOf('object');
   149	  expect(value).not.toBeNull();
   150	  const envelope = value as { status?: unknown; requiredAction?: unknown; data?: { requiredAction?: unknown } };
   151	  expect(envelope.status).toBe('blocked');
   152	  expect(envelope.requiredAction).toBe(expectedRequiredAction);
   153	  expect(envelope.data?.requiredAction).toBe(expectedRequiredAction);
   154	}
   155	
   156	export function textFromMcpResult(result: unknown): string {
   157	  const maybeContent = (result as { content?: Array<{ text?: unknown }> }).content;
   158	  if (Array.isArray(maybeContent)) {
   159	    return maybeContent.map((entry) => (typeof entry.text === 'string' ? entry.text : '')).join('\n');
   160	  }
   161	
   162	  return JSON.stringify(result);
   163	}
   164	
   165	async function cleanupActiveHarnesses(): Promise<void> {
   166	  const harnesses = Array.from(activeHarnesses);
   167	  activeHarnesses.clear();
   168	  await Promise.all(harnesses.map((harness) => harness.cleanup()));
   169	}
   170	
   171	async function runChild(
   172	  command: string,
   173	  args: string[],
   174	  env: NodeJS.ProcessEnv,
   175	  trackedChildren: Set<ChildProcess>,
   176	  options: RunOptions = {},
   177	): Promise<ProcessResult> {
   178	  const child = spawn(command, args, {
   179	    cwd: worktreeRoot,
   180	    env,
   181	    stdio: ['ignore', 'pipe', 'pipe'],
   182	  });
   183	
   184	  trackedChildren.add(child);
   185	
   186	  let stdout = '';
   187	  let stderr = '';
   188	  child.stdout?.setEncoding('utf8');
   189	  child.stderr?.setEncoding('utf8');
   190	  child.stdout?.on('data', (chunk) => {
   191	    stdout += chunk;
   192	  });
   193	  child.stderr?.on('data', (chunk) => {
   194	    stderr += chunk;
   195	  });
   196	
   197	  const timeout = setTimeout(() => {
   198	    child.kill('SIGTERM');
   199	  }, options.timeoutMs ?? 20_000);
   200	
   201	  return await new Promise((resolvePromise) => {
   202	    child.on('close', (exitCode, signal) => {
   203	      clearTimeout(timeout);
   204	      trackedChildren.delete(child);
   205	      resolvePromise({ exitCode, signal, stdout, stderr });
   206	    });
   207	  });
   208	}
   209	
   210	async function callMcpTool(
   211	  env: NodeJS.ProcessEnv,
   212	  name: string,
   213	  args: Record<string, unknown>,
   214	): Promise<unknown> {
   215	  const { Client } = require('@modelcontextprotocol/sdk/client/index.js') as {
   216	    Client: new (clientInfo: Record<string, unknown>, options: Record<string, unknown>) => {
   217	      connect: (transport: unknown) => Promise<void>;
   218	      callTool: (request: Record<string, unknown>) => Promise<unknown>;
   219	      close: () => Promise<void>;
   220	    };
   221	  };
   222	  const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js') as {
   223	    StdioClientTransport: new (options: Record<string, unknown>) => { close?: () => Promise<void> };
   224	  };
   225	
   226	  const transport = new StdioClientTransport({
   227	    command: process.execPath,
   228	    args: [codeIndexLauncherPath],
   229	    cwd: worktreeRoot,
   230	    env,
   231	  });
   232	  const client = new Client({ name: 'code-index-cli-hardening', version: '0.0.0' }, { capabilities: {} });
   233	
   234	  await client.connect(transport);
   235	  try {
   236	    return await client.callTool({ name, arguments: args });
   237	  } finally {
   238	    await client.close();
   239	    await transport.close?.();
   240	  }
   241	}
   242	
   243	async function killTrackedChildren(children: Set<ChildProcess>): Promise<void> {
   244	  const waits = Array.from(children).map(
   245	    (child) =>
   246	      new Promise<void>((resolvePromise) => {
   247	        if (child.exitCode !== null || child.signalCode !== null) {
   248	          resolvePromise();
   249	          return;
   250	        }
   251	
   252	        child.once('close', () => resolvePromise());
   253	        child.kill('SIGTERM');
   254	        setTimeout(() => {
   255	          if (child.exitCode === null && child.signalCode === null) {
   256	            child.kill('SIGKILL');
   257	          }
   258	        }, 1_000);
   259	      }),
   260	  );
   261	
   262	  await Promise.all(waits);
   263	  children.clear();
   264	}
   265	
   266	async function reapRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): Promise<void> {
   267	  recordKnownRuntimePids(dbDir, runtimePids);
   268	  for (const entry of collectRuntimePids(dbDir, runtimePids)) {
   269	    if (!pidIsLive(entry.pid)) {
   270	      continue;
   271	    }
   272	
   273	    process.kill(entry.pid, 'SIGTERM');
   274	  }
   275	
   276	  await delay(250);
   277	
   278	  recordKnownRuntimePids(dbDir, runtimePids);
   279	  for (const entry of collectRuntimePids(dbDir, runtimePids)) {
   280	    if (pidIsLive(entry.pid)) {
   281	      process.kill(entry.pid, 'SIGKILL');
   282	    }
   283	  }
   284	}
   285	
   286	async function assertNoLiveRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): Promise<void> {
   287	  await delay(100);
   288	  recordKnownRuntimePids(dbDir, runtimePids);
   289	  const live = collectRuntimePids(dbDir, runtimePids).filter((entry) => pidIsLive(entry.pid));
   290	  expect(live).toEqual([]);
   291	}
   292	
   293	function assertSingleOwnerLease(dbDir: string, runtimePids: Map<number, RuntimePid>): OwnerLeaseData {
   294	  const lease = readOwnerLease(dbDir);
   295	  expect(lease).not.toBeNull();
   296	  expect(lease?.ownerPid).toBeGreaterThan(1);
   297	  expect(lease?.canonicalDbDir).toBe(resolve(dbDir));
   298	  if (lease) {
   299	    recordRuntimePid(runtimePids, lease.ownerPid, ownerLeasePath(dbDir));
   300	  }
   301	  return lease as OwnerLeaseData;
   302	}
   303	
   304	function assertNoRespawnLock(dbDir: string): void {
   305	  expect(existsSync(join(dbDir, '.mk-code-index-launcher.lockdir'))).toBe(false);
   306	  expect(existsSync(join(dbDir, '.code-graph-owner.json.lock'))).toBe(false);
   307	}
   308	
   309	async function killOwnerDaemon(dbDir: string, runtimePids: Map<number, RuntimePid>): Promise<OwnerLeaseData> {
   310	  const lease = assertSingleOwnerLease(dbDir, runtimePids);
   311	  process.kill(lease.ownerPid, 'SIGTERM');
   312	  await waitForPidExit(lease.ownerPid, 7_000);
   313	  if (pidIsLive(lease.ownerPid)) {
   314	    process.kill(lease.ownerPid, 'SIGKILL');
   315	    await waitForPidExit(lease.ownerPid, 1_000);
   316	  }
   317	  return lease;
   318	}
   319	
   320	function collectRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): RuntimePid[] {
   321	  const ownPid = process.pid;
   322	  return Array.from(runtimePids.values()).filter((entry) => entry.pid !== ownPid);
   323	}
   324	
   325	function recordKnownRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): void {
   326	  const ownerLease = readOwnerLease(dbDir);
   327	  if (ownerLease) {
   328	    recordRuntimePid(runtimePids, ownerLease.ownerPid, ownerLeasePath(dbDir));
   329	  }
   330	
   331	  const launcherLease = readJsonFile(launcherLeasePath(dbDir));
   332	  const launcherPid = (launcherLease as { pid?: unknown } | null)?.pid;
   333	  if (typeof launcherPid === 'number') {
   334	    recordRuntimePid(runtimePids, launcherPid, launcherLeasePath(dbDir));
   335	  }
   336	}
   337	
   338	function recordRuntimePid(runtimePids: Map<number, RuntimePid>, pid: number, source: string): void {
   339	  if (Number.isInteger(pid) && pid > 1 && pid !== process.pid) {
   340	    runtimePids.set(pid, { pid, source });
   341	  }
   342	}
   343	
   344	function readOwnerLease(dbDir: string): OwnerLeaseData | null {
   345	  const parsed = readJsonFile(ownerLeasePath(dbDir));
   346	  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
   347	  const candidate = parsed as Partial<OwnerLeaseData>;
   348	  if (
   349	    Number.isInteger(candidate.ownerPid) &&
   350	    Number.isInteger(candidate.ppid) &&
   351	    typeof candidate.executablePath === 'string' &&
   352	    typeof candidate.startedAtIso === 'string' &&
   353	    typeof candidate.lastHeartbeatIso === 'string' &&
   354	    Number.isInteger(candidate.ttlMs) &&
   355	    typeof candidate.canonicalDbDir === 'string'
   356	  ) {
   357	    return candidate as OwnerLeaseData;
   358	  }
   359	  return null;
   360	}
   361	
   362	function readJsonFile(filePath: string): unknown {
   363	  try {
   364	    return JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
   365	  } catch {
   366	    return null;
   367	  }
   368	}
   369	
   370	function ownerLeasePath(dbDir: string): string {
   371	  return join(dbDir, '.code-graph-owner.json');
   372	}
   373	
   374	function launcherLeasePath(dbDir: string): string {
   375	  return join(dbDir, '.mk-code-index-launcher.json');
   376	}
   377	
   378	function pidIsLive(pid: number): boolean {
   379	  try {
   380	    process.kill(pid, 0);
   381	    return true;
   382	  } catch {
   383	    return false;
   384	  }
   385	}
   386	
   387	async function delay(ms: number): Promise<void> {
   388	  await new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
   389	}
   390	
   391	async function waitForPidExit(pid: number, timeoutMs: number): Promise<void> {
   392	  const deadline = Date.now() + timeoutMs;
   393	  while (Date.now() <= deadline) {
   394	    if (!pidIsLive(pid)) return;
   395	    await delay(100);
   396	  }
   397	}
   398	
   399	function sanitizeName(name: string): string {
   400	  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'case';
   401	}
   402	
   403	async function listRuntimeProcesses(runtimePids: Map<number, RuntimePid>): Promise<string[]> {
   404	  const knownPids = new Set(runtimePids.keys());
   405	  const { stdout } = await execFileAsync('ps', ['-axo', 'pid=,command=']);
   406	  return stdout
   407	    .split('\n')
   408	    .map((line) => line.trim())
   409	    .filter((line) => {
   410	      const pid = Number.parseInt(line, 10);
   411	      return knownPids.has(pid)
   412	        && /mk-code-index-launcher|system-code-graph\/mcp_server\/dist\/index\.js/.test(line);
   413	    });
   414	}

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { describe, expect, it } from 'vitest';
     2	
     3	import {
     4	  createCodeIndexHarness,
     5	  parseJsonOutput,
     6	  registerCodeIndexCliTeardown,
     7	} from './code-index-cli-harness.js';
     8	
     9	registerCodeIndexCliTeardown();
    10	
    11	describe('code-index CLI owner lease and respawn locking', () => {
    12	  it('serializes concurrent launcher starts to one owner lease', async () => {
    13	    const harness = createCodeIndexHarness('dual-spawn');
    14	
    15	    const [first, second] = await Promise.all([
    16	      harness.runCli(['code-graph-status', '--format', 'json']),
    17	      harness.runCli(['code-graph-status', '--format', 'json']),
    18	    ]);
    19	
    20	    expect(first.exitCode).toBe(0);
    21	    expect(second.exitCode).toBe(0);
    22	    expect(JSON.stringify(parseJsonOutput(first))).toContain('readiness');
    23	    expect(JSON.stringify(parseJsonOutput(second))).toContain('readiness');
    24	    const lease = harness.assertSingleOwnerLease();
    25	    expect(lease.ownerPid).toBeGreaterThan(1);
    26	    harness.assertNoRespawnLock();
    27	  });
    28	
    29	  it('uses a fresh launcher after terminating the recorded daemon', async () => {
    30	    const harness = createCodeIndexHarness('dead-socket-respawn');
    31	
    32	    const initial = await harness.runCli(['code-graph-status', '--format', 'json']);
    33	    expect(initial.exitCode).toBe(0);
    34	
    35	    const terminated = await harness.killOwnerDaemon();
    36	
    37	    const takeover = await harness.runCli(['code-graph-status', '--format', 'json']);
    38	    expect(takeover.exitCode).toBe(0);
    39	    expect(JSON.stringify(parseJsonOutput(takeover))).toContain('readiness');
    40	    const lease = harness.assertSingleOwnerLease();
    41	    expect(lease.ownerPid).not.toBe(terminated.ownerPid);
    42	    harness.assertNoRespawnLock();
    43	  });
    44	});

codex
For CI, the better distinction is: unit-level tests for pure classification/CAS/UID/PID-identity helpers with injected dependencies, and one launcher integration test only where the process boundary matters. The current spawned-process stale-reclaim test even documents that it cannot deterministically prove the CAS property at that layer, which is exactly the kind of gap this hardening pass should close.
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts | sed -n '620,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   620	    await waitForExit(run.child, 8000);
   621	
   622	    expect(existsSync(workspace.pidFilePath)).toBe(false);
   623	  });
   624	
   625	  // Strict single-writer can be disabled for intentional parallel runs.
   626	  it('boots a sibling when strict single-writer is disabled', async () => {
   627	    const workspace = createWorkspace();
   628	    const first = spawnLauncher(workspace.launcherPath, workspace.root);
   629	    await waitForLeasePid(workspace.pidFilePath, first.child.pid);
   630	
   631	    const second = spawnLauncher(workspace.launcherPath, workspace.root, {
   632	      MK_CODE_INDEX_STRICT_SINGLE_WRITER: '0',
   633	    });
   634	    await waitForLeasePid(workspace.pidFilePath, second.child.pid);
   635	
   636	    expect(second.child.exitCode).toBeNull();
   637	    expect(second.stderr).toContain('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
   638	    expect(existsSync(workspace.pidFilePath)).toBe(true);
   639	  });
   640	});

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '740,880p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   740	    if (!exitedAfterKill) {
   741	      // The child outlived SIGKILL within the grace window (uninterruptible state, or a pid we can
   742	      // no longer confirm). Refuse to hand the database to a replacement while the recorded writer
   743	      // may still be alive, so a caller never spawns a second writer onto the same WAL.
   744	      log(`context-server child pid ${childPid} did not exit after SIGKILL within grace; refusing respawn`);
   745	      return { allowed: false, reason: 'child-kill-unconfirmed' };
   746	    }
   747	  }
   748	
   749	  // Clean-close barrier: verify the child closed the DB cleanly (marker removed) before handing the
   750	  // DB to a replacement daemon. If it did not (graceful close timed out, or we had to SIGKILL), log
   751	  // it so the corruption window is visible — the replacement daemon's boot FTS auto-heal rebuilds the
   752	  // shadow. We never block respawn on this: a missing daemon is worse than a self-healing one.
   753	  const markerPresent = uncleanMarkerPresent();
   754	  const cleanClose = cleanCloseAfterReap({ killed, markerPresent });
   755	  if (!cleanClose) {
   756	    log(`reaped context-server child pid ${childPid} WITHOUT a verified clean DB close (killed=${killed}, uncleanMarkerPresent=${markerPresent}); the replacement daemon will rebuild the FTS shadow at boot`);
   757	  }
   758	  return { allowed: true, reaped: true, cleanClose, reason: 'child-reaped' };
   759	}
   760	
   761	async function reapOwnerBeforeRespawn(ownerPid) {
   762	  const liveness = processLiveness(ownerPid);
   763	  if (liveness === 'unknown-eperm') {
   764	    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
   765	  }
   766	  if (liveness === 'dead') {
   767	    return { allowed: true, reason: 'owner-already-dead' };
   768	  }
   769	
   770	  // A socket probe cannot distinguish a genuinely-dead daemon from one that merely
   771	  // refused the connection at its client cap (both look "closed before reply"). Before
   772	  // killing a process that is still ALIVE, require the owner lease to be heartbeat-stale
   773	  // too: a daemon that has refreshed its lease within its TTL is serving clients, not
   774	  // dead, and must never be reaped on a socket-probe-only verdict regardless of cap.
   775	  const currentOwner = readOwnerLeaseFile();
   776	  if (currentOwner?.ownerPid === ownerPid && classifyOwnerLease(currentOwner) === 'live-owner') {
   777	    log(`spec-memory owner pid ${ownerPid} is heartbeat-fresh (live-owner); refusing socket-probe reap (likely cap-refusal, not death)`);
   778	    return { allowed: false, reason: 'owner-heartbeat-fresh' };
   779	  }
   780	
   781	  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
   782	  signalProcess(ownerPid, 'SIGTERM');
   783	  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
   784	  if (!exitedAfterTerm) {
   785	    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   786	    signalProcess(ownerPid, 'SIGKILL');
   787	    await waitForPidExit(ownerPid, 1000);
   788	  }
   789	  return { allowed: true, reason: 'owner-reaped' };
   790	}
   791	
   792	async function respawnAfterDeadSocket(leaseResult, decision) {
   793	  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
   794	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
   795	    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
   796	  }
   797	
   798	  const ownerPid = leaseResult.ownerPid;
   799	  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
   800	    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
   801	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
   802	    return { action: 'report', reason: 'missing-owner-pid', socketPath: decision.socketPath };
   803	  }
   804	
   805	  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
   806	  const childPid = lease?.childPid;
   807	  if (!Number.isInteger(childPid) || childPid <= 0) {
   808	    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
   809	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
   810	    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
   811	  }
   812	
   813	  // A daemon mid-maintenance (e.g. a background index scan) legitimately fails the
   814	  // deep liveness probe because its event loop is busy, not dead. If it holds a
   815	  // fresh marker naming this exact live child, refuse the respawn and leave it
   816	  // running. The marker lapses if the daemon is genuinely wedged (it can no longer
   817	  // refresh it), so a real death still respawns once the marker expires. Checked
   818	  // before the respawn lock and any reap so a bail unwinds nothing.
   819	  const deadSocketMarker = readMaintenanceMarker(maintenanceMarkerDir());
   820	  if (shouldAdoptDespiteProbe({ marker: deadSocketMarker, childPid, childLiveness: processLiveness(childPid) })) {
   821	    log(`confirmed-dead socket but child pid ${childPid} holds a fresh maintenance marker (activeUntil ${new Date(deadSocketMarker.activeUntilMs).toISOString()}); refusing respawn (busy, not dead)`);
   822	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-maintenance-active)');
   823	    return { action: 'report', reason: 'maintenance-active', socketPath: decision.socketPath };
   824	  }
   825	
   826	  let bootstrapLockHeld = false;
   827	  let respawnLock = null;
   828	  try {
   829	    bootstrapLockHeld = await acquireBootstrapLock({ requireLock: true });
   830	    respawnLock = acquireRespawnLockFile();
   831	    if (!respawnLock.acquired) {
   832	      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
   833	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   834	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   835	    }
   836	
   837	    const currentOwner = readOwnerLeaseFile();
   838	    if (currentOwner?.ownerPid !== ownerPid) {
   839	      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
   840	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   841	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   842	    }
   843	
   844	    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
   845	    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
   846	      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
   847	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   848	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   849	    }
   850	
   851	    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
   852	    if (!ownerReapResult.allowed) {
   853	      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
   854	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
   855	      return { action: 'report', reason: ownerReapResult.reason, socketPath: decision.socketPath };
   856	    }
   857	
   858	    clearOwnerLeaseFileIfOwner(ownerPid);
   859	    const ownerLease = buildOwnerLease(process.pid);
   860	    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
   861	      const holder = readOwnerLeaseFile();
   862	      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
   863	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   864	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   865	    }
   866	    ownerLeasePid = process.pid;
   867	
   868	    const reapResult = await reapLeaseChildBeforeRespawn(childPid);
   869	    if (!reapResult.allowed) {
   870	      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
   871	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
   872	      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
   873	    }
   874	
   875	    buildIfNeeded([]);
   876	    leaseStartedAt = new Date().toISOString();
   877	    writeLeaseFile();
   878	    launchServer();
   879	    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
   880	  } finally {

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-skill-advisor-launcher.cjs | sed -n '400,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	  }
   401	  return processLiveness(pid) === 'dead';
   402	}
   403	
   404	// Best-effort read of a live process's executable basename (comm). Returns null
   405	// when it cannot be determined (no ps, permission error, or the pid is gone), so
   406	// callers treat "cannot prove it is the wrong process" as "do not skip the reap".
   407	function readProcessExecutableBasename(pid) {
   408	  if (!Number.isInteger(pid) || pid <= 0) return null;
   409	  try {
   410	    const result = spawnSync('ps', ['-p', String(pid), '-o', 'comm='], {
   411	      encoding: 'utf8',
   412	      stdio: ['ignore', 'pipe', 'pipe'],
   413	    });
   414	    if (result.error || result.status !== 0) return null;
   415	    const comm = String(result.stdout || '').trim();
   416	    if (!comm) return null;
   417	    return path.basename(comm);
   418	  } catch {
   419	    return null;
   420	  }
   421	}
   422	
   423	async function reapOwnerBeforeRespawn(ownerPid, expectedExecutablePath = null) {
   424	  const liveness = processLiveness(ownerPid);
   425	  if (liveness === 'unknown-eperm') {
   426	    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
   427	  }
   428	  if (liveness === 'dead') {
   429	    return { allowed: true, reason: 'owner-already-dead' };
   430	  }
   431	
   432	  // Guard against PID reuse: if the recorded lease carried an executablePath and
   433	  // the live pid's executable basename provably differs, the OS recycled the pid
   434	  // to an unrelated process. Treat it as already-dead rather than SIGKILLing an
   435	  // innocent process. An indeterminate read (null) does not skip the reap.
   436	  if (typeof expectedExecutablePath === 'string' && expectedExecutablePath.length > 0) {
   437	    const expectedBasename = path.basename(expectedExecutablePath);
   438	    const actualBasename = readProcessExecutableBasename(ownerPid);
   439	    if (actualBasename !== null && actualBasename !== expectedBasename) {
   440	      log(`skill-advisor reap skipped; pid ${ownerPid} executable '${actualBasename}' != recorded '${expectedBasename}' (pid reused)`);
   441	      return { allowed: true, reason: 'owner-pid-reused' };
   442	    }
   443	  }
   444	
   445	  log(`confirmed-dead socket; reaping recorded skill-advisor daemon pid ${ownerPid} before respawn`);
   446	  try {
   447	    process.kill(ownerPid, 'SIGTERM');
   448	  } catch (error) {
   449	    if (error.code !== 'ESRCH') throw error;
   450	  }
   451	  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
   452	  if (!exitedAfterTerm) {
   453	    log(`skill-advisor daemon pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   454	    try {
   455	      process.kill(ownerPid, 'SIGKILL');
   456	    } catch (error) {
   457	      if (error.code !== 'ESRCH') throw error;
   458	    }
   459	    await waitForPidExit(ownerPid, 1000);
   460	    if (processLiveness(ownerPid) !== 'dead') {
   461	      return { allowed: false, reason: 'owner-reap-timeout' };
   462	    }
   463	  }
   464	  return { allowed: true, reason: 'owner-reaped' };
   465	}
   466	
   467	function readParentPid(pid) {
   468	  if (!Number.isInteger(pid) || pid <= 0) return null;
   469	  if (process.platform === 'linux') {
   470	    try {
   471	      const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
   472	      const match = status.match(/^PPid:\s+(\d+)$/m);
   473	      return match ? Number.parseInt(match[1], 10) : null;
   474	    } catch {
   475	      return null;
   476	    }
   477	  }
   478	  const result = spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
   479	    encoding: 'utf8',
   480	    stdio: ['ignore', 'pipe', 'ignore'],
   481	  });
   482	  if (result.status !== 0 || !result.stdout) return null;
   483	  const parsed = Number.parseInt(result.stdout.trim(), 10);
   484	  return Number.isInteger(parsed) ? parsed : null;
   485	}
   486	
   487	function classifyOwnerLease(lease) {
   488	  const liveness = processLiveness(lease.ownerPid);
   489	  if (liveness === 'dead') return 'stale-pid';
   490	  if (liveness === 'unknown-eperm') return 'unknown-eperm';
   491	
   492	  const actualPpid = readParentPid(lease.ownerPid);
   493	  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
   494	    return 'ppid-1-orphan';
   495	  }
   496	
   497	  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
   498	  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
   499	  if (!Number.isFinite(heartbeatMs) || Date.now() - heartbeatMs > ttlMs * 2) {
   500	    return 'stale-heartbeat-reclaim';
   501	  }
   502	
   503	  return 'live-owner';
   504	}
   505	
   506	function acquireOwnerLeaseFile() {
   507	  const currentOwnerLeasePath = ownerLeasePath();
   508	  const existing = readOwnerLeaseFile(currentOwnerLeasePath);
   509	
   510	  if (existing) {
   511	    const classification = classifyOwnerLease(existing);
   512	    if (classification === 'live-owner' || classification === 'unknown-eperm') {
   513	      return { acquired: false, holder: existing, classification };
   514	    }
   515	    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
   516	  }
   517	
   518	  const lease = buildOwnerLease(process.pid);
   519	  // Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL).
   520	  // This collapses the fresh-acquire and stale-reclaim paths into a single CAS so

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '1620,1715p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1620	      if (legacyLeaseResult.held && legacyLeaseResult.legacyPath && !legacyLeaseResult.staleReclaimable) {
  1621	        await bridgeOrReportLeaseHeldAndExit(legacyLeaseResult);
  1622	        return;
  1623	      }
  1624	    }
  1625	
  1626	    ensureLayout(actions);
  1627	    refreshPaths();
  1628	    enforceStandaloneCodeGraphDb(actions);
  1629	
  1630	    if (strictSingleWriter) {
  1631	      const ownerLeaseResult = acquireOwnerLeaseFile();
  1632	      if (!ownerLeaseResult.acquired) {
  1633	        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
  1634	        await bridgeOrReportLeaseHeldAndExit(leaseResultForOwnerLease(ownerLeaseResult.holder));
  1635	        return;
  1636	      }
  1637	
  1638	      const leaseResult = isLeaseHeld();
  1639	      if (leaseResult.held && !leaseResult.staleReclaimable) {
  1640	        clearOwnerLeaseFile();
  1641	        await bridgeOrReportLeaseHeldAndExit(leaseResult);
  1642	        return;
  1643	      }
  1644	      if (leaseResult.staleReclaimable) {
  1645	        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
  1646	        // A re-election daemon released by a disposing owner (or orphaned by a crashed owner) stays
  1647	        // alive under this stale lease, which records the live daemon as childPid. ADOPT it: if the
  1648	        // daemon is still alive and its recorded socket is bridgeable, bridge to the live socket
  1649	        // instead of reaping and respawning. This reuses the warm daemon and never tears down a
  1650	        // daemon a live secondary may still be bridged to. The reap+respawn path below runs only
  1651	        // when the daemon is genuinely gone.
  1652	        const staleLease = readLeaseFile(leaseResult.legacyPath || leasePath());
  1653	        const orphanChildPid = staleLease?.childPid;
  1654	        if (Number.isInteger(orphanChildPid) && orphanChildPid > 0 && processLiveness(orphanChildPid) !== 'dead') {
  1655	          const adoptResult = { ...leaseResult, socketPath: staleLease.socketPath || leaseResult.socketPath };
  1656	          const readiness = bridgeReadiness(adoptResult);
  1657	          if (readiness.ready) {
  1658	            // A live pid that still owns its socket can be WEDGED: its event loop is starved, so the
  1659	            // kernel accepts the connection into the listen backlog but the daemon never services a
  1660	            // request. bridgeReadiness only proves the socket file exists — adopting on that alone
  1661	            // bridges every client into a dead end, and the launcher can never recover because the pid
  1662	            // stays alive forever and is never reaped. Require a real JSON-RPC reply (the same deep
  1663	            // probe the dead-socket decision uses, with its tuned timeout + retry that tolerates a
  1664	            // busy-but-responsive daemon) before adopting. A non-responsive daemon falls through to the
  1665	            // reap+respawn block below, which tears it down and spawns a fresh one under the lock.
  1666	            const { probeLeaseHolderWithRetries } = loadBridgeModule();
  1667	            let probe;
  1668	            try {
  1669	              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
  1670	                onRetry: (attempt, total, result) => log(`stale-reclaim adopt probe ${attempt}/${total} not alive (${result.reason}); retrying`),
  1671	              });
  1672	            } catch (error) {
  1673	              // The probe resolves to a status even on socket failure; a thrown error means the probe
  1674	              // infrastructure itself failed. Treat that as not-alive so control falls through to
  1675	              // reap+respawn, rather than letting the exception abort startup and strand the daemon.
  1676	              probe = { status: 'dead', reason: `probe-threw: ${error instanceof Error ? error.message : String(error)}` };
  1677	            }
  1678	            if (probe.status === 'alive') {
  1679	              log(`stale-reclaim adopting live daemon pid ${orphanChildPid} via bridge instead of reaping`);
  1680	              clearOwnerLeaseFile();
  1681	              await bridgeOrReportLeaseHeldAndExit(adoptResult);
  1682	              return;
  1683	            }
  1684	            // The probe can fail because the daemon is busy-by-design (a background
  1685	            // index scan starves its event loop), not wedged. A fresh maintenance
  1686	            // marker naming this live child means adopt rather than reap+respawn.
  1687	            const adoptMarker = readMaintenanceMarker(maintenanceMarkerDir());
  1688	            if (shouldAdoptDespiteProbe({ marker: adoptMarker, childPid: orphanChildPid, childLiveness: processLiveness(orphanChildPid) })) {
  1689	              log(`stale-reclaim adopting busy daemon pid ${orphanChildPid} via bridge: probe failed (${probe.reason}) but a fresh maintenance marker is active (until ${new Date(adoptMarker.activeUntilMs).toISOString()})`);
  1690	              clearOwnerLeaseFile();
  1691	              await bridgeOrReportLeaseHeldAndExit(adoptResult);
  1692	              return;
  1693	            }
  1694	            log(`stale-reclaim NOT adopting pid ${orphanChildPid}: liveness probe failed (${probe.reason}); reaping and respawning instead`);
  1695	          }
  1696	        }
  1697	        // Daemon is dead, unbridgeable, or alive but failing its liveness probe. Reclaiming an existing STALE owner lease is a
  1698	        // non-exclusive write (the owner-lease O_EXCL above only covers the no-prior-lease case), so
  1699	        // two fresh launchers racing a crashed owner could both reach the reap and spawn. Take the
  1700	        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
  1701	        // the loser bails and reconnects.
  1702	        staleRespawnLock = acquireRespawnLockFile();
  1703	        if (!staleRespawnLock.acquired) {
  1704	          log('stale-reclaim deferred: another launcher holds the respawn lock; reporting lease held');
  1705	          clearOwnerLeaseFile();
  1706	          writeLeaseHeldJsonRpcError(leaseResult, 'respawn-lock-held');
  1707	          process.exit(0);
  1708	        }
  1709	        if (Number.isInteger(orphanChildPid) && orphanChildPid > 0) {
  1710	          // Re-validate under the respawn lock. The liveness probe above can take seconds, during which
  1711	          // a racing launcher may have reaped this same orphan and spawned a fresh daemon (recording a
  1712	          // new childPid) before we acquired the lock. Reaping now would tear down that replacement and
  1713	          // risk a second writer, so if the recorded lease no longer names the orphan we snapshotted,
  1714	          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
  1715	          const recheckLease = readLeaseFile(leaseResult.legacyPath || leasePath());

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts | sed -n '130,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   130	  return allowedSocketRoots().some((root) => isWithinRoot(root, candidate));
   131	}
   132	
   133	function resolveIpcSocketPath(dbDir: string): string {
   134	  const rawSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR
   135	    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
   136	    : path.resolve(dbDir);
   137	  const socketDir = canonicalizePath(rawSocketDir);
   138	  if (!isWithinAllowedSocketRoot(socketDir)) {
   139	    throw new Error(
   140	      `IPC socket directory must stay within the workspace root or a system temp dir: ${socketDir}`,
   141	    );
   142	  }
   143	  return path.join(socketDir, SOCKET_FILE_NAME);
   144	}
   145	
   146	// Only remove a stale socket at `socketPath` when it is provably ours: the parent dir resolves
   147	// inside an allowed root, the path is an actual socket, and it is owned by the current uid.
   148	// Guards against socket-hijack on shared hosts where an attacker plants a non-socket file or a
   149	// socket they own at the bind path.
   150	function canUnlinkExistingSocket(socketPath: string): boolean {
   151	  let parent: string;
   152	  try {
   153	    parent = fs.realpathSync.native(path.dirname(socketPath));
   154	  } catch (error: unknown) {
   155	    // A racing peer can remove the socket directory between the EADDRINUSE failure and this
   156	    // resolve; a vanished node is safe to reclaim, so never abort the bind on a missing path.
   157	    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
   158	      return true;
   159	    }
   160	    throw error;
   161	  }
   162	  if (!isWithinAllowedSocketRoot(parent)) {
   163	    return false;
   164	  }
   165	  try {
   166	    const stat = fs.lstatSync(socketPath);
   167	    if (!stat.isSocket()) {
   168	      return false;
   169	    }
   170	    if (typeof process.getuid === 'function' && stat.uid !== process.getuid()) {
   171	      return false;
   172	    }
   173	    return true;
   174	  } catch (error: unknown) {
   175	    // Same race on the socket node itself: if it is already gone the prior EADDRINUSE was
   176	    // transient, so treat the path as reclaimable instead of throwing and orphaning the bind.
   177	    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
   178	      return true;
   179	    }
   180	    throw error;
   181	  }
   182	}
   183	
   184	function getIpcBridgeStats(): IpcBridgeStats {
   185	  return {
   186	    socket_path: activeSocketPath,
   187	    secondary_clients_count: activeSockets.size,
   188	    total_secondary_messages_in: totalSecondaryMessagesIn,
   189	    total_secondary_messages_out: totalSecondaryMessagesOut,
   190	  };

exec
/bin/zsh -lc "rg -n \"writeState\\(|stateFile|PID_FILE_NAME|OWNER_LEASE_FILE_NAME|\\.code-graph-daemon-pid|childPid|ownerPid|startedAtIso|lastHeartbeatIso|socketPath\" .opencode/bin/mk-code-index-launcher.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
114:const PID_FILE_NAME = '.mk-code-index-launcher.json';
115:const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
116:let stateFile = path.join(dbDir, PID_FILE_NAME);
174:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
207:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
210:    socketPath,
225:  stateFile = path.join(dbDir, PID_FILE_NAME);
283:function writeState(payload) {
285:  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
296:  return path.join(resolvedDbDir(), PID_FILE_NAME);
300:  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
308:    path.join(opencodeDir, '.spec-kit', 'code-graph', 'database', PID_FILE_NAME),
309:    path.join(opencodeDir, 'skill', 'system-code-graph', 'mcp_server', 'database', PID_FILE_NAME),
328:      Number.isInteger(parsed.ownerPid) &&
331:      typeof parsed.startedAtIso === 'string' &&
332:      typeof parsed.lastHeartbeatIso === 'string' &&
345:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
352:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
394:function startOwnerLeaseHeartbeat(ownerPid) {
400:    if (refreshOwnerLeaseFile(ownerPid)) return;
410:function buildOwnerLease(ownerPid = process.pid) {
412:    ownerPid,
415:    startedAtIso: new Date().toISOString(),
416:    lastHeartbeatIso: new Date().toISOString(),
419:    socketPath: ownerSocketPath(),
456:  const liveness = processLiveness(lease.ownerPid);
460:  const actualPpid = readParentPid(lease.ownerPid);
465:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
483:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
509:      ownerPid: existing.ownerPid,
517:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
519:  if (!lease || lease.ownerPid !== ownerPid) return false;
520:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
524:    lastHeartbeatIso: new Date().toISOString(),
529:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
541:    if (lease && lease.ownerPid === ownerLeasePid
542:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
552:function clearOwnerLeaseFileIfOwner(ownerPid) {
556:    if (lease && lease.ownerPid === ownerPid
557:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
579:      || pidLiveAt(path.join(dir, '.code-graph-owner.json'), 'ownerPid');
584:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
587:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
594:        return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
597:      return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
603:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
605:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
607:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
628:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
640:async function reapOwnerBeforeRespawn(ownerPid) {
641:  const liveness = processLiveness(ownerPid);
649:  log(`confirmed-dead socket; reaping recorded code-index owner pid ${ownerPid} before respawn`);
651:    process.kill(ownerPid, 'SIGTERM');
655:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
657:    log(`code-index owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
659:      process.kill(ownerPid, 'SIGKILL');
663:    await waitForPidExit(ownerPid, 1000);
671:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
674:  const ownerPid = options.respawnChildPid;
675:  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
678:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
685:    if (currentOwner?.ownerPid !== ownerPid) {
688:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
691:    const reapResult = await reapOwnerBeforeRespawn(ownerPid);
693:      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
695:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
698:    clearOwnerLeaseFileIfOwner(ownerPid);
702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
704:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
711:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
732:        ownerPid: leaseResult.ownerPid,
734:        socketPath: respawnResult.socketPath,
738:        ownerPid: leaseResult.ownerPid,
740:        socketPath: respawnResult.socketPath,
748:      ownerPid: leaseResult.ownerPid,
750:      socketPath: decision?.socketPath ?? leaseResult.socketPath ?? null,
757:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
759:  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: ownerSocketPath() }, null, 2), { mode: 0o600 });
898:  const ownerPid = readBootstrapLockOwnerPid();
899:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
912:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
975:      ownerPid: childProcess.pid,
1063:          && Number.isInteger(ownerLeaseResult.reclaimed.ownerPid)
1064:          && ownerLeaseResult.reclaimed.ownerPid > 0
1065:          && ownerLeaseResult.reclaimed.ownerPid !== process.pid) {
1066:        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
1074:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
1076:          ownerPid: ownerLeaseResult.holder.ownerPid,
1077:          startedAt: ownerLeaseResult.holder.startedAtIso,
1078:          socketPath: typeof ownerLeaseResult.holder.socketPath === 'string' ? ownerLeaseResult.holder.socketPath : null,
1080:          respawnChildPid: ownerLeaseResult.holder.ownerPid,
1094:          ownerPid: leaseResult.ownerPid,
1213:  if (nextPaths.stateFile) stateFile = nextPaths.stateFile;

exec
/bin/zsh -lc "rg -n \"writeState\\(|stateFile|PID_FILE_NAME|OWNER_LEASE_FILE_NAME|\\.spec-memory.*daemon|childPid|ownerPid|startedAtIso|lastHeartbeatIso|socketPath\" .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
18:  HF_MODEL_SERVER_PID_FILE_NAME,
86:const PID_FILE_NAME = '.mk-spec-memory-launcher.json';
87:const OWNER_LEASE_FILE_NAME = '.spec-memory-owner.json';
88:let stateFile = path.join(dbDir, PID_FILE_NAME);
271:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
290:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
293:    socketPath,
307:  stateFile = path.join(dbDir, PID_FILE_NAME);
315:function writeState(payload) {
317:  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
335:  return path.join(resolvedDbDir(), PID_FILE_NAME);
339:  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
344:    path.join(opencodeDir, 'skill', 'system-spec-kit', 'mcp_server', 'database', PID_FILE_NAME),
363:      Number.isInteger(parsed.ownerPid) &&
366:      typeof parsed.startedAtIso === 'string' &&
367:      typeof parsed.lastHeartbeatIso === 'string' &&
380:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
397:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
412:function buildOwnerLease(ownerPid = process.pid) {
414:    ownerPid,
417:    startedAtIso: new Date().toISOString(),
418:    lastHeartbeatIso: new Date().toISOString(),
445:  const liveness = processLiveness(lease.ownerPid);
449:  const actualPpid = readParentPid(lease.ownerPid);
454:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
472:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
499:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
501:  if (!lease || lease.ownerPid !== ownerPid) return false;
502:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
506:    lastHeartbeatIso: new Date().toISOString(),
509:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
521:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
527:    if (refreshOwnerLeaseFile(ownerPid)) return;
539:function ownsOwnerLeaseFile(ownerPid = process.pid) {
541:  return lease?.ownerPid === ownerPid;
548:    if (lease && lease.ownerPid === ownerLeasePid
549:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
560:function clearOwnerLeaseFileIfOwner(ownerPid) {
563:    if (lease && lease.ownerPid === ownerPid
564:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
574:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
578:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
581:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
583:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
585:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
606:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
615:      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
625:  const storedSocketPath = leaseResult.socketPath;
631:    return { ready: true, socketPath: storedSocketPath };
637:  const socketPath = getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
638:  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
641:  return { ready: true, socketPath };
646:  if (pidLeaseResult.held && pidLeaseResult.ownerPid === ownerLease.ownerPid) {
651:    ownerPid: ownerLease.ownerPid,
653:    startedAt: ownerLease.startedAtIso,
655:    socketPath: null,
663:function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath()) {
664:  return mss.modelServerRespawnLockPath(socketPath, { dbDir: resolvedDbDir });
675:function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath()) {
676:  return mss.acquireModelServerRespawnLockFile(socketPath, { dbDir: resolvedDbDir, log, rel });
716:async function reapLeaseChildBeforeRespawn(childPid) {
717:  const liveness = processLiveness(childPid);
730:  log(`reaping recorded context-server child pid ${childPid} before respawn`);
731:  signalProcess(childPid, 'SIGTERM');
732:  reapProcessTreeGroups(childPid, { signal: signalProcess });
733:  const exitedAfterTerm = await waitForPidExit(childPid, RESPAWN_REAP_GRACE_MS);
736:    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
737:    signalProcess(childPid, 'SIGKILL');
738:    const exitedAfterKill = await waitForPidExit(childPid, 1000);
744:      log(`context-server child pid ${childPid} did not exit after SIGKILL within grace; refusing respawn`);
756:    log(`reaped context-server child pid ${childPid} WITHOUT a verified clean DB close (killed=${killed}, uncleanMarkerPresent=${markerPresent}); the replacement daemon will rebuild the FTS shadow at boot`);
761:async function reapOwnerBeforeRespawn(ownerPid) {
762:  const liveness = processLiveness(ownerPid);
776:  if (currentOwner?.ownerPid === ownerPid && classifyOwnerLease(currentOwner) === 'live-owner') {
777:    log(`spec-memory owner pid ${ownerPid} is heartbeat-fresh (live-owner); refusing socket-probe reap (likely cap-refusal, not death)`);
781:  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
782:  signalProcess(ownerPid, 'SIGTERM');
783:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
785:    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
786:    signalProcess(ownerPid, 'SIGKILL');
787:    await waitForPidExit(ownerPid, 1000);
795:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
798:  const ownerPid = leaseResult.ownerPid;
799:  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
802:    return { action: 'report', reason: 'missing-owner-pid', socketPath: decision.socketPath };
806:  const childPid = lease?.childPid;
807:  if (!Number.isInteger(childPid) || childPid <= 0) {
808:    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
810:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
820:  if (shouldAdoptDespiteProbe({ marker: deadSocketMarker, childPid, childLiveness: processLiveness(childPid) })) {
821:    log(`confirmed-dead socket but child pid ${childPid} holds a fresh maintenance marker (activeUntil ${new Date(deadSocketMarker.activeUntilMs).toISOString()}); refusing respawn (busy, not dead)`);
823:    return { action: 'report', reason: 'maintenance-active', socketPath: decision.socketPath };
834:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
838:    if (currentOwner?.ownerPid !== ownerPid) {
841:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
845:    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
848:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
851:    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
853:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
855:      return { action: 'report', reason: ownerReapResult.reason, socketPath: decision.socketPath };
858:    clearOwnerLeaseFileIfOwner(ownerPid);
862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
864:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
868:    const reapResult = await reapLeaseChildBeforeRespawn(childPid);
870:      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
872:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
879:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
928:// Pure lease-payload builder (exported for tests). `childPid`, `modelServerPid`, and `socketPath`
929:// are ADDITIVE fields; existing readers consume only pid/startedAt/ownerPid and ignore the extras.
930:// `socketPath` records the IPC path this owner actually listens on so a secondary launcher prefers
932:function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null, socketPath = null) {
933:  return buildSharedLeaseObject(childPid, startedAt || new Date().toISOString(), modelServerPid, socketPath);
936:function writeLeaseFile(childPid = getContextServerPid(), modelServerPid = hfControl.getPid()) {
938:  const payload = buildLeaseObject(childPid, leaseStartedAt, modelServerPid, resolveSessionProxySocketPath());
942:function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
943:  const pidDir = socketPath.startsWith('tcp://') ? resolvedDbDir() : path.dirname(socketPath);
944:  return path.join(pidDir, HF_MODEL_SERVER_PID_FILE_NAME);
948:  const socketPath = resolveModelServerSocketPath();
949:  const pidPath = sharedModelServerPidPath(socketPath);
968:    socketPath,
1159:function refreshDescendantSnapshot(childPid, runner = defaultProcessRowsRunner) {
1160:  return mss.refreshDescendantSnapshot(childPid, runner, {
1172:// anchored on the (now-dead, ps-absent) childPid finds nothing. We therefore reap the UNION of any
1173:// still-live childPid subtree (the not-yet-reparented case) and the before-death snapshot
1176:function reapProcessTreeGroups(childPid, options = {}) {
1177:  return mss.reapProcessTreeGroups(childPid, {
1234:  // relaunch rewrites childPid — where a concurrent launcher reads no lease and passes the
1235:  // single-writer gate, producing a competing daemon. Relaunch (writeLeaseFile) rewrites childPid.
1238:function startRssWatchdog(childPid, options = {}) {
1239:  return mss.startRssWatchdog(childPid, {
1313:  const ownerPid = readBootstrapLockOwnerPid();
1314:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
1327:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
1399:  const childPid = childProcess.pid;
1405:  writeLeaseFile(childPid);
1406:  startRssWatchdog(childPid);
1417:      { code, signal, childPid, intentional: false },
1482:    leaseOwnerPid: leaseResult.ownerPid,
1488:    log(`context-server exited: database single-writer lock held; bridging to live owner pid=${leaseResult.ownerPid}`);
1507:    { ownerPid: leaseResult.ownerPid ?? 'unknown', startedAt: leaseResult.startedAt ?? new Date().toISOString() },
1633:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
1647:        // alive under this stale lease, which records the live daemon as childPid. ADOPT it: if the
1653:        const orphanChildPid = staleLease?.childPid;
1655:          const adoptResult = { ...leaseResult, socketPath: staleLease.socketPath || leaseResult.socketPath };
1669:              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
1688:            if (shouldAdoptDespiteProbe({ marker: adoptMarker, childPid: orphanChildPid, childLiveness: processLiveness(orphanChildPid) })) {
1712:          // new childPid) before we acquired the lock. Reaping now would tear down that replacement and
1716:          if (recheckLease && recheckLease.childPid !== orphanChildPid) {
1717:            log('stale-reclaim deferred: lease childPid changed after acquiring respawn lock (replacement already present); reporting lease held');
1729:            log(`stale-reclaim aborted: ${reap.reason} for childPid=${orphanChildPid}; reporting lease held`);
1745:      writeState({
1762:      writeLeaseHeldJsonRpcError({ ownerPid: reprobe ? reprobe.pid : 'unknown', startedAt }, 'lease-reprobe-lost');
1774:        socketPath: resolveSessionProxySocketPath(),
1786:      writeState({
1815:  if (nextPaths.stateFile) stateFile = nextPaths.stateFile;

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '500,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   500	  const lease = readOwnerLeaseFile();
   501	  if (!lease || lease.ownerPid !== ownerPid) return false;
   502	  const nextOwnerPid = patch.ownerPid ?? ownerPid;
   503	  writeOwnerLeaseFile({
   504	    ...lease,
   505	    ...patch,
   506	    lastHeartbeatIso: new Date().toISOString(),
   507	  });
   508	  const reread = readOwnerLeaseFile();
   509	  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
   510	  ownerLeasePid = nextOwnerPid;
   511	  return true;
   512	}
   513	
   514	function clearOwnerLeaseHeartbeat() {
   515	  if (ownerLeaseHeartbeatTimer) {
   516	    clearInterval(ownerLeaseHeartbeatTimer);
   517	    ownerLeaseHeartbeatTimer = null;
   518	  }
   519	}
   520	
   521	function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
   522	  clearOwnerLeaseHeartbeat();
   523	  const lease = readOwnerLeaseFile();
   524	  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
   525	  const intervalMs = Math.max(1000, Math.floor(ttlMs / 2));
   526	  ownerLeaseHeartbeatTimer = setInterval(() => {
   527	    if (refreshOwnerLeaseFile(ownerPid)) return;
   528	    log('owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership');
   529	    clearOwnerLeaseHeartbeat();
   530	    void shutdownLauncherForSignal('SIGTERM').catch((error) => {
   531	      log(error.stack || error.message);
   532	      clearAllLeaseFiles();
   533	      process.exit(128);
   534	    });
   535	  }, intervalMs);
   536	  ownerLeaseHeartbeatTimer.unref?.();
   537	}
   538	
   539	function ownsOwnerLeaseFile(ownerPid = process.pid) {
   540	  const lease = readOwnerLeaseFile();
   541	  return lease?.ownerPid === ownerPid;
   542	}
   543	
   544	function clearOwnerLeaseFile() {
   545	  if (!Number.isInteger(ownerLeasePid)) return;
   546	  try {
   547	    const lease = readOwnerLeaseFile();
   548	    if (lease && lease.ownerPid === ownerLeasePid
   549	        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
   550	      fs.unlinkSync(ownerLeasePath());
   551	    }
   552	  } catch {
   553	    // Idempotent cleanup.
   554	  } finally {
   555	    clearOwnerLeaseHeartbeat();
   556	    ownerLeasePid = null;
   557	  }
   558	}
   559	
   560	function clearOwnerLeaseFileIfOwner(ownerPid) {
   561	  try {
   562	    const lease = readOwnerLeaseFile();
   563	    if (lease && lease.ownerPid === ownerPid
   564	        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
   565	      fs.unlinkSync(ownerLeasePath());
   566	    }
   567	  } catch {
   568	    // Idempotent cleanup.
   569	  }
   570	}
   571	
   572	function leaseHeldFromFile(filePath, legacyPath = null) {
   573	  const lease = readLeaseFile(filePath);
   574	  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   575	  const startedAt = lease.startedAt ?? new Date(0).toISOString();
   576	  // Surface the owner-recorded socket path so the bridge can prefer it over recomputing one that
   577	  // may diverge under a different SPECKIT_IPC_SOCKET_DIR. Null when the lease predates this field.
   578	  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
   579	  try {
   580	    process.kill(lease.pid, 0);
   581	    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   582	  } catch (error) {
   583	    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
   584	    // Mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
   585	    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   586	    throw error;
   587	  }
   588	}
   589	
   590	function isLeaseHeld() {
   591	  const primary = leaseHeldFromFile(leasePath());
   592	  if (primary.held) return primary;
   593	
   594	  for (const legacyPath of legacyLeasePaths()) {
   595	    if (legacyPath === leasePath()) continue;
   596	    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
   597	    if (legacy.held || legacy.staleReclaimable) return legacy;
   598	  }
   599	
   600	  return primary;
   601	}
   602	
   603	function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
   604	  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   605	  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   606	  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   607	}
   608	
   609	function writeLeaseHeldJsonRpcError(leaseResult, reason) {
   610	  process.stdout.write(`${JSON.stringify({
   611	    jsonrpc: '2.0',
   612	    id: null,
   613	    error: {
   614	      code: -32001,
   615	      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
   616	      data: { retryable: true },
   617	    },
   618	  })}\n`);
   619	}
   620	

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '620,740p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   620	
   621	function bridgeReadiness(leaseResult) {
   622	  if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1') {
   623	    return { ready: false, reason: 'bridge-disabled' };
   624	  }
   625	  const storedSocketPath = leaseResult.socketPath;
   626	  if (
   627	    typeof storedSocketPath === 'string' &&
   628	    storedSocketPath.length > 0 &&
   629	    (storedSocketPath.startsWith('tcp://') || fs.existsSync(storedSocketPath))
   630	  ) {
   631	    return { ready: true, socketPath: storedSocketPath };
   632	  }
   633	  const { getIpcSocketPath } = loadBridgeModule();
   634	  if (typeof getIpcSocketPath !== 'function') {
   635	    return { ready: false, reason: 'bridge-module-missing' };
   636	  }
   637	  const socketPath = getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
   638	  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
   639	    return { ready: false, reason: 'no-bridge-socket' };
   640	  }
   641	  return { ready: true, socketPath };
   642	}
   643	
   644	function leaseResultForOwnerLease(ownerLease) {
   645	  const pidLeaseResult = isLeaseHeld();
   646	  if (pidLeaseResult.held && pidLeaseResult.ownerPid === ownerLease.ownerPid) {
   647	    return pidLeaseResult;
   648	  }
   649	  return {
   650	    held: true,
   651	    ownerPid: ownerLease.ownerPid,
   652	    staleReclaimable: false,
   653	    startedAt: ownerLease.startedAtIso,
   654	    legacyPath: null,
   655	    socketPath: null,
   656	  };
   657	}
   658	
   659	function respawnLockPath() {
   660	  return path.join(resolvedDbDir(), '.mk-spec-memory-respawn.lock');
   661	}
   662	
   663	function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath()) {
   664	  return mss.modelServerRespawnLockPath(socketPath, { dbDir: resolvedDbDir });
   665	}
   666	
   667	function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
   668	  return acquireSharedRespawnLockFileAt(lockPath, label, { log, rel });
   669	}
   670	
   671	function acquireRespawnLockFile() {
   672	  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
   673	}
   674	
   675	function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath()) {
   676	  return mss.acquireModelServerRespawnLockFile(socketPath, { dbDir: resolvedDbDir, log, rel });
   677	}
   678	
   679	const UNCLEAN_SHUTDOWN_MARKER = '.unclean-shutdown';
   680	
   681	// The context-server writes `.unclean-shutdown` on every DB open and removes it only after a
   682	// successful WAL checkpoint + db.close(). The launcher uses its presence to tell whether a reaped
   683	// child handed off the DB cleanly. Mirror the writer's location: the marker lives in the resolved
   684	// DB dir, or — when MEMORY_DB_PATH relocates the DB — that path's dirname. Best-effort: a wrong
   685	// guess only forfeits the clean-close confirmation; the replacement daemon's boot still self-heals.
   686	function uncleanShutdownMarkerPath() {
   687	  // Mirror the daemon's full path precedence, not just MEMORY_DB_PATH:
   688	  // the daemon resolves its database dir from SPEC_KIT_DB_DIR /
   689	  // SPECKIT_DB_DIR before falling back to the packaged default, and the
   690	  // marker lives beside whatever database it actually opened. Checking the
   691	  // static dir under a dir override silently forfeits clean-close detection.
   692	  const fileOverride = process.env.MEMORY_DB_PATH?.trim();
   693	  if (fileOverride) {
   694	    return path.join(path.dirname(fileOverride), UNCLEAN_SHUTDOWN_MARKER);
   695	  }
   696	  const dirOverride = process.env.SPEC_KIT_DB_DIR?.trim() || process.env.SPECKIT_DB_DIR?.trim();
   697	  const dir = dirOverride ? path.resolve(root, dirOverride) : resolvedDbDir();
   698	  return path.join(dir, UNCLEAN_SHUTDOWN_MARKER);
   699	}
   700	
   701	function uncleanMarkerPresent() {
   702	  try {
   703	    return fs.existsSync(uncleanShutdownMarkerPath());
   704	  } catch {
   705	    return false;
   706	  }
   707	}
   708	
   709	// A reap is a verified clean DB handoff only when the child exited on SIGTERM (not SIGKILL) AND the
   710	// clean-shutdown marker is gone (close_db ran its checkpoint + close). Anything else means the
   711	// replacement daemon will open a possibly-dirty shadow and must rebuild it at boot.
   712	function cleanCloseAfterReap({ killed, markerPresent }) {
   713	  return !killed && !markerPresent;
   714	}
   715	
   716	async function reapLeaseChildBeforeRespawn(childPid) {
   717	  const liveness = processLiveness(childPid);
   718	  if (liveness === 'unknown-eperm') {
   719	    return { allowed: false, reason: 'child-liveness-unknown-eperm' };
   720	  }
   721	  if (liveness === 'dead') {
   722	    return {
   723	      allowed: true,
   724	      reaped: false,
   725	      cleanClose: cleanCloseAfterReap({ killed: false, markerPresent: uncleanMarkerPresent() }),
   726	      reason: 'child-already-dead',
   727	    };
   728	  }
   729	
   730	  log(`reaping recorded context-server child pid ${childPid} before respawn`);
   731	  signalProcess(childPid, 'SIGTERM');
   732	  reapProcessTreeGroups(childPid, { signal: signalProcess });
   733	  const exitedAfterTerm = await waitForPidExit(childPid, RESPAWN_REAP_GRACE_MS);
   734	  let killed = false;
   735	  if (!exitedAfterTerm) {
   736	    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   737	    signalProcess(childPid, 'SIGKILL');
   738	    const exitedAfterKill = await waitForPidExit(childPid, 1000);
   739	    killed = true;
   740	    if (!exitedAfterKill) {

codex
I have enough code evidence for the verdict now. One important refutation: the design says the existing unlink plus `O_EXCL` is enough CAS, but the current stale-reclaim path can delete a winner’s freshly written lease because the unlink is not conditional on the stale file identity.
exec
/bin/zsh -lc "rg -n \"-32000|32000|Connection closed|session proxy|reconnect|retryable|code_graph_status\" .opencode/bin .opencode/skills/system-code-graph/mcp_server -g '"'!node_modules'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: unrecognized flag -3

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/launcher-session-proxy.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ COMPONENT: Launcher Session Proxy                                      ║
     3	// ╠══════════════════════════════════════════════════════════════════════════╣
     4	// ║ PURPOSE: Bridges MCP stdio sessions to daemon IPC with safe reconnects. ║
     5	// ╚══════════════════════════════════════════════════════════════════════════╝
     6	'use strict';
     7	
     8	const net = require('net');
     9	const { StringDecoder } = require('string_decoder');
    10	const {
    11	  probeDaemon,
    12	  toConnectionOptions,
    13	} = require('./launcher-ipc-bridge.cjs');
    14	
    15	const PROBE_BACKOFF_MS = [100, 250, 500, 1000, 1500];
    16	const DEFAULT_MAX_REATTACH_ATTEMPTS = 40;
    17	// Bounded so a dead/booting daemon surfaces a retryable -32001 to the client in ~tens of
    18	// seconds (~41s with the backoff ladder) instead of ~176s of silent "connecting…". A healthy
    19	// daemon answers the deep probe within the first few attempts; the only thing this shortens is
    20	// the pathological wait when the backend cannot come up. Tunable via SPECKIT_PROXY_COLD_START_ATTEMPTS.
    21	const DEFAULT_MAX_COLD_START_ATTEMPTS = 30;
    22	const INTERNAL_HANDSHAKE_TIMEOUT_MS = 7000;
    23	const DEFAULT_KEEPALIVE_INTERVAL_MS = 10_000;
    24	const DEFAULT_KEEPALIVE_TIMEOUT_MS = 5_000;
    25	const DEFAULT_MAX_QUEUED_CLIENT_FRAMES = 1000;
    26	const PROXY_PRIVATE_ID_PREFIX = '__launcher_session_proxy_keepalive__';
    27	const RETRYABLE_RECYCLE_ERROR = Object.freeze({
    28	  code: -32001,
    29	  message: 'backend recycled; retry',
    30	  data: { retryable: true },
    31	});
    32	const PROTOCOL_MISMATCH_ERROR = Object.freeze({
    33	  code: -32002,
    34	  message: 'backend protocol version changed; client reconnect required',
    35	  data: { retryable: false },
    36	});
    37	const REPLAYABLE_TOOL_NAMES = new Set([
    38	  'memory_search',
    39	  'memory_context',
    40	  'memory_match_triggers',
    41	  'memory_quick_search',
    42	  'memory_save',
    43	  'session_bootstrap',
    44	  'session_health',
    45	  'session_resume',
    46	  'session_status',
    47	  'memory_stats',
    48	  'memory_status',
    49	  'checkpoint_list',
    50	  'embedder_health',
    51	]);
    52	const UNSAFE_TOOL_NAMES = new Set([
    53	  'memory_delete',
    54	  'memory_bulk_delete',
    55	  'memory_update',
    56	  'checkpoint_restore',
    57	  'checkpoint_delete',
    58	  'embedder_set',
    59	  'memory_retention_sweep',
    60	  'memory_ingest_start',
    61	  'memory_ingest_cancel',
    62	]);
    63	const REPLAYABLE_PROTOCOL_METHODS = new Set([
    64	  'initialize',
    65	  'ping',
    66	]);
    67	
    68	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    69	
    70	function defaultConnect(connectionOptions) {
    71	  return net.createConnection(connectionOptions);
    72	}
    73	
    74	function defaultLog(message) {
    75	  process.stderr.write(`[launcher-session-proxy] ${message}\n`);
    76	}
    77	
    78	function createFrameSplitter(onFrame) {
    79	  let buffer = '';
    80	  // A multibyte UTF-8 char (CJK/emoji) can straddle a socket-chunk boundary; the
    81	  // StringDecoder holds the incomplete tail until the next chunk completes it, instead
    82	  // of emitting U+FFFD replacement chars on the partial sequence.
    83	  const decoder = new StringDecoder('utf8');
    84	  return {
    85	    push(chunk) {
    86	      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
    87	      let newlineIndex = buffer.indexOf('\n');
    88	      while (newlineIndex !== -1) {
    89	        const frame = buffer.slice(0, newlineIndex);
    90	        buffer = buffer.slice(newlineIndex + 1);
    91	        newlineIndex = buffer.indexOf('\n');
    92	        if (frame.trim().length === 0) continue;
    93	        onFrame(frame);
    94	      }
    95	    },
    96	    discard() {
    97	      buffer = '';
    98	      decoder.end();
    99	    },
   100	    buffered() {
   101	      return buffer;
   102	    },
   103	  };
   104	}
   105	
   106	function parseFrame(frame) {
   107	  try {
   108	    const parsed = JSON.parse(String(frame).trim());
   109	    return parsed && typeof parsed === 'object' ? parsed : null;
   110	  } catch {
   111	    return null;
   112	  }
   113	}
   114	
   115	function hasOwn(object, key) {
   116	  return Object.prototype.hasOwnProperty.call(object, key);
   117	}
   118	
   119	function hasRequestId(parsed) {
   120	  return parsed !== null && hasOwn(parsed, 'id');
   121	}
   122	
   123	function isResponseFrame(parsed) {
   124	  return hasRequestId(parsed) && (hasOwn(parsed, 'result') || hasOwn(parsed, 'error'));
   125	}
   126	
   127	// Build a frame classifier for a given replayable/unsafe tool set. The protocol-method rules
   128	// (initialize/ping/notifications) and the parse/unsafe/replayable order are identical across MCP
   129	// servers; only the tools/call replayability set differs per server (memory tools vs code-graph
   130	// tools). Each launcher passes its own sets so the reattach/replay machinery stays one implementation.
   131	function createClassifyFrame(options = {}) {
   132	  const replayable = options.replayableToolNames instanceof Set ? options.replayableToolNames : REPLAYABLE_TOOL_NAMES;
   133	  const unsafe = options.unsafeToolNames instanceof Set ? options.unsafeToolNames : UNSAFE_TOOL_NAMES;
   134	  return function classify(frame) {
   135	    const parsed = typeof frame === 'string' ? parseFrame(frame) : frame;
   136	    if (!parsed || typeof parsed.method !== 'string') return false;
   137	    if (parsed.method !== 'tools/call') {
   138	      return REPLAYABLE_PROTOCOL_METHODS.has(parsed.method) || parsed.method.startsWith('notifications/');
   139	    }
   140	    const toolName = parsed.params && typeof parsed.params === 'object'
   141	      ? parsed.params.name
   142	      : undefined;
   143	    if (typeof toolName !== 'string') return false;
   144	    if (unsafe.has(toolName)) return false;
   145	    if (replayable.has(toolName)) return true;
   146	    return false;
   147	  };
   148	}
   149	
   150	// Default classifier uses the mk-spec-memory tool sets. memory_save is replayable on a
   151	// commit-then-die backend because its primary row is protected by content-hash dedup AND the v28
   152	// active-row partial unique index (idx_memory_logical_key_active_unique): an identical-content replay
   153	// collapses to the same logical key and writes no new primary row. The KNOWN GAP is the secondary
   154	// index — a commit-then-die that finished the primary insert but not the secondary-index write can,
   155	// on replay, append duplicate secondary-index rows because that path is not yet keyed by an
   156	// idempotency token. Closing it requires a request-id/dedup key threaded into the save handler, which
   157	// lives behind the daemon IPC and is out of scope for this proxy-layer frame classifier.
   158	const classifyFrame = createClassifyFrame();
   159	
   160	function createPendingRequestsTracker(classify = classifyFrame) {
   161	  const pendingRequests = new Map();
   162	  let cachedInitialize = null;
   163	  let cachedInitializeId = null;
   164	  let negotiatedProtocolVersion = null;
   165	  let protocolVersionObserved = false;
   166	
   167	  function handleClientFrame(frame) {
   168	    const parsed = parseFrame(frame);
   169	    if (!parsed) return;
   170	    if (parsed.method === 'initialize') {
   171	      cachedInitialize = frame;
   172	      cachedInitializeId = hasRequestId(parsed) ? parsed.id : null;
   173	    }
   174	    if (!hasRequestId(parsed)) return;
   175	    pendingRequests.set(parsed.id, {
   176	      frame,
   177	      replayable: classify(frame),
   178	    });
   179	  }
   180	
   181	  function handleBackendFrame(frame) {
   182	    const parsed = parseFrame(frame);
   183	    if (!parsed || !isResponseFrame(parsed)) return;
   184	    pendingRequests.delete(parsed.id);
   185	  }
   186	
   187	  return {
   188	    pendingRequests,
   189	    handleClientFrame,
   190	    handleBackendFrame,
   191	    getCachedInitialize() {
   192	      return cachedInitialize;
   193	    },
   194	    getCachedInitializeId() {
   195	      return cachedInitializeId;
   196	    },
   197	    getNegotiatedProtocolVersion() {
   198	      return negotiatedProtocolVersion;
   199	    },
   200	    hasObservedProtocolVersion() {
   201	      return protocolVersionObserved;
   202	    },
   203	    recordNegotiatedProtocolVersion(version) {
   204	      if (protocolVersionObserved) return;
   205	      protocolVersionObserved = true;
   206	      negotiatedProtocolVersion = typeof version === 'string' ? version : null;
   207	    },
   208	  };
   209	}
   210	
   211	function resolveColdStartAttempts() {
   212	  const fromEnv = Number.parseInt(process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS ?? '', 10);
   213	  return Number.isInteger(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_MAX_COLD_START_ATTEMPTS;
   214	}
   215	
   216	async function waitForDaemonReady(socketPath, probe, connect, log, options = {}) {
   217	  const maxAttempts = Number.isInteger(options.maxAttempts) && options.maxAttempts > 0
   218	    ? options.maxAttempts
   219	    : Infinity;
   220	  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
   221	    const result = await probe(socketPath, { connect, deepProbe: true });
   222	    if (result.status === 'alive') return result;
   223	    if (attempt + 1 >= maxAttempts) return result;
   224	    const delayMs = PROBE_BACKOFF_MS[Math.min(attempt, PROBE_BACKOFF_MS.length - 1)];
   225	    log(`daemon socket not ready (${result.reason}); retrying in ${delayMs}ms`);
   226	    await sleep(delayMs);
   227	  }
   228	  return { status: 'dead', reason: 'reattach-attempts-exhausted' };
   229	}
   230	
   231	function writeFrame(stream, frame) {
   232	  return stream.write(`${frame}\n`);
   233	}
   234	
   235	function retryableErrorFrame(id) {
   236	  return JSON.stringify({
   237	    jsonrpc: '2.0',
   238	    id,
   239	    error: RETRYABLE_RECYCLE_ERROR,
   240	  });
   241	}
   242	
   243	function protocolMismatchErrorFrame(id) {
   244	  return JSON.stringify({
   245	    jsonrpc: '2.0',
   246	    id,
   247	    error: PROTOCOL_MISMATCH_ERROR,
   248	  });
   249	}
   250	
   251	function connectSocket(connect, socketPath) {
   252	  return new Promise((resolve, reject) => {
   253	    let socket;
   254	    try {
   255	      socket = connect(toConnectionOptions(socketPath));
   256	    } catch (error) {
   257	      reject(error);
   258	      return;
   259	    }
   260	

exec
/bin/zsh -lc "nl -ba .opencode/bin/code-index.cjs | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ╔══════════════════════════════════════════════════════════════════════════╗
     3	// ║ COMPONENT: Code Index CLI Shim                                         ║
     4	// ╠══════════════════════════════════════════════════════════════════════════╣
     5	// ║ PURPOSE: Runs the built daemon-backed mk-code-index CLI.                ║
     6	// ╚══════════════════════════════════════════════════════════════════════════╝
     7	'use strict';
     8	
     9	const fs = require('fs');
    10	const path = require('path');
    11	const crypto = require('crypto');
    12	const { spawnSync } = require('child_process');
    13	
    14	const opencodeDir = path.resolve(__dirname, '..');
    15	const skillDir = path.join(opencodeDir, 'skills', 'system-code-graph');
    16	const cliDist = path.join(skillDir, 'mcp_server', 'dist', 'code-index-cli.js');
    17	const sourceHashState = path.join(path.dirname(cliDist), '.code-index-cli-source-hash.json');
    18	const defaultSocketDir = '/tmp/mk-code-index';
    19	const socketFileName = 'daemon-ipc.sock';
    20	const allowStale = process.env.SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE === '1';
    21	
    22	function fail(message) {
    23	  process.stderr.write(`${message}\n`);
    24	  process.exit(69);
    25	}
    26	
    27	// Recursively collects the CLI's compiled-source surface (entry, local
    28	// imports, build tsconfig) so new files under candidate directories are
    29	// watched without editing this list. node_modules and dist stay out of scope.
    30	function sourceCandidates() {
    31	  const candidates = [
    32	    path.join(skillDir, 'mcp_server', 'code-index-cli.ts'),
    33	    path.join(skillDir, 'mcp_server', 'code-index-cli-manifest.ts'),
    34	    path.join(skillDir, 'mcp_server', 'tool-schemas.ts'),
    35	    path.join(skillDir, 'tsconfig.json'),
    36	  ];
    37	  const files = [];
    38	
    39	  const visit = (candidate) => {
    40	    if (!fs.existsSync(candidate)) return;
    41	    const stat = fs.statSync(candidate);
    42	    if (stat.isDirectory()) {
    43	      for (const entry of fs.readdirSync(candidate)) {
    44	        visit(path.join(candidate, entry));
    45	      }
    46	      return;
    47	    }
    48	    if (candidate.endsWith('.ts') || candidate.endsWith('.json')) {
    49	      files.push(candidate);
    50	    }
    51	  };
    52	
    53	  for (const candidate of candidates) visit(candidate);
    54	  return files;
    55	}
    56	
    57	function hashSourceFiles(existingSources) {
    58	  const hash = crypto.createHash('sha256');
    59	  for (const filePath of [...existingSources].sort()) {
    60	    hash.update(path.relative(skillDir, filePath));
    61	    hash.update('\0');
    62	    hash.update(fs.readFileSync(filePath));
    63	    hash.update('\0');
    64	  }
    65	  return hash.digest('hex');
    66	}
    67	
    68	function readStoredSourceHash() {
    69	  try {
    70	    const parsed = JSON.parse(fs.readFileSync(sourceHashState, 'utf8'));
    71	    return typeof parsed?.sourceHash === 'string' ? parsed.sourceHash : null;
    72	  } catch {
    73	    return null;
    74	  }
    75	}
    76	
    77	function writeStoredSourceHash(sourceHash) {
    78	  try {
    79	    fs.mkdirSync(path.dirname(sourceHashState), { recursive: true });
    80	    fs.writeFileSync(sourceHashState, `${JSON.stringify({ version: 1, sourceHash })}\n`);
    81	  } catch {
    82	    // Freshness metadata is an optimization; stale detection remains conservative.
    83	  }
    84	}
    85	
    86	function ensureFreshDist() {
    87	  if (!fs.existsSync(cliDist)) {
    88	    fail(`code-index dist entrypoint is missing: ${cliDist}. Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.`);
    89	  }
    90	  if (allowStale) return;
    91	  const existingSources = sourceCandidates();
    92	  if (existingSources.length === 0) return;
    93	  const currentSourceHash = hashSourceFiles(existingSources);
    94	  if (readStoredSourceHash() === currentSourceHash) return;
    95	  const newestSourceMtime = Math.max(...existingSources.map((filePath) => fs.statSync(filePath).mtimeMs));
    96	  const distMtime = fs.statSync(cliDist).mtimeMs;
    97	  if (newestSourceMtime > distMtime) {
    98	    fail('code-index dist entrypoint is stale. Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.');
    99	  }
   100	  writeStoredSourceHash(currentSourceHash);
   101	}
   102	
   103	function ensureSocketDir() {
   104	  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
   105	    process.env.SPECKIT_IPC_SOCKET_DIR = defaultSocketDir;
   106	  }
   107	  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
   108	  if (socketDir.startsWith('tcp://')) return;
   109	  fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
   110	  const socketPath = path.join(path.resolve(socketDir), socketFileName);
   111	  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
   112	    fail(`code-index socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
   113	  }
   114	}
   115	
   116	ensureSocketDir();
   117	ensureFreshDist();
   118	
   119	const result = spawnSync(process.execPath, [cliDist, ...process.argv.slice(2)], {
   120	  cwd: path.dirname(opencodeDir),
   121	  env: process.env,
   122	  stdio: 'inherit',
   123	});
   124	
   125	if (result.error) {
   126	  process.stderr.write(`${result.error.message}\n`);
   127	  process.exit(75);
   128	}
   129	
   130	process.exit(result.status ?? 1);

exec
/bin/zsh -lc "rg -n -- \"-32000|32000|Connection closed|retryable|backend recycled|session bridge unavailable|reconnect\" .opencode/bin .opencode/skills/system-code-graph/mcp_server -g '"'!node_modules'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: -g: No such file or directory (os error 2)
rg: !node_modules: No such file or directory (os error 2)
.opencode/bin/hf-model-server.cjs:630:    // A transient connection/timeout error is NOT a capability gap — it is retryable and must
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:107:      retryable: false,
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:116:  const retryable = exitCode === 75 || timedOut;
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:118:    status: retryable ? 'skipped' : 'fail_open',
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:121:    retryable,
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:311:      retryable: false,
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:321:      retryable: true,
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:397:          retryable: failure.retryable,
.opencode/bin/mk-skill-advisor-launcher.cjs:193:  // must not replay across reconnect. advisor_recommend stays replayable; one duplicate
.opencode/bin/mk-spec-memory-launcher.cjs:284:// the reconnecting session proxy, so 2nd+ clients survive a daemon recycle transparently
.opencode/bin/mk-spec-memory-launcher.cjs:615:      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
.opencode/bin/mk-spec-memory-launcher.cjs:616:      data: { retryable: true },
.opencode/bin/mk-spec-memory-launcher.cjs:1701:        // the loser bails and reconnects.
.opencode/bin/mk-spec-memory-launcher.cjs:1714:          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
.opencode/bin/mk-spec-memory-launcher.cjs:1728:            // reconnect instead.
.opencode/bin/cli-offline-smoke.test.cjs:49:    assert.strictEqual(stale.retryable, false);
.opencode/bin/mk-code-index-launcher.cjs:181:// Code-index replayable / unsafe tool sets for the reconnecting session proxy. Read-only structural
.opencode/bin/mk-code-index-launcher.cjs:183:// must NOT be replayed (the client re-drives it on a retryable recycle error). The proxy machinery is
.opencode/bin/mk-code-index-launcher.cjs:196:  // verification baseline), so it must NOT be replayed across a reconnect — the client re-drives it.
.opencode/bin/mk-code-index-launcher.cjs:204:// Bridge a secondary client through the reconnecting session proxy so a code-index owner death no
.opencode/bin/mk-code-index-launcher.cjs:205:// longer surfaces as a hard "Connection closed" — the proxy reattaches to the respawned backend and
.opencode/bin/mk-code-index-launcher.cjs:1071:        // MCP reconnects share the one daemon (matches mk-spec-memory-launcher).
.opencode/bin/mk-code-index-launcher.cjs:1202:// test, so the reconnecting-proxy wiring above can be unit-checked without spawning the daemon.
.opencode/bin/lib/launcher-session-proxy.cjs:4:// ║ PURPOSE: Bridges MCP stdio sessions to daemon IPC with safe reconnects. ║
.opencode/bin/lib/launcher-session-proxy.cjs:17:// Bounded so a dead/booting daemon surfaces a retryable -32001 to the client in ~tens of
.opencode/bin/lib/launcher-session-proxy.cjs:29:  message: 'backend recycled; retry',
.opencode/bin/lib/launcher-session-proxy.cjs:30:  data: { retryable: true },
.opencode/bin/lib/launcher-session-proxy.cjs:34:  message: 'backend protocol version changed; client reconnect required',
.opencode/bin/lib/launcher-session-proxy.cjs:35:  data: { retryable: false },
.opencode/bin/lib/launcher-session-proxy.cjs:235:function retryableErrorFrame(id) {
.opencode/bin/lib/launcher-session-proxy.cjs:514:    failPendingAndEndWith(retryableErrorFrame);
.opencode/bin/lib/launcher-session-proxy.cjs:526:        enqueueOutputFrame(retryableErrorFrame(parsed.id));
.opencode/bin/lib/launcher-session-proxy.cjs:665:      enqueueOutputFrame(retryableErrorFrame(id));
.opencode/bin/lib/launcher-session-proxy.cjs:685:      // end the session with a non-retryable error instead of attaching the socket.
.opencode/bin/lib/launcher-session-proxy.cjs:828:          data: { retryable: true },
.opencode/bin/README.md:25:- Launcher reliability knobs — persistent log, lease-probe reap hardening, the mk-code-index reconnecting proxy, the Stop-hook orphan-sweep fallback, and default-on daemon re-election for mk-spec-memory — are operator-tunable via `SPECKIT_LAUNCHER_LOG`, `SPECKIT_LEASE_PROBE_RETRIES`, `SPECKIT_STOP_HOOK_ORPHAN_SWEEP`, and `SPECKIT_DAEMON_REELECTION`; see the MCP server's [`ENV_REFERENCE.md`](../skills/system-spec-kit/mcp_server/ENV_REFERENCE.md).
.opencode/bin/README.md:161:**Exit taxonomy (shared).** `0` success, `1` runtime error, `64` usage/schema error, `69` protocol mismatch or missing/stale dist, `75` retryable daemon error. A `spawnSync` failure in the shim itself also exits `75`.
.opencode/bin/lib/launcher-ipc-bridge.cjs:433:  // Await so an injected reconnecting bridge (whose start() resolves after the first
.opencode/bin/lib/README.md:14:`bin/lib/` holds the shared CommonJS helpers that the MCP launchers in `bin/` require. It supervises the lifetime of the hf-model-server, bridges launcher stdio to a running daemon socket, reconnects that bridge transparently across daemon recycles, and constrains the environment passed to the embedding sidecar.
.opencode/bin/lib/README.md:20:- `launcher-session-proxy.cjs` fronts the daemon with a reconnecting stdin/stdout bridge that reattaches and replays in-flight read frames across a daemon recycle, and exposes the `createClassifyFrame` factory each launcher uses to declare its own replayable and unsafe tool sets.
.opencode/bin/lib/README.md:74:| `launcher-session-proxy.cjs` | Fronts the daemon with a reconnecting stdin/stdout bridge that reattaches across a daemon recycle and replays in-flight read frames, and exports the `createClassifyFrame({ replayableToolNames, unsafeToolNames })` factory each launcher passes its own replay set to. |
.opencode/bin/lib/README.md:131:| `createSessionProxy` | Function | Build the reconnecting stdin/stdout proxy that reattaches and replays in-flight read frames across a daemon recycle. |
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:7:// /private/tmp on macOS), crashing the server with MCP error -32000. The guard
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:256:  0 success, 1 runtime error, 64 usage/schema error, 69 protocol/dist mismatch, 75 retryable daemon error

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/launcher-session-proxy.cjs | sed -n '260,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	
   261	    const cleanup = () => {
   262	      socket.off?.('connect', onConnect);
   263	      socket.off?.('error', onError);
   264	    };
   265	    const onConnect = () => {
   266	      cleanup();
   267	      resolve(socket);
   268	    };
   269	    const onError = (error) => {
   270	      cleanup();
   271	      socket.destroy?.();
   272	      reject(error);
   273	    };
   274	
   275	    socket.once('connect', onConnect);
   276	    socket.once('error', onError);
   277	  });
   278	}
   279	
   280	function internalHandshake(socket, initializeFrame) {
   281	  if (!initializeFrame) return Promise.resolve({ residual: '', protocolVersion: undefined, handshakeObserved: false, initializeResponse: null });
   282	
   283	  const initialize = parseFrame(initializeFrame);
   284	  if (!initialize || !hasRequestId(initialize)) {
   285	    return Promise.resolve({ residual: '', protocolVersion: undefined, handshakeObserved: false, initializeResponse: null });
   286	  }
   287	
   288	  return new Promise((resolve, reject) => {
   289	    let buffer = '';
   290	    let residual = '';
   291	    let negotiatedVersion;
   292	    let initializeResponse = null;
   293	    // Hold a multibyte char split across chunk boundaries until complete, so a CJK/emoji
   294	    // payload in the residual (post-handshake) stream is not corrupted to U+FFFD.
   295	    const decoder = new StringDecoder('utf8');
   296	    const timer = setTimeout(() => {
   297	      cleanup();
   298	      reject(new Error('timed out waiting for internal initialize'));
   299	    }, INTERNAL_HANDSHAKE_TIMEOUT_MS);
   300	    timer.unref?.();
   301	    const cleanup = () => {
   302	      clearTimeout(timer);
   303	      socket.off?.('data', onData);
   304	      socket.off?.('error', onError);
   305	      socket.off?.('close', onClose);
   306	    };
   307	    const onData = (chunk) => {
   308	      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
   309	      let initialized = false;
   310	      let newlineIndex = buffer.indexOf('\n');
   311	      while (newlineIndex !== -1) {
   312	        const frame = buffer.slice(0, newlineIndex);
   313	        buffer = buffer.slice(newlineIndex + 1);
   314	        newlineIndex = buffer.indexOf('\n');
   315	        if (frame.trim().length === 0) continue;
   316	        const parsed = parseFrame(frame);
   317	        if (parsed && isResponseFrame(parsed) && parsed.id === initialize.id) {
   318	          initialized = true;
   319	          initializeResponse = frame;
   320	          negotiatedVersion = parsed.result && typeof parsed.result === 'object'
   321	            ? parsed.result.protocolVersion
   322	            : undefined;
   323	          continue;
   324	        }
   325	        residual += `${frame}\n`;
   326	      }
   327	      if (!initialized) return;
   328	      const remainder = residual + buffer;
   329	      buffer = '';
   330	      residual = '';
   331	      cleanup();
   332	      resolve({ residual: remainder, protocolVersion: negotiatedVersion, handshakeObserved: true, initializeResponse });
   333	    };
   334	    const onError = (error) => {
   335	      cleanup();
   336	      reject(error);
   337	    };
   338	    const onClose = () => {
   339	      cleanup();
   340	      reject(new Error('socket closed during internal initialize'));
   341	    };
   342	
   343	    socket.on('data', onData);
   344	    socket.once('error', onError);
   345	    socket.once('close', onClose);
   346	    writeFrame(socket, initializeFrame);
   347	  });
   348	}
   349	
   350	function createSessionProxy(options) {
   351	  const socketPath = options?.socketPath;
   352	  const input = options?.stdin ?? process.stdin;
   353	  const output = options?.stdout ?? process.stdout;
   354	  const probe = options?.probe ?? probeDaemon;
   355	  const connect = options?.connect ?? defaultConnect;
   356	  const log = options?.log ?? defaultLog;
   357	  const classify = options?.classify ?? classifyFrame;
   358	  const maxReattachAttempts = Number.isInteger(options?.maxReattachAttempts) && options.maxReattachAttempts > 0
   359	    ? options.maxReattachAttempts
   360	    : DEFAULT_MAX_REATTACH_ATTEMPTS;
   361	  const maxColdStartAttempts = Number.isInteger(options?.maxColdStartAttempts) && options.maxColdStartAttempts > 0
   362	    ? options.maxColdStartAttempts
   363	    : resolveColdStartAttempts();
   364	  const keepaliveIntervalMs = Number.isInteger(options?.keepaliveIntervalMs) && options.keepaliveIntervalMs > 0
   365	    ? options.keepaliveIntervalMs
   366	    : DEFAULT_KEEPALIVE_INTERVAL_MS;
   367	  const keepaliveTimeoutMs = Number.isInteger(options?.keepaliveTimeoutMs) && options.keepaliveTimeoutMs > 0
   368	    ? options.keepaliveTimeoutMs
   369	    : DEFAULT_KEEPALIVE_TIMEOUT_MS;
   370	  const maxQueuedClientFrames = Number.isInteger(options?.maxQueuedClientFrames) && options.maxQueuedClientFrames > 0
   371	    ? options.maxQueuedClientFrames
   372	    : DEFAULT_MAX_QUEUED_CLIENT_FRAMES;
   373	
   374	  let socket = null;
   375	  let state = 'REATTACHING';
   376	  let stopped = false;
   377	  let clientEnded = false;
   378	  let reattachRunning = false;
   379	  let backendSplitter = createFrameSplitter(handleBackendFrame);
   380	  let socketHalfClosed = false;
   381	  let keepaliveInterval = null;
   382	  let keepaliveTimer = null;
   383	  let keepaliveId = 0;
   384	  let pendingKeepaliveId = null;
   385	  let lastBackendActivity = Date.now();
   386	  let socketDrainWaiting = false;
   387	  let outputDrainWaiting = false;
   388	  let outputEndRequested = false;
   389	  const queuedClientFrames = [];
   390	  const socketWriteQueue = [];
   391	  const outputWriteQueue = [];
   392	  const tracker = createPendingRequestsTracker(classify);
   393	  const clientSplitter = createFrameSplitter(handleClientFrame);
   394	
   395	  if (typeof socketPath !== 'string' || socketPath.length === 0) {
   396	    throw new Error('createSessionProxy requires a non-empty socketPath');
   397	  }
   398	
   399	  function pauseClientInput() {
   400	    input.pause?.();
   401	  }
   402	
   403	  function resumeClientInputIfReady() {
   404	    if (!clientEnded && !stopped && state === 'CONNECTED') input.resume?.();
   405	  }
   406	
   407	  function stopKeepalive() {
   408	    if (keepaliveInterval !== null) {
   409	      clearInterval(keepaliveInterval);
   410	      keepaliveInterval = null;
   411	    }
   412	    if (keepaliveTimer !== null) {
   413	      clearTimeout(keepaliveTimer);
   414	      keepaliveTimer = null;
   415	    }
   416	    pendingKeepaliveId = null;
   417	  }
   418	
   419	  function detachSocket(destroy = true) {
   420	    stopKeepalive();
   421	    if (!socket) return;
   422	    const oldSocket = socket;
   423	    socket = null;
   424	    socketHalfClosed = false;
   425	    // The backpressure 'drain' wait was bound to this now-discarded socket and its
   426	    // handler short-circuits once the socket is swapped, so it can never reset the
   427	    // flag. Clear it here (and drop the listener) or the next socket's pump stays
   428	    // blocked forever — a silent hang when backpressure coincides with a recycle.
   429	    socketDrainWaiting = false;
   430	    oldSocket.removeAllListeners?.('data');
   431	    oldSocket.removeAllListeners?.('error');
   432	    oldSocket.removeAllListeners?.('close');
   433	    oldSocket.removeAllListeners?.('drain');
   434	    if (destroy) oldSocket.destroy?.();
   435	  }
   436	
   437	  function finishIfClientEndedAndIdle() {
   438	    if (!clientEnded || stopped) return;
   439	    if (queuedClientFrames.length > 0 || socketWriteQueue.length > 0 || tracker.pendingRequests.size > 0) return;
   440	    requestOutputEnd();
   441	  }
   442	
   443	  function halfCloseSocketIfReady() {
   444	    if (!clientEnded || !socket || state !== 'CONNECTED' || socketHalfClosed) return;
   445	    if (socketDrainWaiting || socketWriteQueue.length > 0) return;
   446	    socketHalfClosed = true;
   447	    socket.end?.();
   448	    finishIfClientEndedAndIdle();
   449	  }
   450	
   451	  function stop() {
   452	    if (stopped) return;
   453	    stopped = true;
   454	    input.off?.('data', onInputData);
   455	    input.off?.('end', onInputEnd);
   456	    input.off?.('close', onInputClose);
   457	    output.off?.('error', onOutputError);
   458	    detachSocket(true);
   459	  }
   460	
   461	  function pumpOutputQueue() {
   462	    if (outputDrainWaiting) return;
   463	    while (outputWriteQueue.length > 0) {
   464	      const frame = outputWriteQueue[0];
   465	      const accepted = writeFrame(output, frame);
   466	      outputWriteQueue.shift();
   467	      if (!accepted) {
   468	        outputDrainWaiting = true;
   469	        socket?.pause?.();
   470	        output.once?.('drain', () => {
   471	          outputDrainWaiting = false;
   472	          socket?.resume?.();
   473	          pumpOutputQueue();
   474	        });
   475	        return;
   476	      }
   477	    }
   478	    if (outputEndRequested) {
   479	      output.end?.();
   480	      stop();
   481	    }
   482	  }
   483	
   484	  function enqueueOutputFrame(frame) {
   485	    outputWriteQueue.push(frame);
   486	    pumpOutputQueue();
   487	  }
   488	
   489	  function requestOutputEnd() {
   490	    outputEndRequested = true;
   491	    pumpOutputQueue();
   492	  }
   493	
   494	  function failPendingAndEndWith(makeErrorFrame) {
   495	    const failedIds = new Set();
   496	    for (const id of tracker.pendingRequests.keys()) {
   497	      failedIds.add(JSON.stringify(id));
   498	      enqueueOutputFrame(makeErrorFrame(id));
   499	    }
   500	    tracker.pendingRequests.clear();
   501	    while (queuedClientFrames.length > 0) {
   502	      const frame = queuedClientFrames.shift();
   503	      const parsed = parseFrame(frame);
   504	      if (!hasRequestId(parsed)) continue;
   505	      const key = JSON.stringify(parsed.id);
   506	      if (failedIds.has(key)) continue;
   507	      failedIds.add(key);
   508	      enqueueOutputFrame(makeErrorFrame(parsed.id));
   509	    }
   510	    requestOutputEnd();
   511	  }
   512	
   513	  function failPendingAndEnd() {
   514	    failPendingAndEndWith(retryableErrorFrame);
   515	  }
   516	
   517	  function failPendingAndEndProtocolMismatch() {
   518	    failPendingAndEndWith(protocolMismatchErrorFrame);
   519	  }
   520	
   521	  function failOldestQueuedClientFrame() {
   522	    while (queuedClientFrames.length > maxQueuedClientFrames) {
   523	      const frame = queuedClientFrames.shift();
   524	      const parsed = parseFrame(frame);
   525	      if (hasRequestId(parsed)) {
   526	        enqueueOutputFrame(retryableErrorFrame(parsed.id));
   527	        tracker.pendingRequests.delete(parsed.id);
   528	      }
   529	    }
   530	  }
   531	
   532	  function queueClientFrame(frame) {
   533	    queuedClientFrames.push(frame);
   534	    failOldestQueuedClientFrame();
   535	  }
   536	
   537	  function pumpSocketQueue() {
   538	    if (!socket || state !== 'CONNECTED' || socketDrainWaiting) return;
   539	    while (socketWriteQueue.length > 0 && socket && state === 'CONNECTED') {
   540	      const activeSocket = socket;
   541	      const frame = socketWriteQueue[0];
   542	      const accepted = writeFrame(activeSocket, frame);
   543	      socketWriteQueue.shift();
   544	      if (!accepted) {
   545	        socketDrainWaiting = true;
   546	        pauseClientInput();
   547	        activeSocket.once?.('drain', () => {
   548	          if (activeSocket !== socket) return;
   549	          socketDrainWaiting = false;
   550	          resumeClientInputIfReady();
   551	          pumpSocketQueue();
   552	        });
   553	        return;
   554	      }
   555	    }
   556	    halfCloseSocketIfReady();
   557	    resumeClientInputIfReady();
   558	  }
   559	
   560	  function enqueueSocketFrame(frame) {
   561	    socketWriteQueue.push(frame);
   562	    pumpSocketQueue();
   563	  }
   564	
   565	  function sendKeepalive() {
   566	    if (!socket || state !== 'CONNECTED' || pendingKeepaliveId !== null) return;
   567	    if (Date.now() - lastBackendActivity < keepaliveIntervalMs) return;
   568	    pendingKeepaliveId = `${PROXY_PRIVATE_ID_PREFIX}${keepaliveId += 1}`;
   569	    enqueueSocketFrame(JSON.stringify({ jsonrpc: '2.0', id: pendingKeepaliveId, method: 'ping' }));
   570	    keepaliveTimer = setTimeout(() => {
   571	      keepaliveTimer = null;
   572	      if (pendingKeepaliveId === null) return;
   573	      pendingKeepaliveId = null;
   574	      handleBackendFailure('keepalive-timeout');
   575	    }, keepaliveTimeoutMs);
   576	    keepaliveTimer.unref?.();
   577	  }
   578	
   579	  function startKeepalive() {
   580	    stopKeepalive();
   581	    lastBackendActivity = Date.now();
   582	    keepaliveInterval = setInterval(sendKeepalive, keepaliveIntervalMs);
   583	    keepaliveInterval.unref?.();
   584	  }
   585	
   586	  function forwardClientFrame(frame) {
   587	    tracker.handleClientFrame(frame);
   588	    if (!socket || state !== 'CONNECTED') {
   589	      queueClientFrame(frame);
   590	      return;
   591	    }
   592	    enqueueSocketFrame(frame);
   593	  }
   594	
   595	  function flushQueuedClientFrames() {
   596	    while (queuedClientFrames.length > 0 && socket && state === 'CONNECTED') {
   597	      forwardClientFrame(queuedClientFrames.shift());
   598	    }
   599	  }
   600	
   601	  function handleClientFrame(frame) {
   602	    const parsedClient = parseFrame(frame);
   603	    if (parsedClient
   604	        && parsedClient.method !== undefined
   605	        && typeof parsedClient.id === 'string'
   606	        && parsedClient.id.startsWith(PROXY_PRIVATE_ID_PREFIX)) {
   607	      // This id prefix is reserved for the proxy's private keepalive pings. A
   608	      // client request carrying a colliding id would have its backend response
   609	      // silently swallowed by the keepalive interceptor in handleBackendFrame,
   610	      // hanging the request. Reject the reserved id rather than forward it.
   611	      enqueueOutputFrame(JSON.stringify({
   612	        jsonrpc: '2.0',
   613	        id: parsedClient.id,
   614	        error: { code: -32600, message: 'Request id uses a reserved prefix' },
   615	      }));
   616	      return;
   617	    }
   618	    if (state !== 'CONNECTED' || !socket) {
   619	      queueClientFrame(frame);
   620	      return;

codex
{"angle":"test-harness-and-verdict","confirms":["GLM's root-cause model is correct: code-index owner liveness is mostly PID/heartbeat based. `processLiveness` only calls `process.kill(pid, 0)`, and `classifyOwnerLease` returns `live-owner` after PPID and heartbeat checks without socket validation. Evidence: .opencode/bin/mk-code-index-launcher.cjs:423, .opencode/bin/mk-code-index-launcher.cjs:455.","GLM is right to reuse the bridge deep probe: `probeDaemon(..., {deepProbe:true})` sends JSON-RPC `initialize` and only reports alive after a JSON-RPC reply; `probeLeaseHolderWithRetries` already wraps this with retry semantics. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:150, .opencode/bin/lib/launcher-ipc-bridge.cjs:197, .opencode/bin/lib/launcher-ipc-bridge.cjs:337.","GLM is right that the no-socket branch is inert: `maybeBridgeLeaseHolder` writes `LEASE_HELD_BY ... (no-bridge-socket)` and returns `report`, so `respawnAfterDeadSocket` is never reached for a missing socket. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:405, .opencode/bin/mk-code-index-launcher.cjs:719.","GLM is right that heartbeat freshness is not socket-gated today: the launcher starts a timer that calls `refreshOwnerLeaseFile(ownerPid)` and, after child spawn, records the child PID while the parent timer keeps refreshing. Evidence: .opencode/bin/mk-code-index-launcher.cjs:394, .opencode/bin/mk-code-index-launcher.cjs:973.","GLM is right that WAL hygiene is missing: `initDb` sets `busy_timeout`, `journal_mode = WAL`, and `foreign_keys`, but no `wal_autocheckpoint`; migration copies `code-graph.sqlite-wal` directly. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1037, .opencode/bin/mk-code-index-launcher.cjs:1125.","GLM is right that ownership safety is incomplete: the UID check only guards legacy PID leases, while primary lease files are accepted without a same-uid check; the reaper then sends SIGTERM/SIGKILL to the recorded PID without PID identity validation. Evidence: .opencode/bin/mk-code-index-launcher.cjs:588, .opencode/bin/mk-code-index-launcher.cjs:640."],"refutes":[{"target":"GLM claim: existing unlink + O_EXCL CAS handles reclaim atomically, so no CAS change is needed","problem":"False. The stale-reclaim path unlinks the existing owner lease by path before `writeOwnerLeaseFileExclusive`. If racer A writes a fresh lease after racer B's stale read but before B's unlink, B can delete A's fresh lease and then win its own exclusive create. This is not a conditional CAS; it needs inode/content revalidation, a rename-claim, or the existing owner-lease mutation lock pattern.","evidence":".opencode/bin/mk-code-index-launcher.cjs:491"},{"target":"GLM claim: put deep socket probing directly into `classifyOwnerLease` / `leaseHeldFromFile`","problem":"The stated placement is not viable as-is. Both functions are synchronous and feed synchronous acquisition paths; deep probe is asynchronous. Implementing this literally would either block awkwardly or force an async refactor through `acquireOwnerLeaseFile` and callers. The correct change is an async, injected socket-health classifier wrapped around the current sync lease reads.","evidence":".opencode/bin/mk-code-index-launcher.cjs:455"},{"target":"GLM claim: startup grace can be keyed on a new `childSpawnedAtIso` stamped after child PID is known","problem":"Correct concept, but the current lease schema does not contain that field. `startedAtIso` is created before child spawn, and the child-PID refresh only patches `ownerPid`, `ppid`, and `executablePath`, so any implementation using existing timestamps would mis-age daemon startup.","evidence":".opencode/bin/mk-code-index-launcher.cjs:410"},{"target":"GLM claim: crash-surviving PID registry exists as a straightforward extension of current state","problem":"The current code has only `.mk-code-index-launcher.json` and `.code-graph-owner.json`; `writeState` writes the launcher PID file path and is not a daemon-child registry. If both lease files vanish, the launcher has no durable child PID to reap, which was part of the incident.","evidence":".opencode/bin/mk-code-index-launcher.cjs:114"},{"target":"GLM claim: diagnostics design is mostly replacing manual forensics","problem":"Not yet in code. Current failure paths emit ad hoc stderr logs or plain `LEASE_HELD_BY` lines, including the no-socket case; there is no structured `LAUNCHER_DIAGNOSTIC` token with WAL holder, owner PID, and reason.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:405"}],"gaps":["The test harness must not rely on wall-clock 30s/120s waits. Add env-overrides for startup grace and max init, then age test leases by timestamp so CI runs in milliseconds.","The fake wedged owner should be a live Node sleeper launched at a path ending in `.opencode/skills/system-code-graph/mcp_server/dist/index.js`, with an owner lease pointing at its PID and an absent socket path. That gives daemon-like argv without a real daemon.","The foreign-uid integration case is only runnable when CI can create files/processes as another uid, usually root with `chown` or a `nobody` runner. Otherwise mark the process-level test skipped and cover the logic with injected `stat.uid` / `getuid` unit tests.","The PID-reuse case should be deterministic via injected process identity, not real PID reuse. Use a live sleeper with mismatched executable/start-time data and assert no signal is sent.","The two-launcher race cannot be proven reliably by the current spawned-process test; that test explicitly says end-state CAS assertions are unsound at this layer. A unit-level interleaving test around conditional stale-lease acquisition is required. Evidence: .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:459.","The code-index reaper lacks the spec-memory safety guard that refuses socket-probe reaping when the owner heartbeat is still fresh. A busy daemon with a live process and transient probe timeout can be killed today. Evidence: .opencode/bin/mk-code-index-launcher.cjs:640, contrast .opencode/bin/mk-spec-memory-launcher.cjs:770.","Migration coverage already asserts exactly one migration under two concurrent launchers, but it seeds only `code-graph.sqlite`; it does not cover oversized WAL propagation or checkpoint-before-copy. Evidence: .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:355."],"new_recommendations":[{"change":"Add an async `classifyLaunchOwner` helper with injected clock, process liveness, process identity, file stat, socket existence, and deep probe. It should return states like `healthy`, `startup-grace`, `startup-deadline-exceeded`, `dead-socket`, `foreign-owner`, and `pid-reuse-suspected`.","where":".opencode/bin/mk-code-index-launcher.cjs:classifyOwnerLease","why":"This makes the wedge, grace, foreign-uid, and PID-reuse cases deterministic without spawning a real daemon."},{"change":"Fix stale owner reclaim with conditional acquisition: re-stat/re-read the lease after classification and before unlink, or claim it via rename/lock so a racer cannot delete a winner's fresh lease.","where":".opencode/bin/mk-code-index-launcher.cjs:acquireOwnerLeaseFile","why":"The current unlink-before-`O_EXCL` is not a true CAS under stale-reclaim races."},{"change":"Test: wedged owner past max init. Setup: create isolated workspace, spawn Node sleeper at fake `system-code-graph/mcp_server/dist/index.js`, write owner lease with old `childSpawnedAtIso`, old heartbeat, same uid, expected socket path absent, and small `MAX_INIT_MS`. Assert: launcher reclaims, fake PID exits, new owner lease PID differs, diagnostic contains `startup-timeout` or `dead-socket-reclaimed`.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Covers the exact incident class: PID alive, no IPC socket, stale initialization budget."},{"change":"Test: within-grace owner spared. Setup: same fake daemon and absent socket, but `childSpawnedAtIso` is now and grace is larger than age. Assert: fake PID remains live, no SIGTERM/SIGKILL, launcher reports `still-starting`/retryable diagnostic instead of respawn.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Prevents the hardening from killing legitimate slow startup."},{"change":"Test: foreign uid. Setup: when running with privileges, create lease/socket owned by another uid or spawn owner as another uid; otherwise `skipIf` and run injected-unit coverage for `stat.uid !== getuid`. Assert: no unlink, no signal, diagnostic `foreign-owner`.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Primary lease safety currently lacks the legacy-path UID guard."},{"change":"Test: PID reuse / identity mismatch. Setup: live sleeper PID, lease claims expected daemon executable/start-time that do not match injected process identity. Assert: no signal sent, owner remains live, diagnostic `pid-reuse-suspected`.","where":".opencode/bin/mk-code-index-launcher.cjs:reapOwnerBeforeRespawn","why":"Prevents SIGKILL against an unrelated process after PID reuse."},{"change":"Test: two-launcher stale-reclaim CAS. Setup: unit helper with an injected interleaving where racer A writes a fresh lease and racer B then attempts stale unlink. Assert: exactly one acquire succeeds, final lease is the winner, loser does not delete winner. Avoid spawned-process timing for this assertion.","where":".opencode/bin/mk-code-index-launcher.cjs:acquireOwnerLeaseFile","why":"This is the deterministic race GLM's timed-out pass missed."},{"change":"Add `checkpointOversizedWal(dbDir, thresholdBytes)` and call it before spawn and before migration copy; add `PRAGMA wal_autocheckpoint=500` in `initDb`.","where":".opencode/bin/mk-code-index-launcher.cjs:launcherMain and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:initDb","why":"Prevents a giant orphaned WAL from being propagated or replayed on every startup."},{"change":"Test: oversized WAL checkpoint. Setup: create temp SQLite DB in WAL mode with `wal_autocheckpoint=0`, write enough rows/blobs to exceed a tiny test threshold, close all writers, call checkpoint helper. Assert: WAL size is zero or below threshold and `PRAGMA integrity_check` returns ok.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Covers the 17MB orphaned WAL axis without a real daemon."},{"change":"Test: migration-copy with WAL. Setup: former shared DB dir contains valid `code-graph.sqlite` plus oversized WAL, target empty, two launchers start concurrently. Assert: exactly one migration log, target DB integrity ok, target WAL absent/truncated, former location preserved, no clobber.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Extends the existing migration race test to the WAL failure mode GLM identified."},{"change":"Emit one structured diagnostic line on every report/respawn/failure path, including no-socket, probe-timeout, foreign-owner, pid-reuse, WAL-locked, and stale-heartbeat outcomes.","where":".opencode/bin/mk-code-index-launcher.cjs:bridgeOrReportLeaseHeld and .opencode/bin/lib/launcher-ipc-bridge.cjs:maybeBridgeLeaseHolder","why":"The incident required manual `ps`/`lsof` forensics; structured reason tokens make CI and operator recovery assertable."}],"verdict":"sound-with-fixes"}
hook: Stop
hook: Stop Completed
tokens used
150,960
{"angle":"test-harness-and-verdict","confirms":["GLM's root-cause model is correct: code-index owner liveness is mostly PID/heartbeat based. `processLiveness` only calls `process.kill(pid, 0)`, and `classifyOwnerLease` returns `live-owner` after PPID and heartbeat checks without socket validation. Evidence: .opencode/bin/mk-code-index-launcher.cjs:423, .opencode/bin/mk-code-index-launcher.cjs:455.","GLM is right to reuse the bridge deep probe: `probeDaemon(..., {deepProbe:true})` sends JSON-RPC `initialize` and only reports alive after a JSON-RPC reply; `probeLeaseHolderWithRetries` already wraps this with retry semantics. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:150, .opencode/bin/lib/launcher-ipc-bridge.cjs:197, .opencode/bin/lib/launcher-ipc-bridge.cjs:337.","GLM is right that the no-socket branch is inert: `maybeBridgeLeaseHolder` writes `LEASE_HELD_BY ... (no-bridge-socket)` and returns `report`, so `respawnAfterDeadSocket` is never reached for a missing socket. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:405, .opencode/bin/mk-code-index-launcher.cjs:719.","GLM is right that heartbeat freshness is not socket-gated today: the launcher starts a timer that calls `refreshOwnerLeaseFile(ownerPid)` and, after child spawn, records the child PID while the parent timer keeps refreshing. Evidence: .opencode/bin/mk-code-index-launcher.cjs:394, .opencode/bin/mk-code-index-launcher.cjs:973.","GLM is right that WAL hygiene is missing: `initDb` sets `busy_timeout`, `journal_mode = WAL`, and `foreign_keys`, but no `wal_autocheckpoint`; migration copies `code-graph.sqlite-wal` directly. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1037, .opencode/bin/mk-code-index-launcher.cjs:1125.","GLM is right that ownership safety is incomplete: the UID check only guards legacy PID leases, while primary lease files are accepted without a same-uid check; the reaper then sends SIGTERM/SIGKILL to the recorded PID without PID identity validation. Evidence: .opencode/bin/mk-code-index-launcher.cjs:588, .opencode/bin/mk-code-index-launcher.cjs:640."],"refutes":[{"target":"GLM claim: existing unlink + O_EXCL CAS handles reclaim atomically, so no CAS change is needed","problem":"False. The stale-reclaim path unlinks the existing owner lease by path before `writeOwnerLeaseFileExclusive`. If racer A writes a fresh lease after racer B's stale read but before B's unlink, B can delete A's fresh lease and then win its own exclusive create. This is not a conditional CAS; it needs inode/content revalidation, a rename-claim, or the existing owner-lease mutation lock pattern.","evidence":".opencode/bin/mk-code-index-launcher.cjs:491"},{"target":"GLM claim: put deep socket probing directly into `classifyOwnerLease` / `leaseHeldFromFile`","problem":"The stated placement is not viable as-is. Both functions are synchronous and feed synchronous acquisition paths; deep probe is asynchronous. Implementing this literally would either block awkwardly or force an async refactor through `acquireOwnerLeaseFile` and callers. The correct change is an async, injected socket-health classifier wrapped around the current sync lease reads.","evidence":".opencode/bin/mk-code-index-launcher.cjs:455"},{"target":"GLM claim: startup grace can be keyed on a new `childSpawnedAtIso` stamped after child PID is known","problem":"Correct concept, but the current lease schema does not contain that field. `startedAtIso` is created before child spawn, and the child-PID refresh only patches `ownerPid`, `ppid`, and `executablePath`, so any implementation using existing timestamps would mis-age daemon startup.","evidence":".opencode/bin/mk-code-index-launcher.cjs:410"},{"target":"GLM claim: crash-surviving PID registry exists as a straightforward extension of current state","problem":"The current code has only `.mk-code-index-launcher.json` and `.code-graph-owner.json`; `writeState` writes the launcher PID file path and is not a daemon-child registry. If both lease files vanish, the launcher has no durable child PID to reap, which was part of the incident.","evidence":".opencode/bin/mk-code-index-launcher.cjs:114"},{"target":"GLM claim: diagnostics design is mostly replacing manual forensics","problem":"Not yet in code. Current failure paths emit ad hoc stderr logs or plain `LEASE_HELD_BY` lines, including the no-socket case; there is no structured `LAUNCHER_DIAGNOSTIC` token with WAL holder, owner PID, and reason.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:405"}],"gaps":["The test harness must not rely on wall-clock 30s/120s waits. Add env-overrides for startup grace and max init, then age test leases by timestamp so CI runs in milliseconds.","The fake wedged owner should be a live Node sleeper launched at a path ending in `.opencode/skills/system-code-graph/mcp_server/dist/index.js`, with an owner lease pointing at its PID and an absent socket path. That gives daemon-like argv without a real daemon.","The foreign-uid integration case is only runnable when CI can create files/processes as another uid, usually root with `chown` or a `nobody` runner. Otherwise mark the process-level test skipped and cover the logic with injected `stat.uid` / `getuid` unit tests.","The PID-reuse case should be deterministic via injected process identity, not real PID reuse. Use a live sleeper with mismatched executable/start-time data and assert no signal is sent.","The two-launcher race cannot be proven reliably by the current spawned-process test; that test explicitly says end-state CAS assertions are unsound at this layer. A unit-level interleaving test around conditional stale-lease acquisition is required. Evidence: .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:459.","The code-index reaper lacks the spec-memory safety guard that refuses socket-probe reaping when the owner heartbeat is still fresh. A busy daemon with a live process and transient probe timeout can be killed today. Evidence: .opencode/bin/mk-code-index-launcher.cjs:640, contrast .opencode/bin/mk-spec-memory-launcher.cjs:770.","Migration coverage already asserts exactly one migration under two concurrent launchers, but it seeds only `code-graph.sqlite`; it does not cover oversized WAL propagation or checkpoint-before-copy. Evidence: .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:355."],"new_recommendations":[{"change":"Add an async `classifyLaunchOwner` helper with injected clock, process liveness, process identity, file stat, socket existence, and deep probe. It should return states like `healthy`, `startup-grace`, `startup-deadline-exceeded`, `dead-socket`, `foreign-owner`, and `pid-reuse-suspected`.","where":".opencode/bin/mk-code-index-launcher.cjs:classifyOwnerLease","why":"This makes the wedge, grace, foreign-uid, and PID-reuse cases deterministic without spawning a real daemon."},{"change":"Fix stale owner reclaim with conditional acquisition: re-stat/re-read the lease after classification and before unlink, or claim it via rename/lock so a racer cannot delete a winner's fresh lease.","where":".opencode/bin/mk-code-index-launcher.cjs:acquireOwnerLeaseFile","why":"The current unlink-before-`O_EXCL` is not a true CAS under stale-reclaim races."},{"change":"Test: wedged owner past max init. Setup: create isolated workspace, spawn Node sleeper at fake `system-code-graph/mcp_server/dist/index.js`, write owner lease with old `childSpawnedAtIso`, old heartbeat, same uid, expected socket path absent, and small `MAX_INIT_MS`. Assert: launcher reclaims, fake PID exits, new owner lease PID differs, diagnostic contains `startup-timeout` or `dead-socket-reclaimed`.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Covers the exact incident class: PID alive, no IPC socket, stale initialization budget."},{"change":"Test: within-grace owner spared. Setup: same fake daemon and absent socket, but `childSpawnedAtIso` is now and grace is larger than age. Assert: fake PID remains live, no SIGTERM/SIGKILL, launcher reports `still-starting`/retryable diagnostic instead of respawn.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Prevents the hardening from killing legitimate slow startup."},{"change":"Test: foreign uid. Setup: when running with privileges, create lease/socket owned by another uid or spawn owner as another uid; otherwise `skipIf` and run injected-unit coverage for `stat.uid !== getuid`. Assert: no unlink, no signal, diagnostic `foreign-owner`.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Primary lease safety currently lacks the legacy-path UID guard."},{"change":"Test: PID reuse / identity mismatch. Setup: live sleeper PID, lease claims expected daemon executable/start-time that do not match injected process identity. Assert: no signal sent, owner remains live, diagnostic `pid-reuse-suspected`.","where":".opencode/bin/mk-code-index-launcher.cjs:reapOwnerBeforeRespawn","why":"Prevents SIGKILL against an unrelated process after PID reuse."},{"change":"Test: two-launcher stale-reclaim CAS. Setup: unit helper with an injected interleaving where racer A writes a fresh lease and racer B then attempts stale unlink. Assert: exactly one acquire succeeds, final lease is the winner, loser does not delete winner. Avoid spawned-process timing for this assertion.","where":".opencode/bin/mk-code-index-launcher.cjs:acquireOwnerLeaseFile","why":"This is the deterministic race GLM's timed-out pass missed."},{"change":"Add `checkpointOversizedWal(dbDir, thresholdBytes)` and call it before spawn and before migration copy; add `PRAGMA wal_autocheckpoint=500` in `initDb`.","where":".opencode/bin/mk-code-index-launcher.cjs:launcherMain and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:initDb","why":"Prevents a giant orphaned WAL from being propagated or replayed on every startup."},{"change":"Test: oversized WAL checkpoint. Setup: create temp SQLite DB in WAL mode with `wal_autocheckpoint=0`, write enough rows/blobs to exceed a tiny test threshold, close all writers, call checkpoint helper. Assert: WAL size is zero or below threshold and `PRAGMA integrity_check` returns ok.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Covers the 17MB orphaned WAL axis without a real daemon."},{"change":"Test: migration-copy with WAL. Setup: former shared DB dir contains valid `code-graph.sqlite` plus oversized WAL, target empty, two launchers start concurrently. Assert: exactly one migration log, target DB integrity ok, target WAL absent/truncated, former location preserved, no clobber.","where":".opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts","why":"Extends the existing migration race test to the WAL failure mode GLM identified."},{"change":"Emit one structured diagnostic line on every report/respawn/failure path, including no-socket, probe-timeout, foreign-owner, pid-reuse, WAL-locked, and stale-heartbeat outcomes.","where":".opencode/bin/mk-code-index-launcher.cjs:bridgeOrReportLeaseHeld and .opencode/bin/lib/launcher-ipc-bridge.cjs:maybeBridgeLeaseHolder","why":"The incident required manual `ps`/`lsof` forensics; structured reason tokens make CI and operator recovery assertable."}],"verdict":"sound-with-fixes"}
