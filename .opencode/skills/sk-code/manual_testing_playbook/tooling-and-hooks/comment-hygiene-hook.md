---
title: "TH-002: check-comment-hygiene.sh wiring into claude-posttooluse.sh"
description: "Verify that an Edit introducing a forbidden ephemeral-artifact comment makes the shared PostToolUse hook print a COMMENT HYGIENE WARNING banner to stdout while always exiting 0, and that the direct check-comment-hygiene.sh checker returns rc=1 on the offending file and rc=0 once the comment is rewritten as a durable WHY."
version: 3.5.0.16
---

# TH-002: check-comment-hygiene.sh wiring into claude-posttooluse.sh

## 1. OVERVIEW

This scenario verifies the comment-hygiene half of `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh`, the shared Claude Code PostToolUse hook that fires on every `Write`/`Edit`. This is the hook's original check; the dist-staleness branch validated by TH-001 was added later and runs alongside it on the same edit. On each edit the hook calls `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh` against the edited file. If a comment line carries an ephemeral-artifact pointer — a spec path, packet/phase number, or ADR/REQ/task/finding id (the forbidden classes in `references/universal/code_style_guide.md` §4) — the checker prints each offending line to stdout as `<file>:<lineno>: <excerpt>` and exits 1. When the hook sees that `returncode == 1` with non-empty stdout, it wraps those lines in a `COMMENT HYGIENE WARNING:` banner. The hook is warn-only: it always exits 0 and never blocks the edit, regardless of what the checker finds or whether the checker itself fails.

**No gap found while authoring this scenario (contrast with TH-001)**: unlike its dist-staleness sibling — which shipped with a missing executable bit that silently suppressed the banner in a live session — `check-comment-hygiene.sh` ships with its executable bit intact (`-rwxr-xr-x`), which is exactly what `claude-posttooluse.sh`'s `subprocess.run([checker_path, file_path], ...)` invocation requires to exec the checker directly. The full hook path therefore fires the `COMMENT HYGIENE WARNING` banner to stdout as intended, verified end-to-end below in both directions: the positive case (forbidden comment present → banner reaches stdout → hook exits 0) and the negative case (comment rewritten as a durable WHY → checker clean → no banner → hook still exits 0). This scenario brings the pre-existing comment-hygiene branch under manual coverage for the first time; see §3 Failure Triage if the executable bit ever regresses (e.g. after a checkout that strips permissions), since that would reproduce the class of gap TH-001 documented for its sibling checker.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to confirm that editing a source file so it introduces a comment carrying an ephemeral-artifact pointer actually surfaces a warning in the session — the same warn-only way the dist-staleness warning does — and that rewriting the comment as a durable WHY clears it, all without the edit ever being blocked.

**Exact prompt**:
```
In a /tmp sandbox, add a source file whose comment carries an ephemeral-artifact pointer (an ADR id), and confirm claude-posttooluse.sh prints a COMMENT HYGIENE WARNING banner and still exits 0, that check-comment-hygiene.sh returns rc=1 on that file, then fix the comment in place and confirm rc=0.
```

**Expected detection**: not applicable — this is a deterministic hook-wiring check, not a routing decision (no advisor probe, no surface/reference loading).

**Expected behavior (intended contract)**:
- The hook receives the standard Claude Code PostToolUse stdin JSON (`tool_name`, `tool_input.file_path`, `cwd`) for the edited sandbox file.
- `check-comment-hygiene.sh` reads the file, extracts each comment line, skips any line carrying a `hygiene-ok` escape or an allowed-class token (`CWE-`, `RFC`, `POSIX`, `HTTP <ddd>`, `WEBFLOW:`, `MOTION:`, `LENIS:`, `V<d>:`), and flags any remaining comment matching a `VIOLATION_PATTERN`. It finds the `ADR-<n>` pointer, prints `<file>:<lineno>: <excerpt>` to stdout, and exits 1.
- The hook sees `returncode == 1` with non-empty stdout and prints the `COMMENT HYGIENE WARNING` banner (blank-line wrapped, listing each violation line indented, plus the `code_style_guide.md §4` pointer and the `hygiene-ok` escape hint) to stdout, then exits 0.
- After the comment is rewritten as a durable WHY (no ephemeral id), the same checker exits 0 with empty stdout, so the hook prints no banner and still exits 0.

**Desired user-visible outcome**: An edit that plants an ephemeral-artifact pointer in a comment is flagged in-session with the durable-WHY guidance, without the edit ever being blocked; rewriting the comment clears the warning on the next run.

## 3. TEST EXECUTION

### Preconditions

1. The hook resolves: `bash: test -f .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh`.
2. The comment-hygiene checker resolves: `bash: test -f .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`.
3. **Check the executable bit before running** (`bash: ls -la .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`) — it should read `-rwxr-xr-x`. If it reads `-rw-r--r--`, the run will reproduce the class of gap TH-001 documented (banner suppressed, `Permission denied` on stderr) instead of the intended banner; run `chmod +x` on it first if the goal is to verify the intended contract rather than reproduce that gap.
4. A writable `/tmp` sandbox path is available; the scenario writes only under `/tmp/skc-TH002-sandbox/` and never touches a project file (the forbidden comment lives in a throwaway file, not in real source).

### Exact Command Sequence

1. **Introduce the forbidden ephemeral-artifact comment** in a sandbox source file (an `ADR-<n>` id is one of the forbidden classes; a spec path, packet/phase number, or REQ/task/finding id would trigger the same branch):
   ```bash
   SANDBOX=/tmp/skc-TH002-sandbox
   SRC="$SANDBOX/sample.ts"
   rm -rf "$SANDBOX"; mkdir -p "$SANDBOX"
   cat > "$SRC" <<'EOF'
   export function retry(fn: () => Promise<void>) {
     // retry cap per ADR-014
     return fn();
   }
   EOF
   ```
2. **Invoke the checker directly** to confirm the underlying rc=1 contract independent of the hook's subprocess call:
   ```bash
   python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh "$SRC"; echo "direct_prefix_exit=$?"
   ```
3. **Invoke the full hook** the way Claude Code actually calls it, via stdin JSON (set `cwd` to the repo root so the hook resolves the checker):
   ```bash
   PAYLOAD=$(python3 -c "import json; print(json.dumps({'tool_name':'Edit','tool_input':{'file_path':'$SRC'},'cwd':'$(pwd)'}))")
   echo "$PAYLOAD" | python3 .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh; echo "hook_exit=$?"
   ```
4. **Fix the comment in place** — rewrite it as a durable WHY with no ephemeral id:
   ```bash
   cat > "$SRC" <<'EOF'
   export function retry(fn: () => Promise<void>) {
     // retry cap prevents unbounded backoff on a wedged upstream
     return fn();
   }
   EOF
   ```
5. **Re-run the checker directly** to confirm the fix clears the violation:
   ```bash
   python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh "$SRC"; echo "direct_postfix_exit=$?"
   ```
6. **Clean up** (all mutations were confined to `/tmp`):
   ```bash
   rm -rf "$SANDBOX"
   ```

### Expected Signals

| Step | Signal (intended contract) | Observed (verified 2026-07-07) |
|---|---|---|
| 2 (direct checker, pre-fix) | stdout: `<file>:2:   // retry cap per ADR-014`; `direct_prefix_exit=1` | `/tmp/skc-TH002-sandbox/sample.ts:2:   // retry cap per ADR-014`; `direct_prefix_exit=1` — matches |
| 3 (full hook, pre-fix) | hook stdout contains the `COMMENT HYGIENE WARNING` banner (blank-line wrapped), the indented violation line, and the `code_style_guide.md §4` + `hygiene-ok` escape lines; stderr empty; `hook_exit=0` | banner present with `  /tmp/skc-TH002-sandbox/sample.ts:2:   // retry cap per ADR-014`; stderr empty; `hook_exit=0` — matches |
| 5 (direct checker, post-fix) | stdout empty; `direct_postfix_exit=0` | empty; `direct_postfix_exit=0` — matches |

The banner captured verbatim at step 3:

```
COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.
These references are unstable and will rot. Replace each with the durable WHY.
Violations in /tmp/skc-TH002-sandbox/sample.ts:
  /tmp/skc-TH002-sandbox/sample.ts:2:   // retry cap per ADR-014
See: .opencode/skills/sk-code/shared/references/universal/code_style_guide.md §4
Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.
```

### Pass/Fail Criteria

- **PASS** iff: the hook prints the COMMENT HYGIENE WARNING banner to stdout for the file with the forbidden comment AND exits 0, AND `check-comment-hygiene.sh` returns rc=1 on that file pre-fix and rc=0 after the comment is rewritten as a durable WHY.
- **PARTIAL** iff: the hook exits 0 (warn-only contract holds) but the banner does not reach stdout due to a checker-invocation failure (e.g. a stripped executable bit, the class of gap TH-001 documented) — the failure is caught safely but coverage is not achieved.
- **FAIL** iff: the hook exits non-zero (blocks the edit) for any reason, or the checker fires the banner when the comment carries no forbidden pointer (false positive), or the direct checker rc does not flip from 1 (pre-fix) to 0 (post-fix).

### Failure Triage

1. **Banner missing, stderr shows `Permission denied` on `check-comment-hygiene.sh`**: the checker's executable bit was stripped — the same class of gap TH-001 documented for its sibling. Fix: `chmod +x .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh` (it ships `-rwxr-xr-x`), then re-run step 3.
2. **Banner missing, no stderr, checker returned rc=2 (skip) or rc=0 (clean)**: the comment did not register as a violation. Confirm the comment sits on a comment line, matches a `VIOLATION_PATTERN`, carries no `hygiene-ok` escape, and is not pre-empted by an `ALLOWED_PATTERN` (`CWE-`, `RFC`, `POSIX`, `HTTP <ddd>`, `WEBFLOW:`, `MOTION:`, `LENIS:`, `V<d>:`); and that the file has a checked extension (`.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`, `.py`, `.sh`, `.bash`, `.jsonc`) and does not sit under `/dist/`, `/node_modules/`, or `/.git/` (those exit rc=2, silently skipped). Verify with `python3 .../check-comment-hygiene.sh "$SRC"; echo rc=$?`.
3. **Banner missing yet the direct checker returns rc=1**: inspect the hook's `if result.returncode == 1 and result.stdout.strip():` guard in `claude-posttooluse.sh` — both conditions must hold for the banner to print.
4. **Hook exits non-zero**: this breaks the warn-only contract and is a regression — inspect the outer `try`/`except` around the comment-checker `subprocess.run` call; it must never propagate a checker failure (or a violation rc) as a hook failure. The hook's final `sys.exit(0)` is unconditional by design.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` — Dispatches both the comment-hygiene and dist-staleness checkers on every `Write`/`Edit`; prints the `COMMENT HYGIENE WARNING` banner only when the comment checker returns rc=1 with non-empty stdout; always exits 0.
- `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh` — Comment-hygiene checker (Python, `.sh` extension); ships executable (`-rwxr-xr-x`). Exit 0 clean, 1 violations (printed as `<file>:<lineno>: <excerpt>`), 2 skipped (excluded dir, unknown extension, or unreadable).
- `.opencode/skills/sk-code/shared/references/universal/code_style_guide.md` §4 — The forbidden ephemeral-artifact-pointer classes and the durable-WHY convention the checker enforces.

**Related**: `claude-posttooluse.sh` also runs the dist-staleness checker (`check-dist-staleness.sh`) on the same edit; that branch is validated by TH-001 (see `tooling-and-hooks/check-dist-staleness-hook.md`). The `ceiling:` intentional-simplification convention that must pass this same comment-hygiene checker without allow-listing is validated by DR-003 (see `design-restraint/ceiling-comment-convention.md`), which asserts the checker exits 0 on a well-formed ceiling comment; TH-002 is the complementary case, asserting rc=1 (and the banner) on a genuine violation.

## 5. DEEP-REVIEW CONSUMPTION NOTE

The comment-hygiene hook is an **author-side** gate: it runs at edit time inside `code-quality` (the `sk-code` quality workflow mode) and its warn-only banner nudges the author to replace an ephemeral-artifact pointer with a durable WHY before the code ever reaches a reviewer. That authoring-time signal is the first half of a two-party contract; `deep-review` is the second half. This note documents the hand-off boundary so the two are not conflated.

**What `code-quality` hands forward.** When a `code-quality` pass completes it emits an advisory evidence envelope — the modified files, the checker outputs (including any `COMMENT HYGIENE WARNING` this scenario exercises and the underlying `check-comment-hygiene.sh` rc), the P0/P1/P2 decisions the author took on each finding, any deferrals, and the remaining risk the author is knowingly shipping. This envelope is advisory: the hook itself never blocks (it always exits 0), so an unresolved comment-hygiene warning can legitimately survive into the diff a reviewer later sees.

**Where `deep-review` consumes it.** `deep-review` audits four dimensions — correctness, security, **traceability**, and maintainability (`.opencode/skills/system-deep-loop/deep-review/README.md:80`). The comment-hygiene envelope feeds the **traceability** dimension: a comment that still points at a spec path, packet/phase number, or ADR/REQ/task/finding id is exactly the kind of unstable, rot-prone reference the traceability pass is meant to catch, and the author-side envelope tells the reviewer which such references were already flagged, fixed, or deferred. `deep-review` then classifies each surviving finding by blocking severity — P0/P1/P2 (`.opencode/skills/system-deep-loop/deep-review/README.md:84`) — and those severity gates roll up into the release-readiness verdict, PASS / CONDITIONAL / FAIL (`.opencode/skills/system-deep-loop/deep-review/README.md:27`). A comment-hygiene deferral the author labelled low-risk typically lands as a P2 advisory that rides a PASS; one that obscures a real traceability defect can be escalated by the reviewer through its own adversarial re-read.

**The boundary (what this note is NOT).** This consumption path does **not** make `code-quality` a deep-loop mode, and it does **not** make the comment-hygiene hook a review owner. `code-quality` stays the author-side gate that produces evidence; `deep-review` stays the independent reviewer that consumes it, re-derives severity through its own Hunter/Skeptic/Referee self-check, and owns the verdict. The hook's warn-only, always-exit-0 contract — the whole point of this TH-002 scenario — is precisely what keeps it advisory rather than gating: the blocking decision belongs to the reviewer, not to the author-side hook. Nothing here adds a dependency from `code-quality` onto the deep-loop runtime; the envelope is read by `deep-review`, not produced for it.

## 6. SOURCE METADATA

- **Created**: 2026-07-07
- **Critical path**: No
- **Destructive**: No (every write is confined to a throwaway `/tmp/skc-TH002-sandbox/` scratch file that is created and removed within the scenario; no project file is edited, so there is nothing to restore)
- **Sandbox**: the forbidden comment is planted in a disposable `/tmp` `.ts` file and deleted on cleanup; no production file is touched and no production behavior changes
- **Concurrent-safe**: Yes (operates only on a unique `/tmp/skc-TH002-sandbox/` path and shares no state with other scenarios — unlike TH-001, which mutates a shared source file's mtime and must run serially)
- **Last validated**: 2026-07-07 — **PASS**. The direct checker returned `direct_prefix_exit=1` with the violation line `/tmp/skc-TH002-sandbox/sample.ts:2:   // retry cap per ADR-014`; the full hook printed the `COMMENT HYGIENE WARNING` banner to stdout with stderr empty and `hook_exit=0`; after rewriting the comment as a durable WHY the direct checker returned `direct_postfix_exit=0` and the hook printed no banner and still exited 0. No authoring gap found — the checker's executable bit (`-rwxr-xr-x`) was intact, so the banner reached stdout through the full hook path with no intervention. Evidence: `/tmp/th002-hook-stdout.txt`, `/tmp/th002-direct-prefix.txt`, `/tmp/th002-direct-postfix.txt`.
