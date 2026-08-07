# Iteration 004 — Scale and Risk of Repointing In-Repo Path References (Q5)

**Focus:** Q5 — count, distribution, and blast radius of in-repo `.opencode/specs` path references; determines whether Option A (literal rename) is viable or Option B (keep `.opencode/specs` real) is forced.
**Track:** scale-risk
**Executor:** cli-devin / glm-5-2
**Date:** 2026-08-06

## Approach
Repo-wide `rg` for `.opencode/specs` (excluding `node_modules`/`.git`). Counted matching files and lines, broke down by top-level `.opencode` subdir, split code (sh/ts/mjs/js/cjs/py/json) vs markdown, and isolated specs self-references from non-specs (skills/commands/root/mirrors).

## Findings

### F4.1 — Scale: 15,020 files / 476,239 lines reference `.opencode/specs` repo-wide
```
TOTAL matching files: 15,020
TOTAL matching lines: 476,239
```
This is the headline scale number. Raw magnitude alone would suggest relocation is infeasible — but the distribution (F4.2) shows the risk is concentrated, not diffuse.
[SOURCE: repo-wide `rg '\.opencode/specs'` excluding node_modules/.git]

### F4.2 — Distribution: 99.6% of references are specs SELF-references
| Location | Files | Lines | % of lines |
|---|---|---|---|
| `.opencode/specs` (self-refs) | 14,345 | 474,283 | 99.6% |
| `.opencode/skills` | 626 | 1,821 | 0.38% |
| `.opencode/commands` | 32 | 80 | 0.02% |
| `.opencode/agents` | 0 | 0 | 0% |
| runtime mirrors (.claude/.devin) | 2 | (few) | ~0% |
| root (AGENTS.md, PUBLIC-RELEASE.md, README.md) | 3 | (few) | ~0% |

The specs tree references itself (specs citing other specs by `.opencode/specs/<track>/<NNN>` paths) in 474,283 of 476,239 lines. The NON-specs repointing workload — the surface that would actually break tooling/docs — is only **~1,901 lines across ~607 files** (159 code + 448 markdown in skills/commands, plus a handful in root/mirrors).
[SOURCE: per-subdir `rg` line counts; code/md split]

### F4.3 — Non-specs break surface: 159 code files (real break risk) + 448 markdown files (cosmetic)
Within skills+commands+root+mirrors:
- **159 code files** (sh/ts/mjs/js/cjs/py) — these are path resolvers, validators, generators, hooks. A hardcoded `.opencode/specs` literal here is a FUNCTIONAL break under literal rename. This set includes the iter-1 findings (validate.sh:214, create.sh:414/811, context-server.ts:1979/242, spec-gate-core.mjs:107-110) plus ~153 more.
- **448 markdown files** — prose citations, changelog entries, playbook references. These are COSMETIC under literal rename (the path string is wrong but no code breaks); they become stale documentation, not failures.
**Verdict:** The real repointing risk is ~159 code files, not 15,020. The markdown surface is a documentation-debt cleanup, not a migration blocker.
[SOURCE: `rg -l '\.opencode/specs' ... -g '*.sh' -g '*.ts' ...` vs `-g '*.md'`]

### F4.4 — Specs self-references: 2,382 code (incl. json) + 9,578 markdown files
Within `.opencode/specs` itself:
- 2,382 code/json files (description.json, graph-metadata.json, scripts inside spec packets) carry `.opencode/specs` path strings.
- 9,578 markdown files (spec.md, plan.md, research.md, changelogs) cite specs by path.
These all move WITH the tree under relocation. Under Option A (literal rename to `specs/`), every one of these `.opencode/specs/...` strings becomes a dangling reference unless repointed or resolved via a back-symlink (F4.5).
[SOURCE: `rg -l '\.opencode/specs' .opencode/specs -g '*.md'` / code globs]

### F4.5 — DECISIVE: a back-symlink `.opencode/specs -> ../specs` neutralizes 99.6% of references at zero repointing cost
The current architecture is: **real tree at `.opencode/specs/`, forward symlink `specs -> .opencode/specs`**. The relocation proposal flips this to: **real tree at `specs/`, back-symlink `.opencode/specs -> ../specs`**.
- Under the flipped architecture, all 474,283 specs self-references (and the ~1,821 skills/commands references) continue to resolve — the path `.opencode/specs/...` still works via the back-symlink.
- The dual-root tooling (F2.2 indexer scans `specs/`; F2.3 classifier recognizes `specs/`) already treats `specs/` as a first-class root, so the real tree at `specs/` is discovered natively.
- The ONLY remaining breaks are the handful of hardcoded literals that treat `.opencode/specs` as a *specific canonical path* rather than a *scan root*: `validate.sh:214` (canonical parent glob), `context-server.ts:1979` (description base), `context-server.ts:242` (runbook), `spec-gate-core.mjs:107-110` (UX examples), `create.sh:414/811` (default + strip). These ~5-7 sites need patching regardless of which option is chosen, because they hardcode the path as a specific location, not as one-of-two-roots.
**This reframes the relocation from "repoint 476,239 lines" to "flip the symlink direction + patch ~5-7 specific hardcoded literals."** The back-symlink makes Option A and Option B converge: the real tree lives at `specs/`, `.opencode/specs` remains a valid path via symlink, and the dual-root tooling already supports it.
[SOURCE: F3.1 symlink architecture; F2.2/F2.3 dual-root tooling; F1.1/F1.2/F2.4/F2.5/F1.4 hardcoded literals]

### F4.6 — Risk ranking
1. **HIGH:** `validate.sh:214` — silent validation skip (correctness regression, no error). Must patch.
2. **MEDIUM:** `create.sh:414/811` — default target + relative-spec strip hardcoded; new specs would still write to `.opencode/specs/` (via back-symlink, so they'd land in `specs/` correctly) but the strip logic produces wrong relative paths. Must patch for correct relative-path computation.
3. **MEDIUM:** `context-server.ts:1979` — moved-folder description base hardcoded; wrong root for description regeneration of folders under `specs/`. Must patch.
4. **LOW:** `context-server.ts:242`, `spec-gate-core.mjs:107-110` — diagnostic runbook + UX examples. Cosmetic; patch for cleanliness.
5. **LOW:** 448 markdown files with stale `.opencode/specs` prose — documentation debt, not a break. Batch-find-replace after migration.
6. **INFO:** 474,283 specs self-references — neutralized by back-symlink; no repointing needed.

## What Worked
- Per-subdir line counts (not just file counts) revealed the 99.6% self-reference concentration that file counts alone obscured (14,345 vs 626 looked more balanced than 474,283 vs 1,821).
- Code-vs-markdown split separated the 159 functional-break files from the 448 cosmetic-doc files — the real risk is 159, not 607.

## What Failed / Ruled Out
- Ruled out: "relocation requires repointing 476,239 lines." FALSE under the back-symlink strategy (F4.5) — 99.6% are neutralized by flipping the symlink direction.
- Ruled out: "Option A (literal rename) and Option B (keep `.opencode/specs` real) are distinct migrations." They CONVERGE under the back-symlink: real tree at `specs/`, `.opencode/specs` as symlink, dual-root tooling already supports it.

## Novelty Justification
The quantitative scale (476,239 lines / 15,020 files) is genuinely new and decisive. The 99.6% self-reference concentration and the back-symlink convergence insight (F4.5) reframe the entire relocation from a massive repointing effort to a symlink flip + ~5-7 literal patches. This resolves the spec's §7 open question (literal rename vs. keep real tree) by showing they converge. High value, builds on F3.6's framing but introduces the decisive quantitative + architectural resolution.

## newInfoRatio: 0.60 (decisive quantitative data + architectural convergence; resolves the gating open question)

## Next Focus Suggestion
Q2 (cross-runtime mirrors) is the last open question. The mirror scan already showed `.claude` (1 file) and `.devin` (1 file) carry `.opencode/specs` references; `.codex`/`.cursor`/`.pi` carry none. Investigate how each mirror resolves the specs folder (own symlink? reads through `.opencode/specs`? hardcoded in settings?) and whether the back-symlink strategy (F4.5) covers them or whether any mirror needs its own `specs` symlink/path update. This is likely a low-novelty confirmation iteration given the near-zero mirror reference counts.
