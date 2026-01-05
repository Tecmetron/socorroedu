// Configuração do cliente Gemini API
const GEMINI_API_KEY = "AIzaSyAurRsjrXtAgShtZY4MVYzgyNRX4-0dyZY";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

class GeminiClient {
  private apiKey: string;
  private apiUrl: string;
  private conversationHistory: GeminiMessage[] = [];

  constructor(apiKey: string, apiUrl: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async sendMessage(
    userMessage: string,
    subject?: string,
    systemPrompt?: string
  ): Promise<string> {
    try {
      // Adicionar mensagem do usuário ao histórico
      this.conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      // Preparar o prompt do sistema se fornecido
      let messages = this.conversationHistory;
      if (systemPrompt && messages.length === 1) {
        messages = [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nPergunta do aluno: ${userMessage}`,
              },
            ],
          },
        ];
      }

      const request: GeminiRequest = {
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      };

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        let errorMessage = `API Error: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.error?.message || error.message || errorMessage;
        } catch (e) {
          // Se não conseguir fazer parse do JSON, usa a mensagem padrão
        }
        console.error("Gemini API Error Response:", errorMessage);
        throw new Error(errorMessage);
      }

      const data: GeminiResponse = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content.parts[0]
      ) {
        throw new Error("Invalid response from Gemini API");
      }

      const assistantMessage = data.candidates[0].content.parts[0].text;

      // Adicionar resposta do modelo ao histórico
      this.conversationHistory.push({
        role: "model",
        parts: [{ text: assistantMessage }],
      });

      return assistantMessage;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): GeminiMessage[] {
    return this.conversationHistory;
  }

  setHistory(history: GeminiMessage[]): void {
    this.conversationHistory = history;
  }
}

export const geminiClient = new GeminiClient(GEMINI_API_KEY, GEMINI_API_URL);
