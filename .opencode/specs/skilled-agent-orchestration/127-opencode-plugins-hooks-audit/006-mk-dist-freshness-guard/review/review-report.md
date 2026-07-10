# Plugin Audit Review - mk-dist-freshness-guard

> **Iteration 2 cross-check (Opus 4.8):** 7 iteration-1 findings adjudicated (3 adjusted, 4 confirmed); 5 new findings. Full detail in [`iteration-002-opus-4.8.md`](./iteration-002-opus-4.8.md).

> **Source:** GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast --variant high`) read-only audit via cli-opencode, 2026-07-10. Findings are hypotheses with file:line evidence, pending remediation-time confirmation.

## Summary

The default-export shape and terminal-output discipline are correct, but the shared checker can incorrectly bless changed sources and silently classify checker failures as fresh. OpenCode also lacks Claude's immediate post-edit check, while the Claude path has malformed-input and timeout-budget failure modes.

| Field | Value |
|-------|-------|
| Plugin | `.opencode/plugins/mk-dist-freshness-guard.js` (Dist-freshness warn guard) |
| Claude hook counterpart | .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh, .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh, .claude/settings.json |
| Verdict | REFINE |
| Findings | 0 P0 / 5 P1 / 1 P2 / 1 refinement (7 total) |

**Parity assessment:** Both surfaces share the same core freshness logic and therefore share its hash-validation and error-suppression defects. Claude provides immediate post-edit checks that OpenCode lacks, while OpenCode has stronger handler-level exception containment; the Claude path can instead overrun its hook deadline or crash on malformed payload shapes.

## Finding Registry

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| F1 | P1 | bug | `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:430` | A source-hash mismatch can be silently blessed as fresh | high |
| F2 | P1 | error | `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:354` | Checker errors are reported as fresh and suppressed by both consumers | high |
| F3 | P1 | parity | `.opencode/plugins/mk-dist-freshness-guard.js:109` | OpenCode can retain a fresh cache for two minutes after a source edit | high |
| F4 | P1 | bug | `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:68` | Sequential subprocess timeouts exceed the enclosing Claude hook timeout | high |
| F5 | P1 | parity | `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:47` | Valid but malformed Claude hook JSON can crash the fail-safe hook | high |
| F6 | P2 | bug | `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:17` | Standalone checker fallback resolves one directory too shallow | high |
| F7 | refinement | refinement | `.opencode/plugins/mk-dist-freshness-guard.js:88` | Session deduplication and the audit log have no retention bounds | high |

## Finding Detail

### F1 - A source-hash mismatch can be silently blessed as fresh
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:430`
- **Evidence:** After the stored hash differs from the current source hash, lines 445-471 only report stale when a source mtime is newer than the dist entry. If the changed source preserves an older mtime, lines 473-487 overwrite the cache with the changed hash and return status fresh without proving that a build produced the dist.
- **Impact:** Timestamp-preserving edits, restored archives, rsync operations, or manually touched dist artifacts can permanently hide stale compiled output from both OpenCode and Claude.
- **Proposed fix:** Have every watched build write the source hash after successful compilation, and treat a mismatch against an existing build-written hash as stale regardless of mtimes. If first-run bootstrapping is required, represent it as unknown/degraded rather than updating the cache from a read-only check.

### F2 - Checker errors are reported as fresh and suppressed by both consumers
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:354`
- **Evidence:** freshnessError sets stale:false at lines 354-363. check-all derives its status solely from stale results at lines 590-592, so an all-error run becomes status fresh and exits 0. The plugin discards non-stale results at .opencode/plugins/mk-dist-freshness-guard.js:57-59, while the Claude wrapper only prints payloads with stale:true at .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:52-60.
- **Impact:** Missing package roots, unreadable sources, absent configured source paths, and internal checker failures produce no warning or audit signal, making a broken guard indistinguishable from genuinely fresh output.
- **Proposed fix:** Keep execution fail-open, but aggregate errors into a degraded/error status distinct from fresh. Log and inject a bounded CHECK ERROR message in OpenCode, and emit an actionable warning from the Claude wrapper while still exiting 0.

### F3 - OpenCode can retain a fresh cache for two minutes after a source edit
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/plugins/mk-dist-freshness-guard.js:109`
- **Evidence:** staleForInjection reuses staleCache for STALE_CACHE_TTL_MS, configured as 120000 ms at line 28. The plugin only force-refreshes for session.created and selected Bash commands at lines 117-138; it does not invalidate the cache for source-mutating tools. Claude instead checks the edited file immediately after every Write or Edit at claude-posttooluse.sh:90-105.
- **Impact:** After OpenCode edits a watched source, subsequent turns can trust stale compiled output without receiving the warning that Claude receives immediately. A refresh occurs only after the TTL, a new session, or a Bash command matching the narrow risky-command regex.
- **Proposed fix:** Invalidate staleCache when a write/edit/apply-patch operation targets a watched source, then force the next system transform to refresh. If an after-execution hook is available, run checkFileFreshness there for direct parity with Claude.

### F4 - Sequential subprocess timeouts exceed the enclosing Claude hook timeout
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:68`
- **Evidence:** The comment checker may consume 8 seconds at lines 68-75 and the dist checker may then consume another 8 seconds at lines 93-100. The complete PostToolUse hook is limited to 10 seconds by .claude/settings.json:92.
- **Impact:** A slow or hung comment check can leave insufficient time for the dist check, and Claude can terminate the entire hook before the stale-dist warning is delivered.
- **Proposed fix:** Use one monotonic deadline and pass only the remaining budget to each subprocess, run independent checks concurrently, or increase the enclosing timeout beyond the combined worst-case duration with startup overhead.

### F5 - Valid but malformed Claude hook JSON can crash the fail-safe hook
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:47`
- **Evidence:** JSON parsing accepts any JSON value, but lines 47, 52-53, and 59 immediately assume dictionaries and a string cwd. Inputs such as [], {"tool_input":null}, or {"cwd":null} raise AttributeError or TypeError outside the guarded subprocess blocks. The OpenCode hooks wrap their complete handlers in try/catch at mk-dist-freshness-guard.js:117-149.
- **Impact:** Unexpected but syntactically valid hook payloads violate the documented always-exit-0 contract, skip both checks, and can surface a Claude hook failure.
- **Proposed fix:** Validate that the root and tool_input are dictionaries and cwd/file_path are strings before use, falling back to os.getcwd() where needed. Add a top-level fail-open exception boundary and malformed-shape regression tests.

### F6 - Standalone checker fallback resolves one directory too shallow
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:17`
- **Evidence:** From code-quality/scripts, ../../../.. resolves to the repository's .opencode directory, not the workspace root. Line 34 then appends .opencode/skills/... again, yielding a path containing .opencode/.opencode when the current-working-directory lookup fails.
- **Impact:** Invoking the checker outside the repository root makes its documented fallback fail and silently disables dist-staleness checking.
- **Proposed fix:** Traverse five parent directories to the workspace root, or derive the shared checker path from the script location without re-appending .opencode ambiguously. Add a test that launches the wrapper from an unrelated cwd.

### F7 - Session deduplication and the audit log have no retention bounds
- **Severity / Category / Confidence:** refinement / refinement / high
- **Location:** `.opencode/plugins/mk-dist-freshness-guard.js:88`
- **Evidence:** sessionWarned only receives additions at lines 131-134; unlike mk-skill-advisor.js:692-700, this plugin does not handle session.deleted or disposal events. appendGuardLog also appends indefinitely at line 70 without rotation or size enforcement.
- **Impact:** Long-lived OpenCode processes accumulate session IDs in memory, and repeated warnings grow the workspace log indefinitely.
- **Proposed fix:** Delete session IDs on session.deleted, clear state on process-disposal events, and apply a small entry-count or size bound. Rotate or truncate the log at a documented maximum while preserving recent audit evidence.

## Files Reviewed

- `.opencode/plugins/mk-dist-freshness-guard.js`
- `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`
- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh`
- `.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`
- `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh`
- `.claude/settings.json`
- `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts`
- `.opencode/plugins/mk-skill-advisor.js`
- `.opencode/skills/system-spec-kit/scripts/package.json`
- `.opencode/skills/mcp-code-mode/mcp_server/package.json`
