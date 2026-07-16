---
title: "Spec: 022/014 Deferred Closeout — build-pipeline JSON-copy, advisory pre-commit hook, Z_SCORE_THRESHOLD comment"
description: "Closes 3 of 4 deferred follow-ons from the 022 arc: tracked dist/data JSON-copy script + install-guide note, advisory pre-commit hook + install script for validate-doc-model-refs.js, Z_SCORE_THRESHOLD comment update reflecting post-013 state. node-llama-cpp dep prune resolved-by-discovery (no live package.json dep)."
trigger_phrases:
  - "022/014 deferred closeout"
  - "skill-advisor dist json copy"
  - "advisory pre-commit hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout"
    last_updated_at: "2026-05-23T22:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped 3 deferred-item fixes"
    next_safe_action: "Strict validate + commit + push"
    blockers: []
    key_files:
      - ".opencode/scripts/copy-skill-advisor-dist-data.sh"
      - ".opencode/scripts/git-hooks/pre-commit"
      - ".opencode/scripts/install-git-hooks.sh"
      - ".opencode/install_guides/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b1a"
      session_id: "016-002-022-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "node-llama-cpp package.json prune: no-op — only package-lock.json residue remains; lockfile regenerates on next npm install"
      - "Z_SCORE_THRESHOLD value left at 1.3 (comment-only update); raising to 1.5 would over-penalize operators running without the sidecar"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 022/014 Deferred Closeout

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Phase | 014 |
| Title | Deferred Closeout (build-pipeline + advisory hook + comment update) |
| Level | 1 |
| Parent | 022-hardcoded-default-remediation-arc |
| Predecessor | 013 (voyage/cohere removal) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After 022/013 shipped, 4 deferred items remained on the arc. Three are actionable as a small bundled closeout:

1. **Build-pipeline JSON-copy gap** — `tsc` doesn't copy `data/*.json` into `dist/`. The skill-advisor MCP launcher fails on first start without `dist/.../data/prompt-policy.default.json`. Manual copy is the workaround; needed a tracked, reproducible script.
2. **Advisory pre-commit hook for `validate-doc-model-refs.js`** — Task #39. Validator was shipped by 010 + de-bugged by 011 Step 2; the hook to wire it as a pre-commit warning was never installed.
3. **Z_SCORE_THRESHOLD comment** — references `RERANKER_LOCAL=true` as the long-term fix, but post-013 the local sidecar is the ONLY supported reranker AND activation requires `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true`. Comment was stale.

The fourth deferred item (`node-llama-cpp` package.json dep prune) is resolved-by-discovery: no live `package.json` declares `node-llama-cpp`; only `package-lock.json` residue remains, which regenerates on next `npm install`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (shipped this packet)

5 live files (3 new + 2 modified):

- **`.opencode/scripts/copy-skill-advisor-dist-data.sh`** (NEW, executable, ~40 LOC) — idempotent shell script that mirrors `data/*.json` from `mcp_server/data/` into `dist/system-skill-advisor/mcp_server/data/`. Safe to re-run; exits 0 if source dir is absent.
- **`.opencode/scripts/git-hooks/pre-commit`** (NEW, executable, ~30 LOC) — advisory pre-commit hook that runs `validate-doc-model-refs.js` and prints drift warnings to stderr. Always exits 0 (commit not blocked). Bypass via `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1`.
- **`.opencode/scripts/install-git-hooks.sh`** (NEW, executable, ~35 LOC) — installs all hooks under `git-hooks/` as symlinks in `.git/hooks/`. Supports `--uninstall`. Won't overwrite existing non-symlinks.
- **`.opencode/install_guides/README.md`** (modified) — added build-pipeline note pointing at `copy-skill-advisor-dist-data.sh` and the bash command after `npm run build`.
- **`.opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts`** (modified) — Z_SCORE_THRESHOLD comment updated to reflect post-013 state: local sidecar is the only supported reranker, activation requires both `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true`, threshold stays at 1.3 conservatively until a per-operator reranker-presence signal is wired.

### Out of Scope (intentionally not shipped)

- **`node-llama-cpp` package.json prune**: no live dep to remove; only stale `package-lock.json` references remain and regenerate on next `npm install`. No action needed.
- **Raising Z_SCORE_THRESHOLD from 1.3 → 1.5**: requires per-operator reranker-presence signal (whether sidecar is actually reachable). Deferred to a future packet that adds a runtime probe + dynamic threshold.
- **Local edits to `.opencode/skills/system-skill-advisor/mcp_server/package.json` `postbuild` script**: file is gitignored per `.opencode/.gitignore`; operator's local convenience edit doesn't propagate. The tracked `copy-skill-advisor-dist-data.sh` provides the same functionality in a tracked, portable form.
- **Husky / lint-staged dependency**: the shipped hook + install script work without any new npm dependencies.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|----|-------------|--------------|
| R1 | `bash .opencode/scripts/copy-skill-advisor-dist-data.sh` copies `data/*.json` into the dist tree | Run script after `rm -f` of the target; verify file exists post-run |
| R2 | `bash .opencode/scripts/install-git-hooks.sh` creates `.git/hooks/pre-commit` symlinked to the shipped hook | `ls -la .git/hooks/pre-commit` shows symlink |
| R3 | Pre-commit hook runs `validate-doc-model-refs.js` and exits 0 even on drift (advisory) | `git commit --allow-empty` succeeds even when drift is present; stderr shows warning |
| R4 | `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1 git commit ...` bypasses the validator entirely | hook script checks this env var first |
| R5 | `evidence-gap-detector.ts` Z_SCORE_THRESHOLD comment reflects post-013 state (`SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true` requirement; threshold left at 1.3 conservatively) | Manual read of the updated comment |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R5 pass. Strict-validate exit 0 on this packet. 3 of 4 arc-022 deferred items closed; 1 (node-llama-cpp) resolved-by-discovery as no-op.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct edits, no CLI dispatch. Bash scripts shipped under `.opencode/scripts/` (already a tracked dir). Install-guide note added to the existing skill-advisor section. Comment update is a single-block edit.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Pre-commit hook breaks the operator's commit flow | Advisory mode (always exit 0); explicit bypass env var; uninstall via `bash install-git-hooks.sh --uninstall` |
| `copy-skill-advisor-dist-data.sh` runs on every operator machine but the source data dir may be absent | Script exits 0 with informational stderr; safe-by-default |
| Install-guide note about the postbuild step is missed by operators | Section anchored next to the existing `npm run build` step; high visibility |
| Z_SCORE_THRESHOLD stays at 1.3 even when sidecar is reachable | Comment documents the rationale + flags the deferred dynamic-threshold work; operator can override with a local patch if needed |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should the install-git-hooks step be run automatically on first `npm install` in any skill? (Cross-skill auto-install would be intrusive; current operator-opt-in shape is safer.)
- Z_SCORE_THRESHOLD dynamic-tuning (per-operator reranker presence) — separate packet?
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Sibling: `013-remove-voyage-cohere-residue` (immediate predecessor; same shape)
- Validator origin: 010-adr-writing-and-doc-validator (ships `validate-doc-model-refs.js`)
- Build-gap origin: 011-arc-022-followons Step 1 (operator discovered the dist-JSON copy gap during MCP -32000 recovery)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- Zero new npm dependencies (hook + install + copy scripts are vanilla bash)
- Idempotent: re-running any script is safe
- Operator-portable: scripts use `git rev-parse --show-toplevel` for repo-root resolution; no hardcoded absolute paths
- Reversible: `bash install-git-hooks.sh --uninstall` cleanly removes the hook symlink
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- Operator runs `copy-skill-advisor-dist-data.sh` before `npm run build` (dist dir doesn't exist yet) → script `mkdir -p`'s the target and copies cleanly.
- Operator already has a non-symlink `.git/hooks/pre-commit` from another tool → install script warns and skips that hook (won't overwrite).
- Operator's `node` is not on PATH → pre-commit hook exits 0 silently (commit proceeds without validation).
- Operator has uncommitted edits to docs in unrelated paths → hook still runs (the validator walks tracked-doc paths, not staged-files; behavior is unchanged from manual `node validate-doc-model-refs.js` invocation).
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 1 small closeout. 3 new shipped scripts (~105 LOC total) + 2 modified files (small edits). Zero behavior change for the arc; advisory tooling addition + comment freshness.
<!-- /ANCHOR:complexity -->
