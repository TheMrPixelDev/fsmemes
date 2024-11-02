import { Layer, Rect, Stage, Text } from 'react-konva';
import { useState } from 'react';
import { Caption } from './assets/Caption';

type DisplayText = {
  id: number;
  x: number;
  y: number;
  text: string;
  isDragging: boolean;
  isSelected: boolean;
};

function App() {
  const [texts, setTexts] = useState<DisplayText[]>([]);
  const [selectedText, setSelectedText] = useState<DisplayText | undefined>(
    undefined
  );

  const handleDragStart = (draggedText: DisplayText) => {
    setTexts(
      texts.map((text) => {
        return {
          ...text,
          isDragging: text.id === draggedText.id,
        };
      })
    );
  };

  const handleDragEnd = () => {
    setTexts(
      texts.map((text) => {
        return {
          ...text,
          isDragging: false,
        };
      })
    );
  };

  function addText(text: string) {
    setTexts([
      ...texts,
      {
        id: texts.length,
        text,
        x: Math.floor(window.innerWidth / 2),
        y: Math.floor(window.innerHeight / 2),
        isDragging: false,
        isSelected: false,
      },
    ]);
  }

  function removeText(id: number) {
    setTexts(texts.filter((text) => text.id !== id));
  }

  const selectText = (selectedText: DisplayText) => {
    setTexts(
      texts.map((text) => {
        if (selectedText.id === text.id) {
          console.log({
            ...text,
            isSelected: selectedText.id === text.id,
          });
        }

        return {
          ...text,
          isSelected: selectedText.id === text.id,
        };
      })
    );
  };

  return (
    <>
      <button onClick={() => addText('Text hier eingeben...')}>Add text</button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {texts.map((text, idx) => (
            <Caption
              isSelected={text.id === selectedText?.id}
              key={text.id}
              text={text.text}
              onSelect={() => setSelectedText(text)}
              shapeProps={{ x: text.x, y: text.y }}
              onChange={(shape) => {
                const newTexts = texts.map((currentText) => {
                  if (shape.)
                })
                
              }}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
}

export default App;
