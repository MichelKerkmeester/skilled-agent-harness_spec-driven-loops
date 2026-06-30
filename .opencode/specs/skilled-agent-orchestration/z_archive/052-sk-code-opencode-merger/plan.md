---
title: "Implementation Plan: sk-code-opencode-merger"
description: "Implemented consolidation approach for absorbing sk-code-opencode into sk-code, removing Go and React/NextJS branches, and updating downstream references."
trigger_phrases:
  - "sk-code-opencode merger plan"
  - "single sk-code plan"
  - "resource map"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T21:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented merger and completed 7-iteration deep review"
    next_safe_action: "Review remediation diff and rerun targeted validation"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660661"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Initial planning-only phase completed; implementation was later approved and completed."
      - "Two-axis detection architecture designed (Code Surface → Intent Classification)."
      - "Route name resolved: opencode/OPENCODE."
      - "Changelogs: DELETE; Telemetry: REGENERATE."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, TypeScript advisor code/tests, Python verifier scripts, YAML command assets, TOML/Markdown agent files, JSON metadata |
| **Framework** | OpenCode skill and spec-kit framework |
| **Storage** | File-system skill inventory and generated skill graph metadata |
| **Testing** | `rg` reference checks, spec validation, advisor/hook vitest suites, verifier script tests |

### Overview

The implementation merged `sk-code-opencode` into `sk-code` by adding a first-class OpenCode system-code route inside `sk-code`, moving OpenCode standards resources into that route, and retiring the sibling skill after references were rewritten. In the same implementation, Go and React/NextJS placeholder branches were removed from `sk-code` so the surviving multi-stack skill demonstrates a real route model: Webflow plus OpenCode system-code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.
- [x] Resource map created with active blast-radius paths.
- [x] User approves moving from plan-only to implementation.

### Definition of Done

- [x] `sk-code` exposes OpenCode system-code routing and resources.
- [x] `sk-code-opencode` is removed, archived, or reduced to a historical pointer per approved decision.
- [x] Go and React/NextJS placeholder branches are removed from `sk-code`.
- [x] Runtime agents and command YAMLs no longer require `sk-code-*` overlays.
- [x] Skill advisor code, fixtures, graph, and tests no longer emit `sk-code-opencode` as a live route.
- [x] Exact searches for live `sk-code-opencode` references return only approved historical artifacts.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-axis context-aware detection: Code Surface (first gate) → Intent Classification (second gate) → Per-surface resource loading with language sub-detection for OpenCode.

### Detection Architecture

```
                ┌─────────────────────────────┐
                │     CODE SURFACE DETECTION    │  ← AXIS 1: Where are you working?
                │  (Webflow vs OpenCode vs ?)   │     CWD + changed files
                └─────────────┬───────────────┘
                              │
                ┌─────────────▼───────────────┐
                │     INTENT CLASSIFICATION     │  ← AXIS 2: What are you doing?
                │  (Implement/Debug/Verify/…)   │     Weighted keyword scoring
                └─────────────┬───────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐          ┌──────────┐          ┌──────────┐
   │ WEBFLOW │          │ OPENCODE │          │ UNKNOWN  │
   │ HTML/CSS│          │ JS/TS/Py │          │ fallback │
   │ /JS +   │          │ /Sh/JSON │          │ surface  │
   │ vanilla │          │ + lang   │          │          │
   │ anim    │          │ sub-detect│         │          │
   └─────────┘          └──────────┘          └──────────┘
```

**Detection order** (first match wins):
1. **WEBFLOW** — `src/2_javascript/`, `*.webflow.js`, `wrangler.toml`, or vanilla animation imports (motion.dev/GSAP/Lenis/HLS/Swiper/FilePond)
2. **OPENCODE** — CWD or changed files under `.opencode/` (skill/agent/command/specs/plugin code)
3. **UNKNOWN** — neither matched → disambiguation surface

Within OPENCODE, language sub-detection fires: file extensions + weighted keywords route to JS/TS/Python/Shell/Config standards.

### Key Components

- **`sk-code` root router**: owns two-axis detection (code surface + intent classification), resource loading, phase lifecycle, and verification guidance.
- **Webflow surface**: remains the live application-code route already present in `sk-code` (HTML/CSS/JS, vanilla animation libs, CDN/Cloudflare deployment).
- **OpenCode surface**: absorbs JS, TS, Python, Shell, JSON/JSONC standards from `sk-code-opencode` with language sub-detection, plus gains the full 5-phase lifecycle (Research → Implementation → Code Quality Gate → Debugging → Verification).
- **Deleted placeholder surfaces**: `GO` and `NEXTJS` are removed until backed by real maintained content.
- **Skill advisor integration**: maps code-work prompts to `sk-code`; the advisor no longer needs a separate `sk-code-opencode` entry — OpenCode routing is a surface route within `sk-code`.
- **Review contract**: `sk-code-review` remains the findings-first review baseline; `sk-code` provides surface-specific standards evidence (Webflow patterns or OpenCode language standards) instead of a sibling overlay.

### Data Flow

Prompts enter the runtime skill advisor, which recommends `sk-code` for code work. `sk-code` first detects the code surface (Webflow/OpenCode) from CWD + changed files, then classifies intent via weighted keyword scoring, then loads surface-specific resources. For OPENCODE, language sub-detection (file extension + keywords) selects JS/TS/Python/Shell/Config standards. Review agents load `sk-code-review` for findings format and `sk-code` for surface-specific standards evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code-opencode` skill tree | OpenCode standards sibling skill | Merge into `sk-code`, then remove/archive | `rg -n 'sk-code-opencode' .opencode/skills/sk-code .opencode/skills/sk-code-opencode` |
| `sk-code` Go/NextJS branches | Placeholder stacks | Remove folders and route entries | `find .opencode/skills/sk-code -path '*go*' -o -path '*nextjs*'` |
| Runtime agents | Dispatch and review instructions | Rewrite baseline/overlay references | `rg -n 'sk-code-\\*|sk-code-opencode|GO, NEXTJS' .opencode/agent .claude/agents .codex/agents .gemini/agents` |
| `spec_kit` command YAMLs | Auto/confirm workflow definitions | Remove overlay phase names | `rg -n 'sk-code-\\*|overlay' .opencode/commands/spec_kit` |
| Skill advisor code/tests | Recommends and tests live skills | Replace `sk-code-opencode` with new `sk-code` route expectations | Targeted vitest and regression fixture checks |
| READMEs/install guides | User-facing inventory | Update skill count, table entries, and examples | `rg -n 'sk-code-opencode|sk-code-\\*' README.md .opencode/install_guides .opencode/skills/README.md` |
| Generated metadata | Skill graph and graph metadata | Regenerate or patch after content move | Compare `skill-graph.json`, `description.json`, `graph-metadata.json` |

Required inventories:
- Same-class producers: `rg -n 'sk-code-opencode|sk-code-\\*|GO|NEXTJS|React|Next\\.js' .opencode .codex .claude .gemini AGENTS.md README.md`.
- Consumers of changed skill ID: `rg -n 'sk-code-opencode' . --glob '!**/z_archive/**' --glob '!**/scratch/**'`.
- Matrix axes: runtime (`opencode`, `claude`, `codex`, `gemini`), surface (`agent`, `command`, `skill`, `advisor`, `doc`, `metadata`), artifact status (`live`, `generated`, `historical`), route (`webflow`, `opencode`, `unknown`).
- Algorithm invariant: after deletion, no live path should instruct agents or advisor code to load `sk-code-opencode`; historical references must be explicitly classified.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Freeze Scope

- [x] Confirm user approval to implement.
- [x] Re-run exact reference inventory from `resource-map.md`.
- [x] Delete historical changelogs (`sk-code-opencode/changelog/v1.*.md`, 13 files; removed with obsolete skill directory).
- [x] Create a temporary scratch inventory if needed.

### Phase 2: Merge OpenCode Route into `sk-code`

- [x] Rewrite `sk-code/SKILL.md` with two-axis detection architecture (Code Surface → Intent Classification).
- [x] Rename `references/router/stack_detection.md` → `code_surface_detection.md`, add OPENCODE detection + language sub-detection.
- [x] Move `sk-code-opencode/references/{shared,javascript,typescript,python,shell,config}` into `sk-code/references/opencode/`.
- [x] Move `sk-code-opencode/assets/checklists/*` into `sk-code/assets/opencode/checklists/`.
- [x] Move `verify_alignment_drift.py` and `test_verify_alignment_drift.py` into `sk-code/scripts/`.
- [x] Add OPENCODE entries to resource maps and verification guidance.
- [x] Add language sub-detection route within OPENCODE surface (file extension + keyword weights → JS/TS/Python/Shell/Config).
- [x] Update `resource_loading.md`, `intent_classification.md`, and `phase_lifecycle.md`.
- [x] Update `sk-code/README.md`, `description.json`, and `graph-metadata.json`.

### Phase 3: Remove Go and React/NextJS Branches

- [x] Remove `sk-code/references/go` and `sk-code/assets/go`.
- [x] Remove `sk-code/references/nextjs` and `sk-code/assets/nextjs`.
- [x] Remove `references/router/cross_stack_pairing.md`.
- [x] Remove Go/NextJS route constants, resource-map entries, keyword triggers, and verification commands from `SKILL.md`.
- [x] Reword public `@code` docs to generic `sk-code` router language while keeping surface specifics inside `sk-code`.

### Phase 4: Rewrite Downstream Contracts

- [x] Update four runtime `code`, `review`, `deep-review`, `orchestrate`, and `multi-ai-council` agent surfaces where they mention overlays or removed stacks.
- [x] Update `speckit_complete_*` and `speckit_implement_*` YAML assets.
- [x] Update CLI skills that teach baseline plus overlay dispatch.
- [x] Update `sk-code-review` contract and references.
- [x] Update READMEs and install guides.

### Phase 5: Advisor and Generated Metadata

- [x] Update `skill_advisor` scorer lanes: `sk-code-opencode` entry removed; OpenCode code prompts route to `sk-code`.
- [x] Update fixtures and tests that expected advisor briefs containing `sk-code-opencode`.
- [x] Regenerate `skill-graph.json`.
- [x] Regenerate telemetry JSONL (`compliance.jsonl`, `smart-router-measurement-results.jsonl`).
- [x] Refresh skill graph metadata and descriptions.
- [x] Delete `sk-code-opencode/` directory after live references were verified clean.

### Phase 6: Verification

- [x] Run exact reference checks for `sk-code-opencode` (remaining matches are historical/spec-folder identifiers).
- [x] Run exact reference checks for `sk-code-*` overlay language.
- [x] Run exact `sk-code` route search for removed `GO` and `NEXTJS` support claims.
- [x] Run spec validation.
- [x] Run targeted advisor/hook vitest suites.
- [x] Run moved verifier tests (`test_verify_alignment_drift.py`).
- [x] Run skill graph/advisor metadata checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Exact reference | Removed skill ID and overlay contract | `rg -n 'sk-code-opencode|sk-code-\\*|overlay skill' ...` |
| Spec validation | This packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger --strict` |
| Advisor unit | Skill advisor scoring and hook brief output | Existing vitest tests under `.opencode/skills/system-spec-kit/mcp_server/**` |
| Verifier unit | Moved alignment verifier | Python test currently at `sk-code-opencode/scripts/test_verify_alignment_drift.py` |
| Runtime docs parity | Agent files across OpenCode, Claude, Codex, Gemini | `rg`, diff review, and synchronized wording checks |
| Manual | Skill routing behavior described to users | Read `sk-code/SKILL.md`, README, and `sk-code-review` report template as an end user |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| User approval to implement | Process | Green | User approved implementation; packet is no longer plan-only |
| Skill advisor tests | Internal | Green | Focused advisor/router suite passed |
| Runtime agent parity | Internal | Green | Runtime agent mirrors updated and targeted wording scan is clean |
| Historical artifact policy | Decision | Green | Changelogs deleted; telemetry regenerated; spec-history references classified |
| Metadata generation scripts | Internal | Green | Skill graph and descriptions refreshed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor or agent tests fail because `sk-code` route behavior is incomplete, or exact searches show live `sk-code-opencode` dependencies after deletion.
- **Procedure**: Revert runtime edits as one change set, restore `sk-code-opencode` folder if deleted, restore advisor skill graph and fixtures, then rerun exact search and targeted tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 Scope Decision
        |
        v
Phase 2 Merge OpenCode Route ---> Phase 3 Remove Go/NextJS
        |                                  |
        v                                  v
Phase 4 Rewrite Contracts --------> Phase 5 Advisor Metadata
        \                                  /
         +------------ Phase 6 Verify ----+
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User approval completed | All implementation phases |
| Merge OpenCode Route | Setup | Contract rewrite, advisor rewrite |
| Remove Go/NextJS | Setup | Agent supported-stack rewrite |
| Rewrite Contracts | Merge and removal decisions | Verification |
| Advisor Metadata | Merge route name | Verification |
| Verify | All implementation phases | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventory refresh | Medium | 1-2 hours |
| Merge OpenCode route | High | 4-8 hours |
| Remove Go/NextJS placeholders | Medium | 2-4 hours |
| Rewrite downstream contracts | High | 4-8 hours |
| Advisor and metadata updates | High | 4-8 hours |
| Verification | High | 2-4 hours |
| **Total** | | **17-34 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Snapshot exact search output before implementation.
- [x] Keep `sk-code-opencode` deletion as the last step.
- [x] Do not regenerate metadata until content paths settle.

### Rollback Procedure

1. Revert the merge commit or implementation patch.
2. Restore `sk-code-opencode` folder if it was removed.
3. Restore advisor fixtures and skill graph.
4. Re-run exact references and targeted advisor tests.
5. Re-open this packet with the failing surface noted.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git revert plus metadata regeneration.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
sk-code-opencode resources
        |
        v
sk-code OpenCode route -----> skill advisor route/tests
        |                              |
        v                              v
agent and command contracts ----> exact reference verification
        ^
        |
Go/NextJS branch removal
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `sk-code` route merge | Route name decision | New OpenCode standards branch | Advisor rewrite |
| Go/NextJS removal | Approved scope | Smaller supported-stack set | Agent docs rewrite |
| Agent/command rewrite | New `sk-code` route contract | Runtime-safe instructions | Completion |
| Advisor rewrite | New skill graph shape | Correct recommendations | Completion |
| Docs rewrite | Skill inventory decision | User-facing single-skill story | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Approve implementation and historical policy** - completed - CRITICAL
2. **Merge OpenCode resources into `sk-code`** - completed - CRITICAL
3. **Rewrite skill advisor expectations** - completed - CRITICAL
4. **Rewrite runtime agents and review contract** - completed - CRITICAL
5. **Run reference and test verification** - completed - CRITICAL

**Total Critical Path**: completed after approval.

**Parallel Opportunities**:
- Go/NextJS removal ran alongside README/install guide updates after scope approval.
- Runtime-specific agent rewrites can be split by runtime if write ownership is carefully separated.
- Advisor tests and docs reference checks can run in parallel after the new route name is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Plan approved | Completed: user confirms implementation may begin |
| M2 Single-skill route exists | Completed: `sk-code` contains OpenCode route docs/resources |
| M3 Placeholder stacks removed | Completed: no `GO` or `NEXTJS` support claim remains in `sk-code` live docs |
| M4 Reference contracts updated | Completed: agents, commands, review skill, and docs no longer require `sk-code-*` overlays |
| M5 Advisor aligned | Advisor code/tests no longer use `sk-code-opencode` as live expected skill |
| M6 Verified | Exact references and targeted tests pass or historical refs are documented |
<!-- /ANCHOR:milestones -->
