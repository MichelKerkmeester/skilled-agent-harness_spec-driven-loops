# Builds baseline.json from the phase captures only. No model call, no network.
import json, re, sys, os
C = sys.argv[1]; S = os.path.join(C, 'scratch')
wt = os.getcwd()
harness = {r['name']: r for r in (json.loads(l) for l in open(os.path.join(S, 'v1-harness.jsonl')))}
cfg = json.load(open(os.path.join(S, 'v1-debug-config.json')))
discovered = {os.path.basename(p).removesuffix('.js') for p in cfg.get('plugin', []) if '/.worktrees/' in p}
tool_ids = set(json.load(open(os.path.join(S, 'v1-tool-ids.json'))))
tool_plugin = {'system-speckit-completion': 'system_speckit_completion', 'system-skill-advisor': 'spec_kit_skill_advisor_status', 'opencode-goal': 'opencode_goal'}
v2 = json.load(open(os.path.join(S, 'v2-plugin-3.json')))['data']
v2_state = {}
for p in v2:
    path = p.get('source', {}).get('path', '')
    if path.startswith(os.path.join(wt, '.opencode', 'plugins')):
        v2_state[os.path.basename(path).removesuffix('.js')] = p['state']
def counts(path, pat_pass, pat_fail):
    t = open(path).read()
    return {'pass': int(re.search(pat_pass, t).group(1)), 'fail': int(re.search(pat_fail, t).group(1))}
plugins = {}
for name in sorted(harness):
    h = harness[name]
    host = 'tool listed' if tool_plugin.get(name) in tool_ids else ('discovered' if name in discovered else 'absent')
    st = v2_state.get(name, {'status': 'absent'})
    plugins[name] = {
        'v1': h['v1'], 'v1_evidence': f"harness: {h['detail']}; host: {host} (scratch/v1-harness.jsonl, scratch/v1-debug-config.json, scratch/v1-tool-ids.json)",
        'v2': st.get('status'), 'v2_evidence': f"/api/plugin worktree entry, error {st.get('error', '-')} (scratch/v2-plugin-3.json)",
    }
base = {
    'captured_at': '2026-10-18', 'v1_version': '1.19.3', 'v2_version': '2.0.32',
    'v1_oracle': 'node harness calling each v1 entry, plus debug config discovery and private serve tool ids (scratch/v1-trigger-orchestrator.txt)',
    'v2_oracle': '/api/plugin filtered to the worktree path, because a worktree inside a checkout also loads the parent checkout plugins',
    'plugins': plugins,
    'suites': {
        'plugin': counts(os.path.join(S, 'suite-plugin.txt'), r'ℹ pass (\d+)', r'ℹ fail (\d+)'),
        'guard': {
            'node': counts(os.path.join(S, 'suite-guard-node.txt'), r'ℹ pass (\d+)', r'ℹ fail (\d+)'),
            'vitest_dispatch_audit': {'pass': int(re.search(r'Tests\s+(\d+) passed', open(os.path.join(S, 'suite-guard-vitest.txt')).read()).group(1)), 'fail': 0},
        },
    },
}
json.dump(base, open(os.path.join(C, 'baseline.json'), 'w'), indent=2); print(len(plugins))
