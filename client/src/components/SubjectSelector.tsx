import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  BookMarked,
  Beaker,
  Globe,
  Landmark,
  Languages,
  Sparkles,
} from "lucide-react";

interface SubjectSelectorProps {
  onSelectSubject: (subject: string) => void;
}

const SUBJECTS = [
  {
    id: "matematica",
    name: "Matemática",
    icon: Calculator,
    color: "from-blue-500 to-blue-600",
    description: "Álgebra, Geometria, Cálculo",
  },
  {
    id: "portugues",
    name: "Português",
    icon: BookMarked,
    color: "from-purple-500 to-purple-600",
    description: "Literatura, Gramática, Redação",
  },
  {
    id: "ciencias",
    name: "Ciências",
    icon: Beaker,
    color: "from-green-500 to-green-600",
    description: "Biologia, Física, Química",
  },
  {
    id: "historia",
    name: "História",
    icon: Landmark,
    color: "from-amber-500 to-amber-600",
    description: "Brasil e Mundo",
  },
  {
    id: "geografia",
    name: "Geografia",
    icon: Globe,
    color: "from-teal-500 to-teal-600",
    description: "Física e Humana",
  },
  {
    id: "ingles",
    name: "Inglês",
    icon: Languages,
    color: "from-red-500 to-red-600",
    description: "Gramática e Conversação",
  },
];

export default function SubjectSelector({
  onSelectSubject,
}: SubjectSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10" />
            <h1 className="text-5xl font-bold">ReforçaJu</h1>
          </div>
          <p className="text-xl text-blue-100 mb-2">
            Plataforma Inteligente de Reforço Escolar
          </p>
          <p className="text-blue-100">
            Aprenda com IA personalizada, alinhada à BNCC
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Escolha uma Disciplina
          </h2>
          <p className="text-gray-600 text-lg">
            Selecione o assunto que deseja estudar e comece a aprender com
            inteligência artificial
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SUBJECTS.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card
                key={subject.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-0"
                onClick={() => onSelectSubject(subject.name)}
              >
                <div
                  className={`bg-gradient-to-br ${subject.color} h-32 flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                  <Icon className="w-16 h-16 text-white relative z-10 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {subject.description}
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg">
                    Começar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Por que escolher ReforçaJu?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">IA Inteligente</h4>
              <p className="text-gray-600">
                Respostas personalizadas com base em seu nível de aprendizado
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookMarked className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Alinhado à BNCC</h4>
              <p className="text-gray-600">
                Conteúdo alinhado à Base Nacional Comum Curricular
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Acesso Livre</h4>
              <p className="text-gray-600">
                Sem necessidade de cadastro, aprenda quando quiser
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            ReforçaJu © 2025 - Plataforma de Reforço Escolar Inteligente
          </p>
        </div>
      </div>
    </div>
  );
}
