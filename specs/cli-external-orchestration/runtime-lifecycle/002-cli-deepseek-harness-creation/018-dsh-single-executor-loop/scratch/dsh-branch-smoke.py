"""Render a tree's if_cli_deepseek_harness branch and run it against a stub dsh.

Usage: python3 dsh-branch-smoke.py <repo root> <empty temp folder> ok|inactive deep-review-auto.yaml|deep-research-auto.yaml
Needs PyYAML. Writes only under the temp folder and the system temp folder.
"""
import json
import os
import subprocess
import sys

import yaml

MIRROR, SMOKE, MODE, WORKFLOW = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

def find_branch(node):
    if isinstance(node, dict):
        if 'if_cli_deepseek_harness' in node:
            return node['if_cli_deepseek_harness']
        for value in node.values():
            found = find_branch(value)
            if found is not None:
                return found
    if isinstance(node, list):
        for value in node:
            found = find_branch(value)
            if found is not None:
                return found
    return None

with open(os.path.join(MIRROR, '.skilled/commands/deep/assets', WORKFLOW), encoding='utf-8') as handle:
    branch = find_branch(yaml.safe_load(handle))
command = branch['command']

# The artifact folder sits under the smoke folder, outside the checkout, so a run leaves the tree clean.
artifact = os.path.join(SMOKE, 'artifact', MODE, 'review')
os.makedirs(os.path.join(artifact, 'prompts'), exist_ok=True)
with open(os.path.join(artifact, 'prompts', 'iteration-1.md'), 'w', encoding='utf-8') as handle:
    handle.write('SMOKE PROMPT\n')
state_log = os.path.join(artifact, 'state.jsonl')
open(state_log, 'w').close()

values = {
    '{config.executor.kind}': 'cli-deepseek-harness',
    '{config.executor.model}': 'deepseek-v4.1-flash-1017',
    '{config.executor.timeoutSeconds}': '60',
    '{config.executor.reasoningEffort}': 'null',
    '{repo_root}': MIRROR,
    '{artifact_dir}': artifact,
    '{state_paths.prompt_dir}': os.path.join(artifact, 'prompts'),
    '{state_paths.state_log}': state_log,
    '{state_paths.packet_dir}': artifact,
    '{current_iteration}': '1',
    '{generation}': '1',
    '{config.lineage.generation}': '1',
    '{spec_folder}': 'specs/smoke',
}
for key, value in values.items():
    command = command.replace(key, value)

stub_dir = os.path.join(SMOKE, 'bin')
os.makedirs(stub_dir, exist_ok=True)
record = os.path.join(SMOKE, f'record-{MODE}.json')
stub = os.path.join(stub_dir, 'dsh')
inactive = 'echo "plugin repo-guards did not activate" >&2' if MODE == 'inactive' else ':'
with open(stub, 'w', encoding='utf-8') as handle:
    handle.write(f"""#!/bin/sh
if [ "$1" = "--version" ]; then echo 0.2.2-rc.1; exit 0; fi
first_line=$(head -n 1 | cut -c1-16)
cat >/dev/null
home_exists=no; [ -d "$DSH_HOME" ] && home_exists=yes
printf '{{"cwd":"%s","dshHome":"%s","homeExists":"%s","specFolder":"%s","gateDisabled":"%s","child":"%s","promptStart":"%s","argc":%s}}' "$(pwd -P)" "$DSH_HOME" "$home_exists" "$DSH_SPEC_FOLDER" "$SYSTEM_SPEC_GATE_DISABLED" "$AI_SESSION_CHILD" "$first_line" "$#" > {record}
{inactive}
echo '{{"type":"session","sessionId":"s","cwd":"x"}}'
echo '{{"type":"final","reason":{{"kind":"completed"}}}}'
exit 0
""")
os.chmod(stub, 0o755)

env = dict(os.environ)
env['PATH'] = stub_dir + os.pathsep + env['PATH']
for key in ('DSH_HOME', 'SPECKIT_DEEPSEEK_HARNESS_STATE_DIR'):
    env.pop(key, None)
result = subprocess.run(['bash', '-c', command], cwd=MIRROR, env=env, capture_output=True, text=True, timeout=120)
print('mode', MODE, 'workflow', WORKFLOW, 'exit', result.returncode)
print('stderr_tail', result.stderr.strip().splitlines()[-3:] if result.stderr.strip() else [])
if os.path.exists(record):
    data = json.load(open(record))
    print('child_record', json.dumps(data))
    print('home_removed_after_run', not os.path.exists(data['dshHome']))
    print('cwd_is_artifact_dir', os.path.realpath(data['cwd']) == os.path.realpath(artifact))
with open(state_log, encoding='utf-8') as handle:
    events = [json.loads(line) for line in handle if line.strip()]
print('dispatch_failures', json.dumps([{k: e.get(k) for k in ('reason', 'detail')} for e in events if e.get('event') == 'dispatch_failure']))
receipts = os.path.join(artifact, 'dispatch-receipts')
print('receipts', sorted(os.listdir(receipts)) if os.path.isdir(receipts) else [])
