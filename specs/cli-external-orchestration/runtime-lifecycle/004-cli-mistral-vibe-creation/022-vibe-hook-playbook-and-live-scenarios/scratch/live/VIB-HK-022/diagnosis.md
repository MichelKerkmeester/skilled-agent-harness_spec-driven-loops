# VIB-HK-022 finding -- Vibe journals turn hooks only

## Finding

The rendered `$VIBE_HOME/hooks.toml` carries all 18 `[[hooks]]` entries of `.vibe/hooks.toml`, but the session journal's `hook_bindings` list carries only 16 `user:<name>` ids. The two entries without a `user:` id are `session-start` (`type = "session_start"`) and `session-cleanup-end` (`type = "session_end"`).

Both host hooks are in fact bound and run. The journal holds `builtin:session_start_context`, which Vibe binds only when a `session_start` hook exists, and the close check found the cleanup line `action=skip reason=no-session-pid` written at `/exit`, which is `session-cleanup-end`'s effect.

## Cause

Vibe treats `session_start` and `session_end` as host hook types, not Core turn hooks.

- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:38` defines `HOST_HOOK_TYPES = frozenset({NOTIFICATION, SESSION_START, SESSION_END})`.
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_runtime.py:2812` filters them out of the Core binding list with `if hook.type not in HOST_HOOK_TYPES`.
- `_runtime.py` `_session_hooks` (line 2848; `return SessionHooks(...)` at line 2883) builds them separately from `HookType.SESSION_START` and `HookType.SESSION_END`.
- `_runtime.py` `_with_session_start_context` (line 2834) adds `builtin:session_start_context` only when `session_hooks.session_start` is non-empty.

So the omission is Vibe's journal shape, not a renderer or binding failure in this repository. A single `hook_bindings` list cannot name all 18 entries on Vibe 3.1.2.

## Minimal repro

Run against the literal-check session's `VIBE_HOME`:

```text
python3 - <<'EOF'
import glob, re
VH = "<the run's VIBE_HOME>"
names = re.findall(r'^name = "([^"]+)"', open('.vibe/hooks.toml').read(), re.M)
blob = ''
for f in glob.glob(VH + '/logs/session/unified/**/*', recursive=True):
    try:
        blob += open(f, errors='replace').read()
    except OSError:
        pass
missing = [n for n in names if 'user:' + n not in blob]
print('hooks=%d missing=%d' % (len(names), len(missing)))
print('missing:', missing)
print('has builtin:session_start_context:', 'builtin:session_start_context' in blob)
EOF
```

Observed output:

```text
hooks=18 missing=2
missing: ['session-start', 'session-cleanup-end']
has builtin:session_start_context: True
```

The literal check's own output from that run was `hooks=18 missing=2` with exit 1.

## Proposed fix

The scenario now verifies every entry through the evidence Vibe actually produces:

1. All 16 turn hooks must have a `user:<name>` id in the journal.
2. `session-start` is proven by `builtin:session_start_context`, which exists only because that one `session_start` entry is configured.
3. `session-cleanup-end` is proven by the cleanup log line its hook writes when the runner closes the session with `/exit`.

If one journal list must name all 18, the change belongs in Vibe's session metadata (persist host hook bindings beside the Core ones), not in this repository's hook files or renderer.

## Verdict effect

The corrected scenario passes (`turn-hooks-and-session-start-bound`, then the cleanup log line). The finding is an observability gap in Vibe's journal, not a defect in the repository hooks.
