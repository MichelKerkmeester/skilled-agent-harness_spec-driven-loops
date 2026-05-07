# Control: hookLog

```
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:11:  parseHookStdin, hookLog, formatHookOutput, truncateToTokenBudget,
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:59:    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:70:    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:78:    hookLog('warn', 'session-prime', `Rejecting compact cache for session ${sessionId}: ${semanticValidation.reason}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:97:  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:206:    hookLog('error', 'session-prime', startupBriefWarning);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:212:    hookLog('warn', 'session-prime', `${startupBriefWarning} — using fallback surface`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:215:    hookLog('warn', 'session-prime', `${startupBriefWarning} — possible startup-brief regression`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:218:    hookLog('warn', 'session-prime', `${startupBriefWarning} — possible startup-brief regression`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:346:    hookLog('warn', 'session-prime', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:352:  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:388:    hookLog('info', 'session-prime', `Token pressure: budget ${budget} → ${adjustedBudget} (window ${input.context_window_tokens}/${input.context_window_max})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:400:  hookLog('info', 'session-prime', `Output ${output.length} chars for source=${source}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:406:    hookLog('error', 'session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:9:import { hookLog } from './shared.js';
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:208:    hookLog('warn', 'transcript', `Failed to parse transcript: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:263:    hookLog('warn', 'transcript', `Failed to parse transcript turns: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:18:import { hookLog } from './shared.js';
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:342:    hookLog('error', 'state', `Failed to create state dir: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:443:    hookLog('error', 'state', `Failed to save state: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:472:    hookLog('warn', 'state', `Quarantined invalid hook state at ${quarantinePath}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:475:    hookLog('warn', 'state', `Failed to quarantine invalid hook state ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:533:    hookLog('warn', 'state', `Lazy migration write-back failed for session ${state.claudeSessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:678:    hookLog(
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:785:    hookLog(
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:921:    hookLog('info', 'state', `Skipped clearing compact payload for session ${sessionId} because the cached payload changed`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:927:    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:958:    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:979:  hookLog('warn', 'state', JSON.stringify({
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:12:  hookLog,
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:92:    hookLog('warn', 'copilot:compact-cache', `Failed to parse hook stdin: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:215:    hookLog('warn', 'copilot:compact-cache', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:221:  hookLog('info', 'copilot:compact-cache', `Compact cache triggered for session ${sessionId} (project: ${getProjectHash()})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:226:    hookLog('info', 'copilot:compact-cache', `Read ${transcriptLines.length} transcript lines`);
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:280:    hookLog('warn', 'copilot:compact-cache', `Compact context cache was not persisted for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:282:    hookLog('info', 'copilot:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:299:    hookLog('error', 'copilot:compact-cache', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/shared.ts:53:    hookLog('warn', 'stdin', `Failed to parse hook stdin: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/shared.ts:71:      hookLog('warn', 'timeout', `Operation timed out after ${ms}ms`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/shared.ts:83:export function hookLog(level: 'info' | 'warn' | 'error', tag: string, msg: string): void {
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:14:  parseHookStdin, hookLog, withTimeout, HOOK_TIMEOUT_MS, getRequiredSessionId,
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:107:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:134:    hookLog('info', 'session-stop', `Context auto-save completed for ${specFolder}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:141:  hookLog('warn', 'session-stop', `Context auto-save failed: ${errorText}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:232:  hookLog('info', 'session-stop', `Token snapshot: ${usage.totalTokens} total (${usage.model ?? 'unknown'}), est. $${cost}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:288:    hookLog('info', 'session-stop', 'Stop hook not active, skipping');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:302:  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:334:      hookLog('warn', 'session-stop', `Pre-parse transcript stat failed: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:365:            hookLog('warn', 'session-stop', `Producer metadata build failed: ${producerMetadataOutcome.detail}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:384:        hookLog('info', 'session-stop',
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:408:      hookLog('warn', 'session-stop', `Transcript parsing failed: ${detail}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:431:      hookLog('info', 'session-stop', `Auto-detected spec folder: ${detectedSpec.specFolder}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:433:      hookLog('info', 'session-stop', `Validated active spec folder from transcript: ${detectedSpec.specFolder}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:441:      hookLog(
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:448:      hookLog('warn', 'session-stop', 'Spec folder detection was ambiguous; preserving existing autosave target.');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:451:      hookLog('warn', 'session-stop', 'Spec folder detection skipped: transcript I/O failed; preserving existing autosave target.');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:459:    hookLog('info', 'session-stop', `Session summary extracted (${text.length} chars)`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:501:  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:520:    hookLog(
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:530:    hookLog('warn', 'session-stop', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:642:    hookLog('error', 'session-stop', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:14:  hookLog, truncateToTokenBudget,
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:128:    hookLog('warn', 'gemini:compact-cache', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:133:  hookLog('info', 'gemini:compact-cache', `PreCompress triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:138:    hookLog('info', 'gemini:compact-cache', `Read ${transcriptLines.length} transcript lines`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:190:    hookLog('warn', 'gemini:compact-cache', `Compact context cache was not persisted for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:194:  hookLog('info', 'gemini:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:199:  hookLog('error', 'gemini:compact-cache', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:13:  parseHookStdin, hookLog, truncateToTokenBudget,
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:290:    hookLog('warn', 'compact-inject', `Merge pipeline took ${elapsed.toFixed(0)}ms (budget: ${HOOK_TIMEOUT_MS}ms)`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:292:    hookLog('info', 'compact-inject', `Merge pipeline completed in ${elapsed.toFixed(0)}ms (${merged.metadata.sourceCount} sections, ~${merged.metadata.totalTokenEstimate} tokens)`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:300:  hookLog(
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:379:    hookLog('warn', 'compact-inject', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:384:  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:389:    hookLog('info', 'compact-inject', `Read ${transcriptLines.length} transcript lines`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:417:      hookLog('warn', 'compact-inject', `Compact context cache was not persisted for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:420:    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:423:    hookLog('warn', 'compact-inject', `Merge pipeline failed, falling back to legacy: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:456:    hookLog('warn', 'compact-inject', `Legacy compact context cache was not persisted for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:460:  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:465:  hookLog('error', 'compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:19:  hookLog, formatHookOutput, truncateToTokenBudget,
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:63:    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:74:    hookLog('warn', 'gemini:session-prime', `Rejecting stale compact cache (cached at ${cachedAt})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:82:    hookLog('warn', 'gemini:session-prime', `Rejecting compact cache: ${semanticValidation.reason}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:93:  hookLog('info', 'gemini:session-prime', `Injecting cached compact brief (${payload.length} chars, cached at ${cachedAt})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    hookLog('error', 'gemini:session-prime', `buildStartupBrief threw: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:166:    hookLog('warn', 'gemini:session-prime', 'Startup brief module unavailable — using fallback surface');
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:168:    hookLog('warn', 'gemini:session-prime', 'buildStartupBrief returned null — possible startup-brief regression');
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:170:    hookLog('warn', 'gemini:session-prime', 'startupBrief.startupSurface is empty — possible startup-brief regression');
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:262:    hookLog('warn', 'gemini:session-prime', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:268:  hookLog('info', 'gemini:session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:316:  hookLog('info', 'gemini:session-prime', `Output ${rawOutput.length} chars for source=${source}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:322:    hookLog('error', 'gemini:session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/shared.ts:10:import { hookLog } from '../claude/shared.js';
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/shared.ts:68:    hookLog('warn', 'gemini:stdin', `Failed to parse hook stdin: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:16:  hookLog, withTimeout, HOOK_TIMEOUT_MS, getRequiredSessionId,
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:33:      hookLog('warn', 'gemini:session-stop', `Transcript too large (${stat.size} bytes > ${MAX_TRANSCRIPT_BYTES}); skipping spec folder detection`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:83:    hookLog(
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:93:    hookLog('warn', 'gemini:session-stop', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:98:  hookLog('info', 'gemini:session-stop', `SessionEnd hook fired for session ${sessionId} (reason: ${input.reason ?? 'unknown'})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:106:        hookLog('warn', 'gemini:session-stop', `Failed to persist detected spec folder for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:108:      hookLog('info', 'gemini:session-stop', `Auto-detected spec folder: ${detectedSpec}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:119:      hookLog('warn', 'gemini:session-stop', `Failed to persist session summary for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:121:    hookLog('info', 'gemini:session-stop', `Session summary extracted (${text.length} chars)`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:124:  hookLog('info', 'gemini:session-stop', `Session ${sessionId} stop processing complete`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:129:  hookLog('error', 'gemini:session-stop', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:16:  hookLog, truncateToTokenBudget,
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:36:    hookLog('warn', 'gemini:compact-inject', 'No stdin input received');
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:54:    hookLog('warn', 'gemini:compact-inject', `Rejecting stale compact cache (cached at ${cachedAt})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:59:    hookLog('warn', 'gemini:compact-inject', `Rejecting compact cache: ${semanticValidation.reason}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:76:  hookLog('info', 'gemini:compact-inject', `Injecting cached compact brief (${sanitizedPayload.length} chars, cached at ${cachedAt})`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:102:  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:107:  hookLog('error', 'gemini:compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);

```