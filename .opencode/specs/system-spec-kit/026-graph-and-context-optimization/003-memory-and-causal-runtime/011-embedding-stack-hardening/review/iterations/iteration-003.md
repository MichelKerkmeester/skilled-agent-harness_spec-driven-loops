# Deep Review Iteration 003

## Dimension

traceability

## Files Reviewed

- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/review/deep-review-strategy.md:1`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/003-observability-model-switch/plan.md:57`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/003-observability-model-switch/tasks.md:72`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/003-observability-model-switch/implementation-summary.md:102`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/004-perf-instrumentation-batching/tasks.md:60`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/004-perf-instrumentation-batching/implementation-summary.md:85`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/spec.md:115`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/implementation-summary.md:56`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/implementation-summary.md:90`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:424`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:296`
- `.opencode/bin/hf-model-server.cjs:26`
- `.opencode/bin/lib/model-server-supervision.cjs:199`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/tasks.md:70`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/checklist.md:67`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/implementation-summary.md:92`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/tasks.md:80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/checklist.md:76`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/implementation-summary.md:117`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/tasks.md:78`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/implementation-summary.md:103`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/tasks.md:75`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/implementation-summary.md:97`

## Findings by Severity

### P0

None.

### P1

#### DR-003-P1-001 [P1] Daemon child packets leave required verification gates open while claiming implementation status

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/tasks.md:75`
- Evidence: Packet 013's tasks leave build, focused vitest, shared-config behavior, strict validation, and completion criteria unchecked at `tasks.md:75-88`, while its implementation summary claims build, focused vitest, empirical daemon check, and strict validation all passed at `implementation-summary.md:97-101`. This is not isolated: packet 009 still has all verification tasks/checklist rows unchecked or pending (`tasks.md:70-84`, `checklist.md:67-71`, `implementation-summary.md:92-93`), packet 010 leaves strict validation unchecked/pending (`tasks.md:80-91`, `checklist.md:76`, `implementation-summary.md:117`), and packet 012 leaves strict validation/completion unchecked while its summary says the target is pending (`tasks.md:78-88`, `implementation-summary.md:103`).
- Claim: The shipped daemon child packets do not have a single trustworthy completion ledger for verification and strict validation.
- Evidence refs: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/tasks.md:75`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/implementation-summary.md:97`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/checklist.md:67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/checklist.md:76`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/tasks.md:78`
- Counterevidence sought: I checked the implementation summaries for pass/pending evidence and the child checklists/tasks for completion markers. Some summaries contain PASS rows, but the checklist/task ledgers are still open or explicitly pending.
- Alternative explanation: The summaries may be newer than the task/checklist ledgers and the code may be fine. That still leaves the release traceability gate broken because consumers cannot tell which verification source is authoritative.
- Final severity: P1
- Confidence: 0.91
- Downgrade trigger: If these child task/checklist files are declared non-authoritative for release readiness, or are reconciled so every open verification item is either checked with evidence or deliberately deferred, downgrade to P2/no finding.
- Finding class: matrix/evidence
- Scope proof: Exact searches for unchecked verification gates across phases 009/010/012/013 found repeated task/checklist drift; phase 031 child packets mostly document intentional live-gated deferrals separately.
- Recommendation: Reconcile each daemon child packet's tasks/checklist/implementation summary. Mark actually completed verification rows with evidence, or change implemented/completion claims to pending/deferred where strict validation did not run.

### P2

#### DR-003-P2-001 [P2] Phase 005 file-change matrix still points idle eviction at the wrong implementation file

- File: `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/spec.md:115`
- Evidence: The phase 005 spec's file matrix says `.opencode/bin/hf-model-server.cjs` will carry "idle eviction on `lastSuccessfulEmbedAt`", but the shipped implementation summary says idle eviction lives in `model-server-supervision.cjs` via `createModelServerControl`, and the reviewed code parses `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` in `model-server-supervision.cjs:199`. `hf-model-server.cjs` still only shows the dtype default at `hf-model-server.cjs:26`, which is intentionally unchanged.
- Finding class: matrix/evidence
- Scope proof: The same phase 005 summary honestly documents the design correction and gated dtype/flag decisions, so this is localized to the spec file-change matrix rather than a shipped behavior defect.
- Recommendation: Update the phase 005 spec matrix to move idle eviction from `hf-model-server.cjs` to `model-server-supervision.cjs`, and mark `hf-model-server.cjs` as dtype-only/gated.

## Traceability Checks

- `spec_code`: partial. Flag-flip and dtype gating are honestly documented and match code: `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` remains opt-in at `mk-skill-advisor-launcher.cjs:296`, `DEFAULT_DTYPE` remains `q8` at `hf-model-server.cjs:26`, and ENV docs explain the onnxruntime blocker at `ENV_REFERENCE.md:424`. One P2 drift remains in the phase 005 file matrix.
- `checklist_evidence`: fail. The daemon child packets have unresolved task/checklist evidence conflicts for verification and strict validation.
- `skill_agent`: pending. No agent/skill cross-runtime overlay was completed this pass.
- `agent_cross_runtime`: pending.
- `feature_catalog_code`: partial. ENV reference matches the gated flag/default-off state; phase 005 spec file matrix has one stale implementation-location row.
- `playbook_capability`: pending.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. No P0 findings. One new P1 traceability gate issue and one P2 documentation drift were added; prior P1 findings remain open.

## Next Dimension

maintainability
