# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `pi-1`, generation 1)
- Dimension: maintainability
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration tested the drift corrections phase 015 claims: the benchmark and playbook indexes, the `leaf-scopes.json` description, the Aside capability row, and the replay counts its release note states.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/README.md:1-75`
- `.skilled/skills/mcp-browser-use/SKILL.md:1-110`
- `.skilled/skills/mcp-browser-use/changelog/` (file set), `changelog/v1.1.3.0.md`
- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md:20-40`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv` (header, row count, verdict column)
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:55-70`
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1-12`
- `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:60-115`
- `.skilled/skills/mcp-aside-devtools/SKILL.md`, `.skilled/skills/mcp-chrome-devtools/SKILL.md`, `.skilled/skills/mcp-bladebro/SKILL.md` (version lines)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hub README states the one-file-per-release rule and then breaks it in its own table** -- `.skilled/skills/mcp-browser-use/README.md:70` -- The README declares `version: 1.1.4.0` at `:8` and states at `:66` that "Releases live in `changelog/` with one file per release, named `v[version].md`". Its release table at `:69-72` then lists `1.1.1.0`, `1.1.0.0` and `1.0.0.0` only: `changelog/v1.1.2.0.md` and `changelog/v1.1.3.0.md` both exist on disk and neither is listed, and no `changelog/v1.1.4.0.md` exists for the version the file itself claims. Phase 015 declared the README *version* out of scope on the grounds that each doc carries its own version line, which is a different claim from the table and its rule.
Case: a reader who trusts `README.md:66` and looks for the 1.1.4.0 entry finds no file; a reader who trusts the table concludes the hub stopped at 1.1.1.0 although two later releases shipped and one of them (`v1.1.3.0`) is the release phase 015 created.
Finding class: `doc-contract-drift`
Scope proof: `ls changelog/` returns the five files; the README's version line, rule line and table are all read in the same file; `SKILL.md:5` sits at 1.1.3.0 while the README sits at 1.1.4.0, so the missing entry is not a lag of the same number.
Affected surface hints: `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/changelog/`, and the changelog-coverage check phase 007's criteria name.

## Traceability Checks

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Phase 015's drift corrections that this iteration checked hold: the Aside capability row now reads "Not offered: Aside 1.26.626.1517 rejects console and network event listeners" (`SKILL.md:40`), `rg page.on` over the hub `SKILL.md` exits 1, the `leaf-scopes.json` description matches the file's single Chrome entry (`SKILL.md:106` against `leaf-scopes.json:1-11`), and the contract at `skill-root-metadata-contract.md:90-94` confirms a one-entry scope file is legal rather than partial. The status stays `partial` for the carried iteration-3 fail. |
| `checklist_evidence` | core | pass | The replay count phase 015 states ("Replay 51 of 52 PASS", `015/goal.md:53`) matches the artifact: `results.csv` holds 52 data rows and the verdict column counts 51 `PASS` and 1 `FAIL`. The benchmark index row agrees ("51 PASS, 1 FAIL") and its folder link resolves. The playbook index names the newest replay folder, which exists. |
| `feature_catalog_code` | overlay | pass | Phase 005's catalog criterion holds: `feature-catalog.md:243` totals 31 and the lighthouse leaf exists under `mcp-parallel-instances/`, which is the same leaf `leaf-scopes.json` adds to the Chrome mode's routable set. |
| `playbook_capability` | overlay | partial | The playbook's result-persistence pointer (`manual-testing-playbook.md:62`) names the newest playbook run and the newest replay, both of which exist; the fourteen scenario-file count for Bladebro was not compared against the 15 the phase-007 criterion claims, so the count stays unverified. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md:24-28` lists five runs; every folder the table links exists on disk (checked by directory test on the two newest and by `find` for the rest), so no index row dangles.
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:62` and `benchmark/reports/README.md:24` agree on the newest replay folder name, `2026-11-24--two-stage-replay--compiled--follow-up`.
- `.skilled/skills/mcp-browser-use/SKILL.md:106` is the only description of `leaf-scopes.json` in the hub, and it names exactly the one entry the file carries, so the "per-mode" wording the archived review flagged is gone.

## Edge Cases

- **A one-entry `leaf-scopes.json` looks incomplete and is not.** The contract at `skill-root-metadata-contract.md:92` makes an unscoped mode take the default `references/` and `assets/` walk, so a single Chrome entry is the intended shape, not two missing modes.
- **The version-line mismatch is out of scope by an earlier decision.** `015/spec.md`'s out-of-scope row says a README version differing from `SKILL.md` is not drift because the commit hook bumps each doc's own line. This iteration treats that as settled and raises only the table and the missing file, which no earlier decision covers.
- **The verdict column, not the result column, carries the pass/fail truth.** Counting `PASS`/`FAIL` from the last column is what the claim states; counting the `stage1`/`stage2` columns would answer a different question, so it was not done.

## Confirmed-Clean Surfaces

- The Aside capability row no longer advertises `page.on(...)`; the hub `SKILL.md` has no occurrence of it.
- The replay artifact and both index surfaces agree on 52 rows, 51 PASS and 1 FAIL.
- Every benchmark index link resolves to a real folder, including the `--post-review` run that supersedes the earlier FAIL.
- All four mode packets carry a changelog whose version matches their own `SKILL.md` version line (Aside 1.1.13.0, Chrome 1.0.28.0, Bladebro 1.2.1.0).
- `leaf-scopes.json` is contract-legal and its description in `SKILL.md` is accurate.

## Ruled Out

- **The hub README version mismatch with `SKILL.md` is drift** -- ruled out by the phase 015 out-of-scope decision, cited above; the finding raised here is about the table and the missing file, not the number.
- **`leaf-scopes.json` omits two of three modes** -- ruled out by the contract's default-walk rule.
- **The benchmark index points at a run folder that does not exist** -- ruled out by a directory test on every linked path.
- **The 014 release note counts drifted from the artifact** -- ruled out: the replay artifact counts match what the index and the 015 log state.

## Next Focus

- Dimension: maintainability (second pass) then cross-reference consolidation
- Focus area: `ROUTER.md`'s stage-two maps against `hub-router.json`, and the mode packets' own README/ROUTER/index rows
- Reason: the hub-level docs are now verified; the per-mode doc sets have only been read where a specific fix touched them
- Rotation status: maintainability open
- Blocked/productive carry-forward: productive, index-against-artifact comparison
- Required evidence: each mode packet's ROUTER.md leaf map compared to its file tree

Review verdict: CONDITIONAL
