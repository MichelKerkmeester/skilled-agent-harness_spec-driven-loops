---
title: "DAL-018 -- sk-git exempt-subject pre-check vs post-hoc suppression"
description: "Verify git-generated subjects (Merge/Revert/fixup!/squash!/amend!) are a structural pre-check exemption (never evaluated), distinct from post-hoc known-deviation suppression, and that the pre-hook-install commit-date deviation matches on commitDate < HOOK_INSTALL_DATE."
version: 1.0.0.0
---

# DAL-018 -- sk-git exempt-subject pre-check vs post-hoc suppression

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-018`.

---

## 1. OVERVIEW

This scenario validates the two distinct exemption mechanisms in sk-git for `DAL-018`. The objective is to verify that git-generated subjects (`Merge`/`Revert "`/`fixup!`/`squash!`/`amend!`) are a structural PRE-CHECK exemption — `isExemptSubject` short-circuits `checkCommit` before any grammar is evaluated (mirroring the hook's own `case ... exit 0`) and is NOT implemented as a `knownDeviations` entry (REQ-005) — while the pre-hook-install carve-out IS a known-deviation entry whose `matchesDeviation` compares `finding.detail.commitDate` against `HOOK_INSTALL_DATE`.

### WHY THIS MATTERS

These are two genuinely different mechanisms, and conflating them would be a real bug. A structurally-guaranteed pre-check (git-generated subjects) must never even be graded; a post-hoc suppression (pre-hook-install commits) applies AFTER grading. Verifying the distinction keeps the adapter honest about which findings were never candidates versus which were suppressed after the fact.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify git-generated subjects are a structural pre-check exemption (not a known-deviation), and the pre-hook-install commit-date deviation is a post-hoc suppression.
- Real user request: Will merge commits and pre-hook-install commits get flagged for not following the commit format?
- Prompt: `Validate that sk-git treats git-generated subjects as a structural pre-check exemption (REQ-005), not a known-deviation suppression, and honors the pre-hook-install commit-date deviation.`
- Expected execution process: Confirm `isExemptSubject` short-circuits `checkCommit` (returns empty before grammar), that the exempt prefixes are NOT in the known-deviation JSON, and that `matchesDeviation` supports `requiresCommitBeforeHookInstall` against `HOOK_INSTALL_DATE`.
- Desired user-facing outcome: The user is told merge/revert/fixup-style commits are never even graded (structural), while genuinely pre-hook-install commits are graded then suppressed via the dated known-deviation entry.
- Expected signals: `isExemptSubject` short-circuits `checkCommit` before any grammar evaluation (empty findings, mirroring the hook's own `case ... exit 0`); the exemption is NOT implemented as a `knownDeviations` entry; `matchesDeviation` supports `requiresCommitBeforeHookInstall` comparing `finding.detail.commitDate` against `HOOK_INSTALL_DATE`.
- Pass/fail posture: PASS if the pre-check exemption short-circuits before grading and is not a known-deviation, and the dated deviation is applied post-hoc. FAIL if git-generated subjects are graded-then-suppressed, or the dated deviation is missing.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the pre-check short-circuit is confirmed before the dated-deviation check.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate that sk-git treats git-generated subjects as a structural pre-check exemption (REQ-005), not a known-deviation suppression, and honors the pre-hook-install commit-date deviation.
### Commands
1. `bash: node -e "const g=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs'); console.log('merge exempt:', g.isExemptSubject('Merge branch main into feature')); console.log('feat exempt:', g.isExemptSubject('feat(x): add thing')); console.log('grammar on vague subject:', JSON.stringify(g.checkCommitGrammar('update', 1).errors.map(e=>e.type)));"`
2. `bash: rg -n 'isExemptSubject|EXEMPT_SUBJECT_PATTERNS|REQ-005|structural PRE-CHECK|return findings; // empty' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs`
3. `bash: rg -n 'requiresCommitBeforeHookInstall|HOOK_INSTALL_DATE|commitDate' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs`
4. `bash: rg -n 'Merge|Revert|fixup|squash|amend|requiresCommitBeforeHookInstall' .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-git-known-deviations.md`
### Expected
Command 1: `isExemptSubject('Merge ...')` is true, `isExemptSubject('feat(x): ...')` is false, and grammar on a bare `update` subject returns a `vague-summary` error (proving the grammar DOES fire when not pre-exempted). Command 2 shows `isExemptSubject` returning empty findings inside `checkCommit` before grammar. Command 3 shows the `requiresCommitBeforeHookInstall` / `HOOK_INSTALL_DATE` comparison. Command 4 shows the exempt prefixes are handled structurally (they are NOT `matchTypes` entries), while the pre-hook-install carve-out IS a dated deviation entry.
### Evidence
Capture the exempt/non-exempt booleans, the vague-summary grammar result, the pre-check short-circuit source, and the dated-deviation source + reference-doc entry.
### Pass/Fail
PASS if the pre-check exemption short-circuits before grading and is not a known-deviation, and the dated deviation is applied post-hoc. FAIL if git-generated subjects are graded-then-suppressed, or the dated deviation is missing.
### Failure Triage
If the exempt prefixes appear as `matchTypes` in the known-deviation JSON, the two mechanisms have been conflated (the finding). If `checkCommitGrammar('update', 1)` returns no error, the grammar itself is broken, which would mask the distinction.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `verify-first-and-known-deviations/` | Invariant category; sk-git's two exemption mechanisms are exercised here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs` | `isExemptSubject` pre-check; `matchesDeviation` `requiresCommitBeforeHookInstall`; `HOOK_INSTALL_DATE` |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-git-known-deviations.md` | sk-git's known-deviation list (dated pre-hook-install entry, not the exempt prefixes) |
| `.opencode/scripts/git-hooks/commit-msg` | The hook's own `case ... exit 0` pre-check the adapter mirrors |

---

## 5. SOURCE METADATA

- Group: VERIFY-FIRST AND KNOWN DEVIATIONS
- Playbook ID: DAL-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `verify-first-and-known-deviations/sk-git-exempt-precheck-vs-suppression.md`
