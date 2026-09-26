---
title: "Parent and Nested Goal Authoring"
description: "Ordered workflows for packet goals, phase-parent bindings, nested child goals, retrofit, phase-add and amendments."
trigger_phrases:
  - "phase-parent goal"
  - "nested child goal"
  - "goal retrofit"
  - "phase-add binding"
  - "parent goal amendment"
importance_tier: important
contextType: reference
version: 1.0.0.0
---
# Parent and Nested Goal Authoring

Use these workflows only after the packet and its phase structure exist. Read [`authoring-standards.md`](authoring-standards.md) and [`goal-exemplars.md`](../assets/goal-exemplars.md) before drafting. The [goal template](../../../system-spec-kit/templates/addons/goal.md.tmpl) owns the file structure. Do not copy it into this mode.

---

## 1. SOURCE AND ROLE CHECK

Classify the target before writing. A top-level packet has its own specification and no parent packet spec. A phase parent has direct numbered phase-child folders. A nested child has a parent folder that contains `spec.md`.

Read the target's own `spec.md` and `acceptance-criteria.md`. For a phase parent, also read its Phase Documentation Map. For a nested child, use only that child's specification and acceptance criteria for its phase goal. Stop if a required source is missing or if the sources conflict. Name the conflict instead of choosing a truth silently.

Render through system-spec-kit. Use [`create.sh`](../../../system-spec-kit/runtime/cli/spec/create.sh) when scaffolding a packet with its other documents. Use the [inline gate renderer](../../../system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh) for an existing packet or a missing goal. Never create `goal.md.tmpl` in this mode.

---

## 2. TOP-LEVEL GOAL

1. Read the packet's own `spec.md` and `acceptance-criteria.md`. Use the specification for the purpose and frozen decisions. Use the acceptance criteria for the completion checks. Resolve any contradiction before writing.
2. Render the goal at the packet's level. If the packet already has `goal.md`, revise that file through its existing structure. If it has no goal, render the canonical goal template to the packet directory with the inline renderer.
3. Write one objective sentence that states the packet's purpose. Record decisions that later work must honor. Add three to seven self-contained completion criteria based on the acceptance criteria. Repeat those criteria verbatim in the evaluator-facing objective text required by the goal contract.
4. Keep progress and temporary findings below the goal's log heading. A top-level goal has no binding section.

Verify the packet from the repository root:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict
node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"
```

Read both outputs. Require `RESULT: PASSED` from strict validation. Confirm the goal packet command reports `packet_budget=ok` and that the objective and criteria match the packet's own sources.

---

## 3. PHASE-PARENT GOAL

A phase-parent binding is complete only when the map and direct child folders agree. The validator checks targets that appear in the binding table. It does not detect a missing row, compare the map with the folders or prove that every phase is listed. Use the [goal validator](../../../system-spec-kit/runtime/lib/validation/spec-doc-structure.ts) as a target check, not as a completeness check.

1. Read the phase parent's `spec.md`, its `acceptance-criteria.md` when present and the complete Phase Documentation Map. Record each direct phase folder named by the map.
2. List every direct child directory whose name matches `NNN-slug/`. Compare the exact folder-name set with the map's folder set before writing the goal. Do not compare only the counts.
3. **STOP** if a map row has no matching directory, a directory has no map row or a folder name is ambiguous. Report the exact map and disk entries that differ. Reconcile the Phase Documentation Map first, then restart this workflow. Never infer a folder name or guess a missing binding row.
4. Check that each child folder has its own `spec.md` and `acceptance-criteria.md`. Stop if either source is missing. Derive the parent's objective and criteria from the parent-level sources. Do not copy phase-local detail into the parent as a substitute for parent criteria.
5. If the parent has no `goal.md`, render the `phase` level. If it already has a goal, revise it through that rendered structure. Preserve the template's binding and precedence text.
6. Write exactly one table row for each direct phase-child directory. The target cell must be a backticked path in the form `NNN-slug/goal.md`, relative to the phase parent. For example:

| Phase | Goal document |
|---|---|
| source audit | `001-source-audit/goal.md` |

Do not add a row for a phase-map entry without a matching directory. Do not omit a directory because it lacks a child goal yet. The phase parent's criteria describe parent outcomes and remain checkable without opening another file.

Verify from the repository root. Compare the map folder set, the direct-child directory set and the binding target set by name. Confirm each target exists. Then validate recursively and measure the parent goal:

```bash
find <packet> -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' -print | sort
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --recursive --strict
node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"
```

The strict validator checks each listed target but does not prove row completeness. Your set comparison is a separate required check. Require `RESULT: PASSED` and `packet_budget=ok`.

---

## 4. NESTED CHILD GOAL

1. Read the child's own `spec.md` and `acceptance-criteria.md`. Use its phase objective, frozen choices and phase-local criteria. Do not derive the child goal from a parent summary or another phase's criteria.
2. Render the goal using the child's level, usually level 2. Fill the objective, decisions and three to seven checkable criteria. Repeat those criteria verbatim in the evaluator-facing objective text required by the goal contract.
3. Keep the criteria phase-local. A nested child goal has no binding section. The parent goal binds the child.

Verify the child and the absence of a binding section:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <child> --strict
! grep -q '<!-- ANCHOR:binding -->' <child>/goal.md
```

Require `RESULT: PASSED`. Confirm every child criterion traces to that child's own acceptance criteria and that the goal has no binding block.

---

## 5. RETROFIT AND PHASE-ADD

### Retrofit a missing goal

Treat adding a goal to an existing packet that has none as its own operation. First confirm the packet exists, its role is clear and its source documents are present. Do not call this operation when a goal already exists. Revise that file instead.

`create.sh --phase --with-goal` writes goals through the child document contract. Its phase-parent path renders the lean parent specification separately and does not create a parent `goal.md`. For that missing parent, render the phase-level goal with:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh --level phase --out-dir <packet> .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl
```

Fill the rendered goal from the parent's sources and complete its binding table using the phase-parent workflow. For a non-phase packet, use the packet's actual level instead of `phase`.

Verify with strict validation. For a phase parent, validate recursively, compare every map row with the child folders and run `goal.cjs packet` to confirm the parent budget.

### Add a phase binding

Use phase-add only after the new phase appears in both the parent's Phase Documentation Map and the direct child directories on disk. Read the new child's own specification and acceptance criteria before writing its goal. If the map and disk do not agree, stop and reconcile the map first.

Add exactly one parent binding row with the new directory's backticked `NNN-slug/goal.md` target. Author the child's goal from its phase-local sources. Do not rewrite unrelated rows. Because the parent goal changed, print its updated chat slice for the operator to resend.

Verify that the map, direct-child folders and binding rows now have equal sets. Confirm the new child target exists, then run recursive strict validation and the parent packet command:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --recursive --strict
node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"
```

Require `RESULT: PASSED` and `packet_budget=ok`. Check the printed `chat_slice` and hand it to the operator to resend. Do not set or bind session state.

---

## 6. PRECEDENCE AND AMENDMENTS

Parent decisions bind every phase. Each child goal is authoritative for its own phase, as if its detail were written in the parent. Child detail outranks summaries of that detail. Name any conflict between the parent and a child. Do not resolve it silently. Do not let a child goal override a parent decision.

When a requested child change alters a parent decision or criterion, apply the amendment to the parent first. Update the child goal to match the amended parent, then print the parent's current chat slice:

```bash
node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"
```

The operator resends that `chat_slice`. A change contained within one child's phase needs no parent amendment or resend. A change to the parent objective, decisions, binding table or criteria does require a resend. The [goal set-string playbook](../../../system-spec-kit/references/workflows/goal-set-string-playbook.md) defines the durable slice and handoff.

Verify every amendment with recursive strict validation and the parent packet command. Confirm that the parent still lists every direct child and reports `packet_budget=ok`. For a child-only change, validate the child and its parent recursively.
