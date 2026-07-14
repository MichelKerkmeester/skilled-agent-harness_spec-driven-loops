---
title: "Implementation Plan: P2-032 strategy-doc cleanup [template:level_1/plan.md]"
description: "Two file edits to clear the lone deferred cosmetic finding from the 8-phase plural-rename remediation cycle. No code-touching change; mechanical doc-edit work."
trigger_phrases:
  - "P2-032 cleanup plan"
  - "096/009 plan"
  - "strategy doc cleanup plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/009-p2-032-cleanup"
    last_updated_at: "2026-05-08T20:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored alongside scaffolded packet"
    next_safe_action: "Execute T001 and T002 via direct Edit, then strict-validate"
    blockers: []
    key_files:
      - "specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md"
      - "specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/008-remediation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "p2-032-cleanup-2026-05-08"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: P2-032 strategy-doc cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (no code change) |
| **Framework** | system-spec-kit |
| **Storage** | Filesystem (spec docs) |
| **Testing** | `validate.sh --strict` + grep verification |

### Overview
Two file edits clear the lone deferred cosmetic finding (P2-032) from the 8-phase plural-rename remediation cycle. The 007-track-rereview deep-review strategy doc had three stale references claiming `aliases.ts` was a 101-cli-opencode-executor surface; iter-1 of the review caught the discrepancy as `CROSS_REF_BROKEN` but never patched the strategy doc itself. This packet patches the strategy doc and clears the corresponding `_memory.continuity.blockers` entry from 008-remediation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (3 stale references identified by line number)
- [x] Success criteria measurable (grep returns 0 hits in target sections; strict-validate exits 0)
- [x] Dependencies identified (none — pure doc-edit work)

### Definition of Done
- [ ] All three stale `aliases.ts` references removed from surface inventory
- [ ] 008-remediation continuity blockers cleared
- [ ] `bash validate.sh --strict` exits 0 on both 008 and 009 packets
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct documentation patch — no architectural change.

### Key Components
- **`007-track-rereview/review/deep-review-strategy.md`**: Source of the false claim. Lines 30, 33, 41, 57, 100 reference `aliases.ts` as a 101 surface. Lines 30/41 also count "6 surfaces" instead of 5.
- **`008-remediation/implementation-summary.md`**: Continuity record listing P2-032 as a blocker. Needs blocker cleared and "Findings resolved" count updated 5/6 → 6/6.

### Preservation
Iter-narrative mentions of `aliases.ts` (lines 119, 130, 163, 164, 226–229) document the false-claim discovery and stay as audit trail.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Surface inventory cleanup
Edit `007-track-rereview/review/deep-review-strategy.md`:
- Replace count "across 6 surfaces" → "across 5 surfaces" (line ~30) and "all 6 surfaces" → "all 5 surfaces" (line ~41).
- Remove the surface bullet "`aliases.ts` — advisor alias for `cli-opencode`" (line ~33).
- Remove the cross-reference target line for `mcp_server/skill_advisor/lib/aliases.ts (101 surface)` (line ~57).
- Replace "6 surfaces touched: executor-config.ts, aliases.ts, 4 deep-loop YAML files" → "5 surfaces touched: executor-config.ts, 4 deep-loop YAML files" (line ~100).
- Add a parenthetical note in each replacement explaining that P2-032 closed the prior CROSS_REF_BROKEN.

### Phase 2: Continuity clear
Edit `008-remediation/implementation-summary.md`:
- Set `_memory.continuity.blockers` to `[]`.
- Update `_memory.continuity.recent_action` to record the closure.
- Update Metadata "Findings resolved" from "5 of 6" to "6 of 6 — P2-032 closed via 096/009".
- Convert the `## P2-032 — Deferred` section heading to `## P2-032 — Closed via 096/009 cleanup packet` and rewrite the body.
- Update Followups list to mark P2-032 closed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

```bash
# REQ-001: aliases.ts not claimed as a 101 surface
grep -n 'aliases\.ts' .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md \
  | grep -i '101 surface\|advisor alias for'
# Expected: 0 hits

# REQ-002: blocker cleared
grep -A 3 'blockers:' .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/008-remediation/implementation-summary.md
# Expected: blockers: [] (no P2-032 line)

# Strict validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/008-remediation --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/009-p2-032-cleanup --strict
# Expected: exit 0 on both
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 8-phase plural-rename remediation cycle | Predecessor | Closed (40 P0+P1 + 5 P2 resolved at ship time; this packet closes the lone P2-032) |
| `validate.sh --strict` | Tooling | Available |

No external dependencies. No code or test changes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a downstream consumer of the strategy doc relied on the false `aliases.ts` claim, restore the original strategy doc text and re-add the blocker entry to 008-remediation. Likelihood: zero — the iter-1 review explicitly classified the prior claim as `CROSS_REF_BROKEN`, so no consumer reasonably depends on it.

Rollback is a 5-minute revert via `git restore`.
<!-- /ANCHOR:rollback -->
