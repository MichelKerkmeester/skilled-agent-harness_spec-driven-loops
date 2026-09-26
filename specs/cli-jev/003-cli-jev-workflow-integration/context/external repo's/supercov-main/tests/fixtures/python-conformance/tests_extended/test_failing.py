"""One passing and one failing test. Everything under `tests/` passes, so a
runner whose failure path broke would look fine to the totals; the gate runs
this file and checks the failure is reported as one."""


def test_passes():
    assert sum([1, 2]) == 3


def test_fails():
    assert sum([1, 2]) == 4
