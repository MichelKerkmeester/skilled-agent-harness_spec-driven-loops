# Builds the alignment completeness-critic prompt for one run folder, from that run's
# lane prompt preamble and persona, its scope summary, battery, env tokens, probes and
# lane results.
import json
import os
import sys

run_dir = sys.argv[1]
run_name = os.path.basename(run_dir.rstrip('/'))


def load(name):
    with open(os.path.join(run_dir, name)) as handle:
        return json.load(handle)


with open(os.path.join(run_dir, 'lanes', 'A.prompt.txt')) as handle:
    lines = handle.read().split('\n')
cut = next(i for i, line in enumerate(lines) if line.startswith('LANE A:'))
head = '\n'.join(lines[:cut]).replace(f'{run_name}/A', f'{run_name}/critic')

battery = load('battery.json')
parts = [head,
         'COMPLETENESS CRITIC for /local-skilled-alignment on branch worktrees/352-command-surfacing-research '
         '(first-parent scope against origin/main). This branch is the command surfacing build: the skill advisor '
         'surfaces slash commands with a run, start or ask policy on every runtime, measures it with a transcript '
         'scorer and an arena behaviour runner, and adds Mistral Vibe support.',
         '',
         'You hunt cross-lane gaps and owners the surface map does not cover. Do not repeat lane findings. Verify '
         'before you overturn: run the command or read the file. A finding is pre-existing when the same defect is '
         'present on origin/main or at `git -c core.fsmonitor=false merge-base HEAD origin/main`.',
         '',
         'SCOPE SUMMARY (scope-summary.json)',
         json.dumps(load('scope-summary.json'), indent=1),
         '',
         'BATTERY TABLE (id | surface | status | exit | severity)']
for row in battery['rows']:
    parts.append(f'{row["id"]} | {row["surface"]} | {row["status"]} | {row["exit"]} | {row["severity"]}')
if os.path.exists(os.path.join(run_dir, 'env-tokens.json')):
    parts += ['', 'ENV TOKENS (env-tokens.json)', json.dumps(load('env-tokens.json'), indent=1)]
if os.path.exists(os.path.join(run_dir, 'probes.json')):
    parts += ['', 'PROBES (probes.json)', json.dumps(load('probes.json'), indent=1)]
parts += ['', 'SURFACE LENSES']
for surface in battery['surfaces']:
    parts.append(f'{surface["id"]} {surface["title"]} (standard {surface["standard"]}): '
                 f'{" ".join(str(surface.get("lens", "")).split())}')
parts += ['', 'LANE RESULTS']
for lane in ('A', 'B', 'C', 'D'):
    path = os.path.join(run_dir, 'lanes', f'{lane}.json')
    if not os.path.exists(path):
        parts += [f'LANE {lane}', 'no result']
        continue
    result = load(os.path.join('lanes', f'{lane}.json'))
    parts += [f'LANE {lane}', f'reviewed: {json.dumps(result.get("reviewed", []))}',
              f'findings: {json.dumps(result.get("findings", []))}', '']
parts += [
    'OUTPUT CONTRACT',
    'Print exactly one JSON object and nothing after it: {"findings": [...same schema as lanes: id, surface, '
    'standard, severity P0|P1|P2, fix_class literal|judgment, file, line, issue, evidence {cmd, exit, out}, fix '
    '{old, new} only for a literal fix...], "untouched": [files in scope that no lane reviewed and no battery row '
    'covered], "overrides": [{"id", "verdict": "refuted"|"pre-existing"|"duplicate"|"severity", "severity"?, '
    '"note"}], "upheld_probes": [probe ids you confirm are real routing failures]}.',
    'A failed probe you leave out of upheld_probes is held, not counted: the aggregator lists it in '
    'probes-held.json. Uphold a probe only when its prompt plainly asks for the expected skill\'s work.',
    'overrides is optional and is how you overturn an earlier finding instead of only describing the problem in '
    'a finding: refuted when the finding is wrong, pre-existing when it predates the scope, duplicate when another '
    'finding already records it (name that one in the note), severity with a new P0, P1 or P2 when the lane '
    'graded it wrong. Each override names the finding by the id its lane gave it, or a probe by its id in '
    'probes.json, and its note gives the evidence. When a lane used bare numbers as ids, write the lane id in '
    'front, for example A-1, because a bare number two lanes share matches nothing. Give each finding at most one '
    'override.',
    'Never open command-prompts.jsonl, holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through '
    '`jq \'del(.prompt)\'`, and never print prompt text from a session store. Never run '
    'score-command-transcripts.mjs --summary, and never read or create .skilled/hooks/hook-flags.env.',
    "KNOWN LIMIT CLASSES (operator answer, 2026-11-17). The section Known Limitations in specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/implementation-summary.md records classes the operator accepted. A new wording of a recorded class is severity P2, not P1. Grade it P1 only when it breaks a pinned fixture in the advisor tests or makes the advisor offer a command whose policy is run. The classes: the command mention check reads a refusal or question that has no lead word directly before the command name as a request, including a refusal of it after the name that carries a reason or a repeat adverb, and a command named as a document followed by a then clause; and underscore emphasis around a command name. Use a severity override to grade a lane's P1 of a recorded class down to P2.",
]
text = '\n'.join(parts).replace('—', ',') + '\n'
with open(os.path.join(run_dir, 'critic.prompt.md'), 'w') as handle:
    handle.write(text)
print(f'critic prompt bytes {len(text)}')
