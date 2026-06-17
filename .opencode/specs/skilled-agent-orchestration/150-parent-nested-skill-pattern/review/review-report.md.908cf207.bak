# Deep Review: the 155 epic (parent-nested-skill pattern)

<!-- ANCHOR:references -->
**Scope:** the 4 committed phases of packet 155 (rename-fix `c84b7477`, research+corrections `0e2d9bb6`, advisorRouting+drift-guard `26f22184`, formalize `7c26e4ee`).
**Iterations:** `review/iterations/iteration-001.md … 010.md` — 5 × `gpt-5.5-fast --variant xhigh` (cli-opencode) + 5 × `opus-4.8` (claude2). Per-seat findings in `review/deltas/iter-N.jsonl`.
**Round 2:** every P0/P1 was adversarially re-verified by the orchestrator against the real committed code (file:line). No false positives; the lone P0 was downgraded to P1 (the invariant it cited is still guarded by the drift-guard vitest).
<!-- /ANCHOR:references-end -->

---

## Verdict: CONDITIONAL PASS → REMEDIATED to PASS (see "Remediation — applied")

The epic's **core is correct and verified**: the rename projection, the `advisorRouting` block matching the live Python(3)/TS(4) maps, the drift-guard (registry == maps), and the one-identity keystone all hold. Two slices came back fully clean (registry `advisorRouting` correctness; advisor code changes). **But the review found ~20 real defects** — concentrated in (a) honesty over-claims across the docs, (b) a functional defect in `/create:parent-skill` (it cannot reproduce the canonical `deep-loop-workflows` shape it cites), and (c) `/doctor` + drift-guard completeness gaps. None break the shipped routing behavior; most are doc-accuracy + the new tooling's fidelity.

**21 findings: 1 P0 (→P1 on review), 13 P1, 7 P2. All confirmed real.**

---

## P0 → downgraded to P1

- **`/doctor` 4b is lexical-only** (`parent-skill-check.cjs:261`). The dynamic cross-check compares only the Python lexical projection; TS `alias-fold` drift (deep-improvement→agent-improvement) wouldn't trip it. **Downgrade rationale:** the maps==registry invariant IS guarded — by the drift-guard vitest, whose existence `/doctor` 4a asserts. 4b is a secondary check; its lexical-only scope is a completeness gap, not a hole in enforcement. **Fix:** either run the vitest from 4b, or extend 4b to the TS projection, and scope it to the canonical target (it false-fails a freshly scaffolded skill — see P2).

## P1 (confirmed) — grouped

### Honesty / accuracy over-claims (docs)
- **"12 invariant checks" is actually 11** (`003 spec.md:72,89`, `implementation-summary.md:59,90`, `checklist.md:76`). The script has 1a,1b,1c,2a,3a,3b,3c,3d,3e,4a,4b and the run prints 11 PASS. **Fix:** 12→11.
- **The benchmark "3/3 routing precision" over-claims a harness metric** (`003 spec.md:92` + impl-summary + CHK-024). The skill-benchmark harness scores `skillId` only (no mode); my scorecard used the advisor probe, not the harness; and "3/3" counts 3 of the **5** shipped fixtures (context + agent-improvement dropped). **Fix:** reframe — "3 of 3 lexical modes route correctly via the advisor probe; the skill-benchmark harness scores skill-id only; per-mode precision is enforced by the parity fixtures." Do not present it as a harness scorecard.
- **ADR-001 amendment not propagated to the decision-record *frontmatter* `description`** (`001/decision-record.md:3`) — it still states the struck "would create a runtime→system-spec-kit dependency" rationale as live; this is the search-indexed summary. **Fix:** rewrite to the amended (execution-vs-synthesis) basis.
- **CHK-061 "/create enforces one-identity as a hard gate" `[x]` rests on declarative YAML only** (`003/checklist.md:90`) — `/create:parent-skill` was never run end-to-end; the scaffold→doctor round-trip never executed (the weakest verification claim in the epic). **Fix:** downgrade to declarative, OR run the round-trip.

### `/create:parent-skill` fidelity (functional)
- **Hard gates reject the canonical shape** (`create_parent_skill_auto.yaml:251,288`): "no two modes resolve to the same packet folder" + "folder==packetSkillName==deep-<mode>" would FAIL the cited `deep-loop-workflows` (4 modes→1 `deep-improvement` packet; packet `ai-council`≠`deep-ai-council`). The command can't reproduce its own reference. **Fix:** relax these to soft/default (allow many-modes-to-one-packet + grandfathered names); `/doctor` enforces neither.
- **`/create` self-validation diverges from `/doctor`** on the keystone (`auto.yaml:159,330` vs `parent-skill-check.cjs:146-155`): `/create` only counts files; `/doctor` also checks `skill_id==folder` + `family`-in-allowed. A `/create`'d skill with a non-listed family passes `/create` yet fails `/doctor` 1c and is undiscoverable. **Fix:** add `skill_id==folder` + family-in-allowed to `/create` step_5; add a `graph-metadata.json` template; enumerate the 6 families in §10.
- **Registry contract under-specifies the mode shape** (`auto.yaml:175`): omits the 3-tier discriminator, the top-level `packet`, and `legacyAdvisorId` — exactly what `/doctor` hard-requires. **Fix:** restate the full mode shape + add the assertions to step_5 so `/create`'s success gate == the `/doctor` gate.
- **"advisorRouting coverage PASSED" is misleading under C-plus** (`auto.yaml:283`): a scaffolded skill's `advisorRouting` is inert until matching hardcoded Python/TS map entries + a per-skill drift-guard test are hand-added; an `update` adding a lexical mode silently reddens the drift-guard. **Fix:** downgrade to "registry-declared (advisor map sync required)" + a completion note.

### `/doctor` + drift-guard completeness
- **`/doctor` accepts escaped packet paths** (`parent-skill-check.cjs:208`): a registry `packet: "../sk-code"` passes the existence check. **Fix:** reject absolute/`..` paths; require a direct child.
- **`/doctor` discriminator check is presence-only** (`:215`): invalid `runtimeLoopType`/`backendKind` values pass. **Fix:** validate against the allowed sets.
- **Drift-guard has a Python-alias blind spot** (`routing-registry-drift-guard.vitest.ts:95`): it checks `legacyAliases` only against TS `SKILL_ALIAS_GROUPS`; Python has its OWN `SKILL_ALIAS_GROUPS` (`skill_advisor.py:228`) that differs (`deep:start-research-loop` vs `spec_kit:deep-research`), so the registry `legacyAliases` (TS-derived) don't match Python and nothing catches it. **Fix:** dump Python `SKILL_ALIAS_GROUPS` from `--dump-routing-maps` and assert both, OR scope `legacyAliases` explicitly to the TS scorer + note Python differs.

### Doc accuracy
- **§10 + hub template over-simplify the backend** (`skill_creation.md:1024`, `parent_skill_hub_template.md:126`): "five mode packets over the frozen deep-loop-runtime backend" — only 4 use `runtime-loop-type`; `deep-improvement` runs over `improvement-host`/`external-adapter`. **Fix:** qualify to "four over deep-loop-runtime; the improvement packet over improvement-host/external-adapter."
- **Stale bare path** (`deep-loop-workflows/SKILL.md:47`): "the 4 improvement modes all share the `improvement/` packet" — the registry packet is `deep-improvement`. **Fix:** `improvement/`→`deep-improvement/` (a rename straggler my subpath-anchored scan missed; bare `improvement/` + space).

## P2 (confirmed nits)
- §10 naming standard implies 1 packet/mode but `deep-improvement` hosts 4 — add a multi-mode-packet sentence (`skill_creation.md:1042`).
- `/doctor` 4b false-fails a freshly scaffolded non-canonical skill (compares vs the global advisor map) — scope to canonical or per-skill dump (`parent-skill-check.cjs:261`).
- `dlw-context-001` fixture asserts mode gold for `context`, which no harness/parity fixture exercises — note it or wire it (`fixtures/.../dlw-context-001.private.json`).
- `completion_pct: 95` stale in `002`/`003` checklists vs the epic-complete parent (100).
- `research.md:45` "Three cardinalities … lexical+folded (TS 4)" still pre-reconcile — align with the 4-class enum (the exec-rec line 17 reconcile missed line 45).
- The "3/3 scorecard" is ephemeral run output, not a committed artifact — commit it or reword as a one-time result.
- `resource-map.cjs`/`artifact-root.cjs` re-export asymmetry — optional; the execution-vs-synthesis reasoning is sound (explicitly "not required").

## Clean slices (verified solid)
- **Registry `advisorRouting` correctness** (gpt-r02) — the projection + alias sets + default-mode are correct.
- **Advisor code changes** (gpt-r04) — `--dump-routing-maps` + the `DEEP_MODE_BY_CANONICAL` export are clean, no behavior change.

## Remediation — applied

All confirmed P0/P1 + the quick P2s were fixed and re-verified (the round-2 orchestrator owned the doc + drift-guard work; one agent owned the `/create`↔`/doctor` convergence; every output independently re-verified).

1. **Honesty fixes** ✅ — `12→11`; the benchmark reframe (no more "harness scorecard"; "3/3" qualified as 3 lexical modes via the advisor probe, harness scores skill-id, 2/5 fixtures skill-level) + a committed reproducible `routing-precision.md`; the decision-record **frontmatter** struck rationale; `completion_pct 95→100`; `research.md:45`; `SKILL.md:47` (`improvement/`→`deep-improvement/`); §10 backend/family-set/naming + the hub template.
2. **`/create` fidelity** ✅ — the hard gates `no-two-modes-one-packet` + `folder==packetSkillName==deep-<mode>` are now soft/default; many-modes-to-one-packet + grandfathered names are allowed; step_5 mirrors `/doctor`'s keystone (`skill_id==folder`, `family`-in-set, discriminator-value + routingClass validation); the "advisorRouting coverage PASSED" claim downgraded to "registry-declared (advisor map sync required)" with a C-plus wiring note; a `parent_skill_graph_metadata_template.json` added.
3. **`/doctor` + drift-guard hardening** ✅ — packet path-escape rejected (`..`/absolute); `runtimeLoopType`/`backendKind` validated against allowed sets; 4b scoped to the canonical target (no false-fail on scaffolds); the drift-guard now dumps Python `SKILL_ALIAS_GROUPS` keys and cross-checks key membership on both sides (clarifying `legacyAliases` mirrors the TS scorer set).
4. **End-to-end proof** ✅ — `/create`-shaped throwaway skill scaffolded from the templates **passes** `/doctor:parent-skill` (all invariants, exit 0); a nested `graph-metadata.json` **fails** (1a+2a, exit 1). CHK-061 now rests on the real round-trip.

**Re-verification:** routing suite 19/19 (drift-guard 5 + parity 14); `/doctor` canonical PASS + negative matrix; hygiene clean on all touched code; `validate.sh --strict` green on all four 155 folders.
