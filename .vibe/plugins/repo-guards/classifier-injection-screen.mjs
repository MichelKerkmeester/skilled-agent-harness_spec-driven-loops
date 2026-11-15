#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: classifier-injection-screen Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A post_tool hook over the runtime-neutral fetched-text injection screen.
// It reads the text a web fetch returned and, when a section reads as
// instructions aimed at the agent, appends one advisory line to the tool
// result as additional_context. Clean text prints nothing, and the hook
// never denies: the fetch result always reaches the model unchanged. A core
// error allows and is reported on stderr, so a guard bug never hides a tool
// result.

import { fetchedText, screenAdvisory } from '../../../.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs';
import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';
import { allow, readPayload, runGuard } from './lib/hook-io.mjs';

// The fetch tools whose result carries page text. Vibe exposes the builtin
// web_fetch and the connector's open_url; the hooks.toml match scopes the
// hook, and this leaf-name check keeps a direct invocation from screening a
// tool that returns something else.
const FETCH_TOOLS = new Set(['web_fetch', 'open_url']);

function isFetchTool(name) {
  const leaf = String(name ?? '').split('.').pop();
  return FETCH_TOOLS.has(leaf);
}

// Appending context is the only channel this hook uses: a deny would replace
// the tool output the model needs.
function addContext(text) {
  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('injection-screen')) return allow();
  if (!isFetchTool(payload.tool_name)) return allow();

  // A failed fetch carries an error message, not page text.
  if (payload.tool_status && payload.tool_status !== 'success') return allow();

  const text = fetchedText(payload.tool_output_text);
  if (text === null) return allow();

  const advisory = await screenAdvisory(text);
  if (typeof advisory !== 'string' || advisory.length === 0) return allow();
  addContext(advisory);
}

await runGuard(main, 'classifier-injection-screen');
