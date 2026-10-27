# Review Iteration 3 — Traceability

## Dispatcher

- Mode: review · Target agent: deep-review · Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Run: `fanout-deepseek-1793081281038-z2aj1o` · lineage `deepseek` · generation 1 · lineageMode `new`
- Iteration: 3 of 3 · Dimension: traceability · Stop policy: `max-iterations` (the ceiling binds here; convergence is not claimed)
- Operator review focus carried into this iteration: this is the iteration the focus asks for directly. Each phase record's closeout claim was matched to the shipped file it names, and where a phase shipped a check the claim is about, that check was run and its output read: `check-card-sync.sh`, `check-example-drift.sh`, `derive-command-bridges.cjs --check`, `route-validate.sh` and `skill-graph-freshness.cjs`.

## Files Reviewed

- Phase records: `001` through `022` `implementation-summary.md` and `spec.md` (Metadata tables, "What Was Built", "Verification"), plus the parent `spec.md` and `changelog/changelog-054-root.md`
- Shipped files named by those claims: `templates/core/*.md.tmpl`, `templates/spec-kit-docs.json`, `runtime/cli/lib/validator-registry.json`, `runtime/cli/rules/check-measured-behavior.sh`, `runtime/cli/rules/check-placeholders.sh`, `runtime/cli/spec/check-card-sync.sh`, `runtime/cli/spec/check-example-drift.sh`, `runtime/cli/spec/validate.sh`, `references/workflows/spec-authoring-card.md`, `references/validation/validation-rules.md`, `.github/workflows/changed-packet-validation.yml`, `sk-git/scripts/worktree-naming.sh`, `system-skill-advisor/runtime/lib/scorer/{text.ts,fusion.ts,lanes/graph-causal.ts,lanes/derived.ts}`, `system-skill-advisor/runtime/scripts/skill_advisor.py`, `system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`, `system-spec-kit/graph-metadata.json`
- Project artifacts read for the audit side: `020-alignment-audit-fixes/scratch/audit/findings.json`, `018-benchmark-redesign-and-remeasure/scratch/report.md`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. `F1-P1-001` (recursive validation reaching the draft auto-repair) stays active and is carried into the synthesis.

### P2 Findings

1. **Phase 021's record says its work is uncommitted, and the repository says otherwise** -- `specs/system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions/implementation-summary.md:41` -- the Completed row reads "2026-10-26, uncommitted on `worktrees/217-weak-model-spec-authoring`", and the parent spec's push correction (`spec.md:94`) stops at `10e8df7d25` on 2026-10-25. Both are stale: `git log --oneline -3 -- specs/system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions` shows the phase record committed in `4b15bdcc11`, and `git log --oneline -3 -- specs/system-speckit/054-weak-model-spec-authoring/022-advisor-routing-and-local-install` shows phase 022 in `558570a83e`, the commit the operator names as the tip under review. A reader recovering this packet looks for uncommitted work that does not exist and for a push record that stops three commits early.
   - Finding class: `instance-only`
   - Scope proof: the two record fields above, against the two `git log` results for the same paths.
   - Affected surface hints: `021/implementation-summary.md` Metadata, the parent `spec.md` Out of Scope correction, any resume that trusts the packet's commit state.
   - Case: an operator resumes the packet, reads "uncommitted", and re-runs phase 021's verification against a tree where the work is already in main.

2. **The phase 020 audit cannot be closed from its own artifact** -- `specs/system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes/scratch/audit/findings.json:1` -- the file holds 46 findings keyed `lane,id,severity,file,line,issue,evidence,fix,fix_class,standard` and no disposition field of any kind, while the implementation summary states every one was fixed. Eight of the 46 were re-checked here and all eight are applied: `C-08` (description now 221 characters under a 250 limit), `C-09` (the `template v2.4` trigger phrase is gone), `C-10` (no semicolon on the five cited lines), `C-11` (no `## Verification` heading and no `CHK-` ids in `v2.12.0.0.md`), `C-02` (`runtime/cli/spec/README.md` now says 15 document kinds), `X2` (`effort-est` gone from `assets/complexity-decision-matrix.md:44`), `X3` (no `[effort]` in `templates/examples/level-2/tasks.md`), `D-F2` (`orchestrate.md:461` now cites `templates/core/spec.md.tmpl`). The record still cannot distinguish fixed from deferred for the other 38, so the "every misalignment was fixed" claim rests on prose alone.
   - Finding class: `instance-only`
   - Scope proof: `node -e` over `findings.json` reports 46 entries with those ten keys and no status member; the eight re-checks above are single grep/`sed` reads of the cited files.
   - Affected surface hints: the phase 020 closeout, any later audit that wants to diff this one, the packet's own `checklist_evidence` trail.
   - Case: a later reviewer opens the audit artifact to see whether a specific P1 was closed, finds the issue text but no outcome, and must redo the whole check.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | 11 of the 14 shipped claims re-checked below hold; two record claims are stale (findings 1 and 2). |
| `checklist_evidence` | core | partial | The phase 020 artifact carries no disposition field, so its checklist evidence cannot be replayed (finding 2). Every other phase read carries either a verification table with command output or a `scratch/` artifact the table names. |
| `skill_agent` | overlay | pass | Phase 006's claim that the speckit commands name the two guards holds in all three command surfaces: `speckit-plan.yaml:310`, `speckit-implement.yaml:285` and `speckit-complete.yaml:347` each set `guard_scripts_command`, and `plan.md:107`, `implement.md:93` and `complete.md:102` name them in prose. |
| `agent_cross_runtime` | overlay | pass | Phase 022's `sk-git` version claim resolves: `sk-git/changelog/v1.9.7.0.md` exists and rule 8 names the link step. The canonical `.skilled/agents/*` and the `.claude`/`.codex`/`.pi`/`.hermes` mirrors were not diffed this iteration. |
| `feature_catalog_code` | overlay | pass | Phase 020 `B-04`/`B-05` hold: `feature-catalog/tooling-and-scripts/draft-auto-repair.md` and `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` exist, and `manual-testing-playbook/template-authoring/{measured-behavior-warns-unfilled,draft-auto-repair-rewrites-derived}.md` are present. |
| `playbook_capability` | overlay | partial | The two playbook scenarios above exist, and neither covers the recursive repair path (iteration 1's finding). |

### Claim ledger (phase → claim → verdict)

| Phase | Claim | Verdict | Evidence |
|---|---|---|---|
| 003 | A v2.3+ doc warns on an unfilled value token while Draft and errors otherwise | holds | `check-placeholders.sh:164-175`, `orchestrator.ts:812-846`, `status-classifier.sh:88-96` |
| 004 | Every core section carries a fill note with a good and a weak example, and the example drift guard exits 0 | holds | `templates/core/spec.md.tmpl` fill notes at 59-202; `check-example-drift.sh` printed `EXAMPLE_DRIFT_OK` |
| 005 | The card exists, the router loads it, and the sync guard exits 0 | holds | `check-card-sync.sh` printed `CARD SYNC OK` with `card-exists (196 lines)` under the 260-line bound |
| 006 | The speckit commands name the card, the token and the guards | holds | three `guard_scripts_command` lines plus the three command docs |
| 015 | No template or example names the benchmark task | holds | `rg -c -e '--quiet' -e 'recommend-level' templates/` prints nothing |
| 016 | Fix completeness is optional and the scaffold no longer teaches effort | holds | `tasks.md.tmpl` marks the addendum `FIX ADDENDUM:` (optional header rule); `complexity-decision-matrix.md:44` and the level-2 example carry no `effort` |
| 017 | `MEASURED_BEHAVIOR` ships as a warn rule, the registry holds 42 rules, and a Draft `--strict` run repairs derived metadata once | holds | registry count 42 with 8 warn; `check-measured-behavior.sh` applicability reads a spec-core v2.4+ stamp; `orchestrator.ts:1631-1685` |
| 019 | The follow-ups the 018 closeout named are closed | holds | `018-.../scratch/report.md` and `rescore/` exist; phase 019's summary names both fixes |
| 020 | Every one of the 46 audit findings was fixed | unverifiable in part | 8 of 46 re-checked and applied; the artifact records no disposition (finding 2) |
| 021 | Changed-packet validation skips whole `scratch` segments; the advisor sends `/deep:research :auto` to deep-loop | holds | `changed-packet-validation.yml:91`; `route-validate.sh` printed `18 routes validated, 2 warnings` |
| 021 | Phase record commit state | stale | record says uncommitted; `4b15bdcc11` and `558570a83e` carry it (finding 1) |
| 022 | Command bridges are regenerated and fresh | holds | `derive-command-bridges.cjs --check` printed `"status": "fresh"`, `"changed": []`, 49 generated |
| 022 | The compiled graph and the route table match the disk | holds | `skill-graph-freshness.cjs` printed `SIGNAL DRIFT compiled vs disk: none` and `STALE COMPILED: none` |
| 022 | Mode suffixes are dropped before tokenizing in every prompt lane and the Python twin | holds, with one raw-text path | `text.ts:43-54`, `skill_advisor.py:2967-2983`; `derived.ts:59` keeps `prompt.toLowerCase()` for phrase matching, which cannot match a bare `:auto` |
| 022 | `provision` links `local-*` commands, never replaces a path, never fails provisioning | holds | `worktree-naming.sh:622-647`, called at `:766` |

## Edge Cases

- **Eleven of twenty-two phase records read end to end.** The remaining phases were read at their Metadata, "What Was Built" and "Verification" sections; a claim whose evidence lives only in a `scratch/` artifact I did not open is recorded as unverified in that phase's row rather than as a defect.
- **`implementation-summary.md` Status rows.** Phases 001-009 and 020-022 carry one; phases 010-019 do not, because the v2.4 template (`templates/core/implementation-summary.md.tmpl:86-91`) dropped it. This is a template-shape change, not a claim failure, and is not reported.
- **`check-card-sync.sh` and `check-example-drift.sh` were executed**, not simulated. Both are read-only: the only child process is `node runtime/cli/utils/template-structure.js compare`, which prints.
- **`derive-command-bridges.cjs --check` writes nothing** (`derive-command-bridges.cjs:709-710` guards every `writeFileSync` behind `!checkOnly`), and `skill-graph-freshness.cjs` prints `(report-only — the canonical reindex is operator-gated; nothing was written)`.

## Confirmed-Clean Surfaces

- The parent `spec.md` Phase Documentation Map marks all 22 phases Complete, and every phase `spec.md` Metadata agrees.
- The packet root changelog was brought forward: it is dated 2026-10-26 and its Included Phases table reaches phase 022, so the phase-020 `C-03` finding ("dated 2026-10-25, lists only 001-012") no longer reproduces.
- Root `README.md:372` says eight rules only warn, matching the registry's eight `warn` entries (the phase-020 `C-01` finding no longer reproduces).
- `runtime/cli/spec/README.md` states 15 document kinds for the phrase census and cleanup, matching the shipped scripts (phase-020 `C-02`).
- `.env.example` lists `SPECKIT_DRAFT_AUTO_REPAIR`, and `README.md:377` states that a `--strict` Draft run can write files (phase-020 `X1` and `C-14`).
- The advisor's phrase path cannot be steered by a bare `:auto`: `matchesPhraseBoundary` requires the whole phrase, so the restored `draft auto-repair` phrase and the dropped `auto` token do not collide (phase-022 item 3).

## Ruled Out

- **Phase 017's block detection accepting an empty block**: `measured_behavior_block_state` requires a non-empty fenced line or an `N/A:` line with a reason after the colon, and it treats a bare value token as unfilled. Ruled out.
- **The `check-measured-behavior.sh` header repeating the "Sourced by validate.sh" mistake**: it does carry the same header line, but unlike the placeholder rule it has no native orchestrator twin, so the registry does run it — the header is merely imprecise about the mechanism, and the claim it describes is true. Folded into `F1-P2-002` rather than re-raised.
- **Phase 015's neutralization missing a rendered example**: no match under `templates/`. Ruled out.
- **`route-validate.sh` warnings hiding a broken route**: the two warnings are the pre-existing `--dry-run` notes the phase recorded. Ruled out.

## Next Dimension

None. The dimension queue held four dimensions and the run's ceiling is three iterations: correctness (iteration 1), security (iteration 2) and traceability (this iteration) are covered. Maintainability was touched only through documentation-drift findings (`F1-P2-002`, `F1-P2-004`, `F3-P2-001`) and is not covered as its own pass; the synthesis records that gap rather than claiming it.

Review verdict: CONDITIONAL
