# Rescores the untuned arm's run lines with the current scorer and writes the evidence
# lines with the jq filters read from the arm's own task list, so no filter is retyped.
import re, shlex, subprocess, sys, os
W = '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research'
PK = f'{W}/specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build'
SP, OSP = f'{PK}/034-scorer-heredoc-redirect-fix/scratch', f'{PK}/033-untuned-arm-arena-run/scratch'
S = f'{W}/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs'
LOGS = [f'{OSP}/runs/{rt}.jsonl' for rt in ('claude', 'opencode', 'pi', 'devin', 'dsh')]
src = open(f'{PK}/026-untuned-behaviour-arm/tasks.md').read()
def filt(name):
    m = re.search(r'^- `' + name + r'` is `(jq [^\n]*?)`(?:,|\.| one| the)', src, re.M)
    return shlex.split(m.group(1))
env = {k: v for k, v in os.environ.items() if k != 'SKILL_ADVISOR_FRESH_PROMPTS_PATH'}
summary = subprocess.run(['node', S, '--summary', *LOGS, '--pair', 'off,on', '--json'], capture_output=True, text=True, env=env, check=True).stdout
open(f'{SP}/summary-rescore.json', 'w').write(summary)
out = []
for name in ('FOLLOWED', 'PAIRED', 'POOLED', 'STARTS', 'DELIVERY'):
    out += subprocess.run(filt(name), input=summary, capture_output=True, text=True, check=True).stdout.splitlines()
mism = subprocess.run(filt('MISMATCH') + LOGS, capture_output=True, text=True, check=True).stdout.splitlines()
out.append(f'mismatch {len(mism)}')
old = open(f'{OSP}/arm-evidence.txt').read().splitlines()
out += [l for l in old if l.startswith('limit: ')] + [l for l in old if l.startswith('floor ')]
open(f'{SP}/rescore-evidence.txt', 'w').write('\n'.join(out) + '\n')
print(len(out), 'lines')
