---
title: "Goal: spec-kit simplification research"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research"
    last_updated_at: "2026-09-06T16:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: spec-kit simplification research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run five ten-iteration research lanes over system-spec-kit (retrieval, CLI runtime, shared package, templates and acceptance criteria, overengineering), reproduce every kept finding in-session, then remediate everything confirmed in sibling children, with no deferrals.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Executor for every lane: GLM 5.3 Flash max through DevPass on cli-pi (llmgateway/glm-5.3-flash), launched through the system-deep-loop fan-out runner, never a hand-rolled loop |
| D2 | Lanes run sequentially in worktree 046 so the containment guard cannot cross lanes; a lane silent for fifteen minutes is killed and resumed |
| D3 | Every charter is improved through sk-prompt before launch |
| D4 | Each research finding is a hypothesis until reproduced here; unreproducible findings are dropped with a note |
| D5 | Remediation children are created after synthesis, named for what they fix, and nothing is deferred |
| D6 | Gates before every commit: shared, runtime and CLI typecheck and build, named vitest files, npm run check in the CLI, validate.sh --strict on touched packets, residue sweeps; commit by pathspec; push v4 and main after each green commit |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-ripgrep-search-system | `001-ripgrep-search-system/goal.md` |
| 002-cli-runtime-utilization | `002-cli-runtime-utilization/goal.md` |
| 003-shared-package-utilization | `003-shared-package-utilization/goal.md` |
| 004-template-system-and-acceptance-criteria | `004-template-system-and-acceptance-criteria/goal.md` |
| 005-overengineering-simplification | `005-overengineering-simplification/goal.md` |
| 006-retrieval-drift-remediation | `006-retrieval-drift-remediation/goal.md` |
| 007-cli-package-residue-removal | `007-cli-package-residue-removal/goal.md` |

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] All five research children are Complete with ten iterations each and a confirmed-findings.md
- [ ] Every confirmed finding has a remediation child that is Complete, or a recorded decision not to change with its reason
- [ ] validate.sh --strict --recursive prints RESULT: PASSED for this parent and every child
- [ ] The trigger index regenerates identically with zero malformed documents
- [ ] The parent goal.md was resent in chat after every change to its durable slice
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
| Lane 001 ran, reproduced, remediated | Done | `001-ripgrep-search-system/research/confirmed-findings.md`; child `006-retrieval-drift-remediation` complete |
| Lane 002 ran, censused, remediated | Done | `002-cli-runtime-utilization/research/confirmed-findings.md`; child `007-cli-package-residue-removal` complete, commit `3f161d2ee9` on both branches |
| Lane 003 | Running | started 19:48 in worktree 046 |

### Deviations and findings

| Item | Note |
|------|------|
| Child 006 appended to the binding | The binding table gained a row; durable slice changed, parent resent in chat. |
| Child 007 appended to the binding | Durable slice changed again; parent resent in chat. |
| Resource-map extractor wiring carried to lane 004 | Lane 002 found the deep commands never name `resource-map/extract-from-evidence.cjs`; lane 004 owns the resource-map addon, so the wiring decision lands with its remediation. |
| Shared index hazard | Another session staged and amended in this checkout mid-commit; the 007 commit was rebuilt through a private index and the branch advanced with a compare-and-swap. |
<!-- /ANCHOR:log -->
