---
title: "Implementation Summary: Shared package post-remediation cleanup"
description: "The shared package's manifest no longer names a deleted entry, the ownerless database cluster, type and scoring module are gone, the README's reader table is generated from the code, the socket file name is held by a test, and the two untested utilities have tests."
trigger_phrases:
  - "shared cleanup summary"
  - "what shipped shared cleanup"
  - "main field removed"
  - "reader table generated"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/015-shared-package-post-remediation-cleanup"
    last_updated_at: "2026-09-07T07:05:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with lane 004's second round"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/package.json"
      - ".opencode/skills/system-spec-kit/shared/README.md"
    session_dedup:
      fingerprint: "sha256:3b85aaacb8a6c1ff8bdae75a628d878457634fd7a137e8a2bdf4982d0a7c8f22"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Shared package post-remediation cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-shared-package-post-remediation-cleanup |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared-package lane's second round confirmed that child 009 had landed and then walked its edges. The manifest still declared an entry file the removal had deleted; a five-function database cluster survived in the profile module because its only caller was gone; an extended profile type had no consumer; the folder-scoring module survived with two tests as its only readers. All four are gone, with the two tests, the scoring README and the two comments that cited the module.

### Documents and tests that match the code

The README's reader table is now generated from the files that read each variable group, which added the adapter to the Ollama row, the factory and profile to the HF row and the profile to the OpenAI row; its config row says how the telemetry store and the factory's candidates resolve differently instead of implying one resolution. The socket file name is exported from the server and a test holds the two bin scripts that spell it as a literal to that name. The JSONC stripper and the context-type canonicalizer have their first tests. A test comment no longer names a removed file, a CLI module no longer re-exports a shared helper for one test, and the sk-doc README baseline no longer expects verdicts for two READMEs this program removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/package.json` | Modified | `main` removed; empty test glob removed |
| `shared/embeddings/profile.ts`, `shared/types.ts` | Modified | Database cluster and extended type removed |
| `shared/scoring/` and two runtime tests | Deleted | Test-only module |
| `runtime/lib/utils/index-scope.ts`, `runtime/tests/index-scope.vitest.ts` | Modified | Comments |
| `shared/ipc/socket-server.ts`, `shared/ipc/socket-server.test.ts` | Modified | Exported name; assertion over the bin scripts |
| `shared/utils/jsonc-strip.test.ts`, `shared/context-types.test.ts` | Created | First tests |
| `shared/predicates/boolean-expr.test.ts`, `runtime/cli/core/tree-thinning.ts`, `runtime/cli/tests/tree-thinning.vitest.ts` | Modified | Comment; re-export; import |
| `shared/README.md` | Modified | Reader table, config row, structure |
| sk-doc `baseline-readme-verdicts.json` | Modified | Two rows dropped |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every row was re-checked in the main checkout first: consumer counts by search across the skill, the bin scripts and the advisor; file existence for the manifest entry; the parity test's own output for the baseline rows. The removals went first so three builds would confirm them, and they did. The README table was generated rather than typed. The new tests and the assertion follow the package's script-style helper; a first draft used Node's assert module, which the package's tests do not, and was rewritten. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave both Ollama implementations | Both are live paths in the skill advisor's embedding stack; a merge is that skill's refactor and loses nothing by waiting |
| Leave the root resolvers | Hooks cannot import the workspace package, the compiled CLI cannot import the ESM module synchronously, and the generator stays dependency-free; the copies are boundaries |
| Keep the factory's candidate scan | It reads the advisor's active embedder from its sqlite; only the cluster nothing called went |
| Generate the reader table | A typed table omitted three readers; a generated one cannot |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Shared `tsc --build --force`; `npm test` | Exit 0; 12 pass, 0 fail, the two new tests among them |
| CLI rebuild; `npm run check`; runtime build; dist freshness | All exit 0; every watched output fresh |
| tree-thinning and index-scope suites | 28 and 7 passed |
| Residue search for the removed names | Only changelogs |
| sk-doc validator on the README | Exit 0 |
| sk-doc parity test | No longer names either removed README. The 36 mismatches this row once recorded under other skills' READMEs grew to 113 as READMEs were removed, moved or excluded as fixtures; the closure program's child 016 regenerated the baseline on 2026-09-07 and the test reports zero |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The sk-doc parity test still fails** on 36 rows under sk-design, fixture and archived READMEs whose verdicts changed with that skill's validator; none is under this package.
2. **The Ollama duplication stays** by decision; the README's reader table now shows both files, so the duplication is at least visible.
<!-- /ANCHOR:limitations -->

---
