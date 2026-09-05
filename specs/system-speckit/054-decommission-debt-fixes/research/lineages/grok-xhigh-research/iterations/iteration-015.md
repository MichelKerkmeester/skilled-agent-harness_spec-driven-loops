# Iteration 15: 052 LOG debt 054 did not absorb

## Focus
Re-check the 052 Deviations table against 054 T004-T008. Confirm which deferred rows are still live after this lineage's later evidence.

## Findings

### F-I15-001 — Three sk-doc validator class defects remain unabsorbed. CONFIRMED. P2
052 lists three class defects, each failing identically at `5220257bf7`, owners sk-doc or the deep-loop contract compiler: playbook folder-index READMEs classified as scenarios; compiled deep-loop contracts failing the command template; `install-guides/install-scripts/README.md` classified as an install_guide. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:197-200]
054 T004-T008 do not name them. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-51]
This lineage did not re-run the validators (write-surface ban on validate.sh). Status is still "owner: sk-doc / not fixed here".
Smallest fix: not a 054 code task. Track under sk-doc.

### F-I15-002 — `onnxruntime-common` fresh-install proof was never run. CONFIRMED. P2
052: `onnxruntime-common` is absent from the main checkout `node_modules` while the HF provider resolves it through the skill-root tree; a fresh install is the proof and was not run. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:208]
054 did not add that proof. This lineage did not install packages or read `node_modules`.
INFERRED: the D5 HF server still needs the transitive native package. The miss is missing proof, not a confirmed broken import.
Smallest fix: one clean `npm install` in a throwaway worktree and record whether `onnxruntime-common` appears. Out of this lineage's write surface.

### F-I15-003 — Dist-freshness fixture counting was absorbed (T004). CONFIRMED. P2 (negative)
052: every trigger-index run rewrites `scripts/retrieval/fixtures/*.json` and freshness counts them as sources. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:207]
054 T004 marks that fixed. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47]
Do not treat fixture-stale freshness as still open unless a later run disproves T004.

### F-I15-004 — Fan-out stderr and review-leaf cwd writes were absorbed (T005, T006). CONFIRMED. P2 (negative)
052: `fanout-run.cjs` drains stderr; review leaf wrote `iterations/` at cwd. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:210-211]
054 T005 / T006 are checked. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:48-49]
Those runner defects are not "what the decommission missed" on this tree unless T005/T006 are later falsified.

### F-I15-005 — Unabsorbed 052 set after this pass. CONFIRMED. P1
Still open relative to 054:
- validator class defects (F-I15-001)
- `validate-command-references` + ignored sqlite rows (F-I14-003, goal.md:201)
- `onnxruntime-common` unproven (F-I15-002)
- leftover ignored `mcp-server/` tree (F-I10-001; same class as goal.md:116 mirrors, but this one reproduces)
- doctor-update `mcp-server/database` snapshot (F-I14-001; not in the 052 table)
- live `memory_index` writer (F-I11-001; not in the 052 table)
- `sqlite-vec` without importer (F-I5-001 / F-I12-001)
054 absorbed T004-T008 only. The landing's "prove zero drift, residue or debt" objective [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:47] is still open on those rows.
Smallest fix: a follow-on packet (or extra 054 tasks) that names each row. Do not close T012 by writing "zero debt" into the 052 log.

## Sources Consulted
- specs/system-speckit/052-memory-decommission-landing/goal.md:47,116,197-211
- .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-51

## Assessment
- newInfoRatio: 0.40
- Novelty justification: absorption map is the new artifact; most rows were logged in iteration 1. F-I15-005 adds doctor snapshot + leftover writer to the unabsorbed set.
- Confidence: high on the task table. onnxruntime remains inferred.

## Reflection
- Worked: match each 052 deviation to a 054 task id.
- Failed: cannot re-run template validators in this lineage.
- Ruled out: rediscovering T004-T007 as open decommission misses.

## Dead Ends
- Re-running `validate_document.py` (out of write/verify surface).

## Recommended Next Focus
`workflow-invariance.vitest.ts` allowlist of deleted playbooks (F-I1-005), including `spec-memory-plugin.md`.
