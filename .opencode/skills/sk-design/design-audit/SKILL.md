---
name: design-audit
description: Design QA and critique mode for accessibility, performance, responsive, theming, anti-slop detection, scoring, and production hardening.
allowed-tools: [Read, Grep, Glob]
version: 1.0.0.2
metadata:
  author: OpenCode
  family: sk-design
---

<!-- Keywords: audit, design-audit, accessibility, performance, responsive, theming, critique, polish, hardening, anti-slop, P0-P3, design-quality-score -->

# Design Audit (audit)

`audit` is the cross-cutting QA and critique MODE child of the `sk-design` family. It reviews built or planned interfaces for accessibility, performance, responsive behavior, theming, anti-patterns, design quality, and production hardening. It reports severity-ranked findings and a 5-dimension `/20` score.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request involves:
- Auditing or critiquing a UI, design plan, component, page, or design-system output.
- Checking accessibility, contrast, keyboard navigation, focus, forms, ARIA, or WCAG compliance.
- Reviewing animation performance, load performance, responsive behavior, touch targets, or production readiness.
- Detecting AI-generated design slop, theming drift, token misuse, hard-coded values, or generic patterns, including the model-specific tell catalog for OpenCode, Gemini and 2026-general fingerprints.
- Routing a bolder, quieter, distill or redesign direction to the right owner once a finding names the problem.
- Producing a findings-first design quality report with P0-P3 severity and a `/20` score, including the fill-in report template.

Keyword triggers: `audit design`, `critique UI`, `design review`, `review the UI`, `accessibility audit`, `WCAG`, `WCAG contrast`, `performance audit`, `hardening`, `polish pass`, `responsive QA`, `anti-slop`, `looks AI-generated`, `AI tell`, `should it be bolder`, `should it be quieter`, `should it be clearer`, `distill`, `quality score`, `P0`, `P1`.

### When NOT to Use

Skip this skill when:
- The user wants to invent a new visual direction. Use `interface`.
- The user wants a static token system, palette, typography, or layout plan. Use `foundations`.
- The user wants to create motion choreography. Use `motion`.
- The user wants implementation after findings are accepted. Hand off to `sk-code`.
- The user asks for a code review outside design/UI concerns. Use `sk-code`'s code-review mode.

### Family Boundary

This is an independently invokable member of the `sk-design` family. It owns review, scoring, severity, risk surfacing, and hardening. It may cite sibling standards but does not replace them.

Pairs well with:
- `interface` after a direction or build needs critique.
- `foundations` when token/theming/layout findings need a system fix.
- `motion` when motion-performance findings need choreography repair.
- `sk-code`'s code-review mode when the UI change also needs code correctness/security review.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route by audit mode:

Route here when the request is evaluative: audit, review, critique, release readiness, accessibility, WCAG contrast, quality score, AI-template risk, production hardening, or a "should it be ..." transform question. Make-frame prompts such as "make it bolder" or "make this less generic" route to `interface`; static fixes named by findings route to `foundations` or `motion` only after audit maps owners. `polish` routes here when it means a review or release gate, and to a sibling only when the user already names the fix owner.

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
- `assets/ai_fingerprint_registry.json` mirrors the model-specific tell catalog as one machine-checkable row per tell.
- `assets/ai_fingerprint_self_defect_card.md` carries one self-audit prompt per registry row.
- `../shared/scripts/ai-fingerprint-registry-check.mjs` validates catalog-to-registry parity and fixture-id shape before registry changes ship.
- `references/corpus_map.md` maps the source corpus.
- `../shared/sk_code_handoff.md` defines the accepted-finding backlog handoff to `sk-code`.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any audit or critique | `references/corpus_map.md`, `references/audit_contract.md` |
| ALWAYS | Set the audit-severity posture | `../shared/register.md` (the audit-severity dial weights findings by Brand-vs-Product posture) |
| ALWAYS | Any audit or design-readiness task | `../shared/context_loading_contract.md` (register-first gate, context manifest, the four proof fields incl. audit evidence, and the hard gates that block release/accessibility claims) |
| CONDITIONAL | Accessibility or performance concern | `references/accessibility_performance.md` |
| CONDITIONAL | Holistic critique, UX score, persona, polish, hardening | `references/critique_hardening.md` |
| CONDITIONAL | Slop, theming, pseudo-elements, copy clarity, production details | `references/anti_patterns_production.md` |
| CONDITIONAL | Detecting model-specific AI tells | `references/ai_fingerprint_tells.md`, `assets/ai_fingerprint_registry.json`, `assets/ai_fingerprint_self_defect_card.md` (OpenCode, Gemini, 2026-general fingerprints as checkable findings with structured rows and self-defect prompts) |
| CONDITIONAL | Routing a bolder, quieter or simpler request | `references/transform_remediation.md` (register-gated transform verbs mapped to findings and owners) |
| CONDITIONAL | Resolving the target and labeling evidence | `references/evidence_capture.md` (target resolution, browser and deterministic evidence, fallback labels) |
| CONDITIONAL | Carrying confirmed, inferred and not-assessed labels into findings and scores | `assets/audit_evidence_worksheet.md` (target, evidence inventory, dimension coverage, probes and finding handoff rows) |
| CONDITIONAL | Calibrating the Anti-Patterns dimension | `assets/anti_patterns_score_rubric.md` (0 to 4 ladder for model tells and generic design risk) |
| CONDITIONAL | Production-readiness and edge-case probes | `references/hardening_edge_cases.md` (extreme inputs, errors, permissions, concurrency, i18n and RTL, text expansion, CJK and emoji) |
| CONDITIONAL | Producing the audit report | `assets/audit_report_template.md` (fill-in 5-dimension score plus P0-P3 findings) |
| CONDITIONAL | Citing the snippet-level accessibility fix | `assets/a11y_quick_fixes.md` (accessible names, keyboard, focus, semantics, forms, announcements, contrast, motion) |
| CONDITIONAL | Routing accepted findings to sk-code | `../shared/sk_code_handoff.md` (backlog handoff card, routes only and applies nothing) |
| CONDITIONAL | Internal procedure support | `procedures/accessibility_audit.md`, `procedures/ai_slop_check.md`, and `../shared/procedures/polish_gate_orchestration.md` when the trigger matches |
| ON_DEMAND | Code correctness beyond UI quality | `sk-code` code-review mode (findings-first baseline + router-selected surface evidence) |

The private procedure-card selection table in Section 3 is part of this routing contract: after the public `audit` mode is selected, choose at most one card from `procedures/` or `../shared/procedures/` and cite its relative path in the plan or proof line.

### Smart Router Pseudocode

#### Smart Router (Resilience Pattern)

> Pattern: see [sk-doc smart-router resilience template](../../sk-doc/create-skill/assets/skill/skill_smart_router.md) for the full runtime discovery, guarded load, routing-key, and fallback reference.

The router fills in this skill's a11y/perf/critique/harden `INTENT_SIGNALS`, `RESOURCE_MAP`, loading levels, and routing key while keeping the resilience mechanics unchanged: discover resources at runtime, guard every path before loading, derive a routing key from the audit mode or task, and return an `UNKNOWN_FALLBACK` checklist when confidence is too low.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, checks `inventory`, and suppresses repeats with `seen`.
- Pattern 3: Extensible Routing Key - audit-mode intent labels route to keyed folders without static inventories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests disambiguation and missing keyed families return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = ["references/corpus_map.md", "../shared/register.md", "../shared/context_loading_contract.md"]

INTENT_SIGNALS = {
    "AUDIT_CONTRACT": {"weight": 4, "keywords": ["audit", "score", "release readiness", "severity", "p0", "p1", "quality score", "report template"]},
    "ACCESSIBILITY_PERFORMANCE": {"weight": 4, "keywords": ["accessibility", "wcag", "aria", "keyboard", "focus", "contrast", "performance", "jank", "core web vitals", "a11y fix"]},
    "CRITIQUE_HARDENING": {"weight": 4, "keywords": ["critique", "cognitive", "heuristic", "persona", "polish", "harden", "edge case", "i18n", "production readiness"]},
    "ANTI_PATTERNS_PRODUCTION": {"weight": 4, "keywords": ["slop", "ai-generated", "theme", "token", "pseudo", "copy", "clarify", "view transition", "fingerprint", "model tell", "anti-patterns score", "anti patterns score", "score calibration"]},
    "TRANSFORM_REMEDIATION": {"weight": 4, "keywords": ["bolder", "quieter", "distill", "redesign", "transform", "remediation", "make it bolder"]},
    "EVIDENCE_CAPTURE": {"weight": 3, "keywords": ["evidence", "screenshot", "browser", "deterministic scan", "source target", "provenance"]},
}

RESOURCE_MAP = {
    "AUDIT_CONTRACT": ["references/corpus_map.md", "references/audit_contract.md", "assets/audit_report_template.md", "../shared/sk_code_handoff.md"],
    "ACCESSIBILITY_PERFORMANCE": ["references/accessibility_performance.md", "assets/a11y_quick_fixes.md"],
    "CRITIQUE_HARDENING": ["references/critique_hardening.md", "references/hardening_edge_cases.md"],
    "ANTI_PATTERNS_PRODUCTION": ["references/anti_patterns_production.md", "references/ai_fingerprint_tells.md", "assets/ai_fingerprint_registry.json", "assets/ai_fingerprint_self_defect_card.md", "assets/anti_patterns_score_rubric.md"],
    "TRANSFORM_REMEDIATION": ["references/transform_remediation.md"],
    "EVIDENCE_CAPTURE": ["references/evidence_capture.md", "assets/audit_evidence_worksheet.md"],
}

LOAD_LEVELS = {
    "AUDIT_CONTRACT": "STANDARD",
    "ACCESSIBILITY_PERFORMANCE": "STANDARD",
    "CRITIQUE_HARDENING": "STANDARD",
    "ANTI_PATTERNS_PRODUCTION": "STANDARD",
    "TRANSFORM_REMEDIATION": "STANDARD",
    "EVIDENCE_CAPTURE": "STANDARD",
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
    shared_root = (SKILL_ROOT.parent / "shared").resolve()
    # The sibling shared/ dir holds family docs like the operating register, a
    # sanctioned cross-packet location. Every other parent path is rejected.
    if not (resolved.is_relative_to(SKILL_ROOT) or resolved.is_relative_to(shared_root)):
        raise ValueError(f"Resource escapes the skill root: {relative_path}")
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return relative_path if resolved.is_relative_to(shared_root) else resolved.relative_to(SKILL_ROOT).as_posix()

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
    scores = {intent: 0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        weight = cfg["weight"]
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += weight

    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
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
        available = guarded in inventory or (SKILL_ROOT / guarded).resolve().exists()
        if available and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for default_path in DEFAULT_RESOURCE:
        load_if_available(default_path)
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

1. Resolve the target and the register: source files, URL, screenshot, design plan or rendered UI evidence, then read `../shared/register.md` so the audit-severity dial weights findings by Brand-vs-Product posture. `references/evidence_capture.md` owns target resolution.
   **Ready-claim gate:** before any ready, release, or accessibility claim, complete the five-dimension score with evidence labels (`confirmed`, `inferred`, `not-assessed`) per `references/audit_contract.md`; reuse `assets/audit_evidence_worksheet.md` to carry those labels into findings and scores.
2. State evidence available and evidence missing. A visual claim needs visual evidence or a clear caveat. A finding read from real evidence is confirmed, while a finding from a screenshot alone is inferred.
3. Score the five audit dimensions 0-4 each:
   - Accessibility.
   - Performance.
   - Responsive Design.
   - Theming.
   - Anti-Patterns. Detect model-specific tells with `references/ai_fingerprint_tells.md` and probe production readiness with `references/hardening_edge_cases.md`.
4. Produce a findings-first report ordered by P0, P1, P2, P3. Use `assets/audit_report_template.md` for the fill-in skeleton.
5. Map each finding to the owning sibling or implementation skill. Route a bolder, quieter, distill or redesign direction through `references/transform_remediation.md` first, because the correct direction depends on the register.
6. End with recommended next actions; do not silently implement fixes during a review-only request.

### Procedure Card Selection

After the hub selects the public `audit` mode, choose at most one primary private procedure card and cite it by relative path in the plan or proof line. These cards support audit focus; they are not public routes.

| Request shape | Procedure card | Proof to cite |
| --- | --- | --- |
| Accessibility, WCAG, inclusive design, contrast, keyboard, focus, form, or release-readiness review | `procedures/accessibility_audit.md` | Coverage of contrast/color, semantics, keyboard/focus, motion/forms/miscellaneous, evidence labels, and unresolved confirmation needs. |
| AI-template risk, generic visual language, over-decoration, slop, or model-tell review | `procedures/ai_slop_check.md` | Detected pattern, evidence location or artifact, severity, owner, and concrete fix direction. |
| Full pre-delivery polish spanning multiple design dimensions | `../shared/procedures/polish_gate_orchestration.md` | Consolidated blockers, quality issues, polish notes, and owner mapping. |

If no procedure card matches, state `Procedure applied: none - baseline audit workflow` and continue with the audit contract, five-dimension score, and findings-first report. Do not load every procedure card for a single request.

### Context, Proof, And Direct Fallback

Record the context basis before findings: public mode `audit`, loaded references, selected procedure card or no-procedure fallback, target artifact, available evidence, missing evidence, audit bar, and whether the score is full or focused. Before a ready, release, or accessibility claim, include proof naming the selected procedure card, evidence labels, dimensions covered, and what remains not assessed.

This mode must run directly with Read, Glob, and Grep only. If subagents are unavailable or disallowed, do not dispatch; execute the same procedure selection, context capture, and proof checks in the current session. The fallback keeps the same proof bar and cannot rely on Write, Edit, Bash, or Task.

### Backlog Handoff To sk-code

When accepted findings move to implementation, emit the shared handoff envelope from `../shared/sk_code_handoff.md` as a backlog card. Each finding includes id, severity, owner, target, evidence label, one-line fix shape and verification. An audit with zero accepted findings emits an empty valid backlog. The audit never applies fixes, edits files or grants write authority.

### Severity Model

Use the same findings-first spirit as `sk-code`'s code-review mode: concrete evidence, severity order, impact, and recommended fix.

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
9. Cite the selected procedure card or no-procedure fallback before substantial audit output when a private procedure trigger matches.

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
- [`references/ai_fingerprint_tells.md`](references/ai_fingerprint_tells.md) - Model-specific AI tells turned into checkable P0-P3 findings.
- [`references/transform_remediation.md`](references/transform_remediation.md) - Register-gated directional verbs mapped to findings and owners.
- [`references/evidence_capture.md`](references/evidence_capture.md) - Target resolution, browser and deterministic evidence, screenshot and overlay notes, fallback labels.
- [`references/hardening_edge_cases.md`](references/hardening_edge_cases.md) - Production-readiness matrix of extreme inputs, errors, permissions, concurrency, i18n and RTL, text expansion, CJK and emoji.
- [`references/corpus_map.md`](references/corpus_map.md) - Source traceability for the distilled corpus.
- [`../shared/sk_code_handoff.md`](../shared/sk_code_handoff.md) - Shared sk-code handoff envelope. Audit uses it for accepted-finding backlog handoff without applying fixes.
- [`procedures/accessibility_audit.md`](procedures/accessibility_audit.md) - Private support for accessibility-focused audit passes.
- [`procedures/ai_slop_check.md`](procedures/ai_slop_check.md) - Private support for AI-template and generic-design risk review.
- [`../shared/procedures/polish_gate_orchestration.md`](../shared/procedures/polish_gate_orchestration.md) - Shared private final-polish orchestration when audit owns the review verdict.

### Assets

- [`assets/audit_report_template.md`](assets/audit_report_template.md) - Fill-in findings-first report with the five-dimension `/20` score, anti-pattern verdict, owner mapping, and evidence caveats.
- [`assets/a11y_quick_fixes.md`](assets/a11y_quick_fixes.md) - Snippet-level accessibility fixes the report cites by reference; the audit names the fix, `sk-code` applies it.
- [`assets/audit_evidence_worksheet.md`](assets/audit_evidence_worksheet.md) - Fill-in worksheet that carries confirmed, inferred and not-assessed labels into findings and scores.
- [`assets/anti_patterns_score_rubric.md`](assets/anti_patterns_score_rubric.md) - Anti-Patterns 0 to 4 calibration ladder for full audits.

### Parent Shared Base

Use, do not duplicate, the parent references for shared vocabulary:
- [`../shared/register.md`](../shared/register.md) - The Brand-vs-Product register that sets the audit-severity dial; outside this mode's scope, so cited explicitly.
- `../shared/anti_slop_principles.md`
- `../shared/design_token_vocabulary.md`
- `../shared/cognitive_laws.md`

---

## 6. SUCCESS CRITERIA

- Audit output is findings-first, severity-ordered and evidence-backed, with each finding labeled confirmed or inferred.
- The register is resolved before scoring so the audit-severity dial weights findings by Brand-vs-Product posture.
- Full audits include the five-dimension `/20` score or explicit caveats for unassessed dimensions. The fill-in report template carries the structure when a full report is requested.
- Accessibility, performance, responsive, theming and anti-patterns are all considered, with model-specific tells and production-readiness edge cases checked where they apply.
- Findings map to concrete next actions and owning skills, with directional remediation routed by register.
- No positive completion or release-readiness claim is made from missing evidence.
- Accepted findings route through a backlog handoff card and preserve the audit-never-fixes boundary.
- The selected private procedure card is cited by relative path, or the no-procedure fallback is explicitly stated.
- Direct execution with Read, Glob, and Grep can produce the same context/proof result without subagent dispatch.

---

## 7. INTEGRATION POINTS

- `sk-design` routes audit, critique, and hardening prompts here.
- `interface` owns direction changes recommended by critique.
- `foundations` owns color, type, layout, responsive, and theming fixes.
- `motion` owns motion choreography fixes.
- `sk-code` implements accepted fixes.
- `sk-code`'s code-review mode handles broader code correctness, security, and test-quality review.

---

## 8. REFERENCES AND RELATED RESOURCES

Manual validation scenarios live in `manual_testing_playbook/manual_testing_playbook.md`. Release notes live in `changelog/`; the latest is `changelog/v1.0.0.0.md`.
