// Thesis posts. Only edits to this file (pushed to GitHub) can add posts.
//
// To add a post, copy an entry below and change it:
//   id       - unique, never change it after publishing (it is the post's link: thesis.html#post/<id>)
//   category - one of the category ids below
//   date     - "YYYY-MM-DDTHH:MM" (Toronto time)
//   body     - plain text; leave a blank line between paragraphs
//   links    - optional; documentation and code shown under the post,
//              as [{ label: "...", url: "..." }, ...]

const THESIS_REPO = "https://github.com/Luke1432/honours-thesis-work/blob/main";

const THESIS_CATEGORIES = [
  {
    id: "updates",
    name: "Progress Updates",
    description: "What I worked on, what I finished, and what is next."
  },
  {
    id: "notes",
    name: "Research Notes",
    description: "Things I am learning along the way: papers, models, and ideas."
  },
  {
    id: "questions",
    name: "Open Questions",
    description: "Problems I am stuck on or still deciding."
  }
];

const THESIS_POSTS = [
  {
    id: "first-meeting",
    category: "updates",
    title: "First meeting with Dr. Pu: the plan for Phase 1",
    date: "2026-10-20T12:00",
    body: `I had my first thesis meeting with my supervisor, Dr. Ken Pu. The topic is audio neural networks: models that take sound as input, produce sound as output, or both.

We talked about compute. The options are a V100 GPU machine, Google Colab, or a local GPU with at least 8 GB of memory.

My tasks for the first phase:
1. Look at existing models for text-to-speech (TTS) and speech-to-text (STT).
2. Map out a catalogue of small audio models.
3. Run sample tests of each model.
4. Build an interactive web app with audio input and output.`,
    links: [
      { label: "Meeting notes (photo)", url: `${THESIS_REPO}/Phase1/notes.jpg` }
    ]
  },
  {
    id: "first-tts-stt-tests",
    category: "updates",
    title: "First text-to-speech and speech-to-text tests",
    date: "2026-10-22T16:45",
    body: `I ran my first two audio models locally, both on CPU.

Text-to-speech: Kokoro-82M, a small model with 82 million parameters. My script gives it a sentence and an American English voice (af_sarah) and saves the result as a 24 kHz WAV file. The quality is very good for a model this small.

Speech-to-text: Whisper "small" through the faster-whisper library, using 8-bit weights so it runs quickly on a CPU. My script transcribes a short recording and prints every word with its start and end time in seconds. These word timestamps will turn out to be important later in the project.`,
    links: [
      { label: "speak.py (TTS)", url: `${THESIS_REPO}/Phase1/speak.py` },
      { label: "transcribe.py (STT)", url: `${THESIS_REPO}/Phase1/transcribe.py` }
    ]
  },
  {
    id: "small-audio-model-catalogue",
    category: "notes",
    title: "A catalogue of small audio models",
    date: "2026-10-26T09:05",
    body: `Working with Claude, I put together a catalogue of 24 audio models, all under 300 million parameters: 5 speech-to-text, 5 text-to-speech, 6 general audio classification, 3 emotion recognition, 3 music genre and 2 language identification models. Highlights include Whisper Tiny and Base, Distil-Whisper, Wav2Vec2, Kokoro-82M, VITS, Piper, the CED audio taggers and Wav2Small, an emotion model with only 72 thousand parameters.

I turned the catalogue into an interactive web app with four sections:
- Catalogue: filter models by task, architecture and size, with usage code for each one.
- Test lab: record from the microphone or upload a file and transcribe it in the browser with Whisper Tiny (via Transformers.js), and try text-to-speech with the browser's built-in voices.
- Benchmarks: word error rate, naturalness scores, classification accuracy and speed. These numbers come from published and community-reported results, not my own measurements.
- Architecture: how the main model families work, such as Whisper's encoder-decoder, Wav2Vec2, the Audio Spectrogram Transformer, VITS, FastSpeech2 and knowledge distillation.`,
    links: [
      { label: "Web app source (HTML)", url: `${THESIS_REPO}/Phase1/Audio%20Neural%20Network%20Research%20Lab.html` }
    ]
  },
  {
    id: "speaker-dataset",
    category: "updates",
    title: "Downloaded a 50-speaker speech dataset",
    date: "2026-10-26T10:45",
    body: `I downloaded the Speaker Recognition Audio Dataset from Kaggle. It has recordings from 50 different speakers: about 2,500 WAV clips, 4.7 GB in total. It is too large to keep in the GitHub repository, so it stays on my machine.

I have not used it yet. Whether it fits the experiment depends on what is said in the clips, which I still need to check.`,
    links: [
      { label: "Dataset on Kaggle", url: "https://www.kaggle.com/datasets/vjcalling/speaker-recognition-audio-dataset" }
    ]
  },
  {
    id: "phase-1-complete",
    category: "updates",
    title: "Phase 1 complete",
    date: "2026-11-16T13:15",
    body: `Phase 1 is done. I looked at existing TTS and STT models, built a catalogue of 24 small audio models, ran sample tests of Kokoro (TTS) and Whisper (STT), and built an interactive web app with audio input and output. On November 13 I also simplified the transcription script down to the word-timestamp output.

All Phase 1 code is now in my thesis repository on GitHub.

Next is Phase 2: testing the research question my supervisor, Dr. Ken Pu, proposed on November 10 (see "The research question: can a speech model hear sentiment?" under Research Notes).`,
    links: [
      { label: "Phase 1 folder", url: "https://github.com/Luke1432/honours-thesis-work/tree/main/Phase1" }
    ]
  },
  {
    id: "research-question-sentiment",
    category: "notes",
    title: "The research question: can a speech model hear sentiment?",
    date: "2026-11-10T12:00",
    body: `My supervisor, Dr. Ken Pu, proposed the research question for the rest of my thesis. The hypothesis and the four-step plan below are his; my job is to test them.

A speech-to-text model does not see sound directly. Audio is first turned into a spectrogram, which shows how strong each frequency is over time. The model's encoder turns the spectrogram into a sequence of internal representations (hidden-layer activations), and the decoder turns those into words.

The hypothesis: some of those internal activations already carry the sentiment of what is being said, read directly from the audio.

The plan to test it has four steps:
1. Run speech-to-text on the audio to get each word and its timestamp.
2. Ask a large language model to score the sentiment of the sentence so far at each word, on a scale from -1 (negative) to +1 (positive).
3. Extract the model's internal activations at each word's timestamp.
4. Train a very simple model, a single straight-line boundary (a "linear probe"), to predict the sentiment score from the activations. If it works, the hypothesis is supported.

Step 1 is already working from Phase 1, since my transcription script outputs word timestamps.`
  },
  {
    id: "open-questions-phase-2",
    category: "questions",
    title: "Open questions before Phase 2",
    date: "2026-11-16T17:35",
    body: `A few things I need to settle before running the experiment:

Does my dataset have enough sentiment in it? If the speakers read neutral sentences, every score will be close to 0 and there is nothing for the probe to learn. An emotional speech dataset might be a better fit.

Which language model should score sentiment? The scores need to be consistent, so the model and prompt have to stay fixed.

How do I get the activations? The faster-whisper library I used in Phase 1 does not expose the model's internal layers, so I will likely switch to the Hugging Face version of Whisper for this step.

How do I know the probe is reading the audio and not just the words? I plan to compare against a probe trained on the text alone, and to test on speakers the probe never saw during training.`
  },
  {
    id: "welcome",
    category: "updates",
    title: "Starting my honours thesis",
    date: "2026-10-30T15:00",
    body: `I am currently working on my honours thesis at Ontario Tech University, supervised by Dr. Ken Pu. I am researching neural network architectures and their applications in spoken language, starting with small audio models for speech-to-text and text-to-speech.

I started on October 20, and the earlier posts on this page cover my first ten days: my first meeting with Dr. Pu, my first model tests, and a catalogue of small audio models. From here on, I will post as I make progress.`
  }
];
