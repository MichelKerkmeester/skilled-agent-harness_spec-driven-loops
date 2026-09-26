package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

// The launcher has one job and two ways to get it wrong: asking for an archive
// that was never published, or asking for the wrong version of it.

func TestAssetNamesAnArchiveTheReleaseActuallyPublishes(t *testing.T) {
	// Exactly the eight the release builds, spelled the way it spells them.
	published := map[string]bool{
		"supercov-cli-darwin-arm64-1.2.3.tgz":     true,
		"supercov-cli-darwin-x64-1.2.3.tgz":       true,
		"supercov-cli-linux-arm64-gnu-1.2.3.tgz":  true,
		"supercov-cli-linux-x64-gnu-1.2.3.tgz":    true,
		"supercov-cli-linux-arm64-musl-1.2.3.tgz": true,
		"supercov-cli-linux-x64-musl-1.2.3.tgz":   true,
		"supercov-cli-win32-arm64-1.2.3.tgz":      true,
		"supercov-cli-win32-x64-1.2.3.tgz":        true,
	}
	name, err := asset("1.2.3")
	if err != nil {
		t.Skipf("no release is built for %s/%s", runtime.GOOS, runtime.GOARCH)
	}
	if !published[name] {
		t.Fatalf("%s is not an archive the release publishes", name)
	}
}

func TestAnUnsupportedPlatformSaysSoRatherThanGuessing(t *testing.T) {
	// architecture() returns "" for anything but amd64 and arm64, and asset
	// refuses rather than building a URL that would 404 with no explanation.
	if architecture() == "" {
		if _, err := asset("1.2.3"); err == nil {
			t.Fatal("an unbuilt architecture must be refused, not guessed at")
		}
	}
}

func TestOnlyARealReleaseVersionIsFetched(t *testing.T) {
	// A launcher built from a working copy, or from a commit rather than a
	// tag, has no release to match and must ask GitHub instead of inventing
	// a URL from a version nothing was ever published under.
	for _, version := range []string{
		"",
		"(devel)",
		"v0.0.0-20260914120000-abcdef123456",
	} {
		if looksLikeVersion(strings.TrimPrefix(version, "v")) {
			t.Fatalf("%q is not a published release", version)
		}
	}
	for _, version := range []string{"0.0.49", "1.2.3", "10.20.30"} {
		if !looksLikeVersion(version) {
			t.Fatalf("%q is a published release", version)
		}
	}
}

func TestLibcPicksOneOfTheTwoLinuxBuilds(t *testing.T) {
	if got := libc(); got != "gnu" && got != "musl" {
		t.Fatalf("libc() = %q, and only gnu and musl are built", got)
	}
}

// fakeGitHub stands a local server in for GitHub's API and its release
// downloads for the length of one test. The tests below exercise the launcher
// against it, so they no longer pass or fail with GitHub's own availability --
// a gateway timeout from the real one turned pull requests red that changed
// nothing here.
func fakeGitHub(t *testing.T, handler http.HandlerFunc) {
	t.Helper()
	server := httptest.NewServer(handler)
	t.Cleanup(server.Close)
	api, download := releaseAPI, releaseDownload
	releaseAPI, releaseDownload = server.URL+"/api", server.URL+"/download"
	t.Cleanup(func() { releaseAPI, releaseDownload = api, download })
}

// recordedWaits replaces the sleep between attempts with a record of it, so a
// test runs instantly and can say how long the launcher would have waited.
func recordedWaits(t *testing.T) *[]time.Duration {
	t.Helper()
	var waits []time.Duration
	previous := sleep
	sleep = func(wait time.Duration) { waits = append(waits, wait) }
	t.Cleanup(func() { sleep = previous })
	return &waits
}

// isolatedCache points the user cache at a temporary directory, so an install
// under test never writes into the real one.
func isolatedCache(t *testing.T) {
	t.Helper()
	directory := t.TempDir()
	t.Setenv("HOME", directory)
	t.Setenv("XDG_CACHE_HOME", directory)
	t.Setenv("LocalAppData", directory)
}

func binaryName() string {
	if runtime.GOOS == "windows" {
		return "supercov.exe"
	}
	return "supercov"
}

// releaseArchive is laid out the way the release lays it out: an npm package
// with the binary at package/bin/.
func releaseArchive(t *testing.T, contents []byte) []byte {
	t.Helper()
	var buffer bytes.Buffer
	zipped := gzip.NewWriter(&buffer)
	archive := tar.NewWriter(zipped)
	header := &tar.Header{
		Name:     "package/bin/" + binaryName(),
		Mode:     0o755,
		Size:     int64(len(contents)),
		Typeflag: tar.TypeReg,
	}
	if err := archive.WriteHeader(header); err != nil {
		t.Fatal(err)
	}
	if _, err := archive.Write(contents); err != nil {
		t.Fatal(err)
	}
	if err := archive.Close(); err != nil {
		t.Fatal(err)
	}
	if err := zipped.Close(); err != nil {
		t.Fatal(err)
	}
	return buffer.Bytes()
}

func get(t *testing.T) *http.Request {
	t.Helper()
	request, err := http.NewRequest(http.MethodGet, releaseAPI+"/releases/latest", nil)
	if err != nil {
		t.Fatal(err)
	}
	return request
}

func TestATransientAnswerIsAskedAgain(t *testing.T) {
	var asked atomic.Int32
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		if asked.Add(1) <= 2 {
			w.WriteHeader(http.StatusGatewayTimeout)
			return
		}
		fmt.Fprint(w, "answered")
	})
	waits := recordedWaits(t)
	response, err := fetch(&http.Client{}, get(t))
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("got %s, want the answer that followed the timeouts", response.Status)
	}
	if asked.Load() != 3 {
		t.Fatalf("asked %d times, want 3", asked.Load())
	}
	if want := retryDelays[:2]; !slices.Equal(*waits, want) {
		t.Fatalf("waited %v, want %v", *waits, want)
	}
}

func TestAnAnswerAboutTheReleaseIsNotAskedAgain(t *testing.T) {
	// 404 is how an unpublished archive is recognised, and the launcher falls
	// back on it; 403 is a spent rate limit. Asking again changes neither.
	for _, status := range []int{http.StatusNotFound, http.StatusForbidden, http.StatusOK} {
		var asked atomic.Int32
		fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
			asked.Add(1)
			w.WriteHeader(status)
		})
		waits := recordedWaits(t)
		response, err := fetch(&http.Client{}, get(t))
		if err != nil {
			t.Fatal(err)
		}
		response.Body.Close()
		if response.StatusCode != status || asked.Load() != 1 || len(*waits) != 0 {
			t.Fatalf("%d: answered %s after %d asks and waits %v, want it once and at once",
				status, response.Status, asked.Load(), *waits)
		}
	}
}

func TestRetriesEndWithTheLastAnswerAsItStands(t *testing.T) {
	// Handed back unchanged, so each caller reports it exactly as before.
	var asked atomic.Int32
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		asked.Add(1)
		w.WriteHeader(http.StatusServiceUnavailable)
	})
	waits := recordedWaits(t)
	response, err := fetch(&http.Client{}, get(t))
	if err != nil {
		t.Fatal(err)
	}
	response.Body.Close()
	if response.StatusCode != http.StatusServiceUnavailable {
		t.Fatalf("got %s, want the last answer", response.Status)
	}
	if int(asked.Load()) != len(retryDelays)+1 {
		t.Fatalf("asked %d times, want %d", asked.Load(), len(retryDelays)+1)
	}
	if !slices.Equal(*waits, retryDelays) {
		t.Fatalf("waited %v, want %v", *waits, retryDelays)
	}
}

func TestRetryAfterIsWaitedOutButNotForever(t *testing.T) {
	var asked atomic.Int32
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		if asked.Add(1) == 1 {
			w.Header().Set("Retry-After", "3")
			w.WriteHeader(http.StatusTooManyRequests)
			return
		}
		fmt.Fprint(w, "answered")
	})
	waits := recordedWaits(t)
	response, err := fetch(&http.Client{}, get(t))
	if err != nil {
		t.Fatal(err)
	}
	response.Body.Close()
	if response.StatusCode != http.StatusOK || !slices.Equal(*waits, []time.Duration{3 * time.Second}) {
		t.Fatalf("answered %s after waiting %v, want 200 after the 3s GitHub asked for",
			response.Status, *waits)
	}

	// A wait longer than the install should hang on is reported instead.
	asked.Store(0)
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		asked.Add(1)
		w.Header().Set("Retry-After", "3600")
		w.WriteHeader(http.StatusTooManyRequests)
	})
	waits = recordedWaits(t)
	response, err = fetch(&http.Client{}, get(t))
	if err != nil {
		t.Fatal(err)
	}
	response.Body.Close()
	if response.StatusCode != http.StatusTooManyRequests || asked.Load() != 1 || len(*waits) != 0 {
		t.Fatalf("answered %s after %d asks and waits %v, want the refusal at once",
			response.Status, asked.Load(), *waits)
	}
}

func TestAConnectionThatDropsIsAskedAgain(t *testing.T) {
	// Closed before any answer: nothing was said about the release at all.
	var asked atomic.Int32
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		if asked.Add(1) == 1 {
			connection, _, err := w.(http.Hijacker).Hijack()
			if err != nil {
				t.Error(err)
				return
			}
			connection.Close()
			return
		}
		fmt.Fprint(w, "answered")
	})
	recordedWaits(t)
	response, err := fetch(&http.Client{}, get(t))
	if err != nil {
		t.Fatalf("a dropped connection was not asked again: %v", err)
	}
	response.Body.Close()
	if response.StatusCode != http.StatusOK || asked.Load() != 2 {
		t.Fatalf("answered %s after %d asks, want 200 after 2", response.Status, asked.Load())
	}
}

func TestAClientTimeoutIsNotAskedAgain(t *testing.T) {
	// It has already waited as long as the request is allowed to; retrying
	// would multiply that, and a download is allowed ten minutes.
	var asked atomic.Int32
	release := make(chan struct{})
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		asked.Add(1)
		select {
		case <-release:
		case <-r.Context().Done():
		}
	})
	t.Cleanup(func() { close(release) })
	waits := recordedWaits(t)
	_, err := fetch(&http.Client{Timeout: 50 * time.Millisecond}, get(t))
	if err == nil {
		t.Fatal("a request that timed out must fail")
	}
	if asked.Load() != 1 || len(*waits) != 0 {
		t.Fatalf("asked %d times and waited %v, want once", asked.Load(), *waits)
	}
}

// The window this closes: a tag is pushed before the workflow that builds its
// archives runs, so for the twenty minutes that takes, `@latest` resolves to a
// version nothing can be downloaded for. npm, pip and gem all resolve to the
// newest version with an artifact for the machine asking; this makes `go run`
// behave the same way instead of failing outright.
func TestTheNewestDownloadableReleaseIsFoundWhenATagHasNoArchivesYet(t *testing.T) {
	if _, err := platform(); err != nil {
		t.Skipf("no release is built for this machine: %v", err)
	}
	older, _ := asset("1.9.0")
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode([]map[string]any{
			{"tag_name": "v2.0.0", "assets": []map[string]string{}},
			{"tag_name": "v1.9.0", "assets": []map[string]string{{"name": older}}},
		})
	})
	version, err := published()
	if err != nil {
		t.Fatal(err)
	}
	if version != "1.9.0" {
		t.Fatalf("published() = %q, want the newest release with an archive here", version)
	}
}

// A tag whose archives are not published yet must be distinguishable from a
// download that simply failed: the first is worth falling back for, the second
// is not.
func TestAMissingArchiveIsReportedAsUnpublishedRatherThanAsAFailure(t *testing.T) {
	if _, err := platform(); err != nil {
		t.Skipf("no release is built for this machine: %v", err)
	}
	isolatedCache(t)
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	})
	recordedWaits(t)
	_, err := install("9.9.9")
	if !errors.Is(err, errUnpublished) {
		t.Fatalf("want errUnpublished so run() can fall back, got: %v", err)
	}
}

func TestAnInstallSurvivesAMomentaryGatewayTimeout(t *testing.T) {
	// The failure that reached a user as a failed `go run`: the release was
	// there, and the CDN in front of it was slow for a moment.
	if _, err := platform(); err != nil {
		t.Skipf("no release is built for this machine: %v", err)
	}
	isolatedCache(t)
	contents := []byte("#!/bin/sh\necho supercov\n")
	archive := releaseArchive(t, contents)
	var asked atomic.Int32
	fakeGitHub(t, func(w http.ResponseWriter, r *http.Request) {
		if asked.Add(1) == 1 {
			w.WriteHeader(http.StatusGatewayTimeout)
			return
		}
		w.Write(archive)
	})
	recordedWaits(t)
	binary, err := install("1.2.3")
	if err != nil {
		t.Fatalf("a momentary 504 ended the install: %v", err)
	}
	written, err := os.ReadFile(binary)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(written, contents) {
		t.Fatal("the installed binary is not the one in the archive")
	}
	if filepath.Base(binary) != binaryName() {
		t.Fatalf("installed as %s", filepath.Base(binary))
	}
}

// The same two claims against the real GitHub, for when that is the question:
// that what published() names is really downloadable. Opt in, since the answer
// depends on GitHub being up.
func TestLiveTheNewestDownloadableReleaseIsDownloadable(t *testing.T) {
	if os.Getenv("SUPERCOV_LIVE_GITHUB") == "" {
		t.Skip("set SUPERCOV_LIVE_GITHUB=1 to check against the real GitHub")
	}
	if _, err := platform(); err != nil {
		t.Skipf("no release is built for this machine: %v", err)
	}
	version, err := published()
	if err != nil {
		t.Fatal(err)
	}
	if !looksLikeVersion(version) {
		t.Fatalf("published() = %q, which is not a release version", version)
	}
	name, _ := asset(version)
	url := fmt.Sprintf("%s/v%s/%s", releaseDownload, version, name)
	request, err := http.NewRequest(http.MethodHead, url, nil)
	if err != nil {
		t.Fatal(err)
	}
	response, err := fetch(&http.Client{Timeout: 60 * time.Second}, request)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("published() named %s, but %s is %s", version, name, response.Status)
	}
	t.Logf("newest downloadable release for this platform: %s", version)
}

func TestLiveAMissingArchiveIsReportedAsUnpublished(t *testing.T) {
	if os.Getenv("SUPERCOV_LIVE_GITHUB") == "" {
		t.Skip("set SUPERCOV_LIVE_GITHUB=1 to check against the real GitHub")
	}
	if _, err := platform(); err != nil {
		t.Skipf("no release is built for this machine: %v", err)
	}
	isolatedCache(t)
	if _, err := install("9.9.9"); !errors.Is(err, errUnpublished) {
		t.Fatalf("want errUnpublished so run() can fall back, got: %v", err)
	}
}
