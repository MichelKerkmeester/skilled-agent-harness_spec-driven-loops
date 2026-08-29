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

### Prompt

Prompt: `Inspect the repository's Cursor agent mirror directory. Report whether every agent file is a symlink resolving into .claude/agents/, and do not edit files.`

### Commands

1. `for f in .cursor/agents/*.md; do test -L "$f" || exit 1; target=$(readlink -f "$f") || exit 1; case "$target" in "$PWD"/.claude/agents/*.md) ;; *) echo "bad target: $f -> $target"; exit 1 ;; esac; done`
2. `find .cursor/agents -maxdepth 1 -type f -name '*.md' -print | wc -l` (must be 0; symlinks are not regular files).
3. `cursor-agent -p "Inspect the repository's Cursor agent mirror directory. Report whether every agent file is a symlink resolving into .claude/agents/, and do not edit files." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu025.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu025.txt`

### Expected

Step 1 exits 0 with every entry a symlink resolving under `.claude/agents/`. Step 2 prints `0`. Step 3's dispatch reports the mirror as intact with no forked file named.

### Evidence

Record `cursor-agent about` output-text auth evidence, the step 1/2 exit codes, and the audit summary captured in `/tmp/cli-cursor-cu025.txt` from step 3.

### Pass / Fail

- **Pass**: all mirrors satisfy the symlink and target-root checks in steps 1-2, and step 3's summary agrees.
- **Fail**: any regular file, broken link, or target outside `.claude/agents/` is found, or step 3 contradicts the filesystem audit.
- **Skip**: only the step 3 `cursor-agent` dispatch is SKIP when Cursor authentication or availability blocks that specific summary call; the filesystem audit in steps 1-2 is hermetic and does not SKIP.

### Failure Triage

1. **Broken/forked mirror**: step 1 or step 2 fails; identify the exact `.cursor/agents/*.md` entry, restore it as a symlink into `.claude/agents/`, and re-run the audit.
2. **Auth/availability blocker**: step 3 fails to authenticate or dispatch; capture the `cursor-agent about` output and record the SKIP with that exact blocker.
3. **Summary mismatch**: step 3 reports a fork or broken link that steps 1-2 do not confirm, or the reverse; trust the filesystem audit and re-run step 3 once the discrepancy is understood.

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
