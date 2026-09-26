# Python coverage.py development-oracle spike

> Superseded for the product path on 2026-09-02: the owned frontend measures
> through `sys.monitoring` without a transform or workspace copy. See
> `python-sys-monitoring-spike-2026-09-02.md`. The oracle harness below remains
> the development differential.

Status: development-only correctness oracle. This does not enable Python in
the public CLI, does not change evidence archive v2, and is forbidden from the
eventual user execution path.

## Decision

Supercov's conformance suite imports Python line and arc facts from coverage.py
through its documented Python API. It does not read the `.coverage` SQLite
schema and does not delegate product verdicts, persistence, queries,
confidence, or MC/DC to coverage.py.

This oracle harness has two narrow jobs:

1. a pytest plugin assigns a stable run/worker/test/retry/phase context before
   setup, call, and teardown execute, and records pytest's phase outcomes;
2. an exporter reads coverage.py through `Coverage`, `analysis2`,
   `branch_stats`, and `CoverageData`, then emits deterministic observations
   for Rust to validate and normalize.

Rust remains responsible for project isolation, process supervision, source
path validation, the complete obligation manifest, per-attempt merging,
coverage analysis, limitations, evidence archives, queries, and agent output.

No user run may import or invoke this harness. Product Python measurement is a
separate Supercov-owned frontend: Rust performs ahead-of-run Python
transformation and manifest generation, while an automatically injected
stdlib-only Supercov runtime/import hook and pytest adapter emit the shared
probe protocol. `coverage.py` is used only to differentially validate that
owned implementation during development.

## Accuracy boundary

coverage.py is an independent oracle for executable Python statements and
branch arcs. Its measured contexts can attribute lines and arcs to exact
pytest setup/call/teardown phases and, with one data file per worker, to exact
workers and tests.

It does **not** expose condition vectors or masking MC/DC witnesses. An oracle
import therefore carries a blocking `python-mcdc-unavailable` structural
limitation. Zero imported decisions must never be presented as proof of 100%
MC/DC, and the oracle cannot certify owned MC/DC without separate independent
model vectors.

pytest assertion rewriting is also not a callback around every successful
assertion. A passed call phase proves that the phase completed, but cannot
identify which obligations caused or were checked by a particular assertion.
The frontend therefore declares assertion attribution unavailable until an
owned assertion probe is independently proven. Action attribution is also
unavailable.

Background or unparseable contexts remain explicit background/unattributed
evidence and are excluded from passed-only per-test confidence. They are not
dropped.

## Proven pytest outcomes

The checked-in `pytest-outcomes.json` golden is produced by a real pytest run
containing an ordinary pass, ordinary failure, skip, expected failure, setup
failure, and teardown failure. Collection begins when the generated plugin is
imported, before fixture/conftest imports, rather than waiting until
`pytest_configure`. The xdist controller stops and discards that early
collector once its role is known.

The importer reproduces coverage.py's 11/12 executable lines and 7/8 branch
arcs exactly. Passed-only coverage contains only the terminal ordinary pass;
xfail, failures, skips, and background imports cannot verify it. Setup-only
confidence is derived from the actual setup phase rather than a guessed test
role.

Retries are proven against pytest-rerunfailures 16.6 in serial pytest and
under two-worker xdist. Its observed lifecycle assigns `item.execution_count`
before the ordinary phase hooks and copies the zero-based attempt onto
`report.rerun`. The producer records that identity directly. An intermediate
`rerun` phase becomes a failed attempt; only the terminal pass contributes to
passed-only coverage; the logical test is flaky. Crashed workers, path/package
matrices, and low-level execution surfaces remain explicit open gates.

## Proven causal concurrency

A checked-in 14-test matrix proves exact source attribution for ordinary and
overlapping asyncio tasks, `threading.Thread`, reused `ThreadPoolExecutor`
workers, `subprocess.Popen`, and multiprocessing `spawn`. Work deliberately
released by the following test remains owned by the test that created or
submitted it. The collector uses a coverage.py dynamic-context plugin only at
measured-source frames, avoiding the long-lived pytest-frame scope that would
otherwise pin setup context across an entire run. `ContextVar` carries causal
identity through asyncio and explicit thread/task submission adapters; child
Python processes receive the exact context through a per-launch environment
and coverage.py's documented process-startup configuration.

The matrix also found that exporting `COVERAGE_PROCESS_START` at plugin import
causes xdist workers themselves to auto-start with the controller's `main`
identity. Subprocess activation now happens only after `pytest_configure` has
provided the authoritative worker ID.

This is not yet universal Python concurrency support. Raw `_thread` and
native-extension-created threads, plus low-level `os.system`, spawn, exec,
fork, and forkserver launch paths, are carried as blocking structural
limitations. They must receive independent adapters and crash matrices before
those limitations can be removed.

## Proven worker crash and recovery

A real xdist worker now exits through `os._exit(17)` during its call phase and
is retried successfully on a replacement worker. The generated plugin writes
durable phase-start journal records before user code, enables coverage.py's
documented `_exit` patch so the dying worker saves its in-memory observations,
and joins xdist's controller-side synthetic crash report to the most recent
exact worker/test/retry/phase. Attempt zero remains failed-only coverage;
attempt one alone verifies passed coverage; the combined outcome is flaky.

This does not make uncatchable process death lossless. `SIGKILL` and equivalent
termination cannot execute coverage.py's save path, so the Tier-A frontend
declares `python-hard-kill-evidence-unflushable` as a blocking structural
limitation. Removing it requires an owned streaming probe transport, not a
claim that in-process state survived.

The final oracle-only path corpus covers multiple source roots, namespace
packages, two import names resolving to one physical module, Unicode and space
characters in paths, and source generated at runtime. Its frozen export proves
13/16 statement lines and 5/8 branch arcs with four exact pytest owners. This
closes expansion of the coverage.py harness; subsequent Python work belongs to
the owned Rust transformer and Supercov runtime.

## Public-API basis

- [`Coverage.analysis2`](https://coverage.readthedocs.io/en/7.13.5/api_coverage.html#coverage.Coverage.analysis2)
  supplies executable and excluded statement lines.
- [`Coverage.branch_stats`](https://coverage.readthedocs.io/en/7.13.5/api_coverage.html#coverage.Coverage.branch_stats)
  supplies the number of possible and taken exits per branch line.
- [`CoverageData`](https://coverage.readthedocs.io/en/7.13.5/api_coveragedata.html)
  supplies measured files, contexts, context-filtered lines, and arcs. Its
  documentation explicitly says the database schema can change, so direct
  SQL is forbidden.
- [coverage.py measurement contexts](https://coverage.readthedocs.io/en/7.12.0/contexts.html)
  establish the supported per-test attribution mechanism.
- [pytest hooks](https://docs.pytest.org/en/stable/reference/reference.html#hooks)
  establish setup/call/teardown and outcome lifecycle boundaries.

## Oracle gates before owned-frontend comparison

- Freeze and strictly validate an importer schema, including producer version,
  source roots, branch mode, files, contexts, outcomes, and limitations.
- Prove totals and every executed/missing line and arc against coverage.py on a
  checked-in fixture.
- Test pass, fail, skip, setup failure, teardown failure, retry, xdist workers,
  subprocesses, multiprocessing, threads, async tests, namespace packages,
  generated code, and path aliases.
- Keep oracle output separate from user evidence and compile/import it only in
  development/conformance surfaces.
- Never label an oracle import measurement-complete while MC/DC is unavailable.

## Separate product gates

- Rust-owned Python parser/transformer and complete obligation manifest. The
  parser and first private denominator builder are now implemented with exact
  Ruff byte ranges and stable Supercov IDs. It currently covers statements,
  functions/lambdas, boolean control decisions, logical short-circuiting,
  comprehensions, loops, match/no-match, guards and try/except. Transformation
  and owned observations remain open, so this is not public Python support.
- Supercov-owned probe-v2 runtime with no third-party dependency.
- Automatically injected stdlib-only dynamic-import and pytest lifecycle
  adapters; the existing test command remains unchanged.
- Exact differential against this oracle for statements and branch arcs, plus
  independent golden MC/DC models the oracle cannot provide.
- Evidence v3, query, crash, concurrency, packaging, and arbitrary-suite gates
  driven only by Supercov-owned evidence.
