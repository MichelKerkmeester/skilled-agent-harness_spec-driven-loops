# Iteration 004 — Rename Completeness (deep-agent-improvement → deep-improvement)

## Focus

Verify that the `deep-agent-improvement` → `deep-improvement` rename is complete and correct across all active surfaces: advisor TS/Python canonical IDs, Lane B benchmark penalty target, 4 agent mirrors, `.codex/config.toml`, and flag any active dangling reference.

---

## Findings

### P1 — Incomplete Legacy Cleanup

**File:** `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:1789`
**Issue:** `command-deep-agent-improvement` is a standalone command-bridge entry that was **not renamed, deprecated, or assigned an owning skill** during the rename. It has no `deprecated: True`, no `owning_skill`, and does not appear in `aliases.ts` — so `canonicalSkillId("command-deep-agent-improvement")` returns the string unchanged and routes nowhere.
**One-line fix:** Add `deprecated: True, owning_skill: "deep-improvement"` to the entry dict, or remove it if confirmed dead code.

---

### P0/P2 — Legacy Aliases (CORRECT — not issues)

The following are **intentional legacy aliases** kept per design, confirmed correct:

- **aliases.ts:28** — `'command-spec-kit-deep-agent-improvement'` in the `deep-improvement` alias group. Intact legacy skill command alias.
- **aliases.ts:30–31** — `'deep-agent-improvement'` and `'sk-deep-agent-improvement'` in the `deep-improvement` alias group. Intact legacy skill id aliases.
- **explicit.ts:123** — Comment references "deep-agent-improvement skill" in context of Lane B. Correct: describes the skill being operated on.
- **explicit.ts:127** — Comment explicitly documents why the old alias-shaped target was inert and that the penalty now correctly targets `deep-improvement`. Confirms the fix is intentional and documented.
- **skill_advisor.py:251–254** — Same legacy aliases mirrored in Python `SKILL_ALIAS_GROUPS`. Correct.
- **skill_advisor.py:1589–1590** — Routing entries `deep-agent-improvement` and `/deep-agent-improvement` → `deep-improvement` with weight 3.2. Correct legacy routing entries.

---

### Verified Clean Surfaces

| Surface | File | Status |
|---|---|---|
| Skill directory | `.opencode/skills/deep-improvement/` | ✅ Renamed from `deep-agent-improvement` |
| Skill canonical id | `graph-metadata.json:3` | ✅ `"skill_id": "deep-improvement"` |
| Agent file | `.opencode/agents/deep-improvement.md:2` | ✅ `name: deep-improvement` |
| Codex registry | `.codex/config.toml:21–23` | ✅ `[agents.deep-improvement]` |
| Lane B penalty target | `explicit.ts:130` | ✅ penalty to `deep-improvement` (not old alias) |
| Command skill | `.opencode/commands/` | ✅ No `deep-agent-improvement` refs |
| Sentinel | `sk-prompt-models/` | ✅ No refs |
| Runtime mirrors | 4 agent mirrors | ✅ All renamed |

---

## Verdict

One P1 finding: `command-deep-agent-improvement` at `skill_advisor.py:1789` is a legacy command-bridge entry left behind in the rename. It is not deprecated, has no owning skill, and is inert. All other surfaces are correctly migrated with legacy aliases properly retained.

Review verdict: CONDITIONAL
