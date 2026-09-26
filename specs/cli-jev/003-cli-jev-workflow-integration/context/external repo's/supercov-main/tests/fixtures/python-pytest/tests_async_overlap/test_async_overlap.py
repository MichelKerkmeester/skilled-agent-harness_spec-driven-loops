import asyncio

import pytest

from src.calculator import bounded


pytestmark = pytest.mark.asyncio(loop_scope="module")
release = asyncio.Event()
late_task = None


async def test_starts_an_async_task_that_outlives_the_test():
    global late_task

    async def work():
        await release.wait()
        return bounded(-1)

    late_task = asyncio.create_task(work())
    await asyncio.sleep(0)


async def test_releases_prior_async_work_without_claiming_it():
    release.set()
    assert await late_task == 0
    assert bounded(20) == 10
