---
title: "Feature Specification: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift"
description: "Three validate.sh rules (STATUS_CROSS_DOC_CONSISTENCY, METADATA_DISK_PATH_CONSISTENCY, GRAPH_METADATA_CHILD_DRIFT) ship advisory-only behind default-OFF *_ENFORCE flags. This packet applied the repo's proven SPECKIT_GENERATED_METADATA_GRANDFATHER graduation pattern (backfill every violation to zero, verify zero via a tree-wide advisory census, then flip) to all three, sequenced least-to-most risky, with the child-drift flip additionally gated on a new dist-presence freshness guard since its enforce mode fails closed on a missing scanner dist. All three flags now default to enforcing; a final tree-wide sweep confirmed zero net-new regression."
trigger_phrases:
  - "validation enforce graduation"
  - "status cross-doc enforce flip"
  - "metadata disk consistency enforce flip"
  - "child drift enforce flip"
  - "advisory to enforce flag graduation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/010-validation-enforce-graduation"
    last_updated_at: "2026-07-10T07:22:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Landed and verified all 3 phases"
    next_safe_action: "Packet 019 closed — proceed to packet 023 (self-healing model consolidation)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-019-validation-enforce-graduation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Three `validate.sh` rules — `STATUS_CROSS_DOC_CONSISTENCY`, `METADATA_DISK_PATH_CONSISTENCY`, and `GRAPH_METADATA_CHILD_DRIFT` — already ship real detection logic but stay advisory-only: each reports `pass` with an advisory message today and only escalates to a `--strict`-failing `warn` once its own `SPECKIT_*_ENFORCE` env flag is explicitly set `true`. All three flags default `false` (advisory) as of this spec. This packet graduates all three to enforcing-by-default, reusing the exact backfill-to-zero → tree-wide-verify → flip sequence this repo already proved out for `SPECKIT_GENERATED_METADATA_GRANDFATHER` (`mcp_server/lib/config/capability-flags.ts:77-103`) and for the full-tree reconciliation pass in `008-metadata-rename-reconciliation`. The three graduations are sequenced least-to-most risky — status cross-doc first (pure shell, zero daemon risk), metadata disk-path second (same bar, but a fresh census, not 008's stale one), child drift last (its enforce mode fails closed on a missing scanner dependency, so it additionally needed a new dist-presence guard before it could safely flip). All three phases are now complete and verified.

**Key Decisions**: Reuse the grandfather backfill→verify→flip pattern rather than invent a new graduation mechanism (ADR-001); sequence least-risky-first per the task's own ordering rationale (ADR-002); build a dist-presence freshness guard for the child-drift scanner before flipping that one flag (ADR-003).

**Critical Dependencies**: Packet 017 (flag-parsing trustworthiness) must land first — flipping enforcement defaults on top of unreliable flag parsing would make every downstream `--strict` result unreliable. See Risks & Dependencies.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete — all 3 phases landed (SPECKIT_STATUS_CROSS_DOC_ENFORCE, SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE, SPECKIT_CHILD_DRIFT_ENFORCE all graduated to enforcing-by-default), tree-wide post-flip sweep clean |
| **Created** | 2026-07-09 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-speckit/004-memory-search-intelligence |
| **Depends On** | 017 (flag-parsing trustworthiness) — hard blocker, must land first |
| **Estimated LOC** | ~150-250 (mostly a census driver script, a dist-presence guard, and per-file flag flips; the bulk of the "change" is generated-metadata regeneration, not hand-written code) |
| **Predecessor** | ../009-validation-hardening-fixes/spec.md |
| **Successor** | ../011-drift-audit-remediation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three validation rules exist, run on every `validate.sh --strict` invocation, and correctly detect real drift — but none of them can actually fail validation today, because each is gated by its own default-`false` enforce flag:

1. **`STATUS_CROSS_DOC_CONSISTENCY`** (`scripts/rules/check-status-cross-doc-consistency.sh`) classifies `spec.md` and `implementation-summary.md` `Status` fields via the shared `classify_status()` and, when they disagree, checks `SPECKIT_STATUS_CROSS_DOC_ENFORCE` (`:51`). Unset or `false`, the disagreement is reported as `RULE_STATUS="pass"` with an advisory message (`:55-58`) — `--strict` never sees it. Only `true` produces `RULE_STATUS="warn"` (`:52-54`), which `validate.sh --strict` then escalates to a hard failure (`scripts/spec/validate.sh:1082,1097,1105,1232` — a `warn` count `>0` under `$STRICT_MODE` and not `$LEGACY_GRANDFATHERED` exits 2). The flag itself is documented and default-OFF-advisory in `ENV_REFERENCE.md:168,470`.
2. **`METADATA_DISK_PATH_CONSISTENCY`** (`scripts/rules/check-metadata-disk-consistency.sh`) compares `description.json`/`graph-metadata.json`'s stored path fields against the folder's real on-disk path via a Node helper, and gates the same way: `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` (`:55`), advisory `pass` by default (`:59-63`). Documented default-OFF-advisory in `ENV_REFERENCE.md:167,469`.
3. **`GRAPH_METADATA_CHILD_DRIFT`** (`scripts/rules/check-graph-metadata-child-drift.sh`) detects when a phase parent's `children_ids` is missing an on-disk phase child the writer would add on its next refresh, via `listDerivedChildNames()` loaded from a compiled scanner dist (`scripts/dist/spec/is-phase-parent.js`, resolved at `:56` from source `scripts/spec/is-phase-parent.ts`). Gated by `SPECKIT_CHILD_DRIFT_ENFORCE` (`:100,111`), advisory by default (`:116-121`). Unlike the other two, this flag is **not documented anywhere** — a repo-wide grep of `ENV_REFERENCE.md` and every `.md` under `system-spec-kit` for `CHILD_DRIFT` returns zero matches, confirmed at spec time. It also has a second, qualitatively different failure mode: if the scanner import throws or the JSON is unreadable, the rule returns `rc=20` or `rc=21`, and under enforce (`:99-107`) that is treated as **fail-closed** — a `warn` that `--strict` escalates — because "a real gap could hide behind an unavailable dependency" (the rule's own comment, `:96-98`). This repo has already hit real dist-availability breakage this session (native-ABI mismatches causing daemon SIGBUS crashes, Node-version-mismatched builds), so this specific flip carries a live, not hypothetical, risk of tripping `--strict` repo-wide the next time a build goes stale.

This repo already solved exactly this shape of problem once: `SPECKIT_GENERATED_METADATA_GRANDFATHER` (`mcp_server/lib/config/capability-flags.ts:77-103`) shipped **default-OFF-enforcing** ("Default-OFF-enforcing, graduated on a measured benchmark. The scoped migration restamped the legacy description.json and graph-metadata.json files, so the [strict comparison is now safe by default]" — doc-comment, `:77-90`), i.e. the same backfill-then-flip shape this packet needs, just already completed for a different rule (`GENERATED_METADATA_INTEGRITY`'s `source_fingerprint` check). Separately, `008-metadata-rename-reconciliation` already ran a full-tree apply of the reconciliation driver (`migrate-generated-json.js`) across all 2,503 spec folders enumerated at that time (`08-metadata-rename-reconciliation/spec.md:87-93`) and explicitly flagged, in its own Out-of-Scope section, that "a separate 'validation-integrity-hardening' phase depends on this phase landing first, per the master plan; not built here" (`spec.md:187-189`) — establishing this repo's convention of stating cross-packet sequencing dependencies explicitly in spec.md rather than assuming them.

That 008 reconciliation pass is also why Phase 2 of this packet cannot simply reuse 008's own counts: 008 ran before a large folder re-nest campaign moved multiple spec folders under this same 028 parent (`013→005/050`, `014→000/015`, `015→004/007`, `016→001/031`, per this session's own continuity record), which is known to have left some folders' generated metadata pointing at pre-move paths. Backfilling against 008's stale baseline instead of a fresh one would either under-count real current drift or waste effort reconciling folders that moved again since.

### Purpose

Turn all three rules from silently-advisory to actually-enforcing, using the repo's own proven graduation shape: reconcile every real violation to zero, verify zero with a tree-wide advisory-mode census, then flip the default — sequenced so the safest, most-mechanical flip (status cross-doc) lands first and the riskiest, fail-closed-on-missing-dependency flip (child drift) lands last, only after a new guard makes that specific failure mode safe to enforce.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Phase 1 — `SPECKIT_STATUS_CROSS_DOC_ENFORCE`**: tree-wide advisory census across `.opencode/specs`, reconcile every real `spec.md`/`implementation-summary.md` status mismatch, re-census to zero, flip the flag's default in `capability-flags.ts`, update `ENV_REFERENCE.md`.
- **Phase 2 — `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`**: a **fresh** mismatch census taken immediately before backfilling (not a reuse of 008's baseline), explicit accounting for the post-008 re-nest campaign's known dirty tail, reconciliation via the canonical generator (never hand-edited JSON), re-census to zero, flip, doc update.
- **Phase 3 — `SPECKIT_CHILD_DRIFT_ENFORCE`**: build and prove a dist-presence/freshness guard for the child-scanner dependency (`scripts/dist/spec/is-phase-parent.js`) first; only then run the same backfill→verify→flip sequence for `children_ids` drift; add the missing `ENV_REFERENCE.md` documentation for this flag (currently absent).
- Updating the three flags' doc-comments in `capability-flags.ts` to record "graduated on a reconciled tree-wide census," matching the precedent's own language.
- A tree-wide `validate.sh --strict` (or `strict-pass-freshness.ts`) verification sweep after all three flips, confirming zero net-new regressions.

### Out of Scope

- **Packet 017** itself (flag-parsing trustworthiness) — this packet consumes 017's result as a precondition, it does not implement it.
- Any change to the three rules' detection logic (the classifiers, the disk-path comparator, the child-scanner) beyond what the dist-presence guard requires — the rules already correctly detect what they claim to detect; this packet is about trusting that detection by default, not rewriting it.
- Graduating any other advisory-only flag not named in this packet's scope (e.g. `SPECKIT_GENERATOR_HARDENING`'s own remaining grandfather question, noted as still-open in `008-metadata-rename-reconciliation/spec.md:332-333`).
- Building a general-purpose repo-wide "flag graduation harness." Each phase's census is a purpose-built, disposable script, matching how 015's and 008's own repo-wide reconciliation passes were run (one-off, not a permanent tool) — see `plan.md` for the specific reuse of `strict-pass-freshness.ts` where it already fits.
- Re-litigating whether `LEGACY_GRANDFATHERED` (`scripts/spec/validate.sh:181-188`, a per-folder `graph-metadata.json` marker, distinct from the env-var grandfather pattern) should be set on any folder — that is an existing, separate escape hatch this packet does not touch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Flip the three flags' resolved defaults (Phases 1-3) and update their doc-comments |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Update the two documented flags' status rows (`:167-168,469-470`); add the currently-missing `SPECKIT_CHILD_DRIFT_ENFORCE` row |
| `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` | Modify | Add a named `distEntries` key for `dist/spec/is-phase-parent.js` under the existing `system-spec-kit/scripts` package entry (Phase 3 guard) |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh` | Modify | Wire the new dist-presence/freshness guard ahead of the existing rc=20/21 branch (Phase 3) |
| `.opencode/skills/system-spec-kit/scripts/tests/validation-gate-hardening.vitest.ts`, `.opencode/skills/system-spec-kit/scripts/tests/check-graph-metadata-child-drift.sh` | Modify | Add coverage for the new guard and for the flipped defaults |
| `.opencode/specs/**/spec.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` | Modify (generated/reconciled) | Backfilled per-phase census reconciliation; regenerated via the canonical generator scripts, never hand-edited en masse |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 1 (`SPECKIT_STATUS_CROSS_DOC_ENFORCE`) SHALL NOT start until packet 017 has landed. | plan.md/tasks.md record this as a hard precondition; the first Phase 1 task is a check that 017's own `validate.sh --strict` passes. |
| REQ-002 | Phase 1 SHALL reconcile every genuine `STATUS_CROSS_DOC_CONSISTENCY` mismatch across `.opencode/specs` to zero, verified by a tree-wide advisory-mode census, before the default flips. | A census run (flag temporarily forced `true` for the read-only measurement, never left on) reports zero `warn` results for this rule tree-wide; a second, independent re-run immediately before the flip also reports zero (or an individually-explained residual attributable to a concurrent edit, matching 008's and 015's own precedent for documenting such residuals honestly rather than silently rounding to zero). |
| REQ-003 | Phase 2 (`SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`) SHALL take a fresh mismatch census immediately before backfilling, not reuse `008-metadata-rename-reconciliation`'s prior baseline, and SHALL explicitly account for drift the post-008 folder re-nest campaign is known to have introduced. | The fresh census's timestamp, folder count, and mismatch count are recorded in this phase's own `implementation-summary.md`, distinct from and not asserted equal to 008's historical numbers; every mismatch traced to a re-nest-moved folder is reconciled via the canonical generator, not hand-edited. |
| REQ-004 | Phase 3's dist-presence/freshness guard SHALL exist and be independently verified (missing-dist, stale-dist, and fresh-dist fixture cases) before `SPECKIT_CHILD_DRIFT_ENFORCE`'s default is flipped. | `dist-freshness.cjs` gains a named entry covering `scripts/dist/spec/is-phase-parent.js`; `check-graph-metadata-child-drift.sh`'s enforce path fails closed with a clear rebuild-command remediation message when that guard reports missing/stale, verified by a deliberately-broken fixture before the flip, not asserted from reading the code alone. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Once REQ-004's guard is proven, Phase 3 SHALL run the same backfill-to-zero → verify → flip sequence for `children_ids` drift that Phases 1-2 used. | A tree-wide `GRAPH_METADATA_CHILD_DRIFT` census (flag temporarily forced) reports zero drift after reconciliation (via `backfill-graph-metadata.js`, not hand-edited `children_ids`); the default then flips. |
| REQ-006 | `ENV_REFERENCE.md` SHALL document `SPECKIT_CHILD_DRIFT_ENFORCE` — currently entirely absent from it — matching the documentation pattern already given to its two sibling flags. | A new row exists in both the summary table (matching the shape at `ENV_REFERENCE.md:167-168`) and the full flag-reference table (matching `:469-470`). |
| REQ-007 | Each of the three flags' `capability-flags.ts` doc-comments SHALL record that it was "graduated on a reconciled tree-wide census," mirroring `SPECKIT_GENERATED_METADATA_GRANDFATHER`'s own doc-comment language (`:77-90`). | A diff of each flag's doc-comment shows the graduation note added, phrased consistently with the precedent. |
| REQ-008 | A tree-wide `validate.sh --strict` verification sweep SHALL run after all three flips land, confirming no net-new regression beyond the deliberately-reconciled mismatches. | A before/after folder-count comparison (via `strict-pass-freshness.ts` or an equivalent full sweep) is recorded in this packet's `implementation-summary.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_STATUS_CROSS_DOC_ENFORCE` defaults to enforcing, with zero unreconciled `STATUS_CROSS_DOC_CONSISTENCY` mismatches tree-wide at flip time (REQ-001, REQ-002).
- **SC-002**: `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` defaults to enforcing, backed by a census taken fresh (not reused from 008) immediately before backfill (REQ-003).
- **SC-003**: `SPECKIT_CHILD_DRIFT_ENFORCE` defaults to enforcing only after a dist-presence guard exists, is independently verified against missing/stale/fresh fixtures, and is wired ahead of the existing rc=20/21 fail-closed branch (REQ-004, REQ-005).
- **SC-004**: `SPECKIT_CHILD_DRIFT_ENFORCE` is documented in `ENV_REFERENCE.md` for the first time (REQ-006); all three flags' `capability-flags.ts` doc-comments record their graduation (REQ-007).
- **SC-005**: A post-flip tree-wide `validate.sh --strict` sweep shows no net-new regression beyond the reconciled mismatches, recorded with before/after evidence (REQ-008).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 017 (flag-parsing trustworthiness) | Flipping enforcement on top of unreliable flag parsing makes every downstream `--strict` result unreliable | Hard precondition (REQ-001); Phase 1 does not start until 017's own validation passes |
| Dependency (soft, discovered) | `015-validation-hardening-fixes` fixes the `classify_status()` blind spot on `Implemented`/`Implementing` and already reconciled the two real packets it made newly-comparable (`006-presentation-layer-fixes`, `010-query-channel-calibration`) | Running Phase 1's census before 015 lands would either miss newly-comparable folders or double-count folders 015 already reconciled | Sequence Phase 1's census after 015 lands; re-verify 015's own reconciliation is still clean (not re-dirtied) as part of Phase 1's own census, rather than assuming it |
| Risk | Phase 2's fresh-census requirement (REQ-003) is easy to skip by mistake and silently reuse 008's stale numbers instead | Would under- or over-count real current drift, producing a flip decision based on stale data | REQ-003 is a P0 acceptance criterion, not an implementation nicety; the census timestamp is recorded explicitly in `implementation-summary.md` |
| Risk | Phase 3's flip, without the guard, would make `--strict` fail closed repo-wide the next time the scripts-package dist is missing or stale — a real, not hypothetical, failure mode this session already hit (native-ABI mismatches, SIGBUS, Node-version-mismatched builds) | High blast radius: every folder running the child-drift rule under `--strict` | REQ-004 makes the guard a hard precondition to the flip, not a follow-up; guard ships default-dark first (only matters once `SPECKIT_CHILD_DRIFT_ENFORCE=true`) |
| Risk | Concurrent editing sessions re-dirty a just-reconciled folder between census and flip — this repo runs multiple concurrent AI sessions routinely, confirmed by 015's own methodology notes about a mid-investigation concurrent edit | Low-Med: a small residual could appear between verification and flip | Flip promptly after the final re-census; document any residual explicitly (matching 008's and 015's own precedent) rather than silently treating a stale zero as still zero |
| Risk | A repo-wide validation-default flip is inherently high blast-radius (affects `validate.sh --strict` exit code for ~2,470 spec folders as of this spec) | High, if a phase's backfill missed a real violation class | Each phase's flip is committed independently (a single-line `capability-flags.ts` default change per phase), so a bad flip is revertable in isolation without touching the other two flags |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each phase's tree-wide census SHALL complete in bounded time; 008's comparable full-tree dry-run over 2,503 folders completed in well under 3 minutes, and each phase's census is expected to be the same order of magnitude.
- **NFR-P02**: The Phase 3 dist-presence guard SHALL add no meaningful per-validate-run overhead when the dist is fresh (a cached-hash comparison, matching `dist-freshness.cjs`'s existing fast-path for other watched packages).

### Security
- **NFR-S01**: No phase writes generated JSON by hand; all reconciliation goes through the canonical generator scripts (`generate-description.js`, `backfill-graph-metadata.js`), preserving the existing idempotent-write and no-body-mutate guarantees those tools already provide.

### Reliability
- **NFR-R01**: With every flag still at its current default (`false`) until its own phase's flip lands, `validate.sh` output is byte-identical to today's for any folder not yet reconciled — a partially-completed packet (e.g. Phase 1 flipped, Phases 2-3 not yet) leaves Phases 2-3's rules exactly as advisory as they are today.
- **NFR-R02**: A folder whose census-time mismatch cannot be cleanly reconciled (e.g. a genuine, intentional status difference) is documented with an explicit note, never silently excluded from the count.

---

## 8. EDGE CASES

### Data Boundaries
- **Phase-parent folders** (lean trio: `spec.md`, `description.json`, `graph-metadata.json`, no `implementation-summary.md`): `STATUS_CROSS_DOC_CONSISTENCY` already early-returns "not applicable" when either file is absent (`check-status-cross-doc-consistency.sh:28-31`) — phase parents are naturally excluded from Phase 1's mismatch class without special-casing.
- **A folder with no `graph-metadata.json`/`description.json` at all**: `METADATA_DISK_PATH_CONSISTENCY` already early-returns "not applicable" (`check-metadata-disk-consistency.sh:26-29`) — excluded from Phase 2's count without special-casing.
- **A leaf folder with no numbered subfolders**: `GRAPH_METADATA_CHILD_DRIFT` already short-circuits via its numbered-subdirectory guard (`check-graph-metadata-child-drift.sh:44-50`) — the vast majority of leaf spec folders never reach the scanner at all, bounding Phase 3's real census scope to actual phase parents.

### Error Scenarios
- **`z_archive/` folders**: whether the census scope includes archived folders, or relies on the existing per-folder `legacy_grandfathered` marker (`scripts/spec/validate.sh:181-188`) to exempt them from the strict-escalation consequence of a flip, is resolved during Phase 1 implementation (see Open Questions) — not assumed here.
- **A folder mid-edit by a concurrent session at census time**: treated the same way 008 and 015 treated it — recorded as a timestamped snapshot, re-verified immediately before the flip, not assumed permanently accurate.
- **Phase 3's scanner dist present but stale** (loads without throwing, but implements outdated child-detection logic): the current rc=20/21 branch only defends against total unavailability (import throws, or JSON unreadable) — a stale-but-loadable dist is not currently distinguished from a fresh one. This is exactly the gap REQ-004's guard closes.

### State Transitions
- **Partial completion across phases**: each phase's flip is independent; Phase 1 can ship and flip while Phases 2-3 remain advisory, per NFR-R01.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Three flag flips, a new dist-presence guard, and a repo-wide (~2,470-folder) census-and-reconcile pass per flag |
| Risk | 18/25 | High blast radius (a validation-default flip affects `--strict` across every spec folder); Phase 3 specifically carries a fail-closed dependency risk this session already realized once for unrelated dists |
| Research | 8/20 | Root cause and fix mechanism for every phase confirmed against the live tree at spec time (file:line reads of all three rule scripts plus the grandfather precedent); residual is the 017/015 landing-date unknown |
| Multi-Agent | 4/15 | Single-threaded implementation; no parallel workstream coordination required beyond the guard/census work already noted as parallelizable in plan.md |
| Coordination | 6/15 | Two upstream packet dependencies (017 hard, 015 soft) outside this packet's own control |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 1 census run before 015 lands miscounts newly-comparable folders | M | M | Sequence after 015 (see Risks & Dependencies) |
| R-002 | Phase 2 backfill reuses 008's stale baseline instead of a fresh census | H | M (explicitly flagged in this packet's own scope) | REQ-003 is P0; fresh-census timestamp recorded |
| R-003 | Phase 3 flip trips repo-wide `--strict` on a missing/stale scanner dist | H | M (already realized once this session for unrelated dists) | REQ-004 guard is a hard precondition, not a follow-up |
| R-004 | Concurrent session re-dirties a reconciled folder between census and flip | L-M | M | Prompt flip after final re-census; document residuals honestly |
| R-005 | A bad flip is hard to isolate and revert | H if realized | L (each flip is a single independent line) | Commit each phase's flip separately |

---

## 11. USER STORIES

### US-001: Trust the status cross-doc check (Priority: P0)

**As a** spec-folder author, **I want** `STATUS_CROSS_DOC_CONSISTENCY` to actually fail `--strict` on a real mismatch, **so that** a stale `Status` field in `spec.md` or `implementation-summary.md` is caught before I claim completion, not silently reported as advisory.

**Acceptance Criteria**:
1. Given a folder whose `spec.md` and `implementation-summary.md` `Status` fields classify to different buckets, When `validate.sh --strict` runs after Phase 1's flip, Then the folder fails with a clear remediation message instead of an advisory-only pass.

### US-002: Trust the metadata disk-path check (Priority: P0)

**As a** spec-folder maintainer, **I want** `METADATA_DISK_PATH_CONSISTENCY` to fail `--strict` on a real path mismatch, **so that** a folder left pointing at its pre-rename path after a move is caught automatically, not only when someone happens to run a manual reconciliation pass.

**Acceptance Criteria**:
1. Given a folder whose `description.json`/`graph-metadata.json` still reference a pre-move path, When `validate.sh --strict` runs after Phase 2's flip, Then the folder fails with the mismatch detail instead of an advisory-only pass.

### US-003: Trust the child-drift check without new fragility (Priority: P0)

**As a** spec-folder maintainer working on a phase parent, **I want** `GRAPH_METADATA_CHILD_DRIFT` to fail `--strict` on a real `children_ids` gap, without that same enforce mode ever failing closed just because a build went stale, **so that** the protection is real without becoming a new source of spurious repo-wide `--strict` failures.

**Acceptance Criteria**:
1. Given a phase parent missing a real on-disk child from `children_ids`, When `validate.sh --strict` runs after Phase 3's flip, Then the folder fails with the missing-child detail.
2. Given the child-scanner dist is stale or missing, When `validate.sh --strict` runs under enforce, Then the guard fails closed with a clear rebuild-command remediation message rather than silently reporting clean.

---

## 12. OPEN QUESTIONS

- Does the census scope for all three phases include `z_archive/` folders, or are they exempted via the existing per-folder `legacy_grandfathered` marker in `graph-metadata.json`? Resolved during Phase 1 implementation, not assumed in this spec.
- Should Phase 3's dist-presence guard live inside `check-graph-metadata-child-drift.sh` itself (a local check before the existing scanner import) or as a `validate.sh` preamble check shared with the orchestrator's own existing `dist-freshness.cjs` usage (`scripts/spec/validate.sh:993-1011`)? `plan.md` records the chosen approach and why.
- Is the ~2,470-spec.md-file count (this session's own tree walk, excluding `z_future/`) still accurate at implementation time, or does it need re-counting given this repo's high concurrent-edit rate? Treated as a live figure, not a frozen constant, matching 015's own explicit caveat about its repo-wide figures.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Precedent**: `mcp_server/lib/config/capability-flags.ts:77-103` (`SPECKIT_GENERATED_METADATA_GRANDFATHER`), `008-metadata-rename-reconciliation/spec.md` (full-tree reconciliation pass)

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive summary, risk matrix, user stories, open questions
-->
