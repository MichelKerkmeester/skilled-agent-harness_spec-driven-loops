---
title: "Decision Record: Automatic operator decision capture"
description: "Design decision and operator answers for automatic capture, save-time rewriting and an auditable packet record."
trigger_phrases:
  - "decision capture design decision"
  - "operator decisions appendix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/001-decision-capture-build"
    last_updated_at: "2026-11-01T07:16:09Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-042-decision-capture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Automatic operator decision capture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Capture answers locally and rewrite them at save time

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-01 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The decision-record template holds ADRs, and it has no operator question or answer section. Operators still need an audit trail of why they selected a behavior. A hook can capture the exchange, but it does not have the session model's full reasoning.

### Constraints

- Capture must not make tracked writes during a conversation.
- The verbatim question, options and answer must stay in the same tracked file as the rewritten decision.
- The writer must preserve the packet's detected level when it creates decision-record.md.
- Claude PostToolUse answer visibility is UNKNOWN until T001. The transcript remains a backstop.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option A, capture locally and let the session model rewrite confirmed decisions during full-auto save.

**How it works**: A runtime-neutral hook appends eligible question events to a locked gitignored queue. A transcript sweep always recovers Claude answers that the hook missed and offers plain-chat pairs for the session model to confirm. At save time the model sends short decisions to a deterministic writer, which upserts two decision-record anchors by a stable question id.

The operator-decisions anchor stores decided, why, supersedes and carried by. The operator-answers-verbatim appendix stores the original question, options and answer under the same id. The writer uses the bound packet, sends cross-phase decisions to the phase parent and sends local decisions to the selected child. It adds an explicit level marker before creating a decision record when spec.md lacks one.

**Why this one**: The save model has the reasoning needed to state why and what a choice supersedes. The queue and transcript retain exact wording without writing tracked files mid-turn.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A. Capture to queue, rewrite at save** | Keeps exact input and uses session context for the rewrite. | A decision is not tracked until a full-auto save. | 9/10, chosen |
| **B. Rewrite inside the hook** | Writes a decision at once. | Lacks session reasoning, adds latency and credentials, and writes tracked files mid-turn. | 4/10, rejected |
| **C. Use save memory only** | Adds no hook adapter. | Compaction or relaunch can lose exact answers before save. | 3/10, rejected |

Scores are qualitative fit against the stated constraints, not measured results.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Operator answers gain a short decision summary and a verbatim audit trail.
- Repeated saves do not duplicate entries or alter the packet level.

**What it costs**:
- A packet has no tracked entry until a full-auto save runs. Mitigation: the Stop hook reports eligible unconsumed decisions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A runtime hides answers from its hook. | High | Probe it and use transcript recovery where available. |
| A target cannot be resolved to one packet. | Medium | Keep the queue item pending and report it. |
| A packet has no level marker. | High | Record the pre-write level as an explicit marker before creating the record. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The decision-record template has no operator Q/A section. |
| 2 | **Beyond Local Maxima?** | PASS | Options B and C were compared and rejected for stated reasons. |
| 3 | **Sufficient?** | PASS | Capture is local, while rewriting stays with the session model at save time. |
| 4 | **Fits Goal?** | PASS | The record and verbatim appendix stay in the bound packet's decision record. |
| 5 | **Open Horizons?** | PASS | Runtime adapters remain gated on confirmed answer delivery. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Capture core, Claude hook adapter and transcript sweep.
- Save payload, deterministic writer, template anchors, validation and tests.
- Runtime adapters for Codex, OpenCode, Pi and Devin only when their probes confirm answer delivery.

**How to roll back**: Disable the hook registration and save writer call. Revert the capture implementation. Preserve any existing decision entries and verbatim answers.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Refine the build plan against the code it touches

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-01 |
| **Deciders** | Build orchestrator, on the operator's instruction to re-level and refine the plan (Q005) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The operator asked for the packet to move to Level 3 and for the plan to be checked against the code and the overengineering rule before any build. Reading the named files showed four places where the plan asked for work that the code already does, cannot reach, or would duplicate.

### Constraints

- Every requirement and acceptance criterion stays in force. A refinement may change how a requirement is met, never whether.
- Shared surfaces keep their contracts: the runtime API exports, the validation orchestrator, the hook registry and the save payload.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: six refinements, each tied to an observed fact.

1. `spec-doc-structure.ts` is not changed. Its ADR sufficiency check only reads anchors whose id starts with `adr-` (`spec-doc-structure.ts:1244`), and a copy of this packet with its ADR removed and only the two operator anchors kept passed `SPEC_DOC_SUFFICIENCY`, `ANCHORS_VALID` and `TEMPLATE_SOURCE`. T015 becomes a check, not an edit.
2. The transcript sweep carries its own small JSONL reader. `claude-transcript.ts` reads token usage and assistant text only (`claude-transcript.ts:117-150`, `:292`) and never reads `toolUseResult` or user turns, and a hook-side `.mjs` would have to load its compiled build.
3. Target routing moves from the writer to `workflow.ts`. The existing child resolver, `resolveContinuityLeaf`, lives in the CLI layer (`generate-context.ts:783`), which the runtime library cannot import. The workflow resolves each entry's folder and the writer receives a resolved folder.
4. The writer reuses the validator's own level detection. `detectLevel` (`orchestrator.ts:191`) gains an `export`, and `api/index.ts` re-exports the writer, the same path the continuity writer already uses (`api/index.ts:118`). Both are additive.
5. The Claude PostToolUse adapter is built and tested, but its registration waits for the live T001 probe. A dispatched worker cannot answer an AskUserQuestion, so the main session runs the probe. When the registration lands it also needs a row in the `.skilled/hooks/README.md` kill-switch index and coverage matrix.
6. Queue consumption is recorded in a gitignored `consumed.jsonl` beside the queue. The tracked appendix carries each item's source key in an HTML comment, so a re-save on any machine maps the same key to the same Q id.

**How it works**: The changes alter where code lives and what is reused. No requirement is removed. The phase recommendation from `recommend-level.sh` (30 of 50 against a threshold of 25) was declined: the operator asked for a Level 3 standard packet, and the work is one feature with one frozen scope.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A. Refine against the code, keep every requirement** | Avoids two no-op edits and one duplicate parser, and reuses the existing resolver and level detection. | Adds two small export lines to shared modules. | 9/10, chosen |
| **B. Build the plan exactly as written** | No plan change to review. | Edits a validator that already behaves correctly and reimplements a resolver the writer cannot reach. | 4/10, rejected |
| **C. Split the work into phases** | Matches the phase score. | The operator asked for Level 3, and phasing adds parent docs for one feature. | 3/10, rejected |

Scores are qualitative fit against the stated constraints, not measured results.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Two planned edits that would have changed nothing are dropped, and one parser is not duplicated.
- The level guard and the routing use the same code the validator and the save already trust.

**What it costs**:
- Claude live capture is not registered until T001 runs. Mitigation: the transcript sweep runs at every save and recovers the same answers.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later change to `resolveContinuityLeaf` changes decision routing too. | Medium | The writer tests and the save test cover standard, parent and child routing. |
| The probe shows PostToolUse carries no answers. | Low | The adapter writes nothing in that case, and the sweep stays the source. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Each refinement answers an observed mismatch between the plan and the code. |
| 2 | **Beyond Local Maxima?** | PASS | Building as written and phasing were compared. |
| 3 | **Sufficient?** | PASS | Every REQ keeps a task and a test. |
| 4 | **Fits Goal?** | PASS | Capture, rewrite and record behave as ADR-001 describes. |
| 5 | **Open Horizons?** | PASS | Runtime adapters stay gated on probes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: plan.md, tasks.md and spec.md name the refined files. `orchestrator.ts` and `api/index.ts` gain one export each.

**How to roll back**: Revert the two export lines and restore the routing call in the writer. The packet docs revert with `git checkout` of this folder.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->


---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Store the exact operator question, options and answer in a tracked appendix beside its decision entry. | The record stays portable and auditable with its decision. | None | REQ-007, operator-answers-verbatim |
| Q002 | Filter process questions about Gate 3, folder and branch selection and commit or push permission. | Administrative choices do not belong in the product decision record. | None | REQ-003, capture filter |
| Q003 | Include plain chat questions when the session model confirms a matching operator reply at save time. | Chat questions have no tool event, and the transcript can retain the exchange. | None | REQ-002, transcript sweep |
| Q004 | Build this packet on the current branch, main, and leave it uncommitted until the main session asks. | Not stated. | None | plan.md rollback plan, tasks.md scope |
| Q005 | Run the build now, beside the Barter work, with DeepSeek v4.1 flash workers under a fresh Opus orchestrator that first moves the packet to Level 3 and refines the plan against the repo rules. | Not stated. | None | spec.md Level 3, ADR-002, scratch/runs/ |
| Q006 | Build transcript readers for OpenCode and Devin in this packet instead of waiving AC-009. | Not stated. | None | AC-009, REQ-009, bin/sweep-opencode.mjs, bin/sweep-devin.mjs |
| Q007 | Commit the build only after the live probe settles T001, and leave the commit to the main session. | Not stated. | None | tasks.md T001, plan.md rollback plan |
| Q008 | Keep the session-relaunch threshold nudge out of dispatched child sessions, the same guard the claim path already has, and ship it in the same push. | A Pi test worker saved into the real packet because the nudge fired inside a child worker. | None | commit 5ce5feb336, session-relaunch/lib/nudge.cjs |

<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01S9EcfgV7RoarGT5294G5sK:0 -->

Question: Where should the verbatim answers live?
Options: Tracked appendix (rec.); Gitignored queue only
Answer: Tracked appendix (Recommended)

### Q002

Question: Record process questions (Gate 3, worktree vs branch, commit/push permission)?
Options: One-line class (rec.); Record in full; Filter out
Answer: Filter out

### Q003

Question: Capture plain chat questions too?
Options: Yes, confirmed at save (rec.); Tool questions only
Answer: Yes, confirmed at save (Recommended)

### Q004

Question: The 042 decision-capture build (Skilled specs/system-speckit/042-decision-capture) needs a git workspace choice before it can start. The repo rule says I must ask rather than pick. Where should it run?
Options: A) Create a git worktree; B) Work on current branch
Answer: B) Work on current branch

### Q005

Question: When should the 042 build run, and on what?
Options: Now, alongside Barter (Recommended); After Barter phase 010; Probe only for now
Answer: Alongside barter use deepseek v4.1 flash max 1017 llmgateway orchestrated by fresh opus who will first chsnge spec to kevel 3 and verfiy / refine plan as needed and checks repo rules regarding overengineering snd other relevant things

### Q006

Question: AC-009 in 042: OpenCode and Devin keep AskUserQuestion-style answers in their own transcripts, but no adapter reads them yet, so their decisions aren't captured. Build adapters or waive?
Options: Waive for now (Recommended); Build both adapters
Answer: Build both adapters

### Q007

Question: When should the 042 decision-capture build be committed to Skilled main? It's Level 3 now, 20 of 22 tasks done, all its tests pass (20/0, 35/35, 19/19 rerun by me) and it strict-validates. Rollback: git revert of the commit.
Options: After the probe settles T001 (Recommended); Commit and push now; Hold for my review
Answer: After the probe settles T001 (Recommended)

No Gate 3 packet-folder choice is included. It is a process question and the selected filter excludes it. Q004 is a workspace question of the kind Q002 filters, and it is recorded here by the operator's explicit instruction for this build. Q007 is a commit-permission question and is recorded the same way. The T001 probe-consent question is a process question and is left out.

### Q008
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01PDmqeFtwxnjVhimU7vtmUk:1 -->

Question:
```text
A Pi test worker saved into the real 042 packet because the session-relaunch nudge fires inside child workers (AI_SESSION_CHILD=1). The claim path already skips children; the threshold nudge doesn't. Add the same guard in session-relaunch/lib/nudge.cjs with a test?
```

Options:
```text
Fix it, same push (Recommended)
Fix it, push later
Leave it
```

Answer:
```text
Fix it, same push (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->



