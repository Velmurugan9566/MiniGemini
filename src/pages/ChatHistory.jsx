import React,{useState,useEffect} from "react";
import ReactMarkdown from "react-markdown";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
const ChatHistory = ({ chatHistory }) => {
    const [isSpeak,setIsSpeak] =useState(false)
    const speak = (text) => {
        if(isSpeak){
            setIsSpeak(false)
            speechSynthesis.cancel();
            return
        }
        setIsSpeak(true)
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
      };
  return (
    <>
      {chatHistory.map((message, index) => (
        <div
          key={index}>
          {message.type === "user" && (
            <span>You:</span>
          )}
          <div  key={index}>
            <ReactMarkdown>{message.message}</ReactMarkdown>
            <button onClick={()=>{speak(message.message);}} className="speakbtn">{isSpeak ?(<span>Stop</span>):(<span>Speak</span>)}</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatHistory;