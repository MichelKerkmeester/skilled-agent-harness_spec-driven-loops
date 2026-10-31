---
title: "Goal Anatomy: The Spec-Kit Goal Contract"
description: "Reference for goal.md structure, slices, phase binding, budget enforcement, and goal tooling."
trigger_phrases:
  - "goal durable slice contract"
  - "goal chat slice"
  - "phase parent goal binding"
  - "goal durable budget"
  - "goal objective slice"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Goal Anatomy: The Spec-Kit Goal Contract

## 1. TEMPLATE SECTIONS

The shared goal template is gated for levels 1, 2, 3, 3+, and `phase`. It starts with YAML frontmatter, a title and a durable-slice explanation. Its durable directive has an objective, frozen decisions and operator-copy instructions. (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:1-71`.)

The objective is one sentence stating what the packet is for, not how work proceeds or what progress has occurred. The decisions table records choices that require an amendment to change. The operator-copy text says that the durable directive, rather than the file's volatile log, is what the operator sets as the session objective. (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49-70`.)

Only `IF level:phase` emits the binding block. It says to read each child goal before its phase, provides one row per child goal path, gives precedence to parent decisions over child detail and child detail over summaries, and states the stop rule: only the completion criteria decide when the work is done. (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-94`.)

Every goal has a completion-criteria section with the guidance to use three to seven bullets that can be checked without opening another file. The template says to copy those criteria verbatim into the objective because a path reference is not dereferenced by the evaluator. The log follows the durable slice and is marked volatile; it holds progress and deviations rather than the durable directive. (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:96-128`.)

---

## 2. DURABLE, CHAT AND OBJECTIVE SLICES

The slice module splits frontmatter from the body. The durable slice is the body after the closing frontmatter fence up to the `<!-- ANCHOR:log -->` marker. It includes comments and anchor markup before that marker. If no log anchor exists, the rest of the body is measured. (`.skilled/hooks/goal/lib/goal-slice.cjs:24-25,40-49,52-63`.)

The chat slice starts from the durable slice. It removes HTML comments, `---` dividers and numbered heading prefixes, collapses runs of blank lines and trims the result. Because the durable slice begins after frontmatter, the YAML bookkeeping is not sent in chat. (`.skilled/hooks/goal/lib/goal-slice.cjs:24-31,65-80`.)

The objective slice is a separate generated projection. It begins with `Execute <packet-path>/goal.md.` If the goal contains a binding anchor, it adds a standard binding and precedence sentence. It then copies checked criteria from the completion anchor as `DONE WHEN` bullets with the checkboxes removed. The builder does not copy the authored objective sentence or decision table, and it does not dereference paths inside criteria. (`.skilled/hooks/goal/lib/goal-slice.cjs:87-118`.)

The three surfaces therefore carry different text: the durable slice is the measured file body before the log, the chat slice is that body cleaned for an operator, and the objective slice is a generated pointer plus optional binding and copied criteria. (`.skilled/hooks/goal/lib/goal-slice.cjs:52-80,87-118`.)

---

## 3. PHASE PARENT AND CHILD RULES

The template includes binding only under `IF level:phase`; a child goal rendered at an ordinary child level does not receive that block from this condition. A phase parent uses its rows to point to child `goal.md` files. (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-94`.)

The binding text makes each child goal authoritative for its phase as if its detail were written in the parent. The template orders parent decisions above child detail, and child detail above any summary. Its stop rule points completion judgment to the criteria. (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:79-90`.)

The validator's child-folder test is separate from the template gate. `isPhaseChildFolder` returns true when the goal's parent directory contains `spec.md`; the budget logic then exempts that folder unless validation is explicitly at `level === 'phase'`. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1044-1048,1050-1055`.)

---

## 4. THE 4,000-CHARACTER BUDGET

The goal budget is configured in `spec-kit-docs.json` as 4,000 characters. The manifest defines the measured text as characters after the frontmatter closing fence and before the log anchor, including anchors and comments. It applies to phase parents and top-level packets; phase children are unbounded. (`.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28`.)

The validator extracts the same slice and raises `SPECDOC_SUFFICIENCY_005` only when the length is greater than the configured limit. Exactly 4,000 characters therefore does not trigger that diagnostic. The code uses the level-aware phase-child exception described in section 3. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1030-1062`.)

A measured packet example shows how much fixed text consumes the parent allowance. The parent goal log records a first draft at 4,820 durable characters, estimates the template's fixed text at about 1,900 characters and nine binding rows at about 900 characters, and records the cut-order decision. A read-only `goal.cjs packet specs/sk-doc/060-create-goal-mode --workspace "$PWD"` run measured the current parent at 3,735 characters with `packet_budget=ok`; the reduction from 4,820 to 3,735 is 1,085 characters by subtraction. (`specs/sk-doc/060-create-goal-mode/goal.md:136`; observed command output: `packet_durable_chars=3735`, `packet_budget=ok`, exit 0.)

---

## 5. BINDING VALIDATION

`validateGoalDocument` searches the parsed document for a binding anchor. If none exists, it returns without a binding diagnostic. If one exists, it evaluates only targets returned from `bindingRowTarget`. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080`.)

`bindingRowTarget` reads the second table cell. It unwraps a Markdown link target or a backticked path; otherwise, it returns the cell as a target only when it contains `/` or `\\`. Empty cells, separator cells and prose without a path separator yield no target. The validator does not inspect the phase-name cell. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1083-1109`.)

For each extracted target, the validator checks that the literal path exists inside the packet and rejects absolute paths, `..` and resolutions outside the packet. A target that does not resolve produces `SPECDOC_SUFFICIENCY_006`. It does not expand ranges or globs, require a `goal.md` suffix, compare rows with the phase map or detect a missing row. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1073-1080,1111-1134`.)

---

## 6. CREATION AND PRINTING TOOLS

`create.sh --with-goal` asks the selected level contract for its required documents and, when the flag is set, adds `goal.md` as a lazy add-on. The helper then scaffolds those selected documents. (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:444-464`.)

The inline renderer accepts `--level <1|2|3|3+|phase|review|research>` and evaluates inline gates in the template. Its shell wrapper calls the TypeScript renderer when available and otherwise falls back to equivalent JavaScript. In the phase scaffold path, `create.sh` invokes the renderer at `--level phase` for the lean parent-spec template and calls the contract document scaffolder in each child-folder loop. (`.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:1-20`; `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:274-301`; `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1275-1281,1492-1504`.)

The phase packet's own log records that `create.sh --phase --with-goal` created child goals but no parent goal, and that its parent goal was rendered separately with the inline renderer. This is source-and-log evidence; `create.sh` was not run during this inventory. (`specs/sk-doc/060-create-goal-mode/goal.md:129,137`.)

`goal.cjs packet <packet> --workspace <root>` is the read-only printer. It reports packet path, whether the goal is nested, durable character count, budget state, slice hash, objective slice and chat slice. (`.skilled/hooks/goal/bin/goal.cjs:203-216`.)

---

## 7. CONTRACT BOUNDARIES

The validator enforces the durable character budget and existence/containment of binding targets it can parse. It does not enforce an authored objective's meaning, remove template placeholders, enforce three to seven criteria, establish that criteria are self-contained or prove every phase child is listed. Those authoring gaps follow from the validator's budget and listed-row implementation and the template's separate writing guidance. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080,1083-1134`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,99-105`.)

The corpus measurements supporting these gaps are recorded in `goal-corpus-audit.md` and derive from the row classifications in `scratch/goal-corpus-scan.cjs` and `scratch/goal-corpus-scan.json`. (`scratch/goal-corpus-scan.cjs:45-96`; `scratch/goal-corpus-scan.json:2-21`.)
