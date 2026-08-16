import RemoteKit
import PhotosUI
import SwiftUI

/// The prompt bar, following the shape Claude and ChatGPT have converged
/// on: attachments strip, text field, then a control row — add-context and
/// model on the left, dictate and send on the right, all inside one rounded
/// container.
///
/// Circular 36pt controls: the earlier inline icons sat under the 44pt
/// touch target and read small against the field.
struct Composer: View {
    @Binding var input: String
    let running: Bool
    @ObservedObject var dictation: Dictation
    @ObservedObject var attachments: PromptAttachments
    @ObservedObject var models: ModelStore
    @ObservedObject var agents: AgentStore
    let onDictate: () -> Void
    let onSend: () -> Void

    @State private var photoSelection: [PhotosPickerItem] = []
    @State private var showingPhotos = false
    @State private var showingFiles = false
    @State private var showingCamera = false

    private var empty: Bool {
        input.trimmingCharacters(in: .whitespaces).isEmpty
    }

    /// Send needs something to send — text or files; stop is always
    /// available while a turn runs.
    private var sendEnabled: Bool { running || !empty || !attachments.isEmpty }

    var body: some View {
        VStack(spacing: 8) {
            if !attachments.isEmpty {
                AttachmentStrip(attachments: attachments)
            }

            TextField(
                dictation.recording ? "Listening…" : "Ask the agent…",
                text: $input, axis: .vertical
            )
            .textFieldStyle(.plain)
            .lineLimit(1 ... 6)
            .frame(maxWidth: .infinity, alignment: .leading)

            HStack(spacing: 8) {
                addMenu
                // Always present, even before the catalogue arrives:
                // hiding it made a failed fetch look like a missing
                // feature, which is exactly how it was first reported.
                ModelMenu(models: models)
                if !agents.agents.isEmpty {
                    AgentMenu(agents: agents)
                }
                Spacer(minLength: 4)
                if !dictation.unavailable {
                    CircleButton(
                        systemName: dictation.recording ? "mic.fill" : "mic",
                        foreground: dictation.recording ? .white : .primary,
                        background: dictation.recording ? Color.red : Color.primary.opacity(0.08),
                        action: onDictate
                    )
                    .accessibilityLabel(dictation.recording ? "Stop dictation" : "Dictate")
                }
                CircleButton(
                    systemName: running ? "stop.fill" : "arrow.up",
                    foreground: sendEnabled ? .white : .secondary,
                    background: sendEnabled ? Color.accentColor : Color.primary.opacity(0.08),
                    action: onSend
                )
                .disabled(!sendEnabled)
                .accessibilityLabel(running ? "Stop the agent" : "Send")
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(
            RoundedRectangle(cornerRadius: 26, style: .continuous)
                .fill(Color.primary.opacity(0.06))
                .overlay(
                    RoundedRectangle(cornerRadius: 26, style: .continuous)
                        .stroke(Color.primary.opacity(0.08), lineWidth: 1)
                )
        )
        .padding(.horizontal, 10)
        .padding(.bottom, 8)
        .animation(.easeInOut(duration: 0.15), value: dictation.recording)
        .animation(.easeInOut(duration: 0.15), value: sendEnabled)
        .animation(.easeInOut(duration: 0.2), value: attachments.items.count)
        .photosPicker(
            isPresented: $showingPhotos, selection: $photoSelection,
            maxSelectionCount: 5, matching: .images
        )
        .onChange(of: photoSelection) {
            let picked = photoSelection
            photoSelection = []
            Task { await attachments.load(picked) }
        }
        .fileImporter(
            isPresented: $showingFiles, allowedContentTypes: [.item],
            allowsMultipleSelection: true
        ) { result in
            guard case let .success(urls) = result else { return }
            for url in urls { attachments.add(fileAt: url) }
        }
        .sheet(isPresented: $showingCamera) {
            CameraPicker { image in attachments.add(image: image) }
                .ignoresSafeArea()
        }
    }

    private var addMenu: some View {
        Menu {
            Button {
                showingPhotos = true
            } label: {
                Label("Photo Library", systemImage: "photo.on.rectangle")
            }
            if UIImagePickerController.isSourceTypeAvailable(.camera) {
                Button {
                    showingCamera = true
                } label: {
                    Label("Take Photo", systemImage: "camera")
                }
            }
            Button {
                showingFiles = true
            } label: {
                Label("Files", systemImage: "folder")
            }
        } label: {
            Image(systemName: "plus")
                .font(.system(size: 17, weight: .semibold))
                .frame(width: 36, height: 36)
                .background(Circle().fill(Color.primary.opacity(0.08)))
        }
        // Menu tints its label with the accent colour; these are chrome,
        // not calls to action — the send button is the only accent here.
        .tint(.primary)
        .accessibilityLabel("Add files to the conversation")
    }
}

/// UIKit's camera, wrapped — SwiftUI still has no native capture view.
struct CameraPicker: UIViewControllerRepresentable {
    let onCapture: (UIImage) -> Void
    @Environment(\.dismiss) private var dismiss

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_: UIImagePickerController, context _: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(onCapture: onCapture, dismiss: { dismiss() })
    }

    final class Coordinator: NSObject, UIImagePickerControllerDelegate,
        UINavigationControllerDelegate {
        private let onCapture: (UIImage) -> Void
        private let dismiss: () -> Void

        init(onCapture: @escaping (UIImage) -> Void, dismiss: @escaping () -> Void) {
            self.onCapture = onCapture
            self.dismiss = dismiss
        }

        func imagePickerController(
            _: UIImagePickerController,
            didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]
        ) {
            if let image = info[.originalImage] as? UIImage { onCapture(image) }
            dismiss()
        }

        func imagePickerControllerDidCancel(_: UIImagePickerController) {
            dismiss()
        }
    }
}
