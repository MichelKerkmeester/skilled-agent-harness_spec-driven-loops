---
title: "Plan: sk-design remediation closeout"
description: "Implementation plan for the five items 007-consolidation-remediation left open, ordered cheapest-and-most-confidence-enabling first. Nothing here has been executed."
trigger_phrases:
  - "sk-design remediation closeout plan"
  - "styles sha256 verification plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/008-remediation-closeout"
    last_updated_at: "2026-07-27T09:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Executed Phases 1-4 (styles, benchmark, 006-warning, --level fix); Phase 5 Planned"
    next_safe_action: "Await operator go/no-go on Phase 5; separately triage pre-existing vitest lock-retry failure"
    blockers:
      - "Phase 5 requires an explicit operator go/no-go before any file is restored"
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/scratch/styles.sha256.before"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-008-remediation-closeout-session"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, ai-fingerprint-registry.json, and the two parity scripts (not the rubric)? Recommendation on record: yes. Awaiting operator go/no-go."
    answered_questions: []
---
# Plan: sk-design remediation closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`shasum`/`sha256sum`), Node/TS (skill-benchmark driver, `generate-description.ts`, `folder-discovery.ts`), Markdown (research.md diagnosis) — no new application logic beyond a one-line addition to an existing picker function |
| **Consumers** | `sk-design` styles corpus, `sk-design` skill-benchmark suite, the `006-design-mode-consolidation` packet's validation gate, every spec-kit packet repo-wide (Phase 4 only), the operator (Phase 5 decision) |
| **Testing** | Checksum comparison, the benchmark driver under `system-deep-loop/deep-improvement/scripts/skill-benchmark/`, `validate.sh --strict`, the system-spec-kit workspace test suite (`npm run test`), one manual `--level 2` generation check |

### Overview
This packet plans the five items `007-consolidation-remediation` explicitly deferred rather than silently dropped — its `checklist.md` CHK-028 (benchmark), CHK-029 (styles checksum), CHK-043 (fixture decision), and `implementation-summary.md` Known Limitations #1-3 — plus one bug (Phase 4) discovered incidentally while authoring this packet's own AFTER AUTHORING step.

Phases are ordered cheapest-and-most-confidence-enabling first: a single checksum comparison, then a benchmark re-run, then a validator diagnosis (already root-caused in this planning pass), then a one-line shared-tooling fix, then an operator-gated fixture restoration that executes last, if at all. Every phase below is Planned; nothing has been executed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Frozen snapshot `006/scratch/styles.sha256.before` located (7,812 entries) and its own git history checked for drift before use as baseline
- [x] Live route-gold in `manual-testing-playbook/*/*.md` spot-checked in this planning pass: 8 sampled `expected_workflow_mode` values (`interface`, `motion`, `md-generator`, `design-mcp-open-design`, or `UNKNOWN`) show no retired-mode reference; a full-playbook audit is still required before execution treats this as gold — **audit run at execution, see Phase 2 below**
- [x] Root cause confirmed for Phase 3: `validateSpecDocSufficiency` (`mcp-server/lib/validation/spec-doc-structure.ts:981-989`) only checks for citation-shaped text inside parsed ANCHOR-comment blocks; `research.md` has zero ANCHOR comments (deep-research's plain-prose template) despite carrying 12 `[SOURCE: ...]` markers in body text
- [x] Root cause confirmed for Phase 4: `generate-description.ts:85-86,115,120-121` already parses `--level` and sets it on the in-memory description correctly in both code paths; the drop happens one layer downstream in `folder-discovery.ts`'s `pickIncomingAuthoredOptionalFields()` (lines 238-249), which hand-copies only `title`, `type`, `trigger_phrases`, `path` — omitting `level` even though `description-schema.ts:25-31,68` already lists it as a known authored optional field

### Definition of Done
- [x] Phase 1: SHA-256 comparison run and recorded — PASS, 7,811/7,812 identical, single delta is a known-deliberate 007 edit (`styles/README.md`)
- [x] Phase 2: **premise corrected, not executed as planned** — no live benchmark route-gold exists to regenerate; full-playbook audit run, `TV-001`/`SR-002` confirmed correct, one genuine residual fixed in `design-mode-pairing-before-run.md`; no new benchmark directory created, no historical directory touched
- [x] Phase 3: `006 --strict` reaches Warnings 0 without rewriting `research.md`'s content — confirmed via re-run
- [x] Phase 4: `level` persists end-to-end on a real generated folder; system-spec-kit workspace test suite re-run with no new failures (one pre-existing, unrelated failure confirmed identical before/after)
- [ ] Phase 5: decision recorded either way; executed only if approved, and only the fixtures + parity scripts, never the scoring apparatus — **still Planned, awaiting operator approval**
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Five independent verification/fix actions. Four (Phases 1-4) touch only their own target and are individually revertible; Phase 5 is operator-gated and restores files from a named prior commit. No shared abstraction or new construct is introduced anywhere in this packet.

### Key Components
- **Phase 1 target**: `006-design-mode-consolidation/scratch/styles.sha256.before` (7,812 lines) vs. the live `sk-design/styles/` tree (7,812 files at authoring time).
- **Phase 2 targets**: live route-gold under `sk-design/manual-testing-playbook/**` (scenario `.md` files with `expected_workflow_mode` frontmatter) vs. frozen historical run records under `sk-design/benchmark/{baseline,after-*,compiled-routing}/**` (15 files mentioning retired modes as historical outcomes — e.g. `compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:83-84,100` recording `TV-001 V2`, `TV-001 V3`, `SR-002 P3` against the old `interface+foundations` topology). The historical files are provenance and stay untouched; only a fresh run's output is new.
- **Phase 3 target**: `mcp-server/lib/validation/spec-doc-structure.ts:927-929` (`looksLikeCitation`) and `:981-989` (`validateSpecDocSufficiency`'s research.md branch), which only look inside parsed anchors that `research.md`'s generator never emits.
- **Phase 4 target**: `mcp-server/lib/search/folder-discovery.ts:238-249` (`pickIncomingAuthoredOptionalFields`), called from `getDescriptionWritePayload` (`:260-269`), called from `savePerFolderDescription` (`:1164`) — the actual write path for every `description.json` in the repo.
- **Phase 5 target**: 25 files recoverable from `b217d74b81^` — 11 fixture pairs, `ai-fingerprint-registry.json`, `ai-fingerprint-self-defect-card.md`, two parity scripts — landing under new paths since the `audit/` subtree they lived under no longer exists.

### Data Flow
1. Compare the styles checksum against its frozen snapshot.
2. Audit and, if needed, regenerate benchmark route-gold; re-run the benchmark against the current topology into a new report directory.
3. Diagnose-confirmed; apply a validator fix or a recorded exemption for `006`'s warning.
4. Patch the shared picker function; rebuild; verify on a real folder; re-run the shared workspace suite.
5. Record the fixture-restoration decision; execute only on approval, scoped to fixtures and parity scripts only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Styles Integrity Verification — DONE, PASS
- [x] Locate the frozen snapshot `006-design-mode-consolidation/scratch/styles.sha256.before` (7,812 lines, one checksum per tracked file)
- [x] Re-confirm the current tree's file count against the snapshot's entry count at execution time — 7,812 in both
- [x] Run the SHA-256 equality check and record PASS/FAIL — **7,811 identical, 1 differing** (`styles/README.md`: `cb036cb18f29…` → `62e030c29751…`)
- [x] If FAIL: escalate as a Logic-Sync conflict — **not needed**; the single delta is a known, deliberate 007 edit (README shrunk 165,030 → 1,928 bytes during that remediation), not drift. The 1,290-record style corpus itself is provably untouched.

### Phase 2: Regenerate The Design Benchmark Route Gold — DONE, PREMISE CORRECTED
- [x] Separate live route-gold from frozen historical run records — **premise was wrong**: `sk-design/benchmark/` contains only dated run-record folders (`2026-07-06--*`, `2026-07-07--*`, `baseline`, `compiled-routing`) plus a README, no live route-gold file at all. `TV-001`/`SR-002` are `manual-testing-playbook` scenario IDs, not benchmark gold — the playbook IS the routing gold, and it had already been reconciled by 007.
- [x] Full audit of live route-gold `expected_workflow_mode` frontmatter across the whole playbook — run at execution. `TV-001` references `audit` only as a legitimate negative control; `SR-002` correctly names two reference-base modes; the apparent 37-vs-36 scenario-count mismatch is not a defect (36 scenarios + 1 non-scenario doc, `compiled-routing/bundle-rules-compiled-routing.md`).
- [x] One genuine residual found and fixed: `manual-testing-playbook/hub-manager-intake/design-mode-pairing-before-run.md` asserted `hub-router.json`'s only `bundleRules` entry (`ui-build-bundle`) pairs `interface`+`foundations`; `routerPolicy.bundleRules` is now `[]` (`commandSubworkflowBundles` was deleted with the retired machinery). Corrected to state no bundleRules are declared, preserving the scenario's conclusion.
- [x] **No benchmark re-run executed** — there was nothing live to regenerate against; a fresh run would only re-produce the same dated-record pattern the historical directories already hold. Zero live `ui-build-bundle` references remain outside frozen benchmark/changelog records.
- [x] `TV-001`/`SR-002` re-checked by name against the corrected playbook — both correct as written; no fresh benchmark run was needed to confirm this

### Phase 3: Clear The 006 Validation Warning — DONE, shared tooling
- [x] Root cause confirmed at execution: `mcp-server/lib/validation/spec-doc-structure.ts:982` — `parsed.anchors.some(...)` returns `false` unconditionally when there are zero anchors, so any anchor-less research doc warned regardless of citation quality
- [x] Fix chosen and applied: (a) durable validator fix — `validateSpecDocSufficiency` now falls back to scanning the whole document body (`looksLikeCitation(document.content)`) when `parsed.anchors.length === 0`
- [x] `research.md` content untouched — the fix lives entirely in the checker
- [x] Re-ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation --strict` — **Errors 0, Warnings 0**, re-confirmed in this pass. Blast radius is repo-wide: this removes a false positive for every deep-research packet with anchor-less `research.md`, not just `006`.

### Phase 4: Fix The Dead --level Flag (Shared Tooling, Repo-Wide Blast Radius) — DONE
- [x] Root cause confirmed: the drop was in `folder-discovery.ts`'s `pickIncomingAuthoredOptionalFields()`, not the CLI parser
- [x] Fix applied: `folder-discovery.ts:247` — `if (desc.level !== undefined) authored.level = desc.level;`, matching the existing four-line pattern
- [x] Rebuilt `dist`
- [x] Verified on a real folder: stripped the field (gone), regenerated with `--level 2` (returned) — end-to-end proof, not just at the parsing layer
- [x] Re-ran the system-spec-kit workspace test suite — no new failures introduced by this change. One pre-existing, unrelated failure found (`handler-memory-save.vitest.ts` lock-retry test, 1 failed / 14 passed), confirmed identical with and without this fix — recorded as a known issue in `implementation-summary.md`, not fixed here. Blast radius is repo-wide: this is the write path for every packet's `description.json`.

### Phase 5: AI-Tell Fixture Restoration (OPERATOR-GATED)
- [ ] Do NOT execute without an explicit operator decision recorded against the Open Question in `spec.md` §7
- [ ] Scope, sourced from `b217d74b81^`: 11 `clean.html`/`tell.html` fixture pairs (22 files, originally under `design-interface/assets/audit/ai-fingerprint-fixtures/ai-fingerprint-<name>/`), `ai-fingerprint-registry.json`, `ai-fingerprint-self-defect-card.md`, and the two parity scripts `shared/scripts/ai-fingerprint-fixture-check.mjs` / `ai-fingerprint-registry-check.mjs`
- [ ] Recommendation on record (not yet approved): restore fixtures + registry + parity scripts only — do NOT restore the `/20` rubric, severity model, report templates, or evidence worksheet; that elimination holds
- [ ] Landing paths differ from the deleted originals: the `audit/` subtree the fixtures lived under no longer exists, so restored fixtures land under the live `design-interface/assets/` tree, and the two parity scripts need repointing at whatever path/format the restored fixtures use post-consolidation
- [ ] Several `interface-preflight-card.md` §11 AI-TELL SWEEP rows correspond by name to specific deleted fixture pairs (e.g. `ai-fingerprint-ghost-card-border-plus-shadow` → the 1px-border-plus-16px-shadow row; `ai-fingerprint-over-rounded-cards` → the border-radius-24px-or-more row; `ai-fingerprint-diagonal-stripe-background` → the diagonal-stripe-background row) — restoring the fixtures would make these rows mechanically decidable again instead of honour-system prose
- [ ] If approved: restore, repoint the two parity scripts, re-run them, and confirm they pass against the restored fixtures — without pulling the deleted scoring apparatus back in as a side effect
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Checksum | Styles corpus byte-stability | `shasum`/`sha256sum` against `006/scratch/styles.sha256.before` |
| Benchmark | Route-resolution accuracy against the 4-mode/3-command topology | `run-skill-benchmark.cjs` / `deep:skill-benchmark` |
| Validation | `006` packet strict gate | `validate.sh --strict` |
| Regression | Shared description-generation tooling, repo-wide | system-spec-kit workspace `npm run test` |
| Manual | `--level` persistence | one real `--level 2` generation + `description.json` inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `006/scratch/styles.sha256.before` | Internal (frozen artifact) | Present, 7,812 entries | Cannot run Phase 1 without it |
| Benchmark driver (`run-skill-benchmark.cjs` / `deep:skill-benchmark`) | Internal | Present | Cannot regenerate Phase 2 evidence |
| `validateSpecDocSufficiency` (`spec-doc-structure.ts`) | Internal | Present, root cause isolated | Cannot close Phase 3 without a fix or exemption decision |
| `pickIncomingAuthoredOptionalFields` (`folder-discovery.ts`) | Internal, repo-wide | Present, root cause isolated | Phase 4 blocked; every packet's `--level` flag stays silently dropped |
| Operator approval | External | Not yet given | Phase 5 cannot execute |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any phase's verification fails after execution, or Phase 4's fix regresses the system-spec-kit workspace test suite.
- **Procedure**: Phases 1-3 are read/verify-only or touch only this packet's own docs — revertible by `git checkout` per file. Phase 4 is a single-function, one-line addition, independently `git`-revertible, plus a `dist` rebuild to match. Phase 5, if ever executed, restores files from `b217d74b81^` — revertible by re-deleting the restored paths.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (styles SHA-256, confidence baseline) ─┐
Phase 2 (benchmark regeneration)               │
Phase 3 (006 validation warning)               ├─ independently executable; ordered by cost/confidence, not technical dependency
Phase 4 (--level flag fix)                     ┘
Phase 5 (fixture restoration) ── gated on operator approval; executes last, if at all
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Styles SHA-256) | None | Confidence baseline for treating Phases 2-5's evidence as resting on a stable corpus (soft, not a hard technical blocker) |
| Phase 2 (Benchmark regen) | None | — |
| Phase 3 (006 warning) | None | — |
| Phase 4 (--level fix) | None | Every other packet's `--level` flag, repo-wide |
| Phase 5 (Fixture restoration) | Operator approval | — |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

Rough, pre-execution estimate: Phase 1 (minutes — one command), Phase 2 (roughly an hour — audit plus one benchmark run plus report authoring), Phase 3 (roughly an hour — root cause already isolated; fix or exemption still to author), Phase 4 (roughly an hour — one-line fix, rebuild, verify, plus a full repo-wide workspace test re-run), Phase 5 (operator-gated; if approved, restoring 25 files and repointing two scripts is itself roughly an hour, but the approval wait is unscheduled).
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Phase 1 run before treating Phases 2-5's evidence as resting on a verified-stable styles corpus — PASS, 7,811/7,812
- [x] Phase 4's fix verified against the full system-spec-kit workspace test suite, not only the one manual `--level 2` check, before any other packet is told to rely on it — re-run, no new failures
- [ ] Phase 5 not executed without a recorded operator approval — **holds; not executed**

### Rollback Procedure
1. **Immediate**: `git checkout -- <file>` per affected file; Phase 5 additionally requires deleting any newly-restored paths.
2. **Verify**: re-run the gate that phase's item named (shasum, benchmark, `validate.sh --strict`, workspace tests).
3. **Confirm**: no other packet's generated `description.json` regressed from the Phase 4 change (spot-check one other recently-generated folder).

### Data Reversal
- **Has data migrations?** No — checksum reads, a benchmark run producing new files, a validator diagnosis, a one-line code fix, and a gated file restoration, all fully reversible by `git checkout`.
<!-- /ANCHOR:l2-rollback -->
