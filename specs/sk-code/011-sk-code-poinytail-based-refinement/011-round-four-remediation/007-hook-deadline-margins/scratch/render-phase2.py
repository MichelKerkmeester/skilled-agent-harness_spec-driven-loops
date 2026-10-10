#!/usr/bin/env python3
"""Renders the Phase 2 task list of tasks.md from the units in build-units.py."""
import importlib.util
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('build_units', HERE / 'build-units.py')
bu = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bu)

NOTES = {
    'T014': 'Replace the deadline test with the planner\'s copy, byte for byte. Do not retype it.',
    'T015': 'Run the new test before any source edit, to see it fail for the right reason (about 30 seconds). The full output lands in `scratch/baseline/new-test-before-fix.txt`. Expected lines: `ℹ tests 39`, `ℹ pass 32`, `ℹ fail 7`. The seven failures are the `hooks/claude/spec-gate-classify.mjs`, `hooks/codex/spec-gate-classify.mjs`, `dist/hooks/claude/user-prompt-submit.js`, `dist/hooks/codex/session-start.js` and `dist/hooks/codex/user-prompt-submit.js` subtests, their parent test and the held-open payload test. If the counts differ, stop and report.',
    'T016': 'Add the short-host deadline constant to the compiled reader, after `HOOK_STDIN_TIMEOUT_MS` (line 15).',
    'T017': 'Import the default deadline into the Claude shared helpers (line 7).',
    'T018': 'Give `parseHookStdin` an optional deadline that defaults to 3000 ms (lines 52-55).',
    'T019': 'Import the short deadline into Claude SessionStart, after the `isMainModule` import (line 26).',
    'T020': 'Pass the short deadline in Claude SessionStart (line 213). The 1800 ms `withTimeout` stays.',
    'T021': 'Import the short deadline into Claude PreCompact (line 34).',
    'T022': 'Pass the short deadline in Claude PreCompact `main` (line 498). The snapshot worker\'s `readHookStdin()` call at line 429 stays as it is.',
    'T023': 'Import the default deadline into the Codex shared helpers (line 10).',
    'T024': 'Give `readCodexHookInput` an optional deadline that defaults to 3000 ms (lines 52-58).',
    'T025': 'Import the short deadline into Codex SessionStart (line 16).',
    'T026': 'Pass the short deadline in Codex SessionStart (line 33).',
    'T027': 'Import the short deadline into Codex UserPromptSubmit, after the `./shared.js` import (line 13).',
    'T028': 'Pass the short deadline in Codex UserPromptSubmit (line 16).',
    'T029': 'Add the same constant to the plain reader, before `readStdin` (lines 13-16). `readStdin` itself does not change.',
    'T030': 'Import the short deadline into the Claude prompt classifier (line 6).',
    'T031': 'Pass the short deadline in the Claude prompt classifier (line 13).',
    'T032': 'Import the short deadline into the Codex prompt classifier (line 6).',
    'T033': 'Pass the short deadline in the Codex prompt classifier (line 13).',
    'T034': 'Shim: drop `readSync` and the four unused imports (lines 8-13).',
    'T035': 'Shim: replace the chunk-size constant, which nothing will use, with the deadline constant (line 25).',
    'T036': 'Shim: replace the blocking `readSync` loop with the deadline read (lines 81-95).',
    'T037': 'Shim: make `runShim` async (line 97).',
    'T038': 'Shim: read stdin before the spawn, inside the same `try` (lines 113-115).',
    'T039': 'Shim: await `runShim` in `main` (line 157).',
    'T040': 'Rebuild `dist/` with the skill\'s own build command (about a minute). Expected: exit 0. `dist/` is git-ignored, so the build adds nothing to `git status`.',
    'T041': 'Describe the short deadline in the hooks README key-files row for `shared-stdin.ts` (line 88).',
    'T042': 'Describe the classifiers\' short deadline in the lib README overview (line 23).',
    'T043': 'Describe the shim\'s own deadline at the end of its row in the Claude hooks README (line 21).',
    'T044': 'Bump the system-spec-kit version for the patch release (line 5).',
    'T045': 'Create the changelog entry with the planner\'s copy, byte for byte. Do not retype it.',
}


def fence(label, text):
    return f"{label} (exact text, every line ends with a line break):\n\n````text\n{text}````\n"


out = []
for u in bu.units:
    f = u['files'][0] if u['files'] else ''
    note = NOTES[u['task']]
    if u['kind'] == 'edit':
        out.append(f"- [ ] {u['task']} {note} Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `{u['check']}` prints `{u['expect']}`. (`{f}`)\n")
        out.append(fence(f"{u['task']} FIND", u['old']))
        out.append(fence(f"{u['task']} REPLACE", u['new']))
    else:
        out.append(f"- [ ] {u['task']} {note} Run `{u['cmd']}`. Proof: `{u['check']}` prints `{u['expect']}`. (`{f}`)\n")
print('\n'.join(out), end='')
