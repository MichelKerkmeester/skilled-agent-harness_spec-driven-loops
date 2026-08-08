---
title: "CU-024 -- Command roster and invocation"
description: "Verify the runtime-derived Cursor command roster and invoke a mirrored command through cursor-agent."
version: 1.0.0.0
---

# CU-024 -- Command roster and invocation

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `CU-024`.

## 1. OVERVIEW

Derive the `.cursor/commands/*.md` roster from the synchronizer's canonical scope rules and invoke `/speckit-plan` in a real Cursor print dispatch. The current worktree has 34 eligible canonical commands plus the runtime-native `goal-cursor.md`, for 35 files.

### Why This Matters

The command roster is a separate parity surface from custom agents. File presence must be paired with a real invocation so a stale or unreadable mirror cannot pass by counting alone.

## 2. SCENARIO CONTRACT

- Objective: Confirm the runtime-derived Cursor command roster matches the canonical command scope plus the native `goal-cursor.md` entry, and verify one representative command is invocable.
- Real user request: `Count Cursor's repository commands and use /speckit-plan to draft a documentation-only plan.`
- Prompt: `/speckit-plan Draft a short plan for adding a manual test scenario to a documentation-only packet. Do not create or modify files.`
- Expected execution process: Use `command-scope.cjs` and the synchronizer's exclusion rules to derive canonical membership -> compare the derived count with `.cursor/commands/*.md` -> verify links resolve -> dispatch `/speckit-plan` with explicit Cursor flags.
- Expected signals: The derived result is `canonical: 34`, `native: 1`, `expected: 35`, `actual: 35` in this worktree; `/speckit-plan` produces command-specific plan output; no unknown-command error or file mutation.
- Desired user-visible outcome: Complete roster plus one live invocation.
- Pass/fail: PASS when derived count, resolution, and invocation agree; FAIL on a missing/unreadable command or unknown command; SKIP on Cursor auth/availability blockers.

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run the canonical-scope count:

   ```bash
   node <<'NODE'
   const fs = require("node:fs");
   const path = require("node:path");
   const { isCanonicalMirrorExcluded } = require("./.opencode/skills/system-spec-kit/scripts/runtime-mirrors/command-scope.cjs");
   const excludedDirs = new Set(["assets", "scripts", "fixtures"]);
   const canonical = [];
   function walk(dir, relative = "") {
     for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
       const entryRelative = path.join(relative, entry.name).split(path.sep).join("/");
       if (entry.isDirectory()) {
         if (!excludedDirs.has(entry.name)) walk(path.join(dir, entry.name), entryRelative);
       } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md" && !entry.name.endsWith(".contract.md") && !isCanonicalMirrorExcluded(entryRelative)) {
         canonical.push(entryRelative);
       }
     }
   }
   walk(".opencode/commands");
   const native = fs.existsSync(".cursor/commands/goal-cursor.md") ? 1 : 0;
   const expected = canonical.length + native;
   const actual = fs.readdirSync(".cursor/commands").filter((name) => name.endsWith(".md")).length;
   console.log(JSON.stringify({ canonical: canonical.length, native, expected, actual }));
   if (actual !== expected) process.exit(1);
   NODE
   ```

2. `cursor-agent -p "/speckit-plan Draft a short plan for adding a manual test scenario to a documentation-only packet. Do not create or modify files." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /private/tmp/cli-cursor-cu024.txt 2>&1; status=$?; printf 'exit=%s\n' "$status" >> /private/tmp/cli-cursor-cu024.txt`
3. Inspect output text for command recognition and confirm `cursor-agent about` auth evidence; check `git status --porcelain`.

### Evidence

- JSON count output, command symlink targets, dispatch output, exit code, and `git status --porcelain`.

### Failure Triage

- If the count differs, inspect the canonical paths and the runtime-native `goal-cursor.md` entry before changing any mirror.
- If `/speckit-plan` is unknown, verify its canonical source and mirror target rather than substituting another command.
- If Cursor auth or availability blocks the dispatch, record the exact blocker as SKIP.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-024 | Command roster and invocation | Verify runtime-derived command count and `/speckit-plan` invocation | `Draft a short plan for adding a manual test scenario to a documentation-only packet. Do not create or modify files.` | Canonical-scope Node count -> `cursor-agent -p "/speckit-plan ..." --model composer-2.5 --auto-review --sandbox enabled --output-format text` -> inspect output and git status | `canonical: 34`, `native: 1`, `expected: 35`, `actual: 35`; command-specific output; no file mutation | Count JSON, symlink targets, dispatch output, exit code, and git status | PASS when derived count and invocation agree; SKIP on auth/availability blocker; FAIL on mirror drift or unknown command | Reconcile the canonical scope and native entry first; do not restore a hardcoded count |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory and command policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Cursor command-file parity boundary |
| `../../../../.cursor/commands/` | Cursor-facing command roster |
| `../../../../.opencode/commands/` | Canonical command bodies |

## 5. SOURCE METADATA

- Group: Agents, Skills and Rules
- Playbook ID: CU-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agents-skills-rules/command-roster-invocation.md`
