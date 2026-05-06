# Control: session-prime-startup-brief

```
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:43:let buildStartupBrief: ((highlightCount?: number, stateScope?: { specFolder?: string; claudeSessionId?: string }) => StartupBrief) | null = null;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:47:  buildStartupBrief = mod.buildStartupBrief;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:198:    startupBrief = buildStartupBrief
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:199:      ? buildStartupBrief(undefined, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:205:    startupBriefWarning = `buildStartupBrief threw: ${err instanceof Error ? err.message : String(err)}`;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:208:  if (!buildStartupBrief) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:214:    startupBriefWarning = 'buildStartupBrief returned null';
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:42:let buildStartupBrief: ((highlightCount?: number, stateScope?: { specFolder?: string; claudeSessionId?: string }) => StartupBrief) | null = null;
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:45:  buildStartupBrief = mod.buildStartupBrief;
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:177:    startupBrief = buildStartupBrief
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:178:      ? buildStartupBrief(undefined, sessionId || specFolder
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:186:    process.stderr.write(`[copilot:session-prime] buildStartupBrief threw: ${err instanceof Error ? err.message : String(err)}\n`);
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:188:  if (!buildStartupBrief) {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:49:let buildStartupBrief: ((highlightCount?: number, stateScope?: { specFolder?: string; claudeSessionId?: string }) => StartupBrief) | null = null;
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:52:  buildStartupBrief = mod.buildStartupBrief;
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:154:    startupBrief = buildStartupBrief
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:      ? buildStartupBrief(undefined, input.sessionId || requestedSpecFolder
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    hookLog('error', 'gemini:session-prime', `buildStartupBrief threw: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:165:  if (!buildStartupBrief) {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:168:    hookLog('warn', 'gemini:session-prime', 'buildStartupBrief returned null — possible startup-brief regression');

```