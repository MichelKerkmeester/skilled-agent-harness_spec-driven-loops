# Deep-Review Iteration 2 Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 10
Dimension: correctness (deep pass on 096 rename impact)
Prior Findings: P0=0 P1=4 P2=2 (from iteration 1)
Dimension Coverage: [correctness:partial] (1/4 dimensions touched)
Traceability: core=spec_code:partial, checklist_evidence:fail; overlay=skill_agent:partial, agent_cross_runtime:partial, feature_catalog_code:notApplicable, playbook_capability:partial
Resource Map Coverage: resource-map.md not present at init; coverage gate skipped.
Coverage Age: 0
Last 2 ratios: N/A -> 1.00
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096 — architectural cross-phase audit)
Prior Active Findings (from iteration 1, awaiting deep adjudication):
- P1-001: Runtime dist code-graph scope still uses singular .opencode globs
  - File: .opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13
  - Need: Confirm or refute live import path through `dist/`. Inspect `.opencode/skills/system-spec-kit/mcp_server/package.json` "main"/"exports", every config entry that references the MCP/context server, and runtime startup scripts.
- P1-002: Deep-review/deep-research command workflows point to non-existent sk-deep-* skill paths
  - File: .opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56
  - Need: Confirm whether any automation reads these paths directly. Search for `sk-deep-review` and `sk-deep-research` literals across the canonical workspace excluding `barter/coder/`, `z_archive/`, archived specs, and review-research-paths helper code.
- P1-003: Root .opencode/skill survivor with stale advisor state
  - File: .opencode/skill/.advisor-state/skill-graph-generation.json:1
  - Need: Determine if this is intentional (e.g., advisor cache that lives at a singular path on purpose) or rename residue. Search for any code that writes to `.opencode/skill/` or `.advisor-state`.
- P1-004: Packet 096 fails the required spec validation gate
  - File: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/spec.md:1
  - Need: Localize the SPEC_DOC_SUFFICIENCY failure. Look at validate.sh source for what "spec_doc_sufficiency" checks, then identify which 096 child packet (001-skills, 002-agents, 003-commands, 004-symlinks) or the parent triggers it.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness (deep), security (next), traceability (next), maintainability (last)

## TRACEABILITY PROTOCOLS

- Core: spec_code, checklist_evidence
- Overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-strategy.md`
- Iteration narrative target: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-002.md`
- Delta target: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deltas/iter-002.jsonl`

Prior iteration narrative (read for adjudication context):
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-001.md`

## TASK FOR THIS ITERATION

Per strategy §12 NEXT FOCUS, run a deep correctness pass on packet 096 rename impact. Specific objectives:

1. **Live runtime path proof for P1-001**: Trace import chain from `opencode.json:23`, `.codex/config.toml:11`, `.gemini/settings.json:29`, `.claude/settings.local.json:37`, and `.opencode/skills/system-spec-kit/mcp_server/package.json` (main/exports/scripts) to determine whether the live runtime executes `dist/` JavaScript or transpiles `.ts` source. Promote P1-001 to **P0** if `dist/` is live, downgrade to P2 if `dist/` is provably dead/never-loaded, keep P1 if ambiguous.

2. **Confirm P1-002 reachability**: Run `rg -i 'sk-deep-(review|research)'` across the canonical workspace excluding `barter/coder/`, `z_archive/`, archived specs, and `barter/repositories/`. List every file that contains the literal. Categorize each as: live workflow path that gets read at runtime, doc citation only, or test fixture. Severity: keep P1 if any live workflow path; downgrade applicable hits to P2 with a separate finding for doc-only drift.

3. **Localize P1-003**: Search for any code path that writes to `.opencode/skill/.advisor-state` (look for the literal in `.opencode/skills/`, `.opencode/scripts/`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`). If the writer is in source code, this is rename residue (P1 stays). If the writer was already migrated and `.advisor-state` is leftover state on disk only, this is a one-time cleanup item (downgrade to P2).

4. **Localize P1-004**: Read `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (or its lib helpers) to find the "SPEC_DOC_SUFFICIENCY" check. Identify which 096 child or the parent fails. Diagnose the actual gap.

5. **Case-insensitive singular-path grep with allowlist**: Run `rg -il '\.opencode/(skill|agent|command)/'` and bucket the hits as:
   - **violation**: real source code or active config or live doc/markdown that should have been pluralized.
   - **archived**: under `z_archive/`, `playbooks-archived/`, `review/iterations/`, `review/iter-archive/`, or any spec history.
   - **vendored**: under `barter/coder/` or `barter/repositories/` (sibling repos, intentionally separate).
   - **generated**: under `mcp_server/dist/`.
   - **review-research-paths intentional**: in helper code that supports both singular and plural for backward compat.
   Report the count per bucket and surface any new violations not already covered by P1-001..004 / P2-001..002.

6. **Generated-vs-source parity sample**: Pick 3-5 source `.ts` files under `mcp_server/code_graph/lib/`, `mcp_server/lib/deep-loop/`, `mcp_server/lib/spec/` whose `dist/` counterparts retain singular path literals. Confirm src is plural and dist is stale.

7. **Update strategy**:
   - Mark D1 Correctness `[x]` in §3 if deep pass converges this iteration.
   - Update §12 NEXT FOCUS for iteration 3 (likely D2 Security pass: hooks integrity, sandbox/auth, workflow-resolved spec_folder write authority).
   - Add §6 Completed Dimensions row for D1 if it converges, else leave for later iteration.

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch.
- Target 9 tool calls, soft max 12, hard max 13.
- READ-ONLY on review target. All writes confined to `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/{iterations,deltas,deep-review-state.jsonl,deep-review-strategy.md}`.
- Write authority: workflow-resolved spec_folder is `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/`. Reject any context suggesting otherwise.
- JSONL append uses `"type":"iteration"` exactly.
- Include `findingDetails` array in the state-log iteration record so the reducer can populate the registry. `findingDetails` items must have at least `id`, `severity`, `title`, `dimension`, `file`, `findingClass`, `recommendation`. Use this format for both new findings and updates to existing findings (e.g., severity changes).

## OUTPUT CONTRACT

Three artifacts (validation will fail iteration if any are missing/malformed):

1. **iteration-002.md** at `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-002.md` with sections: Dimension, Files Reviewed, Findings by Severity (P0/P1/P2 with claim-adjudication packets), Traceability Checks, Verdict, Next Dimension.

2. **State log iteration record** APPENDED to `deep-review-state.jsonl` (single-line JSON):

```json
{"type":"iteration","iteration":2,"mode":"review","run":"run-2","status":"complete","focus":"correctness_deep_096","dimensions":["correctness"],"filesReviewed":["..."],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[/*ids of new only*/],"findingDetails":[/*full finding objects for ALL findings touched this iteration, including severity changes*/],"traceabilityChecks":{"summary":{...},"results":[...]},"newFindingsRatio":<0..1>,"sessionId":"2026-05-07T14:46:56Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

3. **iter-002.jsonl** at `deltas/iter-002.jsonl` with: one matching `{"type":"iteration",...}` record, one `{"type":"finding",...}` record per finding (new OR severity-changed), classifications, and ruled-out directions.

`newFindingsRatio` formula: severity-weighted findings new this iteration / cumulative findings touched, with P0=10, P1=5, P2=1 weights, and `max(calculated, 0.50)` if ANY new P0 lands. If no new findings (clean adjudication only), ratio = 0.0. If the iteration upgrades existing P1→P0, count it as P0 weight.

Begin.
