# Ruby coverage frontend — 2026-09-02

Status: implemented and verified locally on Ruby 4.0.6, 3.4.10 and 3.3.12
through RSpec, Minitest, test-unit and Cucumber. Built in the
`worktree-ruby-frontend` worktree.

## Decision

Ruby was chosen as the language after Python because it is the only large
remaining runtime that clears the same bar Python did: the user's command runs
unchanged, nothing in the repository is copied or rewritten, nothing is built
differently, and the interpreter exposes positions with byte columns. Ruby's
own `Coverage` module reports lines, `if`/`unless`/`case`/`&.` branches and
method entry with `[line, col, end_line, end_col]` keys, and
`RubyVM::InstructionSequence.load_iseq` lets a process compile a modified copy
of a source string under the original path as it loads. Together they give a
frontend that is stdlib-only, in-process, and invisible to the project.

## How it works

- `crates/supercov-engine/src/ruby_instrumenter.rs` parses each file with
  Prism (the `ruby-prism` crate, Ruby's own parser) and builds two things: the
  shared manifest, and a probe plan per file. The plan carries the stdlib keys
  Supercov expects (`then`/`else`/`when`/`in`/`body` spans, method spans) and
  a list of byte-offset insertions.
- Where `Coverage` is silent, a probe call on the `$__supercov` global is
  spliced in: `c(k, i, v)` per condition operand and `d(k, v)`/`w(k, v)` for
  the outcome of multi-condition and loop predicates, `l(k, left)` for
  value-context `&&`/`||`/`||=`/`&&=`, `f(k, coll)` plus `fb(k)` for `for`,
  `h(k, n)`/`p(k)`/`ok(k, v)` for `rescue` handler entry, propagation and
  completion, and `s(k)` for a second statement on a line. No insertion
  contains a newline, so line numbers stay exact.
- Single-condition `if`/`unless`/ternary decisions need no probe: the
  `then`/`else` counts already witness both outcomes and yield the vector.
- `runtime/ruby/supercov_runtime.rb` is loaded through `RUBYOPT=-r`. It starts
  `Coverage` in `oneshot_lines` + `branches` + `methods` mode, prepends the
  `load_iseq` hook (so a later bootsnap definition still runs through `super`),
  and at every phase switch turns `Coverage.result(clear: true)` deltas into
  first-sighting hits. Case-clause misses are derived from counts: a when/in
  clause was missed in every execution that selected a later clause or fell
  through, an explicit else in every execution that selected an earlier one.
- Adapters attach when their classes finish defining (`TracePoint(:end)`):
  RSpec through `with_around_and_singleton_context_hooks`,
  `run_before_example`, `run_after_example`, `set_exception` and `finish`;
  Minitest through `run`, `after_setup`, `before_teardown` and
  `capture_exceptions`. Child processes inherit identity through
  `SUPERCOV_CONTEXT` on `spawn`, `system` and `IO.popen`.
- Evidence uses the same commit-framed transport as Python (`SCVRUBY1`),
  written with `pwrite` and a trailing commit byte, so a killed process loses
  only its uncommitted frame.

## Facts that decided the design

1. `Coverage` branch and method keys are byte columns, matching Prism.
2. On Ruby 3.4 and newer an iseq produced by
   `RubyVM::InstructionSequence.compile` inside a `load_iseq` hook is still
   instrumented by `Coverage`; on 3.3 it is not.
3. `Coverage` has no key for `&&`/`||` operands, `||=`, `for`, or `rescue`;
   `while`/`until` report only a `body` count; `define_method` blocks appear
   as methods. Ternary arms are `StatementsNode`s in Prism but not
   statements in the denominator.
4. Ruby records no line event for the assignment line of `x = begin ... end`
   or `x = (\n ... )`; those statements get a probe.
5. A stdlib key's start shifts when a separate probe statement is inserted at
   the node start, but not when a wrapper opens there (the wrapper becomes
   the node's first token); ends shift for every insertion up to them.
6. `elsif` nodes are visited twice by a naive walk (through the parent's
   chain and as children); `case/in` guards are `if` nodes that Ruby gives
   no branch key for, so they are always probe-driven.
7. A rescue clause appended before `else`/`ensure`/`end` on the same line is
   valid Ruby, as is `(stmt; x ||= v)` as an expression.

## Gates

- `tests/fixtures/ruby-coverage` and `scripts/ruby-coverage-integration.mjs`
  (`npm run test:ruby-coverage`): RSpec and Minitest on the construct
  fixture, exact totals 69/70 lines, 94/106 branch alternatives, 11/17
  conditions, every remaining gap accounted for by the fixture design.
- Identical totals on Ruby 4.0.6 and 3.4.10; Ruby 3.3.12 measures lines,
  methods and stdlib branches (67/68 lines after the two uncountable lines
  leave the denominator) and declares the probe obligations unmeasured.
- A line whose only statements were declined no longer counts as uncovered
  (engine change in `coverage_report.rs`, consistent with the existing rule
  for obligations).

## Ruby 3.3

Ruby 3.3 does not instrument iseqs compiled through a `load_iseq` hook (3.4
does), so the runtime detects the version and runs on stdlib coverage alone:
it matches the plan's unshifted keys, applies no insertions, and declares every
probe-only obligation unmeasured through limitation records that Rust turns
into `manifest.unmeasured`. `Coverage.line_stub` is consulted on every
interpreter so a statement whose first line Ruby never counts (the `case ...
in` line on 3.3) is declared unmeasured instead of reported as a gap.

## Follow-up (same day)

- Iterator blocks are loops: `items.each { }`, `map`, `times`, `select` and
  the rest of a fixed list get the `for` treatment (receiver wrapped in the
  head probe, entry probe first in the block), so zero-versus-entered is
  exact; `map(&:sym)` has no body and stays a call.
- Contexts are thread-scoped: probes attribute to the thread's own phase
  (Minitest's `parallelize_me!` pool runs one test per thread), while a stdlib
  delta collected while another thread was mid-phase goes to the run's
  background with `ruby-concurrent-test-phases` declared. Transport frame
  allocation is locked; without the lock, probe threads tore frames.
- test-unit adapter (`run_setup`/`run_test`/`run_cleanup`/`run_teardown` and
  `TestResult#add_*`), runner `test-unit`.
- Rails dogfood: a `rails new --minimal` app with a scaffold, bootsnap and
  Zeitwerk, `parallelize(workers: 2, threshold: 1)`: 7 tests, 3 interpreter
  processes (parent plus two forked workers), 19 measured files, all through
  bootsnap's own `load_iseq` (ours is prepended and calls `super`). `config/`
  is excluded from the denominator like the rest of the Ruby ecosystem does.

## Follow-up (2026-09-04)

- `||=`/`&&=` on call, index and constant targets are exact: `(pre(k);
  recv[i] ||= (es(k); v))` counts arrivals and right-side starts per phase;
  the difference at the next arrival or phase end is the short-circuit, so
  recursion inside the right side is never mistaken for one.
- Cucumber adapter (`Cucumber::Runtime#run!` hooks `configuration.on_event`);
  identity is `features/x.feature:LINE`, hook steps before the first regular
  step are setup, after it teardown. Runner `cucumber`.
- Python got the same stale-check branch (`supercov-python-` instrumenter
  versions recompute their own fingerprint).
- Position sweep over the corpus (grown to ~3,000 files by 2026-09-04) (ActiveSupport, ActionPack, ActiveRecord,
  ActionView, ActiveModel, Railties, Rack, Mail, RSpec, Minitest, Cucumber,
  Rake, i18n, Nokogiri, Bootsnap, RDoc, Thor, Zeitwerk) is clean. It found and
  fixed: the column-shift rule (keys are `list`, `node` or `point`; a wrapper
  around a key's own node does not extend it, a wrapper around a descendant
  does not move it, a probe moves an expression but not the list it starts,
  an empty `then` is a point at the predicate end that follows closers);
  `&.` keys end at the closing parenthesis or last argument, never a block;
  `if false`/`if true`/literal predicates are folded like Ruby folds them (no
  branch, dead arm skipped); endless `def m = expr` takes `(s(k); expr)`;
  `return x rescue y` and `x rescue next` probe the jump rather than wrapping
  a void value; sources compile as UTF-8, not binary.
- Lines Ruby does not count (`x = case`, multi-line literal assignments, bare
  `begin`, `if false`) are probed at load time on 3.4+: the runtime asks
  `Coverage.line_stub`, synthesizes statement probes with keys from 2**40 and
  re-shifts that file's stdlib keys with the same rule as the instrumenter.
  On 3.3 they stay declared uncountable.
- The runtime no longer requires `json`: loading through `RUBYOPT` before
  Bundler had activated the json default gem and broke `bundler/setup` in the
  Rails app (`You have already activated json 2.18.0`). The plan is a Ruby
  literal, evidence records use a small encoder, inherited identities are
  Marshal + base64. Rails dogfood: 7 tests, 19 files, 0 limitations.

- Ruby's own standard library (728 files) sweeps clean too, which took two
  more fixes. Wrapping a final statement in `ok(k, (...))` is a syntax error
  when the statement has no value, and Ruby's rule for that is narrower than
  it looks: voidness folds through `if`/`unless` (void only when *both* arms
  are void, so a missing arm keeps it nil-valued), through a `begin`'s value
  arm when every rescue arm is void as well, and through parentheses, but not
  through `case`, loops or `&&`/`||`. A void final statement now takes the
  completion probe in each of its arms instead, which is exact: precisely one
  arm runs.
- Measuring can no longer break the program being measured. A file whose
  transformed source fails to compile (any error, not just `SyntaxError`)
  loads unmodified, its keys revert to the untouched source's positions, and
  only the obligations a probe would have proven are declared for it. Ruby's
  Coverage still measures its lines, methods and own branches, so the file
  keeps its place in the total. Verified by injecting a compile failure into
  the fixture: the suite still passed, and the file reported 80/83 lines,
  53/60 branches and 18/18 methods with two declared limitations and no false
  gaps.

- The sweep now drives the runtime's own code. `Supercov::LoadTime` holds the
  transformation, the load-time probes for uncountable lines and the column
  arithmetic, and both the runtime and `scripts/ruby-position-sweep.rb` call
  it, so the corpus checks the Ruby implementation that ships rather than a
  copy of it. The sweep also fails a file whose statement line ends up neither
  countable nor probed.
- `--load` runs every file twice, untouched and transformed, each in its own
  process against a stub probe receiver that returns exactly what the original
  expression evaluated to. A file that loads untouched must still load with
  its probes, which executes every wrapped expression, and every method Ruby
  reports must sit where the plan says, before and after the insertions. That
  is the only way to see method keys at all, since a definition registers only
  when it executes. Files that cannot load outside their own dependency tree
  fail both runs and are skipped.
- `SUPERCOV_RUBY_SKIP_PROBES` (comma-separated path fragments) puts chosen
  files on the uninstrumented path deliberately. It is the support escape
  hatch, and it makes that path a permanent part of the gate: the integration
  now asserts that the suite still runs, that the file keeps 80/83 lines,
  53/60 branches and 18/18 methods through Coverage alone, and that its
  probe-only obligations are declared rather than reported as gaps.

- Sweeping the rest of Rails found the last transformation bug, in
  ActionCable. Ruby's compiler miscounts its stack ("argument stack
  underflow") when an expression that can `return` from inside itself is
  passed as an argument, which is exactly what a probe wrapper does. The
  trigger is fiddly enough that matching it exactly would be guesswork, so
  the rule is now blunt: an expression whose own value can be a jump is never
  wrapped. Its arms carry the probe instead, which stays exact when every arm
  exists, and the construct's completion is declared when one does not. Jumps
  reached through a block, a loop or `&&`/`||` belong to that construct rather
  than to the expression's value and keep their wrapper. This replaces the
  narrower parser-level "void value" rule, which it subsumes.
- Collecting the probe targets is now separate from emitting them, so a
  construct that cannot be observed leaves no half-applied insertions behind.

- Re-shifting a file's keys was quadratic. It walked every insertion in the
  file for every key and rescanned the line table for each one, which the
  sweep made obvious: Mail's generated parsers took minutes and pinned a core.
  Insertions are now indexed by line once per file, so a key looks at two
  short lists. Mail went from minutes to one second, Ruby's standard library
  to twelve seconds for 728 files. The runtime does this work at load time for
  every file that needs a load-time probe, so the same fix removes that cost
  from real runs.

## Follow-up (2026-09-04, after 0.0.33)

- Declared obligations now leave the line total too, for every frontend. The
  line list does two jobs: it is the address space the file and line queries
  resolve against, and it is a denominator. Dropping declared lines to fix the
  denominator broke the address space, which is what the Python gate caught
  before the release. Lines are now folded from every point, declared ones
  included, and each carries whether anything on it could be measured. Only
  measured lines reach the counts, and a line nothing could measure is not an
  uncovered line in the gap projection either.
- The flag rides in the spare byte of the index line record, inverted so a
  zeroed byte still reads as measured. No record grew, no format version
  moved, and the JSON keeps its shape: the flag decides a total, it is not a
  fact about the line worth publishing, and the limitation records already say
  why the line could not be measured.
- The case that made this subtle: a line that executed but whose obligation
  was declined. It used to count as covered, which quietly inflated the line
  ratio. It is now neither covered nor uncovered.

## Open

- Nothing tracked. The frontend is feature-complete for RSpec, Minitest,
  test-unit and Cucumber on Ruby 3.3 through 4.0, and uncommitted.
