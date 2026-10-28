---
id: CQ-002
category: quality_gate
title: 'Foreign polyglot change blocks on all seven seeded labels'
description: "This scenario validates the gate run for `CQ-002`. It replays fixture F01, a change across six language families in a repository with no sk-code surface packet, and confirms the gate blocks on the seven seeded comment labels while the surface stays unknown."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - assets/quality-defaults.json
catalog_applicable: true
version: 1.1.4.0
---

# CQ-002: Foreign Polyglot Change Blocks On All Seven Seeded Labels

This document captures the run contract, execution process, source anchors and metadata for `CQ-002`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-002`. Fixture F01 seeds one change across six language families in a repository that carries no sk-code surface packet, no pre-commit hook, no CI workflow and no post-edit hook. The runner therefore resolves the surface to `unknown`, and the run is judged by the universal floor plus the runner's own checks alone. Seven files carry one comment label each, and the URL beside the spec path in the TypeScript file is the control case that must stay silent.

### Why This Matters

A repository with no surface packet is the case the program goal names, and Iron Law 3 forbids any standard on an `unknown` surface. If the gate neither blocks nor reports why, an author working in such a repository can neither satisfy the gate nor learn what to fix. A miss here also undercuts the catch-rate target, because F01 is the corpus that target is measured on.

---

## 2. SCENARIO CONTRACT

Operators confirm that the seeded change returns the blocking gate value (the exit `1` row of the gate table in the runner contract), that every one of the seven labels is reported as an exact blocking finding on its changed line, and that the surface stays `unknown`.

- Objective: confirm the gate value, the exit code, the resolved surface and the seven findings for fixture F01.
- Real user request: `I edited files in a polyglot checkout that has no surface packet. Run the quality gate before I claim done.`
- Prompt: `Run the quality gate on this foreign polyglot change before I claim done.`

**Exact prompt**:

```text
Run the quality gate on this foreign polyglot change before I claim done.
```

- Fixture: F01, built in a temporary git repository outside the working tree. The builder commits a README as the base, then writes the seven changed files. Each seeded label is joined from fragments at run time, exactly as the fixture does, so no label is written literally here.

| File | Seeded content | What the gate must say |
| --- | --- | --- |
| `a.go` | a Go line comment naming an architecture decision number | blocking, exact |
| `b.rs` | a Rust line comment naming a fixed issue by number | blocking, exact |
| `c.yaml` | a YAML comment naming a packet number | blocking, exact |
| `d.css` | a CSS block comment naming a requirement number | blocking, exact |
| `e.py` | a Python docstring naming a requirement number in its long form | blocking, exact |
| `f.ts` | a TypeScript comment holding a repository spec path and a documentation URL | blocking on the spec path only, exact, and nothing for the URL |
| `g.mts` | a TypeScript module comment naming a task id | blocking, exact |

- Expected execution process: the operator replays the F01 case, reads the case that builds the fixture, then builds the same fixture by hand from the suite's `buildRepo`, runs `quality-gate.cjs --format json` on it, reads the exit status and the seven finding rows, and loads the universal floor the verdict lists before any completion claim. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: `gate` is the exit `1` blocking value from the runner contract gate table, `exit_code` is `1`, `resolved_surface` is `["unknown"]`, and the seven blocking findings are `exact`, `P0` and `changed-line`, one per seeded file.
- Desired user-visible outcome: the gate refuses the completion claim and names one file and line per label, so the author removes the labels rather than guessing what failed.
- Pass/fail: PASS if every value in the expected-result table below holds and the fixture snapshot is unchanged. FAIL if any value differs, if a seeded label is not reported, or if the URL raises a finding.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on this foreign polyglot change before I claim done.`

### Commands

1. `node --test --test-reporter=tap --test-name-pattern='^F01' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-hygiene.test.cjs`
2. `sed -n "/^test('F01/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-hygiene.test.cjs`
3. Build fixture F01 by hand, run the gate over it and print the seven finding rows.

```bash
node -e '
const assert = require("node:assert/strict");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const ADR = ["ADR", "12"].join("-");
const REQ_SHORT = ["REQ", "4"].join("-");
const REQ_LONG = ["REQ", "12"].join("-");
const TASK = "T" + "043";
const SPEC = ["specs", "demo", "001-alpha", "spec.md"].join("/");
const repo = buildRepo({
  base: { "README.txt": "fixture\n" },
  change: {
    "a.go": "package a\n\n// see " + ADR + "\nfunc A() {}\n",
    "b.rs": "fn main() {}\n// fixes issue #88\n",
    "c.yaml": "key: 1 # packet 042\n",
    "d.css": ".a { color: red; } /* " + REQ_SHORT + " */\n",
    "e.py": "def f():\n    \"\"\"Implements " + REQ_LONG + ".\"\"\"\n    return 1\n",
    "f.ts": "const u = 1; // see " + SPEC + " and https://example.com/docs\n",
    "g.mts": "export const a = 1; // " + TASK + "\n",
  },
});
try {
  const run = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
  const verdict = run.verdict;
  const blocking = verdict.findings.filter((entry) => entry.check === "comment-hygiene" && entry.blocking && entry.confidence === "exact");
  assert.equal(verdict.exit_code, 1);
  assert.equal(verdict.summary.p0_blocking, 7);
  console.log("exit " + run.status + " p0_blocking " + verdict.summary.p0_blocking);
  console.log("resolved_surface " + JSON.stringify(verdict.resolved_surface));
  console.log("blocking " + blocking.length);
  for (const entry of blocking) console.log("finding " + entry.file + ":" + entry.line + " " + entry.rule + " " + entry.severity + " " + entry.confidence + " " + entry.origin);
  console.log("f.ts findings " + verdict.findings.filter((entry) => entry.file === "f.ts").length);
} finally { repo.cleanup(); }
'
```

4. `for p in references/runner-contract.md scripts/quality-gate.cjs assets/quality-defaults.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays F01 and prints `# pass 1` then `# fail 0`. Step 2 shows the seven seeded files, the base README and the `withRepo` call that keeps the fixture in a temporary repository. Step 3 builds the same fixture by hand, asserts the exit-`1` gate through its `exit_code` and `p0_blocking` fields, and prints the exit status, the surface, the blocking count, one row per finding and the finding count for the one file that also carries a URL:

```text
exit 1 p0_blocking 7
resolved_surface ["unknown"]
blocking 7
finding a.go:3 hygiene.adr P0 exact changed-line
finding b.rs:2 hygiene.issue P0 exact changed-line
finding c.yaml:1 hygiene.packet-number P0 exact changed-line
finding d.css:1 hygiene.req P0 exact changed-line
finding e.py:2 hygiene.req P0 exact changed-line
finding f.ts:1 hygiene.spec-path P0 exact changed-line
finding g.mts:1 hygiene.task P0 exact changed-line
f.ts findings 1
```

Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` | the exit `1` blocking value in the runner contract gate table |
| `exit_code` | `1` |
| `resolved_surface` | `["unknown"]` |
| blocking findings with `confidence` `exact` | `7` |
| finding files | `a.go`, `b.rs`, `c.yaml`, `d.css`, `e.py`, `f.ts`, `g.mts` |
| finding `severity` and `origin` | `P0` and `changed-line` on every one |
| URL beside the spec path in `f.ts` | no finding |
| fixture snapshot after the run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the seven finding rows step 3 prints, the evidence that the file beside the URL raised one finding for its spec path and none for the URL, and the step 4 `OK` lines. The snapshot check runs inside step 3, so a run that changed the fixture fails the command rather than the reading. Save the transcript and the verdict excerpt under the dated run label the playbook names. Never paste the seeded labels into a tracked document.

### Pass / Fail

- **Pass**: the gate is the exit `1` blocking value, exit is `1`, the surface is `unknown`, seven exact blocking findings name the seven seeded files, the URL raises nothing, and the fixture snapshot is unchanged.
- **Fail**: any other gate or exit, a missing finding, a finding on the URL, a surface other than `unknown`, or a changed fixture snapshot.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see the assertion that failed, which names the field the verdict disagreed on.
2. If the count differs, rerun step 2 and compare the seeded file list against the finding files. A file with no comment family in `assets/comment-syntax.json` is listed as unchecked rather than judged, so read `coverage.unchecked` before treating it as a miss.
3. If a label reads `heuristic` rather than `exact`, or a URL raises a finding, the label pattern or the URL span rule drifted. Record the row as found and route the defect to the phase that owns the checker surface.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`codebase-agnostic-quality-gate.md`](../../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md) | The feature catalog entry for the runner, its built-in checks and its exit codes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §9 | Target-path and surface routing the runner consumes, including the `UNKNOWN` row |
| [quality-gate-hygiene.test.cjs](../../scripts/tests/quality-gate-hygiene.test.cjs) | The F01 case this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §2 and §3 | Gate values, exit codes and the verdict fields this scenario reads |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/foreign-polyglot-change.md`
