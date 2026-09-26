package main

import (
	"errors"
	"os"
	"os/exec"
)

// hand runs the binary and exits with its status. Windows has no exec that
// replaces the running process, so the launcher stays as a parent that passes
// the streams through and forwards the code.
func hand(binary string, arguments []string) error {
	command := exec.Command(binary, arguments...)
	command.Stdin, command.Stdout, command.Stderr = os.Stdin, os.Stdout, os.Stderr
	err := command.Run()
	var exit *exec.ExitError
	if errors.As(err, &exit) {
		os.Exit(exit.ExitCode())
	}
	if err != nil {
		return err
	}
	os.Exit(0)
	return nil
}
