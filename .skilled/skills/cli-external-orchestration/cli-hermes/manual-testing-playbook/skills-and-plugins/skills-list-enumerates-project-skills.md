---
title: "HERMES-017 -- Skills list enumerates the loadable project skills"
description: "Confirm `hermes skills list` enumerates the generated project skill copies as `local` rows and omits exactly the ones the scanner quarantined, for `HERMES-017`."
version: 1.0.0.0
---

# HERMES-017 -- Skills list enumerates the loadable project skills

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-017`.

---

## 1. OVERVIEW

With the repo trusted, Hermes indexes the generated markdown-only copies under `.hermes/skills/` and reports each loadable one in `hermes skills list` as a `local` row. A copy the static scanner rates dangerous is quarantined, which removes it from the index, the listing, `skill_view` and `-s` alike, so the listing doubles as the load-result report for the mirror.

### Why This Matters

The listing is the cheapest way to see whether the mirror is healthy after a regeneration. It is also a boundary worth pinning, because under the earlier symlink design every skill was quarantined and the listing showed no project rows at all, which was mistaken for a Hermes limitation rather than a consequence of that design.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `hermes skills list` enumerates the loadable generated copies as `local` rows and omits exactly the quarantined ones.
- Real user request: `Is our cli-hermes skill showing up in Hermes?`
- Prompt: `List the skills Hermes reports as installed and state whether the project skill cli-hermes appears among them.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the table's Source column carries `local` rows alongside `builtin`; `grep -c 'cli-hermes'` returns `1`; the footer's `local` count equals the number of generated copies minus the quarantined ones (68 minus 7 on 2026-09-15); every name absent from the listing appears in `~/.hermes/logs/errors.log` as a quarantine line.
- Evidence: The generated copy's first lines proving it is present on disk, the line count of the listing, the grep count, the footer counts, the exit code, and the quarantine lines accounting for each absence.
- Desired user-visible outcome: a concise verdict naming the observed counts and the evidence behind it.
- Pass/fail: PASS when the loadable copies appear as `local` rows and every absence is accounted for by a quarantine line; FAIL when the command errors, when a copy is missing with no quarantine line to explain it, or when the listing shows no project rows at all, which would mean the mirror stopped loading; SKIP only when a named blocker prevents the command (record it verbatim).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, the exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
head -3 .hermes/skills/cli-hermes/SKILL.md
ls .hermes/skills | wc -l

perl -e 'alarm 300; exec @ARGV' -- hermes skills list </dev/null >out.txt 2>err.txt
echo $?
tail -1 out.txt
grep -c 'cli-hermes' out.txt
grep "quarantined" ~/.hermes/logs/errors.log | sed 's/.*\.hermes\/skills\///;s/ —.*//' | sort -u
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-017 | Skills list enumerates the loadable project skills | Confirm `hermes skills list` enumerates the loadable generated copies as `local` rows and omits exactly the quarantined ones | `List the skills Hermes reports as installed and state whether the project skill cli-hermes appears among them.` | the `sync-skills-hermes.cjs --check`, `hermes skills list` and quarantine-log sequence in §3 | Exit `0`; `local` rows present; `grep -c 'cli-hermes'` returns `1`; the footer's local count equals copies minus quarantined; every absence has a quarantine line | stdout, exit code, the footer counts, the grep count, the quarantine lines | PASS on `local` rows with every absence accounted for; FAIL on an error, an unexplained absence, or no project rows at all; SKIP only on a named blocker | Harness: the mirror is out of sync (`--check` fails). Dependency: the repo is not trusted. Adapter: a copy is absent with no quarantine line, which points at an indexing change |

### Recorded Result

**Executed 2026-09-15**: exit 0, 125 lines, footer `0 hub-installed, 57 builtin, 61 local — 118 enabled, 0 disabled`, `grep -c 'cli-hermes'` returned `1`, and the seven absences (`cli-cursor`, `cli-devin`, `cli-opencode`, `deep-research`, `mcp-aside-devtools`, `mcp-magicpath`, `sk-create-repo-rule`) each carry a quarantine line, so 68 copies minus 7 quarantined equals the 61 local rows. The scenario previously asserted the opposite boundary, that the listing never shows project skills; that reading came from the symlink design, under which every skill was quarantined, and was corrected when this run contradicted it.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/skills-list-enumerates-project-skills.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hermes-tools.md](../../references/hermes-tools.md) | The listing and quarantine boundary |
| [SYNC.md](../../../../../../.hermes/SYNC.md) | How the generated copies are produced |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-017
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/skills-list-enumerates-project-skills.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
