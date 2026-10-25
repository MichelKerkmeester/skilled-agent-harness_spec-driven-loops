---
title: "478 -- Placeholder gate unchanged for a v2.2 doc"
description: "This scenario validates that a packet stamped v2.2 keeps the placeholder error it always had, even while its status is Draft."
version: 1.0.0.0
id: template-authoring-placeholder-gate-legacy-stamp-unchanged
---

# 478 -- Placeholder gate unchanged for a v2.2 doc

## 1. OVERVIEW

This scenario validates the compatibility half of the versioned placeholder gate. A packet with a v2.2 stamp, or with no stamp, must keep the old verdict. The scenario scaffolds a Level 2 packet, rewrites its stamp to v2.2, leaves its status at Draft and keeps its tokens. The gate must report an error.

### Why This Matters

External packets are written under the old contract. A new gate that changed their verdict would break `/doctor:update` for every repository that already holds a packet. This scenario proves the stamp is the switch, and that an unstamped or older packet is never treated as Draft.

---

## 2. SCENARIO CONTRACT

Operators rewrite the stamp on a scaffold, keep the Draft status, and confirm that the gate still fails.

- Objective: Prove that a Draft packet stamped v2.2 reports `PLACEHOLDER_FILLED` as `error` and `passed: false`, with no Draft warning.
- Playbook ID: 478.
- Real user request: `This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.`
- Prompt: `This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.`
- Preconditions: A checkout with Node, bash, perl and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, rewrite every v2.3 stamp to v2.2, confirm the Draft status and the stamp, run strict validation with JSON output, then read the gate entry.
- Expected signals: Each document stamp ends with `v2.2 -->`. The status line reads Draft. The gate entry prints `error`. The `passed` field prints `false`.
- Desired user-visible outcome: The operator sees the older packet keep its error, so no existing repository changes verdict.
- Pass/fail: PASS if the gate entry is `error` and `passed` is `false`. FAIL if the entry is `warn`, or if `passed` is `true`.

---

## 3. TEST EXECUTION

### Prompt

```
This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Scaffold a Level 2 packet.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-legacy --short-name gate-legacy --number 1 "Placeholder gate legacy" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-legacy/001-gate-legacy
test -f "$P/spec.md" && echo "packet=$P"
```

2. Rewrite the stamp in every packet document and confirm the stamp and the status.

```bash
for f in spec plan tasks implementation-summary acceptance-criteria; do
  perl -pi -e 's/\| v2\.3 -->/| v2.2 -->/g' "$P/$f.md"
  printf '%s ' "$f"
  grep -c 'v2\.2 -->' "$P/$f.md"
done
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
```

3. Run strict validation with JSON output and read the gate entry.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
```

4. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-gate-legacy
test ! -d specs/zz-pb-gate-legacy && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-gate-legacy/001-gate-legacy`. Step 2 prints five lines, each a document name followed by `1`, then a Status row that reads Draft. Step 3 prints `error`, then `false`. Step 4 prints `cleanup=ok`.

### Evidence

- The packet path from step 1.
- The five stamp counts and the Draft status line from step 2.
- The `error` line and the `false` line from step 3, and the `$OUT/gate.json` file.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: Every document reports one v2.2 stamp, the status stays Draft, the gate entry is `error`, and `passed` is `false`.
- **Fail**: A document keeps a v2.3 stamp, the gate entry is `warn`, or `passed` is `true`.

### Failure Triage

A stamp count of `0` means the rewrite did not match, so read the stamp line and confirm the template version. A `warn` entry means the stamp gate still saw v2.3 somewhere, so check all five documents before judging the rule. A different rule failure is separate from this scenario, so read the other error entries.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [versioned-placeholder-gate.md](../../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md)
- Implementation: [validate.sh](../../runtime/cli/spec/validate.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict --json

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 478
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/placeholder-gate-legacy-stamp-unchanged.md`
