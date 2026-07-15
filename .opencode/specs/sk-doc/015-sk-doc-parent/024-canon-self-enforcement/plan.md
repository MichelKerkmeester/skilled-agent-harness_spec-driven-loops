---
title: "Implementation Plan: Canon self-enforcement (parent-hub hardening)"
description: "Twelve work units in five phases — the foundational trio (widen CI gate, cross-language vocab battery, defuse the edge_type CHECK) first, then a DO-NOW hardening batch, then a gate-adjacent tranche deferred behind the advisor scorer lane and its 193-row re-baseline — each unit with real file:line anchors and a verification gate."
trigger_phrases:
  - "canon self-enforcement plan detail"
  - "014 sk-doc phase 024 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-08T04:03:24Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the twelve-work-unit five-phase plan"
    next_safe_action: "Operator resolves the 3 forks then execute Phase 2 trio"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Canon self-enforcement (parent-hub hardening)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CI YAML (`routing-registry-drift.yml`); Node checker (`parent-skill-check.cjs`); advisor skill-graph (TS `skill-graph-db.ts` + Python `skill_graph_compiler.py`); JSON-schema tool defs; vitest; JSON templates |
| **Framework** | `mode-registry.json` (truth) → ~12 consumer dialects → `parent-skill-check.cjs` + CI drift gate |
| **Storage** | In-repo edits; SQLite self-heal migration for the `edge_type` CHECK (idempotent, mirrors the `family` migration) |
| **Testing** | New vitests (vocab battery, edge_type CHECK, command-binding gate, checker fixtures, discovery parity); `parent-skill-check.cjs` on all four hubs; `validate.sh --strict` |

### Overview
The thesis: canon is declared once in each `mode-registry.json` and hand-transcribed into ~12 dialects that must agree, while every automated guard watches deep-loop only. The fix makes enforcement class-based. **Phase 2 lands the foundational trio** — WU1 widens the CI gate to all hubs by glob, WU2 asserts every dialect agrees, WU3 defuses the next latent CHECK — because together they would have caught BOTH the transport incident and the `sk-hub` incident. **Phase 3** lands the DO-NOW hardening batch (command-binding gate, doctor freshness panel, checker fixtures, discovery parity, description.json guard, a small cluster). **Phase 4** is a GATE-ADJACENT tranche (the `derived.entities` code fix, the vocab-sync prefix bug, and the dead-id + corpus re-baseline) held behind the operator opening the advisor scorer lane and its 193-row parity re-baseline; each carries a gate-free PREP done in Phase 1. Three operator forks carry recommended defaults.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All twelve council opportunities extracted with re-verified file:line anchors (this plan)
- [x] The advisor-scorer-lane gate identified and its dependent units partitioned out
- [ ] The three operator forks resolved (see §6)

### Definition of Done (the "class-based" bar)
- [ ] One CI gate watches `skills/*/mode-registry.json` (all hubs, glob) + hub-router + doctrine/template paths; a 5th hub auto-enrolls
- [ ] One vitest proves family / edge-type / routingClass / packetKind agree across all ~12 dialects; the two gated read-only subsets are flagged-not-asserted
- [ ] The `edge_type` CHECK is dropped + self-healed exactly like `family`; a vitest proves a 6th edge type inserts
- [ ] `parent-skill-check.cjs` runs correctly from any CWD, is fixture-covered, and stays 4/4 (0 warnings) on all four hubs after every DO-NOW unit
- [ ] Every touched spec folder passes `validate.sh --strict`; the gate-adjacent tranche remains PREP-only until the operator opens the lane
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The work units keep the council's item numbers (WU1…WU12) for traceability. Each: opportunity → fix → files (real anchors) → gate. Partition tags: **[DO-NOW]** gate-free; **[GATE-ADJ]** deferred behind the advisor scorer lane; **[DECISION]** carries an operator fork.

### Phase 2 — the foundational trio (lead)

**WU1 — Widen the canon CI gate to all four hubs · P1 · [DO-NOW] · council #1**
- Today `.github/workflows/routing-registry-drift.yml` path-filters only `deep-loop-workflows/mode-registry.json` (`:11`,`:18`) + `system-skill-advisor/mcp_server/**` (`:12`,`:19`) + the checker (`:13`,`:20`); the bare call at `:51` uses `DEFAULT_TARGET` (`parent-skill-check.cjs:90` = `.opencode/skills/deep-loop-workflows`). Three of four hub registries are unwatched (verified: exactly four hubs — sk-code, sk-design, sk-doc, deep-loop).
- Glob-enroll `.opencode/skills/*/mode-registry.json` in both `paths:` blocks (push + PR) so a fifth hub auto-joins; add the missing hub-router and doctrine/template paths; run the checker per-hub (loop the four targets), not the bare default.
- Fix the CWD bug: rule 4a resolves repo-relative paths via `path.resolve(declaredGuard)` (`:599`), `path.resolve(ADVISOR_SCRIPT)` (`:608`), and `path.resolve(argTarget)` (`:194`) — all against `process.cwd()`, so a non-root CWD false-FAILs 4a and can miss the target dir. Compute a repo root (walk up from `__dirname` to the `.opencode` parent or the git root) and resolve against it.
- **Gate**: a synthetic PR editing `sk-code/mode-registry.json` triggers the workflow; the checker run from a subdirectory passes 4a; `parent-skill-check.cjs` stays 4/4 on all hubs.

**WU2 — Cross-language vocabulary-agreement battery · P1 · [DO-NOW] · council #2**
- One vitest asserts the four enum families agree across every dialect: TS unions + consts (`skill-graph-db.ts:47` SkillFamily, `:49-54` SkillEdgeType, `:148` ALLOWED_FAMILIES, `:158` EDGE_TYPES), SQL CHECKs (`skill-graph-db.ts:191` family — now bare `TEXT NOT NULL`, so assert the app-level allowlist; `:209` edge_type CHECK — until WU3 drops it), Python sets (`skill_graph_compiler.py:38` ALLOWED_FAMILIES, `:44` EDGE_TYPES), JSON-schema enum (`skill-graph-tools.ts:45` family), CJS arrays (`parent-skill-check.cjs:43` families, `:48` routingClass, `:53` runtime-loop types), and the markdown/template placeholder (`parent_skill_graph_metadata_template.json:5` — still lists `[cli|mcp|sk-code|deep-loop|sk-util|system]`, MISSING `sk-hub`; WU12 patches the string, this test guards it).
- Glob-enroll the dialect list from a single source table so the test is not a 13th mirror. **Flag-don't-edit** the two deliberate read-only subsets: `skill_advisor.py:242` (`GRAPH_ADJACENCY_EDGE_TYPES` — 4-edge subset, excludes `conflicts_with` by design) and `graph-causal.ts:28-34` (`EDGE_MULTIPLIER` — scorer weights) both live in the gated scorer track; assert they are a SUBSET, never equality.
- **Gate**: the new vitest is green after WU12 patches the template line; deliberately regressing one dialect reds it naming the mirror.

**WU3 — Defuse the `edge_type` SQL CHECK · P1 · [DO-NOW] · council #3**
- `skill-graph-db.ts:209` still has `CHECK(edge_type IN ('depends_on','enhances','siblings','conflicts_with','prerequisite_for'))` — the exact twin of the `family` CHECK that wedged the `sk-hub` scan. Drop it from the `CREATE TABLE` and clone the self-heal migration that already fixed `family` (`skill-graph-db.ts:372-422`: detect the stale CHECK via `sqlite_master`, toggle `foreign_keys OFF`, rebuild the table without the constraint, restore FKs), adapting the detector regex and the rebuilt `skill_edges` schema. App-level `EDGE_TYPES` (`:158`) stays the one gate.
- Add a vitest mirroring the family-CHECK test (`tests/skill-graph-db.vitest.ts:176-219`): a DB carrying the old `edge_type` CHECK self-heals, and an edge of a newly added type inserts.
- **Gate**: the new vitest green; existing `skill-graph-db.vitest.ts` still green; a planted legacy-CHECK DB migrates without cascade-deleting edges.

### Phase 3 — DO-NOW hardening batch

**WU4 — Command-binding existence gate · P1 · [DO-NOW] · [DECISION D1] · council #4**
- New vitest: every command id declared in the four registries + `command-metadata.json` + the advisor scorer resolves to a file under `.opencode/commands/**` (dir map: `create/ deep/ design/ doctor/ memory/ speckit/` exist; `doc/` does NOT) or appears in an explicit allowlist. Fails today on `/doc:quality` (`sk-doc/mode-registry.json:145`) and the sk-design phantom command ids. The allowlist quarantines the WU5/WU11 dead ids so this gate is green while they await the re-baseline.
- **Gate**: the new vitest fails RED on `/doc:quality` pre-fix; green after D1 is applied (create the command OR allowlist the id).

**WU5 — Doctor freshness panel · P2 · [DO-NOW] · [DECISION D2] · council #5**
- Add a read-only panel (a `/doctor` route or a checker sub-report) that 3-way diffs `skill-graph.json` vs the SQLite graph vs on-disk `graph-metadata.json`, naming stale artifacts: the 2026-07-04 graph timestamp, the `cli-codex-retired` zombie node, the sk-design misfiled family, and `null derived.generated_at`. **Report-only — never self-heal** (the canonical reindex is operator-gated).
- **Gate**: the panel prints the known drift set on the live tree and exits 0 (informational); it performs no writes (NFR-P02).

**WU6 — Checker fixture harness · P2 · [DO-NOW] · council #6**
- `parent-skill-check.cjs` has 9 rule families and zero tests. Add a vitest driving it via `execFileSync` against golden (canon-clean) and mutant (one injected defect each) fixture hub directories, asserting the mutant is flagged. Delete the dead `VALID_BACKEND_KINDS` (`parent-skill-check.cjs:58`, defined and never referenced — verified).
- **Gate**: golden fixtures pass 4/4; each mutant fixture reds exactly its rule; `VALID_BACKEND_KINDS` removed with no reference breakage.

**WU7 — Discovery-pipeline parity fixtures · P2 · [DO-NOW] · council #7**
- Shared fixtures proving the TS recursive `discoverGraphMetadataFiles` walk and the Python depth-1 compiler agree on what constitutes one hub identity (the 023 WU3 ingestion guard closed the hole; this locks the two pipelines to one answer).
- **Gate**: both pipelines resolve the same identity set on the shared fixtures; a nested skill-shaped file is rejected by both.

**WU9 — description.json guard · P2 · [DO-NOW] · council #9**
- Add checker rule 8b: a hub `description.json` must NOT carry registry-owned `modes[]` / `backend_kinds` (a duplicate that silently drifts from the registry projection). Either assert it equals the projection or forbid it.
- **Gate**: the rule reds a planted description.json with a `modes[]` block; all four hubs pass.

**WU12 — Small cluster · P2 · [DO-NOW] · [DECISION D3] · council #12**
- (a) Patch the template `sk-hub` line (`parent_skill_graph_metadata_template.json:5` → add `sk-hub`), unblocking WU2's guard.
- (b) Add a checker rule: a mode's command-frontmatter tool set ⊆ its `toolSurface.allowed`.
- (c) Reconcile the `importance_tier` six-tier vocabulary across the mirrors.
- (d) Surface the four-hub family-fragmentation question (D3 / ADR-005).
- **Gate**: template line fixed; new checker rule has a red/green fixture; hubs stay 4/4.

### Phase 4 — GATE-ADJACENT tranche (deferred behind the advisor scorer lane + 193-row re-baseline)

**WU8 — `derived.entities` shape break · P1-guard/P2-fix · [GATE-ADJ] · council #8**
- PREP (DO-NOW, Phase 1): a guard/test documenting that `metadata-sanitizer.ts:60-68` bundles `entities` with the string-array keys and filters to `typeof entry === 'string'`, so object-shaped `derived.entities` (`{name,kind,path,source}`) are silently dropped. The guard FAILS today, proving the bug.
- FIX (GATE-ADJ): flatten object entities in `metadata-sanitizer.ts:60-68` instead of dropping them — this changes indexed content and therefore shifts advisor scoring, so it lands only inside the re-baseline event.
- **Gate**: PREP guard red today; post-gate, the fix makes it green AND the 193-row parity re-baseline is recomputed in the same event.

**WU10 — vocab-sync prefix-ownership bug · P2 · [GATE-ADJ] · council #10**
- `parent-hub-vocab-sync.cjs:113-118` `ownerModeForClass` uses `className.startsWith(prefix)` with first-match-wins, misattributing ownership when one prefix is a prefix of another. Fix (longest-prefix / anchored match) and document both vocabulary strategies (mirrored vs compositional). Lane-C-baseline adjacent — coordinate with the skill-benchmark baseline so the fix and its re-baseline land together.
- **Gate**: a red/green fixture on the ambiguous-prefix case; the Lane-C baseline re-recorded in the same event.

**WU11 — Dead-id retirement + WU5-corpus + 193-row re-baseline as ONE event · P1 · [GATE-ADJ] · council #11**
- PREP (DO-NOW, Phase 1): a sequencing doc mapping every dead-id site → live replacement (the 023 evidence: `/deep:start-{research,review,model-benchmark}-loop` → `/deep:{research,review,model-benchmark}`; plus the bigger defect — live ids like `/deep:research` appear in ZERO routing surfaces). Enumerate the ~8 corpus rows and the ratchets pinning 193 (`labeled-prompts.jsonl` is 193 rows; `scorer-eval-baseline.json:16` pins `total:193`).
- EXECUTE (GATE-ADJ): retire the dead ids, rewrite the corpus rows, and recompute the 193-row parity as ONE re-baseline event (co-lands with the 023 WU5 command-bridge unit, which is gated on the same lane).
- **Gate**: post-gate, advisor drift-guard + parity vitests green; every bridge id resolves to a live command; the re-baseline is a single committed event.

### Guiding rule
Where a dialect and the registry disagree, move the dialect toward the registry + majority practice (they embody the sane contract), and make a TEST the single enforcer so no future edit can drift silently. The only exceptions are the two deliberate read-only scorer subsets, which are flagged, never asserted-equal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Work Units | Nature |
|---------|------------|--------|
| `.github/workflows/routing-registry-drift.yml` | WU1 | CI path-filter glob + per-hub checker loop |
| `parent-skill-check.cjs` | WU1, WU6, WU9, WU12 | CWD fix; fixture harness; new rules 8b + toolSurface; delete dead const |
| `skill-graph-db.ts` | WU2, WU3 | edge_type CHECK drop + self-heal; vocab-battery source anchors |
| `skill_graph_compiler.py` | WU2, WU7 | Python dialect asserted; discovery parity |
| `skill-graph-tools.ts` / `parent_skill_graph_metadata_template.json` | WU2, WU12 | JSON-schema enum asserted; template `sk-hub` line |
| `metadata-sanitizer.ts` | WU8 | entities shape fix (GATE-ADJ) |
| `parent-hub-vocab-sync.cjs` | WU10 | prefix-ownership fix (GATE-ADJ) |
| advisor corpus + ratchets (`labeled-prompts.jsonl`, `scorer-eval-baseline.json`) | WU11 | dead-id + 193-row re-baseline (GATE-ADJ) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-verify all file:line anchors against HEAD; capture baseline (checker 4/4, existing vitest counts)
- [ ] Author the WU11 dead-id → live-replacement sequencing doc (gate-free PREP)
- [ ] Author the WU8 `derived.entities` shape-break guard (fails today; gate-free PREP)
- [ ] Confirm the advisor scorer lane is quiet before scheduling any GATE-ADJ execution

### Phase 2: Core Implementation
- [ ] WU1 — widen CI gate (glob + per-hub loop) + CWD fix
- [ ] WU2 — cross-language vocabulary-agreement battery
- [ ] WU3 — defuse the `edge_type` SQL CHECK (self-heal + vitest)
- [ ] WU4, WU5, WU6, WU7, WU9, WU12 — DO-NOW hardening batch (Phase 3 logical group)

### Phase 3: Verification
- [ ] 4/4 `parent-skill-check` on all hubs after every DO-NOW unit; each new vitest green
- [ ] `validate.sh --strict` on every touched spec folder
- [ ] GATE-ADJ tranche (WU8-fix, WU10, WU11) remains PREP-only until the operator opens the lane
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Canon check | All four hubs, after each DO-NOW unit | `parent-skill-check.cjs` (default strict) |
| Vocab agreement | WU2 | one new vitest across ~12 dialects; subset-assert the 2 gated sites |
| Migration | WU3 | new `edge_type` self-heal vitest (mirrors `skill-graph-db.vitest.ts:176-219`) |
| Command binding | WU4 | new vitest over `.opencode/commands/**` + allowlist |
| Checker fixtures | WU6 | `execFileSync` golden + mutant fixture dirs |
| Discovery parity | WU7 | shared TS/Python fixtures |
| CI integration | WU1 | synthetic PR touching a non-deep-loop hub registry |
| Spec validation | Every touched folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### Decision forks (operator resolves before the owning WU executes)

| ID | Fork | Recommended default |
|----|------|---------------------|
| D1 | WU4 `/doc:quality` fix-vs-ratchet | Fix: create `.opencode/commands/doc/quality` so the id resolves (over allowlisting a phantom); allowlist only the genuinely-dead WU11 ids |
| D2 | WU5 zombie/ghost graph nodes | Report-only doctor panel now; defer the cleanup to the operator-gated canonical reindex (never self-heal) |
| D3 | WU12 four-hub family question | Keep the generic `sk-hub` family (already the enum'd value); do not fragment into per-hub families |

### Other dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Advisor scorer lane quiet + 193-row re-baseline | Internal | Gated | WU8-fix / WU10 / WU11 stay PREP-only |
| Operator fork resolutions (D1–D3) | Internal | Pending | WU4 / WU5 / WU12 scoped edits wait |
| Concurrent branch churn | Internal | Active | 0-leak scoped commits per WU |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a DO-NOW unit reds `parent-skill-check.cjs` on any hub, or a new gate reds CI on a valid change.
- **Procedure**: each WU is an isolated commit; `git revert` the WU restores its files. WU1 is highest-blast (CI + checker); land it and confirm the four-hub loop + non-root-CWD run before any dependent unit. The GATE-ADJ tranche is never landed outside the re-baseline event, so it cannot corrupt the 193-row parity by rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup/PREP) ──> Phase 2 (Trio: WU1,WU2,WU3) ──> Phase 3 (DO-NOW batch) ──> Phase 5 (Verify)
                                                                  │
                                             Phase 4 (GATE-ADJ) ──┘  [waits on operator lane]
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Setup/PREP | None | 2, 4 |
| 2 Trio | 1 | 3 |
| 3 DO-NOW batch | 2 (WU12 unblocks WU2's template guard) | 5 |
| 4 GATE-ADJ | 1 (PREP) + operator lane | 5 (partial) |
| 5 Verify | 2, 3 (and 4 when un-gated) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Setup/PREP | Low | ~0.5 day |
| 2 Trio (WU1–WU3) | Medium | ~2 days |
| 3 DO-NOW batch (WU4–WU7, WU9, WU12) | Medium | ~2.5 days |
| 4 GATE-ADJ (WU8-fix, WU10, WU11) | Medium (gated) | ~1.5 days once the lane opens |
| 5 Verify | Low | ~0.5 day |
| **Total** | | **~7 days (DO-NOW ~5.5; GATE-ADJ ~1.5 deferred)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured: `parent-skill-check.cjs` 4/4 on all hubs; existing advisor vitest counts recorded
- [ ] Advisor scorer lane confirmed quiet before any GATE-ADJ scheduling

### Rollback Procedure
1. **Immediate**: revert the offending WU commit (each WU is atomic).
2. **CI**: if WU1 reds valid changes, narrow the glob or set `PARENT_HUB_CHECK_STRICT=0` for the offending hub.
3. **Migration**: WU3's self-heal is idempotent; reverting the code leaves already-migrated DBs valid (no down-migration needed).
4. **Verify**: re-run `parent-skill-check.cjs` on all four hubs to confirm 4/4.

### Data Reversal
- **Has data migrations?** Yes (WU3 `edge_type` CHECK drop — forward-only, idempotent, no data loss).
- **Reversal procedure**: none required; the rebuilt table is a superset-permissive schema. Reverting code does not re-add the CHECK.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
        ┌────────────── Phase 1: Setup + PREP (WU8-guard, WU11-seq-doc) ──────────────┐
        │                                  │                                          │
        ▼                                  ▼                                          ▼
   WU1 (CI+CWD)  ───────────────►  WU2 (vocab battery)  ◄────── WU12(a) template sk-hub line
        │                                  ▲
        │                                  │
   WU3 (edge_type CHECK) ─────────────────►┘  (WU3 drops the CHECK WU2 asserts)
        │
        ▼
   Phase 3 DO-NOW: WU4, WU5, WU6, WU7, WU9, WU12(b-d)
        │
        ▼
   Phase 4 GATE-ADJ (operator lane): WU8-fix ─┐
                                     WU10 ─────┼──► single re-baseline event
                                     WU11 ─────┘
```

### Dependency Matrix

| Work Unit | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| WU1 | Phase 1 | four-hub CI gate; CWD-safe checker | trustworthy 4/4 gate for all WUs |
| WU2 | WU12(a), WU3 (edge_type) | one cross-dialect vitest | catches all future dialect drift |
| WU3 | Phase 1 | defused edge_type CHECK | WU2 edge-type assertion |
| WU4–WU7, WU9 | WU1 (trustworthy gate) | new gates + fixtures | fleet-wide coverage |
| WU12 | — | template fix + rules + fork | WU2 template guard |
| WU8/WU10/WU11 | Phase 1 PREP + operator lane | re-baseline event | advisor re-baseline close-out |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 PREP** — anchors re-verified; WU8 guard + WU11 sequencing doc — CRITICAL for the gated tranche
2. **WU1** — widen CI gate + CWD fix — CRITICAL (every other gate relies on a trustworthy 4/4)
3. **WU12(a) + WU3** — template `sk-hub` line + edge_type CHECK — CRITICAL prerequisites for WU2
4. **WU2** — vocab battery — CRITICAL (the class-based guarantee)
5. **Phase 3 DO-NOW batch** — parallelizable after WU1

**Parallel opportunities**: WU4/WU5/WU6/WU7/WU9 are independent after WU1; WU3 and WU12(a) can proceed alongside WU1; the GATE-ADJ PREP runs in Phase 1 regardless.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | PREP complete | anchors re-verified; WU8 guard red-proves the bug; WU11 seq-doc done | End Phase 1 |
| M2 | Trio landed | CI watches all hubs; vocab battery green; edge_type CHECK defused | End Phase 2 |
| M3 | DO-NOW complete | command-binding gate, doctor panel, checker fixtures, discovery parity, description.json guard, cluster all shipped; 4/4 maintained | End Phase 3 |
| M4 | Gate-adjacent ready | PREP artifacts staged; awaiting operator lane | Parallel to M2/M3 |
| M5 | Re-baseline event | WU8-fix + WU10 + WU11 land as one re-baseline once the lane opens | Post-gate |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Lead with the foundational trio | WU1+WU2+WU3 together would have prevented both the transport and `sk-hub` incidents |
| ADR-002 | Partition + gate the advisor-scorer-adjacent tranche | WU8-fix/WU10/WU11 shift scoring; they must co-land with the 193-row re-baseline |
| ADR-003 | `/doc:quality` fix over ratchet | Create the missing command dir; allowlist only genuinely-dead ids |
| ADR-004 | Report-only doctor panel for zombie/ghost nodes | The canonical reindex is operator-gated; never self-heal |
| ADR-005 | Keep the generic `sk-hub` family | Future-proofs non-code/design hubs; avoids per-hub fragmentation |
