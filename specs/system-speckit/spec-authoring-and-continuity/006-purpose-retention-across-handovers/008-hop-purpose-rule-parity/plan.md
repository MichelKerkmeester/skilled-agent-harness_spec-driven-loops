---
title: "Implementation Plan: Phase 8: hop-purpose-rule-parity"
description: "Nine literal search-and-replace edits in seven files that give the relaunch note and the resume brief the purpose rule and the three line shapes the helper already prints. The proof is two rg checks, the nudge test file and the command checks."
trigger_phrases:
  - "hop purpose rule parity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: hop-purpose-rule-parity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command doc, CommonJS for one string constant and one test line, YAML workflow assets and a text presentation file, all read by the model |
| **Framework** | The SpecKit command router in `.skilled/commands/speckit/` and the session-relaunch hook in `.skilled/hooks/session-relaunch/` |
| **Storage** | None |
| **Testing** | `node --test` for the relaunch tests, plain `node` for the phase workflow and mirror checks, `python3` with `yaml` and `rg` |

### Overview
Nine literal edits replace three purpose rules with one. E1 and E2 rewrite the Goal lines in `handoff.md`, E3 rewrites `GOAL_GUIDANCE` in `nudge.cjs` and E4 updates the assertion that pins it. E5 and E6 replace `purpose_row` in the two resume assets, E7 and E8 reword the presentation file and E9 pins the resume label in the command workflow test. The proof is the two Measured Behavior checks in `spec.md`, `nudge.test.cjs` at 89 passing tests, the command workflow test at 150 passes and the unchanged mirror checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 007 is built: `rg -c '^const PURPOSE_SECTION_HEADING' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` prints `1`
- [ ] The baseline commands in section 5 print the values recorded there
- [ ] Each search text in section 4 matches exactly once in its file (`rg -c -F`, or `rg -U -c -F` for E1 and E3, prints 1)

### Definition of Done
- [ ] All REQ rows in `spec.md` have evidence in `tasks.md`
- [ ] `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` prints `pass 89` and `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One rule, restated. Four existing texts take the helper's rule. No new file, command, option or dependency.

### Key Components
- **The Goal lines in `.skilled/commands/speckit/handoff.md` (lines 134 to 139)**: the rule a session follows when it writes a relaunch note. Today it copies the whole Purpose and has no scaffold skip.
- **`GOAL_GUIDANCE` in `.skilled/hooks/session-relaunch/lib/nudge.cjs` (lines 24 to 30)**: the same rule in short form, printed in the hand-over nudge.
- **`purpose_row` in both resume assets (auto line 139, confirm line 158)**: the rule a session follows for the Purpose row of the resume brief.
- **`speckit-resume-presentation.txt` (lines 118 and 128)**: the brief template and the sentence that names the row's label shapes.

### Data Flow
Nothing moves between these texts at run time. Each is read by a model at its own hop. The helper in `packet-purpose.ts` is the reference: its three shapes are printed by code after a compaction and stored by code on a continuity save, and after this phase the two model-written hops print the same three.

### The one rule
1. The line holds one sentence: the first sentence of the packet's purpose in its `spec.md`, copied word for word and cut to 300 characters.
2. The purpose is the paragraph under `### Purpose`. Without that heading it is the paragraph that opens with `Purpose:` inside the purpose section, or else that section's first paragraph.
3. An empty paragraph, `UNKNOWN`, a bracketed template placeholder and the scaffold sentence that begins `Keep parent documentation lean` are no purpose.
4. The packet's own purpose prints as `Purpose: <sentence>`.
5. With no own purpose, the nearest enclosing phase parent that has one prints as `Parent purpose (<repo-relative parent folder>): <sentence>`.
6. With neither, a `goal.md` Objective prints as `Goal objective: <sentence>`.
7. With none of the three, the line is left out.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline commands in section 5 and confirms each search text below matches once. Implementation applies E1 to E9 below, one per task in `tasks.md`. Verification reruns the baseline commands and the two Measured Behavior checks in `spec.md`. `tasks.md` owns the order and the task state.

Apply each edit as a literal search and replace with the Edit tool. Copy the text inside the fences exactly. All paths are relative to the worktree root. Each search text was counted on 2026-11-14 at `bd79708c2f` with `rg -c -F`, or `rg -U -c -F` where it spans lines, and each printed `1`.

### E1. Relaunch command doc, the three rule lines
File: `.skilled/commands/speckit/handoff.md` (lines 134 to 136). Count: 1 with `rg -U -c -F`. Three lines become four.

Search text:
```text
When `spec_folder` names a packet, open Goal with one line `Purpose (<file>): <text>` that copies word for word the `### Purpose` text of that packet's `spec.md`, where `<file>` is the repo-relative path you copied it from.
When that text is empty or still a template placeholder, copy the `### Purpose` of the nearest parent folder whose `spec.md` has one, and write the line as `Purpose (from parent <file>): <text>`.
When no such text exists and the packet holds a `goal.md`, copy its Objective and name that `goal.md` as `<file>`.
```
Replacement:
```text
When `spec_folder` names a packet, open Goal with the packet's purpose line, `Purpose: <sentence>`, where `<sentence>` is the first sentence of that packet's purpose in its `spec.md`, copied word for word and cut to 300 characters.
The purpose is the paragraph under `### Purpose`. In a `spec.md` without that heading it is the paragraph that opens with `Purpose:` inside the `## PROBLEM & PURPOSE`, `## PURPOSE` or `## ROOT PURPOSE` section, or else that section's opening paragraph.
When that text is empty, `UNKNOWN`, still a template placeholder or the scaffold sentence that begins `Keep parent documentation lean`, use the nearest enclosing phase parent that has a purpose and write the line as `Parent purpose (<parent folder>): <sentence>`, where `<parent folder>` is that parent's repo-relative folder.
When no such text exists and the packet holds a `goal.md`, quote its Objective the same way and write the line as `Goal objective: <sentence>`.
```

### E2. Relaunch command doc, the line that says why it is copied
File: `.skilled/commands/speckit/handoff.md` (line 139). Count: 1.

Search text:
```text
The line is copied and never reworded, so it reads the same after every hop.
```
Replacement:
```text
The line is copied and never reworded, and the resume brief, the context recovered after a compaction and the continuity save print the same three shapes, so it reads the same after every hop.
```

### E3. Relaunch nudge, `GOAL_GUIDANCE`
File: `.skilled/hooks/session-relaunch/lib/nudge.cjs` (lines 24 to 30). Count: 1 with `rg -U -c -F`. The string still opens with the words `GOAL_GUIDANCE_START` in the test file checks. Each phrase a check greps for sits inside one source line.

Search text:
```text
const GOAL_GUIDANCE = '   When spec_folder names a packet, open ## Goal with one line '
  + '`Purpose (<file>): <text>` that copies word for word the ### Purpose text of that '
  + 'packet\'s spec.md. When that text is empty or a template placeholder, copy the ### Purpose '
  + 'of the nearest parent folder whose spec.md has one and write `Purpose (from parent '
  + '<file>): <text>`. When neither exists and the packet holds a goal.md, copy its Objective. '
  + '<file> is the repo-relative path you copied from. Leave the line out when there is no '
  + 'such text. Then say what this session works toward.';
```
Replacement:
```text
const GOAL_GUIDANCE = '   When spec_folder names a packet, open ## Goal with one line '
  + '`Purpose: <sentence>`, where <sentence> is the first sentence of that packet\'s purpose in '
  + 'its spec.md, copied word for word and cut to 300 characters. Read it under ### Purpose, or '
  + 'without that heading in the paragraph that opens with Purpose: inside the ## PROBLEM & '
  + 'PURPOSE section, or else that section\'s opening paragraph. When it is empty, a template '
  + 'placeholder or the scaffold sentence that begins Keep parent documentation lean, use the '
  + 'nearest phase parent that has one and write `Parent purpose (<parent folder>): <sentence>`. '
  + 'When neither exists and the packet holds a goal.md, write `Goal objective: <sentence>` from '
  + 'its Objective. Leave the line out when there is no such text. Then say what this session '
  + 'works toward.';
```

### E4. Relaunch nudge test, the pinned substrings
File: `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` (line 109). Count: 1. The old list holds `from parent`, which E3 removes, so the test fails without this edit. The new list pins both labels and the scaffold skip.

Search text:
```text
  for (const part of ['### Purpose', 'from parent', 'goal.md']) {
```
Replacement:
```text
  for (const part of ['### Purpose', 'Parent purpose (', 'Goal objective:', 'Keep parent documentation lean']) {
```

### E5. Resume auto asset, `purpose_row`
File: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 139). Count: 1. One whole line, indented two spaces.

Search text:
```text
  purpose_row: "Quote one sentence, the first, from the packet's own spec.md ### Purpose. When that Purpose is empty, still a bracketed template placeholder or the scaffold sentence that begins Keep parent documentation lean, and the packet is a phase child, quote the nearest ancestor phase parent's Purpose instead and label the row Purpose (parent <parent-folder-name>). Skip an ancestor whose Purpose is empty, a placeholder or the scaffold sentence that begins Keep parent documentation lean. When no Purpose text is found and packet_goal.read found a goal.md, quote its Objective and label the row Purpose (goal.md). When none of these exists, omit the row. Never print None or a placeholder."
```
Replacement:
```text
  purpose_row: "Quote one sentence, the first sentence of the packet's own purpose in its spec.md, cut to 300 characters, as the row Purpose: <sentence>. Read the purpose under ### Purpose. In a spec.md without that heading, read the paragraph that opens with Purpose: inside the ## PROBLEM & PURPOSE, ## PURPOSE or ## ROOT PURPOSE section, or else that section's opening paragraph. When that text is empty, UNKNOWN, still a bracketed template placeholder or the scaffold sentence that begins Keep parent documentation lean, and the packet is a phase child, quote the nearest ancestor phase parent's purpose instead and write the row as Parent purpose (<repo-relative parent folder>): <sentence>. Skip an ancestor whose purpose is empty, a placeholder or that scaffold sentence. When no purpose text is found and packet_goal.read found a goal.md, quote its Objective the same way and write the row as Goal objective: <sentence>. When none of these exists, omit the row. Never print None or a placeholder."
```

### E6. Resume confirm asset, `purpose_row`
File: `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` (line 158). Count: 1. Same search text and same replacement as E5.

### E7. Resume presentation file, the Purpose row
File: `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` (line 118). Count: 1. The row label stays `Purpose`, so phase 006's brief-row check still reads the same ten labels.

Search text:
```text
Purpose: [one sentence quoted from spec.md ### Purpose, omitted when none]
```
Replacement:
```text
Purpose: [opening sentence of the packet's purpose in spec.md, omitted when none]
```

### E8. Resume presentation file, the label shapes
File: `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` (line 128). Count: 1.

Search text:
```text
The Purpose row quotes the packet's own spec.md Purpose. A phase child with no Purpose of its own shows its nearest phase parent's as `Purpose (parent <parent-folder-name>): [sentence]`. A packet with only a goal.md Objective shows `Purpose (goal.md): [sentence]`. When none exists the row is left out, never printed as None.
```
Replacement:
```text
The Purpose row quotes the opening sentence of the packet's own spec.md purpose. A phase child with no purpose of its own shows its nearest phase parent's as `Parent purpose (<repo-relative parent folder>): [sentence]`. A packet with only a goal.md Objective shows `Goal objective: [sentence]`. The relaunch note, the context recovered after a compaction and the continuity save print the same three shapes. When none exists the row is left out, never printed as None.
```

### E9. Command workflow test, pin the resume `purpose_row` label
File: `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` (lines 135 to 139, inside `testAssetPhaseFolderNotes`). Count: 1 with `rg -U -c -F`. The loop already reads both resume assets. The new assertion runs once per resume asset, so the test prints two more passes: `Result: passed=150 failed=0`. Without it, a later edit can bring back a fourth label shape in `purpose_row` and no check notices. Apply it after E5 and E6, because before them the assets do not hold the new label and the assertion fails.

Search text:
```text
      hasPhaseFolderContract,
      `${yaml} includes phase-folder/phase-child contract`
    );
  }
}
```
Replacement:
```text
      hasPhaseFolderContract,
      `${yaml} includes phase-folder/phase-child contract`
    );

    if (yaml.startsWith('speckit-resume-')) {
      assertTrue(
        text.includes('purpose_row:') && text.includes('Parent purpose (<repo-relative parent folder>)'),
        `${yaml} keeps the shared purpose label shape in purpose_row`
      );
    }
  }
}
```

None of these edits was applied at planning time. The texts are prose, one string constant and one test assertion, and the checks in section 5 read them with `rg` and `node`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command below from the worktree root before E1 and again after E9. The first two baselines were run for this plan on 2026-11-14. The others are the values phases 002 and 003 recorded when they built these files, because this planning session could not start `node` or `python3`.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| The first Measured Behavior command in `spec.md` | twelve lines with five shapes | twelve lines, each `Parent purpose (` or `Goal objective:`, two per file |
| The second Measured Behavior command in `spec.md` | `1` for both resume assets and for `packet-purpose.ts`, no line for `handoff.md` or `nudge.cjs` | `1` for each of the five files |
| `rg -c -F 'first sentence' .skilled/commands/speckit/handoff.md .skilled/hooks/session-relaunch/lib/nudge.cjs` | no output | `1` for each file |
| `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs; echo "EXIT=$?"` | `pass 89`, `fail 0`, `EXIT=0` | unchanged |
| `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs; echo "EXIT=$?"` | `pass 1014`, `fail 0`, `EXIT=0` | unchanged |
| `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('yaml ok')" .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | `yaml ok`, exit 0 | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | `Result: passed=148 failed=0`, exit 0 | `Result: passed=150 failed=0`, exit 0, after E9 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh; echo "EXIT=$?"` | `PASS: 256 mirrors across 10 trees are in sync.`, `EXIT=0` | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check; echo "EXIT=$?"` | `PASS: 45 prompts are in sync.`, `EXIT=0` | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check; echo "EXIT=$?"` | `PASS: 45 prompt stubs are in sync.`, `EXIT=0` | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check; echo "EXIT=$?"` | `PASS: 45 prompts are in sync.`, `EXIT=0` | unchanged |

Read the exit status with `echo "EXIT=$?"` straight after `node --test`, never after a pipe, because a pipe reports the exit of its last command.

A baseline that prints something other than the value in this table stops the phase before E1. Report the difference and do not edit.

Run the full relaunch suite with `env -u AI_SESSION_CHILD` as written. A dispatched worker runs with `AI_SESSION_CHILD=1`, and with that variable set the relaunch hook turns itself off and the suite prints `pass 957` and `fail 57`. Measured 2026-11-14 in this worktree: 1014 of 1014 without the variable, 957 of 1014 with it.

What no check proves: that a model following the new rule prints the line in the exact shape. That needs a live `/speckit:resume` and a live `/speckit:handoff`, which only an operator session can run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`node`, `python3` with the `yaml` module and `rg`. No new package and no build.

Phase 007 comes first. The resume assets and `handoff.md` have one copy each under `.skilled/commands/speckit/`, and the four mirror checks confirm the runtime trees after the edits. Phase 006 edits the `reply_format` line above `purpose_row`, a different line, so the two phases can land in either order.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: `nudge.test.cjs` prints a `fail` count above 0, the YAML load fails or a mirror check loses its `PASS` line. Before commit, run `git checkout -- <file>` for the seven files in section 4. After commit, revert that one commit. No build is involved.
<!-- /ANCHOR:rollback -->

---
