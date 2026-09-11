// R1.5: classify exact command shapes through the real dispatch-audit module.
import { inspectDispatch } from "/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/hooks/dispatch/lib/dispatch-audit.mjs";

const cases = [
  'mkdir -p "$L/iterations" "$L/deltas" "$L/scratch" && cat > "$L/deep-research-state.jsonl"',
  'mkdir -p /Users/example/scratch/dir-one /Users/example/scratch/dir-two',
  'printf \'seed\\n\' >> "$L/file.txt"',
  'L=/tmp/x; mkdir -p "$L/a"; git init -q',
  'x=$CMD; $x -p task',
  'pi -p "task"',
  'pi list',
  'bash "$L/script.sh"',
  'git commit -m "docs(x): update"',
  'node script.mjs --print result',
  'cd "$B/repo" && git commit -m "seed"',
];

for (const command of cases) {
  const verdict = inspectDispatch(command);
  const status = verdict.kind === "direct"
    ? `direct (${verdict.executor})`
    : verdict.kind === "ambiguous"
      ? "ambiguous -> denied by pi guard"
      : "none -> allowed";
  console.log(`${status.padEnd(30)} | ${command}`);
}
