# Iteration 004 — Parent routing before/after narrative

## Focus

Audit the parent `routing-before-after.md` against the live routing tree and the current parent `spec.md` / `context-index.md`, focusing on stale names or paths, obsolete counts, inaccurate before/after claims, broken cross-references, and misleading resume guidance.

## Route Proof

- `mode`: `research`
- `target_agent`: `deep-research`
- `agent_definition_loaded`: `true`
- `resolved_route`: `Resolved route: mode=research target_agent=deep-research`
- `executor`: `{"kind":"cli-codex","model":"gpt-5.6-sol","reasoningEffort":"medium","serviceTier":"fast"}`

## Actions Taken

1. Read the lineage config, append-only state log, and strategy before investigating.
2. Compared every architecture, path, count, and next-step claim in `routing-before-after.md` with the current parent purpose/map and provenance synthesis.
3. Enumerated the live hub/config/manifest surfaces and checked each path named in the document.
4. Compared the document's mutation and live-mode future tense with the current verification and runtime-activation surfaces under phase `020`.
5. Kept frozen research, benchmark, lineage, output, log, and run-record artifacts out of the audit.

## Findings

### Important / P1 — The “After” architecture omits the live compiled-routing serving layer

The document presents routing as Advisor → Hub → Surface and then explains the live parent-hub path as `SKILL.md` plus `hub-router.json`, with the JSON and prose surface routers forming the complete after-state. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:23] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:45] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:117]

That no longer describes the operational tree. The parent now explicitly includes the promoted compiled-routing runtime in Group E. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:68] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:83] The live hub `SKILL.md` files route through the compiled front door by default and retain legacy routing as the kill-switch fallback; this is present on `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, and `system-deep-loop`. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:45] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:48] [SOURCE: .opencode/skills/sk-code/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-doc/SKILL.md:54] [SOURCE: .opencode/skills/sk-prompt/SKILL.md:40] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:44]

Impact: a reader using this “After” document to understand or debug current routing will inspect only the legacy fallback artifacts and miss the serving authority, compiled policy, resolver/front door, and fleet kill-switch that now decide the primary path. The document needs either a dated historical-snapshot banner or a current architecture section that places compiled routing ahead of the legacy fallback.

### Important / P1 — The document gives stale next-step and resume guidance

The benchmark section says the “current step” is mutation testing plus a live-mode reality check, then says the next step is to shake the test to prove its green has teeth. The scope note repeats that live-mode quality “is being verified separately.” [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:158] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:161] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:182]

Those steps have already run. The current verification reports 91/91 gold-corruption teeth, 6/6 router-corruption verdict drops, and a 4-of-6-hub live sample with 12/12 correct modes. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:28] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:32] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:68] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:80]

The remaining work is narrower and explicitly enumerated: blind holdout gold, full-corpus live mode, Layer-0 advisor coverage, machine confusion matrices, the sk-code over-loading limitation, and broader router-fidelity branches. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:92] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:102]

Impact: resuming from this supporting document repeats completed verification instead of following the current gap list. Replace the future-tense guidance with results plus a pointer to the verification report and the active Group E handoff.

### Important / P1 — Both Layer-2 router references use a removed underscore path

The document twice names `shared/references/smart_routing.md`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:84] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:129]

The live hubs use the hyphenated `shared/references/smart-routing.md`; for example, that canonical path is encoded in current hub router defaults. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:13] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:20] No `smart_routing.md` exists in the live skill tree.

Impact: both explanatory cross-references are broken and preserve exactly the kebab/underscore migration drift this parent audit is meant to catch. Change both occurrences to `shared/references/smart-routing.md`.

### Moderate / P2 — Snapshot metrics conflate different validation scopes

The snapshot and benchmark table pair “7/7 PASS” with “91 scenarios green/matched” without a date, corpus, or gate-applicability qualifier. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:17] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:152]

The current teeth report distinguishes 106 total scenarios from 91 route-gold-applicable scenarios and reports that verification over six hubs, not seven. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:41] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:47] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:55]

The earlier 7/7 fleet gate and the later 6-hub teeth exercise can both be valid, but the current wording makes them look like one homogeneous measurement. Label the snapshot date/baseline and state that 91 is the gold-applicable subset; otherwise a reader can infer that every current scenario across all seven live hubs was covered.

## Confirmed Invariants

- No old parent name or any of the eight surgically renamed child names remains in `routing-before-after.md`.
- The companion `routing-config-and-advisor-reference.md` named by the final “See also” exists at the same parent level; that particular pointer is valid. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:184]
- The current routing surface still has seven hub routers, eleven `leaf-manifest.json` units, and four registry-less normal configs, so the document's eleven-unit typed-surface count remains consistent with the live inventory. The ambiguity is metric scope, not manifest count.
- The normal-skill `system-spec-kit/leaf-manifest.config.json` example remains structurally faithful to the live config (`workflowMode`, `leafRoots`, `excludeIndexFiles`, `resourceContractVersion`). [SOURCE: .opencode/skills/system-spec-kit/leaf-manifest.config.json:2] [SOURCE: .opencode/skills/system-spec-kit/leaf-manifest.config.json:6]

## Questions Answered

- Are stale old parent/child names present? No.
- Are any current paths broken? Yes: both `smart_routing.md` references are stale; the companion reference pointer is valid.
- Are before/after claims current enough to guide a resume? No. The document omits the compiled serving layer and points to already-completed verification work.
- Are the headline counts wholly obsolete? The eleven-unit manifest count is current. The 91-scenario / 7-hub snapshot is insufficiently scoped and now conflicts with the later six-hub, 106-total/91-applicable verification vocabulary.

## Ruled-Out Attempts

- Treating the document's eleven-unit typed-surface count as stale was ruled out by the live inventory: eleven top-level `leaf-manifest.json` files remain.
- Treating `routing-config-and-advisor-reference.md` as a broken final pointer was ruled out because the sibling file exists.
- Treating “create-skill canon aligned” as proof that all ten original packets pass was rejected as an over-read. The phrase can refer to the canon/template itself; the current parent synthesis separately records nine of ten packets passing. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md:65]
- Frozen benchmark and research outputs were not used as rename-drift targets.

## Sources Consulted

- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/spec.md`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/context-index.md`
- Live hub `SKILL.md`, `hub-router.json`, and manifest/config inventories under `.opencode/skills/`
- Current Group E verification and runtime-activation documentation outside frozen artifact directories

## Assessment

`newInfoRatio: 0.78` — the pass found three concrete parent-reference defects with direct operational impact (missing compiled serving architecture, stale resume guidance, and a broken renamed path), plus a narrower metric-scope ambiguity; it also ruled out stale old packet names, a broken companion link, and manifest-count drift.

Confidence is high for the path and future-tense findings because they have direct file/tree contradictions. Confidence is medium-high for the metric finding: both reported measurements may be historically valid, but the document does not distinguish their corpora and dates.

## Reflection

Checking every literal path before interpreting prose exposed the rename defect quickly. Comparing future-tense language against the current phase-020 verification surface separated a historical snapshot from actionable resume guidance. Raw count comparison alone was insufficient because “91” names a gate-applicable subset while “106” names the total corpus.

## Recommended Next Focus

Audit `routing-config-and-advisor-reference.md` for the same missing compiled-serving layer, stale `smart_routing.md` spelling, obsolete default-mode claims, and future-tense verification pointers, while treating overlap with this iteration as confirmation rather than new novelty.
