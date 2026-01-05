import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Trash2, BookOpen, Lightbulb } from "lucide-react";
import { geminiClient } from "@/lib/geminiClient";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  subject: string;
  onBack: () => void;
}

const SUBJECT_PROMPTS: Record<string, string> = {
  Matemática:
    "Você é um professor de Matemática especializado em ensino para alunos do ensino fundamental e médio. Explique conceitos de forma clara, use exemplos práticos e alinhados à BNCC. Sempre ofereça exercícios para praticar.",
  Português:
    "Você é um professor de Português especializado em literatura, gramática e interpretação de textos. Explique regras gramaticais com exemplos, analise obras literárias e ajude com redação. Sempre alinhado à BNCC.",
  Ciências:
    "Você é um professor de Ciências especializado em biologia, física e química. Explique conceitos científicos de forma clara, use analogias do dia a dia e sempre relacione com aplicações práticas.",
  História:
    "Você é um professor de História especializado em história do Brasil e mundial. Explique eventos históricos com contexto, analise causas e consequências, e sempre relacione com o presente.",
  Geografia:
    "Você é um professor de Geografia especializado em geografia física e humana. Explique conceitos geográficos, analise mapas e dados, e sempre relacione com a realidade brasileira.",
  Inglês:
    "Você é um professor de Inglês. Ajude com gramática, vocabulário, pronúncia e conversação. Sempre ofereça exemplos práticos e exercícios para melhorar o aprendizado.",
};

export default function ChatInterface({ subject, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focar no input ao carregar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = SUBJECT_PROMPTS[subject] || SUBJECT_PROMPTS.Matemática;
      const response = await geminiClient.sendMessage(input, subject, systemPrompt);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    geminiClient.clearHistory();
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="border-b border-blue-100 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {subject}
              </h2>
              <p className="text-sm text-gray-500">Aprenda com IA</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Lightbulb className="w-16 h-16 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Comece a aprender!
              </h3>
              <p className="text-gray-500 max-w-md">
                Faça perguntas sobre {subject.toLowerCase()} e receba respostas
                personalizadas com base na BNCC.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <Card
                    className={`max-w-2xl p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-3xl rounded-tr-none"
                        : "bg-white border border-blue-100 rounded-3xl rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </Card>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="bg-white border border-blue-100 rounded-3xl rounded-tl-none shadow-sm p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-600">Pensando...</p>
                    </div>
                  </Card>
                </div>
              )}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-blue-100 bg-white shadow-lg">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Faça uma pergunta sobre ${subject}...`}
              disabled={isLoading}
              className="rounded-full border-2 border-blue-200 focus:border-blue-600 focus:ring-0 px-6 py-3 text-base"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
