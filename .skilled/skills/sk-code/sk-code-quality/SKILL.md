---
name: sk-code-quality
description: sk-code quality gate after implementation, before verification: P0/P1/P2 author checks, comment hygiene, and surface checklists.
allowed-tools: [Read, Edit, Bash, Grep, Glob]
version: 1.13.5.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-quality, quality gate, phase 1.5, comment hygiene, authoring checklist, p0, p1, p2, opencode checklist, surface standards -->

# Code Quality (quality)

`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the acting agent applying `workflow-implement.md` changes the code and before the surface's verification workflow or done-claim. It consumes the shared surface router, loads the right checklist for the detected surface and target path, fixes quality-gate failures in place, and leaves findings-only output to `sk-code-review`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this mode when the request involves:
- Running the post-implementation quality gate before a completion claim.
- Applying P0/P1/P2 author-side checks to changed code, scripts, skills, agents, commands, MCP servers, or spec docs.
- Checking comment hygiene on modified files and removing ephemeral artifact references from comments while preserving durable WHY.
- Loading a SKILLED authoring checklist for `.skilled/skills/`, `.skilled/agents/`, `.skilled/commands/`, `specs/`, MCP server source, or language-specific SKILLED files.
- Fixing quality-gate failures in place with `Edit` when the fix belongs to the already-authored file.

Keyword triggers: `quality gate`, `code quality`, `comment hygiene`, `surface checklist`, `P0`, `P1`, `P2`, `authoring checklist`, `SKILLED checklist`, `skill authoring`, `agent authoring`, `command authoring`, `MCP server authoring`, `spec folder authoring`, `check before done`.

### When NOT to Use

Skip this mode when:
- The user needs code written, files scaffolded, or behavior implemented. Hand it to the acting agent applying `workflow-implement.md` for the detected surface.
- A failure needs symptom-to-root-cause investigation or a single-cause bug fix. Use the surface's debugging workflow (`workflow-debug.md`).
- The task is to collect final non-mutating verification evidence. Use the surface's verification workflow (`workflow-verify.md`).
- The user asks for findings-first review output, severity-ranked findings, or PR review. Use `sk-code-review`.
- The task is documentation-only prose with no code-work contract. Use `sk-doc`.

### Family Boundary

This is an independently invokable member of the `sk-code` family. It owns the quality gate, not implementation planning, debugging, verification evidence, or formal review reporting. It may edit files that the surface skill already changed to satisfy gate failures, but it does not create new files and does not dispatch subagents.

Pairs well with:
- The surface skill (`sk-code-skilled`) immediately before this gate, because implementation writes the files this mode checks.
- The surface's debugging workflow (`workflow-debug.md`) when a quality failure reveals a functional bug or failing command.
- The surface's verification workflow (`workflow-verify.md`) after P0 quality issues are clear, because verification gates the final claim.
- `sk-code-review` when the user wants findings-only output rather than author-side correction.

---

## 2. SMART ROUTING

### Primary Detection Signal

Surface identity is resolved once by the parent shared router. This mode consumes that result and then routes by target path and quality intent:

```text
QUALITY TASK
    |
    +- Surface identity -> ../shared/references/stack-detection.md
    +- Phase lifecycle  -> ../shared/references/phase-detection.md
    +- Resource routing -> ../ROUTER.md
    |
    +- Quality runner     -> node scripts/quality-gate.cjs (one verdict for the change)
    |     +- any surface  -> the universal floor plus the runner's built-in checks
    |     +- UNKNOWN      -> the floor plus the runner's checks, with `unknown` recorded
    |
    +- SKILLED target    -> ../sk-code-skilled/assets/checklists/<target-checklist>.md
    +- Comment hygiene    -> scripts/check-comment-hygiene.sh, called once by the runner
    +- Dist staleness     -> scripts/check-dist-staleness.sh when generated artifacts are involved
```

### Phase Detection

```text
Phase 1 Implementation writes or changes files
    -> Phase 1.5 Code Quality Gate runs here
        -> run node scripts/quality-gate.cjs and read its gate
        -> load every checklist the verdict lists before any completion claim
        -> the runner calls comment hygiene once over every modified file
        -> apply P0/P1/P2 author checks and judge the judgment_required items
        -> edit in place only for gate failures
    -> Phase 2 Debugging if checks expose a failing symptom
    -> Phase 3 Verification after the gate is clean enough to verify
```

### Resource Domains

- This mode ships no house-style checklist. The universal floor and the universal style guide apply on every surface, and each surface's own checklists carry its house style. `../sk-code-skilled/assets/checklists/universal-checklist.md` is the SKILLED baseline, loaded when SKILLED is a resolved surface of the target, and the SKILLED JavaScript and CSS house checks sit under `../sk-code-skilled/assets/checklists/js-css-style/`.
- `../sk-code-skilled/assets/checklists/` contains OpenCode authoring checklists for skills, agents, commands, MCP servers, language files, and config; the spec-folder checklist is owned by `system-spec-kit`.
- `scripts/quality-gate.cjs` is the runner. It reads the change, runs the built-in checks, probes the enforcement layers, lists the checklists the declarations name and prints one verdict. It writes no file. The only commands it runs beyond its own are the ones a repository's committed `.sk-code/quality.json` names, each as an argv array under a deadline and the workspace guard, and only once the repository is trusted (`references/quality-config.md` section 8). A command a manifest implies is reported as a suggestion it never runs. `references/runner-contract.md` holds its CLI, gate values, verdict, envelope grammar and rule ids, and `references/quality-config.md` holds the repository config: its schema, discovery order, merge rule and trust boundary.
- `assets/quality-defaults.json` holds the runner's base layer: excluded paths, sensor settings and the checklist rows this mode owns. It names no command.
- `scripts/check-comment-hygiene.sh` is the per-file comment-hygiene gate. The runner calls it once per run with `--json`.
- `scripts/check-dist-staleness.sh` checks generated/distribution artifact drift when that is part of the target.
- `scripts/ceiling-report.sh [<file>...]` lists the `ceiling:` and `intentional-limit:` comment markers and tags the ones with no trigger or no measurable signal. Run it for a debt pass, before a release or when a reviewer asks what limits the code knowingly accepts. It reads every tracked code file, or only the files named, prints one `path:line  text  [tags]` line per marker and a closing `markers=N no-trigger=N no-signal=N` line, and exits 0 because it reports and does not gate.
- `scripts/hooks/claude-posttooluse.sh` is the legacy write-time hook, kept for direct tests and registered in no runtime. The live write-time warning is `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`.
- `../shared/references/universal/code-quality-standards.md` is the cross-mode severity standard this packet consumes, and `references/code-style-guide.md` is this packet's own style and comment-hygiene guide.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any quality-gate invocation | `../shared/references/stack-detection.md`, `../ROUTER.md`, `../shared/references/phase-detection.md` |
| ALWAYS | Before any implementation-done claim | `references/runner-contract.md`, `../shared/references/universal/code-quality-standards.md`, `references/code-style-guide.md` |
| ALWAYS | Any quality-gate invocation on changed files | `scripts/quality-gate.cjs`, which calls `scripts/check-comment-hygiene.sh` once over every modified file |
| CONDITIONAL | The verdict lists a checklist | Every file in the runner's `checklists[]`, each with the `why` the verdict gives |
| CONDITIONAL | The repository has or needs `.sk-code/quality.json`, or the verdict reports a configured check, a config error or a suggestion | `references/quality-config.md` |
| CONDITIONAL | SKILLED is a resolved surface of the target | `../sk-code-skilled/assets/checklists/universal-checklist.md` |
| CONDITIONAL | A direct check on one file, outside a runner call | `scripts/check-comment-hygiene.sh` |
| CONDITIONAL | `.skilled/skills/` target | `../sk-code-skilled/assets/checklists/skill-authoring.md` |
| CONDITIONAL | `.skilled/agents/` target | `../sk-code-skilled/assets/checklists/agent-authoring.md` |
| CONDITIONAL | `.skilled/commands/` target | `../sk-code-skilled/assets/checklists/command-authoring.md` |
| CONDITIONAL | `specs/` target | `../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` (system-spec-kit) |
| CONDITIONAL | MCP server source | `../sk-code-skilled/assets/checklists/mcp-server-authoring.md` |
| CONDITIONAL | OpenCode JavaScript, TypeScript, Python, Shell, Rust, JSON, or JSONC files | `../sk-code-skilled/assets/checklists/javascript-checklist.md`, `../sk-code-skilled/assets/checklists/typescript-checklist.md`, `../sk-code-skilled/assets/checklists/python-checklist.md`, `../sk-code-skilled/assets/checklists/shell-checklist.md`, `../sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md`, `../sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md`, `../sk-code-skilled/assets/checklists/rust-checklist/p1-required.md`, `../sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md`, `../sk-code-skilled/assets/checklists/config-checklist.md` as applicable |
| CONDITIONAL | Generated distribution artifacts or mirrored outputs changed | `scripts/check-dist-staleness.sh` |
| ON_DEMAND | Debt pass, before a release or a reviewer asks what limits the code knowingly accepts | `scripts/ceiling-report.sh` |
| ON_DEMAND | Need the legacy write-time hook's behavior, which no runtime registers | `scripts/hooks/claude-posttooluse.sh` |

### Target-Path Checklist Map

The runner resolves checklists from two sources: the rows this mode owns in `assets/quality-defaults.json`, which are the universal floor and, in this hub's own repository, the spec-folder authoring checklist, and each surface's `quality.checklists` declaration. Ask the runner which checklists apply to a file, and why, with `node scripts/quality-gate.cjs --explain <path>`. Its `checklists[]` and each entry's `why` are the answer, in any repository. This repository's own map, the SKILLED rows among them, is rendered in `../sk-code-skilled/SKILL.md` under "Quality Checklist Map".

### Comment-Hygiene Enforcement Gates

This mode owns the author-side check and knows the three independent enforcement layers. In any repository, the runner's `layers` field reports what a probe found for each one, `present`, `absent`, `untrusted`, `broken` or `unknown`, and a quality claim cites that field, never this table.

**This repository's wiring.** The table and the notes after it describe this hub's own repository. They are not universal: another repository may wire none of these layers, or wire them differently.

| Gate | Where | Effect |
| --- | --- | --- |
| Write-time warning | `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired as the Claude `PostToolUse` hook for `Write` and `Edit` in `.claude/settings.json` | Warns during authoring when a comment carries ephemeral artifact labels. |
| Pre-commit block | `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath` by `.skilled/scripts/install-git-hooks.sh` | Blocks commits with forbidden comment patterns across runtimes. |
| CI block | `.github/workflows/comment-hygiene.yml` | Blocks pull requests with forbidden comment patterns. |

A repository can switch named core hygiene rules off with `commentHygiene.disableRules` in its quality config, never a rule the shared `rule-overrides.json` fixes. The runner, the pre-commit block and the CI block all read that key through `scripts/lib/quality-config.cjs`, so a rule switched off for one is off for all three. The config's additions, such as a ticket prefix, reach the runner alone, so the pre-commit and CI blocks keep the core set minus the disabled rules, and `config.hygiene.disabled` in the verdict names what is off. The write-time warning still applies every core rule, and it never blocks. `references/quality-config.md` holds the key's rules.

The write-time warning is one adapter of the shared router in `.skilled/hooks/post-edit-quality/`, which runs after every edit through one adapter per runtime (Claude Code, Codex, Devin, Cursor, Pi and OpenCode) and reports findings before the model's next turn. The pre-commit block can be bypassed for one commit with `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit`, and the CI block re-checks every PR to main, which `--no-verify` cannot skip. The live `.skilled/scripts/git-hooks/pre-commit` also runs the agent-mirror-sync gate and other repository gates, independent of comment hygiene, documented in `.skilled/scripts/git-hooks/README.md`. The older `.skilled/hooks/git/pre-commit` and `scripts/hooks/claude-posttooluse.sh` are compatibility helpers kept for direct tests. Neither is an installed hook.

Run `node scripts/quality-gate.cjs`, which calls `scripts/check-comment-hygiene.sh` once over every modified file that can contain comments. A finding on a changed line blocks. A finding on an unchanged line of a touched file blocks only when `layers` reports the pre-commit or CI layer `present`, because that layer scans whole files and would fail the change anyway. Otherwise it is P1 touched-file debt the change did not write.

### 2b. Machine-Readable Router (thin, Type-1 benchmark)

sk-code-quality routes primarily by TARGET PATH (the checklists `--explain` names for a file), not by prompt keywords. Its parent-to-child discoverability is the hub `quality` signal. This thin prompt-intent projection deliberately does not model the path-keyed dispatch.

```python
# Thin prompt-intent router: sk-code-quality owns a single routable checklist. Its
# real routing is target-path-keyed (the checklists --explain names), and its parent
# discoverability is the hub quality signal. This block only made the one asset
# scoreable by the retired deterministic router-replay.
DEFAULT_RESOURCE = [
    "references/runner-contract.md",
    "../shared/references/universal/code-quality-standards.md",
    "references/code-style-guide.md",
]

INTENT_SIGNALS = {
    "QUALITY": {"weight": 1, "keywords": ["quality gate", "comment hygiene", "p0 p1 p2", "code smell", "dist staleness", "naming", "standards", "checklist", "author quality gate", "envelope", "restraint", "yagni"]},
}

RESOURCE_MAP = {
    "QUALITY": [
        "references/quality-config.md",
    ],
}
```

### Machine-Readable Router Call Sequence

```text
discover_markdown_resources()
    -> _guard_in_skill() + load_if_available()
    -> score_intents()/select_intents() for the thin QUALITY projection
    -> get_routing_key() from target path, then select the path-keyed checklist
    -> UNKNOWN_FALLBACK when no routable target path is available
```

The declarations behind `--explain` stay authoritative, and the runner reads them directly. The prompt-intent projection only makes the default quality resources scoreable.

---

## 3. HOW IT WORKS

### Quality Gate Workflow

1. Resolve the surface and lifecycle state through the shared router. If no implementation changed files yet, route to the appropriate surface skill (`sk-code-skilled`) unless the user explicitly asked for a standalone quality audit.
2. Collect the changed-file set from the task context or targeted paths. Read each target before editing.
3. Run `node scripts/quality-gate.cjs` from the repository root. It takes the working-tree change by default, or `--base <ref>` or `--files <path>...`. Read the gate before anything else. `BLOCKED` means fix in place or escalate. `UNVERIFIED` means a required check produced no evidence, so hand each id in `summary.unverified` to verification as an open claim. `NOTHING_CHECKED` is reported as such and never as clean. `ERROR` stops the gate until its `errors[]` entry is repaired.
4. Load every checklist the verdict's `checklists[]` names, with the `why` it gives. The universal floor `../shared/references/universal/code-quality-standards.md` is always one of them.
5. Judge each item in `judgment_required`. No built-in check decides input validation, silent failures, initialization safety, commented-out code, accessibility or design restraint.
6. Apply the P0/P1/P2 model: P0 blocks completion, P1 should be fixed before handoff unless explicitly accepted, P2 can be documented when there is a clear reason.
7. Before a gate fix adds code, apply the Design Restraint Ladder in `../shared/references/universal/code-quality-standards.md` and stop at the first rung that holds.
8. Fix gate failures in place with `Edit` when the correction is limited to already-authored files, then rerun the runner.
9. If a gate failure requires new files, broader implementation, or behavior design, hand back to the acting agent applying `workflow-implement.md`.
10. If a gate failure is caused by an unclear runtime failure, hand to the surface's debugging workflow (`workflow-debug.md`) with the observed command, output, and failing target.
11. When P0 items are clear, render `node scripts/quality-gate.cjs --format envelope`, fill its three `PENDING_AGENT_JUDGMENT` fields, and hand to the surface's verification workflow (`workflow-verify.md`) for non-mutating evidence before any done-claim.

### P0/P1/P2 Author Checks

The tier rules and the P0 categories live in [`code-quality-standards.md`](../shared/references/universal/code-quality-standards.md): the tiers in its section 2, and the P0 categories with the mechanical floor in its section 3.

| Severity | Meaning | Gate Effect |
| --- | --- | --- |
| P0 | Correctness, safety, broken contract, or forbidden comment metadata | Blocks completion until fixed or escalated. |
| UNVERIFIED | Unchecked generated drift, missing required checklist evidence, or a required check that produced no evidence | Neither clean nor blocked. The claim stays open until verification proves it with its own command or reports it open. |
| P1 | Maintainability, routing, style, or authoring-contract issue likely to confuse future work | Fix before handoff unless the user accepts a documented risk. |
| P2 | Local polish, clarity, or minor consistency issue with low behavioral risk | Fix when cheap; otherwise document the deferral and why it is safe. |

### Author-Side, Not Review-Side

Quality mode is allowed to edit because it is part of the implementation lifecycle. It should leave the workspace better than it found it, but only inside the current scope. If the requested output is a review report, use `sk-code-review`; if the requested output is evidence that commands pass, use the surface's verification workflow (`workflow-verify.md`).

### Comment Hygiene

Comments should explain durable WHY and constraints. They must not embed temporary artifact labels, spec paths, packet labels, ticket labels, or phase bookkeeping. When this mode finds a violation, it edits the comment to preserve the durable reason or removes the comment if it has no durable value.

### Advisory Evidence-Handoff Envelope

When the orchestrator or surface workflow requests structured evidence, append this advisory envelope after the prose handoff. Never place it in a position that reads as a status verdict, and never let it stand in for the handoff to the surface's verification workflow (`workflow-verify.md`).

```text
CODE_QUALITY_RESULT v1
schema_version: code-quality/v1
status: advisory
modified_files: <repo-relative paths, or none>
resolved_surface: <declared surface label(s) in detection order | unknown>
checklists_loaded: <checklist paths loaded, or none>
checker_outputs: code-quality-run/v1 gate=<GATE> exit=<n> p0_blocking=<n> unverified=<ids|none> unchecked=<n> layers=pc:<state>,ci:<state>,pe:<state>
p0_p1_p2_decisions: <per-severity dispositions>
accepted_deferrals: <documented P1/P2 deferrals and why safe, or none>
verification_handoff: workflow-verify.md
remaining_accepted_risk: <one-line residual risk, or none>
```

`node scripts/quality-gate.cjs --format envelope` renders the machine fields, and `references/runner-contract.md` section 4 holds the grammar. The three judgment fields, `p0_p1_p2_decisions`, `accepted_deferrals` and `remaining_accepted_risk`, print as `PENDING_AGENT_JUDGMENT` until the agent fills them, and a field that still reads it is open work. A private surface prints by its label only, so the envelope never names a `local-` skill.

This envelope is advisory and additive only: its `status` is fixed to `advisory` and MUST NOT be `pass`, `success`, or `done`. Its presence NEVER reads as a completion, done, works, or passing claim, and it never replaces the handoff to the surface's verification workflow (`workflow-verify.md`) — it reinforces, and does not relax, the §4 NEVER rule that this mode makes no passing claims.

---

## 4. RULES

### ✅ ALWAYS

1. Read target files before editing them.
2. Run the runner, `node scripts/quality-gate.cjs`, before any implementation-done or quality-pass claim, and load every checklist its `checklists[]` names. The universal floor is always one of them.
3. Resolve surface identity through `../shared/references/stack-detection.md`; do not re-author surface detection in this packet.
4. Load the SKILLED authoring checklist the verdict names before checking `.skilled/` work, and the MCP server checklist by judgment for MCP server source.
5. Let the runner call `scripts/check-comment-hygiene.sh` over every modified comment-capable file, or run the checker directly on one file outside a runner call.
6. Fix P0 issues before handing to verification unless the only safe action is escalation.
7. Keep fixes scoped to quality-gate failures in files already in scope.
8. Hand failures that need root-cause investigation to the surface's debugging workflow (`workflow-debug.md`) with the exact symptom and evidence.

### ⛔ NEVER

1. Never create new files; this mode has no `Write` authority.
2. Never dispatch subagents; this mode has no `Task` authority.
3. Never make completion, done, works, or passing claims; hand to the surface's verification workflow (`workflow-verify.md`) for evidence.
4. Never replace a formal findings-first review; route that to `sk-code-review`.
5. Never paste or fork shared surface-detection, quality, or style references into this packet.
6. Never broaden scope into cleanup or refactor work unrelated to the gate failure.
7. Never allow ephemeral artifact labels in code comments; preserve durable WHY only.
8. Never add a packet-local `graph-metadata.json`.
9. Never run a command the repository layer does not name. The runner runs its built-in checks and the commands the repository's committed config names, and this mode adds no command of its own.
10. Never read `NOTHING_CHECKED` or `UNVERIFIED` as clean. Each names evidence that does not exist yet.

### ⚠️ ESCALATE IF

1. A required P0 check is UNVERIFIED and only the operator can name or install its tool.
2. The correct checklist cannot be identified from the target path.
3. A P0 issue requires new files, new behavior, or scope beyond an in-place quality fix.
4. Comment-hygiene enforcement layers disagree on a blocking result.
5. Generated artifacts appear stale but the regeneration command is unknown or unsafe to run.

---

## 5. SUCCESS CRITERIA

- The quality gate ran after implementation and before verification.
- Surface identity came from the shared router, not packet-local detection logic.
- `scripts/quality-gate.cjs` ran on the change, and its gate is quoted as printed, never restated as a pass.
- Every checklist the verdict's `checklists[]` names was loaded before any quality-pass claim, the universal floor among them.
- The comment-hygiene result came from the runner's single checker call, with zero blocking findings or a documented escalation.
- Each id in `summary.unverified` is handed to verification as an open claim.
- P0 issues are fixed in place or escalated with evidence; P1/P2 handling is explicit.
- No new files were authored by this mode.
- Handoff to the surface's verification workflow (`workflow-verify.md`) includes the quality evidence and any remaining accepted risk.

---

## 6. INTEGRATION POINTS

- `sk-code` routes quality prompts here through `mode-registry.json` and keeps the hub routing-only.
- The acting agent applying `workflow-implement.md` changes files before this gate runs, then applies the surface's `workflow-debug.md` and `workflow-verify.md`, which `sk-code-skilled` bundles as read-only doctrine.
- `sk-code-review` owns findings-first review output and PR-style severity reporting.
- `system-spec-kit` owns spec-folder documentation, validation, and memory workflows when the broader task requires them.

---

## 7. REFERENCES AND RELATED RESOURCES

### Parent And Shared Router

- [`../SKILL.md`](../SKILL.md) - Routing-only parent hub.
- [`../mode-registry.json`](../mode-registry.json) - Source of truth for mode tool surfaces and packet identity.
- [`../shared/references/stack-detection.md`](../shared/references/stack-detection.md) - Shared surface detection consumed by every mode.
- [`../ROUTER.md`](../ROUTER.md) - Root stage-two intent and resource routing.
- [`../shared/references/phase-detection.md`](../shared/references/phase-detection.md) - Lifecycle transitions around the quality gate.

### Quality References And Assets

- [`references/runner-contract.md`](references/runner-contract.md) - The runner's CLI, gate values, verdict, envelope grammar, rule ids and reader rules.
- [`references/quality-config.md`](references/quality-config.md) - The repository config `.sk-code/quality.json`: schema, discovery order, merge rule, error codes, trust boundary and known limits.
- [`assets/quality-defaults.json`](assets/quality-defaults.json) - The runner's base layer: excluded paths, sensor settings and the checklist rows this mode owns.
- [`assets/checklists/universal-checklist.md`](../sk-code-skilled/assets/checklists/universal-checklist.md) - SKILLED quality baseline, loaded when SKILLED is a resolved surface.
- [`assets/checklists/skill-authoring.md`](../sk-code-skilled/assets/checklists/skill-authoring.md) - Skill authoring checklist.
- [`assets/checklists/agent-authoring.md`](../sk-code-skilled/assets/checklists/agent-authoring.md) - Agent authoring checklist.
- [`assets/checklists/command-authoring.md`](../sk-code-skilled/assets/checklists/command-authoring.md) - Command authoring checklist.
- [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) - Spec folder authoring checklist (owned by system-spec-kit).
- [`assets/checklists/mcp-server-authoring.md`](../sk-code-skilled/assets/checklists/mcp-server-authoring.md) - MCP server authoring checklist.
- [`assets/checklists/javascript-checklist.md`](../sk-code-skilled/assets/checklists/javascript-checklist.md) - JavaScript checklist.
- [`assets/checklists/typescript-checklist.md`](../sk-code-skilled/assets/checklists/typescript-checklist.md) - TypeScript checklist.
- [`assets/checklists/python-checklist.md`](../sk-code-skilled/assets/checklists/python-checklist.md) - Python checklist.
- [`assets/checklists/shell-checklist.md`](../sk-code-skilled/assets/checklists/shell-checklist.md) - Shell checklist.
- [`assets/checklists/rust-checklist/overview-and-p0-parity.md`](../sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md) - Rust checklist overview and P0 parity.
- [`assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md`](../sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md) - Rust P0 safety and boundary discipline.
- [`assets/checklists/rust-checklist/p1-required.md`](../sk-code-skilled/assets/checklists/rust-checklist/p1-required.md) - Rust required P1 checks.
- [`assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md`](../sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md) - Rust P2 evidence, validation, and resources.
- [`assets/checklists/config-checklist.md`](../sk-code-skilled/assets/checklists/config-checklist.md) - JSON and JSONC config checklist.

### Scripts

- [`scripts/quality-gate.cjs`](scripts/quality-gate.cjs) - The quality runner, which prints one verdict for a change in any repository.
- [`scripts/tests/quality-gate.test.cjs`](scripts/tests/quality-gate.test.cjs) - Runner tests: the named fixtures and the unit cases, run with `node --test`.
- [`scripts/check-comment-hygiene.sh`](scripts/check-comment-hygiene.sh) - Per-file comment-hygiene checker.
- [`scripts/tests/check-comment-hygiene.test.sh`](scripts/tests/check-comment-hygiene.test.sh) - Comment-hygiene checker tests.
- [`scripts/check-dist-staleness.sh`](scripts/check-dist-staleness.sh) - Distribution drift checker.
- [`scripts/ceiling-report.sh`](scripts/ceiling-report.sh) - Ceiling-marker report. Run it for a debt pass, before a release or when a reviewer asks what limits the code knowingly accepts.
- [`scripts/tests/ceiling-report.test.sh`](scripts/tests/ceiling-report.test.sh) - Ceiling-marker report tests.
- [`scripts/hooks/claude-posttooluse.sh`](scripts/hooks/claude-posttooluse.sh) - Legacy write-time comment-hygiene hook, kept for direct tests and registered in no runtime.

### Universal Standards

- [`../shared/references/universal/code-quality-standards.md`](../shared/references/universal/code-quality-standards.md) - Shared code quality standards.
- [`references/code-style-guide.md`](references/code-style-guide.md) - This mode's code style and comment hygiene guide.
