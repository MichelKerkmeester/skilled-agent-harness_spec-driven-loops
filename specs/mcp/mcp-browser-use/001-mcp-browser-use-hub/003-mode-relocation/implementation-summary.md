---
title: "Implementation Summary"
description: "Chrome DevTools and Aside now live in mcp-browser-use, mcp-tooling registers six modes, and the mutation guard sees the moved scripts. All eight acceptance criteria are met."
trigger_phrases:
  - "mode relocation implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation"
    last_updated_at: "2026-11-21T13:24:39Z"
    last_updated_by: "generate-context"
    recent_action: "Moved both packets, widened guard, rewrote paths; review APPROVED"
    next_safe_action: "Await operator choice on AC-002, then commit and regenerate cite-drift"
    packet_purpose: "Purpose: Both modes resolve from the new hub, `mcp-tooling` lists its six remaining modes, and no live file points at the old paths."
    blockers:
      - "AC-002 unmet: three residual old-path files"
    key_files:
      - ".skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml"
      - ".skilled/commands/doctor/scripts/check-mcp-mutation-class.sh"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/skills/mcp-tooling/mode-registry.json"
      - ".skilled/skills/mcp-browser-use/leaf-manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-003-mode-relocation"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "A1648179-07C5-45B2-B09D-870D47CC4F93"
      workspace: "/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub"
      savedAt: "2026-11-21T13:24:39Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions:
      - "Q1"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mode-relocation |
| **Completed** | 2026-11-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Chrome DevTools and Aside packets now live under `.skilled/skills/mcp-browser-use/` with their ids unchanged. `mcp-tooling` registers its six other modes. The pre-commit hook and the mutation-class guard send scripts under `mcp-browser-use/` to the guard, and the guard lists both packets' `install.sh` and `doctor.sh` as PASS at their new paths.

### Phase 3: mode-relocation

- **Guard first.** The new test case for `skills/mcp-browser-use/mcp-*` failed against the old guard (35 passed, 2 failed). After the widening it passes (37 passed). Both `skill_dir` values and the coverage comments now name the new hub.
- **Move.** Both stubs were backed up to `/tmp/mcp-browser-use-003-stubs.tgz` and deleted. Then `git mv` moved the real packets. The index holds 176 `R100` renames and nothing else from this phase.
- **Old hub.** The registry, router, root `ROUTER.md`, `SKILL.md`, `README.md`, `description.json`, feature catalog and playbook dropped both modes. `graph-metadata.json` lost the packets' entities, key files and source docs. Four browser scenarios were deleted, and the remaining scenarios no longer name the moved modes.
- **Paths.** Eight live outside files were rewritten. Inside the packets, 70 files were rewritten as unstaged edits, changelogs excluded: path strings, hub-name prose, and two cross-hub ClickUp references.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/git-hooks/pre-commit` | Modified | Hook regex sees `mcp-browser-use/` |
| `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | Modified | `HOOK_PATTERN`, two `DISCOVERY_GLOBS`, coverage comment |
| `.skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh` | Modified | New-hub discovery case |
| `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` | Modified | Both `skill_dir` values, header comment |
| `.skilled/skills/mcp-tooling/mcp-{chrome,aside}-devtools/` → `.skilled/skills/mcp-browser-use/` | Moved | `git mv`, staged pure renames; 70 files carry unstaged path and hub-name edits |
| `.skilled/skills/mcp-tooling/{mode-registry,hub-router,description,graph-metadata}.json`, `ROUTER.md`, `SKILL.md`, `README.md` | Modified | Drop both modes |
| `.skilled/skills/mcp-tooling/feature-catalog/` (3 files), `manual-testing-playbook/manual-testing-playbook.md`, two `hub-routing/` scenarios | Modified | Six-mode counts, browser rows removed |
| `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/{chrome-devtools-browser-debug,aside-browser-automation,holdout-browser-inspect,holdout-agentic-browser}.md` | Deleted | Browser scenarios leave the hub; 006 recreates them |
| `.skilled/bin/tests/mcp-installers.test.cjs`, `mcp-code-mode/scripts/README.md`, two `mcp-code-mode` playbook rows, `playbook-failclosed-allowlist.txt`, `figma-to-code.md`, `web-markup-and-css.md` | Modified | Path rewrites |
| Both `leaf-manifest.json`, trigger index and three retrieval fixtures, two sk-doc code-folder snapshots | Regenerated | See Generators below |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed `/speckit:implement:auto` in this worktree. Nothing was committed. The `@review` gate dispatch returned APPROVED with no P0 or P1 finding and three P2 suggestions, listed under Known Limitations.

### Generators

| Output | Command | Result |
|--------|---------|--------|
| `mcp-tooling/leaf-manifest.json`, `mcp-browser-use/leaf-manifest.json` | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write <hub>` | exit 0 for both |
| `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json` | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | exit 0; `--check` exits 0 afterwards |
| `durable-directory-manifest.json` | `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write` | exit 0; the plain run prints `manifest=reproducible` |
| `baseline-readme-verdicts.json` | `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py --write` | exit 0; the plain run prints `PARITY PASS` |
| `smart-router-measurement-{report.md,results.jsonl}` | Not run | They hold bare ids only, and the generator's default corpus is missing from this checkout |
| `cite-drift-redirects.json` | Not run | Reads `git log -M`; pending the operator's commit (D8) |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stage only the pure renames; keep in-packet edits unstaged | NFR-S01 asks for pure renames, and REQ-002 needs the in-packet path strings rewritten. Splitting index from worktree keeps both provable |
| Rewrite hub-name prose inside the packets | After the move, "the `mcp-tooling` hub picks this mode" is false |
| Leave the `mcp-figma` path reference | The operator fenced off the four sibling packets |
| Leave the old hub's version and changelog | Not named in this phase's scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Acceptance: 8 criteria, 8 Met, none waived. Checklist P0 7/7, P1 10/10. See [`acceptance-criteria.md`](acceptance-criteria.md).

| Check | Result |
|-------|--------|
| `jq '.modes \| length' .skilled/skills/mcp-tooling/mode-registry.json` | `6` |
| `rg -l 'mcp-(chrome\|aside)-devtools'` on the six old-hub files | no match, exit 1 |
| `rg -l 'mcp-tooling/mcp-(chrome\|aside)-devtools' .skilled` excluding changelog and benchmark reports | 3 files, see Known Limitations |
| `parent-skill-check.cjs` on both hubs | exit 0, `OK: parent-skill-check — all hard invariants passed, 0 warnings` |
| `check-mcp-mutation-class.test.sh` | exit 0, `Results: 37 passed, 0 failed` |
| `check-mcp-mutation-class.sh .` | exit 0, both packets' scripts PASS under `mcp-browser-use/` |
| `node --test .skilled/bin/tests/mcp-installers.test.cjs` | exit 0, 5 of 5 |
| `git diff -M --cached --name-status` | 176 `R100` from this phase |
| Browser testing | Not applicable: no browser was driven |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **AC-002 closed after this phase.** The three residual old-path files were rewritten later, so both `rg` runs now print nothing:
   - `system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json` and `sk-doc/shared/scripts/cite-drift-redirects.json`, on the operator's answer.
   - `mcp-tooling/mcp-figma/references/troubleshooting.md:488`, a broken old path. The operator's fence on the sibling packets covered their bare-id cross-references.
2. **`skill-root-metadata-contract.test.cjs` fails.** Its expected class map lacks `mcp-browser-use`. The 002 hub folder causes this, not the move, and no phase owns the fix yet.
3. **No test covers the hook regex.** Reverting `|mcp-browser-use/` at `pre-commit:632` would pass every test. The review suggests a hook test case for it.
4. **The old hub keeps eight-mode advisor vocabulary.** `graph-metadata.json` edge contexts, causal summary and trigger phrases, plus the advisor scorer lanes that send Chrome terms to `mcp-tooling`, are 005's.
5. **Compiled routing serves `legacy` for every hub in this worktree,** so no compiled replay was possible.
<!-- /ANCHOR:limitations -->

---
