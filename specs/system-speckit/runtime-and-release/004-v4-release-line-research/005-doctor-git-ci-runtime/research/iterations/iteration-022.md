# Iteration 022 — Uncited doctor scripts

## Focus

Iteration 22 focus: the ten doctor engine scripts this child has never cited, and the route assets that call each. Target defects: an exit code that hides a failure, a write performed by a check-only route, a flag an asset passes that the script rejects, and a path compared as a string across the `.opencode` aliases. Seven of the ten were read (`agents-md-embed.cjs` and `sk-skill-convert.cjs` only at their write gates, `mcp-doctor-lib.sh` only at its counters and root resolver), and six commands were executed in their check or dry-run form.

## Actions Taken

Commands run (all read-only or check-form; command → key output line → exit):

| Command | Key output line | Exit |
| --- | --- | --- |
| `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` | `"status": "warnings"`, `"summary": { "pass": 18, "warn": 1, "fail": 0 }`; the single warn is `utcp_credentials` → `webflow_WEBFLOW_TOKEN=missing` | 1 |
| `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json --root /nonexistent-dir-xyz` | stderr `Error: --root is not a directory: /nonexistent-dir-xyz`, stdout 0 bytes | 3 |
| `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs check --json` | `"config": { "source": "repo", ... "errors": [] }` | 0 |
| `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs status --json` | JSON document, then `STATUS=OK SOURCE="repo" TRUST=trusted`; whole-stdout `JSON.parse` fails at position 8459 | 0 |
| `node .skilled/commands/doctor/scripts/git-standards.cjs status --json` | JSON document, then `STATUS=OK SOURCE=".skilled/skills/sk-git/assets/"`; parse fails at position 1920 | 0 |
| `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | nine `PASS` lines, last line `STATUS=OK legs=9` | 0 |
| `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | `(report-only — the canonical reindex is operator-gated; nothing was written)`; every drift row `none` | 0 |

`doctor-phrase-reach.cjs` was read but deliberately not executed: its header owns a possible write inside the repository (F22-08), which is outside this run's write authority. `agents-md-embed.cjs plan` and `sk-skill-convert.cjs plan` were read at their write gates only; both hold (`apply` refuses without a digest at `agents-md-embed.cjs:1293`, and the converter prints `Apply gate: no writes without --apply.`).

Reads: `mcp-doctor.sh` (:1-110, :300-362), `mcp-doctor-lib.sh` (:48-49, :168-176), `git-standards.cjs` (:1-80, :212, :231), `orphan-process-check.cjs` (:300-345, :470-640), `doctor-helper-match.cjs` (:526-590), `doctor-phrase-reach.cjs` (:1-60, :160-215), `sk-code-quality-config.cjs` (:80-110, :203), `sk-code-setup-check.cjs` (:409-410, :435), `skill-graph-freshness.cjs` (:314), plus `_routes.yaml` (:255-300, :350-372, :215, :280, :319-323, :456), `doctor-setup.yaml` (:50-80), `doctor-setup-presentation.txt` (:75, :80), `setup.md` (:69), `README.markdown` (:94, :126).

## Findings

### F22-01 — The doctor engine family ships two incompatible `--json` contracts on the same stream

**Type** drift · **Severity** P2 · **Release** v4.0.0.0 (baseline) or earlier — `git-standards.cjs` dates to 2026-10-04, `sk-code-quality-config.cjs` to 2026-10-26, both before the baseline tag; **Confidence** high, measured.

`sk-code-quality-config.cjs` documents `--json` as printing "one JSON document **before** the STATUS line" [SOURCE: .skilled/commands/doctor/scripts/sk-code-quality-config.cjs:86], and `git-standards.cjs` says every call ends "always with a `STATUS=` line" [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:37]. Both write the JSON with `process.stdout.write` and then continue writing human lines into the same stream [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:212], [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:231]. The rest of the family does not: `mcp-doctor.sh` ends with one `emit_json_report` and `exit` [SOURCE: .skilled/commands/doctor/scripts/mcp-doctor.sh:362], and the scripts README advertises purity as the norm for `sk-skill-check.cjs` — "`--json` prints either report and nothing else" [SOURCE: .skilled/commands/doctor/scripts/README.markdown:94].

Measured: parsing the entire stdout of the two trailer scripts fails while both exit 0 — `NOT_PURE: Unexpected non-whitespace character after JSON at position 8459` and `position 1920`. `_routes.yaml` hands the agent only `--json` for both routes [SOURCE: .skilled/commands/doctor/_routes.yaml:280], so nothing at dispatch time tells it which stream shape it will get; the only record of the difference is each script's own help text. A shared `--json` promise (either "pure" or "JSON then STATUS") belongs in the scripts README's convention section, not in ten separate help blocks.

Verify: `node .skilled/commands/doctor/scripts/git-standards.cjs status --json >/tmp/x; node -e "JSON.parse(require('fs').readFileSync('/tmp/x','utf8'))"` → throws at position 1920.

### F22-02 — MCP Doctor claims a Node 24 requirement while its gate enforces 20.11.0

**Type** drift · **Severity** P2 · **Release** v4.0.0.0 or earlier (last touched 2026-11-07, inside the v4.0.1.0–v4.0.2.0 window) · **Confidence** high.

The threshold check is `node_version_at_least "20.11.0"` [SOURCE: .skilled/commands/doctor/scripts/mcp-doctor.sh:101] with matching failure text "below required >=20.11.0" [SOURCE: .skilled/commands/doctor/scripts/mcp-doctor.sh:105]. The not-found branch says something else entirely: "Node.js not found — Code Mode requires Node 24" [SOURCE: .skilled/commands/doctor/scripts/mcp-doctor.sh:109]. An operator on Node 20.11 through 23.x passes the doctor's gate while the same report's sibling message says those versions are unsupported; an operator with no Node is told to install 24, one major line beyond what any check enforces. This host measures `{"status": "PASS", "check": "node", "detail": "v26.8.2"}`, so the gate is live and the disagreement is in the text.

Verify: `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json | grep -n '"check": "node"'` plus `grep -n "requires Node 24" .skilled/commands/doctor/scripts/mcp-doctor.sh`.

### F22-03 — This repository's own MCP Doctor exit is 1, and the cause is one optional provider credential

**Type** drift · **Severity** P2 · **Release** v4.0.0.0 or earlier · **Confidence** high, measured.

`mcp-doctor.sh --json` exits **1** here with `pass 18 / warn 1 / fail 0`; the single warning is `code_mode/utcp_credentials: ... webflow_WEBFLOW_TOKEN=missing`. The header's own mapping ("1 Warnings only (MCP likely works)") is honest, and `record_warn`/`record_fail` are separate counters feeding `EXIT_CODE` [SOURCE: .skilled/commands/doctor/scripts/mcp-doctor-lib.sh:48,49]. The trap is the shape of any consumer: `/doctor:setup`'s legs read "Exit 0 passes. Any other exit fails" [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:53], and `doctor-mcp-install.yaml:64` is the only place that spells out 0/1/2/3. No `/doctor:setup` leg runs MCP Doctor today, so the collision is latent, not live — but the invariant that keeps it latent is undocumented: MCP health must never become a setup leg, or every repo missing one optional provider token fails `/doctor:setup`.

Verify: `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json; echo "exit=$?"` → `exit=1` with the webflow row.

### F22-04 — Orphan Process Check reports success when it could not scan

**Type** drift (README vs code) · **Severity** P2 · **Release** v4.0.0.0 or earlier · **Confidence** high, code-read.

The README's exit contract is "0 on a printed report, 1 on an unexpected error and 2 on a bad argument" [SOURCE: .skilled/commands/doctor/scripts/README.markdown:126]. Both scan-failure branches return **0**: uid unavailable writes `orphan check could not run: current uid is unavailable` and returns 0 [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:559], and a throwing `ps` writes `orphan check could not run: ...` and returns 0 [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:567]. So exit 1 can only come from a thrown error outside `main`, never from "could not run". The route treats the check as informational [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:59], which caps severity, but the one case a reader consulting the README cares about — did the scan actually run — is the case the README gets wrong, and `/doctor:setup` will print `orphans: none`-shaped silence from a broken `ps`.

Verify: `grep -n "could not run" -A1 .skilled/commands/doctor/scripts/orphan-process-check.cjs` → lines 559/560 and 567/568 both `return 0`.

### F22-05 — The orphan line tells the operator to "list" processes with the reaping flag

**Type** UX · **Severity** P2 · **Release** v4.0.0.0 or earlier · **Confidence** high.

The summary line the setup route prints is built as `orphans: N, about M MB; list them with <command> --reap` [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:332], and the presentation template repeats the same instruction verbatim [SOURCE: .skilled/commands/doctor/assets/doctor-setup-presentation.txt:75]. `--reap` without `--yes` is a safe dry run — it prints the table and then a confirmation command [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:588] — but it is the flag whose confirmed form sends SIGTERM, and the word the operator is reading is "list". The presentation does add the guard one line below — use the confirmation command "with `--yes` only when those are the processes to stop" [SOURCE: .skilled/commands/doctor/assets/doctor-setup-presentation.txt:80] — so the destructive path is fenced only by a sentence beneath the instruction that invites it. Printing the bare command for listing, and `--reap --yes` only inside the confirmation line, removes the ambiguity at no cost.

Verify: `node .skilled/commands/doctor/scripts/orphan-process-check.cjs --summary` (prints the `--reap` hint when orphans exist) and read line 332.

### F22-06 — `/doctor:setup` collapses a nine-leg battery into one row and discards the failing leg

**Type** UX · **Severity** P2 · **Release** v4.0.0.0 or earlier · **Confidence** high, measured.

The umbrella leg is specified as `run sk-code-setup-check.cjs. Exit 0 passes. Any other exit fails, with repair /doctor:sk-code setup` [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:53]. The battery is not a single check: measured, it runs nine legs and prints nine verdicts, ending `STATUS=OK legs=9`. Its failure form collapses all nine into one line, `STATUS=FAIL failed=<n> skipped=<n>` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:409], and the per-leg `repair:` lines live only in the battery's own stdout, which the umbrella's one-row table does not carry. An operator whose setup fails therefore sees "sk-code failed" and must rerun the nine-leg battery with a different command to learn which leg and which repair line — the most common `/doctor:setup` failure path costs a second full run, including `node --test` on the quality suite.

Verify: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs | tail -3` → `STATUS=OK legs=9`; then read `doctor-setup.yaml:53`.

### F22-07 — `/doctor:setup`'s manifest under-lists the commands the route runs

**Type** drift (manifest vs asset) · **Severity** P2 · **Release** v4.0.0.0 or earlier · **Confidence** high.

The `/doctor:setup` block declares four `script_invocations` — sk-code setup, git setup, trigger-index and runtime-mirrors [SOURCE: .skilled/commands/doctor/_routes.yaml:360] — plus the advisor CLI call. The workflow asset runs two more commands that appear nowhere in the manifest: the session-relaunch history hop [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:58] and `orphan-process-check.cjs --summary` [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:59]. The operator-facing doc treats the orphan line as part of the output — "It shows an orphans line from `orphan-process-check.cjs --summary`" [SOURCE: .skilled/commands/doctor/setup.md:69] — so the omission is in the machine manifest alone. Anyone auditing `_routes.yaml` to answer "what does `/doctor:setup` execute, and which of it can write" gets a shorter list than the route actually runs; the two missing entries are the two non-leg commands, which is exactly the class a read-only audit would want to see.

Verify: `grep -c "orphan-process-check\|session-relaunch.cjs history" .skilled/commands/doctor/_routes.yaml` → 0.

### F22-08 — The phrase-reach probe calls itself report-only and then concedes a write inside the repo

**Type** misalignment (read-only claim) · **Severity** P2 · **Release** v4.0.0.0 or earlier · **Confidence** high, code-read; the write was not induced.

The header says "It is strictly REPORT-ONLY. It writes nothing in the repository" [SOURCE: .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:18] and twelve lines later says "The freshness check may also refresh its cached build record inside the ignored dist folder" [SOURCE: .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:21]. The route manifest copies the concession into the invocation comment [SOURCE: .skilled/commands/doctor/_routes.yaml:215]. The temp-database write is genuinely outside the tree (`mkdtempSync` under `os.tmpdir()`, removed on exit) [SOURCE: .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:196], so the only in-repo touch is the dist refresh — a gitignored path, but still a write a "report-only" route performs. This iteration declined to run the probe for that reason. Either the freshness check gets a non-refreshing call (the probe is a verdict, not a build), or `gate3_location` for `/doctor:skill-advisor router-reach` names the dist record so the write is declared where the route contract lives.

Verify: `grep -n "ignored dist folder" .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` and inspect `dist-freshness.cjs` for a refresh flag.

### F22-09 — The helper matcher's size knob is undiscoverable from `/doctor:helper`

**Type** improvement · **Severity** P2 · **Release** v4.0.0.0 or earlier · **Confidence** high.

`doctor-helper-match.cjs` accepts `--top=<1-5>` [SOURCE: .skilled/commands/doctor/scripts/doctor-helper-match.cjs:526], and it is a real flag (`options.top`, validated against `DEFAULTS.topMax`) [SOURCE: .skilled/commands/doctor/scripts/doctor-helper-match.cjs:561]. The route manifest advertises only `--json`, `--table` and `--areas` [SOURCE: .skilled/commands/doctor/_routes.yaml:456], the asset lists only `--json`, `--area` and `--intent`, and `helper.md` mentions `--json` alone. An operator who wants fewer than the default candidates has no documented way to ask; the flag exists and is validated, so the gap is documentation, not code.

Verify: `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --table --top=2` succeeds while `grep -rn "top=" .skilled/commands/doctor/helper.md` returns nothing.

## Questions Answered

None. The focus for this iteration was an assigned coverage direction (ten uncited scripts), not one of the strategy's key questions, so `answeredQuestions` is empty. F22-06 and F22-07 sharpen the Q9 territory ("which doctor checks, hooks, workflows or mirror files have no caller or duplicate another") by showing the opposite defect — commands the route runs that the manifest does not list — but neither closes it.

## Questions Remaining

- **Q1 (hooks half), dominant and unchanged since iteration 2.** `pre-push` without a `Commit-Id`, the 20 s `gate:git-timeout`, `Commit-Id: 0000000` alongside a valid id — all three still need a scratch repository with `skgit.contractDir`. Nothing in 22 iterations has closed it.
- **Q11 — command and skill *format* against sk-code / sk-doc canon.** Untouched for a sixth iteration.
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`).
- Devin's 16,384-byte rule cut against the concatenated repo-rules size.
- New from this iteration: does `dist-freshness.cjs` expose a non-refreshing mode, and if not, is the probe's dist write the only in-repo write among the "read-only" doctor routes? F22-08 found one; the other check-form routes (`skill-graph-freshness.cjs`, `agents-md-check.cjs`, `sk-skill-check.cjs`, `git-setup-check.cjs`) were only partially read for writes.
- New: which other doctor scripts emit a `--json` trailer (the grep counts 12 files containing `STATUS=`), and does any route asset instruct a JSON parse of the whole stream? F22-01 measured two; the family is larger.

## Next Focus

Iteration 23 should spend its budget on the one question that has survived every iteration: run the two suites already on disk — `bash .skilled/skills/sk-git/scripts/tests/validate-message-git-timeout.test.mjs` and `commit-id-naming.test.sh` — from a copy under `/tmp` with `skgit.contractDir` pointed inside `/tmp`. That answers the timeout and the missing-`Commit-Id` accept/reject behaviour without hand-building a repository and without touching the tree. If the suites cannot run there, the fallback is Q11 (command and skill format against sk-code / sk-doc canon), which needs no writes at all.

## SCOPE VIOLATIONS

None executed. One pre-existing residue is visible and was **not** created by this iteration: `git status --porcelain` at 23:25 shows `?? specs/001-test-feature/` (the leftover packet an earlier iteration created) and ` M specs/system-speckit/graph-metadata.json`, whose mtime is 2026-11-08 20:49 — before this iteration started — and whose only diff appends `system-speckit/047-v4-release-line-research` to the track list, i.e. the packet-creation step, not a doctor run. Deleting either is banned by this run's write rules, so both are reported rather than repaired.
