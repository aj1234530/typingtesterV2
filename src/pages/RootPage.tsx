import { useEffect, useRef, useState } from "react";
import "../App.css";
import { GenereateRandomParagraph } from "../libs/ParagraphGenerator";
function RootPage() {
  //useEffect for the getting the value of first word element ,//i tried many ways like from words ref getting by boundingclientrect but giving type error as the the component was not mounted
  //using useEffect(withour dependency) we can get, as after the component has been rendered to the DOM, but not immediately during the render phase.
  //prettier-ignore
  useEffect(() => {
    cursorPosition.current.x = wordsElementRef.current[activeWord.current].getBoundingClientRect().left;
    cursorPosition.current.y = wordsElementRef.current[activeWord.current].getBoundingClientRect().top;
    cursor.current? (cursor.current.style.transform = `translate(${cursorPosition.current.x}px,${cursorPosition.current.y}px)`): null;
  }, []);

  const [paragraph] = useState(GenereateRandomParagraph()); //not destructing setPara as it is not neede
  const words = useRef(paragraph.split(" "));
  const inputRef = useRef<HTMLInputElement>(null); //The generic <HTMLInputElement> defines the type of the value after the component mounts. //The generic <HTMLInputElement> defines the type of the value after the component mounts.
  const activeWord = useRef(0);
  const letterNodes = useRef({ noOfNodes: 0, currentNode: 0 });
  const currentKeyPressed = useRef<string | null>(null);
  const wordsElementRef = useRef<HTMLDivElement[]>([]);
  const childNodes = useRef<HTMLElement[]>([]);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const cursor = useRef<HTMLDivElement | null>(null); //cursor refernce

  const stats = useRef({
    typingStarted: false,
    startTime: 0,
    noOfCorrectWords: 0,
    noOfIncorrectWords: 0,
    noOfWordsTyped: 0,
    netTypingSpeed: 0,
    grossTypingSpeed: 0,
    accuracy: 0,
  });
  //stats ref to pass props
  const accuracySpanRef = useRef<null | HTMLSpanElement>(null);
  const netSpeedSpanRef = useRef<null | HTMLSpanElement>(null);
  const grossSpeedSpanRef = useRef<null | HTMLSpanElement>(null);

  const letterElementRef = useRef<HTMLSpanElement | null>(null);
  //prettier-ignore
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //saving key to ref to be used later for color change
    if(e.key != " "){
      currentKeyPressed.current = e.key
    }
    if(!stats.current.typingStarted){
      stats.current.startTime = Date.now();
      stats.current.typingStarted = true;
    }
    console.log(stats.current);

    if (e.key === "Backspace") { e.preventDefault(); }
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
      stats.current.accuracy =Math.ceil((stats.current.noOfCorrectWords / words.current.length) * 100);
      stats.current.grossTypingSpeed = Math.ceil(stats.current.noOfWordsTyped / ((Date.now() - stats.current.startTime) / (1000 * 60))); 
      grossSpeedSpanRef.current && (grossSpeedSpanRef.current.textContent = `${stats.current.grossTypingSpeed}`)

      //why st - as was alert first and color thing later
      setTimeout(() => {
        alert(`Game Over: Accuracy: ${stats.current.accuracy}, Net Speed: ${stats.current.netTypingSpeed}, Gross Speed: ${stats.current.grossTypingSpeed}`);
        window.location.reload();
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
      stats.current.accuracy = Math.ceil((stats.current.noOfCorrectWords / stats.current.noOfWordsTyped ) * 100);
      stats.current.netTypingSpeed = Math.ceil(
        (stats.current.noOfCorrectWords - stats.current.noOfIncorrectWords) /
        ((Date.now() - stats.current.startTime) / (1000 * 60))
      );

      inputRef.current.value = "";
      activeWord.current++;
      //changing cursor position
      cursorPosition.current.y = wordsElementRef.current[activeWord.current].getBoundingClientRect().top;
      cursorPosition.current.x =wordsElementRef.current[activeWord.current].getBoundingClientRect().left;
      //updating cursor position
      cursor.current ? (cursor.current.style.transform = `translate(${cursorPosition.current.x}px,${cursorPosition.current.y}px)`) : null;
      //prevent cursor's position change by handle businnes logic, if not preventvented the cursor won't go to the next word(will go and again will reset to prev position) 
      e.preventDefault() 
      accuracySpanRef.current && (accuracySpanRef.current.textContent = `${stats.current.accuracy}`);
      netSpeedSpanRef.current && (netSpeedSpanRef.current.textContent = `${stats.current.netTypingSpeed }`);

    } 
  };
  //prettier-ignore
  const handleTypingBusinessLogic = () => {
    wordsElementRef.current[activeWord.current].style.fontWeight = "bold";
    //letter node increasing  
    if(inputRef.current?.value.trim().length === 1){
      letterNodes.current.currentNode = 0;
      letterNodes.current.noOfNodes = 0;
    }
    if (inputRef.current && inputRef.current?.value.trim().length === 1) {
      //TODO - revise this one filetr the node and save(- from gpt)
      //setting the 
      // Array.from() is a static method that creates a new array instance
      childNodes.current  = Array.from(wordsElementRef.current[activeWord.current].childNodes) .filter((node): node is HTMLElement => node instanceof HTMLElement);
      letterNodes.current.noOfNodes = childNodes.current.length;
   }

   //changing the indivdual letter color , //just evaluting the current child node with the key pressed
   if (childNodes.current[letterNodes.current.currentNode] instanceof HTMLElement) {
    console.log(currentKeyPressed.current, childNodes.current[letterNodes.current.currentNode])
    if(childNodes.current[letterNodes.current.currentNode].textContent?.trim() ==  currentKeyPressed.current){

      childNodes.current[letterNodes.current.currentNode].style.color = "green";
    }else{
      childNodes.current[letterNodes.current.currentNode].style.color = "red";

    }
   }

   if (childNodes.current[letterNodes.current.currentNode] instanceof HTMLElement) {
    cursorPosition.current.x = (childNodes.current[letterNodes.current.currentNode] as HTMLElement).getBoundingClientRect().right;
    cursorPosition.current.y = (childNodes.current[letterNodes.current.currentNode] as HTMLElement).getBoundingClientRect().top;
    cursor.current?(cursor.current.style.transform = `translate(${cursorPosition.current.x}px,${cursorPosition.current.y}px)`): null;
    letterNodes.current.currentNode++
  }
  };
  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col font-mono">
      <nav className="h-12 w-full bg-blue-800 flex items-center shadow-lg">
        <div className="text-white pl-4 text-xl font-bold tracking-wide">
          ⌨️ TYPE.sh
        </div>
      </nav>
      <main className="h-[calc(100%-3rem)] bg-gray-800 w-full flex flex-col items-center justify-center text-white">
        <button
          className="border rounded bg-blue-700 hover:bg-blue-600 transition px-6 py-2 mb-6 shadow-md"
          onClick={() => window.location.reload()}
        >
          Change Paragraph
        </button>
        <TypingStats
          accuracySpanRef={accuracySpanRef}
          grossSpeedSpanRef={grossSpeedSpanRef}
          netSpeedSpanRef={netSpeedSpanRef}
        />
        <div className="flex flex-col justify-center items-center h-1/2 w-full">
          <div className="max-w-[600px] p-4 flex flex-wrap gap-2 bg-gray-700 rounded-lg shadow-lg">
            {paragraph &&
              paragraph.split(" ").map((word, index) => (
                <div
                  ref={(word) =>
                    word && (wordsElementRef.current[index] = word)
                  }
                  key={index}
                  className="flex"
                >
                  {word.split("").map((letter, idx) => (
                    <span
                      className="text-xl text-gray-300 font-semibold tracking-wide"
                      key={idx}
                      ref={letterElementRef}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              ))}
          </div>
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute"
            autoFocus
            onPaste={(e) => e.preventDefault()}
            onKeyDown={handleKeyDown}
            onChange={handleTypingBusinessLogic}
            onBlur={() => inputRef.current?.focus()}
          />
        </div>
      </main>
      <div
        ref={cursor}
        style={{
          position: "fixed",
          width: "3px",
          height: "22px",
          top: cursorPosition.current.y,
          left: cursorPosition.current.x,
          background: "cyan",
          borderRadius: "2px",
          transition: "transform 0.1s linear",
        }}
      />
    </div>
  );
}

export default RootPage;

function TypingStats({
  accuracySpanRef,
  netSpeedSpanRef,
  grossSpeedSpanRef,
}: {
  accuracySpanRef: React.MutableRefObject<null | HTMLSpanElement>;
  netSpeedSpanRef: React.MutableRefObject<null | HTMLSpanElement>;
  grossSpeedSpanRef: React.MutableRefObject<null | HTMLSpanElement>;
}) {
  return (
    <div className="h-12 w-full flex items-center justify-center gap-6 bg-gray-800 text-white text-lg font-mono tracking-wide shadow-md rounded-md p-2">
      <span>
        Accuracy:{" "}
        <span className="font-bold text-blue-400" ref={accuracySpanRef}></span>
      </span>
      <span>
        Net Speed:{" "}
        <span className="font-bold text-green-400" ref={netSpeedSpanRef}></span>
      </span>
      <span>
        Gross Speed:{" "}
        <span
          className="font-bold text-yellow-400"
          ref={grossSpeedSpanRef}
        ></span>
      </span>
    </div>
  );
}
