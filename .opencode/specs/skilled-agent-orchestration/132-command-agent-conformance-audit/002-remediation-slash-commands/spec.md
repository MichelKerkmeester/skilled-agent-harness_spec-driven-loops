---
title: "Feature Specification: Phase 2: Remediate Slash Commands & Assets"
description: "12 confirmed conformance findings (4 P0, 3 P1, 5 P2) from the 001 deep-research packet mis-route or dead-link the command surface under .opencode/commands/{create,deep,design,speckit}/** and the root agent_router.md: retired-agent references, a nonexistent-path typo, dead slash-command referrals, and a hardcoded Barter-workspace router. This phase applies the exact file:line fixes 001 confirmed on disk."
trigger_phrases:
  - "remediate slash commands"
  - "fix command md yaml presentation"
  - "design dead command reference"
  - "command asset alignment fix"
  - "002-remediation-slash-commands"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/002-remediation-slash-commands"
    last_updated_at: "2026-07-11T04:44:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fixed 11/12 findings (CMD-01..04,06-11,XS-02); XS-04 deferred w/ design note"
    next_safe_action: "006 closeout: recompile deep contracts (CMD-05), then skill-graph (XS-01/XS-03)"
    blockers:
      - "CMD-05 contract recompile is owned by phase 006 closeout (do not action here)"
      - "XS-01/XS-03 skill-graph fixes are owned by phase 006 closeout (do not action here)"
    key_files:
      - ".opencode/commands/speckit/assets/speckit_plan_auto.yaml"
      - ".opencode/commands/create/assets/create_agent_auto.yaml"
      - ".opencode/commands/create/assets/create_agent_confirm.yaml"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/create/assets/create_readme_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_research_presentation.txt"
      - ".opencode/commands/deep/assets/deep_review_presentation.txt"
      - ".opencode/commands/design/interface.md"
      - ".opencode/commands/agent_router.md"
      - ".opencode/commands/deep/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions:
      - "XS-04 checker: neither — deferred. compile-command-contracts.cjs only covers the deep/* family and is coupled to the CMD-05 recompile pipeline (006's job); no clean extension point exists spanning create/deep/design. See implementation-summary.md design note."
      - "CMD-07: the one-line rewrite (plus an explicit 'nested mode, not an independently dispatchable /design:* command' clarifier) was judged sufficient; no additional cross-link to the sk-design command entry point was added."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 2: Remediate Slash Commands & Assets

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-conformance-deep-research |
| **Successor** | 003-remediation-doctor |
| **Handoff Criteria** | All 12 findings (CMD-01,02,03,04,06,07,08,09,10,11; XS-02,04) fixed and grep-verified; every touched command re-renders clean at `:auto` and `:confirm`; `validate.sh --strict` passes on this packet; CMD-05/XS-01/XS-03 handed to 006 unactioned. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Command, agent, and asset conformance audit against current skill reality specification.

**Scope Boundary**: Only the slash-command surface and its assets — `.opencode/commands/{create,deep,design,speckit}/**` plus the root `agent_router.md` — scoped to the 12 findings assigned to this phase by 001's Remediation Routing table (§6): CMD-01, CMD-02, CMD-03, CMD-04 (P0); CMD-06, CMD-07 (P1); CMD-08, CMD-09, CMD-10, CMD-11 (P2); XS-02 (root command); XS-04 (command-validation tooling). SCOPE LOCK: no opportunistic "cleanup" of commands or lines the findings do not flag. `goal_opencode.md` and `prompt-improve.md` are in the parent's file-family list but carry no findings in this phase — not touched.

**Dependencies**:
- Phase 1 (`001-conformance-deep-research`) — `research/research.md` §3.1 (Commands) and §3.4 (Cross-Surface) are the sole source of the 12 findings fixed here; every citation below was re-verified against the current working tree on 2026-07-11 (see Risks §6 for two citations where the on-disk line number had drifted from the research.md citation).
- Current skill reality: `sk-design/mode-registry.json` (CMD-07 target), `.opencode/skills/cli-external/cli-opencode/SKILL.md` (CMD-08 target).

**Deliverables**:
- 4 P0 mechanical fixes closing the systemic S1 (typo propagation) and S3 (retired-agent-reference) defect classes across 12 files.
- 3 P1 fixes: deep executor-selector text repair (source only), dead `/design:design-mcp-open-design` referral removed from 5 commands, root `agent_router.md` de-coupled from the "Barter" workspace.
- 5 P2 fixes: `cli-opencode` skill-identity wording, dead `folder_readme.md` router reference, under-declared `/deep` argument-hints, a nonexistent `.agents/` runtime directory, and a new referential-integrity checker (XS-04).
- Every touched command re-rendered clean at `:auto` and `:confirm`.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 001 deep-research packet (15 iterations, 3 model batches) confirmed 12 command-surface defects still present on disk as of 2026-07-10: a copy-pasted singular-path typo (`CMD-02`) breaks 10 create-family YAMLs' agent-path resolution; the speckit family interpolates a `[runtime_agent_path]` token with zero resolution definition anywhere in the repo (`CMD-01`); the create family still targets two agents retired in commit `dde19822df` (`speckit.md` in `CMD-03`, `write.md` in `CMD-04`); five `/design` commands advertise a nonexistent slash command (`CMD-07`); and the root `agent_router.md` hardcodes ancestor-directory detection for an unrelated "Barter" workspace (`XS-02`). Five further P2 defects (`CMD-06`, `CMD-08`, `CMD-09`, `CMD-10`, `CMD-11`) and a tooling gap (`XS-04`) round out this phase's 12-finding scope.

### Purpose
Apply the exact, file:line-cited fixes from `research/research.md` §3.1/§3.4 so every command.md, its `_auto`/`_confirm` workflow YAML, and its presentation `.txt` in the `create`/`deep`/`design`/`speckit` families — plus the root `agent_router.md` — resolve to a real skill dir, agent file, mode-registry entry, or workspace-agnostic router logic, without opportunistic scope expansion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- CMD-01 (P0): add the missing `runtime_agent_path_resolution:` block (plural `.opencode/agents`) to 6 speckit workflow YAMLs.
- CMD-02 (P0): fix the singular `.opencode/agent` typo to plural `.opencode/agents` in 10 create-family YAMLs.
- CMD-03 (P0): remove the retired-`speckit.md` `agent_availability` block and rename `created_via_speckit` output keys in 2 create-agent YAMLs.
- CMD-04 (P0): repoint 6 retired-`write.md` `agent_file` sites to `markdown.md` across 4 create-family YAMLs.
- CMD-06 (P1): repair the duplicated `cli-opencode` executor enum + malformed exec text in 3 deep presentation `.txt` files (source only — no contract recompile).
- CMD-07 (P1): remove the dead `/design:design-mcp-open-design` slash referral from 5 design commands.
- XS-02 (P1): de-couple root `agent_router.md` from the hardcoded "Barter" workspace and replace non-current tool grants.
- CMD-08 (P2): reword the "cli-opencode skill" framing to the correct `cli-external/cli-opencode` mode identity at 5 sites.
- CMD-09 (P2): replace the dead `folder_readme.md` router reference and rename the `create_agent_verified` field residue.
- CMD-10 (P2): expand `argument-hint` in 3 `/deep` commands to cover every flag their presentation `.txt` parses.
- CMD-11 (P2): remove the nonexistent `.agents/` runtime directory from 2 deep-review YAMLs.
- XS-04 (P2): design and add a referential-integrity checker for command-contract validation tooling.

### Out of Scope
- CMD-05 (compiled deep contract recompile) — owned by phase 006 closeout, which runs AFTER all deep source edits (including this phase's CMD-06) land. **Do not recompile `deep/assets/compiled/*.contract.md` in this phase.**
- XS-01 (skill-graph ghost nodes/zombie) and XS-03 (null hub timestamps) — cross-surface build-artifact regeneration, owned by phase 006.
- The `/doctor` command family and `_routes.yaml` — owned by Phase 3 (`003-remediation-doctor`).
- The agent surface (`.claude/agents`, `.opencode/agents`) — owned by Phase 4 (`004-remediation-agents`).
- Repo READMEs and authored enumerations — owned by Phase 5 (`005-readme-alignment`); CMD-09's remediation sequences with that phase but is fixed here since it lives in command YAML/presentation, not a README.
- Any command or line NOT flagged by a confirmed 001 finding — SCOPE LOCK forbids opportunistic edits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `speckit/assets/speckit_complete_auto.yaml:357,363,387`; `speckit_complete_confirm.yaml:330,336,360`; `speckit_implement_auto.yaml:252,267`; `speckit_implement_confirm.yaml:216,231`; `speckit_plan_auto.yaml:297`; `speckit_plan_confirm.yaml:303` | Modify | CMD-01 (P0): add a `runtime_agent_path_resolution: { default: .opencode/agents, claude: .claude/agents }` block (corrected **plural** form) to the top of all 6 files; 12 `[runtime_agent_path]` interpolation sites currently dangle with zero resolution definition anywhere in the repo. |
| `create/assets/create_agent_auto.yaml:45`, `create_agent_confirm.yaml:46`, `create_skill_auto.yaml:48`, `create_skill_confirm.yaml:48`, `create_readme_auto.yaml:83`, `create_readme_confirm.yaml:78`, `create_changelog_auto.yaml:44`, `create_feature_catalog_confirm.yaml:45`, `create_manual_testing_playbook_auto.yaml:45`, `create_manual_testing_playbook_confirm.yaml:45` | Modify | CMD-02 (P0): `default: .opencode/agent` (singular, nonexistent) -> `default: .opencode/agents` (plural, real). **Must land before the CMD-03 row** — shared `runtime_agent_path_resolution` block in `create_agent_{auto,confirm}.yaml` has 3 live consumers that must not be removed. |
| `create/assets/create_agent_auto.yaml:301,311-312`, `create_agent_confirm.yaml:334,344-345` | Modify | CMD-03 (P0): remove the `agent_availability` block targeting retired `speckit.md` (matching sibling `create_command_auto.yaml:287-300`); rename `created_via_speckit` output keys to `created_or_updated`. Depends on CMD-02 landing first (same 2 files). |
| `create/assets/create_readme_confirm.yaml:587,1131`, `create_readme_auto.yaml:603,1055`, `create_agent_confirm.yaml:595`, `create_agent_auto.yaml:523` | Modify | CMD-04 (P0): 6 `agent_file: "[runtime_agent_path]/write.md"` sites -> `/markdown.md`; `write.md` was retired in the same commit as `speckit.md` but never remediated here, and `markdown.md` exists in both runtime inventories. |
| `deep/assets/deep_research_presentation.txt` (current disk lines 39,94,157; research.md cited 91,133,151-155), `deep_review_presentation.txt` (current disk lines 43,119,196; research.md cited 116,160,190-194), `deep_ai-council_presentation.txt:41,105,143-147` (not drifted) | Modify | CMD-06 (P1): normalize the duplicated `native \| cli-opencode \| cli-claude-code \| cli-opencode` executor enum and repair the malformed `` ` exec` `` Q-Exec label. Source `.txt` only — `deep/assets/compiled/*.contract.md` regen is 006's job (see plan.md Dependencies). |
| `design/interface.md:52`, `foundations.md:39`, `motion.md:39`, `audit.md:39`, `md-generator.md:39` | Modify | CMD-07 (P1): replace the dead `/design:design-mcp-open-design` slash referral with routing language that loads `sk-design` (whose nested `design-mcp-open-design` transport mode handles the request), not an independently dispatchable `/design:*` command. |
| `agent_router.md:93-98` (workspace detection), frontmatter `allowed-tools` line 4 | Modify | XS-02 (P1): remove/generalize the hardcoded "Barter" workspace + `z — Global (Shared)/` ancestor-detection logic to project-agnostic ancestor detection; replace `WebSearch`/`AskUserQuestion` frontmatter grants with current supported OpenCode tool names. |
| `deep/assets/deep_research_auto.yaml` (current disk line 1217; research.md cited 1016), `deep_research_confirm.yaml` (current disk line 1037; research.md cited 765), `deep_review_auto.yaml` (current disk line 1283; research.md cited 1073), `deep_review_confirm.yaml` (current disk line 1111; research.md cited 840) | Modify | CMD-08 (P2): reword "The cli-opencode skill SKILL.md §SELF-INVOCATION PROHIBITED contract" to "the `cli-external/cli-opencode` mode's SKILL.md (`.opencode/skills/cli-external/cli-opencode/SKILL.md`)" at all 4 self-invocation-guard sites; also reword the `deep_research_auto.yaml` iter-1 executor-note shorthand in the same neighborhood. |
| `create/readme.md:7`, `create_readme_auto.yaml:37`, `create_readme_confirm.yaml:9,40`, `create_readme_presentation.txt:19` | Modify | CMD-09 (P2): replace the dead `folder_readme.md` router reference with `.opencode/commands/create/readme.md` (the real router); rename `create_agent_verified` -> `create_readme_verified` consistently. |
| `deep/research.md:3`, `deep/review.md:3`, `deep/ai-council.md:4` | Modify | CMD-10 (P2): expand `argument-hint` to include every flag its presentation `.txt` PARSE block accepts (exact per-command flag lists in REQ-010). |
| `deep/assets/deep_review_auto.yaml` (current disk line 325; research.md cited within 317-326), `deep_review_confirm.yaml` (current disk line 302; research.md cited within 294-303) | Modify | CMD-11 (P2): remove the nonexistent third runtime directory `.agents/` from the agent-target discovery list; this repo has only `.claude/agents/` and `.opencode/agents/`. |
| New script under `.opencode/commands/` scripts, or an extension of `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Create/Modify | XS-04 (P2): research.md cites no precise existing fix location (representative finding-instance citations only). Design + add a referential-integrity checker that resolves literal skill assets, runtime-agent filenames, and declared runtime directories across `_auto`/`_confirm` YAML pairs for the `create`/`deep`/`design` families. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CMD-01: add the `runtime_agent_path_resolution` block to all 6 speckit workflow YAMLs. | `grep -rl "runtime_agent_path_resolution" .opencode/commands/speckit/assets/speckit_{complete,implement,plan}_{auto,confirm}.yaml` returns all 6 files; each block uses `default: .opencode/agents` (plural); all 12 `[runtime_agent_path]` sites still resolve; commands re-render clean at `:auto`/`:confirm`. |
| REQ-002 | CMD-02: fix the singular `.opencode/agent` typo to plural in all 10 create-family YAMLs. | `grep -rl "default: .opencode/agent$" .opencode/commands/create/assets/` returns 0 hits; `grep -rl "default: .opencode/agents$" .opencode/commands/create/assets/` returns the same 10 files. Must land before REQ-003. |
| REQ-003 | CMD-03: remove the retired-`speckit.md` `agent_availability` block and rename `created_via_speckit` in `create_agent_{auto,confirm}.yaml`. | `grep -n "runtime_agent_path\]/speckit.md\|created_via_speckit" .opencode/commands/create/assets/create_agent_auto.yaml .opencode/commands/create/assets/create_agent_confirm.yaml` returns 0 hits; output keys read `created_or_updated`; the shared `runtime_agent_path_resolution` block (output dir, `agent_path_local`, `context.md` consumers) is preserved untouched. |
| REQ-004 | CMD-04: repoint all 6 retired-`write.md` `agent_file` sites to `markdown.md`. | `grep -rl "runtime_agent_path\]/write.md" .opencode/commands/create/assets/` returns 0 hits; all 6 sites read `[runtime_agent_path]/markdown.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | CMD-06: normalize the duplicated `cli-opencode` executor enum and malformed exec text in the 3 deep presentation `.txt` files (source only). | `grep -n "cli-opencode \| cli-claude-code \| cli-opencode" .opencode/commands/deep/assets/*_presentation.txt` returns 0 hits; the Q-Exec label no longer contains `` ` exec` ``; `deep/assets/compiled/*.contract.md` is untouched by this phase (verified via `git diff --stat` showing no change under `deep/assets/compiled/`). |
| REQ-006 | CMD-07: remove the dead `/design:design-mcp-open-design` slash referral from all 5 design commands and route through `sk-design`'s nested transport mode instead. | `grep -rn "/design:design-mcp-open-design" .opencode/commands/design/` returns 0 hits; each of the 5 files instead names the transport mode reached through `sk-design`; all 5 commands re-render clean. |
| REQ-007 | XS-02: de-couple `agent_router.md` from the "Barter" workspace hardcode and replace non-current tool grants. | `grep -n "Barter" .opencode/commands/agent_router.md` returns 0 hits (or only generic-fallback prose referencing a user-supplied `path:` override remains); `allowed-tools` frontmatter contains only current OpenCode-supported tool names. |

### P2 - Optional (confirmed, complete OR documented deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | CMD-08: reword the "cli-opencode skill" framing to the correct `cli-external/cli-opencode` mode identity at all 5 sites (4 self-invocation-guard + 1 executor-note shorthand). | `grep -rn "The cli-opencode skill SKILL.md" .opencode/commands/deep/assets/*.yaml` returns 0 hits; all sites read "the `cli-external/cli-opencode` mode's SKILL.md (`.opencode/skills/cli-external/cli-opencode/SKILL.md`)". |
| REQ-009 | CMD-09: replace the dead `folder_readme.md` reference and rename `create_agent_verified`. | `grep -rl "folder_readme.md" .opencode/commands/create/` returns 0 hits; `grep -rn "create_agent_verified" .opencode/commands/create/assets/create_readme_*` returns 0 hits; the field is consistently `create_readme_verified` in both the YAML and the presentation. |
| REQ-010 | CMD-10: expand `argument-hint` in `deep/research.md`, `deep/review.md`, `deep/ai-council.md` to match every flag the paired presentation `.txt` parses. | `deep/research.md:3` gains `--spec-folder`, `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, per-lineage `--iters`; `deep/review.md:3` gains `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`; `deep/ai-council.md:4` gains `--executor-mode`, `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`. Verified by manual diff against each presentation's PARSE block (no automated flag-extractor exists yet). |
| REQ-011 | CMD-11: remove the nonexistent `.agents/` runtime directory from both deep-review YAMLs. | `grep -n "\.agents/" .opencode/commands/deep/assets/deep_review_auto.yaml .opencode/commands/deep/assets/deep_review_confirm.yaml` returns 0 hits; only `.claude/agents/` and `.opencode/agents/` remain listed. |
| REQ-012 | XS-04: design and add a referential-integrity checker for command-contract validation tooling. | A new/extended checker exists that resolves literal skill assets, runtime-agent filenames, and declared runtime directories across `_auto`/`_confirm` YAML pairs; running it against a deliberately re-broken fixture (e.g. a reintroduced `speckit.md` reference) exits non-zero; running it against the post-fix `create`/`deep`/`design` families exits 0; the checker explicitly excludes the legitimate `.codex` runtime-mirror/benchmark-executor references documented in research.md §5 (false-positive guard). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 P0 findings (CMD-01..04) resolve to 0 grep hits for their respective broken pattern, and every touched speckit/create command re-renders clean at `:auto` and `:confirm`.
- **SC-002**: All 3 P1 findings (CMD-06, CMD-07, XS-02) resolve to 0 grep hits for their respective broken pattern; `agent_router.md` no longer names the "Barter" workspace.
- **SC-003**: All 5 P2 findings (CMD-08..11, XS-04) resolve to 0 grep hits for their respective broken pattern, or the new XS-04 checker exists and passes against the post-fix tree.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/002-remediation-slash-commands --strict` exits 0, and the diff contains no file outside the 12-finding scope in §3.
- **SC-005**: `deep/assets/compiled/*.contract.md` and `manifest.jsonl` are byte-identical to their pre-phase state (CMD-05 recompile stays deferred to 006).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 (001) findings, now landed with exact file:line citations | Low — already satisfied; this spec is fully findings-driven | No further gate; proceed directly from this spec |
| Dependency | Phase 006 closeout runs the CMD-05 contract recompile AFTER this phase's CMD-06 source edits land | Med — if 006 recompiles before 002 lands, the recompile has to be re-run | Parent packet's phase order already sequences 006 last; this phase does not touch `deep/assets/compiled/` |
| Risk | CMD-06 and CMD-08 `research.md` line citations have drifted from current disk (re-verified 2026-07-11: `deep_research_presentation.txt` 91→94/133→157/39(new); `deep_review_presentation.txt` 116→119/160→196/43(new); `deep_research_auto.yaml` 1016→1217; `deep_research_confirm.yaml` 765→1037; `deep_review_auto.yaml` 1073→1283; `deep_review_confirm.yaml` 840→1111) | Med — editing at a stale cited line would corrupt an unrelated line | Re-grep each file immediately before editing; use the current-disk lines recorded in §3's Scope table, not the bare research.md citation |
| Risk | CMD-02, CMD-03, CMD-04, CMD-09 all touch `create_agent_{auto,confirm}.yaml` and/or `create_readme_{auto,confirm}.yaml` | Med — concurrent or out-of-order edits could corrupt the shared `runtime_agent_path_resolution` block or interleave diffs | Sequential execution order enforced in plan.md/tasks.md: CMD-02 -> CMD-03 -> CMD-04 -> CMD-09 |
| Risk | XS-04 has no precise existing fix location cited by research.md | Low — an implementer could stall looking for a line that doesn't exist | tasks.md explicitly flags XS-04 as new-tooling design work, not a line edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — every fix in this phase is a structural text/YAML literal edit with no added runtime tool calls or dispatch latency.

### Consistency
- **NFR-C01**: Every corrected reference must resolve to a target verified present on disk before the fix is marked done (no new dead link introduced while fixing an old one).
- **NFR-C02**: `:auto` and `:confirm` variants of a touched command must stay behaviorally identical after the fix (mirror edits applied to both where a finding lists both).

### Reliability
- **NFR-R01**: The CMD-06 source fix must not accidentally touch `deep/assets/compiled/*.contract.md` (a literal substring of the broken text also lives in the compiled contract; edit only the `.txt`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Shared-File Edge Cases
- CMD-02/CMD-03/CMD-04/CMD-09 all touch `create_agent_*.yaml`/`create_readme_*.yaml` at disjoint line ranges: apply in the sequenced order (§ Risks) so no in-flight diff overlaps another finding's target line.
- CMD-08/CMD-11 both touch `deep_review_{auto,confirm}.yaml` at disjoint line ranges: apply sequentially for the same reason.

### Error Scenarios
- CMD-06's malformed `` ` exec` `` label appears in 2 of the 3 presentation files (research/review); ai-council's parallel enum uses `active-runtime` as the default and is NOT malformed in the same way — do not apply the research/review fix pattern verbatim to ai-council's line 41/145/147.
- XS-04's checker must exclude the legitimate `.codex` runtime-mirror/benchmark-executor references documented in `research/research.md` §5 (false-positive guard) — a naive literal-reference scanner would otherwise flag live, correct tokens.

### State Transitions
- N/A — all fixes are static-content edits; no stateful workflow transitions are affected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 12 findings, ~30 files touched, but each is a small, precisely-cited text/YAML literal edit |
| Risk | 8/25 | No runtime logic change; risk is confined to shared-file edit sequencing (see Risks) |
| Research | 2/20 | 001 deep-research already delivered exact file:line citations for every finding |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Both questions below are now resolved.

- **XS-04 checker (new script vs. extension?):** Neither, at this time — DEFERRED. `compile-command-contracts.cjs` only covers the `deep/*` family and is coupled to the CMD-05 recompile pipeline owned by phase 006; no clean, proportionate extension point spans `create`/`deep`/`design`. See `implementation-summary.md` for the full design note.
- **CMD-07 rewrite sufficiency:** Resolved as sufficient. Each of the 5 design commands now reads "Prefer the `sk-design` skill's `design-mcp-open-design` transport mode when..." plus an explicit "nested mode, not an independently dispatchable `/design:*` command" clarifier; no additional cross-link to a `sk-design` command entry point was added (none exists as a distinct target beyond the skill itself).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines) + LEVEL 2 ADDENDUM
- NFRs, Edge Cases, Complexity Assessment added
- Findings-driven scope replaces pre-001 "await findings" hedging
-->
