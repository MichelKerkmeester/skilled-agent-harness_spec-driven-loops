---
title: "119-D -- Comment Hygiene — Devin Pre-Commit Gate"
description: "This scenario validates comment hygiene enforcement for Devin sessions in `119-D`. Devin has no write-time hook (ADR-004). The pre-commit gate is the sole enforcement mechanism. This scenario confirms that a Devin-authored forbidden comment is blocked at commit time, and that a clean comment commits without interference."
---

# 119-D -- Comment Hygiene — Devin Pre-Commit Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `119-D`.

---

## 1. OVERVIEW

This scenario validates comment hygiene enforcement for Devin sessions in `119-D`. It focuses on confirming that the git pre-commit gate blocks a Devin-authored forbidden comment at commit time, and that a clean durable-WHY comment passes through without interference.

### Why This Matters

Devin (SWE-1.6) has no write-time or post-tool-use hook (ADR-004). The pre-commit gate is the only enforcement mechanism for Devin-authored code. If the gate is not installed or is bypassed, Devin can commit forbidden comments without any interception. This scenario is the definitive proof that the mandatory floor holds for Devin. Run `119-A` first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `119-D` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the pre-commit gate blocks a Devin-authored file with a forbidden comment, and allows a Devin-authored file with only a clean durable-WHY comment.
- Real user request: `Ask Devin to add an ADR reference comment to violation.ts. Then try to commit it and see what happens.`
- Prompt: `Edit /tmp/hygiene-sandbox/violation.ts. Add a comment on line 1: "// ADR-007: This implements the lease cleanup strategy." Keep the existing const x = 1 line.`
- Expected execution process: Devin writes the forbidden ADR comment; operator stages and commits; pre-commit gate fires and blocks; operator repeats with a clean comment prompt; gate allows the commit.
- Expected signals: First commit → `BLOCKED: 1 file(s) contain ephemeral-artifact pointers`; second commit (clean WHY) → exits 0.
- Desired user-visible outcome: The ADR comment never appears in `git log`. The clean comment commits successfully.
- Pass/fail: PASS if first commit is blocked and second commit succeeds; FAIL if the ADR comment commits without interception.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: ask Devin to add an ADR comment, then observe commit behavior.
2. Confirm pre-commit gate is installed before dispatching Devin.
3. Execute Devin dispatch with the violation prompt and record the written file.
4. Attempt commit and confirm gate fires; then repeat with clean prompt and confirm commit passes.
5. Return a verdict based on `git log` contents.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 119-D | Devin pre-commit gate | Verify pre-commit blocks Devin-authored forbidden comment; clean comment passes | `Edit /tmp/hygiene-sandbox/violation.ts. Add a comment on line 1: "// ADR-007: This implements the lease cleanup strategy." Keep the existing const x = 1 line.` | 1. `ls -la .git/hooks/pre-commit && grep HYGIENE_HOOK .opencode/scripts/git-hooks/pre-commit` -> 2. `cat > /tmp/devin-119D-violation.md <<'EOF'\nEdit /tmp/hygiene-sandbox/violation.ts. Add comment on line 1: "// ADR-007: This implements the lease cleanup strategy." Keep: const x = 1;\nEOF` -> 3. `devin --prompt-file /tmp/devin-119D-violation.md --model swe-1.6 --permission-mode auto 2>&1 \| tee /tmp/devin-119D.log` -> 4. `cat /tmp/hygiene-sandbox/violation.ts` -> 5. `git add /tmp/hygiene-sandbox/violation.ts && git commit -m "test-119D-violation" 2>&1; echo "Commit1:$?"` -> 6. `git status && git log --oneline -3` -> 7. (negative) `devin "Edit /tmp/hygiene-sandbox/violation.ts line 1: // Runs unconditionally — partial shutdown cannot orphan leases. Keep const x=1." --model swe-1.6 --permission-mode auto 2>&1` -> 8. `git add /tmp/hygiene-sandbox/violation.ts && git commit -m "test-119D-clean" 2>&1; echo "Commit2:$?"` | Step 1: pre-commit linked + HYGIENE_HOOK present; Step 4: ADR-007 comment present; Step 5: `BLOCKED:` message + Commit1:1; Step 6: ADR comment not in `git log`; Step 8: Commit2:0 | `/tmp/devin-119D.log`; `cat violation.ts`; `git commit` output for both attempts; `git log --oneline -3` | PASS if first commit exits 1 with BLOCKED message and ADR comment does not appear in `git log`; second commit exits 0; FAIL if ADR comment commits unintercepted | If gate not blocking: run `bash .opencode/hooks/install-hooks.sh`; if `SPECKIT_SKIP_COMMENT_HYGIENE=1` is set: unset it; if Devin auth fails: run `devin auth status` |

### Optional Supplemental Checks

**Devin self-correction check**: if Devin writes a clean comment despite the prompt asking for an ADR reference, the AGENTS.md rule was in Devin's context (from the project file). Note this as a positive outcome in the evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../../specs/skilled-agent-orchestration/119-comment-ref-hygiene/002-active-enforcement-layer/decision-record.md` | ADR-004 — documents the Devin write-time hook gap |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/hooks/pre-commit` | Primary enforcement anchor — blocking gate for all runtimes |
| `.opencode/scripts/git-hooks/pre-commit` | Symlink target — integrates hygiene gate |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Shared checker called by the pre-commit gate |

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 119-D
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/286-D--comment-hygiene-devin-precommit.md`
- audited_post_018: true
