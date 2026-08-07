# Research: Implications of Relocating `.opencode/specs` to a Top-Level `specs/` Directory

**Lineage:** glm (cli-devin / glm-5-2)
**Session ID:** fanout-glm-1786009077472-i5lfbh
**Spec folder:** `.opencode/specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research`
**Iterations:** 5 of 10 (stopped: all_questions_answered)
**Date:** 2026-08-06

---

## 1. Executive Summary

The relocation of `.opencode/specs/` to a top-level `specs/` directory is **substantially lower-risk than the raw reference count suggests**, because the spec-kit tooling is *already dual-root aware by design* and a back-symlink neutralizes 99.6% of in-repo path references at zero repointing cost. The real migration work is a **symlink-direction flip plus ~5-7 specific hardcoded-literal patches**, not a 476,239-line repointing effort.

**Recommendation: PROCEED-WITH-CAVEATS** — adopt the "flip" architecture (real tree at `specs/`, back-symlink `.opencode/specs -> ../specs`) and patch the named high/medium-severity literals first; the literal-rename-without-back-symlink variant is NOT recommended.

---

## 2. Key Findings by Track

### 2.1 Tooling (Q1) — partially dual-root; a few hardcoded literals remain
- **create.sh** is dual-root in *validation* (L713 accepts both `$REPO_ROOT/specs` and `$REPO_ROOT/.opencode/specs`) but its *default* `SPECS_DIR` (L811) and *relative-path strip* (L414) are hardcoded to `.opencode/specs`. [F1.1, SOURCE: scripts/spec/create.sh:414,713,726,811]
- **validate.sh:214** hardcodes a canonical parent glob `*/.opencode/specs/system-deep-loop/036-...`; relocation causes a **SILENT validation skip** (returns 0, no error) — a correctness regression, not a loud break. [F1.2, HIGH, SOURCE: scripts/spec/validate.sh:214-221]
- **backfill-graph-metadata.ts** is path-agnostic (takes `specFolderPath` as a caller param); risk is in its discovery caller, not the script. [F1.5, SOURCE: scripts/graph/backfill-graph-metadata.ts:44,278-298,552-561]
- **generate-description.js** (dist) carries no hardcoded `.opencode/specs` literal. [F1.6]
- **spec-gate-core.mjs:107-110** bakes `.opencode/specs` into the Gate 3 user-facing prompt examples — UX steer, not a logic break. [F1.4, LOW]

### 2.2 Memory MCP (Q4) — LARGELY relocation-ready by design
- **Indexer is dual-root**: `context-server.ts:1306-1307` scans BOTH `<root>/specs` and `<root>/.opencode/specs`. [F2.2, SOURCE: context-server.ts:1303-1321]
- **Classifier is dual-root**: `shared/gate-3-classifier.ts:136` `SPEC_ROOTS = ['.opencode/specs', 'specs']`; `shared/review-research-paths.cjs` accepts both roots. [F2.3, SOURCE: gate-3-classifier.ts:125-136,381-382; review-research-paths.cjs:258,361]
- **Path resolution is cwd-relative + env-var** (`MEMORY_BASE_PATH`, `SPEC_KIT_DB_DIR`), NOT hardcoded. [F2.1, SOURCE: core/config.ts:63-101,156-164]
- **Two narrow hardcoded literals remain**: `context-server.ts:1979` (moved-folder description base — MEDIUM) and `context-server.ts:242` (FTS runbook — LOW). [F2.4, F2.5]
- **Critical methodological note**: a grep-only read of line 1307 in isolation was misleading — line 1306 immediately precedes it and adds the root `specs/` scan location. The full loop read corrected a near-misconclusion. [F2.2]

### 2.3 Git / .gitignore (Q3) — the git layer does NOT force the decision
- `specs` is a **git-tracked symlink** (mode 120000, target `.opencode/specs`), NOT a real directory. Relocation = "replace a tracked symlink with a real tracked tree." [F3.1, SOURCE: `git ls-files -s specs`; `git cat-file -p HEAD:specs`]
- `.gitignore` `!specs` (L11) and `!.opencode/` (L10) negations are **form-agnostic** — they track a symlink or a real dir equally. Both are currently unignored (`git check-ignore -v` empty). [F3.2, SOURCE: .gitignore:7-11]
- `~/.gitignore_global` ignores `/specs` and `/.opencode/` for **downstream symlinked repos**, keyed on path (not source form) — no downstream `.gitignore` change needed. [F3.3, SOURCE: ~/.gitignore_global]
- No `.gitattributes` symlink handling exists. [F3.5, SOURCE: .gitattributes:1,18]
- Symlink→real-dir is a large but atomic, reversible git change. [F3.4]
- **The git layer does not force the relocation decision; the in-repo reference scale does.** [F3.6, HIGH]

### 2.4 Scale / Risk (Q5) — 99.6% of references are self-references; back-symlink neutralizes them
- **15,020 files / 476,239 lines** reference `.opencode/specs` repo-wide. [F4.1]
- **99.6% (474,283 lines) are specs self-references**; the non-specs break surface is only **~1,901 lines / ~607 files** (159 code + 448 markdown). [F4.2, F4.3, SOURCE: per-subdir `rg` line counts]
- **DECISIVE — back-symlink convergence**: flipping the architecture to "real tree at `specs/`, back-symlink `.opencode/specs -> ../specs`" neutralizes 99.6% of references at zero repointing cost. The dual-root tooling (F2.2, F2.3) already scans `specs/` natively. Option A (literal rename) and Option B (keep `.opencode/specs` real) **converge** under this strategy. [F4.5, HIGH, SOURCE: F3.1 + F2.2/F2.3 + F1.x literals]
- The real work = **symlink flip + ~5-7 hardcoded-literal patches**, not 476,239-line repointing. [F4.5, F4.6]

### 2.5 Cross-Runtime Mirrors (Q2) — no mirror needs its own specs symlink
- NO mirror (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) carries a `specs` symlink; they symlink skills/commands/manual-testing-playbook only. [F5.1, SOURCE: mirror `ls -la` symlink inventories]
- `sync-runtime-mirrors.cjs` has NO specs-handling logic. [F5.2, SOURCE: scripts/runtime-mirrors/sync-runtime-mirrors.cjs]
- Only 2 prose references in mirrors (`.claude/SYNC.md:28`, `.devin/hooks/README.md:52`), both cosmetic. [F5.3]
- The back-symlink (F4.5) covers mirrors automatically. **Resolves spec §7: NO mirror needs its own `specs` symlink or path update.** [F5.4]

---

## 3. Ranked Implication List

| # | Implication | Severity | Track | Source |
|---|---|---|---|---|
| 1 | **validate.sh:214 silent validation skip** under relocation (canonical parent glob no longer matches → returns 0, no error) | HIGH | tooling | F1.2 |
| 2 | **Relocation decision hinges on reference scale, not git** — but back-symlink neutralizes 99.6%, so the decision converges to "flip + patch literals" | HIGH | scale/git | F3.6, F4.5 |
| 3 | **create.sh default + relative-spec strip hardcoded** (L811, L414) — new specs write to old default; strip produces wrong relative paths under `specs/` | MEDIUM | tooling | F1.1 |
| 4 | **context-server.ts:1979 moved-folder description base hardcoded** — wrong root for description regeneration of folders under `specs/` | MEDIUM | memory-mcp | F2.4 |
| 5 | **specs is a tracked symlink, not a real dir** — relocation is a symlink→tree git change (large, atomic, reversible) | LOW | git | F3.1, F3.4 |
| 6 | **context-server.ts:242 FTS runbook hardcoded path** — dangles under relocation (diagnostic surface only) | LOW | memory-mcp | F2.5 |
| 7 | **spec-gate-core.mjs:107-110 Gate 3 UX examples hardcoded** — operator-facing examples point at old location | LOW | tooling | F1.4 |
| 8 | **448 markdown files with stale `.opencode/specs` prose** — documentation debt, not a break | LOW | scale | F4.3 |
| 9 | **2 mirror prose references** (`.claude/SYNC.md`, `.devin/hooks/README.md`) — cosmetic | LOW | cross-runtime | F5.3 |
| 10 | **MCP server + classifier + indexer already dual-root** — relocation-ready by design (no change needed) | INFO (positive) | memory-mcp | F2.1-F2.3 |
| 11 | **Git negations + global ignore are form-agnostic/path-keyed** — no `.gitignore`/downstream change needed | INFO (positive) | git | F3.2, F3.3 |
| 12 | **No mirror needs its own `specs` symlink** — resolves spec §7 | INFO (positive) | cross-runtime | F5.4 |

---

## 4. Recommendation

### PROCEED-WITH-CAVEATS

**Adopt the "flip" architecture:**
1. Move the real spec tree from `.opencode/specs/` to root `specs/` (the git symlink→tree change).
2. Create a back-symlink `.opencode/specs -> ../specs` so all 474,283 self-references + ~1,821 skills/commands references continue to resolve.
3. Patch the ~5-7 hardcoded literals (in priority order):
   - **validate.sh:214** — make the canonical-parent glob dual-root (match both `*/.opencode/specs/...` and `*/specs/...`). [HIGH, silent-skip risk]
   - **create.sh:811 + :414** — flip `SPECS_DIR` default to `$REPO_ROOT/specs` and make the relative-spec strip dual-root. [MEDIUM]
   - **context-server.ts:1979** — derive the description base from the folder's actual parent root, not a hardcoded `.opencode/specs`. [MEDIUM]
   - **context-server.ts:242 + spec-gate-core.mjs:107-110** — update the runbook path and Gate 3 UX examples (cosmetic but should not steer operators wrong). [LOW]
4. Batch-find-replace the 448 markdown prose references post-migration (documentation debt cleanup, non-blocking).

**Why NOT the literal-rename-without-back-symlink variant:** it would require repointing 476,239 lines (or leaving them dangling) for no functional gain, since the dual-root tooling already treats `specs/` as a first-class root. The back-symlink gives the same outcome (`specs/` is the real tree) while keeping every existing reference valid.

**Caveats / what only the operator can verify:**
- The downstream-symlinked-repo contract (F3.3) was inferred from the `~/.gitignore_global` comment, not verified against an actual downstream repo. Confirm at least one downstream repo's `specs` symlink still resolves after the flip.
- The `backfill-graph-metadata.ts` discovery caller (the code that enumerates "all" spec folders when no `--spec-folder` is scoped) was not inspected — verify it discovers from both roots, not just `.opencode/specs`. [F1.5 carried-forward]
- The source `generate-description.js` (under `scripts/spec-folder/`, not the dist) was not inspected. [F1.6 carried-forward]

---

## 5. Convergence Report

- **Stop reason:** `all_questions_answered` (all 5 key questions answered with source citations)
- **Total iterations completed:** 5 of 10
- **Questions answered ratio:** 5/5 (100%)
- **Average newInfoRatio trend:** 1.00 → 0.70 → 0.65 → 0.60 → 0.35 (declining, as expected)
- **Convergence threshold (0.05):** NOT crossed (last ratio 0.35); stop was triggered by the all-questions-answered condition, not the novelty threshold
- **Stuck count:** 0
- **Guard violations:** none
- **Coverage by sources:** 0.8 (5 tracks covered: tooling, memory-mcp, git, scale-risk, cross-runtime)

---

## 6. Carried-Forward / Open Items for a Later Phase

- **Q1-discovery-caller**: verify the `backfill-graph-metadata.ts` "all-scope" discovery caller enumerates from both roots. [F1.5]
- **Q1-source-generate-description**: inspect the source `scripts/spec-folder/generate-description.*` (not just dist) for hardcoded paths. [F1.6]
- **Downstream-repo verification**: confirm at least one downstream symlinked repo's `specs` symlink resolves after the flip. [F3.3 inference]
- **spec-gate-core.mjs:852**: a further `.opencode/specs` match at line 852 was flagged but not inspected — verify it is not a second path resolver. [F1.4 note]

---

## 7. Source Index

All findings cite `[SOURCE: file:line]` or `[SOURCE: command]` inline. Primary sources:
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh` (L35,268,314,414,713,726,811)
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (L214-221)
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` (L44,278-298,552-561)
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` (L242,1303-1321,1978-1984)
- `.opencode/skills/system-spec-kit/mcp-server/core/config.ts` (L63-101,156-164)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` (L105-112)
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` (L125-136,381-382)
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` (L258,361)
- `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs`
- `.gitignore` (L7-11), `~/.gitignore_global`, `.gitattributes` (L1,18)
- `git ls-files -s specs`, `git cat-file -p HEAD:specs`, `git check-ignore -v specs` / `.opencode/specs`
- Repo-wide `rg '\.opencode/specs'` counts (15,020 files / 476,239 lines)
- Mirror symlink inventories (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`)
