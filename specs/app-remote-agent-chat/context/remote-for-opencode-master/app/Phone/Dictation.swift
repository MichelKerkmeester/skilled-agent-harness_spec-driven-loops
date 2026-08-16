import RemoteKit
import AVFoundation
import Speech
import SwiftUI

/// On-device dictation for prompts. The whole product is "your code never
/// leaves your machines", so speech recognition is pinned to on-device
/// too — a prompt is often the most revealing thing about a codebase, and
/// shipping it to Apple's servers for transcription would quietly undo the
/// promise the rest of the app keeps.
///
/// Partial results stream into the text field as you speak, so the user
/// sees it working and can stop when the sentence is right.
@MainActor
final class Dictation: ObservableObject {
    @Published private(set) var recording = false
    @Published private(set) var transcript = ""
    @Published private(set) var error: String?
    /// True when this device/locale can't do it locally. The UI hides the
    /// mic rather than offering a button that would send audio away.
    @Published private(set) var unavailable = false

    private let engine = AVAudioEngine()
    private var recognizer: SFSpeechRecognizer?
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?

    func toggle() {
        recording ? stop() : start()
    }

    /// Ends dictation and forgets what was said. Sending a prompt must call
    /// this: a live recogniser goes on emitting partial results after the
    /// send, and those updates would repopulate the field the send just
    /// cleared.
    func reset() {
        stop()
        transcript = ""
    }

    func start() {
        guard !recording else { return }
        error = nil
        transcript = ""
        Task {
            guard await authorized() else {
                error = "Dictation needs permission to use the microphone and speech recognition."
                return
            }
            begin()
        }
    }

    func stop() {
        guard recording else { return }
        recording = false
        engine.stop()
        engine.inputNode.removeTap(onBus: 0)
        request?.endAudio()
        task?.finish()
        request = nil
        task = nil
        try? AVAudioSession.sharedInstance().setActive(
            false, options: .notifyOthersOnDeactivation
        )
    }

    private func authorized() async -> Bool {
        let speech = await withCheckedContinuation { cont in
            SFSpeechRecognizer.requestAuthorization { cont.resume(returning: $0) }
        }
        guard speech == .authorized else { return false }
        return await AVAudioApplication.requestRecordPermission()
    }

    private func begin() {
        let recognizer = SFSpeechRecognizer(locale: Locale.current) ?? SFSpeechRecognizer()
        guard let recognizer, recognizer.isAvailable, recognizer.supportsOnDeviceRecognition else {
            // Rather than transcribe in the cloud, say so and let the user
            // type. Silently uploading audio would be the wrong trade for
            // this app.
            unavailable = true
            error = "On-device dictation isn't available for this language."
            return
        }
        self.recognizer = recognizer

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        request.requiresOnDeviceRecognition = true
        self.request = request

        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.record, mode: .measurement, options: .duckOthers)
            try session.setActive(true, options: .notifyOthersOnDeactivation)
            let input = engine.inputNode
            input.removeTap(onBus: 0)
            input.installTap(onBus: 0, bufferSize: 1024, format: input.outputFormat(forBus: 0)) {
                buffer, _ in
                request.append(buffer)
            }
            engine.prepare()
            try engine.start()
        } catch {
            self.error = "Couldn't start the microphone."
            stop()
            return
        }

        recording = true
        task = recognizer.recognitionTask(with: request) { [weak self] result, error in
            Task { @MainActor [weak self] in
                guard let self else { return }
                if let result {
                    transcript = result.bestTranscription.formattedString
                }
                if error != nil || result?.isFinal == true {
                    stop()
                }
            }
        }
    }
}
