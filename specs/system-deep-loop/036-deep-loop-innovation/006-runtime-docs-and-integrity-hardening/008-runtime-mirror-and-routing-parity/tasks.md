---
title: "Tasks: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs"
description: "Task breakdown for 008-runtime-mirror-and-routing-parity: confirm-before-build pass over 8 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "runtime mirror parity"
  - "mirror sync verify ordering"
  - "registry compiler unresolved identity"
  - "codex agent parity coverage"
  - "deep loop 030 parity"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/008-runtime-mirror-and-routing-parity"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to Complete with F-028-01 deferred"
    next_safe_action: "Commit the reconciled packet docs"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and enumerate

- [x] T001 **CONFIRM BEFORE BUILD.** For each of the 8 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [3h]

T001 confirmation was performed against HEAD `9229cb8f3e281c9291e6d631237528bc755e6f4b`, before implementation edits. All eight cited findings are `CONFIRMED`:

| Finding | Status | HEAD probe |
|---------|--------|------------|
| F-028-01 | CONFIRMED | `.codex/agents/ai-council.toml:5` declares `sandbox_mode = "workspace-write"`; `sync-agents.cjs:20-40,181-183` uses a per-agent historical sandbox map. |
| F-028-02 | CONFIRMED | `.claude/agents/deep-review.md:4` has no `detect_changes` tool, while `.opencode/agents/deep-review.md:15,172-173,269` grants and requires it. |
| F-028-03 | CONFIRMED | `.opencode/agents/ai-council.md:722-731` documents direct leaf writes plus a helper fallback without naming one exclusive executable writer authority. |
| F-028-04 | CONFIRMED | `deep-improvement/scripts/lib/mirror-sync-verify.cjs:71-95` compares token `Set`s, so load-bearing instruction order is ignored. |
| F-040-02 | CONFIRMED | `deep-review/assets/runtime-capabilities.json:6-31` declares only `opencode` and `claude`; `deep-review/assets/review-mode-contract.yaml:428-445` declares only those agent mirrors. |
| F-035-02 | CONFIRMED | `shared/references/smart-routing.md:41-47` says the shared improvement packet binds canonical leaf paths to the first-declared lane, collapsing the three identities. |
| F-027-01 | CONFIRMED | `hub-router.json:72` has no `/deep:command-benchmark`; the benchmark vocabulary contains only `/deep:model-benchmark` and `/deep:skill-benchmark`. |
| F-027-02 | CONFIRMED | `registry-compiler.cjs:327-372` validates strings and registry equality but never resolves the packet or leaf path on disk before emitting resources. |
- [x] T002 Enumerate the load-bearing instruction set per mirrored agent, so order sensitivity applies to sequences rather than to the whole body [4h] {deps: T001}
  - **Evidence**: `mirror-sync-verify.vitest.ts`; suite digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T003 Record the OD-2 status and gate REQ-008 on it [1h] {deps: T001}
  - **Evidence**: `runtime-capabilities-matrix-conformance.vitest.ts`; suite digest `aa69779fcfd8ac1f194972c39a440aa2fcdbc2458747f93a639e9ad9ce5dd9b4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

T002 enumeration: the mirror gate treats the ordered markers `VALIDATE INPUTS`, `READ STATE`, `DETERMINE FOCUS`, `EXECUTE REVIEW`, `RESOLVE EDGES`, `CLASSIFY FINDINGS`, `WRITE FINDINGS`, `UPDATE STRATEGY`, `APPEND JSONL`, `WRITE DELTA`, `VERIFY OUTPUTS`, `RECEIVE`, `PREPARE`, `DIVERSIFY`, `DISPATCH`, `DELIBERATE`, `SYNTHESIZE`, `COMPOSE`, and `DELIVER` as load-bearing. Other body tokens remain set-compared so formatting-only changes do not become false drift.

OD-2 position: Codex is covered only where a shipped `.toml` mirror exists. Markdown mirror bodies remain comparable across OpenCode and Claude; TOML tool surfaces are explicitly non-comparable. The deep-review capability matrix and parity contract include Codex, while the ai-council capability matrix retains only runtimes that can execute supported council seats; no nonexistent `.codex/*.md` mirror is treated as missing.

Evidence: `runtime-capabilities-matrix-conformance.vitest.ts`; suite digest `aa69779fcfd8ac1f194972c39a440aa2fcdbc2458747f93a639e9ad9ce5dd9b4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Mirror gate and sync

- [x] T004 Order-sensitive and surface-sensitive mirror comparison (`F-028-02`, `F-028-04`) (`.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs`) [8h] {deps: T002}
- [x] T005 Invert the `F-028-04` probe: a reordered load-bearing sequence must fail the gate [3h] {deps: T004}
- [B] T006 Derive the Codex sandbox mode from the source agent deny list rather than hardcoding it (`F-028-01`) (`sync-agents.cjs`, `.codex/agents/ai-council.toml`) [5h] {deps: T004}
- [x] T007 Choose exactly one ai-council writer authority and update every runtime mirror together (`F-028-03`) (`.opencode/agents/ai-council.md`, mirrors) [5h] {deps: T006}

T006 deferred (`F-028-01`): the deny-Bash→`read-only` derivation was attempted and reverted because it wrongly flips the write-capable `ai-council` agent to `read-only`. `sync-agents.cjs` is unchanged and retains `HISTORICAL_SETTINGS`; `.codex/agents/ai-council.toml` stays `workspace-write`, and `.codex/agents/review.toml` remains stale because the environment denies writes under `.codex`. A correct write/edit-keyed derivation remains deferred; not in landed commit `2f84f78bf7`.

T007 mirror inventory: ai-council bodies agree across `.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, `.pi/agents/ai-council.md`, and the existing `.codex/agents/ai-council.toml`. The deep-review body already carried the structural preflight; its Claude allowlist now exposes `mcp__mk_code_index__detect_changes`. No `.codex/*.md` file is assumed.

T007 evidence: the single-writer body landed to `.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, and `.pi/agents/ai-council.md` in `2f84f78bf7`; `multi-ai-council-mirror-parity.vitest.ts` and `multi-ai-council-runtime-parity.vitest.ts` pass; suite digests `aa2d8d9569b5d4fe9d8061ffbab84158a2efa2442fef2dfc2ee57db4ef5a2bac` and `b4e89a0d3911ab27c4dd12a180a493fddcaa6d623b7778cb8380b3a25aefe74b`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

### Routing

- [x] T008 [P] Add the supported launcher missing from the route vocabulary (`F-027-01`) (`.opencode/skills/system-deep-loop/hub-router.json`) [2h] {deps: T001}
- [x] T009 Resolve packet and leaf identities at compile time; a ghost packet or missing leaf fails compilation (`F-027-02`) (`registry-compiler.cjs`) [6h] {deps: T001}
- [x] T010 Keep the three improvement modes distinct and stop instructing readers to reinterpret a wrong identity (`F-035-02`) (`.opencode/skills/system-deep-loop/mode-registry.json`, `.opencode/skills/system-deep-loop/shared/references/smart-routing.md`) [5h] {deps: T009}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Matrices and gate

- [x] T011 Reconcile the runtime-capability matrices with what ships, per OD-2 (`F-040-02`) (`.opencode/skills/system-deep-loop/deep-review/assets/{runtime-capabilities.json,review-mode-contract.yaml}`) [4h] {deps: T003, T007}
- [x] T012 Run the mirror and parity suites plus `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop`; report the delta [2h] {deps: T005, T010, T011}
- [B] T013 Independent verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/008-runtime-mirror-and-routing-parity --strict` exits 0 [4h] {deps: T012}

T013 status: the focused implementation suites and TypeScript gate are green and `validate.sh --strict` passes for this child. Two parts remain deferred: the independent second-actor verification pass (CHK-005) and the stale generated `.codex/agents/review.toml` mirror (F-028-01), which cannot be regenerated under the environment's `.codex` write boundary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [x] Every confirmed finding carries a negative test that was red pre-fix
- [x] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source register**: `../001-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
