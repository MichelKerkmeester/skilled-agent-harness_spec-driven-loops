---
title: "CU-025 -- Agent mirror symlink integrity"
description: "Verify every Cursor agent file is a symlink resolving into the canonical Claude agent directory rather than a forked real file."
version: 1.0.0.0
---

# CU-025 -- Agent mirror symlink integrity

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `CU-025`.

## 1. OVERVIEW

Audit every `.cursor/agents/*.md` entry for symlink type, target resolution, canonical directory, and non-empty content.

### Why This Matters

Real files would fork agent instructions and allow Cursor behavior to drift from Claude's canonical roster. The mirror contract is one source of truth, not copied content.

---

## 2. SCENARIO CONTRACT

- Objective: Prove every Cursor agent mirror is a symlink into `.claude/agents/` and no real fork exists.
- Real user request: `Audit Cursor's agent mirrors for symlink integrity and report any forked files.`
- Prompt: `Inspect the repository's Cursor agent mirror directory. Report whether every agent file is a symlink resolving into .claude/agents/, and do not edit files.`
- Expected execution process: Run the filesystem audit, then use a read-only Cursor dispatch to summarize the result; do not replace or rewrite any link.
- Expected signals: 13 `.cursor/agents/*.md` entries; every `test -L` succeeds; every `readlink -f` target is under `.claude/agents/`; no regular `.md` fork is present.
- Desired user-visible outcome: A reproducible integrity report with one canonical source per agent.
- Pass/fail: PASS when all mirrors satisfy the symlink and target-root checks; FAIL on any regular file, broken link, or target outside `.claude/agents/`; SKIP only on Cursor auth/availability blockers for the summary dispatch (the filesystem audit itself can still be PASS).

---

## 3. TEST EXECUTION

1. `for f in .cursor/agents/*.md; do test -L "$f" || exit 1; target=$(readlink -f "$f") || exit 1; case "$target" in "$PWD"/.claude/agents/*.md) ;; *) echo "bad target: $f -> $target"; exit 1 ;; esac; done`
2. `find .cursor/agents -maxdepth 1 -type f -name '*.md' -print | wc -l` (must be 0; symlinks are not regular files).
3. `cursor-agent -p "Inspect the repository's Cursor agent mirror directory. Report whether every agent file is a symlink resolving into .claude/agents/, and do not edit files." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu025.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu025.txt`
4. Record `cursor-agent about` output-text auth evidence and the audit result.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| CU-025 | Symlink audit plus `cursor-agent -p ...` | 13 symlinks, all target `.claude/agents/`, no forks | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root evidence and shared-config policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | One-source-of-truth agent mirror contract |
| `../../../../.cursor/agents/` | Mirror directory under test |
| `../../../../.claude/agents/` | Canonical target directory |

---

## 5. SOURCE METADATA

- Group: Agents, Skills and Rules
- Playbook ID: CU-025
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agents-skills-rules/agent-mirror-integrity.md`
