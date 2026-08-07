---
title: "Implementation Plan: sk-doc manual-testing-playbook snippet template migration"
description: "Execution plan for migrating the 32 routing-gold snippet files to the per-feature scaffold with a blacklist frontmatter transform and a per-shape body emitter."
trigger_phrases:
  - "playbook migration plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/027-playbook-snippet-template-migration"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author plan"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-playbook-snippet-template-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-doc manual-testing-playbook snippet template migration

<!-- ANCHOR:summary -->
## 1. SUMMARY

Migrate all 32 routing-gold snippet files to the per-feature scaffold. A reviewable migration script applies a blacklist frontmatter transform (drop only proven-dead keys, preserve every gate-critical field) and re-emits the body per detected shape. The template gains the routing-gold fields it omitted. Both playbook gates must stay green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Topology unchanged | `valid=32 blocked=0` | validate-playbook-topology.cjs |
| Package clean | `violations=0` | validate-playbook-package.cjs |
| Frontmatter map | description/stage 32; dropped 0 | grep scan |
| Section shape | SOURCE FILES/METADATA 32; 9-col 0 | grep scan |
| No invention | minimal files prompt-only | diff review |
| Template gap closed | routing-gold fields documented | read + grep |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| 32 files under `manual-testing-playbook/` | Frontmatter normalized, body restructured to the scaffold |
| `manual-testing-playbook-snippet-template.md` | Routing-gold fields added; version 1.8.0.11 to 1.8.0.12 |
| Packet 027 docs | spec, plan, tasks, checklist, decision-record, implementation-summary |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Analysis | Verify field consumers, derive the field map and stage mapping, cluster the four shapes |
| Migration | Run the per-shape migration script over all 32 files |
| Template | Document the routing-gold fields in the snippet template |
| Verification | Topology, package, conformance scan, bijection, validate.sh |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Contract test only. The topology validator and package validator are the authoritative gates and must stay green. A conformance grep scan confirms the field map and section shape. A diff review of the 13 minimal files confirms no invented content. The migration script is content-preserving and was dry-run on one file per shape before applying.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Topology and loader field reads | Dropping a needed field breaks the gate | Blacklist drop; re-run gates |
| Hostile working tree | Files deleted mid-run | Stage and commit in tight succession |
| Template gap | Files cannot match the template | REQ-006 template edit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` the migration commit and the template commit to restore all files exactly. The migration script lives in the session scratchpad and is idempotent, so a re-run reproduces the same output.
<!-- /ANCHOR:rollback -->
