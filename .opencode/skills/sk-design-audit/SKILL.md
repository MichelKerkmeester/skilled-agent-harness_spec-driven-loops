---
name: sk-design-audit
description: Design QA and critique mode for accessibility, performance, responsive, theming, anti-slop detection, scoring, and production hardening.
allowed-tools: [Read, Grep, Glob, Bash, Task]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-design
---

<!-- Keywords: sk-design-audit, design-audit, accessibility, performance, responsive, theming, critique, polish, hardening, anti-slop, P0-P3, design-quality-score -->

# Design Audit (sk-design-audit)

`sk-design-audit` is the cross-cutting QA and critique MODE child of the `sk-design` family. It reviews built or planned interfaces for accessibility, performance, responsive behavior, theming, anti-patterns, design quality, and production hardening. It reports severity-ranked findings and a 5-dimension `/20` score.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request involves:
- Auditing or critiquing a UI, design plan, component, page, or design-system output.
- Checking accessibility, contrast, keyboard navigation, focus, forms, ARIA, or WCAG compliance.
- Reviewing animation performance, load performance, responsive behavior, touch targets, or production readiness.
- Detecting AI-generated design slop, theming drift, token misuse, hard-coded values, or generic patterns.
- Producing a findings-first design quality report with P0-P3 severity and a `/20` score.

Keyword triggers: `audit design`, `critique UI`, `design review`, `accessibility audit`, `WCAG`, `performance audit`, `hardening`, `polish pass`, `responsive QA`, `anti-slop`, `looks AI-generated`, `quality score`, `P0`, `P1`.

### When NOT to Use

Skip this skill when:
- The user wants to invent a new visual direction. Use `sk-design-interface`.
- The user wants a static token system, palette, typography, or layout plan. Use `sk-design-foundations`.
- The user wants to create motion choreography. Use `sk-design-motion`.
- The user wants implementation after findings are accepted. Hand off to `sk-code`.
- The user asks for a code review outside design/UI concerns. Use `sk-code-review`.

### Family Boundary

This is an independently invokable member of the `sk-design` family. It owns review, scoring, severity, risk surfacing, and hardening. It may cite sibling standards but does not replace them.

Pairs well with:
- `sk-design-interface` after a direction or build needs critique.
- `sk-design-foundations` when token/theming/layout findings need a system fix.
- `sk-design-motion` when motion-performance findings need choreography repair.
- `sk-code-review` when the UI change also needs code correctness/security review.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route by audit mode:

```text
DESIGN QA TASK
    |
    +- Full audit / score / release readiness -> references/audit_contract.md
    +- A11y or motion/load perf -> references/accessibility_performance.md
    +- Critique / cognitive load / persona / polish -> references/critique_hardening.md
    +- Edge cases / copy / pseudo-elements / production -> references/anti_patterns_production.md
```

### Phase Detection

```text
DESIGN QA TASK
    |
    +- STEP 0: Detect audit mode (contract / a11y-perf / critique-harden / anti-pattern)
    +- STEP 1: Score intents (top-2 when scores are close)
    +- Phase 1: Resolve target and state evidence available vs missing
    +- Phase 2: Findings + five-dimension scoring
    +- Phase 3: Owner mapping and verification
```

### Resource Domains

- `references/audit_contract.md` defines the P0-P3 severity model, 5-dimension `/20` scoring contract, output format, and evidence rules.
- `references/accessibility_performance.md` covers accessible names, keyboard, focus, semantics, forms, announcements, contrast, motion performance, Core Web Vitals, and measurement.
- `references/critique_hardening.md` covers critique workflow, cognitive load, Nielsen heuristics, personas, polish, edge cases, i18n, error states, and resilience.
- `references/anti_patterns_production.md` covers slop detection, theming drift, token misuse, pseudo-elements, View Transitions, copy clarity, and production hardening.
- `references/corpus_map.md` maps the source corpus.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any audit or critique | `references/corpus_map.md`, `references/audit_contract.md` |
| CONDITIONAL | Accessibility or performance concern | `references/accessibility_performance.md` |
| CONDITIONAL | Holistic critique, UX score, persona, polish, hardening | `references/critique_hardening.md` |
| CONDITIONAL | Slop, theming, pseudo-elements, copy clarity, production details | `references/anti_patterns_production.md` |
| ON_DEMAND | Code correctness beyond UI quality | `sk-code-review` plus `sk-code` surface evidence |

### Smart Router Pseudocode

#### Smart Router (Resilience Pattern)

> Pattern: see [sk-doc smart-router resilience template](../sk-doc/assets/skill/skill_smart_router.md) for the full runtime discovery, guarded load, routing-key, and fallback reference.

The router fills in this skill's a11y/perf/critique/harden `INTENT_MODEL`, `RESOURCE_MAP`, loading levels, and routing key while keeping the resilience mechanics unchanged: discover resources at runtime, guard every path before loading, derive a routing key from the audit mode or task, and return an `UNKNOWN_FALLBACK` checklist when confidence is too low.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, checks `inventory`, and suppresses repeats with `seen`.
- Pattern 3: Extensible Routing Key - audit-mode intent labels route to keyed folders without static inventories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests disambiguation and missing keyed families return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/corpus_map.md"

INTENT_MODEL = {
    "AUDIT_CONTRACT": {"keywords": [("audit", 4), ("score", 4), ("release readiness", 4), ("severity", 3), ("p0", 3), ("p1", 3), ("quality score", 3)]},
    "ACCESSIBILITY_PERFORMANCE": {"keywords": [("accessibility", 4), ("wcag", 4), ("aria", 3), ("keyboard", 3), ("focus", 3), ("contrast", 3), ("performance", 4), ("jank", 3), ("core web vitals", 3)]},
    "CRITIQUE_HARDENING": {"keywords": [("critique", 4), ("cognitive", 3), ("heuristic", 3), ("persona", 3), ("polish", 4), ("harden", 4), ("edge case", 3), ("i18n", 3)]},
    "ANTI_PATTERNS_PRODUCTION": {"keywords": [("slop", 4), ("ai-generated", 4), ("theme", 3), ("token", 3), ("pseudo", 3), ("copy", 3), ("clarify", 3), ("view transition", 3)]},
}

RESOURCE_MAP = {
    "AUDIT_CONTRACT": ["references/audit_contract.md"],
    "ACCESSIBILITY_PERFORMANCE": ["references/audit_contract.md", "references/accessibility_performance.md"],
    "CRITIQUE_HARDENING": ["references/audit_contract.md", "references/critique_hardening.md"],
    "ANTI_PATTERNS_PRODUCTION": ["references/audit_contract.md", "references/anti_patterns_production.md"],
}

LOAD_LEVELS = {
    "AUDIT_CONTRACT": "STANDARD",
    "ACCESSIBILITY_PERFORMANCE": "STANDARD",
    "CRITIQUE_HARDENING": "STANDARD",
    "ANTI_PATTERNS_PRODUCTION": "STANDARD",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the audit mode: contract/score, accessibility/performance, critique/hardening, or anti-pattern/production",
    "Confirm the target artifact: file, URL, screenshot, or design plan",
    "Provide one concrete input, rendered observation, or expected output",
    "Confirm whether a full five-dimension score or a focused review is needed",
]

AMBIGUITY_DELTA = 1

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

def get_routing_key(task, intents: list[str]) -> str:
    override = str(getattr(task, "routing_key", "")).strip().lower()
    if override:
        return override
    return (intents[0] if intents else "unknown").lower()

def classify_intents(user_request, task=None):
    text = (user_request or "").lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for keyword, weight in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight

    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("AUDIT_CONTRACT", None, scores)

    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_audit_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    reference_prefix = f"references/{routing_key}/"
    asset_prefix = f"assets/{routing_key}/"
    keyed_refs = sorted(path for path in inventory if path.startswith(reference_prefix))
    keyed_assets = sorted(path for path in inventory if path.startswith(asset_prefix))
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    baseline_count = len(loaded)
    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    for relative_path in keyed_refs:
        load_if_available(relative_path)
    for relative_path in keyed_assets:
        load_if_available(relative_path)

    if routing_key == "unknown" or (len(loaded) == baseline_count and not keyed_refs):
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "notice": f"No keyed knowledge base found for routing key '{routing_key}'",
            "resources": loaded,
        }

    return {"routing_key": routing_key, "intents": intents, "intent_scores": scores, "resources": loaded}
```

---

## 3. HOW IT WORKS

### Audit Workflow

1. Resolve the target: source files, URL, screenshot, design plan, or rendered UI evidence.
2. State evidence available and evidence missing. A visual claim needs visual evidence or a clear caveat.
3. Score the five audit dimensions 0-4 each:
   - Accessibility.
   - Performance.
   - Responsive Design.
   - Theming.
   - Anti-Patterns.
4. Produce a findings-first report ordered by P0, P1, P2, P3.
5. Map each finding to the owning sibling or implementation skill.
6. End with recommended next actions; do not silently implement fixes during a review-only request.

### Severity Model

Use the same findings-first spirit as `sk-code-review`: concrete evidence, severity order, impact, and recommended fix.

| Severity | Meaning | Release effect |
| --- | --- | --- |
| P0 Critical | Prevents task completion, blocks access, creates severe WCAG failure, or makes UI unusable | Must fix immediately |
| P1 High | Significant user difficulty, WCAG AA violation, broken responsive behavior, severe jank, or systemic token drift | Fix before release |
| P2 Medium | Annoyance or quality issue with a workaround, localized performance issue, minor inconsistency | Fix in next pass |
| P3 Polish | Nice-to-fix detail with low user impact | Fix if time permits |

### 5-Dimension Score

Each dimension scores 0-4. Total `/20` rating:
- `18-20` Excellent: minor polish only.
- `14-17` Good: address weak dimensions.
- `10-13` Acceptable: significant work needed.
- `6-9` Poor: major overhaul.
- `0-5` Critical: fundamental issues.

---

## 4. RULES

### ALWAYS

1. Present findings before summary when doing a review or audit.
2. Include evidence for every actionable finding: file/line, rendered behavior, prompt output, screenshot observation, or explicit limitation.
3. Score all five dimensions for full audits; mark a dimension `not assessed` only when evidence is unavailable and explain why.
4. Apply accessibility minimums first: accessible names, keyboard access, focus, semantics, forms, announcements, contrast, and reduced motion.
5. Separate design critique from deterministic findings; both can matter, but label the evidence type.
6. Explain user impact, not just rule violation.
7. Map each fix to the right owner: foundations, motion, interface, spec/extraction, or code implementation.
8. Celebrate positive findings briefly so teams know what to preserve.

### NEVER

1. Never report vague issues without location, impact, and fix.
2. Never claim a design is accessible without keyboard, focus, name, semantics, and contrast evidence.
3. Never treat a clean automated scan as proof of strong design.
4. Never score generously to avoid criticism; a `4` means genuinely excellent.
5. Never bury a P0/P1 under polish comments.
6. Never invent browser, screenshot, or detector evidence.
7. Never recommend a sibling skill when it addresses zero findings.

### ESCALATE IF

1. The target cannot be resolved to a file, URL, screenshot, or concrete design artifact.
2. Visual evidence is required but unavailable and the score would be misleading.
3. Accessibility or performance findings imply high-impact implementation changes outside design scope.
4. Brand or legal constraints conflict with accessibility or production hardening.

---

## 5. REFERENCES

### Core References

- [`references/audit_contract.md`](references/audit_contract.md) - Severity, `/20` score, findings schema, and audit output contract.
- [`references/accessibility_performance.md`](references/accessibility_performance.md) - Accessibility and performance checks.
- [`references/critique_hardening.md`](references/critique_hardening.md) - Holistic critique, cognitive load, personas, polish, and hardening.
- [`references/anti_patterns_production.md`](references/anti_patterns_production.md) - Anti-slop, theming, pseudo-elements, copy clarity, and production details.
- [`references/corpus_map.md`](references/corpus_map.md) - Source traceability for the distilled corpus.

### Parent Shared Base

Use, do not duplicate, the parent references for shared vocabulary:
- `../sk-design/references/anti_slop_principles.md`
- `../sk-design/references/design_token_vocabulary.md`
- `../sk-design/references/cognitive_laws.md`

---

## 6. SUCCESS CRITERIA

- Audit output is findings-first, severity-ordered, and evidence-backed.
- Full audits include the five-dimension `/20` score or explicit caveats for unassessed dimensions.
- Accessibility, performance, responsive, theming, and anti-patterns are all considered.
- Findings map to concrete next actions and owning skills.
- No positive completion or release-readiness claim is made from missing evidence.

---

## 7. INTEGRATION POINTS

- `sk-design` routes audit, critique, and hardening prompts here.
- `sk-design-interface` owns direction changes recommended by critique.
- `sk-design-foundations` owns color, type, layout, responsive, and theming fixes.
- `sk-design-motion` owns motion choreography fixes.
- `sk-code` implements accepted fixes.
- `sk-code-review` handles broader code correctness, security, and test-quality review.

---

## 8. REFERENCES AND RELATED RESOURCES

Feature inventory lives in `feature_catalog/feature_catalog.md`. Manual validation scenarios live in `manual_testing_playbook/manual_testing_playbook.md`. The initial release notes are in `changelog/v1.0.0.0.md`.
