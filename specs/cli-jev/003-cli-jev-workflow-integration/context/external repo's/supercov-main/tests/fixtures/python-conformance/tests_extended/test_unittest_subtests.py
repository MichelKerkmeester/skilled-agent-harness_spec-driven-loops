import unittest

from app import shapes


class SubTestCases(unittest.TestCase):
    def test_passing_subtests(self):
        for value, expected in ((5, "small"), (50, "large")):
            with self.subTest(value=value):
                self.assertEqual(shapes.chained(value), expected)

    def test_failing_subtest_rolls_up(self):
        with self.subTest(value=5):
            self.assertEqual(shapes.chained(5), "large")
