#!/usr/bin/env python3
"""Defines the Phase 2 dispatch units and works with them.

Usage from the repository root:
  python3 -I <folder>/scratch/build-units.py write          write dispatch-units.json
  python3 -I <folder>/scratch/build-units.py check <root>   every OLD occurs exactly once, in sequence
  python3 -I <folder>/scratch/build-units.py apply <root>   apply the edit and create units under <root>
  python3 -I <folder>/scratch/build-units.py verify <before-root> [<live-root>]
      rebuild each touched file from the saved pre-edit copy plus only the
      planned units, and compare it with the live file byte for byte
"""
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parents[5]
FOLDER = 'specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins'
SK = '.skilled/skills/system-spec-kit'
RT = f'{SK}/runtime'
H = f'{RT}/hooks'

units = []


def edit(task, f, old, new, check, expect):
    units.append(dict(task=task, files=[f], kind='edit', old=old, new=new, check=check, expect=expect))


def create(task, f, src, check, expect):
    units.append(dict(task=task, files=[f], kind='create', src=src, check=check, expect=expect))


def command(task, files, cmd, check, expect):
    units.append(dict(task=task, files=files, kind='command', cmd=cmd, check=check, expect=expect))


TEST = f'{H}/lib/hook-stdin-deadline.test.mjs'
SHORT_IMPORT_TS = "import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';\n"

# The deadline test first, so it can be seen failing before any source edit.
command('T014', [TEST],
        f'cp {FOLDER}/scratch/units/hook-stdin-deadline.test.mjs {TEST}',
        f'cmp {FOLDER}/scratch/units/hook-stdin-deadline.test.mjs {TEST} && echo same', 'same')
command('T015', [f'{FOLDER}/scratch/baseline/new-test-before-fix.txt'],
        f"mkdir -p {FOLDER}/scratch/baseline && node --test {TEST} > {FOLDER}/scratch/baseline/new-test-before-fix.txt 2>&1; grep -E '^ℹ (tests|pass|fail) ' {FOLDER}/scratch/baseline/new-test-before-fix.txt",
        f"grep -c '^ℹ fail 7$' {FOLDER}/scratch/baseline/new-test-before-fix.txt", '1')

# The compiled reader gains the short-host constant.
edit('T016', f'{H}/shared-stdin.ts',
     "/** Default stdin deadline, the same value lib/hook-adapter-shared.mjs uses. */\n"
     "export const HOOK_STDIN_TIMEOUT_MS = 3000;\n",
     "/** Default stdin deadline, the same value lib/hook-adapter-shared.mjs uses. */\n"
     "export const HOOK_STDIN_TIMEOUT_MS = 3000;\n"
     "\n"
     "/**\n"
     " * Stdin deadline for entries whose host kills them after 3 seconds. The read\n"
     " * has to end early enough that the work after it still finishes inside the\n"
     " * host timeout. lib/hook-adapter-shared.mjs and claude/user-prompt-submit.ts\n"
     " * carry the same value.\n"
     " */\n"
     "export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;\n",
     f"grep -c '^export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;$' {H}/shared-stdin.ts", '1')

# Claude shared reader takes an optional deadline.
edit('T017', f'{H}/claude/shared.ts',
     "import { readHookStdin } from '../shared-stdin.js';\n",
     "import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';\n",
     f"grep -c \"^import {{ HOOK_STDIN_TIMEOUT_MS, readHookStdin }} from '../shared-stdin.js';$\" {H}/claude/shared.ts", '1')
edit('T018', f'{H}/claude/shared.ts',
     "/** Read and parse JSON from stdin. Returns null on failure. */\n"
     "export async function parseHookStdin(): Promise<HookInput | null> {\n"
     "  try {\n"
     "    const text = await readHookStdin({ maxBytes: MAX_HOOK_STDIN_BYTES });\n",
     "/**\n"
     " * Read and parse JSON from stdin. Returns null on failure. Entries whose host\n"
     " * allows them only a short time pass a shorter stdin deadline.\n"
     " */\n"
     "export async function parseHookStdin(timeoutMs = HOOK_STDIN_TIMEOUT_MS): Promise<HookInput | null> {\n"
     "  try {\n"
     "    const text = await readHookStdin({ timeoutMs, maxBytes: MAX_HOOK_STDIN_BYTES });\n",
     f"grep -c 'readHookStdin({{ timeoutMs, maxBytes: MAX_HOOK_STDIN_BYTES }})' {H}/claude/shared.ts", '1')

# Claude SessionStart.
edit('T019', f'{H}/claude/session-prime.ts',
     "import { isMainModule } from '../../lib/esm-entry.js';\n",
     "import { isMainModule } from '../../lib/esm-entry.js';\n" + SHORT_IMPORT_TS,
     f"grep -c \"^import {{ SHORT_HOST_STDIN_TIMEOUT_MS }} from '../shared-stdin.js';$\" {H}/claude/session-prime.ts", '1')
edit('T020', f'{H}/claude/session-prime.ts',
     "  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);\n",
     "  // Claude kills SessionStart hooks after 3 seconds, so the read ends early\n"
     "  // enough to leave that budget to the work after it.\n"
     "  const input = await withTimeout(parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), HOOK_TIMEOUT_MS, null);\n",
     f"grep -c 'parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), HOOK_TIMEOUT_MS, null' {H}/claude/session-prime.ts", '1')

# Claude PreCompact.
edit('T021', f'{H}/claude/compact-inject.ts',
     "import { readHookStdin } from '../shared-stdin.js';\n",
     "import { readHookStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';\n",
     f"grep -c \"^import {{ readHookStdin, SHORT_HOST_STDIN_TIMEOUT_MS }} from '../shared-stdin.js';$\" {H}/claude/compact-inject.ts", '1')
edit('T022', f'{H}/claude/compact-inject.ts',
     "  const input = await withTimeout(parseHookStdin(), remainingMs(deadline), null);\n",
     "  // Claude kills PreCompact hooks after 3 seconds, so the read ends early\n"
     "  // enough to leave the merge and the snapshot most of the budget.\n"
     "  const input = await withTimeout(parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), remainingMs(deadline), null);\n",
     f"grep -c 'parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), remainingMs(deadline), null' {H}/claude/compact-inject.ts", '1')

# Codex shared reader takes an optional deadline.
edit('T023', f'{H}/codex/shared.ts',
     "import { readHookStdin } from '../shared-stdin.js';\n",
     "import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';\n",
     f"grep -c \"^import {{ HOOK_STDIN_TIMEOUT_MS, readHookStdin }} from '../shared-stdin.js';$\" {H}/codex/shared.ts", '1')
edit('T024', f'{H}/codex/shared.ts',
     "/** Parse and validate one bounded Codex hook payload from stdin. */\n"
     "export async function readCodexHookInput(\n"
     "  event: CodexHookEvent,\n"
     "  requiredFields: readonly string[],\n"
     "): Promise<CodexHookInput | null> {\n"
     "  try {\n"
     "    const text = await readHookStdin({ maxBytes: MAX_STDIN_BYTES });\n",
     "/**\n"
     " * Parse and validate one bounded Codex hook payload from stdin. Entries whose\n"
     " * host allows them only a short time pass a shorter stdin deadline.\n"
     " */\n"
     "export async function readCodexHookInput(\n"
     "  event: CodexHookEvent,\n"
     "  requiredFields: readonly string[],\n"
     "  timeoutMs = HOOK_STDIN_TIMEOUT_MS,\n"
     "): Promise<CodexHookInput | null> {\n"
     "  try {\n"
     "    const text = await readHookStdin({ timeoutMs, maxBytes: MAX_STDIN_BYTES });\n",
     f"grep -c 'readHookStdin({{ timeoutMs, maxBytes: MAX_STDIN_BYTES }})' {H}/codex/shared.ts", '1')

# Codex SessionStart.
edit('T025', f'{H}/codex/session-start.ts',
     "import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';\n",
     "import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';\n" + SHORT_IMPORT_TS,
     f"grep -c \"^import {{ SHORT_HOST_STDIN_TIMEOUT_MS }} from '../shared-stdin.js';$\" {H}/codex/session-start.ts", '1')
edit('T026', f'{H}/codex/session-start.ts',
     "  const input = await readCodexHookInput('SessionStart', ['session_id']);\n",
     "  // Codex kills SessionStart hooks after 3 seconds, so the read ends early\n"
     "  // enough to leave that budget to the session-prime call after it.\n"
     "  const input = await readCodexHookInput('SessionStart', ['session_id'], SHORT_HOST_STDIN_TIMEOUT_MS);\n",
     f"grep -c \"readCodexHookInput('SessionStart', \\['session_id'\\], SHORT_HOST_STDIN_TIMEOUT_MS)\" {H}/codex/session-start.ts", '1')

# Codex UserPromptSubmit.
edit('T027', f'{H}/codex/user-prompt-submit.ts',
     "} from './shared.js';\n",
     "} from './shared.js';\n" + SHORT_IMPORT_TS,
     f"grep -c \"^import {{ SHORT_HOST_STDIN_TIMEOUT_MS }} from '../shared-stdin.js';$\" {H}/codex/user-prompt-submit.ts", '1')
edit('T028', f'{H}/codex/user-prompt-submit.ts',
     "  const input = await readCodexHookInput('UserPromptSubmit', ['prompt']);\n",
     "  // Codex kills UserPromptSubmit hooks after 3 seconds, so the read ends early\n"
     "  // enough to leave that budget to the advisor call after it.\n"
     "  const input = await readCodexHookInput('UserPromptSubmit', ['prompt'], SHORT_HOST_STDIN_TIMEOUT_MS);\n",
     f"grep -c \"readCodexHookInput('UserPromptSubmit', \\['prompt'\\], SHORT_HOST_STDIN_TIMEOUT_MS)\" {H}/codex/user-prompt-submit.ts", '1')

# The plain reader gains the same constant for the .mjs classifiers.
edit('T029', f'{H}/lib/hook-adapter-shared.mjs',
     "// A host that never closes stdin would otherwise hold the hook until the host's\n"
     "// own timeout kills it, so the read settles on whichever comes first: the end of\n"
     "// the stream, or the deadline with whatever has arrived by then.\n"
     "export function readStdin({ timeoutMs = 3000 } = {}) {\n",
     "// Stdin deadline for adapters whose host kills them after 3 seconds. The read\n"
     "// has to end early enough that the work after it still finishes inside the\n"
     "// host timeout. ../shared-stdin.ts carries the same value for the compiled\n"
     "// adapters.\n"
     "export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;\n"
     "\n"
     "// A host that never closes stdin would otherwise hold the hook until the host's\n"
     "// own timeout kills it, so the read settles on whichever comes first: the end of\n"
     "// the stream, or the deadline with whatever has arrived by then.\n"
     "export function readStdin({ timeoutMs = 3000 } = {}) {\n",
     f"grep -c '^export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;$' {H}/lib/hook-adapter-shared.mjs", '1')

CLASSIFY_IMPORT_OLD = "import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';\n"
CLASSIFY_IMPORT_NEW = "import { parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../lib/hook-adapter-shared.mjs';\n"
CLASSIFY_CALL_OLD = "  const payload = parseJsonFailOpen(await readStdin());\n"
CLASSIFY_CALL_NEW = (
    "  // The host kills UserPromptSubmit hooks after 3 seconds, so the read ends\n"
    "  // early enough to leave that budget to the gate after it.\n"
    "  const payload = parseJsonFailOpen(await readStdin({ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS }));\n"
)
for task_import, task_call, runtime in (('T030', 'T031', 'claude'), ('T032', 'T033', 'codex')):
    f = f'{H}/{runtime}/spec-gate-classify.mjs'
    edit(task_import, f, CLASSIFY_IMPORT_OLD, CLASSIFY_IMPORT_NEW,
         f"grep -c \"^import {{ parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS }} from '../lib/hook-adapter-shared.mjs';$\" {f}", '1')
    edit(task_call, f, CLASSIFY_CALL_OLD, CLASSIFY_CALL_NEW,
         f"grep -c 'readStdin({{ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS }})' {f}", '1')

# The Claude prompt-submit shim: an inlined, bounded, deadline read.
SHIM = f'{H}/claude/user-prompt-submit.ts'
edit('T034', SHIM,
     "import { readSync, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';\n"
     "import { spawnSync } from 'node:child_process';\n"
     "import { fileURLToPath } from 'node:url';\n"
     "import { dirname, isAbsolute, join } from 'node:path';\n"
     "import { tmpdir } from 'node:os';\n"
     "import { createHash } from 'node:crypto';\n",
     "import { existsSync, statSync } from 'node:fs';\n"
     "import { spawnSync } from 'node:child_process';\n"
     "import { fileURLToPath } from 'node:url';\n"
     "import { dirname, isAbsolute, join } from 'node:path';\n",
     f"grep -c \"^import {{ existsSync, statSync }} from 'node:fs';$\" {SHIM}", '1')
edit('T035', SHIM,
     "const READ_CHUNK_BYTES = 64 * 1024;\n",
     "// The host kills this hook after 3 seconds and the advisor child needs most of\n"
     "// that, so a host that never closes stdin must not hold the read for long. The\n"
     "// value matches SHORT_HOST_STDIN_TIMEOUT_MS in ../shared-stdin.ts, which this\n"
     "// file cannot import because its tests run the source directly.\n"
     "const STDIN_DEADLINE_MS = 500;\n",
     f"grep -c '^const STDIN_DEADLINE_MS = 500;$' {SHIM}", '1')
edit('T036', SHIM,
     "function readBoundedStdin(): Buffer {\n"
     "  const chunks: Buffer[] = [];\n"
     "  let totalBytes = 0;\n"
     "  while (true) {\n"
     "    const buffer = Buffer.alloc(Math.min(READ_CHUNK_BYTES, MAX_STDIN_BYTES + 1 - totalBytes));\n"
     "    const bytesRead = readSync(0, buffer, 0, buffer.length, null);\n"
     "    if (bytesRead === 0) break;\n"
     "    totalBytes += bytesRead;\n"
     "    if (totalBytes > MAX_STDIN_BYTES) {\n"
     "      throw new Error('INPUT_OVERFLOW');\n"
     "    }\n"
     "    chunks.push(buffer.subarray(0, bytesRead));\n"
     "  }\n"
     "  return Buffer.concat(chunks, totalBytes);\n"
     "}\n",
     "// Collect stdin until it ends or the deadline passes, then release it so the\n"
     "// process can exit. More than MAX_STDIN_BYTES rejects with INPUT_OVERFLOW and\n"
     "// destroys stdin, so a runaway payload is never buffered whole.\n"
     "function readBoundedStdin(): Promise<Buffer> {\n"
     "  return new Promise((resolve, reject) => {\n"
     "    const stdin = process.stdin;\n"
     "    const chunks: Buffer[] = [];\n"
     "    let totalBytes = 0;\n"
     "    let settled = false;\n"
     "\n"
     "    const release = (): void => {\n"
     "      clearTimeout(timer);\n"
     "      stdin.removeListener('data', onData);\n"
     "      stdin.removeListener('end', onEnd);\n"
     "      stdin.removeListener('error', onError);\n"
     "      stdin.pause();\n"
     "    };\n"
     "\n"
     "    function onEnd(): void {\n"
     "      if (settled) return;\n"
     "      settled = true;\n"
     "      release();\n"
     "      resolve(Buffer.concat(chunks, totalBytes));\n"
     "    }\n"
     "\n"
     "    function onError(error: Error): void {\n"
     "      if (settled) return;\n"
     "      settled = true;\n"
     "      release();\n"
     "      reject(error);\n"
     "    }\n"
     "\n"
     "    function onData(chunk: Buffer | string): void {\n"
     "      if (settled) return;\n"
     "      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);\n"
     "      totalBytes += buffer.length;\n"
     "      if (totalBytes > MAX_STDIN_BYTES) {\n"
     "        settled = true;\n"
     "        release();\n"
     "        stdin.destroy();\n"
     "        reject(new Error('INPUT_OVERFLOW'));\n"
     "        return;\n"
     "      }\n"
     "      chunks.push(buffer);\n"
     "    }\n"
     "\n"
     "    // Listeners go on before the timer, so a stdin that cannot take listeners\n"
     "    // rejects at once and leaves no timer behind.\n"
     "    stdin.on('data', onData);\n"
     "    stdin.on('end', onEnd);\n"
     "    stdin.on('error', onError);\n"
     "    const timer = setTimeout(onEnd, STDIN_DEADLINE_MS);\n"
     "  });\n"
     "}\n",
     f"grep -c '^function readBoundedStdin(): Promise<Buffer> {{$' {SHIM}", '1')
edit('T037', SHIM,
     "function runShim(): string {\n",
     "async function runShim(): Promise<string> {\n",
     f"grep -c '^async function runShim(): Promise<string> {{$' {SHIM}", '1')
edit('T038', SHIM,
     "    const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {\n"
     "      cwd: process.cwd(),\n"
     "      input: readBoundedStdin(),\n",
     "    const input = await readBoundedStdin();\n"
     "    const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {\n"
     "      cwd: process.cwd(),\n"
     "      input,\n",
     f"grep -c '^    const input = await readBoundedStdin();$' {SHIM}", '1')
edit('T039', SHIM,
     "  const advisorJson = runShim();\n",
     "  const advisorJson = await runShim();\n",
     f"grep -c '^  const advisorJson = await runShim();$' {SHIM}", '1')

command('T040', [f'{RT}/dist/hooks'],
        f'cd {RT} && npm run build',
        f'node {RT}/cli/lib/dist-freshness.cjs check-all',
        'All watched dist outputs are fresh.')

# Docs.
edit('T041', f'{H}/README.md',
     "| `shared-stdin.ts` | `readHookStdin()` reads a compiled adapter's stdin until the stream ends or 3000 ms pass, and returns `null` when the payload passes the caller's byte cap. Consumed by the four `shared.ts` readers, `claude/compact-inject.ts` and `claude/directive-lifecycle-boundary.ts`. |\n",
     "| `shared-stdin.ts` | `readHookStdin()` reads a compiled adapter's stdin until the stream ends or the deadline passes, and returns `null` when the payload passes the caller's byte cap. The deadline is 3000 ms by default and `SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, for the entries whose host kills them after 3 seconds. Consumed by the four `shared.ts` readers, `claude/compact-inject.ts` and `claude/directive-lifecycle-boundary.ts`. |\n",
     f"grep -c 'SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, for the entries whose host kills them after 3 seconds' {H}/README.md", '1')
edit('T042', f'{H}/lib/README.md',
     "The compiled TypeScript adapters use `../shared-stdin.ts`, which keeps the same deadline.\n",
     "The compiled TypeScript adapters use `../shared-stdin.ts`, which keeps the same deadline. The Claude and Codex `spec-gate-classify.mjs` adapters, whose host kills them after 3 seconds, pass `SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, instead.\n",
     f"grep -c 'pass `SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, instead.' {H}/lib/README.md", '1')
edit('T043', f'{H}/claude/README.md',
     "so the hook can print its fallback first. |\n",
     "so the hook can print its fallback first. The shim reads stdin with its own 500 ms deadline, because its tests run the source directly and cannot import the shared reader. |\n",
     f"grep -c 'The shim reads stdin with its own 500 ms deadline' {H}/claude/README.md", '1')

# Version and changelog.
edit('T044', f'{SK}/SKILL.md',
     "version: 2.7.1.0\n",
     "version: 2.7.2.0\n",
     f"grep -c '^version: 2.7.2.0$' {SK}/SKILL.md", '1')
command('T045', [f'{SK}/changelog/v2.7.2.0.md'],
        f'cp {FOLDER}/scratch/units/v2.7.2.0.md {SK}/changelog/v2.7.2.0.md',
        f'cmp {FOLDER}/scratch/units/v2.7.2.0.md {SK}/changelog/v2.7.2.0.md && echo same', 'same')


def instruction(u):
    f = u['files'][0] if u['files'] else ''
    if u['kind'] == 'edit':
        return f"In {f}, replace the exact text <<<OLD\n{u['old']}OLD>>> with <<<NEW\n{u['new']}NEW>>>"
    if u['kind'] == 'create':
        return f"Create {f} with exactly the content of {u['src']}"
    return u['cmd']


def out_units():
    return [dict(task=u['task'], files=u['files'], kind=u['kind'], instruction=instruction(u),
                 check=u['check'], expect=u['expect']) for u in units]


def apply(root):
    root = pathlib.Path(root)
    for u in units:
        if u['kind'] == 'edit':
            p = root / u['files'][0]
            s = p.read_text()
            n = s.count(u['old'])
            assert n == 1, (u['task'], n)
            p.write_text(s.replace(u['old'], u['new']))
        elif u['kind'] == 'command' and u['cmd'].startswith('cp '):
            _, src, dst = u['cmd'].split(' ')
            (root / dst).write_text((REPO / src).read_text())


def check_old(root):
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


def verify(before_root, live_root=REPO):
    before_root = pathlib.Path(before_root)
    live_root = pathlib.Path(live_root)
    expected = {}
    for u in units:
        if u['kind'] == 'edit':
            f = u['files'][0]
            cur = expected.get(f)
            if cur is None:
                cur = (before_root / f).read_text()
            expected[f] = cur.replace(u['old'], u['new'], 1)
        elif u['kind'] == 'command' and u['cmd'].startswith('cp '):
            _, src, dst = u['cmd'].split(' ')
            expected[dst] = (REPO / src).read_text()
    mismatches = 0
    for f, text in sorted(expected.items()):
        live = live_root / f
        ok = live.exists() and live.read_text() == text
        mismatches += 0 if ok else 1
        print(f"{'OK ' if ok else 'BAD'} {f}")
    print(f'files={len(expected)} mismatches={mismatches}')
    return mismatches


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'write':
        (HERE / 'dispatch-units.json').write_text(json.dumps(out_units(), indent=2, ensure_ascii=False) + '\n')
        print('units', len(units))
    elif cmd == 'apply':
        apply(sys.argv[2])
    elif cmd == 'check':
        sys.exit(1 if check_old(sys.argv[2]) else 0)
    elif cmd == 'verify':
        sys.exit(1 if verify(*sys.argv[2:4]) else 0)
