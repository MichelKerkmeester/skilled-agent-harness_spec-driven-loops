// Planning probe: calls the compiled advisor handler once per runtime label with a
// startup lifecycle event, so the shadow epoch is 1 and the emitted policy blocks are
// recorded, then prints the runtime label each recorded observation carries.
const root = process.argv[2];
const dist = `${root}/.skilled/skills/system-skill-advisor/runtime/dist`;
const hook = await import(`${dist}/hooks/claude/user-prompt-submit.js`);
const plan = await import(`${dist}/runtime/lib/policy-plan.js`);
for (const lifecycle of [undefined, 'startup']) {
  for (const runtime of ['claude', 'pi', 'dsh', 'vibe']) {
    plan.clearPolicyObservationSink();
    await hook.handleClaudeUserPromptSubmit({
      prompt: 'write a readme for the utils folder',
      cwd: root,
      session_id: `policy-label-probe-${runtime}-${lifecycle ?? 'none'}-${process.pid}`,
      hook_event_name: 'UserPromptSubmit',
      ...(lifecycle ? { lifecycle_event: lifecycle } : {}),
    }, { runtime, writeDiagnostic: () => {} });
    const records = plan.getPolicyObservationRecords();
    const labels = [...new Set(records.map((record) => record.binding.runtime))];
    console.log(`lifecycle=${lifecycle ?? 'none'} runtime=${runtime} records=${records.length} labels=${JSON.stringify(labels)}`);
  }
}
process.exit(0);
