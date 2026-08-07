---
title: "Implementation Plan: 101/007 Council Infrastructure Hardening"
description: "One cli-codex gpt-5.5 high fast dispatch covering all six residual gaps from 101/001..006."
trigger_phrases:
  - "101/007 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/007-council-infrastructure-hardening"
    last_updated_at: "2026-05-11T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-007-infrastructure-hardening"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/007 Council Infrastructure Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (catalog + docs), TypeScript (vitest), Node CJS (helper script), bash (runner + hook), npm script |
| **Framework** | system-spec-kit + vitest + sk-doc validators |
| **Storage** | Filesystem only |
| **Testing** | New vitest + sk-doc + spec validate.sh --strict + manual smoke for runner and replay helper |

### Overview
Single cli-codex dispatch closes six residual gaps in parallel: runnable test gate (npm script + standalone runner + docs), 32-entry feature catalog matching system-spec-kit convention, reverse-anchor meta-test for playbook ↔ vitest integrity, DAC-025 derived-projection replay helper, Codex TOML name/description parity broadening, and inline normalization provenance comments for DAC-030/DAC-032 fixtures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All six gaps diagnosed precisely with file paths
- [x] Existing patterns identified (npm scripts, feature_catalog convention, runtime-parity test shape)
- [x] No infrastructure exists today that would conflict (no GitHub Actions, no husky)

### Definition of Done
- [ ] `npm run test:council` passes
- [ ] 32 feature catalog entries authored; root playbook §17 references real paths
- [ ] Reverse-anchor meta-test passes
- [ ] Replay helper script runs `--help` cleanly
- [ ] Codex TOML name/description assertions in test
- [ ] DAC-030/032 fixture comments in place
- [ ] Strict spec validation passes for 007 + parent 101
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive infrastructure. No runtime code changes. Each gap is closed by a small addition that hooks into existing conventions (npm scripts, vitest, sk-doc validators, feature_catalog format).

### Key Components
- **Council test gate**: npm script delegates to a portable bash runner that chains vitest + sk-doc + strict spec validate
- **Feature catalog**: mirrors `system-spec-kit/feature_catalog/` structure (9 category folders, 32 entry files with OVERVIEW/CURRENT REALITY/SOURCE FILES/SOURCE METADATA sections)
- **Reverse-anchor meta-test**: pure-data integrity test (read playbook + scenarios + test files; assert anchor strings resolve)
- **Replay helper**: reads append-only JSONL events, derives node/edge upserts, invokes graph layer
- **Parity broaden**: one new `expect()` block in existing test
- **Normalization comments**: code-level provenance for fixture-side transforms

### Data Flow
Each component is independent. Test gate runs other tests. Catalog is reference docs. Reverse-anchor test reads files. Replay helper reads JSONL, writes graph rows. Codex test reads TOML. Comments are static documentation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet 007 spec docs on main agent
- [x] cli-codex prompt drafted

### Phase 2: Core Implementation (cli-codex dispatch)
- [ ] Author 11 new files + 5 modifications across the 6 gap categories
- [ ] Verify each gap is closed by running its acceptance check

### Phase 3: Verification (main agent)
- [ ] `npm run test:council` from `mcp_server/`
- [ ] Full 9-file council vitest batch
- [ ] sk-doc validators
- [ ] Strict spec validation
- [ ] Author real implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| New vitest (anchor integrity) | Playbook ↔ test-name mapping | `npx vitest run tests/council-playbook-anchor-integrity.vitest.ts` |
| Existing council vitest matrix | Regression-check after parity broaden | Single batched `npx vitest run` of 9 files |
| npm script smoke | `test:council` chain | Single command, exit code |
| Standalone runner smoke | Bash runner returns 0 / non-zero | Inject and revert a deliberate failure |
| Helper script smoke | `--help` and a fixture replay | Node CLI |
| sk-doc validators | All new catalog + doc files | `quick_validate.py` + `validate_document.py` |
| Spec validation | 007 + parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 101/001..006 deliverables | Internal | Complete | n/a |
| Existing `system-spec-kit/feature_catalog/` example | Internal | Available | Catalog format reference |
| Existing `mcp_server/package.json` scripts | Internal | Available | npm script extension point |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: catalog format diverges from convention, OR test gate creates spurious failures, OR helper script writes unsafe paths.
- **Procedure**: `git restore` the additive files + reverts. Runtime code is untouched; rollback is pure file-tree restore.
<!-- /ANCHOR:rollback -->
