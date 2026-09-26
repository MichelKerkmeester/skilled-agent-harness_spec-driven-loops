import os
from pathlib import Path

import pytest

from app import shapes


@pytest.mark.flaky(reruns=1)
def test_worker_crash_keeps_committed_decision_evidence():
    marker = Path(os.environ["SUPERCOV_PYTHON_CRASH_MARKER"])
    if not marker.exists():
        marker.write_text("crashed", encoding="utf-8")
        shapes.negation(True, False)
        os._exit(17)
    assert shapes.negation(True, True) == "both"
