# Iteration 5 — Cross-Cutting Generality Re-Test (D4-P1-001 systemic sweep) + D1/D2 Adversarial Re-Check

- **Dimension:** Cross-cutting — D1+D4 generality re-test (is `deriveStatus` false-complete a phase-009 instance or a repo-wide tooling defect?), plus D2 re-challenge.
- **Mode:** review (single iteration; iteration 5 of 10; stop_policy=max-iterations — broaden, do not converge)
- **Agent:** deep-review (LEAF, GLM-5.2)
- **sessionId:** rv-phase009-audit-20260701-184748
- **Status:** complete (read-only diagnostic; no phase-009 file modified outside `review/`; no live backfill run anywhere)

## Dimension

Iteration 4 recommended this exact test because it was NOT sure whether D4-P1-001 (deriveStatus: implementation-summary.md present + no checklist.md ⇒ `complete`, graph-metadata-parser.ts:1216-1218) was a phase-009 footnote or a systemic tooling defect. Settle it with data. Secondary: adversarially re-challenge D2's UNVERIFIABLE verdict and re-confirm D1's "1/2425 unparseable" count, since both rest on negative evidence that should be re-probed rather than assumed stable.

## Method (adversarial toward iteration 4's own P1 classification)

Read the `deriveStatus` source in full myself rather than trusting iter 4's line paraphrase. Confirmed iter 4's citations are exact: override branch 1173-1176; ranked-frontmatter branch 1178-1195; unknown-availability branch 1197-1199; lean-parent (no impl-summary) branch 1201-1213; **the buggy branch 1215-1218** (`if (!checklistDoc) return { status: 'complete' }`); checklist-evaluation branch 1220-1223. Enum is closed: `planned, draft, placeholder, in_progress, blocked, deferred, complete, unknown` (graph-metadata-schema.ts:19-28) plus synonyms done/completed/active (parser:184-199).

Then ran a READ-ONLY repo-wide sweep replicating `deriveStatus`'s FULL decision tree (not just the trigger condition) over every spec folder under `.opencode/specs` + `specs`. No scratch files written — all probes were inline `node -e` (read-only). Sample size and criteria stated explicitly under each finding so the result is reproducible.

## Files/Folders Reviewed

- `skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` — `deriveStatus` 1167-1224 (re-read in full this iteration); `normalizeDerivedStatus` 173-200; `evaluateChecklistCompletion` 1226-1232; `deriveImportanceTier` 1234-1242; `deriveGraphMetadata` 1252-1269 (status wiring at 1269).
- `skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` — `GRAPH_METADATA_STATUS_VALUES` 19-28 (closed enum source of truth).
- **Repo-wide read-only sweep:** all 2425 `graph-metadata.json`, all 2047 `implementation-summary.md`, all `checklist.md`/`spec.md`/`tasks.md`/`plan.md` frontmatter under both spec roots. No file was written, renamed, or deleted anywhere in the repo.

## Findings by Severity

### P0 (Critical): 1 escalated (D4-P1-001 → D4-P0-001).

---

#### D4-P0-001 (escalated from D4-P1-001) — `deriveStatus` false-complete is a SYSTEMIC repo-wide tooling defect: 363 spec folders would be mislabeled `complete` while actually incomplete; 213 are ALREADY corrupted on-disk in the live graph/memory index today

- **Claim:** The false-complete heuristic is not a phase-009 instance. Replicating `deriveStatus`'s complete decision tree over the whole repo: of all spec folders with `implementation-summary.md` present AND no `checklist.md` (the trigger set, **768 folders**), only **2** carry a valid frontmatter enum `status` in any ranked doc — so **766** fall through to the buggy line 1216 and receive `status: 'complete'`. Of those 766, **363 are ACTUALLY INCOMPLETE** (frontmatter `completion_pct < 100` OR ≥1 open `[ ]` task in tasks.md) and would therefore be FALSELY labeled complete (263 with a verbatim scaffold implementation-summary.md; 100 with authored-but-still-incomplete content). **213 of those 363 already show `derived.status: "complete"` in their on-disk `graph-metadata.json` right now** — i.e. the corruption is already live in every consumer of the metadata layer (memory_search, packet graph, resume ladders, status rollups), not a latent risk awaiting a future backfill. Phase 009 itself is in the victim set (confirmed). The defect spans at minimum the `anobel.com`, `design`, `ai-systems`, and `deep-loops` tracks — it is not packet-local.
- **Sample size & criteria (reproducible):** population = all folders under `.opencode/specs` + `specs` containing `implementation-summary.md` (2047). Trigger set = subset with NO `checklist.md` sibling (768). "Frontmatter status valid" = `normalizeDerivedStatus` applied to the first `status:` field found in the YAML frontmatter of any of [implementation-summary.md, checklist.md, tasks.md, plan.md, spec.md], using the exact closed enum + synonyms above. "Actually incomplete" = `completion_pct:` in spec.md frontmatter `< 100` OR a `^[-*] [ ]` open-task line in tasks.md. "Already live-corrupted" = the folder's on-disk `graph-metadata.json` parses and has `derived.status === "complete"`.
- **evidenceRefs:**
  - graph-metadata-parser.ts:1215-1218 (`if (!checklistDoc) return { status: 'complete', reviewRequired: false }` — unconditional once impl-summary present);
  - graph-metadata-parser.ts:1178-1195 (ranked-frontmatter branch — only 2/768 trigger folders satisfy it, proving 766 reach the bug);
  - graph-metadata-schema.ts:19-28 (closed enum; bracketed placeholder `status: [Draft/In Progress/Review/Complete]` normalizes to null);
  - sweep tallies: trigger set 768; frontmatter-null 766; actually-incomplete 363 (263 scaffold + 100 authored); on-disk status of those 363 = {complete:213, in_progress:60, planned:52, draft:17, deferred:1, blocked:1, no-graph-metadata-file:19};
  - phase 009 confirmed in victim set; iteration-3.md (impl-summary verbatim scaffold); graph-metadata.json:3 (legacy `Status: planned`);
  - victim samples: `anobel.com/005-glm-visual-refinement/005-gpt5-5-skeleton-author` (pct:0, open:24, scaffold), `design/008-sk-design-parent/005-build-subskills` (pct:0, open:16, scaffold), `ai-systems/006-blog-posts-generalization` (pct:10, open:16, authored-but-incomplete), `deep-loops/032-goal-opencode-plugin/012-regression-test-backfill` (pct:0, scaffold).
- **counterevidenceSought (and result):**
  1. *Is the "actually incomplete" criterion reliable, or are the 213 on-disk-complete folders genuinely-done-with-stale-pct?* Cannot fully exclude a stale-pct fraction without per-folder authoring verification. BUT phase 009 (pct:0, handover explicitly says work not started, all docs verbatim scaffolds) is DEFINITIVELY a false-complete, proving the heuristic genuinely errs and is not merely flagging legitimately-complete folders. The 213 is therefore an upper bound on live corruption; the realized count is somewhere in [phase-009-like definitive false-positives … 213]. Even the lower bound (the scaffold pct:0/open>0 subset, ~150+) is systemic.
  2. *Does my frontmatter-status extraction faithfully match `collectPacketDocs`?* Corroborated independently: the 213 folders already show `complete` on-disk, which is ONLY reachable via line 1216 (their frontmatter has no valid status) — so production `deriveStatus` demonstrably reaches the buggy branch for these. The on-disk state is a natural experiment confirming my replicated decision tree matches the real function.
  3. *Is the 19 "UNPARSEABLE" a second D1-class corruption spike?* No — re-checked against the D1 sweep (still exactly 1/2425 unparseable, phase 009's own file). The 19 are folders with NO `graph-metadata.json` file present (ENOENT in the probe, mislabeled "UNPARSEABLE" by my try/catch). They are latent victims: a backfill would CREATE their graph-metadata.json as `complete`. Distinct from D1's parseability defect.
- **alternativeExplanation (for keeping it P1 / isolated):** "Only phase 009" — REFUTED (363 victims, 4+ tracks). "Latent only, would need a future backfill" — REFUTED (213 already live on-disk). "deriveStatus is correct by design: scaffold-with-impl-summary = structurally complete" — untenable: it makes `status` useless for distinguishing authored from scaffold phases AND directly contradicts the packets' own `completion_pct: 0` and open tasks; the on-disk `complete` for folders that are unambiguously not started (phase 009) is a correctness violation by any reading.
- **finalSeverity:** **P0** — systemic tooling-level correctness defect with realized production impact (213 already-live false-complete signals in the graph/memory index) and cross-cutting consumers. The D4-P1-001 `upgradeTrigger` ("repo-wide sweep finds false-complete mislabeling many genuinely-incomplete phases → systemic tooling defect") is MET. This is a sibling to D1-P2-001 (loader/validator read-path split): both are graph-metadata tooling defects where the derive/validate surfaces disagree about what "complete"/"valid" means.
- **confidence:** 0.93 (deriveStatus decision tree replicated end-to-end over the full repo AND independently corroborated by the 213 already-corrupted on-disk files — a natural experiment, not self-reference).
- **downgradeTrigger / upgradeTrigger:** **Downgrade to P1** if `deriveStatus` is patched to consult `completion_pct` / open tasks before declaring complete (so file-presence alone can never yield `complete` for an incomplete phase), OR a per-folder authoring audit shows the vast majority of the 213 on-disk-complete are actually-complete-with-stale-pct. **No further upgrade path** (already P0); the 213-live figure could rise if more backfills run before the patch.

---

### P1 / P2: none new this iteration. (D4-P2-001 synopsis/tier regression, all D1/D2/D3 P2s unchanged — re-confirmed, not re-litigated.)

## Traceability Checks

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` (core) | checked | Re-read `deriveStatus` source in full; replicated its decision tree repo-wide; corroborated via on-disk natural experiment (213 already-corrupted). |
| `checklist_evidence` (core) | notApplicable | Level 1 phase; no checklist.md. |
| `skill_agent` (overlay) | checked | Confirmed the buggy branch is reachable under default `refreshGraphMetadataForSpecFolder` invocation (no statusOverride passed, 1505-1508). |
| `agent_cross_runtime` (overlay) | notApplicable | Not an agent-definition review. |
| `feature_catalog_code` (overlay) | notApplicable | Not a feature-catalog review. |
| `playbook_capability` (overlay) | notApplicable | Not a playbook review. |

## Verdict on D4-P1-001 severity

**ESCALATE to P0 (now D4-P0-001).** Iteration 4's own `upgradeTrigger` is satisfied by data, not assertion: 363 actually-incomplete folders would be mislabeled `complete`, of which **213 are already corrupted on-disk in the live metadata index today** (spanning anobel.com / design / ai-systems / deep-loops). Phase 009 is one instance of a repo-wide pattern, not the pattern. The defect is in `deriveStatus` (graph-metadata-parser.ts:1215-1218): it declares `complete` on file-presence alone (implementation-summary.md exists, checklist.md absent) with NO consultation of `completion_pct`, open tasks, or scaffold markers — so any unauthored or partially-authored Level-1/2 phase without a checklist is systematically mislabeled. This is a tooling-level correctness defect (sibling to D1-P2-001), not a phase-009 documentation defect.

**Adversarial caveat honored:** the 213 "already live-corrupted" is an upper bound; a stale-pct fraction cannot be excluded without per-folder verification. But the lower bound (definitive false-positives like phase 009, plus the ~150 scaffold pct:0/open>0 folders) is already systemic by any threshold, and the on-disk `complete` values are independently reproducible evidence that production `deriveStatus` reaches line 1216 — the escalation does not rest on my replication alone.

## D2 Re-Challenge (secondary)

Re-ran `git reflog -30`, `git stash list`, and a repo-wide lock/pid grep for phase 009 ~35-40 min after iteration 2. **No change.** Reflog shows only the same 032 commits already catalogued (HEAD@{3},{5},{9},{15},{17},{18},{21},{22},{24},{28}) plus reset-to-HEAD entries; no reset/stash/checkout touching phase 009 specifically. Stash list is still exactly 6 entries (matches the D2-P2-001 corrected count). Lock/pid grep for `009-speckit-command-goal-prompt-offer` still returns NONE (only this review's own `.deep-review.lock`). **D2 verdict UNVERIFIABLE-FROM-THIS-MACHINE (local-negative ~0.78) STANDS** — the negative local evidence is stable; a remote/detached session remains non-excludable as before.

## D1 Re-Confirm (secondary)

Re-derived the repo-wide unparseable count: still **exactly 1 of 2425** (`009-speckit-command-goal-prompt-offer/graph-metadata.json`). No other process introduced a second unparseable file. D1's "isolated" finding is stable. (Note: the 19 "no graph-metadata.json" folders surfaced in the D4 sweep are ENOENT/missing, not unparseable — distinct from D1's parseability defect; recorded here only to prevent a future reader conflating the two.)

## SCOPE VIOLATIONS

None. All writes confined to the allowed paths under `review/` (`iterations/iteration-5.md`, `deep-review-state.jsonl` append, `deltas/iter-005.jsonl`, in-place `deep-review-strategy.md` + `deep-review-findings-registry.json`). No scratch files created — every sweep was an inline read-only `node -e` / bash probe. No file under `009-.../` outside `review/` was created, modified, deleted, or renamed. No live (non-dry-run) backfill/refresh was run against phase 009 or ANY other spec folder repo-wide — only read-only `JSON.parse`/`readFileSync`/frontmatter-regex probes. `git status` scoped to phase 009 remains clean except for the `review/` additions.

## Next Focus for iteration 6

With D4-P1-001 escalated to P0 and corroborated by on-disk natural experiment, the highest-value remaining angles (stop_policy=max-iterations → keep broadening):
1. **Quantify consumer blast radius of the 213 live-corrupted rows:** do `memory_search` / packet-status rollups / resume ladders actually READ `derived.status`, and do any of them CHANGE behavior on `complete` vs `planned` (e.g. skip a phase in a resume ladder, exclude from "open work" lists)? If a consumer acts on the false `complete`, the P0 gains a concrete user-facing failure mode beyond metadata inaccuracy. Read-only: grep the consumers of `derived.status` and trace the branch conditions.
2. **Patch-shape feasibility (READ-ONLY design, no implementation):** sketch the minimal `deriveStatus` fix (consult `completion_pct`/open-tasks before line 1216) and verify it would NOT break the 403 plausibly-complete folders (pct:100/open:0) — i.e. confirm the fix's true-positive rate on the sweep data already gathered.
3. **Tertiary:** adversarially re-challenge D3's "BUILDABLE-BUT-UNAUTHORED" by actually dry-tracing the handover §3 plan against the live `/speckit:*` router/presentation files for any drift since iteration 3.
