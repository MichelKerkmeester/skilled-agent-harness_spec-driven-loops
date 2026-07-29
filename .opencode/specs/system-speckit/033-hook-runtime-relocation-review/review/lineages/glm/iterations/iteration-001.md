---
title: "Iteration 001 — Correctness: verify Phase 6 code fixes + repo-wide stale-path sweep"
iteration: 1
dimension: correctness
verdict: FAIL
---

# Iteration 001 — Correctness

**Focus dimension**: D1 Correctness
**Target**: Verify the 3 Phase 6 code fixes (REQ-008, REQ-009, REQ-010) are logically sound, regression-tested, and that the remediation introduced no new broken imports. A repo-wide stale-path sweep is performed as part of correctness since broken imports are correctness failures.

## 1. Phase 6 Code Fix Verification

### REQ-008 — Codex multi-file post-edit-quality coverage (R2-P1-001)

**File**: `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs`

**Fix verified**: `firstPatchPath()` (single non-global regex match) replaced by `patchPaths()` using `matchAll` with the `g` flag, collecting every `*** Add/Update/Delete File:` and `*** Move to:` header. `filePathFrom()` → `filePathsFrom()` returns an array. The main loop now iterates every file with a shared time budget (`remainingMs` check per file).

[SOURCE: `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:51-61` (patchPaths), `:63-68` (filePathsFrom), `:136-158` (per-file loop)]

**Regression test**: "Codex hook checks every file named in a multi-file apply_patch, not only the first" — test 39 in `mk-post-edit-quality.test.cjs`. Confirmed passing (41/41 combined, this session).

[SOURCE: `.opencode/plugins/tests/mk-post-edit-quality.test.cjs:39` (test 39)]

**Verdict on REQ-008**: PASS — fix is correct, regression test covers the multi-file case, budget-sharing logic is sound.

### REQ-009 — Dispatch-guard forgery hardening (R3-P1-001)

**File**: `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs`

**Fix verified**: `isCommandDrivenIteration()` now requires the iteration marker to co-occur with a `Config:` path (`STATE_CONFIG_PATH_REGEX`) that resolves to a real, on-disk deep-loop config file with `mode` and `maxIterations` fields. A `..` traversal in the config path is rejected. All callers (`evaluateDispatch`) thread `projectDir` through.

[SOURCE: `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs:132-165` (resolveCommandConfigPath + isCommandDrivenIteration), `:557` (evaluateDispatch call site)]

**Regression tests**: 4 forgery cases across `claude-task-dispatch-guard.test.cjs` and `mk-deep-loop-guard.test.cjs` — "forged no-config" and "forged ghost-config" both assert `loop-like repeated dispatch` is still logged. Confirmed passing (this session).

[SOURCE: `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:324-348`, `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:278-299`]

**Verdict on REQ-009**: PASS — the structural binding to an on-disk config file is a sound forgery defense; a forger cannot produce filesystem state with text alone.

### REQ-010 — Credential redaction gap closure (R3-P1-002)

**File**: `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs`

**Fix verified**: Two new `SECRET_PATTERNS` entries added: (1) bare PEM key/certificate blocks (`-----BEGIN ... PRIVATE KEY/CERTIFICATE-----` with non-greedy `[\s\S]+?` body), (2) bare JWTs (`eyJ`-prefixed base64url three-part structure). Both patterns carry no keyword anchor, which was the gap.

[SOURCE: `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs:133-140` (PEM + JWT patterns)]

**Regression tests**: "scrubs a bare PEM private-key block with no surrounding keyword" and "scrubs a bare JWT with no surrounding keyword" — both passing (40/40, this session).

[SOURCE: `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs` (PEM + JWT test cases)]

**Verdict on REQ-010**: PASS — the two added patterns close the specific gap identified in R3-P1-002. The allowlist approach remains pattern-based (not entropy-based), so a truly novel credential shape could still escape, but the two shapes called out in the finding (PEM, JWT) are now covered.

## 2. Repo-Wide Stale-Path Sweep — P0 FINDINGS

The prior review's R4-P1-001 found 2 stale playbook paths. The Phase 6 remediation fixed those 2 files and re-verified them. However, CHK-011 [P0] claims "No stale path reference survives outside git history" — a repo-wide claim. The remediation's re-verification was scoped only to the 2 playbook files, not a repo-wide sweep.

A repo-wide grep for the old paths of the 4 moved guard-core families reveals **4 broken live imports** in production code across 2 skill trees. The moved files no longer exist at their old locations (confirmed via `ls` and `git show --stat 40d5f0d2b3`), so these imports fail with `ERR_MODULE_NOT_FOUND` at module-load time.

### F001 — P0: `permission-request-policy.mjs` imports a moved-away file

**File**: `.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:22`

```
import { evaluate, readHardRules } from '../../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';
```

The target `cli-opencode/scripts/lib/dispatch-rule-checks.mjs` was `git mv`'d to `.opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.mjs` in commit `40d5f0d2b3`. The old path now contains only a `README.md`.

**Live impact**: This file is wired as a Devin PreToolUse hook in `.devin/hooks.v1.json:131`. When the hook fires, it crashes with `ERR_MODULE_NOT_FOUND`.

**Confirmed**: `node -e "import('./.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs')..."` → `ERR_MODULE_NOT_FOUND: Cannot find module .../cli-opencode/scripts/lib/dispatch-rule-checks.mjs`

[SOURCE: `.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:22`, `.devin/hooks.v1.json:131`, `git show --stat 40d5f0d2b3`]

### F002 — P0: `git-preflight-advisory.mjs` imports a moved-away file

**File**: `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:31`

```
import { evaluate, readHardRules } from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';
```

Same broken import. This file is wired as a PreToolUse hook across **4 runtimes**: `.claude/settings.json:31`, `.cursor/hooks.json:61`, `.devin/hooks.v1.json:67`, `.codex/hooks.json:64`.

**Live impact**: When any of these 4 runtimes fires this hook, it crashes with `ERR_MODULE_NOT_FOUND`. The Codex and Devin wiring have `|| printf '{"hookSpecificOutput":...}'` fallbacks that mask the crash, but Claude and Cursor do not — the hook failure would surface as an error in those runtimes.

**Confirmed**: `node -e "import('./.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs')..."` → `ERR_MODULE_NOT_FOUND`

[SOURCE: `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:31`, `.claude/settings.json:31`, `.cursor/hooks.json:61`, `.devin/hooks.v1.json:67`, `.codex/hooks.json:64`]

### F003 — P0: `advisory-noise-audit.mjs` imports a moved-away file

**File**: `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs:29`

```
import { evaluate, readHardRules } from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';
```

Same broken import. This module is imported by `git-preflight-advisory.mjs` and would fail transitively.

**Confirmed**: `node -e "import('./.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs')..."` → `ERR_MODULE_NOT_FOUND`

[SOURCE: `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs:29`]

### F004 — P0: `git-rule-checks.test.mjs` imports a moved-away file

**File**: `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs:24`

```
import { readHardRules, evaluate } from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';
```

This test file's import is broken. It was NOT in the set of test files re-run during Phase 6 (T024 only re-ran the directly affected suites: `mk-post-edit-quality`, `mk-deep-loop-guard`, `claude-task-dispatch-guard`, `dispatch-audit`, `dispatch-rule-checks`, `mcp-route-guard`, `test-root-name-consumer-matrix`).

[SOURCE: `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs:24`]

### Claim Adjudication (F001-F004)

| Field | Value |
|-------|-------|
| findingId | F001-F004 |
| claim | The relocation broke 4 live imports in `system-spec-kit` and `sk-git` skill trees that were not in the documented "surfaces changed" list |
| evidenceRefs | `permission-request-policy.mjs:22`, `git-preflight-advisory.mjs:31`, `advisory-noise-audit.mjs:29`, `git-rule-checks.test.mjs:24`, `git show --stat 40d5f0d2b3`, live `node -e` import attempts → `ERR_MODULE_NOT_FOUND` |
| counterevidenceSought | Checked for symlinks at old paths (none exist); checked if old files still exist (they don't — only README.md remains); checked if the relocation commit touched these consumer files (it did not) |
| alternativeExplanation | These imports could be dead code that never fires — rejected: `permission-request-policy.mjs` is wired in `.devin/hooks.v1.json:131`; `git-preflight-advisory.mjs` is wired in 4 runtime configs |
| finalSeverity | P0 |
| confidence | 0.98 |
| downgradeTrigger | N/A — confirmed broken via live import attempt |

## 3. Test Suite Re-Verification

All directly affected test suites pass (re-run this session):
- `dispatch-rule-checks.test.mjs` + `mcp-route-guard.test.cjs`: 7/7 (node --test)
- `dispatch-audit.test.mjs`: 40/40 (vitest)
- `mk-post-edit-quality.test.cjs` + `mk-deep-loop-guard.test.cjs` + `claude-task-dispatch-guard.test.cjs`: 41/41 (node --test)
- `test-root-name-consumer-matrix.cjs`: 17/17

**Gap**: `git-rule-checks.test.mjs` was NOT re-run and would fail (F004).

## 4. Dimension Verdict

D1 Correctness: **FAIL** — the 3 Phase 6 code fixes are correct and well-tested, but the relocation itself broke 4 live imports in 2 skill trees that were not caught by the prior review or the Phase 6 remediation. This is a P0 correctness failure: production hooks (`git-preflight-advisory.mjs`, `permission-request-policy.mjs`) will crash at module-load when they fire.

Review verdict: FAIL
