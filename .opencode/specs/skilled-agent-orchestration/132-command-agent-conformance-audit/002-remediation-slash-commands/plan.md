---
title: "Implementation Plan: Phase 2: Remediate Slash Commands & Assets"
description: "Ordered fix plan for 12 confirmed command-surface findings (4 P0, 3 P1, 5 P2), sequenced to avoid shared-file collisions, with grep-based verification per finding and a final validate.sh --strict gate."
trigger_phrases:
  - "remediate slash commands plan"
  - "command fix sequencing"
  - "cmd findings implementation plan"
  - "002-remediation-slash-commands"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/002-remediation-slash-commands"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored ordered fix plan across 4 P0 + 3 P1 + 5 P2 findings"
    next_safe_action: "Execute CMD-02 before CMD-03 per shared-file sequencing, then validate"
    blockers:
      - "CMD-05 contract recompile deferred to 006 (do not action here)"
    key_files:
      - ".opencode/commands/create/assets/create_agent_auto.yaml"
      - ".opencode/commands/create/assets/create_agent_confirm.yaml"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/create/assets/create_readme_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 2: Remediate Slash Commands & Assets

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Declarative command surface: Markdown command routers, YAML workflow assets (`_auto`/`_confirm`), plain-text presentation prompts |
| **Framework** | OpenCode/Claude Code slash-command contract (frontmatter + workflow YAML + presentation `.txt`); no application code involved |
| **Storage** | None — no database, no compiled artifact writes in this phase (compiled contracts are explicitly out of scope) |
| **Testing** | `rg`/`grep` structural verification per finding + `system-spec-kit` `validate.sh --strict` on this packet |

### Overview
This phase applies 12 confirmed, file:line-cited fixes from `001-conformance-deep-research/research/research.md` directly to the command surface: 4 mechanical P0 fixes (a systemic typo + two retired-agent-reference cleanups + a missing resolution block), 3 P1 fixes (a malformed executor enum, a dead slash referral, and a workspace-hardcoded root router), and 5 P2 fixes (identity wording, a dead router reference, under-declared flags, a phantom directory, and new validation tooling). No new abstractions are introduced; every change either corrects a literal string/block to match an already-established sibling pattern in the same file family, or adds new grep-checkable tooling (XS-04).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3, findings-driven)
- [x] Success criteria measurable (spec.md §5, all grep/validate-based)
- [x] Dependencies identified (spec.md §6; CMD-06→006 sequencing, shared-file sequencing below)

### Definition of Done
- [ ] All 12 REQ acceptance criteria met (spec.md §4)
- [ ] Every finding's grep-based verification returns 0 residual hits
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0
- [ ] Docs updated: spec.md Status -> Complete, implementation-summary.md authored (post-implementation, not this planning turn)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
N/A (declarative command surface, not application architecture). Each command family follows: `command.md` (router/frontmatter) -> `assets/<command>_{auto,confirm}.yaml` (workflow logic) -> `assets/<command>_presentation.txt` (interactive prompt rendering) -> (deep family only) `assets/compiled/<command>.contract.md` (build artifact, out of scope here).

### Key Components
- **speckit family** (`speckit/assets/*.yaml`): CMD-01 target — 6 files share zero `runtime_agent_path_resolution` definition.
- **create family** (`create/assets/*.yaml`): CMD-02/03/04/09 target — a template-propagated typo and two retired-agent references, plus a dead router reference.
- **deep family** (`deep/{research,review,ai-council}.md`, `deep/assets/*.yaml`, `deep/assets/*_presentation.txt`): CMD-06/08/10/11 target — executor-enum text, skill-identity wording, argument-hint coverage, phantom directory.
- **design family** (`design/*.md`): CMD-07 target — dead slash-command referral.
- **root command** (`agent_router.md`): XS-02 target — workspace-hardcoded router logic.
- **validation tooling** (new/extended): XS-04 target — no existing owner file; design decision open (see spec.md §10).

### Data Flow
A user invokes `/create:agent`, `/deep:research`, `/design:interface`, etc. -> the command.md router dispatches to the matching `_auto` or `_confirm` YAML -> the YAML's `agent_availability`/`runtime_agent_path_resolution` blocks resolve which agent file to dispatch, using the same-file `[runtime_agent_path]` token -> the presentation `.txt` renders any interactive prompts (executor selection, flag parsing) the YAML references. This phase corrects the resolution/reference layer so every hop lands on a real target; it does not change the dispatch flow itself.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a fix-bug remediation phase against 001's deep-research findings. Every finding below was independently re-verified against the working tree on 2026-07-11 (commands in the "Required inventories" section).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime_agent_path_resolution:` block (producer, top of each workflow YAML) | Defines `default`/`claude` base paths consumed by `[runtime_agent_path]` in the same file | CMD-01: add (6 speckit files, currently absent); CMD-02: fix typo (10 create files, currently singular) | `grep -c "runtime_agent_path_resolution" <file>` == 1 per file after fix |
| `[runtime_agent_path]/<agent>.md` interpolation sites (consumer) | Resolves to `.opencode/agents/<agent>.md` or `.claude/agents/<agent>.md` at dispatch time | CMD-03: retarget from `speckit.md` (removed, no successor); CMD-04: retarget from `write.md` to `markdown.md` | `grep -rn "runtime_agent_path\]/\(speckit\|write\)\.md"` returns 0 hits in touched files |
| Deep executor enum + Q-Exec label (producer, presentation `.txt`) | Drives interactive executor selection; propagates verbatim into the compiled contract by a separate build step | CMD-06: de-duplicate `native \| cli-opencode \| cli-claude-code \| cli-opencode`; repair `` ` exec` `` | `grep -c "cli-opencode$" <file>` per enum line == 1 (was 2); compiled contract untouched (006's job) |
| `/design:design-mcp-open-design` referral text (producer, 5 design commands) | Told the reader to dispatch a slash command that does not exist | CMD-07: rewrite to name the `sk-design` skill's nested transport mode | `grep -rn "/design:design-mcp-open-design"` returns 0 hits |
| `agent_router.md` workspace-detection block (producer, root command) | Hardcodes "Barter"/`z — Global (Shared)/` ancestor detection, non-functional in this `Public` workspace | XS-02: generalize to project-agnostic ancestor detection | `grep -n "Barter"` returns 0 hits |

Required inventories (already run; results feed §3's Scope table in spec.md):
- Same-class producers: `grep -n "default: .opencode/agent$" .opencode/commands/create/assets/*.yaml` -> confirmed exactly the 10 files research.md cites.
- Consumers of changed symbols: `grep -n "runtime_agent_path\]" .opencode/commands/speckit/assets/*.yaml .opencode/commands/create/assets/*.yaml` -> confirmed every cited line number for CMD-01/03/04.
- Matrix axes: file family (speckit/create/deep/design/root) x finding severity (P0/P1/P2) x shared-file collision (yes/no) — collision axis drives the sequencing in §"L2: PHASE DEPENDENCIES" below.
- Algorithm invariant: N/A — no parser/redaction/security logic is touched; every fix is a literal string/block substitution verified by exact-match grep before and after.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm all 12 findings still reproduce on disk (baseline grep sweep — see tasks.md T001-T002)
- [ ] Re-locate CMD-06 and CMD-08 current line numbers (research.md citations have drifted; current lines recorded in spec.md §3 and §6)
- [ ] Confirm CMD-05/XS-01/XS-03 remain explicitly out of scope (no action, owned by phase 006)

### Phase 2: Core Implementation
- [ ] P0: CMD-01 (add resolution block, speckit family) — independent, no shared files with any other finding
- [ ] P0: CMD-02 (fix typo, create family) — must land before CMD-03
- [ ] P0: CMD-03 (retire speckit.md target, create-agent) — after CMD-02
- [ ] P0: CMD-04 (retire write.md target, create family) — after CMD-03 (shares create_agent/create_readme files)
- [ ] P1: CMD-06 (executor enum, deep presentation) — independent
- [ ] P1: CMD-07 (dead design referral) — independent
- [ ] P1: XS-02 (agent_router de-coupling) — independent
- [ ] P2: CMD-08 (cli-opencode identity wording) — shares deep_review_{auto,confirm}.yaml with CMD-11; land before CMD-11
- [ ] P2: CMD-09 (dead folder_readme.md reference) — after CMD-04 (shares create_readme files)
- [ ] P2: CMD-10 (argument-hint coverage) — independent
- [ ] P2: CMD-11 (remove .agents/ directory) — after CMD-08
- [ ] P2: XS-04 (new referential-integrity checker) — independent; design-only, no existing line to edit

### Phase 3: Verification
- [ ] Re-render every touched command's `:auto` and `:confirm` (manual read-through of the affected YAML/presentation)
- [ ] Full residual-pattern sweep: re-run every finding's verification grep in one pass, confirm 0 unexpected hits
- [ ] Confirm `deep/assets/compiled/*.contract.md` and `manifest.jsonl` are byte-identical to the pre-phase state
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural grep | Per-finding broken-pattern-must-be-0-hits assertions (see spec.md §4 REQ Acceptance Criteria) | `rg`/`grep -n`/`grep -rl` |
| Manual re-render | Each touched command's `:auto`/`:confirm` YAML and presentation `.txt`, read end-to-end for internal consistency | Read tool |
| Spec-doc validation | This packet's spec/plan/tasks/checklist structural + frontmatter contract | `validate.sh --strict` |
| Tooling smoke test (XS-04 only) | New/extended checker run against a deliberately-broken fixture and the post-fix tree | New script's own CLI invocation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-conformance-deep-research/research/research.md` | Internal (packet-local) | Green — landed, re-verified 2026-07-11 | Findings undefined; this phase cannot proceed without it (already satisfied) |
| `sk-design/mode-registry.json` (CMD-07 target) | Internal (skill) | Green — confirmed present, lists `design-mcp-open-design` | CMD-07 rewrite would name a nonexistent target |
| `.opencode/skills/cli-external/cli-opencode/SKILL.md` (CMD-08 target) | Internal (skill) | Green — confirmed present | CMD-08 rewrite would name a nonexistent target |
| Phase 006 closeout (CMD-05 recompile, after this phase's CMD-06 source edits land) | Internal (packet, downstream) | Yellow — not yet started; sequencing dependency only | If 006 recompiles before 002 lands, the recompile must be re-run after 002 ships |
| `markdown.md` agent file (CMD-04 retarget) | Internal (runtime) | Green — confirmed present in both `.opencode/agents/` and `.claude/agents/` inventories | CMD-04 retarget would name a nonexistent target |

### Deferred / Downstream Notes
- **CMD-05** (compiled deep contract recompile): explicitly deferred to phase 006, which runs AFTER all deep source edits (including this phase's CMD-06) land. This phase edits only `deep/assets/*_presentation.txt`, never `deep/assets/compiled/`.
- **XS-01/XS-03** (skill-graph ghost nodes, zombie SQLite row, null hub timestamps): cross-surface build-artifact regeneration, owned by phase 006. No action in this phase.
- **CMD-09** (README-adjacent): lives in command YAML/presentation (in scope here), but its remediation should be sequenced alongside phase 005's README work per 001's Remediation Routing table — no dependency blocks this phase's fix, it is a sequencing note only.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A touched command fails to re-render cleanly at `:auto` or `:confirm`, or a post-fix grep sweep finds an unintended change outside the 12-finding scope.
- **Procedure**: `git diff` the touched file against its pre-phase state and `git checkout -- <file>` the specific file (never a broad `git checkout .`); re-apply only the intended finding's fix.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
CMD-01 (speckit, independent) ──────────────────────────────────┐
CMD-06 (deep presentation, independent) ─────────────────────────┤
CMD-07 (design, independent) ────────────────────────────────────┤
XS-02  (agent_router, independent) ───────────────────────────────┤
CMD-10 (deep argument-hint, independent) ─────────────────────────┤
XS-04  (new tooling, independent) ────────────────────────────────┤──> Phase 3: Verification
                                                                  │
CMD-02 ──> CMD-03 ──> CMD-04 ──> CMD-09  (create family, sequential; shared files)
                                                                  │
CMD-08 ──> CMD-11  (deep_review_{auto,confirm}.yaml, sequential; shared files) ─┘
```

| Finding | Depends On | Shared File(s) Forcing Order | Blocks |
|---------|------------|-------------------------------|--------|
| CMD-01 | None | — | Phase 3 |
| CMD-02 | None | `create_agent_{auto,confirm}.yaml`, `create_readme_{auto,confirm}.yaml` | CMD-03, CMD-04, CMD-09 |
| CMD-03 | CMD-02 | `create_agent_{auto,confirm}.yaml` | CMD-04 |
| CMD-04 | CMD-03 | `create_agent_{auto,confirm}.yaml`, `create_readme_{auto,confirm}.yaml` | CMD-09 |
| CMD-06 | None | — | Phase 3 |
| CMD-07 | None | — | Phase 3 |
| XS-02 | None | — | Phase 3 |
| CMD-08 | None | `deep_review_{auto,confirm}.yaml` | CMD-11 |
| CMD-09 | CMD-04 | `create_readme_{auto,confirm}.yaml` | Phase 3 |
| CMD-10 | None | — | Phase 3 |
| CMD-11 | CMD-08 | `deep_review_{auto,confirm}.yaml` | Phase 3 |
| XS-04 | None | — | Phase 3 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (baseline re-confirmation) | Low | 10-15 minutes |
| P0 chain (CMD-01,02,03,04) | Low | 30-45 minutes (mechanical, sequenced) |
| P1 (CMD-06, CMD-07, XS-02) | Low-Med | 30-45 minutes (CMD-06 needs careful enum-vs-enum comparison across 3 files) |
| P2 (CMD-08,09,10,11) | Low | 30-40 minutes |
| P2 tooling (XS-04) | Medium | 45-60 minutes (new checker design + fixture test) |
| Verification | Low | 15-20 minutes |
| **Total** | | **~2.5-3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migrations (this phase edits static command assets only)
- [ ] `deep/assets/compiled/` confirmed untouched before any commit
- [ ] Each finding's fix verified independently before moving to the next sequenced item

### Rollback Procedure
1. Identify the specific file:line via `git diff <file>`.
2. `git checkout -- <file>` for the single affected file (never a broad revert).
3. Re-run the finding's verification grep to confirm the file is back to its pre-fix state.
4. Re-apply the fix once the root cause is understood; no user-facing impact (command surface is doc/YAML only, not a deployed service).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — file-level `git checkout` is sufficient.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines) + FIX ADDENDUM
- Findings-driven phases, explicit shared-file sequencing
- Phase dependencies encode the CMD-02->03->04->09 and CMD-08->11 chains
-->
