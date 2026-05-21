# Deep-Review Iteration 010 — Cross-Runtime Configuration Sync

**Iteration:** 10 of 20
**Mode:** review
**Dimension:** cross-runtime-config
**Date:** 2026-05-18

---

## EXECUTIVE SUMMARY

Checked cross-runtime configuration parity for the small-model dispatch rule across AGENTS.md, CLAUDE.md, and runtime-specific files. Verified root README skill count accuracy and sk-small-model entry consistency. Found P1 gaps in runtime file coverage and P2 marginal skill count mismatch.

**Verdict:** 1 P1, 1 P2

---

## CHECK 1: Small-Model Dispatch Rule Presence + Parity

### Expected Files
- `/AGENTS.md` (canonical)
- `/CLAUDE.md` (canonical, synced with AGENTS.md)
- `/.claude/CLAUDE.md` (Claude runtime-specific)
- `/.codex/AGENTS.toml` or `/.codex/CLAUDE.md` (Codex runtime-specific)
- `/.gemini/CLAUDE.md` (Gemini runtime-specific, if present)

### Findings

| File | Status | Evidence |
|------|--------|----------|
| `/AGENTS.md` | ✓ PRESENT | Line 40: "Small-model dispatch rule — Before dispatching to small models (SWE-1.6 via cli-devin; DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6 via cli-opencode; optional future Haiku/Gemini Flash), you MUST consult `sk-small-model`..." |
| `/CLAUDE.md` | ✓ PRESENT | Line 40: Byte-level identical to AGENTS.md |
| `/.claude/CLAUDE.md` | ✗ MISSING | File exists but contains only tool routing enforcement (CocoIndex/Code Graph), not framework rules |
| `/.codex/AGENTS.toml` | ✗ MISSING | File does not exist |
| `/.codex/CLAUDE.md` | ✗ MISSING | File does not exist (only `.codex/AGENTS.md` exists, which is voice/tone rules, not framework rules) |
| `/.gemini/CLAUDE.md` | ✗ NOT APPLICABLE | Directory does not exist (expected, not all runtimes present) |

### Parity Analysis

AGENTS.md and CLAUDE.md have byte-level identical rule wording at line 40. This satisfies the sync requirement per `feedback_agents_md_sync_triad`.

### Finding

**P1** — Rule missing from runtime-specific files that should have it:
- `/.claude/CLAUDE.md` should include the framework rules from AGENTS.md/CLAUDE.md
- `/.codex/` should have a framework rules file (either AGENTS.toml or CLAUDE.md) with the rule

**Evidence:** AGENTS.md:40, CLAUDE.md:40
**Counterevidence sought:** Check if runtime-specific files intentionally exclude framework rules
**Alternative explanation:** Runtime-specific files may be scoped to only runtime-specific concerns (tool routing for Claude, voice/tone for Codex)
**Confidence:** 0.7 — The prompt explicitly expects these files to contain the rule
**Downgrade trigger:** If runtime-specific files are documented as intentionally excluding framework rules

---

## CHECK 2: Root README Skill Count

### Claim
- Line 10: "🎯 **21 On-Demand Skills**"
- Line 67: "|| **🎯 21 Skills**"

### Actual Count
```bash
ls .opencode/skills/ | wc -l
# Result: 22
```

### Mismatch
Claimed: 21 skills
Actual: 22 skills
Delta: +1 (marginal)

### Finding

**P2** — Marginal skill count mismatch (threshold for P1 is ≥2)

**Evidence:** README.md:10, README.md:67, bash count returns 22
**Counterevidence sought:** Verify if one of the 22 entries is not a skill (e.g., directory, hidden file)
**Alternative explanation:** README may not have been updated after a skill was added
**Confidence:** 0.9 — Direct count mismatch
**Downgrade trigger:** If the 22nd entry is not a skill (e.g., README.md, .gitkeep, or non-skill directory)

---

## CHECK 3: sk-small-model Entry in Root README

### Entry Location
README.md:910-913

### Entry Content
```markdown
**sk-small-model**
- Sentinel skill for small-model optimization patterns. Discovery anchor only — routes operators to executor-owned pattern files instead of hosting logic.
- Active scope: SWE-1.6 (Cognition free tier via `cli-devin`), DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 (Cognition Pro pool via `cli-opencode`). Optional stubs ready for Claude Haiku and Gemini Flash.
- Co-surfaces alongside `cli-devin` and `cli-opencode` via `enhances` edges (weight 0.5). Lexical trigger phrases match model names + pattern names (`swe-1.6`, `kimi`, `deepseek`, `qwen`, `haiku`, `gemini flash`, `context budget`, `output verification`, `permissions matrix`, `quota fallback`, `model profile`, `tool scoring`).
```

### Verification Against description.json
- **Description match:** ✓ "Sentinel skill for small-model optimization patterns" aligns with description.json:3
- **Trigger phrases:** ✓ Includes model names (swe-1.6, kimi, deepseek, qwen, haiku, gemini flash) + pattern names (context budget, output verification, permissions matrix, model profile, tool scoring)
- **Path:** Not explicitly shown in entry, but implied as `.opencode/skills/sk-small-model/`

### Finding

**PASS** — sk-small-model entry is present and consistent with description.json

**Evidence:** README.md:910-913, description.json:1-36
**Confidence:** 0.95

---

## CHECK 4: AGENTS.md ↔ CLAUDE.md Sync Rule

### Wording Comparison
AGENTS.md:40 and CLAUDE.md:40 have byte-level identical wording:

```
- **Small-model dispatch rule** — Before dispatching to small models (SWE-1.6 via cli-devin; DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6 via cli-opencode; optional future Haiku/Gemini Flash), you MUST consult `sk-small-model` for pointers to context-budget defaults, output-verification recipes, model-profile registry, and structured-permissions schema. The sentinel skill is the single discoverable home for small-model optimization patterns. Routing is automatic via the advisor's `enhances` edges from cli-devin and cli-opencode, but the rule is here for explicit verification when sk-small-model doesn't auto-surface.
```

### Finding

**PASS** — AGENTS.md and CLAUDE.md have byte-level parity for the small-model dispatch rule

**Evidence:** AGENTS.md:40, CLAUDE.md:40
**Confidence:** 1.0

---

## CHECK 5: Trigger Phrases in description.json

### File Validation
```bash
jq . .opencode/skills/sk-small-model/description.json
# Result: Parses successfully
```

### Structure Check
- **Has trigger_examples array:** ✓ (lines 27-33)
- **Includes model names:** ✓ (swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, haiku, gemini flash)
- **Includes pattern names:** ✓ (context budget, output verification, structured permissions)
- **No malformed phrases:** ✓ (all are non-empty, no leading/trailing whitespace)

### Finding

**PASS** — description.json has valid trigger_examples array with appropriate content

**Evidence:** description.json:27-33, jq parse successful
**Confidence:** 1.0

---

## SUMMARY OF FINDINGS

| Check | Result | Severity |
|-------|--------|----------|
| Check 1: Rule parity across runtime files | FAIL | P1 |
| Check 2: README skill count | FAIL | P2 |
| Check 3: sk-small-model README entry | PASS | — |
| Check 4: AGENTS.md ↔ CLAUDE.md sync | PASS | — |
| Check 5: description.json validation | PASS | — |

**Total:** 1 P1, 1 P2

---

## CONVERGENCE STATUS

State summary: 10 iters done. P0=0, P1=3, P2=12. Convergence math held for 4 iters.

This iteration identified a P1 gap in cross-runtime configuration coverage (rule missing from runtime-specific files) and a P2 marginal skill count mismatch in the README.
