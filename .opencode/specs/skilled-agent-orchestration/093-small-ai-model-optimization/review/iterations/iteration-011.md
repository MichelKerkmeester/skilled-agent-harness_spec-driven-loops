# Deep-Review Iteration 011

**Review Iteration:** 11 of 20
**Mode:** review
**Dimension:** cross-cutting / adjudication
**Date:** 2026-05-18

---

## Task 1 — Retraction

### F1-iter10 (P1 rule-in-runtime-files): RETRACTED

**Finding:** Iter-10 flagged P1 that framework rules were missing from runtime files (`.claude/CLAUDE.md`, `.codex/AGENTS.md`).

**Retraction Evidence:**
- `.claude/CLAUDE.md` only contains tool routing for CocoIndex + Code Graph. It is NOT a framework-rules file by design.
- `.codex/AGENTS.md` line 7 states: "the project file is authoritative for gates, scope discipline, code style, safety constraints, spec-folder workflow, memory routing, and all other framework matters. This file never overrides those — it only shapes delivery."
- This confirms `.codex/AGENTS.md` is scoped to voice/tone/reasoning-visibility ONLY.
- The `feedback_agents_md_sync_triad` memory confirms the sync triad (`.opencode/AGENTS.md`, `.claude/AGENTS.md`, `.codex/AGENTS.md`) is canonical + Barter, not runtime files.

**Conclusion:** False positive — runtime files are correctly scoped to runtime-specific concerns by design.

### F2-iter10 (P2 skill count 21 vs 22): RETRACTED

**Finding:** Iter-10 flagged P2 that README.md claimed 21 skills but `ls` returned 22 entries.

**Retraction Evidence:**
- `ls .opencode/skills/` returns 22 entries: 21 skill directories + `README.md` file.
- Actual skill count is `ls -1d .opencode/skills/*/ | wc -l = 21` (directories only).
- README's claim of 21 is correct.

**Conclusion:** False positive — the discrepancy was due to counting the README.md file as a skill.

---

## Task 2 — Edge Symmetry

### Graph-Metadata Analysis

Read three `graph-metadata.json` files to check edge symmetry between `sk-small-model`, `cli-devin`, and `cli-opencode`.

#### sk-small-model

**File:** `.opencode/skills/sk-small-model/graph-metadata.json`

- `edges.enhances` (lines 8-19):
  - `cli-devin` (weight 0.5, context: "small-model dispatch surface — SWE-1.6 budget + verification patterns")
  - `cli-opencode` (weight 0.5, context: "small-model dispatch surface — DeepSeek/Kimi/Qwen permissions matrix + budget patterns")
- `manual.related_to` (lines 26-29): `["cli-devin", "cli-opencode"]`

#### cli-devin

**File:** `.opencode/skills/cli-devin/graph-metadata.json`

- `edges.enhances` (lines 8-14):
  - `sk-small-model` (weight 0.5, context: "small-model patterns sentinel")
- `manual.related_to` (lines 44-52): `["cli-claude-code", "cli-codex", "cli-gemini", "cli-opencode", "sk-code", "mcp-code-mode", "system-spec-kit"]`
  - **NOT includes `sk-small-model`**

#### cli-opencode

**File:** `.opencode/skills/cli-opencode/graph-metadata.json`

- `edges.enhances` (lines 8-14):
  - `sk-small-model` (weight 0.5, context: "small-model patterns sentinel")
- `manual.related_to` (lines 44-52): `["cli-claude-code", "cli-codex", "cli-gemini", "deep-research", "deep-review", "mcp-code-mode", "cli-devin"]`
  - **NOT includes `sk-small-model`**

### Symmetry Check Results

**edges.enhances:** SYMMETRIC ✓
- All three skills have mutual `enhances` edges with weight 0.5
- sk-small-model → cli-devin ✓
- sk-small-model → cli-opencode ✓
- cli-devin → sk-small-model ✓
- cli-opencode → sk-small-model ✓

**manual.related_to:** ASYMMETRIC ✗
- sk-small-model has `cli-devin` and `cli-opencode` in `manual.related_to`
- cli-devin does NOT have `sk-small-model` in `manual.related_to`
- cli-opencode does NOT have `sk-small-model` in `manual.related_to`

---

## Task 3 — description.json Consistency

### Description.json File Presence

#### sk-small-model

**File:** `.opencode/skills/sk-small-model/description.json` — EXISTS ✓

**Schema:**
- `name`: "sk-small-model" ✓
- `description`: non-empty string ✓
- `version`: "0.1.0" ✓
- `importance_tier`: "important" ✓
- `keywords`: array of strings ✓
- `trigger_examples`: array of strings ✓
- `lastUpdated`: ISO timestamp ✓
- `pattern_index`: path string ✓

#### cli-devin

**File:** `.opencode/skills/cli-devin/description.json` — DOES NOT EXIST ✗

#### cli-opencode

**File:** `.opencode/skills/cli-opencode/description.json` — DOES NOT EXIST ✗

### Schema Consistency

**Result:** INCONSISTENT ✗
- Only 1 of 3 skills has a `description.json` file
- Cannot verify schema consistency across all three skills
- Missing `description.json` for `cli-devin` and `cli-opencode` breaks metadata uniformity expectations

---

## Findings

### F3-iter11 (P2): manual.related_to asymmetry in graph-metadata.json

**Severity:** P2
**File:** `.opencode/skills/cli-devin/graph-metadata.json:44-52`, `.opencode/skills/cli-opencode/graph-metadata.json:44-52`
**Evidence:**
- `sk-small-model/graph-metadata.json:26-29` includes `cli-devin` and `cli-opencode` in `manual.related_to`
- `cli-devin/graph-metadata.json:44-52` does NOT include `sk-small-model` in `manual.related_to`
- `cli-opencode/graph-metadata.json:44-52` does NOT include `sk-small-model` in `manual.related_to`
- The `edges.enhances` field is symmetric, but `manual.related_to` is not

**Reproduction Evidence:**
```json
// sk-small-model/graph-metadata.json
"manual": {
  "related_to": ["cli-devin", "cli-opencode"]
}

// cli-devin/graph-metadata.json
"manual": {
  "related_to": ["cli-claude-code", "cli-codex", "cli-gemini", "cli-opencode", "sk-code", "mcp-code-mode", "system-spec-kit"]
  // Missing: sk-small-model
}

// cli-opencode/graph-metadata.json
"manual": {
  "related_to": ["cli-claude-code", "cli-codex", "cli-gemini", "deep-research", "deep-review", "mcp-code-mode", "cli-devin"]
  // Missing: sk-small-model
}
```

**Counter-evidence Sought:** None — asymmetry is directly observable in the files.

**Alternative Explanation:** Could be intentional if `manual.related_to` is meant to be directional (only declared by the dependent skill), but this contradicts the expectation of symmetry for advisor graph traversal.

**Confidence:** 0.9 — clear asymmetry in the data structure.

**Downgrade Trigger:** If documentation explicitly states that `manual.related_to` is directional and asymmetry is expected, this could be downgraded to P3 or informational.

**Impact:** Reduces advisor lane signal quality — the graph_causal lane reads from both ends, and asymmetry may cause incomplete relationship discovery during advisor queries.

---

### F4-iter11 (P2): Missing description.json files for cli-devin and cli-opencode

**Severity:** P2
**File:** `.opencode/skills/cli-devin/description.json` (missing), `.opencode/skills/cli-opencode/description.json` (missing)
**Evidence:**
- `sk-small-model/description.json` exists with complete schema
- `cli-devin/description.json` does not exist (read failed: file not found)
- `cli-opencode/description.json` does not exist (read failed: file not found)

**Reproduction Evidence:**
```bash
# sk-small-model
read .opencode/skills/sk-small-model/description.json → SUCCESS (36 lines)

# cli-devin
read .opencode/skills/cli-devin/description.json → FAILED: not found

# cli-opencode
read .opencode/skills/cli-opencode/description.json → FAILED: not found
```

**Counter-evidence Sought:** None — files are definitively missing.

**Alternative Explanation:** Could be that `description.json` is optional for CLI skills and only required for utility skills, but this breaks schema consistency expectations across the skill ecosystem.

**Confidence:** 1.0 — files are definitively absent.

**Downgrade Trigger:** If skill documentation explicitly states that `description.json` is optional for CLI skills, this could be downgraded to P3 or informational.

**Impact:** Inconsistent metadata file presence across skills may impact:
- Advisor/discovery systems that rely on `description.json` for skill summaries
- Automated skill catalog generation
- User-facing skill documentation completeness

---

## Verdict

**Retracted Findings:** 2 (both from iter-10, both false positives)
**New Findings:** 2 (both P2)

### Summary

1. **F1-iter10 (RETRACTED):** False positive — runtime files are correctly scoped by design
2. **F2-iter10 (RETRACTED):** False positive — skill count discrepancy due to README.md being counted
3. **F3-iter11 (P2):** `manual.related_to` asymmetry in graph-metadata.json between sk-small-model and cli-devin/cli-opencode
4. **F4-iter11 (P2):** Missing `description.json` files for cli-devin and cli-opencode (only sk-small-model has one)

Both new findings are P2 because they impact advisor/discovery signal quality and metadata consistency, but do not break core functionality.

---

## Next Focus

**Recommended dimension for iter-12:** Continue graph-metadata consistency review across other skill pairs to identify systematic asymmetry patterns, or investigate whether `description.json` presence correlates with skill family/category (e.g., required for sk-util, optional for cli).

**Alternative:** Investigate the intentional design rationale for the observed asymmetries — check if there is documentation that explains why `manual.related_to` is directional or why `description.json` is optional for certain skill types.
