---
id: CQ-009
category: quality_gate
title: 'Untrusted config reads skipped untrusted until the operator grants trust'
description: "This scenario validates the gate run for `CQ-009`. It builds a temporary repository whose committed config names one required configured check, runs the gate with no trust rule, and confirms the row reads `SKIPPED_UNTRUSTED` with the repair line, nothing starts and the run is UNVERIFIED. It then sets the local trust key and confirms the same check runs and `config.trust` names the rule."
expected_intent: QUALITY
expected_resources:
  - references/quality-config.md
  - references/runner-contract.md
  - scripts/quality-gate.cjs
catalog_applicable: true
version: 1.1.5.0
---

# CQ-009: Untrusted Config Reads Skipped Untrusted Until The Operator Grants Trust

This document captures the run contract, execution process, source anchors and metadata for `CQ-009`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-009`. The fixture commits one repository config, `.skilled/skills/sk-code/sk-code-quality/repository/quality.json`, that names a single required P0 check, then seeds one changed function in `app.go`. The config is read from the repository itself, and no trust rule vouches for it: the operator did not name it with `--config`, `skcode.qualityConfig` is not stored in the repository's own `.git/config`, `skilled.trustRepoChecks` is unset, and the repository does not share a git common dir with the runner checkout. The quality config reference says a configured check that would start a command then reads `SKIPPED_UNTRUSTED`, starts nothing and carries a repair line, and a required one leaves the run UNVERIFIED.

The scenario runs the gate twice over the same fixture. The first run has no trust and the second runs after `git config --local skilled.trustRepoChecks true`. The only difference between the two runs is the trust key, so a changed result is attributable to it.

### Why This Matters

A committed config names commands, and a command in a cloned repository is code the operator never reviewed. If the runner started it by default, opening a hostile repository and running the gate would run that repository's commands. The trust boundary is what stops that, and the scenario pins it from both sides. Without the key the check must start nothing, and with the key it must run as the config says.

The scenario also pins the boundary between a skipped check and a clean one. An untrusted required check produced no evidence, so the run is UNVERIFIED with exit 4 and never `NO_BLOCKER_FOUND`. The repair line is the single next action the operator takes, and it must be the exact command that grants trust in this repository only.

---

## 2. SCENARIO CONTRACT

Operators confirm that an untrusted config leaves its required check `SKIPPED_UNTRUSTED` with the repair line, that nothing starts, that the run is `UNVERIFIED` with exit 4, and that granting the local trust key lets the same check run with `config.trust` naming the rule.

- Objective: confirm the check row state, the repair line, the unverified list, the exit code, the absence of any started process and the `config.trust` value before and after the grant.
- Real user request: `I cloned a repository that commits its own quality checks. Run the quality gate before I claim done.`
- Prompt: `Run the quality gate on this cloned repository and tell me why its configured check did not run.`

**Exact prompt**:

```text
Run the quality gate on this cloned repository and tell me why its configured check did not run.
```

- Fixture: a temporary git repository outside the working tree, built from the fixture builder the runner suite uses. The base commit holds a clean `app.go` and the committed config. The change adds one function to `app.go`. The configured check is required because it is P0 and states no `required: false`. Its command writes a marker file in a separate scratch folder and exits 1, so the marker proves whether the command started.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` | one check, `id` `untrusted-canary`, `argv` of the node binary writing a marker then exiting 1, severity `P0` | without trust the row is `SKIPPED_UNTRUSTED`, required, with the repair line |
| trust key | unset for the first run, `git config --local skilled.trustRepoChecks true` for the second | the first run names no trust rule, the second names the key |
| marker file | in a scratch folder outside the repository | absent after the first run, present after the second |

- Expected execution process: the operator replays the trust cases from the runner suite, then builds the fixture by hand, runs the gate without trust, reads the JSON verdict and the text form, sets the local key, reruns, and compares the two. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file in the repository fails the command rather than the reading.
- Expected signals: the first run has `gate` `UNVERIFIED`, exit `4`, a row of `SKIPPED_UNTRUSTED` with `required` true and the repair line `git config --local skilled.trustRepoChecks true`, `summary.unverified` holding `untrusted-canary`, `config.trust.checks` `untrusted` and no marker file. The second run has the blocking gate value, exit `1`, an empty `summary.unverified`, a row of `RAN_FAIL`, `config.trust.checks` `trusted` with the reason `skilled.trustRepoChecks is true in this repository`, and the marker file present.
- Desired user-visible outcome: the operator reads the repair line, decides whether to trust the repository, and never records the first run as a pass.
- Pass/fail: PASS if every value in the expected-result table below holds, the command exits 0 and both snapshot checks pass, and no transcript line claims a pass for the untrusted run. FAIL if the first run starts the check, reads `NO_BLOCKER_FOUND`, omits the repair line or names a trust rule, or if the second run still reads `SKIPPED_UNTRUSTED`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on this cloned repository and tell me why its configured check did not run.`

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 3 stay defined.

1. `node --test --test-reporter=tap --test-name-pattern='^trust: (a committed config with no trust rule|a local skilled.trustRepoChecks true)' .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks-trust.test.cjs`
2. `sed -n "/^test('trust: a committed config with no trust rule/,/^}));/p; /^test('trust: a local skilled.trustRepoChecks true/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks-trust.test.cjs`
3. Build the fixture by hand, run the gate without trust, grant trust, rerun and assert the fields.

```bash
TMP="$(mktemp -d)"
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo, trustRepoChecks } = require(path.join(Q, "tests/fixtures.cjs"));
const marker = path.join(process.argv[1], "ran");
const repo = buildRepo({
  base: {
    "app.go": "package a\n\nfunc A() {}\n",
    ".skilled/skills/sk-code/sk-code-quality/repository/quality.json": JSON.stringify({ schemaVersion: 1, checks: [{ id: "untrusted-canary", argv: [process.execPath, "-e", "require(\"fs\").writeFileSync(process.argv[1], \"ran\"); process.exit(1)", marker], severity: "P0" }] }, null, 2) + "\n",
  },
  change: { "app.go": "package a\n\nfunc A() {}\nfunc B() {}\n" },
});
try {
  const before = assertSnapshotUnchanged(repo, () => ({ json: repo.run(["--format", "json"]), text: repo.run(["--format", "text"]) }));
  const first = before.json.verdict;
  const row = first.checks.find((entry) => entry.id === "untrusted-canary");
  assert.equal(before.json.status, 4);
  assert.equal(first.gate, "UNVERIFIED");
  assert.deepEqual([row.state, row.required, row.repair], ["SKIPPED_UNTRUSTED", true, "git config --local skilled.trustRepoChecks true"]);
  assert.deepEqual(first.summary.unverified, ["untrusted-canary"]);
  assert.equal(first.config.trust.checks, "untrusted");
  assert.ok(!fs.existsSync(marker), "the untrusted check started");
  assert.match(before.text.stdout, /git config --local skilled\.trustRepoChecks true/);
  console.log("untrusted gate " + first.gate + " exit " + before.json.status);
  console.log("row " + row.state + " required " + row.required);
  console.log("repair " + row.repair);
  console.log("trust " + first.config.trust.checks + " (" + first.config.trust.reason + ")");
  console.log("marker after untrusted run: absent");
  trustRepoChecks(repo);
  const after = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
  const second = after.verdict;
  const ran = second.checks.find((entry) => entry.id === "untrusted-canary");
  assert.equal(after.status, 1);
  assert.deepEqual(second.summary.unverified, []);
  assert.equal(ran.state, "RAN_FAIL");
  assert.deepEqual([second.config.trust.checks, second.config.trust.reason], ["trusted", "skilled.trustRepoChecks is true in this repository"]);
  assert.ok(fs.existsSync(marker), "the trusted check never started");
  console.log("trusted blocking gate exit " + after.status + " unverified " + second.summary.unverified.length);
  console.log("row " + ran.state);
  console.log("trust " + second.config.trust.checks + " (" + second.config.trust.reason + ")");
  console.log("marker after trusted run: present");
} finally {
  repo.cleanup();
}
' "$TMP"
echo "exit $?"
```

4. `for p in references/quality-config.md references/runner-contract.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`
5. Clean up: `rm -rf "$TMP"`

### Expected

Step 1 replays both trust cases and prints `# pass 2` then `# fail 0`. Step 2 shows the two cases: the first asserts the row, the repair line, the unverified list and the absence of the canary file, the second asserts the check runs and fails once the local key is set. Step 3 prints `untrusted gate UNVERIFIED exit 4`, `row SKIPPED_UNTRUSTED required true`, the repair line, the untrusted trust line, `marker after untrusted run: absent`, then `trusted blocking gate exit 1 unverified 0`, `row RAN_FAIL`, the trusted trust line and `marker after trusted run: present`, and the command exits 0. Step 4 prints `OK` for all three paths. Step 5 prints nothing and leaves no scratch folder behind.

| Signal | Expected value |
| --- | --- |
| first run `gate` | `UNVERIFIED` |
| first run `exit_code` | `4` |
| check `state` | `SKIPPED_UNTRUSTED` |
| check `required` | `true` |
| check `repair` | `git config --local skilled.trustRepoChecks true` |
| `summary.unverified` | `["untrusted-canary"]` |
| `config.trust.checks` | `untrusted` |
| `config.trust.reason` | `the config names commands and no trust rule applies` |
| marker file after the first run | absent |
| text form | carries the repair line and a `trust: untrusted` line |
| second run `gate` | the blocking value, exit `1` |
| second run `summary.unverified` | empty |
| second run `exit_code` | `1` |
| second run check `state` | `RAN_FAIL` |
| second run `config.trust` | `trusted`, reason `skilled.trustRepoChecks is true in this repository` |
| marker file after the second run | present |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 5, the frontmatter block with `expected_intent: QUALITY`, the first run's check row quoted with `state`, `required` and `repair`, both `config.trust` lines, both gate and exit lines, the marker state after each run, and the command's exit 0, which is the result of both snapshot checks and every assertion. Read every transcript line of the first run for a passing claim before the verdict is recorded. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the first run is `UNVERIFIED` with exit `4`, the row reads `SKIPPED_UNTRUSTED` with the exact repair line, the unverified list names `untrusted-canary`, `config.trust.checks` is `untrusted`, no marker file exists, the second run is the blocking gate with the row `RAN_FAIL` and `config.trust` naming the key, and the command exits 0 with both snapshot checks passed.
- **Fail**: the first run starts the check, reads `NO_BLOCKER_FOUND`, or has an empty unverified list, the repair line is missing or differs, `config.trust` names a rule for the first run, the second run still reads `SKIPPED_UNTRUSTED`, a snapshot check throws, or any transcript line claims a pass for the untrusted run.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see which trust assertion failed.
2. If the first run is trusted, a rule applied that the fixture did not intend. Read `config.trust.reason`: a `--config` flag, a `skcode.qualityConfig` value in the fixture's own `.git/config`, a `skilled.trustRepoChecks` value inherited from a global or system git config that the builder did not isolate, or a fixture that shares a git common dir with the runner checkout each name themselves there. Only a value in the repository's own local config counts as a grant.
3. If the row reads `SKIPPED_ABSENT`, the tool check ran first. Absence of the program is decided before trust, so the fixture must name a program that exists, and the node binary does.
4. If the row reads `LISTED`, `--no-run` was passed. That flag lists a configured check with its planned run and never reports `SKIPPED_UNTRUSTED`, so rerun without it.
5. If the second run still reads `SKIPPED_UNTRUSTED`, the key was not stored in the repository's own config or its value is not a git boolean. A value such as `maybe` is no grant.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
| --- | --- |
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`repository-quality-config.md`](../../../feature-catalog/quality-gate/repository-quality-config.md) | The feature catalog entry for the trust boundary and the repair line |

### Implementation And Test Anchors

| File | Role |
| --- | --- |
| [SKILL.md](../../SKILL.md) §4 | The gate workflow line that reads `UNVERIFIED` as an open claim rather than a pass |
| [configured-checks-trust.test.cjs](../../scripts/tests/configured-checks-trust.test.cjs) | The trust cases this scenario replays |
| [quality-config.md](../../references/quality-config.md) §8 | The trust boundary: the four rules, the state, the repair line and what `config.trust` names |
| [runner-contract.md](../../references/runner-contract.md) §2 | The check states, the `SKIPPED_UNTRUSTED` row and the unverified list |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The trust decision and the state it writes onto a configured row |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/untrusted-config.md`
