// Feeds made-up shell events to the committed transcript scorer and prints what it
// decides for heredoc delimiters and for a shell read of a command document.
const S = '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';
const { workflowPath, followedBeforeWrite, startState } = await import(S);
const CO = '/tmp/arena';
const shell = (seq, command) => ({ seq, kind: 'shell', path: null, command });
const write = (seq, path) => ({ seq, kind: 'write', path, command: null });

for (const delim of ['EOF', "'EOF'", 'END_SCRIPT', "'END-SCRIPT'", '"END-SCRIPT"', 'END-SCRIPT']) {
  const bare = delim.replace(/['"]/g, '');
  const events = [
    shell(1, `python3 - <<${delim}\ncat .skilled/skills/sk-doc/SKILL.md\n${bare}`),
    write(2, `${CO}/README.md`),
  ];
  console.log('heredoc', delim.padEnd(14), 'workflowPath =', workflowPath(events, { command: '/create:readme', owner: 'sk-doc', wrote: true, checkoutDir: CO }));
}

const readThenWrite = [shell(1, 'cat .skilled/commands/deep/review.md'), write(2, `${CO}/specs/x/review/iteration-001.md`)];
const readTool = [{ seq: 1, kind: 'read', path: '.skilled/commands/deep/review.md', command: null }, write(2, `${CO}/specs/x/review/iteration-001.md`)];
console.log('shellRead followedBeforeWrite', followedBeforeWrite(readThenWrite, '/deep:review', CO));
console.log('shellRead startState', JSON.stringify(startState(readThenWrite, { expected_command: '/deep:review' })));
console.log('readTool  startState', JSON.stringify(startState(readTool, { expected_command: '/deep:review' })));
