# Build design: 034 hvr-reader-needed-lens

Read-only builder's contract for one Python script beside `hvr_scan.py`, its plain-runner test, one labels file and the parent D6 docs. Names, line bands and doc metadata below are marked `(proposed)` where the phase docs or opened code do not fix them.

## 1. Premises

Every `file:line` the phase docs cite, checked in today's tree. Resolution: `hvr_scan.py`, `hvr-rules.md`, `SKILL.md`, `README.md`, `scripts/`, `changelog/` and `manual-testing-playbook/` sit under `.skilled/skills/sk-doc/sk-create-with-human-voice/`; `cli-classifier/` under `.skilled/skills/`; `feature-catalog/` under `.skilled/skills/sk-doc/`; the `system-spec-kit/` row is repo-root relative; `../` rows are relative to this phase folder.

| Citation | State | What sits there today |
|---|---|---|
| `hvr_scan.py:8-11` | ok | docstring: the term lists are parsed from the standard on every run, no copy held |
| `hvr_scan.py:17-21` | ok | docstring: synonym cycling, false ranges, significance inflation and the rest "need a reader", subtotal is "a floor" |
| `hvr_scan.py:26` | ok | `python3 hvr_scan.py <file> --json` usage line, the seam REQ-002 uses |
| `hvr_scan.py:55-57` | ok | `DEFAULT_RULES_PATH` (`:51-53` is a section banner; the correction is logged in `goal.md`) |
| `hvr_scan.py:192` | ok | `def load_rules(rules_path)` |
| `hvr_scan.py:531-535` | ok | `UNSCORED` holds the eleven reader-needed categories |
| `hvr_scan.py:570` | ok | `NOT scored here:` print line |
| `references/hvr-rules.md:275-277` | ok | `### Synonym Cycling Fix`, the 3+ words signal, no lexical rule |
| `references/hvr-rules.md:279-288` | ok | `### False Ranges` with the WRONG/RIGHT and the genuine-range samples |
| `references/hvr-rules.md:317-329` | ok | `### Significance Inflation`; the eight listed phrases sit at `:322-329` |
| `references/hvr-rules.md:277`, `:281`, `:319` | ok | the wording the three fixed `-q` questions are drawn from |
| `.skilled/skills/sk-doc/shared/scripts/validation_switch.py:32` | ok | `SKIPPED_LINE = {"skipped": True, "valid": True, ...}` |
| `.skilled/skills/sk-doc/shared/scripts/validation_switch.py:105-118` | ok | `exit_if_validation_off` prints the skip line on stdout for `--json` and exits 0 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1076-1080` | ok | `deemCommand`: `cli-deem` on PATH, else `[node, <repo>/cli-deem/scripts/cli-deem.mjs]` |
| `cli-classifier/cli-deem/SKILL.md:49-57` | ok | the five `health` rows: reachable within 2,000 ms, shape, `torch`/`ensemble:`, model pin `deem-0.8-v1`, commit pair |
| `../007-classifier-deep-research/context/deem-local.md:38` | ok | `noul` p50 = 60.5 ms |
| `../007-classifier-deep-research/context/deem-local.md:53` | ok | temperature 1.0, probabilities raw |
| `../007-classifier-deep-research/context/deem-local.md:92` | ok | one input returns one answer (40 of 40), so Deem asks once |
| `../017-deem-search-narrowing-arm/spec.md:148` | ok | the exit-handling table this phase follows |
| `../006-goal-criteria-lint/spec.md:166` | ok | a Deem arm's stability is its commit pair |
| `../003-goal-verifier-jev-shadow/goal.md:64` | ok | D9, the payload-acceptance gate that does not bind an offline run |
| `../004-deep-research-expansion/research/research.md:711-729` | ok | R22, with `:715` the unlabeled verdict, `:716` the categories, `:721` the scanner is never edited, `:722` the 80-140 LOC slice, `:723` precision 0.8 on two categories or kill below 0.6, `:724` Q1 fails, `:729` promote-when |
| `../007-classifier-deep-research/research/research.md:97`, `:429`, `:927` | ok | C13, the egress half removed by Deem, the `later` verdict |
| `../007-classifier-deep-research/research/research.md:1045-1047`, `:1076` | ok | rows 95-97 (no validator classifier, no template classifier) and the per-section ask |
| `../002-advisor-jev-tiebreak-arm/implementation-summary.md:104`, `:107` | ok | R21 calibration F1 0.4432 against 0.9843; both verdicts kill |
| `cli-classifier/cli-usage/SKILL.md` | ok | Jev contract: exit classes 0/1/2/3/4/130, `noul` → `{"answers":{"answer":{"noul":<0..1>}}}`, `auth test` → `model`, and an omitted `-s` reads stdin to EOF |
| Files to Change, modify rows | ok | `scripts/README.md`, `SKILL.md`, `.hermes/skills/sk-create-with-human-voice/SKILL.md`, `README.md`, `feature-catalog/feature-catalog.md`, `manual-testing-playbook/manual-testing-playbook.md` all exist |
| Files to Change, create rows | ok | none of the five create paths exists yet |
| `changelog/v1.1.0.0.md` | ok | newest changelog in the packet, so the next is `v1.2.0.0.md` (proposed) |

## 2. Interface

### 2.1 Files

| Path | Role |
|---|---|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | The script (create) |
| `.../scripts/tests/test_hvr_reader_lens.py` | The plain-runner test (create) |
| `.../scripts/hvr-reader-lens-labels.jsonl` | 150 drawn rows, no text (create) |
| `.hermes/skills/sk-create-with-human-voice/SKILL.md` | Regenerated copy (never hand-edited) |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/hvr-reader-needed-lens.md` | Catalog entry (create) |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/reader-needed-lens-measurement.md` | Playbook scenario (create) |
| `<out>/report.json`, `<out>/calls.jsonl` | Run time only, inside the operator-named `--out` directory |

### 2.2 CLI switches and exits

| Switch | Rules | Exit |
|---|---|---|
| none | Census, questions, margin, keep rule, then the label gate or the baselines. Zero spawns of `jev`/`cli-deem`, no file written | 0; 2 on scanner exit 2 or a thin comparator parse |
| `--draw` | Needs `--seed <n>`, a non-negative integer. Rejects `--jev`, `--deem`, `--out`. Writes the labels file. Refuses when any existing row carries a label | 0; 2 on a missing or bad seed, a conflicting switch, or a refusal |
| `--labels <path>` (proposed, mirrors the sibling) | Replaces the default labels path, so a test never writes the packet's file | — |
| `--jev` | Needs `--out <dir>`, checked right after argument parsing and before any call. Runs the Jev gate then, when 150 rows are labeled, the Jev arm | 2 with no `--out`; else 0, a skip or a stop included |
| `--deem` | Same rule for the Deem gate and arm | 2 with no `--out`; else 0 |
| `--out <dir>` | Created only when a report is written | — |

Both switches may be set. Jev runs first. A gate that fails skips its own column and never starts the other backend (literal reading of spec section 3, recorded as `(proposed)` in section 6). A child exit 130 stops that arm and the run still exits 0; Ctrl-C on the script itself leaves the interpreter's 130.

### 2.3 stdout, every line in order

Preamble, emitted by the default run and by every switched run, byte-identical:

1. `census: commit=<40hex> files=<n> sections=<n> flagged=<n> in_band_5_80=<n> refused=<n>`
2. `census: category=<c> candidates=<n>` — one per category, `CATEGORIES` order
3. `question <c> sha256=<64hex>: <text>` — one per category, the text verbatim from REQ-011
4. `margin: 0.10`
5. `keep rule: coverage 10*M >= 9*K, kill 5*TP < 3*(TP+FP) in every category, precision TP+FP >= 1 and 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only), keep at two categories passing`

Gate with no labels: `labels: labeled=<n> of 150`, then `stop: fewer than 150 labeled rows`. At 150: per category `baseline (<c>): flag-nothing right=<n> of <K> comparator right=<n> of <K> chosen=<method> B=<n> yes_share=<n> of <K>`, then per category `headroom (<c>): baseline wrong on <n> of <K>` or `no headroom (<c>)` or `underpowered (<c>)`; fewer than two passable prints `stop: fewer than 2 categories can pass` and neither gate starts.

`--draw`: `draw: seed=<n> commit=<40hex> rows=150`; `draw: category=<c> rows=<n> candidate_rows=<n>` three lines; `draw: wrote <path>`.

Arm gates, only with their switch:
- Deem pass: `deem: health backend=<b> model=<m> model_commit=<mc> source_commit=<sc>`; Deem skip: `deem arm skipped: not reachable|stub backend|model|bad health response`, with `deem: found=<json>` added for `model` and `bad health response`
- Jev identity first, always: `jev: path=<abs path|none> provider=<P>`; then `jev arm skipped: jev not on PATH`, or `jev arm skipped: version` plus `jev: found=<json> path=<abs path>`, or `jev arm skipped: no credential`; after a passing gate, `jev: auth test provider=<P> model=<m>`

Payload notice before the first call:
- `deem: nothing leaves the machine; planned calls: 150; estimated wall time: 9.1 s at 60.5 ms per call, the noul p50 from deem-local.md`
- `jev: payload: sections of tracked committed skill docs; planned calls: 451; estimated input tokens: <n>`

Arm epilogue after every row was attempted:
- `column <backend>: measured=<M> of <K> p50=<n>ms p95=<n>ms` (proposed latency fields)
- three `category <c>: <outcome> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> TP=<TP> FP=<FP> F=<F> p=<p>` lines, where `<outcome>` is `pass` or the first failing of `no headroom`, `underpowered`, `precision`, `margin`, `sign test`, `flips`
- `brier (<c>): <x.xxxx|none>` three lines, never allowed to decide
- `flips: F=<n> of <3*M> calls` (Jev) or `flips: not applicable (deem noul)` (Deem)
- `requalify: model commit changed` (Deem) or `requalify: model changed` (Jev), when a stored report differs
- `verdict <backend>: keep|kill (precision)|stop (coverage)|stop (categories) K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> TP=<TP> FP=<FP> F=<F> p=<p> <identity>`

Whole-column checks fire before the per-category lines: a coverage or kill column prints its verdict line alone, and every category's counts still land in `report.json`. After a passing gate with fewer than 150 labels: `<backend> arm skipped: fewer than 150 labeled rows`. A stopped arm prints `<backend> arm stopped: <reason>` then `<backend>: partial rows=<n>` and no verdict.

`--out` refusal message (the sibling's wording): `--jev and --deem need --out <dir> so every call is recorded`.

### 2.4 report.json

Written only when `--out` was given and a column ran, a column stopped, or the categories stop fired. Body: `commit`, `questions` (`{<c>: {text, sha256}}`), `margin`, `keepRule`, `baseline.categories[<c>]` (`K`, `flagNothingRight`, `comparatorRight`, `method`, `B`, `yesShare`), `headroom[<c>]` (`line`, `canPass`), `columns[<backend>]` (`verdict`, `reason`, `line`, `totals` `{K,M,A,B,W,L,TP,FP,F,p}`, `categories[<c>]` with the same counts plus `outcome`, `condition`, `brier`, `candidate`, `yesShare`, identity fields), `skipped[<backend>]`, `stopped[<backend>]` (`line`, `partialRows`), `requalify[<backend>]`, `categoriesStopped`. Identity: Deem `modelId`, `modelCommit`, `sourceCommit`; Jev `jevVersion`, `provider`, `model`.

`calls.jsonl`, one line per spawn: `backend`, `kind` (`noul`|`auth_test`, proposed), `rowId`, `category`, `rerun`, `attempt`, `wallMs`, `exitCode`, `probability`, `flag`, `status` (`measured`|`unmeasured`|`unmeasured_timeout`), plus the backend's identity fields. The file is created empty on the first append so a killed arm's earlier lines stay readable.

### 2.5 Module-level functions (names proposed unless the phase docs fix them)

| Function | Signature | Behavior |
|---|---|---|
| `git` | `(repo_root, args) -> str` | Runs git with `-C <repo_root>`, `GIT_ENV_REDIRECTORS` deleted from the environment |
| `tracked_files` | `(repo_root) -> list[str]` | `git ls-files -z`, NUL-split |
| `head_commit` | `(repo_root) -> str` | `git rev-parse HEAD` |
| `read_at_commit` | `(repo_root, commit, rel_path) -> str` | `git show <commit>:<rel_path>`; the only document read |
| `sha256`, `sha12` | `(text) -> str` | Full digest; first 12 hex characters |
| `frame_paths` | `(tracked) -> tuple[list[str], int]` | Keeps `*.md` under `.skilled/skills/`, drops any `/changelog/`, `/fixtures/`, `node_modules` segment and any `.env*` basename; returns the kept paths and the refused count |
| `split_sections` | `(text) -> list[dict]` | ATX headings (`^#{1,6}\s`) outside fences (a closing run at least as long as the opener), each section running to the line before the next heading; a leading preamble is one section; `[{"start": n, "end": m}]`, 1-based inclusive |
| `section_text` | `(lines, start, end) -> str` | `"\n".join(lines[start-1:end])` |
| `in_band` | `(section) -> bool` | 5 to 80 lines inclusive |
| `parse_significance_phrases` | `(rules_text) -> list[str]` | The quoted bullets of the H3 section whose title carries `significance inflation`, keyed on the title like the scanner's `_section`; fewer than `MINIMUM_SIGNIFICANCE_PHRASES` is a thin parse and exits 2 |
| `significance_hit` | `(text, phrases) -> bool` | Word-bounded, case-insensitive match of any phrase |
| `false_range_hit` | `(text) -> bool` | `FALSE_RANGE_PATTERN` |
| `question_lines` | `() -> list[str]` | The three `question <c> sha256=<64hex>: <text>` lines |
| `scan_batch` | `(scanner, repo_root, paths) -> list[dict]` | One `python3 <scanner> <paths...> --json` with `cwd=repo_root`; returns `reports`; a top-level `skipped` key raises `ScannerSkipped`; a non-zero/1-but-unparseable result raises `ScannerFailed` (exit 1 is a scan with hard blockers, not a failure) |
| `build_census` | `(repo_root, commit, paths, scanner) -> dict` | Batches through `scan_batch`, splits each file, marks a section flagged when a finding line falls in it, counts files, sections, flagged, in-band flagged and per-category candidates |
| `census_lines` | `(census) -> list[str]` | Lines 1-2 of the preamble |
| `read_jsonl` | `(path) -> list[dict] or None` | Missing file is `None`; a non-JSON line names the file and line |
| `write_jsonl` | `(path, rows) -> None` | One compact JSON object per line, parent made first |
| `holds_label` | `(rows) -> bool` | True when any row's `label` is not null |
| `skill_of` | `(doc) -> str` | The segment of a `.skilled/skills/<skill>/...` path after `skills/` |
| `draw_rows` | `(census, seed) -> dict` | 50 rows per category, ids `r001`..`r150`, each `{id, category, doc, section_start, section_end, commit, section_sha12, candidate, label: null, labeler: null}`; synonym cycling draws at random; the other two draw up to 25 `candidate` rows then fill from the rest; at most `MAX_ROWS_PER_SKILL` per skill per category; `random.Random(seed)` shuffled, pool sorted by `(doc, start)` first; returns the rows plus each category's drawn-candidate count |
| `label_gate` | `(rows) -> dict` | `{complete, labeled, total}`; complete at 150 rows each labeled `yes` or `no`; a missing file is 0 |
| `gate_lines` | `(g) -> list[str]` | `labels: labeled=<n> of 150` then `GATE_STOP_LINE` |
| `read_section` | `(repo_root, row, tracked) -> str` | Refuses (counted, never opened) a doc outside `tracked` or whose basename starts `.env`; reads `git show <commit>:<doc>` and checks the section against `section_sha12` |
| `build_rows` | `(repo_root, rows, phrases) -> list[dict]` | One in-memory row per drawn row with its commit, checked hash, text and `candidate` flag |
| `summarize_baseline` | `(rows) -> dict` | Per category: flag-nothing right, comparator right, chosen method (comparator only when strictly better, flag-nothing on a tie), `B`, `yes_share`, `K`, and a per-row chosen-baseline flag map |
| `baseline_lines`, `headroom_lines` | `(s) -> list[str]` | The `baseline (<c>):` and `headroom (<c>):` lines; `no headroom (<c>)` at `10*B > 9*K`, `underpowered (<c>)` when `K-B < 5` |
| `stop_categories` | `(s) -> bool` | True when fewer than two categories can pass |
| `sign_test_p` | `(wins, losses) -> dict` | Exact one-sided binomial tail with `math.comb` and an all-integer `20*num < den` test; `p = 1` when `wins+losses == 0` |
| `decide_verdict` | `(counts, backend) -> dict` | REQ-006's order: coverage, kill precision, margin, sign test, Jev flips; returns `outcome`, `reason`, `p` |
| `verdict_text` | `(v) -> str` | `keep`, `kill (precision)`, `stop (<reason>)` |
| `summarize_column` | `(backend, rows, probs, baseline, phrases) -> dict` | Per-category and total counts, the modal flag per row (`2*yes > calls`), `F` = sum of `calls - modal_count`, Brier per category over measured rows (a Jev row's probability is the mean of its reruns), latency, `line`, `detail` |
| `which` | `(name, env) -> str or None` | First executable file of that name on the env's `PATH` |
| `spawn_call` | `(file, args, stdin_text, env, timeout_ms) -> dict` | One bounded child; returns `{code, stdout, stderr, wall_ms, timed_out}`; the stdin pipe is closed after the write and a killed child resolves at once |
| `create_call_log` | `(out_dir) -> dict` | Append-only `calls.jsonl` |
| `read_stored_report` | `(out_dir) -> dict or None` | Parsed `report.json`, for the requalify comparison |
| `deem_command` | `(env) -> list[str]` | `which('cli-deem', env)`, else `[python3, parents[3]/cli-classifier/cli-deem/scripts/cli-deem.mjs]` |
| `read_deem_health` | `(cmd, env) -> dict` | One `health` spawn within `HEALTH_TIMEOUT_MS`; maps exits and bodies onto the four skip reasons |
| `deem_gate` | `(ctx) -> dict` | Prints the health line or the skip line, never starts the server, passes no key |
| `run_deem_arm` | `(plan, gate, ctx) -> dict` | Payload notice, one `noul` per row with the row's `-q`, exit handling, records with the commit pair |
| `jev_gate` | `(ctx) -> dict` | Identity line, `--version` exactly `JEV_VERSION`, `auth status --provider P` exit 0 |
| `run_jev_arm` | `(plan, gate, ctx) -> dict` | Payload notice, `auth test --provider P`, three `noul` calls per row with no cache, no dollar figure |
| `build_report` | `(input) -> dict` | The `report.json` body of 2.4 |
| `main` | `(argv, deps=None) -> int` | Argument parsing, the whole run order, exit code. `deps` keys: `repo_root`, `scanner`, `out`, `err`, `env`, `timeout_ms`, `backoff_ms` |

Gates, keep rule and verdict line follow `score-injection-screen.mjs`: `which`/`spawnCall`/`createCallLog`/`readStoredReport`/`deemCommand`/`readDeemHealth`/`deemGate`/`runDeemArm`/`jevGate`/`runJevArm`/`signTestP`/`verdictText`/`summarizeColumn`, with the same skip-line and stop-line shapes.

### 2.6 Constants

From the phase docs: `CATEGORIES` (`synonym-cycling`, `significance-inflation`, `false-ranges`), `QUESTIONS` (the three verbatim texts), `TOTAL_ROWS` 150, `ROWS_PER_CATEGORY` 50, `CANDIDATE_ROWS_PER_CATEGORY` 25, `MIN_SECTION_LINES` 5, `MAX_SECTION_LINES` 80, `FLAG_AT` 0.5, `JEV_RERUNS` 3, `MARGIN` 0.10, `MARGIN_LINE` `margin: 0.10`, `GATE_STOP_LINE` `stop: fewer than 150 labeled rows`, `SCANNER_SKIPPED_LINE` `stop: scanner skipped`, `STOP_CATEGORIES_LINE` `stop: fewer than 2 categories can pass`, `KEEP_RULE_LINE` (2.3 line 5), `DEEM_MODEL` `deem-0.8-v1`, `DEEM_P50_MS` 60.5, `HEALTH_TIMEOUT_MS` 2000, `JEV_VERSION` `jev 0.6.2`.

Proposed: `MAX_ROWS_PER_SKILL` 5 (the spec marks it proposed), `MINIMUM_SIGNIFICANCE_PHRASES` 5, `JEV_TIMEOUT_MS` 90000 (the 90 s cap), `JEV_BACKOFF_MS` 2000, `BATCH_SIZE` 200, `FALSE_RANGE_PATTERN` `\bfrom\s+\S+(\s+\S+){0,3}\s+to\s+\S+` case-insensitive, `SCRIPT_DIR`, `DEFAULT_REPO_ROOT` (`parents[5]`), `DEFAULT_RULES_PATH` (`parents[1]/references/hvr-rules.md`), `SCANNER` (`scripts/hvr_scan.py`), `LABELS_PATH` (`scripts/hvr-reader-lens-labels.jsonl`), `REPO_CLI_DEEM` (`parents[3]/cli-classifier/cli-deem/scripts/cli-deem.mjs`), `GIT_ENV_REDIRECTORS` (the sibling's list).

## 3. Test cases

`name | input | expected`, all against a temp git repository and stub `jev`/`cli-deem` binaries first on `deps["env"]["PATH"]`; no case reaches a live backend.

| name (proposed) | input | expected |
|---|---|---|
| tracked files and read at commit | a temp repo, two commits | `tracked_files` lists committed paths, `head_commit` is 40 hex, `read_at_commit` returns commit two's text, `sha12('abc') == 'ba7816bf8f01'` |
| frame walker keeps skill markdown and refuses .env and changelog | tracked list with a `.env`, a changelog, a fixture and an `sk-doc` doc | kept = the skill doc only; `refused` counts the `.env`; changelog and fixture dropped |
| split sections at ATX headings | a doc with a preamble and two headings | `[{start,end}]` for preamble and both sections |
| a heading inside a fence does not split | a heading inside a ``` fence and inside a `~~~` fence | one section for the fenced block, no split at the inner heading |
| census counts files, sections, flagged and in-band | a fixture whose sections carry findings of 4, 6 and 90 lines | `flagged`, `in_band_5_80` and per-category `candidates` match the fixture |
| a skipped scanner stops the run | `SKDOC_SKIP_VALIDATION=1` | `stop: scanner skipped`, exit 0, no counts printed |
| a scanner exit 2 stops the run | a deps-injected stub scanner exiting 2 | exit 2, no census line |
| significance comparator flags a listed phrase | the parsed eight phrases | `true` for `This marks a pivotal moment in the field.`, `false` for plain prose |
| false-range comparator flags a construction and a genuine range | `From startups to enterprises, everyone benefits.` and `Temperatures range from -10C to 40C.` | both `true` (the genuine range is the over-flag REQ-014 names) |
| a thin standard stops the comparator parse | a rules file holding one phrase | exit 2 |
| draw is reproducible and carries no text | `--draw --seed 7` into two temp paths; the same seed again | byte-identical files; a different seed differs; 150 rows, 50 per category; keys are exactly the ten; every `label` and `labeler` null |
| draw caps rows per skill per category | the drawn rows | at most 5 rows per `skill_of(doc)` per category |
| draw refuses to overwrite a labeled file | a file whose first row carries `label: yes` | exit 2, `draw refused` on stderr, the file byte-unchanged |
| label gate stops at 149 labeled rows | 149 labeled rows | `labels: labeled=149 of 150` + `stop: fewer than 150 labeled rows`; complete at 150 |
| baseline picks the comparator only when it beats flag-nothing | synthetic labeled rows | comparator on a strict win, flag-nothing on a tie, `yes_share` printed |
| headroom, power and the categories stop | `K=100 B=91`; `K=10 B=6`; one passable category | `no headroom (<c>)`, `underpowered (<c>)`, `stop: fewer than 2 categories can pass` |
| an untracked or `.env` row is refused | a labels row naming an untracked doc and one naming `.env` | refused, counted, never read |
| default run calls no stub and writes no file | no switch, stubs first on PATH | exit 0, both stub logs empty, the out dir absent, `stop: fewer than 150 labeled rows` |
| deem gate passes a torch health | stub health | `deem: health backend=torch model=deem-0.8-v1 model_commit=… source_commit=…` |
| deem gate skips a stub backend | stub health reporting `stub` | `deem arm skipped: stub backend`, exit 0 |
| deem arm prints a verdict and records every call | 150 rows, stub `noul` at 0.9 for `yes` | verdict line, 150 records each with `wallMs`, `exitCode`, `modelId`, `modelCommit`, `sourceCommit`, `flips: not applicable (deem noul)` |
| deem exit 4 with a changed commit pair stops the arm | stub health pair `aaa,ccc` | `deem arm stopped: model commit changed mid-run` + `deem: partial rows=0`, no verdict |
| a stored commit pair that differs prints requalify | a `report.json` with another pair | `requalify: model commit changed` on the line before the verdict |
| jev gate passes `jev 0.6.2` with a credential | stub `jev`, `JEV_PROVIDER=openrouter` | identity line with the provider, `auth status --provider openrouter` logged once |
| jev gate skips no credential | stub `auth status` exit 3 | identity line then `jev arm skipped: no credential`, exit 0 |
| jev gate skips a wrong version | stub `--version` printing `jev 0.7.0` | `jev arm skipped: version` + a details line with the version found and the path |
| jev arm sends one `--provider` on every call | 150 rows, stub `noul` | 451 logged calls (1 `auth test` + 450 `noul`), exactly one `--provider P` on each |
| jev exit 3 after the gate stops the arm | stub `noul` exit 3 | `jev arm stopped: key rejected` + `jev: partial rows=0` |
| verdict keep when every check passes | counts with `M=3K/2`, precision 1.0, margin, p below 0.05 | `keep` |
| verdict kill (precision) | precision below 0.6 in every category, or no `yes` flag at all | `kill (precision)` |
| verdict stop (coverage) | one category at `10*M < 9*K` | `stop (coverage)` |
| verdict stop (categories) | exactly one category passing | `stop (categories)` |
| sign test is exact and returns p 1 at no disagreements | `(5,0)`, `(4,0)`, `(0,0)` | p 0.03125 below; p above the bar; p 1 |
| `--out` is required for both switches | `--jev` alone, `--deem` alone | exit 2, empty stdout, one stderr line, no call |
| `--draw` needs a valid non-negative seed | `--draw` alone, `--draw --seed x`, `--draw --jev` | exit 2 each, file untouched |
| both switches print Jev first | labeled fixture, both stubs passing | the Jev verdict line precedes the Deem one, each with three category lines |

`python3 tests/test_hvr_scan.py` still prints `ALL PASS` (11 PASS on 2026-09-29) and is not modified.

## 4. Build steps

One change per executor. Devin builds code, Pi builds docs (parent D5). Script line bands are `(proposed)`; the spec's estimate is 400-500 LOC.

1. **Code (Devin): fixture harness and frame walker.** `tests/test_hvr_reader_lens.py` gains `make_repo`, `temp_dir`, `clean_env`, `make_stubs`, `stub_log`, `stub_env`, `run_main`, the `JEV_STUB`/`DEEM_STUB` scripts and the corpus fixture, copied in shape from `benchmark/injection-screen/tests/score-injection-screen.test.mjs`. Script lines 1-70: `git`, `tracked_files`, `head_commit`, `read_at_commit`, `sha256`, `sha12`, `frame_paths`. Test names: `tracked files and read at commit`, `frame walker keeps skill markdown and refuses .env and changelog`.
2. **Code (Devin): section splitter.** Script 71-100: `split_sections`, `section_text`, `in_band`. Test names: `split sections at ATX headings`, `a heading inside a fence does not split`.
3. **Code (Devin): scanner bridge and census.** Script 101-170: `scan_batch`, `build_census`, `census_lines`, and the `ScannerSkipped`/`ScannerFailed` handling with `SCANNER_SKIPPED_LINE` and exit 2. Test names: `census counts files, sections, flagged and in-band`, `a skipped scanner stops the run`, `a scanner exit 2 stops the run`.
4. **Code (Devin): comparators.** Script 171-205: `parse_significance_phrases`, `significance_hit`, `false_range_hit`, `MINIMUM_SIGNIFICANCE_PHRASES`, `FALSE_RANGE_PATTERN`. Test names: `significance comparator flags a listed phrase`, `false-range comparator flags a construction and a genuine range`, `a thin standard stops the comparator parse`.
5. **Code (Devin): draw and labels file.** Script 206-265: `read_jsonl`, `write_jsonl`, `holds_label`, `skill_of`, `draw_rows`, and `--draw` in `main`. Test names: `draw is reproducible and carries no text`, `draw caps rows per skill per category`, `draw refuses to overwrite a labeled file`, `--draw needs a valid non-negative seed`.
6. **Code (Devin): rows, baselines, label gate, headroom.** Script 266-325: `read_section`, `build_rows`, `label_gate`, `gate_lines`, `summarize_baseline`, `baseline_lines`, `headroom_lines`, `stop_categories`. Test names: `label gate stops at 149 labeled rows`, `baseline picks the comparator only when it beats flag-nothing`, `headroom, power and the categories stop`, `an untracked or .env row is refused`.
7. **Code (Devin): bounded calls and records.** Script 326-370: `which`, `spawn_call`, `create_call_log`, `read_stored_report`, `GIT_ENV_REDIRECTORS`, `JEV_TIMEOUT_MS`, `JEV_BACKOFF_MS`. Test names: `a spawn past the timeout is killed and marked unmeasured_timeout`, `a missing answer is recorded unmeasured, never 0`.
8. **Code (Devin): Deem gate and arm.** Script 371-425: `deem_command`, `read_deem_health`, `deem_gate`, `run_deem_arm`, the payload notice, the four skip lines, the exit handling and the commit-pair records; `main` refuses `--jev`/`--deem` without `--out` right after parsing. Test names: `deem gate passes a torch health`, `deem gate skips a stub backend`, `deem arm prints a verdict and records every call`, `deem exit 4 with a changed commit pair stops the arm`, `a stored commit pair that differs prints requalify`, `--out is required for both switches`.
9. **Code (Devin): Jev gate and arm.** Script 426-490: `jev_gate`, `run_jev_arm`, the identity line, the three skips, `auth test --provider P`, three uncached `noul` calls per row, the payload line without a dollar figure. Test names: `jev gate passes jev 0.6.2 with a credential`, `jev gate skips no credential`, `jev gate skips a wrong version`, `jev arm sends one --provider on every call`, `jev exit 3 after the gate stops the arm`.
10. **Code (Devin): verdict, report and run order.** Script 491-560: `sign_test_p`, `decide_verdict`, `verdict_text`, `summarize_column`, `build_report`, and `main`'s Jev-first order and `report.json` write. Test names: `verdict keep when every check passes`, `verdict kill (precision)`, `verdict stop (coverage)`, `verdict stop (categories)`, `sign test is exact and returns p 1 at no disagreements`, `both switches print Jev first`, `default run calls no stub and writes no file`.
11. **Doc (Pi): scripts README.** `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/README.md`, sk-doc mode `sk-create-readme`, model the file's own `## 0. OVERVIEW` table. Facts: one row each for `hvr_reader_lens.py` (the zero-call census, the `--draw` sample, the label gate, `--jev`/`--deem`), `tests/test_hvr_reader_lens.py` and `hvr-reader-lens-labels.jsonl`; a USAGE line for each switch; `hvr_scan.py` and its fixtures are unchanged.
12. **Doc (Pi): packet SKILL.md, then the Hermes copy.** `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md`, sk-doc mode `sk-create-skill`, model its own Resource Domains and Related Resources lists. Facts: one sentence naming the offline reader-needed lens, its zero-call default, its `--jev`/`--deem` switches and that the scanner is unchanged. Then `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` regenerates `.hermes/skills/sk-create-with-human-voice/SKILL.md`; `--check` exits 0.
13. **Doc (Pi): packet README.** `.skilled/skills/sk-doc/sk-create-with-human-voice/README.md`, mode `sk-create-readme`, model its own section 3 and 5. Facts: one line naming the script, its zero-call default and both switches.
14. **Doc (Pi): changelog entry.** `.skilled/skills/sk-doc/sk-create-with-human-voice/changelog/v1.2.0.0.md`, mode `sk-create-changelog`, model `changelog/v1.1.0.0.md` (re-check the newest at build time). Facts: the new script and labels file, the zero-call default, the label gate, the two switches behind their gates, `hvr_scan.py` byte-identical; `Upgrade: No migration required.`
15. **Doc (Pi): feature catalog entry.** `.skilled/skills/sk-doc/feature-catalog/document-validation/hvr-reader-needed-lens.md`, mode `sk-create-feature-catalog`, model `feature-catalog/document-validation/goal-criteria-lint.md`. Version `2.2.0.0` `(proposed)`. Facts: sections 1-4 as in the model; source rows for the script, the test, the labels file and `hvr_scan.py`; Group `Document Validation`; no verdict is claimed.
16. **Doc (Pi): feature catalog index.** `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md`, mode `sk-create-feature-catalog`, model its own `### Goal Criteria Lint` block. Facts: a new `### HVR Reader-Needed Lens` block under `## 4. DOCUMENT VALIDATION` with Description/Current Reality/Source Files, the new trigger phrase in the frontmatter, `last_updated` and version `2.2.0.13` `(proposed)`.
17. **Doc (Pi): playbook scenario.** `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/reader-needed-lens-measurement.md`, mode `sk-create-manual-testing-playbook`, model `tell-detection/judgment-pass-not-covered-by-the-scanner.md`. Playbook ID `HVT-004` `(proposed)`. Facts: the zero-call run prints the census and the stop line; a stub backend prints its skip line and nothing else; the evidence rows are the census, both stub logs, `git status --porcelain` and the exit codes; no live verdict is claimed.
18. **Doc (Pi): playbook index.** `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md`, mode `sk-create-manual-testing-playbook`, model its own `### HVT-003` block and section 10 table. Facts: an `### HVT-004` block under `## 7. TELL DETECTION`, a section 10 cross-reference row and a version bump `1.1.0.5` `(proposed)`.
19. **Run step (orchestrator, no file change): draw.** `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --draw --seed <n>`; the parent session commits `hvr-reader-lens-labels.jsonl` and the phase stops at the label gate.
20. **Run step (orchestrator, no file change): zero-call run.** Stubs first on PATH, record the census and the stop line in `goal.md`'s log, confirm both stub logs are empty and `git status --porcelain` is unchanged.
21. **Run step (orchestrator, no file change): after the operator's 150 labels.** One zero-call run, then one `--jev --out <dir>` when the Jev gate passes and one `--deem --out <dir>` when the Deem gate passes, unless the zero-call run prints `stop: fewer than 2 categories can pass`. Record each verdict, category and skip line in `goal.md`'s log.

## 5. Proof plan

| # | Criterion (`goal.md` section 3) | Command | Expected |
|---|---|---|---|
| 1 | The zero-call default | `PATH=<stub-bin>:$PATH python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` then `wc -l <stub-bin>/jev.log <stub-bin>/cli-deem.log` | exit 0; a `census:` line with `flagged=` and three `candidates=` lines; `stop: fewer than 150 labeled rows` (the accepted end state while the labels are open) or three `baseline (<c>):` and three `headroom (<c>):` lines; `0` from both logs |
| 2 | The two skips, byte-identical otherwise | `diff <(python3 …/hvr_reader_lens.py) <(python3 …/hvr_reader_lens.py --deem --out <tmp>)` with a stub health reporting `stub`; the same with `--jev --out <tmp>` and stub `auth status` exit 3 | added lines exactly `deem arm skipped: stub backend`, or `jev: path=… provider=official` + `jev arm skipped: no credential`; each exit 0 |
| 3 | Tests | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py` | `ALL PASS` exit 0 with at least 18 PASS lines; `ALL PASS` exit 0 with its 11 PASS |
| 4 | One verdict per gate that passed | the live `--jev --out` and `--deem --out` runs, then `grep -c '"wallMs"' <out>/calls.jsonl` and the same for `"exitCode"` | one `verdict <backend>:` line and three `category` lines per gate that passed, every `calls.jsonl` line holding `wallMs` and `exitCode`, `modelCommit`/`sourceCommit` on Deem lines and `provider`/`model` on Jev lines; or the zero-call `stop: fewer than 2 categories can pass` (the accepted end state while the labels are absent) |
| 5 | Hygiene | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`; `git diff --stat -- .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`; `git status --porcelain` before and after a run; `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc> --type <t>` | no match (grep exit 1); empty; identical; `VALID` with exit 0 on every changed skill doc |
| 6 | Packet gate | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens --strict` | `RESULT: PASSED`, exit 0 |

## 6. Open questions

The spec leaves these open. Each answer is `(proposed)` and the build follows it.

1. stdout order between the whole-column checks and the per-category lines: checks 1 and 2 short-circuit, so a coverage or kill column prints its verdict line without category lines, and `report.json` always carries every category's counts and p (proposed).
2. `--labels <path>` is an addition the spec does not name. It mirrors the sibling's `--labels` and is needed so the test never writes the packet's labels file (proposed).
3. Both switches with one gate failing: the other backend never starts, the literal reading of spec section 3 (proposed).
4. A child exit 130 prints `<backend> arm stopped: interrupted`, matching the sibling; 017's table names only `interrupted` (proposed).
5. A drawn but unlabeled file may be redrawn; only a label blocks `--draw` (proposed).
6. `report.json` is written only when a column ran or stopped, never by the default run or a skipped arm (proposed).
7. The Jev row probability for the Brier line is the mean of its three reruns, and the Brier is per category over measured rows (proposed).
8. Changelog `v1.2.0.0.md` (newest at planning was `v1.1.0.0.md`), catalog entry version `2.2.0.0` with the index at `2.2.0.13`, playbook ID `HVT-004` and index version `1.1.0.5` (all proposed; re-check each at build time).
