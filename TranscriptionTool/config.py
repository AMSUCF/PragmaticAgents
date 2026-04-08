import os

SAMPLE_RATE = 16000
CHANNELS = 1
DTYPE = "int16"

MODEL_NAME = "openai/whisper-base"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECORDINGS_DIR = os.path.join(BASE_DIR, "recordings")
TRANSCRIPTS_DIR = os.path.join(BASE_DIR, "transcripts")

os.makedirs(RECORDINGS_DIR, exist_ok=True)
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)
