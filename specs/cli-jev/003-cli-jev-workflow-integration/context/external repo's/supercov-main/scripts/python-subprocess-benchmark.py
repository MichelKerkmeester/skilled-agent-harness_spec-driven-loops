#!/usr/bin/env python3
"""Profile a subprocess-heavy suite through the real CLI.

Keep output/project directories outside this repository. Results separate the
CLI's planning, test and publication phases; child counts, work and concurrency
are explicit so a multiplier is never mistaken for a universal overhead.
"""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--binary', action='append', default=[], help='label=/absolute/path/to/supercov')
    parser.add_argument('--python', default=sys.executable)
    parser.add_argument('--files', type=int, default=321)
    parser.add_argument('--statements', type=int, default=250)
    parser.add_argument('--decisions', type=int, default=25)
    parser.add_argument('--decision-width', type=int, default=2)
    parser.add_argument('--children', type=int, default=100)
    parser.add_argument('--tests', type=int, default=1)
    parser.add_argument('--calls', type=int, default=1)
    parser.add_argument('--workers', type=int, default=1)
    parser.add_argument('--mode', choices=['module', 'noop', 'script'], default='module')
    args = parser.parse_args()
    if min(args.files, args.statements, args.children, args.tests, args.calls, args.workers, args.decision_width) < 1 or args.decisions < 0:
        parser.error('sizes must be positive; decisions can be zero')
    if args.tests > args.children:
        parser.error('tests must not exceed children')
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    project = output / 'project'
    if project.exists():
        parser.error('output already contains a project; choose a new output directory')
    app = project / 'app'
    app.mkdir(parents=True)
    (app / '__init__.py').write_text('')
    conditions = ' and '.join(['total > {i}'] + [f'flags[{j}]' for j in range(args.decision_width - 1)])
    body = (f'def calculate(flags={tuple([True] * max(1, args.decision_width - 1))!r}):\n    total = 0\n'
            + ''.join(f'    total += {i}\n' for i in range(args.statements))
            + ''.join('    if ' + conditions.format(i=i) + ':\n        total += 1\n' for i in range(args.decisions))
            + '    return total\n')
    for i in range(args.files):
        (app / f'm{i}.py').write_text(body + '\nif __name__ == "__main__":\n    print(calculate())\n')
    expected = sum(range(args.statements)) + (args.decisions if args.statements > 1 else 0)
    settings = dict(vars(args), output=str(output), expected=expected)
    (project / 'benchmark-settings.json').write_text(json.dumps(settings))
    (project / 'test_workers.py').write_text('''import atexit, concurrent.futures, json, os, pathlib, statistics, subprocess, sys, time, unittest
CONFIG = json.loads(pathlib.Path('benchmark-settings.json').read_text())
LATENCIES = []
DIAGNOSTICS = []
STARTED = time.perf_counter()
TESTS = 0
def finish():
    latencies = sorted(LATENCIES)
    pathlib.Path('child-timings.json').write_text(json.dumps(dict(tests=TESTS, children=len(latencies), plan_bytes=os.stat(os.environ['SUPERCOV_PYTHON_PLAN']).st_size if os.environ.get('SUPERCOV_PYTHON_PLAN') else 0, diagnostic_lines=len(DIAGNOSTICS), elapsed_s=time.perf_counter()-STARTED, median_ms=statistics.median(latencies)*1000 if latencies else None, p95_ms=latencies[min(len(latencies)-1,int(len(latencies)*.95))]*1000 if latencies else None, total_child_s=sum(latencies))))
atexit.register(finish)
def child(index):
    module = 'app.m' + str(index % CONFIG['files'])
    if CONFIG['mode'] == 'noop':
        command = [sys.executable, '-c', 'print("ready")']; expected = 'ready'
    elif CONFIG['mode'] == 'script':
        command = [sys.executable, module.replace('.', '/') + '.py']; expected = str(CONFIG['expected'])
    else:
        code = 'from ' + module + ' import calculate\\nfor _ in range(' + str(CONFIG['calls']) + '): result = calculate()\\nprint(result)'
        command = [sys.executable, '-c', code]; expected = str(CONFIG['expected'])
    started = time.perf_counter()
    result = subprocess.run(command, capture_output=True, text=True)
    elapsed = time.perf_counter() - started
    diagnostics = result.stderr.splitlines()
    DIAGNOSTICS.extend(diagnostics)
    # Older runtimes wrote this known diagnostic for stdlib-only children.
    # Count it separately; other stderr still fails the correctness check.
    unexpected = [line for line in diagnostics if not line.startswith('[supercov] none of ')]
    if result.returncode or result.stdout.strip() != expected or unexpected:
        raise AssertionError((command, result.returncode, result.stdout, result.stderr))
    return elapsed
class Workers(unittest.TestCase): pass
for test in range(CONFIG['tests']):
    indexes = range(test * CONFIG['children'] // CONFIG['tests'], (test+1) * CONFIG['children'] // CONFIG['tests'])
    def run(self, indexes=indexes):
        global TESTS
        TESTS += 1
        if CONFIG['workers'] == 1: LATENCIES.extend(map(child, indexes))
        else:
            with concurrent.futures.ThreadPoolExecutor(CONFIG['workers']) as pool:
                LATENCIES.extend(pool.map(child, indexes))
    setattr(Workers, 'test_' + str(test).zfill(5), run)
''')
    subprocess.run(['git', 'init', '-q', str(project)], check=True)
    plain = {k: v for k, v in os.environ.items() if not k.startswith('SUPERCOV_') and k not in ('PYTHONPATH', 'PYTHONPYCACHEPREFIX')}
    environment = dict(plain, SUPERCOV_PROJECT_ROOT=str(project), SUPERCOV_SOURCE_ROOTS='app', SUPERCOV_VERBOSE='1')
    results = []
    reference_measurement = None
    binaries = [('plain', None)] + [item.split('=', 1) for item in args.binary]
    (output / 'settings.json').write_text(json.dumps(settings, indent=2))
    for label, binary in binaries:
        if not re.fullmatch(r'[a-zA-Z0-9_-]+', label):
            parser.error('binary labels must use letters, digits, underscores or hyphens')
        # Each variant starts with ordinary and probed caches cold, but child
        # processes within that variant share caches as they do in a suite.
        for cache in project.rglob('__pycache__'): shutil.rmtree(cache)
        shutil.rmtree(project / '.supercov/cache', ignore_errors=True)
        command = [args.python, '-m', 'unittest', '-q', 'test_workers']
        if binary: command = [str(Path(binary).resolve()), '--', *command]
        started = time.perf_counter()
        with (output / f'{label}.stdout').open('w') as stdout, (output / f'{label}.stderr').open('w') as stderr:
            process = subprocess.run(command, cwd=project, env=environment if binary else plain, stdout=stdout, stderr=stderr)
        elapsed = time.perf_counter() - started
        stderr = (output / f'{label}.stderr').read_text()
        result = dict(label=label, wall_s=elapsed, returncode=process.returncode,
                      phase_lines=[line for line in stderr.splitlines() if 'timings ' in line or 'python evidence:' in line])
        timing = project / 'child-timings.json'
        if timing.exists():
            result['children'] = json.loads(timing.read_text())
            timing.unlink()
            if process.returncode == 0 and (result['children']['tests'], result['children']['children']) != (args.tests, args.children):
                raise RuntimeError('the benchmark did not execute the requested workload')
        if binary and process.returncode == 0:
            query = subprocess.run([str(Path(binary).resolve()), 'runs', 'latest', '--json'], cwd=project, env=environment, capture_output=True, text=True)
            (output / f'{label}.summary.json').write_text(query.stdout)
            if query.returncode: raise RuntimeError(query.stderr)
            data = json.loads(query.stdout)['data']
            result['measurement'] = {key: data[key] for key in ['coverage', 'measurement', 'testOutcomes', 'tests']}
            if data['tests'] != args.tests or data['testOutcomes']['passed'] != args.tests:
                raise RuntimeError('reported test outcomes differ from the executed workload')
            if reference_measurement is None:
                reference_measurement = result['measurement']
            else:
                result['same_measurement'] = result['measurement'] == reference_measurement
                # Earlier versions did not declare direct native entries as
                # unmeasured; that corrected denominator is an expected change.
                if args.mode != 'script' and not result['same_measurement']:
                    raise RuntimeError('coverage changed between benchmark variants')
        results.append(result)
        (output / 'results.json').write_text(json.dumps(results, indent=2))
        print(json.dumps({k:v for k,v in result.items() if k != 'measurement'}), flush=True)
        if process.returncode:
            raise RuntimeError(stderr[-6000:])


if __name__ == '__main__':
    main()
