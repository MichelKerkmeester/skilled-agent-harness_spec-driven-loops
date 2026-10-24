---
title: "477 -- Placeholder token error after Draft"
description: "This scenario validates that the same v2.3 packet fails strict validation once its status leaves Draft with a value token still unfilled."
version: 1.0.0.0
id: template-authoring-placeholder-token-error-after-draft
---

# 477 -- Placeholder token error after Draft

## 1. OVERVIEW

This scenario validates the other half of the versioned placeholder gate. A packet that carries a value token must fail once its status leaves Draft. The scenario scaffolds a Level 2 packet, keeps its tokens, changes the Status row to Complete, and reads the gate entry.

### Why This Matters

The Draft warning exists so planning commits can land. It must not survive into a finished packet. This scenario proves the status word is the switch, so a weak model cannot leave a token in place and still claim completion.

---

## 2. SCENARIO CONTRACT

Operators scaffold a packet, set its status to Complete, and confirm that the gate now fails.

- Objective: Prove that a v2.3 packet with an unfilled value token reports `PLACEHOLDER_FILLED` as `error` and `passed: false` once its Status row reads Complete.
- Playbook ID: 477.
- Real user request: `Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.`
- Prompt: `Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.`
- Preconditions: A checkout with Node, bash, perl and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, change the Status row from Draft to Complete, run strict validation with JSON output, then read the gate entry and the `passed` field.
- Expected signals: The status line reads Complete. The gate entry prints `error`. The `passed` field prints `false`.
- Desired user-visible outcome: The operator sees the gate refuse a finished packet that still holds a token, with the token lines named in the details.
- Pass/fail: PASS if the gate entry is `error` and `passed` is `false`. FAIL if the entry is `warn` or `pass`, or if `passed` is `true`.

---

## 3. TEST EXECUTION

### Prompt

```
Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Scaffold a Level 2 packet.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-complete --short-name gate-complete --number 1 "Placeholder gate complete" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-complete/001-gate-complete
test -f "$P/spec.md" && echo "packet=$P"
```

2. Change the Status row from Draft to Complete and confirm it.

```bash
perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' "$P/spec.md"
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
```

3. Run strict validation with JSON output and read the gate entry.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .details[]' "$OUT/gate.json" | head -3
```

4. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-gate-complete
test ! -d specs/zz-pb-gate-complete && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-gate-complete/001-gate-complete`. Step 2 prints a Status row that reads Complete. Step 3 prints `error`, then `false`, then at least one detail line that names a document and a line number. Step 4 prints `cleanup=ok`.

### Evidence

- The packet path from step 1.
- The Complete status line from step 2.
- The `error` line, the `false` line and the first three detail lines from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The gate entry is `error`, `passed` is `false`, and at least one detail line names a token.
- **Fail**: The gate entry is `warn` or `pass`, `passed` is `true`, or no detail line names a token.

### Failure Triage

A `warn` entry means the status edit did not land, so check step 2. A `pass` entry means the scaffold held no token, so read the stamp line and confirm phase 3 is closed. A `true` `passed` value means the gate did not run, so read `$OUT/gate.json` for the `PLACEHOLDER_FILLED` entry itself.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [versioned-placeholder-gate.md](../../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md)
- Implementation: [validate.sh](../../runtime/cli/spec/validate.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict --json

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 477
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/placeholder-token-error-after-draft.md`
