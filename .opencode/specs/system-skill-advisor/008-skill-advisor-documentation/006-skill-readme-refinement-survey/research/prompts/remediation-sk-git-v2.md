REMEDIATE: sk-git/README.md — zero §1 tables

Modify exactly one file: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/README.md`

# Goal

Apply the packet-005-style §1 zero-table refinement. The audit either incorrectly classified this skill as "none" (sk-git, sk-prompt) or the first remediation pass missed some tables (mcp-coco-index). This retry MUST convert every markdown table inside `## 1. OVERVIEW` to prose or a bulleted list, and verify the result with a final grep.

# Sequential thinking

Call `mcp__sequential_thinking__sequentialthinking` with at least 5 thoughts: (1) read the current README, (2) enumerate every table between `## 1.` and `## 2.` with line ranges, (3) plan prose/bullet replacements (use bullets for 6+ row lists, prose for 3-5 row lists), (4) plan TOC + anchor updates if any reference data moves to later sections, (5) write the rewrite.

# Rules

1. **Zero tables in `## 1. OVERVIEW`.** Every markdown table inside §1 must convert to prose or bullets. No exceptions. Tables in §3 FEATURES, §5 CONFIGURATION, §6 USAGE EXAMPLES, etc. are fine.
2. **Preserve every fact.** Version numbers, statistics, file paths, comparison data — all must carry through, just reformatted.
3. **No em dashes.** Replace `\xe2\x80\x94` with periods, commas, or parentheses.
4. **No HVR banned words.** `leverage`, `empower`, `seamless`, `disrupt`, `harness`, `delve`, etc.
5. **Anchor pairs.** Keep `<!-- ANCHOR:* -->` pairs balanced.

# Output contract

Write the entire revised README to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/README.md`. Do not produce any other files.

After writing, emit to stdout:
- Tables converted: N
- Em dashes replaced: N
- Lines before / after: X / Y

# Constraints

- Read-only access to all files EXCEPT `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/README.md`.
- Per-iter budget ~12 tool calls.
