---
title: "decision-capture-save-writer -- Decision capture save writer"
description: "This scenario validates the operatorDecisions save path for `decision-capture-save-writer`. It focuses on a plan-only save writing nothing, a full-auto save writing one decision row with its verbatim appendix item, and a repeat save leaving the record byte-identical."
trigger_phrases:
  - "operator decisions save"
  - "decision record writer"
  - "verbatim operator answers"
version: 1.0.0.0
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

- Objective: Prove plan-only leaves `decision-record.md` untouched, full-auto adds exactly one new `Q` row and appendix item with the exact answer, and a second full-auto save changes no byte.
- Real user request: `I want my answer about the badge colour in the decision record. Can you show me the save adds it once, keeps my exact words, and doesn't add it again if I save twice?`
- Prompt: `Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.`
- Expected execution process: Build the scratch repository in section 3, run a plan-only save, then two full-auto saves, and compare the decision record after each. Never point the save at the real repository's `specs/`.
- Expected signals: the plan-only save exits 0, logs `Operator decisions proposed` and leaves the record byte-identical; the first full-auto save exits 0, logs `Wrote 1 operator decision(s)`, and the diff adds one `| Q008 | Use amber for the status badge.` row plus a `### Q008` appendix item with `<!-- source: claude:fixture-session:toolu_fixture:0 -->` and the answer `Amber`; the second full-auto save exits 0 and `cmp` reports the record identical; `consumed.jsonl` sits inside the scratch repository.
- Desired user-visible outcome: A PASS or FAIL verdict quoting the new row and the `cmp` result.
- Pass/fail: PASS if every expected signal is observed, FAIL if plan-only writes, a row appears twice, the answer text differs, or anything is written in the real repository.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Save one operator decision into a throwaway packet and show me it lands once with my exact answer, and that saving again changes nothing.`

### Commands

1. Build a scratch repository that uses spec-kit, with a copy of a Level 3 packet:

```bash
R="$PWD"; F="$(mktemp -d)"
mkdir -p "$F/specs/demo" "$F/.skilled/skills" "$F/.opencode"
rsync -a --exclude scratch specs/system-speckit/042-decision-capture/ "$F/specs/demo/001-demo/"
ln -s "$R/.skilled/skills/system-spec-kit" "$F/.skilled/skills/system-spec-kit"
git -C "$F" init -q
cp "$F/specs/demo/001-demo/decision-record.md" "$F/before.md"
J='{"sessionSummary":"Record the badge colour decision","triggerPhrases":["badge colour decision"],"operatorDecisions":[{"sourceKey":"claude:fixture-session:toolu_fixture:0","decided":"Use amber for the status badge.","why":"Amber reads as a warning without implying failure.","carriedBy":"spec.md REQ-001","question":"Which colour should the status badge use?","options":["Amber","Red"],"answer":"Amber"}]}'
SAVE() { (cd "$F" && SPEC_KIT_DB_DIR="$F/.db" node "$R/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js" --project-root "$F" "$@" --json "$J" specs/demo/001-demo); }
```

2. Plan-only save: `SAVE > "$F/plan.log" 2>&1; echo "exit=$?"; grep -c "Operator decisions proposed" "$F/plan.log"; cmp "$F/before.md" "$F/specs/demo/001-demo/decision-record.md" && echo UNCHANGED`
3. First full-auto save: `SAVE --full-auto > "$F/save1.log" 2>&1; echo "exit=$?"; grep -c "Wrote 1 operator decision" "$F/save1.log"; diff "$F/before.md" "$F/specs/demo/001-demo/decision-record.md"; cp "$F/specs/demo/001-demo/decision-record.md" "$F/after1.md"`
4. Second full-auto save: `SAVE --full-auto > "$F/save2.log" 2>&1; echo "exit=$?"; cmp "$F/after1.md" "$F/specs/demo/001-demo/decision-record.md" && echo BYTE_IDENTICAL; grep -c "| Q008 |" "$F/specs/demo/001-demo/decision-record.md"`
5. Confirm the consumed log stayed in the scratch repository and no tracked file in the real packet changed: `ls "$F/.skilled/skills/.state/decision-capture/consumed.jsonl" && git -C "$R" status --short --untracked-files=no specs/system-speckit/042-decision-capture`. Leave `$F` in place: it is a `mktemp -d` folder under the system temp directory.

### Expected

Step 2 prints `exit=0`, a count of 1 and `UNCHANGED`. Step 3 prints `exit=0`, a count of 1, and a diff that adds only the `Q008` row and the `### Q008` appendix item whose fenced blocks hold `Which colour should the status badge use?`, `Amber` and `Red`, and `Amber`. Step 4 prints `exit=0`, `BYTE_IDENTICAL` and a `Q008` row count of 1. Step 5 lists the scratch `consumed.jsonl` and `git status` prints nothing, because untracked run notes in the real packet are left out of the check.

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
3. A second `Q008` row or a changed byte: check the source-key lookup in `decision-record-writer.ts`.

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
