---
title: "sk-create-goal"
description: "Authors packet goal.md files from existing specifications and redirects session-goal requests to their owners."
trigger_phrases:
  - "create packet goal"
  - "goal.md authoring"
  - "phase parent goal"
  - "goal chat slice"
importance_tier: normal
contextType: general
version: 1.2.5.0
---

# sk-create-goal

> Turn a packet's own spec and acceptance criteria into the `goal.md` its sessions run against, while session goal state stays with its owners.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it gives you |
|---|---|
| **Use it for** | Authoring or revising a packet `goal.md`, from a first top-level goal through a parent amendment |
| **Invoke with** | `/create:goal <packet path> [operation]` or a plain request to author a packet goal |
| **Works on** | An existing spec packet with its own `spec.md` and acceptance criteria |
| **Produces** | One `goal.md` filled from the template for its kind, plus a parent goal's `chat_slice` for the operator |

### What It Does

`sk-create-goal` writes the goal a spec packet runs against. It reads that packet's own documents and fills one objective, the decisions later work must honor and three to seven completion criteria an operator can check without opening another file. Every goal starts from the template for its kind. A parity test holds each template to system-spec-kit's `goal.md.tmpl`. The mode authors files only. A request to set, bind, inject or resend a session objective leaves for the goal hooks.

### The Six Operations

| Operation | Use it when |
|---|---|
| `top-level` | The packet has no phase children and its goal is being authored or revised |
| `phase-parent` | The packet has direct phase-child folders, so its goal also carries a binding table |
| `child` | A nested phase child needs a goal from its own phase sources |
| `retrofit` | A packet exists but has no `goal.md` |
| `phase-add` | A new phase appears in the phase map and on disk. It needs one binding row and its child goal |
| `amend` | An existing goal must change, including a parent change driven by a child |

An operation that changes a parent decision or criterion amends the parent first and then updates the child. A child goal never overrides a parent decision.

---

## 2. QUICK START

**Step 1: Invoke it.** Type `/create:goal <packet path>` and add an operation when you know it. The path is required. With no operation the workflow resolves it from the packet's own files. `:auto` runs without checkpoints. `:confirm` checkpoints after the operation is chosen, before any goal file is written and before the handoff.

**Step 2: Check the goal before you hand it off.**

```bash
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs <packet>
```

A clean run prints these lines and exits 0:

```text
[check-goal] packet=<packet>
[check-goal] 1/5 PASS missing-binding-row findings=0
[check-goal] 2/5 PASS placeholder findings=0
[check-goal] 3/5 PASS criteria-count findings=0
[check-goal] 4/5 PASS parent-budget findings=0
[check-goal] 5/5 PASS frontmatter-fence findings=0
[check-goal] RESULT: PASSED (5/5 checks)
```

**Step 3: Print the chat slice.**

```bash
node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"
```

Expected output starts with `STATUS=OK ACTION=packet`, shows `packet_budget=ok` and ends with the quoted `chat_slice`. Hand that slice to the operator. It is not a session bind.

---

## 3. HOW IT WORKS

The workflow reads first and writes second. It opens the packet's `spec.md` and `acceptance-criteria.md`. For a phase parent it also reads the Phase Documentation Map and lists every direct phase-child folder on disk. For a nested child it reads only that child's sources.

Four pre-write decisions come next. The packet router holds them in full.

- Is the request file work or session state?
- Does the packet exist and what role does it play?
- Does a `goal.md` already exist?
- Does a child change alter a parent decision or criterion?

The mode then copies the template for the goal's kind and fills it from those sources. It replaces every bracketed placeholder, writes the objective and the decision table, then adds three to seven criteria that name a result an operator can read. Where the goal contract asks for the criteria in the objective text, it repeats them word for word.

A phase parent gets one more step. Its binding table needs exactly one row for each direct phase-child folder. Each target must be that child's `[NNN-slug]/goal.md` path. Read the map folder set and the folder set on disk, then check every binding row against both.

Last, the checker runs and the packet report supplies the slice. A finding stops the run with `STATUS=FAIL` and no `chat_slice`.

```text
┌─────────────────────────────────┐
│ Goal request                    │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Four pre-write decisions        │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Template for the goal kind      │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Objective, decisions, criteria  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Binding rows for a phase parent │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ check-goal.cjs                  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ goal.cjs packet                 │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ chat_slice for the operator     │
└─────────────────────────────────┘
```

### The Five Checks

The goal checker is read-only. It reads the goal and its direct phase-child folders. It also reads the three asset templates.

| Check | What it proves |
|---|---|
| `missing-binding-row` | Every direct phase-child folder has a target row in the phase-parent binding table |
| `placeholder` | No template text remains in the objective, the decision table or the criteria |
| `criteria-count` | The goal carries three to seven completion criteria |
| `parent-budget` | A goal the cap applies to has a durable slice at or under 4,000 characters |
| `frontmatter-fence` | No bare `---` line sits before the first heading |

The cap covers a top-level packet and any folder that is a phase parent, meaning it has phase children or its `spec.md` declares the phase level. Only a phase child that is neither is exempt. Its packet report reads `packet_budget=unknown`. When a parent runs over, cut in the order in section 3 of [the budget and handoff reference](./references/budget-and-handoff.md) and measure again. Never drop a criterion to fit the budget.

The advisory criteria lint checks the two criteria rules the checker leaves alone. It flags a criterion whose subject the line never names. It also flags one whose check needs another document. It is advisory. Plain findings leave the exit code at 0. A usage error exits 2.

### The Session Boundary

The mode authors files. It never sets, binds, injects or resends a session objective. It never tracks whether an operator has done so. After a parent goal changes, it prints the `chat_slice` and stops. The operator holds that slice as the objective. The goal hooks or the host's native goal command own everything past the print.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a top-level packet needs a goal, when a phase parent needs one, when a nested child needs its own or when an existing packet has none. It also handles the phase-add case, where a new folder needs one binding row and its child goal.

Stay away when the packet does not exist yet or its phase structure is unsettled. Create the packet and plan its phases with system-spec-kit first. A request to set, bind, inject or resend a session objective belongs to the goal hooks, not here.

### Related Skills

| Skill or surface | Relationship |
|---|---|
| `system-spec-kit` | Owns `goal.md.tmpl` and `create.sh --with-goal`, which scaffolds a child goal. It also validates the packet around the goal |
| Goal hooks and the host goal command | Own session binding and objective delivery. This mode writes the source file and prints its slice |
| `sk-doc` hub | Routes goal-file authoring to this packet and leaves session-state work elsewhere |
| `/create:goal` | The command entry point. It binds the packet path, operation and execution mode, then runs the workflow |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `missing-binding-row` names a child folder | The phase-parent binding table has no target row for that folder | Add exactly one row that points at `[NNN-slug]/goal.md`. Never omit a folder because its goal is missing |
| `placeholder` names the objective, a decision or a criterion | Template text survived the fill | Replace it with text from the packet's sources and leave no bracketed placeholder |
| `criteria-count` reports a number outside 3 through 7 | The goal has too few or too many completion criteria | Merge or split criteria. Keep each one checkable without another file |
| `parent-budget` reports a durable slice over the limit | The goal runs past the 4,000-character cap | Cut in the section 3 order in the budget and handoff reference, then run the packet report again |
| `frontmatter-fence` appears | A bare `---` line sits above the first heading, so the frontmatter closed early | Keep exactly two fence lines, the opener and the closer, with no other `---` inside them |
| `packet_budget=unknown` on a top-level goal or a phase parent | The budget manifest is missing or invalid | Fix the manifest before you judge the goal. An exempt phase child reports `unknown` by design |

---

## 6. FAQ

**Why does this mode refuse to set the session objective?**

Because that is a different job with a different owner. A packet goal is a file. A session objective is runtime state. The goal hooks or the host's native command own it. The mode prints the `chat_slice` so the operator can set it. It never binds the session itself.

**Can I drop a criterion to fit the 4,000 characters?**

No. Cutting a parent is allowed. Cutting a completion criterion is not. Section 3 of [the budget and handoff reference](./references/budget-and-handoff.md) gives the cut order. Every step keeps the same criteria count. If the parent still runs long, ask whether the packet scope should split.

**What happens when the phase map and the folders on disk disagree?**

The workflow stops. It reports the map rows and the disk entries that differ, then asks for the map to be reconciled first. It never guesses a folder name or adds a row for a folder that does not exist.

**When does a parent goal need a resend?**

When its objective, decisions, binding table or criteria change. A change inside one child's phase needs no parent amendment. Print the updated `chat_slice` after a parent change and hand it to the operator.

---

## 7. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Goal conformance | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs <packet>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Budget and slice | `node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"` | `packet_budget=ok` and the quoted `chat_slice` |
| Checker, lint and template parity | `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` | `pass 36` with `fail 0` |
| Advisory criteria lint | `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all` | `errors=0` and `scratch_excluded=`, exit 0 |
| Playbook package | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook` | `PASS` with `scenarios=10` and `violations=0`, exit 0 |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The workflow contract, the rules and the ownership boundaries |
| [`ROUTER.md`](./ROUTER.md) | The intent model, the four pre-write routing decisions and the machine router |
| [`references/parent-and-nested-goals.md`](./references/parent-and-nested-goals.md) | The top-level, phase-parent, child, retrofit, phase-add and amend workflows |
| [`references/authoring-standards.md`](./references/authoring-standards.md) | Reader checks for objectives, decisions, criteria, logs, voice and frontmatter |
| [`references/budget-and-handoff.md`](./references/budget-and-handoff.md) | Durable budget measurement, the cut order and the runtime handoff matrix |
| [`assets/goal-top-level-template.md`](./assets/goal-top-level-template.md) | The blank for a packet with no phases |
| [`assets/goal-phase-parent-template.md`](./assets/goal-phase-parent-template.md) | The blank for a phase parent, with its binding table |
| [`assets/goal-phase-child-template.md`](./assets/goal-phase-child-template.md) | The blank for a phase child |
| [`assets/goal-exemplars.md`](./assets/goal-exemplars.md) | Cited goal excerpts with rubric outcomes |
| [`scripts/README.md`](./scripts/README.md) | The checker, the criteria lint, their tests and fixtures |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The ten operator scenarios and the run-record contract |
| [`goal.md.tmpl`](../../system-spec-kit/templates/addons/goal.md.tmpl) | The system-spec-kit source the three templates copy |
| [`goal.cjs`](../../../hooks/goal/bin/goal.cjs) | The session-free printer for a packet's goal slices |
| [Goal hooks README](../../../hooks/goal/README.md) | The runtime goal ownership and session-state boundary |
| [`/create:goal`](../../../commands/create/goal.md) | The command router with the auto and confirm workflows |
| [Human Voice Rules](../sk-create-with-human-voice/references/hvr-rules.md) | The voice standard every authored goal and this README follow |
| [`changelog/`](./changelog/) | Release notes for each version of this mode |
