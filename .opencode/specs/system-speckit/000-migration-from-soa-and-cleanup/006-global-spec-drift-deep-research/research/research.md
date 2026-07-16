# Research: Global Spec Drift and Prior Context-Optimization Efforts across `.opencode/specs/*`

> **Merged phase-006 synthesis** for `000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research`.
> Fan-out ran three lineages (GLM, SOL, LUNA). **SOL (9 iterations) and LUNA (10 iterations) are the route-proof-compliant synthesis basis**; **GLM (5 iterations) failed the workflow's route-proof contract** (`glm-5.2` emitted a reduced record schema with no route-proof fields / no delta files) and is carried as a **supplementary, unverified-provenance** input per operator decision (see `spec.md` EXECUTION DEVIATION #2 and §Supplementary below).
> Consolidated via `fanout-merge.cjs` (`merged_lineages: 2`, `key_findings: 19`) + the workflow's `step_compile_research`. Purpose: the durable pre-teardown evidence gate for phase 007.

---

## 1. Executive Summary

A full-tree sweep of `.opencode/specs/*` finds that **spec drift is systemic in mechanism but packet-local in manifestation** — well-characterized, not chaotic. Metadata *coverage* is not the problem (SOL: all 2,168 active candidates had parseable `description.json` + `graph-metadata.json`); the problem is **semantic disagreement across authoring and generated surfaces** — spec prose, graph status, checklists, continuity fingerprints, and phase-parent rollups drift apart because nothing reconciles them.

The highest-impact confirmed classes:

1. **Fleet-scale completion/continuity drift** — SOL counted **212** terminal-spec/nonterminal-graph conflicts, **19** inverse conflicts, **1,093** all-zero continuity fingerprints, **164** "completion 100 vs nonterminal graph", **13** literal status-template placeholders, and **60** contradictory direct parent/child graph projections. No single surface is a safe universal completion authority.
2. **Explicitly deferred topology debt** — `sk-doc` retains active/archive overlap and six duplicated sibling prefixes (`010`–`015`) under `015-sk-doc-parent`; `system-deep-loop` retains its selected-but-operator-skipped active renumber plus stale `children_ids` (one untraceable). Both are the tracks this migration's phases 002/004 intentionally skipped.
3. **A canonical ownership pointer** in `system-speckit/040-base-files-renumbering-name-cleanup` targeting a deleted `skilled-agent-orchestration/z_archive/090-…` path across four docs.
4. **Fifteen active phase parents** retaining heavy root documents without a defined grandfather/migration policy.
5. **Derived-index residue** a rebuild can clear — ~152 stale code-graph rename entries, stale sk-design track-root child metadata.

The single most load-bearing meta-finding: **the "prose-vs-derived-state gap" drives most status drift**, and a gate that reads spec.md prose instead of derived graph-metadata will be misled. This packet's own launch gate (phases "001/003/005 complete") is an instance — some of that work is deliberately held at `draft` as reconstruction drafts. Completion labels are **scope-bounded, not proof of current global truth** (LUNA).

**For phase 007:** teardown can rebuild a functional search index from canonical spec documents and regenerate vectors, but it **cannot** restore evaluation history, `memory:learn` constitutional-rule provenance, drift/search-decision ledgers, or checkpoints — and it **cannot repair contradictory source documents**; a clean index faithfully reindexes the contradictions. Prior deprecation-driven context pruning (`cli-external-orchestration/022-cli-devin`, `021-cli-gemini`) is the closest existing precedent for the teardown's prune-references-and-graph-edges shape.

---

## 2. Research Topic

Spec drift and prior context-optimization efforts across all of `.opencode/specs/*` — surfacing residual drift the migration's five numbering/reconstruction phases (001–005) did not directly target, and documenting prior context-optimization precedent to inform phase 007's gated, destructive memory-database teardown.

---

## 3. Methodology

Two route-proof-compliant lineages under normal convergence:

- **SOL** (`openai/gpt-5.6-sol-fast`, high) — 9 iterations; quantitative full-tree inventory → active-topology/migration-residue → completion/metadata drift → context-optimization programs → teardown implications → drift taxonomy → three independent exact-path re-verification passes. Converged (rolling novelty 0.02 < 0.05).
- **LUNA** (`cli-codex gpt-5.6-luna`, max/fast) — 10 iterations; mechanism/authority-focused reads of high-signal packets, drift-taxonomy and controls-already-attempted framing, negative-knowledge capture. Reached max iterations (3/5 quantitative questions left open by design).

Both operated read-only (no repair, renumber, rebuild, daemon stop, or deletion). **Shared measurement boundary:** the code-graph index was empty (0 nodes), so structural caller analysis was unavailable; both lineages used direct source reads and treated raw file-count scans as contaminated by archive/backup/fixture/scratch copies. "Active candidate" is a research denominator (archive/backup/fixture/scratch excluded), not a claim that each is an independently governed top-level packet.

---

## 4. Key Findings — Inventory & Structural Drift

- **Scale (SOL):** 12 top-level tracks; 44,470 files (28,297 Markdown); **3,015 raw `spec.md` candidates** (657 under `z_archive`); **2,168 active** after excluding 847 historical/test copies; topology reaches depth 10, concentrated at depths 4–6.
- **Track numbering (SOL):** completed migration tracks are structurally clean at the track level — system-speckit active `026-041` above archive ceiling `025`; system-code-graph `025-035` above `024`; sk-design `001-009`; sk-code/sk-git begin above their archive ceilings; `000` coordinator and sentinel numbers are explicit exceptions, not defects. **The live concentration of drift is in the skipped tracks** (`sk-doc`, `system-deep-loop`).
- **Ownership drift (SOL):** `040-base-files-renumbering-name-cleanup` repeats a deleted `skilled-agent-orchestration/z_archive/090-…` packet-pointer across `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md`; target path has no current files — canonical ownership drift, not harmless prose.
- **Split authority (LUNA):** parent packets increasingly separate navigation/aggregate status from child evidence; topology migration uses an **explicit alias manifest + migration log** (arithmetic path inference is prohibited). Historical paths are therefore *not* automatically live drift.

---

## 5. Key Findings — Completion & Metadata Drift

Metadata coverage is strong; semantic freshness is not. SOL's fleet-scale counts (denominator 2,168 active):

| Drift class | Count | Implication |
|---|---:|---|
| Parseable description + graph metadata | 2,168 / 2,168 | File absence is not the primary problem. |
| Terminal spec, nonterminal graph | 212 | Gates over-report if prose is authority. |
| Nonterminal spec, complete graph | 19 | Reverse disagreement also exists. |
| Complete graph, unchecked checklist | 2 | Graph-complete ≠ checklist-complete. |
| Fully checked checklist, nonterminal graph | 54 | Checklist-complete ≠ graph-complete. |
| All-zero continuity fingerprints | 1,093 | Strict freshness cannot trust the placeholder. |
| Completion 100 vs nonterminal graph | 164 | Continuity % conflicts with generated state. |
| Literal status-template placeholders | 13 | Unfilled-template residue. |
| Contradictory direct parent/child graph status | 60 | Aggregate phase state lacks consistent semantics. |

**LUNA corroborates the mechanism:** completion labels are scope-bounded; status classifiers, implementation summaries, generated metadata, and research counts can each disagree, and parent metadata drift can leave graph traversal current while continuity/descriptions go stale. **Conclusion (both):** reconciliation needs provenance and explicit precedence, not a blanket "graph wins" or "spec wins" rule.

---

## 6. Key Findings — Prior Context-Optimization Efforts

Prior work already built and, in most cases, still ships effective controls (SOL verified against current TypeScript source):

| Mechanism | Implemented shape | Status / limitation |
|---|---|---|
| Compaction recovery | `PreCompact` builds a bounded cached payload; `SessionStart(source=compact)` injects it (`pendingCompactPrime`, ~4,000-token budget) | Implemented; verification bounded, not longitudinal. |
| Lifecycle-aware priming | Separate `startup`/`resume`/`clear`/`compact` routes, pressure-aware budgets (`session-prime.ts`) | Implemented (all four routes present). |
| Hookless bootstrap | Read-only snapshot, `session_resume(minimal)`, composite `session_bootstrap`, telemetry | Implemented. |
| Context quality metrics | Recency/recovery/graph-freshness/continuity factors | In-memory; final status computed separately from quality score. |
| Pointer-first continuity | Small `_memory.continuity`, resume ladder, fingerprint no-op saves | Implemented; ~50% dedup / sub-second resume are **design/research claims, not longitudinal measurements**. |
| Deep-context retirement | Standalone deep-context command removed; replaced by bounded workflow snapshots | Current active commands contain no standalone deep-context endpoint; historical parsing retained intentionally. |
| **Deprecation-driven pruning** | Prune agent rosters, cross-skill refs, graph edges on CLI retirement (`022-cli-devin`, `021-cli-gemini`), guided by a `context/` scope packet | **Direct precedent for the phase-007 teardown shape.** |
| Narrative compaction | Growth instrumentation + future-policy criteria only | **Did not ship** — no automatic summarizer/pruner/anchor-mover exists. |

**LUNA framing:** the graph/context-optimization program, the small-model optimization arc, and the memory-search program each coordinated controls as themed phase tracks — manifest-backed migration authority, phase-local evidence ownership, layered freshness checks, evidence-substance validation, second-pass historical correction, explicit current/ruled-out recording. **Limitations:** classifier vocabularies drift when duplicated; correction passes can leave contradictory lines; generated-metadata refresh can update one surface and miss another; no shared confidence rubric spans packets.

---

## 7. Key Findings — Phase-007 Teardown Implications

### 7.1 Hard authorization gates (SOL; corroborated by 007 spec)
Phase 007 is **not** authorized by this research. Authorization requires, at execution time: (1) this merged `research/research.md` exists durably and findings are triaged; (2) a **fresh** operator confirmation; (3) `mk_spec_memory` and `mk_code_index` daemons confirmed stopped; (4) deletion via the **exact named-path allowlist**, never a broad database-directory glob; (5) excluded code-graph / skill-advisor / deep-loop stores baselined and verified unchanged.

### 7.2 Rebuildable vs. irreversible

| State class | After teardown |
|---|---|
| Canonical spec-document search index | Rebuildable by scan. |
| Vector shards | Rebuildable by lazy re-embedding. |
| Stale rename-derived search rows (~152) | Expected to clear via clean rebuild. |
| Contradictory spec/graph/checklist/continuity source state | **Not repaired; reindexed as-is.** |
| Eval / benchmark history | **Permanently lost.** |
| `memory:learn` constitutional-rule provenance (deleted tables) | **Permanently lost.** |
| Drift & search-decision ledgers | **Permanently lost.** |
| Manifest-only checkpoint directories | Not a usable rollback snapshot. |

---

## 8. Cross-Cutting Patterns

1. **Prose-vs-derived-state gap** is the meta-pattern; it explains the dominant share of status drift. Nothing reconciles authored narrative against generated metadata.
2. **Partial-migration debt** — every drift dimension traces to a migration that ran partway and stopped; the tree is mid-transition on numbering (local↔global-offset schemes coexist) and, per the supplementary lineage, on naming (snake↔kebab).
3. **Intentional-vs-defect ambiguity** — a meaningful fraction of "drift" is deliberate (reconstruction drafts, reserved/sentinel names, alias-manifested historical paths). Triage must read `implementation-summary.md`, not just status fields.
4. **Teardown is a source-integrity no-op** — rebuild fixes derived residue but neither repairs contradictory sources nor restores deleted history/provenance.

---

## 9. Recommendations

| # | Recommendation | Rationale | Effort |
|---|---|---|---|
| R1 | Add a CI/probe gate diffing spec.md Status vs graph-metadata status, failing on semantic mismatch (whitelisting reconstruction-draft packets). | Mechanically eliminates the dominant drift class. | Low |
| R2 | Treat completion reconciliation as the primary **source-integrity** follow-up; do **not** frame teardown/rebuild as its fix. | Rebuild reindexes contradictions as-is. | Medium |
| R3 | Preserve the accepted deferral of `sk-doc` and `system-deep-loop` work rather than silently reopening high-blast renumbers; a future owner revives the preserved deep-loop map. | Respects operator skip decisions. | — |
| R4 | Open a small follow-up for the `system-speckit/040` packet-pointer target decision (do not guess during research). | Canonical ownership needs a real decision. | Low |
| R5 | Establish a phase-parent heavy-document grandfather/migration policy before touching the 15 heavy parents. | Protects canonical history from mechanical deletion. | Medium |
| R6 | In phase 007, record irreversible data classes and exclusion baselines **beside** the delete allowlist; require a fresh confirmation covering history/provenance loss, not only file removal. | Makes the irreversible cost explicit at the gate. | Low |
| R7 | Require future context-optimization claims to record measured baseline, post-change metric, observation window, and failure budget. | Closes the "benefit claims lack longitudinal evidence" gap. | Low |

---

## 10. Findings Triage (per parent REQ-006)

| Finding | Severity | Disposition | Reason / owner |
|---|---|---|---|
| Fleet-wide completion/continuity contradictions (212+19+60+164 …) | P1 | DEFER | Per-packet authority/provenance decisions; source drift survives rebuild → follow-on packet; R1 prevents recurrence. |
| sk-doc duplicate prefixes + archive overlap | P1 | DEFER | Operator-skipped; owned by the concurrent sk-doc migration. |
| deep-loop discontinuity + stale `children_ids` | P1 | DEFER | High-blast renumber selected then operator-skipped; preserved map revived by future owner. |
| Deleted packet-pointer target in system-speckit/040 | P1 | DEFER | Needs a canonical ownership-target decision (R4). |
| Fifteen heavy-doc phase parents | P2 | DEFER | Needs grandfather policy (R5). |
| ~152 stale rename-derived code-graph entries | P2 | REBUILD FOLLOW-UP | Derived residue suitable for the phase-007 rebuild path. |
| Stale sk-design track-root `children_ids` | P2 | DEFER / REGENERATE | Track-root metadata needs a supported regeneration path. |
| Optimization benefit claims lack longitudinal evidence | P2 | DEFER | Future packets record baseline/post-change (R7). |
| Context-optimization mechanism inventory | Info | PRESERVE IN SYNTHESIS | Captured here before any irreversible history deletion. |
| Phase-007 irreversible state classes | P0 gate | ACKNOWLEDGE BEFORE DELETE | Fresh confirmation must cover history/provenance loss. |
| Historical gaps / sentinels / archive maps / reconstruction banners | Info | ACCEPT | Provenance-backed; not defects by themselves. |

No source remediation was performed by this research packet (read-only lineages).

---

## 11. Eliminated Alternatives

| Approach ruled out | Reason | Lineage |
|---|---|---|
| Every `spec.md` is a live packet | Archive/backup/fixture/scratch inflate the count; needs a packet denominator | SOL, LUNA |
| A single status surface is universally authoritative | 212/19 spec↔graph conflicts + checklist/continuity disagreement | SOL, LUNA |
| Missing heavy documents automatically indicate drift | Lean-trio phase parents are by design | SOL |
| Every numbering gap / legacy name proves data loss or a broken ref | Alias manifest + migration log authority; gaps are intentional | LUNA, SOL |
| Raw corpus file counts = defect counts | Archive/fixture contamination | SOL, LUNA |
| Cross-track identical numbers are collisions | `{track}/{NNN}` path namespace disambiguates | (supplementary) |
| `/doctor:update` restores deleted history or repairs source drift | Rebuild reindexes contradictions; history is permanently lost | SOL |
| Manifest-only checkpoint directories provide teardown rollback | Not a usable rollback snapshot | SOL |
| Automatic narrative compaction shipped | Documented as deferred; no current summarizer/pruner exists | SOL |

---

## Divergence Map

- **Investigated frontier:** topology, status semantics, generated-metadata disagreement, documentation drift, evidence freshness, correction quality, context-optimization precedent, and teardown implications.
- **Pivots:** none required — under normal convergence SOL converged on coverage (novelty floor) and LUNA reached the iteration cap; no divergent pivot transaction was opened (forced-depth divergence is not wired for the research fan-out path — see spec EXECUTION DEVIATION).
- **Remaining frontier (breadth, not a convergence claim):** manifest-scoped prevalence of cross-surface disagreement; a full per-packet-family authority map; code-graph-backed relationship validation (blocked this run by an empty index).

---

## 12. Open Questions (deferred)

- Per-packet **"spec wrong vs graph stale"** determination for the ~231 genuine status conflicts — deferred to the parent's REQ-006 follow-on, not individually triaged here.
- Which generated surface is **authoritative** for each packet family (no shared precedence rule exists today).
- Current **prevalence** of cross-surface metadata disagreement under a manifest-scoped (non-contaminated) denominator.
- Whether the repo-wide kebab-case program will ship (converting naming debt into active violations) — forward uncertainty, out of scope.

---

## 13. Confidence Assessment

| Dimension | Confidence | Basis |
|---|---|---|
| Status/continuity mismatch counts | High | SOL mechanical full-tree diff, re-verified iterations 7–9. |
| Numbering scheme split | High | Per-track slug enumeration (SOL) + alias-manifest reads (LUNA). |
| Context-optimization taxonomy | High | Multiple corroborating packets + current-source verification. |
| Teardown rebuildable-vs-irreversible split | High | 007 spec/plan reads + current handler source. |
| Quantitative prevalence under a clean denominator | Medium | LUNA left this open by design; SOL denominator is a research count. |
| Provenance of GLM supplementary claims | Low | Route-proof-noncompliant lineage (see §Supplementary). |

---

## 14. Source Diversity

Sources span full-tree `graph-metadata.json` + `spec.md` Status rows (2,168 active candidates), targeted `implementation-summary.md` reads, migration summaries, current command inventories, and current TypeScript under `system-spec-kit/mcp_server/{handlers,lib/session,hooks/claude}`. High-impact claims were independently rechecked against current paths. No single weak source dominates; status labels and filename counts were explicitly treated as weak evidence.

---

## 15. Supplementary — GLM Lineage (unverified provenance)

> **Not part of the route-proof-compliant basis.** GLM (`glm-5.2`) produced substantive findings but its iteration records omit the workflow's mandatory route-proof provenance fields and delta files, so its claims are retained for breadth only and carry **Low** confidence unless independently corroborated by SOL/LUNA above. Archived at `research/_archived-lineages/glm/`.

GLM's distinct contributions that **corroborate** the compliant basis:
- **sk-design "complete" vs `draft` is intentional**, not a defect — reconstruction drafts held at `draft` by design while the work shipped; the exact class of prose-vs-derived-state mismatch that misleads a prose-reading gate (directly relevant to this packet's own launch gate).
- **Dual numbering scheme** taxonomy — local per-track counters vs global-offset ranges — matching SOL's clean-track observation.
- **Six recurring context-optimization mechanisms** with `024-compact-code-graph` as the compaction precedent and deprecation-driven pruning (`022-devin`/`021-gemini`) as the closest phase-007 analogue — the same precedent SOL verified against current source.
- Recommendation to give `z_archive` folders a terminal `archived` status (7/8 report `planned`) — a low-effort generator fix not independently confirmed by SOL/LUNA.

GLM claims **not** corroborated by a compliant lineage (treat as unverified): specific snake_case directory counts (~61 in 4 clusters) and the "~45 raw / ~23 semantic mismatch" figures — SOL's independent counts use a different denominator and do not reproduce these exact numbers.

---

## 16. Convergence Report

- **Synthesis basis:** 2 route-proof-compliant lineages (SOL, LUNA); GLM supplementary.
- **SOL:** stop reason `converged`; 9/10 iterations; 5/5 questions answered; novelty `1.00 → 0.02` (rolling avg 0.03 < threshold 0.05); quality guards PASS.
- **LUNA:** stop reason `maxIterationsReached`; 10/10 iterations; 3/5 quantitative questions answered (authority-map/prevalence left open by design); avg novelty 0.382.
- **GLM (supplementary):** `converged` at 5/10; route-proof-noncompliant → excluded from the gated merge.
- **Merge:** `fanout-merge.cjs --loop-type research` → `merged_lineages: 2`, `key_findings: 19`; consolidated registry at `research/deep-research-findings-registry.json`, attribution at `research/fanout-attribution.md`.
- **Graph gate:** not applicable — code-graph index empty (0 nodes); structural caller analysis unavailable, direct source reads used.

---

## 17. References

- `research/deep-research-findings-registry.json` (merged 19-finding registry) · `research/fanout-attribution.md`
- `research/lineages/sol/research.md` · `research/lineages/luna/research.md` · `research/_archived-lineages/glm/research.md` (supplementary)
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown/{spec.md,plan.md,implementation-summary.md}` (teardown gates + irreversible-state classes)
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/{001,002,003,004,005}-*/implementation-summary.md` (phase outcomes)
- `.opencode/specs/system-speckit/z_archive/024-compact-code-graph/**` (compaction precedent)
- `.opencode/specs/cli-external-orchestration/{022-cli-devin-deprecation,021-cli-gemini-deprecation}/**` (deprecation-driven pruning precedent)
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/**` · `029-memory-search-intelligence/**` (context-optimization + memory-search programs)
- `.opencode/specs/system-code-graph/029-code-graph-doc-audit/review-report.md` · `.opencode/specs/system-speckit/040-base-files-renumbering-name-cleanup/**` (ownership-pointer drift)
- Current implementation: `.opencode/skills/system-spec-kit/mcp_server/{handlers,lib/session,hooks/claude}/**`
- Per-lineage iteration evidence: `research/lineages/{sol,luna}/iterations/iteration-*.md`
