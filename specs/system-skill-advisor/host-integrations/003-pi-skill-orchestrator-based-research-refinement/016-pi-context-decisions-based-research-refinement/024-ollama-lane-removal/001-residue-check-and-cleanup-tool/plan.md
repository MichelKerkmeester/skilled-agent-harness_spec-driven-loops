---
title: "Implementation Plan: Phase 1: residue-check-and-cleanup-tool"
description: "One ESM script beside the memory residue sweeper lists lane remnants with git grep in repo mode, inspects build output, databases, processes and model stores in machine mode, and deletes the machine leftovers in apply mode. A vitest suite plants terms in temporary git repositories and fixture directories."
trigger_phrases:
  - "residue check and cleanup tool plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: residue-check-and-cleanup-tool

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node 26 ESM (`.mjs`), `node:sqlite`, `git` |
| **Framework** | The spec-kit CLI retrieval scripts' conventions: exit 0/1/2, `--json`, data-row exemptions |
| **Storage** | Reads SQLite databases read-only; deletes files in apply mode |
| **Testing** | Vitest, `cli` project of `.skilled/skills/system-spec-kit/vitest.config.ts` |

### Overview
`sweep-lane-residue.mjs` follows `sweep-memory-residue.mjs` (exit codes at lines 58 to 60, data-row allowlist at `fixtures/residue-allowlist.json`). It differs in three ways the research asked for: it lists tracked files with `git grep -l -i -E` and excludes `specs/`; its allowlist rows are exact paths, because the memory sweeper's trailing-slash glob rows (`residue-allowlist.json` 101 and 105) can match nothing; and it adds machine and apply modes so the vocabulary lives in one script.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts` in `runtime/cli` prints all tests passed, and `sweep-lane-residue.mjs repo` exits 1 with the baseline count
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CLI with exported pure functions, the shape of `sweep-memory-residue.mjs`.

### Key Components
- **Vocabulary**: `IDENTIFIER_PATTERN`, `PROSE_PATTERN` and `PATH_TERMS`, the research's two patterns and the path words `embedders`, `semantic-shadow`, `model-server`, `.embeddings-cache`, `five-lane`.
- **Repo mode**: two `git grep -l -i -E` runs with `:!specs`, a `git ls-files` pass for path words, the `@huggingface/transformers` rows in `package.json` and lockfiles, and the tracked symlinks under the advisor's `lib/shared/`.
- **Machine mode**: checks M1 to M8 of research section 5.5 against resolved paths: `dist` trees, `node_modules/@huggingface` and `onnxruntime-node`, every SQLite file in the advisor database directory (opened read-only through `node:sqlite`), `.bak` and `.corrupt` siblings, `ps` for `hf-model-server.cjs`, `/tmp/system-hf-embed`, the exact HuggingFace cache folder, Ollama `/api/tags`, and `env-secret.cjs keys` on `.env` and `.env.local`, for the checkout and each `git worktree list` path.
- **Apply mode**: deletes what machine mode found that the repo owns; asks on a terminal before the HuggingFace folder and the Ollama model; reports a running `ollama serve` and dotenv keys only.
- **Allowlist**: `fixtures/lane-residue-allowlist.json`, `{ path, reason }` rows, exact tracked paths.

### Data Flow
Arguments pick a mode. Repo mode builds the hit list, drops allowlisted paths, prints a summary or `--json`, and exits 1 when hits remain. Machine mode builds a finding list from each check. Apply mode walks that list, deletes the no-ask items, prompts for the ask items, then re-runs machine mode and exits on its result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds new files and changes no behavior, so the table records what reads or must not be touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sweep-memory-residue.mjs` and its allowlist | Sibling sweeper for the retired memory surface | unchanged | `git diff --stat` shows no change to it |
| `retrieval/README.md` | Lists the folder's scripts | update: one row | `rg -n 'sweep-lane-residue' retrieval/README.md` prints the row |
| `doctor-update-apply.yaml`, CI workflows | Would run the check | unchanged until phase 008 | `git grep -l sweep-lane-residue -- .github .skilled/commands` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'EXIT_LIVE_HITS' .skilled/skills/system-spec-kit/runtime/cli/retrieval` lists the existing sweeper only.
- Consumers of changed symbols: none; the script is new and unwired.
- Matrix axes: mode (repo, machine, apply) x state (remnant present, absent, allowlisted) x terminal (yes, no) for the two ask-first items.
- Algorithm invariant: apply mode deletes only paths it built from a resolved root plus a fixed name list, and never follows a symlink out of that root.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads `sweep-memory-residue.mjs`, `env-secret.cjs` and `skill-graph-db.ts` `resolveSkillGraphDbDir` and records the gate baselines. Implementation writes the script, the allowlist and the test. Verification runs the test and `sweep-lane-residue.mjs repo` and compares its count with the measured 332 plus the embeddings symlink and its own three files. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Pattern matching, allowlist loader, path builders | Vitest, imported exports |
| Integration | Repo mode in a temporary `git init` repository; machine and apply modes against fixture directories and a SQLite file made with `node:sqlite` | Vitest, `spawnSync(process.execPath, ...)` |
| Manual | `sweep-lane-residue.mjs repo` and `machine` on this worktree, read-only | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` on PATH | External | Green | Repo mode exits 2 |
| `node:sqlite` (Node 26.13.0 here) | Internal | Green | Database checks report not checked |
| `.skilled/hooks/env-secret-guard/cli/env-secret.cjs keys` | Internal | Green | Dotenv check reports not checked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The test fails after three fix rounds, or the script deletes anything outside a fixture during a test.
- **Procedure**: `git revert` the phase commit; the script is unwired, so nothing else changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, reads) | None | Implementation |
| Implementation (script, allowlist, test) | Setup | Verification |
| Verification (test, repo run, validate) | Implementation | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│   Script    │────►│   Verify    │
│  baselines  │     │ + allowlist │     │ test + run  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │   Test    │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Gate baselines | None | Results table in `implementation-summary.md` | Phase 002 |
| Script | None | `sweep-lane-residue.mjs` | Allowlist, test |
| Allowlist | Script's first repo run | `lane-residue-allowlist.json` | Test |
| Test | Script, allowlist | `sweep-lane-residue.vitest.ts` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Script repo mode** - 1 hour - CRITICAL
2. **Machine and apply modes** - 2 hours - CRITICAL
3. **Test suite** - 1 hour - CRITICAL

**Total Critical Path**: about 4 hours

**Parallel Opportunities**:
- The gate baselines and the script can run simultaneously
- The README row and the allowlist can be written after the first repo run
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines recorded | Every gate in research 5.1 has a recorded result | Setup |
| M2 | Script works | Repo mode exits 1 with the baseline count | Implementation |
| M3 | Phase ready | Test passes and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One script for the check and the cleanup

**Status**: Accepted

**Context**: The removal promises zero remnants, but a check must name what it looks for, so its vocabulary cannot be removed.

**Decision**: Put repo mode, machine mode and apply mode in one script, with one allowlist and one test, as research section 5.5 recommends.

**Consequences**:
- The vocabulary survives in exactly three files, each allowlisted with a reason.
- One script grows larger than the memory sweeper; exported functions keep it testable.

**Alternatives Rejected**:
- A separate cleanup script: a fourth file would carry the vocabulary.
- Extending `sweep-memory-residue.mjs`: its rg-based listing and glob allowlist do not fit tracked-file scope or exact paths.
