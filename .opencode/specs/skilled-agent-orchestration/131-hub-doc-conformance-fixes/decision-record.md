---
title: "Decision Record: Hub Doc Conformance Fixes [131-hub-doc-conformance-fixes]"
description: "Three ADRs: the mandatory verify-first re-validation protocol, the file-path work-stream partition with its collision-verified cross-cutting carve-out, and the doc-layer/routing-layer scope boundary."
trigger_phrases:
  - "decision"
  - "record"
  - "hub doc conformance fixes"
  - "verify-first protocol decision"
  - "work-stream partition decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-hub-doc-conformance-fixes"
    last_updated_at: "2026-07-10T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the three planning ADRs"
    next_safe_action: "Operator reviews ADRs before dispatch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "131-hub-doc-conformance-fixes-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Hub Doc Conformance Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Mandatory verify-first re-validation protocol

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-10 |
| **Deciders** | Operator (via task brief), claude (planning agent) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The review found 67 P0 findings, most of them reality-drift: docs describing CLI flags, MCP tools, and behaviors that no longer match the live system. The review's own evidence was gathered by running live probes at review time (`cupt --help`, `figma-ds-cli --help`, `bdg --help`, Code Mode `tool_info()`). If a fix agent trusts that evidence as still-current without re-checking, it risks writing a SECOND wrong answer -- either because the tool drifted again between the review and the fix, or because the fix agent copies the review's prose without confirming it against the file it is actually about to edit.

### Constraints
- The operator's task brief requires "verify-first": every fix agent must verify each claim against the live CLI/MCP before editing, fix or remove stale claims, never guess.
- Some live probes may be unreachable at fix time (binary not installed, MCP provider down, network required) -- the protocol must have a defined failure path, not silently skip or fabricate.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: every reality-drift finding is re-probed against live CLI/MCP truth immediately before its fix is written, using a 5-step protocol (probe, confirm-or-diverge, halt-if-unreachable, never-silently-delete).

**How it works**: a fix agent runs the exact command or discovery call the review cited, compares the live result to the review's claim, and only then writes the fix -- using the review's "Exact fix" when confirmed, or the newly observed live truth when the tool drifted again. An unreachable probe halts that one finding as `BLOCKED` in `tasks.md` rather than blocking the whole work-stream.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Verify-first (chosen)** | Catches both review-cited drift and any NEW drift since the review ran; matches the operator's explicit brief | Slower per finding; requires live tooling reachable at fix time | 9/10 |
| Trust the review's quoted evidence directly | Fastest, no live-tool dependency | Silently ships a second wrong answer if the tool drifted again between review and fix; explicitly rejected by the operator's brief | 3/10 |
| Verify only a sample of findings | Faster than full verify-first | No way to know which findings in the unverified sample are also stale; contradicts "fix ALL, verify-first" | 4/10 |

**Why this one**: the operator's brief is explicit ("every fix agent MUST verify each claim against the live CLI/MCP... BEFORE editing"), and the review's own iteration narratives already demonstrate live drift happening between adjacent iterations (e.g., the ClickUp MCP transport claim shifted between iteration 9's finding and iteration 10's re-check of the same class of claim) -- sampling or trusting cached evidence would reproduce the exact failure mode the review exists to catch.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Fixes are grounded in the tool's actual current behavior at fix time, not a snapshot that may already be stale.
- A `BLOCKED` disposition gives the operator a precise, per-finding list of what could not be verified, instead of a silent gap.

**What it costs**:
- Every reality-drift fix takes one extra live-probe round trip. Mitigation: the protocol is scoped to reality-drift findings only; dead-link, verdict-vocabulary, and shell-syntax findings (the WS-D theme) do not require a live CLI/MCP probe.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Live tooling is unreachable for an entire work-stream (e.g., ClickUp MCP provider down) | M | Halt only the affected findings, not the whole stream; the rest of the stream's findings proceed. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's brief explicitly requires it; the review's own narratives show drift recurring between adjacent iterations. |
| 2 | **Beyond Local Maxima?** | PASS | Trust-cached-evidence and sample-verification alternatives were both considered and rejected with stated reasons. |
| 3 | **Sufficient?** | PASS | 5 steps cover the confirm, diverge, halt, and never-silently-delete cases; no additional step was needed. |
| 4 | **Fits Goal?** | PASS | Directly serves the plan's success criteria (`spec.md` SC-001, REQ-002). |
| 5 | **Open Horizons?** | PASS | The protocol generalizes to any future reality-drift remediation, not just this packet's 67 findings. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `plan.md` section 2 (Quality Gates -> Definition of Ready) states the 5-step protocol.
- `tasks.md`'s notation header binds every task to the protocol; `[B]` marks a `BLOCKED` finding.

**How to roll back**: if the protocol proves too slow in practice, the operator can approve a narrower scope (e.g., verify-first only for P0 findings, trust-cited-evidence for P1/P2) by amending `plan.md` section 2 -- no other document depends on the protocol's exact step count.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: File-path work-stream partition with a collision-verified cross-cutting carve-out

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-10 |
| **Deciders** | Operator (via task brief), claude (planning agent) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The operator's brief proposed 4 work-streams (WS-A ClickUp, WS-B cli-opencode/cli-claude-code, WS-C Figma/Chrome DevTools, WS-D cross-cutting root playbooks) and invited refinement "if the findings suggest better." A first pass assigning WS-D purely by theme (every dead-link, verdict-vocabulary, coverage-count, and test-oracle finding, regardless of file) produced real file collisions: `R3-P0-004`'s dead-link fix and `R3-P0-002`/`R3-P0-003`/`R3-P0-009`'s reality-drift fixes land on the same cli-claude-code/cli-opencode scenario files (confirmed by cross-referencing every WS-D-candidate finding's affected-file list against WS-A/B/C's finding files). Two work-streams editing the same file is the exact coordination failure this plan exists to prevent.

### Constraints
- Every file must have exactly one owning work-stream, or two agents could clobber each other's edits.
- The partition must still honor the operator's 4-work-stream framing and the "root playbooks" cross-cutting intent, not silently collapse WS-D into WS-B/C.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: file-path ownership as the primary rule (WS-A owns `mcp-click-up/**`, WS-B owns `cli-opencode/**` + `cli-claude-code/**`, WS-C owns `mcp-figma/**` + `mcp-chrome-devtools/**`), with WS-D narrowed to exactly the 7 files verified collision-free against every other stream's finding list (4 hub root playbooks + 3 solo test-oracle files). The 5 originally-WS-D-candidate findings that collided with a WS-B file (`R3-P0-004`, `R3-P0-005`, `R3-P0-010`, `R4-P0-006`, `R4-P0-007`) were merged into WS-B instead.

**How it works**: `plan.md` section 3's "Collision Check" documents, for every candidate cross-cutting finding, whether its file(s) also carry a WS-A/B/C finding. Collision-free files stay WS-D (for the pattern-consistency benefit of one agent applying the same verdict-vocabulary/coverage-count fix across all 4 root playbooks); colliding files move to whichever stream already owns them, bundled into that stream's existing per-file edit.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **File-path ownership + verified carve-out (chosen)** | Zero file collisions by construction; still delivers the pattern-consistency benefit where it is actually collision-free | Required an explicit per-finding collision check during planning (one-time cost) | 9/10 |
| Pure theme-based WS-D (every dead-link/test-oracle/verdict finding, regardless of file) | Matches the operator's literal theme list exactly | 5 real file collisions with WS-B, requiring either sequencing or re-reads mid-stream | 4/10 |
| Collapse WS-D entirely into WS-A/B/C (no 4th stream) | Zero collision risk by construction | Loses the cross-hub pattern-consistency benefit for verdict-vocabulary and coverage-count, and drops the operator's explicit 4-stream framing | 5/10 |

**Why this one**: it keeps the operator's 4-stream shape and its cross-cutting intent exactly where that intent does not conflict with file-safety, and defers to file-safety exactly where it does -- a smaller, well-justified deviation from the literal proposal rather than a wholesale rejection of it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- `spec.md` SC-002 (no file collision across work-streams) is true by construction, not by hope.
- WS-D still delivers one consistent verdict-vocabulary and coverage-count fix pattern across all 4 hub root playbooks.

**What it costs**:
- WS-B grew from the operator's implied ~15-finding scope to 20 P0 findings (5 merged in). Mitigation: `plan.md`'s effort table flags WS-B as "Medium-High" complexity to set dispatch expectations accordingly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future re-verification finds a new file collision this planning pass missed | M | `tasks.md` task T041 explicitly calls out its file-sharing with T039/T040/T045/T046/T052 so a fix agent bundles rather than duplicates the edit. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A pure theme-based WS-D produced 5 confirmed file collisions with WS-B during planning. |
| 2 | **Beyond Local Maxima?** | PASS | Pure-theme and WS-D-elimination alternatives were both evaluated and scored lower. |
| 3 | **Sufficient?** | PASS | Every one of the 73 findings resolves to exactly one stream; no unresolved case remains. |
| 4 | **Fits Goal?** | PASS | Directly serves `spec.md` REQ-001 and SC-002. |
| 5 | **Open Horizons?** | PASS | The collision-check method (cross-reference every candidate finding's files against every other stream) generalizes to any future multi-stream doc remediation. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `plan.md` section 3 documents the collision check and its two outcome classes.
- `tasks.md` groups all 73 findings under WS-A/B/C/D headings per this partition, with explicit "bundle with T0XX" notes on merged findings.

**How to roll back**: if a fix agent finds an undetected collision at dispatch time, the operator resolves it by amending the owning stream's `tasks.md` entry to bundle the two findings, following the same pattern already used for `R3-P0-004`/`R4-P0-006`/`R4-P0-007` -- no restructuring of the other 3 streams is required.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Doc-layer-only scope boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-10 |
| **Deciders** | Operator (via task brief) |

---

<!-- ANCHOR:adr-003-context -->
### Context

The operator's brief states a separate agent already owns the routing layer (`INTENT_SIGNALS`/`RESOURCE_MAP`/mode-registry) for these same hubs, and that fix agents dispatched from this plan must edit only pure doc files plus the PROSE sections of `SKILL.md`, skipping any routing block. Without an explicit, checked boundary, a fix agent editing `SKILL.md` for a reality-drift finding (for example `R1-P0-007`, the ClickUp Code Mode invocation example) could accidentally touch a routing block a few lines away, colliding with the routing-layer agent's own work.

### Constraints
- The boundary must be checkable, not just stated: every P0 finding this plan schedules must be confirmed NOT to require editing a routing block.
- The boundary must not silently drop a finding that genuinely needs a routing-layer change -- such a finding must be named and deferred, not force-fit into a prose edit that does not actually fix it.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: every `SKILL.md` a work-stream touches is grepped for `INTENT_SIGNALS`/`RESOURCE_MAP`/routing-block markers before that stream starts (`tasks.md` T003); fix agents edit only prose sections and are instructed to SKIP any routing block they encounter, deferring it rather than editing it.

**How it works**: during planning, every one of the 67 P0 findings was checked against this boundary. The only `SKILL.md`-touching P0 finding is `R1-P0-007` (ClickUp Code Mode invocation example, `SKILL.md:279`), and its fix target is a worked-example line in a prose/usage section, not a routing block -- confirmed in scope. No P0 finding requires editing `INTENT_SIGNALS`, `RESOURCE_MAP`, or `mode-registry.json`/`hub-router.json`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Doc-layer-only boundary, checked per finding (chosen)** | No collision with the routing-layer agent's work; every exclusion is verified, not assumed | Requires a manual per-finding scope check during planning | 9/10 |
| Fix every finding regardless of which block it touches | Simpler instruction | Directly collides with a concurrently active routing-layer agent editing the same files | 2/10 |
| Skip all `SKILL.md` edits entirely, even prose | Zero collision risk | Leaves `R1-P0-007` (a confirmed P0 reality-drift finding) unfixed for no reason -- it is not a routing-layer concern | 4/10 |

**Why this one**: it fixes everything this plan is actually responsible for while staying provably disjoint from the routing-layer agent's scope, rather than either over-including (risking collision) or over-excluding (leaving a confirmed, in-scope P0 finding unfixed).
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- `spec.md` REQ-003 (routing-layer exclusion) is satisfied by a checked fact (zero P0 findings require a routing-layer edit), not an assumption.
- The routing-layer agent's work and this plan's work can proceed concurrently without a merge collision on shared `SKILL.md` files.

**What it costs**:
- If a future finding DOES require a routing-layer change, it cannot be closed by this plan's work-streams alone. Mitigation: `tasks.md` T003 requires listing any such block explicitly as out of scope before a stream starts, so the gap is visible, not silent.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The routing-layer agent's edits land between this plan's dispatch and its fix agents' actual edits, shifting line numbers inside a shared `SKILL.md` | M | Fix agents re-locate by content match (`spec.md` Edge Cases), not blind line-number replace; `plan.md` names the merge-order coordination expectation. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's brief explicitly names a separate, already-active routing-layer agent on the same hubs. |
| 2 | **Beyond Local Maxima?** | PASS | Fix-everything and skip-everything alternatives were both considered and rejected with stated reasons. |
| 3 | **Sufficient?** | PASS | Every P0 finding was individually checked against the boundary; only one (`R1-P0-007`) touches `SKILL.md`, and it is confirmed in-scope. |
| 4 | **Fits Goal?** | PASS | Directly serves `spec.md` REQ-003 and the operator's explicit coordination requirement. |
| 5 | **Open Horizons?** | PASS | The grep-and-list boundary check (`tasks.md` T003) generalizes to any future doc-layer/routing-layer coordination. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `plan.md` section 4's "Coordination boundary" callout states the rule before Phase 1.
- `tasks.md` T003 is the checked pre-flight gate; every work-stream's tasks that touch a `SKILL.md` (T004, T033-T036) are scoped to prose/example sections.

**How to roll back**: if the routing-layer pass completes before this plan's fix agents dispatch, the operator can re-check T003 (no live routing-layer edits left to collide with) and proceed unchanged -- the boundary check costs nothing to re-run.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
