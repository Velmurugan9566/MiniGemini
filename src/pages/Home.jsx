import axios from 'axios';
import React, {useState,useEffect} from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from './ChatHistory';

function App(){
    const [listening,setListening] = useState(false)
    const [data,setData] = useState({})
    const [userInput, setUserInput] = useState();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

    const startListening =()=>{
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        setListening(true)
    }
    const stopListening=()=>{
        SpeechRecognition.stopListening(); setListening(false)
    }
    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

      useEffect(() => {
        if (!transcript) return;
        setUserInput(transcript)
        const timer = setTimeout(() => {
          resetTranscript();
        }, 5000);
        return () => clearTimeout(timer);
      }, [transcript]);

      if (!browserSupportsSpeechRecognition) {
        return alert("Browser doesn't support speech recognition.");
      }
      
      const genAI = new GoogleGenerativeAI(
       "AIzaSyDxEY6xF52EuDEJIDBQFlAa69_pJFIlkJE"
      );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const sendMessage = async () => {
    if (userInput.trim() === "") return;
    setIsLoading(true);
    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      console.log(response);
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setSuggestions([])
      setUserInput("");
      setIsLoading(false);
    }
  };
  console.log(chatHistory)
  const fetchSuggestions = async () => {
    if (!userInput.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php`,
        {
          params: {
            action: 'opensearch',
            format: 'json',
            search: userInput,
            origin: '*',
          },
        }
      );
      setSuggestions(response.data[1]);
    } catch (error) {
      console.error('Error fetching Wikipedia suggestions:', error.message);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
    if(userInput.length <0){
      setSuggestions([])
    }
  }, [userInput]);

  const clearChat = () => {
    setChatHistory([]);
  };
      
    return(
        <>
        <div className='box-container'>
        <button name='btn' className='voicebtn' onClick={listening?stopListening:startListening } > {listening?( <span>stop</span>):(<span>Ask</span>) }</button>
        <input type='text' className='inputbox' onChange={(e)=>setUserInput(e.target.value)} value={transcript || userInput} placeholder='Transcript...' ></input> 
        <button onClick={sendMessage} className='searchbtn'>Search</button>
        <ul style={{ listStyleType: 'none', padding: 0 }} className='suggestionbox'>
        {suggestions.map((suggestion, index) => (
          <li key={index} style={{ padding: '5px 0' }} onClick={(e)=>setUserInput(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
      </div>
        <div className="chat-container">
        {isLoading ?(
          <span className='processtag'>Processing</span>
        ):(<></> )}
        <ChatHistory chatHistory={chatHistory} />

      </div>
        
        <button onClick={clearChat} className='clrbtn'>Clear</button>
        </>
    )
}

export default App;