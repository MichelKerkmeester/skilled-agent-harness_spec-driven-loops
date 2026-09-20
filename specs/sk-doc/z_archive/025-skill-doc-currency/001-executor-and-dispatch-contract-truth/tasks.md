---
title: "Tasks: executor-and-dispatch-contract-truth"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "executor contract tasks"
  - "confirm against head"
  - "fleet gate task"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/001-executor-and-dispatch-contract-truth"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored task breakdown"
    next_safe_action: "Execute T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: executor-and-dispatch-contract-truth

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm every scope item against HEAD before any edit. Produce a per-ID table with one of: confirmed / stale-finding / already-fixed. **A finding is a hypothesis until this table says otherwise.** Re-verify flags: the eight iteration-4 salvaged items (`RE-004-01`, `-03`, `-04`, `-05`, `-06`, `-07`, `-08`, `-12`) carry a different provenance from the rest and each must be re-read at its cited lines, not accepted from the summary; `RE-004-06` was found to understate its own severity, so re-derive its full rejected-route set rather than confirming the stated one. **Gate: below 75% confirmation the phase is re-scoped, not patched.**
- [ ] T002 Repair the red fleet-gate invariant: verify the manifest entry named by the gate is genuinely absent from disk, then regenerate (`node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling`)
- [ ] T003 Re-run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <root>` over all 11 hub roots and record the output verbatim as the program baseline. **Record the count from the run, never from memory** (`<packet>/baselines/`)
- [ ] T004 [P] Record the pre-edit corruption-sweep counts, narrow and widened: `rg -c 'cli-opencode[^\n]*cli-claude-code[^\n]*cli-opencode' .opencode/` and a widened variant that tolerates other orderings (`<packet>/baselines/`)
- [ ] T005 [P] Record the pre-edit runtime baseline: `npm run typecheck && npm test`, output captured whole, not summarized (`<packet>/baselines/`)
- [ ] T006 [P] Record every installed CLI version used in this phase, with the date of capture (`<packet>/baselines/`)
- [ ] T007 Capture per-CLI help fixtures, each recording binary version and capture date, and review each for credentials or machine paths before it is kept (`.opencode/skills/cli-external-orchestration/*/assets/cli-help/`)
- [ ] T008 Test the find-and-replace hypothesis with `git log -S` against the malformed pattern; record the result as confirmed or not-established. If confirmed, treat the reverse sweep as the primary repair and the per-file edits as verification
- [ ] T009 Build the derived-roster check: every executor list in a document is a subset of the schema's kinds; council documents are a subset of the resolver allowlist; **a document the check cannot parse counts as a failure, not a pass** (`.opencode/skills/sk-doc/shared/scripts/` — **[OPERATOR-DECISION: Q7 — shared tooling ownership]**)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — CLI packet references

- [ ] T010 [P] Regenerate the codex packet's structured-output and resume documentation from its fixture; the reference must name the JSONL event flag and the final-response schema flag (`cli-codex/references/cli-reference.md`) — `RE-005-02`
- [ ] T011 [P] Correct the claude-code packet's invocation forms; no boolean flag is shown taking a value (`cli-claude-code/references/cli-reference.md`) — `RE-005-01`
- [ ] T012 [P] [B] Split the cursor packet's parameterized-model statement into a capability claim and a policy claim, and remove the retired auth surface. Blocked on ADR-002 (`cli-cursor/references/`) — `RE-005-03`, **[OPERATOR-DECISION: DR-2]**
- [ ] T013 [P] Move containment out of the devin packet's permission-mode table and document it as orthogonal (`cli-devin/references/providers-and-models.md`) — `RE-005-04`
- [ ] T014 [P] Add the numbered OVERVIEW section to the devin packet README (`cli-devin/README.md`) — `RE-005-05`
- [ ] T015 [P] [B] Audit the two zero-finding CLI packets; schedule or disposition everything found. Blocked on Q2 (`cli-opencode/**`, `cli-pi/**`) — **[OPERATOR-DECISION: Q2 — unaudited CLI packets]**
- [ ] T016 [P] Document that print mode surfaces only the final assistant message, and name the mode a structured-output leaf must use instead (`cli-pi/references/`) — `E-NEW-01`
- [ ] T017 [P] Warn that the JSON event stream can reach hundreds of megabytes when a tool call dumps a large file (`cli-pi/references/`) — `E-NEW-02`

### Lane B — deep-loop executor rosters

- [ ] T018 Add the registry-matching tool-permission frontmatter and document the full fail-closed outcome set (`system-deep-loop/deep-alignment/SKILL.md`) — `RE-004-01` ⚑
- [ ] T019 [B] In the same edit as T018, correct the convergence-decision table so it matches the code's decision set. This closes a real drift whose finding ID stays closed on refutation-audit grounds; it does not reopen the ID. Blocked on Q1 (`system-deep-loop/deep-alignment/README.md`) — **[OPERATOR-DECISION: Q1 — unsound refutation]**
- [ ] T020 [P] Reconcile the capability matrix against the live capability data, row by row (`deep-research/references/guides/capability-matrix.md`) — `RE-004-03` ⚑
- [ ] T021 [P] Replace the retyped dispatch-branch list with a link or a derived subset (`deep-research/SKILL.md`) — `RE-004-04` ⚑. **Merge hazard:** another packet edits roster and lane counts in this packet's README; this task owns executor-kind lines only
- [ ] T022 [P] Same treatment for the review loop protocol (`deep-review/references/protocol/loop-protocol.md`) — `RE-004-05` ⚑
- [ ] T023 [P] Correct the council's advertised dispatch routes to exactly the resolver's allowlist, including the second rejected route the finding understated (`deep-ai-council/SKILL.md`) — `RE-004-06` ⚑
- [ ] T024 [P] Resolve the duplicated executor rows in the seat-vantage table (`deep-ai-council/references/patterns/seat-diversity-patterns.md`) — `RE-004-07` ⚑
- [ ] T025 [P] Derive the dispatcher map from its authority (`deep-improvement/references/model-benchmark/lane-b-mechanics.md`) — `RE-004-08` ⚑
- [ ] T026 [B] Apply the accepted Copilot ruling to the three command YAML branch sites. Blocked on ADR-001 (`.opencode/commands/deep/assets/`) — `RE-004-12` ⚑, **[OPERATOR-DECISION: DR-1]**
- [ ] T027 Run the reverse sweep for the malformed three-item list across `.opencode/` and repair every site, including any beyond the four the research reported — `REQ-005`

### Lane C — Code Mode and the MCP hub

- [ ] T028 [P] Reconcile the tool catalog against the manuals actually configured (`mcp-code-mode/references/tool-catalog.md`) — `RE-008-02`
- [ ] T029 [P] Correct the namespace used in the workflow examples to the live one (`mcp-code-mode/references/workflows.md`) — `RE-008-03`
- [ ] T030 [P] Reconcile the leaf-routing prose with the generated manifest (`mcp-code-mode/SKILL.md`) — `RE-008-04`
- [ ] T031 [P] Add the registered auxiliary tools to allowed-tools (`mcp-code-mode/SKILL.md`) — `RE-008-05`
- [ ] T032 [P] Replace the hub README's packet-count topology statement with the registry's mode set (`mcp-tooling/README.md`) — `RE-005-06`
- [ ] T033 [P] Reconcile the packet README with its own live tool contract (`mcp-tooling/mcp-mobbin/README.md`) — `RE-005-07`

### Cross-track coordination

- [ ] T034 Agree the roster-authority link target with the track that owns the feature-catalog leaf, so one document holds the number and the other links to it — `REQ-011`, **[OPERATOR-DECISION: DR-3]**
- [ ] T035 Notify the packet that owns deep-loop roster and lane counts of the shared-file merge hazard before either lands
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T036 Run the derived-roster check over every document that names executors; record the parsed-document count alongside the pass count so a vacuous pass is visible
- [ ] T037 Re-run the corruption sweep, narrow and widened; report the delta against T004, not just the final zero
- [ ] T038 Re-run the fleet gate over all 11 roots; report the delta against T003
- [ ] T039 Re-run `npm run typecheck && npm test`; report the delta against T005
- [ ] T040 Confirm every one of the 22 scope items reached exactly one terminal state: repaired, stale-finding, already-fixed, or deferred-with-reason
- [ ] T041 Verify each changed flag table is reproducible from its fixture by reading them side by side
- [ ] T042 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` → Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every delta claim anchored to a recorded pre-edit number, never to a remembered one
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
