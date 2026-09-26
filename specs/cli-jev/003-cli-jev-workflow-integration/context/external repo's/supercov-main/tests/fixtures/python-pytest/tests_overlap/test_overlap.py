from concurrent.futures import ThreadPoolExecutor
import multiprocessing
import subprocess
import sys
from threading import Event, Thread

from src.calculator import bounded


release = Event()
completed = Event()
late_thread = None
pool = ThreadPoolExecutor(max_workers=1)
subprocess_release = Event()
subprocess_completed = Event()
subprocess_thread = None
multiprocessing_release = Event()
multiprocessing_completed = Event()
multiprocessing_thread = None


def _multiprocessing_target(queue):
    queue.put(bounded(20))


def test_starts_work_that_outlives_its_phase():
    global late_thread

    def work():
        release.wait(timeout=10)
        bounded(-1)
        completed.set()

    late_thread = Thread(target=work)
    late_thread.start()


def test_releases_prior_test_work_without_claiming_it():
    release.set()
    assert completed.wait(timeout=10)
    late_thread.join(timeout=10)
    assert bounded(20) == 10


def test_thread_pool_first_submission():
    assert pool.submit(bounded, -1).result(timeout=10) == 0


def test_reused_thread_pool_gets_the_new_test_context():
    assert pool.submit(bounded, 20).result(timeout=10) == 10


def test_starts_a_late_python_subprocess():
    global subprocess_thread

    def work():
        subprocess_release.wait(timeout=10)
        completed_process = subprocess.run(
            [
                sys.executable,
                "-c",
                "from src.calculator import bounded; print(bounded(1))",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        assert completed_process.stdout.strip() == "1"
        subprocess_completed.set()

    subprocess_thread = Thread(target=work)
    subprocess_thread.start()


def test_releases_prior_subprocess_without_claiming_it():
    subprocess_release.set()
    assert subprocess_completed.wait(timeout=10)
    subprocess_thread.join(timeout=10)


def test_starts_late_spawned_multiprocessing_work():
    global multiprocessing_thread

    def work():
        multiprocessing_release.wait(timeout=10)
        context = multiprocessing.get_context("spawn")
        queue = context.Queue()
        process = context.Process(target=_multiprocessing_target, args=(queue,))
        process.start()
        process.join(timeout=10)
        assert process.exitcode == 0
        assert queue.get(timeout=1) == 10
        multiprocessing_completed.set()

    multiprocessing_thread = Thread(target=work)
    multiprocessing_thread.start()


def test_releases_prior_multiprocessing_work_without_claiming_it():
    multiprocessing_release.set()
    assert multiprocessing_completed.wait(timeout=10)
    multiprocessing_thread.join(timeout=10)
