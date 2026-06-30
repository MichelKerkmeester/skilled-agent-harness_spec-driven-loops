# Deep Review Report — sk-design-motion

- **Target:** `.opencode/skills/sk-design-motion` (skill, v1.0.0.0)
- **Session / lineage:** `skreview-sk-design-motion-opus48` (executor: cli-claude-code, claude-opus-4-8)
- **Stop reason:** converged (3 of 5 iterations) · **Dimensions:** 4/4 covered
- **Severity counts:** P0 = 0 · P1 = 1 · P2 = 6
- **Verdict:** CONDITIONAL · **Release-readiness state:** converged

---

## 1. Executive Summary

`sk-design-motion` is a well-scoped, internally coherent v1.0.0 knowledge skill: the temporal layer of
the `sk-design` family. Its substance is strong — purpose-first motion budget, a clean 100/300/500
timing model, correct ease-out-enter / ease-in-exit choreography, a technically accurate AnimatePresence
example, sound performance/compositor guidance, and complete reduced-motion coverage. Family wiring is
clean: the parent router resolves MOTION here `[sk-design/SKILL.md:91,144]`, graph edges are
bidirectional, the audit sibling delegates motion repair back here without restating (and thus without
conflicting on) any numeric thresholds, and every internal link and parent shared-base reference
resolves on disk. Version `1.0.0.0` is uniform across SKILL, changelog, graph-metadata, and all
reference frontmatter.

The review surfaces **no P0** (the skill is read-only markdown with no executed code or trust surface)
and **one P1**: the documented Smart Router pseudocode has a motion-specific logic defect on its own
default/most-common intent (STRATEGY), where it returns a false "no keyed knowledge base" notice even
though the correct reference loaded. The remaining six findings are P2 maintainability, traceability,
content-consistency, and coverage gaps. Because the P1 is in the load-bearing routing *contract* (even
if illustrative), the verdict is **CONDITIONAL** with a short, low-risk remediation plan.

---

## 2. Planning Trigger

A follow-up planning packet is warranted but small. The P1 (F1) plus the two highest-value P2s (F3
changelog provenance, F4 playbook coverage) form a single tight remediation pass on documentation and
the router default. No architectural change, no code execution path, no security work. Recommend a
Level 1–2 fix packet under the `154-sk-design-parent` family (sibling to `007-family-deep-review`),
scoped to SKILL.md routing + changelog + one new playbook scenario.

---

## 3. Active Finding Registry

| ID | Sev | Class | Location | One-line |
| --- | --- | --- | --- | --- |
| **F1** | **P1** | router-default-collision | `SKILL.md:106,116,218` | `DEFAULT_RESOURCE == RESOURCE_MAP["STRATEGY"]` → STRATEGY intent returns false "no keyed knowledge base" notice despite loading the right file. Motion-specific. |
| F2 | P2 | dead-routing-branch | `SKILL.md:181-184,213-216` | `keyed_refs`/`keyed_assets` target `references/{key}/` and `assets/` which never exist (flat layout); always-empty dead branch. |
| F3 | P2 | changelog-corpus-undercount | `changelog/v1.0.0.0.md:21` | Changelog lists 6 corpus sources; `corpus_map.md` lists 8 (omits `fixing-motion-performance.md`, `make-interfaces-feel-better.md`). |
| F4 | P2 | playbook-capability-gap | `manual_testing_playbook.md:13-17` | No playbook scenario for the micro-interactions capability (feedback/active-state/delight/morphing-icons). |
| F5 | P2 | timing-self-contradiction | `references/motion_strategy.md:50,54,55` | "sub-80ms for micro-interactions" contradicts the 100-150ms fastest tier and the 100/300/500 rule. |
| F6 | P2 | tool-surface-overgrant | `SKILL.md:4` | `allowed-tools` grants `Task` (sub-agent dispatch) to a read-only handoff skill; interface sibling omits it. |

### F1 detail (P1)

`DEFAULT_RESOURCE = "references/motion_strategy.md"` `[SKILL.md:106]` is the **same file** as
`RESOURCE_MAP["STRATEGY"] = ["references/motion_strategy.md"]` `[SKILL.md:116]`. Execution trace for a
STRATEGY prompt (e.g. "set the animation timing and easing"): the baseline loads `corpus_map.md` +
`motion_strategy.md` (`baseline_count = 2`) `[SKILL.md:195-197]`; the intent loop re-targets
`motion_strategy.md`, already in `seen`, so nothing is appended `[SKILL.md:209-211]`; `keyed_refs` is
empty because `references/strategy/` does not exist `[SKILL.md:213]`; the final guard
`len(loaded) == baseline_count and not keyed_refs` is therefore TRUE and the router returns
`"No keyed knowledge base found for routing key 'strategy'"` `[SKILL.md:218-225]`. STRATEGY is also the
weak-signal fallback primary `[SKILL.md:168-169]`, so the skill's default temporal concern is the one
that self-reports as unmapped. **Sibling proof of motion-specificity:** `sk-design-foundations` runs the
same template but sets `DEFAULT_RESOURCE = references/corpus_map.md`
`[sk-design-foundations/SKILL.md:94]` — not an intent resource — so its baseline never collides and the
notice never fires. Adversarial replay: survived three refutation attempts (see `iterations/iteration-001.md`).

---

## 4. Remediation Workstreams

**WS-1 — Router default fix (resolves F1; touches F2).** In `SKILL.md` §2, set
`DEFAULT_RESOURCE = "references/corpus_map.md"` to mirror the foundations sibling so the default file is
never an intent resource; OR add a guard so the no-KB notice is suppressed when the loaded set already
contains the routed intent resource. While in the same block, delete or comment the dead
`keyed_refs`/`keyed_assets`/`asset_prefix` collection and drop `assets/` from `RESOURCE_BASES` unless an
`assets/` tree is planned (F2). Effort: ~1 edit block. Risk: low (pseudocode/doc only).

**WS-2 — Provenance + content reconciliation (resolves F3, F5).** Add
`external/fixing-motion-performance.md` and `external/make-interfaces-feel-better.md` to the changelog
"Corpus Distilled" line so it matches `corpus_map.md:43-44` (F3). Reconcile the sub-80ms vs 100-150ms
timing guidance in `motion_strategy.md` — either lower the micro tier or scope the sub-80ms claim to a
named subset distinct from the press/hover tier (F5). Effort: 2 small edits. Risk: none.

**WS-3 — Playbook coverage (resolves F4).** Add `MOTION-MICRO-001` exercising
`references/micro_interactions.md`: press-scale range (0.95-1.0 / commonly 0.96), the required
active/pressed state, morphing-icon three-line rule, and delight boundaries. Update the playbook index
table. Effort: 1 new scenario file. Risk: none.

**WS-4 — Least-privilege (resolves F6, optional).** Either document a concrete `Task` use for this
skill or narrow `allowed-tools` to `[Read, Grep, Glob]`. Effort: 1 frontmatter edit (or a one-line
justification). Risk: none.

---

## 5. Spec Seed

> **Title:** sk-design-motion v1.0.1 — router default fix + traceability/coverage closeout
> **Problem:** The documented Smart Router returns a false "no keyed knowledge base" result on the
> STRATEGY default path (motion-specific `DEFAULT_RESOURCE`/`RESOURCE_MAP` collision); release notes
> under-count the distilled corpus; the micro-interactions capability is untested by the playbook; and
> the fastest timing tier contradicts the sub-80ms prose.
> **In scope:** `SKILL.md` (router default + dead branch + optional allowed-tools), `changelog/`,
> `references/motion_strategy.md`, one new `manual_testing_playbook` scenario.
> **Out of scope:** motion guidance substance (verified sound), family routing/edges (verified clean),
> any executable code (none exists).
> **Acceptance:** STRATEGY-intent routing returns the loaded references with no false notice; changelog
> corpus list == `corpus_map.md` §2; playbook has a micro-interactions scenario; timing guidance is
> internally consistent.

---

## 6. Plan Seed

1. WS-1 router default + dead-branch edit in `SKILL.md` §2; re-trace STRATEGY/MICRO/PRESENCE/PERFORMANCE
   intents against the pseudocode to confirm each returns its resource set with no notice.
2. WS-2 changelog + `motion_strategy.md` timing reconciliation.
3. WS-3 author `MOTION-MICRO-001`; update playbook index.
4. WS-4 (optional) allowed-tools narrowing or justification.
5. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <fix-spec-folder> --strict`;
   confirm `skill_advisor.py "motion design animation" --threshold 0.8` still surfaces the skill.
6. Bump SKILL/changelog/graph-metadata/reference versions together (current uniform `1.0.0.0`).

---

## 7. Traceability Status

| Protocol | Result | Evidence |
| --- | --- | --- |
| `spec_code` (core) | PASS w/ 1 gap | SKILL claims ↔ references consistent; corpus_map↔changelog drift (F3). |
| `checklist_evidence` (core) | N/A → playbook | No `checklist.md`; skill uses `manual_testing_playbook/` (1 capability gap, F4). |
| `skill_agent` (overlay) | PASS | Parent router `[sk-design/SKILL.md:91,144]`, graph edges, audit delegation all coherent; no conflicting cross-skill thresholds. |
| `feature_catalog_code` (overlay) | PASS | All 3 capabilities map to existing reference files; no orphans `[feature_catalog/*]`. |
| `playbook_capability` (overlay) | PASS w/ 1 gap | strategy/presence/reduced-motion scenarios map to references; micro-interactions uncovered (F4). |
| Link integrity | PASS | All 5 core-ref links + parent shared-base + smart-router link resolve on disk. |
| Version consistency | PASS | `1.0.0.0` uniform across SKILL, changelog, graph-metadata, references. |
| Corpus existence | PASS | All 8 `corpus_map.md` sources exist under `154-sk-design-parent/external/`. |

**Observation (non-finding):** `metadata.family: sk-design` (SKILL) vs `"family":"sk-code"`
(graph-metadata) is consistent across all design siblings — intentional super-family/sub-family
convention, no action.

---

## 8. Deferred Items

- **F6 (Task tool surface)** — deferred to WS-4 / next family-wide skill-frontmatter pass; low value
  in isolation and entangled with a family-wide convention (foundations/audit/parent also grant `Task`).
- **Dead keyed-subdir/`assets/` router branch (F2)** — bundled into WS-1 but acceptable to defer as a
  family-wide router-template cleanup since the pattern is shared boilerplate across siblings.
- **No security workstream** — the target has no executed code, input parsing, credential, path, or
  persistence surface. Security dimension recorded covered-by-exclusion.

---

## 9. Audit Appendix

- **Method:** 3 fresh-context iterations (correctness → spec-alignment/traceability →
  completeness), read-only, P0/P1/P2 with `[SOURCE: file:line]` evidence and adversarial replay on the
  P1. Converged at iter 3 (4/4 dimensions, applicable overlays executed, newFindingsRatio 0.20 with no
  new finding classes, single P1 stabilized in iter 1).
- **Artifacts:** `deep-review-config.json`, `deep-review-strategy.md`, `deep-review-state.jsonl`,
  `deltas/iter-001-003.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`,
  `iterations/iteration-00{1,2,3}.md`, this report.
- **Resource Map Coverage Gate:** SKIPPED — `resource-map.md` not present in the target spec context
  (`resource_map_present: false`); section omitted per contract.
- **Tool-call budget:** iter1 = 9, iter2 = 8, iter3 = 7 (all within the 8–12 target).
- **Scope honored:** target tree and all repository files treated READ-ONLY; every output written only
  to the artifact_dir override.

---

## Verdict

One P1 (F1, confirmed after adversarial self-check) and no P0 → remediation plan included.

Review verdict: CONDITIONAL
