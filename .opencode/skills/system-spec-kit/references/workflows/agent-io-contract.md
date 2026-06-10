# Agent I/O Contract

Shared advisory contract for structured agent dispatch and return metadata. This contract helps orchestrators and leaf agents exchange typed hints without making older prompts invalid.

## 1. Contract Status

```yaml
schema_version: agent-io/v1
status: optional-advisory
```

- Every field is optional unless a caller and receiver explicitly agree otherwise in the task prompt.
- Absence of any dispatch header or result envelope is never a refusal condition.
- Existing agent-specific output formats remain authoritative.
- Consumers parse best-effort and ignore unknown fields.

## 2. Dispatch Group

Orchestrators may place this compact header near the top of a delegated task prompt. Target size: under 15 lines.

```text
AGENT_IO_DISPATCH v1
schema_version: agent-io/v1
dispatch_id: <stable id or none>
agent: @context | @code | @review | @debug | @markdown | @ai-council | @deep-research
task_type: explore | implement | review | debug | document | plan | research
task_definition: <one-line task summary>
context_snapshot: none | included | one-shot
read_directives: none | packet-first | codebase-first | exact-paths
contract: advisory
expected_result: native | agent_io_result
```

Receivers treat these fields as routing hints. If a field conflicts with the loaded agent definition, the agent definition and runtime safety rules win.

## 3. Result Group

Leaf agents may append this envelope after their required native output:

```text
AGENT_IO_RESULT v1
schema_version: agent-io/v1
dispatch_id: <matching dispatch_id or none>
status: pass | fail | blocked | partial
confidence_band: high | medium | low
confidence_numeric: 0.90 | 0.70 | 0.30
failure_type: none | unknown_stack | scope_conflict | low_confidence | logic_sync | verify_fail | p0 | p1 | p2 | missing_info | access_denied | complexity_exceeded | external_dependency | operator_opt_in_missing
summary: <one-line outcome>
files_changed: <comma-separated repo-relative paths or none>
verification: <command/result, evidence summary, or not_applicable>
next_action: <specific follow-up or none>
```

Rules for result envelopes:

- Append after the native response body, never before a required first-line status.
- Do not replace required sections such as a Context Package, review report, debug report, or code RETURN block.
- `confidence_band` is the canonical human signal.
- `confidence_numeric` is deterministic and derived from `confidence_band`: `high -> 0.90`, `medium -> 0.70`, `low -> 0.30`.
- If a provided numeric value conflicts with the band mapping, consumers should trust the band and recompute the numeric value.
- Use `files_changed: none` for read-only agents.
- Use `verification: not_applicable` only when the agent's native contract allows no verification command.
- Keep summaries factual and evidence-backed.

## 4. Handoff Group

Optional handoff fields describe information crossing from one agent to another. The first concrete use is a debug-to-implementation handoff. This is a narrower, advisory adaptation of Gem's existing orchestrator `debugger_diagnosis` machine-check; it adds typed fields without replacing native debug reports.

```text
AGENT_IO_HANDOFF v1
schema_version: agent-io/v1
handoff_type: debug_to_implement | none
source_agent: @debug | none
target_agent: @code | none
root_cause: <evidence-backed cause, or none>
target_files: <comma-separated repo-relative paths, or none>
fix_recommendations: <short recommended fix steps, or none>
confidence: high | medium | low | none
```

Handoff rules:

- This group is required only when an orchestrator explicitly hands an `@debug` diagnosis to `@code` for a diagnosis-based surgical fix.
- `target_files` are recommendations, not an automatic edit allowlist. The orchestrator and receiver still enforce their scoped file rules.
- If the crossing is present but required fields are missing, `@code` should return `BLOCKED` with low confidence rather than inventing a fix.
- Legacy `debug-delegation.md` reports outside a debug-to-implementation crossing warn and require manual verification; they are not rejected for missing this group.
- Absence of this group in ordinary work remains valid and must not block the receiver.

## 5. Pre-Execution Group

Optional pre-execution fields describe scoped gates that fire only when their predicate is true. The orchestrator owns the predicates and should not spread heuristic copies across leaf agents.

```text
AGENT_IO_PRE_EXECUTION v1
schema_version: agent-io/v1
diagnosis_crosses_agents: true | false
change_class: docs | typo | ordinary | api | schema | integration | other
boundary_contract: <contract, boundary test, executable acceptance check, or none>
complexity: low | medium | high
pre_mortem: none | risk=<low|medium|high>; failure_modes=<2-3 concise modes>; assumptions=<concise assumptions>
```

Pre-execution rules:

- Gate A fires only when `diagnosis_crosses_agents: true`.
- Gate B fires only when `change_class` is `api`, `schema`, or `integration`; it asks for a contract, boundary test, or executable acceptance check before production edits.
- Gate C fires only when `complexity` is `medium` or `high`; low-complexity tasks omit `pre_mortem`.
- A low, typo, or docs task with no cross-agent diagnosis should skip all three gates.
- Missing pre-execution metadata in legacy or ordinary dispatches remains a degraded advisory state, not a rejection reason.

## 6. Advisory Group

Reserved for future planning/review focus hints. Current status: advisory placeholder only.

```yaml
advisory:
  enabled: false
  fields: optional
```

## Compatibility

- Senders may omit the dispatch header.
- Receivers may omit the result envelope when their native format is sufficient.
- Consumers must not reject a result solely because this advisory metadata is absent.
