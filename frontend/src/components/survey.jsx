import React, { useState, useEffect } from 'react';
import client from './sanityClient';
import LottieOption from './lottieOption'; // Import the LottieOption component

const Questionnaire = ({ setAnimationVisible, setGraphVisible}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0); // Start at 0 (no question shown)
  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
  });
  const [error, setError] = useState(''); // Track validation errors
  const [fadeState, setFadeState] = useState('fade-in'); // Track fading state
  const [showCompleteButton, setShowCompleteButton] = useState(false); // Track whether to show the COMPLETE button

  const handleOptionChange = (value) => {
    setAnswers({ ...answers, [`question${currentQuestion}`]: value });
    setError(''); // Clear error when an option is selected
  };

  const handleNext = () => {
    // Check if the current question is answered
    if (!answers[`question${currentQuestion}`]) {
      setError('None of these options fit? Mail: eozalp@massart.edu');
      return;
    }

    // Trigger the fade-out effect before showing the next question
    setFadeState('fade-out');

    // After the fade-out effect completes, move to the next question
    setTimeout(() => {
      setFadeState('fade-in'); // Trigger fade-in effect for the next question
      if (currentQuestion < 5) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmit();
      }
    }, 500); // Match the duration of fade-out animation
  };

  const handleSubmit = async () => {
    // Check if the last question is answered
    if (!answers[`question${currentQuestion}`]) {
      setError('None of these options fit? Mail: eozalp@massart.edu');
      return;
    }

    // Show the COMPLETE button immediately
    setShowCompleteButton(true);
    setGraphVisible(true); // Make Graph visible
    setAnimationVisible(true);

    try {
      await client.create({
        _type: 'userResponse',
        ...answers,
        submittedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving response to Sanity:', error);
    }
  };

  const handleComplete = () => {
    // Reset the form and start over
    setShowCompleteButton(false);
    setGraphVisible(false); // Hide Graph
    setCurrentQuestion(0);
    setAnswers({
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      question5: '',
    });
    setAnimationVisible(false);
  };

  const handleStart = () => {
    setFadeState('fade-out');

    setTimeout(() => {
      setCurrentQuestion(1);
      setAnimationVisible(false); // Reset animation when starting over
      setFadeState('fade-in');
    }, 500); // Match fade-out duration
  };

  const questions = [
    {
      question: 'How do you usually travel?',
      options: [
        { label: 'Public Transportation, walking or biking.', value: 'A' },
        { label: 'Electric or hybrid vehicle', value: 'B' },
        { label: 'Gas-powered vehicle', value: 'C' },
      ],
    },
    {
      question: 'What best describes your diet?',
      options: [
        { label: 'Moderate consumption of meat or dairy.', value: 'A' },
        { label: 'Regular consumption of meat and dairy.', value: 'B' },
        { label: 'Plant-based or vegetarian.', value: 'C' },
      ],
    },
    {
      question: 'You and energy use at home...',
      options: [
        { label: 'I try to reduce energy use mainly to save on bills.', value: 'A' },
        { label: 'I rarely think about energy efficiency.', value: 'B' },
        { label: 'I make a point to turn off the lights, and utilities.', value: 'C' },
      ],
    },
    {
      question: 'How do you think about shopping?',
      options: [
        { label: 'Often buy second-hand or eco-friendly products.', value: 'A' },
        { label: 'Occasionally choose sustainable brands.', value: 'B' },
        { label: 'I preferably shop what I like without worry', value: 'C' },
      ],
    },
    {
      question: 'How often do you connect with nature?',
      options: [
        { label: 'I frequently visit parks and reserves.', value: 'A' },
        { label: "I don't avoid nature if it's on my path.", value: 'B' },
        { label: "I never thought of spending time in nature.", value: 'C' },
      ],
    },
  ];

  if (showCompleteButton) {
    return (
      <div className="survey-section-wrapper">
      <div className="survey-section">
        <div className="surveyStart">
          <button className="begin-button2" onClick={handleComplete}>
            <h4>COMPLETE</h4>
          </button>
        </div></div>
      </div>
    );
  }

  if (currentQuestion === 0) {
    return (
      <div className={`survey-section ${fadeState}`}>
        <div className="surveyStart">
          <h3 className="begin-title1">Welcome</h3>
          <h1 className="begin-title2">Butterfly Habits</h1>
          <button className="begin-button" onClick={handleStart}>
            <h4>BEGIN</h4>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`survey-section ${fadeState}`}>
      <div className="questionnaire">
        <div className="question-section">
          <div className="number-part">
            <h2>{currentQuestion}.</h2>
          </div>
          <div className="question-part">
            <h4 style={{ marginLeft: '8px' }}>
              {questions[currentQuestion - 1].question}
            </h4>
          </div>
        </div>

        {error && (
          <div>
            <p><strong>None of these options fit?</strong></p>
            <p style={{ color: 'red', paddingBottom: '8px' }}>Mail: eozalp@massart.edu</p>
          </div>
        )}

        {questions[currentQuestion - 1].options.map((option, index) => (
          <div className="input-part-inside" key={`${currentQuestion}-${option.value}`}>
            <LottieOption
              onClick={() => handleOptionChange(option.value)}
              selected={answers[`question${currentQuestion}`] === option.value}
            />
            <label><p>{option.label}</p></label> {/* Wrap label in <p> */} {/* Display the user-friendly label */}
          </div>
        ))}

        <button className="begin-button2" onClick={handleNext}>
          {currentQuestion < 5 ? <h4>NEXT</h4> : <h4>SUBMIT RESULTS</h4>}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;