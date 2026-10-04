---
title: "DOC-349 -- Doctor speckit retrieval healthy"
description: "Manual scenario validating that /doctor:speckit reports a fresh trigger index, a working lookup and working ripgrep recipes as OK, lists phrase-quality advisories without changing that status, and writes nothing to the repository artifacts."
version: 1.3.0.0
id: doctor-commands-doctor-speckit-retrieval-healthy
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-349 -- Doctor speckit retrieval healthy

## 1. OVERVIEW

This scenario validates `/doctor:speckit` against a freshly generated trigger index. It confirms that Phase 0 discovery records the index present and fresh, that the lookup runs, that the committed hash pair matches, and that the ripgrep recipe returns results. A healthy index raises no index, lookup or recipe finding, so the run ends with `status=OK`. The committed generation diagnostics still count low-quality phrases, and the workflow lists every non-zero class there as a quality advisory that never changes the status. Nothing is written to the index or the corpus.

The command is read-only by contract for the artifacts it diagnoses. Its only allowed writes are the packet-local report and state log, and the trigger index is never regenerated from the doctor.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the retrieval diagnostic reports a fresh index as OK, lists phrase-quality advisories without changing that status, and leaves the repository artifacts untouched.
- Playbook ID: DOC-349.
- Real user request: `Check whether the spec-kit trigger index and the retrieval recipes are healthy.`
- Prompt: `Check whether the spec-kit trigger index and the retrieval recipes are healthy.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, whose trigger index was generated over the same corpus, and an active spec packet with a writable scratch directory for the diagnostic report and state log.
- Expected execution process: Confirm the index is fresh, run `/doctor:speckit`, approve both blocking gates, capture every Phase 0 signal, and compare the trigger index checksum before and after the run.
- Expected signals: The check command exits 0 with `fresh: true`. The lookup exits 0 or 1 with `indexHash`, `manifestHash` and `candidatePhraseCount` recorded. `committed_pair_match` is true. The recipe exits 0 with a non-zero path count, and the same recipe without `--no-config` returns the same path set. The re-run against a nonexistent root exits 2 with stderr. Every class in the `staleness_classes` map is zero. `quality_advisories` lists each non-zero class in the `phraseQuality` bucket of `generation-diagnostics.json` with its phrase count, document count and share of all phrases. Phase 2 reports `status=OK` with no action needed, Phase 3 reports `STATUS_OK`, and the summary shows `Target: speckit-retrieval`, `Status: OK` and an `Advisories:` line naming those classes. The trigger index checksum is identical before and after the run.
- Desired user-visible outcome: A diagnostic summary that names the target, reports `Status: OK`, and lists the phrase-quality advisories as information only.
- Pass/fail: PASS if the check exits 0 with `fresh: true`, the lookup exits 0 or 1, the recipe returns paths, every staleness class is zero, the status is OK with the advisories listed, and the trigger index checksum is unchanged.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Check whether the spec-kit trigger index and the retrieval recipes are healthy.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing.
2. In the environment, confirm the index is present and fresh:
   - `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 0 with `fresh: true`. When it exits 1, run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` once and re-check.
3. Record the checksum: `shasum -a 256 .skilled/skills/system-spec-kit/runtime/data/trigger-index.json`.
4. Run `/doctor:speckit` through the real runtime.
5. Answer `y` at both blocking gates, `before_phase_1_analysis` and `before_phase_2_recommendation`.
6. Capture the Phase 0 discovery outputs, the Phase 1 `staleness_classes` map, the Phase 2 status and recommendation, and the report and state log paths.
7. Record the checksum again and compare it with step 3.
8. Restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

Phase 0 records the index present, the check fresh, the lookup exit at 0 or 1, a matching committed hash pair, and the Gate 1 reach path for each runtime. The recipe returns paths and the ambient-configuration comparison finds no difference. Phase 1 finds no staleness and lists each non-zero class in the diagnostics' `phraseQuality` bucket under `quality_advisories`. Phase 2 reports `status=OK` with no action needed, and the summary shows `Status: OK` with the advisories on their own line.

The doctor writes only its packet-local report and state log. The trigger index and the corpus are unchanged.

### Evidence

- The `--check` output with exit 0 and `fresh: true`.
- The lookup output with its exit status, `indexHash`, `manifestHash` and `candidatePhraseCount`.
- The recipe path list and exit status, the `--no-config` comparison, and the nonexistent-root run exiting 2 with stderr.
- The `staleness_classes` map, the `quality_advisories` list and the Phase 2 status.
- Checksums from steps 3 and 7.
- The report path and the state log path.
- The final `git status --porcelain` output.

### Pass / Fail

- **Pass**: The check exits 0 with `fresh: true`, the lookup exits 0 or 1, the recipe returns paths, every staleness class is zero, the status is OK with the advisories listed, and the trigger index checksum is unchanged.
- **Fail**: The check reports not fresh, the lookup exits 2 or higher, a staleness class is non-zero, the advisories disagree with the diagnostics bucket, a phrase-quality advisory changes the status or the recommendation, the summary reports anything but `OK`, or a repository artifact changes.

### Failure Triage

If the check reports not fresh, inspect which corpus document changed and regenerate the index in the environment. If the lookup exits 2 or higher, inspect the index read in `lookup-trigger-index.mjs` and attach its stderr. If the recipe returns nothing, inspect the path-only recipe in the retrieval conventions and its flags in `doctor-speckit-retrieval.yaml`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml](../../../../commands/doctor/assets/doctor-speckit-retrieval.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-speckit-presentation.txt](../../../../commands/doctor/assets/doctor-speckit-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:speckit

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-349
- Feature name: Doctor speckit retrieval healthy
- Command mode: `/doctor:speckit`
- YAML asset: `doctor-speckit-retrieval.yaml`
- Mutation boundary: the trigger index and every corpus file stay read-only. The only allowed writes are the packet-local report and state log.
- Feature file path: `doctor-commands/doctor-speckit-retrieval-healthy.md`
