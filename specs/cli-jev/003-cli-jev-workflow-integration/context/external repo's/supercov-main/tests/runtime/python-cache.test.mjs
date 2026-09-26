import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const runtime = resolve(import.meta.dirname, '../../runtime/python');
const candidates = process.env.SUPERCOV_PYTHON ? [process.env.SUPERCOV_PYTHON] : ['python3.14', 'python3.13', 'python3.12', 'python3.11', 'python3.10', 'python3.9', 'python3'];
const python = candidates.find(p => spawnSync(p, ['-c', 'import sys; sys.exit(sys.version_info < (3, 9))']).status === 0);
const skip = python ? false : 'CPython 3.9+ is unavailable';
function run(script) {
  const result = spawnSync(python, ['-c', script, runtime], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
}

const fixture = `
import os, sys, json, tempfile, pathlib, subprocess
sys.path.insert(0, sys.argv[1])
import supercov_probes as probes
source = 'def choose(a, b):\\n    if a and b:\\n        return "yes"\\n    return "no"\\n'
def file_plan(name):
    return {"statements": [{"id": name + ':s', "start": [1,0], "end": [4,15], "lines": [1,4]}],
            "decisions": [{"id": name + ':d', "span": [[2,7],[2,14]], "outcomeTrue": name + ':t', "outcomeFalse": name + ':f',
                           "conditions": [{"span": [[2,7],[2,8]], "not": 0}, {"span": [[2,13],[2,14]], "not": 0}]}]}
def child(code, root, env):
    p = subprocess.run([sys.executable, '-c', code], cwd=root, env=env, text=True, capture_output=True)
    assert p.returncode == 0, (p.stdout, p.stderr)
    assert '[supercov]' not in p.stderr, p.stderr
    return p.stdout
`;

test('ordinary compilation stays plain and exported probes preserve condition semantics without the runtime', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary)
    names = ['compiled', 'explicit', 'loaded', 'exported']
    for name in names: (root / (name + '.py')).write_text(source)
    plan = root / 'plan.json'
    plan.write_text(json.dumps({'version': 1, 'root': str(root), 'files': {name + '.py': file_plan(name) for name in names}}))
    plain = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
    env = dict(plain, PYTHONPATH=sys.argv[1], SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_RUN_ID='cache', SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / 'evidence'))
    child('''import py_compile, importlib.machinery, importlib.util, marshal, pathlib
py_compile.compile('compiled.py', doraise=True)
py_compile.compile('explicit.py', cfile='explicit.pyc', doraise=True)
import importlib.abc, supercov_probes
assert isinstance(supercov_probes.ProbeFinder(supercov_probes._probing), importlib.abc.MetaPathFinder)
class CustomLoader(importlib.abc.SourceLoader):
    def get_filename(self, name): return str(pathlib.Path('loaded.py').resolve())
    def get_data(self, path): return pathlib.Path(path).read_bytes()
    def path_stats(self, path): return dict(mtime=pathlib.Path(path).stat().st_mtime, size=pathlib.Path(path).stat().st_size)
    def set_data(self, *args, **kwargs): raise AssertionError('probes escaped through a custom SourceLoader')
custom = {}; exec(CustomLoader().get_code('loaded'), custom)
assert custom['choose'](True, True) == 'yes'
code = importlib.machinery.SourceFileLoader('loaded', 'loaded.py').get_code('loaded')
namespace = {}; exec(code, namespace)
assert namespace['choose'](True, True) == 'yes'
assert not pathlib.Path(importlib.util.cache_from_source('loaded.py')).exists()
for path in [importlib.util.cache_from_source('compiled.py'), 'explicit.pyc']:
    data = pathlib.Path(path).read_bytes()
    assert b'supercov_probes' not in data, path
# An external consumer can persist compile()'s code itself. Its fallback
# must still preserve semantics without an installed Supercov module.
code = compile(pathlib.Path('exported.py').read_text(), str(pathlib.Path('exported.py').resolve()), 'exec')
pathlib.Path('exported.code').write_bytes(marshal.dumps(code))
''', root, env)
    child('''import compiled, loaded, marshal, pathlib, sys
from importlib.machinery import SourcelessFileLoader
explicit = SourcelessFileLoader('explicit', 'explicit.pyc').load_module()
namespace = {}; exec(marshal.loads(pathlib.Path('exported.code').read_bytes()), namespace)
namespace['bool'] = lambda value: False  # Source globals must not alter fallback truth conversion.
for choose in [compiled.choose, loaded.choose, explicit.choose, namespace['choose']]:
    assert [choose(a,b) for a,b in [(False,False),(False,True),(True,False),(True,True)]] == ['no','no','no','yes']
assert 'supercov_probes' not in sys.modules
''', root, plain)
    child('''import marshal, pathlib
namespace = {}; exec(marshal.loads(pathlib.Path('exported.code').read_bytes()), namespace)
assert namespace['choose'](True, True) == 'yes'
assert namespace['choose'](True, False) == 'no'
''', root, dict(plain, PYTHONPATH=sys.argv[1]))
`));

test('prepared plans load lazily, preserve numbering, invalidate on change and recover from truncated caches', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary); path = root / 'plan.json'
    plan = {'version': 1, 'root': str(root), 'files': {name + '.py': file_plan(name) for name in ['a','b']}, 'assertionSites': {'test_a.py': [3,4]}}
    path.write_text(json.dumps(plan))
    _, cold = probes.load_plan(str(path), 1)
    original = probes.index_plan
    probes.index_plan = lambda plan: (_ for _ in ()).throw(AssertionError('warm startup indexed the plan'))
    _, warm = probes.load_plan(str(path), 1)
    assert not warm.files.loaded and not warm.ids.loaded and not warm.decisions.loaded and not warm.boolop_groups.loaded
    assert 'a.py' in warm.files and not warm.files.loaded
    assert warm.files['b.py'].__dict__ == cold.files['b.py'].__dict__
    assert set(warm.files.loaded) == {'b.py'}
    assert warm.sites['test_a.py'].__dict__ == cold.sites['test_a.py'].__dict__
    assert warm.layout() == cold.layout()
    probes.index_plan = original
    plan['files']['c.py'] = file_plan('c'); path.write_text(json.dumps(plan))
    _, changed = probes.load_plan(str(path), 1)
    assert changed.digest != cold.digest and len(changed.files) == 3
    for cache in root.glob('plan.json.*'): cache.write_bytes(b'bad')
    _, recovered = probes.load_plan(str(path), 1)
    assert recovered.layout() == changed.layout()
    for cache in root.glob('plan.json.*'): cache.unlink()
    original_mkstemp = tempfile.mkstemp
    def unwritable(*args, **kwargs): raise PermissionError('read-only cache')
    tempfile.mkstemp = unwritable
    _, uncached = probes.load_plan(str(path), 1)
    assert uncached.layout() == changed.layout()
    tempfile.mkstemp = original_mkstemp
    code = 'import sys;sys.path.insert(0,sys.argv[1]);import supercov_probes as p;print(p.load_plan(sys.argv[2],1)[1].digest)'
    children = [subprocess.Popen([sys.executable, '-c', code, sys.argv[1], str(path)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True) for _ in range(4)]
    for process in children:
        out, err = process.communicate()
        assert process.returncode == 0 and out.strip() == changed.digest, (out,err)
    assert probes.load_plan(str(path), 1)[1].layout() == changed.layout()
`));

test('runtime descriptors are close-on-exec; a reused descriptor is not the original launch file', { skip: skip || process.platform === 'win32' }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary); plan = root / 'plan.json'
    plan.write_text(json.dumps({'version':1,'root':str(root),'files':{'a.py':file_plan('a')}}))
    sentinel = root / 'launch'; sentinel.write_text('launch')
    plain = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
    env = dict(plain, PYTHONPATH=sys.argv[1], SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_RUN_ID='fd', SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / 'evidence'), SUPERCOV_CONTEXT=json.dumps({'test':'t','phase':'call'}))
    inspect = '''import os, supercov_runtime as rt
expected = os.stat('launch')
for fd in range(4, 64):
    try: actual = os.fstat(fd)
    except OSError: continue
    assert (actual.st_dev, actual.st_ino) != (expected.st_dev, expected.st_ino), fd
    assert not os.get_inheritable(fd), fd
runtime = rt.runtime()
assert runtime.current_identity()['test'] == 't'
assert all(not os.get_inheritable(slot.descriptor) for slot in runtime.live_slots)
'''
    launch = 'import os, sys; keeper=os.open(os.devnull,os.O_RDONLY); os.dup2(keeper,3,inheritable=True); os.set_inheritable(3,True); fd=os.open("launch",os.O_RDONLY); os.dup2(fd,9,inheritable=False); os.execve(sys.executable,[sys.executable,"-c",' + repr(inspect) + '], ' + repr(env) + ')'
    child(launch, root, plain)
`));

test('stdlib-only children preserve stdout, stderr and exit status', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary); plan = root / 'plan.json'
    plan.write_text(json.dumps({'version':1,'root':str(root),'files':{'a.py':file_plan('a')}}))
    plain = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
    env = dict(plain, PYTHONPATH=sys.argv[1], SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_RUN_ID='streams', SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / 'evidence'))
    for code in ['pass', 'print("ready")', 'import sys;sys.stderr.write("expected stderr\\\\n");sys.exit(3)']:
        baseline = subprocess.run([sys.executable,'-c',code], env=plain, cwd=root, capture_output=True)
        measured = subprocess.run([sys.executable,'-c',code], env=env, cwd=root, capture_output=True)
        assert (measured.returncode, measured.stdout, measured.stderr) == (baseline.returncode, baseline.stdout, baseline.stderr), (code, measured.stderr)
    child('''import os,sys,subprocess,supercov_runtime
supercov_runtime.runtime().switch({'test':'isolated-env','phase':'call'})
environment = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
code = 'import os; assert not any(k.startswith("SUPERCOV_") for k in os.environ)'
result = subprocess.run([sys.executable,'-c',code], env=environment, capture_output=True)
assert result.returncode == 0, result.stderr
assert result.stdout == result.stderr == b''
''', root, env)
`));

test('imports and dynamic compile preserve caller future flags on cold and warm caches', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary)
    annotated = 'def f(value: int) -> bool: return True\\n'
    # Exercise planned imports, explicit loaders, and planned/unplanned compile.
    for name in ['ordinary', 'explicit', 'dynamic']:
        (root / (name + '.py')).write_text(annotated)
    (root / 'future.py').write_text('from __future__ import annotations\\n' + annotated)
    driver = r'''import __future__, ast, json, pathlib
import ordinary, future
from importlib.machinery import SourceFileLoader
explicit = {}; exec(SourceFileLoader('explicit', 'explicit.py').get_code('explicit'), explicit)
values = [ordinary.f.__annotations__, future.f.__annotations__, explicit['f'].__annotations__]
source = pathlib.Path('dynamic.py').read_text()
for filename in ['<dynamic>', str(pathlib.Path('dynamic.py').resolve())]:
    for prefix in ['', 'from __future__ import annotations\\n']:
        for flags, dont_inherit in [(0, False), (0, True), (__future__.annotations.compiler_flag, True)]:
            caller = prefix + 'code = compile(source, filename, "exec", flags, dont_inherit)'
            ns = dict(source=source, filename=filename, flags=flags, dont_inherit=dont_inherit)
            exec(compile(caller, '<caller>', 'exec', dont_inherit=True), ns)
            result = {}; exec(ns['code'], result)
            values.append(result['f'].__annotations__)
    # AST inputs and compile's eval mode must retain normal behavior too.
    result = {}; exec(compile(ast.parse(source), filename, 'exec'), result)
    values.append(result['f'].__annotations__)
assert eval(compile('1 + 2', '<eval>', 'eval')) == 3
# A second future flag catches implementations that only handle annotations.
ns = {}; exec(compile('from __future__ import barry_as_FLUFL\\nresult = eval(compile("1 <> 2", "<eval>", "eval"))', '<barry>', 'exec'), ns)
assert ns['result'] is True
print(json.dumps(values, default=repr, sort_keys=True))
'''
    # Escape sequences above are part of the child program, not this launcher.
    plain = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
    plan = root / 'plan.json'
    plan.write_text(json.dumps({'version':1,'root':str(root),'files':{name + '.py':{} for name in ['ordinary','future','explicit','dynamic']}}))
    env = dict(plain, PYTHONPATH=sys.argv[1], SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_RUN_ID='annotations', SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / 'evidence'))
    expected = child(driver, root, plain)
    for _ in range(2): assert child(driver, root, env) == expected
`));

test('compiled caches replay per-obligation limitations and recover from malformed entries', { skip }, () => run(fixture + `
if sys.version_info < (3,11): sys.exit(0)
source = 'try:\\n    raise ExceptionGroup("g", [ValueError()])\\nexcept* ValueError:\\n    pass\\nexcept* TypeError:\\n    pass\\n'
plan = {'tries': [{'body': [[2,4],[2,46]], 'handlers': [{'selected':h+':selected','missed':h+':missed','bare':False} for h in ['value','type']], 'success':'try:success','raised':'try:raised'}]}
fp = probes.FileProbes('sample.py', plan, probes.SLOT_HEADER); fp._finish()
with tempfile.TemporaryDirectory() as cache:
    reports = []
    def compile_once():
        reports.clear()
        probing = probes.Probing({}, lambda path: None, cache)
        probing.report = lambda *item: reports.append(item)
        return probing.compile(source, 'sample.py', fp)
    cold = compile_once(); expected = list(reports)
    assert [item[3] for item in expected] == ['value', 'type'], expected
    # Verify an actual cache hit, not an accidental successful recompilation.
    original = probes.instrument
    probes.instrument = lambda *args: (_ for _ in ()).throw(AssertionError('warm cache transformed source'))
    warm = compile_once()
    assert cold.co_code == warm.co_code and reports == expected
    probes.instrument = original
    import marshal
    for invalid in [b'truncated', marshal.dumps((None, [])), marshal.dumps((cold, [('bad',)]))]:
        for path in pathlib.Path(cache).glob('*.pyc'): path.write_bytes(invalid)
        compile_once()
        assert reports == expected
`));

test('a compiled cache entry is used only for the exact source it was compiled from', { skip }, () => run(fixture + `
# One file, one numbering, one interpreter: the cache entry is found by those,
# so an edited source lands on the same entry and must never get its code.
fp = probes.FileProbes('edited.py', {}, probes.SLOT_HEADER); fp._finish()
with tempfile.TemporaryDirectory() as cache:
    def compiled(text):
        namespace = {}
        exec(probes.Probing({}, lambda path: None, cache).compile(text, 'edited.py', fp), namespace)
        return namespace['VALUE']
    first, second = 'VALUE = 1\\n', 'VALUE = 2\\n'
    assert compiled(first) == 1
    assert compiled(second) == 2, 'an edited source reused the cached code'
    original = probes.instrument
    probes.instrument = lambda *args: (_ for _ in ()).throw(AssertionError('warm cache transformed source'))
    assert compiled(second) == 2, 'the edit is cached in turn'
    probes.instrument = original
    assert compiled(first) == 1
    assert compiled(first.encode()) == 1, 'bytes and text sources are told apart'
`));

test('shared compiled caches respect child interpreter optimization levels', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary)
    (root / 'optimized.py').write_text('"module doc"\\nflag = __debug__\\ndef f():\\n    assert False\\n    return 1\\n')
    plan = root / 'plan.json'
    plan.write_text(json.dumps({'version':1,'root':str(root),'files':{'optimized.py':{}}}))
    plain = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
    env = dict(plain, PYTHONPATH=sys.argv[1], SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_RUN_ID='optimization', SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / 'evidence'))
    driver = '''import json, optimized
try: result = optimized.f()
except AssertionError: result = 'assertion'
print(json.dumps([optimized.flag, optimized.__doc__, result]))
'''
    for options in [[], ['-O'], ['-OO'], [], ['-OO'], ['-O']]:
        command = [sys.executable, *options, '-c', driver]
        baseline = subprocess.run(command, cwd=root, env=plain, capture_output=True)
        measured = subprocess.run(command, cwd=root, env=env, capture_output=True)
        assert baseline.returncode == measured.returncode == 0, (baseline.stderr, measured.stderr)
        assert (measured.stdout, measured.stderr) == (baseline.stdout, baseline.stderr), (options, baseline.stdout, measured.stdout)
`));

test('compiled cache preserves source encoding and traceback filenames', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as cache:
    probing = probes.Probing({}, lambda path: None, cache)
    sites = probes.SiteProbes('sample.py', [])
    source = '# coding: latin-1\\nvalue = "é"\\ndef f(): return value\\n'
    # The bytes have the same digest input as UTF-8-encoded str, but their
    # encoding cookie changes what Python evaluates. Relative and absolute
    # loader paths must also retain their respective traceback filenames.
    for value in [source, source.encode('utf-8'), source]:
        for filename in ['sample.py', str(pathlib.Path(cache) / 'sample.py'), 'sample.py']:
            expected = probes._original_compile(value, filename, 'exec', dont_inherit=True)
            actual = probing.compile(value, filename, sites)
            plain = {}; measured = {}; exec(expected, plain); exec(actual, measured)
            assert measured['value'] == plain['value']
            assert actual.co_filename == expected.co_filename
            assert measured['f'].__code__.co_filename == plain['f'].__code__.co_filename
`));

test('optional adapters load on demand and retain context for early and late imports', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary); plan = root / 'plan.json'
    plan.write_text(json.dumps({'version':1,'root':str(root),'files':{'a.py':file_plan('a')}}))
    (root / 'adapter_worker.py').write_text('def inspect_context(queue):\\n    import supercov_runtime\\n    queue.put(supercov_runtime.runtime().current_identity())\\n')
    plain = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
    measured = dict(plain, PYTHONPATH=sys.argv[1], SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_RUN_ID='adapters', SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / 'evidence'))
    child('''import sys
assert 'subprocess' not in sys.modules
assert 'multiprocessing.process' not in sys.modules
assert 'concurrent.futures.thread' not in sys.modules
assert 'unittest' not in sys.modules
''', root, measured)
    driver = '''import json, os, sys
import supercov_runtime
runtime = supercov_runtime.runtime() or supercov_runtime.install()
runtime.switch({'test':'inherited','phase':'call'})
import concurrent.futures, subprocess, multiprocessing, unittest
from adapter_worker import inspect_context
with concurrent.futures.ThreadPoolExecutor(1) as pool:
    assert pool.submit(runtime.current_identity).result()['test'] == 'inherited'
code = 'import json,supercov_runtime;print(json.dumps(supercov_runtime.runtime().current_identity()))'
result = subprocess.run([sys.executable,'-c',code],capture_output=True,text=True)
assert result.returncode == 0 and result.stderr == '', result.stderr
assert json.loads(result.stdout)['test'] == 'inherited'
context = multiprocessing.get_context('spawn')
queue = context.Queue(); worker = context.Process(target=inspect_context, args=(queue,))
worker.start()
assert queue.get(timeout=20)['test'] == 'inherited'
worker.join(timeout=20)
assert worker.exitcode == 0, worker.exitcode
queue.close(); queue.join_thread()
class Example(unittest.TestCase):
    def test_case(self): self.assertTrue(True)
result = unittest.TestResult()
Example('test_case').run(result)
assert result.wasSuccessful() and result.testsRun == 1
assert any(identity['test'].endswith('Example.test_case') for identity in runtime.identities.values())
'''
    child(driver, root, measured)
    # Libraries present before installation must be patched immediately too.
    before = dict(plain, PYTHONPATH=sys.argv[1])
    configure = 'import concurrent.futures, concurrent.futures.thread, subprocess, multiprocessing, unittest, os\\nos.environ.update(' + repr({k:v for k,v in measured.items() if k.startswith('SUPERCOV_')}) + ')\\n'
    child(configure + driver, root, before)
`));


test('condition probes preserve truth side effects, short circuiting and errors', { skip }, () => run(fixture + `
with tempfile.TemporaryDirectory() as temporary:
    root = pathlib.Path(temporary)
    (root / 'compound.py').write_text(source)
    (root / 'single.py').write_text(source.replace('a and b', 'a'))
    single = file_plan('single')
    single['decisions'][0]['span'] = [[2,7],[2,8]]
    single['decisions'][0]['conditions'] = single['decisions'][0]['conditions'][:1]
    plan = root / 'plan.json'
    plan.write_text(json.dumps({'version':1,'root':str(root),'files':{'compound.py':file_plan('compound'),'single.py':single}}))
    plain = {k:v for k,v in os.environ.items() if not k.startswith('SUPERCOV_') and k != 'PYTHONPATH'}
    env = dict(plain, PYTHONPATH=sys.argv[1], SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_RUN_ID='truth', SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / 'evidence'))
    code = '''import compound, single
calls = []
class Truth:
    def __init__(self, name, value): self.name, self.value = name, value
    def __bool__(self): calls.append(self.name); return self.value
class Length:
    def __init__(self, name, value): self.name, self.value = name, value
    def __len__(self): calls.append(self.name); return int(self.value)
class Raising:
    def __bool__(self): calls.append('raise'); raise ValueError('truth failed')
for choose in (compound.choose, single.choose):
    for kind in (Truth, Length):
        for a,b in ((False,False),(False,True),(True,False),(True,True)):
            calls.clear()
            result = choose(kind('a',a),kind('b',b))
            expected = a and b if choose is compound.choose else a
            assert result == ('yes' if expected else 'no')
            assert calls == (['a','b'] if choose is compound.choose and a else ['a']), calls
    calls.clear()
    try: choose(Raising(), True)
    except ValueError as error: assert str(error) == 'truth failed'
    else: raise AssertionError('truth exception was swallowed')
    assert calls == ['raise']
    calls.clear()
    try: choose(Truth('invalid', 1), True)
    except TypeError: pass
    else: raise AssertionError('invalid __bool__ return was accepted')
    assert calls == ['invalid']
'''
    child(code, root, plain)
    child(code, root, env)
`));

test('a match without a catch-all preserves selected, missed and unmatched outcomes', { skip }, () => run(fixture + `
if sys.version_info < (3, 10): raise SystemExit(0)
import ast
source = 'def choose(value, allow=True):\\n    match value:\\n        case 1:\\n            return "one"\\n        case 2 if allow:\\n            return "two"\\n    return "other"\\n'
index = probes.index_plan({'root': '.', 'files': {'m.py': {'matches': [{
    'span': [[2,4],[6,24]],
    'cases': [{'selected':'one','missed':'not-one','irrefutable':False},
              {'selected':'two','missed':'not-two','irrefutable':False}],
    'noCase': {'matched':'matched','unmatched':'unmatched'},
}]}}})
file = index.files['m.py']
tree = probes.instrument(ast.parse(source), file)
namespace = {}
hits = bytearray(index.slot_bytes)
probes.hits_get = lambda: hits
exec(compile(tree, 'm.py', 'exec'), namespace)
for value, allow, expected, observed in [
    (1, True, 'one', {'one','matched'}),
    (2, True, 'two', {'not-one','two','matched'}),
    (2, False, 'other', {'not-one','not-two','unmatched'}),
    (3, True, 'other', {'not-one','not-two','unmatched'}),
]:
    hits[:] = bytes(len(hits))
    assert namespace['choose'](value, allow) == expected
    actual = {name for i,name in enumerate(index.ids) if hits[probes.SLOT_HEADER+i]}
    assert actual == observed, (value, allow, actual, observed)
`));
