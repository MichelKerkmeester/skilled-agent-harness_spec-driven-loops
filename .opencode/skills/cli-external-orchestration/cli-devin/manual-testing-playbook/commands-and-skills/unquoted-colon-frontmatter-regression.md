---
title: "DV-016 -- Unquoted-colon frontmatter regression"
description: "Verify Devin's strict frontmatter parser does not silently drop a mirrored agent profile whose description carries an unquoted colon."
version: 2.0.0.0
---

# DV-016 -- Unquoted-colon frontmatter regression

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-016`.

> **RE-TARGETED 2026-08-30.** This scenario originally guarded a mirrored 36-command
> surface. `.devin/SYNC.md` records that Devin has no mirrored command surface (removed
> by operator decision), so that target no longer exists. The defect it guards does:
> `SYNC.md` §5 states the constraint as "**any mirrored file** must survive a strict YAML
> parse", and the agent mirror tree is the surviving mirrored surface. The scenario now
> targets `.devin/agents/*/AGENT.md`.

## 1. OVERVIEW

Reproduce the latent parser defect against the surface Devin still mirrors: a `description:` value containing an unquoted colon is invalid YAML, and Devin's strict parser silently drops the whole file while lenient parsers accept it.

### Why This Matters

The same defect once hid 12 of 36 commands with no warning anywhere. The command surface is gone; the failure mode is not. Agent profiles are symlinked from `.claude/agents/`, whose parser is more lenient than Devin's, so a description written to be valid there can silently vanish here. A roster test that only counts symlinks, or only parses leniently, reports false parity.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a malformed agent profile is excluded or diagnosed by the strict parser while a quoted control remains resolvable, and confirm every live mirrored profile survives a strict parse.
- Real user request: `Regression-test agent discovery with one malformed frontmatter profile and one corrected control profile.`
- Prompt: `In this isolated workspace, report whether the malformed and corrected fixture agent profiles are visible to Devin. Do not edit the parent repository.`
- Expected execution process: Strict-parse every live `.devin/agents/*/AGENT.md` in the repository read-only; then, in a temporary workspace, create one `description: Broken: value` fixture profile and one quoted control, and compare Devin's resolution of each against a lenient YAML parse.
- Expected signals: Every live mirrored profile parses strictly. The malformed fixture is not silently resolved; the corrected fixture is. The discrepancy is named as a strict-parser failure, not a missing symlink.
- Desired user-visible outcome: A regression guard against reintroducing an unquoted-colon description anywhere in the mirrored agent tree.
- Pass/fail: PASS when every live profile parses strictly AND the malformed fixture is rejected or explicitly diagnosed while the control remains visible; FAIL when any live profile fails a strict parse, or the malformed fixture is accepted as valid; SKIP only when the installed parser cannot be isolated safely.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `In this isolated workspace, report whether the malformed and corrected fixture agent profiles are visible to Devin. Do not edit the parent repository.`

### Commands

1. Read-only strict parse of the live mirror — no dispatch, no workspace mutation:
```bash
python3 - <<'PY'
import glob, yaml
bad = 0
for f in sorted(glob.glob('.devin/agents/*/AGENT.md')):
    txt = open(f).read()
    if not txt.startswith('---'):
        print(f"NO FRONTMATTER {f}"); bad += 1; continue
    try:
        yaml.safe_load(txt.split('---', 2)[1])
    except Exception as e:
        print(f"STRICT-PARSE FAIL {f}: {e}"); bad += 1
print(f"strict-parse failures: {bad}")
PY
```
2. `DV016_DIR=$(mktemp -d /tmp/cli-devin-dv016.XXXXXX); mkdir -p "$DV016_DIR/.devin/agents/bad-fixture" "$DV016_DIR/.devin/agents/good-fixture"`
3. Write fixtures only under `$DV016_DIR`: `bad-fixture/AGENT.md` uses an unquoted colon in `description: Broken: value`; `good-fixture/AGENT.md` quotes the same value. Do not modify `.devin/agents/` in the repository.
4. `cd "$DV016_DIR" && devin -p -- "Use the good-fixture subagent, then the bad-fixture subagent. Report which profiles resolved. Do not edit files." --model adaptive --permission-mode normal </dev/null > agents.txt 2>&1; echo "exit=$?" >> agents.txt`
5. Compare Devin's resolution of each fixture with a lenient YAML parse and record both outcomes.

### Expected

Every live profile parses strictly; bad YAML fixture rejected; quoted control resolvable

### Evidence

Captured output from every command in §3, the strict-parse failure count from step 1, the table's Expected Signal cell, and the exit code recorded alongside each command.

### Pass / Fail

- **Pass**: every live mirrored profile parses strictly, the malformed fixture is rejected or explicitly diagnosed, and the control resolves.
- **Fail**: any live profile fails a strict parse, or the malformed fixture is accepted as valid or silently treated as usable.
- **Skip**: only when the installed parser cannot be isolated safely (a missing or unavailable prerequisite is the named blocker).

### Failure Triage

1. **Live profile fails strict parse**: fix the canonical file in `.claude/agents/` — quote the description — then re-run the mirror generator. The symlink is not the defect.
2. **Signal mismatch**: the captured output does not match the Expected Signal cell; re-run the exact command sequence above and diff the new output against it.
3. **Preflight/blocker**: if the required binary, auth, or workspace precondition is unavailable, record the SKIP with that exact blocker rather than guessing a result.
4. **Unexpected mutation**: if the repository or a temporary workspace shows an unexpected diff, treat the scenario as FAIL regardless of the command's own exit code.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Isolated-config and parser-regression policy |
| `../subagents/roster-enumeration.md` | Roster parity for the same mirrored tree |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../../.devin/SYNC.md` | §5 strict-YAML constraint and the no-mirrored-command-surface decision |
| `../../../../../.devin/agents/` | The surviving mirrored surface under test |
| `../../../../../.claude/agents/` | Canonical source the mirror symlinks onto |

---

## 5. SOURCE METADATA

- Group: Commands and Skills
- Playbook ID: DV-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commands-and-skills/unquoted-colon-frontmatter-regression.md`
