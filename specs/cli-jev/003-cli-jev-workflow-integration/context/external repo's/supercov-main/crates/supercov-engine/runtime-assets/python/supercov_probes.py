"""Import-time probes for the Supercov Python frontend.

The Rust plan names every obligation in a measured file with a stable id and
a byte-exact span. This module turns that plan into probes at import time:
the source is parsed, a probe node is inserted before each planned
statement with the statement's own line number, and the modified tree is
compiled under the file's real name. Nothing on disk changes, every line
number a traceback shows is the file's own, and a probe is a store into the
current context's hit array -- specialised bytecode, not a callback.

Import and compilation hooks cover these entry paths:

- `ProbeFinder` sits first on `sys.meta_path`, asks the other finders where
  a module lives, and replaces the loader for a planned file. Path
  resolution is never reimplemented, so editable installs, zip imports,
  namespace packages, `importlib.reload` and lazy loaders behave as they do
  without Supercov.
- `builtins.compile` is wrapped: `runpy.run_path`, `spec_from_file_location`
  and a hand-rolled `exec(compile(open(p).read(), p, "exec"))` all reach it
  with the real filename (verified 2026-09-22), and get probed there.

The main script of `python script.py` is compiled in C and reaches neither.
A test may launch a planned file this way as a child. The runtime declares
that file unmeasured instead of silently changing the child command; a
`python -m package.module` entry passes through the loader and is measured.

Stdlib only, CPython 3.9 or newer.
"""

from __future__ import annotations

import __future__
# `collections.abc` is this module re-exported, and importing it imports the
# `collections` package: a start-up cost to every measured interpreter.
from _collections_abc import Callable, Mapping, Sequence
import builtins
import contextvars
import importlib.machinery
import marshal
import operator
import os
import sys
import zlib
from types import CodeType


def _sha256(data: bytes):
    """SHA-256 from CPython's own C implementation, loaded when first used.

    `hashlib` loads OpenSSL, a millisecond and a half of every measured
    interpreter's start-up; an interpreter that only loads cached plans and
    never imports a measured module needs no hash at all.
    """
    global _sha256
    try:
        if sys.version_info >= (3, 12):
            from _sha2 import sha256
        else:
            from _sha256 import sha256
    except ImportError:  # pragma: no cover - a build without its own hashes
        from hashlib import sha256
    _sha256 = sha256
    return sha256(data)

PROBE_VERSION = 7
# A context's hit array is a slot file mapped into memory. Its first bytes
# name the context for the reader, so obligations are numbered from here.
SLOT_HEADER = 16
# A multi-condition decision up to this wide has a region in the slot indexed
# by its evaluation mask, so a vector is a byte store like any hit; wider ones
# are reported through the runtime instead.
MAX_REGION_WIDTH = 6

# Bound by the runtime at install: the callables the probes reach through the
# alias each instrumented module imports from here. Kept as module attributes
# so `from supercov_probes import hits_get as <alias>` works in any namespace
# a planned file is executed in, not only ones the loader controls.
class _InactiveHits:
    def __setitem__(self, index, value):
        pass


_inactive_hits = _InactiveHits()
hits_get: Callable[[], object] = lambda: _inactive_hits  # noqa: E731 - replaced at install
value_probe: Callable[[int, object], object] = lambda k, value: value  # noqa: E731
condition_probe: Callable[[int, int, object, bool], bool] = lambda d, i, value, inv: bool(value)  # noqa: E731
decision_probe: Callable[[int, object], bool] = lambda d, value: bool(value)  # noqa: E731
single_probe: Callable[[int, object], bool] = lambda k, value: bool(value)  # noqa: E731
operand_probe: Callable[[int, int, object], object] = lambda g, i, value: value  # noqa: E731
boolop_probe: Callable[[int, object], object] = lambda g, value: value  # noqa: E731
iter_probe: Callable[[int, int, object], object] = lambda entered, zero, iterable: iterable  # noqa: E731
aiter_probe: Callable[[int, int, object], object] = lambda entered, zero, iterable: iterable  # noqa: E731
site_probe: Callable[[str, int], None] = lambda file, line: None  # noqa: E731


# -- the plan, indexed for probing -------------------------------------------


class FileProbes:
    """One planned file's obligations, numbered into the run's hit array.

    `base` is the file's first index in the array shared by every planned
    file of the run; `ids[k - base]` is obligation `k`'s id. Keys are
    `(lineno, col_offset)` as `ast` reports them, which for a decorated
    definition is the `def` line while the plan spans the first decorator --
    `_key` normalises the node to the plan's spelling.
    """

    def __init__(self, relative: str, file_plan: dict, base: int) -> None:
        self.relative = relative
        self.base = base
        self.ids: list[str] = []
        self.statements: dict[tuple[int, int], int] = {}
        self.functions: dict[tuple[int, int], int] = {}
        self.lambdas: dict[tuple[int, int, int, int], int] = {}
        # Decisions and their leaves by expression span; logical BoolOps
        # outside any decision tree by span, with their operand plans. Run-wide
        # indexes are assigned by `index_plan`, which owns the counters.
        self.decisions: dict[tuple[int, int, int, int], int] = {}
        self.leaves: dict[tuple[int, int, int, int], tuple[int, int, bool]] = {}
        self.boolops: dict[tuple[int, int, int, int], int] = {}
        self.decision_plans: list = []
        self.boolop_groups: list = []
        # Loops by the iterable's span: (entered k, zero k). Tries by their
        # body's first statement: (success k, [(selected k, missed k, bare)],
        # raised k). Matches by the statement's span: ([(selected k, missed k,
        # irrefutable)], (matched k, unmatched k) or None).
        self.loops: dict[tuple[int, int, int, int], tuple[int, int]] = {}
        self.tries: dict[tuple[int, int], tuple[int, list, int]] = {}
        self.matches: dict[tuple[int, int], tuple[list, tuple | None]] = {}
        # Heads: the statement whose execution implies a structural
        # obligation -- a function's entry, a loop's `entered`, a one-condition
        # test's outcome -- and whose probe the transform lets stand for it.
        statement_numbers: dict[str, int] = {}
        self.entry_heads: dict[int, int] = {}
        self.loop_heads: dict[int, int] = {}
        for statement in file_plan.get("statements", ()):
            k = self._number(statement["id"])
            self.statements[(statement["start"][0], statement["start"][1])] = k
            statement_numbers[statement["id"]] = k
        for function in file_plan.get("functions", ()):
            (line, column), (end_line, end_column) = function["span"]
            k = self._number(function["id"])
            if function["name"] == "<lambda>":
                self.lambdas[(line, column, end_line, end_column)] = k
            else:
                self.functions[(line, column)] = k
                head = statement_numbers.get(function.get("first"))
                if head is not None:
                    self.entry_heads[k] = head
        for loop in file_plan.get("loops", ()):
            (line, column), (end_line, end_column) = loop["iter"]
            entered = self._number(loop["entered"])
            self.loops[(line, column, end_line, end_column)] = (entered, self._number(loop["zero"]))
            head = statement_numbers.get(loop.get("first"))
            if head is not None:
                self.loop_heads[entered] = head
        for try_plan in file_plan.get("tries", ()):
            (line, column), _ = try_plan["body"]
            handlers = [
                (self._number(h["selected"]), self._number(h["missed"]), h["bare"])
                for h in try_plan["handlers"]
            ]
            self.tries[(line, column)] = (
                self._number(try_plan["success"]),
                handlers,
                self._number(try_plan["raised"]),
                try_plan.get("finalbody") is not None,
            )
        for match in file_plan.get("matches", ()):
            (line, column), _ = match["span"]
            cases = [
                (self._number(c["selected"]), self._number(c["missed"]), c["irrefutable"])
                for c in match["cases"]
            ]
            no_case = match.get("noCase")
            self.matches[(line, column)] = (
                cases,
                None if no_case is None else (self._number(no_case["matched"]), self._number(no_case["unmatched"])),
            )
        logical_by_decision: dict[str, list] = {}
        standalone: dict[tuple[int, int, int, int], list] = {}
        for logical in file_plan.get("logical", ()):
            if logical.get("decision") is not None:
                logical_by_decision.setdefault(logical["decision"], []).append(logical)
            else:
                (line, column), (end_line, end_column) = logical["boolop"]
                standalone.setdefault((line, column, end_line, end_column), []).append(logical)
        heads_by_decision: dict[int, tuple] = {}
        for decision in file_plan.get("decisions", ()):
            (line, column), (end_line, end_column) = decision["span"]
            d = len(self.decision_plans)
            self.decision_plans.append((decision, logical_by_decision.get(decision["id"], [])))
            self.decisions[(line, column, end_line, end_column)] = d
            heads_by_decision[d] = (
                statement_numbers.get(decision.get("whenTrue")),
                statement_numbers.get(decision.get("whenFalse")),
            )
            for index, condition in enumerate(decision["conditions"]):
                (line, column), (end_line, end_column) = condition["span"]
                self.leaves[(line, column, end_line, end_column)] = (d, index, condition["not"] % 2 == 1)
        for span, plans in standalone.items():
            g = len(self.boolop_groups)
            plans.sort(key=lambda logical: logical["operand"])
            self.boolop_groups.append(plans)
            self.boolops[span] = g
        # A decision with one condition needs no evaluation state: its
        # outcome is its vector. Two bytes of its region, one per truth,
        # that the harvest turns into the vector and the outcome hit. The
        # region's place in the slot is assigned by `index_plan`.
        self.singles: dict[tuple[int, int, int, int], int] = {}
        # (true head, false head) by a one-condition test's span.
        self.single_heads: dict[tuple[int, int, int, int], tuple] = {}
        for span, d in list(self.decisions.items()):
            if len(self.decision_plans[d][0]["conditions"]) == 1:
                self.singles[span] = d
                self.single_heads[span] = heads_by_decision[d]
                del self.decisions[span]
                leaf = next(key for key, (dd, i, inv) in self.leaves.items() if dd == d)
                del self.leaves[leaf]
        self.digest = ""

    def _number(self, identifier: str) -> int:
        self.ids.append(identifier)
        return self.base + len(self.ids) - 1

    def _finish(self) -> None:
        """The digest of everything the probes bake into bytecode: a cached
        module is reused only for an identical numbering."""
        self.digest = _sha256(
            repr(
                (
                    PROBE_VERSION,
                    self.relative,
                    self.base,
                    self.ids,
                    sorted(self.decisions.items()),
                    sorted(self.singles.items()),
                    sorted(self.leaves.items()),
                    sorted(self.boolops.items()),
                    sorted(self.entry_heads.items()),
                    sorted(self.loop_heads.items()),
                    sorted(self.single_heads.items()),
                )
            ).encode("utf-8")
        ).hexdigest()

    @property
    def count(self) -> int:
        return len(self.ids)


class SiteProbes:
    """A test file: not measured, but its assertion sites are recorded.

    The plan names the lines holding an inventoried `assert`; a site probe
    goes before the first statement on each of those lines -- which, once
    pytest has rewritten the assert, is the rewrite's first statement.
    """

    def __init__(self, relative: str, lines) -> None:
        self.relative = relative
        self.lines = frozenset(lines)
        self.digest = _sha256(repr((PROBE_VERSION, "sites", relative, sorted(self.lines))).encode()).hexdigest()


class PlanIndex:
    """Every planned file's obligations numbered into one slot layout.

    A slot is one context's bytes: `SLOT_HEADER` bytes naming the context,
    one byte per obligation (`ids[k - SLOT_HEADER]` is obligation `k`), then
    a region per decision that has one -- two bytes for a single condition,
    indexed by its truth; `2 * 3 ** width` bytes up to `MAX_REGION_WIDTH`,
    indexed by `2 * mask + outcome`, where the mask holds one base-3 digit
    per condition: 0 not evaluated, 1 false, 2 true -- the digits a vector is
    written in. `regions[d]` is decision `d`'s first byte, or -1 when it is
    too wide for a region and is reported through the runtime instead.
    """

    def __init__(self, plan: dict) -> None:
        self.files: dict[str, FileProbes] = {}
        self.ids: list[str] = []
        # Run-wide: (decision plan, its logical plans) by decision index, and
        # a standalone BoolOp's operand plans by group index.
        self.decisions: list = []
        self.boolop_groups: list = []
        self.sites: dict[str, SiteProbes] = {
            relative: SiteProbes(relative, lines)
            for relative, lines in plan.get("assertionSites", {}).items()
            if relative not in plan["files"]
        }
        for relative, file_plan in plan["files"].items():
            probes = FileProbes(relative, file_plan, SLOT_HEADER + len(self.ids))
            self.files[relative] = probes
            self.ids.extend(probes.ids)
            decision_base = len(self.decisions)
            self.decisions.extend(probes.decision_plans)
            probes.decisions = {span: decision_base + d for span, d in probes.decisions.items()}
            probes.singles = {span: decision_base + d for span, d in probes.singles.items()}
            probes.leaves = {span: (decision_base + d, i, inv) for span, (d, i, inv) in probes.leaves.items()}
            group_base = len(self.boolop_groups)
            self.boolop_groups.extend(probes.boolop_groups)
            probes.boolops = {span: group_base + g for span, g in probes.boolops.items()}
        cursor = SLOT_HEADER + len(self.ids)
        self.regions: list[int] = []
        self.region_table: list[tuple[int, int, int]] = []
        self.max_width = 0
        for d, (decision, _) in enumerate(self.decisions):
            width = len(decision["conditions"])
            self.max_width = max(self.max_width, width)
            if width > MAX_REGION_WIDTH:
                self.regions.append(-1)
                continue
            self.regions.append(cursor)
            self.region_table.append((cursor, width, d))
            cursor += 2 if width == 1 else 2 * 3**width
        self.slot_bytes = cursor
        # Which bytes a byte stands for besides its own: a head's statement
        # implies the entry, `entered` or outcome it heads.
        implied: dict[int, list[int]] = {}
        for probes in self.files.values():
            probes.singles = {span: self.regions[d] for span, d in probes.singles.items()}
            for entry, head in probes.entry_heads.items():
                implied.setdefault(head, []).append(entry)
            for entered, head in probes.loop_heads.items():
                implied.setdefault(head, []).append(entered)
            for span, (when_true, when_false) in probes.single_heads.items():
                region = probes.singles[span]
                if region < 0:
                    continue
                if when_true is not None:
                    implied.setdefault(when_true, []).append(region + 1)
                if when_false is not None:
                    implied.setdefault(when_false, []).append(region)
            probes._finish()
        self.implied = sorted((head, sorted(bytes_)) for head, bytes_ in implied.items())
        self.digest = _sha256(
            repr((PROBE_VERSION, SLOT_HEADER, self.ids, self.region_table, self.implied)).encode("utf-8")
        ).hexdigest()

    def layout(self) -> dict:
        """What the reader needs to decode a slot a harvest never reached:
        the obligation at each byte, and each region's decision with what its
        vectors imply -- the outcome hit, and each logical operator's."""
        decisions = []
        for start, width, d in self.region_table:
            decision, logical = self.decisions[d]
            decisions.append(
                {
                    "start": start,
                    "width": width,
                    "id": decision["id"],
                    "outcomeTrue": decision["outcomeTrue"],
                    "outcomeFalse": decision["outcomeFalse"],
                    "logical": [
                        {
                            "evaluated": item["evaluated"],
                            "shortCircuit": item["shortCircuit"],
                            "previousLeaves": item["previousLeaves"],
                            "operandLeaves": item["operandLeaves"],
                        }
                        for item in logical
                    ],
                }
            )
        return {
            "version": PROBE_VERSION,
            "digest": self.digest,
            "header": SLOT_HEADER,
            "bytes": self.slot_bytes,
            "ids": list(self.ids),
            "decisions": decisions,
            "implied": [[head, list(bytes_)] for head, bytes_ in self.implied],
        }


def index_plan(plan: dict) -> PlanIndex:
    return PlanIndex(plan)


class _Records:
    """Read prepared records without retaining descriptors across fork/exec."""

    def __init__(self, path: str) -> None:
        self.path = path

    def read(self, location: tuple[int, int]):
        offset, size = location
        with open(self.path, "rb") as stream:
            stream.seek(offset)
            data = stream.read(size)
        if len(data) != size:
            raise EOFError("truncated prepared probe record")
        return marshal.loads(data)


class _ProbeFiles(Mapping):
    def __init__(self, records: _Records, offsets: dict) -> None:
        self.records, self.offsets, self.loaded = records, offsets, {}

    def __len__(self):
        return len(self.offsets)

    def __iter__(self):
        return iter(self.offsets)

    def __contains__(self, key):
        return key in self.offsets

    def __getitem__(self, key):
        if key not in self.loaded:
            probes = FileProbes.__new__(FileProbes)
            probes.__dict__.update(self.records.read(self.offsets[key]))
            self.loaded[key] = probes
        return self.loaded[key]


class _PlanItems(Sequence):
    def __init__(self, records: _Records, offsets: list, count: int, chunk: int) -> None:
        self.records, self.offsets, self.count, self.chunk, self.loaded = records, offsets, count, chunk, {}

    def __len__(self):
        return self.count

    def __getitem__(self, index):
        if isinstance(index, slice):
            return [self[i] for i in range(*index.indices(self.count))]
        if index < 0:
            index += self.count
        if not 0 <= index < self.count:
            raise IndexError(index)
        chunk, item = divmod(index, self.chunk)
        if chunk not in self.loaded:
            self.loaded[chunk] = self.records.read(self.offsets[chunk])
        return self.loaded[chunk][item]


def load_plan(path: str, version: int) -> tuple[str, PlanIndex]:
    """Prepare an immutable run plan once; children load only files they use.

    Each record is read in one bounded operation before decoding: marshal's
    file reader otherwise calls back into Python for thousands of tiny reads.
    Marshal holds data, never pickled objects. Publication is atomic, and an
    unwritable/missing cache simply falls back to preparing the JSON plan.
    The filename includes plan identity, interpreter and preparation version.
    """
    stat = os.stat(path)
    cache = f"{path}.{sys.implementation.cache_tag}-probes{PROBE_VERSION}-index4-{stat.st_mtime_ns}-{stat.st_size}"
    try:
        with open(cache, "rb") as stream:
            header_offset = int.from_bytes(stream.read(8), "little")
            stream.seek(header_offset)
            header = marshal.loads(stream.read())
        if header["version"] != version:
            raise ValueError("cached plan version")
        records = _Records(cache)
        index = PlanIndex.__new__(PlanIndex)
        index.__dict__.update(header["index"])
        index.files = _ProbeFiles(records, header["files"])
        for name, (offsets, count, chunk) in header["items"].items():
            setattr(index, name, _PlanItems(records, offsets, count, chunk))
        index.sites = {}
        for relative, attributes in header["sites"].items():
            sites = SiteProbes.__new__(SiteProbes)
            sites.__dict__.update(attributes)
            index.sites[relative] = sites
        return header["root"], index
    except (OSError, EOFError, ValueError, TypeError, KeyError):
        pass
    import json
    import tempfile
    with open(path, encoding="utf-8") as stream:
        plan = json.load(stream)
    if plan.get("version") != version:
        raise RuntimeError(f"unsupported Supercov Python plan version {plan.get('version')!r}")
    index = index_plan(plan)
    temporary = None
    try:
        descriptor, temporary = tempfile.mkstemp(dir=os.path.dirname(cache), suffix=".partial")
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(b"\0" * 8)
            files, items = {}, {}
            for relative, probes in index.files.items():
                start = stream.tell()
                marshal.dump(probes.__dict__, stream)
                files[relative] = (start, stream.tell() - start)
            # The region table is read only by the process that writes the
            # slot layout, once per run; every other one skips its bytes.
            for name, chunk in [("ids", 4096), ("decisions", 64), ("boolop_groups", 64), ("region_table", 1024), ("implied", 1024)]:
                values = getattr(index, name)
                offsets = []
                for start in range(0, len(values), chunk):
                    offset = stream.tell()
                    marshal.dump(values[start:start + chunk], stream)
                    offsets.append((offset, stream.tell() - offset))
                items[name] = (offsets, len(values), chunk)
            header_offset = stream.tell()
            marshal.dump({
                "version": version, "root": plan["root"], "files": files,
                "items": items,
                "sites": {key: value.__dict__ for key, value in index.sites.items()},
                "index": {key: value for key, value in index.__dict__.items() if key not in {"files", "sites", *items}},
            }, stream)
            stream.seek(0)
            stream.write(header_offset.to_bytes(8, "little"))
        # Publish only if absent. A lazy reader keeps offsets, not an open
        # descriptor: another interpreter must never replace its backing
        # file after the header was read. If a cache is damaged or the
        # filesystem cannot link, use the freshly prepared in-memory index.
        os.link(temporary, cache)
    except OSError:
        pass
    finally:
        if temporary is not None:
            try:
                os.unlink(temporary)
            except OSError:
                pass
    return plan["root"], index


# -- the transform ----------------------------------------------------------


PROBE_NAMES = {
    "hits_get": "h",
    "value_probe": "v",
    "condition_probe": "c",
    "decision_probe": "d",
    "single_probe": "d1",
    "operand_probe": "o",
    "boolop_probe": "b",
    "iter_probe": "i",
    "aiter_probe": "ai",
    "site_probe": "s",
}


def instrument(tree, probes, report=None):
    """Insert the plan's probes into a parsed module, in place; see `supercov_instrument`."""
    import supercov_instrument

    return supercov_instrument.instrument(tree, probes, report)


# -- compiling with a cache ---------------------------------------------------


class Probing:
    """The per-process state the finder, loader and compile wrapper share."""

    def __init__(
        self,
        files: dict[str, FileProbes],
        relative_for: Callable[[str], str | None],
        cache_directory: str | None,
        sites: dict[str, SiteProbes] | None = None,
    ) -> None:
        self.files = files
        self.sites = sites or {}
        self.relative_for = relative_for
        self.cache_directory = cache_directory
        self.code_objects: set[int] = set()
        self.import_callbacks: dict[str, Callable] = {}
        # The runtime's `limitation(identifier, reason, file, obligation)`, once installed.
        self.report: Callable[[str, str, str, str], None] = lambda identifier, reason, file, obligation: None

    def after_import(self, name: str, callback: Callable) -> None:
        """Install optional adapters only when their library is actually used."""
        def install_adapter(module):
            try:
                callback(module)
            except Exception as error:
                self.report(
                    "python-context-adapter-unavailable",
                    f"{name} adapter failed to install: {error!r}", None, None,
                )

        self.import_callbacks[name] = install_adapter
        module = sys.modules.get(name)
        if module is not None:
            install_adapter(module)

    def probes_for(self, filename: str | None) -> FileProbes | None:
        """A measured file's probes: what the finder swaps a loader for."""
        if not filename or filename.startswith("<"):
            return None
        relative = self.relative_for(filename)
        return None if relative is None else self.files.get(relative)

    def sites_for(self, filename: str | None) -> SiteProbes | None:
        """A test file's assertion sites: applied where the file is compiled,
        which pytest's rewriter does itself, so the finder leaves it alone."""
        if not filename or filename.startswith("<"):
            return None
        relative = self.relative_for(filename)
        return None if relative is None else self.sites.get(relative)

    def compile(self, source: bytes | str | ast.AST, filename: str, probes, *, flags: int = 0, optimize: int = -1):
        """Probed code for `source`, from the cache when it has been seen.

        The key includes the source type, filename, effective compiler flags,
        numbered obligations and interpreter tag. Cached code must preserve
        encoding, traceback filenames, futures and optimization semantics.
        """
        # -1 means this interpreter's optimization level, which can differ
        # between parent and child processes sharing the same cache.
        optimize = operator.index(optimize)
        if optimize == -1:
            optimize = sys.flags.optimize
        cached_path = None
        if self.cache_directory is not None and isinstance(source, (bytes, str)):
            text = source if isinstance(source, bytes) else source.encode("utf-8")
            # Named for what compiles it -- file, numbering, interpreter,
            # flags -- and holding that and the source it was compiled from,
            # both compared exactly before the code is used. Hashing the
            # source instead loaded a SHA-256 module into every interpreter.
            identity = b"\0".join(
                [
                    b"bytes" if isinstance(source, bytes) else b"str",
                    filename.encode("utf-8", "surrogatepass"),
                    probes.digest.encode("ascii"),
                    sys.implementation.cache_tag.encode("ascii"),
                    str((flags, optimize)).encode("ascii"),
                ]
            )
            name = "%08x%08x-%d" % (zlib.crc32(identity), zlib.adler32(identity), len(identity))
            cached_path = os.path.join(self.cache_directory, f"{name}.pyc")
            try:
                with open(cached_path, "rb") as stream:
                    cached_identity, cached_text, code, limitations = marshal.loads(stream.read())
                if cached_identity != identity or cached_text != text:
                    raise ValueError("cached probes compiled from another source")
                if not isinstance(code, CodeType) or not isinstance(limitations, (tuple, list)):
                    raise ValueError("invalid compiled probe cache")
                if any(
                    not isinstance(item, (tuple, list)) or len(item) != 4
                    or any(not isinstance(value, str) for value in item)
                    for item in limitations
                ):
                    raise ValueError("invalid cached limitations")
                self._register(code)
                for limitation in limitations:
                    self.report(*limitation)
                return code
            except (OSError, EOFError, ValueError, TypeError):
                pass
        tree = source if _is_tree(source) else _original_compile(
            source, filename, "exec", flags | _PyCF_ONLY_AST, True, optimize
        )
        limitations = []
        instrument(tree, probes, lambda *item: limitations.append(item))
        # Importers supply their own future flags; never inherit this module's
        # annotations future. The compile wrapper resolves its caller's flags.
        code = _original_compile(tree, filename, "exec", flags, True, optimize)
        self._register(code)
        if cached_path is not None:
            self._store(cached_path, (identity, text, code, limitations))
        for limitation in limitations:
            self.report(*limitation)
        return code

    def _register(self, code) -> None:
        # Every code object the probed module owns, so a detector can tell a
        # probed function from one that reached the interpreter another way.
        self.code_objects.add(id(code))
        for constant in code.co_consts:
            if hasattr(constant, "co_code"):
                self._register(constant)

    def _store(self, path: str, payload) -> None:
        import tempfile

        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            descriptor, temporary = tempfile.mkstemp(dir=os.path.dirname(path), suffix=".tmp")
            with os.fdopen(descriptor, "wb") as stream:
                marshal.dump(payload, stream)
            os.replace(temporary, path)
        except OSError:
            pass


# -- import interception ------------------------------------------------------


class ProbeLoader:
    """A loader that compiles a planned file with its probes.

    Wraps the loader the real finder chose and delegates everything but the
    compile to it, so `get_source`, `get_data`, `is_package` and
    `get_filename` -- what `inspect`, `linecache`, `pkgutil` and `runpy` ask
    for -- answer as the original would.
    """

    def __init__(self, inner, probing: Probing, probes: FileProbes) -> None:
        self._inner = inner
        self._probing = probing
        self._probes = probes

    def __getattr__(self, name: str):
        return getattr(self._inner, name)

    def create_module(self, spec):
        create = getattr(self._inner, "create_module", None)
        return None if create is None else create(spec)

    def _source(self, filename: str) -> bytes:
        get_data = getattr(self._inner, "get_data", None)
        if get_data is not None:
            return get_data(filename)
        with open(filename, "rb") as stream:
            return stream.read()

    def get_code(self, fullname: str):
        filename = self._inner.get_filename(fullname)
        return self._probing.compile(self._source(filename), filename, self._probes)

    def exec_module(self, module) -> None:
        filename = module.__spec__.origin
        code = self._probing.compile(self._source(filename), filename, self._probes)
        exec(code, module.__dict__)


class AfterImportLoader:
    def __init__(self, inner, callback) -> None:
        self._inner = inner
        self._callback = callback

    def __getattr__(self, name):
        return getattr(self._inner, name)

    def create_module(self, spec):
        create = getattr(self._inner, "create_module", None)
        return None if create is None else create(spec)

    def exec_module(self, module):
        self._inner.exec_module(module)
        self._callback(module)


class ProbeFinder:
    """First on `sys.meta_path`: the other finders locate, this one probes."""

    def __init__(self, probing: Probing) -> None:
        self._probing = probing

    def find_spec(self, fullname, path, target=None):
        for finder in sys.meta_path:
            if isinstance(finder, ProbeFinder):
                continue
            find = getattr(finder, "find_spec", None)
            if find is None:
                continue
            spec = find(fullname, path, target)
            if spec is None:
                continue
            probes = self._probing.probes_for(spec.origin)
            if probes is not None and spec.loader is not None:
                spec.loader = ProbeLoader(spec.loader, self._probing, probes)
                # Bytecode lives in Supercov's cache, never the project's.
                spec.cached = None
            callback = self._probing.import_callbacks.get(fullname)
            if callback is not None and spec.loader is not None:
                spec.loader = AfterImportLoader(spec.loader, callback)
            return spec
        return None

    def invalidate_caches(self) -> None:
        pass


# `ast.PyCF_ONLY_AST`, the same on every CPython: importing `_ast` builds every
# node class, which an interpreter that compiles nothing does not need.
_PyCF_ONLY_AST = 0x400


def _is_tree(source) -> bool:
    """Whether `source` is a parsed tree: only a program that imported
    `_ast` can hold one."""
    module = sys.modules.get("_ast")
    return module is not None and isinstance(source, module.AST)


_FUTURE_FLAGS = 0
for _feature in __future__.all_feature_names:
    _FUTURE_FLAGS |= getattr(__future__, _feature).compiler_flag

_original_compile = builtins.compile
_probing: Probing | None = None
_plain_compilation = contextvars.ContextVar("supercov_plain_compilation", default=False)
_original_py_compile = None
_plain_process = False
_original_loader_code = importlib.machinery.SourceFileLoader.get_code
_original_abc_loader_code = None


def _compile_plain_cache(*args, **kwargs):
    # py_compile (including compileall) produces portable, ordinary bytecode,
    # even when an explicit cfile bypasses Python's normal cache location.
    token = _plain_compilation.set(True)
    try:
        return _original_py_compile(*args, **kwargs)
    finally:
        _plain_compilation.reset(token)


def _install_py_compile(module):
    global _original_py_compile
    if module.compile is not _compile_plain_cache:
        _original_py_compile = module.compile
        module.compile = _compile_plain_cache


def _plain() -> bool:
    return _plain_process or _plain_compilation.get()


def _compiles_bytecode_only() -> bool:
    """`python -m py_compile` runs py_compile as `__main__`, so the patch that
    keeps its bytecode plain, applied when the module is imported by name,
    never goes in: the probed code it compiled was written to the ordinary
    cache. Such a process runs no measured code, so it compiles plainly. The
    command line is known from Python 3.10 on."""
    arguments = getattr(sys, "orig_argv", None) or []
    for index, argument in enumerate(arguments[:-1]):
        if argument == "-m":
            return arguments[index + 1] == "py_compile"
    return False


def _loader_code(loader, fullname, original):
    filename = loader.get_filename(fullname)
    probes = None if _probing is None else _probing.probes_for(filename) or _probing.sites_for(filename)
    if probes is not None and not _plain():
        # Explicit SourceFileLoader/spec_from_file_location bypasses our
        # finder. Never read or write ordinary .pyc files for these imports.
        return _probing.compile(loader.get_data(filename), filename, probes)
    return original(loader, fullname)


def _file_loader_code(loader, fullname):
    return _loader_code(loader, fullname, _original_loader_code)


def _abc_loader_code(loader, fullname):
    return _loader_code(loader, fullname, _original_abc_loader_code)


def _install_abc_loader(module):
    global _original_abc_loader_code
    # The finder protocol does not require importing the ABC and its resource
    # machinery in every helper process. Preserve isinstance checks once used.
    module.MetaPathFinder.register(ProbeFinder)
    if module.SourceLoader.get_code is not _abc_loader_code:
        _original_abc_loader_code = module.SourceLoader.get_code
        module.SourceLoader.get_code = _abc_loader_code


def _compile_probed(source, filename, mode, flags=0, dont_inherit=False, optimize=-1, **keywords):
    # builtin compile inherits from its immediate caller. Our wrapper must
    # explicitly carry that caller's futures across the extra Python frame.
    flags = operator.index(flags)
    if not operator.index(dont_inherit):
        flags |= sys._getframe(1).f_code.co_flags & _FUTURE_FLAGS
    if (
        _probing is not None
        and not _plain()
        and mode == "exec"
        and not (flags & _PyCF_ONLY_AST)
        and not keywords
    ):
        name = filename if isinstance(filename, str) else None
        probes = _probing.probes_for(name) or _probing.sites_for(name)
        if probes is not None:
            return _probing.compile(
                source, filename, probes, flags=flags, optimize=optimize
            )
    return _original_compile(source, filename, mode, flags, True, optimize, **keywords)


def install(
    files: dict[str, FileProbes],
    relative_for: Callable[[str], str | None],
    cache_directory: str | None,
    entry_points: dict[str, Callable],
    sites: dict[str, SiteProbes] | None = None,
) -> Probing:
    """Arm the finder and the compile wrapper for this process.

    `entry_points` binds every name in `PROBE_NAMES` to the runtime's callable.
    """
    global _probing, _plain_process
    _plain_process = _compiles_bytecode_only()
    for attribute in PROBE_NAMES:
        globals()[attribute] = entry_points[attribute]
    probing = Probing(files, relative_for, cache_directory, sites)
    probing.report = entry_points.get("limitation", probing.report)
    _probing = probing
    if not any(isinstance(finder, ProbeFinder) for finder in sys.meta_path):
        sys.meta_path.insert(0, ProbeFinder(probing))
    if builtins.compile is not _compile_probed:
        builtins.compile = _compile_probed
    probing.after_import("py_compile", _install_py_compile)
    importlib.machinery.SourceFileLoader.get_code = _file_loader_code
    probing.after_import("importlib.abc", _install_abc_loader)
    # Modules imported before this point cannot be re-executed; the detector
    # reports any planned file among them.
    return probing


if __name__ == "__main__":  # pragma: no cover - a development aid
    # python supercov_probes.py <plan.json> <relative file>: print the probed
    # source, and compile it, so a transform can be eyeballed and checked.
    import ast
    import json

    plan_path, relative = sys.argv[1], sys.argv[2]
    plan = json.load(open(plan_path, encoding="utf-8"))
    index = index_plan(plan)
    source_path = os.path.join(plan["root"], relative)
    tree = ast.parse(open(source_path, "rb").read(), filename=source_path)
    instrument(tree, index.files[relative])
    print(ast.unparse(tree))
    _original_compile(tree, source_path, "exec")
    probes = index.files[relative]
    print(f"# compiled; {probes.count} obligations, {len(probes.decisions)} decisions, {len(probes.boolops)} standalone boolops; {len(index.ids)} obligations in the run", file=sys.stderr)
