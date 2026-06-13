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
import re
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
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in DEFAULT_RESOURCES:
        load_if_available(relative_path)

    if sum(scores.values()) < 0.5:
        return {
            "intents": ["QUALITY"],
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "surface_evidence": detect_surface_evidence(task, workspace_files, changed_files),
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    if any(keyword_present(keyword, text) for keyword in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    surface_evidence = detect_surface_evidence(task, workspace_files, changed_files)

    precedence = {
        "baseline_minimums": ["security", "correctness"],
        "surface_overrides": ["style", "build", "test_commands", "surface_process"],
        "on_conflict": "escalate",
    }

    return {
        "intents": intents,
        "scores": scores,
        "surface_evidence": surface_evidence,
        "precedence": precedence,
        "resources": loaded,
    }
```

---

## 3. HOW IT WORKS

### Phase 1: Scope and Baseline

1. Inspect the review target (`git diff`, staged diff, file list, or commit range).
2. For local diffs, optionally run `detect_changes` with the unified diff to identify affected symbols/files and readiness before narrowing evidence.
3. If `detect_changes` returns blocked or unavailable, surface "structural-impact analysis unavailable" as a caveat and continue the plain git-diff review; never block the review on structural-impact availability.
4. Load baseline standards from this skill (`sk-code-review`).
5. Load `sk-code` surface standards evidence when a surface is detected.

### Phase 2: Surface Alignment

1. Load standards from `sk-code` for the detected surface only.
2. Apply precedence matrix:
   - Baseline security/correctness minimums always apply.
   - Surface style/process/verification conventions win on conflicts.
3. If precedence cannot be resolved deterministically, escalate before scoring.

### Phase 3: Findings-First Analysis

1. Analyze for security and correctness first.
2. Analyze quality/performance, test adequacy, contract safety, and architecture concerns.
3. Analyze KISS/DRY and SOLID violations (SRP/OCP/LSP/ISP/DIP) with evidence.
4. Analyze removal opportunities with safe-now vs deferred classification.
5. Produce findings ordered by severity (`P0`, `P1`, `P2`).
6. For every actionable finding, classify fix scope as `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. If unknown, default to class/cross-consumer until a producer/consumer inventory proves instance-only.

#### Numeric Severity Calibration

Use numeric calibration only as reviewer context, never as the gate. A finding may include an optional advisory `riskScore` to communicate relative risk, and reviewers may adjust that score by `+/-2` for local context such as exploitability, blast radius, user impact, confidence, or proven containment. The blocking decision still comes only from the `P0`/`P1`/`P2` severity contract. Do not introduce `score>=4` or any other numeric threshold as a blocker.

#### Instance-Only Opt-Out

A finding may use the narrow fix path only when all are true:

- It is not P0/P1 security, path, auth/authz, sandboxing, env precedence, schema, persistence, or public-response behavior.
- `rg` proves no same-class producer or consumer.
- Verification is local and cheap: one focused test, one doc row, or one static audit command.
- The fix response includes the exact command evidence for the opt-out.

Otherwise, run the full fix completeness checklist.

### Phase 4: Output and Next Action

Required output contract:

```markdown
## Code Review Summary

**Files reviewed**: X files, Y lines changed
**Overall assessment**: [APPROVE / REQUEST_CHANGES / COMMENT]
**Baseline used**: [sk-code (`sk-code-review`)]
**Surface evidence used**: [sk-code:<surface>]

## Findings

### P0 - Critical
1. [path:line] Title
   - Risk
   - User impact
   - Finding class: [instance-only | class-of-bug | cross-consumer | algorithmic | matrix/evidence | test-isolation]
   - Scope proof: [grep/test evidence proving class coverage or instance-only status]
   - affectedSurfaceHints: [optional string array of short producer/consumer surface names; recommended for actionable findings, required for cross-consumer findings]
   - riskScore: [optional advisory number only; never gating]
   - Recommended fix

### P1 - High
...

## Removal/Iteration Plan

## Next Steps
```

After reporting findings, request explicit next action before any implementation follow-up.

### Final-line exact-string contract (MANDATORY)

Every review MUST end with exactly one of the following plain-text lines as the **absolute final line** of the output (no trailing whitespace, no variation):

```
Review status: APPROVED
```

```
Review status: REQUESTED_CHANGES
```

```
Review status: COMMENTED
```

**Example output bottom:**

```
...
## Next Steps
1. Fix the null-deref at src/foo.ts:42
2. Add input validation for the `/api/bar` endpoint

Review status: REQUESTED_CHANGES
```

Downstream automation parses this final line via exact string match — do not vary the format, add trailing punctuation, or wrap in Markdown formatting. The sole exception is the documented M-1 / M-2 skip output (§9): those lines begin with the exact `Review status: COMMENTED` and append a parenthetical reason, so a leading-verdict (grep / `startsWith`) parse still yields `COMMENTED`. A normal review must still end with one of the three exact lines above.

---

## 4. RULES

### ✅ ALWAYS

- Keep findings first; summaries follow findings.
- Enforce baseline security/correctness minimums regardless of surface.
- Include file:line evidence for actionable findings.
- State assumptions when evidence is incomplete.
- Identify `sk-code` surface evidence used for standards alignment.

### ❌ NEVER

- Override surface-specific conventions with generic baseline style preferences.
- Approve code with unaddressed P0 security/correctness defects.
- Produce vague findings without concrete evidence.
- Mix unrelated cleanup into targeted fix recommendations.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.

### ⚠️ ESCALATE IF

- Surface detection is ambiguous and affects standards or verification commands.
- Baseline and surface guidance conflict in a non-deterministic way.
- Large diff size prevents reliable severity assignment without narrowed scope.
- Requested remediation exceeds review scope and becomes architecture redesign.

---

## 5. REFERENCES

### Core References

- [review_core.md](./references/review_core.md) - Shared review doctrine: severity model, evidence rules, precedence, and finding schema.
- [review_ux_single_pass.md](./references/review_ux_single_pass.md) - Interactive single-pass review flow, presentation modes, and PR/pre-commit behavior.
- [quick_reference.md](./references/quick_reference.md) - Lightweight index for routing between shared doctrine and single-pass UX guidance.
- [security_checklist.md](./references/security_checklist.md) - Mandatory security and reliability checks.
- [code_quality_checklist.md](./references/code_quality_checklist.md) - Correctness, performance, KISS, and DRY checks.
- [solid_checklist.md](./references/solid_checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture assessment prompts.
- [removal_plan.md](./references/removal_plan.md) - Safe-now vs deferred removal planning template.
- [test_quality_checklist.md](./references/test_quality_checklist.md) - Test quality, coverage, and anti-pattern detection.

### Reference Loading Notes

- Load only the references needed for the selected intents.
- Keep Section 2 (`SMART ROUTING`) as the authoritative routing source.

---

## 6. SUCCESS CRITERIA

- Review output is findings-first and severity-ordered.
- `sk-code-review` baseline + `sk-code` surface evidence contract is explicit in report context.
- Security/correctness minimums are always covered.
- Recommended fixes are actionable and scope-proportional.

---

## 7. INTEGRATION POINTS

- Primary review baseline for `@review` agents in `.opencode/agents/review.md`.
- Referenced by review-dispatch steps in `spec_kit` and `create` command YAML workflows.
- Complements, but does not replace, `sk-code` surface-specific standards evidence.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/quick_reference.md`, `references/review_core.md`, `references/code_quality_checklist.md`, `references/fix-completeness-checklist.md`, `references/removal_plan.md`, `references/review_ux_single_pass.md`, `references/security_checklist.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

### Manual Testing Playbook

Manual testing scenarios for this skill live in `manual_testing_playbook/manual_testing_playbook.md` (root index) plus 18 per-feature sub-files under `manual_testing_playbook/<NN>--<topic>/<NNN>-<scenario>.md`. Run scenarios via `bash .opencode/skills/sk-doc/scripts/validate_document.py manual_testing_playbook/manual_testing_playbook.md` for structural validation; execute scenarios in opencode/Claude/Codex sessions for behavioral verification.

---

## 9. PR-STATE EFFICIENCY GATES (Packet 110)

### 9.1 M-1: PR-State Content-Hash Dedup

Prevents redundant re-reviews when a PR has not changed since the last review.

**Signature computation:**
```
diff_content_hash = sha256(git diff <base-ref>...HEAD)
signature         = sha256(commit_subject + "\u001f" + diff_content_hash)
```
Where `commit_subject` is the first line of `git log <base-ref>...HEAD --format=%s` (latest commit subject).

**Cache storage:**
- Path: `.opencode/.sk-code-review-cache/<repo-ref>.jsonl`
- `<repo-ref>` is computed as `sha256(git remote get-url origin).slice(0, 12)`
- Each line is a JSON object: `{"signature": "<sha256-hex>", "timestamp": "<ISO-8601>", "prev_sha": "<commit-sha>"}`
- Retention: keep last **100 entries** per repo-ref, prune older entries on write

**Skip behavior:**
When the current signature matches a prior cache entry, the review emits:
```
Review status: COMMENTED (no changes since last review at <prev_sha>)
```
No full review analysis runs. Automation may treat `COMMENTED` as a pass (no new findings).

**Cache write:** After each full review completes, write the current signature + timestamp + HEAD SHA to the cache file.

### 9.2 M-2: Opt-In Minimum Evidence Gate

Skips full review for trivially small diffs to save compute, with a conservative taxonomy that **never skips** high-risk changes.

**Enable gate:**
```bash
export SK_CODE_REVIEW_MIN_CHANGED_LINES=50  # >0 enables; default 0 = disabled
```

**Changed-line counting command:**
```bash
git diff --numstat <base-ref>...HEAD | awk '{added+=$1; removed+=$2} END {print added+removed}'
```

**Conservative skip taxonomy — NEVER skip when diff touches:**

| Risk Class | Path/File Patterns | Rationale |
|---|---|---|
| Security / Authentication / Authorization | `auth*`, `*-auth-*`, `*permission*`, `*credential*`, `*token*`, `*secret*`, `*oauth*`, `*sso*`, `*login*`, `*session*` | Compromised auth defeats everything |
| Config files | `*.config.*`, `*config*.json`, `*config*.yaml`, `*config*.toml`, `*.env*`, `*.ini`, `*.cfg` | One-line config change can break production |
| Persistence | `*.sql`, `*migration*`, `*schema*`, `*db*.ts`, `*repository*`, paths under `/db/` or `/migrations/` | Schema changes risk data loss |
| Dependency manifests | `package.json`, `package-lock.json`, `Cargo.toml`, `Cargo.lock`, `pyproject.toml`, `poetry.lock`, `requirements.txt`, `*.lock`, `Gemfile`, `Gemfile.lock` | Transitive dependency changes are high-risk |
| Sandboxing / Subprocess | `*sandbox*`, `*subprocess*`, `*exec*`, `*spawn*`, `*eval*` | Arbitrary code execution boundaries |
| Public-facing responses | `*.handler.ts`, `*-api*`, `*-route*`, `*-controller*`, paths under `/handlers/`, `/routes/`, `/api/` | User-visible behavior changes |

**Skip behavior:**
When `SK_CODE_REVIEW_MIN_CHANGED_LINES > 0`, total changed lines < threshold, AND no sensitive paths are touched:
```
Review status: COMMENTED (skipped: diff below evidence threshold of N lines, no sensitive paths touched)
```
If sensitive paths ARE touched, the full review runs regardless of line count.

**Gate is ALWAYS opt-in.** Without `SK_CODE_REVIEW_MIN_CHANGED_LINES` set, M-2 has zero effect — all diffs receive full reviews.

### 9.3 SK_CODE_REVIEW_DEPTH (opt-in depth alias)

`SK_CODE_REVIEW_DEPTH=lite|full|ultra` is an optional environment variable the **reviewing agent honors** (resolved env > config > default) — exactly like the §9.2 `SK_CODE_REVIEW_MIN_CHANGED_LINES` gate. Both are skill guidance the reviewer reads and applies in-loop, not a separate compiled dispatcher; this alias only NAMES and PERSISTS an already-existing routing behavior, adds no new tier, and relaxes no floor:

- `full` (default / unset): the normal ALWAYS + CONDITIONAL + ON_DEMAND routing.
- `ultra`: bias intent selection toward the existing `ON_DEMAND` reference set (the deep-dive tier) for the session, so a reviewer does not have to repeat "comprehensive / full review" each time.
- `lite`: maps to the existing M-2 conservative skip (§9.2) — it NEVER lowers the ALWAYS tier, the baseline security/correctness minimums, or the P0/P1/P2 contract. It cannot skip a review on a sensitive path (auth/config/persistence/deps/sandbox/public-response), exactly as M-2 already enforces.

The depth alias is advisory routing only; it must never be read as permission to relax a floor.

---

## 10. REFERENCES: EFFICIENCY GATES

- [pr_state_dedup.md](./references/pr_state_dedup.md) — Detailed M-1 signature scheme, cache format, and retention rules.

Related skills: `sk-doc` for skill authoring and packaging standards, `sk-code` for surface-aware standards, and `system-spec-kit` for packet-governed review workflows.
