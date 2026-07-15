# Seat gpt-mirror-parity — iteration 4 (global #62)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-mirror-parity
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

## Review: gpt-mirror-parity seat

**Angle:** Verify the Claude (`.claude/agents/orchestrate.md`) and Codex (`.codex/agents/orchestrate.toml`) orchestrate mirrors do not embed the wrong-runtime dispatch template, against the OpenCode canonical (`.opencode/agents/orchestrate.md`).

### What I traced

The "dispatch templates" — every place the orchestrator is told which agent-definition file to **read + include before a `task`/Agent dispatch** — are these load-bearing spots: the Path Convention header, §2 Agent Files table, §2 Agent Loading Protocol, the Prompt/Agent Consistency Guard step 4, the §3 Task Format `Agent Definition` field, the §3 PDR `Agent Def` line, and the §9 anti-pattern note.

I verified each, per runtime:

- **Claude mirror**: Path Convention `.claude/agents/*.md` (L19); Agent Files table all `.claude/agents/*.md` (L172–177); Consistency Guard `.claude/agents/code.md` (L164); Task Format `.claude/agents/<name>.md` (L198); PDR `.claude/agents/<name>.md` (L279); anti-pattern correctly localized with "canonical source lives in `.opencode/agents/`" (L822). **Zero `.toml` leakage** (grep confirmed empty).
- **Codex mirror**: Path Convention `.codex/agents/*.toml` (L24); Agent Files table all `.codex/agents/*.toml` (L176–182); Consistency Guard `.codex/agents/code.toml` (L169); Task Format `.codex/agents/<name>.toml` (L202); PDR `.codex/agents/<name>.toml` (L284); anti-pattern `.codex/agents/` (L827).

The three cross-runtime `.opencode/` references that survive in each mirror are all **intentional and correct**: (1) the "Runtime Directory Resolution" sentence deliberately lists all three profiles; (2) Rule 2b's component-creation trigger `.opencode/skills/**`, `.opencode/agents/**`, `.opencode/commands/**` points at the canonical component source-of-truth, which is `.opencode/` regardless of active runtime — not a dispatch instruction; (3) the §9 "canonical source lives in `.opencode/agents/`" note. None of these direct the orchestrator to read the wrong runtime's agent definitions.

**Conclusion on the core angle: the dispatch templates are correctly localized in both mirrors. No wrong-runtime dispatch template is embedded.**

### One genuine parity nit (off the load-bearing path)

The §8 Orchestrator Self-Budget table self-describes as `This orchestrate.md file` in the Codex mirror (`.codex/agents/orchestrate.toml:787`), but that runtime's file is `orchestrate.toml`. It's a stale shared phrase carried verbatim from the canonical into the `.toml`. It is **not** a dispatch template — it never tells the orchestrator which file to read for a dispatch — so it cannot cause a wrong-runtime dispatch. Pure cosmetic/traceability hygiene (P2). I deliberately did **not** report the pervasive `task`/`Agent` tool-name vocabulary (shared identically across all three files, a deliberate shared vocabulary, not a localization defect) to avoid a false positive.

```json
{"seat":"gpt-mirror-parity","model":"openai/gpt-5.5-fast","angle":"Runtime dispatch templates localized: Claude/Codex orchestrate mirrors must not embed the wrong-runtime dispatch template.","verdict":"PASS","summary":"Dispatch templates fully localized in both mirrors (.claude/*.md, .codex/*.toml); no wrong-runtime template embedded. One cosmetic self-ref nit in Codex .toml.","files_reviewed":[".claude/agents/orchestrate.md",".codex/agents/orchestrate.toml",".opencode/agents/orchestrate.md"],"findings":[{"severity":"P2","dimension":"traceability","title":"Codex mirror self-describes as 'orchestrate.md' inside the .toml","file":".codex/agents/orchestrate.toml:787","evidence":"§8 Orchestrator Self-Budget row reads 'This orchestrate.md file' but the runtime file is orchestrate.toml; the phrase is carried verbatim from the canonical .md.","why":"Cosmetic mirror-parity inaccuracy: a Codex-runtime self-reference points at a .md filename. It is a self-budget descriptor, not a dispatch template, so it cannot misroute a dispatch — hygiene only.","recommendation":"In the Codex mirror, change the row to 'This orchestrate.toml file' (or make it extension-neutral, e.g. 'this agent definition file') so each mirror's self-reference matches its own format."}]}
```
