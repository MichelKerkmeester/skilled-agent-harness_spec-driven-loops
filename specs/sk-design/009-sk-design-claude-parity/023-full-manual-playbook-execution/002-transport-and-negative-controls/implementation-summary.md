---
title: "Implementation Summary"
description: "Ran real cli-opencode dispatches for MR-007, AI-002, AI-003, AI-004, SR-001 and graded each against its own scenario file's Pass/Fail Criteria: 3 PASS (AI-002, AI-003, AI-004), 2 FAIL (MR-007 advisor-scorer + tool-surface violation, SR-001 mandatory shared-resource load skipped). One in-repo side effect reverted; one out-of-repo side effect documented and left for operator review."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 002 implementation summary"
  - "transport negative controls summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/002-transport-and-negative-controls"
    last_updated_at: "2026-07-07T15:45:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Generate description.json + graph-metadata.json, run validate.sh --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "dispatch-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "playbook-wave-002-transport-negative"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should ~/.config/opencode/opencode.json's open-design MCP entry (added by MR-007's dispatch) be reverted or kept?"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-transport-and-negative-controls |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Real `cli-opencode` dispatches (advisor probe + full orchestrator run) for the 5 scenarios assigned to this wave: the Open Design transport-mode routing proof (`MR-007`) and four advisor-integration boundary proofs (`AI-002` pure code, `AI-003` documentation write, `AI-004` code-correctness review, `SR-001` shared-reference-base loading). Each dispatch's full JSON-lines transcript was parsed for tool calls and text, then graded strictly against that scenario file's own Pass/Fail Criteria section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/002-transport-and-negative-controls/{spec,plan,tasks,checklist,implementation-summary,dispatch-log}.md` | Created | This wave's Level 2 documentation |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` + `tests/unit/executor-config.vitest.ts` | Modified then reverted | `AI-002`'s dispatch implemented the requested refactor for real; reverted via `git restore` since it was an unrequested out-of-scope repo mutation |
| `~/.config/opencode/opencode.json` (outside repo) | Modified, left as-is | `MR-007`'s dispatch wired a real `open-design` MCP server entry; documented, not reverted (see Known Limitations) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran all 5 advisor probes first (`skill_advisor.py --threshold 0.8` against each clean exact prompt), then ran the 5 real dispatches strictly one at a time. `MR-007`'s dispatch auto-backgrounded at roughly the two-minute mark (the harness's own behavior, not a manual choice), so its completion was awaited via `Monitor` polling for the transcript file to populate rather than blocking the tool call. The other 4 dispatches completed synchronously within their own `Bash` calls.

Each transcript was parsed with inline `python3` for `tool_use` parts (tool name, input, in call order) and `text` parts (the model's own stated routing rationale, often prefixed `SKILL ROUTING:`), which made grading direct: the dispatched model consistently narrated which skill/mode it resolved to and why, so the grading did not have to infer routing from tool-call order alone.

Two real, unrequested side effects surfaced during grading, neither anticipated by the phase-023 parent's own risk register (which only flags `MR-005`/`AI-001-P5` as needing a post-dispatch `git status --porcelain` check):

1. **`AI-002`** (`Refactor the parseExecutorConfig function...`) was phrased as a genuinely actionable code task, and the dispatched model treated the "standalone evaluation call... no repo documentation needed" addendum as only suppressing spec-folder tracking (Gate 3), not the underlying code change — it located the real `parseExecutorConfig` function in `deep-loop-runtime/lib/deep-loop/executor-config.ts`, implemented the throw-on-missing-kind behavior, updated the affected unit tests, and ran `npm test`/`npm run typecheck` to confirm. This is real, unrelated production code on a shared branch with other concurrent work in flight; `git status --short` confirmed the mutation was fully attributable to this dispatch (no staged/pre-existing change on those two paths), so it was reverted with `git restore` and reconfirmed clean.
2. **`MR-007`** (`Wire Open Design's MCP server into opencode...`) is, by its own scenario design, a task that only makes sense as a real action (there is nothing to "simulate" about wiring an MCP server) — the dispatched model correctly recognized this ("Open Design wiring is a pure transport task... I won't run any design generation") and used `apply_patch` to add a real `open-design` MCP entry to the user's global `~/.config/opencode/opencode.json` (previously an empty `mcp: {}`), then verified it with `opencode mcp list`. Unlike `AI-002`, this file has no git safety net and the change may be a genuinely wanted, functional outcome for the user's actual machine — it was left in place and documented rather than unilaterally reverted.

Grading then proceeded scenario-by-scenario against each file's own Pass/Fail Criteria, cited verbatim in `dispatch-log.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run advisor probes for all 5 scenarios before any real dispatch, rather than interleaving strictly one probe-then-dispatch pair at a time | Probes are cheap, deterministic, and independent of dispatch ordering; batching them first let the mandatory "one dispatch at a time" rule apply only to the actual `cli-opencode` orchestrator calls |
| Include `NO_TARGET_CLAUSE` only for `SR-001` | `SR-001`'s "this landing page" is a hypothetical local UI target absent from this repo, matching the recipe's own trigger examples; the other 4 prompts name non-UI targets (a TypeScript function, a README section, a backend API handler) or infrastructure with a real discoverable local target (Open Design's actually-installed CLI/daemon), none of which match the clause's trigger condition |
| Revert `AI-002`'s in-repo code mutation but not `MR-007`'s out-of-repo config mutation | The former is git-tracked, exactly and safely reversible, unambiguously out of this wave's scope, and left in place would corrupt the shared branch's `git status` for other concurrent work; the latter has no git safety net, may be a genuinely wanted functional outcome on the user's real machine, and reverting it is itself an unrequested action outside this wave's mandate — the responsible choice was to document it precisely (exact diff, rollback path) and flag it as an open question rather than silently decide either way |
| Grade `SR-001` FAIL rather than PARTIAL despite substantively correct mode routing and register-first design judgment | The scenario's own title and purpose ("Interface Shared References" / "verifies that interface mode... loads shared reference-base resources") make resource-loading discipline the scenario's core test subject, not a secondary nicety; the specific resource skipped (`shared/context_loading_contract.md`) is marked `ALWAYS` in `design-interface/SKILL.md`'s own Resource Loading Levels table and is literally the "context loading contract" the scenario is named for, and the scenario's own Pass/Fail Criteria both name it in the PASS conjunction and trigger the FAIL condition ("shared resources are skipped") verbatim |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Dispatch | Advisor Top-1 (probe) | sk-design in Result | Real-Dispatch Routing | Mutation | Verdict |
|----------|------------------------|----------------------|------------------------|----------|---------|
| `MR-007` | `sk-code` 0.95 (tied w/ 3 others) | 6th, 0.90 | Self-corrected to `design-mcp-open-design` after loading `sk-code`/`customize-opencode` first; internal advisor call also ranked `sk-code` top-1 (0.9184) | `apply_patch` on `~/.config/opencode/opencode.json` (mutating tool beyond `Bash`) | **FAIL** |
| `AI-002` | `sk-code` 0.9126 | Absent | `sk-code` -> `code-opencode`, no design packet | Real code edit (reverted) | **PASS** |
| `AI-003` | `sk-doc` 0.9185 | 2nd, 0.9062 | `sk-doc` -> `create-readme`, no design packet | None | **PASS** |
| `AI-004` | `sk-code` 0.8985 | 2nd, 0.82 | `code-review` only, no `design-audit` | None | **PASS** |
| `SR-001` | `sk-design` 0.82 | Win (only result >= threshold) | `interface + foundations`; register stated before colors | None; but 2 `ALWAYS`/mandatory resources never loaded | **FAIL** |

**Wave tally**: 3 PASS, 2 FAIL, 0 PARTIAL, 0 SKIP.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`~/.config/opencode/opencode.json`'s `open-design` MCP entry remains in place**, added by `MR-007`'s dispatch as a real, functional wiring of the user's actually-installed Open Design app. It was left un-reverted (see Key Decisions) and is flagged as an open question for operator review. Because this is a global, not per-repo, config file, it also changes the baseline every other sibling wave's `cli-opencode` dispatch runs against for any future `MR`-family or Open Design-adjacent prompt — a cross-wave test-isolation consideration outside this wave's remediation scope.
2. **`MR-007`'s advisor-scorer pattern (`sk-code` consistently outranking `sk-design` for an Open Design wiring prompt, both in the standalone probe and the in-dispatch call) is recorded as a finding, not remediated.** This wave's Out of Scope explicitly defers "fixing anything the dispatches reveal as broken" to a follow-up phase; per the operator's own active project memory, a shared-scorer-saturation investigation (`system-skill-advisor/001-scorer-saturation-root-fix`) is already tracked separately and may be the correct home for this finding.
3. **`SR-001`'s missed `shared/context_loading_contract.md`/`design-interface/assets/interface_preflight_card.md` loads are recorded as a finding, not remediated**, per the same Out of Scope boundary — this wave documents that `design-interface/SKILL.md`'s own `ALWAYS`/"not optional" resource-loading contract was not honored in this one real dispatch; whether this is a one-off model-behavior gap or a systemic packet-instruction-following issue is not established by a single dispatch and would need repeat runs to confirm.
<!-- /ANCHOR:limitations -->
