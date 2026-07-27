// Isolated single-test runner child. Receives { source, fnName, test } as JSON
// on argv[2]. Defines the model's function via the Function constructor
// (scoped, not a global eval), runs ONE test with structural deep-equality, and
// prints a JSON result. One process per case means a hang/throw is contained to
// that case. `test.probe_only` just verifies the function defines (no call).

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (a && b && typeof a === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}

function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
}

function main() {
  let payload;
  try {
    payload = JSON.parse(process.argv[2]);
  } catch (e) {
    emit({ name: 'unknown', ok: false, error: 'bad payload' });
    return;
  }
  const { source, fnName, test } = payload;

  let fn;
  try {
    const factory = new Function(source + '\nreturn typeof ' + fnName + " === 'function' ? " + fnName + ' : undefined;');
    fn = factory();
  } catch (e) {
    emit({ name: test.name, ok: false, define_error: String(e.message || e) });
    return;
  }
  if (typeof fn !== 'function') {
    emit({ name: test.name, ok: false, define_error: fnName + ' not defined' });
    return;
  }
  if (test.probe_only) {
    emit({ name: test.name, ok: true });
    return;
  }

  try {
    // Deep-clone args so a mutating impl cannot corrupt the expected fixture.
    const args = JSON.parse(JSON.stringify(test.args));
    const got = fn.apply(null, args);
    const ok = deepEqual(got, test.expect);
    emit(ok ? { name: test.name, ok: true } : { name: test.name, ok: false, got });
  } catch (e) {
    emit({ name: test.name, ok: false, error: String(e.message || e) });
  }
}

main();
