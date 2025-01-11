import React, { useState, useEffect } from "react";
import { db, auth, addDoc, doc, getDoc, setDoc, collection } from '../firebase';
import "./MuseumQuiz.css";
import './Modal.css';
import { useNavigate,  } from "react-router-dom";
import StickyNavbar from './StickyNavbar';

const questionPool = [
  {
    questionText: "In which city is the Nehru Science Centre located?",
    answerOptions: [
      { answerText: "Mumbai", isCorrect: true },
      { answerText: "Delhi", isCorrect: false },
      { answerText: "Bangalore", isCorrect: false },
      { answerText: "Chennai", isCorrect: false },
    ],
  },
  {
    questionText: "Nehru Science Centre is named after which Indian leader?",
    answerOptions: [
      { answerText: "Jawaharlal Nehru", isCorrect: true },
      { answerText: "Indira Gandhi", isCorrect: false },
      { answerText: "Mahatma Gandhi", isCorrect: false },
      { answerText: "Rajiv Gandhi", isCorrect: false },
    ],
  },
  {
    questionText: "In which year was Nehru Science Centre inaugurated?",
    answerOptions: [
      { answerText: "1985", isCorrect: true },
      { answerText: "1975", isCorrect: false },
      { answerText: "1990", isCorrect: false },
      { answerText: "1960", isCorrect: false },
    ],
  },
  {
    questionText: "Which section of Nehru Science Centre focuses on space exploration?",
    answerOptions: [
      { answerText: "Space Odyssey", isCorrect: true },
      { answerText: "Biology Section", isCorrect: false },
      { answerText: "Sound and Light", isCorrect: false },
      { answerText: "History of Computers", isCorrect: false },
    ],
  },
  {
    questionText: "What is the full form of ISRO, India’s space agency?",
    answerOptions: [
      { answerText: "Indian Space Research Organisation", isCorrect: true },
      { answerText: "International Space Research Organisation", isCorrect: false },
      { answerText: "Indian Scientific Research Organisation", isCorrect: false },
      { answerText: "Indian Space Reaction Organisation", isCorrect: false },
    ],
  },
  {
    questionText: "Which Indian satellite was the first to be launched into space?",
    answerOptions: [
      { answerText: "Aryabhata", isCorrect: true },
      { answerText: "INSAT", isCorrect: false },
      { answerText: "Chandrayaan", isCorrect: false },
      { answerText: "Mangalyaan", isCorrect: false },
    ],
  },
  {
    questionText: "Who was the first Indian astronaut to go to space?",
    answerOptions: [
      { answerText: "Rakesh Sharma", isCorrect: true },
      { answerText: "Kalpana Chawla", isCorrect: false },
      { answerText: "Sunita Williams", isCorrect: false },
      { answerText: "Vikram Sarabhai", isCorrect: false },
    ],
  },
  {
    questionText: "What is the force that keeps planets in orbit around the Sun?",
    answerOptions: [
      { answerText: "Gravity", isCorrect: true },
      { answerText: "Magnetism", isCorrect: false },
      { answerText: "Friction", isCorrect: false },
      { answerText: "Nuclear Force", isCorrect: false },
    ],
  },
  {
    questionText: "Which of the following is an exhibit at the Nehru Science Centre?",
    answerOptions: [
      { answerText: "Hall of Science", isCorrect: true },
      { answerText: "Discovery Lab", isCorrect: false },
      { answerText: "Tech Dome", isCorrect: false },
      { answerText: "Innovation Tower", isCorrect: false },
    ],
  },
  {
    questionText: "What is the term for the study of living organisms?",
    answerOptions: [
      { answerText: "Biology", isCorrect: true },
      { answerText: "Geology", isCorrect: false },
      { answerText: "Astronomy", isCorrect: false },
      { answerText: "Physics", isCorrect: false },
    ],
  },
  {
    questionText: "Which planet is known as the 'Red Planet'?",
    answerOptions: [
      { answerText: "Mars", isCorrect: true },
      { answerText: "Jupiter", isCorrect: false },
      { answerText: "Venus", isCorrect: false },
      { answerText: "Saturn", isCorrect: false },
    ],
  },
  {
    questionText: "The speed of light is approximately how many kilometers per second?",
    answerOptions: [
      { answerText: "300,000", isCorrect: true },
      { answerText: "150,000", isCorrect: false },
      { answerText: "1,000,000", isCorrect: false },
      { answerText: "30,000", isCorrect: false },
    ],
  },
  {
    questionText: "What is the chemical symbol for water?",
    answerOptions: [
      { answerText: "H2O", isCorrect: true },
      { answerText: "O2", isCorrect: false },
      { answerText: "CO2", isCorrect: false },
      { answerText: "H2", isCorrect: false },
    ],
  },
  {
    questionText: "Which is the largest planet in our solar system?",
    answerOptions: [
      { answerText: "Jupiter", isCorrect: true },
      { answerText: "Saturn", isCorrect: false },
      { answerText: "Earth", isCorrect: false },
      { answerText: "Mars", isCorrect: false },
    ],
  },
  {
    questionText: "The concept of evolution by natural selection was proposed by which scientist?",
    answerOptions: [
      { answerText: "Charles Darwin", isCorrect: true },
      { answerText: "Isaac Newton", isCorrect: false },
      { answerText: "Albert Einstein", isCorrect: false },
      { answerText: "Gregor Mendel", isCorrect: false },
    ],
  },
  {
    questionText: "Which Indian scientist is known for his work on the scattering of light?",
    answerOptions: [
      { answerText: "C. V. Raman", isCorrect: true },
      { answerText: "Homi Bhabha", isCorrect: false },
      { answerText: "Vikram Sarabhai", isCorrect: false },
      { answerText: "Jagadish Chandra Bose", isCorrect: false },
    ],
  },
  {
    questionText: "Which element has the chemical symbol 'Fe'?",
    answerOptions: [
      { answerText: "Iron", isCorrect: true },
      { answerText: "Gold", isCorrect: false },
      { answerText: "Copper", isCorrect: false },
      { answerText: "Silver", isCorrect: false },
    ],
  },
  {
    questionText: "Who was the first person to step on the moon?",
    answerOptions: [
      { answerText: "Neil Armstrong", isCorrect: true },
      { answerText: "Buzz Aldrin", isCorrect: false },
      { answerText: "Yuri Gagarin", isCorrect: false },
      { answerText: "John Glenn", isCorrect: false },
    ],
  },
  {
    questionText: "Which planet has the most moons?",
    answerOptions: [
      { answerText: "Saturn", isCorrect: true },
      { answerText: "Jupiter", isCorrect: false },
      { answerText: "Neptune", isCorrect: false },
      { answerText: "Uranus", isCorrect: false },
    ],
  },
  {
    questionText: "Who is known as the father of modern physics?",
    answerOptions: [
      { answerText: "Albert Einstein", isCorrect: true },
      { answerText: "Isaac Newton", isCorrect: false },
      { answerText: "Galileo Galilei", isCorrect: false },
      { answerText: "Niels Bohr", isCorrect: false },
    ],
  },
  {
    questionText: "What is the smallest unit of matter?",
    answerOptions: [
      { answerText: "Atom", isCorrect: true },
      { answerText: "Molecule", isCorrect: false },
      { answerText: "Electron", isCorrect: false },
      { answerText: "Proton", isCorrect: false },
    ],
  },
  {
    questionText: "Which scientist developed the theory of relativity?",
    answerOptions: [
      { answerText: "Albert Einstein", isCorrect: true },
      { answerText: "Isaac Newton", isCorrect: false },
      { answerText: "Nikola Tesla", isCorrect: false },
      { answerText: "Marie Curie", isCorrect: false },
    ],
  },
  {
    questionText: "Which element is commonly used in making computer chips?",
    answerOptions: [
      { answerText: "Silicon", isCorrect: true },
      { answerText: "Copper", isCorrect: false },
      { answerText: "Aluminum", isCorrect: false },
      { answerText: "Carbon", isCorrect: false },
    ],
  },
  {
    questionText: "Which of the following is the main gas found in the air we breathe?",
    answerOptions: [
      { answerText: "Nitrogen", isCorrect: true },
      { answerText: "Oxygen", isCorrect: false },
      { answerText: "Carbon Dioxide", isCorrect: false },
      { answerText: "Hydrogen", isCorrect: false },
    ],
  },
  {
    questionText: "Which planet is closest to the Sun?",
    answerOptions: [
      { answerText: "Mercury", isCorrect: true },
      { answerText: "Venus", isCorrect: false },
      { answerText: "Earth", isCorrect: false },
      { answerText: "Mars", isCorrect: false },
    ],
  },
  {
    questionText: "Which Indian scientist is known for his contributions to agricultural science?",
    answerOptions: [
      { answerText: "M. S. Swaminathan", isCorrect: true },
      { answerText: "Vikram Sarabhai", isCorrect: false },
      { answerText: "Homi Bhabha", isCorrect: false },
      { answerText: "C. V. Raman", isCorrect: false },
    ],
  },
  {
    questionText: "What is the name of the first Indian satellite launched into space?",
    answerOptions: [
      { answerText: "Aryabhata", isCorrect: true },
      { answerText: "Rohini", isCorrect: false },
      { answerText: "Chandrayaan", isCorrect: false },
      { answerText: "Bhaskara", isCorrect: false },
    ],
  },
  {
    questionText: "Which Indian scientist is known for inventing the Crescograph, a device for measuring plant growth?",
    answerOptions: [
      { answerText: "Jagadish Chandra Bose", isCorrect: true },
      { answerText: "C. V. Raman", isCorrect: false },
      { answerText: "Homi Bhabha", isCorrect: false },
      { answerText: "Vikram Sarabhai", isCorrect: false },
    ],
  },
  {
    questionText: "Which celestial body is at the center of our solar system?",
    answerOptions: [
      { answerText: "The Sun", isCorrect: true },
      { answerText: "Earth", isCorrect: false },
      { answerText: "Jupiter", isCorrect: false },
      { answerText: "The Moon", isCorrect: false },
    ],
  },
];


export default function MuseumQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [userAnswers, setUserAnswers] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigate = useNavigate();

  // Check if the user has already taken the quiz
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);
        try {
          const userDocRef = doc(db, 'users', user.email);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().quizCompleted) {
            setQuizCompleted(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (quizStarted) {
      const shuffledQuestions = questionPool.sort(() => 0.5 - Math.random());
      setQuestions(shuffledQuestions.slice(0, 10));

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted]);

  useEffect(() => {
    if (timeLeft === 0 && !showScore) {
      setShowScore(true);
      setTimeout(() => {
        setShowCoupon(true);
      }, 2000);
    }
  }, [timeLeft, showScore]);

  const handleAnswerOptionClick = (isCorrect, answerText) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, answerText]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      setTimeout(() => {
        setShowCoupon(true);
      }, 2000);
    }
  };

  const calculateDiscount = () => {
    const discount = (score / 10) * 20;
    return discount.toFixed(0);
  };

  const generateCouponCode = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MUSEUM${calculateDiscount()}${randomString}`;
  };

  const saveCouponToFirestore = async () => {
    if (!userEmail) return;

    const coupon = generateCouponCode();
    setCouponCode(coupon);

    try {
      const userDocRef = doc(db, 'users', userEmail);
      const couponsCollectionRef = collection(userDocRef, 'Coupons');

      await addDoc(couponsCollectionRef, {
        userId: userEmail,
        email: userEmail,
        code: coupon,
        discount: calculateDiscount(),
        isRedeemed: false,
        createdAt: new Date(),
      });

      await setDoc(userDocRef, { quizCompleted: true }, { merge: true });
      console.log('Quiz completed status updated successfully');
    } catch (error) {
      console.error("Error saving coupon or updating quizCompleted: ", error);
    }
  };

  const handleGenerateCoupon = async () => {
    await saveCouponToFirestore();
    setShowCoupon(true);
  };

  const startQuiz = () => {
    if (userEmail.trim() !== '') {
      setQuizStarted(true);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const copyToClipboard = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode)
        .then(() => alert('Coupon code copied to clipboard!'))
        .catch((err) => console.error('Failed to copy coupon code:', err));
    }
  };

  const handleHomeClick = () => {
    navigate('/'); // Redirects to the homepage
  };

  console.log(couponCode);

  return (
    <>
    <StickyNavbar/>
    <div className="quiz-container">
      {quizCompleted ? (
        <div className="quiz-restriction">
          <h2>You have already taken this quiz!</h2>
          <p>Thank you for participating.</p>
          
        </div>
      ) : !quizStarted ? (
        <div className="start-quiz">
          <h2>Enter your email to start the quiz</h2>
          <input 
            type="email" 
            placeholder="Email" 
            value={userEmail} 
            onChange={(e) => setUserEmail(e.target.value)} 
            className="email-input"
          />
          <button onClick={startQuiz} className="start-button">
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          {showCoupon ? (
            <div className="coupon-section">
              <h2>Congratulations!</h2>
              <p style={{fontSize: score > 10 ? '1.5rem' : '1.75rem'}}>You scored {score} out of 10.</p>
              <p style={{fontSize: score > 10 ? '1.5rem' : '1.75rem'}}>You've earned a discount of {calculateDiscount()}%!</p>
              <div className="coupon-code">
                <div className="code-name" style={{fontSize: '2.5rem'}}>{couponCode}</div>
                <button onClick={copyToClipboard} className="copy-button">Copy</button>
              </div>
              <p style={{fontSize: score > 10 ? '1.5rem' : '1.75rem'}}>Use this code at checkout to avail your discount on tickets or merchandise.</p>
            </div>
          ) : showScore ? (
            <div className="score-section">
              <p>You scored {score} out of 10.</p>
              <button onClick={handleGenerateCoupon}>Generate Coupon</button>
            </div>
          ) : (
            <>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div className="timer">Time Left: {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}</div>
              <div className="question-section">
                <div className="question-count">
                  <span>Question {currentQuestion + 1}</span>/10
                </div>
                <div className="question-text">{questions[currentQuestion]?.questionText}</div>
              </div>
              <div className="answer-section">
                {questions[currentQuestion]?.answerOptions.map((answerOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(answerOption.isCorrect, answerOption.answerText)}
                    className="answer-button"
                  >
                    {answerOption.answerText}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
    </>
  );
}
