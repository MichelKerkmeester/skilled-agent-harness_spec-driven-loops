---
title: "Implementation Plan: Doc-Template and Code-README Alignment"
description: "Dispatch GLM-5.2 High via cli-devin to rewrite both changes documents in the sk-doc general-README shape, author 9 code-folder READMEs from a pre-enumerated file list, and audit added TypeScript/JS against sk-code-opencode's standards; verify every claim before applying."
trigger_phrases:
  - "doc template code readme alignment plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/010-doc-template-and-code-readme-alignment"
    last_updated_at: "2026-08-09T06:00:25Z"
    last_updated_by: "spec-author"
    recent_action: "Applied and fact-checked GLM-5.2 dispatch output; validated clean"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Doc-Template and Code-README Alignment

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/JavaScript source (deep-pi, pi-cache-optimizer, shared); Markdown documentation |
| **Framework** | `sk-doc` `sk-create-readme` templates (general-README and code-folder shapes); `sk-code-opencode` TypeScript standards |
| **Storage** | None new |
| **Testing** | Both forks' existing `npm test`/`npm run typecheck` gates re-run after any code change |

### Overview

Three distinct pieces of work, one dispatch: reshape two existing documents onto a template, author nine new documents from real file evidence, and audit/fix real code (TypeScript/JavaScript) files this packet already added. The user directed GLM-5.2 High via `cli-devin`. Every claim the dispatch produces is fact-checked against the real source before being applied, matching this packet's established discipline (009's dispatch verification found and corrected 2 real inaccuracies from a GPT dispatch; the same standard applies here).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Both current `CHANGES-FROM-UPSTREAM.md` files read in full
- [x] All 9 target folders' real file listings gathered directly (not assumed)
- [x] `sk-create-readme/SKILL.md` (general-README and code-folder shapes) and `sk-code-opencode/SKILL.md` (TypeScript standards) read in full
- [x] `cli-devin/SKILL.md` read before composing any dispatch prompt
- [x] `devin auth status` confirmed logged in

### Definition of Done

- [x] Both changes documents rewritten in the sk-doc general-README shape, every 009-verified fact preserved
- [x] All 9 code-folder READMEs exist, fact-checked against real source
- [x] TypeScript/JavaScript standards findings are real and cited; fixes applied only where verified not to change behavior
- [x] Both forks' `npm test`/`npm run typecheck` pass from the final state
- [x] `validate.sh --recursive --strict` still passes the whole `039` packet
- [x] `git status --porcelain` shows only the intended changes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single dispatch, then verify. One `cli-devin` dispatch (`--model glm-5-2 --permission-mode accept-edits`, matching the user's "GLM 5.2 high" to the roster's `glm-5-2` = GLM-5.2 High) does all three pieces of work in one pass, since they share the same read context (the same 9 folders, the same two changes documents, the same code files). The dispatch prompt carries the exact file listings already gathered, the exact template shapes to follow, and the pre-approved spec folder, so it does not need to re-discover scope or ask Gate 3.

### Key Components

**REQ-001 — changes-document reshape.** Feed the dispatch the CURRENT content of both `CHANGES-FROM-UPSTREAM.md` files plus `sk-create-readme/SKILL.md`'s Section 5 (general-README) rules. Instruct: preserve every fact, restructure into numbered ALL-CAPS H2 sections (`## 1. OVERVIEW`, etc.) with `---` separators, no ToC, no anchor comments, using the "How This Compares" / custom sections that fit a fork-divergence document.

**REQ-002 — code-folder READMEs.** Feed the dispatch the real file listing per folder (already gathered in `tasks.md` Evidence Record) plus `sk-create-readme/SKILL.md`'s Section 6 (code-folder) rules, including the subdirectory-count rule for Directory Tree vs flat file table. Instruct it to read each file's actual content (imports, exports, top-level function/class names) before writing Key Files and Entrypoints, not to infer from filenames alone.

**REQ-003 — TypeScript/JS standards audit.** Feed the dispatch the standards references under `sk-code/sk-code-opencode/references/typescript/` and `references/shared/universal-patterns/` plus `assets/checklists/typescript-checklist.md`. Instruct: find real, cited deviations (naming, formatting, type-system gaps, TSDoc, error/async handling) in the files this packet added or modified, fix them, then re-run `npm test`/`npm run typecheck` in the affected fork and revert any fix that breaks a test.

### Data Flow

Real file listings and current doc content (gathered directly, not delegated) → dispatch prompt → GLM-5.2 High via `devin -p --model glm-5-2 --permission-mode accept-edits` → dispatch writes files directly in the repo (pre-approved spec folder) → fact-check every written claim against the real source → `npm test`/`npm run typecheck` re-run → `validate.sh --recursive --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read both current `CHANGES-FROM-UPSTREAM.md` files
- [x] Enumerate all 9 target folders' real file listings directly
- [x] Read `sk-create-readme/SKILL.md` and `sk-code-opencode/SKILL.md` in full
- [x] Read `cli-devin/SKILL.md`; confirm `devin auth status` logged in; resolve "GLM 5.2 high" to `--model glm-5-2` via `references/providers-and-models.md`

### Phase 2: Implementation

- [x] Compose and run the single `cli-devin` dispatch (`--model glm-5-2 --permission-mode accept-edits`) covering all three pieces of work with the pre-approved spec folder
- [x] Fact-check every written document and code change against the real source; correct or revert anything unverifiable or behavior-changing

### Phase 3: Verification

- [x] Re-run `npm test`/`npm run typecheck` in both forks from the final state
- [x] `git status --porcelain` scope check across both extension directories
- [x] `validate.sh --strict` on this folder; `validate.sh --recursive --strict` on the whole `039` packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Both forks' existing `npm test`/`npm run typecheck` gates are the authoritative check that no code-standards fix changed behavior. No new tests are added by this phase; documentation and existing-test-preserving code style are the only outputs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|---|---|---|
| `devin` CLI, Devin account OAuth | External tooling | Confirmed available and authenticated before dispatch |
| `sk-create-readme`, `sk-code-opencode` | Internal skill packets | Read in full before composing the dispatch prompt |
| 009's already-verified fact base | Internal | Reused, not re-derived |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Working-tree revert of the touched files (`git checkout -- <path>` for edits, `rm` for the 9 newly created README.md files if the deletion needs reverting). No production behavior changes are intended; any code-standards fix that fails a test is reverted immediately during Phase 2, not shipped and rolled back later.
<!-- /ANCHOR:rollback -->
