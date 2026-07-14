---
title: "Implementation Summary: 075 cli-copilot Hallucination Caveat"
description: "Two doc-only caveats land in cli-copilot/SKILL.md + sk-doc/SKILL.md, citing 071/072 stress-matrix evidence and recommending cli-codex as preferred default for routing-trace consumption tasks."
trigger_phrases: ["075 summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/013-cli-copilot-hallucination-caveat"
    last_updated_at: "2026-05-05T18:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Caveats shipped; ready to commit + push"
    next_safe_action: "(packet final after commit + push)"
    blockers: []
    key_files: [.opencode/skills/cli-copilot/SKILL.md, .opencode/skills/sk-doc/SKILL.md]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "075-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 075-cli-copilot-hallucination-caveat |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Predecessor** | 072 review-report-v2.md (P1-072-001 finding) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Future maintainers and AI agents loading cli-copilot/SKILL.md or sk-doc/SKILL.md now see explicit caveats about cli-copilot's resource-path hallucination behavior. The cli-copilot caveat lives in §1 "When NOT to Use" — bullet item flagging "Routing-trace tasks where the caller consumes resource paths LITERALLY", citing the 11.1% accuracy vs cli-codex 66.7% on the sk-doc router stress matrix. The sk-doc caveat lives in §2 "Resource Domains" as a callout note giving the per-CLI accuracy table summary (cli-codex 66.7% / cli-opencode 47.2% / cli-copilot 11.1%) and recommending cli-codex (gpt-5.5/high/fast) as preferred default. Both caveats reference `specs/skilled-agent-orchestration/z_archive/060-sk-doc-router-rerun-refined-extraction/review-report-v2.md` for the full evidence trail.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-copilot/SKILL.md` | Modified (1 added bullet) | Routing-trace caveat in "When NOT to Use" |
| `.opencode/skills/sk-doc/SKILL.md` | Modified (1 added paragraph) | Cross-CLI consumption note in "Resource Domains" |
| `075/{spec,plan,tasks,implementation-summary}.md` | Created | Packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two Edit calls. ~10 lines of content total. Both caveats use the same evidence trail (071/072 stress matrix), name the empirical accuracy numbers, and recommend cli-codex as the preferred default for routing-trace consumption tasks. The cli-copilot caveat scopes the recommendation tightly ("when caller consumes paths LITERALLY") to avoid creating a blanket "don't use cli-copilot" misreading; cli-copilot remains a good general-purpose dispatcher for tasks where its routing trace is treated as advisory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Caveat in SKILL.md (not README.md) | SKILL.md is the AI-loaded surface. AI agents picking the right CLI for a task read SKILL.md. README is for maintainers. The discoverability path matters |
| Tight scope on cli-copilot caveat ("LITERALLY") | Avoids a blanket "don't use cli-copilot" misread. Cli-copilot is fine for many tasks; only routing-trace consumers get burned |
| Cite empirical numbers (66.7/47.2/11.1) | Maintainers reading later can verify; not opinion |
| Reference review-report-v2.md path | Future readers can dig into the full evidence; not a black-box assertion |
| 1-bullet caveat in 1-paragraph in sk-doc | Different surfaces; cli-copilot's "When NOT to Use" is a list, sk-doc's "Resource Domains" is prose |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| grep "Routing-trace tasks where the caller" cli-copilot/SKILL.md | PASS |
| grep "Cross-CLI consumption note" sk-doc/SKILL.md | PASS |
| Both caveats cite 071/072 evidence | PASS |
| Both name cli-codex as preferred | PASS |
| No code changes outside SKILL.md files + 075 docs | PASS |
| Branch | main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Evidence is from one session, n=15 scenarios per CLI** — not statistically definitive. Future packets running larger matrices (e.g., 076 if user requests) could revise the numbers.

2. **Hallucination behavior is provider/model-specific** — claude-opus-4.7's behavior on sk-doc terminology may not generalize to other Anthropic models. Caveat mentions "claude-opus-4.7 (cli-copilot default)" specifically.

3. **README.md not updated** — by design, but if a maintainer-only README touches cli-copilot's accuracy claims separately, they'd need a follow-up. None observed in the cli-copilot README.md scan.
<!-- /ANCHOR:limitations -->
