---
title: "436 -- 028 CLI Stress: Large-Payload (>64KB) Pipe Integrity"
description: "Stress scenario proving a >64KB CLI payload survives the stdout pipe byte-identically across repetitions and parses as valid JSON, with socket-frame integrity covered by the dual-client suites."
version: 3.6.0.1
id: tooling-and-scripts-cli-stress-large-payload-pipe-integrity
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 436 -- 028 CLI Stress: Large-Payload (>64KB) Pipe Integrity

## 1. OVERVIEW

This stress scenario verifies that payloads larger than the classic 64KB pipe-buffer threshold cross the CLI boundary intact. The spec-memory `list-tools --format json` envelope is already over 64KB (the 41 tools carry their full schemas), is fully deterministic, and needs no daemon — making it a host-safe large-payload fixture. The scenario asserts the payload parses as valid JSON, exceeds 65,536 bytes, and is byte-identical (same SHA-256) across ten repetitions, in both `json` and single-line `jsonl` renderings.

Pipe truncation classically shows up as nondeterministic tail loss under load, which the hash-stability loop would catch immediately. IPC socket-frame integrity for daemon-backed large responses is locked by the dual-client hardening suites, which round-trip real frames over `daemon-ipc.sock`.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a >64KB CLI payload is byte-stable and JSON-valid across repetitions.
- Real user request: `When a CLI call returns a big payload into a pipe, do I ever get a truncated or interleaved result?`
- Prompt: `Verify the spec-memory list-tools JSON payload exceeds 64KB and stays byte-identical and parseable across 10 piped repetitions in json and jsonl formats.`
- Expected execution process: Measure payload size, loop ten reps hashing stdout, parse each rep as JSON, compare hashes.
- Expected signals: Size > 65536 bytes; one unique hash per format across all reps; every rep parses.
- Desired user-visible outcome: Large CLI payloads can be piped into downstream tooling without integrity concerns.
- Pass/fail: PASS only when size, hash stability, and parseability all hold.

---

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
(cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/spec-memory-cli-dual-client-hardening.vitest.ts)
```

### Expected

- `payload bytes` is greater than 65536 (measured 75,538 at authoring time).
- Each format yields exactly one unique hash line across the ten repetitions and zero `PARSE-FAIL` lines.
- The dual-client suite passes, covering real socket-frame round-trips.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: Size, hash stability, and parseability all hold.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Multiple hashes with parse failures on the shorter reps is classic pipe truncation — check the CLI's stdout flush path and the shim's `stdio: 'inherit'` spawn. Multiple hashes with all reps parsing means nondeterministic output ordering crept into the tool listing, which breaks the parity fixture assumption in scenario 427.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md` | Feature-catalog source for the CLI output contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/spec-memory.cjs` | Shim spawning the CLI with inherited stdio |
| `mcp-server/spec-memory-cli.ts` | Output rendering (`json` / `jsonl` / text) |
| `mcp-server/tests/spec-memory-cli-dual-client-hardening.vitest.ts` | Real socket-frame round-trip coverage |

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 436
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/cli-stress-large-payload-pipe-integrity.md`
