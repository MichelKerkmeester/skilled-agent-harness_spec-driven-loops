---
title: sk-code Surface Router — routing logic and resource maps
description: First-class surface router document at the sk-code hub root (ROUTER.md). hub-router.json selects the workflow mode; this doc maps a request's code intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs. Relocated from shared/references/smart-routing.md (v3.5.0.8) as the ROUTER.md consolidation pattern, with the approved sk-code shared-control delta (router self-reference removed, ten hub-shared paths normalized to shared/..., mapped shared controls declared).
trigger_phrases:
  - "sk-code smart routing"
  - "surface resource maps"
  - "intent classification routing"
  - "load tier resource loading"
  - "unknown surface fallback"
importance_tier: important
contextType: general
version: 2.3.9.0
router_state: active
skill_pointer: SKILL.md
---
# sk-code Surface Router — routing logic and resource maps

Leaf-set authority for sk-code. The routing authority is named once in `SKILL.md` §2 SMART ROUTING: `hub-router.json` is the mode vocabulary, and this document is the leaf-set router. Consolidates intent classification + resource loading into the single Barter-style smart-routing entry point. Detection logic lives in [`stack-detection.md`](../../../.skilled/skills/sk-code/shared/references/stack-detection.md); phase lifecycle lives in [`phase-detection.md`](../../../.skilled/skills/sk-code/shared/references/phase-detection.md).

---

## 1. OVERVIEW

### Purpose

The smart router maps a detected surface (a declared specific surface, then the SKILLED fallback, then UNKNOWN) plus a classified intent (IMPLEMENTATION / DEBUGGING / VERIFICATION / etc.) to the exact references, assets, and verification commands needed for the active task. Loads only the smallest relevant set so the active context window stays focused.

### When to Use

- After surface detection (see [`stack-detection.md`](../../../.skilled/skills/sk-code/shared/references/stack-detection.md)) determines the surface: a declared specific surface, then the SKILLED fallback, then UNKNOWN
- When classifying task wording into the dominant work intent
- When mapping intent to concrete reference paths
- When picking verification commands for the surface

### Core Principle

Routing is a two-stage decision: **surface-first, intent-second**. Surface narrows the resource family: a declared specific surface first, then the SKILLED fallback, then UNKNOWN. Intent narrows the specific files within that family. The detected surface also goes to the compiled front door as `--surface-hint`. When a prompt ties between surfaces, a hinted specific surface leads the bundle. SKILLED already ranks last, so a SKILLED hint changes nothing (`SKILL.md` §2).

### Key Sources

- [`stack-detection.md`](../../../.skilled/skills/sk-code/shared/references/stack-detection.md): surface detection (a declared specific surface, then the SKILLED fallback, then UNKNOWN) and SKILLED language sub-detection
- [`phase-detection.md`](../../../.skilled/skills/sk-code/shared/references/phase-detection.md) — Phase 1/2/3 lifecycle and phase-specific resource expectations
- `SKILL.md` §2 SMART ROUTING — names the routing authority split and the compiled front door

---

## 2. INTENT MODEL

Intent classification scores task text against weighted keyword signals to pick the dominant work type after surface detection. The vocabulary and weights are authored once, in the `INTENT_SIGNALS` block of §9 MACHINE-READABLE ROUTER; read them there. This section is the human-facing summary of how that block is scored, never a second copy of its keywords.

### Scoring algorithm

1. Sum weighted keyword hits from the request, target files, and known task context.
2. Boost explicit phase signals (verification, debugging, code quality) by +5 when the phase is unambiguous.
3. Select the top intent.
4. Select a second intent when the score delta to the next intent is small (`AMBIGUITY_DELTA = 1`).
5. For SKILLED surface, run language sub-detection after intent selection.

### Doc-only edit anti-signals

Doc-only prose changes subtract from `sk-code` intent scoring and add to `sk-doc` scoring, even when the target file is under `.skilled/skills/`.

| Prompt signal | Effect |
| --- | --- |
| `update headline`, `rewrite headline`, `headline section` | `sk-code -2`, `sk-doc +3` |
| `clarify description`, `clarify the X model`, `documentation section` | `sk-code -2`, `sk-doc +3` |
| `add a one-line summary`, `add summary at the top` | `sk-code -2`, `sk-doc +3` |
| `improve readme`, `reorganize readme`, `rewrite section` | `sk-code -2`, `sk-doc +3` |
| `SKILL.md` or `README.md` plus prose-only verbs | `sk-code -2`, `sk-doc +3` |

Do not apply this anti-signal when the same request asks to modify executable code, parser logic, tests, shell behavior, TypeScript/Python entrypoints, JSON schema behavior, or routing algorithms. In that case, keep SKILLED surface detection and load `sk-code`.

Multi-symptom prompts like `debug the broken jsonc descriptor` should load both DEBUGGING and CONFIG. Prompts like `update TypeScript advisor fixture` should load SKILLED plus TYPESCRIPT and CODE_QUALITY.

### Surface-specific intent notes

- **SKILLED** intent scoring favors language standards, hooks, config, scripts, advisor/tests, metadata, and alignment verification.
- Unsupported surfaces stay UNKNOWN even if intent scoring is strong.

---

## 3. LOAD TIERS

| Tier | When | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation | The §9 `DEFAULT_RESOURCE` preamble only: `shared/references/stack-detection.md`, `shared/references/phase-detection.md` and `shared/references/universal/code-quality-standards.md`. The style guide `sk-code-quality/references/code-style-guide.md` loads with CODE_QUALITY, and the shared doctrine loads with its intent: `workflow-debug.md` with DEBUGGING and `workflow-verify.md` with VERIFICATION |
| SURFACE | After SKILLED detection | Surface-specific resources (`sk-code-skilled/references/shared/*`) |
| INTENT | After intent classification | Implementation, debugging, verification, testing, etc. matching the top-1 intent (and top-2 when ambiguous) |
| LANGUAGE | SKILLED only | Split JavaScript, TypeScript, Python, Shell, Rust, and Config standards from the matching `sk-code-skilled/references/<lang>/` resources |
| ON_DEMAND | Explicit deep-dive keywords | Extended checklists and niche references (e.g. `sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md` for boundary templates) |

---

## 4. SKILLED MAP

SKILLED loads from `sk-code-skilled/references/` and `sk-code-skilled/assets/`.

### Implementation shared tier

IMPLEMENTATION loads the shared organization and naming baseline:

- `sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md`
- `sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md`

### Intent overlay

| Intent | Resources |
| --- | --- |
| CODE_QUALITY | SKILLED only: `sk-code-skilled/assets/checklists/universal-checklist.md` plus the language-matching checklist, both when SKILLED is a resolved surface. A foreign surface loads the floor in `code-quality-standards.md` and its own declared rows |
| VERIFICATION | `sk-code-skilled/references/shared/alignment-verification-automation.md`, `sk-code-skilled/assets/scripts/verify_alignment_drift.py` |
| HOOKS | `sk-code-skilled/references/shared/hooks.md` |
| CONFIG | `sk-code-skilled/references/config/*` |
| LANGUAGE_STANDARDS | Detected language folder's `quick-reference.md`, `style-guide.md`, `quality-standards.md` |

### Language overlay

| Language | Resources |
| --- | --- |
| JAVASCRIPT | `sk-code-skilled/references/javascript/{style_guide,quality_standards,quick_reference}.md`, `sk-code-skilled/assets/checklists/javascript-checklist.md` |
| TYPESCRIPT | `sk-code-skilled/references/typescript/{style_guide,quality_standards,quick_reference}.md`, `sk-code-skilled/assets/checklists/typescript-checklist.md` |
| PYTHON | `sk-code-skilled/references/python/{style_guide,quality_standards,quick_reference}.md`, `sk-code-skilled/assets/checklists/python-checklist.md` |
| SHELL | `sk-code-skilled/references/shell/{style_guide,quality_standards,quick_reference}.md`, `sk-code-skilled/assets/checklists/shell-checklist.md` |
| RUST | `sk-code-skilled/references/rust/{style_guide,quality_standards,quick_reference}/` (each split into topic parts), `sk-code-skilled/assets/checklists/rust-checklist/` |
| CONFIG | `sk-code-skilled/references/config/{style_guide,quality_standards,quick_reference}.md`, `sk-code-skilled/assets/checklists/config-checklist.md` |

### Authoring checklist gating

When SKILLED intent is `authoring-new-X`, additionally load the matching authoring checklist:

| Authoring target | Checklist |
| --- | --- |
| New skill | `sk-code-skilled/assets/checklists/skill-authoring.md` |
| New agent | `sk-code-skilled/assets/checklists/agent-authoring.md` |
| New command | `sk-code-skilled/assets/checklists/command-authoring.md` |
| New MCP server | `sk-code-skilled/assets/checklists/mcp-server-authoring.md` |
| Spec folder write | Now in system-spec-kit: `system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` + `system-spec-kit/references/workflows/spec-folder-write-recipe.md` |

### CI Workflow Map

When the request names a GitHub Actions workflow, the hub bundles `sk-code-ci` from the request vocabulary and the `CI_WORKFLOW` intent loads its four rule references:

| Resource | Carries |
| --- | --- |
| `sk-code-ci/references/ci-workflow-standards.md` | The rule index: path parity, SHA pins, README row, `set -euo pipefail`, fork and secret safety, matrix and `fail-fast` |
| `sk-code-ci/references/trigger-and-filter-rules.md` | The twin rule, the rebuild-commit skip rule, push-only scope and the intentional exceptions table |
| `sk-code-ci/references/job-shape-rules.md` | Timeouts, permissions, the concurrency template, the composite setup action and the switch `if:` shape |
| `sk-code-ci/references/protected-set.md` | The repository CI profile and its keys, the workflows protected by function and the rules that follow |

The map is the packet's own `RESOURCE_MAP` re-prefixed with `sk-code-ci/`, so the two stay equal.

---

## 5. VERIFICATION COMMANDS

| Surface | Required verification evidence |
| --- | --- |
| SKILLED | `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root <changed-scope>`; plus targeted language/project tests such as vitest, pytest, shellcheck, JSON validation, or spec validation for changed spec folders |
| UNKNOWN | User-selected verification command set before completion claim |

---

## 6. UNKNOWN FALLBACK

If no supported surface matches, ask:

1. Is this `.skilled/` system code, or an unsupported stack?
2. Which files or directories are changing?
3. Which verification command proves the claim?
4. Should a new `sk-code` route be planned before implementation?

Do not load Go/NextJS/React Native resources from canonical sk-code; those surfaces live in the Barter sk-code fork (`barter/.opencode/skills/sk-code/references/`). Canonical sk-code owns the SKILLED surface plus the `sk-code-ci` GitHub Actions surface.

### UNKNOWN fallback checklist

Returned when intent confidence is low (`max(intent_scores) < 0.5`) OR when the user explicitly asks for stack-agnostic guidance:

- Confirm the detected surface (a declared specific surface, the SKILLED fallback or UNKNOWN)
- Confirm the task intent (implementation / debugging / verification / etc.)
- Provide one concrete input, error, or expected output
- Confirm the verification command set before completion

---

## 7. LOADING DISCIPLINE (DO / DON'T)

### DO

- Load only references needed for current intent + surface
- Use exact canonical file paths in playbook result YAML (never directory placeholders)
- Cite surface + top-1 intent + loaded resource paths + verification command in your final answer

### DON'T

- Load all of `sk-code-skilled/` indiscriminately ("just in case")
- Load Go/NextJS/React Native resources (those live in the Barter fork)
- Drop directory placeholders in playbook result YAML

---

## 8. RELATED RESOURCES

- [`stack-detection.md`](../../../.skilled/skills/sk-code/shared/references/stack-detection.md): surface detection (a declared specific surface, then the SKILLED fallback, then UNKNOWN) + SKILLED language sub-detection
- [`phase-detection.md`](../../../.skilled/skills/sk-code/shared/references/phase-detection.md) — Phase 1/2/3 lifecycle and per-phase resource loading
- `SKILL.md` §2 SMART ROUTING — names the routing authority split and the compiled front door
- Barter equivalent: `barter/.skilled/skills/sk-code/shared/references/smart-routing.md` (different routing key — git-remote project — but same structural pattern)

---

## 9. MACHINE-READABLE ROUTER (replay / benchmark source)

This block is the authored source for the intent vocabulary and weights. §2 explains how it is scored and does not repeat the keywords; §4 renders the same rows as prose. When an intent row changes here, update the matching prose row in §4.

This projection is intentionally lossy in two documented ways the flat dictionary cannot express, both enforced by the prose contract and the surface-detection pseudocode in `SKILL.md` §2:

- **No phase boosts.** The `+5` unambiguous-phase boost from the §2 scoring algorithm is not represented; every keyword carries unit weight here.
- **No doc-only anti-signals.** The `sk-code -2 / sk-doc +3` anti-signals (§2) that route prose-only edits away from this skill are a pre-filter the flat model does not carry.

```python
# Always-loaded routing preamble: every code task detects stack, detects phase,
# consults the router, and applies the universal quality baseline before any
# surface-specific resource. These are loaded on every route.
DEFAULT_RESOURCE = [
    "shared/references/stack-detection.md",
    "shared/references/phase-detection.md",
    "shared/references/universal/code-quality-standards.md",
]

INTENT_SIGNALS = {
    "IMPLEMENTATION":     {"weight": 1, "keywords": ["implement", "build", "create", "feature", "component", "module", "authoring"]},
    "CODE_QUALITY":       {"weight": 1, "keywords": ["lint", "format", "quality gate", "naming", "standards", "code smell", "comment hygiene", "restraint", "yagni", "simplify", "over-engineering", "bloat", "skipped_untrusted", "untrusted repository check", "trustrepochecks", "quality config", "repository/quality.json", "configured check", "unverified"]},
    "DEBUGGING":          {"weight": 1, "keywords": ["debug", "broken", "failing", "stack trace", "console error", "regression"]},
    "VERIFICATION":       {"weight": 1, "keywords": ["verify", "passing", "type-check", "alignment drift", "completion claim"]},
    "HOOKS":              {"weight": 1, "keywords": ["session-prime", "user-prompt-submit", "pre-tool-use", "post-tool-use"]},
    "CONFIG":             {"weight": 1, "keywords": ["jsonc", ".json", ".jsonc", "descriptor", "config schema"]},
    "JAVASCRIPT":         {"weight": 1, "keywords": ["javascript", "vanilla js", ".js", "commonjs", ".cjs", ".mjs"]},
    "TYPESCRIPT":         {"weight": 1, "keywords": ["typescript", ".ts", ".tsx"]},
    "PYTHON":             {"weight": 1, "keywords": ["python", ".py", "docstring"]},
    "SHELL":              {"weight": 1, "keywords": ["shell script", "bash", ".sh"]},
    "RUST":               {"weight": 1, "keywords": ["rust", ".rs", "cargo.toml", "cargo.lock", "napi-rs", "napi_rs", "#[napi]", "wasm-bindgen", "wasm_bindgen", "#[wasm_bindgen]", "wasi", "cdylib"]},
    "CI_WORKFLOW":        {"weight": 4, "keywords": ["github actions workflow", "ci workflow", "github actions yaml", "workflow path filters", "github workflow timeout", "github workflow concurrency", "github workflow permissions", "required status check workflow", "ci job", "action to a sha", "sha-pinned action", "github actions permissions", "ci workflows", "ci switch", "turn off ci", ".github/workflows", "workflow concurrency", "github actions release workflow", "github actions deploy workflow", "release workflow yaml", "deploy workflow yaml", "github actions minutes", "actions minutes", "actions runner minutes", "runner minutes", "ci workflow cost", "ci cost", "reduce ci costs", "lower ci costs", "cut ci costs", "reduce our ci costs", "lower our ci costs", "ci spend", "ci bill", "ci minutes cost", "cut the ci minutes", "cut ci minutes", "reduce ci minutes", "ci pipeline cost", "ci pipeline cheaper", "ci pipelines cheaper", "cheaper ci pipeline", "ci runs cheaper", "failing ci", "failing ci pipeline", "ci failure", "ci failures", "ci is failing", "broken ci", "debug the ci", "debug ci", "cost of our ci", "make ci cheaper", "github actions bill", "github actions cost", "turn off the ci", "turn on the ci", "ci review workflow"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md",
        "sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md",
        "sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md",
        "sk-code-skilled/references/shared/code-organization/imports-and-exports.md",
        "sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md",
        "sk-code-skilled/assets/checklists/agent-authoring.md",
        "sk-code-skilled/assets/checklists/command-authoring.md",
        "sk-code-skilled/assets/checklists/skill-authoring.md",
        "sk-code-skilled/assets/checklists/mcp-server-authoring.md",

    ],
    "CODE_QUALITY": [
        "shared/references/universal/code-quality-standards.md",
        "shared/references/universal/rule-overrides.md",
        "sk-code-quality/references/code-style-guide.md",
        "sk-code-quality/references/runner-contract.md",
        "sk-code-skilled/assets/checklists/universal-checklist.md",  # SKILLED only: the house checklist loads when SKILLED resolves, never for a foreign surface
        "sk-code-skilled/assets/checklists/javascript-checklist.md",
        "sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md",
        "sk-code-skilled/assets/checklists/js-css-style/naming-init-formatting-and-css.md",
        "sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md",
        "sk-code-skilled/assets/checklists/typescript-checklist.md",
        "sk-code-skilled/assets/checklists/python-checklist.md",
        "sk-code-skilled/assets/checklists/shell-checklist.md",
        "sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md",
        "sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md",
        "sk-code-skilled/assets/checklists/rust-checklist/p1-required.md",
        "sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md",
        "sk-code-review/assets/code-quality-checklist.md",

    ],
    "DEBUGGING": [
        "shared/references/workflow-debug.md",

    ],
    "VERIFICATION": [
        "sk-code-skilled/references/shared/alignment-verification-automation.md",
        "shared/references/workflow-verify.md",
        "sk-code-skilled/assets/scripts/README.md",

    ],
    "HOOKS": [
        "sk-code-skilled/references/shared/hooks.md",
    ],
    "CONFIG": [
        "sk-code-skilled/references/config/style-guide.md",
        "sk-code-skilled/references/config/quality-standards.md",
        "sk-code-skilled/references/config/quick-reference.md",
        "sk-code-skilled/assets/checklists/config-checklist.md",
    ],
    "JAVASCRIPT": [
        "sk-code-skilled/references/javascript/style-guide.md",
        "sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md",
        "sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md",
        "sk-code-skilled/references/javascript/quick-reference.md",
    ],
    "TYPESCRIPT": [
        "sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md",
        "sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md",
        "sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md",
        "sk-code-skilled/references/typescript/quality-standards/tsdoc-errors-and-async.md",
        "sk-code-skilled/references/typescript/quality-standards/tsconfig-and-modules.md",
        "sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md",
        "sk-code-skilled/references/typescript/quick-reference/imports-errors-and-tsconfig.md",
    ],
    "PYTHON": [
        "sk-code-skilled/references/python/style-guide.md",
        "sk-code-skilled/references/python/quality-standards.md",
        "sk-code-skilled/references/python/quick-reference.md",
    ],
    "SHELL": [
        "sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md",
        "sk-code-skilled/references/shell/style-guide/variables-functions-and-output.md",
        "sk-code-skilled/references/shell/quality-standards/overview-and-priority-blockers.md",
        "sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md",
        "sk-code-skilled/references/shell/quick-reference/template-variables-and-loops.md",
        "sk-code-skilled/references/shell/quick-reference/functions-strings-and-checklist.md",
    ],
    "RUST": [
        "sk-code-skilled/references/rust/style-guide/overview-and-file-header.md",
        "sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md",
        "sk-code-skilled/references/rust/style-guide/naming-conventions.md",
        "sk-code-skilled/references/rust/style-guide/formatting-and-imports.md",
        "sk-code-skilled/references/rust/style-guide/commenting-and-rustdoc.md",
        "sk-code-skilled/references/rust/style-guide/interop-model.md",
        "sk-code-skilled/references/rust/style-guide/interop-errors-and-parity.md",
        "sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md",
        "sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md",
        "sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md",
        "sk-code-skilled/references/rust/quality-standards/build-and-organization.md",
        "sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md",
        "sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md",
        "sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md",
        "sk-code-skilled/references/rust/quick-reference/collections-imports-and-errors.md",
        "sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md",
        "sk-code-skilled/references/rust/quick-reference/determinism-parity-and-related.md",
    ],
    "CI_WORKFLOW": [
        "sk-code-ci/references/ci-workflow-standards.md",
        "sk-code-ci/references/trigger-and-filter-rules.md",
        "sk-code-ci/references/job-shape-rules.md",
        "sk-code-ci/references/protected-set.md",
    ],
}

# Hub-level shared controls, declared once here. This list holds every
# contained shared/ path that RESOURCE_MAP references but that is exempt from
# typed-leaf projection, because it has no single packet owner. The root-router
# contract validates each entry and requires RESOURCE_MAP to reference it.
# DEFAULT_RESOURCE above is the other half of the set: its always-loaded
# preamble paths are hub-level controls too. No other shared/ path is a
# control, so a guard that needs the control set reads these two lists.
SHARED_CONTROL_RESOURCES = [
    "shared/references/universal/code-quality-standards.md",
    "shared/references/universal/rule-overrides.md",
    "shared/references/workflow-debug.md",
    "shared/references/workflow-verify.md",
]
```

### Surface-aware loading (route-time)

The router does NOT load the whole matched-intent union. After surface detection (§1, `stack-detection.md`), a route loads:

- the always-loaded `DEFAULT_RESOURCE` preamble (stack/phase detection and the universal quality baseline), plus
- the `shared/` entries the matched intents map (for example `code-quality-standards.md` under CODE_QUALITY, `workflow-debug.md` under DEBUGGING and `workflow-verify.md` under VERIFICATION), never the whole `shared/references/universal/` folder, plus
- only the **detected surface's** slice (`<surface>/references/*`) for the matched intents.

It does not load another surface's resources, and it defers `assets/*` (checklists, recipes, templates) to on-demand rather than the first slice. Within SKILLED it slices once more by the **detected language** (§1 sub-detection): a TypeScript task loads `sk-code-skilled/references/typescript/*` plus the language-agnostic `sk-code-skilled/references/shared/*`, not the Python, shell, config, or JavaScript folders. An `UNKNOWN` surface falls back to the preamble plus the shared-tier entries its matched intents map. This is what stops a routine single-surface task from pulling the full cross-surface set. The deterministic router-replay enforces the same rule, so the benchmark measures it.

---

## 10. HOW TO READ THIS

- Every code task first loads the always-on preamble (stack + phase detection and the universal quality baseline); routing then narrows to the detected surface's slice for the matched intents.
- One dominant intent on one surface loads that surface's slice; two near-tied intents (within the router's ambiguity delta) load both intent sets, deduped by canonical pair.
- A single-surface task never pulls another surface's resources.
- No keyword match, or an `UNKNOWN` surface, falls back to the preamble plus the shared-tier entries its matched intents map — confirm the surface and intent before loading more. See §6 (UNKNOWN FALLBACK) and §7 (LOADING DISCIPLINE) for the full rules.

---

## 11. MACHINE ROUTER

The hub's routing prose, moved here from `SKILL.md` so the skill body keeps only the pointer. It sits last, after the stage-two map above, and it declares no map of its own: the `INTENT_SIGNALS` and `RESOURCE_MAP` block in section 9 stays the only replay source.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<task>"
> ```
> Follow the returned decision: `route` (use its `targets`), `clarify`/`defer` (disambiguate) or `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `sk-code`. Set `SPECKIT_COMPILED_ROUTING=0`, the explicit kill-switch, to force legacy routing fleet-wide.

**Session surface hint.** Before you call the front door, run the surface detection in [`stack-detection.md`](../../../.skilled/skills/sk-code/shared/references/stack-detection.md) on the session's working directory and the files it is editing.
Then add its result as `--surface-hint <SURFACE>`, for example `--surface-hint SKILLED`.
When the prompt's keywords tie between surfaces, a hinted specific surface leads them.
Workflow modes keep first place, and the targets and the bundle kind stay the same.
`SKILLED` is the fallback surface and always ranks last, so a `SKILLED` hint changes nothing.
With `UNKNOWN`, no hint or a surface the prompt did not match, the `routerPolicy.tieBreak` order applies.

### Surface Router: per-intent leaf sets

Root `ROUTER.md` owns the second-stage `INTENT_SIGNALS` / `RESOURCE_MAP`, while packet-owned resources stay typed through `leaf-manifest.json`.
The hub-level shared controls are declared once, in `ROUTER.md` §9: the `SHARED_CONTROL_RESOURCES` list plus the always-loaded `DEFAULT_RESOURCE` preamble. They resolve on disk but never project as leaves.
The hub router keeps stage-one mode selection and its `shared/README.md` fallback.

### The discriminator
- **`workflowMode`** - the public mode/packet key: `sk-code-quality`, `sk-code-review` (workflow) or `sk-code-ci`, `sk-code-skilled` (surface).
- **`packetKind`** - the axis: `workflow` (a mode that acts) or `surface` (read-only evidence bundled alongside a mode).
- **`backendKind`** - which backend runs the packet: `surface-router` or `review-cache` for workflow modes, `evidence-base` for surface packets.

Surface packets are advisor-invisible (`routingClass: metadata`, read-only `toolSurface`).
The advisor still routes the single identity `sk-code`, and the hub bundles zero-or-more surfaces as evidence via `routerPolicy.outcomes.surfaceBundle`.
The workflow mode comes first, followed by surfaces.
"review my typescript module for jank" → `[sk-code-review, sk-code-skilled]`.
Bundled surfaces follow the `routerPolicy.tieBreak` order. It ranks `sk-code-ci` ahead of `sk-code-skilled`, so the surface that wins a keyword tie comes first.

### Surface detection

Surface detection lives once in the hub's `shared/` layer and every mode and surface consumes it.
It tries every declared specific surface first, then the `SKILLED` fallback, then `UNKNOWN`.
When a specific surface and `SKILLED` both match, the specific one leads and `SKILLED` comes along as second evidence.
Each surface declares its markers in a `surfaceDetection` block in `mode-registry.json`, or in its own `graph-metadata.json` when it lives outside the hub.
Modes own workflow contracts, not surface identity.
`sk-code-ci` is the one surface that stack detection does not select. The hub bundles it from request vocabulary alone (`code-ci-aliases` and `code-ci-runtime` in `hub-router.json`).

### Fallback route

When no workflow mode dominates (a bare implement/debug/verify request), the router defers to a pure surface bundle: it detects the surface, loads that surface's evidence and workflow doctrine, and the agent acts. `routerPolicy.defaultMode` is `null`, so the hub does not force a stale default. An unclear code intent asks for disambiguation.

Per-mode behavior is **not flattened**: each packet keeps its own code-work contract, standards, evidence rules, and tool-permission guards.

### Routing rule
```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is sk-code-quality, sk-code-review, sk-code-ci or sk-code-skilled work",
    "Confirm the target files or runtime surface",
    "Confirm the expected action: implement, debug, verify, quality gate, or review",
    "Confirm the verification command set before completion",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.name != "SKILL.md" and resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown skill resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path: str, loaded: list[str], seen: set[str]) -> None:
    guarded = _guard_in_skill(relative_path)
    path = SKILL_ROOT / guarded
    if path.exists() and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def route(task):
    loaded, seen = [], set()
    registry = read_json(SKILL_ROOT / "mode-registry.json")
    workflow_mode = explicit_mode_hint(task) or classify_workflow_mode(task)

    if not workflow_mode:
        load_if_available("shared/README.md", loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    entry = find_registry_entry(registry, workflowMode=workflow_mode)
    if not entry:
        load_if_available("shared/README.md", loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK", "unknown_mode": workflow_mode, "resources": loaded}

    packet_skill = f"{entry['packet']}/SKILL.md"
    load_if_available(packet_skill, loaded, seen)

    for surface_mode in surface_bundle_from_hub_router(task):
        surface_entry = find_registry_entry(registry, workflowMode=surface_mode)
        if surface_entry:
            load_if_available(f"{surface_entry['packet']}/SKILL.md", loaded, seen)

    if not loaded:
        load_if_available("shared/README.md", loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK", "notice": "matched registry but no packet SKILL.md was available", "resources": loaded}

    return {"workflowMode": workflow_mode, "backendKind": entry["backendKind"], "resources": loaded}
```
