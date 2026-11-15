// Planning probe: runs the Vibe prompt-advisor part with the real advisor and prints
// the routing head for each prompt given after the repository root. The directive
// block is cut, because only the head carries the command and its policy word.
const [root, ...prompts] = process.argv.slice(2);
const { buildAdvisorPart } = await import(`${root}/.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`);
let index = 0;
for (const prompt of prompts) {
  index += 1;
  const context = await buildAdvisorPart({
    hook_event_name: 'pre_agent',
    prompt,
    session_id: `vibe-brief-probe-${process.pid}-${index}`,
  });
  console.log(`--- prompt ${index}`);
  console.log(context.split('\nDirectives:')[0]);
}
process.exit(0);
