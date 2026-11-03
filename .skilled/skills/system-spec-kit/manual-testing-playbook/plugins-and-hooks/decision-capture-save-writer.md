---
title: "decision-capture-save-writer -- Decision capture save writer"
description: "This scenario validates the operatorDecisions save path for `decision-capture-save-writer`. It focuses on a plan-only save writing nothing, a full-auto save writing one decision row with its verbatim appendix item, and a repeat save leaving the record byte-identical."
trigger_phrases:
  - "operator decisions save"
  - "decision record writer"
  - "verbatim operator answers"
version: 1.0.2.0
---

# decision-capture-save-writer -- Decision capture save writer

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `decision-capture-save-writer`.

---

## 1. OVERVIEW

This scenario validates the operatorDecisions save path for `decision-capture-save-writer`. It focuses on a plan-only save writing nothing, a full-auto save writing one decision row with its verbatim appendix item, and a repeat save leaving the record byte-identical.

`generate-context.js` accepts an `operatorDecisions` array in its JSON payload. A plan-only save lists the entries. A `--full-auto` save hands them to `decision-record-writer.ts`, which gives each source key a stable `Q` id, upserts a row under the operator-decisions anchor, writes the exact question, options and answer under the verbatim appendix, and records the key in the gitignored `consumed.jsonl`.

### Why This Matters

A save that writes on plan-only, repeats a row on a second save, or loses the exact answer text would make the decision record untrustworthy. The scenario runs in a throwaway repository so the real `specs/` tree is never written.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `decision-capture-save-writer` and confirm the expected signals without contradictory evidence.

- Objective: Prove plan-only leaves `decision-record.md` untouched, full-auto adds exactly one new `Q` row, under the next free id, and appendix item with the exact answer, the consumed log records the key once, and a second full-auto save changes no byte.
- Real user request: `I want my answer about the badge colour in the decision record. Can you show me the save adds it once, keeps my exact words, and doesn't add it again if I save twice?`
- Prompt: `Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.`
- Expected execution process: Build the scratch repository in section 3, save the real repository status listing, run a plan-only save, then two full-auto saves, and compare the decision record and consumed log after each. Never point the save at the real repository's `specs/`.
- Expected signals: the plan-only save exits 0, logs `Operator decisions proposed` and leaves the record byte-identical; the first full-auto save exits 0, logs `Wrote 1 operator decision(s)`, adds one `| $NEXT | Use amber for the status badge.` row plus its `### $NEXT` appendix item, where `$NEXT` is one past the highest `Q` id in the copied record with `<!-- source: claude:fixture-session:toolu_fixture:0 -->` and the answer `Amber`, and leaves exactly 1 line in the scratch `consumed.jsonl`; the second full-auto save exits 0, `cmp` reports the record identical, and the consumed log still has exactly 1 line; step 5 confirms that the consumed row maps the fixture key to `$NEXT` and the real-repository status listing matches step 1.
- Desired user-visible outcome: A PASS or FAIL verdict quoting the new row, consumed-line counts, consumed key and id, and both comparison results.
- Pass/fail: PASS if every expected signal is observed, FAIL if plan-only writes, a row appears twice, the answer text differs, either consumed-line count differs from 1, the consumed row has the wrong key or id, the repository status changes, or anything is written in the real repository.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.`

### Commands

1. Build a scratch repository that uses spec-kit, with a copy of a Level 3 packet:

```bash
R="$PWD"; F="$(mktemp -d)"
git -C "$R" status --short --ignored -- specs/system-speckit/043-decision-capture/001-decision-capture-build .skilled/skills/.state/decision-capture > "$F/repo-status.before"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
rsync -a --exclude scratch specs/system-speckit/043-decision-capture/001-decision-capture-build/ "$F/specs/demo/001-demo/"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
cp "$F/specs/demo/001-demo/decision-record.md" "$F/before.md"
L=$(grep -oE '^\| Q[0-9]+ \|' "$F/before.md" | tr -dc '0-9\n' | sort -n | tail -1); NEXT=$(printf 'Q%03d' $((10#${L:-0} + 1))); echo "NEXT=$NEXT"
J='{"sessionSummary":"Record the badge colour decision","triggerPhrases":["badge colour decision"],"operatorDecisions":[{"sourceKey":"claude:fixture-session:toolu_fixture:0","decided":"Use amber for the status badge.","why":"Amber reads as a warning without implying failure.","carriedBy":"spec.md REQ-001","question":"Which colour should the status badge use?","options":["Amber","Red"],"answer":"Amber"}]}'
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }
```

2. Plan-only save: `SAVE > "$F/plan.log" 2>&1; echo "exit=$?"; grep -c "Operator decisions proposed" "$F/plan.log"; cmp "$F/before.md" "$F/specs/demo/001-demo/decision-record.md" && echo UNCHANGED`
3. First full-auto save: `SAVE --full-auto > "$F/save1.log" 2>&1; save_status=$?; echo "exit=$save_status"; test "$save_status" -eq 0 || exit "$save_status"; grep -c "Wrote 1 operator decision" "$F/save1.log"; diff "$F/before.md" "$F/specs/demo/001-demo/decision-record.md"; cp "$F/specs/demo/001-demo/decision-record.md" "$F/after1.md"; consumed_lines=$(wc -l < "$F"/.skilled/skills/.state/decision-capture/*/consumed.jsonl | tr -d '[:space:]'); test "$consumed_lines" -eq 1 || { echo "expected 1 consumed line, got $consumed_lines"; exit 1; }; echo "CONSUMED_LINES=$consumed_lines"`
4. Second full-auto save: `SAVE --full-auto > "$F/save2.log" 2>&1; save_status=$?; echo "exit=$save_status"; test "$save_status" -eq 0 || exit "$save_status"; cmp "$F/after1.md" "$F/specs/demo/001-demo/decision-record.md" && echo BYTE_IDENTICAL || exit 1; q_rows=$(grep -c "| $NEXT |" "$F/specs/demo/001-demo/decision-record.md"); test "$q_rows" -eq 1 || { echo "expected 1 $NEXT row, got $q_rows"; exit 1; }; echo "NEXT_ROWS=$q_rows"; consumed_lines=$(wc -l < "$F"/.skilled/skills/.state/decision-capture/*/consumed.jsonl | tr -d '[:space:]'); test "$consumed_lines" -eq 1 || { echo "expected 1 consumed line, got $consumed_lines"; exit 1; }; echo "CONSUMED_LINES=$consumed_lines"`
5. Confirm the consumed fixture row and real-repository status: This fixture key is not in a queue file because the scenario supplies it directly in the save payload, so this step checks the consumed row's key and id instead. `node --input-type=module -e 'import { readFileSync } from "node:fs"; const fixtureKey = "claude:fixture-session:toolu_fixture:0"; const rows = readFileSync(process.argv[1], "utf8").split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)); const matches = rows.filter((row) => row.key === fixtureKey); if (matches.length !== 1 || matches[0].id !== process.argv[2]) throw new Error("expected one consumed fixture row for " + process.argv[2]); console.log("CONSUMED_KEY_ID=" + fixtureKey + ":" + matches[0].id);' "$F"/.skilled/skills/.state/decision-capture/*/consumed.jsonl "$NEXT" && git -C "$R" status --short --ignored -- specs/system-speckit/043-decision-capture/001-decision-capture-build .skilled/skills/.state/decision-capture > "$F/repo-status.after" && cmp "$F/repo-status.before" "$F/repo-status.after" && echo REPO_STATUS_UNCHANGED`. Leave `$F` in place: it is a `mktemp -d` folder under the system temp directory.

### Expected

Step 1 prints `NEXT=` and the next free id. Step 2 prints `exit=0`, a count of 1 and `UNCHANGED`. Step 3 prints `exit=0`, a count of 1, a diff that adds only the `$NEXT` row and its appendix item, and `CONSUMED_LINES=1`. Step 4 prints `exit=0`, `BYTE_IDENTICAL`, `NEXT_ROWS=1` and `CONSUMED_LINES=1`. Step 5 prints `CONSUMED_KEY_ID=claude:fixture-session:toolu_fixture:0:` followed by that id and `REPO_STATUS_UNCHANGED` after comparing the real repository listing with step 1.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: Every expected signal in the Scenario Contract is observed in the captured output.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

1. A save that logs `is not inside a repository that uses spec-kit`: the scratch repository lacks `.skilled/skills/system-spec-kit`, and the save would fall back to the runtime repository. Stop and rebuild step 1.
2. `Refusing to write graph metadata outside a configured specs root`: the scratch repository lacks its `.opencode` folder.
3. A second `$NEXT` row or a changed byte: check the source-key lookup in `decision-record-writer.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

Feature catalog: [ux-hooks/operator-decision-capture.md](../../feature-catalog/ux-hooks/operator-decision-capture.md)

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Row and appendix upsert, level guard, consumed log |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Plans and writes the entries during a save |
| `.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts` | Validates the `operatorDecisions` payload |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts` | Writer regression suite |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts` | Save regression suite |

Provenance: .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-save-writer
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/decision-capture-save-writer.md`
