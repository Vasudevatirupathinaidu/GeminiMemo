# Gemini Memo

Gemini Memo is a web tool that integrates with the Gemini API to create and manage digital memo - memorandum (sticky notes) with customizable colors and drag-and-drop functionality. This application is perfect for organizing information, brainstorming ideas, and creating mind maps.

## Features

- [x] Create and manage sticky notes based on Gemini API responses.
- [x] Customize note colors and positions on the screen.
- [x] Drag-and-drop functionality for easy note management.
- [ ] An infinite canvas with drag functionality will be added.
- [ ] Ability to connect notes with arrows to create mind maps will be added.

## Installation

Follow these steps to set up Gemini Memo on your local machine:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/gemini-memo.git
   cd gemini-memo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The app will now be running on `http://localhost:3000`.

## Usage

1. Enter a question in the input field to fetch information from the Gemini API.
2. Each question's response will be displayed as a sticky note.
3. Drag and drop notes on the screen to organize them.
4. Customize note colors and connect them with arrows to create mind maps.

## Configuration

To use the Gemini API, you need to set up your API key in a `.env` file at the root of the project:

```plaintext
REACT_APP_GEMINI_API_KEY=your-api-key-here
```
