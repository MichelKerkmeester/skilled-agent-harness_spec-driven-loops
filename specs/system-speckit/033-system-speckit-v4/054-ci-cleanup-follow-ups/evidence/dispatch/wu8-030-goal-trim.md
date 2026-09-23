GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @markdown, a LEAF documentation executor at depth 1. You make exactly the edits described,
run the named VERIFY commands, and return one handback block. Nested dispatch is illegal: do not start
another pi, cli or agent process. If you cannot finish, stop and report where.

Repo root: the current working directory (all paths from there).

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no command beyond the VERIFY commands.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- If an OLD text is not found exactly once, skip that EDIT, do the rest, and report it under
  failures. Never guess a nearby match.

TARGET: specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md (1 file, 3 edits)

WHY: the durable slice of this goal (everything between the frontmatter and the log anchor) is
6,498 characters and the validator fails a phase parent past 4,000. The 22-row binding table becomes
one sentence naming the child range, and the decision wording is cut to its substance with the same
meaning. The completion criteria and the log stay word for word.

EDIT 1 (OLD occurs exactly once: the whole block from the intro quote through the binding anchor's close)
OLD:
> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run five research lanes over system-spec-kit (retrieval, CLI runtime, shared package, templates and acceptance criteria, overengineering), ten iterations per lane per round across two rounds, then a third round of five iterations per lane on expanded angles, reproduce every kept finding in-session, then remediate everything confirmed in sibling children, with no deferrals.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two rounds per lane, each launched through the system-deep-loop fan-out runner, never a hand-rolled loop: round one, GLM 5.3 Flash max through DevPass on cli-pi (llmgateway/glm-5.3-flash); round two, DeepSeek V4 Flash max through DevPass on cli-pi (llmgateway/deepseek-v4-flash-vision-exp) as a second ten-iteration lineage against the remediated tree; round three, five iterations per lane, one bounded expanded angle each with a twelve-call cap, DeepSeek V4 Flash max through DevPass on cli-pi as a third lineage against the twice-remediated tree; lane 001, four fifths through on GLM 5.3 Flash max when the operator switched executors, finishes its GLM lineage, and the four partial GLM lineages of the other lanes feed their censuses as supplementary evidence |
| D2 | Lanes run sequentially in worktree 046 so the containment guard cannot cross lanes; a lane silent for fifteen minutes is killed and resumed; round three runs its five lanes in parallel in the same worktree, each writing only its own lane folder, because max reasoning costs six minutes per turn |
| D3 | Every charter is improved through sk-prompt before launch |
| D4 | Each research finding is a hypothesis until reproduced here; unreproducible findings are dropped with a note |
| D5 | Remediation children are created after synthesis, named for what they fix, and nothing is deferred |
| D6 | Gates before every commit: shared, runtime and CLI typecheck and build, named vitest files, npm run check in the CLI, validate.sh --strict on touched packets, residue sweeps; commit through a private index so another session's staged work is never swallowed; push v4 and main after each green commit |

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
| 008-env-example-dead-flags | `008-env-example-dead-flags/goal.md` |
| 009-shared-package-dead-half-removal | `009-shared-package-dead-half-removal/goal.md` |
| 010-template-contract-alignment | `010-template-contract-alignment/goal.md` |
| 011-command-surface-contract-realignment | `011-command-surface-contract-realignment/goal.md` |
| 012-pre-existing-test-repair | `012-pre-existing-test-repair/goal.md` |
| 013-trigger-phrase-quality-enforcement | `013-trigger-phrase-quality-enforcement/goal.md` |
| 014-cli-decommission-orphan-removal | `014-cli-decommission-orphan-removal/goal.md` |
| 015-shared-package-post-remediation-cleanup | `015-shared-package-post-remediation-cleanup/goal.md` |
| 016-template-seams-and-sentinel-repair | `016-template-seams-and-sentinel-repair/goal.md` |
| 017-completion-gate-and-catalog-alignment | `017-completion-gate-and-catalog-alignment/goal.md` |
| 018-scaffold-placeholder-and-upgrade-truth | `018-scaffold-placeholder-and-upgrade-truth/goal.md` |
| 019-ci-push-gates-and-runtime-doc-truth | `019-ci-push-gates-and-runtime-doc-truth/goal.md` |
| 020-rule-headers-registry-coverage-and-playbook-paths | `020-rule-headers-registry-coverage-and-playbook-paths/goal.md` |
| 021-shared-readme-generator-and-dead-exports | `021-shared-readme-generator-and-dead-exports/goal.md` |
| 022-doctor-signal-truth-and-conventions-precision | `022-doctor-signal-truth-and-conventions-precision/goal.md` |

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->
NEW:
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
END EDIT 1

EDIT 2 (ANCHOR occurs exactly once: the last row of the log table. Keep it and add one row after it)
ANCHOR: | Two CLI test lanes had rotted outside CI | The legacy and validation lanes `npm test` runs were never in the workflow and failed for four accumulated reasons; repaired in 014 and added to CI. The runtime root project fails in seven files and is the next child. |
NEW:
| Two CLI test lanes had rotted outside CI | The legacy and validation lanes `npm test` runs were never in the workflow and failed for four accumulated reasons; repaired in 014 and added to CI. The runtime root project fails in seven files and is the next child. |
| Durable slice trimmed under the budget | The slice had grown to 6,498 characters, past the validator's 4,000-character budget for a phase parent. The 22-row binding table became one sentence naming the child range, and the decisions were cut to their substance with the same meaning. The criteria stayed word for word, and the new slice was resent in chat. |
END EDIT 2

EDIT 3 (three frontmatter lines, each occurs exactly once)
OLD:     last_updated_at: "2026-09-06T16:40:00Z"
NEW:     last_updated_at: "2026-09-23T19:55:00Z"
OLD:     last_updated_by: "claude-fable-5-1"
NEW:     last_updated_by: "claude-opus-5-5"
OLD:     recent_action: "Closed round three; every criterion ticked"
NEW:     recent_action: "Trimmed the durable slice under the budget"
END EDIT 3

VERIFY - run these, paste each command with its result line
  grep -c '^| 0[0-2][0-9]-' specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md   # expect 0 (the binding table rows are gone)
  grep -c 'Durable slice trimmed under the budget' specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md   # expect 1
  grep -c '^- \[x\]' specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md   # expect 5 (criteria unchanged)
  grep -c 'recent_action: "Trimmed the durable slice under the budget"' specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md   # expect 1

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
