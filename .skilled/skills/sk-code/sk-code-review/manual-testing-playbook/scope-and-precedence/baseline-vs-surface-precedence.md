---
title: "CR-011 -- Baseline vs surface precedence"
description: "This scenario validates Baseline vs surface precedence for `CR-011`. It focuses on the quality runner's resolver as the only source of surface evidence, and on surface conventions winning over generic process advice while baseline security and correctness remain mandatory."
version: 1.6.0.0
---

# CR-011 -- Baseline vs surface precedence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-011`.

---

## 1. OVERVIEW

This scenario validates Baseline vs surface precedence for `CR-011`. It focuses on resolving the surface evidence from the quality runner's explain entry, and on surface conventions overriding generic advice while the baseline security and correctness minimums still block.

### Why This Matters

Surface guidance from sk-code (style, verification commands, project conventions) overrides generic advice but NEVER overrides the baseline security or correctness minimums. CR-011 catches reviewers who let surface style win on a security conflict: the precedence rule is asymmetric, and misapplying it ships unsafe code under the guise of "we follow the project's pattern". The scenario also has to prove where the surface evidence came from. Review keeps no detection of its own, so a reviewer that greps for manifest filenames is running a second detector whose answer can disagree with the one the overrides and checklists are keyed to. The resolver call is therefore the first step, and the `Surface evidence used` line has to match what it returned.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-011` and confirm the expected signals without contradictory evidence.

- Objective: confirm the reviewed files resolve through the quality runner's explain entry, that the report names those surfaces and records their override rows, and that surface conventions win while the security and correctness floor still blocks.
- Real user request: `Review target has surface-specific conventions.`
- Prompt: `Review this diff against the sk-code surface evidence the quality runner returns, letting surface conventions win while baseline security and correctness still block.`
- Expected execution process: list the changed paths that still exist, resolve them in one resolver call, run the exact prompt through the review executor, and compare the report's `Surface evidence used` and `Rule sources:` lines with the resolver output; record a PASS, FAIL, or SKIP verdict with rationale, and SKIP only when the resolver or the review executor is unavailable in the current environment.
- Expected signals: the resolver prints `code-quality-explain/v1` with one `files[]` entry per reviewed path, its `surfaces` list, and each checklist with its `source` and `overrides`; the report's `Surface evidence used` names exactly those surfaces, in the order the resolver returned them; the report's `Rule sources:` line names each returned checklist and records each `replace:` row under `Overrides:`; the precedence is stated explicitly for the one rule where surface and baseline could disagree.
- Desired user-visible outcome: a precedence-aware review that a real maintainer can act on, whose surface claim can be checked line for line against the resolver output.
- Pass/fail: PASS if the resolver returns a surface for every reviewed path, the report's `Surface evidence used` and `Rule sources:` lines match that output, and the report states that surface conventions win while the security and correctness floor still blocks; FAIL if the report names a surface the resolver did not return, resolves nothing and proceeds anyway, or lets a surface convention override a security or correctness minimum.

**Exact prompt**:

```text
Review this diff against the sk-code surface evidence the quality runner returns, letting surface conventions win while baseline security and correctness still block.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this diff against the sk-code surface evidence the quality runner returns, letting surface conventions win while baseline security and correctness still block.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-011 | Baseline vs surface precedence | Confirm the reviewed files resolve through the quality runner's explain entry, the report names those surfaces and records their override rows, and surface conventions win while the security and correctness floor still blocks. | `Review this diff against the sk-code surface evidence the quality runner returns, letting surface conventions win while baseline security and correctness still block.` | bash: git diff --name-only --diff-filter=d <range> -> bash: node <hub>/sk-code-quality/scripts/quality-gate.cjs --explain <those paths> -> agent: @review the diff with the resolved surface evidence -> bash: compare `Surface evidence used` and `Rule sources:` with the resolver output | The resolver prints `code-quality-explain/v1` with one `files[]` entry per path, its `surfaces` list and each checklist with its `source` and `overrides`; the report's `Surface evidence used` names exactly those surfaces in order; its `Rule sources:` line names each returned checklist and records each `replace:` row under `Overrides:` | Resolver transcript with its exit status, the changed-path list, the saved review output and the two report lines quoted | PASS iff the resolver returns a surface for every reviewed path, the report's surface and rule-source lines match that output, and the report states that surface conventions win while the floor still blocks; FAIL if the report names a surface the resolver did not return, proceeds with nothing resolved, or lets a surface convention override a security or correctness minimum | 1. Re-run the resolver and compare before suspecting the review; 2. Quote the line that disagrees with the resolver output; 3. Check whether the reviewer ran its own detection instead of the resolver |

### Exact Commands

Step 1 lists the reviewed paths that still exist, and step 2 resolves them in one call. Both run from the reviewed repository's root, where `HUB` is the sk-code folder the mode was loaded from.

```bash
HUB="<checkout root>/.skilled/skills/sk-code"
git diff --name-only --diff-filter=d <range>
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain <those paths> | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("schema "+j.schema);console.log("surfaces "+j.surfaces.join(","));console.log("hygiene.disabled "+j.config.hygiene.disabled.join(","));for(const c of j.checklists)console.log(c.file+" "+c.source+" "+c.overrides.rows.map(r=>r.id+":"+r.action).join(" "))})'
```

Step 3 runs the exact prompt through the review executor over the same paths, and step 4 compares the report's two lines with the step 2 output.

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <saved review output>
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <saved review output>
```

### Expected

For a reviewed path inside this hub's own checkout, such as the repository's skill-advisor entry point, step 2 prints one surface, no disabled hygiene rule, and three checklists, one of which carries a `replace:` row:

```text
schema code-quality-explain/v1
surfaces SKILLED
hygiene.disabled
hub:sk-code/shared/references/universal/code-quality-standards.md default
hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md hub-surface review.todo-tracking:replace
hub:sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md hub-surface
```

The resolver exits `2`, its advisory exit, because it runs nothing. When its output is piped, the shell reports the last command's status instead.

A path outside any surface resolves differently and must be reported as it resolves. In a scratch repository with no hub config the same command prints `surfaces UNKNOWN` and one `default` checklist, so a report on that path carries `Surface evidence used: UNKNOWN` and no specific surface.

Step 3 returns a report whose two evidence lines follow the resolver. The surface line repeats the resolver's labels in order, and the rule-source line names each returned checklist and records the one `replace:` row:

```text
**Surface evidence used**: SKILLED
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md. Overrides: review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md. Refused: none. Ignored: none. Conflicts: none
```

Step 4 prints `OK: review output ends on the exact status line` and either the numbered-findings line or `OK: no numbered findings to check`, and each checker exits 0.

| Signal | Expected value |
| --- | --- |
| Resolver `schema` | `code-quality-explain/v1` |
| Resolver `files[]` | one entry per reviewed path |
| Resolver `surfaces` | the labels the report must repeat |
| Checklist seats | `default`, then `hub-surface` for the surface packet's own checklists |
| `Surface evidence used` | exactly the resolver's labels, in order, or `UNKNOWN` when the resolver returned no specific surface |
| `Rule sources` | every returned checklist, then each `replace:` row under `Overrides:` |
| Precedence statement | surface conventions win, the security and correctness floor still blocks |
| Report checkers | exit 0 |

### Evidence

The changed-path list, the resolver transcript with its exit status, the saved review output with both lines quoted, and both checker outputs.

### Pass / Fail

- **Pass**: the resolver returns a surface for every reviewed path, the report's `Surface evidence used` and `Rule sources:` lines match that output including every override row, the report states that surface conventions win while the floor still blocks, and both checkers exit 0.
- **Fail**: the report names a surface the resolver did not return, it proceeds with nothing resolved, a `replace:` row is missing from `Rule sources:`, or a surface convention is allowed to override a security or correctness minimum.

### Failure Triage

1. Re-run the resolver before suspecting the review. A `files[]` list shorter than the reviewed paths means the call was given a path that no longer exists, and the deletion filter is the fix.
2. If the report names a surface the resolver did not return, the reviewer ran its own detection. `SKILL.md` §2 states review keeps no detection of its own, and §4 requires reading surfaces from the resolver, so this is a fail rather than a disagreement.
3. If a `replace:` row is missing from `Rule sources:`, compare the report against the step 2 `overrides.rows` list and quote the row that was dropped.
4. If the report resolves `UNKNOWN` on a path the resolver placed in a surface, the report was written before the resolver call or from a different working directory.
5. If the security or correctness floor was relaxed on a surface conflict, that is the asymmetric-precedence failure this scenario exists to catch; quote the finding that was downgraded.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../references/review-core.md` | Baseline and surface precedence rules, the precedence table and the `Rule sources:` format |
| `../../SKILL.md` | Section 3 Phase 1 resolver step and the no-detection-of-its-own rule, section 4 ALWAYS list |
| `../../../sk-code-quality/scripts/quality-gate.cjs` | The one resolver, and the exit codes it uses |
| `../../../sk-code-quality/references/runner-contract.md` | Section 3 fields every report line is built from |

---

## 5. SOURCE METADATA

- Group: Scope And Precedence
- Playbook ID: CR-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scope-and-precedence/baseline-vs-surface-precedence.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
