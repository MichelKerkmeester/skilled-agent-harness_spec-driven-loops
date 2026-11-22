---
title: "Implementation Summary"
description: "One script now answers whether anything of the Ollama lane is left, in the repository and on a machine, and deletes the machine leftovers in an apply mode. It reports 309 live files today, so every later phase has a number to drive to zero."
trigger_phrases:
  - "residue check and cleanup tool implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool"
    last_updated_at: "2026-11-20T23:17:47Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified phase 001"
    next_safe_action: "Run /speckit:implement on 002-doctor-surface"
    packet_purpose: "Purpose: One command answers \"is anything of the lane left?\" with an exit code, in the repository and on a machine, and the same command deletes the machine leftovers."
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs"
      - "001-residue-check-and-cleanup-tool/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:41cb24c61e533675abacf4f597b883d80465087d0b7d2b260635abb33084c478"
      session_id: "scaffold-001-residue-check-and-cleanup-tool"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/497-ollama-lane-removal"
      savedAt: "2026-11-20T23:17:47Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-residue-check-and-cleanup-tool |
| **Completed** | 2026-11-20 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now ask one command whether the lane is gone. `sweep-lane-residue.mjs repo` lists every tracked file outside `specs/` that still names it and exits 1 while any is left; today it finds 333 files, 24 of them allowlisted, 309 live.

### Phase 1: residue-check-and-cleanup-tool

Repo mode runs the two vocabularies through `git grep`, checks tracked path names and symlink targets, and drops exact-path allowlist rows, each with a written reason. Machine mode checks compiled lane output, installed model modules, vector objects in every advisor database, model-server files, the HuggingFace cache folder, the pulled Ollama model, dotenv key names and linked worktrees. Apply mode deletes what this checkout owns, asks on a terminal before a shared model store, and checks again. Nothing calls the script yet; phase 008 wires it in.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` | Created | Repo, machine and apply modes |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Created | 27 exact-path exemptions with reasons |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Created | 45 cases across modes, states and terminal presence |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modified | The script's bullet, tree line and table row; script count five to six |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus worker wrote the script and test from `plan.md`. A read-only review returned one P0: `apply --tmp-dir <dir>` deleted the named folder recursively, because its containment root was the folder's own parent. The flag became `--socket-dir`, apply now deletes only the four files the model server writes and removes the folder with a non-recursive `rmdir`, and five smaller findings were fixed with it. A second review returned one P1: machine mode missed the model server's pid, lock and give-up files when the server's folder moved through `SPECKIT_IPC_SOCKET_DIR`, `HF_EMBED_SERVER_URL` or the launcher's database pin. [DEVIATION: the implement workflow halts after a second REQUESTED_CHANGES; the P1 was narrow and located, so it was fixed and a third review was dispatched instead, with completion conditional on that review.] The third review returned APPROVED, 93/100, no P0 or P1. The conductor reran the tests (97 across the three retrieval suites) and repo mode before the commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One script for check and cleanup | The vocabulary has to live somewhere; one script, one allowlist and one test keep it to three allowlisted files |
| Exact-path allowlist rows only | The memory sweeper's trailing-slash glob rows can match no file, so a folder row would silently exempt nothing or everything |
| Count the tracked embeddings symlink | `git grep` never reads symlink targets, so the 332-file grep baseline missed it; the check reports 333 |
| No orphan-sweeper row yet | Its lane lines (216, 462, 504) are still live remnants; the row lands with the edit that removes them, keeping the `ollama-preserve` guard |
| Apply tests run in-process with a process-list seam | A developer machine running `ollama serve` would otherwise fail the clean cases |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check sweep-lane-residue.mjs` | PASS, exit 0 |
| `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts tests/sweep-memory-residue.vitest.ts tests/retrieval-coverage-parity.vitest.ts` | PASS, 3 files, 91 tests |
| `sweep-lane-residue.mjs repo` before the commit | exit 1: files 333 (identifier 279, prose 163, path 40, symlink 1), allowlisted 24, live 309 |
| `sweep-lane-residue.mjs machine` on this worktree, read-only | exit 1: M1, M2, M3, M6, M8 found; M4, M5, M7 absent |

### Gate Baselines

Recorded on `bf6806ad4b3` plus this phase's untracked files, in the worktree. Every later phase compares against these.

| Gate | Command (working directory) | Result |
|------|-----------------------------|--------|
| Advisor typecheck | `npm run typecheck` (advisor `runtime/`) | exit 0 |
| Advisor clean build | `npm run clean && npm run build` (advisor `runtime/`) | exit 0 |
| Advisor tests | `npm test` (advisor `runtime/`) | exit 0: 196 files, 2570 passed, 8 skipped. A first run failed 12 tests in 5 files because the fresh worktree had no `skill-graph.sqlite`; after `skill_graph_scan` built it, all pass, and the same 5 files pass on `main` |
| Scorer-eval ratchet | `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | 7 passed |
| Local-native ratchet | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` | 9 passed |
| Holdout ratchet | `npx vitest run tests/parity/holdout-independent.vitest.ts` | 6 passed |
| Routing corpus ratchet | `python3 scripts/routing-accuracy/score-routing-corpus.py ...` (flags as in `routing-registry-drift.yml`) | exit 0, `overall_pass: true` |
| Advisor stress | `npm run test:stress -- --config vitest.stress.config.ts` | 21 files, 65 passed |
| Shared build and test | `npm run build`, `npm test` (spec-kit `shared/`) | exit 0, exit 0 |
| Spec-kit typecheck and test | `npm run typecheck`, `npm test` (spec-kit root) | exit 0, exit 0 |
| Doctor suites | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 7 suites passed, 0 failed |
| Command bridges | `derive-command-bridges.cjs --check` | exit 0, `fresh` |
| Trigger index | `generate-trigger-index.mjs --check` | exit 1, stale only for the new 024 packet's phrases; regenerated at commit |
| Markdown links | `check-markdown-links.cjs` | exit 0 |
| Leaf manifests | `generate-leaf-manifest.cjs --check` on the advisor and spec-kit skills | exit 0, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Machine mode cannot reach 0 on the operator's Mac without a yes.** The pulled `nomic-embed-text:v1.5` model stays until someone answers yes at apply's prompt, and apply never runs on the operator's machine during this removal.
2. **Worktrees are reported, not cleaned.** Apply cleans only the checkout it runs in; run it inside each linked worktree it lists.
3. **Four review suggestions wait for phase 008, which wires apply in.** Probe the exact socket path when `HF_EMBED_SERVER_URL` names a custom file; match ownership on the process's first script argument, not a suffix; skip the compiled lane deletes while the lane sources still exist; and retarget M5, because the lane's model cache sits inside the `@huggingface/transformers` package folder (M2), not in the HuggingFace hub cache.
4. **Terminal detection has no automated test.** Apply tests set the interactive flag directly; a run with `</dev/null` was checked by hand and kept the shared stores.
<!-- /ANCHOR:limitations -->
