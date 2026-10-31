---
title: "Implementation Plan: Manifest Entry and Goal Template"
description: "Put a goal document into the documentation-level contract as a lazy add-on and author its gated template, so the durable directive, its binding block and its optional log all have one authored shape."
trigger_phrases:
  - "goal manifest entry"
  - "goal template"
  - "lazy add-on goal"
  - "goal.md.tmpl"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/010-goal-file-addon/001-manifest-and-goal-template"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Add the contract entry and author the template"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
    session_dedup:
      fingerprint: "sha256:5baea6630d61447a26dd6783c0cb98188dfc866b26eacb9f532dac3253bb9b45"
      session_id: "2026-08-29-042-001-manifest-and-goal-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The document is a lazy add-on, not an optional one; the document collector walks lazy and skips optional"
---

# Implementation Plan: Manifest Entry and Goal Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON contract, gated Markdown template, one JavaScript map |
| **Framework** | Level contract resolver and the inline gate renderer |
| **Storage** | None |
| **Testing** | Per-level renders and a resolver probe |

### Overview
The document enters the contract as a lazy add-on so the structure validator collects it when present and stays silent when absent. The template carries all levels in one file behind inline gates, matching every other document in the set, and separates the durable directive from the volatile log by heading so a later validator can measure one without the other.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-driven: the manifest declares the document, the renderer emits it per level, and the mapping ties the two together so drift is detectable.

### Key Components
- **Contract entry**: declares the document, its version, its section gates and the levels that carry it
- **Gated template**: one file, five active levels, durable and log sections separated by heading
- **Document-to-template mapping**: makes the document resolvable, which is what lets template drift be seen at all

### Data Flow
The scaffolder asks the contract for a level's document set, resolves each document to its template, renders it through the gate renderer and writes it into the packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Level contract (policy) | Declares which documents a level carries | update | Lazy listing at five levels |
| Structure validator (consumer) | Collects lazy documents when present | unchanged | Already walks the lazy bucket |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup

Read the contract shape and confirm which buckets the document collector actually walks, so the document lands in one that is read rather than one that only looks right.

### Phase 2: Implementation

Author the template, declare the document in the contract at the five carrying levels, and add the mapping that makes it resolvable.

### Phase 3: Verification

Render at every level including one that should emit nothing, probe the resolver, and scaffold a packet to confirm the document arrives.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Template resolution per level | Resolver probe |
| Integration | Scaffold a packet at each gated level | `create.sh` |
| Manual | Read the rendered document and confirm the durable and log split | Rendered output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Renderer and contract resolver | Internal | Green | Both ship today |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the contract entry disturbs packets that carry no goal document.
- **Procedure**: remove the lazy listing and the mapping entry; the template file becomes inert without them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read the contract shape and the document collector |
| Core Implementation | Medium | Contract entry, template, mapping |
| Verification | Low | Per-level renders and a resolver probe |
| **Total** | | **Part of one session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Remove the lazy listing so no level carries the document
2. Revert the contract, template and mapping changes together
3. Scaffold a packet at each level and confirm the document is absent again
4. Note the reversal in the packet changelog; the document set is operator-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. No existing packet is rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

