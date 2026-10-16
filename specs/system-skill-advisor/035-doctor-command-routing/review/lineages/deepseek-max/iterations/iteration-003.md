# Review Iteration 3, Skill Docs Standards Conformance

Mode: review | Dimension: maintainability (standards conformance) + traceability (playbook_capability, feature_catalog_code)
Iteration: 3 of 5 | Target: v4.0.0.12 release, skill docs group (steer.md scope group 3)

## Dimension

Standards conformance of the changed advisor docs against their sk-doc authoring contracts,
plus end-to-end capability traceability: the new playbook scenarios are executed as written to
prove they pass against the shipped runtime, and the catalog entry is checked against the code
it describes.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/` — DOC-385
  `doctor-routing-setup-onboarding.md`, DOC-386 `doctor-routing-env-prompt.md`, DOC-387
  `doctor-routing-contested-second-line.md`, DOC-388 `doctor-routing-python-typed-command.md`,
  DOC-389 `doctor-routing-setup-hint.md`, DOC-390 `doctor-routing-no-hint-unrelated.md`,
  DOC-391 `doctor-setup-run.md`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`
- `.skilled/skills/system-skill-advisor/hooks/pi/README.md` (unchanged; consistency read)
- `.skilled/skills/system-skill-advisor/README.md` (unchanged; consistency read)
- `.skilled/skills/system-skill-advisor/SKILL.md`
- `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` (read)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Confirmed-Clean Surfaces

- **Package validators pass.** `validate-playbook-package.cjs --package system-skill-advisor`
  exits 0, `scenarios=61 categories=10 violations=0` (one advisory warning, see Observations);
  `validate_catalog_package.py --package system-skill-advisor` exits 0, `PASS: 0 violations`
  (evidence: `evidence/iter-003-playbook-validator.txt`, `evidence/iter-003-catalog-validator.txt`).
- **Shared document validator passes on every changed doc.** `validate_document.py` exits 0 for
  the root playbook (`--type reference`), the catalog index, the three changed catalog leaves,
  `hooks/skill-advisor-hook.md`, the advisor `README.md` and `SKILL.md` (`--type skill`)
  (evidence: `evidence/iter-003-validate-document.txt`).
- **The new docs are Human Voice clean.** `hvr_scan.py` exits 0 with 0 hard blockers for all
  seven new playbook scenarios, `doctor-command-routing.md` and `opencode-plugin-bridge.md`
  (evidence: `evidence/iter-003-hvr-scan.txt`).
- **New scenarios are registered and counted coherently.** The root playbook lists DOC-385..391
  and the count moved 54 -> 61 in all three places the inventory test asserts (prose, row count,
  file count) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts:45-55].
  The directory holds 61 scenario files, matching the validator's `scenarios=61`.
- **DOC-385, DOC-386, DOC-387, DOC-388, DOC-389, DOC-390 pass as written against the shipped build.**
  Ran every scenario's hook/recommend/scorer commands exactly as its Commands section writes them:
  `Help me set up skilled` -> `Advisor: live; use /doctor:setup 0.90/0.12 pass.` with
  `command-doctor-setup` first in the recommend JSON; `check my environment variables` ->
  `/doctor:env list 0.90/0.16 pass.` with `command-doctor-env` first; `check my git hooks setup`
  -> `use sk-git 0.82/0.20 pass.` + `Also: /doctor:git setup` with sk-git at index 0 and the
  doctor bridge at index 1 despite its higher confidence; `/doctor:git setup` -> forced-local
  first element `command-doctor-git-setup`; `install the frobnicator widget` -> no-match line
  with the hint and exactly three lines; the photosynthesis prompt -> exact no-match line with
  `/doctor:` appearing nowhere (evidence: `evidence/iter-003-doc385-387-run.txt`,
  `evidence/iter-003-doc386-run.txt`, `evidence/iter-003-doc388-run.txt`,
  `evidence/iter-003-doc389-390-run.txt`).
- **DOC-391's five legs behave as the scenario records** (sk-code battery exit 0,
  `STATUS=OK legs=8`; git battery exit 3 `STATUS=DEGRADED` under this shell; trigger-index
  exit 1 stale documents; runtime-mirror check exit 0; advisor status exit 0 live) — see
  iteration 2 for the leg evidence and the P2 raised there.
- **Catalog entry matches the code it describes.** `doctor-command-routing.md`'s bridge
  generation, ranking, brief text and reach-probe sections each name the shipped mechanism and
  real paths (verified against `derive-command-bridges.cjs`, `fusion.ts` anchor/order rules,
  `render.ts` lookup and `doctor-phrase-reach.cjs`); the index moves 43 -> 44 features and
  scorer-fusion 6 -> 7 with the new row
  [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:20,29,99].
- **The hook doc describes the shipped hint behavior exactly.** `skill-advisor-hook.md` step 5
  names the no-match and outage placement "before the outage command so the command stays last"
  [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39], which matches
  `render.ts` and the executed DOC-389/390 outputs.

## Traceability Checks

- `playbook_capability`: pass. Six of the seven new scenarios were executed end-to-end and
  matched their Exact expected signals; DOC-391's legs were executed separately (iteration 2).
- `feature_catalog_code`: pass. The new leaf's implementation table resolves to real files, the
  activation story matches `scoring-compatibility.json`, and the index counts match the
  directory content.
- `checklist_evidence`: partial. `tasks.md` evidence rows are read in the changelog iteration.
- `spec_code`: unchanged from iterations 1-2 (REQ-016's playbook/catalog/README claims are the
  part exercised here and hold).

## Edge Cases / Observations

- **Advisory, pre-existing: root playbook lacks the result-persistence marker.**
  `validate-playbook-package.cjs` warns `RESULT_PERSISTENCE_MARKER_MISSING` for
  `manual-testing-playbook.md`; the marker is advisory (exit 0, violations=0) and 7 of the 14
  root playbooks in the fleet carry it. The release updated the root playbook without adding it.
  Recorded as package-level debt, not a release finding.
- **Pre-existing HVR debt unchanged by the release.** `hvr_scan.py` reports hard blockers on
  `skill-advisor-hook.md` (28), `SKILL.md` (30), `manual-testing-playbook.md` (9) and
  `claude-hook.md` (2 rows, em dashes on a pre-existing table line). Counting hard-blocker rows
  against the pre-release blobs (`git show 1996cf02a6~1:<path>`) gives identical counts, so the
  release introduced none; the changed paragraphs and every new artifact are clean.

## Ruled Out

- **"A new scenario is unrunnable or mis-specified."** Ruled out by executing six of the seven
  scenarios exactly as written; every expected line matched and every command exited 0.
- **"The playbook inventory test and the docs disagree on the scenario count."** Ruled out:
  directory content, validator output and the test's three assertions all agree on 61.
- **"The catalog leaf describes behavior the code does not have."** Ruled out: each mechanism
  claim maps to a verified site from iterations 1-2 (deriver inventory source, anchor rule,
  skill-first order, runnable lookup, reach probe).

## Next Dimension

Iteration 4: cross-repo references and the root README. Scope group 4 of steer.md: root `README.md`
(the doctor command list and the `/doctor:setup` entry), `.skilled/commands/README.txt`,
`.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`, and the
system-spec-kit `SKILL.md` where it names doctor commands. Dimension: traceability (every cited
path/command exists and runs) + maintainability (repo authoring standards).

Review verdict: PASS
