# Builds the alignment lane prompts for one run folder. The preamble and persona come
# from an earlier run's lane prompt, whose source files have not changed since, with the
# run folder name swapped; the lane brief comes from this run's battery and scope.
import json
import os
import sys

import yaml

run_dir, prior_run, repo = sys.argv[1], sys.argv[2], sys.argv[3]
run_name = os.path.basename(run_dir.rstrip('/'))
prior_name = os.path.basename(prior_run.rstrip('/'))

with open(os.path.join(prior_run, 'lanes', 'A.prompt.txt')) as handle:
    head_lines = handle.read().split('\n')
cut = next(i for i, line in enumerate(head_lines) if line.startswith('LANE A:'))
head = '\n'.join(head_lines[:cut]).replace(f'{prior_name}/A', f'{run_name}/{{lane}}')
assert prior_name not in head, 'the prior run folder survives in the preamble'

with open(os.path.join(repo, '.skilled/commands/assets/local-skilled-alignment/surface-map.yaml')) as handle:
    smap = yaml.safe_load(handle)
with open(os.path.join(run_dir, 'battery.json')) as handle:
    battery = json.load(handle)
with open(os.path.join(run_dir, 'scope.json')) as handle:
    scope = json.load(handle)

surfaces = {s['id']: s for s in battery['surfaces']}
rows = battery['rows']
commits = scope.get('commits') or scope.get('commitCount') or ''
commit_count = len(commits) if isinstance(commits, list) else commits

TARGET = ('Target: branch worktrees/352-command-surfacing-research, first-parent scope against origin/main '
          f'({commit_count} commits). This branch is the command surfacing build: the skill advisor surfaces '
          'slash commands with a run, start or ask policy on every runtime, measures it with a transcript '
          'scorer and an arena behaviour runner, and adds Mistral Vibe support. Its latest work fixed the '
          'scorer start rule, isolated the suite temp folder and merged origin/main.')

RULES = ("For each failing row, confirm its cause rather than restating it: run the command or read the files, "
         "and say whether this branch's changes caused it (compare against `git -c core.fsmonitor=false merge-base "
         "HEAD origin/main` and origin/main) or whether it predates the branch. A failure that also fails on "
         "origin/main is pre-existing: report it with severity P2 and say so in the issue.\n"
         "Never open command-prompts.jsonl, holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through "
         "`jq 'del(.prompt)'`, and never print prompt text from a session store. Never run "
         "score-command-transcripts.mjs --summary, and never read or create .skilled/hooks/hook-flags.env.\n"
         'KNOWN LIMIT CLASSES (operator answer, 2026-11-17). The section Known Limitations in specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/implementation-summary.md records classes the operator accepted. A new wording of a recorded class is severity P2, not P1. Grade it P1 only when it breaks a pinned fixture in the advisor tests or makes the advisor offer a command whose policy is run. The classes: the command mention check reads a refusal or question that has no lead word directly before the command name as a request, including a refusal of it after the name that carries a reason or a repeat adverb, and a command named as a document followed by a then clause; and underscore emphasis around a command name.')

PROBES = ('LANE D PROBES\nAlso return "probes": [{prompt, expect, expectMode?}], one or more probe prompts per new '
          'or changed feature, written from the feature\'s behavior before reading any advisor metadata, and saved '
          'to your scratch folder as probes-pre-metadata.md before you read any graph-metadata.json, so the order '
          'can be checked. `expect` must name a skill id: a top-level folder under .skilled/skills, such as '
          'mcp-tooling. A mode inside a hub goes in `expectMode`, never in `expect`. A command id such as /doctor:ci '
          'is not a valid expect, because the advisor routes to skills. Write each probe as a request with a verb, '
          'the way an operator asks for the work, never a bare topic.')


def tail(text, limit=40):
    lines = (text or '').rstrip('\n').split('\n')
    return '\n'.join('    ' + line[:400] for line in lines[-limit:])


for lane_id, lane in smap['lanes'].items():
    fired = [sid for sid in lane['surfaces'] if surfaces.get(sid, {}).get('fired')]
    if not fired:
        print(f'{lane_id} skipped: no fired surface')
        continue
    parts = [head.replace('{lane}', lane_id), f'LANE {lane_id}: {lane["title"]}', TARGET, '', 'SURFACES']
    files = []
    for sid in fired:
        meta = surfaces[sid]
        parts.append(f'- {sid} {meta.get("title", "")}. Standard: {meta.get("standard", "")}. '
                     f'Lens: {" ".join(str(meta.get("lens", "")).split())}')
        files.extend(surfaces[sid].get('files', []))
    files = sorted(set(files))
    parts += ['', 'FILES IN SCOPE THAT FIRED THESE SURFACES']
    if len(files) <= 400:
        parts += files
    else:
        owners = {}
        for path in files:
            key = '/'.join(path.split('/')[:3])
            owners[key] = owners.get(key, 0) + 1
        parts += [f'{key} ({count} files)' for key, count in sorted(owners.items())]
    lane_rows = [r for r in rows if r.get('surface') in fired]
    bad = [r for r in lane_rows if r.get('status') not in ('pass', 'skip')]
    good = [r['id'] for r in lane_rows if r.get('status') == 'pass']
    parts += ['', 'FAILING OR CANNOT-RUN BATTERY ROWS']
    if not bad:
        parts.append('- none')
    for r in bad:
        parts.append(f'- {r["id"]} ({r.get("status")}, exit {r.get("exit")}, severity {r.get("severity")})')
        cmd = r.get('cmd')
        parts.append(f'  command: {" ".join(cmd) if isinstance(cmd, list) else cmd}')
        parts.append('  output tail:')
        parts.append(tail(r.get('outTail') or r.get('reason') or ''))
    parts += ['', f'PASSING ROWS (ids only): {", ".join(good) or "none"}', '', RULES, '',
              'OUTPUT CONTRACT',
              f'Print exactly one JSON object and nothing after it: {{"lane": "{lane_id}", "findings": [...], '
              '"reviewed": [paths]}. Each finding carries id, surface, standard, severity P0|P1|P2, fix_class '
              'literal|judgment, file, line, issue, evidence {cmd, exit, out} when a command proved it, and fix '
              '{old, new} only for a literal fix. A finding with no command evidence is allowed and will be marked '
              'inferred.']
    if lane_id == 'D':
        parts += ['', PROBES]
    text = '\n'.join(parts).replace('—', ',') + '\n'
    with open(os.path.join(run_dir, 'lanes', f'{lane_id}.prompt.txt'), 'w') as handle:
        handle.write(text)
    print(f'{lane_id} surfaces {",".join(fired)} files {len(files)} failing {len(bad)} passing {len(good)} bytes {len(text)}')
