---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

## 1. OVERVIEW

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

---

## 2. TOPIC

Independently AUDIT whether related skill documentation (SKILL.md, references/, assets/) and README files (skill READMEs, code READMEs) across the repo describe now-stale behavior for the `/goal` OpenCode plugin, following the phases 010-014 remediation completed in this session plus the `goal_opencode.md` filename correction.

This review does NOT re-cite the companion 10-iteration deep-research pass (`research/research.md`, same packet) findings — it independently verifies each with a P0/P1/P2 verdict (confirm, downgrade, or refute with evidence), and actively hunts for anything that pass's reducer-stall (iterations 4-9 repeated ground, treated as incomplete not exhaustive) may have missed.

Companion research findings to audit (numbered per operator's prompt, cross-referenced to research.md sections):
1. `ENV_REFERENCE.md` omits `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (research §5, §11.1).
2. `references/hooks/goal_plugin.md` (already touched this session for the filename fix) is ALSO missing those 3 env vars plus `store_health`/`mutation=` output coverage (research §7, §11.2 — "standout finding").
3. `.opencode/plugins/README.md` is too thin to be the "plugin contract" the root `README.md` explicitly delegates to it (research §6, §11.3).
4. `system-skill-advisor/README.md:85` says live OpenCode-tool invocation is "under investigation," contradicting its own already-updated `feature_catalog` entry that says it's verified (research §6, §11.4).
5. Manual testing playbooks (system-skill-advisor + system-spec-kit, both `goal-opencode-plugin.md` files) don't validate the new `store_health`/`mutation` output fields (research §8, §11.6).
6. Lower-priority: phase 009's `handover.md`, phase 011's `tasks.md` (historical), phase 003's changelog, and an archived review README still reference the retired `goal.md` filename (research §11.8-9).

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — iteration 1 confirmed live command filename, built the doc inventory, and confirmed Finding #1 as P1 against `mk-goal.js` and `ENV_REFERENCE.md`.
- [x] D2 Security — iteration 2 confirmed sanitizer/redaction and output-field behavior against docs; no new security-relevant doc drift found.
- [ ] D3 Traceability — env-var/output-field documentation coverage across ALL doc classes (SKILL.md, references/, assets/, feature_catalog/, manual_testing_playbook/, constitutional/); sibling-doc consistency
- [ ] D4 Maintainability — doc structure quality, whether root README's plugin-contract delegation is sound, whether stale-filename references are annotated appropriately
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Modifying `.opencode/plugins/mk-goal.js` or any implementation code (review target is READ-ONLY).
- Re-litigating phase 009 (owned by a separate in-flight session).
- Re-implementing fixes — this is an audit producing a remediation plan for `/speckit:plan`, not an implementation pass.
- Simply re-citing the companion research's findings without independent verification — every claim gets its own evidence check.

---

## 5. STOP CONDITIONS

- Operator explicitly requires exactly 10 iterations (`maxIterations=10`, `antiConvergence.minIterations=10`, `stopPolicy="max-iterations"` in `deep-review-config.json`). Convergence signals are telemetry only until iteration 10 — do not stop early even if signal looks exhausted; instead rotate to an unexamined doc class (mirrors the companion research packet's anti-convergence directive).
- All required dimensions covered AND `feature_catalog/`, `manual_testing_playbook/`, `constitutional/`, and `assets/` directories across ALL skills swept (not just the ones the research pass touched) before any STOP is legal.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Confirmed `goal_opencode.md` as the only live command file and confirmed companion Finding #1 as P1: `ENV_REFERENCE.md` omits the three `MK_GOAL_STATE_*` cleanup/archive controls that `mk-goal.js` defines and consumes. |
| D2 Security | PASS | 2 | Confirmed `mk-goal` uses bounded pattern-based sanitization/redaction; checked goal-plugin references, env rows, feature catalogs, playbooks, README surfaces, and `store_health`/`mutation=` outputs. No P0/P1/P2 security doc drift was confirmed. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Iteration 1: Side-by-side source/doc verification worked for env-var coverage. Live glob confirmed `.opencode/commands/goal_opencode.md` as the only command-file match and absence of `.opencode/commands/goal.md` before carrying forward filename assumptions.
- Iteration 2: Source-first sanitizer review worked for security adjudication. Grep narrowed the goal-plugin security wording to the operator reference, env rows, feature catalogs, manual playbooks, hook-system note, README surfaces, and plugin inventory.

---

## 9. WHAT FAILED

- Iteration 1: Memory trigger lookup rejected the external review `sessionId` as not server-managed. The lookup was retried without session scope; the packet `sessionId` remains preserved in review JSONL only.

---

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 11. RULED OUT DIRECTIONS

- Iteration 1: `.opencode/commands/goal.md` is not live; glob returned no file. `.opencode/commands/goal_opencode.md` is the only `.opencode/commands/*goal*.md` match.
- Iteration 1: `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/README.md` were generic `goal` matches, not OpenCode goal-plugin documentation.
- Iteration 2: No in-scope doc overclaims `mk-goal` as encrypted, secure-storage-backed, fully sanitized, or full-PII-scrubbed.
- Iteration 2: No in-scope doc says unsanitized goal text is stored or injected; relevant docs describe sanitized objective/injection behavior.
- Iteration 2: `store_health` and `mutation=` do not leak raw goal text, absolute state paths, or PII by themselves; later traceability passes should still document them.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 3: traceability pass over companion Finding #2 against `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, central env rows, feature catalogs, and playbooks, specifically the three `MK_GOAL_STATE_*` env vars plus `store_health` and `/goal set` `mutation=` output coverage.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

**Companion research packet (`research/research.md`, same spec folder, 10 forced iterations, executor cli-opencode/openai-gpt-5.5-fast/high):**

Executive summary: `.opencode/commands/goal_opencode.md` confirmed live (`.opencode/commands/goal.md` does not exist). `mk-goal.js` is correctly wired for `usage_limited`, `store_health`, `mutation=`, and `MK_GOAL_STATE_*` cleanup/archive behavior, but documentation coverage is incomplete in several places NOT already updated this session, and notably one already-updated doc (`references/hooks/goal_plugin.md`) is itself still missing the 3 env vars + new output fields. No live doc claims `usage_limited` is dead or that goal-state is never cleaned up (both stale-claim classes fully resolved).

Confirmed facts from research (re-verify independently, do not merely re-cite):
- `mk-goal.js:30-42` defines `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` / `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` / `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (defaults 90d/30d/1h).
- `mk-goal.js:825-899`, `:1758-1761`, `:1824-1828` wire `archiveGoalStateFile()`, `pruneArchive()`, `sweepOrphanedActiveStates()` on session lifecycle events.
- `mk-goal.js:1354-1368` `recordProviderUsageLimit()` sets `status: 'usage_limited'`.
- `mk-goal.js:1602-1647`, `:1668-1675` emit `store_health=` and `/goal set`'s `mutation=<created|refreshed|replaced>`.

Research's own reducer stalled on repeated ground for iterations 4-9 (per operator's brief) — treat research coverage as incomplete, not exhaustive. Actively check `feature_catalog/`, `manual_testing_playbook/`, `constitutional/`, and `assets/` directories across ALL skills (not just `system-spec-kit` and `system-skill-advisor`, the two research happened to touch) for anything missed.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
 | `spec_code` | core | partial | 2 | Iteration 1 verified env definitions/consumers; iteration 2 verified sanitizer/redaction and output-field behavior against live `mk-goal.js`. |
 | `checklist_evidence` | core | not_applicable | 2 | Iteration 2 audited doc-vs-code security claims; no checklist-specific acceptance item was required. |
 | `skill_agent` | overlay | partial | 2 | Deep-review skill and review-core doctrine loaded for LEAF/severity contract. |
 | `agent_cross_runtime` | overlay | partial | 2 | Runtime-specific constitutional doc checked for OpenCode-vs-Claude routing; execution parity remains pending. |
 | `feature_catalog_code` | overlay | partial | 2 | Goal-plugin feature catalog entries in `system-skill-advisor` and `system-spec-kit` checked for sanitizer/output security claims. |
 | `playbook_capability` | overlay | partial | 2 | Goal-plugin playbooks in `system-skill-advisor` and `system-spec-kit` checked for sanitizer/output security claims. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/plugins/mk-goal.js` (source of truth) | security | 2 | no security finding | reviewed |
| `.opencode/commands/goal_opencode.md` | correctness | 1 | no finding | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | correctness | 1 | P1-001 | active finding |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | security | 2 | no security finding | reviewed |
| `.opencode/plugins/README.md` | security | 2 | no security finding | reviewed |
| `README.md` (root) | security | 2 | no security finding | reviewed |
| `.opencode/skills/system-skill-advisor/README.md` | | | | pending |
| `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md` | security | 2 | no security finding | reviewed |
| `.opencode/skills/system-spec-kit/feature_catalog/**/goal-opencode-plugin.md` | security | 2 | no security finding | reviewed |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/**/goal-opencode-plugin.md` | security | 2 | no security finding | reviewed |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/**/goal-opencode-plugin.md` | security | 2 | no security finding | reviewed |
| `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | security | 2 | no security finding | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md` | | | | pending |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | | | | pending |
| All other skills' `SKILL.md`/`references/`/`assets/` (negative sweep) | | | | pending |
| All skills' `feature_catalog/`/`manual_testing_playbook/`/`constitutional/` (repo-wide sweep) | | | | pending |
| Phase 009 `handover.md`, phase 011 `tasks.md`, phase 003 changelog, archived review README (stale-filename check) | | | | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10 (forced; `stopPolicy=max-iterations`, `antiConvergence.minIterations=10`)
- Convergence threshold: 0.10 (telemetry only until iteration 10)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rv-goal-docs-audit-032-20260701-161615, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Executor: cli-opencode, model openai/gpt-5.5-fast, reasoningEffort high
- Started: 2026-07-01T16:16:15.000Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.opencode/commands/goal_opencode.md` is the only live `.opencode/commands/*goal*.md` command file found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `.opencode/commands/goal_opencode.md` is the only live `.opencode/commands/*goal*.md` command file found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/commands/goal_opencode.md` is the only live `.opencode/commands/*goal*.md` command file found.

### `.opencode/commands/goal.md` is not a live command file; glob returned no files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `.opencode/commands/goal.md` is not a live command file; glob returned no files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/commands/goal.md` is not a live command file; glob returned no files.

### `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/README.md` matched generic `goal` wording, not the OpenCode goal plugin. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/README.md` matched generic `goal` wording, not the OpenCode goal plugin.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/README.md` matched generic `goal` wording, not the OpenCode goal plugin.

### `agent_cross_runtime`: not run this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: not run this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: not run this iteration.

### `agent_cross_runtime`: not run. The focus was the two named OpenCode playbooks. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime`: not run. The focus was the two named OpenCode playbooks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: not run. The focus was the two named OpenCode playbooks.

### `Both plugins support` wording: confirmed stale as a P3-equivalent wording issue. `.opencode/plugins/README.md:44-51` lists six entrypoints, including `mk-goal.js`, but `.opencode/plugins/README.md:71` says `Both plugins support` and the config section only covers `mk-skill-advisor` and `mk-code-graph`. This is not counted as a formal P0/P1/P2 finding in this iteration because it is subordinate to P1-003 and can be corrected while retargeting or clarifying the plugin contract pointer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `Both plugins support` wording: confirmed stale as a P3-equivalent wording issue. `.opencode/plugins/README.md:44-51` lists six entrypoints, including `mk-goal.js`, but `.opencode/plugins/README.md:71` says `Both plugins support` and the config section only covers `mk-skill-advisor` and `mk-code-graph`. This is not counted as a formal P0/P1/P2 finding in this iteration because it is subordinate to P1-003 and can be corrected while retargeting or clarifying the plugin contract pointer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `Both plugins support` wording: confirmed stale as a P3-equivalent wording issue. `.opencode/plugins/README.md:44-51` lists six entrypoints, including `mk-goal.js`, but `.opencode/plugins/README.md:71` says `Both plugins support` and the config section only covers `mk-skill-advisor` and `mk-code-graph`. This is not counted as a formal P0/P1/P2 finding in this iteration because it is subordinate to P1-003 and can be corrected while retargeting or clarifying the plugin contract pointer.

### `changelog_coverage`: partial. Phase implementation summaries disclose the new fields, but packet changelog entries stop at phase 008. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `changelog_coverage`: partial. Phase implementation summaries disclose the new fields, but packet changelog entries stop at phase 008.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `changelog_coverage`: partial. Phase implementation summaries disclose the new fields, but packet changelog entries stop at phase 008.

### `checklist_evidence`: not applicable. No checklist item was in scope for this batch iteration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: not applicable. No checklist item was in scope for this batch iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not applicable. No checklist item was in scope for this batch iteration.

### `checklist_evidence`: not applicable. This iteration audited review findings and documentation coverage, not acceptance checklist completion. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: not applicable. This iteration audited review findings and documentation coverage, not acceptance checklist completion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not applicable. This iteration audited review findings and documentation coverage, not acceptance checklist completion.

### `checklist_evidence`: not run this iteration - no checklist-specific evidence was requested in iteration 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: not run this iteration - no checklist-specific evidence was requested in iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not run this iteration - no checklist-specific evidence was requested in iteration 1.

### `config_manifest`: pass. `opencode.json` and JSON/JSONC/YAML searches did not find inline `mk-goal.js` env-var docs. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `config_manifest`: pass. `opencode.json` and JSON/JSONC/YAML searches did not find inline `mk-goal.js` env-var docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `config_manifest`: pass. `opencode.json` and JSON/JSONC/YAML searches did not find inline `mk-goal.js` env-var docs.

### `feature_catalog_code`: inventory-only - catalog files mentioning the goal plugin were enumerated for later iterations. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: inventory-only - catalog files mentioning the goal plugin were enumerated for later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: inventory-only - catalog files mentioning the goal plugin were enumerated for later iterations.

### `feature_catalog_code`: not rerun as a primary dimension because iteration 7 already covered feature catalogs; spot grep found only narrower `MK_GOAL_AUTONOMY` mentions, not another env table. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `feature_catalog_code`: not rerun as a primary dimension because iteration 7 already covered feature catalogs; spot grep found only narrower `MK_GOAL_AUTONOMY` mentions, not another env table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not rerun as a primary dimension because iteration 7 already covered feature catalogs; spot grep found only narrower `MK_GOAL_AUTONOMY` mentions, not another env table.

### `playbook_capability`: confirmed P2-002 remains open with no severity change. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `playbook_capability`: confirmed P2-002 remains open with no severity change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: confirmed P2-002 remains open with no severity change.

### `playbook_capability`: fail-advisory. Both playbooks can pass without explicitly exercising the new output surfaces. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: fail-advisory. Both playbooks can pass without explicitly exercising the new output surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail-advisory. Both playbooks can pass without explicitly exercising the new output surfaces.

### `playbook_capability`: inventory-only - playbook files mentioning the goal plugin were enumerated for later iterations. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: inventory-only - playbook files mentioning the goal plugin were enumerated for later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: inventory-only - playbook files mentioning the goal plugin were enumerated for later iterations.

### `skill_agent`: partial - loaded `.opencode/agents/deep-review.md` and confirmed LEAF/read-only iteration contract. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: partial - loaded `.opencode/agents/deep-review.md` and confirmed LEAF/read-only iteration contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial - loaded `.opencode/agents/deep-review.md` and confirmed LEAF/read-only iteration contract.

### `skill_agent`: pass. `deep-review` workflow and `sk-code-review` severity doctrine were loaded before severity calls. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `skill_agent`: pass. `deep-review` workflow and `sk-code-review` severity doctrine were loaded before severity calls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: pass. `deep-review` workflow and `sk-code-review` severity doctrine were loaded before severity calls.

### `skill_agent`: pass. Deep-review and review-core severity rules were loaded before severity assignment. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent`: pass. Deep-review and review-core severity rules were loaded before severity assignment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: pass. Deep-review and review-core severity rules were loaded before severity assignment.

### `spec_code`: partial - verified the companion research Finding #1 against live code and central env docs. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial - verified the companion research Finding #1 against live code and central env docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial - verified the companion research Finding #1 against live code and central env docs.

### `spec_code`: partial. This iteration relied on prior state that `mk-goal.js` emits `store_health=` and `mutation=`; it did not re-review implementation code because the assigned focus was playbook coverage. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: partial. This iteration relied on prior state that `mk-goal.js` emits `store_health=` and `mutation=`; it did not re-review implementation code because the assigned focus was playbook coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. This iteration relied on prior state that `mk-goal.js` emits `store_health=` and `mutation=`; it did not re-review implementation code because the assigned focus was playbook coverage.

### `spec_code`: pass for this iteration. Source env definitions and output fields were re-read directly against the docs under review. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: pass for this iteration. Source env definitions and output fields were re-read directly against the docs under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass for this iteration. Source env definitions and output fields were re-read directly against the docs under review.

### Additional docs/.env/CHANGELOG/README coverage: no new live stale surface found. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Additional docs/.env/CHANGELOG/README coverage: no new live stale surface found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Additional docs/.env/CHANGELOG/README coverage: no new live stale surface found.

### Alternative explanation considered: broad `/goal` search can match generic path-like wording such as `target/goal/hypothesis`; the only assets hit was classified as that false positive, not a plugin reference. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Alternative explanation considered: broad `/goal` search can match generic path-like wording such as `target/goal/hypothesis`; the only assets hit was classified as that false positive, not a plugin reference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Alternative explanation considered: broad `/goal` search can match generic path-like wording such as `target/goal/hypothesis`; the only assets hit was classified as that false positive, not a plugin reference.

### Assets directory coverage: newly checked; no goal-plugin asset entry found outside known surfaces. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Assets directory coverage: newly checked; no goal-plugin asset entry found outside known surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assets directory coverage: newly checked; no goal-plugin asset entry found outside known surfaces.

### Counterevidence sought: repo-wide path-scoped goal-plugin term searches across skill catalogs, playbooks, constitutional docs, assets, selected adjacent skill references, `.env.example`, `docs`, `CHANGELOG.md`, and README files. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Counterevidence sought: repo-wide path-scoped goal-plugin term searches across skill catalogs, playbooks, constitutional docs, assets, selected adjacent skill references, `.env.example`, `docs`, `CHANGELOG.md`, and README files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counterevidence sought: repo-wide path-scoped goal-plugin term searches across skill catalogs, playbooks, constitutional docs, assets, selected adjacent skill references, `.env.example`, `docs`, `CHANGELOG.md`, and README files.

### Existing P1-001: Not re-emitted. This iteration did not independently audit `ENV_REFERENCE.md`; it only encountered adjacent contract/documentation drift. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Existing P1-001: Not re-emitted. This iteration did not independently audit `ENV_REFERENCE.md`; it only encountered adjacent contract/documentation drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing P1-001: Not re-emitted. This iteration did not independently audit `ENV_REFERENCE.md`; it only encountered adjacent contract/documentation drift.

### Existing P1-002: Strengthened indirectly. The dedicated `goal_plugin.md` reference is the right root-pointer target, but prior P1-002 means it still needs env/output completion before it can be treated as fully authoritative. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Existing P1-002: Strengthened indirectly. The dedicated `goal_plugin.md` reference is the right root-pointer target, but prior P1-002 means it still needs env/output completion before it can be treated as fully authoritative.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing P1-002: Strengthened indirectly. The dedicated `goal_plugin.md` reference is the right root-pointer target, but prior P1-002 means it still needs env/output completion before it can be treated as fully authoritative.

### Output-field disclosure: `store_health` and `mutation=` do not leak raw goal text, absolute state paths, or PII by themselves. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Output-field disclosure: `store_health` and `mutation=` do not leak raw goal text, absolute state paths, or PII by themselves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Output-field disclosure: `store_health` and `mutation=` do not leak raw goal text, absolute state paths, or PII by themselves.

### Overclaim: no in-scope doc claims encryption, secure storage, full PII scrubbing, or complete sanitization for `mk-goal`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overclaim: no in-scope doc claims encryption, secure storage, full PII scrubbing, or complete sanitization for `mk-goal`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overclaim: no in-scope doc claims encryption, secure storage, full PII scrubbing, or complete sanitization for `mk-goal`.

### Related traceability gap: absence of `store_health`/`mutation=` documentation remains relevant for later traceability coverage, but this security pass found no inaccurate security characterization of those fields. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Related traceability gap: absence of `store_health`/`mutation=` documentation remains relevant for later traceability coverage, but this security pass found no inaccurate security characterization of those fields.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Related traceability gap: absence of `store_health`/`mutation=` documentation remains relevant for later traceability coverage, but this security pass found no inaccurate security characterization of those fields.

### Research §9 catalog/playbook/constitutional negative claim: confirmed. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Research §9 catalog/playbook/constitutional negative claim: confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Research §9 catalog/playbook/constitutional negative claim: confirmed.

### Research §9 targeted skill negative claim: confirmed for `deep-loop-workflows` and `cli-opencode` by direct spot-check. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Research §9 targeted skill negative claim: confirmed for `deep-loop-workflows` and `cli-opencode` by direct spot-check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Research §9 targeted skill negative claim: confirmed for `deep-loop-workflows` and `cli-opencode` by direct spot-check.

### Retired filename sanity check: no `goal.md` literal was found in the target `goal-opencode-plugin.md` playbooks during the quick negative sweep. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Retired filename sanity check: no `goal.md` literal was found in the target `goal-opencode-plugin.md` playbooks during the quick negative sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retired filename sanity check: no `goal.md` literal was found in the target `goal-opencode-plugin.md` playbooks during the quick negative sweep.

### Underclaim with security impact: no in-scope doc says unsanitized goal text is stored or injected. The docs that discuss this boundary describe sanitized objective/injection behavior. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Underclaim with security impact: no in-scope doc says unsanitized goal text is stored or injected. The docs that discuss this boundary describe sanitized objective/injection behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Underclaim with security impact: no in-scope doc says unsanitized goal text is stored or injected. The docs that discuss this boundary describe sanitized objective/injection behavior.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
