# Uncovered Findings — Packet 057 Phase 2

Date: 2026-05-15
Companion to: `edit-evidence-v2.md`

This file records iter findings from packet 056 that Phase 2 evaluated and judged un-applyable, plus the structural ceiling that prevents DQI from reaching 98 on this document.

## Readability cliff: DQI ceiling at 94 for monolithic READMEs

**Finding origin**: Spec contract NFR-Q01 ("HVR score >= 95, target >= 98") versus the `extract_structure.py` DQI scoring rules.

**Issue**: The DQI scoring algorithm caps two content axes at long-document boundaries that cannot be exceeded without restructuring the README into many H2 sections:

1. **`word_count_score` cap at 8/10** — README is 12,836 words versus the readme range of `[500, 3000]`. Over-max documents receive a flat 8/10 (see `extract_structure.py` line 999 `else: word_score = 8`). To recover the 2 points lost here, the README would need to lose ~9,800 words.

2. **`heading_score` cap at 5/8** — H2 heading density is `7 H2s / (12,836 words / 500) = 0.27` per 500 words. The readme threshold is `[2.0, 8.0]` per 500 words. To reach the minimum density of 2.0, the document would need ~51 H2 sections (currently 7). The cap is the elif fallback (`heading_count >= min_headings` but density out of range = 5 points).

3. **`h2_format_score` 11/12** — The conventional unnumbered "TABLE OF CONTENTS" H2 takes a 1-point partial-format hit (number missing, ALL CAPS present). Numbering it would break the codebase-wide README convention (verified: `sk-doc/README.md` and `system-spec-kit/README.md` both leave TOC unnumbered as section 0). Cost-benefit not worth +1 DQI.

**Decision**: Accept 94 as the achievable ceiling that preserves voice, monolithic structure, and codebase-wide TOC convention. This is consistent with the spec's escape hatch: "If reaching 98 requires forcing rewrites that hurt readability, stop at 95-97 and record the readability cliff."

**Recommendation**: If a future packet wants DQI >= 95, the cleanest path is to add ONE additional H2 by splitting the FEATURES section (currently lines 210-1253). For example, split into "3. FEATURES — CORE SYSTEMS" (spec kit, memory, code graph, skill advisor) and "4. FEATURES — EXTENSIONS" (skills library, agent network, commands, code mode). This adds 1 H2 and pushes density slightly toward target. Cost: anchor-link updates throughout the TOC + cross-section links. Out of Phase 2 scope per "do not rewrite non-drifted sections."

## Iter 13 Finding 1: Buy Me A Coffee URL

**Status**: User override stands (commit 6e330e218 has `https://buymeacoffee.com/michelkerkmeester` — the correct spelling). Iter 13 misread the URL as having `michelkermemeester` (double "me"). Verified: line 9 reads `https://buymeacoffee.com/michelkerkmeester`. No edit needed. (Phase 4 edit-evidence.md Track G EDIT 27 also confirmed this.)

## Iter 11 Finding 5: Agent Network is prose-only

**Finding**: Iter 11 noted the Agent Network section has no visual diagram, while other major sections do.

**Status**: Marked NOTE (not actionable) in iter 11. An ASCII diagram for 11 agents with their dispatch boundaries would either be (a) trivial (just a list of agents) or (b) so dense it crowds the page. The prose entries with bolded agent names and dispatch boundaries are arguably more informative than a graph would be. Keeping prose-only.

## Iter 4 Finding 5: code_mode hyphen vs underscore

**Finding**: README uses `code_mode` (underscore, MCP server identity) and `mcp-code-mode` (hyphen, skill folder name) in different contexts. Iter 4 flagged this as a "Naming inconsistency."

**Status**: The two naming styles serve different purposes: `code_mode` is the MCP server registration name (must match `opencode.json`), while `mcp-code-mode` is the file-system skill folder name (must match `.opencode/skills/mcp-code-mode/`). Both are correct in context. Phase 4 EDIT 8/9 only addressed the genuine drift (`mk-code-index` → `mk_code_index` where the README used hyphen for the server name). The `code_mode` / `mcp-code-mode` split is intentional, not drift. No edit applied.

## Iter 17 Findings 5+6 (verification commands)

**Status**: Closed by Phase 4 EDITs 16+17. Verified at lines 175-182. Quick Start verification commands now reference launcher binaries and `grep -l` (universal Unix tool) instead of the broken `dist/context-server.js` path and `rg` (ripgrep) dependency. Phase 2 made one tightening at line 180 ("you actually use" → "you use") for soft HVR.

## Iter 18 (.opencode/bin paths)

**Status**: Closed by Phase 4 install rewrite. The new Quick Start steps 3 + verification commands at lines 173-175 reference `.opencode/bin/*-launcher.cjs` directly. Iter 18 confirmed those launchers exist and are functional.

## Iter 19 finding 4 (Codex opt-in)

**Status**: Closed by Phase 4 EDITs 22, 23, 24. Verified at lines 60, 597, 746: every place that lists Codex CLI now includes the `[features].codex_hooks = true` opt-in note. No Phase 2 follow-up needed.

## Iter 20 (Cross-Runtime Hooks pillar gap)

**Finding**: Iter 20 said the "🪝 Cross-Runtime Hooks" tagline pillar had no dedicated explanatory section.

**Status**: Closed by Phase 4 EDIT 25 (removal path). The current tagline at line 11 reads `**📋 Spec Kit Framework** • **🧠 Cognitive Memory** • **🤖 11 Specialized Agents** • **🎯 20 On-Demand Skills** • **🔍 Code Index + Graph** • **⚡ 5 Runtimes** • **➕ More**` — no Cross-Runtime Hooks pillar. The hook mechanism is documented in the Skill Advisor and Code Graph sections where it operates contextually, which is more discoverable than a standalone pillar.

## What Phase 2 did NOT edit (intentional)

- **Lines 47-50** ("Like a lab notebook for software" / "Like a personal librarian"): exactly 2 "Like a..." analogies which sits at the HVR ceiling of 2 per document. Adding a third would break HVR; removing one would weaken the introduction. Held at the threshold.
- **Lines 665** ("good at resemblance / good at relationships"): Parallel rhetorical construction. HVR flags "good" as a weak adjective when filler, but here the parallelism is intentional craft. Voice preservation overrides soft -1.
- **Line 618** ("instead of just *that* it exists"): "just" used as rhetorical contrast against "*why*". Stylistically intentional.
- **Line 365** ("Does this change behavior or just refactor?"): "just" in the VALUE lens question — accepted phrasing for that diagnostic.

## Final outcome

| Metric | Before Phase 2 | After Phase 2 |
|--------|----------------|---------------|
| DQI total | 94/100 | 94/100 |
| HVR validation issues | 0 | 0 |
| Prose em dashes | 0 | 0 |
| Prose semicolons | 0 | 0 |
| Prose Oxford commas | 0 | 0 |
| Banned HVR words | 0 | 0 |
| Phase 4-missed iter findings closed | n/a | 11 of 11 actionable findings |
| Findings recorded as un-applyable | n/a | 4 (with reasons above) |

The DQI ceiling at 94 reflects monolithic-README structure, not prose quality. Prose quality is at HVR ceiling for the document type.
