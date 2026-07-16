---
title: "Plan: 022/014 Deferred Closeout"
description: "3 ship + 1 no-op + 1 deferred. Bash scripts + install-guide note + comment freshness."
trigger_phrases: ["022/014 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout"
    last_updated_at: "2026-05-23T22:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan post-execution"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b1b"
      session_id: "016-002-022-014-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["3 actionable items shipped; 1 resolved no-op; 1 deferred to dynamic-threshold packet"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 022/014 Deferred Closeout

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Surface | 3 new bash scripts under `.opencode/scripts/` + install-guide note + 1 TS comment block |
| Verification | Smoke-test each script + manual install + commit-smoke test |
| Risk | LOW — advisory tooling, no behavior change |

### Overview

Small bundled closeout of 3 deferred follow-ons from 022 arc. 1 deferred item (node-llama-cpp prune) discovered as no-op; 1 (Z_SCORE_THRESHOLD value change) intentionally deferred until per-operator reranker-presence signal exists.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- 4 deferred items inventoried from arc 022 close
- Build-pipeline gap reproducible (MCP -32000 from missing dist JSON)
- Validator (010 + 011 Step 2) functional and exit-code-correct

### Definition of Done
- R1–R5 from spec.md §4 pass
- Strict-validate `--strict` exit 0
- Parent `graph-metadata.json` children_ids includes `014-deferred-closeout`
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

3 shipped artifacts, layered:

- **Hook content** (`git-hooks/pre-commit`): the actual logic — invokes the validator, prints advisory warnings, exits 0.
- **Hook installer** (`install-git-hooks.sh`): operator-opt-in symlink installer; supports uninstall; idempotent.
- **Build-time data copy** (`copy-skill-advisor-dist-data.sh`): mirrors `data/*.json` from source into dist tree; tracked alternative to the gitignored package.json postbuild.

Edits:
- **install_guides/README.md**: adds the bash command after `npm run build` + explanatory note.
- **evidence-gap-detector.ts**: Z_SCORE_THRESHOLD comment freshness only; value unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1 — Tracked data-copy script
Create `.opencode/scripts/copy-skill-advisor-dist-data.sh` (~40 LOC, idempotent, safe-by-default).

### Step 2 — Advisory pre-commit hook + installer
Create `.opencode/scripts/git-hooks/pre-commit` (~30 LOC) + `.opencode/scripts/install-git-hooks.sh` (~35 LOC). Hook is advisory (exit 0 always); install supports `--uninstall`.

### Step 3 — Install-guide doc update
Update `.opencode/install_guides/README.md` skill-advisor install section: add `copy-skill-advisor-dist-data.sh` invocation + explanatory note.

### Step 4 — Z_SCORE_THRESHOLD comment
Update `evidence-gap-detector.ts` Z_SCORE_THRESHOLD comment to reflect post-013 reranker activation requirements; value unchanged (1.3).

### Step 5 — Spec packet + parent metadata
Author 4 Level-1 docs + description.json + graph-metadata.json. Update parent `022-hardcoded-default-remediation-arc/graph-metadata.json` children_ids. Strict-validate exit 0.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **R1 copy script**: delete target file, run script, verify file restored
- **R2 install hook**: run installer, verify symlink at `.git/hooks/pre-commit`
- **R3 advisory hook**: `git commit --allow-empty` succeeds even when validator detects drift; smoke commit then `git reset --soft HEAD~1`
- **R4 bypass**: `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1 git commit ...` skips validator
- **R5 comment update**: manual read confirms `SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true` mentioned + rationale for keeping 1.3
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 010 packet: ships `validate-doc-model-refs.js` (the hook's payload)
- 011 Step 2: validator bug fixes (matchAll /g, sbert/ prefix, path resolution, etc.)
- 013 packet: established the SPECKIT_CROSS_ENCODER + RERANKER_LOCAL dual-opt-in state that the Z_SCORE comment now documents
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Hook: `bash .opencode/scripts/install-git-hooks.sh --uninstall` removes the symlink
- Copy script: `git rm` the file; operator's local package.json postbuild (if added) still works
- Install-guide note: `git revert` on the commit
- Z_SCORE comment: `git revert` on the commit
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Depends on prior arc 022 work. No coordination with in-flight work; this is a tail-end closeout packet (16th child of the arc).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Step | Wall-clock |
|------|------------|
| 1 Copy script | ~5 min |
| 2 Hook + installer | ~10 min |
| 3 Install-guide doc | ~5 min |
| 4 Z_SCORE comment | ~5 min |
| 5 Packet + metadata | ~15 min |
| **Total** | **~40 min** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If pre-commit hook causes operator friction beyond the advisory mode: uninstall via the script. If `copy-skill-advisor-dist-data.sh` fails on some operator's machine: bash exit-traps + idempotent design mean the failure mode is "no copy happens" — operator can still manually run the cp command from the build-pipeline note.
<!-- /ANCHOR:enhanced-rollback -->
