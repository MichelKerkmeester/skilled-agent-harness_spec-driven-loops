# Review Iteration 2, Command and Runtime Mirrors

Mode: review | Dimension: correctness + standards conformance (command contract) + traceability (mirror parity)
Iteration: 2 of 5 | Target: v4.0.0.12 release, command group (steer.md scope group 2)

## Dimension

Correctness and contract conformance of the new `/doctor:setup` command surface and the
`/doctor:skill-advisor` route changes: router/presentation/YAML split per the sk-doc
`sk-create-command` contract, route-manifest conformance, read-only invariants, the five
runtime mirrors, and the `advisor_status` workspace-root fix.

## Files Reviewed

- `.skilled/commands/doctor/setup.md`
- `.skilled/commands/doctor/assets/doctor-setup.yaml`
- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`
- `.skilled/commands/doctor/_routes.yaml` (`/doctor:setup`, `/doctor:skill-advisor` routes)
- `.skilled/commands/doctor/assets/doctor-router-reach.yaml`
- `.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml`
- `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` (advisor_status health command)
- `.claude/commands/doctor/setup.md` (symlink), `.cursor/commands/doctor-setup.md` (symlink),
  `.codex/prompts/doctor-setup.md`, `.pi/prompts/doctor-setup.md`, `.hermes/prompts/doctor-setup.md`
- `.skilled/skills/sk-doc/sk-create-command/references/router-presentation-split.md` (contract)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md`
  (DOC-391, read as the recorded acceptance for the umbrella leg semantics)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Umbrella sk-git leg reports a permanent FAIL on runtimes it cannot identify, and the named repair cannot clear it** -- .skilled/commands/doctor/assets/doctor-setup.yaml:53 -- Description: the `/doctor:setup` workflow runs `git-setup-check.cjs` bare, so the `ai-tool-hooks` leg returns UNKNOWN (no active tool detected) whenever the shell does not export `CLAUDECODE`, and the battery then exits 3 (DEGRADED). The umbrella maps every non-zero, non-75 exit to FAIL, so on OpenCode, Pi, Codex, Cursor and Devin, `/doctor:setup` reports the sk-git leg as FAIL with repair `/doctor:git setup`; the repair passes `--tool` and reports OK, but rerunning the umbrella still runs the leg bare and shows FAIL again.
   - Case: run `/doctor:setup` in an OpenCode or Pi session, then run the named repair `/doctor:git setup` and rerun `/doctor:setup`: the sk-git leg fails in every umbrella run even though all 11 git-setup checks pass when the tool is named.
   - File: .skilled/commands/doctor/assets/doctor-setup.yaml:53
   - Evidence: bare `node .skilled/commands/doctor/scripts/git-setup-check.cjs` prints `UNKNOWN ai-tool-hooks` and `STATUS=DEGRADED degraded=0 skipped=0 unknown=1`, exit 3 (evidence: `evidence/iter-002-git-battery.txt`); the same command with `CLAUDECODE=1` prints `STATUS=OK checks=11`, exit 0 (evidence: `evidence/iter-002-git-battery-claudecode.txt`). Detection is `process.env.CLAUDECODE ? 'claude' : null` [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:867-870] and the UNKNOWN row names `--tool` [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:931-936]. The documented exit contract is "3 (DEGRADED) when none failed but one was UNKNOWN" [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:27-28], while the umbrella leg reads "Exit 0 passes. Any other exit fails" [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:53]. The sibling route deliberately passes the tool: `git-setup-check.cjs  # the workflow adds --tool=<name> for the AI tool running it` [SOURCE: .skilled/commands/doctor/_routes.yaml:285].
   - User impact: the release's front-door diagnostic tells a healthy non-Claude install that a check fails, sends the operator to a repair that reports success, and repeats the failure on every rerun; the v2.8.0.0 changelog line "gives each a PASS, FAIL or SKIP" omits the DEGRADED state and so understates what the row shows.
   - Finding class: instance-only
   - Scope proof: `rg -n "git-setup-check" .skilled/commands/doctor` shows two callers, the umbrella YAML and the `/doctor:git setup` route plus its tests; only the umbrella runs it without `--tool`. The playbook already records the mapping as intentional ("any other exit is FAIL, including a sk-git exit 3", `doctor-setup-run.md:65`), so this is a design-wart advisory, not an undeclared defect.
   - Affected surface hints: ["umbrella leg command in doctor-setup.yaml", "presentation leg-result vocabulary", "v2.8.0.0 changelog wording", "DOC-391 expected-signals wording"]
   - riskScore: 3 (advisory only)
   - Recommendation: pass `--tool=<runtime>` from the umbrella leg the way the `/doctor:git setup` route does, or render a fourth UNKNOWN/SKIP result for exit 3 in the presentation contract so the umbrella status stops mislabelling an unidentified runtime as a failed check.

## Confirmed-Clean Surfaces

- **Router/presentation/YAML split conforms.** `setup.md` carries the router contract, owned-assets
  table, mode routing, execution targets and presentation boundary, with all display wording in
  `doctor-setup-presentation.txt`, matching `router-presentation-split.md` §2-3; the argument gate
  wording matches the presentation's section 1 and DOC-391's step 4 expectation.
- **Route manifest validates.** `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0,
  `OK: route-validate — 14 routes validated, 2 warnings` (the two flag-reuse warnings are
  informational) (evidence: `evidence/iter-001-route-validate.txt`).
- **Read-only invariant holds.** The five legs are the check-only forms; the advisor probe uses
  `--timeout-ms 500 --warm-only` [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:56],
  so no daemon can start, and the mutation-boundary invariant states the rule
  [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:23-28]. The trigger-index leg and
  mirror leg ran here and wrote nothing (the trigger-index check reports staleness only).
- **The `advisor_status` workspace-root fix is real and effective.** Bare
  `advisor_status --format json --warm-only` returns `"Invalid arguments for advisor_status:
  advisor_status.workspaceRoot is required", "exitCode": 64`; with `--workspace-root "$PWD"` it
  returns `status: ok`, `freshness: live` (evidence: `evidence/iter-002-advisor-status-check.txt`).
  All four call sites now pass the root: `.skilled/commands/doctor/_routes.yaml:90,113,300`,
  `doctor-skill-advisor-rebuild.yaml:77,105`, `doctor-skill-budget.yaml:38`,
  `doctor-setup.yaml:56`, matching the v4.0.0.12 changelog claim.
- **All five mirrors exist and verify.** `.claude/commands/doctor/setup.md` and
  `.cursor/commands/doctor-setup.md` are symlinks to `.skilled/commands/doctor/setup.md`;
  `.codex/prompts/doctor-setup.md`, `.pi/prompts/doctor-setup.md` and
  `.hermes/prompts/doctor-setup.md` are generated pointer files. Checkers: runtime-mirror sync
  `PASS: 185 mirrors across 8 trees are in sync`, codex/pi/hermes prompt sync `PASS: 37 prompts
  are in sync` each, and `command-catalog-mirror-check.cjs` `STATUS=OK ... 39/39 listed`
  (evidence: `evidence/iter-002-*.txt`).
- **Target table count agrees end to end.** The presentation renders 17 rows
  (a row-count of the presentation's section 2 gives 17), and the route manifest's 14
  routes (six `/doctor:skill-advisor` targets, three `/doctor:git`, `/doctor:setup` itself) plus
  `/doctor:update`, `/doctor:env` and `/doctor:mcp` account for exactly those rows.
- **The router-reach workflow wires the new doctor probe correctly.** Its phase 0 runs
  `doctor-phrase-reach.cjs` and its report phase requires the `STATUS=` line and every FAIL row,
  with exit codes 0/1/2 mapped as the script documents
  [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:95-99,109,123-124].
- **No TUI writes in the plugin surface.** `rg "console\.|process\.stdout|process\.stderr"
  .opencode/plugins/system-skill-advisor.js .opencode/plugins/lib/skill-advisor-render.js` returns
  nothing, satisfying sk-code-skilled §3 "Plugins never write to the TUI".
- **The sk-code setup battery the umbrella leg runs passes end to end.**
  `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` exits 0 with
  `STATUS=OK legs=8`, including the sk-code drift guards
  (evidence: `evidence/iter-002-sk-code-battery.txt`).

## Traceability Checks

- `spec_code`: pass for this group. REQ-007 (read-only single-route umbrella) and REQ-014
  (mirror sync, catalog) are evidenced by the route manifest, the YAML contract and the four
  passing sync/catalog checks.
- `agent_cross_runtime`: pass for the command mirror trees. The canonical command content
  reaches all five mirrors through the tree-appropriate mechanism (symlink or generated pointer),
  and every sync checker reports in-sync.
- `skill_agent`: the router `skill_agent: system-spec-kit` tag on `setup.md` matches the generated
  bridge owner (iteration 1) and the route validator's parity checks.
- `checklist_evidence` / `feature_catalog_code` / `playbook_capability`: pending, later iterations.

## Edge Cases / Observations

- The trigger-index leg fails on this checkout (exit 1, four stale documents under
  `specs/sk-git/033-git-setup-customization/006-release-conformance-review/`, plus four missing
  documents) — a repository state fact unrelated to v4.0.0.12; the umbrella leg correctly reports
  it and names `/doctor:speckit` (evidence: `evidence/iter-002-trigger-index-check.txt`). Not a
  finding against this release.
- The advisor leg reads live in this environment because a daemon is already running; the SKIP
  path (exit 75) cannot be exercised without stopping the daemon, which would be an out-of-scope
  mutation, so it is recorded as read-only code evidence rather than observed.

## Ruled Out

- **"Mirror drift after adding `/doctor:setup`."** Ruled out by four independent checks: 185
  mirrors in sync across 8 trees, 37 prompts in sync per codex/pi/hermes, and the catalog mirror
  check covering 39/39 commands.
- **"The umbrella writes to the tree."** Ruled out: every leg is a check-only invocation, and the
  sk-code battery, git battery, trigger-index check and mirror check were each run here without
  any file appearing in the working tree diff (the DOC-391 step-3 rule).
- **"The five-leg set drifts from the presentation."** Ruled out: the YAML steps, the router's
  workflow summary and the presentation's repair table all name the same five legs and the same
  five repair commands.

## Next Dimension

Iteration 3: skill docs standards conformance (sk-doc contracts). Scope group 3 of steer.md:
playbook scenarios DOC-385..DOC-391 and the playbook index, feature catalog leaves
(`scorer-fusion/doctor-command-routing.md`, `hooks-and-plugin/claude-hook.md`,
`hooks-and-plugin/opencode-plugin-bridge.md`, `feature-catalog/feature-catalog.md`),
`hooks/skill-advisor-hook.md`, `hooks/pi/README.md`, advisor `README.md` and `SKILL.md`.
Dimension: maintainability (standards conformance) + playbook_capability/feature_catalog_code
traceability, running the repository's own doc validators.

Review verdict: PASS
