from google import genai
from google.genai import types
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file, forcing override
load_dotenv(override=True)

SYSTEM_PROMPT = """
You are an expert Digital Filing Assistant. Your job is to analyze the provided document and extract key information into a strict JSON format.

1. Determine the 'category' of the document. Choose ONLY from: [Passport, ID Card, Receipt, Invoice, Contract, Bank Statement, Certificate, Report, Other].
2. Extract the 'issue_date' if present (format: YYYY-MM-DD). If not present, return null.
3. Extract the 'expiration_date' if present (format: YYYY-MM-DD). If not present, return null.
4. Extract all other relevant information into a nested JSON object called 'extracted_data'. 
   - You MUST extract an exhaustive list of metadata. Extract AT LEAST 10 different metadata key-value pairs (more if possible) for 'extracted_data'.
   - Include specific details like topics, keywords, people involved, organizations, key decisions, summary, tags, document title, author, departments, context, and any notable figures.
   - For a receipt: include merchant, total_amount, currency, taxes, items, payment_method, etc.
   - For a report: include project_name, authors, main_findings, summary, dates, action_items, etc.

You MUST respond ONLY with valid JSON. Do not include markdown formatting or explanations.
"""

def extract_document_metadata(file_path: str):
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("WARNING: GEMINI_API_KEY not found in environment.")
            return None

        print(f"Uploading {file_path} to Gemini for analysis using modern google-genai SDK...")
        
        # Initialize modern client
        client = genai.Client(api_key=api_key)
        
        # Determine MIME type based on file extension
        mime_type = "application/pdf"
        if file_path.lower().endswith(".jpg") or file_path.lower().endswith(".jpeg"):
            mime_type = "image/jpeg"
        elif file_path.lower().endswith(".png"):
            mime_type = "image/png"
            
        # Read the file directly to avoid File API upload quota/auth issues
        with open(file_path, "rb") as f:
            file_data = f.read()
            
        # Use a model we know works in the modern SDK
        model_name = "gemini-3.5-flash-lite"
        
        # Generate the response
        response = client.models.generate_content(
            model=model_name,
            contents=[
                SYSTEM_PROMPT,
                types.Part.from_bytes(data=file_data, mime_type=mime_type)
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # Parse the JSON response
        result = json.loads(response.text)
        print("Analysis complete successfully!")
        
        return result
    except Exception as e:
        error_str = str(e)
        clean_error = "An unexpected error occurred during AI processing."
        
        if "API_KEY_INVALID" in error_str or "API key not valid" in error_str or "400" in error_str:
            clean_error = "Invalid API Key. Please check your credentials."
        elif "quota" in error_str.lower() or "429" in error_str or "503" in error_str or "504" in error_str:
            clean_error = "API service is busy or quota exceeded. Please try again later."
        elif "JSON" in error_str or "parse" in error_str.lower():
            clean_error = "Failed to parse the AI response into structured data."
        else:
            clean_error = error_str[:100] + "..." if len(error_str) > 100 else error_str

        print(f"Error during AI extraction: {error_str}")
        return {
            "category": "Uncategorized",
            "extracted_data": {"ai_extraction_error": clean_error}
        }
