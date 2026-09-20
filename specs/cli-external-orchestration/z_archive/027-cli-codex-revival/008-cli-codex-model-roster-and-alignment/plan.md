---
title: "Implementation Plan: cli-codex model roster + codex-hook doc alignment"
description: "Verify-then-document plan: run the twenty-cell live model×effort matrix, then propagate a coherent four-model roster with per-model ceilings across six cli-codex docs plus a changelog, and fix a stale codex-surface claim."
trigger_phrases: ["cli-codex model roster plan"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/008-cli-codex-model-roster-and-alignment"
    last_updated_at: "2026-07-14T04:11:03Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the plan; roster shipped and live-verified"
    next_safe_action: "Reindex renamed cli-codex docs after primary reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-codex model roster + codex-hook doc alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Run a live `codex exec` matrix across every candidate model×effort cell first, then expand the cli-codex Model Selection roster from a single `gpt-5.5` lock to the four fast-tier models with per-model ceilings, extend the documented effort scale with `max` and `ultra`, reframe the CX-002 playbook in place, add a `1.6.0.0` changelog, and correct the stale "`.codex/` is not present" claim in the `code-opencode` agent-authoring checklist. The default dispatch stays `gpt-5.5 medium fast`.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] All twenty model×effort cells return correctly under live `codex exec` before any roster doc is written.
- [ ] The roster is identical across SKILL.md, README.md, and cli_reference.md (same four models, same ceilings).
- [ ] The default dispatch (`gpt-5.5 medium fast`) is unchanged.
- [ ] CX-002 keeps its filename (`gpt_5_5_model_lock.md`) and id; the playbook index still resolves.
- [ ] The agent-authoring checklist matches the live `.codex/` filesystem.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
This is a documentation-alignment change with a live-verification front end. The roster is expressed once as a per-model ceiling contract (`gpt-5.5` ≤ `xhigh`; `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra`) and mirrored into each consuming doc: the SKILL.md flag table and override examples, the README roster, the cli_reference Supported Models + effort-value tables, and the prompt-templates model-override note. The playbook carries the empirical proof (the 20-cell matrix) so the roster claim is verifiable, not asserted. The stale codex-surface claim is corrected independently in the `code-opencode` checklist.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| Live `codex exec` matrix | Ground truth for callability | Run first | 20/20 cells return correctly |
| cli-codex SKILL.md / README.md / cli_reference.md | Roster authority | Modify | Rosters agree; ceilings consistent |
| prompt_templates.md | Dispatch templates | Modify | Model-override note + extended efforts present |
| CX-002 playbook + index | Manual verification | Reframe in place | Filename + id kept; index resolves |
| code-opencode agent_authoring.md | Authoring checklist | Correct claim | Matches live `.codex/` mirror |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Live verification
- [ ] Dispatch the full twenty-cell model×effort matrix through `codex exec` (read-only, `service_tier=fast`) and record each result.
### Phase 2: Roster docs
- [ ] Update SKILL.md (version 1.6.0.0), README.md, and cli_reference.md with the four-model roster and per-model ceilings.
### Phase 3: Templates + effort scale
- [ ] Add `max`/`ultra` to the documented effort scale and the prompt-templates model-override note.
### Phase 4: Playbook reframe + changelog
- [ ] Reframe CX-002 in place, update the index + global precondition #6, and add `changelog/v1.6.0.0.md`.
### Phase 5: Alignment fix + closeout
- [ ] Correct the stale `.codex/` claim in the agent-authoring checklist; reconcile metadata; `validate.sh --strict` Errors: 0.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
The load-bearing test is the live `codex exec` matrix: each of the twenty cells (`gpt-5.5` low/medium/high/xhigh; `gpt-5.6-luna` + `gpt-5.6-terra` low/medium/high/xhigh/max; `gpt-5.6-sol` low/medium/high/xhigh/max/ultra) is dispatched read-only on the `fast` tier and must return a correct response. The matrix is captured in the CX-002 playbook so the roster claim is auditable. Doc consistency is checked by cross-reading the ceiling contract in every consuming file, and `validate.sh --strict` gates the spec-folder docs.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `fast` service tier exposes the four models | External | Green | Roster would be inaccurate; confirmed live. |
| ChatGPT OAuth auth for `codex exec` | External | Green | Verification blocked without it; present. |
| cli-codex doc set | Internal | Green | Target of the change; present. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert the eight modified/created files to their prior revision. There is no runtime code change, so reverting restores the single-model docs exactly; the default dispatch is unaffected either way.
<!-- /ANCHOR:rollback -->
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
- **T001 → T002** (live matrix) gates every roster doc — no model is documented before it is proven callable.
- **T003–T005** (SKILL.md, README.md, cli_reference.md) depend on T002 and are mutually consistent by the shared ceiling contract.
- **T006** (prompt-templates + effort scale) depends on the ceiling contract from T003.
- **T007–T008** (CX-002 reframe + index/precondition) depend on the matrix capture from T002.
- **T009** (changelog) depends on the roster docs existing; **T010** (stale-claim fix) is independent; **T011** (closeout) depends on all.
<!-- /ANCHOR:dependency-graph -->
<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
`T002` (live 20-cell matrix) `→ T003` (SKILL.md roster) `→ T005` (cli_reference tables) `→ T007` (CX-002 reframe) `→ T011` (closeout). The live matrix is the longest-lead item because a phantom model ID would only surface at dispatch time; running it first de-risks every downstream doc.
<!-- /ANCHOR:critical-path -->
<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Definition | Gate |
|---|---|---|
| M1 Verified | 20/20 live matrix returns correctly | Phase 1 |
| M2 Roster shipped | SKILL.md 1.6.0.0 + README + cli_reference carry the four-model roster | Phase 3 |
| M3 Playbook aligned | CX-002 reframed in place; changelog added | Phase 4 |
| M4 Claim fixed | Stale `.codex/` claim corrected | Phase 5 |
| M5 Closed out | Metadata reconciled; `validate.sh --strict` Errors: 0 | Phase 5 |
<!-- /ANCHOR:milestones -->
## L3: AI EXECUTION PROTOCOL
### Pre-Task Checklist
Before writing any roster doc: confirm the target model×effort cell returned correctly in the live matrix; confirm the per-model ceiling matches every other doc; confirm the default dispatch string is untouched.
### Task Execution Rules
- **TASK-SEQ**: the live matrix (T002) precedes every roster doc; no model is documented before it is proven callable.
- **TASK-SCOPE**: touch only the six cli-codex docs, the new changelog, and the one `code-opencode` checklist line. Never change the default dispatch or a codex hook adapter.
### Status Format
Report each task as `T### — <result> (evidence: matrix cell / file:line / diff)`, distinguishing confirmed from inferred.
### Blocked Task Protocol
If a model cell fails to return live, stop, record the failure, and do NOT document that model×level; document only proven cells and mark the gap explicitly rather than asserting an unverified claim.
