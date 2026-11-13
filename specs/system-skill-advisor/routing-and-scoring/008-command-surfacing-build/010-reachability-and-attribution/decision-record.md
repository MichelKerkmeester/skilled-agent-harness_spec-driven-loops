---
title: "Decision Record: Phase 10: reachability-and-attribution"
description: "One autonomous decision: the Codex smoke run and the Codex brief decoding leave this phase for the packet's operator list, because approving Codex hooks writes the operator's own Codex config."
trigger_phrases:
  - "reachability and attribution decision record"
  - "codex hook approval operator list"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution"
    last_updated_at: "2026-11-13T04:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded ADR-001 on moving T031 and T032 to the operator list"
    next_safe_action: "Operator approves the Codex hooks for one arena, then run one Codex smoke row"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-reachability-and-attribution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 10: reachability-and-attribution

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Move the Codex smoke run and brief decoding to the operator list

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The orchestrator, autonomously under the packet goal's rule D1. This is not an operator decision |

---

<!-- ANCHOR:adr-001-context -->
### Context

T031 asks the operator to approve the project hooks in one Codex arena, then runs one Codex row and checks that its rollout holds `Advisor: `. T032 waits on that rollout to teach `briefDelivered` how to read a Codex brief. Codex got no brief in any of the 24 before runs or any of the 24 after runs, because a fresh clone's project hooks are unapproved. Approving them for a checkout writes a `trusted_hash` into the operator's `~/.codex/config.toml`.

The packet goal's rule D1 reads: "Run autonomously and ask the operator nothing. Take the recommended option and record it". So the phase could not stop to ask for the approval.

### Constraints

- `spec.md` section 3 puts any write to a home-folder config, `~/.codex/config.toml` included, out of scope.
- Rule D1 forbids asking the operator during the run.
- The approval is the operator's own security decision about which checkouts may run hooks in their Codex.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to mark T031 and T032 `[B]` in this phase and put them on the packet's operator list as "approve the Codex hooks for an arena path, then run one Codex smoke row".

**How it works**: The phase closes on the evidence that needs no approval. All 144 after-arm lines, the 24 Codex lines among them, carry the three run-line fields, which stands in for the T031 smoke line in AC-001. The Codex check printed `WARN codex-hooks-unapproved` on an unapproved arena and `PASS codex-hooks-approved` on the main checkout the operator approved earlier, with the config digest unchanged before and after. AC-008 asks for both states on one checkout, so it is `Superseded` by this record.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move T031 and T032 to the operator list and close the phase** | The phase closes on evidence that needs no approval, and the operator keeps the approval | The same-checkout before and after pair and the Codex brief decoding stay undone | 8/10 |
| Keep the phase open until the operator approves | AC-008 could be met as written | Rule D1 forbids asking, so the phase would wait with no end in sight and block the packet | 3/10 |
| Write the `trusted_hash` approval into `~/.codex/config.toml` ourselves | T031 could run now | That file is the operator's, the spec puts home-folder writes out of scope and it would take a security decision on their behalf | 1/10 |

**Why this one**: It is the only option that both respects the operator's ownership of their Codex config and lets the phase close under D1.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The phase closes with 13 of 14 criteria `Met` and no write outside the repository.

**What it costs**:
- Codex `briefDelivered` stays `"unknown"` and no Codex rollout has been shown to carry a brief. Mitigation: the operator item below.
- AC-008 is met on two checkouts rather than one. Mitigation: the reversal step reruns the check on one arena before and after approval.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator item is forgotten and Codex stays without a brief | M | The packet goal lists it as waiting on the operator |
| A Codex rollout stores the brief in a shape `briefDelivered` cannot read | L | T032 builds the decoder from the real rollout shape, or is dropped when the rollout holds no brief |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | T031 cannot run without an approval only the operator may give |
| 2 | **Beyond Local Maxima?** | PASS | Waiting and writing the approval ourselves were both weighed and rejected |
| 3 | **Sufficient?** | PASS | Two task marks and one operator item, no code change |
| 4 | **Fits Goal?** | PASS | Rule D1 asks for the recommended option, recorded |
| 5 | **Open Horizons?** | PASS | The reversal below restores both tasks unchanged |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `tasks.md`: T031 and T032 are `[B]` with a note naming this record.
- `acceptance-criteria.md`: AC-008 is `Superseded` with ADR-001 in its Waiver cell.

**How to roll back**: The operator opens `/hooks` in a Codex session in one arena at this phase's commit and approves each entry. Then run `codex-hook-approval-check.cjs --root <arena>` before and after that approval, run one row through the runner with `--runtime codex --arm smoke` and check its rollout for `Advisor: `. If the rollout holds the brief, build T032 from its shape. If it does not, mark T032 dropped. Then set AC-008 back to its measured status.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set. This phase recorded no operator answers.
<!-- /ANCHOR:operator-answers-verbatim -->

---
