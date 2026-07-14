---
name: deep-alignment
description: "Autonomous standard-authority conformance: audit artifacts by lane; verify-first, known-deviation suppression, read-only default."
allowed-tools: [Read, Grep, Glob, Task, Bash, memory_context, memory_search, code_graph_query]
version: 1.0.0.1
---
<!-- Note: read-only by default -- no Write/Edit in the default surface. Task/Bash are present but reserved for the gated, opt-in remediation pass; loop-owned state writes route through shared runtime scripts, not direct file edits. No WebFetch: alignment checks local artifacts against local authority standards. -->

<!-- Keywords: deep-alignment, alignment-lane, conformance-review, standard-authority, verify-first, known-deviation-suppression, read-only-default, gated-remediation, structured-scoping, artifact-conformance -->

# Autonomous Deep Alignment Loop

Structured conformance-review loop that checks artifacts against a named standard authority's own creation rules, not general code correctness. Each run resolves one or more alignment lanes (a standard authority, an artifact class, and a scope), audits the artifacts in each lane against that authority's own templates and standards, and reports findings that have been re-verified against live ground truth before being asserted.

## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Checking whether docs, code, configs, or git history in a scope follow a named authority's own creation standards, not general correctness
- Auditing multiple authorities in one run (for example sk-doc and sk-git and sk-design conformance together)
- Verifying a claimed "shipped to standard" state against live reality before trusting it
- Unattended or headless conformance sweeps across a repo or a spec folder

### When NOT to Use

- General code or doc correctness review with no specific named authority in mind (use `deep-review`)
- Checking hub structure such as folders, registries, or routing wiring rather than artifact content (use `parent-skill-check.cjs`)
- A single, already-known fix (go directly to implementation)
- A quick one-file check (use direct Grep/Read against the authority's own standards doc)

**Boundary**: `deep-alignment` is not `parent-skill-check.cjs` -- that script checks hub structure (folders, registries, routing wiring), not artifact content. `deep-alignment` is not `deep-review` -- that mode audits general code and doc correctness across arbitrary dimensions. `deep-alignment` audits artifact content conformance against one specific, named authority's own templates and creation standards.

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/deep:alignment` command. The command's YAML workflow owns state, dispatch, and convergence, mirroring every other mode in this hub.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize lanes or iterations
- Invoke cli-opencode / cli-claude-code directly in a loop to simulate iterations
- Dispatch the `@deep-alignment` LEAF agent via the Task tool for iteration loops (the agent is LEAF, a single iteration, and MUST be driven by the command's workflow)
- Skip the state machine or write ad-hoc state outside the bound spec folder's `alignment/` subdirectory
- Run the gated remediation pass without an explicit, separate operator opt-in

**ALWAYS:**
- Invoke via `/deep:alignment :auto` or `/deep:alignment :confirm`, supplying `[target] [authority]` and flags such as `--lane-config <file.json>` and `--max-iterations=N` (the full flag set is `/deep:alignment`'s own `argument-hint`, not duplicated here)
- Resolve lanes first (authority x artifact-class x scope) before any artifact is discovered
- Re-verify every finding against live ground truth before it is asserted
- Default to read-only; treat remediation as a separate, gated, opt-in pass

### Trigger Phrases

- "alignment lane" / "alignment conformance audit"
- "conformance review" / "standard authority check"
- "deep alignment" / "deep-alignment"
- "check against sk-doc/sk-git/sk-design/sk-code standards"
- "structured scoping review"

### Keyword Triggers

`deep alignment`, `alignment lane`, `conformance review`, `standard authority check`, `known-deviation suppression`, `verify-first`, `structured scoping`, `artifact conformance`

---

## 2. SMART ROUTING

`deep-alignment` is a nested mode-packet dispatched by the `system-deep-loop` hub, not a standalone skill; its own `references/` and `assets/` are private to this packet and are what this section routes across. `references/adapters/` holds one adapter spec plus one known-deviation list per registered authority; the remaining `references/*.md` hold the state-agnostic lane-resolution and state-machine protocol docs; `assets/` holds the runtime config template.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/scoping_protocol.md` |
| CONDITIONAL | If intent/state signals match | Lane config schema, discover contract, state-machine wiring, the active lane's authority adapter + known-deviation pair |
| ON_DEMAND | Only on explicit request | Adapter specs for authorities outside the active lane, `assets/deep_alignment_config_template.json` |

### Smart Router Pseudocode

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards markdown paths, checks `inventory`, and uses `seen`.
- Pattern 3: Extensible Routing Key - `get_routing_key()` derives the active state from dispatch context; `get_authority_key()` derives the active lane's authority.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` returns lane/state disambiguation and an unresolved state returns a "no alignment resources" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/scoping_protocol.md"

INTENT_SIGNALS = {
    "ALIGNMENT_SCOPE":    {"weight": 4, "keywords": ["alignment lane", "scoping question", "lane-config", "artifact-class", ":auto", ":confirm"]},
    "ALIGNMENT_DISCOVER": {"weight": 4, "keywords": ["discover contract", "adapter discover", "artifact corpus", "coverage graph seed"]},
    "ALIGNMENT_CHECK":    {"weight": 4, "keywords": ["standard source", "known deviation", "verify-first", "conformance check", "P0", "P1", "P2"]},
    "ALIGNMENT_CONVERGE": {"weight": 3, "keywords": ["alignment convergence", "coverage threshold", "stability window", "converged"]},
    "ALIGNMENT_REPORT":   {"weight": 3, "keywords": ["alignment report", "findings registry", "per-lane verdict", "overall verdict"]},
}

NOISY_SYNONYMS = {
    "ALIGNMENT_SCOPE":    {"three-axis question": 1.6, "authority scope tree": 1.5, "headless conformance sweep": 1.4},
    "ALIGNMENT_DISCOVER": {"seed FILE nodes": 1.5, "adapter contract": 1.4, "corpus partitioning": 1.4},
    "ALIGNMENT_CHECK":    {"re-probe finding": 1.5, "reasoning-agent dispatch": 1.4, "suppress known deviation": 1.4},
    "ALIGNMENT_CONVERGE": {"dry-run stability": 1.5, "coverage-and-stability": 1.5, "max iterations": 1.3},
    "ALIGNMENT_REPORT":   {"worst verdict rollup": 1.5, "one report per lane": 1.4},
}

# RESOURCE_MAP: state-scoped protocol references plus the config asset.
RESOURCE_MAP = {
    "ALIGNMENT_SCOPE":    ["references/scoping_protocol.md", "references/lane_config_schema.md"],
    "ALIGNMENT_DISCOVER": ["references/discover_contract.md"],
    "ALIGNMENT_CHECK":    ["references/state_machine_wiring.md"],
    "ALIGNMENT_CONVERGE": ["references/state_machine_wiring.md"],
    "ALIGNMENT_REPORT":   ["references/state_machine_wiring.md"],
}

# AUTHORITY_ADAPTER_MAP: per-authority adapter + known-deviation pair, keyed by the
# active lane's authority (not by intent) -- a run audits N lanes, each naming
# exactly one of these four registered authorities.
AUTHORITY_ADAPTER_MAP = {
    "sk-doc":    ["references/adapters/sk_doc_adapter.md", "references/adapters/sk_doc_known_deviations.md"],
    "sk-git":    ["references/adapters/sk_git_adapter.md", "references/adapters/sk_git_known_deviations.md"],
    "sk-design": ["references/adapters/sk_design_adapter.md", "references/adapters/sk_design_known_deviations.md", "references/adapters/sk_design_live_render_adapter.md"],
    "sk-code":   ["references/adapters/sk_code_adapter.md", "references/adapters/sk_code_known_deviations.md"],
}

PHASE_RESOURCE_MAP = {
    "scope":    ["references/scoping_protocol.md", "references/lane_config_schema.md"],
    "discover": ["references/discover_contract.md"],
    "iterate":  ["references/state_machine_wiring.md"],
    "converge": ["references/state_machine_wiring.md"],
    "report":   ["references/state_machine_wiring.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the resolved alignment lane (authority x artifact-class x scope)",
    "Confirm the current state (SCOPE/DISCOVER/ITERATE/CONVERGE/REPORT)",
    "Provide one concrete artifact path, finding, or expected verdict",
    "Confirm the verification command set before completion",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def get_routing_key(dispatch_context) -> str:
    state = str(getattr(dispatch_context, "state", "")).strip().lower()
    if state:
        return state
    text = str(getattr(dispatch_context, "text", "")).lower()
    if "converge" in text or "stability" in text:
        return "converge"
    if "report" in text or "verdict" in text:
        return "report"
    if "check" in text or "finding" in text:
        return "iterate"
    if "discover" in text or "corpus" in text:
        return "discover"
    return "scope"

def get_authority_key(dispatch_context) -> str:
    authority = str(getattr(dispatch_context, "authority", "")).strip().lower()
    return authority if authority in AUTHORITY_ADAPTER_MAP else ""

def route_alignment_resources(task, dispatch_context):
    inventory = discover_markdown_resources()
    routing_key = get_routing_key(dispatch_context)
    authority_key = get_authority_key(dispatch_context)
    scores = score_intents(task, INTENT_SIGNALS, NOISY_SYNONYMS)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    phase_resources = PHASE_RESOURCE_MAP.get(routing_key, [])
    if routing_key == "unknown" or not phase_resources:
        return {
            "routing_key": routing_key,
            "notice": f"No alignment resources found for routing key '{routing_key}'",
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    for relative_path in phase_resources:
        load_if_available(relative_path)

    for relative_path in AUTHORITY_ADAPTER_MAP.get(authority_key, []):
        load_if_available(relative_path)

    return {
        "routing_key": routing_key,
        "authority_key": authority_key or "unspecified",
        "intents": intents,
        "resources": loaded,
    }
```

### Phase Detection

| State | Signal | Resources to Load |
|-------|--------|-------------------|
| SCOPE | No `deep-alignment-config.json` yet, or lane-resolution/`--lane-config` keywords | `scoping_protocol.md`, `lane_config_schema.md` |
| DISCOVER | Config frozen, corpus not yet built | `discover_contract.md`, the active lane's `references/adapters/<authority>_adapter.md` |
| ITERATE | Corpus exists, `deep-alignment-state.jsonl` advancing | the active lane's adapter + known-deviations pair |
| CONVERGE | `check-convergence.cjs` dispatch context | `state_machine_wiring.md` (convergence formula) |
| REPORT | Convergence returned `CONVERGED`/`STOP_MAX_ITERATIONS`/`NOTHING_TO_CONVERGE` | `state_machine_wiring.md` (reducer wiring) |

---

## 3. HOW IT WORKS

### Architecture

Each run resolves to one or more alignment lanes, one lane per (standard authority x artifact class x scope) combination the operator names, either through an interactive three-axis question or a non-interactive lane-config file for headless invocation. A per-authority adapter separates "find the artifacts" from "find the standard" from "check the artifact against the standard," so the loop itself never branches on which authority it is running -- new authorities register by implementing the same three methods, not by changing the loop. The loop reuses the same convergence engine other iterative modes in this hub already run on rather than forking a parallel one.

### State Machine

`INIT` resolves the bound spec folder and loop configuration. `SCOPE` resolves the run's alignment lanes. `DISCOVER` finds the artifacts each lane covers. `ITERATE` checks artifacts against their lane's standard, slice by slice, re-verifying every finding before it is recorded. `CONVERGE` evaluates coverage and stability against the same thresholds this hub's other convergence-driven modes use. `REPORT` emits one alignment report per lane. An optional `REMEDIATE` state follows only when explicitly requested and approved -- it never runs as part of the default, read-only loop.

### The Alignment Contract

Four invariants, enforced by the engine itself and not left to individual adapters to opt into:

1. **Verify-first** -- every finding that claims a drift from live reality is re-probed against the real validator, CLI, or registry before it is asserted. Pattern-matching alone is never sufficient grounds for a finding.
2. **Known-deviation suppression** -- each authority's own standard source carries a list of accepted, intentional conventions, so a real repo-wide convention is never flagged as drift.
3. **Read-only by default** -- the loop observes and reports. It never modifies an audited artifact unless remediation is explicitly requested.
4. **Gated remediation** -- fixing findings is a separate, opt-in, operator-approved pass, not an automatic follow-on. When it runs, it stays verify-first and respects this repo's existing safety discipline: scoped staging only, a worktree when the branch has diverged, and doc-only restraint when concurrent sessions are live.

---

## 4. RULES

### ✅ ALWAYS

1. Resolve lanes before discovering artifacts. Never guess a scope.
2. Re-verify a finding against live ground truth before recording it.
3. Check every finding against its lane's known-deviation list before asserting drift.
4. Keep the audited target read-only outside a gated remediation pass.
5. Emit one report per lane, not one blended report across authorities.

### ❌ NEVER

1. Assert a finding from pattern-matching alone without a live re-probe.
2. Flag an authority's own documented, intentional convention as drift.
3. Modify an audited artifact during the default read-only loop.
4. Run remediation without an explicit, separate operator opt-in.
5. Blend structural hub-health checks or general correctness review into an alignment finding. Route those to `parent-skill-check.cjs` or `deep-review` instead.

### ⚠️ ESCALATE IF

1. **The operator requests remediation** -- confirm the exact scope (which findings, which lane) and get an explicit, separate opt-in before entering `REMEDIATE`; never treat a report review as implicit approval.
2. **`deep-alignment-state.jsonl` or a delta file is corrupted** -- cannot reconstruct iteration history; pause and report rather than guessing at prior findings.
3. **`check-convergence.cjs` returns `STOP_MAX_ITERATIONS` with lanes still uncovered or unstable** -- the run did not converge; report which lanes are unresolved rather than presenting a partial result as a clean pass.
4. **`loop-lock.cjs acquire` fails** -- another alignment run holds the lock on this spec folder; do not force-acquire or bypass the lock.
5. **A lane's overall verdict is `FAIL`** -- a confirmed P0 finding remains; human sign-off is required before treating the audited artifact as shipped-to-standard.

---

## 5. REFERENCES

### Core References

- [scoping_protocol.md](./references/scoping_protocol.md) - Three-axis ARTIFACT-CLASS x AUTHORITY x SCOPE lane resolution
- [lane_config_schema.md](./references/lane_config_schema.md) - `--lane-config` JSON shape, authority/artifact-class validity, and the error contract
- [discover_contract.md](./references/discover_contract.md) - The authority-agnostic `discover(scope) -> artifacts` half of the adapter contract
- [state_machine_wiring.md](./references/state_machine_wiring.md) - State-to-script wiring, the `alignment/` file layout, and the convergence formula
- [adapters/sk_doc_adapter.md](./references/adapters/sk_doc_adapter.md), [adapters/sk_git_adapter.md](./references/adapters/sk_git_adapter.md), [adapters/sk_design_adapter.md](./references/adapters/sk_design_adapter.md), [adapters/sk_design_live_render_adapter.md](./references/adapters/sk_design_live_render_adapter.md), [adapters/sk_code_adapter.md](./references/adapters/sk_code_adapter.md) - Per-authority `standardSource`/`discover`/`check` specifications
- [adapters/sk_doc_known_deviations.md](./references/adapters/sk_doc_known_deviations.md), [adapters/sk_git_known_deviations.md](./references/adapters/sk_git_known_deviations.md), [adapters/sk_design_known_deviations.md](./references/adapters/sk_design_known_deviations.md), [adapters/sk_code_known_deviations.md](./references/adapters/sk_code_known_deviations.md) - Per-authority known-deviation suppression lists

### Templates and Assets

- [deep_alignment_config_template.json](./assets/deep_alignment_config_template.json) - Config template with convergence defaults, file-protection rules, and script wiring

### Reference Loading Notes

- Load only the references the active state and the active lane's authority require.
- Keep `SMART ROUTING` (Section 2) as the single routing authority.

---

## 6. SUCCESS CRITERIA

### Alignment Run Completion Checklist

**A run is complete when**:
- ✅ Every resolved lane has been discovered and checked at least once
- ✅ Convergence reached `CONVERGED` (coverage AND stability), or a documented `STOP_MAX_ITERATIONS`/`NOTHING_TO_CONVERGE` outcome
- ✅ Every finding was re-verified against live ground truth before being recorded (verify-first)
- ✅ Every finding was checked against its lane's known-deviation list before being asserted as drift
- ✅ `alignment-report.md` carries one section per lane plus an overall worst-verdict rollup
- ✅ `deep-alignment-findings-registry.json` and all canonical state files parse cleanly

### Quality Targets

- **Artifact coverage**: 100% of discovered artifacts checked at least once per lane (`coverageThreshold: 1.0`)
- **Dry-run stability**: the last 2 iteration records report `newFindingsRatio === 0` (`stabilityWindow: 2`)
- **Max iterations**: 10, an independent hard stop applied regardless of the coverage-AND-stability outcome

### Validation Success

**Validation passes when**:
- ✅ `node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` passes
- ✅ `node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs <spec-folder>` returns a JSON summary with `registryPath`, `reportPath`, `overallVerdict`, `laneCount`, `findingsBySeverity`, and `corruptionCount`
- ✅ `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/system-deep-loop/deep-alignment --check` prints `Result: PASS`

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md or AGENTS.md). Skill routing follows this hub's own advisor wiring; file modifications during a run require the same spec-folder discipline as any other mutation.

### Cross-Workflow Contracts

`/deep:alignment` is this mode's invocation point; its command workflow owns state, dispatch, and convergence. The bound spec folder's `alignment/` subdirectory is the only writable state surface outside a gated `REMEDIATE` pass.

### Tool Usage Guidelines

**Task**: reserved for the command executor's iteration dispatch; never used to hand-dispatch the `@deep-alignment` LEAF agent directly for looping.

**Bash**: runs the state-machine scripts (`scoping.cjs`, `check-convergence.cjs`, `partition-corpus.cjs`, each adapter's CLI) and the gated `remediate-hook.cjs`; never a custom ad-hoc dispatcher.

**Grep/Glob/Read**: used by adapters and the loop to discover artifacts and re-verify findings against live ground truth.

### Knowledge Base Dependencies

**Required**: `references/scoping_protocol.md` and `references/lane_config_schema.md` for lane resolution; `references/discover_contract.md` and the active lane's `references/adapters/<authority>_adapter.md` for discovery and checking; `references/state_machine_wiring.md` for convergence and reducer wiring.

**Optional**: the remaining per-authority adapter and known-deviation docs, loaded only when a lane names that authority.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference and asset docs dynamically under `references/` and `assets/`. Start with `references/scoping_protocol.md`, `references/lane_config_schema.md`, `references/discover_contract.md`, and `references/state_machine_wiring.md`, then load the active lane's `references/adapters/<authority>_adapter.md` and `<authority>_known_deviations.md` pair, and `assets/deep_alignment_config_template.json` when the config shape is needed.

Scripts: `scripts/scoping.cjs`, `scripts/check-convergence.cjs`, `scripts/partition-corpus.cjs`, `scripts/remediate-hook.cjs`, and `scripts/adapters/<authority>.cjs`.

Related skills: `deep-review` for general-correctness iterative review sharing this hub's convergence engine, `parent-skill-check.cjs` for the hub structural checks this mode does not duplicate, and `system-spec-kit` for command-owned state and continuity saves.
