import os
import numpy as np
from scipy.io import wavfile
from transformers import pipeline

from config import MODEL_NAME, TRANSCRIPTS_DIR, SAMPLE_RATE


class Transcriber:
    def __init__(self):
        self._pipe = None

    def load_model(self):
        if self._pipe is None:
            self._pipe = pipeline(
                "automatic-speech-recognition",
                model=MODEL_NAME,
                chunk_length_s=30,
            )

    def transcribe(self, wav_path: str) -> str:
        self.load_model()
        sr, audio = wavfile.read(wav_path)
        # Convert int16 to float32 in [-1, 1] range for the pipeline
        audio_float = audio.astype(np.float32) / 32768.0
        result = self._pipe(
            {"raw": audio_float, "sampling_rate": SAMPLE_RATE}
        )
        text = result["text"].strip()
        # Save transcript
        base = os.path.splitext(os.path.basename(wav_path))[0]
        transcript_path = f"{TRANSCRIPTS_DIR}/{base}.txt"
        with open(transcript_path, "w", encoding="utf-8") as f:
            f.write(text)
        return text
