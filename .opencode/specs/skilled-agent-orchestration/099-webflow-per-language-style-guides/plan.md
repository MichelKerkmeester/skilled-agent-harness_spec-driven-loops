---
title: "Implementation Plan: Refactor sk-code Webflow style guides to per-language structure"
description: "Section-by-section migration map from five monolithic standards/ files into a per-language tree (javascript/, css/, html/, shared/) with atomic routing update."
trigger_phrases:
  - "099 plan"
  - "webflow refactor plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/099-webflow-per-language-style-guides"
    last_updated_at: "2026-05-09T17:55:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Restructured plan.md to template-compliant Level 3 anchor layout"
    next_safe_action: "Run final strict validate"
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "099-plan-restructure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Refactor sk-code Webflow style guides to per-language structure

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs + sk-code routing config |
| **Framework** | sk-code skill (`.opencode/skills/sk-code/`) |
| **Storage** | File system (`.opencode/skills/sk-code/references/webflow/`) |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` + opencode probe dispatch |

### Overview

Pure structural refactor: split 5 monolithic standards docs (3,831 lines mixing JS+CSS+HTML rules) into 10 per-language docs under `webflow/{javascript,css,html,shared}/`, mirroring the opencode-side reference tree. No rule semantics change. Atomically update `SKILL.md` description in the same commit window so dispatches do not break. DELETE source files (no archive, no stub). Implementation executor: `opencode-go/deepseek-v4-pro --variant high`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- All 5 source files have been read in full and the per-section migration map is recorded
- Spec folder exists with description.json + graph-metadata.json (Gate 3 satisfied)
- Implementation executor selected and pre-flight verified (opencode-go/deepseek-v4-pro reachable)

### Definition of Done
- All 10 new files exist with sk-doc-template-compliant structure
- All 5 source files DELETED + empty `webflow/standards/` dir removed
- All 25+ cross-references updated; repo-wide grep `webflow/standards/code_*` returns ZERO active routing hits
- 3 probe dispatches PASS (SC-001 CSS-only routing, SC-002 JS-only routing, SC-004 codegen)
- Strict validate exits 0
- implementation-summary.md authored with REQ + SC status + KNOWN LIMITATIONS
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Per-language sub-keying inside surface-keyed reference tree.** The smart router resolves resources by `references/<surface>/<language>/<role>.md`. Before this packet: WEBFLOW had a flat `references/webflow/standards/code_*.md` layout that broke the per-language convention and forced models to load mixed-language content. After: WEBFLOW mirrors OPENCODE with `references/webflow/{javascript,css,html,shared}/{style_guide,quality_standards,quick_reference}.md`.

This is sk-doc smart_router Pattern 3 (Extensible Routing Key) applied at two levels: surface (top-level key) and language (sub-key).

### Key Components

| Component | Path | Role |
|---|---|---|
| Per-language style guides | `references/webflow/{javascript,css,html}/style_guide.md` | Naming, formatting, file structure rules — language-specific |
| Per-language quality standards | `references/webflow/{javascript,css}/quality_standards.md` | Defensive patterns + per-language enforcement — language-specific |
| Per-language quick references | `references/webflow/{javascript,css}/quick_reference.md` | Snippets, one-liners, decision matrices — language-specific |
| Cross-language rules | `references/webflow/shared/cross_language_rules.md` | File naming, comment principles, banner format, platform prefixes — applies to all languages |
| Enforcement workflow | `references/webflow/shared/enforcement.md` | Pre-completion gate workflow + per-language gate selection |
| Dev workflow | `references/webflow/shared/dev_workflow.md` | DevTools, logging, testing, automation, error patterns, browser compat |
| sk-code SKILL.md | `.opencode/skills/sk-code/SKILL.md` | Resource-domains description (line 140) updated to reflect new sub-structure |
| Smart router internals | `.opencode/skills/sk-code/references/router/resource_loading.md` | NO change needed — uses generic key-derived patterns |

### Data Flow

```
Task arrives → sk-code SKILL.md surface detection (CWD + target file precedence)
                ↓
              SURFACE = WEBFLOW (or OPENCODE / UNKNOWN)
                ↓
              Language sub-detection (file extension + keyword)
                ↓
              LANG = JAVASCRIPT | CSS | HTML
                ↓
              Load: references/webflow/<LANG>/{style_guide,quality_standards,quick_reference}.md
                  + references/webflow/shared/cross_language_rules.md
                  + references/webflow/shared/enforcement.md (when at completion gate)
                  + references/webflow/implementation/<intent_pattern>.md (per intent)
                ↓
              Apply rules + run verification command + cite tuple in output
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (read source files + build migration map)

For each of the five source files, classify every section into a destination bucket. Record the map in this file BEFORE writing any new files. This is the single source of truth for the migration.

**Authoritative migration map** (built from grep'd section headings; full content review during execution may surface edge cases that need this table updated):

#### `code_style_guide.md` (765 lines)
| Source section | Lines | Destination |
|---|---|---|
| §1 Overview | 12-41 | `shared/cross_language_rules.md` (purpose) + summary block per per-language file |
| §2.JS-Identifiers | 44-99 | `javascript/style_guide.md` |
| §2.SemanticPrefixes | 69-99 | `javascript/style_guide.md` |
| §2.FileNaming | 100-115 | `shared/cross_language_rules.md` |
| §2.CSS-Naming-BEM | 116-129 | `css/style_guide.md` |
| §3.JS-FileHeader-MANDATORY | 132-161 | `javascript/style_guide.md` |
| §3.SectionHeaders-Numbered | 162-190 | `javascript/style_guide.md` (JS variant) + `css/style_guide.md` (CSS variant separately) |
| §3.StandardFileOrg | 191-259 | `javascript/style_guide.md` (JS-specific) |
| §4 Formatting | 260-420 | `javascript/style_guide.md` (all JS-specific) |
| §5.Principles | 423-431 | `shared/cross_language_rules.md` |
| §5.FileHeaderFormat | 432-441 | `shared/cross_language_rules.md` |
| §5.SectionHeaderFormat | 442-451 | `shared/cross_language_rules.md` |
| §5.FunctionPurposeComments | 452-469 | `javascript/style_guide.md` |
| §5.InlineComments-WHY-not-WHAT | 470-514 | `shared/cross_language_rules.md` |
| §5.PlatformSpecificComments | 515-538 | `shared/cross_language_rules.md` |
| §5.JSDoc | 539-562 | `javascript/style_guide.md` |
| §5.DebugLogging | 563-582 | `javascript/style_guide.md` |
| §6 CSS Style Conventions | 583-697 | `css/style_guide.md` |
| §7 Quick Reference Checklist | 698-743 | `javascript/quick_reference.md` (JS items) + `css/quick_reference.md` (CSS items) |
| §8 Related Resources | 744-end | Per-language `style_guide.md` footers + `shared/cross_language_rules.md` index |

#### `code_style_enforcement.md` (663 lines)
| Source section | Lines | Destination |
|---|---|---|
| §1 Overview | 21-47 | `shared/enforcement.md` |
| §2 File Header Enforcement | 48-96 | `shared/enforcement.md` |
| §3 Section Organization Enforcement | 97-161 | `shared/enforcement.md` |
| §4 Comment Quality Enforcement | 162-236 | `shared/enforcement.md` |
| §5 Naming Convention Enforcement | 237-314 | `javascript/quality_standards.md` |
| §6 Initialization Pattern Enforcement | 315-386 | `javascript/quality_standards.md` |
| §7.1 CSS Custom Property Naming | 387-435 | `css/quality_standards.md` |
| §7.2 CSS Attribute Selector | 436-478 | `css/quality_standards.md` |
| §7.3 BEM Naming Enforcement | 479-522 | `css/quality_standards.md` |
| §7.4 Animation Property Enforcement | 523-594 | `css/quality_standards.md` |
| §8 Enforcement Workflow | 595-644 | `shared/enforcement.md` |
| §9 Related Resources | 645-end | `shared/enforcement.md` footer |

#### `code_quality_standards.md` (1,072 lines)
| Source section | Lines | Destination |
|---|---|---|
| §1 Overview | 12-37 | `shared/cross_language_rules.md` (intro) + `javascript/quality_standards.md` |
| §2 Initialization Pattern (CDN-Safe) | 38-102 | `javascript/quality_standards.md` |
| §3 DOM Safety Patterns | 103-159 | `javascript/quality_standards.md` |
| §4 Error Handling Patterns | 160-224 | `javascript/quality_standards.md` |
| §5 Async Patterns | 225-276 | `javascript/quality_standards.md` |
| §6 Observer Patterns | 277-337 | `javascript/quality_standards.md` |
| §7 Validation Patterns | 338-390 | `javascript/quality_standards.md` |
| §8 Performance Patterns | 391-448 | `javascript/quality_standards.md` |
| §9 Animation Quality Patterns | 449-481 | `javascript/quality_standards.md` (refs Motion.dev) |
| §10 CSS Quality Patterns | 482-541 | `css/quality_standards.md` |
| §11 State Management Patterns | 543-598 | `javascript/quality_standards.md` |
| §12 Cleanup/Destroy Patterns | 599-705 | `javascript/quality_standards.md` |
| §13 Shared Document Listener Pattern | 706-820 | `javascript/quality_standards.md` |
| §14 WeakMap/WeakSet Caching | 821-999 | `javascript/quality_standards.md` |
| §15 Quick Reference Checklist | 1000-1057 | Split: JS items → `javascript/quick_reference.md`; CSS items → `css/quick_reference.md` |
| §16 Related Resources | 1058-end | Per-file footers |

#### `quick_reference.md` (710 lines)
| Source section | Lines | Destination |
|---|---|---|
| §1 Overview | 12-21 | `shared/dev_workflow.md` (intro) |
| §2 Navigation Decision Tree | 22-58 | `shared/dev_workflow.md` |
| §3 Common Commands | 59-252 | `shared/dev_workflow.md` |
| §4 Debugging Checklist | 253-283 | `shared/dev_workflow.md` |
| §5 Verification Checklist | 284-311 | `shared/dev_workflow.md` |
| §6 Code Snippets | 312-359 | `javascript/quick_reference.md` |
| §7 Key Principles | 360-378 | `shared/cross_language_rules.md` |
| §8 Related Resources | 379-402 | Per-file footers |
| §9 Decision Matrix | 403-421 | `shared/dev_workflow.md` |
| §10 CSS Patterns | 422-555 | `css/quick_reference.md` |
| §11 Common One-Liners | 556-704 | `javascript/quick_reference.md` |
| §12 Related Resources | 705-end | Per-file footers |

#### `shared_patterns.md` (621 lines)
| Source section | Lines | Destination |
|---|---|---|
| §1 Overview | 12-21 | `shared/dev_workflow.md` |
| §2 DevTools Quick Reference | 22-100 | `shared/dev_workflow.md` |
| §3 Logging Standards | 101-173 | `shared/dev_workflow.md` |
| §4 Testing Requirements | 174-223 | `shared/dev_workflow.md` |
| §5 Automation Patterns | 224-395 | `shared/dev_workflow.md` |
| §6 Error Patterns | 396-499 | `shared/dev_workflow.md` |
| §7 Browser Compatibility | 500-553 | `shared/dev_workflow.md` |
| §8 Quick Command Reference | 554-608 | `shared/dev_workflow.md` |
| §9 Related Resources | 609-end | `shared/dev_workflow.md` footer |

### Phase 2: Core Implementation (author 10 new files)

Order (parallelizable within each batch):

1. `shared/cross_language_rules.md` (foundation — others reference it)
2. `shared/dev_workflow.md`, `shared/enforcement.md` (depend only on shared)
3. `javascript/style_guide.md`, `css/style_guide.md`, `html/style_guide.md` (depend on shared)
4. `javascript/quality_standards.md`, `css/quality_standards.md` (depend on style_guides)
5. `javascript/quick_reference.md`, `css/quick_reference.md` (depend on quality_standards)

Each new file MUST: open with markdown frontmatter (title, description, trigger_phrases); include a `<!-- MIGRATED FROM: webflow/standards/<file>.md §<N> on 2026-05-09 -->` provenance comment; use semantic-equivalent content from the source — no rewrites that change rule meaning; end with a RELATED RESOURCES section linking to siblings.

### Phase 3: Verification (routing + cross-references + delete + verify)

3a. `.opencode/skills/sk-code/SKILL.md` — update line 140 resource-domains description to reflect per-language sub-structure (no other SKILL.md changes needed; routing uses generic patterns)
3b. `.opencode/skills/sk-code/references/router/resource_loading.md` — NO change needed (uses generic key-derived patterns)
3c. Three external cross-refs (`references/universal/code_style_guide.md`, `manual_testing_playbook/07--cross-stack-routing/005-snippet-reuse-cross-stack.md`, `assets/webflow/checklists/code_quality_checklist.md`) — replace path strings via bulk sed
3d. Repo-wide grep `webflow/standards/code_*` returns ZERO hits in active routing
3e. `rm` 5 source files + `rmdir` empty `standards/` directory
3f. Run strict validate
3g. Three probe dispatches (SC-001 CSS-only, SC-002 JS-only, SC-004 codegen)
3h. Author implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## 4a. PHASE DEPENDENCIES

```
Phase 1 (read+map) ──BLOCKING──▶ Phase 2 (author files)
                                       │
                                       └─batch-internal parallelism OK
                                                    │
Phase 2 ──BLOCKING──▶ Phase 3 (routing + delete + verify)
                            │
                            └─3a..3d sequential; 3e after 3d; 3f-3h sequential after 3e
```

Phase 1 is sequential and BLOCKING because the migration map drives every Phase 2 dispatch packet. Phase 2 can parallelize within each batch (e.g. 4 dispatches running simultaneously), but cross-batch ordering matters because each batch's files reference the prior batch's outputs. Phase 3 is strictly sequential because routing must point at new paths BEFORE the old paths are deleted (ADR-003).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 4b. EFFORT ESTIMATION

| Phase | Approach | Wall-clock | Cost |
|---|---|---|---|
| Phase 1 (read+map) | Claude reads 5 source files | ~5 min | $0 |
| Phase 2 (author 10 files) | opencode-go/deepseek-v4-pro --variant high, 4 parallel waves | ~25 min | ~$0 (cache-heavy) |
| Phase 3 (routing+cross-refs+delete) | Claude sed + Edit + rm | ~5 min | $0 |
| Phase 5 (validate+probe×3+summary) | strict validate + 3 GPT 5.5 probe dispatches | ~10 min | ~$0 |
| **Total** | | **~45 min** | **~$0** |

The cost is effectively zero because: (a) deepseek-v4-pro dispatches reuse the prompt cache aggressively across the 10 file authorings; (b) the 3 GPT 5.5 probe dispatches are small (~1k tokens of generated code/analysis each).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## 4c. DEPENDENCY GRAPH

```
Source files (5)              ──reads──▶ Migration map (in this plan.md §4)
                                                  │
                                                  ▼
                                           Phase 2 dispatch packets (10)
                                                  │
                                                  ▼
                                           opencode-go/deepseek-v4-pro
                                                  │
                                                  ▼
                                           New per-language files (10)
                                                  │
                            ┌─────────────────────┼─────────────────────┐
                            ▼                     ▼                     ▼
                    SKILL.md line 140    Cross-ref sweep        sk-doc template
                    (description fix)    (25+ files)            alignment (OVERVIEW)
                            │                     │                     │
                            └─────────────────────┴─────────────────────┘
                                                  │
                                                  ▼
                                           rm sources + rmdir standards/
                                                  │
                                                  ▼
                                           strict validate + 3 probes
                                                  │
                                                  ▼
                                           implementation-summary.md
```

External dependencies: `opencode-go` provider must be configured (deepseek-v4-pro model available); `openai` provider must be configured for GPT 5.5 probes; system-spec-kit validate.sh must be present.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 4d. CRITICAL PATH

The critical path is **Phase 1 → first Phase 2 dispatch → SKILL.md routing update → first source-file deletion → first probe dispatch**. Bottlenecks:

- Phase 1: bounded by source-file size (3,831 lines total). Sequential reads.
- Phase 2 batch 1 (`shared/cross_language_rules.md`): blocking for all subsequent batches because they reference it.
- Phase 3 step 3a (SKILL.md update): must precede deletions (ADR-003 phase ordering invariant).
- Phase 5 probe dispatch SC-004 (codegen): the longest single-dispatch step (~5 min) and the most informative — provides the empirical answer to the original hunch.

Compression opportunities: dispatching Phase 2 batches 2-3 in parallel (3-4 simultaneous deepseek calls) cuts ~15 min off the wall-clock vs sequential dispatch. This was used in execution.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 4e. MILESTONES

| ID | Milestone | Gate |
|---|---|---|
| M1 | Phase 1 complete — migration map fixed | All 5 source files read; per-section destinations recorded |
| M2 | Phase 2 batch 1 complete — `shared/cross_language_rules.md` exists | File present + frontmatter + provenance comment + content semantic-equivalent to source sections |
| M3 | Phase 2 complete — all 10 new files exist | Total new content ~4,000 lines; every file passes spot-check |
| M4 | Phase 3 routing complete — SKILL.md updated, cross-refs swept, ZERO active stale refs | `grep -rn "standards/code_*"` returns only provenance-comment hits |
| M5 | Phase 4 complete — `webflow/standards/` dir physically deleted | `find webflow/standards -type f` returns "No such file or directory" |
| M6 | Phase 5 complete — strict validate exits 0 + 3 probes PASS + implementation-summary authored | Packet status = COMPLETE |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Probe-based verification (the actual functional tests)

This packet's correctness is verified by 3 black-box probe dispatches against `opencode run --model openai/gpt-5.5 --variant medium --format json`:

1. **SC-001 CSS-only routing probe**: dispatched a CSS-only Webflow task; assert that GPT 5.5 loads ONLY `webflow/css/*` + `shared/cross_language_rules.md`, with NO `webflow/javascript/*` bleed.
2. **SC-002 JS-only routing probe**: dispatched a JS-only Webflow task; assert ONLY `webflow/javascript/*` + `shared/*`, with NO `webflow/css/*` or `webflow/html/*` bleed.
3. **SC-004 codegen probe**: dispatched a Webflow card hover effect task (CSS + JS); assert generated code complies with the per-language style guides — banner format, BEM/snake_case naming, IIFE wrapper, INIT_FLAG init pattern, GPU-only animation, prefers-reduced-motion.

Each probe is parsed from the JSON event stream (tool_use sequence + final text). The grading rubric is in the dispatch prompt itself.

### Validate-based verification (the doc-hygiene gate)

`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — must exit 0. Checks: file existence per Level 3 contract, template anchors present, frontmatter validity, sufficiency baseline, section ordering.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### External tools required
- `opencode` v1.14.41 (or compatible) — primary dispatch executor
- `opencode-go` provider configured with `deepseek-v4-pro` model — Phase 2 implementation
- `openai` provider configured with `gpt-5.5` model — Phase 5 probe dispatches
- `bash`, `sed`, `grep`, `python3`, `jq` — Phase 3 cross-ref sweep + Phase 5 probe parsing

### File-system dependencies
- `.opencode/skills/sk-code/references/webflow/standards/*.md` (5 source files) — must exist before Phase 1
- `.opencode/skills/sk-code/SKILL.md` — must be writable for line-140 update
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` — must be present and executable for Phase 5 verification

### Memory / spec dependencies
- Memory rule `feedback_delete_not_archive_or_comment.md` — drives ADR-002 deletion policy
- Memory rule `feedback_stay_on_main_no_feature_branches.md` — packet stays on main, no branch
- sk-doc reference template (`assets/skill/skill_reference_template.md`) — drives the "add OVERVIEW section" follow-up pass
- sk-doc smart_router template (`assets/skill/skill_smart_router.md`) — drives the SKILL.md description update for cross-stack symmetry
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Trigger conditions

Roll back if any of: (a) more than 2 of 3 probe dispatches FAIL with structural errors (wrong file loading, missing files), (b) strict validate fails on a NON-template-anchor issue (e.g. broken frontmatter, missing required file), (c) sk-code dispatches start failing in production after the deletion phase.

### Rollback procedure

```bash
# 1. Restore deleted source files
git checkout HEAD -- .opencode/skills/sk-code/references/webflow/standards/

# 2. Revert SKILL.md description fix
git checkout HEAD -- .opencode/skills/sk-code/SKILL.md

# 3. Revert cross-ref sweep (25+ files)
git checkout HEAD -- \
  .opencode/skills/sk-code/references/universal/code_style_guide.md \
  .opencode/skills/sk-code/manual_testing_playbook/ \
  .opencode/skills/sk-code/assets/webflow/checklists/ \
  .opencode/skills/sk-code/references/webflow/

# 4. Delete the new per-language directories
rm -rf .opencode/skills/sk-code/references/webflow/{javascript,css,html,shared}

# 5. Mark packet status = ROLLED_BACK in description.json
```

The new per-language directories are untracked at the moment of authoring, so step 4's `rm -rf` is the canonical removal — git checkout cannot remove untracked content.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 7a. ENHANCED ROLLBACK (PARTIAL ROLLBACK SCENARIOS)

| Scenario | Partial rollback action |
|---|---|
| One probe FAILS, structural cause | Keep refactor; iterate on the specific file that failed the probe; do not roll back the whole packet |
| Validate fails on template-anchor issue only | Keep refactor; restructure spec docs (this is what packet 099b/this restructure pass does); do not roll back |
| One cross-ref file has a broken link after sweep | Keep refactor; manually fix the specific file's link; do not roll back |
| Provenance-comment damage detected | Keep refactor; re-run the python provenance-restoration pass; do not roll back |
| New per-language file content has a regression vs source | Keep refactor; re-dispatch that single file's authoring task with refined prompt; do not roll back |

Full rollback (per §7) is reserved for situations where the structural premise is wrong — e.g. if the per-language layout actively breaks downstream tooling that depends on the old structure. The 099d codegen probe verified this is NOT the case, so full rollback is not on the table.
<!-- /ANCHOR:enhanced-rollback -->
