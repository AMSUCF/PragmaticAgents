import os
import threading
import tkinter as tk
from tkinter import scrolledtext

from recorder import AudioRecorder, State
from transcriber import Transcriber


class TranscriptionApp(tk.Tk):
    def __init__(self, recorder: AudioRecorder, transcriber: Transcriber):
        super().__init__()
        self.recorder = recorder
        self.transcriber = transcriber
        self.title("Transcription Tool")
        self.geometry("600x450")
        self.resizable(True, True)
        self._build_ui()
        self._update_buttons()

    def _build_ui(self):
        # Status label
        self.status_var = tk.StringVar(value="Idle")
        status_label = tk.Label(
            self, textvariable=self.status_var, font=("Segoe UI", 11), anchor="w"
        )
        status_label.pack(fill="x", padx=10, pady=(10, 5))

        # Button frame
        btn_frame = tk.Frame(self)
        btn_frame.pack(fill="x", padx=10, pady=5)

        self.record_btn = tk.Button(
            btn_frame, text="Record", width=12, command=self._on_record
        )
        self.record_btn.pack(side="left", padx=(0, 5))

        self.pause_btn = tk.Button(
            btn_frame, text="Pause", width=12, command=self._on_pause
        )
        self.pause_btn.pack(side="left", padx=5)

        self.stop_btn = tk.Button(
            btn_frame, text="Stop", width=12, command=self._on_stop
        )
        self.stop_btn.pack(side="left", padx=5)

        # Transcript display
        transcript_label = tk.Label(self, text="Transcripts:", font=("Segoe UI", 10), anchor="w")
        transcript_label.pack(fill="x", padx=10, pady=(10, 2))

        self.transcript_text = scrolledtext.ScrolledText(
            self, wrap="word", font=("Segoe UI", 10), state="disabled"
        )
        self.transcript_text.pack(fill="both", expand=True, padx=10, pady=(0, 10))

    def _update_buttons(self):
        state = self.recorder.state
        if state == State.IDLE:
            self.record_btn.config(text="Record", state="normal")
            self.pause_btn.config(state="disabled")
            self.stop_btn.config(state="disabled")
        elif state == State.RECORDING:
            self.record_btn.config(state="disabled")
            self.pause_btn.config(text="Pause", state="normal")
            self.stop_btn.config(state="normal")
        elif state == State.PAUSED:
            self.record_btn.config(text="Resume", state="normal")
            self.pause_btn.config(state="disabled")
            self.stop_btn.config(state="normal")

    def _on_record(self):
        if self.recorder.state == State.PAUSED:
            self.recorder.resume()
            self.status_var.set("Recording...")
        else:
            self.recorder.start()
            self.status_var.set("Recording...")
        self._update_buttons()

    def _on_pause(self):
        self.recorder.pause()
        self.status_var.set("Paused")
        self._update_buttons()

    def _on_stop(self):
        wav_path = self.recorder.stop()
        self._update_buttons()
        if wav_path is None:
            self.status_var.set("No audio recorded")
            return
        self.status_var.set("Transcribing...")
        # Disable all buttons during transcription
        self.record_btn.config(state="disabled")
        self.pause_btn.config(state="disabled")
        self.stop_btn.config(state="disabled")
        thread = threading.Thread(target=self._run_transcription, args=(wav_path,), daemon=True)
        thread.start()

    def _run_transcription(self, wav_path: str):
        try:
            text = self.transcriber.transcribe(wav_path)
            self.after(0, self._on_transcription_done, wav_path, text)
        except Exception as e:
            self.after(0, self._on_transcription_error, str(e))

    def _on_transcription_done(self, wav_path: str, text: str):
        filename = os.path.basename(wav_path)
        self.transcript_text.config(state="normal")
        self.transcript_text.insert("end", f"[{filename}]\n{text}\n\n")
        self.transcript_text.see("end")
        self.transcript_text.config(state="disabled")
        self.status_var.set(f"Done - saved {filename}")
        self._update_buttons()

    def _on_transcription_error(self, error: str):
        self.status_var.set(f"Error: {error}")
        self._update_buttons()
