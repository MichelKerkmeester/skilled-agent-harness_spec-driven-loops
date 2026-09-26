// Command supercov runs Supercov from a Go toolchain and nothing else.
//
//	go run github.com/supercorp-ai/supercov/cmd/supercov@latest -- go test ./...
//
// Go's own help for `go run` says a package argument with a version suffix is
// built "in module-aware mode, ignoring the go.mod file in the current
// directory" -- which is npx, for Go. That matters because Supercov's CLI is a
// Rust binary: before this, measuring a Go project meant installing Node,
// Python, Ruby or Rust first, and every other language Supercov supports had a
// native way in.
//
// This program is only a way in. It finds the release built for this machine,
// unpacks the binary beside the others in the user's cache, and hands over to
// it. A second run finds the binary already there and executes it directly.
package main

import (
	"archive/tar"
	"compress/gzip"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"runtime/debug"
	"strconv"
	"strings"
	"time"
)

const repository = "https://github.com/supercorp-ai/supercov"

// Where releases are listed and fetched from. Variables only so the tests can
// stand a local server in for GitHub; nothing else changes them.
var (
	releaseAPI      = "https://api.github.com/repos/supercorp-ai/supercov"
	releaseDownload = repository + "/releases/download"
)

// A release is served by a CDN that times out now and then, and a single 504
// used to end an install outright -- for a Go user it is the whole of
// `go run .../cmd/supercov@latest`. What a moment later might answer is worth
// asking again; these are the waits between attempts.
var (
	retryDelays = []time.Duration{time.Second, 2 * time.Second, 4 * time.Second}
	// A Retry-After longer than this is not waited out: the install reports
	// the refusal instead of hanging on it.
	maxRetryAfter = 30 * time.Second
	sleep         = time.Sleep
)

// transient is an answer that says nothing about the release itself. 404 is
// not among them: it is how an unpublished archive is recognised, which the
// launcher falls back on. Nor is 403, GitHub's answer when its rate limit is
// spent, which no wait of seconds will change.
func transient(status int) bool {
	switch status {
	case http.StatusRequestTimeout,
		http.StatusTooManyRequests,
		http.StatusInternalServerError,
		http.StatusBadGateway,
		http.StatusServiceUnavailable,
		http.StatusGatewayTimeout:
		return true
	}
	return false
}

// fetch sends request, asking again while the answer is transient or the
// connection failed before any answer came. Once the attempts run out it
// returns the last answer as it stands, so each caller reports it exactly as
// it would have. A client timeout is not retried: it has already waited as
// long as that request is allowed to take.
func fetch(client *http.Client, request *http.Request) (*http.Response, error) {
	for attempt := 0; ; attempt++ {
		response, err := client.Do(request.Clone(request.Context()))
		last := attempt == len(retryDelays)
		if err != nil {
			var network net.Error
			if last || (errors.As(err, &network) && network.Timeout()) {
				return nil, err
			}
			retrying(request, "did not answer", retryDelays[attempt])
			sleep(retryDelays[attempt])
			continue
		}
		if last || !transient(response.StatusCode) {
			return response, nil
		}
		wait := retryDelays[attempt]
		if after, ok := retryAfter(response); ok && after > wait {
			if after > maxRetryAfter {
				return response, nil
			}
			wait = after
		}
		response.Body.Close()
		retrying(request, "answered "+response.Status, wait)
		sleep(wait)
	}
}

// retrying says why an install has gone quiet. The waits add up to seconds,
// and a launcher that stops printing mid-install looks hung.
func retrying(request *http.Request, what string, wait time.Duration) {
	fmt.Fprintf(os.Stderr, "supercov: %s %s; asking again in %s\n", request.URL.Host, what, wait)
}

// retryAfter reads the seconds form of Retry-After, which is what GitHub
// sends. The date form is left unread and the usual wait applies.
func retryAfter(response *http.Response) (time.Duration, bool) {
	seconds, err := strconv.Atoi(strings.TrimSpace(response.Header.Get("Retry-After")))
	if err != nil || seconds < 0 {
		return 0, false
	}
	return time.Duration(seconds) * time.Second, true
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "supercov: %v\n", err)
		os.Exit(1)
	}
}

func run() error {
	version, err := release()
	if err != nil {
		return err
	}
	binary, err := install(version)
	if errors.Is(err, errUnpublished) {
		// The tag exists and its archives do not, which is what a release in
		// progress looks like from here. Use the newest one that is actually
		// downloadable rather than failing, and say which -- silently running a
		// different version than the caller named would be worse than either.
		fallback, lookup := published()
		if lookup != nil {
			return fmt.Errorf("%s has no archive for this platform: %w", version, err)
		}
		fmt.Fprintf(
			os.Stderr,
			"supercov: %s is tagged but its archives are not published yet; using %s\n",
			version, fallback,
		)
		binary, err = install(fallback)
	}
	if err != nil {
		return err
	}
	// Tells the binary how it was started, so the commands it prints (such as
	// those in `supercov docs`) can be pasted back into this shell.
	if err := os.Setenv("SUPERCOV_LAUNCHER", "go"); err != nil {
		return err
	}
	return hand(binary, os.Args[1:])
}

// release is the version to fetch: the one this launcher was built from, so
// `@v0.0.49` runs that release rather than whatever is newest. A launcher run
// from a working copy has no version of its own and asks GitHub for the latest.
func release() (string, error) {
	if info, ok := debug.ReadBuildInfo(); ok {
		if version := strings.TrimPrefix(info.Main.Version, "v"); looksLikeVersion(version) {
			return version, nil
		}
	}
	return latest()
}

// looksLikeVersion accepts only what a release is actually tagged as: three
// numbers and nothing else. Go reports "(devel)" for a working copy and a
// pseudo-version like v0.0.0-20260914120000-abcdef123456 for a commit that
// carries no tag, and neither has a release behind it -- fetching the second
// as though it did would ask for an archive nobody ever published.
func looksLikeVersion(value string) bool {
	parts := strings.Split(value, ".")
	if len(parts) != 3 {
		return false
	}
	for _, part := range parts {
		if part == "" {
			return false
		}
		for _, digit := range part {
			if digit < '0' || digit > '9' {
				return false
			}
		}
	}
	return true
}

func latest() (string, error) {
	request, err := http.NewRequest(
		http.MethodGet,
		releaseAPI+"/releases/latest",
		nil,
	)
	if err != nil {
		return "", err
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	response, err := fetch(&http.Client{Timeout: 30 * time.Second}, request)
	if err != nil {
		return "", fmt.Errorf("asking GitHub for the latest release: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf(
			"asking GitHub for the latest release: %s", response.Status,
		)
	}
	var payload struct {
		TagName string `json:"tag_name"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		return "", err
	}
	version := strings.TrimPrefix(payload.TagName, "v")
	if version == "" {
		return "", errors.New("the latest release has no tag")
	}
	return version, nil
}

// platform names this machine the way the releases spell it.
func platform() (string, error) {
	name := ""
	switch runtime.GOOS {
	case "darwin":
		name = "darwin-" + architecture()
	case "windows":
		name = "win32-" + architecture()
	case "linux":
		name = "linux-" + architecture() + "-" + libc()
	}
	if name == "" || strings.HasSuffix(name, "-") {
		return "", fmt.Errorf(
			"no Supercov release is built for %s/%s; see %s/releases",
			runtime.GOOS, runtime.GOARCH, repository,
		)
	}
	return name, nil
}

// asset names the release archive built for this machine.
func asset(version string) (string, error) {
	name, err := platform()
	if err != nil {
		return "", err
	}
	return archive(name, version), nil
}

func archive(platform, version string) string {
	return fmt.Sprintf("supercov-cli-%s-%s.tgz", platform, version)
}

// errUnpublished is a release whose archive for this platform is not there.
var errUnpublished = errors.New("no archive for this platform in that release")

// published is the newest release that actually carries an archive for this
// machine, which is not always the newest release.
//
// A tag is pushed before the workflow that builds its archives runs, so for the
// twenty minutes that takes, `@latest` resolves to a version nothing can be
// downloaded for. Every other channel already behaves this way: npm, pip and
// gem all resolve to the newest version that has an artifact for the machine
// asking, and fall back to the previous one until it does.
func published() (string, error) {
	name, err := platform()
	if err != nil {
		return "", err
	}
	request, err := http.NewRequest(
		http.MethodGet,
		releaseAPI+"/releases?per_page=20",
		nil,
	)
	if err != nil {
		return "", err
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	response, err := fetch(&http.Client{Timeout: 30 * time.Second}, request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("asking GitHub for releases: %s", response.Status)
	}
	var releases []struct {
		TagName string `json:"tag_name"`
		Assets  []struct {
			Name string `json:"name"`
		} `json:"assets"`
	}
	if err := json.NewDecoder(response.Body).Decode(&releases); err != nil {
		return "", err
	}
	for _, release := range releases {
		version := strings.TrimPrefix(release.TagName, "v")
		if !looksLikeVersion(version) {
			continue
		}
		for _, held := range release.Assets {
			if held.Name == archive(name, version) {
				return version, nil
			}
		}
	}
	return "", errors.New("no release carries an archive for this platform")
}

func architecture() string {
	switch runtime.GOARCH {
	case "amd64":
		return "x64"
	case "arm64":
		return "arm64"
	}
	return ""
}

// libc decides between the glibc and musl builds. Go cannot report which it
// was linked against from a pure-Go program, so this asks the filesystem: musl
// installs its loader under a name of its own, and every glibc system has a
// loader glibc put there.
func libc() string {
	for _, pattern := range []string{"/lib/ld-musl-*", "/lib/libc.musl-*"} {
		if matches, _ := filepath.Glob(pattern); len(matches) > 0 {
			return "musl"
		}
	}
	if _, err := os.Stat("/etc/alpine-release"); err == nil {
		return "musl"
	}
	return "gnu"
}

// install returns the path to the binary for version, downloading it once.
func install(version string) (string, error) {
	cache, err := os.UserCacheDir()
	if err != nil {
		cache = os.TempDir()
	}
	name := "supercov"
	if runtime.GOOS == "windows" {
		name += ".exe"
	}
	directory := filepath.Join(cache, "supercov", "bin", version)
	binary := filepath.Join(directory, name)
	if info, err := os.Stat(binary); err == nil && info.Mode().IsRegular() {
		return binary, nil
	}
	archive, err := asset(version)
	if err != nil {
		return "", err
	}
	url := fmt.Sprintf("%s/v%s/%s", releaseDownload, version, archive)
	fmt.Fprintf(os.Stderr, "supercov: fetching %s\n", archive)
	if err := os.MkdirAll(directory, 0o755); err != nil {
		return "", err
	}
	if err := download(url, directory, name); err != nil {
		return "", err
	}
	return binary, nil
}

// download unpacks the one file that matters out of the release archive.
//
// The archives are npm packages, which is what every other channel already
// publishes; the binary sits at package/bin/ inside. `cargo binstall` reads the
// same asset the same way.
func download(url, directory, name string) error {
	request, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return err
	}
	response, err := fetch(&http.Client{Timeout: 10 * time.Minute}, request)
	if err != nil {
		return fmt.Errorf("downloading %s: %w", url, err)
	}
	defer response.Body.Close()
	if response.StatusCode == http.StatusNotFound {
		return errUnpublished
	}
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("downloading %s: %s", url, response.Status)
	}
	unzipped, err := gzip.NewReader(response.Body)
	if err != nil {
		return fmt.Errorf("reading %s: %w", url, err)
	}
	defer unzipped.Close()
	archive := tar.NewReader(unzipped)
	for {
		header, err := archive.Next()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return fmt.Errorf("reading %s: %w", url, err)
		}
		if header.Typeflag != tar.TypeReg || filepath.Base(header.Name) != name {
			continue
		}
		if !strings.Contains(filepath.ToSlash(header.Name), "/bin/") {
			continue
		}
		// Written beside its destination and renamed, so a second process
		// never sees a half-written binary and tries to run it.
		partial, err := os.CreateTemp(directory, ".supercov-*")
		if err != nil {
			return err
		}
		defer os.Remove(partial.Name())
		if _, err := io.Copy(partial, archive); err != nil {
			partial.Close()
			return err
		}
		if err := partial.Close(); err != nil {
			return err
		}
		if err := os.Chmod(partial.Name(), 0o755); err != nil {
			return err
		}
		return os.Rename(partial.Name(), filepath.Join(directory, name))
	}
	return fmt.Errorf("%s holds no %s", url, name)
}
