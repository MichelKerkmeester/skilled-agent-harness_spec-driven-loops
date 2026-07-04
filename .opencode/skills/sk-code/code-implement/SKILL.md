---
name: code-implement
description: Research + surface-aware implementation for the sk-code family; WEBFLOW/OPENCODE authoring; Motion.dev overlay.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]
version: 1.0.0.1
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-implement, implement, implementation, webflow, opencode, motion.dev, authoring, surface-router, phase-1, research -->

# Code Implement (implement)

`implement` is the mutating build mode in the `sk-code` family. It owns Phase 0 research and Phase 1 implementation, consumes the shared surface router, loads only the implementation resources for the resolved surface, and hands off quality, debugging, and verification to sibling modes.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the work involves:
- Writing, modifying, refactoring, or building code in a supported `sk-code` surface.
- Implementing a feature, script, component, module, fallback, parameter, authoring packet, or runtime behavior.
- Researching unfamiliar or risky code before changing it.
- Loading WEBFLOW authoring patterns for HTML, CSS, JavaScript, browser behavior, CDN/minification, or frontend animation work.
- Loading OPENCODE authoring patterns for `.opencode/` skills, agents, commands, hooks, MCP/server code, scripts, tests, JSON/JSONC config, TypeScript, JavaScript, Python, or Shell.
- Consuming Motion.dev API, snippet, decision, or performance references as an overlay after the surface has already been resolved.

**Keyword Triggers**: "implement", "build", "create", "modify", "refactor", "feature", "component", "script", "module", "authoring", "Webflow", "OpenCode", "Motion.dev", "add a flag", "add a fallback", "add a parameter", "smooth-scroll", "IntersectionObserver".

### When NOT to Use

**Skip this mode when:**
- The implementation is already written and the task is to apply author-side P0/P1/P2 checks, comment hygiene, or surface checklists. Use `code-quality`.
- The dominant task is root-cause debugging of a failing symptom. Use `code-debug`.
- The task is to collect verification evidence without workspace mutation. Use `code-verify`.
- The user asks for findings-first review output, PR review, or severity-ranked risks. Use `code-review`.
- The change is documentation-only prose with no executable behavior or routing algorithm change. Use `sk-doc`.

---

## 2. SMART ROUTING

### Shared Surface Contract

Surface identity is decided once by the `sk-code` shared router. This mode **consumes** the resolved surface and does not re-detect or override it. The shared authorities are:

- [`../shared/references/stack_detection.md`](../shared/references/stack_detection.md) - WEBFLOW / OPENCODE / UNKNOWN detection, OPENCODE precedence, and OPENCODE language sub-detection.
- [`../shared/references/smart_routing.md`](../shared/references/smart_routing.md) - intent scoring, load tiers, and surface-to-resource maps.
- [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) - lifecycle position for research, implementation, quality, debugging, and verification.
- [`../shared/references/universal/code_quality_standards.md`](../shared/references/universal/code_quality_standards.md) - the Design Restraint Ladder and universal quality contract that implementation must respect before handing off.

The hub loads this packet only after `workflowMode = implement` resolves through [`../mode-registry.json`](../mode-registry.json). This packet owns implementation workflow and packet-local resource selection, not hub routing.

### Mode-Internal Resource Loading

Load the smallest set that can safely author the change. Do not load whole directories unless an explicit deep-dive asks for a directory-level survey.

| Resolved surface / intent | Load before writing | Load when the task needs it |
| --- | --- | --- |
| ANY implementation | [`../shared/references/universal/code_quality_standards.md`](../shared/references/universal/code_quality_standards.md), especially the Design Restraint Ladder; [`../shared/references/universal/code_style_guide.md`](../shared/references/universal/code_style_guide.md) when naming or structure is touched | [`../shared/references/universal/multi_agent_research.md`](../shared/references/universal/multi_agent_research.md) for broad/risky research; [`../shared/references/universal/error_recovery.md`](../shared/references/universal/error_recovery.md) only when implementation hits a failure that needs escalation discipline |
| WEBFLOW implementation | [`references/webflow/implementation/implementation_workflows.md`](references/webflow/implementation/implementation_workflows.md), [`references/webflow/implementation/animation_workflows.md`](references/webflow/implementation/animation_workflows.md), [`references/webflow/implementation/performance_patterns.md`](references/webflow/implementation/performance_patterns.md) | [`references/webflow/implementation/async_patterns.md`](references/webflow/implementation/async_patterns.md), [`observer_patterns.md`](references/webflow/implementation/observer_patterns.md), [`security_patterns.md`](references/webflow/implementation/security_patterns.md), [`third_party_integrations.md`](references/webflow/implementation/third_party_integrations.md), [`webflow_patterns.md`](references/webflow/implementation/webflow_patterns.md) |
| WEBFLOW JavaScript | [`references/webflow/javascript/style_guide.md`](references/webflow/javascript/style_guide.md), [`references/webflow/javascript/quality_standards.md`](references/webflow/javascript/quality_standards.md), [`references/webflow/javascript/quick_reference.md`](references/webflow/javascript/quick_reference.md) | [`assets/webflow/patterns/`](assets/webflow/patterns/) and [`assets/webflow/integrations/`](assets/webflow/integrations/) for exact reusable patterns |
| WEBFLOW CSS | [`references/webflow/css/style_guide.md`](references/webflow/css/style_guide.md), [`references/webflow/css/quality_standards.md`](references/webflow/css/quality_standards.md), [`references/webflow/css/quick_reference.md`](references/webflow/css/quick_reference.md) | [`references/webflow/css/patterns.md`](references/webflow/css/patterns.md) and [`assets/webflow/templates/component_template.css`](assets/webflow/templates/component_template.css) for component scaffolds |
| WEBFLOW HTML / embed | [`references/webflow/html/style_guide.md`](references/webflow/html/style_guide.md), [`references/webflow/html/quality_standards.md`](references/webflow/html/quality_standards.md) | [`assets/webflow/templates/embed_template.html`](assets/webflow/templates/embed_template.html), [`head_footer_code_template.html`](assets/webflow/templates/head_footer_code_template.html), [`form_scaffold_template.html`](assets/webflow/templates/form_scaffold_template.html) |
| WEBFLOW deployment / CDN | [`references/webflow/deployment/cdn_deployment.md`](references/webflow/deployment/cdn_deployment.md), [`references/webflow/deployment/minification_guide.md`](references/webflow/deployment/minification_guide.md) | [`references/webflow/deployment/webflow_staging_production.md`](references/webflow/deployment/webflow_staging_production.md), [`assets/webflow/scripts/README.md`](assets/webflow/scripts/README.md) |
| WEBFLOW performance | [`references/webflow/performance/resource_loading.md`](references/webflow/performance/resource_loading.md), [`references/webflow/performance/webflow_constraints.md`](references/webflow/performance/webflow_constraints.md) | [`interaction_gated_loading.md`](references/webflow/performance/interaction_gated_loading.md), [`cwv_remediation.md`](references/webflow/performance/cwv_remediation.md), [`third_party.md`](references/webflow/performance/third_party.md) |
| OPENCODE base | [`../shared/references/opencode-shared/universal_patterns.md`](../shared/references/opencode-shared/universal_patterns.md), [`../shared/references/opencode-shared/code_organization.md`](../shared/references/opencode-shared/code_organization.md) | [`../shared/references/opencode-shared/hooks.md`](../shared/references/opencode-shared/hooks.md) when hook behavior changes |
| OPENCODE authoring | The language-specific references from the table below | At write-time, load the matching authoring checklist from [`../code-quality/assets/opencode-checklists/`](../code-quality/assets/opencode-checklists/) and load [`spec_folder_write_recipe.md`](../../system-spec-kit/references/workflows/spec_folder_write_recipe.md) (system-spec-kit) for spec-folder writes |
| MOTION_DEV overlay | [`references/motion_dev/quick_start.md`](references/motion_dev/quick_start.md), [`animation_principles.md`](references/motion_dev/animation_principles.md), [`integration_patterns.md`](references/motion_dev/integration_patterns.md), [`decision_matrix.md`](references/motion_dev/decision_matrix.md) | [`animate_and_timelines.md`](references/motion_dev/animate_and_timelines.md), [`scroll_and_gestures.md`](references/motion_dev/scroll_and_gestures.md), [`performance_and_pitfalls.md`](references/motion_dev/performance_and_pitfalls.md), [`assets/motion_dev/snippets/README.md`](assets/motion_dev/snippets/README.md), and exact snippet assets |
| UNKNOWN | Shared detection and universal references only | Ask for the active runtime surface and verification command set before implementing |

### OPENCODE Language Sub-Detection

After the shared router resolves `OPENCODE`, implementation must select language resources by target or changed file extension first, then by explicit language wording when extensions are absent.

| Language sub-key | Extensions / signals | Implement-owned references |
| --- | --- | --- |
| JAVASCRIPT | `.js`, `.mjs`, `.cjs`, CommonJS, Node-oriented OpenCode scripts | [`references/opencode/javascript/quick_reference.md`](references/opencode/javascript/quick_reference.md), [`style_guide.md`](references/opencode/javascript/style_guide.md), [`quality_standards.md`](references/opencode/javascript/quality_standards.md) |
| TYPESCRIPT | `.ts`, `.tsx`, `.mts`, `.d.ts`, `tsconfig`, interfaces | [`references/opencode/typescript/quick_reference.md`](references/opencode/typescript/quick_reference.md), [`style_guide.md`](references/opencode/typescript/style_guide.md), [`quality_standards.md`](references/opencode/typescript/quality_standards.md) |
| PYTHON | `.py`, pytest, argparse, docstrings | [`references/opencode/python/quick_reference.md`](references/opencode/python/quick_reference.md), [`style_guide.md`](references/opencode/python/style_guide.md), [`quality_standards.md`](references/opencode/python/quality_standards.md) |
| SHELL | `.sh`, `.bash`, shebangs, shell hooks | [`references/opencode/shell/quick_reference.md`](references/opencode/shell/quick_reference.md), [`style_guide.md`](references/opencode/shell/style_guide.md), [`quality_standards.md`](references/opencode/shell/quality_standards.md) |
| CONFIG | `.json`, `.jsonc`, schema, descriptor, frontmatter-adjacent config | [`references/opencode/config/quick_reference.md`](references/opencode/config/quick_reference.md), [`style_guide.md`](references/opencode/config/style_guide.md), [`quality_standards.md`](references/opencode/config/quality_standards.md) |

When a task touches multiple OPENCODE languages, load each touched language set plus the shared OPENCODE base. Do not use OPENCODE language standards for WEBFLOW browser behavior.

### OpenCode Authoring Checklist Load Contract

For `.opencode/` authoring, implementation loads the relevant checklist **before the first write**, not only during review. The checklists are owned by `code-quality`; this mode points to them at write-time and then hands off to `code-quality` for the full author-side quality gate.

| Target | Authoring checklist | Recipe |
| --- | --- | --- |
| Skill packet or skill file | [`../code-quality/assets/opencode-checklists/skill_authoring.md`](../code-quality/assets/opencode-checklists/skill_authoring.md) | n/a |
| Agent file | [`../code-quality/assets/opencode-checklists/agent_authoring.md`](../code-quality/assets/opencode-checklists/agent_authoring.md) | n/a |
| Command file | [`../code-quality/assets/opencode-checklists/command_authoring.md`](../code-quality/assets/opencode-checklists/command_authoring.md) | n/a |
| MCP server source | [`../code-quality/assets/opencode-checklists/mcp_server_authoring.md`](../code-quality/assets/opencode-checklists/mcp_server_authoring.md) | n/a |
| Spec-folder authored docs | [`spec_folder_authoring_checklist.md`](../../system-spec-kit/references/workflows/spec_folder_authoring_checklist.md) (system-spec-kit) | [`spec_folder_write_recipe.md`](../../system-spec-kit/references/workflows/spec_folder_write_recipe.md) (system-spec-kit) |

---

## 3. HOW IT WORKS

### Phase 0: Research

Run research before changing unfamiliar, high-blast, security-sensitive, config-sensitive, or multi-file code. For simple and well-localized edits, Phase 0 can be brief, but it still includes reading the actual target file before writing.

Research sequence:
- Read the target files first. Do not edit a file you have not read in this session.
- Read nearby conventions, callers, and existing examples before introducing new shapes.
- Resolve surface identity through the shared router, then load the minimum resource set from Section 2.
- For OPENCODE, select language references before applying language standards.
- For broad or risky changes, use [`../shared/references/universal/multi_agent_research.md`](../shared/references/universal/multi_agent_research.md) or a read-only `Task` sweep to map integration points before implementation.
- If `sk-design` handed off a UI build, read its manifest first and preserve locked values, signature moves, motion budget, reuse list, and never-change constraints.

### Pre-Write Restraint And Baseline

Before Phase 1, record two internal facts so sibling verification can report the delta:

- **Baseline**: the starting gate state you can cheaply observe, such as current failing command names, known failing tests, lint/type-check status, or base commit. If no command is safe or in scope yet, state what is unknown rather than inventing a clean baseline.
- **Blast-radius read**: one phrase such as `low-blast, reversible`, `medium-blast: multi-file behavior`, or `high-blast: touches auth/data/filesystem/config`.

Then apply the Design Restraint Ladder from [`../shared/references/universal/code_quality_standards.md`](../shared/references/universal/code_quality_standards.md): ask whether the code needs to exist, then prefer built-ins, native platform/runtime features, already-installed dependencies, one-line changes, and only then the minimum code that works. If a requested part looks unnecessary, implement the stated requirement and raise a scope-amendment recommendation; do not silently cut scope.

### Phase 1: Implementation

Implementation sequence:
- Make the smallest correct change that satisfies the request and the resolved surface standards.
- Preserve existing project conventions unless the request explicitly changes them.
- Keep changes within the user's scope and the established spec/documentation scope.
- Use existing helpers, templates, and patterns before adding new abstractions.
- Keep comments durable and explanatory; do not add ephemeral artifact labels in code comments.
- After writing, hand off to `code-quality` for author-side P0/P1/P2 checks, then to `code-debug` if checks or runtime behavior fail, then to `code-verify` for evidence.

This mode does not claim completion. Its output is an implemented workspace change plus a clear handoff path to quality and verification.

### WEBFLOW Authoring Workflow

Use this workflow when the shared router resolved `WEBFLOW`:

1. Load the Webflow implementation trio from Section 2 before authoring.
2. Read the target HTML, CSS, JavaScript, embed, or template file and nearby project patterns.
3. Load language overlays for touched file types. Webflow work often spans JavaScript, CSS, and HTML together.
4. Reuse Webflow patterns and assets for embeds, component scaffolds, waits, validation, interaction gates, performance loading, and vendor integrations.
5. Keep browser/runtime constraints in mind: CDN-safe initialization, duplicate-init guards, async loading, reduced motion, focus behavior, and resource timing.
6. If JavaScript bundle behavior changes, note the CDN/minification follow-up for `code-verify`; do not claim runtime success from static edits alone.
7. If Motion.dev is involved, load Motion.dev as a peer overlay while keeping Webflow-specific CDN, Designer, and browser constraints in Webflow references.

### OPENCODE Authoring Workflow

Use this workflow when the shared router resolved `OPENCODE`:

1. Confirm the target is under `.opencode/` or otherwise belongs to OpenCode system code.
2. Detect the language sub-key by extension before standards are applied.
3. Load shared OPENCODE patterns plus the selected language references.
4. For skills, agents, commands, MCP servers, or spec-folder docs, load the write-time checklist from `../code-quality/assets/opencode-checklists/` before the first write.
5. Preserve OpenCode config shapes, skill frontmatter, routing metadata, and packet ownership boundaries.
6. Keep generated metadata ownership intact. This mode must not add packet-local advisor metadata files.
7. Prepare the handoff for `code-quality` and `code-verify`, including changed scope and likely targeted checks, but do not claim final verification here.

### UNKNOWN Authoring Workflow

Use this workflow when the shared router resolved `UNKNOWN`:

1. Do not treat unsupported stacks as supported just because the intent is clear.
2. Ask one short disambiguation question that requests the active runtime surface, changed files, and verification command set.
3. If the user explicitly wants stack-agnostic Motion.dev guidance, load exact Motion.dev references and snippets only, and avoid WEBFLOW resources.
4. If a new supported route is needed, escalate for a route-plan decision instead of inventing standards inside this mode.

---

## 4. RULES

### ALWAYS

1. **ALWAYS read target files first** before editing, including skeletons and existing README/SKILL files.
2. **ALWAYS consume surface identity from the shared router** before loading packet-local implementation resources.
3. **ALWAYS detect OPENCODE language sub-key first** before applying JavaScript, TypeScript, Python, Shell, or Config standards.
4. **ALWAYS load OpenCode authoring checklists at write-time** for skills, agents, commands, MCP servers, and spec-folder writes.
5. **ALWAYS capture a baseline and one-phrase blast-radius read** before Phase 1 on non-trivial implementation work.
6. **ALWAYS apply the Design Restraint Ladder** before writing new code.
7. **ALWAYS build the simplest correct implementation** of the stated requirement and keep scope locked.
8. **ALWAYS hand off quality and verification explicitly** when the implementation is written.

### NEVER

1. **NEVER claim completion from this mode.** Phase 3 verification and Iron Law evidence belong to `code-verify`.
2. **NEVER treat unsupported stacks as supported.** Go, Next.js, React Native, Swift, generic Node.js, and other unregistered surfaces stay UNKNOWN.
3. **NEVER use OPENCODE standards for WEBFLOW browser behavior** or Webflow browser rules for `.opencode/` system code.
4. **NEVER silently cut scope because a requested piece looks unnecessary.** Implement as specified and raise a scope-amendment recommendation.
5. **NEVER add a packet-local `graph-metadata.json`.** The hub owns the single advisor identity.
6. **NEVER paste full reference-doc content into this contract.** Link to packet references and load them only when relevant.

### ESCALATE IF

1. **ESCALATE IF surface identity is ambiguous** after the shared router's inputs are read.
2. **ESCALATE IF implementation evidence conflicts with the approved spec or user instruction.** Stop for an amendment decision rather than shipping a workaround.
3. **ESCALATE IF the verification command set is unknown for an UNKNOWN surface** and the user expects a completion claim.
4. **ESCALATE IF a security-sensitive, filesystem, credential, or destructive behavior boundary is unclear.**

---

## 5. SUCCESS CRITERIA

An implementation handoff is ready when:
- The resolved surface and top implementation intent are known from the shared router.
- Target files were read before edits, and the resource set loaded matches the resolved surface.
- For OPENCODE work, language sub-detection selected the right language references.
- For OpenCode authoring, the matching `code-quality` authoring checklist was loaded before writing.
- The baseline and blast-radius read are available for verification delta reporting when the work is non-trivial.
- The implementation is the smallest correct change that satisfies the stated requirement.
- Scope-amendment recommendations are explicit when the request includes unnecessary or risky work, but the stated scope was not silently narrowed.
- The next sibling handoff is clear: `code-quality` for author checks, `code-debug` for failures, and `code-verify` for final evidence.

---

## 6. INTEGRATION POINTS

### Sibling Modes

- **`code-quality`** receives the implemented change for P0/P1/P2 author checks, comment hygiene, and surface checklists. It owns the OpenCode authoring checklists this mode loads at write-time.
- **`code-debug`** receives failing checks or runtime symptoms and traces root cause without broad rewrites.
- **`code-verify`** owns Phase 3 evidence, mutation/falsifier discipline, and completion claims.
- **`code-review`** owns findings-first review output for PRs, security/correctness baselines, and severity-ranked findings.

### Related Skills

- **`sk-design`** can hand a built or specified UI to this mode through its handoff manifest. This mode implements the locked tokens, signature moves, motion budget, reuse list, risks, and never-change constraints rather than redesigning them.
- **`system-spec-kit`** owns spec gates, spec-folder discipline, validation, memory, and context preservation. This mode consumes the established spec context and must not create packet-local metadata files.
- **`sk-git`** owns branches, commits, PRs, merges, and finish workflow after code work is verified.
- **`sk-doc`** owns documentation-only markdown quality when no code-work contract is present.

---

## 7. REFERENCES

### Shared Router References

- [`../shared/references/stack_detection.md`](../shared/references/stack_detection.md) - surface detection and OPENCODE language sub-detection.
- [`../shared/references/smart_routing.md`](../shared/references/smart_routing.md) - intent model, load tiers, resource maps, and UNKNOWN fallback.
- [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) - lifecycle transitions and phase responsibilities.
- [`../shared/references/universal/code_quality_standards.md`](../shared/references/universal/code_quality_standards.md) - Design Restraint Ladder and universal severity model.
- [`../shared/references/universal/code_style_guide.md`](../shared/references/universal/code_style_guide.md) - cross-surface naming, formatting, structure, and comment hygiene principles.

### Implement-Owned References

- [`references/webflow/implementation/implementation_workflows.md`](references/webflow/implementation/implementation_workflows.md) - WEBFLOW implementation workflow entry point.
- [`references/webflow/implementation/animation_workflows.md`](references/webflow/implementation/animation_workflows.md) - WEBFLOW animation authoring patterns.
- [`references/webflow/implementation/performance_patterns.md`](references/webflow/implementation/performance_patterns.md) - WEBFLOW performance-safe implementation patterns.
- [`references/webflow/javascript/quick_reference.md`](references/webflow/javascript/quick_reference.md), [`references/webflow/css/quick_reference.md`](references/webflow/css/quick_reference.md), and [`references/webflow/html/style_guide.md`](references/webflow/html/style_guide.md) - per-file-type WEBFLOW authoring guidance.
- [`references/opencode/javascript/quick_reference.md`](references/opencode/javascript/quick_reference.md), [`references/opencode/typescript/quick_reference.md`](references/opencode/typescript/quick_reference.md), [`references/opencode/python/quick_reference.md`](references/opencode/python/quick_reference.md), [`references/opencode/shell/quick_reference.md`](references/opencode/shell/quick_reference.md), and [`references/opencode/config/quick_reference.md`](references/opencode/config/quick_reference.md) - OPENCODE language entry points.
- [`references/motion_dev/quick_start.md`](references/motion_dev/quick_start.md), [`references/motion_dev/integration_patterns.md`](references/motion_dev/integration_patterns.md), [`references/motion_dev/decision_matrix.md`](references/motion_dev/decision_matrix.md), and [`references/motion_dev/performance_and_pitfalls.md`](references/motion_dev/performance_and_pitfalls.md) - Motion.dev overlay guidance.
- [`assets/webflow/templates/README.md`](assets/webflow/templates/README.md), [`assets/webflow/patterns/README.md`](assets/webflow/patterns/README.md), [`assets/webflow/integrations/README.md`](assets/webflow/integrations/README.md), and [`assets/motion_dev/snippets/README.md`](assets/motion_dev/snippets/README.md) - reusable authoring assets.
- [`spec_folder_write_recipe.md`](../../system-spec-kit/references/workflows/spec_folder_write_recipe.md) - implementation-time recipe for spec-folder writes (owned by system-spec-kit).

### Cross-Packet Quality Assets

- [`../code-quality/assets/opencode-checklists/skill_authoring.md`](../code-quality/assets/opencode-checklists/skill_authoring.md)
- [`../code-quality/assets/opencode-checklists/agent_authoring.md`](../code-quality/assets/opencode-checklists/agent_authoring.md)
- [`../code-quality/assets/opencode-checklists/command_authoring.md`](../code-quality/assets/opencode-checklists/command_authoring.md)
- [`../code-quality/assets/opencode-checklists/mcp_server_authoring.md`](../code-quality/assets/opencode-checklists/mcp_server_authoring.md)
- [`spec_folder_authoring_checklist.md`](../../system-spec-kit/references/workflows/spec_folder_authoring_checklist.md) (owned by system-spec-kit)

---
