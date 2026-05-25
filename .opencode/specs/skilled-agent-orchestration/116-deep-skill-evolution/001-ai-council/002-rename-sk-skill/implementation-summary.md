---
title: "Implementation Summary: 115/002 — skill dir rename"
description: "Executed the 115/002 skill-folder rename in the A1 source-of-truth direction: sk-ai-council to deep-ai-council."
trigger_phrases: ["115 002 implementation summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/002-rename-sk-skill"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "skill folder renamed + 80 internal edits"
    next_safe_action: "dispatch 004 sibling edges"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/"
      - ".opencode/skills/deep-ai-council/SKILL.md"
      - ".opencode/skills/deep-ai-council/changelog/v1.3.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115002"
      session_id: "115-002-skill-rename-executed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A1 rename-plan.json is authoritative over inverted 002 prose: direction is sk-ai-council to deep-ai-council."
      - "Runtime agent slug remains ai-council; this packet only renames the skill folder and internal skill references."
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: 115/002 — skill dir rename

Packet 115/002 executed the A1 rename plan direction: `.opencode/skills/sk-ai-council/` is now `.opencode/skills/deep-ai-council/`. The packet docs still describe the inverse historical plan, so this summary treats `001-preflight-and-rename-plan/scratch/rename-plan.json` as the source of truth.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Phase | 2 of 6 in 115 arc |
| Status | Complete |
| Predecessor | 001-preflight-and-rename-plan |
| Successor | 004-sibling-edges-and-typescript |
| Completion | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Renamed the skill folder from `.opencode/skills/sk-ai-council/` to `.opencode/skills/deep-ai-council/`.
- Replaced `sk-ai-council` with `deep-ai-council` across 80 in-scope skill files discovered by `rg -l`, excluding any `z_archive` path.
- Updated `.opencode/skills/deep-ai-council/SKILL.md` frontmatter to `name: deep-ai-council` and `version: 1.3.0.0`.
- Added `.opencode/skills/deep-ai-council/changelog/v1.3.0.0.md` documenting the rejoin to the `deep-*` family and preserving `ai-council` as the runtime agent slug.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first attempt used the requested `git mv`, but the sandbox refused Git index writes with `Operation not permitted` while creating `.git/index.lock`. Because approval is disabled for this session, the folder move was completed with filesystem `mv`; the commit handoff below includes explicit `git add -A` paths so the committing agent can stage it as a rename.

The text pass used:

```bash
rg -l "sk-ai-council" .opencode/skills/deep-ai-council --glob '!**/z_archive/**' |
  while IFS= read -r file; do
    sed -i '' 's/sk-ai-council/deep-ai-council/g' "$file"
  done
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- D-001: Followed A1 `rename-plan.json` over 002's inverted prose. The executable direction is `sk-ai-council -> deep-ai-council`.
- D-002: Kept the runtime agent slug at `ai-council`. Agent updates are not in 002 scope.
- D-003: Treated the new v1.3 changelog's old-name mentions as intentional release history, not stale live references.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|---|---|---|
| New folder exists | `test -d .opencode/skills/deep-ai-council/` | PASS |
| Old folder absent | `test ! -d .opencode/skills/sk-ai-council/` | PASS |
| Replacement count | `rg -l "sk-ai-council" .opencode/skills/deep-ai-council --glob '!**/z_archive/**' \| wc -l` after sed | 0 before v3 changelog creation |
| Stale refs outside v1.3 note | `rg -n "sk-ai-council" .opencode/skills/deep-ai-council --glob '!**/changelog/v1.3.0.0.md' --glob '!**/z_archive/**'` | PASS: 0 stale refs |
| Literal grep caveat | `grep -r "sk-ai-council" .opencode/skills/deep-ai-council/` | Returns only required v1.3 changelog old-name history |
| SKILL frontmatter | `sed -n '1,8p' .opencode/skills/deep-ai-council/SKILL.md` | `name: deep-ai-council`, `version: 1.3.0.0` |
| Strict spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/002-rename-sk-skill --strict` | PASS: 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `description.json` was listed in A1's 002 file scope, but no skill-local `.opencode/skills/deep-ai-council/description.json` file exists after the folder move. No new file was invented for this packet.
- The literal stale-reference command `grep -r "sk-ai-council" .opencode/skills/deep-ai-council/` conflicts with the required v1.3 changelog title and release-history body, which intentionally mention the predecessor slug.
<!-- /ANCHOR:limitations -->

---

## Commit Handoff

Suggested commit:

```text
feat(115/002): rename sk-ai-council → deep-ai-council skill folder + 80 internal edits
```

Explicit paths for `git add`:

```bash
git add -A .opencode/skills/sk-ai-council
git add -A .opencode/skills/deep-ai-council
git add .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/002-rename-sk-skill/implementation-summary.md
```
