---
title: "464 -- Shared frontmatter value list"
description: "This scenario validates the shared frontmatter value list for `464`. It focuses on the FRONTMATTER_VALUES helper printing one warning that names the canonical values for a contextType outside the list, staying silent on an alias, and exiting 0 both times."
version: 1.0.0.0
---

# 464 -- Shared frontmatter value list

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `464`.

---

## 1. OVERVIEW

This scenario validates the shared frontmatter value list for `464`. It focuses on the FRONTMATTER_VALUES helper printing one warning that names the canonical values for a contextType outside the list, staying silent on an alias, and exiting 0 both times.

### Why This Matters

The save CLI, the frontmatter migration and the validator read their legal `contextType` and `importance_tier` values from one file, sk-create-frontmatter's `assets/frontmatter-values.json`. The validator side is advice only: a value outside the list must warn and name what to use, an alias must pass, and neither may fail a run. A scratch copy of a real packet doc shows both outcomes without touching the packet.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `464` and confirm the expected signals without contradictory evidence.

- Objective: confirm that the helper prints exactly one `WARN` line naming the canonical values for `contextType: "architecture"` and exits 0, and prints nothing and exits 0 for the alias `contextType: "review"`
- Real user request: `If I put a contextType the list doesn't know into a packet doc, does the validator tell me what to use instead without failing my run?`
- Prompt: `Copy a packet spec.md to a scratch folder, set its contextType to architecture and run the frontmatter value helper on it, then set it to review and run it again, and tell me what each run printed and how it exited.`
- Expected execution process: a packet `spec.md` is copied to a scratch folder, its `contextType` line is set to `"architecture"`, the helper runs on the copy, the line is set to the alias `"review"`, the helper runs again and the scratch folder is removed.
- Expected signals: step 4 prints one line, `WARN<TAB>/tmp/fv-464/spec.md<TAB>contextType "architecture" is not in the shared list; use one of implementation, research, planning, general`, then `exit=0`. Step 6 prints only `exit=0`.
- Desired user-visible outcome: the warning text with the canonical values it names, and a statement that the alias passed and neither run failed.
- Pass/fail: PASS if step 4 prints exactly one `WARN` line naming the four canonical values and both runs exit 0 while step 6 prints no `WARN` line. FAIL if step 4 prints no warning or more than one, a run exits non-zero, or step 6 prints a warning for the alias.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Copy a packet spec.md to a scratch folder, set its contextType to architecture and run the frontmatter value helper on it, then set it to review and run it again, and tell me what each run printed and how it exited.`

### Commands

1. `mkdir -p /tmp/fv-464 && cp specs/system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research/spec.md /tmp/fv-464/spec.md`
2. `sed -i.bak -E 's/^contextType:.*/contextType: "architecture"/' /tmp/fv-464/spec.md`
3. `grep -n '^contextType' /tmp/fv-464/spec.md`
4. `node .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs /tmp/fv-464/spec.md; echo "exit=$?"`
5. `sed -i.bak -E 's/^contextType:.*/contextType: "review"/' /tmp/fv-464/spec.md`
6. `node .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs /tmp/fv-464/spec.md; echo "exit=$?"`
7. `rm -rf /tmp/fv-464`

### Expected

Step 3 prints one line, `10:contextType: "architecture"` or the same value at another line number. Step 4 prints one tab-separated `WARN` line naming the file and the message `contextType "architecture" is not in the shared list; use one of implementation, research, planning, general`, then `exit=0`. Step 6 prints only `exit=0`, because `review` is a legal document alias that maps to `research`.

### Evidence

Capture step 3's output, step 4's full stdout with its exit line and step 6's full stdout with its exit line.

### Pass / Fail

- **Pass**: step 4 prints exactly one `WARN` line naming the four canonical values, step 6 prints no `WARN` line, and both runs end with `exit=0`.
- **Fail**: step 4 prints no warning or more than one, a run exits non-zero, or step 6 warns on the alias.

### Failure Triage

1. When step 3 prints nothing, the copied doc has no top-level `contextType` line, so the edit did not land: copy another top-level packet doc that carries one and rerun from step 2.
2. When step 4 prints no warning, check that `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` exists and parses, because the helper reads the list from it.
3. When step 6 warns on `review`, read the `contextType.document` aliases in the shared list: `review` must map to `research`.
4. When a run exits non-zero, the helper could not read its input or the list: the rule itself only ever warns.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/shared-frontmatter-value-list.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs` | Compares one document's values with the list and prints one `WARN` line per value outside it |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` | The canonical values and aliases the helper reads |
| `.skilled/skills/system-spec-kit/shared/tests/context-types.test.ts` | Assertions over the sets the save CLI imports from the same list |

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs on a scratch copy of a packet doc

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 464
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/shared-frontmatter-value-list.md`
