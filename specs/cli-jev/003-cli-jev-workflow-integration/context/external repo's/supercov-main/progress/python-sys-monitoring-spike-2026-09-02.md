# Python `sys.monitoring` frontend spike — 2026-09-02

Status: implemented (see the final section). Spike scripts live in
`spikes/python-monitoring/`.

## Decision

The owned Python frontend measures through CPython's `sys.monitoring`
(PEP 669) and modifies neither source nor bytecode. There is no shadow
workspace: code runs in place, so the venv, editable installs, `.pth` files and
`rootdir` resolve exactly as in an unwrapped run. Rust still builds the complete
obligation manifest ahead of the run from source with Ruff
(`python_instrumenter.rs`); the Python side maps bytecode events onto that
manifest and emits probe-v2 evidence.

Support starts at CPython 3.14 as the reference interpreter and is extended
downward to 3.13 and 3.12. Nothing older is targeted. The earlier plan of a
Rust text transform applied at import time stays alive only as a second owned
implementation for differential testing, next to the coverage.py oracle.

This supersedes the ahead-of-run transform product path described in
`python-tier-a-spike-2026-08-25.md` while keeping its oracle, fixture corpus,
pytest lifecycle findings and context-propagation adapters.

## What CPython provides

- `co_positions()` (3.11+) gives every instruction a source span in line and
  UTF-8 byte column, the units the Ruff manifest already stores.
- `co_branches()` (3.14) enumerates every branch instruction with both
  successors before execution. On 3.12 and 3.13 `dis.get_instructions` plus
  the next instruction's offset yields the same table.
- `BRANCH_LEFT` / `BRANCH_RIGHT` (3.14) or `BRANCH` (3.12, 3.13) deliver
  `(code, offset, destination)` per conditional jump. `LINE`, `INSTRUCTION`,
  `PY_START`, `PY_RETURN` and `JUMP` are sufficient for the product model;
  exception flow is derived structurally without global exception callbacks.
- Callbacks may return `DISABLE` per location; `restart_events()` re-arms
  everything at a test boundary.

## Executable findings (CPython 3.14.4, macOS arm64)

1. **Leaf jumps carry the atomic condition's exact span.** For
   `if a and (b or c):` the three jumps sit on `a`, `b` and `c` with the same
   byte columns Ruff reports. `elif`, `while`, `assert`, `match` guards,
   walrus conditions, `in` and `is not None` comparisons behave the same.
   `not a` jumps on the operand `a` with inverted opcode, so Rust must ship a
   `not`-depth polarity per condition. Chained comparisons emit two jumps that
   both carry the whole comparison's span, which is one condition in the
   manifest. A ternary used as a condition emits three jumps all inside the
   single condition's span. Value-context `a or b` emits one jump carrying the
   whole BoolOp's span rather than an operand's.
2. **MC/DC vectors reconstruct exactly from destination offsets.** Condition
   value is inferred from whether the destination is the fall-through or the
   jump target, combined with opcode sense and polarity. The `LEFT`/`RIGHT`
   naming is not used; the documentation does not guarantee which is taken. A
   per-context LIFO stack of open evaluations keyed by `ContextVar` produced
   the correct eight vectors for `a and (b or c)`, the correct three vectors
   for a decision that recurses into itself inside its second condition, and
   the correct vectors for three interleaved asyncio tasks evaluating
   `await slow(a) and await slow(b)`. An evaluation is complete when a
   control flow has no advancing condition jump in the decision.
3. **Inlined comprehension filters have wrong positions on 3.13 and 3.14.**
   `[x for x in xs if x and c]` stamps both filter jumps with the element
   expression's span; a dict comprehension stamps the last one that way.
   3.12 stamps the conditions correctly. Map those jumps by offset order
   within the comprehension instead of by span, and pin it in the corpus.
4. **Overhead.** DISABLE-able `LINE`, `PY_START` and branch events cost
   1.03x on a mixed workload and 1.10x on a loop that is nothing but boolean
   decisions. Always-on branch callbacks with a table lookup cost 3.0x mixed
   and 9.4x branch-dense. Hashing a code object walks its bytecode, so tables
   must be keyed by `id(code)` (8x difference measured). Enabling branch
   events only on code objects that contain multi-condition decisions via
   `set_local_events` reduced the mixed case to 1.42x. Adding DISABLE once a
   decision's paths are exhausted reduced both cases to 1.0x. One thousand
   `restart_events()` calls plus a small re-run cost 12 ms.
5. **`LINE` events are line-granular.** `if a: return 1` fires once. Two
   statements on one line measure as one and need a declared limitation.
6. **`exec` code is visible.** Dynamically compiled functions emit events, so
   string-compiled code can carry aggregate evidence rather than only a
   limitation, once a runtime manifest exists for it.
7. **`-X no_debug_ranges` yields `None` columns** and must fail closed.

## Design consequences

- Rust ships per file: obligations with byte spans, the and/or tree per
  decision, `not` polarity per condition, and the statically enumerated set of
  reachable short-circuit paths per decision. Constant-folded conditions and
  `while True` tests, which the compiler removes, must be marked statically
  decided in Rust rather than discovered missing at runtime.
- The Python runtime is stdlib-only, started from a `sitecustomize` on a
  Supercov `PYTHONPATH` entry and, for the pytest process, from the generated
  plugin named in `PYTEST_PLUGINS`. Identity flows through `SUPERCOV_CONTEXT`
  as it does for Node. Evidence goes through the mmap transport so a hard kill
  loses nothing.
- Per code object, the runtime maps branch offsets onto manifest conditions at
  first `PY_START`, enables branch events locally only where a multi-condition
  decision exists, and disables a decision's locations once every reachable
  path has been observed in the current test context. Leaves whose exit
  uniquely identifies the path (pure `and`/`or` chains) can disable per
  direction immediately after first sighting.
- A condition that raises can leave an incomplete evaluation, but the bounded
  per-context stack is replaced by the next source-ordered evaluation and
  never becomes coverage evidence on its own.
- Interpreters started with `-I`, `-E` or `-S`, `.pyc`-only distributions,
  frozen modules and C extensions remain declared limitations.

## Gates before support is claimed

- A per-interpreter position corpus (3.14, 3.13, 3.12) covering every
  construct in the Ruff denominator, including the comprehension quirk.
- Exact agreement with the frozen coverage.py goldens under
  `tests/fixtures/python-pytest` for statements and arcs.
- Agreement with the Rust text-transform implementation on vectors for the
  MC/DC golden models the oracle cannot provide.
- Overhead budget measured on real suites with the local-events and
  path-exhaustion strategy in place.
- pytest, xdist, rerunfailures, unittest, crash and concurrency fixtures driven
  only by owned evidence.

## Implementation status (same day)

The frontend described above is implemented and verified locally on CPython
3.14.4, 3.13.1 and 3.12.9. `supercov -- pytest` (or `python -m pytest`,
`uv run pytest`) publishes an evidence-v3 run with exact pytest identity; the
CLI's Python refusal is gone.

- `crates/supercov-engine/src/python_instrumenter.rs` builds the manifest and
  the runtime probe plan (spans, `not` polarity, and/or trees with negated
  nodes, trigger lines, loops, value-context logical operators, match cases).
- `crates/supercov-engine/src/python_project.rs` discovers sources in place
  (tests, venvs, tooling directories excluded) and writes the plan.
- `crates/supercov-engine/src/python_evidence.rs` validates commit-framed JSON
  records from the mmap transport and joins them into the frontend protocol;
  `python_run.rs`
  orchestrates the run with four environment variables and no workspace copy.
- `runtime/python/` holds the stdlib-only runtime, the `sitecustomize` hook
  and the pytest adapter, embedded into the binary.
- `tests/fixtures/python-monitoring`, the expanded
  `tests/fixtures/python-position-corpus`, plus
  `scripts/python-monitoring-integration.mjs` (`npm run test:python-monitoring`)
  gate serial pytest, xdist, reruns, a killed worker, thread pools,
  multiprocessing spawn, interleaved asyncio tasks, unittest/subtests,
  fail-closed interpreter modes and exact cross-version position totals. The
  calculator fixture reproduces the coverage.py golden's 10/12 lines and 6/8
  arcs exactly without using coverage.py in the product path.

Facts learned while making it exact, beyond the spike:

1. The not-taken successor in `co_branches()` and in the event is the
   instruction after 3.14's `NOT_TAKEN` glue, not the glue itself; deriving
   fall-through from `dis` made every not-taken jump look taken.
2. Destination containment is insufficient on 3.14. A not-taken branch can
   land on `NOT_TAKEN` glue still positioned on the previous condition, and an
   awaited condition reaches its next leaf through the successful target of
   `SEND`. The mapper follows straight-line and unconditional control flow to
   the next advancing leaf. A comprehension back-edge to the same or an
   earlier leaf starts the next element's vector rather than continuing the
   current one. This also fixes a ternary used as one source condition: its
   selector jump is internal and only the selected operand's jump determines
   the condition value.
3. A cache keyed by `id(code)` is unsafe under pytest: collection frees code
   objects whose ids return on application code. Entries carry a weak
   reference and are verified by identity.
4. `not (a and b)` compiles to one jump per operand; the tree keeps both as
   conditions and negates the node, which MC/DC treats correctly.
5. Match-case failure paths run through a `POP_TOP` still positioned at the
   pattern; a miss is a taken jump whose destination is not in the case body.
   An irrefutable case is "not selected" exactly when an earlier case was.
6. Performance is governed by which locations stay live. Statements and
   function entry (first `LINE` inside the code object) disable after first
   sighting; decisions whose leaves have a unique prefix (every plain
   `and`/`or` chain and `a and (b or c)` shapes) record their vector from a
   single event and disable per direction; other decisions disable once all
   statically enumerated vectors are observed; loops disable the body
   direction and re-arm the code object at each exit (capped at 16 per
   phase). Re-arming is per touched code object, never `restart_events()`,
   so pytest and stdlib frames stay quiet. A 200-module, 1000-test synthetic
   suite runs at 1.04s under Supercov versus 0.92s plain.
7. `POP_JUMP_IF_NONE` and `POP_JUMP_IF_NOT_NONE` do not by themselves identify
   source truth. Rust records whether the source leaf is `is None` or
   `is not None`; the runtime combines that metadata with the specialized
   opcode. This is pinned for both operand orders and all supported versions.

Follow-up the same day closed the remaining items:

- `try`/`except`/`finally` is measured from structure alone, without the
  global exception events (which cannot be enabled per code object): handler
  type checks are conditional jumps stamped with the `except` clause (their
  *end* position runs into the body, so membership is tested by start), handler
  bodies prove selection and "raised" by LINE, `finally` bodies are duplicated
  per exit path and classified by what precedes each copy (body or else code
  means success, `PUSH_EXC_INFO`/`RERAISE` means the exceptional path), and a
  try body's normal completion is the first instruction after the body, kept
  live together with the handlers' merge jumps so arrivals minus handler exits
  count successes. Returns and breaks inside the body use `PY_RETURN` and
  `JUMP` events.
- Statements sharing a line are proven by an `INSTRUCTION` event at the first
  instruction stamped inside their span; several lambdas on one line are told
  apart by the code object's first positioned instruction.
- `python -m unittest` has an adapter patching `_callSetUp`, `_callTestMethod`,
  `_callTearDown` and the `TestResult.add*`/`stopTest` hooks; it is inert in a
  pytest process, where pytest owns unittest classes too.
- Loops on 3.12 and 3.13 stay live until both outcomes are seen, so they are
  exact at a per-iteration cost; 3.14 keeps the per-direction scheme.
- Archive compression moved from best to default. Publication no longer clones
  the complete outcome map or scans every phase for every test; identities are
  indexed once by attempt and consumed. On the checked-in 200-module,
  1000-test benchmark (`npm run benchmark:python-monitoring`, CPython 3.14.4,
  debug Rust build), join is 136ms, serialization 117ms and archive writing
  241ms: 494ms total, down from roughly 900ms.

The runtime transport is one mmap per interpreter process. Its fixed header
declares version, owner, capacity and a fail-closed drop counter. Each record
has a bounded length and FNV-1a checksum; payload and checksum are written
before a one-byte commit marker. A killed process therefore preserves every
committed record and leaves at most an ignored, uncommitted tail. The xdist
crash fixture calls `os._exit(17)` between a decision observation and its
runner outcome, then verifies that the failed-attempt vector survived and the
retry remained separately attributable. Forked children rotate inherited
mappings to pid-owned files before recording.

Event-interaction rules learned: a `DISABLE` returned from the LINE callback
drops the INSTRUCTION event of that same instruction for the current pass, and
a `DISABLE` from the INSTRUCTION callback on a conditional jump drops its BRANCH
event, so lines carrying instruction consumers keep LINE live and branch
offsets keep INSTRUCTION live. `info.has_branches` must be computed after every
consumer kind is mapped.

Promotion gates are now wired into `release:check` and the compatibility
workflow covers CPython 3.12, 3.13 and 3.14 on Linux plus 3.14 on macOS and
Windows. Remaining exclusions are deliberate model boundaries already exposed
to users (dynamic string code, raw/native threads, unsupported child launchers
and interpreter isolated modes), not unfinished support work.
