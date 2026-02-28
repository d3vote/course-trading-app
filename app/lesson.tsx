import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { useAppDispatch } from '@/store/hooks';
import { addGems, addXP, incrementStreak, completeLevel as completeUserLevel } from '@/store/slices/userSlice';

// Mock level data based on type
const getMockLevel = (levelType: string) => {
  switch (levelType) {
    case 'info':
      return {
        id: 1,
        title: 'What is Trading?',
        totalSlides: 4,
        currentSlide: 1,
        slides: [
          {
            id: 1,
            type: 'content',
            title: 'Introduction to Trading',
            content: 'Trading is the act of buying and selling financial instruments like stocks, bonds, or currencies with the goal of making a profit.',
            image: 'trending-up'
          },
          {
            id: 2,
            type: 'content',
            title: 'Why People Trade',
            content: 'People trade to grow their wealth, hedge against risks, or simply participate in the financial markets.',
            image: 'diamond'
          },
          {
            id: 3,
            type: 'content',
            title: 'Types of Trading',
            content: 'There are many types of trading: day trading, swing trading, position trading, and long-term investing.',
            image: 'bar-chart'
          },
          {
            id: 4,
            type: 'completion',
            title: 'Level Complete!',
            content: 'Great job! You now understand the basics of trading. Ready for the next level?',
            gemsEarned: 15
          }
        ]
      };
    case 'quiz':
      return {
        id: 2,
        title: 'Quiz: Market Basics',
        totalSlides: 6,
        currentSlide: 1,
        slides: [
          {
            id: 1,
            type: 'content',
            title: 'Quick Review',
            content: 'Let\'s test what you\'ve learned so far with some multiple choice questions.',
            image: 'bulb'
          },
          {
            id: 2,
            type: 'question',
            title: 'Question 1',
            question: 'What is the main goal of trading?',
            options: [
              { id: 'a', text: 'To lose money', correct: false },
              { id: 'b', text: 'To make a profit', correct: true },
              { id: 'c', text: 'To avoid taxes', correct: false }
            ]
          },
          {
            id: 3,
            type: 'question',
            title: 'Question 2',
            question: 'Which is NOT a type of trading?',
            options: [
              { id: 'a', text: 'Day trading', correct: false },
              { id: 'b', text: 'Swing trading', correct: false },
              { id: 'c', text: 'Sleep trading', correct: true }
            ]
          },
          {
            id: 4,
            type: 'question',
            title: 'Question 3',
            question: 'What do traders buy and sell?',
            options: [
              { id: 'a', text: 'Physical goods only', correct: false },
              { id: 'b', text: 'Financial instruments', correct: true },
              { id: 'c', text: 'Real estate only', correct: false }
            ]
          },
          {
            id: 5,
            type: 'content',
            title: 'Great Job!',
            content: 'You\'ve completed the quiz! Let\'s see how you did.',
            image: 'checkmark-circle'
          },
          {
            id: 6,
            type: 'completion',
            title: 'Quiz Complete!',
            content: 'Excellent work! You\'ve mastered the basics of trading concepts.',
            gemsEarned: 25
          }
        ]
      };
    case 'practice':
      return {
        id: 3,
        title: 'Practice: Chart Reading',
        totalSlides: 4,
        currentSlide: 1,
        slides: [
          {
            id: 1,
            type: 'content',
            title: 'Chart Analysis',
            content: 'Learn to read price charts and identify key patterns that can help you make trading decisions.',
            image: 'analytics'
          },
          {
            id: 2,
            type: 'content',
            title: 'Support & Resistance',
            content: 'Understanding support and resistance levels is crucial for successful trading.',
            image: 'trending-down'
          },
          {
            id: 3,
            type: 'content',
            title: 'Practice Time',
            content: 'Now let\'s practice identifying these patterns on real charts.',
            image: 'target'
          },
          {
            id: 4,
            type: 'completion',
            title: 'Practice Complete!',
            content: 'Great job practicing! You\'re building strong chart reading skills.',
            gemsEarned: 30
          }
        ]
      };
    default:
      return {
        id: 4,
        title: 'Basic Concepts',
        totalSlides: 3,
        currentSlide: 1,
        slides: [
          {
            id: 1,
            type: 'content',
            title: 'Welcome to Trading',
            content: 'Let\'s start with the fundamental concepts of trading.',
            image: 'school'
          },
          {
            id: 2,
            type: 'content',
            title: 'Getting Started',
            content: 'We\'ll guide you through the basics step by step.',
            image: 'play-circle'
          },
          {
            id: 3,
            type: 'completion',
            title: 'Level Complete!',
            content: 'You\'ve completed the introduction! Ready for more?',
            gemsEarned: 10
          }
        ]
      };
  }
};

export default function LessonScreen() {
  const params = useLocalSearchParams();
  const levelType = params.levelType as string || 'info';
  const levelId = parseInt(params.levelId as string);
  const unitId = parseInt(params.unitId as string);
  const bookId = parseInt(params.bookId as string);
  const { completeLevel } = useLearningProgress();
  const dispatch = useAppDispatch();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const mockLesson = getMockLevel(levelType);
  const currentSlide = mockLesson.slides[currentSlideIndex];

  const handleNextSlide = () => {
    if (currentSlide.type === 'question' && !showAnswer) {
      if (!selectedAnswer) {
        Alert.alert('Please select an answer');
        return;
      }
      setShowAnswer(true);
      setTotalQuestions(prev => prev + 1);
      
      const selectedOption = currentSlide.options?.find(opt => opt.id === selectedAnswer);
      if (selectedOption?.correct) {
        setCorrectAnswers(prev => prev + 1);
      }
    } else {
      if (currentSlideIndex < mockLesson.slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
      } else {
        // Level completed
        if (mockLesson.slides[currentSlideIndex].type === 'completion') {
          // Calculate accuracy for quiz levels
          let accuracy = 100;
          if (mockLesson.slides.some(slide => slide.type === 'question')) {
            const totalQuestions = mockLesson.slides.filter(slide => slide.type === 'question').length;
            const correctAnswers = totalQuestions; // For now, assume all correct if they reached completion
            accuracy = Math.round((correctAnswers / totalQuestions) * 100);
          }
          
          // Mark level as completed
          completeLevel(bookId, unitId, levelId);
          
          // Add gems to Redux store
          const gemsEarned = mockLesson.slides[mockLesson.slides.length - 1].gemsEarned || 0;
          dispatch(addGems(gemsEarned));
          
          // Add XP to Redux store (base XP for completing lesson)
          const xpEarned = 25; // Base XP for completing a lesson
          dispatch(addXP(xpEarned));
          
          // Increment streak for completing a lesson
          dispatch(incrementStreak());
          
          // Mark user level as completed in Redux
          dispatch(completeUserLevel());
          
          Alert.alert(
            'Level Complete!',
            `You earned ${gemsEarned} gems and ${xpEarned} XP!\nAccuracy: ${accuracy}%`,
            [{ 
              text: 'Continue', 
              onPress: () => {
                // Navigate back to unit screen
                router.push({
                  pathname: '/unit',
                  params: { unitId: unitId.toString(), bookId: bookId.toString() }
                });
              } 
            }]
          );
        }
      }
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const progress = ((currentSlideIndex + 1) / mockLesson.slides.length) * 100;

  const renderContentSlide = () => (
    <View style={styles.slideContainer}>
      <View style={styles.slideImage}>
        <Ionicons name={currentSlide.image as any} size={80} color={Colors.tint} />
      </View>
      <ThemedText style={styles.slideTitle}>{currentSlide.title}</ThemedText>
      <ThemedText style={styles.slideContent}>{currentSlide.content}</ThemedText>
    </View>
  );

  const renderQuestionSlide = () => (
    <View style={styles.slideContainer}>
      <ThemedText style={styles.slideTitle}>{currentSlide.title}</ThemedText>
      <ThemedText style={styles.questionText}>{currentSlide.question}</ThemedText>
      
      <View style={styles.optionsContainer}>
        {currentSlide.options?.map((option) => {
          let optionStyle = styles.optionButton;
          let textStyle = styles.optionText;
          
          if (showAnswer) {
            if (option.correct) {
              optionStyle = [styles.optionButton, styles.correctOption] as any;
              textStyle = [styles.optionText, styles.correctOptionText] as any;
            } else if (selectedAnswer === option.id) {
              optionStyle = [styles.optionButton, styles.incorrectOption] as any;
              textStyle = [styles.optionText, styles.incorrectOptionText] as any;
            }
          } else if (selectedAnswer === option.id) {
            optionStyle = [styles.optionButton, styles.selectedOption] as any;
            textStyle = [styles.optionText, styles.selectedOptionText] as any;
          }
          
          return (
            <TouchableOpacity
              key={option.id}
              style={optionStyle}
              onPress={() => handleAnswerSelect(option.id)}
              disabled={showAnswer}
            >
              <ThemedText style={textStyle}>{option.text}</ThemedText>
              {showAnswer && option.correct && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              )}
              {showAnswer && selectedAnswer === option.id && !option.correct && (
                <Ionicons name="close-circle" size={20} color={Colors.error} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      
      {showAnswer && (
        <View style={styles.feedbackContainer}>
          <ThemedText style={styles.feedbackText}>
            {selectedAnswer === currentSlide.options?.find(opt => opt.correct)?.id 
              ? 'Correct! Well done!' 
              : 'Not quite right. Keep learning!'
            }
          </ThemedText>
        </View>
      )}
    </View>
  );

  const renderCompletionSlide = () => (
    <View style={styles.slideContainer}>
      <View style={styles.completionIcon}>
        <Ionicons name="trophy" size={80} color={Colors.accent} />
      </View>
      <ThemedText style={styles.slideTitle}>{currentSlide.title}</ThemedText>
      <ThemedText style={styles.slideContent}>{currentSlide.content}</ThemedText>
      
      <View style={styles.gemsEarnedContainer}>
        <Ionicons name="diamond" size={24} color={Colors.tint} />
        <ThemedText style={styles.gemsEarnedText}>+{currentSlide.gemsEarned} gems earned!</ThemedText>
      </View>
    </View>
  );

  const renderSlide = () => {
    switch (currentSlide.type) {
      case 'content':
        return renderContentSlide();
      case 'question':
        return renderQuestionSlide();
      case 'completion':
        return renderCompletionSlide();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.tint} />
          </TouchableOpacity>
          <ThemedText style={styles.lessonTitle}>{mockLesson.title}</ThemedText>
          <View style={styles.progressIndicator}>
            <ThemedText style={styles.progressText}>
              {currentSlideIndex + 1}/{mockLesson.slides.length}
            </ThemedText>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSlide()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!selectedAnswer && currentSlide.type === 'question') && styles.disabledButton
          ]} 
          onPress={handleNextSlide}
          disabled={currentSlide.type === 'question' && !selectedAnswer}
        >
          <ThemedText style={styles.nextButtonText}>
            {currentSlide.type === 'question' && !showAnswer ? 'Check Answer' : 
             currentSlideIndex === mockLesson.slides.length - 1 ? 'Finish' : 'Continue'}
          </ThemedText>
          <Ionicons 
            name={currentSlideIndex === mockLesson.slides.length - 1 ? 'checkmark' : 'arrow-forward'} 
            size={20} 
            color={Colors.background} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  progressIndicator: {
    padding: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.tint,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  slideImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  slideEmoji: {
    fontSize: 60,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  slideContent: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.darkGray,
    marginBottom: 30,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  selectedOption: {
    backgroundColor: Colors.tint,
  },
  selectedOptionText: {
    color: Colors.background,
    fontWeight: '600',
  },
  correctOption: {
    backgroundColor: Colors.success,
  },
  correctOptionText: {
    color: Colors.background,
    fontWeight: '600',
  },
  incorrectOption: {
    backgroundColor: Colors.error,
  },
  incorrectOptionText: {
    color: Colors.background,
    fontWeight: '600',
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.lightYellow,
    borderRadius: 12,
  },
  feedbackText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  completionIcon: {
    marginBottom: 30,
  },
  gemsEarnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  gemsEarnedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.tint,
    marginLeft: 10,
  },
  navigation: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
  },
  nextButton: {
    backgroundColor: Colors.tint,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.darkGray,
  },
  nextButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 