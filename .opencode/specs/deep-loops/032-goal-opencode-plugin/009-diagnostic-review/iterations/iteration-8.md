# Iteration 8 — D2 Sanity Check: The "Claude-Session" Handle Is the Authoring Session's, Not the Concurrent One's

- **Dimension:** D2 (schema: traceability)
- **Mode:** review (iteration 8 of 10; stop_policy=max-iterations — broaden, do not converge)
- **Agent:** deep-review (LEAF, GLM-5.2)
- **sessionId:** rv-phase009-audit-20260701-184748
- **Status:** complete (read-only diagnostic; no phase-009 file modified outside `review/`)

## Objective

Adversarially falsify iteration 7's optimism. Iter-7 called `Claude-Session: https://claude.ai/code/session_01MaduKvU39V7TZ4qrdB8b5k` on commit `8405ba4f57` "a concrete handle" naming the concurrent session. The brief posits two competing failure modes, both fatal to iter-7's reading: **(a)** the id is a FIXED template placeholder reused verbatim by unrelated sessions (zero evidentiary value); **(b)** the id is real but belongs to the COMMITTING session, not the described concurrent one (zero *distinguishing* value). Determine which (if either) the data supports, and re-baseline the prose-only past-tense confidence.

## Session-Handle Uniqueness Check

Exact-id probes (all read-only, `git log --all`):

| Probe | Command form | Result |
|---|---|---|
| id in commit MESSAGES | `--grep="session_01MaduKvU39V7TZ4qrdB8b5k"` | **16 commits** |
| id in commit DIFFS (pickaxe) | `git log -S"session_01MaduKvU39V7TZ4qrdB8b5k"` | **0 commits** (rename-limit warning only) |
| trailer byte-identity across the 16 | `... --grep | grep Claude-Session | sort -u` | **1 line** (byte-identical) |
| base rate | commits w/ ANY `Claude-Session:` trailer | **588** total → id = **16/588 = 2.7%** |
| distinct ids repo-wide | `--grep=Claude-Session` bodies \| uniq -c | **≥16 distinct ids**, long-tail: 193/99/70/69/54/23/23/**16**/15/8/6/5/4/1/1/1 |
| id in committed FILE content (pickaxe, any history) | `-S` | **0** |
| id in working-tree files | repo-wide `rg` | **only inside this `review/` packet** (iter-7, strategy, registry, prompts/iteration-8, deltas) — i.e. places iter-7/this brief itself wrote it. **Zero** commit-template / CLAUDE.md / sk-git file contains it. |

**The 16 commits are ONE coherent burst**, all Michel Kerkmeester, all packet-032/mk-goal/plugins, 2026-07-01 **12:48:44 → 20:16:57 +0200** (~7.5 h):

```
4be33488ea 12:48  chore: snapshot dual-audit + remediation phases before dispatch
3cb6d1bff9 13:17  fix(mk-goal): land phase 010 security + correctness fixes
303902e631 13:38  fix(mk-goal): normalize command filename + close 2 config-contract gaps
f510f8e96f 13:39  fix(mk-goal): close 2 config-contract gaps + fix command doc/metadata
698cc11031 14:07  fix(032): make phase 004's key_files fix durable
380e9d05ef 14:09  test(mk-goal): backfill regression coverage
6aba6dea67 14:43  docs(032): record operator decision for usage_limited
9c8c5ac56a 14:50  docs(032): create phase 014, mark 010-012 complete
ea9a45d649 15:05  feat(mk-goal): wire usage_limited detector
cba2d1e7fc 15:23  feat(mk-goal): archive-then-prune goal state
5dc1ee92a3 15:25  docs(032): mark phases 010-014 complete
8405ba4f57 15:42  fix(032): amend command name to goal_opencode.md   <-- THE "concurrent session" commit
731291a833 16:32  chore(032): archive completed plugin-implementation audit
0650d3123d 19:39  docs(032): remediate 10-iter doc-staleness review findings
8bfbffc433 20:05  refactor(plugins): rename __tests__ to tests
c4d34bc71f 20:16  docs(032): add timeline, before-vs-after, changelogs
```

`8405ba4f57` is **sandwiched mid-flow** between `5dc1ee92a3` ("mark phases 010-014 complete", 15:25) and `731291a833` ("archive completed audit", 16:32) — i.e. it is an interior commit of the remediation session, not an isolated artifact a concurrent session left behind.

**Verdict on the brief's "fixed template" hypothesis — REFUTED.** A fixed placeholder would (i) dominate the 588 `Claude-Session` commits, not sit at 2.7%; (ii) collapse to ONE id, not a ≥16-id long-tail; (iii) scatter across unrelated packets/dates, not cluster in one ~7.5 h coherent burst. The id is a **real per-session id for one specific Claude session**. (Caveat: the brief asserts the literal lives in "Claude Code's own commit-message instructions ... in this very session's system prompt." This runtime — OpenCode/GLM-5.2 — has no such injected prompt, and the literal is in ZERO committed repo files. Whether Claude Code injects it as an example is untestable from here, but the *observed usage pattern* is per-session, not templated: even if the example exists, sessions are clearly emitting real ids, not copying the example verbatim — the long-tail proves it.)

**Verdict on iter-7's "concrete handle for the concurrent session" — ALSO REFUTED, by a different mechanism.** The one real session that owns this id is the **authoring/remediation session**, not the described concurrent one. The same handle rides 15 sibling commits that are unambiguously the phase-011 remediation author's OWN work (phase-010 security fixes, phase-014 creation, "mark 010-014 complete", test backfill, doc remediation). A trailer stamped by `git commit` identifies **who committed**, never a third party merely *described* in the message body. The concurrent session left no trailer because — per `8405ba4f57`'s own prose — its work was **uncommitted working-tree state**, i.e. it never ran `git commit`. Iteration 7 conflated the speaker with the subject.

## Co-Authored-By Uniqueness Check

| Probe | Result |
|---|---|
| `Co-Authored-By: Claude Sonnet 5` occurrences | **26** repo-wide |
| dominant Co-Authors (for contrast) | Opus 4.7 (2149), Opus 4.8 (1286), Opus 4.6 (1284), Opus 4.6 no-context (279) |
| nature | **model-level, not session-level** — reappears across unrelated packets/dates/authors |

`Co-Authored-By` tells you which *model* co-authored, full stop. It cannot distinguish two Sonnet-5 sessions from each other. **Zero session-attribution value** — strictly weaker even than the Claude-Session trailer (which is at least per-session, though per-committing-session). Iter-7 citing it alongside the URL as corroboration of a *distinct* concurrent session is unsupported.

## Revised D2 Assessment

The trailer was never the load-bearing evidence for iter-7's prose case (the operator-statement citation + the commit prose were), but iter-7 *did* list it in `evidenceRefs` and flagged it as "a concrete handle ... worth checking." That framing is now corrected: the handle corroborates only that the remediation session committed `8405ba4f57` — already obvious from author/date. It does **not** corroborate that a *distinct* concurrent session existed.

Strip the handle; what survives for "a concurrent session existed and acted on 2026-07-01"? Only the **prose** of `8405ba4f57` itself ("already renamed in the shared working tree, uncommitted" / "matching what a concurrent session had independently converged on") plus the operator-statement citation family (`changelog-032-011:33`). That is a single first-hand author claim — accountable, committed, no obvious motive to fabricate — but it is ONE source, lacking the second-party fingerprint (named file + line-count + captured concurrency-state) the base-rate (design-039) shows this repo's genuine concurrent claims carry.

| Sub-claim | iter-7 | **iter-8** | Basis for change |
|---|---|---|---|
| Concurrent session existed & acted (past) | ~0.90 | **~0.80** | Trailer-as-distinct-session corroboration removed (it is the authoring session's stamp); prose + operator-statement alone remain; base-rate anomaly (no fingerprint) unchanged |
| It was specifically the phase-009 session | ~0.60 | ~0.60 (unchanged) | Trailer never helped here; commit still says "concurrent session" generically; phase-009 label still layered in later docs |
| A session is actively editing phase 009 now | ~0.55 | ~0.55 (unchanged) | No new local-activity evidence this iteration |

**Self-correction note:** iter-7's 0.90 was optimistic — it implicitly treated the trailer as independent corroboration of a second session. The data shows the trailer is the first session's own stamp. The downgrade to 0.80 is honest, not a collapse: the prose is genuinely first-hand and committed, but the false precision is removed.

## Findings by Severity

### P0 (Critical): none new. (D4-P0-001 not re-probed this iteration.)

### P1 (Major): none new.

### P2 (Minor): 1 new (D2-P2-004), 1 confidence-downgraded (D2-P2-002 0.84→0.80).

---

#### D2-P2-004 (NEW) — `Claude-Session` / `Co-Authored-By` trailers are committer/model attribution, not described-actor attribution; cannot corroborate a DISTINCT concurrent session (corrects iter-7 "concrete handle")

- **claim:** The `Claude-Session` and `Co-Authored-By` trailers on `8405ba4f57` identify the COMMITTING session and its MODEL. They do not — and structurally cannot — identify the "concurrent session" merely described in the message prose. Treating them as session-attribution evidence for a distinct concurrent session (as iter-7 did) is a category error.
- **evidenceRefs:**
  - id `session_01MaduKvU39V7TZ4qrdB8b5k` on **16** commits, byte-identical, forming one 12:48–20:17 remediation burst incl. `8405ba4f57` (`git log --all --grep` + `sort -u` → 1 line);
  - `8405ba4f57` (15:42) interior to the burst, between `5dc1ee92a3` (15:25 "mark 010-014 complete") and `731291a833` (16:32 "archive audit") — i.e. same-session flow;
  - **0** commits carry the id in diff content (`git log -S` pickaxe); **0** committed repo files contain it (working-tree `rg` hits only this `review/` packet);
  - `Co-Authored-By: Claude Sonnet 5` = **26×** repo-wide, model-level (Opus 4.7/4.8/4.6 in thousands); ≥16 distinct `Claude-Session` ids in a long-tail (193/99/70/69/54/…/16/…).
- **counterevidenceSought (and result):** (1) Brief's "fixed template" hypothesis — REFUTED: a template would dominate 588 `Claude-Session` commits (not 2.7%), collapse to one id (not a 16-id long-tail), and scatter (not cluster in one burst). The id is a real per-session id. (2) Is the id unique to one commit (true fingerprint)? NO — 16 commits. So it is neither generic-placeholder nor single-commit-unique; it is one real session's id, and that session is the author.
- **alternativeExplanation:** The concurrent session described in prose never committed (working-tree-only per the message), so by definition it left no trailer. Its existence rests solely on the prose, not on any trailer handle.
- **finalSeverity:** **P2** (audit-evidence-interpretation / methodology correction; prevents the misread from propagating into synthesis). Sibling in spirit to D2-P2-003 (citation-detail accuracy).
- **confidence:** **0.93** (data is unambiguous; only residual uncertainty is whether Claude Code injects the literal as a runtime example — irrelevant, since observed usage is per-session regardless).
- **downgradeTrigger:** informational once iter-7's "concrete handle" language is corrected in strategy + registry (this iteration does that).
- **upgradeTrigger:** n/a (factual/methodological).

---

#### D2-P2-002 (CONFIDENCE DOWNGRADED 0.84 → 0.80) — iter-8 correction: the `Claude-Session` URL carried in `evidenceRefs` identifies the authoring session, not a distinct concurrent one; prose + operator-statement are the sole surviving support

- **What changed:** the `Claude-Session` URL and `Co-Authored-By: Claude Sonnet 5` entries iter-7 added to `evidenceRefs` are **not** independent corroboration of a second session (see D2-P2-004). The operator-statement citation (`changelog-032-011:33`) and the commit PROSE remain valid and are the entire surviving support.
- **evidenceRefs (corrected):** drop the trailer's evidentiary weight; retain `8405ba4f57` prose ("already renamed in the shared working tree, uncommitted" / "matching what a concurrent session had independently converged on") + `changelog-032-011:33`.
- **finalSeverity:** **P2** (unchanged — still governed by the present-tense pickup question).
- **confidence:** 0.84 → **0.80**.
- **downgradeTrigger / upgradeTrigger:** unchanged from iter-7.

---

## Verdict

**D2 is covered** for iteration 8 (genuine, non-duplicate correction of iteration 7 — not a re-walk).

Two readings falsified, by different mechanisms:
1. **Brief's "fixed template" hypothesis — REFUTED.** The id is a real per-session id (2.7% of 588; ≥16-id long-tail; one coherent burst).
2. **Iter-7's "concrete handle for the concurrent session" — REFUTED.** The handle is the authoring/remediation session's own commit stamp; the concurrent session (working-tree-only, never committed) left no handle by definition. Iter-7 conflated speaker with subject.

**Refined D2 verdict label:** `PARTIALLY-SUBSTANTIATED (past)` → **`PAST-TENSE-SUBSTANTIATED-ON-PROSE-ONLY`**. The past-tense sub-claim still stands (a first-hand author statement in a committed artifact is not nothing), but its confidence drops 0.90 → 0.80 and it now rests on a single source with no second-party fingerprint — base-rate-anomalous vs design-039's genuine concurrent-claim trail.

**Decision-relevance (unchanged):** safe to pick up phase 009 PROVIDED the operator confirms no session is actively editing it right now. That was always governed by the **present-tense** reading (~0.55), which this iteration did not move. The past-tense correction changes the *narrative weight*, not the *operational gate*.

## SCOPE VIOLATIONS

None. All writes confined to the four allowed paths under `review/` (`iterations/iteration-8.md`, `deep-review-state.jsonl` append, `deltas/iter-008.jsonl`, in-place `deep-review-strategy.md` + `deep-review-findings-registry.json`). No file under `009-.../` outside `review/` was created, modified, deleted, or renamed. Reading was unrestricted repo-wide and exercised (`git log --all --grep`/`-S`, `sort|uniq`, working-tree `rg`). No live (non-dry-run) fix executed or recommended.

## Next Focus for iteration 9

1. **The trailer angle is EXHAUSTED — do not re-probe `Claude-Session` / `Co-Authored-By` attribution.** Committer/model semantics are settled (D2-P2-004); no further data can distinguish the described concurrent session because it never committed.
2. **Rebalance toward D4 (now highest-value unexhausted angle):** the strategy's iter-7/8-recommended validator cross-field-gap — `generated-metadata-integrity.ts:99` validates `derived.status` *enum membership* but has NO status-vs-`completion_pct`-vs-open-tasks consistency check, the structural reason `validate.sh --strict` never flagged the 213 corrupted files (iter 5/6). Quantify whether ANY cross-field consistency check exists anywhere in the validation layer; if none, surface as a new P1/P2 sibling to D1-P2-001. This directly strengthens the D4-P0-001 fix narrative.
3. **Tertiary:** count the pure-null `completion_pct` subset (folders with spec.md but NO frontmatter `completion_pct`) to size the `deriveStatus` fix's edge case 2 (iter-6 unfinished secondary).
