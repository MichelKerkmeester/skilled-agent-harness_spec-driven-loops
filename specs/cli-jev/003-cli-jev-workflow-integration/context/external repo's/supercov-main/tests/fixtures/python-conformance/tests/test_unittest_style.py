import unittest

from app import shapes


class ChainedTests(unittest.TestCase):
    def setUp(self):
        self.values = [5, 50, -1]

    def test_small(self):
        self.assertEqual(shapes.chained(self.values[0]), "small")

    def test_large_and_negative(self):
        self.assertEqual(shapes.chained(self.values[1]), "large")
        self.assertEqual(shapes.chained(self.values[2]), "negative")

    @unittest.expectedFailure
    def test_expected_failure(self):
        self.assertEqual(shapes.chained(5), "large")

    @unittest.skip("demonstrates skips")
    def test_skipped(self):
        raise AssertionError("never runs")


if __name__ == "__main__":
    unittest.main()
