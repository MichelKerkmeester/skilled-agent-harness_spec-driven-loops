---
title: "Implementation Plan: Phase 6: approval-grants"
description: "Adds an action-kind classifier and a precedence-ladder module to the bots runtime, extends the needs-you item with a grants field written at the gate, records the answer's scope through bots answer --scope and writes the ladder as a doc."
trigger_phrases:
  - "approval grants plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: approval-grants

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, run through `tsx` from a Node 22 CLI |
| **Framework** | None. The runtime is plain modules with a `Result<T>` return convention |
| **Storage** | JSON item files under the user-level state root. No index change |
| **Testing** | Vitest, in `.skilled/skills/system-skilled-bots/runtime/tests/` |

### Overview
Two new runtime modules carry the work: `action-kind.ts` holds OpenBot's six kinds and the word lists that recognize them, and `approval-ladder.ts` holds the four rungs in order, implements rung 1 and the `bot` fallback and names rungs 2 to 4 as not implemented in this phase because no store supplies them. The needs-you item gains a `grants` field that the gate fills from the parked question, 001's `bots answer --scope once|deny` gains the grant record and a guarded write, and the ladder is written once as a doc the run mode reads. The proof is the runtime suite plus three CLI probes whose output the acceptance criteria name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: item-unknown: item-1`, because 001 lands the flag and this phase extends it
- [ ] `rg -c 'grants' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` prints nothing and exits 1
- [ ] `ls .skilled/skills/system-skilled-bots/bots-run/references/` lists `run-queue-and-answer.md` and no ladder doc
- [ ] `ls specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/` lists `README.md`, `records.md`, `state-machines.md`, `refusals.md`, `mockups.md` and `fixtures`, so the design a builder reads is on disk before the first write

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] `node .skilled/bin/bots.cjs inbox` prints a grant column on every item line and exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered runtime modules behind one CLI.

### Key Components
- **`action-kind.ts`**: owns the six kinds, their order and their word lists, and the one function that reads the whole question. It is the only place a kind is decided, so the gate and the ladder cannot disagree about what a delete is, and it takes a bot's own `[ACTION: <kind>]` line as a floor rather than an override: the recorded kind is the stricter of the declared and the classified one, so a declaration can raise a kind and never lower it.
- **`approval-ladder.ts`**: owns the four rungs, the first-answer-wins rule and the rule that a standing allow attaches to a kind. It implements rung 1 and the `bot` fallback and never returns rungs 2 to 4, which the ladder doc and the help text name as not implemented in this phase. It is a pure function, so the order is testable before any store supplies the inputs it does not read.
- **`needs-you.ts`**: owns the item's shape. It gains `grants`, its key and its validation, and the resumed prompt names the granted scope.
- **`runner.ts`**: owns the gate. It classifies the question it already holds and writes the grant on the item it already writes, and it fills the grant on the memory-proposal branch 005 lands, which writes no `grants` field of its own.
- **`routine-state.ts`**: 002's module, which raises the fatigue item. It gains the grant on that item, so the item is born naming its kind and its rung rather than with `grants: null`, and the question it writes is the text the classifier reads [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T010].
- **`answer.ts`**: owns the answer. It records 001's scope and its actor on the grant, derives `deny` from a NO so a refusal is never recorded as an approval, compares the answer's text and its scope as one identity and guards the write with an exclusive lock file beside the item so a concurrent loser is refused `item-answered-differently`. The refusal of `always` and `conversation` as `grant-scope-unsupported` stays in `bots.cjs` where 001 put it, and T055 adds its detail, so no runtime module raises it. The lock holds the writer's `pid`, a `nonce` and the instant it was created, and it is reclaimed by rename when its owner pid is gone or its age is past 60 seconds, so a lock left by a killed process never blocks the next answer. A live holder is waited on for up to 2,000 ms and then refused `item-busy`. The wait is `Atomics.wait` over a one-integer `SharedArrayBuffer`, so `answerItem` keeps its synchronous signature and none of its six callers changes. Every acquisition re-reads the lock and proceeds only on its own `nonce`, and the release unlinks only a lock that still holds that `nonce`, so a process whose lock was reclaimed cannot delete the lock the next answer now holds. The contents and the lifetime are `design/records.md` section 3 and the machine is `design/state-machines.md` section 2. The scope is written before the review seam 005 owns runs and before the resume request is built. 002 lands its no-resume option, so `bots enable`'s answer to the fatigue item takes the same write, and this phase fills the grant on that answer so it records the grant without queueing a resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md, section "Key Components"]. The no-resume option also drops a resume still queued for that item, because a resume request keys on its item id and would otherwise dispatch the tenth failed run once `bots enable` clears the switch [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:143-160] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-006].
- **`bots.cjs`**: owns argument parsing, the inbox line and the inbox `--json` row. It gains one column and one key and no rule of its own. The `--scope` option is 001's, and 002 already routes `enable`'s fatigue answer through `answerItem` with the no-resume option instead of writing the item itself, so this phase adds the grant to that answer and no second write path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md, section "Key Components"].

### The design folder a builder reads first

`design/` holds what the phase documents leave to the builder and the shared contracts do not own. It is not a module and it ships no code.

| File | What a builder takes from it |
|------|------------------------------|
| `design/records.md` | Every field of the six shapes, the ten-check validation order for the grant, the lock file's three keys and its lifetime, the `[ACTION: <kind>]` grammar and the resumed prompt line |
| `design/state-machines.md` | The grant's four states, the item and lock machine, the answer sequence with the lock before the read, the gate sequence with the declaration read after the classification, the classifier flow and the ladder flow |
| `design/refusals.md` | The nine refusals with the trigger, the exact stderr text, the exit, the state on disk, the recovery and the test |
| `design/mockups.md` | The inbox line's eight columns, the inbox row's eleven keys, the answer stdout lines, the usage text, the resumed prompt and the ladder doc's seven sections |
| `design/fixtures/` | Eleven goldens, the six kinds with their word lists and nine cases, and the 21-row kind by scope matrix |

The grant object's field table is `contracts/records.md` section 3 and the answer seam's step order is `contracts/answer-seam.md` section 1. The design folder cites both and copies neither.

### Data Flow
A child prints `[NEEDS-DECISION] delete the stale branch?` → `runner.ts` reads the marker → `action-kind.ts` classifies the whole question as `delete` → `approval-ladder.ts` returns `{ asks: true, rung: 'kind' }` → the item is written with `grants: { kind: 'delete', action: 'delete the stale branch?', rung: 'kind', scope: null, grantedBy: null, grantedAt: null }`. The operator runs `bots answer <item> yes --scope deny` → `answer.ts` takes the lock beside the item, reclaiming it first when its owner pid is gone or its age is past 60 seconds and refusing `item-busy` when a live holder outlasts the 2,000 ms wait, keeps 001's refusal of `always` and `conversation` as `grant-scope-unsupported`, rewrites the item with `scope: 'deny'`, `grantedBy` and `grantedAt` and releases the lock → the resume request is queued → `buildResumedPrompt` names the scope → the resumed run's record carries one line naming the item, the kind, the scope and the actor → `bots inbox` prints `delete kind deny` on the item's line and the same object on its `--json` row. A NO with no `--scope` takes the same path and records `deny`, so a channel answer that passes no scope records a refusal rather than an approval. `bots enable` takes the same path with the no-resume option, so 002's fatigue item is answered with a grant and no resume is queued, and any resume an earlier answer queued for that item is dropped before the switch is cleared, so the tenth failed run is never dispatched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a stored record shape and a CLI surface, so every producer and consumer of both is named here before implementation.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/needs-you.ts` | Owns `NeedsYouItem`, `ITEM_KEYS`, `validateNeedsYouItem` and `buildResumedPrompt` | update | `rg -n "grants" runtime/lib/needs-you.ts` prints the field, its key, its check and the resumed-prompt line |
| `runtime/lib/runner.ts` | Writes the item at the gate, and on the memory-proposal branch 005 lands | update | `rg -n "classifyAction\|decideApproval" runtime/lib/runner.ts` prints both calls, and `rg -n "memory-proposals" runtime/lib/runner.ts` prints the branch that fills the grant |
| `runtime/lib/routine-state.ts` | Raises the fatigue item 002 writes | update | `rg -n "classifyAction\|decideApproval" runtime/lib/routine-state.ts` prints both calls on the item it writes |
| `runtime/lib/answer.ts` | Rewrites the item with the answer | update | `rg -n -e scope -e lock -e stale -e pid -e "input.resume" -e "queueFolders" runtime/lib/answer.ts` prints the scope 001 passes, the NO that records `deny`, the identity check, the lock, its pid and age reclaim, the no-resume option, the queued resume it drops and the write. The standing-allow refusal is 001's and stays in `bots.cjs`, so no runtime module raises it |
| `runtime/lib/run-record.ts` | Records the run, its request join and its exit | update | `rg -n "grant" runtime/lib/run-record.ts` prints the optional grant line on the request join |
| `runtime/lib/status-index.ts` | Indexes the item's ids and times only | unchanged | `rg -n "grants" runtime/lib/status-index.ts` prints nothing |
| `runtime/lib/delivery.ts` | Reads the item's id and question for a notice | not a consumer | `rg -n "grants" runtime/lib/delivery.ts` prints nothing |
| `runtime/lib/status.ts` | Reads the index and formats `bots status` | not a consumer | `rg -n "grants" runtime/lib/status.ts` prints nothing |
| `bin/bots.cjs` | Parses verbs and options, prints the inbox line and its `--json` row | update | `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: item-unknown: item-1`, not `unknown option` |
| `bots-run` skill docs | Name the run verbs and their flags | update | `rg -n -- "--scope" .skilled/skills/system-skilled-bots/bots-run/references/` prints the option and the ladder doc |
| `bots-status` skill docs | Name the inbox verb and its `--json` row | update | `rg -n "grant" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints the column |
| `feature-catalog/operator-loop` | Documents the item and the answer | update | `rg -n "grants\|--scope" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/` prints both |
| `.skilled/crates/bots-tui/tests/fixtures/payloads/inbox.grant.json` | The `inbox --json` payload the screen reads, served by the fake CLI behind `--fixture-scenario grant` | create | `rg -n "grants" .skilled/crates/bots-tui/tests/fixtures/payloads/inbox.grant.json` prints the key on the payload |

> **Authority:** the host is the authority. A terminal answer needs no roster to exist and an absent roster refuses nothing there, while a present roster is checked on either surface, so an actor who is neither `owner` nor a `members` entry is refused `answer-not-approver` on the terminal too, and a channel answer adds the `operators.json` roster 011 lands, which calls the same `answerItem` rather than a second write path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-021]. `bots enable`'s fatigue answer takes the same check, so a present roster that names neither the owner nor the OS user refuses it `answer-not-approver` and the item stays open, and the screen answers through `bots answer`, so the same refusal reaches it as that verb's exit code and its stderr in the status row while the item stays open [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md, REQ-014]. A bot child writes the same state root only on an executor kind whose read-only posture is a tool or approval gate rather than an OS boundary, which is `cli-claude-code`, `cli-opencode`, `cli-devin`, `cli-pi` and `cli-mistral-vibe` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:42] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:62], while `cli-codex`, `cli-cursor` and `cli-deepseek-harness` confine writes at the OS level, so a capped child on one of those cannot write the state root, and `cli-deepseek-harness` leaves OS temp writable, but it can still read it, and `native` honors no sandbox class at all [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:299-323]. The model is a boundary and not an authentication: `grantedBy` records the actor the answer claimed, and the roster is the one check that separates a person from a child.

Required inventories:
- Same-class producers: `rg -n 'writeNeedsYouItem' .skilled/skills/system-skilled-bots/runtime/lib/` names every place an item is written, which is the gate, the answer, the resume stamp, the memory-proposal branch 005 lands and the fatigue item 002 raises in `routine-state.ts`'s `evaluateFatigue`. Each one must carry the grant forward rather than drop it, and the answer's write is the one that takes the lock. 002 raises that item and answers it through `answerItem`'s no-resume option, so this phase fills the grant on the item that writer creates and on that answer, which records the grant and queues no resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T010] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T021]. The no-resume option also drops a resume still queued for that item, so a resume an earlier answer queued cannot dispatch the tenth failed run after `bots enable` clears the switch [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-006]. 005 writes no `grants` field, so this phase fills the grant on the branch it lands. A writer a later phase adds fills the field with this phase's `classifyAction` and `decideApproval` rather than writing `null`.
- Consumers of changed symbols: `rg -n 'NeedsYouItem|ITEM_KEYS|buildResumedPrompt' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader of the item's shape.
- Matrix axes: kind (7: `pay`, `credentials`, `delete`, `send`, `share`, `post`, `other`) × scope (3: `once`, `deny`, `null`) = 21 rows, and `approval-ladder.vitest.ts` covers the 21 as a table, with 001's `grant-scope-unsupported` refusal asserted on the `always` and `conversation` inputs.
- Algorithm invariant: a standing allow attaches to a kind and never to a phrase, and no standing allow is recorded in this phase. `decideApproval` returns rung 1 or the `bot` fallback, `classifyAction` returns the strictest kind anywhere in the question, `[ACTION: <kind>]` is a floor rather than an override and `answer.ts` keeps 001's refusal of `conversation` and `always` as `grant-scope-unsupported` before the kind is read. The lock is reclaimed by owner pid or by a 60 second age and never by a timeout alone, so a killed process cannot make an item permanently unanswerable. Adversarial cases: an empty question, a question naming two kinds, a question naming a kind only in a quoted example, a benign first sentence followed by a delete, an `[ACTION: other]` line on a question that names a delete, an `[ACTION: <kind>]` line naming a kind outside the seven, a grant whose `kind` is not one of the seven, a grant whose `scope` is not one of the three, a NO with no `--scope`, two answers that both read `open`, a lock file naming a dead pid and a lock file whose owner is alive.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `design/records.md`, `design/state-machines.md`, `design/refusals.md` and `design/mockups.md` first, then `needs-you.ts`, `runner.ts`, `answer.ts`, `run-record.ts` and `bots.cjs` and records the item's key list, the gate's write, the answer's rewrite, the record's request join and the inbox line. Implementation adds `action-kind.ts` and `approval-ladder.ts`, the `grants` field, the gate's classification and its `[ACTION: <kind>]` floor, the grant on 001's `--scope once|deny`, the standing-allow refusal, the NO that records `deny`, the answer identity, the guarded write with its pid and age reclaim, the grant on the fatigue item `routine-state.ts` writes and on its answer through `answerItem`'s no-resume option, the queued resume that option drops, the grant on the memory-proposal branch 005 lands, the grant line on the resumed record and the grant on the inbox line and its `--json` row. Verification runs the runtime suite, the CLI probes, the fatigue answer's grant with no resume queued, the resume an answer from another surface queues and the drop that stops it dispatching the tenth failed run, a lock file naming a dead pid reclaimed so the next answer lands, the inbox line and row on a temporary state root, the ladder doc's four rungs with rungs 2 to 4 marked not implemented, the fixture payload and the notices check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `classifyAction` over the six kinds and `other` including a benign first sentence and an `[ACTION: <kind>]` floor, `decideApproval` over rung 1 and the `bot` fallback, `validateNeedsYouItem` with a grant, `buildResumedPrompt` with a scope | Vitest |
| Integration | The gate writing a grant from a parked question, the memory-proposal branch filling one, `bots enable`'s fatigue answer recording a grant with no resume queued, an answer to that same item from `bots answer` queueing a resume the runner refuses `routine-fatigued`, that queued resume dropped when `bots enable` runs before the next drain, 001's `--scope` through the item file, the standing-allow refusal, the NO that records `deny`, the answer identity, two concurrent answers against one item, a lock file naming a dead pid reclaimed so the next answer lands, a lock held by a live process refused `item-busy` after the wait, the grant line on the resumed record, the inbox line and its `--json` row | Vitest with a temporary state root |
| Manual | `bots inbox` and `bots inbox --json` against a temporary state root seeded with one item, and `bots answer --scope` against a scratch item | The `bots` CLI |

The one command that decides the phase is `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run`, which must print no `failed` line, followed by `node .skilled/bin/bots.cjs inbox`, which must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tsx` | External | Green | The CLI cannot load a `.ts` runtime module. `bots.cjs` already registers it |
| `vitest` | External | Green | No test runs. The runtime's `package.json` already declares it |
| OpenBot's `docs/approvals.md` | External | Green | The classifier's word lists are written from its "What asks" table alone. `shared/tool-name.ts` holds no classifier, so nothing is lifted and no notice entry is written |
| Phase 001-activity-and-actor | Internal | Green | `bots answer --scope once|deny`, `bots answer --as`, `bots inbox --json` and `bots inbox --json --all` are 001's. This phase extends the scope with the grant and the ladder, fills `grantedBy` from `--as`, and adds the grant to the row 001 prints [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "In Scope"] |
| Phase 002-routine-layer | Internal | Green | 002 raises the fatigue item in `routine-state.ts`'s `evaluateFatigue` and answers it from `bots enable` through `answerItem`'s no-resume option, so this phase fills the grant on the item that writer creates and on that answer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T010] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T021] |
| Phase 005-memory | Internal | Green | 005 lands the memory-proposal branch in `runner.ts` and writes no `grants` field, so this phase fills the grant on that branch. An item 005 writes reads with `grants: null` until then [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md, T021] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `bots inbox` refuses an item written before this phase, or `bots answer` refuses an item whose grant it cannot read.
- **Procedure**: Revert the one commit. An item carrying `grants` then reads as an unknown key and is reported as unreadable, which holds its bot, so the revert also needs the item files written after this phase removed or their `grants` key stripped. The order of the whole revert, the per-phase table row that names this phase's cost and the manual step are `contracts/versioning.md` section 2, and this plan does not restate them [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "2. AN OLDER RUNTIME MEETS A NEWER RECORD"]. The grant's scope survives in `answer.scope`, so a stripped item still records what the operator allowed.
- **What the revert does not need**: no version bump, no index rebuild and no state-root migration, because the item carries no version key and the run record keeps `schemaVersion` at `1` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"].
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This phase's build is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the wave and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:16]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this packet's workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

### Executor roster

| Executor | Model | Effort lever | Dispatch shape | Source |
|----------|-------|--------------|----------------|--------|
| `cli-mistral-vibe` | `deepseek-flash` | none. The row's `thinking` is `max` and no flag moves it | `VIBE_HOME="$VH" vibe -p "<prompt>" --model deepseek-flash --add-dir "$WT" --auto-approve --output-dir "$RUN_DIR/out" </dev/null`, run from a scratch folder inside the worktree `$WT`, with `$VH` a fresh `mktemp -d` outside it | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:72] |
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max`, a standalone flag | `pi -p "<prompt>" --model llmgateway/deepseek-v4.1-flash-1017 --thinking <level> --mode text --offline </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:146-148] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id | `opencode run --standalone -m opencode-go/deepseek-v4.1-flash#<level> --format json "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:142] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:161] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:193] |
| `cli-devin` | `deepseek-v4-1-flash-max` | none. The max tier is baked into the uid | `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous -- "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:85] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:257] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` | `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<prompt>"` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:107-112] |

**Effort policy.** DeepSeek Flash at `high` carries a small mechanical task: a verb option, a doc line, a test that mirrors an existing one. DeepSeek Flash at `max` carries a design or tricky task: a new module, a new stored field, a seam between two phases. `gpt-6-luna` at `xhigh` on the `fast` service tier carries the hardest task and is the last fallback for every wave. GPT models go through `cli-codex` alone, because it is the hub's OpenAI-backed mode and no other row in this roster reaches an OpenAI model [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28]. The parent's row for this phase names `cli-mistral-vibe` at `deepseek-flash` and `max (fixed)` as the phase's primary [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION", row 006], so every wave runs at `max` and the tier sets only the fallback tier on `cli-pi`. The mechanical waves below fall back at `high` under the parent's own tier rule, which gives `high` to a small mechanical task and `max` to a design or tricky one [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

**The worker rule.** Parallelism follows file overlap: no two workers touch one file, so a wave's worker count is the number of disjoint file groups its tasks fall into. The parent fixes this phase at three workers, which is the bound every wave below stays under [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION", row 006].

### Waves

`tasks.md` owns the task ids and their verify clauses. This table owns the assignment. Every wave walks the ladder in §Fallback order, and its executor column is that wave's entry point. The Files column names each file relative to the directory its task line gives: `lib/` and `tests/` sit under `$RT`, `bin/bots.cjs` under `.skilled/`, and the rest under `.skilled/skills/system-skilled-bots/`.

| Wave | Task ids | Files | Executor | Model | Effort | Workers in parallel | Verify |
|------|----------|-------|----------|-------|--------|---------------------|--------|
| 0 | T001 to T006 | none. Six reads and the four design files | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 1, because the six reads feed one baseline record and no file is written | V0 |
| 1 | T007 to T010, T012 | `lib/action-kind.ts`, `lib/approval-ladder.ts` | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 2, the file-overlap bound: `action-kind.ts`, `approval-ladder.ts` | V1 |
| 2 | T013 to T016, T018 to T022, T042 | `lib/needs-you.ts`, `lib/answer.ts`, `lib/runner.ts`, `lib/run-record.ts` | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 3, the file-overlap bound: `needs-you.ts`, `answer.ts`, `runner.ts` with `run-record.ts` | V2 |
| 3 | T011, T017, T023 to T026, T055 | `lib/approval-ladder.ts`, `lib/runner.ts`, `lib/routine-state.ts`, `lib/answer.ts`, `bin/bots.cjs` | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 1, because T017 edits four files at once, two of them written in wave 2, so no second worker can hold one of them | V3 |
| 4 | T027 to T032 | `tests/action-kind.vitest.ts`, `tests/approval-ladder.vitest.ts`, `tests/needs-you.vitest.ts`, `tests/answer.vitest.ts`, `tests/runner.vitest.ts`, `tests/cli-run.vitest.ts` | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 3, the file-overlap bound: `action-kind` with `approval-ladder`, `needs-you` with `answer`, `runner` with `cli-run` | V4 |
| 5 | T033 to T041 | `bots-run/references/approval-ladder.md`, `bots-run/references/run-queue-and-answer.md`, `bots-status/references/status-and-inbox.md`, `feature-catalog/operator-loop/needs-you-items.md`, `feature-catalog/operator-loop/needs-you-answer.md`, `lib/README.md`, `.skilled/crates/bots-tui/tests/fixtures/payloads/inbox.grant.json` | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `high` | 3, the file-overlap bound: the ladder doc with `run-queue-and-answer.md`, `status-and-inbox.md` with the two catalog entries, `lib/README.md` with the new payload | V5 |
| 6 | T043 to T053 | none. The suite, the probes and the validator | the orchestrator, no external executor | none | none | 1 | V6 |

- **V0**: `rg -n "ITEM_KEYS" $RT/lib/needs-you.ts` prints the declaration and no `'grants'` entry. `rg -n "const item: NeedsYouItem" $RT/lib/runner.ts` prints one line. `rg -n "writeNeedsYouItem|needsYouState" $RT/lib/answer.ts` prints the state check and two writes. `rg -n "answer: \{ ids: 2|inbox: \{ ids: 0" .skilled/bin/bots.cjs` prints both specs. `rg -n "resumedItemId" $RT/lib/run-record.ts` prints the optional field. `ls specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/` lists the four design files and `fixtures`. `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`.
- **V1**: `rg -n "pay|credentials|delete|send|share|post" $RT/lib/action-kind.ts` prints the kind list in that order. `rg -n "classifyAction" $RT/lib/action-kind.ts` prints the export and the `other` fallback. `rg -n "action-kind-invalid" $RT/lib/action-kind.ts` prints the refusal. `rg -n "kind|rule|auto-review|extra-vigilant" $RT/lib/approval-ladder.ts` prints the rung list in order. `rg -n "SCOPES" $RT/lib/approval-ladder.ts` prints the two-value list. `cd $RT && npm run typecheck` exits 0.
- **V2**: `rg -n "'grants'" $RT/lib/needs-you.ts` prints the key and its check. `rg -n "scope" $RT/lib/needs-you.ts` prints the resumed-prompt line. `rg -n "classifyAction|decideApproval" $RT/lib/runner.ts` prints both calls. `rg -n "grantedBy|grantedAt" $RT/lib/answer.ts` prints both fields and the write. `rg -n "lock" $RT/lib/answer.ts` prints the lock taken before the write and released after it. `rg -n "stale|pid" $RT/lib/answer.ts` prints the reclaim by owner pid and by age. `rg -n "Atomics.wait" $RT/lib/answer.ts` prints the wait. `rg -n "grant" $RT/lib/run-record.ts` prints the optional field. `cd $RT && npm run typecheck` exits 0.
- **V3**: `rg -n "not implemented in this phase" $RT/lib/approval-ladder.ts .skilled/bin/bots.cjs` prints the module note and the help line. `rg -n "writeNeedsYouItem" $RT/lib/` prints every writer, each passing the grant it read. `rg -n "classifyAction|decideApproval" $RT/lib/routine-state.ts` prints both calls on the fatigue item's write. `rg -n "grants" .skilled/bin/bots.cjs` prints the column and the row key. `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: item-unknown: item-1`. `node .skilled/bin/bots.cjs answer item-1 yes --scope sometimes` exits 2 with `bots: --scope takes once or deny`. `cd $RT && npm run typecheck` exits 0.
- **V4**: `cd $RT && npx vitest run tests/action-kind.vitest.ts tests/approval-ladder.vitest.ts tests/needs-you.vitest.ts tests/answer.vitest.ts tests/runner.vitest.ts tests/cli-run.vitest.ts` prints a `Test Files` line with no `failed`.
- **V5**: `rg -n "first answer wins" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the rule. `rg -n "not implemented in this phase" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the note. `rg -n -- "grant" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the grant beside the option. `rg -n "grant" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints the column. `rg -n "grants" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md` prints both fields. `rg -n "action-kind.ts|approval-ladder.ts" $RT/lib/README.md` prints two rows. `rg -c "tool-name.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints nothing, because this phase lifts no file. `rg -n "grants" .skilled/crates/bots-tui/tests/fixtures/payloads/inbox.grant.json` prints the key on the payload.
- **V6**: `cd $RT && npx vitest run` prints no `failed`. `cd $RT && npm run typecheck` exits 0. `node .skilled/bin/bots.cjs inbox` exits 0. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`.

Wave 6 runs in the orchestrator because each of its tasks reads the finished tree, so a dispatch would add a hop without adding evidence. `$RT` is `.skilled/skills/system-skilled-bots/runtime`, the same variable `tasks.md` uses.

### Fallback order

When a CLI runs out of usage, the wave moves down this ladder and keeps its task ids, its files and its verify step. The order is the parent's, not this phase's, so a phase that falls back still finishes at the effort it was planned for [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

1. `cli-mistral-vibe` at `deepseek-flash`, always at the row's `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]
2. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101]
3. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78]
4. `cli-devin` at `deepseek-v4-1-flash-max`, whose weekly quota is probed first with a trivial read-only call, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, the last fallback [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199].
- Compose every prompt as the child preamble, then the inlined persona, then the task and set `AI_SESSION_CHILD=1` on the run [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:58] [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:38].
- One change per brief: the file, the edit and the check that proves it.
- Read the outcome record, not stdout. `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116].
- A Vibe worker starts from its own scratch folder inside the worktree, passes `--add-dir` for the worktree and keeps `VIBE_HOME` outside it, as the parent's Vibe dispatch says [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "BUILD ORCHESTRATION", Vibe dispatch].

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator removes its own row from the roster before the first wave. The ladder above is written to survive one row being gone.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-pi` | never for being inside Pi. Only from inside a fan-out lineage or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10] |
| `cli-opencode` | any `OPENCODE_*` env var other than `OPENCODE_API_KEY` is set, `opencode` is in the process ancestry, or `~/.opencode/state/<id>/lock` exists | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:187] |
| `cli-mistral-vibe` | `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] |
| `cli-devin` | `$DEVIN_PROJECT_DIR` is set, or `devin` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:35] |
| `cli-codex` | `$CODEX_SESSION_ID` or any `CODEX_*` env var is set, or `codex` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:35] |

<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing. It only reads | Implementation |
| Implementation | Setup's recorded key list, gate write and inbox line | Verification |
| Verification | Implementation's modules, field and CLI option | The phase handoff to 007-per-bot-apps |
<!-- /ANCHOR:phase-deps -->

---
