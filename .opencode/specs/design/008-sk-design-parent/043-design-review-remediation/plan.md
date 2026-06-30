---
title: "Implementation Plan: design-review remediation (042 findings)"
description: "Scope-locked plan to close the 14 findings from the 042 deep review: parser fix, crawler/runner security hardening, gate-code traceability and DRY consolidation, and an agent-config permission parity narrowing, with invariant re-confirmation."
trigger_phrases:
  - "043-design-review-remediation plan"
  - "design review remediation plan"
  - "sk-design findings remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/043-design-review-remediation"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Record the fix approach, affected surfaces, and verification gates"
    next_safe_action: "Execute the fixes and re-confirm standing invariants"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-043-design-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Affected surfaces inventoried for every changed helper and policy"
      - "Verification path defined per fix before completion claim"
---
# Implementation Plan: design-review remediation (042 findings)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (md-generator backend), Python (gate scripts), Node CJS (benchmark scorer), JSON/Markdown (agent + registry config) |
| **Framework** | None; standalone CLI scripts and agent definitions |
| **Storage** | None |
| **Testing** | `tsc --noEmit`, `python3 -m py_compile`, `node --check`, targeted behavior probes, gate "still bites" checks |

### Overview
Apply 13 surgical fixes plus 1 prose clarification to close the 042 deep-review findings. Each fix is scope-locked to the file the finding names, verified with a concrete check, and followed by a re-confirmation of the standing design-enforcement invariants. The work is corrective, not additive: no new modes, gates, or features.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings enumerated from the 042 review with priority and file (EVIDENCE: spec.md Files to Change)
- [x] Affected surfaces and consumers inventoried for changed helpers (EVIDENCE: Affected Surfaces below)
- [x] Verification command identified per fix (EVIDENCE: Testing Strategy)

### Definition of Done
- [x] All actionable findings landed and orchestrator-verified (EVIDENCE: implementation-summary.md Verification)
- [x] Standing invariants re-confirmed holding (EVIDENCE: checklist.md Invariants section)
- [x] Spec/plan/tasks/checklist/implementation-summary synchronized and validated `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scope-locked remediation against three independent subsystems, verified per fix.

### Key Components
- **md-generator backend** (`guided-run.ts`, `crawl.ts`, `extract.ts`): argument parsing, browser crawl/interaction, and content extraction. The agent orchestrates; this backend does the fetching.
- **Campaign gate code** (`proof_check.py`, `score-skill-benchmark.cjs`, the 7 markdown-table gate scripts): readiness/verdict gating and benchmark scoring.
- **Design agent config** (`.opencode/agents/design.md`, `.claude/agents/design.md`): tool-permission surfaces for the design agent across runtimes.

### Data Flow
A guided run parses args, crawls and interacts with a target site, extracts design-relevant content, and feeds downstream generation. Gate scripts independently parse markdown tables and verdict rows to decide pass/fail. The shared `md_table.py` now centralizes table-cell parsing for all gate scripts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet plans from a deep-review CONDITIONAL verdict and touches parsing, path handling, browser interaction, and shared gate policy, so the affected-surface inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parseGuidedRunArgs` (guided-run.ts) | Resolves URL + flags from argv | update | `tsc --noEmit` 0 errors; positive + missing-value probe cases |
| spawnSync call sites (guided-run.ts) | Run preflight + run commands | update | timeouts present (120000/600000 ms); SIGTERM/error/null-status to failure |
| preflight output-path check (guided-run.ts) | Reports output path safety | update | `unsafeOutputPathReason` flags `--output` inside backend/skill root |
| `triggerModals` (crawl.ts) | Clicks CTAs to reveal design states | update | state-changing intents denylisted; design-revealing kept |
| `dismissCookieBanners` (crawl.ts) | Clears consent overlays | update | known consent selectors dismissed without granting consent |
| `isCaptchaPage` (crawl.ts) | Detects CAPTCHA gating | update | hCaptcha/Turnstile/Arkose/DataDome/PerimeterX detected |
| `--extra-urls` handling (extract.ts) | Adds secondary extraction targets | update | normalized like the primary URL |
| section-header comments (crawl.ts, extract.ts) | Code readability | update | de-duplicated where clean; backend `tsc` 0 errors |
| READY `**` branch (proof_check.py) | Matches READY verdicts | update | verdict/result/checkbox-anchored only; prose `**READY**` excluded; lanes intact |
| human report (score-skill-benchmark.cjs) | Renders benchmark summary | update | advisory-signals line added; hubRoute 34/29/5/0 unchanged |
| `md_table.py` cell helpers | Markdown-table parsing | create + rewire | extracted; 7 gate scripts import via `__file__`-relative path; py_compile clean; gates still bite |
| `.opencode/agents/design.md` webfetch | Tool permission | update | narrowed to `webfetch:deny` for parity with `.claude/agents/design.md` |
| `.claude/agents/design.md` tools list | Tool permission (reference baseline) | unchanged | already omits WebFetch; parity target |
| `.codex/agents/design.md` | Codex design agent | not a consumer | file absent; no parity change needed |
| `mode-registry.json` grandfathered flag | Mode-folder mismatch signal | unchanged (prose only) | `grandfatheredFolderMismatch=false` semantics preserved |

Required inventories:
- Same-class producers (table-cell helpers): the 7 gate scripts were the only duplicators; all now route through `shared/scripts/md_table.py`.
- Consumers of `md_table.py`: `numeric_law_check.py`, `variant_parameter_check.py`, `proof_check.py`, `baseline_rhythm_check.py`, `naming_doc_check.py`, `perf_evidence_check.py`, `polish_readiness_check.py`.
- Algorithm invariant (parser): the URL is the first non-flag token AFTER value-flag values and boolean flags are consumed; value flags require a present, non-`--` value.
- Algorithm invariant (proof_check READY): a READY token counts only when anchored to a verdict/result/checkbox context, never bare bold prose.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Backend correctness and security (guided-run, crawl, extract)
- [x] Rewrite `parseGuidedRunArgs` to skip VALUE_FLAGS and their values plus BOOLEAN_FLAGS; `readValue` rejects missing/`--` values (F-01)
- [x] Add `PREFLIGHT_COMMAND_TIMEOUT_MS`/`RUN_COMMAND_TIMEOUT_MS` and surface SIGTERM/error/null-status as failure (F-02)
- [x] Add `unsafeOutputPathReason` flagging an `--output` path inside the backend/skill root (F-03)
- [x] Denylist state-changing intents in `triggerModals`; keep design-revealing interactions (F-04)
- [x] Target known consent selectors in `dismissCookieBanners` and dismiss without granting consent (F-05)
- [x] Extend `isCaptchaPage` to hCaptcha/Turnstile/Arkose/DataDome/PerimeterX (F-06)
- [x] Normalize `--extra-urls` entries like the primary URL (F-07)
- [x] De-duplicate section-header comments in `crawl.ts` and `extract.ts` where clean (F-08)

### Phase 2: Gate-code traceability and DRY consolidation
- [x] Tighten the proof_check READY `**` branch to a verdict/result/checkbox anchor (F-09)
- [x] Add an advisory-signals line to the score-skill-benchmark human report (F-10)
- [x] Extract `shared/scripts/md_table.py` and rewire the 7 gate scripts via `__file__`-relative imports (F-11)

### Phase 3: Agent config, refuted finding, and verification
- [x] Narrow `.opencode/agents/design.md` to `webfetch:deny` for least-privilege parity (F-12)
- [x] Clarify `mode-registry.json` description prose; no behavioral change (F-13, refuted)
- [x] Re-confirm all standing invariants and run validate.sh `--strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type check | md-generator backend (guided-run, crawl, extract) | `tsc --noEmit` (0 errors) |
| Parser behavior | `parseGuidedRunArgs` positive + missing-value cases | Node invocation probes |
| Compile | All 7 Python gate scripts + `md_table.py` | `python3 -m py_compile` |
| Import resolution | Gate scripts from a foreign cwd | Absolute-path import probe |
| Gate "still bites" | numeric_law_check, naming_doc_check, proof_check lanes | Direct script runs with crafted inputs |
| Syntax | `score-skill-benchmark.cjs` | `node --check` |
| Invariants | surface check, hubRoute, evergreen, backend tsc | design-command-surface-check + benchmark + evergreen scan |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `042-design-work-deep-review` findings registry | Internal | Green | Without it the finding list and priorities are unavailable |
| md-generator backend toolchain (`tsc`) | Internal | Green | Cannot type-verify backend fixes |
| Python 3 runtime | Internal | Green | Cannot compile/verify gate scripts |
| Node runtime | Internal | Green | Cannot `node --check` the benchmark scorer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix regresses a standing invariant (surface check drift > 0, hubRoute change, a gate stops biting, or backend tsc errors).
- **Procedure**: revert the single offending file via source control; each fix is independent and scope-locked, so a per-file revert restores the prior behavior without affecting the other 13 fixes. Re-run the invariant checks after the revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Backend correctness + security) ──► Phase 3 (Verification)
Phase 2 (Gate-code traceability + DRY) ─────► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Backend fixes | Finding inventory | Verification |
| Phase 2: Gate-code fixes | Finding inventory | Verification |
| Phase 3: Agent config + refuted + verify | Phase 1, Phase 2 | None |

Phases 1 and 2 are independent (different subsystems) and could run in parallel; Phase 3 verification depends on both landing.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Backend correctness + security | Med | 8 fixes, surgical |
| Phase 2: Gate-code traceability + DRY | Med | 3 fixes, includes 7-script rewire |
| Phase 3: Agent config + refuted + verification | Low | 2 fixes plus invariant re-confirmation |
| **Total** | Med | **14 findings closed and verified** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change checklist
- [x] Baseline invariants captured before edits (surface-check PASS, hubRoute 34/29/5/0, naming gate exit 0, backend tsc 0 errors)
- [x] Each fix scope-locked to a single named file
- [x] No data migration or persistent state involved

### Rollback procedure
1. Identify the single file whose fix regressed an invariant.
2. Revert that file via source control (`git revert` or restore prior blob).
3. Re-run the invariant checks plus the fix's own verification command.
4. Confirm the other 13 fixes are unaffected, since each is independent.

### Data reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A; all changes are code, config, and documentation.
<!-- /ANCHOR:enhanced-rollback -->
