import React, { useEffect, useRef, useState } from "react";
import * as webllm from "@mlc-ai/web-llm";
import "remixicon/fonts/remixicon.css";

const App = () => {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [engine, setEngine] = useState(null);
  const messageBox = useRef(null);

  useEffect(() => {
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";
    webllm
      .CreateMLCEngine(selectedModel, {
        initProgressCallback: (initProgress) => {
          console.log("initProgress", initProgress);
        },
      })
      .then((engine) => {
        setEngine(engine);
        console.log("engine", engine);
      });
  }, []);

  async function messageLLm() {
    if (!engine) return;
    try {
      const tempMessages = [...messages];
      tempMessages.push({
        role: "user",
        content: input,
      });

      setMessages(tempMessages);
      setInput("");

      const reply = await engine.chat.completions.create({
        messages: tempMessages,
      });

      setMessages([
        ...tempMessages,
        {
          role: "assistant",
          content: reply.choices[0].message.content,
        },
      ]);
      // console.log(reply.choices[0].message.content);
    } catch (error) {
      console.error("Error in messageLLM:", error);
    }
    scrollToBottom();
  }
  function scrollToBottom() {
    setTimeout(() => {
      if (messageBox.current) {
        messageBox.current.scrollTop = messageBox.current.scrollHeight;
      }
    }, 100);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="h-dvh w-screen bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-800 p-3 sm:p-4 border-b border-gray-700">
        <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center">
          SolveX
        </h1>
      </div>

      {/* Conversation Area */}
      <div
        ref={messageBox}
        className="flex-1 overflow-y-auto scrollbar-hide p-2 sm:p-4 md:p-6 min-h-0"
      >
        <div className="max-w-full sm:max-w-4xl mx-auto space-y-2 sm:space-y-3 pb-2">
          {messages.map((message, index) => {
            return (
              <div
                className={`message-box flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
                key={index}
              >
                <div
                  className={`${
                    message.role === "assistant"
                      ? "bg-slate-700 text-white"
                      : "bg-blue-600 text-white"
                  } p-2 sm:p-3 rounded-lg max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] break-words`}
                >
                  <div className="text-xs sm:text-sm md:text-base leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-2 sm:p-3 md:p-4 bg-gray-900 border-t border-gray-800 safe-area-inset-bottom">
        <div className="max-w-full sm:max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                messageLLm();
              }
            }}
            value={input}
            type="text"
            placeholder="Type your message here..."
            className="flex-1 h-9 sm:h-10 md:h-12 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl 
              text-white placeholder:text-slate-400 bg-slate-800 
              border border-slate-600 focus:border-blue-500 focus:outline-none 
              focus:ring-1 focus:ring-blue-500 transition-all duration-200
              text-xs sm:text-sm md:text-base"
          />
          <button
            onClick={() => messageLLm()}
            className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg bg-blue-600 
              hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center 
              transition-all duration-200 flex-shrink-0 touch-manipulation"
          >
            <i className="ri-send-plane-2-fill text-white text-sm sm:text-base md:text-lg"></i>
          </button>
        </div>
      </div>
    </main>
  );
};

export default App;
