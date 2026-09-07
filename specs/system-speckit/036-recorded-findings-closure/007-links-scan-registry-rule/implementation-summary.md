---
title: "Implementation Summary"
description: "The wikilink scan is now the LINKS_VALID registry rule that every validate run sources, runs in a tenth of a second, and the four broken memory-note links it reported are gone."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/007-links-scan-registry-rule"
    last_updated_at: "2026-09-07T15:05:49Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 008"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:def0916255a59a4cee7c3ff14c52fe07d8382a7e00194d39b7d32c54427b69b2"
      session_id: "scaffold-007-links-scan-registry-rule"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-links-scan-registry-rule |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The wikilink scan had no registry row, so nothing ran it and the skill's own references carried four broken links for months. The script now exposes the orchestrator's `run_check` entry point beside its standalone `main`, and a `LINKS_VALID` row sources it on every validate run. The rule's target is fixed to the system-spec-kit skill that owns the script, whatever packet is being validated, so a broken reference in the skill's workflows fails the skill's own validations and a stranger's link health stays with the hand-run scan. Extraction became a single perl pass over the tree, which took the scan from 5.8 seconds to 0.12 seconds with an identical result set. The four `[[feedback_*]]` links in the rename pattern named memory notes outside the repository and are now inline code.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/rules/check-links.sh` | Modified | `run_check` adapter, single-pass extraction, fixed skill target |
| `runtime/cli/lib/validator-registry.json` | Modified | `LINKS_VALID` row, `operational_runtime`, `warn` |
| `references/workflows/rename-pattern.md` | Modified | Four memory-note wikilinks as inline code |
| `runtime/cli/rules/README.md`, `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` | Modified | The scan is a rule, not standalone-only |
| `README.md`, `ARCHITECTURE.md` | Modified | Forty rules, fourteen operational-runtime |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The old and new scripts were run over the whole `.opencode/skills` tree and their sorted broken-link outputs compared before anything else changed; they matched at seven lines. The adapter was then added, the registry row appended, and nine packets validated strict to watch the rule fire and pass. Every test that reads the registry ran, and the documents that state its size were updated so the count test stays green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fixed target, never the packet | Packets carry no wikilinks by contract; the finding was about the skill's own docs |
| One perl pass, bash resolution | The cost was process spawning, not matching; resolution is a handful of file tests |
| Severity `warn` | Visible on every run without blocking unrelated completions |
| Inline code for memory-note names | A wikilink promises a file in the tree; these files live in a user's memory directory |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Old versus new script over `.opencode/skills` | identical 7-line broken-link set |
| `bash rules/check-links.sh .opencode/skills/system-spec-kit` | exit 0, all wikilinks valid |
| Scan time over 954 markdown files | 0.12 seconds, was 5.8 |
| Registry coverage, help listing, doc count, grep convention, workflow tests | 23 pass |
| `test-validation-system.cjs` | all pass |
| Nine packets `validate.sh --strict`, children 001 to 007, parent, packet 035 | all PASSED with `LINKS_VALID` passing |
| Extended validation suite and `npm run check` | 84 checks PASSED; alignment, import policy and cycle checks pass |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other skills' wikilinks are not validated by the rule.** The standalone run over `.opencode/skills` still reports the `mcp-obsidian` finding; that skill owns it.
2. **The rule warns rather than fails.** Strict mode does not escalate it; a broken link is visible on every run but does not block completion.
<!-- /ANCHOR:limitations -->

---
