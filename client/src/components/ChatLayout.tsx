import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Send,
  Plus,
  Menu,
  X,
  MessageSquare,
  BookMarked,
  Beaker,
  Globe,
  Landmark,
  Languages,
  Pencil,
  Calculator,
  Palette,
  Moon,
  Sun,
} from "lucide-react";
import { geminiClient } from "@/lib/geminiClient";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  date: string;
}

const SUBJECTS = [
  { id: "portugues", name: "Português", icon: BookMarked },
  { id: "matematica", name: "Matemática", icon: Calculator },
  { id: "ciencias", name: "Ciências", icon: Beaker },
  { id: "historia", name: "História", icon: Landmark },
  { id: "geografia", name: "Geografia", icon: Globe },
  { id: "ingles", name: "Inglês", icon: Languages },
  { id: "artes", name: "Artes", icon: Palette },
  { id: "redacao", name: "Redação", icon: Pencil },
];

const SUBJECT_PROMPTS: Record<string, string> = {
  Português:
    "Você é um professor de Português especializado em literatura, gramática e interpretação de textos. Explique regras gramaticais com exemplos, analise obras literárias e ajude com redação. Sempre alinhado à BNCC.",
  Matemática:
    "Você é um professor de Matemática especializado em ensino para alunos do ensino fundamental e médio. Explique conceitos de forma clara, use exemplos práticos e alinhados à BNCC. Sempre ofereça exercícios para praticar.",
  Ciências:
    "Você é um professor de Ciências especializado em biologia, física e química. Explique conceitos científicos de forma clara, use analogias do dia a dia e sempre relacione com aplicações práticas.",
  História:
    "Você é um professor de História especializado em história do Brasil e mundial. Explique eventos históricos com contexto, analise causas e consequências, e sempre relacione com o presente.",
  Geografia:
    "Você é um professor de Geografia especializado em geografia física e humana. Explique conceitos geográficos, analise mapas e dados, e sempre relacione com a realidade brasileira.",
  Inglês:
    "Você é um professor de Inglês. Ajude com gramática, vocabulário, pronúncia e conversação. Sempre ofereça exemplos práticos e exercícios para melhorar o aprendizado.",
  Artes:
    "Você é um professor de Artes. Ensine sobre história da arte, técnicas artísticas, movimentos artísticos e ajude a desenvolver criatividade. Sempre relacione com contexto cultural.",
  Redação:
    "Você é um professor especializado em redação. Ajude com estrutura de textos, argumentação, coesão e coerência. Ofereça feedback construtivo sobre redações e dicas de melhoria.",
};

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("Português");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Conversa anterior",
      date: "Hoje",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detectar preferência de dark mode do sistema
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Aplicar dark mode ao documento
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fechar sidebar em mobile quando redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focar no input
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
      const systemPrompt =
        SUBJECT_PROMPTS[selectedSubject] || SUBJECT_PROMPTS.Português;
      const response = await geminiClient.sendMessage(
        input,
        selectedSubject,
        systemPrompt
      );

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

  const handleNewConversation = () => {
    setMessages([]);
    geminiClient.clearHistory();
    inputRef.current?.focus();
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""} bg-white dark:bg-gray-900`}>
      {/* Overlay para mobile quando sidebar está aberta */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsivo */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } fixed lg:relative z-40 lg:z-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 overflow-hidden h-screen lg:h-auto`}
      >
        {/* Logo e Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <img
              src="/socorroedu-logo.png"
              alt="SocorroEdu"
              className="h-12 w-auto"
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
          </div>
          <Button
            onClick={handleNewConversation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova conversa
          </Button>
        </div>

        {/* Conversas */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {conv.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{conv.date}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              P
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Paulo
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Aluno</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Bar */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            )}
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {selectedSubject}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={isDarkMode ? "Modo claro" : "Modo escuro"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className="hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova conversa
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900">
          <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-96 text-center">
                <div className="pt-8 sm:pt-16">
                  <img
                    src="/profsiri-mascote.png"
                    alt="Prof Siri"
                    className="h-32 sm:h-40 w-auto mx-auto mb-4 sm:mb-6"
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Bem-vindo ao SocorroEdu! 👋
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-md px-2">
                  Eu sou o{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    Prof Siri
                  </span>
                  , seu assistente de estudos! Selecione uma matéria abaixo e me faça
                  qualquer pergunta.
                </p>

                {/* Sugestões */}
                <div className="mb-6 sm:mb-8 w-full px-2">
                  <p className="text-sm sm:text-base text-yellow-500 dark:text-yellow-400 font-semibold mb-3 sm:mb-4">
                    ✨ Sugestões para começar:
                  </p>
                  <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
                    <button
                      onClick={() => {
                        setInput("Me explique o que são frações");
                        inputRef.current?.focus();
                      }}
                      className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          Me explique o que são frações
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setInput("Quais são os planetas do sistema solar?");
                        inputRef.current?.focus();
                      }}
                      className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          Quais são os planetas do sistema solar?
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setInput("Me ajude a estudar verbos em inglês");
                        inputRef.current?.focus();
                      }}
                      className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors text-left"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Beaker className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          Me ajude a estudar verbos em inglês
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-sm md:max-w-2xl ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-none"
                      } px-4 py-3`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p className="text-sm">Pensando...</p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </>
            )}
          </div>
        </div>

        {/* Subjects Tabs - Responsivo */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 overflow-x-auto flex-shrink-0">
          <div className="flex gap-2 min-w-max">
            {SUBJECTS.map((subject) => {
              const Icon = subject.icon;
              return (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.name);
                    setMessages([]);
                    geminiClient.clearHistory();
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm sm:text-base ${
                    selectedSubject === subject.name
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{subject.name}</span>
                  <span className="sm:hidden text-xs">{subject.name.slice(0, 3)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Area - Responsivo */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-2 sm:gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Selecione uma matéria para começar..."
                disabled={isLoading}
                className="rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-600 focus:ring-0 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 sm:px-6 py-2 sm:py-3 font-semibold flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 sm:mt-3">
              O Prof Siri responde apenas conteúdos educacionais alinhados a BNCC
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
