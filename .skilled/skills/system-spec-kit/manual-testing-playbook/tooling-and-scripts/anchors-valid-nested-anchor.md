---
title: "475 -- ANCHORS_VALID nested anchor"
description: "This scenario validates the ANCHORS_VALID nesting check for `475` on a scaffolded Level 1 packet. It focuses on strict validation passing the un-nested packet, failing it once an anchor opens inside another anchor and the finding text that names the nested anchors."
version: 1.0.0.0
id: tooling-and-scripts-anchors-valid-nested-anchor
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 475 -- ANCHORS_VALID nested anchor

## 1. OVERVIEW

This scenario validates the ANCHORS_VALID rule of strict validation on a Level 1 packet that `create.sh` scaffolded. The rule rejects an anchor that opens inside another open anchor, because a nested pair cannot be read as a clean section by anchor-based retrieval. The scenario first confirms that the scaffolded packet passes, then moves one opener inside another section and confirms that strict validation fails with the nesting finding.

### Why This Matters

A nested pair leaves the outer section's closer after an inner opener, so the two sections no longer end where their own text ends. The ANCHORS_VALID rule reports that shape at validation time, before it lands in the tree. This scenario proves the rule catches the defect and names the anchors involved.

---

## 2. SCENARIO CONTRACT

Operators validate a scaffolded packet, nest one anchor on purpose, validate again and read the finding.

- Objective: Prove that strict validation passes the un-nested scaffolded packet, then fails with exit 2 and `RESULT: FAILED` after the `risks` opener is placed inside `scope`, and that the ANCHORS_VALID finding names the nested anchors.
- Playbook ID: 475.
- Real user request: `Check that no anchor in this spec document opens inside another anchor, and show me the lines if one does.`
- Prompt: `Check that no anchor in this spec document opens inside another anchor, and show me the lines if one does.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit`, `.skilled/skills/sk-doc`, `.skilled/skills/cli-classifier`, `.skilled/skills/sk-code`, `.skilled/hooks` and `.skilled/scripts/git-hooks`, with Node, git, rsync and bash available. The fixture needs no network.
- Expected execution process: Build the fixture, scaffold the packet, validate it, nest one anchor, validate it again and read the ANCHORS_VALID block.
- Expected signals: The first validation exits 0 with `RESULT: PASSED` and no `opened inside` line. The second exits 2 with `RESULT: FAILED`, and its ANCHORS_VALID block reports four issues, starting with `spec.md: anchor 'risks' is opened inside 'scope'`.
- Desired user-visible outcome: The operator sees the nested lines named by anchor id, and the packet passes again once the nesting is removed.
- Pass/fail: PASS if the first validation passes and the second fails with the nesting finding that names `risks` and `scope`. FAIL if the nested packet passes, or the finding does not name the anchors.

---

## 3. TEST EXECUTION

### Prompt

```
Check that no anchor in this spec document opens inside another anchor, and show me the lines if one does.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the disposable repository and scaffold a Level 1 packet.

```bash
CHECKOUT="$(pwd)"
FIXTURE="$(mktemp -d)/repo"
OUT="$(mktemp -d)"
mkdir -p "$FIXTURE" && cd "$FIXTURE"
export GIT_CONFIG_GLOBAL="$FIXTURE.gitconfig" && : > "$GIT_CONFIG_GLOBAL"
git init -q && git config user.name Fixture && git config user.email fixture@test.invalid
mkdir -p .skilled/skills .skilled/scripts .opencode specs
rsync -a --exclude node_modules "$CHECKOUT/.skilled/skills/system-spec-kit" "$CHECKOUT/.skilled/skills/sk-doc" "$CHECKOUT/.skilled/skills/cli-classifier" "$CHECKOUT/.skilled/skills/sk-code" .skilled/skills/
ln -s "$CHECKOUT/.skilled/skills/system-spec-kit/node_modules" .skilled/skills/system-spec-kit/node_modules
rsync -a "$CHECKOUT/.skilled/hooks" .skilled/
rsync -a "$CHECKOUT/.skilled/scripts/git-hooks" .skilled/scripts/
touch .opencode/.gitkeep
printf 'dist/\nnode_modules\n' > .gitignore
git add -A && git commit -q -m baseline
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --track legacy-track --level 1 --short-name nest-demo --number 1 "Nest demo" > "$OUT/create.out" 2>&1
git add -A && git commit -q -m scaffold
P=specs/legacy-track/001-nest-demo
```

2. Validate the un-nested packet.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/val-before.txt" 2>&1
echo "before_exit=$?"
grep -c "opened inside" "$OUT/val-before.txt"
grep "RESULT:" "$OUT/val-before.txt"
```

3. Nest the `risks` opener inside the `scope` section, then list the anchor lines.

```bash
L=$(grep -n "^<!-- ANCHOR:scope -->$" "$P/spec.md" | cut -d: -f1)
sed -i.bak -e '/^<!-- ANCHOR:risks -->$/d' "$P/spec.md" && rm -f "$P/spec.md.bak"
sed -i.bak -e "${L}a\\
<!-- ANCHOR:risks -->" "$P/spec.md" && rm -f "$P/spec.md.bak"
grep -n "ANCHOR:scope\|ANCHOR:risks\|ANCHOR:requirements" "$P/spec.md"
```

The first `sed` removes the original `risks` opener. The second inserts a new `risks` opener on the line after `scope`. The closer for `risks` is left where it was, so `risks` now wraps the sections between them.

4. Validate the nested packet and read the ANCHORS_VALID block.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/val-after.txt" 2>&1
echo "after_exit=$?"
grep -n "opened inside\|closed while\|ANCHORS_VALID" "$OUT/val-after.txt"
grep "RESULT:" "$OUT/val-after.txt"
```

### Expected

Step 2 prints `before_exit=0`, then `0`, the count of `opened inside` lines, then `RESULT: PASSED`. Step 3 prints the matching anchor lines, and `ANCHOR:risks` now sits on the line directly below `ANCHOR:scope`, so the `risks` opener is inside `scope`. The `scope` closer comes after the `risks` opener and before the `risks` closer. Step 4 prints `after_exit=2`. Its ANCHORS_VALID line reads `x ANCHORS_VALID: 4 anchor integrity issue(s) found`, with these four detail lines:

```
- spec.md: anchor 'risks' is opened inside 'scope'
- spec.md: anchor 'scope' is closed while 'risks' is still open
- spec.md: anchor 'requirements' is opened inside 'risks'
- spec.md: anchor 'success-criteria' is opened inside 'risks'
```

The last line reads `RESULT: FAILED`.

### Evidence

- The exit code, the count and the `RESULT:` line from step 2.
- The anchor line listing from step 3.
- The exit code and the ANCHORS_VALID detail lines from step 4.

### Pass / Fail

- **Pass**: Step 2 prints `RESULT: PASSED` with no nesting finding, and step 4 exits 2 with `RESULT: FAILED` and a finding that names `risks` and `scope`.
- **Fail**: Step 2 fails on the un-nested packet, step 4 passes the nested packet, or the finding does not name the anchors.

### Failure Triage

If step 2 fails, the scaffold itself is not clean, so read `$OUT/val-before.txt` before continuing. If step 4 passes, the `risks` opener did not move, so check the step 3 listing, where `ANCHOR:risks` must sit between the `scope` opener and its closer. Strict validation must print an explicit `RESULT:` line, so treat a missing line as a failure even when the exit code is 0. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [anchor-integrity-and-nesting-check.md](../../feature-catalog/tooling-and-scripts/anchor-integrity-and-nesting-check.md)
- Implementation: [orchestrator.ts](../../runtime/lib/validation/orchestrator.ts)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 475
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/anchors-valid-nested-anchor.md`
