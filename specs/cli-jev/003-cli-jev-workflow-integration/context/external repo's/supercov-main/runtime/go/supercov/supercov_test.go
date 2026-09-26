package supercov

import "testing"

func vectorsPerTest(t *testing.T) map[string]int {
	t.Helper()
	counts := make(map[string]int, len(records))
	for _, record := range records {
		counts[record.name] = len(record.vectors)
	}
	return counts
}

// Per-test MC/DC is what credits an obligation to the test that discharges it,
// so two tests producing the same vector must both record it. The inline
// recent-key cache exists to keep a looping decision off the slow path, and it
// once outlived the test whose slots it stood in for: the second test to reach
// a vector was told it had already been recorded and recorded nothing.
func TestEveryTestRecordsAVectorItProduces(t *testing.T) {
	Arm(4, []uint8{2})

	for _, name := range []string{"first", "second", "third"} {
		done := EnterTest(name)
		C(0, 0, true)
		C(0, 1, true)
		BD(1, 2, 0, true)
		done()
	}

	for name, count := range vectorsPerTest(t) {
		if count != 1 {
			t.Errorf("test %q recorded %d vectors, want 1", name, count)
		}
	}
}

// The cache must not go the other way either: distinct vectors within one test
// are distinct obligations, and collapsing them would overstate MC/DC.
func TestOneTestRecordsEachDistinctVectorOnce(t *testing.T) {
	Arm(4, []uint8{2})

	done := EnterTest("only")
	for round := 0; round < 50; round++ {
		// Alternate the vector so the two-entry cache is exercised, and repeat
		// each one so a hit is the common case.
		second := round%2 == 0
		C(0, 0, true)
		C(0, 1, second)
		BD(1, 2, 0, second)
	}
	done()

	if got := vectorsPerTest(t)["only"]; got != 2 {
		t.Errorf("recorded %d distinct vectors across 50 evaluations, want 2", got)
	}
}
