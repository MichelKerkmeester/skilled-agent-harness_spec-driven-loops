# Survey: duplicated goal-nesting logic in system-spec-kit

Read-only survey run 2026-09-26 by an Explore agent. It is a hypothesis until re-checked.

Classes used below:
- **(a)** mechanics system-spec-kit legitimately owns: the template file, `create.sh` scaffolding, validators, goal-hook binding and runtime plumbing;
- **(b)** authoring guidance that duplicates sk-create-goal.

## 1. What already points to sk-create-goal or `/create:goal`

The sk-doc hub, routing, the `/create:goal` command files, the markdown agent and its mirrors, the advisor bridges, the Hermes mirrors and the root README (`README.md:872,1149-1152`) all do.

**No system-spec-kit or speckit document, template, script or hook points to either.** Only generated retrieval data mentions it.

## 2. Hits by surface

### system-spec-kit `SKILL.md` (Hermes copy at `.hermes/skills/system-spec-kit/SKILL.md`)

- **61**: `goal.md` is listed among docs that must use templates through `create.sh`. Class (a).
- **160**: the HOOKS intent keywords include "packet goal", "goal.md", "nested goal" and "durable slice", so goal-authoring intents route to the hooks docs. This is a routing problem.
- **237-240**: the HOOKS resources, `hook-system.md` and `goal-set-string-playbook.md`.
- **485**: "render the parent's chat slice … Never send a parent goal over 4,000 characters: cut the file in the order the goal set-string playbook gives". Mostly (a); the cut clause is (b).

### system-spec-kit `README.md`

- 62, 232 and 234-238 are class (a).
- 232, "valid at every level and on phase parents", is imprecise; see section 3, item 1.

### references

**`workflows/goal-set-string-playbook.md`** (the largest overlap)

| Lines | Passage | Class | Duplicates |
|---|---|---|---|
| §2, 30-49 | Set-string shape: pointer, BINDING/PRECEDENCE, DONE WHEN | a | – |
| §3, 53-57 | "Criteria must stay checkable without opening anything else" | rule is b | `authoring-standards.md` §4 |
| §4, 61-71 | Five-step cut order | b | `budget-and-handoff.md` §3; sk-create-goal `README.md` "Cutting An Over-Budget Parent" |
| §5, 80-96 | Resend posture, chat slice, no parent over 4,000 | a (posture) | – |
| §5 item 3, 93-95 | A child change that alters a parent decision or criterion is a parent amendment | b | `parent-and-nested-goals.md` §6 |
| §6, 103-115 | "Creating the file": `create.sh --with-goal`, or render by hand with `inline-gate-renderer.sh … goal.md.tmpl` | b | `parent-and-nested-goals.md` §1 and §5 (copy the asset-template block) |

The dependency also runs backward: `budget-and-handoff.md:39`, sk-create-goal `SKILL.md:156` and `parent-and-nested-goals.md:133` all cite the playbook as the source of the cut order.

**`validation/validation-rules.md` §12 (683-722)**
- 687-717 are class (a).
- 722, "How to Fix", is class (b): cut in the playbook's order, never drop a criterion, and author a missing child with `create.sh --with-goal` or by rendering `goal.md.tmpl`. It duplicates `budget-and-handoff.md` §3 and `parent-and-nested-goals.md` §4-5.

**Other references**, all (a) and none pointing to sk-create-goal:
- `config/hook-system.md:97-99`
- `workflows/quick-reference.md:16-17`
- `templates/template-guide.md:187`
- `templates/template-style-guide.md:42-43`
- `structure/folder-structure.md:37`
- `retrieval/retrieval-conventions.md:278`

**Phase docs have no goal mention.** These are gaps, not duplicates:
- `structure/phase-definitions.md:204`: Option D, add a child phase and update the map. That is exactly `/create:goal … phase-add`.
- `structure/phase-system.md:84`: the `create.sh --phase` table.
- `validation/phase-checklists.md`.

### templates

- **`addons/goal.md.tmpl`** is class (a) as the source template. Its fixed text, which sk-create-goal copies under a parity test, carries authoring rules:
  - 34-42: slice and limit;
  - 49: objective placeholder;
  - 59-70: Operator copy, including the child amendment rule;
  - 77-89: binding and precedence;
  - 99-101: "Three to seven bullets … Copy them verbatim".
- `packet-types/phase-parent.spec.md.tmpl`: no goal text.
- `README.md:146`, `EXTENSION-GUIDE.md:47-49` and `spec-kit-docs.json:24-28`: class (a).

### `runtime/cli/spec/create.sh` (all class a)

- 54, 153-154 and 461-462: the `--with-goal` flag.
- 283-284: help text "valid at every level and on phase parents". Imprecise.
- 1884-1885: the non-phase next step. A natural place to add "fill it with `/create:goal`".
- 1649-1652: the phase-mode next steps. Gap: no goal mention.
- 293-294: the `--parent` / `--phase-parent` help. Gap: no nudge toward `/create:goal phase-add`.

### Validator (class a)

- `runtime/lib/validation/spec-doc-structure.ts:1021-1120` (`extractGoalDurableSlice`, `validateGoalDocument`, `bindingRowTarget`)
- `runtime/cli/utils/template-structure.js:64,202`
- `runtime/lib/graph/graph-metadata-parser.ts:58`
- `runtime/cli/spec/check-template-staleness.sh:177`

### speckit commands (`.skilled/commands/speckit/`)

The `packet_goal` block is byte-identical in `speckit-plan.yaml:141-209`, `speckit-complete.yaml:199-267` and `speckit-implement.yaml:106-174`. Line numbers below are for plan; add 58 for complete and subtract 35 for implement.

| Plan lines | Passage | Class | Duplicates |
|---|---|---|---|
| 141-178 | goal_prompting, bind, dispatch_by_runtime, objective_shape | a | – |
| 183-187 | nesting: parent_is_the_directive, read_order | a | – |
| 186 | precedence | b | `parent-and-nested-goals.md` §6 |
| 187 | budget: "parent durable slice is bounded … children are unbounded. Never trim a child into the parent." | b | `budget-and-handoff.md` §2-3 |
| 188-196, 198, 200-209 | bind_by_runtime, resend trigger/after, reminder, log, status_tool | a | – |
| 197 | resend.payload tail: "Never send a parent goal over 4,000 characters. Cut the file in the goal set-string playbook's order first" | b | `budget-and-handoff.md` §3 |
| 199 | child_rule | b | `parent-and-nested-goals.md` §6 |

- The header comment at 179-181 names only the goal hooks.
- **`:with-phases` is a gap.** `speckit-plan.yaml:62-95` P3 and `speckit-complete.yaml:128-161` run `create.sh --phase` without `--with-goal` and never author or bind a parent goal. No phase-add goal step exists in speckit.
- **`speckit-resume-{auto,confirm}.yaml:45-48`**: a read-only packet_goal plus reminder ending "Never send a parent goal over 4,000 characters." Class (a) with a light cut clause.
- `save.md:61` and the presentation Q6/Q9 "Session Goal (optional)" are class (a).

### Hooks and `AGENTS.md`

- `.skilled/hooks/goal/README.md:65,81` are class (a).
- `.skilled/hooks/goal/README.md:147`, the "Directive" boundary, is the natural place to name `/create:goal` as the authoring surface.
- `goal-plugin.md:41,51,119` is class (a).
- `AGENTS.md:185-187`, the GOAL POSTURE RULE, is session posture (a). Its clause "Never send a parent goal over 4,000 characters: cut the file first" is light (b). It ends "Mechanics are `system-spec-kit`'s." and never names sk-create-goal.

## 3. Factual divergences

1. `create.sh --phase --with-goal` writes `goal.md` only into children (child path at 1493, parent lean spec at 1280). Only `--level phase-parent --with-goal` writes a parent goal. `parent-and-nested-goals.md:100` has this right. system-spec-kit `README.md:232`, `create.sh:284` and the playbook `:107-108` blur it.
2. There are two retrofit paths. The playbook §6 and `validation-rules.md:722` say to render `goal.md.tmpl` with the inline renderer. sk-create-goal says to copy the per-kind asset-template block and fill it.
3. The cut order is circular. `budget-and-handoff.md:39` and sk-create-goal `SKILL.md:156` defer to the playbook §4. If the playbook becomes a pointer, `budget-and-handoff.md` §3 must become canonical.

## 4. Duplicates ranked by the logic they carry

1. The playbook: §4 cut order, §5 item 3 amendment rule, §6 retrofit by renderer.
2. The `packet_goal` precedence, budget, resend-cut and child_rule passages, repeated in three speckit YAMLs.
3. `validation-rules.md:722` "How to Fix".
4. The cut clause in `SKILL.md:485`, and the HOOKS keyword routing at `SKILL.md:160`.
5. The cut clause in `AGENTS.md:187`.
6. The tail of `speckit-resume-*.yaml:47`.

Gaps where a new pointer is needed:
- `phase-definitions.md:204`
- `phase-system.md:84`
- the `create.sh` phase next-steps and `--parent` help
- the `:with-phases` P3 steps in `speckit-plan.yaml:79` and `speckit-complete.yaml:145`
