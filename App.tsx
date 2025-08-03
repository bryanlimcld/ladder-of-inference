import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Play, Pause, Info } from 'lucide-react';

const LadderOfInferenceSimulation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReflectiveLoop, setShowReflectiveLoop] = useState(false);
  const [currentActivity, setCurrentActivity] = useState('ladder');
  const [reflexiveResponses, setReflexiveResponses] = useState({
    alternative: '',
    testAssumption: '',
    differentData: '',
    betterAction: ''
  });
  const [matchingGame, setMatchingGame] = useState({
    selectedStatements: {},
    feedback: {},
    showResults: false,
    score: 0,
    shuffledStatements: []
  });

  const scenarios = [
    {
      title: "Team Meeting Scenario",
      context: "Sarah arrives 10 minutes late to the weekly team meeting",
      steps: [
        {
          level: "Observable Data",
          description: "Sarah walks into the meeting room at 9:10 AM. The meeting was scheduled for 9:00 AM.",
          userThought: "What actually happened that anyone could observe?",
          color: "bg-blue-100 border-blue-300"
        },
        {
          level: "Selected Data",
          description: "I notice Sarah is late. I don't notice she's carrying coffee or that she looks rushed.",
          userThought: "What specific details am I paying attention to?",
          color: "bg-green-100 border-green-300"
        },
        {
          level: "Interpreted Meanings",
          description: "Being late means not caring about the team's time.",
          userThought: "What meaning am I giving to what I observed?",
          color: "bg-yellow-100 border-yellow-300"
        },
        {
          level: "Assumptions",
          description: "Sarah doesn't value our meetings and probably doesn't respect the team.",
          userThought: "What am I assuming about the situation or person?",
          color: "bg-orange-100 border-orange-300"
        },
        {
          level: "Conclusions",
          description: "Sarah is unreliable and unprofessional.",
          userThought: "What conclusions am I drawing?",
          color: "bg-red-100 border-red-300"
        },
        {
          level: "Beliefs",
          description: "People who are consistently late can't be trusted with important responsibilities.",
          userThought: "What beliefs am I forming or reinforcing?",
          color: "bg-purple-100 border-purple-300"
        },
        {
          level: "Actions",
          description: "I decide not to assign Sarah to the new project and speak curtly to her.",
          userThought: "What actions am I taking based on my beliefs?",
          color: "bg-gray-100 border-gray-300"
        }
      ]
    },
    {
      title: "Military Training Exercise",
      context: "During a field exercise, Corporal Jones doesn't follow the planned route and takes a different path",
      steps: [
        {
          level: "Observable Data",
          description: "Corporal Jones deviated from the designated route at checkpoint Alpha and moved through sector 7 instead of sector 5.",
          userThought: "What are the objective, observable facts?",
          color: "bg-blue-100 border-blue-300"
        },
        {
          level: "Selected Data",
          description: "I notice the route deviation but don't observe that Jones is signaling to his team or checking his map frequently.",
          userThought: "What am I choosing to pay attention to?",
          color: "bg-green-100 border-green-300"
        },
        {
          level: "Interpreted Meanings",
          description: "Not following orders means lack of discipline and disregard for the mission plan.",
          userThought: "How am I interpreting what I see and hear?",
          color: "bg-yellow-100 border-yellow-300"
        },
        {
          level: "Assumptions",
          description: "Jones thinks he knows better than his superiors and doesn't respect the chain of command.",
          userThought: "What assumptions am I making?",
          color: "bg-orange-100 border-orange-300"
        },
        {
          level: "Conclusions",
          description: "Corporal Jones is insubordinate and can't be trusted to follow orders in real operations.",
          userThought: "What conclusions am I reaching?",
          color: "bg-red-100 border-red-300"
        },
        {
          level: "Beliefs",
          description: "Soldiers who deviate from plans are unreliable and pose risks to mission success.",
          userThought: "What beliefs am I reinforcing?",
          color: "bg-purple-100 border-purple-300"
        },
        {
          level: "Actions",
          description: "I issue a formal reprimand and exclude Jones from the next leadership opportunity.",
          userThought: "How am I acting based on these beliefs?",
          color: "bg-gray-100 border-gray-300"
        }
      ]
    },
    {
      title: "Equipment Security Scenario",
      context: "Private Smith is found near the armory after hours without proper authorization",
      steps: [
        {
          level: "Observable Data",
          description: "Private Smith was observed at 2100 hours in the vicinity of Building 12 (armory) without an escort or duty assignment.",
          userThought: "What actually happened that anyone could observe?",
          color: "bg-blue-100 border-blue-300"
        },
        {
          level: "Selected Data",
          description: "I notice Smith is alone and it's after hours, but I don't notice he's in PT gear or that he seems surprised to see me.",
          userThought: "What specific details am I paying attention to?",
          color: "bg-green-100 border-green-300"
        },
        {
          level: "Interpreted Meanings",
          description: "Being near the armory after hours without authorization means suspicious intent.",
          userThought: "What meaning am I giving to what I observed?",
          color: "bg-yellow-100 border-yellow-300"
        },
        {
          level: "Assumptions",
          description: "Smith is trying to access equipment illegally or is involved in unauthorized activities.",
          userThought: "What am I assuming about the situation or person?",
          color: "bg-orange-100 border-orange-300"
        },
        {
          level: "Conclusions",
          description: "Private Smith is a security risk and cannot be trusted.",
          userThought: "What conclusions am I drawing?",
          color: "bg-red-100 border-red-300"
        },
        {
          level: "Beliefs",
          description: "Soldiers found in unauthorized areas are likely engaged in misconduct.",
          userThought: "What beliefs am I forming or reinforcing?",
          color: "bg-purple-100 border-purple-300"
        },
        {
          level: "Actions",
          description: "I immediately detain Smith and initiate a formal security investigation.",
          userThought: "What actions am I taking based on my beliefs?",
          color: "bg-gray-100 border-gray-300"
        }
      ]
    }
  ];

  const matchingScenario = {
    title: "Communications Breakdown Scenario",
    context: "During a joint operation, Lieutenant Garcia doesn't respond to radio calls for 15 minutes",
    statements: [
      {
        id: 1,
        text: "Lieutenant Garcia failed to respond to three radio calls between 1430 and 1445 hours.",
        correctLevel: 0,
        level: "Observable Data",
        hint: "This is a factual statement that could be verified by radio logs. What level deals with verifiable facts?"
      },
      {
        id: 2,
        text: "Garcia is ignoring communications because she doesn't want to follow orders.",
        correctLevel: 3,
        level: "Assumptions",
        hint: "This statement assumes knowledge of Garcia's motivations. Which level involves assumptions about intent?"
      },
      {
        id: 3,
        text: "Not responding to radio calls shows disrespect for the chain of command.",
        correctLevel: 2,
        level: "Interpreted Meanings",
        hint: "This assigns a specific meaning to the behavior. Which level involves interpreting what observed actions mean?"
      },
      {
        id: 4,
        text: "Garcia is unreliable and shouldn't be trusted with important missions.",
        correctLevel: 4,
        level: "Conclusions",
        hint: "This is a judgment about Garcia's character based on one incident. Which level involves drawing conclusions about someone?"
      },
      {
        id: 5,
        text: "I focus on the missed radio calls but don't notice that Garcia's unit completed their objective on time.",
        correctLevel: 1,
        level: "Selected Data",
        hint: "This describes choosing to pay attention to some information while ignoring other relevant data. Which level involves data selection?"
      },
      {
        id: 6,
        text: "Officers who don't respond to communications are typically insubordinate and cause mission failures.",
        correctLevel: 5,
        level: "Beliefs",
        hint: "This is a general rule or belief about a category of people. Which level involves broader beliefs about how the world works?"
      },
      {
        id: 7,
        text: "I remove Garcia from her leadership position and recommend disciplinary action.",
        correctLevel: 6,
        level: "Actions",
        hint: "This describes concrete steps taken based on the previous conclusions. Which level involves actual behavior and decisions?"
      }
    ]
  };

  const ladderLevels = [
    "Observable Data",
    "Selected Data", 
    "Interpreted Meanings",
    "Assumptions",
    "Conclusions", 
    "Beliefs",
    "Actions"
  ];

  const currentScenario = scenarios[selectedScenario];

  // Shuffle statements when component mounts or when matching game is reset
  useEffect(() => {
    const shuffled = [...matchingScenario.statements].sort(() => Math.random() - 0.5);
    setMatchingGame(prev => ({
      ...prev,
      shuffledStatements: shuffled
    }));
  }, [currentActivity]);

  const getShuffledStatements = () => {
    return matchingGame.shuffledStatements.length > 0 
      ? matchingGame.shuffledStatements 
      : matchingScenario.statements;
  };

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < currentScenario.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
    } else if (currentStep >= currentScenario.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, currentScenario.steps.length]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleReflexiveChange = (field, value) => {
    setReflexiveResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetReflexiveLoop = () => {
    setReflexiveResponses({
      alternative: '',
      testAssumption: '',
      differentData: '',
      betterAction: ''
    });
  };

  const handleStatementMatch = (statementId, selectedLevel) => {
    setMatchingGame(prev => ({
      ...prev,
      selectedStatements: {
        ...prev.selectedStatements,
        [statementId]: selectedLevel
      }
    }));
  };

  const checkAllAnswers = () => {
    let correctCount = 0;
    const feedback = {};
    
    matchingScenario.statements.forEach(statement => {
      const selectedLevel = matchingGame.selectedStatements[statement.id];
      const isCorrect = statement.correctLevel === parseInt(selectedLevel);
      
      feedback[statement.id] = {
        isCorrect,
        selectedLevel: parseInt(selectedLevel),
        correctLevel: statement.correctLevel,
        hint: statement.hint
      };
      
      if (isCorrect) {
        correctCount++;
      }
    });
    
    setMatchingGame(prev => ({
      ...prev,
      feedback,
      showResults: true,
      score: correctCount
    }));
  };

  const resetMatchingGame = () => {
    const shuffled = [...matchingScenario.statements].sort(() => Math.random() - 0.5);
    setMatchingGame({
      selectedStatements: {},
      feedback: {},
      showResults: false,
      score: 0,
      shuffledStatements: shuffled
    });
  };

  const nextStep = () => {
    if (currentStep < currentScenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Ladder of Inference Simulation</h1>
        <p className="text-gray-600 mb-4">
          Explore how we move from observable data to actions through a series of mental steps. 
          Each rung represents a different level of inference that can lead us away from facts toward assumptions.
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <select 
            value={selectedScenario} 
            onChange={(e) => {
              setSelectedScenario(parseInt(e.target.value));
              reset();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {scenarios.map((scenario, index) => (
              <option key={index} value={index}>{scenario.title}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Info size={16} />
            {showExplanation ? 'Hide' : 'Show'} Guide
          </button>

          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setCurrentActivity('ladder')}
              className={`px-4 py-2 rounded-md ${currentActivity === 'ladder' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600'}`}
            >
              Ladder View
            </button>
            <button
              onClick={() => setCurrentActivity('reflective')}
              className={`px-4 py-2 rounded-md ${currentActivity === 'reflective' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600'}`}
            >
              Reflective Loop
            </button>
            <button
              onClick={() => setCurrentActivity('practice')}
              className={`px-4 py-2 rounded-md ${currentActivity === 'practice' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600'}`}
            >
              Practice Activity
            </button>
            <button
              onClick={() => setCurrentActivity('matching')}
              className={`px-4 py-2 rounded-md ${currentActivity === 'matching' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600'}`}
            >
              Matching Game
            </button>
          </div>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">How to Use This Simulation:</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Use the controls below to step through each level of the ladder</li>
              <li>• Notice how each step builds on the previous one</li>
              <li>• Consider alternative interpretations at each level</li>
              <li>• Reflect on where you might "climb down" to check your assumptions</li>
              <li>• Try different scenarios to see common patterns</li>
            </ul>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Scenario Context:</h3>
          <p className="text-gray-700">{currentScenario.context}</p>
        </div>
      </div>

      {currentActivity === 'ladder' && (
        <>
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown size={16} />
                Previous
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={nextStep}
                disabled={currentStep === currentScenario.steps.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronUp size={16} />
              </button>
              
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col-reverse items-center space-y-reverse space-y-4">
              {currentScenario.steps.map((step, index) => (
                <div
                  key={index}
                  className={`w-full max-w-2xl p-6 border-2 rounded-lg transition-all duration-500 ${
                    index <= currentStep 
                      ? `${step.color} opacity-100 scale-100` 
                      : 'bg-gray-50 border-gray-200 opacity-50 scale-95'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {index + 1}. {step.level}
                    </h3>
                    {index <= currentStep && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  {index <= currentStep && (
                    <div className="space-y-3">
                      <p className="text-gray-700 font-medium">{step.description}</p>
                      <p className="text-sm text-gray-600 italic">{step.userThought}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 transform -translate-x-1/2 -z-10"></div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-3">Reflection Questions:</h3>
            <div className="space-y-2 text-yellow-700">
              <p>• At which step could you have made different choices?</p>
              <p>• What additional data might you have selected or noticed?</p>
              <p>• How might different assumptions lead to different actions?</p>
              <p>• Where in your own life do you notice yourself climbing this ladder quickly?</p>
              <p>• How could you "climb down" the ladder to test your inferences?</p>
            </div>
          </div>
        </>
      )}

      {currentActivity === 'reflective' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">The Reflective Loop</h3>
            <p className="text-indigo-700 mb-4">
              Our beliefs influence what data we select next time. This creates a reinforcing loop that can either 
              strengthen accurate perceptions or reinforce biases. Practice breaking this loop by questioning your beliefs.
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Current Scenario Belief:</h4>
              <p className="text-gray-700 italic">
                "{currentScenario.steps[5].description}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-red-600 mb-2">Reinforcing Loop (Negative)</h4>
                <p className="text-sm text-gray-600 mb-2">How this belief might filter future observations:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• I'll notice more instances of perceived rule-breaking</li>
                  <li>• I'll ignore evidence of good judgment or initiative</li>
                  <li>• I'll interpret neutral actions as problematic</li>
                  <li>• My actions will create defensive responses</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-green-600 mb-2">Breaking the Loop (Positive)</h4>
                <p className="text-sm text-gray-600 mb-2">How to interrupt the reinforcing cycle:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Actively seek disconfirming evidence</li>
                  <li>• Ask questions before making assumptions</li>
                  <li>• Consider alternative explanations</li>
                  <li>• Test beliefs through dialogue and inquiry</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-4">Loop-Breaking Exercise</h3>
            <p className="text-green-700 mb-4">
              Consider the scenario again. How might your initial belief influence future interactions? 
              What could you do differently?
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  Future Situation: You see Corporal Jones consulting a map during the next exercise. 
                  How might your belief filter what you notice?
                </label>
                <textarea
                  value={reflexiveResponses.alternative}
                  onChange={(e) => handleReflexiveChange('alternative', e.target.value)}
                  className="w-full p-3 border border-green-300 rounded-lg"
                  rows={3}
                  placeholder="How might your existing belief influence what you pay attention to?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  What question could you ask to test your assumption about Jones's route deviation?
                </label>
                <textarea
                  value={reflexiveResponses.testAssumption}
                  onChange={(e) => handleReflexiveChange('testAssumption', e.target.value)}
                  className="w-full p-3 border border-green-300 rounded-lg"
                  rows={2}
                  placeholder="What specific question would help you gather more data?"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentActivity === 'practice' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Reflexive Practice Activity</h3>
            <p className="text-purple-700 mb-4">
              Now apply the ladder to your own experience. Think of a recent situation where you made a quick judgment. 
              Walk back down the ladder to examine your reasoning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  1. What was the observable data? (Facts only)
                </label>
                <textarea
                  value={reflexiveResponses.differentData}
                  onChange={(e) => handleReflexiveChange('differentData', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe only what could be recorded on video..."
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  2. What meaning did you give to that data?
                </label>
                <textarea
                  value={reflexiveResponses.betterAction}
                  onChange={(e) => handleReflexiveChange('betterAction', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="What interpretation did you make?"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Alternative Interpretations</h4>
                <p className="text-sm text-gray-600 mb-2">What are 3 other possible meanings for the same data?</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Alternative 1..."
                  />
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Alternative 2..."
                  />
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Alternative 3..."
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Testing Your Assumptions</h4>
                <p className="text-sm text-gray-600 mb-2">How could you gather more data?</p>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="What questions could you ask? What could you observe?"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Reflection Summary</h4>
            <p className="text-blue-700 text-sm">
              After completing this exercise, what did you learn about your own inference patterns? 
              How might you approach similar situations differently in the future?
            </p>
            <textarea
              className="w-full p-3 border border-blue-300 rounded-lg mt-2"
              rows={3}
              placeholder="Your insights and commitments for future situations..."
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={resetReflexiveLoop}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Clear All Responses
            </button>
          </div>
        </div>
      )}

      {currentActivity === 'matching' && (
        <div className="space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">Ladder Matching Challenge</h3>
            <p className="text-teal-700 mb-4">
              <strong>Scenario:</strong> {matchingScenario.context}
            </p>
            <p className="text-teal-700 mb-4">
              Match each statement to the correct level of the Ladder of Inference. 
              You'll receive immediate feedback and hints to guide your learning.
            </p>
            
            {matchingGame.showResults && (
              <div className={`p-4 rounded-lg mb-4 ${
                matchingGame.score === matchingScenario.statements.length 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-yellow-100 border border-yellow-300'
              }`}>
                <h4 className="font-semibold mb-2">
                  Results: {matchingGame.score}/{matchingScenario.statements.length} correct
                </h4>
                {matchingGame.score === matchingScenario.statements.length ? (
                  <p className="text-green-700">Excellent! You've mastered identifying the levels of inference.</p>
                ) : (
                  <p className="text-yellow-700">Good effort! Review the feedback below to improve your understanding.</p>
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Ladder Reference */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Ladder Reference</h4>
              <div className="space-y-2">
                {ladderLevels.map((level, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <span className="font-medium">{level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statements to Match */}
            <div className="lg:col-span-2 space-y-4">
              {getShuffledStatements().map((statement, index) => {
                const feedback = matchingGame.feedback[statement.id];
                const hasAnswer = matchingGame.selectedStatements[statement.id];
                
                return (
                  <div key={statement.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-gray-800 font-medium mb-2">Statement {index + 1}:</p>
                      <p className="text-gray-700 italic">"{statement.text}"</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <label className="text-sm font-medium text-gray-700">Match to level:</label>
                      <select
                        value={matchingGame.selectedStatements[statement.id] || ''}
                        onChange={(e) => handleStatementMatch(statement.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded"
                        disabled={matchingGame.showResults}
                      >
                        <option value="">Select level...</option>
                        {ladderLevels.map((level, index) => (
                          <option key={index} value={index}>{index + 1}. {level}</option>
                        ))}
                      </select>
                    </div>

                    {matchingGame.showResults && feedback && (
                      <div className={`p-3 rounded-lg ${
                        feedback.isCorrect 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {feedback.isCorrect ? (
                          <div className="text-green-700">
                            <p className="font-semibold">✓ Correct!</p>
                            <p className="text-sm">This statement belongs to: <strong>{ladderLevels[feedback.correctLevel]}</strong></p>
                          </div>
                        ) : (
                          <div className="text-red-700">
                            <p className="font-semibold">✗ Not quite right</p>
                            <p className="text-sm mb-2">
                              You selected: <strong>{ladderLevels[feedback.selectedLevel]}</strong><br/>
                              Correct answer: <strong>{ladderLevels[feedback.correctLevel]}</strong>
                            </p>
                            <p className="text-sm bg-red-100 p-2 rounded">
                              <strong>Hint:</strong> {statement.hint}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!matchingGame.showResults ? (
              <button
                onClick={checkAllAnswers}
                disabled={Object.keys(matchingGame.selectedStatements).length < matchingScenario.statements.length}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check All Answers
              </button>
            ) : (
              <button
                onClick={resetMatchingGame}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LadderOfInferenceSimulation;