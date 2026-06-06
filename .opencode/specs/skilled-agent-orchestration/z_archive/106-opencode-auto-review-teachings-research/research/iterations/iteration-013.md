Iteration 013 complete. I've successfully analyzed the diagnostic logging pattern:

**Key findings:**
- **Upstream's `initDebugLogger`**: Non-blocking async-IIFE wrapper with lazy mkdir, safe stringify, ISO-timestamp prefix, and plaintext format
- **Our skill-advisor hooks**: MORE structured JSONL format with rotation/retention (200 records), but use synchronous file operations (blocking)
- **Our code-graph feedback handler**: Simple JSONL append without lazy patterns or rotation
- **Our plugins**: No file-based logging

**Adoption recommendations:**
1. Adopt async-IIFE wrapper for non-blocking writes (critical for hook performance)
2. Adopt lazy mkdir flag (closure-based `dirReady` pattern) to reduce syscalls
3. Keep our JSONL format (more queryable than upstream's plaintext)
4. Add enable gate (config or env var) to skill-advisor hooks

**Reject list:**
- Upstream's plaintext format (less queryable)
- Upstream's append-only (unbounded growth risk)
- Upstream's workspace-local path (conflicts with per-user metrics design)

Output: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-013.md" /> (76 lines)

All acceptance criteria met. Ready for iteration 014.
{
        try {
          await mkdir(logDir, { recursive: true })
        } catch {}
        dirReady = true
      }
      try {
        await appendFile(logPath, line)
      } catch {}
    })()
  }
}
```

### Enable Conditions
| Source | Value | Notes |
|--------|-------|-------|
| config.debug | bool from `~/.config/opencode/plugin/auto-review.json` | priority 1 |
| AUTO_REVIEW_DEBUG | env var, "1" enables | priority 2 |

### Per-Pattern Comparison
| Aspect | Upstream auto-review | Our skill-advisor hooks | Our code-graph hooks | Our plugins (mk-*) |
|--------|---------------------|------------------------|----------------------|---------------------|
| Log path | `<workspace>/.reflection/debug.log` | `<tmpdir>/speckit-skill-advisor-metrics/<workspaceHash>-diagnostics.jsonl` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts" lines="229-231" /> | `<workspace>/.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts" lines="46-47" /> | none |
| Format | line: `[<ISO>] [AutoReview] <msg>\n` (plaintext) | JSONL (structured) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts" lines="328-334" /> | JSONL (structured) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts" lines="52-58" /> | N/A |
| Enable gate | config.debug OR env=1 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-005.md" lines="38" /> | always enabled (no gate) | always enabled (no gate) | N/A |
| Lazy mkdir | YES (closure flag `dirReady`) <ref_file file="/tmp/opencode-plugins/packages/auto-review/auto-review.ts" lines="85-90" /> | NO (mkdirSync on every write) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts" lines="218-220" /> | NO (mkdirSync on every write) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts" lines="49-50" /> | N/A |
| Safe stringify | YES (try JSON.stringify, fall back to String) <ref_file file="/tmp/opencode-plugins/packages/auto-review/auto-review.ts" lines="88-92" /> | YES (JSON.stringify with validation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts" lines="328-334" /> | NO (direct JSON.stringify) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts" lines="63" /> | N/A |
| Async-IIFE wrapper | YES (fire-and-forget async wrapper) <ref_file file="/tmp/opencode-plugins/packages/auto-review/auto-review.ts" lines="94-102" /> | NO (synchronous writeFileSync) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts" lines="243-248" /> | NO (synchronous appendFileSync) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts" lines="63" /> | N/A |
| Rotation / retention | NONE (append-only) | YES (MAX_DURABLE_DIAGNOSTIC_RECORDS = 200) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts" lines="150" /> | NONE (append-only) | N/A |

### Adoption Recommendations
1. **Adopt async-IIFE wrapper for non-blocking writes** in skill-advisor hooks and code-graph feedback handler. Upstream's pattern `;(async () => { await appendFile(...) })()` allows the caller to continue without waiting for disk I/O. This is critical for hook performance since hooks block the user's workflow. Current synchronous `writeFileSync`/`appendFileSync` in our hooks can cause perceptible delays on slow filesystems.
2. **Adopt lazy mkdir flag** (closure-based `dirReady` pattern) from upstream. Our hooks call `mkdirSync(dirname(path), { recursive: true })` on every write, which is unnecessary overhead. Upstream's pattern only creates the directory on the first write, then reuses the closure flag. This reduces syscalls and improves performance.
3. **Keep our JSONL format** (structured) — it's more queryable than upstream's plaintext format. JSONL enables structured queries (e.g., `jq '.status == "fail_open"'`) and is machine-readable for observability pipelines. Upstream's plaintext is human-friendly but harder to parse programmatically.
4. **Add enable gate** (config or env var) to skill-advisor hooks. Currently, diagnostics are always enabled, which may be undesirable in production or CI environments. Upstream's `config.debug || process.env.AUTO_REVIEW_DEBUG === "1"` pattern provides operator control without requiring code changes.

### Reject List
| Pattern | Why reject | Notes |
|---------|-----------|-------|
| Upstream's plaintext format | Less queryable than JSONL | Our structured JSONL is better for observability pipelines |
| Upstream's append-only (no rotation) | Unbounded growth risk | Our skill-advisor's 200-record rotation is better for long-running processes |
| Upstream's workspace-local path | Conflicts with per-user metrics design | Our tmpdir-based path with workspace hash enables cross-workspace aggregation |

## Convergence Signal
`newInfoRatio: 0.75` — moderate. This iteration identified specific performance and UX improvements (async-IIFE, lazy mkdir) while confirming our JSONL format is superior to upstream's plaintext. `dimension status: FULLY EXTRACTED for diagnostic logging pattern`
