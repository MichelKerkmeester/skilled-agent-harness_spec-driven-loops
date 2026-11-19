---
title: "Decision Record: Phase 15: barter-overlay-upstream-intake"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "015-barter-overlay-upstream-intake operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake"
    last_updated_at: "2026-11-19T17:37:38.690Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 15: barter-overlay-upstream-intake

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | sk-doc and sk-design get new domain family names instead of the catch-all sk-util, with the schema change that needs. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake/spec.md |
| Q002 | The two router reach-check failures (ruleset context, figma mcp) are fixed in phase 015. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake/spec.md |
| Q003 | Barter is told that 015 is on main only after the family change lands. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake/spec.md |
| Q004 | The 21 mcp-tooling and cli-external-orchestration hub-routing playbook pages are rewritten to pass the playbook_feature rule. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake/spec.md |
| Q005 | Plain overlay status prints a NOTE for missing paths. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake/spec.md |
| Q006 | Skilled builds the best fix for all 7 of Barter's checker changes. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake/spec.md |
| Q007 | Phase 015 in worktree 441 merges main and is pushed. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:399b449d-7cbe-4a55-8c5f-45646925efcf:toolu_01FGLG5AtPZZA8Ke5PEERU4C:0 -->

Question:
```text
Family field for sk-doc and sk-design (today both `sk-util`). The allowed values are a fixed list in skill-graph-db.ts:53, so a new name needs a schema change. The scorer reads `family === 'cli'`, and detect-inbound-enhances groups skills by family to propose edges. Which do you want?
```

Options:
```text
sk-hub + template (Recommended)
New domain families
Template sentence only
```

Answer:
```text
New domain families
```

### Q002
<!-- source: claude:399b449d-7cbe-4a55-8c5f-45646925efcf:toolu_01FGLG5AtPZZA8Ke5PEERU4C:1 -->

Question:
```text
The router reach check fails on two phrases, reproduced just now with a live advisor (gen 16): `ruleset context` goes to system-spec-kit 0.8755 over sk-code 0.8405, and `figma mcp` goes to sk-code 0.8668 over mcp-tooling 0.8664. Both were failing before 015 (figma confirmed, ruleset not proven). How should 015 handle them?
```

Options:
```text
Record, separate fix (Recommended)
Fix in 015
Drop the phrases
```

Answer:
```text
Fix in 015
```

### Q003
<!-- source: claude:399b449d-7cbe-4a55-8c5f-45646925efcf:toolu_01FGLG5AtPZZA8Ke5PEERU4C:2 -->

Question:
```text
Tell Barter now that 015 is on main as `43f6eb9407d`? They could drop the overlays for the four file fixes, the playbook pages and the checker changes, and keep 'aside' and 'at a glance'.
```

Options:
```text
After family lands
Yes, now
Not yet
```

Answer:
```text
After family lands
```

### Q004
<!-- source: claude:6ad5889a-15be-4f0a-adad-59b8e4427b3f:toolu_01EasTL2Ymi4CdJ1bsKoihk9:0 -->

Question:
```text
The mcp-tooling hub-routing playbook pages (16, plus 5 in cli-external-orchestration) fail validate_document's playbook_feature rule. 222 other playbook pages pass it. Which side changes?
```

Options:
```text
Rewrite the 21 pages (Recommended)
Relax the rule
```

Answer:
```text
Rewrite the 21 pages (Recommended)
```

### Q005
<!-- source: claude:6ad5889a-15be-4f0a-adad-59b8e4427b3f:toolu_01EasTL2Ymi4CdJ1bsKoihk9:1 -->

Question:
```text
Plain overlay status passes while files are missing from the tree, and only status --audit catches it. Add a NOTE to plain status?
```

Options:
```text
NOTE for missing paths (Recommended)
Full audit in status
No change
```

Answer:
```text
NOTE for missing paths (Recommended)
```

### Q006
<!-- source: claude:6ad5889a-15be-4f0a-adad-59b8e4427b3f:toolu_01V4y5uxD7uo3kuc7PGpuvzB:0 -->

Question:
```text
For Barter's checker changes, which should Skilled build?
```

Options:
```text
Best fix for all 7 (Recommended)
Best fix, generator later
Only the easy ones
```

Answer:
```text
Best fix for all 7 (Recommended)
```

### Q007
<!-- source: claude:6ad5889a-15be-4f0a-adad-59b8e4427b3f:toolu_01LpEbZddXMRdiRgUHvo2i1D:0 -->

Question:
```text
Phase 015 is built in worktree 441: 8 commits covering the four file fixes, the router keywords, the 21 playbook pages, the missing-path NOTE and the checker fixes. Doctor suite 1237/1237, validate.sh --strict PASSED. The router reach check has two outranked phrases: 'figma mcp' (already failing before) and 'ruleset context' in sk-code, which 015 did not touch. Push to main? (Undo: a revert.)
```

Options:
```text
Merge main and push (Recommended)
Hold
```

Answer:
```text
Merge main and push (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
