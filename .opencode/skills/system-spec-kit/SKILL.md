---
name: system-spec-kit
description: "Unified spec-folder workflow + context preservation: Levels 1-3+, validation, Spec Kit Memory. Required for file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.7.1.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context_preservation, progressive-documentation, validation, mk-spec-memory, mk-goal, goal-plugin, active_goal, session-goal, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.

## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:

Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
- **Contents**: Markdown files (spec.md, plan.md, tasks.md, and implementation-summary.md when work is complete) plus optional support folders such as `scratch/`, `research/`, or `review/`

Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Positive keywords include add, implement, fix, update, create, modify, rename, delete and configure. The authoritative Gate 3 classifier intentionally omits `analyze`, `decompose` and `phase` from positive triggers; `analyze` is a read-only disqualifier unless a real write, memory-save or resume trigger is also present.

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.
Status: ✅ This requirement applies immediately once file edits are requested.

### Distributed Governance Rule

Any agent writing authored spec folder docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `review-report.md`, `debug-delegation.md`, `resource-map.md` (optional)) MUST use contract-backed templates through `create.sh` or the inline renderer. This is a workflow-required gate, not a runtime hook: run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after authored spec-doc writes and before completion claims, then route continuity updates through /memory:save. Deep-research workflow-owned packet markdown (`research/iterations/*.md`, `research/deep-research-*.md`, and progressive `research/research.md` loop updates) is exempt from that generic per-write rule; `/deep:research` must instead run targeted strict validation after every `spec.md` mutation it performs. @deep-research retains exclusive write access for `research/research.md`; @debug retains exclusive write access for `debug-delegation.md`.

- `handover.md` stays in the canonical recovery ladder and is maintained through `/memory:save` handover_state routing using the handover template for initial creation.
- `review-report.md` remains owned by `@deep-review` when deep review workflows synthesize findings.
- `resource-map.md` is a peer cross-cutting template under `.opencode/skills/system-spec-kit/templates/`; it remains optional at any level and gives reviewers a lean file ledger alongside `implementation-summary.md`.

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest `/memory:save` handover maintenance |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest Task-tool debug delegation |

**Rule:** When detected, proactively suggest the appropriate action.

---

## 2. SMART ROUTING

### Resource Domains

This skill uses simple intent/domain routing, not keyed runtime resource routing. It does not select whole `references/<key>/` or `assets/<key>/` subtrees from project, mode, stack, or model signals. Instead, the router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring from `RESOURCE_MAP` to load real, guarded resources from the current inventory. Keep this section domain-focused rather than static file inventories.

- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
- `references/templates/` for level selection, template selection, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows, shared intake, rename procedures, and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/cli/` for daemon CLI parity, shared smart-router behavior, and memory handback contracts.
- `references/config/` for runtime environment configuration and launcher/lease contracts.
- `references/hooks/` for prompt-time advisor hooks, the OpenCode goal plugin, runtime hook parity, and hook validation playbooks.
- `assets/*.md` for shared decision matrices, template mapping, and parallel dispatch support.

### Template and Script Sources of Truth

- Level definitions and template size guidance: level specifications reference
- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
- Use the Level contract for operational templates; `create.sh` and the Level contract resolver share the same template index.
- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
- Script architecture, build outputs, and runtime entrypoints: [scripts/README.md](./scripts/README.md)
- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
- Nested packet changelog workflow: [nested_changelog.md](./references/workflows/nested_changelog.md)

Primary operational scripts:
- `spec/validate.sh`
- `spec/create.sh`
- `spec/archive.sh`
- `spec/check-completion.sh`
- `spec/recommend-level.sh`
- `mcp_server/lib/templates/level-contract-resolver.ts`

Spec-script exit codes (`spec/*.sh`; distinct from the daemon-backed memory CLI taxonomy in §3):
- `0`: success.
- `1`: user error such as bad flags or invalid input.
- `2`: validation error.
- `3`: system error such as missing folders, missing manifests, or file I/O failures.

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match   | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, including `/speckit:plan --intake-only` as the standalone intake entry, `/speckit:plan` and `/speckit:complete` smart delegation notes, and the pointer from `/deep:research` to `../system-deep-loop/deep-research/references/protocol/spec_check_protocol.md`, and use this file only to point readers to it rather than duplicating the full matrix.

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling. Because this skill is an intent/domain router, Pattern 3 is adapted to extensible intent labels over discovered resources rather than keyed resource subdirectories.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, de-duplicates with `seen`, and checks `inventory`.
- Pattern 3: Extensible Routing Key - command and intent signals select domain labels and resource maps without forcing `references/<key>/` or `assets/<key>/` subtrees.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` asks for disambiguation and missing-resource cases return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows/quick_reference.md"

INTENT_SIGNALS = {
    "PLAN": {"weight": 3, "keywords": ["plan", "design", "new spec", "level selection", "option b"]},
    "RESEARCH": {"weight": 3, "keywords": ["investigate", "explore", "analyze", "prior work", "evidence"]},
    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
    "DEBUG": {"weight": 4, "keywords": ["stuck", "error", "not working", "failed", "debug"]},
    "COMPLETE": {"weight": 4, "keywords": ["done", "complete", "finish", "verify", "checklist"]},
    "MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]},
    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
    "PHASE": {"weight": 4, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased", "multi-session"]},
    "RETRIEVAL_TUNING": {"weight": 3, "keywords": ["retrieval", "search tuning", "fusion", "scoring", "pipeline"]},
    "INTAKE": {"weight": 4, "keywords": ["intake", "folder_state", "start_state", "repair-mode", "intake-only"]},
    "HOOKS": {"weight": 4, "keywords": ["hook", "skill advisor hook", "advisor hook", "prompt-time advisor", "advisor_validate", "goal plugin", "mk-goal", "/goal", "active_goal", "session goal"]},
    "LAUNCHER": {"weight": 4, "keywords": ["launcher", "lease", "pid file", "single-writer", "lease_held_by"]},
    "RENAME": {"weight": 3, "keywords": ["rename", "mechanical refactor", "rename pattern", "git mv", "case variants"]},
    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "tenant", "retention", "audit"]},
}

RESOURCE_MAP = {
    "PLAN": [
        "references/templates/template_guide.md",
        "references/workflows/intake_contract.md",
        "references/validation/template_compliance_contract.md",
        "assets/level_decision_matrix.md",
        "assets/complexity_decision_matrix.md",
    ],
    "RESEARCH": [
        "references/workflows/quick_reference.md",
        "references/workflows/worked_examples.md",
        "references/memory/epistemic_vectors.md",
    ],
    "IMPLEMENT": [
        "references/validation/validation_rules.md",
        "references/validation/template_compliance_contract.md",
        "references/templates/template_guide.md",
        "assets/template_mapping.md",
    ],
    "DEBUG": [
        "references/debugging/troubleshooting.md",
        "references/debugging/universal_debugging_methodology.md",
        "references/workflows/quick_reference.md",
    ],
    "COMPLETE": [
        "references/validation/validation_rules.md",
        "references/workflows/nested_changelog.md",
        "references/workflows/intake_contract.md",
        "references/workflows/spec_folder_write_recipe.md",
        "references/workflows/spec_folder_authoring_checklist.md",
    ],
    "MEMORY": [
        "references/memory/memory_system.md",
        "references/memory/save_workflow.md",
        "references/memory/trigger_config.md",
    ],
    "HANDOVER": [
        "references/workflows/quick_reference.md",
    ],
    "PHASE": [
        "references/structure/phase_definitions.md",
        "references/structure/sub_folder_versioning.md",
        "references/validation/phase_checklists.md",
    ],
    "RETRIEVAL_TUNING": [
        "references/memory/embedder_architecture.md",
        "references/memory/embedding_resilience.md",
        "references/memory/embedder_pluggability.md",
        "references/memory/trigger_config.md",
    ],
    "INTAKE": [
        "references/workflows/intake_contract.md",
        "references/templates/template_guide.md",
        "references/validation/template_compliance_contract.md",
    ],
    "HOOKS": [
        "references/hooks/skill_advisor_hook.md",
        "references/hooks/skill_advisor_hook_validation.md",
        "references/hooks/goal_plugin.md",
        "references/config/hook_system.md",
    ],
    "LAUNCHER": [
        "references/config/launcher_lease.md",
        "references/memory/memory_system.md",
    ],
    "RENAME": [
        "references/workflows/rename_pattern.md",
    ],
    "EVALUATION": [
        "references/memory/epistemic_vectors.md",
        "references/config/environment_variables.md",
    ],
    "SCORING_CALIBRATION": [
        "references/config/environment_variables.md",
    ],
    "ROLLOUT_FLAGS": [
        "references/config/environment_variables.md",
    ],
    "GOVERNANCE": [
        "references/config/environment_variables.md",
    ],
}

COMMAND_BOOSTS = {
    "/speckit:plan": "PLAN",
    "/speckit:implement": "IMPLEMENT",
    "/speckit:complete": "COMPLETE",
    "/speckit:plan --intake-only": "INTAKE",
    "/speckit:plan :with-phases": "PHASE",
    "/memory:search": "MEMORY",
    "/memory:save": "MEMORY",
    "/memory:manage": "MEMORY",
    "/memory:learn": "MEMORY",
    "/speckit:resume": "MEMORY",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full validation", "full checklist", "full template", "save context", "/memory:save", "/speckit:resume", "implementation-summary", "tasks.md", "spec folder", "phase folder", "description metadata"],
    "ON_DEMAND": [
        "references/validation/phase_checklists.md",
        "references/templates/template_guide.md",
        "references/workflows/intake_contract.md",
        "references/hooks/skill_advisor_hook_validation.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is planning, memory, validation, phase, debug, or completion work",
    "Confirm the target spec folder or command surface",
    "Provide one concrete file, error, or expected output",
    "Confirm which verification gate must pass",
]

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
        str(getattr(task, "command", "")),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    """Allow markdown loads only within this skill folder."""
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def _guard_resource_map(resource_map: dict[str, list[str]]) -> None:
    """Reject compatibility stubs as router targets while allowing them to preserve old links."""
    for intent, resources in resource_map.items():
        for relative_path in resources:
            guarded = _guard_in_skill(relative_path)
            if guarded.startswith("references/"):
                tail = guarded.removeprefix("references/")
                if "/" not in tail and "-" in Path(tail).stem:
                    raise ValueError(f"RESOURCE_MAP must target canonical references, not compatibility stubs: {intent} -> {guarded}")

def discover_markdown_resources() -> set[str]:
    """Recursively discover routable markdown docs for this skill only."""
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted scoring from request text, keywords, and explicit command boosts."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}

    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]

    command = str(getattr(task, "command", "")).lower()
    for prefix, intent in COMMAND_BOOSTS.items():
        if command.startswith(prefix):
            scores[intent] += 6

    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    """Return primary intent and secondary intent when scores are close."""
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return []

    selected = [ranked[0][0]]
    if len(ranked) > 1:
        primary_score = ranked[0][1]
        secondary_intent, secondary_score = ranked[1]
        if secondary_score > 0 and (primary_score - secondary_score) <= ambiguity_delta:
            selected.append(secondary_intent)

    return selected[:max_intents]

def route_speckit_resources(task):
    """Scoped, recursive, weighted, ambiguity-aware routing."""
    _guard_resource_map(RESOURCE_MAP)
    _guard_resource_map({
        "ALWAYS": LOADING_LEVELS["ALWAYS"],
        "ON_DEMAND": LOADING_LEVELS["ON_DEMAND"],
    })
    inventory = discover_markdown_resources()
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

    # ALWAYS: base references for every invocation
    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if max(scores.values() or [0]) < 0.5:
        return {
            "intents": intents or ["UNKNOWN"],
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    # CONDITIONAL: intent-scored resources
    matched_intents = []
    for intent in intents:
        before_count = len(loaded)
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
        if len(loaded) > before_count:
            matched_intents.append(intent)

    # ON_DEMAND: explicit deep-dive requests
    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    result = {"intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
    return result
```

---

## 3. HOW IT WORKS

### Core Workflow

1. Gate 3 selects an existing, new, related, skipped, or phase spec folder before file changes.
2. For new folders, estimate level from LOC, risk, affected systems, and verification needs; create from contract-backed templates.
3. Keep phase parents lean: parent folders hold `spec.md`, `description.json`, and `graph-metadata.json`; child phases hold working docs.
4. Use checklist priority as the completion gate: P0 cannot defer, P1 requires completion or approved deferral, and P2 is optional.
5. Preserve continuity in `implementation-summary.md` or through canonical `/memory:save` with `generate-context.js`.

### Spec Kit Memory

Spec Kit Memory provides context retrieval, search, save, checkpoint, health, and indexing surfaces. Use `memory_context()` or `/speckit:resume` for recovery; use `memory_search()` for targeted retrieval; use `generate-context.js` for canonical saves.

The surface is dual-stack: alongside the `mk-spec-memory` MCP registration, all 41 tools are callable through the full-parity daemon-backed CLI `node .opencode/bin/spec-memory.cjs <tool_name> [--json '{...}' | --param value]` against the same daemon. MCP remains the primary in-session transport today; use the CLI when MCP transport is missing, failed or not reconnecting while the daemon is warm, and for hooks, cron, CI and operator shell diagnostics. Recovery example: `node .opencode/bin/spec-memory.cjs memory_context --json '{"input":"resume previous work","mode":"resume"}' --format json --timeout-ms 3000`. CLI exit taxonomy: `0` success, `1` runtime, `64` usage/schema, `69` protocol/dist mismatch or stale dist, `75` retryable daemon error. Prompt-time callers must pass `--warm-only` (probe-only, exit `75` instead of cold-spawning); non-prompt contexts auto-spawn the daemon through the launcher. Because this CLI already has full parity, a later evolution could make it the primary or sole transport without breaking existing MCP workflows; that is a possible direction, not a committed plan. `--format jsonl` renders one complete JSON payload on one stdout line; it is not streaming JSON Lines. Full cross-daemon CLI behavior, recovery, stale-dist build commands, per-command `--help`, offline smoke, and safety rules live in [`references/cli/daemon_cli_reference.md`](references/cli/daemon_cli_reference.md). See `mcp_server/ENV_REFERENCE.md` ("CLI front door") for the warm-only/prompt-time env flags. Detailed behavior, flags, scoring, and MCP tool reference live in `references/memory/memory_system.md`, `references/memory/save_workflow.md`, and `mcp_server/ENV_REFERENCE.md`. Launcher/daemon reliability is operator-tunable via the `SPECKIT_LAUNCHER_LOG`, `SPECKIT_LEASE_PROBE_RETRIES`, `SPECKIT_STOP_HOOK_ORPHAN_SWEEP`, and `SPECKIT_DAEMON_REELECTION` (default-on in the runtime configs: a disposing owner releases the shared daemon for a live secondary, and a fresh session reaps the released daemon before respawn for a single writer) flags, all documented in `mcp_server/ENV_REFERENCE.md`.

`memory_index_scan` is self-maintaining: overlapping scan calls return a `coalesced:true` success envelope instead of a raw E429 error. Rows become BM25/FTS-searchable immediately as `pending` while vectors drain (`complete_with_pending_vectors` with a `pendingVectors` count). Move reconciliation heals renamed spec folders by packet identity without re-embedding. Each scan also runs a bounded global orphan sweep. `memory_health` now includes an `index` block with a summary enum (`healthy_fresh`, `healthy_lagging_vectors`, `stale_needs_scan`, `degraded_needs_repair`, `unavailable`) and counts for indexed/pending/failed rows.

`memory_embedding_reconcile` is a net-new public MCP maintenance tool on the `mk-spec-memory` surface. It converges `embedding_status` for vector-present stale rows and resets genuinely missing-vector retry rows inside one guarded `BEGIN IMMEDIATE` transaction. It runs dry-run by default so operators can inspect the proposed changes before committing them.

The current memory baseline is schema v41. The hardening features ship behind conservative defaults: semantic-trigger shadow matching, session-trace causal inference, feedback-retention reducers, soft-delete tombstones, memory idempotency receipts, authored continuity snapshots, and completion freshness all stay opt-in. `source_kind` provenance, retrieval observability, stale-audit signals, and tool-ownership linting are documented in the memory and ENV references rather than duplicated here.

### Reranking

Model-based cross-encoder/local-GGUF reranking was removed in the 014 deprecation: the spec-memory local model path was removed in phase 003 and the local rerank sidecar skill was deleted in phase 004 (cloud rerankers were removed earlier in 022/013). Memory search still has a Stage 3 rerank step: MMR diversity reranking plus MPAB chunk collapse, with the `memory_search` `rerank` option defaulting to true. The `SPECKIT_CROSS_ENCODER`/`RERANKER_LOCAL` flags are no longer wired.

### Security

- `VOYAGE_API_KEY` is read from the process environment only. It must never be logged, written into spec docs, or persisted to disk by Spec Kit. Operators should set it in shell init files owned by the operator with mode `600`.
- Tests may mutate env vars, but must restore them in `afterEach`. Production code paths should not treat mutable process env as request-time configuration.

### Validation and Recovery

Run `.opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` before completion claims. Validation errors block completion; warnings must be addressed or documented. Startup, resume, hook, goal plugin, code graph, and Code Graph readiness details live in `references/config/hook_system.md`, `references/hooks/skill_advisor_hook.md`, `references/hooks/goal_plugin.md`, `mcp_server/hooks/README.md` (Claude and OpenCode hook folders; OpenCode uses plugin-backed delivery), and the code graph references.

### OpenCode Goal Plugin

The local `/goal` surface is `.opencode/plugins/mk-goal.js` plus `.opencode/commands/goal_opencode.md`. It is not an MCP daemon bridge: it stores per-session JSON state under `.opencode/skills/.goal-state/`, injects the active goal with `experimental.chat.system.transform`, observes lifecycle events through the plugin `event` hook, and exposes `mk_goal` / `mk_goal_status` plugin tools. Use [`references/hooks/goal_plugin.md`](./references/hooks/goal_plugin.md) for the operator contract, restart requirement, environment variables, validation commands, and boundary between raw `objective` and generated `goalPrompt`.

### Code Graph and Search Routing

Use Grep/Glob for semantic/token discovery, Code Graph for structural relationships, and Spec Kit Memory for prior decisions and continuity. The `system-code-graph` skill owns the 8-tool `mcp__mk_code_index__*` surface: read tools (`code_graph_query`, `code_graph_context`, `detect_changes`) return blocked/degraded payloads under the readiness contract, `code_graph_status` is always answerable, `code_graph_classify_query_intent` is text-only, and maintenance tools (`code_graph_scan`, `code_graph_apply`, `code_graph_verify`) handle recovery and verification, with verify blocking when graph state is not fresh.

---

## 4. RULES

### ALWAYS

1. **Determine level (1/2/3/3+) before ANY file changes** - Count LOC, assess complexity/risk
2. **Scaffold from contract-backed templates** - Use `create.sh` or `inline-gate-renderer`, NEVER create from scratch
3. **Fill ALL placeholders** - Remove placeholder markers and sample content
4. **Ask A/B/C/D/E when file modification detected** - Present options, wait for selection
5. **Prefer coordinated related packets before new top-level folders** - Check active and related specs, their scope, status, and Phase Documentation Map. When related work qualifies for phase decomposition, recommend one phased packet rather than separate single-spec folders.
6. **Get explicit user approval before changes** - Show level, path, templates, approach
7. **Use consistent folder naming** - `specs/###-short-name/` format
8. **Use checklist.md to verify (Level 2+)** - Load before claiming done
9. **Mark items `[x]` with evidence** - Include links, test outputs, screenshots
10. **Complete P0/P1 before claiming done** - No exceptions
11. **Suggest handover.md on session-end keywords** - "continue later", "next session"
12. **Run validate.sh before completion** - Completion Verification requirement
13. **Create implementation-summary.md at end of implementation phase (Level 1+)** - Document what was built
14. **Suggest /memory:save when session-end keywords detected OR after extended work (15+ tool calls)** - Proactive context preservation
15. **Suggest Task-tool debug delegation after 3+ failed fix attempts on same error** - Do not continue without offering a fresh debugging pass
16. **Apply the phased-packet preference without bypassing qualification** - Suggest `/speckit:plan :with-phases` only when phase complexity score >= 25 AND documentation level >= 3. If either condition fails, use a standard packet; if the work is new or unrelated, create a separate packet and evaluate that packet independently.
17. **Route all code creation/updates through `sk-code`** - Full surface alignment is mandatory before claiming completion
   - **Authoring-time vs review-time load**: `sk-code` is loaded at TWO distinct points in `/speckit:complete`. (a) Authoring-time (Step 10 development): when the implementation target is under `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/`, or `.opencode/specs/`, load the matching sk-code authoring checklist (`assets/opencode/checklists/{surface}_authoring.md`) and, for `.opencode/specs/` targets, the system-spec-kit spec-folder docs (`references/workflows/spec_folder_authoring_checklist.md` + `references/workflows/spec_folder_write_recipe.md`) BEFORE the first write. (b) Review-time (Step 11 review): the existing `sk-code` code-review mode (findings-first baseline + router-selected surface evidence) overlay runs after writes complete. Authoring-time load surfaces invariants the writer needs to honor; review-time load catches drift the writer didn't honor. See `cross_skill_authoring_load` block in `speckit_complete_auto.yaml` and `speckit_complete_confirm.yaml` for the YAML contract.
18. **Route all documentation creation/updates through `sk-doc`** - Full alignment is mandatory before claiming completion
19. **Enforce ToC policy from validation rules** - Only `research/research.md` may include a Table of Contents section; remove ToC headings from standard spec artifacts
20. **Literal naming for AI-derived spec folders and phases** - When the AI (not the user) picks a spec-folder or phase slug, the name MUST describe the concrete work being built or fixed. Names must include a specific subject token (the component, behavior, or bug being addressed). Forbidden as standalone slugs: `remediation`, `cleanup`, `fix`, `phase-N`, `review-remediation`, `round-N`. Good remediation-packet examples: `fix-deep-review-p1-p2-findings-for-sk-doc-skill`, `harden-mcp-server-startup-races`, `fix-singleton-leak-in-launcher`. Good phase-decomposition examples: `data-model-design`, `api-implementation`, `ui-integration`. **Remediation-packet source/target rule** - remediation slugs MUST follow `NNN-fix-<source>-for-<target>` where: **Source** = the event or evidence that triggered the packet (e.g. `deep-review-p0-p1-findings`, `verdict-fail`, `audit-finding-NN`); **Target** = the specific component being remediated (e.g. `skill-local-benchmarks-format`, `mk-spec-memory-handler`, `launcher-cache`). The source names WHERE the work comes from; the target names WHAT is being fixed. Do not conflate them: the thing being remediated is the target, not the source. Worked example: `007-fix-deep-review-p0-p1-findings-for-skill-local-benchmarks-format` (source=`deep-review-p0-p1-findings`, target=`skill-local-benchmarks-format`). This rule is documentation-layer guidance; `validate.sh` does not lint slugs today (operator decision; may be lifted in a follow-on packet).

### NEVER

1. **Create documentation from scratch** - Use templates only
2. **Skip spec folder creation** - Unless user explicitly selects D
3. **Make changes before spec + approval** - Spec folder is prerequisite
4. **Leave placeholders in final docs** - All must be replaced
5. **Decide autonomously update vs create** - Always ask user
6. **Claim done without checklist verification** - Level 2+ requirement
7. **Proceed without spec folder confirmation** - Wait for A/B/C/D/E
8. **Skip validation before completion** - Completion Verification hard block
9. **Add ToC sections to standard spec artifacts** - `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`, and `resource-map.md` must not contain ToC headings

### ESCALATE IF

1. **Scope grows during implementation** - Run `upgrade-level.sh` to add higher-level templates (recommended), then auto-populate all placeholder content:
   - Read all existing spec files (spec.md, plan.md, tasks.md, implementation-summary.md) for context
   - Replace every placeholder marker pattern in newly injected sections with content derived from that context
   - For sections without sufficient source context, write "N/A - insufficient source context" instead of fabricating content
   - Run `check-placeholders.sh <spec-folder>` to verify zero placeholders remain (see level specifications reference for the full procedure)
   - Document the level change in changelog
2. **Uncertainty about level <80%** - Present level options to user, default to higher
3. **Template doesn't fit requirements** - Adapt closest template, document modifications
4. **User requests skip (Option D)** - Warn about tech debt, explain debugging challenges, confirm consent
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes

---

## 5. SUCCESS CRITERIA

Success means the selected spec folder uses the right template set, placeholders and sample content are removed, links between packet docs work, continuity is saved or updated, Level 2+ checklist P0/P1 items are verified with evidence, and `validate.sh --strict` has no blocking errors.

---

## 6. INTEGRATION POINTS

P0 blocks, P1 requires completion or approved deferral, and P2 is optional. Code updates route through `sk-code`; documentation updates route through `sk-doc`; git handoff routes through `sk-git`.

### Quick Reference Commands

| Command | Usage |
| --- | --- |
| Canonical intake | `/speckit:plan --intake-only "Description"` |
| Create spec folder | `./scripts/spec/create.sh "Description" --short-name name --level 2` |
| Validate | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/007-feature/` |
| Verify code alignment drift | `python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` |
| Save context | `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/007-feature/` |
| Memory CLI (dual-stack) | `node .opencode/bin/spec-memory.cjs <tool> --format json` calls any of the 41 memory tools over the live daemon; `list-tools` enumerates them offline; `--warm-only` for prompt-time contexts |
| Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
| Upgrade level | `bash .opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh specs/007-feature/ --to 2` |
| Completeness | `.opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh specs/007-feature/` |
| Worktree isolation | `.opencode/bin/worktree-session.sh` creates a per-session git worktree with isolated `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`. Pair with `worktree-reaper.sh` for teardown and `worktree-guard.sh` for lock enforcement |
| Session cleanup | `.opencode/scripts/session-cleanup.sh` (renamed from `claude-session-cleanup.sh` with a back-compat shim retained) resolves PIDs across claude/opencode/opencode runtimes |

Canonical command lifecycle: `/speckit:plan --intake-only` establishes or repairs the packet when standalone intake is needed, `/deep:research` follows `../system-deep-loop/deep-research/references/protocol/spec_check_protocol.md` when research needs bounded `spec.md` anchoring, and `/speckit:plan` or `/speckit:complete` continue from the same folder while reusing the shared intake contract (`.opencode/skills/system-spec-kit/references/workflows/intake_contract.md`) only when the local `folder_state` still needs repair. When intake runs, the returned `start_state` is the canonical downstream field.

**Remember**: This skill is the foundational documentation orchestrator. It enforces structure, template usage, context preservation, and workflow-required validation for all file modifications. Every conversation that modifies files MUST have a spec folder.

---

## 7. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/workflows/quick_reference.md`, `references/templates/template_guide.md`, `references/validation/validation_rules.md`, `references/memory/save_workflow.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/spec/validate.sh`, `scripts/spec/create.sh`, `scripts/dist/memory/generate-context.js`, `scripts/spec/check-completion.sh`.

Related skills: `sk-doc` for authored documentation quality, `sk-code` for code changes, `sk-git` for git handoff, and `system-deep-loop` for iterative research and audit (its `research` and `review` modes).
