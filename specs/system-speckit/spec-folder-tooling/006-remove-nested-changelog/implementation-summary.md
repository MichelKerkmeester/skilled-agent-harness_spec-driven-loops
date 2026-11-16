---
title: "Implementation Summary"
description: "The deprecated nested spec changelog generator, its test, templates and docs are gone. The save path, the kept packet changelogs and the refusal route still work."
trigger_phrases:
  - "remove nested changelog implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/006-remove-nested-changelog"
    last_updated_at: "2026-11-15T10:06:01Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed review findings; second review approved"
    next_safe_action: "Commit the removal, then run voice-rewrite phase 002"
    packet_purpose: "Purpose: The deprecated generator and everything that only serves it are gone."
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec-folder/index.ts"
      - ".skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json"
    session_dedup:
      fingerprint: "sha256:e5cb479a9429c8b58043df3d42428ed34c0e38d49e3eb53ca6fb1bf3b4ea445e"
      session_id: "scaffold-006-remove-nested-changelog"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "079f7de2-cb32-4e35-b608-1c6f6425d281"
      workspace: "/Users/michelkerkmeester/worktrees/public/401-changelog-voice-rewrite"
      savedAt: "2026-11-15T10:06:01Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-remove-nested-changelog |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The nested spec changelog generator is gone, along with its test, its templates and every doc row that pointed at it. Nothing called it after the deprecation, so the save path and the 1410 packet changelogs already written work as before.

### Remove the unused nested spec changelog generator, templates and docs

A request for a packet changelog still reaches sk-create-changelog. Its `packet_local` route refuses the request and offers a global component entry, as it did after the deprecation. The packet changelogs already in `specs/` stay as history and still pass `validate_document.py`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/spec-folder/nested-changelog.ts`, `runtime/cli/tests/nested-changelog.vitest.ts` | Deleted | The generator and its 13 tests |
| `runtime/cli/spec-folder/index.ts` | Modified | Drops the import and the three re-exports |
| `runtime/cli/core/spec-root-registry.ts`, `retrieval/fixtures/residue-allowlist.json` | Modified | Drop the rows for the deleted files |
| `templates/changelog/` (README, phase, root), `references/workflows/nested-changelog.md` | Deleted | Read only by the generator |
| system-spec-kit `ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json` | Modified | Drop the route to the deleted reference |
| system-spec-kit feature catalog and playbook entries | Deleted, index rows removed | Described the generator |
| sk-create-changelog CHG-012 and its index rows | Deleted | Tested the generator's search phrase |
| system-spec-kit and sk-create-changelog docs (README, SKILL, references, templates README, CONTRACT, quick reference, template guide, validation rules, folder structure, level specifications, spec-folder README, worked examples, changelog template) | Modified | Say the generator is removed and the kept files are history |
| `system-spec-kit/changelog/v2.13.3.0.md`, `sk-create-changelog/changelog/v1.5.3.0.md`, `sk-doc/changelog/v2.9.16.0.md` | Created | Release entries, with version bumps in SKILL.md and the sk-doc hub JSON files |
| sk-doc `durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modified | Drop the deleted README directory |
| sk-doc activation manifest, both copies | Modified | New policy hash after the hub version bump |
| `sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | Says the nested generator is removed |
| `runtime/data/trigger-index.json` and retrieval fixtures | Regenerated | Stop indexing the deleted docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline suites ran first and their counts went to `scratch/baseline.txt`. The code went next, then the docs, then the derived files. The same suites ran again into `scratch/after.txt`, and the REQ-001 search, the REQ-003 count and the routing checks ran last. Nothing is pushed. The work sits uncommitted in worktree 401.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the `packet_local` refusal route and the "nested changelog" routing keywords | A request for a packet changelog must still land somewhere that refuses it, so it is never routed to the global writer by mistake |
| Keep the packet changelogs in `specs/` | They record past work, and `validate_document.py` still checks them |
| Re-mint only the activation manifest hash, at the same generation, once per commit | The hash covers every sk-doc mode `SKILL.md` and the hub JSON files, so it moved with this packet's version bumps and with the voice-rule change in `sk-create-with-human-voice/SKILL.md` from the voice-rewrite packet. A stale hash makes sk-doc fall back to legacy routing with no error. Each of the two commits carries the hash of its own tree. Commit `d6e0af332c0` set the precedent of a hash-only change |
| Leave released changelogs unchanged | They describe what shipped at the time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CLI build | `npm run build` exit 0; `check-source-dist-alignment` passes |
| vitest `cli` | Second full run: 2 failed, 2598 passed, 20 skipped (2620). Baseline was 2 failed, 2611 passed (2633). The 13-test drop is the deleted file, and the two failures are the same. A first run also failed `validate-runs-every-registry-rule.vitest.ts`, which passed alone and in the second run |
| `test:legacy`, `test:validation` | 27/0 and 12/12, as in the baseline |
| sk-doc pytest | 443 passed, as in the baseline |
| README guards | `test_readme_manifest.py` reproducible; `test_readme_verdict_parity.py` PARITY PASS |
| Card sync, playbooks | CARD SYNC OK; both playbook validators PASS |
| sk-doc compiled routing | `compiled-route-manifest.test.cjs` 48/48; sync check 55/55; "write a changelog" routes compiled to sk-create-changelog |
| REQ-001, REQ-003 | Search finds only two history files; packet changelogs 1410 |
| Save path | `generate-context.js --help` exit 0 |
| Strict validation | `validate.sh --strict` RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The REQ-001 search still finds two history files.** The released note `.skilled/changelog/skilled/v3+/v3.2.1.0.md` sits under `v3+/`, which the `**/changelog/v*` glob misses. The recorded log `runtime/cli/observability/smart-router-measurement-results.jsonl` holds one old measurement line. Both are history and stay unchanged.
<!-- /ANCHOR:limitations -->


---


