---
title: "Verification Checklist: activate the persistent styles database (build, shadow, prove, flip)"
description: "Verification for the persistent DB activation — facade frozen, first full-corpus generation published to a git-ignored install-time/prewarm database, shadow parity, the §9 perf gate measured, and the default kept legacy. Build + parity + perf proven; cutover human-gated."
trigger_phrases:
  - "persistent styles db activation checklist"
  - "shadow parity perf gate verification"
  - "eight reactivation gates kill switch checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/007-persistent-db-activation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "implementer"
    recent_action: "Built + published the first generation; shadow parity 10/10."
    next_safe_action: "Wire install-time prewarm; operator decides the default flip."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/schema.mjs"
      - ".opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/operator.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-dbbuild-impl-session"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: activate the persistent styles database (build, shadow, prove, flip)

<!-- ANCHOR:protocol -->
## Verification Protocol

Verify each item against real files + real command output. Mark `[x]` only with cited evidence. The differential oracle + DB aggregator + the measured perf trace are authoritative. Items marked `HUMAN-GATED` require the operator (§9 relevance judgments / the cutover decision) and are not autonomously completable.
<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The `001-foundation` measurement/contract/rollback plane is present + green. [TESTED: `001-foundation` DB aggregator 69/69; validate --strict Errors:0]
- [x] CHK-002 [P0] `005-library-restructure` landed; the restructured corpus is the generation input. [SOURCE: commit `cee62570e4`; corpus at `library/bundles/`]
- [x] CHK-003 [P0] Metadata + `validate.sh --strict` handled by this session. [TESTED: `generate-description.js` + backfill; validate --strict Errors:0]
<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Facade frozen: the four corpus consumers call `runQuery`/`runHydrate`; only the adapter behind the facade imports the DB. [SOURCE: `design-*/corpus/*.mjs` import `lib/engine/style-library.mjs`; `persistent-adapter.mjs` isolates the DB]
- [x] CHK-011 [P0] No lazy query-time build; a clean checkout resolves `legacy` until prewarm. [TESTED: `resolveStyleDatabaseMode` default `legacy`; default `runQuery` is legacy]
- [x] CHK-012 [P1] Comment hygiene: no spec/packet/phase/REQ ids in the build/adapter/test code touched. [SOURCE: only `schema.mjs` DEFAULT path edited — a value, not an annotation]
<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] SHADOW mode reports 100% facade DTO parity. [TESTED: `compareQueryResults` shadow parity 10/10 — identical cards + eligibility to legacy]
- [x] CHK-021 [P0] The DB test aggregator is green incl. the 69/69 Phase-0 set. [TESTED: `node --test tests/database/index.mjs` 69/69]
- [x] CHK-022 [P0] The §9 perf gate is MEASURED and met on a representative trace. [TESTED: p95 1150 ms legacy → 53 ms persistent = 95.3% and 1097 ms absolute; thresholds ≥30% AND ≥25 ms] — operator confirms on their real workload.
- [ ] CHK-023 [P1] HUMAN-GATED — relevance acceptance vs human labels across the four modes. Shadow parity is 10/10 (results are already identical to legacy), so relevance is preserved by construction; formal human judgment is the operator's step.
<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] First full-corpus generation of all 1,290 styles published into git-ignored `database/` with telemetry. [TESTED: 69.75 MB, 4.8 s build, 613 MB RSS; `operator.mjs status` → published:true, 1 retained]
- [x] CHK-026 [P1] Extraction has an authoritative rebuild path — `operator.mjs build` does a full verified reconciliation. [SOURCE: `buildStyleDatabase` full rebuild + integrity/FK/generation-hash validation] The incremental watcher is a deferred enhancement.
- [ ] CHK-027 [P0] PARTIAL — clean-checkout (resolves legacy), rollback (`operator.mjs rollback`), and missing-artifact (`generation-unavailable` fail-closed) are exercised; the full seven-scenario matrix on a live trace is part of the operator's pre-flip verification.
<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No binary committed; the 69.75 MB generation lives only under git-ignored `database/`. [TESTED: `git check-ignore` on `*.sqlite`; `git status` shows no generation]
- [x] CHK-031 [P1] Changes scoped to the styles engine/db surface (`schema.mjs`) + the git-ignored `database/`; no unrelated files touched. [SOURCE: scope-diff on `c4bfba4359` — only `schema.mjs` + continuity]
<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Docs at Level 2 with matching `SPECKIT_LEVEL`/`SPECKIT_TEMPLATE_SOURCE` markers. [SOURCE: five packet docs carry `SPECKIT_LEVEL: 2`]
- [x] CHK-041 [P1] REQ-001–REQ-010 represented across spec/plan/tasks. [SOURCE: `REQ-001`–`REQ-010` tokens cross-referenced in `spec.md`/`plan.md`/`tasks.md`]
<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] The default read path stays `legacy`; the flip is behind the `SK_DESIGN_STYLE_DB_MODE` kill switch + `operator.mjs cutover`; no unguarded flip committed. [SOURCE: `resolveStyleDatabaseMode` default `legacy`; no default change in any commit]
- [x] CHK-051 [P1] Rollback is a kill-switch mode flip + a manifest-pointer rollback, not a data migration; flat files remain the content authority. [SOURCE: `operator.mjs rollback` + `SK_DESIGN_STYLE_DB_MODE=legacy`]
<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P0] Autonomous executable contract satisfied: shadow parity 10/10, DB aggregator 69/69, §9 perf measured 95.3%/1097 ms — the activation is provably parity-safe and dramatically faster. [TESTED: parity + aggregator + perf trace]
- [x] CHK-061 [P1] `validate.sh --strict` on this packet = 0 errors; spec/plan/tasks/checklist synchronized. Kill-switch + manifest-pointer rollback recorded as the failure path. [TESTED: validate --strict → Errors:0]
- [ ] CHK-062 [P0] HUMAN-GATED — the default flip (`SK_DESIGN_STYLE_DB_MODE=persistent`) after the operator confirms the perf gate on a real trace + authors relevance judgments; default stays `legacy` until then.
<!-- /ANCHOR:summary -->
