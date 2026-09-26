// The Python runtime's end of life, and a fork in the middle of it. `close`
// runs from atexit, and a daemon thread can still be executing measured code
// after it: that is the setup that turned into a FileExistsError traceback in
// someone's test output (#35). A forked child inherits the parent's slots,
// which are shared pages, not copies.
import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const runtimeDirectory = resolve(import.meta.dirname, "../../runtime/python");

function supportedPython() {
  const candidates = process.env.SUPERCOV_PYTHON
    ? [process.env.SUPERCOV_PYTHON]
    : ["python3.14", "python3.13", "python3.12", "python3.11", "python3.10", "python3.9", "python3", "python"];
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ["-c", "import sys; print(sys.version_info >= (3, 9))"], {
      encoding: "utf8",
    });
    if (probe.status === 0 && probe.stdout.trim() === "True") {
      return candidate;
    }
  }
  return null;
}

const python = supportedPython();
const skip = python ? false : "no CPython 3.9+ on PATH (or SUPERCOV_PYTHON)";

// One planned file with one statement, so a slot has a byte to write.
const SETUP = `
import json, os, sys, tempfile
sys.path.insert(0, sys.argv[1])
import supercov_runtime as rt
import supercov_probes

directory = tempfile.mkdtemp()
plan = os.path.join(directory, "plan.json")
statement = {"id": "s1", "start": [1, 0], "end": [1, 5], "lines": [1, 1], "exact": False}
file_plan = {key: [] for key in ("functions", "decisions", "loops", "logical", "matches", "tries")}
file_plan["statements"] = [statement]
with open(plan, "w") as stream:
    json.dump({"version": rt.PLAN_VERSION, "root": directory, "files": {"m.py": file_plan}}, stream)
evidence = os.path.join(directory, "evidence")
runtime = rt.Runtime(plan, evidence, "run", "main")
runtime.install()
HIT = supercov_probes.SLOT_HEADER
`;

// Drives the runtime exactly as an interpreter does -- install, record,
// close from atexit -- and then records once more, as a daemon thread still
// running measured code would. It reports what happened rather than
// asserting, so the test can say which property broke.
const CLOSE = `${SETUP}
runtime._record({"t": "probe"})
array = runtime.hits_var.get()
# Taken while the transport is open: close forgets the path along with the
# process that owned it, which is the very thing that made the reopen collide.
output_path = runtime.output_path
slot_path = array.path
runtime.close()

late = "accepted"
try:
    runtime._record({"t": "late"})
    array[HIT] = 1
except Exception as error:
    late = type(error).__name__

monitoring = getattr(sys, "monitoring", None)
detector = None
if monitoring is not None:
    detector = {
        "globalEvents": monitoring.get_events(runtime.tool_id) if runtime.tool_id is not None else 0,
        "stillRegistered": runtime.tool_id is not None
        and monitoring.register_callback(runtime.tool_id, monitoring.events.PY_START, None) is not None,
    }
with open(output_path, "rb") as stream:
    written = stream.read()
leftover = None
shared = None
if os.path.exists(slot_path):
    if slot_path.endswith(rt.SHARED_SLOT_SUFFIX):
        # macOS: the file names a shared memory object. Close removes the
        # object, so the reader finds nothing under the name to count.
        import _posixshmem
        with open(slot_path) as stream:
            name = stream.read().split()[0]
        try:
            os.close(_posixshmem.shm_open(name, os.O_RDONLY, 0))
            shared = "still there"
        except FileNotFoundError:
            shared = "removed"
        leftover = array[8:16].hex()
    else:
        with open(slot_path, "rb") as stream:
            leftover = stream.read(16)[8:16].hex()
print(json.dumps({
    "sharedSlot": shared,
    "late": late,
    "lateWritten": b'"t":"late"' in written,
    "exitMarker": b'"t":"exit"' in written,
    "detector": detector,
    "slotLeftover": leftover,
}))
`;

// A fork: the child must write into a slot of its own, and the parent's
// slot must not see what the child executed.
const FORK = `${SETUP}
runtime.switch({"test": "t", "phase": "call"})
parent = runtime.hits_var.get()
reader, writer = os.pipe()
pid = os.fork()
if pid == 0:
    child = runtime.hits_var.get()
    child[HIT] = 1
    os.write(writer, json.dumps({"separate": child.path != parent.path, "child": child[HIT]}).encode())
    os._exit(0)
os.waitpid(pid, 0)
report = json.loads(os.read(reader, 4096))
report["parentSawChild"] = parent[HIT] == 1
print(json.dumps(report))
`;

// Many phases, each starting a thread, with the cycle collector off: a
// finished thread must be freed by reference counting alone, and slots must
// be reused rather than piling up -- one per phase would mean a mapping per
// test, and on macOS unmapping a dirty one costs milliseconds.
const POOL = `${SETUP}
import gc, threading, weakref
gc.disable()
threads = []
for index in range(50):
    runtime.switch({"test": f"t{index}", "phase": "call"})
    thread = threading.Thread(target=lambda: runtime.hits_var.get().__setitem__(HIT, 1))
    thread.start()
    thread.join()
    threads.append(weakref.ref(thread))
    del thread
    runtime.switch(None)
print(json.dumps({
    "slots": runtime.next_slot,
    "threadsAlive": sum(1 for reference in threads if reference() is not None),
}))
`;

function run(script) {
  const result = spawnSync(python, ["-c", script, runtimeDirectory], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout.trim().split("\n").at(-1));
}

test("a record that arrives after close is turned away rather than crashing", { skip }, () => {
  // Close left the evidence file on disk and forgot the process owned it, so
  // the next record reopened the identical path -- same worker, same pid, a
  // token fixed for the collector's life -- and O_EXCL refused it.
  const outcome = run(CLOSE);
  assert.equal(outcome.late, "accepted", `a late record raised ${outcome.late}`);
  assert.equal(outcome.lateWritten, false, "and it is not written after the run's end");
});

test("close still writes the exit marker", { skip }, () => {
  // The marker is the transport's last record. Turning records away once
  // closed must not turn this one away too.
  assert.equal(run(CLOSE).exitMarker, true);
});

test("close marks its slots closed and leaves them in place, so a late write is never counted", { skip }, () => {
  // A daemon thread still holding its context's array writes into pages the
  // reader would otherwise read as that test's, so close zeroes the tag the
  // reader requires. It does not remove the file: a process that outlives the
  // test command closes while the reader is listing the evidence, and a slot
  // removed between the listing and the read failed the whole run.
  const { slotLeftover: leftover, sharedSlot } = run(CLOSE);
  assert.notEqual(leftover, null, "the slot file is still there");
  assert.match(leftover, /^0+$/, `slot tag left as ${leftover}`);
  // A shared memory slot (macOS) goes with its process's close: its name is
  // left, and the reader skips a name with nothing behind it.
  if (sharedSlot !== null) assert.equal(sharedSlot, "removed");
});

test("close stops the detector instead of observing and discarding", { skip }, () => {
  const { detector } = run(CLOSE);
  if (detector === null) return; // before 3.12 there is no detector to stop
  assert.equal(detector.globalEvents, 0, "no global event is left armed");
  assert.equal(detector.stillRegistered, false, "no callback is left registered");
});

test(
  "a forked child writes into a slot of its own",
  { skip: skip || (process.platform === "win32" ? "no fork on Windows" : false) },
  () => {
    const outcome = run(FORK);
    assert.equal(outcome.separate, true, "the child got its own slot");
    assert.equal(outcome.child, 1);
    assert.equal(outcome.parentSawChild, false, "the parent's slot does not see the child's hit");
  },
);

test("finished threads free their phase's slot, and slots are reused", { skip }, () => {
  const outcome = run(POOL);
  assert.equal(outcome.threadsAlive, 0, "a finished thread is freed without the cycle collector");
  assert.ok(outcome.slots <= 3, `${outcome.slots} slots for 50 phases`);
});


test("empty phases reserve identities without creating slots", { skip }, () => {
  const result = run(`${SETUP}
for index in range(100):
    runtime.switch({"test": f"empty{index}", "phase": "call"})
    runtime.assertion()
    runtime.switch(None)
runtime.close()
print(json.dumps({"slots": runtime.next_slot}))
`);
  assert.equal(result.slots, 0);
});

test("a context copied before its first hit is harvested before the assertion", { skip }, () => {
  const result = run(`${SETUP}
import contextvars
runtime.switch({"test": "copied", "phase": "call"})
copied = contextvars.copy_context()
copied.run(lambda: runtime.hits_var.get().__setitem__(HIT, 1))
# The original context still holds the shared reservation, not its mmap.
runtime.assertion()
with open(runtime.output_path, "rb") as stream:
    written = stream.read()
print(json.dumps({"hit": written.find(b'"t":"runs"'), "assertion": written.find(b'"t":"assert"')}))
`);
  assert.ok(result.hit >= 0 && result.hit < result.assertion, JSON.stringify(result));
});

test("records spell strings as json.dumps does and read an inherited identity back", { skip }, () => {
  const result = run(`${SETUP}
import random
random.seed(7)
alphabet = ["a", "Z", " ", "~", '"', "\\\\", "\\n", "\\t", "\\x00", "\\x1f", "\\x7f", "é", "€", "\\U0001f600", "\\ud800", ":", ",", "{", "}", "-", "1"]
mismatches = []
for _ in range(5000):
    text = "".join(random.choice(alphabet) for _ in range(random.randint(0, 12)))
    if rt._json_string(text) != json.dumps(text):
        mismatches.append(text)
    identity = {"phase": "call", "retry": random.randint(0, 3), "test": text, "worker": "main"}
    if rt._json_load(rt._json_text(identity)) != identity:
        mismatches.append(identity)
print(json.dumps({"mismatches": len(mismatches)}))
`);
  assert.equal(result.mismatches, 0);
});

test("an unresolved reservation touched after close never opens evidence", { skip }, () => {
  const result = run(`${SETUP}
late = runtime.hits_var.get()
runtime.close()
late[HIT] = 1
print(json.dumps({"slots": runtime.next_slot, "output": runtime.output, "hit": late[HIT]}))
`);
  assert.deepEqual(result, { slots: 0, output: null, hit: 1 });
});

test("a fresh background context after fork cannot write the parent's slot", { skip: skip || process.platform === "win32" }, () => {
  const result = run(`${SETUP}
import contextvars
parent = runtime.hits_var.get()
parent[HIT] = 0
parent_path = parent.path
reader, writer = os.pipe()
pid = os.fork()
if pid == 0:
    def touch():
        child = runtime.hits_var.get()
        child[HIT] = 1
        return {"separate": child.path != parent_path}
    os.write(writer, json.dumps(contextvars.Context().run(touch)).encode())
    os._exit(0)
os.waitpid(pid, 0)
result = json.loads(os.read(reader, 4096))
result["parentSawChild"] = parent[HIT] == 1
print(json.dumps(result))
`);
  assert.deepEqual(result, { separate: true, parentSawChild: false });
});

test("positioned transport writes preserve mmap framing through growth and overflow", { skip: skip || process.platform === "win32" }, () => {
  const outcome = run(`${SETUP}
# Force both backends on the same platform and compare every frame byte.
# Small capacities exercise remapping/resizing and the dropped-record header.
rt.TRANSPORT_INITIAL_CAPACITY = 256
rt.TRANSPORT_MAX_CAPACITY = 2048
rt.TRANSPORT_MAX_RECORD_SIZE = 512
outputs = []
for backend in [lambda fd, size: rt.mmap.mmap(fd, size), lambda fd, size: rt._FileOutput(fd)]:
    rt._open_transport = backend
    target = rt.Runtime(plan, evidence, "run", "transport")
    target._open_output()
    start = target.output_cursor
    for i in range(40):
        target._write_payload(json.dumps({"t": "probe", "i": i, "data": "x" * 60}).encode())
    path = target.output_path
    capacity, dropped, cursor = target.output_capacity, target.dropped_records, target.output_cursor
    target._close_output()
    with open(path, "rb") as stream: data = stream.read()
    outputs.append((data[start:], data[16:32], capacity, dropped, cursor))
print(json.dumps({"equal": outputs[0] == outputs[1], "grown": outputs[0][2], "dropped": outputs[0][3]}))
`);
  assert.equal(outcome.equal, true);
  assert.equal(outcome.grown, 2048);
  assert.ok(outcome.dropped > 0);
});

test("positioned transport retries short writes and commits only a complete frame", { skip: skip || process.platform === "win32" }, () => {
  const outcome = run(`${SETUP}
import struct, zlib
runtime.output.close()
runtime.output = rt._FileOutput(runtime.output_descriptor)
original = os.pwrite
writes = []
def short_write(fd, data, offset):
    written = original(fd, data[:7], offset)
    writes.append((offset, written))
    return written
os.pwrite = short_write
start = runtime.output_cursor
payload = b'{"t":"probe","value":"more than seven bytes"}'
runtime._write_payload(payload)
os.pwrite = original
with open(runtime.output_path, "rb") as stream:
    stream.seek(start); data = stream.read(runtime.output_cursor - start)
length, checksum = struct.unpack_from("<II", data, 4)
print(json.dumps({"commitLast": writes[-1] == (start, 1), "writes": len(writes),
                  "committed": data[0], "payload": data[16:16+length] == payload,
                  "checksum": checksum == zlib.crc32(payload)}))
`);
  assert.equal(outcome.commitLast, true);
  assert.ok(outcome.writes > 3);
  assert.equal(outcome.committed, 1);
  assert.equal(outcome.payload, true);
  assert.equal(outcome.checksum, true);
});

test("failed positioned writes leave a frame uncommitted and preserve earlier records", { skip: skip || process.platform === "win32" }, () => {
  const outcome = run(`${SETUP}
runtime.output.close()
runtime.output = rt._FileOutput(runtime.output_descriptor)
start = runtime.output_cursor
with open(runtime.output_path, "rb") as stream: prefix = stream.read(start)
original = os.pwrite
calls = 0
def stalled_write(fd, data, offset):
    global calls
    calls += 1
    return original(fd, data[:7], offset) if calls == 1 else 0
os.pwrite = stalled_write
failed = False
try:
    runtime._write_payload(b'{"t":"probe","value":"interrupted"}')
except OSError:
    failed = True
finally:
    os.pwrite = original
with open(runtime.output_path, "rb") as stream: data = stream.read()
print(json.dumps({"failed": failed, "committed": data[start], "prefix": data[:start] == prefix,
                  "cursor": runtime.output_cursor == start}))
`);
  assert.equal(outcome.failed, true);
  assert.equal(outcome.committed, 0);
  assert.equal(outcome.prefix, true);
  assert.equal(outcome.cursor, true);
});

test("busy file transports switch to mmap without changing existing evidence", { skip: skip || process.platform === "win32" }, () => {
  const outcome = run(`${SETUP}
runtime.output.close()
runtime.output = rt._FileOutput(runtime.output_descriptor)
start = runtime.output_cursor
with open(runtime.output_path, "rb") as stream: prefix = stream.read(start)
rt.TRANSPORT_MAP_AFTER_BYTES = start + 64
runtime._write_payload(b'{"t":"probe","value":"switch after the previous records were written"}')
mapped = isinstance(runtime.output, rt.mmap.mmap)
# A later resize must keep the busy transport mapped.
runtime._grow_output(runtime.output_capacity + 1)
still_mapped = isinstance(runtime.output, rt.mmap.mmap)
with open(runtime.output_path, "rb") as stream: data = stream.read()
# Capacity is the one header field growth deliberately changes.
print(json.dumps({"mapped": mapped, "stillMapped": still_mapped,
                  "prefix": data[:16] == prefix[:16] and data[24:start] == prefix[24:],
                  "committed": data[start]}))
`);
  assert.equal(outcome.mapped, true);
  assert.equal(outcome.stillMapped, true);
  assert.equal(outcome.prefix, true);
  assert.equal(outcome.committed, 1);
});

test("a failed optional mmap upgrade keeps recording through positioned writes", { skip: skip || process.platform === "win32" }, () => {
  const outcome = run(`${SETUP}
runtime.output.close()
runtime.output = rt._FileOutput(runtime.output_descriptor)
start = runtime.output_cursor
rt.TRANSPORT_MAP_AFTER_BYTES = start
original = rt.mmap.mmap
calls = 0
def unavailable(*args, **kwargs):
    global calls
    calls += 1
    raise OSError("no mapping available")
rt.mmap.mmap = unavailable
try:
    runtime._write_payload(b'{"t":"probe","value":1}')
    second = runtime.output_cursor
    runtime._write_payload(b'{"t":"probe","value":2}')
finally:
    rt.mmap.mmap = original
with open(runtime.output_path, "rb") as stream: data = stream.read()
print(json.dumps({"calls": calls, "first": data[start], "second": data[second]}))
`);
  assert.equal(outcome.calls, 1);
  assert.equal(outcome.first, 1);
  assert.equal(outcome.second, 1);
});
