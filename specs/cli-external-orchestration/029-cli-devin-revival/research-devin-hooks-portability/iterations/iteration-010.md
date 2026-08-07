# Iteration 10 — Final convergence report and remaining gaps

## Focus

Close the ten-iteration research run by consolidating the existing evidence, reporting coverage for Q1–Q6, and handing phase 004 a bounded implementation recommendation. This is a convergence-only pass: it introduces no new source or file-line claims.

## Actions Taken

- Read the accumulated state log, findings registry, iterations 001–009, phase 001's Devin contract summary, and phase 004's ADR-001.
- Cross-checked the final counts and the reducer-owned distinction between evidence gathered in the iteration narratives and questions promoted as resolved in `findings-registry.json`.
- Preserved the iteration-009 evidence package as the source of truth for the C-01–C-20, P-01–P-15, G-01–G-07 verdicts, the native-import matrix, and the eight-event Devin registration skeleton.
- Wrote only this narrative, the canonical iteration-010 state record, and the iteration-010 delta file. The reducer-owned registry and dashboard were not modified, and no `research/evidence/` directory was created because it is outside this leaf's write allow-list.

## Findings

### Convergence verdict

The research is converged at the evidence level, but not registry-complete. The prior iterations answer all six questions from repository and pinned-contract evidence; the reducer still reports `resolvedQuestions=[]`, so the report must not claim that the registry has promoted those answers.

The durable ADR-001 recommendation is unchanged: explicit Devin adapters are authoritative. `read_config_from.claude:true` is a compatibility probe or conditional baseline for simple Claude-style lifecycle commands, not a parity mechanism. It does not rewrite matchers, normalize payloads or environments, translate output envelopes, provide missing Stop evidence, turn `PreCompact` into `PostCompaction`, or import OpenCode plugin factories.

The reusable boundary is the runtime-neutral policy core plus a thin Devin transport adapter. The adapter owns Devin event matching, `DEVIN_PROJECT_DIR` anchoring, stdin normalization, exit-policy preservation, and Devin decision/context output. Completion evidence and post-compaction recovery remain semantic adaptations because their required lifecycle inputs are absent or changed under Devin.

### Convergence metrics

| Metric | Final value | Evidence |
|---|---:|---|
| Iterations run | 10 | Canonical state records for iterations 001–010; this record closes the tenth pass. |
| Total findings | 45 promoted key findings | `findings-registry.json` contains 45 `keyFindings`; the accumulated graph separately contains 33 unique `FINDING` nodes through iteration 009. |
| Registry key count | 45 | `findings-registry.json` `keyFindings` length. |
| Evidence graph through iteration 009 | 83 unique nodes / 145 graph events | Existing state-log graph records; iteration 010 adds no graph events because it is consolidation-only. |
| New-information ratios | `0.94 → 0.78 → 0.82 → 0.86 → 0.88 → 0.84 → 0.90 → 0.92 → 0.31 → 0.08` | Canonical iteration records; iteration 010 is intentionally low-novelty. |

Ratio sparkline: `█▆▇▇█▇██▁▁`

The 45 registry findings and 33 graph `FINDING` nodes are different reducer measures, not contradictory totals: the former is the promoted findings registry, while the latter is the typed graph-node count.

### Final portability decision

- Claude settings: seven registered event keys and 19 command handlers are enumerated in the consolidated C-01–C-20 table. The source handlers are not production-portable 1:1: the usable rows need Devin matcher, payload, cwd/env, output, or lifecycle adaptation; `PreCompact` has no 1:1 Devin event; `PermissionRequest` has no Claude source row.
- OpenCode: 15 plugin entrypoints are enumerated in P-01–P-15. None is imported by Devin's Claude configuration path. Plugin-only host behavior is not a hook-port target; use MCP, daemon CLI, Devin rules/skills, or bounded lifecycle adapters as the row-specific alternative.
- Guard cores: all seven G-01–G-07 policy cores are reusable, but every current transport needs a Devin boundary. Six are thin transport adaptations; completion evidence has an additional semantic input gap at `Stop`.
- Devin lifecycle: the eight-event contract and `.devin/hooks.v1.json` entry shape are pinned. The proposed skeleton deliberately omits `PreCompact`, `async`, OpenCode registrations, and a fabricated `PermissionRequest` handler.

### Recommended next step for phase 004

Use iteration 009 as the ADR-001 evidence package, then implement and verify the explicit adapter layer in this order:

1. Run the authenticated Devin smoke tests for imported Claude settings, matcher behavior, stdin fields, stdout/stderr, exit `2`, and top-level JSON decisions.
2. Freeze the adapter contract for `DEVIN_PROJECT_DIR`, `exec`, `edit`, `run_subagent`, generic `mcp__.*`, and the actual Stop/PostCompaction evidence inputs.
3. Implement thin adapters around the seven neutral cores, starting with `UserPromptSubmit`/`PreToolUse` and `PostToolUse`, then Stop/PostCompaction and SessionEnd.
4. Keep native Claude import opt-in and diagnostic until live `/hooks` evidence proves a row's fidelity; do not use it as the enforcement path by default.

## Questions Answered

### Key-question coverage matrix

| Question | Evidence status | Per-row evidence | Registry status |
|---|---|---|---|
| Q1 — Claude hook inventory | **Answered in research** | Iteration 009 C-01–C-20 enumerates seven settings keys, 19 handlers, matcher, target event, and rationale; see `iteration-009.md:29-56`. | Unresolved: registry still has `resolved:false`. |
| Q2 — OpenCode/plugin and guard inventory | **Answered in research** | Iteration 009 P-01–P-15 and G-01–G-07 enumerate the 15 plugin entrypoints and seven guard cores; see `iteration-009.md:58-94`. | Unresolved: registry still has `resolved:false`. |
| Q3 — Devin eight-event contract | **Answered in research** | Phase 001 pins the eight lifecycle events, JSON stdin, entry shape, and decision/context behavior; iteration 009 restates the contract at `iteration-009.md:216-218`. | Unresolved: registry still has `resolved:false`. |
| Q4 — Per-source port verdicts | **Answered in research** | The consolidated C/P/G tables classify every source as needs adaptation, cannot port 1:1, or an explicit no-source row, with matcher/payload/cwd/env/output/lifecycle rationale; see `iteration-009.md:25-94`. | Unresolved: registry still has `resolved:false`. |
| Q5 — Native Claude import coverage | **Answered in research** | The native-import matrix identifies conditional shell/prompt candidates, matcher and payload gaps, the compaction gap, and zero OpenCode-plugin coverage; see `iteration-009.md:96-107`. | Unresolved: registry still has `resolved:false`. |
| Q6 — ADR-001-ready matrix | **Answered as a research artifact** | The C/P/G tables, native-import decision, lifecycle analysis, and eight-event skeleton are assembled in iteration 009; see `iteration-009.md:25-195`. | Unresolved: registry promotion and dashboard synchronization remain. |

“Answered in research” means the evidence package contains the answer. It does not mean the reducer has marked the legacy-import questions resolved.

## Questions Remaining

### Live verification before or during phase 004

- Run authenticated Devin `/hooks` in this repository and record whether imported `PreCompact` is ignored, warned on, or rejected, and how `async` is handled.
- Smoke-test plain stdout, stderr, exit `2`, and top-level JSON decisions for imported commands and explicit adapters.
- Capture one live `PreToolUse(run_subagent)` event to confirm required fields and the runtime representation of `resume`.
- Confirm Devin's file-write vocabulary, `tool_use_id`/`cwd` presence, and the actual process cwd for command hooks.
- Determine the safe Devin-owned source for the final assistant claim and active spec folder at `Stop`.
- Smoke-test `PostCompaction` context injection, including a null summary, and verify whether a follow-up `SessionStart` or `UserPromptSubmit` occurs.
- Confirm the live `mcpServers` registration shape for repository daemon launchers, including relative working directory and environment propagation.

### Reducer and implementation follow-up

- Promote the iteration-005, iteration-008, and iteration-009 evidence into the registry and reconcile the six key-question statuses before calling ADR-001 registry-complete.
- Update phase 004 ADR-001 with the consolidated evidence, then implement the adapters and run the phase checklist. This research pass claims neither implementation nor runtime parity.

## Next Focus

Phase 004 implementation preflight: reconcile the reducer state, run authenticated Devin contract probes, then implement the explicit adapter layer with native Claude import retained only as a tested compatibility baseline.

## SCOPE VIOLATIONS

None. No out-of-scope target files were modified; the requested `research/evidence/` material remains represented by iteration 009 because this leaf cannot create that directory.

## Assessment

`newInfoRatio`: **0.08**. This iteration adds no new source fact; it closes the research run by making the evidence-versus-registry boundary, counts, coverage matrix, and phase-004 handoff explicit.

## Sources Consulted

- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/deep-research-state.jsonl`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/findings-registry.json`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/research/iterations/iteration-001.md` through `iteration-009.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md`
