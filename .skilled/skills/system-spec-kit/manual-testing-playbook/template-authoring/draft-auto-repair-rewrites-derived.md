---
title: "486 -- Draft auto-repair rewrites derived metadata"
description: "This scenario validates that a strict run on a Draft packet with stale derived metadata repairs it once and names the rewritten file, and that the off switch leaves the packet failing."
version: 1.0.0.0
id: template-authoring-draft-auto-repair-rewrites-derived
---

# 486 -- Draft auto-repair rewrites derived metadata

## 1. OVERVIEW

This scenario validates Draft auto-repair. An author edits the summary in `spec.md` after the generated metadata was written, so the only failures are derived ones that `repair-derived.cjs` can recompute. A strict run on the Draft packet must repair them once, name each file it rewrote and validate again. The same break with `SPECKIT_DRAFT_AUTO_REPAIR=0` must print neither line and must fail.

### Why This Matters

A validator that makes a writer fix recomputable metadata by hand costs a round on every edit. A validator that rewrites files without saying so changes the tree under the check. This scenario proves the repair runs, names what it wrote and respects the off switch.

---

## 2. SCENARIO CONTRACT

Operators scaffold a Draft packet, break only its derived metadata, run strict validation with and without the switch, and compare the two outputs.

- Objective: Prove that a strict run on a Draft packet whose only errors are derived prints `Draft auto-repair:` and a `rewrote` line for `graph-metadata.json` and passes, and that the same break with `SPECKIT_DRAFT_AUTO_REPAIR=0` prints neither line and fails.
- Playbook ID: 486.
- Real user request: `I edited the summary of a Draft packet and strict validation fails on generated metadata. Tell me whether validation repairs it on its own, and how to turn that off.`
- Prompt: `I edited the summary of a Draft packet and strict validation fails on generated metadata. Tell me whether validation repairs it on its own, and how to turn that off.`
- Preconditions: A checkout with Node and bash on PATH, a built `.skilled/skills/system-spec-kit` so `validate.sh` runs, and no `CI` variable set in the shell. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, confirm its status is Draft, edit the `description` line in `spec.md`, keep a copy of the broken packet, run strict validation, restore the copy, run strict validation again with the switch at `0`, then compare.
- Expected signals: The first run prints `Draft auto-repair:`, a `rewrote` line for `graph-metadata.json` and `RESULT: PASSED`. The second run prints no `Draft auto-repair:` line, no `rewrote` line, `RESULT: FAILED` and the `repair-derived.cjs` command.
- Desired user-visible outcome: The operator sees the repair name the file it changed, and sees the switch turn the repair off and leave the failure for a manual run of the repair command.
- Pass/fail: PASS if the first run repairs and passes and the second run prints neither line and fails. FAIL if the first run prints no repair notice, or if the second run repairs or passes.

---

## 3. TEST EXECUTION

### Prompt

```
I edited the summary of a Draft packet and strict validation fails on generated metadata. Tell me whether validation repairs it on its own, and how to turn that off.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined. Unset `CI` first, because a set `CI` turns the repair off.

1. Scaffold a Level 2 packet, confirm its status, edit the summary and keep a copy of the broken packet.

```bash
unset CI SPECKIT_DRAFT_AUTO_REPAIR SPECKIT_RULES
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-repair --short-name repair --number 1 "Draft auto repair" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-repair/001-repair
test -f "$P/spec.md" && echo "packet=$P"
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
perl -pi -e 's/^description: .*$/description: "A summary edited after the metadata was generated."/' "$P/spec.md"
grep -m1 '^description:' "$P/spec.md"
cp -R "$P" "$OUT/broken"
```

2. Run strict validation with the repair on and read the notice.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/on.txt" 2>&1
grep -m1 'Draft auto-repair:' "$OUT/on.txt"
grep -c 'rewrote .*graph-metadata.json' "$OUT/on.txt"
grep -m1 'RESULT:' "$OUT/on.txt"
```

3. Restore the broken packet and run strict validation with the switch off.

```bash
rm -rf "$P" && cp -R "$OUT/broken" "$P"
SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/off.txt" 2>&1
grep -c 'Draft auto-repair:' "$OUT/off.txt"
grep -c 'rewrote' "$OUT/off.txt"
grep -m1 'RESULT:' "$OUT/off.txt"
grep -m1 'repair-derived.cjs' "$OUT/off.txt"
```

4. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-repair
test ! -d specs/zz-pb-repair && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-repair/001-repair`, then a Status row that reads Draft, then the edited `description:` line. Step 2 prints the `Draft auto-repair: spec.md is Draft and every error is derived metadata, so repair-derived.cjs --apply ran once.` line, then `1`, then `RESULT: PASSED`. Step 3 prints `0`, then `0`, then `RESULT: FAILED`, then a line holding the `repair-derived.cjs --folder specs/zz-pb-repair/001-repair --apply` command. Step 4 prints `cleanup=ok`.

### Evidence

- The packet path, the Status row and the edited description from step 1.
- The notice line, the `rewrote` count and the result line from step 2, and the `$OUT/on.txt` file.
- The two counts, the result line and the command line from step 3, and the `$OUT/off.txt` file.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: Step 2 repairs, names `graph-metadata.json` and passes, step 3 prints neither line and fails, and the track is gone at the end.
- **Fail**: Step 2 prints no notice or fails, step 3 prints a notice or passes, or the track remains.

### Failure Triage

No notice in step 2 means the repair refused, so check that `CI` is unset, that the Status row reads exactly Draft and that no other rule reported an error in `$OUT/on.txt`, because one authored error stops the repair. A `rewrote` count of `0` beside a notice means the repair wrote nothing, so read the line after the notice. A notice in step 3 means the switch did not reach the validator, so rerun with the variable on the same command line. A `PASSED` result in step 3 means the break did not take, so read the description line in `$P/spec.md`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [draft-auto-repair.md](../../feature-catalog/tooling-and-scripts/draft-auto-repair.md)
- Implementation: [validate.sh](../../runtime/cli/spec/validate.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 486
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/draft-auto-repair-rewrites-derived.md`
