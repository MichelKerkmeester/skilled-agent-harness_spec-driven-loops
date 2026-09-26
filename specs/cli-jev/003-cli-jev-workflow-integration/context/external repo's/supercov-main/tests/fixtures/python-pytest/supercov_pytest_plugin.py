import base64
from concurrent.futures import ThreadPoolExecutor
from contextvars import ContextVar, copy_context
from functools import lru_cache
import json
import multiprocessing.process
import os
from pathlib import Path
import subprocess
import threading

import coverage


RUN_ID = os.environ["SUPERCOV_RUN_ID"]
OUTCOME_BASE = Path(os.environ["SUPERCOV_PYTEST_OUTCOMES"])
WORKER_ID = os.environ.get("PYTEST_XDIST_WORKER", "main")
DATA_FILE = os.environ.get("SUPERCOV_PYTHON_DATA")
SOURCE = os.environ.get("SUPERCOV_PYTHON_SOURCE")
SOURCE_ENTRIES = tuple(part for part in (SOURCE or "").split(os.pathsep) if part)
SUBPROCESS_CONFIG = os.environ.get("SUPERCOV_PYTHON_SUBPROCESS_CONFIG")
_OWNED_COVERAGE = None
_IS_XDIST_CONTROLLER = False
_CURRENT_CONTEXT = ContextVar("supercov_python_context", default=None)
_SOURCE_ROOTS = tuple(
    Path(part).resolve()
    for part in SOURCE_ENTRIES
)
_PROCESS_ENVIRONMENT_LOCK = threading.Lock()

def _configure_subprocess_context(context: str) -> None:
    if not SUBPROCESS_CONFIG:
        return
    os.environ["COVERAGE_PROCESS_START"] = str(Path(SUBPROCESS_CONFIG).resolve())
    os.environ["SUPERCOV_PYTHON_CONTEXT"] = context


@lru_cache(maxsize=None)
def _is_measured_source(filename: str) -> bool:
    path = Path(filename).resolve()
    return any(path == root or root in path.parents for root in _SOURCE_ROOTS)


class _SupercovContextPlugin(coverage.CoveragePlugin):
    def dynamic_context(self, frame):
        context = _CURRENT_CONTEXT.get()
        if context is None or not _is_measured_source(frame.f_code.co_filename):
            return None
        return context


def _register_context_plugin(registry):
    registry.add_dynamic_context(_SupercovContextPlugin())


def _install_thread_context_propagation() -> None:
    if getattr(threading.Thread, "_supercov_context_patched", False):
        return
    original_start = threading.Thread.start

    def start_with_context(thread, *args, **kwargs):
        if not hasattr(thread, "_supercov_original_run"):
            context = copy_context()
            original_run = thread.run
            thread._supercov_original_run = original_run

            def run_with_context():
                return context.run(original_run)

            thread.run = run_with_context
        return original_start(thread, *args, **kwargs)

    threading.Thread.start = start_with_context
    threading.Thread._supercov_context_patched = True

    original_submit = ThreadPoolExecutor.submit

    def submit_with_context(executor, function, /, *args, **kwargs):
        context = copy_context()
        return original_submit(executor, context.run, function, *args, **kwargs)

    ThreadPoolExecutor.submit = submit_with_context


def _install_subprocess_context_propagation() -> None:
    if getattr(subprocess.Popen, "_supercov_context_patched", False):
        return
    original_init = subprocess.Popen.__init__

    def init_with_context(process, *args, **kwargs):
        context = _CURRENT_CONTEXT.get()
        if SUBPROCESS_CONFIG and context is not None:
            environment = dict(
                os.environ if kwargs.get("env") is None else kwargs["env"]
            )
            environment["COVERAGE_PROCESS_START"] = str(
                Path(SUBPROCESS_CONFIG).resolve()
            )
            environment["SUPERCOV_PYTHON_CONTEXT"] = context
            kwargs["env"] = environment
        original_init(process, *args, **kwargs)

    subprocess.Popen.__init__ = init_with_context
    subprocess.Popen._supercov_context_patched = True


def _install_multiprocessing_context_propagation() -> None:
    process_type = multiprocessing.process.BaseProcess
    if getattr(process_type, "_supercov_context_patched", False):
        return
    original_start = process_type.start

    def start_with_context(process, *args, **kwargs):
        context = _CURRENT_CONTEXT.get()
        if not SUBPROCESS_CONFIG or context is None:
            return original_start(process, *args, **kwargs)
        updates = {
            "COVERAGE_PROCESS_START": str(Path(SUBPROCESS_CONFIG).resolve()),
            "SUPERCOV_PYTHON_CONTEXT": context,
        }
        with _PROCESS_ENVIRONMENT_LOCK:
            previous = {key: os.environ.get(key) for key in updates}
            os.environ.update(updates)
            try:
                return original_start(process, *args, **kwargs)
            finally:
                for key, value in previous.items():
                    if value is None:
                        os.environ.pop(key, None)
                    else:
                        os.environ[key] = value

    process_type.start = start_with_context
    process_type._supercov_context_patched = True


_install_thread_context_propagation()
_install_subprocess_context_propagation()
_install_multiprocessing_context_propagation()


def _start_owned_coverage():
    if not DATA_FILE or not SOURCE_ENTRIES:
        raise RuntimeError(
            "Supercov pytest hook requires SUPERCOV_PYTHON_DATA and SUPERCOV_PYTHON_SOURCE"
        )
    owned = coverage.Coverage(
        data_file=DATA_FILE,
        data_suffix=True,
        branch=True,
        source=SOURCE_ENTRIES,
        config_file=False,
        context=f"supercov-worker-v1:{WORKER_ID}",
        plugins=[_register_context_plugin],
    )
    owned.set_option("run:patch", ["_exit"])
    owned.start()
    return owned


if coverage.Coverage.current() is None:
    _OWNED_COVERAGE = _start_owned_coverage()


def pytest_configure(config):
    global _IS_XDIST_CONTROLLER, _OWNED_COVERAGE, WORKER_ID
    worker_input = getattr(config, "workerinput", None)
    configured_worker = (
        worker_input.get("workerid", WORKER_ID)
        if isinstance(worker_input, dict)
        else WORKER_ID
    )
    if configured_worker != WORKER_ID:
        if _OWNED_COVERAGE is not None:
            _OWNED_COVERAGE.stop()
            _OWNED_COVERAGE = None
        WORKER_ID = configured_worker
    workers = getattr(config.option, "numprocesses", None)
    _IS_XDIST_CONTROLLER = WORKER_ID == "main" and workers not in (None, 0, "0")
    if _IS_XDIST_CONTROLLER:
        if _OWNED_COVERAGE is not None:
            _OWNED_COVERAGE.stop()
            _OWNED_COVERAGE = None
        return
    _configure_subprocess_context(f"supercov-worker-v1:{WORKER_ID}")
    if coverage.Coverage.current() is not None:
        return
    _OWNED_COVERAGE = _start_owned_coverage()


def pytest_unconfigure(config):
    del config
    if _OWNED_COVERAGE is not None:
        _OWNED_COVERAGE.stop()
        _OWNED_COVERAGE.save()


def _retry_from_item(item) -> int:
    # pytest-rerunfailures increments execution_count before invoking the
    # ordinary setup/call/teardown hooks. Pytest itself does not define this
    # attribute, so an ordinary attempt remains retry zero.
    execution_count = getattr(item, "execution_count", 1)
    return max(int(execution_count) - 1, 0)


def _context(nodeid: str, retry: int, phase: str) -> str:
    value = {
        "runId": RUN_ID,
        "workerId": WORKER_ID,
        "testId": nodeid,
        "retry": retry,
        "phase": phase,
    }
    encoded = base64.urlsafe_b64encode(
        json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    ).decode().rstrip("=")
    return f"supercov-v1:{encoded}"


def _switch(item, phase: str) -> None:
    current = coverage.Coverage.current()
    if current is None:
        raise RuntimeError("Supercov pytest hook ran without active coverage.py")
    context = _context(item.nodeid, _retry_from_item(item), phase)
    _CURRENT_CONTEXT.set(context)
    # A child Python process starts coverage.py through its documented
    # process-startup hook and reads this exact parent phase from the generated
    # run configuration. Environment inheritance is the process boundary.
    _configure_subprocess_context(context)
    _append_journal(
        {
            "runId": RUN_ID,
            "workerId": WORKER_ID,
            "testId": item.nodeid,
            "retry": _retry_from_item(item),
            "phase": phase,
            "outcome": "started",
            "wasXfail": False,
        },
        WORKER_ID,
    )


def pytest_runtest_setup(item):
    _switch(item, "setup")


def pytest_runtest_call(item):
    _switch(item, "call")


def pytest_runtest_teardown(item):
    _switch(item, "teardown")


def pytest_runtest_logreport(report):
    if _IS_XDIST_CONTROLLER:
        if report.when != "???":
            return
        node = getattr(report, "node", None)
        gateway = getattr(node, "gateway", None)
        worker_id = getattr(gateway, "id", None)
        failures_db = getattr(getattr(node, "config", None), "failures_db", None)
        if not worker_id or failures_db is None:
            raise RuntimeError("Supercov could not identify a crashed xdist worker")
        retry = max(int(failures_db.get_test_failures(report.nodeid)) - 1, 0)
        _append_journal(
            {
                "runId": RUN_ID,
                "workerId": worker_id,
                "testId": report.nodeid,
                "retry": retry,
                "phase": "unknown",
                "outcome": report.outcome,
                "wasXfail": False,
                "workerCrash": True,
            },
            "controller",
        )
        return
    record = {
        "runId": RUN_ID,
        "workerId": WORKER_ID,
        "testId": report.nodeid,
        "retry": max(int(getattr(report, "rerun", 0)), 0),
        "phase": report.when,
        "outcome": report.outcome,
        "wasXfail": bool(getattr(report, "wasxfail", False)),
    }

    _append_journal(record, WORKER_ID)


def _append_journal(record, worker_id: str) -> None:
    path = OUTCOME_BASE.with_name(f"{OUTCOME_BASE.name}.{worker_id}.jsonl")
    with path.open("a", encoding="utf-8") as stream:
        stream.write(json.dumps(record, sort_keys=True, separators=(",", ":")) + "\n")


def pytest_runtest_logfinish(nodeid, location):
    del nodeid, location
    _CURRENT_CONTEXT.set(None)
    _configure_subprocess_context(f"supercov-worker-v1:{WORKER_ID}")
