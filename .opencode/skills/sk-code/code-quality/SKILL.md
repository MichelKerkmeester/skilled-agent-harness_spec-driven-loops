---
name: code-quality
description: Quality gate for sk-code after implementation and before verification; applies P0/P1/P2 author checks, comment hygiene, and surface checklists.
allowed-tools: [Read, Edit, Bash, Grep, Glob]
version: 1.0.0.1
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-quality, quality gate, phase 1.5, comment hygiene, authoring checklist, p0, p1, p2, opencode checklist, webflow checklist, surface standards -->

# Code Quality (quality)

`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the surface skill (`code-webflow` / `code-opencode`) implements changes and before the surface's verification workflow or done-claim. It consumes the shared surface router, loads the right checklist for the detected surface and target path, fixes quality-gate failures in place, and leaves findings-only output to `code-review`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this mode when the request involves:
- Running the post-implementation quality gate before a completion claim.
- Applying P0/P1/P2 author-side checks to changed code, scripts, skills, agents, commands, MCP servers, or spec docs.
- Checking comment hygiene on modified files and removing ephemeral artifact references from comments while preserving durable WHY.
- Loading an OpenCode authoring checklist for `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/`, `.opencode/specs/`, MCP server source, or language-specific OpenCode files.
- Applying Webflow/frontend quality standards after implementation and before runtime verification.
- Fixing quality-gate failures in place with `Edit` when the fix belongs to the already-authored file.

Keyword triggers: `quality gate`, `code quality`, `comment hygiene`, `surface checklist`, `P0`, `P1`, `P2`, `authoring checklist`, `OpenCode checklist`, `skill authoring`, `agent authoring`, `command authoring`, `MCP server authoring`, `spec folder authoring`, `check before done`.

### When NOT to Use

Skip this mode when:
- The user needs code written, files scaffolded, or behavior implemented. Use the appropriate surface skill (`code-webflow` / `code-opencode`) and its implementation workflow.
- A failure needs symptom-to-root-cause investigation or a single-cause bug fix. Use the surface's debugging workflow (`workflow_debug.md`).
- The task is to collect final non-mutating verification evidence. Use the surface's verification workflow (`workflow_verify.md`).
- The user asks for findings-first review output, severity-ranked findings, or PR review. Use `code-review`.
- The task is documentation-only prose with no code-work contract. Use `sk-doc`.

### Family Boundary

This is an independently invokable member of the `sk-code` family. It owns the quality gate, not implementation planning, debugging, verification evidence, or formal review reporting. It may edit files that the surface skill already changed to satisfy gate failures, but it does not create new files and does not dispatch subagents.

Pairs well with:
- The surface skill (`code-webflow` / `code-opencode`) immediately before this gate, because implementation writes the files this mode checks.
- The surface's debugging workflow (`workflow_debug.md`) when a quality failure reveals a functional bug or failing command.
- The surface's verification workflow (`workflow_verify.md`) after P0 quality issues are clear, because verification gates the final claim.
- `code-review` when the user wants findings-only output rather than author-side correction.

---

## 2. SMART ROUTING

### Primary Detection Signal

Surface identity is resolved once by the parent shared router. This mode consumes that result and then routes by target path and quality intent:

```text
QUALITY TASK
    |
    +- Surface identity -> ../shared/references/stack_detection.md
    +- Phase lifecycle  -> ../shared/references/phase_detection.md
    +- Resource routing -> ../shared/references/smart_routing.md
    |
    +- WEBFLOW target     -> assets/code_quality_checklist.md + shared web standards
    +- OPENCODE target    -> assets/checklists/<target-checklist>.md
    +- Comment hygiene    -> scripts/check-comment-hygiene.sh per modified file
    +- Dist staleness     -> scripts/check-dist-staleness.sh when generated artifacts are involved
```

### Phase Detection

```text
Phase 1 Implementation writes or changes files
    -> Phase 1.5 Code Quality Gate runs here
        -> load quality checklist before any completion claim
        -> select target-path authoring checklist
        -> run comment hygiene on every modified file
        -> apply P0/P1/P2 author checks
        -> edit in place only for gate failures
    -> Phase 2 Debugging if checks expose a failing symptom
    -> Phase 3 Verification after the gate is clean enough to verify
```

### Resource Domains

- `assets/code_quality_checklist.md` is the Webflow/frontend quality checklist and the general post-implementation quality gate.
- `assets/checklists/` contains OpenCode authoring checklists for skills, agents, commands, MCP servers, spec folders, language files, and config.
- `scripts/check-comment-hygiene.sh` is the per-file comment-hygiene gate.
- `scripts/check-dist-staleness.sh` checks generated/distribution artifact drift when that is part of the target.
- `scripts/hooks/claude-posttooluse.sh` is the write-time warning hook for comment hygiene.
- `../shared/references/universal/code_quality_standards.md` and `../shared/references/universal/code_style_guide.md` define shared standards consumed by this packet.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any quality-gate invocation | `../shared/references/stack_detection.md`, `../shared/references/smart_routing.md`, `../shared/references/phase_detection.md` |
| ALWAYS | Before any implementation-done claim | `assets/code_quality_checklist.md`, `../shared/references/universal/code_quality_standards.md`, `../shared/references/universal/code_style_guide.md` |
| ALWAYS | Any modified file with comments or comment-capable syntax | `scripts/check-comment-hygiene.sh` |
| CONDITIONAL | `.opencode/skills/` target | `assets/checklists/skill_authoring.md` |
| CONDITIONAL | `.opencode/agents/` target | `assets/checklists/agent_authoring.md` |
| CONDITIONAL | `.opencode/commands/` target | `assets/checklists/command_authoring.md` |
| CONDITIONAL | `.opencode/specs/` target | `../../system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` (system-spec-kit) |
| CONDITIONAL | MCP server source | `assets/checklists/mcp_server_authoring.md` |
| CONDITIONAL | OpenCode JavaScript, TypeScript, Python, Shell, JSON, or JSONC files | `assets/checklists/javascript_checklist.md`, `assets/checklists/typescript_checklist.md`, `assets/checklists/python_checklist.md`, `assets/checklists/shell_checklist.md`, `assets/checklists/config_checklist.md` as applicable |
| CONDITIONAL | Generated distribution artifacts or mirrored outputs changed | `scripts/check-dist-staleness.sh` |
| ON_DEMAND | Need hook behavior details | `scripts/hooks/claude-posttooluse.sh` |

### Target-Path Checklist Map

| Target Path | Authoring Checklist | Gate Behavior |
| --- | --- | --- |
| `.opencode/skills/` | `assets/checklists/skill_authoring.md` | Check frontmatter, section structure, resource layout, routing, version, allowed tools, and validation path. |
| `.opencode/agents/` | `assets/checklists/agent_authoring.md` | Check agent frontmatter, prompt boundary, tool access, and role clarity. |
| `.opencode/commands/` | `assets/checklists/command_authoring.md` | Check command metadata, arguments, routing, and execution contract. |
| `.opencode/specs/` | `../../system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` (system-spec-kit) | Check spec-folder structure and packet-document consistency. |
| MCP server source | `assets/checklists/mcp_server_authoring.md` | Check tool contracts, input/output schemas, transport assumptions, and failure handling. |
| OpenCode language/config files | language/config checklist in `assets/checklists/` | Check language-specific quality and style expectations. |
| Webflow/frontend files | `assets/code_quality_checklist.md` | Check frontend style, maintainability, headers, comments, and platform expectations. |

### Comment-Hygiene Enforcement Gates

This mode owns the author-side check and knows the three independent enforcement layers:

| Gate | Where | Effect |
| --- | --- | --- |
| Write-time warning | `scripts/hooks/claude-posttooluse.sh` | Warns during authoring when a comment carries ephemeral artifact labels. |
| Pre-commit block | `.opencode/hooks/pre-commit` | Blocks commits with forbidden comment patterns across runtimes. |
| CI block | `.github/workflows/comment-hygiene.yml` | Blocks pull requests with forbidden comment patterns. |

Note that the `.opencode/hooks/pre-commit` hook additionally enforces a staged agent-mirror-sync drift gate, independent of comment hygiene, documented in `.opencode/hooks/README.md`.

Run `scripts/check-comment-hygiene.sh <file>` on each modified file that can contain comments. Zero violations are required before a quality pass.

### 2b. Machine-Readable Router (thin, Type-1 benchmark)

code-quality routes primarily by TARGET PATH (the surface + checklist map above), verified by a unit test — not by prompt keywords. Its parent-to-child discoverability is the hub `quality` signal. This thin prompt-intent projection exists only so the deterministic skill-benchmark router-replay can score code-quality's one routable checklist in Mode-A; it deliberately does not model the path-keyed dispatch.

```python
# Thin prompt-intent router: code-quality owns a single routable checklist. Its
# real routing is target-path-keyed (the checklist map above, covered by a unit
# test) and its parent discoverability is the hub quality signal — this block only
# makes the one asset scoreable by the deterministic router-replay.
DEFAULT_RESOURCE = [
    "assets/code_quality_checklist.md",
]

INTENT_SIGNALS = {
    "QUALITY": {"weight": 1, "keywords": ["quality gate", "comment hygiene", "p0 p1 p2", "code smell", "dist staleness", "naming", "standards", "checklist", "author quality gate"]},
}

RESOURCE_MAP = {
    "QUALITY": ["assets/code_quality_checklist.md"],
}
```

---

## 3. HOW IT WORKS

### Quality Gate Workflow

1. Resolve the surface and lifecycle state through the shared router. If no implementation changed files yet, route to the appropriate surface skill (`code-webflow` / `code-opencode`) unless the user explicitly asked for a standalone quality audit.
2. Collect the changed-file set from the task context or targeted paths. Read each target before editing.
3. Load `assets/code_quality_checklist.md` before any completion claim, then load the target-path checklist from `assets/checklists/` when the target is OpenCode-owned.
4. Run `scripts/check-comment-hygiene.sh <file>` for every modified comment-capable file.
5. Apply the P0/P1/P2 model: P0 blocks completion, P1 should be fixed before handoff unless explicitly accepted, P2 can be documented when there is a clear reason.
6. Fix gate failures in place with `Edit` when the correction is limited to already-authored files.
7. If a gate failure requires new files, broader implementation, or behavior design, hand back to the surface skill (`code-webflow` / `code-opencode`).
8. If a gate failure is caused by an unclear runtime failure, hand to the surface's debugging workflow (`workflow_debug.md`) with the observed command, output, and failing target.
9. When P0 items are clear, hand to the surface's verification workflow (`workflow_verify.md`) for non-mutating evidence before any done-claim.

### P0/P1/P2 Author Checks

| Severity | Meaning | Gate Effect |
| --- | --- | --- |
| P0 | Correctness, safety, broken contract, forbidden comment metadata, unchecked generated drift, or missing required checklist evidence | Blocks completion until fixed or escalated. |
| P1 | Maintainability, routing, style, or authoring-contract issue likely to confuse future work | Fix before handoff unless the user accepts a documented risk. |
| P2 | Local polish, clarity, or minor consistency issue with low behavioral risk | Fix when cheap; otherwise document the deferral and why it is safe. |

### Author-Side, Not Review-Side

Quality mode is allowed to edit because it is part of the implementation lifecycle. It should leave the workspace better than it found it, but only inside the current scope. If the requested output is a review report, use `code-review`; if the requested output is evidence that commands pass, use the surface's verification workflow (`workflow_verify.md`).

### Comment Hygiene

Comments should explain durable WHY and constraints. They must not embed temporary artifact labels, spec paths, packet labels, ticket labels, or phase bookkeeping. When this mode finds a violation, it edits the comment to preserve the durable reason or removes the comment if it has no durable value.

### Advisory Evidence-Handoff Envelope

When the orchestrator or surface workflow requests structured evidence, append this advisory envelope after the prose handoff. Never place it in a position that reads as a status verdict, and never let it stand in for the handoff to the surface's verification workflow (`workflow_verify.md`).

```text
CODE_QUALITY_RESULT v1
schema_version: code-quality/v1
status: advisory
modified_files: <repo-relative paths, or none>
resolved_surface: <webflow | opencode | unknown>
checklists_loaded: <checklist paths loaded, or none>
checker_outputs: <comment-hygiene and dist-staleness results, or N/A>
p0_p1_p2_decisions: <per-severity dispositions>
accepted_deferrals: <documented P1/P2 deferrals and why safe, or none>
verification_handoff: workflow_verify.md
remaining_accepted_risk: <one-line residual risk, or none>
```

This envelope is advisory and additive only: its `status` is fixed to `advisory` and MUST NOT be `pass`, `success`, or `done`. Its presence NEVER reads as a completion, done, works, or passing claim, and it never replaces the handoff to the surface's verification workflow (`workflow_verify.md`) — it reinforces, and does not relax, the §4 NEVER rule that this mode makes no passing claims.

---

## 4. RULES

### ALWAYS

1. Read target files before editing them.
2. Load `assets/code_quality_checklist.md` before any implementation-done or quality-pass claim.
3. Resolve surface identity through `../shared/references/stack_detection.md`; do not re-author surface detection in this packet.
4. Load the correct OpenCode authoring checklist by target path before checking `.opencode/` work.
5. Run `scripts/check-comment-hygiene.sh <file>` on each modified comment-capable file.
6. Fix P0 issues before handing to verification unless the only safe action is escalation.
7. Keep fixes scoped to quality-gate failures in files already in scope.
8. Hand failures that need root-cause investigation to the surface's debugging workflow (`workflow_debug.md`) with the exact symptom and evidence.

### NEVER

1. Never create new files; this mode has no `Write` authority.
2. Never dispatch subagents; this mode has no `Task` authority.
3. Never make completion, done, works, or passing claims; hand to the surface's verification workflow (`workflow_verify.md`) for evidence.
4. Never replace a formal findings-first review; route that to `code-review`.
5. Never paste or fork shared surface-detection, quality, or style references into this packet.
6. Never broaden scope into cleanup or refactor work unrelated to the gate failure.
7. Never allow ephemeral artifact labels in code comments; preserve durable WHY only.
8. Never add a packet-local `graph-metadata.json`.

### ESCALATE IF

1. Surface detection is ambiguous after reading `../shared/references/stack_detection.md`.
2. The correct checklist cannot be identified from the target path.
3. A P0 issue requires new files, new behavior, or scope beyond an in-place quality fix.
4. Comment-hygiene enforcement layers disagree on a blocking result.
5. Generated artifacts appear stale but the regeneration command is unknown or unsafe to run.

---

## 5. SUCCESS CRITERIA

- The quality gate ran after implementation and before verification.
- Surface identity came from the shared router, not packet-local detection logic.
- `assets/code_quality_checklist.md` was loaded before any quality-pass claim.
- The correct `assets/checklists/*` authoring checklist was loaded for OpenCode targets.
- `scripts/check-comment-hygiene.sh` ran for each modified comment-capable file and reported zero violations or a documented escalation.
- P0 issues are fixed in place or escalated with evidence; P1/P2 handling is explicit.
- No new files were authored by this mode.
- Handoff to the surface's verification workflow (`workflow_verify.md`) includes the quality evidence and any remaining accepted risk.

---

## 6. INTEGRATION POINTS

- `sk-code` routes quality prompts here through `mode-registry.json` and keeps the hub routing-only.
- `code-webflow` / `code-opencode` implements or changes files before this gate runs, owns root-cause debugging, and gathers verification evidence via the implement → debug → verify workflow doctrine.
- `code-review` owns findings-first review output and PR-style severity reporting.
- `system-spec-kit` owns spec-folder documentation, validation, and memory workflows when the broader task requires them.

---

## 7. REFERENCES

### Parent And Shared Router

- [`../SKILL.md`](../SKILL.md) - Routing-only parent hub.
- [`../mode-registry.json`](../mode-registry.json) - Source of truth for mode tool surfaces and packet identity.
- [`../shared/references/stack_detection.md`](../shared/references/stack_detection.md) - Shared surface detection consumed by every mode.
- [`../shared/references/smart_routing.md`](../shared/references/smart_routing.md) - Shared intent and resource routing.
- [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) - Lifecycle transitions around the quality gate.

### Quality References And Assets

- [`assets/code_quality_checklist.md`](assets/code_quality_checklist.md) - Required quality checklist before implementation completion claims.
- [`assets/checklists/universal_checklist.md`](../code-opencode/assets/checklists/universal_checklist.md) - Universal OpenCode quality baseline.
- [`assets/checklists/skill_authoring.md`](../code-opencode/assets/checklists/skill_authoring.md) - Skill authoring checklist.
- [`assets/checklists/agent_authoring.md`](../code-opencode/assets/checklists/agent_authoring.md) - Agent authoring checklist.
- [`assets/checklists/command_authoring.md`](../code-opencode/assets/checklists/command_authoring.md) - Command authoring checklist.
- [`spec_folder_authoring_checklist.md`](../../system-spec-kit/references/workflows/spec_folder_authoring_checklist.md) - Spec folder authoring checklist (owned by system-spec-kit).
- [`assets/checklists/mcp_server_authoring.md`](../code-opencode/assets/checklists/mcp_server_authoring.md) - MCP server authoring checklist.
- [`assets/checklists/javascript_checklist.md`](../code-opencode/assets/checklists/javascript_checklist.md) - JavaScript checklist.
- [`assets/checklists/typescript_checklist.md`](../code-opencode/assets/checklists/typescript_checklist.md) - TypeScript checklist.
- [`assets/checklists/python_checklist.md`](../code-opencode/assets/checklists/python_checklist.md) - Python checklist.
- [`assets/checklists/shell_checklist.md`](../code-opencode/assets/checklists/shell_checklist.md) - Shell checklist.
- [`assets/checklists/config_checklist.md`](../code-opencode/assets/checklists/config_checklist.md) - JSON and JSONC config checklist.

### Scripts

- [`scripts/check-comment-hygiene.sh`](scripts/check-comment-hygiene.sh) - Per-file comment-hygiene checker.
- [`scripts/check-comment-hygiene.test.sh`](scripts/check-comment-hygiene.test.sh) - Comment-hygiene checker tests.
- [`scripts/check-dist-staleness.sh`](scripts/check-dist-staleness.sh) - Distribution drift checker.
- [`scripts/hooks/claude-posttooluse.sh`](scripts/hooks/claude-posttooluse.sh) - Write-time comment-hygiene warning hook.

### Universal Standards

- [`../shared/references/universal/code_quality_standards.md`](../shared/references/universal/code_quality_standards.md) - Shared code quality standards.
- [`../shared/references/universal/code_style_guide.md`](../shared/references/universal/code_style_guide.md) - Shared code style and comment hygiene guidance.
