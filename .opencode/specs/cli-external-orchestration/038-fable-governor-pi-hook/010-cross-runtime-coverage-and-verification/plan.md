---
title: "Implementation Plan: Cross-Runtime Coverage and Verification"
description: "Independently re-verify the R1-P1-001 quoted-executor fix and its shared-lib evidence, confirm the two cross-runtime documentation artifacts, and record R2-P1-002/R2-P1-003 as an explicit deferral."
trigger_phrases:
  - "quoted executor verification plan"
  - "cross-runtime coverage plan"
  - "R1-P1-001 evidence plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification"
    last_updated_at: "2026-08-05T14:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the verification-first plan for recording the quoted-executor fix"
    next_safe_action: "Run tasks.md T001-T006 and record observed output"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.test.mjs"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
    session_dedup:
      fingerprint: "sha256:b1681d8e115b06f2fde4d21fb6e9324b1c525836d8e36ef13571534e7f0e6603"
      session_id: "2026-08-05-cli-038-010-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cross-Runtime Coverage and Verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM) shared lib, TypeScript Pi extension, Vitest + Node `node:test` |
| **Framework** | Vitest for `.test.mjs`/`.test.ts`, native `node --test` for `dispatch-rule-checks.test.mjs` |
| **Storage** | Phase-local Markdown docs only; no code storage changes |
| **Testing** | Focused shared-inspector suite, Pi preflight suite, Node rule suite, whole-directory sweep |

### Overview
This phase performs no new implementation. It reads the already-applied fix in `directExecutor()`, independently re-runs the three focused test suites plus a whole-`dispatch/`-directory sweep, confirms the two cross-runtime documentation artifacts exist, and records the two review findings that remain out of scope (R2-P1-002, R2-P1-003) as an explicit deferral rather than silently omitting them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The R1-P1-001 finding text, file, and line are known from `deep-review-findings-registry.json`.
- [x] The fix location (`directExecutor()` in `dispatch-audit.mjs`) and its current source are known.
- [x] The two cross-runtime documentation artifact paths are known.

### Definition of Done
- [x] Shared inspector suite re-run in this phase and its count recorded.
- [x] Pi preflight suite re-run in this phase and its count recorded.
- [x] Node rule suite re-run in this phase and its count recorded.
- [x] Both cross-runtime documentation artifacts confirmed to exist.
- [x] R2-P1-002 and R2-P1-003 recorded as deferred with file/line citations, not resolved.
- [x] This phase validates with no errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-and-record verification: no source mutation, only independent re-execution of existing tests plus file-existence checks.

### Key Components
- **Root-cause citation**: `directExecutor()` at `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:186-197` — exact basename-set membership replaces the removed blanket quoted-executor guard.
- **Shared-lib evidence**: 4 `inspectDispatch` rows + 1 `matchDispatchShape` test in `dispatch-audit.test.mjs`, re-run for this phase.
- **Blast-radius statement**: the shared lib is consumed by the four inspector runtimes (Claude, Codex, Devin, Pi); this phase does not re-derive per-runtime evidence beyond the shared suite and the Pi preflight suite, which is the one runtime with a dedicated `tool_call`-boundary test file in this packet.
- **Deferred-finding ledger**: R2-P1-002 and R2-P1-003, cited by finding ID, file, and line from `deep-review-findings-registry.json`, stated as out of this packet's changed-file scope.

### Data Flow

```text
deep-review-findings-registry.json (R1-P1-001) -> directExecutor() fix (read-only citation)
                                                          |
                                    +---------------------+---------------------+
                                    |                                           |
                     shared/Pi/Node suites re-run                cross-runtime docs existence check
                                    |                                           |
                                    +---------------------+---------------------+
                                                          |
                                          implementation-summary.md ledger + explicit R2 deferral
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Shared inspector (`directExecutor`, `inspectDispatch`, `matchDispatchShape`) | Read only; cite lines 186-197 for the fix | `grep -n "quoted" .opencode/hooks/dispatch/lib/dispatch-audit.mjs` |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Shared inspector tests | Read only; re-run to confirm the 4+1 new rows pass | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Pi `tool_call` preflight consumer of `inspectDispatch` | Read only; cite line 243 short-circuit on `kind === "none"` | `grep -n 'kind === "none"' .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Pi factory + deny-matrix tests | Read only; re-run to confirm pass | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Node-native rule tests | Read only; re-run via `node --test` | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` |
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md` | New cross-runtime manual-testing scenario | Read only; confirm existence | `ls -la <path>` |
| `.opencode/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` | New cross-runtime feature-catalog entry | Read only; confirm existence | `ls -la <path>` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` | R2-P1-002 file (receipt MAC advisory) | Not touched; cited only for the deferral record | None (out of scope) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | R2-P1-003 file (dirty-path containment) | Not touched; cited only for the deferral record | None (out of scope) |

Required inventories:
- Fix location: `grep -n "directExecutor\|EXECUTOR_BASENAMES\|quoted" .opencode/hooks/dispatch/lib/dispatch-audit.mjs`.
- Consumer short-circuit: `grep -n 'kind === "none"' .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`.
- Deferred findings: `deep-review-findings-registry.json` `openFindings[].findingId` for `R2-P1-002` and `R2-P1-003`.
- Invariant: no claim in this packet's docs exceeds what an independently re-run command or a direct file read supports.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `deep-review-findings-registry.json` for the exact R1-P1-001, R2-P1-002, R2-P1-003 text, files, and lines.
- [x] Read the current `directExecutor()` source and confirm the blanket quoted-executor guard is absent.
- [x] Confirm the two cross-runtime documentation artifacts exist on disk.

### Phase 2: Core Documentation
- [x] Author `spec.md` recording the root cause, fix, scope, and explicit R2 deferral.
- [x] Author `plan.md` (this document) recording the verification-first approach.
- [x] Author `tasks.md` and `checklist.md` with command-backed evidence rows.
- [x] Author `implementation-summary.md` with the final evidence ledger and `git status` disclosure.

### Phase 3: Verification
- [x] Re-run the shared inspector, Pi preflight, and Node rule suites and record observed counts.
- [x] Re-run a whole-`dispatch/`-directory sweep (excluding worktree mirrors) and record the result.
- [x] Generate `description.json` and `graph-metadata.json` via the repo scripts (no hand-fabrication).
- [x] Run `validate.sh --strict` on this phase folder and record the exact result line and exit code.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Shared inspector | `inspectDispatch`/`matchDispatchShape` direct/prose/quoted/ambiguous/malformed rows | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` |
| Pi preflight | Deny matrix + registered `input`/`tool_call` factory boundary | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| Node rule | Hard-rule parsing, check-id mapping, fail-open behavior | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` |
| Directory sweep | Every Vitest-collectible file under `.opencode/hooks/dispatch`, excluding worktree mirrors | `npx vitest run .opencode/hooks/dispatch --reporter=dot --exclude "**/.worktrees/**"` |
| Claim scan | Confirm the quoted-guard removal in source | `grep -n "quoted" .opencode/hooks/dispatch/lib/dispatch-audit.mjs` |
| Artifact existence | Cross-runtime docs | `ls -la .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md .opencode/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` |

Each command's exit status and output are read before being cited in `implementation-summary.md`. The `dispatch-rule-checks.test.mjs` file uses `node:test` syntax and is not Vitest-collectible; it is run separately via `node --test`, consistent with how the whole-directory sweep is scoped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Uncommitted fix in `dispatch-audit.mjs` / `dispatch-audit.test.mjs` / `dispatch-preflight-lint.ts` / `dispatch-preflight-lint.test.ts` | Local working tree | Present, uncommitted | Evidence in this phase reflects the current working-tree state; a later `git stash` or reset elsewhere could invalidate it without touching this phase's docs. |
| `review/deep-review-findings-registry.json` | Local, read-only | Present | Loss of this file would remove the finding-ID citation source; this phase's own copies of file/line remain valid regardless. |
| Cross-runtime documentation artifacts | Local, authored separately | Present | If either artifact is later removed, REQ-004 in `spec.md` would need re-verification, not this phase's authorship. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A cited line number, test count, or file path in this phase's docs is found to be wrong on re-inspection.
- **Procedure**: Correct the wording in the affected document only; do not touch the four dispatch source/test files (they are outside this phase's write boundary) and do not touch `system-deep-loop` files. Re-run the affected verification command and update the citation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `deep-review-findings-registry.json`, current `dispatch-audit.mjs` source | Documentation authoring |
| Documentation | Setup citations | Verification |
| Verification | All docs authored | Metadata generation and `validate.sh --strict` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Citation and evidence gathering | Low | 0.5-1 hour |
| Documentation authoring | Medium | 1-2 hours |
| Verification and metadata generation | Low | 0.5-1 hour |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every line number cited in `spec.md`/`plan.md` was confirmed against the live source at authoring time.
- [x] No `system-deep-loop` file was opened for edit.
- [x] `git status --porcelain` was captured for the four dispatch files before claiming completion.

### Rollback Procedure
1. If a citation is wrong, correct only the affected phase-local document.
2. Re-run the specific verification command that citation depended on.
3. Re-run `validate.sh --strict` on this folder.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete only this phase's own files if the packet needs to be re-scoped; never delete or alter the four dispatch source/test files or any `system-deep-loop` file from inside this phase.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- Specification: [spec.md](spec.md)
- Tasks: [tasks.md](tasks.md)
- Checklist: [checklist.md](checklist.md)
- Evidence predecessor: [../007-dispatch-validation-evidence/plan.md](../007-dispatch-validation-evidence/plan.md)
- Finding source: [../review/deep-review-findings-registry.json](../review/deep-review-findings-registry.json)
