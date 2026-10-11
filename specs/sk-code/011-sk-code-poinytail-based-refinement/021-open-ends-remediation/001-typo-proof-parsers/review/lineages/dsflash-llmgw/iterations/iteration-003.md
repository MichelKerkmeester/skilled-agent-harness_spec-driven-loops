# Review Iteration 003

- Run: fanout-dsflash-llmgw-1791754059549-b7vcvs
- Packet: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/review/lineages/dsflash-llmgw
- Executor: cli-pi model=deepseek-v4.1-flash (detached fan-out lineage; iteration executed inline by the lineage process)
- Agent: @deep-review LEAF contract
- Started: 2026-10-11T21:40:00Z

## Dimension

D3 Traceability — spec ledger vs implementation-summary evidence, Tests-table truthfulness, version bumps and changelog entries, mirror/carrier consistency, and the goal completion criteria.

## Files Reviewed

- `steer.md` (lineage steering channel; read before this iteration, rulings applied)
- `specs/…/001-typo-proof-parsers/spec.md` (ledger tables F1-F64, U1-U4; pass-through exceptions)
- `specs/…/001-typo-proof-parsers/implementation-summary.md` (Recommendation Ledger, Tests table, Shared Helper Decision, Key Decisions, Verification, Known Limitations)
- `specs/…/001-typo-proof-parsers/goal.md` (completion criteria)
- All ten test files named in the Tests table (case counts and assertions)
- The seven `SKILL.md` version bumps, seven `changelog/*.md`, `description.json` / `hub-router.json` / `mode-registry.json` carriers, `.hermes` mirrors
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json`, `.skilled/commands/deep/assets/compiled/*.contract.md`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Known Limitations misnames the rejected option in the catalog regression** -- `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers/implementation-summary.md:224`
   - Case: an operator acting on the disclosure reads "The script never read `--skills-dir`, and it now exits 2 on it" and changes or removes `--skills-dir` from the catalog line, which is the accepted-and-working flag; the actual rejection is `--check`.
   - Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills` -> `checked=14 passed=14 failed=0`, exit 0, so `--skills-dir` is read; the catalog pair `--skills-dir .skilled/skills --check` -> `unknown option: --check`, exit 2. The parser reads `--skills-dir` at `[SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:81]` and rejects `--check` at `[SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:89-97]`. The same inaccuracy makes the "How It Was Delivered" sentence ("every caller found passes only known options", `[SOURCE: specs/…/implementation-summary.md:178]`) contradict Known Limitation 1 within one document.
   - Finding class: instance-only
   - Scope proof: `rg -n "skills-dir" .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` shows the flag is parsed and assigned to `args.skillsDir`; the only rejected token in the documented command is `--check`. The misstatement is confined to the two prose locations named above.
   - Affected surface hints: ["implementation-summary.md Known Limitations", "implementation-summary.md How It Was Delivered", "mcp-tooling feature-catalog.md:69"]
   - Recommendation: correct the sentence to "the script never read `--check`; it now exits 2 on it, and the catalog line should drop `--check`" and align the delivery sentence to "every caller found passes only known options; the one documented catalog command with a stale `--check` is listed in Known Limitations".

## Traceability Checks

- **Ledger completeness (SC-001)** — verified by the goal's own commands, run from the repository root: `grep -cE '^\| (F[0-9]+|U[1-4]) \| (Fixed|Closed) \|' implementation-summary.md` printed `68`; Fixed rows without a backticked proof printed `0`; Closed rows without `prevent-overengineering|operator decision` printed `0`. The Tests-table command printed `ok`. All 68 rows (64 F + 4 U) are accounted for.
- **Version bumps + changelogs (REQ-005)** — verified with the goal's loop against `B=0039903bde`: each of the seven touched skills (sk-code, sk-design, sk-doc, sk-git, system-deep-loop, system-skill-advisor, system-spec-kit) has exactly one new `changelog/*.md` (changelogNew=1) and one `+version:` line in `SKILL.md` (versionAdded=1). All seven new changelog files exist with a matching `version:` field; `.skilled` and `.hermes` SKILL.md versions match 1:1; `description.json` / `hub-router.json` / `mode-registry.json` carriers match the new version (spot-checked system-deep-loop 1.6.2.0).
- **Tests table** — case counts verified against the files: T1=10, T2=9, T3=3, T4=3, T5=15, T6=14, T7=8, T8=32, matching the table. T1 was executed live with `TMPDIR` contained inside this lineage: 10/10 pass, exit 0. The "before: exit 1" column is builder attestation that cannot be re-run after the fix; the shipped assertions pin fix-dependent error text (for example `expectInputRefusal` requires the refused flag name in the JSON error), so a revert would fail the tests. Recorded as verified-by-reading, not independently re-executed for T2-T10 (running the remaining suites would write outside this lineage).
- **Compiled carriers** — the four activation manifests changed exactly one field each (re-minted `effectivePolicyHash`), and the three deep compiled contracts carry the new `mode-registry.json` / `SKILL.md` hashes, so the bump propagated to the derived carriers.
- **Trigger index** — all seven new changelog versions (`v2.2.12.0`, `v2.0.2.0`, `v2.3.5.0`, `v1.8.5.0`, `v1.6.2.0`, `v0.15.4.0`, `v2.7.11.0`) appear in the regenerated `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`.
- **`spec_code` core protocol** — REQ-003 (ledger format) and REQ-005/REQ-006 acceptance verified above; REQ-001/REQ-002 carry the two earlier P2 deviations (I1-P2-001, I1-P2-002).
- **`checklist_evidence`** — notApplicable (Level 1 packet, no `checklist.md`).
- **Overlay protocols** — `skill_agent` / `agent_cross_runtime`: the seven skills' canonical `.skilled` definitions and `.hermes` mirrors agree; `feature_catalog_code`: the one feature-catalog drift is I1-P2-002; `playbook_capability`: no playbook claims were changed by this build.

## Edge Cases

- The four U rows' throwaway reproductions (`r1-u1-repo`, `r1-u2-repo`, `r1-u3bin`, `r1-u4-copy`) are not retained in the packet scratch dir (only `.gitkeep`); REQ-006's acceptance is the ledger line naming the path and printed output, which is present. The pre-fix evidence itself is builder attestation.
- Known Limitation 2 is accurate: `sk-doc/scripts/validate-flowchart.sh` is absent at the base commit (`git show 0039903bde:…` exits 128) and `playwright`/`culori` are declared in the backend `package.json` but not installed in this checkout.
- The spec's F48 risk row asked for exit 2 for the new branch while the operator decision keeps 64; the ledger line records 64 as the script's existing usage code. Per the steer ruling, exit-code choices are operator decisions, not findings.
- `validate.sh --strict` (the fifth goal criterion) was not run: this lineage's containment rules forbid it. It remains with the runner/synthesis phase.

## Confirmed-Clean Surfaces

- 68/68 ledger rows present in the required `| <ID> | Fixed | <command> |` / `| <ID> | Closed | <reason> |` format.
- Version/changelog/mirror/carrier chain for all seven skills is consistent; compiled contracts and activation manifests re-minted against the new hashes.
- Trigger index regenerated with every new changelog entry indexed.
- Tests table case counts truthful; T1 executed green in this session.

## Ruled Out

- "Ledger rows missing or misformatted": all four goal grep commands pass with the exact expected outputs.
- "Changelog/version mismatch or mirror drift": every pair checked agrees; no skill bumped twice; no touched skill without a changelog.
- "Stale derived carriers": activation manifests and compiled contracts consume the new hashes.
- "Tests claim more than they assert": counts and assertion style verified by reading; T1 run confirmed.

## Next Focus

D4 Maintainability: helper placement and duplication (`assertKnownFlags`, `reject-unknown-options.mjs`, the inline `findUnknownOption` copies), comment hygiene in the added lines, usage-message accuracy, and the module-scope guard observation carried from iteration 2.

## Status

complete

Review verdict: PASS
