---
title: "Implementation Summary"
description: "The root README.md is rewritten from a 20-iteration research run: 703 lines instead of 1,773, a reader-first order with hooks, plugins and extensions below skills, one subsection per hook and every verified stale claim corrected."
trigger_phrases:
  - "root readme rewrite implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite"
    last_updated_at: "2026-11-16T18:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Rewrote README.md and recorded the verification evidence"
    next_safe_action: "Review the README diff and commit it with the research folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-025-root-readme-rewrite"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-root-readme-rewrite |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The root README now describes the repository as it is after v4.0.2.1 and the work merged since. A new reader meets what Skilled is, the eight runtimes and the quick start in the first hundred lines. Detail that other READMEs already own is a link instead of a copy.

### Research the current repository reality for a root README rewrite

A deep-research loop ran 20 iterations on the Devin CLI with `deepseek-v4-1-flash-max`. It mapped the release delta from v4.0.0.0, the current inventory and every hook by runtime, and it audited the old README line by line. The rewrite follows the operator-approved order. Hooks, plugins and extensions sit directly below skills, with one subsection for each shared hook, each runtime-only hook and each Pi package.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | Full rewrite, 1,773 to 703 lines |
| `research/` | Created | Research state, iterations, `research.md` and `resource-map.md` |
| `../spec.md` | Modified | Phase map row and transition row for this child |
| `../graph-metadata.json` | Modified | Child entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The research ran first and its load-bearing claims were re-read at their source files. The baselines were taken before the rewrite. One agent wrote the README from the research and traced each runtime list to the adapter files. The validator, the voice scanner and the link check then ran again on the final file.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Say that git hooks install themselves in the main checkout | `.skilled/bin/check-git-hooks.sh` runs the installer when a link is missing, outside linked worktrees. The research claimed otherwise and was wrong |
| Follow the code over the hook coverage matrix for the Vibe dispatch audit | Vibe ships only the preflight adapter, so the audit trail runs on seven runtimes |
| Drop unsourced figures such as the context-saving percentage and the token counts | No source file read for this task states them |
| Keep the `#git-hooks` and `#off-switches` headings | Other docs link to those anchors |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py README.md` | `VALID`, 0 issues. Before: valid, 1 warning |
| `hvr_scan.py README.md` hard blockers | 2 to 0 |
| `hvr_scan.py README.md` ceiling | 81 to 99 |
| Relative link check | 100 links, 0 problems |
| `rg -ci relaunch README.md` | No hits |
| Hook headings | Every folder in `.skilled/hooks/` except `shared` is named in a `###` heading |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two other READMEs keep stale counts.** `.codex/hooks/README.md` and `.vibe/plugins/README.md` were flagged by the research and are outside this packet.
2. **The hook coverage matrix disagrees with the code** on the Vibe dispatch audit and is not corrected here.
3. **The research iterations carry six source tags** that point through symlinked folders and do not resolve as written.
<!-- /ANCHOR:limitations -->
