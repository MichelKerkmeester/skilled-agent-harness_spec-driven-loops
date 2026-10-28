---
id: CQ-012
category: quality_gate
title: 'A repository that switches a hygiene rule off is not blocked by it'
description: "This scenario validates the gate run for `CQ-012`. It builds a repository whose code carries a tracker reference in a comment, runs the gate with and without `commentHygiene.disableRules`, and reads the resolver's view of the repository's `## Rule overrides` section. With the key the gate reads NO_BLOCKER_FOUND, and without it the same file takes the blocking gate value."
expected_intent: QUALITY
expected_resources:
  - references/quality-config.md
  - references/runner-contract.md
  - scripts/quality-gate.cjs
version: 1.0.1.0
---

# CQ-012: A Repository That Switches A Hygiene Rule Off Is Not Blocked By It

This document captures the run contract, execution process, source anchors and metadata for `CQ-012`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-012`. The core comment-hygiene rules were written for this framework's own planning labels, and they block at P0 in every repository. A repository whose own comments carry tracker references, such as `Fixes #12`, would be blocked by a rule it never agreed to. The repository can now say so in its quality config with `commentHygiene.disableRules`, and it can record the same decision for the agent and the review mode in a `## Rule overrides` section of a checklist its config names.

The scenario builds one such repository, runs the gate with the key set, removes the key and runs the gate again, and finally asks the resolver what the repository's checklist says.

### Why This Matters

A portable gate has to let a repository opt out of house rules it does not share, or every foreign repository inherits a style it never chose. The opposite failure is a gate that opts out silently, so the key must show in the verdict. The scenario holds the file, the comment and the runner fixed, so the only difference between the two runs is the key. The verdict must name what is off, and the resolver must show the checklist row that records the decision.

---

## 2. SCENARIO CONTRACT

Operators confirm that the gate reads `NO_BLOCKER_FOUND` with the key set, the blocking gate value without it, that the verdict names the disabled rule and records both override rows in its decisions, and that the resolver lists the repository checklist with its two `none` rows.

- Objective: confirm the gate, the exit code, the disabled rule and the finding for each of the two runs, and the resolver's view of the repository checklist.
- Real user request: `Our repository writes tracker references in comments and the quality gate blocks us for it. Run the gate and tell me whether our config switches that rule off.`
- Prompt: `Run the quality gate on my change and tell me whether our config switches the tracker comment rule off.`

**Exact prompt**:

```text
Run the quality gate on my change and tell me whether our config switches the tracker comment rule off.
```

- Fixture: a scratch folder outside the repository, with no git history, built by the commands below. It holds one source file with a `// Fixes #12: ...` comment on line 1, a quality config that names a style document as a checklist and sets `commentHygiene.disableRules` to `["issue"]`, and the style document with a `## Rule overrides` section of two `none` rows.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| comment | `// Fixes #12: an empty list totals zero` on line 1 | blocked as `hygiene.issue` only when the key is absent |
| key | `commentHygiene.disableRules` set to `["issue"]` | `config.hygiene.disabled` lists `hygiene.issue`, the gate reads `NO_BLOCKER_FOUND` |
| style document | `floor.documentation` and `hygiene.issue`, both `none` | listed as `repo-config` with both rows and no error |
| same run without the key | the `commentHygiene` block removed | the blocking gate value, exit 1, one `hygiene.issue` finding on line 1 |

- Expected execution process: the operator builds the fixture, runs the gate over the one file with the key set, removes the key, runs it again and then asks the resolver. Every run reads files and writes none.
- Expected signals: the first run prints `exit_code 0`, `disabled hygiene.issue` and `findings none` and exits 0, then prints a decisions line with one `override` entry for each style-document row. The second prints `exit_code 1`, `disabled none` and `findings hygiene.issue@src/total.js:1` and exits 1. The resolver prints `hygiene.disabled` and the checklist row.
- Desired user-visible outcome: the repository sees that its own rule choice is honored, and sees which rule is off, instead of a gate that is quiet for no stated reason.
- Pass/fail: PASS if every value in the expected-result table below holds. FAIL if the key does not change the gate, the verdict does not name the disabled rule or record the rows, the second run reads clean, or the resolver lists no rows for the style document.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on my change and tell me whether our config switches the tracker comment rule off.`

### Commands

Run the commands from the repository root in one shell session, so the variables stay defined.

1. Build the fixture and set `HUB`.

```bash
HUB="$PWD/.skilled/skills/sk-code"
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/.sk-code" "$SCRATCH/docs" "$SCRATCH/src"
cat > "$SCRATCH/src/total.js" <<'JS'
// Fixes #12: an empty list totals zero
function total(items) {
  return items.reduce((sum, item) => sum + item, 0);
}

function average(items) {
  return items.length === 0 ? 0 : total(items) / items.length;
}

module.exports = { total, average };
JS
cat > "$SCRATCH/.sk-code/quality.json" <<'JSON'
{
  "schemaVersion": 1,
  "checklists": [{ "file": "docs/code-style.md", "extensions": [".js"] }],
  "commentHygiene": { "disableRules": ["issue"] }
}
JSON
cat > "$SCRATCH/docs/code-style.md" <<'MD'
# Code style

This repository keeps code nearly free of inline comments. Names carry the meaning, and the one comment a file may hold is a tracker reference.

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `floor.documentation` | none | Functions carry no doc comments here |
| `hygiene.issue` | none | The team writes tracker references in comments |
MD
SHOW='let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("exit_code "+j.exit_code);console.log("disabled "+(j.config.hygiene.disabled.join(",")||"none"));console.log("findings "+(j.findings.map(f=>f.rule+"@"+f.file+":"+f.line).join(",")||"none"))})'
```

2. Run the gate with the key set, read its exit status, and read the override rows it recorded.

```bash
cd "$SCRATCH" && node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/total.js | node -e "$SHOW"
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/total.js > /dev/null; echo "exit $?"
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/total.js --format envelope | grep p0_p1_p2_decisions
```

3. Ask the resolver what the repository's checklist says.

```bash
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain src/total.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("hygiene.disabled "+j.config.hygiene.disabled.join(","));for(const c of j.checklists)console.log(c.file+" "+c.source+" "+c.overrides.rows.map(r=>r.id+":"+r.action).join(" "))})'
```

4. Remove the key and run the gate again.

```bash
node -e 'const fs=require("fs");const c=JSON.parse(fs.readFileSync(".sk-code/quality.json","utf8"));delete c.commentHygiene;fs.writeFileSync(".sk-code/quality.json",JSON.stringify(c,null,2)+"\n")'
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/total.js | node -e "$SHOW"
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/total.js > /dev/null; echo "exit $?"
cd - > /dev/null && rm -rf "$SCRATCH"
```

5. `for p in references/quality-config.md references/runner-contract.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 prints `exit_code 0`, `disabled hygiene.issue`, `findings none` and `exit 0`, then the decisions line. The run reads the style document's section and records each accepted row ahead of the agent's own marker:

```text
p0_p1_p2_decisions: override floor.documentation none from docs/code-style.md, override hygiene.issue none from docs/code-style.md, PENDING_AGENT_JUDGMENT
```

Step 3 prints the following, with a space after the second `default` because that checklist has no rows (the resolver exits 2, which is its advisory exit):

```text
hygiene.disabled hygiene.issue
hub:sk-code/shared/references/universal/code-quality-standards.md default 
docs/code-style.md repo-config floor.documentation:none hygiene.issue:none
```

Step 4 prints `exit_code 1`, `disabled none`, `findings hygiene.issue@src/total.js:1` and then `exit 1`. Step 5 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| run with the key, `exit_code` | `0`, the gate value `NO_BLOCKER_FOUND` |
| run with the key, exit code | `0` |
| run with the key, `config.hygiene.disabled` | `hygiene.issue` |
| run with the key, findings | none |
| run with the key, `p0_p1_p2_decisions` | one `override` entry for each of the two rows, then `PENDING_AGENT_JUDGMENT` |
| resolver, repository checklist | source `repo-config`, rows `floor.documentation:none` and `hygiene.issue:none` |
| run without the key, `exit_code` | `1`, the blocking gate value |
| run without the key, exit code | `1` |
| run without the key, findings | one `hygiene.issue` finding at line 1 of the source file |

### Evidence

Command transcript from steps 1 to 5, the frontmatter block with `expected_intent: QUALITY`, the gate and exit lines for both runs, the disabled-rule line, the decisions line, the finding line of the second run, the resolver's three lines and the three `OK` lines. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the run with the key reads `NO_BLOCKER_FOUND` with exit `0` and names `hygiene.issue` as disabled, the decisions line records both rows, the resolver lists the style document with both `none` rows, and the run without the key takes the blocking gate value with exit `1` and the one finding.
- **Fail**: the key leaves the gate blocked, the verdict names no disabled rule, the run without the key reads clean, the decisions line lacks a row, or the resolver lists no row for the style document.

### Failure Triage

1. If the run with the key is still blocking, read `config.errors`. A `CONFIG_INVALID` row means the id is unknown or fixed, and the gate stops before any check.
2. If the disabled line reads `none` with the key set, the file in the fixture root is not the one the runner read. Check that the working directory is the fixture root, because the runner finds the quality config from there.
3. If the resolver lists the style document with no rows, the section heading is wrong. It must read `## Rule overrides` or `## 7. RULE OVERRIDES`, and the table needs the three columns.
4. A `hygiene.issue` row in the style document is recorded in the decisions and changes what the agent and the review mode apply. The gate's own comment-hygiene check changes only through `disableRules`, which is why the scenario sets both and why the run without the key is still blocked.
5. If the decisions line shows only the marker, the style document is not reached from the config. Check that `checklists[]` names it and that its extension matches the file.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
| --- | --- |
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
| --- | --- |
| [SKILL.md](../../SKILL.md) §2 | The comment-hygiene gate notes and the `disableRules` paragraph |
| [quality-config.md](../../references/quality-config.md) §3 | The `commentHygiene.disableRules` key, its ids and its errors |
| [runner-contract.md](../../references/runner-contract.md) §3 | The `config.hygiene` field of the verdict and the explain output |
| [rule-overrides.md](../../../shared/references/universal/rule-overrides.md) | The section format the style document follows |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The runner cases for the key and the explain output |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/disabled-hygiene-rules.md`
