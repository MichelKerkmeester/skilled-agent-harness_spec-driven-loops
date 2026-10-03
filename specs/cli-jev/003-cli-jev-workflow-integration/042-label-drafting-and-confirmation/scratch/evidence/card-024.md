# Labeling card 024: hallucination-grader

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/`.

## 1. Question

Does each benchmark output name a command-line flag, file or function that the fixture's task does
not provide — the operator's hallucination truth the Jev/Deem `noul` column and the deterministic
check are compared against (`spec.md:134` REQ-004; `spec.md:75`; `goal.md:50` D3).

## 2. Rubric

The phase defines the two values in the requirement itself (`spec.md:134`):

- `yes` — "the output names a command-line flag, file or function that the fixture's task does not
  provide" (`spec.md:134`; the same definition in `spec.md:72`).
- `no` — anything else: every flag, file and function the output names is one the fixture's task
  provides.

The labeler must read the output **against its fixture**: the fixture is the task and its
`allowlist` of permitted names, and the deterministic check "judges every output against an empty
allowlist" today because none of the 21 fixtures carries an `allowlist` key
(`spec.md:72`; `spec.md:86`; `score-d4-agreement.cjs:46`). So the `yes`/`no` call is about the
fixture's task, not just the output text.

**UNDEFINED — the operator must decide:** whether a *near-miss* invented name counts — e.g. an
output naming a real path with a wrong flag, or a plausible helper the fixture never declares. The
spec defines `yes` by "not provided" but gives no threshold for partial inventions.

Edge cases the spec names:

- Any value other than `yes`/`no` exits 2 naming the row (`score-d4-agreement.cjs:157-158`;
  `spec.md:134`).
- A duplicate `output` exits 2 (`score-d4-agreement.cjs:160`); rows are keyed by file name
  (`:161`).
- `output` must be a bare file name, no `/` (`score-d4-agreement.cjs:153-154`).
- A labeled output that matches no fixture leaves the labeled set and is reported as
  `labels dropped: N` (`:1236`, `:1240`).
- `stop: fewer than 5 labeled yes outputs` / `stop: fewer than 5 labeled no outputs` when a class is
  thin (`:1251-1254`).
- A Jev run needs `--accept-payload` when any labeled output is untracked (`spec.md:138`;
  `goal.md:52` D5).

## 3. Label values

Exact strings the scorer accepts (`score-d4-agreement.cjs:157-158`): `hallucinated: "yes"` or
`hallucinated: "no"`.

## 4. Rows

- **Outputs to label:** `<id>.md` and `<id>.run<k>.md` files under the **operator-named**
  `--outputs <dir>` (`score-d4-agreement.cjs:63-73`; `spec.md:85`). **No output exists in the tree
  today** (`spec.md:49`; `implementation-summary.md:144` prints `outputs: 0`). Producing them is
  explicitly outside the phase, so the operator must first run the benchmark.
- **id field:** there is no `id`; a labels row is keyed by `output`, the file name
  (`score-d4-agreement.cjs:153-161`). The `<id>` inside the name folds `.run<k>` back to the
  fixture id (`:64-70`).
- **Draw command (no seed):**
  `node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--samples <n>] [--scorer 5dim] [--grader noop|mock|llm]`
  (`run-benchmark.cjs:580`), writing `<id>.md` (`:138-141`) and, with `--samples`, `<id>.run<k>.md`
  (`:274-276`). There is no seed flag: `--samples` takes a count only. 21 fixtures exist, each
  usable more than once, so 30 labelable rows are reachable once the benchmark runs.
- **What a labeler reads per row:** open `<outputs dir>/<output file>` and read the output text,
  then open the matching fixture `<id>.json` under `--fixtures`
  (default `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/`,
  `score-d4-agreement.cjs:46`) and read the task it poses plus its `allowlist` (absent in all 21
  fixtures today). The output text is untracked model output (`spec.md:204`).

## 5. Label file

- **Path:** the **operator-named** `--labels <file>` (`implementation-summary.md:179`;
  `spec.md:119` lists `<labels file>` among the operator-named paths).
- **JSON shape:** JSONL, one row per output: `{output, hallucinated}`
  (`score-d4-agreement.cjs:139-162`).
- **Label field:** `hallucinated` (`yes`/`no`). **There is no labeler field** in this schema
  (`:139-162`).
- **Confirmed row:** `{"output":"D4-01.md","hallucinated":"yes"}`.
- **Confirmation:** two models draft each row separately; where the drafts agree the row is
  pre-filled for the operator to approve, and where they differ the operator picks. Only the
  operator-confirmed value may reach `hallucinated`, because the parent goal reads only rows the
  operator confirmed (`../goal.md:50` D4; drafting rule at `../goal.md:257`). The phase's own rule:
  the operator labels every output and no model writes a label (`goal.md:50`; `spec.md:99`).

## 6. Gate

- **Needs:** 30 labeled outputs **and** at least 5 of each class
  (`LABEL_GATE = 30`, `score-d4-agreement.cjs:39`; `CLASS_GATE = 5`, `:41`).
- **Stop lines, in order:** `stop: fewer than 30 labeled outputs` (`:1248`),
  `stop: fewer than 5 labeled yes outputs` (`:1251`),
  `stop: fewer than 5 labeled no outputs` (`:1254`); then `no headroom` above 0.90 baseline
  accuracy (`:1255-1257`). Exit 0 in every stopped case, no arm runs.
- **Run:**
  `node score-d4-agreement.cjs --outputs <dir> --labels <file> --deem --out <dir>` (or `--jev`)
  from `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`
  (`implementation-summary.md:179`).

**Blocked — unblock condition.** No benchmark output exists in the tree and producing one is outside
the phase (`spec.md:49`, `spec.md:98`; `implementation-summary.md:144`). Unblocked by a benchmark run
that writes at least 30 outputs under an operator-named `--outputs` directory, at least 5 labeled
`yes` and 5 `no` after labeling — 21 fixtures exist and `--samples` multiplies rows
(`spec.md:86`; inventory 2, 024 item 5).
