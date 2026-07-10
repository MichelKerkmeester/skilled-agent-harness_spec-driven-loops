---
name: deep-ai-council
description: "AI Council: multi-seat planning, artifact persistence, convergence checks, packet-local ai-council outputs."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 2.4.0.0
---

<!-- Keywords: deep-ai-council, ai council, council deliberation, multi-seat planning, ai-council artifacts, council convergence, planning council, council artifact persistence -->

# AI Council

Planning-only council deliberation with diverse seats, convergence checks, and packet-local `ai-council/**` artifact persistence.

> Convergence threshold semantics: see [`references/convergence/convergence_signals.md`](references/convergence/convergence_signals.md). Deep Mode (iterative multi-topic): see [`references/convergence/depth_dispatch.md`](references/convergence/depth_dispatch.md).

---

## 1. OPERATIONAL MODES — IN-CLI (PRIMARY) + EXTERNAL-CLI (SECONDARY)

The council is **primarily an IN-CLI capability**. When invoked from inside an active runtime (OpenCode, Claude Code, OpenCode), the council deliberates using THAT runtime's own models and reasoning lenses as seats. No external dispatch is required for the common case — the active CLI's own model bench (e.g. Opus + Sonnet + Haiku on Claude Code; gpt-5.5 + gpt-5.5-pro + gpt-5.5-xhigh on OpenCode; direct DeepSeek, Xiaomi, and OpenAI provider models on OpenCode) supplies the seat diversity for a round.

**External-CLI dispatch is a SECONDARY, optional mode** for cases where a different AI vantage adds value (e.g. a fresh OpenCode perspective from inside a Claude Code session, or DeepSeek/Kimi via cli-opencode from inside another runtime). It is invoked via the `cli-*` skill family (`cli-claude-code`, `cli-opencode`) — never directly from this skill.

**Both modes obey the one-CLI-per-round invariant** (§5 ALWAYS rule 6):
- In-CLI round: all seats use the current runtime's models.
- External-CLI round: all seats use ONE external CLI (e.g. all `cli-claude-code` seats with different reasoning levels, OR all `cli-opencode` seats with different direct-provider models).
- Cross-CLI deliberation is staged as MULTIPLE rounds (one in-CLI + one external, or two different externals) — never folded into the same round.

The default and most common council run is a single in-CLI round. Add external rounds only when the active runtime cannot supply the required vantage or when explicit cross-AI validation is requested.

---

## 2. WHEN TO USE

### Activation Triggers

Use this skill when a request needs:

- Multi-seat AI council deliberation before a plan is chosen.
- Comparison of implementation, refactor, architecture, or research strategies.
- Packet-local persistence of council reports, state, seats, deliberations, and rollback evidence.
- Recovery, audit, or completion checks for existing council artifacts.

### Use Cases

### Council Planning

- Compare two or more implementation plans.
- Ask multiple reasoning lenses to critique a proposed direction.
- Decide whether a plan has enough agreement to proceed.

### Artifact Persistence

- Persist a captured council report into packet-local artifacts.
- Verify append-only state records and final `council_complete` events.
- Preserve failed rounds for forensic inspection.

### Recovery And Audit

- Inspect incomplete council output.
- Check convergence decisions against the two-of-three rule.
- Validate planning-only boundaries before handoff to implementation agents.

### When NOT to Use

Do not use this skill for:

- Direct implementation work, code edits, or spec-doc authorship outside council artifacts.
- Treating council graph rows as source-of-truth or replacing packet-local `ai-council/**` artifacts.
- Single-answer planning where no meaningful strategic disagreement is needed.
- Claims that external AI systems participated when they did not actually run.

### Keyword Triggers

- deep-ai-council
- ai council
- council deliberation
- multi-seat planning
- planning council
- council artifacts
- council convergence
- council graph
- packet-local ai-council

---

## 3. SMART ROUTING

### Primary Detection Signal

```bash
request_text="$(printf '%s' "$USER_REQUEST" | tr '[:upper:]' '[:lower:]')"
case "$request_text" in
  *"deep ai council"*|*"ai council"*|*"council deliberation"*|*"planning council"*) COUNCIL_INTENT=1 ;;
  *"persist council"*|*"ai-council artifact"*|*"council_complete"*) COUNCIL_INTENT=1 ;;
  *) COUNCIL_INTENT=0 ;;
esac
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect council intent, packet persistence intent, recovery/audit intent, or convergence intent
    +- STEP 1: Score intents and keep top-2 when ambiguity is small
    +- Phase 1: Dispatch or simulate diverse council seats
    +- Phase 2: Deliberate, critique, and test convergence
    +- Phase 3: Persist artifacts, verify state, and hand off planning result
```

### Resource Domains

The router discovers markdown resources recursively from `references/`, `assets/`, and `manual_testing_playbook/`, then applies intent scoring from `INTENT_MODEL`.

```text
references/*.md
assets/*.md
manual_testing_playbook/**/*.md
```

- `references/` contains the quick reference, loop protocol, council state, folder layout, seat diversity, output schema, convergence signals, and caller wiring.
- `assets/` contains council config, round strategy, dashboard, prompt-pack, and runtime capability templates. Markdown assets are routable; JSON/TMPL assets are operator/runtime inputs.
- `manual_testing_playbook/` contains operator validation scenarios for routing, deliberation, persistence, convergence, rollback, scope boundaries, council-graph integration, and council-graph value comparison (32 scenarios across 9 categories).
- `feature_catalog/` mirrors the playbook 1:1 with one user-facing feature entry per scenario (32 entries) — start here for "what does DAC-NNN actually do" lookups.
- `scripts/` contains deterministic helpers; scripts are invoked explicitly and are not markdown-routed. Notable entries: `persist-artifacts.cjs` (artifact writer CLI), `replay-graph-from-artifacts.cjs` (DAC-025 derived-projection rebuild — reads `ai-council-state.jsonl` and writes through `runtime//scripts/upsert.cjs --loop-type council`, with `--dry-run` for payload inspection).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/integration/quick_reference.md` |
| CONDITIONAL | Intent signals match | Intent-mapped references from `RESOURCE_MAP` |
| ON_DEMAND | Explicit validation or operator testing | `manual_testing_playbook/manual_testing_playbook.md` and scenario files |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets", SKILL_ROOT / "manual_testing_playbook")
DEFAULT_RESOURCE = "references/integration/quick_reference.md"

INTENT_MODEL = {
    "COUNCIL_RUN": {"keywords": [("deep ai council", 5), ("council deliberation", 5), ("planning council", 4), ("strategy comparison", 3)]},
    "COUNCIL_SETUP": {"keywords": [("quick reference", 3), ("loop protocol", 4), ("council setup", 4), ("round strategy", 4), ("council dashboard", 3)]},
    "ARTIFACT_PERSISTENCE": {"keywords": [("persist council", 5), ("ai-council artifact", 5), ("council report parser", 4), ("state jsonl", 3)]},
    "RECOVERY_OR_AUDIT": {"keywords": [("rollback", 4), ("audit", 3), ("missing council_complete", 5), ("completion advisory", 4)]},
    "CONVERGENCE_CHECK": {"keywords": [("convergence", 4), ("two-of-three", 5), ("max rounds", 3), ("non-converged", 4)]},
    "SCORING": {"keywords": [("scoring rubric", 5), ("five-dimension", 5), ("hunter skeptic referee", 5), ("comparison table", 4)]},
    "DEPTH_DISPATCH": {"keywords": [("depth 0", 5), ("depth 1", 5), ("parallel dispatch", 4), ("sequential thinking", 4), ("ndp compliant", 4)]},
    "FAILURE_HANDLING": {"keywords": [("seat timeout", 5), ("all seats fail", 5), ("contradiction without resolution", 4), ("insufficient vantage", 4)]},
    "ANTI_PATTERNS": {"keywords": [("anti-pattern", 5), ("convergence sycophancy", 5), ("fake consensus", 4), ("recursive council", 4)]},
    "GRAPH_SUPPORT": {"keywords": [("council graph", 5), ("graph support", 4), ("derived graph", 5), ("council_graph", 5)]},
}

RESOURCE_MAP = {
    "COUNCIL_RUN": ["references/integration/loop_protocol.md", "references/patterns/seat_diversity_patterns.md", "references/convergence/convergence_signals.md", "references/structure/output_schema.md", "assets/deep_ai_council_strategy.md"],
    "COUNCIL_SETUP": ["references/integration/quick_reference.md", "references/integration/loop_protocol.md", "assets/deep_ai_council_strategy.md", "assets/deep_ai_council_dashboard.md"],
    "ARTIFACT_PERSISTENCE": ["references/structure/folder_layout.md", "references/structure/output_schema.md", "references/structure/state_format.md", "references/patterns/command_wiring.md", "references/scoring/findings_registry.md", "assets/deep_ai_council_dashboard.md"],
    "RECOVERY_OR_AUDIT": ["references/structure/state_format.md", "references/structure/folder_layout.md", "references/patterns/command_wiring.md", "references/integration/loop_protocol.md"],
    "CONVERGENCE_CHECK": ["references/convergence/convergence_signals.md", "references/patterns/seat_diversity_patterns.md", "references/structure/state_format.md", "references/integration/loop_protocol.md"],
    "SCORING": ["references/scoring/scoring_rubric.md"],
    "DEPTH_DISPATCH": ["references/convergence/depth_dispatch.md", "references/convergence/deep_mode.md", "references/scoring/findings_registry.md"],
    "FAILURE_HANDLING": ["references/convergence/failure_handling.md"],
    "ANTI_PATTERNS": ["references/patterns/anti_patterns.md"],
    "GRAPH_SUPPORT": ["references/integration/graph_support.md", "references/structure/state_format.md", "references/structure/folder_layout.md"],
}

LOAD_LEVELS = {
    "COUNCIL_RUN": "CONDITIONAL",
    "COUNCIL_SETUP": "CONDITIONAL",
    "ARTIFACT_PERSISTENCE": "CONDITIONAL",
    "RECOVERY_OR_AUDIT": "CONDITIONAL",
    "CONVERGENCE_CHECK": "CONDITIONAL",
    "SCORING": "CONDITIONAL",
    "DEPTH_DISPATCH": "CONDITIONAL",
    "FAILURE_HANDLING": "CONDITIONAL",
    "ANTI_PATTERNS": "CONDITIONAL",
    "GRAPH_SUPPORT": "CONDITIONAL",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is council setup, planning, persistence, recovery, or convergence checking",
    "Confirm the packet/spec folder for any artifact persistence",
    "Confirm whether external AI vantages actually ran or must be labeled simulated",
    "Confirm the planning-only handoff target before implementation starts",
]

AMBIGUITY_DELTA = 1

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

def classify_intents(user_request, task=None):
    text = " ".join([str(user_request or ""), str(getattr(task, "intent", "") or "")]).lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, config in INTENT_MODEL.items():
        for keyword, weight in config["keywords"]:
            if keyword in text:
                scores[intent] += weight
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("COUNCIL_RUN", None, scores)
    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def get_routing_key(task, intents: list[str]) -> str:
    override = str(getattr(task, "routing_key", "")).strip().upper()
    if override in RESOURCE_MAP:
        return override
    intent = str(getattr(task, "intent", "")).strip().upper()
    if intent in RESOURCE_MAP:
        return intent
    return intents[0] if intents else "UNKNOWN"

def route_sk_ai_council_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    keyed_prefixes = [f"references/{routing_key.lower()}/", f"assets/{routing_key.lower()}/", f"manual_testing_playbook/{routing_key.lower()}/"]
    keyed_docs = sorted(path for path in inventory if any(path.startswith(prefix) for prefix in keyed_prefixes))
    for relative_path in keyed_docs:
        load_if_available(relative_path)

    if routing_key not in RESOURCE_MAP and not keyed_docs:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "notice": f"No knowledge base found for routing key '{routing_key}'",
            "resources": loaded,
        }

    return {
        "routing_key": routing_key,
        "intents": intents,
        "intent_scores": scores,
        "load_level": LOAD_LEVELS.get(routing_key, "CONDITIONAL"),
        "resources": loaded,
    }
```

---

## 4. HOW IT WORKS

### Council Workflow Overview

The skill guides planning-only council runs from packet resolution through deliberation, persistence, and handoff. It keeps council artifacts under `ai-council/**` and leaves implementation to the caller or implementation agents.

**Process Flow**:

```text
STEP 1: Resolve And Prepare
       |-- Resolve target spec folder before any persistence
       |-- Load packet context and needed evidence
       |-- Select 2-3 distinct seats
       v
STEP 2: Deliberate And Converge
       |-- Run independent proposals
       |-- Run adversarial cross-seat critique
       |-- Apply two-of-three convergence or emit non-converged status
       v
STEP 3: Persist And Hand Off
       |-- Produce required report sections
       |-- Persist packet-local artifacts when caller has write context
       |-- Verify completion and hand planning to implementation agents
```

### Six-Step Operational Flow

1. Resolve the target spec folder before any council execution.
2. Select two or three distinct council seats with different reasoning lenses and, when real executors are available, different AI vantage targets.
3. Deliberate across independent proposals, adversarial critique, and convergence reconciliation.
4. Return a council report with required sections from `references/structure/output_schema.md`.
5. Persist packet-local artifacts with `scripts/persist-artifacts.cjs` when the caller owns a write-capable context.
6. Verify completion with `scripts/advise-council-completion.cjs` and the append-only state rules in `references/structure/state_format.md`.

### Resource Usage Pattern

**Scripts**:

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report>
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

**References**: load `quick_reference.md` first, then intent-specific references through Section 3. Load `output_schema.md` before persistence or report validation.

**Manual testing**: load `manual_testing_playbook/manual_testing_playbook.md` only for operator validation and release checks.

---

## 5. RULES

### ✅ ALWAYS

1. **ALWAYS keep council writes scoped to packet-local `ai-council/**` artifacts**
   - This preserves the planning-only boundary and avoids mutating implementation or spec-doc surfaces.

2. **ALWAYS preserve the planning-only boundary**
   - Implementation remains with implementation agents, commands, or the top-level caller after handoff.

3. **ALWAYS use distinct strategy lenses**
   - Label simulated vantages honestly when an external AI system did not actually run.

4. **ALWAYS append a `council_complete` event for completed persisted runs**
   - State is append-only and completion must be auditable.

5. **ALWAYS treat council graph support as a derived projection**
   - The graph is rebuilt from packet-local `ai-council/**` artifacts and must not replace append-only council state.

6. **ALWAYS run a single CLI per round (one-CLI-per-round invariant)**
   - All seats within ONE deliberation round MUST be dispatched through the SAME CLI executor (e.g. all seats from `cli-claude-code`, OR all seats from `cli-opencode`, OR all seats from `cli-opencode`). Seat diversity WITHIN a round comes from different models/reasoning lenses on the same CLI (e.g. `deepseek/deepseek-v4-pro --variant high` + `xiaomi/mimo-v2.5-pro`).
   - Mixing executors within one round (e.g. one seat via OpenCode + one seat via OpenCode + one seat via Claude Code) is FORBIDDEN — it conflates orchestration boundaries, complicates rollback, and produces noisy convergence signals because per-CLI guarantees (sandbox, runtime, tool surface, output schema) differ.
   - When MULTIPLE CLIs are appropriate for a deliberation, each additional CLI is a NEW DEDICATED ROUND with its own state event, its own seats, and its own convergence pass — never folded into the same round.

### ❌ NEVER

1. **NEVER write application code, authored spec docs, or files outside `ai-council/**` as part of a council run**
   - The council recommends; it does not implement.

2. **NEVER add backward-compatible old-name shims without concrete active-consumer evidence**
   - Rename support should follow real consumers, not speculation.

3. **NEVER claim an external CLI or AI system participated unless it actually ran**
   - Simulated perspectives must be explicitly labeled.

4. **NEVER rewrite historical state rows**
   - State evolution is additive-only; append new events instead.

5. **NEVER mix CLI executors across seats within a single round**
   - See ALWAYS rule 6. A round is defined by its CLI; a CLI change is a round boundary, not a seat boundary.

### ⚠️ ESCALATE IF

1. **ESCALATE IF no packet/spec folder can be resolved for artifact persistence**
   - Ask for the destination before dispatching seats or writing artifacts.

2. **ESCALATE IF required report sections are missing and persistence would be lossy**
   - Fix the report or fail before writes.

3. **ESCALATE IF a caller still depends on the old `ai-council` runtime name and cannot be renamed**
   - Compatibility requires explicit user direction.

4. **ESCALATE IF a caller asks the council agent itself to mutate graph storage**
   - Graph updates belong to caller-owned `runtime/` CLI reducers, not council-seat deliberation.

---

## 6. REFERENCES AND RELATED RESOURCES

Ordered by load priority — most-loaded intent first.

- `references/integration/quick_reference.md` - first-touch operator cheat sheet and validation commands (ALWAYS-loaded default).
- `references/integration/loop_protocol.md` - end-to-end council workflow from packet resolution to persistence and recovery.
- `references/structure/output_schema.md` - markdown report contract parsed by the persistence helper.
- `references/scoring/scoring_rubric.md` - five-dimension scoring, adversarial critique, conflict resolution, and attribution rules.
- `references/convergence/depth_dispatch.md` - Depth 0 parallel dispatch and Depth 1 sequential inline dispatch rules.
- `references/convergence/failure_handling.md` - timeout, all-seat failure, contradiction, insufficient vantage, and rollback-state guidance.
- `references/patterns/anti_patterns.md` - council quality failure modes, detection cues, and recovery actions.
- `references/structure/folder_layout.md` - packet-local artifact tree and writer ownership.
- `references/structure/state_format.md` - append-only JSONL event semantics.
- `references/patterns/command_wiring.md` - caller-owned post-dispatch persistence patterns.
- `references/patterns/seat_diversity_patterns.md` - seat lens and vantage diversity rules.
- `references/convergence/convergence_signals.md` - convergence and escape-hatch rules.
- `references/integration/graph_support.md` - derived council graph boundaries, tool surface, and recovery behavior.
- `references/convergence/deep_mode.md` - deep-mode session/topic/round hierarchy, state files, cost guards and the runtime/ dependency.
- `references/scoring/findings_registry.md` - cross-topic findings registry, fingerprint dedup and filesystem locking.
- `assets/deep_ai_council_strategy.md` - operator-maintained round strategy template.
- `assets/deep_ai_council_dashboard.md` - council status dashboard template.
- `assets/deep_ai_council_config.json` - run-config template for council sessions.
- `assets/prompt_pack_round.md` - council-seat prompt-pack template.
- `assets/runtime_capabilities.json` - runtime parity and validation matrix.
- `manual_testing_playbook/manual_testing_playbook.md` - operator validation scenarios.
- `README.md` - human-facing overview.

Related skills: `deep-research` for evidence-first investigation vantages and `system-spec-kit` for packet documentation, validation, resume, and memory continuity.

---

## 7. SUCCESS CRITERIA

### Council Skill Completion Checklist

Council alignment is complete when:

- ✅ Council requests route to the `deep-ai-council` advisor/packet surface (`packetSkillName` and `legacyAdvisorId` in `mode-registry.json`); `deep-ai-council` is the packet folder/SKILL.md name (folder == name), while the dispatched agent identity remains `ai-council`.
- ✅ Runtime mirrors dispatch `@ai-council` (`mode: subagent`, Task-dispatch only) under a consistent agent identity — both agent files (`.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`) declare `name: ai-council`, matching the registry `agent: ai-council` field.
- ✅ Council references and scripts live inside this skill package.
- ✅ Persisted artifacts and append-only state stay under packet-local `ai-council/**`.
- ✅ Persistence helpers parse and write the existing council artifact contract while graph support remains a derived projection.

### Quality Targets

- **Structure**: SKILL.md follows sk-doc required section order and frontmatter.
- **Routing**: Section 3 is the only authoritative routing source.
- **Reference shape**: reference filenames are snake_case and intro sections are short.
- **Playbook coverage**: manual testing package has 32 scenarios across 9 categories.
- **Boundary discipline**: graph rows never replace `ai-council/**` artifacts and council seats do not mutate graph storage directly.

### Validation Success

- ✅ `quick_validate.py` accepts the skill package.
- ✅ The skill's packet spec docs pass `validate.sh --strict`.
- ✅ Old kebab-case reference links are absent from live callers.

---

## 8. INTEGRATION POINTS

### Validation Workflow Integration

Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` before completion claims when spec docs are updated. Skill package structure is checked with `python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/system-deep-loop/deep-ai-council`.

### Cross-Workflow Contracts

The council is a planning LEAF. It hands recommendations, risk analysis, and packet-local artifacts to implementation agents or the top-level caller; it does not perform application-code or spec-doc mutations.

### Tool Usage

- `Read`, `Glob`, and `Grep` gather evidence and verify paths.
- `Write` and `Edit` are allowed only for the planning LEAF's packet-local `ai-council/**` artifacts.
- `Bash` is for caller-owned helper invocation and validation, not for council-seat implementation.

### Knowledge Base Dependencies

**Required**:

- `references/structure/output_schema.md` - parser and report requiredness contract; persistence must fail closed if missing.

**Optional**:

- `references/patterns/command_wiring.md` - caller post-dispatch examples.
- `references/convergence/convergence_signals.md` - convergence guidance.
- `references/scoring/scoring_rubric.md` - synthesis scoring and critique guidance.
- `references/convergence/depth_dispatch.md` - adaptive dispatch guidance.
- `references/convergence/failure_handling.md` - failure and rollback treatment.
- `references/patterns/anti_patterns.md` - quality anti-pattern detection and recovery.
- `references/integration/graph_support.md` - derived graph support and runtime/ CLI boundary.
- `references/structure/folder_layout.md` - artifact shape and rollback layout.
- `references/patterns/seat_diversity_patterns.md` - lens selection.
- `references/structure/state_format.md` - state event semantics.
- `manual_testing_playbook/manual_testing_playbook.md` - operator validation.

### External Tools

No external tools are required. External CLIs may contribute seats only when the caller actually runs them and labels the result accurately.
