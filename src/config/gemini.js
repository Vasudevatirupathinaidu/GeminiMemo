// The API_KEY is imported from the "apikey" module.
// Ensure you get this API key from the GEMINI API.
import API_KEY from "./apikey";

// Import necessary modules and enums from the @google/generative-ai package
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize the API key
const apiKey = API_KEY;

// Create a new instance of the GoogleGenerativeAI class
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model from the GoogleGenerativeAI instance
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Configuration for text generation
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

// Define the run function to handle prompt input and generate a response
async function run(prompt) {
  // Define safety settings to handle different harm categories
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  try {
    // Start a new chat session with the model using the generationConfig and safetySettings
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    // Send the prompt to the model and get the result
    const result = await chatSession.sendMessage(prompt);

    // Extract and return the response text
    const response = result.response;
    return response.text();
  } catch (error) {
    console.log("Error occurred:", error);

    // Check for API KEY INVALID
    if (error.message.includes("API_KEY_INVALID")) {
      console.error(
        "Error: The provided API key is invalid. Check your API key and regenerate if necessary."
      );
    }

    // Handle specific error codes
    if (error.code) {
      switch (error.code) {
        case "INVALID_ARGUMENT":
          console.error(
            "Error: The request body is malformed. Check the API reference for details."
          );
          break;
        case "PERMISSION_DENIED":
          console.error(
            "Error: Your API key doesn't have the required permissions. Check your key and access."
          );
          break;
        case "NOT_FOUND":
          console.error(
            "Error: The requested resource wasn't found. Check your request parameters."
          );
          break;
        case "RESOURCE_EXHAUSTED":
          console.error(
            "Error: You've exceeded the rate limit. Ensure you're within the model's limit or request a quota increase."
          );
          break;
        case "INTERNAL":
          console.error(
            "Error: An unexpected error occurred on Google's side. Please wait and retry."
          );
          break;
        case "UNAVAILABLE":
          console.error(
            "Error: The service may be overloaded. Please wait and retry."
          );
          break;
        default:
          console.error("An unknown error occurred. Please try again later.");
      }
    } else {
      console.log("An error occurred during generation. Please try again.");
    }

    return null;
  }
}

export default run;
