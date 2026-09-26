import asyncio
import multiprocessing
import subprocess
import sys
from threading import Thread

from src.calculator import bounded


def _multiprocessing_target(queue):
    queue.put(bounded(20))


def test_async_task_keeps_call_attribution():
    async def run():
        await asyncio.sleep(0)
        return bounded(-1)

    assert asyncio.run(run()) == 0


def test_spawned_thread_keeps_call_attribution():
    observed = []
    thread = Thread(target=lambda: observed.append(bounded(20)))
    thread.start()
    thread.join()
    assert observed == [10]


def test_python_subprocess_inherits_call_attribution():
    completed = subprocess.run(
        [
            sys.executable,
            "-c",
            "from src.calculator import bounded; print(bounded(1))",
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    assert completed.stdout.strip() == "1"


def test_multiprocessing_child_inherits_call_attribution():
    context = multiprocessing.get_context("spawn")
    queue = context.Queue()
    process = context.Process(target=_multiprocessing_target, args=(queue,))
    process.start()
    process.join(timeout=10)
    assert process.exitcode == 0
    assert queue.get(timeout=1) == 10
