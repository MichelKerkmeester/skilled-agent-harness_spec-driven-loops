---
title: "DV-019 -- Continue and resume session continuity"
description: "Verify Devin's list, continue, and resume flags preserve context across non-interactive turns."
version: 1.0.0.0
---

# DV-019 -- Continue and resume session continuity

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-019`.

## 1. OVERVIEW

Create one bounded session, list it, continue the most recent session, and resume it by id where the installed build exposes one. The scenario does not test `/fork` or `/revert` because those are interactive state-changing extensions.

### Why This Matters

`devin -p` is stateless by default. A routing layer must choose `--continue` or `--resume` deliberately when a task depends on prior conversation context.

---

## 2. SCENARIO CONTRACT

- Objective: Verify a second turn can retrieve context from a prior Devin session.
- Real user request: `Remember the token ALPHA-TEST in a disposable session, then continue and report it without changing files.`
- Prompt: `Remember the non-secret test token ALPHA-TEST for the next turn. Do not edit files; acknowledge only.`
- Expected execution process: Run an initial print session, list sessions as JSON, continue with `-c -p`, and if a session id is available repeat with `-r <id> -p` in the same directory.
- Expected signals: `devin list --format json` returns a session; the continue/resume turn can retrieve ALPHA-TEST; no repository mutation.
- Desired user-visible outcome: Evidence that session continuity is explicit and reproducible.
- Pass/fail: PASS when context survives the selected operation; FAIL when the tool claims continuation but loses context; SKIP when the build/auth cannot create or list a session.

---

## 3. TEST EXECUTION

1. `DV019_DIR=$(mktemp -d /tmp/cli-devin-dv019.XXXXXX); cd "$DV019_DIR"`
2. `devin -p "Remember the non-secret test token ALPHA-TEST for the next turn. Do not edit files; acknowledge only." --model adaptive --permission-mode normal </dev/null > first.txt 2>&1; echo "exit=$?" >> first.txt`
3. `devin list --format json > sessions.json 2>&1; echo "exit=$?" >> sessions.json`
4. `devin -c -p "Report the non-secret token remembered from the previous turn. Do not edit files." --model adaptive --permission-mode normal </dev/null > continued.txt 2>&1; echo "exit=$?" >> continued.txt`
5. If `sessions.json` yields an id, run `devin -r <session-id> -p "Report the remembered token." --model adaptive --permission-mode normal </dev/null`.

| Feature ID | Exact commands | Expected signal | Verdict |
|---|---|---|---|
| DV-019 | Initial `-p`, `list --format json`, `-c -p`, optional `-r` | Prior context retrievable | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Continuity scope and isolation policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Continue/resume flags and session commands |
| `../../SKILL.md` | `-p` statelessness and explicit dispatch discipline |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: DV-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/resume-continue.md`
