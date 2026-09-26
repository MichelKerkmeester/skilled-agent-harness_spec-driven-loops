import os
from pathlib import Path

import pytest

from src.calculator import bounded


@pytest.mark.flaky(reruns=1)
def test_worker_crashes_once_then_passes():
    marker = Path(os.environ["SUPERCOV_PYTHON_CRASH_MARKER"])
    if not marker.exists():
        marker.write_text("crashed", encoding="utf-8")
        bounded(-1)
        os._exit(17)
    assert bounded(20) == 10
