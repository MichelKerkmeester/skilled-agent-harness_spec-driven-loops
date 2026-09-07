---
title: "Goal: CLI runtime utilization"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/002-cli-runtime-utilization"
    last_updated_at: "2026-09-06T18:50:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed every criterion after remediation"
    next_safe_action: "None; the lane is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: CLI runtime utilization

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Establish what every directory of the @spec-kit/cli package is for, who actually calls it, what is dead or test-only, and what should be removed or merged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research is read-only; remediation lands in a sibling child created after synthesis |
| D2 | A directory counts as live only with a caller outside the package or a registered entry point |
| D3 | Naming is judged against observed callers, not the README |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] 10 iteration files and 10 state events exist under research/lineages/glm-5-3-flash-cli-runtime/
- [x] Round two: 10 iteration files and 10 state events exist under research/lineages/deepseek-v4-flash-cli-runtime/ and every P1 row is censused in confirmed-findings.md
- [x] Round three: 5 iteration files and a synthesis exist under research/lineages/deepseek-v4-flash-cli-runtime-r3/ and every row is censused in confirmed-findings.md
- [x] research.md carries a per-directory table: purpose, callers, verdict
- [x] Every P0 and P1 finding reproduces in-session
- [x] A ranked removal and merge list with the evidence that nothing documented depends on each item
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet opened | Done | this file |
| Lane ran 10/10, synthesis written | Done | `research/lineages/glm-5-3-flash-cli-runtime/research.md`, stop reason maxIterationsReached, 17:17 to 19:44, first executor attempt hung and was retried by the runner |
| Reproduction | Done | `research/confirmed-findings.md`: 12 of 13 removal rows confirmed or corrected, 9 of 11 merge rows, 12 of 13 fix rows; 3 dropped |
| Remediation | Done | `../007-cli-package-residue-removal` closed every row |
| Round two ran 10/10 on DevPass DeepSeek, synthesis written | Done | `research/lineages/deepseek-v4-flash-cli-runtime/research.md`, 07:31 to 07:54 |
| Round two census and remediation | Done | `research/confirmed-findings.md` §6; `../014-cli-decommission-orphan-removal` |
| Round three ran 5/5 on DevPass DeepSeek, synthesis written | Done | `research/lineages/deepseek-v4-flash-cli-runtime-r3/research.md`, 14:31 to 15:07 |
| Round three census and remediation | Done | `research/confirmed-findings.md` §7; `../019-ci-push-gates-and-runtime-doc-truth` |

### Deviations and findings

| Item | Note |
|------|------|
| Three rows dropped | The trigger-extractor shim has two importers; js-yaml has three production importers; the worktree symlink layout is an environment fact. |
| Two findings the lane missed | A test that could not run and a test that reads another session's packet; both recorded in the confirmed table. |
<!-- /ANCHOR:log -->
