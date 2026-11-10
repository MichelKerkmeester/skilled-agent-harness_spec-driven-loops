#!/usr/bin/env python3
"""Defines the Phase 2 dispatch units, writes dispatch-units.json, and can apply
them to a copy of the tree or check that every OLD text occurs exactly once."""
import json, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
FOLDER = 'specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines'
H = '.skilled/skills/system-spec-kit/runtime/hooks'
RT = '.skilled/skills/system-spec-kit/runtime'

OLD_READER = (
    "async function readStdin() {\n"
    "  const chunks = [];\n"
    "  for await (const chunk of process.stdin) chunks.push(chunk);\n"
    "  return Buffer.concat(chunks).toString('utf8');\n"
    "}\n"
)
CJS_READER = (
    "// The shared reader settles at a deadline, so a host that never closes stdin\n"
    "// cannot hold this hook open. It is an ES module, so it loads on first use.\n"
    "async function readStdin() {\n"
    "  const shared = await import('../lib/hook-adapter-shared.mjs');\n"
    "  return shared.readStdin();\n"
    "}\n"
)
MJS_IMPORT = "import { readStdin } from '../lib/hook-adapter-shared.mjs';\n"
TS_IMPORT = "import { readHookStdin } from '../shared-stdin.js';\n"
ESM_ENTRY = "import { isMainModule } from '../../lib/esm-entry.js';\n"

units = []
def edit(task, f, old, new, check, expect):
    units.append(dict(task=task, files=[f], kind='edit', old=old, new=new, check=check, expect=expect))
def create(task, f, src, check, expect):
    units.append(dict(task=task, files=[f], kind='create', src=src, check=check, expect=expect))
def command(task, files, cmd, check, expect):
    units.append(dict(task=task, files=files, kind='command', cmd=cmd, check=check, expect=expect))

TEST = f'{H}/lib/hook-stdin-deadline.test.mjs'
create('T011', TEST, f'{FOLDER}/scratch/units/hook-stdin-deadline.test.mjs',
       f"cmp {FOLDER}/scratch/units/hook-stdin-deadline.test.mjs {TEST} && echo same", 'same')
command('T012', [f'{FOLDER}/scratch/baseline/new-test-before-fix.txt'], f"mkdir -p {FOLDER}/scratch/baseline && node --test {TEST} > {FOLDER}/scratch/baseline/new-test-before-fix.txt 2>&1; grep -E '^ℹ (tests|pass|fail) ' {FOLDER}/scratch/baseline/new-test-before-fix.txt",
        f"grep -c '^ℹ fail 30$' {FOLDER}/scratch/baseline/new-test-before-fix.txt", '1')
create('T013', f'{H}/shared-stdin.ts', f'{FOLDER}/scratch/units/shared-stdin.ts',
       f"cmp {FOLDER}/scratch/units/shared-stdin.ts {H}/shared-stdin.ts && echo same", 'same')

LIB_OLD = (
    "// Keeps stdin collection and fail-open JSON parsing byte-identical across\n"
    "// every ESM runtime hook adapter that previously repeated this boilerplate\n"
    "// inline (Claude/Codex/Devin/Cursor spec-gate-enforce.mjs).\n"
    "\n"
    "export async function readStdin() {\n"
    "  const chunks = [];\n"
    "  for await (const chunk of process.stdin) chunks.push(chunk);\n"
    "  return Buffer.concat(chunks).toString('utf8');\n"
    "}\n"
)
LIB_NEW = (
    "// Keeps stdin collection and fail-open JSON parsing byte-identical across\n"
    "// every plain .mjs and .cjs hook adapter in this skill. ESM adapters import\n"
    "// readStdin by name and CommonJS adapters load it with a dynamic import. The\n"
    "// compiled TypeScript adapters read through ../shared-stdin.ts instead, which\n"
    "// keeps the same deadline, because this file is not part of the TypeScript\n"
    "// build and so is absent from dist. Nothing here imports from .skilled/hooks:\n"
    "// this skill's hooks stay self-contained, and the reader in\n"
    "// .skilled/hooks/shared/hook-adapter-shared.cjs is an independent sibling.\n"
    "\n"
    "// A host that never closes stdin would otherwise hold the hook until the host's\n"
    "// own timeout kills it, so the read settles on whichever comes first: the end of\n"
    "// the stream, or the deadline with whatever has arrived by then.\n"
    "export function readStdin({ timeoutMs = 3000 } = {}) {\n"
    "  return new Promise((resolve, reject) => {\n"
    "    const chunks = [];\n"
    "    let settled = false;\n"
    "    let timer = null;\n"
    "\n"
    "    const onData = (chunk) => chunks.push(chunk);\n"
    "    const onEnd = () => {\n"
    "      if (settled) return;\n"
    "      settled = true;\n"
    "      release();\n"
    "      resolve(Buffer.concat(chunks).toString('utf8'));\n"
    "    };\n"
    "    const onError = (error) => {\n"
    "      if (settled) return;\n"
    "      settled = true;\n"
    "      release();\n"
    "      reject(error);\n"
    "    };\n"
    "    const release = () => {\n"
    "      clearTimeout(timer);\n"
    "      process.stdin.removeListener('data', onData);\n"
    "      process.stdin.removeListener('end', onEnd);\n"
    "      process.stdin.removeListener('error', onError);\n"
    "      process.stdin.pause();\n"
    "    };\n"
    "\n"
    "    timer = setTimeout(onEnd, timeoutMs);\n"
    "    process.stdin.on('data', onData);\n"
    "    process.stdin.on('end', onEnd);\n"
    "    process.stdin.on('error', onError);\n"
    "  });\n"
    "}\n"
)
edit('T014', f'{H}/lib/hook-adapter-shared.mjs', LIB_OLD, LIB_NEW,
     f"grep -c 'export function readStdin({{ timeoutMs = 3000 }} = {{}})' {H}/lib/hook-adapter-shared.mjs", '1')

t = 15
for rt in ['claude', 'codex', 'devin']:
    f = f'{H}/{rt}/completion-evidence-stop.cjs'
    edit(f'T0{t}', f, OLD_READER, CJS_READER,
         f"grep -c \"await import('../lib/hook-adapter-shared.mjs')\" {f}", '1'); t += 1
f = f'{H}/devin/post-compaction.cjs'
edit(f'T0{t}', f, OLD_READER, CJS_READER, f"grep -c \"await import('../lib/hook-adapter-shared.mjs')\" {f}", '1'); t += 1

MJS = [
    ('cursor/post-tool-use.mjs', "import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';\n"),
    ('cursor/spec-gate-prebind.mjs', "import { validateSpecFolderBinding } from '../../../shared/dist/gate-3-classifier.js';\n"),
    ('cursor/completion-evidence-response.mjs', "import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';\n"),
    ('devin/permission-request-policy.mjs', "import { evaluate, readHardRules } from '../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs';\n"),
]
for rel, anchor in MJS:
    f = f'{H}/{rel}'
    edit(f'T0{t}', f, OLD_READER + "\n", "", f"grep -c 'for await (const chunk of process.stdin)' {f}", '0'); t += 1
    edit(f'T0{t}', f, anchor, anchor + MJS_IMPORT, f"grep -c \"^import {{ readStdin }} from '../lib/hook-adapter-shared.mjs';$\" {f}", '1'); t += 1

# claude/shared.ts
f = f'{H}/claude/shared.ts'
anchor = "// drift in any one runtime silently forks the recovered-payload contract.\n"
edit(f'T0{t}', f, anchor, anchor + "\n" + TS_IMPORT, f"grep -c \"^import {{ readHookStdin }} from '../shared-stdin.js';$\" {f}", '1'); t += 1
CLAUDE_OLD = (
    "    const chunks: Buffer[] = [];\n"
    "    let totalBytes = 0;\n"
    "    for await (const chunk of process.stdin) {\n"
    "      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);\n"
    "      totalBytes += buffer.length;\n"
    "      if (totalBytes > MAX_HOOK_STDIN_BYTES) {\n"
    "        process.stdin.destroy();\n"
    "        hookLog('warn', 'stdin', `Hook stdin exceeded ${MAX_HOOK_STDIN_BYTES} bytes`);\n"
    "        return null;\n"
    "      }\n"
    "      chunks.push(buffer);\n"
    "    }\n"
    "    const raw = Buffer.concat(chunks, totalBytes).toString('utf-8').trim();\n"
)
CLAUDE_NEW = (
    "    const text = await readHookStdin({ maxBytes: MAX_HOOK_STDIN_BYTES });\n"
    "    if (text === null) {\n"
    "      hookLog('warn', 'stdin', `Hook stdin exceeded ${MAX_HOOK_STDIN_BYTES} bytes`);\n"
    "      return null;\n"
    "    }\n"
    "    const raw = text.trim();\n"
)
edit(f'T0{t}', f, CLAUDE_OLD, CLAUDE_NEW, f"grep -c 'await readHookStdin({{ maxBytes: MAX_HOOK_STDIN_BYTES }})' {f}", '1'); t += 1

RT_OLD = (
    "    const chunks: Buffer[] = [];\n"
    "    let totalBytes = 0;\n"
    "\n"
    "    for await (const chunk of process.stdin) {\n"
    "      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);\n"
    "      totalBytes += buffer.length;\n"
    "      if (totalBytes > MAX_STDIN_BYTES) {\n"
    "        process.stdin.destroy();\n"
    "        return null;\n"
    "      }\n"
    "      chunks.push(buffer);\n"
    "    }\n"
    "\n"
    "    const raw = Buffer.concat(chunks, totalBytes).toString('utf8').trim();\n"
)
RT_NEW = (
    "    const text = await readHookStdin({ maxBytes: MAX_STDIN_BYTES });\n"
    "    if (text === null) return null;\n"
    "\n"
    "    const raw = text.trim();\n"
)
for rt in ['codex', 'cursor', 'devin']:
    f = f'{H}/{rt}/shared.ts'
    edit(f'T0{t}', f, ESM_ENTRY, ESM_ENTRY + TS_IMPORT, f"grep -c \"^import {{ readHookStdin }} from '../shared-stdin.js';$\" {f}", '1'); t += 1
    edit(f'T0{t}', f, RT_OLD, RT_NEW, f"grep -c 'await readHookStdin({{ maxBytes: MAX_STDIN_BYTES }})' {f}", '1'); t += 1

f = f'{H}/claude/directive-lifecycle-boundary.ts'
edit(f'T0{t}', f, ESM_ENTRY, ESM_ENTRY + TS_IMPORT, f"grep -c \"^import {{ readHookStdin }} from '../shared-stdin.js';$\" {f}", '1'); t += 1
edit(f'T0{t}', f,
     "    const chunks: Buffer[] = [];\n"
     "    for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));\n"
     "    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as HostDirectiveLifecycleBoundary;\n",
     "    const parsed = JSON.parse((await readHookStdin()) ?? '') as HostDirectiveLifecycleBoundary;\n",
     f"grep -c \"JSON.parse((await readHookStdin()) ?? '')\" {f}", '1'); t += 1

f = f'{H}/claude/compact-inject.ts'
edit(f'T0{t}', f,
     "import { closeSync, fstatSync, openSync, readFileSync, readSync } from 'node:fs';\n",
     "import { closeSync, fstatSync, openSync, readSync } from 'node:fs';\n",
     f"grep -c \"^import {{ closeSync, fstatSync, openSync, readSync }} from 'node:fs';$\" {f}", '1'); t += 1
edit(f'T0{t}', f, ESM_ENTRY, ESM_ENTRY + TS_IMPORT, f"grep -c \"^import {{ readHookStdin }} from '../shared-stdin.js';$\" {f}", '1'); t += 1
edit(f'T0{t}', f,
     "function runAuthoredSnapshotWorker(): void {\n"
     "  const input = JSON.parse(readFileSync(0, 'utf-8')) as {\n",
     "async function runAuthoredSnapshotWorker(): Promise<void> {\n"
     "  const input = JSON.parse((await readHookStdin()) ?? '') as {\n",
     f"grep -c '^async function runAuthoredSnapshotWorker(): Promise<void> {{$' {f}", '1'); t += 1

command(f'T0{t}', [f'{RT}/dist/hooks'], f"cd {RT} && npm run build",
        f"node {RT}/cli/lib/dist-freshness.cjs check-all && ls {RT}/dist/hooks/shared-stdin.js",
        'All watched dist outputs are fresh.'); t += 1
BUILD_TASK = t - 1

# README edits
f = f'{H}/lib/README.md'
edit(f'T0{t}', f,
     "- `hook-adapter-shared.mjs` is a small stdin-and-JSON helper pair used directly by the classify and enforce adapters that do not need the full spec-gate core themselves.\n",
     "- `hook-adapter-shared.mjs` is a small stdin-and-JSON helper pair. Its `readStdin()` settles when stdin ends or after 3000 ms, whichever comes first, so a host that never closes stdin cannot hold a hook open. Every plain `.mjs` and `.cjs` adapter in this skill reads stdin through it. The compiled TypeScript adapters use `../shared-stdin.ts`, which keeps the same deadline.\n",
     f"grep -c 'settles when stdin ends or after 3000 ms' {f}", '1'); t += 1
edit(f'T0{t}', f,
     "├── hook-adapter-shared.mjs   # readStdin() + parseJsonFailOpen() for classify/enforce adapters\n",
     "├── hook-adapter-shared.mjs   # Deadline readStdin() + parseJsonFailOpen() for the plain .mjs and .cjs adapters\n"
     "├── hook-stdin-deadline.test.mjs  # Proves every hook entry gives up at the stdin deadline\n",
     f"grep -c 'hook-stdin-deadline.test.mjs  # Proves every hook entry' {f}", '1'); t += 1
edit(f'T0{t}', f,
     "| `hook-adapter-shared.mjs` | `readStdin()` collects and decodes a hook's stdin payload; `parseJsonFailOpen(raw)` parses it and returns `null` on any failure instead of throwing. Imported by `claude/spec-gate-classify.mjs`, `codex/spec-gate-classify.mjs`, and the `spec-gate-enforce.mjs` of `claude/`, `codex/`, `cursor/` and `devin/`. |\n",
     "| `hook-adapter-shared.mjs` | `readStdin({ timeoutMs = 3000 })` collects a hook's stdin payload until the stream ends or the deadline passes, returns what arrived and releases stdin so the process can exit. `parseJsonFailOpen(raw)` parses it and returns `null` on any failure instead of throwing. Imported by the `spec-gate-classify.mjs` and `spec-gate-enforce.mjs` of `claude/`, `codex/`, `cursor/` and `devin/`, by `cursor/post-tool-use.mjs`, `cursor/spec-gate-prebind.mjs`, `cursor/completion-evidence-response.mjs` and `devin/permission-request-policy.mjs`, and loaded with a dynamic import by the three `completion-evidence-stop.cjs` adapters and `devin/post-compaction.cjs`. |\n"
     "| `hook-stdin-deadline.test.mjs` | Spawns every hook entry with stdin held open and asserts each exits on its own at the deadline with its fail-open result, then pins the payload path of entries no other suite spawns. The compiled entries run from `dist/`, so build first. |\n",
     f"grep -c '^| `hook-stdin-deadline.test.mjs` |' {f}", '1'); t += 1
edit(f'T0{t}', f,
     "node --test tests/hooks/spec-gate-core.test.mjs\n```\n",
     "node --test tests/hooks/spec-gate-core.test.mjs\nnode --test hooks/lib/hook-stdin-deadline.test.mjs\n```\n",
     f"grep -c '^node --test hooks/lib/hook-stdin-deadline.test.mjs$' {f}", '1'); t += 1

f = f'{H}/README.md'
edit(f'T0{t}', f,
     "├── shared-provenance.ts     # Provenance-wrapped transport helpers\n",
     "├── shared-provenance.ts     # Provenance-wrapped transport helpers\n"
     "├── shared-stdin.ts          # Deadline stdin reader for the compiled adapters\n",
     f"grep -c 'shared-stdin.ts          # Deadline stdin reader' {f}", '1'); t += 1
edit(f'T0{t}', f,
     "| `lib/hook-adapter-shared.mjs` | Shared helper for the four `spec-gate-enforce` adapters. |\n",
     "| `lib/hook-adapter-shared.mjs` | Deadline stdin reader and fail-open JSON parser for every plain `.mjs` and `.cjs` adapter. See [`lib/README.md`](./lib/README.md). |\n",
     f"grep -c 'Deadline stdin reader and fail-open JSON parser' {f}", '1'); t += 1
edit(f'T0{t}', f,
     "The completion-evidence policy each runtime's Stop-equivalent adapter calls lives in `lib/completion-evidence-sentinel.cjs`.\n",
     "| `shared-stdin.ts` | `readHookStdin()` reads a compiled adapter's stdin until the stream ends or 3000 ms pass, and returns `null` when the payload passes the caller's byte cap. Consumed by the four `shared.ts` readers, `claude/compact-inject.ts` and `claude/directive-lifecycle-boundary.ts`. |\n"
     "\n"
     "The completion-evidence policy each runtime's Stop-equivalent adapter calls lives in `lib/completion-evidence-sentinel.cjs`.\n",
     f"grep -c '^| `shared-stdin.ts` |' {f}", '1'); t += 1
edit(f'T0{t}', f,
     "node --test tests/hooks/spec-gate-codex.test.mjs\n```\n",
     "node --test tests/hooks/spec-gate-codex.test.mjs\nnode --test hooks/lib/hook-stdin-deadline.test.mjs\n```\n",
     f"grep -c '^node --test hooks/lib/hook-stdin-deadline.test.mjs$' {f}", '1'); t += 1

# version and changelog
f = '.skilled/skills/system-spec-kit/SKILL.md'
edit(f'T0{t}', f, "version: 2.7.0.0\n", "version: 2.7.1.0\n", f"grep -c '^version: 2.7.1.0$' {f}", '1'); t += 1
create(f'T0{t}', '.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md', f'{FOLDER}/scratch/units/v2.7.1.0.md',
       f"cmp {FOLDER}/scratch/units/v2.7.1.0.md .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md && echo same", 'same'); t += 1

def instruction(u):
    f = u['files'][0] if u['files'] else ''
    if u['kind'] == 'edit':
        return f"In {f}, replace the exact text <<<OLD\n{u['old']}OLD>>> with <<<NEW\n{u['new']}NEW>>>"
    if u['kind'] == 'create':
        return f"Create {f} with exactly the content of {u['src']}"
    return u['cmd']

def out_units():
    return [dict(task=u['task'], files=u['files'], kind=u['kind'], instruction=instruction(u), check=u['check'], expect=u['expect']) for u in units]

def apply(root):
    root = pathlib.Path(root)
    repo = HERE.parents[5]
    for u in units:
        if u['kind'] == 'edit':
            p = root / u['files'][0]
            s = p.read_text()
            n = s.count(u['old'])
            assert n == 1, (u['task'], n)
            p.write_text(s.replace(u['old'], u['new']))
        elif u['kind'] == 'create':
            p = root / u['files'][0]
            p.write_text((repo / u['src']).read_text())

def check_old(root):
    """Each OLD must occur exactly once in the original file and at its point in the sequence."""
    root = pathlib.Path(root)
    state, bad = {}, 0
    for u in units:
        if u['kind'] != 'edit':
            continue
        f = u['files'][0]
        orig = (root / f).read_text()
        cur = state.get(f, orig)
        a, b = orig.count(u['old']), cur.count(u['old'])
        ok = a == 1 and b == 1
        bad += 0 if ok else 1
        print(f"{u['task']} {f} original={a} sequential={b} {'OK' if ok else 'BAD'}")
        state[f] = cur.replace(u['old'], u['new'])
    edits = sum(1 for u in units if u['kind'] == 'edit')
    print(f'edit units={edits} bad={bad}')
    return bad

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'write':
        (HERE / 'dispatch-units.json').write_text(json.dumps(out_units(), indent=2, ensure_ascii=False) + '\n')
        print('units', len(units))
    elif cmd == 'apply':
        apply(sys.argv[2])
    elif cmd == 'check':
        sys.exit(1 if check_old(sys.argv[2]) else 0)

def verify(before_root):
    """Rebuild each unit file from the saved pre-edit copy plus only the planned
    edits, and compare it with the live file byte for byte."""
    before_root = pathlib.Path(before_root)
    repo = HERE.parents[5]
    expected = {}
    for u in units:
        if u['kind'] == 'edit':
            f = u['files'][0]
            cur = expected.get(f)
            if cur is None:
                cur = (before_root / f).read_text()
            expected[f] = cur.replace(u['old'], u['new'], 1)
        elif u['kind'] == 'create':
            expected[u['files'][0]] = (repo / u['src']).read_text()
    mismatches = 0
    for f, text in sorted(expected.items()):
        live = repo / f
        ok = live.exists() and live.read_text() == text
        mismatches += 0 if ok else 1
        print(f"{'OK ' if ok else 'BAD'} {f}")
    print(f'files={len(expected)} mismatches={mismatches}')
    return mismatches

if __name__ == '__main__' and sys.argv[1] == 'verify':
    sys.exit(1 if verify(sys.argv[2]) else 0)

NOTES = {
    'T011': 'Create the deadline test. Do not retype it: copy the planner\'s file byte for byte.',
    'T012': 'Run the new test before any reader edit, to see it fail for the right reason (about 16 seconds). The full output lands in `scratch/baseline/new-test-before-fix.txt`. Expected lines: `ℹ tests 37`, `ℹ pass 7`, `ℹ fail 30`. The seven passes are the four payload tests and the three Claude hooks that already stop at their 1800 ms budget. If more pass, a kill-switch or a changed hook is in play: stop and report.',
    'T013': 'Create the compiled reader. Copy the planner\'s file byte for byte.',
    'T014': 'Give the shared ESM reader its deadline: replace the header tail and the old `readStdin` (lines 4-12).',
    'T040': 'Rebuild `dist/` with the skill\'s own build command (about a minute). Expected: exit 0, then the check prints `All watched dist outputs are fresh.` and the path `.skilled/skills/system-spec-kit/runtime/dist/hooks/shared-stdin.js`. `dist/` is git-ignored, so the build adds nothing to `git status`.',
    'T049': 'Bump the system-spec-kit version for the patch release (line 5).',
    'T050': 'Create the changelog entry. Copy the planner\'s file byte for byte.',
}

def describe(u):
    f = u['files'][0] if u['files'] else ''
    if u['task'] in NOTES and u['kind'] != 'edit':
        return NOTES[u['task']]
    if u['kind'] == 'edit':
        if u['new'] == '':
            what = 'Delete the private reader: remove the FIND block (five lines plus the empty line after them); the replacement is nothing.'
        elif u['new'].startswith(u['old']):
            what = 'Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines.'
        else:
            what = 'Replace the FIND block with the REPLACE block.'
        return NOTES.get(u['task'], what)
    return ''

def fence(label, text):
    return f"{label} (exact text, every line ends with a line break):\n\n````text\n{text}````\n"

def tasks_md():
    out = []
    for u in units:
        f = u['files'][0] if u['files'] else ''
        desc = describe(u)
        if u['kind'] == 'edit':
            extra = '' if desc.startswith('Delete') or desc.startswith('Add') or desc.startswith('Replace') else ' Replace the FIND block with the REPLACE block.'
            out.append(f"- [ ] {u['task']} {desc}{extra} The FIND text occurs exactly once in the file. Proof: `{u['check']}` prints `{u['expect']}`. (`{f}`)\n")
            out.append(fence(f"{u['task']} FIND", u['old']))
            if u['new']:
                out.append(fence(f"{u['task']} REPLACE", u['new']))
        elif u['kind'] == 'create':
            out.append(f"- [ ] {u['task']} {desc} Run `cp {u['src']} {f}`. Proof: `{u['check']}` prints `{u['expect']}`. (`{f}`)\n")
        else:
            out.append(f"- [ ] {u['task']} {desc} Run `{u['cmd']}`. Proof: `{u['check']}` prints `{u['expect']}`. (`{u['files'][0] if u['files'] else ''}`)\n")
    return '\n'.join(out)

if __name__ == '__main__' and sys.argv[1] == 'tasks':
    print(tasks_md())
