# Seat gpt-mirror-parity — iteration 1 (global #59)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-mirror-parity
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=0 P2=1

## Analysis

Confirmed personally by reading the lines:

- `.claude/agents/deep-context.md:11` → `.claude/agents/*.md` ✓
- `.claude/agents/deep-research.md:11` → `.claude/agents/*.md` ✓
- `.claude/agents/deep-review.md:11` → `` `.opencode/agents/*.md` `` ✗ — points at the **opencode** runtime, inconsistent with its two siblings in the same `.claude/` directory.

The opencode original (`.opencode/agents/deep-review.md:28`) correctly says `.opencode/agents/*.md`, and the codex mirror (`.codex/agents/deep-review.toml:15`) correctly says `.codex/agents/*.toml`. Only the Claude mirror of deep-review was not re-pointed during conversion — a genuine mirror-drift the prior multi-model pass missed.

---

## Analysis — seat `gpt-mirror-parity`

**Scope swept:** all nine deep-* mirror files for context/research/review across the three runtimes (`.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`), via exact body-diff (path/frontmatter/TOML-wrapper tokens normalized out), then personal line-level verification of every flagged delta.

**Missing-mirror check:** PASS. All three agents (context, research, review) have a file present in all three runtime directories (plus deep-improvement, out of seat scope). No silent native-seat absence.

**Body-parity check:** Two of three agents (deep-context, deep-research) are mirror-identical modulo legitimate per-runtime tokens — same canonical refusal string verbatim (`REFUSE: nested Task tool dispatch is forbidden for LEAF agents. Returning partial findings instead.`), same section header order, same convergence thresholds (0.05), tool budgets (8–11 / 12 max), status enums, and output schema. Frontmatter `tools:`/`permission:`/`model` differences are expected runtime metadata, not body drift, and correctly track each agent's LEAF-vs-write role.

**The one real defect — deep-review Claude mirror Path Convention drift:**
The `**Path Convention**` line is a self-referential instruction telling the agent which directory holds its own canonical spec. Every other mirror re-points it to its host runtime; the Claude deep-review mirror still names the opencode path. Behavioral blast radius is low (it does not crash the loop, mis-route tools, or corrupt findings — the agent reviews an external target, not itself), so this is a traceability/correctness hygiene defect, not a blocker. It is exactly the mirror-conversion drift this seat exists to catch, and it is grep-checkable (a parity test asserting each `.claude/agents/*.md` Path Convention names `.claude/...` would fail on this file). I'm calibrating the Explore subagent's "P1" down to **P2**: real and verified, but negligible runtime impact.

**Verdict: CONDITIONAL** — no P0/P1; one verified P2 mirror-drift worth a one-line fix.

```json
{"seat":"gpt-mirror-parity","model":"openai/gpt-5.5-fast","angle":"deep-* native agent parity: .opencode/agents/deep-{context,research,review}.md vs .claude/agents/*.md vs .codex/agents/*.toml — body drift or a missing mirror (= silent native-seat failure).","verdict":"CONDITIONAL","summary":"All 9 mirrors present; context+research bodies identical across runtimes. One verified drift: .claude deep-review Path Convention names .opencode path, not .claude.","files_reviewed":[".opencode/agents/deep-context.md",".claude/agents/deep-context.md",".codex/agents/deep-context.toml",".opencode/agents/deep-research.md",".claude/agents/deep-research.md",".codex/agents/deep-research.toml",".opencode/agents/deep-review.md",".claude/agents/deep-review.md",".codex/agents/deep-review.toml"],"findings":[{"severity":"P2","dimension":"traceability","title":"Claude deep-review mirror Path Convention points to opencode runtime path, not its own","file":".claude/agents/deep-review.md:11","evidence":"Line 11 reads: **Path Convention**: Use only `.opencode/agents/*.md` as the canonical runtime path reference. Its two sibling Claude mirrors are correctly re-pointed: .claude/agents/deep-context.md:11 and .claude/agents/deep-research.md:11 both say `.claude/agents/*.md`. The opencode original (.opencode/agents/deep-review.md:28) and codex mirror (.codex/agents/deep-review.toml:15 = `.codex/agents/*.toml`) are each correct for their runtime — only this Claude mirror was not re-pointed during conversion.","why":"The Path Convention is a self-referential instruction naming the agent's own canonical spec directory. In the Claude runtime, deep-review is told its canonical path lives under .opencode, contradicting its actual location and diverging from both sibling Claude agents. It is a genuine mirror-conversion drift (a parity test grepping each .claude/agents/*.md for a .claude path reference would fail here). Impact is low — the agent reviews an external target rather than itself, so the loop does not break — but it is a traceability defect the prior multi-model pass missed.","recommendation":"Change .claude/agents/deep-review.md:11 to: **Path Convention**: Use only `.claude/agents/*.md` as the canonical runtime path reference. — matching its deep-context/deep-research Claude siblings. Add a parity assertion to the mirror generator/test so each runtime's Path Convention line names that runtime's own agent path."}]}
```
