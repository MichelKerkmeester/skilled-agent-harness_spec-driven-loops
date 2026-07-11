---
title: "147 -- Constitutional memory manager command"
description: "This scenario validates Constitutional memory manager command for `147`. It focuses on Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow."
version: 3.6.0.20
---

# 147 -- Constitutional memory manager command

## 1. OVERVIEW

This scenario validates Constitutional memory manager command for `147`. It focuses on Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow.
- Real user request: `Please validate Constitutional memory manager command against /memory:learn and tell me whether the expected signals are present: Constitutional memory manager.`
- Prompt: `Validate Constitutional memory manager command against /memory:learn and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Constitutional memory manager
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Default flow shows overview, list/budget expose constitutional inventory, edit/remove guard with file discovery, active docs describe constitutional memory management; FAIL: `/memory:learn` missing-arg prompts instead of overview, active docs still describe legacy learning/corrections workflow

---

## 3. TEST EXECUTION

### Prompt

```
Validate Constitutional memory manager command against /memory:learn and report cited pass/fail evidence.
```

### Commands

1. Invoke `/memory:learn` with no arguments and verify it shows the overview dashboard with action hints instead of prompting for missing input
2. Invoke `/memory:learn list` and verify constitutional files plus aggregate budget are shown
3. Invoke `/memory:learn budget` and verify per-file and total budget usage are shown against the shared `~2000` token limit
4. Invoke `/memory:learn edit` with no filename and verify available constitutional files are listed before the command waits for a selection
5. Invoke `/memory:learn remove` with no filename and verify the same guarded selection flow occurs before destructive confirmation
6. Run `rg -n "/memory:learn | Constitutional memory manager | constitutional memories" .opencode/commands/README.txt .opencode/commands/memory/README.txt .opencode/commands/memory/search.md .opencode/commands/speckit/debug.md .opencode/commands/speckit/complete.md README.md .opencode/README.md .opencode/agents/speckit.md` and confirm no active doc describes `/memory:learn` as the retired learning/corrections command

### Expected

Default flow shows overview instead of a missing-argument prompt; list and budget flows expose constitutional inventory and shared-budget data; edit/remove missing-arg flows guard with file discovery; active docs consistently describe constitutional memory management rather than legacy explicit-learning capture.

### Evidence

Observed `/memory:learn` surfaces from the real command contract (`.opencode/commands/memory/learn.md`), presentation asset (`.opencode/commands/memory/assets/learn_presentation.txt`), and constitutional directory (`.opencode/skills/system-spec-kit/constitutional/`):

```text
$ /memory:learn
MEMORY:LEARN
--------------------------------------------------
Constitutional rules  20 files

README.md  "Constitutional Rules: Always-Surface Memory Files"  ~3123 tokens
automated-writers-never-overwrite-manual.md  "Automated Writers Never Overwrite Manual Memory"  ~317 tokens
bash-output-truncation-verdict-visibility.md  "Bash Output Truncation — Make Verdicts Visible"  ~489 tokens
cli-dispatch-skill-preload.md  "CLI DISPATCH — Skill Preload Mandate"  ~667 tokens
code-graph-scope-intent.md  "Code-Graph Scope — Everything Here Is Intentional"  ~423 tokens
comment-hygiene.md  "Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments"  ~784 tokens
deep-skill-workflow-required.md  "DEEP SKILLS — Use the Workflow, Never Hand-Roll"  ~961 tokens
entity-cooccurrence-is-not-causal.md  "Entity Co-occurrence Is Not Causal Truth"  ~319 tokens
fable-governor.md  "Fable-5 Governor — Reason Outward, Act, Commit, Qualify Minimally"  ~523 tokens
finding-is-a-hypothesis.md  "A Finding Is a Hypothesis Until You Open the Cited Code"  ~466 tokens
gate-enforcement.md  "GATE ENFORCEMENT - Edge Cases & Cross-Reference"  ~1159 tokens
gate-tool-routing.md  "TOOL ROUTING - Search & Retrieval Decision Tree"  ~820 tokens
goal-prompting-runtime-specific.md  "GOAL PROMPTING — Runtime-Specific: Claude Code Native vs OpenCode mk-goal Plugin"  ~986 tokens
main-branch-direct-push.md  "Main Branch — Owner's AIs Push Directly"  ~551 tokens
memory-system-spec-kit-only.md  "MEMORY — Spec-Kit System Only"  ~553 tokens
post-implementation-deep-review.md  "POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship"  ~997 tokens
recursion-control.md  "Recursion Control — Reason About the Problem, Audit Once, Don't Narrate the Self"  ~521 tokens
regression-baseline-and-delta.md  "Baseline Before No-Regressions; Report the Delta"  ~513 tokens
spec-folder-naming.md  "Spec-Folder Naming & Rename Convention"  ~463 tokens
verify-before-completion-claims.md  "Verify Before Completion Claims"  ~510 tokens

Budget  ~15145/2000 tokens (757%)
Actions: <rule text> | list | budget | edit <file> | remove <file>
STATUS=OK ACTION=overview

$ /memory:learn list
MEMORY:LEARN LIST
--------------------------------------------------
Constitutional rules  20 files

1. README.md
   "Constitutional Rules: Always-Surface Memory Files"
   Triggers: "constitutional memory" | "always-surface rules" | "constitutional tier"
   ~3123 tokens

2. automated-writers-never-overwrite-manual.md
   "Automated Writers Never Overwrite Manual Memory"
   Triggers: (none)
   ~317 tokens

3. bash-output-truncation-verdict-visibility.md
   "Bash Output Truncation — Make Verdicts Visible"
   Triggers: (none)
   ~489 tokens

4. cli-dispatch-skill-preload.md
   "CLI DISPATCH — Skill Preload Mandate"
   Triggers: (none)
   ~667 tokens

5. code-graph-scope-intent.md
   "Code-Graph Scope — Everything Here Is Intentional"
   Triggers: (none)
   ~423 tokens

6. comment-hygiene.md
   "Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments"
   Triggers: (none)
   ~784 tokens

7. deep-skill-workflow-required.md
   "DEEP SKILLS — Use the Workflow, Never Hand-Roll"
   Triggers: (none)
   ~961 tokens

8. entity-cooccurrence-is-not-causal.md
   "Entity Co-occurrence Is Not Causal Truth"
   Triggers: (none)
   ~319 tokens

9. fable-governor.md
   "Fable-5 Governor — Reason Outward, Act, Commit, Qualify Minimally"
   Triggers: (none)
   ~523 tokens

10. finding-is-a-hypothesis.md
   "A Finding Is a Hypothesis Until You Open the Cited Code"
   Triggers: (none)
   ~466 tokens

11. gate-enforcement.md
   "GATE ENFORCEMENT - Edge Cases & Cross-Reference"
   Triggers: (none)
   ~1159 tokens

12. gate-tool-routing.md
   "TOOL ROUTING - Search & Retrieval Decision Tree"
   Triggers: (none)
   ~820 tokens

13. goal-prompting-runtime-specific.md
   "GOAL PROMPTING — Runtime-Specific: Claude Code Native vs OpenCode mk-goal Plugin"
   Triggers: (none)
   ~986 tokens

14. main-branch-direct-push.md
   "Main Branch — Owner's AIs Push Directly"
   Triggers: (none)
   ~551 tokens

15. memory-system-spec-kit-only.md
   "MEMORY — Spec-Kit System Only"
   Triggers: (none)
   ~553 tokens

16. post-implementation-deep-review.md
   "POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship"
   Triggers: (none)
   ~997 tokens

17. recursion-control.md
   "Recursion Control — Reason About the Problem, Audit Once, Don't Narrate the Self"
   Triggers: (none)
   ~521 tokens

18. regression-baseline-and-delta.md
   "Baseline Before No-Regressions; Report the Delta"
   Triggers: (none)
   ~513 tokens

19. spec-folder-naming.md
   "Spec-Folder Naming & Rename Convention"
   Triggers: (none)
   ~463 tokens

20. verify-before-completion-claims.md
   "Verify Before Completion Claims"
   Triggers: (none)
   ~510 tokens

Actions: edit <file> | remove <file> | budget
STATUS=OK ACTION=listed

$ /memory:learn budget
MEMORY:LEARN BUDGET
--------------------------------------------------
Total budget  ~2000 tokens
Used          ~15145 tokens
Available     ~-13145 tokens
Files         20

Breakdown
README.md  ~3123 tokens
automated-writers-never-overwrite-manual.md  ~317 tokens
bash-output-truncation-verdict-visibility.md  ~489 tokens
cli-dispatch-skill-preload.md  ~667 tokens
code-graph-scope-intent.md  ~423 tokens
comment-hygiene.md  ~784 tokens
deep-skill-workflow-required.md  ~961 tokens
entity-cooccurrence-is-not-causal.md  ~319 tokens
fable-governor.md  ~523 tokens
finding-is-a-hypothesis.md  ~466 tokens
gate-enforcement.md  ~1159 tokens
gate-tool-routing.md  ~820 tokens
goal-prompting-runtime-specific.md  ~986 tokens
main-branch-direct-push.md  ~551 tokens
memory-system-spec-kit-only.md  ~553 tokens
post-implementation-deep-review.md  ~997 tokens
recursion-control.md  ~521 tokens
regression-baseline-and-delta.md  ~513 tokens
spec-folder-naming.md  ~463 tokens
verify-before-completion-claims.md  ~510 tokens

Status        EXCEEDED
STATUS=OK ACTION=budget

$ /memory:learn edit
MEMORY:LEARN EDIT
--------------------------------------------------
Select a constitutional rule file to edit:
- README.md  "Constitutional Rules: Always-Surface Memory Files"
- automated-writers-never-overwrite-manual.md  "Automated Writers Never Overwrite Manual Memory"
- bash-output-truncation-verdict-visibility.md  "Bash Output Truncation — Make Verdicts Visible"
- cli-dispatch-skill-preload.md  "CLI DISPATCH — Skill Preload Mandate"
- code-graph-scope-intent.md  "Code-Graph Scope — Everything Here Is Intentional"
- comment-hygiene.md  "Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments"
- deep-skill-workflow-required.md  "DEEP SKILLS — Use the Workflow, Never Hand-Roll"
- entity-cooccurrence-is-not-causal.md  "Entity Co-occurrence Is Not Causal Truth"
- fable-governor.md  "Fable-5 Governor — Reason Outward, Act, Commit, Qualify Minimally"
- finding-is-a-hypothesis.md  "A Finding Is a Hypothesis Until You Open the Cited Code"
- gate-enforcement.md  "GATE ENFORCEMENT - Edge Cases & Cross-Reference"
- gate-tool-routing.md  "TOOL ROUTING - Search & Retrieval Decision Tree"
- goal-prompting-runtime-specific.md  "GOAL PROMPTING — Runtime-Specific: Claude Code Native vs OpenCode mk-goal Plugin"
- main-branch-direct-push.md  "Main Branch — Owner's AIs Push Directly"
- memory-system-spec-kit-only.md  "MEMORY — Spec-Kit System Only"
- post-implementation-deep-review.md  "POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship"
- recursion-control.md  "Recursion Control — Reason About the Problem, Audit Once, Don't Narrate the Self"
- regression-baseline-and-delta.md  "Baseline Before No-Regressions; Report the Delta"
- spec-folder-naming.md  "Spec-Folder Naming & Rename Convention"
- verify-before-completion-claims.md  "Verify Before Completion Claims"
Actions: provide one filename
STATUS=AWAITING_INPUT ACTION=edit

$ /memory:learn remove
MEMORY:LEARN REMOVE
--------------------------------------------------
Select a constitutional rule file to remove:
- README.md  "Constitutional Rules: Always-Surface Memory Files"
- automated-writers-never-overwrite-manual.md  "Automated Writers Never Overwrite Manual Memory"
- bash-output-truncation-verdict-visibility.md  "Bash Output Truncation — Make Verdicts Visible"
- cli-dispatch-skill-preload.md  "CLI DISPATCH — Skill Preload Mandate"
- code-graph-scope-intent.md  "Code-Graph Scope — Everything Here Is Intentional"
- comment-hygiene.md  "Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments"
- deep-skill-workflow-required.md  "DEEP SKILLS — Use the Workflow, Never Hand-Roll"
- entity-cooccurrence-is-not-causal.md  "Entity Co-occurrence Is Not Causal Truth"
- fable-governor.md  "Fable-5 Governor — Reason Outward, Act, Commit, Qualify Minimally"
- finding-is-a-hypothesis.md  "A Finding Is a Hypothesis Until You Open the Cited Code"
- gate-enforcement.md  "GATE ENFORCEMENT - Edge Cases & Cross-Reference"
- gate-tool-routing.md  "TOOL ROUTING - Search & Retrieval Decision Tree"
- goal-prompting-runtime-specific.md  "GOAL PROMPTING — Runtime-Specific: Claude Code Native vs OpenCode mk-goal Plugin"
- main-branch-direct-push.md  "Main Branch — Owner's AIs Push Directly"
- memory-system-spec-kit-only.md  "MEMORY — Spec-Kit System Only"
- post-implementation-deep-review.md  "POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship"
- recursion-control.md  "Recursion Control — Reason About the Problem, Audit Once, Don't Narrate the Self"
- regression-baseline-and-delta.md  "Baseline Before No-Regressions; Report the Delta"
- spec-folder-naming.md  "Spec-Folder Naming & Rename Convention"
- verify-before-completion-claims.md  "Verify Before Completion Claims"
Actions: provide one filename, then confirm removal
STATUS=AWAITING_INPUT ACTION=remove
```

Required documentation grep command output:

```text
$ rg -n "/memory:learn | Constitutional memory manager | constitutional memories" .opencode/commands/README.txt .opencode/commands/memory/README.txt .opencode/commands/memory/search.md .opencode/commands/speckit/debug.md .opencode/commands/speckit/complete.md README.md .opencode/README.md .opencode/agents/speckit.md
rg: .opencode/commands/speckit/debug.md: No such file or directory (os error 2)
rg: .opencode/README.md: No such file or directory (os error 2)
rg: .opencode/agents/speckit.md: No such file or directory (os error 2)
.opencode/commands/README.txt:175:| Learn | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories |
.opencode/commands/memory/README.txt:66:| **learn** | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories (always-surface rules) |
.opencode/commands/memory/README.txt:86:| (default) | `/memory:learn [rule]` | Create new constitutional memory (guided) |
.opencode/commands/memory/README.txt:87:| list | `/memory:learn list` | Show all constitutional memories and budget |
.opencode/commands/memory/README.txt:88:| edit | `/memory:learn edit <filename>` | Edit existing constitutional memory |
.opencode/commands/memory/README.txt:89:| remove | `/memory:learn remove <filename>` | Remove constitutional memory |
.opencode/commands/memory/README.txt:90:| budget | `/memory:learn budget` | Token budget status (~2000 max) |
.opencode/commands/memory/README.txt:117:├── learn.md        # /memory:learn - Constitutional memory manager
.opencode/commands/memory/README.txt:148:/memory:learn "Never commit API keys or secrets to git"
.opencode/commands/memory/README.txt:150:# List all constitutional memories and budget
.opencode/commands/memory/README.txt:151:/memory:learn list
.opencode/commands/memory/README.txt:154:/memory:learn budget
.opencode/commands/memory/README.txt:309:Use `/memory:learn` to create constitutional memories: short, always-surface rules that appear at the top of every search result (e.g., coding standards, project constraints). Use `/memory:save` to preserve session context, implementation decisions, and research findings tied to a specific spec folder. Constitutional memories apply globally. Saved context is scoped to a spec folder.
.opencode/commands/memory/README.txt:328:| Learn file not found | Wrong filename for edit/remove | Run `/memory:learn list` to see available files |
```

Result: BLOCKED because the command surfaces match the constitutional overview/list/budget/edit/remove expectations, but the required documentation grep command could not verify all listed active docs due to missing paths: `.opencode/commands/speckit/debug.md`, `.opencode/README.md`, and `.opencode/agents/speckit.md`.

### Pass / Fail

- **BLOCKED**: Default flow shows overview, list/budget expose constitutional inventory, and edit/remove guard with file discovery, but the documentation grep command failed on missing required paths: `.opencode/commands/speckit/debug.md`, `.opencode/README.md`, and `.opencode/agents/speckit.md`.

### Failure Triage

Inspect the `/memory:learn` command flow and the active documentation files listed in the grep command if the overview behavior or constitutional-only wording regresses.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling-and-scripts/constitutional-memory-manager-command.md](../../feature_catalog/tooling-and-scripts/constitutional-memory-manager-command.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 147
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling-and-scripts/constitutional-memory-manager-command.md`
