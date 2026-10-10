---
title: "Changelog: Rebuild the trigger index in CI [034-spec-folder-tooling/010-trigger-index-ci-rebuild]"
description: "Chronological changelog for the Rebuild the trigger index in CI phase."
trigger_phrases:
  - "spec folder tooling trigger index ci rebuild changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-10

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild` (Level 1)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

A push that leaves the committed trigger index stale is now repaired by CI instead of merged with a warning. The new job regenerates the index and commits it when it changed, so agents stop searching an index that misses the newest packets.

### Added

- Create the rebuild workflow with the trigger surface, pushes to main and skilled/** plus manual dispatch, and contents: write (.github/workflows/trigger-index-rebuild.yml)
- Add the race and loop guards, a concurrency group per ref and a skip when the head commit's subject is the rebuild subject (.github/workflows/trigger-index-rebuild.yml)
- Check out with the TRIGGER_INDEX_PUSH_TOKEN secret, falling back to the default token, and give the rebuild commit a body so it passes the commit-message check (.github/workflows/trigger-index-rebuild.yml)
- Operator creates a fine-grained token for this repository with Contents read and write, and runs gh secret set TRIGGER_INDEX_PUSH_TOKEN (set on 2026-10-07 after its admin and push access were confirmed)
- Pin the checkout and setup-node actions and Node 20 the way the advisory workflow does, later raised to Node 22 by T014 (.github/workflows/trigger-index-rebuild.yml)
- Run the generator, commit only runtime/data/trigger-index.json when git diff shows a change, and print an error that names branch protection when the push fails (.github/workflows/trigger-index-rebuild.yml)

### Changed

- Review the generator and its --check mode that the job calls (runtime/cli/retrieval/generate-trigger-index.mjs)
- All tasks marked [x]
- No [B] blocked tasks remaining
- Manual verification passed, the first live push leaves the index current (scratch/evidence/ci-bot-commit-proof.txt sections 4 and 5)

### Fixed

- Record the scope decision, repair in CI after merge and keep the pull request step report-only (spec.md)

### Verification

- YAML parse of .github/workflows/trigger-index-rebuild.yml - PASS
- actionlint on the committed workflow and on the working tree - PASS, exit 0 with no output (scratch/evidence/actionlint-trigger-index-rebuild.txt sections 1 and 2)
- bash -n over each run block of the committed workflow - PASS, exit 0 for all three blocks, and the commit block is now 114 lines (section 3)
- Live run commits and pushes the index - PASS, run 37704306595 pushed 2d2c8fcd55, run 37986342243 pushed 4669db6522 (scratch/evidence/ci-bot-commit-proof.txt sections 4 and 5)
- --check on the current head - PASS, "trigger index matches the corpus" with 0 stale documents (section 4)
- Loop guard - PASS, 17 of 17 bot commits had their own rebuild run skipped (section 2)
- Push that leaves the index current - PASS, 3 successful runs found the index current and pushed no commit (section 7)
- Non-fast-forward race - PASS, run 37761007246 rejected its first commit, retried, and pushed 08af7d089 (section 6)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.github/workflows/trigger-index-rebuild.yml` | Created | Rebuild the index on the integration branches and commit it when it changed |
| `.github/workflows/advisory-checks.yml` | Modified | Point the drift message at the rebuild workflow |

### Follow-Ups

- The token expiry is not verified here. The secret TRIGGER_INDEX_PUSH_TOKEN exists and was last updated 2026-10-07T17:35:14Z, per gh secret list. Its expiry date is set in GitHub and cannot be read from this environment. The token acts as the admin, so the operator confirms the expiry date.
- Commit scope: resolved by supersession. The spec scope and T006 describe a job that commits runtime/data/trigger-index.json only, and this phase shipped that index-only commit. Phase 016/004 superseded it on purpose. The job now stages the index and its three fixture sidecars, and that phase's spec records the four files at lines 71 and 197 (../016-research-recommendations/004-trigger-index-rebuild-hardening/spec.md). The workflow matches that later phase, so no open question remains.
- Loop guard: resolved by supersession. The spec, T004 and the Key Decisions describe a skip that matches the rebuild subject, and this phase shipped that subject match. Phase 016/004 superseded it on purpose with a Trigger-Index-Rebuild: ci trailer, matched at the end of the head commit message (../016-research-recommendations/004-trigger-index-rebuild-hardening/spec.md, lines 72, 109 and 195). The workflow matches that later phase, so no open question remains.
- The first committing run had no --check. Run 37704306595 pushed 2d2c8fcd55 before f0ea65aeef added the in-job --check. The --check result for the current head is in run 37986342243 (scratch/evidence/ci-bot-commit-proof.txt section 4).
- The working tree holds uncommitted workflow edits. At recording time the working copy of trigger-index-rebuild.yml differed from HEAD by 116 changed lines. CI has not run those edits. This phase's live evidence covers the committed version.
- The changelog entry is written. The Phase Context asked for a refresh of this phase's changelog file. The entry is ../changelog/changelog-034-010-trigger-index-ci-rebuild.md in the parent's changelog folder, and the nested changelog generator wrote it from this packet.
