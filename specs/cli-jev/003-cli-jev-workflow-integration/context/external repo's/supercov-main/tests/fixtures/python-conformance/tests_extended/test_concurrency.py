import asyncio
from concurrent.futures import ThreadPoolExecutor
import multiprocessing

from app import shapes


pool = ThreadPoolExecutor(max_workers=1)


def _spawn_target(queue):
    queue.put(shapes.chained(50))


def test_thread_pool_first_context():
    assert pool.submit(shapes.chained, 5).result(timeout=10) == "small"


def test_reused_thread_pool_gets_new_context():
    assert pool.submit(shapes.chained, 50).result(timeout=10) == "large"


def test_spawned_multiprocessing_context():
    context = multiprocessing.get_context("spawn")
    queue = context.Queue()
    process = context.Process(target=_spawn_target, args=(queue,))
    process.start()
    process.join(timeout=10)
    assert process.exitcode == 0
    assert queue.get(timeout=2) == "large"


def test_interleaved_asyncio_tasks_keep_one_test_context():
    async def evaluate(value, ready):
        await ready.wait()
        return shapes.chained(value)

    async def run():
        ready = asyncio.Event()
        first = asyncio.create_task(evaluate(5, ready))
        second = asyncio.create_task(evaluate(50, ready))
        ready.set()
        return await asyncio.gather(first, second)

    assert asyncio.run(run()) == ["small", "large"]
