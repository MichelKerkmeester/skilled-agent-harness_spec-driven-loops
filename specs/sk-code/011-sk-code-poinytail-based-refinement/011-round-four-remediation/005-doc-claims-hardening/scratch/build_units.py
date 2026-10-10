# Planner tool: defines every Phase 2 unit once, writes dispatch-units.json, and can apply the
# edit and create units in order to a mirror tree to prove each OLD text is unique when its turn
# comes. Run from the repository root:
#   python3 -I <folder>/scratch/build_units.py                 (write dispatch-units.json)
#   python3 -I <folder>/scratch/build_units.py --apply <mirror> (apply units to <mirror>/sk-code)
import json
import os
import sys

FOLDER = "specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening"
OC = ".skilled/skills/sk-code/sk-code-opencode"
CHECKER = f"{OC}/assets/scripts/verify_doc_claims.cjs"
TEST = f"{OC}/scripts/tests/verify_doc_claims.test.cjs"
GUARD = f"{OC}/references/shared/workflow-guardrails.md"
AREADME = f"{OC}/assets/scripts/README.md"
SKILL = f"{OC}/SKILL.md"
CHANGELOG = f"{OC}/changelog/v1.2.1.0.md"

UNITS = []


def edit(task, file, old, new, check, expect):
    UNITS.append({"task": task, "file": file, "kind": "edit", "old": old, "new": new, "check": check, "expect": expect})


def command(task, files, cmd, check, expect):
    UNITS.append({"task": task, "files": files, "kind": "command", "cmd": cmd, "check": check, "expect": expect})


def create(task, file, source, check, expect):
    UNITS.append({"task": task, "file": file, "kind": "create", "source": source, "check": check, "expect": expect})


TIERS_TEST_HEAD = "test('known-bad tiers: a file the prose says always loads but DEFAULT_RESOURCE omits is reported', (t) => {\n"

# ---- tests first, so the negative control can show them failing ---------------------------------
edit("T013", TEST, TIERS_TEST_HEAD, r"""test('a missing --root directory prints one usage line and exits 2', () => {
  const missing = path.join(os.tmpdir(), 'doc-claims-root-that-does-not-exist');
  const result = spawnSync(process.execPath, [CHECKER, '--root', missing], { encoding: 'utf8' });
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /^usage: verify_doc_claims .*--root is not a directory/);
  assert.equal(result.stderr.trim().split('\n').length, 1, result.stderr);
});

""" + TIERS_TEST_HEAD,
     f"grep -c 'a missing --root directory prints one usage line and exits 2' {TEST}", "1")

edit("T014", TEST, TIERS_TEST_HEAD, r"""test('known-bad paths: a packet-relative link label that names no real file is reported', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'sk-code-demo', 'assets', 'checklists', 'real.md'), '# real\n');
  write(path.join(hub, 'sk-code-other', 'assets', 'checklists', 'other.md'), '# other\n');
  write(path.join(hub, 'sk-code-demo', 'references', 'bad.md'), [
    '[`assets/checklists/gone.md`](../../sk-code-other/assets/checklists/other.md)',
    '[`assets/checklists/other.md`](../../sk-code-other/assets/checklists/other.md)',
    '[`assets/checklists/real.md`](../assets/checklists/real.md)',
    '',
  ].join('\n'));
  const { status, out } = run(hub, 'paths');
  assert.equal(status, 1, out);
  assert.match(out, /bad\.md:1: link label is a path that does not resolve: assets\/checklists\/gone\.md/);
  assert.doesNotMatch(out, /bad\.md:2:/);
  assert.doesNotMatch(out, /bad\.md:3:/);
});

""" + TIERS_TEST_HEAD,
     f"grep -c 'a packet-relative link label that names no real file is reported' {TEST}", "1")

edit("T015", TEST, TIERS_TEST_HEAD, r"""test('known-bad paths: an anchor that names no heading or explicit anchor is reported', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'sk-code-demo', 'references', 'target.md'), [
    '# Target',
    '## 2. IMPLEMENTATION GUARDRAILS',
    '## 7. 🐛 COMMON ISSUES',
    '<a id="custom-spot"></a>',
    '',
  ].join('\n'));
  write(path.join(hub, 'sk-code-demo', 'references', 'bad.md'), [
    '# Bad doc',
    '[ok](./target.md#2-implementation-guardrails) [emoji](./target.md#7--common-issues) [explicit](./target.md#custom-spot) [self](#bad-doc)',
    '[gone](./target.md#9-missing-section)',
    '`sk-code-demo/references/target.md#2-implementation-guardrails`',
    '`sk-code-demo/references/target.md#nope`',
    '[selfgone](#not-here)',
    '',
  ].join('\n'));
  const { status, out } = run(hub, 'paths');
  assert.equal(status, 1, out);
  assert.match(out, /bad\.md:3: link anchor does not resolve: \.\/target\.md#9-missing-section/);
  assert.match(out, /bad\.md:5: anchor does not resolve: sk-code-demo\/references\/target\.md#nope/);
  assert.match(out, /bad\.md:6: link anchor does not resolve: #not-here/);
  assert.doesNotMatch(out, /bad\.md:2:/);
  assert.doesNotMatch(out, /bad\.md:4:/);
});

""" + TIERS_TEST_HEAD,
     f"grep -c 'an anchor that names no heading or explicit anchor is reported' {TEST}", "1")

edit("T016", TEST, TIERS_TEST_HEAD, r"""test('a conditional loading bullet that names a glob or a file is not an every-route claim', (t) => {
  const hub = buildHub(t);
  write(path.join(hub, 'shared', 'references', 'extra', 'gamma.md'), '# gamma\n');
  write(path.join(hub, 'ROUTER.md'), [
    ROUTER.trimEnd(),
    '- the `shared/references/extra/*` checklists when a DEBUGGING intent fires, plus',
    '- `shared/references/extra/gamma.md` only for the matched intents',
    '',
  ].join('\n'));
  const { status, out } = run(hub, 'tiers');
  assert.equal(status, 0, out);
  assert.match(out, /PASS check tiers/);
});

""" + TIERS_TEST_HEAD,
     f"grep -c 'a conditional loading bullet that names a glob or a file is not an every-route claim' {TEST}", "1")

command("T017", [f"{FOLDER}/scratch/neg-doc-claims-test.txt"],
        f"node --test {TEST} > {FOLDER}/scratch/neg-doc-claims-test.txt 2>&1; echo \"exit=$?\"",
        f"grep -E '^. (pass|fail) ' {FOLDER}/scratch/neg-doc-claims-test.txt",
        "fail 4")

# ---- checker -------------------------------------------------------------------------------------
edit("T018", CHECKER,
     "// must resolve, retired packet names must be gone, the surface count must match the hub, and\n",
     "// and their anchors must resolve, retired packet names must be gone, the surface count must\n// match the hub, and\n",
     f"grep -c 'and their anchors must resolve' {CHECKER}", "1")

edit("T019", CHECKER,
     "const TWO_SURFACE_WORDING = [/\\btwo (?:supported )?surfaces\\b/gi, /\\bboth supported surfaces\\b/gi];\n",
     "const TWO_SURFACE_WORDING = [/\\btwo (?:supported )?surfaces\\b/gi, /\\bboth supported surfaces\\b/gi];\n"
     "// A Surface-aware loading bullet that states a condition describes a load that depends on the\n"
     "// route, so the files and globs it names are not every-route claims.\n"
     "const CONDITIONAL_WORDING = /\\b(?:when|if|unless|only|matched)\\b/i;\n",
     f"grep -c 'const CONDITIONAL_WORDING' {CHECKER}", "1")

edit("T020", CHECKER, r"""function parseArgs(argv) {
  const rootIdx = argv.indexOf('--root');
  const hub = rootIdx !== -1 && argv[rootIdx + 1] ? path.resolve(argv[rootIdx + 1]) : DEFAULT_HUB;
  const checksIdx = argv.indexOf('--checks');
  const known = CHECKS.map((c) => c[0]);
  if (checksIdx === -1) return { hub, selected: known };
  const ids = (argv[checksIdx + 1] || '').split(',').filter(Boolean);
  const unknown = ids.filter((id) => !known.includes(id));
  if (ids.length === 0 || unknown.length) {
    console.error(`usage: verify_doc_claims [--root <hub dir>] [--checks ${known.join(',')}] (unknown: ${unknown.join(',') || 'none given'})`);
    process.exit(2);
  }
  return { hub, selected: ids };
}
""", r"""function parseArgs(argv) {
  const known = CHECKS.map((c) => c[0]);
  const usage = `usage: verify_doc_claims [--root <hub dir>] [--checks ${known.join(',')}]`;
  const rootIdx = argv.indexOf('--root');
  const hub = rootIdx !== -1 && argv[rootIdx + 1] ? path.resolve(argv[rootIdx + 1]) : DEFAULT_HUB;
  // A missing hub would otherwise surface as a raw readdir stack trace from the walk.
  if (!fs.existsSync(hub) || !fs.statSync(hub).isDirectory()) {
    console.error(`${usage} (--root is not a directory: ${hub})`);
    process.exit(2);
  }
  const checksIdx = argv.indexOf('--checks');
  if (checksIdx === -1) return { hub, selected: known };
  const ids = (argv[checksIdx + 1] || '').split(',').filter(Boolean);
  const unknown = ids.filter((id) => !known.includes(id));
  if (ids.length === 0 || unknown.length) {
    console.error(`${usage} (unknown: ${unknown.join(',') || 'none given'})`);
    process.exit(2);
  }
  return { hub, selected: ids };
}
""", f"grep -c -- '--root is not a directory' {CHECKER}", "1")

LIST_MARKDOWN = r"""function listMarkdown(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  return fs.readdirSync(dir).filter((n) => n.endsWith('.md')).sort();
}
"""

edit("T021", CHECKER, LIST_MARKDOWN, LIST_MARKDOWN + r"""
// A path-shaped label passes when it names a real file from the doc's packet, the hub or the doc's
// folder, or when it is the tail of the in-hub target it labels, which is how a short label names a
// file in another packet. A label over an outside or external target describes what this guard
// cannot see, so it is left alone.
function labelIsStale(hub, doc, label, target) {
  const dir = path.dirname(doc.full);
  if (/^\.\.?\//.test(label)) {
    const resolved = path.resolve(dir, label);
    return insideHub(hub, resolved) && !fs.existsSync(resolved);
  }
  if (label.startsWith('.skilled/') && !label.startsWith(HUB_PREFIX)) return false;
  if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) return false;
  const resolvedTarget = path.resolve(dir, target);
  if (!insideHub(hub, resolvedTarget)) return false;
  if (toPosix(resolvedTarget).endsWith(`/${label}`) && fs.existsSync(resolvedTarget)) return false;
  const candidates = [...bases(hub, doc, label), path.join(packetRoot(hub, doc.rel), label), path.resolve(dir, label)];
  return !candidates.some((p) => fs.existsSync(p));
}
""", f"grep -c '^function labelIsStale(hub, doc, label, target) {{' {CHECKER}", "1")

edit("T022", CHECKER, LIST_MARKDOWN, LIST_MARKDOWN + r"""
// GitHub's heading slug, the rule behind the double-dash TOC anchors validate_document.py requires:
// lowercase, keep letters, numbers, underscores, spaces and hyphens, then one hyphen per space.
function headingSlug(text) {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim().toLowerCase()
    .replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
}

const anchorCache = new Map();

// Every anchor a Markdown file defines: one slug per heading outside fenced code, with GitHub's
// -1, -2 suffixes for repeats, plus each explicit <a id> or <a name>.
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const ids = new Set();
  const seen = new Map();
  let inFence = false;
  for (const text of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (/^\s*(?:```|~~~)/.test(text)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const heading = /^#{1,6}\s+(.*?)(?:\s+#+)?\s*$/.exec(text);
    if (heading) {
      const slug = headingSlug(heading[1]);
      const n = seen.get(slug) || 0;
      seen.set(slug, n + 1);
      ids.add(n === 0 ? slug : `${slug}-${n}`);
    }
    for (const m of text.matchAll(/<a\s[^>]*?\b(?:id|name)\s*=\s*["']([^"']+)["']/gi)) ids.add(m[1]);
  }
  anchorCache.set(file, ids);
  return ids;
}

function anchorMissing(file, anchor) {
  let wanted = anchor;
  try {
    wanted = decodeURIComponent(anchor);
  } catch {
    // A malformed escape is compared as written.
  }
  const ids = anchorsOf(file);
  return !ids.has(wanted) && !ids.has(wanted.toLowerCase());
}
""", f"grep -c -E '^function (headingSlug|anchorsOf|anchorMissing)\\(' {CHECKER}", "3")

edit("T023", CHECKER,
     "        const target = m[2].split('#')[0].split('?')[0];\n",
     "        const target = m[2].split('#')[0].split('?')[0];\n"
     "        const anchor = m[2].includes('#') ? m[2].slice(m[2].indexOf('#') + 1) : '';\n",
     f"grep -c \"const anchor = m\\[2\\].includes('#')\" {CHECKER}", "1")

edit("T024", CHECKER, r"""          problems.push(`${where}: link target does not resolve: ${target}`);
        }
""", r"""          problems.push(`${where}: link target does not resolve: ${target}`);
        }
        if (anchor && !PLACEHOLDER.test(anchor) && !/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) {
          const file = target ? path.resolve(dir, target) : doc.full;
          if (file.endsWith('.md') && insideHub(hub, file) && fs.existsSync(file) && anchorMissing(file, anchor)) {
            problems.push(`${where}: link anchor does not resolve: ${target}#${anchor}`);
          }
        }
""", f"grep -c 'link anchor does not resolve' {CHECKER}", "1")

edit("T025", CHECKER, r"""        if (/^\.\.?\//.test(label) && isPathCandidate(label) && label !== target
          && insideHub(hub, path.resolve(dir, label)) && !fs.existsSync(path.resolve(dir, label))) {
""", r"""        if (isPathCandidate(label) && label !== target && labelIsStale(hub, doc, label, target)) {
""", f"grep -c 'labelIsStale(hub, doc, label, target)) {{' {CHECKER}", "1")

edit("T026", CHECKER, r"""        const ref = m[1].trim().replace(/:\d+(?:-\d+)?$/, '');
        if (!isPathCandidate(ref)) continue;
        const candidates = bases(hub, doc, ref);
        if (candidates.length && !candidates.some((p) => fs.existsSync(p))) problems.push(`${where}: path does not resolve: ${ref}`);
""", r"""        const [file, anchor = ''] = m[1].trim().split('#');
        const ref = file.replace(/:\d+(?:-\d+)?$/, '');
        if (!isPathCandidate(ref)) continue;
        const candidates = bases(hub, doc, ref);
        const found = candidates.find((p) => fs.existsSync(p));
        if (candidates.length && !found) problems.push(`${where}: path does not resolve: ${ref}`);
        else if (found && anchor && ref.endsWith('.md') && !PLACEHOLDER.test(anchor) && anchorMissing(found, anchor)) {
          problems.push(`${where}: anchor does not resolve: ${ref}#${anchor}`);
        }
""", f"grep -c 'anchor does not resolve: ${{ref}}#${{anchor}}' {CHECKER}", "1")

edit("T027", CHECKER,
     "    if (isAllowed('tiers', 'ROUTER.md', claim.text)) continue;\n",
     "    if (isAllowed('tiers', 'ROUTER.md', claim.text)) continue;\n"
     "    if (!claim.always && CONDITIONAL_WORDING.test(claim.text)) continue;\n",
     f"grep -c 'CONDITIONAL_WORDING.test(claim.text)' {CHECKER}", "1")

# ---- guardrails semicolons -----------------------------------------------------------------------
edit("T028", GUARD,
     "any env knobs the verifier must pin; final evidence belongs to",
     "any env knobs the verifier must pin. Final evidence belongs to",
     f"grep -c 'the verifier must pin. Final evidence belongs to' {GUARD}", "1")

edit("T029", GUARD,
     "workspaces use `tsc --build`; satellite packages with their own package boundary",
     "workspaces use `tsc --build`. Satellite packages with their own package boundary",
     f"grep -c 'use `tsc --build`. Satellite packages' {GUARD}", "1")

edit("T030", GUARD,
     "- Keep env-sensitive tests deterministic: set feature flags, provider choices, database paths, and timeout knobs explicitly in the command or test fixture; record those values with the result; do not rely on inherited shell state when the claim depends on a flag.",
     "- Keep env-sensitive tests deterministic. Set feature flags, provider choices, database paths, and timeout knobs explicitly in the command or test fixture. Record those values with the result. Do not rely on inherited shell state when the claim depends on a flag.",
     f"grep -c ';' {GUARD}", "0")

# ---- docs, version and changelog -----------------------------------------------------------------
edit("T031", AREADME,
     "| `verify_doc_claims.cjs` | Documentation claim guard: path references in the sk-code docs resolve,",
     "| `verify_doc_claims.cjs` | Documentation claim guard: path references in the sk-code docs resolve, including path-shaped link labels and `#anchor` targets,",
     f"grep -c 'including path-shaped link labels and `#anchor` targets' {AREADME}", "1")

edit("T032", SKILL, "version: 1.2.0.0\n", "version: 1.2.1.0\n",
     f"grep -c '^version: 1.2.1.0$' {SKILL}", "1")

create("T033", CHANGELOG, f"{FOLDER}/scratch/units/v1.2.1.0.md",
       f"python3 -I .skilled/skills/sk-doc/scripts/validate_document.py {CHANGELOG}",
       "Total issues: 0")


def to_dispatch(u):
    if u["kind"] == "edit":
        return {
            "task": u["task"], "files": [u["file"]], "kind": "edit",
            "instruction": f"In {u['file']}, replace the exact text <<<OLD\n{u['old'].rstrip(chr(10))}\nOLD>>> with <<<NEW\n{u['new'].rstrip(chr(10))}\nNEW>>> and change nothing else.",
            "check": u["check"], "expect": u["expect"],
        }
    if u["kind"] == "create":
        return {
            "task": u["task"], "files": [u["file"]], "kind": "create",
            "instruction": f"Create {u['file']} with exactly the content of {u['source']}",
            "check": u["check"], "expect": u["expect"],
        }
    return {"task": u["task"], "files": u["files"], "kind": "command", "instruction": u["cmd"], "check": u["check"], "expect": u["expect"]}


def apply(mirror):
    # mirror holds sk-code/ as a copy of .skilled/skills/sk-code
    prefix = ".skilled/skills/"
    for u in UNITS:
        if u["kind"] == "command":
            continue
        target = os.path.join(mirror, u["file"][len(prefix):])
        if u["kind"] == "create":
            with open(u["source"], encoding="utf8") as f:
                content = f.read()
            with open(target, "w", encoding="utf8") as f:
                f.write(content)
            print(f"{u['task']}: created")
            continue
        with open(target, encoding="utf8") as f:
            text = f.read()
        old = u["old"].rstrip("\n")
        new = u["new"].rstrip("\n")
        count = text.count(old)
        if count != 1:
            print(f"{u['task']}: OLD occurs {count} times in {u['file']}")
            sys.exit(1)
        with open(target, "w", encoding="utf8") as f:
            f.write(text.replace(old, new))
        print(f"{u['task']}: applied")


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--apply":
        apply(sys.argv[2])
    else:
        with open(f"{FOLDER}/scratch/dispatch-units.json", "w", encoding="utf8") as f:
            json.dump([to_dispatch(u) for u in UNITS], f, indent=1, ensure_ascii=False)
            f.write("\n")
        print(f"wrote {len(UNITS)} units")
