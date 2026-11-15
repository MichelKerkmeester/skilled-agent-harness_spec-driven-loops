const root = process.argv[2];
const { normalizeAskUserQuestion } = await import(`${root}/.skilled/hooks/decision-capture/lib/capture-core.mjs`);
const toolInput = { questions: [{ question: 'Which route?', header: 'Route', options: [{ label: 'A', description: 'a' }, { label: 'B', description: 'b' }] }] };
const vibeOutput = { answers: [{ question: 'Which route?', answer: 'A', is_other: false }], cancelled: false };
const n = normalizeAskUserQuestion({ runtime: 'vibe', sessionId: 's1', toolUseId: 'c1', toolInput, toolResponse: vibeOutput, source: 'hook', now: '2026-11-14T00:00:00Z' });
console.log(`records=${n.length}`);
