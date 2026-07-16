# Research: Spec Drift and Prior Context-Optimization Across `.opencode/specs/*`

> **glm lineage synthesis** for packet `006-global-spec-drift-deep-research`.
> executor: cli-opencode / zai-coding-plan/glm-5.2 | sessionId `fanout-glm-1784206807603-dm75z2` | generation 1.
> Converged at iteration 5/10 (legal convergence: all 5 key questions answered). This is one of three independent fan-out lineages (glm, sol, luna); findings here are this lineage's independent view.

---

## 1. Executive Summary

A full-tree sweep of **165 packets across 12 tracks** under `.opencode/specs/*` finds that spec drift is **systemic but well-characterized**, not chaotic. Five independent dimensions were investigated (status, numbering, naming, context-optimization precedent, structural). The drift concentrates into a small number of mechanisms: (1) a **dual numbering scheme** left by partial migrations, (2) a **completion-state gap** where human-authored spec.md prose over-states completion relative to derived graph-metadata state, (3) **naming debt** gated behind an unenforced kebab-case program, and (4) **archive-lifecycle status gaps**. Critically for phase 007, prior **context-optimization efforts are well-documented** and provide direct precedent: deprecation-driven context pruning (devin/gemini) is the closest analogue to a memory-DB teardown, and a compaction-hook program (024-compact-code-graph) already established the mechanism.

The single most load-bearing finding: the **006 packet launched its own research on a gate the graph state does not corroborate** — phase 005 (sk-design) is narrated "complete/shipped" but its packets are deliberately held at `draft` as reconstruction drafts pending verification. This is an *intentional* status-semantics mismatch (not a defect), but it is exactly the class of drift that misleads any gate reading prose instead of derived state.

---

## 2. Research Topic
Spec drift and prior context-optimization efforts across all `.opencode/specs/*`.

---

## 3. Methodology
Five iterations, each scoped to one key question, with mechanical full-tree scans (status diffs, slug enumerations, snake_case `find`) cross-checked against targeted document reads (spec.md, implementation-summary.md, graph-metadata.json, skills trees). Convergence on coverage (5/5 questions evidence-backed) plus a descending novelty trend (1.0 → 0.80 → 0.65 → 0.75 → 0.55). All findings cite `[SOURCE: file:...]`.

---

## 4. Key Findings — Status Drift (Q1)

**Completion-state drift is systemic: ~45 raw / ~23 semantic mismatches across 121 packets (~37% raw).**

- The dominant genuine-drift pattern is **spec.md over-states completion**: it claims `complete` or `blocked` while graph-metadata reports `in_progress`/`planned` with no draft caveat. Examples: cli-001, cli-004, cli-007, cli-011, cli-028(blocked), sk-doc/015, sk-git/014, sk-prompt/001/002/004, system-deep-loop/033/068, system-skill-advisor/001/009/013, system-speckit/032/034.
- **Reverse drift** also occurs (spec `in progress`, graph `complete`): system-deep-loop/032-goal-opencode-plugin.
- A meaningful subset is **intentional, not a defect**: the sk-design reconstruction family's packets are deliberately held at `draft` because they are "RECONSTRUCTION DRAFT[s] ... verified against its SKILL.md before being treated as authoritative" — the *work* shipped (001-008 authored, validated, landed; skills exist), but the *status field* stays draft by design.

**Implication:** any gate that reads spec.md prose instead of graph-metadata will be misled. The 006 packet itself demonstrates this hazard (it used "001/003/005 complete" to satisfy its launch gate while the graph says draft).

---

## 5. Key Findings — Numbering Drift (Q2)

**Root cause: two numbering schemes coexist from partial migrations.**

- **Local per-track counters** (clean `001..NNN`): cli-external-orchestration, mcp-tooling, sk-design, sk-prompt, system-skill-advisor.
- **Global-offset ranges** (each track owns a slice of a repo-wide counter): sk-code (017-020), sk-git (007-014), system-code-graph (025-035), system-deep-loop (029-068), system-speckit (000, 026-041).
- Phases 001-005 targeted 5 tracks but **did not unify the tree**; the global-offset tracks never renumbered retain gaps (sk-code starts at 017; sk-git at 007; system-deep-loop has 7 gaps from deleted/archived packets).
- **Cross-track "collisions" are NOT drift** — the `{track}/{NNN}` path namespace disambiguates identical numbers.
- The parent `000-migration-from-soa-and-cleanup/graph-metadata.json` causal_summary documents the mechanism explicitly: *"untracked stub/duplicate directories left behind by prior partial migrations"* (e.g. system-speckit 002/003/004/007 shadowed by 0-file duplicate copies at 026-029).

---

## 6. Key Findings — Naming Drift (Q3)

**61 snake_case directories in 4 clusters; the kebab-case program is unenforced.**

- The repo-wide kebab-case program (sk-doc/032-hyphen-naming-convention) is **`planned`/Draft** — authored but not shipped, so the snake_case ban is not yet live.
- The 61 snake_case dirs cluster: `z_archive` (×11, all tracks), `z_future` packets (×9), sk-doc/013 legacy scratch/fixtures (~30, artifacts of packet 027's underscore migration that 032 reverses), and misc (`review_archive`, dispatch state).
- **The convention itself flip-flopped**: packet 027 introduced snake_case, then 032 reverses it back to kebab, explicitly flipping the validator guard. This churn is itself a documented drift pattern.
- **Primary numbered packet slugs are already clean kebab-case**; naming drift is confined to archive/future/scratch zones.

---

## 7. Key Findings — Prior Context-Optimization Efforts (Q4)

**Six recurring optimization mechanisms are documented; the lifecycle is cyclical (build → compact → archive → refine).**

| Pattern | Representative packet | Outcome |
|---|---|---|
| Compaction (precompact hooks, stop-hook tracking) | `system-speckit/z_archive/024-compact-code-graph` | Hook-driven context compaction; superseded but sets the compaction precedent. |
| Memory-continuity substrate | `027/003-memory-and-causal-runtime` | Continuity fields + causal-graph routing as durable context channel. |
| Lean-root retrieval optimization | `system-speckit/028-xce-research-based-refinement` | Lean root + clean metadata + `context-index.md` migration bridge. |
| **Deprecation-driven context pruning** | `cli-external-orchestration/022-cli-devin-deprecation/context/`, `021-cli-gemini-deprecation` | Pruning agent rosters, cross-skill refs, graph edges on CLI retirement. **Direct precedent for phase 007 teardown.** |
| Continuity dedup | `_memory.continuity.session_dedup.fingerprint` | Per-session content fingerprint to dedup continuity saves. |
| Context-budgeting | `cli-opencode references/context-budget.md` | Explicit per-CLI context-budget affordances. |

**Precedent for phase 007:** deprecation-driven pruning (devin, gemini) is the closest analogue — it succeeded by pruning references + graph edges, with a `context/` deep-context research packet guiding the scope. A teardown should expect the same prune-references-and-graph-edges shape.

**Intra-program drift:** the context-optimization program itself carries numbering drift (filed as `027-graph-and-context-optimization` but referenced as `026` in its own title frontmatter and in 028).

---

## 8. Key Findings — Structural Artifacts (Q5)

**Structural artifacts are mostly intended design, not drift.**

- Root `.opencode/specs/descriptions.json` (2.8MB) is a **generated aggregate index** `{version, generated, folders}` — the machine-generated rollup of per-packet `description.json` files. Not drift.
- `system-skill-advisor/changelog` is a deliberate phase-parent namespace (contains numbered child), not drift — a minor convention deviation.
- **Genuine anomaly:** 7 of 8 `z_archive` folders report `planned` status (only sk-git/z_archive = `complete`). Archives never received a terminal status — plausibly because optimization programs never assign one. This is a design gap, not active drift.
- `sk-doc/999-create-diff-mode` (sentinel) and `z_future` unnumbered packets are intentional convention deviations.

---

## 9. Cross-Cutting Patterns

1. **Prose-vs-derived-state gap** is the meta-pattern: human-authored spec.md narrative and machine-derived graph-metadata drift apart because nothing reconciles them. This single mechanism explains ~80% of the observed status drift.
2. **Partial-migration debt**: every drift dimension (numbering, naming) traces to a migration that ran partway and stopped. The repo is mid-transition on both numbering (local→global) and naming (snake→kebab).
3. **Intentional-vs-defect ambiguity**: a meaningful fraction of "drift" is deliberate (reconstruction drafts, reserved names). Drift triage must read implementation-summary.md, not just status fields, to classify severity.

---

## 10. Recommendations

| # | Recommendation | Rationale | Effort |
|---|---|---|---|
| R1 | Add a CI/probe gate that diffs spec.md Status vs graph-metadata.json status and fails on semantic mismatch (excluding whitelisted reconstruction-draft packets). | Eliminates the dominant drift class mechanically. | Low |
| R2 | Reconcile the dual numbering scheme: either commit to per-track local counters everywhere, or finish the global-offset renumber for sk-code/sk-git and compact the deep-loop gaps. | Removes the structural numbering drift. | Medium |
| R3 | Ship sk-doc/032 kebab-case program (currently planned) and migrate the 61 snake_case dirs, OR formally exempt z_archive/z_future from the ban. | Resolves naming debt + stops the flip-flop churn. | Medium-High |
| R4 | Give `z_archive` folders a terminal status (`archived`) instead of `planned`, via the graph-metadata generator. | Closes the 7/8 archive-status anomaly. | Low |
| R5 | For phase 007: model the memory-DB teardown on the deprecation-driven pruning precedent (022-devin, 021-gemini) — prune references + graph edges, guided by a deep-context scope packet. | Reuses a proven optimization pattern. | — |

---

## 11. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Cross-track number collision as a drift category | Track path prefix disambiguates identical numbers; not a real collision | iteration-002.md:F2.2 | 2 |
| Primary numbered packets have snake_case slugs | Numbered slugs are clean kebab-case; deviations confined to z_archive/z_future/changelog/scratch | iteration-003.md:F3.4 | 3 |
| 9,834 keyword hits = 9,834 distinct efforts | Most are research-iteration `summarize` noise; real efforts are ~6 mechanisms across ~10 packets | iteration-004.md:F4.4 | 4 |
| Root `descriptions.json` is drift | It is a generated aggregate index `{version,generated,folders}` | iteration-005.md:F5.4 | 5 |
| sk-design status=draft is a defect | Intentional: reconstruction drafts pending verification; work shipped | iteration-005.md:F5.1 | 5 |

---

## 12. Open Questions (unresolved / deferred)

- **Severity remediation cost** of the ~23 genuine status mismatches is characterized but not individually triaged (which are "spec wrong" vs "graph stale"). Deferred to the parent packet's REQ-006 triage step.
- **Whether sk-doc/032 will actually ship** (and thus convert naming debt into active violations) is a forward uncertainty outside this research's scope.
- The **`z_archive=planned` root cause** (generator default vs. deliberate) is inferred, not confirmed by reading the generator — a low-priority follow-up.

---

## 13. Confidence Assessment

| Dimension | Confidence | Basis |
|---|---|---|
| Status mismatch counts | High | Mechanical full-tree diff |
| Numbering scheme split | High | Per-track slug enumeration |
| Naming cluster counts | High | `find -type d -name '*_*'` |
| Context-optimization taxonomy | High | Multiple corroborating packets |
| sk-design "intentional draft" | High | Direct implementation-summary quote |
| z_archive=planned root cause | Medium | Inferred (plausible, not generator-confirmed) |

---

## 14. Source Diversity

Sources span: graph-metadata.json (full tree, 121+ files), spec.md Status rows (full tree), implementation-summary.md (targeted), per-track slug enumeration, `find` for snake_case dirs, skills trees, root `descriptions.json` (JSON inspection), and parent 000 causal_summary. No single weak source dominates; findings rest on mechanical scans cross-checked against document reads.

---

## 15. Findings Triage (per parent REQ-006)

| Finding | Disposition | Evidence/Reason |
|---|---|---|
| Status spec-vs-graph mismatches (~23 genuine) | DEFER | Non-trivial; each needs per-packet "spec wrong vs graph stale" determination → follow-on packet. R1 gate prevents recurrence. |
| Dual numbering scheme | DEFER | Medium remediation; R2. Out of research-packet scope. |
| 61 snake_case dirs | DEFER | Gated behind sk-doc/032 shipping; R3. |
| z_archive=planned (7/8) | DEFER | Low-effort generator fix; R4. Trivial but cross-cutting. |
| sk-design "complete" vs draft | REMEDIATE (doc) | Already explained in 005 implementation-summary; recommend 006 spec note the draft caveat. No code change. |
| Numbering drift inside 027 (026 vs 027) | REMEDIATE (trivial) | One-line frontmatter/title fix in 027 spec.md. Inline-eligible. |
| Phase-007 teardown precedent (deprecation pruning) | INFORM | Feeds phase 007 planning; R5. |

---

## 16. Convergence Report

- **Stop reason:** `converged` (all 5 key questions answered; composite stop > 0.60; quality gates passed).
- **Total iterations completed:** 5 of 10.
- **Questions answered ratio:** 5/5 (100%).
- **newInfoRatio trend:** 1.0 → 0.80 → 0.65 → 0.75 → 0.55 (descending; coverage-driven stop before novelty floor).
- **Stuck count:** 0 (no stuck iterations).
- **Blocked stops:** 0.

---

## 17. References

- [SOURCE: file:.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md:48] (phase gate claims)
- [SOURCE: file:.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct/implementation-summary.md] (sk-design reconstruction-draft caveat)
- [SOURCE: file:.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/graph-metadata.json] (numbering-drift causal_summary)
- [SOURCE: file:.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md] + [028-xce-research-based-refinement/spec.md] (context-optimization program)
- [SOURCE: file:.opencode/specs/sk-doc/032-hyphen-naming-convention/spec.md] (kebab-case program)
- [SOURCE: file:.opencode/specs/cli-external-orchestration/022-cli-devin-deprecation/context/deep-context-strategy.md] (deprecation pruning precedent)
- [SOURCE: graph-metadata.json + spec.md Status rows across all 121 packets] (status/numbering baseline)
- [SOURCE: file:.opencode/specs/descriptions.json] (generated aggregate index)
- Iteration evidence: `iterations/iteration-001.md` … `iteration-005.md`.
