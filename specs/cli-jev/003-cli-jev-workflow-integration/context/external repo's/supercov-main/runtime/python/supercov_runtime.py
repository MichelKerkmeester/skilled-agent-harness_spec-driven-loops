"""Supercov's stdlib-only Python runtime.

Rust decides the denominator ahead of the run and ships it as a plan: every
statement, function, decision, loop, match and exception-flow obligation
with a stable id and a source span. `supercov_probes` compiles a probe for
each into the measured modules as they are imported; this module owns what
the probes write into, and turns it into evidence per test phase. It never
changes a file on disk, never computes a coverage verdict, and imports
nothing outside the standard library.

Where a probe writes. Every context -- a test phase, or the background -- is
handed a slot: a small file mapped into memory, one byte per obligation and
a region per decision. A probe is a byte store into the current context's
slot. The kernel owns those pages, so what a process observed outlives the
process however it ends -- `os._exit`, SIGTERM, SIGKILL -- and the reader
collects whatever no harvest reached. A harvest turns set bytes into records
on the evidence transport and clears them; it runs when a phase ends, at a
test's first assertion and at exit. A slot no thread or task holds any more
is harvested once more and handed to the next context: a mapping is never
unmapped while the process measures, because unmapping dirty shared pages
flushes them synchronously (3 ms on macOS, per phase).

Supported interpreters: CPython 3.9 and newer.
"""

from __future__ import annotations

import atexit
import contextvars
import _thread
import itertools
import mmap
import os
import sys
import time
import zlib

PLAN_VERSION = 1
EVIDENCE_VERSION = 1
CONTEXT_ENV = "SUPERCOV_CONTEXT"
PLAN_ENV = "SUPERCOV_PYTHON_PLAN"
EVIDENCE_DIR_ENV = "SUPERCOV_PYTHON_EVIDENCE_DIR"
RUN_ID_ENV = "SUPERCOV_RUN_ID"
WORKER_ENV = "SUPERCOV_PYTHON_WORKER"
TIMING = bool(os.environ.get("SUPERCOV_PYTHON_TIMING"))
# Debug only: leave out one piece of the runtime to measure what it costs --
# `harvest` skips turning slots into records, `detector` the unprobed-module
# detector.
STUB = os.environ.get("SUPERCOV_PYTHON_STUB", "")
_timing = {"switch": [0, 0.0], "harvest": [0, 0.0]}

TRANSPORT_MAGIC = b"SCVPYTH1"
TRANSPORT_VERSION = 2
TRANSPORT_HEADER_SIZE = 64
TRANSPORT_RECORD_HEADER_SIZE = 16
TRANSPORT_INITIAL_CAPACITY = 1024 * 1024
TRANSPORT_MAP_AFTER_BYTES = 64 * 1024
TRANSPORT_MAX_CAPACITY = 512 * 1024 * 1024
TRANSPORT_MAX_RECORD_SIZE = 4 * 1024 * 1024
MAX_OPEN_EVALUATIONS = 64
# The slot layout every process of a run shares, written once beside the
# evidence. A slot file names the layout in its header; a zeroed name marks
# a slot its process closed, whose bytes the reader must not count.
LAYOUT_NAME = "layout.json"
SLOT_SUFFIX = ".slot"
# On macOS a slot is a POSIX shared memory object, named in a small file with
# this suffix beside the transport. CPython's mmap asks macOS for F_FULLFSYNC
# on the file it maps, which flushes the drive's cache: 3.7 ms per slot, which
# was the largest single cost of starting a measured interpreter. A shared
# memory object has no drive behind it and is mapped in microseconds, and the
# kernel keeps it, like the file's pages, whatever happens to the process.
SHARED_SLOT_SUFFIX = ".shm"
# Imported with the first slot: an interpreter that never runs measured code
# never maps one.
_posixshmem = None if sys.platform == "darwin" else False
# Records of one harvest are chunked under the transport's record bound: a
# run is two numbers.
HARVEST_CHUNK = 40000

_monitoring = getattr(sys, "monitoring", None)  # 3.12+: only the unprobed-module detector uses it


def _now_ms() -> int:
    return int(time.time() * 1000)


# Records are JSON, written without the `json` package: importing it costs a
# child interpreter milliseconds (it pulls in `re`), and a suite that launches
# thousands of interpreters pays that per process. Most strings a record holds
# are printable ASCII without a quote or backslash, whose JSON is themselves
# in quotes; anything else goes through `_json`, json's C half, loaded then.
_JSON_ESCAPES = {'"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f"}


def _json_string(text: str) -> str:
    """`text` as `json.dumps` spells it, ASCII only."""
    if text.isascii() and text.isprintable() and '"' not in text and "\\" not in text:
        return '"' + text + '"'
    # Rarer strings -- an argv holding a newline, say -- a character at a
    # time: importing `_json` for them cost an interpreter a quarter of a
    # millisecond, which a suite launching thousands pays thousands of times.
    out = ['"']
    for character in text:
        escaped = _JSON_ESCAPES.get(character)
        if escaped is not None:
            out.append(escaped)
        elif " " <= character <= "~":
            out.append(character)
        else:
            code = ord(character)
            if code > 0xFFFF:
                code -= 0x10000
                out.append("\\u%04x\\u%04x" % (0xD800 | (code >> 10), 0xDC00 | (code & 0x3FF)))
            else:
                out.append("\\u%04x" % code)
    out.append('"')
    return "".join(out)


def _json_text(value) -> str:
    """`value` as compact ASCII JSON: the str, int, bool, None, list and dict
    shapes a record is made of."""
    kind = type(value)
    if kind is str:
        return _json_string(value)
    if kind is int:
        return str(value)
    if kind is bool:
        return "true" if value else "false"
    if value is None:
        return "null"
    if kind is dict:
        return "{" + ",".join(_json_string(str(key)) + ":" + _json_text(item) for key, item in value.items()) + "}"
    if kind is list or kind is tuple:
        return "[" + ",".join(map(_json_text, value)) + "]"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, str):
        return _json_string(str(value))
    if isinstance(value, int):
        return str(int(value))
    raise TypeError(f"a Supercov record cannot hold {kind.__name__}")


class _ParseContext:
    strict = True
    object_hook = None
    object_pairs_hook = None
    parse_float = float
    parse_int = int

    @staticmethod
    def parse_constant(name):
        raise ValueError(f"not JSON: {name}")


def _flat_object(text: str):
    """A flat JSON object of plain strings and integers -- what
    `child_environment` writes for an identity -- or None for anything else,
    which `_json_load` hands to the JSON scanner."""
    if "\\" in text or not text.startswith("{") or not text.endswith("}"):
        return None
    result: dict = {}
    if text == "{}":
        return result
    index, end = 1, len(text)
    while True:
        if text[index : index + 1] != '"':
            return None
        close = text.find('"', index + 1)
        if close < 0:
            return None
        key, index = text[index + 1 : close], close + 1
        if text[index : index + 1] != ":":
            return None
        index += 1
        if text[index : index + 1] == '"':
            close = text.find('"', index + 1)
            if close < 0:
                return None
            value, index = text[index + 1 : close], close + 1
        else:
            start = index
            if text[index : index + 1] == "-":
                index += 1
            while index < end and "0" <= text[index] <= "9":
                index += 1
            if index == start or text[start:index] == "-":
                return None
            value = int(text[start:index])
        result[key] = value
        separator = text[index : index + 1]
        index += 1
        if separator == "}" and index == end:
            return result
        if separator != ",":
            return None


def _json_load(text: str):
    """Parse JSON with `_json`'s C scanner, which is all `json.loads` is,
    unless it is the flat object an identity is written as."""
    flat = _flat_object(text)
    if flat is not None:
        return flat
    try:
        from _json import make_scanner
    except ImportError:  # pragma: no cover
        import json

        return json.loads(text)
    try:
        value, end = make_scanner(_ParseContext())(text, 0)
    except StopIteration:
        raise ValueError("not JSON") from None
    if end != len(text):
        raise ValueError("trailing data after JSON")
    return value


def _digits(mask: int, width: int) -> str:
    """A base-3 evaluation mask as the vector digits the evidence carries:
    per condition 0 not evaluated, 1 false, 2 true."""
    out = []
    for _ in range(width):
        out.append("012"[mask % 3])
        mask //= 3
    return "".join(out)


class _Decision:
    """What a decision's vectors imply, beyond themselves."""

    __slots__ = ("id", "width", "outcome_true", "outcome_false", "logical")

    def __init__(self, plan: dict, logical: list) -> None:
        self.id = plan["id"]
        self.width = len(plan["conditions"])
        self.outcome_true = plan["outcomeTrue"]
        self.outcome_false = plan["outcomeFalse"]
        self.logical = logical

    def implied(self, digits: str, outcome: bool, into: list) -> None:
        """The outcome hit, and each logical operator's: evaluated when a leaf
        of its right operand was, short-circuited when only earlier ones were."""
        into.append(self.outcome_true if outcome else self.outcome_false)
        for logical in self.logical:
            if any(digits[index] != "0" for index in logical["operandLeaves"]):
                into.append(logical["evaluated"])
            elif any(digits[index] != "0" for index in logical["previousLeaves"]):
                into.append(logical["shortCircuit"])


class _FileOutput:
    """Write transport frames directly on macOS, without a second mapping.

    The hot hit slots still use shared mmap pages. Transport records are
    already batched and serialized under the runtime lock, so positioned
    writes retain the same payload-before-commit protocol. This avoids
    CPython's macOS-only F_FULLFSYNC on every mmap creation/remapping; it
    does not buffer evidence in Python or change the on-disk format.
    Busy processes switch to mmap after 64 KiB to amortize its setup cost
    instead of paying for positioned writes for every subsequent frame.
    The Runtime owns the descriptor, including across fork and close.
    """

    def __init__(self, descriptor):
        self.descriptor = descriptor
        self.map_failed = False

    def write_at(self, offset, data):
        while data:
            written = os.pwrite(self.descriptor, data, offset)
            if written <= 0:
                raise OSError("Python evidence transport write made no progress")
            offset += written
            data = data[written:]

    def flush(self):
        # Positioned writes are in the kernel's page cache once `pwrite`
        # returns, which is all a killed process needs; a slot's shared pages
        # are never synced either. An fsync bought durability across a
        # machine crash that nothing after one could use, at a cost to every
        # interpreter.
        pass

    def close(self):
        pass


def _open_transport(descriptor, capacity):
    if sys.platform == "darwin":
        return _FileOutput(descriptor)
    return mmap.mmap(descriptor, capacity, access=mmap.ACCESS_WRITE)


def _transport_write(output, offset, data):
    if isinstance(output, _FileOutput):
        output.write_at(offset, data)
    else:
        output[offset:offset + len(data)] = data


class _Hits(mmap.mmap):
    """A slot: one small file mapped for the probes, handed to one context
    at a time.

    A subclass so it can carry its context, the evaluations in progress of
    its multi-condition decisions, and the file it maps.
    """

    __slots__ = ("context", "states", "path", "descriptor", "shared")


class _LazyHits:
    """Reserve a phase's identity without mapping an empty evidence file.

    The first probe resolves the reservation and replaces it in its current
    ContextVar, so subsequent probes still write straight into the mmap.
    Contexts copied before that first probe share the reservation, including
    the resolved slot, and keep it alive until their work finishes.
    """

    __slots__ = ("runtime", "context", "resolved")

    def __init__(self, runtime, context):
        self.runtime, self.context, self.resolved = runtime, context, None

    def _get(self):
        if self.resolved is None:
            with self.runtime.lock:
                if self.resolved is None:
                    self.resolved = self.runtime._allocate_hits(self.context)
        if self.runtime.hits_var.get() is self:
            self.runtime.hits_var.set(self.resolved)
        return self.resolved

    def __getitem__(self, key):
        return self._get()[key]

    def __setitem__(self, key, value):
        self._get()[key] = value

    def __getattr__(self, name):
        return getattr(self._get(), name)


class _Sink(bytearray):
    """Where probes write once the runtime has closed, or when no slot could
    be mapped: nothing it holds is recorded."""

    __slots__ = ("context", "states")


class _DecisionState:
    """One multi-condition decision's evaluation in one context.

    `mask` holds a base-3 digit per condition for the evaluation in progress.
    A nested evaluation of the same decision -- a recursive call inside a
    condition -- saves the outer one and restores it when the inner closes.
    """

    __slots__ = ("mask", "last", "saved")

    def __init__(self) -> None:
        self.mask = 0
        self.last = -1
        self.saved: list = []


class Runtime:
    def __init__(self, plan_path: str, evidence_dir: str, run_id: str, worker: str) -> None:
        import supercov_probes

        root, index = supercov_probes.load_plan(plan_path, PLAN_VERSION)
        self.root = os.path.realpath(root)
        self.evidence_dir = evidence_dir
        self.run_id = run_id
        self.worker = worker
        self.tool_id = None
        self.lock = _thread.RLock()
        self.path_cache: dict[str, str | None] = {}
        self.real_directories: dict[str, str] = {}
        self.under_root = False
        self.context = contextvars.ContextVar("supercov_python_context", default=0)
        self.identities: dict[int, dict] = {}
        self.next_context = 1
        self.asserted: set[int] = set()
        # (context, file, line) of every assertion site a test has reached.
        self.asserted_sites: set[tuple[int, str, int]] = set()
        # (context, file, line) of every site probe already handled.
        self.probed_sites: set[tuple[int, str, int]] = set()
        self.seen_hits: set = set()
        self.seen_vectors: set = set()
        self._id_json: dict = {}
        self.pytest_active = False
        self.reported_limitations: set = set()
        self.output_path = None
        self.output_descriptor = None
        self.output = None
        self.output_capacity = 0
        self.output_cursor = TRANSPORT_HEADER_SIZE
        self.output_pid = None
        self.output_token = f"{time.time_ns():x}-{id(self) & 0xFFFF:x}"
        # Tells this interpreter's shared memory slots from those of an
        # earlier process that had the same pid.
        self.shared_token = f"{time.time_ns() & 0xFFFFFF:x}"
        self.dropped_records = 0
        self.closed = False
        self.registered_events: tuple = ()
        # The plan, numbered into the slot layout; see supercov_probes.
        self.index = index
        self.probe_files = index.files
        self.probe_sites = index.sites
        self.probe_ids = index.ids
        self.probe_decisions = index.decisions
        self.loaded_decisions: dict[int, _Decision] = {}
        self.probe_boolops = index.boolop_groups
        self.regions = index.regions
        self.slot_header = supercov_probes.SLOT_HEADER
        self.slot_bytes = index.slot_bytes
        # What a harvest stores over a run of set bytes.
        self.slot_zeros = memoryview(bytes(index.slot_bytes))
        self.slot_tag = bytes.fromhex(index.digest[:16])
        self.pow3 = [3**i for i in range(index.max_width + 1)]
        self.live_slots: list = []
        self.free_slots: list = []
        self.next_slot = 0
        # How many references `_holders` sees to an object only the slot
        # list holds: taken through the same code, so it is right whatever
        # the interpreter counts along the way.
        self.free_refs = self._holders([object()], 0)
        # Open evaluations of standalone BoolOps by (context, group): stacks,
        # because an operand can re-enter its own group through a recursive
        # call before the outer evaluation has finished.
        self.probe_open_boolops: dict = {}
        self.probing = None
        # Created at install, when the background's slot can be.
        self.hits_var = None

    # -- evidence transport -------------------------------------------------

    def _open_output(self) -> None:
        os.makedirs(self.evidence_dir, exist_ok=True)
        pid = os.getpid()
        safe_worker = "".join(
            character if character.isalnum() or character in "-_." else "_"
            for character in self.worker
        )
        self.output_path = os.path.join(
            self.evidence_dir,
            f"{safe_worker}.{pid}.{self.output_token}.mmap",
        )
        descriptor = os.open(self.output_path, os.O_RDWR | os.O_CREAT | os.O_EXCL, 0o600)
        try:
            os.ftruncate(descriptor, TRANSPORT_INITIAL_CAPACITY)
            output = _open_transport(descriptor, TRANSPORT_INITIAL_CAPACITY)
        except Exception:
            os.close(descriptor)
            raise
        self.output_descriptor = descriptor
        self.output = output
        self.output_capacity = TRANSPORT_INITIAL_CAPACITY
        self.output_cursor = TRANSPORT_HEADER_SIZE
        self.output_pid = pid
        self.dropped_records = 0
        # "<8sIIQQQ24x": magic, version, header size, capacity, dropped, pid.
        _transport_write(
            output,
            0,
            TRANSPORT_MAGIC
            + TRANSPORT_VERSION.to_bytes(4, "little")
            + TRANSPORT_HEADER_SIZE.to_bytes(4, "little")
            + self.output_capacity.to_bytes(8, "little")
            + bytes(8)
            + pid.to_bytes(8, "little")
            + bytes(24),
        )
        self._write_record(
            {
                "t": "process",
                "v": EVIDENCE_VERSION,
                "run": self.run_id,
                "pid": pid,
                "worker": self.worker,
                "frontend": "probes",
                "python": sys.version.split()[0],
                "executable": sys.executable,
                "argv": sys.argv,
            }
        )
        context = self.context.get()
        identity = self.identities.get(context)
        if context and identity is not None:
            # A forked child inherits the active ContextVar and identity table,
            # but its new transport needs a local declaration before its first
            # hit can reference that context.
            self._write_record({"t": "phase", "ctx": context, "at": _now_ms(), **identity})

    def _close_output(self) -> None:
        output = self.output
        descriptor = self.output_descriptor
        self.output = None
        self.output_descriptor = None
        self.output_path = None
        self.output_capacity = 0
        self.output_cursor = TRANSPORT_HEADER_SIZE
        self.output_pid = None
        if output is not None:
            # No sync: what a mapping or a positioned write stored is in the
            # page cache, where the reader finds it however this process ends
            # (see `_FileOutput.flush`). msync on Linux wrote the transport
            # to disk twice per interpreter.
            output.close()
        if descriptor is not None:
            os.close(descriptor)

    def _ensure_process_output(self) -> None:
        if self.output_pid == os.getpid() and self.output is not None:
            return
        # A fork inherits the parent's Python objects and mapping. It must not
        # append through the parent's transport: rotate to a child-owned file
        # on the first post-fork record instead.
        if self.output is not None or self.output_descriptor is not None:
            self._close_output()
        self._open_output()

    @staticmethod
    def _checksum(payload: bytes) -> int:
        # CRC-32 in C. FNV-1a in a Python loop cost two microseconds of every
        # record's five; the reader tells the two apart by transport version.
        return zlib.crc32(payload)

    def _grow_output(self, required: int) -> bool:
        if self.output is None or self.output_descriptor is None:
            return False
        capacity = self.output_capacity
        while capacity < required and capacity < TRANSPORT_MAX_CAPACITY:
            capacity = min(capacity * 2, TRANSPORT_MAX_CAPACITY)
        if capacity < required:
            return False
        was_file = isinstance(self.output, _FileOutput)
        self.output.close()
        os.ftruncate(self.output_descriptor, capacity)
        self.output = (_open_transport(self.output_descriptor, capacity) if was_file
                       else mmap.mmap(self.output_descriptor, capacity, access=mmap.ACCESS_WRITE))
        self.output_capacity = capacity
        _transport_write(self.output, 16, capacity.to_bytes(8, "little"))
        return True

    def _write_record(self, record: dict) -> None:
        self._write_payload(_json_text(record).encode("ascii"))

    def _json_id(self, text: str) -> bytes:
        # The JSON spelling of a string the records repeat -- an obligation,
        # a test id, a phase name -- once. The hot records are templates
        # these fill in; encoding a dict for each was most of their cost.
        encoded = self._id_json.get(text)
        if encoded is None:
            encoded = self._id_json[text] = _json_string(str(text)).encode("ascii")
        return encoded

    def _write_hit(self, context: int, obligation: str) -> None:
        # Byte for byte what `_write_record` produces for the same dict: keys
        # sorted, no spaces. The reader does not know the difference.
        self._write_payload(b'{"ctx":%d,"id":%s,"t":"hit"}' % (context, self._json_id(obligation)))

    def _write_vector(self, context: int, decision_id: str, digits: str, outcome: bool) -> None:
        self._write_payload(
            b'{"ctx":%d,"id":%s,"o":%d,"t":"dec","v":"%s"}'
            % (context, self._json_id(decision_id), 1 if outcome else 0, digits.encode("ascii"))
        )

    def _write_payload(self, payload: bytes) -> None:
        if self.output is None:
            raise RuntimeError("Python evidence transport is not open")
        if len(payload) > TRANSPORT_MAX_RECORD_SIZE:
            self._drop_record()
            return
        end = self.output_cursor + TRANSPORT_RECORD_HEADER_SIZE + len(payload)
        next_cursor = (end + 7) & ~7
        if next_cursor > self.output_capacity and not self._grow_output(next_cursor):
            self._drop_record()
            return
        output = self.output
        if isinstance(output, _FileOutput) and not output.map_failed and next_cursor > TRANSPORT_MAP_AFTER_BYTES:
            try:
                self.output = mmap.mmap(self.output_descriptor, self.output_capacity, access=mmap.ACCESS_WRITE)
                output = self.output
            except (OSError, ValueError):
                # Mapping is optional: keep writing valid evidence if the
                # process cannot reserve another contiguous address range.
                output.map_failed = True
        cursor = self.output_cursor
        if isinstance(output, _FileOutput):
            frame = (
                bytes(4) + len(payload).to_bytes(4, "little") + self._checksum(payload).to_bytes(4, "little") + bytes(4) + payload
            )
            output.write_at(cursor, frame + b"\0" * (next_cursor - end))
            # Commit only after every byte was accepted by the kernel. A
            # short write is retried; an interrupted frame remains uncommitted.
            output.write_at(cursor, b"\x01")
        else:
            output[cursor + TRANSPORT_RECORD_HEADER_SIZE : end] = payload
            if next_cursor > end:
                output[end:next_cursor] = b"\0" * (next_cursor - end)
            output[cursor + 4 : cursor + 12] = len(payload).to_bytes(4, "little") + self._checksum(payload).to_bytes(4, "little")
            # The single-byte commit is deliberately last. A killed process can
            # leave bytes in an uncommitted frame, which the Rust reader ignores;
            # it cannot expose a committed record with a missing payload.
            output[cursor] = 1
        self.output_cursor = next_cursor

    def _drop_record(self) -> None:
        self.dropped_records += 1
        if self.output is not None:
            _transport_write(self.output, 24, self.dropped_records.to_bytes(8, "little"))

    def _record(self, record: dict) -> None:
        with self.lock:
            # Close stops observing before it closes the transport, so nothing
            # new is scheduled after it. A callback already running on another
            # thread when close began waits on this lock and arrives here once
            # the transport is gone. Reopening it would rebuild the very path
            # close left on disk -- same worker, same pid, the same token -- and
            # O_EXCL refuses that, which surfaced as a traceback in a suite
            # whose daemon threads outlived its tests. What a thread runs after
            # every atexit handler belongs to no test, so it is not recorded.
            if self.closed:
                return
            self._ensure_process_output()
            self._write_record(record)

    def _record_payload(self, payload: bytes) -> None:
        """`_record` for a record already spelled as JSON bytes."""
        with self.lock:
            if self.closed:
                return
            self._ensure_process_output()
            self._write_payload(payload)

    def flush(self) -> None:
        # Both positioned writes and shared mmap writes reach the kernel page
        # cache immediately; syncing adds latency without improving SIGKILL
        # survival, so nothing is synced, at a phase or at close.
        return

    def limitation(self, identifier: str, reason: str, file: str | None = None, obligation: str | None = None) -> None:
        key = (identifier, file, obligation)
        with self.lock:
            if key in self.reported_limitations:
                return
            self.reported_limitations.add(key)
            record = {"t": "limitation", "id": identifier, "reason": reason}
            if file is not None:
                record["file"] = file
            if obligation is not None:
                record["obligation"] = obligation
            self._record(record)

    # -- identity -----------------------------------------------------------

    def set_worker(self, worker: str) -> None:
        with self.lock:
            if worker != self.worker:
                self.worker = worker
                self._record({"t": "worker", "worker": worker})

    def switch(self, identity: dict | None) -> int:
        """Enter a test phase (or background when `identity` is None).

        Allocates a process-local context id, records the identity it stands
        for, harvests the slot of the phase it leaves, and hands the new phase
        a slot of its own.
        """
        began = time.perf_counter() if TIMING else 0.0
        try:
            return self._switch(identity)
        finally:
            if TIMING:
                _timing["switch"][0] += 1
                _timing["switch"][1] += time.perf_counter() - began

    def _switch(self, identity: dict | None) -> int:
        with self.lock:
            if identity is None:
                context = 0
            else:
                context = self.next_context
                self.next_context += 1
                stored = {
                    "worker": identity.get("worker", self.worker),
                    "test": identity["test"],
                    "retry": int(identity.get("retry", 0)),
                    "phase": identity["phase"],
                }
                self.identities[context] = stored
                text = self._json_id
                self._record_payload(
                    b'{"at":%d,"ctx":%d,"phase":%s,"retry":%d,"t":"phase","test":%s,"worker":%s}'
                    % (_now_ms(), context, text(stored["phase"]), stored["retry"], text(stored["test"]), text(stored["worker"]))
                )
            leaving = self.hits_var.get()
            if isinstance(leaving, _LazyHits):
                leaving = leaving.resolved
            if isinstance(leaving, _Hits):
                self._harvest(leaving)
            self.hits_var.set(self._new_hits(context))
            # Usually the last reference: the slot is free again below.
            del leaving
            self._reclaim()
            self.context.set(context)
        return context

    def current_identity(self) -> dict | None:
        return self.identities.get(self.context.get())

    def assertion(self) -> bool:
        """The first assertion of a call phase.

        Every first sighting the phase recorded so far already carries its
        context; the marker says they ran before an assertion, and the report
        links them to it once the phase passes. Returns whether this call
        wrote the marker: later assertions of the phase cost one set lookup.
        """
        context = self.context.get()
        if context == 0 or context in self.asserted:
            return False
        with self.lock:
            if context in self.asserted:
                return False
            identity = self.identities.get(context)
            if identity is None or identity.get("phase") != "call":
                return False
            self.asserted.add(context)
            # What the phase observed so far goes out ahead of the marker:
            # the reader credits the assertion with the records before it.
            array = self.hits_var.get()
            if isinstance(array, _LazyHits):
                array = array.resolved
            if isinstance(array, _Hits) and array.context == context:
                self._harvest(array)
            self._record_payload(b'{"ctx":%d,"t":"assert"}' % context)
        return True

    def child_environment(self) -> dict:
        """Environment additions that carry the current phase into a child
        interpreter. `PYTHONPATH` and the plan variables already inherit."""
        identity = self.current_identity()
        if identity is None:
            return {}
        return {CONTEXT_ENV: _json_text({key: identity[key] for key in sorted(identity)})}

    def outcome(self, worker: str, test: str, retry: int, phase: str, outcome: str, xfail: bool, runner: str = "pytest", file: "str | None" = None) -> None:
        """`file` is where the runner says the test is defined.

        An assertion map selects tests by source file and name, and a runner
        identity alone -- a dotted module path, a pytest node id -- is not a
        path. An adapter that cannot name the file leaves it None and the
        report falls back to deriving one from the identity.
        """
        text = self._json_id
        self._record_payload(
            b'{%s"outcome":%s,"phase":%s,"retry":%d,"runner":%s,"t":"outcome","test":%s,"worker":%s,"xfail":%s}'
            % (
                b'"file":%s,' % text(file) if file else b"",
                text(outcome),
                text(phase),
                int(retry),
                text(runner),
                text(test),
                text(worker),
                b"true" if xfail else b"false",
            )
        )

    def assertion_site(self, file: "str | None", line: "int | None") -> None:
        """Where in the test an assertion ran, so a map can tell sites apart.

        The record is a file and a line; the report resolves the column
        against the syntax inventory Supercov captured before the run, and a
        frame naming no inventoried site matches nothing rather than inventing
        a witness. Recorded once per site per test: later sightings cost one
        set lookup. Only the call phase is reported, because setup and
        teardown assertions witness no test.
        """
        if not file or not line:
            return
        context = self.context.get()
        if context == 0:
            return
        # One spelling per site, whoever reports it: a site probe names the
        # project-relative path and a frame names whatever the interpreter
        # loaded. The reader keys a site on the text it is given, and two
        # spellings of one site became two assertion phases with one id.
        file = self._relative_path(file)
        if file is None:
            return
        key = (context, file, line)
        if key in self.asserted_sites:
            return
        with self.lock:
            if key in self.asserted_sites:
                return
            identity = self.identities.get(context)
            if identity is None or identity.get("phase") != "call":
                return
            self.asserted_sites.add(key)
            self._record_payload(b'{"ctx":%d,"f":%s,"l":%d,"t":"asite"}' % (context, self._json_id(file), int(line)))

    # -- observation --------------------------------------------------------

    def _hit(self, context: int, obligation: str) -> None:
        """A hit a probe cannot store: a standalone BoolOp's operands, and
        what a wide decision's vector implies. Written at once, so it is
        exactly as durable as a slot byte."""
        key = (context, obligation)
        if key in self.seen_hits:
            return
        with self.lock:
            if key in self.seen_hits:
                return
            self.seen_hits.add(key)
            # Same guard against a record after close as `_record`.
            if self.closed:
                return
            self._ensure_process_output()
            self._write_hit(context, obligation)

    def _wide_vector(self, context: int, d: int, mask: int, outcome: bool) -> None:
        """A vector of a decision too wide for a region: recorded at once."""
        decision = self._decision(d)
        digits = _digits(mask, decision.width)
        key = (context, decision.id, digits)
        if key in self.seen_vectors:
            return
        with self.lock:
            if key in self.seen_vectors:
                return
            self.seen_vectors.add(key)
            if self.closed:
                return
            self._ensure_process_output()
            self._write_vector(context, decision.id, digits, outcome)
        implied: list = []
        decision.implied(digits, outcome, implied)
        for identifier in implied:
            self._hit(context, identifier)

    def _relative_path(self, filename: str) -> str | None:
        cached = self.path_cache.get(filename, self)
        if cached is not self:
            return cached
        relative = None
        if filename and not filename.startswith("<"):
            candidates = [filename]
            if not os.path.isabs(filename):
                candidates.append(os.path.join(os.getcwd(), filename))
            for candidate in candidates:
                try:
                    real = self._realpath(candidate)
                except OSError:
                    continue
                if real == self.root or real.startswith(self.root + os.sep):
                    self.under_root = True
                    relative = real[len(self.root) + 1 :].replace(os.sep, "/")
                    if relative in self.probe_files or relative in self.probe_sites:
                        break
                    relative = None
        self.path_cache[filename] = relative
        return relative

    def _realpath(self, path: str) -> str:
        """`os.path.realpath`, resolving each directory once.

        realpath checks every component of every path it is given, and the
        start-up scan hands it the file of every module already imported:
        a thousand `lstat` calls for a few dozen directories. Only the file
        itself is checked per call, and resolved again if it is a link.
        """
        directory, name = os.path.split(os.path.abspath(path))
        real = self.real_directories.get(directory)
        if real is None:
            real = self.real_directories[directory] = os.path.realpath(directory)
        joined = os.path.join(real, name)
        return os.path.realpath(joined) if os.path.islink(joined) else joined

    # -- slots ----------------------------------------------------------------

    def _decision(self, d: int) -> _Decision:
        if d not in self.loaded_decisions:
            self.loaded_decisions[d] = _Decision(*self.probe_decisions[d])
        return self.loaded_decisions[d]

    def _write_layout(self) -> None:
        """The slot layout, once per run: every process numbers the same plan
        the same way, so the first to get here writes it for all of them."""
        path = os.path.join(self.evidence_dir, LAYOUT_NAME)
        if os.path.exists(path):
            return
        partial = f"{path}.{os.getpid()}.{self.output_token}.partial"
        import json

        with open(partial, "w", encoding="utf-8") as stream:
            json.dump(self.index.layout(), stream, separators=(",", ":"))
        try:
            os.replace(partial, path)
        except OSError:
            # Another process published the same layout first.
            if not os.path.exists(path):
                raise
            try:
                os.unlink(partial)
            except OSError:
                pass

    def _create_slot(self) -> _Hits:
        # A slot is named after its process's transport, which the reader
        # reads first: the phases a slot's context stands for are declared there.
        self._ensure_process_output()
        stem = f"{self.output_path[: -len('.mmap')]}.{self.next_slot}"
        self.next_slot += 1
        global _posixshmem
        if _posixshmem is None:
            try:
                import _posixshmem
            except ImportError:
                _posixshmem = False
        if _posixshmem:
            try:
                return self._create_shared_slot(stem)
            except OSError:
                pass
        path = stem + SLOT_SUFFIX
        descriptor = os.open(path, os.O_RDWR | os.O_CREAT | os.O_EXCL | getattr(os, "O_BINARY", 0), 0o600)
        try:
            os.ftruncate(descriptor, self.slot_bytes)
            slot = _Hits(descriptor, self.slot_bytes, access=mmap.ACCESS_WRITE)
        except Exception:
            os.close(descriptor)
            raise
        slot[8:16] = self.slot_tag
        slot.path = path
        slot.descriptor = descriptor
        slot.shared = None
        return slot

    def _create_shared_slot(self, stem: str) -> _Hits:
        """A slot in a shared memory object, named in `<stem>.shm` first: a
        process killed before the object exists leaves a name the reader
        finds nothing under, never an object nothing names. macOS allows
        31 bytes of name."""
        name = "/scv%x.%s.%d" % (os.getpid(), self.shared_token, self.next_slot)
        path = stem + SHARED_SLOT_SUFFIX
        descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        try:
            # The size too: macOS rounds a shared memory object up to a page.
            os.write(descriptor, b"%s %d" % (name.encode("ascii"), self.slot_bytes))
        finally:
            os.close(descriptor)
        descriptor = _posixshmem.shm_open(name, os.O_RDWR | os.O_CREAT | os.O_EXCL, 0o600)
        try:
            os.ftruncate(descriptor, self.slot_bytes)
            slot = _Hits(descriptor, self.slot_bytes, access=mmap.ACCESS_WRITE)
        except Exception:
            os.close(descriptor)
            _posixshmem.shm_unlink(name)
            raise
        slot[8:16] = self.slot_tag
        slot.path = path
        slot.descriptor = descriptor
        slot.shared = name
        return slot

    def _sink(self, context: int) -> _Sink:
        sink = _Sink(self.slot_bytes)
        sink.context = context
        sink.states = [None] * len(self.probe_decisions)
        return sink

    def _new_hits(self, context: int):
        return _LazyHits(self, context)

    def _allocate_hits(self, context: int):
        if self.closed:
            return self._sink(context)
        try:
            slot = self.free_slots.pop() if self.free_slots else self._create_slot()
        except Exception as error:  # noqa: BLE001 - measurement must never break the run
            self.limitation(
                "python-slot-unavailable",
                f"could not map a slot for a test phase ({error!r}); what it executed was not observed",
            )
            return self._sink(context)
        slot.context = context
        slot.states = [None] * len(self.probe_decisions)
        slot[0:8] = context.to_bytes(8, "little")
        self.live_slots.append(slot)
        return slot

    @staticmethod
    def _holders(items: list, index: int) -> int:
        return sys.getrefcount(items[index])

    def _reclaim(self) -> None:
        """Free every slot nothing but this list holds any more -- no
        context, thread or suspended task -- after reading what was written
        into it since its last harvest."""
        live = self.live_slots
        index = 0
        while index < len(live):
            if self._holders(live, index) <= self.free_refs:
                slot = live.pop(index)
                self._harvest(slot)
                self.free_slots.append(slot)
            else:
                index += 1

    def _after_fork_in_child(self) -> None:
        # The inherited slots are the parent's pages: harvesting or reusing
        # them here would clear or overwrite what the parent observed. The
        # child starts its own transport and gives the forking context a slot
        # of its own. A lock some other parent thread held cannot be released
        # in a child that has no such thread.
        self.lock = _thread.RLock()
        self.live_slots = []
        self.free_slots = []
        if self.closed or self.hits_var is None:
            return
        current = self.hits_var.get()
        # A fresh Context() in the child also needs a child-owned default,
        # even if the parent's background reservation was already resolved.
        self.background_hits.resolved = None
        try:
            self.hits_var.set(self._new_hits(current.context))
        except Exception:  # noqa: BLE001 - never break the child
            pass

    def _harvest(self, slot: _Hits) -> None:
        """Hand what a slot holds to the transport, clearing it as it goes.

        A record names the slot's set bytes as runs -- first byte, length --
        and the reader turns each byte into its obligation or vector through
        the layout, exactly as it reads a slot a killed process left behind.
        `find` walks the slot in C, a run at a time: the statements of a
        block set neighbouring bytes, so a phase's hundreds of hits are a few
        dozen runs, and nothing here is paid per hit.

        A run is cleared by one slice store. Every byte in it was set when
        its end was found, and only a harvest ever writes a zero, so a probe
        storing into the run meanwhile stores what the run already recorded.
        """
        if STUB == "harvest":
            return
        began = time.perf_counter() if TIMING else 0.0
        find = slot.find
        if find(b"\x01", self.slot_header) == -1:
            return
        zeros = self.slot_zeros
        end = self.slot_bytes
        runs: list = []
        with self.lock:
            index = find(b"\x01", self.slot_header)
            while index != -1:
                stop = find(b"\x00", index)
                if stop == -1:
                    stop = end
                slot[index:stop] = zeros[: stop - index]
                runs.append(index)
                runs.append(stop - index)
                index = find(b"\x01", stop)
            if runs and not self.closed:
                self._ensure_process_output()
                prefix = b'{"ctx":%d,"r":[' % slot.context
                for start in range(0, len(runs), HARVEST_CHUNK):
                    self._write_payload(
                        prefix + ",".join(map(str, runs[start : start + HARVEST_CHUNK])).encode("ascii") + b'],"t":"runs"}'
                    )
        if TIMING:
            _timing["harvest"][0] += 1
            _timing["harvest"][1] += time.perf_counter() - began

    # -- what the probes call -------------------------------------------------

    def _value_probe(self, k: int, value):
        """A lambda's entry: record and hand the value back unchanged."""
        self.hits_var.get()[k] = 1
        return value

    def _single_probe(self, start: int, value) -> bool:
        """A one-condition decision: its truth is its vector, one byte each."""
        truth = not not value
        self.hits_var.get()[start + truth] = 1
        return truth

    def _condition_probe(self, d: int, index: int, value, inverted: bool) -> bool:
        """One condition of a multi-condition decision: record its truth.

        Returns the operand's truth rather than the value: inside a decision
        only the truth is used, so the interpreter's own test runs on this
        bool and an object's `__bool__` is consulted exactly once, by us. The
        recorded value is the condition as written, `not` included; the
        source's own `not` then applies to what is returned, once.
        """
        truth = not not value
        states = self.hits_var.get().states
        state = states[d]
        if state is None:
            state = states[d] = _DecisionState()
        # Conditions arrive in index order within one evaluation; an index at
        # or before the last one seen is a nested evaluation of the decision.
        if index <= state.last:
            state.saved.append((state.mask, state.last))
            state.mask = 0
        state.last = index
        state.mask += (2 if truth != inverted else 1) * self.pow3[index]
        return truth

    def _decision_probe(self, d: int, value) -> bool:
        """A multi-condition decision's test evaluated: its vector is a byte."""
        outcome = not not value
        hits = self.hits_var.get()
        state = hits.states[d]
        if state is None:
            return outcome
        mask = state.mask
        if state.saved:
            state.mask, state.last = state.saved.pop()
        else:
            state.mask = 0
            state.last = -1
        start = self.regions[d]
        if start >= 0:
            hits[start + 2 * mask + outcome] = 1
        else:
            self._wide_vector(hits.context, d, mask, outcome)
        return outcome

    def _operand_probe(self, g: int, index: int, value):
        """A standalone BoolOp's right operand was evaluated."""
        key = (self.context.get(), g)
        stack = self.probe_open_boolops.get(key)
        if stack is None:
            stack = self.probe_open_boolops[key] = []
        if not stack or index <= stack[-1][-1]:
            if len(stack) >= MAX_OPEN_EVALUATIONS:
                del stack[0]
            stack.append([0])
        stack[-1].append(index)
        return value

    def _boolop_probe(self, g: int, value):
        """A standalone BoolOp finished: operands not evaluated short-circuited."""
        context = self.context.get()
        stack = self.probe_open_boolops.get((context, g))
        evaluated = set(stack.pop()) if stack else {0}
        for logical in self.probe_boolops[g]:
            operand = logical["operand"]
            self._hit(context, logical["evaluated"] if operand in evaluated else logical["shortCircuit"])
        return value

    def _iter_probe(self, entered: int, zero: int, iterable):
        """A comprehension's loop: `entered` on the first item, `zero` on an
        empty exhaustion, per evaluation. The rest of the iteration runs in C.

        The array is fetched where it is stored, never held in a local: an
        iterable that raises leaves this frame in a traceback, and a frame
        holding a slot pins it until the cycle collector runs.
        """
        iterator = iter(iterable)
        try:
            first = next(iterator)
        except StopIteration:
            self.hits_var.get()[zero] = 1
            return iter(())
        self.hits_var.get()[entered] = 1
        return itertools.chain((first,), iterator)

    async def _aiter_probe(self, entered: int, zero: int, iterable):
        iterator = iterable.__aiter__()
        try:
            first = await iterator.__anext__()
        except StopAsyncIteration:
            self.hits_var.get()[zero] = 1
            return
        self.hits_var.get()[entered] = 1
        yield first
        async for item in iterator:
            yield item

    def _site_probe(self, file: str, line: int) -> None:
        # A site probe names its file project-relative already. Once a
        # context has passed a site, both calls below are no-ops for it, and
        # a test asserting in a loop passes the same site thousands of times.
        key = (self.context.get(), file, line)
        if key in self.probed_sites:
            return
        self.assertion_site(file, line)
        self.assertion()
        self.probed_sites.add(key)

    # -- installation ---------------------------------------------------------

    def _detect_unprobed(self, code, offset):
        """PY_START as a detector only: a planned file's code object the probe
        loader did not produce reached the interpreter another way. Every
        code object fires once and is then disabled."""
        probing = self.probing
        if probing is not None and id(code) not in probing.code_objects:
            relative = self._relative_path(code.co_filename)
            if relative is not None and relative in self.probe_files:
                self.limitation(
                    "python-probes-unobserved-module",
                    "measured code reached the interpreter by a path the import hook did not see, so its execution was not observed",
                    relative,
                )
        return _monitoring.DISABLE

    def _install_probes(self) -> None:
        import supercov_probes

        self.probing = supercov_probes.install(
            self.probe_files,
            self._relative_path,
            os.path.join(self.root, ".supercov", "cache", "python"),
            {
                "hits_get": self.hits_var.get,
                "value_probe": self._value_probe,
                "condition_probe": self._condition_probe,
                "decision_probe": self._decision_probe,
                "single_probe": self._single_probe,
                "operand_probe": self._operand_probe,
                "boolop_probe": self._boolop_probe,
                "iter_probe": self._iter_probe,
                "aiter_probe": self._aiter_probe,
                "site_probe": self._site_probe,
                "limitation": self.limitation,
            },
            self.probe_sites,
        )
        if _monitoring is not None and STUB != "detector":
            # The detector (3.12+): one PY_START per code object, then off.
            for candidate in (3, 4, 1):
                if _monitoring.get_tool(candidate) is None:
                    _monitoring.use_tool_id(candidate, "supercov")
                    self.tool_id = candidate
                    break
            if self.tool_id is not None:
                _monitoring.register_callback(self.tool_id, _monitoring.events.PY_START, self._detect_unprobed)
                self.registered_events = (_monitoring.events.PY_START,)
                _monitoring.set_events(self.tool_id, _monitoring.events.PY_START)

    def install(self) -> None:
        with self.lock:
            if self.output is not None:
                return
            self._open_output()
            self._write_layout()
            # A background reservation is the default, so even a fresh context
            # can allocate its slot on the first measured hit.
            self.background_hits = self._new_hits(0)
            self.hits_var = contextvars.ContextVar("supercov_hits", default=self.background_hits)
        self._install_probes()
        # A measured module imported before this point -- by a `.pth` file,
        # say -- ran without probes and will not be imported again. Named on
        # every interpreter, where the detector covers 3.12+ only for code
        # compiled past the import system later.
        for module in list(sys.modules.values()):
            filename = getattr(module, "__file__", None)
            relative = self._relative_path(filename) if isinstance(filename, str) else None
            if relative is not None and relative in self.probe_files:
                self.limitation(
                    "python-probes-unobserved-module",
                    "measured code was imported before Supercov installed, so its execution was not observed",
                    relative,
                )
        # CPython compiles an entry script in C, bypassing both the import
        # loader and builtins.compile. Detect this on 3.9–3.11 too, where
        # sys.monitoring cannot report the missed code object later.
        entry = sys.argv[0] if sys.argv else ""
        if entry and not entry.startswith("-"):
            relative = self._relative_path(entry)
            if relative is not None and relative in self.probe_files:
                self.limitation(
                    "python-probes-unobserved-module",
                    "a test ran this file as a script (python path/to/script.py), which CPython compiles "
                    "outside the import system, so what that run executed was not observed; lines shown "
                    "uncovered may have run there",
                    relative,
                )
        if hasattr(os, "register_at_fork"):
            os.register_at_fork(after_in_child=self._after_fork_in_child)
        inherited = os.environ.get(CONTEXT_ENV)
        if inherited:
            try:
                self.switch(_json_load(inherited))
            except (ValueError, KeyError, TypeError):
                self.limitation("python-inherited-context-invalid", "SUPERCOV_CONTEXT was not a valid Supercov identity")
        atexit.register(self.close)
        _install_propagation(self)
        def install_unittest(module):
            try:
                import supercov_unittest

                supercov_unittest.install(self)
            except Exception as error:  # noqa: BLE001 - the adapter must never break the interpreter
                self.limitation("python-unittest-adapter-unavailable", f"unittest adapter failed to install: {error!r}")

        self.probing.after_import("unittest", install_unittest)

    def _stop_observing(self) -> None:
        # The detector's global event off and its callback withdrawn: nothing
        # is worth reporting about code first run during shutdown.
        if self.tool_id is None:
            return
        try:
            _monitoring.set_events(self.tool_id, 0)
            for event in self.registered_events:
                _monitoring.register_callback(self.tool_id, event, None)
        except Exception:  # noqa: BLE001 - shutdown must never raise into the interpreter
            pass

    def close(self) -> None:
        with self.lock:
            if self.closed:
                return
            self._stop_observing()
            for slot in self.live_slots:
                self._harvest(slot)
            # The exit marker is the transport's last record, so it is written
            # while the transport is open -- before `closed` turns every later
            # record away, this one included.
            self._record({"t": "exit", "at": _now_ms()})
            self.closed = True
            self._close_output()
            slots = self.live_slots + self.free_slots
            self.live_slots = []
            self.free_slots = []
            unmatched = self.worker == "main" and bool(self.path_cache) and not self.under_root
        for slot in slots:
            # Everything a slot held is in the transport now. A daemon thread
            # can still write into it after this point, so it stays mapped,
            # and a zeroed layout tag tells the reader not to count what it
            # finds. The file stays too: a process that outlives the test
            # command -- multiprocessing's resource tracker -- closes while the
            # reader is listing the evidence, and a slot removed between the
            # listing and the read failed the whole run.
            try:
                slot[8:16] = b"\0" * 8
                os.close(slot.descriptor)
                if slot.shared is not None:
                    # Everything it held is in the transport; the kernel frees
                    # it once the mapping goes too.
                    _posixshmem.shm_unlink(slot.shared)
            except (OSError, ValueError):
                pass
        if unmatched and TIMING:
            # Every file the interpreter imported lay outside the measured
            # tree. That is what a run reports as zero coverage without a word
            # of explanation -- on Windows the root once carried a `\\?\`
            # prefix its files did not -- so name the root and one file that
            # missed it. This is diagnostic output only: a healthy child may
            # deliberately run nothing but stdlib code, and its stderr is
            # part of the program's observable behavior.
            sample = next(
                (name for name in self.path_cache if not name.startswith("<")),
                next(iter(self.path_cache)),
            )
            sys.stderr.write(
                f"[supercov] none of the {len(self.path_cache)} imported files lay under "
                f"the measured root {self.root}; for example {sample}\n"
            )
        if TIMING:
            sys.stderr.write(
                "[supercov:timing] "
                + " ".join(f"{name}={count} calls/{seconds * 1000:.0f}ms" for name, (count, seconds) in _timing.items())
                + f" slots={self.next_slot}\n"
            )


# -- causal context propagation ----------------------------------------------


def _install_propagation(runtime: Runtime) -> None:
    def install_threading(threading):
        if getattr(threading.Thread, "_supercov_patched", False):
            return
        original_start = threading.Thread.start

        def start_with_context(thread, *args, **kwargs):
            if not hasattr(thread, "_supercov_original_run"):
                context = contextvars.copy_context()
                original_run = thread.run
                thread._supercov_original_run = original_run

                def run_with_context():
                    try:
                        return context.run(original_run)
                    finally:
                        # The thread holds this function and this function
                        # the thread: a cycle only the collector would free,
                        # keeping the context -- and the test phase's slot --
                        # alive long after the thread ended.
                        thread.__dict__.pop("run", None)
                        thread.__dict__.pop("_supercov_original_run", None)

                thread.run = run_with_context
            return original_start(thread, *args, **kwargs)

        threading.Thread.start = start_with_context
        threading.Thread._supercov_patched = True

    def install_executor(module):
        executor_type = module.ThreadPoolExecutor
        if getattr(executor_type, "_supercov_patched", False):
            return
        original_submit = executor_type.submit

        def submit_with_context(executor, function, /, *args, **kwargs):
            context = contextvars.copy_context()
            return original_submit(executor, context.run, function, *args, **kwargs)

        executor_type.submit = submit_with_context
        executor_type._supercov_patched = True

    def install_subprocess(module):
        if getattr(module.Popen, "_supercov_patched", False):
            return
        original_init = module.Popen.__init__

        def init_with_context(process, *args, **kwargs):
            additions = runtime.child_environment()
            if additions:
                # env is Popen's eleventh positional parameter on every
                # supported CPython. Preserve that calling convention too.
                supplied = args[10] if len(args) > 10 else kwargs.get("env")
                environment = dict(os.environ if supplied is None else supplied)
                # An explicitly isolated environment cannot load this run's
                # observer. Do not add a stray context variable to it: callers
                # use env= to define exactly what their child receives.
                text_plan = environment.get(PLAN_ENV)
                bytes_plan = environment.get(PLAN_ENV.encode())
                if text_plan or bytes_plan:
                    for key, value in additions.items():
                        environment.pop(key, None)
                        environment.pop(key.encode(), None)
                        if bytes_plan and not text_plan:
                            environment[key.encode()] = value.encode()
                        else:
                            environment[key] = value
                    if len(args) > 10:
                        args = (*args[:10], environment, *args[11:])
                    else:
                        kwargs["env"] = environment
            original_init(process, *args, **kwargs)

        module.Popen.__init__ = init_with_context
        module.Popen._supercov_patched = True

    def install_multiprocessing(module):
        process_type = module.BaseProcess
        if getattr(process_type, "_supercov_patched", False):
            return
        original_process_start = process_type.start
        environment_lock = _thread.allocate_lock()

        def process_start_with_context(process, *args, **kwargs):
            additions = runtime.child_environment()
            if not additions:
                return original_process_start(process, *args, **kwargs)
            with environment_lock:
                previous = {key: os.environ.get(key) for key in additions}
                os.environ.update(additions)
                try:
                    return original_process_start(process, *args, **kwargs)
                finally:
                    for key, value in previous.items():
                        if value is None:
                            os.environ.pop(key, None)
                        else:
                            os.environ[key] = value

        process_type.start = process_start_with_context
        process_type._supercov_patched = True

    # Patched when a program first imports it: most interpreters a suite
    # launches never start a thread, and importing threading here cost each
    # of them a millisecond.
    runtime.probing.after_import("threading", install_threading)
    runtime.probing.after_import("concurrent.futures.thread", install_executor)
    runtime.probing.after_import("subprocess", install_subprocess)
    runtime.probing.after_import("multiprocessing.process", install_multiprocessing)


# -- module-level singleton --------------------------------------------------

_RUNTIME: Runtime | None = None
_INSTALL_ERROR: str | None = None


def runtime() -> Runtime | None:
    return _RUNTIME


def install() -> Runtime | None:
    global _RUNTIME, _INSTALL_ERROR
    if _RUNTIME is not None or _INSTALL_ERROR is not None:
        return _RUNTIME
    plan_path = os.environ.get(PLAN_ENV)
    evidence_dir = os.environ.get(EVIDENCE_DIR_ENV)
    run_id = os.environ.get(RUN_ID_ENV)
    if not plan_path or not evidence_dir or not run_id:
        return None
    if sys.version_info < (3, 9):
        _INSTALL_ERROR = f"Supercov requires CPython 3.9 or newer, found {sys.version.split()[0]}"
        sys.stderr.write(f"[supercov] {_INSTALL_ERROR}\n")
        return None
    try:
        instance = Runtime(plan_path, evidence_dir, run_id, os.environ.get(WORKER_ENV, "main"))
        instance.install()
    except Exception as error:  # noqa: BLE001 - never break the user's interpreter
        _INSTALL_ERROR = repr(error)
        sys.stderr.write(f"[supercov] Python runtime disabled: {_INSTALL_ERROR}\n")
        return None
    _RUNTIME = instance
    return instance
