const h = await import(process.cwd() + '/.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts');
const prompt = process.argv[2];
const base = {
  workspaceRoot: process.cwd(), effectiveThresholds: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
  recommendations: [{ skillId: 'system-deep-loop', kind: 'skill', confidence: 0.95, uncertainty: 0.12, passes_threshold: true, command: '/doctor:deep-loop', policy: 'run' }],
  ambiguous: false, freshness: 'live', trustState: 'live', generatedAt: new Date().toISOString(), cache: { hit: false, sourceSignaturePresent: true },
};
try {
  const out = h.attachTypedCommand(base, prompt);
  console.log(JSON.stringify(out.recommendations[0]));
} catch (e) { console.log('ERR', e.message.slice(0, 600)); }
