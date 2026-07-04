# Iteration 6 — D4-P0 Consumer Blast-Radius + Patch-Shape Feasibility (design only) + D3 Drift Spot-Check

- **Dimension:** Cross-cutting deepening of D4-P0-001 (consumer impact + fix feasibility), plus D3 drift re-challenge.
- **Mode:** review (single iteration; iteration 6 of 10; stop_policy=max-iterations — broaden, do not converge)
- **Agent:** deep-review (LEAF, GLM-5.2)
- **sessionId:** rv-phase009-audit-20260701-184748
- **Status:** complete (read-only diagnostic; no phase-009 file modified outside `review/`; no source file edited — patch is prose sketch only)

## Objective

Iteration 5 escalated D4-P1-001 → **D4-P0-001** on systemic evidence (363 actually-incomplete folders mislabeled `complete`; 213 already live-corrupted on-disk). That established the defect is real, repo-wide, and realized in the metadata layer. This iteration answers the question iteration 5 explicitly deferred: **does any consumer actually ACT on the false `complete`, or is the corruption real-but-inert?** Both outcomes are legitimate; they differ in remediation urgency. Secondary: sketch the minimal `deriveStatus` fix shape (no implementation) and confirm its true-positive rate against iteration 5's own sweep data. Tertiary: spot-check the 4 `/speckit:*` surfaces handover.md cites for drift since iteration 3.

## Consumer Blast-Radius Findings

Method: exhaustive grep of `.opencode/skills/system-spec-kit/` for every read of `derived.status` / `metadata.derived.status` / `loadGraphMetadata(...).derived.status` and every branch on a status value, then source-read each candidate consumer to determine whether it (a) reads `derived.status` at all and (b) changes user-facing behavior on `complete` vs `planned`/`in_progress`. Three classes of consumer were checked: the high-stakes surfaces named in the objective (resume ladder, phase-map sync, completion verification, memory search ranking), the producer/validator surface itself, and the one branching consumer the grep surfaced.

### Exhaustive consumer map

| Consumer (file:line) | Reads `derived.status`? | Branches on value? | User-facing effect if status falsely `complete`? |
|---|---|---|---|
| `backfill-graph-metadata.ts:282` (`collectReviewFlags`) | YES (`metadata.derived.status === 'planned'`) | YES — but only flags `ambiguous_status` when status is `'planned'` | **None (telemetry loss).** A false `'complete'` simply suppresses the advisory review flag. The flag is human-review guidance emitted during backfill dry-runs, not a gate. A false-complete folder is NOT flagged for review — noise reduction in the wrong direction, but no functional failure. |
| `graph-metadata-parser.ts:1269` (`deriveGraphMetadata` status wiring) | YES (producer) | NO (writes, doesn't branch) | Producer — this IS the defect site. Not a consumer. |
| `graph-metadata-parser.ts:1551` (legacy serialization `Status: ${...}`) | YES | NO (string interpolation) | Producer write-path for legacy text format. Echoes the false value into regenerated legacy files, but no branch. |
| `generated-metadata-integrity.ts:99` (enum check) | YES | NO — validates enum *membership* only | A false `'complete'` **PASSES** this check (`complete` is a valid enum member). The strict validator is structurally incapable of detecting the defect — it is enum-correct but semantically wrong. This is why `validate.sh --strict` never flagged the 213 corrupted files. |
| `resume-ladder.ts:135-213` (`followPhaseParentRedirect`) | **NO** — reads only `derived.last_active_child_id` (line 167) | n/a | **Resume does NOT skip "complete" phases.** The ladder follows the chronology pointer, never the status field. A false `complete` cannot hide a phase from resume. |
| `sync-phase-map-status.ts:117-151` (`implementationSummaryClaimsCompletion`, `resolveChildStatus`) | **NO** — reads spec.md `**Status**` row (line 141) + impl-summary frontmatter/table (lines 123-131) directly | n/a | **Phase-map rollup is independent of graph-metadata corruption.** It re-derives status from canonical docs, bypassing `derived.status` entirely. A false `complete` in graph-metadata.json does NOT propagate into the phase documentation map. |
| `continuity-freshness.ts:96-141` (`readContinuityFields`) + `:223-236` (`isCompletionStatus`) | **NO** — reads YAML frontmatter `status:` (line 114) + metadata-table `**Status**` row (line 143) of the canonical doc | n/a | **Completion verification (`validate.sh` CONTINUITY_FRESHNESS) is independent of graph-metadata corruption.** It reads the doc's own frontmatter, not the derived field. A false `complete` in graph-metadata.json cannot satisfy or fail this gate. |
| `memory-index.ts:541-565` (graph-metadata file discovery) | NO (treats graph-metadata.json as a file to index) | NO | Discovery only — does not parse/branch on status. |
| `memory-save.ts:386,3267` (canonical-file validation) | NO (membership check in allowed set) | NO | Filename allowlist only. |
| `response-builder.ts:824-845` (save metadata refresh messaging) | NO | NO | Messages whether graph-metadata was refreshed by a save; no status read. |
| `memory_search` / `memory_context` ranking & boosting | **NO** (no grep evidence; memory_index stores `importance_weight`/`importance_tier` set at save-time from doc frontmatter, not from `derived.status`) | n/a | **Memory search ranking is independent of graph-metadata `derived.status`.** No boost/filter/recall path consults it. |

### Verdict on consumer blast radius

**D4-P0-001 is a REAL but CURRENTLY-INERT P0.** The false `complete` is semantically wrong and lives in 213 on-disk files plus the live metadata index, but **no user-facing consumer currently branches on `derived.status` to change behavior.** The one branching consumer (`collectReviewFlags`) only loses an advisory flag. The three high-stakes consumers the objective named — resume ladder, phase-map sync, completion verification — are **architecturally decoupled**: they read canonical-doc frontmatter or `derived.last_active_child_id` instead of `derived.status`. Memory search ranking has no path to the field at all.

**Why this matters for remediation priority:** the corruption is not causing wrong operator decisions *today* (resume still lands on the right phase; phase maps still show correct statuses; completion gates still read the doc). It is a **latent data-integrity defect**: the metadata layer asserts a falsehood repo-wide, and the decoupling is *incidental* (consumers happen to read other fields), not *enforced by contract*. Any future consumer that trusts `derived.status` — a new "open work" dashboard, a packet-graph status rollup, a memory_search completeness boost — would inherit the 213 corrupted rows with no gate. The strict validator cannot catch it (enum-valid). So the P0 severity **stands** (data integrity repo-wide), but the characterization refines from "users see wrong behavior now" to "wrong data in the index, no current consumer acts on it, but no guard prevents future consumers from inheriting it."

This does **not** satisfy D4-P0-001's `downgradeTrigger` (that required either a `deriveStatus` patch OR a per-folder authoring audit showing the 213 are genuinely complete-with-stale-pct). The blast-radius finding is *consistent with* P0, not a downgrade — it informs *urgency* (fix before the signal propagates into a new consumer), not *severity*.

## Patch-Shape Feasibility Sketch

Read-only design. NO source file edited. The defect site (re-read this iteration, lines 1167-1224):

```
1215   const checklistDoc = docs.find((doc) => doc.relativePath === 'checklist.md');
1216   if (!checklistDoc) {
1217     return { status: 'complete', reviewRequired: false };   // ← BUG: unconditional
1218   }
```

### Minimal fix shape (prose)

Insert a completion gate between line 1215 and 1216 so file-presence alone can never yield `complete` for an incomplete phase:

1. Extract `completion_pct` from `spec.md` frontmatter (parse from `specDoc.content`; coerce string→number).
2. Count open `[ ]` task lines in `tasks.md` (parse from `tasksDoc.content`; 0 when tasks.md absent).
3. Gate the `complete` return on `completion_pct >= 100 AND openTaskCount === 0`; otherwise fall through to `planned` (when `completion_pct === 0`) or `in_progress`.

Pseudocode (illustrative, NOT a patch):

```
const specDoc = docs.find(d => d.relativePath === 'spec.md');
const tasksDoc = docs.find(d => d.relativePath === 'tasks.md');
const pct = parseCompletionPct(specDoc?.content);   // number | null
const openTasks = countOpenCheckboxes(tasksDoc?.content); // number
if (!checklistDoc) {
  if (pct !== null && pct >= 100 && openTasks === 0) {
    return { status: 'complete', reviewRequired: false };
  }
  return { status: pct === 0 ? 'planned' : 'in_progress', reviewRequired: false };
}
```

### True-positive rate against iteration 5's sweep data

- **403 plausibly-complete folders** (pct:100/open:0 from iter-5 sweep) → still receive `complete` under the fix. **TRUE POSITIVES PRESERVED.**
- **363 actually-incomplete** (pct<100 OR open>0) → correctly receive `planned`/`in_progress`, NOT `complete`. **TRUE NEGATIVES CORRECT.**
- **Phase 009** (pct:0, open tasks, scaffold impl-summary) → receives `planned`. **CANONICAL VICTIM FIXED.**

### Edge cases / implementation considerations

1. **`ParsedSpecDoc` does not pre-carry `completion_pct`** (interface at `graph-metadata-parser.ts:87-95`: fields are `relativePath, content, title, description, triggerPhrases, importanceTier, status`). The fix must parse `completion_pct` out of `specDoc.content` inside `deriveStatus`, OR extend `ParsedSpecDoc` upstream to carry it. Former is surgical; latter is cleaner but touches the parser pipeline. Design decision for the implementer.
2. **Folders with NO spec.md frontmatter** (`completion_pct` parses to `null`) → gate falls to the `else` branch → returns `in_progress` (or `planned` if pct:0). This is **safer than the current false-complete** but may relabel a genuinely-complete-but-frontmatter-less folder as `in_progress`. Mitigation: set `reviewRequired: true` to surface it. Iter-5 data: the 263 scaffold folders carry `completion_pct: 0` in template frontmatter (parse to 0, not null) — handled correctly. The pure-null subset needs a count to size, but the safe default is defensible.
3. **Lean phase parents** (no impl-summary) never reach line 1215 — they hit the earlier branch at 1201-1213. **Fix is a no-op for them.**
4. **`completion_pct` as string vs number** in YAML — coerce with `Number.parseFloat` (iter-5 sweep already handled both serializations).
5. **Folders with `completion_pct` but no `tasks.md`** → `openTasks === 0` vacuously; gate reduces to `pct >= 100`. Reasonable — a folder declaring 100% with no task list is treated complete.

**Net:** the fix is feasible, holds the 403 true-positive rate, corrects the 363 false-positives (lower bound), and every edge case has a defensible safe default. The dominant implementation cost is the `ParsedSpecDoc`/`completion_pct` extraction decision in item 1.

## D3 Drift Spot-Check

Objective tertiary: confirm the 4 `/speckit:*` presentation/router/YAML surfaces handover.md §3 cites are byte-stable since iteration 3 (~20-40 min ago; actually iteration 3 wrote at 2026-07-01T21:15:05, this iteration ~22:05 — ~50 min elapsed).

- **Presentation files** (4): `.opencode/commands/speckit/assets/speckit_{plan,complete,implement,resume}_presentation.txt` — latest mtime `2026-06-15T20:42:05`.
- **Routers** (4 command `.md` files): `plan.md`, `complete.md`, `implement.md`, `resume.md` — latest mtime `2026-06-28T21:58:31` (plan/implement/complete); `resume.md` `2026-06-27T13:35:06`.
- **YAML assets** (8 auto/confirm pairs): latest `2026-06-28T21:58:31` (`speckit_complete_auto.yaml`); earliest `2026-05-25T12:10:43`.
- **Last git commit touching `.opencode/commands/speckit/`:** `7c218ee33d 2026-06-28 22:06:49 +0200` — 3 days before this review.
- **`find -newer iteration-3.md` over `.opencode/commands/speckit/`:** empty.

**Verdict: ZERO DRIFT.** All 16 cited surfaces pre-date the review (let alone iteration 3). D3's BUILDABLE-BUT-UNAUTHORED verdict holds unchanged — handover §3's cited target files still exist, still match the description, and the plan gap (`rg mk_goal` over speckit commands = 0) is still genuinely open. No re-litigation needed.

## Findings by Severity

### P0 (Critical): 1 active — D4-P0-001 (refined, NOT reclassified).

D4-P0-001 severity **UNCHANGED (P0).** This iteration adds the blast-radius characterization as context, not a severity change:
- **blastRadiusAssessment (new):** REAL but CURRENTLY-INERT. 213 live-corrupted `derived.status:"complete"` rows in the metadata index, but no user-facing consumer branches on the value today. The three high-stakes consumers (resume ladder, phase-map sync, completion verification) are architecturally decoupled — they read canonical-doc frontmatter or `last_active_child_id`. Memory search ranking has no path to the field. The one branching consumer (`collectReviewFlags`) only suppresses an advisory flag. The corruption is latent data-integrity, not realized functional failure.
- **Why P0 stands:** `downgradeTrigger` (deriveStatus patched OR per-folder audit shows 213 genuinely-complete) is NOT met. 213 rows of false data in a repo-wide metadata index is P0 by data-integrity standard regardless of whether a consumer currently acts on it; the strict validator structurally cannot detect it (enum-valid); and no contract enforces the incidental decoupling, so future consumers inherit the corruption.
- **confidence:** 0.93 (severity) + 0.90 (blast-radius — exhaustive grep + source-read of every candidate consumer; the negative result "no consumer branches" is corroborated by the absence of any branch-on-status in memory/resume/phase-map paths, not merely asserted).

### P1 (Major): 0 active (unchanged).

### P2 (Minor): 9 active (unchanged). No new findings this iteration.

The blast-radius result is recorded as a `verified_claim` (the hypothesis "213 corrupted rows produce concrete user-facing failures today" is OVERTURNED) and folded into D4-P0-001's `blastRadiusAssessment`, not spawned as a standalone finding — it is mitigation/context (good news about consumer decoupling), not a defect. Spawning a "consumers are decoupled" P2 would be finding-inflation.

## Verdict

**D4-P0-001 refined from "systemic tooling defect with realized production impact" to "systemic tooling defect with realized data corruption but currently-inert consumer surface (latent risk)."** Both readings keep it P0; they differ in *urgency framing*. The corruption is not driving wrong operator decisions today (resume, phase maps, and completion gates all bypass `derived.status`), so an emergency hotfix is not warranted by current-user-impact alone. BUT: (a) the data is wrong repo-wide, (b) the strict validator cannot catch it, (c) the decoupling is incidental not contractual, (d) the minimal fix is feasible and holds the 403-true-positive rate — so remediation should land before a new consumer (dashboard / rollup / search boost) inherits the signal. The patch-shape sketch gives the implementer a concrete gating design; the one open implementation decision is whether to parse `completion_pct` inline in `deriveStatus` or extend `ParsedSpecDoc` upstream.

D3 BUILDABLE-BUT-UNAUTHORED **re-confirmed stable** (zero drift on all 16 cited `/speckit:*` surfaces since iteration 3; latest change 3 days pre-review). D1 (1/2425 unparseable) and D2 (UNVERIFIABLE ~0.78) not re-probed this iteration — both stable as of iteration 5 (~30 min ago), no reason to expect drift.

## Traceability Checks

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` (core) | checked | Re-read `deriveStatus` 1167-1224 + `ParsedSpecDoc` 87-95 this iteration; exhaustive consumer grep + source-read of every candidate. |
| `checklist_evidence` (core) | notApplicable | Level 1 phase; no checklist.md. |
| `skill_agent` (overlay) | checked | Confirmed the one branching consumer (`collectReviewFlags`) is advisory-only; no skill-agent runtime reads `derived.status`. |
| `agent_cross_runtime` (overlay) | notApplicable | Not an agent-definition review. |
| `feature_catalog_code` (overlay) | notApplicable | Not a feature-catalog review. |
| `playbook_capability` (overlay) | notApplicable | Not a playbook review. |

## SCOPE VIOLATIONS

None. All writes confined to `review/` (`iterations/iteration-6.md`, `deep-review-state.jsonl` append, `deltas/iter-006.jsonl`, in-place `deep-review-strategy.md` + `deep-review-findings-registry.json`). No scratch files. No file under `009-.../` outside `review/` touched. No source file edited — the `deriveStatus` fix is prose only. No live backfill run. `git status` scoped to phase 009 remains clean except `review/` additions.

## Next Focus for iteration 7

stop_policy=max-iterations → broaden. D4-P0-001 now fully characterized (systemic + realized-data-corruption + currently-inert-consumer + feasible-fix). Highest-value remaining angles:
1. **Validator-gap finding (D4 sibling):** `generated-metadata-integrity.ts:99` validates enum *membership* but is structurally blind to semantic correctness — a `complete` on a pct:0/open-tasks folder passes strict. This is why `validate.sh --strict` never flagged the 213 corrupted files. Worth surfacing as a P1/P2 sibling to D1-P2-001 (loader/validator split): the integrity layer has no cross-field consistency check (status vs completion_pct vs open-tasks). Quantify: is there ANY existing cross-field check, or is status validated in pure isolation?
2. **`completion_pct` availability audit (patch-feasibility deepening):** count the pure-null subset (folders with spec.md but no frontmatter `completion_pct`) to confirm the fix's edge case 2 is small. If large, the fix may need a secondary signal.
3. **Tertiary:** adversarially re-challenge D2 by checking whether ANY of the 213 corrupted on-disk files were touched by a commit since iteration 2 (would indicate active backfill activity = evidence for/against concurrent sessions).
