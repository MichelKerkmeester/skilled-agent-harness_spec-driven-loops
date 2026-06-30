---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "cli-devin skill shipped 2026-05-15. Fifth cli-* family member; mirrors the contract; documents Devin's unique local-to-cloud handoff. 12 new files + 4 sibling graph-metadata edge additions."
trigger_phrases:
  - "cli-devin shipped"
  - "104 summary"
  - "cli-devin implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/084-cli-devin-creation"
    last_updated_at: "2026-05-15T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Ship initial release"
    next_safe_action: "Save context"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/cli-devin/README.md"
      - ".opencode/skills/cli-devin/references/cloud_handoff.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "104-cli-devin-ship"
      parent_session_id: "104-cli-devin-init"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin --json flag: documented as 'unverified, confirm before automation' in cli_reference.md"
      - "Self-invocation guard env-var prefix: probed DEVIN_* with TODO-verify comment"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 104-cli-devin-creation |
| **Completed** | 2026-05-15 |
| **Level** | 2 |
| **Branch** | main (no feature branch, per operator policy) |
| **Track** | skilled-agent-orchestration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fifth `cli-*` family skill called `cli-devin` lets any AI assistant — running inside Claude Code, Codex, Gemini, OpenCode, or a raw shell — dispatch tasks to Cognition AI's official "Devin for Terminal" Rust CLI as a peer executor. The skill ships the same orchestration contract the other four family members share (smart router with self-invocation guard, Default Invocation block, RULES, Memory Handback Protocol) and documents Devin's unique local-to-cloud handoff with an operator-confirmation gate.

### Skill bundle (12 new files)

You can now load `cli-devin` from any of the sibling skills and get a copy-pasteable `devin --prompt-file <path> --model swe-1.6 --permission-mode normal` invocation, a permission-mode risk taxonomy that maps cleanly to Codex sandbox levels and Claude/OpenCode `--dangerously-skip-permissions`, and a Devin-unique `cloud_handoff.md` reference that enforces a 5-check operator-confirmation gate before any cloud-handoff dispatch.

### Sibling symmetry

The four existing cli-* skills' `graph-metadata.json` files were patched to list `cli-devin` in `edges.siblings[]` and `manual.related_to[]`. cli-devin's own metadata lists all four as siblings, so the skill-advisor graph is bidirectional.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/cli-devin/SKILL.md | Created | 8-section family-standard skill body (429 LOC) |
| .opencode/skills/cli-devin/README.md | Created | 9-section TOC README mirroring family |
| .opencode/skills/cli-devin/graph-metadata.json | Created | Skill-advisor metadata, 4 sibling edges |
| .opencode/skills/cli-devin/references/cli_reference.md | Created | Devin command/flag/slash-command surface |
| .opencode/skills/cli-devin/references/integration_patterns.md | Created | 3 use cases (external dispatch, ACP, cloud handoff) |
| .opencode/skills/cli-devin/references/agent_delegation.md | Created | (model, permission-mode, prompt-file) routing analog |
| .opencode/skills/cli-devin/references/devin_tools.md | Created | Cross-CLI capability comparison |
| .opencode/skills/cli-devin/references/cloud_handoff.md | Created | Devin-unique handoff narrative + 5-check operator gate (180 LOC) |
| .opencode/skills/cli-devin/assets/prompt_quality_card.md | Created | CLEAR card, framework selection |
| .opencode/skills/cli-devin/assets/prompt_templates.md | Created | 6 copy-paste templates |
| .opencode/skills/cli-devin/changelog/v1.0.0.0.md | Created | Per-version release notes in cli-codex prose style (matches family canonical shape) |
| .opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md | Created | Root playbook — 17 sections covering 25 scenarios across 9 categories (matches family canonical shape) |
| .opencode/skills/cli-devin/manual_testing_playbook/01--cli-invocation/*.md | Created | 4 scenario files (DV-001..DV-004) |
| .opencode/skills/cli-devin/manual_testing_playbook/02--permission-modes/*.md | Created | 3 scenario files (DV-005..DV-007) |
| .opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/*.md | Created | 3 scenario files (DV-008..DV-010) |
| .opencode/skills/cli-devin/manual_testing_playbook/04--devin-surfaces/*.md | Created | 3 scenario files (DV-011..DV-013) |
| .opencode/skills/cli-devin/manual_testing_playbook/05--session-continuity/*.md | Created | 3 scenario files (DV-014..DV-016) |
| .opencode/skills/cli-devin/manual_testing_playbook/06--cloud-handoff/*.md | Created | 2 scenario files (DV-017..DV-018) |
| .opencode/skills/cli-devin/manual_testing_playbook/07--self-invocation-guard/*.md | Created | 2 scenario files (DV-019..DV-020) |
| .opencode/skills/cli-devin/manual_testing_playbook/08--cross-ai-dispatch/*.md | Created | 4 scenario files (DV-021..DV-024) |
| .opencode/skills/cli-devin/manual_testing_playbook/09--acp-bridge/*.md | Created | 1 scenario file (DV-025) |
| .opencode/skills/cli-claude-code/graph-metadata.json | Modified | Added cli-devin to siblings + related_to |
| .opencode/skills/cli-codex/graph-metadata.json | Modified | Added cli-devin to siblings + related_to |
| .opencode/skills/cli-gemini/graph-metadata.json | Modified | Added cli-devin to siblings + related_to |
| .opencode/skills/cli-opencode/graph-metadata.json | Modified | Added cli-devin to siblings + related_to |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The family contract was reverse-engineered from the four sibling skills via a combination of a cli-codex dispatch (gpt-5.5 medium, normal speed, read-only sandbox) that read all SKILL.md / README.md / references/* content into a transcript, and parallel local reads. Synthesis was performed locally; cli-codex did not produce a written summary because the read-only sandbox blocked the synthesis-file write. The skill bundle was authored in three parallel write batches (skill body + metadata; 5 references; assets + changelog + playbook). Sibling graph-metadata.json files were patched with `jq` to preserve formatting. Validation passes after one corrective pass that rewrote tasks.md, checklist.md, and implementation-summary.md to match the canonical template anchor + header contract.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror the family's 8-section SKILL.md exactly | Family-contract symmetry — same grep, same skill-advisor weight model, same router pattern |
| Add `references/cloud_handoff.md` as a Devin-unique fifth reference | No other family member has async cloud execution; the capability needs first-class documentation with an operator-confirmation gate |
| Default to SWE-1.6 model and `normal` permission mode | SWE-1.6 is Cognition's coding-specialized model tuned for Devin's autonomous loop; `normal` is the safest default that pauses for confirmation on destructive ops |
| Probe `DEVIN_*` env + `devin` ancestry + speculative lockfile for self-invocation guard | Devin's exact env-var prefix and session-state layout are not publicly documented at v0.x; layered detection fails closed while leaving room for empirical verification |
| Mark `--json` flag as UNVERIFIED in cli_reference.md | Web search suggested it exists; official docs at `cli.devin.ai/docs/reference/commands` do not list it; never advertise an unverified flag in skill body |
| Stay on `main` (no feature branch) | Operator policy per memory `feedback_stay_on_main_no_feature_branches.md` |
| Skip `.claude`/`.codex`/`.gemini` mirror | This is a SKILL, not an AGENT — the 4-runtime mirror rule (memory `feedback_new_agent_mirror_all_runtimes.md`) does not apply |
| Use `jq` (not freehand JSON) for sibling graph-metadata patches | Preserves byte-level formatting; avoids subtle whitespace drift that breaks downstream parsers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` | PASS (exit 0 after corrective rewrite of tasks/checklist/impl-summary to match canonical anchors) |
| `grep -c '^## ' .opencode/skills/cli-devin/SKILL.md` | 8 — matches family contract |
| `jq '.edges.siblings[].target' .opencode/skills/cli-*/graph-metadata.json \| grep -c cli-devin` | 4 — symmetric across all 4 siblings |
| `wc -l .opencode/skills/cli-devin/references/cloud_handoff.md` | 180 — exceeds REQ-006 minimum of 100 |
| `wc -l .opencode/skills/cli-devin/SKILL.md` | 429 — within family range (398–454) |
| SKILL.md section headings in family order | PASS — WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / REFERENCES / SUCCESS CRITERIA / INTEGRATION POINTS / REFERENCES AND RELATED RESOURCES |
| Skill-advisor auto-discovery | PASS — cli-devin appears in the available-skills list immediately after SKILL.md write (verified via system-reminder during authoring) |
| Devin CLI surface coverage vs `cli.devin.ai/docs/reference/commands` | PASS as of 2026-05-15 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Devin's top-level `--json` flag for structured output is marked "UNVERIFIED" in `references/cli_reference.md` §8 pending empirical confirmation against an installed CLI.
- Self-invocation guard Layer 3 (lockfile probe at `~/.config/devin/sessions/<id>/lock`) is speculative; Devin's session-state directory layout is not publicly documented at v0.x. Layer 1 (env var) and Layer 2 (process ancestry) carry the guard until verified.
- The cli-codex (gpt-5.5 medium) dispatch for context-gathering was attempted with `--sandbox read-only` and could not write its synthesis output to `/tmp/family-analysis.md`; the raw transcript is at `/tmp/codex-cli-devin.log` as an audit artifact. Family-contract synthesis was performed locally and produced no quality loss.
- Skill-advisor confidence ≥0.8 for "delegate to devin" (REQ-014) will materialize on the next advisor reindex; not measured inline.
- Devin pricing-tier checks (cloud-handoff entitlement) are documented but not programmatically enforced — operator owns the confirmation.
- The cloud handoff is operator-initiated from inside Devin's live TUI; the skill cannot fully automate the handoff trigger from a one-shot dispatch.
<!-- /ANCHOR:limitations -->
