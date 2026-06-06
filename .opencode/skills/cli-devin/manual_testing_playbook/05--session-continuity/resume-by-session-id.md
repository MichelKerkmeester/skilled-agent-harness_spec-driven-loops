---
title: "DV-015 -- devin --resume <id> (specific session)"
description: "This scenario validates that devin --resume <ID> resumes a specific session by id and supports out-of-order resume (resume an older session while a newer one exists)."
---

# DV-015 -- devin --resume <id> (specific session)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-015`.

---

## 1. OVERVIEW

This scenario validates `devin --resume <ID>` (alias `-r`) for `DV-015`. The flag resumes a specific session by id, supporting out-of-order resume — operators can revisit an older session even after newer sessions exist.

### Why This Matters

`--resume <id>` is the precise continuity surface. `--continue` only resumes the most recent; `--resume <id>` lets operators branch back to a specific session for follow-up work or comparison. Combined with `devin list`, it forms the operator's session-management toolkit.

**v1.0.2.0 finding** (promoted from SKIP to PASS): session ids are human-friendly kebab-case slugs (e.g. `paint-bean`, `quick-fox`), NOT UUIDs as cli-* family conventions suggested. Use `devin list --format json` (the canonical non-interactive list shape) and read the `id` field. The default `devin list` mode is an interactive picker that prints `No session selected.` when piped — operators automating session-id capture MUST use `--format json`.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin --resume <ID>` resumes a specific session by id and that resuming an older session works while a newer one exists.
- Real user request: `I started three different sessions earlier today — go back to the first one and continue it specifically, even though I've done two newer sessions since.`
- Prompt: `Dispatch three sequential sessions, capture each session id, then resume the FIRST one with --resume <id> and confirm continuity.`
- Expected execution process: Operator dispatches three short sessions (capturing each session id from `devin list` or stdout) -> resumes the FIRST session id with `--resume <id>` -> verifies the resumed turn references the first session's context, not the most recent.
- Expected signals: All invocations exit 0. The resumed turn references its original session's context (not the most recent session's). Dispatched command line for the resume includes `--resume <id>` with a valid id from the first dispatch.
- Desired user-visible outcome: Operators can revisit older Devin sessions out of order, useful for branching work or comparing approaches.
- Pass/fail: PASS if all dispatches exit 0 AND the resumed turn references the first session's context. FAIL if resume targets the wrong session or if any dispatch errors.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch session 1 with a unique sentinel topic (e.g. "TypeScript clamp function").
2. Capture session 1 id from `devin list` or stdout.
3. Dispatch session 2 with a different sentinel topic (e.g. "Python decorator").
4. Dispatch session 3 with a third sentinel (e.g. "Go goroutine").
5. Run `devin --resume <session-1-id>` with a follow-up prompt for the clamp function.
6. Verify the resumed output references the clamp function, NOT the Go goroutine.
7. Return a PASS/FAIL verdict naming the session id and the sentinel topic observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-015 | `devin --resume <id>` (specific session) | Verify --resume <id> targets the correct session out of order; session ids are kebab-case slugs (e.g. `paint-bean`) via `devin list --format json` | `Dispatch three sequential sessions, capture each session id via devin list --format json, then resume the FIRST one with --resume <slug> and confirm continuity.` | 1. `devin -p "Sketch a TypeScript clamp(n, min, max) function." --model swe-1.6 --permission-mode auto > /tmp/dv-015-s1.txt 2>&1 </dev/null; echo "S1 exit: $?"` -> 2. `devin -p "Sketch a Python decorator @timed that logs elapsed time." --model swe-1.6 --permission-mode auto > /tmp/dv-015-s2.txt 2>&1 </dev/null; echo "S2 exit: $?"` -> 3. `devin -p "Sketch a Go goroutine that fans out 10 workers." --model swe-1.6 --permission-mode auto > /tmp/dv-015-s3.txt 2>&1 </dev/null; echo "S3 exit: $?"` -> 4. `bash: devin list --format json > /tmp/dv-015-list.json 2>&1; SESSION_1_ID=$(python3 -c "import json,sys; data=json.load(open('/tmp/dv-015-list.json')); print(data[-1]['id'])"); echo "Session 1 id (oldest of the 3): $SESSION_1_ID"` -> 5. `devin --resume "$SESSION_1_ID" -p "Now write a unit test for the clamp function from earlier." > /tmp/dv-015-resume.txt 2>&1 </dev/null; echo "Resume exit: $?"` -> 6. `bash: grep -E "clamp\|min\|max" /tmp/dv-015-resume.txt` | Steps 1-3, 5: all exit 0; Step 4: SESSION_1_ID is a non-empty kebab-case slug; Step 6: resumed output references clamp, not goroutine | All four captured stdouts, session list JSON snapshot, dispatched command lines with the resolved session slug | PASS if all dispatches exit 0 AND resumed output references the FIRST session's topic; FAIL if resume picks the wrong session or any dispatch errors | (1) `devin list` defaults to interactive picker — use `--format json` for parseable output; (2) session ids are human-friendly slugs (e.g. `paint-bean`), NOT UUIDs as cli-* family conventions suggest; (3) confirm session retention policy hasn't evicted the first session — older sessions in `devin list --format json` should still appear |

### Optional Supplemental Checks

- Test `--resume --fork <id>` (if supported) to branch from an existing session into a divergent path.
- Compare list output before and after to confirm session ordering.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map, §4 Flags) | Documents `--resume <ID>` / `-r` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Essential Commands (resume specific) |
| `../../references/devin_tools.md` (§1.7) | Cross-CLI session-continuity comparison |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: DV-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/resume-by-session-id.md`
