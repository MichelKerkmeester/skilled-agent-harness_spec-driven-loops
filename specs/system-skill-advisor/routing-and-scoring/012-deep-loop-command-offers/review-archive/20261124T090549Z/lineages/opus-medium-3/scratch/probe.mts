import * as m from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts';
const route = (mode: string) => ({ action: 'route', selectionKind: 'single', targets: [{ workflowMode: mode }] });
const defer = { action: 'defer' };
const cases: [string, string, unknown][] = JSON.parse(process.argv[2]);
for (const [p, mode, r] of cases) {
  const rt = r === 'defer' ? defer : route(mode);
  console.log(JSON.stringify({ p, attach: m.attachCommand('system-deep-loop', rt, p), typed: m.typedCommandIn(p), typedTop: m.typedCommandForTop('system-deep-loop', p)?.command ?? null, asks: m.asksForLoopRun(p) }));
}
