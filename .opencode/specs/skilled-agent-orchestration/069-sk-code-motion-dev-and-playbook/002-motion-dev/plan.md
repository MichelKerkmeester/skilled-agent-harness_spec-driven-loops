---
title: "Implementation Plan: sk-code Motion.dev Assets and References"
description: "Plan for building cross-stack motion.dev reference docs and reusable asset snippets from official Motion documentation plus in-repo usage patterns."
trigger_phrases:
  - "sk-code motion.dev plan"
  - "002-motion-dev plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/002-motion-dev"
    last_updated_at: "2026-05-05T08:08:41Z"
    last_updated_by: "cli-codex"
    recent_action: "Defined Packet 2 implementation sequence"
    next_safe_action: "Create motion_dev docs/assets and validate"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/sk-code/references/motion_dev/"
      - ".opencode/skills/sk-code/assets/motion_dev/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-code Motion.dev Assets and References

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation and vanilla JavaScript snippets |
| **Framework** | sk-code reference/asset package |
| **Storage** | Repository files only |
| **Testing** | Spec-kit strict validation, inventory checks, citation scan |

### Overview
Build a peer `motion_dev/` package for sk-code. The implementation reads official Motion docs, mines current Webflow code for real integration patterns, writes six references plus reusable assets, and verifies the child packet with strict validation and targeted inventories.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase spec read.
- [x] Existing Webflow animation and performance references read for tone and boundary discipline.
- [x] Initial in-repo Motion grep completed across `a_nobel_en_zn/2_javascript/`.
- [x] Official Motion docs consulted for install, animate, sequences, scroll, inView, spring, gestures, layout, accessibility, performance, GSAP comparison, and WAAPI comparison.

### Definition of Done
- [x] All requested references and assets exist. Evidence: final `ls` inventory shows six references, two asset docs, and eight snippets.
- [x] Motion API claims are cited and no `[VERIFY:]` placeholders remain. Evidence: `rg "\\[VERIFY:" ...` returns no matches.
- [x] In-repo examples cite concrete files. Evidence: references mention `nav_dropdown.js`, `testimonial.js`, `link_grid.js`, `link_hero.js`, and play-on-scroll/hover files.
- [x] Strict validation exits 0. Evidence: `validate.sh 002-motion-dev --strict` returned exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference/asset split:
- `references/motion_dev/` owns canonical API, integration, performance, and decision guidance.
- `assets/motion_dev/` owns short install guidance, runnable snippets, and manual-playbook hook entries.
- Webflow-specific behavior remains linked to existing `references/webflow/` documents.

### Key Components
- **Quick start reference**: entry point and import modes.
- **Animate/timeline reference**: core `animate()` and sequence behavior.
- **Scroll/gesture reference**: `scroll()`, `inView()`, `hover()`, and `press()`.
- **Performance reference**: compositing, reduced motion, bundle size, and CWV risk.
- **Decision matrix**: CSS, Motion, GSAP, and WAAPI trade-offs.
- **Integration patterns**: CDN, ESM, Webflow, non-Webflow, and initialization guards.
- **Snippet assets**: reusable JavaScript starts for common motion tasks.

### Data Flow
Operators start at `quick_start.md`, follow deeper references for API context, then copy snippets from `assets/motion_dev/snippets/`. Manual-test operators can lift scenario text from `playbook_entries.md` into Packet 1's playbook category when needed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm allowed write scope and existing empty target folders.
- [x] Read parent spec, Level 2 templates, and style references.
- [x] Mine in-repo Motion usage with `rg`.

### Phase 2: Core Implementation
- [x] Create Level 2 packet docs.
- [x] Create six `references/motion_dev/*.md` files.
- [x] Create install card, playbook entries, and eight snippet files.
- [x] Keep Webflow-specific content as links and citations, not moved content.

### Phase 3: Verification
- [x] Run strict spec validation.
- [x] Verify reference, asset, and snippet inventories.
- [x] Scan for `[VERIFY:]` placeholders.
- [x] Record implementation summary and final line counts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Child spec folder anchors and frontmatter | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Inventory check | Required files and snippet count | `ls`, `find`, `wc -l` |
| Citation check | Placeholder and citation coverage | `rg "\\[VERIFY:"`, manual review |
| Scope check | Allowed paths only | `git status --short` and changed-file review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Official Motion docs | External documentation | Green | API references would need placeholders |
| In-repo Motion usage | Internal source | Green | Local examples would be weaker |
| Existing Webflow references | Internal documentation | Green | Cross-stack boundary would be less clear |
| Spec-kit validator | Internal script | Green | Cannot claim packet validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: strict validation cannot pass after remediation, or Packet 2 is found to have modified Packet 1/3-owned files.
- **Procedure**: remove only the newly created Packet 2 child docs and `motion_dev/` files; leave Packet 1 playbook and Webflow references untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Source reads -> Reference/asset authoring -> Validation and inventory
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source reads | None | Authoring |
| Authoring | Source reads | Verification |
| Verification | Authoring | Packet 3 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source reads | Medium | 45-75 minutes |
| Reference/asset authoring | Medium | 2-4 hours |
| Verification | Medium | 30-60 minutes |
| **Total** | | **3-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Changes are documentation/snippet assets only.
- [x] No production runtime file is modified.
- [x] Packet 1 playbook and Packet 3 metadata surfaces are untouched.

### Rollback Procedure
1. Delete `.opencode/skills/sk-code/references/motion_dev/` files created by Packet 2.
2. Delete `.opencode/skills/sk-code/assets/motion_dev/` files created by Packet 2.
3. Delete or archive the Packet 2 child docs if the packet is cancelled.
4. Re-run strict validation on the parent/child spec folders if docs remain.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
