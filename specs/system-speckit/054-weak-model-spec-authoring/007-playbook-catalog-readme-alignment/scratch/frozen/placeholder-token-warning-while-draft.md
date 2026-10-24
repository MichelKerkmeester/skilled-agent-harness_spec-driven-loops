---
title: "476 -- Placeholder token warning while Draft"
description: "This scenario validates that a v2.3 scaffold keeps an unfilled value token as a warning and still passes strict validation while its status is Draft."
version: 1.0.0.0
id: template-authoring-placeholder-token-warning-while-draft
---

# 476 -- Placeholder token warning while Draft

## 1. OVERVIEW

This scenario validates the Draft half of the versioned placeholder gate. A packet scaffolded from a v2.3 template carries `[YOUR_VALUE_HERE: ...]` tokens and a Status row that reads Draft. The gate must report an unfilled token as a warning and must not fail the strict run, because a planning commit is expected to hold tokens.

### Why This Matters

A gate that fails a fresh scaffold blocks every new packet before its first word is written. A gate that passes a finished packet lets a weak model ship a document that still says `[YOUR_VALUE_HERE: feature name]`. This scenario proves the first half. Draft warns and passes.

---

## 2. SCENARIO CONTRACT

Operators scaffold a Level 2 packet, read the gate entry from a strict JSON run, and confirm the warning.

- Objective: Prove that a v2.3 Level 2 scaffold with its Status row at Draft reports `PLACEHOLDER_FILLED` as `warn`, and that the strict run still reports `passed: true`.
- Playbook ID: 476.
- Real user request: `Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.`
- Prompt: `Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.`
- Preconditions: A checkout with Node, bash and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, confirm the v2.3 stamp and the Draft status, run strict validation with JSON output, then read the `PLACEHOLDER_FILLED` entry and the `passed` field.
- Expected signals: The scaffold prints the packet path. The stamp line ends with `v2.3 -->`. The status line reads Draft. The gate entry prints `warn`. The `passed` field prints `true`.
- Desired user-visible outcome: The operator sees a clean strict pass and one warning that names the unfilled tokens, with the packet left ready to fill.
- Pass/fail: PASS if the gate entry is `warn` and `passed` is `true`. FAIL if the entry is `error` or `pass`, or if `passed` is `false`.

---

## 3. TEST EXECUTION

### Prompt

```
Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Scaffold a Level 2 packet and confirm its stamp and status.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-draft --short-name gate-draft --number 1 "Placeholder gate draft" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-draft/001-gate-draft
test -f "$P/spec.md" && echo "packet=$P"
grep -m1 'SPECKIT_TEMPLATE_SOURCE' "$P/spec.md"
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
```

2. Run strict validation with JSON output and read the gate entry.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
```

3. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-gate-draft
test ! -d specs/zz-pb-gate-draft && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-gate-draft/001-gate-draft`, then a stamp line that ends with `v2.3 -->`, then a Status row that reads Draft. Step 2 prints `warn`, then `true`. Step 3 prints `cleanup=ok`.

### Evidence

- The packet path, the stamp line and the status line from step 1.
- The `warn` line and the `true` line from step 2, and the `$OUT/gate.json` file.
- The `cleanup=ok` line from step 3.

### Pass / Fail

- **Pass**: The gate entry is `warn`, `passed` is `true`, and the track is gone at the end.
- **Fail**: The gate entry is `error` or `pass`, `passed` is `false`, or the track remains.

### Failure Triage

A `pass` entry means the scaffold held no token, so read the stamp line. A stamp below v2.3 means phase 3 is not closed, so stop and report it. An `error` entry at Draft means the gate is not installed, so run the phase 3 test file before this scenario. A `false` `passed` value means another rule failed, so read the other error entries in `$OUT/gate.json` before judging the gate.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [versioned-placeholder-gate.md](../../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md)
- Implementation: [validate.sh](../../runtime/cli/spec/validate.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict --json

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 476
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/placeholder-token-warning-while-draft.md`
