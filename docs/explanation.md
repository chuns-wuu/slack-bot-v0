## System Architecture Design Document

### Overview

This document describes the workflow, use cases, and components of the Whisper Lambda function. The Whisper Lambda function processes audio files by transcribing them and saving the transcriptions to an S3 bucket.

### Components and Workflow

1. **AWS S3:**
   - **Role:** Storage service that triggers the Lambda function when an audio file is uploaded.
   - **Interaction:** When an audio file is uploaded to a specific S3 bucket, an event is triggered.

2. **Lambda Function:**
   - **Role:** Processes the uploaded audio file by transcribing it.
   - **Interaction:** The Lambda function is triggered by the S3 event. It loads the Whisper model and transcribes the audio file.

3. **Whisper Model:**
   - **Role:** Machine learning model used for transcribing audio.
   - **Interaction:** The model is loaded within the Lambda function to process the audio and generate a transcription.

4. **Secondary S3 Bucket:**
   - **Role:** Storage for the transcriptions.
   - **Interaction:** After the transcription is completed, the Lambda function saves the transcription to this S3 bucket.

### Workflow Steps

1. **Trigger Event:**
   - An audio file is uploaded to the primary S3 bucket, triggering an event.

2. **Lambda Invocation:**
   - The S3 event invokes the Lambda function.

3. **Transcription Process:**
   - The Lambda function loads the Whisper model.
   - The audio file is processed and transcribed by the Whisper model.

4. **Save Transcription:**
   - The transcription is saved to the secondary S3 bucket.

### Goal of Interactions

The interactions between these components automate the transcription of audio files, providing a seamless and efficient process for handling audio data. The goal is to ensure that any audio file uploaded to the S3 bucket is quickly and accurately transcribed, with the results stored for easy access and further use.