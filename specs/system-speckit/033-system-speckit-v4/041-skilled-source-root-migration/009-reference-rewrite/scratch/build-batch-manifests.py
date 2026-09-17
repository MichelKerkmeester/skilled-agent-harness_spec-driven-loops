#!/usr/bin/env python3
"""build-batch-manifests.py: sort every tracked file outside specs that names `.opencode` and write the batch manifests.

Every candidate lands in exactly one list: freeze, generated, routed (with its owning phase), manual (handled one by
one), noop (nothing the rule would edit) or a batch. Batches group files by the surface they belong to, so a commit
can carry the generator output its files feed. A file that already names `.skilled` knows both roots, so it joins the
dual-root batch, whose every occurrence takes a decision, and `judged.txt` lists it. Paths are read from the working
tree at HEAD, never from a map.

Usage: build-batch-manifests.py --repo <worktree> --maps <map dir> --rule <rewrite-batch.py> --out <dir>
                               [--keep-list <tsv>] [--specs-target keep|canonical]
"""
import argparse, csv, importlib.util, json, re, subprocess, sys
from collections import Counter, defaultdict
from pathlib import Path

FREEZE = [
    ('F1', '.skilled/skills/**/changelog/**', '.skilled/skills/system-spec-kit/templates/changelog/**'),
    ('F2', '.skilled/skills/**/benchmark/reports/**', None),
    ('F3', '.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/**', None),
    # Acceptance evidence captured once, with no runtime reader, records runs at the old path.
    ('F4', '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/{latency-report,semantic-probes,recipe-execution,daemon-off-proof}.json', None),
]

# Output a generator or tool writes. Each is rebuilt by its owner, never edited by the rule.
GENERATED = [
    '.hermes/skills/**', '.hermes/prompts/**', '.codex/prompts/**', '.codex/agents/**', '.pi/agents/**',
    '.skilled/commands/deep/assets/compiled/*.contract.md',
    '.skilled/skills/system-spec-kit/runtime/data/trigger-index.json',
    '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json',
    '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json',
    '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json',
    '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json',
    '.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json',
    '.skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/*.snap',
    '.skilled/package-lock.json',
    '.skilled/skills/*/graph-metadata.json',
    '.skilled/skills/*/description.json',
    '.skilled/skills/*/leaf-manifest.json',
    '.skilled/bin/lib/compiled-routing/serving-closure.manifest.json',
    '.skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite',
]
NATIVE_PROMPTS = {'.pi/prompts/goal-pi.md', '.pi/prompts/vision.md'}

# Manual rows other phases own, by the planning map's groups.
ROUTED = {
    '005': ['.github/workflows/*.yml', '.skilled/scripts/git-hooks/**',
            '.skilled/hooks/git/install-hooks.sh', '.skilled/hooks/git/pre-commit', '.skilled/bin/check-git-hooks.sh',
            '.skilled/scripts/install-git-hooks.sh',
            '.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs',
            '.skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs',
            '.skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs',
            '.skilled/scripts/check-vendored-fork-provenance.mjs'],
    '006': ['.skilled/skills/system-spec-kit/runtime/cli/core/config.ts',
            '.skilled/skills/system-spec-kit/runtime/cli/core/spec-root-*.ts',
            '.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs',
            '.skilled/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts',
            '.skilled/bin/install-codex-hooks.mjs', '.skilled/bin/mcp-code-mode-launcher.cjs',
            '.skilled/bin/relink-local-specs.sh', '.skilled/bin/worktree-session.sh', '.skilled/bin/check-no-spec-imports.cjs',
            '.skilled/bin/tests/fixtures/no-spec-import/negative/clean-runtime.cjs', 'opencode.json'],
    '010': ['PUBLIC-RELEASE.md', '.skilled/scripts/launchagents/**'],
}
# Git-hook READMEs are text, so they stay here even though they sit beside routed contract files.
ROUTED_EXCEPT = {'.skilled/scripts/git-hooks/README.md', '.skilled/scripts/git-hooks/lib/README.md'}

MANUAL = {
    'agents-md': ['AGENTS.md', '.codex/AGENTS.md', '.cursor/rules/skill-routing.md'],
    'git-hook-readmes': ['.skilled/hooks/git-hooks-check/README.md', '.skilled/hooks/git/README.md',
                         '.skilled/scripts/git-hooks/README.md', '.skilled/scripts/git-hooks/lib/README.md'],
    'spec-root-docs': ['.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md',
                       '.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/canonical-first-spec-root-resolution.md',
                       '.skilled/skills/system-spec-kit/runtime/cli/references/spec-root-alias-retirement-runbook.md'],
    'captured-once': ['.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/latency-report.json',
                      '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json',
                      '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/recipe-execution.json',
                      '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/daemon-off-proof.json'],
}
# The planning map's recorded fixtures, rewritten one by one with the assertion that reads them.
RECORDED_FIXTURE_BASIS = 'rule:recorded-fixture (judgment)'
DOC_EXT = ('.md', '.txt', '.tmpl')


def glob_re(pattern):
    """Translate a glob where `**` crosses directories and `*` stays inside one path segment."""
    out, index = [], 0
    while index < len(pattern):
        if pattern.startswith('**/', index):
            out.append('(?:.*/)?'); index += 3
        elif pattern.startswith('**', index):
            out.append('.*'); index += 2
        elif pattern[index] == '*':
            out.append('[^/]*'); index += 1
        elif pattern[index] == '{':
            close = pattern.index('}', index)
            out.append('(?:' + '|'.join(re.escape(part) for part in pattern[index + 1:close].split(',')) + ')'); index = close + 1
        elif pattern[index] == '?':
            out.append('[^/]'); index += 1
        else:
            out.append(re.escape(pattern[index])); index += 1
    return re.compile('^' + ''.join(out) + '$')


_GLOBS = {}


def match(path, pattern):
    if pattern not in _GLOBS:
        _GLOBS[pattern] = glob_re(pattern)
    return bool(_GLOBS[pattern].match(path))


def to_skilled(path):
    return '.skilled/' + path[len('.opencode/'):] if path.startswith('.opencode/') else path


def group_of(path):
    kind = 'docs' if path.endswith(DOC_EXT) else 'code'
    parts = path.split('/')
    if parts[0] == '.skilled':
        if parts[1] == 'skills' and len(parts) > 3:
            return f'{kind}:skills/{parts[2]}'
        if parts[1] in ('agents',):
            return 'agents'
        return f'{kind}:{parts[1]}'
    if parts[0] == '.claude' and len(parts) > 1 and parts[1] == 'agents':
        return 'agents'
    if parts[0] in ('.claude', '.codex', '.cursor', '.devin', '.hermes', '.pi'):
        return 'runtime-files'
    return f'{kind}:root'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', required=True)
    parser.add_argument('--maps', required=True)
    parser.add_argument('--rule', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--keep-list')
    parser.add_argument('--specs-target', choices=['keep', 'canonical'], default='keep')
    args = parser.parse_args()
    repo, out = Path(args.repo), Path(args.out)
    spec = importlib.util.spec_from_file_location('rewrite_batch', args.rule)
    rule_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(rule_module)
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target)

    grep = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-l', '-F', '.opencode', '--', '.',
                           ':!specs/', ':!**/node_modules/**'], capture_output=True, text=True)
    if grep.returncode not in (0, 1):
        raise SystemExit(f'git grep failed: {grep.stderr.strip()}')
    listed = grep.stdout.split('\n')
    candidates = sorted(p for p in listed if p)
    rows = list(csv.DictReader(open(Path(args.maps) / 'map-c-references.tsv'), delimiter='\t'))
    recorded = {to_skilled(r['path']) for r in rows if r['class'] == 'manual' and r['class_basis'] == RECORDED_FIXTURE_BASIS}
    manual_paths = {p: name for name, paths in MANUAL.items() for p in paths}

    buckets = defaultdict(list)
    routed = []
    batches = defaultdict(list)
    census_by_group = defaultdict(Counter)
    census_rows, judged = [], []
    for path in candidates:
        freeze = next((fid for fid, pattern, carve in FREEZE if match(path, pattern) and not (carve and match(path, carve))), None)
        if freeze:
            buckets['freeze'].append(f'{path}\t{freeze}')
            continue
        if any(match(path, g) for g in GENERATED) and path not in NATIVE_PROMPTS:
            buckets['generated'].append(path)
            continue
        owner = None if path in ROUTED_EXCEPT else next((o for o, pats in ROUTED.items() if any(match(path, pt) for pt in pats)), None)
        if owner:
            routed.append(f'{path}\t{owner}')
            continue
        if path in manual_paths:
            buckets['manual'].append(f'{path}\t{manual_paths[path]}')
            continue
        if path in recorded:
            buckets['manual'].append(f'{path}\trecorded-fixture')
            continue
        text = (repo / path).read_bytes().decode('utf-8', 'surrogateescape')
        classes = Counter(o[2] for o in rule.occurrences(path, text))
        specs_edit = args.specs_target == 'canonical' and classes.get('R2')
        if not classes.get('R1') and not classes.get('R3') and not specs_edit:
            buckets['noop'].append(f"{path}\t{','.join(f'{k}={v}' for k, v in sorted(classes.items()))}")
            continue
        if rule_module.NEW_ROOT.search(text):
            group = 'dual-root'
            judged.append(path)
        else:
            group = group_of(path)
        batches[group].append(path)
        census_by_group[group].update(classes)
        census_rows.append('\t'.join([path] + [str(classes.get(c, 0)) for c in ('R1', 'R2', 'R3', 'K', 'X')]))

    out.mkdir(parents=True, exist_ok=True)
    manifests = out / 'batches'
    manifests.mkdir(exist_ok=True)
    for old in manifests.glob('*.txt'):
        old.unlink()
    summary = {'candidates': len(candidates), 'routed': len(routed)}
    for name, items in buckets.items():
        (out / f'{name}.tsv').write_text('\n'.join(items) + '\n')
        summary[name] = len(items)
    (out / 'routed.tsv').write_text('\n'.join(routed) + '\n')
    (out / 'judged.txt').write_text(''.join(f'{p}\n' for p in judged))
    (out / 'census-before.tsv').write_text('path\tR1\tR2\tR3\tK\tX\n' + ''.join(f'{r}\n' for r in census_rows))
    groups = {}
    for group, paths in sorted(batches.items()):
        slug = group.replace(':', '-').replace('/', '-')
        (manifests / f'{slug}.txt').write_text('\n'.join(paths) + '\n')
        groups[slug] = {'files': len(paths), 'occurrences': dict(sorted(census_by_group[group].items()))}
    summary['batched_files'] = sum(g['files'] for g in groups.values())
    summary['judged_files'] = len(judged)
    summary['specs_target'] = args.specs_target
    summary['batched_occurrences'] = dict(sorted(sum((census_by_group[g] for g in batches), Counter()).items()))
    summary['groups'] = groups
    (out / 'summary.json').write_text(json.dumps(summary, indent=1) + '\n')
    total = summary['batched_files'] + len(routed) + sum(len(v) for v in buckets.values())
    print(json.dumps({k: v for k, v in summary.items() if k != 'groups'}))
    print(f'accounted {total} of {len(candidates)} candidates')
    for slug, g in groups.items():
        print(f"{g['files']:5d} {slug:40s} {g['occurrences']}")
    sys.exit(0 if total == len(candidates) else 1)


if __name__ == '__main__':
    main()
