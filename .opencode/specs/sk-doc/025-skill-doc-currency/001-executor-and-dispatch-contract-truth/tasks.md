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
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "skd025-001-build"
    recent_action: "Added per-finding doc-before/reality/doc-after evidence"
    next_safe_action: "Run scoped documentation gates"
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

**Execution status:** In Progress. The documentation lane is patched and evidenced below; YAML disposition and full packet gates remain pending.

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

- [x] T001 Confirm every scope item against HEAD before any edit. The disposition and evidence table below records confirmed drift, already-fixed items, synthesis gaps, and the documentation-scope deferral (evidence: `tasks.md:40`).
- [x] T002 Repair the red fleet-gate invariant: concurrent work regenerated the stale case-renamed install-guide leaf; this BUILD leaf records the supplied resulting baseline and makes no second manifest edit.
- [x] T003 Re-baseline the fleet gate: the supplied concurrent result is 11/11 clean; the full packet-wide baseline artifact remains outside this leaf's documentation-only evidence set.
- [ ] T004 [P] Record the pre-edit corruption-sweep counts, narrow and widened: `rg -c 'cli-opencode[^\n]*cli-claude-code[^\n]*cli-opencode' .opencode/` and a widened variant that tolerates other orderings (`<packet>/baselines/`)
- [ ] T005 [P] Record the pre-edit runtime baseline: `npm run typecheck && npm test`, output captured whole, not summarized (`<packet>/baselines/`)
- [x] T006 [P] Record every installed CLI version used in this phase in the BUILD evidence: claude 2.1.220, codex-cli 0.145.0, cursor-agent 2026.07.23-e383d2b, devin 3000.3.22, pi 0.83.0, and opencode 1.18.11 (captured 2026-08-02).
- [ ] T007 Capture per-CLI help fixtures, each recording binary version and capture date, and review each for credentials or machine paths before it is kept (`.opencode/skills/cli-external-orchestration/*/assets/cli-help/`)
- [ ] T008 Test the find-and-replace hypothesis with `git log -S` against the malformed pattern; record the result as confirmed or not-established. If confirmed, treat the reverse sweep as the primary repair and the per-file edits as verification
- [ ] T009 Build the derived-roster check: every executor list in a document is a subset of the schema's kinds; council documents are a subset of the resolver allowlist; **a document the check cannot parse counts as a failure, not a pass** (`.opencode/skills/sk-doc/shared/scripts/` — **[OPERATOR-DECISION: Q7 — shared tooling ownership]**)
<!-- /ANCHOR:phase-1 -->

### HEAD disposition and edit evidence

The table is the required doc-before / live-reality / doc-after receipt for every scope item. Line numbers refer to the edited documents; command-help anchors are the installed binaries captured on 2026-08-02.

| ID | State | Doc before | Reality anchor | Doc after / rationale |
|---|---|---|---|---|
| RE-004-01 | fixed | `deep-alignment/SKILL.md:2-6` had no tool-permission frontmatter and omitted fail-closed decisions | `system-deep-loop/mode-registry.json:181-185` | `deep-alignment/SKILL.md:2-5,328` adds the registry surface and all six decisions |
| RE-004-02 | fixed on refutation audit; ID remains closed | `deep-alignment/README.md` listed only four convergence outcomes | `deep-alignment/scripts/check-convergence.cjs:60-69` defines six outcomes | `deep-alignment/README.md` now lists all six outcomes; the correction records the audit defect without reopening the closed ID |
| RE-004-03 | fixed | `deep-research/references/guides/capability-matrix.md:53` claimed OpenCode/Copilot hook bootstrap | `deep-research/assets/runtime-capabilities.json:14-26` (`hookBootstrap: false`) | `capability-matrix.md:53` now reports `No` and names the source |
| RE-004-04 | fixed | `deep-research/SKILL.md:267` named only three branches | `system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11` and `runtime/scripts/fanout-run.cjs:1954-1962` | `deep-research/SKILL.md:267` links the seven-kind authority and inline/fan-out split |
| RE-004-05 | fixed | `deep-review/references/protocol/loop-protocol.md:277-281` described only three branches | `system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11` | `loop-protocol.md:281` records the complete schema and adapter split |
| RE-004-06 | fixed | `deep-ai-council/SKILL.md:22,26,357` advertised rejected external routes | `deep-ai-council/scripts/orchestrate-session.cjs:175-193` | `deep-ai-council/SKILL.md:22,26,357` lists accepted routes and rejected kinds |
| RE-004-07 | fixed | `seat-diversity-patterns.md:62-65` duplicated `cli-opencode` and used a non-kind native row | `deep-ai-council/scripts/orchestrate-session.cjs:175-193` | `seat-diversity-patterns.md:62-68` contains the accepted five-vantage table |
| RE-004-08 | fixed | `lane-b-mechanics.md:49` repeated `cli-opencode` and omitted three adapters | `deep-improvement/scripts/model-benchmark/dispatch-model.cjs:138-144,436-468` | `lane-b-mechanics.md:49` names the five dispatcher executors and source authority |
| RE-004-12 | deferred | `.opencode/commands/deep/assets/deep-*-{auto,confirm}.yaml` contains the undefined-kind branches | `system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11` | No target edit: command YAML is outside this documentation-only BUILD leaf; ADR-001 remains Proposed |
| RE-005-01 | fixed | `cli-claude-code/references/cli-reference.md:152-154` passed a value to `--fork-session` | `claude --help` (installed `2.1.220`, 2026-08-02) | `cli-reference.md:152-154` documents optional `--resume` value and boolean `--fork-session` |
| RE-005-02 | fixed | `cli-codex/references/cli-reference.md:259-269` denied native JSON output and `:505-515` used `codex exec --session-id` | `codex exec --help` (installed `codex-cli 0.145.0`, 2026-08-02) and `codex exec --session-id --help` → `error: unexpected argument '--session-id' found` | `cli-reference.md:259-269` documents `--json`/`--output-schema`; `:509-515` now uses `codex exec resume [SESSION_ID] [PROMPT]` |
| RE-005-03 | REFUTED | The original Cursor refs correctly said bracket syntax was rejected; the stale auth-token pair was a separate correction | Installed `cursor-agent 2026.07.23-e383d2b` rejected `composer-2.5[effort=high]`, the `--help` example, and `cursor-grok-4.5[effort=high]` with `Cannot use this model: ... Available models: ...`, exit 1, before repository dispatch | Restored the capability-limit claim across the four Cursor docs; retained the correct removal of `--auth-token`/`CURSOR_AUTH_TOKEN` |
| RE-005-04 | fixed | `cli-devin/references/providers-and-models.md:100-106` presented sandbox as a fifth permission mode | `devin --help` (installed `3000.3.22`, 2026-08-02) | `providers-and-models.md:100-110` keeps four permission modes and documents orthogonal containment |
| RE-005-05 | fixed | `cli-devin/README.md:21` used `AT A GLANCE` instead of the required numbered overview | `cli-devin/README.md:21` structural contract | `cli-devin/README.md:21` is now `## 1. OVERVIEW` |
| RE-005-06 | fixed | `mcp-tooling/README.md:3,14,31` described three packets | `.opencode/skills/mcp-tooling/leaf-manifest.json:2-69` | `mcp-tooling/README.md:3,14,31-37` describes the six registered modes |
| RE-005-07 | fixed | `mcp-mobbin/README.md:40,124,159,192,197` described a one-tool surface | `mcp-mobbin/README.md:94-100` and `references/discovery-fixture-2026-07-16.json` | `mcp-mobbin/README.md:40,124,159,192,197` consistently documents three tools |
| RE-008-02 | fixed | `mcp-code-mode/references/tool-catalog.md:3,17,53-62` advertised unrelated manuals and counts | `.utcp_config.json:14-199` | `tool-catalog.md:2-67` lists the ten configured manuals and delegates callable inventory to discovery |
| RE-008-03 | fixed | `mcp-code-mode/references/workflows.md` used `myservice`/`notion` namespaces | `.utcp_config.json:14-199` plus live discovery contract | `workflows.md:16-104` uses discovery-first placeholders and one confirmed Mobbin callable |
| RE-008-04 | fixed | `mcp-code-mode/SKILL.md:69-75` said playbook leaves were never typed leaves | `mcp-code-mode/leaf-manifest.json:2-38` | `mcp-code-mode/SKILL.md:69-75` states the manifest-routed playbook contract |
| RE-008-05 | already-fixed | `mcp-code-mode/SKILL.md:4` was already current at leaf start | `mcp-code-mode/SKILL.md:4` | Closed without edit: all four Code Mode core tools are already listed |
| RE-009-04 | already-fixed | The stale manifest case was already regenerated before this leaf | `mcp-tooling/leaf-manifest.json` canonical `references/INSTALL-GUIDE.md` entry | Closed without edit: concurrent regeneration already restored the canonical install-guide reference |
| E-NEW-01 | fixed | `cli-pi/references/cli-reference.md:28-31` did not state print-mode message selection | `.opencode/specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md:61` | `cli-pi/references/cli-reference.md:30,167-173` says print exposes only the final assistant message and structured leaves use `--mode json` |
| E-NEW-02 | fixed | `cli-pi/references/cli-reference.md:167-173` lacked a captured-output bound | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2390` sets `maxBuffer: 20 * 1024 * 1024` | `cli-pi/references/cli-reference.md:171` states the 20 MB cap, truncation or kill beyond it, and the bounded-output requirement |

Fleet gate receipt: the supplied concurrent re-baseline is **11/11 clean**; the stale case-renamed install-guide leaf was regenerated concurrently, so T002 is closed without another manifest edit.

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — CLI packet references

- [x] T010 [P] Correct the codex packet's native JSONL, final-response schema, and scripted resume syntax (`cli-codex/references/cli-reference.md`) — `RE-005-02`
- [x] T011 [P] Correct the claude-code packet's invocation forms; boolean flags no longer take values (`cli-claude-code/references/cli-reference.md`) — `RE-005-01`
- [x] T012 [P] Restore Cursor's CLI-level parameterized-model rejection claim and remove the retired auth surface (`cli-cursor/references/`, `cli-cursor/SKILL.md`) — `RE-005-03` (bracket claim refuted; auth subclaim fixed)
- [x] T013 [P] Move Devin containment out of the permission-mode table and document it as orthogonal (`cli-devin/references/providers-and-models.md`) — `RE-005-04`
- [x] T014 [P] Add the numbered OVERVIEW section to the Devin README (`cli-devin/README.md`) — `RE-005-05`
- [x] T015 [P] Audit/disposition the supplied zero-finding CLI inputs; the confirmed cli-pi gaps are recorded and corrected below (`cli-pi/references/`) — Q2
- [x] T016 [P] Document that print mode surfaces only the final assistant message and that structured-output leaves use `--mode json` (`cli-pi/references/cli-reference.md`) — `E-NEW-01`
- [x] T017 [P] Document the fanout runner's 20 MB captured-stdout cap and bounded structured output (`cli-pi/references/cli-reference.md`) — `E-NEW-02`

### Lane B — deep-loop executor rosters

- [x] T018 Add registry-matching tool-permission frontmatter and the full fail-closed outcome set (`system-deep-loop/deep-alignment/SKILL.md`) — `RE-004-01` ⚑
- [x] T019 Correct the convergence-decision table to include the full code decision set; the closed finding remains closed on refutation-audit grounds (`system-deep-loop/deep-alignment/README.md`) — Q1
- [x] T020 Reconcile the capability matrix against the live capability data (`deep-research/references/guides/capability-matrix.md`) — `RE-004-03` ⚑
- [x] T021 Replace the retyped dispatch-branch list with the seven-kind authority plus inline/fan-out split (`deep-research/SKILL.md`) — `RE-004-04` ⚑
- [x] T022 Apply the same executor-schema split to the review loop protocol (`deep-review/references/protocol/loop-protocol.md`) — `RE-004-05` ⚑
- [x] T023 Correct council advertised routes to the resolver allowlist (`deep-ai-council/SKILL.md`) — `RE-004-06` ⚑
- [x] T024 Resolve duplicated executor rows in the seat-vantage table (`deep-ai-council/references/patterns/seat-diversity-patterns.md`) — `RE-004-07` ⚑
- [x] T025 Derive the dispatcher map from its authority (`deep-improvement/references/model-benchmark/lane-b-mechanics.md`) — `RE-004-08` ⚑
- [ ] T026 [B] Apply the accepted Copilot ruling to the three command YAML branch sites. Blocked on ADR-001 (`.opencode/commands/deep/assets/`) — `RE-004-12` ⚑, **[OPERATOR-DECISION: DR-1]**
- [ ] T027 Run the reverse sweep for the malformed three-item list across `.opencode/` and repair every site, including any beyond the four the research reported — `REQ-005`

### Lane C — Code Mode and the MCP hub

- [x] T028 [P] Reconcile the tool catalog against the ten manuals actually configured (`mcp-code-mode/references/tool-catalog.md`) — `RE-008-02`
- [x] T029 [P] Replace non-live workflow namespaces with discovery-first examples (`mcp-code-mode/references/workflows.md`) — `RE-008-03`
- [x] T030 [P] Reconcile the leaf-routing prose with the generated manifest (`mcp-code-mode/SKILL.md`) — `RE-008-04`
- [x] T031 [P] Already fixed before this leaf: `allowed-tools` already lists `call_tool_chain`, `list_tools`, `search_tools`, and `tool_info`; no edit — `RE-008-05`
- [x] T032 [P] Replace the hub README's packet-count topology statement with the six-mode manifest set (`mcp-tooling/README.md`) — `RE-005-06`
- [x] T033 [P] Reconcile the packet README with its live three-tool contract (`mcp-tooling/mcp-mobbin/README.md`) — `RE-005-07`

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
- [x] T042 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` → Errors: 0, Warnings: 0, rc 0 (evidence: `validate.sh --strict`)
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
