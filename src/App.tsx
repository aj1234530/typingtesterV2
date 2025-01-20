import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import { GenereateRandomParagraph } from "./libs/ParagraphGenerator";
function App() {
  //useEffect for the getting the value of first word element ,//i tried many ways like from words ref getting by boundingclientrect but giving type error as the the component was not mounted
  //using useEffect(withour dependency) we can get, as after the component has been rendered to the DOM, but not immediately during the render phase.
  //prettier-ignore
  useEffect(() => {
    cursorPosition.current.x = wordsElementRef.current[activeWord.current].getBoundingClientRect().left;
    cursorPosition.current.y = wordsElementRef.current[activeWord.current].getBoundingClientRect().top;
    cursor.current? (cursor.current.style.transform = `translate(${cursorPosition.current.x}px,${cursorPosition.current.y}px)`): null;
  }, []);

  const [paragraph, setParagraph] = useState(GenereateRandomParagraph());
  const words = useRef(paragraph.split(" "));
  const inputRef = useRef<HTMLInputElement>(null); //The generic <HTMLInputElement> defines the type of the value after the component mounts. //The generic <HTMLInputElement> defines the type of the value after the component mounts.
  const activeWord = useRef(0);
  const letterNodes = useRef({ noOfNodes: 0, currentNode: 0 });
  const wordsElementRef = useRef<HTMLDivElement[]>([]);
  const childNodes = useRef<HTMLElement[]>([]);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const cursor = useRef<HTMLDivElement | null>(null); //cursor refernce
  
  const stats = useRef({
    noOfCorrectWords: 0,
    noOfIncorrectWords: 0,
    noOfWordsTyped: 0,
    netTypingSpeed: 0,
    grossTypingSpeed: 0,
    accuracy: 0,
  });
  console.log(wordsElementRef.current);
  const letterElementRef = useRef<HTMLSpanElement | null>(null);
  //prettier-ignore
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(stats.current);
    if (inputRef.current?.value.trim().length === 0 && e.key === " ") {
      e.preventDefault(); // Prevent space from being typed as the first character
    }
    //check if the word is last in para
    else if (inputRef.current && e.key === " " && activeWord.current === words.current.length - 1 ) {
      //check if the word is correct
      if (inputRef.current.value.trim() === words.current[activeWord.current]) {
        stats.current.noOfCorrectWords++;
        //reseting the letter nodes
        letterNodes.current.currentNode = 0;
        letterNodes.current.noOfNodes = 0;
        wordsElementRef.current[activeWord.current].style.color = "green";
      } else {
        wordsElementRef.current[activeWord.current].style.color = "red";
        stats.current.noOfIncorrectWords++;
      }
      //game over logic
      stats.current.accuracy =
        (stats.current.noOfCorrectWords / words.current.length) * 100;
      setTimeout(() => {
        alert("hi");
      }, 0);
    } 
    //NOTE - impact of space when the space is pressed(handle correct, inc , checing if the length of input is not 0 i.e. the input is not empty after spaces )
    else if (inputRef.current && inputRef.current?.value.trim().length != 0 && e.key === " ") {
      if (inputRef.current.value.trim() === words.current[activeWord.current]) {
        stats.current.noOfCorrectWords++;
        wordsElementRef.current[activeWord.current].style.color = "green";
      } else {
        wordsElementRef.current[activeWord.current].style.color = "red";
        stats.current.noOfIncorrectWords++;
      }
      stats.current.noOfWordsTyped++; //for accuracy in rt
      stats.current.accuracy = (stats.current.noOfCorrectWords / stats.current.noOfCorrectWords) * 100;
      inputRef.current.value = "";
      activeWord.current++;

      //changing cursor position
      cursorPosition.current.y = wordsElementRef.current[activeWord.current].getBoundingClientRect().top;
      cursorPosition.current.x =wordsElementRef.current[activeWord.current].getBoundingClientRect().left;
      //updating cursor position
      cursor.current ? (cursor.current.style.transform = `translate(${cursorPosition.current.x}px,${cursorPosition.current.y}px)`) : null;
    }
  };

  //prettier-ignore
  const handleTypingBusinessLogic = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    wordsElementRef.current[activeWord.current].style.fontWeight = "bold";
    //letter node increasing  
    if(inputRef.current?.value.trim().length === 1){
letterNodes.current.currentNode = 0;
      letterNodes.current.noOfNodes = 0;
    }
    // if (letterNodes.current.currentNode < letterNodes.current.noOfNodes) {
    //   letterNodes.current.currentNode++;
    // }
    if (inputRef.current && inputRef.current?.value.trim().length === 1) {

      //TODO - revise this onefiletr the node and save(from gpt)
      childNodes.current  = Array.from(wordsElementRef.current[activeWord.current].childNodes) .filter((node): node is HTMLElement => node instanceof HTMLElement);
      // const childNodes = 
      letterNodes.current.noOfNodes = childNodes.current.length;
      
     
      // if (
      //   words.current[activeWord.current].length < inputRef.current.value.length
      // ) {
      // }
    //   cursor.current
    //     ? (cursor.current.style.transform = `translate(${cursorPosition.current.x}px,${cursorPosition.current.y}px)`)
    //     : null;
    // }
   }
   if (childNodes.current[letterNodes.current.currentNode] instanceof HTMLElement) {
    cursorPosition.current.x = (childNodes.current[letterNodes.current.currentNode] as HTMLElement).getBoundingClientRect().right;
    cursorPosition.current.y = (childNodes.current[letterNodes.current.currentNode] as HTMLElement).getBoundingClientRect().top;
    console.log('child node', letterNodes.current)
    cursor.current?(cursor.current.style.transform = `translate(${cursorPosition.current.x}px,${cursorPosition.current.y}px)`): null;
    letterNodes.current.currentNode++
    console.log("sdfjsldfjsldfjl;asdf",childNodes.current.length,letterNodes.current)
  }
  };

  return (
    <div>
      <div className="h-screen w-screen bg-red-500 flex flex-col">
        <nav className="h-12 w-full  bg-blue-800 flex items-center ">
          <div className="text-white pl-2 text-lg"> ⌨️ TYPE.sh</div>
        </nav>
        <main className="h-[calc(100%-3rem)] bg-blue-100 w-full ">
          <button
            className="border rounded bg-blue-700 text-white p-2 "
            onClick={() => alert("hi")}
          >
            Change Paragraph
          </button>
          <TypingStats stats={stats} />
          <div className="flex flex-col justify-center h-1/2 w-full ">
            <div
              className=" typing-para max-w-[600px] p-2  flex flex-row gap-1 "
              id=""
            >
              {paragraph &&
                paragraph.split(" ").map((word, index) => (
                  <div
                    //   for referencing it is storedin the the useRef
                    ref={(word) => {
                      if (word) wordsElementRef.current[index] = word;
                    }}
                    key={index}
                    id={`${index}`}
                    className=" word flex flex-row"
                  >
                    {word.split("").map((letter, index) => (
                      <span
                        className="letter"
                        key={index}
                        ref={letterElementRef}
                      >
                        {" "}
                        {letter}
                      </span>
                    ))}
                  </div>
                ))}
            </div>
            {/* after on blur impl i can happily m  ake opacity 0 */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Type here..."
              className="opacity-1"
              autoFocus
              onPaste={(e) => e.preventDefault()}
              onKeyDown={handleKeyDown}
              onChange={handleTypingBusinessLogic}
              //   onKeyDown={(e) => currentKeyPressed.current= e.key}
              onBlur={() => inputRef.current?.focus()}
            ></input>{" "}
          </div>
        </main>
      </div>
      <div
        ref={cursor}
        style={{
          position: "fixed",
          width: "2px",
          height: "20px",
          top: cursorPosition.current.y,
          left: cursorPosition.current.x,
          background: "blue",
          transition: "transform 0.1s linear", // Smooth movement
        }}
      ></div>
    </div>
  );
}

export default App;

function TypingStats({ stats }: { stats: any }) {
  console.log(stats);
  const [netSpeed] = useState(stats.current.accuracy);
  return (
    <div className="typing-stats-section  h-12 w-full border rounded h">
      Stats :<span>Accuracy: </span>
      <span>Net Speed:{netSpeed}</span>
      <span>Gross Speed:</span>
    </div>
  );
}

//cursor position
//1. active word

//increase the letter
