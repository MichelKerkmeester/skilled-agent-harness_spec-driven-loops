# Review Iteration 003

**Run:** 2026-11-20T10:07:53.884Z · **Generation:** 3 · **Lineage mode:** restart · **Iteration:** 3 of 5

## Dispatcher

`/deep:review` → `@deep-review` (LEAF, single iteration). Mode `review`, target agent `deep-review`, route `Resolved route: mode=review target_agent=deep-review`.

## Dimension

**Traceability** — plus the operator review focus: v1-removal closure evidence as merged to main (merge `06d02096e90` vs its first parent `f2f03c90fb6`, parent fix `b18b80291d2`), with the `skilled-loop` justified-list gap from `f6aa8dc052b` confirmed and not re-reported.

Covered this iteration: every acceptance-criteria row in the three phase folders against its cited evidence, every `tasks.md [x]` item against its Verify line that the closure evidence names, the 003 ADR-001 replacement checks run live, the parent spec continuity, and the two overlay protocols (feature catalog and manual testing playbook) against the code.

## Files Reviewed

- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md:52-62`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md:39,70-73,83,114-116,124-127,135-138,146-148,156-167`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/implementation-summary.md:111-112,164-167,180-184`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/spec.md:151`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt:1,6,9-20,22-23`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md:54-61`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/implementation-summary.md:13,89`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:1-90`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:2,10`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live.txt:47`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/decision-record.md:44`
- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md:9-21`
- `.skilled/skills/cli-external-orchestration/feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md:16,18,28,42`
- `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md:52`
- `.github/workflows/opencode-v2-battery.yml` (AC-001/002/003 proof commands)
- `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` (AC-001 proof command)
- `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`, `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` (AC-002 proof command)
- `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`, `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/` (AC-003/AC-005 proof commands)
- `.opencode/package.json`, `.skilled/package.json`, `opencode.json` (AC-004/AC-006 proof commands)
- `.opencode/plugins/*.js` (AC-007 replacement checks)
- merge diff file list `git diff --name-only 06d02096e90^1 06d02096e90`

## Findings - New

### P0 Findings

None. No active P0.

### P1 Findings

None. No active P1.

### P2 Findings

1. **The event-capture evidence file contradicts itself on whether a live session was ever run** -- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt:1` -- The file opens with "Event capture for OpenCode 2.3.2 (static, no live session was launched)", yet the same file records a live run at `scratch/event-capture.txt:22` ("== live capture on OpenCode 2.3.2, 2026-11-19") with its method at `:23` (a temporary logger plugin, exit=0, requests=2). The two consumer docs disagree in the same way: `implementation-summary.md:164` describes "The live capture exercised one plain session. It saw 31 event types", while `implementation-summary.md:180` says "**T004:** the capture is static (Known Limitation 1)", and `tasks.md:39` carries both a "Closure note: not met ... the evidence is a static scan" and a "Done live on 2026-11-19" sentence. A reader of the header alone would conclude the live evidence does not exist, which is the opposite of what the closure rests on.
   Finding class: documentation-residue / stale-evidence-header
   Scope proof: Five lines in three packet files describe one artifact; every claim is quoted from the file itself, and no code, CI or test surface is implicated.
   Affected surface hints: 001 closure evidence chain (T004, T017, CHK-003, CHK-023), implementation-summary Known Limitations 1 and the deviations list, any future audit that reads the header first.
   Case: An auditor opens `scratch/event-capture.txt` to check T017's "each removed branch is recorded as not seen" and stops at line 1, concluding no live capture was ever performed and re-opening the five deleted plugin event branches; the live section 21 lines below would have answered the question.

2. **CHK-041's recorded "prints 0" is not reproducible from the command as written** -- `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md:157` -- The check reads "Changed code carries no phase, packet or REQ id in a comment. Verify: `rg -n -e '070-' -e 'REQ-0' <changed files> | wc -l` prints 0". Run over the merged file list (`git diff --name-only 06d02096e90^1 06d02096e90 -- .skilled .opencode .vibe .github`) the command returns 125 hits, so the recorded result cannot be reproduced from the command text. The residual is not a real hygiene breach: 116 of the hits are retrieval fixture and trigger-index data files where a spec path is payload rather than a comment, 3 are playbook and changelog prose, and the two code-side hits are vitest case titles at `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:675,679` naming `(REQ-001)`/`(REQ-002)`, which are test names and not comments. The check as written has no file-scope or comment-only narrowing, so a reader cannot tell which population it was meant to prove clean.
   Finding class: verification-reproducibility / under-specified proof command
   Scope proof: The gap is confined to one `tasks.md` Verify line and the population it names; the underlying comment-hygiene rule holds for the changed code, which carries no packet or requirement id in a comment.
   Affected surface hints: 001 CHK-041 closure claim, the comment-hygiene pre-commit gate, any later rerun of the phase-001 checklist.
   Case: A maintainer reruns the CHK-041 command verbatim during a later audit, sees 125 instead of 0, and either raises a false comment-hygiene incident or silently stops trusting the checklist's numbers.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | Feature-catalog claims reproduce against the resolver and rule engine: `SUPPORTED_FAMILIES = Object.freeze(['v2'])` is one line at `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs`, and the catalog's "major 1 is `unsupported` ... the rule engine applies every rule to it" (`opencode-version-dispatch.md:42`) matches the rule engine read in iterations 1-2. Playbook claim that the plugin-disable flag is absent from `run --help` (`cli-invocation/pure-and-print-logs.md:52`) matches the `--pure` removal proven by 001 AC-009. |
| `checklist_evidence` | core | pass | Every AC row in all three phases reproduces: 001 AC-001 (1 line), AC-002 (0), AC-005 (0), AC-007 (0 production, 0 widened), AC-008; 002 AC-001 (0), AC-002 (0), AC-003 (0 for 2.3.0, one 2.3.2 hit in each file), AC-004 (0), AC-006 (2 `variant` keys as recorded), AC-008 (CI run 44632438229 `conclusion: success`, `headSha: 06d02096e90`, name `OpenCode v2 Battery`); 003 AC-002, AC-006, AC-008 replacement commands all return 0 / exit 0; 003 AC-007's sweep equals the 32-line justified list; 003 AC-011's "15 of 16 checkers" matches `scratch/live.txt:47`; T017's 5 not-seen matches hold. |
| `feature_catalog_code` | overlay | pass | `feature-catalog/opencode-version-dispatch/opencode-dispatch.md` version rule, refusal behaviour and hook-side parity statement match the code surfaces; `feature-catalog/cli-dispatch-authorization` rules match `hard-rules.json` (v2-only `appliesTo`). |
| `playbook_capability` | overlay | pass | The cli-opencode manual testing playbook describes only capabilities the merged code supports: no `<v1|v2>` runner argument remains, the version argument form is gone, and CO-005 asserts the plugin-disable flag is absent rather than claiming it works. |

Justified-list fix from `f6aa8dc052b` confirmed: `scratch/justified.txt:2` (`.skilled/bin/skilled-loop`, refusal code) and `:10` (the wrapper model-effort test) are present, and the live repo-wide sweep returns the same 32 paths. Not re-reported.

## Integration Evidence

- Workflow `.github/workflows/opencode-v2-battery.yml` and CI run `44632438229` — checked via `gh run view`, which reports the run on merge commit `06d02096e90` on main as `success` under the workflow name `OpenCode v2 Battery`. This is the surface 002 AC-008 names.
- Merge commit `06d02096e90` with first parent `f2f03c90fb6` and second parent `e8068aec7c`; parent fix `b18b80291d2` (`docs(specs): mark the OpenCode v1 removal parent complete`) resolves. The dispatch's named closure commit `a2c927a8a3` does not resolve in this repository and no packet document cites it (see Edge Cases).
- Parent continuity `spec.md:13` (`recent_action: "All three phases complete; merged into main and the OpenCode v2 Battery passed (run 44632438229)"`, `completion_pct: 100`) agrees with the verified CI run and the three phase statuses, all `Complete` at `002-v1-ci-and-package-pins/implementation-summary.md:51` and the equivalent 001/003 rows.

## Edge Cases

1. **Dispatch-named commit `a2c927a8a3` is unresolvable.** `git rev-parse --disambiguate=a2c927a8a3` returns nothing and `git rev-parse a2c927a8a3` fails, so the "closure" commit named in the iteration dispatch cannot be diffed. No packet document cites it (the packet cites `06d02096e90` only), so no packet claim is left unverified by this: the closure claims were verified against `06d02096e90`, `b18b80291d2` and the live tree. Recorded as a dispatch-context discrepancy rather than a finding.
2. **`justified.txt` paths are repo-relative, the live sweep prints a `./` prefix.** The set comparison is exact after that prefix difference: 32 sweeps, 32 justified entries, no path unique to either side. Recorded because a naive `diff` reads as 32 changed lines and could be mistaken for a mismatch.
3. **CHK-013's closure was earned by amending the Files-to-Change table.** `spec.md:151` carries an explicit "Added after scope freeze" row for the 33 files in `scratch/files-outside-table.txt`, and `implementation-summary.md:167` records it as Known Limitation 4. The amendment is labelled and traceable, so the `Met` claim is supported rather than a silent table edit.
4. **ADR-002 waivers are honest.** 001 `decision-record.md:67` waives the CHK-003 ordering check and `implementation-summary.md:166` repeats it as Known Limitation 3; the capture-ordering gap is disclosed at `tasks.md:116` rather than papered over.

## Confirmed-Clean Surfaces

- 003 ADR-001's replacement checks (AC-002, AC-006, AC-008) all pass when run today from the repository root, not just as recorded on 2026-11-19.
- The repo-wide v1 sweep matches the justified list exactly, including both `skilled-loop` entries added by `f6aa8dc052b`.
- 002 AC-008's CI evidence is real: the run exists, is green, and points at the merge commit the packet names.
- Every other phase-001 and phase-002 zero-match proof command returns the recorded count.
- Parent continuity, phase statuses and the merge commit agree with one another; no packet document claims a state the others deny.

## Ruled Out

- **"The live event capture never happened, so T017's branch removals rest on nothing."** Ruled out: `scratch/event-capture.txt:22-23` records the live run, its plugin, exit code and request count, and the static section is a separate half of the same file. The residual defect is the stale header line, filed as DR3-P2-001.
- **"Changed code violates the comment-hygiene rule."** Ruled out for code comments: the 125 CHK-041 hits are retrieval data files, playbook or changelog prose, and two vitest case titles; no changed code comment carries a packet or requirement id. The residual defect is the unreproducible proof command, filed as DR3-P2-002.
- **"003 AC-001's cli-opencode file list diverges from the justified list."** Ruled out: the 11 cli-opencode files in the sweep are all present in `scratch/justified.txt`.
- **"The parent claims completion before the phases do."** Ruled out: the parent continuity names the same merge and CI run the phases name, and all three phases read `Complete`.

## Next Focus

- Dimension: maintainability.
- Focus area: the documentation residue class this iteration found, then the merged code's pattern compliance — the `remove-v1` mode's comment and structure hygiene in `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh`, the duplicated version rule between `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` and `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` and the parity test that binds them, and whether the fixture and trigger-index churn from this merge is generated or hand-edited.
- Reason: traceability closed with two P2 documentation defects and no code defect; maintainability is the last uncovered dimension and is where the duplicated-rule cost and the hand-edited-generated-file question belong.
- Rotation status: correctness, security and traceability reviewed; maintainability remains.
- Blocked/productive carry-forward: reuse the productive category "read the producer and its consumer together" for the duplicated resolver pair.
- Required evidence: file:line for the duplicated rule on both sides, and the parity test case that would fail if one side drifted.
- Recovery note: not applicable.

Review verdict: PASS
