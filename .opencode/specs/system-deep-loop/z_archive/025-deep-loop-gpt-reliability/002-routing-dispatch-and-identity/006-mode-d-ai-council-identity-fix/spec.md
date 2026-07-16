---
title: "Feature Specification: Mode-D Gate Fix + ai-council Route-Identity Fix"
description: "Replace the Phase-0 self-classification gate in all 7 /deep:* command files with a deterministic dispatch-context check, and reconcile the ai-council route-proof identity (orchestrate-topic.cjs + deep_ai-council_auto.yaml) toward mode-registry.json. Two low-risk, independently-landable fixes bundled as the first phase per research/research.md."
trigger_phrases:
  - "mode d gate fix"
  - "ai-council route identity fix"
  - "phase 0 self check"
  - "deterministic dispatch context check"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../007-gpt-behavioral-hardening-research/research/research.md"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/006-mode-d-ai-council-identity-fix"
    last_updated_at: "2026-07-01T13:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 009"
    blockers: []
    key_files:
      - "../007-gpt-behavioral-hardening-research/research/research.md"
      - ".opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs"
      - ".opencode/commands/deep/assets/deep_ai-council_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-008-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dispatch-context signal: no runtime API exists to check this from a markdown contract, so the check is evidence-based prose (direct /deep:* invocation vs. content pasted inline into another agent's dispatch prompt), defaulting to PROCEED on ambiguity -- see implementation-summary.md."
      - "Are the 7 command files' Phase-0 blocks byte-identical? No -- structurally identical, each substitutes its own loop description/command name (3 of 7 add file-specific extras, preserved verbatim)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Mode-D Gate Fix + ai-council Route-Identity Fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Packet** | `025-deep-loop-gpt-reliability` |
| **Predecessor** | `../007-gpt-behavioral-hardening-research/` (research.md §2-4) |
| **Successor** | `../009-orchestrate-universal-routing/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two independent, confirmed-by-code-trace defects, both cross-validated across research/research.md's 6 lineages:

1. **Mode D (self-classification gate misread as hard block).** All 7 `/deep:*` command files (`skill-benchmark.md`, `context.md`, `review.md`, `ai-council.md`, `research.md`, `agent-improvement.md`, `model-benchmark.md` under `.opencode/commands/deep/`) open with an identical "PHASE 0: @GENERAL AGENT VERIFICATION" block: advisory prose asking the model to self-classify as "@general agent," with a hard block on "NO or UNCERTAIN." Phase 005's own research-mode smoke already fired this exact mechanism (`STATUS=FAIL ERROR="General agent required"`) — GPT read the advisory self-check as a mandatory gate it had to resolve before proceeding, and halted. This is a distinct root cause from mis-routing or latency, and FIX-5 (hard identity) would not fix it — hard identity prevents wrong-agent dispatch; it does nothing about a model halting on a step it misreads as a gate.
2. **ai-council route-proof identity mismatch.** `orchestrate-topic.cjs:310-313` (the record emitter) and `deep_ai-council_auto.yaml:132-136` (the validator's `route_proof` block) agree with each other on `mode: council` / `target_agent: deep-ai-council` — so route-proof validation currently **passes**. But both agreeing values are wrong relative to `mode-registry.json`'s `ai-council` entry (`workflowMode: "ai-council"`, `agent: "ai-council"`) and the council's own emitted header. `target_agent: deep-ai-council` names the packet, not an agent — no agent by that name exists. Route-proof currently certifies an artifact naming a non-existent agent as valid: a false negative of the exact class phase 002's route-proof mechanism was built to catch, one layer removed (validator and record agree with each other, both disagree with the actual source of truth).

### Purpose

Land both fixes together as the lowest-risk, first-landed phase from research/research.md §4 item 1: remove the Mode-D advisory-gate misread across all 7 command files, and reconcile the ai-council identity so route-proof validates against the registry instead of a self-consistent-but-wrong pair of values.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Replace the "PHASE 0: @GENERAL AGENT VERIFICATION" self-classification block in all 7 `/deep:*` command files with a deterministic dispatch-context check (was this file invoked directly by the user, or handed off via Task delegation from another agent?) that does not ask the model to self-classify from prose.
- Edit `orchestrate-topic.cjs:310-313` (`mode: 'council'` → `mode: 'ai-council'`, `target_agent: 'deep-ai-council'` → `target_agent: 'ai-council'`, `resolved_route` string updated to match).
- Edit `deep_ai-council_auto.yaml:132-136` (`route_proof.mode: council` → `ai-council`, `route_proof.target_agent: deep-ai-council` → `ai-council`, `resolved_route` string updated to match) in the **same change** as the `.cjs` edit — landing one side alone converts a currently-passing-but-wrong state into a real, blocking FAIL.
- Re-run the ai-council round-completion smoke (or equivalent existing test) to confirm route-proof still passes post-fix, now validating against the registry-correct identity.

### Out of Scope

- Orchestrate's own Priority-table/Deep-Route registry-delegation hardening — `../009-orchestrate-universal-routing/`.
- The `tool.execute.before` enforcement plugin — `../011-deep-route-guard-plugin/`.
- The GPT-vs-Claude benchmark — `../012-gpt-claude-benchmark/`.
- Any change to `ai-council`'s `mode: all` reachability — this phase does not touch that field; the subagent-only conversion (an explicit operator decision, not a research recommendation) is scoped separately in `../010-ai-council-subagent-only/`.
- Codex mirror parity (pre-existing, out-of-band per phase 003's scope note).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/commands/deep/skill-benchmark.md` | Modify | Replace Phase-0 self-check block |
| `.opencode/commands/deep/context.md` | Modify | Replace Phase-0 self-check block |
| `.opencode/commands/deep/review.md` | Modify | Replace Phase-0 self-check block |
| `.opencode/commands/deep/ai-council.md` | Modify | Replace Phase-0 self-check block |
| `.opencode/commands/deep/research.md` | Modify | Replace Phase-0 self-check block |
| `.opencode/commands/deep/agent-improvement.md` | Modify | Replace Phase-0 self-check block |
| `.opencode/commands/deep/model-benchmark.md` | Modify | Replace Phase-0 self-check block |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:310-313` | Modify | `mode`/`target_agent`/`resolved_route` → registry-aligned |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:132-136` | Modify | `route_proof.mode`/`target_agent`/`resolved_route` → registry-aligned |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Mode-D gate replaced, not just reworded | All 7 command files' Phase-0 block resolves from dispatch context (direct invocation vs. Task delegation), not from model self-classification prose; no wording remains that a model could read as "ask yourself if you are @general and halt if unsure." |
| REQ-002 | ai-council identity is registry-aligned | `orchestrate-topic.cjs` and `deep_ai-council_auto.yaml` both use `mode: ai-council` / `target_agent: ai-council`, matching `mode-registry.json`'s `ai-council` entry (`workflowMode`, `agent`). |
| REQ-003 | Both ai-council files land together | No intermediate commit/state exists where only one of the two files has changed (would create a real route-proof FAIL). |
| REQ-004 | No regression to the other 3 deep modes | `context`/`research`/`review` command files' Phase-0 replacement follows the identical deterministic pattern; their own route-proof records are untouched by this phase (they don't share the ai-council mismatch). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 command files pass a grep-based check confirming zero remaining instances of self-classification prose ("SELF-CHECK: Are you operating as the @general agent?" or equivalent).
- **SC-002**: `orchestrate-topic.cjs` and `deep_ai-council_auto.yaml` both reference `ai-council` (not `council`/`deep-ai-council`) for `mode`/`target_agent`, verified by direct grep of both files.
- **SC-003**: An ai-council round-completion smoke (existing test harness or a minimal repro) shows route-proof still passes post-fix.
- **SC-004**: `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Landing only one of the two ai-council files | Converts a passing-but-wrong state into a blocking FAIL | Single commit/change touching both files; verify via grep before considering the task done |
| Risk | "155 alignment" work in progress on ai-council-adjacent files (per opus-critical's iteration notes, research/research.md §5) may be live/uncommitted in the working tree | Merge conflict or silent overwrite of unrelated in-flight work | Check `git status`/`git diff` on both target files immediately before editing; if unrelated changes are present, scope this phase's edit to only the cited line ranges |
| Risk | Deterministic dispatch-context check needs a real, inspectable signal | If no such signal exists in the current runtime, the fix degrades back to prose | Confirm the concrete mechanism (Task-tool metadata, env var, explicit marker) during plan.md Phase 1 before writing the replacement block |
| Dependency | `mode-registry.json` `ai-council` entry as source of truth | Fix correctness | Already confirmed: `workflowMode: "ai-council"`, `agent: "ai-council"` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See frontmatter `open_questions`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The replacement dispatch-context check must not introduce a new failure mode where a legitimately-direct invocation is misread as delegated (or vice versa).
- **NFR-R02**: Route-proof validation must remain meaningful (i.e., still capable of failing on a genuine mismatch) after the ai-council identity fix — the fix must not weaken the validator into an always-pass check.

### Maintainability
- **NFR-M01**: The 7 command files' replacement block must stay textually identical across all 7 files so future edits don't need to be applied 7 separate times with drift risk.
- **NFR-M02**: `orchestrate-topic.cjs` and `deep_ai-council_auto.yaml` must reference `mode-registry.json`'s values directly in review/comments where practical, not fork them into independent prose.

### Compatibility
- **NFR-C01**: The other 3 deep modes' (`context`/`research`/`review`) existing route-proof records are untouched by this phase.
- **NFR-C02**: No change to `ai-council`'s `mode: all` direct-invocability — that is explicitly out of scope here (see `../010-ai-council-subagent-only/`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A command file invoked directly by the user vs. handed off via Task delegation must both resolve correctly under the new deterministic check — neither path should halt on a false gate.
- Round-completion records written before this fix lands (historical JSONL state) are not retroactively rewritten; only new records reflect `ai-council`.

### Error Scenarios
- If only one of `orchestrate-topic.cjs` / `deep_ai-council_auto.yaml` is edited (partial land), route-proof validation begins failing — this is the explicit anti-pattern REQ-003 guards against.
- If a 9th command file is later added under `.opencode/commands/deep/` without the fixed dispatch-context check, it silently reintroduces Mode D for that one file — worth a follow-up lint/consistency check, not in this phase's scope.

### State Transitions
- Phase 009 (orchestrate hardening) and phase 011 (enforcement plugin) both assume this phase's ai-council identity fix has landed before their own ai-council-touching work is meaningful.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 8 near-identical text replacements + 2 coordinated small edits |
| Risk | 10/25 | Low blast radius; both ai-council edits must land together to avoid a transient FAIL |
| Research | 18/20 | Both fixes are directly cited with file:line evidence from 6 cross-validated research lineages |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Research**: `../007-gpt-behavioral-hardening-research/research/research.md` §2 (ai-council finding), §3 (KQ table), §4 item 1
- **Parent Spec**: `../spec.md`
