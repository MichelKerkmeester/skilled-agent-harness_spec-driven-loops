READ-ONLY deep-context analyzer seat (parallel agreement pool). Analyze via Read/Grep/Glob only. Return a structured finding set as your FINAL message. Never write files.

## gather-subject
Deprecate the `.opencode/skills/cli-devin` skill and remove all ACTIVE references to it across the framework (skills, commands, YAMLs, agents, AGENTS.md, CLAUDE.md, README, cross-runtime mirrors). Historical records under `.opencode/specs/**`, `**/changelog/**`, and benchmark `**/state/*.jsonl` / `per-probe*.jsonl` / eval outputs are OUT of scope for editing — but TAG them so the host can confirm the active-vs-historical boundary.

## shared current_focus — iteration 1 of 10 — SLICE cluster 1: the cli-devin skill itself + deletion surface
- `.opencode/skills/cli-devin/**` — enumerate structure: SKILL.md (purpose, which binary/model it dispatches, permission modes, the prompt/dispatch contract it owns), README.md, graph-metadata.json (skill-graph edges + key_files), references/, assets/, manual_testing_playbook/, changelog/.
- What does this skill UNIQUELY provide that other skills/commands/agents depend on? (the cli-devin dispatch contract, permission modes, --agent-config read-only allowlist, any model profiles or quota pools it owns.)
- What BREAKS if the directory is deleted? Identify hard dependency edges: skill-graph reciprocal edges (other skills' graph-metadata.json that point at cli-devin), any code/doc/YAML that reads or names a `cli-devin` path.

## known-context
- Direct precedent `132-cli-gemini-deprecation` (Level 3, shipped) scoped removal to "active, non-spec references" and left historical spec docs untouched. Follow that boundary.
- cli-devin is a CLI executor option in the deep loops (`--executor=cli-devin`) and in `sk-prompt-small-model` model routing. It has 2 permission modes (not 3). `model-profiles.json` is the single source for model profiles.
- Other active-wiring clusters (note any you encounter, don't fully map yet): model registry (sk-prompt-small-model), deep-loop `executor-config.ts`/`executor-audit.ts` + `deep_start-*-loop` YAMLs, agent rosters (.opencode/.claude/.codex), governance docs (AGENTS.md/CLAUDE.md/README.md), skill-graph edges.

## EMPHASIS (native-b)
Prioritize the DEPENDENCY / integration edges — who references or depends on cli-devin and what breaks on deletion — and rigorously CLASSIFY every reference as active-wiring vs historical-record vs skill-internal.

## output schema — return ONLY this JSON after your BINDING lines (no prose around it)
```json
{ "findings": [
  { "path": "relative/path", "symbol": "function/section/key or '-'",
    "kind": "reuse_candidate|integration_point|convention|dependency|gap",
    "signature": "short signature or section title",
    "reuse": "extend|compose|wrap|import|remove|leave",
    "evidence": "path:line", "relevance": 0.0,
    "classification": "active-wiring|historical-record|skill-internal",
    "notes": "for active-wiring: the exact removal/edit action needed" }
] }
```
Emit BINDING lines first (gatherSubject, slice, mode=context, specFolder=.opencode/specs/skilled-agent-orchestration/142-cli-devin-deprecation), then the JSON. Verified pointers (path:line), not source bodies. Tool budget ~8-12.
