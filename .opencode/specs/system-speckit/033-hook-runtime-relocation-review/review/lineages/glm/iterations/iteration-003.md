---
title: "Iteration 003 — Traceability + Maintainability: spec/checklist alignment, stale doc references, README dependency framing"
iteration: 3
dimension: traceability
verdict: FAIL
---

# Iteration 003 — Traceability + Maintainability

**Focus dimensions**: D3 Traceability + D4 Maintainability (combined to maximize coverage in the final iteration per `stop_policy=max-iterations`)
**Target**: Verify spec/checklist/implementation-summary alignment, run the core traceability protocols (`spec_code`, `checklist_evidence`), check the README dependency framing fix (REQ-013), and catalog remaining stale doc references.

## 1. Traceability Protocol: `spec_code` — FAIL

**REQ-003** (P0): "A repo-wide grep for every old path string returns zero hits outside git history, including manual-testing-playbook executable command blocks."

**Result**: FAIL. Iteration 1 confirmed 4 broken live imports (F001-F004) pointing at moved-away paths. Additionally, this iteration found 5 stale documentation references to moved-away paths:

### F006 — P1: `cli-codex/references/hook-contract.md` carries 3 stale adapter path references

**File**: `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:92,94,96`

Three table rows point at pre-relocation paths:
- Line 92: `cli-opencode/scripts/hooks/codex/dispatch-preflight-lint.mjs` (moved to `.opencode/runtime-hooks/dispatch/codex/`)
- Line 94: `sk-code/code-quality/scripts/hooks/codex/post-edit-quality.cjs` (moved to `.opencode/runtime-hooks/post-edit-quality/codex/`)
- Line 96: `mcp-code-mode/runtime/hooks/codex/mcp-route-guard.cjs` (moved to `.opencode/runtime-hooks/mcp-route-guard/codex/`)

This is a `playbook_capability` overlay protocol failure: the codex hook-contract reference describes capabilities that no longer resolve at the documented paths.

[SOURCE: `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:92,94,96`]

### F007 — P1: `deep-alignment/references/adapters/sk-doc-known-deviations.md` carries a stale path reference

**File**: `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-known-deviations.md:94`

References `cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` and `cli-external/cli-opencode/scripts/lib/dispatch-rule-checks.mjs` — both moved away. This is an evidence citation in a known-deviations doc; the cited file:line no longer exists at that path.

[SOURCE: `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-known-deviations.md:94`]

### F008 — P1: `.loop-guard-state/README.md` references the old `dispatch-guard.cjs` path

**File**: `.opencode/skills/.loop-guard-state/README.md:19,107`

Two references to `../system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs` (moved to `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs`). This README explains the state directory to operators; the link to the policy core is now broken.

[SOURCE: `.opencode/skills/.loop-guard-state/README.md:19,107`]

## 2. Traceability Protocol: `checklist_evidence` — FAIL

**CHK-011** [P0]: "No stale path reference survives outside git history."

**Evidence row in checklist.md** (lines 58): claims the grep sweep "missed 2 executable commands in `cli-dispatch-audit-trail.md`/`codex-hook-parity.md`" and that those were "fixed in the T020 remediation pass and re-verified."

**Reality**: The re-verification was scoped only to those 2 files. A repo-wide grep finds 4 broken live imports (F001-F004) + 5 stale doc references (F006-F008, plus the `injection-contract.md` historical references which are acceptable). CHK-011's evidence row overstates the verification scope — it should say "the 2 playbook files were re-verified; a full repo-wide sweep was not performed."

This is the same class of overclaim that R4-P1-001 identified in the prior review, now recurring because the remediation's re-verification was too narrow.

[SOURCE: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:58` (CHK-011 evidence row)]

### F009 — P1: CHK-011 evidence row overstates the stale-path verification scope

**File**: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:58`

CHK-011 [P0] claims "No stale path reference survives outside git history" with evidence scoped to only the 2 playbook files from R4-P1-001. The repo-wide sweep that REQ-003 requires was never actually performed. 4 broken imports + 3 stale doc references remain.

[SOURCE: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:58`]

## 3. Maintainability: REQ-013 — `hook-adapter-shared.cjs` dependency framing

**File**: `.opencode/runtime-hooks/shared/hook-adapter-shared.cjs` (new), `.opencode/runtime-hooks/README.md` (updated)

**Fix verified**: A new `shared/hook-adapter-shared.cjs` (28 lines, zero dependencies) was created inside the `runtime-hooks/` tree. All 5 adapters that previously imported from `system-spec-kit/runtime/lib/hook-adapter-shared.cjs` now import from `../../shared/hook-adapter-shared.cjs`. The README's dependency framing was corrected: it now states plainly that the shared helper has its own local copy and no longer reaches back into `system-spec-kit`.

[SOURCE: `.opencode/runtime-hooks/shared/hook-adapter-shared.cjs:1-28`, `.opencode/runtime-hooks/README.md:37`, `.opencode/runtime-hooks/mcp-route-guard/claude/mcp-route-guard.cjs:26` (and 4 sibling adapters)]

**Cross-check**: `grep -rn "system-spec-kit/runtime/lib/hook-adapter-shared" .opencode/runtime-hooks/` returns zero hits — the dependency is fully resolved.

**Verdict on REQ-013**: PASS — the dependency is removed, the README framing is corrected, the second independent copy in `system-spec-kit/` is explicitly acknowledged.

## 4. Maintainability: REQ-012 — "verified across 6 runtimes" overclaim

**File**: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md`

**Fix verified**: The Verification table (line 118) now states: "Claude, Cursor, Devin, Codex runtime verification — Verified via config/symlink resolution checks plus each runtime's own test suites — NOT live-smoke-tested post-move." The frontmatter `description` was also narrowed. This matches `spec.md` REQ-002/NFR-R01's framing.

[SOURCE: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md:118`]

**Verdict on REQ-012**: PASS — the overclaim is resolved; the verification table now accurately distinguishes live-smoke-tested (Pi, OpenCode) from config/test-suite-verified (Claude, Cursor, Devin, Codex).

## 5. Maintainability: REQ-011 — Playbook path fix

**Files**: `cli-dispatch-audit-trail.md`, `codex-hook-parity.md`

**Fix verified**: Both files' executable command blocks now point at `.opencode/runtime-hooks/dispatch/lib/` and `.opencode/runtime-hooks/dispatch/codex/` respectively. A grep for `cli-opencode/scripts/(lib|hooks)` in those 2 files returns zero hits.

[SOURCE: `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md:52,129`, `codex-hook-parity.md:36-37`]

**Verdict on REQ-011**: PASS — the 2 playbook files are fixed.

## 6. Spec Packet Validation

`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/033-hook-runtime-relocation-review --strict` → **PASSED** (Errors 0, Warnings 0, this session).

The spec packet itself is structurally valid. The issue is not packet structure but evidence accuracy (F009).

## 7. Dimension Verdict

D3 Traceability: **FAIL** — `spec_code` protocol fails (4 broken imports + 3 stale doc references); `checklist_evidence` protocol fails (CHK-011 overclaim, F009).
D4 Maintainability: **PASS** — REQ-011, REQ-012, REQ-013 are all correctly resolved. The `shared/hook-adapter-shared.cjs` extraction is clean, the README framing is accurate, and the overclaim is narrowed.

Review verdict: FAIL
