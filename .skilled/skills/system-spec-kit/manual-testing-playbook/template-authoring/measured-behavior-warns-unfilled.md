---
title: "485 -- Measured behavior warns when unfilled"
description: "This scenario validates that a fresh v2.4 scaffold with its measured-behavior block left open reports MEASURED_BEHAVIOR as a warning and still passes strict validation."
version: 1.0.0.0
id: template-authoring-measured-behavior-warns-unfilled
---

# 485 -- Measured behavior warns when unfilled

## 1. OVERVIEW

This scenario validates the `MEASURED_BEHAVIOR` rule. A Level 2 packet scaffolded from the current templates carries a `measured-behavior` block that holds only an unfilled value token. The rule must report that block as a warning and must not fail the strict run, because a planning commit is expected to hold an open block.

### Why This Matters

A rule that fails a fresh scaffold blocks every new packet before its first word is written. A rule that stays silent lets a spec state numbers about current behavior that nobody measured. This scenario proves the warning is visible and still leaves the strict run passing.

---

## 2. SCENARIO CONTRACT

Operators scaffold a Level 2 packet, leave the measured-behavior block unfilled, read the rule entry from a strict JSON run, and confirm the warning.

- Objective: Prove that a v2.4 Level 2 scaffold with its measured-behavior block unfilled reports `MEASURED_BEHAVIOR` as `warn`, and that the strict run still reports `passed: true`.
- Playbook ID: 485.
- Real user request: `Scaffold a Level 2 packet, leave the measured behavior block unfilled, and tell me whether strict validation warns about it and still passes.`
- Prompt: `Scaffold a Level 2 packet, leave the measured behavior block unfilled, and tell me whether strict validation warns about it and still passes.`
- Preconditions: A checkout with Node, bash and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, confirm the v2.4 stamp and the open block, run strict validation with JSON output, then read the `MEASURED_BEHAVIOR` entry and the `passed` field.
- Expected signals: The scaffold prints the packet path. The stamp line ends with `v2.4 -->`. The block holds the unfilled value token. The rule entry prints `warn`. The `passed` field prints `true`.
- Desired user-visible outcome: The operator sees one warning that names the empty measured-behavior block and a strict run that still passes, with the packet left ready to fill.
- Pass/fail: PASS if the rule entry is `warn` and `passed` is `true`. FAIL if the entry is `error` or `pass`, or if `passed` is `false`.

---

## 3. TEST EXECUTION

### Prompt

```
Scaffold a Level 2 packet, leave the measured behavior block unfilled, and tell me whether strict validation warns about it and still passes.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Scaffold a Level 2 packet and confirm its stamp and its open block.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-measured --short-name measured --number 1 "Measured behavior warn" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-measured/001-measured
test -f "$P/spec.md" && echo "packet=$P"
grep -m1 'SPECKIT_TEMPLATE_SOURCE' "$P/spec.md"
grep -c 'ANCHOR:measured-behavior' "$P/spec.md"
grep -m1 'YOUR_VALUE_HERE: command and its verbatim output' "$P/spec.md"
```

2. Run strict validation with JSON output and read the rule entry.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "MEASURED_BEHAVIOR") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
```

3. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-measured
test ! -d specs/zz-pb-measured && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-measured/001-measured`, then a stamp line that ends with `v2.4 -->`, then `2` for the opening and closing anchor markers, then the line holding the unfilled value token. Step 2 prints `warn`, then `true`. Step 3 prints `cleanup=ok`.

### Evidence

- The packet path, the stamp line, the anchor count and the token line from step 1.
- The `warn` line and the `true` line from step 2, and the `$OUT/gate.json` file.
- The `cleanup=ok` line from step 3.

### Pass / Fail

- **Pass**: The rule entry is `warn`, `passed` is `true`, and the track is gone at the end.
- **Fail**: The rule entry is `error` or `pass`, `passed` is `false`, or the track remains.

### Failure Triage

A `pass` entry means the block held output or an `N/A:` line, so read the block in `$P/spec.md`. A stamp below v2.4 means the scaffold predates the rule, which skips older stamps as not applicable, so run `runtime/cli/tests/measured-behavior-rule.vitest.ts` before this scenario. An `error` entry means the rule severity was raised above warn, so read the rule entry in `runtime/cli/lib/validator-registry.json`. A `false` `passed` value means another rule failed, so read the other error entries in `$OUT/gate.json` before judging this rule.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [measured-behavior-block.md](../../feature-catalog/tooling-and-scripts/measured-behavior-block.md)
- Implementation: [check-measured-behavior.sh](../../runtime/cli/rules/check-measured-behavior.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict --json

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 485
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/measured-behavior-warns-unfilled.md`
