---
title: "System Spec Kit Router"
description: "Sibling router for system-spec-kit: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "system-spec-kit router"
  - "system-spec-kit routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# System Spec Kit Router

The machine router for [`SKILL.md`](../../../.skilled/skills/system-spec-kit/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request that writes any file reaches system-spec-kit — a create, an add, an update, a fix, a rename or a configure — and so do a memory save, a resume, a validation question and an explicit spec-folder, phase, handover or goal request.
This router keeps `references/workflows/quick-reference.md` as the first touch on every invocation, then selects from the retrieval, memory, template, validation, structure, workflow, debugging, CLI and config reference families plus the `assets/` decision matrices and template maps, by intent.
A request that matches no intent returns `UNKNOWN_FALLBACK` and its checklist rather than a silent default.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

`references/workflows/quick-reference.md` loads first on every invocation and most intents list it too; each bullet names the intent-specific files.

- **PLAN** — "plan", "design", "new spec", "level selection" and "option b" requests, and the `/speckit:plan` boost, load `references/workflows/spec-authoring-card.md`, `references/workflows/intake-contract.md`, `references/validation/template-compliance-contract.md`, `assets/level-decision-matrix.md`, `assets/complexity-decision-matrix.md`, `references/templates/level-selection-guide.md`, `references/templates/level-specifications.md` and `references/structure/folder-structure.md`.
- **RESEARCH** — "investigate", "explore", "analyze", "prior work" and "evidence" requests load `references/workflows/quick-reference.md`, `references/workflows/worked-examples.md`, `references/memory/epistemic-vectors.md`, `references/retrieval/retrieval-conventions.md` and `references/structure/grep-convention.md`.
- **IMPLEMENT** — "implement", "build", "execute" and "workflow" requests, and the `/speckit:implement` boost, load `references/validation/validation-rules.md`, `references/validation/template-compliance-contract.md`, `references/workflows/spec-authoring-card.md`, `assets/template-mapping.md`, `references/workflows/execution-methods.md` and `references/validation/path-scoped-rules.md`.
- **DEBUG** — "stuck", "error", "not working", "failed" and "debug" requests load `references/debugging/troubleshooting.md` and `references/debugging/universal-debugging-methodology.md`.
- **COMPLETE** — "done", "complete", "finish", "verify" and "checklist" requests, and the `/speckit:complete` boost, load `references/validation/validation-rules.md`, `references/workflows/nested-changelog.md`, `references/workflows/intake-contract.md`, `references/workflows/spec-folder-write-recipe.md`, `references/workflows/spec-folder-authoring-checklist.md`, `references/validation/decision-format.md` and `references/validation/five-checks.md`.
- **MEMORY** — "memory", "save context", "resume", "checkpoint" and "context" requests, and the `/speckit:search`, `/speckit:save` and `/speckit:resume` boosts, load `references/memory/memory-system.md`, `references/memory/save-workflow.md`, `references/memory/trigger-config.md` and `references/structure/folder-routing.md`.
- **HANDOVER** — "handover", "continue later", "next session" and "pause" requests load `references/workflows/quick-reference.md` and nothing else, so the session-end handoff never pulls a packet template.
- **PHASE** — "phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased" and "multi-session" requests, and the `/speckit:plan :with-phases` boost, load `references/structure/phase-definitions.md`, `references/structure/sub-folder-versioning.md`, `references/validation/phase-checklists.md` and `references/structure/phase-system.md`.
- **RETRIEVAL_TUNING** — "retrieval", "search tuning", "fusion", "scoring" and "pipeline" requests load `references/memory/embedder-pluggability.md` and `references/memory/trigger-config.md`.
- **INTAKE** — "intake", "folder_state", "start_state", "repair-mode" and "intake-only" requests, and the `/speckit:plan --intake-only` boost, load `references/workflows/intake-contract.md`, `references/workflows/spec-authoring-card.md` and `references/validation/template-compliance-contract.md`.
- **HOOKS** — "hook", "skill advisor hook", "advisor hook", "prompt-time advisor", "advisor_validate", "goal plugin", "opencode-goal", "/goal", "active_goal", "session goal", "set goal", "bind goal", "update the goal", "resend goal" and "durable slice" requests load `references/config/hook-system.md` and `references/workflows/goal-set-string-playbook.md`.
- **LAUNCHER** — "launcher", "lease", "pid file", "single-writer" and "lease_held_by" requests load `references/config/launcher-lease.md` and `references/memory/memory-system.md`.
- **RENAME** — "rename", "mechanical refactor", "rename pattern", "git mv" and "case variants" requests load `references/workflows/rename-pattern.md`.
- **EVALUATION** — "evaluate", "ablation", "benchmark", "baseline" and "metrics" requests load `references/memory/epistemic-vectors.md` and `references/config/environment-variables.md`.
- **SCORING_CALIBRATION** — "calibration", "scoring", "normalization", "decay" and "interference" requests load `references/config/environment-variables.md`.
- **ROLLOUT_FLAGS** — "feature flag", "rollout", "toggle", "enable" and "disable" requests load `references/config/environment-variables.md`.
- **GOVERNANCE** — "governance", "tenant", "retention" and "audit" requests load `references/config/environment-variables.md`.
- **DISPATCH** — "dispatch", "parallel agents", "agent header", "result envelope", "sub-agent" and "fan-out" requests load `references/workflows/agent-io-contract.md` and `assets/parallel-dispatch-config.md`.
- **AUTO_MODE** — ":auto", "auto mode", "autopilot", "unattended" and "setup resolution" requests load `references/workflows/auto-mode-contract.md`.
- **CLI_TRANSPORT** — "daemon cli", "cli shim", "memory handback", "smart router", "cli-*" and "warm-only" requests load `references/cli/daemon-cli-reference.md`, `references/cli/memory-handback.md` and `references/cli/shared-smart-router.md`.
- **TEMPLATE_AUTHORING** — "template style", "author a template", "template convention", "tmpl" and "template anchors" requests load `references/templates/template-style-guide.md` and `references/workflows/spec-authoring-card.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail behind the summary: the resource domains, the template and script sources of truth, the loading levels and the intent tables.

### Resource Domains

This skill uses simple intent/domain routing, not keyed runtime resource routing.
It does not select whole `references/<key>/` or `assets/<key>/` subtrees based on project, mode, stack or model signals.
Instead, the router recursively discovers markdown resources from `references/` and `assets/`.
It then applies intent scoring from `RESOURCE_MAP` to load real, guarded resources from the current inventory.
Keep this section focused on domains rather than static file inventories.

- `references/retrieval/` for the trigger-index lookup and the ripgrep recipes.
- `references/memory/` for continuity save workflows, trigger-phrase behavior, and the shared embedding stack.
- `references/templates/` for level selection, template selection, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows, shared intake, rename procedures, and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/cli/` for daemon CLI behavior, shared smart-router behavior, and continuity handback contracts.
- `references/config/` for runtime environment configuration and launcher/lease contracts.
- `assets/*.md` for shared decision matrices, template mapping, and parallel dispatch support.

**Typed leaf projection (fleet routing standard).** system-spec-kit is a normal, registry-less single-mode skill. Its sole workflow mode is `system-spec-kit`, and there is no `mode-registry.json`.

- Its router routes ONLY into the `references/` and `assets/` doc corpora. These are the only routable leaves.
- Every leaf is enumerated in `leaf-manifest.json`, generated from `leaf-manifest.config.json` (`generate-leaf-manifest.cjs --write .skilled/skills/system-spec-kit`; byte-stable under `--check`).
- `leaf-aliases.json` binds each router-emitted root-relative path (e.g. `references/memory/memory-system.md`) to its typed `(system-spec-kit, leafResourceId)` identity. A deterministic router replay recovers real typed pairs against the manifest.
- The `RESOURCE_MAP` below names every leaf in that manifest under at least one intent. Each reference and asset is reachable through the router and by browsing.
- The one exception is `references/templates/template-guide.md`, which the `ON_DEMAND` level loads on request.
- The manifest stays the inventory. A leaf added to the corpus without an intent is a routing gap to close, not a browse-only tier.
- Remaining package content is deliberately NOT routable. `runtime/cli/`, `runtime/`, `shared/`, `templates/`, `changelog/` and other engine dirs are the spec-kit runtime.
- `feature-catalog/` and `manual-testing-playbook/` are runtime-engine capability docs and behavior-test fixtures. No `RESOURCE_MAP` intent selects them, so they are excluded from `leafRoots` and never appear in the manifest.
- This is an intentionally thin router. It maps spec-folder workflow intents (plan, implement, complete, memory, phase, hooks, …) to a small set of reference docs. The large playbook chiefly exercises validation and generator behavior rather than doc routing. Most scenarios carry empty typed gold.
- Regenerate `leaf-manifest.json` and keep `leaf-aliases.json` in sync whenever the `references/` or `assets/` corpus changes.

### Template and Script Sources of Truth

- Level definitions and template size guidance: level specifications reference
- Template usage and composition rules: [template-guide.md](../../../.skilled/skills/system-spec-kit/references/templates/template-guide.md)
- Use the Level contract for operational templates; `create.sh` and the Level contract resolver share the same template index.
- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
- Script architecture, build outputs, and runtime entrypoints: [runtime/cli/README.md](../../../.skilled/skills/system-spec-kit/runtime/cli/README.md)
- Memory save JSON schema and workflow contracts: [save-workflow.md](../../../.skilled/skills/system-spec-kit/references/memory/save-workflow.md)
- Nested packet changelog workflow: [nested-changelog.md](../../../.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md)

Primary operational scripts:
- `spec/validate.sh`
- `spec/create.sh`
- `spec/archive.sh`
- `spec/refresh-track-roots.mjs`
- `spec/sweep-track-roots.mjs`
- `spec/check-completion.sh`
- `spec/recommend-level.sh`
- `runtime/lib/templates/level-contract-resolver.ts`

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

`references/workflows/quick-reference.md` is the primary first-touch command surface.
Keep the compact `spec_kit` and `memory` command map there.
Include these entries:
- `/speckit:plan --intake-only` as the standalone intake entry.
- `/speckit:plan` and `/speckit:complete` smart delegation notes.
- The pointer from `/deep:research` to `../system-deep-loop/deep-research/references/protocol/spec-check-protocol.md`.

Use this file only to point readers to the command map. Do not duplicate the full matrix here.

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
DEFAULT_RESOURCE = "references/workflows/quick-reference.md"

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
    "HOOKS": {"weight": 4, "keywords": ["hook", "skill advisor hook", "advisor hook", "prompt-time advisor", "advisor_validate", "goal plugin", "opencode-goal", "/goal", "active_goal", "session goal", "set goal", "bind goal", "update the goal", "resend goal", "durable slice"]},
    "LAUNCHER": {"weight": 4, "keywords": ["launcher", "lease", "pid file", "single-writer", "lease_held_by"]},
    "RENAME": {"weight": 3, "keywords": ["rename", "mechanical refactor", "rename pattern", "git mv", "case variants"]},
    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "tenant", "retention", "audit"]},
    "DISPATCH": {"weight": 3, "keywords": ["dispatch", "parallel agents", "agent header", "result envelope", "sub-agent", "fan-out"]},
    "AUTO_MODE": {"weight": 3, "keywords": [":auto", "auto mode", "autopilot", "unattended", "setup resolution"]},
    "CLI_TRANSPORT": {"weight": 3, "keywords": ["daemon cli", "cli shim", "memory handback", "smart router", "cli-*", "warm-only"]},
    "TEMPLATE_AUTHORING": {"weight": 3, "keywords": ["template style", "author a template", "template convention", "tmpl", "template anchors"]},
}

RESOURCE_MAP = {
    "PLAN": [
        "references/workflows/spec-authoring-card.md",
        "references/workflows/intake-contract.md",
        "references/validation/template-compliance-contract.md",
        "assets/level-decision-matrix.md",
        "assets/complexity-decision-matrix.md",
        "references/templates/level-selection-guide.md",
        "references/templates/level-specifications.md",
        "references/structure/folder-structure.md",
    ],
    "RESEARCH": [
        "references/workflows/quick-reference.md",
        "references/workflows/worked-examples.md",
        "references/memory/epistemic-vectors.md",
        "references/retrieval/retrieval-conventions.md",
        "references/structure/grep-convention.md",
    ],
    "IMPLEMENT": [
        "references/validation/validation-rules.md",
        "references/validation/template-compliance-contract.md",
        "references/workflows/spec-authoring-card.md",
        "assets/template-mapping.md",
        "references/workflows/execution-methods.md",
        "references/validation/path-scoped-rules.md",
    ],
    "DEBUG": [
        "references/debugging/troubleshooting.md",
        "references/debugging/universal-debugging-methodology.md",
        "references/workflows/quick-reference.md",
    ],
    "COMPLETE": [
        "references/validation/validation-rules.md",
        "references/workflows/nested-changelog.md",
        "references/workflows/intake-contract.md",
        "references/workflows/spec-folder-write-recipe.md",
        "references/workflows/spec-folder-authoring-checklist.md",
        "references/validation/decision-format.md",
        "references/validation/five-checks.md",
    ],
    "MEMORY": [
        "references/memory/memory-system.md",
        "references/memory/save-workflow.md",
        "references/memory/trigger-config.md",
        "references/structure/folder-routing.md",
    ],
    "HANDOVER": [
        "references/workflows/quick-reference.md",
    ],
    "PHASE": [
        "references/structure/phase-definitions.md",
        "references/structure/sub-folder-versioning.md",
        "references/validation/phase-checklists.md",
        "references/structure/phase-system.md",
    ],
    "RETRIEVAL_TUNING": [
        "references/memory/embedder-pluggability.md",
        "references/memory/trigger-config.md",
    ],
    "INTAKE": [
        "references/workflows/intake-contract.md",
        "references/workflows/spec-authoring-card.md",
        "references/validation/template-compliance-contract.md",
    ],
    "HOOKS": [
        "references/config/hook-system.md",
        "references/workflows/goal-set-string-playbook.md",
    ],
    "LAUNCHER": [
        "references/config/launcher-lease.md",
        "references/memory/memory-system.md",
    ],
    "RENAME": [
        "references/workflows/rename-pattern.md",
    ],
    "EVALUATION": [
        "references/memory/epistemic-vectors.md",
        "references/config/environment-variables.md",
    ],
    "SCORING_CALIBRATION": [
        "references/config/environment-variables.md",
    ],
    "ROLLOUT_FLAGS": [
        "references/config/environment-variables.md",
    ],
    "DISPATCH": [
        "references/workflows/agent-io-contract.md",
        "assets/parallel-dispatch-config.md",
    ],
    "AUTO_MODE": [
        "references/workflows/auto-mode-contract.md",
    ],
    "CLI_TRANSPORT": [
        "references/cli/daemon-cli-reference.md",
        "references/cli/memory-handback.md",
        "references/cli/shared-smart-router.md",
    ],
    "TEMPLATE_AUTHORING": [
        "references/templates/template-style-guide.md",
        "references/workflows/spec-authoring-card.md",
    ],
    "GOVERNANCE": [
        "references/config/environment-variables.md",
    ],
}

COMMAND_BOOSTS = {
    "/speckit:plan": "PLAN",
    "/speckit:implement": "IMPLEMENT",
    "/speckit:complete": "COMPLETE",
    "/speckit:plan --intake-only": "INTAKE",
    "/speckit:plan :with-phases": "PHASE",
    "/speckit:search": "MEMORY",
    "/speckit:save": "MEMORY",
    "/speckit:resume": "MEMORY",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full validation", "full checklist", "full template", "save context", "/speckit:save", "/speckit:resume", "implementation-summary", "tasks.md", "spec folder", "phase folder", "description metadata"],
    "ON_DEMAND": [
        "references/validation/phase-checklists.md",
        "references/templates/template-guide.md",
        "references/workflows/intake-contract.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is planning, memory, validation, phase, debug, or completion work",
    "Confirm the target spec folder or command surface",
    "Provide one concrete file, error, or expected output",
    "Confirm which verification gate must pass",
]

# _task_text, score_intents and select_intents: bodies in references/cli/shared-smart-router.md
# section 2 and .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md.
# This skill's own terms: _task_text also reads task.command, score_intents adds +6 for a
# COMMAND_BOOSTS prefix and matches keywords as substrings.

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

    # load_if_available: defined in references/cli/shared-smart-router.md section 2

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
