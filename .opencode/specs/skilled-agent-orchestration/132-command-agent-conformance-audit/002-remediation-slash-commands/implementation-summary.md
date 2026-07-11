---
title: "Implementation Summary: Phase 2: Remediate Slash Commands & Assets"
description: "11 of 12 confirmed CMD/XS command-surface findings fixed and grep-verified across create/deep/design/speckit command assets and the root agent_router.md; XS-04 deferred with a design note."
trigger_phrases:
  - "remediate slash commands implementation summary"
  - "cmd findings implementation summary"
  - "002-remediation-slash-commands summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/002-remediation-slash-commands"
    last_updated_at: "2026-07-11T04:44:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fixed+verified 11/12 findings; XS-04 deferred w/ design note"
    next_safe_action: "006 closeout: recompile deep contracts, then skill-graph regen"
    blockers: []
    key_files:
      - ".opencode/commands/create/assets/create_agent_auto.yaml"
      - ".opencode/commands/create/assets/create_agent_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/commands/agent_router.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions:
      - "XS-04 checker: deferred, no clean extension point spans create/deep/design; see Known Limitations."
      - "CMD-07: one-line rewrite + clarifier sentence judged sufficient, no extra cross-link added."
---
# Implementation Summary: Phase 2: Remediate Slash Commands & Assets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-remediation-slash-commands |
| **Completed** | 2026-07-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase applied the 12 confirmed command-surface conformance findings from `001-conformance-deep-research` directly to the live command assets under `.opencode/commands/{create,deep,design,speckit}/**` plus the root `agent_router.md`. 11 of 12 findings are fixed and grep-verified at zero residual hits; XS-04 (a new referential-integrity checker) is deferred with a design note because no clean, proportionate extension point exists. `deep/assets/compiled/*.contract.md` and `manifest.jsonl` are confirmed byte-identical to their pre-phase state — the CMD-05 recompile stays deferred to phase 006, as directed.

### CMD-01 — Speckit `[runtime_agent_path]` resolution block (P0)

Added `runtime_agent_path_resolution: { default: .opencode/agents, claude: .claude/agents }` to the top of all 6 speckit workflow YAMLs (`speckit_complete_auto/confirm.yaml`, `speckit_implement_auto/confirm.yaml`, `speckit_plan_auto/confirm.yaml`). All 12 `[runtime_agent_path]` interpolation sites across these files now resolve to a real directory instead of dangling.

### CMD-02 — Singular `.opencode/agent` typo (P0)

Fixed the copy-pasted singular-path typo (`default: .opencode/agent` → `default: .opencode/agents`) across the create-family YAMLs. **Scope note:** the live re-sweep on 2026-07-11 found 12 files carrying the pattern, not the 10 research.md cited — `create_changelog_confirm.yaml` and `create_feature_catalog_auto.yaml` had drifted into the same broken state since 001's research closed. Both are the exact same defect class in the exact same file family already assigned to this finding, so both were fixed alongside the cited 10 (not opportunistic scope expansion — matches REQ-002's directory-wide, not file-list-scoped, acceptance grep).

### CMD-03 — Retired `speckit.md` agent + `created_via_speckit` residue (P0)

Removed the `agent_availability` block targeting the retired `speckit.md` agent from `create_agent_auto.yaml` and `create_agent_confirm.yaml`, matching the sibling `create_command_auto.yaml:287-300` distributed-governance pattern (no `agent_file`, routed through prose instead). Renamed `created_via_speckit` → `created_or_updated` at both output sites in both files. The shared `runtime_agent_path_resolution` block and its 3 live consumers (output-dir interpolation, `agent_path_local`, the `context.md` `agent_availability` block) were verified untouched.

### CMD-04 — Retired `write.md` agent (P0)

Repointed all 6 `agent_file: "[runtime_agent_path]/write.md"` sites (`create_readme_confirm.yaml` x2, `create_readme_auto.yaml` x2, `create_agent_confirm.yaml`, `create_agent_auto.yaml`) to `/markdown.md`, the live specialist that already does the intended quality-validation work.

### CMD-06 — Duplicated `cli-opencode` executor enum + malformed exec text (P1)

De-duplicated the `native | cli-opencode | cli-claude-code | cli-opencode` (and ai-council's `active-runtime` variant) executor enum in all 3 deep presentation `.txt` files. The Q-Exec menu's malformed option B (`` ` exec` `` in research/review, "one external  round" with a missing word in ai-council — both are leftover remnants of the retired `cli-codex` executor that got relabeled `cli-opencode`) was repaired by moving the correct invocation text from the now-redundant duplicate option D into option B, then deleting D, leaving 3 clean lettered options that match the 3-value enum. Confirmed no reply-format example references the deleted letter, so no downstream breakage. `deep/assets/compiled/` confirmed untouched. **Scope note:** `deep_model-benchmark_presentation.txt` carries the same duplicate-enum pattern but is not one of CMD-06's cited files — left untouched, flagged below as a new out-of-scope defect.

### CMD-07 — Dead `/design:design-mcp-open-design` referral (P1)

Reworded the dead slash-command referral in all 5 design commands to route through `sk-design`'s nested `design-mcp-open-design` transport mode instead, with an explicit "this is a nested mode, not an independently dispatchable `/design:*` command" clarifier. Verified against `sk-design/mode-registry.json`'s transport entry (`command: null`, mandatory pairing with a design-judgment mode).

### XS-02 — Root `agent_router.md` Barter-workspace hardcode (P1)

Rewrote the "Base Scan Path" ancestor-detection logic from a literal `Barter`-named-workspace requirement to structural detection (the ancestor containing this `agent_router.md`, or the nearest ancestor with 2+ `AGENTS.md`-bearing children) — the router now works in any workspace, not just the one it was originally hardcoded for. Also generalized the remaining illustrative "Barter" example strings for full de-coupling (0 residual "Barter" mentions). Replaced the `allowed-tools` frontmatter grant (`WebSearch`, `AskUserQuestion` — neither appears in any other command's frontmatter in this repo) with the current supported set.

### CMD-08 — `cli-opencode` mis-framed as a standalone skill (P2)

Reworded all 4 self-invocation-guard sites (`deep_research_auto/confirm.yaml`, `deep_review_auto/confirm.yaml`) from "The cli-opencode skill SKILL.md" to "the `cli-external/cli-opencode` mode's SKILL.md (`.opencode/skills/cli-external/cli-opencode/SKILL.md`)". Also reworded the mirrored "cli-opencode SKILL.md §4 ALWAYS rule" shorthand note, present symmetrically in all 4 files (research.md's citation only named 1), fixed in all 4 for `:auto`/`:confirm` mirror symmetry.

### CMD-09 — Dead `folder_readme.md` reference + `create_agent_verified` residue (P2)

Replaced `folder_readme.md` with the real router path `.opencode/commands/create/readme.md` at all 3 sites. Renamed `create_agent_verified` → `create_readme_verified` at all 4 live sites (`create_readme_presentation.txt` x2, `create_readme_auto.yaml`, `create_readme_confirm.yaml` — 3 more than the single cited line, all within the directory-wide REQ-009 acceptance scope).

### CMD-10 — Under-declared `/deep` argument-hints (P2)

Expanded `argument-hint` in `deep/research.md`, `deep/review.md`, and `deep/ai-council.md` to include every flag their respective presentation `.txt` PARSE blocks accept, cross-checked manually against each PARSE block.

### CMD-11 — Nonexistent `.agents/` runtime directory (P2)

Removed the phantom `.agents/` runtime directory from the agent-target discovery lists in `deep_review_auto.yaml` and `deep_review_confirm.yaml`; only the two real directories (`.claude/agents/`, `.opencode/agents/`) remain.

### XS-04 — Referential-integrity checker (P2, deferred)

See Known Limitations below.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `speckit/assets/speckit_complete_auto.yaml` | Modified | CMD-01: added `runtime_agent_path_resolution` block |
| `speckit/assets/speckit_complete_confirm.yaml` | Modified | CMD-01 |
| `speckit/assets/speckit_implement_auto.yaml` | Modified | CMD-01 |
| `speckit/assets/speckit_implement_confirm.yaml` | Modified | CMD-01 |
| `speckit/assets/speckit_plan_auto.yaml` | Modified | CMD-01 |
| `speckit/assets/speckit_plan_confirm.yaml` | Modified | CMD-01 |
| `create/assets/create_agent_auto.yaml` | Modified | CMD-02, CMD-03, CMD-04 |
| `create/assets/create_agent_confirm.yaml` | Modified | CMD-02, CMD-03, CMD-04 |
| `create/assets/create_skill_auto.yaml` | Modified | CMD-02 |
| `create/assets/create_skill_confirm.yaml` | Modified | CMD-02 |
| `create/assets/create_readme_auto.yaml` | Modified | CMD-02, CMD-04, CMD-09 |
| `create/assets/create_readme_confirm.yaml` | Modified | CMD-02, CMD-04, CMD-09 |
| `create/assets/create_changelog_auto.yaml` | Modified | CMD-02 |
| `create/assets/create_changelog_confirm.yaml` | Modified | CMD-02 (live-sweep instance, not in research.md's cited 10) |
| `create/assets/create_feature_catalog_auto.yaml` | Modified | CMD-02 (live-sweep instance, not in research.md's cited 10) |
| `create/assets/create_feature_catalog_confirm.yaml` | Modified | CMD-02 |
| `create/assets/create_manual_testing_playbook_auto.yaml` | Modified | CMD-02 |
| `create/assets/create_manual_testing_playbook_confirm.yaml` | Modified | CMD-02 |
| `create/assets/create_readme_presentation.txt` | Modified | CMD-09 |
| `create/readme.md` | Modified | CMD-09 (comment fix only) |
| `deep/assets/deep_research_presentation.txt` | Modified | CMD-06 |
| `deep/assets/deep_review_presentation.txt` | Modified | CMD-06 |
| `deep/assets/deep_ai-council_presentation.txt` | Modified | CMD-06 |
| `deep/assets/deep_research_auto.yaml` | Modified | CMD-08 |
| `deep/assets/deep_research_confirm.yaml` | Modified | CMD-08 |
| `deep/assets/deep_review_auto.yaml` | Modified | CMD-08, CMD-11 |
| `deep/assets/deep_review_confirm.yaml` | Modified | CMD-08, CMD-11 |
| `deep/research.md` | Modified | CMD-10 |
| `deep/review.md` | Modified | CMD-10 |
| `deep/ai-council.md` | Modified | CMD-10 |
| `design/interface.md` | Modified | CMD-07 |
| `design/foundations.md` | Modified | CMD-07 |
| `design/motion.md` | Modified | CMD-07 |
| `design/audit.md` | Modified | CMD-07 |
| `design/md-generator.md` | Modified | CMD-07 |
| `agent_router.md` | Modified | XS-02 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every target file was re-grepped for its exact current-disk location immediately before editing (research.md's line citations had drifted for CMD-06/CMD-08, and CMD-02's file count had grown from 10 to 12). Shared-file sequencing from plan.md was honored exactly: CMD-02 landed before CMD-03 before CMD-04 before CMD-09 on `create_agent_*`/`create_readme_*`; CMD-08 landed before CMD-11 on `deep_review_*`. Each finding was fixed, then immediately grep-verified at 0 residual hits before moving to the next. All 22 edited `.yaml` files were confirmed valid YAML via `python3 yaml.safe_load()` (22/22 pass). `deep/assets/compiled/` was confirmed byte-identical throughout (`git status --porcelain` empty at every checkpoint). A final combined residual-pattern sweep re-ran all 11 findings' acceptance greps in one pass with 0 unexpected hits, followed by `validate.sh --strict` on this child folder only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fixed all 12 live CMD-02 instances, not just research.md's cited 10 | Same defect class, same file family already assigned to this finding; REQ-002's acceptance grep is directory-wide, not file-list-scoped. Leaving 2 known-broken siblings unfixed would fail the stated acceptance criteria. |
| Fixed all 4 mirrored CMD-08 shorthand notes, not just the 1 research.md cited | The shorthand appears symmetrically in all 4 auto/confirm x research/review files; NFR-C02 requires `:auto`/`:confirm` mirror edits to stay symmetric, and leaving 3 of 4 unfixed would produce an inconsistent result. |
| CMD-06 Q-Exec fix: collapse duplicate letter D into repaired letter B, don't just patch B's malformed text in place | The malformed text traces to a retired `cli-codex` executor remnant duplicated onto the `cli-opencode` label; patching only the text would leave 2 letters (B, D) both claiming `cli-opencode` while a 3-value enum exists. Collapsing to 3 letters (A/B/C) matches the enum exactly and no reply-format example references the deleted letter. |
| XS-02: also generalized illustrative "Barter" example strings beyond the cited 93-98 detection-logic lines | REQ-007's acceptance grep tolerates residual generic-fallback prose, but full de-coupling (0 hits) is the more defensible, unambiguous outcome and the finding's stated intent ("de-couple ... from the hardcoded Barter workspace"). |
| XS-02: removed `WebSearch`/`AskUserQuestion` from `allowed-tools` rather than substituting equivalents | Neither name appears in any of the ~30 other command frontmatter blocks checked across this repo; there is no in-repo evidence either is a currently-grantable tool name, so removal (not substitution) is the only defensible fix. |
| XS-04: deferred rather than force-fit into `compile-command-contracts.cjs` | That script's `COMMANDS` registry covers only the `deep/*` family and is tightly coupled to the CMD-05 recompile pipeline this phase is forbidden from touching. Building a checker spanning `create`/`deep`/`design` with a `.codex` false-positive guard and fixture tests is genuinely new tooling, which the dispatch directive explicitly said not to invent under scope pressure. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CMD-01: `grep -rl "runtime_agent_path_resolution" speckit_{complete,implement,plan}_{auto,confirm}.yaml` | PASS, 6/6 files |
| CMD-02: `grep -rl "default: .opencode/agent$" create/assets/` | PASS, 0 hits |
| CMD-03: `grep -n "runtime_agent_path\]/speckit.md\|created_via_speckit" create_agent_{auto,confirm}.yaml` | PASS, 0 hits |
| CMD-04: `grep -rl "runtime_agent_path\]/write.md" create/assets/` | PASS, 0 hits |
| CMD-06: `grep -n "cli-opencode \| cli-claude-code \| cli-opencode"` (3 scoped files) | PASS, 0 hits; compiled/ untouched |
| CMD-07: `grep -rn "/design:design-mcp-open-design" design/` | PASS, 0 hits |
| XS-02: `grep -n "Barter" agent_router.md` | PASS, 0 hits |
| CMD-08: `grep -rn "The cli-opencode skill SKILL.md\|cli-opencode SKILL.md" deep/assets/*.yaml` | PASS, 0 hits |
| CMD-09: `grep -rl "folder_readme.md" create/` + `grep -rn "create_agent_verified" create_readme_*` | PASS, 0 hits both |
| CMD-10: manual diff of argument-hint vs. PARSE block | PASS, all REQ-010 flags present |
| CMD-11: `grep -n "\.agents/" deep_review_{auto,confirm}.yaml` | PASS, 0 hits |
| YAML validity: `python3 yaml.safe_load()` on all 22 edited `.yaml` files | PASS, 22/22 |
| Compiled-contract byte-identity: `git status --porcelain deep/assets/compiled/` | PASS, empty |
| SCOPE LOCK: `git diff --stat` restricted to intended paths | PASS, exactly 35 files, all within create/deep/design/speckit + agent_router.md |
| `bash validate.sh <this-folder> --strict` | PASS, exit 0, Errors: 0 Warnings: 0 (child folder only; parent packet not validated per dispatch scope) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **XS-04 (referential-integrity checker) is deferred, not built.** No existing command-contract validator cleanly spans `create`/`deep`/`design`: `compile-command-contracts.cjs` only registers the `deep/*` family (its `COMMANDS` object has no `create/`/`design/` entries) and is coupled to the CMD-05 compiled-contract pipeline this phase is forbidden from touching; no validator exists at all for `create`/`design` assets. **Design note for the eventual implementer:** a proportionate checker would (a) walk each `_auto.yaml`/`_confirm.yaml` pair per family, (b) extract every `[runtime_agent_path]/<name>.md` literal and resolve it against both `.opencode/agents/` and `.claude/agents/`, (c) extract every literal skill-asset path (`.opencode/skills/**`) and resolve it against disk, (d) extract every declared runtime directory list (e.g. the `.claude/agents/`, `.opencode/agents/` enumeration CMD-11 touched) and flag any entry absent from a small allowlist of real runtime directories, (e) explicitly exclude the legitimate `.codex` runtime-mirror/benchmark-executor tokens documented in `001-conformance-deep-research/research/research.md` §5 (a naive scanner would false-positive on these live tokens), and (f) exit non-zero on any unresolved reference, 0 otherwise. It should run over both `_auto` and `_confirm` variants per command and ship with at least one deliberately-broken fixture (e.g. a reintroduced `speckit.md` reference) proving the non-zero exit path.
2. **`deep_model-benchmark_presentation.txt` carries the same CMD-06 duplicate-enum pattern** (`cli-opencode | cli-claude-code | cli-opencode` at lines 40 and 133) but is not one of CMD-06's cited files (not `research`/`review`/`ai-council`). Left untouched per SCOPE LOCK; flagged here as a new, unfixed defect for a future finding.
3. **Two additional CMD-02-class files surfaced by the live re-sweep** (`create_changelog_confirm.yaml`, `create_feature_catalog_auto.yaml`) were fixed alongside the cited 10 — see Key Decisions. Downstream trackers reconciling against research.md's original "10 files" count should expect 12.
4. **CHK-042 (changelog entry) is deferred**, out of this LEAF agent's write scope — the parent packet's `../changelog/` refresh is a packet-level closeout action.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| CMD-02 fixes 10 files (research.md count) | Fixed 12 files | Live re-sweep found 2 additional same-class instances that drifted in after 001's research closed; fixing them keeps the directory-wide REQ-002 acceptance grep honest. |
| CMD-08 fixes 4 self-invocation-guard sites | Fixed 4 guard sites + 4 mirrored shorthand notes (8 total edits) | The shorthand note ("cli-opencode SKILL.md §4 ALWAYS rule") is present symmetrically in all 4 files, not just the 1 site research.md's "iter-1 executor-note shorthand" citation named; fixing all 4 satisfies NFR-C02's mirror-symmetry requirement. |
| CMD-09 fixes `create_readme_presentation.txt:19` | Fixed 4 `create_agent_verified` sites across 3 files | REQ-009's acceptance grep is directory-wide (`create_readme_*`), and 3 more live sites existed beyond the single cited line. |
| XS-04 built as new/extended tooling | Deferred with a design note | No clean, proportionate extension point exists; building cross-family tooling under this phase's scope would violate the "do not invent a large new script" dispatch directive. |
<!-- /ANCHOR:deviations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
-->
