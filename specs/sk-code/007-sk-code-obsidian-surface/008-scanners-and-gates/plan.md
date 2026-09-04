---
title: "Implementation Plan: Scanners and Gates"
description: "Execution plan for the three tools/naming/ scanners: reading order across the mobile-cli template and the measured audit, the shared walk/scan/report shape each script follows, and the proof-of-failure verification each one needs before this phase closes."
trigger_phrases:
  - "obsidian scanners implementation plan"
  - "scan-naming build plan"
  - "phase 008 scanner architecture"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/008-scanners-and-gates"
    last_updated_at: "2026-08-28T21:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added three convention scanners"
    next_safe_action: "Apply banners and folder docs"
    blockers: []
    key_files:
      - "../../../tools/naming/scan-naming.mjs"
      - "../../../tools/naming/scan-comments.mjs"
      - "../../../tools/naming/scan-folder-docs.mjs"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scanners and Gates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), Node built-ins only — `node:fs`, `node:path`, `node:url` |
| **Framework** | None; no test runner, no bundler. Each script is directly executable with `node <script>.mjs` |
| **Storage** | None — the scanners read `src/` and `tools/` and write only to stdout |
| **Testing** | No automated test file; correctness is proven by running each scanner against the live tree and by inline unit-checking the commented-out-code heuristic against labeled cases (§5) |

### Overview
Three independent, same-shaped Node scripts under `tools/naming/`: `scan-naming.mjs` walks
`src/` and `tools/` checking every file's basename against a lowercase-kebab pattern;
`scan-comments.mjs` walks the same tree checking each file for a `MODULE:` banner, a paired
numbered box-drawing section, and lines that read as commented-out code; `scan-folder-docs.mjs`
builds a folder tree under the same two roots and checks each folder's `README.md`/`CODE.md`
pair against the `>=3`-direct-files-or-child-source threshold, in both directions. Each script
follows the mobile-cli template's numbered-section grammar in its own source, takes `--json`,
and exits `1` on any violation. Each was run against the current tree immediately after being
written, and its non-zero result is recorded in `spec.md` §4.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code-mobile-cli/SKILL.md` §3b and its `scripts/run-source-gates.sh` read in full for the shape and naming a source-gates scanner set carries in this template family.
- [x] `002-repo-convention-audit/audit.json` read for the measured baseline each scanner is expected to reproduce or improve on.
- [x] The plugin's real `src/`/`tools/` tree walked with `find` to confirm the file and folder counts before writing any scanner logic against assumptions.

### Definition of Done
- [x] All three scanners created under `tools/naming/`, each with a `MODULE:` banner and numbered box-drawing sections in its own source.
- [x] Each scanner run with Bash against the tree; exit code and violation count recorded in `spec.md` §4.
- [x] No new dependency added; `package.json` untouched.
- [x] `spec.md`, `plan.md`, and `tasks.md` in this folder replaced with real content — no scaffold placeholders remain.
- [x] No file written outside `tools/naming/` and this leaf's own folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Walk-then-check-then-report, repeated identically across all three scripts so a reader who
understands one understands the shape of the other two. Each script is organized under five
numbered sections: `1. IMPORTS`, `2. CONFIGURATION`, `3. HELPERS`, `4. SCAN`, `5. REPORT`.

### Key Components
- **`scan-naming.mjs`**: recursive directory walk collecting `.ts`/`.mjs`/`.js` files under
  `src/` and `tools/`, then a single regex check (`^[a-z0-9]+([-.][a-z0-9]+)*$`) against each
  file's stem (extension stripped). No exceptions are hardcoded for the tree's existing
  camelCase (`textLinkScheme`) or underscore (`_shared.mjs`) names — phase 010's rename is a
  full conversion, so a partial allowlist here would hide work that phase still owes.
- **`scan-comments.mjs`**: the same walk, then per file: a `MODULE:` banner check in the first
  15 lines, a paired box-drawing-plus-numbered-title check across the whole file, and a
  line-by-line commented-out-code heuristic that requires both a statement-keyword shape *and*
  code punctuation (`(){};=`) before flagging a `//` line — a keyword-shaped English or CJK
  sentence alone (`type icon and its 6px margin...`, `return/typeof/else 是语法关键字...`) does
  not trip it, confirmed against the two real instances found in `src/data/FormulaTokenizer.ts`
  and `src/views/ColumnWidth.ts`.
- **`scan-folder-docs.mjs`**: builds a folder→`{directSourceFiles, childDirs}` map in one pass
  under `src/` and `tools/`, then two bottom-up passes: `isSourceBearing` (memoized, recursive —
  true if a folder or any descendant has a direct source file) and `owesReadmeAndCode` (true if
  `directSourceFiles >= 3` or any *immediate* child is source-bearing). A folder that owes both
  and lacks `CODE.md` is a `missing-code` violation; a folder that does not owe both but has a
  `CODE.md` anyway is a `stray-code` violation — the both-directions requirement from the task.

### Data Flow
`src/` + `tools/` file tree -> per-script walk -> per-file/per-folder check -> violations array
-> stdout (text or `--json`) -> process exit code (`0` clean, `1` violations found).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification
phase checkboxes and task state.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live-tree run | Each scanner against the real `src/`/`tools/` tree, both plain and `--json` output | `node tools/naming/scan-*.mjs [--json]`, reading exit code and counts |
| Heuristic unit-check | The commented-out-code classifier against 8 labeled cases (4 real code shapes, 4 prose look-alikes including the two real false positives this phase found and then fixed) | Inline `node -e` snippet exercising the same regexes as `scan-comments.mjs`; all 8 cases classify correctly |
| Cross-check | `scan-folder-docs.mjs`'s live folder classification against `audit.json`'s `folderDocs` lists | Manual comparison; one disagreement found and recorded (`src/data/__tests__`, `spec.md` §5 Scenario 5 and §7) |
| Scaffold-residue check | No `REQUIREMENT_PLACEHOLDER` or bare `**Given**` remains in `spec.md`/`plan.md`/`tasks.md` | `grep` for the scaffold markers |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/scripts/run-source-gates.sh` | External (hub repo) | Green — read in full | The shape template for a source-gates scanner's banner, section grammar, and PASS/FAIL reporting convention |
| `002-repo-convention-audit/audit.json` | Internal (this packet) | Green — already measured, and used as a cross-check rather than a blind source of truth (one disagreement found, §5) | Without it there would be no baseline to compare this phase's live counts against |
| Node.js runtime (`node:fs`, `node:path`, `node:url`) | Runtime | Green — no version-specific API used beyond stable `node:fs`/`node:path`/`node:url`, confirmed on the runtime present in this worktree | None; no new package dependency is added |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a scanner's heuristic proves too strict or too loose once phase 009 starts
  converting the tree against it (for example, a legitimate natural-language comment still
  false-positives as commented-out code).
- **Procedure**: tighten or loosen the specific regex in the affected script's `2. CONFIGURATION`
  section; each script is a single file with no downstream import, so the fix is local. Re-run
  the live-tree check in §5 to confirm the change did not silently zero out the count.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (template + tree + audit) ──► Implementation (3 scanners) ──► Verification (live run, proof of failure)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 009 (banners-and-folder-docs) using these scanners as its gate |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Reading one shell script template, one JSON audit, and one `find` pass over the tree |
| Implementation | Med | Three ~150-line scripts, each with its own regex design and a false-positive fix cycle |
| Verification | Low | Six `node` invocations (plain + `--json` per script) plus one inline heuristic unit-check |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every scanner was actually executed against the live tree this session, not assumed to work from its source alone.
- [x] The commented-out-code heuristic was corrected after a real false positive was found (`FormulaTokenizer.ts`, `ColumnWidth.ts`), not shipped on the first draft.
- [x] No file was written outside `tools/naming/` and this leaf's own folder.

### Rollback Procedure
1. Identify the scanner and the specific check producing a wrong result.
2. Edit that check's regex or logic in place within the single affected `.mjs` file.
3. Re-run that scanner in both plain and `--json` mode and re-record the count if it changed materially from `spec.md` §4.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase adds three new files and mutates no existing one.

<!-- /ANCHOR:enhanced-rollback -->
