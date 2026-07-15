---
title: "Tasks: 022/014 Deferred Closeout"
description: "5 file edits/creations + verification + spec packet."
trigger_phrases: ["022/014 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout"
    last_updated_at: "2026-05-23T22:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b1c"
      session_id: "016-002-022-014-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["3 actionable items shipped; 1 no-op; 1 deferred"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 022/014 Deferred Closeout

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[ ]` pending | `[~]` deferred | `[T###]` id
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P1] Inventoried 4 deferred items from arc 022 close
- [x] [T002] [P1] Discovered node-llama-cpp prune is no-op (no live package.json dep; only package-lock.json residue)
- [x] [T003] [P1] Discovered system-skill-advisor/mcp_server/package.json is gitignored (`.opencode/.gitignore:2`) — pivot to tracked bash script instead
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T004] [P1] Create `.opencode/scripts/copy-skill-advisor-dist-data.sh` (~40 LOC, idempotent, safe-by-default; mirrors data/*.json into dist tree)
- [x] [T005] [P1] Create `.opencode/scripts/git-hooks/pre-commit` (~30 LOC, advisory: always exits 0; bypass via SPECKIT_SKIP_DOC_MODEL_VALIDATE=1)
- [x] [T006] [P1] Create `.opencode/scripts/install-git-hooks.sh` (~35 LOC; supports --uninstall; won't overwrite existing non-symlinks)
- [x] [T007] [P1] Update `.opencode/install_guides/README.md` skill-advisor install section: add `bash .opencode/scripts/copy-skill-advisor-dist-data.sh` after `npm run build` + explanatory build-pipeline note
- [x] [T008] [P1] Update `.opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` Z_SCORE_THRESHOLD comment to reflect post-013 dual-opt-in state (SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true); value unchanged
- [x] [T009] [P1] Author spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json
- [x] [T010] [P1] Update parent graph-metadata.json children_ids to include `014-deferred-closeout`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T011] [P0] R1: `rm -f dist/.../prompt-policy.default.json && bash .opencode/scripts/copy-skill-advisor-dist-data.sh` restores the file
- [x] [T012] [P0] R2: `bash .opencode/scripts/install-git-hooks.sh` creates `.git/hooks/pre-commit` as a symlink
- [x] [T013] [P0] R3: smoke `git commit --allow-empty -m "hook smoke test"` succeeds with advisory drift warnings on stderr; reverted via `git reset --soft HEAD~1`
- [x] [T014] [P0] R4: hook honors `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` bypass env var (per script source)
- [x] [T015] [P0] R5: manual read of evidence-gap-detector.ts comment confirms post-013 narrative
- [x] [T016] [P0] Strict-validate `--strict` exit 0 on this packet
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
16 of 16 tasks complete. R1–R5 from spec.md §4 all pass. 3 deferred items closed; 1 resolved no-op; 1 deferred to future dynamic-threshold packet.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R5 ↔ T011–T015. plan.md Steps 1–5 ↔ Phases 1–3.
<!-- /ANCHOR:cross-refs -->
