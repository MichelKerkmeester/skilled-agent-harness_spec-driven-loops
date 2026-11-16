const W = '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research';
const { normalize, startedCommand } = await import(`${W}/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`);
const call = (command) => ({ role: 'assistant', content: [{ type: 'toolCall', name: 'Bash', arguments: { command } }] });
const read = { role: 'assistant', content: [{ type: 'toolCall', name: 'Read', arguments: { file_path: '/arena/.claude/commands/create/sk-skill.md' } }] };
const cases = {
  body: "python3 - <<'PY'\nimport sys\nif len(sys.argv)>0:\n    print('x')\nPY",
  opening: "cat <<'EOF' > notes.txt\nhello\nEOF",
};
for (const [name, command] of Object.entries(cases)) {
  const events = normalize([read, call(command)], 'claude');
  console.log(name, JSON.stringify(events.filter((e) => e.kind === 'write').map((e) => e.path)), 'started', startedCommand(events, ['/create:sk-skill'], '/arena'));
}
