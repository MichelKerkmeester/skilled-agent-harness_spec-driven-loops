"""One passing and one failing unittest test; the gate checks the failure is
reported as one (the subtest module checks roll-up, not a plain failure)."""

import unittest


class FailingCases(unittest.TestCase):
    def test_passes(self):
        self.assertEqual(sum([1, 2]), 3)

    def test_fails(self):
        self.assertEqual(sum([1, 2]), 4)
