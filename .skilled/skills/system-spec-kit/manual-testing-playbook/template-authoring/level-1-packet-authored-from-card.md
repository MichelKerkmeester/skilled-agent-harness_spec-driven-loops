---
title: "483 -- Level 1 packet authored from the card"
description: "This scenario validates that a cli-devin swe-2-max worker can scaffold and fill a Level 1 packet from the authoring card alone, with strict validation passing and no token left."
version: 1.0.0.0
id: template-authoring-level-1-packet-authored-from-card
---

# 483 -- Level 1 packet authored from the card

## 1. OVERVIEW

This scenario validates the card as an authoring instruction. It dispatches one cli-devin swe-2-max worker with the card as its guidance and a throwaway track as its only write path. The worker scaffolds and fills a Level 1 packet. The operator then runs strict validation and counts the tokens left in the four documents.

### Why This Matters

A card that reads well but cannot drive a finished packet is a brochure. This scenario is the end to end check: one model, one card, one strict pass and zero tokens left.

---

## 2. SCENARIO CONTRACT

Operators dispatch one worker, then validate the packet it wrote.

- Objective: Prove that a cli-devin swe-2-max worker writes a Level 1 packet from the card, that strict validation prints `RESULT: PASSED`, and that the four documents hold no value token or open question marker.
- Playbook ID: 483.
- Real user request: `Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.`
- Prompt: `Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.`
- Preconditions: A checkout with Node, bash and `rg` on PATH, the `devin` CLI on PATH with `devin auth status` printing `Logged in`, the operator's approval for `--permission-mode dangerous` on this run, and phase 5 closed so the card exists. The scenario needs network access and one cli-devin swe-2-max run.
- Expected execution process: Remove any earlier throwaway track, write the worker brief, dispatch the worker with cli-devin, validate the packet it wrote, count the tokens left, then remove the track.
- Expected signals: The worker returns a final reply and `devin` exits `0`. The packet holds `spec.md`. Strict validation prints `RESULT: PASSED`. The token count prints `0`. The track is gone at the end.
- Desired user-visible outcome: The operator sees a finished Level 1 packet that a strict run accepts, with no authoring hint left for a reader to fill.
- Pass/fail: PASS if the worker returns a reply, strict validation prints `RESULT: PASSED`, the token count is `0` and the track is gone. FAIL if any of those checks fails.

---

## 3. TEST EXECUTION

### Prompt

```
Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.
```

### Commands

Run steps 1 to 4 from the checkout root. Step 1 writes the scratch path to a fixed file, so each later step recovers it. Step 2 runs the `devin` CLI. This scenario spends one cli-devin swe-2-max run.

1. Clear the throwaway track and write the worker brief.

```bash
OUT="$(mktemp -d)"
POINTER=specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt
mkdir -p "$(dirname "$POINTER")"
printf '%s\n' "$OUT" > "$POINTER"
echo "out=$OUT"
echo "pointer=$POINTER"
rm -rf specs/zz-pb-card
cat > "$OUT/brief.txt" <<'TXT'
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder you create and fill is:
  specs/zz-pb-card/001-card-authoring

ROLE: You are a documentation author. You read one card and write one Level 1 packet.

ALLOWED WRITE PATHS:
  specs/zz-pb-card/ and everything under it

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset, git stash, generate-context.js, /speckit:save, and any edit outside specs/zz-pb-card/. Do not edit recommend-level.sh. Do not edit anything under .skilled/.

TASK:
1. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md completely.
2. Run exactly: bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-pb-card --short-name card-authoring --number 1 "Author a Level 1 packet from the card"
3. Fill spec.md, plan.md, tasks.md and implementation-summary.md. Describe this feature in the packet and do not build it: a --quiet flag for .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh that prints only the final recommended-level line. Say in implementation-summary.md that the packet is planned and not implemented.
4. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-pb-card/001-card-authoring --strict
5. Fix what it reports and run it again, at most three times in all.

RETURN exactly one line: the last RESULT line validate.sh printed.
TXT
echo "brief=$(wc -l < "$OUT/brief.txt") lines"
```

2. Dispatch one worker with cli-devin.

```bash
OUT="$(cat specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt)"
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 devin -p --model swe-2-max --permission-mode dangerous -- "$(cat "$OUT/brief.txt")" </dev/null > "$OUT/reply.txt" 2> "$OUT/reply.err"
echo "devin_exit=$?"
tail -n 1 "$OUT/reply.txt"
```

3. Validate the packet and count the tokens left.

```bash
OUT="$(cat specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt)"
P=specs/zz-pb-card/001-card-authoring
test -f "$P/spec.md" && echo "packet=$P"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/val.txt" 2>&1
echo "val_exit=$?"
grep 'RESULT:' "$OUT/val.txt"
rg -o --no-filename 'YOUR_VALUE_HERE:|NEEDS CLARIFICATION:' "$P/spec.md" "$P/plan.md" "$P/tasks.md" "$P/implementation-summary.md" | wc -l | tr -d ' '
```

4. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-card
test ! -d specs/zz-pb-card && echo "cleanup=ok"
```

### Expected

Step 1 prints `out=` followed by the scratch path, then `pointer=specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt`, then a brief line count above 20. Step 2 prints `devin_exit=0`, then the worker's last `RESULT` line, and leaves the reply file in the scratch path. Step 3 prints `packet=specs/zz-pb-card/001-card-authoring`, then `val_exit=0`, then `RESULT: PASSED`, then `0`. Step 4 prints `cleanup=ok`.

### Evidence

- The `out=` line, the `pointer=` line and the brief line count from step 1.
- The reply file in the scratch path from step 2 and the worker's last `RESULT` line.
- The packet path, the validation exit code, the `RESULT` line and the token count from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The worker returns a reply, the packet exists, strict validation prints `RESULT: PASSED`, the token count is `0` and the track is gone.
- **Fail**: The worker returns no reply, the packet is missing, strict validation fails, the token count is above zero, or the track remains.

### Failure Triage

A missing packet means the worker did not run the scaffold command, so read `$OUT/reply.txt` and `$OUT/reply.err` and check that `devin auth status` prints `Logged in` before retrying. A free-tier rate-limit reply is a retry and not a FAIL, so wait for the reset the message names and run step 2 again. A failed strict run means the packet is incomplete, so read `$OUT/val.txt` and name the rule. A token count above zero means the card did not drive a finished fill, so record the token lines in `$OUT/val.txt` before the next run. Remove `specs/zz-pb-card` before every retry.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [spec-authoring-card.md](../../feature-catalog/tooling-and-scripts/spec-authoring-card.md)
- Implementation: [spec-authoring-card.md](../../references/workflows/spec-authoring-card.md)

Provenance: manual only - cli-devin swe-2-max, permission mode dangerous

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 483
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/level-1-packet-authored-from-card.md`
