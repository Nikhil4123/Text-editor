/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Undo2, Redo2, Bold, Italic, Minus, Plus, Type } from 'lucide-react';

const EditableTextBox = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [text, setText] = useState('Edit this text');
  const [fontSize, setFontSize] = useState(16);
  const [fontStyle, setFontStyle] = useState('normal');
  const [isBold, setIsBold] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isUnderline, setIsUnderline] = useState(false);
  const [history, setHistory] = useState([{ text, fontSize, fontStyle, isBold, fontFamily, isUnderline }]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleMouseDown = (e) => {
    if (e.target.tagName !== 'TEXTAREA') {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    addToHistory({ text: newText, fontSize, fontStyle, isBold, fontFamily, isUnderline });
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    addToHistory({ text, fontSize: newSize, fontStyle, isBold, fontFamily, isUnderline });
  };

  const incrementFontSize = () => {
    const newSize = fontSize + 1;
    handleFontSizeChange(newSize);
  };

  const decrementFontSize = () => {
    const newSize = Math.max(8, fontSize - 1);
    handleFontSizeChange(newSize);
  };

  const handleFontStyleChange = (newStyle) => {
    setFontStyle(newStyle);
    addToHistory({ text, fontSize, fontStyle: newStyle, isBold, fontFamily, isUnderline });
  };

  const handleBoldToggle = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    addToHistory({ text, fontSize, fontStyle, isBold: newBold, fontFamily, isUnderline });
  };

  const handleFontFamilyChange = (newFont) => {
    setFontFamily(newFont);
    addToHistory({ text, fontSize, fontStyle, isBold, fontFamily: newFont, isUnderline });
  };

  const handleUnderlineToggle = () => {
    const newUnderline = !isUnderline;
    setIsUnderline(newUnderline);
    addToHistory({ text, fontSize, fontStyle, isBold, fontFamily, isUnderline: newUnderline });
  };

  const addToHistory = (state) => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const undo = () => {
    if (currentStep > 0) {
      const prevState = history[currentStep - 1];
      setText(prevState.text);
      setFontSize(prevState.fontSize);
      setFontStyle(prevState.fontStyle);
      setIsBold(prevState.isBold);
      setFontFamily(prevState.fontFamily);
      setIsUnderline(prevState.isUnderline);
      setCurrentStep(currentStep - 1);
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      const nextState = history[currentStep + 1];
      setText(nextState.text);
      setFontSize(nextState.fontSize);
      setFontStyle(nextState.fontStyle);
      setIsBold(nextState.isBold);
      setFontFamily(nextState.fontFamily);
      setIsUnderline(nextState.isUnderline);
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div className="h-screen w-full bg-gray-100 relative">
      <div className="w-full bg-white p-4 shadow-md flex justify-center gap-4">
        <button
          onClick={undo}
          disabled={currentStep === 0}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          disabled={currentStep === history.length - 1}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      <div
        className="absolute bg-white p-4 rounded shadow-lg cursor-move"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          fontSize: `${fontSize}px`,
          fontStyle: fontStyle,
          fontWeight: isBold ? 'bold' : 'normal',
          fontFamily: fontFamily,
          textDecoration: isUnderline ? 'underline' : 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        <textarea
          value={text}
          onChange={handleTextChange}
          className="w-48 h-32 p-2 border rounded resize-none cursor-text"
          style={{
            fontSize: `${fontSize}px`,
            fontStyle: fontStyle,
            fontWeight: isBold ? 'bold' : 'normal',
            fontFamily: fontFamily,
            textDecoration: isUnderline ? 'underline' : 'none',
          }}
        />
      </div>

      <div className="fixed bottom-0 w-full bg-white p-4 shadow-md flex justify-center gap-4">
        <div className="flex items-center gap-2 border rounded p-2">
          <Type className="w-4 h-4" />
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="border-none focus:outline-none"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div className="flex items-center gap-2 border rounded p-2">
          <button
            onClick={decrementFontSize}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center">{fontSize}</span>
          <button
            onClick={incrementFontSize}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBoldToggle}
            className={`p-2 rounded hover:bg-gray-100 ${isBold ? 'bg-gray-200' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFontStyleChange(fontStyle === 'italic' ? 'normal' : 'italic')}
            className={`p-2 rounded hover:bg-gray-100 ${fontStyle === 'italic' ? 'bg-gray-200' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={handleUnderlineToggle}
            className={`p-2 rounded hover:bg-gray-100 ${isUnderline ? 'bg-gray-200' : ''}`}
          >
            <u className="w-4 h-4">U</u>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableTextBox;
