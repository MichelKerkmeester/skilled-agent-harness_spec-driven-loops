# Iteration 006 — Traceability: sibling deep-loop TOML paths

## Focus

Checked deep-review and deep-research runtime references for absent `.opencode/agents/*.toml` paths.

## Findings

### F008 — P1 — deep-review loop protocol lists absent `.opencode/agents/deep-review.toml`

The deep-review loop protocol lists OpenCode/Copilot as `.opencode/agents/deep-review.md`, Claude as `.claude/agents/deep-review.md`, and OpenCode as `.opencode/agents/deep-review.toml`. No `.opencode/agents/*.toml` files exist in this workspace. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md:721-724] [SOURCE: Glob .opencode/agents/*.toml result: no files found]

### F009 — P1 — deep-research capability matrix lists absent `.opencode/agents/deep-research.toml`

The deep-research capability matrix lists `.opencode/agents/deep-research.toml` and says the TOML mirror must keep the same lifecycle/reducer contract as Markdown mirrors. No `.opencode/agents/*.toml` files exist. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md:51-55] [SOURCE: Glob .opencode/agents/*.toml result: no files found]

## Verdict Rationale

Both are P1 because they document runtime paths and maintenance obligations for files absent from the current runtime surface.

Review verdict: CONDITIONAL
