# Iteration 9: Q9 ADD-1 through ADD-6 risk mitigation

## Focus

Answer Q9: identify concrete risks introduced by ADD-1 through ADD-6 and define mitigation strategies, including the iteration 8 boundary that memory save integration stays optional and routes through existing categories.

## Actions Taken

- Confirmed the iteration number from `deep-research-state.jsonl`: eight completed iteration records make this iteration 9.
- Read the strategy, findings registry, and iteration 8 narrative to preserve Q1-Q8 decisions before assessing amendment risks.
- Inspected the round-2 addendum and updated risk table in `ai-council/council-report.md`.
- Compared the amendment requirements against the current `@multi-ai-council` agent body, `@orchestrate` dispatch constraints, and ADR-001 / ADR-003 / ADR-004.
- Checked the existing `references/multi-ai-council/` surface and research deltas to ensure the mitigations build on earlier Q1-Q8 decisions instead of opening a new skill-folder path.

## Findings

### 1. ADD-1's main risk is documentation drift across caller classes, not missing enumeration

The amended plan correctly identifies four caller patterns: top-level Task dispatch, `@orchestrate` Depth 1 dispatch, future `/speckit:*` command YAMLs, and CLI-skill manual dispatch at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:129` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:138`. `@orchestrate` confirms `@multi-ai-council` is a LEAF target at `.opencode/agents/orchestrate.md:97`, with LEAF agents prohibited from sub-dispatch at `.opencode/agents/orchestrate.md:111` through `.opencode/agents/orchestrate.md:121` and reinforced at `.opencode/agents/orchestrate.md:748` through `.opencode/agents/orchestrate.md:749`.

The risk is that four copy-paste recipes can diverge. Mitigation: make Section 17 the normative short contract and keep long examples in `references/multi-ai-council/`. Each caller recipe should share the same three verbs: capture report, invoke helper, optionally save context. That gives every caller a path without making the agent body carry four full playbooks.

### 2. ADD-2 and ADD-3 must be treated as one schema-governance unit

ADD-2 defines strict-required sections and optional sections for the helper parser at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:140` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:149`. ADD-3 then proposes a shared schema artifact as the single source of truth for Section 8 at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:151` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:153`.

The risk is split-brain behavior: the agent body says one thing, the helper parser accepts another, and the reference artifact documents a third. Mitigation: the output schema artifact should own the requiredness matrix, while the agent body references it rather than duplicating detailed parser rules. Fixture tests should prove the helper accepts optional-section omission and fails only when strict-required sections are missing.

### 3. ADD-4 is required to preserve the planning-only invariant

The current agent body says the council must not modify files and the final report is planning-only at `.opencode/agents/multi-ai-council.md:460` through `.opencode/agents/multi-ai-council.md:463`, and the summary repeats "No file writes, edits, patches, or shell execution" at `.opencode/agents/multi-ai-council.md:684` through `.opencode/agents/multi-ai-council.md:687`. The smoke-test council report also records that the dispatching orchestrator wrote artifacts while `@multi-ai-council` retained `write: deny` at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:120` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:121`.

The risk is that the helper creates ambiguity: if the helper is described too close to the LEAF agent, later readers may think the LEAF should invoke it. Mitigation: Section 17 should say the dispatching parent or top-level caller invokes the helper after the LEAF returns. The helper is a caller tool, not a council capability.

### 4. ADD-5 needs an audit pointer, not migration work

ADD-5 makes the convention forward-only and explicitly rejects retroactive migration at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:159` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:161`. This aligns with ADR-001's claim that migration cost was none because there was no prior convention to migrate from at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:76` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:83`.

The risk is future cleanup pressure: someone may later interpret missing `ai-council/` folders in old packets as validation debt. Mitigation: Section 17 and the output-schema reference should state "forward-only; do not backfill." If a future audit needs visibility, add a note to the packet's history or resource map, not a migration script.

### 5. ADD-6 is the key mitigation for partial rollout, but it needs a hard dependency order

ADD-6 recommends helper plus fixture tests first, Section 17 plus schema second, and command YAML wiring third at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:163` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:170`. This is the correct sequencing because command wiring is a convenience path, while top-level, orchestrator, and CLI callers need standalone invocation.

The risk is landing documentation before the helper exists, which would create a contract callers cannot execute. Mitigation: packet 081 should make the helper and fixtures the first mergeable unit. Section 17 can land in the same packet only if it points to a real helper path and a real schema artifact.

### 6. Memory-save integration must stay optional and downstream of persistence

Iteration 8 answered Q8: do not create a new `ANCHOR:council-report-{packet}` destination, and do not make `council_complete` automatically fire `/memory:save`. That boundary matters for ADD-1 through ADD-6 because helper persistence and memory continuity are separate responsibilities. ADR-004 keeps `ai-council/` free-form inside validation at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:165` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:184`, and ADR-003 keeps state schema convention-only for v1 at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:131` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:157`.

The risk is hidden side effects: a helper that both persists artifacts and writes memory context would surprise callers and complicate failure handling. Mitigation: helper success should mean artifact persistence only. It may emit or print an optional save payload, but the caller decides whether to route it through existing `/memory:save` categories.

## Questions Answered

- Q9 answered: ADD-1 through ADD-6 are valid refinements, but the mitigations need tighter boundaries. Section 17 should be normative and short, examples should live in references, helper invocation is owned by the caller/parent, schema requiredness belongs in one shared artifact, legacy outputs are not migrated, packet 081 must land helper plus fixtures before command wiring, and memory save remains optional after persistence.

## Questions Remaining

- Q10 remains: decide when ADR-001's lightweight bound should be revisited. The Q9 evidence suggests the bound still holds if packet 081 only adds a helper, schema reference, fixture tests, and short caller protocol. Q10 should define the signals that would prove this is no longer enough.

## Next Focus

Iteration 10 should answer Q10: define concrete revisit conditions for ADR-001, including the thresholds that would justify promoting `@multi-ai-council` into a dedicated skill folder.
