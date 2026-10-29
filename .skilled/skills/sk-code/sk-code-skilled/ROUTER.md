---
title: "opencode Surface — System-Code Evidence Router"
description: "Sibling router for sk-code-skilled: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-code-skilled router"
  - "sk-code-skilled routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# opencode Surface — System-Code Evidence Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

The hub bundles this surface when a request touches `.skilled/` system code, such as a skill, agent, command, plugin, MCP server, descriptor or config. A language or authoring signal then selects the leaf, and the first leaves loaded are the shared tier under `references/shared/`. From there the router selects among four families: language references, shared patterns, the authoring and quality checklists under `assets/checklists/`, and the verifier assets under `assets/scripts/`.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **IMPLEMENTATION** — "implement / build / create / feature / component / module / authoring" requests load the five `references/shared/` pattern and organization docs, then `assets/checklists/agent-authoring.md`, `assets/checklists/command-authoring.md`, `assets/checklists/skill-authoring.md` and `assets/checklists/mcp-server-authoring.md`.
- **CODE_QUALITY** — "lint / format / quality gate / naming / standards / code smell" requests load `assets/checklists/universal-checklist.md`, the three `assets/checklists/js-css-style/` parts and the per-language checklists for JavaScript, TypeScript, Python, shell and the four `assets/checklists/rust-checklist/` parts.
- **VERIFICATION** — "verify / passing / type-check / alignment drift / completion claim" requests load `references/shared/alignment-verification-automation.md` and `assets/scripts/README.md`.
- **HOOKS** — "session-prime / user-prompt-submit / pre-tool-use / post-tool-use" requests load `references/shared/hooks.md` and nothing else, so hook wiring stays in one file.
- **CONFIG** — "jsonc / .json / .jsonc / descriptor / config schema" requests load `references/config/style-guide.md`, `references/config/quality-standards.md`, `references/config/quick-reference.md` and `assets/checklists/config-checklist.md`.
- **JAVASCRIPT** — "javascript / .js / commonjs / .cjs / .mjs" requests load `references/javascript/style-guide.md`, both `references/javascript/quality-standards/` parts and `references/javascript/quick-reference.md`.
- **TYPESCRIPT** — "typescript / .ts / .tsx" requests load the seven `references/typescript/` docs: two style-guide parts, three quality-standards parts and two quick-reference parts.
- **PYTHON** — "python / .py / docstring" requests load `references/python/style-guide.md`, `references/python/quality-standards.md` and `references/python/quick-reference.md`.
- **SHELL** — "shell script / bash / .sh" requests load the six `references/shell/` docs: two style-guide parts, two quality-standards parts and two quick-reference parts.
- **RUST** — "rust / .rs / cargo.toml / cargo.lock / napi-rs / napi_rs / #[napi] / wasm-bindgen / wasm_bindgen / #[wasm_bindgen] / wasi / cdylib" requests load the seventeen `references/rust/` docs: seven style-guide parts, five quality-standards parts and five quick-reference parts.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This block is the deterministic projection of sk-code-skilled's own reference/asset routing; keep it in sync with the parent hub union.

```python
# sk-code-skilled owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-skilled/) plus the
# parent-owned universal/shared tier. The router-sync guard
# (assets/scripts/verify-router-sync.cjs, leg 2) checks that equality.
# verify_alignment_drift.py --check-router checks dead routes only, so it is not
# the equality authority. Leg 1b of the same guard fails on any reference or asset doc that
# no router names, so a new doc under references/ or assets/ needs a RESOURCE_MAP entry here.
DEFAULT_RESOURCE = [
    "references/shared/universal-patterns/naming-and-commenting.md",
    "references/shared/universal-patterns/organization-security-and-examples.md",
    "references/shared/code-organization/overview-and-module-organization.md",
    "references/shared/code-organization/imports-and-exports.md",
    "references/shared/code-organization/directory-and-test-conventions.md",
    "references/shared/workflow-guardrails.md",
]

INTENT_SIGNALS = {
    "IMPLEMENTATION":     {"weight": 1, "keywords": ["implement", "build", "create", "feature", "component", "module", "authoring"]},
    "CODE_QUALITY":       {"weight": 1, "keywords": ["lint", "format", "quality gate", "naming", "standards", "code smell"]},
    "VERIFICATION":       {"weight": 1, "keywords": ["verify", "passing", "type-check", "alignment drift", "completion claim"]},
    "HOOKS":              {"weight": 1, "keywords": ["session-prime", "user-prompt-submit", "pre-tool-use", "post-tool-use"]},
    "CONFIG":             {"weight": 1, "keywords": ["jsonc", ".json", ".jsonc", "descriptor", "config schema"]},
    "JAVASCRIPT":         {"weight": 1, "keywords": ["javascript", ".js", "commonjs", ".cjs", ".mjs"]},
    "TYPESCRIPT":         {"weight": 1, "keywords": ["typescript", ".ts", ".tsx"]},
    "PYTHON":             {"weight": 1, "keywords": ["python", ".py", "docstring"]},
    "SHELL":              {"weight": 1, "keywords": ["shell script", "bash", ".sh"]},
    "RUST":               {"weight": 1, "keywords": ["rust", ".rs", "cargo.toml", "cargo.lock", "napi-rs", "napi_rs", "#[napi]", "wasm-bindgen", "wasm_bindgen", "#[wasm_bindgen]", "wasi", "cdylib"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "references/shared/universal-patterns/naming-and-commenting.md",
        "references/shared/universal-patterns/organization-security-and-examples.md",
        "references/shared/code-organization/overview-and-module-organization.md",
        "references/shared/code-organization/imports-and-exports.md",
        "references/shared/code-organization/directory-and-test-conventions.md",
        "assets/checklists/agent-authoring.md",
        "assets/checklists/command-authoring.md",
        "assets/checklists/skill-authoring.md",
        "assets/checklists/mcp-server-authoring.md",
    ],
    "CODE_QUALITY": [
        "assets/checklists/universal-checklist.md",
        "assets/checklists/javascript-checklist.md",
        "assets/checklists/js-css-style/overview-header-and-comments.md",
        "assets/checklists/js-css-style/naming-init-formatting-and-css.md",
        "assets/checklists/js-css-style/verification-quick-reference-and-related.md",
        "assets/checklists/typescript-checklist.md",
        "assets/checklists/python-checklist.md",
        "assets/checklists/shell-checklist.md",
        "assets/checklists/rust-checklist/overview-and-p0-parity.md",
        "assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md",
        "assets/checklists/rust-checklist/p1-required.md",
        "assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md",
    ],
    "VERIFICATION": [
        "references/shared/alignment-verification-automation.md",
        "assets/scripts/README.md",
    ],
    "HOOKS": [
        "references/shared/hooks.md",
    ],
    "CONFIG": [
        "references/config/style-guide.md",
        "references/config/quality-standards.md",
        "references/config/quick-reference.md",
        "assets/checklists/config-checklist.md",
    ],
    "JAVASCRIPT": [
        "references/javascript/style-guide.md",
        "references/javascript/quality-standards/overview-modules-and-docs.md",
        "references/javascript/quality-standards/security-testing-and-exemptions.md",
        "references/javascript/quick-reference.md",
    ],
    "TYPESCRIPT": [
        "references/typescript/style-guide/overview-strict-and-naming.md",
        "references/typescript/style-guide/formatting-imports-and-coexistence.md",
        "references/typescript/quality-standards/overview-and-type-system.md",
        "references/typescript/quality-standards/tsdoc-errors-and-async.md",
        "references/typescript/quality-standards/tsconfig-and-modules.md",
        "references/typescript/quick-reference/template-naming-and-types.md",
        "references/typescript/quick-reference/imports-errors-and-tsconfig.md",
    ],
    "PYTHON": [
        "references/python/style-guide.md",
        "references/python/quality-standards.md",
        "references/python/quick-reference.md",
    ],
    "SHELL": [
        "references/shell/style-guide/overview-structure-and-naming.md",
        "references/shell/style-guide/variables-functions-and-output.md",
        "references/shell/quality-standards/overview-and-priority-blockers.md",
        "references/shell/quality-standards/validation-security-and-shellcheck.md",
        "references/shell/quick-reference/template-variables-and-loops.md",
        "references/shell/quick-reference/functions-strings-and-checklist.md",
    ],
    "RUST": [
        "references/rust/style-guide/overview-and-file-header.md",
        "references/rust/style-guide/toolchain-and-project-structure.md",
        "references/rust/style-guide/naming-conventions.md",
        "references/rust/style-guide/formatting-and-imports.md",
        "references/rust/style-guide/commenting-and-rustdoc.md",
        "references/rust/style-guide/interop-model.md",
        "references/rust/style-guide/interop-errors-and-parity.md",
        "references/rust/quality-standards/overview-and-data-ownership.md",
        "references/rust/quality-standards/modeling-collections-and-api.md",
        "references/rust/quality-standards/docs-errors-and-async.md",
        "references/rust/quality-standards/build-and-organization.md",
        "references/rust/quality-standards/determinism-and-parity.md",
        "references/rust/quick-reference/overview-and-boundary-template.md",
        "references/rust/quick-reference/naming-ordering-and-signatures.md",
        "references/rust/quick-reference/collections-imports-and-errors.md",
        "references/rust/quick-reference/rustdoc-and-cargo.md",
        "references/rust/quick-reference/determinism-parity-and-related.md",
    ],
}
```
