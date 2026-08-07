READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = agent rosters (across 3 runtimes) + top-level governance docs.

## shared current_focus — iteration 6 of 10 — SLICE cluster 4+5: agents + governance
1. Agent rosters — find the exact cli-devin site in each (sibling-seat lists, executor lists) + line numbers. Check all 3 runtime mirrors per agent:
   - `.opencode/agents/deep-context.md` + `.claude/agents/deep-context.md` + `.codex/agents/deep-context.toml`
   - `.opencode/agents/deep-research.md` + `.claude/agents/deep-research.md` + `.codex/agents/deep-research.toml`
   - `.opencode/agents/deep-review.md` + `.claude/agents/deep-review.md` + `.codex/agents/deep-review.toml`
   - Grep `.opencode/agents/ .claude/agents/ .codex/agents/` for any OTHER agent file mentioning cli-devin/devin.
2. Governance docs (top-level) — every cli-devin/devin site + exact line + edit:
   - `AGENTS.md` (CLI dispatch rule, small-model dispatch rule)
   - `CLAUDE.md` (project root) + `.claude/CLAUDE.md` (runtime) — confirm whether either names cli-devin/devin.
   - `README.md` (cli-devin skill section + sk-prompt bullet)
   - `.opencode/skills/README.md` (skills index — cli-devin entry)
   - `.opencode/specs/descriptions.json` — is there a cli-devin ACTIVE-skill entry (vs historical spec entries)? classify carefully: a live skills index entry is active-wiring; per-spec description rows are historical.
3. Note: AGENTS.md / CLAUDE.md are mirrored — check whether `.claude/CLAUDE.md` and `.codex/` copies duplicate the AGENTS.md dispatch rules.

## known-context
Iter1 agreement: AGENTS.md:56-57 (CLI dispatch rule 'devin /', small-model dispatch rule 'cli-devin/'); README.md:942-944 (skill section) + 974 (sk-prompt bullet); deep-context.md:203 sibling seats (all 3 runtimes); deep-research.md/deep-review.md flagged but lines unverified. The .claude/.codex agent files are mirrors with identical bodies (memory: deep-loop-agent-runtime-mirrors) — a missed mirror = silent native-seat config drift.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"...", "kind":"integration_point", "reuse":"remove", "evidence":"path:line(s)",
    "relevance":0.0, "classification":"active-wiring|historical-record", "verified":true,
    "editType":"inline-edit|delete-paragraph|delete-section", "notes":"exact edit + mirror-sync note" } ] }
```
BINDING lines first (slice=agents-governance). Tool budget ~10-12.
