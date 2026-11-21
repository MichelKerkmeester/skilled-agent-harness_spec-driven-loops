---
title: "Implementation Summary"
description: "The shared embeddings package, the HF model server and its supervision, and the transformers dependency are deleted; lockfiles are regenerated offline. Only the operator's npm ci reinstall is left."
trigger_phrases:
  - "shared embeddings package implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package"
    last_updated_at: "2026-11-21T00:00:00Z"
    last_updated_by: "plan-author"
    recent_action: "Planned the phase: spec, plan, tasks and acceptance criteria"
    next_safe_action: "Run /speckit:implement after phase 004 lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-shared-embeddings-package"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 005-shared-embeddings-package |
| **Completed** | 2026-11-21, when T053 closed after the operator's `npm ci` |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No code in the repository can load a model any more. The shared embeddings package with `chunking.ts` and `utils/retry.ts`, the HF model server, its supervision library and the sidecar env allowlist are deleted, the launcher stops spawning and supervising the server, and `@huggingface/transformers` leaves every manifest and lockfile; the residue check's live count fell from 172 to 100.

### Phase 5: shared-embeddings-package

The launcher keeps its daemon, lease and IPC behavior and no longer forwards `MEMORY_DB_PATH` or `HF_EMBED_SERVER_URL`. The IPC bridge loses only its model-server probe, so `resolveIpcSocketDir` stays for the daemon and the residue check. The doctor orphan check drops its model-server class with a recomputed held-out digest, the orphan sweeper drops its model-server lines and keeps the `ollama-preserve` guard behind an exact-path allowlist row, the sk-doc model-reference validator goes, and 22 CI workflows lose the ONNX runtime setting. The three lockfiles were regenerated with `npm install --package-lock-only --offline --ignore-scripts`, which installs nothing; the operator's `npm ci` reinstalled `node_modules` afterwards (T053).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/shared/embeddings/` (14 files), `shared/chunking.ts`, `shared/utils/retry.ts` and 6 shared tests | Deleted | The embeddings package and the helpers only it used |
| `.skilled/bin/hf-model-server.cjs`, `.skilled/bin/lib/model-server-supervision.cjs`, `sidecar-env-allowlist.cjs` | Deleted | The model server and its supervision |
| 27 spec-kit runtime tests, the advisor model-server default test | Deleted | Tests of deleted code |
| `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/bin/lib/launcher-ipc-bridge.cjs` | Modified | Model-server spawn, supervision, probe and env forwarding removed |
| `.skilled/skills/system-spec-kit/shared/types.ts`, env table script | Modified | Embedding types removed first so the deletion compiles |
| Doctor orphan check, its test, fixtures, route phrase; regenerated bridges | Modified | Model-server class removed; held-out digest recomputed |
| `.skilled/scripts/orphan-mcp-sweeper.sh`, `lane-residue-allowlist.json` | Modified | Model-server lines removed; guard kept with an allowlist row |
| sk-doc `validate-doc-model-refs.js`, `embedder-pluggability.md` | Deleted | Validator and reference for the deleted package |
| Two `package.json` files, three `package-lock.json` files | Modified | Dependency removed; lockfiles regenerated offline |
| 22 `.github/workflows/*.yml` | Modified | ONNX runtime setting removed |
| READMEs naming deleted files, `launcher-ipc-bridge-probe.vitest.ts` | Modified | References and a test type updated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus worker edited `shared/types.ts` first, then deleted the package and its callers in `tasks.md` order on top of `cf702d3fb9e`, regenerated the lockfiles offline and ran every gate after a clean build. A read-only review returned APPROVED at 97/100 with three suggestions; the conductor added the missing `resolveIpcSocketDir` type to the bridge probe test and left the advisory job's name to the operator, because a branch rule may require the check by that name. The conductor reran fourteen gates from the final tree before the commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regenerate lockfiles offline and leave `npm ci` to the operator | Reinstalling `node_modules` is an install, which needs the operator's yes; the lockfile-only command installs nothing |
| Read goal criterion 4 with the residue check excluded | The check must name the dependency to find it; the parent objective exempts the check's own files (ADR-011) |
| Keep the IPC bridge, drop only its model-server probe | The daemon and the residue check's machine mode both call `resolveIpcSocketDir` |
| Stop forwarding `MEMORY_DB_PATH` | Its only readers were the deleted factory and local embedder |
| Remove the sweeper's model-server lines here | They classify the server this phase deletes; the `ollama-preserve` guard stays (decision D4) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-kit `shared/` build and test | exit 0, 9 of 9 |
| Spec-kit typecheck, build and test | exit 0; CLI project 210 files and 2644 passed, the same as at the start |
| Advisor typecheck, clean build and test | exit 0: 177 files, 2438 passed, 4 skipped, one file and 18 cases fewer, rerun by the conductor |
| Advisor stress | 21 files, 65 passed |
| Parity ratchets, golden prompts and slice, corpus gate | 22 passed, 51 passed, corpus byte-identical; rerun by the conductor |
| Nine score baseline files | no diff |
| `run-all.sh` | 7 suites, 1417 tests, held-out top1 0.851 and top3 0.915 |
| `.skilled/bin` vitest | 8 files, 95 passed |
| sk-doc script tests, mirror check, link check, leaf manifests | passed, 260 in sync, 0 broken, OK |
| `git grep -l "@huggingface/transformers"` outside specs and the residue check | prints nothing |
| `git grep -n ollama-preserve` in the sweeper | the guard at line 488 |
| `sweep-lane-residue.mjs repo` | exit 1: 130 files, 30 allowlisted, 100 live (was 172) |
| Lockfile diff | 3 files, 2121 lines removed; no package entry added |
| `npm ci` (T053) | exit 0 in the three packages, by the conducting session's report; `@huggingface` and `onnxruntime-node` absent; both typechecks exit 0; shared tests 9 of 9 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reinstall's flags are not on record here.** The conducting session reports that `npm ci` exited 0 in `.skilled/skills/system-skill-advisor/runtime`, `.skilled/skills/system-spec-kit` and `.skilled/skills/system-deep-loop`, but not whether `--offline --no-audit --no-fund` were passed. To undo, check out the previous lockfiles and run `npm ci --offline` again. The phase's suites ran against the old `node_modules`; the typechecks and the shared tests were rerun after the reinstall (T053), and a grep of all 77 removed package names finds no surviving import.
2. **A model server left running from an older checkout is no longer recognized by the orphan check.** The residue check's machine mode still reports it, and phase 008 wires the cleanup.
3. **The advisory CI job's name still mentions doc-model references.** Renaming it could break a branch rule that requires the check by name, so it is the operator's call.
<!-- /ANCHOR:limitations -->
