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
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research"
    last_updated_at: "2026-09-23T19:55:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Trimmed the durable slice under the budget"
    next_safe_action: "Execute against the completion criteria"
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
# Goal: spec-kit simplification research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short. A
> truncated objective loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run five research lanes over system-spec-kit (retrieval, CLI runtime, shared package, templates and acceptance criteria, overengineering) in three rounds, reproduce every kept finding in-session, then remediate everything confirmed in sibling children, with no deferrals.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every round runs through the system-deep-loop fan-out runner on cli-pi through DevPass, never a hand-rolled loop. Round one is ten iterations per lane on GLM 5.3 Flash max. Round two is ten more on DeepSeek V4 Flash max against the remediated tree. Round three is five bounded angles per lane with a twelve-call cap, lane 001 on GLM and the other four on DeepSeek, their partial GLM iterations kept as census evidence |
| D2 | Lanes run in worktree 046, one at a time in rounds one and two and in parallel in round three, each writing only its own lane folder. A lane silent for fifteen minutes is killed and resumed |
| D3 | Every charter is improved through sk-prompt before launch |
| D4 | Each research finding is a hypothesis until reproduced here. Unreproducible findings are dropped with a note |
| D5 | Remediation children are created after synthesis, named for what they fix, and nothing is deferred |
| D6 | Before every commit: shared, runtime and CLI typecheck and build, named vitest files, npm run check in the CLI, validate.sh --strict on touched packets and residue sweeps. Commit through a private index. Push v4 and main after each green commit |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding, a criterion), resend the chat slice of
this file so the operator can update their copy. A child goal change that
alters a parent decision or criterion is an amendment to the parent: apply it
there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Every child folder, from
`001-ripgrep-search-system` to `022-doctor-signal-truth-and-conventions-precision`,
holds a `goal.md` that is authoritative for its phase and binds as if written here.

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Each bullet is checkable without opening another file. Copy them into the objective
verbatim: criteria left only here stay invisible to whatever judges completion.

- [x] All five research children are Complete with two ten-iteration lineages and one five-iteration lineage each and a confirmed-findings.md covering all three rounds
- [x] Every confirmed finding has a remediation child that is Complete, or a recorded decision not to change with its reason
- [x] validate.sh --strict --recursive prints RESULT: PASSED for this parent and every child
- [x] The trigger index regenerates identically with zero malformed documents
- [x] The parent goal.md was resent in chat after every change to its durable slice
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
| Lane 002 ran, censused, remediated | Done | `002-cli-runtime-utilization/research/confirmed-findings.md`; child `007-cli-package-residue-removal` complete, commit `3adaabf626` on both branches |
| Operator observation: env template dead flags | Done | child `008-env-example-dead-flags` complete; 13 variables removed, drift guard repaired |
| Lane 003 ran, censused, remediated | Done | `003-shared-package-utilization/research/confirmed-findings.md`; child `009-shared-package-dead-half-removal` complete |
| Lane 004 ran, censused, remediated | Done | `004-template-system-and-acceptance-criteria/research/confirmed-findings.md`; child `010-template-contract-alignment` complete |
| Lane 005 | Running | started 03:55 in worktree 046 |

### Deviations and findings

| Item | Note |
|------|------|
| Child 006 appended to the binding | The binding table gained a row; durable slice changed, parent resent in chat. |
| Child 007 appended to the binding | Durable slice changed again; parent resent in chat. |
| Resource-map extractor wiring carried to lane 004 | Lane 002 found the deep commands never name `resource-map/extract-from-evidence.cjs`; lane 004 owns the resource-map addon, so the wiring decision lands with its remediation. |
| Shared index hazard | Another session staged and amended in this checkout mid-commit; the 007 commit was rebuilt through a private index and the branch advanced with a compare-and-swap. |
| Child 010 appended to the binding | Durable slice changed; parent resent in chat. |
| Child 009 appended to the binding | Durable slice changed; parent resent in chat. |
| Lane 003 audited its worktree | Four claims described worktree 046's provisioning, not the repository; recorded as environment facts, and later lanes are read with that in mind. |
| Child 008 appended to the binding | Opened on the operator's observation rather than a lane synthesis; durable slice changed, parent resent in chat. |
| D6 amended: private-index commits | A pathspec commit takes the working tree and would carry the other session's hunks; the durable slice was resent in chat as the objective, log excluded, to fit the 4,000-character cap. |
| Child 011 appended to the binding | Durable slice changed; parent resent in chat. |
| Lane 005 measured its worktree twice | The empty adapter directory and the fingerprint collision were worktree 046 artifacts; both re-measured in the main checkout and recorded in the lane's confirmed findings. |
| The command surface outranked the lane's P1 rows | The eight /speckit:* assets still scaffolded the retired checklist; found by the census, fixed in 011. |
| Program closed | Lanes 001 to 005 Complete with 10 iterations and a confirmed-findings.md each; children 006 to 011 Complete; `validate.sh --strict --recursive` printed RESULT: PASSED twelve times; the trigger index regenerated twice to the same hash with zero malformed documents; the durable slice was resent after the 011 binding change. |
| Child 012 appended to the binding | The operator asked for the two pre-existing failures to be fixed after the program closed; durable slice changed, parent resent in chat. |
| Round two opened; D1 and the objective amended | The operator asked for ten more iterations per lane on DeepSeek V4 Flash max; the lanes run sequentially in worktree 046, fast-forwarded to the remediated tree, as a second lineage beside the GLM one; criteria reopened until the round closes. |
| Round one researched a stale tree | The runner's fast-forward before each lane failed silently on untracked research copies, so lanes 002 to 005 read the tree at the program's start; the census in the main checkout absorbed the difference, and round two starts from the current head. |
| D1 corrected to DevPass | opencode-go returned a monthly usage limit and Devin its daily quota; the operator chose DevPass on cli-pi, which needed the fan-out route flip in `specs/system-deep-loop/044-cli-pi-devpass-deepseek-route`. |
| Child 013 appended to the binding | Lane 001 round two censused; durable slice changed, parent resent in chat. |
| Child 014 appended to the binding | Lane 002 round two censused; durable slice changed, parent resent in chat. |
| Child 015 appended to the binding | Lane 003 round two censused; durable slice changed, parent resent in chat. |
| Child 016 appended to the binding | Lane 004 round two censused; the runtime test project repaired with it; durable slice changed, parent resent in chat. |
| Child 017 appended to the binding | Lane 005 round two censused; durable slice changed, parent resent in chat. |
| Round two closed | Five second lineages ran 10/10 on DevPass DeepSeek; children 013 to 017 closed every confirmed row; program validates 18/18 strict; trigger index regenerated identically on a second run; criteria ticked. |
| Round three opened | Operator asked for five more iterations per lane on expanded angles with GLM 5.3 Flash max; objective, D1 and criteria amended, parent resent in chat; charters give each lane eight new angles; runner started 10:37 in worktree 046 on `83130a9f20`. |
| Round three re-scoped and parallelized | First attempt spent 19 calls building a harness in one iteration; charters rebound to one angle per iteration with a twelve-call cap. Turns still took six to seven minutes at max reasoning, so the operator chose to keep max and run the five lanes in parallel; D1 and D2 amended, parent resent in chat; relaunch 11:35 and 12:03. |
| Round three switched to DeepSeek | At 14:30 the GLM pace projected a finish near 22:00; the operator switched lanes 002 to 005 to DeepSeek V4 Flash max through DevPass. Their one to two GLM iterations each are parked for the census; lane 001 continues on GLM at 4 of 5. D1 amended, parent resent in chat. |
| Children 018 to 021 appended to the binding | Lanes 004, 002, 005 and 003 censused from their DeepSeek syntheses and parked GLM iterations; lane 001 finished on GLM at 15:07; durable slice changed, parent resent in chat. |
| Child 022 appended to the binding | Lane 001 censused from its GLM synthesis and the aborted first attempt; durable slice changed, parent resent in chat. |
| Round three closed | Five lineages of five bounded iterations (lane 001 on GLM, lanes 002 to 005 on DeepSeek after the switch, with the parked GLM iterations kept as evidence); children 018 to 022 closed every confirmed row; program validates 23/23 strict; trigger index identical on a second run; criteria ticked. |
| Two CLI test lanes had rotted outside CI | The legacy and validation lanes `npm test` runs were never in the workflow and failed for four accumulated reasons; repaired in 014 and added to CI. The runtime root project fails in seven files and is the next child. |
| Durable slice trimmed under the budget | The slice had grown to 6,498 characters, past the validator's 4,000-character budget for a phase parent. The 22-row binding table became one sentence naming the child range, and the decisions were cut to their substance with the same meaning. The criteria stayed word for word, and the new slice was resent in chat. |
<!-- /ANCHOR:log -->
