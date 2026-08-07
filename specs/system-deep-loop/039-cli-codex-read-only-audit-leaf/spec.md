---
title: "Feature Specification: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "Run the cli-codex deep-alignment leaf under --sandbox read-only and move iteration-artifact writing to the dispatch wrapper, so a codex leaf can never reach for apply_patch during a read-only conformance audit and the loop cannot halt on a tool-mediated-write contract violation."
trigger_phrases:
  - "cli-codex read-only leaf"
  - "codex apply_patch alignment halt"
  - "deep-alignment executor contract violation"
  - "read-only audit leaf"
  - "wrapper writes iteration artifacts"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Read-Only cli-codex Deep-Alignment Audit Leaf

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-23 |
| **Track** | system-deep-loop |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The single-executor deep-alignment loop dispatches its `cli-codex` leaf with `--sandbox workspace-write` because the leaf is required to Bash-write its three per-iteration artifacts (the iteration narrative, the appended `deep-alignment-state.jsonl` record, and the write-once delta file) — the native `@deep-alignment` agent deliberately has no Write/Edit tool. But `codex exec` hands the model a native `apply_patch` tool (the model catalog declares `apply_patch_tool_type: "freeform"`), which a codex leaf reflexively uses to create those files. That tool-mediated write violates the loop's "every state write is Bash-mediated, never tool-mediated" contract, and the orchestrator halts the whole run with an `executor_contract_violation` at the first iteration that reaches for it. Observed live: a LUNA alignment run halted at iteration 3 (15 of 99 artifacts, sk-code lane never reached) with `apply_patch` used against a wrong-path iteration artifact. Raising `--max-iterations` cannot help — the halt is structural, not budget-bound. A prior "PASS" at the same 15-artifact boundary was almost certainly this same halt misread as success.

### Purpose
Make a `cli-codex` deep-alignment leaf structurally incapable of writing anything, so it can never use `apply_patch` and can never corrupt or trip the tool-mediated-write halt. Run the leaf under `--sandbox read-only`; have it emit its audit result as a single structured final message; and have the dispatch wrapper author the three iteration artifacts from that message, injecting the route-proof fields itself. The written artifacts stay schema-identical to what the leaf wrote before, so the reducer and convergence gate are unchanged.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flip the `deep-alignment-auto.yaml` `if_cli_codex` dispatch to `--sandbox read-only` with last-message capture (`-o <file>`).
- A read-only OUTPUT CONTRACT variant of the deep-alignment iteration prompt pack, selected when the executor is `cli-codex`: the leaf writes nothing and instead emits one structured JSON object (iteration record fields + findings) as its final message.
- A shared, unit-tested helper that parses the leaf's final message, authors the three iteration artifacts (narrative markdown, appended state record, delta file), injects/overrides the route-proof fields, and fails the iteration fail-closed (redispatch, not workflow halt) on unparseable or incomplete output.
- Regression tests over the helper: valid message → three well-formed artifacts; malformed/absent message → iteration failure with no partial artifacts; route-proof fields always wrapper-authored.

### Out of Scope
- `deep-review` and `deep-research` `cli-codex` leaves — the same shared helper is reusable, but their output contracts differ and are audited/covered separately (documented follow-up).
- Native / cli-opencode / cli-claude-code executors — unchanged; they already run within their contracts.
- The 038 write-containment guard — retained unchanged as belt-and-suspenders (a no-op under a read-only leaf).
- Changing the reducer, convergence gate, corpus/partition, or state-record schema.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `commands/deep/assets/deep-alignment-auto.yaml` | Modify | Rewrite the `if_cli_codex` branch: read-only dispatch + `-o` capture + call the artifact-writing helper. |
| `runtime/lib/deep-loop/leaf-artifact-writer.ts` | Create | Parse leaf final message → author narrative + state record + delta; inject route-proof fields; fail-closed on malformed output. |
| deep-alignment iteration prompt pack | Modify | Read-only OUTPUT CONTRACT variant (emit structured final message; write nothing) selected for `cli-codex`. |
| `runtime/tests/unit/leaf-artifact-writer.vitest.ts` | Create | Regression tests (valid / malformed / missing-field / route-proof-authored). |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-codex alignment leaf runs read-only | The `if_cli_codex` dispatch passes `--sandbox read-only`; the leaf cannot create/modify/delete any file. |
| REQ-002 | Leaf emits a structured final message | The read-only prompt variant instructs the leaf to write nothing and emit one JSON object (iteration data + findings) as its final message; captured via `-o`. |
| REQ-003 | Wrapper authors the three artifacts | From the final message the wrapper writes `iterations/iteration-NNN.md`, appends the `"type":"iteration"` record to the state log, and writes `deltas/iter-NNN.jsonl`, all schema-identical to the prior leaf-authored form. |
| REQ-004 | Route-proof fields are wrapper-authored | `target_agent`, `resolved_route`, `agent_definition_loaded`, `mode`, `iteration` are set by the wrapper from config, never trusted from the model. |
| REQ-005 | Malformed output fails the iteration, not the run | Unparseable/incomplete final message → non-zero iteration exit (redispatch path) with no partial artifacts written; no `executor_contract_violation` workflow halt. |
| REQ-006 | Reducer/convergence unchanged | Wrapper-written records satisfy the existing reducer and `check-convergence.cjs` with no changes to those scripts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | End-to-end verification on a real audit | A LUNA (cli-codex) alignment run over the hallmark corpus completes its full iteration budget and covers the sk-code lane (no iteration-3 halt). |
| REQ-008 | Comment hygiene | No spec paths / packet ids / task ids embedded in code comments; durable WHY only. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A cli-codex alignment leaf writes nothing to disk; a probe write is denied by the read-only sandbox.
- **SC-002**: A full-budget LUNA alignment run over the hallmark corpus completes without an `executor_contract_violation` halt and audits the sk-code lane to completion.
- **SC-003**: Wrapper-written state records are byte-schema-identical to the prior leaf-authored records (route-proof fields present); the reducer produces a valid per-lane verdict.
- **SC-004**: `leaf-artifact-writer.vitest.ts` covers valid/malformed/missing-field/route-proof cases; `spec validate --strict` reports Errors:0.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Leaf final message not cleanly parseable | Iteration fails to produce artifacts | Wrapper extracts the last fenced ```json block or trailing object, tolerates surrounding prose, and fails the iteration fail-closed (redispatch) rather than the run. |
| Risk | Wrapper-written records drift from the leaf-authored schema | Reducer/convergence break | Author records from the documented OUTPUT CONTRACT schema; assert required fields; a golden-record vitest pins the shape. |
| Risk | Read-only blocks a legitimate verify-first probe that writes a temp file | An audit step no-ops | Verify-first probes are read-only analysis (validators/greps); documented; the leaf reports inability instead of writing. |
| Dependency | codex `--sandbox read-only` denies all writes | Fix relies on this | Probe-verified (codex-cli 0.144.6): a create-file task under read-only was denied. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Determinism**: the wrapper is a pure function of (final message, config); no clock/random in the record shape beyond the leaf-reported `timestamp`/`durationMs` it already carried.
- **Isolation**: the change is confined to the cli-codex single-executor alignment path; native / cli-opencode / fan-out behavior is unchanged.
- **Observability**: a parse/write failure appends a structured event to the state log naming the failed stage, mirroring the existing failure taxonomy.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Zero-findings PASS: the leaf emits an empty findings array; the wrapper still writes a complete record and narrative (a valid, complete outcome).
- Final message contains prose around the JSON: the wrapper extracts the JSON block; pure-prose with no JSON → iteration failure.
- Leaf over-reports route-proof fields: wrapper overrides them from config (model values are ignored for those keys).
- codex returns non-zero / times out: existing dispatch-audit failure path handles it before the writer runs.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the read-only leaf pattern extend to deep-review / deep-research cli-codex leaves? **Deferred** — reusable helper; their output contracts are audited separately.
- Should the narrative be model-emitted or wrapper-synthesized? **Resolved: wrapper-synthesized** from the structured findings — the narrative is human-facing only (the reducer never parses it), which removes the largest parse-fragility surface.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Prior art**: `system-deep-loop/038-cli-codex-write-containment` (the post-dispatch out-of-scope revert guard this fix complements).

<!-- /ANCHOR:related-docs -->
