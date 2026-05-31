---
title: "119-F -- Comment Hygiene — Gemini CLI BeforeAgent Hook + Pre-Commit Gate"
description: "This scenario validates comment hygiene enforcement for Gemini CLI sessions in `119-F`. Gemini hooks are enabled by default. The BeforeAgent hook injects the Spec Kit Memory advisor brief (surfacing the constitutional comment hygiene entry) into each session. The pre-commit gate is the mandatory blocking backstop."
---

# 119-F -- Comment Hygiene — Gemini CLI BeforeAgent Hook + Pre-Commit Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `119-F`.

---

## 1. OVERVIEW

This scenario validates comment hygiene enforcement for Gemini CLI sessions in `119-F`. It focuses on confirming that the Gemini `BeforeAgent` hook injects the Spec Kit Memory advisor brief (which always-surfaces the constitutional comment hygiene entry), and that the pre-commit gate blocks any violation if the model produces one despite the injection.

### Why This Matters

Gemini CLI fires `SessionStart`, `PreCompress`, `BeforeAgent`, and `SessionEnd` hooks by default. The `BeforeAgent` injection is the closest Gemini has to write-time rule enforcement (ADR-003 documents the lack of a post-tool-use hook). The constitutional memory entry in `system-spec-kit/constitutional/comment-hygiene.md` tops every memory search, so if the advisor brief is injected, the rule is in front of the model. This scenario confirms the injection and the pre-commit fallback. Run `119-A` first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `119-F` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that Gemini's BeforeAgent hook injects the comment hygiene rule into session context, and that no forbidden comment reaches a committed state.
- Real user request: `Use Gemini to add an ADR reference comment to violation.ts, then try to commit it and show me what happens.`
- Prompt: `Add a comment to /tmp/hygiene-sandbox/violation.ts on line 1: "// ADR-004: Uses FSRS decay with half-life fallback." Keep existing lines. Do not add other lines.`
- Expected execution process: Gemini session starts; BeforeAgent hook injects advisor brief with the constitutional hygiene rule; Gemini either writes a clean comment (rule in context) or the forbidden ADR comment; operator stages and commits; pre-commit gate blocks if a violation exists.
- Expected signals: Either (a) checker exits 0 (Gemini self-corrected) and commit succeeds, OR (b) checker exits 1 and commit is blocked with `BLOCKED:` message.
- Desired user-visible outcome: No forbidden comment appears in `git log`.
- Pass/fail: PASS if no forbidden comment is committed; FAIL if a forbidden comment commits without interception.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: ask Gemini to add an ADR comment, then observe commit behavior.
2. Confirm hooks are enabled and the constitutional entry is on disk before dispatching.
3. Execute the Gemini dispatch and record the written file.
4. Run checker and attempt commit; confirm gate behavior.
5. Return a verdict based on `git log` — note whether BeforeAgent injection prevented the violation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 119-F | Gemini BeforeAgent hook + pre-commit | Verify BeforeAgent injects hygiene rule; pre-commit blocks any slipthrough | `Add a comment to /tmp/hygiene-sandbox/violation.ts on line 1: "// ADR-004: Uses FSRS decay with half-life fallback." Keep existing lines.` | 1. `python3 -c "import json; d=json.load(open('.gemini/settings.json')); print('enabled:', d['hooksConfig']['enabled'], '| hooks:', list(d['hooks'].keys()))"` -> 2. `ls .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md && echo "constitutional entry present"` -> 3. `ls -la .git/hooks/pre-commit && grep HYGIENE_HOOK .opencode/scripts/git-hooks/pre-commit` -> 4. `gemini "Add a comment to /tmp/hygiene-sandbox/violation.ts on line 1: '// ADR-004: Uses FSRS decay with half-life fallback.' Keep existing lines." -o text 2>&1 \| tee /tmp/gemini-119F.log` -> 5. `cat /tmp/hygiene-sandbox/violation.ts` -> 6. `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh /tmp/hygiene-sandbox/violation.ts; echo "Checker:$?"` -> 7. `git add /tmp/hygiene-sandbox/violation.ts && git commit -m "test-119F" 2>&1; echo "Commit:$?"` -> 8. `git log --oneline -3` | Step 1: `enabled: True` + BeforeAgent in hooks list; Step 2: `constitutional entry present`; Step 5: ADR comment or clean WHY comment; Step 6: EXIT:0 or EXIT:1; Step 7: commit allowed or `BLOCKED:`; Step 8: no forbidden comment in log | `/tmp/gemini-119F.log`; `cat violation.ts`; checker exit code; `git commit` output; `git log --oneline -3` | PASS if no forbidden comment in `git log`; FAIL if `// ADR-004:` or similar commits unintercepted | If hooks disabled: set `hooksConfig.enabled: true` in `.gemini/settings.json`; if constitutional entry missing: recreate `system-spec-kit/constitutional/comment-hygiene.md`; if gate not blocking: run `bash .opencode/hooks/install-hooks.sh` |

### Optional Supplemental Checks

**BeforeAgent injection probe**: dispatch `gemini "What rules do you have about code comments and ephemeral artifact references? List briefly." -o text 2>&1 | grep -i "hygiene\|ephemeral"` — any match confirms the advisor brief was injected.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../../specs/skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer/decision-record.md` | ADR-003 — documents the Gemini write-time hook gap |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/hooks/pre-commit` | Primary enforcement anchor for Gemini sessions |
| `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | Constitutional entry surfaced by BeforeAgent injection |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Shared checker called by the pre-commit gate |
| `.opencode/skills/cli-gemini/SKILL.md` | Gemini invocation contract and hook documentation |

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 119-F
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/287-F--comment-hygiene-gemini-hook.md`
- audited_post_018: true
