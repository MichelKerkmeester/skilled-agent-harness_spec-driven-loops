Case: C4

a deliberately failing command

Reply A:

There is the deliberately failing command, run and read.

`ls nosuchfile.txt` looked for a file that does not exist in the working directory. It printed `ls: nosuchfile.txt: No such file or directory` on stderr and returned exit 1. Both were observed in the output above, not assumed. The mechanism: `ls` reports a missing path operand and exits nonzero, exactly as expected, so this failure is the intended demonstration rather than a bug.

Nothing is blocked on you.
