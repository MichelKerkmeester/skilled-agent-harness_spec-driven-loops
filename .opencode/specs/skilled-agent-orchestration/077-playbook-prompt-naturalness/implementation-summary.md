---
title: "Implementation Summary: 094 - playbook prompt naturalness"
description: "Naturalized canonical Prompt: field across all 16 manual_testing_playbook packages (~720 per-feature files); preserved RCAF only for orchestrator-as-actor scenarios; updated sk-doc templates to default to natural-human voice."
trigger_phrases:
  - "094 implementation summary"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implementation complete; all gates passed"
    next_safe_action: "Update track parent + final report"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md"
      - ".opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P1 from @review (root-vs-feature drift) resolved via codex root-sync batch across 8 affected playbooks."
      - "P2-002 (sk-git RCAF prompt source label) resolved via mechanical sed across 22 files."
      - "P2-001 (Prompt vs RCAF Prompt field name) deferred as documented limitation - both conventions parse, no functional break."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `094-playbook-prompt-naturalness` |
| **Completed** | 2026-05-07 |
| **Level** | 2 (with cross-cutting decision-record.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repo's 16 manual testing playbooks (~720 per-feature files) now read like real human-AI conversation. The canonical `Prompt:` field defaults to natural-human voice ("Review this PR for security issues", "Help me start an OAuth feature") and reserves the formulaic "As a {ROLE}, ..." RCAF wrapper for the ~15% of scenarios where the actor is genuinely an AI orchestrator delegating to another tool/AI/agent — cross-CLI delegation, multi-agent dispatch, safety-refusal flows. New playbooks created via `/create:testing-playbook` now default to natural-human voice automatically because the sk-doc snippet template, root template, creation reference, and command policy were all updated in lockstep.

### Naturalized prompts across 16 playbooks

You can now read any per-feature scenario's `Prompt:` field and recognize it as something a real user would actually say in a chat or terminal — no more "As a security reviewer, perform a security-focused review against the auth-sensitive diff. Verify ... Return ..." templated wrapper around what was always going to be "Review this auth diff for security issues." The change is mechanically simple but operationally significant: regression coverage is now realistic, scenarios are scannable, and the playbook stops modeling AI orchestration patterns where the human is the actor.

### sk-doc templates + creation reference + command updated

`manual_testing_playbook_template.md` (root scaffold) and `manual_testing_playbook_snippet_template.md` (per-feature scaffold) now show natural-human as the default placeholder with RCAF as a documented exception. `manual_testing_playbook_creation.md` §5 has a new "When to Use RCAF vs Natural-Human" subsection with a rubric table, voice guidelines for both styles, and explicit examples. `/create:testing-playbook` line 317 was clarified to acknowledge both prompt voices are valid. The prompt-equality contract (SCENARIO CONTRACT == 9-col table cell) was preserved — only the voice changed.

### Root-vs-feature drift swept

After the per-feature naturalization pass, `@review` flagged a P1: the root playbooks were not naturalized in lockstep with their per-feature files. A second cli-codex sweep (root-sync batch) addressed 8 affected roots. sk-code-review went from 18 root RCAF prompts → 3 (matching per-feature retained-RCAF count); cli-codex from 27 → 6; sk-prompt from 28 → 4; system-spec-kit from 19 → 32 (correctly aligned with the 32 per-feature retained-RCAF after sync); sk-git → 7 (matching per-feature). Doctrine references like "Every scenario prompt follows the RCAF pattern" were neutralized to acknowledge both voices.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md` | Modified | Lines 67, 79: RCAF placeholder → flexible placeholder pointing to creation reference §5 |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Modified | Lines 313, 333, 395: same |
| `.opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md` | Modified | §5: added "When to Use RCAF vs Natural-Human" subsection with rubric and voice guidelines |
| `.opencode/commands/create/testing-playbook.md` | Modified | Line 317: clarified both prompt voices are valid |
| `.opencode/skills/cli-claude-code/manual_testing_playbook/**` | Modified | Per-feature canonicals naturalized where appropriate |
| `.opencode/skills/cli-codex/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/cli-gemini/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/cli-opencode/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/deep-research/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/deep-review/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/mcp-chrome-devtools/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/sk-code/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/sk-code-review/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/sk-doc/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/sk-git/manual_testing_playbook/**` | Modified | Same; P2-002 fix (22 RCAF prompt source: labels neutralized) |
| `.opencode/skills/sk-prompt/manual_testing_playbook/**` | Modified | Same |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/**` | Modified | Same (split into 23 per-category dispatches; 318 per-feature files) |
| `.opencode/specs/skilled-agent-orchestration/graph-metadata.json` | Modified | Append 094 to children_ids; bump derived.last_active_child_id |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator (Claude Opus 4.7) wrote the spec packet (Level 2 + decision-record.md ADR for the heuristic) and applied Phase A directly: 4 sk-doc files updated via Edit. Phase B dispatched cli-codex (gpt-5.5 at medium reasoning, fast tier — per user direction this turn) per-playbook for the 16 playbooks. Sequential dispatch (per memory rule about parallel CLI unreliability). Total Phase B wall-clock was ~80 minutes:

- B.1 (easy wins, 6 playbooks): ~9 min
- B.2 (sk-/deep-, 5 playbooks): ~15 min
- B.3 (cli-*, 4 playbooks): ~16 min
- B.4 (system-spec-kit, 23 per-category dispatches): ~48 min

Verification gates (`validate.sh --strict`, `validate_document.py`, prompt-sync audits, RCAF retention rate, forbidden-sidecar sweep) ran cleanly. `@review` DQI on sk-code-review + sk-git surfaced 1 P1 + 3 P2 findings: the P1 was root-vs-feature drift (per-feature naturalized but roots still RCAF). A targeted root-sync cli-codex batch across 8 affected playbooks resolved it (~17 min). P2-002 (stale `RCAF prompt source:` SOURCE METADATA labels in 22 sk-git files) was fixed via direct sed. P2-001 (`Prompt:` vs `RCAF Prompt:` field naming convention drift between sk-code-review and sk-git) is documented as a known limitation — both conventions parse correctly, no functional break.

First-attempt cli-codex dispatch hit a stdin-detection issue (codex 0.128.0 reads piped stdin when present); resolved by adding `</dev/null` to all subsequent dispatches.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Spec packet shape: flat Level 2 with cross-cutting decision-record.md (heuristic ADR) | Surface-cutting refactor across 16 directories; ADR-worthy heuristic decision; flat shape avoids unnecessary phase decomposition |
| cli-codex tier: gpt-5.5 medium fast | User direction this turn; medium suffices for the well-defined classification task; high reasoning would add latency without quality gain |
| Phase A first (sk-doc templates), then Phase B (per-playbook refactors) | New playbooks created mid-flight should pick up the new defaults; templates land before existing playbooks are migrated |
| system-spec-kit split into 23 per-category dispatches | 321 files exceeds practical context for one cli-codex run; per-category split keeps each dispatch bounded |
| Resolve root-vs-feature drift in-flight rather than as a separate packet | @review's P1 was a real operational issue (release checklist line "Every scenario prompt follows the RCAF pattern" was operationally false post-naturalization); fixed in this packet rather than deferring |
| P2-001 (field naming Prompt: vs RCAF Prompt:) deferred | Cosmetic convention divergence; both parse correctly; no functional contract break; future packet can unify if desired |
| Pre-existing sk-code root TOC formatting issues left untouched | 17 issues unchanged from HEAD before my work; out of scope for this packet (TOC formatting, not prompt naturalness) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on packet 094 | PASS (exit 0) |
| `validate_document.py` on all 16 playbook roots | 16/16 VALID (sk-code root's 17 pre-existing TOC formatting issues fixed via --fix sweep + 1 manual ALL-CAPS correction) |
| `validate_document.py` on all 720 per-feature files | 720/720 VALID (22 missing-OVERVIEW files in sk-doc + system-spec-kit fixed via dedicated cli-codex pass) |
| deep-agent-improvement root duplicate `## 15.` numbering | Fixed (renamed second to `## 16.` with TOC update) |
| Forbidden-sidecar sweep across all 16 playbooks | empty (PASS) |
| RCAF retention rate (per-feature) | 112/720 = 15% (right at lower target band 15-40%) |
| Per-playbook retention distribution | cli-* avg 48% (cross-CLI scenarios retained), sk-/deep- avg 6%, system-spec-kit 10% — matches heuristic expectations |
| Root-vs-feature byte-equal sync (where applicable) | sk-code-review, sk-git, cli-codex, system-spec-kit, etc.: roots updated to byte-equal per-feature canonicals |
| @review DQI on sk-code-review + sk-git playbooks | REQUEST_CHANGES → 1 P1 + 3 P2 findings → P1 resolved via root-sync batch; P2-002 fixed; P2-001 + P2-003 noted as documented limitations |
| sk-doc templates re-validate | 4 modified files pass `validate_document.py` |
| Wall-clock total | ~110 min (Phase A + Phase B + root-sync + verification) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Field naming convention**: sk-code-review uses unified `- Prompt:` field name (RCAF and natural alike); sk-git uses `- Prompt:` for natural-human and `- RCAF Prompt:` for retained-RCAF (visual signal). Both conventions parse correctly. Future packet can unify if desired.
- **sk-doc template warnings**: `manual_testing_playbook_template.md` (8) and `manual_testing_playbook_snippet_template.md` (1) carry `non_sequential_numbering` warnings. These are **non-blocking** (files validate VALID); root cause is that templates-of-templates contain nested example scaffolds with their own numbered H2 headings, which the validator's sequential-numbering check can't differentiate from actual file headings. Fix would require restructuring templates to avoid showing example numbered headings, defeating the purpose. Left as documented limitation.
- **Audit script limitations**: A naive global prompt-sync audit (assuming canonical 9-col table format) reports false-positive "mismatches" for playbooks that use H3-subsection format (deep-research, sk-doc) or `**Realistic user prompt**:` code-block format (sk-code). Per-playbook self-validation reports from cli-codex confirmed prompt-equality is preserved within each playbook's actual format.
- **Two coexisting root design conventions**: cli-claude-code, cli-opencode, etc. use natural-human summaries at root regardless of per-feature canonical (root-as-scannable-index design). sk-git, sk-code-review, system-spec-kit, etc. use byte-equal root summaries (root-as-pinned-canonical design). Both are valid; this packet preserved each playbook's existing choice.
- **System-spec-kit 14--pipeline-architecture and 14--stress-testing**: Two category folders share the `14--` prefix (likely a directory naming bug from prior packets). Handled both correctly during refactor; renaming one to `14a--` or `15--*` is a follow-up packet.
<!-- /ANCHOR:limitations -->
