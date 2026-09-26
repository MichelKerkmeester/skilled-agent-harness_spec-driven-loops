//go:build !windows

package main

import (
	"os"
	"syscall"
)

// hand replaces this process with the binary, so signals, the terminal and the
// exit code belong to Supercov rather than to a launcher sitting in front of
// it. Nothing here needs to outlive the handover.
func hand(binary string, arguments []string) error {
	return syscall.Exec(binary, append([]string{binary}, arguments...), os.Environ())
}
