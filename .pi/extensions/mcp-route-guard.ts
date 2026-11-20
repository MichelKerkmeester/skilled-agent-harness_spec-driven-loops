// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Hook Entry
// ───────────────────────────────────────────────────────────────────
// Rendered by sync-hook-registrations.cjs from its Pi entry template, which
// --check holds every entry to byte for byte: change the template, then rerun it.
// Pi loads every .ts file in this folder. The adapter is imported inside the
// factory, so a Skilled tree that is missing or out of date turns this hook off
// with one notice for the session instead of failing the extension at startup.

import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';

const ENTRY = 'mcp-route-guard.ts';
const FAILURES = Symbol.for('skilled.pi.adapterImportFailures');

type FailureRegistry = { [FAILURES]?: Map<string, string> };

// Pi evaluates each entry in its own module scope, so the entries that fail in
// one load pass collect into a map on globalThis. Each failing entry registers a
// session_start handler, and the first one to run reports them all and clears
// the map, so a load pass Pi discards cannot swallow the notice.
function reportImportFailure(pi: ExtensionAPI, error: unknown): void {
  const registry = globalThis as FailureRegistry;
  const failures = registry[FAILURES] ?? new Map<string, string>();
  registry[FAILURES] = failures;
  failures.set(ENTRY, error instanceof Error ? error.message.split('\n')[0] : String(error));
  pi.on('session_start', (_event, ctx: ExtensionContext) => {
    const pending = registry[FAILURES];
    if (pending === undefined || pending.size === 0) return;
    delete registry[FAILURES];
    const [firstError] = pending.values();
    const message = [
      `Skilled: ${pending.size} Pi hook entr${pending.size === 1 ? 'y is' : 'ies are'} off for this session because the adapter did not load: ${[...pending.keys()].join(', ')}.`,
      'The Skilled checkout this project uses may be out of date: run git pull in it, then /doctor:setup.',
      `First error: ${firstError}`,
    ].join('\n');
    if (ctx.hasUI) ctx.ui.notify(message, 'warning');
    else process.stderr.write(`${message}\n`);
  });
}

export default async function piEntry(pi: ExtensionAPI): Promise<void> {
  let adapter: { default: (api: ExtensionAPI) => unknown };
  try {
    adapter = await import('../../.skilled/hooks/mcp-route-guard/pi/mcp-route-guard.ts');
  } catch (error) {
    reportImportFailure(pi, error);
    return;
  }
  // Outside the try: an adapter that throws while it registers is a real bug,
  // and Pi's own load error is the right report for it.
  await adapter.default(pi);
}
