"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  answer: string; // correct answer
}

export default function QuizPage() {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        setCurrent(0);
        setUserAnswers([]);
        setFinished(false);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const updated = [...userAnswers, answer];
    setUserAnswers(updated);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrent(0);
    setUserAnswers([]);
    setFinished(false);
    setText("");
  };

  const score = userAnswers.filter(
    (ans, i) => ans === questions[i]?.answer
  ).length;

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quizify
              </span>
            </div>
            {/* <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Features</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Pricing</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">About</span>
            </div> */}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Hero Section */}
        {!questions.length && (
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              AI-Powered Learning
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
              Transform Notes into
              <br />
              <span className="relative">
                Interactive Quizzes
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Supercharge your studying with AI-generated quizzes. Simply paste your notes and get personalized questions instantly.
            </p>
          </div>
        )}

        {/* Input Section */}
        {!questions.length && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                📚 Your Study Material
              </label>
              <p className="text-gray-600 text-sm mb-4">
                Paste any text content - lecture notes, textbook chapters, or study guides
              </p>
            </div>
            
            <div className="relative">
              <textarea
                className="w-full p-6 border-2 border-gray-200 rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="✨ Paste your study material here and watch the magic happen..."
              />
              <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                {text.length} characters
              </div>
            </div>
            
            <button
              onClick={generateQuiz}
              disabled={!text.trim() || loading}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">Creating Your Quiz...</span>
                </>
              ) : (
                <>
                  <span>🚀 Generate Quiz</span>
                </>
              )}
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                AI-Powered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Instant Results
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Free to Use
              </div>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {!finished && questions.length > 0 && (
          <div>
            {/* Back Button */}
            <button
              onClick={resetQuiz}
              className="mb-6 text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
              ← Back to Generator
            </button>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8">
              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Question {current + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {Math.round(((current + 1) / questions.length) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((current + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 leading-relaxed">
                  {questions[current].question}
                </h2>
                <p className="text-gray-500 text-sm">Choose the best answer:</p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {questions[current].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left p-6 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all duration-200 flex items-center justify-center">
                        <div className="w-2 h-2 bg-transparent group-hover:bg-white rounded-full transition-all duration-200"></div>
                      </div>
                      <span className="text-gray-700 font-medium text-lg group-hover:text-blue-700 transition-colors">
                        {opt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {finished && (
          <div>
            {/* Back Button */}
            <button
              onClick={resetQuiz}
              className="mb-6 text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
              ← Create New Quiz
            </button>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8">
              {/* Score Header */}
              <div className="text-center mb-10">
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {scorePercentage}%
                    </span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  {scorePercentage >= 80 ? "🎉 Excellent Work!" : 
                   scorePercentage >= 60 ? "👍 Good Job!" : "📚 Keep Studying!"}
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  You scored {score} out of {questions.length} questions correctly
                </p>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Quiz completed with Quizify AI
                </div>
              </div>

              {/* Question Review */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">📋 Review Your Answers</h3>
                <div className="space-y-4">
                  {questions.map((q, i) => {
                    const correct = userAnswers[i] === q.answer;
                    return (
                      <div
                        key={i}
                        className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${
                            correct ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
                          }`}>
                            {correct ? '✓' : '✕'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-4 text-lg">
                              {i + 1}. {q.question}
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-500 font-medium text-sm">Your answer:</span>
                                <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                                  correct ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                                }`}>
                                  {userAnswers[i] || "No answer"}
                                </span>
                              </div>
                              {!correct && (
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-500 font-medium text-sm">Correct answer:</span>
                                  <span className="text-green-700 bg-green-100 font-medium px-3 py-1 rounded-full text-sm">
                                    {q.answer}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                >
                  🆕 Create New Quiz
                </button>
                <button
                  onClick={() => {
                    setCurrent(0);
                    setUserAnswers([]);
                    setFinished(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  🔄 Retake Quiz
                </button>
              </div>

              {/* Social Proof */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-sm mb-3">Join thousands of learners using Quizify</p>
                <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                  <span>⭐ 4.9/5 Rating</span>
                  <span>👥 50K+ Users</span>
                  <span>🧠 1M+ Quizzes Generated</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-white/60 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">Q</span>
              </div>
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quizify
              </span>
              <span className="text-gray-400 text-sm">- AI Quiz Generator</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 Quizify. Powered by AI for better learning.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}