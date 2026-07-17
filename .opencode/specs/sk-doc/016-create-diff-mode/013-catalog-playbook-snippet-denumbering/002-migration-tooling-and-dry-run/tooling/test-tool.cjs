// Automated test harness for denumber-snippets.cjs. Rebuilds fixtures each run.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const TOOL = path.join(DIR, 'denumber-snippets.cjs');
const FIX = path.join(DIR, 'fixtures');
let pass = 0, fail = 0;
const check = (name, cond, detail) => { if (cond) { pass++; console.log('PASS  ' + name); } else { fail++; console.log('FAIL  ' + name + (detail ? '  :: ' + String(detail).slice(0, 200) : '')); } };
const run = (args) => {
  try { const out = execSync('node "' + TOOL + '" ' + args, { cwd: DIR, encoding: 'utf8' }); return { code: 0, out }; }
  catch (e) { return { code: e.status == null ? -1 : e.status, out: (e.stdout || '') + (e.stderr || '') }; }
};
const read = (p) => fs.readFileSync(p, 'utf8');
const jread = (p) => { try { return JSON.parse(read(p)); } catch (e) { return null; } };

if (!fs.existsSync(TOOL)) { console.log('TOOL NOT FOUND at ' + TOOL); process.exit(2); }
execSync('node "' + path.join(DIR, 'make-fixtures.cjs') + '"', { cwd: DIR });
const HAPPY = path.join(FIX, 'happy/feature_catalog');
const refsFile = path.join(FIX, 'refs.txt');
fs.writeFileSync(refsFile, path.join(FIX, 'happy/external-referrer.md') + '\n');

// 1) dry-run changes nothing
let r = run('--tree "' + HAPPY + '" --referrers "' + refsFile + '" --dry-run --manifest-dir "' + path.join(DIR, 'mtest') + '"');
check('dry-run exit 0', r.code === 0, r.out);
check('dry-run did NOT rename', fs.existsSync(path.join(HAPPY, '01--alpha/001-foo.md')));
const rm = jread(path.join(DIR, 'mtest/rename-manifest.json'));
check('rename-manifest written + nonempty', Array.isArray(rm) && rm.length === 3, JSON.stringify(rm));
check('manifest maps 001-foo -> foo', !!rm && rm.some(x => /001-foo\.md$/.test(x.src) && /\/foo\.md$/.test(x.dst)), JSON.stringify(rm));

// 2) apply
r = run('--tree "' + HAPPY + '" --referrers "' + refsFile + '" --apply --manifest-dir "' + path.join(DIR, 'mtest') + '"');
check('apply exit 0', r.code === 0, r.out);
check('foo.md exists', fs.existsSync(path.join(HAPPY, '01--alpha/foo.md')));
check('foo-bar.md exists (substring slug)', fs.existsSync(path.join(HAPPY, '01--alpha/foo-bar.md')));
check('001-foo.md removed', !fs.existsSync(path.join(HAPPY, '01--alpha/001-foo.md')));
const fooNew = fs.existsSync(path.join(HAPPY, '01--alpha/foo.md')) ? read(path.join(HAPPY, '01--alpha/foo.md')) : '';
check('Feature ID M-219 preserved in snippet', fooNew.includes('M-219'));
check('self SOURCE METADATA path de-numbered', fooNew.includes('`01--alpha/foo.md`') && !fooNew.includes('001-foo.md'));
check('same-dir neighbor link de-numbered', fooNew.includes('(foo-bar.md)') && !fooNew.includes('(002-foo-bar.md)'));
const rootNew = read(path.join(HAPPY, 'feature_catalog.md'));
check('root link de-numbered', rootNew.includes('(01--alpha/foo.md)'));
check('#anchor preserved on root link', rootNew.includes('foo-bar.md#section'));
check('./ prefix link de-numbered', rootNew.includes('(./01--alpha/foo-bar.md#section)'));
check('code-fence link de-numbered', rootNew.includes('see 01--alpha/foo.md'));
check('root Feature IDs intact (M-219, EX-001)', rootNew.includes('M-219') && rootNew.includes('EX-001'));
check('category folder NN-- preserved', rootNew.includes('01--alpha/') && rootNew.includes('02--beta/'));
const extNew = read(path.join(FIX, 'happy/external-referrer.md'));
check('external referrer foo de-numbered', extNew.includes('01--alpha/foo.md') && !extNew.includes('001-foo.md'));
check('external referrer baz de-numbered', extNew.includes('02--beta/baz.md') && !extNew.includes('003-baz.md'));

// 3) idempotent re-apply
r = run('--tree "' + HAPPY + '" --referrers "' + refsFile + '" --apply --manifest-dir "' + path.join(DIR, 'mtest2') + '"');
const rm2 = jread(path.join(DIR, 'mtest2/rename-manifest.json'));
check('idempotent: 0 renames on re-apply', Array.isArray(rm2) && rm2.length === 0, JSON.stringify(rm2));

// 4) collision aborts with no writes
const COL = path.join(FIX, 'collide/manual_testing_playbook');
r = run('--tree "' + COL + '" --apply --manifest-dir "' + path.join(DIR, 'mtestc') + '"');
check('collision exit code 2', r.code === 2, 'code=' + r.code);
const cr = jread(path.join(DIR, 'mtestc/collision-report.json'));
check('collision-report populated', cr && Object.keys(cr).length > 0, JSON.stringify(cr));
check('collision did NOT rename anything', fs.existsSync(path.join(COL, '16--x/010-dup.md')) && fs.existsSync(path.join(COL, '16--x/011-dup.md')));

console.log('\n=== ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
