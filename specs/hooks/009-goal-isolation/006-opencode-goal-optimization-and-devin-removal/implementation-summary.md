---
title: "Implementation Summary: OpenCode Goal Optimization and Devin Goal Remnant Removal"
description: "OpenCode goal persistence now uses fixed opaque session keys with validated lazy migration; goal playbooks and active runtime truth are aligned, and retired Devin goal remnants are removed."
status: "in_progress"
trigger_phrases:
  - "opencode goal optimization summary"
  - "goal state migration status"
  - "devin goal remnant removal status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-11T06:43:20.394Z"
    last_updated_by: "codex"
    recent_action: "All six post-review findings are repaired and content gates pass"
    next_safe_action: "Rerun default strict validation after authorized delivery cleans packet paths"
    blockers:
      - "Completion freshness remains red only because the repaired packet diff is intentionally uncommitted."
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
    session_dedup:
      fingerprint: "sha256:07b82ba97f6c6af4afe86919d2ca6a05bb56f1dac4d50bf9d10a0afdf3e47c63"
      session_id: "goal-isolation-phase-6-20260810"
      parent_session_id: null
    completion_pct: 99
    open_questions: []
    answered_questions:
      - "The optimization fixes reversible, unbounded filenames without changing native token accounting."
      - "Historical Devin goal evidence remains; active goal implementations, registrations, and operator contracts contain no Devin goal version."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: OpenCode Goal Optimization and Devin Goal Remnant Removal

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-opencode-goal-optimization-and-devin-removal |
| **Status** | In progress — repair verified; delivery freshness pending |
| **Started** | 2026-08-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

OpenCode's native `mk-goal` plugin now derives each state filename from the full SHA-256 digest of the normalized native session id. New filenames are fixed at 69 characters including `.json`, expose no reversible session identity, and support session ids that exceeded filesystem component limits under the earlier hex layout.

Valid earlier hex-keyed active and archived records are adopted lazily only after a present, non-empty embedded session identity exactly matches the requested normalized session. An existing digest target remains authoritative, malformed, missing-identity, or mismatched sources stay untouched, and new writes never recreate the legacy layout. Long-session clear and deletion paths treat impossible legacy names as absent after canonical deletion. Native `message.updated` token accounting, private persistence, atomic writes, verifier policy, and continuation behavior remain intact.

The runtime-neutral core now hashes `JSON.stringify([canonicalRepositoryRoot, runtime, sessionId])` into one opaque filename. Segment-safe goal identifiers, real-path archive containment, and hashed filesystem mutexes protect replace, clear, complete, turn recording, and legacy migration across processes. Previous scoped files are adopted only from the unambiguous workspace-default layout.

Active goal-specific Devin implementation references and stale runtime-mirror exceptions were removed without changing `.devin` or the `cli-devin` runtime. Historical specs and benchmark records remain as audit evidence. Claude's repository command tree is now a generated directory of per-command relative symlinks: shared commands remain discoverable while the OpenCode-only goal router is excluded. Documentation claims only that proven repository boundary; live Claude product-native goal behavior remains unverified.

### Delivered Surfaces

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-goal.js` | Modified | Add digest keys, validated active/archive adoption, and cache-safe compatibility handling. |
| `.opencode/plugins/tests/mk-goal-{state,lifecycle}.test.cjs` | Modified | Cover long ids, privacy, migration, conflict, mismatch, archive, and history boundaries. |
| `.opencode/hooks/goal/lib/goal-core.cjs` and cross-runtime tests | Modified | Add canonical composite scopes, contained archives, cross-process serialization, safe prior-layout adoption, and adversarial regressions. |
| Runtime mirror generator, parity validator, and `.claude/commands/**` | Modified | Replace Claude's whole-tree link with a fail-closed filtered per-command mirror and make strict parity use the same authored policy. |
| Active goal contracts and manual playbooks | Modified | Preserve unrelated Devin support and align executable scenarios with proven runtime boundaries. |
| Phase 6 and parent packet documents | Updated | Reconcile status, evidence, handover, and metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The initial digest-key implementation was test-driven from the reproduced long-filename failure and was published previously through aggregate commit `ee501b2ec7982b28dfa338ee2f8008fbecd0c981`. This post-review repair treated each finding as a hypothesis, reproduced all six in isolated temporary state, added failing adversarial regressions, and changed one producer at a time. The current repair remains an uncommitted shared-checkout diff because this task did not authorize a commit or push.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use SHA-256 for OpenCode session keys | It bounds filenames, removes reversible identity exposure, and matches the already-verified sibling-core privacy model. |
| Migrate lazily at first access | Existing sessions retain goals without a repository-wide scan or startup migration. |
| Require exact embedded OpenCode session identity | A legacy filename alone cannot establish state ownership; missing or mismatched identity must preserve the source. |
| Hash the complete canonical sibling-core scope tuple | JSON array serialization is unambiguous, repository-root normalization is stable from nested paths, and one opaque key avoids leaking any scope part. |
| Serialize lifecycle mutation with filesystem mutexes | Atomic rename prevents torn writes but cannot preserve concurrent read-modify-write updates across processes. |
| Derive archive names from safe identifiers and verify containment | Stored identifiers are untrusted persistence data and cannot be allowed to choose paths. |
| Generate Claude's filtered command tree | Per-command symlinks preserve shared-command parity while enforcing runtime-exclusive exclusions at the actual discovery boundary. |
| Preserve native usage logic | OpenCode already has tested token accounting; changing it would add risk without addressing the reproduced defect. |
| Preserve unrelated Devin runtime and historical evidence | The request concerns the retired goal version, not the entire runtime or its audit record. |
| Treat broad playbook-package failures as separate backlog | Goal-specific files have zero violations; unrelated legacy scenarios in the large runtime packages are outside this phase. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused OpenCode baseline | PASS: 119/119 before the change. |
| Long-session negative control | PASS as a reproduction: 285-character filename failed with `ENAMETOOLONG`. |
| Six isolated post-review negative controls | REPRODUCED: outside-root overwrite; 39/40 lost turn updates; migration target/source deletion; workspace-key collision; long clear failure plus identity-free adoption; Claude command leakage with a false-green mirror check. |
| Focused OpenCode state/lifecycle | PASS: 70/70. |
| Focused shared core | PASS: 49/49. |
| Focused OpenCode final | PASS: 128/128, up from the 119-test baseline. |
| Integrated core/CLI/Pi/Cursor | PASS: 91/91. |
| OpenCode playbook live snippet | PASS: three 64-hex files, validated migration, and native `tokensUsed:160`. |
| Syntax and comment hygiene | PASS for every changed executable and test surface. |
| Alignment and runtime mirrors | PASS: 42 goal/plugin files with zero findings; 165 mirrors across eight trees in sync. |
| Repository-wide drift wrapper | EXPECTED GLOBAL BACKLOG: exit 1 after scanning 807,825 files with 25,551 findings (12,774 errors and 12,777 warnings); stack folders pass 6/6 and router sync passes 10/10. Packet-scoped goal alignment remains zero findings. |
| Active Devin goal residue | PASS: zero matches in declared active goal surfaces; unrelated Devin worktree diff is empty. |
| Goal and mirror documentation | PASS: nine changed documents have zero document-validator issues; the Claude goal slice has zero package violations. The full Claude package still reports 147 unrelated violations and three warnings. |
| Strict packet validation | PARTIAL PASS: default Phase 6 strict exits 0 with zero errors/warnings. Recursive parent strict exits 2 with zero errors/one parent `dirty_tree` warning while all six child phases pass. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode interactive model visibility remains an environment-only manual check.** The shipped plugin is proven in-process; `opencode run` does not expose `mk_goal` or fire the transform in this environment, so the playbook records that live headless path as SKIP rather than plugin failure.
2. **Live Claude product behavior is unverified.** Repository discovery is proven to exclude the OpenCode-only router, but no claim is made about an independent product-native goal feature.
3. **Broad runtime playbook packages retain unrelated validation backlog.** The Claude goal slice has zero violations; this phase does not repair the other 147 scenario violations and three warnings.
4. **Historical Devin goal records remain intentionally.** Specs and benchmark evidence preserve the old design and decommission trail for auditability.
5. **Unrelated dirty worktree paths remain excluded.** `.codex/AGENTS.md`, `.codex/config.toml`, three MCP discovery fixtures, and packet 019 were not modified by this repair.
6. **The repository-wide alignment wrapper is not green.** Its observed 25,551 findings across 807,825 repository and worktree files are the global backlog; packet-scoped goal/plugin alignment contributes zero findings, while stack folders pass 6/6 and router sync passes 10/10.
7. **Final parent delivery freshness is pending.** This task forbids committing the repaired parent packet, while recursive strict continuity freshness requires parent paths to be clean. No completion claim is made until a later authorized delivery produces a recursive strict exit 0.
<!-- /ANCHOR:limitations -->
