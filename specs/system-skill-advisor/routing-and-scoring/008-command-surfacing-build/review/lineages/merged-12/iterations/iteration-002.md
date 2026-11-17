# Review Iteration 002 — merged-12

**Lineage:** `merged-12` (detached fan-out, review pass twelve, area `merged`)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12`
**Session:** `fanout-merged-12-1794856957949-n58dw7`
**Diff under review:** `git -c core.fsmonitor=false diff 2f3f893c153 05475f9d044`; whole files at `05475f9d044`.

## Dispatcher

- **Operator review focus (bound):** review pass twelve, area `merged`, per `review/review-brief-12.txt`. This iteration read the same three obligations through the security dimension: whether any merged sk-doc text widens a write authority or drops a guard, and whether the changed doctor test opens an operator- or environment-controlled path. It also re-ran the two mechanical router checks the packet names (REQ-005).
- **Dimension this iteration:** security.
- **Dimensions planned:** correctness, security, traceability, maintainability.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/sk-doc/ROUTER.md` | security |
| `.skilled/skills/sk-doc/SKILL.md` | security |
| `.skilled/skills/sk-doc/graph-metadata.json` | security |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | security |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-005's mechanical pair passes: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exits 0 with "SIGNAL DRIFT compiled vs disk: none" and "(report-only ... nothing was written)", and `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check --hub sk-doc --json` reports `added=0, orphans=0`. REQ-006 stays partial for the same workflow-leg reason recorded in iteration 1. |
| `checklist_evidence` | notApplicable | No checklist row governs a security property of these four files. |

## Integration Evidence

- `.skilled/skills/sk-doc/SKILL.md:4` — `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]` is identical to `origin/main`; the merge changed no authority grant.
- `.skilled/skills/sk-doc/ROUTER.md` — every hunk versus `640cd0a2499` is prose tightening, a keyword removal, or the command rename; none adds an instruction to write, execute, or fetch.
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:17-25` — all paths are `__dirname`-relative constants (`DOCTOR`, `ASSETS`, `CONTRACT_ASSETS`); the test reads local files and parses YAML in-process, with no `child_process`, no network call, and no environment-controlled path.

## Edge Cases

- **Instruction surface of a router.** `ROUTER.md` is read as instructions by a model, so a merge can widen authority without changing code. Checked by diffing the whole file against main: no such hunk exists.
- **YAML parsing in the test.** `parseYaml` reads repository-owned assets only, so the parse is not a trust boundary; a malformed asset fails the suite rather than executing anything.
- **Report-only tooling.** `skill-graph-freshness.cjs --strict` states it writes nothing; its exit 0 is used only as evidence for REQ-005, not as a mutation.

## Confirmed-Clean Surfaces

- **No authority widening.** The merged sk-doc files grant the same tools as main; the only control-flow change is the command name a keyword points at.
- **No secret or absolute-path exposure.** `graph-metadata.json` carries intent phrases and skill metadata only; no token, path, or environment value was added by the merge.
- **No write path in the test.** The doctor contract test performs reads and in-memory assertions only; the `_routes.yaml` and `symlink-manifest.json` reads are fixed local paths.
- **No hidden instruction in the reviewed text.** The files contain routing prose, not operational directives that would let a reviewed artifact redirect the reviewer.

## Ruled Out

- **The narrowing removes a security guard.** The removed phrases are README intent keywords (`security policy`, the `git-*` hook README names, `hook mirror readme`); the `SECURITY_POLICY` intent still fires on `security.md` and its template stays mapped at `ROUTER.md:298-300`.
- **A test-side path injection.** No reviewed test input is caller-supplied; all reads resolve under `__dirname`.
- **A shell surface added by the test diff.** The changed hunk adds one `assert.doesNotMatch`, with no spawn or eval.

## Next Focus

- Dimension: traceability.
- Focus area: map each merged file's observable content to REQ-005 and REQ-006 of packet `039`, and check the doctor test's checklist evidence against the merged workflow and presentation. Carry the iteration 1 P2 only if a new input shows it is wider.
- Reason: rotation to the third dimension; security produced no new finding.
- Required evidence: spec path:line, test path:line, and the two tool exit statuses already captured.

Review verdict: PASS
