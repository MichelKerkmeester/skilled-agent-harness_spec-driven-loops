Resolved route: mode=context; target_agent=@deep-context; execution=parallel_read_only_sweep; seat_label=gpt-context-smoke; do_not_run_full_loop=true

Gather-subject: Phase 004 route proof smoke for context

Shared current focus:
- `.opencode/commands/deep/context.md` router contract and general-agent verification gate.
- `.opencode/commands/deep/assets/deep_context_presentation.txt` auto setup and output contract.
- `.opencode/commands/deep/assets/deep_context_auto.yaml` auto workflow, host-writes-state, CLI seat dispatch, convergence, and synthesis steps.
- `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` deep-context skill rules.
- `.opencode/skills/cli-opencode/SKILL.md` CLI executor contract and self-invocation guard.
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/004-gpt-verification-smoke/verification-smoke.md` phase smoke procedure and existing blocker record.

Known context:
- Code graph status was stale, so fallback frontier seeding is in effect.
- Prior memory lookup failed with `E_SESSION_SCOPE`; use the directly read spec documents and workflow contracts only.
- The configured executor pool has one `cli-opencode` seat using `openai/gpt-5.5`, so cross-executor agreement cannot satisfy the default agreement minimum.

Output schema:

```json
{
  "findings": [
    {
      "unit_id": "sha256(path:symbol:kind)",
      "path": "...",
      "symbol": "...",
      "kind": "reuse_candidate|integration_point|convention|dependency|gap",
      "signature": "...",
      "reuse": "extend|compose|wrap|import|verify",
      "evidence": "file:line",
      "relevance": 0.0,
      "notes": "..."
    }
  ]
}
```

Seat dispatch was blocked by the `cli-opencode` self-invocation guard before launch.
