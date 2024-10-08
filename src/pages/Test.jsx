import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import YellowComma from '../assets/images/YellowComma.png';
import questions from '../data/question';
import Arrow from '../components/ui/Arrow';
import { submitResult } from '../services/result';

export default function Test() {
  const navigate = useNavigate();
  const [result, setResult] = useState({});
  const [currIndex, setCurrIndex] = useState(0);
  const [isDisabled, setIsDisable] = useState(false);
  const questionId = questions[currIndex].id;

  const goBack = (value) => {
    if (currIndex === 0) return;

    const newResult = { ...result };
    delete newResult[value];
    setResult(newResult);
    setCurrIndex((curr) => curr - 1);
  };

  const onSelectAnswer = async (value) => {
    const yourAnswer = { ...result, [questionId]: value };
    setResult(yourAnswer);

    if (currIndex < questions.length - 1) {
      setCurrIndex((prev) => prev + 1);
    } else {
      setIsDisable(true);
      const finalResult = { ...yourAnswer };
      try {
        const mbtiType = await submitResult(finalResult);
        setTimeout(() => {
          navigate(`/result/${mbtiType}`);
        }, 1000);
      } catch (error) {
        console.error('Error navigating to result:', error);
      }
    }
  };

  const progressPercentage = ((currIndex + 1) / questions.length) * 100;

  return (
    <section className='flex flex-col justify-between p-5 bg-background min-h-screen-minus-header'>
      <div className='space-y-5'>
        <div className='flex items-center justify-between'>
          <button
            type='button'
            disabled={isDisabled}
            onClick={() => goBack(questionId)}
            className={`text-sm cursor-pointer disabled:cursor-auto ${currIndex === 0 ? 'pointer-events-none' : ''}`}
          >
            <div className={`flex items-center gap-2 ${currIndex === 0 ? 'invisible' : 'visible'}`}>
              <Arrow />
              <span>뒤로</span>
            </div>
          </button>
          <div className='text-2xl font-jua'>창업 멤버 유형 테스트</div>
          <span className='text-sm'>{currIndex + 1}/12</span>
        </div>
        <div className='w-full h-2 bg-white rounded-lg shadow-custom'>
          <div className='h-2 rounded-lg bg-primary' style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>
      <article className='w-full px-2 py-5 bg-white mt-7 rounded-3xl shadow-custom'>
        <div className='relative'>
          <img src={YellowComma} alt='comma' className='absolute -top-11 right-2' />
          <h4 className='p-5 text-lg font-bold text-center'>{questions[currIndex].question}</h4>
        </div>
        <div className='p-5 space-y-3'>
          {questions[currIndex].example.map(({ answer, value }) => (
            <button
              key={value}
              disabled={isDisabled}
              className='w-full p-5 transition-all border rounded-2xl border-answer bg-background'
              type='button'
              onClick={() => onSelectAnswer(value)}
            >
              {answer}
            </button>
          ))}
        </div>
      </article>
      <div />
    </section>
  );
}
