---
title: "Implementation Plan: Phase 2: resume-purpose-row"
description: "Add a one-sentence Purpose row to the /speckit:resume brief through text edits to the two resume workflow YAML assets and the presentation file, and add spec.md to the resume read order so the row has a source."
trigger_phrases:
  - "resume purpose row plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: resume-purpose-row

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets and a plain-text presentation contract, read by the model at run time |
| **Framework** | The SpecKit command router in `.skilled/commands/speckit/` |
| **Storage** | None |
| **Testing** | `node --test` for the goal-offer contract test, plain `node` for the phase workflow test, `python3` with `yaml.safe_load`, `rg` asserts and the runtime mirror check scripts |

### Overview
Ten literal search-and-replace edits across three files add the Purpose row and put `spec.md` in the resume read order. The brief is written by the model from these instructions, so no code changes and no code renders the row. The proof is the asset text checked with `rg`, the two existing command tests, a YAML load, the mirror checks and one live resume on a filled packet and one on a phase child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline commands in section 5 print the numbers recorded there
- [ ] Each "Current text" block in section 4 matches exactly once in its file (`rg -F -c` prints 1)
- [ ] `git status --short .skilled/commands/speckit/` prints nothing before the first edit

### Definition of Done
- [ ] All REQ rows in `spec.md` have evidence in `tasks.md`
- [ ] The goal-offer test prints `pass 5` and `fail 0`. The phase workflow test prints `passed=148 failed=0`. The four mirror checks print PASS with exit 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Instruction-only workflow edit. The router `.skilled/commands/speckit/resume.md` loads one YAML asset and the presentation file. The model follows them and writes the brief.

### Key Components
- **`speckit-resume-auto.yaml` and `speckit-resume-confirm.yaml`**: own the read order (`context_loading_priority`, step 2 activities) and the brief's fields (`confidence_framework.reply_format`). Without a Purpose field here the model has no instruction to print one.
- **`speckit-resume-presentation.txt`**: owns the visible Resume Brief template. Without a Purpose line here the shown layout contradicts the YAML.

### Data Flow
The workflow resolves the spec folder, and a phase parent redirects to its active child. Step 2 reads `spec.md` and takes the first sentence of `### Purpose`. When that text is empty or a bracketed placeholder and the folder is a phase child, it reads the nearest phase parent's `spec.md`. When no Purpose text exists, it uses the Objective from the goal.md that `packet_goal.read` already reads. The present step prints the sentence as the Purpose row under `Spec:`, or leaves the row out.

### Purpose row rule (the text E2 and E6 install)
- Own Purpose found: `Purpose: <first sentence>`
- Phase child with an empty or placeholder Purpose: `Purpose (parent 006-purpose-retention-across-handovers): <first sentence of the parent's Purpose>`
- Only a goal.md Objective: `Purpose (goal.md): <objective>`
- None of these: no row, never `None`
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline commands in section 5 and confirms each current text below matches once. Implementation applies edits E1 to E10 below, one per task in `tasks.md`. E11 is a later edit made after the first live check. Verification reruns the baseline commands, the `rg` asserts and two live resumes. `tasks.md` owns the order and the task state.

Apply each edit as a literal search and replace with the Edit tool. Copy the text inside the fences exactly. Every current text below matches exactly once in its file. All paths are relative to the repository root.

### E1. Auto asset, read order gains spec.md
File: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 92)

Current text:
```text
"Primary: supporting spec docs (tasks/plan/decision-record/resource-map)"
```
Replacement:
```text
"Primary: supporting spec docs (spec/tasks/plan/decision-record/resource-map)"
```

### E2. Auto asset, Purpose field and rule
File: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 138). The current text is one whole line. The replacement is two lines, both indented two spaces.

Current text:
```text
  reply_format: ["Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
```
Replacement:
```text
  reply_format: ["Purpose (omit when none)", "Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
  purpose_row: "Quote one sentence, the first, from the packet's own spec.md ### Purpose. When that Purpose is empty or still a bracketed template placeholder and the packet is a phase child, quote the nearest ancestor phase parent's Purpose instead and label the row Purpose (parent <parent-folder-name>). Skip an ancestor whose Purpose is empty, a placeholder or the scaffold sentence that begins Keep parent documentation lean. When no Purpose text is found and packet_goal.read found a goal.md, quote its Objective and label the row Purpose (goal.md). When none of these exists, omit the row. Never print None or a placeholder."
```

### E3. Auto asset, step 2 reads spec.md and always reads the Purpose
File: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 164). The current text is one whole line. The replacement is two lines, both indented six spaces. The second line must hold no colon followed by a space, or YAML reads it as a map.

Current text:
```text
      - Read supporting spec docs (`tasks.md`, `acceptance-criteria.md`, `plan.md`, `decision-record.md`, `resource-map.md`) before running any search
```
Replacement:
```text
      - Read supporting spec docs (`spec.md`, `tasks.md`, `acceptance-criteria.md`, `plan.md`, `decision-record.md`, `resource-map.md`) before running any search
      - Always read the Purpose for the brief, even when handover.md already answers the essentials. Open spec.md and open an ancestor phase parent's spec.md only when confidence_framework.purpose_row sends you there
```

### E4. Auto asset, step 4 shows the row
File: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 185)

Current text:
```text
Show Now/Last confirmed/Next safe action/Blockers
```
Replacement:
```text
Show Purpose/Now/Last confirmed/Next safe action/Blockers
```

### E5. Confirm asset, read order gains spec.md
File: `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` (line 93). Same text as E1.

Current text:
```text
"Primary: supporting spec docs (tasks/plan/decision-record/resource-map)"
```
Replacement:
```text
"Primary: supporting spec docs (spec/tasks/plan/decision-record/resource-map)"
```

### E6. Confirm asset, Purpose field and rule
File: `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` (line 157). Same text as E2. The line after it, `escalation: ...`, differs from the auto asset and stays as it is.

Current text:
```text
  reply_format: ["Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
```
Replacement:
```text
  reply_format: ["Purpose (omit when none)", "Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
  purpose_row: "Quote one sentence, the first, from the packet's own spec.md ### Purpose. When that Purpose is empty or still a bracketed template placeholder and the packet is a phase child, quote the nearest ancestor phase parent's Purpose instead and label the row Purpose (parent <parent-folder-name>). Skip an ancestor whose Purpose is empty, a placeholder or the scaffold sentence that begins Keep parent documentation lean. When no Purpose text is found and packet_goal.read found a goal.md, quote its Objective and label the row Purpose (goal.md). When none of these exists, omit the row. Never print None or a placeholder."
```

### E7. Confirm asset, step 2 always reads the Purpose
File: `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` (line 188). This step already walks the full ladder, which lists `spec.md` at line 114, so only the Purpose line is added after it. The current line stays as it is.

Current text:
```text
      - Walk the continuity ladder for the resolved spec folder: handover.md, then _memory.continuity, then the packet-first spec docs
```
Replacement:
```text
      - Walk the continuity ladder for the resolved spec folder: handover.md, then _memory.continuity, then the packet-first spec docs
      - Always read the Purpose for the brief, even when handover.md already answers the essentials. Open spec.md and open an ancestor phase parent's spec.md only when confidence_framework.purpose_row sends you there
```

### E8. Confirm asset, step 5 shows the row
File: `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` (line 228)

Current text:
```text
Show Now/Last confirmed/Next safe action/Blockers
```
Replacement:
```text
Show Purpose/Now/Last confirmed/Next safe action/Blockers
```

### E9. Presentation file, Purpose line in the Resume Brief
File: `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` (lines 116 and 117). The current text is two whole lines. The replacement is three.

Current text:
```text
RESUME BRIEF
Spec: [path]
```
Replacement:
```text
RESUME BRIEF
Spec: [path]
Purpose: [one sentence quoted from spec.md ### Purpose, omitted when none]
```

### E10. Presentation file, note on the label variants
File: `.skilled/commands/speckit/assets/speckit-resume-presentation.txt` (lines 124 and 125, the last brief line and the closing fence). The replacement keeps both lines and adds a blank line and one paragraph after the fence.

Current text:
````text
Why this is next: [short reason based on tasks/checklist/memory]
```
````
Replacement:
````text
Why this is next: [short reason based on tasks/checklist/memory]
```

The Purpose row quotes the packet's own spec.md Purpose. A phase child with no Purpose of its own shows its nearest phase parent's as `Purpose (parent <parent-folder-name>): [sentence]`. A packet with only a goal.md Objective shows `Purpose (goal.md): [sentence]`. When none exists the row is left out, never printed as None. The rule is `purpose_row` in both resume workflow YAML assets.
````

### E11. Both YAML assets, the `purpose_row` rule names the scaffold sentence for the packet itself
Added 2026-11-14 after an agent-followed resume check. The rule named the scaffold sentence only when skipping an ancestor, so a phase child whose own Purpose is that sentence was not sent to its parent. The edit applies to `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 139) and `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml`, in the `purpose_row` line, once in each file.

Current text:
```text
When that Purpose is empty or still a bracketed template placeholder and the packet is a phase child,
```
Replacement:
```text
When that Purpose is empty, still a bracketed template placeholder or the scaffold sentence that begins Keep parent documentation lean, and the packet is a phase child,
```

These ten edits (E1 to E10) were applied to scratch copies of the three files before this plan was written. Both YAML copies loaded with `yaml.safe_load`, the new step 2 line loaded as a string, `reply_format[0]` read `Purpose (omit when none)` and the goal-offer test's stale-path pattern matched none of the three copies.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run every command below from the repository root before E1 and again after E10. The baseline column holds what each printed on 2026-11-13 in this worktree.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | `tests 5`, `pass 5`, `fail 0`, exit 0 | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | `Result: passed=148 failed=0`, exit 0 | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | `PASS: 256 mirrors across 10 trees are in sync.`, exit 0 | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` | `PASS: 45 prompts are in sync.`, exit 0 | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` | `PASS: 45 prompts are in sync.`, exit 0 | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check` | `PASS: 45 prompt stubs are in sync.`, exit 0 | unchanged |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK command-catalog-mirror ...`, exit 0 | unchanged |
| `node .skilled/commands/scripts/validate-command-references.cjs` | `FAIL  4 unresolved command reference(s)`, all four in `doctor` assets naming `skill-graph.sqlite`, exit 1 | the same 4 and no new one |
| `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('yaml ok')" .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | `yaml ok`, exit 0 | unchanged |
| The Measured Behavior command in `spec.md` | `reply_format` starts with `"Confidence: NN%"`, the order lines read `(tasks/plan/...)` and the last `rg -c` prints nothing with exit 1 | `reply_format` starts with `"Purpose (omit when none)"`, the order lines read `(spec/tasks/plan/...)` and the last `rg -c` prints 2 with exit 0 |

The four mirror check commands are the same checkers `/doctor:runtime-mirrors` runs (`.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` lines 143 to 154). Running the command itself is the wider equivalent.

What no check proves: the brief is model-written from these instructions and no test renders it. The strongest automated proof is the `rg` asserts on the asset text in `tasks.md`. The live proof is T019 and T020, a `/speckit:resume ... :auto` run on a packet with a filled Purpose and on a phase child whose Purpose is a placeholder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`node`, `python3` with the `yaml` module and `rg`. No new package.

Mirrors need no regeneration. `.opencode/commands/speckit` is a symlink to `.skilled/commands/speckit`. `.claude/commands/speckit/resume.md` and `.cursor/commands/speckit-resume.md` are symlinks to `.skilled/commands/speckit/resume.md`. `.codex/prompts/speckit-resume.md`, `.pi/prompts/speckit-resume.md` and `.dsh/prompts/speckit-resume.md` are generated stubs that point at `.skilled/commands/speckit/resume.md` and copy no asset. `find` over the repository, specs excluded, found one copy of each resume asset, under `.skilled/commands/speckit/assets/`. The mirror checks in section 5 confirm the state after the edits.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a test or check in section 5 changes from its baseline, or a live resume prints `None` or a placeholder in the Purpose row. Before commit, run `git checkout -- .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml .skilled/commands/speckit/assets/speckit-resume-presentation.txt`. After commit, revert that one commit.
<!-- /ANCHOR:rollback -->

---
