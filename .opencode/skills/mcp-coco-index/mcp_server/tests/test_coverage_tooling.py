"""Coverage tooling smoke tests."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def test_pytest_cov_available() -> None:
    root = Path(__file__).resolve().parents[1]
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "pytest",
            "--cov=cocoindex_code",
            "--co",
            "tests/",
        ],
        cwd=root,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        timeout=60,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr
