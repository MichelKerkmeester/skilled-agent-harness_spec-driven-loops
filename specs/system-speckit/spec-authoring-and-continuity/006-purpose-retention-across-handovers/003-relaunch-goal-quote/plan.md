---
title: "Implementation Plan: Phase 3: relaunch-goal-quote"
description: "Add one guidance rule to the two texts a session follows when it writes a relaunch note, the /speckit:handoff command and the session-relaunch nudge, so a bound packet's Goal opens with a copied Purpose line. Text only, proved by two nudge assertions and the unchanged suite."
trigger_phrases:
  - "relaunch goal quote plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: relaunch-goal-quote

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command doc and Node.js CommonJS |
| **Framework** | None. The session-relaunch hook is plain Node |
| **Storage** | None. The note is a gitignored file under `.skilled/skills/.state/session-relaunch/handoffs/` and its format does not change |
| **Testing** | `node --test` |

### Overview
Two texts tell a session how to write the note: `handoff.md` Step 3 for a manual hop and the `handoffText` nudge for an automatic one. Each gets the same rule: when `spec_folder` names a packet, Goal opens with a `Purpose (<file>): <text>` line copied from the packet. Two assertions in `nudge.test.cjs` prove the nudge line, and the existing suite and mirror checks prove nothing else moved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline commands in section 5 print the numbers recorded there before the first edit
- [ ] Each search text in section 4 occurs exactly once: `rg -cF '<search text>' <file>` prints 1
- [ ] Dependencies identified: none blocking

### Definition of Done
- [ ] All acceptance criteria in `spec.md` section 4 met
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` prints `pass 1014` and `fail 0` and exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Writer guidance only. No new component, option or check.

### Key Components
- **`handoff.md` Step 3**: the contract a session follows on a manual `/speckit:handoff`, and the only trigger on Cursor and Devin. Without the rule here, manual notes never carry the line.
- **`handoffText` in `nudge.cjs`**: the note shape every automatic nudge prints, called by `claude/context-nudge.mjs`, `codex/shared.mjs`, `opencode/session-relaunch.js` and `pi/session-relaunch.ts`. The nudge lists the note shape inline and never sends the session to `handoff.md`, so without the rule here, automatic notes never carry the line.

### Data Flow
The sending session reads the rule, opens the bound packet's `spec.md`, copies its `### Purpose` into the first Goal line and writes the note. `prepare` or `keep` validates it as today: frontmatter, `status: open`, owner and four non-empty sections (`validateHandoff` in `lib/relaunch-core.cjs`), the `spec_folder` shape and existence, and the `Running workers:` line for `prepare`. It then writes or removes `goal_packet` itself (`recordGoalPacket` in `bin/session-relaunch.cjs`). The receiver runs `claim`, which prints the note body (`printHandoffBody`) and a `Goal packet:` line when `goal_packet` is set. Its seed then has it read the note and run `/speckit:resume <spec_folder>` in the same step (`seedText` in `nudge.cjs`), and read `goal.md` before Remaining work. The copied line reaches the receiver as part of the body, with no code change on that side.

### Shape Chosen
Two shapes were weighed. Only (a) is built.

| Shape | What it is | Cost | Verdict |
|-------|-----------|------|---------|
| (a) Writer instruction | The two writer texts ask for the copied line | Seven doc lines, one string constant, two test assertions. Model-followed, so a session can skip it | Chosen |
| (b) Hook step | `prepare` and `keep` write or check a Purpose line when `spec_folder` is set | A purpose resolver in the hook: `### Purpose` parsing, placeholder detection, the parent walk and the `goal.md` Objective read. Child 004 owns that helper and has not planned it yet, so this phase would duplicate it or wait. It also edits text the session wrote, which `prepare` today does only for the `goal_packet` frontmatter field | Held back |

Why (a): the receiver already gets the purpose from child 002's resume row on the same step it reads the note (see `spec.md` section 7), so a mechanical guarantee here buys little for its cost. If real notes show sessions skip the line, (b) can reuse 004's helper later.

### Goal And Purpose In One Note
The note can carry three goal-like things. They stay apart:
- The `Purpose (<file>): <text>` line says why the work exists. It is copied, never reworded.
- The free sentence after it says what this session works toward.
- `goal_packet`, which the tool alone sets, points at a `goal.md` whose durable directive binds the session goal. The receiver reads that file before Remaining work.

When a `goal.md` is bound and the packet has purpose text, the line quotes the purpose and `goal.md` stays the binding goal. When a `goal.md` is bound and no purpose text exists, the line quotes the `goal.md` Objective, so the two say the same thing. The `handoff.md` rule states that the bound `goal.md` still binds the session goal, so a reader never treats the Purpose line as a rival goal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup runs the section 5 baselines and checks each search text occurs once. Implementation applies Edits 1 to 6 below, one per task. Verification reruns the baselines and the Measured Behavior command from `spec.md`.

Each edit is a literal search and replace. Copy the search text exactly, including leading spaces. Run every command from the worktree root.

**Edit 1.** File `.skilled/commands/speckit/handoff.md`. Search (line 133, one line):

```text
Goal states what the work is for.
```

Replace with:

```text
Goal states what the work is for.
When `spec_folder` names a packet, open Goal with one line `Purpose (<file>): <text>` that copies word for word the `### Purpose` text of that packet's `spec.md`, where `<file>` is the repo-relative path you copied it from.
When that text is empty or still a template placeholder, copy the `### Purpose` of the nearest parent folder whose `spec.md` has one, and write the line as `Purpose (from parent <file>): <text>`.
When no such text exists and the packet holds a `goal.md`, copy its Objective and name that `goal.md` as `<file>`.
Leave the line out when `spec_folder` is `none` or empty, or when none of these texts exists.
After the line, say in your own words what this session works toward.
The line is copied and never reworded, so it reads the same after every hop.
A bound `goal.md` still binds the session goal, and the Purpose line says why that goal exists.
```

**Edit 2.** File `.skilled/hooks/session-relaunch/lib/nudge.cjs`. Search (lines 20-21):

```text
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
```

Replace with:

```text
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
// A Goal that each session writes from memory drifts a little on every hop, so the note
// opens it with a line copied from the packet, which no hop rewrites.
const GOAL_GUIDANCE = '   When spec_folder names a packet, open ## Goal with one line '
  + '`Purpose (<file>): <text>` that copies word for word the ### Purpose text of that '
  + 'packet\'s spec.md. When that text is empty or a template placeholder, copy the ### Purpose '
  + 'of the nearest parent folder whose spec.md has one and write `Purpose (from parent '
  + '<file>): <text>`. When neither exists and the packet holds a goal.md, copy its Objective. '
  + '<file> is the repo-relative path you copied from. Leave the line out when there is no '
  + 'such text. Then say what this session works toward.';
```

**Edit 3.** File `.skilled/hooks/session-relaunch/lib/nudge.cjs`. Search (lines 194-195):

```text
    SPEC_FOLDER_GUIDANCE,
    '   Under ## In-flight state include an `Active command:` line with the command, mode and '
```

Replace with:

```text
    SPEC_FOLDER_GUIDANCE,
    GOAL_GUIDANCE,
    '   Under ## In-flight state include an `Active command:` line with the command, mode and '
```

**Edit 4.** File `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`. Search (lines 58-59):

```text
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
```

Replace with:

```text
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
const GOAL_GUIDANCE_START = '   When spec_folder names a packet, open ## Goal with one line';
```

**Edit 5.** File `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`. Search (line 105, one line):

```text
  assert.equal(handoffLines[sectionLine + 2], SPEC_FOLDER_GUIDANCE);
```

Replace with:

```text
  assert.equal(handoffLines[sectionLine + 2], SPEC_FOLDER_GUIDANCE);
  const goalGuidance = handoffLines[sectionLine + 3];
  assert.ok(goalGuidance.startsWith(GOAL_GUIDANCE_START), text);
  for (const part of ['### Purpose', 'from parent', 'goal.md']) {
    assert.ok(goalGuidance.includes(part), `goal guidance misses ${part}`);
  }
```

**Edit 6.** File `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`. Search (line 139, one line):

```text
  assert.match(unbound, /^   spec_folder: $/m);
```

Replace with:

```text
  assert.match(unbound, /^   spec_folder: $/m);
  assert.ok(unbound.includes(GOAL_GUIDANCE_START), unbound);
```

Edit 5 is the happy path: a bound nudge carries the line in its fixed place with every fallback named. Edit 6 is the edge case: an unbound nudge still carries the line, because the line's own first words state the condition. The test count stays 89, since both edits add assertions to an existing test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command from the worktree root before Edit 1 and again after Edit 6. The baseline column is what this plan observed on 2026-11-13.

| Command | Baseline observed | Expected after |
|---------|-------------------|----------------|
| `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs; echo "EXIT=$?"` | `tests 89`, `pass 89`, `fail 0`, `EXIT=0` | `tests 89`, `pass 89`, `fail 0`, `EXIT=0` |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs; echo "EXIT=$?"` | `tests 1014`, `pass 1014`, `fail 0`, `EXIT=0` | `tests 1014`, `pass 1014`, `fail 0`, `EXIT=0` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh; echo "EXIT=$?"` | `PASS: 256 mirrors across 10 trees are in sync.`, `EXIT=0` | same |
| `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check; echo "EXIT=$?"` | `PASS: 45 prompts are in sync.`, `EXIT=0` | same |
| `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check; echo "EXIT=$?"` | `PASS: 45 prompt stubs are in sync.`, `EXIT=0` | same |
| `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check; echo "EXIT=$?"` | `PASS: 45 prompts are in sync.`, `EXIT=0` | same |
| The Measured Behavior command in `spec.md` | `nudge lines that say what Goal holds: 0` | `nudge lines that say what Goal holds: 1` |

Read the exit status with `echo "EXIT=$?"` straight after `node --test`, never after a pipe into `tail`, because the pipe reports the exit of `tail`.

A live check is optional and needs no repo change: run `/speckit:handoff` in a session bound to a packet and read the note's first Goal line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

Node.js for `node --test`, already used by the suite. No new package. No other child must land first.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a test in the session-relaunch suite fails after the edits, or `prepare` refuses a note it accepted before. Before commit, run `git checkout -- .skilled/commands/speckit/handoff.md .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs`. After commit, revert the one commit. No state or note format changes, so notes written meanwhile stay valid either way.
<!-- /ANCHOR:rollback -->

---
