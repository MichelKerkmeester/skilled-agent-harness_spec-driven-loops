---
id: CQ-014
category: quality_gate
title: 'A declared generated path is read by the dist adapter'
description: "This scenario validates the dist adapter for `CQ-014`. It builds three temporary repositories that each hold one path the base layer declares as generated output, then reads the `dist-staleness` row and the findings for a stale build, a build attested against its current sources and a path the freshness checker cannot map to a package."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/check-dist-staleness.sh
  - scripts/quality-gate.cjs
  - assets/quality-defaults.json
catalog_applicable: true
version: 1.0.0.0
---

# CQ-014: A Declared Generated Path Is Read By The Dist Adapter

This document captures the adapter contract, execution process, source anchors and metadata for `CQ-014`.

---

## 1. OVERVIEW

This scenario validates the dist adapter for `CQ-014`. `assets/quality-defaults.json` declares the build outputs this repository ships, one `paths` entry per generated path, and the runner hands each such path in scope to `scripts/check-dist-staleness.sh` in its per-file mode. That checker always exits 0, so the banner it prints is the whole verdict, and the adapter reads three outcomes from it: a `STALE DIST WARNING:` line becomes a P1 `dist.stale` finding, empty output with empty stderr reads `RAN_CLEAN`, and any other text, any stderr or a path the checker cannot map to a package reads `ERROR`.

The adapter also sets `SPECKIT_DIST_AUTO_REBUILD=0` and `SPECKIT_DIST_READ_ONLY=1`, so a gate run never rebuilds and never writes the cache record the session path keeps. The three cases below exercise each reading over a repository that owns one declared path, because a declared path is the only way a `**/dist/**` file reaches any check at all.

### Why This Matters

The declared paths are the only place the gate can see a stale build, and a stale build is a shipped artifact that no longer matches its source. Both failure directions are silent without this scenario. An adapter that read silence as fresh would report a stale build as clean, and an adapter that read an unrecognised path as fresh would report a build it never inspected as clean. The read-only promise matters in the other direction: the checker writes a cache record beside every dist entry it verifies unless the runner asks it not to, so a run that forgot the switch would leave a file behind in the repository it was told only to read.

---

## 2. SCENARIO CONTRACT

Operators confirm that a stale build yields one P1 `dist.stale` finding, that a build attested against its current sources reads `RAN_CLEAN` with no finding, and that a declared path the checker cannot map to a package reads `ERROR` rather than clean.

- Objective: confirm the `dist-staleness` row state, the finding and the gate for each of the three readings of one declared generated path.
- Real user request: `I rebuilt part of the shared package and shipped the output. Check whether the build the repository carries still matches its sources.`
- Prompt: `Run the quality gate over the generated path and tell me whether the shipped build is stale.`

**Exact prompt**:

```text
Run the quality gate over the generated path and tell me whether the shipped build is stale.
```

- Fixture: three temporary git repositories outside the working tree, each built from the fixture builder the runner suite uses. Each holds `<fixture>/.skilled/skills/system-spec-kit/shared/dist/tsconfig.tsbuildinfo`, one of the eight paths the base layer declares, because the freshness checker only knows the packages it ships a registry row for.

| Repository | Seeded content | What the run must say |
| --- | --- | --- |
| stale | the declared path, a `package.json`, one `.ts` source and a `node_modules` folder, plus a build record attesting a source hash the sources never produce | the `dist-staleness` row reads `RAN_FAIL`, one P1 `dist.stale` finding names the declared path, and the reason is the checker's `STALE DIST WARNING:` line |
| fresh | the same tree, with the build record attesting the hash of the sources as they stand | the row reads `RAN_CLEAN` and no finding is reported |
| unrecognised | the declared path alone, with no package around it | the row reads `ERROR`, and the run reports `NOTHING_CHECKED` rather than a clean gate |

- Expected execution process: the operator reads the dist adapter section of the runner contract, then builds the three repositories by hand and runs the gate over the declared path in each one, reading the `dist-staleness` row and the findings. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: the stale run reads `gate=NO_BLOCKER_FOUND`, exit `0`, row state `RAN_FAIL` and one P1 exact `dist.stale` finding. The fresh run reads the same gate with row state `RAN_CLEAN` and no finding. The unrecognised run reads `gate=NOTHING_CHECKED`, exit `2`, row state `ERROR`.
- Desired user-visible outcome: the author rebuilds the package whose dist entry is stale, and never reads a build the checker could not inspect as fresh.
- Pass/fail: PASS if every value in the expected-result table below holds and each snapshot check passes. FAIL if the stale run reports no finding, the fresh run reports one, the unrecognised run reports a clean gate, or a snapshot check throws.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate over the generated path and tell me whether the shipped build is stale.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 8\. DIST ADAPTER/,$p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
2. Build the three repositories, run the gate over the declared path in each and read the row and the findings.

```bash
node -e '
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const PKG = ".skilled/skills/system-spec-kit/shared";
const DIST = PKG + "/dist/tsconfig.tsbuildinfo";
const pkg = { name: "@spec-kit/shared", version: "1.0.0" };
const source = "export const v = 1;\n";

// The build record the freshness checker reads back: it attests one source hash and one
// dist hash beside the dist entry, so writing it is the same act as finishing a build.
function attest(repo, sourceHash) {
  const entry = path.join(repo.root, DIST);
  const suffix = crypto.createHash("sha1").update("system-spec-kit/shared:default:" + entry).digest("hex").slice(0, 12);
  fs.writeFileSync(path.join(path.dirname(entry), ".dist-freshness-system-spec-kit-shared-" + suffix + ".json"),
    JSON.stringify({ version: 2, origin: "build", sourceHash,
      distHash: crypto.createHash("sha256").update(fs.readFileSync(entry)).digest("hex") }) + "\n");
}
function build() {
  const repo = buildRepo({ base: { [PKG + "/package.json"]: JSON.stringify(pkg, null, 2) + "\n", [PKG + "/index.ts"]: source, [DIST]: "{}\n" } });
  fs.mkdirSync(path.join(repo.root, PKG, "node_modules"));
  return repo;
}
function sourceHash(repo) {
  const hash = crypto.createHash("sha256");
  for (const rel of ["index.ts", "package.json"]) {
    hash.update(rel); hash.update("\0"); hash.update(fs.readFileSync(path.join(repo.root, PKG, rel))); hash.update("\0");
  }
  return hash.digest("hex");
}
const cases = {};
cases.stale = build();
cases.fresh = build();
attest(cases.stale, "0".repeat(64));
attest(cases.fresh, sourceHash(cases.fresh));
cases.unrecognised = buildRepo({ base: { [DIST]: "{}\n" } });
try {
  for (const name of ["stale", "fresh", "unrecognised"]) {
    const run = assertSnapshotUnchanged(cases[name], () => cases[name].run(["--files", DIST, "--format", "json"]));
    const verdict = run.verdict;
    const row = verdict.checks.find((entry) => entry.id === "dist-staleness");
    console.log(name + " gate=" + verdict.gate + " exit=" + run.status + " state=" + row.state + " files=" + row.files);
    for (const entry of verdict.findings) console.log("  " + entry.rule + " " + entry.severity + " " + entry.confidence + " " + entry.file + " " + entry.reason);
    if (row.repair) console.log("  repair " + row.repair);
  }
} finally {
  for (const name of Object.keys(cases)) cases[name].cleanup();
}
'
```

3. `for p in references/runner-contract.md scripts/check-dist-staleness.sh scripts/quality-gate.cjs assets/quality-defaults.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the adapter section: the base layer declares the paths, the per-file checker runs with the read-only switch, and the three readings are named. Step 2 prints one block per repository, each a line with the gate, the exit status, the row state and the file count, one line per finding and, when the row carries one, a repair line:

```text
stale gate=NO_BLOCKER_FOUND exit=0 state=RAN_FAIL files=1
  dist.stale P1 exact .skilled/skills/system-spec-kit/shared/dist/tsconfig.tsbuildinfo STALE DIST WARNING: @spec-kit/shared -- run: cd .skilled/skills/system-spec-kit/shared && npm run build
fresh gate=NO_BLOCKER_FOUND exit=0 state=RAN_CLEAN files=1
unrecognised gate=NOTHING_CHECKED exit=2 state=ERROR files=1
```

Step 3 prints `OK` for all four paths.

| Signal | Expected value |
| --- | --- |
| stale `gate` and exit | `NO_BLOCKER_FOUND` and `0` |
| stale `dist-staleness` state | `RAN_FAIL` |
| stale findings | one `dist.stale`, `P1`, `exact`, on the declared path, reason the checker's `STALE DIST WARNING:` line |
| fresh `gate` and exit | `NO_BLOCKER_FOUND` and `0` |
| fresh `dist-staleness` state | `RAN_CLEAN` |
| fresh findings | none |
| unrecognised `gate` and exit | `NOTHING_CHECKED` and `2` |
| unrecognised `dist-staleness` state | `ERROR` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 3, the frontmatter block with `expected_intent: QUALITY`, the three row lines, the stale finding quoted with its rule, severity and reason, and the closing `OK` lines. Save the transcript under the dated run label the playbook names. The repair line stays absent on the unrecognised run, because the adapter reports the row as `ERROR` and names no path it could not read; record that as found rather than as a missing line.

### Pass / Fail

- **Pass**: the stale run reports exactly one P1 `dist.stale` finding and reads `RAN_FAIL`, the fresh run reads `RAN_CLEAN` with no finding, the unrecognised run reads `ERROR` and gates `NOTHING_CHECKED` with exit `2`, and every snapshot check passes.
- **Fail**: the stale run reports no finding or a blocking one, the fresh run reports a finding, the unrecognised run reads `NO_BLOCKER_FOUND`, or a snapshot check throws.

### Failure Triage

1. If the `dist-staleness` row reads `NOT_APPLICABLE`, no declared path was in scope. Compare the path the fixture writes with the `generated[].paths` rows in `assets/quality-defaults.json`, because the adapter reads only those eight paths.
2. If the row reads `SKIPPED_BY_FLAG` with a repair about the dist-freshness switch, `SYSTEM_HOOKS_DISABLED` or `SYSTEM_DIST_FRESHNESS_DISABLED` is set in the environment or in the hub's hook flags file. Unset it and rerun.
3. If the stale case reads `RAN_CLEAN`, the build record the fixture writes is not the one the checker reads: the file name carries a hash of the package id, the entry name and the absolute dist path, so a record written for another path is ignored. Read the record the checker looks for beside the dist entry.
4. If the unrecognised case reads something other than `ERROR`, the freshness checker found a package it could map. Confirm that the fixture writes no `package.json` above the declared path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: no entry; the nearest is [`codebase-agnostic-quality-gate.md`](../../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md) | The feature catalog describes the runner's verdict and exit codes, and names no dist-adapter entry |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [runner-contract.md](../../references/runner-contract.md) §8 | The adapter, the read-only switch and the three readings |
| [quality-defaults.json](../../assets/quality-defaults.json) | The eight declared generated paths the adapter reads |
| [check-dist-staleness.sh](../../scripts/check-dist-staleness.sh) | The per-file checker and the banner it prints |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The adapter that turns the banner into a row and a finding |
| [fixtures.cjs](../../scripts/tests/fixtures.cjs) | The builder and the snapshot check this scenario uses |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-014
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/dist-staleness-adapter.md`
