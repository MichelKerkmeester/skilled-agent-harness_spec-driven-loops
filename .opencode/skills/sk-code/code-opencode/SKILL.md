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

Language standards — after `.opencode/` selects this surface, load ONLY the detected language's trio (`style_guide.md`, `quality_standards.md`, `quick_reference.md`):
- TypeScript — `references/typescript/`
- Python — `references/python/`
- Shell — `references/shell/`
- Rust (napi-rs/WASM/sidecar interop under TypeScript parity) — `references/rust/`
- Config (JSON/JSONC/YAML descriptors and route assets) — `references/config/`
- JavaScript (CommonJS/ESM plugins) — `references/javascript/`

Language-agnostic shared tier (`references/shared/`, always kept within OpenCode regardless of language):
- `universal_patterns.md`, `code_organization.md`
- `hooks.md` — runtime hook entrypoints, checked-in Claude wiring, OpenCode plugin-bridge delivery, and wrapper reachability; defer to that file for current hook infrastructure instead of duplicating it here
- `alignment_verification_automation.md` — the alignment-drift verifier

Workflow (`references/`): `workflow_implement.md`, `workflow_debug.md`, `workflow_verify.md` — this surface owns the implement -> debug -> verify phases; these are the shared phase doctrine.

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of code-opencode's own reference/asset routing, consumed by the skill-benchmark router-replay; keep it in sync with the parent hub union.

```python
# code-opencode owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with code-opencode/) and the sibling code-webflow map plus the
# parent-owned universal/shared tier; a drift guard enforces that equality.
DEFAULT_RESOURCE = [
    "references/shared/universal_patterns/naming_and_commenting.md",
    "references/shared/universal_patterns/organization_security_and_examples.md",
    "references/shared/code_organization/overview_and_module_organization.md",
    "references/shared/code_organization/imports_and_exports.md",
    "references/shared/code_organization/directory_and_test_conventions.md",
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
        "references/shared/universal_patterns/naming_and_commenting.md",
        "references/shared/universal_patterns/organization_security_and_examples.md",
        "references/shared/code_organization/overview_and_module_organization.md",
        "references/shared/code_organization/imports_and_exports.md",
        "references/shared/code_organization/directory_and_test_conventions.md",
        "assets/checklists/agent_authoring.md",
        "assets/checklists/command_authoring.md",
        "assets/checklists/skill_authoring.md",
        "assets/checklists/mcp_server_authoring.md",
    ],
    "CODE_QUALITY": [
        "assets/checklists/universal_checklist.md",
        "assets/checklists/javascript_checklist.md",
        "assets/checklists/typescript_checklist.md",
        "assets/checklists/python_checklist.md",
        "assets/checklists/shell_checklist.md",
        "assets/checklists/rust_checklist/overview_and_p0_parity.md",
        "assets/checklists/rust_checklist/p0_safety_and_boundary_discipline.md",
        "assets/checklists/rust_checklist/p1_required.md",
        "assets/checklists/rust_checklist/p2_evidence_validation_and_resources.md",
    ],
    "VERIFICATION": [
        "references/shared/alignment_verification_automation.md",
        "assets/scripts/README.md",
    ],
    "HOOKS": [
        "references/shared/hooks.md",
    ],
    "CONFIG": [
        "references/config/style_guide.md",
        "references/config/quality_standards.md",
        "references/config/quick_reference.md",
        "assets/checklists/config_checklist.md",
    ],
    "JAVASCRIPT": [
        "references/javascript/style_guide.md",
        "references/javascript/quality_standards/overview_modules_and_docs.md",
        "references/javascript/quality_standards/security_testing_and_exemptions.md",
        "references/javascript/quick_reference.md",
    ],
    "TYPESCRIPT": [
        "references/typescript/style_guide/overview_strict_and_naming.md",
        "references/typescript/style_guide/formatting_imports_and_coexistence.md",
        "references/typescript/quality_standards/overview_and_type_system.md",
        "references/typescript/quality_standards/tsdoc_errors_and_async.md",
        "references/typescript/quality_standards/tsconfig_and_modules.md",
        "references/typescript/quick_reference/template_naming_and_types.md",
        "references/typescript/quick_reference/imports_errors_and_tsconfig.md",
    ],
    "PYTHON": [
        "references/python/style_guide.md",
        "references/python/quality_standards.md",
        "references/python/quick_reference.md",
    ],
    "SHELL": [
        "references/shell/style_guide/overview_structure_and_naming.md",
        "references/shell/style_guide/variables_functions_and_output.md",
        "references/shell/quality_standards/overview_and_priority_blockers.md",
        "references/shell/quality_standards/validation_security_and_shellcheck.md",
        "references/shell/quick_reference/template_variables_and_loops.md",
        "references/shell/quick_reference/functions_strings_and_checklist.md",
    ],
    "RUST": [
        "references/rust/style_guide/overview_and_file_header.md",
        "references/rust/style_guide/toolchain_and_project_structure.md",
        "references/rust/style_guide/naming_conventions.md",
        "references/rust/style_guide/formatting_and_imports.md",
        "references/rust/style_guide/commenting_and_rustdoc.md",
        "references/rust/style_guide/interop_model.md",
        "references/rust/style_guide/interop_errors_and_parity.md",
        "references/rust/quality_standards/overview_and_data_ownership.md",
        "references/rust/quality_standards/modeling_collections_and_api.md",
        "references/rust/quality_standards/docs_errors_and_async.md",
        "references/rust/quality_standards/build_and_organization.md",
        "references/rust/quality_standards/determinism_and_parity.md",
        "references/rust/quick_reference/overview_and_boundary_template.md",
        "references/rust/quick_reference/naming_ordering_and_signatures.md",
        "references/rust/quick_reference/collections_imports_and_errors.md",
        "references/rust/quick_reference/rustdoc_and_cargo.md",
        "references/rust/quick_reference/determinism_parity_and_related.md",
    ],
}
```

## 3. SURFACE STANDARDS (the non-negotiables)

- **Plugins never write to the TUI.** OpenCode plugins must not print to the process stdout/stderr (no overlay on the chat input); user/agent-visible output goes through system-context injection, tools, or append-only log files; DEBUG-gated stderr is allowed only behind an env flag. See `references/javascript/quality_standards/overview_modules_and_docs.md` and the plugin exemption tier.
- **Descriptors are load-bearing.** `graph-metadata.json` / `description.json` shape drives discovery; validate JSON/JSONC against `references/config/quality_standards.md`.
- **Alignment drift is a verification gate.** System-code changes re-run the alignment verifier (`references/shared/alignment_verification_automation.md`) before any completion claim.
- **Rust preserves the TypeScript contract.** Rust napi-rs, WASM/WASI, and sidecar modules are compatibility implementations, not independent behavior authorities. JS-visible bytes, six-decimal numeric behavior, comparator tie-breaks, deterministic IDs, collection order, DTOs, and error shapes must remain identical to the TypeScript oracle.
- **Touched-language set, not one-per-task.** Most `.opencode/` tasks touch a single language — keep that slice tight and lean on the shared tier for cross-language rules. An interop task that spans a language pair (a napi-rs / WASM / sidecar Rust module held to its TypeScript oracle) legitimately touches both languages: the router slices to the set the task actually touches and loads both trios plus the shared tier, because you cannot hold Rust byte-identical to TypeScript without seeing both standards.

## 4. ASSETS AND OTHER SURFACE AREAS — on-demand

Component authoring (`assets/checklists/`): `skill_authoring.md`, `agent_authoring.md`, `command_authoring.md`, `mcp_server_authoring.md`

Language quality gates (`assets/checklists/`): `universal_checklist.md`, `typescript_checklist.md`, `python_checklist.md`, `shell_checklist.md`, `javascript_checklist.md`, `rust_checklist/` (split into topic parts), `config_checklist.md`

Verifier assets (`assets/scripts/`): alignment-drift and stack-folder verifier scripts used by this surface.

Changelog directories (`changelog/`): real skill and packet changelog files are part of the OpenCode surface inventory, not out-of-scope documentation noise.

Daemon IPC/socket wiring: daemon-backed CLIs and plugin bridges resolve runtime Unix socket paths such as `daemon-ipc.sock`; sockets are runtime artifacts, so checked-in evidence lives in launcher, bridge, and config files rather than in committed `.sock` files.

Spec-folder authoring lives in system-spec-kit (`references/workflows/spec_folder_write_recipe.md` + `spec_folder_authoring_checklist.md`), not in this surface. Checklists are pulled on demand by the active workflow phase.
