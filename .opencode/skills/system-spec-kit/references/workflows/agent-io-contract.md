---
title: Agent I/O Contract
description: Optional agent dispatch headers and result envelopes for agent exchanges; advisory metadata never blocks a valid exchange.
trigger_phrases:
  - "agent io contract"
  - "dispatch result envelopes"
  - "agent handoff group"
  - "advisory metadata fields"
importance_tier: important
contextType: implementation
version: 3.6.0.8
---

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

### Advisory Status For Design Handoffs

Agent I/O is advisory-only: a convenience header that may opportunistically carry manifest or result digests as data, never as authority. The enforceable design gate is the design proof token plus the guarded boundary: guarded-proxy classification, the structured Open Design transport result, and parent re-validation. Presence of Agent I/O headers never substitutes for that gate, and absence of Agent I/O headers never passes a design handoff. Acceptance for this note is the advisory-only status, the real-gate naming, both failure directions, and the by-name pointer to `cli_child_pairing.md` "Agent I/O Is Not The Gate" as the canonical scoped statement; this prose adds no checker, schema, or refusal reason.

## 2. Dispatch Group

Orchestrators may place this compact header near the top of a delegated task prompt. Target size: under 15 lines.

```text
AGENT_IO_DISPATCH v1
schema_version: agent-io/v1
dispatch_id: <stable id or none>
agent: @orchestrate | @context | @code | @review | @debug | @markdown | @prompt-improver | @ai-council | @deep-research | @deep-review | @deep-improvement
task_type: explore | implement | review | debug | document | plan | research
task_definition: <one-line task summary>
context_snapshot: none | included | one-shot
read_directives: none | packet-first | codebase-first | exact-paths
contract: advisory
expected_result: native | agent_io_result
```

Receivers treat these fields as routing hints. If a field conflicts with the loaded agent definition, the agent definition and runtime safety rules win.

Optional extended dispatch fields may also ride in this header when an orchestrator has useful advisory context:

```text
context_package: none | included
handoff: none | debug_to_implement
pre_execution: none | scoped
reviewer_focus: none | <comma-separated high-risk files, modules, or concerns>
self_assessed_quality: none | high | medium | low | <short producer confidence note>
```

Consumers must keep these fields advisory and ignore unknown values rather than rejecting an otherwise valid task prompt.

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

Optional advisory fields route review attention and surface spec drift without creating gates, mutations, or new refusal reasons.

```text
AGENT_IO_ADVISORY v1
schema_version: agent-io/v1
reviewer_focus: none | <comma-separated high-risk files, modules, or concerns>
self_assessed_quality: none | high | medium | low | <short producer confidence note>
spec_drift: none | reason=<one-line recommendation>; affected_spec_docs=<comma-separated docs or none>; update_recommended=<true|false>
```

Advisory rules:

- `reviewer_focus` helps reviewers prioritize reads and evidence gathering. It never changes severity thresholds and never creates a finding without normal evidence.
- `self_assessed_quality` is the producer's own confidence note for reviewer triage. It is not a review score and must not be named `quality_score`.
- `spec_drift` is a recommendation to update packet docs later. It never edits spec docs automatically and never bypasses Logic-Sync for hard contradictions.
- If `spec_drift` is absent, consumers should treat it as `none`.
- Missing advisory fields in legacy or ordinary dispatches remain valid and must not block the receiver.

## 7. Evidence Group

Optional evidence fields let a load-bearing claim carry its proof in a fixed, machine-checkable shape at the dispatch boundary. This is the structural backstop for the doctrine that a finding is a hypothesis until verified: a claim either names its class and what would confirm it, or the missing piece is surfaced as an advisory. The schema is owned by `runtime/` (`lib/deep-loop/evidence-contract.ts`); that module is the source of truth for allowed values, and this doc cites it rather than redefining them.

```text
AGENT_IO_EVIDENCE v1
schema_version: agent-io/v1
claim_class: confirmed | inferred | hypothesis | unknown
would_confirm: <what would confirm an inferred or hypothesis claim, or none>
gate_delta: <baseline -> after gate result, e.g. "351 -> 357 passing">
scope_state: in_scope | out_of_scope | scope_expanded
child_result_verified: true | false
```

> **Representation (where this actually lives).** Unlike §2-§6, this block is NOT a free-standing `AGENT_IO_EVIDENCE` text envelope that agents append to their output — no agent currently emits one, and nothing parses one. The Evidence Group is carried as the structured `evidence` field on a deep-loop JSONL iteration record, and the only consumer validates it as a structured object via `validateEvidenceContract(record.evidence)` (`runtime//lib/deep-loop/post-dispatch-validate.ts`). The fenced shape above is the documented field schema (keys + allowed values), not a literal text format to emit. Producing it as a text block appended to agent output would not be validated.

Evidence rules:

- The group is optional. A record that omits the evidence metadata entirely is valid and passes post-dispatch validation with no warning (absence never blocks).
- When the metadata is present, all five fields are expected. A partial payload (some but not all five), a wrong-typed field, or an unknown enum value is reported as an advisory naming the offending `evidence.<field>` path; it never fails the exchange by default.
- Validation is advisory by default (`DEEP_LOOP_EVIDENCE_ENFORCEMENT=warn`). `off` suppresses the advisories; `strict` marks them distinctly but still does not block, because no blocking failure reason is defined for evidence yet. Any future promotion to blocking is a separate, baseline-gated decision.
- Evidence field values are treated as inert data. Consumers validate the shape only and never interpret a field's contents as instructions.

## Compatibility

- Senders may omit the dispatch header.
- Receivers may omit the result envelope when their native format is sufficient.
- Consumers must not reject a result solely because this advisory metadata is absent.
