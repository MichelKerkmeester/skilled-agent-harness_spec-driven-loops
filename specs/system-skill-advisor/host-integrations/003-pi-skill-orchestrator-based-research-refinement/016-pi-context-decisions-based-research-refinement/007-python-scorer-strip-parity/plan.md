---
title: "Implementation Plan: Python Scorer Strip Parity"
description: "Port phase 006's final strip rule into the entry of the Python scorer's analyze_request, with JavaScript's whitespace set and ASCII-only case folding, prove it on the shared case fixture plus six parity rows, then recapture the divergence ledger and move the parity pins the port raises."
trigger_phrases:
  - "python scorer strip parity plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Python Scorer Strip Parity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for the scorer and its test, TypeScript for the parity suites, one JSON fixture |
| **Framework** | The Python local scorer `runtime/scripts/skill_advisor.py` and its standalone harness `runtime/tests/python/test_skill_advisor.py` |
| **Storage** | None |
| **Testing** | The Python harness, which counts `ok` and `fail_test` calls and exits 1 on any failure (`runtime/tests/python/test_skill_advisor.py:46-55`, `:2530-2545`), and Vitest for the parity suites |

### Overview
`analyze_request` calls a new `strip_leading_pasted_reply` first, so the CLI's local fallback, the validate handler, the capture script and every Python corpus runner score the same text the native scorer does. The Python test reads the fixture phase 006 created, plus six rows this phase appends for the known regex differences. The ledger is recaptured by its own script, and the two parity suites move their Python-reference counts by the one row the port fixes.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot. `SCRATCH` is this phase's `scratch/` folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -n 'Marker rule' ../006-strip-rule-boundary-edges/implementation-summary.md` names first-marker or last-marker
- [ ] `sed -n 4787,4797p runtime/scripts/skill_advisor.py` shows `def analyze_request`, the empty check and `prompt_lower = prompt.lower()`
- [ ] The Python harness and `npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts` both pass before any edit

### Definition of Done
- [ ] The Python harness exits 0 with a PASS line for every fixture id
- [ ] `npx vitest run tests/parity` from `runtime/` exits 0
- [ ] The ledger holds no `rr-paste-208`, and its diff came from the capture script
- [ ] `implementation-summary.md` records the moved pins with before and after values
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-fixture parity port.

### Key Components
- **The entry point.** The CLI's fallback runs `runLocalScorer` (`runtime/skill-advisor-cli.ts:1456-1476`, called at `:1577`). It sets the force-local variable (`:1461`) and calls `runAdvisorSubprocess` (`runtime/lib/subprocess.ts:321`), which spawns `python3 skill_advisor.py --threshold <c> --uncertainty <u> --stdin` (`:352-357`) and writes the raw prompt to stdin (`:244`). Python's `main` reads it (`runtime/scripts/skill_advisor.py:5485`, `:5296-5298`), gets `FORCE_LOCAL` from the native probe (`:5505`, `:762-768`) and calls `analyze_prompt` (`:5536-5542`), which calls `analyze_request` (`:5257`). The strip goes first in `analyze_request`, after its empty check (`:4793-4794`) and before `prompt.lower()` (`:4796`). That mirrors `scoreAdvisorPrompt` (`runtime/lib/scorer/fusion.ts:1277`) and also covers `analyze_batch` (`:5283`), the validate handler (`runtime/handlers/advisor-validate.ts:414`), the ledger capture (`runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:161`) and the harness's direct `analyze_request` calls (`runtime/tests/python/test_skill_advisor.py:60`).

- **The port, placed just above `def analyze_request`.** The cue is phase 006's D2 cue. The marker line is the one 006 recorded: the first-marker variant takes `markers[0]`, the last-marker variant takes `markers[-1]`. Everything else is identical.

```python
# JavaScript's \s and String.prototype.trim() set. Python's own \s also matches
# U+001C to U+001F and U+0085 and misses U+FEFF, so the set is spelled out here
# to keep this strip equal to the native scorer's for every input.
_JS_SPACE_CHARS = (
    "\t\n\v\f\r              "
    "    　﻿"
)
_JS_SPACE = "[" + _JS_SPACE_CHARS + "]"
# re.ASCII keeps case folding to ASCII letters, as a JavaScript /i regex without
# the u flag does. Unicode folding would read "ſ" as "s".
_STRIP_FLAGS = re.IGNORECASE | re.ASCII
_PASTED_REPLY_CUE = re.compile(
    rf"^{_JS_SPACE}*(?:(?:earlier|previously|above),?{_JS_SPACE}+)?"
    rf"(?:(?:you|the assistant|claude){_JS_SPACE}+(?:replied|said|wrote|answered|responded)"
    rf"|(?:the{_JS_SPACE}+)?(?:assistant|claude){_JS_SPACE}+(?:response|reply|answer)){_JS_SPACE}*:",
    _STRIP_FLAGS,
)
_TASK_MARKER = re.compile(rf"(?:^|[.!?\n]{_JS_SPACE}*)(?:now|task){_JS_SPACE}*:{_JS_SPACE}*", _STRIP_FLAGS)


def _strip_pasted_reply_once(prompt: str) -> str:
    if not _PASTED_REPLY_CUE.search(prompt):
        return prompt
    markers = list(_TASK_MARKER.finditer(prompt))
    if not markers:
        return prompt
    marker = markers[-1]  # markers[0] when the native rule cuts at the first marker
    task = prompt[marker.end():].strip(_JS_SPACE_CHARS)
    return task if task else prompt


def strip_leading_pasted_reply(prompt: str) -> str:
    """Drop an earlier reply pasted ahead of the task, as the native scorer does.

    The skill names in a pasted reply would otherwise steer routing away from the
    task. Repeats until nothing changes, so a second call returns the same text.
    """
    current = prompt
    while True:
        stripped = _strip_pasted_reply_once(current)
        if stripped == current:
            return current
        current = stripped
```

  The trailing comment on the `marker` line is for the plan only. The leaf pastes the one line 006 chose, with no comment. `SCRATCH/proposed-port.py` holds this code with both variants and matches JavaScript on all six parity rows. The call in `analyze_request` is one line, `prompt = strip_leading_pasted_reply(prompt)`, after `return []` at `:4794`.

- **The regex differences and the fixture rows that catch them.** Each row is appended to `runtime/tests/fixtures/pasted-reply-strip-cases.json`, written with `\u` escapes. The expected text is the JavaScript output in `spec.md` Measured Behavior.

| Difference | Python default | JavaScript | Port | Row |
|------------|----------------|------------|------|-----|
| `\s` on U+001C to U+001F | matches | no match | explicit set | `js-space-info-separator`, expects its input |
| `\s` on U+0085 | matches | no match | explicit set | `js-space-nel`, expects its input |
| `\s` on U+FEFF | no match | matches | explicit set | `js-space-bom`, expects `fix the failing parser test` |
| `\s` on U+00A0 | matches | matches | explicit set | `js-space-nbsp`, expects `fix the failing parser test`, which fails a port that uses `\s` under `re.ASCII` |
| `re.IGNORECASE` folds `ſ` to `s` | matches | no match without `u` | `re.ASCII` | `ascii-case-fold`, expects its input |
| `str.strip()` removes U+001C | removes | `trim()` keeps it | `strip(_JS_SPACE_CHARS)` | `js-trim-trailing-separator`, expects `fix the failing parser test\u001c` |
| Curly quote `“` | depends on the literal | depends on the literal | the cue has no quote characters after phase 006 | `quote-led-curly` from phase 006 |

  The fixture is read with `encoding="utf-8"` in Python and `'utf8'` in Node, so a raw non-ASCII byte cannot decode two ways. JavaScript string indexes count UTF-16 units and Python's count code points. Each language slices at its own match offset, so the difference never crosses over.

- **The Python test.** `test_pasted_reply_strip_parity` follows the shared-fixture block at `runtime/tests/python/test_skill_advisor.py:2164-2176`. It loads the scorer with `load_module` (`:35-43`) and reads `../fixtures/pasted-reply-strip-cases.json` beside the test file. For each row it calls `ok("STRIP-<id>")` when `strip_leading_pasted_reply(input)` equals `expected` and a second call returns the same text, and `fail_test` otherwise, catching exceptions so a missing function fails every row. One more check confirms the entry: `analyze_request` on the probe row's input returns the same skill list as on its expected text. `main` calls the test after `test_declared_phrase_specificity()` (`:2542`).

- **The ledger.** `capture-local-native-divergence-ledger.mjs` scores Python and the built TypeScript in a fresh-graph regime and writes the ledger (`:15-18`, `:272-275`). Its dry run must print `"added":[]`, `"resolved":["rr-paste-208"]` and `"changed":[]` before `--write`. The ratchet requires `scoringInstant` to be no earlier than the newest approval (`runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:373-376`), and the script sets it to the capture day.

- **The pins.** Both parity suites count Python-correct rows. Once Python strips, `rr-paste-208` is Python-correct, and the native scorer already gets it right, so each suite's two counts rise by one. INFERRED until the suites run after the port: `runtime/tests/parity/python-ts-parity.vitest.ts:269` 113 to 114 and `:274` 108 to 109, `runtime/tests/legacy/advisor-corpus-parity.vitest.ts:178` 117 to 118 and `:179` 112 to 113. Each file's history comment gets one line in its existing style, for example `113 -> 114 and 108 -> 109: the Python reference now drops a pasted earlier reply before scoring, as the native scorer does, so the pasted-reply row reaches its gold on both.`

### Data Flow
Raw prompt into `analyze_request`, stripped once, then scored exactly as before. Validation sends raw rows to `analyze_prompt` (`runtime/handlers/advisor-validate.ts:414`) and to `scoreAdvisorPrompt` (`:460`). Both now strip internally, so refutation finding 6 resolves with no change to the handler.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads phase 006's marker rule, re-reads `analyze_request` and records the Python harness and parity baselines. Implementation appends the six parity rows, adds the Python test and runs it red, then ports the rule into `runtime/scripts/skill_advisor.py`. Verification rebuilds, runs the parity suites red on the moved pins, recaptures the ledger through its script, moves the pins and reruns every suite. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The TypeScript policy test runs on the six new rows before any Python change, because the native rule is the reference. The Python harness then fails on every `STRIP-` row, since the function does not exist, and passes on all of them after the port. The parity suites fail after the port only on the ratchet's resolved entry and the four pins, and pass after the capture and the pin moves. `npx vitest run tests/handlers/advisor-validate.vitest.ts` guards the validate handler.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 006 complete, with its marker rule recorded and the advisor built. No new package or test framework.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the Python harness or a parity suite fails on a row the strip should not touch. Revert the phase commit. That removes the Python function and its call, the test, the six fixture rows and the pin moves, and restores the ledger entry. Rerun `npx vitest run tests/parity` to confirm the ledger and the pins agree again.
<!-- /ANCHOR:rollback -->

---
