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

Reserved for future handoff gates. Current status: advisory placeholder only.

```yaml
handoff:
  enabled: false
  fields: optional
```

## 5. Pre-Execution Group

Reserved for future scoped pre-execution gates. Current status: advisory placeholder only.

```yaml
pre_execution:
  enabled: false
  fields: optional
```

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
