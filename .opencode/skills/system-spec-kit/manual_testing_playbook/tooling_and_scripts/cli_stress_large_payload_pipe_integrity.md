---
title: "436 -- 028 CLI Stress: Large-Payload (>64KB) Pipe Integrity"
description: "Stress scenario proving a >64KB CLI payload survives the stdout pipe byte-identically across repetitions and parses as valid JSON, with socket-frame integrity covered by the dual-client suites."
version: 3.6.0.1
---

# 436 -- 028 CLI Stress: Large-Payload (>64KB) Pipe Integrity

## 1. OVERVIEW

This stress scenario verifies that payloads larger than the classic 64KB pipe-buffer threshold cross the CLI boundary intact. The spec-memory `list-tools --format json` envelope is already over 64KB (the 41 tools carry their full schemas), is fully deterministic, and needs no daemon — making it a host-safe large-payload fixture. The scenario asserts the payload parses as valid JSON, exceeds 65,536 bytes, and is byte-identical (same SHA-256) across ten repetitions, in both `json` and single-line `jsonl` renderings.

Pipe truncation classically shows up as nondeterministic tail loss under load, which the hash-stability loop would catch immediately. IPC socket-frame integrity for daemon-backed large responses is locked by the dual-client hardening suites, which round-trip real frames over `daemon-ipc.sock`.

## 2. SCENARIO CONTRACT

- Objective: Confirm a >64KB CLI payload is byte-stable and JSON-valid across repetitions.
- Real user request: `When a CLI call returns a big payload into a pipe, do I ever get a truncated or interleaved result?`
- Prompt: `Verify the spec-memory list-tools JSON payload exceeds 64KB and stays byte-identical and parseable across 10 piped repetitions in json and jsonl formats.`
- Expected execution process: Measure payload size, loop ten reps hashing stdout, parse each rep as JSON, compare hashes.
- Expected signals: Size > 65536 bytes; one unique hash per format across all reps; every rep parses.
- Desired user-visible outcome: Large CLI payloads can be piped into downstream tooling without integrity concerns.
- Pass/fail: PASS only when size, hash stability, and parseability all hold.

## 3. TEST EXECUTION

### Prompt

```text
Verify the spec-memory list-tools JSON payload exceeds 64KB and stays byte-identical and parseable across 10 piped repetitions in json and jsonl formats.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0

SIZE=$(node .opencode/bin/spec-memory.cjs list-tools --format json | wc -c | tr -d ' ')
echo "payload bytes: $SIZE (must be > 65536)"

for fmt in json jsonl; do
  HASHES=$(for i in $(seq 1 10); do
    node .opencode/bin/spec-memory.cjs list-tools --format $fmt \
      | tee /tmp/cli-436-payload.$fmt \
      | shasum -a 256 | cut -d' ' -f1
    python3 -c "import json; json.load(open('/tmp/cli-436-payload.$fmt'))" || echo "PARSE-FAIL"
  done | sort -u)
  echo "format=$fmt unique-hash-lines:"; echo "$HASHES"
done
rm -f /tmp/cli-436-payload.json /tmp/cli-436-payload.jsonl
rm -rf "$SANDBOX"

# Socket-frame integrity for daemon-backed responses (sandboxed)
(cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/spec-memory-cli-dual-client-hardening.vitest.ts)
```

### Expected

- `payload bytes` is greater than 65536 (measured 75,538 at authoring time).
- Each format yields exactly one unique hash line across the ten repetitions and zero `PARSE-FAIL` lines.
- The dual-client suite passes, covering real socket-frame round-trips.

### Evidence

Shell transcript from 2026-07-02:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
payload bytes: 0 (must be > 65536)
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py", line 293, in load
    return loads(fp.read(),
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py", line 346, in loads
    return _default_decoder.decode(s)
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py", line 337, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py", line 355, in raw_decode
    raise JSONDecodeError("Expecting value", s, err.value) from None
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
format=json unique-hash-lines:
PARSE-FAIL
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
format=jsonl unique-hash-lines:
PARSE-FAIL
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  22:43:20
   Duration  352ms (transform 189ms, setup 16ms, import 246ms, tests 11ms, environment 0ms)
```

The `@spec-kit/mcp-server dist is stale...` line appeared before the byte-count command and before each of the ten `json` and ten `jsonl` repetitions. Each repetition produced the same `JSONDecodeError: Expecting value: line 1 column 1 (char 0)` traceback shown above, because `/tmp/cli-436-payload.json` and `/tmp/cli-436-payload.jsonl` were empty.

### Pass / Fail

- **BLOCKED**: `node .opencode/bin/spec-memory.cjs list-tools --format json` returned no payload because `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build`; observed `payload bytes: 0 (must be > 65536)`, `PARSE-FAIL` for both formats, and empty-payload hash `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`, while the dual-client vitest suite passed.

### Failure Triage

Multiple hashes with parse failures on the shorter reps is classic pipe truncation — check the CLI's stdout flush path and the shim's `stdio: 'inherit'` spawn. Multiple hashes with all reps parsing means nondeterministic output ordering crept into the tool listing, which breaks the parity fixture assumption in scenario 427.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md` | Feature-catalog source for the CLI output contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/spec-memory.cjs` | Shim spawning the CLI with inherited stdio |
| `mcp_server/spec-memory-cli.ts` | Output rendering (`json` / `jsonl` / text) |
| `mcp_server/tests/spec-memory-cli-dual-client-hardening.vitest.ts` | Real socket-frame round-trip coverage |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 436
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/cli_stress_large_payload_pipe_integrity.md`
