# Seat gpt-comment-hygiene-scope — iteration 3 (global #72)

- Model: `kimi-for-coding/k2p7` · Executor: opencode · Angle: gpt-comment-hygiene-scope
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=0 P2=1

## Analysis

Reviewed the 027 new lib modules (CLI shims, launcher/proxy, plugins, mcp_server/lib changes for BFS/vector/BM25/ports, and command routers/dependencies) with ripgrep and targeted reads. The new code modules are clean: no TODO/FIXME/XXX/HACK markers or commented-out dead code were found.

One real hygiene finding remains in a direct dependency of the new `/doctor:update` router:

```json
{
  "seat": "gpt-comment-hygiene-scope",
  "model": "openai/gpt-5.5-fast",
  "angle": "Comment hygiene: stale TODO/FIXME/commented-out dead code left in the new modules.",
  "verdict": "CONDITIONAL",
  "summary": "One stale phase-id TODO in doctor_update.yaml; new mcp_server/lib, bin, and plugin modules are otherwise clean.",
  "files_reviewed": [
    ".opencode/bin/spec-memory.cjs",
    ".opencode/bin/skill-advisor.cjs",
    ".opencode/bin/code-index.cjs",
    ".opencode/bin/lib/launcher-session-proxy.cjs",
    ".opencode/bin/mk-spec-memory-launcher.cjs",
    ".opencode/plugins/mk-spec-memory.js",
    ".opencode/plugins/mk-code-graph.js",
    ".opencode/commands/doctor/update.md",
    ".opencode/commands/doctor/assets/doctor_update.yaml",
    ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/index.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts"
  ],
  "findings": [
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Stale phase-id TODO left in /doctor:update workflow asset",
      "file": ".opencode/commands/doctor/assets/doctor_update.yaml:409",
      "evidence": "Line 409 contains: // TODO(022): use resolveActiveProfileDbPath from shared/embeddings/profile.js for unambiguous active-profile selection when multiple provider DBs coexist.",
      "why": "The new /doctor:update router loads this workflow asset. The inline TODO embeds a phase-id label (022) and leaves deferred work in code, violating the project's comment-hygiene rule. It also admits the context-index coverage step picks the first matching context-index__*.sqlite arbitrarily when multiple provider DBs coexist.",
      "recommendation": "Resolve the active-profile DB selection (resolveActiveProfileDbPath now exists) and remove the inline TODO, or move the remaining work to a spec-doc task and replace the comment with a concise why."
    }
  ]
}
```
