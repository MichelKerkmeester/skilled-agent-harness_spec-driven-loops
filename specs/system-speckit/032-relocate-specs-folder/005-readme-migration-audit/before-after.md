---
title: "Before vs After: README Migration Audit"
description: "Literal before/after content for all 20 findings the dual-executor deep-review confirmed, pulled directly from the two shipping commits — not summarized, the real diff text."
trigger_phrases:
  - "readme migration audit before after"
  - "specs root migration diff"
importance_tier: "normal"
contextType: "reference"
---

# Before vs After: README Migration Audit

Every row below is the literal text that changed, pulled from `git show` on the two commits that shipped this phase — not a paraphrase. Commits: `bbb156b7e7b` (18/20 findings, F001-F019) and `8cb906322c` (the remaining F012 and F020, fixed on request after an initial deferral).

**Context**: `003-migration-execution` flipped the specs-root topology — `specs/` is now the canonical physical tree, `.opencode/specs` is a relative symlink (`.opencode/specs -> ../specs`) kept for backward compatibility. This audit found 20 places where docs and two guard scripts still described or enforced the *pre-flip* layout.

---

## 1. CANONICAL-ROOT EXAMPLES (F001, F004, F006, F007, F008, F010, F011, F012)

Command examples and pointers that told a reader to use the legacy path. Straight prefix swap, `.opencode/specs/` → `specs/`, no logic change.

| Finding | File:Line | Before | After |
|---|---|---|---|
| F001 | `system-spec-kit/README.md:128` | `bash .../validate.sh .opencode/specs/[project]/042-my-feature/` | `bash .../validate.sh specs/[project]/042-my-feature/` |
| F001 | `system-spec-kit/README.md:661-663` | `ls -la .opencode/specs/[project]/NNN-feature/` (+2 more lines) | `ls -la specs/[project]/NNN-feature/` (+2 more lines) |
| F001 | `system-spec-kit/README.md:701-702` | `bash .../calculate-completeness.sh .opencode/specs/[project]/NNN-feature/` | `bash .../calculate-completeness.sh specs/[project]/NNN-feature/` |
| F001 | `system-spec-kit/README.md:748` | `bash .../upgrade-level.sh .opencode/specs/[project]/NNN-feature/ 2` | `bash .../upgrade-level.sh specs/[project]/NNN-feature/ 2` |
| F004 | `scripts/kpi/README.md:67` | "The optional argument is a spec-folder path relative to `.opencode/specs/`." | "...relative to `specs/`." |
| F006 | `sk-design-md-generator/README.md` (3 examples) | `--output .opencode/specs/<track>/<packet>/output` | `--output specs/<track>/<packet>/output` |
| F006 | `sk-design-md-generator/backend/README.md` (7 examples) | `.opencode/specs/<track>/<packet>/output/tokens.json` (extract/build-prompt/validate, x7) | `specs/<track>/<packet>/output/tokens.json` |
| F007 | `sk-create-benchmark/references/shared/README.md:23` | "the spec packet under `.opencode/specs/`" | "the spec packet under `specs/`" |
| F008 | `bin/lib/README.md:58` | "Change the authored program directory under `.opencode/specs/` instead" | "...under `specs/` instead" |
| F010 | `README.md:1303` (repo root) | link href `.opencode/specs/system-speckit/026-.../implementation-summary.md` | link href `specs/system-speckit/026-.../implementation-summary.md` |
| F011 | `deep-alignment/assets/conformance-benchmark/README.md:34,66` | `--spec-folder .opencode/specs/system-deep-loop/035-command-surface-benchmark/...` | `--spec-folder specs/system-deep-loop/035-command-surface-benchmark/...` |
| F011 | `sk-design/styles/scripts/README.md:112` | `` `.opencode/specs/sk-design/010-sk-design-styles-from-refero/` `` | `` `specs/sk-design/010-sk-design-styles-from-refero/` `` |
| F011 | `mcp-server/hooks/cursor/README.md:71` | link + href both `.opencode/specs/cli-external-orchestration/030-.../decision-record.md` | both canonicalized to `specs/cli-external-orchestration/030-.../decision-record.md` |
| F011 | `mcp-server/hooks/devin/README.md:62-63` | 2 links + hrefs, `.opencode/specs/cli-external-orchestration/029-.../hook-testing-results.md` + `.../decision-record.md` | both canonicalized |
| F011 | `mcp-server/database/migrations/README.md:139` | "umbrella under `.opencode/specs/system-speckit/026-...`" | "umbrella under `specs/system-speckit/026-...`" |
| — (discovery) | `.devin/hooks/README.md:52` | link href `../../.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md` | link href `../../specs/cli-external-orchestration/...` — found in a follow-up census re-run, same class as F010/F011, not in the review's original 20 |
| F012 | `commands/create/README.txt:160` | `/create:changelog .opencode/specs/01--system-spec-kit/042-memory-upgrade :auto` | `/create:changelog specs/01--system-spec-kit/042-memory-upgrade :auto` |
| F012 | `commands/memory/README.txt:323` | "Check canonical spec docs under `.opencode/specs/`..." | "...under `specs/`..." |

---

## 2. INVERTED OR CONTRADICTORY CLAIMS (F002, F003, F005, F018, F019)

These weren't just stale — they described the *wrong order*, or contradicted the code they were documenting.

### F002 — `scripts/core/README.md:142`, contradicted shipped code

**Before**: "resolves the active specs directories canonical-first (`.opencode/specs` before legacy `specs`, with legacy read fallback)"
**After**: "resolves the active specs directories canonical-first (`specs` before legacy `.opencode/specs`, with legacy read fallback)"

The real order, straight from `config.ts:321-326`: `['specs', '.opencode/specs']`. The doc had it backwards — not just outdated, actively wrong about which root wins.

### F003 — `scripts/sweep/README.md:12`, inverted labels

**Before**: "walks every spec folder under `.opencode/specs` (and legacy `specs`)"
**After**: "walks every spec folder under `specs` (and legacy `.opencode/specs`)"

### F018/F019 — `system-spec-kit/README.md:846`, missing the compat-symlink note entirely

**Before**: `| .opencode/specs/ | all spec folders created by Spec Kit |`
**After**: `| specs/ | all spec folders created by Spec Kit (\`.opencode/specs\` is a compat symlink to this same tree) |`

This was the only reference-table row naming the canonical root at all, and it named the wrong one with no mention that `.opencode/specs` is now just an alias. Fixing it closed both F018 (family inconsistency vs. `templates/README.md`, which was already correct) and F019 (no live README explained the symlink relationship) in one edit.

### F005 — `mcp-server/README.md:109` + `mcp-server/benchmarks/README.md` (historical rows preserved)

**Before**: "`includeSpecDocs=true` for `.opencode/specs/` documents"
**After**: "`includeSpecDocs=true` for `specs/` documents"

`benchmarks/README.md`'s frontmatter description and "not the authoritative audit trail" prose were fixed the same way. Its **dated benchmark-run table rows** (May 17/20 2026, pointing at `.opencode/specs/system-speckit/026-.../004-spec-memory-embedder-bake-off/`) were deliberately left untouched — those describe the topology as it existed on those real historical dates, and rewriting them would misrepresent the record.

---

## 3. FUNCTIONAL FIXES — TWO GUARD SCRIPTS THAT ENFORCED THE OLD TOPOLOGY (F013, F017)

Everything above is prose. These two are code, and both had a real behavioral gap — not just a stale comment.

### F013 — `check-no-spec-imports.cjs`: the durable no-spec-import guard only checked the legacy alias

**Before**:
```js
const SPECS_ROOT = path.join(REPO_ROOT, '.opencode', 'specs');
...
function underSpecs(abs) {
  const rel = path.relative(SPECS_ROOT, abs);
  return rel === '' || (Boolean(rel) && !rel.startsWith('..') && !path.isAbsolute(rel));
}
```

**After**:
```js
// specs/ is the canonical physical tree; .opencode/specs is a compat symlink
// alias to it. path.resolve() is lexical and never follows symlinks, so an
// import written against either form must be checked against its own root —
// checking only one root lets an import through the other spelling.
const SPECS_ROOTS = [
  path.join(REPO_ROOT, 'specs'),
  path.join(REPO_ROOT, '.opencode', 'specs'),
];
...
function underSpecs(abs) {
  return SPECS_ROOTS.some((root) => {
    const rel = path.relative(root, abs);
    return rel === '' || (Boolean(rel) && !rel.startsWith('..') && !path.isAbsolute(rel));
  });
}
```

**What this actually meant, before the fix**: a runtime file under `.opencode/bin/` could `require('../../specs/...')` — the real, canonical path — and this guard would never catch it, because `path.relative()` is a lexical string operation that never follows symlinks. It only compared against `.opencode/specs`, a lexically different string even though both point at the same files on disk. A single-root check structurally cannot catch both spellings; this is why the fix is an array checked with `.some()`, not a swapped constant.

**Verified two ways**: both no-spec-import fixtures still behave correctly post-fix (positive fixture fails with the expected violation, negative fixture stays clean), and a `git stash` A/B on just this file confirmed the one violation the fixed guard now surfaces elsewhere (`compiled-route-guard.cjs:41`) is pre-existing — it fires identically under the original unmodified code, so it's a separate, out-of-scope issue, not something this fix introduced.

### F017 — `memory-drift-marker.sh`: the drift-marker pathspec pointed at the symlink, not the tree

**Before**:
```bash
diff_output="$(git diff-tree --no-commit-id -r -M --name-status "$@" -- .opencode/specs 2>/dev/null || true)"
```

**After**:
```bash
diff_output="$(git diff-tree --no-commit-id -r -M --name-status "$@" -- specs 2>/dev/null || true)"
```

**What this actually meant, before the fix**: `git diff-tree`'s pathspec is a literal string match against tracked paths. `.opencode/specs` is now a single symlink blob (git mode `120000`) — one tracked entry. A pathspec of `-- .opencode/specs` matches changes to *that symlink entry itself*, never to any file inside the real `specs/` tree it points at. Every post-commit, post-merge, and post-rewrite hook that sourced this function was silently marking **zero** memory-index drift for spec-doc renames and deletes, no matter how much churn happened in `specs/`.

**Verified empirically**, same `HEAD`, same commit range, only the pathspec changed: the old pathspec detected **0 lines**; the new one detected **16 lines**. Not a hypothetical — a real, reproducible before/after on live repo history.

Two READMEs describing this same function (`scripts/git-hooks/lib/README.md`, `scripts/git-hooks/README.md`, plus the two files under `.opencode/scripts/git-hooks/`) were re-pointed to match — this is F009, folded into F017 since it was describing the exact behavior F017 just changed.

---

## 4. SPEC-DOC SELF-CORRECTIONS (F015, F016)

The packet's own `spec.md`/`plan.md` had two small internal-consistency problems, found by the review auditing its own scoping documents.

**F015 — frozen census numbers going stale under concurrent repo churn.**
Before: `spec.md` cited a fixed "753 non-worktree READMEs, 22 with a literal hit" as if that count were permanent.
After: reworded to cite the *exact reproducible command* and treat the number as a moving target — the review's own independent re-run measured 870/21 hours later, which is drift from concurrent repo activity, not a census error.

**F016 — a claim that didn't hold.**
`spec.md` said "`plan.md` names the exact command" for the census; it didn't yet. Fixed by adding the actual command to `plan.md`'s Definition of Ready, closing the gap between claim and content.

---

## 5. F020 — CLOSED HISTORICAL PACKET, FIXED ON REQUEST

`specs/system-speckit/026-.../003-continuity-refactor-gates/prompts/README.md` — 12 ready-to-paste example commands, all using the legacy prefix:

**Before** (representative line):
```
/deep:start-research-loop:auto "... Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/003-continuity-refactor-gates/prompts/research-prompt-implementation.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/003-continuity-refactor-gates --max-iterations 20 --convergence 0.05
```

**After**:
```
/deep:start-research-loop:auto "... Follow the research prompt at specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/003-continuity-refactor-gates/prompts/research-prompt-implementation.md" --spec-folder specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/003-continuity-refactor-gates --max-iterations 20 --convergence 0.05
```

This was initially deferred (a closed historical packet, migration-owner decision per the review's own recommendation), then fixed after the operator explicitly asked for it.

**What's still broken in that file, deliberately left alone**: the fixed paths reference a track name (`system-spec-kit`) and folder depth (2 levels under `026-...`) that predate a *later, unrelated* document reorganization — the real packet today lives under `system-speckit` (no hyphen before "kit") at 3 levels of depth. These example commands still won't resolve as written even after this fix. That's a document-reorganization drift, not a specs-root topology issue, and out of this packet's scope.

---

## 6. NOT A FINDING — CONFIRMED CORRECT, LEFT UNTOUCHED

The review's "research angle" mandate meant checking prose and diagrams beyond the literal string, not just trusting a grep hit. Two categories of `.opencode/specs` mentions were checked and confirmed as *already correct*, not fixed:

- **The negative-test fixture** (`sk-doc/scripts/tests/code-folder/negative/durability-leak/README.md`) exists specifically to assert against a legacy-path string as test input. "Fixing" it would break the test it's built to run.
- **18 directory-tree-fence candidates** from a repo-wide sweep (any code block mentioning both `.opencode/` and `specs/`) — every one was a canonical `specs/...` example path sitting next to an unrelated `.opencode/skills/.../scripts/...` invocation path in the same fence. No genuine staleness found beyond the 20 confirmed findings.

---

## 7. FINAL COUNT

| Metric | Value |
|---|---|
| Findings from the deep-review | 20 (0 P0, 5 P1, 15 P2) |
| Fixed | 20 / 20 |
| Files touched | 25 |
| Real functional/security fixes (not just prose) | 2 (`check-no-spec-imports.cjs`, `memory-drift-marker.sh`) |
| Deferred, then reversed on operator request | 2 (F012, F020) |
| False positives ruled out (research-angle sweep) | 18 |
| `validate.sh --recursive --strict` | 0 errors / 0 warnings, all 6 folders in `032-relocate-specs-folder` |

---

*Source commits: reachable `1e8606cef9` (the rebased/superseded `bbb156b7e7b`, F001-F019), `8cb906322c` (F012, F020). Full finding registry: `review/lineages/deepseek-flash/review-report.md`. Task-level evidence: `tasks.md`. Narrative summary: `implementation-summary.md`.*
