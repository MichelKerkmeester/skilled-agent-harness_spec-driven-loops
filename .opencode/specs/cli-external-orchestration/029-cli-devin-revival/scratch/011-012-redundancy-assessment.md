# Redundancy Assessment: Phase 011 vs Phase 012 (cli-devin-revival)

**Assessed by**: @markdown (LEAF, depth 1, TASK #3 secondary redundancy check)
**Date**: 2026-07-27
**Verdict**: NOT redundant. Left as-is — no merge, no restructure.

## What each phase actually covers

### 011-hook-truth-and-runtime-readmes (Level 3, Complete)
Pure documentation/config reconciliation. Zero source-code files touched.

- Corrects current-state hook claims (six of eight lifecycle events fire under the
  corrected `.devin/hooks.v1.json` schema) across the parent spec, phases 004/006/008/010,
  handover, and `hook-testing-results.md` — while explicitly preserving tests 1-9 as
  superseded historical evidence (not deleting them).
- Refreshes seven Devin hook READMEs and three runtime discovery-mirror READMEs
  (`.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md`) to pass
  `validate_document.py`.
- Adds one missing Cursor discovery symlink (`.cursor/hooks/mcp-route-guard.mjs`) without
  touching `.cursor/hooks.json` execution wiring.
- Removes three obsolete Zed `context_servers` MCP registrations (`figma`, `web-to-mcp`,
  `spec_kit_memory`) that retained plaintext credentials, and corrects the `code_mode` path
  — a user-local, outside-git external config file.
- "Files to Change" table names only: spec docs, READMEs, one symlink, and
  `~/.config/zed/settings.json`. No `.mjs`/`.cjs`/`.ts` hook adapter source is listed or
  modified.

### 012-devin-hook-hardening (Level 2, Complete)
Pure runtime code hardening + new test coverage. Zero documentation-truth or external-config
content.

- Applies a uniform trim-and-fallback `projectDir` resolution
  (`typeof payload.cwd === 'string' && payload.cwd.trim() ? ... : DEVIN_PROJECT_DIR ||
  process.cwd()`) across 8 of the 10 Devin adapter source files (`.mjs`/`.cjs`/`.ts` under
  `system-spec-kit/`, `system-deep-loop/`, `mcp-code-mode/`, `system-code-graph/`,
  `cli-external-orchestration/cli-opencode/`).
- Adds a `payload?.cwd` fallback to `completion-evidence-stop.cjs`, which previously
  hardcoded `process.cwd()`.
- Builds a brand-new process-level test suite (`spec-gate-devin.test.mjs`, 10/10 rows)
  covering malformed input, missing identity, disabled/child session, whitespace cwd, and
  terminal-state preservation — mirroring the Cursor prebind matrix. No test suite for the
  Devin surface existed before this phase.
- Trims a stale 8-line "STATUS: LIVE" historical comment block to a one-liner in 9 adapters
  (pure comment hygiene, orthogonal to both the fallback fix and 011's doc work).
- Explicitly out of scope: "Modifying any shared core" and "Changing the Devin envelope
  shape or the registration schema" — i.e., this phase never touches what 011 touches.

## Why they don't overlap (evidence, not assertion)

1. **Disjoint file sets.** 011's "Files to Change" table and 012's "Files to Change" table
   share zero paths. 011 touches spec docs, READMEs, a symlink, and an external Zed config.
   012 touches 10 adapter source files plus one new test file. Confirmed by direct read of
   both `spec.md` "Files to Change" tables (011 `spec.md:96-107`, 012 `spec.md:82-100`).
2. **Disjoint problem classes.** 011 solves "current docs contradict verified live
   behavior" (a documentation-truth problem) plus a security cleanup (leaked credentials in
   an external, non-git config). 012 solves "adapter code has an inconsistent
   whitespace-cwd edge case and zero process-level test coverage" (a code-robustness
   problem). These are different failure modes with different fixes.
3. **Sequential dependency, not overlap.** 012's predecessor table names 011 as
   "sequential" (ordering only) and phase 008 as the actual content dependency ("built the
   adapters this phase hardens"). 012's own risk register treats phase 008, not 011, as the
   thing it extends. There is no shared requirement, shared acceptance criterion, or shared
   file between 011 and 012 — only packet adjacency (both are Devin-hook-adjacent siblings,
   which is expected and explicitly called out in the task brief as *not* evidence of
   redundancy on its own).
4. **Different verification gates.** 011's checklist gates on `validate_document.py`
   (11 READMEs), a symlink/`cmp` check, and a JSONC assertion on Zed settings. 012's
   checklist gates on `node --check`, a new `node --test` suite (10/10), and confirming
   `git diff --stat` is empty on 6 shared cores. No shared verification artifact.
5. **Independently substantial.** 011 is Level 3 (complexity 75/100, 21+24+8 checklist
   items, a decision-record with a 3-way alternatives comparison). 012 is Level 2
   (complexity 22/70, 8+8 checklist items). Both stand on their own as complete, gated,
   evidence-backed units of work — neither is a stub or a near-duplicate of the other.

## Comparison to the Cursor precedent (why this case is different)

Per the task brief, genuine redundancy would look like real content overlap: the same
files edited for the same reason, or one phase's spec restating another's requirements.
That is not present here. 011 and 012 are complementary but structurally independent —
one is "make the docs/config say true things," the other is "make the code more robust and
add tests for it." Nesting them under a Phase Parent (per the `027-cli-codex-revival`
`CONTENT DISCIPLINE: PHASE PARENT` pattern) would be scope-inflation without a real shared
concern to consolidate around; it would also require inventing an artificial parent-vs-child
split of two already-complete, already-independently-verified Level 2/3 packets whose docs
carry different SPECKIT_LEVEL values (2 vs 3) and different verification gate sets.

## Decision

Leave 011 and 012 exactly as they are. No `git mv`, no restructuring, no metadata
regeneration. No files outside this scratch note were written or modified.
