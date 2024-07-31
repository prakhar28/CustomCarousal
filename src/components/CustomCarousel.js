import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {useCarousel} from '../hooks/CarouselContext';

const {width, height} = Dimensions.get('window');

const CustomCarousel = () => {
  const {currentStep, setCurrentStep, steps} = useCarousel();
  const translateX = useSharedValue(-width * currentStep);
  const isAnimating = useSharedValue(false);

  const handleNext = () => {
    if (!isAnimating.value && currentStep < steps.length) {
      isAnimating.value = true;
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      translateX.value = withTiming(-width * nextStep, {duration: 500}, () => {
        isAnimating.value = false;
      });
    }
  };

  const handlePrev = () => {
    if (!isAnimating.value && currentStep > 0) {
      isAnimating.value = true;
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      translateX.value = withTiming(-width * prevStep, {duration: 500}, () => {
        isAnimating.value = false;
      });
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (!isAnimating.value) {
        const threshold = 0.3 * width;
        const velocityThreshold = 400;

        if (
          event.translationX < -threshold &&
          event.velocityX < -velocityThreshold &&
          currentStep < steps.length
        ) {
          runOnJS(handleNext)();
        } else if (
          event.translationX > threshold &&
          event.velocityX > velocityThreshold &&
          currentStep > 0
        ) {
          runOnJS(handlePrev)();
        }
      }
    })
    .onEnd(() => {
      translateX.value = withTiming(-width * currentStep, {duration: 500});
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.carouselContainer}>
          <Animated.View
            style={[
              styles.carousel,
              {width: width * (steps.length + 1)},
              animatedStyle,
            ]}>
            {steps.map(({name, key}) => (
              <View key={key} style={styles.step}>
                <Text style={styles.stepText}>{name}</Text>
              </View>
            ))}
            <View style={styles.step}>
              <Text style={styles.stepText}>
                Thank you for finishing all steps
              </Text>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
      {currentStep < steps.length && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isAnimating.value && {opacity: 0.5}]}
            onPress={handleNext}
            disabled={isAnimating.value}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  carouselContainer: {
    width: width,
    height: height - 100, // Adjust height to accommodate the button
    overflow: 'hidden',
  },
  carousel: {
    flexDirection: 'row',
  },
  step: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomCarousel;
