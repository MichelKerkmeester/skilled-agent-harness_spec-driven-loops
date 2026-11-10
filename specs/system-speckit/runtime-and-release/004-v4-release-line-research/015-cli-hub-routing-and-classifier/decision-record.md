---
title: "Decision Record: Phase 15: cli-hub-routing-and-classifier"
description: "Decisions taken without an operator while fixing the CLI hub routing, the Pi transport and the two advisor misses: the OpenCode Go mode choice, the reviewer fallback after the GPT quota ran out, the generators run, and every worker and review call."
trigger_phrases:
  - "cli hub routing and classifier decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/015-cli-hub-routing-and-classifier"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with every worker, review and adjudication recorded"
    next_safe_action: "Ask the lead before phase 017"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 15: cli-hub-routing-and-classifier

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep "opencode go route" on DeepSeek Harness inside the hub; fix only the advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation Orchestrator A (operator unavailable; goal G3 and G7 pre-authorize the call) |

---

<!-- ANCHOR:adr-001-context -->
### Context

V20 reported two misroutes for "opencode go route this task": the advisor picked sk-code, and compiled routing picked `cli-deepseek-harness`. The second is a documented design: OpenCode Go is one of the two DeepSeek Harness routes (`cli-deepseek-harness/SKILL.md` section 3), the hub puts the phrase in the DeepSeek Harness classes, the router's subsumed-word rule names this case, and `compiled-route-subsumed-alias.test.cjs` asserts it. The "unjoined copies" half did not hold: the registry compiler validates mode-registry aliases as a subset of the hub vocabulary, so the two files are joined.

### Constraints

- OpenCode Go also serves `cli-opencode` and `cli-pi` through `opencode-go/<model>` ids, so the phrase is ambiguous at the provider level.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: route the prompt to the `cli-external-orchestration` hub in the advisor, and leave the hub's mode choice as designed.

**How it works**: an `opencode go` phrase in the advisor's explicit lane points at the hub, and the bare `opencode` token no longer boosts sk-code; sk-code keeps its OpenCode authoring phrases.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisor fix only** | The prompt reaches the hub that owns provider routes; no designed behavior changes | The mode inside the hub stays DeepSeek Harness | 8/10 |
| Also move the phrase to `cli-opencode` | One reading of "OpenCode Go" | Reverses a documented design and a passing test without an operator | 3/10 |

**Why this one**: the advisor miss is a defect; the mode choice is a product decision.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- OpenCode Go prompts reach the CLI hub instead of the code-authoring skill.

**What it costs**:
- An operator who means the OpenCode CLI must name `cli-opencode` or `opencode run`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A prompt that relied on the bare token for sk-code drops | L | Advisor suite and the four opencode holdout prompts still pass |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V20 is a verified P1 |
| 2 | **Beyond Local Maxima?** | PASS | Moving the hub phrase was weighed |
| 3 | **Sufficient?** | PASS | Live advisor ranks the hub first |
| 4 | **Fits Goal?** | PASS | Goal G3 fixes verified findings |
| 5 | **Open Horizons?** | PASS | The hub phrase can move later without touching the advisor |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lanes/explicit.ts` and a scorer test.

**How to roll back**: revert the phase commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:run-decisions -->
## Run Decisions Log

| ID | Decision | Why | Evidence |
|----|----------|-----|----------|
| D-01 | Take V50 and the advisor half of V20 into this phase | The lead extended this phase to `system-skill-advisor/**` and the doctor routing metadata | lead message extending the area for this phase |
| D-02 | Fall back from cli-codex to cli-pi `opencode-go/deepseek-v4.1-flash` max for every worker | The first codex dispatch failed: "You've hit your usage limit ... try again at Nov 13th, 2026 8:28 AM"; the brief says to fall back to DeepSeek and log it | `codex exit 1` with the usage-limit line |
| D-03 | The DeepSeek review ran on the same family in a fresh context, as a second lens beside D-09 | GLM 5.3, Kimi K3, Claude Haiku 5.5 and DeepSeek V4 Pro through pi all returned `403 Model access is disabled`; GPT through opencode-go is barred by the operator's rule that GPT runs only on the GPT provider | four `permission_error` lines |
| D-04 | Run the documented generators as the orchestrator: `derive-command-bridges.cjs`, the advisor `npm run build`, and `compiled-route-manifest.cjs refresh --hub cli-classifier` plus the copy the guard names into the archived router program packet | Workers may not run generators; the lead allowed the documented generators inside the worktree; the guard printed the exact re-mint steps | bridges `generated`, build exit 0, guard "All hubs fresh or excused" |
| D-05 | Review adjudication (verdict CONDITIONAL, 1 P1 and 3 P2): the manifest P1 was already handled (the reviewer's diff omitted it); fixed the `..` release-name traversal with a test; accepted the benchmark pin and the gate breadth | The benchmark records the version it measured; a Pi that keeps the two method names but changes answer shape falls to the backend gate | reviewer report; transport test 49 of 49 after the fix |
| D-06 | Record, not fix: `trigger(ed)` and `fired` are not cues; the classifier benchmark keeps its 0.99.2 gate | Each is outside the verified findings | reviewer and worker reports |
| D-08 | The 16 `.skilled/bin/tests` failures at baseline are gone in the final run; not claimed as a fix | They passed after the cli-classifier manifest re-mint, and the baseline guard already reported a stale manifest, which is the likely cause; no test was changed | baseline 156 pass, 16 fail; final 172 pass, 0 fail, 1 skipped |
| D-09 | Cross-family review done by the orchestrator (Claude) reading the full product diff and rerunning every check, per the lead's instruction after the GPT quota ran out; verdict PASS, no new finding | Read `jev-transport.mjs` (managed resolution, release-name guard, version and surface gates), `hub-router.json`, `explicit.ts`, `doctor-helper-handoff.ts`, `projection.ts` and the doc rows; the `opencode go` phrase and the removed bare token are covered by a test that fails without them; live CLI confirms both prompts | final gate: advisor 1383 passed, typecheck exit 0, classifier 179, bin 172, sync, guard and bridge check fresh |
| D-07 | Plan step 5 inline fallback; skip the continuity writer; commit with the lead-approved remint bypass | Same constraints as phases 007 and 008 | phase 007 decision record |
<!-- /ANCHOR:run-decisions -->
