---
title: "Implementation Summary: Rule headers, registry coverage and playbook paths"
description: "Every registry rule is proven to run by a test that scaffolds a packet and validates it, which caught a rule reporting an id the registry does not carry; sibling rules name their split in their headers; the one rule without a header block has one; the expired canonical-save grandfather window is gone; four playbook commands point at the tests that exist; the skill's routing claim says what the resource map really covers; and the deep loops' three reaches into the spec-kit runtime are named as contracts."
trigger_phrases:
  - "registry coverage test summary"
  - "what shipped round three"
  - "rule header split"
  - "canonical save allowlist removed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/020-rule-headers-registry-coverage-and-playbook-paths"
    last_updated_at: "2026-09-07T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue the round-three closeout"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/validate-runs-every-registry-rule.vitest.ts"
    session_dedup:
      fingerprint: "sha256:f66546fce141b63dcadc84422eb2dfccc317bc671cf7c83c09bd05428bc1c6b4"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Rule headers, registry coverage and playbook paths

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-rule-headers-registry-coverage-and-playbook-paths |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The overengineering lane's third round audited the validator registry row by row and found six ids named by no test. Rather than add six naming tests, this child adds one test that scaffolds a Level 2 packet, validates it, and asserts every registry id appears in the output; on its first run it failed, because the protocol rule reported `AI_PROTOCOL` while the registry carries `AI_PROTOCOLS`, so validation output had never matched that row. The rule now reports the registry's id and the registry keeps the old spelling as an alias.

### Headers that say where the split is

The presence and level-match rules, the two frontmatter rules, the anchor and grep rules, and the three metadata shape rules each divide one zone by object or by layer; their headers now say so, and the one rule script with no header block has one. The canonical-save rule kept a grandfather allowlist that expired on 2026-05-01 and two branches that could no longer execute; they are gone.

### Commands that run and claims that hold

Four deep-loop playbook commands changed into the spec-kit runtime and ran a path that resolves to a directory that does not exist; they now run the deep-loop runtime's own tests. The skill's routing section promised the resource map emits every manifest leaf when it routes 26 of 45; it now says the map routes a subset and the manifest is the inventory. The three deep-loop surfaces that live inside the spec-kit runtime tree are named as contracts in the integration reference.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/tests/validate-runs-every-registry-rule.vitest.ts` | Create | Scaffolds a Level 2 packet, validates it, asserts every registry id appears |
| `runtime/cli/rules/check-ai-protocols.sh` | Modify | Reports the registry's id |
| `runtime/cli/rules/check-files.sh, check-level-match.sh, check-frontmatter.sh, check-grep-convention.sh, check-graph-metadata-shape.sh, check-description-shape.sh` | Modify | Headers name the sibling and the split |
| `runtime/cli/rules/check-spec-doc-integrity.sh` | Modify | Header block per convention |
| `runtime/cli/rules/check-canonical-save-helper.cjs, check-canonical-save.sh` | Modify | Expired allowlist and its two branches removed |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/*.md, runtime/manual-testing-playbook/fanout/fanout-config-schema.md, runtime/tests/fixtures/council-value/data/README.md` | Modify | Commands point at the deep-loop runtime's tests |
| `SKILL.md` | Modify | The resource map routes a subset; the manifest is the inventory |
| `.opencode/skills/system-deep-loop/runtime/references/integration-points.md` | Modify | Three shared runtime homes named as contracts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every row was re-read in the main checkout first; the placeholder-convention row did not reproduce and is recorded. The coverage test was written before the headers changed, so its first failure was a real finding and not an artifact of the edits. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prove rules run by output, not by name | A test that greps for an id string proves nothing; scaffolding and validating proves the row fires, and it caught a drift on its first run |
| Document sibling splits rather than merge | The pairs divide by object or by layer; a merge would move code across the orchestrator boundary for no defect |
| Graduate the allowlist | The window expired; a branch that cannot execute is a claim the rule makes and cannot keep |
| Record the command-asset merges | Six assets per lifecycle command is a surface design; the placeholder-convention row did not reproduce in the main checkout |
| Correct the routing claim rather than route seventeen files | Their bodies were not read; a claim that is true is the fix the evidence supports |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Registry-coverage suite | 1 test passes after the id fix; 39 of 39 rows seen |
| `bash -n` on eight scripts; `node --check` on the helper | All exit 0 |
| Full runtime project | 104 files, 1,260 tests pass |
| Full CLI project | 139 files, 1,358 tests pass |
| Legacy and validation lanes | the runtime project passed 104 files and 1,260 tests, the CLI project 139 files and 1,358 tests, the legacy lane exit 0, and the validation lane 31 and 83 checks plus the four harnesses with exit 0 |
| `validate.sh --strict --recursive` on the program | 23 × RESULT: PASSED |
| sk-doc validator on touched documents | exit 0 on all 49 touched documents |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Seventeen reference files stay browse-only** the routing sentence now says so; routing each needs a read of its body, which the round did not do.
2. **The lifecycle command assets stay six files** Merging them is a command-surface redesign, recorded with its reason.
<!-- /ANCHOR:limitations -->

---
