---
title: "DOC-350 -- Doctor speckit stale index"
description: "Manual scenario validating that /doctor:speckit on a stale trigger index reports the index_content_stale signal and names the regeneration command without regenerating it."
version: 1.1.0.0
id: doctor-commands-doctor-speckit-stale-index
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-350 -- Doctor speckit stale index

## 1. OVERVIEW

This scenario validates `/doctor:speckit` when the committed trigger index no longer matches the corpus. The check command exits 1 with `fresh: false` and names the stale documents. Phase 1 classifies `index_content_stale` at medium severity. Phase 2 recommends a full-corpus regeneration and names the generator command.

The doctor never regenerates the index itself. Its only writes are the packet-local report and state log, so the drift must remain in place and the index checksum must be unchanged after the run.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the diagnostic detects a stale index, names the regeneration command, and leaves the index untouched.
- Playbook ID: DOC-350.
- Real user request: `Check why the spec-kit trigger index looks stale and tell me how to fix it.`
- Prompt: `Check why the spec-kit trigger index looks stale and tell me how to fix it.`
- Preconditions: A disposable copy of the repository whose trigger index is fresh before the drift edit, and an active spec packet with a writable scratch directory for the diagnostic report and state log.
- Expected execution process: Make the copy fresh, edit one indexed document's trigger phrases, confirm the staleness with the check command, run `/doctor:speckit`, capture the recommendation, compare the checksum, then restore the edited document.
- Expected signals: The check command exits 1 with `fresh: false` and a non-empty `staleDocuments` list naming the edited document. Phase 1 classifies `index_content_stale`. Phase 2 reports medium severity and its `recommended_command` is `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`. Phase 3 reports `STATUS_STALE` and the summary shows `Target: speckit-retrieval` with `Status: STALE`. The `Advisories:` line lists the phrase-quality classes from the diagnostics, and they add no severity and change neither the status nor the recommended command. The trigger index checksum is identical before and after the doctor run.
- Desired user-visible outcome: A diagnostic summary that names the stale signal and the exact regeneration command.
- Pass/fail: PASS if the check exits 1 with `fresh: false`, `index_content_stale` is classified, the regeneration command is named, the phrase-quality advisories leave the status and recommendation unchanged, and the trigger index checksum is unchanged.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Check why the spec-kit trigger index looks stale and tell me how to fix it.
```

### Commands

1. Create a disposable copy of the repository.
2. Make the index fresh in the copy: run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json`, run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` when it exits 1, and confirm the check exits 0 with `fresh: true`.
3. Record the checksum: `shasum -a 256 .skilled/skills/system-spec-kit/runtime/data/trigger-index.json`.
4. Edit one indexed document's frontmatter `trigger_phrases` list, for example by adding one new phrase to a spec packet's `spec.md`, then save it without running the generator.
5. Confirm the staleness: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 1 with `fresh: false` and `staleDocuments` naming the edited document.
6. Run `/doctor:speckit` through the real runtime.
7. Answer `y` at both blocking gates, `before_phase_1_analysis` and `before_phase_2_recommendation`.
8. Capture the Phase 1 staleness class, the Phase 2 `recommended_command`, the summary status, and the report path.
9. Record the checksum again and confirm it matches step 3.
10. Restore the edited document in the copy with `git checkout -- <document>` and confirm the check exits 0 with `fresh: true` again.

### Expected

Phase 0's check exits 1 and records the stale document count. Phase 1 classifies `index_content_stale` at medium severity. Phase 2 recommends a full-corpus regeneration and its `recommended_command` is the generator command. The presentation's troubleshooting row names the same command.

The summary shows `Status: STALE`, and its phrase-quality advisories are information only: the status and the recommended command come from the freshness evidence alone. The doctor writes only its packet-local report and state log, and the index checksum is unchanged because regeneration is left to the operator.

### Evidence

- The fresh baseline check with exit 0 and `fresh: true`.
- The edit to the document's `trigger_phrases` list and the failing check with its `staleDocuments` entry.
- The Phase 1 `index_content_stale` classification and the Phase 2 `recommended_command`.
- The summary block with `Status: STALE` and its `Advisories:` line.
- Checksums from steps 3 and 9.
- The restored document and the final check with exit 0 and `fresh: true`.

### Pass / Fail

- **Pass**: The check exits 1 with `fresh: false`, `index_content_stale` is classified, the regeneration command is named, the phrase-quality advisories leave the status and recommendation unchanged, and the trigger index checksum is unchanged.
- **Fail**: The check stays fresh after the edit, the recommendation names no command, the summary is not stale, a phrase-quality advisory adds severity or changes the recommendation, or the index changes during the run.

### Failure Triage

If the check stays fresh after the edit, inspect the index's `paths` array and confirm the edited document is an indexed source, because a document outside the corpus cannot move the verdict. If the recommendation names the wrong action, inspect `phase_2_recommendation` in `doctor-speckit-retrieval.yaml`. If the checksum changes, the doctor regenerated the index, which violates its read-only invariant.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml](../../../../commands/doctor/assets/doctor-speckit-retrieval.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-speckit-presentation.txt](../../../../commands/doctor/assets/doctor-speckit-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:speckit

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-350
- Feature name: Doctor speckit stale index
- Command mode: `/doctor:speckit`
- YAML asset: `doctor-speckit-retrieval.yaml`
- Mutation boundary: the trigger index and every corpus file stay read-only. The only allowed writes are the packet-local report and state log.
- Feature file path: `doctor-commands/doctor-speckit-stale-index.md`
