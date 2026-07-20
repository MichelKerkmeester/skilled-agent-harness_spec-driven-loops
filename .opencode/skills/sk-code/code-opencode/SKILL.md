---
name: code-opencode
description: "sk-code OPENCODE surface: system-code evidence (TypeScript/Python/shell/Rust/config standards, language-agnostic patterns, hooks, alignment verification, and skill/agent/command/MCP authoring checklists) plus shared implement/debug/verify workflow doctrine."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.4
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: opencode, system-code, typescript, python, shell, rust, jsonc, config, mcp, skill-authoring, agent-authoring, command-authoring, hooks, alignment-verifier, surface-evidence, sk-code -->

# opencode Surface — System-Code Evidence

**Domain evidence** and shared workflow doctrine for OpenCode system code (the `.opencode/` tree: skills, agents, commands, plugins, MCP servers, config, changelogs, and runtime bridge wiring). This surface owns the implement -> debug -> verify phases through the workflow references below, then slices evidence by the detected language so a TypeScript task never pulls the Python/shell/config guides.

Detection is two-step. First, the surface trigger is work under `.opencode/` (including `SKILL.md`, descriptors, commands, agents, plugins, MCP servers, assets, scripts, and changelogs). Second, once the OpenCode surface is selected, file extensions and local markers select the language trio: `.cjs`/`.mjs`/`.js` -> JavaScript, `.ts`/`.tsx`/`.mts`/`.d.ts` -> TypeScript, `.py` plus `argparse` -> Python, `.sh`/`.bash` -> shell, `.rs` -> Rust, `.json`/`.jsonc`/`.yaml`/`.yml` plus `graph-metadata` or `spec-folder` -> config. For Rust, when no `.rs` file is present, local `Cargo.toml`/`Cargo.lock` markers select it after the OpenCode surface is established; napi-rs and wasm-bindgen vocabulary are additional intent signals, not cross-project surface detectors.

## 1. WHEN THE HUB BUNDLES THIS

- The task touches `.opencode/` system code — a skill, agent, command, plugin, MCP server, or descriptor/config.
- The active workflow phase needs a language standard, a language-agnostic organization pattern, a hook contract, an alignment-verification procedure, or an authoring checklist.
- This surface owns edits, tests, and verification through the workflow references; hand off formal findings-first review to `code-review` and author-side quality gates to `code-quality`.

## 2. REFERENCE MAP

Language standards — after `.opencode/` selects this surface, load ONLY the detected language's trio (`style-guide.md`, `quality-standards.md`, `quick-reference.md`):
- TypeScript — `references/typescript/`
- Python — `references/python/`
- Shell — `references/shell/`
- Rust (napi-rs/WASM/sidecar interop under TypeScript parity) — `references/rust/`
- Config (JSON/JSONC/YAML descriptors and route assets) — `references/config/`
- JavaScript (CommonJS/ESM plugins) — `references/javascript/`

Language-agnostic shared tier (`references/shared/`, always kept within OpenCode regardless of language):
- `universal_patterns.md`, `code_organization.md`
- `hooks.md` — runtime hook entrypoints, checked-in Claude wiring, OpenCode plugin-bridge delivery, and wrapper reachability; defer to that file for current hook infrastructure instead of duplicating it here
- `alignment-verification-automation.md` — the alignment-drift verifier

Workflow (`references/`): `workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md` — this surface owns the implement -> debug -> verify phases; these are the shared phase doctrine.

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of code-opencode's own reference/asset routing, consumed by the skill-benchmark router-replay; keep it in sync with the parent hub union.

```python
# code-opencode owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with code-opencode/) and the sibling code-webflow map plus the
# parent-owned universal/shared tier; the sk-code-router-sync.vitest.ts suite
# (under system-deep-loop's skill-benchmark tests) is the guard that enforces
# that equality. verify_alignment_drift.py is markdown-blind by default and does
# not check this map unless invoked with --check-router (dead-route existence
# only), so it is not the equality authority.
DEFAULT_RESOURCE = [
    "references/shared/universal-patterns/naming-and-commenting.md",
    "references/shared/universal-patterns/organization-security-and-examples.md",
    "references/shared/code-organization/overview-and-module-organization.md",
    "references/shared/code-organization/imports-and-exports.md",
    "references/shared/code-organization/directory-and-test-conventions.md",
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

## 3. SURFACE STANDARDS (the non-negotiables)

- **Plugins never write to the TUI.** OpenCode plugins must not print to the process stdout/stderr (no overlay on the chat input); user/agent-visible output goes through system-context injection, tools, or append-only log files; DEBUG-gated stderr is allowed only behind an env flag. See `references/javascript/quality-standards/overview-modules-and-docs.md` and the plugin exemption tier.
- **Descriptors are load-bearing.** `graph-metadata.json` / `description.json` shape drives discovery; validate JSON/JSONC against `references/config/quality-standards.md`.
- **Alignment drift is a verification gate.** System-code changes re-run all three sk-code drift guards before any completion claim — `assets/scripts/verify_alignment_drift.py` (language integrity; add `--check-router` for dead RESOURCE_MAP routes), `assets/scripts/verify_stack_folders.py` (language reference folders resolve), and the `sk-code-router-sync.vitest.ts` suite (machine router vs filesystem/prose, plus the compiled-destination ↔ leaf-manifest ↔ RESOURCE_MAP bijection) — through the single entry point `scripts/run-all-drift-guards.sh`. See `references/shared/alignment-verification-automation.md`.
- **Rust preserves the TypeScript contract.** Rust napi-rs, WASM/WASI, and sidecar modules are compatibility implementations, not independent behavior authorities. JS-visible bytes, six-decimal numeric behavior, comparator tie-breaks, deterministic IDs, collection order, DTOs, and error shapes must remain identical to the TypeScript oracle.
- **Touched-language set, not one-per-task.** Most `.opencode/` tasks touch a single language — keep that slice tight and lean on the shared tier for cross-language rules. An interop task that spans a language pair (a napi-rs / WASM / sidecar Rust module held to its TypeScript oracle) legitimately touches both languages: the router slices to the set the task actually touches and loads both trios plus the shared tier, because you cannot hold Rust byte-identical to TypeScript without seeing both standards.

## 4. ASSETS AND OTHER SURFACE AREAS — on-demand

Component authoring (`assets/checklists/`): `skill-authoring.md`, `agent-authoring.md`, `command-authoring.md`, `mcp-server-authoring.md`

Language quality gates (`assets/checklists/`): `universal-checklist.md`, `typescript-checklist.md`, `python-checklist.md`, `shell-checklist.md`, `javascript-checklist.md`, `rust-checklist/` (split into topic parts), `config-checklist.md`

Verifier assets (`assets/scripts/`): alignment-drift and stack-folder verifier scripts used by this surface. `scripts/run-all-drift-guards.sh` is the single entry point that runs both of them plus the `sk-code-router-sync.vitest.ts` bijection suite as one gate (non-zero if any guard fails).

Changelog directories (`changelog/`): real skill and packet changelog files are part of the OpenCode surface inventory, not out-of-scope documentation noise.

Daemon IPC/socket wiring: daemon-backed CLIs and plugin bridges resolve runtime Unix socket paths such as `daemon-ipc.sock`; sockets are runtime artifacts, so checked-in evidence lives in launcher, bridge, and config files rather than in committed `.sock` files.

Spec-folder authoring lives in system-spec-kit (`references/workflows/spec-folder-write-recipe.md` + `spec-folder-authoring-checklist.md`), not in this surface. Checklists are pulled on demand by the active workflow phase.
